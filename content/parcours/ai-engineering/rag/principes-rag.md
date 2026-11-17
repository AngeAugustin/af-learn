---
title: Les principes du RAG
description: "Pourquoi et comment connecter un modèle à vos propres documents : architecture d'un pipeline RAG et premier prototype complet."
duration: 50
objectives:
  - Expliquer le problème que résout le RAG et ses alternatives
  - Décrire les deux phases d'un pipeline RAG (ingestion et requête)
  - Construire le prompt d'un RAG avec citations
  - Implémenter un prototype de RAG minimal de bout en bout
---

# Le problème

Un LLM ne connaît pas vos documents internes, vos procédures, vos contrats ou la dernière version de votre documentation produit. Ses connaissances s'arrêtent à sa **date de coupure** et à ce qui était public. Pour qu'il réponde à partir de **vos** informations, il faut les lui **fournir dans le contexte**.

Le **RAG** (*Retrieval-Augmented Generation*, génération augmentée par la recherche) est l'architecture qui le permet : à chaque question, on **recherche** les passages pertinents dans une base documentaire, puis on les donne au modèle pour qu'il **génère** une réponse fondée sur ces passages. Le terme a été popularisé par un article de Lewis et al. (2020).

## Pourquoi ne pas tout mettre dans le prompt ?

Avec des fenêtres de contexte de plusieurs centaines de milliers de tokens, on peut se demander pourquoi ne pas envoyer toute la documentation à chaque requête. C'est parfois la bonne solution, quand le corpus est **petit et stable** (quelques dizaines de pages), surtout avec la mise en cache des prompts. Mais pour un corpus important :

- le **coût** et la **latence** deviennent prohibitifs (on paie tous les tokens à chaque question) ;
- le corpus **dépasse** souvent la fenêtre de contexte (des milliers de documents) ;
- la **qualité** peut baisser quand l'information utile est noyée dans un contexte immense ;
- on ne peut pas facilement appliquer des **droits d'accès** par utilisateur.

## Pourquoi pas le fine-tuning ?

Le fine-tuning modifie le comportement d'un modèle, mais c'est un mauvais moyen d'y **stocker des connaissances** : coûteux à mettre à jour, sans citations possibles, et sujet aux hallucinations. Le RAG permet de mettre à jour la base **instantanément**, de **citer les sources** et de respecter les **droits d'accès**. Le module 11 revient sur ce choix.

```video
url: https://www.youtube.com/watch?v=T-D1OfcDW1M
title: "What is Retrieval-Augmented Generation (RAG)?"
channel: "IBM Technology"
duration: "6:35"
lang: en
why: "Six minutes au tableau blanc pour comprendre pourquoi un modèle a besoin de récupérer des documents et comment le RAG limite les réponses périmées ou inventées."
```

# L'architecture d'un pipeline RAG

Un système RAG comporte deux phases.

```diagram
type: pipeline
title: Les deux phases d'un RAG
lanes:
  - title: Ingestion (hors ligne, à chaque ajout ou modification de document)
    steps:
      - title: Charger
        text: PDF, pages web, wiki, tickets…
      - title: Extraire
        text: Texte propre et métadonnées
      - title: Découper
        text: Passages (chunks) de taille adaptée
      - title: Vectoriser
        text: Un embedding par passage
      - title: Stocker
        text: Base vectorielle + métadonnées
  - title: Requête (en ligne, à chaque question)
    steps:
      - title: Question
        text: Saisie de l'utilisateur
      - title: Rechercher
        text: Embedding de la question, passages les plus proches
      - title: Reclasser
        text: "Optionnel : garder les meilleurs"
      - title: Générer
        text: Prompt = consignes + passages + question
      - title: Répondre
        text: Réponse avec citations des sources
```

## Ingestion

