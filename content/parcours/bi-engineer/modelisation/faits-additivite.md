---
title: "Additivité des faits"
description: "Sommer le CA de Halte, refuser de sommer un stock dans le temps, et calculer le taux de marge après la somme, à 35 % en mars."
duration: 60
objectives:
  - "Sommer CA, marge et quantité sur le magasin, le jour et le produit"
  - "Traiter un stock comme une mesure semi-additive, hors de fct_ventes"
  - "Refuser la moyenne des taux qui ne donne pas 35 %"
  - "Placer le taux dans la mesure, après SUM, au niveau affiché"
---

# Additive, le CA se somme

Une mesure est **additive** quand la somme a un sens sur le magasin, le jour et le produit. Chez Halte, `montant_ht_signe`, `cout_ht_signe`, `marge_ht` et `quantite` le sont, au grain de la ligne de ticket.

Mars 2026 est la preuve. La somme des lignes vaut **6 240 000 €**. La somme des magasins vaut le même nombre. La somme des jours de mars aussi. La somme des produits aussi. L'Ouest, 1 560 000 €, est la somme de ses magasins, et ces magasins sont une partie des 6 240 000 €. La somme des parties égale le tout. C'est pour cela que Nora peut grouper par magasin, par jour ou par produit sans réécrire la formule.

`marge_ht` suit le même contrat, parce que le coût est au même grain et au même périmètre. La somme des marges de mars vaut **2 184 000 €**. Un coût manquant n'est pas un zéro silencieux : la ligne est en erreur, sinon la marge ne serait plus la différence de deux additifs.

| Mesure | Somme magasins | Somme jours | Somme produits |
|---|---|---|---|
| `montant_ht_signe` | Oui | Oui | Oui |
| `marge_ht` | Oui | Oui | Oui |
| `quantite` | Oui | Oui | Oui |
| Taux de marge | Non | Non | Non |

Retirer les retours casse l'additivité du contrat : vous n'additionnez plus les mêmes lignes, et mars passe à 6 480 000 €. Le témoin dit que cette somme-là n'est pas le CA HT.

> [!NOTE]
> Additif : on additionne sur le magasin, le jour et le produit. Le CA HT de mars est dans ce cas. Le taux ne l'est pas.

# Semi-additive, le stock

Une mesure est **semi-additive** quand la somme a un sens sur certaines dimensions seulement. Le stock de fin de journée s'additionne entre magasins et entre produits, à une date donnée. Il ne s'additionne pas entre les dates.

Un produit, un magasin, trois soirs : 40, puis 36, puis 50 unités. La somme vaut 126. Personne n'a 126 unités. Le stock en fin de période est **50**, le dernier soir. Deux magasins le même soir, 50 et 20, font 70. Cette somme-là est juste.

La quantité vendue est un flux. `quantite` dans `fct_ventes` s'additionne, y compris dans le temps : 624 000 sur mars. La quantité en rayon est un niveau. Le même mot « quantité » ne les rend pas interchangeables. Le contrat de Halte ne publie pas de stock. Le coller dans `fct_ventes` inviterait Nora à sommer sept soirs « pour la semaine », ou à mélanger un niveau et des ventes.

Si un jour un fait de stock existe, la colonne s'appelle `quantite_fin`, le libellé dit « stock de fin de période », et la mesure prend la dernière date encore visible dans le filtre. Elle ne fait pas `SUM` sur les jours. Vous ne l'implémentez pas dans ce mart. Vous savez déjà refuser la demande floue « ajoute la quantité » tant que flux ou niveau n'est pas dit.

# Non additive, le taux

Une mesure est **non additive** quand la somme n'a de sens sur aucune dimension. Il faut la recalculer après coup, au niveau affiché.

En mars, la marge est 2 184 000 € et le CA 6 240 000 €. Le taux du réseau est **35 %**. Ce n'est pas la moyenne des taux des quarante-deux magasins. Un petit magasin à 40 % et un gros à 10 % n'ont pas le même poids.

