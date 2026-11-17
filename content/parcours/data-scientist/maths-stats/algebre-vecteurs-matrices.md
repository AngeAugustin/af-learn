---
title: Vecteurs, matrices et jeux de données
description: Lire un individu comme un vecteur, un jeu de données comme une matrice, et donner un sens au produit scalaire, à la multiplication et à la norme.
duration: 60
objectives:
  - Décrire un individu par un vecteur et un tableau par une matrice
  - Interpréter un produit scalaire comme une somme de contributions
  - Prévoir la forme du résultat d'une multiplication matrice par vecteur
  - Expliquer pourquoi une norme sur des unités mélangées peut tromper
---

# Un individu est un vecteur

Un **vecteur** est une liste ordonnée de nombres. L'ordre fait partie du sens. Décrire un client par (34 ans, 2 800 € de revenu, 5 achats) n'est pas la même chose que (2 800, 34, 5) : le modèle lirait un âge de 2 800 ans.

Vous écrirez ce client :

```text
x = (34, 2800, 5)
```

Trois coordonnées, toujours dans le même ordre : âge, revenu mensuel, nombre d'achats sur 90 jours. Un second client, (52, 4 100, 2), est un autre point dans le **même** repère. Vous pouvez les comparer parce que la première case veut dire la même chose pour les deux.

Ce n'est pas encore de la géométrie savante. C'est un contrat de colonnes. Le jour où une ligne n'a que deux nombres, elle n'est plus un vecteur de ce repère : il manque une coordonnée, et les opérations du chapitre refusent de deviner.

Dans NumPy, ce contrat est la forme `(3,)`. Vous l'avez vu au chapitre précédent. Ici, vous gardez l'image : **une ligne du tableau, une personne, un vecteur**.

```video
url: https://www.youtube.com/watch?v=fNk_zzaMoSs
title: "Vectors | Chapter 1, Essence of linear algebra"
channel: "3Blue1Brown"
duration: "9:52"
lang: en
why: "Le premier épisode de la série de 3Blue1Brown sur l'algèbre linéaire : ce qu'est un vecteur, vu à la fois comme une liste de nombres et comme une flèche."
```

# Le produit scalaire, somme de contributions

Le **produit scalaire** de deux vecteurs de même longueur additionne les produits case par case. Avec des poids `w = (0,02, 0,001, 0,4)` :

```text
score = 0,02 × 34 + 0,001 × 2 800 + 0,4 × 5
      = 0,68 + 2,80 + 2,00
      = 5,48
```

Chaque terme est une **contribution**. L'âge apporte 0,68, le revenu 2,80, les achats 2,00. Le score 5,48 n'est pas une probabilité : c'est une somme pondérée, dans l'unité que les poids définissent. Si vous vouliez un score entre 0 et 1, il faudrait une autre transformation, plus loin dans le parcours. Ne lisez pas 5,48 comme « 548 % ».

Le même calcul s'écrit `x @ w`. Il exige la **même longueur**. Un poids oublié (un vecteur de deux cases) n'a pas de produit scalaire avec un client de trois cases. L'erreur est saine.

Deux lectures suffisent pour la suite :

- **Lecture métier** : le score est la somme de ce que chaque variable apporte. Si le revenu pèse 2,80 sur 5,48, il porte environ la moitié du score de ce client (2,80 / 5,48 ≈ **51 %**).
- **Lecture géométrique, en une phrase** : le produit scalaire est positif quand les deux vecteurs pointent grossièrement dans le même sens, nul quand ils sont orthogonaux, négatif quand ils s'opposent. Vous n'avez pas besoin de l'angle pour entraîner un premier modèle. Vous en avez besoin pour ne pas confondre `*` (produit case par case) et `@` (somme de ces produits).

| Opération | (0,2, 0,5, 0,3) et (12, 15, 10) | Résultat |
|---|---|---|
| Produit case par case | 0,2×12 , 0,5×15 , 0,3×10 | (2,4 , 7,5 , 3,0) |
| Produit scalaire | 2,4 + 7,5 + 3,0 | **13,0** |

