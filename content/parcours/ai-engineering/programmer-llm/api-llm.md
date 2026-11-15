---
title: Appeler une API de LLM
description: Structure d'une requête, rôles des messages, conversations multi-tours, streaming, gestion des erreurs et suivi de la consommation.
duration: 60
objectives:
  - Envoyer une requête à une API de LLM avec le SDK officiel
  - Structurer instructions système et messages d'une conversation
  - Diffuser une réponse en streaming
  - Gérer les erreurs, les nouvelles tentatives et la raison d'arrêt
  - Mesurer la consommation de tokens
---

# Anatomie d'une requête

Les API de LLM conversationnels partagent une structure commune. Nous utilisons ici l'**API Messages d'Anthropic** avec le SDK Python officiel ; les concepts se transposent directement aux autres fournisseurs.

```bash
pip install anthropic
# La clé est lue automatiquement dans la variable d'environnement ANTHROPIC_API_KEY
```

```python
import anthropic

client = anthropic.Anthropic()

reponse = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=1024,
    system="Tu es un assistant concis qui répond en français.",
    messages=[
        {"role": "user", "content": "Explique ce qu'est une API REST en deux phrases."}
    ],
)

# La réponse contient une liste de blocs de contenu : on garde les blocs de texte
for bloc in reponse.content:
    if bloc.type == "text":
        print(bloc.text)

print(reponse.stop_reason)  # par exemple "end_turn"
print(reponse.usage.input_tokens, reponse.usage.output_tokens)
```

Les éléments d'une requête :

| Paramètre | Rôle |
|---|---|
| `model` | Identifiant exact du modèle |
| `max_tokens` | Longueur maximale de la réponse, en tokens |
| `system` | Instructions système : rôle, règles, contexte permanent |
| `messages` | La conversation : alternance de messages `user` et `assistant` |

La réponse contient une **liste de blocs** (`content`) : du texte, mais aussi, selon les fonctionnalités utilisées, des blocs de réflexion ou des demandes d'appel d'outil. C'est pourquoi on filtre sur `bloc.type == "text"` au lieu de supposer que le premier bloc est du texte.

> [!NOTE]
> Les modèles de raisonnement récents réfléchissent avant de répondre. Chez Anthropic, sur les modèles récents, la profondeur de réflexion se règle avec le niveau d'effort, par exemple `output_config={"effort": "low"}` pour une tâche simple et rapide, ou `"high"` pour une tâche difficile. Les valeurs par défaut et les options acceptées dépendent du modèle : consultez la documentation.

## Équivalent chez OpenAI

```python
import os
from openai import OpenAI

client = OpenAI()  # lit OPENAI_API_KEY
reponse = client.responses.create(
    model=os.environ["OPENAI_MODEL"],  # identifiant du modèle choisi
    instructions="Tu es un assistant concis qui répond en français.",
    input="Explique ce qu'est une API REST en deux phrases.",
)
print(reponse.output_text)
```

Les noms des paramètres diffèrent, mais les concepts sont identiques : un modèle, des instructions, des messages, une limite de longueur, une réponse et une consommation de tokens.

# Rôles et conversations

## Instructions système et messages

- Les **instructions système** fixent le cadre durable : rôle, ton, règles, format attendu, informations de contexte. Elles s'appliquent à toute la conversation.
- Les messages **`user`** contiennent les demandes de l'utilisateur (et, plus tard, les résultats d'outils).
- Les messages **`assistant`** contiennent les réponses précédentes du modèle.

```diagram
type: sequence
title: Une conversation multi-tours
actors: [Application, API du modèle]
messages:
  - from: 0
    to: 1
    text: "system + [user : « Bonjour, je cherche un livre de SF »]"
  - from: 1
    to: 0
    text: "assistant : « Avec plaisir ! Plutôt classique ou récent ? »"
  - from: 0
    to: 1
    text: "system + [user, assistant, user : « Plutôt classique »], tout l'historique est renvoyé"
  - from: 1
    to: 0
    text: "assistant : « Je vous recommande Fondation d'Isaac Asimov… »"
```

