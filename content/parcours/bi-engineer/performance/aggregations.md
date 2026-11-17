---
title: "Agrégats pour la direction"
description: "Servir la revue Halte avec un agrégat jour par magasin, laisser le ticket à part, et exiger que les totaux des deux grains coïncident."
duration: 62
objectives:
  - "Donner à la direction un grain jour par magasin plutôt que la ligne de ticket"
  - "Garder le détail dans un modèle à part, pour l'enquête magasin"
  - "Vérifier que la somme de l'agrégat égale la somme du fait"
  - "Reconnaître ce qui n'est pas additif et ne doit pas être stocké comme une somme"
---

# La direction ne lit pas le ticket

La revue du lundi regarde le réseau, les régions, les magasins, le mois en cours contre le mois précédent. Elle ne ouvre pas une ligne de ticket. Lui faire porter `fct_ventes` dans le modèle de direction, c'est importer des années de lignes pour afficher une somme que vous auriez pu préparer.

L'**agrégat** `mart_ventes_jour_magasin` est cette préparation. Une ligne par jour et par magasin : CA HT, marge HT, nombre de tickets. La page de direction somme cet agrégat. Elle reste rapide, y compris en import. Le responsable qui veut comprendre un après-midi de caisse n'utilise pas cette page : il va au détail, ailleurs.

Vous ne « simplifiez » pas le fait en le filtrant dans le visuel. Vous publiez un mart dont le grain est celui de la question. Le fait reste la source du grain fin. L'agrégat est une lecture précalculée, pas une deuxième définition.

```diagram
type: compare
title: "Deux grains, un même CA"
columns:
  - title: "Direction"
    tone: violet
    items:
      - "Jour par magasin"
      - "CA, marge, tickets"
      - "La page du lundi"
  - title: "Détail"
    tone: teal
    items:
      - "Ligne de ticket"
      - "Enquête d'un magasin"
      - "Pas la source des totaux de revue"
  - title: "Contrôle"
    tone: amber
    items:
      - "Somme de l'agrégat"
      - "Somme du fait"
      - "Écart nul avant de publier"
```

# Le grain jour par magasin

Chez Halte, un ticket appartient à un magasin et à un jour. À ce grain, les sommes se réagrègent sans surprise : le CA d'une région est la somme des CA jour par magasin de ses magasins. Le nombre de tickets aussi, tant que cette règle de ticket tient.

```sql
-- models/marts/mart_ventes_jour_magasin.sql
{{ config(materialized='table') }}

select
    date_trunc('month', jour)::date as mois,
    jour,
    magasin_id,
    sum(montant_ht_signe) as ca_ht,
    sum(marge_ht) as marge_ht,
    count(distinct ticket_id) as nb_tickets
from {{ ref('fct_ventes') }}
group by 1, 2, 3
```

`ca_ht` reprend le nom de la mesure, pas un nouveau périmètre. Même signe, mêmes exclusions : l'agrégat lit `fct_ventes` après le périmètre, il ne refiltre pas les retours. `nb_tickets` compte les tickets distincts du jour dans le magasin. Comme un ticket ne traverse ni deux magasins ni deux jours, sommer `nb_tickets` sur la semaine ou sur la région donne le bon total. La colonne `mois` ne change pas ce grain : elle sert, plus tard, à remplacer un mois entier sans réécrire l'historique.

Le taux de marge n'est pas dans cet agrégat. Le stocker serait figer un quotient au grain jour par magasin, que quelqu'un moyennerait ensuite. La couche sémantique recalcule `DIVIDE ( SUM ( marge_ht ), SUM ( ca_ht ) )` sur les lignes d'agrégat du contexte. Les sommes sont additives. Le taux ne l'est pas.

Si demain un ticket pouvait être encaissé sur deux magasins, `nb_tickets` cesserait d'être sommable. Vous retireriez ce compte de l'agrégat et vous le recalculeriez depuis le fait. Vous ne laisseriez pas une somme fausse « parce que le cas est rare ».

# Le détail reste à part

