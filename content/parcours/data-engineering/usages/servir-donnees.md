---
title: "Servir les données : BI, couche sémantique, reverse ETL et API"
description: "La dernière étape du cycle de vie : mettre les données à disposition des analystes, des tableaux de bord, des outils métier et des applications, avec des définitions uniques, des performances maîtrisées et des engagements clairs."
duration: 60
objectives:
  - Choisir le bon mode de mise à disposition selon le consommateur
  - Définir des indicateurs une seule fois grâce à une couche sémantique
  - Renvoyer des données vers les outils métier avec le reverse ETL
  - Exposer des données à une application avec des performances et des garanties adaptées
---

# La dernière étape, celle qui crée la valeur

Ingestion, stockage, transformation : tout cela ne vaut que si quelqu'un **utilise** les données pour décider ou agir. La mise à disposition (*serving*) est l'étape où la plateforme rencontre ses utilisateurs, et c'est souvent là que la confiance se gagne ou se perd : deux tableaux de bord qui affichent deux chiffres d'affaires différents suffisent à discréditer des mois de travail.

```diagram
type: compare
title: Qui consomme les données, et comment ?
columns:
  - title: Analyse et pilotage
    tone: blue
    items:
      - Tableaux de bord, rapports, exploration
      - "Outils de BI : Looker, Power BI, Tableau, Metabase, Superset"
      - "Latence acceptable : secondes"
      - "Enjeu : définitions cohérentes"
  - title: Opérations métier
    tone: amber
    items:
      - Le CRM, l'outil marketing, le support
      - Reverse ETL vers Salesforce, HubSpot, Brevo…
      - "Fraîcheur : de l'heure à la minute"
      - "Enjeu : fiabilité des synchronisations"
  - title: Applications et produits
    tone: teal
    items:
      - Une fonctionnalité affiche un indicateur à l'utilisateur
      - API, cache, base de service rapide
      - "Latence : millisecondes, forte concurrence"
      - "Enjeu : performances et disponibilité"
  - title: Science des données et IA
    tone: violet
    items:
      - Jeux d'entraînement, caractéristiques, documents
      - Accès direct aux tables du lakehouse
      - Reproductibilité des extractions
      - Voir le chapitre suivant
```

# La BI et le libre-service

Les outils de BI se connectent à l'entrepôt ou au moteur SQL du lakehouse et génèrent des requêtes. Pour qu'ils fonctionnent bien :

- **exposer la couche gold**, jamais le bronze ni le staging : des tables documentées, nommées pour le métier, avec des descriptions de colonnes ;
- **maîtriser les performances** : tables pré-agrégées ou vues matérialisées pour les tableaux de bord très consultés, partitionnement et clustering sur les filtres habituels, cache de l'outil de BI ;
- **maîtriser les coûts** : un tableau de bord ouvert par 300 personnes chaque matin, avec 15 graphiques sans cache, lance 4 500 requêtes ;
- **gérer les accès** : un compte de service par outil, des rôles en lecture seule, la sécurité au niveau des lignes appliquée dans l'entrepôt plutôt que dans chaque tableau de bord.

> [!WARNING]
> Le « libre-service » sans cadre produit une multitude de tableaux de bord qui calculent chacun « le chiffre d'affaires » à leur façon : avec ou sans taxes, avec ou sans remboursements, en date de commande ou de paiement. Le problème n'est pas l'outil, c'est l'absence de **définitions partagées**.

# La couche sémantique

Une **couche sémantique** (ou couche de métriques) définit **une seule fois**, dans du code versionné, les indicateurs et les dimensions par lesquelles on peut les analyser. Tous les consommateurs (outils de BI, notebooks, API, assistants conversationnels) l'interrogent au lieu d'écrire leur propre SQL.

```yaml
# Exemple avec le Semantic Layer de dbt (MetricFlow)
semantic_models:
  - name: commandes
    model: ref('fait_commandes')
    defaults:
      agg_time_dimension: commande_le
    entities:
      - name: commande
        type: primary
        expr: commande_id
      - name: client
        type: foreign
        expr: client_id
    dimensions:
      - name: commande_le
        type: time
        type_params:
          time_granularity: day
      - name: canal
        type: categorical
    measures:
      - name: ca_net
        agg: sum
        expr: montant_ht - montant_rembourse
      - name: nb_commandes
        agg: count_distinct
        expr: commande_id

metrics:
  - name: chiffre_affaires_net
    label: Chiffre d'affaires net (HT, remboursements déduits)
    type: simple
    type_params:
      measure: ca_net
  - name: nombre_commandes
    label: Nombre de commandes
    type: simple
    type_params:
      measure: nb_commandes
  - name: panier_moyen
    label: Panier moyen
    type: ratio
    type_params:
      numerator: chiffre_affaires_net
      denominator: nombre_commandes
```

