---
title: "Modélisation avancée : Data Vault, One Big Table et compagnie"
description: "Au-delà du schéma en étoile : le Data Vault pour intégrer de nombreuses sources en gardant tout l'historique, la One Big Table pour la performance, les tables d'activité, et comment combiner ces approches en couches."
duration: 55
objectives:
  - Situer les grandes approches de modélisation (Inmon, Kimball, Data Vault, tables larges)
  - Construire hubs, liens et satellites d'un Data Vault
  - Savoir quand une One Big Table est pertinente et quand elle devient un piège
  - Combiner plusieurs approches dans une architecture en couches
---

# Plusieurs écoles de modélisation

Le chapitre précédent présentait le **schéma en étoile** de Ralph Kimball : des faits et des dimensions, conçus pour être compris par le métier et interrogés rapidement. C'est l'approche la plus répandue pour la couche de **présentation**, mais ce n'est pas la seule.

```diagram
type: compare
title: Quatre approches de la modélisation analytique
columns:
  - title: Inmon (entreprise)
    tone: blue
    items:
      - Un entrepôt central normalisé (3e forme normale)
      - Des magasins de données dimensionnels dérivés
      - Cohérence forte, mais conception longue
  - title: Kimball (dimensionnel)
    tone: teal
    items:
      - Faits et dimensions conformes, processus par processus
      - Lisible par le métier, rapide à livrer
      - Historisation via les dimensions SCD
  - title: Data Vault
    tone: violet
    items:
      - Hubs, liens, satellites
      - Intégration de nombreuses sources, historique complet
      - Couche intermédiaire, pas faite pour être interrogée directement
  - title: Tables larges (OBT)
    tone: amber
    items:
      - Une table dénormalisée par usage
      - Très simple et rapide à interroger
      - Redondance, recalculs coûteux, cohérence fragile
```

En pratique, les plateformes modernes **combinent** ces approches en couches : une couche d'intégration (souvent silver, parfois en Data Vault), une couche de présentation dimensionnelle (gold), et quelques tables larges pour des usages précis (tableaux de bord, machine learning).

# Le Data Vault

Le **Data Vault** (Dan Linstedt, version 2.0) répond à un problème précis : intégrer **beaucoup de sources** qui changent souvent, en conservant **tout l'historique** de façon auditable, et en permettant de charger en parallèle sans dépendances complexes.

Il repose sur trois types de tables seulement :

```diagram
type: layers
title: Les trois briques du Data Vault
layers:
  - title: Hub
    text: "Une liste de clés métier uniques (numéro client, code produit), avec date de premier chargement et source"
  - title: Lien
    text: "Une relation entre hubs (une commande relie un client et un produit), sans attribut descriptif"
  - title: Satellite
    text: "Les attributs descriptifs d'un hub ou d'un lien, historisés : une nouvelle ligne à chaque changement"
```

## Hubs

Un hub contient **uniquement** la clé métier, une clé de hachage dérivée, la date de chargement et la source :

```sql
CREATE TABLE hub_client (
    hk_client      char(32)     PRIMARY KEY,  -- md5(upper(trim(numero_client)))
    numero_client  varchar(20)  NOT NULL,     -- clé métier
    charge_le      timestamp    NOT NULL,
    source         varchar(50)  NOT NULL
);
```

La **clé de hachage** (*hash key*) est calculée de façon déterministe à partir de la clé métier. Chaque chargement peut donc la calculer sans consulter la base, ce qui permet de charger hubs, liens et satellites **en parallèle**.

## Liens

Un lien représente une relation ou un événement entre plusieurs hubs :

```sql
CREATE TABLE lien_commande (
    hk_commande  char(32)  PRIMARY KEY,   -- hachage de (numero_commande, numero_client, code_produit)
    hk_client    char(32)  NOT NULL REFERENCES hub_client,
    hk_produit   char(32)  NOT NULL REFERENCES hub_produit,
    charge_le    timestamp NOT NULL,
    source       varchar(50) NOT NULL
);
```

Les liens sont toujours de type **plusieurs-à-plusieurs** : si une règle métier change (un client peut désormais avoir plusieurs comptes), le modèle n'a pas à être restructuré.

## Satellites

Un satellite porte les attributs descriptifs et leur **historique**. On n'y fait jamais d'`UPDATE` : à chaque changement détecté, on **insère** une nouvelle ligne.

