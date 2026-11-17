---
title: La régression linéaire et sa baseline
description: Ajuster une régression linéaire, lire RMSE, MAE et R², interpréter un coefficient, sentir Ridge et Lasso, et se comparer d'abord à la moyenne.
duration: 60
objectives:
  - Expliquer ce qu'ajuste une régression linéaire et ce qu'elle suppose en pratique
  - Choisir entre RMSE, MAE et R² selon la question posée au modèle
  - Lire un coefficient comme un effet associé, pas comme une cause
  - Comparer Ridge, Lasso et une baseline qui prédit la moyenne du train
---

# La droite et l'hyperplan

La régression linéaire prédit un nombre par une somme pondérée des variables, plus une constante.

`prix estimé = b0 + b1 × surface + b2 × pièces + ...`

Avec une seule variable, c'est une droite. Avec plusieurs, un hyperplan : l'idée reste une addition d'effets. Les coefficients `b` sont choisis, sur l'entraînement, pour rendre les carrés des erreurs aussi petits que possible. Une erreur de 20 pèse donc beaucoup plus que deux erreurs de 10. C'est voulu, et c'est aussi pourquoi quelques prix aberrants peuvent faire pivoter toute la droite.

Ce que le modèle suppose, en pratique, et non comme une liste de théorèmes :

- l'effet moyen de chaque variable est une pente constante, une fois les autres variables du modèle tenues fixes ;
- les courbes, les paliers et les produits ont été écrits par vous dans les colonnes, sinon ils n'existent pas ;
- deux colonnes qui disent la même chose se partagent mal le crédit ;
- les erreurs énormes restent rares, parce que le carré les laisse dominer l'ajustement.

Si le prix croît de moins en moins avec la surface, la droite seule sous-estime les petits biens et les très grands. Vous transformez (logarithme, tranche, interaction) ou vous changez de famille de modèles. Vous n'ajoutez pas des variables au hasard en espérant que la somme devienne une courbe.

```python
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression

lineaire = make_pipeline(StandardScaler(), LinearRegression())
lineaire.fit(X_train, y_train)
```

Le scaler n'est pas obligatoire pour que la droite existe. Il le devient dès que vous comparez des coefficients entre eux, ou que vous passez à Ridge et Lasso, dont la pénalité dépend de l'unité des variables.

```video
url: https://www.youtube.com/watch?v=wg7-roETbbM
title: "LA RÉGRESSION LINÉAIRE (partie 1/2) - ML#3"
channel: "Machine Learnia"
duration: "11:39"
lang: fr
why: "La régression linéaire expliquée en français par Machine Learnia : le modèle, la fonction de coût et son minimum."
```

# RMSE, MAE et R²

Vous évaluez sur le **test**, jamais sur les lignes qui ont servi à choisir les coefficients. Trois résumés suffisent pour commencer. Ils ne disent pas la même chose.

**RMSE**, racine de la moyenne des carrés des erreurs. Elle s'exprime dans l'unité de la cible (des euros, des jours). Une grosse erreur pèse plus que plusieurs petites. C'est le bon reflet du critère que la régression a vraiment optimisé. Un modèle qui se trompe de 100 000 € sur trois villas et de peu ailleurs aura une RMSE mauvaise, à juste titre si ces villas comptent.

**MAE**, moyenne des valeurs absolues des erreurs. Elle aussi dans l'unité de la cible. Elle répond à « de combien je me trompe en général ». Quelques dossiers catastrophiques la bougent moins que la RMSE. Si le métier parle d'une erreur typique, citez la MAE. Si une erreur rare mais énorme est inacceptable, citez la RMSE, ou regardez un quantile d'erreur.

**R²** compare votre somme des carrés à celle d'un modèle idiot qui prédirait la moyenne des `y` de l'échantillon sur lequel vous le calculez. Proche de 1, vous suivez presque toute la variation. À 0, vous ne faites pas mieux que cette moyenne. Négatif, vous faites pire. Un R² de 0,40 n'est ni « la moyenne » ni un échec automatique : sur des prix bruités, expliquer 40 % de la variance peut déjà aider, si vous battez la baseline et si l'erreur en euros est tenable.

