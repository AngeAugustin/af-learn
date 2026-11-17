---
title: "Réplicas, sondes et ressources"
description: "Tenir plusieurs copies, distinguer liveness et readiness, choisir ClusterIP ou LoadBalancer, et poser requests et limits."
duration: 65
objectives:
  - Régler le nombre de réplicas sans confondre copies et haute disponibilité
  - Écrire une sonde de vivacité et une sonde de disponibilité qui ne font pas le même test
  - Choisir ClusterIP ou LoadBalancer selon qui doit joindre le service
  - Poser des requests et des limits à partir de l'usage réel
---

# Plusieurs réplicas, un même modèle

`replicas` est le nombre de pods que le Deployment doit maintenir. Trois réplicas veulent dire trois processus de la **même** image, derrière le même Service, qui répartit les requêtes. Si un pod meurt, il en reste deux le temps qu'un troisième soit créé.

Ce nombre ne corrige pas une image cassée : les trois pods tirent le même digest et plantent ensemble. Il ne corrige pas une application qui stocke la session dans sa mémoire. Il ne protège pas d'un seul nœud : si les trois pods sont placés sur la même machine, la machine emporte le service. On écarte les pods les uns des autres (règle d'anti-affinité, ou topologie du cluster) quand la panne d'un nœud doit laisser des copies ailleurs. Et l'application doit pouvoir perdre un pod sans perdre de données.

Deux, c'est le minimum pour en retirer un pendant une mise à jour et garder du trafic. Un seul réplica est un choix assumé pour un outil interne, pas pour l'API cliente. Monter à dix sans regarder la base ne fait que dix clients de plus sur la même PostgreSQL.

# Liveness et readiness ne font pas le même métier

Une **sonde** est une question posée au conteneur. Deux questions reviennent sans cesse, et les mélanger crée des pannes plus graves que celle qu'on cherchait à détecter.

La sonde de **disponibilité** (readiness) répond à : « peut-on m'envoyer du trafic ? ». Si elle échoue, le pod est retiré des endpoints du Service. Il n'est pas tué. C'est le bon endroit pour un test court de la dépendance vraiment nécessaire, par exemple une requête légère vers la base, si l'API ne peut rien servir sans elle.

La sonde de **vivacité** (liveness) répond à : « ce processus est-il bloqué au point qu'il faille le tuer ? ». Si elle échoue, le kubelet **redémarre** le conteneur. Elle ne doit tester que le processus lui-même : un HTTP `GET /live` qui renvoie 200 dès que l'application peut répondre, sans appeler la base, sans appeler un tiers.

```yaml
readinessProbe:
  httpGet:
    path: /ready
    port: http
  periodSeconds: 5
livenessProbe:
  httpGet:
    path: /live
    port: http
  periodSeconds: 10
```

Le piège classique : une liveness qui vérifie PostgreSQL. La base clignote trente secondes, **tous** les pods échouent à la sonde, Kubernetes les tue tous, la reprise devient une avalanche de redémarrages. La readiness aurait suffi à couper le trafic le temps du creux, sans tuer personne.

Une application lente au démarrage a besoin d'une **startupProbe** : tant qu'elle n'a pas réussi, liveness et readiness attendent. Sans elle, la liveness tue le conteneur qui n'avait pas fini de booter, et le cycle recommence.

```diagram
type: compare
title: "Deux sondes, deux conséquences"
columns:
  - title: "Readiness"
    tone: teal
    items:
      - "Question : puis-je recevoir du trafic ?"
      - "Échec : le pod sort du Service"
      - "Le conteneur continue de tourner"
      - "Peut tester une dépendance indispensable"
  - title: "Liveness"
    tone: rose
    items:
      - "Question : le processus est-il coincé ?"
      - "Échec : le kubelet tue le conteneur"
      - "À réserver au processus lui-même"
      - "Ne doit pas appeler la base ni un tiers"
```

```video
url: https://www.youtube.com/watch?v=rRaUdTQAeZY
title: "What is readiness and liveness probe in Kubernetes? Just in 6 minutes"
channel: "SKSecOps"
duration: "5:46"
lang: en
why: "La différence entre les sondes readiness et liveness de Kubernetes, en six minutes."
```

