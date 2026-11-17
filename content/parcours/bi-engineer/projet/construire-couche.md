---
title: "Construire la couche du mart"
description: "La liste des modèles dbt de Ventes Halte, les tests de clés et de réconciliation, le taux de marge dans la couche sémantique, et la règle qui limite Marie à l'Ouest."
duration: 45
objectives:
  - "Ordonner les modèles dbt de la caisse jusqu'au fait"
  - "Poser les tests minimaux, dont la réconciliation du mois témoin"
  - "Définir le taux de marge comme un ratio de deux sommes"
  - "Appliquer une sécurité par région et la vérifier avec trois identités"
---

# Les modèles, dans l'ordre

On construit de la source vers le fait. Chaque modèle a un grain écrit dans sa description. On ne saute pas du ticket brut à un taux.

| Modèle | Rôle | Grain |
| --- | --- | --- |
| `stg_caisse__lignes` | Lignes telles que la caisse les envoie, noms stables | Ligne de ticket |
| `stg_referentiel__magasins` | Magasin, région, type | Magasin |
| `stg_finance__ca_mois` | Fichier de contrôle, pas une mesure | Mois |
| `int_lignes_integrees` | Intégrés seulement, ventes au personnel retirées, retours conservés | Ligne de ticket |
| `dim_date` | Jour, mois, année | Jour |
| `dim_magasin` | Nom, région, type | Magasin |
| `dim_produit` | Produit, famille | Produit |
| `fct_ventes` | `montant_ht`, `cout_ht`, `quantite`, `charge_le` | Ligne de ticket |
| `ecarts_expliques` | Lignes nommées (15 000 €, 3 000 €) | Mois × motif |

`fct_ventes` pointe vers les trois dimensions. Il ne pointe pas vers un autre fait. L'écart finance n'est pas une colonne recopiée sur chaque ticket : il vit dans `ecarts_expliques`, au mois. `stg_finance__ca_mois` ne devient jamais la source du CA affiché. Sinon le mart répète la finance au lieu de la retrouver.

`int_lignes_integrees` est l'endroit du filtre, une seule fois : `type = integre`, ventes au personnel dehors, `est_retour` **non** filtré. Un filtre remis dans `fct_ventes` « par sécurité » est un deuxième endroit où le CA peut diverger.

```diagram
type: pipeline
title: "De la caisse au droit de Marie"
lanes:
  - title: "dbt"
    steps:
      - title: "Staging"
        text: "Lignes, magasins, contrôle finance"
        tone: violet
      - title: "Intégrés"
        text: "Un seul filtre, retours gardés"
        tone: blue
      - title: "Étoile"
        text: "dim_date, dim_magasin, dim_produit, fct_ventes"
        tone: teal
  - title: "Au-dessus"
    steps:
      - title: "Tests"
        text: "Clés, relations, reste de CA"
        tone: amber
      - title: "Sémantique"
        text: "Taux de marge en ratio, RLS région"
        tone: rose
```

# Les tests minimaux

Le minimum est ce qui, en cassant, rend le lundi faux. Pas un test par colonne « pour le score ».

**Clés, sévérité erreur.** `not_null` et `unique` sur `fct_ventes.ligne_id`, `dim_magasin.magasin_id`, `dim_produit.produit_id`, `dim_date.date_jour`.

**Relations, sévérité erreur.** Chaque `magasin_id`, `produit_id` et `date_jour` du fait existe dans sa dimension. Un ticket sans magasin ne se range pas dans une région « inconnue » silencieuse : le test casse.

**Valeurs admises.** `region` dans Nord, Est, Ouest, Sud. `type` dans `integre`, `franchise`. Le fait, lui, ne contient plus de franchise : un test peut compter les lignes franchise de `fct_ventes` et exiger zéro.

**Nulls de mesure.** `montant_ht` et `quantite` non nuls. `cout_ht` non nul : un coût vide ne devient pas zéro, il échoue, pour que la marge 2 184 000 € ne soit pas un trou recouvert.

