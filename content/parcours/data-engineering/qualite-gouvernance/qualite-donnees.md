---
title: La qualité des données
description: Les dimensions de la qualité, où et comment tester, outils (dbt, Great Expectations, Soda), observabilité, contrats de données et gestion des incidents.
duration: 55
objectives:
  - Définir la qualité des données selon ses principales dimensions
  - Placer des contrôles aux bons endroits d'un pipeline
  - Utiliser des tests déclaratifs et la détection d'anomalies
  - Mettre en place des contrats de données et un processus d'incident
---

# Qu'est-ce qu'une donnée de qualité ?

Une donnée est de qualité si elle est **adaptée à l'usage** qu'on en fait. Les dimensions les plus utilisées pour l'évaluer :

| Dimension | Question | Exemple de contrôle |
|---|---|---|
| **Complétude** | Les données attendues sont-elles toutes là ? | Nombre de lignes du jour comparable aux jours précédents ; colonne obligatoire non nulle |
| **Unicité** | Chaque entité n'apparaît-elle qu'une fois ? | Clé primaire unique |
| **Validité** | Les valeurs respectent-elles le format et les règles ? | Code postal à 5 chiffres, statut dans une liste |
| **Exactitude** | Les valeurs reflètent-elles la réalité ? | Chiffre d'affaires rapproché de la comptabilité |
| **Cohérence** | Les données concordent-elles entre elles ? | Somme des lignes = total de la commande ; chaque commande a un client existant |
| **Fraîcheur** | Les données sont-elles assez récentes ? | Dernière mise à jour il y a moins de 6 heures |

> [!IMPORTANT]
> Le pire problème de qualité n'est pas une donnée fausse : c'est une donnée fausse **que personne n'a détectée** et qui a servi à une décision. L'objectif est de détecter les problèmes **avant les utilisateurs**, et de les signaler clairement quand ils existent.

# Où contrôler ?

```diagram
type: flow
title: Les points de contrôle d'un pipeline
steps:
  - title: À l'ingestion
    text: Schéma attendu, volume plausible, fraîcheur de la source
    tone: blue
  - title: Après staging
    text: Unicité des clés, non-nullité, valeurs acceptées
    tone: teal
  - title: Après transformations
    text: Intégrité référentielle, règles métier, cohérence des totaux
    tone: teal
  - title: Sur les sorties
    text: Indicateurs plausibles, rapprochement avec une source de référence
    tone: amber
```

- **Au plus tôt** : un problème détecté à l'ingestion coûte bien moins cher qu'un problème découvert dans un tableau de bord du comité de direction.
- **Bloquant ou non** : certains contrôles doivent **arrêter** le pipeline (clé dupliquée dans une table de faits), d'autres seulement **avertir** (volume en baisse de 15 %). dbt permet de régler la sévérité d'un test (`severity: warn` ou `error`).
- **Disjoncteur** (*circuit breaker*) : quand un contrôle bloquant échoue, on ne publie **pas** les nouvelles données ; les utilisateurs continuent de voir la version précédente, signalée comme non à jour, plutôt qu'une version fausse.

# Les outils de test

## Tests dbt

Les tests dbt (module 4) couvrent l'essentiel des besoins dans l'entrepôt : `unique`, `not_null`, `accepted_values`, `relationships`, tests SQL personnalisés, paquets comme `dbt_utils` ou `dbt-expectations`. La **fraîcheur des sources** se vérifie avec `dbt source freshness`.

```yaml
models:
  - name: fct_commandes
    data_tests:
      - dbt_utils.expression_is_true:
          arguments:
            expression: "montant_total >= 0"
    columns:
      - name: commande_id
        data_tests:
          - unique
          - not_null
      - name: statut
        data_tests:
          - accepted_values:
              arguments:
                values: ['payee', 'expediee', 'livree', 'annulee']
              config:
                severity: warn
```

