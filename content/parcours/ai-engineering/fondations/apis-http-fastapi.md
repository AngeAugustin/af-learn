---
title: APIs, HTTP et FastAPI
description: "Comprendre HTTP et les API REST, puis construire et documenter une API Python avec FastAPI : la base de tout service d'IA."
duration: 60
objectives:
  - Décrire une requête et une réponse HTTP (méthode, URL, en-têtes, corps, code de statut)
  - Concevoir des routes REST cohérentes
  - Construire une API typée et validée avec FastAPI
  - Gérer correctement les secrets et la configuration
---

# HTTP en bref

Presque tout ce qu'un AI Engineer construit communique en **HTTP** : votre application appelle l'API d'un fournisseur de modèles, votre interface web appelle votre propre API, vos outils interrogent des services internes. Il faut donc maîtriser ce protocole.

```diagram
type: sequence
title: Une requête HTTP vers une API de modèle
actors: [Votre application, API du fournisseur]
messages:
  - from: 0
    to: 1
    text: "POST /v1/messages, en-têtes (clé d'API, type de contenu) + corps JSON"
  - from: 1
    to: 1
    text: Authentification, validation, génération de la réponse
  - from: 1
    to: 0
    text: "200 OK : corps JSON (texte généré, consommation de tokens)"
```

## Anatomie d'une requête

Une requête HTTP comporte :

- une **méthode** : `GET` (lire), `POST` (créer ou déclencher une action), `PUT`/`PATCH` (modifier), `DELETE` (supprimer) ;
- une **URL** : par exemple `https://api.exemple.com/v1/tickets/42?format=court` ;
- des **en-têtes** (*headers*) : métadonnées comme `Content-Type: application/json` ou l'authentification ;
- un **corps** (*body*), optionnel, souvent en **JSON** pour les API modernes.

La réponse comporte un **code de statut**, des en-têtes et un corps.

| Code | Signification | Exemple de cas |
|---|---|---|
| 200 | Succès | Réponse générée |
| 201 | Ressource créée | Un ticket a été enregistré |
| 400 | Requête invalide | JSON mal formé, paramètre manquant |
| 401 | Non authentifié | Clé d'API absente ou invalide |
| 403 | Interdit | La clé n'a pas les droits nécessaires |
| 404 | Introuvable | Ressource ou modèle inexistant |
| 422 | Données non valides | Validation échouée (code utilisé par FastAPI) |
| 429 | Trop de requêtes | Limite de débit dépassée |
| 500 / 503 | Erreur serveur | Panne ou surcharge temporaire |

> [!TIP]
> Distinguez les erreurs **à réessayer** (429, 5xx, problèmes réseau) des erreurs **à corriger** (400, 401, 403, 404, 422). Réessayer une requête invalide ne sert à rien ; réessayer après une surcharge temporaire, avec un délai croissant, est la bonne pratique.

## Tester une API en ligne de commande

```bash
curl -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"question": "Bonjour"}'
```

`httpbin.org` renvoie la requête qu'il a reçue : pratique pour comprendre ce qui est réellement envoyé.

# Concevoir une API REST

**REST** est un style d'architecture : on expose des **ressources** (tickets, documents, conversations) identifiées par des URL, et on agit dessus avec les méthodes HTTP.

| Action | Méthode et route |
|---|---|
| Lister les conversations | `GET /conversations` |
| Créer une conversation | `POST /conversations` |
| Lire une conversation | `GET /conversations/{id}` |
| Ajouter un message | `POST /conversations/{id}/messages` |
| Supprimer une conversation | `DELETE /conversations/{id}` |

Bonnes pratiques :

- des **noms** au pluriel pour les ressources, pas des verbes (`/conversations` plutôt que `/getConversations`) ;
- des **codes de statut** cohérents ;
- des **erreurs structurées** (par exemple `{"detail": "Conversation introuvable"}`) ;
- un **préfixe de version** (`/v1/...`) si l'API est consommée par des tiers.

