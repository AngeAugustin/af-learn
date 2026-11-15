---
title: Les fondamentaux de SQL
description: "Interroger une base relationnelle : sélection, filtres, valeurs NULL, agrégations, jointures et ordre logique d'exécution d'une requête."
duration: 60
objectives:
  - Écrire des requêtes SELECT avec filtres, tris et agrégations
  - Comprendre le comportement de NULL
  - Choisir le bon type de jointure
  - Connaître l'ordre logique d'exécution d'une requête
---

# Le modèle relationnel en bref

SQL (*Structured Query Language*) est le langage des bases de données relationnelles : PostgreSQL, MySQL, SQL Server, Oracle, mais aussi des entrepôts analytiques comme BigQuery, Snowflake ou DuckDB. C'est **la** compétence la plus utilisée par un Data Engineer.

Une base relationnelle organise les données en **tables** : chaque **ligne** est un enregistrement, chaque **colonne** a un **type** (entier, texte, date…). Une **clé primaire** identifie chaque ligne de manière unique ; une **clé étrangère** fait référence à la clé primaire d'une autre table.

Tout ce chapitre utilise ce petit schéma de boutique en ligne (syntaxe PostgreSQL) :

```sql
CREATE TABLE clients (
    id          bigint PRIMARY KEY,
    nom         text NOT NULL,
    ville       text,
    cree_le     date NOT NULL
);

CREATE TABLE commandes (
    id          bigint PRIMARY KEY,
    client_id   bigint NOT NULL REFERENCES clients(id),
    passee_le   timestamptz NOT NULL,
    statut      text NOT NULL,          -- 'payee', 'expediee', 'annulee'
    montant     numeric(10, 2) NOT NULL
);
```

> [!TIP]
> Pour pratiquer, installez PostgreSQL ou utilisez **DuckDB** (`pip install duckdb`, puis `duckdb.sql("...")`) : son SQL est très proche de celui de PostgreSQL et ne demande aucun serveur.

# Sélectionner et filtrer

```sql
SELECT id, nom, ville
FROM clients
WHERE ville = 'Lyon'
  AND cree_le >= DATE '2026-01-01'
ORDER BY cree_le DESC
LIMIT 10;
```

- `SELECT` choisit les colonnes (évitez `SELECT *` dans un pipeline : si la table change, le résultat change aussi) ;
- `WHERE` filtre les lignes ;
- `ORDER BY` trie (sans `ORDER BY`, **l'ordre des lignes n'est pas garanti**) ;
- `LIMIT` limite le nombre de lignes.

Opérateurs utiles : `IN ('Lyon', 'Lille')`, `BETWEEN 10 AND 20` (bornes incluses), `LIKE 'Mar%'` (motif), `ILIKE` (insensible à la casse, PostgreSQL).

## Le piège de NULL

`NULL` signifie « valeur inconnue ». Toute comparaison avec `NULL` donne `NULL` (ni vrai, ni faux), et `WHERE` ne garde que les lignes où la condition est **vraie**.

```sql
SELECT count(*) FROM clients WHERE ville = NULL;      -- toujours 0 : erreur classique
SELECT count(*) FROM clients WHERE ville IS NULL;     -- correct
SELECT count(*) FROM clients WHERE ville <> 'Paris';  -- exclut aussi les villes NULL !
SELECT coalesce(ville, 'Inconnue') FROM clients;      -- remplacer NULL à l'affichage
```

> [!WARNING]
> `ville <> 'Paris'` n'inclut **pas** les clients dont la ville est `NULL`. Pour les inclure : `ville IS DISTINCT FROM 'Paris'` (PostgreSQL, DuckDB) ou `ville <> 'Paris' OR ville IS NULL`.

# Agréger

Les fonctions d'agrégation résument plusieurs lignes : `count`, `sum`, `avg`, `min`, `max`.

