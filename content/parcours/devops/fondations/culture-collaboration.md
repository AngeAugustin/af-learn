---
title: Culture et collaboration
description: Sortir du renvoi de balle entre développement et exploitation, livrer par petits lots, intégrer souvent, et inclure l'exploitation dans la définition de terminé.
duration: 55
objectives:
  - Reconnaître une équipe qui se renvoie la responsabilité d'un échec
  - Expliquer pourquoi les petits lots et les branches courtes réduisent le risque
  - Décrire une revue sans recherche de coupable, dans ses grandes lignes
  - Inclure l'exploitation dans la définition de terminé d'un changement
---

# Quand on se renvoie la balle

Vendredi, 18 h 10. Le paiement d'Atelier Nord échoue pour une commande sur cinq. Léa écrit : « chez moi, le panier passe ». Nora répond : « le service tourne, c'est le code ». Marc colle des captures. Inès demande une heure de remise en route. Personne n'a encore ouvert le même journal.

Ce geste a un nom dans les équipes : se renvoyer la balle. Le développement défend la machine locale. L'exploitation défend le processus « up ». La qualité défend le scénario qu'elle a joué mardi. Le produit défend la promesse faite aux clients. Chacun a un morceau vrai, et le client, lui, ne commande pas.

Le découpage qui produit ce geste est stable, presque confortable :

- Léa a « fini » quand la demande de fusion est acceptée ;
- Nora a « fini » quand le processus redémarre ;
- Marc a « fini » quand le cas nominal a été coché en recette ;
- personne n'a fini quand le taux de commandes baisse.

La balle revient toujours au même endroit : le vide entre ces définitions de fini. Le correctif de frais de livraison peut être irréprochable sur un portable et faux en production, parce que la variable `TAUX_TVA` n'existe qu'en production, ou parce que le délai du paiement réel dépasse celui du paiement factice.

> [!IMPORTANT]
> « Ça marche chez moi » n'est pas une information sur la production. C'est une information sur une machine qui n'a pas les mêmes données, les mêmes délais, ni la même configuration.

La collaboration commence quand l'équipe regarde **un** fait partagé : la version citée par `/sante`, le journal de la requête qui a échoué, le changement entré depuis la dernière version saine. Avant ce fait, la discussion est un procès. Après, c'est un diagnostic.

# Une responsabilité partagée

La formule utile est courte : celles et ceux qui construisent le changement restent concernés quand il tourne. Dans l'équipe de six, Léa ne se déconnecte pas au moment où Nora déploie. Nora ne découvre pas le changement dans le journal, une heure après les clients.

Responsabilité partagée ne veut pas dire que tout le monde fait tout. Léa reste la meilleure personne pour le calcul des frais. Nora reste la meilleure pour le pipeline et le retour arrière. Marc reste le meilleur pour le scénario de caisse. Partager, c'est refuser les phrases qui ferment la porte :

- « ce n'est pas mon périmètre » alors que le client est bloqué ;
- « l'exploitation n'avait qu'à lire la demande de fusion » alors que la variable nouvelle n'y est pas ;
- « les devs livrent n'importe quoi » alors qu'aucun garde-fou ne les empêche de le faire.

Le garde-fou appartient à tout le monde. Si Nora est la seule à savoir qu'une migration est dangereuse, elle le dit **dans** le pipeline ou dans la revue, pas dans un souvenir. Si Léa sait que le paiement réel est plus lent que le factice, le test d'intégration doit attendre ce délai, pas le délai de son portable.

Concrètement, pour un changement de l'API commandes, la responsabilité se voit à trois moments.

**Avant.** La demande de fusion dit comment vérifier, comment revenir en arrière, et quelle configuration change. Une personne autre que l'auteur peut la lire sans appel.

**Pendant.** Le déploiement est un événement du pipeline, visible. La personne qui a écrit le code regarde le taux d'erreur avec celle qui opère, au moins pour les changements qui touchent le paiement ou le stock.

**Après.** Si la courbe bouge, on corrige ou on revient en arrière ensemble. On n'ouvre pas un ticket « pour Nora » qui dormira jusqu'au lundi alors que les commandes échouent le samedi.

Dans une équipe de six, cette règle est tenable parce que les lots sont petits. Personne ne peut « rester concerné » par une branche de six semaines et quarante sujets. Le partage de responsabilité exige des changements que l'on peut encore comprendre.

# Petits lots

