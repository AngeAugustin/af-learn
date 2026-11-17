---
title: "Tests et contrat de colonnes"
description: "Protéger le mart Halte avec not_null, unique, accepted_values et une réconciliation, puis écrire la description que l'analyste peut tenir."
duration: 62
objectives:
  - "Poser not_null, unique et accepted_values au bon endroit"
  - "Écrire un test de réconciliation qui échoue en renvoyant des lignes"
  - "Décrire chaque colonne publiée comme un contrat"
  - "Dire à l'analyste ce qu'il somme, et ce qu'il ne reconstruit pas"
---

# Ce que le build doit refuser

Un mart qui se construit n'est pas un mart juste. `fct_ventes` peut être là, avec des `ligne_id` en double, un type de ticket inconnu traité comme nul, et un CA de mars à 40 000 € du chiffre que la finance a arrêté. La revue du lundi lirait quand même un nombre.

Les tests dbt sont des requêtes. Le build échoue s'ils échouent. Vous les versionnez à côté du modèle, vous les lancez avec lui (`dbt build`), et vous ne publiez pas le modèle sémantique par-dessus un build rouge.

Chez Halte, quatre contrôles portent le minimum avant d'ouvrir le contrat avec l'analyste : `ligne_id` présent, `ligne_id` unique, `type_ligne` dans une liste courte, CA du mois rapproché du contrôle finance. La description de colonne vient avec. Sans elle, le test protège une règle que personne ne peut citer.

```diagram
type: flow
title: "Du SQL au contrat lu par l'analyste"
steps:
  - title: "Règle dans le modèle"
    text: "Le signe et le périmètre sont déjà dans l'intermediate."
    tone: violet
  - title: "Tests"
    text: "not_null, unique, accepted_values, réconciliation du mois."
    tone: blue
  - title: "Description"
    text: "Grain, unité, signe, ce qui est hors champ."
    tone: teal
  - title: "Analyste"
    text: "Il somme la colonne décrite. Il n'en écrit pas une autre."
    tone: amber
```

# not_null, unique, accepted_values

`not_null` et `unique` sur `ligne_id` empêchent une jointure qui dupliquerait les tickets. Une ligne doublée double le CA, sans que le visuel ait l'air cassé.

`accepted_values` sur `type_ligne` ferme la liste. Le `CASE` du signe ne connaît que `vente` et `retour`. Toute autre valeur (`remboursement`, `avoir`, une chaîne vide) produirait un montant nul, et `SUM` ignorerait la ligne. Le CA serait trop bas, en silence. Le test arrête le build avant ce silence.

```yaml
# models/staging/caisse/_caisse__models.yml
version: 2

models:
  - name: stg_caisse__lignes
    columns:
      - name: ligne_id
        description: "Identifiant de ligne fourni par la caisse."
        tests:
          - not_null
          - unique
      - name: type_ligne
        description: "vente ou retour, déjà en minuscules."
        tests:
          - not_null
          - accepted_values:
              values: ["vente", "retour"]
```

Les mêmes `not_null` et `unique` se reposent sur `fct_ventes.ligne_id`. Le staging garantit la source. Le mart garantit que l'intermediate n'a pas multiplié les lignes en joignant le magasin. Un test seulement en entrée laisse passer un doublon fabriqué chez vous.

`magasin_id` est `not_null` dans le mart, et relié à `dim_magasins`. Une ligne dont le magasin est inconnu ne doit pas devenir du CA sans région : le responsable régional ne la verrait jamais, et le total réseau serait plus haut que la somme des régions.

# Une réconciliation simple

Le test de schéma dit que la colonne est bien formée. Il ne dit pas que mars vaut le chiffre arrêté avec la finance. Ce deuxième contrôle est un test singulier : un fichier SQL dans `tests/`. dbt le considère en échec **s'il renvoie au moins une ligne**. Zéro ligne, le test passe.

`stg_finance__controle_mois` porte le total signé par la finance, un mois, un CA HT. Vous ne recalculez pas leur chiffre dans le test. Vous comparez.

