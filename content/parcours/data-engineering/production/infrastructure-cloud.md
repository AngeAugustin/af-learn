---
title: Infrastructure cloud et Infrastructure as Code
description: Les briques cloud d'une plateforme de données, les environnements, l'Infrastructure as Code avec Terraform et la maîtrise des coûts (FinOps).
duration: 65
objectives:
  - Identifier les services cloud d'une plateforme de données
  - Séparer les environnements de développement, de recette et de production
  - Décrire une infrastructure avec Terraform
  - Choisir où exécuter les pipelines (serverless, services gérés, Kubernetes) et sécuriser réseau et secrets
  - Suivre et réduire les coûts d'une plateforme de données
---

# Les briques d'une plateforme de données

Les trois grands fournisseurs (AWS, Google Cloud, Microsoft Azure) proposent des services équivalents pour chaque brique :

| Brique | AWS | Google Cloud | Azure |
|---|---|---|---|
| Stockage objet | S3 | Cloud Storage | Blob Storage / ADLS Gen2 |
| Entrepôt | Redshift | BigQuery | Synapse / Fabric |
| Traitement Spark géré | EMR, Glue | Dataproc | Synapse / Fabric, Databricks |
| Flux | Kinesis, MSK (Kafka) | Pub/Sub | Event Hubs |
| Orchestration gérée | MWAA (Airflow) | Cloud Composer (Airflow) | Data Factory |
| Catalogue | Glue Data Catalog | Dataplex | Purview |
| Secrets | Secrets Manager | Secret Manager | Key Vault |

S'y ajoutent des plateformes multi-cloud (Snowflake, Databricks, Confluent) et des solutions installées soi-même. Le choix dépend surtout du cloud **déjà utilisé** par l'entreprise, des compétences de l'équipe et des contraintes de **souveraineté** et de localisation des données.

> [!NOTE]
> Le **réseau** et l'**identité** sont des briques à part entière : réseaux privés, accès privés aux services (sans passer par Internet), et identités de services (rôles IAM) plutôt que des clés d'accès longue durée.

# Les environnements

On ne développe pas directement en production. Une plateforme sérieuse a au moins deux environnements, souvent trois :

```diagram
type: flow
title: Du développement à la production
steps:
  - title: Développement
    text: Chaque développeur, données d'échantillon ou anonymisées
    tone: blue
  - title: Recette (staging)
    text: Copie fidèle de la production, tests d'intégration
    tone: amber
  - title: Production
    text: Déploiement automatisé uniquement, accès restreints
    tone: teal
```

Principes :

- les environnements sont **isolés** (projets ou comptes cloud distincts, schémas distincts) ;
- ils sont **identiques** dans leur structure : c'est exactement ce que permet l'Infrastructure as Code ;
- les **données personnelles de production** ne sont pas copiées telles quelles en développement (échantillons pseudonymisés, données synthétiques) ;
- on déploie en production **uniquement** par la chaîne automatisée (CI/CD, chapitre suivant), jamais à la main.

# L'Infrastructure as Code

Créer des buckets, des bases et des droits en cliquant dans une console est rapide la première fois, mais impossible à reproduire, à relire et à auditer. L'**Infrastructure as Code** (IaC) décrit l'infrastructure dans des **fichiers versionnés** ; un outil se charge de créer, modifier ou supprimer les ressources pour que la réalité corresponde à la description.

**Terraform** (HashiCorp) est l'outil le plus répandu ; **OpenTofu** en est une version open source compatible, maintenue par la Linux Foundation. Les fournisseurs cloud ont aussi leurs outils (AWS CloudFormation, Azure Bicep), et Pulumi permet d'écrire l'infrastructure dans un langage de programmation.

```hcl
# main.tf - un bucket de data lake et un jeu de données BigQuery (Google Cloud)
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }
}

variable "environnement" {
  type = string          # "dev", "recette" ou "prod"
}

resource "google_storage_bucket" "lake" {
  name                        = "entreprise-lake-${var.environnement}"
  location                    = "EU"
  uniform_bucket_level_access = true

  lifecycle_rule {
    condition { age = 30 }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"     # stockage moins cher pour les données froides
    }
  }
}

resource "google_bigquery_dataset" "marts" {
  dataset_id = "marts_${var.environnement}"
  location   = "EU"
}
```

Le cycle de travail :

```bash
terraform init                     # télécharger les fournisseurs
terraform plan -var environnement=dev    # voir ce qui va changer, sans rien modifier
terraform apply -var environnement=dev   # appliquer après relecture du plan
```