Un lot, c'est la quantité de changement qui part d'un coup. Le gros lot d'Atelier Nord, l'an dernier : nouveau calcul de frais, nouveau moyen de paiement, et refonte du message d'erreur, dans la même mise en ligne, un jeudi de soldes. Quand le taux d'erreur a monté, personne ne savait lequel des trois était en cause. Le retour arrière annulait aussi le message d'erreur, déjà annoncé par Inès.

Le petit lot de cette semaine : uniquement l'arrondi des frais, derrière un comportement vérifiable, sans toucher au paiement. Si la courbe bouge, la cause est dans le diff. Le retour arrière rend l'arrondi précédent, pas trois projets.

```diagram
type: compare
title: "Gros lot ou petit lot"
columns:
  - title: Gros lot
    tone: rose
    items:
      - "Revue longue, que l'on survole"
      - "Cause de panne ambiguë"
      - "Retour arrière qui défait trop de choses"
      - "Recette jouée en partie, par fatigue"
  - title: Petit lot
    tone: teal
    items:
      - "Revue courte, sur un seul sujet"
      - "Cause lisible dans le diff"
      - "Retour arrière ciblé"
      - "Scénario de recette que Marc peut finir"
```

Petits lots ne veut pas dire miettes inutiles. Un lot a un sens pour Inès ou pour l'exploitation : « les frais s'arrondissent au centime », pas « j'ai renommé trois fichiers et commencé le paiement ». Si le sujet est trop gros pour un lot, on le coupe en tranches qui peuvent chacune partir : d'abord la donnée nouvelle écrite sans être lue, ensuite la lecture, ensuite la suppression de l'ancien chemin. Chaque tranche est déployable.

La taille se voit aussi dans la revue. Au-delà de quelques centaines de lignes, Samir ne relit plus, il acquiesce. La règle de l'équipe : si la demande de fusion ne se raconte pas en cinq minutes, elle est trop grosse, ou elle mélange deux sujets. On la scinde avant de discuter du style.

# Trunk ou branches courtes

Deux habitudes évitent la branche qui vit trois semaines.

La **branche principale** (souvent appelée trunk) reçoit des changements intégrés au moins une fois par jour. Le travail inachevé n'y est pas visible des clients : il est éteint par un interrupteur (un feature flag), ou il est trop petit pour casser le parcours. La branche principale reste déployable.

Les **branches courtes** sont le compromis de l'équipe de six. Léa crée une branche le matin pour l'arrondi, ouvre la demande de fusion l'après-midi, et la supprime le jour même. La branche dure des heures, parfois deux jours, pas un sprint. Elle part de la branche principale à jour, et elle y revient avant d'avoir divergé.

```diagram
type: flow
title: "Une branche qui ne s'installe pas"
steps:
  - title: Partir de main
    text: "À jour le matin, un seul sujet."
    tone: blue
  - title: Petite série de commits
    text: "Chacun raconte une étape relisible."
    tone: violet
  - title: Demande de fusion
    text: "Revue et pipeline, le jour même."
    tone: teal
  - title: Intégrer et effacer
    text: "La branche ne devient pas un second produit."
    tone: amber
```

La branche longue est tentante : « on intégrera quand ce sera beau ». Au bout de quinze jours, elle a dérivé. La fusion mélange les frais, le paiement, et les correctifs que la branche principale a reçus entre-temps. Le conflit n'est plus un désaccord de lignes, c'est un désaccord de produit. Marc ne peut pas tester « la branche » parce qu'elle contient trois promesses.

Nora tranche avec une règle simple. Une branche qui n'est pas intégrée au bout de deux jours ouvrés est soit coupée en lots, soit abandonnée. On ne la garde pas « le temps de finir ». Le code non intégré n'est pas un actif, c'est une dette de fusion.

Le feature flag, aperçu ici et détaillé avec les stratégies de déploiement, permet d'intégrer du code sans l'activer pour les clients. Intégrer n'est pas exposer. Confondre les deux pousse les équipes à cacher le travail dans des branches longues.

# Une revue sans coupable, en aperçu

Le lendemain d'une panne, la mauvaise question est « qui a cliqué ». Elle produit un coupable, un silence, et la prochaine panne. La question utile est « quel garde-fou a manqué pour que ce clic soit possible, ou pour que ses effets s'arrêtent vite ».

