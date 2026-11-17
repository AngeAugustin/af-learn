---
title: Apache Kafka
description: "Le journal d'événements distribué : topics, partitions, offsets, producteurs, groupes de consommateurs, réplication, rétention, schémas et Kafka Connect."
duration: 60
objectives:
  - Expliquer le modèle de Kafka (journal partitionné et répliqué)
  - Produire et consommer des messages en Python avec les bons réglages de fiabilité
  - Comprendre l'ordre, les clés et les groupes de consommateurs
  - Situer Schema Registry, Kafka Connect et les alternatives
---

# Un journal distribué

**Apache Kafka** est une plateforme de **flux d'événements** open source, créée chez LinkedIn puis confiée à la fondation Apache. Son principe est simple : un **journal** (*log*) dans lequel des producteurs **ajoutent** des messages à la fin, et que des consommateurs **lisent** à leur rythme. Les messages ne sont pas supprimés à la lecture : ils sont conservés pendant une **durée de rétention** configurable, et plusieurs applications peuvent lire le même flux indépendamment.

Kafka sert à la fois de **bus d'événements** entre applications, de **tampon** entre des producteurs rapides et des consommateurs plus lents, et de **source** pour les traitements de flux et l'alimentation d'un lakehouse.

# Les concepts

```diagram
type: layers
title: Le modèle de données de Kafka
layers:
  - title: Cluster
    text: Plusieurs serveurs (brokers) qui stockent et servent les données
  - title: Topic
    text: Un flux nommé de messages d'un même type (paiements, clics…)
  - title: Partitions
    text: Le topic est découpé en partitions, réparties sur les brokers ; l'ordre est garanti dans une partition
  - title: Messages et offsets
    text: Chaque message (clé, valeur, horodatage, en-têtes) a une position croissante, l'offset
```

- Un **topic** regroupe des messages d'un même type.
- Il est découpé en **partitions** : c'est l'unité de **parallélisme** et d'**ordre**. L'ordre des messages n'est garanti **qu'à l'intérieur d'une partition**.
- Chaque message d'une partition a un **offset**, sa position (0, 1, 2…).
- La **clé** d'un message détermine sa partition (par hachage) : tous les messages de même clé vont dans la **même partition**, donc restent **ordonnés** entre eux. Choisir comme clé l'identifiant du compte garantit que les événements d'un même compte sont traités dans l'ordre.

## Réplication et durabilité

Chaque partition est **répliquée** sur plusieurs brokers (facteur de réplication, typiquement 3). Une réplique est **leader** (elle reçoit les écritures), les autres la suivent. Si le broker du leader tombe, une réplique à jour prend le relais.

```bash
kafka-topics.sh --bootstrap-server localhost:9092 \
  --create --topic paiements --partitions 6 --replication-factor 3
```

> [!NOTE]
> Depuis Kafka 4.0 (2025), Kafka gère ses propres métadonnées avec le protocole **KRaft** et ne dépend plus de ZooKeeper, ce qui simplifie l'exploitation. Les anciens tutoriels qui installent ZooKeeper sont obsolètes.

## Rétention et compactage

- **Rétention par durée ou par taille** : les messages sont supprimés après, par exemple, 7 jours. Pendant ce délai, un consommateur peut **relire** le flux (pour corriger un bug, ou alimenter un nouveau système).
- **Compactage** (*log compaction*) : Kafka garde au moins le **dernier message de chaque clé**. Le topic devient alors une table de l'état courant (le dernier profil de chaque client), utile notamment pour le CDC.

```video
url: https://www.youtube.com/watch?v=kCLjBcKrbfM
title: "Apache Kafka : comprendre l'essentiel en 4 minutes"
channel: "Cookie connecté"
duration: "4:49"
lang: fr
why: "L'essentiel de Kafka en quatre minutes et en français : topics, partitions, producteurs et consommateurs."
```

# Produire des messages