- Le **plan** montre précisément les créations, modifications et **suppressions** prévues : on le relit (et on le fait relire en pull request) avant d'appliquer.
- L'**état** (*state*) mémorise la correspondance entre le code et les ressources réelles. Il se stocke dans un emplacement **partagé et verrouillé** (bucket dédié), jamais sur un poste ; il peut contenir des informations sensibles.
- Les **modules** Terraform factorisent des ensembles de ressources réutilisés dans chaque environnement.

> [!CAUTION]
> Un `terraform apply` peut **détruire** des ressources, y compris une base de données et son contenu, si le code a été modifié dans ce sens. Relisez toujours le plan, protégez les ressources critiques (`prevent_destroy`, protection contre la suppression côté cloud) et n'appliquez en production que par la CI.

# Conteneurs et Kubernetes pour la donnée

Les pipelines modernes s'exécutent presque toujours dans des **conteneurs** (chapitre sur Docker) : chaque tâche embarque ses dépendances et tourne de façon identique en développement et en production. Reste à savoir **où** les exécuter.

| Option | Exemples | Quand la choisir |
|---|---|---|
| **Conteneurs serverless** | Cloud Run Jobs, AWS Fargate / Batch, Azure Container Apps Jobs | Tâches ponctuelles, aucune infrastructure à gérer, facturation à la seconde |
| **Services gérés spécialisés** | Spark serverless, Airflow géré, entrepôt | Quand un service couvre le besoin, c'est souvent le meilleur choix |
| **Kubernetes** | GKE, EKS, AKS, ou installé soi-même | Beaucoup de charges variées, besoin de contrôle fin, équipe plateforme disponible |

**Kubernetes** orchestre des conteneurs sur un ensemble de machines. Les notions à connaître pour un Data Engineer :

- un **Pod** exécute un ou plusieurs conteneurs ; un **Job** exécute un Pod jusqu'à sa réussite (avec relances), un **CronJob** le planifie ;
- les **requêtes et limites de ressources** (`requests`, `limits` en CPU et mémoire) : une tâche qui dépasse sa limite mémoire est tuée (*OOMKilled*) ;
- les **Secrets** et **ConfigMaps** injectent configuration et identifiants, idéalement alimentés par le gestionnaire de secrets du cloud ;
- les **comptes de service** reliés aux identités cloud (*Workload Identity*, *IRSA*) donnent à chaque Pod des droits précis sans clé stockée ;
- la **mise à l'échelle automatique** des nœuds ajoute des machines quand des Pods attendent, et les retire ensuite.

```yaml
# Un traitement quotidien sous forme de Job Kubernetes
apiVersion: batch/v1
kind: Job
metadata:
  name: ventes-quotidiennes-2026-03-02
spec:
  backoffLimit: 2                     # deux relances maximum
  activeDeadlineSeconds: 3600         # tué au bout d'une heure
  template:
    spec:
      serviceAccountName: pipeline-ventes      # identité cloud, sans clé
      restartPolicy: Never
      containers:
        - name: transformation
          image: europe-docker.pkg.dev/entreprise/pipelines/ventes:1.8.2   # version figée
          args: ["--date", "2026-03-02"]
          resources:
            requests: { cpu: "2", memory: "8Gi" }
            limits:   { memory: "8Gi" }
          envFrom:
            - secretRef: { name: ventes-config }
```

