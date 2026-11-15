---
title: Python pour la donnée
description: "Lire, nettoyer et écrire des données avec Python : pandas, Polars, DuckDB, appels d'API robustes et pièges classiques (types, valeurs manquantes, fuseaux horaires)."
duration: 70
objectives:
  - Lire et écrire des fichiers CSV, JSON et Parquet en Python
  - Choisir entre pandas, Polars et DuckDB selon le besoin
  - Récupérer des données d'une API paginée de façon robuste
  - Structurer un pipeline de production (paramètres, configuration, validation, journaux, échec explicite)
  - Éviter les pièges de types, de valeurs manquantes et de fuseaux horaires
---

# Pourquoi Python ?

Python est le langage le plus utilisé en Data Engineering avec SQL. Il sert à **écrire les scripts d'ingestion** (appeler une API, lire des fichiers), à **transformer** des données quand SQL ne suffit pas, à **piloter** les orchestrateurs (Airflow, Dagster et Prefect se configurent en Python) et à **tester** les pipelines.

Ce chapitre suppose que vous connaissez les bases du langage (variables, fonctions, listes, dictionnaires, boucles). Il se concentre sur ce qui est propre au travail sur les données.

> [!TIP]
> Travaillez toujours dans un **environnement virtuel** par projet, avec des dépendances épinglées (`requirements.txt` ou `pyproject.toml` avec un fichier de verrouillage). Des outils comme `uv` ou `pip` + `venv` le font très bien. Un pipeline qui fonctionne sur votre machine doit fonctionner à l'identique en production.

# Lire et écrire des fichiers

## Avec la bibliothèque standard

Pour un traitement simple, ou un fichier trop gros pour la mémoire, le module `csv` permet de lire **ligne par ligne** sans tout charger :

```python
import csv
from decimal import Decimal


def total_par_magasin(chemin: str) -> dict[str, Decimal]:
    totaux: dict[str, Decimal] = {}
    with open(chemin, newline="", encoding="utf-8") as f:
        for ligne in csv.DictReader(f):  # une ligne à la fois : mémoire constante
            montant = Decimal(ligne["montant"])
            totaux[ligne["magasin"]] = totaux.get(ligne["magasin"], Decimal(0)) + montant
    return totaux
```

> [!NOTE]
> Pour des montants financiers, préférez `Decimal` à `float` : `0.1 + 0.2` vaut `0.30000000000000004` en virgule flottante. En SQL, l'équivalent est le type `NUMERIC`/`DECIMAL`.

## Avec pandas

**pandas** est la bibliothèque historique de manipulation de tableaux de données (*DataFrames*) en Python. Elle est omniprésente et très riche.

```python
import pandas as pd

ventes = pd.read_csv("ventes.csv", parse_dates=["date_vente"], dtype={"magasin": "string"})
ventes = ventes.dropna(subset=["montant"])               # retirer les lignes sans montant
ventes = ventes.drop_duplicates(subset=["id_vente"])     # dédoublonner sur la clé
ca = ventes.groupby("magasin", as_index=False)["montant"].sum()
ca.to_parquet("ca_par_magasin.parquet", index=False)     # nécessite pyarrow
```

Limite principale : pandas charge toutes les données **en mémoire** et s'exécute largement sur **un seul cœur**. Au-delà de quelques gigaoctets, il devient lent ou impossible à utiliser.

## Avec Polars

**Polars** est une bibliothèque de DataFrames plus récente, écrite en Rust, **multithreadée** et dotée d'un mode **paresseux** (*lazy*) : on décrit les opérations, Polars optimise le plan (ne lire que les colonnes utiles, filtrer tôt) puis l'exécute.

```python
import polars as pl

ca = (
    pl.scan_csv("ventes.csv")                    # lecture paresseuse : rien n'est encore lu
    .filter(pl.col("montant") > 0)
    .group_by("magasin")
    .agg(pl.col("montant").sum().alias("chiffre_affaires"))
    .sort("chiffre_affaires", descending=True)
    .collect()                                   # exécution du plan optimisé
)
ca.write_parquet("ca_par_magasin.parquet")
```

## Avec DuckDB

