---
title: Jointures et agrégations
description: "Relier commandes, clients et lignes sans dupliquer le chiffre, puis agréger : CA, panier moyen, clients sans commande, HAVING et CASE."
duration: 55
objectives:
  - Choisir INNER, LEFT ou RIGHT selon les lignes que l'on veut garder
  - Repérer et éviter le gonflement du chiffre causé par une jointure
  - Agréger avec GROUP BY, COUNT, SUM, AVG, HAVING et CASE
---

# Joindre, c'est choisir un grain

Une jointure aligne deux tables selon une condition, presque toujours une clé. `commandes.client_id` pointe vers `clients.id`. `lignes_commande.commande_id` pointe vers `commandes.id`. Après la jointure, le grain n'est plus celui de la table de gauche. Il devient celui du couple de lignes qui a matché. Oublier cela, c'est additionner plusieurs fois le même montant.

Fil & Cie ajoute les articles :

```sql
CREATE TABLE lignes_commande (
    id            bigint PRIMARY KEY,
    commande_id   bigint NOT NULL,
    produit_id    bigint NOT NULL,
    quantite      integer NOT NULL,
    prix_unitaire numeric(10, 2) NOT NULL
);
```

Avant d'écrire le `JOIN`, vous dites la phrase : « je veux une ligne par commande », ou « une ligne par article », ou « une ligne par client, même sans commande ». La syntaxe vient après la phrase. Si vous ne pouvez pas la dire, vous n'êtes pas prêt à joindre.

Vous vérifiez deux comptes. Le nombre de lignes avant la jointure. Le nombre de lignes après. S'ils divergent, ou bien c'est voulu (plusieurs articles par commande), ou bien c'est un doublon (le même article répété, un référentiel produit non unique). Vous ne somme pas `commandes.montant_ht` tant que ce contrôle n'est pas fait.

> [!TIP]
> Écrivez le grain en commentaire au-dessus du `FROM`. Le jour où le CA paraît trop beau, ce commentaire dit quelle hypothèse il faut recompter.

# INNER, LEFT et RIGHT

`INNER JOIN` ne garde que les lignes qui trouvent une correspondance des deux côtés. Un client sans commande disparaît. Une commande dont le `client_id` n'existe plus dans `clients` disparaît aussi. C'est le bon choix pour « le CA des clients français » : sans pays, vous ne pouvez pas classer, et une commande orpheline ne doit pas se glisser dans un pays au hasard. Vous comptez toutefois ces orphelines à part, pour ne pas les perdre du total.

`LEFT JOIN` garde toutes les lignes de la table de gauche, et met `NULL` à droite quand rien ne correspond. C'est le bon choix pour « tous les clients, avec leur CA, y compris zéro ». La table dont vous voulez conserver les absents se place à gauche. `RIGHT JOIN` est le miroir : il garde la table de droite. Vous le lirez dans le code des autres. Dans le vôtre, préférez un `LEFT JOIN` en inversant les tables. Une requête qui se lit toujours de gauche à droite se relit mieux à 18 h.

```diagram
type: compare
title: Quelle jointure pour quelle question
columns:
  - title: INNER JOIN
    tone: teal
    items:
      - Seulement les correspondances
      - CA des clients dont le pays est connu
      - Les clients sans commande disparaissent
  - title: LEFT JOIN
    tone: blue
    items:
      - Toutes les lignes de gauche
      - NULL à droite s'il n'y a pas de match
      - Tous les clients, même sans commande
  - title: RIGHT JOIN
    tone: amber
    items:
      - Miroir du LEFT JOIN
      - Garde toutes les lignes de droite
      - À réécrire en LEFT JOIN pour la lecture
```

Le piège classique est de poser un `LEFT JOIN` puis de filtrer la table de droite dans le `WHERE`. Les `NULL` produits pour les clients sans commande ne passent pas le filtre. Le `LEFT JOIN` se comporte alors comme un `INNER JOIN`, et les clients à zéro disparaissent. La condition sur la table de droite se place dans le `ON`.

```sql
SELECT
    cl.id,
    cl.email,
    c.id AS commande_id
FROM clients AS cl
LEFT JOIN commandes AS c
       ON c.client_id = cl.id
      AND c.statut = 'payee'
WHERE cl.pays = 'FR';
```

Ici, le pays filtre les clients (table de gauche, dans le `WHERE`). Le statut payé filtre les commandes sans éliminer les clients français qui n'en ont pas (table de droite, dans le `ON`).

