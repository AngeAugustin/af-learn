---
title: Connecter un outil MCP
description: "Brancher un seul outil utile dans .mcp.json pour lire le tableau des stages de Sève, garder les serveurs personnels dans ~/.claude.json, et laisser les schémas se charger à la demande."
duration: 50
objectives:
  - "Placer le serveur partageable dans .mcp.json à la racine du projet"
  - "Laisser les serveurs personnels dans ~/.claude.json"
  - "Brancher uniquement la lecture du tableau des stages, sans secret en clair"
  - "Contrôler l'état de la connexion avec /mcp"
---

# Un outil utile, pas une vitrine

Léa Vernet tient Atelier Sève à Lyon Croix-Rousse. App Sève doit connaître les stages : 12 dans le mois, 45 €, le samedi de 10 h à 13 h, 8 places. L'attente en prend 12 au plus. La confirmation se décide avant 18 h la veille. Environ 70 % des places se remplissent. 3 personnes manquent chaque mois parce qu'un SMS a été oublié.

Claude Code, dans le terminal, peut appeler un outil MCP. MCP désigne un petit serveur d'outils branché sur la session. Pour la liste, un seul outil suffit : lire le tableau des stages. Un serveur de messagerie, un navigateur et une base d'administration en plus n'aident pas cet incrément. Ils ajoutent des permissions et des pannes.

L'outil renvoie le tableau. Il ne réserve pas à la place de la règle des 8 places, et il n'envoie pas le SMS manquant.

# .mcp.json à la racine

Le fichier partageable s'appelle `.mcp.json`. Il est à la racine du projet, à côté du code d'App Sève, pas dans un dossier caché au hasard. On peut le committer. Toute personne qui ouvre le dépôt voit le même serveur.

```json
{
  "mcpServers": {
    "tableau-stages": {
      "command": "node",
      "args": ["outils/tableau-stages.js"]
    }
  }
}
```

`tableau-stages` est le nom du serveur. La commande lance un programme du dépôt qui lit le tableau local. La session peut alors demander les 12 lignes : lieu Croix-Rousse, samedi 10 h-13 h, 45 €, 8 places. Léa vérifie que la commande ne contient ni jeton ni mot de passe.

Le fichier décrit le branchement. La règle « la 9e place est refusée » reste dans le code et dans le test. L'outil éclaire la liste. Il ne la remplace pas.

# Le personnel reste sur la machine

Les serveurs personnels vont dans `~/.claude.json`. Un essai que Léa mène seule, un outil lié à son compte, un serveur qu'elle ne veut pas imposer à l'équipe : cet emplacement les garde. Ils ne sont pas dans le dépôt.

Deux fichiers, deux publics.

| Fichier | Qui le voit | Usage pour Sève |
| --- | --- | --- |
| `.mcp.json` | Le dépôt, donc l'équipe | Lire le tableau des stages |
| `~/.claude.json` | La machine de Léa | Un serveur d'essai personnel |

```diagram
type: compare
title: "Où brancher le serveur"
columns:
  - title: ".mcp.json"
    tone: teal
    items:
      - "Racine du projet"
      - "Partageable avec le dépôt"
      - "Lecture du tableau des stages"
  - title: "~/.claude.json"
    tone: violet
    items:
      - "Serveurs personnels"
      - "Restent sur la machine"
      - "Jeton hors du dépôt"
```

Mettre l'essai personnel dans `.mcp.json` force les autres à le lancer. Mettre le tableau officiel seulement dans `~/.claude.json` le cache à l'équipe. Léa choisit le fichier selon le public, puis elle relit le diff avant de committer.

# Les schémas se chargent à la demande

Chaque outil a un schéma : son nom, son rôle, ses paramètres. Ces schémas se chargent à la demande. La session ne les reçoit pas tous en bloc au premier mot. Elle va chercher le schéma de l'outil dont elle a besoin.

Ce chargement évite d'encombrer le départ. Il ne rend pas gratuit le fait de brancher dix serveurs. Chaque serveur reste une connexion à approuver, un programme qui peut échouer, un texte à relire. Pour Sève, le schéma utile est celui de la lecture du tableau. Léa le demande quand l'incrément est la liste. Elle ne charge pas un outil d'envoi « au cas où » les 3 SMS oubliés.

Si la session invente une colonne qui n'est pas dans le tableau (un prix autre que 45 €, un créneau hors samedi), Léa compare avec la ligne lue. Le schéma dit comment appeler. Le tableau dit les valeurs.

# Lire le tableau, garder le secret

L'appel utile ressemble à une question précise : « Lis le tableau des stages et donne les 12 lignes du mois. » La réponse attendue porte Croix-Rousse, 10 h-13 h, 45 €, 8 places. Léa s'en sert pour l'incrément de la liste, puis elle fait tourner le test « 12 stages à 45 € ».

