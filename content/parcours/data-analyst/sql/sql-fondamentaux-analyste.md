---
title: SQL fondamental pour l'analyste
description: "Lire et filtrer une table e-commerce : SELECT, WHERE, tris, LIMIT, types, NULL, DISTINCT et alias, du point de vue de l'analyste et non de l'administrateur."
duration: 55
objectives:
  - Lire le grain d'une table avant d'écrire une requête
  - Filtrer, trier et limiter sans prendre un extrait pour un résultat
  - Maîtriser NULL, les types, DISTINCT et les alias dans une requête d'analyse
---

# Lire le grain avant d'écrire

Vous n'administrez pas la base. Vous ne créez pas d'utilisateur, vous ne modifiez pas une commande, vous ne « réparez » pas une ligne à la main. Vous posez des questions à des tables que d'autres maintiennent. La première question n'est pas une syntaxe. C'est : que représente une ligne ?

Chez Fil & Cie, une ligne de `commandes` est une commande. Une ligne de `clients` est un compte. Tant que vous ne joignez pas, compter les lignes de `commandes` compte des commandes, pas des clients, pas des articles. Cette évidence évite la moitié des chiffres faux. Le reste de ce chapitre reste sur une seule table. Les jointures et les agrégats viennent ensuite. Ici, vous apprenez à lire juste.

Le schéma qui sert d'exemple, en syntaxe PostgreSQL (DuckDB s'en approche assez pour s'entraîner) :

```sql
CREATE TABLE clients (
    id         bigint PRIMARY KEY,
    email      text NOT NULL,
    pays       text,
    cree_le    date NOT NULL
);

CREATE TABLE commandes (
    id          bigint PRIMARY KEY,
    client_id   bigint NOT NULL,
    passee_le   timestamptz NOT NULL,
    statut      text NOT NULL,
    montant_ht  numeric(10, 2) NOT NULL
);
```

`statut` prend des valeurs convenues : `payee`, `expediee`, `annulee`, `remboursee`. Elles ne sont pas devinées par la base. Vous les confirmez avec un échantillon, pas avec la mémoire d'une réunion.

> [!NOTE]
> Si vous n'avez pas le droit d'exécuter un `CREATE`, ignorez-le. Il documente les colonnes. Votre travail commence au `SELECT`.

# Sélectionner des colonnes

`SELECT` choisit les colonnes. `FROM` choisit la table. Vous nommez les colonnes dont la question a besoin. `SELECT *` est acceptable pour un coup d'œil sur dix lignes. Il est mauvais dans une requête que vous allez relire : une colonne ajoutée la nuit change votre export, et vous emportez des e-mails dont vous n'aviez pas besoin.

```sql
SELECT
    id,
    client_id,
    passee_le,
    statut,
    montant_ht
FROM commandes;
```

L'ordre des colonnes dans le `SELECT` est l'ordre de votre lecture, pas un effet sur le calcul. Mettez d'abord ce qui identifie la ligne (`id`), puis le fait métier (`statut`, `montant_ht`). Une requête d'analyste se lit comme une phrase : quelles commandes, quelles informations. Elle ne se lit pas comme un tir groupé de colonnes « au cas où ».

Vous pouvez calculer une colonne à la volée, sans modifier la table. Un montant TTC indicatif, si la TVA applicable est 20 % et seulement dans ce cas, s'écrit dans le `SELECT`. Vous ne stockez pas ce calcul dans un coin de tableur en espérant que la règle reste vraie. Si plusieurs taux coexistent, cette formule est fausse, et c'est précisément le genre de règle qui doit être écrite, pas sous-entendue.

```sql
SELECT
    id,
    montant_ht,
    montant_ht * 1.20 AS montant_ttc_indicatif
FROM commandes;
```

# Filtrer les lignes qui comptent

`WHERE` garde les lignes pour lesquelles la condition est vraie. C'est le périmètre du cadrage, traduit en SQL. « Commandes payées de mars 2026 » n'est pas `statut = 'payee' AND passee_le = 'mars'`. C'est un intervalle de dates, un statut, et souvent une exclusion que la table n'exprime pas encore (les comptes internes apparaîtront quand vous joindrez `clients`).

```sql
SELECT id, client_id, passee_le, montant_ht
FROM commandes
WHERE statut = 'payee'
  AND passee_le >= TIMESTAMPTZ '2026-03-01 00:00:00+00'
  AND passee_le <  TIMESTAMPTZ '2026-04-01 00:00:00+00';
```

