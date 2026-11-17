---
title: "Helm sans catalogue"
description: "Chart, values et release : quand Helm évite des manifestes qui divergent, et quand un fichier YAML simple suffit."
duration: 58
objectives:
  - Définir un chart, des values et une release sans les confondre
  - Paramétrer les environnements par des fichiers de values relus
  - Choisir Helm ou un manifeste simple selon la variation réelle
  - Éviter de cacher un secret ou un paquet illisible derrière un install
---

# Un chart est un paquet de manifestes

Un **chart** est un dossier versionné qui contient des manifestes Kubernetes sous forme de gabarits, plus un `Chart.yaml` et un `values.yaml`. Helm remplit les gabarits avec les values et envoie le résultat à l'API du cluster. Ce n'est pas un second orchestrateur : le cluster voit des Deployment et des Service, comme avec `kubectl apply`.

`Chart.yaml` porte la version **du paquet** (`version`) et, séparément, la version de l'application (`appVersion`). Avancer l'image sans avancer le paquet, ou l'inverse, est normal. Les mélanger dans un seul numéro rend les retours arrière illisibles.

```yaml
# deploy/api/values.yaml
replicaCount: 2

image:
  repository: ghcr.io/atelier/api
  digest: "sha256:9f2c1b0e4a7d8c6f5e4d3c2b1a09876543210fedcba9876543210fedcba98765"

service:
  port: 80
```

```yaml
# extrait de templates/deployment.yaml
image: "{{ .Values.image.repository }}@{{ .Values.image.digest }}"
replicas: {{ .Values.replicaCount }}
```

Le rendu doit rester un YAML que vous savez lire. `helm template atelier-api ./deploy/api -f deploy/api/values.yaml` affiche ce rendu **avant** qu'il touche le cluster. Une review qui ne regarde que les gabarits rate une value qui met `replicas` à 0.

Ce chapitre ne parcourt pas la liste des charts publics. Un chart écrit par quelqu'un d'autre est une **dépendance** : on épingle sa version, on lit les values qui changent la sécurité (ports, droits, images), et on le met à jour comme une bibliothèque. On ne l'installe pas parce que la page d'accueil est convaincante.

```video
url: https://www.youtube.com/watch?v=-ykwb1d0DXU
title: "What is Helm in Kubernetes? Helm and Helm Charts explained  | Kubernetes Tutorial 23"
channel: "TechWorld with Nana"
duration: "14:16"
lang: en
why: "Helm et ses charts expliqués par TechWorld with Nana : modèles, values et releases."
```

# Les values paramètrent, la release installe

Une **release** est une installation nommée d'un chart, dans un namespace. Le même chart peut donner deux releases, `atelier-api` en production et `atelier-api` dans le namespace de staging, ou deux applications si le chart est générique. Le nom de la release est ce que vous mettez à jour, historisez et annulez. Il ne se réutilise pas « pour aller plus vite » au risque d'écraser l'autre environnement.

```text
helm upgrade --install atelier-api ./deploy/api -n atelier --create-namespace -f deploy/api/values.yaml -f deploy/api/values-prod.yaml
```

`--install` crée la release si elle n'existe pas. `upgrade` la met à jour. Le second `-f` l'emporte sur le premier pour les clés qu'il redéfinit. `values-prod.yaml` ne contient que les écarts : le digest, le nombre de réplicas, le nom de domaine. Tout le reste reste dans `values.yaml`, relu une seule fois.

`--set` existe pour un paramètre injecté par la CI, le digest du push par exemple. Un secret passé par `--set` se retrouve dans l'historique du shell **et** dans le secret de release que Helm stocke dans le namespace. On ne s'en sert pas pour un mot de passe. Les values versionnées ne contiennent pas de secret non plus : le gabarit référence un Secret déjà présent (`existingSecret`), créé hors du chart.

`helm history atelier-api -n atelier` liste les révisions. `helm rollback atelier-api 4 -n atelier` revient à la révision 4, values comprises. Cet historique vit dans le namespace. Le supprimer « pour faire propre » supprime le retour arrière.

```diagram
type: flow
title: "Du chart à la release"
steps:
  - title: "Chart"
    text: "Gabarits versionnés, sans secret."
    tone: blue
  - title: "Values"
    text: "Fichiers relus, prod écrase le commun."
    tone: violet
  - title: "Rendu"
    text: "helm template avant d'appliquer."
    tone: amber
  - title: "Release"
    text: "Nom stable, historique, rollback."
    tone: teal
```

# Ce que Helm change vraiment au déploiement

Helm calcule un diff entre la release déjà installée, les values de cette release et le nouveau rendu, puis applique. Le bénéfice concret : **un** gabarit, plusieurs environnements, et un historique de ce qui a été envoyé. Sans ça, on copie `deployment.yaml` en `deployment-prod.yaml` et, trois mois plus tard, les sondes ne sont plus les mêmes.

Le bénéfice s'arrête là où l'équipe ne lit plus le rendu. Un chart de 2 000 lignes pour un seul Deployment est un obstacle, pas un paquet. Les values deviennent un second langage, avec des clés que personne n'ose retirer. Avant d'ajouter une option, on demande si un des environnements s'en sert vraiment.

La CI fait tourner `helm template` et, idéalement, un diff contre ce qui est déjà déployé. L'humain relit ce diff. `helm upgrade` en production part d'une révision identifiée, pas du poste d'une personne qui a des values locales non commitées.

# Quand un manifeste simple suffit

Helm aide quand **la même forme** sert plusieurs fois et que seules des values changent : staging et production, ou cinq services qui partagent le même gabarit. Il aide aussi quand il faut revenir à une révision dont on n'a pas gardé le YAML rendu ailleurs.

