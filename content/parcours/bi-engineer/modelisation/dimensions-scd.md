---
title: "Dimensions et historique"
description: "Choisir SCD1 ou SCD2 pour le segment d'un magasin Halte, et voir ce que l'historique change dans le CA sans casser mars."
duration: 65
objectives:
  - "Distinguer une faute de libellé à écraser et un segment à historiser"
  - "Lire un SCD2 avec une clé technique, des dates et un indicateur courant"
  - "Dire ce que le rapport de mars attribue selon le type d'historique"
  - "Joindre la bonne version sans doubler 6 240 000 €"
---

# Le segment qui change

Nantes Atlantique, magasin de l'Ouest, était classé `peripherie`. Le 1er juillet 2026, le réseau le classe `urbain`. Les tickets n'ont pas bougé. Mars 2026 du réseau vaut toujours 6 240 000 €. Ce qui change, c'est la question posée au segment.

Deux questions se ressemblent et ne demandent pas la même dimension.

- **Où est le magasin maintenant ?** Après juillet, Nantes est urbain. Une revue qui appelle les urbains de la semaine en cours veut ce segment-là.
- **Quel segment était en vigueur quand le ticket a été vendu ?** Le CA de mars 2026 s'est fait pendant que Nantes était périphérie. Un bilan par segment sur l'année doit le savoir.

Le type 1 écrase. Le type 2 conserve les versions. Vous ne choisissez pas le type 2 « parce que c'est plus complet » pour une faute de frappe. Vous le choisissez si les deux questions sont réelles. Camille confirme que le segment sert bien à comparer des époques. Sinon vous écrasez, et vous le dites.

> [!IMPORTANT]
> Question d'abord : le rapport veut-il le segment d'aujourd'hui, ou le segment au jour du ticket ? Le type répond à cette phrase.

# SCD1, le passé réécrit

Le SCD1 ne garde qu'une ligne pour Nantes. Le 1er juillet, vous écrasez `peripherie` par `urbain`. Les tickets restent reliés par `magasin_id`.

| Période | CA du magasin | Segment lu après juillet, en SCD1 |
|---|---|---|
| Mars 2026 | 90 000 € | urbain |
| Octobre 2026 | 110 000 € | urbain |

Un rapport « CA par segment » relu en novembre attribue **200 000 € à urbain** pour ce magasin, et **0 € à périphérie**. Le réseau, lui, vaut toujours la somme des tickets. Le segment, non. Le type 1 réécrit le passé. C'est le bon choix quand la nouvelle valeur doit remplacer l'ancienne partout.

Chez Halte, le SCD1 convient à :

- une faute de nom corrigée sur toutes les années ;
- un code région saisi à l'envers le jour de l'ouverture, jamais vrai ;
- un libellé produit renommé, si la direction veut le nom d'aujourd'hui partout.

Il ne convient pas au segment, dès que l'on compare les urbains de l'automne aux urbains du printemps. Avec un SCD1, les 90 000 € de mars gonflent les urbains, et la périphérie semble avoir perdu un CA qui n'a pas migré vers un autre magasin. Le réseau n'a fait que changer une étiquette.

# SCD2, le passé conservé

Le SCD2 ajoute une version. Chaque version a une clé technique, `magasin_sk`, distincte de `magasin_id`.

| magasin_sk | magasin_id | segment | date_debut | date_fin | est_courant |
|---|---|---|---|---|---|
| 170 | M17 | peripherie | 2024-01-01 | 2026-06-30 | non |
| 171 | M17 | urbain | 2026-07-01 | 9999-12-31 | oui |

`date_fin` à `9999-12-31` marque la version ouverte. `est_courant` permet à la revue de ne voir que l'urbain d'aujourd'hui. Une seule ligne de M17 a `est_courant` à oui. Deux lignes courantes, et le CA du magasin double. Le réseau ne vaudrait plus 6 240 000 € en mars si la jointure recopiait les tickets.

Le fait porte `magasin_sk`, la version en vigueur le `jour` de la ligne. Mars pointe vers 170. Octobre pointe vers 171.

| Période | CA | magasin_sk | Segment |
|---|---|---|---|
| Mars 2026 | 90 000 € | 170 | peripherie |
| Octobre 2026 | 110 000 € | 171 | urbain |

