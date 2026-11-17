---
title: Mesures avancées et patterns DAX
description: Écrire un stock et un solde semi-additifs, un comptage distinct, des ratios de mesures, et la fiche qui les documente.
duration: 68
objectives:
  - Calculer un stock de fin de période et un solde qui garde son ouverture
  - Compter des clients ou des tickets sans additionner les distincts
  - Composer un ratio et un écart à partir de mesures déjà publiées
  - Rédiger la fiche d'une mesure que le contrôle de gestion peut relire
---

# Stock et solde, la semi-additivité

Le stock et le solde ne se somment pas dans le temps. Ils se lisent **à une date**. Deux faits différents portent cette idée, et ils n'utilisent pas la même formule.

`StockJour` est un cliché : une ligne par jour, produit et magasin, avec la quantité en rayon ce soir-là. Café à Lyon :

| Date | Quantité |
|---|---|
| 1er mars | 10 |
| 2 mars | 12 |
| 3 mars | 9 |

`SUM` sur les trois jours vaut **31**. Ce n'est pas un stock. Le stock de la période est celui du **dernier jour encore visible**, ici 9.

```dax
Quantité stock = SUM ( StockJour[Quantité] )

Stock =
CALCULATE (
    [Quantité stock],
    LASTDATE ( 'Date'[Date] )
)
```

`LASTDATE` renvoie le dernier jour du contexte. Dans un visuel par jour, chaque ligne montre son propre soir. Dans un visuel par mois, la ligne mars montre le **31 mars**, pas la somme des soirs. La ligne Total du trimestre montre le dernier jour du trimestre. Ce total n'est pas la somme des trois mois, et il ne faut pas le « corriger » : un stock de fin de trimestre n'est pas la somme des stocks de fin de mois. Le nom publié est `Stock de fin de période`.

Si le cliché a des trous (magasin fermé le dimanche, pas de ligne), `LASTDATE` tombe sur un jour vide et le stock disparaît. On prend alors le dernier jour **où la quantité n'est pas vide** :

```dax
Stock =
CALCULATE (
    [Quantité stock],
    LASTNONBLANK ( 'Date'[Date], [Quantité stock] )
)
```

Le second argument est la mesure simple, `[Quantité stock]`, pas `[Stock]`. Rappeler `[Stock]` à l'intérieur de `[Stock]` boucle. Et un `SUM` nu à la place de la mesure ignore le jour en cours : il n'est jamais vide, donc `LASTNONBLANK` retombe sur le dernier jour du calendrier, trou compris.

`Ecritures` n'est pas un cliché. C'est un flux. Le solde du compte magasin vaut l'ouverture plus les mouvements. Avant mars, le solde est **1 000**. Mars : +100 le 1er, +50 le 2, −20 le 3. Le solde au 3 mars est **1 130**. La somme des mouvements de mars seuls vaut **130** : c'est le flux du mois, pas le solde. `LASTDATE` sur les écritures vaudrait **−20**, le mouvement du dernier jour.

```dax
Solde =
VAR DernierJour =
    MAX ( 'Date'[Date] )
RETURN
    CALCULATE (
        SUM ( Ecritures[Montant signé] ),
        FILTER (
            ALL ( 'Date' ),
            'Date'[Date] <= DernierJour
        )
    )
```

`DernierJour` est lu **avant** `CALCULATE`, dans le filtre du visuel. En mars, c'est le 31 mars. `ALL ( 'Date' )` rouvre le calendrier, sinon l'ouverture de février resterait dehors. On ne garde que les jours jusqu'au 31 mars, et l'on somme les mouvements. Le filtre produit ou compte, lui, n'est pas retiré : `ALL` ne porte que sur `Date`.