| Mesure | Elle grossit quand... | Vous la citez pour... |
|---|---|---|
| RMSE | de grosses erreurs, même rares | coller au critère des moindres carrés, punir les écarts graves |
| MAE | l'erreur typique augmente | dire « environ tant d'euros » au métier |
| R² | vous battez moins bien la moyenne des y observés | situer le modèle par rapport à « ne rien savoir » |

```python
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

pred = lineaire.predict(X_test)
rmse = mean_squared_error(y_test, pred) ** 0.5
mae = mean_absolute_error(y_test, pred)
r2 = r2_score(y_test, pred)
```

Ne comparez pas une RMSE en euros d'un fichier à la RMSE d'un autre fichier dont les prix sont dix fois plus hauts. Comparez des modèles sur le même test. Et ne choisissez pas une transformation parce qu'elle améliore le R² du train : le train baisse toujours quand vous lui donnez plus de liberté.

```diagram
type: compare
title: Trois façons de noter une erreur de prix
columns:
  - title: RMSE
    tone: rose
    items:
      - "Unité de la cible"
      - "Les gros écarts dominent"
      - "Proche de ce que la droite minimise"
  - title: MAE
    tone: blue
    items:
      - "Unité de la cible"
      - "Erreur typique, plus calme"
      - "Lisible pour un métier non technique"
  - title: R²
    tone: teal
    items:
      - "Sans unité, 1 est le plafond, le négatif existe"
      - "0 égale la moyenne des y du score"
      - "Négatif : pire que cette moyenne"
```

# Lire un coefficient sans lui faire dire trop

Après un `fit`, `b1` est le changement de prédiction associé à une hausse d'une unité de la variable, **les autres variables du modèle restant fixes**. Ce n'est pas l'effet de « ajouter une pièce dans la vraie vie ». Si les grands appartements ont aussi une meilleure exposition, et que l'exposition n'est pas dans le modèle, la pièce emporte avec elle tout ce qui lui est mêlé.

La constante `b0` est la prédiction quand toutes les variables valent 0. Une surface de 0 m² n'existe pas. La constante n'a alors aucun intérêt métier. Elle sert au calcul, pas au slide.

Pour comparer deux coefficients, mettez les variables à la même échelle avant le fit (moyenne 0, écart-type 1 sur le train). Un coefficient de 30 000 sur la surface en m² et un coefficient de 2 000 sur le nombre de pièces ne se comparent pas : les unités diffèrent. Après centrage-réduction, le coefficient dit le changement de prix associé à un écart-type de plus, pas à un mètre carré de plus. Vous le traduisez en phrase, vous ne le laissez pas nu.

Méfiez-vous d'un coefficient énorme sur une modalité rare. Dix maisons atypiques peuvent fabriquer un écart qui ne se reverra pas. Regardez l'effectif derrière la colonne avant de raconter une histoire.

> [!IMPORTANT]
> « Toutes choses égales par ailleurs » veut dire « les autres colonnes **du modèle** tenues fixes ». Cela ne veut pas dire « toutes choses égales dans le monde ». Un coefficient n'est pas une cause, ni un levier que l'on peut tourner seul.

# Ridge et Lasso à l'intuition

Quand les variables sont nombreuses, corrélées, ou simplement plus libres que l'échantillon n'est solide, les coefficients des moindres carrés deviennent grands et nerveux. Une petite variation du train les fait changer de signe. La prédiction sur de nouvelles lignes se dégrade alors que le train avait l'air excellent.

**Ridge** ajoute une pénalité proportionnelle à la somme des carrés des coefficients. Pour un même niveau d'erreur, il préfère des coefficients plus petits, tous un peu rapprochés de zéro, aucun forcé à zéro. Les variables corrélées se partagent le poids au lieu qu'une seule s'envole. Plus `alpha` est grand, plus le rappel vers zéro est fort, plus le modèle est simple, et plus vous risquez de sous-ajuster si vous serrez trop.

