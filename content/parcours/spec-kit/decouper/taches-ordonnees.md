---
title: "Des tâches dans l'ordre"
description: "Obtenir tasks.md avec /speckit-tasks, dans l'ordre des dépendances, et retirer la tâche qui brancherait le SMS."
duration: 50
objectives:
  - "Produire tasks.md depuis le chat avec /speckit-tasks"
  - "Lire un ordre imposé par les dépendances"
  - "Tenir le refus du 13e nom, puis le compte sans téléphone, puis la phrase des 18 h"
  - "Retirer une tâche « brancher le SMS »"
---

# Le skill dans le chat

Léa Vernet tient Atelier Sève, à Lyon Croix-Rousse. Le samedi va de 10 h à 13 h, 8 places, 45 €. L'attente s'arrête à 12 noms. Elle tranche avant 18 h la veille. Le mois compte 12 stages, le remplissage est de 70 %, et 3 personnes manquent parce qu'un SMS a été oublié. La liste des stages et le refus de la 9e place sont déjà en place.

La fonctionnalité de ce tour est l'attente. La spec et le plan existent. Avant d'envoyer le skill, vous ouvrez `.specify/feature.json` et vous vérifiez qu'il désigne cette fonctionnalité, pas une autre déjà livrée.

Vous écrivez dans le chat de l'agent, sur le dépôt :

```text
/speckit-tasks
```

Ce message est un skill de GitHub Spec Kit. Le terminal ne le reçoit pas. Vous n'ajoutez rien après le nom. Le skill lit la spec et le plan, puis il écrit `tasks.md`. Le fichier groupe le travail en phases. Chaque tâche a une case. L'ordre du fichier est l'ordre du travail.

> [!IMPORTANT]
> `/speckit-tasks` se lance dans le chat. Il produit `tasks.md` pour la fonctionnalité indiquée par `.specify/feature.json`.

# L'ordre vient des dépendances

Une tâche qui a besoin d'une autre vient après. Le skill ne classe pas selon l'envie, ni selon la taille d'un fichier. Deux tâches ne se font ensemble que si aucune n'attend l'autre.

Pour Sève, trois comportements se suivent. D'abord le refus du 13e nom. Ensuite l'affichage « 3 personnes en attente », sans téléphones. Ensuite la phrase des 18 h. Cette suite est celle que `tasks.md` doit montrer. Si le fichier les mélange, vous ne codez pas dans le désordre pour rattraper.

| Ordre | Tâche | Elle attend |
| --- | --- | --- |
| 1 | Refuser le 13e nom | Le plafond de 12 |
| 2 | « 3 personnes en attente », sans téléphone | Le refus du 13e |
| 3 | La phrase des 18 h | Une file bornée, déjà comptée en public |

La liste des 12 stages ne redevient pas une tâche. Le refus de la 9e place non plus. 8 places restent 8. 45 € reste un prix affiché.

Les phases du fichier peuvent commencer par une préparation. La phrase des 18 h n'y entre pas. Elle appartient à l'histoire de l'attente, après le plafond et après le compte.

# D'abord le refus du 13e nom

L'attente tient 12 noms, dans l'ordre d'arrivée. La personne qui se présente en 13e n'entre pas. Cette tâche vient en premier parce que les deux suivantes parlent d'une file qui a déjà un plafond. Sans ce refus, un compte peut afficher 13, puis 20, et « 3 personnes en attente » ne désigne plus la même règle.

La 9e personne ne s'assoit pas : ce refus-là est déjà en place, sur les 8 places. Elle peut attendre, jusqu'au 12e nom de la file, pas au-delà. La tâche nouvelle ne réécrit pas la page des stages. Elle nomme le geste : l'ajout du 13e nom est refusé, les 12 noms déjà là restent dans l'ordre.

Vous lisez la phrase, pas seulement l'identifiant. « Gérer l'attente » est trop flou. Le nombre 13, le plafond 12 et l'ordre d'arrivée doivent être dans la ligne.

