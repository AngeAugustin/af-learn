---
title: RAG avancé et évaluation d'un RAG
description: Techniques pour améliorer un RAG (réécriture de requête, récupération hiérarchique, RAG agentique) et méthode pour mesurer séparément la recherche et la génération.
duration: 60
objectives:
  - Appliquer des techniques d'amélioration de la requête et de la récupération
  - Comprendre le RAG agentique et ses compromis
  - Mesurer la qualité de la recherche (rappel@k, MRR)
  - Mesurer la qualité de la génération (fidélité, pertinence)
---

# Améliorer la requête

La question de l'utilisateur est souvent un **mauvais point de départ** pour la recherche : trop courte, ambiguë, dépendante de la conversation (« et pour les stagiaires ? »), ou formulée très différemment des documents.

## Réécrire la question

Dans une conversation, on demande à un LLM (souvent un petit modèle rapide) de **reformuler la dernière question en une requête autonome** :

> Historique : « Combien de jours de télétravail sont autorisés ? » → « Trois jours par semaine. »
> Question : « Et pour les stagiaires ? »
> Requête réécrite : « Nombre de jours de télétravail autorisés pour les stagiaires »

C'est l'une des améliorations les plus rentables pour un assistant conversationnel.

## Requêtes multiples et décomposition

- **Multi-requêtes** : générer plusieurs reformulations, lancer une recherche pour chacune, puis fusionner les résultats (par exemple avec RRF).
- **Décomposition** : une question complexe (« Compare les politiques de télétravail de 2025 et 2026 ») est découpée en sous-questions, chacune avec sa recherche.

## HyDE

La technique **HyDE** (*Hypothetical Document Embeddings*, Gao et al., 2022) consiste à demander au LLM de rédiger une **réponse hypothétique**, puis à rechercher les passages proches de cette réponse plutôt que de la question. L'idée : une réponse ressemble davantage aux documents qu'une question. Efficace dans certains cas, cette technique ajoute un appel au modèle et peut orienter la recherche dans une mauvaise direction si l'hypothèse est fausse : à valider par la mesure.

# Améliorer la récupération

## Petits passages pour chercher, grands pour répondre

La récupération **hiérarchique** (*parent-child* ou *small-to-big*) indexe de **petits passages**, précis pour la recherche, mais transmet au modèle le **passage parent** plus large (la section entière) qui les contient. On combine ainsi précision de la recherche et richesse du contexte.

## Filtres par métadonnées

Beaucoup de questions contiennent des contraintes explicites : une date, un produit, un pays. Un LLM peut **extraire ces filtres** de la question (en sortie structurée) pour les appliquer en SQL avant la recherche vectorielle :

> « Quelle était la procédure de remboursement en 2025 ? » → filtre `annee = 2025` + recherche « procédure de remboursement »

## Le RAG agentique

Dans un RAG classique, la recherche a lieu **une fois**, avant la génération. Dans un **RAG agentique**, la recherche est un **outil** que le modèle appelle lui-même, autant de fois que nécessaire : il peut reformuler, chercher à nouveau, croiser plusieurs sources, puis répondre.

```diagram
type: compare
title: RAG classique et RAG agentique
columns:
  - title: RAG classique
    tone: blue
    items:
      - Une recherche, puis une génération
      - Rapide, prévisible, peu coûteux
      - Limité pour les questions complexes ou en plusieurs étapes
  - title: RAG agentique
    tone: violet
    items:
      - Le modèle appelle l'outil de recherche autant que nécessaire
      - Meilleur sur les questions complexes
      - Plus lent, plus coûteux, moins prévisible
```

Commencez par un RAG classique bien réglé ; passez à l'agentique quand l'évaluation montre que les questions complexes échouent (module 6).

> [!NOTE]
> D'autres approches existent, comme **GraphRAG** (proposé par Microsoft Research en 2024), qui construit un graphe d'entités et de relations à partir des documents pour répondre à des questions de synthèse portant sur tout le corpus. Elles sont plus coûteuses à mettre en place et se justifient pour des besoins spécifiques.

```video
url: https://www.youtube.com/watch?v=tLMViADvSNE
title: "Every RAG Strategy Explained in 13 Minutes (No Fluff)"
channel: "Cole Medin"
duration: "12:51"
lang: en
why: "Un tour rapide des stratégies de RAG avancé (reranking, recherche hybride, réécriture de requête), à évaluer ensuite comme le montre ce chapitre."
```

# Évaluer la recherche

On évalue **séparément** la recherche et la génération, car leurs problèmes et leurs remèdes sont différents.

Pour la recherche, il faut un **jeu de questions** associées aux **passages pertinents attendus**. On peut le constituer à la main (le plus fiable), à partir de vraies questions d'utilisateurs, ou en faisant générer par un LLM des questions à partir de passages, puis en les relisant.

| Métrique | Définition | Question à laquelle elle répond |
|---|---|---|
| **Rappel@k** | Part des questions pour lesquelles un passage pertinent figure dans les k premiers résultats | Le bon passage est-il trouvé ? |
| **Précision@k** | Part de passages pertinents parmi les k premiers | Combien de bruit envoie-t-on au modèle ? |
| **MRR** (*Mean Reciprocal Rank*) | Moyenne de 1 / rang du premier passage pertinent | Le bon passage est-il bien classé ? |
| **nDCG** | Qualité du classement en tenant compte de plusieurs niveaux de pertinence | Le classement global est-il bon ? |

