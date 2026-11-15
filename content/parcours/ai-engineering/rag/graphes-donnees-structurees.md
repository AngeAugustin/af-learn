---
title: Données structurées, text-to-SQL et GraphRAG
description: "Répondre aux questions qui ne se résolvent pas par similarité de texte : interroger une base avec text-to-SQL en toute sécurité, router entre sources, et exploiter des graphes de connaissances avec GraphRAG."
duration: 60
objectives:
  - Identifier les questions que la recherche vectorielle ne sait pas traiter
  - Construire un assistant text-to-SQL sûr (schéma, exemples, validation, droits en lecture seule)
  - Router une question vers la recherche documentaire, SQL ou les deux
  - Expliquer le principe des graphes de connaissances et de GraphRAG (recherche locale et globale)
  - Choisir l'approche adaptée et l'évaluer
---

# Les limites de la recherche par similarité

Le RAG des chapitres précédents retrouve des **passages de texte proches** de la question. Il excelle pour « Quelle est la procédure de remboursement ? ». Mais il échoue sur d'autres types de questions :

| Question | Pourquoi la recherche vectorielle échoue | Approche adaptée |
|---|---|---|
| « Quel a été le chiffre d'affaires par région au T3 ? » | La réponse se **calcule** à partir de milliers de lignes | **Text-to-SQL** |
| « Combien de tickets critiques sont ouverts depuis plus de 7 jours ? » | Filtrage et comptage exacts | **Text-to-SQL** |
| « Quels fournisseurs sont liés aux projets en retard de l'équipe Nord ? » | Il faut **suivre des relations** entre entités | **Graphe de connaissances** |
| « Quels sont les grands thèmes de ces 2 000 rapports d'incidents ? » | Question **globale** sur tout le corpus, pas sur un passage | **GraphRAG** (recherche globale) ou synthèse par lots |

# Text-to-SQL

Le **text-to-SQL** consiste à faire **générer une requête SQL** par le modèle à partir d'une question en langage naturel, à l'**exécuter**, puis à formuler la réponse à partir du résultat.

```diagram
type: flow
title: Un assistant text-to-SQL
steps:
  - title: Question
    text: « Chiffre d'affaires par région au T3 ? »
  - title: Contexte
    text: Schéma utile, descriptions métier, exemples
  - title: Génération
    text: Le modèle écrit la requête SQL
  - title: Validation
    text: Lecture seule, tables autorisées, limite de lignes
    tone: amber
  - title: Exécution
    text: Avec un compte en lecture seule ; erreur renvoyée au modèle si besoin
  - title: Réponse
    text: Chiffres, requête affichée pour vérification
    tone: teal
```

## Donner le bon contexte

Le modèle ne connaît pas votre base. La qualité dépend surtout de ce qu'on lui fournit :

- le **schéma** des tables utiles (pas forcément toute la base : sur des centaines de tables, on sélectionne d'abord les tables pertinentes, par recherche sur leurs descriptions) ;
- des **descriptions métier** des colonnes : `ca_ht` = « chiffre d'affaires hors taxes en euros », `statut = 3` = « commande annulée » ;
- quelques **exemples** question → SQL validés, représentatifs des requêtes fréquentes ;
- les **règles** de calcul de l'entreprise (« le chiffre d'affaires exclut les commandes annulées et les avoirs »).

```python
SCHEMA = """
Table commandes(id, client_id, date_commande DATE, region TEXT, montant_ht NUMERIC, statut TEXT)
  -- statut ∈ {'payee', 'annulee', 'remboursee'} ; le CA ne compte que les commandes 'payee'
Table clients(id, nom, segment TEXT)  -- segment ∈ {'PME', 'ETI', 'GE'}
"""

EXEMPLES = """
Q : Chiffre d'affaires total en 2026 ?
SQL : SELECT SUM(montant_ht) FROM commandes WHERE statut = 'payee' AND date_commande >= '2026-01-01' AND date_commande < '2027-01-01';
"""

PROMPT = f"""Tu traduis des questions en une seule requête SQL PostgreSQL en lecture seule.
<schema>{SCHEMA}</schema>
<exemples>{EXEMPLES}</exemples>
Règles : uniquement SELECT ; utilise les règles métier du schéma ; si la question est ambiguë
ou hors du schéma, réponds AMBIGU suivi de la question à poser à l'utilisateur.
Réponds uniquement avec la requête."""
```

## La sécurité avant tout

Exécuter du SQL généré par un modèle est **risqué** : erreur, injection via la question, requête qui lit des données interdites ou qui surcharge la base.

- **Compte en lecture seule**, limité aux **tables et colonnes autorisées** (vues dédiées, sans données sensibles inutiles), c'est la protection principale, au niveau de la base.
- **Sécurité au niveau des lignes** si les utilisateurs n'ont pas tous les mêmes droits (un commercial ne voit que ses clients).
- **Validation** de la requête avant exécution : une seule instruction, `SELECT` uniquement, tables autorisées. Utilisez un **analyseur SQL** (par exemple `sqlglot` en Python) plutôt que des expressions régulières.
- **Limites** : délai maximal d'exécution, nombre maximal de lignes renvoyées.
- **Transparence** : afficher la requête exécutée, pour que l'utilisateur puisse la vérifier.

