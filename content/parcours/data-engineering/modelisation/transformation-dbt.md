---
title: Transformer les données avec dbt
description: Le principe de dbt, les sources et les modèles, ref() et le graphe de dépendances, les couches staging / intermediate / marts, les matérialisations et les tests.
duration: 60
objectives:
  - Expliquer ce que fait dbt et ce qu'il ne fait pas
  - Déclarer des sources et écrire des modèles reliés par ref()
  - Organiser un projet en couches staging, intermediate et marts
  - Choisir une matérialisation et ajouter des tests de données
---

# Ce qu'est dbt

**dbt** (*data build tool*) est l'outil de référence de la transformation en ELT. Il ne déplace pas de données : il **exécute du SQL dans votre entrepôt** (PostgreSQL, BigQuery, Snowflake, Redshift, Databricks, DuckDB… via des adaptateurs) et apporte au SQL les pratiques du génie logiciel.

Le principe : chaque transformation est un **modèle**, un fichier `.sql` contenant un simple `SELECT`. dbt se charge de :

- créer la **vue** ou la **table** correspondante dans l'entrepôt ;
- déterminer **l'ordre d'exécution** à partir des dépendances entre modèles ;
- exécuter des **tests** sur les données produites ;
- générer une **documentation** et un graphe de lignage.

> [!NOTE]
> **dbt Core** est open source et s'utilise en ligne de commande. dbt Labs propose aussi une offre commerciale hébergée (éditeur, planification, catalogue). Ce chapitre utilise dbt Core, dont les concepts sont communs aux deux.

```diagram
type: flow
title: dbt dans une architecture ELT
steps:
  - title: Extraction et chargement
    text: Outil d'ingestion (hors dbt) vers des tables brutes
    tone: blue
  - title: Sources
    text: Tables brutes déclarées dans dbt
    tone: amber
  - title: Modèles
    text: SELECT versionnés, reliés par ref()
    tone: teal
  - title: Tests
    text: Unicité, non-nullité, relations…
    tone: teal
  - title: Tables métier
    text: Consommées par les analystes et les outils
    tone: teal
```

```video
url: https://www.youtube.com/watch?v=rItxGK0cYj8
title: "What is dbt?"
channel: "dbt Labs"
duration: "2:05"
lang: en
why: "La présentation officielle de dbt par dbt Labs : deux minutes pour comprendre la place de l'outil dans la chaîne."
```

# Un projet dbt

```text
mon_projet/
├── dbt_project.yml            configuration du projet
├── models/
│   ├── staging/
│   │   └── boutique/
│   │       ├── _boutique__sources.yml
│   │       ├── _boutique__models.yml
│   │       ├── stg_boutique__clients.sql
│   │       └── stg_boutique__commandes.sql
│   ├── intermediate/
│   │   └── int_commandes_enrichies.sql
│   └── marts/
│       ├── dim_clients.sql
│       └── fct_commandes.sql
├── seeds/                     petits CSV de référence versionnés
├── snapshots/                 historisation (chapitre suivant)
├── macros/                    fonctions Jinja réutilisables
└── tests/                     tests SQL spécifiques
```

## Déclarer les sources

Les tables brutes chargées par l'ingestion sont déclarées comme **sources** :

```yaml
# models/staging/boutique/_boutique__sources.yml
version: 2

sources:
  - name: boutique
    schema: brut_boutique
    tables:
      - name: clients
      - name: commandes
```

## Les modèles et ref()

Un modèle de **staging** lit une source et la nettoie : renommage, typage, sans logique métier complexe. Une table source = un modèle de staging.

```sql
-- models/staging/boutique/stg_boutique__commandes.sql
select
    id                                   as commande_id,
    customer_id                          as client_id,
    cast(created_at as timestamp)        as passee_le,
    lower(status)                        as statut,
    cast(amount_cents as numeric) / 100  as montant
from {{ source('boutique', 'commandes') }}
where id is not null
```

Les modèles suivants ne lisent **jamais** directement une table : ils utilisent `ref()`.

```sql
-- models/marts/fct_commandes.sql
select
    c.commande_id,
    c.client_id,
    c.passee_le,
    c.statut,
    c.montant
from {{ ref('stg_boutique__commandes') }} as c
where c.statut <> 'annulee'
```

`{{ ref('…') }}` est remplacé à la compilation par le nom complet de la table (`analytics.stg_boutique__commandes`) **et** déclare une dépendance. dbt construit ainsi un **graphe orienté acyclique** (DAG) des modèles et les exécute dans le bon ordre, en parallèle quand c'est possible. Le même code fonctionne dans un schéma de développement et en production : seul le schéma cible change.

> [!TIP]
> La syntaxe `{{ … }}` est du **Jinja**, un langage de gabarits. dbt compile chaque modèle en SQL pur avant de l'exécuter : `dbt compile` permet de voir le SQL final, très utile pour déboguer.

## Les couches

```diagram
type: layers
title: Organisation recommandée d'un projet dbt
layers:
  - title: Marts
    text: Tables métier finales (fct_, dim_) au grain défini, consommées par les utilisateurs
  - title: Intermediate
    text: Étapes de transformation réutilisables (jointures, agrégations intermédiaires)
  - title: Staging
    text: "Une vue par table source : renommage, typage, nettoyage léger"
  - title: Sources
    text: Tables brutes chargées par l'ingestion
```

Cette organisation (recommandée par le guide de bonnes pratiques de dbt Labs) correspond à l'architecture médaillon : staging ≈ silver « léger », marts ≈ gold.

# Les matérialisations

La **matérialisation** détermine ce que dbt crée dans l'entrepôt :

