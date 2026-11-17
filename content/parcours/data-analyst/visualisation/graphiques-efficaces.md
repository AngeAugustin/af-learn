---
title: Choisir des graphiques efficaces
description: "Barres, lignes, nuages, histogrammes et boîtes à moustaches, cas où le tableau gagne, petits multiples et couleurs lisibles par tous."
duration: 60
objectives:
  - "Associer barres, lignes, nuages, histogrammes et boîtes à la bonne question"
  - "Préférer un tableau quand le lecteur doit lire une valeur exacte"
  - "Construire des petits multiples avec une échelle commune"
  - "Choisir des couleurs distinguables sans s'appuyer sur le seul rouge et vert"
---

# Des barres pour comparer des catégories

La barre répond à une question de **comparaison entre catégories** : quelle région, quel produit, quel canal est plus haut ? La longueur part d'une base commune, en général zéro, et l'œil classe les valeurs sans calculer. Les autres questions du chapitre n'appellent pas le même dessin.

```diagram
type: flow
title: "De la question au dessin"
steps:
  - title: Comparer
    text: "Des catégories : barres depuis zéro, triées par la valeur"
    tone: blue
  - title: Suivre
    text: "Un temps régulier : une ligne. On ne relie pas des régions"
    tone: teal
  - title: Relier
    text: "Deux mesures, un point par entité : un nuage, sans en faire une cause"
    tone: amber
  - title: Répartir
    text: "Une distribution : histogramme ou boîte, pas la seule moyenne"
    tone: violet
  - title: Citer un chiffre
    text: "Valeur exacte, ou plusieurs unités sur la même ligne : un tableau"
    tone: rose
```

Pour Lumen au T2, le CA HT livré vaut 420 k€ au Nord, 310 à l'Est, 280 au Sud et 190 à l'Ouest. Quatre barres suffisent. Quelques règles rendent ce dessin fiable :

- **Triez par la valeur**, pas par l'alphabet, sauf si l'ordre est naturel (une échelle de satisfaction, des tranches d'âge, des étapes d'un processus).
- **Préférez l'horizontale** dès que les libellés sont longs (« Rail apparent 1,5 m blanc chaud » ne tient pas sous une barre verticale).
- **N'empilez pas** plusieurs séries si la question est « qui est le plus haut dans chaque série » : le segment du milieu n'a plus de base commune. L'empilement convient à une composition (part du total), pas à une course entre séries.
- **Limitez le nombre de barres.** Au-delà d'une dizaine, groupez, filtrez, ou passez à un tableau triable. Vingt barres fines ne se comparent plus.
- Le **zéro reste visible**. Une marge de 42 % et une marge de 61 % se comparent très bien depuis zéro. Les tronquer est traité dans le chapitre sur les principes : ce n'est pas un « zoom », c'est une autre proportion.

Les barres ne conviennent pas au temps long. Douze mois passent encore. Cinquante-deux semaines deviennent une palissade : la tendance et les ruptures se lisent mieux sur une ligne.

> [!TIP]
> Si vous hésitez entre barre et ligne, demandez-vous si l'ordre horizontal est une vraie séquence. Relier « Nord » à « Est » par un trait invente un chemin qui n'existe pas. Relier « janvier » à « février » décrit le temps.

# Des lignes pour suivre le temps

La ligne (ou la suite de points reliés) répond à une question d'**évolution** : ça monte, ça stagne, ça casse à quelle date ? L'axe horizontal est le temps, régulier. Un trou de données ne se comble pas en tirant un trait droit comme si la semaine avait existé : on marque le trou.

**Exemple.** Commandes livrées de Lumen, une série de 12 semaines : 180, 190, 185, 200, 210, 205, 198, 120, 140, 190, 205, 210. La ligne montre tout de suite la cassure de la semaine 8 (semaine du 15 août). Des barres le montreraient aussi, mais la pente de reprise, de 120 à 210 en quatre semaines, se lit mieux sur le trait. Le titre utile n'est pas « Commandes par semaine ». C'est « Les livraisons chutent à 120 la semaine du 15 août, puis reviennent vers 210 ».