```python
def rappel_a_k(resultats: dict[str, list[str]], attendus: dict[str, set[str]], k: int) -> float:
    """resultats : question -> identifiants classés ; attendus : question -> identifiants pertinents."""
    succes = sum(1 for q, ids in resultats.items() if set(ids[:k]) & attendus[q])
    return succes / len(resultats)


def mrr(resultats: dict[str, list[str]], attendus: dict[str, set[str]]) -> float:
    total = 0.0
    for q, ids in resultats.items():
        for rang, identifiant in enumerate(ids, start=1):
            if identifiant in attendus[q]:
                total += 1 / rang
                break
    return total / len(resultats)
```

> [!TIP]
> Le **rappel@k** de la recherche est un **plafond** pour la qualité du RAG : si le bon passage n'est pas récupéré, le meilleur modèle du monde ne pourra pas répondre correctement. Commencez toujours par là.

# Évaluer la génération

Pour la génération, trois questions principales :

- **Fidélité** (*faithfulness*, *groundedness*) : chaque affirmation de la réponse est-elle **soutenue par les passages** fournis ? C'est la mesure directe des hallucinations dans un RAG.
- **Pertinence de la réponse** : la réponse traite-t-elle **la question posée** ?
- **Exactitude** : la réponse est-elle correcte par rapport à une **réponse de référence** validée ?

Ces critères sont difficiles à mesurer avec des règles simples. On utilise souvent un **LLM comme évaluateur** (module 8), avec des consignes précises, en vérifiant régulièrement son accord avec des jugements humains. Des bibliothèques comme **Ragas** proposent des implémentations de ces métriques ; elles sont utiles pour démarrer, mais il faut comprendre ce qu'elles mesurent et les valider sur vos données.

```diagram
type: compare
title: Diagnostiquer un RAG
columns:
  - title: Rappel@k faible
    tone: rose
    items:
      - Problème de recherche
      - "Pistes : découpage, contextualisation, recherche hybride, réécriture de requête, k plus grand"
  - title: Rappel@k élevé, fidélité faible
    tone: amber
    items:
      - Le modèle invente malgré les bonnes sources
      - "Pistes : prompt plus strict, citations obligatoires, moins de passages bruités, reranking"
  - title: Fidélité élevée, exactitude faible
    tone: violet
    items:
      - Les sources elles-mêmes sont incomplètes ou obsolètes
      - "Pistes : qualité et fraîcheur de la base documentaire"
```

# Exercices

## Exercice 1 : Calculer des métriques de recherche

Pour trois questions, les passages pertinents et les résultats (classés) sont :

- Q1 : pertinents {p3} ; résultats [p3, p8, p1]
- Q2 : pertinents {p5} ; résultats [p2, p9, p5]
- Q3 : pertinents {p7} ; résultats [p4, p6, p1]

Calculez le rappel@1, le rappel@3 et le MRR.

<details>
<summary>Voir la solution</summary>

- Rappel@1 : seule Q1 a un passage pertinent en première position → 1/3 ≈ **0,33**.
- Rappel@3 : Q1 et Q2 → 2/3 ≈ **0,67**.
- MRR : Q1 → 1/1, Q2 → 1/3, Q3 → 0. Moyenne = (1 + 0,333 + 0) / 3 ≈ **0,44**.

</details>

## Exercice 2 : Réécriture de requête

Écrivez un prompt qui transforme la dernière question d'une conversation en requête de recherche autonome. Testez-le mentalement sur : historique « Quels sont les horaires de la médiathèque ? » / « Du mardi au samedi, 10 h – 18 h. » ; question « Et le dimanche ? ».

<details>
<summary>Voir la solution</summary>

```text
Voici l'historique d'une conversation et la dernière question de l'utilisateur.
Réécris cette question sous la forme d'une requête de recherche autonome et complète,
compréhensible sans l'historique. Conserve les termes précis (noms, dates, codes).
Réponds uniquement avec la requête.

<historique>
{historique}
</historique>

<question>
{question}
</question>
```

Résultat attendu : « Horaires d'ouverture de la médiathèque le dimanche ».

</details>

## Exercice 3 : Interpréter des résultats

Votre RAG obtient un rappel@5 de 0,95 et une fidélité de 0,70. Où concentrer vos efforts, et par quoi commencer ?

<details>
<summary>Voir la solution</summary>

La recherche fonctionne bien (le bon passage est presque toujours récupéré) : le problème est la **génération**, qui produit des affirmations non soutenues dans 30 % des cas. Pistes : renforcer le prompt (répondre uniquement à partir des sources, citations obligatoires, droit de dire « je ne sais pas »), réduire le bruit (moins de passages, reranking), utiliser les citations natives de l'API, puis **lire les cas infidèles** pour identifier les motifs récurrents avant de modifier quoi que ce soit.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: RAG avancé et évaluation
center: Améliorer la requête et la récupération, puis mesurer séparément recherche et génération.
points:
  - icon: chat
    title: Réécrire la question
    text: Une requête autonome pour les questions de relance ; très rentable.
  - icon: layers
    title: Récupération hiérarchique
    text: Chercher avec de petits passages, transmettre le passage parent au modèle.
  - icon: loop
    title: RAG agentique
    text: La recherche devient un outil appelé autant que nécessaire ; plus puissant mais plus coûteux.
  - icon: chart
    title: Mesurer la recherche
    text: "Rappel@k, précision@k, MRR : le rappel@k plafonne la qualité du RAG."
  - icon: check
    title: Mesurer la génération
    text: Fidélité aux sources, pertinence, exactitude par rapport à une référence.
pitfall: Optimiser le prompt de génération alors que les bons passages ne sont jamais récupérés.
remember: Rappel faible → corriger la recherche ; fidélité faible → corriger la génération.
```