**Réconciliation, sévérité erreur.** Le reste de mars dépasse 5 000 € ou 0,5 % : le build échoue. La formule compare `fct_ventes` à `stg_finance__ca_mois` moins `ecarts_expliques`. Elle ne compare pas le fait à lui-même.

Ces tests sont ceux que bi-ci n'a pas le droit d'ignorer. Un avertissement de volume peut s'ajouter plus tard. Il ne remplace pas `unique` sur `ligne_id`.

# Le taux de marge

La marge en euros est additive. Le **taux** ne l'est pas. On ne le stocke pas dans `fct_ventes` pour en faire la moyenne.

Le taux de marge est une mesure de la couche sémantique : somme de la marge divisée par somme du CA, **au grain de la question**. Sur le réseau, mars 2026 : 2 184 000 / 6 240 000 = **35 %**. Sur un magasin, c'est la marge de ce magasin divisée par le CA de ce magasin. Sur l'Ouest, ce sera la marge de l'Ouest sur le CA de l'Ouest, pas 35 % recopié du réseau, et pas la moyenne des taux des magasins de l'Ouest.

```yaml
metrics:
  - name: taux_marge
    label: "Taux de marge"
    type: ratio
    type_params:
      numerator: marge_eur
      denominator: ca_ht
    description: "Somme de la marge / somme du CA HT, au grain demandé."
```