Cette habitude s'appelle souvent **blameless** : une revue sans recherche de coupable. Ce chapitre n'est pas le guide complet de l'incident. Il fixe seulement le réflexe, parce qu'il conditionne tout le reste. Si Léa sait qu'un échec en production lui vaudra un procès, elle livrera moins souvent, en plus gros lots, le vendredi, en espérant que Nora signe à sa place. La culture de la balle revient par la peur.

Dans l'équipe de six, le réflexe tient en quatre règles.

On décrit la chronologie avec des faits : version, heure, courbe, changement. On ne décrit pas des intentions (« elle a bâclé »).

On cherche le garde-fou absent : test qui ne couvrait pas le délai réel, revue qui n'a pas vu la variable, pipeline qui n'empêchait pas de déployer un vendredi de soldes, alerte arrivée trop tard.

On nomme des actions avec un propriétaire et une date. Nommer Nora pour ajouter un test de délai n'est pas la blâmer. C'est lui confier une action, ou la confier à Léa si le test est dans le code. Le propriétaire de l'action n'est pas le propriétaire de la faute.

On partage la note avec les six, pas dans une conversation privée. Le prochain changement en profite. Une leçon qui reste dans la tête de Nora est une leçon perdue dès ses congés.

> [!NOTE]
> La conduite détaillée d'un incident, les rôles et le suivi viennent plus loin dans le parcours. Ici, retenez le ton : le système a laissé passer l'erreur, on renforce le système.

# Terminé, y compris en exploitation

La **definition of done** (définition de terminé) est la liste qui dit quand un changement peut être considéré comme fini. Si elle s'arrête à « le code est fusionné », l'exploitation est une surprise. Chez Atelier Nord, un changement de l'API commandes n'est pas terminé tant que les points suivants ne sont pas vrais.

Le comportement est testé automatiquement, au niveau qui correspond au risque. Un arrondi a un test unitaire. Un appel au paiement a un test qui supporte le délai du prestataire factice.

La configuration nouvelle est nommée, avec une valeur de recette et une valeur de production. Pas de variable qui n'existe que dans la mémoire de Léa.

On sait quels signaux regarder après la mise en ligne : taux d'erreur HTTP, nombre de commandes payées, une ligne de journal que l'on peut retrouver. Pas un roman d'observabilité : un signal, écrit dans la demande de fusion.

Le retour arrière est possible. L'artefact précédent existe encore. Si une migration de données empêche de revenir en arrière, c'est écrit, et le lot n'est pas traité comme un déploiement ordinaire.

Le scénario de Marc a été joué sur l'artefact qui partira, pas sur une recompilation « équivalente ».

Inès sait ce que le client voit, y compris si le changement est éteint par un interrupteur.

Cette liste n'est pas un formulaire de plus. C'est le contrat qui empêche de se renvoyer la balle. Quand un point manque, la demande de fusion n'est pas « presque finie ». Elle est ouverte. L'équipe préfère un petit changement vraiment terminé à trois changements fusionnés que personne n'ose déployer.

```bash
# La question de fin de revue, à voix haute
# 1. Quel commit part ?
# 2. Quel signal dira que les commandes vont bien ?
# 3. Comment revient-on à la version d'avant ?
```

Si personne dans la salle ne répond aux trois, le changement n'est pas terminé, même si les tests sont verts. Les tests disent que le code se comporte comme prévu dans le pipeline. Ils ne disent pas que l'équipe saura le retirer.

# Exercices

## Exercice 1 : La balle au centre

Le message d'erreur du paiement a changé. En recette, Marc a validé le nouveau texte. En production, les clients voient encore l'ancien, et une commande sur dix n'affiche aucun message. Léa dit que le code est fusionné. Nora dit que le service a bien redémarré. Inès dit que la promesse client n'est pas tenue.

Écrivez le fait partagé que l'équipe doit établir en premier, puis deux causes possibles qui ne se règlent pas en choisissant un coupable.

<details>
<summary>Voir la solution</summary>

Le fait d'abord : quelle version et quel commit répondent sur `/sante`, et est-ce le commit qui contient le nouveau message ? Tant que ce fait n'est pas là, « fusionné » et « redémarré » parlent de deux moments différents.

Causes possibles sans coupable.

Le service a redémarré sur l'ancien artefact. Le pipeline n'a pas déployé le commit fusionné, ou un second exemplaire de l'API tourne encore avec l'ancienne version. Le garde-fou manquant est l'affichage de la version, consulté après chaque déploiement.