Un utilisateur demande « le panier moyen par canal et par mois » : la couche sémantique **génère** le SQL correct, avec les bonnes jointures et la bonne agrégation.

> [!IMPORTANT]
> Les ratios sont un piège classique : la **moyenne des paniers moyens** de chaque jour n'est pas le panier moyen du mois. Une couche sémantique calcule le ratio à partir des sommes au bon niveau d'agrégation, là où un tableau de bord bricolé fait la moyenne des moyennes.

Les principales solutions : le **Semantic Layer de dbt** (MetricFlow), **Cube**, **LookML** de Looker, les modèles sémantiques de Power BI, et les vues sémantiques proposées par les entrepôts (Snowflake, Databricks). La couche sémantique est aussi la meilleure base pour les **assistants qui répondent en langage naturel** : le modèle choisit une métrique et des dimensions définies, au lieu d'inventer du SQL.

# Le reverse ETL

Le **reverse ETL** fait le chemin inverse de l'ingestion : il renvoie des données calculées dans l'entrepôt vers les **outils opérationnels**. Par exemple, synchroniser chaque heure vers le CRM le score de risque de résiliation, le segment et la valeur vie client de chaque client, pour que les commerciaux les voient dans leur outil habituel.

```diagram
type: flow
title: Le reverse ETL
steps:
  - title: Sources
    text: Application, paiements, support
    tone: blue
  - title: Entrepôt
    text: "Modèles gold : segment, score, valeur vie client"
    tone: teal
  - title: Synchronisation
    text: Calcul des différences, envoi par API, gestion des erreurs
    tone: amber
  - title: Outils métier
    text: CRM, marketing, support, publicité
    tone: violet
```

Ce qu'un bon pipeline de reverse ETL fait (outils dédiés comme Hightouch ou Census, ou code maison) :

- **n'envoyer que les différences** depuis la dernière synchronisation, pour respecter les quotas des API ;
- **faire correspondre les identifiants** (l'identifiant interne du client et son identifiant dans le CRM) ;
- **gérer les erreurs ligne par ligne** (un e-mail invalide ne doit pas bloquer les 10 000 autres) et les relances ;
- **respecter le consentement** : ne pas pousser vers un outil marketing un client qui s'y est opposé.

> [!WARNING]
> Avec le reverse ETL, une erreur de modèle n'affiche plus seulement un mauvais chiffre dans un tableau de bord : elle **déclenche des actions** (un e-mail envoyé à toute la base, un client mal segmenté appelé par un commercial). Les modèles synchronisés méritent des tests bloquants, un contrôle des volumes avant envoi (« 98 % des clients ont changé de segment : on n'envoie pas ») et un responsable identifié.

# Servir une application

Quand une application affiche un indicateur à ses utilisateurs (« vos ventes de la semaine », un tableau de bord intégré dans un produit SaaS), les exigences changent : **latence en millisecondes**, **milliers de requêtes simultanées**, **disponibilité** de niveau production.

Un entrepôt analytique n'est pas fait pour cela : chaque requête a un coût, une latence de l'ordre de la seconde, et une concurrence limitée. Les options :

| Approche | Principe | Quand l'utiliser |
|---|---|---|
| **Base de service** | Le pipeline précalcule les résultats et les charge dans PostgreSQL, Redis ou DynamoDB, indexés par la clé de lecture | Requêtes connues à l'avance, très forte concurrence |
| **Base analytique temps réel** | ClickHouse, Apache Druid, Apache Pinot interrogés directement | Agrégations interactives sur des événements frais, forte concurrence |
| **API de données** | Un service (FastAPI, GraphQL) devant l'une des bases précédentes | Toujours : il cache la source, applique droits, quotas et versionnement |
| **Cache** | Résultats mis en cache avec une durée de vie | Mêmes requêtes répétées, fraîcheur relâchée |

```python
# Une API de données minimale : lecture d'agrégats précalculés, jamais l'entrepôt en direct
from fastapi import FastAPI, HTTPException, Depends
import asyncpg

app = FastAPI()

@app.get("/v1/marchands/{marchand_id}/ventes-hebdo")
async def ventes_hebdo(marchand_id: str, utilisateur=Depends(utilisateur_courant)):
    if marchand_id not in utilisateur.marchands_autorises:
        raise HTTPException(status_code=403)
    lignes = await pool.fetch(
        """SELECT semaine, ca, nb_commandes, calcule_le
           FROM service.ventes_hebdo_par_marchand
           WHERE marchand_id = $1 ORDER BY semaine DESC LIMIT 12""",
        marchand_id,
    )
    return {"donnees": [dict(l) for l in lignes], "fraicheur": lignes[0]["calcule_le"] if lignes else None}
```

