---
title: "Spec Kit dans Cursor"
description: "Ouvrir l'atelier Sève dans Cursor, installer la clé cursor-agent, et invoquer les skills dans le chat, un par un, en relisant spec.md avant le plan."
duration: 50
objectives:
  - "Installer GitHub Spec Kit dans Cursor avec la clé cursor-agent"
  - "Invoquer /speckit-specify dans le chat de l'agent, sur le dépôt ouvert"
  - "Relire spec.md dans l'éditeur avant d'invoquer /speckit-plan"
  - "Enchaîner les skills un message à la fois, après lecture de l'artefact"
---

# Le dépôt ouvert dans l'éditeur

Léa Vernet tient l'Atelier Sève, à Lyon Croix-Rousse. Le samedi, de 10 h à 13 h, huit personnes tournent. Le stage coûte 45 €. L'application sait déjà lister les stages et refuser la neuvième place. L'attente ordonnée, douze noms au plus, et la confirmation avant 18 h la veille, ne sont pas encore spécifiées. C'est ce travail que vous menez avec GitHub Spec Kit, dans Cursor.

Vous ouvrez **le dépôt de l'atelier**, pas un dossier vide à côté, pas un extrait collé dans le chat. Cursor voit les fichiers déjà là : la liste, le refus, les tests. Le skill lira ce dépôt. Un chat ouvert sur un autre projet écrirait une spec sans voir que la neuvième place est déjà refusée.

> [!NOTE]
> Douze stages par mois, un remplissage autour de 70 %, environ trois absents parce que le SMS a été oublié. Ces faits expliquent la confirmation. Ils ne changent pas le plafond : huit places, pas neuf.

# La clé cursor-agent

La clé d'intégration de Cursor est `cursor-agent`. Le drapeau est `--integration`. Trois situations, trois commandes de terminal. Aucune n'invoque un skill.

Dossier neuf, le projet n'existe pas encore :

```bash
specify init seve --integration cursor-agent
```

Dépôt de Sève déjà plein (liste, refus de la 9e), Spec Kit pas encore posé. Vous committez ou vous sauvegardez, puis :

```bash
specify init --here --force --integration cursor-agent
```

Spec Kit est déjà là, et les skills Cursor manquent :

```bash
specify integration install cursor-agent
```

Vous ne relancez pas `init --force` seulement pour « rafraîchir » : `integration install` ajoute la clé sans reprendre l'init. Les skills, ensuite, se tapent dans le chat.

D'autres clés existent (`copilot`, `gemini`, `generic`, `none`). On ne les détaille pas. `none` pose l'échafaudage sans agent : pas de `/speckit-specify`.

# Le skill dans le chat

Une fois le dépôt ouvert, vous invoquez le skill dans le chat de l'agent :

```text
/speckit-specify
Une personne sans place voit qu'elle est en attente, dans l'ordre d'arrivée.
Le 12e nom est accepté, le 13e est refusé. La page publique ne montre pas les téléphones.
Léa Vernet tranche avant 18 h la veille, et la phrase « avant 18 h » est à l'écran.
But : savoir où l'on en est sans appeler l'atelier.
Déjà là : liste du samedi 10 h-13 h, 8 places, 45 € affichés, refus de la 9e.
Pas de SMS, pas de paiement.
```

Le skill écrit la spécification. Il note la fonctionnalité active dans `.specify/feature.json`. Vous retrouvez le texte dans `spec.md`, dans le dossier de cette fonctionnalité. Vous l'ouvrez dans l'éditeur, comme n'importe quel fichier du dépôt.

Le fichier qui décrit ce skill est `.cursor/skills/speckit-specify/SKILL.md`. Le nom du dossier devient l'invocation : `/speckit-specify`. Taper la même ligne dans un terminal ne lance pas le skill. Le terminal a servi à `specify`. Le chat sert aux skills.

