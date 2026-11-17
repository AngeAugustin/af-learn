---
title: Bases NoSQL et systèmes distribués
description: Ce qui se passe quand les données ne tiennent plus sur une seule machine (réplication, partitionnement, cohérence, théorème CAP) et les grandes familles de bases NoSQL, avec leurs usages et leurs pièges.
duration: 65
objectives:
  - Expliquer la réplication, le partitionnement et leurs compromis
  - Raisonner sur la cohérence avec le théorème CAP et PACELC
  - Distinguer les familles NoSQL (clé-valeur, document, colonnes larges, graphe, recherche, séries temporelles)
  - Modéliser à partir des requêtes et extraire des données d'une base NoSQL sans la mettre en danger
---

# Pourquoi sortir d'une seule machine ?

Une base relationnelle sur un seul serveur va très loin : quelques téraoctets, des milliers de transactions par seconde, avec PostgreSQL ou MySQL bien réglés. On distribue les données quand l'un de ces trois besoins dépasse ce qu'une machine peut offrir :

- **la disponibilité** : le service doit continuer si un serveur, voire un centre de données, tombe ;
- **le volume** : les données ou le débit d'écriture dépassent la capacité d'une machine ;
- **la latence géographique** : des utilisateurs sur plusieurs continents veulent des réponses rapides.

Distribuer a un prix : le réseau perd des messages, les horloges divergent, des nœuds tombent en panne au milieu d'une écriture. Un Data Engineer n'implémente pas ces systèmes, mais il les **interroge**, les **alimente** et en **extrait** les données ; comprendre leurs garanties évite des erreurs coûteuses.

> [!NOTE]
> « NoSQL » désigne historiquement les bases qui ont abandonné une partie du modèle relationnel pour passer à l'échelle. Le terme est trompeur : beaucoup proposent aujourd'hui un langage proche de SQL, et des bases dites *NewSQL* ou *SQL distribuées* (CockroachDB, YugabyteDB, Google Spanner, TiDB) offrent du SQL transactionnel sur plusieurs machines.

# La réplication : plusieurs copies

**Répliquer**, c'est garder une copie des mêmes données sur plusieurs nœuds, pour survivre aux pannes et répartir les lectures.

```diagram
type: compare
title: Trois façons de répliquer
columns:
  - title: Un leader
    tone: blue
    items:
      - Toutes les écritures passent par le leader
      - Les followers recopient son journal
      - Simple, ordre des écritures clair
      - "PostgreSQL, MySQL, MongoDB, Kafka"
  - title: Plusieurs leaders
    tone: amber
    items:
      - Un leader par région ou par site
      - Écritures locales rapides
      - Conflits possibles entre régions à résoudre
      - Bases multirégions, applications hors ligne
  - title: Sans leader
    tone: teal
    items:
      - Le client écrit sur plusieurs nœuds à la fois
      - "Quorums : W + R > N"
      - Très disponible, pas de bascule
      - "Cassandra, ScyllaDB, DynamoDB"
```

## Synchrone ou asynchrone

- **Réplication synchrone** : l'écriture n'est confirmée qu'après avoir été recopiée. Pas de perte si le leader meurt, mais chaque écriture attend le réseau, et une réplique lente bloque tout.
- **Réplication asynchrone** : l'écriture est confirmée tout de suite, les répliques suivent avec un **retard de réplication** (*replication lag*), de quelques millisecondes à plusieurs minutes sous charge.

Le retard de réplication a des conséquences très concrètes pour un pipeline de données :

> [!WARNING]
> Un job d'extraction qui lit une **réplique en lecture** peut manquer les dernières lignes écrites sur le leader. Si votre extraction incrémentale avance son filigrane jusqu'à « maintenant », les lignes encore en transit sont **perdues définitivement**. Gardez une marge de sécurité (relire les dernières minutes) ou basez-vous sur la position du journal de la réplique plutôt que sur l'horloge.

## Les quorums

