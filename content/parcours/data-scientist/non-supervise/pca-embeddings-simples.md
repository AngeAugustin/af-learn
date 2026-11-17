---
title: PCA et proximités simples
description: Réduire un tableau sans perdre l'essentiel de sa dispersion, et lire une proximité sans en faire une explication.
duration: 55
objectives:
  - Dire ce que la variance expliquée mesure, et ce qu'elle ne mesure pas
  - Utiliser une PCA pour voir ou pour compresser, pas pour raconter un axe
  - Distinguer proximité et sens métier
  - Savoir quand réduire est inutile
---

# Trop de colonnes pour un dessin

Vingt variables numériques ne se tracent pas. L'**analyse en composantes principales** (PCA) fabrique de nouveaux axes, combinaisons des anciens, ordonnés par la dispersion qu'ils captent. Le premier axe est la direction où les points s'étalent le plus. Le second est la suivante, perpendiculaire à la première.

Si l'axe 1 porte **62 %** de la variance et l'axe 2 **18 %**, un nuage en deux dimensions montre **80 %** de la dispersion d'origine. Les **20 %** restants sont hors du dessin : deux points proches à l'écran peuvent être éloignés dans l'espace complet.

```diagram
type: stack
title: Variance portée par les premiers axes
segments:
  - label: Axe 1
    value: 62
    tone: blue
    text: Direction de plus grande dispersion
  - label: Axe 2
    value: 18
    tone: teal
    text: Utile pour un plan
  - label: Reste
    value: 20
    tone: amber
    text: Invisible sur le dessin
```

```video
url: https://www.youtube.com/watch?v=HMOI_lkzW08
title: "StatQuest: PCA main ideas in only 5 minutes!!!"
channel: "StatQuest with Josh Starmer"
duration: "6:05"
lang: en
why: "Les idées principales de l'ACP en cinq minutes par StatQuest."
```

# Ce que l'on peut en faire

- **Regarder** des paquets, des points isolés, une séparation grossière, avant un clustering.
- **Compresser** pour un algorithme qui souffre de nombreuses colonnes corrélées (certaines régressions, un k-means).
- **Ne pas expliquer** l'axe 1 au comité de direction. C'est un mélange de « 0,4 × panier + 0,3 × fréquence − 0,2 × délai… ». Il n'a en général pas de nom métier.

> [!WARNING]
> Un axe de PCA n'est pas une cause. C'est une direction de dispersion. Le baptiser « engagement » parce que le nuage vous y fait penser est une histoire, pas un résultat.

# Avant de calculer

Les colonnes se standardisent, sinon celle en euros fabrique l'axe 1 à elle seule, comme dans k-means. On retire les identifiants. On sait que la PCA est **linéaire** : un U très net peut rester invisible sur les premiers axes.

La variance expliquée n'est pas une accuracy. **80 %** ne veut pas dire que vous prédisez bien une cible. Vous n'avez même pas utilisé de cible. Si le signal utile est dans les **20 %** faibles, la PCA l'a jeté.

# Proximité, embeddings, une seule idée

Un **embedding** est une liste de nombres qui place des objets de sorte que « proches » veuille dire « semblables » pour la tâche qui a produit ces nombres. Des mots entraînés sur des textes se retrouvent voisins s'ils apparaissent dans des contextes voisins. Des clients peuvent être placés de la même façon à partir de leurs achats.

La limite est la même que pour la PCA : la proximité dépend de **ce qui a servi à la construire**. Deux produits proches dans un embedding d'achats se vendent ensemble. Ils ne sont pas forcément substituables, ni de la même gamme. Vous vérifiez sur des exemples avant d'en faire un rayon ou une recommandation.

> [!NOTE]
> Ce chapitre ne construit pas de réseau de neurones. Il fixe le réflexe : une coordonnée résume une dispersion ou une cooccurrence, elle ne nomme pas un concept.

# Quand ne pas réduire

- Vous avez **8** colonnes déjà compréhensibles et peu corrélées : gardez-les, le modèle sera lisible.
- La cible vous intéresse plus que la dispersion : une sélection supervisée (ou un arbre) voit la cible, la PCA non.
- Vous devez expliquer chaque point à un humain : les axes d'origine restent le support.

# Exercices

## Exercice 1 : Lire 62 % et 18 %

Vous projetez des clients sur deux axes (62 % et 18 %). Deux clients sont presque superposés. Pouvez-vous affirmer qu'ils se ressemblent sur les vingt variables ?

<details>
<summary>Voir la solution</summary>

Non. Le plan laisse **20 %** de la dispersion dehors. Ils peuvent différer fortement sur des directions non dessinées. La superposition est un indice visuel, à vérifier sur les variables d'origine.

</details>

## Exercice 2 : Nommer l'axe

L'axe 1 mélange panier, fréquence et ancienneté avec des poids du même ordre. Le marketing veut l'appeler « fidélité ». Que répondez-vous ?

<details>
<summary>Voir la solution</summary>

Vous refusez le baptême comme résultat. L'axe est une direction de variance, pas une définition de la fidélité. S'il faut un indicateur de fidélité, on l'écrit explicitement (récence, fréquence, montant) au lieu de le déduire d'un poids PCA.

</details>

## Exercice 3 : PCA ou colonnes brutes ?

Huit indicateurs peu corrélés, et un comité qui demande pourquoi un client est dans le groupe à risque. Réduisez-vous avant le modèle ?

<details>
<summary>Voir la solution</summary>

Non. Huit colonnes lisibles n'ont pas besoin d'être mélangées. Un modèle sur les variables d'origine se raconte. La PCA aiderait si des dizaines de colonnes corrélées gênaient le calcul ou le dessin, pas ici.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: PCA et proximités
center: Réduire montre la dispersion principale. Cela ne nomme pas un axe et ne prédit pas une cible.
points:
  - icon: layers
    title: Axes ordonnés
    text: Le premier capte le plus d'étalement, le deuxième ce qui reste, à angle droit.
  - icon: chart
    title: Pourcentage
    text: 80 % de variance sur un plan laisse 20 % hors du dessin.
  - icon: eye
    title: Voir, pas raconter
    text: Un axe est un mélange. On ne le baptise pas d'un mot métier.
  - icon: ruler
    title: Même échelle
    text: Sans standardiser, la plus grande unité fabrique l'axe 1.
  - icon: link
    title: Proximité
    text: Deux objets proches le sont pour la tâche qui a construit les coordonnées.
pitfall: Jeter un signal faible mais utile parce qu'il pèse peu dans la variance.
remember: La PCA ne voit pas la cible. Un bon résumé de dispersion peut rater ce qui prédit.
```