`ca_ht`, `marge_eur`, `quantite` et `ca_n1` sont des sommes (ou, pour le N-1, la même somme décalée d'un an, mêmes filtres). Elles peuvent s'appuyer sur des colonnes du fait. `taux_marge` n'a pas de colonne. Si l'outil parle une autre syntaxe, la phrase du contrat reste celle-ci : un ratio de deux sommes, jamais une moyenne de ratios.

# La région de Marie

La sécurité est une règle du modèle, pas un filtre que Nora promet d'appliquer. Elle s'appelle souvent RLS (sécurité au niveau des lignes). Elle filtre `dim_magasin.region` selon l'identité.

| Identité | Règle | CA de mars attendu |
| --- | --- | --- |
| Direction | Aucun filtre de région | 6 240 000 € |
| Marie, rôle région, valeur Ouest | `region = Ouest` | 1 560 000 € |
| Compte sans région | Aucune ligne | Vide, pas le réseau |

Le rôle est une table d'identité (`utilisateur`, `role`, `region`), versionnée avec le modèle. Marie n'est pas un filtre codé en dur. Un nouveau responsable du Nord reçoit une ligne, pas un nouveau modèle.

Le test se fait **avec ces identités**, y compris à l'export. Le compte administrateur qui voit tout ne prouve rien : il contourne la règle par construction. On vérifie aussi qu'un filtre de page, un drill vers le produit, ou un export ne ramène pas le Nord dans la session de Marie. La règle est sur la dimension magasin, donc elle suit toutes les mesures qui passent par cette dimension, y compris le taux.

Un utilisateur direction ne « simule » pas Marie en changeant un segment. Le segment est un confort. La règle est un droit. Les deux peuvent coexister. Seule la règle empêche.

> [!WARNING]
> Une mesure qui ignore le filtre de région « pour montrer la part du réseau » montre le réseau à Marie. Si la direction veut cette part, c'est une mesure à part, nommée, acceptée. Le défaut est : Marie ne la voit pas.

# Le contrôle du mois témoin

Avant de dire la couche construite, Lina relit sept contrôles. Un seul raté arrête la certification.

1. CA HT réseau : 6 240 000 €.
2. Marge : 2 184 000 €. Taux : 35 %, obtenu par la mesure `taux_marge`, pas à la calculatrice collée dans un titre.
3. Quantité : 624 000.
4. CA N-1 : 6 000 000 €.
5. Ouest, identité de Marie : 1 560 000 €, et aucune autre région.
6. Reste de réconciliation : 0 €.
7. `charge_le` renseigné, promesse avant 7 h écrite sur la fiche.

Le contrôle 2 est celui qui attrape un taux stocké en colonne. Le contrôle 5 est celui qui attrape un filtre de page. Le contrôle 6 est celui qui attrape un extrait TTC ou un retour filtré. On les fait en recette, sur les vrais totaux, pas sur les quatre magasins fictifs du dev.

# Exercices

## Exercice 1 : Remettre les modèles dans l'ordre

Quelqu'un propose de calculer le taux dans `stg_caisse__lignes`, de joindre la finance directement dans `fct_ventes`, et de filtrer les franchises seulement dans le visuel. Réordonnez, et dites où chaque règle vit une seule fois.

<details>
<summary>Voir la solution</summary>

Ordre : staging caisse, magasins et finance de contrôle, puis `int_lignes_integrees` (intégrés, hors personnel, retours gardés), puis `dim_date`, `dim_magasin`, `dim_produit`, puis `fct_ventes`. `ecarts_expliques` reste au grain du mois.

Le taux n'est pas dans le staging : c'est `taux_marge`, ratio de sommes, dans la couche sémantique. La finance ne se joint pas au fait : elle sert le test de réconciliation. Le filtre franchise est dans `int_lignes_integrees`, pas dans le visuel. Un deuxième filtre dans le fait est un doublon à retirer.

</details>

## Exercice 2 : Le jeu de tests qui manque

Le projet a `not_null` sur `montant_ht` et rien d'autre. `ligne_id` peut être en double, un magasin peut manquer, le CA peut valoir 6 480 000 €, un coût vide compte comme zéro. Quels tests ajoutez-vous, et lesquels sont en erreur ?

<details>
<summary>Voir la solution</summary>

En erreur : `unique` et `not_null` sur `ligne_id`, `magasin_id`, `produit_id`, `date_jour`. Relations du fait vers les trois dimensions. `region` et `type` dans les valeurs admises. Zéro franchise dans `fct_ventes`. `quantite` et `cout_ht` non nuls (le coût vide ne vaut pas zéro). Test de réconciliation : reste au-dessus de 5 000 € ou de 0,5 % en erreur.

Le `not_null` de `montant_ht` reste. Il ne voit ni le doublon, ni le magasin orphelin, ni les retours filtrés, ni la marge trouée. Ces quatre-là sont le minimum qui manquait.

</details>

## Exercice 3 : 35 % et l'identité de Marie

Le réseau doit afficher 35 %. Un collègue moyenne les taux des 42 magasins et obtient autre chose. Marie, en changeant un segment, voit le Nord. Corrigez la mesure et la règle. Quels trois résultats d'identité notez-vous ?

<details>
<summary>Voir la solution</summary>

`taux_marge` = somme de la marge / somme du CA, au grain de la question. Réseau : 2 184 000 / 6 240 000 = 35 %. On retire la moyenne des taux magasins. Il n'y a pas de colonne de taux dans le fait.

Règle : direction sans filtre, rôle région sur `dim_magasin.region`, compte sans région sans ligne. Résultats de mars : direction 6 240 000 €, Marie 1 560 000 € et pas le Nord (ni en segment, ni en export), compte vide. Le test avec l'admin qui voit tout ne remplace pas celui de Marie.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Construire la couche
center: "Une étoile testée, un taux qui divise deux sommes, et Marie qui ne sort pas de l'Ouest."
points:
  - icon: layers
    title: Neuf modèles
    text: "Staging, intégrés, trois dimensions, fct_ventes, écarts au mois. Un filtre, un seul endroit."
  - icon: test
    title: Clés en erreur
    text: "unique, relations, coût non nul, reste de CA. Un not_null isolé ne voit pas le doublon."
  - icon: scale
    title: Taux 35 %
    text: "2 184 000 / 6 240 000 au grain demandé. Jamais la moyenne des magasins."
  - icon: lock
    title: Trois identités
    text: "Direction 6 240 000 €, Marie 1 560 000 €, compte sans région vide."
  - icon: shield
    title: Pas le segment
    text: "Le droit est sur dim_magasin. L'admin qui voit tout ne prouve pas la règle."
pitfall: "Joindre le 707 dans le fait et filtrer les franchises seulement dans le visuel. Le CA a alors deux définitions."
remember: "Le taux n'a pas de colonne. S'il en a une, le contrôle à 35 % doit encore passer par la mesure, pas par une moyenne."
```
