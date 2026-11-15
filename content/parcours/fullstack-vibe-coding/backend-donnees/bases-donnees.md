---
title: Bases de données et SQL
description: Pourquoi une base de données, le modèle relationnel, les requêtes SQL de base, les relations et clés, les transactions et les index, et quand choisir SQL ou NoSQL.
duration: 65
objectives:
  - Expliquer le rôle d'une base de données
  - Modéliser des données en tables avec des relations
  - Écrire des requêtes SQL de base
  - Garantir la cohérence avec les transactions et accélérer les requêtes avec des index
  - Choisir entre une base relationnelle et NoSQL
---

# Pourquoi une base de données ?

Une application doit **conserver** ses données entre les sessions et les redémarrages : comptes, articles, commandes. Les stocker dans des fichiers devient vite ingérable (recherche lente, accès concurrents, cohérence). Une **base de données** gère tout cela : stockage durable, requêtes efficaces, accès simultanés sûrs, intégrité des données.

La grande majorité des applications utilisent une **base relationnelle**, qui organise les données en **tables** et parle **SQL**. **PostgreSQL** est aujourd'hui le choix de référence : open source, robuste, riche en fonctionnalités. (SQLite est parfait pour débuter et pour les petits projets ; MySQL est une autre option répandue.)

# Le modèle relationnel

Les données s'organisent en **tables** : chaque **ligne** est un enregistrement, chaque **colonne** a un **type**. Une **clé primaire** identifie chaque ligne de façon unique.

```sql
CREATE TABLE utilisateurs (
  id          SERIAL PRIMARY KEY,         -- identifiant auto-incrémenté
  email       TEXT NOT NULL UNIQUE,
  nom         TEXT NOT NULL,
  cree_le     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE articles (
  id          SERIAL PRIMARY KEY,
  titre       TEXT NOT NULL,
  contenu     TEXT NOT NULL,
  auteur_id   INTEGER NOT NULL REFERENCES utilisateurs(id),  -- clé étrangère
  publie      BOOLEAN NOT NULL DEFAULT false
);
```

La colonne `auteur_id` est une **clé étrangère** : elle **référence** la clé primaire d'une autre table, ce qui relie un article à son auteur et garantit qu'un article ne peut pas pointer vers un utilisateur inexistant (**intégrité référentielle**).

# Les requêtes SQL de base

```sql
-- Lire
SELECT id, titre FROM articles WHERE publie = true ORDER BY id DESC LIMIT 10;

-- Créer
INSERT INTO articles (titre, contenu, auteur_id) VALUES ('Mon titre', 'Le contenu', 1);

-- Modifier
UPDATE articles SET publie = true WHERE id = 42;

-- Supprimer
DELETE FROM articles WHERE id = 42;
```

- `SELECT` choisit les colonnes, `WHERE` filtre, `ORDER BY` trie, `LIMIT` limite ;
- `INSERT`, `UPDATE`, `DELETE` modifient les données ;
- un `UPDATE` ou `DELETE` **sans `WHERE`** touche **toutes** les lignes : prudence absolue.

## Les jointures

Pour combiner des données de plusieurs tables, on utilise une **jointure** :

```sql
-- Chaque article avec le nom de son auteur
SELECT articles.titre, utilisateurs.nom
FROM articles
JOIN utilisateurs ON utilisateurs.id = articles.auteur_id
WHERE articles.publie = true;
```

Une jointure relie les lignes selon une condition, le plus souvent l'égalité d'une clé étrangère et d'une clé primaire. (Le parcours Data Engineering approfondit SQL ; ici, l'essentiel pour une application.)

# Les relations

| Type | Exemple | Mise en œuvre |
|---|---|---|
| **Un à plusieurs** | Un utilisateur a plusieurs articles | Clé étrangère côté « plusieurs » (`articles.auteur_id`) |
| **Plusieurs à plusieurs** | Un article a plusieurs tags, un tag plusieurs articles | Table d'association (`articles_tags`) |
| **Un à un** | Un utilisateur a un profil | Clé étrangère unique |

