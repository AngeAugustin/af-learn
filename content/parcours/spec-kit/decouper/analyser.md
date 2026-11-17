---
title: "Analyser avant de coder"
description: "Lancer /speckit-analyze en lecture seule, corriger conflits, trous et flous à la source, et ne pas coder sur un rapport rouge."
duration: 50
objectives:
  - "Lire un rapport de /speckit-analyze sans qu'il modifie les fichiers"
  - "Reconnaître un conflit, un trou et un flou entre spec, plan et tâches"
  - "Corriger à la source, souvent la spec, puis relancer"
  - "Refuser d'implémenter tant que le rapport reste rouge"
---

# Un rapport, aucun fichier modifié

Léa Vernet, Atelier Sève, Lyon Croix-Rousse. Samedi 10 h-13 h, 8 places, 45 €, attente max 12, décision avant 18 h la veille. 12 stages par mois, remplissage 70 %, 3 absents (SMS oublié). La liste des stages et le refus de la 9e place sont déjà en place. `tasks.md` vient d'être écrit pour l'attente.

`/speckit-analyze` se lance dans le chat, après les tâches, avant le code. Le skill de GitHub Spec Kit est en lecture seule. Il lit `spec.md`, `plan.md` et `tasks.md`. Il rend un rapport. Il ne corrige pas ces fichiers. Il n'écrit pas l'application.

Vous le reconnaissez à cela : après le passage, les trois fichiers ont les mêmes phrases qu'avant. S'ils ont changé, le skill a quitté son rôle. Vous écartez cette modification et vous relisez le rapport, pas un diff discret.

La fonctionnalité examinée est celle de `.specify/feature.json`. Un rapport sur une autre spec ne protège pas l'attente.

> [!IMPORTANT]
> Analyser ne modifie ni la spec, ni le plan, ni les tâches. Le rapport se lit. La correction vient après, de vous, dans le fichier qui possède le fait.

# Conflit, trou, flou

Le rapport signale trois familles d'écarts entre les artefacts.

Un conflit : deux fichiers ne disent pas le même fait. La spec dit 8 places, le plan en dit un autre nombre. Ou `tasks.md` envoie un SMS alors que la spec le laisse hors champ.

Un trou : un comportement promis n'a pas de phrase, ou une phrase n'a pas de tâche. La spec promet « 3 personnes en attente » et aucune tâche ne l'affiche. Ou une tâche parle d'un écran que la spec ne nomme pas.

Un flou : la phrase existe, et on ne peut pas la vérifier. « Prévenir assez tôt » au lieu de « avant 18 h la veille ». « Afficher l'attente » sans dire si les téléphones y sont.

Le rapport peut proposer une piste. La piste n'est pas appliquée toute seule. Vous choisissez le fichier, vous écrivez la phrase, vous relancez. Vous ne dites pas « applique et code ».

# Le plan dit 10, la spec dit 8

Cas net. `spec.md` dit 8 places. `plan.md` dit 10 places. Le rapport doit le signaler comme un conflit. 10 n'est pas une précision. C'est un autre atelier.

La source du nombre, pour Léa, est la spec : 8 places, déjà tenues par le refus de la 9e place. Vous corrigez le plan pour qu'il redise 8. Vous ne lancez pas l'implémentation « sur 10, on verra ». Un code à 10 places fabriquerait une 9e et une 10e place assises, ce que la règle interdit déjà.

Si la spec disait à la fois « 8 places » et « une dizaine de sièges », le flou est dans la spec. Vous n'y laissez qu'un nombre, 8. Le plan se réaligne ensuite. Le prix 45 €, le samedi 10 h-13 h, le plafond de 12 noms suivent la même discipline : un fait, une phrase, les trois fichiers d'accord.

```diagram
type: decision
title: "Que faire du rapport"
nodes:
  - question: "Le rapport signale-t-il encore un conflit, un trou ou un flou ?"
    yes: "Le rapport est rouge. On corrige le fichier source. On ne lance pas implement."
    no: "Le rapport est propre. L'implémentation peut s'ouvrir, phase par phase."
  - question: "Le plan dit 10 places alors que la spec dit 8 ?"
    yes: "On ramène le plan à 8. On ne code pas 10 places pour « tester »."
    no: "S'il reste un trou, souvent dans la spec, on écrit la phrase manquante, puis on relance."
```

# Corriger la source

Vous corrigez le fichier qui possède le fait. Souvent, c'est la spec. Un trou sur les téléphones, un flou sur l'heure, une tâche SMS qui revient : la phrase manquante ou la phrase de trop vit d'abord dans `spec.md`. Le plan et les tâches s'alignent après.

Parfois la spec est nette et le plan a dérivé, comme pour les 10 places. Vous corrigez le plan. Parfois `tasks.md` a perdu l'ordre : refus du 13e nom, puis « 3 personnes en attente » sans téléphones, puis la phrase des 18 h. Si la spec dit déjà cet ordre, vous relancez `/speckit-tasks`. Si la spec ne le dit pas, vous l'y écrivez d'abord.

Vous ne corrigez pas dans le code pour « trancher le rapport ». Le code n'est pas une quatrième spec. Un écran à 10 places ne départage pas le plan et la spec. Il ajoute un troisième avis.

Les 3 absents et le remplissage de 70 % restent le problème, pas une tâche. Si le rapport voit un trou « envoi de SMS », ce trou se ferme en mettant l'envoi hors champ dans la spec, pas en le planifiant.

> [!TIP]
> Un conflit se tranche dans l'artefact qui a tort. Le nombre de Léa, 8 places, ne se tranche pas dans le code.

# Relancer le skill

