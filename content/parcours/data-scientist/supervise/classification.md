---
title: Classifier avec une probabilité
description: Utiliser la régression logistique, déplacer le seuil, lire une matrice de confusion, calculer précision, rappel et F1, et ne plus se fier à l'accuracy quand les classes sont déséquilibrées.
duration: 65
objectives:
  - Décrire la régression logistique comme un score transformé en probabilité
  - Déplacer le seuil de décision selon le coût des erreurs
  - Lire une matrice de confusion et en tirer précision, rappel et F1
  - Expliquer pourquoi l'accuracy rassure à tort quand une classe est rare
---

# Une probabilité, pas une étiquette magique

La régression logistique classe un cas en deux camps (partir ou rester, défaut ou non) en passant par une **probabilité**. Elle calcule d'abord un score linéaire, le même genre de somme que la régression : `z = b0 + b1 × x1 + ...`. Puis elle le transforme en une probabilité entre 0 et 1, en forme de S : très négatif, proche de 0 ; très positif, proche de 1 ; autour de 0, proche d'un pile ou face.

Le nom prête à confusion. Ce n'est pas une régression qui prédit un prix. C'est un classifieur. La partie « linéaire » porte sur le **logarithme des chances** (le log-odds), pas sur la probabilité elle-même. Doubler un revenu ne double pas la probabilité de défaut. Cela ajoute une quantité fixe au score `z`, et la probabilité bouge d'autant plus que vous étiez loin de 0 % ou de 100 %.

Un coefficient positif augmente le score, donc la probabilité estimée, les autres colonnes du modèle tenues fixes. Comme en régression, ce n'est pas une cause. Les variables se centrent et se réduisent dans le pipeline si vous voulez comparer les coefficients, et la même préparation sert au test.

```python
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

clf = make_pipeline(
    StandardScaler(),
    LogisticRegression(max_iter=1000),
)
clf.fit(X_train, y_train)
proba = clf.predict_proba(X_test)[:, 1]
```

`predict_proba` donne deux colonnes, probabilité de la classe 0 et de la classe 1. Vous gardez la colonne de la classe positive, celle que vous avez définie comme l'événement (le défaut, la résiliation), pas « la colonne de droite » sans avoir vérifié `clf.classes_`.

> [!NOTE]
> La logistique est un excellent premier modèle : rapide, lisible, difficile à faire dérailler sur un tableau déjà propre. Elle ne fabrique pas d'interactions. Si le risque change du tout au tout selon un croisement de variables, il faudra les écrire, ou passer à un arbre.

```video
url: https://www.youtube.com/watch?v=yIYKR4sgzI8
title: "StatQuest: Logistic Regression"
channel: "StatQuest with Josh Starmer"
duration: "8:48"
lang: en
why: "La régression logistique en huit minutes par StatQuest : une courbe en S qui produit une probabilité."
```

# Déplacer le seuil

Une probabilité n'est pas encore une décision. Vous décidez « positif » quand elle dépasse un **seuil**. Le défaut des bibliothèques est 0,5. Ce nombre n'a rien de sacré. Il est raisonnable quand les deux classes ont à peu près le même poids et que se tromper dans un sens coûte comme se tromper dans l'autre. Le reste du temps, vous le choisissez.

- Baisser le seuil (0,2 par exemple) produit plus d'alertes. Vous ratez moins d'événements, vous en inventez plus.
- Monter le seuil (0,8) produit moins d'alertes. Chaque alerte est plus sûre, davantage d'événements passent au travers.

Le bon seuil dépend du coût. Rater une fraude grave n'a pas le même prix qu'un contrôle manuel inutile. Bloquer à tort un paiement honnête n'a pas le même prix que laisser passer un petit litige. Vous écrivez ces deux coûts avec le métier avant de figer 0,5.

Vous choisissez le seuil sur un jeu de **validation** tiré de l'entraînement, ou par validation croisée. Vous ne le réglez pas sur le test. Sinon le test a servi à décider, et le chiffre que vous annoncerez est optimiste. Une fois le seuil figé, vous le reportez tel quel sur le test, une seule fois.

```python
seuil = 0.30
alerte = (proba >= seuil).astype(int)
```

# Lire une matrice de confusion

Pour un événement que vous appelez positif, chaque ligne du test tombe dans une case.

|  | Prédit positif | Prédit négatif |
|---|---|---|
| Vraiment positif | Vrai positif (VP) | Faux négatif (FN), l'événement raté |
| Vraiment négatif | Faux positif (FP), l'alarme à tort | Vrai négatif (VN) |

Exemple concret. 1 000 clients, 50 résiliations réelles. Le modèle lève 40 alertes, dont 20 sont de vraies résiliations.

- VP = 20, FP = 20, FN = 30, VN = 930.
- Vous avez trouvé 20 départs sur 50, et la moitié de vos appels étaient inutiles.
- Les 930 « bien classés » parmi ceux qui restent dominent le tableau. C'est là que l'accuracy va se cacher.

