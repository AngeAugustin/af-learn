---
title: "Règles de projet et AGENTS.md"
description: "Écrire des règles .mdc versionnées, choisir quand elles s'appliquent, et tenir Sève en une phrase plutôt qu'en un roman."
duration: 50
objectives:
  - "Placer les règles de projet dans .cursor/rules, en fichiers .mdc versionnés"
  - "Choisir entre alwaysApply, description, globs et mention @"
  - "Utiliser AGENTS.md, les user rules et les team rules à bon escient"
  - "Écrire une règle Sève d'une phrase, comme le plafond de 8 places"
---

# Une règle courte, dans le dépôt

Une règle de projet est un fichier versionné que l'agent relit. Les modèles n'ont pas de mémoire entre deux conversations. La règle remet la contrainte au début du contexte, sans que vous la retapiez.

Atelier Sève, Lyon Croix-Rousse. Léa Vernet, céramiste, tient 12 stages par mois, le samedi de 10 h à 13 h, 8 places, 45 €. La liste d'attente est plafonnée à 12. Léa confirme ou refuse avant 18 h la veille. Le remplissage actuel est de 70 %. 3 absents en moyenne par mois, parce que la confirmation est un SMS oublié. L'application s'appelle Sève.

Les règles de projet vivent dans `.cursor/rules`, en fichiers **`.mdc`**. Elles sont commitées avec le code. Un collègue qui clone le dépôt les reçoit. Un fichier `.md` posé dans ce dossier est ignoré : sans l'en-tête qui dit `description`, `globs` et `alwaysApply`, le système de règles ne le prend pas. Le markdown simple, si vous le voulez, s'appelle `AGENTS.md`, pas un `.md` caché dans `.cursor/rules`.

Vous créez une règle depuis le chat avec `/create-rule`, ou depuis Customize, section Rules, avec Add Rule. Le fichier atterrit dans `.cursor/rules`. Vous le relisez avant de le committer. Une règle fausse, versionnée, se répète à chaque session.

# Quatre façons de l'inclure

L'en-tête du `.mdc` décide quand le texte entre dans le contexte. Quatre combinaisons, pas plus.

| alwaysApply | description | globs | Quand la règle entre |
| --- | --- | --- | --- |
| true | ignorés | ignorés | Toujours, à chaque conversation |
| false | absente | un motif | Quand un fichier correspondant est dans le contexte |
| false | présente | absente | L'agent décide, d'après la description |
| false | absente | absente | Seulement si vous la citez avec @ |

`alwaysApply: true` convient à une contrainte que vous ne voulez jamais voir oubliée. Pour Sève, « une réservation ne dépasse jamais 8 places » est de cet ordre : la page, le formulaire et l'attente peuvent tous la casser.

`globs` convient à un dossier précis. Une règle sur le texte de confirmation, avec un motif limité à ce dossier, entre quand ce fichier est dans le contexte. Elle ne pollue pas la page des 12 stages.

Une `description` sans globs laisse l'agent décider. La description doit dire de quoi il s'agit, en une ligne, sinon il ne la reconnaîtra pas. « Règle utile » ne suffit pas. « Plafond de la liste d'attente Sève, 12 personnes, ordre d'arrivée » suffit.

La règle manuelle n'a ni alwaysApply, ni description, ni globs. Elle entre quand vous tapez @ et son nom. Utile pour une consigne rare, mauvaise pour les 8 places, que vous oublieriez de citer le jour où il le faut.

```diagram
type: decision
title: Quel type de règle pour cette contrainte
nodes:
  - question: "La contrainte doit-elle être présente dans chaque conversation ?"
    yes: "alwaysApply true. Exemple : jamais plus de 8 places."
    no: "Elle ne s'applique pas à tout le dépôt."
  - question: "S'applique-t-elle dès qu'un fichier précis est dans le contexte ?"
    yes: "globs sur ce motif. La description ne décide plus."
    no: "Description sans globs si l'agent doit juger, sinon règle manuelle via @."
```

# AGENTS.md, quand le markdown suffit

