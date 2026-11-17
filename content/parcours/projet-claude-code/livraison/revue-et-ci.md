---
title: "Revue et contrôle continu"
description: "Faire passer les tests de règle métier dans la session avant de pousser, écrire ce que Léa vérifie, et laisser le contrôle continu relancer les mêmes tests."
duration: 50
objectives:
  - "Lancer dans la session les tests qui protègent les règles de l'Atelier Sève"
  - "Écrire un message de revue qui dit ce que Léa peut vérifier"
  - "Faire relancer les mêmes tests par le contrôle continu"
  - "Garder un test rouge plutôt que de le désactiver pour obtenir du vert"
---

# Les tests avant de pousser

Avant de pousser, les tests de règle métier passent **dans la session**. Pas demain sur la forge. Pas « en principe ». Vous êtes devant Claude Code, le dépôt d'App Sève est ouvert, et vous demandez le lancement des tests qui protègent ce que Léa Vernet a fixé.

Les règles tiennent en peu de lignes. Douze stages par mois, le samedi de 10 h à 13 h, Lyon Croix-Rousse, 45 €, 8 places. La 9e inscription est refusée. L'attente est ordonnée et s'arrête à 12. La confirmation rappelle que la décision se prend avant 18 h la veille. Le remplissage à 70 % et les trois absents du mois (SMS oublié) disent pourquoi ces règles existent. Ils ne deviennent pas des seuils que le test aurait le droit d'arrondir.

Vous nommez les tests, vous les voyez s'exécuter, vous lisez le vert ou le rouge. Un agent qui répond « les tests passent » sans que la commande ait tourné dans cette session ne vous donne pas un feu vert. Vous relancez, ou vous demandez la commande exacte et vous la laissez s'afficher.

> [!IMPORTANT]
> Le vert utile est celui que vous avez vu dans cette session, sur les règles de Léa, avant le poussage.

# Le message dit ce que Léa vérifie

Le message de revue n'est pas un journal intime de l'agent. Il dit ce que Léa vérifie. Une personne qui n'a pas suivi la session doit pouvoir cocher la même liste que vous, sans ouvrir le diff ligne à ligne pour deviner le sujet.

Un message tenable ressemble à ceci.

```text
Incrément : refuser la 9e place
Branche : seve/refus-9e-place

Léa peut vérifier :
- samedi 10 h-13 h, Lyon Croix-Rousse, 45 €, 8 places
- avec 8 inscrits, la 9e demande est refusée
- le test lu s'appelle « la 9e place est refusée »
- le diff ne contient pas .env

Hors de cet incrément : l'attente, la confirmation de 18 h
```

Vous écrivez ce qui est vrai de ce lot. Si l'attente n'est pas dans le diff, elle n'est pas dans le message. Un message qui promet les quatre incréments alors que la session n'a touché que la liste des stages ment à Léa. Le contrôle continu ne rattrape pas un mensonge de revue. Il relance des tests. Il ne lit pas vos promesses.

# Le même test, plus loin

Un contrôle continu relance **les mêmes tests**. La commande que vous avez vue verte dans la session est celle que la forge relance quand la branche avance. Même jeu de règles, même seuil. La 9e place refusée en local doit être refusée sur la forge. L'arrêt à 12 aussi. L'heure de 18 h aussi.

Si le contrôle continu lance une suite plus courte, vous n'avez pas deux filets. Vous en avez un, et un décor. Vous alignez la commande. Si la forge ajoute une étape d'installation propre, et rien d'autre, le cœur reste le même : les règles métier.

```diagram
type: pipeline
title: "La même règle, deux fois"
lanes:
  - title: "Session"
    steps:
      - title: "Tests de règle"
        text: "9e refusée, attente à 12, 18 h"
        tone: blue
      - title: "Message"
        text: "Ce que Léa vérifie, rien de plus"
        tone: violet
  - title: "Contrôle continu"
    steps:
      - title: "Même commande"
        text: "Les tests déjà vus, relancés"
        tone: teal
      - title: "Même seuil"
        text: "Un rouge bloque le lot"
        tone: amber
```

Vous ne créez pas un second jeu « plus souple » pour la forge parce que la machine distante est plus lente. Un délai d'outillage se règle. Un plafond qui passe de 8 à 9 pour que le job finisse vert ne se règle pas : il change l'atelier.

# Un rouge reste un rouge

Le geste interdit est simple : **on ne désactive pas un test pour obtenir du vert**. Commenter l'assertion, sauter le cas, ne lancer que le fichier qui passe, changer « 8 places » en « au moins une place », accepter la 9e personne dans le test : tout cela fabrique un vert qui ne protège plus Léa.

Vous laissez le rouge visible. Vous lisez le nom du test. « La 9e place est refusée » qui échoue veut dire que la 9e place est acceptée, ou que le refus n'est pas observable. La correction touche le comportement, puis le test est relancé. Il redevient vert parce que la règle tient, pas parce qu'elle a été retirée du contrôle.

| Geste | Ce qu'il produit | Ce que vous faites |
|---|---|---|
| Commenter le test de la 9e place | Un vert sans la règle | Vous restaurez le test |
| Attendre 9 inscrits pour « débloquer » | Une règle changée en douce | Vous gardez le refus |
| Lancer seulement les tests déjà verts | Un trou sur l'attente ou sur 18 h | Vous lancez la suite de règles |
| Corriger le refus, relancer | Un vert qui dit quelque chose | Vous pouvez parler de pousser |

Un test faux, qui attend un comportement que Léa n'a pas demandé, se corrige aussi. Le corriger, c'est le rendre fidèle. Le retirer pour faire taire un échec, c'est autre chose. Vous dites la différence dans la session : « Ce test se trompe de règle » ou « Ce test a raison, le code non ».

