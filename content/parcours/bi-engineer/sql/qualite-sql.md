---
title: "Qualité du SQL"
description: "Rapprocher mars 2026 de la finance, tenir les bornes de dates, compter les magasins, et refuser un SQL que personne ne relit."
duration: 60
objectives:
  - "Retrouver 6 240 000 € et expliquer le pont avec le journal"
  - "Écrire les bornes de mars sans perdre le 31 ni prendre avril"
  - "Contrôler le volume des 42 magasins avant le badge"
  - "Relire le SQL à voix haute et refuser de publier si un seuil casse"
---

# Un total que la finance peut refaire

Un mart juste se reconnaît à un total que quelqu'un d'autre peut recomposer. Le témoin de mars 2026 est 6 240 000 €. Le journal ne part pas de ce nombre. Il part de 6 258 000 € HT, retire 15 000 € de retours datés du 2 avril et 3 000 € de ventes au personnel, et doit retomber sur 6 240 000 €. Reste attendu : 0 €.

```sql
WITH mart AS (
  SELECT SUM(montant_ht_signe) AS ca_ht
  FROM fct_ventes
  WHERE jour >= DATE '2026-03-01'
    AND jour <  DATE '2026-04-01'
),
finance AS (
  SELECT
    6258000 - 15000 - 3000 AS ca_ht
)
SELECT
  mart.ca_ht AS ca_mart,
  finance.ca_ht AS ca_finance,
  mart.ca_ht - finance.ca_ht AS ecart
FROM mart
CROSS JOIN finance;
```

Le seuil est 5 000 € **ou** 0,5 %. L'un des deux suffit à retirer le badge. Un écart de 4 000 € qui vaudrait 0,6 % ne passe pas. Un écart de 4 000 € sous 0,5 % passe, et il s'écrit quand même : montant, sens, période, cause, nom.

Vous ne vous arrêtez pas au réseau. L'Ouest doit rendre 1 560 000 €. Un total juste peut cacher un magasin trop haut et un autre trop bas. Vous triez les écarts par magasin quand le journal le permet. S'il ne le permet pas, le contrat le dit : le badge certifie le réseau, pas chaque magasin.

> [!IMPORTANT]
> Rapprochement : mêmes bornes, même périmètre, somme de montant_ht_signe contre le journal expliqué. Au-dessus du seuil, pas de badge.

Pas de `UPDATE` pour forcer le mart vers 6 240 000 €. Si des ventes au personnel sont restées, vous corrigez le filtre et vous recalculez. Si une nuit manque, le data engineer rejoue le dépôt. Le chiffre certifié est le résultat du calcul.

# Les bornes de mars

Mars 2026 va du 1er mars inclus au 1er avril exclu. Trente et un jours. `jour >= DATE '2026-03-01' AND jour < DATE '2026-04-01'` les décrit quand `jour` est une date. La même forme sur 2025 donne le N-1. Les deux intervalles ne se recouvrent pas.

| Filtre | Effet | Verdict |
|---|---|---|
| `>= 1er mars AND < 1er avril` | Les 31 jours | Borne du contrat |
| `BETWEEN` sur une date pure, du 1er au 31 | Les mêmes jours | Seulement si la colonne est une date |
| `BETWEEN` sur un horodatage jusqu'au 31 à minuit | Perd presque tout le 31 | À refuser |
| `< 31 mars` | S'arrête le 30 | Mois incomplet |
| `<= 1er avril` | Inclut le 1er avril | Mois trop long |

Le retour daté du 2 avril n'entre pas dans mars, même s'il est chargé plus tard. `jour` le place en avril. `charge_le` dit seulement quand le fichier est arrivé. Une page qui « rattache les retours au mois de chargement » change le témoin sans que Camille l'ait signé.

`dim_date` peut porter le mois de gestion. Vous vérifiez sur le 31 mars qu'il vaut bien mars 2026, avant d'en faire le filtre de la revue. Un 31 rattaché à avril vole un jour à la finance.

# Le volume des quarante-deux

Le total peut tomber juste un jour où un magasin manque et où un autre est compté deux fois, si les montants se compensent. Le volume voit ce que l'euro cache.

```sql
SELECT
  COUNT(*) AS nb_lignes,
  COUNT(DISTINCT magasin_id) AS nb_magasins,
  COUNT(DISTINCT produit_id) AS nb_produits,
  SUM(montant_ht_signe) AS ca_ht
FROM fct_ventes
WHERE jour >= DATE '2026-03-01'
  AND jour <  DATE '2026-04-01';
```

`nb_magasins` vaut 42, ou l'absence est nommée. En dessous, vous ne certifiez pas mars. `nb_lignes` se compare à mars 2025. Une chute de lignes avec un CA stable est suspecte. Une explosion de lignes avec un CA qui double rappelle la jointure.

Le test d'unicité complète le volume. Zéro `ligne_id` avec `COUNT(*) > 1`. Il échoue avant le rapprochement, parce qu'un doublon rend 6 240 000 € ininterprétable.

Ces seuils sont datés : 42, 5 000 €, 0,5 %, 7 h. Un seuil déplacé pour un lundi difficile est une rupture.

```diagram
type: flow
title: Le matin, avant le badge
steps:
  - title: Fraîcheur
    text: "charge_le a bougé avant 7 h"
    tone: violet
  - title: Clé
    text: "ligne_id unique, jointure sans copie"
    tone: blue
  - title: Volume
    text: "42 magasins, lignes plausibles"
    tone: teal
  - title: Argent
    text: "6 240 000 €, reste sous le seuil"
    tone: amber
  - title: Badge
    text: "Nora présente, ou le dernier jour certifié"
    tone: rose
```

