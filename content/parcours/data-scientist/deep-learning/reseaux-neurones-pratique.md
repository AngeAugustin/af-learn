---
title: Réseaux de neurones en pratique
description: Comprendre un neurone, une couche, le coût et les epochs, puis comparer un réseau dense à un gradient boosting sur des données tabulaires.
duration: 50
objectives:
  - Décrire un neurone, une couche et le rôle d'une activation
  - Relier fonction de coût, epochs et batch à la mise à jour des poids
  - Repérer l'overfitting sur les courbes d'entraînement et de validation
  - Comparer un réseau dense et un gradient boosting sur un tableau
---

# Un neurone calcule, une couche en calcule beaucoup

Un **neurone** artificiel fait une opération simple. Il prend des nombres en entrée (les features d'une ligne), multiplie chacun par un **poids**, ajoute un **biais**, puis passe le résultat dans une **fonction d'activation**.

Exemple jouet, déjà entraîné, pour un score de résiliation. Trois entrées : ancienneté 10 mois, facture 40 euros, 2 appels au support.

- somme pondérée : `0,05 × 10 + 0,01 × 40 + 0,40 × 2 + (−1,2) = 0,5`
- activation sigmoïde : `1 / (1 + e^(−0,5)) ≈ 0,62`

Le 0,62 se lit comme un score entre 0 et 1. Les poids ne se devinent pas : ils sont **appris** pour rapprocher ce score du label observé. L'exemple sert à voir le calcul, pas à régler un modèle à la main.

Une **couche** est un ensemble de neurones qui lisent les mêmes entrées et produisent chacun une sortie. Une couche **dense** (ou entièrement connectée) relie chaque entrée à chaque neurone. Empiler des couches donne un **réseau** : la couche suivante prend comme entrées les sorties de la précédente. La dernière couche a une sortie pour une classification binaire, autant de sorties que de classes pour une classification multiple, ou une sortie libre pour une régression.

```diagram
type: layers
title: "Un petit réseau sur une ligne tabulaire"
layers:
  - title: "Entrées"
    text: "Les colonnes d'une ligne, déjà numériques."
    items:
      - "Ancienneté, facture, appels support, offre encodée"
  - title: "Couches cachées"
    text: "Plusieurs neurones, chacun une somme pondérée puis une activation."
    items:
      - "La largeur est le nombre de neurones"
      - "La profondeur est le nombre de couches"
  - title: "Sortie"
    text: "Un score pour la tâche, pas une décision métier automatique."
    items:
      - "Sigmoïde si deux classes"
      - "Une valeur libre si régression"
```

Sur un tableau, une ligne est un vecteur de features. Le réseau ne « voit » pas le nom des colonnes : uniquement des nombres. L'encodage des catégories et le traitement des manquants font partie du pipeline, en amont, comme pour n'importe quel modèle.

```video
url: https://www.youtube.com/watch?v=trWrEWfhTVg
title: "Le deep learning"
channel: "ScienceEtonnante"
duration: "20:07"
lang: fr
why: "ScienceEtonnante explique en français comment fonctionne le deep learning et pourquoi il a tout changé en vision."
```

# Activation et fonction de coût

L'**activation** décide de la forme de la sortie d'un neurone.

| Activation | Où on la met souvent | Effet utile |
|---|---|---|
| ReLU | Couches cachées | Laisse passer les valeurs positives, met à zéro les négatives. Simple et efficace. |
| Sigmoïde | Sortie binaire | Comprime la somme dans ]0, 1[. On la lit comme un score. |
| Softmax | Sortie multiclasse | Transforme plusieurs scores en proportions qui se somment à 1. |
| Identité | Sortie de régression | N'écrase pas l'échelle : le réseau peut prédire 12,4 ou 180. |

Mettre une sigmoïde sur **toutes** les couches cachées est rarement utile : les valeurs se tassent et l'apprentissage ralentit. Le choix par défaut des couches cachées, dans cette esquisse, est ReLU. Le choix de la sortie dépend de la tâche, pas de la mode.

La **fonction de coût** mesure l'écart entre la prédiction et la cible sur un lot de lignes.

- Classification binaire : **entropie croisée binaire**. Elle punit fort une probabilité de 0,99 quand le label est 0, et peu une probabilité déjà proche du label.
- Classification multiclasse : entropie croisée sur les classes.
- Régression : erreur quadratique moyenne, proche dans l'esprit d'une somme de carrés des résidus.

On n'a pas besoin ici de la formule de rétropropagation. Le mécanisme utile tient en une phrase : le coût donne une direction, et une **descente de gradient** (souvent Adam, une variante qui adapte le pas) déplace un peu les poids pour faire baisser ce coût. Le pas s'appelle le **taux d'apprentissage**. Trop grand, le coût oscille ou explose. Trop petit, il ne bouge presque pas après beaucoup de passages.

> [!NOTE]
> Le coût d'entraînement n'est pas la métrique métier. On optimise l'entropie croisée, puis on **choisit** le modèle sur l'AUC, le rappel ou la précision au volume d'actions. Confondre les deux conduit à garder un réseau « bien entraîné » qui ne sert pas la décision.

# Epochs, batchs et pas d'apprentissage

Un **batch** (lot) est un paquet de lignes utilisé pour **une** mise à jour des poids. Un **epoch** est un passage complet sur le jeu d'entraînement.

Sur 80 000 lignes d'entraînement et un batch de 256, un epoch produit environ 312 mises à jour. Vingt epochs, c'est environ 6 000 mises à jour, pas « vingt essais ». Dire « j'ai mis 50 epochs » ne dit pas que le modèle est prêt : cela dit seulement combien de fois il a revu les mêmes lignes.

```diagram
type: flow
title: "Ce qui se passe à chaque mise à jour"
loop: "On recommence jusqu'à la fin de l'epoch, puis on en lance un autre"
steps:
  - title: "Mini-batch"
    text: "Quelques centaines de lignes, pas toute la table."
    tone: blue
  - title: "Prédiction"
    text: "Le réseau calcule un score par ligne du lot."
    tone: violet
  - title: "Coût"
    text: "On mesure l'écart aux labels du lot."
    tone: amber
  - title: "Mise à jour"
    text: "Les poids bougent d'un pas pour réduire ce coût."
    tone: teal
```

La taille du batch change le comportement, sans être une vertu en soi.

- Un petit batch rend chaque pas plus bruité. Cela peut aider à ne pas se figer, et multiplie les mises à jour par epoch.
- Un grand batch stabilise le pas et utilise mieux le processeur, mais chaque epoch met à jour les poids moins souvent.
- La mémoire borne le batch : un réseau d'images saturera bien avant un petit réseau tabulaire.

Le jeu de **validation** ne sert pas à mettre à jour les poids. Il sert à mesurer, à la fin de chaque epoch ou de quelques epochs, si le modèle progresse encore sur des lignes qu'il n'apprend pas. Le jeu de **test** reste fermé pendant ces choix.

# L'overfitting se lit sur deux courbes

Un réseau a assez de paramètres pour **mémoriser** un tableau modeste. La perte d'entraînement baisse alors jusqu'au plancher, pendant que la perte de validation remonte. Cet écart est l'**overfitting**.

| Epoch | Perte train | Perte validation | Lecture |
|---|---|---|---|
| 1 | 0,62 | 0,64 | Les deux baissent ensemble : on apprend encore un signal. |
| 8 | 0,40 | 0,44 | Zone raisonnable pour s'arrêter si la validation ne s'améliore plus. |
| 20 | 0,16 | 0,53 | Le train continue, la validation se dégrade : mémorisation. |
| 40 | 0,05 | 0,67 | Le coût d'entraînement est flatteur et inutile. |

On garde les poids de l'epoch où la métrique de validation était la meilleure (**early stopping**), pas ceux du dernier epoch. D'autres freins existent, à connaître par leur effet plutôt que par leur formule.

- Moins de neurones ou moins de couches : moins de capacité à mémoriser.
- **Weight decay** (pénalité L2) : les poids très grands coûtent dans l'objectif, le réseau reste plus lisse.
- **Dropout** : pendant l'entraînement, on ignore au hasard une fraction des neurones à chaque pas, pour éviter qu'un seul chemin porte toute la prédiction. À l'inférence, on les réactive tous.

> [!WARNING]
> Une courbe de train parfaite n'est pas un succès. Si vous ne tracez pas la validation **au même rythme**, vous ne voyez pas l'overfitting. Tracez les deux, avec la métrique métier en plus du coût.

Un écart train / validation existe aussi avec un gradient boosting trop profond ou trop d'arbres. Le réseau n'invente pas le problème. Il le rend plus facile à atteindre, parce que sa capacité grandit très vite quand on ajoute des couches.

# Tabulaire : le boosting d'abord

Sur des **données tabulaires** (lignes, colonnes métier, catégories, manquants), un **gradient boosting** d'arbres (XGBoost, LightGBM, CatBoost ou l'histogramme de scikit-learn) est le point de comparaison obligatoire. Un réseau dense est un candidat, pas un défaut.

