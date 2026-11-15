---
title: "L'outillage : Linux, Git et Docker"
description: La ligne de commande pour inspecter des données, Git pour versionner les pipelines et Docker pour les exécuter partout à l'identique.
duration: 50
objectives:
  - Inspecter et filtrer des fichiers de données en ligne de commande
  - Versionner un projet de données avec Git sans y mettre de données ni de secrets
  - Comprendre images, conteneurs et Dockerfile
  - Lancer un environnement local (pipeline + PostgreSQL) avec Docker Compose
---

# La ligne de commande

Les serveurs, les conteneurs et les machines d'orchestration tournent presque tous sous **Linux**. Savoir s'y déplacer, inspecter un fichier et lire des journaux est indispensable, ne serait-ce que pour diagnostiquer un pipeline en échec.

## Inspecter un fichier de données

Avant d'écrire la moindre ligne de code, regardez les données :

```bash
ls -lh donnees/                 # taille lisible des fichiers
head -n 5 ventes.csv            # les 5 premières lignes (en-tête compris)
wc -l ventes.csv                # nombre de lignes
file ventes.csv                 # type et encodage détectés
grep -c ";2026-02-30;" ventes.csv   # compter les lignes avec une date impossible
cut -d ';' -f 3 ventes.csv | sort | uniq -c | sort -rn | head   # valeurs les plus fréquentes de la colonne 3
```

Pour du JSON, l'outil **jq** est incontournable :

```bash
# Extraire l'identifiant et le statut de chaque commande d'une réponse d'API
jq '.donnees[] | {id, statut}' reponse.json
# Compter les commandes par statut
jq '[.donnees[].statut] | group_by(.) | map({statut: .[0], n: length})' reponse.json
```

## Tuyaux et redirections

La force de la ligne de commande est de **composer** de petits outils :

- `commande > fichier` écrit la sortie dans un fichier (en l'écrasant), `>>` ajoute à la fin ;
- `commande1 | commande2` envoie la sortie de la première vers l'entrée de la seconde ;
- `commande 2> erreurs.log` redirige les messages d'erreur.

```bash
# Décompresser un export, garder les lignes de 2026 et compter
gunzip -c export.csv.gz | grep ",2026-" | wc -l
```

## Variables d'environnement et permissions

Les pipelines lisent leur configuration (adresse de la base, identifiants) dans des **variables d'environnement** :

```bash
export DATABASE_URL="postgresql://etl@localhost:5432/analytics"
python ingestion.py          # le script lit os.environ["DATABASE_URL"]
```

Les **permissions** déterminent qui peut lire, écrire ou exécuter un fichier (`ls -l` affiche par exemple `-rw-r-----`). Un fichier contenant des secrets ne doit être lisible que par son propriétaire : `chmod 600 .env`.

> [!TIP]
> Les traitements planifiés « à l'ancienne » utilisent **cron** (`crontab -e`, par exemple `0 2 * * *` pour 2 h chaque nuit). C'est simple, mais sans gestion des dépendances, des reprises ni de l'historique des exécutions : c'est précisément ce qu'apporte un orchestrateur (module 6).

# Git pour les projets de données

Tout le code d'un pipeline (scripts, requêtes SQL, modèles dbt, configuration d'orchestration, infrastructure) doit être **versionné**. Git permet de savoir qui a changé quoi et pourquoi, de revenir en arrière et de relire les changements avant leur mise en production.

## Le flux de travail courant

```diagram
type: flow
title: Flux de travail avec des branches et des pull requests
steps:
  - title: Branche
    text: git switch -c ajout-ingestion-clients
    tone: blue
  - title: Commits
    text: Petits changements cohérents
    tone: blue
  - title: Pull request
    text: Relecture par un pair
    tone: amber
  - title: CI
    text: Tests et vérifications automatiques
    tone: teal
  - title: Fusion
    text: Déploiement depuis la branche principale
    tone: teal
```

```bash
git switch -c ajout-ingestion-clients
git add ingestion/clients.py tests/test_clients.py
git commit -m "Ingestion incrémentale des clients depuis l'API CRM"
git push -u origin ajout-ingestion-clients
```

## Ce qui ne doit jamais être versionné

