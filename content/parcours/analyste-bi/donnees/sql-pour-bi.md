---
title: SQL pour les rapports
description: "Écrire le SQL d'un rapport de pilotage : filtres, jointures de dimensions, agrégats au bon grain, dates de revue et vues partagées, sur les ventes magasins."
duration: 65
objectives:
  - Écrire un SELECT de reporting filtré sur le périmètre de la revue
  - Joindre les dimensions sans perdre ni doubler le chiffre officiel
  - Agréger des mesures additives et recalculer un taux après la somme
  - Publier une vue au grain stable pour plusieurs rapports
---

# Un SELECT pour un rapport

Le SQL d'un rapport n'est pas une exploration. Il répond à une question de revue, sur un périmètre que la finance peut refaire. Chez Halte Marché, les exemples de ce chapitre utilisent quatre tables déjà disponibles :

| Table | Grain | Clé | Colonnes utiles |
|---|---|---|---|
| `ventes` | Ligne de ticket | `ticket_id`, `ligne` | `date_vente`, `magasin_id`, `produit_id`, `montant_ht`, `cout_revient` |
| `magasins` | Magasin | `magasin_id` | `region`, `format`, `statut` (intégré, franchisé) |
| `produits` | Produit | `produit_id` | `rayon`, `famille` |
| `calendrier` | Jour | `date_jour` | `annee`, `mois`, `lundi_semaine`, `mois_gestion` |

Vous ne sélectionnez pas `*`. Vous nommez les colonnes que la page affiche, et vous donnez aux mesures un nom métier.

```sql
SELECT
  v.date_vente,
  v.magasin_id,
  SUM(v.montant_ht) AS ca_ht
FROM ventes AS v
WHERE v.date_vente >= DATE '2026-11-02'
  AND v.date_vente <  DATE '2026-11-09'
GROUP BY v.date_vente, v.magasin_id;
```

La période est un intervalle **semi-ouvert** : inclus le lundi 2 novembre, exclu le lundi 9. La semaine du 2 au 8 novembre entre entière. Cet usage évite de compter deux fois un jour quand on enchaîne les semaines, et il reste juste si `date_vente` contient une heure. `BETWEEN` sur un horodatage oublie souvent la fin de journée, ou l'inclut deux fois selon la borne.

Le filtre de la revue s'écrit dans le `WHERE`, pas dans un commentaire. « Semaine du comité » doit être la même borne dans le rapport et dans le contrôle du total.

# Joindre les dimensions

Une vente ne porte pas le nom de la région. La région est sur le magasin. Le rayon est sur le produit. Vous joignez les **dimensions**, après avoir vérifié que leur clé est unique. Vous ne joignez pas deux faits (ventes et stocks) sur le seul `magasin_id` : chaque vente se répéterait autant de fois qu'il y a de lignes de stock, et le CA doublerait en silence.

```sql
SELECT
  m.region,
  p.rayon,
  SUM(v.montant_ht) AS ca_ht
FROM ventes AS v
JOIN magasins AS m ON m.magasin_id = v.magasin_id
JOIN produits AS p ON p.produit_id = v.produit_id
WHERE v.date_vente >= DATE '2026-11-02'
  AND v.date_vente <  DATE '2026-11-09'
GROUP BY m.region, p.rayon;
```

Le type de jointure change le total certifié. Ce n'est pas un détail de syntaxe.

```diagram
type: compare
title: Jointure et total que la finance reconnaît
columns:
  - title: INNER JOIN
    tone: amber
    items:
      - Écarte les ventes sans magasin ou sans produit
      - Le total peut être inférieur au compte finance
      - Adapté à une analyse déjà nettoyée
  - title: LEFT JOIN
    tone: teal
    items:
      - Conserve toutes les ventes du fait
      - L'orphelin reste visible, région vide
      - Nécessaire pour un total officiel complet
```

