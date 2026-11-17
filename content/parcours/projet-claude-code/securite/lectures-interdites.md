---
title: "Interdire la lecture d'un fichier"
description: "Un fichier .claudeignore ne fait rien. On refuse la lecture dans .claude/settings.json, le bac à sable tient le shell, et le secret le plus sûr reste hors du dossier."
duration: 50
objectives:
  - "Remplacer un .claudeignore inutile par des règles Read dans permissions.deny"
  - "Distinguer .gitignore, respectGitignore et un vrai refus de lecture"
  - "Compléter le refus par le bac à sable pour le shell, sans croire que tout est couvert"
  - "Garder le secret hors du dossier de travail de l'Atelier Sève"
---

# Un fichier .claudeignore ne fait rien

Vous pouvez trouver, à la racine d'un dépôt, un fichier nommé `.claudeignore`, avec une ligne `.env` et une ligne `secrets/`. Il n'a aucun effet. Claude Code ne s'en sert pas pour refuser une lecture. Le laisser en place donne une protection qui n'existe pas.

La documentation le dit : ces lignes se déplacent vers des règles de refus. Vous les recopiez sous la forme attendue dans `.claude/settings.json`, puis vous ne comptez plus sur le fichier ignoré. Sur App Sève, le fichier qui ne doit pas être lu est celui des secrets d'envoi, pas la description des stages. Le samedi, 10 h à 13 h, à Lyon Croix-Rousse, 8 places, 45 € : cela se lit. Le secret, non.

> [!WARNING]
> Un `.claudeignore` présent dans le dépôt ne bloque pas l'outil Read. S'il existe, ses lignes vont dans des règles deny. Le fichier, lui, ne protège rien.

# Refuser dans settings.json

Le refus se écrit dans `.claude/settings.json`, le fichier de réglages du projet, sous `permissions.deny`. Trois règles couvrent le cas de Sève :

```json
{
  "permissions": {
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)"
    ]
  }
}
```

`Read(./.env)` vise le fichier d'environnement à la racine. `Read(./.env.*)` vise les variantes du même nom. `Read(./secrets/**)` vise le dossier des secrets. Ces refus s'appliquent dans tous les modes de permission. Le mode qui saute les questions ne les lève pas. Une allowlist, ailleurs dans le même fichier, ne creuse pas un trou dans un deny : le refus est évalué d'abord.

Vous ne mettez pas la valeur du secret dans cet exemple. Vous mettez le chemin. Léa Vernet n'a pas besoin que la session lise la clé pour afficher 12 stages, un remplissage autour de 70 %, ou le rappel que trois personnes par mois oublient le SMS. Le besoin d'un rappel ne se traduit pas par une lecture.

# Gitignore n'arrête pas Read

`.gitignore` dit à Git ce qu'il ne propose pas de committer. Il ne dit pas à l'outil Read de s'arrêter. Un `.env` ignoré par Git peut quand même être ouvert par Claude Code, si rien d'autre ne l'interdit. Vous pouvez avoir les deux : le fichier hors des commits, et malgré cela une lecture qui réussit.

Le réglage `respectGitignore` est actif par défaut. Il cache ces fichiers du sélecteur `@`. Quand vous tapez `@` pour joindre un fichier au message, la liste ne montre pas ce que Git ignore. C'est utile, et c'est étroit. Le réglage ne refuse pas la lecture. Une demande qui nomme le chemin, ou un outil qui ouvre le fichier sans passer par `@`, n'est pas arrêté par ce masque.

| Mécanisme | Ce qu'il fait | Ce qu'il ne fait pas |
|---|---|---|
| `.claudeignore` | Rien | Il ne refuse pas Read |
| `.gitignore` | Écarte le fichier des commits | Il n'empêche pas Read |
| `respectGitignore` | Cache le fichier du sélecteur `@` | Il ne refuse pas la lecture |
| `permissions.deny` | Refuse Read sur les chemins écrits | Il ne couvre pas chaque astuce du shell |

