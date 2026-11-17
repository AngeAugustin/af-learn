---
title: "Cadrer le projet Sève avec Claude Code"
description: "Poser le brief dans le dépôt, un CLAUDE.md court et quatre tâches vérifiables, puis ouvrir le mode plan pour la première sans coder les quatre incréments."
duration: 50
objectives:
  - "Écrire dans le dépôt le brief de l'Atelier Sève que chaque session retrouvera"
  - "Tenir un CLAUDE.md court, avec les règles et sans secret"
  - "Découper le travail en quatre tâches vérifiables, dans l'ordre"
  - "Lancer le mode plan sur la première tâche et s'arrêter avant le code des incréments"
---

# Le brief dans le dépôt

Le projet Sève ne vit pas dans le chat. Il vit dans le dépôt d'App Sève, dans `docs/brief.md`, que Claude Code lira à la prochaine session. Vous l'écrivez pour Léa Vernet, pas pour vous souvenir. Une autre personne, ou vous dans trois jours, doit comprendre l'atelier sans avoir assisté à la conversation.

Le brief tient les faits, pas une solution déjà dessinée. Atelier Sève, Lyon Croix-Rousse. Le stage est le samedi, de 10 h à 13 h. Douze stages par mois. Le remplissage tourne autour de 70 %. Environ trois personnes manquent chaque mois, parce que le SMS a été oublié. Huit places. 45 €. La 9e inscription est refusée. L'attente est ordonnée et s'arrête à 12. La confirmation rappelle que la décision se prend avant 18 h la veille.

Vous écrivez aussi ce que ce projet ne fait pas. Pas de paiement en ligne. Pas d'envoi réel vers un opérateur SMS. Pas de second lieu, pas d'autre tarif. Ces limites empêchent la première session de « compléter » l'atelier pendant qu'elle affiche la liste.

> [!IMPORTANT]
> Si le brief n'est pas dans le dépôt, la session suivante invente un atelier. Le chat d'hier n'est pas une source.

# Un CLAUDE.md court

CLAUDE.md reprend le brief en plus serré. Il dit comment se comporter dans ce dépôt, pas l'histoire de l'atelier. Une page d'écran suffit. Au-delà, la session noie les règles sous des rappels, et les chiffres que Léa tient passent au second plan.

Vous y laissez : le public (une personne qui réserve le samedi à Croix-Rousse), les quatre règles chiffrées (45 €, 8 places, attente jusqu'à 12, décision avant 18 h la veille), l'ordre des tâches, et l'interdiction de modifier ces chiffres pour faire passer un test. Vous y nommez la commande de tests et la commande de démarrage, telles qu'elles existent dans le dépôt, pour que l'agent les propose au lieu d'en improviser une.

Vous n'y mettez pas de clé, pas de `.env`, pas un mode d'emploi de dix outils. Vous n'y mettez pas non plus le code des quatre incréments. CLAUDE.md oriente. Il ne livre pas App Sève à l'avance.

# Quatre tâches, pas un roman

Vous découpez en quatre tâches. Chacune a une preuve. Aucune ne dit « améliorer la réservation ».

1. **Liste.** Les stages du mois se voient. Le samedi 10 h-13 h, Lyon Croix-Rousse, est identifiable. Le prix affiché est 45 €.
2. **Refus.** Huit places tiennent. La 9e inscription est refusée, sans place créée.
3. **Attente.** Quand c'est complet, l'attente est ordonnée et s'arrête à 12. La 13e personne est refusée.
4. **Confirmation.** Une place non confirmée avant 18 h la veille se libère pour la première personne de l'attente. Une confirmation après 18 h ne la reprend pas. Le message rappelle cette heure.

L'ordre compte. L'attente sans refus n'a pas de seuil. La confirmation sans inscription n'a personne à qui parler. Vous ne fusionnez pas les quatre « pour aller plus vite » : une session qui touche tout ne sait plus quel test prouve quoi.

```diagram
type: flow
title: "Quatre tâches, dans l'ordre"
steps:
  - title: "1. Liste"
    text: "Samedi 10 h-13 h, Croix-Rousse, 45 €"
    tone: blue
  - title: "2. Refus"
    text: "8 places, la 9e est refusée"
    tone: violet
  - title: "3. Attente"
    text: "Ordre d'arrivée, arrêt à 12"
    tone: amber
  - title: "4. Confirmation"
    text: "Le message rappelle 18 h la veille"
    tone: teal
```

Chaque tâche se vérifie sans les suivantes. La liste peut être juste alors que le refus n'existe pas encore. Vous le notez dans la tâche, pour ne pas exiger les 18 h le jour où vous ne faites que l'affichage.

# Le mode plan pour la première

La première tâche s'ouvre en **mode plan**. Dans le terminal, `/plan` y entre. Shift+Tab fait défiler les modes jusqu'à l'indicateur « plan ». L'agent lit le dépôt, lit `docs/brief.md`, lit CLAUDE.md, et propose un plan. Il ne modifie pas les fichiers. Vous lisez le plan comme vous lireriez le brief : est-ce bien la liste, et seulement la liste ?

Un plan acceptable nomme les fichiers touchés, le test qui prouvera le samedi à 45 €, et ce qu'il ne touchera pas (le refus, l'attente, la confirmation, les secrets). Un plan qui annonce les quatre incréments dans la même passe est trop large. Vous le renvoyez. Vous ne « profitez » pas du fait qu'il a déjà tout imaginé.

