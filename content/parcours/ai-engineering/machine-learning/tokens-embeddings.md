---
title: "Représenter le texte : tokens et embeddings"
description: "Comment un modèle transforme du texte en nombres : tokenisation, vocabulaire, embeddings et similarité sémantique."
duration: 55
objectives:
  - Expliquer ce qu'est un token et pourquoi les LLM raisonnent en tokens
  - Estimer l'impact de la tokenisation sur les coûts et les limites de contexte
  - Définir un embedding et la similarité cosinus
  - Calculer des embeddings et comparer des phrases en Python
---

# Du texte aux tokens

Un réseau de neurones ne manipule que des **nombres**. Avant d'entrer dans un modèle, un texte est découpé en **tokens** (des morceaux de texte), et chaque token est remplacé par un **identifiant** entier dans un **vocabulaire** fixe.

```diagram
type: flow
title: La tokenisation
steps:
  - title: Texte
    text: "« L'IA générative »"
  - title: Tokens
    text: "Des morceaux : mots, sous-mots, ponctuation, espaces"
  - title: Identifiants
    text: "Des entiers, par exemple [43, 6, 1087, 25311]"
  - title: Modèle
    text: Chaque identifiant devient un vecteur appris
```

*(Le découpage et les identifiants ci-dessus sont illustratifs : ils dépendent du tokenizer de chaque modèle.)*

## Pourquoi des sous-mots ?

- Un vocabulaire de **caractères** serait petit mais produirait des séquences très longues.
- Un vocabulaire de **mots entiers** serait gigantesque et ne saurait pas traiter un mot nouveau ou mal orthographié.
- Les tokenizers modernes utilisent des **sous-mots**, appris statistiquement sur un grand corpus avec des algorithmes comme **BPE** (*Byte-Pair Encoding*) : les séquences fréquentes deviennent un seul token, les mots rares sont décomposés en plusieurs morceaux.

Les vocabulaires des LLM actuels comptent typiquement de quelques dizaines de milliers à quelques centaines de milliers de tokens.

## Ce que cela change pour vous

1. **Les coûts sont facturés au token**, en entrée comme en sortie.
2. **Les limites de contexte sont exprimées en tokens** : la quantité de texte que le modèle peut traiter en une fois.
3. **Toutes les langues ne se valent pas** : les tokenizers étant souvent entraînés majoritairement sur de l'anglais, un même contenu en français, et encore plus dans des langues moins représentées, nécessite en général **davantage de tokens**.
4. **Le modèle « voit » des tokens, pas des lettres** : c'est pourquoi les LLM peuvent avoir du mal avec des tâches comme compter les lettres d'un mot ou inverser une chaîne caractère par caractère.

> [!TIP]
> Un ordre de grandeur souvent cité pour l'anglais est d'environ **4 caractères par token** (soit environ trois quarts de mot). C'est une approximation : pour un calcul fiable, utilisez l'outil de comptage du fournisseur. Anthropic propose un point d'API de comptage de tokens (`count_tokens`), et OpenAI publie la bibliothèque `tiktoken`. Les tokenizers diffèrent d'un modèle à l'autre, y compris chez un même fournisseur.

```python
# Compter les tokens avec tiktoken (tokenizers des modèles OpenAI)
import tiktoken

enc = tiktoken.get_encoding("o200k_base")
for texte in ["Hello world", "Bonjour le monde", "anticonstitutionnellement"]:
    ids = enc.encode(texte)
    print(f"{texte!r}: {len(ids)} tokens -> {ids}")
```

```video
url: https://www.youtube.com/watch?v=zduSFxRajkE
title: "Let's build the GPT Tokenizer"
channel: "Andrej Karpathy"
duration: "2:13:34"
lang: en
why: "Andrej Karpathy construit un tokenizer BPE ligne par ligne et montre pourquoi tant de bizarreries des LLM (orthographe, arithmétique, langues rares) viennent de la tokenisation. Long, mais la première heure suffit pour ce chapitre."
```

# Les embeddings

