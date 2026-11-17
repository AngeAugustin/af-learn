---
title: CDC et architectures orientées événements
description: Mettre en place une capture des changements avec Debezium, appliquer correctement les événements dans le lakehouse, éviter le piège de la double écriture avec le pattern outbox, et faire évoluer les schémas sans casser les consommateurs.
duration: 65
objectives:
  - Configurer une capture des changements PostgreSQL avec Debezium et Kafka Connect
  - Lire un événement de changement et l'appliquer dans l'ordre, suppressions comprises
  - Expliquer le problème de la double écriture et le résoudre avec le pattern outbox
  - Choisir un mode de compatibilité de schéma et faire évoluer un contrat d'événement
---

# Du lot au flux de changements

Le chapitre sur l'ingestion présentait trois stratégies d'extraction : chargement complet, incrémental par filigrane et **capture des changements** (CDC). Ce chapitre passe à la pratique du CDC basé sur le journal, devenu la norme pour répliquer des bases opérationnelles vers l'analytique en quasi temps réel.

Rappel de ce qu'il apporte par rapport à l'incrémental par filigrane :

- les **suppressions** sont capturées (une ligne supprimée n'a plus de `maj_le` à lire) ;
- **tous les états intermédiaires** sont visibles (une commande passée de `créée` à `payée` puis `annulée` dans la même heure) ;
- aucune dépendance aux horloges ni à une colonne `maj_le` correctement maintenue par l'application ;
- une charge minimale sur la base, et une latence de quelques secondes.

```video
url: https://www.youtube.com/watch?v=5KN_feUhtTM
title: "Change Data Capture (CDC) Explained (with examples)"
channel: "Irtiza Hafiz"
duration: "8:18"
lang: en
why: "La capture des changements expliquée avec des exemples, et pourquoi lire le journal de la base vaut mieux que l'interroger régulièrement."
```

# Debezium en pratique

**Debezium** est un ensemble de connecteurs open source (PostgreSQL, MySQL, SQL Server, Oracle, MongoDB…) qui lisent le journal de la base et publient chaque changement. Il tourne le plus souvent dans **Kafka Connect**, mais existe aussi en version autonome (*Debezium Server*) vers d'autres destinations (Kinesis, Pub/Sub, Redis…).

```diagram
type: sequence
title: Le cycle de vie d'un connecteur Debezium
actors: [PostgreSQL, Debezium (Kafka Connect), Kafka, Consommateur]
messages:
  - from: 1
    to: 0
    text: "Crée un slot de réplication logique et note la position du journal (LSN)"
  - from: 1
    to: 0
    text: "Instantané initial : lit le contenu actuel des tables"
  - from: 1
    to: 2
    text: "Publie une lecture (op = r) par ligne existante"
  - from: 0
    to: 1
    text: "Puis transmet en continu les changements du journal depuis le LSN noté"
  - from: 1
    to: 2
    text: "Publie c (création), u (modification), d (suppression), un topic par table"
  - from: 2
    to: 3
    text: "Le consommateur applique les changements dans l'ordre, par clé"
```

## Préparer PostgreSQL

```sql
-- postgresql.conf : wal_level = logical (redémarrage requis)

-- Un utilisateur dédié, avec le strict nécessaire
CREATE ROLE debezium WITH LOGIN REPLICATION PASSWORD '…';
GRANT SELECT ON public.commandes, public.clients TO debezium;

-- Une publication limitée aux tables utiles
CREATE PUBLICATION dbz_publication FOR TABLE public.commandes, public.clients;

-- Pour recevoir l'état complet « avant » d'une ligne modifiée ou supprimée
ALTER TABLE public.commandes REPLICA IDENTITY FULL;
```

## Déclarer le connecteur

```json
{
  "name": "boutique-cdc",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname": "pg-prod.interne",
    "database.port": "5432",
    "database.user": "debezium",
    "database.password": "${file:/secrets/pg.properties:password}",
    "database.dbname": "boutique",
    "plugin.name": "pgoutput",
    "slot.name": "dbz_boutique",
    "publication.name": "dbz_publication",
    "topic.prefix": "boutique",
    "table.include.list": "public.commandes,public.clients",
    "snapshot.mode": "initial"
  }
}
```

Chaque table produit un topic (`boutique.public.commandes`). La **clé** du message est la clé primaire de la ligne : tous les changements d'une même ligne vont donc dans la même partition Kafka et restent **ordonnés**.

> [!WARNING]
> Le **slot de réplication** oblige PostgreSQL à conserver tout le journal non encore lu par Debezium. Si le connecteur s'arrête un week-end, le disque de la base de **production** se remplit. Supervisez la taille du journal retenu (`pg_replication_slots`), alertez sur le retard du connecteur, et fixez une limite (`max_slot_wal_keep_size`) pour protéger la base, quitte à devoir refaire un instantané.

# Lire un événement de changement

Un événement Debezium (simplifié) ressemble à ceci :

```json
{
  "before": { "commande_id": 1042, "statut": "creee",  "montant": 25.40 },
  "after":  { "commande_id": 1042, "statut": "payee",  "montant": 25.40 },
  "op": "u",
  "ts_ms": 1772442840123,
  "source": {
    "table": "commandes",
    "lsn": 48213769240,
    "txId": 903114,
    "ts_ms": 1772442840051
  }
}
```

| Champ | Signification |
|---|---|
| `op` | `c` création, `u` modification, `d` suppression, `r` lecture lors de l'instantané |
| `before` / `after` | État de la ligne avant et après ; `after` est vide pour une suppression |
| `source.lsn` | Position dans le journal : l'**ordre de vérité** des changements |
| `source.ts_ms` | Moment du changement dans la base |
| `ts_ms` | Moment où Debezium a traité l'événement |

Après une suppression, Debezium envoie aussi en général un **tombstone** (un message avec la même clé et une valeur vide), qui permet au **compactage** Kafka d'effacer définitivement la clé du topic.

# Appliquer les changements dans le lakehouse

Deux façons de stocker les changements, souvent combinées :

1. **Le journal des changements** (*changelog*), en insertion seule, en bronze : chaque événement est une ligne. C'est l'historique complet, rejouable.
2. **L'état courant** en silver : une ligne par clé, maintenue par `MERGE`.

```sql
-- Appliquer un lot de changements à l'état courant (Spark SQL, table Iceberg ou Delta)
MERGE INTO silver.commandes AS cible
USING (
    -- Ne garder que le DERNIER changement de chaque clé dans le lot, selon le LSN
    SELECT * FROM (
        SELECT *, row_number() OVER (PARTITION BY commande_id ORDER BY lsn DESC) AS rang
        FROM bronze.commandes_changements
        WHERE lot_id = :lot_id
    ) WHERE rang = 1
) AS src
ON cible.commande_id = src.commande_id
WHEN MATCHED AND src.op = 'd' THEN DELETE
WHEN MATCHED AND src.lsn > cible.lsn THEN UPDATE SET *
WHEN NOT MATCHED AND src.op <> 'd' THEN INSERT *;
```

Les points qui font la différence entre un CDC fiable et un CDC qui dérive :

- **dédoublonner par clé dans le lot** avant le `MERGE` : un `MERGE` échoue (ou devient indéterministe) si plusieurs lignes sources correspondent à la même cible ;
- **ordonner par la position du journal** (`lsn`), jamais par l'heure de réception : les événements peuvent être relivrés ou arriver en désordre entre partitions ;
- **ignorer les changements plus anciens** que l'état déjà appliqué (`src.lsn > cible.lsn`), pour que le rejeu d'un lot soit **idempotent** ;
- **traiter les suppressions**, y compris dans les tables dérivées ;
- choisir entre **suppression physique** et **suppression logique** (`supprime = true`, `supprime_le`) selon les besoins d'historique, sans oublier le RGPD.

> [!TIP]
> Si la cible est un entrepôt, beaucoup d'outils appliquent ce `MERGE` pour vous (connecteurs Kafka vers Snowflake ou BigQuery, Flink CDC, outils d'ingestion gérés). Comprendre la logique reste indispensable pour diagnostiquer un état divergent.