```diagram
type: compare
title: Au 3 mars, trois lectures du même compte
columns:
  - title: Flux du mois
    tone: blue
    items:
      - Somme des mouvements de mars
      - +100, +50 et moins 20
      - 130, sans l'ouverture
  - title: Dernier mouvement
    tone: amber
    items:
      - LASTDATE sur les écritures
      - Seulement le 3 mars
      - Moins 20, pas un solde
  - title: Solde
    tone: teal
    items:
      - Ouverture 1 000 plus les flux
      - Tous les jours jusqu'au 3 mars
      - 1 130
```

Dans une matrice mensuelle, la ligne Total du solde est le solde du **dernier jour**, pas la somme des soldes de mois. On l'écrit dans la fiche. Un utilisateur qui exporte et qui additionne la colonne refait l'erreur de 31 unités, ou celle des soldes quotidiens. Le visuel peut masquer ce total, ou un sous-titre dit « fin de période ».

# DISTINCTCOUNT, compter sans double

Compter des lignes de `Ventes` compte des **lignes de ticket**. Le pain et le café du même passage font 2. Le nombre de tickets est le nombre de `Numéro ticket` distincts. Le nombre de clients acheteurs est le nombre de `Client Key` distincts **sur le fait déjà filtré**.

```dax
Tickets = DISTINCTCOUNT ( Ventes[Numéro ticket] )

Clients acheteurs = DISTINCTCOUNT ( Ventes[Client Key] )
```

La famille Boissons a été achetée par **120** clients. La dimension `Clients` contient **1 000** personnes. Avec une relation en sens unique, le filtre Boissons descend vers `Ventes` et **ne remonte pas** vers `Clients`.

```dax
Clients fiche = DISTINCTCOUNT ( Clients[Client Key] )
```

Cette mesure vaut encore **1 000** sous le slicer Boissons. Elle compte la dimension, que personne n'a filtrée. `Clients acheteurs`, sur la clé portée par les lignes de vente, vaut **120**. C'est la mesure à publier. L'autre compte un référentiel.

Le distinct n'est pas additif. Lyon a 100 clients, Paris 80, et 30 personnes ont acheté dans les deux magasins. La somme des lignes du visuel est 180. Le total enseigne est **150**. Le modèle n'est pas cassé. Sommer les distincts des magasins recompterait les 30. On ne force pas le total à 180.

| Niveau | Clients distincts | A-t-on le droit de sommer ? |
|---|---|---|
| Lyon | 100 | Non, pas avec Paris |
| Paris | 80 | Non, 30 clients sont dans les deux |
| Enseigne | 150 | C'est le recalcul au niveau enseigne, pas 180 |

Un ticket de retour qui réutilise le même numéro ne crée pas un deuxième passage : `DISTINCTCOUNT` le compte une fois. Un avoir qui ouvre un **nouveau** numéro compte comme un ticket, avec un montant négatif, et il déforme le panier moyen. Si la règle métier est « passages qui ont vendu quelque chose », on restreint aux lignes positives :

```dax
Tickets vendus =
CALCULATE (
    DISTINCTCOUNT ( Ventes[Numéro ticket] ),
    Ventes[Montant HT] > 0
)
```

On documente l'exclusion. On ne laisse pas deux mesures s'appeler toutes les deux « tickets ».

# Les ratios au niveau affiché

Un ratio se recalcule **là où on l'affiche**. Il appelle des mesures additives ou des comptages, puis `DIVIDE`. Il n'appelle pas une colonne de taux.

```dax
Marge = [CA] - [Coût]

Taux de marge = DIVIDE ( [Marge], [CA] )

Panier moyen = DIVIDE ( [CA], [Tickets] )
```

Lyon : 100 € de CA, 40 € de marge, taux 40 %, 20 tickets, panier 5 €. Paris : 1 000 € de CA, 100 € de marge, taux 10 %, 200 tickets, panier 5 €. L'enseigne n'est pas la moyenne des taux. La marge enseigne est 140 € sur 1 100 €, soit **12,7 %**. Le panier enseigne est 1 100 / 220 = **5 €**. Ici les paniers coïncident. Les taux, non. Le fait que le panier « tombe juste » en moyennant 5 et 5 ne donne pas le droit de moyenner les taux à côté.

