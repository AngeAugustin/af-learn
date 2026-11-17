---
title: "Installer Claude Code et ouvrir une session"
description: "Installer Claude Code, se placer dans le dépôt Sève, lancer claude, et vérifier le dossier. /init peut préparer un CLAUDE.md. git status se lit avant de donner le moindre travail."
duration: 50
objectives:
  - "Installer Claude Code et vérifier que la commande claude répond dans un terminal neuf"
  - "Ouvrir la session dans le dépôt Sève, et reconnaître un mauvais dossier"
  - "Lire git status avant de confier du travail à la session"
  - "Lancer /init comme brouillon de CLAUDE.md, puis relire le fichier"
---

# Installer l'outil

Claude Code est un programme de terminal. Vous l'installez une fois, puis vous l'ouvrez dans le dépôt, comme vous ouvrez `git`. Le site documente un installateur natif. Sur macOS, Linux ou WSL, dans un terminal :

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Sur Windows, dans PowerShell :

```powershell
irm https://claude.ai/install.ps1 | iex
```

Le téléchargement peut rester silencieux un moment. Vous attendez la fin. Vous ouvrez ensuite un **nouveau** terminal, pour que le chemin de la commande soit pris en compte. Si `npm` et Node.js 22 sont déjà là, une autre voie existe : `npm install -g @anthropic-ai/claude-code@latest`, sans `sudo`. Les deux voies installent le même outil. Vous n'en choisissez qu'une.

> [!NOTE]
> Sur Windows, Git for Windows est recommandé. Claude Code s'en sert pour l'outil Bash. Sans lui, les commandes de la session passent par PowerShell. Dans les deux cas, vous lisez chaque commande avant de dire oui.

# Voir que la commande répond

Dans le terminal neuf :

```bash
claude --version
```

Une version s'affiche. La commande est utilisable. Si le shell répond que `claude` est introuvable, le dossier d'installation n'est pas encore sur le PATH. Vous fermez le terminal, vous en ouvrez un autre, vous relancez `claude --version`. C'est le contrôle d'installation. Il ne touche aucun projet.

Vous gardez cette vérification courte. Pas de dépôt, pas de prompt, pas de « construis Sève ». Une version affichée veut dire que l'outil est là. Le travail de Léa commence seulement quand vous êtes dans le bon dossier.

> [!TIP]
> Notez le numéro affiché quelque part dans votre tête, ou relancez `claude --version` le jour où un comportement vous étonne. Une session et une version, c'est déjà un contexte que vous savez nommer.

# Se placer dans le dépôt Sève

La session agit dans le dossier courant, celui où vous lancez `claude`. Vous vous y placez avant. C'est le dépôt de l'application Sève, celui qui contient déjà le code ou l'embryon de code de l'atelier : les stages du samedi, 10 h-13 h, huit places, 45 €.

```bash
cd chemin/vers/seve
```

`chemin/vers/seve` est le dossier du dépôt sur votre machine. Vous le reconnaissez à ce que `git status` y répond. Un lancement depuis le dossier personnel, ou depuis un autre projet, ouvre une session sur les mauvais fichiers. Elle lira autre chose que les stages. Elle pourra proposer d'écrire au mauvais endroit, avec beaucoup d'assurance.

Si vous vous en apercevez après le lancement, vous quittez avec `/exit`. Vous refaites le `cd`. Vous relancez `claude`. Recommencer tout de suite coûte moins cher qu'un diff déposé dans le mauvais arbre.

> [!WARNING]
> Une session ouverte dans le mauvais dossier reste une vraie session. Elle peut lire et, si vous dites oui, modifier ce qu'elle a sous les yeux. Le chemin se vérifie avant la première demande de travail.

# git status avant le travail

Juste avant `claude`, vous lisez l'état Git. La commande est la vôtre, dans le shell :

```bash
git status
```

Deux issues utiles. L'arbre est propre : `nothing to commit, working tree clean`, ou l'équivalent en français selon la langue de Git. Tout fichier qui apparaîtra ensuite vient de la session, et vous le verrez. L'arbre est sale : des fichiers sont déjà modifiés ou non suivis. Vous les notez, par leur nom. Le diff de fin de session se lira en les mettant de côté. Mélanger vos brouillons et les éditions de l'agent rend la relecture opaque.

Vous notez aussi la branche. Travailler sur `main` avec des modifications déjà présentes, puis laisser la session en ajouter, complique le moment où vous devrez expliquer le diff. Pour ce premier lancement, un arbre que vous savez décrire suffit. Vous ne nettoyez pas au hasard. Vous savez ce qui était là avant le premier oui.

> [!IMPORTANT]
> `git status` se lit avant de donner du travail. Il dit ce qui est déjà à vous. Sans cette lecture, le diff de fin de session mélange deux histoires.

# Lancer claude et reconnaître le dossier

```bash
claude
```

La session interactive s'ouvre. Le chemin affiché au démarrage est celui du dépôt. Vous le comparez au dossier du `cd`. Sève, pas votre dossier personnel, pas un clone voisin. En cas de doute, `/exit`, puis `pwd` (ou `Get-Location` dans PowerShell), puis un nouveau `claude` depuis le bon endroit.