> [!NOTE]
> Selon la version de dbt, les paramètres des tests s'écrivent directement sous le nom du test (syntaxe historique) ou sous une clé `arguments:` (syntaxe des versions récentes). Suivez la documentation de la version utilisée par votre projet.

## Great Expectations et Soda

Hors de dbt (dans un script Python, sur un DataFrame, dans un data lake) :

- **Great Expectations** (GX) : bibliothèque Python open source où l'on déclare des **attentes** (*expectations*) sur les données (`expect_column_values_to_not_be_null`, `expect_column_values_to_be_between`…) et qui produit des rapports de validation ;
- **Soda** : contrôles déclarés dans un langage dédié en YAML, exécutés sur de nombreuses sources.

Un contrôle simple peut aussi s'écrire directement en SQL : c'est souvent suffisant.

```sql
-- Contrôle de volume : le jour traité a-t-il au moins 50 % du volume moyen des 4 mêmes jours de semaine précédents ?
WITH reference AS (
    SELECT avg(nb) AS moyenne
    FROM (
        SELECT jour_vente, count(*) AS nb
        FROM fct_ventes
        WHERE jour_vente IN (DATE '2026-03-02' - 7, DATE '2026-03-02' - 14, DATE '2026-03-02' - 21, DATE '2026-03-02' - 28)
        GROUP BY jour_vente
    ) AS t
)
SELECT count(*) AS nb_du_jour, (SELECT moyenne FROM reference) AS moyenne
FROM fct_ventes
WHERE jour_vente = DATE '2026-03-02'
HAVING count(*) < 0.5 * (SELECT moyenne FROM reference);   -- une ligne renvoyée = anomalie
```

# L'observabilité des données

Les tests vérifient ce qu'on a **pensé** à vérifier. L'**observabilité des données** complète en surveillant automatiquement des signaux sur toutes les tables :

- **fraîcheur** : la table n'a pas été mise à jour à l'heure habituelle ;
- **volume** : nombre de lignes anormal par rapport à l'historique ;
- **distribution** : proportion de `NULL` qui bondit, moyenne d'une colonne qui dérive ;
- **schéma** : colonne ajoutée, supprimée, type modifié ;
- **lignage** : quelles tables et quels tableaux de bord sont touchés par un incident.

Ces outils (commerciaux ou open source, et des fonctions intégrées aux entrepôts et à certains orchestrateurs) apprennent les comportements habituels et alertent sur les écarts. Attention à la **fatigue d'alerte** : trop d'alertes peu pertinentes, et plus personne ne les lit.

# Les contrats de données

Une grande partie des incidents vient de **changements en amont** : l'équipe qui développe l'application renomme une colonne, change une unité (centimes → euros), et le pipeline casse… ou pire, continue avec des valeurs fausses.

Un **contrat de données** formalise l'interface entre une équipe **productrice** et ses **consommateurs** :

- le **schéma** (noms, types, obligations) ;
- la **sémantique** (que signifie chaque champ, unité, valeurs possibles) ;
- les **engagements de service** (fraîcheur, disponibilité) ;
- le **responsable** et la procédure de **changement** (préavis, versions).

```yaml
# Exemple de contrat simplifié (le format varie selon les outils)
dataset: commandes
version: 2.1.0
proprietaire: equipe-boutique@entreprise.fr
fraicheur_max: 1h
champs:
  - nom: commande_id
    type: string
    obligatoire: true
    unique: true
  - nom: montant_ttc
    type: decimal(10,2)
    unite: EUR
    obligatoire: true
    description: Montant TTC payé, frais de port inclus
changements: "Tout changement incompatible fait l'objet d'une nouvelle version majeure annoncée 30 jours à l'avance"
```

Le contrat n'a de valeur que s'il est **vérifié automatiquement** : dans la CI du producteur (un changement incompatible bloque la fusion) et à l'ingestion côté consommateur. Des spécifications ouvertes existent pour standardiser ce format, comme l'*Open Data Contract Standard*.

# Gérer un incident de données

