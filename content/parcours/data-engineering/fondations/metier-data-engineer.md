---
title: Le métier de Data Engineer
description: Ce que fait un Data Engineer, le cycle de vie des données qu'il prend en charge et les grandes architectures qu'il rencontre.
duration: 40
objectives:
  - Situer le Data Engineer parmi les métiers de la donnée
  - Décrire les étapes du cycle de vie des données
  - Distinguer entrepôt, data lake et lakehouse, ETL et ELT, batch et streaming
  - Identifier les compétences et outils du métier
---

# Qu'est-ce qu'un Data Engineer ?

Un **Data Engineer** conçoit, construit et exploite les **systèmes qui collectent, stockent, transforment et mettent à disposition les données** d'une organisation. Son travail permet aux analystes, aux data scientists, aux applications et aux modèles d'IA de disposer de données **fiables, à jour, documentées et accessibles**.

Concrètement, il construit des **pipelines** : des chaînes de traitements automatisées qui récupèrent des données dans des sources (bases applicatives, API, fichiers, flux d'événements), les nettoient et les transforment, puis les chargent dans un système de stockage adapté à l'analyse (entrepôt de données, data lake). Il veille ensuite à ce que ces pipelines **tournent tous les jours sans erreur**, à un coût maîtrisé, et que les données produites soient **de qualité**.

> [!NOTE]
> Le Data Engineer n'est pas d'abord un statisticien : c'est un **ingénieur logiciel spécialisé dans la donnée**. Ses outils principaux sont SQL, un langage de programmation (le plus souvent Python), les bases de données, le cloud et l'orchestration.

## Les métiers voisins

```diagram
type: compare
title: Data Engineer et métiers voisins
columns:
  - title: Data Engineer
    tone: teal
    items:
      - Construit et exploite les pipelines
      - Conçoit le stockage et les modèles de données
      - Garantit fraîcheur, qualité et coût
  - title: Analytics Engineer
    tone: blue
    items:
      - Transforme les données brutes en tables métier
      - Travaille surtout en SQL (dbt)
      - Documente et teste les indicateurs
  - title: Data Analyst
    tone: amber
    items:
      - Répond aux questions métier
      - Tableaux de bord, analyses ad hoc
      - Consomme les tables préparées
  - title: Data Scientist / ML Engineer
    tone: violet
    items:
      - Modèles statistiques et de machine learning
      - Expérimentation, puis mise en production
      - Dépend de données propres et historisées
```

Les frontières varient selon les entreprises. Dans une petite structure, une même personne couvre souvent tout, de l'ingestion au tableau de bord. Dans une grande organisation, les rôles sont séparés et le Data Engineer se concentre sur la **plateforme** et les **pipelines**. Le rôle d'**Analytics Engineer** est apparu vers 2019 avec la généralisation de l'ELT et de dbt : il fait le lien entre l'ingénierie et l'analyse.

# Le cycle de vie des données

Le livre de référence *Fundamentals of Data Engineering* (Joe Reis et Matt Housley, O'Reilly, 2022) décrit le travail du Data Engineer à travers le **cycle de vie des données**. C'est une grille de lecture utile pour tout projet.

```diagram
type: flow
title: Le cycle de vie des données
steps:
  - title: Génération
    text: Applications, capteurs, API, fichiers
    tone: blue
  - title: Ingestion
    text: Récupérer les données, en batch ou en flux
    tone: teal
  - title: Stockage
    text: Data lake, entrepôt, bases spécialisées
    tone: teal
  - title: Transformation
    text: Nettoyer, joindre, agréger, modéliser
    tone: teal
  - title: Mise à disposition
    text: Tableaux de bord, ML, API, exports
    tone: amber
```

- **Génération** : les données naissent dans des **systèmes sources** que le Data Engineer ne contrôle généralement pas (base de données d'une application, outil SaaS, journaux de serveurs). Il doit comprendre leur fonctionnement, leur volume et leurs changements.
- **Ingestion** : déplacer les données des sources vers la plateforme. C'est souvent l'étape la plus fragile : API instables, schémas qui changent sans prévenir, données en retard.
- **Stockage** : choisir où et sous quel format conserver les données, en fonction des usages, des volumes et du coût. Le stockage traverse en fait toutes les étapes.
- **Transformation** : passer de données brutes à des données utiles (types corrects, doublons supprimés, tables jointes, indicateurs calculés).
- **Mise à disposition** (*serving*) : fournir les données à ceux qui en ont besoin, sous la forme qui leur convient.

## Les préoccupations transversales

Les auteurs identifient aussi des préoccupations présentes à **chaque** étape (*undercurrents*) :

| Préoccupation | Exemples de questions |
|---|---|
| Sécurité | Qui a accès à quoi ? Les données personnelles sont-elles protégées ? |
| Gestion des données | Où est la documentation ? D'où vient cette colonne (lignage) ? |
| DataOps | Comment détecter une donnée fausse avant les utilisateurs ? |
| Architecture | Le système supportera-t-il dix fois plus de volume ? |
| Orchestration | Dans quel ordre exécuter les traitements, et que faire en cas d'échec ? |
| Génie logiciel | Le code est-il versionné, testé, relu, déployé automatiquement ? |

# Les grandes architectures

## Entrepôt, data lake, lakehouse

- Un **entrepôt de données** (*data warehouse*) stocke des données **structurées**, en tables, optimisées pour les requêtes analytiques en SQL. Exemples : BigQuery, Snowflake, Amazon Redshift, ou PostgreSQL pour des volumes modestes.
- Un **data lake** stocke des fichiers bruts de **tous types** (CSV, JSON, Parquet, images, journaux) sur un stockage objet peu coûteux (Amazon S3, Google Cloud Storage, Azure Data Lake Storage). Très flexible, mais sans discipline il devient un « marécage de données » (*data swamp*) que personne n'ose utiliser.
- Un **lakehouse** combine les deux : des fichiers ouverts (souvent Parquet) sur un stockage objet, avec une **couche de tables** (Apache Iceberg, Delta Lake, Apache Hudi) qui apporte transactions, schémas et historique. Le module 3 détaille ces formats.

## ETL ou ELT

```diagram
type: compare
title: Deux façons d'enchaîner les étapes
columns:
  - title: ETL (Extract, Transform, Load)
    tone: blue
    items:
      - Transformation avant le chargement
      - Sur un serveur ou un outil dédié
      - Approche historique, stockage coûteux
  - title: ELT (Extract, Load, Transform)
    tone: teal
    items:
      - Chargement brut, puis transformation dans l'entrepôt
      - Transformations écrites en SQL (souvent avec dbt)
      - Données brutes conservées, retraitement facile
```

L'**ELT** s'est imposé avec les entrepôts cloud, dont la puissance de calcul et le stockage sont devenus abordables : on charge les données brutes telles quelles, puis on les transforme **dans** l'entrepôt. L'ETL reste pertinent quand il faut, par exemple, **retirer des données sensibles avant** qu'elles n'atteignent la plateforme.

## Batch ou streaming

- Le **batch** traite les données par lots, à intervalles réguliers (toutes les heures, chaque nuit). C'est simple, robuste et suffisant pour la grande majorité des besoins analytiques.
- Le **streaming** traite les événements **en continu**, au fil de l'eau, avec une latence de quelques secondes ou moins. Il est utile pour la détection de fraude, la supervision ou la personnalisation en temps réel, mais il est plus complexe à exploiter.

> [!TIP]
> Avant de choisir le streaming, demandez : « Que ferait-on de différent avec une donnée vieille de 5 secondes plutôt que de 1 heure ? » Si personne ne répond, un batch fréquent suffit.

# Compétences et outils

Le métier demande des compétences solides dans quelques domaines, plutôt qu'une connaissance superficielle de dizaines d'outils.

```diagram
type: layers
title: Les compétences du Data Engineer
layers:
  - title: Fondamentaux
    items: [SQL, Python, Linux et ligne de commande, Git]
  - title: Données
    items: [Modélisation, Formats de fichiers, Bases relationnelles et analytiques]
  - title: Traitement
    items: [Batch, Calcul distribué (Spark), Streaming (Kafka)]
  - title: Exploitation
    items: [Orchestration, Qualité des données, Cloud, Infrastructure as Code, CI/CD]
```

Quelques outils très répandus, que ce parcours aborde :

| Domaine | Outils courants |
|---|---|
| Stockage analytique | PostgreSQL, BigQuery, Snowflake, Redshift, ClickHouse, DuckDB |
| Bases opérationnelles et NoSQL | PostgreSQL, MySQL, MongoDB, Cassandra, DynamoDB, Redis, Elasticsearch |
| Transformation et requêtes | SQL, dbt, pandas, Polars, DuckDB, Trino, Apache Spark |
| Orchestration | Apache Airflow, Dagster, Prefect |
| Streaming et CDC | Apache Kafka, Debezium, Apache Flink, Spark Structured Streaming |
| Formats de tables | Apache Iceberg, Delta Lake, Apache Hudi |
| Qualité et gouvernance | tests dbt, Great Expectations, Soda, catalogues de données |
| Mise à disposition | Outils de BI, couche sémantique, reverse ETL, API de données |
| Infrastructure | Docker, Kubernetes, Terraform, services cloud (AWS, GCP, Azure) |

> [!IMPORTANT]
> Les outils changent, les principes restent. Un Data Engineer qui maîtrise SQL, la modélisation, l'idempotence des traitements et la qualité des données s'adapte à n'importe quelle pile technique.

## Comment ce parcours est organisé

Les dix modules suivent le cycle de vie des données :

| Module | Ce que vous y apprenez |
|---|---|
| 1. Fondations | Le métier, Python pour la donnée, Linux, Git et Docker |
| 2. SQL et bases relationnelles | Du `SELECT` aux fonctions de fenêtrage, la modélisation relationnelle, les index et les transactions |
| 3. Stockage et formats | Parquet, data lake et lakehouse, entrepôts analytiques, bases NoSQL et systèmes distribués |
| 4. Modélisation analytique et dbt | Schéma en étoile, Data Vault et tables larges, transformation et mise en production avec dbt |
| 5. Ingestion et traitement | Ingestion incrémentale et idempotente, DuckDB, Polars et Trino, puis Spark |
| 6. Orchestration | Principes, Airflow et Dagster |
| 7. Streaming et temps réel | Concepts, Kafka, CDC et architectures orientées événements, Spark Streaming et Flink |
| 8. Qualité, gouvernance et organisation | Tests, observabilité, contrats, sécurité, RGPD, produits de données et data mesh |
| 9. Mise à disposition et usages | BI, couche sémantique, reverse ETL, API, données pour le machine learning et l'IA |
| 10. Production | Cloud et Terraform, DataOps, conception d'architecture, projet final |

# Exercices

## Exercice 1 : Placer les étapes

Une enseigne de distribution veut un tableau de bord quotidien du chiffre d'affaires par magasin. Les ventes sont enregistrées dans la base PostgreSQL de l'application de caisse. Associez chaque action à une étape du cycle de vie :

1. Copier chaque nuit les ventes de la veille depuis la base de caisse.
2. Conserver ces ventes dans BigQuery.
3. Calculer le chiffre d'affaires par magasin et par jour.
4. Afficher le résultat dans un outil de tableaux de bord.

<details>
<summary>Voir la solution</summary>

1. **Ingestion** (la génération a lieu dans l'application de caisse).
2. **Stockage**.
3. **Transformation**.
4. **Mise à disposition**.

</details>

## Exercice 2 : ETL ou ELT ?

Pour chaque situation, indiquez l'approche la plus adaptée et justifiez :

1. Une start-up charge les données de ses outils SaaS dans Snowflake et veut pouvoir recalculer ses indicateurs quand les définitions changent.
2. Un hôpital doit pseudonymiser les données patients avant qu'elles ne quittent son réseau.

<details>
<summary>Voir la solution</summary>

1. **ELT** : charger les données brutes dans l'entrepôt permet de **retransformer** à tout moment quand une définition change, sans réingérer.
2. **ETL** (au moins pour cette étape) : la pseudonymisation doit avoir lieu **avant** le chargement, pour que les données identifiantes n'arrivent jamais sur la plateforme analytique.

</details>

## Exercice 3 : Batch ou streaming ?

Lesquels de ces besoins justifient du streaming ?

1. Le rapport mensuel des ventes envoyé à la direction.
2. Le blocage d'une transaction bancaire suspecte avant sa validation.
3. Le tableau de bord marketing consulté chaque matin.

<details>
<summary>Voir la solution</summary>

Seul le besoin **2** justifie du streaming : la décision doit être prise en quelques secondes, pendant la transaction. Les besoins 1 et 3 sont parfaitement couverts par un batch (mensuel ou nocturne), plus simple et moins coûteux.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Le métier de Data Engineer
center: Construire et exploiter des pipelines qui livrent des données fiables, à jour et accessibles.
points:
  - icon: users
    title: Un rôle d'ingénieur
    text: Ingénieur logiciel de la donnée, au service des analystes, data scientists et applications.
  - icon: loop
    title: Le cycle de vie
    text: Génération, ingestion, stockage, transformation, mise à disposition.
  - icon: layers
    title: Lake, entrepôt, lakehouse
    text: Fichiers bruts bon marché, tables SQL optimisées, ou les deux avec Iceberg ou Delta.
  - icon: filter
    title: ETL ou ELT
    text: L'ELT charge brut puis transforme dans l'entrepôt ; l'ETL transforme avant, par exemple pour protéger.
  - icon: clock
    title: Batch d'abord
    text: Le streaming ne se justifie que si une décision doit être prise en quelques secondes.
pitfall: Collectionner les outils à la mode au lieu de maîtriser SQL, la modélisation et la qualité des données.
remember: Une donnée n'a de valeur que si elle est fiable, à jour, documentée et accessible.
```
