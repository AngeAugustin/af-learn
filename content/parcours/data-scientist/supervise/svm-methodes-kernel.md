---
title: Marges et méthodes à noyau
description: Comprendre la marge et le noyau à l'intuition, savoir quand un SVM reste utile, et expliquer pourquoi les arbres l'emportent souvent sur des données tabulaires.
duration: 60
objectives:
  - Expliquer la marge maximale et le rôle des vecteurs de support
  - Décrire un noyau comme une similarité qui trace des frontières courbes
  - Régler l'échelle des variables et le compromis porté par C
  - Choisir entre SVM et arbres selon la taille, le type de tableau et la forme de la frontière
---

# La marge la plus large

Un séparateur linéaire coupe deux classes par une frontière droite (une droite en deux dimensions, un hyperplan au-delà). Il en existe souvent une infinité. Le SVM, machine à vecteurs de support, choisit celle qui laisse la **bande vide la plus large** entre les deux groupes. Cette bande est la marge.

Les points qui touchent le bord de la bande sont les **vecteurs de support**. Ce sont eux qui définissent la frontière. Un point bien au milieu de son camp peut disparaître sans que la coupe bouge. Un point sur la marge, non. D'où le nom : la décision repose sur quelques cas limites, pas sur la foule des cas évidents.

Pourquoi la bande large plutôt qu'une frontière qui frôle les points ? Une frontière collée à un ou deux dossiers d'entraînement dépend de ces dossiers. Une bande large laisse de l'air. Sur un cas nouveau, proche de ceux déjà vus, vous avez moins de chances de basculer pour un détail. C'est une forme de prudence, du même esprit qu'une pénalité qui empêche un modèle de coller au train.

Les données réelles se mélangent. Exiger une bande parfaitement vide force la frontière à se tordre autour de chaque exception, ou rend le problème impossible. Le **marge souple** autorise des points du mauvais côté, en les faisant payer. Le paramètre `C` règle l'amende. `C` grand : vous tolérez peu d'erreurs d'entraînement, la bande se rétrécit, le modèle colle davantage au train. `C` petit : vous acceptez des points mal classés, la bande s'élargit, la frontière est plus lisse. Comme `alpha` pour Ridge, `C` ne se choisit pas sur le test.

```python
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

svm = make_pipeline(
    StandardScaler(),
    SVC(kernel="rbf", C=1.0),
)
svm.fit(X_train, y_train)
```

`SVC` prédit une classe. La probabilité n'est pas là par défaut : l'objet optimise une marge, pas une vraisemblance. `probability=True` ajoute un calibrage coûteux. Si vous avez besoin d'un seuil et d'une probabilité lisible, la régression logistique ou un arbre le donnent plus directement. Le SVM, lui, donne d'abord un score de côté de la frontière (`decision_function`).

# Le noyau, sans formule opaque

Certaines classes ne se séparent pas par une droite. L'exemple classique est un groupe au centre, entouré d'un anneau d'une autre classe. Toute droite laisse un camp de chaque côté. Il faudrait un cercle.

Un **noyau** permet au SVM de se comporter comme s'il avait envoyé les points dans un espace plus riche, où une coupe droite redevient possible, sans que vous écriviez ces nouvelles coordonnées. Vous ne voyez qu'une fonction de similarité entre deux lignes.

Deux noyaux couvrent presque tous les usages.

- **Linéaire.** La similarité est un produit des variables. Vous retrouvez une marge large, sans courbe. C'est le bon outil quand les variables sont déjà nombreuses et informatives, en particulier un texte transformé en présences de mots : beaucoup de colonnes, beaucoup de zéros, une frontière droite souvent suffisante.
- **RBF** (radial, gaussien). Deux lignes se ressemblent quand elles sont proches. La frontière peut devenir une courbe, un îlot, un contour. `gamma` dit à quelle distance la similarité s'éteint. `gamma` grand : seule la très proche voisine compte, la frontière se plisse autour de chaque point, l'overfitting guette. `gamma` petit : des points éloignés s'influencent encore, la frontière reste douce. `gamma="scale"` est un défaut raisonnable, pas une vérité. Vous le comparez sur une validation.

