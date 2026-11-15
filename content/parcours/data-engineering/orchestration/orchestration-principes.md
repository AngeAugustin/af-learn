---
title: Les principes de l'orchestration
description: Ce qu'apporte un orchestrateur (graphe de dépendances, planification, reprises, rattrapages, supervision) et les approches par tâches ou par actifs de données.
duration: 55
objectives:
  - Expliquer le rôle d'un orchestrateur et ses concepts clés
  - Concevoir un graphe de tâches robuste
  - Maîtriser le parallélisme et protéger les ressources partagées
  - Distinguer orchestration par tâches et par actifs de données
  - Comparer Airflow, Dagster et Prefect
---

# Pourquoi un orchestrateur ?

Un pipeline réel enchaîne de nombreuses étapes : ingérer cinq sources, attendre qu'elles soient toutes arrivées, lancer les transformations dbt, rafraîchir un modèle de machine learning, envoyer un rapport. Avec `cron`, chaque étape est lancée à heure fixe en **espérant** que la précédente soit terminée. Quand une étape échoue à 3 h du matin, personne ne le sait, et les suivantes s'exécutent sur des données incomplètes.

Un **orchestrateur** prend en charge :

| Fonction | Ce qu'elle apporte |
|---|---|
| **Dépendances** | Une étape ne démarre que lorsque ses prérequis ont réussi |
| **Planification** | Exécutions périodiques, ou déclenchées par l'arrivée de données |
| **Reprises** | Nouvelles tentatives automatiques en cas d'échec passager |
| **Rattrapages** | Rejouer un traitement pour une période passée (*backfill*) |
| **Supervision** | Historique des exécutions, journaux, durées, alertes |
| **Paramétrage** | Chaque exécution connaît la période qu'elle traite |

> [!NOTE]
> Un orchestrateur **coordonne** le travail ; il ne doit pas le **faire** lui-même. Les traitements lourds s'exécutent dans l'entrepôt (SQL, dbt), sur un cluster Spark ou dans des conteneurs ; l'orchestrateur les lance et suit leur état.

# Le graphe de tâches

Un pipeline se modélise comme un **graphe orienté acyclique** (DAG) : des **tâches** reliées par des **dépendances**, sans cycle.

```diagram
type: pipeline
title: Un DAG quotidien typique
lanes:
  - title: Ingestion (en parallèle)
    steps:
      - title: Commandes
        text: Base de la boutique
      - title: Paiements
        text: API du prestataire
      - title: Campagnes
        text: Plateforme marketing
  - title: Transformation et usages (après toutes les ingestions)
    steps:
      - title: Contrôles
        text: Volumes, fraîcheur
      - title: dbt build
        text: Modèles et tests
      - title: Rafraîchissement
        text: Tableaux de bord
      - title: Notification
        text: Succès ou alerte
```

## Les bonnes pratiques

