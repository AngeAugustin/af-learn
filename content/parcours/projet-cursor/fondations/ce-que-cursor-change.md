---
title: "Ce que Cursor change dans un projet"
description: "Rester dans l'éditeur, lire le diff et nommer la page des stages de Sève avant toute demande à l'agent."
duration: 50
objectives:
  - "Rester dans l'éditeur et suivre le diff, les fichiers ouverts et l'aperçu"
  - "Refuser qu'un terminal travaille seul pendant que vous regardez ailleurs"
  - "Ouvrir le dépôt et nommer le résultat attendu, la page des stages"
  - "Tenir les quatre incréments de Sève séparés, sans demander l'application entière"
---

# L'éditeur où l'on reste

Cursor est l'éditeur dans lequel vous restez. Le dépôt est ouvert, l'arbre des fichiers est à gauche, le fichier en cours est au centre, le chat est à côté. Quand l'agent modifie quelque chose, la modification apparaît ici, dans le diff, pas dans un journal que vous lirez plus tard.

Atelier Sève, Lyon Croix-Rousse. Léa Vernet, céramiste, tient 12 stages par mois, le samedi de 10 h à 13 h, 8 places, 45 €. La liste d'attente est plafonnée à 12. Léa confirme ou refuse avant 18 h la veille. Le remplissage actuel est de 70 %. 3 absents en moyenne par mois, parce que la confirmation est un SMS oublié. L'application s'appelle Sève.

Le travail commence dans cet éditeur, sur ce dépôt. Vous voyez quel fichier change, quelle ligne change, et si la page des stages dit encore 8 places et 45 €. Vous n'envoyez pas une commande au loin pour récupérer un dossier fini.

> [!IMPORTANT]
> Tant que le diff n'est pas sous vos yeux, vous ne savez pas ce qui a été fait. L'éditeur est l'endroit où cette preuve s'affiche.

# Ce que vous avez sous les yeux

Trois surfaces suffisent pour le premier incrément.

- Le **diff**. Chaque ajout et chaque retrait est lisible avant que vous ne gardiez le fichier. Si une ligne invente une 9e place, elle est là, en surbrillance.
- Les **fichiers ouverts**. Vous gardez la page des stages et le jeu des 12 dates, pas une dizaine d'onglets ouverts « au cas où ».
- L'**aperçu**. La page doit montrer la date, 8 places, 45 € et les places restantes. Si l'aperçu affiche autre chose, le diff a menti ou vous avez mal lu.

Vous ne quittez pas ces trois surfaces pour « laisser tourner ». Un agent qui écrit pendant que vous êtes dans un autre logiciel n'est plus un outil d'éditeur. C'est une boîte noire. Sur Sève, la boîte noire est exactement ce qui produit aujourd'hui 3 absents : une confirmation partie en SMS, que personne ne revoit.

Le remplissage de 70 % ne se corrige pas en demandant une application. Il se corrige en voyant, sur la page, qu'un samedi de 10 h à 13 h affiche encore des places, sur 8.

# Pas un terminal qui travaille seul

Un terminal exécute une commande et rend un texte. Vous pouvez y lancer les tests, y regarder la branche, y lire une erreur. Ce n'est pas là que vous conduisez le projet. Si la seule trace du travail est une suite de lignes qui défilent, vous avez perdu le diff, les fichiers et l'aperçu.

La phrase qui produit ce glissement est courte : « fais l'application ». L'agent part alors dans le dépôt, choisit des fichiers, invente un parcours de paiement, un écran d'admin, parfois un compte pour Léa. Vous récupérez un tas. Vous ne savez plus quelle ligne porte les 8 places, ni si 45 € est écrit une fois ou trois.

Cursor change le geste. Vous restez devant le fichier. Vous lisez le diff au fur et à mesure. Vous arrêtez l'agent si la page des stages se met à contenir la liste d'attente, alors que ce n'est pas l'incrément en cours. Le terminal intégré sert à vérifier, pas à remplacer l'éditeur.

```diagram
type: compare
title: Deux façons de lancer Sève
columns:
  - title: Terminal qui travaille seul
    tone: rose
    items:
      - "La demande est « fais l'application »"
      - "Le résultat n'a pas de nom vérifiable"
      - "Vous lisez un journal, pas un diff"
  - title: L'éditeur où l'on reste
    tone: teal
    items:
      - "Le dépôt est ouvert, la branche est visible"
      - "Le résultat nommé est la page des 12 stages"
      - "Diff, fichiers ouverts, aperçu"
```

# Ouvrir le dépôt et nommer le résultat

Le premier geste, pour Sève, n'est pas une demande. C'est d'ouvrir le dossier du projet, de voir l'arbre, et d'écrire le résultat attendu en une phrase que vous pourriez cocher.

Le résultat du premier incrément : **une page qui liste les 12 stages du mois, avec la date, 8 places, 45 € et les places restantes.**

Cette phrase tient le cadre. 12 stages, pas « les prochains ». La date, parce qu'un samedi de 10 h à 13 h sans jour ne se réserve pas. 8 places, parce que l'atelier de la Croix-Rousse ne grandit pas dans le logiciel. 45 €, parce que le prix ne se discute pas dans la page. Les places restantes, parce que 70 % de remplissage doit se voir, stage par stage.

