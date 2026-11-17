---
title: "Clarifier avant le plan"
description: "Lancer /speckit-clarify dans le chat, ranger les réponses dans spec.md, et ne pas planifier tant que 8 et 10 hésitent."
duration: 50
objectives:
  - "Lancer /speckit-clarify dans le chat avant /speckit-plan"
  - "Cibler l'attente : ordre, plafond 12, page publique"
  - "Faire écrire les réponses dans spec.md, puis les relire"
  - "Refuser le plan tant qu'un chiffre hésite entre 8 et 10"
---

# Le flou qui reste après la spec

Léa Vernet, Atelier Sève, Lyon Croix-Rousse : samedi 10 h-13 h, 8 places, 45 €. Douze stages dans le mois, remplissage de 70 %, 3 absents parce que le SMS est oublié. L'application liste déjà les stages et refuse déjà la 9e place. `spec.md` décrit l'attente ordonnée et la confirmation visible. Il peut rester des trous.

Un trou est une phrase que deux lecteurs ne comprennent pas de la même façon. « L'ordre habituel » peut vouloir dire l'arrivée, l'alphabet ou le tirage au sort. « Le plafond » peut vouloir dire les 8 places ou les 12 noms. « La page montre les coordonnées » peut vouloir dire le téléphone. Tant que deux lectures restent possibles, le plan construirait au hasard.

GitHub Spec Kit traite ce flou avec `/speckit-clarify`, dans le chat de l'agent. Le skill pose quelques questions ciblées, jusqu'à cinq, sur ce qui reste imprécis. Il ne choisit pas la pile. Il n'écrit pas `plan.md`.

> [!IMPORTANT]
> Clarifier, c'est répondre à des questions de comportement. Les réponses reviennent dans `spec.md`. Le plan attend que ces réponses soient écrites.

# Des questions, pas une conception

Vous lancez le skill dans le chat, pas dans le terminal. Sans précision, il cherche lui-même les zones molles de la spec. Avec une précision, il reste sur le sujet que vous nommez. Pour Sève, le sujet mou est l'attente, pas la liste déjà construite.

Le skill peut demander : l'ordre est-il celui de l'arrivée ? Le plafond de 12 compte-t-il les inscrits ou seulement l'attente ? La page publique montre-t-elle un téléphone ? « Avant 18 h » est-il la veille, ou le jour même ? Vous répondez avec les faits de Léa, en phrases courtes. Vous ne répondez pas « fais au mieux ».

Une question technique se renvoie. Si le skill demande Next, Postgres, ou un SDK, vous dites que la pile n'est pas le sujet de cette étape. Vous répondez au comportement. Le choix de rester sur l'application déjà en place viendra avec `/speckit-plan`.

# Les réponses rejoignent spec.md

Après vos réponses, vous rouvrez `spec.md`, dans le dossier indiqué par `.specify/feature.json`. La réponse ne doit pas rester seulement dans le chat. Le skill range les décisions dans le fichier. Si le chat dit « ordre d'arrivée » et que `spec.md` dit encore « ordre habituel », vous n'avez pas fini.

Vous vérifiez chaque réponse devenue phrase. L'ordre est celui de l'arrivée. Le plafond de l'attente est 12 noms : le 12e est accepté, le 13e est refusé. La page publique ne montre pas les téléphones. La phrase « avant 18 h » désigne 18 h la veille. Le stage reste à 8 places, la 9e inscription reste refusée.

`checklists/requirements.md` peut être mise à jour par `/speckit-clarify`, comme elle l'est par `/speckit-specify`. Cette mise à jour parle de la spec. Elle ne veut pas dire que la page est construite, ni que vous pouvez sauter la relecture du fichier.

> [!NOTE]
> Le chat sert à répondre. `spec.md` sert à garder. Vous ne passez au plan que lorsque le fichier contient la réponse, pas seulement la conversation.

# Cibler l'attente

Vous pouvez borner les questions. Le texte suivant, dans le chat, dit au skill où regarder.

```text
/speckit-clarify Focus sur l'attente : ordre, plafond 12, ce que voit la page publique
```

L'ordre attendu dans la réponse, puis dans `spec.md`, est l'ordre d'arrivée. Le plafond 12 est celui de l'attente, pas celui du stage. La page publique montre l'état d'attente, la place dans l'ordre, et la phrase « avant 18 h ». Elle ne montre pas les téléphones.

Ce focus ne rouvre pas la liste des 12 stages, ni le refus de la 9e place. Si une question propose de reconstruire cette liste, vous répondez qu'elle existe déjà. Si une question propose d'afficher les numéros « pour aider Léa », vous répondez que la page publique ne les montre pas.

Le prix 45 €, le créneau 10 h-13 h et les 3 absents peuvent rester hors de ce focus. Ils sont déjà écrits. Vous ne les négociez pas pendant la clarification de l'attente. Vous ne transformez pas non plus les absents en demande d'envoi de SMS.

# Huit et dix ne cohabitent pas

Le blocage le plus net est un chiffre instable. `spec.md` dit 8 places dans un scénario et 10 places dans un autre. Ou le chat vient de dire 8, et le fichier dit encore 10. Vous ne planifiez pas. Un plan construit sur deux capacités à la fois inventera une règle que Léa n'a pas choisie.

Huit est le nombre de places du stage. Il est déjà dans l'application, avec le refus de la 9e inscription. Dix n'est pas une variante acceptable. Douze est un autre nombre : le plafond de l'attente, pas une troisième capacité du stage. Vous séparez les deux dans le fichier avant toute conception.

S'il faut un nouvel échange, vous le faites dans le chat de clarify, puis vous relisez `spec.md`. « Le stage a 8 places. L'attente a 12 noms. » Les deux phrases doivent être vraies en même temps, sans « ou », sans « environ », sans « à confirmer ».