Pour un chiffre certifié, partez des `ventes` et faites un `LEFT JOIN` vers les dimensions. Une région vide est un **signal** (référentiel incomplet), pas une ligne à jeter. Pour une exploration (« CA des seules régions bien renseignées »), un `INNER JOIN` est honnête, à condition de ne pas l'appeler CA officiel.

Avant d'ajouter une jointure, comptez les lignes du fait sur la période, puis recomptez après la jointure. Si le nombre augmente, la dimension n'est pas unique sur sa clé : vous êtes en train de dupliquer le CA. Arrêtez-vous. Le chapitre qualité formalise ce contrôle. Ici, prenez le réflexe.

# Agréger au grain de la question

La directrice régionale ne lit pas des lignes de ticket. Elle lit une région et une semaine. L'agrégat se fait **au grain de la question**, sur des mesures additives.

```sql
SELECT
  m.region,
  SUM(v.montant_ht) AS ca_ht,
  SUM(v.montant_ht - v.cout_revient) AS marge_ht,
  SUM(v.montant_ht - v.cout_revient) / NULLIF(SUM(v.montant_ht), 0) AS taux_marge
FROM ventes AS v
LEFT JOIN magasins AS m ON m.magasin_id = v.magasin_id
WHERE v.date_vente >= DATE '2026-11-02'
  AND v.date_vente <  DATE '2026-11-09'
GROUP BY m.region;
```

`ca_ht` et `marge_ht` s'additionnent. `taux_marge` est recalculé **après** les sommes. `NULLIF` évite une division par zéro si une région n'a pas de CA (magasin fermé, ou filtre trop dur). Vous n'affichez pas la moyenne des taux de ligne.

`COUNT(*)` compte des lignes de ticket, pas des tickets. Pour le nombre de tickets :

```sql
COUNT(DISTINCT v.ticket_id) AS nb_tickets
```

Ce dénombrement est juste **dans le groupe** (la région, la semaine). Si vous le stockez déjà agrégé par magasin et par jour, vous pourrez le resommer seulement si chaque ticket appartient à un seul magasin et à un seul jour, ce qui est le cas en caisse. Vous ne pourrez pas resommer un taux. Nommez donc les colonnes selon ce qu'elles autorisent : `ca_ht` se resomme, `taux_marge` non.

Le `GROUP BY` contient toutes les colonnes affichées qui ne sont pas agrégées, et rien qui changerait le grain en douce (un `ticket_id` oublié dans le `SELECT` ferait revenir au ticket). Relisez la question : « par région ». Si `magasin_id` est encore dans le `GROUP BY`, vous n'avez pas répondu à la question, vous avez préparé le détail.

# Les dates du pilotage

Les dates cassent plus de revues que les jointures. Trois pièges reviennent chez Halte Marché.

**La semaine de revue n'est pas « les sept derniers jours ».** Le comité compare des semaines du lundi au dimanche. Une fenêtre glissante mélange deux semaines et ne se rapproche pas du budget hebdomadaire. Filtrez avec le calendrier :

```sql
SELECT c.lundi_semaine, SUM(v.montant_ht) AS ca_ht
FROM ventes AS v
JOIN calendrier AS c ON c.date_jour = v.date_vente
WHERE c.lundi_semaine = DATE '2026-11-02'
GROUP BY c.lundi_semaine;
```

`lundi_semaine` porte le lundi de la semaine de revue, pas « les sept derniers jours glissants ». Demandez au contrôle de gestion si les semaines sont civiles, ISO, ou un calendrier retail (mois de 4 ou 5 semaines). Posez la réponse **dans la table calendrier**, une fois. Ne réécrivez pas `date - 7 jours` dans chaque rapport : le 29 février et les semaines décalées vous feront manquer le budget.

**Le mois de gestion n'est pas toujours le mois civil.** Certaines enseignes closent le dimanche le plus proche de la fin de mois. Si vous filtrez du 1er au 31 alors que la finance clôt du 2 novembre au 29 novembre, l'écart est structurel. Il ne se « corrige » pas dans le visuel. Il s'écrit dans `calendrier`, colonne `mois_gestion`.

