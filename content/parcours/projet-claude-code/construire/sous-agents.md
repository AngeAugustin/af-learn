---
title: "Déléguer à un sous-agent"
description: "Envoyer une exploration large à un sous-agent au contexte séparé, lire le résumé qu'il renvoie, et ne pas le prendre pour le diff."
duration: 50
objectives:
  - "Distinguer un sous-agent, son contexte propre, et le résumé renvoyé à la session"
  - "Choisir Explore, Plan ou general-purpose selon la tâche déléguée"
  - "Déléguer la question « où est calculé le nombre de places ? » sans faire écrire"
  - "Lire le diff vous-même, le résumé ne le remplace pas"
---

# Un contexte à part

Un sous-agent est un assistant lancé dans la session, avec son propre contexte. Il fait la tâche déléguée et renvoie un résumé à la conversation principale. Les fichiers ouverts pendant la recherche restent de son côté. Votre session garde le résumé, pas le cheminement.

C'est pour cela qu'on lui confie une question large. « Où est calculé le nombre de places ? » peut ouvrir beaucoup de fichiers. Collés dans la session principale, ils ne laissent plus de place à la modification qui suivra, ni à la sortie du test. Le sous-agent protège ce contexte. Il ne décide pas à votre place.

Il reste dans la session qui l'a lancé. Vous ne discutez pas avec lui dans un deuxième terminal. Le résumé revient ici. C'est aussi pour cela que vous ne le traitez pas comme une preuve : vous n'avez pas vu les lectures une par une.

# Trois sous-agents intégrés

Le glossaire en nomme trois, intégrés : Explore, Plan, et general-purpose.

- **Explore** parcourt le dépôt en lecture. Il convient à une question du type « où ? ». Vous lui demandez de ne modifier aucun fichier.
- **Plan** cherche pour préparer un plan, dans le même esprit que le mode plan : comprendre avant d'écrire.
- **general-purpose** porte une tâche plus large, et il peut modifier. Il est trop ouvert pour une question qui ne demandait qu'un emplacement.

Pour le nombre de places, vous nommez Explore. Plan si vous préparez encore un plan et qu'il faut cartographier le dépôt. general-purpose seulement si vous voulez vraiment une tâche faite à part, en sachant qu'il peut écrire, et que le diff sera alors obligatoire.

# La question sur les places

Vous posez une question bornée. Elle ne contient pas l'ordre de corriger.

```text
Délègue à un sous-agent Explore, sans modifier de fichier :
où le nombre de places est-il écrit ou calculé ?
Réponds avec les chemins et les lignes, rien d'autre.
```

Le brief dit 8 places, une attente de 12, un samedi 10 h-13 h à la Croix-Rousse. L'exploration dit où ces nombres vivent dans le dépôt. Elle ne choisit pas un nouveau chiffre. « Et corrige si ce n'est pas 8 » transformerait la recherche en édition, dans un contexte que vous ne lisez pas au fur et à mesure.

Si la question est floue (« regarde un peu le projet »), le sous-agent remplit son contexte pour rien, et le résumé aussi. Vous nommez le fait cherché : le nombre de places, pas « tout ce qui parle de Sève ».

```diagram
type: sequence
title: "Une exploration qui ne remplit pas la session"
actors: ["Vous", "Session", "Explore"]
messages:
  - from: 0
    to: 1
    text: "Où est calculé le nombre de places ? Sans écriture."
  - from: 1
    to: 2
    text: "Sous-agent Explore, son propre contexte."
  - from: 2
    to: 1
    text: "Résumé : chemins et lignes, pas le récit de la recherche."
  - from: 1
    to: 0
    text: "Le résumé arrive dans la session principale."
  - from: 0
    to: 1
    text: "Je lis le diff et le fichier cité. Le résumé ne suffit pas."
```

# Le résumé qui revient

La session principale reçoit une réponse courte : des chemins, des lignes, parfois le nom d'une constante. Vous continuez sans les lectures intermédiaires. Si le résumé dit « quelque part dans la config », vous redemandez le fichier et la ligne, toujours sans édition. Vous ne recommencez pas la recherche vous-même dans le fil principal : vous rempliriez le contexte que vous venez de protéger.

Vous confrontez le résumé au brief. Une ligne qui fixe 8 places est cohérente avec Léa. Une ligne qui fixe 10, ou qui mélange les 8 places et les 12 de l'attente, est une trouvaille, pas une autorisation de changer la règle. Le chiffre juste reste celui de `docs/brief.md`.

# Le résumé ne remplace pas le diff

Un résumé n'est pas un diff. Si des fichiers ont changé, vous lisez le diff dans le terminal, fichier par fichier, avant l'objectif suivant. Explore ne devait pas écrire. Un changement quand même se regarde. Il ne se croit pas sur la phrase « j'ai mis les places à 8 ». La ligne peut dire 10. Le résumé peut se tromper de numéro de ligne. Vous ouvrez le fichier cité.

