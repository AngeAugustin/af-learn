---
title: "Fenêtres, CTE et sous-requêtes"
description: "Découper une analyse en étapes nommées, classer, comparer un mois au précédent et poser une cohorte avec WITH, les sous-requêtes et les fonctions de fenêtre."
duration: 55
objectives:
  - Découper un calcul avec WITH et savoir quand une sous-requête suffit
  - Classer avec ROW_NUMBER et RANK, comparer deux périodes avec LAG et LEAD
  - Calculer une part ou une cohorte avec SUM et COUNT fenêtrés
---

# Découper une question en étapes

Les requêtes des chapitres précédents tiennent sur un écran. Celles qui comparent un mois au précédent, ou qui suivent une cohorte, non. Empiler jointures, filtres et calculs dans un seul `SELECT` produit une requête juste et illisible. Vous la découpez en résultats intermédiaires, chacun avec un grain que vous pouvez compter.

Le moteur n'a pas besoin de ce découpage pour calculer. Vous en avez besoin pour vérifier. « Commandes payées », puis « une ligne par mois », puis « le mois d'avant à côté » : trois objets, trois contrôles. Si le CA de mars est faux, vous savez lequel des trois ouvrir. Une formule unique de quarante lignes ne le dit pas.

Fil & Cie sert encore d'exemple. Le grain de départ reste la commande payée. Le grain d'arrivée, pour une variation mensuelle, est le mois. Pour une cohorte, c'est le couple (mois de première commande, mois d'activité). Vous nommez ces grains avant d'écrire le SQL. Les outils de ce chapitre, CTE, sous-requête et fenêtre, ne choisissent pas le grain à votre place. Ils le rendent visible.

```diagram
type: pipeline
title: Du détail mensuel à la variation
lanes:
  - title: Préparer
    steps:
      - title: Payées
        text: Statut et période, grain commande
        tone: amber
      - title: Mois
        text: Une ligne par mois, CA et commandes
        tone: blue
  - title: Comparer
    steps:
      - title: Décalage
        text: Le CA du mois précédent sur la même ligne
        tone: teal
      - title: Variation
        text: Écart en euros, taux seulement si le passé n'est pas nul
        tone: violet
```

# Nommer les étapes avec WITH

Une CTE (`WITH`) donne un nom à un `SELECT`. La requête finale lit ce nom comme une table. Plusieurs CTE s'enchaînent, séparées par des virgules. Une CTE peut en utiliser une autre définie au-dessus.

```sql
WITH payees AS (
    SELECT id, client_id, passee_le, montant_ht
    FROM commandes
    WHERE statut = 'payee'
),
mensuel AS (
    SELECT
        date_trunc('month', passee_le) AS mois,
        count(*)                       AS nb_commandes,
        sum(montant_ht)                AS ca_ht
    FROM payees
    GROUP BY 1
)
SELECT mois, nb_commandes, ca_ht
FROM mensuel
ORDER BY mois;
```

`payees` est le périmètre. `mensuel` est l'agrégat. Le `SELECT` final ne fait plus que présenter. Vous pouvez, le temps du contrôle, remplacer le `SELECT` final par `SELECT count(*) FROM payees` ou par `SELECT * FROM mensuel`. C'est l'intérêt du découpage : chaque nom s'interroge seul.

Une CTE ne crée pas une table et n'accélère pas par magie. Le moteur a le droit de la recalculer. Vous ne l'utilisez pas pour « stocker » un résultat d'un jour sur l'autre. Vous l'utilisez pour nommer une étape. Si la même définition de « commande payée » doit survivre à votre fichier, placez-la dans une vue (chapitre suivant), pas dans une CTE recopiée dans douze requêtes.

> [!TIP]
> Nommez la CTE par son grain ou son filtre : `payees`, `mensuel`, `premiere_commande`. Un nom comme `t1` ou `temp` oblige à relire tout le bloc.

# Sous-requêtes, le résultat comme table

