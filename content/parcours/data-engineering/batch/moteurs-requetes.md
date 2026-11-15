---
title: "Moteurs de requête modernes : DuckDB, Polars et Trino"
description: Avant de sortir Spark, savoir traiter des dizaines de gigaoctets sur une seule machine avec DuckDB et Polars, et interroger plusieurs sources sans les copier avec un moteur fédéré comme Trino.
duration: 60
objectives:
  - Expliquer pourquoi les moteurs vectorisés mono-nœud vont si loin
  - Écrire des transformations avec DuckDB (SQL) et Polars (API paresseuse)
  - Interroger un lakehouse ou plusieurs bases avec Trino
  - Choisir entre une machine, un moteur fédéré et un cluster Spark
---

# Une machine va beaucoup plus loin qu'on ne le croit

Pendant une décennie, « big data » voulait dire « cluster ». Pourtant, une machine récente a des dizaines de cœurs, des centaines de gigaoctets de mémoire et des disques NVMe qui lisent plusieurs gigaoctets par seconde. La plupart des tables analytiques réelles font **moins de quelques centaines de gigaoctets**, et une requête n'en lit souvent qu'une petite partie (quelques colonnes, quelques partitions).

Une nouvelle génération de moteurs **mono-nœud** exploite pleinement cette machine :

- **stockage en colonnes** et lecture directe de **Parquet** : seules les colonnes et les groupes de lignes utiles sont lus ;
- **exécution vectorisée** : les opérations s'appliquent à des blocs de milliers de valeurs, ce qui exploite les caches et les instructions SIMD du processeur ;
- **parallélisme** sur tous les cœurs ;
- **traitement hors mémoire** (*out-of-core*) : quand une jointure ou un tri dépasse la mémoire, le moteur déverse sur disque au lieu de planter.

Résultat : des traitements qui demandaient un cluster Spark tournent en quelques secondes sur un portable, sans JVM, sans cluster à administrer, sans coût de démarrage.

> [!NOTE]
> Ce n'est pas un rejet de Spark : au-delà de ce qu'une machine peut traiter dans le temps imparti (plusieurs téraoctets lus par traitement, débit continu très élevé), la distribution reste nécessaire. Mais le **coût fixe** d'un cluster (démarrage, réglage, shuffles réseau, exploitation) n'est rentable qu'à partir d'un certain volume.

# DuckDB : du SQL analytique embarqué

**DuckDB** est souvent présenté comme « le SQLite de l'analytique » : une base **embarquée** (une bibliothèque, pas un serveur) avec un moteur de requêtes en colonnes très rapide. On l'utilise depuis Python, en ligne de commande, dans un navigateur (WebAssembly) ou depuis dbt.

```sql
-- Lire directement des fichiers Parquet sur S3, sans les charger au préalable
INSTALL httpfs; LOAD httpfs;
CREATE SECRET (TYPE s3, PROVIDER credential_chain);

SELECT magasin,
       date_trunc('month', vendu_le) AS mois,
       sum(montant)                  AS ca
FROM read_parquet('s3://lake/ventes/date_vente=2026-*/*.parquet', hive_partitioning = true)
WHERE date_vente >= '2026-01-01'
GROUP BY ALL
ORDER BY mois, ca DESC;
```

Quelques points forts :

- **lecture directe** de CSV, JSON, Parquet, sur disque, HTTP ou stockage objet, avec élagage de partitions et de colonnes ;
- **SQL très complet** et pratique (`GROUP BY ALL`, `QUALIFY`, `EXCLUDE`, `PIVOT`, fonctions de fenêtrage, types imbriqués) ;
- **lecture des formats de tables** Iceberg et Delta Lake via des extensions ;
- **intégration zéro copie** avec pandas, Polars et Arrow : on interroge un DataFrame en SQL sans le copier ;
- **dbt-duckdb** permet de faire tourner un projet dbt complet sur une seule machine, idéal pour développer, tester en CI ou servir de petit entrepôt.

