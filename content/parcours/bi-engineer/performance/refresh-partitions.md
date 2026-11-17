---
title: "Rafraîchir par partitions"
description: "Choisir ce qui se recharge chez Halte, partitionner les ventes par mois, surveiller la durée, et n'accepter un full refresh quotidien que sur un petit volume."
duration: 60
objectives:
  - "Lister ce qui se rafraîchit chaque matin et ce qui reste en place"
  - "Partitionner les ventes par mois, mois courant et mois précédent"
  - "Traiter la durée et l'échec comme des faits visibles"
  - "Réserver la reconstruction complète quotidienne aux tables petites"
---

# Ce qui part le matin

Tout reconstruire est une décision, pas une hygiène. Chez Halte, les objets n'ont pas le même volume ni la même raison de bouger.

`dim_magasins`, `dim_date` et `securite_region` sont petits. Les reconstruire en entier chaque matin est simple et sans fenêtre à rater. `fct_ventes` et `mart_ventes_jour_magasin` portent l'historique des tickets. Les rejouer sur plusieurs années, tous les jours, mange la fenêtre de nuit et retarde le modèle que la revue ouvre.

Le matin, vous rechargez ce qui a pu changer depuis le dernier succès : les tickets nouvellement chargés, les retours qui arrivent encore sur le mois précédent, les affectations de région, le calendrier s'il a été étendu. Vous ne rechargez pas janvier parce qu'on est le 16 mars, sauf si une règle ou un retraitement finance l'exige. Ce cas-là est explicite, il n'est pas dans le quotidien.

```diagram
type: pipeline
title: "La coupe du matin chez Halte"
lanes:
  - title: "En entier, c'est petit"
    steps:
      - title: "dim_magasins"
        text: "Réseau courant, quelques dizaines de lignes"
        tone: teal
      - title: "dim_date"
        text: "Calendrier, rien à fusionner"
        tone: blue
      - title: "securite_region"
        text: "Affectations du jour, le rôle s'en sert"
        tone: violet
  - title: "Par mois de vente"
    steps:
      - title: "Mois courant"
        text: "Tickets chargés depuis la dernière nuit"
        tone: amber
      - title: "Mois précédent"
        text: "Retours encore possibles sur des jours déjà vendus"
        tone: rose
```

# La partition du mois

La **partition** est le bloc que vous acceptez de recalculer. Pour les ventes magasins, le bloc naturel est le mois de `jour` : c'est le grain du contrôle finance, et c'est le filtre de la revue.

Le mois courant part chaque matin. Le mois précédent part aussi, tant que des retours peuvent encore se charger sur des ventes déjà publiées. Les mois plus vieux ne partent que sur décision : changement de règle, retraitement, correction de caisse. Les laisser dans le job quotidien « par sécurité » annule l'intérêt de la partition.

Sur le fait incrémental, la fenêtre du quotidien couvre ces deux mois, toujours avec `charge_le` pour ne pas rater un ticket ancien chargé cette nuit. Sur l'agrégat jour par magasin, vous remplacez les partitions de ces deux mois en entier : le volume, à ce grain, reste petit. La clé de remplacement est le mois. Sans `delete+insert`, un simple `WHERE` ajouterait chaque matin les mêmes jours à la table, et le CA doublerait.

```sql
-- models/marts/mart_ventes_jour_magasin.sql
{{
    config(
        materialized='incremental',
        incremental_strategy='delete+insert',
        unique_key='mois'
    )
}}

select
    date_trunc('month', jour)::date as mois,
    jour,
    magasin_id,
    sum(montant_ht_signe) as ca_ht,
    sum(marge_ht) as marge_ht,
    count(distinct ticket_id) as nb_tickets
from {{ ref('fct_ventes') }}
{% if is_incremental() %}
where jour >= (date_trunc('month', current_date) - interval '1 month')::date
{% endif %}
group by 1, 2, 3
```