```python
# pip install confluent-kafka
import json
from confluent_kafka import Producer

producteur = Producer({
    "bootstrap.servers": "localhost:9092",
    "acks": "all",                 # attendre que toutes les répliques à jour aient reçu le message
    "enable.idempotence": True,    # pas de doublon en cas de nouvelle tentative du producteur
})


def rapport(erreur, message):
    if erreur is not None:
        print(f"Échec de l'envoi : {erreur}")


paiement = {"paiement_id": "p_8812", "compte_id": "c_42", "montant": 42.0, "horodatage": "2026-03-02T10:14:03Z"}
producteur.produce(
    "paiements",
    key=paiement["compte_id"],               # même compte → même partition → ordre garanti
    value=json.dumps(paiement).encode(),
    on_delivery=rapport,
)
producteur.flush()                           # attendre l'envoi effectif avant de quitter
```

- `acks=all` : le message n'est confirmé qu'une fois écrit sur toutes les répliques synchronisées. Avec `acks=1` (leader seulement), une panne au mauvais moment peut perdre le message.
- `enable.idempotence` : les nouvelles tentatives du producteur ne créent pas de doublons dans le journal.
- L'envoi est **asynchrone** : sans `flush()`, un programme qui se termine peut perdre les messages encore en mémoire.

# Consommer des messages

Les consommateurs se regroupent en **groupes de consommateurs** (*consumer groups*) : les partitions d'un topic sont **réparties** entre les membres d'un groupe. Chaque partition est lue par **un seul** membre du groupe à la fois.

```diagram
type: compare
title: Groupes de consommateurs sur un topic de 6 partitions
columns:
  - title: Groupe « entrepot » (3 membres)
    tone: teal
    items:
      - Chaque membre lit 2 partitions
      - Ajouter des membres augmente le débit, jusqu'à 6
      - Un 7e membre resterait inactif
  - title: Groupe « fraude » (2 membres)
    tone: amber
    items:
      - Lit les mêmes messages, indépendamment
      - Chaque membre lit 3 partitions
      - Sa propre position dans chaque partition
```

Le nombre de partitions fixe donc le **parallélisme maximal** d'un groupe. Chaque groupe enregistre sa **position** (l'offset déjà traité) dans chaque partition : c'est le **commit** des offsets.

```python
from confluent_kafka import Consumer

consommateur = Consumer({
    "bootstrap.servers": "localhost:9092",
    "group.id": "chargement-entrepot",
    "auto.offset.reset": "earliest",   # pour un nouveau groupe : lire depuis le début
    "enable.auto.commit": False,       # on valide la position nous-mêmes, après traitement
})
consommateur.subscribe(["paiements"])

try:
    while True:
        message = consommateur.poll(1.0)
        if message is None:
            continue
        if message.error():
            print(f"Erreur : {message.error()}")
            continue
        paiement = json.loads(message.value())
        enregistrer_paiement(paiement)                      # upsert idempotent sur paiement_id
        consommateur.commit(message=message, asynchronous=False)
finally:
    consommateur.close()
```

> [!IMPORTANT]
> Valider l'offset **après** le traitement donne une garantie « **au moins une fois** » : si le consommateur tombe entre le traitement et la validation, le message sera relu. D'où l'écriture **idempotente** (upsert sur `paiement_id`). Valider **avant** le traitement donnerait « au plus une fois » : un message peut être perdu.

En production, on traite et on valide souvent **par lots** de messages pour le débit, et on surveille le **retard** (*consumer lag*) de chaque groupe : l'écart entre le dernier message produit et le dernier traité. Un retard qui grandit signale un consommateur trop lent ou en panne.

# L'écosystème

## Schémas

Les messages sont de simples octets : rien n'empêche un producteur d'envoyer un format inattendu qui ferait échouer tous les consommateurs. Un **registre de schémas** (*Schema Registry*, par exemple celui de Confluent ou d'Apicurio) stocke les schémas (Avro, Protobuf ou JSON Schema) et vérifie que chaque nouvelle version reste **compatible** avec les précédentes selon un mode choisi (par exemple : ajouter un champ avec une valeur par défaut est accepté, renommer un champ ou changer son type ne l'est pas). Les modes de compatibilité sont détaillés dans le chapitre sur le CDC.

## Kafka Connect

**Kafka Connect** exécute des **connecteurs** prêts à l'emploi, sans écrire de code :

- connecteurs **source** : base de données → Kafka (Debezium pour le CDC), fichiers, API ;
- connecteurs **sink** : Kafka → entrepôt, stockage objet, Elasticsearch, tables Iceberg…

