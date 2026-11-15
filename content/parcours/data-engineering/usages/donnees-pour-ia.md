---
title: Données pour le machine learning et l'IA générative
description: "Ce que les équipes de machine learning et d'IA attendent de la plateforme de données : jeux d'entraînement sans fuite du futur, feature stores, pipelines de documents et d'embeddings pour la recherche sémantique, et modèles de langage utilisés comme étape de pipeline."
duration: 65
objectives:
  - Construire un jeu d'entraînement reproductible avec une jointure « point-in-time »
  - Expliquer le rôle d'un feature store et le décalage entre entraînement et production
  - Concevoir un pipeline de documents et d'embeddings incrémental pour un système RAG
  - Utiliser un modèle de langage dans un pipeline de données de façon fiable et maîtrisée
---

# Le Data Engineer, fournisseur de l'IA

Un modèle de machine learning ou un assistant d'IA générative n'est jamais meilleur que ses données. La plupart des échecs en production viennent moins de l'algorithme que des **données** : fuite d'information du futur dans l'entraînement, caractéristiques calculées différemment en production, documents périmés dans la base de connaissances, données personnelles qui se retrouvent dans un index.

Le Data Engineer intervient sur trois chantiers :

```diagram
type: compare
title: Trois chantiers de données pour l'IA
columns:
  - title: Machine learning classique
    tone: blue
    items:
      - Jeux d'entraînement reproductibles
      - Caractéristiques (features) cohérentes entre entraînement et production
      - Feature store, suivi des versions de données
  - title: IA générative et RAG
    tone: violet
    items:
      - Ingestion et découpage de documents
      - Calcul et mise à jour incrémentale des embeddings
      - Droits d'accès et suppression propagés jusqu'à l'index
  - title: Modèles dans les pipelines
    tone: teal
    items:
      - Classifier, extraire, résumer à grande échelle
      - Sorties structurées et validées
      - Coût, cache, évaluation
```

# Des jeux d'entraînement sans fuite du futur

Un modèle de résiliation apprend à prédire, **à une date donnée**, si un client va partir dans les 30 jours. Chaque exemple d'entraînement doit donc contenir les caractéristiques **telles qu'elles étaient connues à cette date**, et rien de plus.

La **fuite de données** (*data leakage*) survient quand une information postérieure à la date de prédiction se glisse dans les caractéristiques. Exemple : on joint la table `clients` **actuelle**, où le champ `nb_tickets_support` inclut les tickets ouverts… pendant la procédure de résiliation. Le modèle obtient des scores excellents à l'entraînement, puis s'effondre en production où cette information n'existe pas encore.

## La jointure « point-in-time »

La solution est une **jointure à date** (*point-in-time join*, ou jointure *as of*) : pour chaque exemple, on prend la dernière valeur de chaque caractéristique connue **avant** la date de l'exemple.

```sql
-- Pour chaque exemple (client, date_reference), la dernière valeur connue AVANT cette date
SELECT
    e.client_id,
    e.date_reference,
    e.a_resilie_30j,                  -- l'étiquette, observée APRÈS date_reference
    f.nb_commandes_90j,
    f.panier_moyen_90j
FROM exemples e
ASOF JOIN features_client f           -- DuckDB, Snowflake (MATCH_CONDITION), ClickHouse…
  ON e.client_id = f.client_id
 AND f.calcule_le <= e.date_reference;
```

Sans `ASOF JOIN`, on obtient le même résultat avec une fonction de fenêtrage :

```sql
SELECT * FROM (
    SELECT e.*, f.nb_commandes_90j, f.panier_moyen_90j,
           row_number() OVER (PARTITION BY e.client_id, e.date_reference
                              ORDER BY f.calcule_le DESC) AS rang
    FROM exemples e
    JOIN features_client f
      ON f.client_id = e.client_id AND f.calcule_le <= e.date_reference
) WHERE rang = 1;
```

