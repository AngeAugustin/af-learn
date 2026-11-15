---
title: Formats de fichiers et compression
description: "CSV, JSON, Avro et Parquet : stockage par lignes ou par colonnes, compression, partitionnement et taille des fichiers."
duration: 50
objectives:
  - Distinguer stockage orienté lignes et orienté colonnes
  - Connaître les forces et limites de CSV, JSON, Avro et Parquet
  - Comprendre comment Parquet accélère les requêtes analytiques
  - Partitionner et dimensionner les fichiers d'un data lake
---

# Pourquoi le format compte

Dans un data lake, les données vivent dans des **fichiers** sur un stockage objet. Le format de ces fichiers détermine directement :

- le **coût de stockage** (taille sur disque) ;
- la **vitesse et le coût des requêtes** (quantité de données lues) ;
- la **fiabilité** (types préservés ou non, schéma connu ou deviné) ;
- la **compatibilité** avec les outils (Spark, DuckDB, BigQuery, Trino, pandas…).

Sur des volumes importants, passer de CSV à Parquet divise couramment par plusieurs fois la taille des données et le temps des requêtes analytiques. C'est l'une des optimisations les plus rentables du métier.

# Lignes ou colonnes

```diagram
type: compare
title: Deux façons de ranger les mêmes données
columns:
  - title: Orienté lignes (CSV, JSON, Avro)
    tone: blue
    items:
      - Chaque ligne est stockée d'un bloc
      - Idéal pour écrire et lire des enregistrements entiers
      - Une requête sur 2 colonnes lit quand même toutes les colonnes
  - title: Orienté colonnes (Parquet, ORC)
    tone: teal
    items:
      - Les valeurs d'une même colonne sont stockées ensemble
      - Idéal pour agréger quelques colonnes sur beaucoup de lignes
      - Compression bien meilleure (valeurs similaires côte à côte)
```

Une requête analytique typique (`SELECT magasin, sum(montant) FROM ventes GROUP BY magasin`) ne lit que **2 colonnes** sur peut-être 40. En stockage par colonnes, elle ne lit que ces 2 colonnes. En stockage par lignes, elle lit tout.

# Les formats courants

## CSV

Universel et lisible par un humain, mais :

- **aucun type** : tout est texte, le lecteur devine ;
- **pas de schéma** : rien n'indique les noms ni l'ordre attendus des colonnes ;
- des **variantes** innombrables (séparateur `,` ou `;`, guillemets, retours à la ligne dans les champs, encodage) ;
- pas de compression intégrée, lecture obligatoirement complète.

C'est un **format d'échange**, à convertir dès l'ingestion.

## JSON et JSON Lines

JSON représente des données **imbriquées** (objets, listes) : c'est le format des API. Pour stocker de nombreux enregistrements, on utilise **JSON Lines** (ou NDJSON) : **un objet JSON par ligne**, ce qui permet de lire et d'écrire en flux et de découper le fichier.

```text
{"id": 1, "type": "clic", "page": "/accueil", "horodatage": "2026-03-02T09:14:03Z"}
{"id": 2, "type": "achat", "montant": 42.5, "horodatage": "2026-03-02T09:15:47Z"}
```

Les noms des champs sont répétés à chaque ligne : JSON est volumineux et lent à analyser. Bien pour les données brutes reçues, pas pour l'analytique.

## Avro

**Apache Avro** est un format binaire **orienté lignes** avec un **schéma** explicite (décrit en JSON) stocké avec les données. Ses points forts :

- écriture rapide, enregistrement par enregistrement ;
- **évolution de schéma** encadrée (ajouter un champ avec une valeur par défaut, par exemple) ;
- très utilisé pour les **messages** dans Kafka, avec un registre de schémas (module 7).

## Parquet

**Apache Parquet** est le format **colonnes** de référence de l'analytique. Il est lu nativement par Spark, DuckDB, Polars, pandas (via PyArrow), Trino, BigQuery, Snowflake, Athena…

```diagram
type: layers
title: Structure d'un fichier Parquet
layers:
  - title: Fichier
    text: Données + pied de page avec le schéma et les métadonnées
  - title: Groupes de lignes (row groups)
    text: Le fichier est découpé en blocs de lignes
  - title: Morceaux de colonnes (column chunks)
    text: Dans chaque groupe, une colonne stockée d'un bloc, avec ses statistiques (min, max, nombre de NULL)
  - title: Pages
    text: Unité d'encodage et de compression
```

Ce qui rend Parquet rapide :

1. **Projection** : on ne lit que les colonnes demandées.
2. **Saut de blocs** (*predicate pushdown*) : grâce aux statistiques min/max de chaque groupe de lignes, une requête `WHERE vendu_le >= '2026-03-01'` **ignore** les groupes dont le maximum est antérieur.
3. **Encodages** adaptés : dictionnaire (une colonne `pays` avec 30 valeurs distinctes est stockée comme des petits entiers), *run-length encoding* (valeurs répétées), etc.
4. **Compression** par colonne, très efficace sur des valeurs similaires.
5. **Types** et **schéma** préservés, y compris les structures imbriquées.

> [!NOTE]
> **ORC** est un autre format colonnes, historiquement lié à l'écosystème Hive. Il offre des propriétés comparables à Parquet ; Parquet est aujourd'hui le plus largement supporté.

# La compression

| Codec | Taux | Vitesse | Remarque |
|---|---|---|---|
| gzip | Élevé | Lent | Un gros fichier CSV gzippé ne peut pas être découpé pour un traitement parallèle |
| Snappy | Moyen | Très rapide | Longtemps le défaut de Parquet dans Spark |
| Zstandard (zstd) | Élevé | Rapide | Excellent compromis, de plus en plus utilisé par défaut |
| LZ4 | Moyen | Très rapide | Privilégie la vitesse |