La somme des segments pour ce magasin vaut 200 000 €. Rien n'a été perdu. Les 90 000 € ne sont pas devenus urbains. Le total réseau de mars ne change pas : vous avez réparti une étiquette, pas modifié `montant_ht_signe`.

```sql
SELECT
  d.segment,
  SUM(f.montant_ht_signe) AS ca_ht
FROM fct_ventes AS f
JOIN dim_magasin AS d ON d.magasin_sk = f.magasin_sk
WHERE f.jour >= DATE '2026-03-01'
  AND f.jour <  DATE '2026-04-01'
GROUP BY d.segment;
```

Cette jointure relie un ticket à une version. Elle ne relie pas un ticket à toutes les versions du même `magasin_id`.

```video
url: https://www.youtube.com/watch?v=LFoNaUVby9Q
title: "How to Track History in a Data Warehouse (Slowly Changing Dimensions)"
channel: "Kahan Data Solutions"
duration: "13:52"
lang: en
why: "Comment garder l'historique dans un entrepôt avec les dimensions à évolution lente, exemples à l'appui."
```

# Ce que l'historique change dans le rapport

Le CA réseau de mars reste 6 240 000 € dans les deux types. Le récit par segment, non.

**Avec SCD1**, la page « CA des urbains en mars » inclut les 90 000 € de Nantes. La périphérie maigrit d'autant. Un directeur croit à un basculement d'activité. C'est un basculement d'étiquette, appliqué au passé. L'Ouest de Marie, 1 560 000 €, ne bouge pas : Nantes était déjà dans l'Ouest. La région n'est pas le segment.

**Avec SCD2**, mars reste en périphérie pour ce magasin, octobre en urbain. La croissance des urbains ne vole pas mars. La page « qui est urbain cette semaine » filtre `est_courant`. Sinon Nantes apparaît deux fois, et une jointure naïve additionne ses tickets deux fois.

**Le nom du magasin** ne suit pas le SCD2. Versionner « Nantes Atlantique » pour une lettre corrigée laisserait la faute dans les vieux rapports et ferait croire à deux magasins. Le nom s'écrase sur toutes les versions. Le segment se versionne. Vous pouvez écraser le libellé des lignes 170 et 171 sans ouvrir une troisième version. Attribut par attribut. Camille valide cette liste. Nora ne choisit pas le type le lundi.

```diagram
type: compare
title: Nantes en mars selon l'historique
columns:
  - title: SCD1 segment
    tone: amber
    items:
      - "Une ligne, segment urbain"
      - "Les 90 000 € de mars deviennent urbains"
      - "La périphérie de mars disparaît"
  - title: SCD2 segment
    tone: teal
    items:
      - "170 périphérie, 171 urbain"
      - "Mars reste en périphérie"
      - "Le réseau reste 6 240 000 €"
  - title: Nom du magasin
    tone: violet
    items:
      - "La faute se corrige partout"
      - "Pas une version pour une lettre"
      - "SCD1 sur le libellé"
  - title: Revue
    tone: rose
    items:
      - "Segment courant pour qui appeler"
      - "Segment au ticket pour le bilan"
      - "Deux noms, pas un champ ambigu"
```

Vous publiez `segment_courant` et `segment_a_la_vente` si les deux questions existent. Un seul champ « Segment » finira dans une formule de page.

# Quelle version joindre

Joindre le SCD2 sur `magasin_id` seul double le CA. Nantes a deux lignes. Chaque ticket de mars sort deux fois. Le réseau dépasse 6 240 000 €. Le SQL ne prévient pas.

La forme stable : le fait porte `magasin_sk`, choisi au chargement selon `jour`. La lecture joint cette clé, et seulement elle. Changer une `date_fin` ensuite ne réattribue pas tout seul les tickets déjà chargés. Un rejeu explicite corrige une mauvaise version.

L'autre forme garde `magasin_id` et résout la version à la lecture.

```sql
SELECT d.segment, SUM(f.montant_ht_signe) AS ca_ht
FROM fct_ventes AS f
JOIN dim_magasin AS d
  ON d.magasin_id = f.magasin_id
 AND f.jour >= d.date_debut
 AND f.jour <= d.date_fin
GROUP BY d.segment;
```

