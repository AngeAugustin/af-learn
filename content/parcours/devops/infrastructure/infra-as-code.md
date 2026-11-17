---
title: "L'infrastructure comme du code"
description: "Décrire l'état voulu, voir la dérive, relire l'infrastructure comme du code, garder l'état au loin, et cesser de cliquer les mêmes réglages."
duration: 58
objectives:
  - Expliquer pourquoi l'état voulu vit dans le dépôt plutôt que dans une console
  - Reconnaître une dérive et les deux cas où le prochain plan ne la montre pas
  - Relire un changement d'infrastructure avec le même sérieux qu'un changement applicatif
  - Dire ce que l'état distant protège, et ce qu'on n'ouvre plus à la main
---

# Décrire l'état voulu

L'**infrastructure as code** décrit l'état voulu dans des fichiers : ce bucket existe, il n'est pas public, cette règle n'autorise que tel port, ce cluster a trois nœuds de telle taille. Un outil compare cette description au monde réel et propose un écart. Vous l'acceptez, il l'applique. Le fichier reste. Six mois plus tard, il dit encore ce qui devrait être là.

La console, elle, dit ce que quelqu'un a cliqué en dernier, sans review, souvent sans historique exploitable. Deux personnes peuvent ouvrir le même réglage et se contredire. Personne ne sait si la règle large était un essai ou un choix. Le fichier tranche : s'il n'y est pas, ce n'est pas l'état voulu.

L'outil importe peu pour ce chapitre. Terraform, OpenTofu, Pulumi ou un langage propre au cloud font le même métier : un diff, puis un apply. Le chapitre suivant ouvre Terraform. Ici, on fixe ce que le diff est censé protéger.

Décrire l'état ne choisit pas l'architecture. Un mauvais réseau, écrit en code et relu trop vite, est appliqué trois fois, une par environnement. Le code rend le choix **visible** et **rejouable**. Il ne le rend pas juste.

```video
url: https://www.youtube.com/watch?v=BUuMIq8A3BE
title: "Infrastructure as code : l'essentiel en 8 minutes"
channel: "Cookie connecté"
duration: "8:01"
lang: fr
why: "L'infrastructure as code en huit minutes et en français : décrire l'infrastructure plutôt que la cliquer."
```

# La dérive, quand la console contredit le dépôt

La **dérive**, c'est un écart entre le fichier et le cloud. Quelqu'un ouvre un groupe de sécurité sur `0.0.0.0/0` un vendredi « pour une démo », et oublie de le refermer. Deux cas, très différents.

**La ressource est déjà dans le code.** Le prochain plan propose de la ramener à l'état décrit : refermer la règle. C'est le filet. Il ne faut pas l'appliquer les yeux fermés. Si la règle a été ouverte pendant un incident encore en cours, l'apply la referme au milieu de l'incident. On lit le plan, on retrouve qui a cliqué, on encode l'exception dans le code ou on la retire.

**La ressource n'a jamais été importée.** Elle a été créée à la souris, le code ne la connaît pas. Le plan est vert. Le trou reste. L'outil ne surveille que ce qu'on lui a donné. Un inventaire (compte, projet, tags obligatoires) rattrape ce que le plan ne voit pas. Sinon, « le plan est vide » veut seulement dire « rien n'a bougé parmi les objets suivis ».

```diagram
type: decision
title: "Le plan est vert"
nodes:
  - question: "La ressource que vous cherchez est-elle dans le code et dans l'état ?"
    yes: "Un plan vert veut dire qu'elle correspond au fichier."
    no: "Le plan ne la voit pas. Un objet cliqué peut quand même être ouvert au monde."
  - question: "Le plan propose de revenir en arrière sur un changement fait à la main ?"
    yes: "On cherche pourquoi la console a divergé avant d'appliquer."
    no: "On relit quand même le plan : un vert n'est pas une revue."
```

La dérive se traite le jour même. Une exception qui dure devient le vrai système, et le fichier ment.

# Relire l'infrastructure comme du code

