---
title: Introduction à la vision par convolution
description: Lire une image comme un tenseur, comprendre une convolution sans rétropropagation, et poser un transfert learning avec un découpage d'images honnête.
duration: 45
objectives:
  - Représenter une image et un lot d'images comme des tenseurs
  - Expliquer une convolution et le pooling par leur effet, sans formule de rétropropagation
  - Décrire le transfert learning comme une réutilisation d'un corps déjà entraîné
  - Découper train et validation sans fuite, augmenter seulement le train, choisir la métrique
---

# Une image est un tenseur

Une image numérique est une grille de nombres. Une photo en niveaux de gris a **une** valeur par pixel. Une photo couleur en a **trois** : rouge, vert, bleu. On range cela dans un **tenseur**.

- Une image couleur de 128 pixels de côté : forme `(128, 128, 3)` si les canaux sont en dernier, convention fréquente avec Keras.
- La même image pour PyTorch, canaux en premier : `(3, 128, 128)`.
- Un **lot** de 16 images : `(16, 128, 128, 3)` ou `(16, 3, 128, 128)`.

Les pixels bruts vont souvent de 0 à 255. On les ramène sur une échelle exploitable, en général en divisant par 255, **ou** avec la moyenne et l'écart-type attendus par un réseau déjà entraîné. Mélanger les deux (diviser par 255 puis réappliquer les statistiques d'ImageNet, ou l'inverse) décale toutes les convolutions. Le prétraitement fait partie du modèle, au même titre que le scaler d'un réseau tabulaire.

```diagram
type: stack
title: "De l'entier brut au lot prêt à entrer dans le réseau"
segments:
  - label: "Pixels 0-255"
    value: 25
    tone: blue
    text: "La photo telle qu'elle est stockée."
  - label: "Mise à l'échelle"
    value: 25
    tone: teal
    text: "Division par 255, ou statistiques du réseau préentraîné. Un seul des deux."
  - label: "Tenseur image"
    value: 20
    tone: violet
    text: "Hauteur, largeur, canaux. L'ordre des canaux doit matcher le framework."
  - label: "Lot"
    value: 30
    tone: amber
    text: "Plusieurs images empilées. Le batch du chapitre précédent, en quatre dimensions."
```

Une image n'est pas « une feature ». C'est des dizaines de milliers de nombres ordonnés dans l'espace. Aplatir la grille et l'envoyer à un gradient boosting jette le voisinage des pixels : un œil, un bord, une fissure n'existent que parce que des pixels proches vont ensemble. C'est pour garder ce voisinage qu'on utilise une convolution, pas parce que les images seraient hors de portée de tout le reste.

Si quelqu'un a déjà mesuré l'image (largeur de la fissure, luminosité moyenne, nombre de taches), vous êtes revenu à un **tableau**. Dans ce cas, le boosting sur ces descripteurs est encore la baseline à battre avant d'entraîner un réseau de pixels.

# La convolution, vue comme un filtre

Une **convolution** fait glisser un petit filtre sur l'image, souvent 3×3. À chaque position, le filtre combine les pixels locaux en **une** valeur. Le résultat est une nouvelle grille : une **carte**, qui répond fort là où le motif du filtre est présent.

Un filtre peut réagir à un bord vertical, à un coin, à une texture. On n'écrit en général pas ces filtres à la main : le coût d'entraînement les règle, comme il réglait les poids d'une couche dense. Trente-deux filtres produisent trente-deux cartes. La couche suivante combine ces cartes et répond à des motifs un peu plus grands.

Deux mots suffisent pour lire une architecture, sans dériver la rétropropagation.

- Le **pas** (stride) : de combien de pixels on déplace le filtre. Un pas de 2 réduit la carte.
- Le **padding** : des bords ajoutés pour ne pas rétrécir la carte à chaque couche, ou pour traiter les pixels du bord.
- Le **pooling** : on résume un petit bloc, souvent 2×2, par son maximum. La carte rétrécit, les réponses fortes restent. On gagne un peu de tolérance à un décalage d'un pixel.

L'intuition par étages, utile et approximative : les premières couches répondent à des bords et des contrastes, les suivantes à des morceaux (une oreille, un filetage, une rayure), les dernières à l'objet ou au défaut. Ce n'est pas une preuve. C'est une raison de ne pas attendre qu'un seul filtre 3×3 « reconnaisse le produit ».