Les lignes de mars présentes dans le lot font supprimer tout mars dans la table, puis le mois est réécrit, y compris un magasin qui n'a plus de ventes. Le fait, lui, continue de s'appuyer sur `charge_le` et sur `ligne_id` : un ticket de vendredi chargé lundi doit entrer, puis l'agrégat du mois concerné se reconstruit. Les deux mécanismes ne se copient pas l'un l'autre.

Le modèle sémantique importé suit la même coupe. Actualiser « tout l'historique » chaque matin recharge des mois qui n'ont pas bougé. Actualiser les partitions des deux mois ouverts suffit à la revue, tant que les mois gelés n'ont pas été retraités dans dbt. Si dbt a reconstruit janvier, l'import de janvier doit suivre. Les deux calendriers se parlent.

# La durée fait partie du contrat

Une partition qui « finit par passer » n'est pas une partition tenue. Vous notez la durée du succès : le mois de l'agrégat, le mois du fait, l'import du modèle. Un ordre de grandeur stable (des minutes sur l'agrégat du mois, pas une heure) vous dit que la coupe est la bonne.

Si la durée s'allonge, la cause est dans le périmètre, pas dans la patience. On a ajouté un mois sans le dire. On a rejoint une dimension trop tôt. On a laissé le fait en view et l'import refait le calcul. Vous corrigez la coupe avant que le job empiète sur 9 h, heure à laquelle la revue commence à ouvrir le fichier.

La durée se lit dans l'outil d'orchestration et dans l'historique d'actualisation du modèle, pas dans le souvenir de la personne qui a lancé le premier chargement. Une durée absente est un échec que vous n'avez pas encore vu.

```video
url: https://www.youtube.com/watch?v=Kui_1G6kQIQ
title: "Configuring Incremental Refresh in Power BI"
channel: "BI Gorilla"
duration: "16:01"
lang: en
why: "La configuration de l'actualisation incrémentielle dans Power BI, partitions comprises."
```

# L'échec doit se voir

Un job rouge qui ne prévient personne est un job vert pour la revue. Le lundi, l'analyste commente des ventes de vendredi en croyant voir dimanche.

L'échec visible tient en trois signes, ensemble.

- Le traitement sort en erreur, avec le nom du modèle et le mois concerné. Personne n'a avalé l'erreur pour « laisser la suite passer ».
- Le modèle sémantique garde la dernière actualisation réussie. Il n'affiche pas une date du jour calculée par `TODAY()` ou par un titre saisi à la main.
- Vous êtes prévenu avant la revue. L'analyste peut voir l'heure de fraîcheur sur la page. Il ne doit pas être le premier à découvrir que la nuit a échoué.

Un succès partiel se traite comme un échec s'il est incomplet : les dimensions ont tourné, le fait non, l'agrégat a sommé un fait à moitié rechargé. Vous ne publiez pas ce mélange. Mieux vaut la fraîcheur d'hier, étiquetée hier, qu'un mois courant à trous étiqueté ce matin.

> [!WARNING]
> Écrire « données à jour » dans un bandeau fixe est une panne invisible. Le bandeau affiche l'horodatage du dernier succès, celui que le job a vraiment écrit.

# Reconstruction complète, seulement si c'est petit

Le **full refresh** quotidien, celui qui rejoue toute la table à chaque nuit, convient à `dim_magasins`, `dim_date`, `securite_region`. Il est honnête, il évite les fenêtres, et il dure si peu que le surveiller est facile.

Il ne convient pas à `fct_ventes` sur plusieurs années. Le coût, la durée et le risque de dépasser 9 h reviennent chaque jour, pour réécrire des mois que rien n'a changés. L'incrémental, avec sa clé et sa reconstruction ciblée quand la règle change, est le régime de ce fait. L'agrégat jour par magasin peut rester en table entière seulement le jour où vous avez mesuré que cette table entière tient encore largement dans la fenêtre. Dès qu'elle s'approche de la revue, vous la partitionnez. Vous ne le découvrez pas un lundi.

