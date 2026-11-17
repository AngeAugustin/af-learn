---
title: "Passer par le mode Plan"
description: "Ouvrir le mode Plan avec Shift+Tab, corriger le plan de la liste des 12 stages, et ne réserver l'agent direct qu'aux petits gestes."
duration: 50
objectives:
  - "Passer en mode Plan avec Shift+Tab avant un changement large"
  - "Laisser l'agent chercher, questionner, puis proposer un plan éditable"
  - "Corriger et enregistrer le plan dans le workspace avant de construire"
  - "Garder le mode Agent pour un changement petit et déjà habituel"
---

# Shift+Tab jusqu'au mode Plan

Le mode Plan se choisit dans le champ de l'agent, avant d'envoyer. Le geste : Shift+Tab (Maj et Tabulation). Vous le répétez jusqu'à ce que le mode affiché soit Plan. Vous vérifiez le nom du mode. Ensuite vous écrivez.

Ce raccourci change le mode du chat. Il ne complète pas une ligne de code. Si vous restez en mode Agent, le même texte sera pris comme un ordre de modifier les fichiers tout de suite. Pour l'incrément 1, qui touche plusieurs fichiers, ce n'est pas ce que vous voulez.

Vous pouvez aussi choisir Plan dans le sélecteur de mode, si vous le voyez à côté du champ. Le contrôle reste le même : le libellé dit Plan avant l'envoi. Un prompt parti dans le mauvais mode ne se rattrape pas en espérant que l'agent se retienne.

> [!IMPORTANT]
> Regardez le nom du mode avant d'envoyer. Shift+Tab vers Plan. Le même prompt, en mode Agent, modifie déjà les fichiers.

# L'agent cherche, demande, propose

En mode Plan, l'agent ne livre pas la page. Il travaille en trois temps, et vous les voyez dans le chat.

Il cherche dans le code du dépôt. Il ouvre les fichiers qui existent déjà, pour ne pas proposer une deuxième liste à côté de la première. Vous le laissez chercher. Vous ne collez pas tout le projet dans le message si `@BRIEF.md` et le dépôt suffisent.

Il pose des questions. « Le paiement des 45 € est-il dans cet incrément ? » « Les 12 stages sont-ils déjà dans un fichier ? » Vous répondez avec le brief : 8 places, 45 € affichés, pas de paiement réel, samedi 10 h-13 h. La décision de Léa avant 18 h la veille viendra plus tard. Vous ne répondez pas « fais au mieux ».

Il produit un plan éditable. Le plan décrit ce qui sera construit, les fichiers visés, et la preuve. Ce n'est pas encore le code. Vous pouvez le lire comme Léa Vernet lirait une page : chaque ligne peut être fausse, donc chaque ligne peut être corrigée.

> [!NOTE]
> Chercher, demander, proposer : tant que vous n'avez pas validé le plan, les fichiers du projet ne sont pas le lieu de l'essai.

# Corriger le plan avant de construire

Le plan est un texte. Vous le corrigez avant de lancer la construction. Vous ne comptez pas sur l'agent pour « voir » l'erreur pendant qu'il écrit le code.

Vous retirez ce qui n'est pas l'incrément. Un plan de la liste qui ajoute un formulaire, une attente, ou un paiement est un plan faux, même si la liste y est juste. Vous effacez ces lignes. Vous réécrivez la preuve : 12 stages, samedi 10 h-13 h, 8 places, 45 €, places restantes.

Vous corrigez aussi les chiffres. Si le plan dit 10 places ou 40 €, vous remettez 8 et 45. Si l'horaire est 9 h-12 h, vous remettez 10 h-13 h. La correction se fait sur le plan, pas dans un message envoyé après coup, une fois les fichiers déjà changés.

Construire est le geste d'après. Il vient quand vous pouvez relire le plan sans y trouver une règle que Léa contredirait. Atelier Sève, Lyon Croix-Rousse, reste décrit comme dans le brief, pas comme dans une variante.