> [!TIP]
> Exposez la **fraîcheur** des données (`calcule_le`) dans la réponse et dans l'interface. « Données à jour au 2 mars, 6 h » évite des tickets de support et rend explicite l'engagement du pipeline.

# Des engagements explicites

Mettre des données à disposition, c'est prendre des engagements. Pour chaque jeu de données servi, formalisez au minimum :

- le **responsable** (une personne ou une équipe joignable) ;
- la **fraîcheur** garantie (« mise à jour avant 7 h chaque jour ouvré ») et la **disponibilité** de l'accès ;
- la **définition** de chaque colonne et indicateur, dans le catalogue ;
- la **politique de changement** : comment les consommateurs sont prévenus avant une modification cassante, et combien de temps l'ancienne version reste disponible ;
- la **classification** des données (personnelles, confidentielles) et les accès autorisés.

Ces engagements rejoignent les **contrats de données** et les **produits de données** abordés dans le chapitre sur l'organisation.

# Exercices

## Exercice 1 : Trois chiffres d'affaires

Le comité de direction reçoit trois chiffres d'affaires différents pour février : 1,24 M€ (tableau de bord finance), 1,31 M€ (marketing) et 1,19 M€ (export d'un analyste). Comment diagnostiquer et éviter que cela se reproduise ?

<details>
<summary>Voir la solution</summary>

Diagnostic : comparer les définitions (TTC ou HT, remboursements déduits ou non, date de commande ou de paiement, inclusion des commandes test ou internes, fuseau horaire de la coupure du mois). Chaque écart s'explique en général par une ou deux de ces différences.

Prévention :

1. Décider avec la finance d'une **définition officielle** (par exemple « chiffre d'affaires net HT, remboursements déduits, en date de paiement, fuseau Europe/Paris »).
2. La coder **une seule fois** dans une couche sémantique ou un modèle gold certifié.
3. Faire pointer tous les tableaux de bord vers cette métrique, signaler les autres comme non certifiés, et documenter la définition dans le catalogue.

</details>

## Exercice 2 : Le segment qui part en vrille

Chaque heure, un reverse ETL pousse le segment de chaque client vers l'outil marketing, qui déclenche des campagnes automatiques. Un bug dans un modèle dbt classe 95 % des clients en « inactifs » et déclenche une campagne de réactivation vers toute la base. Quelles protections auraient évité cela ?

<details>
<summary>Voir la solution</summary>

- **Tests bloquants** sur le modèle synchronisé (valeurs acceptées, distribution des segments comparée à la veille) : le pipeline s'arrête avant la synchronisation.
- **Garde-fou de volume** dans la synchronisation : si plus de X % des lignes changent, on suspend l'envoi et on alerte.
- **Fraîcheur et dépendances** : la synchronisation ne part que si toutes les étapes amont ont réussi.
- Un **responsable** identifié et un mode « simulation » (calcul des différences sans envoi) pour les changements de modèle.

</details>

## Exercice 3 : L'indicateur dans le produit

Une plateforme SaaS veut afficher à chacun de ses 20 000 marchands ses ventes des 12 dernières semaines, directement dans l'application. L'équipe propose d'interroger BigQuery à chaque affichage de page. Votre avis et votre proposition ?

<details>
<summary>Voir la solution</summary>

Mauvaise idée : latence de l'ordre de la seconde, concurrence limitée, coût facturé à chaque affichage, et entrepôt exposé à la charge de production.

Proposition : un modèle dbt calcule `ventes_hebdo_par_marchand` dans l'entrepôt ; le pipeline le charge après chaque exécution dans une **base de service** (PostgreSQL indexé sur `marchand_id`) ; une **API de données** lit cette base, vérifie que l'utilisateur a accès au marchand demandé et renvoie les données avec leur date de calcul. Si l'on veut de l'interactif en quasi temps réel, une base analytique temps réel (ClickHouse, Pinot) est l'alternative.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Servir les données
center: Chaque consommateur a ses exigences ; une définition unique par indicateur, et des engagements explicites.
points:
  - icon: chart
    title: BI
    text: Exposer le gold documenté, pré-agréger, maîtriser coûts et accès.
  - icon: book
    title: Couche sémantique
    text: Métriques définies une fois, en code ; ratios calculés au bon niveau.
  - icon: loop
    title: Reverse ETL
    text: Renvoyer les données vers les outils métier, avec garde-fous de volume.
  - icon: server
    title: Servir une application
    text: Base de service ou base temps réel derrière une API, jamais l'entrepôt en direct.
  - icon: clock
    title: Fraîcheur visible
    text: Afficher la date de calcul évite tickets et malentendus.
  - icon: users
    title: Engagements
    text: Responsable, fraîcheur, définitions, politique de changement, accès.
pitfall: Laisser chaque tableau de bord calculer « le chiffre d'affaires » à sa façon.
remember: La confiance se gagne à l'étape où les données sont servies.
```
