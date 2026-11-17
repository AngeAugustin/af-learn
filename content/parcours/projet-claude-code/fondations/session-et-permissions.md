---
title: "Session, permissions et mode plan"
description: "Dans la session, l'agent demande avant d'exécuter un outil qui modifie ou qui lance une commande. Le mode plan s'ouvre avec /plan ou Shift+Tab. On refuse une commande que l'on ne comprend pas."
duration: 50
objectives:
  - "Lire une demande de permission et n'accepter que la commande comprise"
  - "Refuser une suppression large ou l'envoi d'un secret"
  - "Ouvrir le mode plan avec /plan ou Shift+Tab avant une édition risquée"
  - "Garder l'édition des sources pour après l'acceptation du plan"
---

# La session s'arrête avant d'agir

Vous êtes dans le dépôt Sève. La session est ouverte. En mode par défaut, elle lit les fichiers. Dès qu'elle veut exécuter une commande, éditer un fichier ou atteindre le réseau, elle s'arrête et affiche la demande. Vous répondez. Cet arrêt est le fonctionnement normal du terminal.

La demande nomme l'action. Une commande du shell se lit comme dans un terminal : le programme, les arguments, le dossier. Une édition nomme le fichier. Vous laissez passer celles qui servent le résultat écrit, par exemple afficher les places restantes sur huit. Vous prenez le temps de lire. Un oui rapide sur une longue commande est un oui que vous ne sauriez pas répéter.

> [!IMPORTANT]
> Le texte affiché est le contrat de ce oui. Vous acceptez cette commande-là, pas « tout ce que la session jugera utile ensuite ».

# Lire la demande, mot à mot

Une demande courte se lit en entier. `node --test` se comprend : lancer les tests du dépôt, sans les modifier. Dans le terminal, l'échange tient en peu de lignes.

```text
Bash
node --test

Vous : oui. C'est le test des stages.

Bash
git clean -fd

Vous : non. Je ne sais pas quels fichiers partiraient.
```

Une demande longue se découpe de la même façon. Quel programme. Quels fichiers. Est-ce qu'elle écrit, efface, ou envoie quelque chose quelque part.

Pour la page des douze stages, une lecture de fichier ou un test collent au résultat. Une commande qui réécrit l'arborescence, qui initialise un autre outil, ou qui « prépare l'envoi des SMS » sort du résultat. Vous demandez la raison en une phrase. Si la raison ne sert pas les places restantes, vous refusez, et vous rappelez l'incrément en cours.

Le refus ne casse pas la session. Vous dites non, puis vous reformulez. « Montre-moi la commande qui lance seulement le test. » La session propose autre chose, ou elle s'arrête sur cette piste. Les deux issues vous laissent le dépôt dans l'état que `git status` connaissait.

> [!TIP]
> Si vous ne pouvez pas expliquer la commande à voix haute, le oui attend. Reformuler la demande fait partie du travail, au même titre que coder.

# Refuser ce que vous ne comprenez pas

Deux familles se refusent sans négociation. La suppression large : un effacement récursif, un dossier entier, un `git clean` agressif, un retrait de fichiers que vous n'avez pas listés. L'envoi d'un secret : afficher un `.env`, poster un jeton, transmettre le moyen d'envoyer les SMS de Léa. Le fait que trois confirmations par mois soient oubliées ne donne pas à la session le droit d'expédier un message, ni de lire un mot de passe « pour tester ».

Vous refusez aussi une commande seulement à moitié lisible. Un tuyau de programmes, un téléchargement, un script dont le premier mot vous est inconnu. L'atelier a des règles simples, huit places, 45 €, attente de douze, 18 h. Une commande opaque n'est pas nécessaire pour les respecter. Vous pouvez demander une version plus courte, qui ne fait qu'une chose, et la relire.

> [!WARNING]
> « Je verrai dans le diff » arrive trop tard pour une suppression ou un envoi. Ces actions ont déjà eu lieu au moment où la commande se termine. Le refus se place avant le oui.

# Le mode plan : lire et chercher

Le mode plan sert à préparer un changement sans l'écrire. Vous l'ouvrez avec `/plan`, ou avec Shift+Tab. Vous pouvez joindre la tâche dans la même ligne :

```text
/plan Préparer le formulaire qui refuse la 9e place.
Règle de Léa : 8 places, 45 €. Ne pas éditer les sources.
```

En mode plan, la session lit et cherche. Elle peut parcourir le dépôt et rédiger un plan : fichiers concernés, règle des huit places, ce qu'un test devrait montrer. Elle n'édite pas les sources tant que vous n'avez pas accepté le plan. C'est le bon mode avant l'incrément 2, quand toucher au formulaire peut casser la page des stages déjà obtenue.

Une commande de pure lecture peut accompagner la recherche. Une commande qui efface, qui envoie, ou qui écrit un secret se refuse quand même. Le mode plan élargit la réflexion. Il ne signe pas un chèque en blanc.

```diagram
type: decision
title: "Oui, non, ou plan"
nodes:
  - question: "Est-ce que je comprends toute la commande affichée ?"
    yes: "Si elle sert le résultat écrit, je peux accepter cette commande-là."
    no: "Je refuse. Suppression large ou envoi d'un secret : c'est un non."
  - question: "Le changement touche plusieurs fichiers ?"
    yes: "J'ouvre /plan ou Shift+Tab. J'accepte le plan avant toute édition."
    no: "Je reste sur une demande courte, relue mot à mot."
```

