---
title: "Faire lire le dépôt avant de coder"
description: "La première demande sur Sève est en lecture seule : où sont les stages ? On lit la réponse, on corrige un fichier inventé, et on ne fait construire qu'une fois le bon endroit montré."
duration: 50
objectives:
  - "Formuler une première demande en lecture seule sur l'emplacement des stages"
  - "Vérifier les chemins cités et corriger un fichier inventé"
  - "Exiger la preuve que la session a vu le bon endroit avant l'incrément 1"
  - "Garder le formulaire, l'attente et les 18 h hors de cette première lecture"
---

# La première demande est en lecture seule

Le dépôt est le bon, `git status` est lu, la session est ouverte. La première demande ne construit pas Sève. Elle demande où sont les stages. Vous voulez une réponse ancrée dans des fichiers réels : un chemin, un extrait, et ce que cet extrait dit du nombre de places.

```text
Où sont les stages dans ce dépôt ?
Ne modifie aucun fichier.
Ne lance pas de commande qui écrit.
Cite les chemins que tu as lus.
Dis si le nombre de places (8) apparaît déjà.
```

Huit places, samedi 10 h-13 h, 45 €, douze stages dans le mois : vous savez ce que vous cherchez. La session, elle, doit le trouver dans le dépôt, ou dire que ce n'est pas encore écrit. Les deux réponses sont utiles. Une troisième ne l'est pas : un chemin plausible, inventé, présenté comme s'il avait été lu.

> [!IMPORTANT]
> « Construis Sève » attend. Tant que la session n'a pas montré le bon endroit, une édition part de zéro, souvent du mauvais fichier.

# Ce que vous attendez comme réponse

Une bonne réponse cite des chemins que vous pouvez ouvrir, et elle distingue ce qui est lu de ce qui est déduit. « J'ai lu `data/stages.json`. Il contient douze entrées. Le champ de places vaut 8. » Vous pouvez aller voir. « Je n'ai pas trouvé de fichier de stages. La racine contient ceci. » Vous pouvez aussi aller voir. Dans un dépôt encore jeune, cette seconde réponse est la bonne : elle vous évite de croire qu'une page existe déjà.

Vous demandez l'extrait, pas une paraphrase seule. Un extrait se compare au fichier. La paraphrase peut arrondir : « une dizaine de places », « les ateliers du week-end ». Léa tient huit places, le samedi, de 10 h à 13 h. Si le fichier dit autre chose, vous le notez. C'est peut-être un brouillon à corriger plus tard. Ce n'est pas une raison pour laisser la session réécrire le métier pendant la lecture.

> [!NOTE]
> La lecture peut citer plusieurs endroits : des données, un texte de page, un test. Vous les voulez tous. L'incrément 1 touchera celui qui affiche les places restantes. Le savoir avant d'éditer évite de modifier un exemple oublié.

# Lire la réponse avant de l'accepter

Vous lisez la réponse comme vous lirez le diff. Chaque chemin se vérifie. Dans le shell, ou par une demande de lecture supplémentaire, vous ouvrez le fichier cité. Le nom correspond. Le nombre 8 est là, ou il est absent, comme annoncé. Un test déjà présent qui compte les stages se note : il servira de vérification plus tard.

Vous repérez les phrases qui glissent vers le travail suivant. « Je peux enchaîner sur le formulaire. » « Je prépare aussi l'attente. » Vous les arrêtez. La consigne de cette session reste la carte du dépôt. Le formulaire qui refuse la neuvième place, l'attente ordonnée jusqu'à douze, la confirmation et les 18 h ont leurs propres phrases de résultat. Ils ne s'invitent pas dans une lecture.

```diagram
type: flow
title: "De la question au bon endroit"
steps:
  - title: Demander
    text: "Où sont les stages ? Aucune écriture."
    tone: blue
  - title: Vérifier
    text: "Chaque chemin cité s'ouvre. Le 8 est vrai ou absent."
    tone: teal
  - title: Corriger
    text: "Un fichier inventé se dit dans le fil, tout de suite."
    tone: amber
  - title: Ensuite
    text: "L'incrément 1, seulement quand l'endroit est le bon."
    tone: violet
```

# Corriger un fichier inventé

Le cas à connaître : la réponse cite `src/pages/stages.tsx`, avec un résumé convaincant, et le fichier n'existe pas. Le modèle a reconnu le genre d'application et a complété. Vous le dites sans enrobage.

```text
src/pages/stages.tsx n'existe pas.
Je viens de vérifier. Cherche encore, en lecture seule.
Si aucun fichier ne décrit les stages, dis-le, et liste ce que tu as vraiment ouvert.
```

Vous ne « laissez passer » pour gagner du temps. Un fichier inventé au début devient le fichier que la session modifiera ensuite. Le diff aura l'air cohérent avec une réponse fausse. Corriger maintenant coûte une minute. Corriger après l'édition coûte un incrément.

Parfois le fichier existe, et le contenu cité est faux : douze places au lieu de huit, un prix à 50 €, une attente illimitée. Même geste. Vous collez l'extrait réel, ou vous demandez de relire la ligne. La session se recale sur le dépôt. Les 70 % de remplissage et les trois absents du mois n'ont pas à être inventés non plus : ce sont des faits d'atelier, pas des champs à deviner dans le code.

