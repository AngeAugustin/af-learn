---
title: Traiter les flux avec Spark et Flink
description: "Spark Structured Streaming et Apache Flink en pratique : lecture depuis Kafka, fenêtres en temps de l'événement, filigranes, checkpoints et écriture dans un lakehouse."
duration: 55
objectives:
  - Écrire un traitement de flux avec Spark Structured Streaming
  - Exprimer une agrégation fenêtrée en Flink SQL
  - Configurer checkpoints, déclencheurs et modes de sortie
  - Choisir un moteur de traitement de flux
---

# Les moteurs de traitement de flux

Lire des messages Kafka un par un dans une boucle Python (chapitre précédent) convient pour des traitements simples. Dès qu'il faut des **fenêtres**, de l'**état**, des **jointures** entre flux et une reprise fiable après panne, on utilise un moteur dédié :

| Moteur | Modèle | Points forts |
|---|---|---|
| **Spark Structured Streaming** | Micro-batchs (par défaut) | Même API que le batch Spark, idéal si Spark est déjà utilisé, latence de l'ordre de la seconde |
| **Apache Flink** | Événement par événement | Très faible latence, gestion d'état avancée, fenêtres et temps de l'événement très complets, Flink SQL |
| **Kafka Streams** | Bibliothèque Java | Traitements embarqués dans une application, sans cluster dédié |
| Services gérés | Google Dataflow (Apache Beam), Amazon Managed Service for Apache Flink… | Pas d'infrastructure à gérer |

# Spark Structured Streaming

Structured Streaming traite un flux comme une **table infinie** à laquelle de nouvelles lignes s'ajoutent. On écrit la requête **comme en batch** ; Spark l'exécute de façon incrémentale.

```python
from pyspark.sql import SparkSession, functions as F, types as T

spark = SparkSession.builder.appName("paiements-par-minute").getOrCreate()

schema = T.StructType([
    T.StructField("paiement_id", T.StringType()),
    T.StructField("compte_id", T.StringType()),
    T.StructField("pays", T.StringType()),
    T.StructField("montant", T.DecimalType(10, 2)),
    T.StructField("horodatage", T.TimestampType()),
])

# 1. Lire le topic Kafka (clé et valeur arrivent en binaire)
brut = (
    spark.readStream.format("kafka")
    .option("kafka.bootstrap.servers", "broker:9092")
    .option("subscribe", "paiements")
    .option("startingOffsets", "earliest")
    .load()
)

# 2. Décoder le JSON
paiements = (
    brut.select(F.from_json(F.col("value").cast("string"), schema).alias("p"))
    .select("p.*")
)

# 3. Agréger par fenêtre d'une minute en temps de l'événement, avec 2 minutes de tolérance
par_minute = (
    paiements
    .withWatermark("horodatage", "2 minutes")
    .groupBy(F.window("horodatage", "1 minute"), "pays")
    .agg(F.count("*").alias("nb_paiements"), F.sum("montant").alias("total"))
)

# 4. Écrire en continu dans une table du lakehouse
requete = (
    par_minute.writeStream
    .outputMode("append")                                 # n'émettre qu'une fois la fenêtre fermée
    .format("delta")
    .option("checkpointLocation", "s3a://lake/_checkpoints/paiements_par_minute")
    .trigger(processingTime="30 seconds")
    .toTable("gold.paiements_par_minute")
)
requete.awaitTermination()
```

## Les réglages essentiels