Une sous-requête est un `SELECT` entre parenthèses, là où une table ou une valeur est attendue. Dans le `FROM`, on l'appelle parfois table dérivée. Elle joue le même rôle qu'une CTE courte. Dès qu'elle s'imbrique ou qu'elle est réutilisée, la CTE se lit mieux. Les deux sont du SQL correct. Vous choisissez celle que le collègue relira.

```sql
SELECT client_id, ca_ht
FROM (
    SELECT client_id, sum(montant_ht) AS ca_ht
    FROM commandes
    WHERE statut = 'payee'
    GROUP BY client_id
) AS par_client
WHERE ca_ht > 500;
```

L'alias `par_client` est obligatoire dans PostgreSQL : la sous-requête du `FROM` doit porter un nom. Le filtre `ca_ht > 500` ne pouvait pas aller dans le `WHERE` interne, l'alias n'existait pas encore. Il vit à l'extérieur, ou dans un `HAVING` de la requête interne. Les deux sont justes. L'extérieur se lit « parmi les CA clients, ceux qui dépassent 500 ».

Une sous-requête dans le `WHERE` sert à tester l'existence. `EXISTS` répond à « ce client a-t-il au moins une commande payée ? » sans dupliquer les lignes du client, même s'il a vingt commandes.

```sql
SELECT cl.id, cl.email
FROM clients AS cl
WHERE EXISTS (
    SELECT 1
    FROM commandes AS c
    WHERE c.client_id = cl.id
      AND c.statut = 'payee'
);
```

`NOT IN (SELECT client_id FROM commandes)` semble lister les clients sans commande. Si la sous-requête contient un seul `client_id` à `NULL`, le `NOT IN` ne renvoie plus personne : une comparaison avec `NULL` n'est pas vraie. Vous n'avez pas ce `NULL` si `client_id` est contraint, mais vous ne misez pas dessus. `NOT EXISTS`, ou le `LEFT JOIN ... IS NULL` du chapitre précédent, ne tombe pas dans ce piège.

# Classer avec ROW_NUMBER et RANK

Une fonction de fenêtre calcule une valeur en regardant un ensemble de lignes, sans les compresser. Contrairement à `GROUP BY`, le détail reste. `ROW_NUMBER`, `RANK` et `DENSE_RANK` numérotent. La fenêtre se déclare avec `OVER`. `PARTITION BY` recommence la numérotation à chaque groupe. `ORDER BY` dans le `OVER` fixe l'ordre du numéro. Il ne remplace pas l'`ORDER BY` final, qui ne fait que présenter le résultat.

La dernière commande payée de chaque client est un classement, pas un agrégat. Vous numérotez dans le client, de la plus récente à la plus ancienne, et vous ne gardez que le rang 1. Un second critère (`id`) évite qu'un ex æquo de date reçoive un rang arbitraire différent à chaque exécution.

```sql
WITH classees AS (
    SELECT
        c.id,
        c.client_id,
        c.passee_le,
        c.montant_ht,
        row_number() OVER (
            PARTITION BY c.client_id
            ORDER BY c.passee_le DESC, c.id DESC
        ) AS rang
    FROM commandes AS c
    WHERE c.statut = 'payee'
)
SELECT id, client_id, passee_le, montant_ht
FROM classees
WHERE rang = 1;
```

`RANK` ne départage pas les égalités. Deux clients avec le même CA sont 1 et 1. Le suivant est 3, le rang 2 est sauté. `DENSE_RANK` donne 1, 1, puis 2, sans trou. `ROW_NUMBER` donne toujours 1, 2, 3, quitte à trancher l'égalité avec le `ORDER BY`. Pour un « top 10 » affiché, `ROW_NUMBER` ou `RANK` change le nombre de lignes si des montants sont égaux. Vous le dites dans la note. Un top 10 qui en contient 12 parce que trois clients sont ex æquo n'est pas un bug. C'est un choix de `RANK` non annoncé.

