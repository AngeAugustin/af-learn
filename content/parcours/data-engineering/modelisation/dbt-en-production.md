---
title: dbt en production
description: Modèles incrémentaux, snapshots pour historiser, macros, tests unitaires, contrats de modèles et intégration continue d'un projet dbt.
duration: 60
objectives:
  - Écrire un modèle incrémental correct et savoir quand le reconstruire
  - Historiser une table source avec un snapshot (SCD de type 2)
  - Factoriser du SQL avec des macros et des paquets
  - Sécuriser un projet avec tests unitaires, contrats et CI
---

# Les modèles incrémentaux

Reconstruire chaque jour une table de 3 milliards d'événements coûte cher et prend du temps, alors que seuls les événements de la veille sont nouveaux. Un **modèle incrémental** ne traite que les **nouvelles** lignes et les ajoute (ou les fusionne) dans la table existante.

```sql
-- models/marts/fct_evenements.sql
{{
    config(
        materialized='incremental',
        unique_key='evenement_id',
        incremental_strategy='merge'
    )
}}

select
    evenement_id,
    utilisateur_id,
    type,
    horodatage,
    charge_le
from {{ ref('stg_tracking__evenements') }}

{% if is_incremental() %}
  -- Uniquement les lignes chargées depuis la dernière exécution, avec une marge de 3 jours
  where charge_le > (select max(charge_le) from {{ this }}) - interval '3 days'
{% endif %}
```