Les **index** accélèrent les recherches sur les colonnes souvent filtrées (comme `email`), au prix d'un léger surcoût à l'écriture. Les clés primaires et uniques sont indexées automatiquement.

# La sécurité : requêtes paramétrées

> [!WARNING]
> **Ne construisez jamais** une requête SQL par concaténation de chaînes contenant des données utilisateur : c'est la porte ouverte à l'**injection SQL** (parcours sécurité). Utilisez **toujours** des **requêtes paramétrées**, où la donnée est transmise séparément de la requête.

```ts
// DANGEREUX
const r = await db.query(`SELECT * FROM utilisateurs WHERE email = '${email}'`);

// SÛR : paramètre séparé
const r = await db.query("SELECT * FROM utilisateurs WHERE email = $1", [email]);
```

# Transactions et index

## Les transactions

Certaines opérations doivent réussir **entièrement ou pas du tout**. Un virement débite un compte et en crédite un autre ; une commande crée la commande, ses lignes et décrémente le stock. Si le serveur s'arrête entre deux requêtes, les données deviennent incohérentes. Une **transaction** regroupe plusieurs requêtes en une seule unité :

```sql
BEGIN;
UPDATE comptes SET solde = solde - 100 WHERE id = 1;
UPDATE comptes SET solde = solde + 100 WHERE id = 2;
COMMIT; -- ou ROLLBACK en cas d'erreur : rien n'est appliqué
```

Les bases relationnelles garantissent les propriétés **ACID** : **Atomicité** (tout ou rien), **Cohérence** (les contraintes restent respectées), **Isolation** (les transactions simultanées ne se voient pas à moitié faites), **Durabilité** (une fois validée, la modification survit à une panne). Avec Prisma, on utilise `prisma.$transaction(...)` (chapitre suivant).

> [!WARNING]
> Attention aux **accès concurrents** : deux requêtes qui lisent le stock (1 article restant), puis décrémentent chacune, vendent deux fois le dernier article. Solutions : faire le calcul **dans la requête** (`UPDATE produits SET stock = stock - 1 WHERE id = $1 AND stock > 0`, puis vérifier le nombre de lignes modifiées), une **contrainte** (`CHECK (stock >= 0)`, `UNIQUE`), ou un verrou (`SELECT ... FOR UPDATE`).

## Les index

Sans index, chercher un utilisateur par e-mail oblige la base à **parcourir toute la table**. Un **index** est une structure (comme l'index d'un livre) qui permet de retrouver les lignes très vite :

```sql
CREATE UNIQUE INDEX utilisateurs_email_idx ON utilisateurs (email);
CREATE INDEX taches_projet_statut_idx ON taches (projet_id, statut);
```

- On indexe les colonnes utilisées dans les **filtres** (`WHERE`), les **jointures** (clés étrangères) et les **tris** fréquents.
- La clé primaire et les contraintes `UNIQUE` sont indexées automatiquement ; les **clés étrangères ne le sont pas** dans PostgreSQL.
- Un index accélère les lectures mais ralentit un peu les écritures et prend de la place : on n'indexe pas tout.
- `EXPLAIN ANALYZE` devant une requête montre si un index est utilisé ou si la table est parcourue entièrement (*Seq Scan*).

# SQL ou NoSQL ?

Les bases **NoSQL** (MongoDB, Redis, etc.) ne suivent pas le modèle relationnel. Les plus courantes sont **orientées documents** (stockage de documents JSON flexibles).

```diagram
type: compare
title: Relationnel ou NoSQL ?
columns:
  - title: SQL (relationnel)
    tone: teal
    items:
      - Données structurées et reliées
      - Schéma clair, intégrité garantie
      - Requêtes et jointures puissantes
      - Le choix par défaut
  - title: NoSQL (documents)
    tone: blue
    items:
      - Schéma flexible
      - Mise à l'échelle horizontale aisée
      - Peu ou pas de jointures
      - Cas spécifiques (très gros volumes, données peu structurées)
```

