---
title: "Fenêtres pour la BI"
description: "Préparer une variation, un rang ou une somme cumulée seulement quand toutes les pages de Halte veulent le même nombre."
duration: 70
objectives:
  - "Décider si une fenêtre appartient au mart ou à la mesure"
  - "Calculer l'écart de mars contre mars 2025 sans LAG sur les tickets"
  - "Nommer un rang réseau qui ne se fait pas passer pour un rang Ouest"
  - "Écrire un SUM OVER sans le sommer une seconde fois dans la page"
---

# Quand la fenêtre entre dans le mart

`LAG`, `RANK` et `SUM() OVER` regardent plusieurs lignes sans les réduire à une seule. Nora s'en sert presque chaque lundi : l'Ouest a-t-il monté, où se classe un magasin, où en est le mois.

Le piège est de les coller sur `fct_ventes` parce que le SQL sait les faire. Une fenêtre figée ne réagit plus aux filtres. Marie ne voit que l'Ouest. Un rang calculé sur les quarante-deux magasins reste un rang réseau. Il ne devient pas le rang dans sa région. Parfois c'est voulu. Souvent c'est un chiffre faux à côté d'un filtre honnête.

```diagram
type: decision
title: Cette fenêtre va-t-elle dans le mart ?
nodes:
  - question: "Toutes les pages veulent-elles le même nombre, sur le même grain, sans suivre le filtre ?"
    yes: "Vous le calculez, vous le nommez, vous écrivez le périmètre figé."
    no: "Vous laissez les montants dans fct_ventes. La mesure recalcule selon le filtre."
  - question: "Le calcul est-il déjà agrégé au magasin et au mois, plutôt que posé sur les tickets ?"
    yes: "Vous pouvez fenêtrer cet agrégat, avec un nom qui dit le périmètre."
    no: "Agrégéz d'abord. LAG sur les tickets ne compare pas deux mois."
```

Vous mettez dans un mart étroit ce qui est partagé et figé. Vous laissez dans la mesure ce qui doit suivre la région, le magasin ou le produit que Nora vient de choisir.

> [!IMPORTANT]
> Fenêtre dans le mart : le nombre est le même pour toutes les pages. Fenêtre dans la mesure : le nombre suit le filtre.

# L'écart contre mars 2025

La variation officielle n'est pas la ligne d'avant. C'est le CA de mars 2026 contre le CA de mars 2025, même règle, mêmes exclusions. Les témoins sont 6 240 000 € et 6 000 000 €. L'écart réseau est +240 000 €. Ce n'est pas l'écart finance.

`LAG` sur `fct_ventes` ne fait pas ce calcul. Ordonner les tickets par `jour` lit la ligne précédente du même magasin, souvent le ticket d'avant, pas mars 2025. Si un jour n'a pas de vente, `LAG` saute au jour présent d'avant. Vous appelleriez cela « veille » à tort.

La forme juste agrège d'abord, puis compare deux périodes explicites.

```sql
WITH mois AS (
  SELECT
    magasin_id,
    SUM(montant_ht_signe) AS ca_ht
  FROM fct_ventes
  WHERE jour >= DATE '2026-03-01'
    AND jour <  DATE '2026-04-01'
  GROUP BY magasin_id
),
n1 AS (
  SELECT
    magasin_id,
    SUM(montant_ht_signe) AS ca_n1
  FROM fct_ventes
  WHERE jour >= DATE '2025-03-01'
    AND jour <  DATE '2025-04-01'
  GROUP BY magasin_id
)
SELECT
  mois.magasin_id,
  mois.ca_ht,
  n1.ca_n1,
  mois.ca_ht - n1.ca_n1 AS ecart_eur
FROM mois
LEFT JOIN n1 ON n1.magasin_id = mois.magasin_id;
```

