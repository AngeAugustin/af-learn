---
title: Principes du pipeline
description: Comprendre pourquoi l'équipe automatise le trajet, quelles étapes se succèdent, ce qui les déclenche, et pourquoi un pipeline rouge ne se contourne pas.
duration: 55
objectives:
  - Expliquer ce qu'un pipeline remplace comme gestes manuels sur l'API commandes
  - Ordonner lint, tests, construction, publication et déploiement
  - Choisir un déclencheur adapté à une demande de fusion, à la branche principale ou à une livraison
  - Traiter un pipeline rouge comme un arrêt, pas comme un décor
---

# Pourquoi automatiser

Quand Nora déploie à la main, elle se souvient des étapes. La plupart du temps. Un vendredi sur quatre, elle oublie la variable nouvelle, ou elle lance les tests longs après avoir déjà redémarré la production, ou elle est absente et Samir « fait à peu près la même chose » dans un autre ordre.

Un **pipeline** est cette liste, écrite, exécutée par une machine, dans le même ordre, avec les mêmes commandes, à partir du commit que l'on désigne. Il ne rend pas le changement juste. Il rend le trajet fidèle. L'équipe de six peut le relire, le modifier par une demande de fusion, et le reprocher quand il diverge. On ne reproche pas à la mémoire de Nora d'avoir tenu trois mois.

Ce que l'automatisation achète, concrètement, pour la boutique :

- Léa voit un échec de test avant les clients, pas après ;
- le paquet déployé en recette est celui que le pipeline a construit, pas un dossier du portable ;
- Samir peut livrer un correctif un soir où Nora est en formation ;
- un oubli d'étape se corrige une fois dans le fichier, pas à chaque mise en ligne.

Ce qu'elle n'achète pas : le jugement métier. Le pipeline ne sait pas si l'arrondi au centime est la règle voulue par Inès. Il sait lancer le test qui encode cette règle, si quelqu'un l'a écrit. Automatiser un geste faux le rend faux plus souvent, et plus vite. On automatise un trajet que l'équipe a déjà rendu explicite.

> [!IMPORTANT]
> Le pipeline est le chemin normal. La session manuelle sur le serveur est l'exception, écrite quelque part, pas l'ombre permanente « au cas où le pipeline serait lent ».

```video
url: https://www.youtube.com/watch?v=ddDJxFnv-qs
title: "CI/CD Explained in 5 Minutes"
channel: "TechWorld with Nana"
duration: "4:53"
lang: en
why: "L'intégration et la livraison continues expliquées en cinq minutes par TechWorld with Nana."
```

# Les étapes qui reviennent

Les noms varient d'une forge à l'autre. Pour l'API commandes, l'équipe s'entend sur cinq étapes. L'ordre compte : on échoue tôt, on ne déploie pas un commit déjà rouge.

```diagram
type: pipeline
title: "Les cinq étapes de l'API commandes"
lanes:
  - title: "À chaque demande de fusion"
    steps:
      - title: Lint
        text: "Forme et erreurs évidentes, en quelques secondes."
        tone: violet
      - title: Tests
        text: "D'abord les tests rapides, ensuite l'intégration."
        tone: blue
      - title: Construction
        text: "Préparer l'artefact, sans le donner aux clients."
        tone: teal
  - title: "Quand main est vert"
    steps:
      - title: Publication
        text: "Déposer le paquet immutable, lié au commit."
        tone: amber
      - title: Déploiement
        text: "Recette d'abord. Production ensuite, sur décision."
        tone: rose
```

**Lint.** Vérifications rapides : style convenu, import inutilisé, erreur de syntaxe. Ce n'est pas la revue. C'est le filet qui évite à Samir de passer sa relecture à signaler une indentation.

**Tests.** Les tests unitaires d'abord (l'arrondi, sans réseau), les tests d'intégration ensuite (API et base de recette du pipeline). Le détail est dans le chapitre sur la qualité automatique. Ici, l'essentiel : un test rouge arrête les étapes suivantes.

**Construction.** Le pipeline fabrique l'artefact à partir du commit, dans un environnement propre. Pas de fichier oublié sur le disque de Léa. Si la construction échoue, il n'y a rien à publier.

