---
title: Arbres, forêts et boosting
description: Comprendre une coupe d'arbre, l'overfitting d'un arbre profond, le principe de la forêt aléatoire et du gradient boosting, et lire l'importance des variables avec prudence.
duration: 70
objectives:
  - Expliquer comment un arbre découpe les données et pourquoi un arbre profond mémorise
  - Décrire la forêt aléatoire comme une moyenne d'arbres volontairement différents
  - Situer le gradient boosting, XGBoost et LightGBM, sans les confondre avec une forêt
  - Interpréter une importance de variable comme un indice fragile, pas comme une cause
---

# Une suite de questions oui ou non

Un arbre de décision classe ou prédit en posant des questions successives sur une seule variable à la fois. `surface <= 45 ?` Si oui, `quartier == nord ?` Sinon, `étage <= 2 ?` Au bout de quelques questions, la ligne tombe dans une **feuille**. En régression, la feuille prédit la moyenne des `y` d'entraînement qui y sont tombés. En classification, elle prédit la classe majoritaire, et elle peut aussi donner la fréquence observée comme probabilité.

La question n'est pas choisie au hasard. À chaque nœud, l'algorithme essaie des seuils et retient celui qui rend les deux groupes les plus **purs** : en classification, des groupes où une classe domine (critère de Gini ou entropie) ; en régression, des groupes dont la cible varie peu. L'idée suffit. Vous n'avez pas besoin de réciter la formule pour vous en servir. Une bonne coupe sépare des prix bas et des prix hauts. Une mauvaise coupe laisse le même mélange des deux côtés.

L'arbre a des qualités que la droite n'a pas. Il épouse des paliers et des interactions sans que vous les écriviez : une première coupe sur le type de bien, une seconde sur la surface, et l'effet de la surface n'est plus le même dans chaque branche. Il se moque de l'échelle (un seuil à 45 m² ne demande pas de centrer). Il avale des variables hétérogènes dès qu'elles sont numériques ou déjà codées.

Il a les défauts de cette liberté. Une feuille de trois logements prédit leur moyenne avec une confiance que ces trois lignes ne méritent pas. Et la pureté sur l'entraînement n'est pas une pureté sur les dossiers de l'an prochain.

# L'arbre profond qui mémorise

Sans limite, l'arbre continue jusqu'à ce que chaque feuille soit pure, ou presque. Sur l'entraînement, l'erreur peut tomber à zéro : chaque cas tordu a sa propre question. Sur le test, ces questions ne se reproduisent pas. Vous avez mémorisé le fichier, pas une règle. C'est l'overfitting d'un arbre profond : train excellent, test en retrait net, parfois pire qu'une régression simple.

Vous le freinez avec des limites lisibles.

- `max_depth` borne le nombre de questions d'affilée. Un arbre de profondeur 3 se dessine et se raconte. Un arbre de profondeur 30 ne se raconte plus.
- `min_samples_leaf` impose un effectif minimal dans chaque feuille. Une prédiction appuyée sur 40 lignes est plus stable que la moyenne de 2 lignes.
- Vous pouvez aussi exiger un effectif minimal pour avoir le droit de couper (`min_samples_split`).

```python
from sklearn.tree import DecisionTreeRegressor

arbre = DecisionTreeRegressor(max_depth=3, min_samples_leaf=40, random_state=0)
arbre.fit(X_train, y_train)
```

Le réflexe de contrôle est le même qu'ailleurs : l'écart entre le score train et le score test. S'il est énorme, vous simplifiez l'arbre avant d'en changer. Un arbre court est aussi un outil de discussion avec le métier. S'il contredit une règle connue, la variable est mal codée ou la règle n'est pas dans les données. Vous ne « corrigez » pas cela en ajoutant de la profondeur.

> [!WARNING]
> Une erreur nulle sur l'entraînement n'est pas un objectif. Pour un arbre, c'est en général le symptôme que chaque feuille a appris des cas particuliers.

# La forêt aléatoire

Une forêt aléatoire entraîne beaucoup d'arbres, puis moyenne leurs prédictions (ou fait voter les classes). Un seul arbre profond est instable : changez quelques lignes, les premières coupes bougent, toute la suite change. La moyenne d'arbres instables mais **différents** se calme. C'est une réduction de variance. Le biais d'un arbre trop court, lui, ne disparaît pas en moyennant : cent arbres trop simples restent trop simples.