# Accepter le plan, puis éditer

Le plan se lit comme un diff qui n'existe pas encore. Vous y cherchez les nombres de Sève. Huit places, pas dix. Le prix 45 € si le formulaire l'affiche. L'attente et les 18 h seulement si cet incrément les concerne. Un plan du formulaire qui « en profite » pour coder la liste d'attente et les SMS mélange trois incréments. Vous le renvoyez.

Quand le plan nomme les bons fichiers et la bonne règle, vous l'acceptez. L'édition des sources devient possible. Chaque écriture peut encore s'arrêter sur une permission : vous revoyez le fichier. À la fin, `git diff` se compare au plan. Une édition qui sort du plan se traite comme une édition que vous n'avez pas demandée.

> [!NOTE]
> Shift+Tab et `/plan` ouvrent le même mode. Tant que vous apprenez le dépôt, gardez les demandes visibles. Un mode qui exécute sans vous les montrer vous retire le moment du refus.

# Un oui étroit pour l'atelier

Le oui utile, sur Sève, reste étroit. Lancer le test déjà écrit. Éditer le fichier que le plan a nommé. Lire un extrait pour vérifier que la neuvième place est refusée. Le oui large (« fais le nécessaire », « tu peux tout lancer ») retire la relecture. Vous le gardez pour plus tard, le jour où le dépôt et les commandes vous sont familiers. Ce jour n'est pas le premier formulaire.

Léa tranche avant 18 h la veille, sur les places de l'atelier. Dans le terminal, la session propose, et votre oui ou votre non décide. Refuser une suppression ou l'envoi d'un secret protège le dépôt de la même façon que la règle des 18 h protège le stage.

# Exercices

## Exercice 1 : La commande trop large

La session demande l'autorisation d'une commande qui efface un dossier entier « pour repartir propre », avant d'afficher les douze stages. Vous ne sauriez pas dire quels fichiers partent. Que répondez-vous ?

<details>
<summary>Voir la solution</summary>

Vous refusez. Une suppression large que vous ne savez pas lister ne se découvre pas après coup dans le diff : les fichiers sont déjà partis. Vous le dites dans le fil, sans chercher une formulation polie qui laisserait passer la commande.

Vous rappelez le résultat : la page des stages, en lecture d'abord. Une commande plus courte, qui ne fait que lire ou lancer le test, pourra être redemandée. Le dépôt que `git status` montrait reste l'état de référence.

</details>

## Exercice 2 : Le plan du formulaire

L'incrément 2 approche : le formulaire doit refuser la neuvième place. La page des douze stages est déjà dans le dépôt. Comment ouvrez-vous le travail ?

<details>
<summary>Voir la solution</summary>

Vous ouvrez le mode plan avec `/plan` ou Shift+Tab. La demande rappelle la règle : huit places, refuser la neuvième, 45 € si le prix est affiché. Elle demande un plan, pas une édition.

Vous lisez le plan. Il nomme les fichiers du formulaire, et il laisse l'attente et les 18 h pour les incréments suivants. Vous l'acceptez seulement à cette condition. L'édition des sources commence après ce oui. Le diff final se compare au plan.

</details>

## Exercice 3 : Le jeton des SMS

Pour « régler les trois absents », la session propose d'afficher le fichier de secrets et d'envoyer un SMS de test avec le jeton qu'il contient. Le résultat en cours est encore la page des stages. Que faites-vous ?

<details>
<summary>Voir la solution</summary>

Vous refusez l'affichage du secret et l'envoi. Un jeton n'a pas à passer dans le terminal, ni dans le fil. Les trois absences du mois expliquent l'incrément 4, la confirmation visible et la règle des 18 h. Elles n'autorisent pas un envoi maintenant.

Vous ramenez la session au résultat écrit. Si le fichier de secrets a déjà été lu, vous considérez le jeton comme exposé dans la session, et vous le traitez comme un secret à renouveler. Le prochain oui reste une lecture ou un test, rien qui ne quitte la machine.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Permissions et mode plan
center: "La session s'arrête avant d'exécuter. Vous lisez la commande. /plan ou Shift+Tab préparent le changement sans éditer les sources."
points:
  - icon: shield
    title: Le oui
    text: "Une commande, une écriture, un accès réseau : la demande s'affiche. Vous décidez."
  - icon: alert
    title: Refuser
    text: "Suppression large ou envoi d'un secret : non. Une commande illisible attend aussi."
  - icon: search
    title: Mode plan
    text: "/plan ou Shift+Tab. Lecture et recherche. Les sources restent en place."
  - icon: check
    title: Après le plan
    text: "Vous acceptez un plan qui tient les 8 places. L'édition vient ensuite."
  - icon: target
    title: Oui étroit
    text: "Le test, le fichier nommé, l'extrait qui montre la 9e place refusée."
pitfall: "Dire oui à une commande que vous ne sauriez pas répéter, ou éditer les sources avant d'avoir accepté le plan."
remember: "Refusez la suppression large et l'envoi d'un secret. Ouvrez le mode plan avant un changement qui touche plusieurs fichiers."
```