Le noyau n'est pas une baguette. Il ne crée pas l'information qui n'est pas dans les colonnes. Il change la forme des frontières que vous pouvez tracer à partir de ces colonnes. Un RBF sur deux variables bruitées dessinera de jolies bulles autour du hasard d'entraînement.

```diagram
type: decision
title: Quel usage du SVM ?
nodes:
  - question: "Avez-vous surtout un texte creux, ou beaucoup de colonnes déjà informatives ?"
    yes: "Noyau linéaire. Une marge large suffit souvent, et elle reste tenable."
    no: "Passez à la question suivante."
  - question: "Le tableau est-il de taille moyenne, numérique, avec une frontière nette ?"
    yes: "RBF possible, après mise à l'échelle, C et gamma réglés hors du test."
    no: "Sur un grand tableau mélangé, préférez arbres ou régression logistique."
```

```video
url: https://www.youtube.com/watch?v=efR1C6CvhmE
title: "Support Vector Machines Part 1 (of 3): Main Ideas!!!"
channel: "StatQuest with Josh Starmer"
duration: "20:32"
lang: en
why: "StatQuest présente les idées principales du SVM : marge, vecteurs de support et passage par un noyau."
```

# Échelle des variables et paramètre C

Le noyau RBF, et déjà la marge linéaire dès que les unités diffèrent, regarde des **distances** ou des produits. Une surface entre 10 et 200 et un prix au mètre carré entre 2 000 et 15 000 ne vivent pas sur la même règle. Sans mise à l'échelle, la variable la plus étalée décide seule de qui est « proche ». Le SVM a l'air de rater, alors qu'il a surtout écouté une unité.

`StandardScaler` dans le pipeline, ajusté sur le train, n'est pas un confort. C'est une condition. Les arbres, qui coupent par des seuils, n'ont pas cette obligation. C'est l'une des raisons pour lesquelles on les préfère sur un tableau brut. Ici, vous ne l'oubliez pas.

L'autre réglage est le couple `C` et, pour le RBF, `gamma`. Vous les explorez sur le train par validation croisée, sur une grille courte, pas sur vingt valeurs choisies en regardant le test. Un `C` très grand qui fait 100 % sur le train et chute ensuite est le même symptôme que l'arbre de profondeur infinie : la marge s'est pliée autour des exceptions.

Regardez aussi le nombre de vecteurs de support. S'il approche le nombre de lignes d'entraînement, presque tout le monde est « sur la marge ». La frontière ne s'appuie plus sur quelques cas limites, elle a besoin de tout le fichier. C'est souvent le signe d'un `C` trop grand, d'un `gamma` trop local, ou d'un problème qu'une marge ne résume pas bien.

> [!TIP]
> Commencez par un noyau linéaire et un `C` modéré, dans un pipeline avec scaler. S'il égale déjà la logistique, le RBF devra gagner clairement sur une validation pour justifier ses deux réglages de plus.

# Quand le SVM reste un bon outil

Le SVM n'a pas disparu. Il est devenu un outil de situation, plus une réponse automatique à tout tableau.

Il reste un bon choix dans trois cadres.

- **Taille moyenne.** Quelques milliers à quelques dizaines de milliers de lignes, selon le nombre de colonnes et votre patience. L'ajustement d'un noyau non linéaire se compare aux autres lignes : la mémoire et le temps grossissent beaucoup plus vite que pour un arbre. Au-delà, vous attendez longtemps pour un gain incertain.
- **Frontière assez nette**, sur des variables numériques déjà propres. Quand deux populations se font face avec peu de mélange, la marge large est exactement l'idée juste, et elle généralise bien.
- **Texte creux, noyau linéaire.** Beaucoup de mots, peu de mots par document. Un SVM linéaire y est encore une baseline sérieuse, souvent voisine d'une régression logistique. Vous n'y mettez pas un RBF.

