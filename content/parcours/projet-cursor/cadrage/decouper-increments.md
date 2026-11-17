---
title: "Découper le projet en incréments"
description: "Tenir les quatre incréments d'Application Sève dans l'ordre, chacun avec une preuve visible, sans les demander d'un coup."
duration: 50
objectives:
  - "Nommer les quatre incréments dans l'ordre imposé"
  - "Associer à chacun une preuve qu'on peut montrer à Léa"
  - "Refuser un prompt qui demande les quatre en même temps"
  - "Rester sur un incrément tant que sa preuve est fausse"
---

# Quatre incréments, dans cet ordre

L'Application Sève ne se demande pas en une phrase. Léa Vernet a quatre preuves à voir, dans un ordre qui ne se mélange pas.

1. La liste des 12 stages.
2. Le formulaire qui refuse la 9e place.
3. L'attente ordonnée, jusqu'à 12.
4. La confirmation, et la règle des 18 h.

L'ordre est imposé. La liste d'abord : sans les 12 stages, le formulaire n'a rien à remplir. Le refus de la 9e place ensuite : l'attente n'existe que pour la personne qui n'a pas eu de place. La confirmation en dernier : on confirme une place ou une attente qui existe déjà, et Léa tranche avant 18 h la veille.

Samedi 10 h-13 h, 8 places, 45 €, Lyon Croix-Rousse : ces faits sont dans chaque incrément. Ils ne forment pas un cinquième chantier « données ». Ils sont la matière des quatre. Atelier Sève reste le même produit. Seule la preuve change.

# Chaque incrément a une preuve visible

Un incrément n'est pas fini quand l'agent dit « c'est fait ». Il est fini quand vous voyez la preuve, sur l'écran, sans lire le code pour vous convaincre.

| Incrément | Preuve sur l'écran |
| --- | --- |
| 1. Liste des 12 stages | Vous comptez 12 lignes. Chacune dit samedi, 10 h-13 h, 8 places, 45 €, places restantes. |
| 2. Formulaire | La 8e place est acceptée. La 9e est refusée, avec une phrase lisible. |
| 3. Attente | L'ordre se lit, la première personne avant la deuxième. La 13e n'entre pas. |
| 4. Confirmation | Une confirmation s'affiche. Après 18 h la veille, la décision de Léa ne passe plus. |

La preuve se montre à Léa. « Les données sont rangées » n'est pas une preuve. « Le code est propre » non plus. Vous ne jugez pas la technique. Vous comptez, vous tentez la 9e place, vous lisez l'ordre, vous regardez l'heure.

> [!IMPORTANT]
> Pas de preuve visible, pas d'incrément fini. La phrase de l'agent ne remplace pas l'écran que Léa peut contredire.

# On n'envoie pas les quatre d'un coup

Demander les quatre dans le même prompt, c'est demander une application entière. L'agent touche beaucoup de fichiers. Le paiement, que le brief a exclu, revient souvent dans ce tas. Et si l'écran est faux, vous ne savez plus lequel des quatre a cassé : la liste, la 9e place, l'ordre des 12, ou les 18 h.

Un prompt, un incrément, une preuve. Vous ne lancez le formulaire que lorsque les 12 stages sont justes. Vous ne lancez l'attente que lorsque la 9e place est vraiment refusée. Vous ne lancez la confirmation que lorsque l'attente s'arrête à 12, dans l'ordre.

Ce n'est pas de la lenteur. C'est le seul moyen de montrer quelque chose à Léa avant d'empiler. Le remplissage de 70 % et les 3 absents (SMS oublié) rappellent pourquoi la confirmation viendra. Ils ne justifient pas de tout construire avant d'avoir vu la liste.

> [!WARNING]
> « Fais les quatre incréments » n'a pas de preuve unique. Vous ne pourrez pas dire lequel est faux, et le hors-paiement se perdra dans le tas.

# L'incrément 1 se voit en comptant