L'écart en pourcentage est un taux. Vous ne le stockez pas pour le moyenner. La mesure divise, au niveau affiché. Le réseau n'est pas la moyenne des écarts magasin. Si toutes les pages ont besoin des deux montants en euros au grain magasin et mois, vous pouvez les publier dans une table étroite, dérivée de `fct_ventes`, qui doit retrouver 6 240 000 € et 6 000 000 €. Vous ne gonflez pas chaque ticket avec une colonne « mars dernier ».

# Le rang de magasin

Le rang répond à : dans quel ordre se classent les magasins sur le CA de mars 2026. `RANK` donne le même rang à deux magasins à égalité et saute le suivant. Vous le choisissez, et vous l'écrivez. Nora ne le découvre pas en revue.

```sql
SELECT
  magasin_id,
  SUM(montant_ht_signe) AS ca_ht,
  RANK() OVER (ORDER BY SUM(montant_ht_signe) DESC) AS rang_reseau
FROM fct_ventes
WHERE jour >= DATE '2026-03-01'
  AND jour <  DATE '2026-04-01'
GROUP BY magasin_id;
```

`rang_reseau` est honnête : les quarante-deux magasins, pas la région que Marie filtrera. Un magasin peut être 6e du réseau et 1er de l'Ouest. Si la page filtre l'Ouest et affiche encore 6, le lecteur croit à un rang régional.

| Besoin | Où le calculer | Nom |
|---|---|---|
| Classement des 42, identique partout | Table au grain magasin et mois | `rang_reseau` |
| Classement dans la région filtrée | Mesure, à la lecture | Rang dans la sélection |
| Classement d'un produit | Mesure, sauf écran unique et figé | Selon le grain |

Vous ne copiez pas `rang_reseau` sur chaque ligne de ticket. Le sommer n'a aucun sens. S'il est matérialisé, sa table a une ligne par magasin et par mois. La page le joint. Elle ne l'additionne pas.

```video
url: https://www.youtube.com/watch?v=rIcB4zMYMas
title: "SQL Window Functions | Clearly Explained | PARTITION BY, ORDER BY, ROW_NUMBER, RANK, DENSE_RANK"
channel: "Maven Analytics"
duration: "7:52"
lang: en
why: "Les fonctions de fenêtrage SQL (PARTITION BY, ORDER BY, ROW_NUMBER, RANK) expliquées avec des schémas clairs."
```

# La somme cumulée

`SUM() OVER` sert pour un cumul du mois au grain magasin, quand toutes les pages l'affichent tel quel. Au grain du ticket, le cumul se mélange à l'ordre des lignes du même jour. Vous agrégez d'abord par magasin et par jour.

```sql
WITH par_jour AS (
  SELECT
    magasin_id,
    jour,
    SUM(montant_ht_signe) AS ca_ht
  FROM fct_ventes
  GROUP BY magasin_id, jour
)
SELECT
  magasin_id,
  jour,
  ca_ht,
  SUM(ca_ht) OVER (
    PARTITION BY magasin_id, DATE_TRUNC('month', jour)
    ORDER BY jour
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS ca_ht_cumul_mois
FROM par_jour;
```

Ce cumul est faux dès que Nora filtre du 1er au 15 et s'attend à ce que la colonne se recalcule. La colonne a été calculée sur le mois entier. Le filtre masque des lignes, il ne refait pas la fenêtre. Pour la revue, la somme de `montant_ht_signe` entre deux bornes suffit presque toujours. Le cumul est alors une tentation, pas un besoin.

> [!WARNING]
> Une fenêtre stockée ne se recalcule pas quand Nora filtre. Sommer une colonne déjà cumulée additionne des cumuls, pas des ventes.

# Ce qui reste une mesure

**Le rang dans le filtre.** Région, famille, produit : le périmètre n'est pas connu la nuit. La mesure classe ce qui est encore visible. Le mart fournit les montants.

**Le taux d'évolution.** `(ca_ht - ca_n1) / ca_n1` dépend du niveau. Le taux de l'Ouest n'est pas la moyenne des taux de ses magasins. Vous gardez les deux montants. La division est une mesure. Au réseau, 240 000 / 6 000 000.