Il est un mauvais réflexe quand le fichier est énorme, mélange catégories, manquants et échelles fantaisistes, ou quand vous avez besoin d'une probabilité et d'une importance à montrer dès le premier comité. Vous pouvez y arriver. Vous irez plus vite ailleurs, pour un résultat au moins aussi bon.

Le SVM a aussi besoin des mêmes hygiènes que les autres : pas de cible dans les colonnes, `fit` sur le train, seuil ou décision évalués hors du test. La marge n'est pas une protection contre la fuite.

# Pourquoi les arbres gagnent souvent sur du tabulaire

Sur un tableau « de gestion » (clients, logements, machines, dossiers), une forêt ou un boosting bat régulièrement le SVM, pour des raisons concrètes plutôt que pour une mode.

- **Types mélangés.** L'arbre coupe un montant, puis une catégorie déjà codée simplement. Le SVM veut des nombres comparables. Le one-hot d'une forte cardinalité le pousse dans un espace ingrat, là où un target encoding plus une marge devient un montage, pas un défaut naturel.
- **Échelle et extrêmes.** Un seuil `surface <= 45` ignore qu'une autre colonne est en millions. Une distance, non. Les valeurs extrêmes tirent la marge. Elles ne font que déplacer un seuil d'arbre.
- **Manquants.** Les bibliothèques de boosting savent apprendre une direction « valeur absente ». Un SVM veut une imputation en amont, et cette imputation pèse sur les distances.
- **Interactions.** Les coupes successives les fabriquent. Le noyau les approche de façon diffuse, plus difficile à raconter, et plus coûteuse.
- **Coût quand les lignes augmentent.** Une forêt ou un boosting en histogrammes encaissent des centaines de milliers de lignes de façon routinière. Un SVM à noyau garde une mémoire des vecteurs de support et se ralentit fortement. Vous le sentez avant d'atteindre le million de dossiers.
- **Livrables.** Probabilité d'un boosting, importance par permutation, arbre court à montrer. Le SVM offre une marge et des supports, ce qui éclaire peu un comité métier sur un tableau de quarante colonnes.

Cela ne rend pas les arbres « meilleurs » dans l'absolu. Sur un texte creux, le SVM linéaire ou la logistique sont souvent plus sobres qu'une forêt. Sur un petit nuage numérique bien séparé, le SVM est élégant et suffisant. Sur le tabulaire large, sale et hétérogène qui fait le quotidien, vous commencez par une baseline linéaire, puis une forêt. Vous n'ouvrez le SVM que si la question a la forme d'une marge.

# Un exemple minimal, dans un pipeline

Le scaler et le SVM vivent dans le même objet. Le `fit` ne voit que le train. Sans le scaler, le RBF écouterait la colonne la plus étalée.

```python
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=0
)
svm = make_pipeline(StandardScaler(), SVC(kernel="rbf", C=1.0))
svm.fit(X_train, y_train)
print(round(svm.score(X_test, y_test), 3))
```

Ce `score` est une accuracy. Vous la lisez avec la matrice et avec la baseline majoritaire, comme pour toute classification. Un beau score de marge sur une classe à 2 % ne dit rien de plus qu'un beau score logistique : regardez le rappel de la classe rare.

Pour trancher avec une forêt sur le même partage, vous comparez le rappel ou le F1 de l'événement, pas le temps passé à régler `gamma`. Si la forêt est devant sans effort, vous gardez la forêt. Le SVM aura servi de témoin, ce qui est déjà un usage honorable.

# Exercices

## Exercice 1 : Qui tient la frontière ?

Deux classes sont bien séparées. Douze points touchent la bande vide. Les autres sont loin, au cœur de leur camp. Vous retirez d'abord un point du cœur, puis un point qui touchait la bande.

Lequel des deux retraits peut déplacer la frontière, et pourquoi le SVM ne s'appuie-t-il pas sur toute la foule ?

<details>
<summary>Voir la solution</summary>