**Publication.** L'artefact reçoit son identité (`1.8.3` ou le commit) et part au registre. On ne l'écrase pas. Cette étape ne met encore personne devant les clients.

**Déploiement.** La recette tire cet artefact. La production ne le tire que si la règle de l'équipe est satisfaite : recette jouée, déclencheur prévu, retour arrière possible. Déployer n'est pas une sixième étape cachée dans un script que personne ne relit. C'est un job visible, avec un journal.

Une étape qui « continue quand même » après un échec de tests n'est pas une optimisation. C'est la façon dont un artefact cassé arrive en recette et fait perdre une heure à Marc.

# Ce qui déclenche

Un pipeline qui ne part jamais ne protège personne. Un pipeline qui part pour un mauvais événement déploie la mauvaise branche. L'équipe nomme les déclencheurs.

**La demande de fusion.** Chaque poussée sur la branche de Léa relance lint, tests et construction. Elle voit le rouge sur la demande, pas dans un mail qu'elle ne lit pas. On ne publie pas un artefact de production depuis une branche non fusionnée.

**La branche principale.** Quand la demande entre dans `main`, le pipeline republie depuis ce commit-là et déploie la recette. C'est le commit que l'équipe a accepté, pas la branche déjà supprimée.

**Un tag de version.** `v1.8.3` peut déclencher la publication nommée. On ne tague pas pour « voir ». Le tag est une décision de version, déjà vue au chapitre précédent.

**La main de Nora, explicite.** Un bouton pour déployer en production le commit déjà publié, pas pour reconstruire un autre source. Le bouton sans contrôle de branche est dangereux : il déploierait la branche que l'on a sous les yeux.

**L'horloge, avec parcimonie.** Une vérification de dépendances chaque nuit peut avoir du sens. Un déploiement en production chaque nuit, non. L'horloge ne remplace pas une décision.

```yaml
# Déclencheurs du fichier GitHub Actions de l'équipe.
# Le fichier complet est dans le chapitre suivant.
on:
  pull_request:
  push:
    branches: [main]
```

`pull_request` couvre les demandes de fusion. `push` sur `main` couvre ce qui vient d'être intégré. Pas de troisième déclencheur « à chaque poussée de n'importe quelle branche vers la production ». La suite du parcours montrera le fichier entier, les secrets et les environnements. Les idées restent les mêmes si la forge change. L'équipe a choisi GitHub Actions et s'y tient, pour ne pas apprendre deux syntaxes le même mois.

Le pipeline affiche ce qui l'a déclenché : numéro de demande, commit, personne. Quand un déploiement surprend, la première lecture est ce déclencheur, pas le code des frais.

# Un retour rapide

Le retour utile arrive pendant que Léa a encore le diff en tête. Au-delà d'un quart d'heure pour le premier échec, elle change de tâche. Au-delà d'une heure, le pipeline devient un oracle que l'on consulte le lendemain, et que l'on contourne le soir même.

L'équipe vise ceci pour l'API commandes :

- lint et tests unitaires : quelques minutes, souvent moins ;
- tests d'intégration : assez pour être vrais, pas assez pour couvrir des scénarios que Marc jouera de toute façon à la main ;
- pas de reconstruction complète du monde à chaque faute de frappe.

L'ordre sert cette vitesse. La faute de frappe meurt au lint, avant l'intégration qui démarre une base. Le chapitre pratique montrera le cache qui accélère l'installation des dépendances. Le cache n'est pas une raison de lancer moins de tests. C'est une raison de ne pas attendre le téléchargement.

```diagram
type: flow
title: "Échouer tôt"
steps:
  - title: Lint
    text: "Secondes. On n'installe rien de lourd avant."
    tone: violet
  - title: Tests unitaires
    text: "La règle des frais, sans base et sans paiement."
    tone: blue
  - title: Intégration
    text: "API et base, seulement si l'unité est verte."
    tone: teal
  - title: Publier
    text: "Jamais si une étape précédente est rouge."
    tone: amber
```

Un pipeline vert en douze minutes vaut mieux qu'un pipeline « complet » en cinquante, que tout le monde contourne. Si une étape d'intégration dépasse ce que l'équipe peut attendre, on la découpe ou on la réserve à `main`, tout en gardant un filet rapide sur chaque demande de fusion. Le filet rapide ne remplace pas l'intégration. Il empêche d'attendre l'intégration pour apprendre qu'une parenthèse manque.

