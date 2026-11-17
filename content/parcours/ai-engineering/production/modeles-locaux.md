---
title: Exécuter des modèles open-weight
description: "Faire tourner des modèles en local ou sur ses propres serveurs : estimation de la mémoire, quantification, Ollama, llama.cpp et vLLM."
duration: 50
objectives:
  - Estimer la mémoire nécessaire pour exécuter un modèle
  - Expliquer la quantification et ses compromis
  - Exécuter un modèle localement avec Ollama et l'appeler depuis Python
  - Situer vLLM pour le service à grande échelle
---

# Pourquoi auto-héberger un modèle ?

Exécuter soi-même un modèle open-weight se justifie dans plusieurs situations :

- **confidentialité** : aucune donnée ne quitte votre infrastructure ;
- **fonctionnement hors ligne** ou sur appareil (poste de travail, mobile, objet connecté) ;
- **coût** à très grand volume, quand l'infrastructure est bien utilisée ;
- **personnalisation** complète (fine-tuning, module 11) ;
- **maîtrise des versions** : le modèle ne change que lorsque vous le décidez.

En contrepartie : achat ou location de **GPU**, compétences d'**exploitation**, et une qualité parfois inférieure aux meilleurs modèles propriétaires. Pour un prototype ou un volume modéré, une API est en général plus simple et souvent moins chère.

# Estimer la mémoire nécessaire

Ordre de grandeur pour charger les **poids** d'un modèle :

> mémoire (octets) ≈ nombre de paramètres × octets par paramètre

| Précision | Octets par paramètre | Modèle de 8 milliards de paramètres |
|---|---|---|
| FP32 | 4 | environ 32 Go |
| FP16 / BF16 | 2 | environ 16 Go |
| 8 bits | 1 | environ 8 Go |
| 4 bits | 0,5 | environ 4 à 5 Go |

À cela s'ajoutent la mémoire du **cache KV** (qui croît avec la longueur du contexte et le nombre de requêtes simultanées) et une marge pour le moteur d'exécution. On prévoit donc toujours **davantage** que la seule taille des poids.

> [!NOTE]
> Certains modèles utilisent une architecture à **mélange d'experts** (*Mixture of Experts*, MoE) : seule une partie des paramètres est activée pour chaque token, ce qui accélère le calcul. Mais **tous** les paramètres doivent tout de même tenir en mémoire.

# La quantification

La **quantification** (*quantization*) représente les poids avec moins de bits (8, 5, 4 bits…) au lieu de 16. Elle réduit fortement la mémoire et accélère souvent l'inférence, au prix d'une **légère perte de qualité**, d'autant plus marquée que le nombre de bits diminue et que le modèle est petit.

```diagram
type: compare
title: Compromis de la quantification
columns:
  - title: 16 bits
    tone: blue
    items:
      - Qualité de référence
      - Mémoire maximale
      - Serveurs avec GPU puissants
  - title: 8 bits
    tone: teal
    items:
      - Perte de qualité généralement très faible
      - Mémoire divisée par 2
  - title: 4 bits
    tone: amber
    items:
      - Perte de qualité faible à modérée selon le modèle
      - Mémoire divisée par environ 4
      - Permet de faire tourner des modèles sur un ordinateur portable
```

Le format **GGUF**, utilisé par **llama.cpp** et les outils qui s'appuient dessus (comme Ollama), est très répandu pour les modèles quantifiés destinés au CPU, aux Mac et aux GPU grand public. Les variantes portent des noms comme `Q4_K_M` ou `Q8_0`, qui indiquent la méthode et le nombre de bits.

> [!TIP]
> Comme toujours, ne supposez pas : **évaluez** le modèle quantifié sur votre jeu de tests. Une perte négligeable sur un benchmark peut être sensible sur votre tâche.

```video
url: https://www.youtube.com/watch?v=5RIOQuHOihY
title: "What is Ollama? Running Local LLMs Made Simple"
channel: "IBM Technology"
duration: "7:14"
lang: en
why: "IBM Technology présente Ollama et ce qu'implique de faire tourner un modèle sur sa propre machine, avant de passer à la pratique."
```

# Ollama en pratique

