---
title: SQL avancé pour l'analytique
description: "CTE, CASE, agrégation conditionnelle, fonctions de fenêtrage, dédoublonnage et requêtes récursives : les outils SQL du quotidien d'un Data Engineer."
duration: 80
objectives:
  - Structurer une requête complexe avec des CTE
  - Utiliser CASE et l'agrégation conditionnelle
  - Maîtriser les fonctions de fenêtrage (classement, décalage, cumuls)
  - Dédoublonner des données et calculer des indicateurs temporels
  - Reconnaître et résoudre les motifs classiques (îlots, sessions, sous-totaux, entonnoirs)
---

# Structurer avec les CTE

Une **CTE** (*Common Table Expression*, clause `WITH`) nomme un résultat intermédiaire. Elle rend une requête complexe **lisible**, comme une suite d'étapes, au lieu d'un empilement de sous-requêtes.

```sql
WITH commandes_valides AS (
    SELECT client_id, passee_le, montant
    FROM commandes
    WHERE statut <> 'annulee'
),
ca_par_client AS (
    SELECT client_id, sum(montant) AS ca, count(*) AS nb
    FROM commandes_valides
    GROUP BY client_id
)
SELECT c.nom, p.ca, p.nb, round(p.ca / p.nb, 2) AS panier_moyen
FROM ca_par_client AS p
JOIN clients AS c ON c.id = p.client_id
ORDER BY p.ca DESC
LIMIT 20;
```

> [!TIP]
> Nommez chaque CTE d'après **ce qu'elle contient** (`commandes_valides`, `ca_par_client`), pas d'après ce qu'elle fait (`etape2`). C'est exactement la logique des modèles dbt (module 4) : chaque modèle est une étape nommée et réutilisable.

# CASE et agrégation conditionnelle

`CASE` produit une valeur selon des conditions, évaluées dans l'ordre :

```sql
SELECT
    id,
    montant,
    CASE
        WHEN montant >= 200 THEN 'gros panier'
        WHEN montant >= 50  THEN 'panier moyen'
        ELSE 'petit panier'
    END AS segment
FROM commandes;
```

L'**agrégation conditionnelle** calcule plusieurs indicateurs en une seule lecture de la table :

```sql
SELECT
    date_trunc('month', passee_le)                          AS mois,
    count(*)                                                AS nb_commandes,
    count(*) FILTER (WHERE statut = 'annulee')              AS nb_annulees,
    sum(montant) FILTER (WHERE statut <> 'annulee')         AS ca,
    round(100.0 * count(*) FILTER (WHERE statut = 'annulee') / count(*), 1) AS taux_annulation_pct
FROM commandes
GROUP BY 1
ORDER BY 1;
```

`FILTER (WHERE …)` est standard (PostgreSQL, DuckDB, SQLite). Partout ailleurs, l'équivalent portable est `sum(CASE WHEN statut = 'annulee' THEN 1 ELSE 0 END)`.

> [!NOTE]
> `100.0 * …` force un calcul décimal : en PostgreSQL, la division de deux entiers est une **division entière** (`7 / 2` vaut `3`).

# Les fonctions de fenêtrage

Une **fonction de fenêtrage** (*window function*) calcule une valeur pour chaque ligne **à partir d'un ensemble de lignes liées**, sans les regrouper : contrairement à `GROUP BY`, le nombre de lignes ne change pas.

```text
fonction(...) OVER (
    PARTITION BY ...   -- découpe en groupes indépendants (optionnel)
    ORDER BY ...       -- ordre à l'intérieur de chaque groupe
    ROWS BETWEEN ...   -- cadre : quelles lignes prendre en compte (optionnel)
)
```

```diagram
type: compare
title: GROUP BY ou fenêtre ?
columns:
  - title: GROUP BY
    tone: blue
    items:
      - Une ligne par groupe
      - Les détails disparaissent
      - Total des ventes par client
  - title: Fonction de fenêtrage
    tone: teal
    items:
      - Autant de lignes qu'en entrée
      - Chaque ligne garde ses détails
      - Chaque vente avec le total de son client
```

## Classer

```sql
SELECT
    client_id,
    id AS commande_id,
    passee_le,
    row_number() OVER (PARTITION BY client_id ORDER BY passee_le) AS rang_commande
FROM commandes;
```