Le sélecteur `@` n'est donc pas une serrure. C'est une liste d'aide à la saisie. La serrure, pour l'outil de lecture, est la règle deny.

# Le script qui ouvre le fichier

Une règle `Read(...)` arrête l'outil Read sur le chemin indiqué. Elle ne couvre pas toutes les astuces du shell. Un script qui ouvre le fichier lui-même, sans passer par l'outil Read, n'est pas arrêté par cette seule ligne. Le refus du fichier n'est pas, à lui seul, un refus de tous les programmes que le shell peut lancer.

Vous ne collectionnez pas ces astuces, et vous n'en essayez pas « pour vérifier ». Vous retenez la limite : deny vise la lecture outillée du chemin. Dès qu'un programme ouvre le fichier de son côté, il faut un autre contrôle, plus bas. Sur Sève, la session n'a de toute façon pas de raison de lancer un script dont le but serait d'afficher un secret. Si une commande ressemble à cela, vous la refusez dans la session, règle ou pas.

> [!IMPORTANT]
> `permissions.deny` et le shell ne se recouvrent pas entièrement. Un script qui ouvre le fichier lui-même passe à côté d'une règle Read seule.

# Le bac à sable pour le shell

Pour le shell, le contrôle plus fort est le bac à sable. Vous l'activez avec `sandbox.enabled`, et vous interdisez des chemins avec `filesystem.denyRead`. L'écriture n'est pas la même que dans `permissions.deny` : on n'y recolle pas le mot `Read(...)`. On y met des chemins.

```json
{
  "sandbox": {
    "enabled": true,
    "filesystem": {
      "denyRead": ["./.env", "./secrets"]
    }
  }
}
```

Ce bloc vise les commandes lancées dans le bac à sable. Il ne remplace pas les règles `Read(./.env)`, `Read(./.env.*)` et `Read(./secrets/**)`. Un `denyRead` du bac à sable n'arrête pas, à lui seul, l'outil Read : cet outil suit les permissions. Vous gardez les deux. Le bac à sable n'est pas actif tant que `sandbox.enabled` n'est pas vrai. L'écrire seulement dans un pense-bête ne le met pas en marche.

Les refus de lecture, eux, restent valables dans tous les modes de permission, bac à sable ou non. Le bac à sable ajoute la barrière du shell. Il ne retire pas la barrière de l'outil.

```diagram
type: layers
title: "Du plus faible au plus sûr"
layers:
  - title: "Fichiers d'ignore"
    text: ".claudeignore ne fait rien. .gitignore et respectGitignore n'arrêtent pas Read."
  - title: "permissions.deny"
    text: "Read(./.env), Read(./.env.*) et Read(./secrets/**), dans tous les modes."
  - title: "Bac à sable"
    text: "sandbox.enabled et filesystem.denyRead tiennent mieux le shell."
  - title: "Hors du dossier"
    text: "Le secret qui n'est pas dans le dossier de travail."
```

# Le secret hors du dossier

Le plus sûr reste un secret qui n'est pas dans le dossier de travail. Ni deny, ni bac à sable, ni sélecteur `@` n'ont à le protéger s'il n'est pas là où la session lit sans demande. Le dossier de Sève garde la règle : 8 places, attente jusqu'à 12, 45 €, décision avant 18 h la veille. Il ne garde pas la clé qui enverrait le SMS des trois absents.

Vous pouvez montrer les noms des variables dans un exemple sans valeurs. Vous ne ramenez pas le fichier réel « pour que la session comprenne le rappel ». Les 12 stages du mois et le remplissage autour de 70 % s'expliquent sans elle. Lyon Croix-Rousse et le créneau de 10 h à 13 h aussi.

Si le secret est déjà dans le dossier, les règles ci-dessus limitent la lecture. Elles ne transforment pas le dossier en coffre. Vous le sortez du dossier de travail dès que vous le pouvez, et vous ne demandez pas à la session de le recopier ailleurs dans le dépôt pour le « mettre à l'abri ». À l'abri, ici, veut dire : pas dans les fichiers que Claude Code parcourt.