```python
import duckdb

con = duckdb.connect("analytique.duckdb")      # fichier local, ou ":memory:"

# Une transformation idempotente : on remplace la sortie du jour
con.execute("""
    CREATE OR REPLACE TABLE ventes_jour AS
    SELECT * EXCLUDE (payload_brut)
    FROM read_json_auto('bronze/ventes/2026-03-02/*.jsonl')
    QUALIFY row_number() OVER (PARTITION BY vente_id ORDER BY recu_le DESC) = 1
""")

# Exporter en Parquet partitionné
con.execute("""
    COPY ventes_jour TO 'silver/ventes' (FORMAT parquet, PARTITION_BY (magasin), OVERWRITE_OR_IGNORE)
""")
```

> [!WARNING]
> Un fichier DuckDB n'accepte qu'**un seul processus en écriture** à la fois. C'est parfait pour un pipeline, un notebook ou un outil local, mais ce n'est pas une base partagée par une équipe entière avec des écritures concurrentes. Pour cela, on écrit les résultats dans un lakehouse ou un entrepôt, ou on utilise une offre gérée (MotherDuck) ou le format DuckLake.

# Polars : des DataFrames rapides

**Polars** est une bibliothèque de DataFrames écrite en Rust, basée sur Apache Arrow. Elle remplace avantageusement pandas pour les traitements de données de taille moyenne à grande : multithreadée, typage strict, et surtout une **API paresseuse** (*lazy*).

```python
import polars as pl

resultat = (
    pl.scan_parquet("silver/ventes/**/*.parquet")      # rien n'est lu à ce stade
    .filter(pl.col("vendu_le") >= pl.datetime(2026, 1, 1))
    .group_by("magasin", pl.col("vendu_le").dt.truncate("1mo").alias("mois"))
    .agg(
        pl.col("montant").sum().alias("ca"),
        pl.col("vente_id").n_unique().alias("nb_ventes"),
    )
    .sort("mois", "ca", descending=[False, True])
)

print(resultat.explain())                  # plan optimisé : filtres et colonnes poussés vers la lecture
df = resultat.collect(engine="streaming")  # exécution par morceaux, au-delà de la mémoire
```

Avec `scan_*` et `collect()`, Polars construit un **plan de requête** et l'optimise avant d'exécuter, exactement comme un moteur SQL ou Spark :

- **poussée des prédicats** (*predicate pushdown*) : le filtre est appliqué pendant la lecture du Parquet ;
- **projection** : seules les colonnes utilisées sont lues ;
- **exécution en flux** (*streaming*) : les données sont traitées par lots, ce qui permet de dépasser la mémoire disponible.

```diagram
type: compare
title: pandas, Polars ou DuckDB ?
columns:
  - title: pandas
    tone: amber
    items:
      - Écosystème immense, standard des notebooks
      - Exécution immédiate, un seul cœur pour la plupart des opérations
      - Copie et mémoire gourmandes
      - Parfait pour de petits volumes et l'exploration
  - title: Polars
    tone: blue
    items:
      - API DataFrame expressive, typage strict
      - Mode paresseux optimisé, multithreadé
      - Exécution en flux au-delà de la mémoire
      - Idéal pour des transformations en Python
  - title: DuckDB
    tone: teal
    items:
      - SQL analytique complet, embarqué
      - Lecture directe de fichiers et du stockage objet
      - Interopère sans copie avec pandas et Polars
      - Idéal quand l'équipe pense en SQL, et avec dbt
```

> [!TIP]
> pandas, Polars et DuckDB partagent le format mémoire **Apache Arrow**. On peut donc passer de l'un à l'autre sans copie : lire avec DuckDB, transformer avec Polars, finir avec une bibliothèque qui attend pandas. Arrow est devenu le standard d'échange de données en colonnes entre outils et langages.

# Trino : interroger les données là où elles sont