# Un pipeline rouge ne se contourne pas

`main` rouge veut dire : le prochain déploiement est un doute. On ne pose pas un correctif de frais par-dessus un commit dont les tests échouent déjà. On ne se dit pas « le rouge est ancien, le mien est sans rapport ». Peut-être. Le pipeline, lui, ne sait plus vous le garantir.

La règle d'Atelier Nord : un pipeline rouge sur `main` est le sujet suivant, avant une nouvelle demande d'Inès. Quelqu'un regarde la cause dans l'heure où l'équipe travaille. Pas pour faire la police : pour que le signal redevienne vrai. Un feu rouge allumé en permanence apprend à traverser quand même.

Trois façons de trahir ce signal, toutes déjà tentées :

- relancer le job jusqu'au vert, sans lire le journal ;
- cocher « continuer en cas d'erreur » sur l'étape de tests, pour que la publication ait lieu ;
- déployer depuis un portable « en attendant que le pipeline soit réparé ».

La relance sans lecture est acceptable une fois si l'on soupçonne un accroc du réseau de la forge, et si la deuxième exécution est comparée à la première. Elle n'est pas acceptable comme méthode. Un test qui passe à la troisième tentative est un test instable. Il reste un travail, pas une victoire.

« Continuer en cas d'erreur » sur les tests dit : publie même si l'arrondi est faux. Aucun délai de soldes ne justifie cette case. Si une étape est informative (un rapport de couverture, par exemple), elle n'est pas un test. On ne mélange pas les deux pour pouvoir ignorer l'une.

Le portable « en attendant » réintroduit le héros. Le correctif qui part ainsi n'a pas d'artefact, pas de journal de pipeline, pas de preuve que les tests ont vu ce commit. On répare le pipeline d'abord, quitte à retarder l'arrondi d'une heure. Une heure de retard sur un arrondi coûte moins qu'un paiement cassé sans chemin de retour.

> [!WARNING]
> Désactiver le blocage « pour cette fois » est un incident de processus. On le note, on le remet le jour même. La fois suivante a toujours une aussi bonne raison.

# La règle de l'équipe de six

Nora écrit la règle en une page, dans le dépôt, à côté du pipeline. Elle n'est pas dans un wiki que personne n'ouvre.

1. Toute demande de fusion lance lint et tests. Rouge : pas de fusion.
2. `main` construit et publie l'artefact, puis déploie la recette. Personne ne recompile sur le serveur.
3. La production part d'un geste explicite, sur un artefact déjà publié, pas d'un cron silencieux.
4. Un rouge sur `main` se traite avant le prochain sujet produit.
5. Contourner le pipeline est un événement rare, annoncé aux six, avec un retour au chemin normal dans la journée.

Cette page est elle-même revue comme du code. Quand Chloé veut ajouter une étape (analyse des dépendances, le chapitre suivant), elle modifie le pipeline et la page dans la même demande. Une étape lancée « en plus » sur la forge, invisible dans le dépôt, redevient la mémoire de Nora.

Le pipeline n'est pas le propriétaire du produit. Inès reste propriétaire de la promesse client. Léa reste propriétaire du calcul. Marc reste propriétaire du scénario qu'aucune assertion automatique ne couvre encore. Le pipeline est le propriétaire du **trajet** : même ordre, même commit, même paquet, échec visible.

Le jour où Samir livre l'arrondi pendant que Nora est absente, en lisant la page et en regardant le pipeline passer au vert, les principes sont en place. Le fichier YAML viendra juste après. Il ne sert à rien s'il encode l'ordre inverse : déployer, puis tester.

# Exercices

## Exercice 1 : L'ordre inversé

Le pipeline actuel d'une autre équipe de la boutique fait ceci : déployer en production, puis lancer les tests, puis envoyer un message si les tests échouent. Le déploiement du matin a déjà encaissé des commandes quand le message arrive.

Quel ordre proposez-vous, et quelle étape ne doit jamais être « informative » ?

<details>
<summary>Voir la solution</summary>