- **Le checkpoint** (`checkpointLocation`) enregistre les offsets lus et l'état (les fenêtres en cours). Au redémarrage, la requête reprend exactement où elle en était. Chaque requête a **son propre** répertoire de checkpoint, à ne jamais partager ni supprimer à la légère.
- **Le mode de sortie** :
  - `append` : chaque ligne de résultat est émise **une fois**, définitive (pour une agrégation fenêtrée, quand le filigrane a dépassé la fin de la fenêtre) ;
  - `update` : les lignes modifiées sont réémises à chaque micro-batch (résultats provisoires qui s'affinent) ;
  - `complete` : tout le résultat est réémis à chaque fois (petits agrégats seulement).
- **Le déclencheur** (`trigger`) : toutes les N secondes, ou `availableNow=True` pour traiter **tout ce qui est disponible puis s'arrêter**. Ce dernier mode permet de lancer un traitement de flux comme un batch planifié (toutes les 15 minutes par un orchestrateur), en profitant de la gestion incrémentale des offsets et de l'état : un excellent compromis coût / fraîcheur.

> [!WARNING]
> Sans `withWatermark`, une agrégation par fenêtre garde **toutes** les fenêtres en mémoire indéfiniment, puisqu'un événement en retard pourrait toujours arriver : l'état grossit jusqu'à faire tomber le traitement.

# Apache Flink et Flink SQL

**Apache Flink** traite les événements un par un, avec une gestion d'état et de temps très aboutie. Il expose plusieurs API (Java, Python avec PyFlink) et **Flink SQL**, qui permet d'écrire des traitements de flux en SQL standard étendu.

```sql
-- Déclarer le topic Kafka comme une table, avec le temps de l'événement et le filigrane
CREATE TABLE paiements (
    paiement_id  STRING,
    compte_id    STRING,
    pays         STRING,
    montant      DECIMAL(10, 2),
    horodatage   TIMESTAMP(3),
    WATERMARK FOR horodatage AS horodatage - INTERVAL '2' MINUTE
) WITH (
    'connector' = 'kafka',
    'topic' = 'paiements',
    'properties.bootstrap.servers' = 'broker:9092',
    'properties.group.id' = 'flink-paiements',
    'scan.startup.mode' = 'earliest-offset',
    'format' = 'json'
);

-- Nombre et total des paiements par pays, par fenêtre fixe d'une minute
SELECT window_start, window_end, pays, COUNT(*) AS nb_paiements, SUM(montant) AS total
FROM TABLE(
    TUMBLE(TABLE paiements, DESCRIPTOR(horodatage), INTERVAL '1' MINUTE)
)
GROUP BY window_start, window_end, pays;
```

Les fonctions `TUMBLE`, `HOP` (fenêtres glissantes) et `SESSION` correspondent aux trois types de fenêtres. Flink sauvegarde son état par des **checkpoints** périodiques et permet des **savepoints** déclenchés manuellement, pour mettre à jour un traitement sans perdre son état.

## Un exemple de détection

Règle simple de détection de fraude : alerter si une carte enregistre **au moins 3 paiements refusés en 1 minute**, vérifié toutes les 10 secondes.

```sql
SELECT window_end, carte_id, COUNT(*) AS refus
FROM TABLE(
    HOP(TABLE autorisations, DESCRIPTOR(horodatage), INTERVAL '10' SECOND, INTERVAL '1' MINUTE)
)
WHERE statut = 'refuse'
GROUP BY window_start, window_end, carte_id
HAVING COUNT(*) >= 3;
```

Le résultat est lui-même un flux, envoyé par exemple dans un topic Kafka `alertes_fraude` consommé par le service qui bloque la carte.

# Choisir et exploiter

```diagram
type: decision
title: Quel moteur de flux ?
nodes:
  - question: Une fraîcheur de quelques minutes suffit-elle ?
    yes: Micro-batch planifié (Structured Streaming avec availableNow, ou dbt incrémental)
    no: Question suivante
  - question: L'équipe utilise-t-elle déjà Spark ou Databricks, avec une latence de l'ordre de la seconde acceptable ?
    yes: Spark Structured Streaming
    no: Apache Flink (ou un service géré basé sur Flink ou Beam)
```

Exploiter un traitement de flux, c'est surveiller en continu :

- le **retard** de lecture (consumer lag) et le **délai de bout en bout** (temps entre l'événement et la mise à disposition du résultat) ;
- la **taille de l'état** et la durée des checkpoints ;
- le volume d'**événements en retard** écartés ;
- les **redémarrages** et leur cause.

> [!TIP]
> Testez un traitement de flux comme un traitement batch : sur un jeu d'événements fixe, y compris des événements **en désordre** et **en retard**, et vérifiez que les résultats sont ceux attendus. Les deux moteurs permettent d'exécuter la même logique sur des données bornées.

# Exercices

## Exercice 1 : Le mode de sortie

Un tableau de bord affiche le nombre de commandes par tranche de 5 minutes et doit afficher des chiffres **provisoires** dès le début de chaque tranche. Quel mode de sortie Spark choisir ? Et pour alimenter une table de faits où chaque ligne doit être définitive ?

<details>
<summary>Voir la solution</summary>

- Tableau de bord provisoire : **`update`**, qui réémet les fenêtres modifiées à chaque micro-batch ; la destination doit savoir mettre à jour une ligne existante (upsert par fenêtre).
- Table de faits définitive : **`append`**, avec un filigrane : chaque fenêtre est écrite une seule fois, quand elle est fermée.

</details>

## Exercice 2 : L'état qui explose

Un traitement Structured Streaming calcule le nombre de clics par utilisateur et par heure. Après une semaine, il tombe en panne par manque de mémoire. Le code contient `groupBy(F.window("horodatage", "1 hour"), "utilisateur_id")` sans autre réglage. Expliquez et corrigez.

<details>
<summary>Voir la solution</summary>

Sans **filigrane**, Spark ne peut jamais considérer une fenêtre comme close : il conserve l'état de **toutes** les fenêtres horaires de **tous** les utilisateurs depuis le démarrage. Correction : ajouter `.withWatermark("horodatage", "15 minutes")` (tolérance à adapter) avant le `groupBy`. Les fenêtres fermées sont alors purgées de l'état.

</details>

## Exercice 3 : Flink SQL

Écrivez en Flink SQL la requête qui compte, pour chaque page, le nombre de vues par fenêtre glissante de 10 minutes recalculée toutes les minutes, à partir d'une table `vues(page STRING, horodatage TIMESTAMP(3), …)` déjà déclarée avec un filigrane.

<details>
<summary>Voir la solution</summary>

```sql
SELECT window_start, window_end, page, COUNT(*) AS nb_vues
FROM TABLE(
    HOP(TABLE vues, DESCRIPTOR(horodatage), INTERVAL '1' MINUTE, INTERVAL '10' MINUTE)
)
GROUP BY window_start, window_end, page;
```

Dans `HOP`, le premier intervalle est le **pas** (*slide*), le second la **taille** de la fenêtre.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Traiter les flux
center: Écrire la logique comme en batch, laisser le moteur gérer offsets, état, fenêtres et reprises.
points:
  - icon: zap
    title: Structured Streaming
    text: Table infinie, même API que le batch, micro-batchs ; availableNow pour un flux planifié.
  - icon: database
    title: Checkpoint
    text: Offsets et état sauvegardés ; un répertoire par requête, jamais partagé.
  - icon: filter
    title: Modes de sortie
    text: append pour le définitif, update pour le provisoire, complete pour les petits agrégats.
  - icon: code
    title: Flink SQL
    text: WATERMARK dans la table, TUMBLE, HOP, SESSION ; savepoints pour les mises à jour.
  - icon: eye
    title: Exploiter
    text: Retard, délai de bout en bout, taille de l'état, événements en retard écartés.
pitfall: Agréger par fenêtre sans filigrane et voir l'état grossir jusqu'à la panne.
remember: Un flux planifié toutes les 15 minutes offre souvent le meilleur compromis entre fraîcheur et coût.
```
