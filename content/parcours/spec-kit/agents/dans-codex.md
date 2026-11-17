---
title: "Spec Kit dans Codex"
description: "Invoquer la même spec Sève dans Codex avec le dollar, skills dans .agents/skills/, après avoir lu ce dossier partagé."
duration: 50
objectives:
  - "Installer l'intégration Codex avec la clé codex"
  - "Invoquer $speckit-specify dans le chat, avec le dollar"
  - "Retrouver les skills dans .agents/skills/ et les événements dans .codex/config.toml"
  - "Vérifier qu'un autre agent n'a pas déjà écrit des fichiers contradictoires dans ce dossier"
---

# La même spec

L'attente de Sève ne change pas d'agent. Huit places le samedi de 10 h à 13 h, 45 €, Lyon Croix-Rousse, Léa Vernet. La liste et le refus de la neuvième place sont déjà dans l'application. L'attente ordonnée s'arrête à douze. La confirmation se décide avant 18 h la veille. Douze stages par mois, remplissage autour de 70 %, trois absents parce que le SMS a été oublié : le pourquoi, pas un nouveau plafond.

La clé est `codex`. Dans le dépôt existant :

```bash
specify integration install codex
```

Pour un dossier neuf : `specify init seve --integration codex`. Ensuite le chat de Codex, ouvert sur ce dépôt. Le terminal a installé. Il n'invoque pas le skill.

# Le dollar qui trompe

Dans Cursor et dans Claude Code, vous tapez `/speckit-specify`. Dans Codex, le préfixe est le **dollar** :

```text
$speckit-specify
Une personne sans place voit qu'elle est en attente, dans l'ordre d'arrivée.
Le 12e nom est accepté, le 13e est refusé. La page publique ne montre pas les téléphones.
Léa tranche avant 18 h la veille, et la phrase « avant 18 h » est à l'écran.
Déjà là : liste, 8 places, 45 € affichés, refus de la 9e. Pas de SMS, pas de paiement.
```

Le slash, ici, n'est pas l'invocation. C'est le point qui trompe : la main reprend le geste des deux autres agents, et le skill ne part pas. Vous vérifiez le préfixe avant d'incriminer le dépôt. `$speckit-plan`, `$speckit-clarify`, `$speckit-tasks` suivent la même règle. Un skill par message, puis vous ouvrez `spec.md`.

> [!IMPORTANT]
> Dollar, pas slash. `$speckit-specify` dans le chat de Codex. La spec relue dans l'éditeur avant `$speckit-plan`.

```diagram
type: compare
title: "Le préfixe selon l'agent"
columns:
  - title: Cursor
    tone: violet
    items:
      - "Clé cursor-agent"
      - "Chat : /speckit-specify"
      - "Dossier .cursor/skills/"
  - title: "Claude Code"
    tone: blue
    items:
      - "Clé claude"
      - "Chat : /speckit-specify"
      - "Dossier .claude/skills/"
  - title: Codex
    tone: teal
    items:
      - "Clé codex"
      - "Chat : $speckit-specify"
      - "Dossier .agents/skills/"
```

# Les skills dans .agents/skills

Codex reçoit ses skills dans `.agents/skills/`. Le fichier de la spécification est `.agents/skills/speckit-specify/SKILL.md`. Le nom du dossier et le dollar donnent `$speckit-specify`.

Vous pouvez ouvrir ce `SKILL.md`. Il décrit l'étape de spec. Il ne contient pas le numéro de Léa, ni un jeton, ni une consigne du genre « passe à 10 places si le stage est plein ». Huit, quarante-cinq euros, douze, dix-huit heures. Si le fichier dit autre chose, vous le corrigez avant d'invoquer, ou vous réinstallez avec la commande `specify`, sans recopier un dossier à la main.

Les événements de cette intégration vivent dans `.codex/config.toml`, à part des skills. Un réglage d'événement n'est pas une seconde spec. La spec reste `spec.md`, désignée par `.specify/feature.json`.

# Un dossier déjà occupé

`.agents/skills/` n'appartient pas qu'à Codex. D'autres intégrations y écrivent aussi. Avant d'en poser une deuxième au même endroit, vous lisez les règles de multi-install, et vous lisez les fichiers déjà présents.

```bash
specify integration list
```

La liste indique si les intégrations concernées sont déclarées sûres pour cohabiter. La déclaration ne remplace pas votre lecture. Vous ouvrez `.agents/skills/`. Vous cherchez un `SKILL.md` qui parlerait de Sève avec d'autres nombres : dix places, une attente illimitée, un envoi de SMS. Deux textes pour le même geste, avec deux plafonds, se corrigent **avant** la deuxième installation.

Vous ne dupliquez pas `.cursor/skills/` vers `.agents/skills/` pour « aller plus vite ». `specify integration install codex` écrit les fichiers de Codex, avec le bon préfixe. Une copie manuelle laisse un slash là où Codex attend un dollar, ou l'inverse.

> [!WARNING]
> Un skill déjà là qui dit « 10 places si le remplissage le demande » contredit la constitution de Léa. Vous ne l'installez pas « à côté » en espérant que Codex choisira le bon.

# Relire, ici aussi

