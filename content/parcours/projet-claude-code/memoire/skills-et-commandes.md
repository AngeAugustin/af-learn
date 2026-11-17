---
title: "Skills et commandes dans .claude"
description: "Un skill est un dossier .claude/skills avec un SKILL.md, invoqué par /nom ou chargé s'il est pertinent. Les anciens fichiers .claude/commands/nom.md créent aussi la commande /nom."
duration: 50
objectives:
  - "Créer un skill de projet dans .claude/skills/nom/SKILL.md"
  - "L'invoquer avec /nom, et écrire une description qui le rend pertinent"
  - "Reconnaître qu'un ancien fichier .claude/commands/nom.md crée aussi /nom"
  - "Faire rappeler par /verifier-reservation les règles 8 places, 45 € et attente 12"
---

# Un skill est un dossier

Un skill est une consigne réutilisable, rangée dans le dépôt. Pour Sève, le chemin est :

```text
.claude/skills/verifier-reservation/SKILL.md
```

Le nom du dossier devient la commande. Ici, `/verifier-reservation`. Vous la tapez dans la session, comme `/plan` ou `/init`. Le fichier `SKILL.md` dit quoi faire. Vous le committez avec le projet : toute personne qui ouvrira une session dans le dépôt aura le même rappel.

Le `CLAUDE.md` pose les règles en permanence, au début de chaque session. Le skill les reprend au moment où vous vérifiez une réservation, avec une consigne d'action : ne rien modifier, dire quelle règle tient et laquelle casse. Les deux se complètent. Le skill ne remplace pas le fichier de projet, ni le diff.

> [!NOTE]
> Le dossier et le fichier s'appellent ainsi, avec cette casse : `SKILL.md` dans `.claude/skills/verifier-reservation/`. Un autre nom de fichier ne crée pas la commande.

# /verifier-reservation

Le skill de l'atelier rappelle les nombres que Léa a déjà fixés. Huit places. 45 €. Liste d'attente ordonnée, douze noms au plus. Vous pouvez y joindre l'heure, puisque la confirmation et les 18 h font partie du même métier. Le cœur du rappel, celui que vous invoquez en relisant un formulaire, tient dans les trois premiers.

```markdown
---
name: verifier-reservation
description: "À utiliser pour vérifier une réservation Sève : 8 places, 45 €, attente maximale de 12. Ne modifie aucun fichier."
---

Vérifie la réservation décrite par l'utilisateur.

Règles de l'atelier Sève, Lyon Croix-Rousse, Léa Vernet :

- 8 places. La 9e inscription est refusée.
- Prix : 45 €.
- Liste d'attente ordonnée, 12 noms au plus.
- Léa tranche avant 18 h la veille. La confirmation doit être visible.

Ne modifie aucun fichier. Dis quelle règle est tenue, et laquelle est cassée.
```

Dans la session, après un diff du formulaire :

```text
/verifier-reservation
Le formulaire accepte un 9e inscrit à 45 €.
L'attente n'est pas encore codée.
```

Vous attendez une réponse qui dit : la neuvième place casse la règle des huit, le prix tient, l'attente n'est pas le sujet de ce diff. Si la réponse « assouplit » à dix places, le skill ou le `CLAUDE.md` est trop mou. Vous durcissez la phrase, vous ne négociez pas avec la réponse.

> [!IMPORTANT]
> Le skill rappelle et compare. Il ne signe pas le diff. Vous relisez quand même les lignes qui refusent la neuvième place.

# Chargé quand il est pertinent

Deux portes d'entrée. Vous tapez `/verifier-reservation`. Ou la session charge le skill parce que la tâche colle à sa description : vous parlez d'une réservation, de places, d'un prix, d'une liste d'attente. La description est donc une phrase concrète, pas « aide l'atelier » ni « sois utile ».

Une description vague charge le skill trop souvent, ou jamais au bon moment. Vous y mettez les mots du métier : réservation, 8 places, 45 €, attente de 12. Vous y mettez aussi la limite : ne rien modifier. Un skill pertinent qui se met à éditer « pour corriger » sort de son rôle. L'édition reste une demande de permission, sur l'incrément en cours.

```diagram
type: flow
title: "Du dossier à la vérification"
steps:
  - title: SKILL.md
    text: ".claude/skills/verifier-reservation/SKILL.md, commité."
    tone: violet
  - title: "/nom"
    text: "Vous tapez /verifier-reservation dans la session."
    tone: blue
  - title: Pertinence
    text: "Ou la session le charge si la tâche colle à la description."
    tone: teal
  - title: Verdict
    text: "8, 45 €, attente 12. Puis vous relisez le diff vous-même."
    tone: amber
```

# Les anciens fichiers de commandes

Avant les dossiers de skills, une commande tenait dans un seul fichier :

```text
.claude/commands/verifier-reservation.md
```

Ce fichier crée aussi la commande `/verifier-reservation`. Si votre dépôt en a déjà, elles continuent de marcher. Pour un rappel nouveau, vous créez un skill : le dossier peut accueillir plus tard une note, un exemple de réservation, un texte de test, à côté de `SKILL.md`. Le fichier unique de `commands/` reste un prompt seul.

Vous évitez deux sources pour le même nom, l'une dans `commands/`, l'autre dans `skills/`, qui diraient des nombres différents. Une commande, un endroit, les nombres de Léa. Huit, 45 €, douze. L'ancienne commande se recopie dans le skill, puis vous retirez le doublon une fois la session à jour.

> [!TIP]
> Le nom du dossier est le nom de la commande, en minuscules, avec des tirets. `/verifier-reservation` se retient. `/check` ne dit pas quelle règle il porte.

