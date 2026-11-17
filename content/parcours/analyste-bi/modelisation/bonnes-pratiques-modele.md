---
title: Bonnes pratiques du modèle sémantique
description: Tenir une table de dates unique, des noms métier, des clés masquées, et un modèle qu'un collègue peut réexpliquer.
duration: 58
objectives:
  - Relier tous les faits à une seule table de dates marquée
  - Écarter les colonnes calculées qui cachent une règle métier
  - Nommer tables, colonnes et mesures avec les mots du métier
  - Masquer les clés et garder un modèle que l'on peut redessiner
---

# Une seule table de dates

Le temps est une dimension comme les autres, avec une contrainte de plus : les calculs de cumul, de mois précédent et d'année précédente ont besoin d'un **calendrier continu**. Une seule table `Date`, une ligne par jour, sans trou, du premier jour utile (la plus ancienne vente, ou le premier budget) jusqu'à un horizon futur raisonnable.

| Colonne | Exemple du 12 mars 2025 | Usage dans le rapport |
|---|---|---|
| Date | 2025-03-12 | Relation vers les faits, et calculs de temps |
| Année | 2025 | Axe et filtre |
| Trimestre | T1 | Axe |
| Mois | mars | Axe, trié par le numéro de mois |
| Numéro de mois | 3 | Colonne de tri, masquée |
| Année-mois | 2025-03 | Axe chronologique qui ne mélange pas les mars |
| Semaine ISO | 2025-S11 | Axe semaine, avec l'année |
| Jour ouvré | Oui | Filtre retail |

Tous les faits qui parlent de la même journée pointent vers **cette** table. `Ventes`, `StockJour`, `Objectifs`, `Ecritures`. Mars 2025 est alors le même mars partout. Un objectif mensuel et les ventes du mois se comparent parce qu'ils partagent le calendrier, pas parce qu'un calcul a « deviné » les dates.

La date posée seulement sur le fait, sans dimension, ne suffit pas. Elle n'a pas de mois, pas de semaine, pas d'exercice. Chaque visuel réinvente son regroupement. Pire : l'option qui fabrique **une hiérarchie de dates cachée par colonne de date** (la date automatique de Power BI, par exemple) crée autant de calendriers qu'il y a de colonnes. Ces calendriers ne sont pas marqués comme la table du modèle, ils ne se partagent pas entre les faits, et un cumul peut s'appuyer sur le mauvais.

> [!IMPORTANT]
> Une table de dates, marquée comme telle, reliée aux faits. Les hiérarchies de dates automatiques se désactivent. Le mois affiché est une colonne de `Date`, triée par le numéro de mois, sinon avril arrive avant janvier.

Le marquage désigne la colonne `Date` de type date. C'est elle que les fonctions de temps décaleront. Un entier `20250312` peut servir de clé de jointure technique, mais il ne remplace pas la colonne de type date dans ces fonctions. Le plus lisible est encore de relier les faits directement sur la colonne date, quand la source le permet.

# Plusieurs dates sur un même fait

Une vente a souvent **deux dates** : le jour du ticket et le jour de livraison. Ce ne sont pas deux calendriers. C'est le même calendrier, joué dans deux **rôles**.

On ne charge pas un second référentiel de dates avec d'autres règles de semaine. On crée une relation **active** pour la date du ticket, celle qui sert par défaut, et une relation **inactive** pour la date de livraison. Les deux aboutissent à la même table `Date`. Une seule des deux est active, sinon le chemin est ambigu.

```dax
CA livré =
CALCULATE (
    [CA],
    USERELATIONSHIP ( Ventes[Date livraison], 'Date'[Date] )
)
```

`USERELATIONSHIP` active la relation inactive le temps de la mesure. `[CA]` reste la définition du chiffre d'affaires. Seul le calendrier qui la filtre change. Le rapport peut montrer, sur le même axe de mois, le CA encaissé et le CA livré, sans dupliquer la table des jours.

```diagram
type: flow
title: Deux rôles pour un seul calendrier
steps:
  - title: Table Date
    text: Un jour, un mois, une semaine, les mêmes pour toute l'enseigne.
    tone: violet
  - title: Relation active
    text: La date du ticket filtre les ventes par défaut.
    tone: teal
  - title: Relation inactive
    text: La date de livraison attend qu'une mesure l'active.
    tone: amber
  - title: Mesure nommée
    text: CA livré dit explicitement quel rôle de date elle utilise.
    tone: rose
```