Dans un système sans leader avec **N** répliques, on écrit sur **W** nœuds et on lit sur **R** nœuds. Si **W + R > N**, au moins un des nœuds lus a reçu la dernière écriture. Avec N = 3, le réglage classique est W = 2 et R = 2. Avec W = 1 et R = 1, on gagne en vitesse et en disponibilité, mais une lecture peut renvoyer une valeur périmée.

# Le partitionnement : découper les données

Quand les données ne tiennent plus sur un nœud, on les **partitionne** (on parle aussi de *sharding*) : chaque nœud ne détient qu'une partie des lignes. Chaque partition est en général elle-même répliquée.

| Stratégie | Principe | Avantage | Risque |
|---|---|---|---|
| **Par plage de clés** | `A–F` sur le nœud 1, `G–M` sur le nœud 2… | Les requêtes par intervalle restent locales | Points chauds si les clés arrivent dans l'ordre (dates, identifiants croissants) |
| **Par hachage** | `hash(clé) mod nombre de partitions` | Répartition uniforme | Les requêtes par intervalle doivent interroger toutes les partitions |

Le choix de la **clé de partition** est la décision la plus structurante. Une mauvaise clé crée une **partition chaude** (*hot partition*) qui concentre le trafic : tous les événements de la journée partitionnés par date tombent sur le même nœud, ou un client géant écrase la partition qui porte son identifiant.

> [!TIP]
> C'est exactement le même raisonnement que la clé d'un topic Kafka ou le déséquilibre (*skew*) d'une jointure Spark : une bonne clé a **beaucoup de valeurs distinctes**, **réparties uniformément**, et correspond à la façon dont on lit les données.

# Cohérence : CAP et PACELC

## Le théorème CAP

Le théorème **CAP** dit qu'en cas de **partition réseau** (P, des nœuds ne peuvent plus se parler), un système distribué doit choisir entre :

- **C : la cohérence** (au sens de la *linéarisabilité*) : chaque lecture voit la dernière écriture confirmée, comme s'il n'y avait qu'une seule copie ;
- **A, la disponibilité** : chaque nœud qui fonctionne répond, quitte à renvoyer une donnée périmée.

Les pannes réseau étant inévitables, le vrai choix est : **en cas de coupure, refuser de répondre (CP) ou répondre peut-être faux (AP) ?** Une banque qui débite un compte privilégie la cohérence ; un panier d'achat ou un compteur de vues privilégie la disponibilité.

## PACELC : et le reste du temps ?

CAP ne parle que des pannes. **PACELC** complète : s'il y a une Partition, choisir entre **A** et **C** ; **E**lse (sinon, en fonctionnement normal), choisir entre **L**atence et **C**ohérence. Attendre la confirmation de plusieurs répliques, même sans panne, coûte du temps. DynamoDB et Cassandra sont typiquement **PA/EL** ; Spanner ou une base relationnelle à réplication synchrone sont **PC/EC**.

## La cohérence à terme

Beaucoup de systèmes AP offrent une **cohérence à terme** (*eventual consistency*) : sans nouvelle écriture, toutes les répliques finissent par converger. Entre-temps, on peut observer des anomalies :

- **lire sa propre écriture** échoue : on modifie son profil, on recharge la page, l'ancienne valeur réapparaît (la lecture est allée sur une réplique en retard) ;
- **lectures non monotones** : une valeur apparaît puis disparaît selon la réplique interrogée ;
- **conflits d'écriture** : deux régions modifient la même ligne ; il faut une règle de résolution (« la dernière écriture gagne » selon un horodatage, qui peut **perdre silencieusement** une mise à jour).

> [!IMPORTANT]
> « La dernière écriture gagne » repose sur les horloges des machines, qui ne sont jamais parfaitement synchronisées. Deux mises à jour quasi simultanées : l'une disparaît sans erreur. Pour les données qui ne doivent pas se perdre (soldes, stocks), il faut des écritures conditionnelles, des transactions ou des structures conçues pour fusionner (compteurs CRDT).

```video
url: https://www.youtube.com/watch?v=BHqjEjzAicA
title: "CAP Theorem Simplified"
channel: "ByteByteGo"
duration: "5:33"
lang: en
why: "ByteByteGo simplifie le théorème CAP et ce qu'il dit vraiment du choix entre cohérence et disponibilité."
```

