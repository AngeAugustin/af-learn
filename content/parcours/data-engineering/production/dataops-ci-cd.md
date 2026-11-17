---
title: "DataOps : tests, CI/CD et exploitation"
description: Tester le code de données, automatiser l'intégration et le déploiement, superviser les pipelines et organiser l'exploitation (alertes, astreinte, post-mortem).
duration: 55
objectives:
  - Construire une stratégie de tests pour un projet de données
  - Mettre en place une chaîne CI/CD avec GitHub Actions
  - Définir des objectifs de service et superviser les pipelines
  - Organiser l'exploitation et l'amélioration continue
---

# Le DataOps

Le **DataOps** applique aux données les pratiques qui ont transformé le développement logiciel (DevOps, méthodes agiles) : **automatiser**, **tester**, **livrer souvent par petits incréments**, **mesurer**. L'objectif : livrer des données fiables plus vite, avec moins d'incidents.

```diagram
type: flow
title: La boucle DataOps
loop: Chaque incident et chaque mesure alimentent les améliorations suivantes
steps:
  - title: Développer
    text: Branche, code et tests
    tone: blue
  - title: Intégrer
    text: "CI : tests automatiques sur chaque pull request"
    tone: amber
  - title: Déployer
    text: "CD : mise en production automatisée"
    tone: teal
  - title: Exploiter
    text: Supervision, alertes, qualité des données
    tone: teal
  - title: Apprendre
    text: Post-mortem, nouveaux tests
    tone: violet
```

# Tester un projet de données

Un projet de données contient deux choses à tester : le **code** (Python, SQL, configuration) et les **données** qu'il produit. Le module 8 a traité les tests de données ; voici les tests du code.

```diagram
type: layers
title: La pyramide des tests d'un projet de données
layers:
  - title: Tests de bout en bout (peu nombreux)
    text: Le pipeline complet sur un petit jeu de données, en recette
  - title: Tests d'intégration
    text: Connexion réelle à une base de test, au stockage, à une API simulée
  - title: Tests unitaires (nombreux et rapides)
    text: Fonctions de transformation Python, tests unitaires dbt, analyse des fichiers
```

## Tests unitaires en Python

Isolez la logique de transformation dans des **fonctions pures** (sans accès réseau ni base), faciles à tester avec `pytest` :

```python
# transformations.py
from decimal import Decimal


def normaliser_commande(brute: dict) -> dict:
    return {
        "commande_id": int(brute["id"]),
        "email": brute["email"].strip().lower(),
        "montant": Decimal(brute["amount_cents"]) / 100,
        "statut": {"paid": "payee", "shipped": "expediee", "cancelled": "annulee"}[brute["status"]],
    }
```

```python
# tests/test_transformations.py
from decimal import Decimal

import pytest

from transformations import normaliser_commande


def test_normalise_les_champs():
    brute = {"id": "42", "email": "  Alice@Exemple.FR ", "amount_cents": "1999", "status": "paid"}
    assert normaliser_commande(brute) == {
        "commande_id": 42,
        "email": "alice@exemple.fr",
        "montant": Decimal("19.99"),
        "statut": "payee",
    }


def test_statut_inconnu_leve_une_erreur():
    with pytest.raises(KeyError):
        normaliser_commande({"id": "1", "email": "a@b.c", "amount_cents": "0", "status": "lost"})
```

## Tests d'intégration

Ils vérifient l'interaction avec les vrais systèmes : une base PostgreSQL de test démarrée dans un conteneur (avec Docker Compose, ou la bibliothèque **Testcontainers**), DuckDB pour exécuter le SQL localement, un stockage objet simulé. On y vérifie par exemple qu'un chargement **rejoué deux fois** ne crée pas de doublons : l'idempotence se teste.

```video
url: https://www.youtube.com/watch?v=SHGuqvnfBCQ
title: "DevOps for Data Engineering: Streamline CI/CD for AI & Data Pipelines"
channel: "IBM Technology"
duration: "7:16"
lang: en
why: "IBM Technology applique les principes DevOps aux pipelines de données : tests, intégration et déploiement continus."
```

# La chaîne CI/CD

L'**intégration continue** (CI) exécute automatiquement les vérifications à chaque pull request ; le **déploiement continu** (CD) met en production ce qui a été fusionné.

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:17
        env:
          POSTGRES_PASSWORD: ci
        ports: ["5432:5432"]
        options: >-
          --health-cmd pg_isready --health-interval 5s --health-retries 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: ruff check .                    # analyse statique et style
      - run: pytest                          # tests unitaires et d'intégration
        env:
          DATABASE_URL: postgresql://postgres:ci@localhost:5432/postgres
      - run: sqlfluff lint models/           # style du SQL (optionnel)

  deploiement:
    if: github.ref == 'refs/heads/main'
    needs: tests
    runs-on: ubuntu-latest
    environment: production                  # règles de protection et secrets de production
    steps:
      - uses: actions/checkout@v4
      - run: ./scripts/deployer.sh           # image Docker, DAG, dbt, Terraform…
