---
title: Contexte de filtre et CALCULATE
description: Distinguer contexte de ligne et contexte de filtre, puis écrire un pourcentage du total qui ne vaut pas 100 %.
duration: 64
objectives:
  - Reconnaître un contexte de ligne et un contexte de filtre
  - Modifier les filtres d'une mesure avec CALCULATE
  - Choisir FILTER, ALL ou REMOVEFILTERS selon le filtre à retirer
  - Expliquer, avec des montants, pourquoi un pourcentage du total se trompe
---

# Le contexte de ligne

Le **contexte de ligne** apparaît quand DAX parcourt une table **ligne par ligne** : dans une colonne calculée, dans `SUMX`, dans `FILTER`. Sur cette ligne, on peut lire les colonnes. `Ventes[Quantité]` vaut la quantité de la ligne en cours, pas la somme du magasin.

`SUM`, lui, **ne regarde pas** la ligne en cours. Il regarde les filtres. Écrite au mauvais endroit, la fonction somme donc trop grand, et elle le fait à chaque passage.

Deux lignes, pain 3,20 € et café 2,10 €. Le total est 5,30 €.

```dax
Mauvais =
SUMX (
    Ventes,
    SUM ( Ventes[Montant HT] )
)
```

`SUMX` passe sur la première ligne. `SUM` ignore cette ligne et renvoie 5,30. `SUMX` passe sur la seconde ligne. `SUM` renvoie encore 5,30. Le résultat est **10,60**. On a additionné le total autant de fois qu'il y a de lignes.

La forme juste lit la colonne dans le contexte de ligne, sans rappeler `SUM` :

```dax
CA lignes =
SUMX (
    Ventes,
    Ventes[Montant HT]
)
```

Pain 3,20, café 2,10, total 5,30. Si la colonne `Montant HT` existe déjà, la mesure du chapitre précédent suffit : `SUM ( Ventes[Montant HT] )`, **en dehors** de tout `SUMX`.

> [!WARNING]
> Dans un parcours ligne à ligne, une colonne se lit par son nom. `SUM` à l'intérieur du parcours ne voit pas la ligne : il répète le total.

# Le contexte de filtre

Le **contexte de filtre** est l'ensemble des restrictions venues du rapport : slicers, axes, filtres de page, filtres de visuel. Une mesure est évaluée **dans** ce contexte. Elle ne contient pas le nom du magasin. Le visuel le fournit.

Chiffre d'affaires HT des trois magasins, toutes familles :

| Magasin | Boissons | Autres familles | Total magasin |
|---|---|---|---|
| Lyon Part-Dieu | 8 000 | 32 000 | 40 000 |
| Paris Opéra | 18 000 | 42 000 | 60 000 |
| Lille Centre | 4 000 | 16 000 | 20 000 |
| Total | 30 000 | 90 000 | 120 000 |

Un visuel par magasin, sans autre filtre, évalue `[CA]` trois fois. Pour la ligne Lyon, le contexte de filtre est « magasin = Lyon ». `[CA]` vaut 40 000. La ligne Total n'a pas de filtre de magasin. `[CA]` vaut 120 000. Même mesure, trois contextes, trois résultats.

Le slicer Famille = Boissons **ajoute** un filtre. Il ne remplace pas la mesure. Lyon vaut alors 8 000, Paris 18 000, Lille 4 000, le total 30 000. Les autres familles sont hors contexte. Elles n'ont pas été soustraites à la main.

```diagram
type: flow
title: Ce qui restreint une mesure
steps:
  - title: Slicers
    text: La famille Boissons écarte les autres familles.
    tone: violet
  - title: Axe du visuel
    text: La ligne Lyon ajoute le filtre magasin.
    tone: blue
  - title: Mesure CA
    text: SUM ne voit que les lignes encore autorisées.
    tone: teal
  - title: Résultat
    text: Lyon en boissons vaut 8 000, pas 40 000.
    tone: amber
```

Retenir l'image : le contexte de ligne répond « quelle ligne suis-je en train de lire ? ». Le contexte de filtre répond « quelles lignes ai-je encore le droit de sommer ? ». Une mesure publiée vit dans le second.

```video
url: https://www.youtube.com/watch?v=L5WR-imfyYI
title: "Filter context in DAX explained visually"
channel: "SQLBI"
duration: "24:40"
lang: en
why: "Le contexte de filtre rendu visuel par SQLBI, la notion qui rend tout le reste du DAX compréhensible."
```

# CALCULATE change le contexte