`AGENTS.md` est l'alternative simple. Un fichier markdown à la racine du projet, sans en-tête de règle. Vous y mettez les instructions courtes que tout le monde doit pouvoir lire, y compris sans ouvrir Customize.

Cursor lit aussi un `AGENTS.md` dans un sous-dossier. Il s'applique quand le travail touche ce dossier ou ses enfants. Les instructions plus proches du fichier priment sur celles de la racine. Pour Sève, la racine peut porter la phrase des 8 places si vous ne voulez pas d'un `.mdc`. Le dossier de confirmation peut porter la sienne : Léa confirme ou refuse avant 18 h la veille. Pas de mélange des deux dans un seul roman.

Vous ne dupliquez pas la même phrase dans `AGENTS.md` et dans un `.mdc` toujours inclus. Deux textes qui divergent un jour (8 places d'un côté, 10 de l'autre) se battent dans le contexte. Un seul endroit fait foi. Le `.mdc` est plus précis quand vous avez besoin des quatre modes d'inclusion. `AGENTS.md` suffit quand toute l'équipe veut un markdown lisible, sans globs.

# User rules et team rules

Les **user rules** sont globales. Elles vivent dans Customize, section Rules, et suivent votre Cursor d'un dépôt à l'autre. Elles parlent de vous : répondre en français, ne pas ajouter de fichiers que la demande n'a pas nommés. Elles ne portent pas la règle des 8 places. Cette règle est à Sève, pas à tous vos projets. Une user rule « toujours 8 places » casserait le dépôt suivant.

Les **team rules** viennent du tableau de bord, sur les offres Team et Enterprise. L'admin les écrit pour toute l'équipe. Elles peuvent être obligatoires, ou désactivables par chacun s'il ne les a pas verrouillées. Elles s'appliquent à tous les dépôts de l'équipe. L'ordre, en cas de conflit : team rules, puis règles de projet, puis user rules. Les premières l'emportent.

Une team rule est un texte libre, pas un dossier `.cursor/rules`. Elle peut avoir un motif de fichiers. Sans motif, elle entre dans chaque conversation. Vous n'y mettez pas l'atelier de la Croix-Rousse : ce n'est pas une norme d'entreprise, c'est un fait de ce dépôt. Le dépôt garde ses `.mdc`.

> [!WARNING]
> Une team rule large et une règle de projet contraire ne se « moyennent » pas. La team rule gagne. Si l'entreprise impose un format et que Sève impose 8 places, les deux textes doivent pouvoir être vrais en même temps.

# Une phrase, pas un roman

La bonne règle Sève :

« Une réservation ne dépasse jamais 8 places. »

Elle est actionnable. L'agent peut la violer dans un diff, et vous pouvez le voir. Elle ne raconte pas Léa, ni Lyon, ni le samedi.

Les autres contraintes sont d'autres phrases, chacune dans son fichier si leur moment d'entrée diffère.

- « Le prix affiché d'un stage est 45 €. »
- « La liste d'attente compte au plus 12 personnes, dans l'ordre d'arrivée. »
- « Léa confirme ou refuse avant 18 h la veille. La confirmation est visible dans l'application, pas dans un SMS. »

Le roman à ne pas écrire : l'histoire de l'atelier, les 70 % de remplissage, les 3 absents, le caractère de Léa Vernet, la liste des samedis du mois. Ces faits servent dans un message, une fois, quand l'incrément les utilise. Les 12 dates vivent dans le jeu de données, pas dans une règle. Une règle qui recopie les dates devient fausse au mois suivant, et elle noie les 8 places.

Les règles guident Agent, Ask, Plan et Debug. Elles ne guident pas Tab. La suggestion grisée peut encore proposer 10 places. Vous la lisez. La règle n'est pas une excuse pour accepter sans regarder.

> [!TIP]
> Ajoutez une règle quand l'agent se trompe une deuxième fois sur le même chiffre. Pas avant, « pour couvrir ». Quatre phrases justes valent mieux qu'un cahier.

# Ce que vous versionnez

Vous relisez le `.mdc`, vous le commitez avec le dépôt Sève. Le message de commit dit la contrainte, pas « ajout de règles ». Au prochain clone, la phrase des 8 places est là avant même le chat.

