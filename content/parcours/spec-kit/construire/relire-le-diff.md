---
title: "Relire le diff avec la spec"
description: "Lire le diff contre spec.md : 13e nom refusé, pas de téléphone, phrase des 18 h, pas de paiement, pas de secret."
duration: 50
objectives:
  - "Comparer chaque morceau du diff à spec.md"
  - "Vérifier le refus du 13e nom, le compte sans téléphone et la phrase des 18 h"
  - "Refuser un paiement ou un secret dans le même diff"
  - "Garder la fonctionnalité indiquée par .specify/feature.json"
---

# spec.md est la grille

Léa Vernet, Atelier Sève, Lyon Croix-Rousse. Samedi 10 h-13 h, 8 places, 45 €. L'attente s'arrête à 12 noms. Elle tranche avant 18 h la veille. 12 stages par mois, remplissage 70 %, 3 absents (SMS oublié). La liste des stages et le refus de la 9e place sont déjà en place.

Vous avez un diff, après une phase ou après un tour de convergence. Vous le lisez contre `spec.md`, pas contre l'effort, pas contre le nombre de fichiers. Chaque morceau doit servir une phrase de cette spec, ou il n'a pas sa place.

La spec ouverte est celle de la fonctionnalité en cours. Une spec plus ancienne, celle de la liste seule, ne juge pas l'attente. Elle ne contient pas le 13e nom. S'en servir rendrait le compte public « hors sujet », à tort.

> [!IMPORTANT]
> La grille de lecture est `spec.md`. Un morceau du diff sans phrase dans cette spec est un surplus.

# Trois présences

Vous cherchez trois preuves, dans cet esprit : elles sont demandées, donc elles doivent se voir.

Le 13e nom est refusé. Douze noms peuvent attendre, dans l'ordre d'arrivée. Le treizième n'entre pas. Les 8 places ne se sont pas élargies au passage : la 9e personne ne s'assoit toujours pas.

La page publique montre un compte. Quand trois personnes patientent, le diff contient la phrase « 3 personnes en attente ». Il ne contient pas leurs téléphones, ni la liste de leurs noms pour un visiteur. L'ordre des noms, s'il apparaît, est sur l'écran de Léa.

La phrase des 18 h est là. Elle dit que Léa décide avant 18 h la veille. Elle se lit. Elle n'envoie rien. Le créneau du stage ne devient pas 18 h : il reste samedi, 10 h-13 h.

Si l'une des trois manque alors que la phase devait la livrer, le diff n'est pas accepté. Vous le renvoyez. Vous ne cochez pas la tâche pour « compenser ».

# Deux absences

Deux choses ne doivent pas être dans le diff, même à côté d'une preuve juste.

Pas de paiement. 45 € s'affiche. Aucun bouton, aucun écran, aucun appel qui encaisse. Le prix dans la spec n'est pas un ordre de prélèvement. Un morceau qui encaisse se refuse, y compris s'il « prépare » seulement.

Pas de secret. Pas de jeton, pas de clé, pas de mot de passe, pas le contenu d'un fichier d'environnement, pas un identifiant de fournisseur de SMS. Les 3 absents expliquent la phrase des 18 h. Ils ne font pas entrer un secret dans le dépôt. Le remplissage de 70 % non plus.

Le SMS lui-même est une absence. Brancher un envoi n'est pas une ligne de la spec. Si le diff ouvre un envoi, vous le refusez avec le secret qui l'accompagne souvent.

```diagram
type: compare
title: "Le diff contre la spec de l'attente"
columns:
  - title: Ce qui doit être là
    tone: teal
    items:
      - "Le 13e nom est refusé"
      - "« 3 personnes en attente », sans téléphone"
      - "La phrase : décision avant 18 h la veille"
      - "8 places, 45 € affichés, samedi 10 h-13 h"
  - title: Ce qui ne doit pas y être
    tone: rose
    items:
      - "Un téléphone ou un annuaire public"
      - "Un paiement des 45 €"
      - "Un secret, un jeton, une clé"
      - "Un envoi de SMS"
```

# La fonctionnalité de feature.json

La fonctionnalité active reste celle de `.specify/feature.json`. Vous ouvrez ce fichier. Le dossier qu'il indique contient la `spec.md` que vous devez tenir à côté du diff. Vous ne devinez pas le dossier d'après la branche git. Changer de branche ne change pas le fichier.

Si le fichier désigne l'attente, vous jugez le diff avec la spec de l'attente. Si vous avez relu avec la spec de la liste des stages, vous recommencez. Cette spec-là ne parle pas du 13e nom ni de la phrase des 18 h. Un diff pourrait « passer » alors qu'il montre des téléphones, simplement parce que vous avez ouvert le mauvais texte.

Vous ne modifiez pas `.specify/feature.json` pour pointer vers une spec plus souple, afin qu'un paiement ait l'air hors sujet. Le fichier dit sur quoi vous travaillez. Le diff se range dessous.

> [!TIP]
> Avant la première ligne du diff, lisez le dossier écrit dans `.specify/feature.json`, et ouvrez la spec qui s'y trouve.

# Un secret arrête l'acceptation

Vous parcourez le diff morceau par morceau. Un secret arrête l'acceptation, même si le morceau d'à côté affiche une phrase des 18 h juste. Vous n'acceptez pas « la bonne moitié » en laissant la clé dans le dépôt. Vous ne reportez pas le retrait à un commit suivant.

