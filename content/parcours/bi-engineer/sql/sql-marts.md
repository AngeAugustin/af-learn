---
title: "SQL des marts"
description: "Écrire le SELECT de fct_ventes, joindre magasin, jour et produit, et retirer les sous-requêtes que Nora recopiait."
duration: 65
objectives:
  - "Écrire le SELECT du mart au grain ligne de ticket"
  - "Joindre les dimensions sans y recopier le CA"
  - "Tenir des noms de colonnes qui survivront aux rapports"
  - "Remplacer les copies de staging par une somme de montant_ht_signe"
---

# Un SELECT qui est le mart

Le SQL du mart n'est pas une exploration sauvée dans un fichier. C'est le texte que toutes les revues partagent. Il produit `fct_ventes` : une ligne par `ligne_id`, déjà signée, déjà limitée aux magasins intégrés, hors ventes au personnel.

```sql
SELECT
  ligne_id,
  ticket_id,
  magasin_id,
  produit_id,
  jour,
  charge_le,
  montant_ht_signe,
  cout_ht_signe,
  montant_ht_signe - cout_ht_signe AS marge_ht,
  quantite
FROM int_ventes__perimetre;
```

On lit la phrase à voix haute. Le périmètre a déjà été tranché en amont : retours négatifs, personnel sorti, franchises absentes. Le mart ne refait pas ces `CASE`. Il publie les colonnes que l'on a le droit de sommer. `marge_ht` est la différence au même grain, donc additive. Le taux n'apparaît pas.

Le filtre de mars n'est pas dans ce `SELECT`. Le mart conserve l'historique. Mars 2026 est une question de Nora. Le mettre dans le `WHERE` du mart obligerait à réécrire la table chaque mois et effacerait le N-1.

> [!IMPORTANT]
> Un mart : un SELECT, le grain `ligne_id`, les noms du contrat. Toute page qui veut un autre périmètre demande une mesure, pas une copie du SELECT.

Avant de publier, vous comptez les `ligne_id` en entrée et en sortie. S'ils divergent, une jointure a multiplié ou perdu des tickets. Vous n'agrégez pas « pour voir ».

# Joindre les dimensions

Nora a besoin de la région et de la famille. Ces attributs ne se copient pas sur le ticket. Ils vivent dans `dim_magasin` et `dim_produit`. Le fait ne transporte que les clés, plus `ticket_id`, qui n'a pas de dimension : c'est l'identifiant du ticket, sans attribut propre.

```sql
SELECT
  mag.region,
  prod.famille,
  SUM(f.montant_ht_signe) AS ca_ht
FROM fct_ventes AS f
JOIN dim_magasin AS mag ON mag.magasin_id = f.magasin_id
JOIN dim_produit AS prod ON prod.produit_id = f.produit_id
JOIN dim_date AS d ON d.jour = f.jour
WHERE d.jour >= DATE '2026-03-01'
  AND d.jour <  DATE '2026-04-01'
GROUP BY mag.region, prod.famille;
```

Cette requête est une **lecture**. Elle donne les ventes par région et par famille, donc par le découpage magasin et produit que la revue demande. Elle n'est pas une seconde définition du CA. Si demain un magasin change de région dans la dimension, vous corrigez une ligne de dimension, pas des millions de tickets où le texte « Ouest » aurait été collé.

| Dimension | Clé | Ce que Nora filtre | Ce que le fait ne stocke pas |
|---|---|---|---|
| `dim_date` | `jour` | Mois, lundi de semaine | Le libellé « mars 2026 » répété |
| `dim_magasin` | `magasin_id` | Nom, région | « Nantes » sur chaque ticket |
| `dim_produit` | `produit_id` | Famille | Le libellé produit répété |

Pour un contrôle du CA certifié, partez du fait. Si un `magasin_id` n'a pas de ligne dans `dim_magasin`, un `INNER JOIN` fait disparaître son CA. Vous préférez une ligne « magasin inconnu » et un test qui compte son montant. Le total reste 6 240 000 € en mars, et l'orphelin est visible.