| Fonction | Ex æquo de CA | Rang suivant | Usage typique |
| --- | --- | --- | --- |
| `ROW_NUMBER` | 1 et 2, départagés par le tri | 3 | Une seule ligne gardée, ex. dernière commande |
| `RANK` | 1 et 1 | 3 | Classement où l'égalité partage la place |
| `DENSE_RANK` | 1 et 1 | 2 | Classement sans trou dans la numérotation |

```video
url: https://www.youtube.com/watch?v=rIcB4zMYMas
title: "SQL Window Functions | Clearly Explained | PARTITION BY, ORDER BY, ROW_NUMBER, RANK, DENSE_RANK"
channel: "Maven Analytics"
duration: "7:52"
lang: en
why: "PARTITION BY, ORDER BY, ROW_NUMBER, RANK et DENSE_RANK expliqués avec des schémas, le complément visuel idéal de cette section."
```

# Comparer une période à la précédente

`LAG` lit une colonne de la ligne précédente dans la fenêtre. `LEAD` lit la suivante. Sur une série mensuelle déjà agrégée, `LAG(ca_ht) OVER (ORDER BY mois)` est le CA du mois d'avant. Sans `ORDER BY` dans le `OVER`, « précédent » ne veut rien dire. Sans trou de mois dans la série, le précédent est bien le mois calendaire d'avant. S'il manque un mois (aucune commande), `LAG` saute au dernier mois présent. Vous le voyez en affichant le mois courant et le mois décalé côte à côte.

```sql
WITH payees AS (
    SELECT passee_le, montant_ht
    FROM commandes
    WHERE statut = 'payee'
),
mensuel AS (
    SELECT
        date_trunc('month', passee_le) AS mois,
        sum(montant_ht)                AS ca_ht
    FROM payees
    GROUP BY 1
)
SELECT
    mois,
    ca_ht,
    lag(ca_ht)  OVER (ORDER BY mois) AS ca_precedent,
    lead(ca_ht) OVER (ORDER BY mois) AS ca_suivant,
    ca_ht - lag(ca_ht) OVER (ORDER BY mois) AS ecart
FROM mensuel
ORDER BY mois;
```

Le taux de variation divise par le mois précédent. Si ce mois vaut 0, ou s'il n'existe pas (`LAG` renvoie `NULL` sur la première ligne), la division n'a pas de sens. Vous laissez le taux à `NULL` plutôt que d'afficher un pourcentage infini que personne ne défendra.

```sql
CASE
    WHEN lag(ca_ht) OVER (ORDER BY mois) IS NULL THEN NULL
    WHEN lag(ca_ht) OVER (ORDER BY mois) = 0 THEN NULL
    ELSE (ca_ht - lag(ca_ht) OVER (ORDER BY mois))
         / lag(ca_ht) OVER (ORDER BY mois)
END AS taux_variation
```

Répéter `LAG` trois fois est lisible et un peu lourd. Une CTE supplémentaire qui ne garde que `mois`, `ca_ht` et `ca_precedent` permet d'écrire le `CASE` une seule fois. C'est le même réflexe : nommer l'étape, puis calculer.

> [!WARNING]
> `LAG` ne devine pas le calendrier. Un mois absent de la table n'est pas une ligne à zéro. Si mars n'a aucune commande payée, avril se compare à février. Pour une série continue, il faut d'abord la grille des mois, puis un `LEFT JOIN` qui pose un zéro explicite.

# Sommes fenêtrées et cohortes

`SUM(montant_ht) OVER (PARTITION BY client_id)` répète, sur chaque commande du client, le CA total de ce client. Les lignes ne sont pas regroupées. Vous pouvez donc afficher la commande et sa part dans le CA du client : `montant_ht / sum(montant_ht) OVER (PARTITION BY client_id)`. Le dénominateur est le même sur toutes les lignes du client. Un `GROUP BY` vous aurait fait perdre le détail.