> [!NOTE]
> Le coût, les epochs et le batch ne changent pas de nature par rapport à un réseau dense. Seule la couche change : une convolution partage les mêmes poids partout dans l'image. Ce partage est l'hypothèse utile : un bord reste un bord, qu'il soit à gauche ou à droite.

# De la carte de motifs à la classe

Après plusieurs convolutions, on dispose de cartes. On ne les donne pas telles quelles à l'utilisateur. Une opération de **pooling global** (la moyenne ou le max de chaque carte, un seul nombre par filtre) ou un aplatissement alimente une petite couche dense finale, la **tête**. La tête produit les scores de classes.

Pour deux classes (pièce saine ou pièce défectueuse), la tête ressemble à la sortie du chapitre précédent : un score, une entropie croisée binaire. Pour cinq familles de défauts, une softmax et une entropie croisée multiclasse. Le reste du vocabulaire (validation, early stopping, overfitting) s'applique sans nouveau concept.

```diagram
type: flow
title: "Du pixel à la classe"
steps:
  - title: "Image"
    text: "Tenseur mis à l'échelle, taille fixe."
    tone: blue
  - title: "Convolutions"
    text: "Filtres locaux, cartes de motifs de plus en plus abstraits."
    tone: violet
  - title: "Pooling"
    text: "Cartes plus petites, réponses fortes conservées."
    tone: teal
  - title: "Tête"
    text: "Quelques neurones vers les classes. Le coût compare au label."
    tone: amber
```

La taille d'entrée est un contrat. Un réseau prévu pour 224×224 ne reçoit pas une photo 4000×3000 « pour plus de détail » sans la redimensionner. Recadrer au hasard au moment de l'évaluation, et recadrer autrement à l'entraînement, change la tâche. On documente le recadrage comme on documente un encodage de catégorie.

```video
url: https://www.youtube.com/watch?v=QzY57FaENXg
title: "What are Convolutional Neural Networks (CNNs)?"
channel: "IBM Technology"
duration: "6:21"
lang: en
why: "IBM Technology résume le fonctionnement d'un réseau convolutif : filtres, cartes de motifs et classification."
```

# Le transfert learning, en idée

Entraîner une convolution depuis des poids aléatoires demande beaucoup d'images, parce que les premiers filtres doivent réapprendre ce qu'est un bord. Le **transfert** part d'un corps déjà entraîné sur un grand jeu d'images génériques. Ce corps sait déjà extraire des motifs visuels. On **remplace la tête** par une tête à votre nombre de classes, et on réapprend surtout cette tête.

Démarche courte, volontairement sans catalogue de réseaux :

