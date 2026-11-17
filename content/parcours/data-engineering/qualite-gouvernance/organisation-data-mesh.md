---
title: "Organiser la donnée : équipes, produits de données et data mesh"
description: Comment s'organisent les équipes data, ce qu'est un produit de données, les principes du data mesh, et comment piloter une plateforme de données comme un produit, y compris ses coûts.
duration: 50
objectives:
  - Comparer les modèles d'organisation centralisé, décentralisé et fédéré
  - Définir un produit de données et ses engagements
  - Expliquer les quatre principes du data mesh et ses conditions de réussite
  - Piloter une plateforme de données par la valeur, l'adoption et les coûts
---

# La technique ne suffit pas

Beaucoup de plateformes de données échouent alors que leur technique est irréprochable : l'équipe centrale croule sous les demandes, personne ne sait qui est responsable d'une table, les équipes métier contournent la plateforme avec des exports Excel, et la facture cloud grimpe sans qu'on sache pourquoi. Ces problèmes sont **organisationnels**, et un Data Engineer expérimenté doit savoir les reconnaître.

# Trois modèles d'organisation

```diagram
type: compare
title: Où vivent les compétences data ?
columns:
  - title: Centralisé
    tone: blue
    items:
      - Une équipe data unique sert toute l'entreprise
      - Standards cohérents, mutualisation des compétences
      - Goulot d'étranglement, éloignement du métier
      - Adapté aux petites structures
  - title: Décentralisé
    tone: amber
    items:
      - Chaque équipe métier a ses propres profils data
      - Proche du métier, réactif
      - Outils et définitions divergents, doublons, silos
      - Coûts et risques mal maîtrisés
  - title: Fédéré (hub and spoke)
    tone: teal
    items:
      - Une équipe plateforme centrale (outils, standards, gouvernance)
      - Des profils data dans les équipes métier
      - Équilibre autonomie et cohérence
      - Le modèle le plus répandu dans les grandes organisations
```

Les rôles autour de la plateforme se sont précisés : **Data Engineer** (pipelines et plateforme), **Analytics Engineer** (modélisation et transformation, souvent avec dbt, au plus près du métier), **Data Analyst**, **Data Scientist** et **ML Engineer**, **Data Product Manager** (priorise la valeur), sans oublier les **propriétaires métier** des données (*data owners*) et les **référents qualité** (*data stewards*).

# Les produits de données

