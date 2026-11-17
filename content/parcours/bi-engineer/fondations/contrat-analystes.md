---
title: "Le contrat avec les analystes"
description: "Écrire le contrat du mart Halte : grain de la ligne de ticket, fraîcheur à 7 h, CA de mars, propriétaires, et ce qui rompt le badge."
duration: 60
objectives:
  - "Écrire le grain en une phrase que l'on peut tester"
  - "Fixer la fraîcheur, les propriétaires et la définition du CA HT"
  - "Rapprocher mars 2026 du témoin 6 240 000 €"
  - "Reconnaître ce qui casse le contrat même si la requête répond"
---

# Une page, pas une faveur

Nora travaille vite parce que le contrat est court. Sans ce texte, chaque fichier SQL reprend une copie « pour être tranquille ». Les douze copies sont le symptôme d'un contrat absent.

La page répond à cinq questions, dans cet ordre.

1. **Grain.** À quoi correspond une ligne de `fct_ventes` ?
2. **Fraîcheur.** Jusqu'à quand, et à partir de quelle heure ?
3. **Mesures.** Que valent CA HT, marge, quantité et CA N-1 ?
4. **Propriétaires.** Qui assume le sens, le calcul, la page, le dépôt ?
5. **Rupture.** Qu'est-ce qui interdit le badge, même si un `SELECT` renvoie des lignes ?

> [!IMPORTANT]
> Contrat : une page que Camille et Nora relisent sans vous. Si la réponse n'est que dans votre tête, Nora recopiera la requête.

Quand la règle change, la page change de version, avec une date. L'ancienne revue reste explicable.

# Le grain en une phrase

**Une ligne égale un `ligne_id` : une ligne de ticket, rattachée à un jour, un magasin et un produit.**

La clé `ligne_id` est unique et non nulle. Cette ligne ne mélange pas deux produits. Elle ne représente pas le mois du magasin. Le CA du magasin, le CA du jour et le CA du produit sont des sommes de ces lignes. C'est ainsi que la revue obtient les ventes par magasin, par jour et par produit sans perdre le ticket.

Ce que la phrase n'est pas :

- une ligne par magasin et par mois (on ne reconstruit plus un jour) ;
- une ligne par magasin, jour et produit déjà agrégée à la place du ticket (plusieurs tickets du même produit disparaîtraient) ;
- une ligne de budget, de stock ou de client.

```sql
SELECT ligne_id, COUNT(*) AS nb
FROM fct_ventes
GROUP BY ligne_id
HAVING COUNT(*) > 1;
```

Zéro ligne attendue. Le jour où la requête en renvoie, le grain est rompu. Vous ne demandez pas à Nora de « faire attention aux doublons ».

L'absence d'un produit un jour donné signifie qu'aucune ligne n'a été vendue, pas que le magasin était fermé. La fermeture n'est pas un trou que vous comblez avec un CA à zéro sans le dire.

# Fraîcheur et propriétaires

La fraîcheur : avant **7 h**, Europe/Paris, les jours ouvrés, le mart contient les tickets de la veille. Le témoin est `max(charge_le)`. À 7 h 05, s'il n'a pas bougé, Nora ne présente pas ce matin. Elle présente le dernier jour certifié. « Dans la matinée » ne se teste pas.

| Sujet | Propriétaire | Ce qu'il assume |
|---|---|---|
| Dépôt de `caisse.lignes` | Data engineer | Nuit Kafka et Spark, schéma tenu |
| Calcul du mart et des mesures | Vous, Lina | Grain, sommes, noms, écart publié |
| Sens du CA | Camille Renard | Ce qui entre et ce qui sort |
| Page du lundi | Nora | Filtre, commentaire, pas une seconde formule |

Deux noms sur la mesure ne font pas deux formules. Camille tient le sens. Vous tenez l'implémentation. Nora tient l'usage. Elle peut demander une mesure. Elle ne la publie pas seule. La direction et Marie consomment le chiffre. Elles ne l'écrivent pas.

> [!WARNING]
> Fraîcheur fausse : la revue décide sur une veille qui n'est pas dans la table. Le total peut être propre et mentir sur la période.

# Les quatre mesures

Mars 2026 est le témoin. Une définition qui ne le retrouve pas est fausse, pas « une variante ».

| Mesure | Définition | Mars 2026 |
|---|---|---|
| CA HT | Somme de `montant_ht_signe`. Retours négatifs gardés. Hors personnel. Intégrés. | 6 240 000 € |
| Marge € | Somme de `marge_ht`, même périmètre. Coût manquant : erreur, pas un zéro. | 2 184 000 € |
| Quantité | Somme de `quantite`, retours compris. | 624 000 |
| CA N-1 | Le même CA, mars 2025. | 6 000 000 € |

Le brut hors personnel vaut 6 480 000 €. Les retours à la date du ticket valent 240 000 €. 6 480 000 − 240 000 = 6 240 000. Filtrer les négatifs casse le témoin. L'écart avec mars 2025 est +240 000 €. Ce n'est pas l'écart finance.

La finance part de 6 258 000 € HT, retire 15 000 € de retours datés du 2 avril et 3 000 € de ventes au personnel. Reste attendu : 0 € face aux 6 240 000 €. Seuil d'alerte : 5 000 € ou 0,5 %. Au-dessus, pas de badge. En dessous, l'écart résiduel s'écrit : montant, cause, date, nom.

```sql
SELECT SUM(montant_ht_signe) AS ca_ht
FROM fct_ventes
WHERE jour >= DATE '2026-03-01'
  AND jour <  DATE '2026-04-01';
```

