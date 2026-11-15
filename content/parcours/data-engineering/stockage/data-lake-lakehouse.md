---
title: Data lake et lakehouse
description: Le stockage objet, l'organisation d'un data lake en zones, et les formats de tables ouverts (Apache Iceberg, Delta Lake, Apache Hudi) qui apportent transactions et historique.
duration: 70
objectives:
  - Comprendre les propriétés du stockage objet
  - Organiser un data lake en zones (bronze, silver, gold)
  - Expliquer ce qu'apporte un format de table ouvert
  - Utiliser le voyage dans le temps, l'évolution de schéma et le MERGE sur un lakehouse
  - Exploiter une table au quotidien (compaction, expiration, concurrence, catalogue)
---

# Le stockage objet

Un data lake repose sur un **stockage objet** : Amazon S3, Google Cloud Storage, Azure Blob Storage / ADLS, ou des solutions compatibles S3 installables chez soi (comme MinIO ou Ceph). On y stocke des **objets** (fichiers) identifiés par une clé (`ventes/date_vente=2026-03-02/part-0000.parquet`) dans des **buckets**.

Ses propriétés expliquent son succès :

- **coût très bas** par gigaoctet et capacité pratiquement illimitée ;
- **durabilité** très élevée (données répliquées) ;
- **séparation du stockage et du calcul** : plusieurs moteurs (Spark, Trino, DuckDB, un entrepôt cloud) lisent les mêmes fichiers, et on paie le calcul seulement quand on l'utilise.

Mais ce n'est **pas un système de fichiers** : on ne modifie pas une partie d'un objet, on le **remplace** en entier ; « renommer » un dossier revient à copier puis supprimer chaque objet ; lister des millions d'objets est lent.

# Organiser un data lake

Sans organisation, un data lake devient un marécage. Une convention répandue, popularisée sous le nom d'**architecture médaillon**, distingue trois zones de qualité croissante :

```diagram
type: flow
title: L'architecture médaillon
steps:
  - title: Bronze (brut)
    text: Données telles que reçues, jamais modifiées, historique complet
    tone: amber
  - title: Silver (nettoyé)
    text: Types corrigés, dédoublonné, conforme, jointures de référence
    tone: blue
  - title: Gold (métier)
    text: Tables prêtes à l'usage, agrégats, modèles dimensionnels
    tone: teal
```

- **Bronze** : on conserve les données **brutes** à l'identique. Si une transformation est fausse, on peut toujours **retraiter** depuis cette source.
- **Silver** : données nettoyées et normalisées, à la granularité d'origine (une ligne par événement, par commande…).
- **Gold** : tables orientées usage (indicateurs, tables de faits et de dimensions) consommées par les analystes et les tableaux de bord.

> [!NOTE]
> Les noms varient (*raw / staging / marts*, *landing / curated / consumption*…). L'important est le principe : **séparer le brut immuable du transformé**, et rendre explicite le niveau de confiance de chaque table.

# Les limites des fichiers seuls

Un dossier de fichiers Parquet n'est pas une table de base de données. Plusieurs problèmes apparaissent vite :

- **Pas de transactions** : un lecteur peut voir une écriture à moitié terminée (la moitié des nouveaux fichiers seulement), ou une écriture qui a échoué peut laisser des fichiers orphelins.
- **Modifications et suppressions difficiles** : supprimer les données d'un client (droit à l'effacement du RGPD) oblige à réécrire tous les fichiers concernés, sans garantie d'atomicité.
- **Schéma implicite** : rien n'empêche d'écrire un fichier avec une colonne en trop ou un type différent.
- **Listage coûteux** : trouver quels fichiers lire impose de lister des dossiers entiers.
- **Pas d'historique** : impossible de savoir à quoi ressemblait la table hier.

# Les formats de tables ouverts

