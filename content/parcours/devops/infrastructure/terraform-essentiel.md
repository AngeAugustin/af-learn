---
title: "Terraform, l'essentiel"
description: "Provider, resource, variable et output, puis plan avant apply. L'état relie le fichier au cloud, illustré par un bucket fermé au public."
duration: 66
objectives:
  - Nommer le provider, la resource, la variable et l'output dans un petit fichier
  - Lire un plan et n'appliquer qu'ensuite, de préférence le plan relu
  - Expliquer ce que l'état retient après le premier apply
  - Reconnaître un changement qui détruit pour recréer
---

# Provider, resource, variable, output

**Terraform** lit des fichiers, interroge un fournisseur, et rapproche les deux. Quatre mots suffisent pour un premier fichier.

Le **provider** est le plugin qui parle à une API. Ici, AWS. On épingle sa version majeure : un apply ne doit pas charger tout seul un plugin dont le comportement a changé. Le numéro précis est celui que l'équipe a testé, pas un tutoriel recopié des années plus tard.

La **resource** est un objet à créer ou à modifier. Chaque bloc a un type (`aws_s3_bucket`) et un nom local (`logs`). Le code y fait référence par `aws_s3_bucket.logs`. Ce nom local n'est pas le nom du bucket dans le cloud.

La **variable** est une entrée. Le nom du bucket n'a pas de valeur par défaut : sans `-var` ou sans fichier `.tfvars`, le plan s'arrête, et personne ne crée un bucket au nom d'un exemple. La **output** est une sortie, affichée à la fin de l'apply et réutilisable par un autre module. On n'y met pas un secret.

```hcl
terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

variable "region" {
  type        = string
  description = "Région du bucket de journaux."
  default     = "eu-west-3"
}

variable "bucket_name" {
  type        = string
  description = "Nom mondialement unique du bucket de journaux."
}

resource "aws_s3_bucket" "logs" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_versioning" "logs" {
  bucket = aws_s3_bucket.logs.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "logs" {
  bucket                  = aws_s3_bucket.logs.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

output "bucket_name" {
  value = aws_s3_bucket.logs.bucket
}
```

Trois resources : le bucket, le versioning, le blocage d'accès public. Le versioning garde les anciennes versions d'un objet, ce qui limite les dégâts d'un écrasement. Le blocage d'accès public ferme les quatre interrupteurs qui, sinon, laissent une politique ou une ACL rendre le bucket lisible sur Internet. Aucune clé d'accès n'est écrite dans le fichier : le provider prend la chaîne habituelle (rôle de la CI, ou profil local en développement).

```video
url: https://www.youtube.com/watch?v=l5k1ai_GBDE
title: "Terraform explained in 15 mins | Terraform Tutorial for Beginners"
channel: "TechWorld with Nana"
duration: "18:15"
lang: en
why: "Terraform expliqué en un quart d'heure par TechWorld with Nana : providers, ressources, plan, apply et état."
```

# Plan puis apply

`terraform init` télécharge le provider. On le relance quand le provider ou le backend change, pas avant chaque plan.

`terraform plan` ne change rien. Il affiche ce qu'un apply **ferait**. Pour ce fichier, la première fois :

```text
# aws_s3_bucket.logs will be created
# aws_s3_bucket_versioning.logs will be created
# aws_s3_bucket_public_access_block.logs will be created

Plan: 3 to add, 0 to change, 0 to destroy.
```

On lit les trois blocs, pas seulement la dernière ligne. `3 to add` est rassurant ici parce que le compte ne contenait pas encore ces objets. `1 to destroy` sur un bucket de journaux ne l'est pas.

`terraform apply` sans plan enregistré recalcule tout de suite avant de changer le cloud. Entre la review et cet apply, une variable peut avoir changé. Le geste qui colle à la revue :

```text
terraform plan -out=plan.bin -var="bucket_name=journaux-atelier-prod"
terraform apply plan.bin
```

`plan.bin` est binaire, il peut contenir des valeurs sensibles, on ne le committe pas, et il devient invalide si l'état bouge entre-temps. La CI le produit, l'approbation porte sur ce fichier, l'apply le consomme.