**Trino** (anciennement PrestoSQL, issu de Presto créé chez Facebook) est un **moteur SQL distribué** sans stockage propre. Il interroge des données qui restent dans leurs systèmes d'origine grâce à des **connecteurs** : tables Iceberg, Delta ou Hive sur le stockage objet, PostgreSQL, MySQL, Kafka, Elasticsearch, MongoDB…

```diagram
type: layers
title: L'architecture de Trino
layers:
  - title: Clients
    text: Outils de BI, notebooks, dbt-trino, JDBC
  - title: Coordinateur
    text: Analyse la requête, consulte les catalogues, construit et distribue le plan
  - title: Workers
    text: Exécutent les étapes en mémoire et s'échangent les données intermédiaires
  - title: Connecteurs et catalogues
    text: "Iceberg sur S3, PostgreSQL, Kafka, MongoDB… chaque source est un catalogue"
```

```sql
-- Une jointure fédérée : les commandes du lakehouse et les clients de la base de production
SELECT c.segment,
       count(*)          AS nb_commandes,
       sum(o.montant)    AS ca
FROM lake.silver.commandes  AS o
JOIN crm.public.clients     AS c ON c.client_id = o.client_id
WHERE o.commande_le >= DATE '2026-01-01'
GROUP BY c.segment;
```

Usages typiques :

- **moteur SQL interactif d'un lakehouse** : les analystes interrogent les tables Iceberg avec des temps de réponse de l'ordre de la seconde (les offres gérées comme Starburst ou Amazon Athena reposent sur Trino) ;
- **requêtes fédérées** pour explorer ou prototyper sans construire d'abord un pipeline ;
- **transformations** avec dbt-trino, y compris l'écriture de tables Iceberg.

> [!WARNING]
> Une requête fédérée qui joint une grosse table du lakehouse à une base de **production** peut envoyer des requêtes lourdes à cette base, et sa latence dépend de la source la plus lente. Pour un usage régulier, mieux vaut **ingérer** la table de production dans le lakehouse. La fédération sert à explorer, à prototyper ou à joindre de petites tables de référence.

Trino exécute historiquement les requêtes en mémoire : une requête énorme qui dépasse la mémoire échoue, et une défaillance de worker fait échouer la requête. Pour les longs traitements par lots, on active son **mode tolérant aux pannes** (qui écrit les résultats intermédiaires sur le stockage objet) ou on préfère Spark.

# Choisir le bon moteur

```diagram
type: decision
title: Quel moteur pour ce traitement ?
nodes:
  - question: Le traitement lit-il moins de quelques centaines de gigaoctets (après élagage des colonnes et partitions) ?
    yes: DuckDB ou Polars sur une machine, dans un conteneur orchestré
    no: Question suivante
  - question: S'agit-il surtout de requêtes SQL interactives ou fédérées sur un lakehouse partagé ?
    yes: Trino (ou un entrepôt cloud qui lit les tables Iceberg)
    no: Question suivante
  - question: Faut-il des transformations lourdes de plusieurs téraoctets, du code Python distribué ou du streaming ?
    yes: Spark (ou Flink pour le streaming)
    no: Revenir à DuckDB ou Polars, et mesurer
```

| Critère | DuckDB / Polars | Trino | Spark |
|---|---|---|---|
| Déploiement | Une bibliothèque | Cluster (coordinateur + workers) | Cluster ou service géré |
| Démarrage | Instantané | Cluster permanent | Lent (secondes à minutes) |
| Volume confortable | Jusqu'à quelques centaines de Go par traitement | De quelques Go à des To en interactif | Du Go au Po |
| Point fort | Simplicité, vitesse, coût | SQL interactif et fédération | Gros traitements, tolérance aux pannes, écosystème |

> [!IMPORTANT]
> Mesurez avant de choisir. Un pipeline qui traite 20 Go par jour sur un cluster Spark de 10 machines coûte cher, démarre lentement et demande de l'exploitation, alors qu'un conteneur avec DuckDB le ferait en une minute. À l'inverse, forcer une machine unique à traiter 5 To par nuit mène à des traitements fragiles. Le bon outil dépend du volume **lu**, pas du volume **stocké**.

