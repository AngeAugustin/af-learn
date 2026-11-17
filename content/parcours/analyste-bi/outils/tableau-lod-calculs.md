---
title: "Tableau : dimensions, mesures et calculs de niveau"
description: "Lire un graphique Tableau selon son grain, sentir FIXED, INCLUDE et EXCLUDE sur le panier moyen, et situer les extraits face à l'esprit de DAX."
duration: 50
objectives:
  - Distinguer dimensions et mesures dans une feuille Tableau
  - Expliquer à quoi servent FIXED, INCLUDE et EXCLUDE sans réciter la syntaxe
  - Calculer un panier moyen au bon grain et voir où il se déforme
  - Situer l'extrait et la différence d'esprit avec une mesure DAX
---

# Dimensions et mesures

Dans Tableau, une **dimension** découpe (la région, la date, le numéro de commande). Une **mesure** se résume (le montant, la quantité). Glisser une dimension sur la feuille crée des cases. Glisser une mesure les remplit avec une agrégation, souvent une somme.

Le résultat dépend autant de ce que vous glissez que de la formule. La même somme de montant, coupée par région, donne un chiffre par région. Coupée par jour, elle donne un chiffre par jour. Avant de juger une formule « fausse », regardez **le grain de la feuille** : quelles dimensions sont dans la vue.

Repères utiles :

