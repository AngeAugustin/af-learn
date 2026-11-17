---
title: "Inférence : échantillon, biais et variance"
description: Passer d'un échantillon à une estimation, lire un intervalle, et distinguer biais statistique, biais de données et variance.
duration: 58
objectives:
  - Distinguer population, échantillon, paramètre et estimateur
  - Lire un intervalle construit avec l'erreur type, sans le prendre pour une probabilité sur un intervalle déjà tiré
  - Séparer le biais d'un estimateur et le biais qui vient des données
  - Expliquer le théorème central limite comme un resserrement des moyennes
---

# Population, échantillon, paramètre

La **population** est l'ensemble sur lequel vous voulez décider. Un service de streaming a **80 000** abonnés actifs. Le temps d'écoute moyen de ces 80 000 personnes, noté μ, est le **paramètre** : un nombre fixe, que vous ne connaissez pas, parce que vous n'allez pas interroger tout le monde ce soir.

L'**échantillon** est le sous-ensemble que vous mesurez vraiment. Vous en tirez **200** au sort. Leur moyenne observée vaut **46 minutes**, leur écart type observé vaut **20 minutes**. Ces 46 minutes ne sont pas μ. Ce sont une image de μ, qui bougerait si vous tiriez 200 autres abonnés.

| Mot | Dans l'exemple | Bouge-t-il si vous retirez ? |
|---|---|---|
| Population | 80 000 abonnés | Non, c'est le périmètre |
| Paramètre μ | Moyenne réelle, inconnue | Non |
| Échantillon | 200 abonnés tirés | Oui |
| Statistique | 46 minutes, écart type 20 | Oui |

Le périmètre se décide **avant** le tirage. « Les abonnés actifs en mars » n'est pas « les gens qui ont répondu au mail ». Si vous calculez 46 minutes sur les répondants puis vous parlez des 80 000, vous avez changé de population en cours de phrase. Le reste du chapitre ne répare pas ce glissement. Il dit ce que vous pouvez conclure **quand** l'échantillon est bien un tirage dans la population visée.

# L'estimateur et son erreur type

Un **estimateur** est la règle qui transforme l'échantillon en un nombre censé approcher le paramètre. Ici, la règle est : faire la moyenne des temps observés. La moyenne de l'échantillon, x̄ = 46, **estime** μ.

Cette règle a une variabilité. Si l'écart type des temps individuels est de l'ordre de 20 minutes (vous l'estimez par l'échantillon), l'**erreur type** de la moyenne vaut :

```text
erreur type ≈ s / racine(n) = 20 / racine(200) ≈ 20 / 14,14 ≈ 1,41 minute
```

L'erreur type n'est pas l'écart type des abonnés. L'écart type, **20 minutes**, dit à quel point deux personnes diffèrent. L'erreur type, **1,41 minute**, dit à quel point la **moyenne de 200 personnes** bouge d'un échantillon à l'autre. Diviser par la racine de n est le geste qui fait passer de l'individu au résumé.

Contrôlez l'arithmétique : racine(200) ≈ 14,14, et 20 / 14,14 ≈ 1,41. Avec n = 50 seulement, l'erreur type vaudrait 20 / racine(50) ≈ 20 / 7,07 ≈ **2,83 minutes**. Vous n'avez pas « moins de variété dans les goûts » : vous avez une moyenne moins stable, parce que vous avez moins de monde.

```diagram
type: stack
title: Deux dispersions à ne pas confondre
segments:
  - label: Écart type individuel
    value: 20
    tone: amber
    text: 20 min, d'un abonné à l'autre
  - label: Erreur type, n = 50
    value: 2.83
    tone: blue
    text: 2,83 min, d'une moyenne à l'autre
  - label: Erreur type, n = 200
    value: 1.41
    tone: teal
    text: 1,41 min, moyenne mieux calée
```

L'estimateur n'est pas le paramètre, même quand le calcul est juste. Dire « le temps moyen des 80 000 abonnés est 46 minutes » est trop fort. Dire « la moyenne de cet échantillon de 200 est 46 minutes, et une moyenne de cette taille se trompe en général d'environ 1,4 minute » est à la hauteur de ce que vous savez.

# Lire un intervalle sans le surinterpréter

Pour un grand échantillon, un **intervalle** autour de la moyenne se construit souvent ainsi :

```text
x̄  ±  1,96 × erreur type
46  ±  1,96 × 1,41
46  ±  2,8
```

1,96 × 1,41 ≈ 2,76, que l'on arrondit à **2,8 minutes** pour la lecture. L'intervalle vaut environ **[43,2 , 48,8]** minutes.

