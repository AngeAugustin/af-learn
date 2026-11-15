---
title: L'architecture Transformer et l'attention
description: Comprendre, sans formalisme excessif, comment un LLM traite une séquence de tokens et génère du texte, token après token.
duration: 60
objectives:
  - Expliquer le principe de la génération autorégressive
  - Décrire le mécanisme d'attention (requêtes, clés, valeurs)
  - Identifier les blocs d'un Transformer de type décodeur
  - Relier l'architecture à des conséquences pratiques (coût du contexte, cache KV, latence)
---

# Un LLM prédit le token suivant

Un LLM génératif est, fondamentalement, une fonction qui prend une séquence de tokens et renvoie une **distribution de probabilités** sur le token suivant. Pour produire une réponse entière, on répète l'opération : on choisit un token, on l'ajoute à la séquence, et on recommence. C'est la **génération autorégressive**.

```diagram
type: flow
title: Génération autorégressive
loop: On recommence jusqu'à un token de fin ou une limite de longueur
steps:
  - title: Séquence
    text: "« Le chat dort sur le »"
  - title: Modèle
    text: Calcule une probabilité pour chaque token du vocabulaire
  - title: Choix
    text: "« canapé » (selon la stratégie d'échantillonnage)"
  - title: Ajout
    text: "« Le chat dort sur le canapé »"
```

Conséquences directes :

- La génération est **séquentielle** : produire 500 tokens demande 500 étapes. C'est pourquoi les réponses longues prennent du temps, et pourquoi on les **diffuse en continu** (*streaming*) à l'utilisateur.
- Le modèle n'a pas de « plan » caché écrit quelque part : chaque token est choisi en fonction de tout ce qui précède. Lui demander de **réfléchir étape par étape** avant de répondre lui donne littéralement plus de tokens pour calculer (module 4).

# Le mécanisme d'attention

L'architecture **Transformer** a été introduite en 2017 dans l'article *Attention Is All You Need* (Vaswani et al.), pour la traduction automatique. Elle est devenue la base de pratiquement tous les LLM.

Son ingrédient clé est l'**auto-attention** (*self-attention*) : pour construire la représentation d'un token, le modèle regarde **tous les autres tokens** de la séquence et décide **lesquels sont pertinents**.

Exemple : dans « Le trophée ne rentre pas dans la valise car **il** est trop grand », pour interpréter « il », le modèle doit porter son attention sur « trophée » plutôt que sur « valise ».

```diagram
type: custom
name: attention-heatmap
caption: Poids d'attention illustratifs du token « il » vers les autres tokens. Plus la case est foncée, plus le token correspondant contribue à la nouvelle représentation de « il ».
```

## Requêtes, clés et valeurs

Pour chaque token, le modèle calcule trois vecteurs à partir de son embedding :

- une **requête** (*query*, Q) : « qu'est-ce que je cherche ? » ;
- une **clé** (*key*, K) : « qu'est-ce que je contiens ? » ;
- une **valeur** (*value*, V) : « quelle information je transmets ? ».

Le score d'attention entre deux tokens est le produit scalaire de la requête de l'un et de la clé de l'autre. Ces scores passent dans un **softmax** pour devenir des poids qui somment à 1, et la nouvelle représentation du token est la **moyenne pondérée des valeurs** :

> Attention(Q, K, V) = softmax(Q·Kᵀ / √d) · V

Le facteur √d (racine de la dimension des vecteurs) stabilise les calculs.

## Plusieurs têtes, plusieurs couches

- **Attention multi-têtes** : plusieurs mécanismes d'attention fonctionnent en parallèle, chacun pouvant capter un type de relation différent (syntaxe, coréférence, proximité…).
- **Masque causal** : dans un modèle génératif, un token ne peut regarder que les tokens **précédents**, jamais les suivants, puisqu'ils n'existent pas encore au moment de la génération.
- **Position** : l'attention en elle-même ignore l'ordre des tokens. On injecte donc une information de position. L'article original utilisait des encodages sinusoïdaux ; de nombreux modèles récents utilisent des encodages **rotatifs** (RoPE).

# Anatomie d'un Transformer décodeur

Les LLM génératifs actuels (familles GPT, Claude, Llama, Mistral, Gemini…) reposent sur des variantes de l'architecture **décodeur seul** (*decoder-only*). Les détails exacts des modèles propriétaires ne sont pas tous publiés, mais le schéma général est le suivant :

