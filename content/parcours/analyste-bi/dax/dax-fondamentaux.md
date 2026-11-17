---
title: Les fondamentaux du DAX
description: Écrire des mesures avec SUM, DIVIDE et VAR, choisir le format, et ne plus jamais sommer une colonne de taux.
duration: 60
objectives:
  - Choisir une mesure plutôt qu'une colonne calculée pour un indicateur
  - Écrire une somme, une division protégée et une mesure à variables
  - Fixer le format d'affichage sans multiplier le taux par cent
  - Expliquer pourquoi la somme d'une colonne de taux n'est pas un taux
---

# Mesure ou colonne calculée

Le DAX sert à deux objets très différents. La **colonne calculée** vit sur une ligne. Elle est calculée au rafraîchissement, stockée, et elle peut devenir un slicer. La **mesure** n'est pas stockée ligne à ligne. Elle est calculée à la lecture, dans les filtres du visuel : le mois, le magasin, la famille.

| | Colonne calculée | Mesure |
|---|---|---|
| Quand | Au rafraîchissement | Quand le visuel interroge le modèle |
| Contexte | La ligne en cours | Les filtres en cours |
| Stockage | Oui, elle grossit le modèle | Non |
| Slicer | Oui, si on la laisse visible | Non |
| Exemple légitime | Tranche de prix catalogue | Chiffre d'affaires, taux, écart |

Le chiffre d'affaires n'est pas une colonne. Il dépend de la question. « Les boissons à Lyon en mars » n'est pas une valeur qu'on peut écrire la nuit sur chaque ligne de produit. C'est une mesure.

```dax
CA = SUM ( Ventes[Montant HT] )
```

Cette mesure n'a pas de magasin écrit dedans. Le slicer Lyon, l'axe des mois et le filtre Boissons la restreignent de l'extérieur. Une seule définition sert tous les visuels. Si la règle change (passer du TTC au HT, ou exclure les magasins test), on change la mesure, pas cinquante graphiques.

La colonne calculée reste utile pour un attribut **qui ne dépend pas du rapport**. Une tranche « moins de 5 € / 5 à 20 € / plus de 20 € » sur le prix catalogue se filtre. Elle peut vivre dans la préparation des données. Si elle doit vraiment être en DAX, c'est une colonne, visible, nommée `Tranche de prix`. Ce n'est pas un chiffre d'affaires.

```video
url: https://www.youtube.com/watch?v=ePPi1LLX0sA
title: "Measures vs. calculated columns in DAX and Power BI"
channel: "SQLBI"
duration: "6:00"
lang: en
why: "SQLBI, la référence du DAX, explique la différence entre une mesure et une colonne calculée."
```

# Sommer avec SUM

`SUM` additionne une colonne numérique dans les filtres en cours. Au grain ligne de ticket, c'est la brique du chiffre d'affaires, de la quantité et du coût.

```dax
CA = SUM ( Ventes[Montant HT] )

Quantité = SUM ( Ventes[Quantité] )

Coût = SUM ( Ventes[Coût] )
```

Deux lignes suffisent à voir ce que `SUM` fait, et ce qu'il ne fait pas.

| Produit | Quantité | Montant HT | Coût |
|---|---|---|---|
| Pain | 2 | 3,20 | 1,40 |
| Café | 1 | 2,10 | 0,40 |

Sans filtre, `CA` vaut 5,30. Filtre Pain, `CA` vaut 3,20. La formule n'a pas changé. Le filtre a changé les lignes vues par `SUM`.

`SUM` ignore le contexte de ligne. Posée telle quelle dans une colonne calculée de `Produits`, la formule `SUM ( Ventes[Montant HT] )` renvoie **le même total sur chaque produit**, parce qu'une colonne n'a pas les filtres du visuel. Il lui faut une transition de contexte, sujet du chapitre suivant. En attendant : on ne met pas `SUM` dans une colonne pour « faire le CA du produit ». On crée la mesure, et on la pose dans un visuel qui a le produit sur les lignes.