La moyenne simple des notes serait (12 + 15 + 10) / 3 = **12,3**. Le produit scalaire avec ces poids donne **13,0**, parce que la note 15 pèse davantage (poids 0,5). Les deux chiffres sont justes. Ils ne répondent pas à la même question.

# Une matrice est un tableau rectangulaire

Une **matrice** est un rectangle de nombres. Les lignes ont toutes la même longueur. Dans un jeu de données, une ligne est un individu et une colonne est une variable.

Trois clients, trois variables :

```text
        âge    revenu    achats
X =  [[  34 ,   2800 ,     5  ],
      [  52 ,   4100 ,     2  ],
      [  21 ,   1900 ,     9  ]]
```

`X` a la forme **(3, 3)** : 3 lignes, 3 colonnes. La première ligne est le vecteur du premier client. La deuxième colonne est le revenu des trois clients, (2 800, 4 100, 1 900). Moyenne des revenus : (2 800 + 4 100 + 1 900) / 3 = **2 933 €**. Vous venez de résumer une colonne, pas de « multiplier la matrice ».

Le rectangle est exigeant.

- Une case vide casse le rectangle numérique. Vous la retirez, ou vous la remplissez, avant les multiplications. Le traitement des manquants a son chapitre. Ici, retenez qu'un trou n'est pas un zéro : zéro achat veut dire « aucun achat », pas « information absente ».
- Une case texte (`"Lyon"`) n'est pas un nombre. Tant qu'elle n'est pas codée, elle n'entre pas dans `X`. La matrice est la **vue numérique** du tableau, pas le fichier brut.
- Ajouter un client ajoute une ligne. Ajouter une variable (l'ancienneté, en mois) ajoute une colonne, et **tous** les poids doivent suivre : le vecteur `w` passe de 3 cases à 4.

```diagram
type: layers
title: Du fichier à la matrice
layers:
  - title: Fichier brut
    text: Dates, textes, trous, unités mélangées
  - title: Colonnes nommées
    text: Une variable par colonne, une personne par ligne
  - title: Matrice numérique
    text: Rectangle de nombres, forme (n, p), prêt à être multiplié
```

# Multiplier, c'est enchaîner des produits scalaires

Multiplier la matrice `X`, forme `(3, 3)`, par le vecteur de poids `w = (0,02, 0,001, 0,4)`, forme `(3,)`, produit **un score par client**. Le résultat a la forme `(3,)`.

```text
client 1 : 0,02×34 + 0,001×2800 + 0,4×5 = 0,68 + 2,80 + 2,00 = 5,48
client 2 : 0,02×52 + 0,001×4100 + 0,4×2 = 1,04 + 4,10 + 0,80 = 5,94
client 3 : 0,02×21 + 0,001×1900 + 0,4×9 = 0,42 + 1,90 + 3,60 = 5,92
```

La règle de forme tient en une phrase : les dimensions **du milieu** doivent coïncider. `(3, 3)` contre `(3,)` : le 3 des colonnes colle au 3 des poids, il reste le 3 des lignes. Vous obtenez 3 scores.

`(3, 3)` contre un vecteur de **2** poids est impossible. Il manquerait un poids, ou vous auriez oublié une colonne. NumPy lève une erreur. Si vous forcez mentalement, vous ne savez plus quelle colonne est multipliée par quel poids.

Cas fréquent : `X` de forme `(n, p)` et `w` de forme `(p,)`, résultat `(n,)`. Avec **n = 18 400** clients et **p = 12** variables, la multiplication fabrique 18 400 scores. Chaque score est le produit scalaire d'une ligne avec les mêmes poids. C'est exactement ce que fait un **modèle linéaire** : les mêmes coefficients pour tout le monde, une prédiction par ligne.

Ajouter un intercept (un terme constant, par exemple +1,5 sur chaque score) revient à coller une colonne de 1 dans `X`, ou à ajouter le constant après coup. Les trois scores deviennent alors 6,98 , 7,44 et 7,42. Le constant ne change pas le classement de ce petit exemple (le client 2 reste devant), mais il décale le niveau. Vous le traiterez comme un paramètre, pas comme une décoration.

# La norme mesure une longueur

La **norme** euclidienne d'un vecteur est la longueur de la flèche qui va de l'origine à ce point. Elle vaut la racine du produit scalaire du vecteur avec lui-même.

```text
v = (3, 4)
norme = racine(3×3 + 4×4) = racine(9 + 16) = racine(25) = 5
```

Pour deux clients, on mesure souvent la norme de leur **différence** : une distance. Après avoir mis les variables à une échelle comparable (par exemple en écarts types), les clients

```text
a = (0,2 , 1,5 , -0,4)
b = (0,2 , 0,3 , -0,4)
```

diffèrent de `(0 , 1,2 , 0)`. La distance vaut **1,2**. Un seul axe les sépare, de 1,2 écart type. C'est lisible.

Sans cette mise à l'échelle, les unités écrasent le sens. Reprenez les clients bruts (34 ans, 2 800 €, 5 achats) et (40 ans, 2 900 €, 5 achats). La différence est `(6 , 100 , 0)`.

```text
distance = racine(6×6 + 100×100 + 0) = racine(36 + 10 000) = racine(10 036) ≈ 100,2
```

Les 6 ans d'écart contribuent 36 sous la racine, les 100 € contribuent 10 000. L'âge pèse pour moins de **0,2** sur une distance de 100. Le modèle « du plus proche voisin » qui utiliserait cette distance brute déciderait presque uniquement sur le revenu, même si vous croyiez avoir trois variables.

Ce n'est pas une raison d'abandonner la norme. C'est une raison de **rendre les colonnes comparables** avant de l'interpréter comme une proximité. Un écart de 1 sur une colonne standardisée veut dire « un écart type », qu'il s'agisse d'années ou d'euros.

> [!WARNING]
> Une distance calculée sur des colonnes brutes (euros, années, compteurs) raconte surtout l'histoire de la colonne dont les nombres sont les plus grands.

# Un jeu de données est une matrice

Mettre bout à bout les sections précédentes donne la phrase du métier : **un jeu de données prêt pour un modèle linéaire est une matrice**.

- **n lignes**, une par décision ou par individu. 18 400 biens, 18 400 lignes.
- **p colonnes numériques**, une par variable d'entrée. Surface, étage, distance au métro en minutes : p = 3, forme `(18400, 3)`.
- **Un vecteur cible** de forme `(n,)`, par exemple les loyers en euros, à part, pas mélangé dans `X`. Si le loyer reste dans `X`, le modèle triche : il « prédit » le loyer à partir du loyer.
- **Un vecteur de poids** de forme `(p,)`, ou `(p + 1,)` avec le constant. La prédiction est le produit `X @ w`.

Mini tableau, pour vérifier que vous tenez les formes :

| Objet | Exemple | Forme | Rôle |
|---|---|---|---|
| Matrice `X` | 3 clients, âge, revenu, achats | (3, 3) | Entrées |
| Poids `w` | (0,02 , 0,001 , 0,4) | (3,) | Paramètres |
| Scores | (5,48 , 5,94 , 5,92) | (3,) | Prédictions |
| Cible `y` | loyers ou défauts, jamais dans `X` | (3,) | Ce qu'on cherche à approcher |

Le fichier CSV d'origine n'est pas encore cette matrice. Il a une date en texte, un code postal, un trou à la ligne 14. Le passage de l'un à l'autre est le travail de préparation. L'algèbre dit seulement ce que le modèle **verra** : un rectangle, des poids de même largeur que le rectangle, un score par ligne.

Gardez un réflexe de contrôle, sur un extrait de **3 lignes** calculé à la main, avant de lancer les 18 400. Si le score manuel du premier client n'est pas 5,48 avec ces poids, la colonne a été permutée. Mieux vaut le voir sur 3 lignes que dans un rapport déjà envoyé.

# Exercices

## Exercice 1 : Lire un score

Un prospect est décrit par `x = (2, 40, 1)` : 2 ans d'ancienneté, 40 pages vues, 1 achat passé. Les poids sont `w = (0,5 , 0,1 , 3)`.

1. Calculez le produit scalaire.
2. Quelle variable contribue le plus, et pour quelle part du score ?
3. Pourquoi ne peut-on pas utiliser `w = (0,5 , 0,1)` ?

<details>
<summary>Voir la solution</summary>

1. 0,5 × 2 + 0,1 × 40 + 3 × 1 = 1 + 4 + 3 = **8**.
2. Les pages vues contribuent **4** sur 8, soit **50 %**. L'ancienneté contribue 1, l'achat passé contribue 3.
3. Le prospect a **3** coordonnées et ce poids n'en a que 2. Le produit scalaire n'est pas défini : on ne saurait pas quelle variable reste sans poids.

</details>

## Exercice 2 : Forme du produit

`X` a **200** lignes et **6** colonnes. `w` a 6 composantes.

1. Quelle est la forme de `X @ w` ?
2. Que se passe-t-il si une septième colonne (le code de réduction, encore en texte) est collée à `X` sans étendre `w` ?
3. Vous ajoutez un intercept en collant une colonne de 1. Quelle est la nouvelle forme de `X`, et combien de composantes doit avoir `w` ?

<details>
<summary>Voir la solution</summary>

1. Forme **(200,)** : un score par ligne. Les 6 colonnes se contractent avec les 6 poids.
2. `X` passe à la forme (200, 7) et `w` reste en (6,). Les dimensions du milieu (7 et 6) ne coïncident pas : la multiplication est refusée. Il faut coder la colonne et lui donner un poids, ou ne pas l'ajouter.
3. `X` devient **(200, 7)**. `w` doit avoir **7** composantes (les 6 variables plus le poids du constant).

</details>

## Exercice 3 : Une distance qui ment

Deux appartements sont comparés sur (surface en m², loyer en €), sans mise à l'échelle :

- A = (30 , 900)
- B = (90 , 2 400)

1. Écrivez le vecteur différence B − A.
2. Calculez sa norme euclidienne (laissez la racine, puis donnez une approximation).
3. La surface a triplé, de 30 m² à 90 m². Pourquoi la distance parle-t-elle presque seulement du loyer ?

<details>
<summary>Voir la solution</summary>

1. (90 − 30 , 2 400 − 900) = **(60 , 1 500)**.
2. Racine(60 × 60 + 1 500 × 1 500) = racine(3 600 + 2 250 000) = racine(2 253 600) ≈ **1 501**.
3. Sous la racine, les 60 m² ne pèsent que 3 600, contre 2 250 000 pour les 1 500 €. La norme vaut essentiellement 1 500. Un écart de surface pourtant majeur (du simple au triple) disparaît à côté d'euros bruts. Il faut comparer des écarts standardisés, pas additionner des m² et des euros.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Vecteurs et matrices
center: Une ligne est un vecteur, le tableau numérique est une matrice, le score est un produit.
points:
  - icon: list
    title: L'ordre des cases
    text: (34 ans, 2 800 €, 5 achats) n'est pas (2 800, 34, 5). La position donne le sens.
  - icon: scale
    title: Produit scalaire
    text: Somme des produits case par case. Chaque terme est la contribution d'une variable au score.
  - icon: layers
    title: Le rectangle
    text: "n individus, p variables : forme (n, p). Un trou n'est pas un zéro, un texte n'est pas un nombre."
  - icon: zap
    title: X @ w
    text: Les colonnes doivent coller aux poids. Le résultat a une case par ligne, pas par variable.
  - icon: ruler
    title: Norme et unités
    text: La longueur de (3, 4) vaut 5. Sur des euros bruts mélangés à des années, un axe écrase l'autre.
pitfall: Laisser la cible dans la matrice d'entrée. Le modèle récite alors le loyer au lieu de le prédire.
remember: Contrôlez un score à la main sur 3 lignes avant de multiplier les 18 400.
```