**DuckDB** est une base de données analytique **embarquée** (elle tourne dans votre processus, sans serveur). Elle exécute du **SQL directement sur des fichiers** CSV, JSON ou Parquet, très rapidement, et sait traiter des volumes supérieurs à la mémoire.

```python
import duckdb

resultat = duckdb.sql("""
    SELECT magasin, sum(montant) AS chiffre_affaires
    FROM 'ventes.csv'
    WHERE montant > 0
    GROUP BY magasin
    ORDER BY chiffre_affaires DESC
""")
resultat.write_parquet("ca_par_magasin.parquet")
print(resultat.df())  # conversion en DataFrame pandas si besoin
```

```diagram
type: compare
title: Trois outils, trois usages
columns:
  - title: pandas
    tone: blue
    items:
      - Écosystème immense, très documenté
      - Données qui tiennent en mémoire
      - Exploration, petits traitements
  - title: Polars
    tone: teal
    items:
      - Rapide, multithreadé, mode paresseux
      - API expressive et stricte sur les types
      - Transformations lourdes sur une machine
  - title: DuckDB
    tone: amber
    items:
      - SQL sur fichiers, sans serveur
      - Volumes supérieurs à la mémoire
      - Analyses locales, tests de pipelines
```

> [!IMPORTANT]
> Ces trois outils fonctionnent sur **une seule machine**. Quand les données dépassent ce qu'une machine peut traiter raisonnablement (plusieurs centaines de gigaoctets ou plus), on passe à un moteur **distribué** comme Spark (module 5) ou au moteur SQL d'un entrepôt cloud.

# Récupérer des données d'une API

L'ingestion depuis une API REST est une tâche quotidienne. Une API renvoie rarement toutes les données d'un coup : elle les **pagine**, impose des **limites de débit** (*rate limiting*, code HTTP 429) et connaît des **pannes passagères** (codes 5xx). Un script d'ingestion robuste gère ces trois aspects.

```python
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


def session_robuste() -> requests.Session:
    session = requests.Session()
    retry = Retry(
        total=5,
        backoff_factor=1,                       # attentes croissantes entre les tentatives
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET"],
    )
    session.mount("https://", HTTPAdapter(max_retries=retry))
    return session


def lire_commandes(base_url: str, jeton: str):
    session = session_robuste()
    url = f"{base_url}/commandes?limit=100"
    while url:
        reponse = session.get(url, headers={"Authorization": f"Bearer {jeton}"}, timeout=30)
        reponse.raise_for_status()
        page = reponse.json()
        yield from page["donnees"]             # générateur : une commande à la fois
        url = page.get("suivant")               # URL de la page suivante, absente à la fin
```

Points clés :

- toujours un **`timeout`** : sans lui, une requête peut rester bloquée indéfiniment ;
- des **nouvelles tentatives** avec attente croissante (*exponential backoff*) pour les erreurs passagères ;
- un **générateur** (`yield`) pour ne pas accumuler toutes les pages en mémoire ;
- les **secrets** (jetons) lus depuis l'environnement ou un gestionnaire de secrets, jamais écrits dans le code.

> [!WARNING]
> Le format de pagination (numéro de page, curseur, URL suivante) et les noms des champs varient selon les API. Lisez toujours la documentation de l'API concernée : l'exemple ci-dessus illustre une pagination par URL suivante.

# Écrire un pipeline robuste

Un script qui marche sur le portable du développeur n'est pas encore un pipeline de production. Quelques pratiques font la différence.

## Paramètres et configuration

Un traitement reçoit **ce qu'il doit traiter** en paramètre (la date, la partition) et lit sa **configuration** dans l'environnement. Il ne calcule jamais lui-même « hier » à partir de l'horloge : c'est ce qui permet de le relancer pour n'importe quel jour (idempotence, module 5).

```python
import argparse
import datetime as dt
from pydantic_settings import BaseSettings


class Config(BaseSettings):
    """Lue depuis les variables d'environnement (PIPELINE_BUCKET, PIPELINE_API_URL…)."""
    bucket: str
    api_url: str
    api_jeton: str                      # fourni par le gestionnaire de secrets à l'exécution

    model_config = {"env_prefix": "PIPELINE_"}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--date", type=dt.date.fromisoformat, required=True)
    args = parser.parse_args()
    config = Config()                   # échoue tout de suite si une variable manque
    executer(args.date, config)
```