**Lasso** pénalise la somme des valeurs absolues. La géométrie de cette pénalité permet à des coefficients d'être **exactement** nuls. Vous obtenez une forme de sélection : des variables sortent du modèle. C'est utile quand vous pensez que peu de colonnes portent le signal. C'est trompeur quand deux variables sont liées : le Lasso en garde souvent une, presque au hasard, et met l'autre à zéro. Relancer avec un autre partage peut échanger les deux noms.

Dans les deux cas, l'échelle compte. Sans `StandardScaler` dans le pipeline, la pénalité frappe d'abord les variables dont l'unité est grande, pas celles qui sont « trop influentes ». Et `alpha` se choisit par validation croisée **sur le train** (`RidgeCV`, `LassoCV`), jamais en regardant quel alpha flatte le test.

Le modèle linéaire ordinaire reste la référence. Si Ridge ne bat ni la droite simple ni la moyenne, la pénalité n'était pas le sujet : le signal n'est pas dans une somme de ces colonnes.

# La baseline qui prédit la moyenne

Avant d'admirer une RMSE, demandez-vous ce qu'obtiendrait quelqu'un qui ignore les variables et répond toujours la même chose : la moyenne de la cible sur l'entraînement.

C'est la baseline. Elle est volontairement bête. Elle est aussi le minimum syndical. Un modèle qui ne la bat pas sur le test n'a pas appris de structure utile. Il a peut-être appris le train, ou il a été gêné par une préparation mauvaise. Vous ne le livrez pas.

```python
from sklearn.dummy import DummyRegressor
from sklearn.metrics import mean_squared_error

baseline = DummyRegressor(strategy="mean")
baseline.fit(X_train, y_train)
err_base = mean_squared_error(y_test, baseline.predict(X_test)) ** 0.5
err_modele = mean_squared_error(y_test, lineaire.predict(X_test)) ** 0.5
```

`DummyRegressor(strategy="mean")` prédit, pour chaque ligne de test, la moyenne des `y` d'entraînement. Vous comparez `err_modele` et `err_base` sur **les mêmes** lignes. Un gain de 2 % de RMSE se dit avec modestie. Un modèle pire que la moyenne s'arrête là : vous revenez aux variables, à la fuite, ou au fait que la liaison n'est pas linéaire.

Le R² raconte une histoire voisine, avec une subtilité : calculé sur le test, un R² de 0 correspond à la moyenne des `y` **de ce test**, que vous ne connaîtriez pas à l'avance. La baseline à la moyenne du train est le comparatif opérationnel. Gardez les deux : le R² pour situer, la RMSE de la baseline pour décider.

# Quand s'arrêter à la régression linéaire

Vous vous arrêtez à ce modèle, au moins pour un temps, quand trois conditions tiennent ensemble.

- Il bat clairement la moyenne sur un test que vous n'avez pas utilisé pour fabriquer les variables.
- L'erreur en euros (MAE, et un coup d'œil aux grosses erreurs) est acceptable pour la décision.
- Les coefficients, une fois les unités alignées, se racontent sans contredire le métier. Un signe absurde est soit une variable mal codée, soit une corrélation que vous n'avez pas le droit d'interpréter comme un levier.

Vous passez à autre chose (arbre, forêt) quand le résidu a une forme évidente : l'erreur change avec la surface, deux populations se cachent dans le nuage, des interactions que vous ne savez pas écrire dominent. Vous n'y passez pas seulement parce qu'un algorithme plus célèbre existe.

Et vous n'ajoutez pas de variables jusqu'à ce que le train soit parfait. Une droite trop riche, surtout avec un Lasso mal surveillé ou des indicateurs de modalités rares, mémorise. Le juge reste le test, après la baseline.

# Exercices

## Exercice 1 : Qui bat la moyenne ?

Sur un test de prix, la baseline « moyenne du train » a une RMSE de 80 000 €. Le modèle A a une RMSE de 76 000 € et une MAE de 55 000 €. Le modèle B a une RMSE de 95 000 € et une MAE de 40 000 €.

Lequel retenez-vous si une erreur de 200 000 € sur une villa est grave ? Lequel si le métier veut l'erreur typique la plus basse ? Que dites-vous de B face à la baseline ?

<details>
<summary>Voir la solution</summary>

