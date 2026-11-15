---
title: Déployer une application d'IA
description: Exposer un service d'IA par une API en streaming, le conteneuriser, gérer les traitements longs et les limites de débit.
duration: 60
objectives:
  - Exposer une réponse de LLM en streaming à travers sa propre API
  - Conteneuriser un service Python avec Docker
  - Choisir entre traitement synchrone et file de tâches
  - Gérer les limites de débit, les délais et les quotas par utilisateur
---

# L'architecture de référence

Une application d'IA en production ressemble à n'importe quelle application web, avec quelques composants spécifiques.

```diagram
type: layers
title: Architecture type d'un service d'IA
layers:
  - title: Client
    text: Application web ou mobile, affichage en streaming
  - title: API de l'application
    text: Authentification, quotas par utilisateur, validation des entrées, streaming
    items: [FastAPI, Next.js, Node.js]
  - title: Services
    text: Orchestration des prompts, RAG, outils, garde-fous
  - title: Traitements asynchrones
    text: File de tâches pour les traitements longs ou par lots
    items: [Redis, files de messages, workers]
  - title: Données et modèles
    text: Base de données, base vectorielle, cache, API des fournisseurs de modèles
```

**Règle fondamentale** : la clé d'API du fournisseur de modèles reste **côté serveur**. Le client (navigateur, application mobile) appelle **votre** API, jamais directement celle du fournisseur : sinon, n'importe qui pourrait extraire la clé et l'utiliser à vos frais.

# Le streaming de bout en bout

Pour que l'utilisateur voie la réponse s'afficher progressivement, le flux doit traverser toute la chaîne : fournisseur → votre API → navigateur. Le format le plus courant est **Server-Sent Events** (SSE) : une connexion HTTP qui reste ouverte, sur laquelle le serveur envoie des événements `data: ...` successifs.

```python
# api.py - pip install "fastapi[standard]" anthropic
import json
import anthropic
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

app = FastAPI()
client = anthropic.AsyncAnthropic()


class Demande(BaseModel):
    question: str = Field(min_length=1, max_length=4000)


async def flux_reponse(question: str):
    try:
        async with client.messages.stream(
            model="claude-opus-5-5",
            max_tokens=2048,
            messages=[{"role": "user", "content": question}],
        ) as flux:
            async for texte in flux.text_stream:
                yield f"data: {json.dumps({'texte': texte}, ensure_ascii=False)}\n\n"
        yield "data: [FIN]\n\n"
    except anthropic.APIError:
        yield f"data: {json.dumps({'erreur': 'Service momentanément indisponible'})}\n\n"


@app.post("/chat")
async def chat(demande: Demande) -> StreamingResponse:
    return StreamingResponse(flux_reponse(demande.question), media_type="text/event-stream")
```

Côté navigateur, on lit le flux avec `fetch` et un lecteur de flux :

```javascript
const reponse = await fetch("/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ question }),
});
const lecteur = reponse.body.getReader();
const decodeur = new TextDecoder();
let tampon = "";
while (true) {
  const { done, value } = await lecteur.read();
  if (done) break;
  tampon += decodeur.decode(value, { stream: true });
  const evenements = tampon.split("\n\n");
  tampon = evenements.pop(); // dernier morceau éventuellement incomplet
  for (const ev of evenements) {
    const donnees = ev.replace(/^data: /, "");
    if (donnees === "[FIN]") return; // ce code s'exécute dans une fonction async
    const message = JSON.parse(donnees);
    if (message.erreur) return afficherErreur(message.erreur);
    afficher(message.texte);
  }
}
```

> [!NOTE]
> Les proxys et répartiteurs de charge peuvent **mettre en mémoire tampon** les réponses et casser le streaming, ou couper les connexions trop longues. Vérifiez leur configuration (désactivation du buffering pour ces routes, délais suffisants).

# Conteneuriser avec Docker

**Docker** empaquette l'application et toutes ses dépendances dans une **image** qui s'exécute de façon identique partout : poste de développement, serveur, cloud.

```dockerfile
# Dockerfile
FROM python:3.12-slim

WORKDIR /app

# Installer d'abord les dépendances (mieux mis en cache)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Ne pas exécuter en root
RUN useradd --create-home appuser
USER appuser

EXPOSE 8000
CMD ["fastapi", "run", "api.py", "--port", "8000"]
```

