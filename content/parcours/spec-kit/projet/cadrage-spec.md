---
title: "Cadrer la fonctionnalité Sève"
description: "Avec la constitution déjà posée, écrire la spec de l'attente et de la phrase des 18 h, la clarifier, et s'arrêter avant de coder."
duration: 50
objectives:
  - "Écrire la spec de l'attente ordonnée et de la phrase des 18 h, sans la pile technique"
  - "Garder les acquis : liste, 8 places, 45 € affichés, refus de la 9e"
  - "Clarifier l'ordre, le compte public sans téléphone et la phrase, avant tout plan"
  - "S'arrêter avant le code, et avant un plan non relu"
---

# La constitution est déjà là

L'Atelier Sève a ses principes. Huit places le samedi, de 10 h à 13 h, à Lyon Croix-Rousse. 45 € affichés, pas un paiement. L'attente sera bornée à 12 noms. Léa Vernet tranche avant 18 h la veille, et cette heure se lit. Pas de téléphone sur la page publique. Pas de secret dans le dépôt. `/speckit-constitution` a été fait. Vous ne le relancez pas pour y glisser un jeton SMS, ni pour passer à dix places.

Ce chapitre cadre **une** fonctionnalité : l'attente ordonnée et la phrase des 18 h. La liste des stages et le refus de la neuvième place existent. Vous les citez comme un acquis. Vous ne les spécifiez pas une seconde fois, et vous ne les assouplissez pas.

Douze stages par mois. Remplissage autour de 70 %. Environ trois absents, le SMS ayant été oublié. Ce sont les raisons de la phrase visible. Ce ne sont pas des paramètres à optimiser, ni un ordre d'envoi.

# Ce que vous spécifiez

Vous invoquez le skill dans le chat d'un seul agent. Cursor ou Claude Code : `/speckit-specify`. Codex : `$speckit-specify`. Le dépôt est celui de Sève.

```text
/speckit-specify
Une personne qui n'a pas de place voit qu'elle est en attente.
L'ordre est celui de l'arrivée. Le 12e nom est accepté, le 13e est refusé.
La page publique ne montre pas les téléphones. Quand trois personnes patientent,
on peut lire « 3 personnes en attente », sans numéro et sans annuaire.
Léa Vernet tranche avant 18 h la veille, et la phrase « avant 18 h » est à l'écran.
Elle n'envoie rien. Le but : savoir où l'on en est sans appeler l'atelier.
Déjà livré, à ne pas refaire : la liste (samedi 10 h-13 h, 45 € affichés) et le refus de la 9e.
Pas de SMS. Pas de paiement.
```

Dans Codex, la même prose suit `$speckit-specify`. Le texte parle de ce qu'on voit. Il ne nomme pas de framework, pas de base, pas de librairie. Cela appartiendra au plan, et le plan réutilisera l'application déjà là.

> [!NOTE]
> Le skill enregistre la fonctionnalité dans `.specify/feature.json`, pointeur local de cette copie de travail. Vous vérifiez qu'il désigne cette attente, puis vous ouvrez `spec.md`.

# Relire spec.md

Vous ouvrez `spec.md` dans l'éditeur. Vous cochez mentalement, sans coder :

| Attendu dans la spec | Fait de Léa |
| --- | --- |
| Places du stage | 8, la 9e refusée |
| Prix | 45 € affichés, pas un paiement |
| Attente | ordre d'arrivée, maximum 12 |
| Au-delà | le 13e nom est refusé |
| Page publique | un compte, aucun téléphone |
| Décision | Léa tranche avant 18 h la veille |
| Écran | la phrase « avant 18 h » se lit, elle n'envoie rien |
| SMS et paiement | hors spec |

Si la spec a écrit « environ 8 », « attente illimitée », « afficher les numéros » ou « encaisser 45 € », vous corrigez **la spec**. Vous n'ouvrez pas le code pour compenser. Vous pouvez renvoyer le skill avec la phrase juste, puis relire. Le fichier fait foi, pas le résumé du chat.

```diagram
type: flow
title: "Cadrer, puis s'arrêter"
steps:
  - title: Constitution
    text: "Déjà posée. 8 places, 45 € affichés, pas de secret."
    tone: violet
  - title: Specify
    text: "Attente, compte sans téléphone, phrase des 18 h. Pas la pile."
    tone: blue
  - title: spec.md
    text: "Vous relisez les nombres et les absences dans l'éditeur."
    tone: teal
  - title: Clarify
    text: "Questions ciblées, réponses reportées dans la spec."
    tone: amber
  - title: Stop
    text: "Pas de code. Le plan attend une spec tenue."
    tone: rose
```

# Clarifier avant le plan

`/speckit-clarify` (ou `$speckit-clarify`) pose quelques questions sur ce qui est encore flou, et reporte vos réponses dans `spec.md`. Vous le lancez **avant** le plan.

```text
/speckit-clarify
Focus : l'ordre d'arrivée, le compte public sans téléphone, et le mot exact de la phrase des 18 h.
```

Les réponses que vous tenez :

- L'ordre est celui de l'arrivée, pas « au plus pressé ».
- Douze noms d'attente, en plus des huit assis. Le 13e n'entre pas.
- La page publique montre un compte. Trois personnes : « 3 personnes en attente ». Aucun numéro, aucun annuaire.
- L'écran de Léa peut garder l'ordre des noms. Ce n'est pas la page publique.
- La phrase dit que Léa tranche avant 18 h la veille. Elle se lit. Elle n'envoie rien.

Le skill s'arrête à une poignée de questions. S'il en reste, vous le relancez, par exemple sur ce que le visiteur ne doit pas voir. Vous ne répondez pas « comme tu veux » : une réponse molle reviendra dans le plan comme une colonne de téléphones, ou comme un paiement.