```diagram
type: decision
title: Ce nombre peut-il être sommé dans le visuel ?
nodes:
  - question: Est-ce un montant ou une quantité du même grain, comme le CA ou les unités vendues ?
    yes: SUM, la mesure est additive
    no: Question suivante
  - question: Est-ce un niveau à une date, stock ou solde ?
    yes: Fin de période ou cumul des flux, jamais la somme des dates
    no: DIVIDE ou DISTINCTCOUNT, recalculés au niveau affiché
```

Le prix unitaire suit la même règle que le taux. 3,20 € pour 2 pains n'est pas un prix que l'on somme au café. Le prix moyen de l'extrait est le montant divisé par la quantité, dans le filtre en cours.

# Des mesures construites sur des mesures

L'écart, le ratio et le classement **n'ont pas leur propre somme**. Ils appellent les mesures dont le périmètre est déjà décidé. Si `[CA]` exclut les magasins test et passe en HT, l'écart N-1 suit, sans qu'on réécrive un `SUM`.

Mars 2025 vaut **30 000**. Mars 2024 vaut **22 000**.

```dax
CA N-1 =
CALCULATE (
    [CA],
    SAMEPERIODLASTYEAR ( 'Date'[Date] )
)

Ecart CA = [CA] - [CA N-1]

Ecart CA % = DIVIDE ( [Ecart CA], [CA N-1] )
```

L'écart vaut **8 000**. L'écart relatif vaut 8 000 / 22 000 = **36,4 %**. Trois mesures, une seule définition du chiffre. La chaîne se lit : `Ecart CA %` dépend de `Ecart CA`, qui dépend de `CA` et de `CA N-1`, qui dépend de `CA`.

On évite la copie qui re-somme :

```dax
Ecart faux =
SUM ( Ventes[Montant HT] )
    - CALCULATE (
        SUM ( Ventes[Montant HT] ),
        SAMEPERIODLASTYEAR ( 'Date'[Date] )
    )
```

Le jour où `[CA]` retire les magasins test, `Ecart faux` continue de les compter. Les deux cartes divergent. Personne ne sait laquelle est la définition. La règle de dépendance est courte : **une mesure de haut niveau n'appelle que des mesures**, pas la colonne source, sauf la mesure de base elle-même (`CA`, `Coût`, `Quantité stock`).

```diagram
type: layers
title: Dépendances de l'écart relatif
layers:
  - title: Ecart CA %
    text: DIVIDE de l'écart par le CA N-1, format pourcentage
  - title: Ecart CA
    text: CA moins CA N-1
  - title: CA et CA N-1
    text: La même somme, la seconde décalée d'un an
  - title: Ventes
    text: Montant HT au grain ligne de ticket, un seul endroit
```

Un classement « Gold si le CA de la période dépasse 500 € » est lui aussi une mesure, parce qu'il dépend du filtre. Il ne devient pas une colonne cachée sur `Clients`. S'il doit slicer, c'est un attribut préparé dans la donnée, avec un SCD si l'historique compte.

# La fiche d'une mesure

Une mesure publiée a une **fiche** de quelques lignes, dans la description du modèle ou à côté de lui. Le DAX seul ne dit pas si les retours sont négatifs, si les magasins test sont dedans, ni ce que veut dire la ligne Total.

| Rubrique | Chiffre d'affaires HT | Stock de fin de période |
|---|---|---|
| Phrase | Somme du montant HT des lignes de ticket | Quantité en rayon au dernier jour de la période |
| Grain | Ligne de ticket. Sommable partout | Jour, produit, magasin. Sommable entre produits et magasins, pas entre les jours |
| Inclus | Retours en montant négatif | Dernier cliché disponible si l'on a choisi LASTNONBLANK |
| Exclus | TVA, magasins test | La somme des soirs, les mouvements de stock |
| Total d'un visuel | Somme des lignes, s'il n'y a pas de pont N-N | Dernier jour de la période, pas la somme des mois |
| Propriétaire | Contrôle de gestion | Supply chain |
| Dépend de | Colonne Montant HT | Quantité stock |