```sql
CREATE TABLE sat_client_crm (
    hk_client     char(32)     NOT NULL REFERENCES hub_client,
    charge_le     timestamp    NOT NULL,
    hash_diff     char(32)     NOT NULL,   -- hachage de tous les attributs, pour détecter un changement
    nom           varchar(200),
    email         varchar(200),
    segment       varchar(30),
    source        varchar(50)  NOT NULL,
    PRIMARY KEY (hk_client, charge_le)
);
```

Le **`hash_diff`** permet de détecter un changement en comparant un seul hachage au lieu de chaque colonne. On sépare souvent les satellites **par source** (`sat_client_crm`, `sat_client_ecommerce`) ou par fréquence de changement.

> [!NOTE]
> Il existe d'autres briques (satellites de liens, tables *point-in-time* et *bridge* pour accélérer les requêtes, satellites d'effectivité). Le paquet dbt **AutomateDV** (ex-dbtvault) génère hubs, liens et satellites à partir de métadonnées.

## Forces et limites

- **Forces** : ajout d'une source sans casser l'existant (on ajoute un satellite), historique complet et auditable (exigé dans la banque, l'assurance, le secteur public), chargements parallèles et idempotents, séparation claire entre données brutes intégrées (*raw vault*) et règles métier (*business vault*).
- **Limites** : beaucoup de tables et de jointures, un modèle **illisible pour le métier**, une courbe d'apprentissage réelle. Un Data Vault ne s'interroge presque jamais directement : on construit **au-dessus** une couche dimensionnelle.

> [!WARNING]
> Le Data Vault est surdimensionné pour une start-up avec trois sources et une équipe de deux personnes. Il prend tout son sens quand les sources sont nombreuses, instables, et que l'auditabilité de l'historique est une exigence réglementaire.

# La One Big Table

La **One Big Table** (OBT) pousse la dénormalisation à l'extrême : une seule table large qui contient la granularité d'un fait **et** tous les attributs utiles des dimensions.

```sql
-- Une table large pour le tableau de bord des ventes
CREATE TABLE gold.ventes_large AS
SELECT
    v.vente_id, v.vendu_le, v.quantite, v.montant,
    p.code_produit, p.nom AS produit, p.categorie, p.marque,
    m.code_magasin, m.ville, m.region,
    c.segment AS segment_client, c.pays AS pays_client
FROM gold.fait_ventes v
JOIN gold.dim_produit p ON p.sk_produit = v.sk_produit
JOIN gold.dim_magasin m ON m.sk_magasin = v.sk_magasin
JOIN gold.dim_client  c ON c.sk_client  = v.sk_client;
```

Pourquoi c'est tentant :

- les entrepôts en colonnes ne lisent que les colonnes demandées : une table de 80 colonnes coûte peu si la requête n'en lit que 4 ;
- aucune jointure à l'exécution : requêtes simples et rapides, idéales pour les outils de BI en libre-service et pour constituer des jeux d'entraînement de machine learning ;
- une seule table à comprendre pour l'utilisateur.

Les pièges :

- **la redondance** : la catégorie d'un produit est répétée sur des millions de lignes ; si elle change, il faut recalculer toute la table ;
- **l'historique** : quelle catégorie afficher, celle au moment de la vente ou la catégorie actuelle ? Il faut le décider explicitement ;
- **la prolifération** : chaque équipe crée sa table large, avec ses propres définitions, et les chiffres divergent.

> [!TIP]
> Une OBT doit rester une **couche de présentation dérivée** d'un modèle dimensionnel ou d'un modèle propre en silver, entièrement reconstructible. Ce n'est jamais la source de vérité. Construisez-la avec dbt à partir des faits et dimensions conformes, pour que toutes les tables larges partagent les mêmes définitions.

# Les tables d'activité

Pour les données comportementales (clics, événements produit, parcours client), une autre approche gagne du terrain : le **schéma d'activité** (*activity schema*). Une seule table d'événements au format standard :

| Colonne | Exemple |
|---|---|
| `entite_id` | `client-77` |
| `activite` | `a_ajoute_au_panier` |
| `horodatage` | `2026-03-02 09:14:00` |
| `attributs` | `{"sku": "LIV-001", "prix": 12.5}` (JSON) |

Toutes les questions du type « parmi les clients qui ont fait X, combien ont fait Y dans les 7 jours ? » se résolvent avec le même modèle de requête (fenêtres, `lead`, `lag`), sans créer une table par question. C'est très proche de la façon dont les outils d'analyse produit (Amplitude, Mixpanel, PostHog) stockent les événements.

# Combiner les approches

```diagram
type: flow
title: Une architecture de modélisation en couches
steps:
  - title: Bronze
    text: Données brutes, telles que reçues
    tone: amber
  - title: Intégration (silver)
    text: Modèle normalisé ou Data Vault, historisé, toutes sources
    tone: blue
  - title: Présentation (gold)
    text: Étoiles avec dimensions conformes
    tone: teal
  - title: Usages
    text: Tables larges, agrégats, couche sémantique
    tone: violet
```

Quelques règles pour choisir :

1. **Peu de sources, équipe réduite** : staging propre puis étoile ; pas de Data Vault.
2. **Nombreuses sources instables, exigences d'audit** : Data Vault en intégration, étoiles au-dessus.
3. **Tableaux de bord rapides ou jeux de données de machine learning** : des tables larges dérivées des étoiles.
4. **Analyse comportementale** : table d'activité.
5. Dans tous les cas, **les définitions métier** (qu'est-ce qu'un client actif, un chiffre d'affaires net ?) vivent à un seul endroit : dimensions conformes ou couche sémantique (voir le chapitre sur la mise à disposition des données).

# Exercices

## Exercice 1 : Concevoir un Data Vault

Une compagnie d'assurance reçoit des **contrats** (numéro de contrat, date d'effet, prime) liés à des **assurés** (numéro d'assuré, nom, adresse). Les adresses changent souvent. Proposez hubs, liens et satellites.

<details>
<summary>Voir la solution</summary>

- **Hubs** : `hub_assure` (numéro d'assuré), `hub_contrat` (numéro de contrat).
- **Lien** : `lien_contrat_assure` (hk_contrat, hk_assure), car un contrat peut avoir plusieurs assurés et un assuré plusieurs contrats.
- **Satellites** : `sat_assure_identite` (nom, date de naissance : change rarement) et `sat_assure_adresse` (adresse : change souvent), séparés par fréquence de changement ; `sat_contrat` (date d'effet, prime, statut).
- Chaque satellite a un `hash_diff` pour n'insérer une ligne qu'en cas de changement réel ; l'historique complet des adresses est conservé et auditable.

</details>

## Exercice 2 : La table large qui ment

Un tableau de bord s'appuie sur une table large `ventes_large` reconstruite chaque nuit en joignant la dimension produit **courante**. En mars, le produit « Stylo bleu » passe de la catégorie « Fournitures » à « Écriture ». Le lendemain, le chiffre d'affaires 2025 de la catégorie « Fournitures » a baissé. Expliquez et proposez une correction.

<details>
<summary>Voir la solution</summary>

La table est reconstruite avec la catégorie **actuelle** pour toutes les ventes, y compris les ventes passées : l'historique est réécrit. Si le métier veut analyser les ventes selon la catégorie **au moment de la vente**, il faut joindre la version de la dimension valide à la date de vente (dimension SCD de type 2, jointure sur la clé de substitution enregistrée dans le fait). On peut aussi proposer les deux colonnes, `categorie_historique` et `categorie_actuelle`, clairement nommées.

</details>

## Exercice 3 : Faut-il un Data Vault ?

Une start-up de 30 personnes a trois sources (base applicative, Stripe, HubSpot) et un Data Engineer. Elle hésite à adopter le Data Vault. Votre avis ?

<details>
<summary>Voir la solution</summary>

Non. Le Data Vault apporte de la valeur quand les sources sont nombreuses, changent souvent et que l'historique doit être auditable. Ici, il multiplierait les tables et les jointures pour un bénéfice faible. Une couche staging propre dans dbt, des **snapshots** pour historiser ce qui doit l'être, puis un modèle en étoile suffisent largement. On réévaluera si le nombre de sources ou les exigences réglementaires augmentent.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Modélisation avancée
center: Chaque approche répond à un besoin ; on les combine en couches, avec des définitions métier uniques.
points:
  - icon: layers
    title: Inmon et Kimball
    text: Entrepôt normalisé central ou étoiles par processus.
  - icon: key
    title: Hubs
    text: Les clés métier uniques, avec une clé de hachage déterministe.
  - icon: link
    title: Liens
    text: Les relations entre hubs, toujours plusieurs-à-plusieurs.
  - icon: clock
    title: Satellites
    text: Les attributs historisés, insérés à chaque changement détecté par hash_diff.
  - icon: database
    title: One Big Table
    text: Rapide et simple, mais dérivée et reconstructible, jamais source de vérité.
  - icon: chart
    title: Tables d'activité
    text: Un format d'événements standard pour l'analyse comportementale.
pitfall: Adopter le Data Vault pour trois sources, ou laisser chaque équipe construire sa table large avec ses propres définitions.
remember: Intégrer et historiser en dessous, présenter simplement au-dessus.
```
