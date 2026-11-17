---
title: "Modèles dbt en trois couches"
description: "Découper les ventes magasins de Halte en staging, intermediate et mart, relier les fichiers par ref, et choisir view ou table."
duration: 60
objectives:
  - "Découper les ventes Halte en staging, intermediate et mart"
  - "Relier les modèles avec ref et un nom qui dit la responsabilité"
  - "Garder une seule raison de changer par modèle"
  - "Choisir une matérialisation view ou table"
---

# Les ventes Halte en trois couches

Halte encaisse dans les magasins. Chaque passage en caisse laisse des lignes de ticket : un identifiant, un magasin, un instant, un type (vente ou retour), un montant HT, un coût HT, un indicateur de vente interne. Ces lignes arrivent brutes. Elles ne sont pas encore le chiffre de la revue du lundi.

dbt ne dessine pas cette revue. Il exécute des `SELECT` dans l'entrepôt et produit des relations nommées, dans un ordre qu'il déduit des dépendances. Votre livrable de BI Engineer est cette chaîne. L'analyste s'y branche ensuite. Vous ne lui rendez pas une page.

Trois couches suffisent pour les ventes magasins.

Le **staging** remet une source au propre. Un fichier par table brute. On renomme, on type, on met le type de ligne en minuscules. On ne décide pas encore ce qu'est le chiffre d'affaires.

L'**intermediate** porte une règle métier, encore au grain de la ligne. Ici, deux règles distinctes : le signe (une vente reste positive, un retour devient négatif), puis le périmètre (les ventes internes sortent). Chacune a son fichier.

Le **mart** est l'étage publié. `fct_ventes` tient une ligne par ligne de ticket, avec le montant déjà signé et la marge. `dim_magasins` décrit le réseau. La couche sémantique et les rapports lisent cet étage. Ils ne lisent pas la caisse « en attendant ».

```diagram
type: layers
title: "Des lignes de caisse au mart Halte"
layers:
  - title: "Mart"
    text: "fct_ventes et dim_magasins, seul étage publié"
  - title: "Intermediate"
    text: "Signe des retours, puis périmètre hors ventes internes"
  - title: "Staging"
    text: "Types, noms, minuscules. Une source, un modèle"
  - title: "Brut"
    text: "caisse.lignes et referentiel.magasins, chargés hors de dbt"
```

# ref, source et le nom

Seul le staging appelle `source()`. Tout le reste appelle `ref()`. dbt construit alors `int_ventes__lignes_signees` avant `fct_ventes`, sans que vous écriviez l'ordre à la main.

```sql
-- models/staging/caisse/stg_caisse__lignes.sql
select
    ligne_id,
    ticket_id,
    magasin_id,
    cast(vendu_le as date) as jour,
    cast(charge_le as timestamp) as charge_le,
    lower(type_ligne) as type_ligne,
    cast(montant_ht as numeric(12, 2)) as montant_ht,
    cast(cout_ht as numeric(12, 2)) as cout_ht,
    coalesce(vente_interne, false) as vente_interne
from {{ source('caisse', 'lignes') }}
```

```sql
-- models/intermediate/int_ventes__lignes_signees.sql
select
    ligne_id,
    ticket_id,
    magasin_id,
    jour,
    charge_le,
    vente_interne,
    case
        when type_ligne = 'vente' then montant_ht
        when type_ligne = 'retour' then -montant_ht
    end as montant_ht_signe,
    case
        when type_ligne = 'vente' then cout_ht
        when type_ligne = 'retour' then -cout_ht
    end as cout_ht_signe
from {{ ref('stg_caisse__lignes') }}
```

Le nom porte la couche et le sujet. `stg_caisse__lignes` : staging, source `caisse`, objet `lignes`. Le double underscore sépare la source de l'objet. `int_ventes__lignes_signees` : intermediate, domaine ventes, responsabilité lisible. `fct_ventes` et `dim_magasins` : mart, fait ou dimension.

`ventes_final_v3` ne dit ni la couche, ni ce qui devra changer le jour où la finance modifiera le traitement des retours.

> [!IMPORTANT]
> `ref('stg_caisse__lignes')` désigne le modèle, pas un schéma physique. Si la vue change de schéma au déploiement, les modèles en aval restent valides.

# Une responsabilité, un fichier

Un modèle change pour une raison. S'il en a deux, il se coupe.

`stg_caisse__lignes` change quand la caisse renomme une colonne ou envoie un type en majuscules. Il ne change pas quand la finance décide qu'un retour se soustrait.

`int_ventes__lignes_signees` ne fait que ce signe. Le périmètre est une autre raison de changer : un canal peut entrer ou sortir sans que la règle des retours bouge. Il a donc son modèle.

```sql
-- models/intermediate/int_ventes__perimetre.sql
select
    ligne_id,
    ticket_id,
    magasin_id,
    jour,
    charge_le,
    montant_ht_signe,
    cout_ht_signe
from {{ ref('int_ventes__lignes_signees') }}
where not vente_interne
```

`fct_ventes` publie le grain. Il assemble les colonnes que l'analyste a le droit de sommer. Il ne réécrit pas le signe, et il ne joint pas le budget du mois : le budget est à un autre grain, une ligne de budget répétée sur chaque ticket gonflerait les sommes.

```sql
-- models/marts/fct_ventes.sql
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
```

Le test de lecture est simple. Si vous ne pouvez pas finir la phrase « ce fichier change quand… » avec un seul événement, le fichier fait deux métiers.

# View ou table

La matérialisation dit si le `SELECT` est rejoué à chaque lecture ou stocké.

Une **view** ne copie pas les lignes. L'entrepôt réexécute le SQL à la lecture. Elle convient au staging et à l'intermediate : la transformation est légère, et le mart est le seul gros lecteur, au moment du `dbt build`.