Vous pouvez coller cette phrase dans le chat, une fois le dépôt ouvert. Vous ne la remplacez pas par « fais quelque chose de bien pour Léa ». Léa Vernet a déjà un atelier. L'application Sève doit d'abord montrer les stages, pas raconter la céramique.

> [!TIP]
> Écrivez le résultat avant d'ouvrir le chat. Si vous ne pouvez pas le dire en une phrase, l'agent ne pourra pas le montrer dans un diff.

# Ce que vous ne demandez pas encore

Quatre incréments, dans cet ordre, et pas d'autre :

1. La page qui liste les 12 stages du mois, date, 8 places, 45 €, places restantes.
2. Le formulaire qui refuse la 9e place.
3. La liste d'attente jusqu'à 12, dans l'ordre.
4. La confirmation visible, et la règle « Léa tranche avant 18 h ».

Le premier geste ne contient que le premier. Le formulaire, l'attente et la confirmation sont vrais, ils ne sont pas à construire dans le même diff. Les 3 absents viennent de la confirmation oubliée : c'est le quatrième incrément, pas une raison de tout demander le premier jour.

Nommer le résultat protège aussi le chiffre. « Une page de stages » peut devenir 10 places, ou 40 €, ou des cours du dimanche. « Les 12 stages, 8 places, 45 €, places restantes » ne laisse pas ce flou. Vous relirez le diff avec cette liste, pas avec l'impression que « ça a l'air complet ».

# Rester pour lire

Quand l'agent propose le premier fichier, vous ne dites pas « ok » sur le résumé du chat. Vous ouvrez le diff. Vous cherchez 12, 8 et 45. Vous ouvrez l'aperçu et vous comptez les lignes du mois. S'il en manque, le résultat n'est pas atteint, même si le chat dit le contraire.

C'est cela que Cursor change. Le modèle propose. L'éditeur montre. Vous restez là où la proposition devient un fichier, et vous ne laissez pas un terminal conclure à votre place.

Le reste du parcours tient ce geste : ouvrir, nommer, lire. Les modes, le contexte et les règles viennent ensuite. Aucun ne remplace la page des stages sous vos yeux.

# Exercices

## Exercice 1 : Réécrire la demande

Léa vous écrit : « Fais l'application Sève, qu'on arrête les SMS. » Le dépôt n'est pas ouvert. Que faites-vous en premier, et par quelle phrase remplacez-vous la sienne pour le premier incrément ?

<details>
<summary>Voir la solution</summary>

Vous ouvrez d'abord le dossier du projet dans Cursor. Vous ne lancez pas l'agent depuis un terminal séparé, et vous ne répondez pas à Léa par « fais l'application ».

La phrase du premier incrément : une page qui liste les 12 stages du mois, avec la date, 8 places, 45 € et les places restantes. Les SMS oubliés expliquent les 3 absents, mais la confirmation visible est le quatrième incrément. Vous la nommez pour plus tard, vous ne la mélangez pas au premier diff.

</details>

## Exercice 2 : Ce que vous devez voir

L'agent annonce « la page est prête » et vous propose de passer au formulaire. Quels trois contrôles faites-vous avant d'accepter, et que doit montrer l'aperçu ?

<details>
<summary>Voir la solution</summary>

Vous lisez le diff, vous regardez les fichiers réellement ouverts, vous ouvrez l'aperçu. L'aperçu doit lister les 12 stages du mois, chacun avec sa date, 8 places, 45 € et les places restantes.

Vous ne passez pas au formulaire qui refuse la 9e place. Ce formulaire est l'incrément suivant. Un résumé dans le chat ne remplace pas le diff.

</details>

## Exercice 3 : Tenir le cadre

Dans le diff de la page, vous lisez : 10 places, 50 €, et un bouton « rejoindre la liste d'attente ». Le chat dit que c'est plus complet. Que gardez-vous, que rejetez-vous, et pourquoi ?

<details>
<summary>Voir la solution</summary>

Vous rejetez le diff. Le premier incrément affiche 8 places et 45 €, pas 10 et 50. La liste d'attente, plafonnée à 12, est le troisième incrément. La mettre sur la page maintenant mélange deux résultats.

Vous redemandez la page des 12 stages, date, 8 places, 45 €, places restantes. Vous restez dans l'éditeur le temps de relire le nouveau diff. « Plus complet » n'est pas un résultat nommé.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Rester dans l'éditeur
center: "Cursor est l'éditeur où l'on reste. Le premier geste nomme la page des stages."
points:
  - icon: eye
    title: Trois surfaces
    text: "Le diff, les fichiers ouverts, l'aperçu. C'est là que 8 places et 45 € se vérifient."
  - icon: terminal
    title: Le terminal vérifie
    text: "Il lance une commande. Il ne conduit pas le projet à la place de l'éditeur."
  - icon: target
    title: Résultat nommé
    text: "Les 12 stages du mois, la date, 8 places, 45 €, les places restantes."
  - icon: list
    title: Quatre incréments
    text: "Page, puis refus de la 9e place, attente jusqu'à 12, confirmation avant 18 h."
  - icon: alert
    title: Pas l'application
    text: "« Fais l'application » ouvre un tas. Une phrase cochable ouvre un diff lisible."
pitfall: "Accepter un résumé du chat sans ouvrir le diff, ou tout demander d'un coup pour aller plus vite."
remember: "Ouvrez le dépôt, nommez la page des 12 stages, restez devant le diff jusqu'à ce que l'aperçu colle à la phrase."
```