> [!IMPORTANT]
> Vous lisez `spec.md` avant de continuer. Huit places, 45 € affichés, attente jusqu'à 12, phrase des 18 h, aucun téléphone sur la page publique. Si un nombre a bougé, vous corrigez la spec, vous n'enchaînez pas.

# spec.md avant le plan

`/speckit-plan` décide comment construire. Il a besoin d'une spec relue. Vous ouvrez `spec.md` dans l'éditeur, vous vérifiez l'attente et la confirmation, puis vous invoquez le plan dans un **nouveau** message :

```text
/speckit-plan
Réutiliser l'application déjà en place. Ne pas recréer la liste ni le refus de la 9e.
Étendre l'app : attente ordonnée (12, 13e refusé), compte public sans téléphone,
phrase « avant 18 h » à l'écran. 45 € reste affiché. Pas de paiement, pas de SMS.
```

La pile, s'il faut la nommer, appartient à ce message, et elle est celle de l'app déjà là. La spec, elle, est restée sur le quoi et le pourquoi. Le plan ne recommence pas l'atelier dans un autre framework.

```diagram
type: flow
title: "Du dépôt au plan, dans Cursor"
steps:
  - title: Dépôt
    text: "Sève est ouvert dans l'éditeur, liste et refus déjà là."
    tone: violet
  - title: Chat
    text: "Vous invoquez /speckit-specify. Le terminal ne lance pas ce skill."
    tone: blue
  - title: spec.md
    text: "Vous relisez 8 places, 45 €, attente 12, phrase des 18 h, pas de téléphone."
    tone: teal
  - title: Plan
    text: "Ensuite seulement, /speckit-plan, dans un autre message."
    tone: amber
```

# Un skill à la fois

Le flux complet tient en plusieurs skills : préciser, clarifier, planifier, contrôler, découper, analyser, implémenter, converger. Dans Cursor, vous les invoquez **un par un**. Vous lisez l'artefact écrit. Vous décidez. Vous envoyez le skill suivant.

Un seul message qui demanderait specify, plan, tasks et implement d'un coup retire cette relecture. L'agent peut alors planifier une attente de treize noms, ou « assouplir » les huit places pour coller au remplissage de 70 %. La moyenne n'est pas le plafond. Vous ne la découvrez qu'en ouvrant `spec.md`.

Les workflows automatiques de Cursor sont un autre mode. Ils se traitent avec les permissions, plus loin. Ici, vous restez dans le chat, skill après skill. À l'installation, `--events false` désactive les hooks Spec Kit écrits dans `.cursor/hooks.json`. Vous ne vous en servez pas pour sauter une relecture.

> [!WARNING]
> Enchaîner tout le flux dans un prompt, c'est sauter `spec.md`. Les trois absents du mois n'autorisent ni une neuvième chaise ni une attente sans fin.

# Le fichier que Cursor charge

`.cursor/skills/speckit-specify/SKILL.md` est versionné avec le dépôt, comme les autres skills `speckit-*` posés à côté. Toute personne qui ouvre Sève dans Cursor retrouve `/speckit-specify`, `/speckit-plan`, `/speckit-clarify`. Vous pouvez ouvrir `SKILL.md` et voir qu'il décrit une étape, pas un envoi de SMS et pas un jeton.

Si le fichier manque, l'intégration n'est pas installée dans ce dépôt. Vous revenez à `specify integration install cursor-agent`. Vous ne recopiez pas un dossier de skills depuis un autre agent : l'install écrit les chemins de Cursor, et seulement ceux-là.

Quand `spec.md` vous convient, vous passez au skill suivant, dans un message neuf. Le chat garde l'historique. L'artefact, lui, est dans l'éditeur. C'est l'éditeur qui fait foi.

# Exercices

## Exercice 1 : Installer Cursor sur l'atelier

Le dépôt de Sève contient déjà la liste et le refus de la neuvième place. Vous voulez les skills dans Cursor. Quelle commande lancez-vous, et où invoquez-vous ensuite `/speckit-specify` ?

