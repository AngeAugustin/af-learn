---
title: Coût, gradient et descente
description: Diminuer une fonction de coût par descente de gradient, choisir un pas d'apprentissage, et relier chaque pas à l'entraînement d'un modèle linéaire.
duration: 60
objectives:
  - Lire une fonction de coût comme une erreur moyenne à diminuer
  - Interpréter le gradient comme la pente qui indique la direction de montée
  - Distinguer un pas d'apprentissage trop petit, adapté ou divergent sur un exemple calculable
  - Relier une mise à jour de descente aux paramètres d'un modèle linéaire
---

# La fonction de coût, une note d'erreur

Un modèle dépend de paramètres. Tant que vous ne dites pas **ce qu'il en coûte** de se tromper, vous ne pouvez pas choisir ces paramètres. La **fonction de coût** (ou perte) transforme les erreurs en un nombre. Vous cherchez les paramètres qui rendent ce nombre petit.

Prenons quatre logements, en unités codées pour que le calcul tienne sur une page. La surface codée vaut 1, 2, 3, 4 (pensez 25, 50, 75 et 100 m²). Le loyer codé vaut 3, 5, 7, 8 (pensez 600, 1 000, 1 400 et 1 600 €, soit 200 € par unité).

```text
x :  1    2    3    4
y :  3    5    7    8
```

Le modèle linéaire sans avoir encore bougé, `ŷ = b + w x`, démarre à b = 0 et w = 0. Il prédit **0** partout. Les erreurs sont 3, 5, 7 et 8.

L'erreur quadratique moyenne, notée J, moyenne les carrés :

```text
J(0, 0) = (3² + 5² + 7² + 8²) / 4
        = (9 + 25 + 49 + 64) / 4
        = 147 / 4
        = 36,75
```

Racine(36,75) ≈ **6,1** unités codées, soit environ 6,1 × 200 = **1 220 €** d'erreur typique. C'est le coût d'un modèle qui répond toujours zéro. Le carré punit davantage une erreur de 8 qu'une erreur de 3 : 64 contre 9, alors que 8 n'est pas « 64 fois plus grave » en euros. Vous assumez ce choix parce que le carré est lisse et se dérive bien. Une erreur absolue moyenne dirait autre chose (ici (3+5+7+8)/4 = **5,75** unités). Les deux sont des coûts. On n'en minimise qu'un à la fois, et on le nomme.

Le paysage de J, pour ce modèle et ce coût quadratique, est une **cuvette**. Il y a un fond, pas une falaise ni deux vallées. Le fond, pour ces quatre points, se trouve vers **b ≈ 1,5** et **w ≈ 1,7**, où J tombe vers **0,075**. Vous n'avez pas besoin de le deviner : la descente va marcher vers lui. Le connaître à l'avance sert seulement de contrôle, sur un jouet de quatre lignes.

# Le gradient indique la montée

Le **gradient** est la pente de J par rapport à chaque paramètre. Une composante **positive** dit : si j'augmente ce paramètre, le coût monte. Une composante **négative** dit : si j'augmente ce paramètre, le coût descend. Pour faire baisser J, vous irez donc **à l'opposé** du gradient.

Pour l'erreur quadratique moyenne `J = moyenne( (y − ŷ)² )` avec `ŷ = b + w x`, les pentes à un point (b, w) valent :

```text
∂J/∂b = (−2 / n) × somme( y − ŷ )
∂J/∂w = (−2 / n) × somme( (y − ŷ) × x )
```

Au départ, ŷ = 0, n = 4, les erreurs y − ŷ sont 3, 5, 7, 8.

```text
∂J/∂b = (−2 / 4) × (3 + 5 + 7 + 8) = (−0,5) × 23 = −11,5
∂J/∂w = (−2 / 4) × (3×1 + 5×2 + 7×3 + 8×4)
       = (−0,5) × (3 + 10 + 21 + 32)
       = (−0,5) × 66
       = −33
```

Les deux pentes sont négatives. Augmenter b et augmenter w **diminue** le coût : le modèle qui prédit zéro est trop bas sur les quatre loyers, et il est d'autant plus trop bas que la surface grandit (l'erreur 8 est sur x = 4). Le gradient (−11,5 , −33) pointe vers la montée. Le pas utile pointe vers (+11,5 , +33), puis on le dosera.

```diagram
type: flow
title: Un pas de descente
steps:
  - title: Prédictions
    text: ŷ = b + w x sur les 4 lignes
    tone: blue
  - title: Coût
    text: Moyenne des carrés des erreurs
    tone: violet
  - title: Gradient
    text: Pente pour b et pente pour w
    tone: amber
  - title: Mise à jour
    text: Paramètre moins pas fois pente
    tone: teal
```