La session attend une demande. La première minute ne contient pas encore l'incrément. Vous pouvez demander le chemin qu'elle voit, et la liste courte de ce qu'elle trouve à la racine, en lecture. Vous comparez à ce que `git status` vient de montrer. Les deux images doivent parler du même dépôt : l'application de l'atelier, douze stages par mois, la Croix-Rousse.

```diagram
type: sequence
title: "Du terminal à la session"
actors: ["Vous", "Shell", "Session"]
messages:
  - from: 0
    to: 1
    text: "cd vers le dépôt, puis git status"
  - from: 1
    to: 0
    text: "Branche et fichiers déjà modifiés"
  - from: 0
    to: 2
    text: "claude, dans ce dossier"
  - from: 2
    to: 0
    text: "Le chemin affiché est celui de Sève"
```

# /init peut préparer un CLAUDE.md

`/init` est une commande de la session. Elle regarde le dépôt et prépare un `CLAUDE.md` : commandes de lancement, commandes de test, conventions qu'elle trouve dans le code. Vous la lancez une fois le bon dossier confirmé, et après avoir lu `git status`. Ainsi, le fichier nouveau se voit dans un second `git status`, à côté d'un arbre que vous connaissiez.

```text
/init
```

Si un `CLAUDE.md` existe déjà, `/init` propose des améliorations au lieu de l'écraser. Vous lisez le fichier dans les deux cas. Les règles de Léa n'apparaissent pas toutes seules : huit places, 45 €, attente maximale de douze, décision avant 18 h la veille. Vous les ajouterez au moment d'écrire le `CLAUDE.md`. Ici, vous vérifiez seulement que le brouillon parle du bon projet, et que les commandes citées existent.

Vous vous arrêtez là pour cette session d'installation. Pas de formulaire, pas de « construis la page ». Le prochain travail commencera par une lecture du dépôt, avec un `git status` que vous saurez encore raconter.

# Exercices

## Exercice 1 : Le bon dossier

`claude --version` répond. Vous lancez `claude` depuis votre dossier personnel, par habitude. La session démarre. À quoi le voyez-vous, et que faites-vous avant toute demande sur les stages ?

<details>
<summary>Voir la solution</summary>

Le chemin affiché n'est pas le dépôt Sève. Vous quittez avec `/exit`. Dans le shell, vous allez dans le dossier du dépôt (`cd`), vous lancez `git status`, vous vérifiez que ce dépôt est bien celui de l'atelier, puis vous relancez `claude`.

Vous ne demandez pas où sont les stages tant que le chemin est faux. Une réponse donnée depuis le dossier personnel parlerait d'autres fichiers. Le premier contrôle reste le chemin, avant `/init` et avant tout incrément.

</details>

## Exercice 2 : Un arbre déjà sale

`git status` montre deux fichiers modifiés par vous hier, et un brouillon non suivi. Vous vouliez ouvrir la session pour la page des douze stages. Que notez-vous avant `claude` ?

<details>
<summary>Voir la solution</summary>

Vous notez les trois noms. Ce sont vos modifications, déjà là. Quand la session éditera, `git diff` contiendra les deux histoires. Vos notes permettent de les séparer.

Vous pouvez aussi remettre le dépôt dans un état que vous savez propre, si ces brouillons n'ont pas à voyager avec l'incrément. Vous ne les effacez pas sans les avoir reconnus. Ensuite seulement vous lancez `claude`, dans ce même dossier.

</details>

## Exercice 3 : Le brouillon de /init

`/init` a écrit un `CLAUDE.md`. Il cite une commande de test. Il ne dit rien des huit places, ni de l'attente, ni des 18 h. Un camarade vous dit d'enchaîner : « La mémoire est prête, demande la page des stages. » Que faites-vous du fichier ?

<details>
<summary>Voir la solution</summary>

Vous lisez le `CLAUDE.md` comme un brouillon. Vous vérifiez que la commande de test existe vraiment dans le dépôt. Vous constatez que les règles de Léa manquent : 8 places, 45 €, attente 12, décision avant 18 h. Elles s'ajouteront quand vous écrirez ce fichier pour de bon. `/init` ne les invente pas, et il n'écrase pas un fichier déjà présent : ici, il a créé le premier jet.

Vous ne donnez pas encore la page des stages. `git status` doit montrer ce nouveau fichier, et vous savez qu'il est incomplet. La session d'installation s'arrête sur cette relecture.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Ouvrir la session au bon endroit
center: "Installez claude, placez-vous dans le dépôt Sève, lisez git status, puis lancez la session. /init prépare un brouillon, que vous relisez."
points:
  - icon: terminal
    title: Installer
    text: "Un terminal neuf, puis claude --version. La commande répond avant tout travail."
  - icon: compass
    title: Le dossier
    text: "cd vers le dépôt, puis claude. Le chemin affiché doit être celui de Sève."
  - icon: git
    title: git status
    text: "Vous lisez l'état du dépôt avant de donner du travail, pour reconnaître votre diff."
  - icon: file
    title: "/init"
    text: "Peut préparer un CLAUDE.md. Vous le relisez. Les règles de Léa restent à écrire."
  - icon: alert
    title: Mauvais chemin
    text: "Une session dans le dossier personnel travaille au mauvais endroit. /exit, puis cd."
pitfall: "Lancer claude depuis le mauvais dossier, ou donner du travail sans avoir lu git status."
remember: "Version, dépôt Sève, git status, puis claude. /init propose un CLAUDE.md. Vous le lisez avant de coder."
```