| Critère | Gradient boosting | Réseau dense |
|---|---|---|
| Signal | Colonnes métier, interactions, seuils | Utile si le signal est brut (image, longue séquence) ou si le boosting plafonne vraiment |
| Manquants et catégories | Gérés nativement par plusieurs librairies | Imputation, encodage et mise à l'échelle à votre charge |
| Volume | Quelques milliers de lignes suffisent souvent | Il en faut davantage pour rivaliser sans mémoriser |
| Réglage | Nombre d'arbres, profondeur, pas | Largeur, profondeur, pas, batch, régularisation |
| Lecture | Importance, et parfois des règles approchées | Plus opaque à taille égale |
| Mise en service | Un pipeline léger, latence faible | Poids, versions de framework, même exigence de pipeline |

```diagram
type: compare
title: "Même churn, deux familles de modèles"
columns:
  - title: "Ce qui doit être identique"
    tone: teal
    items:
      - "Mêmes lignes d'entraînement, de validation et de test"
      - "Même définition de la cible et du horizon"
      - "Même métrique, choisie avant de voir le gagnant"
      - "Aucun réglage sur le test"
  - title: "Ce qui peut différer"
    tone: amber
    items:
      - "Le boosting encaisse l'échelle des colonnes"
      - "Le réseau exige des features à échelles comparables"
      - "Les hyperparamètres ne se copient pas d'une famille à l'autre"
      - "Le coût d'exploitation entre dans le choix final"
```

