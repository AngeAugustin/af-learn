---
title: Relations, cardinalités et filtres
description: Lire une relation un-à-plusieurs, éviter le plusieurs-à-plusieurs au centre du modèle, et tenir les filtres bidirectionnels.
duration: 62
objectives:
  - Faire circuler un filtre du côté un vers le côté plusieurs
  - Reconnaître un plusieurs-à-plusieurs qui double les montants
  - Expliquer pourquoi une relation bidirectionnelle change les chiffres
  - Relier les tables par des clés uniques, de même type
---

# La relation un-à-plusieurs

Dans une étoile, la relation utile est **un-à-plusieurs**, notée 1-N. Le côté **un** est la dimension : une ligne par magasin, par produit, par client ou par jour. Le côté **plusieurs** est le fait : beaucoup de lignes de vente portent la même clé magasin.

`Magasins` est du côté un. `Ventes` est du côté plusieurs. La clé `Magasin Key` est unique dans `Magasins`. Elle se répète dans `Ventes`, une fois par ligne de ticket de ce magasin. La relation se trace entre ces deux colonnes, pas entre les noms.

| Côté | Table | Contrainte | Exemple |
|---|---|---|---|
| Un | `Magasins` | `Magasin Key` unique, sans doublon | 12, Lyon Part-Dieu |
| Plusieurs | `Ventes` | `Magasin Key` répété | 12 sur chaque ligne de ce magasin |

Cette cardinalité dit une chose métier : **une ligne de vente a un seul magasin**. Si une ligne avait vraiment plusieurs magasins, le grain serait faux, ou il manquerait une table de pont. On ne « passe la relation en plusieurs-à-plusieurs » pour faire disparaître le problème.

> [!IMPORTANT]
> Le côté un doit être unique. Deux lignes de `Magasins` avec la clé 12, ou deux « Lyon » utilisés comme clé, cassent la relation. L'outil la refuse, ou la transforme en plusieurs-à-plusieurs.

# Comment les filtres se propagent

Par défaut, le filtre voyage **du côté un vers le côté plusieurs**. Il ne remonte pas. Un slicer est une restriction sur une dimension. Cette restriction se propage au fait le long de la relation. Le fait ne renvoie pas, tout seul, un filtre vers les autres dimensions.

Exemple. `Magasins` filtre `Ventes`. Vous choisissez Lyon Part-Dieu.

| Magasin | Montant HT |
|---|---|
| Lyon Part-Dieu | 40 000 |
| Paris Opéra | 60 000 |
| Lille Centre | 20 000 |

Le slicer ne laisse que les lignes de vente dont la clé magasin est celle de Lyon. Le chiffre d'affaires affiché est 40 000 €. Paris et Lille ne sont pas devenues invisibles dans la dimension parce que le fait l'aurait « remonté » : elles disparaissent du visuel seulement si le visuel est groupé par magasin et qu'il n'y a plus de ventes pour elles, ou si un autre mécanisme filtre la dimension.

Deux filtres de deux dimensions se combinent par **intersection**. Famille Boissons **et** magasin Lyon : une ligne de vente doit satisfaire les deux chemins. L'ordre dans lequel l'utilisateur clique n'a pas d'importance. Il n'y a pas de « filtre prioritaire » caché.

```diagram
type: sequence
title: Deux slicers restreignent le fait
actors: [Slicers, Dimensions, Ventes]
messages:
  - from: 0
    to: 1
    text: Famille Boissons et magasin Lyon
  - from: 1
    to: 2
    text: Le filtre descend vers les lignes de vente
  - from: 2
    to: 2
    text: Somme du montant HT des lignes restantes
```

Le symptôme d'un filtre qui ne descend pas : le slicer change de valeur, le visuel ne change pas. Presque toujours, la relation manque, elle est inactive, ou elle est posée sur des colonnes qui ne contiennent pas les mêmes valeurs (texte `12` d'un côté, nombre `12` de l'autre).

# Le plusieurs-à-plusieurs à éviter

Une relation **plusieurs-à-plusieurs** (N-N) dit qu'une ligne d'un côté correspond à plusieurs lignes de l'autre, et inversement. Au centre d'un modèle de ventes, c'est presque toujours le signe que le grain n'a pas été décidé.