Si les deux rôles doivent apparaître **en même temps** dans un même visuel, comme des colonnes côte à côte qui ne partagent pas le filtre, on publie une copie affichée `Date de livraison`, alimentée par le même calendrier. Ce n'est pas un deuxième référentiel métier. C'est un rôle que l'outil ne sait pas tenir avec une seule table dans ce visuel. On le nomme comme un rôle, et on ne le laisse pas diverger (pas de semaine « livraison » calculée autrement).

# Éviter les colonnes calculées cachées

Une **colonne calculée** est une valeur stockée, figée au dernier rafraîchissement, calculée ligne à ligne. Une **mesure** est recalculée quand l'utilisateur filtre. Les deux ont une place. La colonne calculée devient un problème quand elle **cache une règle** que le métier croit vivante.

Exemple. Quelqu'un ajoute sur `Clients` une colonne `Segment calculé`, puis la masque. La formule classe le client selon son chiffre d'affaires **au moment du rafraîchissement**, tous mois confondus. Le rapport de mars parle de « segment ». Le lecteur croit au segment de mars. Il voit le segment de tout l'historique, arrêté à 6 h du matin. Aucune légende ne le dit, puisque la colonne est cachée.

| Besoin | Où le poser | Pourquoi |
|---|---|---|
| Famille, région, segment au sens du référentiel | Colonne de dimension, chargée avec les données | C'est un attribut, pas un calcul de rapport |
| Tranche de prix catalogue | Colonne, si elle ne dépend pas des filtres du rapport | Elle sert de slicer. On la laisse **visible**, avec son nom |
| Chiffre d'affaires, taux, écart N-1 | Mesure | Doit suivre les filtres de mois, de magasin, de famille |
| Règle que seul l'auteur retrouve | Nulle part sous cette forme | On la nomme, on la documente, ou on ne la publie pas |

La colonne cachée a un second défaut : elle **pèse** dans le modèle alors que le rapport ne la montre pas. Une règle de gestion recopiée en DAX dans une colonne, alors que la vue source pourrait porter un libellé propre, se duplique au prochain projet. Le bon endroit d'un attribut stable est la chaîne de préparation, avec un nom affiché. Le bon endroit d'un indicateur est une mesure.

> [!WARNING]
> Si la formule répond à « combien, dans le filtre en cours », c'est une mesure. Une colonne qui le fait quand même ment sur la période, parce qu'elle a été photographiée au rafraîchissement.

On garde une colonne calculée dans le modèle seulement quand elle doit servir de **filtre ou d'axe**, qu'elle ne dépend pas du contexte du rapport, et qu'on ne peut pas la préparer en amont. On ne la masque pas. Un slicer invisible n'est pas un slicer.

# Des noms de métier

L'utilisateur du rapport ne connaît pas `F_SALES`, `AMT_HT` ni `dim_store_v2`. Il connaît le chiffre d'affaires HT, le magasin, la famille. Le modèle sémantique est la couche où ces mots deviennent les vrais noms, pas des synonymes posés dans un coin.

| On publie | On ne publie pas | Raison |
|---|---|---|
| `Ventes` | `fVentes`, `Sheet1` | La table est un sujet, pas un préfixe technique |
| `Produits` | `dim_product_v2` | Pas de version dans le nom affiché |
| Montant HT | `AMT_HT` | Le format et le nom disent l'unité |
| Chiffre d'affaires HT | `SUM_AMT` | La mesure dit ce qu'elle est, pas la fonction utilisée |
| Date de livraison | `Date2` | Le rôle est explicite |

Quelques conventions tiennent dans la durée.