L'intervalle est semi-ouvert : début inclus, fin exclue. Vous évitez ainsi de discuter la dernière seconde du 31 mars, et vous ne perdez pas une commande passée le 31 à 23 h 59 avec des fractions de seconde. Comparer avec `BETWEEN` sur des horodatages inclut la borne de fin et mélange facilement deux mois.

Les comparaisons utiles tiennent en peu d'opérateurs. `=` et `<>` pour un statut. `IN ('payee', 'expediee')` quand plusieurs statuts comptent comme une vente. `>=` et `<` pour les dates. `LIKE 'laine%'` est un motif sur du texte, pas un filtre de catégorie propre : si la catégorie existe en colonne, vous filtrez la colonne. `AND` combine des conditions qui doivent toutes être vraies. `OR` élargit. Un `OR` mal parenthésé avec un `AND` change le périmètre sans bruit. Écrivez `(statut = 'payee' OR statut = 'expediee') AND passee_le >= ...` plutôt qu'une chaîne dont vous n'êtes plus sûr.

```sql
SELECT id, montant_ht
FROM commandes
WHERE statut IN ('payee', 'expediee')
  AND montant_ht > 0
  AND passee_le >= TIMESTAMPTZ '2026-03-01 00:00:00+00'
  AND passee_le <  TIMESTAMPTZ '2026-04-01 00:00:00+00';
```

> [!WARNING]
> Filtrer `statut <> 'annulee'` ne veut pas dire « ventes ». Une commande remboursée, ou un statut imprévu ajouté le mois dernier (`en_attente`), resterait dans le chiffre. Listez les statuts que vous gardez.

# Trier et limiter sans deviner

Sans `ORDER BY`, la base ne promet aucun ordre. L'ordre que vous voyez aujourd'hui peut changer après une mise à jour, un index ou un autre moteur. « Les dix premières lignes » d'un `SELECT` nu ne sont pas les dix plus grosses commandes. Ce sont dix lignes, point.

```sql
SELECT id, passee_le, montant_ht
FROM commandes
WHERE statut = 'payee'
ORDER BY montant_ht DESC, id
LIMIT 10;
```

`ORDER BY montant_ht DESC` classe du plus grand au plus petit. Ajouter `id` en second critère départage deux montants égaux de façon stable. `LIMIT 10` sans `ORDER BY` est un échantillon arbitraire, utile pour voir la forme des colonnes, inutilisable comme « top 10 ». `LIMIT` ne remplace pas un filtre de date : les dix plus grosses commandes de toute l'histoire ne sont pas les dix plus grosses de mars. Le `WHERE` d'abord, le tri ensuite.

```diagram
type: flow
title: Ordre de lecture d'une requête simple
steps:
  - title: FROM
    text: La table et le grain d'une ligne
    tone: blue
  - title: WHERE
    text: Le périmètre, ligne à ligne
    tone: amber
  - title: SELECT
    text: Les colonnes et les alias
    tone: teal
  - title: ORDER BY
    text: Un ordre explicite, ou aucun
    tone: violet
  - title: LIMIT
    text: Un plafond, pas un filtre métier
    tone: rose
```

Conséquence pratique : un alias créé dans le `SELECT` n'existe pas encore au moment du `WHERE`. La requête suivante est refusée, ou ne fait pas ce que vous croyez, selon le moteur.

```sql
SELECT montant_ht * 1.20 AS montant_ttc
FROM commandes
WHERE montant_ttc > 100;
```

Vous répétez l'expression dans le `WHERE`, ou vous filtrerez plus tard avec une sous-requête, vue au chapitre des CTE. L'alias, lui, est disponible dans l'`ORDER BY`, qui est évalué après le `SELECT`.

# Types, NULL et DISTINCT

Chaque colonne a un type. `montant_ht` est un `numeric`, pas du texte. Vous n'écrivez pas `montant_ht > '100'` en espérant que la base devine. `cree_le` est une date, sans heure. `passee_le` est un `timestamptz`, un instant avec fuseau. Comparer les deux sans règle (« les clients créés le jour de la commande ») demande de trancher le fuseau. Le chapitre sur la qualité des requêtes y revient. Ici, retenez de ne pas mélanger une date et un horodatage dans une égalité naïve.