Quand le montant n'est pas stocké, on le reconstruit ligne à ligne avec `SUMX`, qui parcourt la table et somme une expression. Si `Montant HT` existe déjà, `SUM` suffit et se lit plus vite.

```dax
CA reconstruit =
SUMX (
    Ventes,
    Ventes[Quantité] * Ventes[Prix unitaire]
)
```

Sur le pain, 2 × 1,60. Sur le café, 1 × 2,10. `SUMX` renvoie 5,30, comme `SUM` du montant. On ne garde pas les deux définitions. Une mesure publiée, une seule.

# Diviser sans erreur

Un taux est une division de deux mesures, pas une moyenne de taux. `DIVIDE` protège le cas où le dénominateur vaut 0 ou est vide : le résultat est vide, pas une erreur qui casse la carte.

```dax
Marge = [CA] - [Coût]

Taux de marge = DIVIDE ( [Marge], [CA] )
```

Sur le pain et le café, le coût est 1,40 + 0,40, soit 1,80. La marge est 5,30 - 1,80, soit 3,50. Le taux est 3,50 / 5,30, soit 66,0 %. `[CA]` et `[Coût]` sont des mesures. Elles tiennent compte des filtres. Le taux du pain seul est (3,20 - 1,40) / 3,20 = 56,3 %. Le taux du café est (2,10 - 0,40) / 2,10 = 81,0 %. Aucune de ces formules ne moyenne 56,3 et 81,0 : cette moyenne vaudrait 68,7 %, pas 66,0 %.

Le troisième argument de `DIVIDE` remplace le vide si vous voulez afficher 0 quand il n'y a pas de ventes. Pour un taux, le vide est souvent plus honnête qu'un 0 % : 0 % ressemble à une marge nulle, alors qu'il n'y avait rien à diviser.

```dax
Taux de marge = DIVIDE ( [Marge], [CA] )
```

L'opérateur `/` existe. Il renvoie une erreur de division par zéro, que le visuel encaisse mal. On prend `DIVIDE` pour tout ratio publié : taux de marge, panier moyen, part d'un total.

# Nommer les étapes avec VAR

`VAR` donne un nom à une étape. La mesure se lit de haut en bas, et une étape utilisée deux fois n'est écrite qu'une fois. `RETURN` renvoie le résultat.

Le panier moyen est le chiffre d'affaires divisé par le nombre de tickets. Le numéro de ticket est sur le fait. On compte ses valeurs distinctes, pas les lignes : le ticket du pain et du café ne doit compter qu'une fois.

```dax
Tickets = DISTINCTCOUNT ( Ventes[Numéro ticket] )

Panier moyen =
VAR Chiffre = [CA]
VAR Passages = [Tickets]
RETURN
    DIVIDE ( Chiffre, Passages )
```

Sur l'exemple, `Chiffre` vaut 5,30 et `Passages` vaut 1. Le panier est 5,30. Si l'on avait divisé par `COUNTROWS ( Ventes )`, le dénominateur aurait valu 2, et le panier 2,65, ce qui est un montant par ligne, pas un panier.

`VAR` fige la valeur **au moment où la ligne est évaluée**. Dans cette mesure, c'est ce qu'on veut : lire le CA filtré, lire les tickets filtrés, diviser. On n'utilise pas `VAR` pour « optimiser » une formule qu'on ne sait pas encore lire. On l'utilise pour nommer.

```diagram
type: flow
title: Lecture d'une mesure à variables
steps:
  - title: Filtres du visuel
    text: Mois, magasin et famille restreignent Ventes avant la formule.
    tone: violet
  - title: VAR Chiffre
    text: La mesure CA somme le montant HT des lignes restantes.
    tone: blue
  - title: VAR Passages
    text: Les numéros de ticket distincts comptent les passages, pas les lignes.
    tone: teal
  - title: RETURN
    text: DIVIDE protège un magasin qui n'a aucun ticket.
    tone: amber
```