Après la correction, vous renvoyez `/speckit-analyze` dans le chat. Le nouveau rapport repart des fichiers tels qu'ils sont. L'ancien rapport ne se barre pas au stylo. Une correction non relue peut en ouvrir une autre : en ramenant le plan à 8, vous découvrez qu'une tâche parlait encore de 10 sièges.

Vous relancez aussi le skill qui possède le fichier, quand il le faut. Un trou d'exigence retourne à la spec, souvent via la clarification. Un plan faux retourne au plan. Des tâches désordonnées retournent à `/speckit-tasks` une fois la spec nette. Analyser, lui, ne fait que relire.

Vous continuez jusqu'à un rapport sans conflit, sans trou bloquant, sans flou sur les règles de Léa. 8 places, 45 € affichés, 12 noms, 13e refusé, compte public sans téléphone, phrase des 18 h, pas d'envoi, pas de paiement. Chaque ligne se retrouve dans les trois fichiers, ou elle est explicitement hors champ.

# Un rapport rouge arrête le code

Tant qu'un conflit, un trou ou un flou reste dans le rapport, vous le traitez comme un rapport rouge. Vous n'implémentez pas. `/speckit-implement` sur un rapport rouge fige le désaccord dans le dépôt. Revenir en arrière coûtera plus cher que la phrase que vous n'avez pas écrite.

Le cas des 10 places est le modèle. Le plan et la spec ne sont pas d'accord. Le rapport l'a dit. Coder 10, ou coder 8 « en espérant », laisse le plan faux ou la spec fausse. Vous corrigez, vous relancez l'analyse, vous attendez un rapport propre.

Un rapport propre n'est pas une permission d'ajouter le SMS « tant qu'on y est ». Il dit que les trois artefacts parlent de la même attente. La suite, c'est cette attente-là : le 13e nom, le compte, la phrase des 18 h.

> [!WARNING]
> On n'implémente pas sur un rapport rouge. 10 places dans le plan et 8 dans la spec : on corrige, on relance, on ne code pas le conflit.

# Exercices

## Exercice 1 : Dix places dans le plan

`spec.md` dit 8 places. `plan.md` dit 10 places. `/speckit-analyze` signale le conflit et propose de « retenir 10, plus confortable pour le remplissage de 70 % ». Le skill n'a modifié aucun fichier. Que faites-vous ?

<details>
<summary>Voir la solution</summary>

Vous gardez le rapport comme une lecture, et vous corrigez le plan : 8 places, pas 10. Le remplissage de 70 % n'autorise pas deux places de plus. La 9e place assise est déjà refusée.

Vous ne lancez pas `/speckit-implement` sur ce rapport rouge. Vous renvoyez `/speckit-analyze`. Vous n'appliquez pas la piste « retenir 10 ». La spec reste la source du nombre. 45 €, le samedi 10 h-13 h et le plafond de 12 ne se négocient pas dans la même phrase.

</details>

## Exercice 2 : Un trou sur les téléphones

Le rapport dit : la spec promet un affichage de l'attente, aucune phrase n'interdit les téléphones, et `tasks.md` demande « montrer les numéros pour que Léa copie ». Les fichiers n'ont pas été modifiés par le skill. Où corrigez-vous ?

<details>
<summary>Voir la solution</summary>

Souvent la source est la spec. Vous y écrivez que la page publique affiche un compte, « 3 personnes en attente » quand trois personnes patientent, sans téléphone et sans liste de noms. L'ordre des noms reste sur l'écran de Léa.

Vous ne codez pas les numéros pour « fermer le trou ». Vous relancez `/speckit-tasks` pour que la tâche perde les téléphones, puis `/speckit-analyze`. Le rapport suivant doit voir l'interdit, pas une page d'annuaire.

</details>

## Exercice 3 : Le skill a modifié la spec

Vous aviez demandé une analyse. Au retour, `spec.md` dit 10 places, et le rapport annonce que « c'est aligné ». `tasks.md` contient « brancher le SMS ». Comment reconnaissez-vous que le rôle n'a pas été tenu ?

<details>
<summary>Voir la solution</summary>

`/speckit-analyze` est en lecture seule. Une spec modifiée, un chiffre passé de 8 à 10, une tâche SMS apparue pendant l'analyse : le skill a quitté son rôle. Le rapport « aligné » ne vaut pas, il décrit des fichiers qu'il vient de tordre.

Vous revenez aux phrases d'avant. 8 places, pas de SMS. Vous corrigez à la source, vous relancez l'analyse, et vous n'implémentez pas tant que le rapport, sur les vrais fichiers, montre encore un conflit ou un trou.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Lire avant de coder
center: "Analyze est en lecture seule. On corrige la source, on relance, on ne code pas un rapport rouge."
points:
  - icon: search
    title: Lecture seule
    text: "/speckit-analyze signale les écarts entre spec, plan et tâches. Il n'écrit pas ces fichiers."
  - icon: scale
    title: Trois écarts
    text: "Conflit, trou ou flou. « Assez tôt » et « afficher l'attente » ne se vérifient pas."
  - icon: alert
    title: 10 contre 8
    text: "Le plan dit 10 places, la spec dit 8. On ramène le plan à 8. On ne code pas 10."
  - icon: file
    title: À la source
    text: "Souvent on corrige la spec. Le code n'est pas un quatrième avis qui départage les fichiers."
  - icon: loop
    title: Relancer
    text: "Après la correction, on relance le skill. L'ancien rapport ne se barre pas au stylo."
pitfall: "Lancer l'implémentation alors que le plan dit 10 places et la spec 8."
remember: "Rapport rouge : on corrige la source, souvent la spec, on relance. On n'implémente pas dessus."
```