`CALCULATE` évalue une expression dans un contexte de filtre **modifié**. C'est aussi lui qui transforme un contexte de ligne en contexte de filtre. On appelle cela la **transition de contexte**. Sans elle, une mesure lue pendant un parcours de lignes ne sait pas sur quelle ligne elle est.

Sur `Produits`, une colonne calculée naïve échoue. Pain a 30 000 € de ventes, Café 12 000 €, le total enseigne de cet extrait est 42 000 €.

```dax
CA du produit = SUM ( Ventes[Montant HT] )
```

`SUM` ignore la ligne Pain comme la ligne Café. Les deux affichent **42 000**.

```dax
CA du produit = CALCULATE ( SUM ( Ventes[Montant HT] ) )
```

`CALCULATE` sans argument de filtre fait quand même la transition : la ligne Pain devient le filtre « ce produit ». Pain affiche 30 000, Café 12 000. Dans une mesure, on n'écrit pas cette colonne. On pose `[CA]` dans un visuel qui a le produit en lignes, et le filtre est déjà là. La transition sert le jour où l'on parcourt une table dans la formule.

Elle sert surtout dans `FILTER`, parce que la condition est évaluée ligne à ligne. On veut les magasins dont le chiffre d'affaires dépasse 50 000 €. Seul Paris, à 60 000 €, qualifie. Le résultat attendu d'une carte est **60 000**, pas 120 000.

```dax
CA gros magasins =
CALCULATE (
    [CA],
    FILTER ( Magasins, [CA] > 50000 )
)
```

Pour chaque magasin, `[CA]` subit la transition et vaut le CA **de ce magasin**. Lyon 40 000 est écarté, Lille 20 000 aussi, Paris reste. Si l'on écrit `SUM ( Ventes[Montant HT] ) > 50000` à la place de `[CA] > 50000`, `SUM` vaut 120 000 sur **chaque** magasin. Tout le monde dépasse 50 000. La mesure renvoie 120 000 et a l'air « complète ». Elle n'a filtré personne.

> [!IMPORTANT]
> Dans `FILTER`, la condition qui dépend du magasin en cours doit être une **mesure**, ou un `CALCULATE`. Un `SUM` nu compare le total général, pas la ligne.

Un filtre simple, qui ne dépend pas d'une mesure, n'a pas besoin de `FILTER`. Il se pose en argument de `CALCULATE` :

```dax
CA boissons =
CALCULATE (
    [CA],
    Produits[Famille] = "Boissons"
)
```

Ce prédicat remplace le filtre déjà posé sur la colonne `Famille`. Il ne retire pas le filtre de magasin ni celui de l'année. Lyon plus ce filtre vaut 8 000.

```video
url: https://www.youtube.com/watch?v=HxZLkmpY6BA
title: "Introducing CALCULATE in DAX"
channel: "SQLBI"
duration: "13:57"
lang: en
why: "La présentation de CALCULATE par SQLBI : comment la fonction modifie le contexte de filtre."
```

# FILTER, ALL et REMOVEFILTERS

Les trois noms retirent ou fabriquent des filtres. Ils ne sont pas interchangeables.

| Fonction | Ce qu'elle fait | À réserver à |
|---|---|---|
| Prédicat dans `CALCULATE` | Remplace le filtre d'**une colonne** | Une valeur connue, comme la famille Boissons |
| `FILTER` | Parcourt une table et n'en garde que les lignes qui passent une condition | Une condition qui appelle une mesure |
| `REMOVEFILTERS` | Retire des filtres, sans fabriquer une table | Le dénominateur d'un pourcentage |
| `ALL` | Retire des filtres, et peut aussi renvoyer toutes les lignes d'une table | Le parcours explicite, comme un solde jusqu'à une date |

`REMOVEFILTERS ( Magasins )` retire **toutes** les colonnes de `Magasins` : le magasin de la ligne du visuel, mais aussi la région si elle est sur cette table. `REMOVEFILTERS ( Magasins[Magasin] )` ne retire que cette colonne. Un filtre sur `Magasins[Région]` resterait.

`ALL ( Ventes )` ne veut pas dire « le total de l'enseigne ». Il retire les filtres posés **sur les colonnes du fait**. Le slicer de famille, lui, est posé sur `Produits`. Il continue de descendre vers les ventes par la relation. Pour ignorer la famille, il faut retirer le filtre de `Produits`, pas seulement celui de `Ventes`.

`FILTER` sur le fait tout entier, `FILTER ( Ventes, Ventes[Montant HT] > 100 )`, parcourt des millions de lignes. On le réserve aux conditions qu'un prédicat de colonne ne sait pas dire. Pour « les magasins au-dessus de 50 000 », on parcourt `Magasins`, qui a une ligne par magasin, pas `Ventes`.