1. Choisir un corps préentraîné adapté à des photos naturelles, et **son** prétraitement (taille, normalisation).
2. Geler le corps : ses poids ne bougent pas. Entraîner la tête neuve quelques epochs.
3. Si la validation progresse encore, dégeler le **dernier** étage du corps avec un taux d'apprentissage plus petit, pour l'ajuster sans effacer les filtres utiles.
4. Comparer à une baseline. Si vous disposez de descripteurs simples (couleur moyenne, score d'un détecteur existant, mesure métier), un modèle tabulaire dessus est cette baseline.

Le transfert n'est pas une garantie. Des images très éloignées des photos ordinaires (coupe au microscope, caméra thermique, radiographie, contrôle industriel en gris très contrasté) réutilisent mal des filtres appris sur des photos grand public. Le gain peut rester réel sur les bords et les textures, ou devenir négligeable. On le **mesure** contre un entraînement de tête seule et contre la baseline tabulaire, on ne le suppose pas.

```diagram
type: compare
title: "Partir de zéro ou réutiliser un corps"
columns:
  - title: "Depuis zéro"
    tone: amber
    items:
      - "Tous les filtres s'apprennent sur vos images"
      - "Demande beaucoup d'exemples par classe"
      - "Utile si le domaine visuel est très spécifique et riche"
  - title: "Transfert"
    tone: teal
    items:
      - "Le corps apporte des filtres déjà utiles"
      - "Quelques centaines d'images par classe peuvent suffire"
      - "Le prétraitement doit être celui du corps choisi"
  - title: "Baseline à ne pas sauter"
    tone: violet
    items:
      - "Descripteurs simples plus un boosting ou une logistique"
      - "Même découpage d'images, même métrique"
      - "Si elle suffit, le réseau n'est pas obligatoire"
```

# Découper les images sans fuite

Le découpage se fait sur l'**unité indépendante**, pas sur le fichier. Dix photos du même défaut, prises à quelques secondes d'intervalle, ne doivent pas se répartir entre l'entraînement et la validation. Sinon le réseau reconnaît la pièce, pas le défaut, et la validation ment.

- Une pièce physique, un patient, un lot de fabrication, un point de vente : tout ce qui relie plusieurs images est un **groupe**.
- Le groupe entier va dans le train, ou dans la validation, ou dans le test.
- Si les images arrivent dans le temps (caméra d'une ligne de production), un découpage **chronologique** est plus honnête qu'un tirage aléatoire : il respecte le futur que vous devrez prédire.

L'**augmentation** fabrique des variantes d'une image d'entraînement : miroir horizontal, petite rotation, léger changement de luminosité. Elle n'invente pas de nouvelles pièces. Elle sert uniquement sur le **train**. Valider sur des images augmentées mélange des doublons artificiels à la mesure et rend le score optimiste.

On n'augmente pas n'importe comment. Un miroir vertical est raisonnable pour une cellule au microscope ou une tuile satellite sans sens privilégié. Il est absurde pour un produit posé sur une table ou un texte dans l'image : vous entraîneriez le réseau à un monde qui n'existe pas en production. Une rotation de 90 degrés a le même défaut si l'orientation porte l'information.

> [!WARNING]
> Augmenter avant le découpage, puis répartir les copies, est une fuite. On découpe d'abord les originaux par groupe, on augmente ensuite, seulement dans le train.

Le volume compte. Quelques dizaines d'images par classe, même augmentées, tiennent rarement un réseau depuis zéro. Le transfert plus une tête simple est alors le seul essai raisonnable, et il peut encore échouer. L'échec honnête consiste à le dire et à rester sur la baseline, pas à rapporter l'accuracy du train.

# Choisir une métrique d'image

Si 2 % des images montrent un défaut et que le réseau prédit « toujours sain », l'**accuracy** vaut 98 %. Le modèle est inutile sur la seule classe qui compte. On choisit la métrique selon le coût, comme sur un tableau déséquilibré.

| Situation | Métrique à regarder | Pourquoi |
|---|---|---|
| Classes équilibrées, erreurs symétriques | Accuracy, en plus de la matrice de confusion | Le taux global n'est pas trompeur. |
| Défaut rare, rater un défaut coûte cher | Rappel sur le défaut, à un seuil fixé sur la validation | L'accuracy est dominée par la classe saine. |
| Une fausse alerte arrête une ligne | Précision sur le défaut, ou précision à rappel imposé | Le seuil se règle sur la validation, pas sur le test. |
| On veut un chiffre indépendant du seuil | Aire sous la courbe précision-rappel | Elle ne cache pas la classe rare, contrairement à l'accuracy. |

La **matrice de confusion** sur la validation, au seuil que vous comptez utiliser, vaut mieux qu'un seul nombre. Elle dit si les erreurs se concentrent sur une classe de défaut que l'atelier ne peut pas se permettre de manquer.

Le seuil qui transforme un score en « défaut / sain » se choisit sur la validation, à partir du coût (rebut à tort, défaut livré). Le test sert à **rapporter** ce choix une fois, pas à essayer dix seuils jusqu'à ce que le chiffre plaise.

# Exercices

## Exercice 1 : Formes et prétraitement

Un lot contient 32 photos couleur de 224×224, canaux en dernier. Les fichiers sont en 0-255. Le corps préentraîné attend des pixels déjà normalisés avec ses propres moyenne et écart-type, **sans** division supplémentaire.

1. Quelle est la forme du tenseur de lot ?
2. Quelle erreur de prétraitement fausse toutes les convolutions suivantes ?
3. Pourquoi un boosting sur la luminosité moyenne et le nombre de pixels sombres reste une baseline, même si vous visez un réseau ?

<details>
<summary>Voir la solution</summary>

1. `(32, 224, 224, 3)`. En canaux d'abord, ce serait `(32, 3, 224, 224)`. Il faut coller à la convention du code qui charge le corps préentraîné.
2. Diviser par 255 **et** appliquer ensuite les statistiques du réseau (ou appliquer les statistiques sur des pixels encore en 0-255 alors qu'elles supposent une autre échelle). Les filtres ont été appris sur une échelle précise. Une échelle fausse rend le transfert caduc, quel que soit le nombre d'epochs.
3. Ces descripteurs sont un tableau. S'ils suffisent à séparer déjà une partie des défauts, le réseau doit les **battre** sur le même découpage et la même métrique. S'ils suffisent au coût métier, on ne déploie pas le réseau.

</details>

## Exercice 2 : Où est la fuite ?

Une ligne de contrôle photographie chaque pièce **quatre fois** (quatre angles). Le dossier mélange 2 000 fichiers. Un script tire 80 % des **fichiers** pour le train, augmente tout le dossier (rotations incluses), puis recalcule la validation sur les fichiers restants, augmentés eux aussi.

Citez trois problèmes distincts. Proposez un protocole minimal correct.

<details>
<summary>Voir la solution</summary>

1. Le tirage est fait sur les **fichiers**, pas sur les pièces. Plusieurs angles de la même pièce se retrouvent des deux côtés : le réseau peut reconnaître la pièce.
2. L'augmentation a lieu **avant** un usage propre du découpage, sur tout le dossier. Des variantes d'une image de validation peuvent influencer le train si l'ordre des opérations mélange les copies. Même sans cela, augmenter la validation est une erreur.
3. La validation est calculée sur des images **augmentées**, donc plus facile et répétitive que la production, où l'on verra des photos réelles, pas des rotations aléatoires.

Protocole minimal : identifiant de pièce, toutes les vues d'une pièce dans un seul des trois ensembles. Découpage chronologique si la caméra dérive dans le temps. Augmentation **uniquement** sur le train, avec des transformations plausibles en production. Validation et test sur images originales seulement.

</details>

## Exercice 3 : Métrique et seuil

Deux pour cent des images sont défectueuses. Un modèle annonce 99 % d'accuracy. Au seuil 0,5, il ne détecte presque aucun défaut. Au seuil 0,2 choisi après avoir regardé le **test**, le rappel des défauts monte, et la précision tombe.

Que dites-vous du 99 %, et comment aurait-il fallu fixer le seuil ?

<details>
<summary>Voir la solution</summary>

Le 99 % est compatible avec un modèle qui prédit presque toujours « sain ». L'accuracy ne décrit pas la tâche. Il faut le rappel et la précision **sur le défaut**, plus la matrice de confusion.

Le seuil se fixe sur la **validation**, en regardant le coût d'un défaut manqué et d'une fausse alerte (par exemple : rappel d'au moins 0,9, puis la meilleure précision possible). Le test ne sert qu'à mesurer **une fois** ce seuil déjà choisi. Choisir 0,2 parce que le test « a l'air mieux » use le test : le chiffre n'est plus une estimation honnête.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Vision par convolution"
center: "Une image est une grille. La convolution y cherche des motifs locaux. Le transfert réutilise un corps, il ne dispense pas du protocole."
points:
  - icon: layers
    title: "Tenseur"
    text: "Lot, hauteur, largeur, canaux. L'échelle des pixels doit être celle qu'attend le réseau."
  - icon: search
    title: "Filtre glissant"
    text: "Un petit noyau répond à un motif local. Le pooling garde les réponses fortes et réduit la carte."
  - icon: link
    title: "Transfert"
    text: "On gèle un corps déjà entraîné, on réapprend la tête, puis on ajuste peu le dernier étage."
  - icon: filter
    title: "Découpage par groupe"
    text: "Plusieurs photos d'une même pièce restent ensemble. On augmente seulement le train."
  - icon: gauge
    title: "Pas l'accuracy seule"
    text: "Si le défaut est rare, le rappel et la précision au seuil de validation comptent davantage."
pitfall: "Mélanger les angles d'une même pièce entre train et validation, puis annoncer une accuracy flatteuse."
remember: "Le réseau de pixels doit battre une baseline simple, sur des images qu'il n'a pas vues, au seuil fixé avant le test."
```
