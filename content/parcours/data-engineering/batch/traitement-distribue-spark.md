---
title: Le traitement distribué avec Apache Spark
description: Architecture de Spark, DataFrames et évaluation paresseuse, partitions et shuffles, jointures, déséquilibre des données et bonnes pratiques d'écriture.
duration: 65
objectives:
  - Décrire l'architecture d'une application Spark (driver, exécuteurs, tâches)
  - Écrire des transformations avec l'API DataFrame de PySpark
  - Comprendre partitions, shuffles et stratégies de jointure
  - Diagnostiquer les problèmes de performance courants
---

# Pourquoi distribuer ?

Quand les données dépassent ce qu'une machine peut traiter en un temps raisonnable (plusieurs centaines de gigaoctets, des téraoctets), on **répartit** le travail sur plusieurs machines. **Apache Spark** est le moteur de traitement distribué le plus répandu : il traite des données en batch (et en streaming, module 7) avec des API en Python (PySpark), SQL, Scala et Java.

> [!TIP]
> Le distribué a un coût : démarrage du cluster, échanges réseau, complexité de diagnostic. Pour moins d'une centaine de gigaoctets, **DuckDB ou Polars sur une seule bonne machine** sont souvent plus rapides, plus simples et moins chers. Ne choisissez Spark que lorsque le volume ou l'écosystème (lakehouse, Databricks) le justifient.

# L'architecture de Spark

```diagram
type: layers
title: Une application Spark
layers:
  - title: Driver
    text: Exécute votre programme, construit le plan, découpe en tâches et les distribue
  - title: Gestionnaire de cluster
    text: Alloue les ressources (Kubernetes, YARN, mode standalone, ou service géré)
  - title: Exécuteurs
    text: Processus sur les machines du cluster ; chacun exécute des tâches en parallèle sur des partitions
```