Cas concret : prédire la résiliation à 30 jours avec une quarantaine de colonnes (ancienneté, offre, facture, appels, retards) et quelques dizaines de milliers de clients. Un boosting bien préparé gagne très souvent un réseau à deux ou trois couches. Le réseau devient intéressant si vous avez une **longue série brute** par client (des centaines de points de consommation non agrégés) ou si, à protocole égal, il bat le boosting d'une marge qui paie sa complexité. Un gain d'AUC de 0,005 après une semaine de réglage ne paie en général pas un modèle plus dur à expliquer et à surveiller.

La mise à l'échelle (standardisation ou min-max) évite qu'une facture entre 0 et 200 écrase un indicateur binaire dans la somme du neurone. Oublier cette étape, puis conclure que « le deep learning ne marche pas », est une erreur de protocole. L'inverse aussi : handicaper le boosting avec un prétraitement absurde pour « que ce soit pareil » ne mesure plus la méthode.

# Une esquisse courte, pas un tutoriel

Les deux blocs ci-dessous décrivent **le même** petit réseau binaire. Ils ne constituent pas un mode d'emploi de Keras ni de PyTorch : pas de chargement de données, pas de GPU, pas de callbacks. L'idée est de reconnaître les pièces du chapitre dans le code.

Esquisse Keras. `n` est le nombre de colonnes numériques après encodage.

```python
model = keras.Sequential([
    keras.layers.Input(shape=(n,)),
    keras.layers.Dense(32, activation="relu"),
    keras.layers.Dense(16, activation="relu"),
    keras.layers.Dense(1, activation="sigmoid"),
])
model.compile(optimizer="adam", loss="binary_crossentropy")
model.fit(
    X_train, y_train,
    validation_data=(X_val, y_val),
    epochs=20,
    batch_size=256,
)
```

Esquisse PyTorch du même schéma. La perte `BCEWithLogitsLoss` inclut la sigmoïde : la dernière couche est donc **linéaire**, sans activation dans le réseau. C'est plus stable numériquement, et le score final s'obtient en appliquant une sigmoïde aux logits.

```python
reseau = nn.Sequential(
    nn.Linear(n, 32),
    nn.ReLU(),
    nn.Linear(32, 16),
    nn.ReLU(),
    nn.Linear(16, 1),
)
perte = nn.BCEWithLogitsLoss()
optimiseur = torch.optim.Adam(reseau.parameters(), lr=1e-3)

for _epoch in range(20):
    for xb, yb in lots_train:
        optimiseur.zero_grad()
        perte(reseau(xb), yb).backward()
        optimiseur.step()
```

Dans les deux cas : features mises à l'échelle **apprises sur le train seulement**, même découpage que le boosting, arrêt selon la validation, métrique métier calculée à part. Le test ne passe ni dans `fit`, ni dans la boucle.

> [!IMPORTANT]
> Copier une esquisse plus large, ajouter des couches « pour voir », puis rapporter le score de train, n'est pas une expérience. L'expérience, c'est le protocole commun avec le gradient boosting.

# Exercices

## Exercice 1 : Nommer les pièces

Un collègue propose, pour un churn binaire à 28 features numériques, le réseau suivant : couche de 64 neurones ReLU, couche de 32 neurones ReLU, couche de 1 neurone sigmoïde, coût d'entropie croisée binaire, 30 epochs, batch de 128. Il n'a pas de jeu de validation.