# Enregistrer le plan dans le workspace

Un plan seulement affiché dans le chat disparaît dans la suite des messages. Vous pouvez enregistrer le plan dans le workspace. Vous le faites. Le plan devient un fichier du dépôt, à côté du brief, que vous rouvrez et que vous citez avec `@`.

Vous enregistrez la version corrigée, pas le premier jet. Si vous corrigez après l'enregistrement, vous enregistrez encore. Le fichier du workspace et l'écran du mode Plan doivent dire la même chose, comme le brief.

Ce fichier sert au moment de construire, et il sert si vous devez revenir en arrière. Sans lui, « le plan » est un souvenir. Avec lui, vous pouvez montrer la ligne qui interdisait le paiement. Les 3 absents par mois et le remplissage de 70 % peuvent y rester en contexte. Ils ne deviennent pas un écran à coder dans ce plan-ci.

> [!TIP]
> Enregistrez le plan corrigé dans le workspace avant de construire. Le prochain message citera ce fichier, pas une reformulation de mémoire.

# Le plan de la page des 12 stages

Le premier plan ne couvre que l'incrément 1. Il annonce plusieurs fichiers, et c'est normal : les données des stages, la page qui les montre, le style qui les rend lisibles. Plusieurs fichiers, un seul résultat visible.

Le plan doit contenir, en clair :

- La preuve : la page liste 12 stages.
- Le créneau : samedi, 10 h-13 h, Atelier Sève, Lyon Croix-Rousse.
- Les règles affichées : 8 places, 45 €, places restantes.
- Le hors-champ : pas de formulaire de réservation, pas d'attente, pas de confirmation, pas de paiement réel.

La décision avant 18 h la veille n'est pas dans ce plan. Elle appartient à l'incrément 4. L'écrire ici, c'est commencer la confirmation trop tôt. Vous ne demandez pas non plus à ce plan de « prévoir les quatre incréments ». Quatre plans viendront, chacun avant sa construction. Celui-ci tient sur la liste.

# L'agent direct, seulement pour le petit geste

Le mode Agent, sans passer par le plan, convient à un changement petit, que vous avez déjà fait souvent. Corriger un libellé sur une page qui existe. Remettre 45 € là où une faute a écrit 40 €, dans un fichier que vous connaissez. Ajuster une phrase que Léa a déjà relue.

Il ne convient pas à l'incrément 1. La liste n'existe pas encore. Elle traverse les données, la page et le style. Vous ne voyez pas encore quels fichiers bougeront. Le plan sert à le voir avant.

Le test est simple. Si vous pouvez nommer le fichier, la ligne, et le résultat avant d'envoyer, et que ce geste est court et habituel, le mode Agent suffit. Si vous dites « construis la page des stages », vous êtes dans le plan. La taille du prompt n'est pas le critère. Un prompt court peut quand même ouvrir cinq fichiers.

```diagram
type: sequence
title: "Ce que vous faites en mode Plan"
actors: ["Vous", "Agent", "Plan"]
messages:
  - from: 0
    to: 1
    text: "Shift+Tab vers Plan, brief cité, incrément 1 seulement."
  - from: 1
    to: 0
    text: "Questions après avoir cherché dans le code."
  - from: 0
    to: 1
    text: "Réponses chiffrées : 12 stages, 8 places, 45 €, pas de paiement."
  - from: 1
    to: 2
    text: "Un plan éditable, plusieurs fichiers, une preuve visible."
  - from: 0
    to: 2
    text: "Vous corrigez, puis vous enregistrez dans le workspace."
```

> [!WARNING]
> Mode Agent tout de suite sur la liste des 12 stages : les fichiers changent avant que vous ayez lu l'ordre des travaux. Pour ce geste-là, passez par le plan.

# Exercices

## Exercice 1 : Quel mode avant d'envoyer

Trois demandes arrivent. Dites pour chacune si vous passez par le mode Plan ou si le mode Agent direct suffit.

