---
title: "Garder l'éditeur à côté du terminal"
description: "Laisser Claude Code agir dans le terminal, utiliser l'éditeur pour lire le diff et corriger une ligne, sans mener deux agents sur les mêmes fichiers."
duration: 50
objectives:
  - "Garder Claude Code comme session qui agit dans le terminal"
  - "Utiliser l'éditeur pour lire le diff et corriger une ligne à la main"
  - "Relancer dans le terminal le test nommé après une correction manuelle"
  - "Éviter deux agents en même temps sur les fichiers de Sève"
---

# La session qui agit

Léa Vernet mène App Sève avec Claude Code dans le terminal. C'est cette session qui agit : elle propose les modifications, lance le test nommé, montre `git diff`, prépare un `git add` ciblé. Atelier Sève est à Lyon Croix-Rousse. Le samedi va de 10 h à 13 h, 8 places, 45 €. L'attente s'arrête à 12 personnes. La confirmation se décide avant 18 h la veille.

L'éditeur est ouvert à côté. Il affiche `reservation.js`. Il ne devient pas une seconde session qui réécrit le projet pendant que le terminal travaille. Léa sait lequel des deux a la main.

Les quatre incréments restent ceux du terminal : la liste des 12 stages, le refus de la 9e place, l'attente, puis l'heure de 18 h. L'éditeur ne les répartit pas autrement.

# Lire le diff des deux côtés

`git diff` dans le terminal reste le texte de la décision. L'éditeur montre le même fichier avec les lignes en regard, ce qui aide à voir le signe.

```text
if (inscrits > 8) refuser()
```

Huit inscrits : la condition est fausse, la 9e personne entre. Léa le voit dans l'éditeur, puis elle le retrouve dans la sortie du terminal. Si les deux affichages divergent, elle se fie au fichier enregistré et à `git diff`, pas à un aperçu resté en mémoire.

Le mois éclaire la lecture : 12 stages, remplissage d'environ 70 %, 3 absents parce qu'un SMS a été oublié. Ces repères ne se corrigent pas « dans la marge » de l'éditeur sans test. Une note personnelle peut rester ouverte. Elle ne remplace pas la ligne de code.

# Corriger une ligne à la main

Parfois la correction est d'un signe. Léa la fait dans l'éditeur, enregistre, et revient au terminal.

```text
if (inscrits >= 8) refuser()
```

Avec 8 inscrits, la 9e demande est refusée. C'est la règle de l'incrément. Elle dit à la session ce qu'elle a changé : « J'ai remplacé > par >= dans reservation.js. Relance le test : la 9e place est refusée. Ne réécris pas cette ligne. »

Sans cette phrase, le tour suivant peut restaurer `>` en croyant que le fichier d'avant est encore le bon. La main et la session se succèdent. Elles ne s'ignorent pas.

```diagram
type: sequence
title: "Ligne corrigée, test relancé"
actors: ["Léa", "Éditeur", "Claude Code"]
messages:
  - from: 0
    to: 1
    text: "Remplace > par >= et enregistre"
  - from: 0
    to: 2
    text: "Annonce la ligne et demande le test"
  - from: 2
    to: 0
    text: "Affiche la 9e place refusée, ou le rouge"
```

Après la sortie, elle relit `git diff` dans le terminal. L'éditeur a servi à corriger. La session a servi à vérifier. Le commit attend les deux.

# Deux agents, les mêmes fichiers

Un second agent dans l'éditeur, lancé en même temps que Claude Code sur `reservation.js` et `verifier.js`, écrit dans les mêmes lignes. L'un pose `>=`. L'autre remet `>` ou déplace le test. Léa ne sait plus quelle sortie correspond à quel texte.

Elle mène un seul agent sur ces fichiers. Claude Code reste celui qui agit. L'éditeur sert à lire et à une correction manuelle, faite par Léa, pas par un autre agent. Si un agent de l'éditeur est déjà en train d'écrire, elle le stoppe avant de continuer dans le terminal. Elle attend que les fichiers soient stables, puis elle relance le test nommé.

Le même partage vaut pour `.claude/settings.json`, `.mcp.json` et le message de commit. Deux agents qui « améliorent » le hook ou le tableau des stages en parallèle produisent un diff que personne n'a relu. `/mcp` et le test se lancent depuis la session du terminal, une fois le fichier calme.

# Revenir au terminal pour conclure

La correction manuelle n'est pas la fin de l'incrément. Léa revient à Claude Code et demande la commande du test. Elle lit le rouge ou le vert. « la 9e place est refusée » avec 8 inscrits est le vert qui compte pour ce refus. Un fichier simplement enregistré ne le prouve pas.