# Ce que le skill ne fait pas

Il ne remplace pas le test `node --test`. Il ne remplace pas `git diff`. Il ne décide pas que l'incrément 3 est terminé parce que la réponse est bien tournée. Une liste d'attente « ordonnée jusqu'à 12 » se voit dans le code : l'ordre des noms, le refus du treizième. Le skill vous aide à poser la question. Le dépôt répond par ses lignes.

Il ne contient pas de secret, pas plus que `CLAUDE.md`. Pas de jeton, pas de numéro personnel de Léa, pas le moyen d'envoyer le SMS. La confirmation visible est une règle d'affichage dans l'application. Le skill peut rappeler que la règle des 18 h existe. Il n'envoie rien.

Vous le relisez après l'avoir fait écrire par la session, comme n'importe quel fichier. Un skill qui dit « environ 8 places » se corrige avant le commit. Les trois absents du mois, ceux du SMS oublié, justifient la ligne sur la confirmation. Ils ne justifient pas un skill qui expédie des messages.

> [!WARNING]
> Une description large, du genre « gère Sève », peut faire charger le skill au milieu d'une lecture seule, avec une consigne d'édition cachée dans le texte. La description dit quand, et le corps dit de ne pas modifier.

# Le garder aligné avec le projet

Quand une règle change, elle change au même endroit que les autres consignes durables : `CLAUDE.md` et ce skill, dans le même commit, avec le test qui la prouve. Aujourd'hui les nombres sont stables. Huit places. 45 €. Douze en attente. 18 h la veille. Le skill sert à les retrouver au moment de la revue, pas à en inventer une version plus souple pour « finir l'incrément ».

Vous pouvez l'essayer tout de suite, en lecture. Demandez `/verifier-reservation` sur une phrase : « 9 inscrits, 45 €, 13e personne proposée en attente ». La réponse utile refuse la neuvième place et le treizième nom. Ensuite vous retournez au diff. La commande a rappelé le métier. Elle n'a pas écrit le code à votre place.

# Exercices

## Exercice 1 : Créer la commande

Vous voulez un rappel, dans le dépôt, que toute l'équipe pourra taper. Où placez-vous le fichier, et que doit-il rappeler au minimum ?

<details>
<summary>Voir la solution</summary>

Vous créez `.claude/skills/verifier-reservation/SKILL.md`. La commande sera `/verifier-reservation`. Le corps rappelle 8 places, la 9e refusée, 45 €, et l'attente ordonnée jusqu'à 12. La description dit quand s'en servir : vérifier une réservation Sève, sans modifier de fichier.

Vous le committez avec le projet. Le CLAUDE.md garde les mêmes nombres, plus les commandes de lancement et de test, et la règle des 18 h. Le skill est le rappel au moment de la vérification, pas une seconde mémoire contradictoire.

</details>

## Exercice 2 : L'ancien fichier

Le dépôt contient déjà `.claude/commands/verifier-reservation.md`, qui parle de « dix places si besoin ». Vous vouliez un skill. Que faites-vous des deux ?

<details>
<summary>Voir la solution</summary>

L'ancien fichier crée déjà la commande `/verifier-reservation`. Vous ne le laissez pas dire dix places à côté d'un skill qui en dit huit. Vous écrivez le skill avec la règle de Léa, puis vous retirez le doublon, dans le même travail, après avoir vérifié que `/verifier-reservation` suit le skill.

Un nouveau rappel se crée en skill, parce que le dossier pourra accueillir un exemple ou un texte de test. L'ancien chemin reste compris : `commands/nom.md` crée aussi `/nom`. Deux textes pour le même nom, avec deux nombres, se corrigent avant le commit.

</details>

## Exercice 3 : « Aide-moi sur Sève »

La description du skill est : « Aide-moi sur Sève ». Le corps dit de corriger le code dès qu'une règle casse. Vous étiez en train de faire lire le dépôt, sans édition. Quel est le risque, et quelle description écrivez-vous ?

<details>
<summary>Voir la solution</summary>

Le skill peut se charger dès que la tâche « parle de Sève », donc au milieu d'une lecture seule, et sa consigne pousse à éditer. Vous réécrivez la description avec le moment précis : vérifier une réservation, 8 places, 45 €, attente 12. Le corps interdit de modifier les fichiers, et il demande un verdict règle par règle.

Vous relancez la lecture du dépôt sans ce débordement. `/verifier-reservation` reste disponible quand vous aurez un formulaire à contrôler. Le diff, ce jour-là, se relit quand même. Le skill ne le signe pas.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Skills et commandes
center: "Un SKILL.md crée la commande /nom. /verifier-reservation rappelle 8 places, 45 € et l'attente de 12, sans éditer."
points:
  - icon: file
    title: SKILL.md
    text: "Le dossier .claude/skills/verifier-reservation/ contient SKILL.md. Vous le committez."
  - icon: terminal
    title: "/nom"
    text: "Le nom du dossier est la commande. Vous la tapez dans la session."
  - icon: sparkles
    title: Pertinent
    text: "Une description concrète permet à la session de charger le skill au bon moment."
  - icon: list
    title: L'ancien fichier
    text: ".claude/commands/nom.md crée aussi /nom. Un rappel nouveau s'écrit en skill."
  - icon: shield
    title: Rappel
    text: "8 places, 45 €, attente 12. Le skill compare. Le diff, vous le relisez."
pitfall: "Une description « aide-moi sur Sève », ou deux fichiers /verifier-reservation qui n'ont pas le même nombre de places."
remember: "Créez le skill, rappelez 8, 45 € et 12, sans rien modifier. L'ancien commands/nom.md marche encore. Le diff reste à vous."
```