Vous vérifiez le type dans Customize : toujours, à la demande de l'agent, selon les fichiers, ou manuel. Un `alwaysApply: true` oublié sur un roman d'atelier remplit chaque conversation. Vous le voyez, vous le coupez, vous le scindez.

Le premier incrément (page des 12 stages, date, 8 places, 45 €, places restantes) n'a pas besoin de toutes les phrases. La phrase des 8 places, oui, dès que la page affiche un reste. Le plafond 12 entre quand vous attaquez l'attente. L'heure de 18 h entre avec la confirmation. Chacune reste courte.

# Exercices

## Exercice 1 : Choisir l'en-tête

Vous écrivez « une réservation ne dépasse jamais 8 places ». La page, le formulaire et l'attente peuvent tous la casser. Quel en-tête, et pourquoi pas une description seule ?

<details>
<summary>Voir la solution</summary>

`alwaysApply: true`, dans un `.mdc` sous `.cursor/rules`. La contrainte doit être dans chaque conversation, pas seulement quand l'agent « trouve la description pertinente ».

Une description sans globs le laisserait décider. Un glob limité au formulaire raterait la page. Une règle manuelle raterait le jour où vous oubliez @. Le fichier est versionné. Un `.md` dans le même dossier serait ignoré.

</details>

## Exercice 2 : Le roman

Un collègue propose une règle toujours incluse : histoire de Léa Vernet, Croix-Rousse, 12 stages, 70 %, 3 absents, SMS, prix, attente, et « faire une belle application ». Que gardez-vous ?

<details>
<summary>Voir la solution</summary>

Vous refusez le roman. Vous gardez des phrases séparées : jamais plus de 8 places ; prix affiché 45 € ; attente au plus 12, dans l'ordre ; Léa tranche avant 18 h, confirmation visible.

Les 12 dates vont dans le jeu de données. Les 70 % et les 3 absents expliquent le besoin, ils ne sont pas une règle que l'agent appliquerait dans un diff. `AGENTS.md` peut porter une phrase si vous ne voulez pas de `.mdc`, pas les deux en double avec des chiffres différents.

</details>

## Exercice 3 : Où ranger la préférence

Vous voulez que l'agent vous réponde en français dans tous vos dépôts. Vous voulez aussi que Sève refuse la 9e place. User rule, team rule, ou règle de projet ?

<details>
<summary>Voir la solution</summary>

Le français est une user rule, dans Customize : elle vous suit, elle ne concerne pas l'atelier. Les 8 places sont une règle de projet Sève, versionnée dans `.cursor/rules`, en `.mdc`.

Ce n'est pas une team rule, sauf si toute l'entreprise partage vraiment ce plafond, ce qui n'est pas le cas de la Croix-Rousse. En cas de conflit, la team rule l'emporte sur la règle de projet, puis sur la user rule. Vous ne comptez pas sur une user rule pour imposer 45 € dans ce dépôt seul.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Une phrase qui reste
center: "Les règles .mdc sont versionnées. Une réservation ne dépasse jamais 8 places."
points:
  - icon: file
    title: ".cursor/rules"
    text: "Fichiers .mdc versionnés. Un .md dans ce dossier est ignoré. AGENTS.md est l'alternative simple."
  - icon: layers
    title: Quatre entrées
    text: "alwaysApply true : toujours. Description : l'agent décide. Globs : fichier dans le contexte. @ : manuel."
  - icon: users
    title: Trois portées
    text: "Projet dans le dépôt. User rules globales. Team rules depuis le tableau de bord, elles priment."
  - icon: ruler
    title: Une phrase
    text: "8 places, 45 €, attente 12, Léa avant 18 h. Chacune à part. Pas le roman de l'atelier."
  - icon: shield
    title: Pas Tab
    text: "La règle guide l'agent. La suggestion grisée peut encore inventer une 9e place."
pitfall: "Un roman toujours inclus, ou la même contrainte écrite deux fois avec deux chiffres différents."
remember: "Une phrase, le bon en-tête, commitée avec Sève. Les 8 places en alwaysApply, pas dans une user rule."
```