1. Où sont les couches cachées, et où est la sortie ?
2. Que manque-t-il pour détecter l'overfitting ?
3. Pourquoi une sigmoïde sur la sortie est cohérente ici, alors qu'une sigmoïde sur les 64 neurones le serait moins ?

<details>
<summary>Voir la solution</summary>

1. Les couches de 64 et de 32 sont les **couches cachées** (ReLU). Le neurone sigmoïde est la **sortie** : un score entre 0 et 1 pour deux classes.
2. Un jeu de **validation** suivi à chaque epoch (coût et métrique métier). Sans lui, une baisse du coût d'entraînement ne dit pas si le réseau mémorise. On gardera les poids du meilleur epoch de validation, pas forcément le trentième.
3. La sigmoïde finale met le score sur ]0, 1[, ce qui va avec l'entropie croisée binaire. Sur les couches cachées, des sigmoïdes tassent les valeurs et ralentissent l'apprentissage. ReLU est le choix par défaut de cette esquisse.

</details>

## Exercice 2 : Lire les courbes

On vous donne, pour un même réseau :

| Epoch | Perte train | Perte validation |
|---|---|---|
| 2 | 0,55 | 0,57 |
| 6 | 0,42 | 0,43 |
| 14 | 0,21 | 0,49 |
| 25 | 0,08 | 0,61 |

Quel epoch retenez-vous, et comment appelez-vous ce qui se passe après l'epoch 6 ? Que changeriez-vous si même l'epoch 6 est à peine meilleur qu'un gradient boosting déjà en production ?

<details>
<summary>Voir la solution</summary>

On retient l'**epoch 6**, dernier point où les deux pertes sont encore basses et proches. Après, la perte de train continue de chuter et la validation remonte : c'est de l'**overfitting**. Les epochs 14 et 25 ont un coût d'entraînement flatteur et une validation pire.

Si ce meilleur point de validation ne bat pas le gradient boosting déjà servi, on **ne remplace pas** le boosting. Un réseau qui mémorise moins mal qu'à l'epoch 25 n'est pas pour autant utile. On peut tenter moins de capacité ou plus de données, mais le critère reste la validation, à protocole égal, pas la beauté de la courbe de train.

</details>

## Exercice 3 : Choisir la famille

Pour chaque cas, indiquez par quoi vous commencez, et pourquoi.

1. Table de 40 000 clients, 35 colonnes (offre, facture, ancienneté, appels), cible binaire à 4 % de positifs. Un boosting n'a pas encore été essayé.
2. Même table, boosting déjà réglé. Un réseau à deux couches, avec features standardisées et le même découpage, perd de 0,01 d'AUC en validation.
3. Chaque client est décrit par 180 mesures horaires brutes de consommation, non agrégées, et le boosting sur des moyennes mensuelles plafonne nettement en dessous du besoin métier.

<details>
<summary>Voir la solution</summary>

1. **Gradient boosting** (après une baseline encore plus simple). Le signal est tabulaire, le volume est correct pour des arbres, et aucun réseau n'a de raison d'être le premier essai.
2. On **garde le boosting**. L'écart est en sa faveur, et le réseau ajoute de la complexité sans gain. On ne va pas chercher cet 0,01 manquant en allongeant l'entraînement sur le train.
3. Un **réseau** (ou un modèle de séquence adapté) devient un candidat légitime, **comparé** au boosting sur les mêmes dates et la même métrique. Les 180 points bruts sont précisément le genre de signal où une somme de moyennes jette de l'information. On n'abandonne le boosting qu'après la comparaison, pas avant.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Réseaux de neurones en pratique"
center: "Un réseau empile des couches apprises par un coût. Sur un tableau, le boosting reste la référence à battre."
points:
  - icon: brain
    title: "Neurone et couche"
    text: "Somme pondérée, biais, activation. Une couche, ce sont plusieurs neurones sur les mêmes entrées."
  - icon: target
    title: "Coût, epoch, batch"
    text: "Le coût mesure l'écart. Un batch met à jour les poids. Un epoch parcourt tout le train."
  - icon: chart
    title: "Deux courbes"
    text: "Si le train baisse et la validation remonte, on mémorise. On garde le meilleur epoch de validation."
  - icon: scale
    title: "Face au boosting"
    text: "Même découpage, même métrique. Sur des colonnes métier, le boosting gagne souvent."
  - icon: code
    title: "Esquisse seulement"
    text: "Keras ou PyTorch montrent les pièces. Ils ne remplacent pas le protocole ni la baseline."
pitfall: "Juger un réseau sur sa perte d'entraînement, sans validation et sans le comparer à un boosting."
remember: "Sur un tableau, un réseau doit battre un gradient boosting honnête, pas seulement un hasard."
```