La fiche du CA, en phrase que l'on peut coller dans la description :

« Somme du montant HT des lignes de ticket. Les retours sont déjà négatifs, on ne les retranche pas une seconde fois. Hors TVA, hors magasins test. Additive. La définition est la mesure `CA`. Propriétaire : contrôle de gestion. »

Celle du solde précise l'ouverture : « Mouvements signés cumulés jusqu'au dernier jour visible, ouvertures comprises. Le total d'une matrice mensuelle est le solde de fin, pas la somme des mois. Propriétaire : trésorerie des magasins. »

Sans fiche, `Stock` et `SUM ( StockJour[Quantité] )` finissent toutes les deux dans un rapport, et la revue mensuelle pilote 31 unités au lieu de 9.

# Un catalogue court pour l'enseigne

Le premier jeu publié tient sur une page. On n'ajoute un nom que si la fiche existe. Les noms sont ceux du métier, les formules restent courtes.

| Mesure | Formule de référence | Total du visuel |
|---|---|---|
| CA | `SUM ( Ventes[Montant HT] )` | Somme |
| Coût | `SUM ( Ventes[Coût] )` | Somme |
| Marge | `[CA] - [Coût]` | Somme, car les deux termes le sont |
| Taux de marge | `DIVIDE ( [Marge], [CA] )` | Recalcul, pas moyenne des taux |
| Tickets | `DISTINCTCOUNT ( Ventes[Numéro ticket] )` | Recalcul, pas somme des magasins |
| Panier moyen | `DIVIDE ( [CA], [Tickets] )` | Recalcul |
| Clients acheteurs | `DISTINCTCOUNT ( Ventes[Client Key] )` | Recalcul |
| CA N-1 | `CALCULATE ( [CA], SAMEPERIODLASTYEAR ( 'Date'[Date] ) )` | Même décalage sur la période du total |
| Ecart CA % | `DIVIDE ( [CA] - [CA N-1], [CA N-1] )` | Recalcul |
| Stock de fin de période | `CALCULATE ( [Quantité stock], LASTDATE ( 'Date'[Date] ) )` | Dernier jour |

```diagram
type: stack
title: Ce que la revue mensuelle a le droit de voir en premier
segments:
  - label: Activité
    value: 40
    tone: teal
    text: CA, tickets, panier moyen
  - label: Marge
    value: 30
    tone: violet
    text: Marge en euros et taux
  - label: Temps
    value: 20
    tone: blue
    text: N-1 et écart
  - label: Niveau
    value: 10
    tone: amber
    text: Stock de fin, pas la somme des jours
```

Le catalogue s'arrête là tant que ces dix mesures ne sont pas justes sur un magasin, sur un mois, et sur le total. Une onzième mesure qui compense un total faux est le signe que le grain, la relation ou la fiche n'est pas réglé.

# Exercices

## Exercice 1 : 31 unités ou 9

Le café à Lyon est en stock de 10, puis 12, puis 9 les 1er, 2 et 3 mars. Le cliché existe chaque jour. Écrivez la mesure de fin de période et dites ce que montre la ligne Total d'un visuel qui contient ces trois jours.

<details>
<summary>Voir la solution</summary>

```dax
Quantité stock = SUM ( StockJour[Quantité] )

Stock de fin de période =
CALCULATE (
    [Quantité stock],
    LASTDATE ( 'Date'[Date] )
)
```