Dans Parquet, la compression s'applique **à l'intérieur** du fichier (par page) : le fichier reste découpable quel que soit le codec.

```python
import polars as pl

df = pl.read_csv("ventes.csv")
df.write_parquet("ventes.parquet", compression="zstd")
```

# Partitionner et dimensionner

## Le partitionnement

On range souvent les fichiers dans des dossiers selon une colonne très utilisée dans les filtres, typiquement la **date**. La convention « style Hive » encode la valeur dans le chemin :

```text
s3://entreprise-lake/ventes/date_vente=2026-03-01/part-0000.parquet
s3://entreprise-lake/ventes/date_vente=2026-03-02/part-0000.parquet
s3://entreprise-lake/ventes/date_vente=2026-03-02/part-0001.parquet
```

Une requête filtrée sur `date_vente = '2026-03-02'` ne lit que le dossier correspondant : c'est l'**élagage de partitions** (*partition pruning*).

```sql
-- DuckDB lit les partitions et ignore celles qui ne correspondent pas au filtre
SELECT magasin, sum(montant)
FROM read_parquet('lake/ventes/*/*.parquet', hive_partitioning = true)
WHERE date_vente = '2026-03-02'
GROUP BY magasin;
```

> [!WARNING]
> Ne partitionnez pas sur une colonne à **forte cardinalité** (identifiant client, horodatage à la seconde) : vous obtiendriez des millions de dossiers minuscules. Choisissez une colonne à cardinalité modérée et souvent filtrée (jour, mois, pays).

## Le problème des petits fichiers

Des milliers de fichiers de quelques kilooctets sont lents à traiter : chaque fichier implique une requête au stockage objet, l'ouverture, la lecture des métadonnées. On vise en général des fichiers de **quelques centaines de mégaoctets** (souvent entre 128 Mo et 1 Go) et on **compacte** périodiquement les petits fichiers produits par des écritures fréquentes. Les formats de tables du chapitre suivant automatisent en partie cette maintenance.

# Exercices

## Exercice 1 : Choisir un format

Quel format choisir dans chaque cas ?

1. Des messages d'événements publiés dans Kafka, dont le schéma évoluera.
2. Une table de 2 milliards de ventes interrogée par des analystes en SQL.
3. Un export envoyé chaque semaine à un partenaire qui l'ouvrira dans un tableur.

<details>
<summary>Voir la solution</summary>

1. **Avro** avec un registre de schémas (ou Protobuf) : binaire, compact, évolution de schéma encadrée.
2. **Parquet** (de préférence sous un format de table comme Iceberg ou Delta Lake) : colonnes, compression, saut de blocs.
3. **CSV** (en UTF-8, séparateur et format de date documentés) : c'est un format d'échange lisible par tous.

</details>

## Exercice 2 : Estimer le gain

Une table de 40 colonnes occupe 500 Go en CSV. Une requête quotidienne n'utilise que 3 colonnes. Expliquez qualitativement pourquoi la même requête sur Parquet lit beaucoup moins de données.

<details>
<summary>Voir la solution</summary>

1. **Projection** : Parquet ne lit que les 3 colonnes utiles, environ 3/40 du volume (selon la taille de chaque colonne).
2. **Compression** : les colonnes sont compressées, souvent plusieurs fois plus petites qu'en CSV.
3. **Saut de blocs** : si la requête filtre (par exemple sur une date), les groupes de lignes hors intervalle sont ignorés grâce aux statistiques min/max.
4. **Partitionnement** éventuel : les dossiers hors filtre ne sont même pas ouverts.

Au total, la requête peut lire une petite fraction des 500 Go initiaux. Avec un entrepôt facturé au volume lu, la facture baisse d'autant.

</details>

## Exercice 3 : Mauvais partitionnement

Une équipe partitionne une table d'événements par `utilisateur_id` (8 millions d'utilisateurs). Quels problèmes prévoyez-vous ? Que proposez-vous ?

<details>
<summary>Voir la solution</summary>

Des millions de dossiers contenant chacun de minuscules fichiers : listing très lent, surcoût d'ouverture de fichiers, métadonnées énormes, écritures inefficaces. Les requêtes par période, de loin les plus fréquentes, doivent parcourir toutes les partitions.

Proposition : partitionner par **date** (jour), et trier ou regrouper (*clustering*) les données par `utilisateur_id` à l'intérieur des fichiers pour que les statistiques min/max permettent de sauter des blocs lors des recherches par utilisateur.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Formats de fichiers
center: Stocker en colonnes, compressé et bien partitionné, pour lire le moins de données possible.
points:
  - icon: file
    title: CSV et JSON
    text: Formats d'échange et de données brutes, sans types fiables ; à convertir dès l'ingestion.
  - icon: link
    title: Avro
    text: Binaire orienté lignes, schéma explicite, évolution encadrée ; idéal pour les messages.
  - icon: layers
    title: Parquet
    text: Colonnes, statistiques min/max, encodages, compression ; la référence analytique.
  - icon: zap
    title: Compression
    text: zstd ou Snappy dans Parquet ; un gros CSV gzippé ne se découpe pas.
  - icon: filter
    title: Partitions
    text: Par date ou colonne à cardinalité modérée ; fichiers de centaines de Mo.
pitfall: Partitionner sur une colonne à très forte cardinalité et noyer le lake sous les petits fichiers.
remember: La requête la plus rapide est celle qui ne lit pas les données dont elle n'a pas besoin.
```