## L'API est sans état

Le modèle ne se souvient de rien entre deux requêtes : **c'est l'application qui conserve l'historique** et le renvoie à chaque appel.

```python
historique: list[dict] = []


def discuter(message_utilisateur: str) -> str:
    historique.append({"role": "user", "content": message_utilisateur})
    reponse = client.messages.create(
        model="claude-opus-5-5",
        max_tokens=1024,
        system="Tu es un libraire passionné et concis.",
        messages=historique,
    )
    # On conserve le contenu complet de la réponse dans l'historique
    historique.append({"role": "assistant", "content": reponse.content})
    return "".join(b.text for b in reponse.content if b.type == "text")


print(discuter("Bonjour, je cherche un livre de science-fiction."))
print(discuter("Plutôt un classique."))
```

Conséquences : chaque tour renvoie tout l'historique, donc **le coût et la latence augmentent** avec la longueur de la conversation. Pour les longues conversations, on résume ou on tronque l'historique, et on utilise la mise en cache des prompts (module 10).

> [!IMPORTANT]
> Renvoyez dans l'historique le **contenu complet** de la réponse de l'assistant (tous ses blocs), pas seulement le texte extrait : certaines fonctionnalités (outils, réflexion) ont besoin des blocs d'origine pour continuer la conversation correctement.

# Le streaming

Sans streaming, l'utilisateur attend la fin de la génération pour voir quoi que ce soit. Avec le **streaming**, les tokens sont envoyés au fur et à mesure (via des *Server-Sent Events*), ce qui améliore fortement la latence perçue. C'est aussi recommandé pour les réponses longues, afin d'éviter les délais d'expiration des requêtes HTTP.

```python
with client.messages.stream(
    model="claude-opus-5-5",
    max_tokens=2048,
    messages=[{"role": "user", "content": "Raconte l'histoire du Transformer en 10 lignes."}],
) as flux:
    for morceau in flux.text_stream:
        print(morceau, end="", flush=True)
    message_final = flux.get_final_message()

print("\nTokens de sortie :", message_final.usage.output_tokens)
```

Le module 10 montre comment relayer ce flux jusqu'au navigateur à travers votre propre API FastAPI.

# Erreurs, nouvelles tentatives et raison d'arrêt

## Les erreurs

Le SDK lève des exceptions typées. Distinguez celles qu'il faut **corriger** de celles qu'on peut **réessayer** :

```python
import anthropic

try:
    reponse = client.messages.create(
        model="claude-opus-5-5",
        max_tokens=1024,
        messages=[{"role": "user", "content": "Bonjour"}],
    )
except anthropic.BadRequestError as e:          # 400 : requête invalide, à corriger
    print("Requête invalide :", e.message)
except anthropic.AuthenticationError:           # 401 : clé invalide
    print("Clé d'API invalide")
except anthropic.RateLimitError:                # 429 : trop de requêtes
    print("Limite de débit atteinte, réessayer plus tard")
except anthropic.APIStatusError as e:           # autres erreurs HTTP (dont 5xx)
    print("Erreur de l'API :", e.status_code)
except anthropic.APIConnectionError:            # problème réseau
    print("Connexion impossible")
```

Les SDK officiels **réessaient automatiquement** certaines erreurs temporaires (connexion, 408, 409, 429, 5xx) avec un délai exponentiel ; par défaut deux nouvelles tentatives chez Anthropic. On peut ajuster ce comportement :

```python
client = anthropic.Anthropic(max_retries=4, timeout=60.0)
```

## La raison d'arrêt

Vérifiez toujours **pourquoi** la génération s'est arrêtée :

| `stop_reason` | Signification | Que faire |
|---|---|---|
| `end_turn` | Le modèle a terminé naturellement | Utiliser la réponse |
| `max_tokens` | Limite de longueur atteinte | Réponse tronquée : augmenter la limite ou demander plus court |
| `stop_sequence` | Une séquence d'arrêt personnalisée a été rencontrée | Traitement prévu par l'application |
| `tool_use` | Le modèle demande à appeler un outil | Exécuter l'outil (chapitre 4) |
| `refusal` | Le modèle a refusé pour des raisons de sécurité | Traiter le refus proprement côté interface |