Le nouveau message dépend d'une variable absente en production. Le code est bien là, le texte retombe sur un chemin d'erreur vide. Le garde-fou manquant est la configuration nommée dans la demande de fusion, et un scénario de recette qui utilise les mêmes noms de variables que la production, avec d'autres valeurs.

Dans les deux cas, la suite est un correctif de système (déployer le bon artefact, déclarer la variable, ajouter le contrôle), pas une discussion sur le sérieux de Léa ou de Nora.

</details>

## Exercice 2 : Découper le gros lot

Inès veut, pour les soldes : un plafond de frais de livraison, un second moyen de paiement, et un e-mail de confirmation nouveau. Chloé propose une seule branche « soldes », intégrée dans trois semaines, déployée la veille.

Proposez trois lots dans un ordre déployable, et dites pourquoi la branche de trois semaines est le risque principal.

<details>
<summary>Voir la solution</summary>

Lot 1 : le plafond de frais, seul, avec son test et son signal (montant moyen des frais). Déployable cette semaine. S'il casse, on revient en arrière sans toucher au paiement ni à l'e-mail.

Lot 2 : le second moyen de paiement, intégré mais activé seulement pour un petit pourcentage de clients, ou d'abord pour les comptes de l'équipe. Le moyen actuel reste le chemin par défaut. On regarde le taux de paiements réussis.

Lot 3 : l'e-mail de confirmation, qui peut partir dès que le paiement actuel est stable. Il ne doit pas être bloqué par le second moyen de paiement, ni l'inverse.

La branche de trois semaines accumule les trois sujets, diverge de la branche principale, et transforme la veille des soldes en fusion géante. Si le taux d'erreur monte, on ne sait pas quel lot retirer. L'ordre ci-dessus laisse chaque lot annulable. La veille des soldes, on n'introduit pas un sujet nouveau : on élargit au plus un interrupteur déjà en production.

</details>

## Exercice 3 : Réécrire la définition de terminé

La définition actuelle de l'équipe tient en une ligne : « fusionné dans la branche principale, tests verts ». Le dernier incident venait d'une variable présente seulement en production, et personne ne savait quelle courbe regarder.

Ajoutez trois critères d'exploitation, concrets, que Marc peut vérifier sur la demande de fusion sans se connecter au serveur.

<details>
<summary>Voir la solution</summary>

Critère 1 : toute variable nouvelle est nommée dans la demande, avec la valeur de recette et le nom de la valeur de production (pas la valeur secrète elle-même). Une variable absente de cette liste n'existe pas.

Critère 2 : un signal est écrit en une phrase. Exemple : « après déploiement, le nombre de commandes payées sur dix minutes ne baisse pas de plus de 10 % par rapport à l'heure précédente ». Marc coche que la phrase est là, Nora ou Léa la regarde au moment du déploiement.

Critère 3 : le retour arrière est nommé. « Revenir à l'artefact `commandes-1.8.2`, déjà en registre, sans migration à défaire. » Si une migration empêche ce retour, la demande le dit et ne part pas comme un déploiement ordinaire.

Les tests verts restent nécessaires. Ils ne suffisent plus à déclarer le changement terminé. Marc vérifie ces trois lignes dans le texte de la demande, sans session sur le serveur : c'est volontaire. Le critère qui exige un accès héroïque n'est pas un critère d'équipe.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Culture et collaboration"
center: "Un changement est terminé quand l'équipe peut le voir tourner et l'annuler."
points:
  - icon: chat
    title: "Un fait, pas une balle"
    text: "Version, journal, dernier changement. On diagnostique le même objet au lieu de défendre son périmètre."
  - icon: users
    title: "Responsabilité partagée"
    text: "Chacun garde son métier. Personne ne quitte le sujet au moment où les clients le rencontrent."
  - icon: puzzle
    title: "Petits lots"
    text: "Un sujet par mise en ligne. La cause reste dans le diff, le retour arrière ne défait pas trois projets."
  - icon: git
    title: "Branches courtes"
    text: "Intégrer dans la journée ou le lendemain. Une branche de trois semaines devient un second produit."
  - icon: check
    title: "Terminé en exploitation"
    text: "Configuration nommée, signal à regarder, retour arrière écrit. Fusionné ne veut pas dire fini."
pitfall: "Chercher qui a cliqué, puis livrer ensuite en plus gros lots pour éviter d'être celui qui signe."
remember: "Partager la responsabilité n'est tenable que si les lots restent assez petits pour être compris."
```
