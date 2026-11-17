---
title: "Installer specify"
description: "Python 3.11 ou plus, Git, et uv pour installer specify-cli. specify version lit l'outil. specify self check ne le met pas à jour. Une 0.1.6 ignore --integration."
duration: 50
objectives:
  - "Installer la commande specify avec uv tool install specify-cli"
  - "Lire specify version sans traiter un numéro comme le seul valable"
  - "Utiliser specify self check comme un contrôle en lecture seule"
  - "Reconnaître qu'une vieille 0.1.6 ne connaît pas --integration, et que Windows reçoit des scripts PowerShell"
---

# Ce qui doit être là

Vous installez l'outil avant d'ouvrir le dépôt de Sève. Trois préalables suffisent. Python 3.11 ou une version plus récente. Git, parce que l'atelier vit dans un dépôt et que vous y committerez. uv, recommandé pour installer le paquet.

Le paquet publié s'appelle `specify-cli`. La commande qu'il fournit s'appelle `specify`. GitHub Spec Kit est le produit. Vous n'avez pas un second nom à retenir, ni un second binaire. Si `python` ou `py` affiche une version inférieure à 3.11, vous mettez Python à jour avant le reste. Si `git` est inconnu, vous l'installez avant d'initialiser Sève.

uv est le chemin de ce chapitre. Si le terminal répond que `uv` est introuvable, vous installez uv, puis vous revenez à la commande du paquet. Vous ne bricolez pas une copie à la main du dépôt de Spec Kit pour « aller plus vite » : la commande `specify` doit être celle du paquet, disponible dans le terminal.

> [!NOTE]
> Le fil rouge ne change pas pendant l'installation. Léa Vernet, Croix-Rousse, samedi 10 h-13 h, huit places, 45 €. L'outil ne décide aucun de ces nombres.

# Installer le paquet specify-cli

Dans le terminal, une commande installe l'outil pour votre utilisateur :

```text
uv tool install specify-cli
```

Puis vous vérifiez que le shell trouve la commande :

```text
specify version
```

`specify version` affiche la version installée. C'est un contrôle local : la commande répond, un numéro s'affiche. Ce numéro dit ce que vous avez. Il ne dit pas, à lui seul, si l'exécutable vient de l'index des paquets ou d'une autre source. Pour Sève, l'information utile est plus simple : `specify` répond.

Si `specify-cli` était déjà installé, la même commande `uv tool install specify-cli` peut conserver cette copie, même quand une publication plus récente existe. Vous ne concluez donc pas « j'ai relancé l'install, donc j'ai le dernier ». Vous lisez `specify version`. Pour remplacer l'ancienne copie avec uv, la forme est `uv tool install --force specify-cli`. Vous ne choisissez pas un numéro unique à figer dans le cours.

> [!IMPORTANT]
> Le paquet est `specify-cli`. La commande est `specify`. `specify version` se lance après l'install, dans le même terminal.

# Lire la version sans la figer

Un numéro de version n'est pas un sésame. Plusieurs versions récentes savent initialiser un projet pour Cursor. Le cours ne couronne pas un seul numéro comme « le bon ». Vous regardez ce que votre commande sait faire, pas une étiquette apprise par cœur.

Le réflexe tient en deux lectures. `specify version` vous dit ce qui est installé maintenant. Quand vous voudrez savoir si une publication plus récente existe, vous utiliserez le contrôle du chapitre suivant, qui ne modifie rien. Vous décidez ensuite, explicitement, si vous remplacez l'outil.

Pour l'atelier, la conséquence est concrète. Vous préparez la confirmation visible et la liste d'attente ordonnée. Une install figée sur un très vieux `specify` vous bloquera au moment d'indiquer l'agent. Une install récente, obtenue par la commande ci-dessus ou par son `--force` si une vieille copie traînait, laisse passer la suite. Le critère est le comportement, pas un numéro sacré.

> [!TIP]
> Notez le numéro que `specify version` affiche chez vous. Il sert à comparer, pas à remplacer la commande d'install dans vos notes.

# Un contrôle qui ne met rien à jour

Quand l'outil est en place, vous pouvez demander s'il existe une publication plus récente :

```text
specify self check
```

Ce contrôle est en lecture seule. Il ne télécharge pas une nouvelle copie, il ne réécrit pas la commande, il ne touche pas au dépôt de Sève. S'il signale qu'une version plus récente existe, votre `specify` actuel est inchangé. La mise à jour est un autre geste, celui de l'install : `uv tool install --force specify-cli`, lancé par vous, quand vous l'avez décidé.

Confondre les deux est le piège le plus fréquent après une vieille install. Le contrôle annonce une nouveauté. Le terminal a l'air d'avoir « fait quelque chose ». La commande `specify version`, relancée juste après, montre le même numéro qu'avant. Rien n'a bougé, et c'est le contrat de `specify self check`.

```diagram
type: flow
title: "Constater, puis seulement ensuite remplacer"
steps:
  - title: Installer
    text: "uv tool install specify-cli fournit la commande specify."
    tone: blue
  - title: Lire
    text: "specify version affiche le numéro présent. Aucun numéro n'est le seul valable."
    tone: teal
  - title: Contrôler
    text: "specify self check signale une nouveauté éventuelle, sans rien modifier."
    tone: amber
  - title: Décider
    text: "Le remplacement, si vous le voulez, est uv tool install --force specify-cli."
    tone: violet
```

> [!WARNING]
> `specify self check` ne met pas `specify` à jour. Une phrase du terminal qui parle d'une version plus récente laisse votre install telle quelle.

# Quand l'option est inconnue