# Exercices

## Exercice 1 : Le fichier qui rassure

Le dépôt App Sève contient un `.claudeignore` avec `.env` et `secrets/`. Quelqu'un dit : « C'est bon, Claude Code ne peut plus les lire. » Que répondez-vous, et qu'écrivez-vous à la place ?

<details>
<summary>Voir la solution</summary>

Vous répondez que `.claudeignore` n'a aucun effet. La documentation dit de déplacer ces lignes vers des règles deny. Dans `.claude/settings.json`, `permissions.deny` reçoit `Read(./.env)`, `Read(./.env.*)` et `Read(./secrets/**)`.

Ces refus s'appliquent dans tous les modes de permission. Vous ne laissez pas le fichier `.claudeignore` comme seule protection. Le secret le plus sûr reste tout de même hors du dossier de travail.

</details>

## Exercice 2 : Caché du sélecteur

`.env` est dans `.gitignore`. `respectGitignore` est resté sur sa valeur par défaut. La session propose quand même de lire `./.env` pour « tester le rappel ». Est-ce que le sélecteur `@` ou Git ont déjà interdit cette lecture ?

<details>
<summary>Voir la solution</summary>

Non. `.gitignore` n'empêche pas l'outil Read. `respectGitignore`, actif par défaut, cache seulement le fichier du sélecteur `@`. Nommer le chemin dans la demande contourne ce masque. Vous refusez la lecture dans la session, et vous vous appuyez sur `permissions.deny`, pas sur l'absence du fichier dans la liste `@`.

Les trois absents du mois n'ouvrent pas `.env`. La page se fait avec 8 places, 45 €, l'attente jusqu'à 12 et la décision avant 18 h la veille.

</details>

## Exercice 3 : Le script à côté

Les trois règles Read sont en place. La session propose ensuite un petit script dont le seul effet est d'ouvrir `.env` et d'en afficher le contenu, « puisque l'outil Read est refusé ». Qu'est-ce qui manque, et quelle décision tenez-vous ?

<details>
<summary>Voir la solution</summary>

Une règle deny ne couvre pas cette astuce : un script qui ouvre le fichier lui-même ne passe pas par l'outil Read. Pour le shell, le contrôle plus fort est le bac à sable, avec `sandbox.enabled` et `filesystem.denyRead`. Vous refusez le script dans la session. Vous ne le lancez pas « pour voir ».

Le bac à sable ne remplace pas les règles Read, et l'inverse non plus. Le plus sûr reste de ne pas avoir le secret dans le dossier de travail de Léa Vernet.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Lecture interdite
center: "Un .claudeignore ne fait rien. Refusez Read dans settings.json. Le secret le plus sûr n'est pas dans le dossier."
points:
  - icon: file
    title: Aucun effet
    text: "Le fichier .claudeignore ne bloque pas Read. La documentation dit de passer ces lignes en règles deny."
  - icon: shield
    title: permissions.deny
    text: "Read(./.env), Read(./.env.*) et Read(./secrets/**). Ces refus valent dans tous les modes."
  - icon: eye
    title: Sélecteur @
    text: "respectGitignore, actif par défaut, cache le fichier du sélecteur @. .gitignore n'arrête pas Read."
  - icon: terminal
    title: Bac à sable
    text: "Un script qui ouvre le fichier échappe au deny. sandbox.enabled et filesystem.denyRead tiennent le shell."
  - icon: key
    title: Hors du dossier
    text: "Le plus sûr est un secret absent du dossier de travail. Les règles limitent, elles ne coffrent pas."
pitfall: "Croire qu'un .claudeignore, un .gitignore ou le sélecteur @ empêchent Claude Code de lire .env."
remember: "Deny sur Read, bac à sable pour le shell, et le secret hors du dossier. .claudeignore ne fait rien."
```