- les **données** elles-mêmes (volumineuses, souvent personnelles) ;
- les **secrets** (mots de passe, clés d'API, fichiers `.env`) ;
- les fichiers générés (environnements virtuels, caches, résultats de compilation).

```text
# .gitignore
.env
.venv/
__pycache__/
data/
*.parquet
*.csv
target/
```

> [!CAUTION]
> Un secret poussé sur un dépôt, même supprimé dans un commit suivant, reste dans l'**historique**. La seule réponse sûre est de **révoquer** le secret et d'en générer un nouveau. Des outils comme `gitleaks` détectent les secrets avant qu'ils ne partent.

# Docker

## Le problème

« Ça marche sur ma machine » : versions de Python différentes, bibliothèque système manquante, variable d'environnement oubliée… **Docker** résout ce problème en empaquetant une application avec **tout ce dont elle a besoin** pour s'exécuter.

- Une **image** est un modèle figé : un système de fichiers (système de base, Python, dépendances, code) et une commande de démarrage.
- Un **conteneur** est une instance en cours d'exécution d'une image, isolée des autres processus.
- Un **Dockerfile** décrit comment construire l'image.

## Un Dockerfile pour un pipeline Python

```dockerfile
FROM python:3.12-slim

WORKDIR /app

# Installer d'abord les dépendances : cette couche est mise en cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Puis copier le code
COPY ingestion/ ingestion/

# Ne pas tourner en root
RUN useradd --create-home pipeline
USER pipeline

CMD ["python", "-m", "ingestion.main"]
```

```bash
docker build -t ingestion-clients:1.0 .
docker run --rm -e DATABASE_URL="$DATABASE_URL" ingestion-clients:1.0
```

L'ordre des instructions compte : Docker met en cache chaque couche. Copier `requirements.txt` et installer les dépendances **avant** de copier le code évite de tout réinstaller à chaque modification du code.

## Un environnement local avec Docker Compose

**Docker Compose** décrit plusieurs conteneurs qui fonctionnent ensemble. Idéal pour disposer en local d'une base PostgreSQL identique à celle de production :

```yaml
# compose.yaml
services:
  postgres:
    image: postgres:17
    environment:
      POSTGRES_USER: etl
      POSTGRES_PASSWORD: etl_local_uniquement
      POSTGRES_DB: analytics
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  ingestion:
    build: .
    environment:
      DATABASE_URL: postgresql://etl:etl_local_uniquement@postgres:5432/analytics
    depends_on:
      - postgres

volumes:
  pgdata:
```

```bash
docker compose up -d postgres     # démarrer la base en arrière-plan
docker compose run --rm ingestion # lancer une exécution du pipeline
docker compose logs -f postgres   # suivre les journaux
```

> [!NOTE]
> À l'intérieur du réseau Compose, le pipeline joint la base par le **nom du service** (`postgres`), pas par `localhost`. Le volume `pgdata` conserve les données de la base entre deux redémarrages.

# Exercices

## Exercice 1 : Inspection en ligne de commande

Un fichier `clients.csv` (séparateur `,`, en-tête sur la première ligne) contient une colonne `pays` en 4ᵉ position. Écrivez les commandes pour : (a) afficher le nombre de clients (sans l'en-tête) ; (b) afficher les 5 pays les plus fréquents.

<details>
<summary>Voir la solution</summary>

```bash
# (a) nombre de lignes moins l'en-tête
tail -n +2 clients.csv | wc -l
# (b) pays les plus fréquents
tail -n +2 clients.csv | cut -d ',' -f 4 | sort | uniq -c | sort -rn | head -n 5
```

Attention : `cut` ne gère pas les champs entre guillemets contenant des virgules. Pour un CSV complexe, utilisez un vrai lecteur CSV (Python, DuckDB, `csvkit`).

</details>

## Exercice 2 : Le Dockerfile lent

Pourquoi ce Dockerfile réinstalle-t-il toutes les dépendances à chaque modification du code ? Corrigez-le.

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["python", "main.py"]
```

<details>
<summary>Voir la solution</summary>

`COPY . .` copie **tout** le projet avant l'installation : toute modification d'un fichier invalide le cache de cette couche **et des suivantes**, donc `pip install` est relancé. Correction :

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

Ajoutez aussi un fichier `.dockerignore` (avec `.env`, `.venv`, `data/`, `.git`) pour ne pas copier de secrets ni de fichiers inutiles dans l'image.

</details>

## Exercice 3 : Le secret poussé

Un collègue a commité le fichier `.env` contenant le mot de passe de la base de production, puis l'a supprimé dans le commit suivant. Le problème est-il réglé ? Que faut-il faire ?

<details>
<summary>Voir la solution</summary>

Non : le fichier reste dans l'**historique** Git, accessible à toute personne ayant accès au dépôt. Il faut : (1) **changer immédiatement le mot de passe** de la base ; (2) ajouter `.env` au `.gitignore` ; (3) éventuellement réécrire l'historique (avec `git filter-repo`), en sachant que les copies déjà clonées le contiennent toujours ; (4) installer une détection de secrets (hook de pré-commit, analyse en CI).

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Linux, Git et Docker
center: Inspecter les données en ligne de commande, versionner tout le code, exécuter partout à l'identique.
points:
  - icon: terminal
    title: Regarder d'abord
    text: "head, wc, grep, cut, jq : inspecter les données avant d'écrire du code."
  - icon: git
    title: Tout le code versionné
    text: Branches, petits commits, pull request relue, CI, puis fusion.
  - icon: lock
    title: Ni données ni secrets
    text: .gitignore pour .env et données ; un secret poussé se révoque.
  - icon: layers
    title: Image et conteneur
    text: L'image fige l'environnement ; dépendances avant le code pour profiter du cache.
  - icon: server
    title: Docker Compose
    text: Une base PostgreSQL locale identique à la production, jointe par le nom du service.
pitfall: Supprimer un secret dans un nouveau commit en pensant qu'il a disparu de l'historique.
remember: Si le pipeline ne tourne qu'avec votre machine, il n'est pas prêt pour la production.
```
