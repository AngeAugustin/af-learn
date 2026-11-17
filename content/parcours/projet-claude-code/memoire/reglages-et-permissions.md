---
title: "Réglages, allowlist et fichiers locaux"
description: "Le fichier .claude/settings.json se committe : permissions, hooks, variables d'environnement. settings.local.json reste personnel et hors de Git. On autorise le test, pas tout le shell."
duration: 50
objectives:
  - "Mettre dans .claude/settings.json les permissions que toute l'équipe Sève partage"
  - "Autoriser une commande de test précise, et refuser une allowlist qui ouvre tout le shell"
  - "Garder .claude/settings.local.json personnel, hors de Git"
  - "Vérifier avec git status ce qui part dans le commit"
---

# Deux fichiers, deux destinées

Claude Code lit des réglages JSON au début de la session. Dans le dépôt Sève, deux noms se ressemblent et ne jouent pas le même rôle.

`.claude/settings.json` est le fichier de l'équipe. Vous le committez. Il porte les permissions, les hooks et les variables d'environnement utiles à toute personne qui clone le projet. `.claude/settings.local.json` est le vôtre, sur ce seul dépôt. Même format. Il reste hors de Git. Quand c'est Claude Code qui l'écrit, il l'ajoute au `.gitignore`. Si vous le créez à la main, vous ajoutez vous-même la ligne `.claude/settings.local.json`.

Le `CLAUDE.md` conseille. Ces fichiers règlent. Une permission d'allowlist laisse passer une commande sans redemander. C'est pour cela qu'elle se choisit avec parcimonie, sur la commande du test, pas sur l'ensemble du shell.

> [!IMPORTANT]
> Partagé et commité : `.claude/settings.json`. Personnel et hors Git : `.claude/settings.local.json`. Le nom se vérifie avant chaque commit.

# Ce que le fichier partagé peut porter

Trois familles suffisent à connaître ici.

Les **permissions** disent quelles commandes et quels accès peuvent passer sans demande, lesquels redemandent, lesquels sont interdits. Les **hooks** sont des commandes du dépôt lancées à un moment fixé de la session, par exemple avant un outil. Vous les écrirez dans un chapitre ultérieur. Vous retenez déjà leur place : le fichier partagé, pas un message du fil. Les **variables d'environnement** du bloc `env` donnent à la session un port, un nom d'application, une valeur dont toute l'équipe a besoin. Un jeton de SMS n'en fait pas partie. Le fichier est dans le dépôt.

Les listes de permissions se cumulent entre les fichiers (utilisateur, projet, local). Une clé simple, elle, suit le fichier le plus prioritaire. Vous n'avez pas besoin de toute la table pour travailler sur Sève. Vous avez besoin de ne pas élargir `allow` « pour voir ».

```diagram
type: compare
title: "Partagé ou personnel"
columns:
  - title: settings.json
    tone: teal
    items:
      - "Committé avec le dépôt"
      - "Permissions, hooks, env"
      - "La commande de test, précise"
  - title: settings.local.json
    tone: amber
    items:
      - "Vous seul, sur ce dépôt"
      - "Hors de Git"
      - "Un essai personnel, jamais un secret"
```

# Autoriser le test, pas tout le shell

Dans `CLAUDE.md`, la commande de test de Sève est écrite, par exemple `node --test`. L'allowlist reprend **cette** commande, pas une famille entière.

```json
{
  "permissions": {
    "allow": ["Bash(node --test)"],
    "deny": ["Read(./.env)", "Read(./.env.*)"]
  }
}
```

Sans astérisque, la règle vise la commande exacte. Le test peut tourner sans une demande à chaque fois. Lancer le serveur, effacer un dossier, envoyer un message : la session redemande. Vous relisez, comme au chapitre des permissions.

La règle à ne pas committer, ni même garder pour vous par confort :

```json
{
  "permissions": {
    "allow": ["Bash(*)"]
  }
}
```

L'astérisque couvre n'importe quel texte. `Bash(*)` ouvre le shell. Une suppression large ou l'affichage d'un secret ne s'arrêtent plus sur votre oui. Le gain de temps est réel, et il retire le geste que vous êtes en train d'apprendre. Sur Sève, la commande précise du test est le seul automatisme justifié pour l'instant.

> [!WARNING]
> Une allowlist large dans le fichier local vous concerne seul, et elle vous concerne vraiment. « Tout bash, mais seulement chez moi » reste un shell ouvert sur le dépôt de Léa.

# Le fichier local reste local

`settings.local.json` sert à un essai que vous ne voulez pas imposer à l'équipe : un modèle, un réglage d'affichage, une permission le temps d'une après-midi. Vous le remettez étroit ensuite. Vous n'y posez pas le jeton des SMS. Un secret dans un fichier ignoré par Git peut quand même apparaître dans le fil si une commande l'affiche. Le bon endroit d'un secret n'est pas un JSON de session.

Vous vérifiez le `.gitignore`. La ligne est présente. `git status` ne liste pas `settings.local.json`. S'il le liste, vous arrêtez le commit, vous ignorez le fichier, et vous contrôlez qu'il n'a pas déjà été ajouté. Un fichier personnel poussé une fois reste dans l'historique tant que personne ne le retire.

> [!TIP]
> Avant d'ajouter une permission au fichier partagé, essayez-la en local, sur la commande exacte. Si elle est juste, vous la recopiez dans `settings.json` et vous retirez l'essai local.