Plusieurs séries sur la même ligne seulement si elles partagent l'unité et l'échelle. Quatre régions, d'accord. Le CA et le NPS, non (double axe). Au-delà de quatre courbes, le graphique en spaghetti ne se démêle plus : passez aux petits multiples, plus bas.

Autres précautions :

- ne lissez pas (moyenne mobile) sans montrer les points d'origine, ou le lecteur croit qu'il n'y a pas eu de creux ;
- un marqueur sur chaque point aide quand il y a peu de dates ; il encombre quand il y en a cent ;
- l'axe vertical d'une ligne peut être resserré **si les bornes sont écrites** et si vous ne faites pas lire la hauteur du trait comme une barre. Pour une variation de 2 points que la décision doit voir, une annotation chiffrée reste plus honnête qu'un zoom dramatique.

# Un nuage pour une relation, pas pour une cause

Le nuage de points répond à : « ces deux mesures varient-elles ensemble ? ». Chaque point est une entité (un compte, une commande, une semaine). L'axe horizontal est une variable, l'axe vertical une autre. On ne relie pas les points, sauf si le temps est réellement le fil et que vous l'avez dit.

**Exemple.** Quarante comptes Est. En abscisse, la remise moyenne sur le T2. En ordonnée, la marge brute du compte. La masse des points descend : autour de 5 % de remise, la marge tourne souvent près de 55 % ; autour de 20 % de remise, elle tombe vers 35 %. Un point isolé est à 28 % de remise et 52 % de marge : un contrat cadre où le fret est mutualisé. Ce point ne doit pas dicter la droite à lui seul, et la pente ne dit pas « la remise cause la baisse ». Le mix produit, la taille du compte ou le transporteur peuvent expliquer les deux à la fois.

À faire sur un nuage :

- **écrire les unités** et ce que représente un point (« 1 point = 1 compte, T2, CA > 2 k€ ») ;
- **regarder les bords** avant de résumer : un outlier peut être une erreur d'unité (marge à 400 % : un prix saisi en centimes) ou le fait le plus intéressant ;
- **ne pas tracer une droite** pour « faire scientifique » quand le nuage est rond ou en deux paquets. Deux paquets (petits comptes d'un côté, grands de l'autre) veulent souvent deux analyses, pas une moyenne ;
- garder la couleur pour une troisième information **catégorielle** (région), pas pour répéter l'axe vertical.

Le nuage ne classe pas des catégories et ne montre pas un calendrier. Si vous n'avez que quatre régions, retournez aux barres : quatre points flottants n'ont pas de relation à révéler.

# Histogrammes et boîtes : la forme d'une distribution

La moyenne est un très mauvais portrait dès que la distribution est dissymétrique. Deux graphiques servent à montrer la **forme** : l'histogramme pour une variable continue, la boîte à moustaches pour comparer plusieurs groupes.

## L'histogramme

Vous découpez la variable en intervalles (les classes) et vous comptez les observations. L'axe horizontal est quantitatif et ordonné. Il n'y a en principe **pas d'espace** entre les rectangles : l'espace signifierait un trou dans les valeurs. Ce n'est donc pas un diagramme en barres. Un diagramme en barres compare des catégories disjointes (Nord, Est). Un histogramme décrit une grandeur (un délai, un montant, un âge).

**Exemple.** Délai réel de livraison, 800 commandes de juin, promesse commerciale : 5 jours.

| Délai | Commandes |
|---|---|
| 0 à 2 jours | 90 |
| 3 à 5 jours | 340 |
| 6 à 10 jours | 220 |
| 11 à 20 jours | 110 |
| 21 jours et plus | 40 |

