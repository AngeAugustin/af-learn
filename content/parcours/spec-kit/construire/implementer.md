---
title: "Implémenter une phase"
description: "Exécuter tasks.md avec /speckit-implement, s'arrêter si une checklist est vide, et relire le diff de la phase avant la suivante."
duration: 50
objectives:
  - "Exécuter tasks.md dans l'ordre avec /speckit-implement"
  - "Limiter un tour à une phase de l'attente"
  - "Répondre non quand une checklist a des cases vides"
  - "Relire le diff de la phase avant la suivante, sans écarter les tests"
---

# tasks.md s'exécute dans l'ordre

Léa Vernet, Atelier Sève, Lyon Croix-Rousse. Samedi 10 h-13 h, 8 places, 45 €. Attente max 12, décision avant 18 h la veille. 12 stages dans le mois, remplissage 70 %, 3 absents parce qu'un SMS a été oublié. La liste et le refus de la 9e place sont déjà là. L'analyse de l'attente est propre. `tasks.md` porte l'ordre : refus du 13e nom, puis « 3 personnes en attente » sans téléphones, puis la phrase des 18 h.

`/speckit-implement` se lance dans le chat. Le skill de GitHub Spec Kit exécute `tasks.md` dans cet ordre. Il ne choisit pas la tâche qui lui semble plus utile. Il ne commence pas par le SMS, qui n'est pas une tâche. Il ne commence pas par un paiement des 45 €.

La fonctionnalité exécutée est celle de `.specify/feature.json`. Si le fichier pointe encore vers la liste des stages, vous le rectifiez avant. Sinon le skill refera un travail déjà en place, ou il le mélangera à l'attente.

> [!IMPORTANT]
> Implement suit `tasks.md`. L'ordre de Sève reste : 13e nom refusé, compte sans téléphone, phrase des 18 h.

# Limiter le tour à une phase

Vous pouvez limiter le skill à une phase. Pour l'attente, vous le faites. Trois comportements d'un coup remplissent le diff, et la relecture devient un tas.

```text
/speckit-implement
Seulement la phase qui refuse le 13e nom.
Arrête-toi avant l'affichage public et avant la phrase des 18 h.
```

Le message nomme la phase et le point d'arrêt. Il ne dit pas « fais au mieux ». À la fin de ce tour, le dépôt doit refuser le 13e nom et garder les 12 noms dans l'ordre d'arrivée. Il ne doit pas encore montrer le compte public, ni la phrase des 18 h, si vous les avez laissés pour la suite.

La phase d'après aura son propre message, après votre relecture. Vous ne les enchaînez pas dans le même envoi « pour gagner la soirée ».

# Il s'arrête si une case est vide

Avant les tâches, le skill lit les checklists. `checklists/requirements.md` est tenue par specify et clarify. La checklist de qualité est tenue par vous, le relecteur. Implement compte les cases. Il ne les coche pas.

S'il en reste une vide, il s'arrête et il demande si vous continuez quand même. Vous répondez non tant que le critère vide touche l'attente : téléphones, 13e nom, heure des 18 h, paiement, SMS. Vous allez cocher vous-même, après lecture, ou vous retournez au skill qui tient `requirements.md`. Puis vous relancez.

Un oui est une décision, pas un réflexe. Il dit que vous acceptez de coder alors qu'un critère n'est pas coché. Sur Sève, ce oui sans lecture ouvre la porte aux numéros sur la page publique.

```diagram
type: sequence
title: "La question avant la phase"
actors: ["Vous", "Implement", "Checklist"]
messages:
  - from: 0
    to: 1
    text: "Seulement la phase du 13e nom"
  - from: 1
    to: 2
    text: "Lit les cases, sans les modifier"
  - from: 2
    to: 1
    text: "Il reste des cases vides"
  - from: 1
    to: 0
    text: "Il s'arrête et il demande"
  - from: 0
    to: 1
    text: "Non, tant que le critère n'est pas relu"
```

# La phase du 13e nom

Vous avez répondu en connaissance de cause, les cases utiles sont cochées, le rapport d'analyse est propre. Le skill exécute la phase. Vous regardez ce qu'elle a le droit de changer.

Le 13e nom est refusé. Les 12 déjà inscrits restent dans l'ordre. Les 8 places ne bougent pas : la 9e personne ne s'assoit toujours pas. Le samedi reste 10 h-13 h. 45 € reste un prix affiché. Aucun téléphone n'apparaît « pour tester la file ». La phrase des 18 h attend sa phase. Le SMS n'a pas de phase.

Si la phase livre aussi le compte public, elle a dépassé l'arrêt que vous aviez écrit. Vous ne gardez pas le surplus parce qu'il est « déjà là ». Vous revenez au périmètre de la phase, puis vous relirez ce diff-là.

Les tests de cette phase font partie du tour. Celui qui ajoute un 13e nom et vérifie le refus en est la preuve. Une phase sans cette preuve n'est pas finie.

> [!NOTE]
> La phase du 13e nom ne construit pas l'écran public. Le compte « 3 personnes en attente » a sa phase, après.

# Relire le diff avant la suite

