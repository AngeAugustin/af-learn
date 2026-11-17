---
title: "Les objets Kubernetes"
description: "Cluster, nœud, pod, déploiement, service et namespace : le rôle de chacun, et ce que Kubernetes ne résout pas à votre place."
duration: 65
objectives:
  - Situer cluster, nœud et pod dans l'exécution d'un conteneur
  - Dire ce qu'un Deployment maintient et ce qu'un Service stabilise
  - Utiliser un namespace comme limite de noms et de droits, pas comme un coffre-fort
  - Lister ce qu'il reste à décider en dehors de Kubernetes
---

# Un cluster, des nœuds

Un **cluster** Kubernetes est un groupe de machines piloté par un **plan de contrôle**. Le plan de contrôle expose l'API : vous lui déclarez l'état voulu (`kubectl apply`), il le stocke, et il le réconcilie. Vous ne vous connectez pas aux machines une par une pour lancer les conteneurs.

Un **nœud** est une de ces machines, virtuelle ou physique. Un agent, le kubelet, y reçoit les pods à lancer, tire les images et surveille les conteneurs. Le nœud a une capacité (CPU, mémoire, disque). Quand il disparaît, les pods qui y tournaient doivent être placés ailleurs, **si** un objet a demandé à les maintenir. Un pod créé à la main n'a personne pour le recréer.

Le cluster ne crée pas vos machines tout seul. Quelqu'un (l'infrastructure as code, ou l'offre managée) fournit les nœuds, le réseau entre eux et le plan de contrôle. Kubernetes répartit des conteneurs sur ce parc. Il ne remplace pas le compte cloud, ni le réseau, ni les sauvegardes.

```video
url: https://www.youtube.com/watch?v=NChhdOZV4sY
title: "Kubernetes : l'essentiel en 7 minutes"
channel: "Cookie connecté"
duration: "7:21"
lang: fr
why: "Kubernetes en sept minutes et en français : le cluster, les nœuds, les pods et le rôle de l'orchestrateur."
```

# Le pod est l'unité qu'on planifie

Le **pod** est le plus petit objet que le planificateur place sur un nœud. Il contient un ou plusieurs conteneurs qui partagent le réseau et les volumes du pod. Ils se parlent en `localhost`, ils meurent ensemble. Pour l'API Atelier, le pod contient un conteneur : l'image de l'API, une commande, des sondes, des ressources.

Le pod est **éphémère**. Il a une IP, elle change à chaque recréation. On ne configure pas un client avec l'IP d'un pod. On n'ouvre pas de session SSH pour y installer un correctif : le prochain pod repart de l'image, comme un conteneur recréé.

Un pod « nu », appliqué tel quel, tourne jusqu'au premier incident de nœud ou jusqu'à la fin de son processus. Personne ne le remplace. C'est utile pour comprendre l'API, pas pour servir le trafic. Le travail quotidien passe par un contrôleur qui crée les pods à votre place.

```diagram
type: layers
title: "Où s'exécute l'API"
layers:
  - title: "Cluster"
    text: "L'API Kubernetes et le plan de contrôle qui réconcilient l'état voulu."
  - title: "Nœud"
    text: "Une machine dont le kubelet tire l'image et lance les conteneurs."
  - title: "Pod"
    text: "L'unité planifiée. IP éphémère, un ou plusieurs conteneurs."
  - title: "Conteneur"
    text: "Le processus de l'image, la même recette que sur le poste."
```

# Le déploiement maintient les pods

Un **Deployment** décrit un modèle de pod et le nombre de copies voulues. Le contrôleur crée un ReplicaSet, qui crée les pods. Si un pod meurt, un autre est créé. Si vous changez l'image, le Deployment remplace les pods progressivement (mise à jour continue) et peut revenir à la révision précédente.

Le lien se fait par des **labels**. Le `selector` du Deployment doit retrouver les labels du modèle. S'ils divergent, l'API refuse le manifeste, ou un Service plus loin ne voit plus ses pods. On choisit des labels stables (`app: api`) et on ne les réécrit pas « pour faire joli ».

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: atelier
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: ghcr.io/atelier/api@sha256:9f2c1b0e4a7d8c6f5e4d3c2b1a09876543210fedcba9876543210fedcba98765
          ports:
            - name: http
              containerPort: 8080