| Matérialisation | Crée | Quand l'utiliser |
|---|---|---|
| `view` | Une vue (requête stockée, recalculée à chaque lecture) | Staging, modèles légers |
| `table` | Une table reconstruite entièrement à chaque exécution | Marts de taille raisonnable, lus souvent |
| `incremental` | Une table complétée à chaque exécution avec les nouvelles lignes | Grosses tables d'événements (chapitre suivant) |
| `ephemeral` | Rien : le SQL est injecté comme CTE dans les modèles qui l'utilisent | Petites étapes intermédiaires |

```sql
-- En tête de modèle
{{ config(materialized='table') }}
```

On définit plutôt les valeurs par défaut par dossier dans `dbt_project.yml` :

```yaml
models:
  mon_projet:
    staging:
      +materialized: view
    marts:
      +materialized: table
```

# Les tests et la documentation

Les **tests génériques** se déclarent en YAML, à côté de la documentation des colonnes :

```yaml
# models/staging/boutique/_boutique__models.yml
version: 2

models:
  - name: stg_boutique__commandes
    description: Une ligne par commande de la boutique en ligne.
    columns:
      - name: commande_id
        description: Identifiant unique de la commande.
        data_tests:
          - unique
          - not_null
      - name: client_id
        data_tests:
          - not_null
          - relationships:
              to: ref('stg_boutique__clients')
              field: client_id
      - name: statut
        data_tests:
          - accepted_values:
              values: ['payee', 'expediee', 'annulee']
```

Les quatre tests intégrés : `unique`, `not_null`, `accepted_values`, `relationships` (intégrité référentielle). Un test dbt est en réalité une requête qui recherche les lignes **en erreur** : s'il en trouve, le test échoue. On peut écrire ses propres tests SQL dans `tests/` ou utiliser des paquets comme `dbt_utils`.

> [!NOTE]
> La clé `data_tests` est la syntaxe actuelle ; les projets plus anciens utilisent `tests`, toujours accepté.

## Les commandes essentielles

```bash
dbt debug                              # vérifier la connexion
dbt run                                # construire tous les modèles
dbt test                               # exécuter tous les tests
dbt build                              # run + test (+ seeds, snapshots) dans l'ordre du DAG
dbt build --select stg_boutique__commandes+   # ce modèle et tout ce qui en dépend
dbt docs generate && dbt docs serve    # documentation et graphe de lignage
```

`dbt build` est la commande de production : il teste chaque modèle juste après l'avoir construit et **n'exécute pas** les modèles qui en dépendent si un test bloquant échoue, ce qui évite de propager des données fausses.

# Exercices

## Exercice 1 : Écrire un modèle de staging

La table source `brut_crm.contacts` contient `ContactID` (texte), `Email` (avec majuscules et espaces), `SignupDate` (texte au format `AAAA-MM-JJ`) et `IsDeleted` (booléen). Écrivez `stg_crm__contacts`.

<details>
<summary>Voir la solution</summary>

```sql
select
    cast(ContactID as bigint)      as contact_id,
    lower(trim(Email))             as email,
    cast(SignupDate as date)       as inscrit_le
from {{ source('crm', 'contacts') }}
where not IsDeleted
```

Et la déclaration de la source `crm` (schéma `brut_crm`, table `contacts`) dans un fichier `_crm__sources.yml`. Le staging renomme, type et nettoie ; il ne joint pas d'autres tables.

</details>

## Exercice 2 : Pourquoi ref() ?

Un collègue écrit `from analytics.stg_boutique__commandes` en dur dans un mart. Quels problèmes cela pose-t-il ?

<details>
<summary>Voir la solution</summary>

1. dbt **ne connaît pas la dépendance** : il peut construire le mart **avant** le modèle de staging (données périmées) et le graphe de lignage est faux.
2. Le nom de schéma est **figé** : en développement, le mart lira la table de production au lieu de celle du développeur.
3. Les sélections comme `stg_boutique__commandes+` n'incluront pas ce mart.

</details>

## Exercice 3 : Choisir les tests

Pour un mart `fct_paiements` (une ligne par paiement : `paiement_id`, `commande_id`, `montant`, `moyen`), proposez des tests.

<details>
<summary>Voir la solution</summary>

- `paiement_id` : `unique`, `not_null` (vérifie la granularité) ;
- `commande_id` : `not_null`, `relationships` vers `fct_commandes` ;
- `moyen` : `accepted_values` (`carte`, `virement`, `paypal`…) ;
- `montant` : un test personnalisé ou `dbt_utils.accepted_range` pour vérifier qu'il est positif (ou explicitement autoriser les remboursements négatifs) ;
- un test de cohérence métier : la somme des paiements d'une commande ne dépasse pas son montant.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Transformer avec dbt
center: Des SELECT versionnés, reliés par ref(), construits dans le bon ordre et testés dans l'entrepôt.
points:
  - icon: code
    title: Des modèles en SQL
    text: Un fichier, un SELECT ; dbt crée vue ou table dans l'entrepôt.
  - icon: network
    title: ref() et le DAG
    text: Les dépendances déclarées donnent l'ordre d'exécution et le lignage.
  - icon: layers
    title: Les couches
    text: Sources, staging (une par source), intermediate, marts (fct_, dim_).
  - icon: database
    title: Matérialisations
    text: view, table, incremental, ephemeral selon taille et usage.
  - icon: test
    title: Tests et docs
    text: unique, not_null, accepted_values, relationships ; dbt build stoppe la propagation.
pitfall: Écrire des noms de tables en dur au lieu de ref() et casser l'ordre d'exécution et le lignage.
remember: Un modèle sans test est une hypothèse, pas une donnée fiable.
```