Une **table** stocke le résultat. Elle convient au mart. La couche sémantique relit `fct_ventes` souvent. Rejouer le signe sur des années de tickets à chaque visuel ferait payer le calcul à la personne qui ouvre la revue, pas au traitement de la nuit.

```yaml
# dbt_project.yml
models:
  halte:
    staging:
      +materialized: view
    intermediate:
      +materialized: view
    marts:
      +materialized: table
```

Le défaut se surcharge pour une raison écrite. Une intermediate lourde, relue par plusieurs marts, peut devenir une table. Une dimension de quelques dizaines de magasins peut rester une table elle aussi : le coût est nul, et le modèle sémantique aime une relation stable. Ce qui ne se justifie pas, c'est une view sur `fct_ventes` « pour être toujours frais ». La fraîcheur se règle à l'heure du build.

> [!WARNING]
> Tant que `fct_ventes` est une view, chaque page du lundi refait le travail. Le modèle a l'air simple. La revue attend.

# Ce que vous publiez

Vous publiez le mart. `fct_ventes` a un grain : une ligne de ticket magasin, hors ventes internes, retours déjà signés. Sommer `montant_ht_signe` donne le CA HT. Sommer `marge_ht` donne la marge du même périmètre. `dim_magasins` porte le nom et la région.

L'analyste n'a pas à ouvrir `stg_caisse__lignes` pour vérifier un magasin, ni à refaire le `CASE` dans son outil. S'il lui faut les ventes avant retours, vous ajoutez une colonne au bon étage, avec un nom qui ne se confond pas avec le CA. La page viendra après. Elle n'est pas le livrable de ce chapitre.

# Exercices

## Exercice 1 : Découper ventes.sql

Un collègue propose un seul modèle `ventes.sql`. Il caste `AMOUNT_HT`, passe `TYPE` en minuscules, change le signe des retours, retire les ventes internes, et joint le budget mensuel du magasin sur chaque ligne de ticket. Découpez ce fichier. Dites ce qui ne doit pas rejoindre la ligne de ticket.

<details>
<summary>Voir la solution</summary>

Quatre responsabilités, quatre modèles.

- `stg_caisse__lignes` : casts, minuscules, booléen `vente_interne`. Aucune règle de chiffre.
- `int_ventes__lignes_signees` : le signe, et seulement le signe.
- `int_ventes__perimetre` : `where not vente_interne`.
- `fct_ventes` : le grain publié, montant signé, coût signé, marge.

Le budget mensuel ne rejoint pas la ligne. Une ligne de budget répétée sur chaque ticket se sommerait autant de fois qu'il y a de lignes. Le budget vit à son grain (mois, magasin), dans un autre mart, et la comparaison CA contre budget se fait dans la couche sémantique.

</details>

## Exercice 2 : View ou table

`dim_magasins` compte une ligne par magasin. `int_ventes__lignes_signees` n'est lu que pendant le build de `fct_ventes`. `fct_ventes` couvre plusieurs années de tickets et alimente le modèle du lundi. Attribuez view ou table à chacun. Décrivez le lundi matin si `fct_ventes` reste une view.

<details>
<summary>Voir la solution</summary>

`dim_magasins` : table. Le volume est petit, la relation du modèle sémantique gagne à être stockée.

`int_ventes__lignes_signees` : view. Un seul consommateur, au build, et la règle est un `CASE` peu coûteux devant la lecture de la source.

`fct_ventes` : table. C'est l'étage relu par la couche sémantique.

Si `fct_ventes` reste une view, chaque visuel du lundi réexécute le signe et le périmètre sur tout l'historique. La revue attend, et le coût se répète à chaque filtre. La fraîcheur ne vient pas de ce choix : elle vient de l'heure à laquelle vous reconstruisez la table.

</details>

## Exercice 3 : Un from vers la caisse

Dans `fct_ventes`, quelqu'un écrit `from caisse.lignes` au lieu de `ref`. Le `SELECT` passe sur sa machine, la table brute est là. Vous refusez la revue. Expliquez ce que le projet perd, et donnez le `from` attendu.

<details>
<summary>Voir la solution</summary>

dbt ne voit plus la dépendance. Le graphe peut construire le mart avant le staging, ou ne pas le reconstruire quand la règle de signe change. Le jour où `caisse.lignes` change de schéma, le nom en dur casse, alors que `ref` suivait le modèle.

Le mart ne doit pas non plus relire la brute : il sauterait le signe et le périmètre. Le `from` attendu est `from {{ ref('int_ventes__perimetre') }}`. `source()` reste réservé à `stg_caisse__lignes`.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Trois couches dbt"
center: "Trois couches, un ref, une responsabilité. Le mart est le seul étage que l'analyste de Halte a le droit de lire."
points:
  - icon: layers
    title: "Trois couches"
    text: "Staging pour typer, intermediate pour une règle, mart pour le grain publié."
  - icon: link
    title: "ref en aval"
    text: "source() reste dans le staging. Les autres modèles se citent par ref."
  - icon: target
    title: "Une raison"
    text: "Le signe, le périmètre et le budget ne changent pas dans le même fichier."
  - icon: database
    title: "View ou table"
    text: "View pour le léger. Table pour le mart que la revue du lundi relit souvent."
  - icon: users
    title: "Le mart seul"
    text: "L'analyste consomme fct_ventes. Il ne reconstruit pas le signe dans son outil."
pitfall: "Un fichier ventes_final qui caste, signe et joint le budget n'a plus de responsabilité nommable."
remember: "Vous livrez des modèles reliés par ref. La page du lundi viendra se brancher sur le mart."
```