Le premier incrément est la liste. Rien d'autre. Vous ouvrez la page et vous comptez jusqu'à 12. Pas 4 exemples, pas 12 lignes dont trois sont du faux texte, pas un calendrier d'un autre jour.

Chaque stage affiche le créneau du brief : samedi, 10 h-13 h. Il affiche 8 places, 45 €, et les places restantes. S'il n'y a encore aucune inscription, les places restantes valent 8. Vous ne demandez pas d'afficher « 70 % » sur la carte. Ce pourcentage est le problème du mois, pas une étiquette de stage.

Vous ne voyez pas de formulaire sur cette page. Pas de champ nom, pas de bouton qui réserve, pas de paiement. Si ces éléments sont déjà là, l'incrément 1 n'est pas « en avance ». Il est mélangé. Vous ne pouvez plus compter la liste sans vous demander si le bouton a changé les chiffres.

# La suite attend sa preuve

L'incrément 2 ne dit pas « un formulaire de réservation ». Il dit : le formulaire refuse la 9e place. La preuve est un geste. Vous remplissez 8 places. La huitième passe. La neuvième non. La phrase de refus est lisible par Léa, en français, sans code.

L'incrément 3 ne dit pas « gérer l'attente ». Il dit : l'attente est ordonnée, et elle s'arrête à 12. La personne arrivée avant est affichée avant. La 13e ne rentre pas. Une attente sans ordre, ou une 13e personne acceptée « en exception », rate la preuve.

L'incrément 4 ne dit pas « envoyer un SMS ». Le SMS oublié est le problème de départ, 3 absents par mois. La preuve est autre : une confirmation visible, et la règle d'heure. Avant 18 h la veille, Léa peut encore décider. Après 18 h la veille, la décision ne passe plus. Vous le montrez sur l'écran, pas chez un opérateur, et toujours sans paiement réel.

> [!NOTE]
> Les 3 absents expliquent la confirmation. Ils ne transforment pas l'incrément 4 en envoi de SMS réel, ni en paiement des 45 €.

# Écrire la preuve dans le prompt

Le prompt d'un incrément contient la preuve, pas le roman du projet. Pour la liste : « Affiche les 12 stages, samedi 10 h-13 h, 8 places, 45 €, places restantes. Je dois pouvoir les compter. Pas de formulaire. » Pour la 9e place : « Le formulaire accepte 8 inscriptions et refuse la 9e. Montre la phrase de refus. »

Vous citez le brief, vous ne le recopiez pas en changeant un nombre. Et vous n'ajoutez pas « tant que tu y es, fais aussi l'attente ». Tant que vous y êtes, vous perdez la preuve.

Quand la preuve est fausse, vous restez sur cet incrément. Une liste à 11 stages ne s'accompagne pas d'un formulaire « pour avancer ». Avancer sur une preuve fausse, c'est construire la suite sur un écran que Léa contredirait. Atelier Sève, à Croix-Rousse, se montre un geste après l'autre.

```diagram
type: pipeline
title: "Quatre preuves, dans l'ordre"
lanes:
  - title: Application Sève
    steps:
      - title: Liste
        text: "12 stages visibles, samedi 10 h-13 h, 8 places, 45 €, places restantes."
        tone: violet
      - title: Neuvième
        text: "La 8e place passe. La 9e est refusée, avec une phrase que Léa lit."
        tone: blue
      - title: Attente
        text: "Ordre lisible. 12 personnes au plus. La 13e n'entre pas."
        tone: teal
      - title: Confirmation
        text: "Confirmation visible. Décision de Léa bloquée après 18 h la veille."
        tone: amber
```

> [!TIP]
> Écrivez la preuve en une phrase avant d'écrire le prompt. Si vous ne pouvez pas la montrer du doigt, l'incrément n'est pas prêt à être demandé.

# Exercices

## Exercice 1 : Remettre quatre demandes dans l'ordre