Ordre : lint, tests unitaires, tests d'intégration, construction, publication, déploiement en recette, déploiement en production seulement après la règle de l'équipe. Les tests qui protègent l'arrondi et le paiement s'arrêtent avant toute publication. Un échec ne déploie pas.

L'étape de tests ne doit jamais être informative. « Continuer en cas d'erreur » la transformerait en décor : le message arriverait après les clients, ce que cette équipe vit déjà. Un rapport de couverture peut être informatif. Le test du paiement, non.

Déployer d'abord « pour gagner du temps » fait gagner les minutes de pipeline et perdre le parcours d'achat. Le message d'échec n'est pas un retour arrière.

</details>

## Exercice 2 : Le mauvais déclencheur

Chloé a ajouté un déclencheur : toute poussée, sur n'importe quelle branche, publie un artefact et le déploie en recette. Elle voulait « voir sa branche tout de suite ». Le même après-midi, la recette que Marc utilisait pour valider `1.8.3` a été remplacée par un brouillon de paiement.

Quel déclencheur gardez-vous pour la recette, et comment Chloé peut-elle quand même voir sa branche ?

<details>
<summary>Voir la solution</summary>

La recette partagée suit `main`, après tests verts et publication de l'artefact de ce commit. On retire le déploiement déclenché par n'importe quelle branche.

Chloé garde `pull_request` pour le lint, les tests et, si l'équipe le veut, la construction d'un artefact **non** déployé sur la recette commune. Elle peut avoir un environnement jetable au nom de sa demande, jamais la recette que Marc tient pour `1.8.3`. « Voir sa branche » ne doit pas effacer ce que les autres sont en train de valider.

Le déclencheur se lit dans le journal du pipeline. Ici, il aurait dit « poussée de la branche paiement », ce qui suffit à expliquer la surprise, et à l'empêcher la fois suivante.

</details>

## Exercice 3 : Le rouge que l'on contourne

`main` est rouge depuis hier 16 h : un test d'intégration échoue une fois sur deux. Inès veut l'arrondi des frais ce matin, avant une campagne. Samir propose de déployer depuis son portable et de « réparer le test cet après-midi ».

Que décidez-vous, et que faites-vous du test instable ?

<details>
<summary>Voir la solution</summary>

On ne déploie pas depuis le portable. L'arrondi attend que `main` soit un signal vrai. Une campagne n'est pas une raison de poser un changement non tracé sur un pipeline déjà douteux.

Le test instable est le travail du matin, avant l'arrondi. On le rend déterministe, ou on le retire du chemin bloquant avec une date de retour et un propriétaire, en assumant le trou de couverture. Le laisser rouge et déployer à côté apprend aux six que le rouge ne compte pas. Le relancer cinq fois jusqu'au vert, puis déployer l'arrondi par le pipeline, ne répare rien : la prochaine demande retombera sur le même pile ou face.

Si l'arrondi est vraiment minuscule et que le test instable ne le concerne pas, il part **après** le retour au vert, par le pipeline, pas en parallèle par un portable. L'après-midi « où l'on réparera » n'arrive pas le jour d'une campagne.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Principes du pipeline"
center: "Même ordre, même commit, échec visible, avant que les clients ne paient."
points:
  - icon: loop
    title: "Le trajet écrit"
    text: "Le pipeline remplace la mémoire de Nora. Il ne remplace pas la règle métier des frais."
  - icon: list
    title: "Cinq étapes"
    text: "Lint, tests, construction, publication, déploiement. Un test rouge arrête la suite."
  - icon: zap
    title: "Le bon déclencheur"
    text: "La demande de fusion vérifie. Main publie et déploie la recette. Pas n'importe quelle branche."
  - icon: clock
    title: "Échouer tôt"
    text: "Le premier signal en quelques minutes. Une faute de frappe n'attend pas la base de données."
  - icon: alert
    title: "Rouge non ignoré"
    text: "Pas de relance superstitieuse, pas de portable en attendant. On répare le signal d'abord."
pitfall: "Déployer en production puis lancer les tests, et appeler le message d'échec une sécurité."
remember: "Un pipeline que l'on contourne n'est plus un pipeline. C'est un journal que personne ne croit."
```