[Ollama](https://ollama.com) est l'outil le plus simple pour exécuter des modèles localement sur Windows, macOS ou Linux. Il télécharge des modèles quantifiés depuis sa bibliothèque et expose une **API HTTP locale**.

```bash
# Télécharger et lancer un modèle en mode conversation
# (choisissez un modèle dans la bibliothèque d'Ollama selon votre mémoire disponible)
ollama run llama3.2

# Lister les modèles installés
ollama list
```

L'API écoute par défaut sur `http://localhost:11434`. Avec la bibliothèque Python officielle :

```python
# pip install ollama
import ollama

reponse = ollama.chat(
    model="llama3.2",
    messages=[
        {"role": "system", "content": "Tu réponds en français, en trois phrases maximum."},
        {"role": "user", "content": "Qu'est-ce que la quantification d'un modèle ?"},
    ],
)
print(reponse["message"]["content"])
```

Ollama expose aussi une API **compatible avec celle d'OpenAI** (`http://localhost:11434/v1`), ce qui permet de réutiliser le SDK OpenAI ou des outils existants en changeant seulement l'URL de base.

Ollama permet aussi de calculer des **embeddings** avec des modèles dédiés, ce qui rend possible un **RAG entièrement local**.

# Servir à grande échelle avec vLLM

Pour servir un modèle à **de nombreux utilisateurs simultanés** sur des GPU, on utilise un moteur d'inférence optimisé. **vLLM** est l'un des plus utilisés : il gère efficacement la mémoire du cache KV (technique **PagedAttention**, Kwon et al., 2023) et regroupe dynamiquement les requêtes (*continuous batching*), ce qui multiplie le débit par rapport à une implémentation naïve.

```bash
pip install vllm
vllm serve <identifiant-du-modele-sur-hugging-face>
# Expose une API compatible OpenAI, par défaut sur http://localhost:8000/v1
```

D'autres moteurs existent, par exemple **SGLang** ou **Text Generation Inference** (Hugging Face), ainsi que des solutions des fabricants de GPU. Les modèles sont généralement téléchargés depuis le **Hugging Face Hub**, où il faut parfois accepter une licence avant de pouvoir y accéder.

| Outil | Usage principal |
|---|---|
| Ollama | Poste de développement, prototypes, usage local simple |
| llama.cpp | Inférence efficace sur CPU, Mac, matériel modeste ; modèles GGUF |
| vLLM, SGLang, TGI | Service en production sur GPU, nombreux utilisateurs |

# Exercices

## Exercice 1 : Estimer la mémoire

Estimez la mémoire nécessaire pour les poids d'un modèle de 70 milliards de paramètres en BF16, puis en 4 bits. Peut-il tenir, en 4 bits, sur une carte graphique de 24 Go ?

<details>
<summary>Voir la solution</summary>

- BF16 : 70 × 10⁹ × 2 octets ≈ **140 Go**.
- 4 bits : 70 × 10⁹ × 0,5 octet ≈ **35 Go** (un peu plus en pratique selon le format).

Non : même quantifié en 4 bits, les poids dépassent 24 Go, sans compter le cache KV. Il faut plusieurs GPU, un GPU avec davantage de mémoire, ou un déchargement partiel en mémoire système (beaucoup plus lent).

</details>

## Exercice 2 : Un RAG local

En reprenant le prototype de RAG du module 5, remplacez l'appel au modèle propriétaire par un appel à un modèle local via Ollama. Quelles différences observez-vous en qualité et en vitesse ?

<details>
<summary>Voir la solution</summary>

```python
import ollama


def repondre(question: str) -> str:
    passages = rechercher(question)
    reponse = ollama.chat(
        model="llama3.2",
        messages=[{"role": "user", "content": construire_prompt_rag(question, passages)}],
    )
    return reponse["message"]["content"]
```

Observations typiques : un petit modèle local respecte moins rigoureusement les consignes (citations, refus quand l'information manque) et peut répondre dans une autre langue ; la vitesse dépend fortement du matériel. C'est exactement le genre de différence qu'il faut **mesurer** avec le jeu d'évaluation avant de choisir.

</details>

## Exercice 3 : API ou auto-hébergement ?

Une entreprise traite 2 000 requêtes par jour, sans données particulièrement sensibles, avec une équipe de deux développeurs. Elle envisage d'auto-héberger un modèle « pour économiser ». Que lui conseillez-vous ?

<details>
<summary>Voir la solution</summary>

À ce volume, une **API** est presque certainement plus économique et plus simple : un serveur GPU loué en permanence coûte cher, serait très peu utilisé, et demanderait du temps d'exploitation (mises à jour, supervision, sécurité) à une petite équipe. On peut chiffrer les deux options (coût API au volume réel, avec cache et éventuel petit modèle, contre coût du GPU et du temps d'exploitation). L'auto-hébergement se justifie surtout pour des raisons de **confidentialité**, de **fonctionnement hors ligne**, de **personnalisation** ou à **très grand volume**.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Exécuter des modèles open-weight
center: Auto-héberger apporte contrôle et confidentialité, au prix du matériel et de l'exploitation.
points:
  - icon: cpu
    title: Estimer la mémoire
    text: Paramètres × octets par paramètre, plus le cache KV ; 8 milliards en 16 bits ≈ 16 Go.
  - icon: ruler
    title: Quantification
    text: 8 ou 4 bits divisent la mémoire ; une perte de qualité à mesurer sur sa tâche.
  - icon: terminal
    title: Ollama
    text: Modèles locaux en une commande, API sur localhost:11434, compatible OpenAI.
  - icon: server
    title: vLLM en production
    text: PagedAttention et regroupement continu pour servir de nombreux utilisateurs.
  - icon: scale
    title: API ou auto-hébergement
    text: Confidentialité, hors ligne, très gros volume, sinon une API reste souvent plus simple.
pitfall: Oublier qu'un modèle à mélange d'experts doit tout de même tenir entièrement en mémoire.
remember: Évaluez toujours le modèle quantifié sur vos propres cas avant de l'adopter.
```
