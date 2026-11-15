---
title: Performance, transactions et chargement
description: "Index et plans d'exécution, transactions ACID et isolation, upsert et chargement en masse : écrire du SQL rapide et des chargements sûrs."
duration: 60
objectives:
  - Lire un plan d'exécution avec EXPLAIN ANALYZE
  - Créer des index utiles et écrire des conditions qui les exploitent
  - Comprendre les transactions, les propriétés ACID et les niveaux d'isolation
  - Charger des données en masse et réaliser un upsert idempotent
---

# Comment une base exécute une requête

SQL est **déclaratif** : on décrit le résultat voulu, et l'**optimiseur** de la base choisit **comment** l'obtenir (dans quel ordre joindre, quels index utiliser, quel algorithme de jointure). Ce choix s'appuie sur des **statistiques** sur les tables (nombre de lignes, distribution des valeurs).

La commande `EXPLAIN` montre le plan choisi ; `EXPLAIN ANALYZE` l'**exécute** et affiche les temps et nombres de lignes réels.

```sql
EXPLAIN ANALYZE
SELECT * FROM commandes WHERE client_id = 42;
```

```text
Seq Scan on commandes  (cost=0.00..21846.00 rows=12 width=48) (actual time=0.031..98.412 rows=9 loops=1)
  Filter: (client_id = 42)
  Rows Removed by Filter: 999991
Planning Time: 0.090 ms
Execution Time: 98.440 ms
```

Lecture : la base a parcouru **toute la table** (`Seq Scan`) et rejeté 999 991 lignes pour en garder 9. Un **index** sur `client_id` éviterait ce parcours.

> [!WARNING]
> `EXPLAIN ANALYZE` exécute réellement la requête. Sur un `UPDATE` ou un `DELETE`, faites-le dans une transaction annulée (`BEGIN; EXPLAIN ANALYZE …; ROLLBACK;`).

# Les index

Un **index** est une structure annexe (le plus souvent un **arbre B**, *B-tree*) qui permet de retrouver rapidement les lignes correspondant à une valeur, comme l'index d'un livre.

```sql
CREATE INDEX idx_commandes_client ON commandes (client_id);
```

```text
Index Scan using idx_commandes_client on commandes  (actual time=0.025..0.041 rows=9 loops=1)
  Index Cond: (client_id = 42)
Execution Time: 0.063 ms
```

De 98 ms à 0,06 ms. Mais un index a un **coût** : de l'espace disque, et chaque `INSERT`, `UPDATE` ou `DELETE` doit aussi le mettre à jour. On indexe donc les colonnes **réellement utilisées** dans les filtres et les jointures fréquents.

## Index composites

Un index sur plusieurs colonnes `(client_id, passee_le)` sert aux requêtes qui filtrent sur `client_id`, ou sur `client_id` **et** `passee_le`, mais en général pas à celles qui filtrent uniquement sur `passee_le` : l'ordre des colonnes compte, comme dans un annuaire trié par nom puis prénom.

## Écrire des conditions qui utilisent l'index

Une condition qui **transforme la colonne** empêche en général l'utilisation d'un index ordinaire sur cette colonne :

```sql
-- L'index sur passee_le n'est pas utilisable : la fonction s'applique à chaque ligne
SELECT * FROM commandes WHERE date_trunc('day', passee_le) = DATE '2026-03-02';

-- Réécriture équivalente qui utilise l'index : un intervalle sur la colonne brute
SELECT * FROM commandes
WHERE passee_le >= TIMESTAMPTZ '2026-03-02 00:00:00+00'
  AND passee_le <  TIMESTAMPTZ '2026-03-03 00:00:00+00';
```

> [!NOTE]
> Les **entrepôts en colonnes** (BigQuery, Snowflake, Redshift) fonctionnent autrement : peu ou pas d'index classiques, mais du **partitionnement** et du **clustering** (ou des clés de tri) qui permettent de sauter des blocs entiers de données. Le principe est le même : lire le moins de données possible. Le module 3 y revient.

# Les transactions

Une **transaction** regroupe plusieurs opérations qui doivent réussir **ensemble** ou pas du tout. Exemple classique : un virement débite un compte et en crédite un autre.

```sql
BEGIN;
UPDATE comptes SET solde = solde - 100 WHERE id = 1;
UPDATE comptes SET solde = solde + 100 WHERE id = 2;
COMMIT;   -- ou ROLLBACK; pour tout annuler
```

## Les propriétés ACID

| Propriété | Signification |
|---|---|
| **Atomicité** | Tout ou rien : en cas d'erreur, aucune modification partielle ne subsiste |
| **Cohérence** | La transaction fait passer la base d'un état valide à un autre (contraintes respectées) |
| **Isolation** | Les transactions concurrentes ne voient pas les états intermédiaires des autres (selon le niveau choisi) |
| **Durabilité** | Une fois validée (`COMMIT`), la modification survit à une panne |

## Isolation et concurrence

PostgreSQL utilise le **MVCC** (*Multi-Version Concurrency Control*) : chaque transaction voit un **instantané** cohérent des données, et les lecteurs ne bloquent pas les écrivains. Le niveau d'isolation fixe ce qu'une transaction peut voir des autres :

- **Read Committed** (défaut de PostgreSQL) : chaque requête voit les données validées au moment où **elle** démarre ;
- **Repeatable Read** : toute la transaction voit le même instantané ;
- **Serializable** : le résultat est garanti équivalent à une exécution en série ; la base peut annuler une transaction en conflit, qu'il faut alors **rejouer**.