- Le **driver** exécute votre script, construit le plan d'exécution et coordonne le travail.
- Les **exécuteurs** (*executors*) traitent les données. Chacun dispose de cœurs (une tâche par cœur à la fois) et de mémoire.
- Les données sont découpées en **partitions** : une **tâche** traite une partition. Plus de partitions = plus de parallélisme possible (jusqu'à un certain point).

En pratique, on utilise souvent un **service géré** : Databricks, Amazon EMR, Google Dataproc, Azure Synapse / Fabric, qui provisionnent et configurent le cluster.

```video
url: https://www.youtube.com/watch?v=nKRwjXRs4mY
title: "What is Spark? (Visual Explanation)"
channel: "Data with Baraa"
duration: "11:59"
lang: en
why: "Data with Baraa explique Spark avec des schémas : driver, exécuteurs, partitions et exécution paresseuse."
```

# L'API DataFrame

```python
from pyspark.sql import SparkSession, functions as F

spark = SparkSession.builder.appName("ca-quotidien").getOrCreate()

ventes = spark.read.parquet("s3a://lake/silver/ventes/")
magasins = spark.read.parquet("s3a://lake/silver/magasins/")

ca_par_region = (
    ventes
    .filter(F.col("date_vente") == "2026-03-02")
    .join(F.broadcast(magasins), on="magasin_id", how="inner")
    .groupBy("region", "date_vente")
    .agg(
        F.sum("montant").alias("chiffre_affaires"),
        F.countDistinct("ticket_id").alias("nb_tickets"),
    )
)

ca_par_region.write.mode("overwrite").partitionBy("date_vente").parquet("s3a://lake/gold/ca_par_region/")
```

Le même traitement s'écrit en SQL :

```python
ventes.createOrReplaceTempView("ventes")
spark.sql("SELECT magasin_id, sum(montant) AS ca FROM ventes GROUP BY magasin_id").show()
```

## L'évaluation paresseuse

Spark distingue :

- les **transformations** (`filter`, `select`, `join`, `groupBy`…), **paresseuses** : elles ne font que construire un plan ;
- les **actions** (`write`, `count`, `collect`, `show`), qui **déclenchent** l'exécution.

Avant d'exécuter, l'optimiseur (**Catalyst**) réécrit le plan : il pousse les filtres au plus près de la lecture (Parquet ne lira que les partitions et colonnes utiles), choisit les algorithmes de jointure, etc. `df.explain()` affiche le plan.

> [!WARNING]
> `collect()` rapatrie **toutes** les lignes sur le driver : sur un grand DataFrame, il fait tomber le driver par manque de mémoire. Écrivez les résultats sur le stockage, ou utilisez `show()` / `limit()` pour inspecter.

# Partitions et shuffles

## Transformations étroites et larges

```diagram
type: compare
title: Deux familles de transformations
columns:
  - title: Étroites (narrow)
    tone: teal
    items:
      - Chaque partition est traitée seule
      - filter, select, withColumn
      - Pas d'échange réseau, très rapide
  - title: Larges (wide)
    tone: amber
    items:
      - Les lignes doivent être regroupées par clé
      - groupBy, join, distinct, orderBy
      - "Shuffle : échange de données entre exécuteurs"
```

Le **shuffle** redistribue les données sur le réseau pour que toutes les lignes ayant la même clé se retrouvent sur la même partition. C'est l'opération **la plus coûteuse** de Spark (réseau, disque, sérialisation). Spark découpe le travail en **étapes** (*stages*) séparées par les shuffles. Réduire le nombre et le volume des shuffles est le levier principal d'optimisation : filtrer et sélectionner les colonnes **avant** les jointures et agrégations.

## Les stratégies de jointure

- **Broadcast hash join** : si une table est **petite** (une table de magasins, de pays), Spark en envoie une copie à chaque exécuteur. La grande table n'a pas besoin d'être redistribuée : pas de shuffle de la grande table. Spark le fait automatiquement sous un seuil de taille, ou à la demande avec `F.broadcast()`.
- **Sort-merge join** : pour deux grandes tables, les deux côtés sont redistribués (shuffle) et triés par clé, puis fusionnés.

## Le déséquilibre des données (skew)

Si une clé est **beaucoup plus fréquente** que les autres (un client « invité » qui regroupe 30 % des commandes, une valeur `NULL`), sa partition est énorme : une seule tâche travaille pendant que toutes les autres ont fini. Symptôme dans l'interface Spark : une tâche dure cent fois plus que la médiane.

Remèdes :

- l'**Adaptive Query Execution** (AQE), activée par défaut depuis Spark 3.2, qui ajuste les partitions après les shuffles et sait découper les partitions déséquilibrées dans les jointures ;
- traiter à part la clé dominante (ou les `NULL`, souvent inutiles dans la jointure) ;
- le **salage** (*salting*) : ajouter un suffixe aléatoire à la clé dominante pour la répartir sur plusieurs partitions.

# Bonnes pratiques

1. **Fonctions intégrées plutôt que UDF Python** : une fonction Python définie par l'utilisateur (UDF) oblige à transférer les données entre la JVM et Python, ligne par ligne. Les fonctions de `pyspark.sql.functions` s'exécutent dans le moteur optimisé. Si une UDF est indispensable, préférez les **pandas UDF** (vectorisées via Apache Arrow).
2. **Lire peu** : Parquet ou format de table, filtres sur les colonnes de partition, sélection des colonnes utiles.
3. **Maîtriser le nombre de fichiers écrits** : chaque partition Spark écrit au moins un fichier. Trop de partitions → des milliers de petits fichiers. `coalesce(n)` réduit le nombre de partitions sans shuffle, `repartition(n, col)` redistribue (avec shuffle).
4. **Écraser seulement les partitions concernées** : avec `spark.sql.sources.partitionOverwriteMode=dynamic`, un `mode("overwrite")` ne remplace que les partitions présentes dans les données écrites, au lieu de toute la table. Avec Iceberg ou Delta Lake, utilisez plutôt `MERGE` ou l'écrasement de partitions de ces formats.
5. **Mettre en cache avec discernement** : `df.cache()` n'est utile que si le même DataFrame est réutilisé plusieurs fois.
6. **Lire l'interface Spark** (*Spark UI*) : durée des étapes, volume des shuffles, tâches anormalement longues, débordements sur disque (*spill*).

> [!NOTE]
> Spark 4 (2025) a notamment généralisé **Spark Connect**, une architecture client-serveur qui permet d'exécuter du code PySpark depuis un client léger, distinct du driver. Les concepts de ce chapitre restent inchangés.

# Exercices

## Exercice 1 : Transformations et actions

Dans ce code, combien de fois les données sont-elles lues ? Comment l'améliorer ?

```python
df = spark.read.parquet("s3a://lake/silver/evenements/").filter(F.col("type") == "achat")
print(df.count())
df.groupBy("pays").count().write.parquet("s3a://lake/gold/achats_par_pays/")
```

<details>
<summary>Voir la solution</summary>

Deux **actions** (`count` et `write`) : le plan est exécuté deux fois, donc les données sont lues **deux fois**. Si le `count` est indispensable, mettre `df` en cache (`df = df.cache()`) avant les deux actions, ou dériver le total de l'agrégat écrit (somme des comptes par pays) pour n'exécuter qu'une lecture.

</details>

## Exercice 2 : La jointure lente

Une jointure entre `transactions` (5 To) et `devises` (200 lignes) prend 40 minutes, avec un énorme shuffle. Que proposez-vous ?

<details>
<summary>Voir la solution</summary>

Forcer un **broadcast join** : `transactions.join(F.broadcast(devises), "code_devise")`. La petite table est copiée sur chaque exécuteur, et la grande n'est plus redistribuée. Vérifier avec `explain()` que le plan contient `BroadcastHashJoin`. Filtrer et sélectionner les colonnes de `transactions` avant la jointure.

</details>

## Exercice 3 : Le dernier pour cent

Un job s'exécute à 99 % en 5 minutes, puis la dernière tâche tourne 50 minutes. La jointure se fait sur `client_id`, et 35 % des lignes ont `client_id` à `NULL` (achats sans compte). Expliquez et corrigez.

<details>
<summary>Voir la solution</summary>

**Déséquilibre** : toutes les lignes `NULL` se retrouvent dans la même partition, traitée par une seule tâche. Or des lignes avec `client_id` `NULL` ne trouveront **jamais** de correspondance dans la jointure. Solution : séparer les lignes `NULL`, faire la jointure sur les autres, puis réunir (`unionByName`) les deux parties si elles doivent figurer dans le résultat. Vérifier aussi que l'AQE est activée.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Le traitement distribué avec Spark
center: Répartir le travail en partitions sur un cluster, en réduisant les échanges réseau au strict nécessaire.
points:
  - icon: server
    title: Driver et exécuteurs
    text: Le driver planifie, les exécuteurs traitent une partition par tâche.
  - icon: idea
    title: Évaluation paresseuse
    text: Transformations planifiées, actions déclenchées ; Catalyst optimise ; jamais collect() en grand.
  - icon: network
    title: Shuffle
    text: groupBy et join redistribuent les données ; filtrer et sélectionner avant.
  - icon: zap
    title: Jointures
    text: Broadcast pour une petite table ; sort-merge entre deux grandes.
  - icon: scale
    title: Déséquilibre
    text: Une clé dominante bloque une tâche ; AQE, traitement à part, salage.
pitfall: Sortir un cluster Spark pour 20 Go qu'une seule machine avec DuckDB traiterait plus vite.
remember: Dans Spark, ce qui coûte cher, c'est de déplacer les données, pas de les calculer.
```