```video
url: https://www.youtube.com/watch?v=K9Y8P3X45kE
title: "SQL JOINs | INNER vs LEFT vs RIGHT vs FULL OUTER | Clearly Explained | Beginners Start Here!"
channel: "Maven Analytics"
duration: "9:19"
lang: en
why: "Maven Analytics compare INNER, LEFT, RIGHT et FULL OUTER JOIN avec des schémas clairs."
```

# Le piège des doublons de jointure

Joindre `commandes` à `lignes_commande` multiplie les lignes : une commande de trois articles devient trois lignes. C'est correct si vous sommez `quantite * prix_unitaire`. C'est faux si vous sommez `commandes.montant_ht`, répété sur chaque article. Le moteur ne signale rien. Le total est simplement trop grand, souvent d'un facteur deux ou trois.

```sql
-- Faux : montant_ht est répété une fois par article
SELECT sum(c.montant_ht) AS ca_gonfle
FROM commandes AS c
JOIN lignes_commande AS l ON l.commande_id = c.id
WHERE c.statut = 'payee';
```

La correction dépend de la question. Pour le CA des commandes, vous ne joignez pas les lignes. Pour le CA par catégorie, vous agrégez d'abord les lignes au grain voulu, puis vous joignez, ou vous partez des lignes et vous ne ramenez de `commandes` que des attributs qui ne seront pas sommés deux fois (le statut, la date), en filtrant avant la somme des montants de ligne.

```sql
SELECT sum(l.quantite * l.prix_unitaire) AS ca_lignes_ht
FROM commandes AS c
JOIN lignes_commande AS l ON l.commande_id = c.id
WHERE c.statut = 'payee';
```

Ce second chiffre n'est égal à `sum(commandes.montant_ht)` que si les lignes reconstituent exactement le montant commande (remises, frais de port, arrondis). Vous comparez les deux sur un mois clos. Un écart est une information, pas un détail. Il dit que « CA commande » et « CA articles » ne sont pas la même métrique. Le cadrage choisit, le SQL ne tranche pas à votre place.

> [!WARNING]
> `COUNT(*)` après une jointure compte des couples de lignes, pas des commandes. Pour compter des commandes dans un résultat déjà démultiplié, utilisez `COUNT(DISTINCT c.id)`, et demandez-vous d'abord si la jointure était nécessaire.

# Agréger avec GROUP BY

`GROUP BY` compresse les lignes en une ligne par groupe. Tout ce qui est dans le `SELECT` est soit dans le `GROUP BY`, soit passé dans une fonction d'agrégat : `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`. Oublier une colonne est une erreur de syntaxe, pas un arrondi.

`COUNT(*)` compte les lignes du groupe. `COUNT(cl.pays)` compte les pays non `NULL`. `COUNT(DISTINCT c.client_id)` compte les clients distincts, ce qui n'est pas le nombre de commandes. `SUM` ignore les `NULL` mais pas les zéros. `AVG` ignore les `NULL` : une moyenne de montants manquants n'est pas une moyenne qui compte ces lignes comme zéro. Si le zéro est le bon sens métier, transformez-le avec `COALESCE` avant d'agréger, et dites-le.

```sql
SELECT
    date_trunc('month', c.passee_le) AS mois,
    count(*)                         AS nb_commandes,
    count(DISTINCT c.client_id)      AS nb_clients,
    sum(c.montant_ht)                AS ca_ht,
    avg(c.montant_ht)                AS panier_moyen
FROM commandes AS c
WHERE c.statut = 'payee'
  AND c.passee_le >= TIMESTAMPTZ '2026-01-01 00:00:00+00'
  AND c.passee_le <  TIMESTAMPTZ '2026-04-01 00:00:00+00'
GROUP BY date_trunc('month', c.passee_le)
ORDER BY mois;
```

`WHERE` filtre les lignes avant l'agrégat. Une commande annulée n'entre donc ni dans le `COUNT` ni dans le `SUM`. Le panier moyen de cette requête est le CA HT divisé par le nombre de commandes payées du mois, pas par le nombre de clients. `nb_clients` est à côté, précisément pour ne pas mélanger les deux.

Le chiffre d'affaires par pays demande la jointure, puis le groupe. Les clients français sans commande n'ajoutent pas de CA. Un `INNER JOIN` suffit si vous ne voulez que les pays ayant vendu. Les commandes sans client joignable disparaîtraient : vous les comptez dans une requête séparée avant de publier.

```sql
SELECT
    cl.pays,
    sum(c.montant_ht) AS ca_ht
FROM commandes AS c
JOIN clients AS cl ON cl.id = c.client_id
WHERE c.statut = 'payee'
GROUP BY cl.pays
ORDER BY ca_ht DESC;
```

# HAVING, CASE et trois questions