Un identifiant de token n'a aucun sens en soi : le token 1087 n'est pas « plus grand » que le token 43. Le modèle associe donc à chaque token un **vecteur** de nombres réels appris pendant l'entraînement : son **embedding** (plongement).

Plus généralement, un **embedding** est une représentation d'un objet (mot, phrase, document, image) sous la forme d'un **vecteur** de quelques centaines à quelques milliers de dimensions, construit de sorte que **des objets de sens proche aient des vecteurs proches**.

```diagram
type: custom
name: embedding-space
caption: Projection simplifiée en deux dimensions. Les textes de sens voisin forment des groupes ; la distance entre vecteurs reflète la proximité sémantique.
```

Une propriété célèbre, observée dès les embeddings de mots de type **word2vec** (2013), est que certaines relations de sens se traduisent par des directions de l'espace : le vecteur de « roi » − « homme » + « femme » est proche de celui de « reine ». Les modèles modernes produisent des représentations bien plus riches, mais l'intuition reste la même : **le sens devient de la géométrie**.

## Modèles d'embeddings de phrases

Pour un AI Engineer, les embeddings les plus utiles sont ceux de **phrases ou de passages entiers**, produits par des **modèles d'embeddings** spécialisés (distincts des LLM génératifs). Ils sont au cœur de la **recherche sémantique** et du **RAG** (module 5).

Sources possibles :

- des **API** (par exemple OpenAI, Voyage AI (recommandé dans la documentation d'Anthropic, qui ne propose pas son propre modèle d'embeddings), Cohere, Mistral, Google) ;
- des **modèles open-weight** exécutés localement, par exemple via la bibliothèque `sentence-transformers`.

# Mesurer la similarité

Pour comparer deux embeddings, on utilise le plus souvent la **similarité cosinus** : le cosinus de l'angle entre les deux vecteurs.

> cos(A, B) = (A · B) / (‖A‖ × ‖B‖)

- Proche de **1** : même direction, sens très proche.
- Proche de **0** : vecteurs orthogonaux, sans rapport.
- Négative : directions opposées (rare en pratique pour des embeddings de textes).

> [!NOTE]
> **Le minimum de mathématiques nécessaire.** Un vecteur est une liste de nombres, par exemple A = (1, 2) et B = (2, 1).
> - Le **produit scalaire** multiplie les composantes deux à deux puis additionne : A · B = 1×2 + 2×1 = 4.
> - La **norme** (longueur) est la racine de la somme des carrés : ‖A‖ = √(1² + 2²) = √5 ≈ 2,24, et de même ‖B‖ ≈ 2,24.
> - D'où cos(A, B) = 4 / (2,24 × 2,24) = 4 / 5 = 0,8 : vecteurs assez proches.
> - **Normaliser** un vecteur, c'est le diviser par sa norme pour que sa longueur vaille 1 ; seule sa direction compte alors.
>
> La **distance cosinus** utilisée par les bases vectorielles vaut 1 − similarité : plus elle est petite, plus les textes sont proches.

Quand les vecteurs sont **normalisés** (longueur 1), la similarité cosinus est simplement le **produit scalaire**, ce qui accélère les calculs ; beaucoup de modèles d'embeddings renvoient des vecteurs déjà normalisés.

```python
# pip install sentence-transformers
from sentence_transformers import SentenceTransformer

# Modèle multilingue, adapté au français, exécuté localement
modele = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

phrases = [
    "Comment réinitialiser mon mot de passe ?",
    "J'ai oublié mes identifiants de connexion.",
    "Quels sont vos horaires d'ouverture ?",
]
vecteurs = modele.encode(phrases, normalize_embeddings=True)
print(vecteurs.shape)  # (3, 384)

similarites = vecteurs @ vecteurs.T  # produit scalaire = cosinus (vecteurs normalisés)
print(similarites.round(2))
```

Vous devriez observer une similarité nettement plus élevée entre les deux premières phrases (même intention, mots différents) qu'avec la troisième. C'est tout l'intérêt de la recherche **sémantique** par rapport à une recherche par mots-clés.