**La comparaison à l'an passé se décide.** Soustraire un an à la date rate les semaines comparables (Pâques, semaine 53). Une colonne `date_comparable` dans le calendrier, validée par le métier, vaut mieux qu'une fonction recopiée. Tant que cette colonne n'existe pas, dites sur la page « année civile glissante », et ne l'appelez pas « comparable ».

Affichez toujours la borne réelle dans le titre du résultat ou dans une colonne à part. Un total juste sur la mauvaise semaine est un faux écart au budget.

# Une vue pour plusieurs rapports

Dès que deux pages utilisent le même CA, le SQL quitte le brouillon et devient une **vue**. La vue fixe le grain et les mesures additives. Elle ne fixe pas le filtre de la campagne du mois, qui changerait sous les pieds de la revue.

```sql
CREATE VIEW vw_vente_magasin_jour AS
SELECT
  v.date_vente,
  v.magasin_id,
  SUM(v.montant_ht) AS ca_ht,
  SUM(v.montant_ht - v.cout_revient) AS marge_ht,
  COUNT(DISTINCT v.ticket_id) AS nb_tickets
FROM ventes AS v
GROUP BY v.date_vente, v.magasin_id;
```

Le grain est magasin-jour. Les rapports joignent ensuite `magasins` et `calendrier`, filtrent la semaine, et resomment `ca_ht` et `marge_ht`. Ils recalculent le taux. Ils ne réécrivent pas la règle des montants.

Ce que vous ne mettez pas dans cette vue :

- un filtre « semaine en cours », qui la rendrait fausse lundi prochain ;
- un taux de marge déjà moyenné ;
- une règle de campagne appelée à changer ;
- un `INNER JOIN` qui ferait disparaître les ventes orphelines du total officiel.

```diagram
type: layers
title: Du fait brut à la page de revue
layers:
  - title: Page de la revue
    text: Région, semaine, CA HT contre budget, filtres visibles
  - title: Mesure
    text: Somme de ca_ht, taux recalculé, même nom partout
  - title: Vue magasin-jour
    text: Mesures additives seulement, grain écrit dans le nom
  - title: Fait ventes
    text: Ligne de ticket, clé ticket et ligne, montants HT
```

La vue se relit comme un contrat. En tête, trois lignes de commentaire suffisent : grain, mesures additives, ce qui est volontairement absent. Le module de modélisation ira plus loin (faits, dimensions, historisation). Vous avez déjà de quoi arrêter les doubles définitions.

# Vérifier le chiffre avant de le montrer

Un SELECT qui s'exécute n'est pas un SELECT publiable. Avant la revue, trois contrôles tiennent en quelques minutes.

1. **Le total nu.** `SUM(montant_ht)` sur la période, sans jointure, comparé au total de la requête complète. S'ils divergent, une jointure interne a écarté des lignes, ou une jointure a multiplié.
2. **Le grain.** `COUNT(*)` et `COUNT(DISTINCT ticket_id, ligne)` sur le fait. S'ils divergent, la clé est en double et le CA aussi.
3. **La borne.** Le minimum et le maximum de `date_vente` dans le résultat sont exactement ceux de la semaine annoncée sur la page.

Le rapprochement avec le contrôle de gestion vient ensuite, au niveau du mois de gestion, pas au niveau d'une région filtrée à la main. Le chapitre qualité en fait une liste de publication. Ici, ne montrez pas un total que ces trois contrôles n'ont pas traversé.

> [!WARNING]
> Corriger un écart en ajoutant « à la main » un montant dans le SELECT (`SUM(montant_ht) + 1200`) rend le rapport impossible à maintenir. L'écart s'explique, ou le chiffre n'est pas certifié.

# Exercices

## Exercice 1 : Écrire la requête de la revue

Écrivez un `SELECT` qui donne, pour la semaine du lundi 2 novembre 2026 au dimanche 8 novembre inclus, le CA HT et la marge HT par région, tous les magasins présents dans `ventes` même si la région manque. Les tables sont celles du chapitre.

