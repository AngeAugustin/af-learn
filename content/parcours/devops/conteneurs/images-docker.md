---
title: "Images et conteneurs"
description: "Image ou conteneur, couches d'un Dockerfile, .dockerignore, tag qu'on ne réécrit pas, utilisateur non root et une commande par conteneur."
duration: 60
objectives:
  - Distinguer une image et le conteneur qu'on lance à partir d'elle
  - Ordonner un Dockerfile pour le cache et pour exclure les secrets
  - Épingler un tag de version et exécuter le processus sans être root
  - Garder une seule commande principale par conteneur
---

# Une image n'est pas un conteneur

Une **image** est un paquet figé : un système de fichiers en couches, plus la commande à lancer et quelques métadonnées. Elle ne consomme pas de CPU. On peut la copier sur un registre, la tirer sur une autre machine, et obtenir les mêmes fichiers.

Un **conteneur** est un processus lancé à partir de cette image. Il reçoit une couche inscriptible, son propre espace de processus, son réseau, et il vit le temps de son exécution. Dix conteneurs peuvent partir de la même image. Ils ne partagent pas leur couche inscriptible : un fichier créé dans l'un n'existe pas dans l'autre.

Supprimer le conteneur laisse l'image en place. Supprimer l'image ne fait pas disparaître un correctif qu'on aurait appliqué à la main dans un conteneur encore vivant, et l'inverse est tout aussi vrai : un `docker exec` qui installe un paquet modifie le conteneur, pas l'image. Au prochain `docker run`, on repart de l'image. Le correctif a disparu.

```diagram
type: compare
title: "Image et conteneur"
columns:
  - title: "Image"
    tone: blue
    items:
      - "Fichiers en lecture seule, identifiés par un digest"
      - "Se construit, se pousse, se tire"
      - "Ne tourne pas et ne garde aucune modification d'un exec"
  - title: "Conteneur"
    tone: teal
    items:
      - "Processus démarré à partir d'une image"
      - "Couche inscriptible propre à cette instance"
      - "Disparaît avec son disque éphémère, sauf volume monté"
```

On construit l'image une fois par version. On lance autant de conteneurs que le service en a besoin. On ne « répare » pas la production en entrant dans le conteneur.

```video
url: https://www.youtube.com/watch?v=caXHwYC3tq8
title: "Docker : comprendre l'essentiel en 7 minutes"
channel: "Cookie connecté"
duration: "7:12"
lang: fr
why: "Docker en sept minutes et en français : images, conteneurs et ce qui les distingue d'une machine virtuelle."
```

# Le Dockerfile construit des couches

Le **Dockerfile** est la recette. Chaque instruction (`FROM`, `RUN`, `COPY`, `WORKDIR`…) produit une couche. Docker réutilise une couche si l'instruction et les couches d'au-dessus n'ont pas changé. Dès qu'une ligne change, tout ce qui suit est reconstruit.

L'ordre utile va du plus stable au plus volatil. Les dépendances changent moins souvent que le code : on les installe avant de copier `src`.

```dockerfile
FROM python:3.12-slim

RUN useradd --create-home --uid 10001 --shell /usr/sbin/nologin app

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src ./src

USER app
EXPOSE 8080
CMD ["python", "-m", "src.main"]
```

`FROM python:3.12-slim` part d'une base Debian allégée, pas de l'image `python:latest` dont le contenu bouge. `pip install` a sa propre couche : tant que `requirements.txt` est identique, un changement dans `src` ne réinstalle pas les paquets. `EXPOSE 8080` documente le port. Il ne le publie pas sur la machine. La publication se décide au `docker run -p` ou dans Compose.

`CMD` est en **forme exec** : la liste devient le processus n° 1, sans shell autour. La forme `CMD python -m src.main` lance en réalité `sh -c`. Ce shell intercepte souvent `SIGTERM`, et l'application ne s'arrête pas proprement quand le conteneur reçoit l'ordre de quitter.

Un secret copié puis « effacé » reste dans l'image. Si une couche fait `COPY .env .` et qu'une couche plus basse fait `RUN rm .env`, le fichier est encore dans la première couche. Quelqu'un qui tire l'image peut la lire. Un secret n'entre ni dans le contexte de build, ni dans un `ARG` recopié vers un `ENV`.

