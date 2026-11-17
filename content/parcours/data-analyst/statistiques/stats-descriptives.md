---
title: Statistiques descriptives
description: "Résumer des commandes sans se tromper de question : moyenne, médiane, écart-type, quartiles, effectifs, pourcentages nommés, et moyennes qui changent de sens selon le découpage."
duration: 55
objectives:
  - Choisir la moyenne ou la médiane selon la question métier
  - Lire un écart-type, des quartiles et la forme d'une distribution
  - Nommer un effectif et un pourcentage avec son dénominateur
  - Repérer une moyenne trompeuse, y compris un paradoxe de Simpson simple
---

# Décrire avant de conclure

La statistique descriptive ne cherche pas à deviner l'avenir. Elle répond à : que s'est-il passé dans **cet** extrait, avec quelle définition ? Pour Atelier Nord, « le panier de mars » n'est pas un seul nombre. C'est un total, un effectif, un profil de commande typique, et la part de chaque canal. Mélanger ces questions produit des phrases vraies et inutilisables, du type « c'est 40 % en moyenne ».

Avant un résumé, la table est déjà au bon grain (une ligne = une commande payée, hors tests) et les manquants sont traités. Décrire des lignes dupliquées, c'est décrire l'export, pas la boutique. Les outils du tableur (`MOYENNE`, `MEDIANE`, `ECARTYPE.STANDARD`, `QUARTILE`) et ceux de Python calculent la même famille d'indicateurs. Le travail d'analyste est de choisir lequel, et de le nommer.

```python
import statistics

paniers = [24, 27, 29, 31, 32, 35, 38, 41, 44, 620]
print(statistics.mean(paniers))     # 92.1
print(statistics.median(paniers))   # 33.5
print(round(statistics.stdev(paniers), 1))  # 185.6
```

Dix commandes seulement, pour que vous puissiez refaire les calculs à la main. Le 620 € est une commande mobilier B2B, réelle. Les neuf autres vivent entre 24 et 44 €.

# Moyenne, médiane et écart-type

La **moyenne** est la somme divisée par l'effectif. Ici, 921 / 10 = 92,1 €. Elle a une propriété que la médiane n'a pas : moyenne × effectif = total. Si ces dix commandes sont toute la population qui vous intéresse, 92,1 € est exactement le CA par commande. Le marketing qui « applique le panier moyen » pour retrouver un chiffre d'affaires a besoin de cette moyenne, pas d'un autre résumé.

La **médiane** est la valeur du milieu une fois les montants triés. Avec un effectif pair, on prend le milieu des deux valeurs centrales, 32 et 35, soit 33,5 €. Cinq commandes sont en dessous de ce milieu, cinq au-dessus (en comptant la convention habituelle sur les deux centrales). La commande à 620 € peut passer à 6 200 € : la médiane ne bouge pas, la moyenne si. La médiane répond à « que dépense une commande ordinaire ? ».