> [!IMPORTANT]
> Clarifier met à jour `spec.md`. Vous le rouvrez après. Une réponse donnée dans le chat et absente du fichier n'existe pas pour le plan.

# On ne code pas

Ce cadrage s'arrête quand `spec.md` porte l'attente, la phrase, le compte, et les acquis. Vous n'invoquez pas `/speckit-implement`. Vous n'ouvrez pas un fichier de l'application « pour aller plus vite sur la file ». Vous n'enchaînez pas specify, plan et implement dans le même message.

Le plan a son chapitre. Il dira comment réutiliser l'app. Le mettre maintenant, avec une spec encore ambiguë sur les téléphones ou sur la phrase, fige une solution sur un trou. L'analyse, plus tard, rattrape mal un trou que la clarification pouvait fermer.

La constitution reste la grille. Si une phrase de spec la contredit, la spec perd. Huit places gagnent contre « on verra selon le remplissage ».

> [!WARNING]
> Coder l'attente pendant que `spec.md` dit encore « une file, à préciser » produit une file que Léa n'a pas demandée. Vous précisez d'abord.

# Les absents ne réécrivent pas le samedi

Les trois absents expliquent pourquoi la phrase des 18 h existe. Ils ne changent pas l'heure du stage, ni le lieu, ni le prix, ni le nombre de chaises. Le SMS oublié n'est pas un cahier des charges d'envoi. La spec dit ce que la personne **voit** : son état d'attente, et l'heure limite écrite.

Vous pouvez le dire dans la spec en une phrase de pourquoi. Vous ne joignez pas d'exemple de jeton, ni de numéro. Quand la spec et la clarification sont relues, vous vous arrêtez. Le prochain geste sera le plan, sur cette spec-là, pas sur une variante.

# Exercices

## Exercice 1 : Le message de spec

Écrivez les éléments que votre `/speckit-specify` (ou `$speckit-specify`) doit contenir, et deux choses qu'il ne doit pas contenir. L'app a déjà la liste et le refus.

<details>
<summary>Voir la solution</summary>

Le message contient : une personne sans place voit l'attente, dans l'ordre d'arrivée ; 12e accepté, 13e refusé ; page publique sans téléphone, compte du type « 3 personnes en attente » ; Léa tranche avant 18 h la veille et la phrase est à l'écran, sans envoi ; but : savoir où l'on en est sans appeler. Acquis cités, non redemandés : liste, samedi 10 h-13 h, 45 € affichés, refus de la 9e.

Il ne contient pas la pile (pas de framework, pas de base). Il ne contient pas de secret, pas de SMS à brancher, pas de paiement. Il n'ouvre pas une 9e place pour se rapprocher des 70 %.

</details>

## Exercice 2 : Une réponse molle

Le skill de clarification demande : « La page publique peut-elle lister les téléphones, pour que ce soit plus pratique ? » Un collègue répond : « Oui, et Léa enverra un SMS après 18 h si elle veut. » Que reportez-vous dans `spec.md` ?

<details>
<summary>Voir la solution</summary>

Vous ne reportez ni les téléphones, ni l'envoi. La page publique montre un compte, sans numéro. La phrase dit que Léa tranche avant 18 h la veille. Elle se lit. Elle n'envoie rien. L'ordre reste celui de l'arrivée. Le 13e nom est refusé.

Vous rouvrez `spec.md` et vous vérifiez que ces phrases y sont. Une réponse restée seulement dans le chat ne suffit pas. Vous ne codez pas cette règle en parallèle. Le plan attendra cette spec.

</details>

## Exercice 3 : L'envie de coder

`spec.md` est relu. Il est juste. Il est 16 h, Léa voudrait « voir quelque chose ». Quelqu'un invoque déjà `/speckit-implement` dans le même élan que le specify. Que manque-t-il, et que faites-vous ?

<details>
<summary>Voir la solution</summary>

Il manque la clarification si l'ordre, le compte ou la phrase est encore ouvert, puis tout le trajet du plan : plan, checklist, tâches, analyse. Ce chapitre s'arrête avant le code. Vous n'implémentez pas sur une spec seule, et vous n'enchaînez pas les skills dans un seul message.

Vous terminez `/speckit-clarify` si besoin, vous relisez `spec.md`, vous vérifiez `.specify/feature.json`. Ensuite seulement, plus tard, le plan qui réutilise l'app. Les huit places, les 45 € affichés et l'absence de téléphone ne bougent pas pendant l'attente.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Cadrer l'attente de Sève"
center: "Constitution déjà posée. La spec dit l'attente (12), le compte sans téléphone et la phrase des 18 h. On clarifie. On ne code pas."
points:
  - icon: book
    title: "Déjà posé"
    text: "Constitution tenue. Liste, 45 € affichés et refus de la 9e déjà dans l'app."
  - icon: file
    title: "spec.md"
    text: "Ordre d'arrivée, 13e refusé, compte public, phrase « avant 18 h » sans envoi."
  - icon: chat
    title: "Clarify"
    text: "Questions ciblées, réponses écrites dans spec.md. Pas de « comme tu veux »."
  - icon: filter
    title: "Pas de pile"
    text: "Pas de framework dans la spec. Pas de jeton, pas de paiement, pas de SMS."
  - icon: clock
    title: "On s'arrête"
    text: "Pas d'implement dans ce cadrage. feature.json désigne cette attente."
pitfall: "Mettre la pile, un téléphone ou un secret dans la spec, ou coder pendant qu'une règle est encore molle."
remember: "Specify le quoi, clarifiez ordre, compte et phrase, relisez spec.md. Pas de code."
```