# Exercices

## Exercice 1 : Le cluster surdimensionné

Un pipeline Spark quotidien lit 12 Go de Parquet (3 colonnes sur 40 sont utilisées), fait deux jointures avec des tables de 200 Mo, et écrit 1 Go de résultat. Il tourne sur un cluster de 8 machines et prend 9 minutes, dont 4 de démarrage. Que proposez-vous ?

<details>
<summary>Voir la solution</summary>

Le volume réellement lu est faible : 3 colonnes sur 40 représentent une fraction des 12 Go, et les tables jointes tiennent largement en mémoire. Un **conteneur unique avec DuckDB ou Polars** (par exemple 8 cœurs, 32 Go de mémoire) fera ce traitement en une à deux minutes, sans temps de démarrage de cluster, pour un coût bien inférieur.

À valider par une mesure : réécrire le traitement, comparer résultats et durées sur quelques jours de données, puis basculer. On garde Spark pour les traitements qui lisent réellement des téraoctets.

</details>

## Exercice 2 : Traduire en Polars paresseux

Ce code pandas plante faute de mémoire sur un fichier de 30 Go :

```python
import pandas as pd
df = pd.read_parquet("evenements.parquet")
df = df[df["pays"] == "FR"]
resultat = df.groupby("type")["montant"].sum()
```

Réécrivez-le avec Polars pour qu'il passe sur la même machine, et expliquez pourquoi.

<details>
<summary>Voir la solution</summary>

```python
import polars as pl

resultat = (
    pl.scan_parquet("evenements.parquet")
    .filter(pl.col("pays") == "FR")
    .group_by("type")
    .agg(pl.col("montant").sum())
    .collect(engine="streaming")
)
```

pandas charge **tout le fichier**, toutes colonnes comprises, avant de filtrer. Polars en mode paresseux ne lit que les colonnes `pays`, `type` et `montant`, applique le filtre **pendant la lecture** (en sautant les groupes de lignes dont les statistiques excluent `FR`) et agrège par lots en flux.

</details>

## Exercice 3 : Fédérer ou ingérer ?

Les analystes lancent chaque matin, via Trino, un tableau de bord qui joint 2 ans de commandes du lakehouse à la table `clients` de la base PostgreSQL de production (3 millions de lignes). L'équipe applicative se plaint de ralentissements à 9 h. Que faites-vous ?

<details>
<summary>Voir la solution</summary>

La requête fédérée lit la table `clients` dans la base de **production** à chaque exécution, au moment de la plus forte charge. Il faut **ingérer** `clients` dans le lakehouse (extraction incrémentale ou CDC, puis une table Iceberg en silver) et faire pointer le tableau de bord vers cette copie. La fédération reste utile pour explorer ponctuellement une nouvelle source, pas pour un usage quotidien.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Moteurs de requête modernes
center: Une machine bien exploitée traite des centaines de gigaoctets ; on sort le cluster quand une mesure l'exige.
points:
  - icon: cpu
    title: Vectorisé et en colonnes
    text: Lire peu, traiter par blocs, utiliser tous les cœurs, déverser sur disque si besoin.
  - icon: database
    title: DuckDB
    text: SQL analytique embarqué, lit Parquet et S3 directement, parfait avec dbt.
  - icon: zap
    title: Polars
    text: DataFrames rapides ; scan, filtres poussés, collect en flux.
  - icon: link
    title: Arrow
    text: Format mémoire commun, échanges sans copie entre outils.
  - icon: network
    title: Trino
    text: SQL distribué sur le lakehouse et fédération de sources, sans stockage propre.
  - icon: scale
    title: Choisir
    text: Selon le volume lu, la latence voulue et le coût d'exploitation.
pitfall: Monter un cluster Spark pour 20 Go par jour, ou fédérer chaque matin une requête lourde sur la base de production.
remember: Le bon moteur dépend du volume lu, pas du volume stocké.
```