L'**écart-type** résume les écarts à la moyenne. On écarte chaque montant de la moyenne, on met ces écarts au carré (pour que les écarts négatifs ne s'annulent pas), on en fait une moyenne, puis une racine. `statistics.stdev` divise par n − 1 (écart-type d'échantillon), comme `ECARTYPE.STANDARD` dans Excel. `statistics.pstdev` divise par n, comme `ECARTYPE.PEARSON`. Sur ces dix montants, le premier vaut 185,6 €, le second 176,1 €. L'écart est déjà visible sur un petit effectif : dites lequel vous utilisez, et n'en changez pas entre deux slides.

Un écart-type de 186 €, plus grand que la moyenne, ne veut pas dire que « la plupart des clients dépensent 92 € plus ou moins 186 € ». Il veut dire que la moyenne est un mauvais portrait du tas : une seule commande tire la somme. Regardez la répartition avant de citer l'écart-type comme une marge d'erreur. Ce n'en est pas une. L'incertitude sur un chiffre estimé à partir d'un échantillon viendra dans le chapitre sur les intervalles.

```diagram
type: stack
title: D'où viennent les 921 € de ces dix commandes
segments:
  - label: Neuf commandes ordinaires, 301 €
    value: 301
    tone: teal
  - label: Une commande B2B, 620 €
    value: 620
    tone: amber
```

Les neuf commandes ordinaires font 301 €, soit environ un tiers du total. La commande B2B en fait les deux tiers. Annoncer « panier moyen 92 € » à une équipe qui prépare une offre grand public leur fait viser un client qui n'est presque pas dans le fichier. Annoncez les deux : panier moyen 92,1 € (il reconstruit le CA), panier médian 33,5 € (commande typique), et une commande B2B de 620 € isolée dans la note.

```video
url: https://www.youtube.com/watch?v=mk8tOD0t8M0
title: "Mode, Median, Mean, Range, and Standard Deviation (1.3)"
channel: "Simple Learning Pro"
duration: "7:10"
lang: en
why: "Moyenne, médiane, mode, étendue et écart-type présentés avec des exemples chiffrés."
```

# Quartiles et forme de la distribution

Les **quartiles** coupent la série triée en quatre paquets d'effectifs comparables. Sur une série d'onze paniers déjà triés, 11, 18, 20, 22, 25, 28, 30, 33, 40, 48 et 60 €, `statistics.quantiles` donne Q1 = 20 €, médiane = 28 €, Q3 = 40 €. Environ un quart des commandes est à 20 € ou en dessous, un quart à 40 € ou au-dessus, la moitié centrale entre les deux. L'écart interquartile, Q3 − Q1 = 20 €, décrit l'étalement du milieu **sans** se laisser emporter par un 620 €.

Excel, pandas et `statistics.quantiles` ne coupent pas les petits échantillons au même endroit à l'euro près. Sur onze valeurs, l'écart entre méthodes reste mineur. Sur une décision, vous n'avez pas besoin de la quatrième décimale : vous avez besoin de savoir qu'un quart des commandes est bas, un quart est haut, et que vous avez cité la méthode. En revanche, ne mélangez pas dans un même rapport un quartile calculé sur les commandes et un quartile calculé sur les clients (un client peut avoir trois commandes).

La **distribution**, c'est la forme entière, pas un seul résumé. Un histogramme des paniers d'Atelier Nord est en général décalé : beaucoup de commandes modestes, une longue traîne de paniers élevés, presque jamais une cloche symétrique. Dans une cloche, moyenne et médiane se rejoignent. Dans une traîne de CA, la moyenne est à droite de la médiane. Si on vous donne une moyenne sans la forme, demandez au moins la médiane et le maximum.

Deux bosses (des petits paniers web et des commandes B2B) ne se résument ni par une moyenne ni par une médiane unique. Séparez les populations, puis décrivez chacune. C'est le même réflexe que de ne pas moyenner le délai de livraison des colis lettres et celui des canapés.

# Effectifs et pourcentages bien nommés

Un **effectif** est un nombre de cas : 1 240 commandes payées, dont 310 par e-mail. Une **part** est cet effectif divisé par une base explicite : 310 / 1 240 = 25 % **des commandes**. La base n'est pas un détail de style. « 25 % » tout seul ne dit pas si vous parlez des commandes, du CA, des visites ou des clients.

Le même canal peut peser 25 % des commandes et 40 % du CA. Le panier e-mail est alors plus élevé que le panier des autres canaux. Écrire « l'e-mail représente 25 % » dans un titre de slide, puis commenter le chiffre d'affaires, fait dire à la salle le contraire de ce que vous avez calculé. Nommez : « 25 % des commandes, 40 % du CA ».

L'**évolution** est encore un autre pourcentage. 200 commandes la semaine A, 250 la semaine B : (250 − 200) / 200 = +25 %. Ce n'est pas « +50 % » (vous avez ajouté 50 commandes, pas 50 pour cent) et ce n'est pas « 25 % du CA ». +25 % d'un petit canal peut être dix commandes. +2 % du canal principal peut être le vrai sujet. Donnez l'effectif à côté du taux quand la base est mince.

Le **taux de conversion** a lui aussi un dénominateur : achats / visites, ou achats / sessions, selon la définition figée avec le marketing. 42 achats pour 1 000 sessions, c'est 4,2 %. Ce n'est pas 4,2 % du CA. Deux outils qui n'utilisent pas le même dénominateur (sessions contre utilisateurs uniques) ne se « réconcilient » pas en moyennant leurs taux.

Dernier classique : la moyenne des taux n'est pas le taux global. Semaine 1, 5 achats sur 10 visites (50 %). Semaine 2, 200 achats sur 10 000 visites (2 %). La moyenne non pondérée des deux taux vaut 26 %. Le vrai taux vaut 205 / 10 010 ≈ 2,0 %. La semaine minuscule a pesé autant que la semaine réelle dans la moyenne des taux, et presque pas dans le taux réel. On pondère par les visites, ou on recalcule à partir des effectifs. On ne moyenne pas des pourcentages dont les bases diffèrent.

# Quand une moyenne trompe

La moyenne des dix paniers (92,1 €) n'est pas fausse. Elle est la mauvaise réponse à « que met-on dans le panier type du site ? ». Toute moyenne trompeuse est d'abord une question mal nommée, parfois un mélange de populations.

Le **paradoxe de Simpson** est ce mélange rendu visible. L'application **Lumen** teste deux accroches, A et B. On regarde le taux d'achat par type d'appareil.

| Appareil | Accroche | Visites | Achats | Taux |
| --- | --- | --- | --- | --- |
| Mobile | A | 100 | 90 | 90 % |
| Mobile | B | 1 000 | 800 | 80 % |
| Ordinateur | A | 1 000 | 400 | 40 % |
| Ordinateur | B | 100 | 30 | 30 % |
| Ensemble | A | 1 100 | 490 | 44,5 % |
| Ensemble | B | 1 100 | 830 | 75,5 % |

Sur mobile, A bat B (90 % contre 80 %). Sur ordinateur, A bat B (40 % contre 30 %). Sur l'ensemble, B a l'air très au-dessus (75,5 % contre 44,5 %). Rien n'est mal additionné : B a été montré surtout sur mobile, où acheter est facile dans cet exemple, et A surtout sur ordinateur, où le taux est bas pour les deux. Le mélange des appareils fabrique le classement global.

Simpson ne dit pas « le total est toujours menteur ». Il dit que le total et le détail ne répondent pas à la même question. « Quelle accroche convertit le mieux à appareil égal ? » : A, dans les deux lignes. « Quel plan média, avec le mix d'appareils réellement acheté, a produit le plus d'achats ? » : le total de B, et vous devez écrire que les mix ne sont pas comparables. Choisir A ou B pour la suite sans parler du mix, c'est choisir une question en silence.

Le réflexe, dès qu'une moyenne ou un taux vous surprend : demandez **sur quel découpage** il pourrait s'inverser. Appareil, pays, nouveaux contre anciens clients, semaine creuse contre semaine de soldes. Si vous ne regardez pas au moins un découpage que le métier juge décisif, vous publiez le mélange, pas la décision.

# Un résumé utile pour décider

Un résumé descriptif tient en quelques lignes, avec des noms ennuyeux et exacts.

Pour les dix commandes : effectif 10, CA 921 €, moyenne 92,1 €, médiane 33,5 €, une commande B2B à 620 € qui pèse les deux tiers du total. La moyenne sert à retrouver le CA. La médiane sert à parler du client ordinaire. Aucune des deux n'est « le » panier.

Pour un canal : effectif, part des commandes, part du CA, évolution contre la semaine précédente avec les deux effectifs. « L'e-mail fait 25 % des commandes et 40 % du CA, en hausse de 25 % (200 puis 250 commandes) » est une phrase complète. « L'e-mail est à 25 %, en moyenne, en hausse » ne l'est pas.

Pour une comparaison d'accroches : le taux global **et** le taux dans les segments qui changent le mélange, avec les effectifs. Une cellule à 90 % sur 100 visites n'a pas le même poids qu'une cellule à 40 % sur 1 000 visites. Le pourcentage sans effectif voyage mal.

Vous n'avez pas encore dit si l'écart entre A et B se retrouverait sur une autre semaine. Décrire mars ne prouve pas avril. Cette incertitude est le sujet des chapitres suivants. Elle ne dispense pas de décrire juste : un intervalle autour d'une mauvaise définition reste une mauvaise définition, plus précise en apparence.

# Exercices

## Exercice 1 : Quel nombre pour quelle phrase

Les dix paniers sont 24, 27, 29, 31, 32, 35, 38, 41, 44 et 620 €.

1. Quel montant citez-vous pour « une commande ordinaire sur ce fichier » ?
2. Quel montant, multiplié par 10, retrouve le CA ?
3. Pourquoi l'écart-type de 185,6 € ne se lit-il pas comme « le client type est à 92 ± 186 € » ?

<details>
<summary>Voir la solution</summary>

1. La **médiane**, 33,5 €. Elle résiste au 620 € et décrit le milieu de la série triée.
2. La **moyenne**, 92,1 €. 92,1 × 10 = 921 €, la somme. C'est le bon résumé quand la question est le CA par commande, pas le client type.
3. Parce que les commandes ne sont pas dispersées symétriquement autour de 92 €. Neuf d'entre elles sont entre 24 et 44 €. L'écart-type est gonflé par une seule commande. Ce n'est pas une fourchette dans laquelle « la plupart » des clients tomberaient, ni une marge d'erreur statistique.

</details>

## Exercice 2 : Réécrire le pourcentage

Le canal e-mail a produit 310 des 1 240 commandes payées et 40 % du CA. La semaine précédente, ce canal avait 200 commandes, cette semaine 250. Un slide dit : « L'e-mail, c'est 25 % en moyenne, en hausse de 50. »

Réécrivez la phrase avec des pourcentages nommés et les effectifs utiles.

<details>
<summary>Voir la solution</summary>

« L'e-mail représente 25 % des commandes (310 sur 1 240) et 40 % du CA. Les commandes de ce canal passent de 200 à 250, soit +25 % (50 commandes de plus, pas +50 %). »

« 25 % en moyenne » mélange une part des commandes avec un mot (moyenne) qui ne dit pas la base. « +50 » sans unité confond un effectif et un pourcentage. La part de CA (40 %) doit apparaître, sinon on sous-entend que 25 % des commandes valent 25 % du chiffre.

</details>

## Exercice 3 : Lire le tableau de Simpson

Reprenez le tableau des accroches A et B de Lumen (mobile et ordinateur).

1. Quelle accroche a le meilleur taux sur chaque appareil ?
2. Quelle accroche a le meilleur taux global, et pourquoi ce n'est pas contradictoire ?
3. Quelle question devez-vous poser au marketing avant de « choisir la gagnante » ?

<details>
<summary>Voir la solution</summary>

1. **A** sur les deux appareils : 90 % contre 80 % sur mobile, 40 % contre 30 % sur ordinateur.
2. **B** au global (75,5 % contre 44,5 %), parce que B a été surtout exposée au mobile (taux élevés) et A surtout à l'ordinateur (taux bas). Les additions sont justes. Les mix d'appareils ne sont pas les mêmes.
3. La question à trancher : « Veut-on l'accroche qui convertit le mieux à appareil égal, ou comparer les plans tels qu'ils ont été achetés, en assumant des mix différents ? » Sans cette phrase, le taux global et le taux par appareil désignent deux gagnantes.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Statistiques descriptives
center: "Un résumé n'est juste que si la question, la base et le découpage sont écrits à côté du nombre."
points:
  - icon: chart
    title: Moyenne
    text: "Somme divisée par l'effectif. Elle reconstruit le total et suit les commandes extrêmes."
  - icon: target
    title: Médiane, quartiles
    text: "Le milieu et les quarts de la série triée disent la commande ordinaire, pas le CA."
  - icon: gauge
    title: Écart-type
    text: "Il mesure l'étalement autour de la moyenne. Ce n'est pas une marge d'erreur."
  - icon: scale
    title: Pourcentages nommés
    text: "Part des commandes, part du CA, évolution, conversion : chaque taux a son dénominateur."
  - icon: layers
    title: Simpson
    text: "Un taux global peut inverser le classement de chaque segment si les mix diffèrent."
pitfall: "Moyenne de taux sur des bases inégales, ou panier moyen cité comme client type alors qu'une commande B2B porte la somme."
remember: "Donnez l'effectif, nommez la base du pourcentage, et vérifiez au moins un découpage qui peut renverser la moyenne."
```
