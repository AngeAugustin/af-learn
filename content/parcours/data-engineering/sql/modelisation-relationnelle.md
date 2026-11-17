---
title: Modélisation relationnelle
description: Concevoir un schéma de base de données transactionnel (entités, clés, cardinalités, contraintes et normalisation) et comprendre pourquoi l'analytique fait d'autres choix.
duration: 50
objectives:
  - Identifier entités, attributs et relations d'un domaine
  - Choisir clés primaires, étrangères et contraintes
  - Normaliser un schéma jusqu'à la troisième forme normale
  - Distinguer les besoins d'un système transactionnel (OLTP) et analytique (OLAP)
---

# Pourquoi modéliser ?

Un **modèle de données** décrit quelles informations on stocke et comment elles sont reliées. Un bon modèle rend les données **cohérentes** (impossible d'avoir une commande sans client), **faciles à interroger** et **faciles à faire évoluer**. Un mauvais modèle produit des incohérences silencieuses que les pipelines propagent ensuite partout.

Le Data Engineer modélise à deux niveaux :

- il **lit** les modèles des systèmes sources (les bases des applications), pour les comprendre et les ingérer correctement ;
- il **conçoit** les modèles analytiques de l'entrepôt (module 4).

Ce chapitre traite de la modélisation **relationnelle normalisée**, celle des bases transactionnelles.

# Entités, attributs et relations

On part du **domaine métier** : une bibliothèque, une boutique, un hôpital. On y repère :

- des **entités** : les « choses » qu'on veut décrire (client, commande, produit) → des **tables** ;
- des **attributs** : leurs caractéristiques (nom, prix, date) → des **colonnes** ;
- des **relations** entre entités, avec leur **cardinalité**.

```diagram
type: compare
title: Les trois cardinalités
columns:
  - title: Un à un (1–1)
    tone: blue
    items:
      - Un employé a un badge, un badge appartient à un employé
      - Clé étrangère unique, ou même table
  - title: Un à plusieurs (1–N)
    tone: teal
    items:
      - Un client passe plusieurs commandes
      - Clé étrangère côté « plusieurs » (commandes.client_id)
  - title: Plusieurs à plusieurs (N–N)
    tone: amber
    items:
      - Une commande contient plusieurs produits, un produit figure dans plusieurs commandes
      - Table d'association (lignes_commande)
```

Une relation plusieurs-à-plusieurs se traduit toujours par une **table d'association**, qui porte souvent ses propres attributs : la quantité commandée et le prix unitaire **au moment de la commande** appartiennent à la ligne de commande, pas au produit.

```sql
CREATE TABLE produits (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    reference   text NOT NULL UNIQUE,
    libelle     text NOT NULL,
    prix_actuel numeric(10, 2) NOT NULL CHECK (prix_actuel >= 0)
);

CREATE TABLE lignes_commande (
    commande_id    bigint NOT NULL REFERENCES commandes(id) ON DELETE CASCADE,
    produit_id     bigint NOT NULL REFERENCES produits(id),
    quantite       integer NOT NULL CHECK (quantite > 0),
    prix_unitaire  numeric(10, 2) NOT NULL,   -- prix au moment de l'achat
    PRIMARY KEY (commande_id, produit_id)
);
```

# Clés et contraintes

## Clé naturelle ou clé de substitution

- Une **clé naturelle** existe dans le métier : numéro de sécurité sociale, code ISBN, référence produit.
- Une **clé de substitution** (*surrogate key*) est un identifiant technique sans signification : entier auto-incrémenté (`GENERATED ALWAYS AS IDENTITY`) ou UUID.

On utilise généralement une **clé de substitution comme clé primaire**, et une contrainte `UNIQUE` sur la clé naturelle. Raison : les clés naturelles **changent** parfois (une référence produit renommée), peuvent être **réutilisées**, ou contenir des **données personnelles**.

## Les contraintes, première ligne de défense

| Contrainte | Garantit |
|---|---|
| `PRIMARY KEY` | Chaque ligne est identifiée de façon unique et non nulle |
| `FOREIGN KEY … REFERENCES` | La ligne référencée existe (intégrité référentielle) |
| `NOT NULL` | La valeur est toujours renseignée |
| `UNIQUE` | Pas de doublon sur la colonne (ou le groupe de colonnes) |
| `CHECK` | Une règle métier est respectée (`quantite > 0`) |

> [!IMPORTANT]
> Une contrainte en base est **toujours** vérifiée, quel que soit le programme qui écrit. Une vérification dans le code applicatif seule finit toujours par être contournée (script de correction, autre service, import manuel). Les entrepôts analytiques, eux, ne font souvent **pas respecter** les clés primaires et étrangères (BigQuery, Snowflake les déclarent à titre informatif) : il faut alors des **tests de données** (module 8).

# La normalisation

La **normalisation** organise les tables pour que **chaque information soit stockée à un seul endroit**. Elle évite les **anomalies** : modifier l'adresse d'un client à un endroit et pas à un autre, ne pas pouvoir créer un produit tant qu'il n'a pas été commandé, perdre un client en supprimant sa dernière commande.

Partons d'une table « à plat », telle qu'on la reçoit souvent dans un export :

| commande | date | client | ville_client | produits |
|---|---|---|---|---|
| 501 | 2026-03-02 | Durand | Nantes | Stylo x2, Cahier x1 |
| 502 | 2026-03-02 | Martin | Lyon | Cahier x3 |
| 503 | 2026-03-04 | Durand | Nantes | Stylo x1 |

```diagram
type: flow
title: Les trois premières formes normales
steps:
  - title: 1NF
    text: Valeurs atomiques, pas de liste dans une cellule
    tone: blue
  - title: 2NF
    text: Chaque attribut dépend de toute la clé
    tone: teal
  - title: 3NF
    text: Aucun attribut ne dépend d'un autre attribut non clé
    tone: amber
```

1. **Première forme normale (1NF)** : chaque cellule contient une **valeur atomique**. La colonne `produits` contient une liste : on crée une ligne par produit commandé (table `lignes_commande`).
2. **Deuxième forme normale (2NF)** : dans une table à clé composée, chaque attribut dépend de **toute** la clé. Dans `lignes_commande (commande, produit)`, le libellé du produit ne dépend que du produit : il va dans `produits`.
3. **Troisième forme normale (3NF)** : aucun attribut non clé ne dépend d'un **autre attribut non clé**. Dans `commandes`, `ville_client` dépend du client, pas de la commande : elle va dans `clients`.

Résultat : `clients`, `commandes`, `produits`, `lignes_commande`. La ville de Durand n'est plus écrite qu'**une seule fois**.

> [!TIP]
> Une formule mnémotechnique résume la 3NF : chaque attribut dépend « de la clé, de toute la clé, et de rien que la clé ».

```video
url: https://www.youtube.com/watch?v=GFQaEYEc8_8
title: "Learn Database Normalization - 1NF, 2NF, 3NF, 4NF, 5NF"
channel: "Decomplexify"
duration: "28:34"
lang: en
why: "Les formes normales de 1NF à 5NF expliquées avec des exemples simples, une référence très suivie sur le sujet."
```

# OLTP et OLAP : deux mondes

Un schéma normalisé est idéal pour un **système transactionnel** (**OLTP**, *Online Transaction Processing*) : beaucoup de petites lectures et écritures concurrentes (passer une commande, mettre à jour un stock), cohérence stricte.

L'analytique (**OLAP**, *Online Analytical Processing*) a d'autres besoins : peu d'écritures, mais de **grosses lectures** qui parcourent des millions de lignes et les agrègent. Joindre dix tables normalisées à chaque requête devient lent et compliqué pour les analystes.

```diagram
type: compare
title: OLTP et OLAP
columns:
  - title: OLTP (applications)
    tone: blue
    items:
      - Petites transactions très nombreuses
      - Schéma normalisé (3NF)
      - Stockage par lignes (PostgreSQL, MySQL)
      - État actuel des données
  - title: OLAP (analytique)
    tone: teal
    items:
      - Grosses requêtes d'agrégation
      - Schéma dénormalisé (étoile)
      - Stockage en colonnes (BigQuery, Snowflake, DuckDB)
      - Historique complet
```

C'est pourquoi l'entrepôt utilise une **modélisation dimensionnelle** (tables de faits et de dimensions, module 4), volontairement **dénormalisée**, et pourquoi on n'exécute pas les requêtes analytiques lourdes directement sur la base de production d'une application : elles la ralentiraient pour ses utilisateurs.

# Exercices

## Exercice 1 : Normaliser

Une école tient ce tableau : `(id_eleve, nom_eleve, classe, professeur_principal, matiere, note)`. Le professeur principal dépend de la classe. Proposez un schéma en 3NF.

<details>
<summary>Voir la solution</summary>

- `classes (id, nom, professeur_principal)` : le professeur dépend de la classe (3NF).
- `eleves (id, nom, classe_id → classes)`.
- `matieres (id, libelle)`.
- `notes (id, eleve_id → eleves, matiere_id → matieres, valeur, date_evaluation)` : une ligne par note (1NF).

Ainsi, changer de professeur principal ne modifie qu'une ligne de `classes`.

</details>

## Exercice 2 : Le prix au moment de l'achat

Pourquoi stocke-t-on `prix_unitaire` dans `lignes_commande` alors que `produits` contient déjà `prix_actuel` ? N'est-ce pas une violation de la normalisation ?

<details>
<summary>Voir la solution</summary>

Ce n'est pas la même information : `prix_actuel` est le prix **aujourd'hui**, `prix_unitaire` est le prix **payé** lors de cette commande. Si le prix du produit change, les anciennes commandes doivent garder leur montant réel. Chaque information est donc toujours stockée une seule fois ; il n'y a pas de redondance.

</details>

## Exercice 3 : Contraintes

Pour la table `reservations (id, chambre_id, client_id, arrivee, depart, nb_personnes)` d'un hôtel, proposez des contraintes.

<details>
<summary>Voir la solution</summary>

```sql
CREATE TABLE reservations (
    id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    chambre_id    bigint NOT NULL REFERENCES chambres(id),
    client_id     bigint NOT NULL REFERENCES clients(id),
    arrivee       date NOT NULL,
    depart        date NOT NULL,
    nb_personnes  integer NOT NULL CHECK (nb_personnes BETWEEN 1 AND 6),
    CHECK (depart > arrivee)
);
```

Empêcher deux réservations qui se chevauchent pour une même chambre est possible en PostgreSQL avec une **contrainte d'exclusion** (`EXCLUDE USING gist` sur la chambre et l'intervalle de dates, avec l'extension `btree_gist`).

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Modélisation relationnelle
center: Chaque information à un seul endroit, protégée par des contraintes vérifiées par la base.
points:
  - icon: puzzle
    title: Entités et relations
    text: Tables, colonnes et cardinalités ; le N–N passe par une table d'association.
  - icon: key
    title: Clés
    text: Clé de substitution en clé primaire, contrainte UNIQUE sur la clé naturelle.
  - icon: shield
    title: Contraintes
    text: NOT NULL, UNIQUE, FOREIGN KEY, CHECK, toujours vérifiées, quel que soit le programme.
  - icon: layers
    title: 1NF, 2NF, 3NF
    text: Valeurs atomiques, dépendance à toute la clé, et à rien que la clé.
  - icon: scale
    title: OLTP et OLAP
    text: Normalisé pour les transactions, dénormalisé en étoile pour l'analytique.
pitfall: Croire qu'un entrepôt cloud fait respecter les clés primaires et étrangères comme PostgreSQL.
remember: Un schéma qui permet une incohérence finira par la contenir.
```