Vous ne joignez pas un budget mensuel sur `magasin_id` seul. Le budget n'est pas au grain du ticket. Chaque ligne de mars recevrait le budget du mois, et la somme exploserait. Deux grains se croisent après agrégation, au niveau commun. Le chapitre suivant le montre.

# Des noms qui ne bougent plus

| Nom | Promesse | Nom à refuser |
|---|---|---|
| `ligne_id` | Une ligne de ticket | `id`, `row_id` |
| `magasin_id` | Le magasin stable | `code`, `store` |
| `jour` | Le jour de vente | `date`, `jour_charge` |
| `produit_id` | Le produit stable | `sku_tmp` |
| `montant_ht_signe` | CA de la ligne, retours négatifs | `ca`, `ca_v3` |
| `marge_ht` | Différence au même grain | `taux` |
| `quantite` | Unités signées | `qte` |
| `charge_le` | Heure de dépôt, pas la vente | mélangé avec `jour` |

`jour` n'est pas `charge_le`. Un retour daté du 28 février peut être chargé dans la nuit du 16 mars. La fraîcheur regarde `charge_le`. Le CA de mars regarde `jour`. Les confondre décale le témoin.

Dans le modèle, le libellé vu par Nora est « CA HT ». La colonne reste `montant_ht_signe`. On ne traduit pas la colonne en `chiffre_affaires` au prochain sprint. Le métier est dans le libellé. La technique est dans le nom court.

> [!TIP]
> Nom stable : court, sans numéro de version, le même dans le mart et dans la mesure. La phrase longue vit dans la description.

# Sortir la logique des copies

Le symptôme est physique. Vous ouvrez le classeur de Nora, celui d'un régional, l'export du mois dernier. Trois blocs, presque identiques, lisent la caisse.

```sql
SELECT magasin_id, SUM(montant_ht) AS ca
FROM caisse.lignes
WHERE type_ligne = 'vente'
GROUP BY magasin_id;
```

Presque : le premier écarte les retours, le deuxième oublie le personnel, le troisième oublie les franchises. Les trois s'appellent CA. L'Ouest a trois totaux. Personne n'a mal calculé. Tout le monde a recalculé.

La réparation n'est pas une quatrième copie mieux commentée. Les rapports perdent le droit de lire `caisse.lignes` pour la revue. Ils somment `montant_ht_signe`.

```diagram
type: flow
title: De douze copies à fct_ventes
steps:
  - title: Repérer
    text: Trois SQL presque identiques sur la caisse
    tone: rose
  - title: Écrire
    text: Un fait au grain ligne_id, noms stables
    tone: violet
  - title: Contrôler
    text: Clé unique, mars à 6 240 000 €
    tone: blue
  - title: Brancher
    text: Les pages somment la mesure CA HT
    tone: teal
  - title: Retirer
    text: L'ancien filtre quitte les fichiers
    tone: amber
```

Une sous-requête reste légitime à l'intérieur du modèle, pour préparer un grain. Elle ne l'est plus dès qu'elle est collée dans un outil. Si Nora et un régional peuvent chacun modifier la copie, la logique n'est plus à vous.

Deux niveaux se lisent. Douze niveaux copiés depuis un chat ne se relisent pas à 7 h. Si vous ne pouvez pas dire la requête en quelques phrases, elle n'est pas prête. dbt rangera ce SQL plus tard. Le principe est déjà là : une étape, un nom, un grain.

# Ce que Nora a le droit d'écrire

Quand le mart est en place, la lecture devient courte. C'est le signe que vous avez fini.

```sql
SELECT
  magasin_id,
  jour,
  produit_id,
  SUM(montant_ht_signe) AS ca_ht
FROM fct_ventes
WHERE jour >= DATE '2026-03-01'
  AND jour <  DATE '2026-04-01'
GROUP BY magasin_id, jour, produit_id;
```

