---
title: "Grain et agrégats"
description: "Dire ce qu'est une ligne de fct_ventes, éviter le doublon de jointure, et agréger au niveau magasin, jour ou produit avant le rapport."
duration: 65
objectives:
  - "Dire qu'une ligne est un ligne_id, relié à un jour, un magasin, un produit"
  - "Repérer une jointure qui multiplie le CA sans message d'erreur"
  - "Agréger au niveau de la question avant de croiser un autre grain"
  - "Laisser la page sommer CA, marge et quantité, pas un taux"
---

# Une ligne égale un ticket

Le grain n'est pas une intention. Si vous montrez une ligne au hasard, qu'est-ce qui est vrai exactement une fois ?

Dans `fct_ventes`, une ligne est un `ligne_id`. Elle a un `ticket_id`, un `magasin_id`, un `produit_id`, un `jour`, des montants signés, une quantité. Elle ne dit pas le CA de l'Ouest. Elle ne dit pas le taux de marge. Elle dit ce ticket-là.

La revue, elle, demande les ventes **par magasin, par jour et par produit**. Ce n'est pas un autre stockage. C'est un `GROUP BY` sur des lignes qui portent déjà ces trois clés. Plusieurs lignes du même produit, le même jour, dans le même magasin, s'additionnent. Le ticket reste disponible en dessous, parce que vous ne l'avez pas jeté.

| Question de Nora | Opération juste | Ce qui mentirait |
|---|---|---|
| CA d'une ligne | La ligne elle-même | Une somme de copies |
| CA d'un magasin en mars | `SUM` des lignes du magasin | Une table magasin-mois à la place du fait |
| CA par magasin, jour, produit | `GROUP BY` de ces trois clés | Un taux moyen collé sur le groupe |
| CA de l'Ouest | `SUM` après jointure région | Un CA copié sur chaque famille |

Le piège inverse est de stocker déjà le magasin-mois parce que la phrase du directeur dit « par magasin ». On ne pourrait plus expliquer un jour, ni rejouer la quantité, ni changer d'avis sur un filtre. Le grain le plus fin partagé par les questions récurrentes, ici, est la ligne de ticket. Magasin, jour et produit sont les niveaux d'agrégat.

> [!IMPORTANT]
> Phrase de grain : une ligne, un ligne_id. La question « par magasin, jour, produit » est une somme. Si la phrase contient « en général », le grain n'est pas tenu.

```video
url: https://www.youtube.com/watch?v=FvFvjUqu8Gs
title: "Data Modeling  Grain Explained | #Power BI Course 23"
channel: "Data with Baraa"
duration: "7:03"
lang: en
why: "Le grain d'une table de faits expliqué simplement : ce qu'une ligne représente, et pourquoi tout le reste en dépend."
```

# Le doublon de jointure

Le CA double rarement à cause d'une addition. Il double parce qu'une jointure répète la ligne, et que le `SUM` additionne les copies. Le moteur a fait ce qu'on lui a dit. Aucune erreur.

`dim_magasin` a deux lignes pour le même `magasin_id`, parce qu'un chargement a ajouté la région sans retirer l'ancienne. Vous joignez sur `magasin_id` seul. Chaque ticket sort deux fois. Mars, qui devait valoir 6 240 000 €, se rapproche de 12 480 000 €. Le nom de la mesure dit encore CA HT.

```sql
SELECT magasin_id, COUNT(*) AS nb
FROM dim_magasin
GROUP BY magasin_id
HAVING COUNT(*) > 1;
```

Zéro ligne, tant que la dimension n'est pas historisée. Le jour où le segment aura plusieurs versions, la clé de jointure changera. Vous ne joindrez plus `magasin_id` seul. D'ici là, une dimension courante a une ligne par magasin. Quarante-deux magasins intégrés, plus la ligne « inconnu » s'il le faut. Pas quatre-vingt-quatre.

Le même accident arrive avec `produit_id`, et avec un budget joint sur la seule région. Avant chaque jointure, comptez les `ligne_id`. Notez le nombre sur mars. Refaites le compte après le `JOIN`. S'il augmente, vous n'agrégez pas. Vous réparez la clé. S'il baisse, un `INNER JOIN` a écarté des orphelins : le total n'est plus 6 240 000 €, et l'écart est silencieux.