Léa écrit en vrac : « envoie la confirmation », « je veux voir mes samedis », « bloque la 9e personne », « fais une file ». Remettez les quatre incréments dans l'ordre imposé, avec la preuve de chacun.

<details>
<summary>Voir la solution</summary>

1. Liste des 12 stages. Preuve : vous comptez 12 lignes, samedi 10 h-13 h, 8 places, 45 €, places restantes.
2. Formulaire qui refuse la 9e place. Preuve : la 8e passe, la 9e est refusée par une phrase lisible.
3. Attente ordonnée jusqu'à 12. Preuve : l'ordre se lit, la 13e personne n'entre pas.
4. Confirmation et règle des 18 h. Preuve : une confirmation s'affiche, et après 18 h la veille la décision de Léa ne passe plus.

« Voir mes samedis » ouvre. « Bloque la 9e » vient avant la file, parce que la file accueille celle ou celui qui n'a pas eu de place. La confirmation ferme. Le paiement réel ne s'ajoute nulle part.

</details>

## Exercice 2 : Le formulaire annoncé trop tôt

L'agent dit que l'incrément 2 est terminé. Vous voyez un champ et un bouton. Personne n'a tenté 8 inscriptions, puis une 9e. La liste, elle, n'affiche que 6 stages. Que manque-t-il, et que refusez-vous de faire ensuite ?

<details>
<summary>Voir la solution</summary>

Il manque les deux preuves. L'incrément 1 est faux : 6 stages, pas 12. L'incrément 2 n'a pas été joué : la 8e place doit passer, la 9e doit être refusée, avec une phrase que Léa lit.

Vous ne lancez pas l'attente « pour débloquer ». Vous revenez à la liste jusqu'à compter 12 stages, samedi 10 h-13 h, 8 places, 45 €, places restantes. Ensuite seulement vous rejouez le formulaire. Un bouton sans geste n'est pas une preuve.

</details>

## Exercice 3 : Le prompt qui demande tout

Un collègue propose : « Construis la liste, le formulaire, l'attente jusqu'à 12 et la confirmation 18 h, avec le paiement des 45 €. » Réécrivez le premier message, un seul incrément.

<details>
<summary>Voir la solution</summary>

« Selon le brief d'Atelier Sève : affiche les 12 stages du mois, samedi 10 h-13 h, 8 places, 45 €, places restantes. Je dois pouvoir les compter. Pas de formulaire, pas d'attente, pas de confirmation, pas de paiement réel. »

Les trois autres incréments attendent leur tour, chacun avec sa preuve. Le paiement sort : il est hors de ce tour, même en dernier. Le collègue n'a pas gagné de temps. Il a rendu la liste impossible à juger.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Quatre preuves, dans l'ordre
center: "Un incrément à la fois. Chacun se juge sur l'écran, pas sur la phrase de l'agent."
points:
  - icon: list
    title: "1. Les 12 stages"
    text: "Vous comptez 12 lignes. Samedi 10 h-13 h, 8 places, 45 €, places restantes."
  - icon: shield
    title: "2. La 9e place"
    text: "La 8e inscription passe. La 9e est refusée, avec une phrase que Léa peut lire."
  - icon: users
    title: "3. L'attente"
    text: "L'ordre se voit. 12 personnes au plus. La 13e n'entre pas dans la file."
  - icon: clock
    title: "4. Les 18 h"
    text: "Une confirmation s'affiche. Après 18 h la veille, Léa ne change plus la décision."
  - icon: alert
    title: Pas les quatre
    text: "Un seul prompt pour les quatre mélange les preuves, et le paiement revient dans le tas."
pitfall: "Passer au formulaire alors que la liste n'a pas 12 stages. La suite se construit sur un écran faux."
remember: "Écrivez la preuve avant le prompt. Si vous ne pouvez pas la montrer du doigt, ne demandez pas l'incrément."
```
