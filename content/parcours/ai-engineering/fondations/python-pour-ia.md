---
title: Python moderne pour l'IA
description: "Les outils et idiomes Python qu'un AI Engineer utilise chaque jour : environnements, typage, Pydantic, programmation asynchrone."
duration: 60
objectives:
  - Créer un environnement Python isolé et reproductible
  - Utiliser les annotations de type pour rendre le code plus sûr
  - Valider des données avec Pydantic
  - Comprendre et utiliser async/await pour paralléliser des appels réseau
---

# Pourquoi Python ?

Python est le langage dominant de l'écosystème IA : les bibliothèques de machine learning (PyTorch, scikit-learn, Hugging Face Transformers), les SDK des fournisseurs de modèles et la plupart des outils d'évaluation sont d'abord publiés en Python. TypeScript est également très utilisé côté application web, et les principaux fournisseurs proposent des SDK officiels dans les deux langages. Ce parcours utilise **Python** pour les exemples côté serveur.

Un AI Engineer n'a pas besoin de connaître tout Python, mais il doit maîtriser quatre sujets que nous abordons ici :

1. **les environnements** isolés et les dépendances ;
2. **le typage** statique optionnel ;
3. **la validation de données** avec Pydantic ;
4. **l'asynchrone**, indispensable quand on fait beaucoup d'appels réseau.

# Environnements et dépendances

Chaque projet doit avoir son **environnement virtuel** : un dossier qui contient un interpréteur Python et les bibliothèques du projet, isolés du reste du système. Sans cela, deux projets qui demandent des versions différentes d'une même bibliothèque entrent en conflit.

## Avec les outils standards

```bash
# Créer un environnement virtuel dans le dossier .venv
python -m venv .venv

# L'activer
source .venv/bin/activate        # macOS / Linux
.venv\Scripts\activate           # Windows (PowerShell ou cmd)

# Installer des dépendances
pip install anthropic pydantic
```

## Avec uv

[uv](https://docs.astral.sh/uv/) est un gestionnaire de projets et de paquets Python écrit en Rust, devenu très populaire pour sa rapidité. Il gère à la fois la version de Python, l'environnement virtuel et le fichier de verrouillage des dépendances.

```bash
uv init mon-projet        # crée pyproject.toml et la structure du projet
cd mon-projet
uv add anthropic pydantic # ajoute les dépendances et met à jour uv.lock
uv run python main.py     # exécute dans l'environnement du projet
```

Le fichier `pyproject.toml` déclare les dépendances du projet ; le fichier de verrouillage (`uv.lock`) fige les versions exactes pour que toute l'équipe, et le serveur de production, installent exactement la même chose.

> [!TIP]
> Quel que soit l'outil choisi, retenez le principe : **un projet = un environnement = des dépendances déclarées et verrouillées**. Un projet qui « marche sur ma machine » mais pas ailleurs a presque toujours un problème de dépendances non déclarées.

# Le typage en Python

Python est dynamiquement typé, mais il accepte des **annotations de type** (PEP 484 et suivantes). Elles ne changent pas l'exécution du programme ; elles servent à la documentation, à l'autocomplétion de l'éditeur et aux vérificateurs statiques comme **mypy** ou **pyright**.

```python
def moyenne(notes: list[float]) -> float:
    """Retourne la moyenne d'une liste de notes."""
    if not notes:
        raise ValueError("La liste est vide")
    return sum(notes) / len(notes)


def trouver_utilisateur(user_id: int) -> dict[str, str] | None:
    """Retourne l'utilisateur ou None s'il n'existe pas."""
    ...
```

Quelques notations utiles (Python 3.10 et plus) :

| Notation | Signification |
|---|---|
| `list[str]` | liste de chaînes |
| `dict[str, int]` | dictionnaire clés `str`, valeurs `int` |
| `str \| None` | chaîne ou `None` |
| `Literal["a", "b"]` | une valeur parmi une liste fermée (module `typing`) |
| `TypedDict` | dictionnaire dont les clés et les types sont fixés |

Dans une application d'IA, le typage est précieux : on manipule beaucoup de structures (messages, réponses de modèles, résultats d'outils) et une faute de frappe dans une clé de dictionnaire est une source d'erreurs fréquente.

# Valider les données avec Pydantic