```bash
docker build -t assistant-api .
docker run -p 8000:8000 --env-file .env assistant-api
```

Les secrets sont fournis **à l'exécution** (`--env-file`, variables d'environnement de la plateforme, gestionnaire de secrets), jamais copiés dans l'image. Ajoutez un fichier `.dockerignore` pour exclure `.env`, `.venv/`, `.git/`.

# Traitements longs : synchrone ou asynchrone ?

Toutes les tâches ne se prêtent pas à une requête HTTP qui attend la réponse :

| Situation | Approche |
|---|---|
| Conversation, réponse attendue en quelques secondes | Requête synchrone avec streaming |
| Analyse d'un document de 200 pages, agent qui travaille plusieurs minutes | **File de tâches** : l'API crée une tâche et renvoie son identifiant ; un *worker* la traite ; le client consulte l'état ou est notifié |
| Traitement de milliers de documents sans urgence | **Traitement par lots** (*batch*) du fournisseur, souvent nettement moins cher, avec un délai de traitement plus long |

```diagram
type: sequence
title: Une tâche longue avec file de tâches
actors: [Client, API, File, Worker]
messages:
  - from: 0
    to: 1
    text: "POST /analyses (document)"
  - from: 1
    to: 2
    text: Ajoute la tâche
  - from: 1
    to: 0
    text: "202 Accepted : {id: 42, statut: « en attente »}"
  - from: 3
    to: 2
    text: Récupère la tâche et appelle le modèle
  - from: 0
    to: 1
    text: "GET /analyses/42"
  - from: 1
    to: 0
    text: "{statut: « terminé », resultat: …}"
```

# Limites de débit et quotas

## Les limites du fournisseur

Les fournisseurs limitent le nombre de **requêtes** et de **tokens** par minute, selon votre niveau de compte. Pour les respecter :

- laissez le SDK **réessayer** les erreurs 429 avec délai exponentiel, et respectez l'en-tête `retry-after` ;
- **plafonnez la concurrence** (sémaphore, nombre de workers) ;
- **lissez** les traitements de masse (files de tâches, traitement par lots) ;
- demandez une **augmentation** des limites au fournisseur avant un lancement important.

## Vos propres quotas

Protégez votre budget et votre service contre les abus avec des **quotas par utilisateur** : nombre de requêtes par minute, tokens par jour, taille maximale des entrées. Sans cela, un seul utilisateur (ou un script malveillant) peut consommer tout votre budget : c'est ce que l'OWASP appelle la **consommation non bornée** (module 9).

```python
import time
from collections import defaultdict, deque

FENETRE_S, MAX_REQUETES = 60, 20
historique: dict[str, deque] = defaultdict(deque)


def autoriser(user_id: str) -> bool:
    """Limiteur à fenêtre glissante, en mémoire (un seul processus)."""
    maintenant = time.monotonic()
    file = historique[user_id]
    while file and maintenant - file[0] > FENETRE_S:
        file.popleft()
    if len(file) >= MAX_REQUETES:
        return False
    file.append(maintenant)
    return True
```

En production, avec plusieurs instances de l'API, ce compteur doit être **partagé** (par exemple dans Redis) plutôt qu'en mémoire.

# Passerelle d'IA, repli et déploiement progressif

## La passerelle d'IA

Quand plusieurs applications d'une entreprise appellent des LLM, on place souvent entre elles et les fournisseurs une **passerelle d'IA** (*AI gateway*) : un proxy qui centralise les clés d'API, les quotas par équipe, le suivi des coûts, la journalisation, la mise en cache et le **routage** vers différents fournisseurs. Des solutions existent en open source (par exemple le proxy LiteLLM) et chez les fournisseurs de cloud. Pour une seule application, l'abstraction vue au module 4 suffit souvent.

## Le repli en cas de panne

Les fournisseurs ont des incidents. Une stratégie de **repli** (*fallback*) prévoit :

1. des **nouvelles tentatives** avec délai exponentiel pour les erreurs transitoires (429, 500, 529) ;
2. après un nombre d'échecs, un **coupe-circuit** (*circuit breaker*) qui cesse d'appeler le fournisseur défaillant pendant un moment, au lieu d'accumuler des requêtes en attente ;
3. un **modèle de repli** (autre modèle, autre région ou autre fournisseur), **évalué au préalable** sur votre jeu d'évaluation avec le même prompt ou un prompt adapté ;
4. en dernier recours, une **dégradation gracieuse** : réponse sans IA, mise en file d'attente, message clair à l'utilisateur.