Vous lisez toujours les quatre cases, avec les effectifs bruts, avant tout pourcentage. Un rappel de 100 % sur 3 positifs n'est pas une politique. `confusion_matrix` de scikit-learn ordonne les classes. Vérifiez que la classe positive est bien celle que vous croyez, surtout si les étiquettes sont des chaînes de caractères.

```diagram
type: stack
title: "1 000 clients, 50 résiliations, 40 alertes"
segments:
  - label: Vrais négatifs
    value: 930
    tone: blue
    text: Restés, et non alertés
  - label: Faux négatifs
    value: 30
    tone: rose
    text: Départs ratés
  - label: Vrais positifs
    value: 20
    tone: teal
    text: Départs joints
  - label: Faux positifs
    value: 20
    tone: amber
    text: Alertes inutiles
```

# Précision, rappel et F1

Trois taux se lisent directement sur la matrice. Ils parlent de la classe positive.

**La précision** répond : parmi les alertes, combien sont justes ? `VP / (VP + FP)`. Dans l'exemple, 20 / 40 = 0,50. Une précision haute veut dire peu d'alarmes pour rien. Elle ne dit pas combien d'événements vous avez laissés filer.

**Le rappel** (aussi appelé sensibilité) répond : parmi les vrais événements, combien avez-vous trouvés ? `VP / (VP + FN)`. Ici, 20 / 50 = 0,40. Un rappel haut rate peu de cas. Il ne dit pas si vous noyez l'équipe sous les fausses alertes.

**Le F1** est la moyenne harmonique des deux : `2 × précision × rappel / (précision + rappel)`. Il baisse fort dès que l'un des deux est faible. Ici, `2 × 0,50 × 0,40 / 0,90 ≈ 0,44`. C'est un résumé commode quand la classe positive est rare et que vous tenez aux deux côtés. Ce n'est pas le coût métier. Si un faux négatif coûte dix fois un faux positif, vous optimisez ce coût, pas le F1.

Précision et rappel bougent en sens inverse quand vous déplacez le seuil. Baisser le seuil relève en général le rappel et abaisse la précision. Il n'existe pas de seuil « objectivement meilleur » sans dire lequel des deux maux vous préférez.

> [!TIP]
> Annoncez toujours la classe dont vous parlez. Une précision de 0,97 sur la classe « reste client », majoritaire, peut coexister avec un rappel misérable sur les résiliations. Le chiffre utile est celui de l'événement que vous voulez attraper.

# Classes déséquilibrées

Le déséquilibre est la situation normale : peu de fraudes, peu de pannes, peu de résiliations. Un fichier à 99 % de négatifs n'est pas un fichier « facile ». C'est un fichier où ne rien détecter a l'air brillant.

Trois gestes, dans l'ordre, avant toute recette exotique.

1. **Partager en stratifié.** `train_test_split(..., stratify=y)` garde à peu près la même proportion de positifs dans le train et dans le test. Un coup de malchance qui met tous les défauts d'un côté rend le score illisible.
2. **Peser la classe rare à l'apprentissage.** `class_weight="balanced"` augmente le coût des erreurs sur la classe minoritaire dans la logistique. Le modèle arrête d'ignorer les 1 % parce qu'ils pèsent peu dans la moyenne. Vous recontrôlez le seuil ensuite : le poids change les probabilités, il ne choisit pas la décision à votre place.
3. **Noter la classe qui compte.** Rappel, précision, F1, ou un coût. Vous affichez la matrice. Vous ne pilotez pas au taux de bonnes réponses global.

Créer des faux positifs par copie avant le split (un sur-échantillonnage fait sur tout le fichier) répète les mêmes lignes des deux côtés de l'évaluation. Le score devient optimiste. Si vous sur-échantillonnez, cela se passe **dans** le train, jamais avant la coupe, et le test reste à la fréquence réelle. Souvent, le poids de classe et un seuil déplacé suffisent, et ils sont plus honnêtes.

# L'accuracy qui rassure à tort

L'accuracy est la part de lignes bien classées : `(VP + VN) / total`. Dans l'exemple, `(20 + 930) / 1000 = 0,95`. Un modèle qui n'alerte **jamais** obtient `(0 + 950) / 1000 = 0,95` aussi, avec un rappel de zéro. Les deux phrases « 95 % de réussite » décrivent des produits opposés.

Elle devient un bon résumé seulement quand les classes sont proches du fifty-fifty **et** que les deux erreurs ont un coût voisin. Dès qu'une classe dépasse largement l'autre, le VN remplit le numérateur. Vous pouvez gagner de l'accuracy en alertant moins, c'est-à-dire en devenant aveugle à l'événement.

La baseline de classification, à mettre à côté de la moyenne en régression, est le classifieur constant : toujours la classe majoritaire, ou toujours « pas d'alerte ». `DummyClassifier(strategy="most_frequent")` le fait. S'il égale votre accuracy, vous n'avez rien montré. Comparez-le sur le rappel de la classe rare : le constant y vaut zéro. Votre modèle doit faire mieux **là**, pas sur le pourcentage global.