# Léa lit le même scénario

Le message de revue et les tests racontent le même scénario. Léa n'a pas à traduire. Si le message dit « la confirmation rappelle 18 h » et qu'aucun test ne fixe cette heure, la revue promet plus que le filet. Vous ajoutez le test, ou vous retirez la phrase du message.

Les chiffres du mois restent le contexte, pas des assertions fragiles. Vous ne testez pas « le remplissage vaut 70 % » comme si c'était une constante du samedi. Vous testez les règles qui empêchent le débordement : 8 places, 12 en attente, décision avant 18 h la veille. Les trois absents rappellent pourquoi le SMS oublié ne doit plus être le seul rappel. Le test de confirmation cherche l'heure dans le message, pas un envoi réel vers un opérateur.

> [!WARNING]
> Un contrôle continu vert sur une suite qui ne contient plus le test de la 9e place n'est pas une revue. C'est un silence.

# Pousser après le vert lu

Vous poussez quand trois choses sont vraies ensemble. Les tests de règle sont verts dans la session. Le message dit exactement ce que Léa vérifie sur ce lot. Le contrôle continu est réglé pour relancer ces tests, et vous avez vu qu'il ne les remplace pas par une suite plus courte.

Si le contrôle continu est rouge, vous ne poussez pas « en attendant » sur la branche que Léa lit. Vous ouvrez le journal, vous retrouvez le même test qu'en local, vous corrigez. Un vert local et un rouge distant, c'est encore un rouge. La session sert à comprendre l'écart, pas à le contourner.

L'agent peut proposer la commande, le correctif, la phrase du message. Vous lisez le résultat affiché. Vous refusez la proposition qui consiste à éteindre un test. Cette phrase se dit dans la session, clairement, pour que la suite du travail ne la reprenne pas comme une permission.

# Exercices

## Exercice 1 : Le message trop large

Le diff ne touche que le refus de la 9e place. L'agent prépare ce message : « Liste des 12 stages, 45 €, 8 places, attente jusqu'à 12, confirmation à 18 h. Tout est vérifié pour Léa. » Les tests de la 9e place sont verts. Que gardez-vous dans le message ?

<details>
<summary>Voir la solution</summary>

Vous ne gardez que ce que ce lot rend vérifiable : 8 places, et la 9e inscription refusée. Le prix n'entre dans le message que si l'écran ou le test le fixe vraiment dans ce diff. L'attente et les 18 h n'y sont pas : elles ne sont pas dans le lot.

Vous réécrivez la revue pour Léa avec le scénario joué, et vous citez le test lancé dans la session. Promettre les quatre incréments parce que le refus est vert trompe la lecture. Le contrôle continu ne complétera pas les phrases en trop.

</details>

## Exercice 2 : Vert demandé

Le test « la 9e place est refusée » échoue. L'agent propose trois issues : commenter le test, attendre 9 places « le temps de la démo », ou accepter la 9e dans l'assertion parce que le remplissage n'est que de 70 %. Que répondez-vous ?

<details>
<summary>Voir la solution</summary>

Vous refusez les trois. Aucune ne tient la règle. Commenter le test, élargir le plafond, ou changer l'assertion fabrique un vert sans le refus.

Vous laissez l'échec visible. Vous faites corriger le comportement pour que la 9e personne soit refusée, puis vous relancez le même test dans la session. Le remplissage à 70 % et les trois absents expliquent le contexte de Léa. Ils ne déplacent pas le plafond de 8. Le poussage attend ce vert-là.

</details>

## Exercice 3 : Deux suites

En local, la suite des règles est verte : 9e refusée, attente bornée à 12, texte de confirmation avec 18 h. Le contrôle continu ne lance que le test de la liste des stages, et il est vert. L'agent dit que la forge confirme. Que manque-t-il avant de considérer le lot relu ?

<details>
<summary>Voir la solution</summary>

Il manque la même suite. Un vert sur la liste des stages ne relance pas les règles que vous avez vues en session. Vous alignez le contrôle continu sur cette commande, ou vous ajoutez les tests absents.

Tant que la forge ne rejoue pas le refus, l'attente et l'heure, vous ne traitez pas le lot comme confirmé. Vous le dites dans le message de revue : le contrôle continu ne couvre pas encore les règles, donc il ne sert pas de second témoin. Vous poussez la correction de la suite, puis vous vérifiez que le journal distant montre les mêmes noms de tests.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Revue et contrôle continu
center: "Les tests de règle passent dans la session. Le message dit ce que Léa vérifie. Le contrôle continu relance les mêmes tests."
points:
  - icon: test
    title: Dans la session
    text: "9e refusée, attente à 12, confirmation à 18 h. Vous voyez la commande et le résultat."
  - icon: file
    title: Message de revue
    text: "Il liste ce que Léa peut vérifier sur ce lot. Il ne promet pas les incréments absents."
  - icon: loop
    title: Même suite
    text: "Le contrôle continu relance ces tests. Une suite plus courte n'est pas un second filet."
  - icon: alert
    title: Rouge visible
    text: "On ne commente pas un test, on ne change pas 8 en 9, on ne garde pas que les verts."
  - icon: scale
    title: Même scénario
    text: "Le message et les tests racontent la même règle. Une phrase sans test se retire ou s'ajoute."
pitfall: "Désactiver le test de la 9e place, ou pousser parce que la forge ne lance qu'un test déjà facile."
remember: "Vert lu dans la session, message fidèle pour Léa, même tests relancés. Un test éteint n'est pas un vert."
```