La même règle vaut après une modification que vous avez demandée, vous, dans la session principale. Le résumé vous a dit où regarder. Le diff vous dit ce qui a été écrit. Vous le lisez avant de lancer la commande de vérification, et vous lisez la sortie après. Les 12 stages, le refus de la 9e place, l'attente, les 18 h : aucune de ces preuves ne se délègue.

> [!WARNING]
> Un sous-agent qui annonce avoir « aligné » les places sur 8 a peut-être aligné un autre nombre : les 12 de l'attente, ou les 12 stages du mois. Le diff montre lequel. Le résumé non.

# Ce qui reste votre geste

Vous ne déléguez pas la décision « le refus de la 9e place est-il vrai ? ». Cette observation se fait sur l'appli lancée, par vous. Vous déléguez la recherche large. Vous gardez la preuve.

Vous ne déléguez pas non plus la lecture des permissions. La demande s'affiche dans la session principale, et c'est vous qui dites oui ou non. Un résumé qui dirait « j'ai accepté les commandes nécessaires » n'est pas un accord. Enfin, vous ne déléguez pas le hors-périmètre : aucun sous-agent n'a mandat d'ajouter un paiement parce qu'il a vu 45 € quelque part.

# Exercices

## Exercice 1 : La question large

Vous voulez savoir où le nombre de places est calculé, avant de toucher au refus de la 9e inscription. La session principale doit rester disponible pour l'édition et pour le test. Écrivez la demande.

<details>
<summary>Voir la solution</summary>

Vous demandez un sous-agent Explore, sans modification : où le nombre de places est écrit ou calculé, réponse limitée aux chemins et aux lignes.

Vous ne demandez pas de corriger, ni de passer à 10, ni d'ouvrir le paiement. La correction, si le fichier dit autre chose que 8, se fera ensuite dans la session principale, après votre lecture du fichier cité. Plan serait pour préparer un plan. general-purpose pourrait écrire : ce n'est pas le bon choix pour cette question.

</details>

## Exercice 2 : Un résumé trop rassurant

Le résumé dit : « Les places sont dans la config, je les ai mises à 8, c'est aligné avec Léa. » Vous n'avez pas demandé d'écriture. Que faites-vous avant de continuer le refus de la 9e place ?

<details>
<summary>Voir la solution</summary>

Vous ouvrez le diff. Le résumé ne le remplace pas. Vous vérifiez quel nombre a bougé : les 8 places du stage, les 12 de l'attente, ou les 12 stages. Vous vérifiez qu'aucun paiement n'est apparu.

Si le diff contredit le résumé, c'est le diff qui commande. Explore ne devait rien modifier : un fichier touché se relit, ligne à ligne, avant tout nouvel objectif. Vous ne lancez pas le test du refus sur un chiffre que vous n'avez pas vu.

</details>

## Exercice 3 : Un renommage sous les yeux

Le fichier est déjà ouvert. Vous voulez renommer une variable sur une ligne, dans la session principale, pour que le test des 8 places reste lisible. Faut-il un sous-agent ?

<details>
<summary>Voir la solution</summary>

Non. La modification est petite, locale, et vous avez le fichier. Un sous-agent ajouterait un contexte et un résumé pour un geste que vous pouvez suivre ici, permission comprise.

Vous gardez Explore pour la question large, celle qui ouvrirait trop de fichiers dans la session. Ici, vous faites le renommage dans le fil principal, vous lisez le diff de cette ligne, puis vous lancez la commande de vérification des 8 places.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Déléguer l'exploration
center: "Un sous-agent a son contexte et renvoie un résumé. Explore cherche les places. Le diff se lit ici."
points:
  - icon: layers
    title: Contexte à part
    text: "La recherche large reste dans le sous-agent. La session principale ne reçoit que le résumé."
  - icon: search
    title: Explore
    text: "Pour « où est calculé le nombre de places ? ». Sans écriture. Plan et general-purpose ont d'autres rôles."
  - icon: chat
    title: Le résumé
    text: "Chemins et lignes. S'il est vague, on redemande le fichier, on ne refait pas la recherche ici."
  - icon: eye
    title: Le diff
    text: "Un fichier modifié se lit dans le diff. « J'ai mis 8 » peut viser l'attente ou les stages."
  - icon: shield
    title: Votre preuve
    text: "Le refus, la liste, les permissions et le paiement restent des gestes de la session principale."
pitfall: "Croire le résumé qui annonce 8 places, sans ouvrir le diff, alors qu'un autre nombre a été modifié."
remember: "On délègue la recherche large pour garder la session légère. On ne délègue pas la lecture du diff."
```