Vous acceptez le plan quand la première tâche est isolée. L'acceptation autorise ensuite les écritures pour cette tâche-là, dans une session dédiée. Ce chapitre-ci s'arrête avant. Vous n'enchaînez pas.

# Vous ne codez pas les quatre

Le cadrage produit des textes et un plan. Il ne produit pas App Sève réservable. Vous ne demandez pas à l'agent d'implémenter les quatre tâches « tant qu'on y est ». Vous ne corrigez pas vous-même le refus de la 9e place dans la foulée. Le geste suivant, plus tard, sera une session par incrément, avec plan, permissions, test et diff.

Si le dépôt est vide de toute page, le plan de la liste peut dire quels fichiers créer. Les créer maintenant transformerait le cadrage en premier incrément. Vous laissez le plan écrit dans la session, vous le relisez, vous le gardez. La création des fichiers attend sa session, quand vous aurez décidé de livrer la liste, puis le refus, puis l'attente, puis la confirmation.

> [!WARNING]
> Un cadrage qui se termine par « j'ai aussi fait les quatre, les tests sont verts » n'est plus un cadrage. Vous n'avez pas relu quatre lots. Vous en avez subi un.

# Ce que la session doit laisser

À la fin de cette session, le dépôt contient `docs/brief.md` et un CLAUDE.md court, qui pointe vers ce brief. La conversation contient un plan pour la tâche 1, que vous avez lu, et que vous n'avez pas encore fait exécuter. Les tâches 2, 3 et 4 sont écrites, avec leur preuve, sans code.

Vous pouvez quitter. Demain, une session nouvelle doit retrouver le brief sans votre mémoire. Vous le vérifiez bêtement : vous ouvrez un terminal, vous lancez Claude Code, vous demandez ce que la première tâche prouve. Si la réponse invente un autre prix, un autre jour, ou neuf places, le brief ou CLAUDE.md est trop flou. Vous corrigez le texte. Vous ne corrigez pas en laissant l'agent coder quand même.

Le remplissage à 70 % et les trois absents restent dans le brief comme contexte. Ils ne deviennent pas une cinquième tâche du type « prédire le remplissage ». La cinquième tentation se refuse au cadrage, pas au milieu du diff.

# Exercices

## Exercice 1 : Un brief qui glisse