Les annotations de type ne vérifient rien à l'exécution. Or une application d'IA reçoit des données **non fiables** : requêtes d'utilisateurs, réponses d'API externes et, surtout, **sorties de modèles**. [Pydantic](https://docs.pydantic.dev/) utilise les annotations de type pour **valider et convertir** les données à l'exécution.

```python
from typing import Literal
from pydantic import BaseModel, Field, ValidationError


class Ticket(BaseModel):
    titre: str = Field(min_length=3)
    priorite: Literal["basse", "normale", "haute"]
    estimation_heures: float = Field(ge=0, le=100)
    etiquettes: list[str] = []


# Données valides : conversion automatique de "4" en 4.0
ticket = Ticket(titre="Bug de connexion", priorite="haute", estimation_heures="4")
print(ticket.estimation_heures)  # 4.0

# Données invalides : une exception détaillée
try:
    Ticket(titre="X", priorite="urgente", estimation_heures=-2)
except ValidationError as e:
    print(e.error_count(), "erreurs")  # 3 erreurs
```

Pydantic sait aussi :

- lire et produire du JSON : `Ticket.model_validate_json(texte)` et `ticket.model_dump_json()` ;
- générer un **schéma JSON** : `Ticket.model_json_schema()`.

Ce dernier point est fondamental pour la suite du parcours : les API de LLM acceptent des schémas JSON pour décrire les **outils** et les **sorties structurées**. Pydantic devient alors le pont entre votre code typé et le modèle.

```diagram
type: flow
title: Pydantic comme garde-fou
steps:
  - title: Sortie du modèle
    text: Texte JSON, potentiellement invalide
  - title: Validation Pydantic
    text: Types, contraintes, valeurs autorisées
  - title: Objet typé
    text: Utilisable sans risque dans le code
```

> [!IMPORTANT]
> Ne passez jamais une sortie de modèle directement à votre base de données ou à une autre API sans validation. Pydantic rend cette validation simple : utilisez-le systématiquement.

# Programmation asynchrone

Un appel à une API de modèle prend typiquement de quelques centaines de millisecondes à plusieurs dizaines de secondes. Pendant ce temps, le processeur ne fait rien : il **attend le réseau**. Si l'on doit traiter 100 documents l'un après l'autre, les temps d'attente s'additionnent.

La programmation asynchrone (`asyncio`, mots-clés `async` / `await`) permet de lancer plusieurs opérations d'entrée-sortie **en parallèle** sur un seul thread : pendant qu'une requête attend sa réponse, d'autres avancent.

```diagram
type: compare
title: Séquentiel ou concurrent
columns:
  - title: Séquentiel
    tone: rose
    items:
      - "Appel 1 : 2 s, puis appel 2 : 2 s, puis appel 3 : 2 s"
      - Durée totale proche de 6 s
  - title: Concurrent (asyncio)
    tone: teal
    items:
      - Les trois appels attendent le réseau en même temps
      - Durée totale proche de 2 s
```

```python
import asyncio
import httpx


async def recuperer(client: httpx.AsyncClient, url: str) -> int:
    reponse = await client.get(url)
    return reponse.status_code


async def main() -> None:
    urls = ["https://example.com", "https://example.org", "https://example.net"]
    async with httpx.AsyncClient(timeout=10) as client:
        # gather lance les coroutines de façon concurrente
        codes = await asyncio.gather(*(recuperer(client, u) for u in urls))
    print(codes)


asyncio.run(main())
```

## Limiter la concurrence

Lancer 1 000 requêtes simultanées vers une API de modèle provoquera des erreurs **429** (*Too Many Requests*) : les fournisseurs imposent des limites de débit. On utilise un **sémaphore** pour plafonner le nombre de requêtes en vol :

```python
import asyncio

semaphore = asyncio.Semaphore(5)  # au plus 5 requêtes simultanées


async def traiter(document: str) -> str:
    async with semaphore:
        return await appeler_modele(document)  # fonction asynchrone à définir
```

> [!NOTE]
> Les SDK officiels d'Anthropic et d'OpenAI proposent tous deux un client synchrone et un client asynchrone (`AsyncAnthropic`, `AsyncOpenAI`). Utilisez la version asynchrone dans un serveur web asynchrone comme FastAPI ou pour des traitements par lots.

# Manipuler des données : NumPy et pandas

Deux bibliothèques reviennent constamment : **NumPy** pour les calculs sur des vecteurs (les embeddings en sont), **pandas** pour les tableaux de données (jeux d'évaluation, résultats d'expériences, journaux).

## NumPy : calculer sur des tableaux entiers

Un tableau NumPy (`ndarray`) contient des nombres d'un même type, et les opérations s'appliquent à **tout le tableau à la fois** (vectorisation), bien plus vite qu'une boucle Python.

```python
import numpy as np

v = np.array([0.6, 0.8])
print(np.linalg.norm(v))          # 1.0 - longueur du vecteur

# 1 000 embeddings de dimension 384, et un vecteur de requête
base = np.random.rand(1000, 384)
requete = np.random.rand(384)

base = base / np.linalg.norm(base, axis=1, keepdims=True)   # normaliser chaque ligne
requete = requete / np.linalg.norm(requete)

scores = base @ requete            # 1 000 similarités cosinus en une opération
meilleurs = np.argsort(-scores)[:5]  # indices des 5 plus proches
print(base.shape, scores.shape)    # (1000, 384) (1000,)
```

Retenez trois réflexes : vérifier la **forme** (`.shape`) des tableaux, utiliser `axis` pour choisir la dimension d'une opération, et préférer les opérations vectorisées aux boucles.

## pandas : analyser des résultats

```python
import pandas as pd

# Résultats d'une évaluation : une ligne par cas
df = pd.read_json("resultats.jsonl", lines=True)
print(df.head())                   # aperçu des premières lignes

print(df["correct"].mean())        # exactitude globale
print(df.groupby("categorie")["correct"].agg(["mean", "count"]))  # par catégorie
echecs = df[~df["correct"]]        # filtrer les cas en échec
echecs.to_csv("echecs.csv", index=False)
```

Le `groupby` par type de cas est l'outil de base de l'**analyse d'erreurs** (module 8) : une moyenne globale cache souvent une catégorie qui s'effondre.

# Exercices

## Exercice 1 : Un modèle Pydantic

Écrivez un modèle Pydantic `AnalyseSentiment` avec :

- `sentiment` : une valeur parmi `"positif"`, `"negatif"`, `"neutre"` ;
- `confiance` : un nombre entre 0 et 1 ;
- `mots_cles` : une liste de chaînes, au plus 5 éléments.

Puis validez la chaîne JSON `{"sentiment": "positif", "confiance": 0.92, "mots_cles": ["rapide", "efficace"]}`.

<details>
<summary>Voir la solution</summary>

```python
from typing import Literal
from pydantic import BaseModel, Field


class AnalyseSentiment(BaseModel):
    sentiment: Literal["positif", "negatif", "neutre"]
    confiance: float = Field(ge=0, le=1)
    mots_cles: list[str] = Field(default_factory=list, max_length=5)


texte = '{"sentiment": "positif", "confiance": 0.92, "mots_cles": ["rapide", "efficace"]}'
analyse = AnalyseSentiment.model_validate_json(texte)
print(analyse.sentiment, analyse.confiance)
```

Essayez ensuite avec `"confiance": 1.5` ou `"sentiment": "joyeux"` pour observer les erreurs de validation.

</details>

## Exercice 2 : Paralléliser avec un plafond

Écrivez une fonction asynchrone `traiter_tous(textes: list[str]) -> list[int]` qui, pour chaque texte, appelle une fonction simulée `async def compter(texte)` (qui attend 1 seconde avec `asyncio.sleep(1)` puis renvoie `len(texte)`), avec **au plus 3 appels simultanés**. Mesurez la durée pour 9 textes.

<details>
<summary>Voir la solution</summary>

```python
import asyncio
import time

semaphore = asyncio.Semaphore(3)


async def compter(texte: str) -> int:
    async with semaphore:
        await asyncio.sleep(1)
        return len(texte)


async def traiter_tous(textes: list[str]) -> list[int]:
    return await asyncio.gather(*(compter(t) for t in textes))


debut = time.perf_counter()
resultats = asyncio.run(traiter_tous([f"texte {i}" for i in range(9)]))
print(resultats, f"{time.perf_counter() - debut:.1f} s")  # environ 3 s
```

9 tâches, 3 à la fois, 1 seconde chacune : environ 3 secondes au lieu de 9. `asyncio.gather` conserve l'ordre des résultats.

</details>

## Exercice 3 : Mettre en place un projet

Créez un projet `assistant-ia` avec `uv` (ou `venv` + `pip`), ajoutez les dépendances `anthropic`, `pydantic` et `httpx`, puis vérifiez que `python -c "import anthropic, pydantic, httpx"` s'exécute sans erreur dans l'environnement du projet. Notez quels fichiers ont été créés et à quoi ils servent.

<details>
<summary>Voir la solution</summary>

```bash
uv init assistant-ia
cd assistant-ia
uv add anthropic pydantic httpx
uv run python -c "import anthropic, pydantic, httpx; print('ok')"
```

Fichiers principaux : `pyproject.toml` (déclaration du projet et des dépendances), `uv.lock` (versions exactes verrouillées), `.venv/` (environnement virtuel, à ne pas versionner), `.python-version` (version de Python du projet).

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Python moderne pour l'IA
center: Un environnement propre, des types clairs et des données validées avant de toucher aux modèles.
points:
  - icon: terminal
    title: Un projet = un environnement
    text: venv ou uv, dépendances déclarées dans pyproject.toml et versions verrouillées.
  - icon: code
    title: Les annotations de type
    text: Elles documentent et aident l'éditeur, mais ne vérifient rien à l'exécution.
  - icon: shield
    title: Pydantic comme garde-fou
    text: Valider et convertir les données non fiables, dont les sorties de modèles.
  - icon: file
    title: Du modèle au schéma JSON
    text: model_json_schema() fait le pont avec les outils et les sorties structurées.
  - icon: zap
    title: async pour le réseau
    text: asyncio.gather lance les appels en parallèle ; un sémaphore plafonne la concurrence.
pitfall: Lancer des centaines d'appels simultanés vers une API de modèle et déclencher des erreurs 429.
remember: Toute donnée venant de l'extérieur (y compris d'un modèle) passe par une validation typée.
```