```diagram
type: compare
title: Ce que la jointure fait au CA de mars
columns:
  - title: Clé unique
    tone: teal
    items:
      - "Une ligne de dimension par magasin"
      - "6 240 000 € restent 6 240 000 €"
      - "Le SUM ajoute des tickets, pas des copies"
  - title: Clé doublée
    tone: rose
    items:
      - "Deux lignes pour le même magasin_id"
      - "Le CA se rapproche du double"
      - "Aucun message d'erreur"
  - title: INNER JOIN orphelin
    tone: amber
    items:
      - "Le magasin manque dans la dimension"
      - "Ses tickets disparaissent"
      - "L'Ouest peut rater 1 560 000 €"
  - title: Bon réflexe
    tone: blue
    items:
      - "Compter les ligne_id avant et après"
      - "Tester l'unicité de la clé"
      - "Stopper le badge si le compte change"
```

# Agréger avant de croiser

Le budget, s'il existe un jour, est au grain magasin et mois. Les ventes sont au grain du ticket. Les coller trop tôt multiplie le budget par le nombre de lignes.

Vous agrégez d'abord chaque côté au niveau commun. Pour « CA de mars contre un repère mensuel », le niveau commun est le magasin et le mois. Le produit n'est pas dans ce repère. Vous ne le joignez pas aux lignes.

```sql
WITH ventes_mois AS (
  SELECT
    magasin_id,
    SUM(montant_ht_signe) AS ca_ht
  FROM fct_ventes
  WHERE jour >= DATE '2026-03-01'
    AND jour <  DATE '2026-04-01'
  GROUP BY magasin_id
)
SELECT
  v.magasin_id,
  v.ca_ht,
  b.budget_ht
FROM ventes_mois AS v
JOIN budget_magasin_mois AS b
  ON b.magasin_id = v.magasin_id
 AND b.mois = DATE '2026-03-01';
```

L'ordre est obligatoire : sommer les tickets, puis joindre. Le CA du mois égale la somme des jours et des produits, parce que `montant_ht_signe` est additif. Le budget n'a pas été répété sur chaque café vendu.

Le même réflexe vaut pour un stock. Il ne vit pas dans `fct_ventes`. Le croiser « pour enrichir » le ticket répéterait la quantité en rayon sur chaque ligne de vente. Vous l'agrégerez à son grain, le jour où un contrat le demandera. Il n'est pas dans les quatre mesures.

# Le niveau que la page a le droit de sommer

Nora somme. Votre travail est de lui donner un niveau où la somme est encore vraie.

Depuis `fct_ventes`, elle a le droit de sommer `montant_ht_signe`, `marge_ht` et `quantite` vers le magasin, vers le jour, vers le produit, vers la région, vers la famille, vers mars. La somme des parties égale le tout. L'Ouest à 1 560 000 € est la somme de ses magasins, pas une moyenne.

Elle n'a pas le droit de sommer un taux stocké sur la ligne. Elle n'a pas le droit de moyenner les CA journaliers pour obtenir « le CA de mars ». Mars est une somme entre deux bornes. Un magasin fermé un dimanche ne doit pas peser comme un samedi dans une moyenne présentée comme le total.

| Niveau | Opération juste | Opération fausse |
|---|---|---|
| Mars 2026 | `SUM` de `jour` du 1er inclus au 1er avril exclu | Moyenne des jours |
| Ouest | `SUM` après jointure `region = 'Ouest'` | Somme de totaux déjà filtrés autrement |
| Produit | `SUM` groupé par `produit_id` | Un CA magasin copié sur chaque produit |
| Taux de marge | Somme des marges / somme du CA | Moyenne des taux de lignes |

Un agrégat physique par magasin et par jour peut exister plus tard, pour la vitesse. Il n'est pas le contrat. Il doit rendre exactement la même somme que `fct_ventes` sur mars, Ouest compris. Si les deux divergent, vous avez deux définitions.

> [!WARNING]
> Deux tables de ventes ne se justifient que si l'une est la somme exacte de l'autre. Le jour où leurs filtres divergent, Halte a de nouveau deux CA.

# Compter avant de publier

Trois comptes, avant le badge de mars.

Le premier : zéro `ligne_id` en double. Le deuxième : le nombre de lignes avant et après jointure aux dimensions est identique. Le troisième : `SUM(montant_ht_signe)` vaut 6 240 000 €, et l'Ouest 1 560 000 €.