Même arrêt pour un paiement. Si l'encaissement et la phrase juste sont trop mêlés pour les séparer, vous renvoyez l'ensemble de la phase. Un prix commenté, un bouton masqué, un appel laissé « au cas où » restent un paiement.

Les téléphones sur la page publique s'arrêtent aussi. « 3 personnes en attente » ne rachète pas une colonne de numéros dans le même écran. Vous gardez le compte, vous retirez les numéros, ou vous renvoyez la phase si les deux sont inséparables.

La liste des 12 stages doit encore s'afficher. Le refus de la 9e place doit encore tenir. Un diff d'attente qui casse ces deux acquis pour « faire de la place » ne passe pas. Croix-Rousse, samedi 10 h-13 h, 8 places, 45 € : ces lignes se revérifient en même temps que les trois preuves.

# Accepter quand les cinq tiennent

Vous acceptez quand les cinq réponses sont oui.

1. Le 13e nom est refusé, les 12 restent en ordre.
2. Pas de téléphone sur la page publique. Le compte « 3 personnes en attente » est là si la phase devait l'afficher.
3. La phrase des 18 h est là si la phase devait la livrer, et elle n'envoie rien.
4. Pas de paiement. 45 € est affiché.
5. Pas de secret.

La spec sous vos yeux est celle de `.specify/feature.json`. Les tests de la phase passent, et vous ne les avez pas fait taire. Alors le diff peut entrer. Sinon vous renvoyez, vous corrigez la source si le texte était en cause, et vous relisez un diff neuf.

Ce geste ferme le tour. Il ne remplace pas converge : si un comportement de la spec n'est dans aucun diff, il manque encore, et c'est converge qui ajoutera la tâche. La relecture, elle, empêche d'accepter un présent qui contredit la spec.

> [!WARNING]
> Cinq réponses. Une seule non, sur le téléphone, le paiement ou le secret, et le diff ne s'accepte pas en l'état.

# Exercices

## Exercice 1 : Le compte et les numéros

Le diff de la phase publique affiche « 3 personnes en attente ». Sous la phrase, il liste trois téléphones « pour que Léa puisse appeler ». Le 13e nom est bien refusé ailleurs. Acceptez-vous ?

<details>
<summary>Voir la solution</summary>

Non. La spec demande le compte, sans téléphone. La phrase juste ne rachète pas les numéros. L'écran de Léa peut garder l'ordre des noms, pas la page publique, et pas les téléphones.

Vous renvoyez ce morceau. Vous ne le gardez pas « en attendant le SMS ». Les 3 absents ne justifient pas un annuaire. Le refus du 13e nom, lui, peut rester s'il est séparable et déjà juste.

</details>

## Exercice 2 : La phrase et le paiement

Le même diff montre « Léa tranche avant 18 h la veille » et un bouton qui encaisse 45 €. Un fichier d'à côté contient une clé d'encaissement. La phase demandée était seulement la phrase. Que gardez-vous ?

<details>
<summary>Voir la solution</summary>

Vous gardez la phrase des 18 h si elle est seule et fidèle : avant 18 h la veille, sans envoi. Vous refusez le bouton et la clé. Pas de paiement, pas de secret.

S'ils sont mêlés à la phrase au point de ne plus se séparer, vous renvoyez la phase entière. Vous ne masquez pas le bouton. Vous ne dites pas que la clé partira au commit suivant. 8 places et le refus de la 9e place doivent encore tenir à côté.

</details>

## Exercice 3 : La mauvaise spec

`.specify/feature.json` désigne le dossier de l'attente. Vous avez comparé le diff à une spec plus ancienne, celle de la liste des 12 stages, qui ne parle ni du 13e nom ni des téléphones. Le diff vous a paru « hors liste, donc acceptable », alors qu'il affiche des numéros. Que rouvrez-vous ?

<details>
<summary>Voir la solution</summary>

Vous rouvrez `.specify/feature.json`, puis la `spec.md` du dossier qu'il indique. La fonctionnalité active est celle-là. La branche git ne la change pas.

Vous relisez le diff contre cette spec : 13e nom refusé, pas de téléphone, phrase des 18 h, pas de paiement, pas de secret. Les numéros, invisibles dans l'ancienne spec, deviennent un refus. Vous ne pointez pas le fichier vers l'ancienne spec pour les laisser passer.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Le diff contre la spec
center: "On lit le diff contre spec.md : 13e refusé, pas de téléphone, phrase des 18 h, rien d'autre."
points:
  - icon: file
    title: La grille
    text: "Chaque morceau sert une phrase de spec.md. Un surplus sans phrase ne s'accepte pas."
  - icon: users
    title: Trois preuves
    text: "13e nom refusé, « 3 personnes en attente » sans téléphone, décision avant 18 h la veille."
  - icon: lock
    title: Deux absences
    text: "Pas de paiement des 45 €. Pas de secret, pas de jeton, pas de clé, pas d'envoi de SMS."
  - icon: git
    title: feature.json
    text: "La fonctionnalité active est celle de .specify/feature.json. La branche git ne la change pas."
  - icon: eye
    title: Cinq oui
    text: "On accepte quand les cinq tiennent. Un secret ou un numéro public arrête tout le morceau."
pitfall: "Relire le diff avec une ancienne spec, ou accepter une clé à côté d'une phrase des 18 h juste."
remember: "Grille : spec.md de .specify/feature.json. 13e refusé, pas de téléphone, 18 h, pas de paiement, pas de secret."
```