Un **format de table** ajoute, au-dessus de fichiers Parquet ordinaires, une couche de **métadonnées** qui décrit précisément quels fichiers composent la table à chaque version. Les trois principaux sont open source :

| Format | Origine | Points notables |
|---|---|---|
| **Apache Iceberg** | Créé chez Netflix, fondation Apache | Partitionnement caché, évolution de partitionnement, large support multi-moteurs |
| **Delta Lake** | Créé par Databricks, Linux Foundation | Journal de transactions, très intégré à Spark et Databricks |
| **Apache Hudi** | Créé chez Uber, fondation Apache | Orienté mises à jour fréquentes et ingestion incrémentale |

```diagram
type: layers
title: Anatomie d'une table lakehouse
layers:
  - title: Catalogue
    text: Associe un nom de table à son état courant (Hive Metastore, AWS Glue, Unity Catalog, catalogue REST Iceberg…)
  - title: Métadonnées de la table
    text: Schéma, partitionnement, liste des versions (snapshots) et des fichiers de chaque version
  - title: Fichiers de données
    text: Fichiers Parquet ordinaires sur le stockage objet
```

Ce que ces formats apportent :

1. **Transactions ACID** : une écriture publie une nouvelle version de façon atomique. Les lecteurs voient l'ancienne version complète ou la nouvelle, jamais un état intermédiaire.
2. **Voyage dans le temps** (*time travel*) : lire la table telle qu'elle était à une version ou à une date donnée.
3. **Évolution de schéma** contrôlée : ajouter, renommer ou élargir une colonne sans réécrire les données.
4. **`UPDATE`, `DELETE` et `MERGE`** en SQL.
5. **Planification efficace** : les métadonnées listent les fichiers et leurs statistiques, sans parcourir les dossiers.
6. **Maintenance** : compaction des petits fichiers, expiration des anciennes versions.

```sql
-- Spark SQL avec un catalogue Iceberg nommé « lake »
CREATE TABLE lake.ventes (
    id         bigint,
    magasin    string,
    montant    decimal(10, 2),
    vendu_le   timestamp
)
USING iceberg
PARTITIONED BY (days(vendu_le));      -- partitionnement « caché » : dérivé de vendu_le

-- Mettre à jour à partir d'un lot de corrections
MERGE INTO lake.ventes AS cible
USING corrections AS src
ON cible.id = src.id
WHEN MATCHED THEN UPDATE SET montant = src.montant
WHEN NOT MATCHED THEN INSERT *;

-- Lire la table telle qu'elle était hier matin
SELECT count(*) FROM lake.ventes TIMESTAMP AS OF '2026-03-01 08:00:00';
```

> [!TIP]
> Avec le **partitionnement caché** d'Iceberg, les utilisateurs filtrent simplement sur `vendu_le` : le moteur traduit automatiquement le filtre en élagage de partitions. Plus besoin d'ajouter une colonne `date_vente` dérivée et de penser à filtrer dessus.

## Le lakehouse

Un **lakehouse** combine le stockage objet ouvert et bon marché du data lake avec les garanties d'un entrepôt (tables, transactions, SQL, gouvernance). Plusieurs moteurs différents peuvent lire et écrire **les mêmes tables** : Spark pour les gros traitements, Trino ou DuckDB pour les requêtes interactives, Flink pour le streaming. Les grands entrepôts cloud prennent aussi en charge la lecture (et souvent l'écriture) de tables Iceberg ou Delta.

> [!IMPORTANT]
> Le voyage dans le temps a une limite : les anciennes versions finissent par être **expirées** pour libérer de l'espace. Et pour le RGPD, une suppression n'est effective que lorsque les anciens fichiers contenant la donnée ont été **physiquement supprimés** par la maintenance (expiration des snapshots, nettoyage des fichiers). Intégrez-le dans vos procédures.

# Exploiter une table lakehouse au quotidien

Créer une table Iceberg ou Delta prend une ligne ; la faire vivre pendant des années demande quelques réflexes.

