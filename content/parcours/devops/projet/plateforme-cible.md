---
title: "La plateforme minimale"
description: "Pour une équipe de huit qui livre une API, décrire la plateforme minimale et dire clairement ce que l'on ne construit pas le premier mois."
duration: 40
objectives:
  - "Lister les pièces minimales pour livrer une API de façon répétée"
  - "Choisir un seul runtime, PaaS ou cluster, et s'y tenir"
  - "Inclure l'observabilité dans le minimum, pas en option"
  - "Repousser au mois suivant ce qui n'aide pas encore la livraison"
---

# Huit personnes, une API

L'équipe compte **huit personnes**. Elle livre **une API** HTTP que des clients appellent (par exemple les commandes d'une enseigne). Elle n'est pas une équipe plateforme de quarante. Si trois personnes partent construire des outils internes, il en reste cinq pour le produit, et la plateforme n'a toujours pas de client.

Le premier objectif n'est pas « une belle plateforme ». C'est : **un changement revu arrive en production de façon répétée, avec un retour arrière, et l'on voit s'il casse.** Tout ce qui ne sert pas cette phrase attend.

Le périmètre du premier trimestre tient donc sur une main. Git. Une intégration continue. Un registre. **Un** endroit où le code tourne. De quoi observer. Deux environnements suffisent : staging et production. Le poste du développeur n'est pas un troisième environnement à synchroniser avec la prod.

```diagram
type: layers
title: "Ce qui doit exister pour livrer"
layers:
  - title: "Voir"
    text: "Logs, métriques RED, identifiant de requête, une ou deux alertes de symptôme"
  - title: "Exécuter"
    text: "Un PaaS ou un cluster, staging et production, secrets séparés"
  - title: "Versionner l'artefact"
    text: "Registre privé, image immuable identifiée par le commit"
  - title: "Vérifier"
    text: "Intégration continue, tests qui bloquent la fusion"
  - title: "Source"
    text: "Git, branche protégée, revue par une autre personne"
```

# Les cinq pièces du premier trimestre

On peut les nommer sans produit.

1. **Git** avec une branche protégée. Personne ne pousse en production en commit direct. Une revue d'une autre personne de l'équipe.
2. **Intégration continue** sur chaque proposition : tests, puis construction. Rouge : on ne fusionne pas.
3. **Registre** privé. L'image qui part plus loin est celle que la chaîne a poussée, pas un binaire recréé sur un poste.
4. **Un runtime**, PaaS ou cluster, avec staging et production. Le même type de déploiement des deux côtés.
5. **Observabilité** minimale branchée avant de se vanter que « c'est en prod » : sans elle, la cinquième pièce est un endroit où ça casse en silence.

Autour, sans en faire des projets : un coffre de secrets déjà fourni par le PaaS ou le cloud, une approbation pour la production, un moyen de revenir à l'image précédente. Ce sont des réglages des cinq pièces, pas une sixième plateforme.

Une personne de l'équipe **tient** ce chemin (le pipeline cassé a un responsable). Les sept autres peuvent le modifier par revue. On n'extrait pas une sous-équipe plateforme le premier mois.

# Git, intégration, registre

**Git** porte le code, le pipeline, et les manifests ou la configuration du service. Ce qui n'est pas dans Git se perd avec le poste de la personne en congé. La branche principale est protégée. L'historique reste lisible : une proposition, des tests, une fusion.

**L'intégration** répond à une question bête : ce commit est-il construisible et les tests passent-ils ? Elle ne répond pas encore à « le métier est-il content ». Elle doit être plus rapide que l'envie de la contourner. Un pipeline de quarante minutes sur une faute de syntaxe sera zappé. On commence par les tests qui attrapent les casses franches, puis on ajoute.

Le **registre** rend l'artefact réel. On n'y pousse pas depuis un portable « pour aller vite ». On n'y efface pas l'image de la veille : le retour arrière en a besoin. L'accès en écriture est celui du pipeline. L'accès en lecture est celui du runtime. Un registre public par erreur est un incident, pas un réglage par défaut.

Ces trois pièces existent souvent déjà en partie (une forge, un début de CI). Le travail du premier mois est de les **fermer** : pas de fusion rouge, pas d'image hors chaîne, pas de tag flottant comme seule identité.