> [!WARNING]
> Une réponse fluide peut citer un fichier absent. Vous ouvrez le chemin. S'il manque, vous le dites avant tout oui sur une édition.

# Montrer le bon endroit, puis seulement coder

Le bon endroit est montré quand vous avez vu, vous, le fichier ou l'absence de fichier. « La session a l'air sûre » ne compte pas. Vous pouvez alors écrire le résultat de l'incrément 1, en désignant ce fichier :

```text
Résultat : la page liste les 12 stages du mois,
avec les places restantes sur 8.
Pars du fichier que tu viens de citer et que j'ai ouvert.
Ne touche pas au formulaire, ni à l'attente, ni à la confirmation.
```

Si la lecture a conclu qu'aucun fichier n'existe, la phrase change d'un mot : créer cette page, au chemin que vous venez de convenir ensemble, pas à un chemin sorti de nulle part. Vous convenez du chemin dans le fil, vous le notez, puis vous autorisez l'édition. Le mode plan, vu juste avant, reste disponible si plusieurs fichiers sont en jeu.

> [!TIP]
> Gardez la réponse relue : les chemins, et la phrase « le 8 est déjà là » ou « le 8 n'est pas encore écrit ». Elle servira de point de départ si vous ouvrez une session neuve.

# Ce que cette lecture vous a appris

Vous repartez avec une carte courte. Où sont les données des stages. Où serait la page. Si un test couvre déjà le nombre de places. Ce que le dépôt ne contient pas encore. Cette carte est le contraire d'une application entière demandée d'un bloc.

Léa, à la Croix-Rousse, n'a pas besoin que la session improvise un parcours. Elle a besoin que les douze stages du mois affichent des places vraies, sur huit. La lecture d'aujourd'hui sert ce premier résultat. Le formulaire viendra quand cette page sera dans le diff, et pas avant.

# Exercices

## Exercice 1 : La première phrase

Le dépôt Sève est ouvert dans la session. Vous voulez savoir où vivreont les places restantes. Écrivez la demande. L'incrément 1 n'est pas encore autorisé.

<details>
<summary>Voir la solution</summary>

Vous demandez où sont les stages, en lecture seule. La demande interdit les modifications et les commandes qui écrivent. Elle exige les chemins lus, et elle pose une question fermée : est-ce que le nombre 8 apparaît déjà.

Vous ne demandez pas de construire la page, ni le formulaire, ni l'attente. La réponse attendue est une carte : fichiers réels, ou absence de fichier, assumée. Vous vérifierez chaque chemin avant d'aller plus loin.

</details>

## Exercice 2 : Le chemin absent

La session répond : « Les stages sont dans `src/pages/stages.tsx`. Huit places, c'est déjà codé. » Vous listez le dossier. Le fichier n'existe pas. `data/stages.json` non plus. Que répondez-vous ?

<details>
<summary>Voir la solution</summary>

Vous dites que le chemin n'existe pas, et que vous venez de vérifier. Vous redemandez une recherche en lecture seule. S'il n'y a aucun fichier de stages, la session doit le dire, et lister seulement ce qu'elle a ouvert.

Vous ne la laissez pas créer `src/pages/stages.tsx` « puisque c'est l'idée qu'elle avait ». Le chemin de la future page se convient après cette correction. Huit places « déjà codées » était une invention. Le dépôt, lui, ne les contient pas encore.

</details>

## Exercice 3 : La carte est bonne, le zoom est trop large

Cette fois les chemins existent. Vous les avez ouverts. Le fichier des stages contient bien douze stages et le nombre 8. La session ajoute : « Je code maintenant le formulaire, l'attente de 12 et le rappel de 18 h, tant que le contexte est chaud. » Que gardez-vous ?

<details>
<summary>Voir la solution</summary>

Vous gardez la carte, puisque vous l'avez vérifiée. Vous refusez d'enchaîner sur trois incréments. Le résultat que vous écrivez alors est celui de la page : les douze stages, les places restantes sur huit, à partir du fichier ouvert.

Le formulaire qui refuse la neuvième place, l'attente ordonnée jusqu'à douze, la confirmation et les 18 h attendent leur tour. Chacun aura sa phrase, après un diff de la page que vous aurez relu. Le contexte « chaud » ne décide pas de l'ordre.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Lire le dépôt d'abord
center: "Première demande : où sont les stages, sans rien modifier. Vous ouvrez les chemins. Un fichier inventé se corrige avant de coder."
points:
  - icon: search
    title: Lecture seule
    text: "Vous demandez les chemins lus, et si le nombre 8 est déjà dans le dépôt."
  - icon: eye
    title: Vérifier
    text: "Vous ouvrez chaque fichier cité. L'extrait se compare à la réponse."
  - icon: alert
    title: Invention
    text: "Un chemin absent se dit tout de suite. La session cherche encore, sans écrire."
  - icon: file
    title: Le bon endroit
    text: "L'incrément 1 part du fichier que vous avez vu, ou d'un chemin convenu ensemble."
  - icon: list
    title: Un seul sujet
    text: "La page des 12 stages. Le formulaire, l'attente et les 18 h restent pour après."
pitfall: "Dire « construis Sève » alors que la session n'a pas montré un vrai fichier, ou accepter un chemin que vous n'avez pas ouvert."
remember: "Où sont les stages ? Vous vérifiez la réponse. Ensuite seulement, la page des places restantes sur 8."
```
