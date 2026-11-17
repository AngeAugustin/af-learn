---
title: Enchaîner la préparation dans un pipeline
description: Utiliser ColumnTransformer et Pipeline pour imputer, coder et modéliser, n'ajuster le fit que sur le train, éviter les fuites, et rendre l'expérience reproductible.
duration: 65
objectives:
  - Assembler un ColumnTransformer qui traite chaque type de colonne à part
  - Enchaîner préparation et modèle dans un Pipeline ajusté sur le seul train
  - Repérer les fuites qu'un pipeline bien placé empêche, et celles qu'il n'empêche pas
  - Rendre un essai reproductible (graine, ordre des étapes, objet conservé)
---

# Pourquoi enchaîner préparation et modèle

Dès que la préparation calcule quelque chose sur les données (une médiane, une moyenne, une liste de modalités, une mise à l'échelle), ce calcul fait partie du modèle. Si vous le faites dans un notebook, à la main, puis que vous entraînez « à côté », vous finirez par l'oublier sur le test ou par le recalculer sur tout le fichier.

Un pipeline est cet enchaînement rendu obligatoire : les mêmes étapes, dans le même ordre, avec des statistiques apprises au bon moment. Vous en tirez quatre garanties, à condition de ne pas ajuster l'objet sur l'ensemble du fichier.

- Le test subit exactement les transformations du train, avec les statistiques du train.
- Une validation croisée réajuste tout le pipeline à chaque bloc, donc la médiane d'un bloc n'est pas calculée avec les lignes des autres.
- La production appelle `predict` sur l'objet déjà ajusté, sans recopier une médiane dans un second script.
- L'essai se relit : les étapes ont des noms, la graine est écrite, l'ordre est le code.

> [!NOTE]
> Le pipeline ne choisit pas la bonne préparation à votre place. Il applique fidèlement celle que vous avez écrite, y compris une fuite si vous avez mis la cible dans une colonne avant de le construire.

# ColumnTransformer, un traitement par type

Toutes les colonnes ne se préparent pas ensemble. Les montants veulent une médiane et souvent une mise à l'échelle. Les catégories veulent une modalité de repli et un codage. `ColumnTransformer` applique un petit pipeline à chaque liste de colonnes, puis recolle les résultats.

Deux détails évitent les mauvaises surprises.

**Le reste est jeté par défaut** (`remainder="drop"`). Toute colonne absente de vos listes disparaît sans erreur. Si le score est étrangement faible, vérifiez que vous n'avez pas oublié la surface dans la liste numérique. `remainder="passthrough"` garde le reste tel quel : utile seulement si ce reste est déjà numérique et propre. Sinon vous réinjectez une clé ou une catégorie brute.

**L'ordre des colonnes en sortie n'est plus celui du tableau d'origine.** Il suit l'ordre des transformeurs. Pour lire un coefficient, vous demandez les noms de sortie (`get_feature_names_out`), vous ne comptez pas sur la position 3.

```python
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

preprocess = ColumnTransformer(
    transformers=[
        ("num", Pipeline([
            ("impute", SimpleImputer(strategy="median")),
            ("scale", StandardScaler()),
        ]), ["surface", "pieces"]),
        ("cat", Pipeline([
            ("impute", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore")),
        ]), ["quartier"]),
    ]
)
```

La médiane et le centrage ne voient que les colonnes numériques. Le one-hot ne voit que le quartier. Chacun apprendra ses statistiques au moment du `fit`, pas à la construction de l'objet. Construire le `ColumnTransformer` ne regarde pas encore les données.

# L'objet Pipeline

`Pipeline` est une liste nommée d'étapes. Toutes, sauf la dernière, transforment. La dernière prédit : régression, classification, ou même un simple estimateur de référence.

Lors d'un `fit(X, y)` :

1. la première étape fait `fit_transform` sur X (et y seulement si l'étape en a besoin, comme un target encoding) ;
2. la suivante reçoit la sortie de la précédente ;
3. la dernière fait `fit` sur la matrice finale et sur y.

Lors d'un `predict(X_nouveau)`, chaque étape fait `transform` avec ce qu'elle a appris, puis le modèle prédit. Rien n'est réestimé.

Vous accédez à une étape par son nom (`model.named_steps["reg"]`) pour lire des coefficients ou une importance. Vous ne réécrivez pas la préparation à côté pour « inspecter ». L'inspection doit passer par le même objet, sinon vous lisez une autre médiane que celle du modèle.

```diagram
type: pipeline
title: Un seul objet, du tableau à la prédiction
lanes:
  - title: Colonnes numériques
    steps:
      - title: Médiane
        text: Apprise sur le train
        tone: blue
      - title: Mise à l'échelle
        text: Moyenne et écart du train
        tone: teal
  - title: Colonnes catégorielles
    steps:
      - title: Modalité de repli
        text: Mode du train, ou « inconnu »
        tone: amber
      - title: One-hot
        text: Niveaux du train, inconnu ignoré
        tone: violet
  - title: Modèle
    steps:
      - title: Fit sur le train
        text: Après toutes les transformations
        tone: rose
      - title: Predict
        text: Transform fige, puis prédit
        tone: rose
```

```video
url: https://www.youtube.com/watch?v=jzKSAeJpC6s
title: "Understanding Pipeline in Machine Learning with Scikit-learn (sklearn pipeline)"
channel: "Dr. Data Science"
duration: "9:07"
lang: en
why: "Comment fonctionnent les pipelines scikit-learn, et pourquoi ils protègent du fit sur les données de test."
```

# Ajuster le fit au seul train

Le pipeline empêche une classe de fautes : oublier d'appliquer au test la même préparation, ou la réapprendre sur le test. Il n'empêche pas la faute parente, qui est de l'ajuster sur toutes les lignes.

L'ordre reste : séparer d'abord, `fit` sur le train, `predict` ou `score` sur le test. La validation croisée s'appelle sur le train (ou sur l'objet pipeline et le train), jamais après avoir regardé le test pour choisir un codage.

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
model.fit(X_train, y_train)
score_test = model.score(X_test, y_test)
```

Ce qui fuit encore, même « dans » un pipeline, si vous le préparez mal :

- une colonne déjà calculée avec la cible ou avec tout le fichier (prix au mètre carré, moyenne de quartier globale) avant le `fit` ;
- un choix de variables fait en regardant les erreurs du test ;
- un `fit` sur X entier, suivi d'un score sur un morceau de ce même X.

Ce qu'il empêche, dès que imputer, scaler et encodeur sont **dedans** et que le `fit` ne voit que le train : la médiane du test, la moyenne de centrage du test, la liste de modalités enrichie par le test.

> [!CAUTION]
> `StandardScaler().fit_transform(X)` sur toute la table, puis un split, puis un modèle, annule la précaution. La moyenne et l'écart du test sont entrés dans le train. Placez le scaler dans le pipeline, après le split.

# Un exemple court qui tourne

L'exemple suivant est autonome. Il fabrique un petit tableau, y perce des trous, sépare, puis ajuste une régression ridge. La médiane, le centrage et les colonnes de quartier sont appris sur les seules lignes d'entraînement. `random_state=42` fixe le partage.

```python
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import Ridge
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

rng = np.random.default_rng(0)
df = pd.DataFrame({
    "surface": rng.normal(50, 15, 200),
    "pieces": rng.integers(1, 6, 200),
    "quartier": rng.choice(["nord", "sud", "est"], 200),
})
df["prix"] = (
    150_000
    + df["surface"] * 3_000
    + df["pieces"] * 8_000
    + df["quartier"].map({"nord": 0, "sud": 20_000, "est": 10_000})
    + rng.normal(0, 15_000, 200)
)
df.loc[rng.choice(200, 15, replace=False), "surface"] = np.nan

X = df[["surface", "pieces", "quartier"]]
y = df["prix"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

preprocess = ColumnTransformer(
    transformers=[
        ("num", Pipeline([
            ("impute", SimpleImputer(strategy="median")),
            ("scale", StandardScaler()),
        ]), ["surface", "pieces"]),
        ("cat", Pipeline([
            ("impute", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore")),
        ]), ["quartier"]),
    ]
)
model = Pipeline([("prep", preprocess), ("reg", Ridge(alpha=1.0))])
model.fit(X_train, y_train)
print(round(model.score(X_test, y_test), 3))
```

Vous pouvez relancer la cellule : le même partage, les mêmes trous, le même score. Le prix a été simulé à partir de la surface, des pièces et du quartier, avec un bruit. Le chiffre affiché montre que la mécanique tient sur cet exemple, pas qu'un vrai marché se prévoit ainsi.

Pour lire le modèle : `model.named_steps["prep"].get_feature_names_out()` donne les colonnes après one-hot, et `model.named_steps["reg"].coef_` les coefficients dans le même ordre. Sans les noms, un coefficient n'a pas de variable.

# Rendre l'expérience reproductible

Deux personnes qui relancent votre notebook doivent obtenir le même partage et le même objet. Cela tient à peu de choses, toutes écrites dans le code.

- **Une graine** sur `train_test_split` et sur tout estimateur qui tire au hasard (forêt, sous-échantillons). `random_state=42` n'est pas magique. Il est simplement déclaré.
- **L'ordre des étapes dans le pipeline**, qui est l'ordre réel de la préparation. Pas une cellule plus haut qui modifie `X` sans être dans l'objet.
- **Les versions** des bibliothèques, notées au moins dans l'environnement du projet. Un one-hot ne nomme pas toujours ses colonnes de la même façon d'une version à l'autre.
- **L'objet ajusté**, conservé (par exemple avec `joblib`) si vous devez prédire plus tard. Recopier la médiane dans un commentaire ne se rejoue pas.

La reproductibilité n'est pas la justesse. Un pipeline faux, avec une fuite en amont, se rejoue très bien et se trompe avec constance. Vous rendez reproductible une procédure déjà honnête : split, fit sur le train, métrique sur le test, décisions d'EDA écrites à côté.

Quand vous comparez deux modèles, vous les mettez chacun en dernière étape du **même** préprocesseur, sur le **même** partage. Sinon vous comparez aussi deux imputations et deux coups de chance.

# Exercices

## Exercice 1 : Où le fit a-t-il lieu ?

Vous avez un pipeline : médiane, puis `StandardScaler`, puis one-hot du quartier, puis `Ridge`. Vous appelez `fit` sur le train, puis `score` sur le test.

Pour la médiane de la surface, la moyenne du scaler, et les colonnes du one-hot, dites sur quelles lignes elles sont apprises, et si le `score` les réapprend.

<details>
<summary>Voir la solution</summary>

Les trois sont apprises pendant `fit`, **sur le train seulement**, après que chaque étape a reçu la sortie de la précédente. La médiane ne voit que la surface d'entraînement. Le scaler voit la surface déjà imputée de l'entraînement. Le one-hot voit les quartiers de l'entraînement.

`score` appelle `predict`, donc `transform` : il réutilise médiane, moyenne, écart et liste de modalités. Il ne les recalcule pas sur le test. Un quartier absent du train est ignoré si `handle_unknown="ignore"`, il n'ajoute pas une colonne.

</details>

## Exercice 2 : Le scaler trop tôt

Voici le code d'un collègue.

```python
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

X_scaled = StandardScaler().fit_transform(X)
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=0
)
LinearRegression().fit(X_train, y_train)
```

Quelle statistique a fui ? Réécrivez le geste correct, en une phrase et dans un pipeline.

<details>
<summary>Voir la solution</summary>

`fit_transform(X)` cale la moyenne et l'écart-type sur **toutes** les lignes, test compris. Le train est donc centré avec une statistique qui a vu le test. En production, ces lignes futures n'existeraient pas : le centrage n'est pas celui que vous pourrez refaire.

Geste correct : `train_test_split` sur X brut, puis un `Pipeline` dont la première étape est `StandardScaler` (après imputation si besoin), `fit` sur le train, `score` sur le test. Le scaler ne voit le test qu'en `transform`.

</details>

## Exercice 3 : La colonne disparue

Le tableau a `surface`, `pieces`, `quartier` et `id_bien`. Le `ColumnTransformer` ne cite que `surface` et `quartier`. Le modèle s'entraîne sans erreur, et le score est médiocre.

Que sont devenues `pieces` et `id_bien` ? Que devriez-vous changer ?

<details>
<summary>Voir la solution</summary>

Avec `remainder="drop"` (le défaut), les deux colonnes sont **supprimées** sans message. `pieces` devait sans doute entrer dans le pipeline numérique : son absence peut expliquer le score faible. `id_bien` est une clé : la supprimer est au contraire souhaitable. Vous l'écrivez explicitement, plutôt que de la laisser tomber par oubli.

Vous ajoutez `pieces` à la liste numérique. Vous ne mettez pas `id_bien` en `passthrough`. Si vous gardez un jour `remainder="passthrough"`, vous relisez la liste des colonnes qui passent, pour ne pas y laisser une clé ou une catégorie non codée.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Pipelines scikit-learn"
center: "Le fit apprend sur le train. Le predict ne fait que réappliquer."
points:
  - icon: layers
    title: "ColumnTransformer"
    text: "Un traitement par type de colonne. Le reste est jeté si vous ne le citez pas."
  - icon: tool
    title: "Pipeline"
    text: "Imputer, coder, puis modèle. Un fit, un predict, les mêmes étapes partout."
  - icon: lock
    title: "Train seulement"
    text: "Médiane, moyenne, modalités et target encoding ne voient pas le test."
  - icon: alert
    title: "Fuite en amont"
    text: "Une colonne déjà calculée avec la cible traverse le pipeline sans être lavée."
  - icon: loop
    title: "Même objet"
    text: "Même préprocesseur pour comparer deux modèles. Graine écrite, objet conservé."
pitfall: "Centré-réduire toute la table, couper ensuite, et croire le pipeline inutile."
remember: "Construire le pipeline ne regarde pas les données. Seul le fit sur le train le fait."
```
