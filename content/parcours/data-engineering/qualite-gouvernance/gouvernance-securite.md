---
title: Gouvernance, sécurité et conformité
description: Catalogue et lignage, responsabilités, contrôle d'accès (rôles, lignes, colonnes), chiffrement, RGPD appliqué aux plateformes de données et pseudonymisation.
duration: 55
objectives:
  - Mettre en place catalogue, propriétaires et lignage des données
  - Appliquer le moindre privilège avec rôles, filtrage des lignes et masquage des colonnes
  - Appliquer les principes du RGPD à une plateforme de données
  - Distinguer pseudonymisation et anonymisation
---

# La gouvernance des données

La **gouvernance des données** regroupe les règles, rôles et outils qui garantissent que les données sont **connues, fiables, sûres et utilisées à bon escient**. Pour un Data Engineer, elle se traduit concrètement par :

- un **catalogue** : quelles tables existent, ce qu'elles contiennent, qui en est responsable ;
- un **lignage** : d'où vient chaque table et ce qui en dépend ;
- des **propriétaires** (*owners*) identifiés pour chaque jeu de données ;
- une **classification** de la sensibilité (publique, interne, confidentielle, données personnelles, données sensibles) ;
- des **règles d'accès** et de **conservation** appliquées techniquement.

## Catalogue et lignage

Un **catalogue de données** recense les jeux de données avec leurs descriptions, schémas, propriétaires, étiquettes de sensibilité, fraîcheur et usages. Outils courants : **DataHub** et **OpenMetadata** (open source), **Unity Catalog** (Databricks, également publié en open source), **Dataplex** (Google Cloud), **Microsoft Purview**, et les catalogues intégrés des entrepôts. dbt produit lui-même une documentation et un lignage de ses modèles.

Le **lignage** (*lineage*) répond à deux questions essentielles :