# Les familles NoSQL

```diagram
type: layers
title: Six familles de bases et leur question type
layers:
  - title: Clé-valeur
    text: "« Donne-moi la valeur de cette clé » : Redis, Valkey, DynamoDB, etcd"
  - title: Document
    text: "« Donne-moi ce document JSON et filtre sur ses champs » : MongoDB, Couchbase, Firestore"
  - title: Colonnes larges
    text: "« Donne-moi les lignes de cette partition, triées » : Cassandra, ScyllaDB, HBase, Bigtable"
  - title: Graphe
    text: "« Qui est relié à qui, en plusieurs sauts ? » : Neo4j, Amazon Neptune"
  - title: Recherche
    text: "« Quels documents contiennent ces mots, triés par pertinence ? » : Elasticsearch, OpenSearch"
  - title: Séries temporelles
    text: "« Moyenne de cette mesure par minute sur 24 h » : InfluxDB, TimescaleDB, Prometheus"
```

## Clé-valeur

La forme la plus simple : une clé, une valeur opaque. Lectures et écritures en moins d'une milliseconde. **Redis** (et son fork open source **Valkey**) garde tout en mémoire : cache, sessions, compteurs, files simples, limitation de débit. **DynamoDB** est un service géré, durable, qui passe à l'échelle presque sans limite si la clé de partition est bien choisie.

## Document

Chaque enregistrement est un document JSON (BSON pour MongoDB), avec un schéma flexible. On regroupe dans un document ce qui est lu ensemble : une commande **avec** ses lignes, plutôt que deux tables à joindre.

```javascript
// MongoDB : une commande et ses lignes dans un seul document
{
  "_id": "cmd-1042",
  "client_id": "c-77",
  "statut": "expediee",
  "lignes": [
    { "sku": "LIV-001", "qte": 2, "prix": 12.5 },
    { "sku": "STY-014", "qte": 1, "prix": 3.9 }
  ],
  "maj_le": "2026-03-02T09:14:00Z"
}
```

> [!WARNING]
> « Sans schéma » veut dire **schéma implicite** : il existe quand même, il est simplement dans le code des applications. Pour un Data Engineer, c'est un risque : un champ renommé, un `prix` qui devient une chaîne dans la moitié des documents, un sous-document qui devient une liste. Lors de l'ingestion, **validez et typez explicitement** en zone silver, et conservez le JSON brut en bronze.

## Colonnes larges

**Cassandra** et **ScyllaDB** stockent des lignes regroupées par **clé de partition** et triées par **clé de clustering**. Elles encaissent des débits d'écriture énormes (journaux, mesures d'objets connectés, historiques de messages). En contrepartie, on ne peut interroger efficacement **que** selon la clé prévue : pas de jointure, pas de filtre libre.

```sql
-- CQL (Cassandra) : une table conçue pour UNE requête
-- « les dernières mesures d'un capteur pour un jour donné »
CREATE TABLE mesures_par_capteur_jour (
    capteur_id  text,
    jour        date,
    mesure_le   timestamp,
    valeur      double,
    PRIMARY KEY ((capteur_id, jour), mesure_le)
) WITH CLUSTERING ORDER BY (mesure_le DESC);
```

La partition `(capteur_id, jour)` borne la taille de chaque partition à une journée : sans le `jour`, un capteur actif depuis des années créerait une partition gigantesque.

## Graphe

Les nœuds et les relations sont des citoyens de premier rang. Une requête « amis d'amis qui ont acheté ce produit » ou « chemin entre deux comptes suspects » se parcourt en suivant les relations, là où SQL enchaînerait des auto-jointures coûteuses. Usages : détection de fraude, recommandations, graphes de connaissances, lignage de données.

## Moteurs de recherche

**Elasticsearch** et **OpenSearch** construisent un **index inversé** (pour chaque mot, la liste des documents qui le contiennent) : recherche plein texte, tolérance aux fautes, tri par pertinence (BM25), facettes, agrégations rapides sur les journaux. Ils servent aussi de base vectorielle pour la recherche sémantique. Ce ne sont **pas** des bases de référence : l'index se reconstruit à partir d'une source fiable.

