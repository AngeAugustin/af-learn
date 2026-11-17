---
title: Airflow et Dagster en pratique
description: Écrire un DAG Airflow avec l'API TaskFlow, gérer reprises, gabarits et assets, orchestrer dbt, puis le même pipeline en actifs Dagster.
duration: 60
objectives:
  - Décrire l'architecture d'Apache Airflow
  - Écrire un DAG avec l'API TaskFlow, des reprises et des délais
  - Déclencher un DAG par des assets et orchestrer dbt
  - Exprimer un pipeline sous forme d'actifs Dagster
---

# L'architecture d'Airflow

**Apache Airflow** est un orchestrateur open source, créé chez Airbnb en 2014 puis confié à la fondation Apache. Les pipelines s'y écrivent **en Python** : un fichier Python déclare un **DAG** et ses **tâches**. La version 3, publiée en 2025, a modernisé l'architecture et introduit notamment les **assets** et le versionnage des DAG.

```diagram
type: layers
title: Les composants d'Airflow
layers:
  - title: Interface et API
    text: "Serveur d'API et interface web : suivre, relancer, déclencher"
  - title: Planificateur et traitement des DAG
    text: Lit les fichiers de DAG, crée les exécutions et décide quelles tâches lancer
  - title: Exécuteur et workers
    text: Exécutent les tâches (local, Celery, Kubernetes…)
  - title: Base de métadonnées
    text: État de chaque exécution et de chaque tâche, historique, connexions
```

Les **connexions** (identifiants d'une base, d'un service cloud) sont stockées par Airflow ou un gestionnaire de secrets, et référencées par un identifiant dans le code : aucun mot de passe dans les fichiers de DAG.

> [!TIP]
> Pour apprendre, `pip install apache-airflow` puis `airflow standalone` lance en local tous les composants avec une base SQLite. En production, on utilise PostgreSQL comme base de métadonnées, ou un service géré.

# Un premier DAG

L'**API TaskFlow** déclare DAG et tâches avec des décorateurs Python :

```python
# dags/ventes_quotidiennes.py
from datetime import timedelta

import pendulum
from airflow.sdk import dag, task


@dag(
    schedule="0 2 * * *",                          # chaque nuit à 2 h (UTC)
    start_date=pendulum.datetime(2026, 1, 1, tz="UTC"),
    catchup=False,                                  # ne pas rattraper automatiquement depuis start_date
    default_args={
        "retries": 3,
        "retry_delay": timedelta(minutes=5),
        "retry_exponential_backoff": True,
        "execution_timeout": timedelta(hours=1),
    },
    tags=["ventes"],
)
def ventes_quotidiennes():

    @task
    def extraire(ds=None) -> str:
        # ds = date logique de l'exécution (AAAA-MM-JJ), fournie par Airflow
        chemin = f"s3://lake/bronze/ventes/date_vente={ds}/"
        telecharger_ventes_du_partenaire(jour=ds, destination=chemin)
        return chemin                                  # petite valeur transmise par XCom

    @task
    def controler(chemin: str) -> str:
        nb = compter_lignes(chemin)
        if nb == 0:
            raise ValueError(f"Aucune vente dans {chemin}")
        return chemin

    @task
    def charger(chemin: str, ds=None) -> None:
        charger_partition_entrepot(chemin, jour=ds)    # DELETE + INSERT du jour : idempotent

    charger(controler(extraire()))


ventes_quotidiennes()
```

Points à retenir :

- les **dépendances** découlent des appels : `charger(controler(extraire()))` ;
- la valeur renvoyée par une tâche passe à la suivante par **XCom**, stocké dans la base de métadonnées : réservé aux **petites** valeurs (un chemin, un compteur), jamais aux données ;
- `ds` est injecté par Airflow : chaque exécution connaît **sa** journée, ce qui rend relances et rattrapages corrects ;
- les fonctions métier (`telecharger_ventes_du_partenaire`…) vivent dans un module Python testé séparément ; le fichier de DAG reste léger.

> [!WARNING]
> Le planificateur relit **régulièrement** les fichiers de DAG. Tout code placé au niveau du module (hors des tâches) s'exécute à chaque lecture : n'y mettez **jamais** de requête à une base ou à une API, sous peine de ralentir tout Airflow.