```sql
SELECT
    client_id,
    id AS commande_id,
    montant_ht,
    sum(montant_ht) OVER (PARTITION BY client_id) AS ca_client,
    montant_ht / sum(montant_ht) OVER (PARTITION BY client_id) AS part
FROM commandes
WHERE statut = 'payee';
```

Une cohorte, ici, est l'ensemble des clients qui partagent le même mois de première commande payée. Vous calculez ce mois une fois, vous le rattachez à chaque mois où le client a encore au moins une commande payée, et vous comptez. Ce n'est pas encore une analyse de rétention complète (courbe, seuil, interprétation produit). C'est la forme SQL qui la rend possible. Le chapitre métier sur les cohortes interprétera les taux. Ici, vous devez pouvoir sortir la matrice.

```sql
WITH premiere AS (
    SELECT
        client_id,
        date_trunc('month', min(passee_le)) AS mois_cohorte
    FROM commandes
    WHERE statut = 'payee'
    GROUP BY client_id
),
activite AS (
    SELECT
        client_id,
        date_trunc('month', passee_le) AS mois_activite
    FROM commandes
    WHERE statut = 'payee'
    GROUP BY client_id, date_trunc('month', passee_le)
)
SELECT
    p.mois_cohorte,
    a.mois_activite,
    count(*) AS clients_actifs
FROM premiere AS p
JOIN activite AS a ON a.client_id = p.client_id
GROUP BY p.mois_cohorte, a.mois_activite
ORDER BY 1, 2;
```

Le mois de cohorte contient tous les clients de la cohorte, puisque la première commande est une activité. Les mois suivants en contiennent moins si des clients ne rachètent pas. Le taux s'obtient en divisant `clients_actifs` par l'effectif de la cohorte, pas par le total de la table. Un `SUM(count(*)) OVER (PARTITION BY mois_cohorte)` serait faux : il additionne des présences sur plusieurs mois et compte plusieurs fois le même client. L'effectif est le `count(*)` du mois de cohorte, ou un `count` distinct fait dans `premiere`.

# Exercices

## Exercice 1 : Dernière commande et top des clients

Écrivez une CTE qui numérote les commandes payées de chaque client, de la plus récente à la plus ancienne, avec `id` décroissant en cas d'égalité de date. Le résultat final ne garde que la dernière commande (`commande_id`, `client_id`, `passee_le`, `montant_ht`).

Puis, en quelques lignes de prose, dites quelle fonction vous utiliseriez pour un classement des clients par CA HT payé où deux CA égaux partagent la même place et où le rang suivant saute un numéro. Quelle colonne ajouteriez-vous au `ORDER BY` si vous vouliez au contraire une seule place par client, sans ex æquo ?

<details>
<summary>Voir la solution</summary>

```sql
WITH classees AS (
    SELECT
        id AS commande_id,
        client_id,
        passee_le,
        montant_ht,
        row_number() OVER (
            PARTITION BY client_id
            ORDER BY passee_le DESC, id DESC
        ) AS rang
    FROM commandes
    WHERE statut = 'payee'
)
SELECT commande_id, client_id, passee_le, montant_ht
FROM classees
WHERE rang = 1;
```

`ROW_NUMBER` garantit un seul rang 1 par client. Le second critère `id` rend ce choix stable.

Pour le classement des clients par CA avec égalités partagées et un trou dans la numérotation, on agrège d'abord le CA par client, puis `RANK() OVER (ORDER BY ca_ht DESC)`. Le suivant après deux premiers ex æquo porte le rang 3. Pour interdire l'ex æquo et n'avoir qu'une place par client, `ROW_NUMBER`, avec un départage explicite dans le `ORDER BY` (par exemple `client_id`), sinon le moteur tranche tout seul et le classement peut changer.

</details>

## Exercice 2 : Variation mensuelle

À partir des commandes payées, produisez une ligne par mois avec le CA HT, le CA du mois précédent et l'écart. Le taux de variation doit être `NULL` quand le mois précédent est absent ou nul. Expliquez ce que devient avril si mars n'a aucune commande payée et que vous n'avez pas fabriqué de ligne mars à zéro.

