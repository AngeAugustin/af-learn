---
title: "Outillage professionnel : Git, tests et journalisation"
description: Versionner son travail, écrire des tests automatisés (y compris pour du code qui appelle un modèle) et journaliser proprement.
duration: 50
objectives:
  - Utiliser le flux de travail Git de base (branches, commits, pull requests)
  - Écrire des tests unitaires avec pytest
  - Tester du code qui dépend d'un LLM sans appeler réellement le modèle
  - Mettre en place une journalisation exploitable
---

# Git au quotidien

**Git** enregistre l'historique de votre code. Dans une équipe, il permet de travailler en parallèle et de relire les changements avant de les intégrer. Pour un AI Engineer, il a une importance supplémentaire : les **prompts** sont du code. Une modification de prompt peut changer radicalement le comportement de l'application ; elle doit donc être versionnée, relue et testée comme n'importe quel changement.

```diagram
type: flow
title: Flux de travail avec des branches
steps:
  - title: Créer une branche
    text: git switch -c feature/resume
  - title: Commits
    text: Petits changements cohérents
  - title: Pousser
    text: git push -u origin feature/resume
  - title: Pull request
    text: Relecture et tests automatiques
  - title: Fusion
    text: Intégration dans la branche principale
```

```bash
git switch -c feature/resume-tickets   # nouvelle branche
git status                             # voir les fichiers modifiés
git add src/resume.py tests/test_resume.py
git commit -m "Ajoute le résumé automatique des tickets"
git push -u origin feature/resume-tickets
```

Bonnes pratiques :

- des **commits petits et cohérents**, avec un message qui explique *pourquoi* ;
- **jamais** de secrets, de fichiers `.env`, d'environnements virtuels (`.venv/`) ou de gros jeux de données dans Git (utilisez `.gitignore`) ;
- une **pull request** relue avant chaque fusion dans la branche principale.

> [!TIP]
> Stockez vos prompts dans des fichiers dédiés (ou des constantes clairement identifiées) plutôt que noyés dans le code. Leur historique Git devient alors lisible : on voit exactement quelle phrase a été modifiée, quand et pourquoi.

# Tester avec pytest

Un **test automatisé** vérifie qu'un morceau de code produit le résultat attendu. On l'exécute à chaque modification, localement et dans l'intégration continue (CI). [pytest](https://docs.pytest.org/) est l'outil de référence en Python.

```python
# src/texte.py
def tronquer(texte: str, max_mots: int) -> str:
    mots = texte.split()
    if len(mots) <= max_mots:
        return texte
    return " ".join(mots[:max_mots]) + "…"
```

```python
# tests/test_texte.py
import pytest
from src.texte import tronquer


def test_texte_court_inchange():
    assert tronquer("bonjour le monde", 5) == "bonjour le monde"


def test_texte_long_tronque():
    assert tronquer("un deux trois quatre", 2) == "un deux…"


@pytest.mark.parametrize("max_mots", [0, 1, 3])
def test_ne_depasse_jamais_la_limite(max_mots):
    resultat = tronquer("a b c d e f", max_mots)
    assert len(resultat.rstrip("…").split()) <= max_mots
```

```bash
pytest -q
```

## Les niveaux de tests

| Type | Ce qu'il vérifie | Vitesse |
|---|---|---|
| Unitaire | Une fonction isolée | Très rapide |
| Intégration | Plusieurs composants ensemble (API + base de données) | Moyenne |
| De bout en bout | Le parcours complet d'un utilisateur | Lente |
| Évaluation (module 8) | La **qualité** des réponses du modèle sur un jeu d'exemples | Lente et coûteuse |

Les tests classiques vérifient que **le code** est correct. Les évaluations, que nous verrons au module 8, vérifient que **le système, modèle compris,** donne de bonnes réponses. Les deux sont nécessaires et complémentaires.

# Tester du code qui appelle un modèle

Appeler un vrai modèle dans les tests unitaires pose trois problèmes : c'est **lent**, c'est **payant**, et le résultat **varie** d'une exécution à l'autre. La solution est de séparer :