## Rattrapages et relances

```bash
# Rejouer le DAG pour le premier trimestre (une exécution par jour)
airflow backfill create --dag-id ventes_quotidiennes \
    --from-date 2026-01-01 --to-date 2026-03-31
```

Dans l'interface, on peut aussi **effacer** (*clear*) une tâche en échec et ses descendants pour les relancer, une fois la cause corrigée.

> [!NOTE]
> La syntaxe de la commande de rattrapage a changé avec Airflow 3 (`airflow dags backfill` en version 2). Vérifiez toujours la documentation de **votre** version : Airflow évolue vite, et les tutoriels anciens abondent.

```video
url: https://www.youtube.com/watch?v=5peQThvQmQk
title: "Learn Apache Airflow in 10 Minutes | High-Paying Skills for Data Engineers"
channel: "Darshil Parmar"
duration: "12:38"
lang: en
why: "Darshil Parmar présente Airflow en douze minutes : DAG, tâches, opérateurs et planification."
```

# Les opérateurs et l'orchestration de dbt

Avant TaskFlow, les tâches s'écrivaient avec des **opérateurs** : des classes prêtes à l'emploi fournies par des paquets de *providers* (bases de données, services cloud, Kubernetes…). Ils restent très utilisés.

```python
from airflow.providers.standard.operators.bash import BashOperator

dbt_build = BashOperator(
    task_id="dbt_build",
    bash_command="cd /opt/dbt/projet && dbt build --target prod --vars '{\"jour\": \"{{ ds }}\"}'",
)
```

`{{ ds }}` est un **gabarit Jinja** évalué au moment de l'exécution. Pour une intégration plus fine (une tâche Airflow par modèle dbt, relances ciblées), la bibliothèque open source **Cosmos** génère automatiquement les tâches à partir du projet dbt.

# Les assets : déclencher par les données

Une tâche peut déclarer qu'elle **met à jour** un asset ; un autre DAG peut être **planifié** sur cet asset : il démarre dès que l'asset a été mis à jour.

```python
from airflow.sdk import Asset, dag, task

ventes_silver = Asset("s3://lake/silver/ventes")


@dag(schedule="@daily", start_date=pendulum.datetime(2026, 1, 1, tz="UTC"), catchup=False)
def producteur():
    @task(outlets=[ventes_silver])
    def nettoyer_ventes():
        ...
    nettoyer_ventes()


@dag(schedule=[ventes_silver], start_date=pendulum.datetime(2026, 1, 1, tz="UTC"), catchup=False)
def consommateur():
    @task
    def calculer_indicateurs():
        ...
    calculer_indicateurs()


producteur()
consommateur()
```

Le consommateur n'a plus besoin de deviner à quelle heure le producteur aura terminé.

# Le même pipeline avec Dagster

Dans **Dagster**, on ne décrit pas des tâches mais des **actifs** (*assets*) : les données produites, et ce dont elles dépendent.

```python
import dagster as dg


@dg.asset
def ventes_brutes(context: dg.AssetExecutionContext) -> None:
    """Fichier de ventes du partenaire, copié en zone bronze."""
    ...


@dg.asset(deps=[ventes_brutes])
def ventes_silver() -> None:
    """Ventes nettoyées et dédoublonnées."""
    ...


@dg.asset(deps=[ventes_silver])
def ca_quotidien() -> None:
    """Chiffre d'affaires par magasin et par jour."""
    ...


defs = dg.Definitions(assets=[ventes_brutes, ventes_silver, ca_quotidien])
```

L'interface affiche le **graphe des actifs**, leur date de dernière matérialisation et leur fraîcheur ; on peut rematérialiser un actif et tout ce qui en dépend. Dagster propose aussi le partitionnement par date des actifs (pour les rattrapages) et une intégration dbt qui transforme chaque modèle dbt en actif.

```diagram
type: compare
title: Airflow et Dagster
columns:
  - title: Airflow
    tone: blue
    items:
      - Des tâches dans des DAG, des assets depuis la version 3
      - Écosystème et communauté très larges
      - Standard de fait, nombreuses offres gérées
  - title: Dagster
    tone: teal
    items:
      - Des actifs de données au centre
      - Tests locaux et typage soignés
      - Lignage et fraîcheur visibles par actif
```