`HAVING` filtre les groupes, après l'agrégat. « Les pays dont le CA payé dépasse 10 000 € » ne peut pas s'écrire dans le `WHERE` : le CA n'existe pas encore. Le statut, lui, reste dans le `WHERE`. Mélanger les deux est l'erreur la plus rentable de ce chapitre, au sens où elle change le total sans casser la requête.

`CASE` classe des lignes avant de les compter. Vous vous en servez pour un bucket (petit, moyen, gros panier) ou pour un indicateur 0/1. Il ne remplace pas un filtre que vous auriez oublié. Il évite trois requêtes quand la question est « combien de commandes dans chaque tranche ».

```sql
SELECT
    CASE
        WHEN c.montant_ht < 30 THEN 'petit'
        WHEN c.montant_ht < 80 THEN 'moyen'
        ELSE 'gros'
    END AS tranche,
    count(*) AS nb_commandes,
    sum(c.montant_ht) AS ca_ht
FROM commandes AS c
WHERE c.statut = 'payee'
GROUP BY 1
ORDER BY min(c.montant_ht);
```

Trois questions reviennent dans presque chaque boutique. Le CA, déjà vu, est une somme filtrée. Le panier moyen est cette somme divisée par le nombre de commandes, pas de clients. Les clients sans commande sont une anti-jointure : `LEFT JOIN`, puis `WHERE c.id IS NULL`. Ce `WHERE` est légitime. Il teste le vide produit par la jointure. Il ne filtre pas un attribut métier de la commande.

```sql
SELECT cl.id, cl.email
FROM clients AS cl
LEFT JOIN commandes AS c ON c.client_id = cl.id
WHERE c.id IS NULL;
```

| Question | Forme | Erreur fréquente |
| --- | --- | --- |
| CA HT payé | `SUM(montant_ht)` après filtre de statut | Sommer après une jointure vers les articles |
| Panier moyen | `SUM / COUNT(*)` au grain commande | Diviser par les clients, ou moyenner des moyennes |
| Clients sans commande | `LEFT JOIN` puis clé de droite `IS NULL` | Filtre de statut dans le `WHERE`, qui efface les absents |

`GROUP BY 1` désigne la première expression du `SELECT`. C'est lisible ici parce que l'expression `CASE` est longue. Si vous préférez répéter le `CASE` dans le `GROUP BY`, le résultat est le même. Ce qui ne l'est pas : grouper par un alias de `CASE` dans un moteur qui ne l'accepte pas dans le `GROUP BY`. En cas de doute, répétez l'expression. PostgreSQL accepte la position `1`. Tous les entrepôts ne le font pas avec la même souplesse. Vous visez une requête que le moteur du cours (PostgreSQL ou DuckDB) exécute, et vous notez l'écart si vous la portez ailleurs.

# Exercices

## Exercice 1 : Clients français, commandes payées, zéro compris

Écrivez une requête qui retourne, pour chaque client dont `pays = 'FR'`, l'e-mail, le nombre de commandes payées et le CA HT payé. Les clients français sans commande payée apparaissent avec un CA à 0. Ne gonflez pas le CA avec les articles.

<details>
<summary>Voir la solution</summary>

```sql
SELECT
    cl.id,
    cl.email,
    count(c.id)                  AS nb_commandes,
    coalesce(sum(c.montant_ht), 0) AS ca_ht
FROM clients AS cl
LEFT JOIN commandes AS c
       ON c.client_id = cl.id
      AND c.statut = 'payee'
WHERE cl.pays = 'FR'
GROUP BY cl.id, cl.email
ORDER BY ca_ht DESC, cl.id;
```

Le pays est un filtre de clients, donc dans le `WHERE`. Le statut est un filtre de commandes, donc dans le `ON`, sinon les clients sans commande payée disparaissent. `COUNT(c.id)` ignore les `NULL` et vaut 0 pour eux. `SUM` d'aucune ligne vaut `NULL` : `COALESCE` l'affiche à 0. On ne joint pas `lignes_commande`, le montant est déjà au grain commande.

</details>

## Exercice 2 : Le CA qui a triplé

La requête suivante annonce un CA HT trois fois trop élevé par rapport au total de `commandes` sur le même mois et le même statut.

```sql
SELECT sum(c.montant_ht) AS ca_ht
FROM commandes AS c
JOIN lignes_commande AS l ON l.commande_id = c.id
WHERE c.statut = 'payee'
  AND c.passee_le >= TIMESTAMPTZ '2026-03-01 00:00:00+00'
  AND c.passee_le <  TIMESTAMPTZ '2026-04-01 00:00:00+00';
```