Vous relisez le diff de cette phase avant d'en lancer une autre. Vous le comparez à la spec, pas à la longueur du travail. Présent : le refus du 13e nom. Absents : téléphones, paiement, secret, SMS, phrase des 18 h si elle était hors de ce tour.

Quand ce diff tient, vous envoyez la phase suivante.

```text
/speckit-implement
Seulement la phase qui affiche « 3 personnes en attente » sans téléphone.
Arrête-toi avant la phrase des 18 h.
```

Même geste ensuite pour la phrase : décision de Léa avant 18 h la veille, à l'écran, sans envoi. Entre chaque message, une relecture. La liste des 12 stages doit rester lisible. Le refus de la 9e place aussi.

Vous ne demandez pas « enchaîne les trois, je lirai à la fin » alors que vous aviez choisi de limiter. La limite ne sert que si le diff de la phase est vu avant le suivant.

# Les tests restent dans le tour

Vous ne dites pas « ignore les tests ». Une phrase de ce genre dans le chat demande au skill de livrer sans preuve. Le test du 13e nom, le test du compte sans téléphone, le test de la phrase des 18 h sont le moyen de voir que la phase a tenu.

Un test qui échoue arrête. Vous lisez l'échec. Si le code laisse entrer le 13e nom, vous faites corriger le code. Si le test attend des téléphones sur la page publique, le test contredit la spec : vous le ramenez au compte, vous n'écartez pas la suite pour qu'il passe. Si le test encode 10 places, il porte le conflit que l'analyse avait interdit.

« Ignore les tests » ne débloque pas une phase. Il la rend illisible. Les 3 absents ne deviennent pas une raison de sauter le test de la phrase des 18 h. Cette phrase est justement la réponse au SMS oublié, et elle se voit.

> [!WARNING]
> On ne dit pas « ignore les tests ». Un échec sur le 13e nom se corrige. Il ne s'efface pas du message.

# Exercices

## Exercice 1 : Le message de la première phase

Les checklists sont cochées, l'analyse est propre. Écrivez le message qui lance seulement le refus du 13e nom, et dites ce que le diff a le droit de contenir.

<details>
<summary>Voir la solution</summary>

Dans le chat :

`/speckit-implement`
Seulement la phase qui refuse le 13e nom. Arrête-toi avant l'affichage public et avant la phrase des 18 h.

Le diff refuse le 13e nom et garde l'ordre des 12. Il laisse 8 places et le refus de la 9e place. Il n'affiche pas encore « 3 personnes en attente », ni la phrase des 18 h. Il n'ajoute ni téléphone, ni paiement des 45 €, ni SMS. Les tests de ce refus font partie du tour.

</details>

## Exercice 2 : Des cases vides

Au lancement, le skill s'arrête. Votre checklist a la case des téléphones encore vide. `checklists/requirements.md` a aussi une case vide. Il demande si vous continuez. Un collègue dit « réponds oui, et dis-lui de cocher ». Que faites-vous ?

<details>
<summary>Voir la solution</summary>

Vous répondez non. Implement lit l'état et demande. Il ne coche pas à votre place, et vous ne le lui demandez pas.

Vous cochez la case des téléphones seulement si la spec dit que la page publique est un compte, sans numéros. `requirements.md` retourne à specify ou clarify, qui la tiennent. Puis vous relancez la phase. Un oui sans lecture ouvrirait le code alors que le critère est vide.

</details>

## Exercice 3 : Le test du 13e nom échoue

La phase est limitée au refus du 13e nom. Le test qui ajoute ce nom échoue : la file passe à 13. On vous propose d'ajouter « ignore les tests » pour passer à l'affichage. Que répondez-vous ?

<details>
<summary>Voir la solution</summary>

Vous ne dites pas « ignore les tests ». L'échec dit que le plafond de 12 n'est pas tenu. Vous faites corriger le code, vous relancez les tests de cette phase, vous relisez le diff.

Vous ne passez pas à « 3 personnes en attente » sur une file qui accepte le 13e nom. Vous ne remplacez pas non plus le test par un envoi de SMS. La phrase des 18 h attend que cette phase soit relue.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Une phase, puis le diff
center: "Implement exécute tasks.md dans l'ordre. On limite à une phase, on relit, on garde les tests."
points:
  - icon: list
    title: Dans l'ordre
    text: "/speckit-implement suit tasks.md. D'abord le 13e nom, puis le compte, puis la phrase des 18 h."
  - icon: target
    title: Une phase
    text: "Le message nomme la phase et l'arrêt. Le compte public n'entre pas dans le tour du 13e nom."
  - icon: alert
    title: Cases vides
    text: "Il s'arrête et il demande. Il ne coche pas. Sans relecture, la réponse est non."
  - icon: eye
    title: Relire le diff
    text: "On lit le diff de cette phase avant la suivante. 8 places et 45 € affichés restent en place."
  - icon: test
    title: Les tests restent
    text: "On ne dit pas « ignore les tests ». L'échec du 13e nom se corrige, il ne s'efface pas."
pitfall: "Répondre oui aux cases vides, ou écrire « ignore les tests » pour enchaîner les phases."
remember: "Une phase, une relecture du diff, les tests gardés. Implement demande, il ne coche pas."
```