Un manifeste simple suffit quand l'objet est unique, court, et lu en entier pendant la review. Un Job de maintenance de trente lignes, un NetworkPolicy, un Namespace : `kubectl apply -f` dans la CI est plus clair qu'un chart. S'il n'y a qu'un environnement et un seul service, trois fichiers YAML versionnés sont un déploiement honnête.

```diagram
type: decision
title: "Chart ou fichiers YAML"
nodes:
  - question: "Le même gabarit sert-il plusieurs environnements ou plusieurs services ?"
    yes: "Helm évite les copies qui divergent. On épingle le chart."
    no: "Question suivante."
  - question: "Le manifeste tient-il en quelques fichiers que la review lit encore en entier ?"
    yes: "kubectl apply de ces fichiers suffit."
    no: "On remet les écarts dans des values, le gabarit reste unique."
```

Le milieu existe : quelques fichiers, et un outil qui ne fait que superposer des patches. L'important n'est pas le logo. C'est que la review voie le YAML final, et qu'une seule source décrive l'API.

# Ce qu'on relit avant d'installer

Avant un premier `helm upgrade --install`, la liste est courte.

- Le rendu `helm template` est un Deployment et un Service que vous auriez acceptés sans Helm.
- L'image est un digest, pas `latest`.
- Aucune value versionnée ne contient de mot de passe, de jeton ou de clé.
- Le namespace et le nom de release visent le bon environnement. Un `--namespace` oublié écrase la release d'à côté si le contexte kubectl pointe ailleurs.
- Vous savez quelle révision `helm history` montrera après coup, et qui a le droit de lancer `rollback`.

> [!WARNING]
> Installer un chart que personne n'a template, c'est appliquer des dizaines d'objets inconnus, avec les droits que le chart demande. On lit d'abord, on épingle ensuite.

Un chart interne d'Atelier, petit, avec deux fichiers de values, est souvent le bon outil. Un catalogue de charts « au cas où » dans le cluster ne l'est pas : chaque release est une surface à patcher le jour où l'image amont bouge.

# Exercices

## Exercice 1 : Deux environnements, un gabarit

Staging doit lancer 1 réplica et le digest de la branche. Production doit lancer 3 réplicas et le digest promu. Aujourd'hui, deux dossiers YAML ont divergé : la readiness n'existe qu'en staging.

Comment vous remettez ça dans un chart sans dupliquer le Deployment ?

<details>
<summary>Voir la solution</summary>

Un seul gabarit contient la readiness, les ressources et la forme de l'image `repository@digest`. `values.yaml` porte les défauts. `values-staging.yaml` et `values-prod.yaml` ne portent que les écarts : `replicaCount` et `image.digest`.

La CI appelle `helm upgrade --install` avec `-f values.yaml -f values-staging.yaml` ou `-f values-prod.yaml`. `helm template` sur les deux combinaisons est dans la review : on vérifie que la readiness est dans les deux rendus. On ne copie plus le Deployment.

</details>

## Exercice 2 : Trente lignes, un seul usage

Un Job vide la table de démonstration en staging. Il tient en trente lignes, il n'existe qu'en staging, et il ne reprend aucun gabarit de l'API.

Pourquoi un chart serait ici du bruit, et comment le Job part-il quand même ?

<details>
<summary>Voir la solution</summary>

Rien ne varie, rien n'est réutilisé, la review peut lire les trente lignes. Un chart ajouterait des values et un historique pour un objet que `kubectl apply -f jobs/vider-demo.yaml` décrit déjà en entier.

La CI de staging applique ce fichier. Production ne l'a pas dans son pipeline. Si un second Job apparaît avec la même forme, il sera temps de factoriser. Pas avant.

</details>

## Exercice 3 : Le mot de passe dans values-prod

`values-prod.yaml` contient `database.password`, commité. L'install passe par `helm upgrade --install` depuis le portable d'une personne, avec en plus `--set database.password=...` « pour être sûr ». Le lendemain, le secret a fuité par le dépôt.

Où le secret s'est-il encore copié, et que faites-vous de la release ?

<details>
<summary>Voir la solution</summary>

Helm stocke les values de la release dans un Secret du namespace. Le mot de passe y est, en plus du dépôt Git et de l'historique du shell à cause de `--set`. Le retirer du fichier ne le retire pas de ces copies.

On **fait tourner** le mot de passe de la base (l'ancien est public). Le chart référence un Secret existant, créé depuis un coffre, sans value `password`. On réinstalle ou on met à jour la release avec des values propres, on vérifie `helm get values` : plus de mot de passe. Le fichier est retiré de Git, et l'historique du dépôt est traité comme compromis pour cette valeur, d'où la rotation, qui est le vrai correctif.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Helm sans catalogue"
center: "Un chart gabarise, les values paramètrent, la release est l'installation qu'on peut annuler."
points:
  - icon: file
    title: "Chart"
    text: "Gabarits plus Chart.yaml. La version du paquet n'est pas celle de l'application."
  - icon: list
    title: "Values"
    text: "Fichiers relus. Le second -f écrase le premier. Pas de secret dedans."
  - icon: rocket
    title: "Release"
    text: "Nom, namespace, historique. helm rollback revient à une révision, values comprises."
  - icon: eye
    title: "Rendu"
    text: "helm template montre le YAML avant le cluster. La review lit ce rendu."
  - icon: scale
    title: "Ou pas Helm"
    text: "Un Job de trente lignes, un seul usage : kubectl apply suffit largement."
pitfall: "Passer un mot de passe par --set le copie dans le shell et dans le Secret de la release."
remember: "Helm quand les copies divergent. Un manifeste quand la review lit encore le fichier entier."
```