Elle enchaîne avec `git status` et `git diff`. Si `.env` apparaît, elle refuse `git add .`, comme sur la branche de l'incrément. L'éditeur ne doit pas avoir enregistré un jeton dans un fichier suivi. Les 3 absents du SMS ne se règlent pas en collant une clé au bas de `reservation.js`.

Quand la ligne, le test et le diff concordent, la session prépare le commit sur la branche du but, par exemple `seve/refus-9e-place`. L'éditeur peut rester ouvert sur le fichier pour une dernière lecture. Il ne committe pas de son côté pendant que le terminal prépare le message.

# Une seule main à la fois

La journée type tient en un va-et-vient court. Le terminal propose. L'éditeur aide à voir. Léa corrige une ligne si le signe est faux. Elle le dit. Le terminal relance le test et montre le diff. Un seul agent écrit.

Si elle est tentée d'ouvrir un second agent « pour la liste pendant que le refus avance », elle ouvre plutôt la branche suivante plus tard. Les 12 stages à 45 € et le refus de la 9e place ne se font pas dans deux agents sur les mêmes fichiers au même moment. L'attente de 12 et la décision de 18 h attendront leur tour, chacune avec la session du terminal.

L'éditeur à côté est une aide de lecture et de précision. La session qui agit reste Claude Code.

# Exercices

## Exercice 1 : Deux écritures en parallèle

Claude Code modifie `reservation.js` dans le terminal. Léa lance en même temps un agent dans l'éditeur sur ce fichier, pour « aller plus vite » sur le prix de 45 €. Que doit-elle faire ?

<details>
<summary>Voir la solution</summary>

Elle arrête le second agent. Un seul agent écrit sur `reservation.js` à la fois. Claude Code reste la session qui agit. L'éditeur redevient l'endroit où elle lit.

Le prix de 45 € et le refus de la 9e place ne se corrigent pas en parallèle sur le même fichier. Elle attend des fichiers stables, puis elle relance dans le terminal le test de l'incrément en cours.

</details>

## Exercice 2 : Le signe corrigé à la main

Léa voit `if (inscrits > 8)` dans l'éditeur. Elle le remplace par `if (inscrits >= 8)`, elle enregistre. Quelle suite donne-t-elle au terminal ?

<details>
<summary>Voir la solution</summary>

Elle annonce la correction : le signe est maintenant `>=`, la session ne doit pas réécrire l'ancienne ligne. Elle demande le test « la 9e place est refusée » avec 8 inscrits, puis elle lit la sortie.

Un vert sur ce test, confirmé par `git diff`, permet de préparer le commit. Un enregistrement sans test laisse l'incrément ouvert. Le samedi 10 h-13 h à Croix-Rousse ne change pas cette vérification.

</details>

## Exercice 3 : Une clé collée dans l'éditeur

En relisant le diff dans l'éditeur, Léa trouve au bas de `reservation.js` une ligne `SMS_TOKEN=...`, ajoutée pour les 3 absents du mois. Le test des 8 places est vert. Peut-elle laisser le terminal committer ?

<details>
<summary>Voir la solution</summary>

Non. Elle efface la ligne dans l'éditeur, ou elle demande à la session de la retirer, pas les deux en même temps. Elle enregistre, elle vérifie que `git diff` ne montre plus le jeton, puis elle relance le test nommé.

Les 3 absents expliquent un SMS oublié. Ils ne placent pas un secret dans le fichier. Le remplissage d'environ 70 % non plus. Le commit de `seve/refus-9e-place` attend un diff sans secret, avec `>=` et le test vert.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "L'éditeur à côté du terminal"
center: "Claude Code agit dans le terminal. L'éditeur sert à lire et à une ligne."
points:
  - icon: terminal
    title: "Une session"
    text: "Claude Code propose, lance le test nommé et montre git diff."
  - icon: eye
    title: "Lire à côté"
    text: "L'éditeur aide à voir le signe. git diff dans le terminal tranche."
  - icon: ruler
    title: "Une ligne à la main"
    text: "Léa passe de > à >=, enregistre, puis dit à la session de ne pas y revenir."
  - icon: test
    title: "Retour au test"
    text: "Le test « la 9e place est refusée » se relance dans le terminal."
  - icon: users
    title: "Un seul agent"
    text: "Deux agents sur reservation.js en même temps mêlent des lignes contradictoires."
pitfall: "Laisser un agent dans l'éditeur réécrire le fichier pendant que Claude Code le modifie."
remember: "Une main à la fois. La ligne manuelle revient au terminal pour le test et le diff."
```