## Copie à l'écriture ou fusion à la lecture

Une modification (`UPDATE`, `DELETE`, `MERGE`) ne réécrit pas un fichier Parquet en place. Deux stratégies existent :

| Stratégie | Principe | Écriture | Lecture | Adapté à |
|---|---|---|---|---|
| **Copie à l'écriture** (*copy-on-write*) | Les fichiers touchés sont réécrits entièrement avec les lignes modifiées | Lente si peu de lignes changent dans de gros fichiers | Rapide, rien à fusionner | Peu de modifications, beaucoup de lectures |
| **Fusion à la lecture** (*merge-on-read*) | On écrit à part des **fichiers de suppression** (*delete files*, *deletion vectors*) et les nouvelles lignes | Rapide | Le lecteur doit fusionner, de plus en plus lent tant qu'on ne compacte pas | Modifications fréquentes (CDC, corrections) |

Avec la fusion à la lecture, la **compaction** régulière est indispensable : elle réécrit les fichiers en appliquant les suppressions accumulées.

## La maintenance

Trois opérations à planifier dans l'orchestrateur, pour chaque table active :

```sql
-- Iceberg (procédures Spark) - équivalents Delta : OPTIMIZE et VACUUM
-- 1. Compacter les petits fichiers (et appliquer les fichiers de suppression)
CALL lake.system.rewrite_data_files(table => 'silver.commandes',
                                    options => map('target-file-size-bytes', '268435456'));

-- 2. Expirer les anciennes versions au-delà de la rétention voulue
CALL lake.system.expire_snapshots(table => 'silver.commandes',
                                  older_than => TIMESTAMP '2026-02-23 00:00:00',
                                  retain_last => 10);

-- 3. Supprimer les fichiers orphelins (écrits par des jobs échoués, jamais référencés)
CALL lake.system.remove_orphan_files(table => 'silver.commandes');
```

- **Compaction** : un flux ou des micro-lots produisent des milliers de petits fichiers ; les lectures ralentissent et les métadonnées gonflent. On vise des fichiers de l'ordre de 128 Mo à 1 Go.
- **Expiration des versions** : sans elle, le stockage ne fait que grossir et les données supprimées restent lisibles (problème RGPD). La rétention fixe aussi jusqu'où le voyage dans le temps est possible.
- **Fichiers orphelins** : un job interrompu laisse des fichiers jamais publiés ; ils coûtent sans servir.

> [!WARNING]
> Ne supprimez jamais de fichiers d'une table lakehouse « à la main » sur le stockage objet. Les métadonnées les référencent : la table devient illisible. Toute suppression passe par les opérations de maintenance du format.

## Écritures concurrentes

Les formats de tables utilisent un **contrôle de concurrence optimiste** : chaque écrivain prépare sa nouvelle version, puis tente de la publier. Si une autre écriture a été publiée entre-temps sur les **mêmes fichiers**, la publication échoue et doit être **réessayée**. Deux jobs qui ajoutent des lignes dans des partitions différentes coexistent sans problème ; deux `MERGE` simultanés sur la même partition entrent en conflit. On évite donc de planifier des écritures concurrentes sur les mêmes données, ou on les sérialise dans l'orchestrateur.

## Le catalogue

Le **catalogue** sait quelle est la version courante de chaque table et la publie de façon atomique. C'est aussi là que s'appliquent les **droits d'accès**. Le standard qui s'impose est l'**API REST de catalogue Iceberg**, implémentée par Apache Polaris, Unity Catalog, AWS Glue, Snowflake Open Catalog ou Lakekeeper : tout moteur qui parle cette API (Spark, Trino, Flink, DuckDB, les entrepôts cloud) accède aux mêmes tables avec les mêmes droits.

## Faire évoluer le schéma et le partitionnement