Si les erreurs graves comptent, vous regardez la **RMSE** : A (76 000) bat la baseline (80 000) et bat B (95 000). B est pire que prédire la moyenne au sens des carrés : quelques très gros écarts l'emportent, même si son erreur typique est plus basse.

Si le métier veut l'erreur typique, la **MAE** désigne B (40 000 contre 55 000). Vous le dites explicitement, et vous montrez quand même que sa RMSE dépasse la baseline : B se trompe « un peu » souvent et « beaucoup » parfois.

Vous ne livrez pas B pour un usage où la villa catastrophique est inacceptable. Vous ne livrez pas A en prétendant que 76 000 contre 80 000 est une révolution : le gain existe, il est modeste.

</details>

## Exercice 2 : Le coefficient de la pièce

Après centrage-réduction, le coefficient du nombre de pièces vaut +18 000 € par écart-type. Sans centrage, il valait +9 000 € par pièce. Un collègue écrit : « ajouter une pièce fait gagner 9 000 €, donc il faut construire des pièces ».

Que corrigez-vous ?

<details>
<summary>Voir la solution</summary>

Le coefficient est un écart de **prédiction** associé à une pièce de plus, les autres colonnes du modèle tenues fixes. Ce n'est pas l'effet causal de construire une pièce : la pièce va avec une surface, un quartier, un étage, dont une partie manque peut-être au modèle.

Les 9 000 € sont « par pièce », les 18 000 € sont « par écart-type de la distribution d'entraînement ». Vous ne les additionnez pas et vous ne les comparez pas à un coefficient de surface exprimé en euros par mètre carré.

La phrase du slide se reformule : « dans ce modèle, à colonnes égales, une pièce supplémentaire est associée à environ 9 000 € de prix prédit ». Le « donc il faut construire » ne suit pas.

</details>

## Exercice 3 : Ridge ou Lasso ?

Vous avez 60 variables numériques, plusieurs paires très corrélées (surface habitable et surface Carrez), et vous aimeriez un modèle stable plutôt qu'une liste courte de variables « gagnantes ». Un second projet, plus tard, a 200 variables dont vous pensez que seules quelques-unes portent le prix.

Quel pénaliseur proposez-vous dans chaque cas, et quelle précaution commune prenez-vous ?

<details>
<summary>Voir la solution</summary>

Premier cas : **Ridge**. Il rétrécit les coefficients sans en mettre arbitrairement un à zéro quand deux surfaces se recouvrent. La prédiction reste stable. Le Lasso risquerait de garder Carrez et de jeter l'habitable, ou l'inverse, selon le partage.

Second cas : **Lasso**, si vous acceptez une sélection et le fait que, parmi deux colonnes liées, une seule restera, de façon instable. Vous vérifiez la sélection sur plusieurs découpes du train avant d'en faire une histoire.

Précaution commune : `StandardScaler` **dans** le pipeline, ajusté sur le train, et `alpha` choisi par validation croisée sur le train, pas sur le test. Vous comparez les deux à la régression ordinaire et à la moyenne.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Régression linéaire"
center: "Une somme de pentes ne vaut que si elle bat la moyenne, sur le test."
points:
  - icon: chart
    title: "Somme pondérée"
    text: "Constante plus coefficients. Les courbes doivent déjà être dans les colonnes."
  - icon: gauge
    title: "RMSE, MAE, R²"
    text: "Les gros écarts, l'erreur typique, puis la comparaison à la moyenne des y."
  - icon: scale
    title: "Coefficient"
    text: "Écart de prédiction, autres colonnes du modèle fixes. Pas une cause."
  - icon: shield
    title: "Ridge et Lasso"
    text: "Ridge rapetisse tout. Lasso peut mettre des zéros. Les deux exigent une échelle."
  - icon: target
    title: "Baseline"
    text: "Prédire la moyenne du train. En dessous, le modèle ne sort pas du notebook."
pitfall: "Choisir l'alpha de Ridge sur le test, ou comparer des coefficients d'unités différentes."
remember: "Le juge est la RMSE sur le test, face à la moyenne, pas le R² du train."
```