```python
if reponse.stop_reason == "max_tokens":
    journal.warning("Réponse tronquée", extra={"tokens": reponse.usage.output_tokens})
```

# Suivre la consommation

Chaque réponse indique les **tokens consommés** (`usage`). Enregistrez-les systématiquement : c'est la base du suivi des coûts.

```python
PRIX_ENTREE = 4.00 / 1_000_000   # à mettre à jour depuis la page de tarifs officielle
PRIX_SORTIE = 20.00 / 1_000_000


def cout(usage) -> float:
    return usage.input_tokens * PRIX_ENTREE + usage.output_tokens * PRIX_SORTIE
```

Pour connaître le nombre de tokens **avant** d'envoyer une requête (par exemple pour vérifier qu'un document tient dans la fenêtre de contexte), Anthropic propose un point d'API dédié :

```python
compte = client.messages.count_tokens(
    model="claude-opus-5-5",
    messages=[{"role": "user", "content": texte_long}],
)
print(compte.input_tokens)
```

> [!TIP]
> Les tarifs, comme les identifiants de modèles, changent. Gardez-les dans la configuration et vérifiez-les sur la page officielle du fournisseur plutôt que de les coder en dur un peu partout.

# Ne pas dépendre d'un seul fournisseur

Les API de LLM se ressemblent, mais pas complètement : format des messages système, blocs de contenu, définition des outils, raisons d'arrêt, paramètres de réflexion. Si votre code métier appelle directement le SDK d'un fournisseur partout, changer de modèle ou ajouter un **repli** en cas de panne devient un chantier.

La parade classique est une **fine couche d'abstraction** propre à votre application :

```python
from dataclasses import dataclass
from typing import Protocol


@dataclass
class Reponse:
    texte: str
    tokens_entree: int
    tokens_sortie: int
    modele: str


class ClientLLM(Protocol):
    def generer(self, systeme: str, messages: list[dict], max_tokens: int) -> Reponse: ...


class ClientAnthropic:
    def __init__(self, modele: str):
        import anthropic
        self.client, self.modele = anthropic.Anthropic(), modele

    def generer(self, systeme, messages, max_tokens):
        r = self.client.messages.create(
            model=self.modele, system=systeme, messages=messages, max_tokens=max_tokens
        )
        texte = "".join(b.text for b in r.content if b.type == "text")
        return Reponse(texte, r.usage.input_tokens, r.usage.output_tokens, self.modele)
```

Le reste de l'application ne connaît que `ClientLLM`. Ajouter un autre fournisseur revient à écrire une classe de plus, et les tests utilisent un faux client.

Des bibliothèques (par exemple **LiteLLM**) et des **passerelles d'IA** (module 10) offrent cette uniformisation toutes faites, souvent via une interface compatible avec celle d'OpenAI.

> [!WARNING]
> Une abstraction trop générique vous prive des fonctionnalités propres à chaque fournisseur (mise en cache des prompts, réflexion, outils côté serveur…). Gardez l'interface **minimale**, laissez-la exposer des options spécifiques quand vous en avez besoin, et surtout : un changement de modèle se **valide sur votre jeu d'évaluation**, jamais à l'aveugle, car un même prompt ne donne pas les mêmes résultats d'un modèle à l'autre.

# Exercices

## Exercice 1 : Premier appel

Écrivez un script qui demande au modèle de traduire une phrase en anglais, affiche la traduction, la raison d'arrêt et le nombre de tokens d'entrée et de sortie. Lancez-le deux fois : la traduction est-elle identique ?

<details>
<summary>Voir la solution</summary>