1. **Charger** les documents depuis leurs sources.
2. **Extraire** un texte propre (suppression des menus, en-têtes répétés…) et des **métadonnées** (titre, URL, date, auteur, droits d'accès).
3. **Découper** en passages (*chunks*) : assez courts pour être précis, assez longs pour avoir du sens.
4. **Calculer un embedding** pour chaque passage.
5. **Stocker** passages, embeddings et métadonnées dans une base adaptée à la recherche vectorielle.

## Requête

1. Calculer l'**embedding de la question** avec le **même modèle** d'embeddings.
2. **Rechercher** les passages les plus similaires (souvent 5 à 20).
3. Optionnellement, **reclasser** (*reranking*) ces passages avec un modèle plus précis.
4. **Construire le prompt** : consignes, passages numérotés, question.
5. **Générer** la réponse, avec **citations** des sources utilisées.

Les chapitres suivants détaillent chaque étape. Ce chapitre construit d'abord une version minimale qui fonctionne.

# Le prompt d'un RAG

Le prompt est l'endroit où l'on transforme des passages récupérés en réponse **fiable**. Il doit :

- délimiter clairement les **sources** (balises, numéros) ;
- demander de répondre **uniquement** à partir des sources ;
- prévoir le cas où la réponse **n'est pas** dans les sources ;
- exiger des **citations**.

```python
def construire_prompt_rag(question: str, passages: list[dict]) -> str:
    sources = "\n\n".join(
        f'<source id="{i}" titre="{p["titre"]}">\n{p["texte"]}\n</source>'
        for i, p in enumerate(passages, start=1)
    )
    return f"""<sources>
{sources}
</sources>

Réponds à la question de l'utilisateur en t'appuyant uniquement sur les sources ci-dessus.
- Après chaque affirmation, indique la ou les sources utilisées entre crochets, par exemple [2].
- Si les sources ne permettent pas de répondre, dis-le clairement et n'invente rien.
- Réponds en français, de façon concise.

Question : {question}"""
```

> [!NOTE]
> Certaines API proposent une prise en charge native des citations. Chez Anthropic par exemple, on peut transmettre les passages sous forme de **documents** avec les citations activées : la réponse contient alors des références précises vers les extraits cités, sans avoir à les analyser soi-même. Consultez la documentation de votre fournisseur.

# Un prototype complet

Voici un RAG minimal, en mémoire, avec `sentence-transformers` pour les embeddings et un LLM pour la génération. Il tient en une cinquantaine de lignes et contient déjà toutes les étapes.

```python
# pip install sentence-transformers anthropic numpy
import numpy as np
import anthropic
from sentence_transformers import SentenceTransformer

encodeur = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
client = anthropic.Anthropic()

# --- Ingestion ---
documents = [
    {"titre": "Congés", "texte": "Les salariés disposent de 25 jours de congés payés par an. "
     "Les demandes se font dans l'outil RH au moins deux semaines à l'avance."},
    {"titre": "Télétravail", "texte": "Le télétravail est possible jusqu'à trois jours par semaine "
     "après accord du manager. Le matériel est fourni par l'entreprise."},
    {"titre": "Notes de frais", "texte": "Les notes de frais doivent être déposées avant le 5 du mois "
     "suivant, avec les justificatifs numérisés."},
]
vecteurs = encodeur.encode([d["texte"] for d in documents], normalize_embeddings=True)


# --- Requête ---
def rechercher(question: str, k: int = 2) -> list[dict]:
    q = encodeur.encode([question], normalize_embeddings=True)[0]
    scores = vecteurs @ q
    return [documents[i] for i in np.argsort(-scores)[:k]]


def repondre(question: str) -> str:
    passages = rechercher(question)
    reponse = client.messages.create(
        model="claude-opus-5-5",
        max_tokens=1024,
        messages=[{"role": "user", "content": construire_prompt_rag(question, passages)}],
    )
    return "".join(b.text for b in reponse.content if b.type == "text")


print(repondre("Combien de jours puis-je télétravailler ?"))
print(repondre("Quel est le montant de la prime de fin d'année ?"))  # absent des sources
```

La deuxième question permet de vérifier que le système **reconnaît** qu'il ne sait pas, plutôt que d'inventer.

> [!IMPORTANT]
> Un RAG échoue de deux façons très différentes : la **recherche** ne trouve pas le bon passage, ou la **génération** utilise mal un passage pourtant trouvé. Quand une réponse est mauvaise, regardez toujours d'abord **quels passages ont été récupérés**. C'est la base du diagnostic, et de l'évaluation au chapitre 4.

# Exercices

## Exercice 1 : RAG ou pas RAG ?

Pour chaque situation, indiquez si un RAG est pertinent, ou si une autre approche suffit :

1. Un assistant qui répond sur un règlement intérieur de 6 pages, qui change une fois par an.
2. Un assistant qui répond à partir de 40 000 articles d'une base de connaissances mise à jour quotidiennement.
3. Un outil qui reformule des courriels pour les rendre plus polis.

<details>
<summary>Voir la solution</summary>

1. **Pas forcément** : 6 pages tiennent facilement dans le prompt. On peut les inclure à chaque requête (avec mise en cache du prompt pour réduire coût et latence). Plus simple, et aucune erreur de recherche possible.
2. **RAG** : volume important, mises à jour fréquentes, besoin de citations.
3. **Pas de RAG** : la tâche ne nécessite aucune connaissance externe, un bon prompt suffit.

</details>

## Exercice 2 : Diagnostiquer

Votre RAG répond « je ne trouve pas l'information » à la question « Combien de jours de congés ai-je ? », alors que la réponse figure dans la base. Quelles sont les deux grandes causes possibles et comment les distinguer ?

<details>
<summary>Voir la solution</summary>

1. **Échec de la recherche** : le passage pertinent ne fait pas partie des passages récupérés (découpage inadapté, vocabulaire différent, `k` trop petit, mauvais modèle d'embeddings).
2. **Échec de la génération** : le passage a été récupéré mais le modèle ne l'a pas exploité (prompt trop restrictif, passage noyé parmi d'autres, information formulée de façon indirecte).

Pour les distinguer : **afficher les passages récupérés** pour cette question. Si le bon passage est absent, c'est la recherche ; s'il est présent, c'est la génération.

</details>

## Exercice 3 : Améliorer le prototype

Modifiez le prototype pour : (a) afficher les titres des sources utilisées sous la réponse ; (b) ne transmettre au modèle que les passages dont le score de similarité dépasse un seuil (par exemple 0,3). Pourquoi un seuil peut-il être utile ? Quel est son risque ?

<details>
<summary>Voir la solution</summary>

```python
def rechercher(question: str, k: int = 3, seuil: float = 0.3) -> list[tuple[dict, float]]:
    q = encodeur.encode([question], normalize_embeddings=True)[0]
    scores = vecteurs @ q
    meilleurs = np.argsort(-scores)[:k]
    return [(documents[i], float(scores[i])) for i in meilleurs if scores[i] >= seuil]


def repondre(question: str) -> str:
    resultats = rechercher(question)
    if not resultats:
        return "Je ne trouve aucune information pertinente dans la documentation."
    passages = [doc for doc, _ in resultats]
    reponse = client.messages.create(
        model="claude-opus-5-5",
        max_tokens=1024,
        messages=[{"role": "user", "content": construire_prompt_rag(question, passages)}],
    )
    texte = "".join(b.text for b in reponse.content if b.type == "text")
    sources = ", ".join(f"[{i}] {p['titre']}" for i, p in enumerate(passages, start=1))
    return f"{texte}\n\nSources : {sources}"
```

Intérêt du seuil : éviter d'envoyer des passages sans rapport (bruit, coût) et répondre rapidement « je ne sais pas » pour les questions hors périmètre. Risque : un seuil trop élevé écarte des passages pertinents. La bonne valeur dépend du modèle d'embeddings et se règle **sur un jeu d'évaluation**, pas au hasard.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Les principes du RAG
center: Rechercher les bons passages, puis générer une réponse fondée sur eux, avec citations.
points:
  - icon: idea
    title: Pourquoi le RAG
    text: Le modèle ignore vos documents ; le RAG les apporte à jour, cités et filtrés par droits.
  - icon: database
    title: Phase d'ingestion
    text: Charger, extraire, découper, vectoriser, stocker avec les métadonnées.
  - icon: search
    title: Phase de requête
    text: Embedding de la question, recherche, reclassement éventuel, génération.
  - icon: chat
    title: Le prompt RAG
    text: Sources délimitées, réponse limitée aux sources, citations, refus si l'info manque.
  - icon: eye
    title: Diagnostiquer
    text: "Regarder d'abord les passages récupérés : échec de recherche ou de génération ?"
pitfall: Se précipiter sur un RAG pour un petit corpus stable qui tiendrait directement dans le prompt.
remember: Un RAG fiable sait dire « je ne trouve pas cette information dans les sources ».
```