```diagram
type: layers
title: Un Transformer décodeur, de bas en haut
layers:
  - title: Sortie
    text: "Projection vers le vocabulaire puis softmax : probabilité de chaque token suivant"
  - title: Bloc Transformer × N
    text: "Empilé des dizaines de fois. Chaque bloc : attention multi-têtes masquée, puis réseau de neurones dense (feed-forward), avec connexions résiduelles et normalisation"
  - title: Embeddings + position
    text: Chaque token devient un vecteur, enrichi de l'information de position
  - title: Tokens d'entrée
    text: La séquence d'identifiants produite par le tokenizer
```

Les familles d'architectures Transformer :

| Famille | Principe | Exemples | Usage typique |
|---|---|---|---|
| Encodeur seul | Attention bidirectionnelle | BERT | Classification, embeddings |
| Décodeur seul | Attention causale, génération | GPT, Llama, Claude | LLM conversationnels |
| Encodeur-décodeur | Encode l'entrée, puis génère | T5, modèle original de 2017 | Traduction, résumé |

> [!NOTE]
> Beaucoup de modèles d'embeddings utilisés pour la recherche sémantique (module 5) sont issus de la famille **encodeur** : ils lisent tout le texte dans les deux sens et produisent un vecteur, sans rien générer.

# Conséquences pratiques pour l'ingénieur

Comprendre l'architecture permet d'expliquer des comportements que vous rencontrerez en production.

## Le coût du contexte

L'attention compare chaque token à tous les autres : dans sa forme standard, son coût de calcul croît **avec le carré** de la longueur de la séquence. Des optimisations (FlashAttention, variantes d'attention plus économes…) réduisent fortement ce coût en pratique, mais un long contexte reste **plus lent et plus cher** à traiter. D'où l'intérêt de n'envoyer au modèle que le contexte **utile**.

## Le cache KV et les deux phases de l'inférence

Lors de la génération, les clés et valeurs des tokens déjà traités ne changent pas : les moteurs d'inférence les gardent en mémoire (**cache KV**) pour ne pas les recalculer à chaque nouveau token. L'inférence comporte ainsi deux phases :

- le **pré-remplissage** (*prefill*) : tout le prompt est traité en parallèle, ce qui détermine en grande partie le **délai avant le premier token** (*time to first token*) ;
- le **décodage** : les tokens de sortie sont générés un par un, ce qui détermine le **débit** en tokens par seconde.

C'est aussi ce principe qui rend possible la **mise en cache des prompts** (*prompt caching*) proposée par les fournisseurs : si le début de votre prompt est identique d'une requête à l'autre, son traitement peut être réutilisé, ce qui réduit le coût et la latence (module 10).

## Contexte long : ce que la fenêtre ne garantit pas

Les fenêtres de contexte atteignent des centaines de milliers, voire un million de tokens. Mais **pouvoir** lire un long contexte ne signifie pas **bien l'exploiter** :

- les tests « aiguille dans une botte de foin » (retrouver une phrase isolée) sont faciles ; les tâches qui demandent de **relier** plusieurs informations dispersées se dégradent nettement avec la longueur ;
- des travaux ont montré un effet « **perdu au milieu** » (*lost in the middle*) : une information placée au milieu d'un long contexte est moins bien utilisée qu'au début ou à la fin ;
- la qualité peut baisser à mesure que le contexte se remplit de contenu peu pertinent (la « dégradation du contexte », module 7).

Conséquence : un long contexte ne remplace ni une bonne **recherche** (module 5) ni une bonne **ingénierie du contexte** (module 7). Placez les consignes et la question à un endroit stable (souvent après les documents), et ne mettez dans le contexte que ce qui sert.

## Le mélange d'experts (MoE)

Beaucoup de grands modèles récents utilisent une architecture à **mélange d'experts** (*Mixture of Experts*) : la couche feed-forward de chaque bloc est remplacée par plusieurs « experts » (des sous-réseaux), et un **routeur** choisit pour chaque token les quelques experts à activer (par exemple 2 sur 8, ou 8 sur 256).

- Le modèle a beaucoup de **paramètres au total** (sa « connaissance »), mais n'en **active** qu'une fraction par token : l'inférence coûte comme un modèle bien plus petit.
- En contrepartie, **tous** les paramètres doivent tenir en mémoire : un MoE de 47 milliards de paramètres dont 13 actifs calcule comme un modèle de 13 milliards mais occupe la mémoire d'un modèle de 47 milliards.

