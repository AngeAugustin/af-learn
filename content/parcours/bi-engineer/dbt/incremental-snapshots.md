---
title: "Incrémental et snapshots"
description: "Passer fct_ventes en incrémental quand le volume l'exige, historiser le magasin par snapshot, et ne pas oublier la reconstruction après une règle."
duration: 65
objectives:
  - "Choisir l'incrémental seulement quand le volume de fct_ventes l'exige"
  - "Fixer la clé, la stratégie et la fenêtre de rechargement"
  - "Historiser la région du magasin avec un snapshot"
  - "Lancer une reconstruction complète après un changement de règle"
---

# Quand le volume l'exige

`fct_ventes` en table entière est le bon défaut tant que la reconstruction tient dans la fenêtre de la nuit et laisse le modèle prêt avant la revue. Le jour où elle dure trop, où elle coûte trop, ou où elle bloque les modèles d'après, vous ne « optimisez » pas au hasard. Vous passez ce modèle en **incrémental** : chaque run ne retraite que les lignes récentes, et les fusionne dans la table déjà là.

Le volume qui compte est celui de `fct_ventes`, des années de lignes de ticket. `dim_magasins` ne justifie rien de tel : quelques dizaines de lignes, une table reconstruite en entier à chaque build. Un incrémental sur une dimension petite ajoute une clé, une fenêtre, et des oublis, pour un gain nul.

L'incrémental n'est pas plus « frais » qu'une table. Il est moins cher à reconstruire. La fraîcheur reste l'heure du job. S'il ne tourne qu'une fois par nuit, le lundi matin voit les tickets chargés avant cette nuit, pas ceux de 8 h.

```diagram
type: decision
title: "Table entière ou incrémental"
nodes:
  - question: "La reconstruction complète de la table tient-elle dans la fenêtre, à un coût acceptable ?"
    yes: "On la garde en table entière. Moins de pièges."
    no: "Question suivante."
  - question: "Le modèle est-il un fait volumineux, avec une clé stable par ligne ?"
    yes: "Incrémental, avec clé, stratégie merge et fenêtre de recouvrement."
    no: "On cherche d'abord pourquoi la table est lourde. On n'incrémente pas une dimension de magasins."
```

# La clé et la fenêtre

La **clé** dit quelle ligne existe déjà. Pour Halte, c'est `ligne_id`. La stratégie `merge` met à jour cette ligne si elle revient, au lieu d'en ajouter une deuxième. Sans clé, la fenêtre de recouvrement dupliquerait des tickets, et le CA monterait.

La fenêtre ne filtre pas sur `jour` seul. Un magasin hors ligne le vendredi peut charger ses tickets le lundi : `jour` est ancien, `charge_le` est récent. Filtrer « les trois derniers jours de vente » rate ces lignes, ou les ignore jusqu'à une reconstruction manuelle. On filtre sur `charge_le`, avec deux jours de marge, pour reprendre ce qui est arrivé pendant le run précédent.

```sql
-- models/marts/fct_ventes.sql
{{
    config(
        materialized='incremental',
        unique_key='ligne_id',
        incremental_strategy='merge'
    )
}}

select
    ligne_id,
    ticket_id,
    magasin_id,
    jour,
    charge_le,
    montant_ht_signe,
    cout_ht_signe,
    montant_ht_signe - cout_ht_signe as marge_ht
from {{ ref('int_ventes__perimetre') }}

{% if is_incremental() %}
where charge_le >= (
    select max(charge_le) from {{ this }}
) - interval '2 days'
{% endif %}
```

`is_incremental()` est faux tant que la table n'existe pas, et faux aussi pendant une reconstruction complète. Le premier run charge donc tout le périmètre. `{{ this }}` est la table du modèle elle-même. La marge de deux jours, combinée au `merge` sur `ligne_id`, réécrit sans dupliquer.

> [!IMPORTANT]
> La clé est l'identité de la ligne de ticket, pas le couple magasin et jour. À ce grain-là, le merge écraserait des tickets les uns par les autres.

# Le snapshot pour la région

`dim_magasins` montre la région d'aujourd'hui. Si un magasin passe de l'Est au Nord, toutes ses ventes passées suivent, dès que le fait est joint à cette dimension courante. La revue historique se réécrit. Le responsable Est « perd » un magasin sur les mois déjà commentés.