```diagram
type: flow
title: Une chaîne CDC typique autour de Kafka
steps:
  - title: PostgreSQL
    text: Base de l'application
    tone: blue
  - title: Debezium
    text: Connecteur source (Kafka Connect)
    tone: amber
  - title: Kafka
    text: Un topic par table, schémas dans le registre
    tone: amber
  - title: Connecteur sink
    text: Écriture continue
    tone: teal
  - title: Lakehouse
    text: Tables Iceberg ou Delta à jour en quelques minutes
    tone: teal
```

## Alternatives et services gérés

Exploiter un cluster Kafka demande des compétences. On utilise souvent un service géré : Confluent Cloud, Amazon MSK, Aiven, ou des implémentations compatibles avec le protocole Kafka comme Redpanda. Les clouds proposent aussi leurs propres services de flux, avec des modèles proches : **Amazon Kinesis Data Streams**, **Google Cloud Pub/Sub**, **Azure Event Hubs** (qui expose aussi une interface compatible Kafka). **Apache Pulsar** est une autre plateforme open source.

# Exercices

## Exercice 1 : Choisir la clé

Un topic `mouvements_stock` reçoit les entrées et sorties de stock de 20 000 produits dans 300 entrepôts. Le consommateur calcule le stock courant de chaque produit dans chaque entrepôt. Quelle clé de message choisir ? Pourquoi ?

<details>
<summary>Voir la solution</summary>

La clé `(entrepot_id, produit_id)` (par exemple la chaîne `"E12:P4471"`). Tous les mouvements d'un même produit dans un même entrepôt vont dans la même partition et sont donc **lus dans l'ordre**, condition nécessaire pour un stock correct. La clé reste assez variée pour bien répartir la charge entre les partitions (une clé `entrepot_id` seule risquerait de déséquilibrer si un entrepôt domine).

</details>

## Exercice 2 : Dimensionner les partitions

Un topic a 4 partitions. L'équipe lance 10 instances du consommateur dans le même groupe pour aller plus vite. Que se passe-t-il ?

<details>
<summary>Voir la solution</summary>

Seules **4 instances** reçoivent des partitions ; les 6 autres restent **inactives** (elles prendront le relais en cas de panne d'un membre). Le parallélisme maximal d'un groupe est égal au nombre de partitions. Pour aller plus vite, il faut plus de partitions (en sachant qu'augmenter le nombre de partitions modifie la répartition des clés pour les nouveaux messages), ou un traitement plus efficace par message.

</details>

## Exercice 3 : Perte ou doublon ?

Pour chaque configuration, indiquez le risque :

1. Producteur avec `acks=0`.
2. Consommateur qui valide l'offset avant de traiter le message.
3. Consommateur qui valide l'offset après avoir traité le message, avec une insertion simple dans une table.

<details>
<summary>Voir la solution</summary>

1. **Perte** : le producteur n'attend aucune confirmation, un message peut être perdu sans qu'il le sache.
2. **Perte** (au plus une fois) : si le consommateur tombe après la validation mais avant la fin du traitement, le message ne sera jamais retraité.
3. **Doublons** (au moins une fois) : un message traité mais dont l'offset n'a pas été validé avant une panne sera retraité et inséré une seconde fois. Solution : upsert sur un identifiant unique.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Apache Kafka
center: Un journal d'événements partitionné et répliqué, que plusieurs applications lisent chacune à son rythme.
points:
  - icon: layers
    title: Topics et partitions
    text: Le parallélisme et l'ordre se jouent par partition ; offset = position du message.
  - icon: key
    title: La clé
    text: Même clé, même partition, ordre garanti ; elle doit aussi bien répartir la charge.
  - icon: shield
    title: Fiabilité
    text: Réplication, acks=all, producteur idempotent, flush avant de quitter.
  - icon: users
    title: Groupes de consommateurs
    text: Partitions réparties entre membres ; offsets validés après traitement ; surveiller le lag.
  - icon: link
    title: Écosystème
    text: Registre de schémas, Kafka Connect et Debezium, services gérés ; KRaft depuis Kafka 4.
pitfall: Lancer plus de consommateurs que de partitions en espérant aller plus vite.
remember: Valider après traitement et écrire de façon idempotente, c'est ne rien perdre et ne rien doubler.
```