Deux magasins pris à part, pour voir le piège :

| Magasin | CA HT | Marge | Taux |
|---|---|---|---|
| Un petit | 1 000 € | 400 € | 40 % |
| Un gros | 10 000 € | 1 000 € | 10 % |

La moyenne des taux vaut 25 %. Le taux des deux vaut 1 400 / 11 000, soit **12,7 %**. La direction qui pilote à 25 % parle d'une marge que ces deux magasins n'ont pas eue. Le réseau, lui, se juge à 35 %, pas à cette moyenne locale.

```diagram
type: compare
title: Trois familles sur les ventes Halte
columns:
  - title: Additive
    tone: teal
    items:
      - "CA, marge €, quantité vendue"
      - "Mars : 6 240 000 € et 2 184 000 €"
      - "Se somme par magasin, jour, produit"
  - title: Semi-additive
    tone: amber
    items:
      - "Stock de fin de journée"
      - "Somme entre magasins, pas entre dates"
      - "Hors de fct_ventes"
  - title: Non additive
    tone: rose
    items:
      - "Taux de marge"
      - "35 % après les sommes, pas une moyenne"
      - "Se recalcule au niveau affiché"
```

```video
url: https://www.youtube.com/watch?v=y8evr2enCVk
title: "Additive | Semi-Additive | Non-Additive | Types of Facts |Data Warehouse Concepts | Tutorial"
channel: "House of Concepts"
duration: "8:22"
lang: en
why: "Faits additifs, semi-additifs et non additifs présentés avec des exemples, exactement les trois cas de ce chapitre."
```

# Où calculer le taux

Le taux se calcule dans la **mesure**, après l'agrégation, au niveau du visuel. Pas dans le fait. Pas dans un `AVG` de taux déjà arrondis.

```sql
SELECT
  mag.region,
  SUM(f.marge_ht) AS marge_ht,
  SUM(f.montant_ht_signe) AS ca_ht,
  SUM(f.marge_ht) / NULLIF(SUM(f.montant_ht_signe), 0) AS taux_marge
FROM fct_ventes AS f
JOIN dim_magasin AS mag ON mag.magasin_id = f.magasin_id
WHERE f.jour >= DATE '2026-03-01'
  AND f.jour <  DATE '2026-04-01'
GROUP BY mag.region;
```

`NULLIF` évite une division par zéro si un filtre annule le CA. Un taux à 0 à la place d'un CA nul est un mensonge. La mesure renvoie vide.

Cette requête est la forme de la mesure. Si vous la matérialisez par magasin, Nora n'a plus le droit de moyenner les taux stockés quand elle additionne deux régions. Elle doit re-sommer marge et CA. Autant ne pas stocker le taux. Au niveau réseau, la même mesure donne 35 %. Au niveau des deux magasins de l'exemple, 12,7 %. Au niveau d'une seule ligne, elle retombe sur le taux de la ligne, ce qui est juste, parce que les deux sommes n'ont qu'un terme.

L'endroit, chez Halte :

- `fct_ventes` porte `montant_ht_signe` et `marge_ht` ;
- la couche sémantique porte « Taux de marge », somme des marges divisée par somme des CA ;
- la page pose la mesure à côté de Région ou de Magasin, sans formule locale ;
- un export obtient le taux par cette mesure, pas par une colonne moyenne.

Nora peut dire qu'un magasin est à 40 % et le réseau à 35 %. Elle ne remplace pas le second par la moyenne des quarante-deux.

> [!IMPORTANT]
> Le taux se calcule après la somme, dans la mesure, au niveau affiché. Une colonne de taux dans le fait sera moyennée, et le 25 % chassera le 35 %.

# Ce que le fait a le droit de stocker

`fct_ventes` stocke des additifs de la ligne, et les clés. `marge_ht` oui. `taux_marge` non. `quantite` vendue oui. `quantite_fin` non. Un rang, une part de région, un cumul de mois : non, pas sur le ticket.