Solution :
<details>
<summary>Voir la solution</summary>

```sql
SELECT
  m.region,
  SUM(v.montant_ht) AS ca_ht,
  SUM(v.montant_ht - v.cout_revient) AS marge_ht
FROM ventes AS v
LEFT JOIN magasins AS m ON m.magasin_id = v.magasin_id
WHERE v.date_vente >= DATE '2026-11-02'
  AND v.date_vente <  DATE '2026-11-09'
GROUP BY m.region;
```

Le `LEFT JOIN` part des ventes, donc un magasin inconnu reste dans le total, avec une région vide. L'intervalle semi-ouvert couvre du 2 au 8 novembre inclus. Un `INNER JOIN` ou un `BETWEEN` sur un horodatage seraient des motifs de refus avant certification.

</details>

## Exercice 2 : Voir le double comptage

Un collègue veut le CA et le stock du jour sur la même ligne. Il joint `ventes` à `stocks` sur `magasin_id` seulement, puis fait `SUM(v.montant_ht)`. Le CA de la région Nord sort trois fois trop élevé. Expliquez pourquoi, et donnez le principe de correction sans écrire toute la requête.

Solution :
<details>
<summary>Voir la solution</summary>

`stocks` a plusieurs lignes par magasin (une par produit, ou par jour). Chaque ligne de vente est répétée autant de fois. La somme du CA est multipliée.

Le principe : **agréger chaque fait à part** au grain commun (magasin, ou magasin-jour), puis joindre ces deux résultats. On ne joint pas un fait détaillé à un autre fait détaillé sur une clé qui n'est pas unique des deux côtés. On vérifie que le `SUM(ca_ht)` après jointure égale le `SUM(montant_ht)` des ventes seules.

</details>

## Exercice 3 : Juger une vue

On vous propose d'ajouter à `vw_vente_magasin_jour` la colonne `taux_marge` (marge divisée par CA, au grain magasin-jour) et le filtre `WHERE date_vente >= CURRENT_DATE - 7`. Le rapport du comité et le rapport finance s'appuieraient sur cette vue. Acceptez-vous ? Que gardez-vous ?

Solution :
<details>
<summary>Voir la solution</summary>

Vous **refusez** les deux ajouts.

`taux_marge` au grain jour sera resommé ou moyenné par erreur dans un rapport mensuel. La vue ne porte que des mesures additives. Le taux se recalcule dans la requête de la page, après la somme.

Le filtre « sept derniers jours » rend la vue inutilisable pour le mois de clôture et pour l'an passé. La fenêtre de dates appartient au rapport, pas au contrat de grain.

Vous gardez la vue au grain magasin-jour, avec `ca_ht`, `marge_ht` et, si besoin, `nb_tickets`, sans filtre de période.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: SQL pour les rapports
center: "Un SELECT de revue filtre un périmètre, joint sans doubler, et agrège au grain de la question."
points:
  - icon: database
    title: Périmètre écrit
    text: "Colonnes nommées, période semi-ouverte, mêmes bornes que la page et que la finance."
  - icon: link
    title: Dimensions
    text: "LEFT JOIN depuis le fait pour le total officiel. Jamais deux faits sur une clé non unique."
  - icon: chart
    title: Additif d'abord
    text: "On somme le CA et la marge. Le taux se recalcule après, jamais en moyenne de taux."
  - icon: clock
    title: Calendrier métier
    text: "Semaine de revue et mois de gestion vivent dans la table calendrier, pas dans une astuce."
  - icon: layers
    title: Une vue, un grain
    text: "Magasin-jour, mesures additives, aucun filtre de campagne. Les rapports resomment."
pitfall: "Joindre les stocks aux ventes sur le seul magasin, puis publier un CA silencieusement multiplié."
remember: "Si le total avec jointures n'égale pas le total du fait, vous n'avez pas encore un chiffre de revue."
```