# Le contexte de build et .dockerignore

`docker build` envoie un **contexte** au démon : le dossier que vous désignez, souvent `.`. Le Dockerfile ne voit que ce dossier. Un `COPY` ne peut pas prendre un fichier hors contexte, et tout fichier du contexte peut finir dans l'image si la recette le copie.

`.gitignore` ne filtre pas cet envoi. Un `.env` présent sur le disque, ignoré par Git, part quand même dans le contexte. **`.dockerignore`** est le filtre du contexte. Il accélère le build et, surtout, empêche des fichiers d'être copiés.

```text
.git
.env
**/.env
.venv
**/__pycache__
**/*.pyc
**/node_modules
tests
docs
```

Le Dockerfile reste dans le contexte : si vous ignorez tout par un `*`, le build n'a plus de recette ni de sources. On liste ce qui est lourd, secret ou inutile, on ne retourne pas la règle.

`COPY . .` avec un ignore incomplet est le geste qui embarque `.git`, les jeux de données et les clés. Préférez des copies nommées (`requirements.txt`, `src`) et un ignore qui couvre quand même les accidents.

# Tag figé et utilisateur non root

Un **tag** est un nom pointé vers une image : `ghcr.io/atelier/api:1.4.2`. `latest` est un tag comme un autre. Il avance à chaque push qui le vise. Déployer `latest`, c'est accepter de ne pas savoir quel binaire tourne, et de ne pas pouvoir nommer la version d'hier au moment d'un retour arrière.

Un tag de version se pousse **une fois**. On ne réécrit pas `1.4.2` pour y glisser un correctif : le correctif s'appelle `1.4.3`. Beaucoup de registres peuvent refuser un second push sur le même tag (politique d'immuabilité). Le tag reste un nom. Le chapitre sur les registres montrera le **digest** `sha256:…`, qui identifie les octets. En attendant, la discipline est déjà celle-ci : la production cite une version, jamais `latest`.

L'utilisateur par défaut de beaucoup d'images est **root**. Le build peut en avoir besoin pour `useradd` et `pip install`. L'exécution, non. `USER app` avec un uid fixe (`10001`) fait tourner l'API sans privilège. Les fichiers de code peuvent rester propriété de root et lisibles : le processus n'a pas à les réécrire. Un dossier que l'application doit écrire (cache, téléchargement) se prépare pendant le build, avec le bon propriétaire, pas avec un `chmod 777`.

Un conteneur root n'est pas « root sur la machine » tant que vous n'ajoutez pas de privilège explicite. C'est quand même un escalier inutile le jour où l'application est compromise. On n'ajoute pas `--privileged` pour faire passer un problème de droits.

# Une commande par conteneur

Le conteneur a **une** commande principale. C'est l'API, ou le worker, ou la migration, pas les trois. Un script qui lance Gunicorn, cron et un agent de logs en arrière-plan laisse un shell comme processus n° 1. Si Gunicorn meurt, le shell peut rester vivant : le conteneur a l'air sain, le service est mort. Les signaux d'arrêt se perdent. Les logs de trois programmes se mélangent dans le même flux, quand ils ne partent pas dans un fichier qui disparaîtra avec le conteneur.

Les journaux vont sur **stdout** et **stderr**. La plateforme les collecte. Un fichier `/var/log/api.log` dans le conteneur n'est ni une rétention ni une rotation.

```diagram
type: flow
title: "Une version, un processus"
steps:
  - title: "Recette"
    text: "Dockerfile ordonné, contexte filtré."
    tone: blue
  - title: "Image 1.4.2"
    text: "Couches figées, utilisateur app."
    tone: violet
  - title: "Conteneurs"
    text: "Plusieurs processus, la même image."
    tone: teal
  - title: "Arrêt"
    text: "SIGTERM au PID 1, puis sortie."
    tone: amber
```

Ce qui n'est pas la commande principale a un autre endroit. Une tâche planifiée est un autre conteneur, lancé par la plateforme. L'envoi des journaux est le travail de l'hôte ou d'un conteneur à côté, pas un démon caché dans l'image de l'API. Un volume monté sert aux données, pas à transformer le conteneur en machine qu'on administre.