```diagram
type: flow
title: "Rien ne change avant apply"
steps:
  - title: "init"
    text: "Provider épinglé, backend prêt."
    tone: blue
  - title: "plan"
    text: "3 to add, 0 to destroy, lu en revue."
    tone: amber
  - title: "apply"
    text: "Le plan enregistré, pas un autre."
    tone: teal
  - title: "état"
    text: "Le nom local est relié au bucket réel."
    tone: violet
```

`terraform destroy` existe. Sur ce bucket, il supprimerait les trois resources. On ne le lance pas « pour voir » contre un état de production. Un bucket qui porte des journaux utiles reçoit plutôt, dans le code de production, une protection qui refuse la destruction. L'exemple ci-dessus ne l'a pas, pour rester lisible dans un compte d'essai.

# L'état relie le code au monde réel

Après l'apply, l'**état** contient l'identifiant du bucket, celui du versioning, celui du blocage public, et les attributs que le provider a lus. La prochaine fois, Terraform sait que `aws_s3_bucket.logs` **est** ce bucket-là. Il proposera une modification, pas une deuxième création.

Changer `bucket_name` ne renomme en général pas : chez ce provider, le nom force une nouvelle resource. Le plan annonce une **destruction** et une création. Les journaux de l'ancien bucket ne suivent pas. On ne valide pas ce plan sur un bucket déjà rempli. On ajoute un second bucket, on migre, on retire l'ancien quand il est vide.

L'état n'est pas une sauvegarde des objets du bucket. Il ne contient pas vos journaux. Il contient de quoi les **gérer**. Le perdre oblige à réimporter chaque resource (`terraform import`) ou à risquer des créations en double. Comme au chapitre précédent, il vit dans un backend distant, verrouillé. Deux `apply` simultanés sans verrou se disputent la même carte.

On ne range pas de secret dans une output, ni dans un attribut en clair si une autre voie existe (un secret généré hors du dépôt, référencé). L'état stocke beaucoup de ce que les resources connaissent. Qui peut lire l'état peut lire ces valeurs.

# Un petit exemple, un bucket fermé au public

Le fichier tient volontairement sur une page. Il ne crée pas le réseau, le cluster, ni les rôles. Il montre le cycle complet sur un objet qu'on sait juger : un bucket de journaux, versionné, qui refuse d'être public.

En développement, on passe un nom unique :

```text
terraform plan -var="bucket_name=journaux-atelier-dev-42"
```

`eu-west-3` vient de la variable `region`, avec une valeur par défaut assumée. Un autre environnement pointe `region` ailleurs par un `.tfvars` **sans** remettre le reste du fichier. Le nom du bucket, lui, n'a pas de défaut : `journaux` tout court serait pris dans le monde, ou pire, serait le nom de production réutilisé par erreur.

Les quatre interrupteurs du blocage public vont ensemble. En laisser un à `false` « parce qu'un outil s'en sert » rouvre une porte que les trois autres semblaient fermer. Si un outil a vraiment besoin d'un accès, on écrit une politique **nommée**, sur un principal précis, et le blocage public reste en place : il empêche les politiques qui parlent de `Principal: *` sur Internet, il n'empêche pas un rôle IAM du compte.

> [!TIP]
> Après l'apply, la console sert à vérifier que le bucket refuse l'accès anonyme. Elle ne sert pas à décocher un interrupteur que le fichier vient de poser.

# Ce que ce fichier ne décide pas à votre place

Le fichier ne choisit pas la rétention des journaux, ni qui a le droit d'écrire, ni le compte cloud. Une resource de plus (`aws_s3_bucket_lifecycle_configuration`) viendra quand l'équipe aura décidé combien de temps un journal vit. L'ajouter « parce que l'exemple Internet en avait une » sans durée choisie, c'est coder une politique que personne n'a relue.

Il ne remplace pas non plus la revue. `~> 5.0` borne la majeure du provider au moment où ce fichier est écrit. Le jour où vous passez à la majeure suivante, c'est une pull request, avec un plan, pas un apply surprise. De même, `required_version` évite qu'un poste en Terraform trop ancien produise un état que les autres ne savent pas lire.