# Exercices

## Exercice 1 : Corriger un DAG

Relevez les problèmes de ce fichier de DAG.

```python
import requests
from airflow.sdk import dag, task

CONFIG = requests.get("https://config.interne/pipelines").json()   # niveau module

@dag(schedule="@daily", start_date=pendulum.datetime(2026, 1, 1, tz="UTC"))
def export():
    @task
    def extraire():
        return lire_toute_la_table_clients()          # 3 Go renvoyés
    @task
    def ecrire(donnees):
        ecrire_fichier(donnees, jour=date.today())
    ecrire(extraire())
```

<details>
<summary>Voir la solution</summary>

1. **Appel réseau au niveau du module** : exécuté à chaque lecture du fichier par le planificateur ; à déplacer dans une tâche.
2. **3 Go transmis par XCom** : les données doivent passer par le stockage ; la tâche renvoie seulement un chemin.
3. **`date.today()`** : utiliser `ds` (ou l'intervalle de données) pour que les relances traitent le bon jour.
4. **`catchup` non précisé** : préciser explicitement le comportement voulu pour éviter des exécutions inattendues depuis `start_date`.
5. Pas de **reprises** ni de **délai maximal** configurés.

</details>

## Exercice 2 : Planifier sur des données

Le DAG `indicateurs_marketing` est planifié à 6 h, « parce que d'habitude le DAG `ingestion_crm` a fini vers 5 h ». Certains jours, l'ingestion se termine à 6 h 30 et les indicateurs sont faux. Proposez une solution avec Airflow 3.

<details>
<summary>Voir la solution</summary>

Déclarer un **asset** (par exemple `Asset("warehouse://crm/contacts")`) dans les `outlets` de la tâche de chargement de `ingestion_crm`, et planifier `indicateurs_marketing` avec `schedule=[cet_asset]`. Le DAG démarre dès que l'ingestion a réellement mis à jour les données. Ajouter une alerte si l'asset n'a pas été mis à jour à une heure limite.

</details>

## Exercice 3 : Actifs

Exprimez sous forme d'actifs Dagster (noms et dépendances seulement) ce pipeline : fichiers bruts de commandes et de clients → commandes nettoyées, clients nettoyés → table de faits des commandes (qui a besoin des deux) → indicateur de chiffre d'affaires mensuel.

<details>
<summary>Voir la solution</summary>

```python
@dg.asset
def commandes_brutes(): ...

@dg.asset
def clients_bruts(): ...

@dg.asset(deps=[commandes_brutes])
def commandes_silver(): ...

@dg.asset(deps=[clients_bruts])
def clients_silver(): ...

@dg.asset(deps=[commandes_silver, clients_silver])
def fct_commandes(): ...

@dg.asset(deps=[fct_commandes])
def ca_mensuel(): ...
```

Dagster en déduit l'ordre d'exécution, le parallélisme possible (les deux branches silver) et le lignage.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Airflow et Dagster en pratique
center: Des DAG en Python légers qui coordonnent, passent la période à chaque tâche et réagissent aux données.
points:
  - icon: server
    title: Architecture Airflow
    text: API et interface, planificateur, exécuteur et workers, base de métadonnées.
  - icon: code
    title: TaskFlow
    text: Décorateurs @dag et @task ; reprises, délais ; XCom pour les petites valeurs seulement.
  - icon: clock
    title: ds et rattrapages
    text: Chaque exécution reçoit sa période ; backfill et clear pour rejouer.
  - icon: link
    title: Assets
    text: Une tâche publie un asset, un DAG démarre quand il est mis à jour.
  - icon: database
    title: Dagster
    text: Des actifs et leurs dépendances ; graphe, fraîcheur, rematérialisation.
pitfall: Mettre des appels réseau au niveau du module d'un DAG ou faire transiter des gigaoctets par XCom.
remember: Le fichier de DAG décrit l'enchaînement ; le vrai travail vit dans du code testé ou dans l'entrepôt.
```
