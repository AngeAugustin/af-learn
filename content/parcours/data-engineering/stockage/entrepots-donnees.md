---
title: Les entrepôts de données analytiques
description: Fonctionnement des entrepôts en colonnes (BigQuery, Snowflake, Redshift, ClickHouse, DuckDB), partitionnement et clustering, modèles de coût et choix d'une solution.
duration: 50
objectives:
  - Expliquer l'architecture d'un entrepôt analytique moderne
  - Utiliser partitionnement et clustering pour réduire les données lues
  - Comprendre les modèles de facturation et maîtriser les coûts
  - Choisir une solution adaptée au contexte
---

# Qu'est-ce qu'un entrepôt analytique ?

Un **entrepôt de données** (*data warehouse*) est une base de données conçue pour l'**analytique** : peu d'écritures concurrentes, mais des requêtes qui parcourent et agrègent des millions ou des milliards de lignes. Trois caractéristiques techniques le distinguent d'une base transactionnelle :

1. **Stockage en colonnes**, compressé (comme Parquet, chapitre 1 de ce module).
2. **Exécution vectorisée** : les opérations portent sur des blocs de valeurs à la fois plutôt que ligne par ligne, ce qui exploite bien les processeurs modernes.
3. **Traitement massivement parallèle** (*MPP*) : une requête est découpée et exécutée simultanément sur de nombreux cœurs, voire de nombreuses machines.

## La séparation du stockage et du calcul

Les entrepôts cloud modernes **séparent** le stockage (données sur un stockage objet géré par le fournisseur) et le calcul (des ressources allouées à la demande).

```diagram
type: layers
title: Architecture d'un entrepôt cloud moderne
layers:
  - title: Services
    text: Authentification, optimiseur, métadonnées, cache des résultats
  - title: Calcul
    text: Ressources élastiques, ajoutées ou supprimées selon la charge
  - title: Stockage
    text: Données en colonnes compressées sur stockage objet, payées au volume
```

Conséquences : on peut faire grandir le stockage sans payer plus de calcul, isoler des charges différentes (les traitements nocturnes n'ont pas d'impact sur les tableaux de bord) et suspendre le calcul quand personne ne s'en sert.

# Les principales solutions

| Solution | Modèle | À retenir |
|---|---|---|
| **Google BigQuery** | Sans serveur | Facturation à la demande au volume de données lu, ou capacité réservée ; aucun cluster à gérer |
| **Snowflake** | Multi-cloud | Entrepôts virtuels (*virtual warehouses*) de calcul dimensionnables, facturés au temps d'utilisation |
| **Amazon Redshift** | AWS | Clusters provisionnés ou mode serverless ; intégré à l'écosystème AWS |
| **Databricks SQL** | Lakehouse | SQL sur des tables Delta Lake (et Iceberg) du lakehouse |
| **ClickHouse** | Open source ou cloud | Très rapide pour l'analytique en temps réel sur des événements |
| **DuckDB** | Embarqué | Une seule machine, sans serveur ; idéal pour volumes modestes, tests et analyses locales |
| **PostgreSQL** | Open source | Suffisant pour un entrepôt de quelques dizaines de gigaoctets, avec de bons index |

> [!TIP]
> Ne surdimensionnez pas : beaucoup d'entreprises ont moins de données qu'elles ne le pensent. Pour quelques dizaines de gigaoctets, PostgreSQL ou DuckDB suffisent souvent, avec une fraction du coût et de la complexité.

# Lire moins pour payer moins

## Le partitionnement

Comme dans un data lake, on **partitionne** une grande table, le plus souvent par date. Exemple BigQuery :

```sql
CREATE TABLE analytics.evenements
(
    evenement_id   STRING,
    utilisateur_id STRING,
    type           STRING,
    horodatage     TIMESTAMP,
    proprietes     JSON
)
PARTITION BY DATE(horodatage)
CLUSTER BY utilisateur_id, type
OPTIONS (require_partition_filter = TRUE);
```

`require_partition_filter` **refuse** les requêtes qui n'ont pas de filtre sur la date : une protection simple contre les requêtes qui parcourraient des années de données par erreur.

## Le clustering

Le **clustering** (ou clé de tri) range les données à l'intérieur des partitions selon une ou plusieurs colonnes. Les blocs de stockage ont alors des plages de valeurs étroites, et un filtre `WHERE utilisateur_id = 'u_123'` permet de **sauter** la plupart des blocs. Snowflake découpe automatiquement les tables en **micro-partitions** avec des statistiques ; on peut définir une **clé de clustering** sur les très grandes tables. Redshift utilise des **clés de tri** (*sort keys*).

```diagram
type: flow
title: Ce qui réduit les données lues par une requête
steps:
  - title: Colonnes utiles
    text: Pas de SELECT *
    tone: teal
  - title: Partitions
    text: Filtre sur la colonne de partition
    tone: teal
  - title: Clustering
    text: Saut de blocs grâce au tri
    tone: teal
  - title: Agrégats précalculés
    text: Tables ou vues matérialisées
    tone: amber
```

## Les pièges de coût

> [!WARNING]
> Dans BigQuery à la demande, **`LIMIT` ne réduit pas en général le volume facturé** : `SELECT * FROM table LIMIT 10` peut lire toute la table (sauf cas particuliers liés au clustering). Pour explorer, utilisez l'aperçu de la table, filtrez sur une partition et sélectionnez les colonnes utiles. L'estimation du volume lu est affichée avant l'exécution : regardez-la.