Le 1,96 vient de la courbe en cloche : environ 95 % de sa masse se trouve à moins de 1,96 écart type du centre. Appliqué à la moyenne, il donne un intervalle dit « à 95 % ». La phrase précise est une phrase sur la **méthode**, pas sur ce rectangle de nombres déjà calculé.

Si vous répétiez le tirage de 200 abonnés un grand nombre de fois, et que vous construisiez chaque fois l'intervalle par la même règle, **environ 95 intervalles sur 100** contiendraient le vrai μ. Une fois que vous tenez [43,2 , 48,8], ce morceau-là contient μ ou ne le contient pas. Vous ne savez pas lequel. Vous savez que la procédure se trompe environ 5 fois sur 100.

Ce que l'intervalle ne dit pas :

- Il ne dit pas « μ a 95 % de chances d'être entre 43,2 et 48,8 » au sens où μ serait aléatoire. Dans cette lecture, μ est fixe et l'intervalle est aléatoire.
- Il ne dit pas que 95 % des **abonnés** regardent entre 43 et 49 minutes. Eux s'étalent d'environ 20 minutes autour de leur moyenne. L'intervalle parle de la moyenne, pas des individus.
- Il ne répare pas un mauvais échantillon. S'il manque toute une catégorie d'abonnés, l'intervalle est étroit autour de la **mauvaise** cible.

> [!NOTE]
> Plus l'erreur type est petite, plus l'intervalle est court. Passer de n = 200 à n = 800 divise l'erreur type par 2 (la racine de 4), pas par 4. Quatre fois plus de données, deux fois plus de précision sur la moyenne. Le coût monte plus vite que la finesse.

```video
url: https://www.youtube.com/watch?v=TqOeMYtOc1w
title: "Confidence Intervals, Clearly Explained!!!"
channel: "StatQuest with Josh Starmer"
duration: "6:42"
lang: en
why: "StatQuest explique ce que dit vraiment un intervalle de confiance, et ce qu'il ne dit pas."
```

# Biais statistique et biais de données

Le mot **biais** circule pour deux problèmes différents. Les distinguer évite de « corriger » le mauvais.

Le **biais statistique** concerne l'estimateur. Sur des échantillons tirés correctement dans la bonne population, la moyenne des estimations ne tombe pas sur le paramètre. Elle est décalée, et augmenter n resserre le nuage **autour du décalage**, sans l'enlever.

Exemple chiffré. Le poids moyen réel d'un groupe est **72,4 kg**. Le pèse-personne ajoute **1,2 kg** à chaque mesure. Les moyennes d'échantillon se concentrent autour de **73,6 kg**, pas de 72,4. Le biais vaut +1,2 kg. Avec n = 30 ou n = 3 000, le centre reste 73,6 kg. Seule la dispersion autour de 73,6 diminue. Pour enlever le biais, il faut régler le pèse-personne, ou soustraire 1,2 kg, pas recruter plus de monde.

Autre estimateur systématiquement à côté, même avec un bon tirage : garder le **maximum** observé comme estimation du maximum possible. Sur des tickets plafonnés à 100 €, le plus grand ticket d'un échantillon de 5 est presque toujours **strictement en dessous** de 100. En moyenne, cet estimateur est trop bas. Il est biaisé, par construction.

Le **biais de données** concerne le lien entre les lignes que vous avez et la population de la décision. L'estimateur peut être parfaitement centré **pour les lignes en main**, et faux pour ceux à qui vous appliquerez le résultat.

Une équipe écrit aux **150 000** clients. **12 000** répondent, soit **8 %**. Parmi les répondants, le taux de résiliation observé est **6 %**. Dans la base entière, il est **11 %**. La moyenne des répondants estime très bien le taux des répondants. Elle n'estime pas le taux des 150 000. Multiplier les relances pour passer de 12 000 à 12 400 répondants du même type réduit la variance. Cela ne fait pas apparaître les 92 % qui n'ouvrent pas le mail.

| | Biais statistique | Biais de données |
|---|---|---|
| Où est le défaut ? | La règle de calcul | Les lignes recueillies |
| Le tirage peut être parfait | Oui, et le décalage reste | Non : la population visée n'est pas celle mesurée |
| Augmenter n | Resserre autour de la mauvaise valeur | Resserre autour des répondants, pas de la base |
| Exemple | Balance à +1,2 kg, centre 73,6 au lieu de 72,4 | 6 % de résiliation chez 8 % de répondants, 11 % dans la base |

Les deux peuvent s'ajouter. Une balance fausse, utilisée seulement sur les clients venus en agence le mardi matin, cumule un décalage de mesure et un décalage de population. Vous les nommez séparément, parce que les remèdes ne sont pas les mêmes : étalonner l'instrument, ou changer la façon de constituer l'échantillon (tirage, et pas seulement les volontaires du mail).

# La variance baisse quand n grandit