<details>
<summary>Voir la solution</summary>

```sql
WITH mensuel AS (
    SELECT
        date_trunc('month', passee_le) AS mois,
        sum(montant_ht)                AS ca_ht
    FROM commandes
    WHERE statut = 'payee'
    GROUP BY 1
),
decale AS (
    SELECT
        mois,
        ca_ht,
        lag(ca_ht) OVER (ORDER BY mois) AS ca_precedent
    FROM mensuel
)
SELECT
    mois,
    ca_ht,
    ca_precedent,
    ca_ht - ca_precedent AS ecart,
    CASE
        WHEN ca_precedent IS NULL OR ca_precedent = 0 THEN NULL
        ELSE (ca_ht - ca_precedent) / ca_precedent
    END AS taux_variation
FROM decale
ORDER BY mois;
```

La CTE `decale` évite de répéter `LAG` dans le `CASE`. Si mars est absent, il n'y a pas de ligne mars. `LAG` d'avril renvoie février, pas un zéro de mars. L'écart d'avril commente alors deux mois. Pour comparer au calendrier, il faudrait une grille de mois et un montant 0 explicite avant le `LAG`.

</details>

## Exercice 3 : Cohorte et part de commande

On vous demande deux choses.

1. La matrice cohorte : mois de première commande payée, mois d'activité, nombre de clients distincts. Pourquoi `sum(count(*)) OVER (PARTITION BY mois_cohorte)` n'est-il pas l'effectif de la cohorte ?

2. Pour chaque commande payée, la part de son montant dans le CA HT du client. Le détail des commandes doit rester visible (pas une seule ligne par client).

<details>
<summary>Voir la solution</summary>

1. La matrice est celle du chapitre : CTE `premiere` (mois du `min(passee_le)` par client, statut payé), CTE `activite` (un couple client-mois), jointure sur `client_id`, `count(*)` groupé par les deux mois. `sum(count(*)) OVER (PARTITION BY mois_cohorte)` additionne les présences de tous les mois d'activité. Un client actif en janvier, février et mars compte trois fois. L'effectif de la cohorte est le nombre de clients dans `premiere` pour ce mois, égal au `count(*)` de la matrice sur la ligne où `mois_activite = mois_cohorte`.

2. La fenêtre répète le total client sans supprimer les commandes :

```sql
SELECT
    id AS commande_id,
    client_id,
    montant_ht,
    montant_ht / sum(montant_ht) OVER (PARTITION BY client_id) AS part
FROM commandes
WHERE statut = 'payee';
```

Un `GROUP BY client_id` aurait donné le CA, pas la part de chaque commande. Le `PARTITION BY` limite la somme au client. Il n'y a pas d'`ORDER BY` dans le `OVER` : on veut le total du groupe, pas un cumul ligne à ligne.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Étapes, rangs, cohortes
center: "Nommez chaque grain avec WITH. La fenêtre calcule sans effacer le détail des lignes."
points:
  - icon: layers
    title: Une CTE, un grain
    text: "payees puis mensuel. Chaque nom se contrôle seul. t1 ne dit rien à celui qui relit."
  - icon: search
    title: EXISTS, pas NOT IN
    text: "EXISTS teste la présence sans dupliquer. NOT IN avec un NULL peut tout vider."
  - icon: list
    title: Un rang explicite
    text: "ROW_NUMBER garde une ligne. RANK partage la place et saute le numéro suivant."
  - icon: loop
    title: LAG n'invente pas un mois
    text: "Sans ligne à zéro, un mois vide disparaît et le décalage saute au dernier mois présent."
  - icon: users
    title: Cohorte
    text: "Mois de première commande, puis mois d'activité. L'effectif n'additionne pas les mois."
pitfall: "Prendre la somme des présences mensuelles pour la taille de la cohorte et gonfler la base."
remember: "Si vous ne pouvez pas compter les lignes d'une étape, la requête est trop longue. Découpez-la."
```