Elle exige des périodes sans trou ni chevauchement. Vous testez, pour chaque magasin, qu'aucun `jour` de vente ne tombe dans deux versions, et qu'aucun ne tombe dans aucune. Un trou en juillet ferait disparaître le CA dans un `INNER JOIN`.

Pour le segment d'aujourd'hui, vous joignez `est_courant`, ou une vue à une ligne par `magasin_id`. Cette vue sert la revue. Elle ne sert pas le bilan de mars. Les deux chemins sont dans le modèle. Nora n'écrit pas la condition de dates dans chaque page.

> [!WARNING]
> Jointure SCD2 sur magasin_id seul : chaque version recopie le ticket. Mars ne vaut plus 6 240 000 €.

# Exercices

## Exercice 1 : Les urbains de mars

Camille compare le CA des urbains en mars 2026 et en octobre 2026. Nantes a fait 90 000 € en mars, alors en périphérie, et 110 000 € en octobre, en urbain. Un SCD1 est en place. Que voit-elle pour mars, et que faudrait-il pour que mars reste en périphérie ?

<details>
<summary>Voir la solution</summary>

Avec le SCD1, mars est relu comme urbain. Elle voit 90 000 € d'urbain en mars pour Nantes, puis 110 000 € en octobre. La périphérie de mars a disparu. Le réseau de mars, 6 240 000 €, n'a pas changé. Seule l'étiquette a bougé.

Pour garder mars en périphérie, il faut un SCD2 : le ticket de mars pointe vers `magasin_sk` 170. Octobre pointe vers 171. Le SCD1 ne peut pas répondre à cette question, même recalculé.

</details>

## Exercice 2 : Une lettre dans le nom

Le nom du magasin doit être corrigé sur tous les rapports, y compris mars 2025. Un collègue ouvre une version SCD2 datée d'aujourd'hui, pour ne rien écraser. Que faites-vous du nom, et que faites-vous du segment ?

<details>
<summary>Voir la solution</summary>

Le nom est une correction. Vous l'écrasez sur toutes les versions. Une version de plus laisserait la faute dans les vieux rapports.

Le segment reste historisé si le bilan compare des époques. Vous corrigez le nom des lignes 170 et 171 sans fermer la périphérie ni en ouvrir une troisième. Le nom s'écrase, le segment se versionne.

</details>

## Exercice 3 : Mars qui double

Après le SCD2, la somme de `montant_ht_signe` sur mars dépasse 6 240 000 €. La requête joint `dim_magasin` sur `magasin_id` seulement. Quel est le mécanisme, et quelle jointure rétablit le témoin ?

<details>
<summary>Voir la solution</summary>

Nantes a deux versions. La jointure sur `magasin_id` seul associe chaque ticket aux deux, et le `SUM` additionne les copies. Le témoin n'a qu'un CA.

Vous joignez `magasin_sk` porté par le fait, ou vous ajoutez `jour` entre `date_debut` et `date_fin`, sans trou ni chevauchement. Vous recontrôlez 6 240 000 € et l'Ouest à 1 560 000 €. Vous ne divisez pas le visuel par deux.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Dimensions et historique
center: "Le segment de Nantes se versionne. Le nom se corrige. La jointure ne double pas mars."
points:
  - icon: compass
    title: Deux questions
    text: "Segment d'aujourd'hui pour appeler les urbains. Segment au ticket pour le bilan de mars."
  - icon: loop
    title: SCD1
    text: "Une ligne écrasée. Les 90 000 € de mars deviennent urbains. Le réseau, lui, ne change pas."
  - icon: git
    title: SCD2
    text: "170 en périphérie, 171 en urbain. Mars reste sur 170. Octobre sur 171."
  - icon: key
    title: magasin_sk
    text: "Le fait porte la version du jour. Joindre seulement magasin_id recopie chaque ticket."
  - icon: chart
    title: Deux noms
    text: "segment_courant et segment_a_la_vente. Un seul champ Segment finit dans une page."
pitfall: "Ouvrir une version SCD2 pour une faute de nom, ou joindre magasin_id et doubler 6 240 000 €."
remember: "Historisez le segment si le bilan compare des époques. Écrasez le libellé. Joignez la version."
```
