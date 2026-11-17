---
title: Poser des hooks de contrôle
description: "Déclarer dans settings.json une commande lancée au bon moment du cycle, pour refuser rm -rf ou rappeler le test des 8 places d'Atelier Sève."
duration: 50
objectives:
  - "Situer PreToolUse, PostToolUse et Stop dans le cycle de la session"
  - "Choisir le settings.json partageable du projet ou celui de la machine"
  - "Faire refuser une commande destructrice et rappeler le test des 8 places"
  - "Tenir le hook dans ce rôle, sans script qui élargit les dégâts"
---

# Une commande au moment juste

Léa Vernet tient Atelier Sève, à Lyon Croix-Rousse. L'app Sève réserve le stage du samedi, de 10 h à 13 h, à 45 €, pour 8 places. Dans le terminal, Claude Code peut proposer une commande. Un hook est une commande lancée à un moment du cycle, avant que Léa ait à tout surveiller à la main.

Le moment est fixé d'avance. `PreToolUse` part avant un outil, par exemple avant Bash. `PostToolUse` part après un outil qui a réussi. `Stop` part quand l'agent achève sa réponse. La commande reçoit le contexte de l'événement et peut répondre. Elle laisse à Léa la lecture du test et celle du diff.

Pour Sève, deux rôles suffisent. Avant Bash, refuser une ligne qui contient `rm -rf`. À l'arrêt, rappeler de lancer le test des 8 places, celui qui vérifie que la 9e place est refusée. Le catalogue des événements est dans la [référence des hooks](https://code.claude.com/docs/en/hooks).

# Où déclarer le hook

Le hook se déclare dans `settings.json`, sous la clé `hooks`. Deux emplacements comptent.

Le fichier du projet, `.claude/settings.json`, vaut pour ce dépôt. Il se partage : on peut le committer, et une autre personne qui ouvre App Sève obtient le même garde-fou. Le refus de `rm -rf` y a sa place, parce que la règle concerne le projet.

Le fichier personnel, `~/.claude/settings.json`, vaut pour les sessions de cette machine. Il ne voyage pas avec le dépôt. Un rappel lié au portable de Léa, avec un chemin qui n'existe qu'ici, reste dans ce fichier. Sur Windows, `~` désigne le dossier utilisateur.

Les deux fichiers s'ajoutent. Retirer le hook du dépôt laisse celui de la machine en place. `.claude/settings.local.json` sert aux réglages locaux du projet : la règle commune, elle, reste dans le fichier partageable.

# Avant Bash, après l'outil, à l'arrêt

`PreToolUse` avec le filtre `Bash` ne regarde que le shell. Le filtre évite de lancer la commande du hook à chaque lecture de fichier. `Stop` ne filtre pas un nom d'outil : il se lance à chaque fin de réponse.

```diagram
type: flow
title: "Le cycle utile pour Sève"
steps:
  - title: "PreToolUse"
    text: "Avant Bash. La commande peut refuser rm -rf."
    tone: rose
  - title: "Outil"
    text: "La ligne part, ou elle n'a pas été lancée."
    tone: amber
  - title: "PostToolUse"
    text: "Après un succès. Le fichier est déjà modifié."
    tone: teal
  - title: "Stop"
    text: "La réponse s'achève. Rappel du test des 8 places."
    tone: violet
```

`PostToolUse` constate. Il peut noter que `reservation.js` a changé. Il ne revient pas en arrière. Si la 9e place passerait encore, le rappel et le test restent à faire. Une ligne de journal écrite après coup ne refuse pas l'inscription.

La commande de `PreToolUse` reçoit du JSON sur son entrée standard, dont le texte de la ligne Bash. La référence décrit aussi le code de sortie 2, qui bloque. Pour Sève, on retient le rôle : refuser avec une raison, ou rappeler le test.

# Le garde-fou dans settings.json

Dans `.claude/settings.json`, Léa nomme deux commandes. Les noms disent le rôle. On n'y ajoute pas d'autre action.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/refus-destructif.js"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/rappel-huit-places.js"
          }
        ]
      }
    ]
  }
}
```

`refus-destructif.js` regarde la commande proposée. Si le texte contient `rm -rf`, la réponse est un refus et une raison courte : « Commande rm -rf refusée pour App Sève ». Les autres lignes suivent les permissions habituelles de la session. On décrit ce refus. On ne dépose pas un script qui contourne un contrôle ou qui efface plus large.

`rappel-huit-places.js` parle à la fin du tour. Il rappelle de lancer le test : la 9e place est refusée. Huit places prises, la personne suivante n'entre pas. Le rappel n'inscrit pas le résultat du test à la place de Léa.

La forme du refus, quand on la montre, reste une décision lisible.

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Commande rm -rf refusée pour App Sève"
  }
}
```

# Ce que le hook ne clôt pas

Le hook protège un moment. Les incréments de l'app restent les quatre prévus : la liste des stages, le refus de la 9e place, l'attente limitée à 12 personnes, puis la confirmation décidée avant 18 h la veille.