## Séries temporelles

Optimisées pour des mesures horodatées ajoutées en continu : compression très forte, agrégation par intervalle de temps, rétention et sous-échantillonnage automatiques (garder la seconde pendant 7 jours, la minute pendant un an). **TimescaleDB** est une extension de PostgreSQL, **InfluxDB** et **Prometheus** (métriques d'infrastructure) des systèmes dédiés.

# Modéliser à partir des requêtes

En relationnel, on modélise les **données** (normalisation) puis on écrit n'importe quelle requête. En NoSQL distribué, on part des **requêtes** : quelles lectures doivent être rapides, avec quelle clé ? On accepte alors la **dénormalisation** et la duplication : la même information peut être stockée dans plusieurs tables, chacune organisée pour une requête.

```diagram
type: decision
title: Faut-il une base NoSQL ?
nodes:
  - question: Une base relationnelle bien indexée (éventuellement avec des répliques en lecture) tient-elle la charge prévue ?
    yes: Rester en relationnel, plus simple et plus flexible
    no: Question suivante
  - question: Les accès se font-ils toujours par une clé connue à l'avance, avec un débit ou un volume très élevé ?
    yes: Clé-valeur ou colonnes larges (DynamoDB, Cassandra)
    no: Question suivante
  - question: Le besoin est-il une recherche plein texte, un parcours de relations ou des séries de mesures ?
    yes: Base spécialisée (recherche, graphe, séries temporelles) alimentée depuis la source de référence
    no: Base document si le schéma varie réellement, sinon relationnel avec colonnes JSON
```

> [!TIP]
> PostgreSQL couvre déjà beaucoup de besoins « NoSQL » : colonnes `jsonb` indexables, recherche plein texte, extension TimescaleDB pour les séries temporelles, pgvector pour les vecteurs. Ajoutez une base spécialisée quand une mesure le justifie, pas par principe : chaque base de plus est un système à exploiter, sécuriser et synchroniser.

# Extraire des données d'une base NoSQL

Côté Data Engineering, le travail le plus fréquent est d'**amener ces données dans le lakehouse ou l'entrepôt** pour l'analytique, sans nuire à l'application.

- **Ne pas scanner la base de production en heures de pointe.** Un parcours complet d'une table DynamoDB ou Cassandra consomme la capacité de lecture provisionnée et ralentit l'application. Préférez les mécanismes d'export prévus (export DynamoDB vers S3, sauvegardes, snapshots) ou une réplique dédiée à l'analytique.
- **Capturer les changements** plutôt que tout relire : DynamoDB Streams, flux de changements MongoDB (*change streams*), CDC de Cassandra ou connecteurs Debezium (voir le chapitre sur le CDC).
- **Aplatir et typer** les documents en zone silver : une ligne par commande, une ligne par ligne de commande (`explode` dans Spark, `UNNEST` en SQL), types explicites, champs inconnus conservés dans une colonne JSON brute.
- **Gérer les suppressions** : un document supprimé ne réapparaît pas dans un export incrémental ; seuls le CDC ou des marqueurs de suppression (*tombstones*) permettent de les propager.

```python
# Aplatir des commandes MongoDB exportées en JSON Lines, avec Polars
import polars as pl

commandes = pl.read_ndjson("bronze/commandes/2026-03-02.jsonl")

lignes = (
    commandes
    .select("_id", "client_id", "lignes")
    .explode("lignes")                     # une ligne par élément de la liste
    .unnest("lignes")                      # sku, qte, prix deviennent des colonnes
    .rename({"_id": "commande_id"})
    .with_columns(
        pl.col("qte").cast(pl.Int32),
        pl.col("prix").cast(pl.Decimal(10, 2)),
    )
)
lignes.write_parquet("silver/lignes_commande/2026-03-02.parquet")
```

# Exercices

## Exercice 1 : Le filigrane trop pressé

Un job extrait chaque nuit les commandes depuis une réplique en lecture PostgreSQL avec `WHERE maj_le > :dernier_filigrane`, puis enregistre `now()` comme nouveau filigrane. Certains jours, des commandes manquent dans l'entrepôt. Expliquez et corrigez.

<details>
<summary>Voir la solution</summary>

La réplique est **asynchrone** : au moment de l'extraction, des lignes déjà écrites sur le leader avec un `maj_le` récent ne sont pas encore arrivées. Le filigrane avance quand même jusqu'à `now()`, et ces lignes ne seront jamais relues.

Corrections possibles :

1. Enregistrer comme filigrane le **`max(maj_le)` réellement lu**, pas l'heure du job.
2. Relire avec une **marge de recouvrement** (`maj_le > filigrane - interval '15 minutes'`) et dédoublonner par clé à l'écriture (upsert idempotent).
3. Surveiller le retard de réplication et retarder l'extraction s'il dépasse un seuil.
4. À plus long terme, passer au **CDC**, qui suit le journal de la base sans dépendre des horloges.

</details>

## Exercice 2 : Choisir la base

Pour chaque besoin, proposez une famille de base et justifiez :

1. Limiter chaque client à 100 appels d'API par minute.
2. Recherche de produits par mots-clés avec tolérance aux fautes de frappe.
3. Stocker 2 millions de mesures par seconde de capteurs industriels, lues par capteur et par jour.
4. Détecter des réseaux de comptes frauduleux qui partagent appareils et adresses.

<details>
<summary>Voir la solution</summary>

1. **Clé-valeur en mémoire** (Redis ou Valkey) : compteur par client et par minute avec expiration automatique.
2. **Moteur de recherche** (Elasticsearch ou OpenSearch), alimenté depuis le catalogue de référence.
3. **Colonnes larges** (Cassandra, ScyllaDB) avec une clé de partition `(capteur_id, jour)` ; une base de séries temporelles convient aussi si les requêtes sont surtout des agrégations temporelles.
4. **Graphe** : les comptes, appareils et adresses sont des nœuds, les relations se parcourent en plusieurs sauts.

</details>

## Exercice 3 : Le document qui change

Vous chargez chaque jour un export JSON de documents MongoDB. Depuis hier, le champ `prix` est parfois un nombre, parfois une chaîne `"12,50"`, et certaines commandes ont un champ `remise` inconnu. Que faites-vous à chaque couche ?

<details>
<summary>Voir la solution</summary>

- **Bronze** : conserver le JSON brut tel quel, sans rien rejeter.
- **Silver** : convertir explicitement `prix` (remplacer la virgule, caster en `decimal`) ; les valeurs non convertibles vont dans une table de **quarantaine** avec la raison du rejet ; le champ `remise` est conservé dans une colonne JSON « champs supplémentaires » en attendant d'être modélisé.
- **Contrôles** : un test qui alerte quand le taux de valeurs non convertibles dépasse un seuil, et un échange avec l'équipe applicative pour formaliser le schéma (contrat de données).

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Bases NoSQL et systèmes distribués
center: Distribuer apporte disponibilité et volume, au prix de compromis sur la cohérence ; on modélise à partir des requêtes.
points:
  - icon: layers
    title: Réplication
    text: Plusieurs copies ; asynchrone = retard de réplication à prendre en compte à l'extraction.
  - icon: network
    title: Partitionnement
    text: La clé de partition décide de tout ; méfiance envers les partitions chaudes.
  - icon: scale
    title: CAP et PACELC
    text: En panne, cohérence ou disponibilité ; sinon, cohérence ou latence.
  - icon: database
    title: Six familles
    text: Clé-valeur, document, colonnes larges, graphe, recherche, séries temporelles.
  - icon: search
    title: Partir des requêtes
    text: Dénormaliser pour les lectures prévues ; PostgreSQL suffit souvent.
  - icon: filter
    title: Extraire proprement
    text: Exports ou CDC plutôt que scans en production ; aplatir et typer en silver.
pitfall: Avancer un filigrane jusqu'à « maintenant » en lisant une réplique en retard, et perdre des lignes pour toujours.
remember: Chaque base de plus est un système à exploiter ; ajoutez-la quand une mesure le justifie.
```