Chaque jour montre son stock. La ligne Total montre le **3 mars**, donc **9**, pas 31. 31 est la somme des clichés, que l'on ne publie pas. Si le dimanche n'avait pas de ligne, on remplacerait `LASTDATE` par `LASTNONBLANK ( 'Date'[Date], [Quantité stock] )`, en appelant la somme simple et pas la mesure de fin de période elle-même.

</details>

## Exercice 2 : 130 ou 1 130

Le compte magasin est à 1 000 avant mars. Les mouvements de mars sont +100, +50 et −20. Un collègue somme les mouvements dans le filtre du mois et affiche 130 comme « solde ».

Donnez le solde au 3 mars et la structure de la mesure qui le produit.

<details>
<summary>Voir la solution</summary>

Le solde est 1 000 + 100 + 50 − 20 = **1 130**. 130 est le flux de mars. `LASTDATE` sur les écritures donnerait −20, le dernier mouvement.

```dax
Solde =
VAR DernierJour = MAX ( 'Date'[Date] )
RETURN
    CALCULATE (
        SUM ( Ecritures[Montant signé] ),
        FILTER ( ALL ( 'Date' ), 'Date'[Date] <= DernierJour )
    )
```

`ALL ( 'Date' )` est nécessaire pour réintégrer l'ouverture, que le filtre « mars » avait écartée. On ne rouvre pas les autres dimensions.

</details>

## Exercice 3 : La fiche avant le nom

La revue veut « le taux de marge », « les clients » et « l'écart en pourcentage versus l'an dernier ». Lyon : 100 € de CA, 40 € de marge, 100 clients. Paris : 1 000 €, 100 € de marge, 80 clients, dont 30 aussi chez Lyon. Mars 2025 : CA 30 000. Mars 2024 : 22 000.

Donnez le taux enseigne, le nombre de clients enseigne, l'écart relatif, et les trois points que la fiche du taux doit contenir.

<details>
<summary>Voir la solution</summary>

Taux enseigne : 140 / 1 100 = **12,7 %**, pas 25 % et pas 50 %. Mesure : `DIVIDE ( [Marge], [CA] )`.

Clients enseigne : **150**, pas 180 et pas 1 000. Mesure : `DISTINCTCOUNT ( Ventes[Client Key] )`, pas le distinct de la dimension.

Écart relatif : (30 000 − 22 000) / 22 000 = **36,4 %**. Mesures : `CA N-1`, puis `DIVIDE ( [CA] - [CA N-1], [CA N-1] )`.

La fiche du taux dit au minimum : c'est une division de la somme des marges par la somme des CA (pas une moyenne de taux), le total du visuel est recalculé, le propriétaire est le contrôle de gestion. Elle renvoie vers les mesures `Marge` et `CA`, qui portent elles-mêmes le périmètre HT et magasins test.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Mesures avancées et patterns DAX
center: "Le stock se lit en fin de période, le distinct se recalcule, et toute mesure publiée a une fiche."
points:
  - icon: gauge
    title: Stock et solde
    text: 9 unités au dernier soir, pas 31. Le solde 1 130 garde l'ouverture de 1 000.
  - icon: users
    title: Distinct
    text: 120 acheteurs de boissons, pas les 1 000 fiches. Lyon plus Paris font 150, pas 180.
  - icon: scale
    title: Ratios
    text: 140 € de marge sur 1 100 € font 12,7 %. La moyenne de 40 % et 10 % ne se publie pas.
  - icon: layers
    title: Mesures de mesures
    text: L'écart appelle CA et CA N-1. Il ne resomme pas la colonne de son côté.
  - icon: book
    title: La fiche
    text: Phrase, grain, exclusions, sens du total, propriétaire. Sinon deux définitions cohabitent.
pitfall: "Sommer le stock sur le mois, ou compter la dimension Clients pendant qu'un slicer ne filtre que les ventes."
remember: Une mesure de haut niveau appelle des mesures. La ligne Total a le droit d'être un dernier jour ou un recalcul.
```