`fct_ventes` sert l'enquête : quelle ligne, quel ticket, quel montant signé. Le mettre dans le même modèle que la page de direction « au cas où on fore » ramène le volume que l'agrégat venait d'éviter, et invite un visuel de revue à partir du mauvais grain.

Deux usages, deux branches.

- Le modèle de direction importe `mart_ventes_jour_magasin`, `dim_magasins`, `dim_date`. Ses mesures `CA HT` et `Marge HT` somment les colonnes de l'agrégat.
- Le détail reste sur `fct_ventes`, pour un public qui enquête, avec les mêmes noms de mesures s'il expose un CA. Il n'est pas la source de la page du lundi.

Un drillthrough qui ouvre quelques tickets d'un magasin et d'un jour peut interroger le fait filtré. Il ne remplace pas l'agrégat pour le total du réseau. La page de direction n'a pas de visuel branché sur la ligne.

> [!IMPORTANT]
> Les deux branches portent les mêmes noms. `CA HT` sur l'agrégat et `CA HT` sur le fait doivent être la même définition. Sinon la personne qui fore croit avoir trouvé une erreur de caisse, et elle a trouvé une erreur de modèle.

```video
url: https://www.youtube.com/watch?v=EhGF372t0sU
title: "The How and Why of Power BI Aggregations"
channel: "Guy in a Cube"
duration: "9:01"
lang: en
why: "Guy in a Cube explique le pourquoi et le comment des agrégations dans Power BI."
```

# Les totaux doivent coïncider

Avant de publier l'agrégat, la somme égale celle du fait. Pas « à peu près », pas seulement au niveau réseau : un écart de +100 € sur un magasin et de −100 € sur un autre laisse le total juste et la revue régionale fausse.

```sql
-- tests/agregat_jour_magasin_rapproche.sql
with detail as (
    select
        jour,
        magasin_id,
        sum(montant_ht_signe) as ca_ht,
        sum(marge_ht) as marge_ht
    from {{ ref('fct_ventes') }}
    group by 1, 2
),
agregat as (
    select jour, magasin_id, ca_ht, marge_ht
    from {{ ref('mart_ventes_jour_magasin') }}
)
select
    coalesce(d.jour, a.jour) as jour,
    coalesce(d.magasin_id, a.magasin_id) as magasin_id
from detail as d
full outer join agregat as a
    on a.jour = d.jour
    and a.magasin_id = d.magasin_id
where abs(coalesce(d.ca_ht, 0) - coalesce(a.ca_ht, 0)) > 0.01
   or abs(coalesce(d.marge_ht, 0) - coalesce(a.marge_ht, 0)) > 0.01
```

Zéro ligne, les grains coïncident. Une ligne, vous ne publiez pas le modèle de direction. Les causes fréquentes : l'agrégat a refiltré les montants positifs, il a été construit avant le périmètre, ou une partition du matin a rechargé l'un et pas l'autre.

Le test de total réseau seul ne suffit pas. Il reste utile comme lecture rapide, et insuffisant comme preuve. Le test au grain jour par magasin est celui qui bloque le build.

# Ce qui n'est pas une somme

Vous pouvez additionner `ca_ht` et `marge_ht` depuis l'agrégat. Vous pouvez additionner `nb_tickets` tant que la règle « un ticket, un magasin, un jour » est écrite à côté de la colonne.

Vous ne stockez pas `taux_de_marge` dans `mart_ventes_jour_magasin` pour le resommer. Vous ne moyennez pas les taux journaliers pour obtenir le mois. Le mois est `sum(marge_ht) / sum(ca_ht)` sur les jours du mois.

Vous ne joignez pas le budget mensuel sur chaque ligne jour par magasin sans le ramener au bon grain. Un objectif mensuel répété sur trente jours se sommerait trente fois sur la page du mois. L'objectif vit à son grain, et la mesure d'écart se calcule dans la couche, pas en dupliquant la ligne de budget.

Le livrable est l'agrégat testé, le détail tenu à part, et des mesures qui portent le même nom des deux côtés. La page de direction est rapide parce que le grain est le sien. Elle est crédible parce que son total est celui du fait.

# Exercices