# Un seul runtime

**Un** endroit exécute l'API. Soit un **PaaS** (deux applications, staging et production, le fournisseur gère les machines). Soit **un cluster**, avec deux namespaces ou deux environnements, et quelqu'un dans l'équipe qui sait le dépanner un mardi.

Les deux sont légitimes. Les tenir **ensemble** le premier mois ne l'est pas : on paie deux manières de déployer, deux manières de lire les logs, et l'incident tombe toujours sur celle que l'on maîtrise le moins.

```diagram
type: compare
title: "Choisir le runtime du premier trimestre"
columns:
  - title: "PaaS"
    tone: teal
    items:
      - "Peu de machines à patcher"
      - "Adapté si personne n'a opéré de cluster"
      - "Moins de contrôle sur le réseau"
      - "Souvent le défaut pour une seule API"
  - title: "Un cluster"
    tone: violet
    items:
      - "Utile si la contrainte réseau ou le socle l'exige"
      - "Demande une personne qui sait dépanner"
      - "Requests, probes, mises à jour des nœuds"
      - "Un seul cluster, pas un par environnement fantôme"
```

Défaut pour cette équipe, si aucun impératif ne pousse vers Kubernetes : **le PaaS**. On reconsidère le cluster quand une contrainte mesurée apparaît (placement réseau, plusieurs services qui doivent partager un socle déjà là), pas parce qu'un schéma d'architecture « fait plus sérieux » avec des hexagones.