```python
import sqlglot
from sqlglot import exp

TABLES_AUTORISEES = {"commandes", "clients"}


def valider_sql(requete: str) -> str:
    instructions = sqlglot.parse(requete, read="postgres")
    if len(instructions) != 1 or not isinstance(instructions[0], exp.Select):
        raise ValueError("Une seule requête SELECT est autorisée.")
    tables = {t.name.lower() for t in instructions[0].find_all(exp.Table)}
    if not tables <= TABLES_AUTORISEES:
        raise ValueError(f"Tables non autorisées : {tables - TABLES_AUTORISEES}")
    return instructions[0].limit(1000).sql(dialect="postgres")  # plafond de lignes
```

> [!IMPORTANT]
> La validation applicative est un **complément**, pas la protection principale. Même si elle laisse passer une requête inattendue, le **compte en lecture seule** et les **vues restreintes** garantissent que le modèle ne peut ni modifier ni lire ce qui est interdit.

## La couche sémantique

Pour les usages analytiques importants, plutôt que de laisser le modèle écrire du SQL libre sur les tables brutes, on lui fait interroger une **couche sémantique** : des **métriques** et **dimensions** définies une fois par les équipes data (« chiffre d'affaires », « marge », « par région », « par mois »). Le modèle choisit les métriques et les filtres ; l'outil génère un SQL **validé et cohérent** avec les tableaux de bord de l'entreprise. Moins de liberté, beaucoup plus de fiabilité.

## Évaluer

On évalue le text-to-SQL par **exactitude d'exécution** : la requête générée renvoie-t-elle le **même résultat** que la requête de référence sur la base de test ? Comparer le texte SQL lui-même n'a pas de sens (plusieurs requêtes correctes sont possibles). Incluez des questions **ambiguës** et **hors schéma**, où la bonne réponse est de demander une précision ou de refuser.

# Router entre les sources

Une application réelle combine souvent documents **et** données. Un **routeur** (module 6, pattern de routage) décide, pour chaque question, de la ou des sources à interroger :

```diagram
type: decision
title: Quelle source pour quelle question ?
nodes:
  - question: La réponse demande-t-elle un calcul, un comptage ou un filtrage exact sur des données ?
    yes: Text-to-SQL (ou couche sémantique)
    no: Question suivante
  - question: La réponse dépend-elle de relations entre entités sur plusieurs niveaux ?
    yes: Graphe de connaissances
    no: Recherche documentaire (RAG)
```

Dans une architecture agentique, on donne simplement les différentes sources comme **outils** (`rechercher_documents`, `interroger_ventes`, `explorer_graphe`) avec des descriptions claires, et l'agent choisit, c'est le **RAG agentique** du chapitre 4.

# Graphes de connaissances

Un **graphe de connaissances** représente l'information sous forme d'**entités** (nœuds : personnes, entreprises, projets, produits) reliées par des **relations** typées (arêtes : « travaille sur », « fournit », « dépend de »). Il est stocké dans une base de graphes (Neo4j, par exemple, interrogé en Cypher) ou dans des tables relationnelles.

```text
(Équipe Nord)-[:PILOTE]->(Projet Atlas)-[:DEPEND_DE]->(Fournisseur Acier SA)
(Projet Atlas)-[:A_POUR_STATUT]->(En retard)
```

La question « Quels fournisseurs sont liés aux projets en retard de l'équipe Nord ? » devient un **parcours** du graphe, précis et explicable : là où une recherche vectorielle renverrait des passages épars sans garantie de complétude.

On peut construire le graphe à partir de bases existantes (référentiels, CRM) ou **l'extraire de textes** avec un LLM (extraction d'entités et de relations), puis l'interroger soit par des requêtes générées (*text-to-Cypher*, avec les mêmes précautions que le text-to-SQL), soit par des outils de parcours.

# GraphRAG

**GraphRAG**, présenté par Microsoft Research en 2024, combine graphes et LLM pour répondre notamment aux **questions globales** sur un corpus (« Quels sont les thèmes principaux ? »), que le RAG classique traite mal puisqu'aucun passage isolé ne contient la réponse.

```diagram
type: pipeline
title: Le principe de GraphRAG
lanes:
  - title: Indexation
    steps:
      - title: Extraction
        text: Un LLM extrait entités et relations de chaque passage
      - title: Graphe
        text: Fusion en un graphe de connaissances
      - title: Communautés
        text: Regroupement des entités fortement liées, sur plusieurs niveaux
      - title: Résumés
        text: Un LLM résume chaque communauté
  - title: Requête
    steps:
      - title: Recherche locale
        text: "Questions sur une entité : voisinage dans le graphe + passages"
      - title: Recherche globale
        text: "Questions sur tout le corpus : synthèse des résumés de communautés"
```