La différence entre les arbres vient de deux tirages, refaits pour chacun.

- **Les lignes** : chaque arbre voit un échantillon bootstrap, tiré avec remise dans le train. Certains dossiers apparaissent deux fois, d'autres pas.
- **Les variables** : à chaque coupe, l'arbre ne regarde qu'un sous-ensemble aléatoire de colonnes. Il ne choisit pas toujours la même variable dominante. Les arbres se décorrèlent, et la moyenne apprend quelque chose.

`n_estimators`, le nombre d'arbres, stabilise la moyenne. Passer de 50 à 300 réduit le hasard du vote. Passer de 300 à 3 000 change peu, et coûte du temps. Ce n'est pas le bouton de l'overfitting. La profondeur et la taille des feuilles le sont davantage. Une forêt d'arbres très profonds surajoute encore un peu, surtout si des colonnes sont du bruit pur, mais beaucoup moins qu'un arbre unique de même profondeur.

```python
from sklearn.ensemble import RandomForestRegressor

foret = RandomForestRegressor(
    n_estimators=300,
    max_depth=12,
    min_samples_leaf=5,
    random_state=0,
    n_jobs=-1,
)
foret.fit(X_train, y_train)
```

`random_state` fixe les tirages. Sans lui, deux lancements ne donnent pas le même score, et vous ne savez plus si un écart vient du modèle ou du hasard.

La forêt accepte les non-linéarités, demande peu de préparation d'échelle, et sert de baseline solide sur un tableau. Elle est moins lisible qu'un arbre court : vous n'expliquez pas « la » règle, vous expliquez une moyenne de règles. Elle reste plus facile à tenir que le boosting quand vous débutez sur un fichier sale.

```video
url: https://www.youtube.com/watch?v=J4Wdy0Wc_xQ
title: "StatQuest: Random Forests Part 1 - Building, Using and Evaluating"
channel: "StatQuest with Josh Starmer"
duration: "9:54"
lang: en
why: "Comment une forêt aléatoire se construit, s'utilise et s'évalue, expliqué pas à pas par StatQuest."
```

# Le boosting, XGBoost et LightGBM

Le gradient boosting construit lui aussi une somme d'arbres, dans un autre ordre. Il ne tire pas cent arbres en parallèle pour les moyenner. Il les ajoute **l'un après l'autre**, et chaque nouvel arbre s'occupe des erreurs laissées par les précédents.

L'intuition : vous commencez par une prédiction simple (la moyenne, ou un arbre très court). Vous regardez les résidus, ce qui reste mal prédit. Vous ajustez un petit arbre sur ces résidus. Vous l'ajoutez à la prédiction, multiplié par un **pas** faible (`learning_rate`, souvent 0,05 ou 0,1) pour ne pas tout corriger d'un coup. Vous recommencez. La prédiction finale est une longue somme de petites corrections.

Cette avidité est une force et un risque. Le boosting s'approche souvent plus près du signal qu'une forêt, surtout quand des effets fins comptent. Il surajoute aussi plus volontiers : trop d'arbres, des arbres trop profonds, un pas trop grand, et la somme finit par courir après le bruit du train. La discipline habituelle est un pas modéré, des arbres courts (`max_depth` petit, parfois 3 à 6), et un **arrêt anticipé** : vous surveillez un jeu de validation et vous cessez d'ajouter des arbres quand ce score-là cesse de s'améliorer. Le nombre d'arbres ne se choisit pas sur le test.

**XGBoost** et **LightGBM** sont des bibliothèques qui réalisent cette idée de façon efficace, pas une autre théorie. Elles découpent les variables numériques en histogrammes pour aller plus vite, elles pénalisent les feuilles trop sûres d'elles, et elles tiennent sur des tableaux bien plus grands qu'une forêt naïve. LightGBM pousse l'arbre feuille par feuille et est souvent plus rapide quand les lignes se comptent en millions. XGBoost est l'autre implémentation de référence, très présente, tout aussi capable. Vous les jugez au score hors échantillon, pas à leur réputation. Les deux exigent le même soin : validation, pas d'apprentissage, comparaison à une forêt et à la moyenne.

Ni l'un ni l'autre ne réparent une fuite. Un boosting très fort sur une colonne interdite est un modèle très fort et inutilisable.