Le cas réel n'est pas « un client et un produit ». Une ligne de ticket a un produit. Le cas réel est : **un produit classé dans plusieurs familles en même temps**, ou une promotion qui couvre plusieurs produits. Là, une famille n'est plus un attribut unique de `Produits`. Il faut une table de pont, par exemple `Classements`, avec une ligne par couple produit et famille.

Le danger n'est pas la table de pont. Le danger est de **sommer le fait une fois par chemin**.

Le panier garni a 100 € de ventes. Le merchandising le range à la fois dans Épicerie et dans Cadeaux. Chaque famille affiche 100 €, ce qui est défendable (les ventes du produit sont bien dans chaque rayon où il est exposé). La somme des deux familles affiche 200 €. Le total général, sans filtre de famille, affiche 100 €, parce que la ligne de vente n'existe qu'une fois. Le rapport a l'air faux : **la somme des lignes n'est pas le total**.

```diagram
type: compare
title: Ce que le visuel montre pour 100 € classés deux fois
columns:
  - title: Lignes du visuel
    tone: amber
    items:
      - Épicerie affiche 100 €
      - Cadeaux affiche 100 €
      - L'œil additionne 200 €
  - title: Total du visuel
    tone: teal
    items:
      - Aucun filtre de famille
      - La ligne de vente compte une fois
      - Le total reste 100 €
```

Trois règles tiennent ce cas.

1. Ne créez pas de N-N entre `Ventes` et `Clients` ou entre `Ventes` et `Produits` si le grain dit qu'une ligne n'a qu'un client et qu'un produit. Une clé manquante se répare dans les données, pas avec une cardinalité plus lâche.
2. Si le N-N est réel (classement multiple, promotion), isolez-le dans un pont et **écrivez la règle de restitution** : les lignes peuvent se recouper, le total ne les additionne pas.
3. N'allouez pas le montant en cachette (50 € dans chaque famille) sans que le contrôle de gestion ait choisi la règle. Une répartition inventée dans le modèle est un chiffre que personne ne sait refaire.

> [!WARNING]
> Somme des lignes différente du total : ou bien un N-N fait voir la même vente dans plusieurs membres, ou bien des lignes du fait n'ont pas de parent dans la dimension. Les deux se réparent différemment. Il faut d'abord savoir lequel des deux vous avez.

```video
url: https://www.youtube.com/watch?v=-0GctLQhcjY
title: "Power BI Relationships Explained (Cardinality, Filter Direction) | #Power BI Course 17"
channel: "Data with Baraa"
duration: "11:10"
lang: en
why: "Data with Baraa explique les relations Power BI : cardinalité, direction du filtre et propagation."
```

# Les relations bidirectionnelles

Une relation **bidirectionnelle** laisse le filtre descendre et **remonter**. Elle est parfois proposée « pour que le slicer se croise ». Elle change les chiffres, pas seulement les listes déroulantes.

Le modèle sain : `Produits` filtre `Ventes`, `Clients` filtre `Ventes`, les deux en sens unique. Vous filtrez la famille Boissons.

- Client A a acheté 10 € de boissons et 30 € de pain.
- Client B a acheté 20 € de boissons.
- Le chiffre d'affaires boissons est **30 €**.

Si la relation `Clients` vers `Ventes` est bidirectionnelle, le filtre boissons remonte aux clients A et B, puis **redescend vers toutes leurs ventes**. Le pain du client A revient dans le calcul. La carte « Boissons » affiche 60 €. Le libellé est resté Boissons. Le montant est celui des clients qui ont acheté des boissons, tous rayons confondus.

```diagram
type: decision
title: Autoriser un filtre qui remonte ?
nodes:
  - question: Une mesure sur le fait, déjà filtré, suffit-elle à compter ou à sommer ?
    yes: Sens unique. On agrège la clé portée par le fait.
    no: Question suivante
  - question: Le besoin est-il un pont plusieurs-à-plusieurs assumé, avec un total expliqué ?
    yes: Bidirectionnel limité au pont, puis contrôle somme des lignes contre total
    no: On garde le sens unique et on reformule la question métier
```

Le bon réflexe, dans l'exemple des boissons, n'est pas d'ouvrir la relation. Les lignes de `Ventes` sont déjà restreintes à la famille. Le nombre de clients qui ont acheté ces lignes se lit **sur le fait** :

