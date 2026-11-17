---
title: "Ouvrir le dépôt Sève"
description: "specify init prépare Sève pour Cursor avec --integration cursor-agent. Un dépôt déjà plein se commit d'abord. Les skills s'ouvrent dans le chat, depuis .cursor/skills."
duration: 50
objectives:
  - "Initialiser un projet neuf avec specify init et --integration cursor-agent"
  - "Préparer un dépôt déjà plein par un commit ou une sauvegarde, puis --here --force"
  - "Ajouter plus tard une autre intégration avec specify integration install"
  - "Retrouver la skill Cursor et l'invoquer dans le chat, pas dans le terminal"
---

# Un dossier qui n'existe pas encore

L'outil répond : `specify version` a affiché un numéro, et ce n'est pas une 0.1.6 incapable de lire `--integration`. Vous pouvez créer le projet. Pour un dossier neuf, encore vide de l'application, la commande est :

```text
specify init seve --integration cursor-agent
```

Elle crée un dossier `seve` et y pose Spec Kit pour l'agent Cursor. La clé d'intégration est `cursor-agent`. Le drapeau est `--integration`. Vous l'écrivez dans la commande pour ne pas dépendre d'un menu fléché. Sans ce drapeau, une exécution non interactive peut préparer un autre agent que celui de ce module.

Le dossier obtenu n'est pas encore l'atelier rempli. C'est l'armature : `.specify/`, et les skills Cursor. Léa Vernet, le samedi 10 h-13 h, les huit places et les 45 € n'y sont pas devinés. Vous les écrirez dans le chat, après. La confirmation visible et la liste d'attente ordonnée non plus : l'init ne les spécifie pas.

> [!IMPORTANT]
> Projet neuf : `specify init seve --integration cursor-agent`. La clé de ce module est `cursor-agent`. Le drapeau est `--integration`.

# Le dépôt de Sève est déjà plein

Le cas du parcours est l'autre. L'application existe. Elle liste les douze stages du mois. Elle refuse la neuvième place. Vous n'ouvrez pas un second dossier à côté, qui oublierait ce code. Vous initialisez à l'intérieur du dépôt.

Avant cela, vous committez, ou vous faites une sauvegarde du dossier. `--force` accepte d'écrire dans un répertoire qui n'est pas vide. Il ne restaure pas ce que vous n'avez pas mis de côté. Un diff non commité peut se mélanger aux fichiers du kit. Vous rangez d'abord.

Puis, depuis la racine du dépôt :

```text
specify init --here --force --integration cursor-agent
```

`--here` vise le dossier courant. `--force` assume le dossier déjà occupé par Sève. `--integration cursor-agent` pose les skills de Cursor. Vous relisez ensuite `git status`. Les fichiers du kit sont arrivés. Le code qui liste les stages et qui refuse la neuvième place est toujours là.

> [!WARNING]
> Sur le dépôt réel de l'atelier, commit ou sauvegarde d'abord. Ensuite seulement `specify init --here --force --integration cursor-agent`.

# Les clés que l'on verra plus tard

`cursor-agent` est la clé de ces premiers chapitres. Deux autres clés existent déjà : `claude` et `codex`. Elles préparent le même dépôt pour d'autres agents. Vous ne les installez pas aujourd'hui. Un module ultérieur montrera comment invoquer les skills chez eux, avec leurs permissions.

Les retenir maintenant évite une fausse piste. Vous ne renommez pas la clé Cursor. Vous ne collez pas `claude` dans la commande de ce chapitre « pour avoir tout le monde ». Un agent à la fois, celui dans lequel vous allez écrire. Ici, c'est Cursor.

Le métier, lui, ne dépend pas de la clé. Huit places, attente maximale de douze, décision de Léa avant 18 h la veille, pas de téléphone affiché sur la page publique : ces règles valent quel que soit l'agent. Trois absents par mois, à cause du SMS oublié, restent la raison de la confirmation visible. Le remplissage autour de 70 % rappelle que les places annoncées doivent être vraies.

# Ajouter un agent sans tout refaire

Le jour où vous ouvrirez le même dépôt dans Claude, vous n'effacez pas l'init Cursor. Vous ajoutez l'intégration :

```text
specify integration install claude
```

La commande part du dépôt déjà préparé. Elle ajoute la clé demandée. `claude` est l'exemple de ce chapitre. `codex` s'ajoutera de la même façon quand son module viendra. Vous ne réinitialisez pas `seve` depuis zéro pour cela, et vous ne repassez pas `--force` « pour être sûr ».

Après cet ajout, les skills Cursor restent en place. `/speckit-specify` dans le chat Cursor continue de viser la confirmation et l'attente. L'autre agent aura sa propre façon d'appeler les mêmes étapes. Vous le verrez plus tard. Aujourd'hui, vous savez seulement que l'ajout est `specify integration install`, suivi de la clé, dans le terminal.

> [!NOTE]
> Ajouter un agent plus tard : `specify integration install claude`. Cela ne réécrit pas les principes de l'atelier, ni la liste des stages déjà en place.

# Le fichier de skill dans Cursor

Cursor range chaque skill dans un dossier. Pour la spécification :

```text
.cursor/skills/speckit-specify/SKILL.md
```