```sql
-- tests/ca_ht_mois_rapproche.sql
with mart as (
    select
        date_trunc('month', jour)::date as mois,
        sum(montant_ht_signe) as ca_ht
    from {{ ref('fct_ventes') }}
    group by 1
)
select
    f.mois,
    f.ca_ht as ca_finance,
    m.ca_ht as ca_mart
from {{ ref('stg_finance__controle_mois') }} as f
join mart as m on m.mois = f.mois
where abs(m.ca_ht - f.ca_ht) > 1
```

Le seuil de 1 € est celui qu'on a écrit avec la finance, pas une marge pour cacher un magasin oublié. Au-delà, le build est rouge. On ne commente pas l'écart dans un chat en laissant le modèle vert.

Le test ne couvre que les mois présents dans la table de contrôle. Un mois absent n'est pas « rapproché ». Il est sans contrôle, et la description du mart doit le dire si vous le publiez quand même.

> [!WARNING]
> Un `SELECT` qui renvoie toujours l'écart, même à zéro, échoue tout le temps. Le `WHERE` fait partie du test. Sans lui, vous finirez par désactiver le contrôle.

```video
url: https://www.youtube.com/watch?v=OpsQfyrWTs8
title: "DBT Tests | Data Build Tool | Singular | Generic | Custom | Prebuild | Source Freshness"
channel: "SleekData"
duration: "7:04"
lang: en
why: "Les tests dbt passés en revue : génériques, singuliers, personnalisés et paquets prêts à l'emploi."
```

# La description est le contrat

La description voyage avec la colonne dans `dbt docs`. C'est le texte que l'analyste lit sans ouvrir le `CASE`. Elle tient en quelques phrases, et elle répond à ce que le nom seul ne tranche pas.

```yaml
# models/marts/_ventes__models.yml
version: 2

models:
  - name: fct_ventes
    description: "Une ligne par ligne de ticket magasin. Hors ventes internes."
    columns:
      - name: montant_ht_signe
        description: "Euros HT. Vente positive, retour négatif. Le CA HT est la somme de cette colonne."
      - name: marge_ht
        description: "montant_ht_signe moins cout_ht_signe. Même périmètre, même signe."
      - name: jour
        description: "Jour de vente en caisse, pas le jour de chargement."
```

`jour` et `charge_le` ne sont pas interchangeables. Un ticket de vendredi chargé lundi porte `jour` = vendredi. Une description qui dit seulement « date » laisse l'analyste filtrer le mauvais calendrier et rater le rapprochement de mars.

Le contrat a deux côtés. Vous vous engagez à ne pas changer le signe de `montant_ht_signe` sans changer la description et prévenir. L'analyste s'engage à sommer cette colonne pour le CA HT, et à demander une nouvelle colonne s'il lui faut un autre périmètre (ventes brutes, TTC, ventes internes). Il ne pose pas un filtre local « pour enlever les retours » : les retours sont déjà négatifs. Les filtrer une deuxième fois les remettrait dans le total.

# Ce que vous rendez à l'analyste

Vous rendez un mart dont le build est vert, une doc ouverte sur la colonne, et une phrase que vous pouvez lire ensemble : « Le CA HT des magasins est la somme de `montant_ht_signe`. »

Vous ne rendez pas un export, ni une capture, ni une formule collée dans un visuel. Si l'analyste a besoin d'un taux, le taux viendra dans la couche sémantique, au-dessus de ces colonnes. Le tester ici garantit que la somme de départ est stable. La doc garantit qu'on ne se dispute pas sur ce que la somme veut dire.

Quand `accepted_values` casse, vous ne « corrigez » pas en ajoutant la nouvelle valeur à la liste pour faire passer le build. Vous demandez à la caisse ce que `remboursement` veut dire. Si c'est un retour, le staging le mappe vers `retour` avant le signe. La liste, elle, reste courte.

# Exercices

## Exercice 1 : Où poser les trois tests

