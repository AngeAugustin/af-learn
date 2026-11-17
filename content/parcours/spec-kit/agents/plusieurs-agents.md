---
title: "Plusieurs agents, une spec"
description: "Garder spec.md et .specify/feature.json comme source, passer de Cursor à Claude Code sans deux écritures simultanées, et installer le second agent avec specify."
duration: 50
objectives:
  - "Traiter spec.md et .specify/feature.json comme la source de la fonctionnalité"
  - "Préparer la spec dans Cursor et implémenter dans Claude Code, un écrivain à la fois"
  - "Installer le second agent avec specify integration install"
  - "Refuser une copie manuelle des dossiers de skills"
---

# Une source, pas un chat

Cursor, Claude Code et Codex peuvent tous lire l'attente de Sève. Ils ne sont pas trois sources. La source est dans le dépôt : `spec.md` pour le quoi et le pourquoi, `.specify/feature.json` pour dire **quelle** fonctionnalité est active.

Léa Vernet, Lyon Croix-Rousse, samedi 10 h-13 h. Huit places, 45 €. Attente ordonnée, douze noms, pas treize. Confirmation avant 18 h la veille. La liste et le refus de la neuvième place sont déjà codés. Douze stages par mois, remplissage autour de 70 %, trois absents liés à un SMS oublié. Ces phrases vivent dans la spec. Un chat qui s'en souvient « à peu près » ne les remplace pas.

Quand vous changez d'agent, vous ouvrez le même dépôt. Vous lisez `spec.md`. Vous ne redemandez pas une spec « plus pratique » qui passerait à dix places.

> [!NOTE]
> Les commandes de Spec Kit suivent le dossier noté dans `.specify/feature.json`. Changer de branche Git, seul, ne change pas la fonctionnalité active.

# Le pointeur feature.json

`/speckit-specify` (ou `$speckit-specify` dans Codex) crée ou met à jour la spec, et enregistre son dossier dans `.specify/feature.json`. Les skills suivants, plan, tâches, analyse, implementation, lisent ce pointeur.

Vous l'ouvrez si un agent semble travailler à côté de l'attente : une autre fonctionnalité, un ancien essai, un dossier `specs/` qui ne parle pas des 18 h. Vous le corrigez pour qu'il désigne l'attente, puis vous invoquez le skill. Deux pointeurs « à peu près l'attente » produisent deux `tasks.md`. L'implémentation ne sait plus lequel suivre.

```diagram
type: layers
title: "Ce qui fait foi quand l'agent change"
layers:
  - title: "spec.md"
    text: "Le quoi et le pourquoi : attente 12, confirmation avant 18 h, 8 places, 45 €."
  - title: ".specify/feature.json"
    text: "Le pointeur : quelle fonctionnalité les skills doivent lire."
  - title: "Le chat de l'agent"
    text: "Une invocation à la fois. Le chat n'est pas une seconde spec."
```

# Préparer ici, implémenter là

Vous pouvez écrire la spec dans Cursor, la relire, la clarifier, puis fermer cet agent et ouvrir Claude Code **dans le même dépôt** pour `/speckit-implement`. La spec ne se réécrit pas. Claude Code lit `spec.md` et le pointeur. L'invocation dans Claude Code reste le slash. Si vous aviez choisi Codex pour la suite, ce serait le dollar. Un seul de ces agents écrit à ce moment-là.

Ce partage sert à tenir un outil jusqu'au bout d'une étape. Il ne sert pas à faire coder deux agents ensemble sur `spec.md`, `plan.md` ou les mêmes sources. Le premier qui a le fichier ouvert en écriture le garde. L'autre attend, ou vous le fermez.

La constitution reste celle de l'atelier. Vous n'en profitez pas, au moment du passage, pour y coller un secret « que l'autre agent saura utiliser ».

> [!IMPORTANT]
> Deux agents en écriture sur les mêmes fichiers se contredisent : l'un tient les 12 noms, l'autre « assouplit ». Vous n'en laissez qu'un écrire.

# specify integration install

Le second agent s'installe avec la commande prévue, dans le dépôt :

```bash
specify integration install claude
```

Ou `specify integration install cursor-agent`, ou `specify integration install codex`, selon celui qui manque. Vous ne copiez pas `.cursor/skills/` vers `.claude/skills/`, ni vers `.agents/skills/`. La copie manuelle se trompe de préfixe, de chemin, et parfois de nombres.

`specify integration list` montre les intégrations déjà là et si elles sont déclarées sûres ensemble. Cursor, Claude Code et Codex le sont, chacune dans sa page. Cela n'autorise pas à ignorer un dossier partagé. `.agents/skills/` sert à plusieurs intégrations : avant d'y poser la suivante, vous lisez les règles de multi-install et les `SKILL.md` déjà présents. Un fichier qui contredit les huit places se règle d'abord.

La clé `none` pose l'échafaudage sans agent. Elle ne remplace pas une installation de Cursor, de Claude Code ou de Codex, et elle n'invoque aucun skill.

# Un écrivain, des lecteurs

Le rythme qui tient :

1. Un agent écrit `spec.md`. Vous le relisez (8, 45 €, 12, 18 h).
2. Vous fermez son écriture avant d'ouvrir le suivant sur les mêmes fichiers.
3. L'agent suivant lit le pointeur et la spec. Il planifie, ou il implémente, selon l'étape où vous en êtes.
4. Vous relisez le diff. Le refus de la neuvième place est toujours là. L'attente refuse le treizième nom.

