---
title: "La checklist de qualité"
description: "Créer avec /speckit-checklist une checklist tenue par le relecteur, où cocher veut dire qu'un critère d'exigence est satisfait."
duration: 50
objectives:
  - "Créer une checklist de qualité avec /speckit-checklist"
  - "Cocher un critère d'exigence, pas une livraison de code"
  - "Laisser checklists/requirements.md à specify et à clarify"
  - "Répondre à implement quand des cases sont vides, sans qu'il coche à votre place"
---

# Des contrôles sur le texte

Léa Vernet tient Atelier Sève, à Lyon Croix-Rousse. Samedi 10 h-13 h, 8 places, 45 €. L'attente s'arrête à 12 noms, la décision tombe avant 18 h la veille. Douze stages par mois, remplissage 70 %, 3 absents parce qu'un SMS a été oublié. La liste et le refus de la 9e place sont déjà en place. La spec de l'attente est écrite. Elle n'est pas encore prouvée comme texte.

`/speckit-checklist` crée une checklist de qualité des exigences. Vous l'envoyez dans le chat, pas dans le terminal. Vous pouvez viser un sujet :

```text
/speckit-checklist
Qualité des exigences de l'attente : plafond 12, compte public sans téléphone, phrase des 18 h.
Hors champ : SMS et paiement.
```

Le fichier arrive dans `checklists/`, à côté de la checklist intégrée. Chaque ligne est un critère sur le texte : est-ce chiffré, est-ce univoque, est-ce complet. Le skill de GitHub Spec Kit ne livre pas l'écran de Léa. Il prépare la relecture des exigences.

> [!NOTE]
> Une checklist de qualité examine la spec. Elle ne remplace pas `tasks.md`, et elle ne construit pas la page.

# Le relecteur possède la liste

Cette checklist est à vous, le relecteur. L'agent peut aider à la rédiger. Il ne la valide pas en silence. Une case cochée par le skill, sans votre lecture, ne compte pas.

Vous ouvrez la spec de la fonctionnalité active, celle de `.specify/feature.json`. Vous lisez un critère, puis vous cherchez la phrase qui y répond. Si la phrase est là, nette, vous cochez. Si elle manque ou si elle se contredit, la case reste vide, et vous retournez au texte.

Léa peut contredire un chiffre. Le critère doit avoir la même tenue. « Une file raisonnable » ne se coche pas. « Au plus 12 noms, le 13e refusé » se coche, une fois que la spec le dit ainsi.

Le relecteur n'est pas la personne qui a tapé le plus vite. C'est la personne qui répond du critère. Sur Sève, c'est vous, avec les règles de Léa sous les yeux.

# Une case cochée, un critère tenu

Cocher veut dire que le critère de qualité est satisfait. Le code peut être encore absent. La page peut ne rien afficher. La case ne dit pas « c'est livré ». Elle dit « l'exigence est assez claire pour qu'on s'y tienne ».

La case d'une tâche, dans `tasks.md`, dira plus tard que le travail a été fait. Ce n'est pas la même case. Mélanger les deux fait croire qu'un texte relu est un écran livré, ou qu'un écran livré a relu le texte.

| Case | Elle dit | Elle ne dit pas |
| --- | --- | --- |
| Checklist de qualité | Le critère sur l'exigence est satisfait | Le code est en place |
| Tâche de `tasks.md` | Le travail décrit a été exécuté | La spec était claire |

Pour le compte public, le critère juste ressemble à ceci : la page visible par un visiteur affiche un compte, et l'absence de téléphone est écrite. Vous le cochez quand la spec contient cette phrase. Vous ne le cochez pas parce qu'un brouillon de maquette vous plaît.

```diagram
type: compare
title: "Deux cases, deux sens"
columns:
  - title: Qualité des exigences
    tone: teal
    items:
      - "Le relecteur la possède"
      - "Cocher veut dire que le critère est satisfait"
      - "Le code peut encore manquer"
      - "requirements.md reste à specify et clarify"
  - title: Tâche de tasks.md
    tone: amber
    items:
      - "Implement l'exécute dans l'ordre"
      - "La case suivra le travail fait"
      - "Elle ne relit pas la spec à votre place"
      - "Le SMS n'y a pas sa place"
```

# requirements.md a déjà un titulaire

`checklists/requirements.md` est la checklist intégrée. `/speckit-specify` la tient, `/speckit-clarify` la tient aussi : ils l'écrivent et ils la réévaluent quand la spec change. Votre checklist de qualité vit à côté. Elle ne prend pas la place de ce fichier.

Vous ne réécrivez pas `requirements.md` pour faire taire une case vide. Si une ligne y reste ouverte, vous retournez au skill qui la possède. Specify ou clarify rejugent le critère. Une coche posée à la main, pour « débloquer », fait mentir le fichier.

Les deux listes seront lues plus tard, au moment d'implémenter. Une case vide dans l'une ou dans l'autre arrête le passage et pose une question. D'où l'intérêt de savoir qui a le droit de cocher quoi. Vous, pour la checklist que vous venez de demander. Specify et clarify, pour `requirements.md`.

# Implement lit et il demande

`/speckit-implement` lit l'état des checklists. Il compte les cases cochées et les cases vides. Il ne modifie pas ces fichiers. Il ne coche pas à votre place.

S'il reste une case vide, il s'arrête et il demande si vous voulez continuer quand même. La question vous appartient. Tant que vous n'avez pas relu le critère, vous répondez non. Vous ne lui demandez pas de cocher pour que la question disparaisse.