Un **snapshot** garde les versions. Il lit le référentiel à chaque exécution. Quand `mis_a_jour_le` change, il clôt la version précédente (`dbt_valid_to`) et insère la nouvelle. La stratégie `timestamp` suppose que cette colonne bouge vraiment à chaque changement. Si la source l'oublie, la stratégie `check` compare `region` et `nom`.

```yaml
# snapshots/magasins.yml
snapshots:
  - name: magasins_snapshot
    relation: ref('stg_referentiel__magasins')
    config:
      unique_key: magasin_id
      strategy: timestamp
      updated_at: mis_a_jour_le
```

Pour un CA « dans la région de l'époque », la jointure utilise la validité, pas la dimension courante.

```sql
select
    v.ligne_id,
    s.region
from {{ ref('fct_ventes') }} as v
join {{ ref('magasins_snapshot') }} as s
    on s.magasin_id = v.magasin_id
    and v.jour >= s.dbt_valid_from::date
    and (s.dbt_valid_to is null or v.jour < s.dbt_valid_to::date)
```

Le snapshot ne voit que les états présents au moment où il tourne. Deux changements de région dans la même journée, un seul run : la valeur du milieu n'existe pas. Pour l'affectation d'un magasin, un run quotidien suffit en général. Ce n'est pas un journal de caisse.

La dimension courante reste légitime pour la question « où est le magasin maintenant ». Vous ne remplacez pas `dim_magasins` par le snapshot partout. Vous choisissez la jointure selon la question.

```video
url: https://www.youtube.com/watch?v=SNtM_RUa5G4
title: "How to use dbt Snapshots to track data history"
channel: "Kahan Data Solutions"
duration: "10:54"
lang: en
why: "Les snapshots dbt pour suivre l'historique d'une table, démontrés pas à pas."
```

# La reconstruction qu'on oublie

L'incrémental ne réécrit que la fenêtre. Le jour où la règle change, les lignes hors fenêtre gardent l'ancienne règle.

Cas Halte. La finance sort le canal atelier du périmètre. Vous corrigez `int_ventes__perimetre`. Le run de la nuit fusionne les lignes dont `charge_le` est récent. Mars, rechargé, colle au contrôle finance. Janvier contient encore l'atelier. La table porte deux définitions de CA selon l'âge des lignes. Aucun test limité au mois courant ne le voit.

Après un changement de règle (signe, périmètre, formule de marge), la revue du modèle inclut une reconstruction complète, une fois :

```text
dbt build --select fct_ventes --full-refresh
```

Puis l'incrémental reprend. Vous rapprochez un mois ancien, pas seulement le mois ouvert. Si janvier s'écarte du contrôle finance retraité, la reconstruction n'a pas eu lieu, ou elle n'a pas pris la nouvelle règle.

Oublier ce geste est le défaut le plus cher : le build est vert, la doc parle déjà du nouveau périmètre, les lignes vieilles vivent encore dans l'ancien.

> [!WARNING]
> Le snapshot est le geste inverse. `dbt snapshot --full-refresh` recrée la table et jette les versions. Vous ne « réparez » pas un historique de régions avec ce drapeau. L'histoire effacée ne revient pas toute seule au run suivant.

# Ce que vous contrôlez

Avant de merger le changement de règle, la fiche tient en quatre lignes.

- La clé de `fct_ventes` est toujours `ligne_id`, stratégie `merge`.
- La fenêtre filtre `charge_le`, avec recouvrement, pas seulement `jour`.
- Le PR dit si un `--full-refresh` est requis, et sur quel modèle.
- Un mois ancien est dans le test de réconciliation, pas seulement le mois en cours.

`dim_magasins` continue de se reconstruire en entier. Le snapshot `magasins_snapshot` tourne sur son rythme, sans reconstruction complète. La question « CA de l'Est tel qu'il était en mars » joint le snapshot. La question « quels magasins sont à l'Est aujourd'hui » joint la dimension courante.

Vous livrez un fait dont toutes les lignes obéissent à la même règle, et un historique de magasin qui ne se réécrit pas quand un rattachement change. Le graphique viendra lire l'un ou l'autre, selon la question, sans les mélanger dans une formule locale.