## Valider les données à l'entrée

Les données externes sont **toujours** suspectes. Valider chaque enregistrement avec un schéma (ici **Pydantic**) transforme une erreur obscure trois étapes plus loin en un rejet clair, à l'endroit où le problème entre dans le système :

```python
from decimal import Decimal
from pydantic import BaseModel, ValidationError, field_validator


class Commande(BaseModel):
    commande_id: int
    client_id: int
    montant: Decimal
    passee_le: dt.datetime

    @field_validator("montant")
    @classmethod
    def montant_positif(cls, v: Decimal) -> Decimal:
        if v < 0:
            raise ValueError("montant négatif")
        return v


valides, rejets = [], []
for brut in lire_commandes(config.api_url, config.api_jeton):
    try:
        valides.append(Commande.model_validate(brut))
    except ValidationError as e:
        rejets.append({"brut": brut, "erreur": str(e)})   # quarantaine, pas d'arrêt silencieux
```

Pour valider des DataFrames entiers plutôt que des enregistrements, des bibliothèques comme **Pandera** ou les contrôles de qualité du module 8 prennent le relais.

## Journaliser plutôt qu'afficher

`print()` ne dit ni quand, ni où, ni avec quelle gravité. Le module `logging` (ou une bibliothèque comme structlog) produit des journaux **horodatés**, **filtrables** par niveau, et idéalement **structurés** (JSON) pour être interrogés dans l'outil de supervision :

```python
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
log = logging.getLogger("pipeline.commandes")

log.info("extraction terminée", extra={"date": str(args.date), "lignes": len(valides), "rejets": len(rejets)})
if len(rejets) > 0.01 * (len(valides) + len(rejets)):
    log.error("taux de rejet anormal : %d rejets", len(rejets))
    raise SystemExit(1)                 # code de sortie non nul : l'orchestrateur voit l'échec
```

> [!IMPORTANT]
> Un pipeline qui échoue doit **échouer bruyamment** : exception non rattrapée ou code de sortie non nul, pour que l'orchestrateur marque la tâche en échec et alerte. Un `try/except: pass` qui avale une erreur produit le pire des incidents : des données fausses ou incomplètes, sans que personne ne le sache.

## Un projet, pas un script

- Un **gestionnaire de projet** moderne comme **uv** crée l'environnement virtuel, installe les dépendances et les **verrouille** (`uv.lock`) pour que la production utilise exactement les mêmes versions.
- Des **annotations de types** vérifiées par un outil (mypy, pyright) attrapent une partie des erreurs avant l'exécution.
- Un **formateur et linter** (Ruff) uniformise le code de l'équipe.
- Les fonctions de transformation **pures** (des données en entrée, des données en sortie, sans accès réseau) se testent facilement avec pytest (module 10).

# Les pièges classiques

## Les types

Un CSV ne contient que du texte : c'est le lecteur qui **devine** les types. Un code postal comme `01000` devient l'entier `1000`, un identifiant très long perd sa précision, une colonne de dates reste du texte. Déclarez explicitement les types des colonnes importantes, et vérifiez-les après lecture.

## Les valeurs manquantes

Une valeur manquante (`None`, `NaN`, `NULL`, chaîne vide) n'est pas un zéro. Décidez explicitement, colonne par colonne, ce qu'elle signifie : faut-il **rejeter** la ligne, **remplacer** la valeur, ou la **conserver** comme inconnue ? Dans pandas, une colonne d'entiers contenant une valeur manquante est convertie en `float` si l'on n'utilise pas les types « nullable » (`Int64`).

## Les dates et fuseaux horaires

```python
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

locale = datetime(2026, 3, 29, 2, 30, tzinfo=ZoneInfo("Europe/Paris"))  # heure qui n'existe pas !
maintenant_utc = datetime.now(timezone.utc)
```

Règles simples et éprouvées :

- **stocker en UTC**, avec un type qui porte le fuseau (`timestamptz` dans PostgreSQL) ;
- convertir en heure locale **uniquement à l'affichage** ;
- se méfier des **changements d'heure** : certaines heures locales n'existent pas (passage à l'heure d'été) ou existent deux fois (passage à l'heure d'hiver).

## L'encodage