Ajoutez un compte métier. Quarante-deux magasins intégrés existent dans la dimension. Un mois plein doit les voir vendre, ou expliquer l'absence. Un magasin à zéro ligne de tout mars est une alerte (fermeture, panne, clé changée), pas une ligne fabriquée avec un CA nul sans le dire. Fabriquer des zéros change le grain : vous passez de « lignes vendues » à « tous les jours du calendrier ». C'est un autre objet, et il porte un autre nom.

```sql
SELECT COUNT(DISTINCT magasin_id) AS magasins
FROM fct_ventes
WHERE jour >= DATE '2026-03-01'
  AND jour <  DATE '2026-04-01';
```

Si ce compte vaut 12 alors que la dimension en a 42, vous ne certifiez pas en expliquant que le SQL a tourné. Soit le dépôt a manqué des magasins, soit un filtre a tout écarté. Les deux cassent la promesse d'un réseau, pas d'un échantillon.

# Exercices

## Exercice 1 : Mars à 12 480 000 €

`fct_ventes` n'a pas de `ligne_id` en double. Après jointure à `dim_magasin`, la somme de mars double. La dimension a deux lignes par magasin. Nora n'a ajouté aucun calcul. Où est le doublon ?

<details>
<summary>Voir la solution</summary>

Le doublon est dans la dimension. La jointure sur `magasin_id` a répété chaque ticket, et le `SUM` a additionné les copies. Le SQL n'a pas signalé d'erreur. L'unicité de `ligne_id` dans le fait ne protège pas d'une dimension doublée.

Vous ramenez `dim_magasin` à une ligne par `magasin_id`, vous ajoutez le test, vous recalculez. Le contrôle : même nombre de `ligne_id` après jointure, et 6 240 000 € retrouvés. Vous ne divisez pas le visuel par deux.

</details>

## Exercice 2 : Le budget sur chaque ticket

Un repère mensuel est une ligne par magasin. Un SQL le joint aux lignes de `fct_ventes`, puis fait `SUM(budget_ht)` dans le visuel par famille. La famille café hérite d'un budget énorme. Quel est le bon ordre ?

<details>
<summary>Voir la solution</summary>

Le budget n'est pas au grain du ticket. Le joindre aux lignes le répète sur chaque produit, et la somme par famille le multiplie.

Vous agrégez d'abord les ventes au grain magasin et mois, puis vous joignez le repère sur `magasin_id` et le mois. La famille peut décomposer le CA, pas le budget, tant que ce budget n'existe pas par famille. Vous ne stockez pas `budget_ht` sur `fct_ventes`.

</details>

## Exercice 3 : La table magasin-mois

Un directeur demande « juste une table par magasin et par mois, ce sera plus simple ». Nora a encore besoin du jour et du produit. Quel grain écrivez-vous, et que devient le magasin ?

<details>
<summary>Voir la solution</summary>

Le grain reste la ligne de ticket. Le magasin, le jour et le produit sont des sommes. La table magasin-mois répond à la phrase et perd le jour : une quantité absente ne se reconstruit pas, un taux stocké à ce niveau se moyenne de travers.

Vous le dites dans le contrat. Vous ne simplifiez pas le stockage pour faire tenir la phrase. La page groupe. Elle ne remplace pas `fct_ventes`.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Grain et agrégats
center: "Une ligne égale un ticket. Magasin, jour et produit sont des sommes, pas un autre fait."
points:
  - icon: ruler
    title: ligne_id
    text: "Unique, non nul. La question de la revue groupe ces lignes. Elle ne les remplace pas."
  - icon: link
    title: Jointure
    text: "Comptez avant et après. Si le nombre monte, mars se rapproche du double sans erreur SQL."
  - icon: layers
    title: Agréger d'abord
    text: "Un repère mensuel se joint après la somme par magasin. Pas sur chaque ticket."
  - icon: money
    title: Ce qui se somme
    text: "montant_ht_signe, marge_ht, quantite. Pas un taux. Pas la moyenne des jours de mars."
  - icon: chart
    title: Témoins
    text: "6 240 000 € sur le réseau, 1 560 000 € à l'Ouest. Douze magasins au lieu de 42 : pas de badge."
pitfall: "Stocker le magasin-mois pour faire simple, puis perdre le jour et le produit."
remember: "Prouvez le grain par ligne_id et par les comptes. Publiez un niveau que Nora peut additionner."
```
