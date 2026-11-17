---
title: "Secrets et identités"
description: "Décider qui peut déployer, préférer des clés courtes, ranger les secrets dans un coffre, les faire tourner, et séparer les personnes des comptes de service."
duration: 40
objectives:
  - "Nommer qui a le droit de mettre en production, et par quel chemin"
  - "Séparer un compte humain d'un compte de service"
  - "Remplacer une clé longue par une identité à durée courte"
  - "Organiser le coffre, la rotation et le départ d'une personne"
---

# Qui a le droit de déployer

Déployer en production, c'est changer ce que les clients utilisent. Sur une équipe de huit, ce droit est **une liste courte**, pas un mot de passe partagé dans un gestionnaire dont tout le monde a la copie.

Le chemin normal :

- une personne fusionne via la revue ;
- le pipeline construit l'image ;
- une **approbation** nommée ouvre la production ;
- l'identité qui déploie est celle du pipeline, pas la clé personnelle de la personne qui a cliqué.

Deux personnes au moins savent approuver, pour qu'une absence ne bloque pas une correction urgente. L'auteur du changement ne s'approuve pas seul sur le parcours qui encaisse. La liste se relit quand quelqu'un change d'équipe. Elle tient dans le réglage de l'environnement protégé, pas dans un message épinglé.

Il existe un accès de **secours** (break-glass) : un compte très droit, inutilisé au quotidien, dont l'usage déclenche une trace et une revue le lendemain. S'il sert chaque semaine, ce n'est plus un secours, c'est une porte dérobée devenue habitude.

```diagram
type: flow
title: "Le chemin qui a le droit de déployer"
steps:
  - title: "Revue"
    text: "Une autre personne a lu le changement"
    tone: blue
  - title: "Pipeline"
    text: "Tests, image, scan"
    tone: violet
  - title: "Approbation"
    text: "Quelqu'un de la liste courte, pas l'auteur seul"
    tone: amber
  - title: "Identité du job"
    text: "Déploie le service, rien de plus"
    tone: teal
```

# Humains et comptes de service

Un **compte humain** représente une personne. Il a une authentification forte, un nom, une date de départ. Il sert à relire, approuver, enquêter. Il ne sert pas à faire tourner l'API à 3 h du matin.

Un **compte de service** représente un travail : le job qui déploie, le processus `commandes` qui lit la base, le job qui scanne. Il n'a pas de session interactive. Ses droits tiennent sur une fiche : ce qu'il peut faire, ce qu'il ne peut pas faire, qui en est responsable côté équipe.

| | Compte humain | Compte de service |
|---|---|---|
| Représente | Une personne | Un job ou un processus |
| Preuve | Authentification forte | Identité du pipeline ou de la plateforme |
| Durée | Le contrat de la personne | Le temps du job, ou une rotation prévue |
| Droits | Approuver, lire les logs, pas le secret de prod « pour tester » | Un verbe précis : déployer ce service, lire ce secret |
| Départ | Révoqué le jour même | Reste, mais son responsable humain est mis à jour |

Le mélange classique : un jeton personnel « temporaire » collé dans les variables du pipeline, parce que c'était plus rapide qu'une identité de job. Le jour où la personne part, le pipeline casse, ou pire, le jeton reste valide et personne ne sait qu'il est encore le sien. On ne met **jamais** un jeton humain dans la chaîne.

L'application a sa propre identité pour lire ses secrets et parler à la base. Le pipeline a la sienne pour déployer. Les deux ne se prêtent pas leurs clés.

# Des clés qui expirent

Une **clé à durée courte** vaut mieux qu'une clé que l'on « fera tourner un jour ». Le modèle propre, pour le cloud : le pipeline prouve qui il est (souvent via OIDC, auprès de la forge), le cloud lui donne un jeton d'une heure, le job déploie, le jeton meurt. Rien à copier dans les variables secrètes du projet. Rien qui survive à la nuit si le journal a fuité.

Quand une clé longue existe encore (ancien fournisseur, outil qui ne sait pas faire mieux), on la traite comme une dette visible :

- elle vit dans le coffre, pas dans un fichier ;
- sa date de rotation est écrite ;
- un seul job peut la lire ;
- une alerte ou un ticket rappelle l'échéance avant le jour dit.

Une clé sans date n'est pas « stable ». Elle est oubliée. Le jour où elle fuit, on ne sait pas où elle a été copiée, et l'on découvre les copies en cassant des environnements un par un.