> [!TIP]
> Pour la très grande majorité des applications, une base **relationnelle** (PostgreSQL) est le bon choix par défaut : les données réelles sont presque toujours reliées entre elles, et l'intégrité est précieuse. On ne passe à NoSQL que pour des besoins **spécifiques** bien identifiés, pas « parce que c'est moderne ». PostgreSQL gère d'ailleurs aussi très bien le JSON quand il en faut.

# Exercices

## Exercice 1 : Modéliser

Modélisez (tables et clés) un mini-blog : des utilisateurs, des articles (écrits par un utilisateur), et des commentaires (écrits par un utilisateur sur un article).

<details>
<summary>Voir la solution</summary>

```sql
CREATE TABLE utilisateurs (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  nom TEXT NOT NULL
);

CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  titre TEXT NOT NULL,
  contenu TEXT NOT NULL,
  auteur_id INTEGER NOT NULL REFERENCES utilisateurs(id)
);

CREATE TABLE commentaires (
  id SERIAL PRIMARY KEY,
  texte TEXT NOT NULL,
  article_id INTEGER NOT NULL REFERENCES articles(id),
  auteur_id INTEGER NOT NULL REFERENCES utilisateurs(id),
  cree_le TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Deux relations un-à-plusieurs : un utilisateur → plusieurs articles/commentaires ; un article → plusieurs commentaires.

</details>

## Exercice 2 : Écrire des requêtes

Écrivez : (a) les 5 derniers articles publiés avec le nom de leur auteur ; (b) le nombre de commentaires de l'article 42.

<details>
<summary>Voir la solution</summary>

```sql
-- (a)
SELECT a.titre, u.nom
FROM articles a
JOIN utilisateurs u ON u.id = a.auteur_id
WHERE a.publie = true
ORDER BY a.id DESC
LIMIT 5;

-- (b)
SELECT count(*) FROM commentaires WHERE article_id = 42;
```

</details>

## Exercice 3 : L'injection

Un développeur écrit `db.query("SELECT * FROM users WHERE nom = '" + nom + "'")`. Que peut-il se passer, et comment corriger ?

<details>
<summary>Voir la solution</summary>

Si `nom` vaut `' OR '1'='1`, la condition devient toujours vraie et renvoie **toute** la table ; des variantes permettent de lire, modifier ou supprimer des données : c'est une **injection SQL**. Correction : une **requête paramétrée**, `db.query("SELECT * FROM users WHERE nom = $1", [nom])`, où la base traite `nom` comme une simple valeur, quoi qu'il contienne. (En pratique, un ORM comme Prisma, chapitre suivant, le fait pour nous.)

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Bases de données et SQL
center: Conserver et relier les données en tables, les interroger en SQL, en se protégeant des injections.
points:
  - icon: database
    title: Pourquoi
    text: Stockage durable, requêtes efficaces, accès concurrents sûrs, intégrité.
  - icon: layers
    title: Modèle relationnel
    text: Tables, lignes, colonnes typées, clé primaire, clé étrangère pour relier.
  - icon: search
    title: SQL
    text: SELECT, INSERT, UPDATE, DELETE, JOIN ; jamais UPDATE ou DELETE sans WHERE.
  - icon: shield
    title: Requêtes paramétrées
    text: Données séparées de la requête, contre l'injection SQL.
  - icon: scale
    title: SQL ou NoSQL
    text: Relationnel par défaut ; NoSQL pour des besoins spécifiques identifiés.
  - icon: lock
    title: Transactions et index
    text: Tout ou rien pour les opérations liées ; index sur les filtres et clés étrangères.
pitfall: Construire du SQL par concaténation de chaînes et s'exposer à l'injection.
remember: Les données réelles sont presque toujours reliées ; le relationnel est le bon choix par défaut.
```