Expliquez. Proposez une requête du CA au grain commande, et une requête du total `quantite * prix_unitaire`. Pourquoi les deux montants peuvent-ils différer même une fois le grain corrigé ?

<details>
<summary>Voir la solution</summary>

La jointure produit une ligne par article. `montant_ht` est répété sur chacune, puis sommé. Trois articles en moyenne, CA environ triple. Aucune erreur n'est levée.

CA au grain commande, sans jointure :

```sql
SELECT sum(c.montant_ht) AS ca_commandes_ht
FROM commandes AS c
WHERE c.statut = 'payee'
  AND c.passee_le >= TIMESTAMPTZ '2026-03-01 00:00:00+00'
  AND c.passee_le <  TIMESTAMPTZ '2026-04-01 00:00:00+00';
```

Total des lignes :

```sql
SELECT sum(l.quantite * l.prix_unitaire) AS ca_lignes_ht
FROM commandes AS c
JOIN lignes_commande AS l ON l.commande_id = c.id
WHERE c.statut = 'payee'
  AND c.passee_le >= TIMESTAMPTZ '2026-03-01 00:00:00+00'
  AND c.passee_le <  TIMESTAMPTZ '2026-04-01 00:00:00+00';
```

Les deux peuvent différer : remises au niveau commande, frais de port, arrondis, lignes manquantes. Ce sont deux métriques. Le cadrage dit laquelle on publie. On ne force pas l'égalité avec un `DISTINCT` posé au hasard sur le montant.

</details>

## Exercice 3 : Pays au-dessus de 10 000 €, et tranches

Écrivez une requête des pays dont le CA HT des commandes payées de 2026 dépasse 10 000 €, avec le nombre de commandes. Le filtre de statut et d'année ne doit pas se retrouver au même endroit que le seuil de 10 000 €.

Dans un second temps, indiquez seulement (sans obligatoirement une requête unique géante) comment obtenir le nombre de commandes payées « petit » (moins de 30 €), « moyen » (de 30 à moins de 80) et « gros » (80 € et plus).

<details>
<summary>Voir la solution</summary>

```sql
SELECT
    cl.pays,
    count(*)          AS nb_commandes,
    sum(c.montant_ht) AS ca_ht
FROM commandes AS c
JOIN clients AS cl ON cl.id = c.client_id
WHERE c.statut = 'payee'
  AND c.passee_le >= TIMESTAMPTZ '2026-01-01 00:00:00+00'
  AND c.passee_le <  TIMESTAMPTZ '2027-01-01 00:00:00+00'
GROUP BY cl.pays
HAVING sum(c.montant_ht) > 10000
ORDER BY ca_ht DESC;
```

Statut et année filtrent des lignes (`WHERE`). Le seuil porte sur une somme (`HAVING`). Un `INNER JOIN` ne liste que les pays qui ont au moins une commande joignable. Les commandes sans client ne sont dans aucun pays : à signaler à part si leur montant n'est pas négligeable.

Tranches, avec un `CASE` et un `GROUP BY` :

```sql
SELECT
    CASE
        WHEN c.montant_ht < 30 THEN 'petit'
        WHEN c.montant_ht < 80 THEN 'moyen'
        ELSE 'gros'
    END AS tranche,
    count(*) AS nb_commandes
FROM commandes AS c
WHERE c.statut = 'payee'
GROUP BY 1;
```

Les bornes sont exactement celles de l'énoncé. Un `ELSE` ramasse tout ce qui n'est pas petit ou moyen, y compris un montant nul si le `WHERE` ne l'a pas exclu. Si les montants nuls ne sont pas des ventes, on les filtre avant le `CASE`.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Joindre puis agréger
center: "Le grain après la jointure décide si la somme est un CA ou un CA compté deux fois."
points:
  - icon: link
    title: INNER ou LEFT
    text: "INNER garde les matchs. LEFT garde la gauche. Un filtre de droite se met dans le ON."
  - icon: alert
    title: Lignes multipliées
    text: "Trois articles répètent trois fois le montant commande. Comptez les lignes avant et après."
  - icon: money
    title: CA et panier
    text: "Le CA est une somme filtrée. Le panier divise par les commandes, pas par les clients."
  - icon: filter
    title: WHERE puis HAVING
    text: "WHERE écarte des lignes. HAVING écarte des groupes, une fois la somme calculée."
  - icon: users
    title: Clients absents
    text: "LEFT JOIN puis clé de droite IS NULL. COUNT sur cette clé vaut zéro pour eux."
pitfall: "Sommer le montant commande après une jointure vers les articles, sans erreur affichée."
remember: "Dites le grain voulu avant le JOIN, puis comparez le nombre de lignes de part et d'autre."
```