Ce `SELECT` doit rendre 6 240 000. Il vit dans le contrôle, pas dans la page de Nora. L'Ouest, même filtre et `region = 'Ouest'`, doit rendre 1 560 000. Le N-1 rejoue la même requête sur mars 2025 et doit rendre 6 000 000. Février 2026 n'est pas le N-1.

```video
url: https://www.youtube.com/watch?v=-n3OD-ml_k0
title: "What is a Data Contract?"
channel: "IBM Technology"
duration: "3:04"
lang: en
why: "Ce qu'est un contrat de données, en trois minutes par IBM Technology : l'engagement écrit entre ceux qui produisent une donnée et ceux qui la consomment."
```

# Ce qui casse le contrat

Une requête qui s'exécute peut quand même rompre le badge.

**Changer le grain sans changer le nom.** Remplacer `fct_ventes` par un magasin-mois, et laisser les pages croire que le jour existe encore.

**Renommer la colonne.** `montant_ht_signe` qui devient `ca_v3` casse les mesures. Les pages oubliées restent sur l'ancien nom, ou tombent le lundi.

**Filtrer en silence.** Retirer les retours « le temps de vérifier ». Camille n'a pas signé. Le témoin passe à 6 480 000 €.

**Dupliquer `ligne_id`.** Une jointure au référentiel qui n'est plus unique double le CA. Aucun message d'erreur. Le test d'unicité doit échouer avant la revue.

**Certifier un matin sans `charge_le`.** La page a l'air complète. La veille n'y est pas.

**Laisser une formule locale.** Nora ajoute un filtre, vous le savez, vous le laissez « parce que c'est urgent ». Le contrat vient de déménager dans une page.

```diagram
type: decision
title: Une demande de Nora arrive
nodes:
  - question: "Change-t-elle le grain, le nom ou le sens du CA HT ?"
    yes: "Camille signe d'abord. Nouvelle version datée. Pas de correctif de page."
    no: "La page peut filtrer le mois, la région, le magasin ou le produit."
  - question: "charge_le est-il avant 7 h, et mars sous le seuil finance ?"
    yes: "Vous certifiez. Nora raconte à partir de ce chiffre."
    no: "Pas de badge. Dernier jour certifié, écart écrit."
```

Halte supporte un lundi avec le chiffre de la veille. Elle supporte mal deux CA pour le même mars.

# Exercices

## Exercice 1 : Le N-1 de février

Nora propose de prendre février 2026 comme « période précédente », parce que c'est le mois d'avant et que les magasins sont les mêmes. Camille n'a rien signé. Quel nombre est le CA N-1, et pourquoi février ment ?

<details>
<summary>Voir la solution</summary>

Le CA N-1 est 6 000 000 € : mars 2025, même règle, mêmes exclusions. Février 2026 est un autre mois, plus court, pas l'année comparable.

L'écart officiel est 6 240 000 − 6 000 000 = 240 000 €. Un écart contre février raconte une autre histoire. Vous ne le publiez pas sous le nom CA N-1. S'il faut un écart au mois précédent, c'est une autre mesure, signée, avec un autre témoin.

</details>

## Exercice 2 : Un nom plus joli

Un pair veut renommer `montant_ht_signe` en `chiffre_affaires_hors_taxes_net` pour que la colonne « se comprenne seule ». Les mesures pointent déjà sur le nom actuel. Que faites-vous ?

<details>
<summary>Voir la solution</summary>

Vous gardez `montant_ht_signe`. Le renommage casse les mesures, ou laisse des pages sur une colonne morte.

La phrase longue vit dans la description de CA HT : hors taxes, retours déduits, hors personnel, magasins intégrés, 6 240 000 € en mars 2026. Le nom technique ne porte pas toute la définition, et il ne change pas à chaque précision.

</details>

## Exercice 3 : Le seuil dépassé

Le rapprochement de mars donne un mart supérieur de 18 000 € au journal, soit 0,3 %. Nora dit que c'est petit et que le badge peut rester. Les 15 000 € du 2 avril et les 3 000 € de personnel n'ont pas été expliqués. Que publiez-vous ?

<details>
<summary>Voir la solution</summary>

18 000 € dépasse 5 000 €. 0,3 % reste sous 0,5 %, mais le seuil est l'un **ou** l'autre : l'un des deux suffit à retirer le badge. De plus, le reste attendu est 0 après avoir nommé 15 000 € et 3 000 €. Ici ces lignes ne sont pas posées. Vous ne certifiez pas.

Vous publiez l'écart et vous le décomposez avec la finance avant de rendre le badge. « Petit » n'est pas une unité du contrat.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Le contrat avec les analystes
center: "Une ligne de ticket, quatre mesures, avant 7 h. Mars vaut 6 240 000 €, pas 6 480 000."
points:
  - icon: ruler
    title: ligne_id
    text: "Une ligne, un ticket. Magasin, jour et produit sont les sommes que Nora a le droit de faire."
  - icon: clock
    title: Avant 7 h
    text: "charge_le en est le témoin. S'il n'a pas bougé, Nora présente le dernier jour certifié."
  - icon: money
    title: Quatre mesures
    text: "CA 6 240 000, marge 2 184 000, quantité 624 000, N-1 mars 2025 à 6 000 000."
  - icon: users
    title: Quatre rôles
    text: "Camille tient le sens, vous le calcul, Nora la page, le data engineer le dépôt."
  - icon: scale
    title: Seuil
    text: "Reste finance au-dessus de 5 000 € ou de 0,5 % : le badge reste éteint."
  - icon: alert
    title: Ruptures
    text: "Grain changé, filtre silencieux, ligne_id en double, formule locale : on ne certifie pas."
pitfall: "Appeler CA N-1 le mois de février, ou écarter les retours et garder le nom CA HT."
remember: "Le contrat tient sur une page datée. Une règle nouvelle passe par Camille, pas par une slide."
```