> [!TIP]
> Si la forge peut obtenir un jeton court auprès du cloud, retirez la clé longue des variables du pipeline. Le confort d'une clé qui « marche toujours » est le coût d'une fuite qui marche toujours aussi.

# Un coffre, pas un fichier partagé

Le **coffre** est l'endroit unique où les secrets sont déposés, lus par une identité, et tracés. Un canal de discussion, un fichier `.env` envoyé par message, un document « mots de passe équipe » ne sont pas des coffres : on ne sait pas qui a lu, on ne peut pas révoquer la copie, on ne sépare pas staging et production.

Règles d'usage pour l'API :

- un secret de **staging** ne ouvre pas la production, et l'inverse non plus ;
- l'application `commandes` lit le secret de la base commandes, pas celui du paiement si elle n'appelle pas le paiement avec ce mot de passe ;
- la lecture est un événement (qui, quand, quel secret), pas un détail invisible ;
- le pipeline récupère le secret au moment du job, en mémoire, masqué dans les logs, sans l'écrire dans l'image ;
- un développeur qui doit déboguer en local utilise un secret de **développement**, ou un accès tracé au staging, pas une extraction du secret de production sur son poste.

Le coffre peut être celui du fournisseur (secrets du PaaS, gestionnaire du cloud) tant qu'il couvre ces règles. Installer un coffre supplémentaire « pour faire bien » avant d'avoir arrêté les fichiers partagés ajoute un outil sans retirer le risque.

```video
url: https://www.youtube.com/watch?v=BqekRTA6VCs
title: "Secrets Management: Secure Credentials & Avoid Data Leaks"
channel: "IBM Technology"
duration: "9:40"
lang: en
why: "IBM Technology présente la gestion des secrets : coffre, accès limité, rotation et traçabilité."
```

# Faire tourner un secret

La **rotation** remplace une valeur par une autre **sans** couper le service plus longtemps que le SLO ne le permet. On la répète sur un calendrier, et aussi juste après une fuite. Une rotation jamais répétée est un mode d'emploi théorique.

Pour le mot de passe de la base des commandes, l'ordre qui évite l'arrêt :

1. créer la nouvelle valeur, encore inutilisée ;
2. l'accepter **en plus** de l'ancienne côté base (deux mots de passe valides pendant la bascule) ;
3. écrire la nouvelle valeur dans le coffre ;
4. redémarrer ou recharger les processus pour qu'ils relisent le coffre ;
5. vérifier qu'une commande de test passe ;
6. retirer l'ancienne valeur ;
7. noter la date et les endroits qui avaient une copie (job, poste, document).

Si l'on retire l'ancienne avant que les pods aient relu, toutes les commandes échouent d'un coup. Si un script local gardait l'ancienne « pour dépanner », il casse au moment où on croyait avoir fini, ou pire il a encore un accès que l'on croyait fermé. La liste des copies fait partie de la rotation.

Une fuite inverse l'ordre sur un point : on **révoque vite**, quitte à accepter une courte erreur maîtrisée, plutôt que de laisser la valeur volée vivante le temps d'un plan parfait. On le dit dans le postmortem. On ne laisse pas la clé « encore un peu » parce que la fenêtre de changement est jeudi.

# Le jour où quelqu'un part

Le départ d'une personne est un test des identités. Le jour même :

- le compte humain est désactivé, sessions comprises ;
- ses approbations de production sont retirées de la liste ;
- ses jetons personnels sont révoqués ;
- les comptes de service **dont elle était la seule responsable** ont un nouveau responsable nommé, pas une suppression dans la panique ;
- on cherche les clés longues qu'elle a créées : coffre, cloud, forge, registre.