```

Ce que vérifie typiquement la CI d'un projet de données :

- **analyse statique** et style (Ruff pour Python, SQLFluff pour SQL) ;
- **tests** unitaires et d'intégration ;
- pour dbt : `dbt build --select state:modified+` dans un schéma temporaire (module 4) ;
- pour Airflow : chargement de tous les DAG sans erreur d'import ;
- pour Terraform : `terraform fmt -check`, `terraform validate` et le **plan** affiché dans la pull request.

> [!TIP]
> Une CI lente n'est pas utilisée. Visez quelques minutes : tests unitaires rapides, base de test légère, et seulement les modèles modifiés pour dbt.

# Superviser et exploiter

## Des objectifs de service

Pour savoir si la plateforme « fonctionne », définissez des **objectifs** mesurables avec les utilisateurs, sur le modèle des SLO (*Service Level Objectives*) de l'exploitation logicielle :

| Indicateur | Exemple d'objectif |
|---|---|
| **Fraîcheur** | Les tables de ventes sont à jour à 7 h, 99 % des jours ouvrés |
| **Réussite** | 98 % des exécutions planifiées réussissent sans intervention |
| **Qualité** | Zéro test bloquant en échec publié en production |
| **Délai de rétablissement** | Un incident sur une table critique est résolu en moins de 4 h ouvrées |

## Les alertes

Une bonne alerte est **actionnable** (quelqu'un sait quoi faire), **routée** vers la bonne équipe, et **graduée** (urgent la nuit seulement si une donnée critique est en jeu). Pour chaque alerte importante, un **guide d'intervention** (*runbook*) décrit le diagnostic et les gestes à faire : où lire les journaux, comment relancer, qui prévenir.

## Le post-mortem sans blâme

Après un incident significatif, un **post-mortem** documente : la chronologie, l'impact, les causes (techniques et organisationnelles), ce qui a bien fonctionné, et les **actions** pour éviter la récidive (nouveau test, nouvelle alerte, contrat avec l'équipe source). Il est **sans blâme** : on cherche à améliorer le système, pas à désigner un coupable, sinon les incidents finissent par être cachés.

# Exercices

## Exercice 1 : Rendre testable

Cette fonction est difficile à tester. Pourquoi ? Proposez un découpage.

```python
def traiter():
    lignes = requests.get("https://api.exemple.com/ventes", timeout=30).json()
    propres = [l for l in lignes if l["montant"] > 0]
    for l in propres:
        l["montant_ttc"] = round(l["montant"] * 1.2, 2)
    connexion.execute("INSERT INTO ventes …", propres)
```

<details>
<summary>Voir la solution</summary>

Elle mélange **extraction** (réseau), **transformation** (logique) et **chargement** (base) : la tester exige un réseau et une base. Découpage :

```python
def extraire(client) -> list[dict]: ...                 # réseau, testé en intégration
def transformer(lignes: list[dict]) -> list[dict]:       # pure, testée unitairement
    return [{**l, "montant_ttc": round(l["montant"] * 1.2, 2)} for l in lignes if l["montant"] > 0]
def charger(connexion, lignes: list[dict]) -> None: ...  # base, testé en intégration (idempotence)
```

Bonus : le taux de TVA en dur (1.2) devrait être un paramètre ou une donnée de référence, et les montants être des `Decimal`.

</details>

## Exercice 2 : Concevoir la CI

Un dépôt contient des DAG Airflow, un projet dbt et du Terraform. Listez les vérifications que la CI devrait exécuter sur chaque pull request.

<details>
<summary>Voir la solution</summary>

- **Python** : Ruff, tests `pytest` (fonctions de transformation), import de tous les DAG sans erreur (pas d'erreur de syntaxe ni de cycle).
- **dbt** : compilation, `dbt build --select state:modified+ --defer` dans un schéma temporaire, tests unitaires dbt, éventuellement SQLFluff.
- **Terraform** : `terraform fmt -check`, `terraform validate`, et un `terraform plan` publié en commentaire de la pull request pour relecture.
- **Sécurité** : détection de secrets, analyse des dépendances vulnérables.

</details>

## Exercice 3 : Écrire un objectif

Le directeur commercial se plaint que « les chiffres ne sont jamais à jour ». Comment transformer cette plainte en objectif mesurable et en supervision ?

<details>
<summary>Voir la solution</summary>

1. Clarifier le besoin : « à jour » signifie quoi ? Par exemple : les ventes de la veille disponibles dans le tableau de bord à 8 h chaque jour ouvré.
2. Formaliser l'objectif : « 99 % des jours ouvrés, la table `fct_ventes` contient les ventes de la veille avant 8 h ».
3. Superviser : contrôle de fraîcheur à 7 h 30 avec alerte à l'équipe data, et indicateur mensuel du taux de respect partagé avec le directeur.
4. Analyser les échecs (post-mortem) pour agir sur les causes récurrentes.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: DataOps, CI/CD et exploitation
center: Automatiser les vérifications, livrer par petits pas, mesurer le service rendu et apprendre de chaque incident.
points:
  - icon: test
    title: Tester le code
    text: Fonctions pures testées unitairement, intégration avec une vraie base, idempotence vérifiée.
  - icon: git
    title: CI sur chaque pull request
    text: Lint, tests, dbt modifié, DAG importables, plan Terraform relu.
  - icon: rocket
    title: Déploiement automatisé
    text: Seule la branche principale déploie, avec les secrets de production protégés.
  - icon: target
    title: Objectifs de service
    text: Fraîcheur, réussite, qualité, délai de rétablissement, mesurés et partagés.
  - icon: book
    title: Exploiter
    text: Alertes actionnables, guides d'intervention, post-mortems sans blâme.
pitfall: Des alertes à 3 h du matin pour des tables que personne ne consulte avant midi.
remember: Une plateforme fiable n'est pas celle qui n'a jamais d'incident, mais celle qui apprend de chacun.
```