Un changement d'infrastructure passe par une **pull request**, comme l'application. Le diff du fichier ne suffit pas : on y joint le **plan**, c'est-à-dire la liste de ce qui sera créé, modifié, détruit. Une ligne anodine (`name = "journaux-v2"`) peut détruire un bucket et en créer un autre, parce que le nom ne se renomme pas. La review qui ne lit que le HCL applaudit, le plan annonce la destruction.

On garde les changements **petits**. Un plan de 400 lignes mélange un nouveau bucket et le remplacement d'une base : personne ne voit la base. Un plan que l'auteur ne sait pas expliquer ne part pas.

Le plan relu est celui qu'on applique, pas un plan recalculé le lendemain avec d'autres identifiants. La CI le produit, une personne l'approuve, l'apply reprend ce plan. Produire le plan sur un portable et l'apply « à peu près pareil » en CI n'est pas la même revue.

```diagram
type: flow
title: "Le chemin d'un changement"
loop: "Une dérive rouvre un plan"
steps:
  - title: "Fichier"
    text: "L'état voulu, dans le dépôt."
    tone: blue
  - title: "Plan"
    text: "Créations, modifications, destructions."
    tone: amber
  - title: "Revue"
    text: "Le plan, pas seulement le diff."
    tone: violet
  - title: "Apply"
    text: "Le plan approuvé, via la CI."
    tone: teal
```

# L'état distant, un fichier qu'on ne garde pas en local

L'outil a besoin d'un **état** : la correspondance entre `aws_s3_bucket.logs` dans le code et l'identifiant réel chez le fournisseur. Sans cet état, le prochain plan veut tout recréer, ou ne sait plus quoi modifier. L'état est la carte. Le perdre, c'est perdre la main sur les objets.

Ce fichier n'a rien à faire sur un portable, ni dans Git. Il contient des identifiants, parfois des secrets que l'outil a dû écrire (un mot de passe de base créé par le code, par exemple). Un portable volé avec un état local est une fuite, et c'est aussi la fin des apply pour le reste de l'équipe.

L'état **distant** vit dans un stockage partagé, chiffré, versionné, avec un **verrou**. Le verrou empêche deux apply en même temps, qui se battraient sur les mêmes objets. L'accès est aussi étroit que l'apply en production : qui peut lire l'état peut souvent reconstruire des secrets. Les versions servent à comprendre un apply de mardi, pas à « revenir en arrière » en écrasant l'état sans un plan.

Deux personnes, deux états locaux : chacune croit gérer le bucket, chacune décrit un monde différent. C'est pire que pas d'outil. Un seul état distant, un seul verrou.

# Ce qu'on ne clique plus à la main

Tout ce qui est dans le dépôt se change dans le dépôt. Buckets, règles réseau, rôles, clusters, enregistrements DNS, files : la console sert à **regarder**, pas à corriger. Le clic est une dérive, même quand il part d'une bonne intention.

L'exception est le **break-glass**, pendant un incident, quand le chemin du code est trop lent pour arrêter une fuite. On clique, on le dit dans le canal d'incident, et le **même jour** le code rattrape le clic (ou le retire). Sinon le prochain apply, lancé par quelqu'un qui n'a pas vécu l'incident, défait le pansement.

On cesse aussi de cliquer ce que le code ne sait pas encore importer. Créer « juste un bucket de test » dans le compte de production, hors code, donne un objet invisible au plan. Les essais vont dans un compte ou un projet séparé, ou ils passent par une pull request comme le reste.

> [!IMPORTANT]
> La console reste ouverte pour comprendre un incident. Elle n'est plus l'endroit où l'on édite une règle que le dépôt décrit déjà.

Le gain n'est pas d'aller plus vite le premier jour. Le premier bucket est plus long à écrire qu'à cliquer. Le gain est le troisième environnement, la revue, et le lundi où quelqu'un demande pourquoi le port est ouvert : la réponse est un commit, ou elle n'existe pas encore et c'est justement le problème.

# Exercices

## Exercice 1 : Le port ouvert vendredi