> [!WARNING]
> `docker commit` après un exec fabrique une image que personne ne sait reconstruire. La recette reste le Dockerfile versionné.

# Exercices

## Exercice 1 : Le correctif a disparu

En production, une personne entre dans le conteneur de l'API, installe une bibliothèque avec le gestionnaire de paquets, relance le processus, et constate que le bug est parti. Dans la nuit, l'orchestrateur recrée le conteneur. Le bug est revenu.

Expliquez où était le correctif, et quel geste le rend durable.

<details>
<summary>Voir la solution</summary>

Le correctif vivait dans la **couche inscriptible du conteneur**, pas dans l'image. Recréer le conteneur repart de l'image `1.4.2` telle qu'elle a été construite. `docker exec` et `docker commit` ne sont pas une livraison.

Le geste durable : ajouter la dépendance dans `requirements.txt`, reconstruire l'image, la taguer `1.4.3` sans réécrire `1.4.2`, la pousser, et déployer cette version. Le Dockerfile reste la seule recette.

</details>

## Exercice 2 : Un build qui traîne un secret

Le Dockerfile commence par `COPY . .`, puis `RUN pip install -r requirements.txt`, puis `RUN rm -f .env`. Le build est lent à chaque modification d'un commentaire, et un collègue retrouve le mot de passe de la base dans une couche ancienne.

Proposez un ordre d'instructions et un `.dockerignore`.

<details>
<summary>Voir la solution</summary>

`.dockerignore` contient au minimum `.git`, `.env`, `**/.env`, `.venv`, les caches (`__pycache__`, `node_modules`) et les dossiers qui n'ont rien à faire dans l'image (`tests`, `docs`). `.gitignore` ne suffit pas : le fichier présent sur le disque part dans le contexte.

Le Dockerfile copie d'abord `requirements.txt`, lance `pip install`, puis copie seulement `src`. On ne copie plus `.env`, et on ne compte pas sur `rm` : une couche suivante n'efface pas l'historique. Le secret n'a jamais été envoyé. Le cache de `pip` tient tant que la liste des dépendances ne change pas.

</details>

## Exercice 3 : Trois démons, un conteneur

Le script de démarrage lance Gunicorn, un cron de nettoyage et un agent qui lit `/var/log/api.log`. Gunicorn a le droit d'être root « pour ouvrir le port 80 ». Au `docker stop`, le processus met plus de dix secondes à disparaître.

Quels choix corrigez-vous, et où partent les deux tâches qui ne sont pas l'API ?

<details>
<summary>Voir la solution</summary>

L'API est la seule commande du conteneur, en forme exec, avec un utilisateur non root. Le port 80 n'a pas besoin de root dans le conteneur : on publie `80` de l'hôte vers `8080` du conteneur, et l'application écoute sur `8080`.

Le cron est un autre conteneur, ou une tâche planifiée de la plateforme, avec la même image si le code est partagé, et une autre commande. Les journaux vont sur stdout, pas dans un fichier interne. L'agent qui lisait ce fichier n'a plus rien à faire dans l'image : la collecte est dehors.

La forme exec fait de Gunicorn le PID 1, donc `SIGTERM` lui arrive et il peut terminer les requêtes en cours avant de quitter.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Image et conteneur"
center: "On construit une image figée, puis on lance des conteneurs. On ne patche pas le conteneur à la main."
points:
  - icon: layers
    title: "Couches"
    text: "Dépendances stables d'abord, code ensuite. Le cache s'arrête à la première instruction qui change."
  - icon: filter
    title: "Contexte"
    text: ".dockerignore écarte .git, .env et les caches. .gitignore ne protège pas le build."
  - icon: git
    title: "Tag de version"
    text: "On déploie api:1.4.2 une seule fois. latest n'est pas une version, c'est un pointeur mobile."
  - icon: lock
    title: "Pas root"
    text: "Le build peut être root. USER app fixe l'exécution sur un uid sans privilège."
  - icon: terminal
    title: "Une commande"
    text: "Forme exec, logs sur stdout. Cron et collecte de logs vivent ailleurs."
pitfall: "Effacer un secret avec RUN rm laisse le fichier dans la couche qui l'a copié."
remember: "Le correctif durable est un nouveau build tagué, pas un exec dans le conteneur vivant."
```