# ClusterIP ou LoadBalancer

Par défaut, un Service est de type **ClusterIP**. Il n'existe qu'à l'intérieur du cluster. C'est ce qu'il faut pour l'API appelée par d'autres pods, pour l'admin, pour les métriques. Rien sur Internet ne le joint sans un autre objet devant.

Un Service **LoadBalancer** demande au cloud une adresse externe et un répartiteur. La facture suit (une IP, un équilibreur, parfois par service). C'est justifié pour la porte d'entrée publique, rarement pour chaque microservice : ceux-là restent en ClusterIP, et un seul Ingress ou Gateway publie les routes HTTP.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-public
  namespace: atelier
spec:
  type: LoadBalancer
  selector:
    app: api
  ports:
    - port: 80
      targetPort: http
```

NodePort ouvre un port sur **tous** les nœuds. On s'en sert comme brique de certains répartiteurs, pas comme manière habituelle d'exposer l'API. Le choix courant : ClusterIP partout, LoadBalancer (ou Ingress) seulement sur la porte publique.

Publier les métriques ou l'admin en LoadBalancer les met sur Internet avec pour seule protection l'URL. On les laisse en ClusterIP, accessibles depuis le réseau qui opère le cluster.

# Requests et limits, deux chiffres différents

`resources.requests` est ce que le **planificateur** réserve. Un pod qui demande `200m` de CPU et `256Mi` de mémoire ne sera placé que sur un nœud qui a encore au moins ça de libre. Sans request, le pod « pèse » zéro : le planificateur en entasse jusqu'à ce que le nœud étouffe.

`resources.limits` est le **plafond** appliqué au conteneur. Au-delà de la limit mémoire, le processus est tué (`OOMKilled`). Au-delà de la limit CPU, il n'est pas tué : il est ralenti (throttling), et les latences montent sans qu'un redémarrage l'explique.

```yaml
resources:
  requests:
    cpu: "100m"
    memory: 128Mi
  limits:
    cpu: "500m"
    memory: 256Mi
```

`100m` vaut un dixième de cœur. `128Mi` vaut 128 mébioctets. Ces chiffres ne sont pas une recette universelle : on les lit sur le pod réel, sous une charge représentative, puis on met la request près de l'usage courant et la limit mémoire avec une marge. Une limit mémoire sous l'usage normal produit des `OOMKilled` en boucle. Une limit CPU trop basse produit une API lente alors que le nœud a du CPU libre.

Si vous écrivez une limit et pas la request, Kubernetes prend la limit comme request. Le pod devient plus dur à placer que vous ne le pensiez. Mieux vaut écrire les deux, exprès.

```diagram
type: flow
title: "Ce que le planificateur regarde"
steps:
  - title: "Request"
    text: "Réservation pour trouver un nœud."
    tone: blue
  - title: "Placement"
    text: "Le nœud doit avoir la place."
    tone: violet
  - title: "Limit mémoire"
    text: "Au-dessus, le conteneur est tué."
    tone: rose
  - title: "Limit CPU"
    text: "Au-dessus, le processus est ralenti."
    tone: amber