<details>
<summary>Voir la solution</summary>

Si Spec Kit n'est pas encore dans ce dépôt : vous committez ou vous sauvegardez, puis `specify init --here --force --integration cursor-agent`. Si le kit est déjà là et que seul Cursor manque : `specify integration install cursor-agent`. Un dossier neuf, lui, naît avec `specify init seve --integration cursor-agent`. La clé est `cursor-agent`.

Ensuite vous ouvrez **ce** dépôt dans Cursor. Vous invoquez `/speckit-specify` dans le chat. La même ligne dans le terminal ne lance pas le skill. Le skill écrit `spec.md` et note la fonctionnalité dans `.specify/feature.json`, le pointeur local de cette copie de travail.

</details>

## Exercice 2 : Un seul message pour tout le flux

Un collègue colle dans le chat : « Fais specify, plan, tasks et implement de l'attente, et passe à 10 places si le remplissage de 70 % le justifie. » Que faites-vous à la place ?

<details>
<summary>Voir la solution</summary>

Vous n'envoyez pas ce message. Vous invoquez `/speckit-specify` seul : attente dans l'ordre d'arrivée, 12e accepté, 13e refusé, page publique sans téléphone, phrase « avant 18 h » à l'écran. Le plafond reste 8 places, le prix 45 € affiché, sans paiement et sans SMS. Le remplissage de 70 % et les trois absents expliquent le besoin. Ils n'élargissent pas le stage.

Vous ouvrez `spec.md` dans l'éditeur. Vous vérifiez les nombres. Ensuite, dans un autre message, `/speckit-plan`, en demandant de réutiliser l'application déjà en place. Tasks et implement attendent leur tour, chacun après lecture de son artefact.

</details>

## Exercice 3 : Le skill tapé au terminal

Dans le terminal, à la racine de Sève, quelqu'un lance `/speckit-specify` puis cherche `spec.md`. Rien n'a été écrit. Où était l'invocation, et quel fichier doit exister pour que Cursor la propose ?

<details>
<summary>Voir la solution</summary>

L'invocation appartient au chat de l'agent, le dépôt étant ouvert dans Cursor. Le terminal sert à l'init (`specify init seve --integration cursor-agent`, ou `specify init --here --force --integration cursor-agent` sur le dépôt plein) et, si le kit est déjà là, à `specify integration install cursor-agent`. Il ne lance pas les skills.

Le fichier attendu est `.cursor/skills/speckit-specify/SKILL.md`. S'il manque, vous réinstallez l'intégration. Vous ne le recréez pas en copiant le dossier d'un autre agent. Une fois le skill disponible, vous relisez `spec.md` dans l'éditeur avant `/speckit-plan`.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Spec Kit dans Cursor"
center: "Dans Cursor, /speckit-specify se tape dans le chat. Vous ouvrez spec.md avant /speckit-plan."
points:
  - icon: terminal
    title: "cursor-agent"
    text: "specify integration install cursor-agent sur le dépôt déjà là. init si le dossier naît."
  - icon: chat
    title: "Le chat"
    text: "Le skill s'invoque par /speckit-specify. Le terminal ne lance pas cette étape."
  - icon: file
    title: "spec.md"
    text: "Vous le relisez dans l'éditeur : 8 places, 45 €, attente 12, 18 h la veille."
  - icon: list
    title: "Un par un"
    text: "Un skill par message. Vous lisez l'artefact, puis vous invoquez le suivant."
  - icon: shield
    title: "Le plafond"
    text: "70 % de remplissage et 3 absents n'ouvrent pas une 9e place."
pitfall: "Tout le flux dans un seul prompt, ou /speckit-specify lancé dans le terminal au lieu du chat."
remember: "Ouvrez Sève, invoquez le skill dans le chat, relisez spec.md, puis seulement /speckit-plan."
```