```diagram
type: compare
title: Trois façons d'utiliser des arbres
columns:
  - title: Un arbre
    tone: amber
    items:
      - "Une suite de seuils, lisible si court"
      - "Interactions sans les écrire"
      - "Profond, il mémorise le train"
  - title: Forêt aléatoire
    tone: teal
    items:
      - "Beaucoup d'arbres en parallèle"
      - "Lignes et variables tirées au sort"
      - "La moyenne calme la variance"
  - title: Gradient boosting
    tone: violet
    items:
      - "Arbres ajoutés sur les erreurs"
      - "Pas faible, arrêt sur une validation"
      - "XGBoost et LightGBM en sont des moteurs"
```

```video
url: https://www.youtube.com/watch?v=3CC4N4z3GJc
title: "Gradient Boost Part 1 (of 4): Regression Main Ideas"
channel: "StatQuest with Josh Starmer"
duration: "15:52"
lang: en
why: "Les idées principales du gradient boosting, l'algorithme derrière XGBoost et LightGBM."
```

# L'importance des variables, avec prudence

Après une forêt ou un boosting, on vous proposera un diagramme en barres : l'importance de chaque variable. Le réflexe est d'en faire un classement métier. Résistez, ou au moins lisez la notice.

L'importance par **impureté** (le défaut de beaucoup d'outils) additionne, sur toutes les coupes, combien la variable a réduit le désordre, en pondérant par le nombre de lignes qui passaient par là. Elle favorise les variables qui offrent beaucoup de seuils possibles : un numérique continu, une catégorie à forte cardinalité. Une colonne de bruit finement découpée peut sortir « importante » parce qu'elle a eu plus d'occasions de couper, pas parce qu'elle se généralise. Une fuite, elle, sortira en tête à juste titre technique et à tort métier. L'importance ne détecte pas l'interdit.

Les variables corrélées se volent la vedette. Si surface habitable et surface Carrez se ressemblent, la première coupe prend l'une, et l'autre paraît inutile. Inversez un tirage, le classement s'inverse. Vous ne supprimez pas la seconde sur la foi d'une barre.

L'importance par **permutation** est plus saine. Sur un jeu que le modèle n'a pas utilisé pour s'ajuster, vous mélangez une colonne au hasard, vous recalculez le score, et vous regardez de combien il chute. Une forte chute veut dire que le modèle s'appuyait sur cette colonne. C'est encore une lecture du modèle, pas une cause. Deux colonnes liées se partagent encore la chute. Et le mélange doit se faire sur le train tenu à l'écart ou sur une validation, pas après avoir choisi le modèle sur le test.

Vous pouvez vous en servir pour une conversation : « retirer cette famille de variables dégrade le test de tant ». Vous ne vous en servez pas pour écrire « le code postal explique 40 % du prix » ni pour décider quel levier commercial tourner.

> [!IMPORTANT]
> Une variable en tête du classement peut être une fuite, un doublon, ou un identifiant déguisé. L'importance confirme que le modèle s'en sert. Elle ne confirme pas que vous avez le droit de vous en servir.

# Choisir entre arbre, forêt et boosting

Vous prenez un **arbre court** quand vous devez montrer la règle, ou vérifier qu'une segmentation métier réapparaît dans les données. Vous ne le prenez pas comme modèle final dès que le fichier est bruité : il sera soit trop simple, soit trop mémoriel.

Vous prenez une **forêt** comme premier modèle non linéaire sérieux. Peu de réglages sensibles, bonne baseline, comportement stable. Vous la comparez à la régression et à la moyenne. Si elle ne gagne presque rien, les interactions n'étaient pas le sujet.

Vous passez au **boosting** (XGBoost ou LightGBM) quand la forêt laisse une erreur structurée et que vous avez assez de lignes pour un jeu de validation. Vous réglez le pas et l'arrêt anticipé avant d'empiler des profondeurs. Vous ne le faites pas pour gagner 0,1 point d'un score déjà calculé sur le test.

Dans les trois cas, la préparation lourde d'échelle est secondaire. La qualité des variables, l'absence de fuite, et l'écart train / test restent les sujets. Un boosting sur une cible recopiée battra tout, et ne vaudra rien.

# Exercices

## Exercice 1 : Train parfait, test quelconque

Un arbre de régression sans `max_depth` affiche une RMSE de 0 sur l'entraînement et de 70 000 € sur le test. La baseline moyenne est à 80 000 €. Une régression ridge est à 60 000 € sur le même test.

