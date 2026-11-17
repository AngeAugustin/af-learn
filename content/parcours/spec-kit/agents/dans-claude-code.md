---
title: "Spec Kit dans Claude Code"
description: "Mener la même spec Sève dans une session Claude Code, avec les skills en slash, les permissions toujours demandées, et une constitution sans secret."
duration: 50
objectives:
  - "Ouvrir une session Claude Code dans le dépôt, clé claude"
  - "Invoquer /speckit-specify et les autres skills dans cette session"
  - "Laisser Claude demander ses permissions, y compris dans un workflow"
  - "Limiter l'invocation automatique des skills si la liste déborde, sans y mettre de secret"
---

# La session dans le dépôt

Vous vous placez dans le dépôt de l'Atelier Sève, puis vous ouvrez la session. Claude Code lit les fichiers de **ce** dossier : la liste du samedi 10 h-13 h, Lyon Croix-Rousse, le prix de 45 €, le refus de la neuvième place. La clé d'intégration est `claude`.

```bash
specify integration install claude
```

Sur un dossier qui naît :

```bash
specify init seve --integration claude
```

L'atelier a déjà du code. Vous installez dans le dépôt existant. Les skills arrivent dans `.claude/skills/`. Celui de la spécification est `.claude/skills/speckit-specify/SKILL.md`. Vous l'invoquez dans la session, pas dans le shell.

Les événements de Spec Kit passent par `.claude/settings.json`. C'est le fichier de réglage de la session pour ces hooks. Vous le relisez s'il change. Vous n'y collez pas de jeton, pas plus que dans la constitution.

# Le slash, le même geste

L'invocation est la même que dans Cursor : un slash, le nom du skill.

```text
/speckit-specify
Une personne sans place voit qu'elle est en attente, dans l'ordre d'arrivée.
Le 12e nom est accepté, le 13e est refusé. La page publique ne montre pas les téléphones.
Léa Vernet tranche avant 18 h la veille, et la phrase « avant 18 h » est à l'écran.
Déjà en place : liste, 8 places, 45 € affichés, refus de la 9e. Pas de SMS, pas de paiement.
```

Puis, après lecture de `spec.md` :

```text
/speckit-clarify
Focus : la phrase exacte des 18 h, l'ordre d'arrivée, et ce que la page publique montre (un compte, pas les téléphones).
```

Le slash ne change pas parce que l'agent change. Ce qui change, c'est l'endroit des fichiers (`.claude/skills/`) et le fait que la session demande encore l'autorisation d'agir. `.specify/feature.json` désigne la même fonctionnalité que dans Cursor. La spec ne se réécrit pas « en plus souple » parce que vous avez changé d'agent.

> [!NOTE]
> Douze stages par mois, remplissage autour de 70 %. La spec parle de l'attente et de la confirmation. Elle ne propose pas une neuvième chaise pour se rapprocher de la moyenne.

# Les permissions restent demandées

Un workflow Spec Kit, s'il lance Claude Code, utilise `claude -p`. Il peut transmettre un modèle, ou un format de sortie, selon le réglage. Il **n'ajoute pas** de drapeau qui désactive les permissions.

Vous voyez donc les demandes : lire un fichier, lancer un test, modifier `spec.md`. Vous les lisez. Une demande qui veut ouvrir un secret, envoyer un message, ou élargir les huit places se refuse. Le workflow n'a pas coupé cette étape pour vous. Vous ne la coupez pas non plus pour « finir le flux ».

```diagram
type: decision
title: "Une demande s'affiche dans la session"
nodes:
  - question: "La demande reste-t-elle dans la spec, le plan ou le test de l'attente ?"
    yes: "Vous l'acceptez pour cette action, puis vous relisez l'artefact."
    no: "Vous la refusez. Le workflow ne l'avait pas pré-approuvée."
```

> [!IMPORTANT]
> `claude -p` lance la session du workflow. Ce n'est pas une autorisation générale. Huit places, 45 €, attente de 12 : une commande qui les modifie se refuse, workflow ou pas.

# Quand la liste de skills déborde

Par défaut, les skills Spec Kit de Claude Code peuvent être invoqués par le modèle : leur description reste dans le contexte et compte dans la liste. Avec beaucoup de skills, d'autres disparaissent de cette liste.

Vous limitez alors les skills de Spec Kit à l'invocation humaine :

```bash
specify init seve --integration claude --integration-options="--no-model-invocation"
```

Sur le dépôt déjà là, la même option se passe à l'installation. Elle écrit dans les skills de commande que le modèle ne les lance pas seul. Vous tapez `/speckit-specify`, `/speckit-plan`, `/speckit-clarify`. Leurs descriptions ne saturent plus la liste. C'est vous qui décidez du moment, ce qui rejoint la règle : un skill, puis la lecture de l'artefact.

Vous ne posez pas cette option pour empêcher Claude de demander une permission. Elle ne parle que de **qui** peut invoquer le skill. Les permissions, elles, restent demandées.

> [!TIP]
> Si la liste est encore lisible, vous pouvez laisser l'invocation par le modèle. Dès qu'un skill utile de l'atelier disparaît de la liste, `--no-model-invocation` remet Spec Kit sous votre slash.

# La constitution sans secret