Le staging a `ligne_id` et `type_ligne`. L'intermediate signe les montants. Le mart `fct_ventes` n'a plus `type_ligne`, seulement `ligne_id` et `montant_ht_signe`. Placez `not_null`, `unique` et `accepted_values`. Dites ce qu'un type `avoir` non prévu ferait sans `accepted_values`.

<details>
<summary>Voir la solution</summary>

`not_null` et `unique` sur `stg_caisse__lignes.ligne_id`, et à nouveau sur `fct_ventes.ligne_id`. Le second attrape un doublon créé par une jointure dans l'intermediate.

`accepted_values` sur `stg_caisse__lignes.type_ligne`, valeurs `vente` et `retour`, plus `not_null`. Le poser sur le mart est impossible : la colonne n'y est plus. Le poser seulement après le `CASE` est trop tard.

Sans ce test, `avoir` ne matche ni `vente` ni `retour`. Le montant signé devient nul, `SUM` ignore la ligne, le CA baisse sans message. Le build doit être rouge tant que la caisse et vous n'avez pas décidé du mapping.

</details>

## Exercice 2 : Le test qui passe trop souvent

Quelqu'un écrit dans `tests/` un `SELECT mois, ca_mart, ca_finance, ca_mart - ca_finance AS ecart` sans `WHERE`. dbt renvoie une ligne par mois, écart souvent nul. Le collègue veut supprimer le test « parce qu'il échoue toujours ». Réparez le SQL, et fixez le seuil.

<details>
<summary>Voir la solution</summary>

Un test singulier échoue dès qu'il renvoie une ligne. Il faut garder les mois dont l'écart dépasse le seuil signé, et aucun autre.

```sql
-- extrait : le WHERE est le test
where abs(m.ca_ht - f.ca_ht) > 1
```

Le seuil de 1 € est celui du contrat finance, pas zéro absolu si les arrondis d'un centime sont assumés, et pas 1 000 € pour « avoir la paix ». Un mois absent de `stg_finance__controle_mois` n'est pas contrôlé : on ne le fait pas passer en le retirant du `JOIN` sans le dire.

</details>

## Exercice 3 : La phrase de la colonne

Écrivez la description de `montant_ht_signe` en quatre informations : unité, signe, périmètre, geste interdit à l'analyste. Puis dites ce que vous changez dans le projet si la finance exclut demain le canal atelier.

<details>
<summary>Voir la solution</summary>

« Euros HT. Vente positive, retour négatif. Hors ventes internes. Le CA HT est la somme de cette colonne : ne pas filtrer une seconde fois les retours, ne pas réécrire le signe. »

L'exclusion de l'atelier se fait dans `int_ventes__perimetre`, pas dans un filtre de rapport. La description du mart gagne une phrase (« hors canal atelier »). Les tests de réconciliation doivent repasser, y compris sur un mois déjà contrôlé : les anciennes lignes changent de périmètre. On prévient l'analyste avant qu'il compare au chiffre d'hier.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Tests et contrat"
center: "Un build vert prouve la forme et le mois de contrôle. La description dit à l'analyste quelle somme est le CA."
points:
  - icon: test
    title: "ligne_id"
    text: "not_null et unique dans le staging, puis à nouveau dans fct_ventes."
  - icon: list
    title: "Liste fermée"
    text: "accepted_values sur vente et retour. Une valeur inconnue casse le build."
  - icon: scale
    title: "Réconciliation"
    text: "Le test singulier ne renvoie que les mois dont l'écart dépasse 1 euro."
  - icon: file
    title: "Description"
    text: "Unité, signe, périmètre, et le geste que l'analyste ne refait pas."
  - icon: chat
    title: "Deux côtés"
    text: "Vous ne changez pas le sens en silence. Il ne reconstruit pas le CA."
pitfall: "Un SELECT qui renvoie l'écart même à zéro échoue toujours, et finit désactivé."
remember: "La colonne publiée a une description qu'on peut lire ensemble avant la revue du lundi."
```