Un `Stop` qui affiche le rappel alors que le test est rouge laisse l'incrément ouvert. Un `PreToolUse` qui laisse passer `rm -rf` parce que le texte cherché est mal écrit laisse le dépôt exposé. Léa vérifie le refus sur une commande d'essai, et elle lit la raison. Elle ne lance pas un effacement réel du dossier pour « voir si ça marche ».

Le mois de l'atelier compte 12 stages, un remplissage d'environ 70 % et 3 absents parce qu'un SMS a été oublié. Ces repères disent pourquoi les règles métier comptent. Le hook n'envoie pas ce SMS et ne stocke pas de jeton.

# Tenir la règle dans le dépôt

Avant de committer `.claude/settings.json`, Léa relit le diff de ce fichier. Elle y cherche la règle commune. Un chemin vers son seul portable, ou un secret, n'y a pas sa place. La commande partagée doit pouvoir tourner sur une autre machine du projet.

Elle ouvre ensuite une session. Elle propose une ligne Bash qui contient `rm -rf` suivi d'un nom fictif. Le refus doit apparaître avant l'exécution. Elle laisse ensuite le tour s'achever et lit le rappel du test des 8 places. Si l'un des deux manque, elle corrige la déclaration. Elle n'élargit pas les permissions pour faire avancer la session.

La page des hooks reste la référence des champs. Le rôle, pour App Sève, tient en une phrase : refuser la destruction, rappeler la règle des 8 places, laisser Léa lire la sortie.

# Exercices

## Exercice 1 : Choisir le fichier

Léa veut que toute personne qui clone App Sève refuse `rm -rf` avant Bash. Elle veut aussi, uniquement sur son portable, un rappel quand la session s'arrête. Où déclare-t-elle chaque hook ?

<details>
<summary>Voir la solution</summary>

Le refus de `rm -rf` va dans `.claude/settings.json`, parce que la règle se partage avec le dépôt. Le rappel lié à sa machine va dans `~/.claude/settings.json`.

Un chemin de portable dans le fichier du projet cassera le hook ailleurs. Un refus présent seulement dans le fichier personnel laissera les autres clones sans ce garde-fou. Les deux fichiers s'ajoutent : les deux rôles n'ont pas à tenir dans un seul JSON.

</details>

## Exercice 2 : Lire un refus

La session propose `rm -rf ./donnees-stages`. Le hook répond avant l'exécution : refus, raison « Commande rm -rf refusée pour App Sève ». Le test des 8 places n'a pas été lancé. L'incrément du refus de la 9e place est-il terminé ?

<details>
<summary>Voir la solution</summary>

Non. Le hook a tenu son rôle : la commande destructrice n'a pas tourné. L'incrément se termine quand Léa a lu le test « la 9e place est refusée », vert, pour 8 places déjà prises.

Le rappel à l'arrêt, s'il s'affiche, redit de lancer ce test. Il n'en affiche pas le résultat. Léa le demande dans la session. Elle ne retire pas le hook pour aller plus vite, et elle ne lance pas l'effacement pour observer.

</details>

## Exercice 3 : Un hook qui en fait trop

Un script proposé efface d'abord les fichiers dont le nom contient « test », puis refuse `rm -rf`. L'auteur parle d'un nettoyage avant le contrôle. Que garde Léa, et qu'écarte-t-elle ?

<details>
<summary>Voir la solution</summary>

Elle garde le rôle : avant Bash, refuser une commande qui contient `rm -rf`, avec une raison lisible. Elle écarte le script qui efface des fichiers. Un hook de contrôle ne prépare pas des dégâts, même sous le mot nettoyage.

Le rappel du test des 8 places reste une commande séparée, sur `Stop`, qui affiche une phrase. Il n'écrit pas dans le dossier des stages. La déclaration dans `.claude/settings.json` nomme ces deux rôles, et le diff de ce fichier doit se relire sans surprise.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Poser des hooks de contrôle"
center: "Une commande au bon moment : refus avant Bash, rappel à l'arrêt."
points:
  - icon: terminal
    title: "Trois moments"
    text: "PreToolUse avant Bash, PostToolUse après l'outil, Stop quand la réponse s'achève."
  - icon: file
    title: "Deux settings.json"
    text: "Le fichier .claude du projet se partage. Celui de ~/.claude reste sur la machine."
  - icon: shield
    title: "Refus de rm -rf"
    text: "La commande destructrice est refusée avec une raison. Le reste suit les permissions."
  - icon: test
    title: "Rappel des 8 places"
    text: "À l'arrêt, le hook rappelle le test : la 9e place est refusée."
  - icon: eye
    title: "Rôle tenu"
    text: "On explique la décision attendue. On ne dépose pas un script qui efface."
pitfall: "Committer un chemin personnel dans .claude/settings.json, ou croire que le rappel clôt le test."
remember: "Le hook refuse ou rappelle. Léa lit encore la 9e place et le diff d'App Sève."
```