# Le problème de la double écriture

Un service de commandes doit enregistrer la commande en base **et** publier un événement `CommandeCreee` pour les autres services. La tentation :

```python
def creer_commande(cmd):
    db.insert("commandes", cmd)          # 1. écrire en base
    db.commit()
    kafka.produce("commandes", cmd)      # 2. publier l'événement
```

Si le processus plante entre 1 et 2, la commande existe **sans** événement ; si l'on inverse l'ordre, un événement peut annoncer une commande qui n'a jamais été enregistrée. Il n'existe pas de transaction commune à la base et à Kafka : c'est le problème de la **double écriture** (*dual write*).

## Le pattern outbox

La solution : écrire l'événement **dans la même transaction** que la donnée métier, dans une table `outbox`, puis laisser le CDC publier cette table.

```sql
BEGIN;
INSERT INTO commandes (commande_id, client_id, montant) VALUES (1042, 77, 25.40);
INSERT INTO outbox (id, agregat, agregat_id, type, charge_utile)
VALUES (gen_random_uuid(), 'commande', '1042', 'CommandeCreee',
        '{"commande_id": 1042, "client_id": 77, "montant": 25.40}');
COMMIT;
```

```diagram
type: flow
title: Le pattern outbox
steps:
  - title: Transaction unique
    text: Donnée métier + événement dans la table outbox
    tone: blue
  - title: CDC sur l'outbox
    text: Debezium lit la table outbox dans le journal
    tone: amber
  - title: Routage
    text: L'événement part dans le topic de son agrégat
    tone: amber
  - title: Consommateurs
    text: Dédoublonnent par identifiant d'événement
    tone: teal
```