Une variable ne voit pas les filtres que vous ajouteriez **après**, dans un `CALCULATE` placé plus bas, si vous l'avez déjà figée avant. Pour ce chapitre, la règle tient en une ligne : on nomme les blocs, puis on divise. Le changement de filtre est le chapitre suivant.

# Le format affiché

La mesure `Taux de marge` contient **0,660**, pas 66. Le format d'affichage « pourcentage, une décimale » se charge d'écrire 66,0 %. On ne multiplie pas par 100 **et** on ne formate pas en pourcentage : la carte afficherait 6 600 %.

| Mesure | Valeur stockée dans le calcul | Format | Affichage |
|---|---|---|---|
| Chiffre d'affaires HT | 5,30 | Euro, deux décimales | 5,30 € |
| Quantité | 3 | Nombre entier | 3 |
| Taux de marge | 0,660 | Pourcentage, une décimale | 66,0 % |
| Panier moyen | 5,30 | Euro, deux décimales | 5,30 € |

Le format ne change pas la valeur utilisée par une autre mesure. `DIVIDE ( [Marge], [CA] )` voit 0,660, jamais la chaîne « 66,0 % ». On peut donc enchaîner les mesures sans retraiter l'affichage.

On fixe le format **sur la mesure**, pas sur le visuel un par un. Sinon un export et une carte ne montrent pas la même chose, et quelqu'un « corrige » en multipliant par 100 dans la formule.

> [!TIP]
> Si vous devez commenter « c'est déjà en pourcentage », le format est au mauvais endroit. La formule garde un ratio entre 0 et 1. L'affichage ajoute le symbole.

# Le piège de la colonne sommée

La colonne calculée suivante a l'air d'un taux de marge. Elle ne l'est que **sur sa ligne**.

```dax
Taux ligne = DIVIDE ( Ventes[Marge], Ventes[Montant HT] )
```

| Ligne | Montant HT | Marge | Taux ligne |
|---|---|---|---|
| A | 100 | 40 | 0,40 |
| B | 10 | 1 | 0,10 |
| Somme de la colonne | 110 | 41 | 0,50 |

Sommer `Taux ligne` donne 0,50. Affiché en pourcentage, 50 %. Le vrai taux est 41 / 110 = **0,373**, soit 37,3 %. La somme des taux n'est ni la moyenne, ni le taux. C'est un nombre sans objet. Le petit ticket pèse autant que le gros dans cette somme, et rien ne prévient l'utilisateur, parce que la colonne est numérique et que le visuel propose « Somme » par défaut.

La mesure corrige le geste. Elle somme d'abord, elle divise ensuite.

```dax
Marge = SUM ( Ventes[Marge] )

Taux de marge = DIVIDE ( [Marge], [CA] )
```

Dans un tableau par magasin, chaque ligne recalcule la division sur les ventes de ce magasin. La ligne de total la recalcule sur l'ensemble, ce qui est exactement 37,3 % dans l'exemple, pas 50 %.

```diagram
type: compare
title: Somme des taux contre taux des sommes
columns:
  - title: Colonne Taux ligne sommée
    tone: rose
    items:
      - 0,40 plus 0,10 égale 0,50
      - Le ticket de 10 € pèse comme celui de 100 €
      - Le total affiche 50 %
  - title: Mesure Taux de marge
    tone: teal
    items:
      - 41 de marge sur 110 de CA
      - Chaque euro pèse selon son montant
      - Le total affiche 37,3 %
```

Le même piège guette le panier moyen stocké en colonne, le prix unitaire sommé, et toute « moyenne déjà calculée » qu'on réagrège avec `SUM`. La règle de publication : **on ne somme pas un ratio**. On publie la mesure qui refait la division au niveau où l'on se trouve.

# Exercices

## Exercice 1 : Trois mesures