Les arbitrages :

- **Coût d'indexation élevé** : de nombreux appels au LLM pour extraire entités, relations et résumés, à refaire (au moins en partie) quand le corpus change.
- **Gain réel** sur les questions globales et relationnelles ; **peu d'intérêt** pour les questions factuelles simples, où un bon RAG hybride suffit.
- **Qualité de l'extraction** : entités dupliquées (« ACME », « Acme SA »), relations erronées, il faut une étape de **résolution d'entités** et un contrôle qualité.

> [!TIP]
> Avant de construire un GraphRAG, vérifiez que vos utilisateurs posent réellement des questions **globales** ou **relationnelles**, en analysant les questions réelles ou prévues. Pour un usage occasionnel de synthèse, une simple approche **map-reduce** (résumer des lots de documents puis synthétiser les résumés) peut suffire.

# Exercices

## Exercice 1 : Choisir l'approche

Indiquez l'approche la plus adaptée (RAG documentaire, text-to-SQL, graphe, GraphRAG global) :

1. « Quelle est la politique de télétravail pour les nouveaux arrivants ? »
2. « Combien de contrats arrivent à échéance le mois prochain, par type ? »
3. « Quels sous-traitants interviennent à la fois sur le site de Lyon et sur un projet classé confidentiel ? »
4. « Quels sont les principaux motifs de mécontentement dans les 10 000 avis clients de l'année ? »

<details>
<summary>Voir la solution</summary>

1. **RAG documentaire** : réponse contenue dans un passage d'un document.
2. **Text-to-SQL** : comptage et regroupement exacts sur des données structurées.
3. **Graphe de connaissances** : relations entre entités (sous-traitant, site, projet, classification).
4. **GraphRAG en recherche globale**, ou une approche **map-reduce** de synthèse ; la recherche par similarité ne peut pas donner une vue d'ensemble.

</details>

## Exercice 2 : Sécuriser un text-to-SQL

Une première version d'assistant text-to-SQL se connecte avec le compte applicatif (droits en écriture sur toutes les tables) et vérifie seulement que la requête commence par `SELECT`. Listez les risques et les corrections.

<details>
<summary>Voir la solution</summary>

Risques :
- `SELECT ...; DROP TABLE commandes;` (instructions multiples) ou des fonctions aux effets de bord passent le contrôle par préfixe ;
- lecture de tables sensibles (salaires, mots de passe hachés, données personnelles) ;
- requêtes très coûteuses (jointures sans condition) qui saturent la base ;
- un utilisateur qui accède aux données d'autres périmètres.

Corrections :
- **compte dédié en lecture seule**, limité à des **vues** ne contenant que les colonnes utiles ;
- **sécurité au niveau des lignes** selon l'utilisateur ;
- **analyse syntaxique** (une seule instruction, `SELECT`, tables autorisées) ;
- **délai maximal** et **limite de lignes** ;
- exécution sur un **réplica** de lecture plutôt que sur la base principale ;
- affichage de la requête et journalisation.

</details>

## Exercice 3 : Évaluer un text-to-SQL

Pourquoi comparer le texte de la requête générée à une requête de référence est-il une mauvaise métrique ? Proposez un protocole d'évaluation.

<details>
<summary>Voir la solution</summary>

Plusieurs requêtes différentes sont équivalentes (ordre des conditions, alias, `JOIN` ou sous-requête, `BETWEEN` ou deux comparaisons). Une comparaison textuelle déclarerait faux des résultats corrects.

Protocole : une **base de test** représentative ; 50 à 100 questions avec leur **requête de référence** validée par l'équipe data ; métrique d'**exactitude d'exécution** (mêmes résultats, à l'ordre près si l'ordre n'est pas demandé) ; des questions **ambiguës** et **hors schéma** où la bonne réponse est de demander une précision ou de refuser ; suivi du taux de requêtes **rejetées** par la validation et du taux d'**erreurs** d'exécution.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Données structurées et GraphRAG
center: "Toutes les questions ne se résolvent pas par similarité : calculer, parcourir ou synthétiser."
points:
  - icon: database
    title: Text-to-SQL
    text: Schéma, descriptions métier, exemples, et la requête affichée à l'utilisateur.
  - icon: lock
    title: Sécurité SQL
    text: Compte en lecture seule, vues restreintes, analyse syntaxique, limites.
  - icon: compass
    title: Router
    text: Calcul exact → SQL ; relations → graphe ; contenu → RAG documentaire.
  - icon: network
    title: Graphes
    text: Entités et relations typées, parcours précis et explicables.
  - icon: layers
    title: GraphRAG
    text: "Communautés et résumés pour les questions globales : indexation coûteuse."
  - icon: test
    title: Évaluer
    text: Exactitude d'exécution, questions ambiguës et hors schéma.
pitfall: Croire que la validation de la requête protège la base, alors que le compte utilisé a des droits en écriture.
remember: La couche sémantique et les droits en base valent mieux qu'un prompt pour fiabiliser le text-to-SQL.
```