- la **logique** autour du modèle (construction du prompt, analyse et validation de la réponse, gestion d'erreurs), testée unitairement avec un **faux modèle** ;
- la **qualité** des réponses du vrai modèle, mesurée par des évaluations.

Pour rendre le code testable, on **injecte** la fonction qui appelle le modèle au lieu de la coder en dur :

```python
# src/classement.py
from typing import Callable, Literal
from pydantic import BaseModel

Categorie = Literal["facturation", "technique", "autre"]


class Classement(BaseModel):
    categorie: Categorie


def construire_prompt(ticket: str) -> str:
    return (
        "Classe ce ticket dans une catégorie parmi : facturation, technique, autre.\n"
        'Réponds uniquement en JSON, par exemple {"categorie": "technique"}.\n\n'
        f"Ticket : {ticket}"
    )


def classer(ticket: str, appeler_modele: Callable[[str], str]) -> Categorie:
    brut = appeler_modele(construire_prompt(ticket))
    try:
        return Classement.model_validate_json(brut).categorie
    except ValueError:
        return "autre"  # repli sûr si la sortie est invalide
```

```python
# tests/test_classement.py
from src.classement import classer, construire_prompt


def test_prompt_contient_le_ticket():
    assert "Mon imprimante" in construire_prompt("Mon imprimante est en panne")


def test_reponse_valide():
    faux_modele = lambda prompt: '{"categorie": "technique"}'
    assert classer("Mon imprimante est en panne", faux_modele) == "technique"


def test_reponse_invalide_donne_un_repli():
    faux_modele = lambda prompt: "Je pense que c'est technique."
    assert classer("Mon imprimante est en panne", faux_modele) == "autre"
```

`ValidationError` de Pydantic hérite de `ValueError`, d'où le `except ValueError` qui couvre à la fois le JSON mal formé et les valeurs non autorisées.

> [!IMPORTANT]
> Le dernier test est le plus précieux : il vérifie que votre code **résiste** à une sortie inattendue du modèle. En production, cela arrivera.

# Journaliser correctement

Quand un utilisateur signale « l'assistant m'a répondu n'importe quoi hier », il faut pouvoir retrouver ce qui s'est passé. La **journalisation** (*logging*) enregistre les événements importants de l'application.

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("assistant")

logger.info("Classement terminé", extra={"ticket_id": 42, "categorie": "technique"})
logger.warning("Sortie du modèle invalide, repli appliqué")
```

Dans une application d'IA, on journalise en particulier :

- un **identifiant de requête** pour relier les événements d'un même traitement ;
- le **modèle** utilisé et la **version du prompt** ;
- la **consommation de tokens** et la **latence** de chaque appel ;
- les **erreurs** et les **replis** déclenchés.

> [!WARNING]
> Les prompts et les réponses contiennent souvent des **données personnelles**. Avant de les journaliser intégralement, vérifiez les obligations applicables (par exemple le RGPD en Europe) : durée de conservation, droits d'accès, masquage des données sensibles. Le module 8 approfondit l'observabilité.

Préférez des journaux **structurés** (un objet JSON par ligne) en production : ils se filtrent et s'agrègent facilement dans les outils de supervision.

# Exercices

## Exercice 1 : Tester une fonction de nettoyage

Écrivez une fonction `nettoyer(texte: str) -> str` qui supprime les espaces en début et fin de chaîne et remplace toute suite d'espaces, de tabulations ou de retours à la ligne par **un seul** espace. Écrivez au moins trois tests pytest.

<details>
<summary>Voir la solution</summary>

```python
import re


def nettoyer(texte: str) -> str:
    return re.sub(r"\s+", " ", texte).strip()
```

```python
from src.nettoyage import nettoyer


def test_espaces_multiples():
    assert nettoyer("a    b") == "a b"


def test_retours_ligne_et_tabulations():
    assert nettoyer("a\n\n\tb") == "a b"


def test_bords():
    assert nettoyer("   bonjour  ") == "bonjour"


def test_chaine_vide():
    assert nettoyer("   ") == ""
```

</details>

## Exercice 2 : Rendre une fonction testable

Cette fonction est difficile à tester. Pourquoi ? Réécrivez-la pour pouvoir la tester sans appeler l'API.

```python
import anthropic

def traduire(texte: str) -> str:
    client = anthropic.Anthropic()
    reponse = client.messages.create(
        model="claude-sonnet-5-5",
        max_tokens=1000,
        messages=[{"role": "user", "content": f"Traduis en anglais : {texte}"}],
    )
    return reponse.content[0].text
```

<details>
<summary>Voir la solution</summary>

Le client et l'appel réseau sont créés **à l'intérieur** de la fonction : impossible de les remplacer par un faux dans un test sans modifier le module. De plus, la fonction suppose que le premier bloc de contenu est du texte.

```python
from typing import Callable


def construire_prompt_traduction(texte: str) -> str:
    return f"Traduis en anglais. Réponds uniquement avec la traduction.\n\n{texte}"


def traduire(texte: str, appeler_modele: Callable[[str], str]) -> str:
    return appeler_modele(construire_prompt_traduction(texte)).strip()
```

En production, on fournit une fonction qui appelle réellement l'API (et qui extrait les blocs de type `text`) ; dans les tests, une simple `lambda`.

</details>

## Exercice 3 : Que journaliser ?

Pour un appel au modèle dans une fonctionnalité de résumé, listez les champs que vous enregistreriez, et ceux que vous éviteriez d'enregistrer en clair.

<details>
<summary>Voir la solution</summary>

À enregistrer : identifiant de requête, identifiant (pseudonymisé) de l'utilisateur, modèle, version du prompt, tokens en entrée et en sortie, latence, code de statut, raison d'arrêt de la génération, erreurs et replis.

À éviter en clair, ou à masquer selon la politique de l'entreprise : contenu complet des documents de l'utilisateur, données personnelles (adresses courriel, numéros de téléphone, informations de santé…), secrets éventuellement présents dans le texte.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Git, tests et journalisation
center: "Les prompts sont du code : versionnés, testés et observés comme le reste."
points:
  - icon: git
    title: Git au quotidien
    text: Branches, petits commits expliqués, pull requests relues ; jamais de secrets versionnés.
  - icon: test
    title: Tester avec pytest
    text: Des tests rapides et reproductibles pour la logique autour du modèle.
  - icon: puzzle
    title: Injecter le modèle
    text: Passer la fonction d'appel en paramètre pour la remplacer par un faux dans les tests.
  - icon: shield
    title: Tester la robustesse
    text: Vérifier que le code résiste à une sortie invalide grâce à un repli sûr.
  - icon: file
    title: Journaliser utilement
    text: Identifiant de requête, modèle, version du prompt, tokens, latence, erreurs.
pitfall: Journaliser intégralement prompts et réponses sans se soucier des données personnelles.
remember: "Les tests vérifient le code, les évaluations vérifient la qualité : il faut les deux."
```