Enfin, le plan de ce bucket dans un compte d'essai (`3 to add`) n'autorise personne à lancer le même apply, avec le nom de production, depuis un portable. Le compte, le rôle et l'état distant de la production sont un autre sujet : celui des environnements.

# Exercices

## Exercice 1 : Lire la dernière ligne

Un plan se termine par `Plan: 2 to add, 0 to change, 1 to destroy.` La resource détruite est `aws_s3_bucket.logs`. Le diff du code ne change que `bucket_name`. Le bucket actuel contient trois mois de journaux.

Appliquez-vous ?

<details>
<summary>Voir la solution</summary>

Non. Le nom force un nouveau bucket : Terraform détruit l'ancien et crée le nouveau. Les journaux ne migrent pas avec le plan. `2 to add` (souvent le bucket et un réglage qui y est attaché) ne compense pas le `1 to destroy`.

On garde l'ancien nom dans l'état, on ajoute une **autre** resource pour le nouveau bucket, on copie les journaux, on bascule les écritures, et seulement ensuite on retire l'ancien, une fois vide. La review avait raison de lire la ligne destroy, pas seulement le changement de variable.

</details>

## Exercice 2 : Nommer les blocs

Dans le fichier du chapitre, désignez le provider, une variable sans défaut, une resource qui dépend d'une autre, et l'output. Pourquoi le nom local `logs` n'est-il pas le nom mondial du bucket ?

<details>
<summary>Voir la solution</summary>

Le provider est le bloc `provider "aws"`. La variable sans défaut est `bucket_name` (`region` a un défaut). `aws_s3_bucket_versioning.logs` dépend de `aws_s3_bucket.logs` parce qu'elle utilise son `id`. L'output `bucket_name` republie le nom réel.

`logs` est le nom **dans l'état et dans le code**. Le nom mondial est la valeur de `var.bucket_name`, choisie à l'apply. Deux environnements peuvent garder le nom local `logs` et des noms de buckets différents. Les confondre, c'est réutiliser le nom de production dans un essai.

</details>

## Exercice 3 : Apply depuis le portable

Quelqu'un propose `terraform apply -auto-approve` en production, depuis son portable, avec ses clés personnelles, « parce que le plan de la CI est trop lent ». Le dossier local n'a pas le backend distant.

Que refusez-vous, dans l'ordre des dégâts possibles ?

<details>
<summary>Voir la solution</summary>

`-auto-approve` saute la lecture du plan : un destroy passe avec le reste. Les clés personnelles sont un accès de production sur un poste, hors du rôle de la CI. Sans backend distant, l'état écrit en local diverge de celui de l'équipe : le prochain apply CI ne voit pas les mêmes objets.

On refuse la commande. Le plan est celui de la CI, relu, enregistré, appliqué par le rôle prévu. Le portable peut lancer un plan **contre un compte d'essai**, avec un état distant de ce compte, jamais un apply de production.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Terraform essentiel"
center: "Provider, resource, variable, output. On lit le plan, puis on applique ce plan, pas un autre."
points:
  - icon: puzzle
    title: "Quatre blocs"
    text: "Le provider parle au cloud. La resource décrit. La variable entre. L'output sort."
  - icon: eye
    title: "Plan d'abord"
    text: "3 to add peut cacher un destroy plus bas. On lit chaque ligne, pas le total seul."
  - icon: check
    title: "Apply ciblé"
    text: "plan -out puis apply de ce fichier. Pas d'auto-approve sur la production."
  - icon: database
    title: "État"
    text: "Relie le nom local au bucket réel. Distant et verrouillé, ce n'est pas une sauvegarde."
  - icon: shield
    title: "Bucket fermé"
    text: "Versioning plus blocage public. Le nom mondial vient de la variable, sans défaut."
pitfall: "Changer bucket_name sur un bucket plein : le plan détruit et recrée, les journaux ne suivent pas."
remember: "Le plan est la revue. L'apply qui compte est celui du plan déjà lu, par le rôle prévu."
```