Un **produit de données** est un jeu de données (ou un ensemble cohérent de tables, d'API, de modèles) conçu, maintenu et documenté **pour des consommateurs**, avec un responsable et des engagements. C'est l'opposé de la « table créée un jour pour un besoin ponctuel et dont plus personne ne sait si elle est fiable ».

Les qualités attendues d'un produit de données sont souvent résumées ainsi :

| Qualité | Concrètement |
|---|---|
| **Découvrable** | Référencé dans le catalogue, trouvable par recherche |
| **Compréhensible** | Description, définitions des colonnes, exemples de requêtes |
| **Adressable** | Un nom stable et un point d'accès clair (table, API) |
| **Fiable** | Tests, objectifs de fraîcheur et de qualité publiés et suivis |
| **Interopérable** | Identifiants et dimensions conformes, partagés avec les autres produits |
| **Sécurisé** | Classification, accès gérés, conformité RGPD |

Un produit de données a un **contrat** : schéma, sémantique, fraîcheur, qualité, politique de changement et de dépréciation. C'est la mise en pratique des contrats de données vus dans le chapitre sur la qualité.

> [!TIP]
> Un bon test : pouvez-vous répondre en moins d'une minute à « qui est responsable de cette table, est-elle à jour, et puis-je l'utiliser pour la facturation ? ». Si la réponse demande trois messages sur la messagerie interne, ce n'est pas encore un produit de données.

# Le data mesh

Le **data mesh**, proposé par Zhamak Dehghani, s'attaque au goulot d'étranglement des équipes centrales dans les grandes organisations. Il repose sur quatre principes :

```diagram
type: layers
title: Les quatre principes du data mesh
layers:
  - title: Propriété par domaine
    text: Les équipes métier (commandes, paiements, logistique) sont responsables de leurs données analytiques, pas une équipe centrale
  - title: La donnée comme produit
    text: Chaque domaine publie des produits de données avec responsable, contrat et qualité
  - title: Plateforme en libre-service
    text: Une équipe plateforme fournit les outils pour que les domaines publient sans être experts en infrastructure
  - title: Gouvernance fédérée et automatisée
    text: Des règles communes (sécurité, identifiants, interopérabilité) appliquées par la plateforme elle-même
```

Le data mesh est une **approche organisationnelle**, pas une technologie : on ne « l'achète » pas. Ses conditions de réussite sont exigeantes :

- des domaines **suffisamment matures** pour assumer la responsabilité de leurs données (compétences, temps, budget) ;
- une **plateforme solide** qui rend la publication d'un produit de données simple : modèle de projet, CI, tests, catalogue, contrôle d'accès, supervision, prêts à l'emploi ;
- une **gouvernance automatisée** (*policy as code*) : classification, rétention et accès appliqués par la plateforme, et non par des réunions ;
- des **identifiants partagés** (client, produit) pour que les produits de différents domaines puissent se joindre.

> [!WARNING]
> Appliqué trop tôt ou sans plateforme, le data mesh recrée le modèle décentralisé et ses silos : chaque domaine réinvente ses pipelines, avec des niveaux de qualité très différents. Pour une organisation de taille moyenne, une équipe centrale qui adopte la **pensée produit** (responsables, contrats, catalogue) apporte l'essentiel des bénéfices sans la complexité.

```video
url: https://www.youtube.com/watch?v=Keax6_SP77A
title: "What is Data Mesh? Managing Data for Speed and Scale"
channel: "Erik Wilde"
duration: "13:49"
lang: en
why: "Les principes du data mesh présentés pas à pas : propriété par domaine, données comme produit, plateforme en libre-service et gouvernance fédérée."
```

# La plateforme comme produit

Qu'on adopte ou non le data mesh, l'équipe plateforme gagne à traiter sa plateforme comme un **produit interne** : ses utilisateurs sont les analystes, les Analytics Engineers et les équipes métier.

- **Mesurer l'adoption** : nombre d'équipes qui publient, temps pour créer un nouveau pipeline, part des tableaux de bord sur des modèles certifiés.
- **Réduire la friction** : des « chemins balisés » (*golden paths*) : un modèle de projet qui inclut CI, tests, documentation et déploiement.
- **Écouter les utilisateurs** : feuille de route publique, retours réguliers, documentation tenue à jour.

# Piloter les coûts (FinOps des données)

Les coûts d'une plateforme de données moderne sont **variables** : chaque requête, chaque pipeline, chaque tableau de bord coûte. Sans pilotage, la facture croît plus vite que la valeur.

- **Attribuer** les coûts : étiquettes (*tags*) par équipe et par projet sur les ressources cloud, attribution des requêtes de l'entrepôt par utilisateur, rôle ou pipeline.
- **Rendre visible** (*showback*) avant de **refacturer** (*chargeback*) : un tableau de bord des coûts par équipe et par produit de données suffit souvent à changer les comportements.
- **Relier coût et valeur** : un modèle qui coûte 4 000 € par mois et alimente un tableau de bord ouvert deux fois par trimestre est un candidat à la suppression ou à une fréquence réduite.
- **Faire le ménage** : les tables et pipelines non utilisés depuis 90 jours sont signalés, puis dépréciés, puis supprimés, selon une politique annoncée.

```sql
-- Exemple (Snowflake) : coût en crédits par rôle sur les 30 derniers jours
SELECT role_name,
       round(sum(credits_attributed_compute), 1) AS credits
FROM snowflake.account_usage.query_attribution_history q
JOIN snowflake.account_usage.query_history h USING (query_id)
WHERE q.start_time >= dateadd('day', -30, current_timestamp())
GROUP BY role_name
ORDER BY credits DESC;
```

# Exercices

## Exercice 1 : Le goulot d'étranglement

Une équipe data centrale de 6 personnes reçoit 120 demandes par mois de 15 équipes métier. Le délai moyen de traitement est de 7 semaines ; plusieurs équipes ont recruté leur propre analyste qui extrait les données « en direct » depuis les bases de production. Que proposez-vous, sans tout réorganiser du jour au lendemain ?

<details>
<summary>Voir la solution</summary>

Évoluer vers un modèle **fédéré** :

1. L'équipe centrale se recentre sur la **plateforme** : modèle de projet dbt, CI, tests, catalogue, accès, et des modèles gold certifiés pour les données partagées (clients, produits, commandes).
2. Les analystes des équipes métier deviennent des **Analytics Engineers** de leur domaine : ils construisent leurs modèles sur la plateforme, avec les mêmes standards, au lieu d'extraire depuis la production.
3. Couper l'accès direct aux bases de production pour l'analytique, en proposant une alternative (données ingérées dans le lakehouse).
4. Mesurer : délai de mise à disposition, nombre de modèles publiés par les domaines, part des tableaux de bord sur des modèles certifiés.

</details>

## Exercice 2 : Est-ce un produit de données ?

La table `analytics.tmp_clients_v3_final` est utilisée par 14 tableaux de bord. Son créateur a quitté l'entreprise ; elle n'a ni description ni test ; elle est mise à jour « en général » chaque nuit. Que faites-vous pour en faire un produit de données ?

<details>
<summary>Voir la solution</summary>

1. Désigner un **responsable** (équipe et personne).
2. La renommer selon les conventions (par exemple `gold.dim_client`), en gardant une **vue de compatibilité** sous l'ancien nom pendant une période annoncée.
3. **Documenter** (description, colonnes, définitions) dans le catalogue, avec le lignage.
4. Ajouter des **tests** (unicité, non-nullité, valeurs acceptées) et un **objectif de fraîcheur** surveillé.
5. Publier un **contrat** et une politique de changement ; prévenir les propriétaires des 14 tableaux de bord.

</details>

## Exercice 3 : La facture qui double

La facture de l'entrepôt a doublé en trois mois. Personne ne sait pourquoi. Décrivez votre démarche.

<details>
<summary>Voir la solution</summary>

1. **Attribuer** : coûts par rôle, utilisateur, pipeline et entrepôt virtuel (vues d'historique des requêtes), étiquettes par équipe.
2. **Identifier** les plus gros postes : requêtes les plus coûteuses, modèles recalculés trop souvent, tableaux de bord sans cache, entrepôts virtuels qui ne se suspendent pas.
3. **Agir** : modèles incrémentaux, fréquences adaptées au besoin réel, partitionnement et clustering, suspension automatique, suppression des tables et pipelines inutilisés.
4. **Rendre visible** durablement : un tableau de bord des coûts par équipe et des alertes de budget, pour que la dérive ne se reproduise pas en silence.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Organiser la donnée
center: Une bonne plateforme repose autant sur l'organisation, les responsabilités et les coûts que sur la technique.
points:
  - icon: users
    title: Trois modèles
    text: Centralisé, décentralisé, fédéré ; le fédéré équilibre autonomie et cohérence.
  - icon: target
    title: Produit de données
    text: Responsable, contrat, documentation, tests, fraîcheur publiée.
  - icon: network
    title: Data mesh
    text: Domaines responsables, données comme produit, plateforme libre-service, gouvernance automatisée.
  - icon: tool
    title: Plateforme comme produit
    text: Chemins balisés, adoption mesurée, utilisateurs écoutés.
  - icon: money
    title: FinOps
    text: Attribuer, rendre visible, relier coût et valeur, faire le ménage.
  - icon: alert
    title: Le piège
    text: Un data mesh sans plateforme recrée les silos.
pitfall: Croire qu'un data mesh s'achète, ou laisser une table critique sans responsable.
remember: Toute table utilisée par d'autres mérite un responsable et un contrat.
```