La règle tient en une ligne : quotidien complet si c'est petit et mesuré. Sinon, la partition du mois, et une reconstruction totale réservée au changement de règle.

# Exercices

## Exercice 1 : Le menu du 16 mars

Nous sommes le 16 mars. Rien n'a été retraité. Des retours du 28 février sont encore arrivés cette nuit, plus les tickets de mars. Classez `dim_magasins`, `securite_region`, le fait de janvier, le fait de février, le fait de mars, l'agrégat de mars : quoi part ce matin, quoi ne part pas.

<details>
<summary>Voir la solution</summary>

Partent : `dim_magasins` et `securite_region` en entier, le fait sur la fenêtre qui attrape les `charge_le` de la nuit (donc les retours datés du 28 février et les tickets de mars), l'agrégat de février et celui de mars.

Ne part pas : janvier, ni en fait ni en agrégat. Aucune règle n'a changé, aucun retraitement n'est annoncé. Le recharger « pour être sûr » allonge la nuit sans changer le chiffre.

</details>

## Exercice 2 : Le bandeau qui ment

Le job de `fct_ventes` a échoué à 4 h. L'import du modèle n'a pas tourné. La page affiche pourtant « Données du jour » parce que le titre est une zone de texte. L'analyste ouvre la revue à 9 h. Que s'est-il passé, et quels trois signes vous exigez à la place ?

<details>
<summary>Voir la solution</summary>

La revue commente une fraîcheur fausse. Les chiffres sont ceux du dernier succès, avec une étiquette de ce matin. C'est pire qu'un échec visible : la décision se prend sur un jour manquant.

Les trois signes : le job est rouge et nomme le modèle, personne n'a enchaîné l'import sur un fait incomplet, la page affiche l'horodatage du dernier succès réel (pas un texte fixe, pas `TODAY()`). Vous êtes prévenu avant 9 h. L'analyste voit la même heure que vous, et la revue dit « chiffre arrêté à … » au lieu d'inventer le matin.

</details>

## Exercice 3 : « On remet tout, c'est plus simple »

Après une nuit trop longue, on vous propose de tout passer en full refresh quotidien : fait, agrégat, dimensions. L'argument : une seule règle, plus de fenêtre. Dans quel cas vous acceptez, et que mesurez-vous avant d'accepter pour `fct_ventes` ?

<details>
<summary>Voir la solution</summary>

Vous acceptez tout de suite pour les tables petites : dimensions, mapping, calendrier. La simplicité y est gratuite.

Pour `fct_ventes`, vous n'acceptez que si une mesure réelle montre que l'historique entier finit largement avant la revue, et que le coût reste acceptable. « Plus simple » sans cette mesure rejoue chaque nuit des années de tickets. Le bon régime reste l'incrémental par fenêtre de chargement, l'agrégat par mois ouvert, et un full refresh du fait seulement quand la règle change. La simplicité se paie en heures le lundi, pas en lignes de configuration.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Rafraîchir par mois"
center: "Chaque matin, les petites dimensions en entier, les ventes sur le mois courant et le précédent. Un échec se voit avant la revue."
points:
  - icon: list
    title: "Quoi"
    text: "Dimensions et mapping en entier. Le fait historique ne repart pas sans raison."
  - icon: filter
    title: "Par mois"
    text: "Mois courant et mois précédent. Janvier reste en place si rien ne l'a retraité."
  - icon: clock
    title: "La durée"
    text: "Vous la notez. Une heure sur un mois d'agrégat veut dire que la coupe est trop large."
  - icon: alert
    title: "Échec visible"
    text: "Job rouge, import non enchaîné, horodatage du dernier succès sur la page."
  - icon: database
    title: "Full quotidien"
    text: "Oui si la table est petite. Pas sur des années de lignes de ticket."
pitfall: "Un bandeau « données du jour » écrit en dur fait commenter dimanche avec les ventes de vendredi."
remember: "La partition du mois protège la fenêtre de nuit. La reconstruction totale reste un geste décidé."
```
