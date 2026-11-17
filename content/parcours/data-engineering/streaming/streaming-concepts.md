---
title: Les concepts du streaming
description: Événements et flux, temps de l'événement et temps de traitement, fenêtres, filigranes et données en retard, garanties de livraison et état.
duration: 50
objectives:
  - Distinguer traitement batch et traitement de flux
  - Différencier temps de l'événement et temps de traitement
  - Choisir un type de fenêtre et gérer les données en retard avec un filigrane
  - Comprendre les garanties de livraison (au plus une fois, au moins une fois, exactement une fois)
---

# Du batch au flux

En batch, on traite un **ensemble fini** de données (la journée d'hier). En streaming, on traite un **flux infini** d'**événements**, au fil de leur arrivée : clics, paiements, mesures de capteurs, changements dans une base (CDC).

Un **événement** est un fait qui s'est produit, à un instant donné, et qui ne change plus : « le paiement 8812 de 42 € a été accepté à 10:14:03 ». On l'**ajoute** au flux, on ne le modifie pas.

```diagram
type: compare
title: Batch et streaming
columns:
  - title: Batch
    tone: blue
    items:
      - Données bornées (une période)
      - Exécution planifiée
      - Latence de minutes à heures
      - Simple à rejouer et à tester
  - title: Streaming
    tone: teal
    items:
      - Flux infini d'événements
      - Exécution continue
      - Latence de millisecondes à secondes
      - État, ordre et retards à gérer
```

Cas d'usage typiques du streaming : détection de fraude, supervision et alertes, recommandations en temps réel, mise à jour continue d'un lakehouse par CDC, tableaux de bord opérationnels.

> [!TIP]
> Le streaming apporte de la **fraîcheur**, au prix de la **complexité**. Un batch toutes les 5 ou 15 minutes (*micro-batch*) suffit souvent et reste bien plus simple à exploiter. Réservez le vrai temps réel aux décisions qui en ont réellement besoin.

# Deux horloges

Chaque événement a au moins deux temps :

- le **temps de l'événement** (*event time*) : quand le fait s'est **produit** (horodatage écrit par l'appareil ou l'application) ;
- le **temps de traitement** (*processing time*) : quand le système de traitement le **voit**.

L'écart peut être de quelques millisecondes… ou de plusieurs heures : un téléphone dans le métro envoie ses événements à la sortie du tunnel ; un partenaire renvoie des données après une panne. Les événements arrivent donc **en désordre**.

> [!IMPORTANT]
> Pour des résultats corrects (« combien de paiements entre 10:00 et 10:05 ? »), on calcule en **temps de l'événement**. Le temps de traitement donne des résultats qui dépendent des aléas du réseau et changent si l'on rejoue le flux.

# Les fenêtres

Un flux étant infini, on ne peut pas « tout agréger ». On découpe le temps en **fenêtres** :

```diagram
type: compare
title: Les trois types de fenêtres
columns:
  - title: Fixes (tumbling)
    tone: blue
    items:
      - Tranches contiguës sans chevauchement
      - 10:00–10:05, 10:05–10:10…
      - Comptages par minute, par heure
  - title: Glissantes (sliding / hopping)
    tone: teal
    items:
      - Fenêtres de durée fixe qui se chevauchent
      - 5 minutes, calculées toutes les minutes
      - Moyennes mobiles, détection de pics
  - title: Sessions
    tone: amber
    items:
      - Délimitées par l'inactivité
      - Une session se ferme après 30 min sans événement
      - Parcours d'un utilisateur sur un site
```

# Filigranes et données en retard

Quand peut-on considérer que la fenêtre 10:00–10:05 est **complète** et publier son résultat ? Jamais avec certitude : un événement de 10:03 peut encore arriver. Le **filigrane** (*watermark*) est l'estimation, par le moteur, que **tous les événements antérieurs à un instant T sont probablement arrivés**.

Un réglage courant : filigrane = plus grand temps d'événement vu − un délai toléré (par exemple 2 minutes).

```diagram
type: flow
title: Cycle de vie d'une fenêtre 10:00–10:05 avec 2 minutes de tolérance
steps:
  - title: Accumulation
    text: Les événements de 10:00 à 10:05 sont agrégés
    tone: blue
  - title: Attente
    text: Le filigrane avance au fil des événements reçus
    tone: amber
  - title: Fermeture
    text: "Filigrane au-delà de 10:07 : le résultat est émis"
    tone: teal
  - title: Retardataires
    text: Écartés, ou résultat corrigé, selon la configuration
    tone: rose
```

Le réglage est un **compromis** :

- délai court → résultats **rapides** mais davantage d'événements en retard ignorés ;
- délai long → résultats **plus complets** mais plus tardifs, et davantage d'état à conserver en mémoire.

Les événements arrivés après la fermeture peuvent être ignorés, envoyés dans un flux séparé pour analyse, ou déclencher une **mise à jour** du résultat déjà émis, selon le moteur et la configuration.

```video
url: https://www.youtube.com/watch?v=sdhwpUAjqaI
title: "Event Time and Watermarks | Apache Flink 101"
channel: "Confluent, an IBM Company"
duration: "11:58"
lang: en
why: "Confluent explique le temps de l'événement et les filigranes dans Apache Flink, les mêmes notions que ce chapitre."
```

# Garanties de livraison

Les pannes (machine qui redémarre, réseau coupé) obligent à **rejouer** une partie des événements. Selon la conception, chaque événement est pris en compte :

| Garantie | Signification | Risque |
|---|---|---|
| **Au plus une fois** (*at-most-once*) | Jamais dupliqué, mais peut être perdu | Perte de données |
| **Au moins une fois** (*at-least-once*) | Jamais perdu, mais peut être traité plusieurs fois | Doublons |
| **Exactement une fois** (*exactly-once*) | Effet comme si chaque événement était traité une seule fois | Plus complexe, plus coûteux |

« Exactement une fois » ne signifie pas que l'événement n'est **physiquement** traité qu'une fois : il peut être rejoué, mais son **effet** n'est appliqué qu'une fois. On l'obtient de deux façons :

1. par des **transactions** qui valident ensemble le résultat et la position de lecture dans le flux (Kafka et Flink le permettent dans certaines configurations) ;
2. plus simplement, par **au moins une fois + écritures idempotentes** : chaque événement a un identifiant unique, et la destination fait un upsert ou ignore les doublons.

> [!TIP]
> En pratique, « au moins une fois » + **idempotence** côté destination est la combinaison la plus robuste et la plus simple. C'est le même principe que pour les pipelines batch.

# L'état

Compter des paiements par fenêtre, détecter qu'un utilisateur a fait trois tentatives échouées en une minute, joindre deux flux : ces traitements doivent **mémoriser** des informations entre les événements. C'est l'**état** (*state*). Un moteur de streaming doit :

- conserver cet état (en mémoire, sur disque local) de façon efficace ;
- le **sauvegarder** régulièrement (*checkpoints*) pour pouvoir reprendre après une panne sans tout recalculer ;
- le **purger** (fenêtres fermées, sessions expirées), sans quoi il grossit indéfiniment.

## Architectures

- L'**architecture lambda** fait tourner en parallèle une chaîne batch (exacte, recalculée) et une chaîne streaming (rapide, approximative), puis fusionne les résultats. Puissante, mais deux bases de code à maintenir.
- L'**architecture kappa** traite tout comme un flux : pour recalculer, on **rejoue** le journal d'événements conservé (Kafka). Plus simple, mais elle suppose de conserver l'historique des événements et un moteur capable de le rejouer.

Aujourd'hui, les moteurs qui unifient batch et streaming (Spark, Flink) et les formats de tables (Iceberg, Delta Lake) qui acceptent des écritures continues rendent les architectures plus simples qu'à l'époque de la lambda.

# Exercices

## Exercice 1 : Quelle fenêtre ?

Quel type de fenêtre pour :

1. Le nombre de commandes par tranche de 15 minutes pour un tableau de bord.
2. Alerter si plus de 100 erreurs se produisent sur n'importe quelle période de 5 minutes, vérifié chaque minute.
3. La durée des visites des utilisateurs d'un site.

<details>
<summary>Voir la solution</summary>

1. **Fixe** (tumbling) de 15 minutes.
2. **Glissante** de 5 minutes avec un pas d'une minute.
3. **Session**, fermée après une période d'inactivité (par exemple 30 minutes).

</details>

## Exercice 2 : Temps de l'événement

Un système compte les passages en caisse par minute en **temps de traitement**. Après une coupure réseau de 10 minutes dans un magasin, les tickets arrivent tous d'un coup. Que montre le graphique ? Comment corriger ?

<details>
<summary>Voir la solution</summary>

Le graphique affiche **zéro** passage pendant 10 minutes, puis un **pic** énorme à la reconnexion : il reflète l'arrivée des données, pas l'activité réelle. Il faut agréger en **temps de l'événement** (horodatage du ticket) avec un **filigrane** suffisamment tolérant, ou accepter des mises à jour tardives des fenêtres concernées.

</details>

## Exercice 3 : Doublons après panne

Un consommateur traite des paiements « au moins une fois » et insère chaque paiement dans une table. Après un redémarrage, des paiements apparaissent en double. Proposez une solution simple.

<details>
<summary>Voir la solution</summary>

Rendre l'écriture **idempotente** : utiliser l'identifiant unique du paiement comme clé, et faire un **upsert** (`INSERT … ON CONFLICT (paiement_id) DO NOTHING` ou `MERGE`). Les événements rejoués après la panne n'ont alors plus d'effet. On obtient un effet « exactement une fois » sans transactions distribuées.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Les concepts du streaming
center: Traiter un flux infini d'événements en temps de l'événement, par fenêtres, malgré retards et pannes.
points:
  - icon: zap
    title: Batch ou flux
    text: Le flux apporte la fraîcheur au prix de la complexité ; un micro-batch suffit souvent.
  - icon: clock
    title: Deux horloges
    text: Temps de l'événement pour des résultats justes, pas temps de traitement.
  - icon: layers
    title: Fenêtres
    text: Fixes, glissantes ou sessions selon la question posée.
  - icon: filter
    title: Filigrane
    text: Estimer quand une fenêtre est complète ; compromis entre rapidité et exhaustivité.
  - icon: check
    title: Garanties
    text: Au moins une fois et écritures idempotentes donnent l'effet exactement une fois.
pitfall: Agréger en temps de traitement et prendre une coupure réseau pour une chute d'activité.
remember: Les événements arrivent en retard et en désordre ; un système de flux doit le prévoir dès sa conception.
```