Que s'est-il passé, et que modifiez-vous avant d'abandonner les arbres ?

<details>
<summary>Voir la solution</summary>

L'arbre a poursuivi les coupes jusqu'à isoler les cas d'entraînement. Une RMSE de 0 est une mémorisation, pas un exploit. Sur le test, il reste un peu meilleur que la moyenne (70 000 contre 80 000) mais moins bon que la ridge (60 000) : la complexité n'a pas été remboursée.

Vous limitez `max_depth` et vous imposez un `min_samples_leaf` confortable, puis vous remettez train et test côte à côte. L'écart doit se resserrer. Si un arbre court reste derrière la ridge, la liaison est sans doute assez linéaire : vous gardez la ridge. Vous ne rajoutez pas de profondeur pour « rattraper » le 0 du train.

</details>

## Exercice 2 : Forêt ou boosting pour commencer

Un fichier de 30 000 lignes mélange montants, catégories et quelques colonnes sales. C'est votre premier modèle non linéaire. Vous n'avez pas encore de jeu de validation dédié, seulement un test que vous ne voulez pas toucher.

Par quoi commencez-vous, et qu'est-ce qui vous ferait passer à LightGBM ensuite ?

<details>
<summary>Voir la solution</summary>

Vous commencez par une **forêt aléatoire**, avec une graine, une profondeur bornée et un effectif minimal par feuille. Elle demande moins de discipline sur le nombre d'arbres, et elle fournit une baseline non linéaire robuste. Vous la comparez à la moyenne et à une régression, sur le test, une fois.

Vous passez à LightGBM ou XGBoost seulement si la forêt laisse un écart net que vous espérez réduire, et après avoir sorti un **jeu de validation depuis le train** pour l'arrêt anticipé et le pas d'apprentissage. Vous ne réglez pas le nombre d'arbres du boosting en regardant le test. Le fichier sale se traite d'abord (fuites, manquants, clés), quel que soit l'algorithme : le boosting n'est pas un détergent.

</details>

## Exercice 3 : Le code postal en tête

L'importance par impureté d'une forêt place `code_postal` loin devant, puis `surface`. Le code postal a 4 000 valeurs. Deux surfaces quasi identiques se partagent le bas du classement. Un collègue veut « agir sur le code postal » et supprimer la seconde surface.

Que lui répondez-vous ?

<details>
<summary>Voir la solution</summary>

L'importance par impureté avantage les variables qui offrent beaucoup de coupes. Un code postal à 4 000 niveaux peut dominer même si une partie du gain est de la mémorisation de micro-zones. Vous vérifiez avec une importance par **permutation** sur un jeu non utilisé pour ajuster la forêt, et vous regardez surtout si le score test chute quand les codes rares sont regroupés. En tête ne veut pas dire « levier ». Un code postal ne se règle pas comme un curseur : ce n'est pas une cause, et ce peut être un proxy que le cadre d'usage interdit.

Les deux surfaces se volent l'importance. En supprimer une parce qu'elle est en bas de la barre peut ne rien changer au score, ou le dégrader dès que l'autre manque en production. Vous testez le retrait sur une validation, vous ne le décidez pas sur le dessin.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Arbres et ensembles"
center: "Un arbre profond mémorise. Une forêt moyenne. Un boosting corrige, sous surveillance."
points:
  - icon: git
    title: "Questions successives"
    text: "Chaque feuille prédit une moyenne ou une classe. L'échelle des variables compte peu."
  - icon: alert
    title: "Profondeur"
    text: "Sans limite, l'erreur d'entraînement tombe à zéro et le test ne suit pas."
  - icon: network
    title: "Forêt aléatoire"
    text: "Arbres en parallèle, lignes et colonnes tirées au sort, puis une moyenne."
  - icon: zap
    title: "Boosting"
    text: "Chaque arbre corrige le résidu, à petit pas. XGBoost et LightGBM font cela vite."
  - icon: eye
    title: "Importance fragile"
    text: "L'impureté favorise les variables fines. La permutation se lit hors du fit, sans en faire une cause."
pitfall: "Livrer l'arbre qui a une erreur nulle au train, ou régler le nombre d'arbres du boosting sur le test."
remember: "La forêt est la baseline non linéaire. Le boosting vient après, avec une validation."
```