> [!IMPORTANT]
> Des embeddings produits par **deux modèles différents** ne sont pas comparables entre eux : chaque modèle définit son propre espace. Si vous changez de modèle d'embeddings, il faut **recalculer tous les vecteurs** de votre base.

# Exercices

## Exercice 1 : Estimer des coûts

Un document de 120 000 caractères en anglais doit être résumé. En utilisant l'approximation de 4 caractères par token, estimez le nombre de tokens en entrée. Si le modèle coûte 3 $ par million de tokens en entrée, combien coûte la lecture du document ? Pourquoi ce calcul n'est-il qu'une estimation ?

<details>
<summary>Voir la solution</summary>

- 120 000 / 4 ≈ **30 000 tokens**.
- 30 000 / 1 000 000 × 3 $ = **0,09 $** pour l'entrée (hors tokens de sortie, facturés à part, généralement plus cher).
- C'est une estimation car le ratio caractères/token dépend de la langue, du contenu (code, chiffres, tableaux) et du tokenizer du modèle. Pour un calcul précis, utilisez l'outil de comptage du fournisseur. Les prix évoluent également : consultez la page de tarifs à jour.

</details>

## Exercice 2 : Calculer une similarité cosinus

Calculez à la main la similarité cosinus entre A = (1 ; 2 ; 2) et B = (2 ; 0 ; 1).

<details>
<summary>Voir la solution</summary>

- A · B = 1×2 + 2×0 + 2×1 = 4.
- ‖A‖ = √(1 + 4 + 4) = 3 ; ‖B‖ = √(4 + 0 + 1) = √5 ≈ 2,236.
- cos = 4 / (3 × 2,236) ≈ **0,596**.

</details>

## Exercice 3 : Recherche sémantique minimale

En vous appuyant sur l'exemple `sentence-transformers`, écrivez une fonction `rechercher(question, documents, k=2)` qui renvoie les `k` documents les plus similaires à la question. Testez-la avec une FAQ de cinq questions-réponses.

<details>
<summary>Voir la solution</summary>

```python
import numpy as np
from sentence_transformers import SentenceTransformer

modele = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")


def rechercher(question: str, documents: list[str], k: int = 2) -> list[tuple[str, float]]:
    vecs_docs = modele.encode(documents, normalize_embeddings=True)
    vec_q = modele.encode([question], normalize_embeddings=True)[0]
    scores = vecs_docs @ vec_q
    meilleurs = np.argsort(-scores)[:k]
    return [(documents[i], float(scores[i])) for i in meilleurs]


faq = [
    "Pour réinitialiser votre mot de passe, cliquez sur « Mot de passe oublié ».",
    "Nos bureaux sont ouverts du lundi au vendredi, de 9 h à 18 h.",
    "La livraison standard prend 3 à 5 jours ouvrés.",
    "Vous pouvez retourner un article sous 30 jours.",
    "Le paiement par carte et par virement est accepté.",
]
print(rechercher("J'ai perdu mon mot de passe", faq))
```

En production, on ne recalcule pas les embeddings des documents à chaque requête : on les calcule une fois et on les stocke dans une base vectorielle (module 5).

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Tokens et embeddings
center: Le modèle voit des tokens, et le sens devient de la géométrie dans un espace de vecteurs.
points:
  - icon: puzzle
    title: Des tokens, pas des mots
    text: Des sous-mots (BPE) ; chaque modèle a son propre tokenizer.
  - icon: money
    title: Tout se compte en tokens
    text: Coûts et fenêtre de contexte ; le français consomme souvent plus qu'en anglais.
  - icon: sparkles
    title: Les embeddings
    text: Des vecteurs où les textes de sens proche sont proches les uns des autres.
  - icon: ruler
    title: La similarité cosinus
    text: Proche de 1 = sens voisin ; avec des vecteurs normalisés, c'est le produit scalaire.
  - icon: search
    title: La recherche sémantique
    text: Retrouver « mot de passe oublié » à partir de « identifiants perdus ».
pitfall: "Mélanger des embeddings produits par deux modèles différents : leurs espaces ne sont pas comparables."
remember: Comptez avec l'outil du fournisseur et changez de modèle d'embeddings seulement en recalculant toute la base.
```