- Une mesure ne s'appelle pas comme une colonne. `Montant HT` est la colonne source. `Chiffre d'affaires HT` est la mesure. On ne somme pas « au hasard » la colonne dans un visuel.
- Le nom dit le périmètre quand il n'est pas évident : `CA HT hors magasins test`, `Stock de fin de période`, `CA livré`.
- Les dossiers d'affichage rangent les mesures : Ventes, Marge, Stock, Temps. Ils ne remplacent pas un bon nom.
- Pas d'abréviation locale. « CA » est compris dans cette enseigne. « MB » pour marge brute ne l'est pas par le magasin.

```diagram
type: layers
title: Du nom technique au nom publié
layers:
  - title: Mesures
    text: Chiffre d'affaires HT, taux de marge, panier moyen
  - title: Colonnes visibles
    text: Famille, magasin, mois, segment
  - title: Tables
    text: Ventes, Produits, Magasins, Clients, Date
  - title: Masqué
    text: Clés, colonnes de tri, clés étrangères
```

Le test est oral. Si la personne qui tient le magasin de Lyon ne peut pas lire le nom dans un slicer et savoir ce qu'elle filtre, le nom n'est pas fini.

# Masquer les clés techniques

La clé sert à la relation. Elle ne sert pas au slicer. Une fois la relation en place, on **masque** les clés techniques et les clés étrangères. L'utilisateur voit « Lyon Part-Dieu », pas `12`.

On masque aussi :

- les colonnes de tri (`Numéro de mois`) une fois le tri du mois branché dessus ;
- les clés de version SCD (`Client Key` 12 et 48), en laissant visibles le code client et le segment ;
- les colonnes intermédiaires de préparation qui n'ont pas de sens métier ;
- la colonne brute quand une mesure publiée la remplace, pour qu'on ne la somme pas à la place de la mesure.

On ne masque pas un attribut sous prétexte qu'il est « technique pour nous ». La région, la famille, le numéro de ticket, le segment sont des outils de filtre. Les cacher force les utilisateurs à demander une extraction.

Masquer n'est pas supprimer. Les relations et les tris continuent d'utiliser les colonnes cachées. Un collègue analyste peut les réafficher dans le modèle. Un lecteur de rapport, non. C'est le bon partage : le moteur voit la clé, la revue de gestion voit le libellé.

> [!TIP]
> Après avoir masqué les clés, ouvrez la liste des champs comme le fera le métier. S'il reste une colonne que vous ne savez pas expliquer en une phrase, elle n'est pas encore au bon endroit.

# Un modèle que l'on peut expliquer

Un modèle publiable tient sur une page et dans une phrase de grain. « `Ventes` est au grain ligne de ticket. `Date`, `Produits`, `Magasins` et `Clients` l'entourent en sens unique. `StockJour` partage `Date`, `Produits` et `Magasins`. Le segment client est en type 2. »

S'il faut plus qu'une page, quelque chose n'est pas encore une étoile : un flocon oublié, une relation bidirectionnelle « provisoire », une colonne calculée qui porte la marge, deux calendriers qui divergent. On simplifie **avant** d'ajouter des mesures. Le DAX ne rend pas un modèle opaque plus sûr. Il le rend plus difficile à contredire.

La checklist de publication tient en six questions.

1. Peut-on redessiner l'étoile et dire le grain de chaque fait ?
2. Y a-t-il une seule table de dates marquée, et des rôles nommés s'il y a plusieurs dates ?
3. Chaque nom visible est-il un mot du métier, sans préfixe de chargement ?
4. Les clés sont-elles masquées, les attributs utiles visibles ?
5. Les règles qui dépendent des filtres sont-elles des mesures, pas des colonnes cachées ?
6. Un deuxième analyste peut-il retrouver la définition du chiffre d'affaires sans ouvrir un échange privé ?

```diagram
type: decision
title: Cette colonne a-t-elle le droit d'être dans le modèle publié ?
nodes:
  - question: Sert-elle à filtrer, à grouper ou à calculer un indicateur ?
    yes: Question suivante
    no: On ne la publie pas
  - question: Est-ce une clé, un tri, ou une règle figée que le métier ne doit pas voir ?
    yes: On la garde pour le moteur et on la masque
    no: On la nomme avec les mots du métier et on la laisse visible