> [!WARNING]
> Un modèle de repli jamais évalué est un risque déguisé : il peut répondre dans un format différent, ignorer certaines consignes ou ne pas supporter vos outils. Faites-le passer régulièrement dans votre CI d'évaluation, comme le modèle principal.

## Déployer progressivement

Un changement de prompt ou de modèle est un **déploiement** à part entière : il peut améliorer la moyenne et casser un cas important. Les pratiques du génie logiciel s'appliquent :

- **versionner** prompts et configurations (modèle, température, outils) et les lier à chaque trace ;
- **mode fantôme** (*shadow*) : la nouvelle version traite le trafic réel en parallèle, sans que ses réponses soient montrées, et l'on compare ;
- **déploiement canari** : 5 % du trafic, puis 25 %, puis 100 %, en surveillant les métriques de qualité, de coût et de latence ;
- **retour arrière** immédiat par simple changement de configuration (*feature flag*), sans redéploiement du code.

# Exercices

## Exercice 1 : Architecture

Une équipe propose d'appeler l'API du fournisseur de modèles directement depuis l'application mobile « pour gagner du temps ». Expliquez le problème et l'architecture à adopter.

<details>
<summary>Voir la solution</summary>

La clé d'API serait embarquée dans l'application : elle peut être extraite (décompilation, interception du trafic) et utilisée par n'importe qui, à vos frais, sans possibilité de quotas par utilisateur ni de contrôle des contenus. L'architecture correcte : l'application appelle **votre API**, qui authentifie l'utilisateur, applique les quotas et les garde-fous, puis appelle le fournisseur avec la clé stockée côté serveur.

</details>

## Exercice 2 : Choisir le mode de traitement

Pour chaque cas, choisissez entre requête synchrone avec streaming, file de tâches, ou traitement par lots du fournisseur :

1. Un chatbot d'assistance.
2. Le résumé de 50 000 avis clients pour un rapport mensuel.
3. Un agent qui audite un dépôt de code et produit un rapport en 5 à 10 minutes.

<details>
<summary>Voir la solution</summary>

1. **Synchrone avec streaming** : interaction en temps réel.
2. **Traitement par lots** : grand volume, aucune urgence, coût réduit.
3. **File de tâches** : trop long pour une requête HTTP ; on renvoie un identifiant de tâche et on notifie à la fin.

</details>

## Exercice 3 : Tester le streaming

Lancez l'API FastAPI du cours, puis appelez-la avec `curl -N -X POST http://127.0.0.1:8000/chat -H "Content-Type: application/json" -d '{"question": "Explique le streaming en 5 phrases"}'`. Que fait l'option `-N` ? Que se passe-t-il si vous envoyez une question vide ?

<details>
<summary>Voir la solution</summary>

L'option `-N` désactive la mise en mémoire tampon de curl : les événements s'affichent dès leur réception, ce qui permet de voir le streaming en action. Une question vide est rejetée par la validation Pydantic (`min_length=1`) : FastAPI renvoie **422** avant tout appel au modèle, donc sans coût.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Déployer une application d'IA
center: La clé reste côté serveur ; le flux traverse votre API jusqu'au navigateur.
points:
  - icon: server
    title: Architecture de référence
    text: Client, API (authentification, quotas), services, file de tâches, données et modèles.
  - icon: zap
    title: Streaming de bout en bout
    text: Server-Sent Events relayés par FastAPI ; attention aux proxys qui mettent en tampon.
  - icon: cloud
    title: Docker
    text: Image reproductible, utilisateur non root, secrets fournis à l'exécution.
  - icon: clock
    title: Synchrone, file ou lots
    text: Chat en streaming, tâches longues en file, gros volumes en traitement par lots.
  - icon: gauge
    title: Limites et quotas
    text: Respecter les limites du fournisseur et imposer des quotas par utilisateur.
pitfall: Appeler l'API du fournisseur directement depuis le navigateur ou l'application mobile.
remember: "Votre API est le seul point d'accès au modèle : elle authentifie, limite, valide et trace."
```