```diagram
type: decision
title: Quel argument de CALCULATE ?
nodes:
  - question: La condition est-elle une valeur de colonne, comme la famille Boissons ?
    yes: Prédicat direct dans CALCULATE, sans FILTER
    no: Question suivante
  - question: Faut-il seulement enlever un filtre déjà posé, pour un dénominateur ?
    yes: REMOVEFILTERS sur la table ou la colonne concernée
    no: FILTER sur la dimension, avec une mesure dans la condition
```

# Le pourcentage qui affiche 100 %

La part d'un magasin est une division. Le numérateur est le CA du magasin. Le dénominateur est le CA **sans** le filtre de magasin, mais **avec** les autres filtres que l'on veut garder (la famille, l'année). Si le dénominateur garde le magasin, on divise Lyon par Lyon.

```dax
Part fausse = DIVIDE ( [CA], [CA] )
```

```dax
Part encore fausse =
DIVIDE (
    [CA],
    CALCULATE ( [CA] )
)
```

`CALCULATE ( [CA] )` sans modificateur ne retire rien. Sur Lyon, 40 000 / 40 000 = **100 %**. Sur Paris, 100 %. Sur le total, 100 %. Le visuel a l'air cohérent, et il ne dit rien.

```dax
Part du magasin =
DIVIDE (
    [CA],
    CALCULATE ( [CA], REMOVEFILTERS ( Magasins ) )
)
```

Sans slicer de famille : Lyon 40 000 / 120 000 = **33,3 %**, Paris 50 %, Lille 16,7 %. Le total fait 100 %, cette fois parce que le numérateur et le dénominateur y sont égaux, ce qui est le bon comportement d'une part.

`REMOVEFILTERS ( Magasins[Région] )` seul, dans un visuel dont l'axe est le **magasin**, ne suffit pas. Le filtre de la ligne est sur `Magasins[Magasin]`. Il reste. On retombe à 100 %. On retire la table entière, ou au minimum la colonne qui porte l'axe.

# Un mois, trois magasins, les chiffres

Le slicer Famille = Boissons est actif. Le visuel est par magasin. Une région peut en plus écarter Lille : on ne garde qu'Auvergne-Rhône-Alpes et Île-de-France, donc Lyon et Paris.

| Mesure | Lyon | Ce que le dénominateur contient | Part de Lyon |
|---|---|---|---|
| `[CA]` | 8 000 | Le numérateur, pas une part |  |
| `Part fausse` | 8 000 / 8 000 | Le magasin est resté | 100 % |
| `Part du magasin` | 8 000 / 30 000 | Boissons, tous magasins, Lille inclus | 26,7 % |
| Part de la sélection | 8 000 / 26 000 | Boissons des régions encore slicées | 30,8 % |
| Part de l'enseigne | 8 000 / 120 000 | Tous magasins et toutes familles | 6,7 % |

Les trois dernières sont justes. Elles ne répondent pas à la même question. Le nom de la mesure doit dire **quel filtre a été retiré**.

```dax
Part du magasin =
DIVIDE (
    [CA],
    CALCULATE ( [CA], REMOVEFILTERS ( Magasins ) )
)
```

Cette version retire aussi le slicer de région, puisque la région est une colonne de `Magasins`. Le dénominateur revient à 30 000, les boissons de Lille inclus. C'est la part parmi **toutes** les boissons.

```dax
Part de la sélection =
DIVIDE (
    [CA],
    CALCULATE ( [CA], ALLSELECTED ( Magasins ) )
)
```

`ALLSELECTED` retire le filtre de la **ligne du visuel** et conserve les slicers extérieurs. Lille, écarté par la région, ne rentre pas. Le dénominateur vaut 26 000. Lyon pèse 30,8 % de ce que l'utilisateur a choisi de voir.

```dax
Part de l'enseigne =
DIVIDE (
    [CA],
    CALCULATE (
        [CA],
        REMOVEFILTERS ( Magasins ),
        REMOVEFILTERS ( Produits )
    )
)
```

Là, la famille saute aussi. 8 000 / 120 000 = 6,7 %. C'est la contribution de « Lyon, boissons » au CA de l'enseigne, pas la part de Lyon dans les boissons.

```diagram
type: compare
title: Trois dénominateurs pour les 8 000 € de Lyon en boissons
columns:
  - title: 100 %
    tone: rose
    items:
      - Le magasin filtre encore le dénominateur
      - 8 000 divisés par 8 000
  - title: 26,7 %
    tone: teal
    items:
      - REMOVEFILTERS sur Magasins
      - Famille Boissons conservée
      - 8 000 divisés par 30 000
  - title: 6,7 %
    tone: amber
    items:
      - Magasins et Produits retirés
      - 8 000 divisés par 120 000
      - Part dans l'enseigne entière
```

Avant de publier une part, on lit le dénominateur à voix haute avec un magasin et un slicer. Si la phrase hésite (« tous les magasins, mais seulement les boissons, ou bien toute l'enseigne ? »), il faut deux mesures, pas un `ALL` plus large « pour être sûr ».

# Exercices

## Exercice 1 : Le SUM dans le parcours

`Ventes` a deux lignes, 3,20 € et 2,10 €. On vous propose `SUMX ( Ventes, SUM ( Ventes[Montant HT] ) )`.

Que vaut cette mesure, pourquoi, et quelle formule renvoie 5,30 ?

<details>
<summary>Voir la solution</summary>

Elle vaut **10,60 €**. `SUMX` visite deux lignes. À chaque visite, `SUM` ignore la ligne en cours et renvoie le total 5,30. Deux fois 5,30 font 10,60.

Pour 5,30, soit `SUM ( Ventes[Montant HT] )` directement, soit `SUMX ( Ventes, Ventes[Montant HT] )` qui lit la colonne dans le contexte de ligne. On ne republie pas les deux.

</details>

## Exercice 2 : Qui dépasse 50 000 €

Lyon 40 000 €, Paris 60 000 €, Lille 20 000 €. Écrivez la mesure qui renvoie le CA des magasins au-dessus de 50 000 €. Dites ce que renvoie la variante qui met `SUM ( Ventes[Montant HT] ) > 50000` dans le `FILTER`.

<details>
<summary>Voir la solution</summary>

```dax
CA gros magasins =
CALCULATE (
    [CA],
    FILTER ( Magasins, [CA] > 50000 )
)
```

Résultat : **60 000 €**, Paris seul. La mesure `[CA]` est évaluée magasin par magasin grâce à la transition de contexte.

La variante avec `SUM` compare 120 000 à 50 000 pour chaque magasin. Les trois passent. La mesure renvoie **120 000 €**. Elle n'a exclu personne.

</details>

## Exercice 3 : Choisir le dénominateur

Slicer Boissons. Visuel par magasin. Lyon affiche 8 000 €. Les boissons de tous les magasins valent 30 000 €. L'enseigne entière vaut 120 000 €. Un second slicer de région a écarté Lille : Lyon + Paris en boissons valent 26 000 €.

Quelle formule donne 26,7 %, laquelle donne 30,8 %, et pourquoi `DIVIDE ( [CA], [CA] )` donne 100 % ?

<details>
<summary>Voir la solution</summary>

100 % : `DIVIDE ( [CA], [CA] )`. Le dénominateur garde le filtre Lyon. 8 000 / 8 000.

26,7 % : `REMOVEFILTERS ( Magasins )` dans le `CALCULATE` du dénominateur. La famille reste, la région saute avec la table magasin, Lille revient. 8 000 / 30 000.

30,8 % : `ALLSELECTED ( Magasins )`. Le filtre de la ligne Lyon est retiré, le slicer de région reste, Lille non. 8 000 / 26 000.

La part dans l'enseigne, 8 000 / 120 000 = 6,7 %, demanderait en plus `REMOVEFILTERS ( Produits )`. Ce n'est pas celle qu'on obtient avec `ALL ( Ventes )` seul : le slicer de famille est sur `Produits`, pas sur le fait.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Contexte de filtre et CALCULATE
center: "Une part retire le bon filtre au dénominateur. Sinon Lyon divisé par Lyon affiche 100 %."
points:
  - icon: list
    title: Contexte de ligne
    text: On lit la colonne de la ligne. Un SUM dans ce parcours répète le total et le double.
  - icon: filter
    title: Contexte de filtre
    text: Slicers et axes restreignent la mesure. Lyon en boissons vaut 8 000, pas 40 000.
  - icon: zap
    title: CALCULATE
    text: Il change les filtres. Dans FILTER, la condition doit appeler une mesure, pas un SUM nu.
  - icon: scale
    title: Le dénominateur
    text: REMOVEFILTERS sur Magasins garde la famille. 8 000 sur 30 000 font 26,7 %.
  - icon: alert
    title: ALL du fait
    text: ALL sur Ventes ne retire pas le slicer Famille, qui vit sur Produits.
pitfall: "Publier DIVIDE de CA par CA, ou un CALCULATE sans retrait de filtre, et livrer un visuel à 100 %."
remember: On nomme la part d'après les filtres qu'elle retire. 26,7 %, 30,8 % et 6,7 % sont trois questions.
```