**La part du magasin dans la sélection.** Elle change si un magasin est retiré. Elle ne se fige pas sur le ticket.

`fct_ventes` reste le fait des lignes. Les fenêtres partagées vivent à côté, au grain de la fenêtre, avec un nom qui dit le périmètre. Nora n'écrit pas le `OVER`. Elle n'écrit pas non plus un `LAG` local qui appelle « mois précédent » la dernière ligne trouvée.

# Exercices

## Exercice 1 : Le 6 qui devait être un 1

Nora filtre l'Ouest. Le visuel montre un magasin avec `rang_reseau` égal à 6. Elle s'attendait à 1, parce que ce magasin mène l'Ouest en mars. Le SQL n'a pas d'erreur. Que s'est-il passé ?

<details>
<summary>Voir la solution</summary>

`rang_reseau` a été calculé sur les quarante-deux magasins, puis figé. Le filtre Ouest masque des lignes. Il ne refait pas le classement. Les deux nombres sont vrais. Ils ne portent pas le même nom.

Vous gardez `rang_reseau` pour le classement national, avec ce libellé. Pour le rang dans l'Ouest, vous publiez une mesure qui classe les magasins encore filtrés. Vous ne remplacez pas silencieusement une colonne par l'autre.

</details>

## Exercice 2 : LAG sur les tickets

Un SQL fait `LAG(montant_ht_signe)` sur `fct_ventes`, partition magasin, ordre `jour`. Nora titre la colonne « CA de mars 2025 ». Les valeurs sont des montants de tickets de mars 2026. Pourquoi, et quelle forme retrouve les 6 000 000 € ?

<details>
<summary>Voir la solution</summary>

`LAG` a lu la ligne de ticket précédente, pas le mois de mars 2025. Le titre est faux. Le grain est faux.

Le N-1 est la somme de `montant_ht_signe` sur `jour` du 1er mars 2025 inclus au 1er avril 2025 exclu, mêmes exclusions. Le réseau doit rendre 6 000 000 €. Vous le calculez après agrégat, dans la mesure CA N-1, pas avec une fenêtre sur les tickets.

</details>

## Exercice 3 : Le cumul sommé

Vous avez stocké `ca_ht_cumul_mois` par magasin et par jour. Nora additionne cette colonne du 1er au 31 mars pour « savoir où en est le mois ». Le total dépasse largement 6 240 000 €. Pourquoi, et que doit-elle utiliser ?

<details>
<summary>Voir la solution</summary>

Chaque valeur est déjà une somme depuis le 1er mars. Les additionner additionne des cumuls. Le 31 contient déjà le mois. Le total des cumuls n'est pas le CA.

Nora somme `montant_ht_signe` entre les bornes. Le réseau sur mars entier vaut 6 240 000 €. Vous retirez la tentation de sommer la colonne cumulée, ou vous ne la publiez que si aucune page ne l'additionne.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Fenêtres pour la BI
center: "Une fenêtre n'entre au mart que si toutes les pages veulent le même nombre figé."
points:
  - icon: scale
    title: Mart ou mesure
    text: "Périmètre figé : colonne nommée. Périmètre qui suit le filtre de Nora : mesure."
  - icon: clock
    title: Mars contre mars
    text: "N-1 vaut 6 000 000 €. LAG sur les tickets lit la ligne d'avant, pas mars 2025."
  - icon: chart
    title: Rang réseau
    text: "RANK sur les 42 s'appelle rang_reseau. Le rang Ouest se recalcule dans le filtre."
  - icon: money
    title: Cumul
    text: "SUM OVER additionne les jours. Sommer ensuite la colonne additionne des cumuls."
  - icon: database
    title: Grain étroit
    text: "Le rang vit au magasin et au mois. Il ne se recopie pas sur chaque ticket."
pitfall: "Figer un rang réseau puis laisser le filtre Ouest faire croire que 6 veut dire premier de région."
remember: "Laissez les montants dans fct_ventes. N'ajoutez une fenêtre que si son périmètre est dans son nom."
```