La **variance** de l'estimateur est le carré de son erreur type. Vous pouvez rester à l'erreur type, plus lisible, en minutes plutôt qu'en minutes au carré. L'idée est la dispersion **d'une expérience à l'autre**.

Avec un écart type individuel de 20 minutes :

```text
n = 25    erreur type = 20 / 5  = 4,0 minutes
n = 100   erreur type = 20 / 10 = 2,0 minutes
n = 400   erreur type = 20 / 20 = 1,0 minute
```

Quand la moyenne se comporte à peu près comme une courbe en cloche (le chapitre suivant dit pourquoi c'est souvent le cas), environ **deux échantillons sur trois** tombent à moins d'une erreur type du vrai μ, et environ **95 sur 100** à moins de deux erreurs types.

Donc, avec n = 25, un nouvel échantillon peut très bien s'écarter de **4 minutes**, et parfois de **8**. Avec n = 400, un écart de 8 minutes serait extraordinaire : l'échelle typique est **1 minute**. Ce n'est pas une promesse sur un tirage précis que vous auriez en main. C'est l'ordre de grandeur du bruit.

Conséquence pratique. Deux équipes mesurent le même parc de logements. L'une, sur **30** biens, annonce un loyer moyen de **1 080 €**. L'autre, sur **1 200** biens, annonce **1 210 €**. Avant de conclure que « les marchés diffèrent de 130 € », comparez les erreurs types. Si l'écart type des loyers est **400 €**, l'erreur type sur 30 biens vaut 400 / racine(30) ≈ **73 €**. Un écart de 130 € entre une petite étude et une grande n'est pas encore un scoop : une partie tient dans le bruit de la petite. L'erreur type sur 1 200 biens vaut 400 / racine(1 200) ≈ **12 €**. C'est l'étude large qui est stable. La petite a le droit d'afficher un intervalle, pas un vainqueur.

Le biais, lui, ne figure pas dans ce 73 €. Une étude de 1 200 biens tous situés dans le même quartier cher reste précise **et** à côté de la ville entière. Faible variance, fort biais de données. Vous voulez les deux petits : peu de décalage, peu de dispersion. Augmenter n ne traite que la seconde.

# Le théorème central limite, en image

Le **théorème central limite** dit, en intuition : la **moyenne** (ou la somme) d'un grand nombre de tirages indépendants finit par dessiner une **cloche**, même quand un tirage isolé n'a rien d'une cloche. Le centre de cette cloche est la vraie moyenne. Sa largeur rétrécit comme 1 / racine(n).

Imaginez des tickets de caisse simples : **80 %** à **15 €**, **20 %** à **80 €**. Un ticket n'a que deux valeurs. Son histogramme est deux barres, pas une cloche. La moyenne théorique vaut :

```text
0,80 × 15 + 0,20 × 80 = 12 + 16 = 28 €
```

Vous tirez maintenant la moyenne de **40** tickets, et vous recommencez ce geste **1 000** fois. Vous obtenez 1 000 moyennes. Elles s'empilent autour de **28 €**, et le tas ressemble à une cloche, alors qu'aucun ticket individuel n'était en cloche. C'est le théorème, vu par le tas des moyennes et non par le tas des tickets.

La largeur de ce tas suit l'erreur type. Plus vous mettez de tickets dans chaque moyenne, plus les 1 000 moyennes se serrent autour de 28 €. C'est pour cela que l'intervalle du début de chapitre a le droit d'emprunter le 1,96 de la cloche : pas parce que le temps d'écoute d'**une** personne est gaussien, mais parce que la **moyenne de 200** personnes l'est à peu près.

Les conditions, en mots, sans les hypothèses formelles :

- les tirages se combinent par **somme** ou par moyenne, pas par un maximum ni par un « ou » logique ;
- ils ne sont pas trop dépendants (le même client compté 40 fois n'est pas 40 clients) ;
- aucun terme n'écrase tous les autres.

Le dernier point casse l'image. Si, parmi les tickets, il existe des ventes à **50 000 €** mêlées à des cafés à 15 €, **un** ticket décide de la moyenne de 40. Le tas des moyennes reste tordu, tiré par ces rares explosions, tant que n n'est pas bien plus grand. Le réflexe : regardez le maximum et la moyenne. Si le maximum vaut des milliers de fois la moyenne, n = 40 ne vous offre pas encore une cloche propre. Vous tronquez, vous séparez les populations, ou vous prenez plus de données, et vous le dites.

Le théorème ne dit pas que « toute donnée est normale ». Il dit que beaucoup de **moyennes** le deviennent. Un modèle qui suppose une cloche sur le ticket brut, à 15 € ou 80 €, suppose autre chose, et parfois à tort.

# Exercices

## Exercice 1 : Type ou erreur type ?

Un échantillon de **100** commandes a un montant moyen de **48 €** et un écart type de **30 €**.

1. Estimez l'erreur type de la moyenne.
2. Construisez l'intervalle x̄ ± 1,96 × erreur type, arrondi au dixième d'euro.
3. Un collègue écrit : « 95 % des commandes sont entre ces deux bornes. » Que répondez-vous ?

<details>
<summary>Voir la solution</summary>

1. 30 / racine(100) = 30 / 10 = **3 €**.
2. 1,96 × 3 ≈ **5,9 €**. Intervalle environ **[42,1 , 53,9] €** autour de 48.
3. Non. L'intervalle parle de la **moyenne**, pas des commandes. Les commandes, elles, s'écartent d'environ 30 €. Et le « 95 % » qualifie la procédure répétée, pas la part des clients tombés dans ces bornes.

</details>

## Exercice 2 : Quel biais ?

Classez chaque situation : biais statistique, biais de données, ou les deux. Dites ce qu'augmenter n changerait.

1. Un capteur de température ajoute 1,5 °C à chaque relevé. Vous moyennez 2 000 relevés d'une serre correctement échantillonnée.
2. Un modèle de départ client est ajusté sur les 12 000 personnes qui ont répondu à un mail (8 % de la base). Le taux de départ y est de 6 %, contre 11 % dans les 150 000.
3. Vous estimez le plafond de remboursement, connu pour être 500 €, par le maximum de 10 dossiers tirés au sort. Ce maximum vaut 420 €.

<details>
<summary>Voir la solution</summary>

1. **Biais statistique.** La moyenne se cale à μ + 1,5 °C. Passer à 10 000 relevés resserre autour de cette valeur trop haute. Il faut corriger le capteur.
2. **Biais de données.** L'échantillon n'est pas la population de la décision. Davantage de répondants du même mail précise le 6 %, pas le 11 %.
3. **Biais statistique.** Le maximum d'échantillon est toujours inférieur ou égal au plafond, et souvent strictement en dessous (ici 420 contre 500). En moyenne il sous-estime le plafond, même si le tirage est honnête.

</details>

## Exercice 3 : La cloche des moyennes

Les tickets valent 15 € avec probabilité 0,8 et 80 € avec probabilité 0,2.

1. Quelle est la moyenne d'un ticket ?
2. Pourquoi l'histogramme d'un ticket n'est-il pas une cloche, alors que l'histogramme de moyennes de 40 tickets s'en rapproche ?
3. Un ticket exceptionnel à 50 000 € entre dans le flux. Pourquoi n = 40 ne suffit-il plus à invoquer tranquillement le théorème ?

<details>
<summary>Voir la solution</summary>

1. 0,8 × 15 + 0,2 × 80 = 12 + 16 = **28 €**.
2. Un ticket n'a que **deux** valeurs possibles : deux barres. La moyenne de 40 tickets peut prendre beaucoup de valeurs intermédiaires (selon le nombre de tickets à 80 €). Le théorème central limite décrit le tas de ces moyennes, centré vers 28 €, pas la forme d'un ticket isolé.
3. Un seul montant de 50 000 € déplace la moyenne de 40 tickets de 50 000 / 40 = **1 250 €**. Un café à 15 € ne pèse rien à côté. La somme est dominée par un terme, la cloche n'est pas encore une bonne image. Il faut isoler ces montants ou prendre un n bien plus grand, et le vérifier.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Inférence, biais, variance
center: Une moyenne d'échantillon estime un paramètre fixe, avec un bruit qui décroît en racine de n.
points:
  - icon: users
    title: Le périmètre d'abord
    text: 80 000 abonnés, pas les répondants au mail. μ est fixe. Les 46 minutes bougent avec l'échantillon.
  - icon: gauge
    title: Erreur type
    text: s / racine(n). Ici 20 / racine(200) ≈ 1,4 min. Ce n'est pas l'écart entre deux abonnés.
  - icon: chart
    title: L'intervalle à 95 %
    text: Environ [43, 49] min. La méthode se trompe 5 fois sur 100. Elle ne parle pas des individus.
  - icon: scale
    title: Deux biais
    text: Balance à +1,2 kg, ou 6 % chez les répondants contre 11 % dans la base. Augmenter n ne répare que le bruit.
  - icon: idea
    title: Moyennes en cloche
    text: Des tickets à 15 € ou 80 €, moyenne 28 €. Le tas des moyennes de 40 tickets se rapproche d'une cloche.
pitfall: Croire qu'un intervalle étroit prouve un bon échantillon. Il peut être étroit autour de la mauvaise population.
remember: Le biais décale le centre, la variance écarte les tirs. Recruter plus de monde ne règle que la variance.
```