```

`replicas: 3` est un souhait. Trois pods d'une application qui garde la session en mémoire ne font pas trois serveurs cohérents : le client change de pod et perd sa session. Le Deployment maintient des copies. Il ne rend pas l'application **sans état** à votre place. Les données durables (la base) ne vivent pas dans le disque éphémère du pod.

Vous appliquez le Deployment. Vous ne créez pas les trois pods à la main, sinon vous avez deux sources de vérité.

# Le service offre une adresse stable

Un **Service** est une adresse stable devant des pods. Il a un nom DNS dans le cluster, `api.atelier.svc.cluster.local`, et une IP virtuelle. Le trafic vers cette adresse est envoyé aux pods dont les labels correspondent au `selector`.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api
  namespace: atelier
spec:
  selector:
    app: api
  ports:
    - port: 80
      targetPort: http
```

Les autres applications appellent `http://api` depuis le même namespace, ou le nom long depuis un autre. Elles ne connaissent pas les IP des pods. Si le sélecteur dit `app: backend` alors que les pods portent `app: api`, le Service existe, le DNS répond, et **aucun pod n'est derrière**. L'erreur classique est un sélecteur qui ne sélectionne rien.

`port: 80` est le port du Service. `targetPort: http` est le port du conteneur, ici nommé dans le Deployment. Les clients parlent au Service. Le pod peut écouter sur 8080 sans que les clients le sachent.

Le Service du quotidien est interne au cluster. L'exposer sur Internet (type LoadBalancer ou Ingress) est un choix du chapitre suivant, pas une propriété automatique de « avoir un Deployment ».

```diagram
type: sequence
title: "Une requête vers l'API"
actors: ["Client du cluster", "Service api", "Pod"]
messages:
  - from: 0
    to: 1
    text: "http://api/ sur le port 80"
  - from: 1
    to: 2
    text: "Vers un pod dont le label est app=api, port 8080"
  - from: 2
    to: 0
    text: "La réponse, sans que le client connaisse l'IP du pod"
```

# Le namespace range, et Kubernetes ne fait pas le reste

Un **namespace** découpe les noms et les droits à l'intérieur du cluster. `atelier` et `monitoring` peuvent chacun avoir un Service `api` sans collision. Les rôles RBAC s'attachent au namespace : l'équipe Atelier déploie dans `atelier`, elle ne lit pas les secrets de `monitoring`. Les quotas limitent le CPU et la mémoire du namespace.

Ce n'est pas un réseau isolé par défaut. Sans **NetworkPolicy**, un pod d'`atelier` peut ouvrir une connexion vers un pod de `monitoring`. Ce n'est pas un chiffrement. Un Secret du namespace est lisible par toute identité qui a le droit `get` sur les secrets, et son contenu est du base64 tant que le cluster n'a pas activé le chiffrement d'etcd. Le namespace range. Il ne remplace ni la politique réseau, ni la gestion des droits, ni un coffre.

```diagram
type: compare
title: "Ce que le cluster prend en charge"
columns:
  - title: "Kubernetes le fait"
    tone: teal
    items:
      - "Placer les pods sur des nœuds"
      - "Recréer un pod si le Deployment le demande"
      - "Offrir un DNS stable devant les pods"
      - "Séparer les noms et les rôles par namespace"
  - title: "Kubernetes ne le fait pas seul"
    tone: rose
    items:
      - "Construire, scanner ou signer l'image"
      - "Rendre l'application sans état, ni sauver la base"
      - "Choisir sondes, ressources, sauvegardes, coûts"
      - "Isoler le réseau ou chiffrer les secrets tout seul"
```

Mettre PostgreSQL « dans Kubernetes » ne lui ajoute pas de sauvegarde, ni de restauration essayée, ni un administrateur. Un opérateur ou une base managée font ce métier. Le cluster exécute ce que les manifestes demandent, y compris une mauvaise image, trois fois, avec application.

L'objet qu'on retient : le Deployment maintient les pods, le Service les rend joignables, le namespace range le tout. Le digest de l'image, les sondes, les ressources et la base restent des décisions écrites par l'équipe, pas des effets secondaires de l'installation de Kubernetes.