```python
from sklearn.dummy import DummyClassifier
from sklearn.metrics import accuracy_score, recall_score

constant = DummyClassifier(strategy="most_frequent")
constant.fit(X_train, y_train)
# L'accuracy du constant est déjà très haute si la classe positive est rare.
# Le rappel de la classe positive, lui, vaut 0.
```

Avant de livrer, vous montrez la matrice, la précision, le rappel, le seuil choisi, et l'écart à cette baseline. Un slide qui ne contient que « 97 % d'accuracy » sur un événement à 2 % n'est pas un résultat. C'est un angle mort.

# Exercices

## Exercice 1 : Remplir la matrice

Sur 2 000 dossiers, 100 fraudes réelles. Le modèle alerte 80 fois et touche 50 fraudes.

Calculez VP, FP, FN, VN, précision, rappel, F1 et accuracy. Comparez à la stratégie « ne jamais alerter ».

<details>
<summary>Voir la solution</summary>

- VP = 50, FP = 30 (80 alertes moins 50 justes), FN = 50 (100 fraudes moins 50 trouvées), VN = 1 870 (1 900 dossiers honnêtes moins 30 fausses alertes). Vérification : 50 + 30 + 50 + 1 870 = 2 000.
- Précision = 50 / 80 = 0,625.
- Rappel = 50 / 100 = 0,50.
- F1 = 2 × 0,625 × 0,50 / (0,625 + 0,50) = 0,625 / 1,125 ≈ 0,56.
- Accuracy = (50 + 1 870) / 2 000 = 0,96.

Ne jamais alerter : VP = 0, FP = 0, FN = 100, VN = 1 900. Accuracy = 1 900 / 2 000 = 0,95. Rappel = 0. Votre modèle ne gagne qu'un point d'accuracy et, surtout, trouve la moitié des fraudes au prix de 30 contrôles inutiles. C'est ce second point que vous présentez, pas le 96 %.

</details>

## Exercice 2 : Quel seuil ?

Un contrôle manuel coûte 10 €. Laisser passer une fraude coûte 200 €. Aujourd'hui, au seuil 0,5, vous avez un rappel bas et peu de fausses alertes. Le métier veut rater moins de fraudes et accepte plus de contrôles.

Dans quel sens déplacez-vous le seuil, et pourquoi ne le réglez-vous pas sur le test ?

<details>
<summary>Voir la solution</summary>

Vous **baissez** le seuil. Plus de dossiers passent en alerte : le rappel monte, la précision baisse, les contrôles se multiplient. Le coût d'une fraude ratée (200 €) est bien plus haut que celui d'un contrôle (10 €), donc rater moins justifie des faux positifs supplémentaires, tant que le compte global s'améliore.

Vous cherchez ce seuil sur un jeu de validation issu du train, en estimant le coût `200 × FN + 10 × FP`. Une fois le seuil choisi, vous l'appliquez **une fois** au test pour annoncer le résultat. Le régler sur le test utiliserait les réponses d'évaluation pour prendre la décision, et le coût annoncé serait trop beau.

</details>

## Exercice 3 : L'accuracy de 98 %

Un modèle de panne rare (2 % de pannes) affiche 98 % d'accuracy. Le rappel sur la panne vaut 0. Le commanditaire parle d'un succès.

Que lui répondez-vous, et quelle baseline citez-vous ?

<details>
<summary>Voir la solution</summary>

98 % est exactement le taux de la classe majoritaire : un modèle qui prédit « pas de panne » pour tout le monde obtient la même accuracy, et le même rappel nul. Le chiffre ne montre aucune détection.

La baseline est `DummyClassifier(strategy="most_frequent")`. Vous la mettez dans le même tableau que le modèle, avec la matrice et le rappel de la classe « panne ». Tant que le rappel reste à 0, il n'y a pas de succès, quelle que soit l'accuracy. La suite est un poids de classe, un seuil plus bas, ou des variables qui portent vraiment le signal, puis une nouvelle matrice.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Classification logistique"
center: "Une probabilité, un seuil choisi, une matrice. L'accuracy vient en dernier."
points:
  - icon: chart
    title: "Score en probabilité"
    text: "Somme linéaire, puis courbe en S. La probabilité n'est pas proportionnelle au score."
  - icon: scale
    title: "Le seuil se déplace"
    text: "0,5 n'est qu'un défaut. Le coût des ratés et des fausses alertes le fixe."
  - icon: target
    title: "Précision et rappel"
    text: "Alertes justes, événements trouvés. Le F1 résume, il ne remplace pas le coût."
  - icon: alert
    title: "Classe rare"
    text: "Partage stratifié, poids de classe, score sur l'événement, pas sur la masse des non."
  - icon: gauge
    title: "Accuracy piège"
    text: "Toujours prédire « non » affiche déjà le taux de la majorité."
pitfall: "Annoncer 98 % de réussite sur un événement à 2 %, avec un rappel de zéro."
remember: "Réglez le seuil hors du test, puis montrez la matrice de la classe qui compte."
```