Les orchestrateurs s'y intègrent directement : `KubernetesPodOperator` dans Airflow (chaque tâche dans son propre Pod, avec sa propre image), l'exécuteur Kubernetes de Dagster, ou **Spark sur Kubernetes** (l'opérateur Spark crée driver et exécuteurs comme des Pods).

> [!WARNING]
> Kubernetes est puissant mais exigeant : mises à jour du cluster, réseau, sécurité, supervision. Pour une petite équipe data, des conteneurs serverless et des services gérés couvrent la plupart des besoins sans cette charge. On adopte Kubernetes quand une équipe plateforme l'exploite déjà, ou quand le volume et la variété des charges le justifient.

## Le réseau et les secrets

- Placez bases, entrepôts et stockage dans des **réseaux privés** et accédez-y par des **points d'accès privés** (*Private Service Connect*, *PrivateLink*), sans exposition à Internet.
- Les identifiants vont dans un **gestionnaire de secrets**, avec rotation ; les tâches les reçoivent à l'exécution. Jamais dans le code, les images Docker ni les variables d'un dépôt Git.
- Préférez les **identités de service** (rôles IAM attachés aux Pods ou aux tâches) aux clés d'accès longue durée.

# Maîtriser les coûts (FinOps)

Le cloud facture à l'usage : une requête mal écrite, un cluster oublié ou une table dupliquée se paient immédiatement. Le **FinOps** consiste à rendre les coûts **visibles**, **attribués** et **optimisés**.

```diagram
type: stack
title: Répartition typique des coûts d'une plateforme de données (ordre de grandeur indicatif)
segments:
  - label: Calcul des requêtes et transformations
    value: 55
    tone: violet
  - label: Clusters et traitements (Spark, flux)
    value: 20
    tone: blue
  - label: Stockage
    value: 10
    tone: teal
  - label: Outils et services (ingestion, orchestration)
    value: 10
    tone: amber
  - label: Réseau et transferts
    value: 5
    tone: rose
```

> [!NOTE]
> Cette répartition varie fortement d'une entreprise à l'autre ; elle illustre surtout que le **calcul** pèse généralement bien plus que le **stockage**. Mesurez la vôtre avant d'optimiser.

Les leviers principaux :

- **Étiqueter** (*labels*, *tags*) toutes les ressources par équipe, projet et environnement pour attribuer les coûts ;
- **Budgets et alertes** à chaque niveau ;
- **Lire moins** : partitions, clustering, colonnes utiles, modèles incrémentaux (modules 3 et 4) ;
- **Arrêter ce qui ne sert pas** : suspension automatique des entrepôts, clusters éphémères détruits après le traitement, environnements de développement éteints la nuit ;
- **Cycle de vie du stockage** : classes de stockage moins chères pour les données froides, suppression des données temporaires ;
- **Supprimer les tables et pipelines inutilisés** (le lignage et les journaux d'accès montrent ce que personne ne lit) ;
- **Engagements** (capacité réservée, remises sur engagement) pour la charge stable, une fois celle-ci bien connue.

# Exercices

## Exercice 1 : Pourquoi l'IaC ?

Un collègue a créé les buckets et les droits de la plateforme à la main dans la console. Citez quatre problèmes que cela pose.

<details>
<summary>Voir la solution</summary>

1. **Non reproductible** : impossible de recréer un environnement de recette identique, ou de reconstruire après un incident.
2. **Non relu** : aucune revue des changements (un droit trop large passe inaperçu).
3. **Non traçable** : on ne sait pas qui a changé quoi, quand, ni pourquoi.
4. **Dérive** entre environnements : la recette ne ressemble plus à la production, les tests ne sont plus représentatifs.

</details>

## Exercice 2 : Lire un plan

Le plan Terraform d'une modification affiche `-/+ resource "google_bigquery_dataset" "marts" (forces replacement)`. Que signifie-t-il et que faites-vous ?

<details>
<summary>Voir la solution</summary>

La ressource va être **détruite puis recréée** (un attribut modifié ne peut pas être changé en place, par exemple la localisation). Pour un jeu de données BigQuery, cela signifie la **perte des tables** qu'il contient. Il ne faut **pas** appliquer : comprendre quel changement provoque le remplacement, l'annuler ou planifier une migration (copie des données), et protéger la ressource (`prevent_destroy` et protection côté cloud).

</details>

## Exercice 3 : Réduire la facture

La facture mensuelle de la plateforme a doublé en deux mois. Décrivez votre démarche.

<details>
<summary>Voir la solution</summary>

1. **Attribuer** : répartir les coûts par service, équipe, projet (grâce aux étiquettes) pour trouver où la hausse se concentre.
2. **Identifier** les requêtes, tables et traitements les plus coûteux (historique des requêtes de l'entrepôt, journaux de facturation).
3. **Corriger** les causes : requêtes sans filtre de partition, modèles reconstruits entièrement au lieu d'incrémentaux, tableaux de bord rafraîchis trop souvent, clusters non arrêtés, environnements de développement allumés en permanence.
4. **Prévenir** : budgets et alertes, `require_partition_filter`, quotas, suspension automatique, revue de coût dans les pull requests importantes.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Infrastructure cloud et IaC
center: Une infrastructure décrite en code, identique d'un environnement à l'autre, dont chaque euro est attribué.
points:
  - icon: cloud
    title: Les briques
    text: Stockage objet, entrepôt, traitement, flux, orchestration, catalogue, secrets.
  - icon: layers
    title: Environnements
    text: Développement, recette, production isolés et identiques ; production déployée par la CI.
  - icon: code
    title: Terraform
    text: Code versionné, plan relu, état partagé et verrouillé, modules réutilisables.
  - icon: alert
    title: Plan à relire
    text: Un remplacement peut détruire des données ; protéger les ressources critiques.
  - icon: server
    title: Où exécuter
    text: Conteneurs serverless d'abord ; Kubernetes (Jobs, ressources, identités) quand une équipe l'exploite.
  - icon: money
    title: FinOps
    text: Étiqueter, budgéter, lire moins, éteindre ce qui ne sert pas.
pitfall: Appliquer un plan Terraform sans le lire et recréer, donc vider, un jeu de données de production.
remember: Ce qui n'est pas dans le code n'existe pas de façon fiable, et ce qui n'est pas étiqueté ne sera jamais optimisé.
```
