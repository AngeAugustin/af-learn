---
title: "Compose sur le poste"
description: "Décrire une API et sa base avec Docker Compose, réseaux, volumes, et ce qu'il ne faut pas recopier tel quel en production."
duration: 60
objectives:
  - Décrire une application et sa base dans un fichier Compose
  - Relier les services par le réseau du projet et persister les données dans un volume
  - Repérer mots de passe, ports publiés et depends_on comme des choix de poste local
  - Dire ce qui doit changer avant qu'un fichier Compose serve de modèle en production
---

# Décrire l'application et sa base

**Docker Compose** lance plusieurs conteneurs décrits dans un fichier, en général `compose.yaml`. Sur le poste, c'est le moyen le plus court d'avoir l'API **et** PostgreSQL, avec les mêmes commandes pour toute l'équipe : `docker compose up`, `docker compose down`.

Voici un fichier suffisant pour le développement. Le mot de passe est volontairement trivial, et il ne sort pas de la machine.

```yaml
name: atelier

services:
  api:
    build: .
    ports:
      - "8080:8080"
    environment:
      DATABASE_URL: postgres://atelier:atelier@db:5432/atelier
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16.4
    environment:
      POSTGRES_USER: atelier
      POSTGRES_PASSWORD: atelier
      POSTGRES_DB: atelier
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U atelier -d atelier"]
      interval: 5s
      timeout: 3s
      retries: 10

volumes:
  pgdata:
```

`docker compose up` construit l'API à partir du Dockerfile du dossier, tire `postgres:16.4`, crée le volume et le réseau, puis démarre les deux services. Le nom de projet `atelier` préfixe ce que Compose crée : on voit tout de suite quels conteneurs appartiennent à cette application.

Ce fichier décrit un **poste**, pas un site. La suite du chapitre dit précisément ce qui est légitime ici et interdit plus loin.

# Le réseau interne de Compose

Compose crée un **réseau** pour le projet. Chaque service y a un nom DNS : depuis le conteneur `api`, l'hôte `db` est PostgreSQL. Depuis le conteneur `db`, l'hôte `api` est l'application. On n'écrit pas d'adresse IP dans la configuration. Ces adresses changent à chaque création de conteneur.

`localhost` dans le conteneur `api` désigne **le conteneur api**, pas votre machine, et pas la base. Une `DATABASE_URL` copiée depuis un tutoriel avec `@localhost:5432` échoue dès que l'API tourne dans Compose : rien n'écoute sur le port 5432 de ce conteneur. L'hôte correct est le nom du service, `db`.

```diagram
type: flow
title: "Qui parle à qui"
steps:
  - title: "Votre navigateur"
    text: "localhost:8080 sur le poste."
    tone: blue
  - title: "Conteneur api"
    text: "Le port 8080 publié vers l'hôte."
    tone: teal
  - title: "Nom DNS db"
    text: "Réseau Compose, port 5432 non publié."
    tone: violet
  - title: "PostgreSQL"
    text: "Données dans le volume pgdata."
    tone: amber
```

Le port `8080:8080` est une publication **vers le poste** : la partie gauche est le port de la machine, la partie droite celui du conteneur. La base n'a pas de clé `ports`. Elle n'est joignable que depuis le réseau Compose. Pour ouvrir un client SQL, on passe par le conteneur : `docker compose exec db psql -U atelier -d atelier`. Publier `5432:5432` « pour voir » expose la base sur la machine, avec le mot de passe du fichier.

Deux projets Compose ne partagent pas leur réseau par défaut. `db` dans un autre dossier n'est pas le `db` d'Atelier. C'est une isolation utile : une base de test ne se mélange pas à la base de l'application.

# Les volumes et la durée de vie des données

Sans volume, les fichiers de PostgreSQL vivent dans la couche inscriptible du conteneur. `docker compose down` supprime ce conteneur, donc les données. Un **volume nommé** (`pgdata`) est géré par Docker, en dehors du conteneur. Les conteneurs passent, le volume reste.