# Construire une API avec FastAPI

[FastAPI](https://fastapi.tiangolo.com/) est un framework web Python moderne, construit sur les annotations de type et Pydantic. Il valide automatiquement les entrées, sérialise les sorties et génère une **documentation interactive** (OpenAPI). Il prend en charge nativement le code asynchrone, ce qui en fait un choix très courant pour les services d'IA.

```bash
pip install "fastapi[standard]"
```

```python
# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="Service de résumé")


class DemandeResume(BaseModel):
    texte: str = Field(min_length=20, max_length=20_000)
    longueur_max: int = Field(default=100, ge=20, le=500)


class Resume(BaseModel):
    resume: str
    nb_mots_source: int


@app.get("/sante")
def sante() -> dict[str, str]:
    return {"statut": "ok"}


@app.post("/resumes", response_model=Resume, status_code=201)
async def creer_resume(demande: DemandeResume) -> Resume:
    mots = demande.texte.split()
    if len(mots) < 5:
        raise HTTPException(status_code=400, detail="Texte trop court")
    # Pour l'instant, un « résumé » naïf : les premiers mots.
    # Au module 4, on remplacera cette ligne par un appel à un LLM.
    resume = " ".join(mots[: demande.longueur_max // 5])
    return Resume(resume=resume, nb_mots_source=len(mots))
```

```bash
fastapi dev main.py
```

Ouvrez ensuite `http://127.0.0.1:8000/docs` : FastAPI génère une page où l'on peut tester chaque route. Si vous envoyez un texte de 5 caractères, FastAPI répond automatiquement **422** avec le détail de la contrainte non respectée, sans que vous ayez écrit une ligne de validation.

```diagram
type: flow
title: Le parcours d'une requête dans FastAPI
steps:
  - title: Requête HTTP
    text: JSON envoyé par le client
  - title: Validation
    text: Pydantic vérifie le corps, sinon 422
  - title: Votre fonction
    text: Logique métier, appel au modèle
  - title: Sérialisation
    text: response_model filtre et convertit
  - title: Réponse HTTP
    text: Code de statut + JSON
```

# Configuration et secrets

Une application d'IA manipule des **secrets** : clés d'API des fournisseurs, mots de passe de base de données. Règles non négociables :

1. **Jamais de secret dans le code source** ni dans Git.
2. Les secrets sont lus depuis des **variables d'environnement** (ou un gestionnaire de secrets en production).
3. En local, on utilise un fichier `.env` **ignoré par Git** (listé dans `.gitignore`), et on versionne un `.env.example` sans valeurs réelles.

```bash
# .env (jamais versionné)
ANTHROPIC_API_KEY=...
DATABASE_URL=postgresql://user:motdepasse@localhost:5432/app
```

```python
# config.py - avec pydantic-settings (pip install pydantic-settings)
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    anthropic_api_key: str
    database_url: str
    modele_par_defaut: str = "claude-sonnet-5-5"


settings = Settings()  # lève une erreur claire si une variable manque
```

> [!WARNING]
> Une clé d'API publiée par erreur sur un dépôt public peut être détectée et exploitée très rapidement par des robots qui scannent ces dépôts. Si cela arrive : **révoquez immédiatement la clé** dans la console du fournisseur et créez-en une nouvelle. Supprimer le commit ne suffit pas, car l'historique a pu être copié.

> [!NOTE]
> Le SDK Python d'Anthropic lit automatiquement la variable `ANTHROPIC_API_KEY` ; celui d'OpenAI lit `OPENAI_API_KEY`. Il n'est donc pas nécessaire de passer la clé explicitement au client.

# Exercices

## Exercice 1 : Lire des codes de statut

Pour chaque situation, donnez le code HTTP le plus approprié et indiquez si un nouvel essai automatique a du sens :

1. Le client envoie un JSON auquel il manque un champ obligatoire.
2. Le fournisseur de modèles est momentanément surchargé.
3. La clé d'API a été révoquée.
4. Vous avez dépassé le nombre de requêtes autorisées par minute.

<details>
<summary>Voir la solution</summary>

1. **400** (ou **422** dans FastAPI), ne pas réessayer : il faut corriger la requête.
2. **503** (ou un autre 5xx ; certains fournisseurs utilisent un code spécifique pour la surcharge, par exemple 529 chez Anthropic) : réessayer avec un délai croissant.
3. **401**, ne pas réessayer : il faut une clé valide.
4. **429** : réessayer après le délai indiqué (en-tête `retry-after` s'il est présent) ou avec un délai exponentiel.

</details>

## Exercice 2 : Une API de notes

Avec FastAPI, créez une API en mémoire (une simple liste Python) pour gérer des notes :

- `POST /notes` : crée une note (`titre` de 1 à 100 caractères, `contenu` non vide), renvoie 201 et la note avec un `id` ;
- `GET /notes` : liste les notes ;
- `GET /notes/{id}` : renvoie la note ou 404.

<details>
<summary>Voir la solution</summary>

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI()


class NoteEntree(BaseModel):
    titre: str = Field(min_length=1, max_length=100)
    contenu: str = Field(min_length=1)


class Note(NoteEntree):
    id: int


notes: list[Note] = []


@app.post("/notes", response_model=Note, status_code=201)
def creer_note(entree: NoteEntree) -> Note:
    note = Note(id=len(notes) + 1, **entree.model_dump())
    notes.append(note)
    return note


@app.get("/notes", response_model=list[Note])
def lister_notes() -> list[Note]:
    return notes


@app.get("/notes/{note_id}", response_model=Note)
def lire_note(note_id: int) -> Note:
    for note in notes:
        if note.id == note_id:
            return note
    raise HTTPException(status_code=404, detail="Note introuvable")
```

Testez dans `http://127.0.0.1:8000/docs`, en particulier un titre vide (422) et un identifiant inexistant (404).

</details>

## Exercice 3 : Audit de sécurité

Un collègue vous montre ce code. Listez les problèmes et proposez une correction.

```python
import anthropic
client = anthropic.Anthropic(api_key="sk-ant-api03-AbC...")  # clé de prod
```

<details>
<summary>Voir la solution</summary>

- La clé est **écrite en dur** dans le code : elle finira dans Git, dans les journaux, chez toute personne ayant accès au dépôt.
- C'est une clé de **production** utilisée dans du code de développement.

Correction : retirer la clé, la **révoquer** si le code a déjà été partagé ou versionné, la placer dans une variable d'environnement (`.env` ignoré par Git en local, gestionnaire de secrets en production), et laisser le SDK la lire automatiquement :

```python
import anthropic
client = anthropic.Anthropic()  # lit ANTHROPIC_API_KEY dans l'environnement
```

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: APIs, HTTP et FastAPI
center: "Tout service d'IA parle HTTP : il faut maîtriser requêtes, codes de statut et secrets."
points:
  - icon: network
    title: Anatomie d'une requête
    text: Méthode, URL, en-têtes, corps JSON ; la réponse porte un code de statut.
  - icon: loop
    title: Réessayer ou corriger ?
    text: On réessaie 429 et 5xx avec un délai croissant ; on corrige 400, 401, 403, 404, 422.
  - icon: list
    title: Des routes REST cohérentes
    text: Des ressources au pluriel, des méthodes HTTP, des erreurs structurées.
  - icon: rocket
    title: FastAPI
    text: Validation automatique (422), réponses typées et documentation interactive sur /docs.
  - icon: key
    title: Les secrets hors du code
    text: Variables d'environnement, .env ignoré par Git, et révocation immédiate en cas de fuite.
pitfall: Écrire une clé d'API en dur dans le code ou la pousser sur un dépôt public.
remember: Une bonne API d'IA valide ses entrées, renvoie des codes clairs et ne laisse jamais fuiter un secret.
```
