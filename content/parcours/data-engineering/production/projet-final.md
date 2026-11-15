---
title: "Projet final : une plateforme analytique de bout en bout"
description: "Construire, sur votre machine, une plateforme complète pour une boutique en ligne : ingestion, lake, transformations dbt, orchestration, qualité et documentation."
duration: 90
objectives:
  - Concevoir l'architecture d'une plateforme de données à partir d'un besoin métier
  - Implémenter ingestion incrémentale, modélisation dimensionnelle et tests
  - Orchestrer et superviser le pipeline de bout en bout
  - Documenter et présenter la plateforme
---

# Le cahier des charges

Vous êtes la première personne Data Engineer d'une boutique en ligne de taille moyenne. La direction veut, chaque matin à 8 h :

1. le **chiffre d'affaires** de la veille et du mois, par catégorie de produit et par canal d'acquisition ;
2. le **panier moyen** et le **taux d'annulation** ;
3. le nombre de **nouveaux clients** et de **clients récurrents** ;
4. un historique **exact** même quand un produit change de catégorie.

Les sources disponibles :

| Source | Contenu | Accès |
|---|---|---|
| Base PostgreSQL de l'application | `clients`, `produits`, `commandes`, `lignes_commande` (avec `mis_a_jour_le`) | Lecture via un compte dédié |
| API du prestataire de paiement | Paiements et remboursements, paginés | Jeton d'accès |
| Fichier CSV quotidien de l'agence marketing | Dépenses et clics par campagne et par jour | Déposé chaque nuit dans un dossier |