Le dollar change le geste. Il ne change pas le rythme. Vous invoquez `$speckit-specify`. Vous ouvrez `spec.md`. Vous y cherchez :

- le samedi 10 h-13 h et Lyon Croix-Rousse ;
- 8 places, la 9e déjà refusée par l'app, et non réouverte par la spec ;
- 45 € affichés, sans paiement ;
- l'attente ordonnée, arrêt à 12, refus du 13e nom ;
- la phrase « avant 18 h » à l'écran, et aucun téléphone sur la page publique.

Puis, dans un autre message, `$speckit-plan`, en demandant de réutiliser l'application. Le plan ne réécrit pas l'atelier dans un autre cadre. Ce parcours n'est pas un cours de framework. Il mène une fonctionnalité déjà commencée.

> [!TIP]
> Si rien ne s'écrit après votre message, regardez le premier caractère. Un slash dans Codex explique souvent le silence. Vous renvoyez `$speckit-specify`.

# Le toml n'est pas la spec

`.codex/config.toml` règle les événements. Vous le distinguez de `spec.md`. Désactiver les événements, si vous le faites à l'installation, n'enlève pas le dollar et ne dispense pas de relire la spec. Cela n'approuve pas non plus une écriture que vous n'auriez pas demandée.

La fonctionnalité active reste celle de `.specify/feature.json`. Vous la consultez si Codex semble spécifier un autre sujet que l'attente. Un deuxième `$speckit-specify` lancé « pour voir » peut viser une autre fonctionnalité : vous vérifiez le pointeur avant de laisser deux specs de l'attente coexister.

# Exercices

## Exercice 1 : Le préfixe

Vous avez l'habitude de Cursor. Dans le chat Codex, vous tapez `/speckit-specify` avec le texte de l'attente. Aucun `spec.md` ne bouge. Que renvoyez-vous ?

<details>
<summary>Voir la solution</summary>

Vous renvoyez le même texte avec le dollar : `$speckit-specify`. Dans Codex, le slash n'invoque pas le skill. Le fichier chargé est `.agents/skills/speckit-specify/SKILL.md`.

Vous ouvrez ensuite `spec.md` dans l'éditeur. Huit places, 45 €, attente jusqu'à 12, confirmation avant 18 h la veille. `$speckit-plan` vient après cette lecture, dans un autre message, et il réutilise l'application déjà là.

</details>

## Exercice 2 : Le dossier déjà écrit

`.agents/skills/speckit-specify/SKILL.md` existe. Un autre outil l'a posé. Le texte dit : « Accepter une 9e place quand le mois est rempli à 70 %. » Vous vouliez installer Codex. Que faites-vous avant ?

<details>
<summary>Voir la solution</summary>

Vous lisez les règles de multi-install (`specify integration list`, et le dossier `.agents/skills/`). Ce dossier est partagé : une deuxième intégration au même endroit se prépare, elle ne s'empile pas en aveugle.

Vous ne laissez pas le skill des « 9e places à 70 % ». Huit places restent le plafond. Les 70 % et les trois absents expliquent la confirmation, ils n'ouvrent pas de chaise. Vous corrigez ou vous retirez le fichier contradictoire, puis `specify integration install codex` écrit la version de Codex. Vous ne copiez pas `.cursor/skills/` à la main.

</details>

## Exercice 3 : Où est l'événement

Quelqu'un cherche la spec dans `.codex/config.toml`, et le réglage des événements dans `.agents/skills/`. Vous remettez chaque chose à sa place, pour l'attente de Sève.

<details>
<summary>Voir la solution</summary>

`spec.md` porte l'attente et la confirmation. `.specify/feature.json` désigne cette fonctionnalité. Les skills invoqués par `$speckit-specify` sont dans `.agents/skills/`. Les événements sont dans `.codex/config.toml`.

Le toml ne remplace pas la spec, et un skill n'est pas un fichier d'événements. Vous relisez `spec.md` avant `$speckit-plan`. Le prix reste 45 €. Le 13e nom d'attente est refusé. Aucun secret ne traîne dans le toml ni dans le skill.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Spec Kit dans Codex"
center: "Dans Codex, le skill s'invoque avec $speckit-specify. Le dollar est le geste. Le dossier .agents/skills/ se lit avant une 2e install."
points:
  - icon: chat
    title: "Le dollar"
    text: "$speckit-specify dans le chat. Le slash de Cursor ou de Claude ne lance pas ce skill."
  - icon: layers
    title: ".agents/skills/"
    text: "Le SKILL.md de specify est là. D'autres intégrations écrivent dans le même dossier."
  - icon: search
    title: "Avant d'installer"
    text: "Vous lisez les règles multi-install et les fichiers déjà présents. Pas de copie à la main."
  - icon: file
    title: "Même spec"
    text: "8 places, 45 €, attente 12, 18 h la veille. Puis $speckit-plan sur l'app déjà là."
  - icon: tool
    title: "config.toml"
    text: "Les événements sont dans .codex/config.toml. La spec, elle, reste spec.md."
pitfall: "Taper /speckit-specify dans Codex, ou poser un second skill qui dit 10 places à côté du premier."
remember: "Dollar, dossier partagé relu, même nombres de Léa. La spec se lit avant le plan."
```