La moyenne vaut 7,4 jours. Elle dit « un peu au-dessus de la promesse ». L'histogramme dit autre chose : 430 commandes (90 + 340) tiennent les 5 jours, mais **40 commandes dépassent 21 jours**. Ce sont ces 40 qui saturent le support. Une classe unique « 0 à 30 jours » aurait caché la queue. Des classes d'un jour sur 800 commandes auraient montré du bruit. La largeur de classe fait partie de l'analyse : trop large, vous effacez le phénomène ; trop fine, vous ne voyez que le hasard. Affichez les bornes (« 3 à 5 », pas un code opaque).

## La boîte à moustaches

La boîte résume une distribution sans montrer chaque observation : le trait central est la **médiane**, la boîte va du premier au troisième quartile (la moitié centrale des valeurs), les moustaches vont vers les valeurs usuelles, et les points au-delà sont des valeurs extrêmes. Vous n'avez pas besoin de calculer un test pour que la boîte soit utile : elle empêche la moyenne de mentir.

**Exemple.** Délai par transporteur, en jours.

| | Médiane | Moyenne | Queue |
|---|---|---|---|
| Transporteur A | 4 | 4,5 | presque pas de commande au-delà de 10 jours |
| Transporteur B | 5 | 9 | médiane proche de A, mais des commandes à 25 et 40 jours |

Un classement sur la moyenne élimine B. Un classement sur la médiane les départage à peine. La boîte montre que B a un problème de **queue**, pas un retard typique de 4 jours. L'action n'est pas la même : revoir les exceptions (rupture, zone éloignée) plutôt que changer toute la grille tarifaire.

> [!WARNING]
> Ne comparez pas des boîtes dont les effectifs sont très différents sans l'écrire. Une médiane sur 12 commandes bouge dès qu'un client atypique entre. Indiquez n sous chaque boîte.

# Quand un tableau vaut mieux qu'un graphe

Le graphe gagne quand le lecteur doit **voir un ordre, une forme ou une rupture**. Le tableau gagne quand il doit **retrouver une valeur précise** et en croiser plusieurs sur la même ligne.

Cas typiques du tableau :

- une liste de référence (prix, stock, délai promis, marge) pour quinze références : le lecteur cherche « Driver 40W », il ne cherche pas la silhouette des marges ;
- des écarts trop fins pour l'encre, mais exacts pour la décision (18,2 % contre 18,6 %) : deux barres depuis zéro sont identiques à l'œil, le tableau dit les 0,4 point ;
- un petit effectif de chiffres que l'on citera à l'oral (« retenez 42, 54, 61 ») ;
- plusieurs unités sur la même entité (CA, marge, nombre de commandes, délai). Les mettre en quatre graphes force à chercher la ligne du regard. Une ligne de tableau aligne les quatre.

Cas typiques du graphe, même si le tableau existe en annexe : la cassure d'août, la queue des délais, le nuage remises contre marge, le classement des régions.

Vous pouvez mélanger. Une **barre dans une cellule** (ou une simple mise en couleur de la valeur extrême) aide le tri visuel sans remplacer les chiffres. La règle pratique : si retirer les nombres rend l'objet inutile, vous vouliez un tableau. Si retirer la forme rend l'objet inutile, vous vouliez un graphe. Un camembert dont chaque part est déjà étiquetée « 23 % » est souvent un tableau qui a honte.

```diagram
type: decision
title: "Graphe ou tableau ?"
nodes:
  - question: "Le lecteur doit-il voir un ordre, une tendance, une forme ou une rupture ?"
    yes: "Partez sur un graphe, puis choisissez l'encodage selon la question"
    no: "Un tableau sera plus rapide et plus exact"
  - question: "Doit-il aussi citer la valeur exacte, dans une unité qui ne se lit pas sur l'échelle ?"
    yes: "Graphe annoté, ou tableau avec une mise en couleur de l'extrême"
    no: "Le graphe seul suffit, avec l'unité et la période écrites"
  - question: "Y a-t-il plusieurs grandeurs d'unités différentes sur les mêmes entités ?"
    yes: "Tableau (une ligne par entité). Un graphe par grandeur seulement si la forme compte"
    no: "Restez sur le graphe le plus simple qui répond à la question"
```