Vous ouvrez ce fichier une fois, pour voir qu'il est bien là après l'init. Le nom du dossier est `speckit-specify`. Le fichier s'appelle `SKILL.md`. Les autres skills du kit suivent la même forme, chacune dans son dossier sous `.cursor/skills/`. La constitution, que vous écrirez juste après ces fondations, aura la sienne. Vous n'avez pas à la chercher dans le terminal.

Si le fichier manque, vous ne le recréez pas à la main. Vous vérifiez la clé utilisée à l'init : `cursor-agent`, avec `--integration`. Un dépôt initialisé pour un autre agent n'a pas forcément ce chemin. Un dépôt initialisé avec une commande trop vieille n'a pas ce chemin non plus.

```diagram
type: decision
title: "Quelle commande d'init pour Sève"
nodes:
  - question: "Le dossier contient déjà l'application ?"
    yes: "Commit ou sauvegarde, puis specify init --here --force --integration cursor-agent"
    no: "specify init seve --integration cursor-agent"
```

# L'invocation se tape dans le chat

La skill s'invoque dans le chat de Cursor :

```text
/speckit-specify
```

Vous la ferez suivre, dans un prochain chapitre, du quoi et du pourquoi. Pas dans celui-ci : l'init ne remplace pas la spec, et les principes du projet s'écrivent encore avant. Pour l'instant, vous vérifiez que le chat propose bien la skill, et que le terminal, lui, ne la comprend pas.

Le bon réflexe après l'init tient en quatre contrôles. Le dépôt est commité ou sauvegardé si vous étiez sur l'existant. `git status` montre les fichiers du kit sans avoir effacé le refus de la neuvième place. `.cursor/skills/speckit-specify/SKILL.md` est présent. Le chat accepte `/speckit-specify`. La confirmation visible et la file ordonnée ne sont pas encore écrites : c'est normal. Douze stages par mois, 70 % de remplissage, trois absents : vous les apporterez dans la spec, pas dans la commande d'init.

> [!TIP]
> Si le chat ne propose pas la skill, ouvrez le fichier `SKILL.md` cité plus haut. S'il est absent, l'init n'a pas ciblé `cursor-agent`.

# Exercices

## Exercice 1 : Le bon init

Deux postes. Le premier a un dossier vide, le projet n'existe pas. Le second a le dépôt Sève, avec la liste des stages et le refus de la neuvième place, et des modifications non commitées. Quelle commande sur chaque poste, et que faites-vous avant la seconde ?

<details>
<summary>Voir la solution</summary>

Dossier vide : `specify init seve --integration cursor-agent`. Dépôt déjà plein : vous committez ou vous sauvegardez d'abord, puis `specify init --here --force --integration cursor-agent`.

Les deux commandes portent `--integration cursor-agent`. Vous ne créez pas un second dossier à côté de l'application réelle. Les clés `claude` et `codex` existent, elles attendent un autre moment.

</details>

## Exercice 2 : Claude, plus tard

Le dépôt Sève est déjà initialisé pour Cursor. On vous demande d'ajouter Claude sans perdre les skills actuelles. Quelle commande lancez-vous, et où n'invoquez-vous pas `/speckit-specify` ?

<details>
<summary>Voir la solution</summary>

Dans le terminal, à la racine du dépôt : `specify integration install claude`. Vous ne relancez pas un init `--force` pour l'occasion. Les skills Cursor restent.

`/speckit-specify` se tape dans le chat, pas dans le terminal. Le fichier lu par Cursor est `.cursor/skills/speckit-specify/SKILL.md`. La commande d'ajout ne rédige pas la confirmation à la place de Léa.

</details>

## Exercice 3 : La skill introuvable

Après l'init, le chat ne propose pas `/speckit-specify`. Le collègue veut coller la skill dans PowerShell. Que vérifiez-vous dans le dépôt, et que lui répondez-vous ?

<details>
<summary>Voir la solution</summary>

Vous ouvrez `.cursor/skills/speckit-specify/SKILL.md`. S'il manque, l'init n'a pas utilisé `--integration cursor-agent`, ou la commande `specify` était trop ancienne pour connaître le drapeau. Vous corrigez l'init, vous ne recréez pas le fichier à la main.

PowerShell reçoit les scripts du projet sous Windows, pas les skills. La skill part dans le chat. La demande, quand elle viendra, parlera de la confirmation visible et de l'attente ordonnée, avec les nombres de l'atelier, pas d'une phrase unique.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Ouvrir Sève pour Cursor
center: "Init neuf ou dépôt plein, toujours avec --integration cursor-agent. La skill /speckit-specify s'invoque dans le chat."
points:
  - icon: rocket
    title: Projet neuf
    text: "specify init seve --integration cursor-agent crée le dossier et pose les skills Cursor."
  - icon: git
    title: Dépôt plein
    text: "Commit ou sauvegarde, puis specify init --here --force --integration cursor-agent."
  - icon: puzzle
    title: Plus tard
    text: "Les clés claude et codex existent. specify integration install claude ajoute Claude."
  - icon: file
    title: Le fichier
    text: "La skill Cursor est dans .cursor/skills/speckit-specify/SKILL.md. On vérifie qu'il est là."
  - icon: chat
    title: Le chat
    text: "On invoque /speckit-specify dans le chat. Le terminal, lui, a déjà fait l'init."
pitfall: "Lancer --force sur le dépôt de Sève sans commit ni sauvegarde, ou taper la skill dans le terminal."
remember: "cursor-agent dès l'init. Commit d'abord si le dépôt est plein. La skill se lance dans le chat."
```