Autres bonnes pratiques :

- fixer des **quotas** ou des **budgets** et des alertes de coût ;
- dans Snowflake, configurer la **suspension automatique** des entrepôts virtuels inactifs et choisir la plus petite taille suffisante ;
- précalculer les agrégats coûteux consultés souvent (tables gold, **vues matérialisées**) ;
- profiter du **cache des résultats** : une requête identique sur des données inchangées est souvent servie gratuitement depuis le cache ;
- surveiller les requêtes les plus coûteuses (les vues système `INFORMATION_SCHEMA.JOBS` dans BigQuery, `QUERY_HISTORY` dans Snowflake).

```video
url: https://www.youtube.com/watch?v=8KGVFB3kVHQ
title: "What is a Columnar Database?"
channel: "ness-intricity101"
duration: "3:39"
lang: en
why: "Pourquoi une base en colonnes lit moins de données pour une requête analytique, en moins de quatre minutes."
```

# Choisir une solution

```diagram
type: decision
title: Quel moteur analytique ?
nodes:
  - question: Les données tiennent-elles confortablement sur une machine (quelques dizaines de Go) ?
    yes: PostgreSQL ou DuckDB
    no: Question suivante
  - question: Avez-vous déjà un lakehouse (Iceberg ou Delta) ou des besoins de ML importants ?
    yes: Databricks, ou un moteur SQL sur le lakehouse (Trino, Spark)
    no: Question suivante
  - question: Besoin d'analytique en temps réel sur des milliards d'événements ?
    yes: ClickHouse (ou équivalent)
    no: Entrepôt cloud de votre fournisseur principal (BigQuery, Snowflake, Redshift)
```

D'autres critères comptent autant que la technique : le **cloud** déjà utilisé par l'entreprise, les **compétences** de l'équipe, les contraintes de **localisation des données** (hébergement dans l'Union européenne, par exemple), le **modèle de coût** adapté à vos usages (requêtes ponctuelles ou charge continue).

# Exercices

## Exercice 1 : Réduire la facture

Un tableau de bord exécute toutes les 5 minutes `SELECT * FROM evenements WHERE DATE(horodatage) = CURRENT_DATE()` sur une table BigQuery non partitionnée de 20 To, puis agrège les résultats côté outil. Proposez trois améliorations.

<details>
<summary>Voir la solution</summary>

1. **Partitionner** la table par `DATE(horodatage)` : la requête ne lit plus que la partition du jour.
2. **Sélectionner les colonnes utiles** et faire l'**agrégation dans la requête**, plutôt que `SELECT *` et une agrégation côté outil.
3. Précalculer l'indicateur dans une **table agrégée** ou une **vue matérialisée** mise à jour périodiquement, et réduire la fréquence de rafraîchissement si 5 minutes ne sont pas nécessaires.
4. Bonus : `CLUSTER BY` sur les colonnes filtrées et `require_partition_filter` pour empêcher les parcours complets.

</details>

## Exercice 2 : Choisir

Une PME a 15 Go de données de ventes et de CRM, deux analystes, et utilise déjà PostgreSQL pour son application. Quel moteur analytique recommandez-vous ? Quelle précaution ?

<details>
<summary>Voir la solution</summary>

Un **PostgreSQL dédié à l'analytique** (ou DuckDB pour des analyses locales) suffit largement pour 15 Go, avec un coût et une complexité minimes, et des compétences déjà présentes. Précaution : **ne pas** exécuter les requêtes analytiques sur la base de **production** de l'application ; répliquer les données vers une base (ou une réplique en lecture) séparée.

</details>

## Exercice 3 : LIMIT et coût

Un stagiaire lance `SELECT * FROM logs LIMIT 100` sur une table BigQuery de 50 To pour « jeter un œil ». Que se passe-t-il, et que lui conseillez-vous ?

<details>
<summary>Voir la solution</summary>

Avec la facturation à la demande, la requête peut lire (et donc facturer) l'ensemble des colonnes de toute la table, malgré le `LIMIT`. Conseils : utiliser l'**aperçu** de la table dans la console (gratuit), sélectionner seulement quelques colonnes, filtrer sur une partition récente, vérifier l'**estimation** du volume avant d'exécuter, et mettre en place des quotas par utilisateur.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Les entrepôts analytiques
center: Colonnes, exécution parallèle et calcul séparé du stockage, à piloter en lisant le moins possible.
points:
  - icon: server
    title: Architecture
    text: Stockage en colonnes, exécution vectorisée et MPP, calcul élastique séparé.
  - icon: list
    title: Les solutions
    text: BigQuery, Snowflake, Redshift, Databricks, ClickHouse ; PostgreSQL ou DuckDB pour les petits volumes.
  - icon: filter
    title: Partition et clustering
    text: Filtrer sur la partition, trier pour sauter des blocs, exiger un filtre de partition.
  - icon: money
    title: Coûts
    text: Pas de SELECT *, LIMIT ne réduit pas forcément la facture, quotas et suspension automatique.
  - icon: compass
    title: Choisir
    text: Volume réel, cloud existant, compétences, localisation des données, modèle de coût.
pitfall: Sortir l'artillerie lourde pour 15 Go de données qu'un PostgreSQL bien indexé traiterait très bien.
remember: Dans un entrepôt cloud, chaque octet lu inutilement se retrouve sur la facture.
```