> [!IMPORTANT]
> Cette jointure n'est possible que si l'on a **historisé** les caractéristiques (une ligne par client et par date de calcul) ou les tables sources (snapshots, dimensions SCD de type 2, tables lakehouse avec voyage dans le temps). Une plateforme qui n'écrase que l'état courant ne permet pas de construire des jeux d'entraînement honnêtes.

## Reproductibilité

Une équipe de machine learning doit pouvoir répondre à : « avec quelles données exactes ce modèle a-t-il été entraîné ? ». Pour cela :

- **figer** le jeu d'entraînement : écrire une table ou des fichiers datés et immuables, plutôt que de relancer une requête sur des tables qui changent ;
- ou **référencer une version** des tables lakehouse (snapshot Iceberg, version Delta) dans les métadonnées de l'entraînement ;
- **séparer dans le temps** entraînement et validation (entraîner sur janvier à octobre, valider sur novembre), et non au hasard, pour ne pas mélanger passé et futur.

# Le feature store

Les mêmes caractéristiques servent à l'**entraînement** (des millions de lignes historiques, en lot) et à l'**inférence en production** (une ligne, en quelques millisecondes, au moment où l'utilisateur agit). Si elles sont calculées par deux codes différents (SQL dans l'entrepôt d'un côté, Python dans l'application de l'autre), elles divergent : c'est le **décalage entraînement-production** (*training-serving skew*), une cause majeure de modèles décevants.

Un **feature store** (Feast en open source, ou les offres de Databricks, Vertex AI, SageMaker, Tecton) centralise :

```diagram
type: layers
title: Les composants d'un feature store
layers:
  - title: Définitions
    text: Chaque caractéristique est définie une fois, avec son entité (client), sa source et sa fraîcheur
  - title: Magasin hors ligne
    text: "Historique complet dans le lakehouse ou l'entrepôt : jeux d'entraînement par jointure point-in-time"
  - title: Magasin en ligne
    text: "Dernière valeur par entité dans une base rapide (Redis, DynamoDB) : inférence en millisecondes"
  - title: Matérialisation
    text: Des pipelines alimentent les deux magasins à partir des mêmes définitions
```

> [!TIP]
> Un feature store n'est pas indispensable au début. Des tables de caractéristiques historisées dans dbt, une jointure point-in-time documentée et une synchronisation vers une base de service suffisent souvent. Le besoin apparaît quand plusieurs modèles partagent des caractéristiques et que l'inférence en temps réel se généralise.

# Pipelines de documents pour le RAG

Un assistant fondé sur la **génération augmentée par la recherche** (RAG) répond à partir d'une base de connaissances : documentation, contrats, tickets, pages internes. La qualité de ses réponses dépend directement du pipeline qui prépare ces documents.

```diagram
type: flow
title: Un pipeline d'indexation incrémental
steps:
  - title: Collecter
    text: Sources, métadonnées, droits d'accès, date de mise à jour
    tone: blue
  - title: Extraire
    text: Texte, tableaux et structure depuis PDF, HTML, Office
    tone: blue
  - title: Découper
    text: Morceaux cohérents (sections, paragraphes) avec contexte
    tone: amber
  - title: Vectoriser
    text: Embeddings calculés uniquement pour ce qui a changé
    tone: amber
  - title: Indexer
    text: Base vectorielle ou hybride, avec métadonnées filtrables
    tone: teal
```

Ce qui distingue un pipeline de production d'un prototype :

- **l'incrémental** : on calcule un hachage du contenu de chaque document et de chaque morceau ; seuls les morceaux nouveaux ou modifiés sont revectorisés. Recalculer tous les embeddings chaque nuit coûte cher et ralentit tout ;
- **la propagation des suppressions** : un document supprimé ou retiré à la source doit disparaître de l'index, sinon l'assistant cite un contrat résilié ou une procédure obsolète ;
- **les droits d'accès** : chaque morceau porte les groupes autorisés à le voir, et la recherche **filtre** sur l'utilisateur qui pose la question. Un index commun sans filtre est une fuite de données ;
- **les métadonnées** : source, titre, date, langue, type de document, pour filtrer, citer et dater les réponses ;
- **le versionnement du modèle d'embeddings** : des vecteurs calculés par deux modèles différents ne sont pas comparables. Changer de modèle impose de **réindexer** entièrement, idéalement dans un nouvel index, puis de basculer.

```python
import hashlib

def morceaux_a_vectoriser(morceaux, index_existant: dict[str, str]):
    """Ne renvoie que les morceaux nouveaux ou modifiés (comparaison par hachage du contenu)."""
    for m in morceaux:
        empreinte = hashlib.sha256(m.texte.encode("utf-8")).hexdigest()
        if index_existant.get(m.id) != empreinte:
            yield m, empreinte

# Les identifiants présents dans l'index mais absents de la source sont à supprimer de l'index
a_supprimer = set(index_existant) - {m.id for m in morceaux}
```

> [!WARNING]
> Les données personnelles et confidentielles suivent les documents jusque dans l'index vectoriel et dans les réponses de l'assistant. Classifiez les sources avant indexation, excluez ou masquez ce qui ne doit pas y être, et intégrez l'index dans la procédure d'effacement RGPD.

# Le modèle de langage comme étape de pipeline

Les modèles de langage sont devenus un outil de transformation à part entière : classer des tickets de support, extraire des champs de factures PDF, détecter la langue et le sentiment d'avis clients, normaliser des adresses ou des intitulés de postes.

```python
from pydantic import BaseModel, Field
from typing import Literal

class ClassementTicket(BaseModel):
    categorie: Literal["facturation", "livraison", "produit", "compte", "autre"]
    urgence: Literal["basse", "normale", "haute"]
    resume: str = Field(max_length=200)

def classer(ticket: str) -> ClassementTicket | None:
    reponse = client_llm.generer(
        modele="modele-economique-v3",          # version épinglée
        instructions=PROMPT_CLASSEMENT_V4,      # prompt versionné dans le dépôt
        entree=ticket,
        schema=ClassementTicket,                # sortie structurée
        temperature=0,
    )
    try:
        return ClassementTicket.model_validate_json(reponse)
    except ValueError:
        return None                             # va en quarantaine, pas dans la table finale
```

Les règles d'un usage fiable dans un pipeline :

- **sorties structurées** validées par un schéma ; ce qui ne valide pas part en **quarantaine** ;
- **version du modèle et du prompt** enregistrées avec chaque résultat, pour savoir comment une ligne a été produite ;
- **cache par hachage** de l'entrée (et du prompt, et du modèle) : on ne repaie pas deux fois la même classification, et un rejeu reste idempotent ;
- **traitement par lots** (API batch des fournisseurs, souvent deux fois moins chères) quand la latence n'importe pas ;
- **évaluation** sur un échantillon étiqueté avant chaque changement de modèle ou de prompt, et contrôle d'échantillons en continu ;
- **budget** : estimer le coût (nombre de lignes × tokens par ligne × prix) **avant** de lancer un traitement sur 10 millions de lignes.

> [!NOTE]
> Un modèle de langage n'est pas toujours la bonne réponse : une expression régulière, une table de correspondance ou un petit modèle de classification entraîné sont souvent plus rapides, moins chers et plus prévisibles. Réservez le modèle de langage aux cas où la règle explicite est impossible à écrire.

# Exercices

## Exercice 1 : Le modèle trop beau

Un modèle de détection de résiliation obtient une AUC de 0,98 à l'entraînement, puis de 0,61 en production. Le jeu d'entraînement joint la table `clients` actuelle (avec `nb_tickets_support`, `date_derniere_connexion`, `statut_abonnement`) à une liste de clients résiliés ou non l'an dernier. Diagnostiquez et corrigez.

<details>
<summary>Voir la solution</summary>

C'est une **fuite de données** : la table actuelle contient des informations **postérieures** à la date de prédiction. `statut_abonnement` peut valoir « résilié », `date_derniere_connexion` est ancienne pour les partants, `nb_tickets_support` inclut les tickets liés à la résiliation. Le modèle « triche » à l'entraînement.

Correction :

1. Définir pour chaque exemple une **date de référence** et une étiquette observée **après** cette date.
2. Calculer les caractéristiques à partir de sources **historisées** (snapshots, SCD 2, tables de caractéristiques datées) et les joindre avec une **jointure point-in-time** (`calcule_le <= date_reference`).
3. Exclure les colonnes qui sont des conséquences de l'étiquette (`statut_abonnement`).
4. Valider sur une période **postérieure** à l'entraînement.

</details>

## Exercice 2 : L'index qui se souvient

Un assistant interne répond à partir de 50 000 documents. Les utilisateurs signalent qu'il cite une procédure supprimée il y a trois mois et qu'un stagiaire a obtenu un extrait d'un document RH confidentiel. Le pipeline actuel ajoute chaque nuit les nouveaux documents à l'index. Que corrigez-vous ?

<details>
<summary>Voir la solution</summary>

- **Suppressions** : comparer les identifiants de l'index à ceux présents à la source et supprimer de l'index ceux qui ont disparu ; traiter aussi les documents modifiés (hachage du contenu, remplacement des morceaux).
- **Droits d'accès** : stocker sur chaque morceau les groupes autorisés (repris de la source), et **filtrer** chaque recherche selon l'utilisateur. Réindexer immédiatement les documents RH avec leurs droits.
- **Contrôle** : un test qui vérifie le nombre de documents de l'index par rapport à la source, et un audit des sources classées confidentielles.

</details>

## Exercice 3 : Classer un million de tickets

On vous demande de classer 1 million de tickets historiques avec un modèle de langage, puis les 3 000 nouveaux tickets quotidiens. Proposez une conception.

<details>
<summary>Voir la solution</summary>

1. **Évaluer d'abord** : constituer 300 tickets étiquetés à la main, mesurer plusieurs modèles et prompts, choisir le moins cher qui atteint la qualité requise.
2. **Estimer le coût** : 1 million × tokens moyens × prix, en utilisant l'**API batch** pour l'historique.
3. **Sortie structurée** validée par un schéma (catégories fermées), quarantaine pour les échecs.
4. **Cache** par hachage (texte + version du prompt + modèle) : un rejeu ne coûte rien.
5. **Traçabilité** : stocker la version du modèle et du prompt avec chaque classification.
6. Pour le quotidien : un traitement incrémental orchestré, avec un échantillon vérifié chaque semaine pour détecter une dérive.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Données pour le machine learning et l'IA
center: Les modèles valent ce que valent leurs données ; historiser, ne pas tricher avec le futur, propager droits et suppressions.
points:
  - icon: clock
    title: Point-in-time
    text: Chaque exemple ne voit que ce qui était connu à sa date ; il faut historiser.
  - icon: database
    title: Feature store
    text: Mêmes définitions hors ligne et en ligne, contre le décalage entraînement-production.
  - icon: file
    title: Documents
    text: Extraire, découper, vectoriser seulement ce qui a changé.
  - icon: lock
    title: Droits et suppressions
    text: Filtrer par utilisateur, retirer de l'index ce qui disparaît de la source.
  - icon: sparkles
    title: Modèle dans le pipeline
    text: Sortie structurée, versions tracées, cache, lots, évaluation.
  - icon: money
    title: Budget
    text: Estimer le coût avant de lancer un traitement massif.
pitfall: Joindre la table clients actuelle pour entraîner un modèle, et mesurer une performance qui n'existe pas.
remember: Un jeu d'entraînement honnête ne contient que le passé de chaque exemple.
```