```text
- [ ] T012 Refuser le 13e nom. Les 12 noms déjà là restent dans l'ordre d'arrivée.
- [ ] T013 Afficher « 3 personnes en attente » sans téléphone quand trois personnes patientent.
- [ ] T014 Afficher la phrase : décision de Léa avant 18 h la veille.
```

# Ensuite le compte, sans téléphones

Une fois le plafond tenu, la page publique peut parler. Quand trois personnes patientent, elle affiche « 3 personnes en attente ». Elle n'affiche pas leurs téléphones. Elle ne déroule pas leurs noms pour un visiteur.

Cette tâche dépend de la première. Le 3 est l'exemple que Léa peut vérifier : trois personnes, une phrase, zéro téléphone. Une ligne qui dit seulement « afficher l'attente » oublie l'interdit. Vous ne la laissez pas passer.

Si la spec disait déjà l'interdit et que la tâche l'a perdu, vous relancez `/speckit-tasks` et vous relisez l'ordre. Si la spec elle-même oubliait les téléphones, vous corrigez la spec d'abord, puis vous relancez le skill. Un fichier trié à la main, à côté d'une spec floue, se fera réécrire de travers au prochain passage.

L'écran de Léa peut garder l'ordre des noms. Ce n'est pas la phrase publique. Vous ne fusionnez pas les deux tâches pour aller plus vite. Le visiteur voit un compte. Léa voit l'ordre, ailleurs.

# La phrase des 18 h vient après

Léa décide avant 18 h la veille. La phrase à l'écran le dit. Elle vient en troisième, parce qu'elle s'adresse à une file déjà bornée à 12, et dont la face publique est un compte. La phrase n'envoie rien. Elle énonce l'heure.

Le visiteur lit l'heure. Léa la lit aussi, sur son écran, avant de trancher. La tâche porte la phrase, l'heure, la veille. Elle ne décrit pas un rappel, ni un changement du créneau. Le stage reste samedi, 10 h-13 h, à Croix-Rousse.

```diagram
type: flow
title: "L'attente, dans l'ordre des dépendances"
loop: "Une tâche SMS qui réapparaît se retire. Elle ne se décale pas en fin de fichier."
steps:
  - title: Refuser le 13e
    text: "Douze noms au plus. Le treizième n'entre pas. Les présents gardent leur ordre."
    tone: violet
  - title: Compter sans téléphone
    text: "« 3 personnes en attente » quand trois personnes patientent. Aucun numéro sur la page publique."
    tone: teal
  - title: Dire 18 h
    text: "La décision de Léa est avant 18 h la veille. La phrase se lit. Elle n'envoie rien."
    tone: amber
```

# La tâche SMS n'a pas sa place

Les 3 absents expliquent pourquoi la règle des 18 h existe. Quelqu'un devait écrire, et il a oublié. Ce récit reste dans la spec, comme problème. Il ne devient pas une tâche « brancher le SMS ».

Une tâche SMS tirerait un fournisseur, un numéro, un secret. Rien de cela n'est dans cette fonctionnalité. Le remplissage de 70 % ne la justifie pas non plus. Si `tasks.md` contient « brancher le SMS », vous retirez la tâche. Vous ne la cochez pas pour plus tard dans le même fichier. Une phase lointaine est encore une promesse de code.

45 € ne devient pas une tâche d'encaissement. Le skill ordonne le travail demandé par la spec. Il n'ajoute pas la fonctionnalité d'à côté parce que les chiffres tenaient dans le même paragraphe. Si une relance ramène le SMS, la spec le demande encore : vous l'y mettez hors champ, puis vous relancez `/speckit-tasks`.

> [!WARNING]
> « Brancher le SMS » n'a pas sa place dans `tasks.md`. Les 3 absents motivent la phrase des 18 h. Ils ne programment pas un envoi.