```

Les sondes et les ressources se jugent ensemble. Un pod sans request est le premier évincé quand le nœud manque de mémoire. Une liveness trop nerveuse transforme un pic CPU en redémarrage. On mesure, on écrit les chiffres, on les revoit quand le trafic change. On ne copie pas le bloc d'un tutoriel en espérant qu'il corresponde à Atelier.

# Quand le pod redémarre pour de mauvaises raisons

Un redémarrage est un outil, pas un objectif. Il est légitime quand le processus est vraiment coincé (deadlock, fuite qui a déjà tué le tas). Il est nuisible quand il punît une dépendance, un démarrage lent, ou une limit mémoire irréaliste.

Avant d'ajouter une liveness « pour que ça reparte », on lit la raison : `OOMKilled` se règle dans les ressources, `connection refused` vers la base se règle dans la readiness et dans la base, un boot de quarante secondes se règle avec une startupProbe. Multiplier les réplicas d'un pod qui redémarre en boucle multiplie la boucle.

> [!IMPORTANT]
> La readiness protège les clients. La liveness tue le processus. On ne leur fait pas passer le même test.

# Exercices

## Exercice 1 : La base a cligné

`/health` vérifie PostgreSQL et sert à la fois de liveness et de readiness, toutes les 5 secondes. Pendant 40 secondes, la base refuse les connexions, puis revient. Les trois pods ont redémarré, les requêtes en cours sont perdues, et la base encaisse un pic de reconnexions.

Quelle sonde a aggravé l'incident, et comment séparez-vous les chemins ?

<details>
<summary>Voir la solution</summary>

La **liveness** a tué des processus qui n'étaient pas coincés : ils attendaient la base. Il fallait la laisser sur `/live`, un test qui ne parle qu'au processus.

`/ready` garde le test de PostgreSQL et sert de readiness : pendant les 40 secondes, les pods sortent du Service, personne ne les tue, ils reviennent dès que la base répond. On allonge aussi la période et le seuil d'échec pour qu'un creux d'une seconde ne retire pas tout le monde. On n'ajoute pas de réplicas pour « absorber » des redémarrages provoqués par la sonde.

</details>

## Exercice 2 : L'admin sur Internet

L'API publique doit être joignable par les clients. Le tableau de bord d'administration et les métriques ne doivent être joignables que depuis les pods du cluster. Une proposition met les trois Services en `type: LoadBalancer`.

Que passez-vous en ClusterIP, que laissez-vous exposé, et quel coût évitez-vous ?

<details>
<summary>Voir la solution</summary>

L'API publique peut avoir un LoadBalancer, ou mieux une route d'Ingress vers un Service ClusterIP. L'admin et les métriques restent en **ClusterIP**, sans adresse externe. Les joindre demande d'être dans le cluster (ou derrière le réseau d'exploitation), pas de connaître une URL.

Chaque LoadBalancer est un équilibreur facturé et une porte en plus. En ouvrir trois « parce que le YAML est le même » publie l'admin et paie trois fois. NodePort sur tous les nœuds n'est pas un compromis acceptable pour l'admin : le port est là, sur les machines.

</details>

## Exercice 3 : OOMKilled à 64 Mio

Les pods portent `limits.memory: 64Mi`, aucune request, et redémarrent avec la raison `OOMKilled`. Sous un trafic normal, l'usage observé tourne autour de 180 Mio, avec des pics à 230 Mio. Le nœud héberge pourtant beaucoup d'autres pods.

Que changent les requests et la limit, et pourquoi le planificateur a-t-il autant entassé ?

<details>
<summary>Voir la solution</summary>

Sans request, le pod compte pour presque rien : le planificateur a rempli le nœud. On pose une request mémoire proche de l'usage courant (par exemple `200Mi`) pour que le placement réserve cette place.

La limit à 64 Mio est sous l'usage normal, donc le noyau tue le processus. On la met au-dessus des pics observés, avec une marge (par exemple `320Mi`), pas collée au pic du jour. La limit CPU, si on en met une, reste assez haute pour ne pas ralentir l'API alors que le nœud a du CPU. On revérifie après déploiement : plus d'`OOMKilled`, et le pod refuse d'être planifié sur un nœud déjà plein.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Charge et trafic"
center: "Les réplicas multiplient un pod sain. Les sondes et les ressources décident s'il le reste."
points:
  - icon: layers
    title: "Réplicas"
    text: "Plusieurs copies de la même image. Inutile si l'image est cassée ou la session en mémoire."
  - icon: eye
    title: "Readiness"
    text: "Retire le pod du Service sans le tuer. Peut dépendre de la base."
  - icon: alert
    title: "Liveness"
    text: "Tue le conteneur. Réservée au processus, jamais à PostgreSQL ni à un tiers."
  - icon: network
    title: "ClusterIP"
    text: "Interne. LoadBalancer seulement pour la porte publique, chacun est facturé."
  - icon: gauge
    title: "Requests, limits"
    text: "La request place le pod. La limit mémoire tue, la limit CPU ralentit."
pitfall: "Une liveness qui teste la base transforme un creux de trente secondes en redémarrage général."
remember: "Readiness coupe le trafic. Liveness tue. Les deux tests ne se copient pas."
```