1. Créer la page des 12 stages, qui n'existe pas.
2. Sur la page déjà juste et déjà relue, remplacer le mot « tarif » par « 45 € ».
3. « Ajoute le paiement et l'attente, ce sera plus complet. »

<details>
<summary>Voir la solution</summary>

1. Mode Plan. Plusieurs fichiers, preuve nouvelle (compter 12 stages). Shift+Tab jusqu'à Plan, puis le brief.
2. Mode Agent direct. Le fichier est connu, le geste est petit, vous l'avez déjà fait souvent : un libellé, sans changer les règles.
3. Ni l'un ni l'autre pour construire ça. Le paiement est hors de ce tour. L'attente est l'incrément 3, pas un ajout « pour faire complet ». Vous ne lancez pas un plan qui mélange les deux.

</details>

## Exercice 2 : Un plan qui a déjà dérivé

Le plan proposé dit : 10 places, 40 €, un formulaire de carte, et « on préparera le SMS des absents ». La preuve annoncée est « une belle page ». Que corrigez-vous avant d'enregistrer et de construire ?

<details>
<summary>Voir la solution</summary>

Vous ne construisez pas. Vous éditez le plan.

Preuve : la page liste 12 stages, samedi 10 h-13 h, Atelier Sève, Lyon Croix-Rousse, 8 places, 45 €, places restantes. Vous remplacez 10 par 8, et 40 € par 45 €.

Vous effacez le formulaire de carte : pas de paiement réel dans ce tour. Vous effacez le SMS : les 3 absents par mois expliquent le problème, ils ne se codent pas dans l'incrément 1. « Belle page » sort, Léa ne peut pas la contredire.

Vous enregistrez cette version dans le workspace. Ensuite seulement, la construction pourra citer ce fichier.

</details>

## Exercice 3 : Répondre à une question de l'agent

En mode Plan, l'agent demande : « J'envoie un vrai SMS pour les 3 absents, et j'encaisse 45 € à l'inscription ? Les 12 stages sont-ils tous le dimanche matin ? » Répondez avec les faits du brief, sans ouvrir un autre produit.

<details>
<summary>Voir la solution</summary>

Non pour le SMS réel : les 3 absents viennent d'un SMS oublié, mais cet envoi n'est pas l'incrément en cours. Non pour l'encaissement : pas de paiement réel dans ce tour, 45 € s'affiche seulement.

Les stages ne sont pas le dimanche matin. Le créneau est samedi, 10 h-13 h, à Lyon Croix-Rousse. Il y en a 12 dans le mois. L'attente (12 au plus) et la décision de Léa avant 18 h la veille ne font pas partie de ce plan : elles ont leurs incréments, plus tard.

Vous répondez par ces phrases, puis vous vérifiez qu'elles se retrouvent dans le plan avant de l'enregistrer.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Corriger le plan d'abord
center: "Shift+Tab vers Plan. L'agent cherche, demande, propose. Vous corrigez avant de construire."
points:
  - icon: compass
    title: Shift+Tab
    text: "Le champ doit afficher Plan avant l'envoi. Ce geste change le mode, il ne complète pas le code."
  - icon: search
    title: Trois temps
    text: "L'agent cherche dans le dépôt, pose des questions, puis écrit un plan que vous pouvez éditer."
  - icon: file
    title: Dans le dépôt
    text: "Vous enregistrez le plan corrigé dans le workspace, à citer ensuite avec @, comme le brief."
  - icon: list
    title: Incrément 1
    text: "Plusieurs fichiers pour une preuve : 12 stages, samedi 10 h-13 h, 8 places, 45 €."
  - icon: zap
    title: Agent direct
    text: "Seulement si le changement est petit, local, et déjà fait souvent. Pas pour créer la liste."
pitfall: "Construire un plan qui dit 10 places ou un paiement. L'erreur se grave dans les fichiers, plus dans le texte."
remember: "On corrige le plan, on l'enregistre, ensuite on construit. L'agent direct ne remplace pas ce passage."
```