La constitution est déjà posée pour Sève : huit places, prix tenu, attente bornée, confirmation visible, pas d'envoi réel. `/speckit-constitution` ne sert pas à y glisser le moyen d'envoyer le SMS.

Vous n'y collez pas :

- le jeton d'un opérateur ;
- le numéro de téléphone de Léa ;
- un mot de passe, une clé, le contenu d'un `.env`.

Les trois absents du mois justifient une phrase : la confirmation doit être **visible** dans l'application avant 18 h la veille. Ils ne justifient pas un secret « pour que l'agent puisse envoyer ». L'envoi réel reste hors de ce parcours. La constitution évalue les étapes suivantes. Un secret dedans se recopierait dans les specs, les plans et les diffs.

> [!WARNING]
> Un skill, une constitution ou `.claude/settings.json` qui contient un jeton est à corriger avant le commit. Vous retirez le secret. Vous ne le « masquez » pas dans une phrase.

# Les événements, à part les skills

`.claude/settings.json` reçoit les événements Spec Kit de cette intégration. Ce n'est pas le dossier des skills. Les skills restent dans `.claude/skills/`, invoqués par `/speckit-specify`. Mélanger les deux, en collant une consigne de skill dans les réglages, ou un secret dans l'un ou l'autre, brouille la session.

Vous pouvez désactiver les événements à l'installation avec `--events false`, si vous ne voulez pas de ces handlers. Cela n'autorise pas l'agent à écrire sans qu'on le lui demande, et cela ne coche pas les huit places à votre place. La relecture de `spec.md` reste la vôtre, dans la session, avant `/speckit-plan`.

# Exercices

## Exercice 1 : La même attente, dans la session

La spec de l'attente n'existe pas encore. La session Claude Code est ouverte à la racine de Sève. Que tapez-vous, et que doit encore demander Claude ?

<details>
<summary>Voir la solution</summary>

Vous tapez `/speckit-specify` dans la session, avec l'attente ordonnée (12 au plus) et la confirmation avant 18 h la veille. La liste, les 8 places, les 45 € et le refus de la 9e sont déjà là : la spec ne les réécrit pas à la baisse.

Claude demande encore les permissions de lire et d'écrire. Le workflow, qui utilise `claude -p`, n'ajoute pas de drapeau pour les couper. Vous acceptez l'écriture de `spec.md`. Vous refusez une demande qui lirait un secret ou enverrait un SMS. Ensuite vous ouvrez `spec.md`.

</details>

## Exercice 2 : La liste qui déborde

Dix skills d'extensions plus ceux de Spec Kit : `/speckit-specify` n'apparaît plus quand vous cherchez quoi invoquer. Les permissions, elles, s'affichent encore. Que changez-vous, et que ne changez-vous pas ?

<details>
<summary>Voir la solution</summary>

Vous réinstallez avec `--integration-options="--no-model-invocation"` (à l'init ou à `specify integration install claude`). Les skills de commande de Spec Kit ne sont plus invoqués que par vous, avec `/speckit-specify`. Leurs descriptions quittent le budget de la liste.

Vous n'ajoutez aucun drapeau qui désactive les permissions. `claude -p` n'en pose pas, et vous n'en posez pas. La constitution ne reçoit pas de jeton « pour alléger la session ». L'option ne parle que de l'invocation des skills.

</details>

## Exercice 3 : Un jeton dans la constitution

Pour « prouver » les trois absents, quelqu'un veut coller dans la constitution le jeton SMS et le numéro de Léa. La phrase utile, selon lui : « L'agent envoie le rappel à 17 h. » Que gardez-vous à la place ?

<details>
<summary>Voir la solution</summary>

Vous ne collez ni jeton, ni numéro, ni consigne d'envoi. La constitution rappelle les principes déjà posés : 8 places, 45 €, attente maximale de 12, confirmation visible avant 18 h la veille, pas de secret dans le dépôt.

Les trois absents expliquent pourquoi la confirmation doit se voir dans l'application. L'envoi réel, l'opérateur et le téléphone restent dehors. Vous retirez le secret s'il a été écrit, avant tout commit, y compris dans `.claude/settings.json`.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Spec Kit dans Claude Code"
center: "Même slash que Cursor, /speckit-specify. Claude demande encore ses permissions. Aucun secret dans la constitution."
points:
  - icon: chat
    title: "La session"
    text: "Clé claude. Skills dans .claude/skills/. Vous tapez /speckit-specify dans la session."
  - icon: lock
    title: "Permissions"
    text: "Le workflow utilise claude -p et n'ajoute pas de drapeau qui les désactive."
  - icon: filter
    title: "Liste pleine"
    text: "--no-model-invocation : vous seul invoquez les skills Spec Kit, avec le slash."
  - icon: shield
    title: "Constitution"
    text: "8 places, 45 €, attente 12, confirmation visible. Pas de jeton, pas de numéro."
  - icon: tool
    title: "Événements"
    text: "Ils passent par .claude/settings.json. Ce fichier n'est pas un endroit pour un secret."
pitfall: "Couper les permissions pour finir le flux, ou coller le jeton SMS dans la constitution."
remember: "Session dans le dépôt, slash, permissions lues, skills invoqués par vous si la liste déborde."
```