```sql
SELECT
    statut,
    count(*)            AS nb_commandes,
    sum(montant)        AS chiffre_affaires,
    round(avg(montant), 2) AS panier_moyen
FROM commandes
WHERE passee_le >= TIMESTAMPTZ '2026-01-01 00:00:00+00'
GROUP BY statut
HAVING count(*) >= 100
ORDER BY chiffre_affaires DESC;
```

- `GROUP BY` forme un groupe par valeur distincte ; chaque colonne du `SELECT` doit être soit dans le `GROUP BY`, soit agrégée ;
- `WHERE` filtre **les lignes avant** l'agrégation ; `HAVING` filtre **les groupes après** ;
- `count(*)` compte les lignes, `count(ville)` compte les valeurs **non NULL**, `count(DISTINCT ville)` les valeurs distinctes.

# Joindre des tables

Une jointure associe les lignes de deux tables selon une condition, le plus souvent l'égalité d'une clé étrangère et d'une clé primaire.

```diagram
type: compare
title: Les principales jointures
columns:
  - title: INNER JOIN
    tone: teal
    items:
      - Uniquement les lignes qui ont une correspondance des deux côtés
      - Clients ayant au moins une commande
  - title: LEFT JOIN
    tone: blue
    items:
      - Toutes les lignes de gauche, NULL à droite si pas de correspondance
      - Tous les clients, avec ou sans commande
  - title: FULL OUTER JOIN
    tone: amber
    items:
      - Toutes les lignes des deux côtés
      - Comparer deux sources et trouver les écarts
```

```sql
-- Chiffre d'affaires par client, y compris les clients sans commande
SELECT
    c.id,
    c.nom,
    count(co.id)                    AS nb_commandes,
    coalesce(sum(co.montant), 0)    AS chiffre_affaires
FROM clients AS c
LEFT JOIN commandes AS co
       ON co.client_id = c.id
      AND co.statut <> 'annulee'
GROUP BY c.id, c.nom
ORDER BY chiffre_affaires DESC;
```

> [!IMPORTANT]
> Dans un `LEFT JOIN`, une condition sur la table de droite placée dans le `WHERE` (par exemple `WHERE co.statut <> 'annulee'`) élimine les lignes où `co.statut` est `NULL`, c'est-à-dire les clients sans commande : le `LEFT JOIN` redevient un `INNER JOIN`. Placez ces conditions dans le `ON`.

## L'explosion des lignes

Si la condition de jointure n'est pas **unique** d'un côté, les lignes se multiplient. Joindre `commandes` à une table `paiements` où une commande peut avoir plusieurs paiements, puis sommer `commandes.montant`, **compte plusieurs fois** le même montant. Vérifiez toujours la **granularité** (ce que représente une ligne) de chaque table avant de joindre, et comparez le nombre de lignes avant et après.

# L'ordre logique d'exécution

On écrit une requête dans l'ordre `SELECT … FROM … WHERE …`, mais la base l'évalue **logiquement** dans un autre ordre. Le connaître explique beaucoup d'erreurs.

```diagram
type: flow
title: Ordre logique d'évaluation d'une requête
steps:
  - title: FROM / JOIN
    text: Tables sources et jointures
  - title: WHERE
    text: Filtre des lignes
  - title: GROUP BY
    text: Formation des groupes
  - title: HAVING
    text: Filtre des groupes
  - title: SELECT
    text: Calcul des colonnes et alias
  - title: ORDER BY / LIMIT
    text: Tri et limitation
```

Conséquence : un alias défini dans le `SELECT` n'est **pas** utilisable dans le `WHERE` (évalué avant), mais il l'est dans l'`ORDER BY` (évalué après).

# Modifier les données

```sql
INSERT INTO clients (id, nom, ville, cree_le) VALUES (1001, 'Durand', 'Nantes', CURRENT_DATE);

UPDATE commandes SET statut = 'expediee' WHERE id = 5012;

DELETE FROM commandes WHERE statut = 'annulee' AND passee_le < now() - INTERVAL '3 years';
```