# Exercices

## Exercice 1 : Remettre les trois tâches en ordre

`tasks.md` propose, dans cet ordre : la phrase « Léa tranche avant 18 h la veille », puis « 3 personnes en attente » avec les téléphones, puis le refus du 13e nom. Quel ordre devez-vous obtenir, et que devient la mention des téléphones ?

<details>
<summary>Voir la solution</summary>

L'ordre est : refus du 13e nom, puis affichage « 3 personnes en attente » sans téléphones, puis la phrase des 18 h.

Le compte public dépend du plafond de 12. La phrase des 18 h dépend d'une file déjà bornée. Les téléphones ne s'affichent pas sur la page publique. Vous ne gardez pas « avec les téléphones ».

Si la spec interdisait déjà les numéros, vous relancez `/speckit-tasks` et vous relisez. Si la spec était floue, vous la corrigez d'abord. Le créneau reste samedi 10 h-13 h, 8 places, 45 €.

</details>

## Exercice 2 : Une ligne en trop

En bas du fichier, une tâche dit « brancher le SMS, à cause des 3 absents », et une autre « encaisser les 45 € ». Les trois tâches de l'attente sont dans le bon ordre. Que faites-vous de ces deux lignes ?

<details>
<summary>Voir la solution</summary>

Vous les retirez. Les 3 absents (SMS oublié) expliquent la règle des 18 h. Ils ne créent pas une tâche d'envoi. 45 € s'affiche. Le paiement n'est pas une tâche de cette fonctionnalité.

Vous ne les déplacez pas dans une phase « plus tard ». Vous vérifiez que la spec les laisse hors champ. Si elle les demandait, vous corrigez la spec, puis vous relancez `/speckit-tasks`. La liste des 12 stages et le refus de la 9e place, déjà en place, ne redeviennent pas des tâches non plus.

</details>

## Exercice 3 : Deux tâches marquées ensemble

Le skill a posé le refus du 13e nom et l'affichage « 3 personnes en attente » comme s'ils pouvaient se faire en même temps. Pourquoi ce marquage est faux, et que doit montrer le fichier ?

<details>
<summary>Voir la solution</summary>

Le compte public dépend du refus. Sans plafond, « 3 personnes en attente » peut compter une file qui dépasse 12. Les deux tâches ne sont pas indépendantes.

`tasks.md` doit les séparer, dans cet ordre : d'abord le 13e nom refusé, ensuite le compte sans téléphone, ensuite la phrase des 18 h. Vous ne lancez pas le compte en parallèle du refus. L'écran de Léa, avec l'ordre des noms, reste une autre tâche que la page publique.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: L'ordre des trois tâches
center: "tasks.md suit les dépendances : le 13e nom, le compte sans téléphone, puis 18 h."
points:
  - icon: chat
    title: Dans le chat
    text: "/speckit-tasks écrit tasks.md depuis la spec et le plan. Le terminal ne reçoit pas ce skill."
  - icon: list
    title: Dépendances
    text: "Une tâche qui s'appuie sur une autre vient après. Le fichier ne se trie pas selon l'envie."
  - icon: shield
    title: Le 13e d'abord
    text: "Refuser le 13e nom fixe le plafond de 12. Le compte et la phrase des 18 h viennent ensuite."
  - icon: users
    title: Sans téléphone
    text: "La page publique dit « 3 personnes en attente ». Elle ne montre ni numéro ni liste de noms."
  - icon: alert
    title: Pas de SMS
    text: "Les 3 absents expliquent la règle. La tâche « brancher le SMS » ne reste pas dans le fichier."
pitfall: "Laisser « brancher le SMS » dans tasks.md, ou afficher le compte avant d'avoir refusé le 13e nom."
remember: "Ordre de Sève : refus du 13e, puis « 3 personnes en attente » sans téléphone, puis la phrase des 18 h."
```