> [!NOTE]
> Tout le projet tourne **en local**, gratuitement, avec des outils open source. Vous générez vous-même les données sources avec un script (par exemple avec la bibliothèque `Faker`) : quelques milliers de clients, quelques dizaines de milliers de commandes, et des cas pièges volontaires (doublons, commandes annulées, valeurs manquantes, événements en retard, changement de catégorie d'un produit).

# L'architecture cible

```diagram
type: pipeline
title: Architecture du projet
lanes:
  - title: Sources et ingestion
    steps:
      - title: PostgreSQL source
        text: Docker Compose, données générées
      - title: Ingestion Python
        text: Incrémental par filigrane, idempotent
      - title: API paiements
        text: Simulée, paginée
      - title: CSV marketing
        text: Dossier de dépôt
  - title: Stockage et transformation
    steps:
      - title: Bronze
        text: Parquet partitionné par date de chargement
      - title: Entrepôt DuckDB
        text: Sources dbt
      - title: dbt staging et marts
        text: Étoile, snapshots, tests
      - title: Tableau de bord
        text: Requêtes ou outil open source
  - title: Exploitation
    steps:
      - title: Orchestrateur
        text: Dagster ou Airflow
      - title: Contrôles
        text: Fraîcheur, volume, tests bloquants
      - title: CI
        text: Lint, tests, dbt modifié
      - title: Documentation
        text: README, dbt docs, décisions
```

Pile proposée (vous pouvez justifier d'autres choix) : **Docker Compose** pour PostgreSQL, **Python** (requests, Polars ou DuckDB) pour l'ingestion, **fichiers Parquet** pour la zone bronze, **DuckDB** comme entrepôt avec l'adaptateur **dbt-duckdb**, **Dagster** ou **Airflow** pour l'orchestration, **GitHub Actions** pour la CI.

# Les étapes

## Étape 1 : Sources et ingestion

- Script de génération des données sources (avec des modifications au fil des « jours » simulés).
- Ingestion **incrémentale** des tables PostgreSQL par filigrane sur `mis_a_jour_le`, avec marge et écriture idempotente.
- Ingestion de l'API de paiement paginée, avec `timeout`, nouvelles tentatives et secrets en variables d'environnement.
- Chargement du CSV marketing, avec contrôle du schéma et **quarantaine** des lignes invalides.
- Chaque ingestion est **paramétrée par la période** et écrit en bronze, partitionné par date de chargement.

## Étape 2 : Modélisation et transformation

- Projet dbt : sources déclarées, un modèle de **staging** par source.
- Modèle dimensionnel : `fct_lignes_commande` (granularité : une ligne de commande), `fct_paiements`, `fct_depenses_marketing` ; `dim_clients`, `dim_produits` (**SCD de type 2** via un snapshot sur la catégorie), `dim_date`, `dim_canal`.
- Modèle **incrémental** pour la plus grosse table de faits.
- Les indicateurs demandés dans des modèles de la couche marts.

## Étape 3 : Qualité

- Tests génériques sur toutes les clés (`unique`, `not_null`, `relationships`) ;
- tests métier : montants positifs (ou remboursements explicitement négatifs), somme des lignes égale au total de la commande, paiements rapprochés des commandes ;
- au moins deux **tests unitaires** dbt sur une logique délicate ;
- contrôle de **fraîcheur** et de **volume** avant publication.

## Étape 4 : Orchestration et exploitation

- Un pipeline quotidien : ingestions en parallèle → contrôles → `dbt build` → publication ;
- reprises sur erreurs passagères, délais maximaux, **rattrapage** démontré sur 7 jours passés ;
- une alerte (même un simple message dans la console ou un fichier) en cas d'échec ou de retard.

## Étape 5 : Industrialisation et documentation

- Dépôt Git propre : `.gitignore`, aucun secret, `README` d'installation en moins de 10 commandes ;
- CI : lint Python et SQL, tests, `dbt build` sur un petit jeu de données ;
- documentation dbt générée, description de chaque modèle et colonne exposés ;
- un document de **décisions** : choix d'architecture, alternatives écartées, limites connues.

# La grille d'évaluation

| Critère | Ce qui est attendu |
|---|---|
| **Exactitude** | Les indicateurs sont justes, y compris sur les cas pièges (doublons, annulations, changement de catégorie) |
| **Idempotence** | Chaque étape peut être rejouée sans doublon ; rattrapage démontré |
| **Modélisation** | Granularités explicites, étoile cohérente, historisation correcte |
| **Qualité** | Tests pertinents, contrôles bloquants avant publication |
| **Exploitation** | Orchestration, reprises, alertes, journaux lisibles |
| **Code** | Lisible, testé, versionné, sans secret |
| **Documentation** | Installation reproductible, modèles documentés, décisions justifiées |

> [!TIP]
> Avancez **par tranches verticales** : faites d'abord passer **une** source jusqu'à **un** indicateur, de bout en bout, orchestré et testé. Ajoutez ensuite les autres sources et indicateurs. Un pipeline complet mais simple vaut mieux que trois couches parfaites et rien en bout de chaîne.

# Exercices

## Exercice 1 : La première tranche verticale

Quelle est la plus petite tranche verticale utile pour démarrer ce projet ? Décrivez-la.

<details>
<summary>Voir la solution</summary>

**Commandes → chiffre d'affaires quotidien** :

1. ingestion incrémentale de la table `commandes` vers bronze ;
2. source dbt + `stg_boutique__commandes` (typage, statuts normalisés) ;
3. un mart `ca_quotidien` (commandes non annulées, somme par jour) ;
4. tests `unique` / `not_null` sur `commande_id` ;
5. un pipeline orchestré qui enchaîne les trois et peut être rejoué pour un jour donné.

Tout le reste (lignes de commande, paiements, marketing, SCD) s'ajoute ensuite sur cette ossature qui fonctionne déjà.

</details>

## Exercice 2 : Le piège du changement de catégorie

Le produit « Hamac » passe de la catégorie « Jardin » à « Détente » le 15 du mois. Décrivez précisément comment votre plateforme garantit que le chiffre d'affaires de la catégorie « Jardin » du mois précédent ne change pas.

<details>
<summary>Voir la solution</summary>

1. Un **snapshot** dbt sur la table source `produits` (stratégie `timestamp` sur `mis_a_jour_le`) historise la catégorie : une version valide jusqu'au 14, une nouvelle à partir du 15.
2. `dim_produits` est construite à partir de ce snapshot, avec une **clé de substitution par version** et les colonnes `valide_du` / `valide_au`.
3. Lors de la construction de `fct_lignes_commande`, chaque ligne est jointe à la version de produit **valide à la date de la commande** (`date_commande BETWEEN valide_du AND valide_au`).
4. Un **test** vérifie qu'il n'y a pas de chevauchement de périodes de validité pour un même produit, et que chaque ligne de commande trouve exactement une version.

</details>

## Exercice 3 : Démontrer l'idempotence

Comment prouver, dans votre README ou votre présentation, que le pipeline est idempotent ?

<details>
<summary>Voir la solution</summary>

Un **test automatisé** (et une démonstration) :

1. exécuter le pipeline pour une journée donnée et enregistrer des empreintes des tables produites (nombre de lignes, sommes de contrôle des montants par jour) ;
2. **relancer** le pipeline pour la même journée, puis pour une plage de 7 jours (rattrapage) ;
3. vérifier que les empreintes sont **identiques** et qu'aucun test d'unicité n'échoue.

Intégrez ce scénario à la CI sur un petit jeu de données : l'idempotence est alors vérifiée à chaque modification.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Projet final de Data Engineering
center: Livrer des indicateurs justes chaque matin, grâce à une chaîne simple, testée, rejouable et documentée.
points:
  - icon: target
    title: Partir du besoin
    text: Quatre indicateurs, une heure de livraison, un historique exact.
  - icon: rocket
    title: Tranche verticale
    text: Une source jusqu'à un indicateur, de bout en bout, avant d'élargir.
  - icon: layers
    title: Bronze, étoile, marts
    text: Ingestion idempotente, granularités explicites, SCD 2 pour la catégorie.
  - icon: test
    title: Qualité prouvée
    text: Tests de clés, tests métier, tests unitaires, contrôles avant publication.
  - icon: book
    title: Industrialiser
    text: Orchestration, rattrapage démontré, CI, README, décisions documentées.
pitfall: Peaufiner une couche pendant des semaines sans jamais produire un indicateur de bout en bout.
remember: Un pipeline simple qui livre des chiffres justes chaque jour vaut plus qu'une architecture brillante inachevée.
```