- `row_number()` : 1, 2, 3, 4… (numéros uniques, départage arbitraire en cas d'égalité) ;
- `rank()` : 1, 2, 2, 4… (ex aequo, puis saut) ;
- `dense_rank()` : 1, 2, 2, 3… (ex aequo, sans saut).

## Comparer avec la ligne précédente

```sql
SELECT
    client_id,
    passee_le,
    passee_le - lag(passee_le) OVER (PARTITION BY client_id ORDER BY passee_le) AS delai_depuis_precedente
FROM commandes;
```

`lag()` lit la ligne **précédente** dans la fenêtre, `lead()` la **suivante**. Pour la première commande d'un client, `lag()` renvoie `NULL`.

## Cumuls et moyennes mobiles

```sql
WITH ventes_jour AS (
    SELECT date_trunc('day', passee_le)::date AS jour, sum(montant) AS ca
    FROM commandes
    WHERE statut <> 'annulee'
    GROUP BY 1
)
SELECT
    jour,
    ca,
    sum(ca) OVER (ORDER BY jour)                                         AS ca_cumule,
    avg(ca) OVER (ORDER BY jour ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS moyenne_mobile_7j
FROM ventes_jour
ORDER BY jour;
```

> [!WARNING]
> La moyenne mobile ci-dessus porte sur les **7 dernières lignes**, pas sur les 7 derniers jours : s'il manque des jours sans vente, la fenêtre couvre plus de 7 jours. Pour des calculs exacts, générez d'abord une ligne par jour (avec `generate_series` en PostgreSQL) puis faites une jointure externe, ou utilisez un cadre `RANGE` sur des intervalles quand le moteur le permet.

# Dédoublonner

Les données ingérées contiennent souvent des **doublons** : un événement envoyé deux fois, plusieurs versions d'un même enregistrement. Le motif standard garde **la dernière version** de chaque clé :

```sql
WITH classees AS (
    SELECT
        *,
        row_number() OVER (PARTITION BY id ORDER BY mis_a_jour_le DESC) AS rn
    FROM brut_clients
)
SELECT *
FROM classees
WHERE rn = 1;
```

Certains moteurs (BigQuery, Snowflake, DuckDB) proposent `QUALIFY`, qui filtre directement sur une fonction de fenêtrage :

```sql
SELECT *
FROM brut_clients
QUALIFY row_number() OVER (PARTITION BY id ORDER BY mis_a_jour_le DESC) = 1;
```

> [!IMPORTANT]
> Si deux versions ont exactement le même `mis_a_jour_le`, `row_number()` en choisit une **arbitrairement**, et le résultat peut changer d'une exécution à l'autre. Ajoutez un critère de départage déterministe (par exemple l'horodatage d'ingestion ou un numéro de séquence).

# Ensembles, dates et récursivité

## UNION et UNION ALL

`UNION ALL` concatène deux résultats ; `UNION` supprime en plus les doublons, ce qui impose un tri ou un hachage coûteux. Utilisez `UNION ALL` par défaut, et `UNION` seulement si vous voulez vraiment dédoublonner.

## Manipuler les dates

```sql
SELECT
    date_trunc('week', passee_le)        AS semaine,      -- début de semaine (lundi)
    extract(isodow FROM passee_le)       AS jour_semaine, -- 1 = lundi … 7 = dimanche
    passee_le AT TIME ZONE 'Europe/Paris' AS heure_locale_paris
FROM commandes;
```

Les noms et la syntaxe des fonctions de date varient selon les moteurs (`DATE_TRUNC(passee_le, WEEK)` en BigQuery, par exemple) : c'est la partie la moins portable de SQL.

## CTE récursive

Une CTE récursive parcourt une **hiérarchie** (organigramme, catégories imbriquées) :

```sql
WITH RECURSIVE hierarchie AS (
    SELECT id, nom, manager_id, 1 AS niveau
    FROM employes
    WHERE manager_id IS NULL                 -- point de départ : la direction
    UNION ALL
    SELECT e.id, e.nom, e.manager_id, h.niveau + 1
    FROM employes AS e
    JOIN hierarchie AS h ON e.manager_id = h.id
)
SELECT * FROM hierarchie ORDER BY niveau, nom;
```

# Motifs analytiques classiques

Quelques problèmes reviennent sans cesse, en production comme en entretien technique. Les reconnaître permet d'appliquer directement une solution éprouvée.

## Îlots et trous (*gaps and islands*)

Question type : « quelles sont les périodes de jours **consécutifs** pendant lesquelles chaque client s'est connecté ? ». L'astuce : pour des dates consécutives, la différence entre la date et son **numéro d'ordre** est constante. Elle identifie donc chaque îlot.

```sql
WITH jours AS (
    SELECT DISTINCT client_id, CAST(connecte_le AS date) AS jour
    FROM connexions
),
groupes AS (
    SELECT client_id, jour,
           jour - CAST(row_number() OVER (PARTITION BY client_id ORDER BY jour) AS integer) AS ilot
    FROM jours
)
SELECT client_id,
       min(jour)        AS debut,
       max(jour)        AS fin,
       count(*)         AS nb_jours
FROM groupes
GROUP BY client_id, ilot
ORDER BY client_id, debut;
```

| jour | numéro | jour − numéro |
|---|---|---|
| 03/03 | 1 | 02/03 |
| 04/03 | 2 | 02/03 |
| 05/03 | 3 | 02/03 |
| 09/03 | 4 | 05/03 |

Les trois premiers jours partagent la même valeur : ils forment un îlot ; le 9 mars en commence un autre. (Selon le moteur, la soustraction s'écrit `jour - INTERVAL '1 day' * n` ou avec `date_sub`.)

## Sessionisation

Question type : « découper les clics de chaque visiteur en **sessions**, une nouvelle session commençant après 30 minutes d'inactivité ». On marque chaque début de session avec `lag`, puis une **somme cumulée** de ces marqueurs numérote les sessions.

```sql
WITH marques AS (
    SELECT visiteur_id, clic_le,
           CASE
               WHEN lag(clic_le) OVER (PARTITION BY visiteur_id ORDER BY clic_le) IS NULL
                 OR clic_le - lag(clic_le) OVER (PARTITION BY visiteur_id ORDER BY clic_le) > INTERVAL '30 minutes'
               THEN 1 ELSE 0
           END AS nouvelle_session
    FROM clics
)
SELECT visiteur_id, clic_le,
       sum(nouvelle_session) OVER (PARTITION BY visiteur_id ORDER BY clic_le
                                   ROWS UNBOUNDED PRECEDING) AS numero_session
FROM marques;
```

Le même motif « marquer les ruptures, puis somme cumulée » sert à découper n'importe quelle séquence : changements de statut, trajets d'un véhicule, épisodes d'une panne.

## Sous-totaux : GROUPING SETS et ROLLUP

Pour obtenir dans **une seule requête** le chiffre d'affaires par région et catégorie, par région, et le total général :

```sql
SELECT region, categorie, sum(montant) AS ca,
       GROUPING(region) AS est_total_region,     -- 1 quand la ligne agrège toutes les régions
       GROUPING(categorie) AS est_total_categorie
FROM ventes
GROUP BY ROLLUP (region, categorie)
ORDER BY region NULLS LAST, categorie NULLS LAST;
```

`ROLLUP (a, b)` produit les regroupements `(a, b)`, `(a)` et `()`. `CUBE (a, b)` produit toutes les combinaisons, et `GROUPING SETS` permet de lister exactement celles qu'on veut. La fonction `GROUPING()` distingue un vrai `NULL` dans les données d'un `NULL` qui signifie « tous ».

## Entonnoirs de conversion

Question type : « parmi les visiteurs qui ont vu un produit, combien l'ont ajouté au panier, puis ont payé, **dans cet ordre** ? ». L'agrégation conditionnelle sur la première date de chaque étape suffit souvent :

```sql
WITH etapes AS (
    SELECT visiteur_id,
           min(CASE WHEN evenement = 'vue_produit' THEN horodatage END) AS t_vue,
           min(CASE WHEN evenement = 'ajout_panier' THEN horodatage END) AS t_panier,
           min(CASE WHEN evenement = 'paiement'    THEN horodatage END) AS t_paiement
    FROM evenements
    GROUP BY visiteur_id
)
SELECT count(t_vue)                                                      AS vues,
       count(CASE WHEN t_panier > t_vue THEN 1 END)                      AS paniers,
       count(CASE WHEN t_paiement > t_panier AND t_panier > t_vue THEN 1 END) AS paiements
FROM etapes;
```

> [!TIP]
> Avant d'écrire une requête compliquée, demandez-vous si le problème est un de ces motifs : « périodes consécutives » (îlots), « regrouper ce qui est proche dans le temps » (sessions), « totaux à plusieurs niveaux » (`ROLLUP`), « étapes dans l'ordre » (entonnoir), « dernière version de chaque ligne » (dédoublonnage par `row_number`).

# Exercices

## Exercice 1 : Première et dernière commande

Pour chaque client, affichez la date de sa première commande, celle de sa dernière, et le montant de sa **dernière** commande.

<details>
<summary>Voir la solution</summary>

```sql
WITH classees AS (
    SELECT
        client_id,
        passee_le,
        montant,
        min(passee_le)  OVER (PARTITION BY client_id) AS premiere,
        row_number()    OVER (PARTITION BY client_id ORDER BY passee_le DESC, id DESC) AS rn
    FROM commandes
    WHERE statut <> 'annulee'
)
SELECT client_id, premiere, passee_le AS derniere, montant AS montant_derniere
FROM classees
WHERE rn = 1;
```

`id DESC` sert de critère de départage si deux commandes ont le même horodatage.

</details>

## Exercice 2 : Évolution mensuelle

Calculez pour chaque mois le chiffre d'affaires et sa variation en pourcentage par rapport au mois précédent.

<details>
<summary>Voir la solution</summary>

```sql
WITH mensuel AS (
    SELECT date_trunc('month', passee_le) AS mois, sum(montant) AS ca
    FROM commandes
    WHERE statut <> 'annulee'
    GROUP BY 1
)
SELECT
    mois,
    ca,
    round(100.0 * (ca - lag(ca) OVER (ORDER BY mois)) / nullif(lag(ca) OVER (ORDER BY mois), 0), 1) AS variation_pct
FROM mensuel
ORDER BY mois;
```

`nullif(x, 0)` évite une division par zéro (le résultat vaut alors `NULL`). Le premier mois n'a pas de précédent : sa variation est `NULL`.

</details>

## Exercice 3 : rank ou row_number ?

Vous voulez le **meilleur produit** (par chiffre d'affaires) de chaque catégorie. Deux produits sont à égalité en tête dans une catégorie. Quelle fonction utiliser selon que vous voulez un seul produit, ou tous les ex aequo ?

<details>
<summary>Voir la solution</summary>

- Un seul produit par catégorie : `row_number()` avec un critère de départage explicite (`ORDER BY ca DESC, produit_id`) pour un résultat déterministe.
- Tous les ex aequo : `rank()` (ou `dense_rank()`) et filtre `= 1` : les deux produits à égalité obtiennent le rang 1.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: SQL avancé pour l'analytique
center: Découper en CTE nommées, calculer avec des fenêtres sans perdre le détail des lignes.
points:
  - icon: layers
    title: CTE
    text: Des étapes nommées d'après leur contenu, lisibles comme un pipeline.
  - icon: filter
    title: Agrégation conditionnelle
    text: Plusieurs indicateurs en une lecture avec FILTER ou sum(CASE …).
  - icon: list
    title: Fenêtres
    text: PARTITION BY, ORDER BY, cadre ; row_number, rank, lag, lead, cumuls.
  - icon: check
    title: Dédoublonner
    text: row_number par clé, garder rn = 1, avec un départage déterministe.
  - icon: clock
    title: Dates
    text: date_trunc pour regrouper ; syntaxe variable selon les moteurs.
  - icon: puzzle
    title: Motifs classiques
    text: Îlots (date − rang), sessions (ruptures + somme cumulée), ROLLUP, entonnoirs.
pitfall: Une moyenne « 7 jours » calculée sur 7 lignes alors que certains jours sont absents.
remember: Une requête non déterministe donne des chiffres qui changent sans que les données aient changé.
```