`NULL` signifie inconnu, pas zéro, pas chaîne vide. Un client sans pays renseigné a `pays` à `NULL`. Toute comparaison avec `NULL` est inconnue, et `WHERE` ne garde que ce qui est vrai. Les trois requêtes suivantes ne font pas le même travail.

```sql
SELECT count(*) FROM clients WHERE pays = NULL;       -- toujours 0
SELECT count(*) FROM clients WHERE pays IS NULL;      -- les pays inconnus
SELECT count(*) FROM clients WHERE pays <> 'FR';      -- exclut aussi les NULL
```

`pays <> 'FR'` écarte la France et écarte aussi les pays inconnus, parce que « inconnu différent de FR » n'est pas vrai. Pour lister les clients hors France en gardant les pays manquants, il faut l'écrire : `pays IS DISTINCT FROM 'FR'`, ou `pays <> 'FR' OR pays IS NULL`. `COALESCE(pays, 'Inconnu')` sert à l'affichage. Il ne répare pas un filtre que vous avez mal posé.

`DISTINCT` dédoublonne les lignes du résultat, après le `SELECT`. `SELECT DISTINCT pays FROM clients` liste les pays présents, une fois chacun. Les `NULL` comptent pour une valeur distincte dans ce résultat. `DISTINCT` n'est pas un outil pour corriger une jointure qui a multiplié les commandes : vous cacheriez le symptôme. Sur une seule table, il répond à « quelles valeurs existent ? ». Il ne répond pas à « combien de commandes ? ».

| Expression | Ce qu'elle fait vraiment |
| --- | --- |
| `pays = NULL` | Jamais vrai. Le filtre ramène zéro ligne |
| `pays IS NULL` | Garde les pays inconnus |
| `pays <> 'FR'` | Garde les pays connus autres que FR |
| `COALESCE(pays, 'Inconnu')` | Affiche un libellé, ne change pas le filtre déjà appliqué |
| `SELECT DISTINCT pays` | Une ligne par valeur, pas un comptage de clients |

# Nommer avec des alias

Un alias de colonne renomme le résultat : `montant_ht * 1.20 AS montant_ttc_indicatif`. Un alias de table raccourcit un nom que vous allez répéter : `FROM commandes AS c`. Tant qu'il n'y a qu'une table, l'alias de table est facultatif. Prenez l'habitude de le poser quand même, court et stable (`c` pour commandes, `cl` pour clients). Les jointures du chapitre suivant s'en servent partout.

Choisissez des noms métier. `ca_ht` est discutable si la requête ne filtre pas encore les statuts. `montant_ht` reste honnête. `montant_ttc_indicatif` rappelle que le taux est une hypothèse. Un alias mensonger (`ca_net` pour un brut hors filtre de remboursement) est pire qu'un nom technique : il sera copié dans une slide.

```sql
SELECT
    c.id AS commande_id,
    c.passee_le,
    c.montant_ht,
    c.montant_ht * 1.20 AS montant_ttc_indicatif
FROM commandes AS c
WHERE c.statut = 'payee'
  AND c.passee_le >= TIMESTAMPTZ '2026-01-01 00:00:00+00'
  AND c.passee_le <  TIMESTAMPTZ '2026-02-01 00:00:00+00'
ORDER BY c.montant_ht DESC, c.id
LIMIT 20;
```

La requête ci-dessus se lit à voix haute : parmi les commandes payées de janvier 2026, les vingt plus gros montants hors taxes, avec un TTC indicatif à 20 %. Si la phrase ne correspond pas au SQL, ce n'est pas la phrase qu'il faut ajuster en réunion. C'est la requête.

> [!TIP]
> Relisez le `WHERE` en le traduisant. Chaque `AND` est un « et ». Si vous ne pouvez pas dire la phrase à la personne qui a posé la question, le filtre n'est pas encore le périmètre.

# Exercices

## Exercice 1 : Mars, pas « à peu près mars »

Écrivez une requête qui liste `id`, `client_id`, `passee_le` et `montant_ht` des commandes payées ou expédiées, passées en mars 2026, montants strictement positifs, triées de la plus récente à la plus ancienne. En cas d'égalité d'horodatage, triez par `id` croissant. N'utilisez pas `SELECT *`.

<details>
<summary>Voir la solution</summary>

```sql
SELECT
    id,
    client_id,
    passee_le,
    montant_ht
FROM commandes
WHERE statut IN ('payee', 'expediee')
  AND montant_ht > 0
  AND passee_le >= TIMESTAMPTZ '2026-03-01 00:00:00+00'
  AND passee_le <  TIMESTAMPTZ '2026-04-01 00:00:00+00'
ORDER BY passee_le DESC, id;
```