```

Le modèle reste expliquable tant que n'importe quel chiffre du rapport se retrace en trois gestes : le filtre de la dimension, le grain du fait, la mesure nommée. Le jour où le geste devient « ça dépend d'une colonne cachée », le modèle a cessé d'être un outil de pilotage.

# Exercices

## Exercice 1 : Un calendrier ou trois

Le fichier source a `Date ticket` et `Date livraison` sur `Ventes`, plus `Mois` déjà écrit en texte sur `Objectifs`. Un collègue active la hiérarchie de dates automatique sur les trois colonnes.

Que publiez-vous à la place, et comment le CA livré est-il filtré ?

<details>
<summary>Voir la solution</summary>

On publie **une** table `Date`, continue, marquée, avec année, trimestre, mois (trié), semaine et jour ouvré. On désactive les hiérarchies automatiques.

`Ventes[Date ticket]` et le mois des objectifs (converti en vraie date, pas laissé en texte) utilisent la relation active vers `Date`. `Ventes[Date livraison]` est une relation inactive vers la même table.

Le CA livré est la mesure de CA enveloppée dans `CALCULATE` et `USERELATIONSHIP` sur la date de livraison. Le mois du visuel reste celui de `Date`. On ne crée pas un calendrier « livraison » avec d'autres règles.

</details>

## Exercice 2 : Colonne cachée ou mesure

On trouve dans le modèle une colonne masquée `Clients[Segment calculé]`. Sa formule somme le montant HT du client et écrit Gold au-dessus de 500 €. Le rapport mensuel filtre mars.

Pourquoi ce segment est-il faux pour la revue de mars, et par quoi le remplacez-vous si le métier veut « le segment selon les achats de la période filtrée » ?

<details>
<summary>Voir la solution</summary>

La colonne est calculée au rafraîchissement, sur l'historique alors chargé, pas sur mars. Elle ignore le filtre du rapport. La masquer empêche en plus le lecteur de voir la règle.

Un segment qui dépend de la période filtrée est une **mesure**, ou un attribut de référentiel (SCD) alimenté par la donnée, pas une colonne cachée. Si la règle est « Gold si le CA de la période affichée dépasse 500 € », on l'écrit comme une mesure de classement, recalculée avec les filtres, et on la documente. On ne la stocke pas la nuit pour un rapport qui change de mois.

</details>

## Exercice 3 : La liste des champs

La liste publiée contient : `fVentes`, `dim_client_v2`, `Client Key`, `AMT_HT`, `Numéro de mois`, `Famille`, `SUM_AMT`, `Date2`.

Dites ce que vous renommez, ce que vous masquez, et le nom de la mesure de chiffre d'affaires.

<details>
<summary>Voir la solution</summary>

Renommer : `fVentes` en `Ventes`, `dim_client_v2` en `Clients`, `Date2` en `Date de livraison` si c'est bien ce rôle. `Famille` est déjà un nom métier, on la laisse visible.

Masquer : `Client Key` et `Numéro de mois` (après avoir branché le tri des mois). On masque aussi la colonne `AMT_HT` une fois la mesure publiée, ou on la renomme `Montant HT` et on la masque pour que les visuels passent par la mesure.

La mesure s'appelle `Chiffre d'affaires HT`, pas `SUM_AMT`. Le nom dit l'indicateur et l'unité, pas la fonction d'agrégation.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Bonnes pratiques du modèle sémantique
center: Une date commune, des noms du métier, des clés masquées, et aucune règle de chiffre cachée dans une colonne.
points:
  - icon: clock
    title: Une table de dates
    text: Un calendrier continu et marqué. Ticket et livraison sont des rôles, pas deux référentiels.
  - icon: eye
    title: Rien de caché qui calcule
    text: Une colonne figée au rafraîchissement ne suit pas le mois filtré. L'indicateur est une mesure.
  - icon: chat
    title: Noms métier
    text: Chiffre d'affaires HT, pas AMT_HT. Le magasin de Lyon doit pouvoir lire le slicer.
  - icon: lock
    title: Clés masquées
    text: La relation garde la clé. Le rapport montre Lyon Part-Dieu, pas le numéro 12.
  - icon: compass
    title: Expliquable
    text: Une page, une phrase de grain. Sinon on simplifie avant d'ajouter du DAX.
pitfall: Laisser la date automatique créer un calendrier caché par colonne, puis cumuler sur le mauvais temps.
remember: Si un collègue ne peut pas redessiner l'étoile et nommer le chiffre d'affaires, le modèle n'est pas publié.
```