- une dimension discrète (bleue, dans le vocabulaire de l'outil) fabrique des en-têtes ;
- une mesure continue (verte) fabrique un axe ;
- `SUM`, `COUNTD` et les autres agrégations se décident au grain de la vue, sauf si un calcul de niveau de détail en décide autrement.

Le panier moyen n'est pas un champ de la base. C'est un rapport : le montant divisé par le nombre de commandes. Ce rapport n'a de sens qu'une fois le grain choisi.

# Le grain de la feuille

Prenons des tickets. Une commande a un identifiant, une ou plusieurs lignes, un magasin, des familles de produits.

| Commande | Famille | Montant |
| --- | --- | --- |
| C1 | Maison | 40 |
| C1 | Jardin | 60 |
| C2 | Maison | 30 |

Le chiffre d'affaires est 130. Il y a **deux** commandes. Le panier moyen global est 130 / 2 = 65. Le panier de C1 est 100, celui de C2 est 30.

Si la feuille est au grain **commande**, on peut sommer le montant de chaque commande puis en faire la moyenne : (100 + 30) / 2 = 65. Si la feuille est au grain **famille**, Maison pèse 70 et Jardin 60. Compter les commandes distinctes par famille donne 2 pour Maison (C1 et C2) et 1 pour Jardin. Les ratios 70/2 et 60/1 ne se réassemblent pas en 65, et C1 a été « vue » dans les deux familles. Rien n'est bugué. Le grain a changé la question.

> [!IMPORTANT]
> Écrivez la question avant la formule. « Panier moyen des commandes » et « montant moyen des lignes d'une famille » ne sont pas le même indicateur.

# FIXED, à l'intuition

Un calcul de **niveau de détail** (LOD, level of detail) dit à quel grain agréger, **même si la feuille montre autre chose**.

**FIXED** fixe une liste de dimensions et calcule à ce grain-là. La feuille peut ajouter ou retirer des découpages : le calcul reste accroché aux dimensions nommées. Il tient compte des filtres de contexte (ceux que l'on a explicitement promus), pas de tous les filtres de la vue.

Pour le panier, on veut d'abord le montant **de chaque commande**, quoi que la feuille découpe ensuite :

```tableau
{ FIXED [Commande] : SUM([Montant]) }
```

Cette expression vaut 100 sur les deux lignes de C1, et 30 sur C2. Elle ignore la famille. Si vous en faites la moyenne **distincte par commande**, vous retrouvez 65. Si vous faites une moyenne naïve des lignes, C1 compte deux fois (100 et 100) et le résultat penche. Le piège n'est pas FIXED. C'est d'agréger ensuite au mauvais grain.

FIXED sert donc à répondre : « calcule-moi cela **par commande** (ou par client, ou par jour), et garde cette valeur même si je découpe le graphique par famille ».

# INCLUDE et EXCLUDE

**INCLUDE** ajoute une dimension au grain de la feuille, le temps du calcul. La feuille montre les familles, mais vous voulez d'abord passer par la commande :

```tableau
{ INCLUDE [Commande] : SUM([Montant]) }
```

On obtient le montant de la commande **à l'intérieur** de la case en cours. Dans la case Maison, C1 contribue pour 40 (seulement sa part Maison) si le montant est déjà filtré par la vue... L'intuition à retenir est plus simple que l'exception : INCLUDE dit « descends aussi jusqu'à cette dimension, puis remonte ». On s'en sert quand la feuille est **trop grossière** pour la question et qu'il faut un grain plus fin intermédiaire, puis une moyenne de ces grains.

**EXCLUDE** retire une dimension présente dans la feuille. La feuille est découpée par famille, mais vous voulez le panier du magasin entier, pour le comparer à chaque famille :

```tableau
{ EXCLUDE [Famille] : SUM([Montant]) }
/ { EXCLUDE [Famille] : COUNTD([Commande]) }
```

Dans chaque case de famille, ce ratio reste celui du niveau au-dessus (le magasin, s'il est dans la vue, ou le total). La famille ne le découpe plus. C'est le bon outil pour une **ligne de référence** : « voilà le panier du magasin, à côté du panier apparent de cette famille ».

```diagram
type: compare
title: "Trois façons de fixer le grain"
columns:
  - title: FIXED
    tone: violet
    items:
      - "Je nomme le grain, point"
      - "La feuille ne le change pas"
      - "Exemple : montant de chaque commande"
      - "Utile pour un panier stable"
  - title: INCLUDE
    tone: teal
    items:
      - "J'ajoute une dimension au grain de la vue"
      - "Je descends, puis je remonte"
      - "Quand la feuille est trop grossière"
      - "Moyenner des commandes dans une case"
  - title: EXCLUDE
    tone: amber
    items:
      - "Je retire une dimension de la vue"
      - "Je calcule au niveau du dessus"
      - "Ligne de référence à côté du détail"
      - "Panier du magasin dans un graphe par famille"
```

```video
url: https://www.youtube.com/watch?v=yush1yNz9VM
title: "Tableau LOD (Level of Detail) Expressions Explained - FIXED, INCLUDE, EXCLUDE - Complete Tutorial"
channel: "sqlbelle"
duration: "32:22"
lang: en
why: "FIXED, INCLUDE et EXCLUDE expliqués en détail avec des exemples dans Tableau."
```

# Le panier moyen, trois questions

Le même mot recouvre trois questions. Il faut choisir.

1. **Panier du réseau** : somme des montants / nombre distinct de commandes, au grain où l'on parle (mois, magasin). Pas une moyenne de moyennes quotidiennes.
2. **Panier de chaque commande, puis moyenne** : FIXED sur la commande, puis moyenne des commandes. On retrouve le même ratio si chaque commande n'est comptée qu'une fois.
3. **Contribution d'une famille** : ce n'est plus un panier de commande. C'est un montant de famille. L'afficher comme « panier » trompe, parce qu'une commande multi-familles est dans plusieurs cases.

En revue, on dit la phrase entière : « panier moyen des commandes du mois, 65 € ». On n'écrit pas seulement « panier » sur une barre de familles.

> [!TIP]
> Contrôlez toujours deux nombres à la main sur un petit jeu, comme le tableau C1 / C2. Si la feuille ne redonne pas 65 au total, le grain ou l'agrégation d'après (moyenne des lignes) est en cause.

# Extraits, et un autre esprit que DAX

Un **extrait** est une copie des données, dans un format rapide, actualisée selon un horaire. La feuille interroge cette copie. Une connexion en direct interroge la source à chaque action. L'extrait rend les explorations plus vives et fige la fraîcheur : on l'écrit sur le classeur, comme pour un import. On ne l'utilise pas pour prétendre que le chiffre est celui de la minute si l'extrait date de la nuit.

L'esprit des calculs de niveau n'est pas celui d'une mesure DAX, et ce chapitre ne refait pas DAX. Le repère tient en deux gestes.

- Dans Tableau, on pense **au grain de la feuille** et on le corrige avec FIXED, INCLUDE ou EXCLUDE quand la vue n'est pas le grain de la question.
- Dans un modèle de mesures (l'esprit DAX), on pense au **contexte de filtre** : ce que les segments, les axes et les relations laissent passer, et la mesure réagit à ce contexte sans être recopiée dans chaque visuel.

Les deux peuvent calculer un panier juste. Ils ne se déboguent pas de la même façon. Devant un chiffre Tableau étonnant, la première question est : « quelles dimensions sont dans la vue, et mon calcul est-il fixé à un autre grain ? ». Devant une mesure qui change selon les filtres, la première question est : « quel contexte ce visuel lui envoie-t-il ? ». Mélanger les deux vocabulaires (« ce FIXED est un CALCULATE ») embrouille l'équipe. On garde, de chaque côté, la question qui aide vraiment.

# Exercices

## Exercice 1 : Lire le petit jeu

Avec le tableau C1 (Maison 40, Jardin 60) et C2 (Maison 30), donnez : le panier moyen des commandes, le montant Maison, le nombre de commandes distinctes vues dans Maison, et pourquoi 70 / 2 n'est pas « le » panier du réseau.

<details>
<summary>Voir la solution</summary>

- Panier moyen des commandes : (100 + 30) / 2 = **65**.
- Montant Maison : 40 + 30 = **70**.
- Commandes distinctes dans Maison : **2** (C1 et C2).
- 70 / 2 = 35 est le montant Maison rapporté aux commandes qui touchent cette famille. Ce n'est pas le panier des commandes. C1 est aussi dans Jardin : additionner des « paniers de famille » recompte la commande. On nomme 35 autrement, ou on ne l'affiche pas comme panier du réseau.

</details>

## Exercice 2 : Choisir le type de calcul

La feuille montre le montant par famille. On veut deux chiffres dans chaque case : la part de la famille, et le panier moyen des commandes **du magasin entier**, stable d'une famille à l'autre. Quel type de calcul de niveau utilisez-vous pour la référence magasin, et pourquoi pas les deux autres ?

<details>
<summary>Voir la solution</summary>

La référence magasin se fait avec **EXCLUDE** sur la famille : on retire la dimension qui découpe la feuille, puis on divise le montant par le nombre distinct de commandes. Le ratio ne change pas d'une famille à l'autre.

FIXED pourrait aussi figer le grain magasin (ou le grain commande, puis une agrégation soigneuse), mais il faut alors nommer tout ce qui doit rester. Ici la feuille a déjà le bon niveau « du dessus » : EXCLUDE suffit et dit clairement « ignore la famille ».

INCLUDE ajouterait un grain plus fin. Il ne retire pas la famille. Il ne fabrique pas, à lui seul, la ligne de référence stable.

On vérifie sur C1 / C2 : la référence reste 65 dans les deux cases, tandis que les montants 70 et 60 restent ceux des familles.

</details>

## Exercice 3 : Extrait et mauvaise moyenne

Un classeur en extrait, rafraîchi à 6 h, affiche un « panier » par jour, puis la moyenne de ces paniers comme panier du mois. Le 1er du mois a 10 commandes de 20 €, le 2 a 1 000 commandes de 80 €. Quelqu'un s'étonne que le mois ne « tombe pas juste », et propose de passer en direct « pour que ce soit plus vrai ». Que répondez-vous ?

<details>
<summary>Voir la solution</summary>

Le décalage vient du **calcul**, pas de l'extrait. La moyenne des paniers quotidiens traite le 1er et le 2 à égalité. Le panier du mois est le montant total divisé par le nombre de commandes : (10×20 + 1000×80) / (10 + 1000) = 80 200 / 1 010, bien plus proche de 80 que de la moyenne de 20 et 80.

On écrit la mesure au bon grain (somme / compte distinct sur le mois), on la contrôle sur ces deux jours, et on garde l'extrait si la fraîcheur de 6 h suffit. Le direct ne répare pas une moyenne de moyennes. Il changerait la charge et l'heure, pas l'arithmétique. L'heure de l'extrait s'affiche sur la feuille.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Tableau et niveau de détail
center: Le panier dépend du grain. FIXED, INCLUDE et EXCLUDE corrigent le grain de la feuille.
points:
  - icon: layers
    title: Dimension, mesure
    text: La dimension découpe, la mesure se résume. Regardez la feuille avant la formule.
  - icon: target
    title: FIXED
    text: Le calcul reste au grain nommé, même si le graphique découpe autrement.
  - icon: filter
    title: INCLUDE, EXCLUDE
    text: On ajoute un grain plus fin, ou on retire une dimension pour une référence.
  - icon: money
    title: Panier moyen
    text: Montant total sur nombre de commandes. Pas la moyenne des paniers d'un niveau plus fin.
  - icon: clock
    title: Extrait
    text: Copie rapide, fraîcheur datée. Le direct ne répare pas une formule.
  - icon: scale
    title: Autre esprit
    text: "Ici on corrige le grain de la vue. Ailleurs, la mesure réagit au contexte de filtre."
pitfall: Moyenner des lignes après un FIXED commande compte deux fois une commande découpée.
remember: Deux commandes jouet suffisent à vérifier 65 avant de publier le panier.
```