Si le pipeline utilisait son jeton personnel, le départ **casse la livraison** ou laisse une clé orpheline. C'est le signal que le compte humain et le compte de service avaient été confondus. La correction est de donner au pipeline sa propre identité, puis de vérifier qu'un départ simulé (retirer quelqu'un de la liste) ne bloque que ses accès à elle.

Le secours break-glass se teste une fois, hors incident, avec une trace. Un compte de secours que personne n'a jamais ouvert est souvent un compte dont le mot de passe est dans un tiroir, ou un compte qui ne marche plus. Les deux sont des incidents en attente.

# Exercices

## Exercice 1 : Le jeton « temporaire »

Mardi, Sam colle son jeton personnel de cloud dans les variables du pipeline « le temps que l'identité du job soit créée ». Le jeton n'a pas de date de fin. Jeudi, le pipeline déploie correctement. Sam est la seule personne qui sait que ce jeton est le sien.

Quels risques sont déjà là, et que mettez-vous à la place avant la fin de la semaine ?

<details>
<summary>Voir la solution</summary>

Le pipeline **est Sam**. S'il part, ou si son compte est révoqué, la livraison casse. Si le jeton fuit dans un log, c'est un accès humain, souvent plus large que le job, et sans expiration. Personne d'autre ne sait qu'il faut le chercher. La production dépend d'un secret qui n'est pas un compte de service.

Avant la fin de la semaine : créer l'identité du job (jeton court via la forge, ou clé de service au coffre avec date de rotation), lui donner uniquement le droit de déployer `commandes`, retirer le jeton de Sam des variables, et **révoquer** ce jeton personnel pour qu'une copie dans l'historique des logs ne vive pas. Vérifier qu'un déploiement de staging passe avec la nouvelle identité.

</details>

## Exercice 2 : La liste du vendredi

L'équipe de huit veut que « chacun puisse livrer ». Aujourd'hui, le kubeconfig d'administrateur circule, et l'auteur d'une fusion peut lancer la production depuis son poste. Vous avez le droit de proposer un dispositif, pas d'ajouter une plateforme.

Qui approuve, quelle identité déploie, et que devient le kubeconfig partagé ?

<details>
<summary>Voir la solution</summary>

Tout le monde peut **proposer** un changement via la revue. L'approbation de production est une **liste de deux ou trois personnes**, et l'auteur ne s'approuve pas seul. L'identité qui déploie est celle du **pipeline**, limitée à mettre à jour le service, pas un kubeconfig d'administrateur sur les postes.

Le fichier partagé est **retiré** : on révoque ses accès, on le remplace par la connexion individuelle en lecture pour enquêter (logs, métriques) et par le pipeline pour changer la production. Un secours break-glass reste scellé, tracé, inutilisé pour le vendredi ordinaire. « Chacun peut livrer » reste vrai : chacun peut faire passer un changement dans la chaîne. Tout le monde n'est pas administrateur du cluster.

</details>

## Exercice 3 : Rotation le mardi

Le mot de passe de la base `commandes` est dans le coffre. Les pods le lisent au démarrage. Un script sur le poste d'Inès, utilisé une fois en septembre, contient encore l'ancienne valeur. Vous devez tourner le secret mardi à 10 h, hors des soldes, sans arrêt long.

Décrivez l'ordre. À quel moment le script d'Inès doit-il être traité ?

<details>
<summary>Voir la solution</summary>

Ordre : nouvelle valeur créée, base qui accepte **les deux** mots de passe, coffre mis à jour, redémarrage des pods, commande de test verte, puis retrait de l'ancienne valeur. On surveille les erreurs de connexion pendant la bascule.

Le script d'Inès se traite **avant** de considérer la rotation finie : soit on le supprime, soit on le fait lire le coffre de développement, pas une copie. Si on l'oublie, il garde un accès après le retrait officiel, ou il casse en silence le jour où quelqu'un le relance. On note la copie dans le compte rendu de rotation. On ne retire pas l'ancien mot de passe tant que les pods n'ont pas relu le coffre.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Secrets et identités"
center: "Une personne approuve. Un compte de service déploie. Les clés courtes vivent dans le coffre."
points:
  - icon: users
    title: "Une liste courte"
    text: "Deux approbateurs au moins. L'auteur ne se livre pas seul. Le secours est tracé, pas quotidien."
  - icon: key
    title: "Humain ou service"
    text: "Le jeton d'une personne ne fait pas tourner le pipeline. Chaque job a son identité."
  - icon: clock
    title: "Durée courte"
    text: "La forge obtient un jeton d'une heure. Une clé longue a une date, ou c'est une dette."
  - icon: lock
    title: "Le coffre"
    text: "Staging et production séparés. Lecture tracée. Pas de fichier envoyé dans le canal."
  - icon: loop
    title: "Rotation chevauchée"
    text: "Les deux valeurs coexistent, les pods relisent, puis l'ancienne tombe. Les copies aussi."
pitfall: "Coller un jeton personnel dans le pipeline, ou retirer l'ancien secret avant que les pods ne relisent."
remember: "Le jour d'un départ, seuls les comptes humains tombent. La livraison, elle, a sa propre identité."
```