```dax
Clients acheteurs = DISTINCTCOUNT ( Ventes[Client Key] )
```

La relation bidirectionnelle permanente est réservée au pont que vous avez décidé d'assumer, et encore : beaucoup de modèles la remplacent, dans une seule mesure, par `CROSSFILTER`, qui ouvre le double sens le temps du calcul puis le referme.

```dax
Clients de la promo =
CALCULATE (
    DISTINCTCOUNT ( Ventes[Client Key] ),
    CROSSFILTER ( Classements[Produit Key], Produits[Produit Key], BOTH )
)
```

`CROSSFILTER` prend les deux colonnes de la relation et un sens (`BOTH`, `ONEWAY` ou `NONE`). Le reste du modèle ne change pas de comportement. Un double sens posé sur la relation, lui, s'applique à **toutes** les mesures, y compris celles que personne n'a relu.

Deux chemins bidirectionnels entre les mêmes tables rendent le modèle **ambigu** : l'outil ne sait plus par où faire passer le filtre, ou il en combine les effets. Date de commande et date de livraison sont deux rôles, pas deux sens ouverts en même temps.

# Les clés de la relation

Une relation tient sur **une colonne de chaque côté**, de **même type**, avec des **valeurs qui se correspondent**. Le côté un est unique. Le côté plusieurs a le droit de répéter.

| Contrôle | Bon | Casse le chiffre |
|---|---|---|
| Colonne | `Magasin Key` numérique | Le nom du magasin, qui peut se répéter ou être renommé |
| Type | Nombre entier des deux côtés | Texte `"12"` d'un côté, entier `12` de l'autre |
| Unicité | Une ligne de dimension par clé | Deux lignes « Lyon Part-Dieu » avec la clé 12 |
| Orphelins | Toute clé du fait existe dans la dimension | La clé 99 est dans `Ventes` et absente de `Magasins` |

Les orphelins produisent exactement le symptôme « la somme des magasins n'est pas le total ». Les ventes de la clé 99 entrent dans le total, car aucun slicer ne les a retirées. Elles n'entrent dans aucune ligne de magasin, car aucun magasin ne porte cette clé. Total 120 000 €, somme des magasins visibles 115 000 €. L'écart de 5 000 € n'est pas une mesure DAX : c'est une clé sans parent.

La réparation est côté données. On charge un membre **Magasin inconnu** dans la dimension, et on y rattache les clés orphelines. On ne masque pas l'écart avec un filtre. Le membre inconnu doit rester visible le temps de corriger la source, sinon les 5 000 € disparaissent du radar.

On ne relie pas sur le libellé. Deux magasins peuvent s'appeler Lyon le jour où l'enseigne ouvre Confluence à côté de Part-Dieu. Un libellé se corrige, une clé technique non. La relation suit la clé. Le rapport affiche le libellé.

# Vérifier le modèle avant de calculer

Avant d'écrire une mesure, on relit le modèle comme on relit une jointure. Cinq questions suffisent. Si l'une d'elles coince, le DAX ne fera que propager l'erreur plus vite.

1. Chaque relation du rapport est-elle 1-N, de la dimension vers le fait, en sens unique ?
2. Le côté un est-il vraiment unique, et du même type que la clé du fait ?
3. Un filtre de famille ne remonte-t-il pas vers les clients pour redescendre sur d'autres familles ?
4. Y a-t-il un pont N-N ? Si oui, la somme des lignes a-t-elle le droit de dépasser le total, et est-ce écrit quelque part ?
5. Les clés du fait sans parent sont-elles rattachées à un membre inconnu, visible ?

```diagram
type: flow
title: Contrôle d'une relation avant la première mesure
steps:
  - title: Cardinalité
    text: 1-N, dimension vers fait, sauf pont assumé.
    tone: violet
  - title: Sens
    text: Le filtre descend. Il ne remonte que si une mesure l'ouvre.
    tone: blue
  - title: Clés
    text: Même type, côté un unique, orphelins rattachés.
    tone: teal
  - title: Totaux
    text: Somme des lignes et total racontent la même histoire.
    tone: rose
```