> [!CAUTION]
> Un `UPDATE` ou un `DELETE` sans `WHERE` touche **toutes** les lignes. En production, exécutez d'abord un `SELECT count(*)` avec la même condition, et travaillez dans une transaction (`BEGIN; … ROLLBACK;` ou `COMMIT;`), vue au chapitre 4.

# Exercices

## Exercice 1 : Requêtes de base

Écrivez les requêtes suivantes sur le schéma du chapitre :

1. Le nombre de clients par ville, les villes inconnues regroupées sous « Inconnue », triées par nombre décroissant.
2. Les clients n'ayant **jamais** passé de commande.

<details>
<summary>Voir la solution</summary>

```sql
-- 1
SELECT coalesce(ville, 'Inconnue') AS ville, count(*) AS nb_clients
FROM clients
GROUP BY coalesce(ville, 'Inconnue')
ORDER BY nb_clients DESC;

-- 2 (anti-jointure)
SELECT c.id, c.nom
FROM clients AS c
LEFT JOIN commandes AS co ON co.client_id = c.id
WHERE co.id IS NULL;

-- 2 (variante équivalente)
SELECT c.id, c.nom
FROM clients AS c
WHERE NOT EXISTS (SELECT 1 FROM commandes AS co WHERE co.client_id = c.id);
```

Évitez `NOT IN (SELECT client_id FROM …)` : si la sous-requête renvoie un seul `NULL`, le résultat est vide.

</details>

## Exercice 2 : WHERE ou HAVING ?

Trouvez les clients ayant dépensé plus de 1 000 € en commandes payées en 2026. Quelle condition va dans le `WHERE`, laquelle dans le `HAVING` ?

<details>
<summary>Voir la solution</summary>

```sql
SELECT client_id, sum(montant) AS total
FROM commandes
WHERE statut = 'payee'
  AND passee_le >= TIMESTAMPTZ '2026-01-01 00:00:00+00'
  AND passee_le <  TIMESTAMPTZ '2027-01-01 00:00:00+00'
GROUP BY client_id
HAVING sum(montant) > 1000;
```

Le statut et la date filtrent des **lignes** (`WHERE`, avant agrégation) ; le seuil de 1 000 € porte sur un **agrégat** (`HAVING`). Notez l'intervalle semi-ouvert `>= début AND < fin` : il évite les problèmes de bornes avec les horodatages.

</details>

## Exercice 3 : Le chiffre d'affaires gonflé

Un analyste joint `commandes` et `lignes_commande` (plusieurs lignes par commande) puis calcule `sum(commandes.montant)`. Le résultat est trois fois trop élevé. Expliquez et corrigez.

<details>
<summary>Voir la solution</summary>

La jointure produit **une ligne par ligne de commande** : le montant de chaque commande est répété autant de fois qu'elle a de lignes, puis sommé. Corrections possibles : ne pas joindre si l'on n'a besoin que de `commandes` ; ou agréger `lignes_commande` **avant** la jointure (sous-requête ou CTE groupée par `commande_id`) pour revenir à une ligne par commande.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Les fondamentaux de SQL
center: Décrire le résultat voulu (filtrer, joindre, agréger) en maîtrisant NULL et la granularité.
points:
  - icon: filter
    title: Filtrer
    text: WHERE filtre les lignes, HAVING les groupes ; sans ORDER BY, aucun ordre garanti.
  - icon: alert
    title: NULL est inconnu
    text: Utiliser IS NULL ; « ville <> 'Paris' » exclut aussi les villes NULL.
  - icon: link
    title: Jointures
    text: INNER pour les correspondances, LEFT pour tout garder à gauche ; conditions de droite dans le ON.
  - icon: ruler
    title: Granularité
    text: Savoir ce que représente une ligne ; une jointure non unique multiplie les lignes.
  - icon: list
    title: Ordre logique
    text: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, d'où les alias inutilisables dans WHERE.
pitfall: Sommer après une jointure qui duplique les lignes, et obtenir un total faux sans erreur.
remember: Compter les lignes avant et après chaque jointure est le réflexe qui évite les chiffres faux.
```