# Petits multiples et couleurs que tout le monde distingue

## La même échelle, répétée

Les **petits multiples** sont la même petite figure, répétée pour chaque groupe : une courbe par région, une courbe par produit, un histogramme par canal. Le lecteur compare les formes du regard parce que **l'échelle, les axes et l'ordre des dates sont identiques**. C'est la réponse au spaghetti de huit lignes, et la réponse honnête au double axe.

L'échelle commune est la condition. Si chaque vignette recalcule son minimum et son maximum, une baisse de 42 % à 40 % à l'Est occupe autant de hauteur qu'une baisse de 61 % à 30 % au Nord. Vous avez réintroduit l'axe tronqué, une fois par case.

**Exemple.** Quatre courbes hebdomadaires du CA, de 0 jusqu'au maximum observé dans **n'importe quelle** région (pas le maximum de la vignette). On voit alors que le Nord porte le niveau, et que l'Est décroche en juin. Quatre axes « optimisés » auraient montré quatre descentes également dramatiques.

Gardez les vignettes dans un ordre stable (la valeur totale, ou l'ordre géographique habituel de l'entreprise) et répétez le nom du groupe dans la vignette, pas seulement dans une légende générale.

## La couleur comme étiquette, pas comme énigme

La couleur encode soit une **catégorie** (peu de teintes bien séparées), soit une **quantité** (une seule teinte, du clair au foncé). Elle n'encode pas les deux à la fois. Un arc-en-ciel sur un délai est une mauvaise échelle : le jaune du milieu crie plus fort que le bleu foncé du bout, sans que le délai soit plus grave au milieu.

Palette sobre, suffisante pour la plupart des notes de décision :