Staging ressemble à la production dans la **façon de déployer** (même type d'image, même pipeline). Il n'a pas besoin d'être une copie des données clients. Des jeux de test et des volumes modestes suffisent. Une copie intégrale « pour faire réaliste » coûte, expose des données, et ment quand même sur le trafic.

# L'observabilité qui fait partie du minimum

Une production sans signal n'est pas une livraison, c'est un espoir. Le minimum, branché **avant** d'y mettre des clients, reprend les trois questions : ça marche, c'est lent, où ça casse.

- une ligne de log structurée par requête, avec l'identifiant ;
- débit, erreurs, latence du parcours critique ;
- un tableau unique où ces trois courbes sont déjà posées ;
- une alerte de symptôme (et pas dix) ;
- l'identifiant renvoyé au client pour le ticket.

Les traces complètes sur chaque appel interne peuvent attendre quelques semaines si les logs et les métriques répondent déjà. Elles deviennent prioritaires dès que « c'est lent » reste sans endroit. Ce qui ne peut pas attendre : l'identifiant, les trois métriques, l'alerte. Les ajouter après le premier gros incident, c'est enquêter à l'aveugle une fois, puis seulement s'outiller.

Le staging a les mêmes logs, avec une étiquette `env=staging`, pour ne pas mélanger les courbes. Il n'a pas besoin de réveiller l'astreinte la nuit.

# Ce qui attend le deuxième trimestre

Le premier mois **ne construit pas** ceci, même si chaque élément est défendable plus tard.

| Idée reçue | Pourquoi elle attend |
|---|---|
| Maillage de services (service mesh) | Une API n'a pas besoin d'un proxy de plus pour avoir des délais et des retries |
| Multi-région actif-actif | Le SLO de départ se tient sur une région, avec un retour arrière |
| Portail interne, plateforme « développeur » maison | L'équipe est le client et l'auteur : un README du pipeline suffit |
| Second outil de CI « plus moderne » en parallèle | Deux chaînes, zéro confiance dans le vert |
| Opérateurs et automatisations sur mesure | Tant que le PaaS ou le cluster de base ne déploie pas encore |
| Chaos engineering | On n'injecte pas des pannes avant d'avoir une alerte et un retour arrière |
| Copie de la prod dans le staging | Coût, données, et un faux sentiment de réalisme |
| Trois personnes détachées « plateforme » | Il resterait cinq personnes pour l'API |

Dire non au premier mois n'est pas un retard. C'est le moyen que les cinq pièces existent vraiment. Une maille de services installée alors que le pipeline est rouge ne livre pas l'API. Elle occupe l'unique personne qui savait la dépanner.

Quand le chemin commit, image, staging, approbation, production, retour arrière a été emprunté **plusieurs fois** sans héroïsme, on rouvre la liste. Pas avant.

# Exercices

## Exercice 1 : PaaS ou cluster

Personne dans l'équipe n'a maintenu de cluster. L'API est un service HTTP, une base gérée, un appel vers le stock. Le réseau de l'enseigne n'impose pas de placement spécial. Un membre propose Kubernetes « pour monter en compétence ».

Que choisissez-vous pour le premier trimestre, et quelle condition ferait revoir ce choix ?

<details>
<summary>Voir la solution</summary>

On choisit le **PaaS** : deux applications, staging et production, pipeline unique. Personne ne sait dépanner un cluster un mardi, et aucune contrainte (réseau, socle déjà imposé, plusieurs services à ordonnancer) ne le justifie. « Monter en compétence » se fait sur un bac à sable, pas sur le runtime qui encaisse les commandes.

On revoit le choix si une **contrainte** apparaît : obligation de placement réseau, plusieurs composants qui doivent partager un cluster déjà opéré, ou limites du PaaS mesurées (pas un schéma d'architecture). La compétence se construit alors avec une personne responsable, pas en remplaçant le PaaS le premier lundi.

</details>

## Exercice 2 : La liste et l'intrus

On vous demande le minimum pour que l'équipe livre chaque semaine. Cochez les pièces que vous mettez en place tout de suite, et nommez deux éléments de la liste suivante que vous **refusez** pour le premier mois : registre privé, service mesh, CI qui bloque la fusion, portail développeur maison, logs avec identifiant de requête, cluster dans une seconde région, approbation de production, copie intégrale des données clients en staging.

<details>
<summary>Voir la solution</summary>

Tout de suite : **registre privé**, **CI qui bloque**, **logs avec identifiant**, **approbation de production**. Ce sont des réglages des cinq pièces (artefact, vérification, voir, chemin vers la prod).

On refuse au premier mois, parmi la liste : le **service mesh**, le **portail maison**, le **cluster en seconde région**, la **copie intégrale des données** en staging. Deux suffisent dans la réponse, par exemple le mesh et la seconde région : ils n'aident pas le prochain déploiement, ils ajoutent un système à opérer. Le staging se contente de jeux de test.

</details>

## Exercice 3 : Trois personnes plateforme

La direction propose de détacher trois des huit personnes pour « construire la plateforme idéale » pendant un trimestre, pendant que les cinq autres livrent l'API « comme ils peuvent ». Le pipeline actuel est encore contournable depuis un poste.

Que répondez-vous, et que fait à la place la personne qui tient le chemin ?

<details>
<summary>Voir la solution</summary>

On **refuse** le détachement. Il resterait cinq personnes pour le produit, et trois pour une plateforme sans usage répété. Le besoin du trimestre est un chemin que toute l'équipe emprunte : Git protégé, CI bloquante, registre, un runtime, observabilité, approbation.

Une personne **tient** ce chemin et en répond quand il casse. Elle ne disparaît pas trois mois pour inventer un portail. Les autres modifient le pipeline par revue. Le contournement depuis un poste se ferme en premier : tant qu'il existe, la plateforme « idéale » n'est pas le chemin réel. On rouvrira un sujet d'outillage quand plusieurs livraisons auront suivi la chaîne sans héroïsme.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "La plateforme minimale"
center: "Huit personnes, une API : Git, CI, registre, un runtime, et de quoi voir."
points:
  - icon: git
    title: "Source protégée"
    text: "Revue obligatoire. La fusion rouge n'entre pas. Le pipeline vit dans le dépôt."
  - icon: server
    title: "Un seul runtime"
    text: "PaaS par défaut si personne n'opère de cluster. Staging léger, pas une copie des clients."
  - icon: eye
    title: "Voir avant de vanter"
    text: "Identifiant, trois métriques, une alerte. Sinon la prod est un espoir."
  - icon: users
    title: "Une personne tient le chemin"
    text: "Pas une sous-équipe de trois. Les autres changent la chaîne par la revue."
  - icon: clock
    title: "Le mois suivant"
    text: "Mesh, seconde région, portail maison : seulement après des livraisons sans héroïsme."
pitfall: "Lancer Kubernetes et un service mesh pendant que l'on peut encore déployer depuis un portable."
remember: "Le minimum est le chemin répété : commit, image, staging, approbation, retour arrière, signaux."
```