## Exercice 1 : Quelle table pour le lundi

La page de direction montre le CA du mois par région, la marge, le nombre de tickets, et la liste des magasins sous l'objectif. Quelqu'un propose d'importer `fct_ventes` « pour pouvoir tout faire ». Que chargez-vous dans ce modèle, et que laissez-vous dehors ?

<details>
<summary>Voir la solution</summary>

Vous chargez `mart_ventes_jour_magasin`, `dim_magasins`, `dim_date`. Les mesures somment `ca_ht`, `marge_ht` et `nb_tickets`. L'objectif mensuel vient d'une table à son grain (mois, magasin), pas d'une jointure qui le répète sur chaque jour.

`fct_ventes` reste dehors de ce modèle. Le volume ne sert aucune de ces questions. L'enquête ticket a son entrée à part. Importer le fait « au cas où » ramène la lenteur et la tentation d'un visuel de revue au mauvais grain.

</details>

## Exercice 2 : Le total réseau juste, l'Est faux

Le CA réseau de l'agrégat égale le CA du fait. Le CA de l'Est est plus haut de 500 € dans l'agrégat, et l'Ouest plus bas de 500 €. Le test de somme globale est vert. Que manque-t-il, et quelle cause cherchez-vous en premier ?

<details>
<summary>Voir la solution</summary>

Il manque le contrôle au grain jour par magasin (ou au moins par région). Deux écarts opposés s'annulent dans le total. Vous ne publiez pas.

Piste première : une région lue dans la dimension courante d'un côté et dans une autre affectation de l'autre, ou un magasin dont les lignes sont tombées sous un `magasin_id` différent entre les deux builds (l'un rechargé, l'autre pas). Le test `FULL OUTER JOIN` sur `(jour, magasin_id)` doit renvoyer ces lignes et faire échouer le build. Un test qui ne compare que `sum(ca_ht)` réseau reste vert et ne protège pas la revue régionale.

</details>

## Exercice 3 : Le taux dans la table

Un collègue ajoute `taux_de_marge` dans `mart_ventes_jour_magasin`, calculé par ligne jour-magasin, puis la page moyenne cette colonne pour afficher le mois. Lundi, le taux du réseau ne colle pas à `sum(marge) / sum(ca)`. Pourquoi, et que doit sommer la page à la place ?

<details>
<summary>Voir la solution</summary>

La moyenne des taux journaliers traite un petit dimanche comme un gros samedi. Le taux du mois est le quotient des sommes, pas la moyenne des quotients.

Vous retirez `taux_de_marge` de l'agrégat, ou vous le laissez hors de toute somme et de toute moyenne. La page pose la mesure `Taux de marge`, qui fait `DIVIDE ( SUM ( marge_ht ), SUM ( ca_ht ) )` sur les jours du filtre. `nb_tickets`, lui, peut rester sommé, parce qu'un ticket Halte ne chevauche pas deux jours ni deux magasins. Cette phrase doit être dans la description de la colonne. Si elle devient fausse, le compte sort de l'agrégat.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Agrégat de direction"
center: "La revue somme le jour par magasin. Le ticket reste à part. Les deux CA coïncident au grain fin, pas seulement au réseau."
points:
  - icon: chart
    title: "Grain de revue"
    text: "Une ligne par jour et par magasin : CA, marge, nombre de tickets."
  - icon: database
    title: "Le détail ailleurs"
    text: "fct_ventes sert l'enquête. Il n'alimente pas la page du lundi."
  - icon: scale
    title: "Mêmes totaux"
    text: "Le test joint les deux grains. Un +500 et un -500 ne s'annulent pas en silence."
  - icon: money
    title: "Sommes additives"
    text: "CA et marge se somment. Le taux se recalcule. Il ne se moyenne pas."
  - icon: check
    title: "Même nom"
    text: "CA HT désigne la même définition sur l'agrégat et sur le fait."
pitfall: "Un total réseau égal peut cacher un Est trop haut et un Ouest trop bas."
remember: "Vous publiez l'agrégat quand le test au grain jour par magasin ne renvoie plus de ligne."
```