> [!WARNING]
> Un CA proche du journal ne prouve pas que les 42 magasins sont là. Comptez-les. L'Ouest se contrôle à part, à 1 560 000 €.

# Une requête que l'on relit

Vous devez pouvoir lire le SQL à voix haute le jour où l'écart vaut 18 000 €. Une étape, un sujet. Les noms disent le grain. Pas de `SELECT *`. Pas de commentaire qui contredit le filtre.

```sql
WITH lignes AS (
  SELECT
    ligne_id,
    magasin_id,
    produit_id,
    jour,
    montant_ht_signe
  FROM fct_ventes
  WHERE jour >= DATE '2026-03-01'
    AND jour <  DATE '2026-04-01'
)
SELECT
  magasin_id,
  produit_id,
  SUM(montant_ht_signe) AS ca_ht
FROM lignes
GROUP BY magasin_id, produit_id;
```

`lignes` se prononce : les tickets de mars. La seconde étape : le CA par magasin et par produit. Quelqu'un qui ne connaît pas Halte voit où le mois est borné. Il ne cherche pas un `CASE` de retours au milieu d'une jointure de budget : ce `CASE` n'a plus sa place ici, il a déjà été appliqué en amont.

Vous refusez dans le SQL certifié : une copie du filtre personnel, un commentaire « hors retours » alors que les négatifs sont gardés, un `LIMIT` oublié qui changerait le total, une jointure dont personne ne peut dire le grain.

# Le refus de publier

Vous publiez mars quand `charge_le` est à l'heure, les 42 sont là, `ligne_id` est unique, le réseau vaut 6 240 000 €, l'Ouest 1 560 000 €, et le reste finance est sous les deux seuils. Nora reçoit l'heure réelle.

Vous ne publiez pas si un seul point casse. La page peut montrer le dernier jour certifié, avec la date écrite. Elle ne mélange pas « mars presque complet plus un estimé dans le même CA HT ». Un estimé est une autre mesure, un autre nom. Le glisser dans la somme pour que le graphique ait trente et une barres casse le témoin.

Le message à Nora tient en quatre lignes : période, ce qui manque, écart si vous l'avez, prochaine heure annoncée. Pas d'excuse sur Spark. Pas d'autre total calculé dans la précipitation.

# Exercices

## Exercice 1 : Le 31 mars perdu

Un contrôle personnel utilise `vendu_le BETWEEN TIMESTAMP '2026-03-01' AND TIMESTAMP '2026-03-31'`. Le mart somme `jour` du 1er mars inclus au 1er avril exclu. La finance trouve le mart au-dessus, surtout le 31. Qui a perdu la journée ?

<details>
<summary>Voir la solution</summary>

L'extraction s'arrête le 31 mars à minuit. Presque toutes les ventes du 31 sont après cette heure. Le mart a raison s'il inclut le jour civil du 31.

Vous refaites le contrôle avec une borne exclue au 1er avril, ou directement sur `jour`. Vous ne baissez pas le mart pour coller au `BETWEEN`. Le seuil se juge sur les bornes du contrat.

</details>

## Exercice 2 : Trente magasins

Mars a 30 magasins et un écart de 4 000 €, soit 0,06 %. Le seuil d'argent passe. Le réseau doit en compter 42. Nora demande le badge parce que l'euro est proche. Que décidez-vous ?

<details>
<summary>Voir la solution</summary>

Vous ne certifiez pas. Le volume a son propre seuil. 30 magasins au lieu de 42 disent qu'il manque une partie du réseau. L'écart de 4 000 € ne couvre pas l'absence.

Vous ouvrez l'incident avec les `magasin_id` manquants. Le data engineer vérifie le dépôt. Le badge attend le volume, pas seulement l'euro.

</details>

## Exercice 3 : Le commentaire menteur

Le modèle contient le commentaire « CA hors retours » et somme `montant_ht_signe`, qui garde les négatifs. Le total colle à 6 240 000 €. Un nouvel arrivant veut « corriger le SQL pour respecter le commentaire ». Que gardez-vous ?

<details>
<summary>Voir la solution</summary>

Vous gardez le SQL. Les retours restent, déjà négatifs. Vous corrigez le commentaire, qui contredit le code et le témoin.

Changer le filtre pour obéir au commentaire afficherait 6 480 000 € et casserait les pages déjà certifiées. La source de vérité est le contrat, puis le code. Un commentaire n'a pas le droit de les contredire.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Qualité du SQL
center: "Mars à 6 240 000 €, 42 magasins, bornes justes. Sinon Nora présente le dernier jour certifié."
points:
  - icon: scale
    title: Pont finance
    text: "6 258 000 moins 15 000 moins 3 000. Reste au-dessus de 5 000 € ou de 0,5 % : pas de badge."
  - icon: filter
    title: Bornes de mars
    text: "Du 1er inclus au 1er avril exclu. Un BETWEEN sur un horodatage perd le 31 après minuit."
  - icon: gauge
    title: Quarante-deux
    text: "Compte des magasins à part de l'euro. L'Ouest se revérifie à 1 560 000 €."
  - icon: code
    title: À voix haute
    text: "Une étape, un grain. Pas de commentaire qui dit hors retours alors que les négatifs restent."
  - icon: shield
    title: Refus
    text: "Un jour manquant ne s'estime pas dans CA HT. Le dernier jour certifié reste le chiffre."
pitfall: "Accorder le badge parce que l'écart en euros passe, alors que mars n'a que 30 magasins sur 42."
remember: "Contrôlez l'argent, les bornes et le volume. Publiez seulement quand les trois tiennent."
```