- **Ajouter**, **renommer** ou **élargir** une colonne (`int` vers `bigint`) se fait sans réécrire les données : Iceberg identifie les colonnes par un identifiant interne, pas par leur nom.
- Avec Iceberg, on peut **changer le partitionnement** d'une table (passer de `days(vendu_le)` à `hours(vendu_le)` quand le volume grandit) : les anciennes données gardent l'ancien schéma de partitionnement, les nouvelles utilisent le nouveau, et les requêtes fonctionnent sur les deux.

# Exercices

## Exercice 1 : Bronze, silver ou gold ?

Classez ces tables :

1. Les réponses JSON de l'API de paiement, stockées telles quelles.
2. Le chiffre d'affaires mensuel par magasin et par catégorie.
3. Les paiements dédoublonnés, avec montants en `decimal` et dates en UTC.

<details>
<summary>Voir la solution</summary>

1. **Bronze** : brut, immuable.
2. **Gold** : agrégat métier prêt à l'usage.
3. **Silver** : nettoyé, typé, dédoublonné, à la granularité d'origine.

</details>

## Exercice 2 : Le lecteur pressé

Un job écrit 200 nouveaux fichiers Parquet dans le dossier d'une table pendant qu'un analyste lance une requête. Que peut voir l'analyste sans format de table ? Et avec Iceberg ou Delta Lake ?

<details>
<summary>Voir la solution</summary>

Sans format de table, la requête liste les fichiers présents au moment de la lecture : elle peut voir **une partie** des 200 fichiers (résultat incohérent), voire des fichiers d'une écriture qui échouera ensuite.

Avec un format de table, l'écriture n'est visible qu'une fois la **nouvelle version** publiée atomiquement dans les métadonnées. La requête lit la version courante au moment où elle démarre : soit l'état avant, soit l'état après, jamais un mélange.

</details>

## Exercice 3 : Droit à l'effacement

Un client exerce son droit à l'effacement. Ses données figurent dans une table Delta Lake. Décrivez les étapes pour que la suppression soit réellement effective.

<details>
<summary>Voir la solution</summary>

1. `DELETE FROM clients_silver WHERE client_id = …` (et dans toutes les tables dérivées concernées, y compris la zone bronze si elle contient des données personnelles).
2. La suppression crée une **nouvelle version** ; les anciens fichiers contenant la donnée existent toujours pour le voyage dans le temps.
3. Lancer la maintenance qui supprime physiquement les fichiers non référencés au-delà de la période de rétention (`VACUUM` pour Delta Lake ; expiration des snapshots et suppression des fichiers orphelins pour Iceberg).
4. Documenter le délai de rétention dans la politique de conservation des données et vérifier les éventuelles copies (sauvegardes, exports).

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Data lake et lakehouse
center: Des fichiers ouverts sur stockage objet, rendus fiables comme des tables par Iceberg, Delta ou Hudi.
points:
  - icon: cloud
    title: Stockage objet
    text: Bon marché, durable, séparé du calcul ; on remplace un objet, on ne le modifie pas.
  - icon: layers
    title: Bronze, silver, gold
    text: Brut immuable, nettoyé, puis prêt pour le métier.
  - icon: alert
    title: Limites des fichiers seuls
    text: Pas de transactions, suppressions difficiles, schéma implicite, pas d'historique.
  - icon: database
    title: Formats de tables
    text: Métadonnées et snapshots ; ACID, MERGE, évolution de schéma, voyage dans le temps.
  - icon: network
    title: Multi-moteurs
    text: Spark, Trino, DuckDB, Flink et les entrepôts lisent les mêmes tables via le catalogue.
  - icon: tool
    title: Maintenance
    text: Compacter, expirer les versions, supprimer les orphelins ; jamais de suppression à la main.
pitfall: Croire qu'un DELETE efface la donnée alors que d'anciens fichiers restent lisibles par le voyage dans le temps.
remember: Le brut immuable en bronze, c'est l'assurance de pouvoir toujours tout recalculer.
```