Aucun secret en clair dans le dépôt. Pas de clé dans `.mcp.json`, pas de jeton dans `outils/tableau-stages.js`, pas de mot de passe dans un exemple commité. Si un serveur exige un secret, la valeur reste dans l'environnement de la machine, et le serveur personnel reste dans `~/.claude.json`. Le fichier partagé peut citer le nom d'une variable. Il ne cite pas la valeur.

Les 3 absents du mois donnent envie d'ajouter tout de suite un serveur d'envoi. Léa ne le fait pas dans cet incrément. La confirmation avant 18 h est une règle de l'app, sur sa branche. Un jeton de SMS dans `.mcp.json` serait un secret partagé par erreur.

# /mcp montre l'état

Dans la session, `/mcp` affiche l'état des serveurs. Léa l'ouvre après avoir ajouté `.mcp.json`. Elle vérifie que `tableau-stages` est bien là, et que la connexion tient. Un serveur en erreur ne se devine pas au fait que l'agent « se débrouille ».

Si `/mcp` montre d'autres serveurs, venus de `~/.claude.json`, Léa les reconnaît comme personnels. Elle ne les copie pas dans le dépôt pour les aligner. Elle désactive, pour ce projet, un serveur personnel qui n'a rien à lire sur les stages.

Avant de committer `.mcp.json`, elle repasse `git diff`. Elle cherche un secret, un deuxième serveur inutile, un chemin qui n'existe que sur son portable. Le fichier doit permettre à quelqu'un d'autre de lire le même tableau. Ensuite le test nommé confirme que les 12 stages sont à 45 €.

# Exercices

## Exercice 1 : Un seul branchement

Pour l'incrément de la liste, la session propose trois serveurs dans `.mcp.json` : le tableau des stages, un envoi de SMS et un navigateur. Les 3 absents du mois viennent d'un SMS oublié. Que garde Léa ?

<details>
<summary>Voir la solution</summary>

Elle garde un seul outil utile : lire le tableau des stages. Les 12 lignes, à 45 €, le samedi 10 h-13 h à Croix-Rousse, suffisent à cet incrément.

Le serveur de SMS et le navigateur sortent de `.mcp.json`. Les 3 absents expliquent un besoin plus tard. Ils ne justifient pas deux connexions de plus, ni un jeton dans le fichier partagé. `/mcp` doit montrer le tableau, dans un état lisible.

</details>

## Exercice 2 : Où mettre l'essai

Léa essaie, seule, un serveur qui interroge son compte. L'équipe, elle, doit pouvoir lire le tableau des stages. Dans quel fichier va chaque serveur ?

<details>
<summary>Voir la solution</summary>

Le tableau des stages va dans `.mcp.json`, à la racine, parce qu'il se partage. Le serveur du compte personnel va dans `~/.claude.json`, qui reste sur la machine.

Léa ne committe pas l'essai pour « que ça marche chez moi ». Elle ne met pas le tableau officiel uniquement dans `~/.claude.json`, sinon l'équipe ne le voit pas. Les schémas se chargeront à la demande dans les deux cas. Le public du fichier ne change pas.

</details>

## Exercice 3 : Une valeur dans le JSON

Le diff de `.mcp.json` contient `"SMS_TOKEN": "sk-live-seve-croix-rousse"` à côté de `tableau-stages`. Le test « 12 stages à 45 € » est vert. Peut-on committer ?

<details>
<summary>Voir la solution</summary>

Non. Le test vert parle de la liste. Le secret en clair dans le dépôt suffit à refuser le commit. Léa retire le jeton du fichier. S'il faut un secret, il reste hors du dépôt, du côté personnel, dans l'environnement ou dans `~/.claude.json`.

Elle relit `git diff`, contrôle `/mcp`, et ne recopie pas la valeur dans la demande de revue. La règle des 8 places et l'heure de 18 h ne se règlent pas avec cette clé.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Connecter un outil MCP"
center: "Un outil pour lire les stages, dans .mcp.json, sans secret en clair."
points:
  - icon: link
    title: "Fichier partagé"
    text: ".mcp.json est à la racine du projet. L'équipe obtient le même serveur."
  - icon: lock
    title: "Fichier personnel"
    text: "Les serveurs personnels vont dans ~/.claude.json. Ils restent sur la machine."
  - icon: database
    title: "Un seul outil"
    text: "Lire le tableau : 12 stages, 45 €, samedi 10 h-13 h, Croix-Rousse."
  - icon: layers
    title: "À la demande"
    text: "Les schémas d'outils se chargent quand la session en a besoin."
  - icon: terminal
    title: "Voir /mcp"
    text: "La commande /mcp montre l'état. On ne devine pas qu'un serveur est joignable."
pitfall: "Committer un jeton SMS dans .mcp.json parce que 3 absents viennent d'un message oublié."
remember: "Un outil utile, aucun secret dans le dépôt. /mcp confirme l'état avant le commit."
```