```diagram
type: flow
title: Réponse à un incident de qualité
steps:
  - title: Détecter
    text: Test, alerte d'observabilité ou signalement
    tone: rose
  - title: Contenir
    text: Bloquer la publication, signaler les tableaux touchés
    tone: amber
  - title: Diagnostiquer
    text: Lignage, d'où vient l'erreur ?
    tone: blue
  - title: Corriger et rejouer
    text: Correction, puis rattrapage des périodes touchées
    tone: teal
  - title: Prévenir
    text: Nouveau test, contrat, post-mortem
    tone: teal
```

Points clés : **communiquer tôt** auprès des utilisateurs (« les chiffres de ventes du 2 mars sont incomplets, correction en cours »), corriger la **cause** plutôt que les symptômes, et ajouter un test pour que le même problème soit détecté automatiquement la prochaine fois.

# Exercices

## Exercice 1 : Classer les contrôles

À quelle dimension de qualité correspond chaque contrôle ?

1. Toutes les commandes ont un `client_id` qui existe dans `dim_clients`.
2. La table des ventes a été mise à jour dans les 2 dernières heures.
3. Le champ `email` contient un `@`.
4. Il n'y a qu'une ligne par `commande_id`.

<details>
<summary>Voir la solution</summary>

1. **Cohérence** (intégrité référentielle).
2. **Fraîcheur**.
3. **Validité**.
4. **Unicité**.

</details>

## Exercice 2 : Bloquant ou avertissement ?

Pour chaque contrôle d'un pipeline qui alimente le tableau de bord financier, indiquez s'il doit être bloquant ou un simple avertissement :

1. Doublons sur la clé primaire de `fct_ventes`.
2. 3 % de lignes sans code de campagne marketing.
3. Volume du jour inférieur de 70 % à la normale un jour ouvré.

<details>
<summary>Voir la solution</summary>

1. **Bloquant** : les doublons faussent tous les montants.
2. **Avertissement** : information secondaire, le tableau financier reste juste ; à surveiller.
3. **Bloquant** (ou au minimum publication suspendue en attendant une vérification humaine) : très probablement une ingestion incomplète. Publier donnerait un chiffre d'affaires faux.

</details>

## Exercice 3 : Le changement silencieux

Depuis lundi, le chiffre d'affaires affiché est 100 fois trop élevé. L'équipe applicative a changé l'unité du champ `amount` (de euros en centimes) sans prévenir. Quels mécanismes auraient permis d'éviter ou de détecter le problème ?

<details>
<summary>Voir la solution</summary>

- Un **contrat de données** précisant l'unité, avec une procédure de changement et un contrôle dans la CI du producteur.
- Un contrôle de **distribution** (observabilité) : la moyenne de `amount` multipliée par 100 du jour au lendemain est une anomalie évidente.
- Un **rapprochement** avec une source de référence (comptabilité, prestataire de paiement).
- Un test de **plage plausible** sur le panier moyen.

Après correction : rejouer les jours touchés, communiquer aux utilisateurs, ajouter le test manquant.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: La qualité des données
center: Détecter les problèmes avant les utilisateurs, ne jamais publier en silence une donnée fausse.
points:
  - icon: check
    title: Six dimensions
    text: Complétude, unicité, validité, exactitude, cohérence, fraîcheur.
  - icon: filter
    title: Contrôler tôt
    text: À l'ingestion, après staging, après transformation, sur les sorties ; bloquant ou avertissement.
  - icon: test
    title: Outils
    text: Tests dbt, Great Expectations, Soda, ou simple SQL ; disjoncteur avant publication.
  - icon: eye
    title: Observabilité
    text: Fraîcheur, volume, distribution, schéma, lignage, sans noyer l'équipe d'alertes.
  - icon: file
    title: Contrats de données
    text: Schéma, sens, engagements et changements négociés, vérifiés automatiquement.
pitfall: Corriger le chiffre à la main dans le tableau de bord sans traiter la cause ni ajouter de test.
remember: Mieux vaut des chiffres d'hier signalés comme tels que des chiffres d'aujourd'hui faux.
```