Le fait `Ventes` a `Montant HT`, `Coût` et `Numéro ticket`. Écrivez `CA`, `Marge` et `Taux de marge`. Le taux doit rester vide s'il n'y a pas de chiffre d'affaires, et il ne doit pas être multiplié par 100.

<details>
<summary>Voir la solution</summary>

```dax
CA = SUM ( Ventes[Montant HT] )
```

```dax
Marge = [CA] - SUM ( Ventes[Coût] )
```

```dax
Taux de marge = DIVIDE ( [Marge], [CA] )
```

Le format de `Taux de marge` est un pourcentage. La valeur reste un ratio. `DIVIDE` renvoie vide si `CA` vaut 0. On ne réécrit pas le taux dans chaque visuel : les trois noms sont les définitions publiées.

</details>

## Exercice 2 : La colonne qui ment

Une colonne `Taux ligne` vaut 0,40 sur une ligne de 100 € (marge 40 €) et 0,10 sur une ligne de 10 € (marge 1 €). Un visuel somme cette colonne et affiche 50 %.

Donnez le taux juste, et la mesure qui le produit au total comme au niveau d'un magasin.

<details>
<summary>Voir la solution</summary>

Le taux juste est 41 / 110 = **37,3 %**, pas 50 %. La somme 0,40 + 0,10 n'a pas de sens.

```dax
Taux de marge = DIVIDE ( SUM ( Ventes[Marge] ), SUM ( Ventes[Montant HT] ) )
```

Ou, ce qui revient au même si les mesures existent déjà : `DIVIDE ( [Marge], [CA] )`. Dans un tableau par magasin, chaque ligne et le total réévaluent cette division. On retire la somme de `Taux ligne` du visuel, et on masque la colonne si elle ne sert pas de contrôle au grain ligne.

</details>

## Exercice 3 : Colonne ou mesure

Pour chaque besoin, choisissez colonne calculée ou mesure, et dites pourquoi : tranche de prix catalogue (moins de 5 €, 5 à 20 €, plus de 20 €), panier moyen du mois filtré, coût total des ventes, libellé de famille.

<details>
<summary>Voir la solution</summary>

- Tranche de prix catalogue : **colonne** (ou, mieux, attribut préparé en amont). Elle ne dépend pas du mois filtré et doit pouvoir servir de slicer. On la laisse visible.
- Panier moyen du mois filtré : **mesure**, avec `DIVIDE` et le nombre de tickets. Il change dès que le filtre de mois change.
- Coût total : **mesure** `SUM ( Ventes[Coût] )`. C'est un agrégat, pas un attribut de ligne à stocker une deuxième fois.
- Libellé de famille : **ni l'un ni l'autre en DAX**. C'est un attribut de `Produits`, chargé avec le catalogue.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Les fondamentaux du DAX
center: Une mesure somme ou divise dans les filtres du visuel. Une colonne de taux, une fois sommée, ne dit plus la marge.
points:
  - icon: chart
    title: La mesure
    text: CA = SUM du montant HT. Le mois et le magasin filtrent de l'extérieur, la formule reste unique.
  - icon: code
    title: DIVIDE et VAR
    text: On nomme le chiffre et les tickets, puis on divise. DIVIDE laisse vide si le dénominateur est nul.
  - icon: ruler
    title: Le format
    text: La mesure garde 0,472. Le format pourcentage affiche 47,2 %. On ne multiplie pas par 100.
  - icon: alert
    title: Taux sommé
    text: 0,40 plus 0,10 font 0,50. Le vrai taux est 41 sur 110, soit 37,3 %.
  - icon: check
    title: Colonne utile
    text: Une tranche de prix catalogue peut être une colonne. Un panier moyen, non.
pitfall: Laisser le visuel sommer une colonne de taux, parce que la somme est le geste proposé par défaut.
remember: On somme les euros, puis on divise. On ne somme jamais les taux déjà calculés.
```