- `is_incremental()` est vrai quand la table existe déjà (et qu'on ne force pas la reconstruction) ;
- `{{ this }}` désigne la table du modèle lui-même ;
- `unique_key` + stratégie `merge` : une ligne déjà présente est **mise à jour** au lieu d'être dupliquée, ce qui rend la **marge de recouvrement** sans danger.

```diagram
type: compare
title: Première exécution et exécutions suivantes
columns:
  - title: Première exécution (ou --full-refresh)
    tone: blue
    items:
      - is_incremental() est faux
      - Toutes les lignes sont traitées
      - La table est créée
  - title: Exécutions suivantes
    tone: teal
    items:
      - is_incremental() est vrai
      - Seules les lignes récentes sont lues
      - MERGE sur unique_key dans la table existante
```

> [!WARNING]
> Filtrez sur la date de **chargement** (`charge_le`), pas sur la date de l'**événement** : des événements anciens peuvent arriver en retard (application mobile restée hors ligne). Et prévoyez une marge de recouvrement : sans elle, les lignes arrivées pendant l'exécution précédente peuvent être manquées.

Les stratégies disponibles dépendent de l'adaptateur : `append` (ajout simple, sans dédoublonnage), `merge`, `delete+insert`, `insert_overwrite` (remplacement de partitions entières, efficace sur BigQuery ou Spark). Quand la logique du modèle change, il faut **reconstruire** toute la table : `dbt build --select fct_evenements --full-refresh`.

# Les snapshots : historiser une source

Beaucoup de systèmes sources ne gardent que l'**état courant** : quand un client change de ville, l'ancienne valeur est perdue. Un **snapshot** dbt capture l'état d'une table à chaque exécution et construit un historique en **SCD de type 2** (chapitre 1 de ce module).

```yaml
# snapshots/clients_snapshot.yml
snapshots:
  - name: clients_snapshot
    relation: source('crm', 'clients')
    config:
      unique_key: id
      strategy: timestamp
      updated_at: mis_a_jour_le
```

Chaque exécution de `dbt snapshot` compare l'état actuel à l'historique : pour une ligne modifiée, la version précédente est **close** (`dbt_valid_to` renseigné) et une nouvelle version est insérée. La stratégie `timestamp` s'appuie sur une colonne de date de mise à jour fiable ; la stratégie `check` compare une liste de colonnes quand cette date n'existe pas.

> [!IMPORTANT]
> Un snapshot ne voit que les états **au moment où il s'exécute** : si un client change deux fois de ville entre deux exécutions, la valeur intermédiaire est perdue. Pour un historique exhaustif, il faut capturer les changements à la source (CDC, module 5). Et un snapshot ne se reconstruit pas : l'historique perdu l'est définitivement, sauvegardez ces tables.

> [!NOTE]
> La déclaration des snapshots en YAML est la syntaxe des versions récentes de dbt ; les projets plus anciens utilisent un bloc `{% snapshot %}` dans un fichier `.sql`. Le principe est identique.

```video
url: https://www.youtube.com/watch?v=caR5S07YJ7Y
title: "how to use dbt snapshot to manage slowly changing dimensions"
channel: "BI Insights Inc"
duration: "7:26"
lang: en
why: "Une démonstration des snapshots dbt pour historiser une source qui change, la stratégie timestamp comme la stratégie check."
```

# Factoriser : macros et paquets

Une **macro** est une fonction Jinja réutilisable qui génère du SQL :

```sql
-- macros/centimes_en_euros.sql
{% macro centimes_en_euros(colonne, decimales=2) %}
    round(cast({{ colonne }} as numeric) / 100, {{ decimales }})
{% endmacro %}
```

```sql
select {{ centimes_en_euros('amount_cents') }} as montant
from {{ source('boutique', 'commandes') }}
```

Les **paquets** partagent macros et tests. `dbt_utils` est le plus utilisé :

```yaml
# packages.yml
packages:
  - package: dbt-labs/dbt_utils
    version: [">=1.0.0", "<2.0.0"]
```

```sql
select
    {{ dbt_utils.generate_surrogate_key(['commande_id', 'produit_id']) }} as ligne_id,
    ...
```

`dbt deps` installe les paquets. Épinglez une plage de versions pour éviter qu'une mise à jour majeure ne casse le projet.

> [!TIP]
> N'abusez pas du Jinja : un modèle doit rester lisible en SQL. Une macro se justifie pour une logique **répétée** à plusieurs endroits ou dépendante de l'entrepôt cible, pas pour masquer trois lignes de SQL.

# Tests unitaires et contrats

## Les tests unitaires

Les tests de données vérifient les **données produites** ; les **tests unitaires** (disponibles depuis dbt 1.8) vérifient la **logique** d'un modèle sur des données d'entrée fictives, avant même de l'exécuter sur les vraies données.

```yaml
unit_tests:
  - name: segmentation_des_paniers
    model: int_commandes_segmentees
    given:
      - input: ref('stg_boutique__commandes')
        rows:
          - {commande_id: 1, montant: 250}
          - {commande_id: 2, montant: 60}
          - {commande_id: 3, montant: 10}
    expect:
      rows:
        - {commande_id: 1, segment: 'gros panier'}
        - {commande_id: 2, segment: 'panier moyen'}
        - {commande_id: 3, segment: 'petit panier'}
```

Ils sont précieux pour les logiques délicates : `CASE` à plusieurs branches, calculs de dates, cas limites (montant exactement égal au seuil, valeurs `NULL`).

## Les contrats de modèles

Un **contrat** garantit la **forme** d'un modèle consommé par d'autres (tableaux de bord, autres équipes) : noms et types des colonnes, contraintes. Si une modification du SQL change le schéma, la construction **échoue** au lieu de casser silencieusement les consommateurs.

```yaml
models:
  - name: fct_commandes
    config:
      contract:
        enforced: true
    columns:
      - name: commande_id
        data_type: bigint
        constraints:
          - type: not_null
      - name: montant
        data_type: numeric
```

# L'intégration continue

Un projet dbt se gère comme du code applicatif : branches, pull requests, relecture, **CI** (module 9). À chaque pull request, la CI construit et teste les modèles modifiés dans un schéma temporaire.

```bash
# Construire et tester uniquement les modèles modifiés et leurs descendants,
# en lisant les modèles non modifiés depuis la production
dbt build --select state:modified+ --defer --state ./artefacts-prod
```

```diagram
type: flow
title: Cycle de vie d'une modification dbt
steps:
  - title: Branche
    text: Modèle modifié en développement
    tone: blue
  - title: Pull request
    text: Relecture du SQL et des tests
    tone: amber
  - title: CI
    text: state:modified+ dans un schéma temporaire
    tone: teal
  - title: Fusion
    text: Déploiement en production
    tone: teal
  - title: Exécution planifiée
    text: dbt build par l'orchestrateur
    tone: teal
```

`state:modified` compare le projet au **manifeste** (`manifest.json`) de la dernière exécution de production ; `--defer` permet de lire les modèles non modifiés directement depuis la production au lieu de tout reconstruire. Résultat : une CI rapide et peu coûteuse, même sur un gros projet.

# Exercices

## Exercice 1 : Le modèle incrémental qui perd des lignes

Ce modèle perd régulièrement des événements. Pourquoi ? Corrigez-le.

```sql
{{ config(materialized='incremental') }}
select * from {{ ref('stg_tracking__evenements') }}
{% if is_incremental() %}
  where horodatage > (select max(horodatage) from {{ this }})
{% endif %}
```

<details>
<summary>Voir la solution</summary>

1. Le filtre porte sur la date de l'**événement** : un événement arrivé en retard, avec un horodatage antérieur au maximum déjà chargé, est ignoré pour toujours.
2. Aucune marge : les lignes chargées pendant l'exécution précédente peuvent être manquées.
3. Sans `unique_key`, ajouter une marge créerait des doublons.

```sql
{{ config(materialized='incremental', unique_key='evenement_id', incremental_strategy='merge') }}
select evenement_id, utilisateur_id, type, horodatage, charge_le
from {{ ref('stg_tracking__evenements') }}
{% if is_incremental() %}
  where charge_le > (select max(charge_le) from {{ this }}) - interval '3 days'
{% endif %}
```

</details>

## Exercice 2 : Snapshot ou pas ?

Dans quels cas un snapshot dbt est-il utile ?

1. La table source `produits` ne garde que le prix courant ; on veut l'historique des prix.
2. La table source `commandes` contient déjà une ligne par changement de statut, avec la date.
3. On veut l'historique des adresses clients, et il arrive qu'un client change d'adresse plusieurs fois dans la journée.

<details>
<summary>Voir la solution</summary>

1. **Oui** : la source écrase l'ancien prix, le snapshot construit l'historique.
2. **Non** : l'historique existe déjà dans la source ; il suffit de le modéliser.
3. **Partiellement** : un snapshot quotidien ne capte que l'état au moment de son exécution ; les changements intermédiaires sont perdus. Il faut capturer les changements à la source (CDC) si chaque version compte.

</details>

## Exercice 3 : Contrat ou test ?

Quelle est la différence entre un test `not_null` sur `commande_id` et une contrainte `not_null` dans un contrat ?

<details>
<summary>Voir la solution</summary>

Le **test** s'exécute **après** la construction : il interroge les données produites et signale les lignes fautives. Le **contrat** vérifie, **au moment de la construction**, que le modèle a bien les colonnes et types annoncés, et applique les contraintes quand l'entrepôt les prend en charge ; si le schéma ne correspond pas, la construction échoue. Le contrat protège la **forme** de l'interface, les tests vérifient le **contenu**. On utilise les deux pour les modèles exposés.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: dbt en production
center: Traiter seulement le nouveau, historiser ce que la source oublie, tester logique et forme avant de déployer.
points:
  - icon: loop
    title: Incrémental
    text: Filtre sur la date de chargement, marge de recouvrement, unique_key et merge.
  - icon: clock
    title: Snapshots
    text: SCD type 2 d'une source qui écrase ; ne capte que l'état à chaque exécution.
  - icon: puzzle
    title: Macros et paquets
    text: Factoriser le SQL répété ; dbt_utils ; versions épinglées.
  - icon: test
    title: Tests unitaires et contrats
    text: Vérifier la logique sur des données fictives, garantir colonnes et types exposés.
  - icon: git
    title: CI rapide
    text: state:modified+ avec --defer pour ne construire que ce qui change.
pitfall: Filtrer un modèle incrémental sur la date de l'événement et perdre à jamais les données en retard.
remember: Un historique non capturé par un snapshot est perdu définitivement ; on ne peut pas le reconstruire.
```