# Ce que Git doit montrer

Avant de committer les réglages, vous lancez `git status` vous-même. Vous attendez de voir `.claude/settings.json`, et le `.gitignore` s'il a changé. Vous n'attendez pas de voir `.claude/settings.local.json`. Le diff du fichier partagé se lit ligne à ligne. `Bash(node --test)` doit être la commande du `CLAUDE.md`. Un `Bash(npm start)`, un `Bash(git push *)` ou un astérisque trop haut se discutent. Pour ce chapitre, ils ne partent pas.

Les hooks déjà présents se relisent aussi, même si vous n'en ajoutez pas aujourd'hui. Un hook commité se lance pour toute l'équipe. Vous ne le laissez pas dans le fichier « parce que la session l'a proposé » sans avoir lu la commande.

Le prix, 45 €, les huit places, l'attente de douze et les 18 h restent dans `CLAUDE.md`. Les mettre en double dans le JSON n'ajoute pas de garde-fou. Le JSON garde des commandes. Le Markdown garde le métier.

> [!NOTE]
> Les deux fichiers sont lus au lancement. Changer l'allowlist pendant la session se voit à la commande suivante. `git status`, lui, dit ce qui sera partagé. Les deux contrôles se font.

# Où lire le détail

Le plan du dossier `.claude`, des fichiers de réglages et de ce qui se committe, est tenu à jour ici : [https://code.claude.com/docs/en/claude-directory](https://code.claude.com/docs/en/claude-directory). Vous y revenez quand un nom vous est inconnu, plutôt que d'élargir une permission pour débloquer une commande.

Pour Sève, la barre est simple. Le test exact est autorisé. Le reste demande. Le fichier local ne voyage pas. Aucun secret dans l'un ni dans l'autre. La page des douze stages peut alors être modifiée dans une session où le test repasse sans que vous ayez ouvert tout le shell.

# Exercices

## Exercice 1 : La ligne à committer

Le test du dépôt est `node --test`, déjà écrit dans le CLAUDE.md. Vous préparez `.claude/settings.json` pour l'équipe. Quelle règle d'allowlist commitez-vous ?

<details>
<summary>Voir la solution</summary>

Vous commitez `Bash(node --test)`, sans astérisque. C'est la commande exacte du test. La session peut la lancer sans redemander. Le serveur, les effacements et les envois continuent de s'arrêter sur une demande.

Vous ne commettez pas `Bash(*)`, ni une famille large « pour aller plus vite » sur le formulaire. Le fichier partagé s'applique à toute l'équipe. La règle étroite est la même pour tout le monde, et elle reste relisible dans le diff.

</details>

## Exercice 2 : Le fichier qui apparaît dans git status

Vous avez créé `.claude/settings.local.json` à la main, avec un essai de permission. `git status` le montre comme fichier nouveau, à côté de `settings.json`. Que faites-vous avant le commit ?

<details>
<summary>Voir la solution</summary>

Vous ne l'ajoutez pas. Vous posez `.claude/settings.local.json` dans le `.gitignore` si la ligne manque. Un nouveau `git status` ne doit plus le proposer. Le commit emporte `settings.json`, et le `.gitignore` s'il a changé.

Vous relisez l'essai local. S'il contient `Bash(*)` ou un jeton, vous le retirez même s'il reste sur votre machine. Hors de Git ne veut pas dire sans effet sur la session. Quand Claude Code crée lui-même le fichier local, il l'ignore. Créé à la main, c'est à vous de le faire.

</details>

## Exercice 3 : Le hook surprise

La session a ajouté dans `settings.json` un hook dont la commande envoie un résumé « pour prévenir Léa », en lisant un fichier de secrets. Elle a aussi laissé `Bash(node --test)`, qui est correct. Que gardez-vous dans le commit ?

<details>
<summary>Voir la solution</summary>

Vous gardez la permission du test. Vous retirez le hook. Une commande qui lit un secret et envoie un message n'a pas sa place dans le fichier de l'équipe, même proposée pour les trois absents du mois. Vous lisez le diff entier avant de committer, pas seulement la ligne que vous attendiez.

Les règles métier restent dans CLAUDE.md : confirmation visible, Léa tranche avant 18 h la veille. Elles ne passent pas par un envoi automatique glissé dans les réglages. `git status` ne montre que les fichiers que vous avez décidé de partager.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Réglages partagés et locaux
center: "settings.json se committe avec des permissions étroites. settings.local.json reste sur votre machine. Le test oui, tout le shell non."
points:
  - icon: git
    title: À committer
    text: ".claude/settings.json porte les permissions, les hooks et les variables de l'équipe."
  - icon: lock
    title: Local
    text: ".claude/settings.local.json est personnel. Il reste hors de Git. Vous vérifiez git status."
  - icon: test
    title: Le test
    text: "Bash(node --test) si c'est la commande du CLAUDE.md. La règle vise cette commande."
  - icon: alert
    title: Pas tout le shell
    text: "Bash(*) laisse passer une suppression ou un secret sans votre oui. Vous ne l'écrivez pas."
  - icon: link
    title: La doc
    text: "Le plan du dossier .claude est sur code.claude.com, page claude-directory."
pitfall: "Committer settings.local.json, ou autoriser Bash(*) pour ne plus voir les demandes sur Sève."
remember: "Autorisez la commande de test, rien de plus large. Le fichier local ne part pas dans Git. Relisez le diff."
```