Sur une fonction d'**une** seule variable, le gradient est un simple nombre, la dérivée. C'est le bon terrain pour voir le pas d'apprentissage sans se perdre dans deux coordonnées. On y vient, puis on revient au loyer.

# Descendre pas à pas

La **descente de gradient** répète la même consigne : là où vous êtes, calculez la pente, faites un pas dans le sens de la descente, recommencez.

```text
nouveau paramètre = ancien − α × pente
```

α (alpha) est le **pas d'apprentissage**. Il dit de quelle fraction de la pente vous avancez. Le signe moins est le « sens inverse de la montée ». Si la pente vaut −4 et que α vaut 0,1, vous retranchez 0,1 × (−4), donc vous **ajoutez** 0,4. Le double signe est l'endroit où les mises à jour se trompent le plus souvent. Écrivez-le.

Image de marche. Vous êtes sur un sentier, de nuit, avec une lampe qui n'éclaire que vos pieds. Vous sentez de quel côté le sol monte. Vous faites un pas vers le bas. Vous ne voyez pas la vallée entière. Vous n'avez besoin que de la pente locale, et d'un pas qui ne vous envoie pas de l'autre côté du creux.

Pour le jouet à une variable `J(w) = (w − 2)²`, le fond est en w = 2, et J y vaut 0. La pente vaut `2 × (w − 2)`. En w = 0, la pente vaut 2 × (0 − 2) = **−4**.

Avec α = 0,1 :

```text
départ w = 0
pas 1 : w = 0 − 0,1 × (−4) = 0,40     pente suivante = 2×(0,40−2) = −3,2
pas 2 : w = 0,40 − 0,1 × (−3,2) = 0,72
pas 3 : w = 0,72 − 0,1 × (−2,56) = 0,976
pas 4 : pente = −2,048, donc w = 0,976 + 0,205 = 1,181
```

Le paramètre monte vers 2, sans le dépasser dans ces quatre pas. Chaque pente est plus petite en valeur absolue : la cuvette s'aplatit près du fond, les pas raccourcissent tout seuls si α reste fixe. C'est le comportement que vous espérez.

```video
url: https://www.youtube.com/watch?v=sDv4f4s2SB8
title: "Gradient Descent, Step-by-Step"
channel: "StatQuest with Josh Starmer"
duration: "23:54"
lang: en
why: "StatQuest déroule la descente de gradient pas à pas, sur un exemple calculé à la main."
```

# Le pas d'apprentissage

Le même départ w = 0, pente −4, avec d'autres pas, raconte les trois régimes.

| Pas α | Premier w | Ce qui se passe ensuite |
|---|---:|---|
| 0,01 | 0,04 | Vous avancez de 0,04 alors que le fond est à 2. Il faudra une longue suite de pas. |
| 0,1 | 0,40 | Descente régulière vers 2, vue plus haut (0,40 puis 0,72 puis 0,976). |
| 0,5 | 2,00 | Un seul pas tombe sur le fond, parce que cette cuvette est un carré parfait. |
| 1 | 4,00 | w passe de 0 à 4. La pente en 4 vaut +4, le pas suivant ramène à 0. Oscillation 0, 4, 0, 4. |
| 1,2 | 4,80 | Puis w ≈ −1,9, puis ≈ 7,5. Les pas grandissent. Le coût s'envole. |

Le cas α = 0,5 est un cadeau de cette fonction précise, dont la courbure vaut 2. Ne comptez pas sur un pas « qui tombe juste » pour un vrai modèle. Retenez les régimes, pas la valeur magique.

- **Trop petit** : le coût baisse, mais vous vous arrêtez par impatience après 30 pas alors que w n'est qu'à 0,5. Le modèle paraît faible. C'est le pas qui est timide.
- **Adapté** : le coût baisse à chaque pas, de moins en moins vite, et les paramètres se stabilisent.
- **Trop grand** : les paramètres sautent par-dessus le fond. Soit ils oscillent (0 et 4), soit ils divergent (4,8 puis plus loin). Le coût du pas 5 est **pire** que le coût du pas 1.

```diagram
type: compare
title: Trois pas, trois régimes
columns:
  - title: Pas trop petit
    tone: blue
    items:
      - α = 0,01 sur (w − 2)²
      - Premier déplacement 0,04
      - Coût en baisse, fond encore loin
  - title: Pas adapté
    tone: teal
    items:
      - α = 0,1
      - 0 puis 0,40 puis 0,72
      - On se rapproche de 2 sans le sauter
  - title: Pas trop grand
    tone: rose
    items:
      - α = 1 oscille entre 0 et 4
      - α = 1,2 s'éloigne (4,8 puis au-delà)
      - Le coût finit par monter
```