- **Des tâches atomiques et idempotentes** : chaque tâche fait une chose et peut être relancée sans dommage (chapitre d'ingestion).
- **Une granularité raisonnable** : ni une tâche géante qui fait tout (impossible de reprendre au milieu), ni des centaines de micro-tâches (surcharge de l'orchestrateur).
- **Pas de données entre tâches via l'orchestrateur** : les tâches s'échangent des données par le **stockage** (tables, fichiers), et seulement de petites métadonnées par l'orchestrateur.
- **Des délais maximaux** (*timeouts*) : une tâche bloquée ne doit pas empêcher indéfiniment la suite.
- **Des reprises limitées** avec attente croissante : utiles pour les erreurs passagères (réseau, API), inutiles pour un bug de code.

## Parallélisme et ressources partagées

Un orchestrateur lance volontiers des dizaines de tâches en parallèle. Les systèmes en face n'aiment pas toujours cela : une API limitée à 10 requêtes par seconde, une base de production, un entrepôt facturé au calcul.

- **Les pools** (Airflow) ou **limites de concurrence** (Dagster, Prefect) bornent le nombre de tâches qui utilisent simultanément une ressource : par exemple 3 extractions à la fois sur la base de production, quel que soit le nombre de DAG.
- **La concurrence d'un pipeline** (`max_active_runs`) évite que deux exécutions du même DAG (le jour J et un rattrapage du jour J−1) écrivent en même temps dans la même table.
- **Les tâches dynamiques** (*dynamic task mapping* dans Airflow, partitions dynamiques dans Dagster) créent à l'exécution une tâche par élément d'une liste (une par fichier reçu, une par client) : on ne connaît pas toujours à l'avance le nombre de tâches.
- **Les capteurs différés** (*deferrable operators*) attendent un événement externe sans occuper un emplacement d'exécution pendant l'attente. Un capteur classique qui « dort » occupe un worker pour rien : vingt capteurs qui attendent un fichier peuvent bloquer toutes les autres tâches.

```python
# Airflow : une tâche par fichier reçu, au plus 3 en parallèle sur la ressource « api_partenaire »
@task(pool="api_partenaire")
def charger(fichier: str) -> None:
    ...

@dag(schedule="@daily", max_active_runs=1, catchup=False)
def ingestion_partenaire():
    charger.expand(fichier=lister_fichiers_recus())
```

# Le temps dans l'orchestration

## Intervalle de données et date d'exécution

Les orchestrateurs distinguent le **moment où le traitement s'exécute** et la **période de données qu'il traite**. Le traitement du 2 mars s'exécute typiquement le **3 mars** à 2 h, une fois la journée du 2 complète. Dans Airflow, cette période est l'**intervalle de données** (`data_interval_start`, `data_interval_end`), et la date logique (`logical_date`, `ds` dans les gabarits) l'identifie.

> [!IMPORTANT]
> Vos traitements doivent lire la période **dans le contexte de l'exécution**, jamais calculer « hier » à partir de l'heure courante. C'est la condition pour que les reprises et rattrapages traitent la bonne période.

## Rattrapages

Après la correction d'un bug, ou à l'ajout d'un nouveau pipeline, on lance un **backfill** : une exécution par période passée. L'orchestrateur gère la file, le parallélisme (pour ne pas saturer la source ou l'entrepôt) et l'historique. Cela ne fonctionne que si les traitements sont **paramétrés par la période** et **idempotents**.

## Déclenchement par les données

Plutôt qu'une heure fixe, un pipeline peut démarrer **quand ses données d'entrée sont prêtes** : fichier déposé, table mise à jour par un autre pipeline. Les orchestrateurs modernes le gèrent nativement (assets dans Airflow 3 et Dagster, événements dans Prefect), ce qui évite les « capteurs » qui attendent en boucle.

# Tâches ou actifs de données ?

```diagram
type: compare
title: Deux façons de penser l'orchestration
columns:
  - title: Orientée tâches
    tone: blue
    items:
      - On décrit des actions à exécuter dans un ordre
      - « Lancer l'ingestion, puis dbt, puis l'export »
      - Approche historique d'Airflow
  - title: Orientée actifs de données
    tone: teal
    items:
      - On décrit les données à produire et leurs dépendances
      - « La table ca_quotidien dépend de ventes et de magasins »
      - Lignage, fraîcheur et rematérialisation par actif
```

L'approche **par actifs** (*assets*), mise en avant par **Dagster** et désormais présente dans **Airflow 3**, place les **données** au centre : l'orchestrateur sait quelles tables existent, quand elles ont été mises à jour, ce qui en dépend, et peut recalculer un actif et tout ce qui en dépend. C'est cohérent avec la façon dont on raisonne en modélisation (dbt, couches médaillon).

# Les principaux orchestrateurs

| Outil | Points forts | À savoir |
|---|---|---|
| **Apache Airflow** | Le plus répandu, immense écosystème d'intégrations (*providers*), services gérés (Amazon MWAA, Google Cloud Composer, Astronomer) | Version 3 (2025) : assets, interface refondue, versionnage des DAG, API d'exécution des tâches |
| **Dagster** | Centré sur les actifs de données, typage, tests locaux, très bonne intégration dbt | Open source, avec une offre cloud |
| **Prefect** | API Python très simple (décorateurs), workflows dynamiques | Open source, avec une offre cloud |
| Services cloud | AWS Step Functions, Google Workflows, Azure Data Factory | Intégrés à un cloud, moins portables |

```diagram
type: decision
title: Quel orchestrateur ?
nodes:
  - question: L'entreprise utilise-t-elle déjà un orchestrateur maîtrisé par l'équipe ?
    yes: Le garder ; une migration coûte cher pour un gain souvent modeste
    no: Question suivante
  - question: Le projet est-il centré sur des tables (dbt, lakehouse) avec un besoin fort de lignage ?
    yes: Dagster (ou Airflow 3 avec les assets)
    no: Airflow pour l'écosystème et le recrutement, ou Prefect pour la simplicité en Python
```

# Exercices

## Exercice 1 : Concevoir le DAG

Une entreprise reçoit chaque nuit un fichier de ventes déposé par un partenaire sur un stockage objet (entre 1 h et 4 h), charge les données de son CRM, puis calcule avec dbt un tableau de bord qui doit être prêt à 7 h. Proposez le graphe de tâches et les mécanismes de robustesse.

<details>
<summary>Voir la solution</summary>

- **Déclenchement** du chargement des ventes à l'**arrivée du fichier** (événement ou actif), avec une alerte s'il n'est pas arrivé à 4 h 30.
- **Ingestion CRM** planifiée en parallèle, avec reprises (3 tentatives, attente croissante) et délai maximal.
- **Contrôles** après chaque ingestion : nombre de lignes plausible, fraîcheur.
- **dbt build** une fois les deux ingestions réussies (dépendances), tests compris.
- **Rafraîchissement** du tableau de bord, puis **notification**.
- Une **alerte de délai** (SLA) si le tableau de bord n'est pas prêt à 6 h 30, pour avoir le temps d'agir avant 7 h.

</details>

## Exercice 2 : Le mauvais jour

Une tâche Airflow exécutée chaque nuit calcule `jour = date.today() - timedelta(days=1)`. Après une panne de trois jours, l'équipe relance les trois exécutions manquées. Que se passe-t-il ?

<details>
<summary>Voir la solution</summary>

Les trois exécutions calculent « hier » **par rapport au jour où elles sont relancées** : elles traitent toutes la **même** journée, et les trois journées manquées ne sont jamais calculées. Il faut utiliser la période fournie par l'orchestrateur (intervalle de données, `ds`), qui vaut une journée différente pour chaque exécution.

</details>

## Exercice 3 : Reprendre ou non ?

Pour chaque erreur, une nouvelle tentative automatique est-elle utile ?

1. Délai d'attente dépassé lors d'un appel à une API.
2. `KeyError: 'montant'` dans le code de transformation.
3. Code HTTP 503 du stockage objet.
4. Violation d'une contrainte d'unicité lors du chargement.

<details>
<summary>Voir la solution</summary>

1. **Oui** : erreur réseau probablement passagère.
2. **Non** : erreur de code ou de schéma, elle se reproduira à l'identique ; il faut alerter.
3. **Oui** : service temporairement indisponible.
4. **Non** en général : problème de données (doublons) ou de conception (chargement non idempotent) à corriger.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Les principes de l'orchestration
center: Coordonner des tâches idempotentes dans le bon ordre, au bon moment, et savoir quand quelque chose échoue.
points:
  - icon: network
    title: Le DAG
    text: Tâches atomiques reliées par des dépendances, sans cycle, échangeant par le stockage.
  - icon: loop
    title: Reprises et délais
    text: Nouvelles tentatives pour les erreurs passagères, timeout pour les blocages.
  - icon: gauge
    title: Ressources partagées
    text: Pools et limites de concurrence, une exécution à la fois par table, capteurs différés.
  - icon: clock
    title: La période traitée
    text: Lire l'intervalle de données du contexte ; c'est ce qui rend les rattrapages possibles.
  - icon: database
    title: Tâches ou actifs
    text: Penser en données à produire donne lignage, fraîcheur et rematérialisation.
  - icon: compass
    title: Les outils
    text: Airflow pour l'écosystème, Dagster pour les actifs, Prefect pour la simplicité.
pitfall: Faire faire le travail lourd à l'orchestrateur au lieu de lui faire coordonner l'entrepôt ou le cluster.
remember: Un pipeline dont personne n'apprend l'échec avant les utilisateurs n'est pas orchestré.
```