La page du lundi peut montrer, sans formule cachée : le CA HT (additif, sommé par magasin, jour ou produit), la marge en euros (additive), le taux (recalculé, 35 % sur mars). Le stock n'est pas au menu. S'il le devient, ce sera un autre fait et une mesure qui prend le dernier soir, pas une colonne de plus dans les tickets.

Le contrôle reste le témoin. Somme du CA : 6 240 000 €. Somme de la marge : 2 184 000 €. Quotient : 35 %. Si un visuel affiche une autre moyenne, il n'utilise pas la mesure.

# Exercices

## Exercice 1 : 25 % ou 35 %

La page moyenne les taux des magasins et n'affiche pas 35 %. Deux magasins d'essai, 40 % et 10 %, donnent 25 % en moyenne simple, pour 1 000 € et 10 000 € de CA. Quel taux publiez-vous pour ces deux magasins, et quel taux pour le réseau en mars ?

<details>
<summary>Voir la solution</summary>

Pour les deux magasins, 12,7 % : 1 400 € de marge sur 11 000 € de CA. La moyenne 25 % donne le même poids au petit et au gros.

Pour le réseau en mars, 35 % : 2 184 000 / 6 240 000. Ce n'est pas la moyenne des 42 taux. La mesure « Taux de marge » fait le quotient au niveau affiché. Vous retirez la moyenne de colonnes.

</details>

## Exercice 2 : 126 unités

Nora somme 40, 36 et 50 sur trois soirs et titre « stock de la période ». Elle lit 126. Que vaut le stock en fin de période, et pourquoi cette colonne n'est-elle pas dans `fct_ventes` ?

<details>
<summary>Voir la solution</summary>

Le stock de fin de période est 50, le dernier soir, pas 126. Le stock s'additionne entre magasins le même soir, pas entre les soirs.

`fct_ventes` porte la quantité vendue, additive, 624 000 en mars. Un niveau de rayon n'y entre pas. Le contrat ne publie pas de stock. S'il le fallait, ce serait un autre fait, et une mesure qui prend la dernière date du filtre.

</details>

## Exercice 3 : Le taux dans le fait

Un collègue ajoute `taux_marge` sur chaque ligne, pour que Nora n'ait pas de division à écrire. Que se passe-t-il quand elle moyenne cette colonne sur le réseau, et que devez-vous publier à la place ?

<details>
<summary>Voir la solution</summary>

La moyenne des taux de lignes ne vaut pas 35 %. Les petites lignes pèsent autant que les grosses. Mars ne se reconnaît plus.

Vous ne stockez pas la colonne. La mesure divise `SUM(marge_ht)` par `SUM(montant_ht_signe)` dans le filtre de la page. Au réseau, elle rend 35 %. Au magasin, elle rend le taux du magasin. Nora pose la mesure. Elle n'écrit pas la division, et elle ne moyenne pas un taux.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Additivité des faits
center: "Le CA de mars s'additionne. Le stock ne s'additionne pas dans le temps. Le taux se recalcule."
points:
  - icon: money
    title: Additif
    text: "6 240 000 € de CA, 2 184 000 € de marge, 624 000 unités. La somme des magasins est le réseau."
  - icon: clock
    title: Stock
    text: "40, 36 puis 50 ne font pas 126. On lit le dernier soir. Ce niveau n'est pas dans fct_ventes."
  - icon: gauge
    title: 35 pour cent
    text: "2 184 000 sur 6 240 000. La moyenne d'un 40 % et d'un 10 % vaut 25 %, pas le vrai taux."
  - icon: layers
    title: Dans la mesure
    text: "Le taux se calcule après SUM, au niveau affiché. NULLIF protège un CA à zéro."
  - icon: database
    title: Dans le fait
    text: "Montants et quantité vendue. Pas de colonne de taux, pas de stock, pas de rang sur le ticket."
pitfall: "Stocker le taux sur la ligne, puis laisser la page le moyenner à la place des 35 % de mars."
remember: "Stockez des montants sommables. Calculez le taux au niveau affiché, dans la mesure, jamais en moyenne."
```