Vous pouvez montrer `spec.md` à un collègue, le faire lire par un agent en lecture seule, le commenter. La lecture à plusieurs est saine. L'écriture simultanée ne l'est pas. Si vous devez vraiment repasser sur la spec, vous le faites dans un seul chat, puis vous laissez l'autre agent relire le fichier à jour.

> [!WARNING]
> Lancer `/speckit-implement` dans Claude Code pendant que Cursor réécrit encore `tasks.md`, c'est coder sur un texte qui bouge. Vous attendez que les tâches soient relues, et qu'un seul agent les exécute.

# Ce que vous ne transportez pas

D'un agent à l'autre, sur la même copie de travail, vous partagez les fichiers, pas le fil du chat. `spec.md`, le plan, les tâches et la constitution se commitent. `.specify/feature.json` est le pointeur local : les deux agents ouverts ici le lisent, un commit ne l'emporte pas vers une autre machine. Vous le vérifiez sur cette copie, avant d'invoquer.

Vous ne transportez pas non plus un contournement de permission vu dans un agent pour l'appliquer dans l'autre. Chaque agent demande ce qu'il demande. Claude Code continue de demander. Un workflow Cursor qui approuve confiance et MCP d'un bloc ne se « reproduit » pas dans Claude en ajoutant un drapeau. Ce sujet est celui des workflows. Ici, la règle est plus simple : une spec, un pointeur, un écrivain.

# Exercices

## Exercice 1 : Le pointeur

Claude Code implémente « une » fonctionnalité, et le diff ne parle pas de l'attente. `spec.md` de l'attente, lui, est correct : 12 noms, 18 h, 8 places. Où regardez-vous en premier ?

<details>
<summary>Voir la solution</summary>

Vous ouvrez `.specify/feature.json`. Les skills suivent ce pointeur, pas le souvenir du chat ni la branche Git seule. S'il désigne un autre dossier, vous le remettez sur la fonctionnalité d'attente, vous vérifiez `spec.md`, puis vous invoquez de nouveau, dans un seul agent.

Vous ne lancez pas un deuxième `/speckit-specify` « en parallèle » dans Cursor pendant que Claude Code écrit. Une source, un écrivain.

</details>

## Exercice 2 : Cursor puis Claude Code

La spec et la clarification sont faites dans Cursor. Vous voulez l'implementation dans Claude Code. Claude n'est pas encore installé dans le dépôt. Que faites-vous, dans l'ordre ?

<details>
<summary>Voir la solution</summary>

Vous relisez `spec.md` (attente 12, confirmation avant 18 h, plafond 8, prix 45 €). Vous arrêtez l'écriture dans Cursor sur ces fichiers.

Vous installez avec `specify integration install claude`. Vous ne copiez pas `.cursor/skills/` dans `.claude/skills/`. Vous ouvrez la session Claude Code dans le même dépôt. L'invocation est `/speckit-implement` (ou le skill d'étape si vous n'êtes pas encore à l'implémentation), après lecture des artefacts. Les permissions de Claude restent demandées.

Vous vérifiez `.specify/feature.json` : il pointe toujours l'attente. Un seul agent écrit.

</details>

## Exercice 3 : Deux chats ouverts

Cursor et Codex sont ouverts sur Sève. Les deux vont modifier `spec.md`. Codex a un skill dans `.agents/skills/` qui propose 10 places « pour le taux de remplissage ». Que fermez-vous, et que lisez-vous ?

<details>
<summary>Voir la solution</summary>

Vous ne laissez qu'un agent écrire. L'autre se ferme, ou reste en lecture. `spec.md` et `.specify/feature.json` restent la source : 8 places, pas 10. Les 70 % n'ouvrent pas de place.

Avant toute seconde installation dans `.agents/skills/`, vous avez lu les règles de multi-install et le `SKILL.md` déjà là. Le texte des 10 places se corrige ou se retire. L'installation, si elle manque encore, passe par `specify integration install`, pas par une copie de dossiers.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Plusieurs agents, une spec"
center: "spec.md et .specify/feature.json font foi. Un agent écrit. Le second s'installe avec specify, sans copie manuelle."
points:
  - icon: file
    title: "La spec"
    text: "Attente 12, 18 h, 8 places, 45 €. Le chat ne devient pas une autre version."
  - icon: compass
    title: "Le pointeur"
    text: ".specify/feature.json désigne la fonctionnalité. Une branche Git ne suffit pas."
  - icon: users
    title: "Un écrivain"
    text: "Cursor peut préparer, Claude Code implémenter. Pas les deux en écriture ensemble."
  - icon: terminal
    title: "Install"
    text: "specify integration install, avec la clé. On ne recopie pas les dossiers de skills."
  - icon: search
    title: "Dossier partagé"
    text: ".agents/skills/ se lit, règles multi-install comprises, avant une deuxième pose."
pitfall: "Deux agents qui réécrivent spec.md, ou un copier-coller de .cursor/skills/ vers un autre dossier."
remember: "Même dépôt, même pointeur, un seul écrivain. Le second agent s'installe avec specify."
```