Vous avez écrit : « App Sève gère les stages de Léa. Il faut une belle réservation, un paiement, et des SMS automatiques pour éviter les trois absents. » Le samedi, Croix-Rousse, 45 €, 8 places et 18 h n'apparaissent pas. Que réécrivez-vous dans le dépôt ?

<details>
<summary>Voir la solution</summary>

Vous réécrivez les faits. Atelier Sève, Lyon Croix-Rousse, samedi 10 h-13 h, douze stages par mois, remplissage autour de 70 %, environ trois absents parce que le SMS a été oublié. Puis les règles : 45 €, 8 places, la 9e refusée, attente ordonnée jusqu'à 12, confirmation qui rappelle la décision avant 18 h la veille.

Vous retirez le paiement et l'envoi réel de SMS : ils sont hors périmètre. « Belle réservation » ne se vérifie pas. Vous gardez quatre tâches avec une preuve chacune. Le brief ainsi repris peut entrer dans le dépôt. CLAUDE.md n'en gardera que la version courte.

</details>

## Exercice 2 : Le plan qui avale tout

En mode plan, l'agent propose de créer la liste, le refus de la 9e place, l'attente jusqu'à 12 et la confirmation à 18 h dans la même passe, « puisque les quatre sont dans CLAUDE.md ». Aucun fichier n'est encore modifié. Que lui demandez-vous ?

<details>
<summary>Voir la solution</summary>

Vous demandez un plan pour la tâche 1 seulement : la liste des stages, le samedi 10 h-13 h à Croix-Rousse, le prix à 45 €. Le plan doit nommer les fichiers et le test, et dire qu'il ne touche pas au refus, à l'attente ni à la confirmation.

Vous n'acceptez pas la passe unique. CLAUDE.md cite les quatre tâches pour fixer l'ordre, pas pour les coder ensemble. Vous restez en mode plan tant que le périmètre n'est pas la liste seule. Vous ne dites pas « vas-y quand même ».

</details>

## Exercice 3 : Cadrage ou livraison

Le plan de la liste vous convient. L'agent ajoute : « J'enchaîne, j'écris les fichiers et je fais les quatre incréments, les tests seront verts. » Le brief et CLAUDE.md sont déjà dans le dépôt. Que doit contenir la session à la fin de ce chapitre, et que refusez-vous ?

<details>
<summary>Voir la solution</summary>

La session doit contenir le brief, un CLAUDE.md court, les quatre tâches avec leur preuve, et un plan lu pour la liste seule. Elle ne doit pas contenir le code des quatre incréments.

Vous refusez l'enchaînement. Écrire les fichiers maintenant livrerait sans le rituel de chaque incrément (plan accepté, permissions, test, diff). Vous arrêtez sur le plan. La liste aura sa session. Le refus, l'attente et la confirmation aussi, plus tard, une par une.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Cadrer Sève
center: "Brief dans le dépôt, CLAUDE.md court, quatre tâches. Mode plan pour la liste. Les quatre incréments ne se codent pas encore."
points:
  - icon: file
    title: Brief
    text: "Croix-Rousse, samedi 10 h-13 h, 45 €, 8 places, attente à 12, décision avant 18 h."
  - icon: book
    title: CLAUDE.md
    text: "Une page : règles, ordre des tâches, commandes. Pas de clé, pas le code des incréments."
  - icon: list
    title: Quatre tâches
    text: "Liste, refus de la 9e, attente ordonnée jusqu'à 12, confirmation qui rappelle 18 h."
  - icon: compass
    title: Mode plan
    text: "La première tâche est lue et bornée. Un plan qui avale les quatre se renvoie."
  - icon: alert
    title: Pas encore le code
    text: "Le cadrage s'arrête au plan accepté en lecture. Chaque incrément aura sa session."
pitfall: "Laisser le brief dans le chat, ou accepter une passe unique qui code les quatre tâches d'un coup."
remember: "Le dépôt porte le brief et un CLAUDE.md court. Vous planifiez la liste. Vous ne livrez pas encore."
```