En pratique, vous tracez J après chaque pas, ou après chaque passage sur les données. Une courbe qui descend puis remonte est un pas trop grand. Une courbe presque plate dès le début, avec des paramètres immobiles, est un pas trop petit, ou un gradient faux (signe inversé, oubli du moins dans la mise à jour).

# Le minimum local, une image

Revenez à la lampe qui n'éclaire que vos pieds. Le sentier peut avoir une **cuvette secondaire** avant la vraie vallée. Vous descendez, la pente devient nulle, vous vous arrêtez. À deux kilomètres, un fond plus bas existe. Votre règle locale ne le voit pas. C'est un **minimum local** : le coût est plus bas que juste à côté, sans être le plus bas possible.

Image chiffrée, à prendre comme un relief et non comme un modèle du cours. Une cuvette autour de w = 1, dont le fond vaut J = 3. Une vallée autour de w = 5, dont le fond vaut J = 0,4. Vous partez de w = 0. La pente vous mène dans la cuvette à 3, et s'y annule. Vous annoncez « coût 3 » alors qu'un autre départ, plus près de 5, aurait atteint 0,4. Le paysage, pas la définition du coût, a décidé.

Pour la **régression linéaire** avec **erreur quadratique**, ce piège n'a pas lieu. Le coût est une cuvette unique (on dit convexe) : tout minimum local est le minimum global. Sur les quatre loyers, le fond vers b ≈ 1,5 et w ≈ 1,7 est **le** fond, pas un palier trompeur. Si votre descente s'arrête plus haut, cherchez le pas ou un bug de gradient, pas « une mauvaise cuvette ».

Les cuvettes multiples apparaissent avec des modèles plus souples, plus loin dans le parcours. L'image du sentier sert déjà : la descente ne promet que un fond **atteignable depuis le départ**, compatible avec la forme du coût. Changer le départ, ou simplifier le modèle jusqu'à une cuvette unique, sont deux façons honnêtes de vivre avec cette limite. Prétendre que « l'algorithme a trouvé le meilleur modèle possible » dès que la pente est nulle est la phrase de trop.

> [!TIP]
> Sur un modèle linéaire et une erreur quadratique, une pente nulle veut dire que vous êtes au fond de la seule cuvette. Si le coût y reste mauvais, la forme du modèle ou les variables sont en cause, pas un minimum local caché.

# Entraîner un modèle linéaire

Revenez aux quatre loyers, deux paramètres, coût 36,75 au départ, gradient (−11,5 , −33). Un pas avec α = **0,01** :

```text
b ← 0 − 0,01 × (−11,5) = 0,115
w ← 0 − 0,01 × (−33)   = 0,330
```

Les prédictions `0,115 + 0,330 x` deviennent environ 0,45 , 0,78 , 1,11 et 1,44. Encore loin de 3, 5, 7 et 8, mais le coût tombe de 36,75 à environ **25,6**. Cinq pas du même α mènent vers b ≈ **0,42**, w ≈ **1,18**, et J ≈ **6,1**. Le fond (près de 0,075) n'est pas atteint. La direction est la bonne.

Le même α = 0,1, trop vif pour ce gradient de −33, envoie w de 0 à **3,30** d'un coup, puis le fait revenir. Les paramètres oscillent. Le coût peut malgré tout baisser par à-coups, ce qui est trompeur si vous ne regardez que J et pas b et w. Regardez les deux.

Ce que fait un entraînement de modèle linéaire, ni plus ni moins :

1. Fixer une prédiction `ŷ = b + w₁ x₁ + …` . Avec une seule variable, `b + w x`.
2. Choisir un coût, ici la moyenne des carrés, J = 36,75 au départ sur ces quatre lignes.
3. Calculer le gradient, une pente **par paramètre**.
4. Répéter `paramètre ← paramètre − α × pente` jusqu'à ce que le coût sur des lignes **non utilisées pour choisir α** cesse de baisser, ou que les pentes soient proches de zéro.

Le point 4 anticipe l'évaluation, que vous approfondirez plus tard. Sur quatre lignes jouet, tout est visible, donc tout est trop optimiste. Sur **200** logements pour marcher et **50** logements mis de côté, vous surveillez le coût des 50. S'il remonte alors que le coût des 200 continue de baisser, vous avez assez marché.

Dernier lien. Le produit `X @ w` du chapitre d'algèbre **est** la prédiction. La descente ne change pas cette formule. Elle change **w**, un pas après l'autre, pour que les scores se rapprochent de y au sens du coût choisi. Quand la pente s'annule, modifier un peu un poids n'améliore plus J. Vous n'avez pas « compris » le marché du logement. Vous avez le meilleur jeu de poids **de cette famille**, **pour ce coût**, **sur ces lignes**.

# Exercices

## Exercice 1 : Le signe du pas