Le modèle est prêt pour les mesures quand un collègue peut poser le doigt sur Lyon, puis sur Boissons, et prédire quelles lignes de `Ventes` restent. S'il ne peut pas le prédire, une relation bidirectionnelle ou un pont est encore trop flou pour être publié.

# Exercices

## Exercice 1 : Prédire le filtre

`Magasins` (côté un) filtre `Ventes` en sens unique. Les montants HT sont Lyon 40 000 €, Paris 60 000 €, Lille 20 000 €. Un slicer de magasin vaut Lyon. Un second slicer, sur `Produits`, vaut Boissons, et les boissons de Lyon valent 8 000 €.

Quel chiffre d'affaires reste, et quelles lignes de vente ont été écartées ?

<details>
<summary>Voir la solution</summary>

Il reste **8 000 €**.

Le filtre magasin ne garde que Lyon (40 000 €). Le filtre famille, qui descend aussi vers `Ventes` en sens unique, ne garde parmi ces lignes que les boissons. L'intersection vaut 8 000 €.

Ont été écartées : toutes les ventes de Paris et de Lille, et les ventes de Lyon qui ne sont pas des boissons (32 000 €). Aucun des deux filtres n'a besoin de remonter vers l'autre dimension.

</details>

## Exercice 2 : Le pain revenu dans les boissons

Client A : 10 € de boissons et 30 € de pain. Client B : 20 € de boissons. La relation entre `Clients` et `Ventes` est passée en bidirectionnel « pour croiser les slicers ». Le rapport filtre la famille Boissons.

Quel montant la carte va-t-elle montrer, pourquoi, et quelle mesure donne le vrai chiffre d'affaires boissons sans ouvrir la relation ?

<details>
<summary>Voir la solution</summary>

La carte montre **60 €**, pas 30 €. Le filtre Boissons descend vers `Ventes`, remonte vers les clients A et B, puis redescend vers toutes leurs lignes. Le pain de A est inclus.

On remet la relation en sens unique. Le chiffre d'affaires boissons est la somme du montant HT : les lignes sont déjà filtrées par la famille, le résultat est 30 €. Le nombre de clients de ces lignes, si on le demande, est `DISTINCTCOUNT ( Ventes[Client Key] )`, soit 2, sans faire remonter le filtre.

</details>

## Exercice 3 : Somme des lignes contre total

Un visuel par famille affiche Épicerie 100 € et Cadeaux 100 €. Le total affiché est 100 €. Un autre visuel, par magasin, affiche des magasins qui somment à 115 000 € alors que la carte sans dimension affiche 120 000 €.

Donnez une cause crédible pour chaque écart, et la première vérification.

<details>
<summary>Voir la solution</summary>

Familles 100 + 100 avec un total de 100 : la même vente (le panier garni) est rattachée à deux familles. C'est un plusieurs-à-plusieurs. Vérification : la table de pont `Classements`, et la règle affichée au métier (les lignes se recouvrent, on ne les additionne pas).

Magasins qui somment à 115 000 € pour un total de 120 000 € : 5 000 € de ventes ont une clé magasin absente de `Magasins`. Vérification : les clés de `Ventes` qui ne joignent pas, puis un membre « Magasin inconnu » pour les rendre visibles. Ce n'est pas le même défaut que le pont des familles.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Relations, cardinalités et filtres
center: Le filtre descend du 1 vers le N. Un double sens ou un pont N-N change le total, et se décide explicitement.
points:
  - icon: link
    title: Relation 1-N
    text: Une vente a un magasin. La clé est unique côté dimension et répétée côté fait.
  - icon: filter
    title: Sens du filtre
    text: Famille et magasin restreignent les ventes par intersection. Le fait ne remonte pas tout seul.
  - icon: scale
    title: Pont N-N
    text: Un produit dans deux familles montre deux fois 100 €. Le total, lui, reste 100 €.
  - icon: alert
    title: Bidirectionnel
    text: Filtrer les boissons peut ramener le pain des mêmes clients si le filtre remonte.
  - icon: key
    title: Clés propres
    text: Même type, côté un unique. Une clé orpheline entre dans le total et dans aucun magasin.
pitfall: Ouvrir une relation dans les deux sens pour croiser des slicers, puis publier un chiffre d'affaires trop large.
remember: Tant que la somme des lignes et le total ne racontent pas la même histoire, on ne corrige pas avec une mesure.
```