- **en amont** : d'où vient cette colonne ? (diagnostiquer une valeur fausse) ;
- **en aval** : qui utilise cette table ? (mesurer l'impact d'un changement ou d'un incident).

**OpenLineage** est un standard ouvert pour émettre des événements de lignage depuis les outils (Airflow, Spark, dbt, Flink…) vers un catalogue.

> [!TIP]
> La gouvernance la plus efficace est **automatisée** et proche du code : descriptions et propriétaires dans les fichiers YAML dbt, étiquettes de sensibilité sur les colonnes, lignage émis par l'orchestrateur. Un catalogue rempli à la main se périme très vite.

# La sécurité de la plateforme

## Le moindre privilège

Chaque personne et chaque programme ne doit avoir accès **qu'à ce dont il a besoin**. Concrètement :

- des **rôles** plutôt que des droits individuels (`analyste_ventes`, `pipeline_ingestion`, `data_scientist_rh`) ;
- des **comptes de service** distincts pour chaque pipeline, avec des droits limités (le pipeline d'ingestion peut écrire en bronze, pas lire la zone RH) ;
- des droits de **lecture seule** pour la plupart des utilisateurs, l'écriture en production étant réservée aux pipelines ;
- une **revue périodique** des accès (départs, changements de poste).

```sql
-- PostgreSQL : un rôle de lecture sur le schéma métier « marts »
CREATE ROLE analyste_ventes NOLOGIN;
GRANT USAGE ON SCHEMA marts TO analyste_ventes;
GRANT SELECT ON ALL TABLES IN SCHEMA marts TO analyste_ventes;
ALTER DEFAULT PRIVILEGES IN SCHEMA marts GRANT SELECT ON TABLES TO analyste_ventes;
GRANT analyste_ventes TO alice;
```

## Filtrer les lignes et masquer les colonnes

Au-delà des droits sur les tables :

- le **filtrage des lignes** (*row-level security*) limite les lignes visibles selon l'utilisateur : un directeur régional ne voit que les ventes de sa région ;
- le **masquage des colonnes** remplace les valeurs sensibles (e-mail, IBAN) par une version masquée pour les rôles non autorisés.

```sql
-- PostgreSQL : chaque responsable ne voit que les ventes de sa région
ALTER TABLE marts.fct_ventes ENABLE ROW LEVEL SECURITY;
CREATE POLICY ventes_par_region ON marts.fct_ventes
    FOR SELECT
    USING (region = current_setting('app.region_utilisateur'));
```

Les entrepôts cloud proposent des mécanismes équivalents (politiques d'accès aux lignes et politiques de masquage dans Snowflake, sécurité au niveau des lignes et des colonnes dans BigQuery…).

## Chiffrement, secrets et traçabilité

- **Chiffrement en transit** (TLS pour toutes les connexions) et **au repos** (activé par défaut chez les grands fournisseurs cloud ; clés gérées par le client si la politique l'exige).
- **Secrets** dans un gestionnaire dédié (AWS Secrets Manager, Google Secret Manager, Azure Key Vault, HashiCorp Vault), jamais dans le code ni dans les fichiers de DAG.
- **Journaux d'audit** : qui a lu ou modifié quoi, et quand. Indispensables pour enquêter sur un incident et démontrer la conformité.

# Le RGPD appliqué aux données

Le **Règlement général sur la protection des données** (RGPD, applicable depuis le 25 mai 2018) encadre le traitement des **données personnelles** : toute information se rapportant à une personne physique identifiée ou **identifiable**, directement (nom, e-mail) ou indirectement (identifiant client, adresse IP, combinaison de date de naissance, code postal et genre…).

Les principes de l'article 5 ont des conséquences directes sur une plateforme de données :

| Principe | Conséquence technique |
|---|---|
| **Limitation des finalités** | Chaque usage des données doit correspondre à une finalité déterminée et légitime |
| **Minimisation** | N'ingérer que les colonnes nécessaires ; ne pas copier les données personnelles « au cas où » |
| **Exactitude** | Pouvoir corriger les données, et propager les corrections |
| **Limitation de la conservation** | Durées de conservation définies et **appliquées** par des purges automatiques |
| **Intégrité et confidentialité** | Contrôle d'accès, chiffrement, journalisation |
| **Responsabilité** | Documenter les traitements (registre) et pouvoir le démontrer |

Les **droits des personnes** (accès, rectification, effacement, opposition…) imposent de pouvoir **retrouver** toutes les données d'une personne sur la plateforme, et de les **supprimer** effectivement, y compris dans les historiques et les tables dérivées (voir le chapitre sur le lakehouse). Les **données sensibles** (santé, opinions, origine, biométrie…) font l'objet de protections renforcées, et un traitement à risque élevé nécessite une **analyse d'impact** (AIPD).

> [!NOTE]
> En France, la **CNIL** publie des guides pratiques très utiles (sécurité des données personnelles, durées de conservation, anonymisation). Pour toute question juridique, le **délégué à la protection des données** (DPO) de l'organisation est l'interlocuteur à impliquer dès la conception.

## Pseudonymisation et anonymisation

```diagram
type: compare
title: Deux notions souvent confondues
columns:
  - title: Pseudonymisation
    tone: amber
    items:
      - Remplacer les identifiants directs par un pseudonyme
      - Réidentification possible avec une information conservée à part
      - Les données restent des données personnelles (RGPD applicable)
  - title: Anonymisation
    tone: teal
    items:
      - Rendre la réidentification impossible en pratique, de façon irréversible
      - Agrégation, généralisation, ajout de bruit…
      - Données sorties du champ du RGPD si l'anonymisation est effective
```

Une pseudonymisation courante : remplacer l'e-mail par un **hachage avec une clé secrète** (HMAC), ce qui permet de joindre les tables entre elles sans exposer l'e-mail. Un simple hachage sans clé (SHA-256 de l'e-mail) est **insuffisant** : il suffit de hacher une liste d'e-mails connus pour retrouver les correspondances.

```python
import hmac, hashlib

def pseudonymiser(valeur: str, cle: bytes) -> str:
    return hmac.new(cle, valeur.strip().lower().encode(), hashlib.sha256).hexdigest()
```

> [!WARNING]
> Supprimer les noms et e-mails ne suffit **pas** à anonymiser : la combinaison de quelques attributs (code postal, date de naissance, genre) suffit souvent à réidentifier une personne. L'anonymisation véritable est difficile ; en cas de doute, traitez les données comme personnelles.

# Exercices

## Exercice 1 : Moindre privilège

Une équipe marketing de 12 personnes a reçu les droits d'administrateur sur l'entrepôt « pour aller plus vite ». Proposez une organisation des accès.

<details>
<summary>Voir la solution</summary>

- Un rôle `analyste_marketing` en **lecture seule** sur les tables gold utiles au marketing (pas sur les zones RH ou finance), attribué aux 12 personnes.
- Un **schéma bac à sable** (*sandbox*) où ce rôle peut créer ses propres tables, sans toucher à la production.
- Le **masquage** des colonnes personnelles non nécessaires (e-mail, téléphone) ou une version pseudonymisée.
- L'écriture en production réservée aux **comptes de service** des pipelines.
- Une **revue trimestrielle** des membres du rôle et des journaux d'audit.

</details>

## Exercice 2 : Pseudonymiser correctement

Pour croiser les achats en ligne et en magasin sans exposer l'e-mail, un collègue propose de stocker `sha256(email)`. Qu'en pensez-vous ?

<details>
<summary>Voir la solution</summary>

Insuffisant : sans clé secrète, n'importe qui peut hacher une liste d'e-mails (fuites publiques, fichiers clients) et retrouver les correspondances. Utiliser un **HMAC** avec une clé secrète stockée dans un gestionnaire de secrets, et normaliser l'e-mail avant (minuscules, espaces supprimés). Rappel : le résultat reste une donnée **pseudonymisée**, donc personnelle au sens du RGPD.

</details>

## Exercice 3 : Conservation

La politique de l'entreprise prévoit de conserver les données de prospects inactifs 3 ans au maximum. Comment l'appliquer techniquement sur la plateforme ?

<details>
<summary>Voir la solution</summary>

1. **Identifier** toutes les tables contenant des données de prospects (catalogue, étiquettes de sensibilité, lignage).
2. Écrire un **traitement de purge** planifié (orchestrateur) qui supprime ou anonymise les prospects dont la dernière activité date de plus de 3 ans, dans toutes ces tables, y compris bronze.
3. Pour les formats de tables avec historique, lancer la **maintenance** qui supprime physiquement les anciens fichiers.
4. **Journaliser** les purges et **tester** régulièrement qu'aucune donnée au-delà de la limite ne subsiste.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Gouvernance, sécurité, conformité
center: Savoir ce qu'on a, qui y accède et pourquoi, et l'appliquer techniquement plutôt que sur le papier.
points:
  - icon: book
    title: Catalogue et lignage
    text: Descriptions, propriétaires, sensibilité ; d'où vient une donnée, qui en dépend.
  - icon: lock
    title: Moindre privilège
    text: Rôles, comptes de service, lecture seule, revue des accès.
  - icon: filter
    title: Lignes et colonnes
    text: Filtrage des lignes par utilisateur, masquage des colonnes sensibles.
  - icon: shield
    title: RGPD
    text: Finalité, minimisation, conservation appliquée, droits des personnes, documentation.
  - icon: key
    title: Pseudonymiser
    text: HMAC avec clé secrète ; reste une donnée personnelle ; anonymiser est difficile.
pitfall: Croire qu'un hachage sans clé d'un e-mail ou la suppression des noms rend les données anonymes.
remember: Une règle de conservation non appliquée par un traitement automatique n'existe pas vraiment.
```