C'est une information utile quand vous choisissez un modèle à héberger vous-même (module 10) : regardez les deux chiffres, paramètres **actifs** (vitesse) et **totaux** (mémoire).

## Ce que l'architecture n'apporte pas

Un Transformer apprend des **régularités statistiques** dans ses données d'entraînement. Rien dans l'architecture ne garantit la **véracité** d'une sortie : un texte plausible n'est pas forcément exact. Cette limite fondamentale est à l'origine des **hallucinations**, étudiées au chapitre 3 de ce module.

# Exercices

## Exercice 1 : Calcul d'attention simplifié

Un token « il » a une requête q = (1 ; 0). Trois tokens précédents ont pour clés k₁ = (2 ; 0) (« trophée »), k₂ = (0 ; 1) (« valise ») et k₃ = (0 ; 0) (« le »). Calculez les scores q·kᵢ, puis les poids d'attention avec un softmax (on ignore le facteur √d). Quel token reçoit le plus d'attention ?

<details>
<summary>Voir la solution</summary>

- Scores : q·k₁ = 2, q·k₂ = 0, q·k₃ = 0.
- Softmax : e² ≈ 7,389 ; e⁰ = 1 ; e⁰ = 1. Somme ≈ 9,389.
- Poids : « trophée » ≈ 0,787, « valise » ≈ 0,107, « le » ≈ 0,107.

« trophée » reçoit environ 79 % de l'attention : la représentation de « il » sera dominée par la valeur associée à « trophée ».

</details>

## Exercice 2 : Expliquer une latence

Un utilisateur se plaint : « l'assistant met 4 secondes avant d'afficher le premier mot quand j'envoie un long document, puis le texte défile vite ». Expliquez ce comportement avec les notions de ce chapitre et proposez deux pistes d'amélioration.

<details>
<summary>Voir la solution</summary>

Le délai initial correspond à la phase de **pré-remplissage** : tout le document doit être traité avant de produire le premier token, et ce traitement croît avec la longueur du prompt. Le défilement rapide ensuite correspond à la phase de **décodage**, token par token.

Pistes : n'envoyer que les passages pertinents du document (recherche, découpage, voir le module 5) ; utiliser la **mise en cache du prompt** si le même document est interrogé plusieurs fois ; choisir un modèle plus rapide si la qualité le permet (à vérifier par une évaluation) ; afficher un indicateur de progression côté interface.

</details>

## Exercice 3 : Masque causal

Pourquoi un modèle génératif utilise-t-il un masque causal pendant l'entraînement, alors que BERT n'en utilise pas ?

<details>
<summary>Voir la solution</summary>

Un modèle génératif est entraîné à **prédire le token suivant**. S'il pouvait voir les tokens futurs pendant l'entraînement, il « tricherait » en recopiant la réponse et n'apprendrait rien d'utile pour la génération, où le futur n'existe pas encore. BERT, lui, est entraîné à retrouver des mots **masqués au milieu** d'un texte et à produire des représentations : il a besoin du contexte des deux côtés et n'est pas conçu pour générer de gauche à droite.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Le Transformer et l'attention
center: Un LLM prédit le token suivant ; l'attention décide quels tokens comptent pour chacun.
points:
  - icon: loop
    title: Génération autorégressive
    text: Un token à la fois, ajouté à la séquence ; d'où l'intérêt du streaming.
  - icon: eye
    title: L'auto-attention
    text: "softmax(Q·Kᵀ/√d)·V : chaque token pondère les autres selon leur pertinence."
  - icon: lock
    title: Le masque causal
    text: Un token ne voit que les tokens précédents, jamais les suivants.
  - icon: layers
    title: Décodeur seul
    text: Embeddings + position, N blocs (attention + MLP), puis projection vers le vocabulaire.
  - icon: clock
    title: Prefill et décodage
    text: Le prompt fixe le délai du premier token ; la sortie fixe le débit. Le cache KV accélère.
pitfall: "Croire que l'architecture garantit l'exactitude : elle produit du texte plausible, pas vérifié."
remember: "Un long contexte coûte plus cher et ralentit : n'envoyez que ce qui est utile."
```