L'intervalle semi-ouvert couvre tout mars sans inclure le 1er avril. `IN` garde deux statuts de vente, pas « tout sauf annulé », qui laisserait passer un remboursement. Le tri secondaire sur `id` rend l'ordre stable. Il n'y a pas de `LIMIT` : la question demande la liste, pas un extrait.

</details>

## Exercice 2 : Le top 10 qui n'en est pas un

Un collègue envoie ceci et titre son tableau « Top 10 des commandes de mars ».

```sql
SELECT *
FROM commandes
WHERE passee_le >= TIMESTAMPTZ '2026-03-01 00:00:00+00'
LIMIT 10;
```

Listez les défauts, puis réécrivez la requête des dix plus gros montants HT des commandes payées de mars 2026.

<details>
<summary>Voir la solution</summary>

Défauts. `LIMIT 10` sans `ORDER BY` ne donne pas les plus gros montants, seulement dix lignes dans un ordre non garanti. La borne de fin manque : tout ce qui est postérieur au 1er mars entre, y compris avril et la suite. Le statut n'est pas filtré : annulées et remboursées peuvent figurer dans le « top ». `SELECT *` emporte des colonnes inutiles et sera instable si la table s'enrichit.

```sql
SELECT
    id,
    client_id,
    passee_le,
    montant_ht
FROM commandes
WHERE statut = 'payee'
  AND passee_le >= TIMESTAMPTZ '2026-03-01 00:00:00+00'
  AND passee_le <  TIMESTAMPTZ '2026-04-01 00:00:00+00'
ORDER BY montant_ht DESC, id
LIMIT 10;
```

Le `WHERE` fixe le mois et le statut. Le tri fixe le sens du « top ». `id` départage les égalités.

</details>

## Exercice 3 : Pays manquants

On vous demande les clients « hors France ». La requête suivante est proposée.

```sql
SELECT id, email
FROM clients
WHERE pays <> 'FR';
```

Sur 1 000 clients, 800 ont `pays = 'FR'`, 150 ont un autre pays, 50 ont `pays` NULL. Combien de lignes la requête renvoie-t-elle ? Écrivez la variante qui inclut les pays inconnus dans « hors France », et la variante d'affichage qui montre `Inconnu` sans perdre ces lignes.

<details>
<summary>Voir la solution</summary>

La requête renvoie 150 lignes. Les 50 `NULL` disparaissent, car `NULL <> 'FR'` n'est pas vrai. Les 800 France sont écartées, correctement.

Variante qui garde les inconnus :

```sql
SELECT id, email, pays
FROM clients
WHERE pays <> 'FR'
   OR pays IS NULL;
```

Affichage avec un libellé, même filtre :

```sql
SELECT id, email, COALESCE(pays, 'Inconnu') AS pays
FROM clients
WHERE pays IS DISTINCT FROM 'FR';
```

`COALESCE` ne sert qu'à l'affichage. Le filtre qui inclut les `NULL` doit être explicite (`OR pays IS NULL`, ou `IS DISTINCT FROM`). `WHERE pays = NULL` aurait renvoyé zéro ligne, quelle que soit la table.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: SQL, lire une table
center: "Une ligne a un grain. WHERE est le périmètre. Sans ORDER BY, l'ordre ne veut rien dire."
points:
  - icon: eye
    title: Le grain d'abord
    text: "Une ligne de commandes est une commande. Compter les lignes ne compte pas les clients."
  - icon: filter
    title: WHERE en intervalle
    text: "Début inclus, fin exclue. Listez les statuts gardés plutôt que d'exclure seulement annulé."
  - icon: list
    title: Tri puis limite
    text: "LIMIT sans ORDER BY est un extrait arbitraire, pas un top. Le filtre de date reste dans WHERE."
  - icon: alert
    title: NULL est inconnu
    text: "pays différent de FR écarte aussi les pays NULL. Testez-les avec IS NULL."
  - icon: code
    title: Des alias honnêtes
    text: "L'alias du SELECT ne se filtre pas dans WHERE. Un nom menteur finit dans une slide."
pitfall: "Titrer top 10 un LIMIT sans tri, ou appeler vente tout ce qui n'est pas annulé."
remember: "Relisez le WHERE comme une phrase. Si la phrase ne colle pas à la demande, corrigez la requête."
```