```video
url: https://www.youtube.com/watch?v=umXEmn3cMWY
title: "Kubernetes Architecture explained | Kubernetes Tutorial 15"
channel: "TechWorld with Nana"
duration: "13:08"
lang: en
why: "L'architecture de Kubernetes détaillée par TechWorld with Nana : plan de contrôle, nœuds de travail et leurs composants."
```

# Exercices

## Exercice 1 : Trois copies, un nom

L'API doit tourner en trois exemplaires. Les autres services du namespace `atelier` doivent l'appeler par un nom stable. Les outils de monitoring vivent à part, sans partager les noms ni les droits de l'équipe produit.

Quels objets créez-vous, et lequel ne créez-vous pas à la main ?

<details>
<summary>Voir la solution</summary>

Un namespace `atelier` (et un namespace distinct pour le monitoring). Un Deployment `api` avec `replicas: 3` et le label `app: api`. Un Service `api` dont le sélecteur est ce label, port 80 vers le port du conteneur. Les clients appellent `http://api`.

On ne crée pas trois pods à la main : au premier nœud perdu, ils ne reviendraient pas. Le Deployment, via son ReplicaSet, les maintient. Les droits RBAC de l'équipe produit s'arrêtent au namespace `atelier`.

</details>

## Exercice 2 : Le Service ne voit personne

`kubectl get pods` montre trois pods `Running`, label `app: api`. `kubectl get endpoints api` ne montre aucune adresse. Le Service contient `selector: app: backend`. Les appels à `http://api` échouent.

Où est l'erreur, et que corrigez-vous sans recréer les pods un par un ?

<details>
<summary>Voir la solution</summary>

Le sélecteur ne correspond à aucun pod. Le Service et le DNS existent, la liste d'endpoints est vide. On aligne le sélecteur sur `app: api`, le label réellement porté par le modèle du Deployment.

On modifie le manifeste du Service (ou le label du modèle, mais pas les deux dans des sens différents) et on l'applique. Les pods déjà là sont repris dès que les labels matchent. Recréer les pods à la main laisserait le Deployment et le Service en désaccord à la prochaine mise à jour.

</details>

## Exercice 3 : « La base est dans le cluster »

L'équipe a un Deployment PostgreSQL avec un disque, dans le namespace `atelier`. Elle en déduit que les sauvegardes, le chiffrement des secrets et l'isolation réseau sont réglés, « puisque c'est Kubernetes ».

Quelles trois limites rappelez-vous, concrètement ?

<details>
<summary>Voir la solution</summary>

Le Deployment relance le pod, il ne sauvegarde pas les données. Sans sauvegarde et sans restauration déjà essayée, le disque du pod n'est pas un plan de reprise. Un namespace n'isole pas le trafic : sans NetworkPolicy, un autre namespace peut tenter de joindre la base. Un Secret du namespace n'est pas un coffre : quiconque a le droit de le lire obtient le mot de passe, base64 n'est pas un chiffrement.

Kubernetes a placé le conteneur. La sauvegarde, la politique réseau et le secret restent à écrire. Beaucoup d'équipes laissent ici la base à un service managé, et ne gardent dans le cluster que l'API.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Objets Kubernetes"
center: "Le nœud exécute, le pod est éphémère, le Deployment le maintient, le Service le nomme."
points:
  - icon: server
    title: "Nœud"
    text: "Machine du cluster. Le kubelet y lance les conteneurs que l'API a planifiés."
  - icon: puzzle
    title: "Pod"
    text: "Unité placée sur un nœud, IP jetable. On n'y installe pas un correctif à la main."
  - icon: loop
    title: "Deployment"
    text: "Nombre de pods voulu, label stable, remplacement progressif de l'image."
  - icon: network
    title: "Service"
    text: "DNS fixe devant les pods dont le sélecteur tombe juste. Sinon, zéro endpoint."
  - icon: users
    title: "Namespace"
    text: "Noms et droits séparés. Pas un réseau isolé, pas un chiffrement des secrets."
pitfall: "Créer des pods à la main, puis s'étonner qu'ils ne reviennent pas après la perte du nœud."
remember: "Kubernetes réconcilie les objets écrits. Il ne choisit ni l'image, ni la sauvegarde, ni la sonde."
```