`docker compose down` enlève les conteneurs et le réseau, **pas** les volumes nommés. `docker compose down -v` enlève aussi les volumes. Le drapeau est pratique pour repartir d'une base vide. Il est aussi le moyen le plus rapide d'effacer le jeu de données local que personne n'avait exporté.

Un **bind mount** (`./src:/app/src`) est un autre outil, réservé au code que vous éditez : le fichier sur le poste est le fichier dans le conteneur, le rechargement automatique fonctionne. Ce n'est pas un stockage de base. Les droits UID de PostgreSQL et un dossier du poste se marchent dessus, et le chemin `./src` n'existe pas sur un serveur de production.

La base locale n'est pas une sauvegarde. Un volume Docker sur un portable ne remplace ni un export, ni une base managée. On y met des données synthétiques.

# depends_on, ports et mots de passe

`depends_on` sans condition attend seulement que le conteneur `db` soit **démarré**. PostgreSQL n'accepte pas encore les connexions : l'API part, échoue, et redémarre si vous avez mis une politique de redémarrage. `condition: service_healthy` attend la sonde `pg_isready`. C'est le bon réglage en local. Ce n'est toujours pas une garantie pour la vie du service : si la base tombe une heure plus tard, Compose ne réécrit pas la topologie, il redémarre des conteneurs sur une seule machine.

Le mot de passe `atelier` est un **choix de poste**, identique pour tout le monde, assumé parce que la base n'écoute pas sur le réseau de l'entreprise. Le jour où le fichier est recopié sur un serveur, ce mot de passe devient un secret publié dans Git. Les variables sensibles du poste vivent dans un fichier `.env` **non versionné**, référencé par Compose, ou dans l'environnement du shell. On ne « durcit » pas le mot de passe local en le compliquant dans le fichier commité : on arrête de committer le secret.

`image: postgres:16.4` fixe une version mineure. C'est assez pour le poste. `postgres:latest` ferait changer la base au prochain tirage, y compris un lundi matin où personne n'a demandé de migration.

> [!IMPORTANT]
> Un `restart: unless-stopped` masque un crash en relançant l'API en boucle. En local, regardez les logs (`docker compose logs api`) au lieu d'ajouter un redémarrage pour faire taire l'erreur.

```video
url: https://www.youtube.com/watch?v=HG6yIjZapSA
title: "Docker Compose Tutorial"
channel: "Programming with Mosh"
duration: "33:02"
lang: en
why: "Programming with Mosh construit une application multi-conteneurs avec Docker Compose : services, réseaux et volumes."
```

# Ce qui ne part pas tel quel en production

Le fichier du poste peut rester la référence du **développement** et d'un test d'intégration en CI. Il ne devient pas le manifeste de production par un simple copier-coller sur une machine virtuelle.

```diagram
type: compare
title: "Poste local et production"
columns:
  - title: "Légitime sur le poste"
    tone: teal
    items:
      - "Build local, code monté si besoin"
      - "Base dans un volume Docker, données factices"
      - "Mot de passe trivial, port 5432 fermé"
      - "Un seul hôte, pas de réplicas"
  - title: "À refuser en production"
    tone: rose
    items:
      - "Le même fichier, les mêmes secrets dans Git"
      - "PostgreSQL publié sur 0.0.0.0 sans sauvegarde"
      - "latest, ou une image reconstruite sur le serveur"
      - "Compose comme seul orchestrateur du service"
```

En production, l'image vient d'un registre, identifiée par une version ou un digest, elle n'est pas construite sur le serveur. La base est un service opéré, avec sauvegardes, ou un volume dont quelqu'un a écrit la restauration. Les secrets viennent d'un coffre, pas du fichier. Le port de la base n'est pas publié sur l'Internet. Plusieurs copies de l'API, des sondes et des limites de ressources relèvent de l'orchestrateur, pas de Compose.

Ce qu'on garde de ce chapitre : les **noms** de services, l'idée qu'un volume survit au conteneur, et la séparation entre configuration publique et secret. Ce qu'on laisse : le mot de passe en clair, le bind mount, l'hôte unique et l'illusion que `depends_on` est une haute disponibilité.