Vous minimisez `J(w) = (w − 2)²`. Vous êtes en w = 0. La dérivée vaut −4.

1. Avec α = 0,1, quel est le w suivant ?
2. Quel w obtient-on avec α = 0,5 ? Avec α = 1 ?
3. Pourquoi un gradient négatif fait-il **augmenter** w quand on soustrait α fois le gradient ?

<details>
<summary>Voir la solution</summary>

1. w = 0 − 0,1 × (−4) = **0,4**.
2. α = 0,5 donne w = 0 − 0,5 × (−4) = **2**, le fond de cette cuvette. α = 1 donne w = **4**, de l'autre côté, et le pas suivant revient à 0 : oscillation.
3. Soustraire un nombre négatif, c'est ajouter. La pente négative veut dire « le coût baisse quand w grandit », donc le pas utile va vers la droite. Le signe moins de la mise à jour et le signe moins de la pente se composent.

</details>

## Exercice 2 : Un pas sur les quatre loyers

Rappel : erreurs initiales 3, 5, 7, 8 quand b = w = 0, gradient (−11,5 , −33), coût 36,75.

1. Appliquez un pas α = 0,01. Donnez b et w.
2. La prédiction sur x = 4 vaut-elle déjà quelque chose proche de 8 ?
3. Un collègue prend α = 0,1 et voit w passer à 3,3 puis redescendre. Quel régime reconnaissez-vous ?

<details>
<summary>Voir la solution</summary>

1. b = 0 − 0,01 × (−11,5) = **0,115**. w = 0 − 0,01 × (−33) = **0,330**.
2. Prédiction : 0,115 + 0,330 × 4 = **1,435**, très loin de 8. Le coût a baissé (vers 25,6) sans que le modèle soit déjà bon. Un pas dans le bon sens n'est pas un modèle terminé.
3. Le pas est **trop grand** pour ce gradient : w dépasse la zone du fond (le fond est vers w ≈ 1,7) et les paramètres oscillent. On réduit α, on ne conclut pas que le modèle linéaire « ne converge pas ».

</details>

## Exercice 3 : Cuvette unique ou creux trompeur ?

1. Pour une régression linéaire et une erreur quadratique, un arrêt avec une pente nulle et un coût encore élevé (par exemple J = 12 alors que vous espériez moins de 1) peut-il s'expliquer par un minimum local ?
2. Donnez une situation, même imagée, où un minimum local existe.
3. Sur le jouet `J(w) = (w − 2)²`, quel est le coût au fond, et pourquoi partir de w = 0 ou de w = 6 mène au même endroit si le pas est adapté ?

<details>
<summary>Voir la solution</summary>

1. **Non.** Ce coût est une seule cuvette. Une pente nulle veut dire que vous êtes au fond global de **cette** famille de modèles. Un coût encore élevé veut dire que la droite (ou le plan) ne suffit pas, ou que les variables ne portent pas l'information, pas qu'une autre cuvette vous a piégé.
2. Un relief avec un creux à w = 1, fond J = 3, et une vallée plus basse à w = 5, fond J = 0,4. En partant de w = 0, la descente s'arrête dans le creux à 3. Elle ne voit pas 0,4.
3. Le fond vaut **J = 0** en w = 2. La cuvette n'a qu'un bas. Depuis 0 comme depuis 6, un pas adapté descend vers 2. (Depuis 6, la pente vaut 2 × (6 − 2) = +8, donc le premier pas avec α = 0,1 donne w = 6 − 0,1 × 8 = 5,2, plus près de 2.)

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Descente de gradient
center: On soustrait un pas fois la pente, et la pente dit où le coût monte, pas où il descend.
points:
  - icon: gauge
    title: Le coût J
    text: "Quatre loyers prédits à 0 : J = 36,75. Le carré moyen est la note que la descente cherche à baisser."
  - icon: compass
    title: Le gradient
    text: En (0, 0) les pentes valent −11,5 pour b et −33 pour w. Négatif, donc il faut augmenter.
  - icon: ruler
    title: Le pas alpha
    text: 0,01 avance peu, 0,1 convient au jouet à une variable, 1 oscille entre 0 et 4, 1,2 diverge.
  - icon: alert
    title: Minimum local
    text: Un creux peut cacher une vallée plus basse. Avec une droite et un coût quadratique, la cuvette est unique.
  - icon: loop
    title: Le modèle linéaire
    text: Chaque pas modifie b et w. La prédiction reste X @ w. On s'arrête quand le coût de côté ne baisse plus.
pitfall: Oublier le signe moins de la mise à jour. Avec une pente déjà négative, le paramètre part alors du mauvais côté.
remember: Pente nulle sur un coût quadratique linéaire veut dire le fond de la seule cuvette, pas le vrai marché.
```