# Exercices

## Exercice 1 : Ce modèle-là, pas l'autre

Le build complet de `fct_ventes` dépasse la fenêtre de nuit. `dim_magasins` fait 80 lignes et se reconstruit en une seconde. `int_ventes__lignes_signees` est une view lue une fois par le mart. Que passez-vous en incrémental, et que laissez-vous tranquille ?

<details>
<summary>Voir la solution</summary>

Seul `fct_ventes` passe en incrémental : volume réel, clé `ligne_id` stable, stratégie `merge`.

`dim_magasins` reste une table reconstruite en entier. L'incrémenter n'achète rien et ajoute une fenêtre à surveiller.

L'intermediate reste une view. L'accélérer en incrémental déplacerait la complexité sans servir l'analyste, qui ne la lit pas. S'il devenait vraiment coûteux et partagé, on en ferait une table, encore en reconstruction complète tant que le temps reste court.

</details>

## Exercice 2 : Vendredi chargé lundi

Un magasin envoie le lundi des tickets dont `jour` est le vendredi, et `charge_le` le lundi. Le filtre incrémental est `where jour >= current_date - 2`. Les runs de samedi et dimanche n'ont rien chargé. Que manque-t-il au CA de vendredi, et quel filtre vous écrivez ?

<details>
<summary>Voir la solution</summary>

Le run du lundi ne reprend que samedi et dimanche si l'on filtre sur `jour`. Les tickets de vendredi, chargés lundi, restent dehors. Vendredi est trop bas jusqu'à une reconstruction manuelle.

```sql
{% if is_incremental() %}
where charge_le >= (
    select max(charge_le) from {{ this }}
) - interval '2 days'
{% endif %}
```

La clé `ligne_id` et le `merge` empêchent la marge de deux jours de dupliquer les lignes déjà présentes. Filtrer sur `jour` resterait faux même avec un merge : les lignes absentes du `SELECT` ne sont pas mises à jour.

</details>

## Exercice 3 : Atelier sorti, janvier intact

Lundi, la finance exclut le canal atelier. Vous modifiez `int_ventes__perimetre`. Mardi, le rapprochement de mars est vert. Janvier, lui, contient encore l'atelier, et la description parle déjà du nouveau périmètre. Que s'est-il passé, quelle commande manquait, et pourquoi un snapshot de magasins ne se traite pas de la même façon ?

<details>
<summary>Voir la solution</summary>

L'incrémental n'a réécrit que la fenêtre de `charge_le`. Janvier n'a pas été recalculé. La table mélange deux périmètres. Il manquait, une fois, `dbt build --select fct_ventes --full-refresh`, puis un rapprochement sur janvier, pas seulement sur mars.

Le snapshot ne se reconstruit pas pour « appliquer la même logique ». Un `--full-refresh` sur `magasins_snapshot` efface les changements de région déjà capturés. On le laisse accumuler. Seul le fait, dont la règle SQL a changé, doit être rejoué en entier.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Incrémental et historique"
center: "L'incrémental économise le volume. Après une règle nouvelle, toute la table doit réobéir, pas seulement la fenêtre récente."
points:
  - icon: gauge
    title: "Quand ça vaut"
    text: "fct_ventes seulement. Une dimension de magasins reste une table entière."
  - icon: key
    title: "ligne_id"
    text: "merge sur la ligne de ticket. La fenêtre lit charge_le, avec deux jours de marge."
  - icon: clock
    title: "Région d'époque"
    text: "Le snapshot garde l'ancienne région. La dimension courante dit où est le magasin maintenant."
  - icon: alert
    title: "Règle changée"
    text: "Sans full-refresh, janvier garde l'atelier et mars ne le contient plus."
  - icon: shield
    title: "Pas le snapshot"
    text: "Reconstruire un snapshot jette les versions. On ne répare pas l'historique ainsi."
pitfall: "Un rapprochement du seul mois courant reste vert alors que les mois anciens suivent encore l'ancienne règle."
remember: "Même clé, même règle sur toutes les lignes. L'historique magasin s'ajoute, il ne se rejoue pas."
```