> [!TIP]
> Pour un pipeline, la transaction est votre meilleure alliée : charger une table de remplacement puis la **substituer** dans la même transaction garantit que les utilisateurs voient soit l'ancienne version complète, soit la nouvelle, jamais un état à moitié chargé.

# Charger des données

## Le chargement en masse

Insérer un million de lignes avec un million d'`INSERT` séparés est très lent (un aller-retour réseau et une validation par ligne). Utilisez le chargement en masse :

```sql
-- PostgreSQL : chargement depuis un fichier CSV lisible par le serveur
COPY ventes_brutes (id, magasin, montant, vendu_le)
FROM '/data/ventes_2026-03-02.csv'
WITH (FORMAT csv, HEADER true);
```

Depuis Python, `psycopg` permet d'envoyer les données en flux avec `cursor.copy("COPY … FROM STDIN …")`. Les entrepôts cloud ont leurs équivalents (`COPY INTO` dans Snowflake, chargement de fichiers depuis le stockage objet dans BigQuery).

## L'upsert idempotent

Un pipeline doit pouvoir être **relancé sans dommage** : c'est l'**idempotence** (module 5). Si l'exécution d'hier a échoué à mi-chemin, la relancer ne doit pas créer de doublons. L'**upsert** (insérer, ou mettre à jour si la clé existe déjà) le permet :

```sql
INSERT INTO clients (id, nom, ville, mis_a_jour_le)
SELECT id, nom, ville, mis_a_jour_le
FROM staging_clients
ON CONFLICT (id) DO UPDATE
SET nom = EXCLUDED.nom,
    ville = EXCLUDED.ville,
    mis_a_jour_le = EXCLUDED.mis_a_jour_le
WHERE clients.mis_a_jour_le < EXCLUDED.mis_a_jour_le;   -- ne pas écraser par une version plus ancienne
```

`EXCLUDED` désigne la ligne qu'on tentait d'insérer. Le standard SQL propose aussi `MERGE` (disponible dans PostgreSQL depuis la version 15, ainsi que dans Snowflake, BigQuery, SQL Server).

```diagram
type: flow
title: Un chargement sûr et rejouable
steps:
  - title: Charger en staging
    text: COPY dans une table temporaire
    tone: blue
  - title: Contrôler
    text: Nombre de lignes, clés, NULL
    tone: amber
  - title: Upsert ou MERGE
    text: Dans une transaction
    tone: teal
  - title: Valider
    text: COMMIT, ou ROLLBACK en cas d'erreur
    tone: teal
```

# Exercices

## Exercice 1 : Lire un plan

Une requête `SELECT * FROM evenements WHERE utilisateur_id = 7 AND type = 'achat'` prend 4 secondes. `EXPLAIN ANALYZE` affiche `Seq Scan on evenements … Rows Removed by Filter: 48 000 000`. Que proposez-vous ?

<details>
<summary>Voir la solution</summary>

La table est entièrement parcourue. Créer un index adapté aux filtres, par exemple composite `(utilisateur_id, type)`, puis vérifier avec `EXPLAIN ANALYZE` qu'il est utilisé. Si la requête ne lit que quelques colonnes, les sélectionner explicitement au lieu de `SELECT *` (et éventuellement un index couvrant avec `INCLUDE`). Vérifier aussi que les statistiques sont à jour (`ANALYZE evenements`).

</details>

## Exercice 2 : Réécrire pour l'index

Réécrivez cette condition pour qu'elle puisse utiliser un index sur `cree_le` (type `date`) : `WHERE extract(year FROM cree_le) = 2025`.

<details>
<summary>Voir la solution</summary>

```sql
WHERE cree_le >= DATE '2025-01-01'
  AND cree_le <  DATE '2026-01-01'
```

La condition porte désormais sur la colonne brute, sous forme d'intervalle.

</details>

## Exercice 3 : Pipeline rejouable

Un pipeline quotidien fait `INSERT INTO ventes SELECT * FROM fichier_du_jour`. Il a planté hier après avoir inséré la moitié des lignes, et l'équipe l'a relancé. Quel est le problème, et comment le rendre idempotent ?

<details>
<summary>Voir la solution</summary>

Les lignes déjà insérées lors de la première tentative sont **insérées une seconde fois** : doublons. Solutions :

1. Envelopper le chargement dans une **transaction** : en cas d'échec, rien n'est inséré.
2. Utiliser un **upsert** (`ON CONFLICT (id) DO UPDATE` ou `MERGE`) sur une clé unique.
3. Ou, pour une partition de date : **supprimer puis réinsérer** les données du jour concerné dans la même transaction (`DELETE … WHERE jour = '2026-03-02'; INSERT …`).

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Performance et transactions
center: Lire moins de données pour aller vite, regrouper les écritures en transactions pour rester cohérent.
points:
  - icon: search
    title: EXPLAIN ANALYZE
    text: Voir le plan réel ; un Seq Scan qui rejette des millions de lignes appelle un index.
  - icon: list
    title: Index utiles
    text: Sur les filtres et jointures fréquents ; l'ordre des colonnes compte ; coût en écriture.
  - icon: filter
    title: Conditions sur la colonne brute
    text: Un intervalle plutôt qu'une fonction appliquée à la colonne.
  - icon: lock
    title: ACID et isolation
    text: Tout ou rien, MVCC, Read Committed par défaut dans PostgreSQL.
  - icon: loop
    title: Charger et rejouer
    text: COPY en masse, staging, puis upsert ou MERGE dans une transaction.
pitfall: Relancer un INSERT qui a échoué à mi-chemin et créer silencieusement des doublons.
remember: Un chargement doit pouvoir être relancé dix fois et donner le même résultat qu'une seule fois.
```