- **gris** pour le contexte (les autres régions, l'an dernier) ;
- **bleu** pour la série principale neutre ;
- **ambre** pour la série que la phrase du titre désigne ;
- **teal** ou **rose** seulement si une troisième information est vraiment nécessaire.

N'utilisez pas le couple rouge/vert comme unique distinction. Le daltonisme rouge-vert est fréquent, l'impression noir et blanc aussi, et un projecteur écrase les teintes voisines. Deux gardes suffisent : un écart de **clarté** (foncé contre clair) et un **libellé sur la marque**. La légende devient un secours, plus la seule clé.

Contraste du texte : un commentaire jaune pâle sur fond blanc ne passe pas les critères d'accessibilité les plus courants. Texte foncé, fond clair, ou l'inverse. Le seuil pratique que vous pouvez vérifier sans outil : si vous plissez les yeux et que le texte disparaît avant les barres, renforcez-le.

Enfin, la couleur ne corrige pas un mauvais graphique. Un camembert 3D daltonien-compatible reste un camembert 3D. Réglez d'abord l'encodage et l'échelle, puis la teinte.

# Exercices

## Exercice 1 : Le bon dessin

Pour chaque question, nommez le graphique (ou le tableau) que vous produisez, et l'erreur la plus probable.

1. Classer huit produits par CA du mois.
2. Montrer les ventes hebdomadaires des 30 dernières semaines.
3. Voir si la remise et la marge des comptes bougent ensemble.
4. Donner prix, stock et délai promis de 12 références à un acheteur.

<details>
<summary>Voir la solution</summary>

1. **Barres** (horizontales si les noms sont longs), triées par CA, depuis zéro. Erreur probable : un camembert, ou des barres alphabétiques qui empêchent de voir le podium.

2. **Ligne** temporelle. Erreur probable : 30 barres, ou une moyenne mobile qui efface une semaine de rupture sans montrer les points.

3. **Nuage de points**, un point par compte, sans conclure à une cause. Erreur probable : deux courbes en double axe, ou une droite forcée sur un nuage en deux paquets.

4. **Tableau**. L'acheteur cherche une référence, avec trois unités différentes. Erreur probable : trois graphes séparés qui l'obligent à recombiner les lignes de tête.

</details>

## Exercice 2 : Lire une distribution

La moyenne du délai de livraison est de 6 jours, conforme à la promesse. La médiane est de 4 jours. La boîte du transporteur B montre une médiane à 5 et des points isolés à 30 et 45 jours. Le transporteur A est serré autour de 4.

1. Pourquoi la moyenne de 6 jours peut-elle rassurer à tort ?
2. Que recommandez-vous comme graphique dans la note hebdomadaire aux opérations ?
3. Quelle action est mal ciblée si l'on se fie seulement à la moyenne de B ?

<details>
<summary>Voir la solution</summary>

1. La moyenne est tirée par une queue de commandes très en retard. La plupart des colis sont plus rapides que 6 jours (médiane 4). Le chiffre « dans les clous » masque les dossiers qui créent les réclamations.

2. Un **histogramme** du délai (pour voir la queue) ou des **boîtes par transporteur** avec l'effectif n. Pas une seule jauge « moyenne = 6 ».

3. Renégocier tout le contrat de B comme s'il était lent de bout en bout. Le cœur des livraisons est proche de A. Il faut isoler les commandes extrêmes (zone, rupture, saisie) avant de changer de prestataire.

</details>

## Exercice 3 : Échelles et couleurs

Quatre petits graphiques montrent la marge hebdomadaire des régions. Chaque vignette a son propre axe : l'Est va de 40 à 44, le Nord de 55 à 65. Les quatre courbes « descendent » visuellement autant. Les séries sont rouge et vert.

1. Quel est le défaut des échelles ?
2. Comment les recaler ?
3. Par quoi remplacer le rouge et le vert ?

<details>
<summary>Voir la solution</summary>

1. Sans échelle commune, une variation de 4 points occupe la même hauteur qu'une variation de 10 points, et les niveaux (autour de 42 contre autour de 60) deviennent incomparables. C'est un axe tronqué répété quatre fois.

2. Même minimum et même maximum sur les quatre vignettes, choisis sur l'ensemble des données (et zéro inclus si vous montrez des barres). Titre de chaque vignette = la région. On peut alors voir à la fois le niveau et la pente.

3. Une série en **bleu** ou en **ambre**, le repère en **gris**, plus le nom écrit sur la courbe. Le rouge contre le vert disparaît pour les lecteurs qui ne les distinguent pas, et à l'impression en gris.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Le graphique qui répond à la question
center: "Barres, lignes, nuages ou distributions : la forme suit la question, avec une échelle commune et des teintes lisibles."
points:
  - icon: chart
    title: Barres et lignes
    text: "Barres pour classer des catégories depuis zéro. Lignes pour le temps. On ne relie pas des régions."
  - icon: target
    title: Nuage
    text: "Un point par entité, deux mesures. La relation se voit. La cause, non. Méfiez-vous d'un point isolé."
  - icon: filter
    title: Distribution
    text: "L'histogramme montre la forme. La boîte compare les groupes. La moyenne masque souvent la queue."
  - icon: list
    title: Tableau
    text: "S'il faut la valeur exacte ou plusieurs unités sur la même ligne, le tableau bat le graphe."
  - icon: layers
    title: Multiples et teintes
    text: "Répétez la même échelle. Gris pour le contexte, une couleur pour le message, libellé sur la marque."
pitfall: "Laisser chaque petit graphique choisir son axe, ou encoder le message uniquement en rouge et en vert."
remember: "Si la forme n'apprend rien, publiez le tableau. Si l'échelle change d'une vignette à l'autre, la comparaison est fausse."
```