```python
import anthropic

client = anthropic.Anthropic()
reponse = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=300,
    system="Tu es un traducteur. Réponds uniquement avec la traduction anglaise.",
    messages=[{"role": "user", "content": "Le chat dort paisiblement sur le canapé."}],
    output_config={"effort": "low"},  # tâche simple : effort de réflexion réduit
)
texte = "".join(b.text for b in reponse.content if b.type == "text")
print(texte)
print(reponse.stop_reason, reponse.usage.input_tokens, reponse.usage.output_tokens)
```

Les traductions peuvent différer légèrement d'une exécution à l'autre : la génération n'est pas déterministe. Si votre modèle n'accepte pas le paramètre d'effort, retirez-le.

</details>

## Exercice 2 : Un chatbot en ligne de commande

Construisez une boucle `while True` qui lit la saisie de l'utilisateur, conserve l'historique, affiche la réponse **en streaming**, et s'arrête quand l'utilisateur tape `quitter`. Affichez le nombre total de tokens consommés à la fin.

<details>
<summary>Voir la solution</summary>

```python
import anthropic

client = anthropic.Anthropic()
historique: list[dict] = []
total_entree = total_sortie = 0

while True:
    saisie = input("\nVous : ").strip()
    if saisie.lower() == "quitter":
        break
    historique.append({"role": "user", "content": saisie})
    print("Assistant : ", end="")
    with client.messages.stream(
        model="claude-opus-5-5",
        max_tokens=1024,
        system="Tu es un assistant sympathique et concis.",
        messages=historique,
    ) as flux:
        for morceau in flux.text_stream:
            print(morceau, end="", flush=True)
        final = flux.get_final_message()
    historique.append({"role": "assistant", "content": final.content})
    total_entree += final.usage.input_tokens
    total_sortie += final.usage.output_tokens

print(f"\nTokens : {total_entree} en entrée, {total_sortie} en sortie")
```

Observez que les tokens d'entrée augmentent à chaque tour : tout l'historique est renvoyé.

</details>

## Exercice 3 : Robustesse

Modifiez la fonction `discuter` du cours pour : (a) détecter une réponse tronquée et l'indiquer à l'utilisateur ; (b) ne pas conserver dans l'historique un message utilisateur dont l'appel a échoué.

<details>
<summary>Voir la solution</summary>

```python
def discuter(message_utilisateur: str) -> str:
    messages = historique + [{"role": "user", "content": message_utilisateur}]
    try:
        reponse = client.messages.create(
            model="claude-opus-5-5",
            max_tokens=1024,
            system="Tu es un libraire passionné et concis.",
            messages=messages,
        )
    except anthropic.APIError:
        return "Le service est momentanément indisponible, réessayez."  # historique inchangé

    historique.append({"role": "user", "content": message_utilisateur})
    historique.append({"role": "assistant", "content": reponse.content})
    texte = "".join(b.text for b in reponse.content if b.type == "text")
    if reponse.stop_reason == "max_tokens":
        texte += "\n[Réponse tronquée - demandez la suite ou une version plus courte.]"
    return texte
```

`anthropic.APIError` est la classe parente des erreurs du SDK (statut HTTP, connexion, délai dépassé).

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Appeler une API de LLM
center: Une requête = modèle + instructions + messages + limite ; la réponse = des blocs et des tokens.
points:
  - icon: chat
    title: Système et messages
    text: Le système fixe le cadre ; les messages alternent user et assistant.
  - icon: database
    title: API sans état
    text: L'application renvoie tout l'historique ; le coût croît avec la conversation.
  - icon: zap
    title: Le streaming
    text: Le texte s'affiche au fil de l'eau ; recommandé pour les réponses longues.
  - icon: shield
    title: Erreurs typées
    text: Le SDK réessaie 429, 5xx et les coupures réseau ; on corrige les 400 et 401.
  - icon: money
    title: Suivre la consommation
    text: usage.input_tokens et output_tokens à chaque appel ; count_tokens avant l'envoi.
pitfall: Lire uniquement le premier bloc de la réponse sans vérifier son type ni la raison d'arrêt.
remember: Filtrez les blocs de texte, vérifiez stop_reason et journalisez les tokens de chaque appel.
```