Le groupe de sécurité de l'API est dans le code, ports 443 seulement. Vendredi, quelqu'un a ajouté `0.0.0.0/0` sur le port 22 depuis la console, pour une démonstration, puis il est parti. Lundi, la CI propose un plan qui retire cette règle.

Appliquez-vous tout de suite ? Que vérifiez-vous avant ?

<details>
<summary>Voir la solution</summary>

On n'applique pas à l'aveugle. Le plan fait son métier : il veut revenir à l'état décrit. On vérifie que la démo est finie, que personne n'utilise encore ce port 22, et que ce n'est pas un accès d'incident encore nécessaire.

Si la démo est finie, on applique, la règle large disparaît, et on rappelle que le prochain accès se fait par le code. Si quelqu'un en a encore besoin, on l'écrit dans le code (source restreinte, pas le monde entier) et on relit **ce** plan. Laisser la dérive « parce que le plan fait peur » garde le port ouvert sans propriétaire.

</details>

## Exercice 2 : Un plan vert trop rassurant

Un bucket de fichiers clients a été créé dans la console, public, dans le compte de production. Il n'est dans aucun fichier. La CI affiche un plan vide depuis des semaines. L'équipe en conclut que le compte est conforme.

Pourquoi le plan est-il vert, et qu'est-ce qui manque pour voir ce bucket ?

<details>
<summary>Voir la solution</summary>

Le plan ne compare que les ressources **suivies**, celles qui sont dans l'état. Le bucket cliqué n'y est pas. Vert veut dire « les objets connus n'ont pas divergé », pas « le compte ne contient rien d'autre ».

Il manque un inventaire du compte (liste des buckets, règles publiques, tags) et, pour celui-ci, une décision : l'importer dans l'état puis le fermer par le code, ou le vider et le supprimer s'il n'aurait pas dû exister. Tant qu'il n'est pas importé ou détruit, le prochain plan vert ne dira rien de lui.

</details>

## Exercice 3 : L'état sur le portable

Une seule personne appliquait, avec un `terraform.tfstate` dans son dossier personnel, non sauvegardé. Le disque lâche. Le dossier Git, lui, est intact. Les buckets existent encore dans le cloud.

Qu'est-ce qui est perdu exactement, et comment cet état aurait-il dû vivre ?

<details>
<summary>Voir la solution</summary>

Les ressources cloud sont toujours là. Ce qui est perdu, c'est la **carte** entre le code et leurs identifiants. Le prochain plan ne sait plus qu'il les gère déjà. On risque un second bucket, ou un apply qui échoue parce que le nom est pris. Si l'état contenait un mot de passe, le disque en panne est aussi une fuite possible (sauvegarde du portable, atelier de réparation).

L'état aurait dû être distant, chiffré, versionné, verrouillé, accessible à la CI et pas seulement à une personne. Le dépôt Git garde la description. Il ne remplace pas l'état. Reconstruire la carte (import) est possible, pénible, et évitable.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Infra comme du code"
center: "L'état voulu est dans le dépôt. Le plan dit ce qui va vraiment changer. La console ne corrige plus."
points:
  - icon: file
    title: "État voulu"
    text: "Buckets, règles, rôles, écrits et rejouables. Le code ne rend pas une mauvaise idée bonne."
  - icon: alert
    title: "Dérive"
    text: "Le plan rattrape ce qu'il suit. Un objet seulement cliqué reste invisible."
  - icon: eye
    title: "Relire le plan"
    text: "Le diff du fichier cache un destroy. La review lit les créations et les destructions."
  - icon: cloud
    title: "État distant"
    text: "Chiffré, versionné, verrouillé. Pas sur un portable, pas dans Git."
  - icon: lock
    title: "Plus de clic"
    text: "La console sert à voir. L'exception d'incident est rattrapée par le code le jour même."
pitfall: "Lire un plan vert comme une preuve que le compte entier est conforme au dépôt."
remember: "On revue le plan, puis on applique ce plan. Un clic sans commit est une dérive."
```