Le drapeau actuel, pour choisir l'agent au moment de l'init, est `--integration`. Vous le verrez au chapitre suivant, avec la clé `cursor-agent`. Ici, vous apprenez seulement à reconnaître un outil trop ancien pour ce drapeau.

Une version 0.1.6 ne connaît pas `--integration`. L'init répond alors que l'option n'existe pas (`No such option: --integration`). Ce n'est pas un dépôt Sève mal préparé. C'est la commande elle-même, trop vieille pour le flux de ce parcours. `specify version` affichera 0.1.6, et `uv tool install specify-cli` sans `--force` peut très bien l'avoir laissée en place.

Vous la remplacez par `uv tool install --force specify-cli`, puis vous relisez `specify version`. Vous ne cherchez pas « le » numéro du cours : vous cherchez une commande qui accepte `--integration`. Tant que le message `No such option: --integration` revient, l'init de Sève n'a pas commencé.

Gardez les nombres de Léa hors de ce dépannage. Huit places, attente de douze, 45 €, décision avant 18 h : rien de cela ne se règle en changeant de version. L'outil sert à spécifier la confirmation visible et la file ordonnée. Il ne choisit pas le métier.

# PowerShell, par défaut sous Windows

L'installation de la commande et les scripts du projet sont deux choses. `specify` s'utilise dans le terminal que vous avez déjà. Quand vous initialiserez le dépôt, Spec Kit copiera aussi des scripts dans le projet. Sous Windows, ces scripts sont PowerShell par défaut. Vous n'avez pas à le redemander.

Vous reconnaîtrez plus tard le dossier `.specify/scripts/powershell/`. Sur cette machine, c'est l'emplacement normal, pas un repli. Inutile de partir à la recherche de scripts bash comme si le défaut vous avait oublié. Le défaut Windows est PowerShell.

Cela ne change pas le rôle du terminal. Il installe, il initialise, il affiche `specify version`, il lance `specify self check`. Les skills de la confirmation, elles, resteront dans le chat. Trois absents par mois et le SMS oublié ne se règlent pas au moment de l'install : ils se spécifieront quand l'outil répondra.

> [!NOTE]
> Python 3.11 ou plus, Git, uv, puis `uv tool install specify-cli` et `specify version`. Le contrôle `specify self check` se lit. Il ne remplace pas l'outil.

# Exercices

## Exercice 1 : La commande qui répond

Vous ouvrez un terminal neuf sur la machine qui servira pour Sève. Écrivez les deux commandes, dans l'ordre, qui installent l'outil avec uv et montrent qu'il répond. Dites ce que la seconde vous apprend, et ce qu'elle ne fige pas.

<details>
<summary>Voir la solution</summary>

Vous lancez `uv tool install specify-cli`, puis `specify version`. La seconde prouve que la commande `specify` est disponible et affiche le numéro installé. Ce numéro n'est pas « le seul valable » du cours : il décrit votre machine.

Le paquet s'appelle `specify-cli`. S'il était déjà là, l'install sans `--force` peut avoir gardé l'ancienne copie. Vous lisez le numéro au lieu de supposer que la relance a tout remplacé.

</details>

## Exercice 2 : Le contrôle trop bavard

`specify self check` affiche qu'une publication plus récente existe. Un collègue dit : « C'est bon, l'outil vient de se mettre à jour. » Que vérifiez-vous, et quelle commande mettrait vraiment à jour, si vous le décidez ?

<details>
<summary>Voir la solution</summary>

`specify self check` est en lecture seule. Il ne modifie pas l'installation. Vous relancez `specify version` : le numéro est celui d'avant le contrôle.

La mise à jour est un geste séparé, assumé. Avec uv, c'est `uv tool install --force specify-cli`. Vous ne la lancez pas seulement parce que le contrôle a parlé, et vous ne collez pas un numéro unique comme seule version autorisée.

</details>

## Exercice 3 : L'option inconnue

`specify version` affiche 0.1.6. L'init que vous préparez pour Cursor répond `No such option: --integration`. Où est le problème, et que faites-vous sous Windows une fois l'outil à jour ?

<details>
<summary>Voir la solution</summary>

Le problème est la commande, pas le dépôt de Léa. Une 0.1.6 ne connaît pas `--integration`. `uv tool install specify-cli` sans `--force` a pu laisser cette copie. Vous lancez `uv tool install --force specify-cli`, puis `specify version`. Vous cherchez une commande qui accepte le drapeau, pas un numéro sacré.

Sous Windows, les scripts que l'init placera dans le projet sont PowerShell par défaut. Vous ne les chercherez pas d'abord comme des scripts bash. La confirmation visible et l'attente ordonnée viendront après, dans le chat.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Installer la commande
center: "uv installe specify-cli. specify version affiche le numéro, sans le figer. specify self check lit, et ne met rien à jour."
points:
  - icon: tool
    title: Le paquet
    text: "Python 3.11 ou plus, Git, uv. La commande est uv tool install specify-cli."
  - icon: terminal
    title: La commande
    text: "specify version prouve que specify répond. Le numéro se lit, il ne se fige pas."
  - icon: eye
    title: Le contrôle
    text: "specify self check est en lecture seule. Une nouveauté annoncée ne remplace rien."
  - icon: alert
    title: La 0.1.6
    text: "Cette vieille commande ne connaît pas --integration. On la remplace, sans numéro sacré."
  - icon: file
    title: Windows
    text: "Les scripts du projet y sont PowerShell par défaut. Le terminal, lui, sert à installer."
pitfall: "Croire que specify self check a mis l'outil à jour, ou traiter un seul numéro de version comme le seul valable."
remember: "Installez avec uv, lisez specify version, et laissez self check en lecture seule. Une 0.1.6 ignore --integration."
```