La donnée et l'événement sont écrits **atomiquement**. Debezium fournit une transformation dédiée (*outbox event router*) qui route chaque ligne de l'outbox vers le bon topic. La livraison reste « au moins une fois » : les consommateurs dédoublonnent grâce à l'identifiant unique de l'événement.

> [!NOTE]
> L'outbox a un autre avantage majeur : l'événement publié est un **contrat** conçu pour les consommateurs (`CommandeCreee`), et non le reflet brut d'une table interne. Les équipes applicatives peuvent alors refactorer leur schéma de base sans casser les pipelines en aval.

# Architectures orientées événements

Dans une architecture orientée événements, les services communiquent en publiant des faits (« une commande a été créée ») plutôt qu'en s'appelant directement. Trois styles à ne pas confondre :

| Style | Contenu de l'événement | Conséquence |
|---|---|---|
| **Notification** | « La commande 1042 a changé » | Le consommateur doit rappeler le service pour obtenir les détails |
| **Transfert d'état** (*event-carried state transfer*) | L'état complet utile de la commande | Le consommateur est autonome, mais duplique des données |
| **Event sourcing** | L'événement **est** la source de vérité ; l'état se reconstruit en rejouant tous les événements | Historique parfait, mais complexité forte |

Pour l'analytique, le transfert d'état et l'event sourcing sont des sources idéales : l'historique complet est disponible dans les topics, et le lakehouse n'est qu'un consommateur de plus. On entend souvent aussi parler de **CQRS** (séparer le modèle d'écriture du modèle de lecture) : une table analytique alimentée par des événements en est une forme.

# Faire évoluer les schémas

Un événement est un **contrat** entre producteurs et consommateurs. Le registre de schémas (vu dans le chapitre Kafka) vérifie chaque nouvelle version selon un **mode de compatibilité** :

| Mode | Garantie | Changements autorisés (Avro) | Qui se met à jour en premier ? |
|---|---|---|---|
| **BACKWARD** (par défaut) | Les consommateurs avec le **nouveau** schéma lisent les **anciens** messages | Supprimer un champ, ajouter un champ **avec valeur par défaut** | Les consommateurs |
| **FORWARD** | Les consommateurs avec l'**ancien** schéma lisent les **nouveaux** messages | Ajouter un champ, supprimer un champ qui avait une valeur par défaut | Les producteurs |
| **FULL** | Les deux | Ajouter ou supprimer uniquement des champs avec valeur par défaut | Dans n'importe quel ordre |

Les variantes `*_TRANSITIVE` vérifient la compatibilité avec **toutes** les versions précédentes, pas seulement la dernière : indispensable quand on rejoue des topics conservés longtemps.

> [!IMPORTANT]
> Renommer un champ ou changer son type (`montant` de `float` en `string`) est un **changement cassant** dans tous les modes. La démarche sûre : ajouter le nouveau champ, faire migrer les consommateurs, puis retirer l'ancien, ou publier dans un nouveau topic versionné (`commandes.v2`). Côté CDC, un `ALTER TABLE` en production peut produire ce genre de changement : intégrez l'équipe data dans la revue des migrations de schéma.

# Exercices

## Exercice 1 : L'état qui dérive

Un pipeline applique chaque heure les changements CDC à `silver.commandes` avec ce `MERGE` : `WHEN MATCHED THEN UPDATE SET *` et `WHEN NOT MATCHED THEN INSERT *`, sur tous les événements du lot, triés par `ts_ms` de réception. On constate des commandes supprimées toujours présentes, des statuts revenus en arrière, et des échecs « plusieurs lignes sources pour une même cible ». Corrigez.

<details>
<summary>Voir la solution</summary>

1. **Dédoublonner** le lot : ne garder que le dernier changement de chaque `commande_id`, avec `row_number()` ordonné par `lsn` décroissant (cela supprime l'erreur de lignes multiples).
2. **Ordonner par `lsn`**, la position dans le journal, et non par l'heure de réception.
3. Ajouter `WHEN MATCHED AND src.op = 'd' THEN DELETE` et exclure les suppressions de l'insertion.
4. Ne mettre à jour que si `src.lsn > cible.lsn` : le rejeu d'un lot ancien ne fait plus revenir un statut en arrière, et le traitement devient idempotent.

</details>

## Exercice 2 : Double écriture

Le service de paiement écrit le paiement en base puis publie `PaiementAccepte` dans Kafka. Après un incident, la comptabilité trouve 37 paiements sans événement. Expliquez la cause et la solution.

<details>
<summary>Voir la solution</summary>

C'est le problème de la **double écriture** : le processus a planté (ou Kafka était indisponible) après la validation de la transaction en base et avant la publication. Il n'existe pas de transaction commune aux deux systèmes.

Solution : le **pattern outbox**. Le service insère le paiement et l'événement `PaiementAccepte` dans une table `outbox`, **dans la même transaction**. Debezium lit l'outbox dans le journal et publie l'événement. Si le service plante, soit les deux sont écrits, soit aucun. Les consommateurs dédoublonnent par identifiant d'événement, car la livraison est au moins une fois.

Pour les 37 paiements déjà perdus : rattrapage ponctuel en publiant les événements manquants à partir de la base, de façon idempotente.

</details>

## Exercice 3 : Évolution de schéma

Le topic `commandes` est en compatibilité `BACKWARD`. L'équipe veut : (a) ajouter un champ `canal` ; (b) renommer `montant` en `montant_ttc`. Que proposez-vous ?

<details>
<summary>Voir la solution</summary>

(a) Ajouter `canal` **avec une valeur par défaut** (par exemple `"inconnu"`) : compatible en `BACKWARD`. Les consommateurs qui ont le nouveau schéma lisent les anciens messages en utilisant la valeur par défaut. On met d'abord à jour les consommateurs.

(b) Un renommage est cassant. Démarche : ajouter `montant_ttc` (avec valeur par défaut), faire produire les deux champs pendant une période de transition, migrer tous les consommateurs vers `montant_ttc`, puis retirer `montant`. Alternative : un nouveau topic versionné `commandes.v2`.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: CDC et architectures orientées événements
center: Le journal de la base devient un flux d'événements fiable, à condition de respecter l'ordre, les suppressions et les contrats.
points:
  - icon: database
    title: Debezium
    text: Slot de réplication, instantané initial puis flux continu, un topic par table.
  - icon: alert
    title: Le slot qui gonfle
    text: Un connecteur arrêté fait grossir le journal de production ; superviser et borner.
  - icon: list
    title: Appliquer dans l'ordre
    text: Dédoublonner par clé, ordonner par LSN, gérer les suppressions, rejeu idempotent.
  - icon: lock
    title: Pattern outbox
    text: Donnée et événement dans la même transaction, publiés par le CDC.
  - icon: network
    title: Styles d'événements
    text: Notification, transfert d'état, event sourcing.
  - icon: file
    title: Compatibilité
    text: BACKWARD, FORWARD, FULL ; un renommage est toujours cassant.
pitfall: Publier dans Kafka après le COMMIT en base, et perdre des événements au premier plantage.
remember: L'ordre de vérité, c'est la position dans le journal, pas l'heure de réception.
```