Sur Sève, une case vide du type « les téléphones sont absents de la page publique » est une raison de dire non. Vous ouvrez la spec. Si l'interdit est écrit, vous cochez vous-même la checklist dont vous êtes le relecteur. Si l'interdit manque, vous clarifiez d'abord. Ensuite seulement vous relancez l'implémentation.

Un oui sans lecture ouvre la porte que la checklist devait tenir. Le skill aura demandé. La décision restera la vôtre, et elle se verra dans le diff.

> [!WARNING]
> Implement demande quand des cases sont vides. Il ne les coche pas. Vous ne lui dictez pas de les cocher.

# Ce que vous cochez pour Sève

Vous passez les critères un par un, spec ouverte.

Le plafond est un nombre. La spec dit 12 noms, et le 13e est refusé. Vous cochez. « Une petite file » reste vide.

Le public voit un compte. Quand trois personnes patientent, la phrase de preuve est « 3 personnes en attente ». Les téléphones n'y sont pas. Les noms du visiteur n'y sont pas. Vous cochez si ces deux phrases sont dans la spec. L'écran de Léa, lui, peut garder l'ordre : ce critère-là est distinct, et il ne se coche pas sur la page publique.

L'heure est 18 h la veille, pas « assez tôt ». Le stage reste samedi 10 h-13 h. 8 places et 45 € ne bougent pas. Le prix s'affiche. Le SMS et le paiement sont hors de la fonctionnalité. Les 3 absents et le remplissage de 70 % expliquent le problème. Ils ne deviennent pas un critère d'envoi.

Une case reste vide dès qu'une de ces phrases manque ou se contredit. Vous corrigez la spec, vous laissez specify ou clarify reprendre `requirements.md` s'il est en cause, et vous ne faites pas semblant.

> [!TIP]
> Avant de cocher, lisez la phrase à voix haute. Si Léa ne peut pas dire « non, c'est faux », le critère n'est pas prêt.

# Exercices

## Exercice 1 : Une case cochée trop tôt

La checklist de qualité contient « le 13e nom est refusé ». Aucun code n'existe encore. Un collègue coche, « pour avancer, le code viendra ». La spec dit seulement « gérer la file ». Que vaut cette coche, et que faites-vous ?

<details>
<summary>Voir la solution</summary>

La coche est fausse des deux côtés. Cocher veut dire que le critère de qualité est satisfait, pas que le code est livré. Ici le code est absent, et la spec ne dit pas le plafond de 12 ni le refus du 13e nom. « Gérer la file » ne se coche pas.

Vous décochez. Vous faites écrire le nombre dans la spec. Vous relisez, puis vous cochez vous-même, en tant que relecteur. Vous ne demandez pas au skill d'implémentation de cocher à votre place.

</details>

## Exercice 2 : La question d'implement

Vous lancez `/speckit-implement`. Il s'arrête : `checklists/requirements.md` a des cases vides, et votre checklist aussi, sur les téléphones. Il demande si l'on continue. Que répondez-vous, et qui coche ensuite ?

<details>
<summary>Voir la solution</summary>

Vous répondez non. Implement lit l'état et demande. Il ne coche pas.

`requirements.md` est tenue par `/speckit-specify` et `/speckit-clarify`. Vous y retournez, vous ne la cochez pas à la main pour faire taire la question. Votre checklist, elle, est à vous : vous ne la cochez sur les téléphones que lorsque la spec dit que la page publique montre un compte, sans numéros. « 3 personnes en attente » en est la phrase de preuve. Ensuite vous relancez l'implémentation.

</details>

## Exercice 3 : Trois critères, trois décisions

La spec dit : 8 places, attente max 12, 13e nom refusé, décision avant 18 h la veille, prix 45 € affiché. Elle ne dit rien des téléphones. Elle ajoute « prévoir un SMS, vu les 3 absents ». Pour chaque point, la case se coche-t-elle ?

<details>
<summary>Voir la solution</summary>

Le plafond 12 et le refus du 13e nom se cochent : le critère est chiffré. L'heure 18 h la veille aussi, ainsi que 8 places et 45 € affichés.

La case des téléphones reste vide. La spec ne dit pas que la page publique est un compte sans numéros. Vous ne l'inventez pas d'un coche.

La case qui ferait du SMS un travail à faire ne se coche pas comme une exigence de cette fonctionnalité. Les 3 absents expliquent la phrase des 18 h. Vous faites retirer le SMS du champ, dans la spec, puis vous relisez. Le paiement n'entre pas non plus.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Cocher le critère
center: "La checklist du relecteur dit que l'exigence est claire. Elle ne dit pas que le code est livré."
points:
  - icon: check
    title: Critère tenu
    text: "Cocher veut dire que le critère de qualité est satisfait. Le code peut encore manquer."
  - icon: eye
    title: Le relecteur
    text: "/speckit-checklist lui appartient. Une coche sans lecture de la spec ne compte pas."
  - icon: file
    title: requirements.md
    text: "La checklist intégrée est tenue par specify et clarify. On ne la coche pas pour débloquer."
  - icon: chat
    title: Implement demande
    text: "S'il reste une case vide, il s'arrête et il demande. Il ne coche pas à votre place."
  - icon: users
    title: Preuve Sève
    text: "12 noms, 13e refusé, « 3 personnes en attente » sans téléphone, phrase des 18 h."
pitfall: "Cocher « le code refuse le 13e » alors que la spec dit seulement « gérer la file »."
remember: "Case cochée : le critère est satisfait. Implement lit, demande, et ne coche pas à votre place."
```