> [!WARNING]
> Tant qu'un chiffre hésite entre 8 et 10, `/speckit-plan` ne part pas. Vous clarifiez, vous corrigez `spec.md`, vous relisez.

```diagram
type: flow
title: "Clarifier, puis seulement le plan"
steps:
  - title: "Flou"
    text: "Deux lectures possibles dans spec.md, sur l'ordre, le plafond ou la page"
    tone: violet
  - title: "Questions"
    text: "Jusqu'à cinq questions, dans le chat, avec le focus sur l'attente"
    tone: blue
  - title: "Fichier"
    text: "Les réponses sont écrites dans spec.md, pas laissées dans le chat"
    tone: teal
  - title: "Chiffre"
    text: "Si 8 et 10 cohabitent encore, on s'arrête et on corrige"
    tone: amber
  - title: "Plan"
    text: "Le plan n'est lancé que lorsque le chiffre des places est stable"
    tone: rose
```

# Le plan attend un fichier stable

Vous saurez que clarify a fini son office quand `spec.md` se lit d'une seule façon. Une personne voit qu'elle est en attente. L'ordre est celui de l'arrivée. Le 13e nom est refusé. La page publique ne montre pas les téléphones. Léa tranche avant 18 h la veille, et la phrase est à l'écran. Le stage a 8 places. Rien de cela ne dépend d'un framework.

À ce moment-là, `/speckit-plan` peut recevoir la pile, ou plutôt, pour Sève, la consigne de rester sur l'application déjà en place. Pas avant. Clarifier n'est pas le moment de choisir un SDK de paiement, ni d'ajouter l'envoi du SMS oublié. Ces sujets ne sont pas des flous de la spec : ils sont hors de la fonctionnalité.

Si un flou nouveau apparaît plus tard, vous revenez à `/speckit-clarify` ou vous corrigez `spec.md` avec `/speckit-specify`. Vous ne le « réglez » dans le plan en changeant un chiffre. Le plan consomme la spec. Il ne la renégocie pas.

# Exercices

## Exercice 1 : Que lancez-vous

`spec.md` dit « ordre habituel », « plafond raisonnable », et « la page montre les coordonnées utiles ». Les 8 places sont écrites une seule fois, sans contradiction. Quel skill lancez-vous, et avec quel texte de focus ?

<details>
<summary>Voir la solution</summary>

Vous lancez `/speckit-clarify` dans le chat de l'agent, pas le plan, pas le terminal. Le focus :

`/speckit-clarify Focus sur l'attente : ordre, plafond 12, ce que voit la page publique`

Vous répondrez : ordre d'arrivée, plafond de 12 noms sur l'attente (le 13e refusé), page publique sans téléphone, avec la phrase « avant 18 h ». Ensuite vous vérifiez que `spec.md` a pris ces phrases.

</details>

## Exercice 2 : Deux capacités dans le même fichier

Un scénario dit « 8 places, la 9e inscription est refusée ». Un autre dit « le stage ouvre 10 places pour limiter les 3 absents ». L'agent propose de passer au plan « en gardant les deux, on choisira dans la pile ». Que faites-vous ?

<details>
<summary>Voir la solution</summary>

Vous ne lancez pas `/speckit-plan`. Huit et dix ne cohabitent pas. Le stage a 8 places, le refus de la 9e inscription existe déjà, les 3 absents ne changent pas cette règle et n'ouvrent pas un SMS.

Vous répondez dans le chat de clarify, puis vous corrigez `spec.md` : 8 places au stage, 12 noms dans l'attente. Vous relisez. Le plan attendra cette version unique. La pile ne tranche pas un chiffre de Léa.

</details>

## Exercice 3 : Une question qui dérive

Le skill demande : « J'utilise une nouvelle base, j'affiche les téléphones sur la page publique, et j'encaisse 45 € pour confirmer la place. L'ordre sera alphabétique, c'est plus simple. » Répondez point par point.

<details>
<summary>Voir la solution</summary>

La base ne se choisit pas ici. Pour Sève, le plan dira plus tard de rester sur l'application déjà en place. Pas de nouvelle base dans cette réponse.

La page publique ne montre pas les téléphones. Il n'y a pas d'encaissement : 45 € reste affiché. L'ordre est celui de l'arrivée, pas l'alphabet. Le plafond d'attente reste 12, le stage reste à 8 places, Léa tranche avant 18 h la veille. Vous vérifiez que `spec.md` reçoit ces réponses, et seulement elles.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Répondre avant de concevoir"
center: "Clarify pose les questions floues et range les réponses dans spec.md. 8 et 10 bloquent le plan."
points:
  - icon: chat
    title: "Dans le chat"
    text: "/speckit-clarify interroge la spec, jusqu'à cinq questions. Ce skill ne s'écrit pas dans le terminal."
  - icon: target
    title: "Focus attente"
    text: "On peut cibler l'ordre, le plafond 12 et ce que voit la page publique, sans rouvrir la liste."
  - icon: file
    title: "Retour dans spec.md"
    text: "Une réponse laissée dans le chat seulement n'existe pas pour la suite. Le fichier doit la contenir."
  - icon: alert
    title: "8 contre 10"
    text: "Si les places hésitent entre 8 et 10, on ne lance pas /speckit-plan. On corrige, on relit."
  - icon: scale
    title: "Deux nombres"
    text: "8 places au stage, refus de la 9e déjà en place. 12 noms d'attente, le 13e refusé. Pas le même plafond."
pitfall: "Planifier pendant que spec.md dit encore 8 places ici et 10 places là. La pile ne choisit pas à la place de Léa."
remember: "On clarifie dans le chat, on relit spec.md, et le plan attend un chiffre stable : 8 places, attente de 12."
```