Retirer un point **au cœur** du camp ne déplace en principe pas la frontière : il n'était pas vecteur de support, la bande la plus large reste la même. Retirer un point **sur la bande** peut la déplacer : ces points sont les vecteurs de support, ceux qui définissent la marge.

Le SVM ne s'appuie pas sur toute la foule parce que la règle qu'il cherche est la largeur de la bande, pas un vote de tous les points. Les cas évidents ne changent pas cette largeur. C'est aussi pour cela qu'une exception collée à l'autre camp, si `C` est très grand, pèse trop : vous la laissez devenir un support et tordre la marge.

</details>

## Exercice 2 : Le scaler oublié

Un collègue lance `SVC(kernel="rbf")` sur un tableau où `revenus` va de 0 à 200 000 et `anciennete_mois` de 0 à 240, sans `StandardScaler`. Le score test est médiocre. Il conclut que « le SVM ne marche pas sur nos données ».

Quelle cause plus simple proposez-vous, et où placez-vous le scaler ?

<details>
<summary>Voir la solution</summary>

Le RBF décide de la proximité. Sans mise à l'échelle, un écart de 1 000 € de revenus écrase un écart de 10 mois d'ancienneté. Le modèle n'a presque pas vu l'ancienneté. Le score médiocre ne dit pas que la marge est inadaptée. Il dit que les unités ont voté à la place du signal.

Vous placez `StandardScaler` **dans un pipeline**, avant `SVC`, et vous faites `fit` sur le train seulement. Scaler toute la table avant le split ferait fuir moyenne et écart du test. Après ce correctif, vous recomparez à une logistique et à une forêt, sur le rappel de la classe qui compte, avant d'enterrer le SVM.

</details>

## Exercice 3 : Deux fichiers, deux familles

Fichier A : 8 000 lignes, 12 variables numériques propres, deux classes qui se séparent assez nettement. Fichier B : 3 millions de lignes, montants, dates, catégories, manquants, quarante colonnes hétérogènes.

Où un SVM a-t-il encore sa place ? Par quoi commencez-vous sur B, et pourquoi ?

<details>
<summary>Voir la solution</summary>

Sur **A**, un SVM (linéaire d'abord, RBF si la validation le justifie) a sa place : taille moyenne, numérique, frontière nette. Avec un scaler dans le pipeline, et `C` choisi hors du test. Une logistique reste la baseline à battre. Si le RBF ne gagne pas clairement, vous ne le gardez pas pour la forme.

Sur **B**, vous ne lancez pas un SVM à noyau. Le coût devient déraisonnable, les manquants et les catégories ne sont pas son terrain, l'échelle non plus. Vous commencez par une baseline (moyenne ou classe majoritaire, puis logistique ou ridge selon la cible) et une **forêt** ou un boosting en histogrammes (XGBoost, LightGBM), après un pipeline de préparation. Le SVM linéaire pourrait encore se discuter sur un sous-problème numérique propre. Il n'est pas le premier outil de ce fichier.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "SVM et noyaux"
center: "La marge la plus large. Un noyau si la frontière doit se courber. Ailleurs, des arbres."
points:
  - icon: scale
    title: "Marge et supports"
    text: "La bande vide la plus large. Seuls les points du bord définissent la coupe."
  - icon: sparkles
    title: "Noyau"
    text: "Linéaire pour un texte creux. RBF pour une courbe, au risque de coller au train."
  - icon: ruler
    title: "Échelle et C"
    text: "Sans scaler, l'unité la plus grande gagne. C serre ou relâche la marge."
  - icon: database
    title: "Encore utile"
    text: "Jeux moyens, frontière nette, ou texte creux en noyau linéaire."
  - icon: network
    title: "Tabulaire large"
    text: "Types mélangés, manquants, volume : la forêt ou le boosting passent devant."
pitfall: "Juger un RBF sans mise à l'échelle, puis conclure que le SVM est dépassé."
remember: "Sur un tableau de gestion hétérogène, la baseline puis la forêt viennent avant le noyau."
```