Les fichiers produits par d'anciens logiciels sont parfois en `latin-1` (ou `cp1252`) plutôt qu'en UTF-8. Symptôme : des caractères comme `Ã©` à la place de `é`. Précisez toujours l'encodage à la lecture et écrivez en UTF-8.

# Exercices

## Exercice 1 : Choisir l'outil

Quel outil choisiriez-vous (bibliothèque standard, pandas, Polars, DuckDB) pour chaque cas ?

1. Explorer rapidement un fichier Excel de 2 000 lignes dans un notebook.
2. Calculer des agrégats sur 40 Go de fichiers Parquet, sur un ordinateur portable de 16 Go de RAM, en SQL.
3. Une transformation complexe en Python sur 8 Go de CSV, sur un serveur à 32 cœurs.

<details>
<summary>Voir la solution</summary>

1. **pandas** : petit volume, exploration, écosystème riche (`read_excel`).
2. **DuckDB** : SQL directement sur Parquet, capable de traiter des volumes supérieurs à la mémoire.
3. **Polars** (mode paresseux) : exploite tous les cœurs et optimise le plan. DuckDB conviendrait aussi si la logique s'exprime bien en SQL.

</details>

## Exercice 2 : Trouver les bugs

Ce script d'ingestion fonctionne sur le poste du développeur mais pose problème en production. Relevez au moins quatre défauts.

```python
import requests

JETON = "sk_live_8f2a..."

def tout_recuperer():
    resultats = []
    page = 1
    while True:
        r = requests.get(f"https://api.exemple.com/clients?page={page}",
                         headers={"Authorization": f"Bearer {JETON}"})
        donnees = r.json()
        if not donnees:
            break
        resultats += donnees
        page += 1
    return resultats
```

<details>
<summary>Voir la solution</summary>

1. **Secret en clair** dans le code : il doit venir de l'environnement ou d'un gestionnaire de secrets (et ce jeton doit être révoqué s'il a été versionné).
2. **Pas de `timeout`** : une requête peut bloquer indéfiniment.
3. **Pas de vérification du statut HTTP** (`raise_for_status()`) : une erreur 500 ou 429 sera interprétée comme des données.
4. **Pas de nouvelles tentatives** en cas d'erreur passagère ou de limite de débit.
5. **Tout est accumulé en mémoire** (`resultats += …`) : un générateur ou une écriture par page serait plus sûr.

</details>

## Exercice 3 : Fuseaux horaires

Une application enregistre l'heure des commandes en heure locale de Paris, sans fuseau. Pourquoi est-ce un problème pour calculer le nombre de commandes par heure sur une année ?

<details>
<summary>Voir la solution</summary>

Sans fuseau, l'heure est **ambiguë** : lors du passage à l'heure d'hiver, l'heure entre 2 h et 3 h existe deux fois, et les commandes des deux occurrences se mélangent. Lors du passage à l'heure d'été, une heure manque. Les durées calculées autour de ces dates sont fausses. Il faut stocker en **UTC** (ou avec le décalage) et convertir en heure locale à l'affichage.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Python pour la donnée
center: Lire, nettoyer et écrire les données de façon robuste, avec l'outil adapté au volume.
points:
  - icon: file
    title: Fichiers
    text: CSV ligne par ligne si c'est gros, Parquet pour stocker, types déclarés explicitement.
  - icon: zap
    title: pandas, Polars, DuckDB
    text: pandas pour explorer, Polars pour la vitesse, DuckDB pour le SQL sur fichiers.
  - icon: link
    title: API robustes
    text: Timeout, nouvelles tentatives avec attente croissante, pagination par générateur.
  - icon: shield
    title: Pipeline robuste
    text: Date en paramètre, configuration validée, données validées à l'entrée, journaux, échec bruyant.
  - icon: clock
    title: Dates en UTC
    text: Stocker en UTC avec fuseau, convertir en heure locale seulement à l'affichage.
  - icon: key
    title: Secrets hors du code
    text: Jetons et mots de passe viennent de l'environnement ou d'un gestionnaire de secrets.
pitfall: Laisser le lecteur deviner les types et confondre valeur manquante et zéro.
remember: Un script d'ingestion doit survivre aux pannes passagères, aux gros volumes et aux changements d'heure.
```