# Exercices

## Exercice 1 : localhost dans l'API

L'API démarre, puis journalise `connection refused` vers `127.0.0.1:5432`. Le service `db` est bien « running ». La variable vaut `postgres://atelier:atelier@localhost:5432/atelier`. Depuis le poste, `psql` n'atteint pas non plus la base, et c'est voulu : aucun port n'est publié pour `db`.

Où pointe `localhost`, et quelle URL corrige le démarrage ?

<details>
<summary>Voir la solution</summary>

Dans le conteneur `api`, `localhost` est l'API elle-même. Rien n'y écoute sur 5432. Le nom DNS du réseau Compose est `db`. L'URL devient `postgres://atelier:atelier@db:5432/atelier`.

Depuis le poste, l'absence de connexion est normale tant que `ports` n'est pas défini pour `db`. On administre la base avec `docker compose exec db psql -U atelier -d atelier`, sans ouvrir 5432 sur la machine.

</details>

## Exercice 2 : La base vide au lundi

Vendredi, l'équipe charge un jeu de données de démonstration. Lundi, après un `docker compose down -v` lancé « pour faire propre », les tables ont disparu. Les conteneurs remontent sans erreur.

Qu'a effacé le drapeau, et comment repartir sur une base vide **sans** perdre les données la prochaine fois ?

<details>
<summary>Voir la solution</summary>

`-v` supprime les volumes nommés du projet, dont `pgdata`, en plus des conteneurs. `docker compose down` sans `-v` aurait suffi à recréer les conteneurs en conservant les données.

Pour une base vraiment vide, on lance `down -v` **en sachant** que le volume part, puis `up`. Le jeu de démonstration se recharge par un script versionné (migrations et graines), pas en espérant que le volume du portable dure toujours. Les données locales restent synthétiques : le volume n'est pas une sauvegarde.

</details>

## Exercice 3 : Le fichier recopié sur un serveur

Quelqu'un propose de copier ce `compose.yaml` sur une machine publique : ajouter `5432:5432`, garder `POSTGRES_PASSWORD: atelier`, et builder l'image sur le serveur à chaque mise en ligne.

Quels points refusez-vous, et que mettez-vous à la place pour un premier service réel ?

<details>
<summary>Voir la solution</summary>

On refuse le port publié de la base, le mot de passe dans Git, et le build sur le serveur. La machine unique n'a ni réplique de l'API, ni sauvegarde, ni sonde.

À la place : l'API tire une image déjà construite et taguée depuis le registre. Le secret de base vient de l'environnement du serveur ou d'un coffre, jamais du fichier versionné. PostgreSQL n'écoute que sur un réseau privé, avec des sauvegardes dont on a déjà testé la restauration. Le fichier Compose du dépôt reste celui du poste et de la CI. La production, elle, sera décrite par l'orchestrateur et l'infrastructure as code des chapitres suivants, pas par ce `compose.yaml` agrémenté d'un port ouvert.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Compose sur le poste"
center: "Compose décrit l'API et sa base sur votre machine. Le fichier qui marche ici n'est pas un plan de production."
points:
  - icon: network
    title: "Réseau du projet"
    text: "Les services se joignent par leur nom. localhost dans l'API n'est ni le poste ni la base."
  - icon: database
    title: "Volume nommé"
    text: "pgdata survit à compose down. Le drapeau -v l'efface. Ce n'est pas une sauvegarde."
  - icon: shield
    title: "Port fermé"
    text: "On publie 8080 pour l'API. On n'ouvre pas 5432 pour « voir » la base."
  - icon: alert
    title: "Secret de poste"
    text: "Le mot de passe trivial reste local et hors Git. Le committer, c'est déjà une fuite."
  - icon: rocket
    title: "Pas le manifeste"
    text: "Pas de build sur le serveur, pas de latest, pas de Compose comme seule prod."
pitfall: "depends_on sans healthcheck démarre l'API avant que PostgreSQL accepte les connexions."
remember: "Le nom du service est l'hôte. Le volume est les données. Le fichier du poste reste au poste."
```