Elle obtient les ventes par magasin, par jour et par produit. Elle n'a plus le signe à poser, ni le personnel à exclure. Si cette requête ne suffit pas, il manque une dimension dans le modèle, et c'est à vous de l'ajouter. Ce n'est pas à elle d'enrichir le `FROM` avec la caisse « juste pour ce graphique ».

Le mart reste ennuyeux : peu de colonnes, des noms connus, aucun `CASE` de récit. Un `CASE` qui mettrait en avant un magasin « pour la phrase du lundi » n'entre pas ici. Le jour où un sixième rapport a besoin du CA, vous ne copiez pas le `SELECT`. Vous lui donnez la même mesure.

# Exercices

## Exercice 1 : La région collée sur le ticket

Un collègue ajoute `region` dans `fct_ventes` pour éviter une jointure. En avril, un magasin passe de l'Ouest au Nord dans la dimension. Les tickets de mars montrent encore Ouest. Que corrigez-vous ?

<details>
<summary>Voir la solution</summary>

Vous retirez `region` du fait. Nora joint `dim_magasin`, ou le modèle le fait. La région affichée est celle de la dimension, un seul endroit à corriger.

Vous ne réécrivez pas l'historique des textes copiés. Si un jour le métier veut la région telle qu'elle était en mars, c'est un historique de dimension, pas une colonne libre sur le ticket.

</details>

## Exercice 2 : Trois CA dans trois fichiers

Trois requêtes lisent `caisse.lignes`. L'une somme tout. L'autre ne garde que `type_ligne = 'vente'`. La troisième oublie `vente_interne`. Les trois alimentent un visuel titré CA HT. Quel geste unique les remplace ?

<details>
<summary>Voir la solution</summary>

Aucune des trois n'est le contrat. Le mart publie `montant_ht_signe` après signe des retours, hors personnel, hors franchises. La lecture somme cette colonne.

Vous rebranchez les trois fichiers sur la mesure CA HT. Mars doit retrouver 6 240 000 €, pas 6 480 000 €. Vous ne choisissez pas « la requête la plus proche » pour la garder.

</details>

## Exercice 3 : Mars figé dans le mart

Nora demande de mettre `jour >= DATE '2026-03-01' AND jour < DATE '2026-04-01'` dans le SQL qui construit `fct_ventes`, pour que la table soit « déjà prête ». Quel problème apparaît quand on voudra le N-1 ?

<details>
<summary>Voir la solution</summary>

La table ne contient plus que mars 2026. Mars 2025 a disparu, et le CA N-1 de 6 000 000 € ne se rejoue plus. Le mois suivant exigera une réécriture du `WHERE`.

Le filtre de période est une question de rapport. Le mart garde l'historique au grain `ligne_id`. La page applique les bornes. Vous ne rétrécissez pas la table à un mois.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: SQL des marts
center: "Un SELECT au grain du ticket. Nora somme montant_ht_signe par magasin, jour et produit."
points:
  - icon: code
    title: fct_ventes
    text: "ligne_id, clés, montants signés, marge_ht, quantite. Pas de filtre de mars dans la table."
  - icon: link
    title: Dimensions
    text: "Région et famille se joignent. Elles ne se recopient pas sur chaque ticket."
  - icon: file
    title: Noms stables
    text: "montant_ht_signe, jour, charge_le. Pas de ca_v3. Le jour de vente n'est pas l'heure de dépôt."
  - icon: loop
    title: Copies retirées
    text: "Trois requêtes presque pareilles sur caisse.lignes veulent dire que le mart n'est pas branché."
  - icon: chart
    title: Lecture courte
    text: "GROUP BY magasin, jour, produit. La page n'a plus le signe des retours à réécrire."
pitfall: "Coller la région dans le fait, ou figer mars dans le WHERE et perdre le N-1."
remember: "Nora somme la mesure. Elle ne lit plus la caisse, et elle ne garde pas sa propre copie du CASE."
```
