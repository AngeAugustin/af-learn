---
title: Réseaux de neurones et entraînement
description: Du neurone artificiel à l'entraînement par descente de gradient, avec un premier exemple en PyTorch.
duration: 60
objectives:
  - Décrire le fonctionnement d'un neurone artificiel et d'un réseau multicouche
  - Expliquer la fonction de perte, la descente de gradient et la rétropropagation
  - Identifier les hyperparamètres principaux d'un entraînement
  - Lire et écrire une boucle d'entraînement minimale en PyTorch
---

# Le neurone artificiel

Un **neurone artificiel** est une petite fonction mathématique. Il reçoit plusieurs nombres en entrée, les multiplie chacun par un **poids**, additionne le tout avec un **biais**, puis applique une **fonction d'activation** non linéaire.

```diagram
type: custom
name: neuron
caption: "Un neurone calcule y = f(w₁x₁ + w₂x₂ + w₃x₃ + b). Les poids w et le biais b sont les paramètres appris pendant l'entraînement."
```

Les fonctions d'activation les plus courantes :

| Fonction | Formule | Usage typique |
|---|---|---|
| ReLU | max(0, x) | Couches cachées, très répandue |
| Sigmoïde | 1 / (1 + e⁻ˣ) | Sortie d'une probabilité binaire |
| GELU | variante lisse de ReLU | Couches des Transformers (GPT, BERT…) |
| Softmax | transforme un vecteur en probabilités qui somment à 1 | Sortie multiclasse, et choix du token suivant dans un LLM |

**Pourquoi la non-linéarité ?** Sans elle, empiler des couches reviendrait à une seule transformation linéaire, incapable de représenter des relations complexes.

# Les réseaux multicouches

En organisant des neurones en **couches** successives, on obtient un **réseau de neurones**. Chaque couche transforme la représentation produite par la précédente.

```diagram
type: custom
name: neural-network
caption: Un réseau dense à deux couches cachées. Chaque flèche porte un poids ; un réseau moderne en compte des millions, voire des centaines de milliards.
```

- La **couche d'entrée** reçoit les données (par exemple des nombres décrivant un texte ou une image).
- Les **couches cachées** construisent des représentations de plus en plus abstraites.
- La **couche de sortie** produit la prédiction.

On parle d'**apprentissage profond** (*deep learning*) lorsque le réseau compte de nombreuses couches. Les LLM sont des réseaux profonds d'une architecture particulière, le **Transformer**, que nous étudierons au module 3.

# Apprendre : perte, gradient, rétropropagation

Entraîner un réseau consiste à trouver les valeurs des paramètres qui minimisent les erreurs. On procède en boucle :

```diagram
type: flow
title: La boucle d'entraînement
loop: Répété sur de nombreux lots de données (époques)
steps:
  - title: Prédiction
    text: Passe avant sur un lot d'exemples
  - title: Perte
    text: Mesure l'écart avec les réponses attendues
  - title: Gradients
    text: "Rétropropagation : sensibilité de la perte à chaque paramètre"
  - title: Mise à jour
    text: Chaque paramètre bouge un peu dans la direction qui réduit la perte
```

## La fonction de perte

La **perte** (*loss*) est un nombre qui mesure à quel point les prédictions sont mauvaises. Les plus courantes :

- **erreur quadratique moyenne** (MSE) pour la régression ;
- **entropie croisée** (*cross-entropy*) pour la classification. C'est aussi la perte utilisée pour entraîner les LLM : elle pénalise le modèle quand il attribue une faible probabilité au vrai token suivant.

## La descente de gradient

Le **gradient** indique, pour chaque paramètre, dans quel sens et avec quelle intensité la perte varie quand ce paramètre change. La **descente de gradient** déplace chaque paramètre d'un petit pas dans la direction opposée au gradient :

> nouveau paramètre = paramètre − taux d'apprentissage × gradient

Le **taux d'apprentissage** (*learning rate*) règle la taille des pas : trop grand, l'entraînement diverge ; trop petit, il est extrêmement lent.

## La rétropropagation

La **rétropropagation** (*backpropagation*) est l'algorithme qui calcule efficacement tous les gradients d'un réseau, de la sortie vers l'entrée, en appliquant la règle de dérivation des fonctions composées. Les bibliothèques modernes comme PyTorch la réalisent **automatiquement** (différentiation automatique) : il suffit d'appeler `loss.backward()`.

## Les hyperparamètres

Ce sont les réglages choisis **avant** l'entraînement, et non appris :

| Hyperparamètre | Rôle |
|---|---|
| Taux d'apprentissage | Taille des pas de mise à jour |
| Taille de lot (*batch size*) | Nombre d'exemples traités avant chaque mise à jour |
| Nombre d'époques | Nombre de passages sur l'ensemble des données |
| Architecture | Nombre de couches, de neurones, type d'activation |
| Optimiseur | Variante de la descente de gradient (SGD, Adam, AdamW…) |

> [!NOTE]
> **AdamW** est l'optimiseur le plus utilisé pour entraîner et affiner les Transformers. Vous le retrouverez dans les configurations de fine-tuning au module 11.

# Un premier entraînement avec PyTorch

[PyTorch](https://pytorch.org/) est la bibliothèque d'apprentissage profond la plus utilisée dans la recherche et l'industrie. Voici un réseau qui apprend à classer des points en deux catégories selon qu'ils sont à l'intérieur ou à l'extérieur d'un cercle : une frontière **non linéaire**.

```python
import torch
from torch import nn

torch.manual_seed(0)

# Données : 1 000 points dans le carré [-1, 1]², étiquette 1 si dans le cercle de rayon 0,7
X = torch.rand(1000, 2) * 2 - 1
y = ((X ** 2).sum(dim=1) < 0.49).float().unsqueeze(1)

X_train, y_train = X[:800], y[:800]
X_val, y_val = X[800:], y[800:]

modele = nn.Sequential(
    nn.Linear(2, 16),
    nn.ReLU(),
    nn.Linear(16, 16),
    nn.ReLU(),
    nn.Linear(16, 1),  # un logit ; la sigmoïde est incluse dans la perte
)

perte_fn = nn.BCEWithLogitsLoss()
optimiseur = torch.optim.AdamW(modele.parameters(), lr=0.01)

for epoque in range(200):
    modele.train()
    optimiseur.zero_grad()              # 1. remettre les gradients à zéro
    logits = modele(X_train)            # 2. passe avant
    perte = perte_fn(logits, y_train)   # 3. calcul de la perte
    perte.backward()                    # 4. rétropropagation
    optimiseur.step()                   # 5. mise à jour des paramètres

    if epoque % 50 == 0:
        modele.eval()
        with torch.no_grad():
            pred_val = (modele(X_val) > 0).float()
            exactitude = (pred_val == y_val).float().mean().item()
        print(f"époque {epoque:3d}  perte {perte.item():.3f}  exactitude val {exactitude:.1%}")
```

Les cinq lignes commentées de la boucle constituent le **squelette de tout entraînement PyTorch**, du petit réseau ci-dessus jusqu'au fine-tuning d'un LLM. Ici, pour simplifier, chaque époque traite tout le jeu d'entraînement en un seul lot ; en pratique, on itère sur des mini-lots avec un `DataLoader`.

> [!TIP]
> Vous n'aurez probablement jamais à entraîner un LLM de zéro : cela coûte des millions de dollars de calcul. Mais comprendre cette boucle vous permettra de lire une configuration de fine-tuning, d'interpréter une courbe de perte et de dialoguer avec des ML Engineers.

# Exercices

## Exercice 1 : Calcul d'un neurone

Un neurone a pour poids w = (0,5 ; −1 ; 2), un biais b = 0,1 et une activation ReLU. Calculez sa sortie pour l'entrée x = (2 ; 1 ; 0,5), puis pour x = (0 ; 3 ; 0,5).

<details>
<summary>Voir la solution</summary>

- Entrée (2 ; 1 ; 0,5) : 0,5×2 − 1×1 + 2×0,5 + 0,1 = 1 − 1 + 1 + 0,1 = 1,1 → ReLU(1,1) = **1,1**.
- Entrée (0 ; 3 ; 0,5) : 0 − 3 + 1 + 0,1 = −1,9 → ReLU(−1,9) = **0**.

</details>

## Exercice 2 : Un pas de descente de gradient

Un paramètre vaut 3. Le gradient de la perte par rapport à ce paramètre vaut 4. Avec un taux d'apprentissage de 0,1, quelle est la nouvelle valeur ? Et avec un taux de 1 ?

<details>
<summary>Voir la solution</summary>

- Taux 0,1 : 3 − 0,1 × 4 = **2,6**.
- Taux 1 : 3 − 1 × 4 = **−1**. Un pas aussi grand risque de « sauter » par-dessus le minimum : c'est l'un des mécanismes qui font diverger un entraînement quand le taux d'apprentissage est trop élevé.

</details>

## Exercice 3 : Expérimenter

Exécutez le code PyTorch du cours (`pip install torch`), puis :

1. remplacez les deux `nn.ReLU()` par rien (supprimez-les) : que devient l'exactitude ? Pourquoi ?
2. remettez les activations et passez le taux d'apprentissage à `1.0` : qu'observez-vous ?

<details>
<summary>Voir la solution</summary>

1. Sans activation, le réseau devient une simple fonction **linéaire** : il ne peut tracer qu'une frontière droite et ne sait pas séparer l'intérieur d'un cercle. L'exactitude reste limitée, souvent proche de la proportion de la classe majoritaire (environ 62 % des points sont hors du cercle).
2. Avec un taux d'apprentissage trop élevé, la perte oscille ou stagne au lieu de décroître régulièrement : les pas sont trop grands. Les valeurs exactes varient selon l'exécution, mais l'entraînement est nettement moins stable.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Réseaux de neurones et entraînement
center: Un réseau apprend en ajustant ses poids pour réduire la perte, pas après pas.
points:
  - icon: brain
    title: Le neurone
    text: Somme pondérée des entrées plus un biais, puis une activation non linéaire.
  - icon: network
    title: Des couches empilées
    text: Entrée, couches cachées, sortie ; la non-linéarité permet de modéliser le complexe.
  - icon: target
    title: La fonction de perte
    text: Elle mesure l'erreur ; l'entropie croisée sert aussi à entraîner les LLM.
  - icon: compass
    title: La descente de gradient
    text: paramètre ← paramètre − taux d'apprentissage × gradient, calculé par rétropropagation.
  - icon: loop
    title: La boucle PyTorch
    text: zero_grad → passe avant → perte → backward → step. Toujours le même squelette.
pitfall: "Choisir un taux d'apprentissage trop élevé : l'entraînement devient instable ou diverge."
remember: Comprendre la boucle d'entraînement suffit pour lire une configuration de fine-tuning et une courbe de perte.
```
