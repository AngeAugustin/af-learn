---
title: "Installer Cursor et ouvrir le dépôt"
description: "Installer Cursor, se connecter, ouvrir le dossier de Sève et vérifier la branche avant de parler à l'agent."
duration: 50
objectives:
  - "Installer Cursor, se connecter et ouvrir le dossier du projet plutôt qu'un fichier isolé"
  - "Repérer l'arbre, le terminal intégré et le chat dans la même fenêtre"
  - "Vérifier la branche Git avant d'écrire la première demande"
  - "N'envoyer le premier message qu'une fois le dépôt de Sève vraiment ouvert"
---

# Installer, puis se connecter

Vous installez Cursor depuis le site de l'éditeur, vous l'ouvrez, vous vous connectez. Le compte sert à lier l'éditeur au modèle. Sans connexion, le chat ne répond pas, et le dépôt ouvert ne suffit pas.

Atelier Sève, Lyon Croix-Rousse. Léa Vernet, céramiste, tient 12 stages par mois, le samedi de 10 h à 13 h, 8 places, 45 €. La liste d'attente est plafonnée à 12. Léa confirme ou refuse avant 18 h la veille. Le remplissage actuel est de 70 %. 3 absents en moyenne par mois, parce que la confirmation est un SMS oublié. L'application s'appelle Sève. Le dépôt que vous ouvrez est celui de cette application, pas un dossier d'essai nommé « test ».

L'installation ne se discute pas longtemps. Ce qui compte est l'écran d'après : un éditeur vide, tant que vous n'avez pas ouvert le dossier. Un compte connecté sur un éditeur vide ne voit pas les 12 stages.

> [!NOTE]
> Si une fenêtre demande de se connecter au milieu d'un essai, finissez la connexion avant d'écrire dans le chat. Une demande envoyée sans compte ne part pas, et vous croyez que l'agent ignore Sève.

# Ouvrir le dossier du projet

Vous ouvrez le **dossier** du dépôt, pas un fichier seul, pas une archive, pas une copie collée sur le bureau le matin même. Le dossier est la racine : celle qui contient le code, et en général le dossier `.git`.

Dans le menu Fichier, choisissez d'ouvrir un dossier et désignez la racine de Sève. Le nom de la fenêtre doit correspondre à ce projet. Si la fenêtre s'appelle encore « sans titre » ou porte le nom d'un autre atelier, vous n'êtes pas au bon endroit. L'agent lira alors les mauvais fichiers, et une page de stages pourra sortir d'un dépôt qui n'a rien à voir avec la Croix-Rousse.

Vous ne glissez pas seulement `page-stages` dans l'éditeur. Sans la racine, l'arbre est incomplet, le terminal ne s'ouvre pas dans le projet, et la branche Git n'est pas celle que vous croyez.

# L'arbre, le terminal, le chat

Trois zones, une fois le dossier ouvert.

- **L'arbre**, à gauche. Vous y voyez les dossiers du projet. Pour le premier incrément, vous repérez où vivront la liste des stages et le jeu des 12 dates. Vous ne créez pas encore le formulaire.
- **Le terminal intégré**, en bas. Il est déjà placé dans la racine. Vous y lirez la branche et l'état Git. Vous n'y collez pas « fais l'application ».
- **Le chat**, sur le côté. C'est là que vous parlerez à l'agent, après la vérification. Le raccourci qui l'ouvre ne remplace pas la lecture de l'arbre.

Si l'une des trois zones manque, vous ne commencez pas. Un chat sans arbre est un terminal déguisé. Un arbre sans terminal vous empêche de voir la branche. Un terminal sans chat vous fait quitter l'éditeur pour une autre fenêtre, et vous perdez le diff.

```diagram
type: flow
title: Avant la première phrase à l'agent
steps:
  - title: Installer
    text: "Cursor est lancé, le compte est connecté."
    tone: violet
  - title: Ouvrir
    text: "Le dossier racine de Sève, pas un fichier isolé."
    tone: blue
  - title: Voir
    text: "Arbre, terminal intégré, chat, dans la même fenêtre."
    tone: teal
  - title: Branche
    text: "Le nom en bas d'écran est celui de l'incrément, pas un essai."
    tone: amber
  - title: Nommer
    text: "Page des 12 stages, date, 8 places, 45 €, places restantes."
    tone: rose
```

# La branche avant de parler

Avant d'écrire dans le chat, vous lisez la branche. Le nom est dans la barre d'état, en bas. Vous le confirmez dans le terminal intégré avec l'état Git : branche courante, fichiers déjà modifiés, rien d'inattendu.

Deux erreurs reviennent sur un dépôt partagé.

- Vous êtes sur la branche principale, et quelqu'un d'autre y a déjà un travail en cours. L'agent va le mélanger à la page des stages.
- Vous êtes sur un vieil essai, « sms » ou « paiement », ouvert la semaine dernière. L'agent va continuer cet essai. Les 3 absents et le SMS oublié ne justifient pas de coder la confirmation dans cette branche-là.

Pour le premier incrément, la branche doit être celle de la page des stages, créée à partir d'un état propre. Si des fichiers sont déjà modifiés, vous les regardez avant de parler. Un diff hérité n'est pas un diff de Sève.

> [!WARNING]
> Parler à l'agent sur la mauvaise branche fait écrire le bon texte au mauvais endroit. Le diff aura l'air correct, et le dépôt ne le sera pas.

# Ce que vous vérifiez pour Sève

La checklist tient en une minute. Vous la faites à chaque ouverture, pas seulement le premier jour.

1. La fenêtre porte le projet Sève, atelier de Léa Vernet.
2. L'arbre montre la racine du dépôt.
3. Le terminal intégré est dans ce dossier.
4. La branche est celle de l'incrément en cours.
5. Vous savez quel incrément c'est.

Les quatre incréments ne changent pas : (1) la page des 12 stages, date, 8 places, 45 €, places restantes ; (2) le formulaire qui refuse la 9e place ; (3) la liste d'attente jusqu'à 12, dans l'ordre ; (4) la confirmation visible, et la règle « Léa tranche avant 18 h ». Aujourd'hui, si la branche dit encore « attente » alors que la page n'existe pas, vous changez de branche avant le chat.

Le remplissage de 70 % et les samedis de 10 h à 13 h ne se vérifient pas dans la barre d'état. Ils se vérifieront sur la page. La barre d'état vérifie seulement que vous allez modifier le bon historique.

# Le premier message, après

Le chat s'ouvre en dernier. Le premier message reprend le résultat, pas l'historique de l'atelier.

« Dans ce dépôt, sur cette branche : une page qui liste les 12 stages du mois, avec la date, 8 places, 45 € et les places restantes. Pas de formulaire, pas de liste d'attente, pas de confirmation. »

Vous n'ajoutez pas le prix « à discuter », ni une 9e place « pour les habitués ». 8 places, 45 €. Léa confirme ou refuse avant 18 h la veille : cette règle est réelle, elle n'est pas dans ce message. Elle attend le quatrième incrément, sur sa branche, quand la page existera.

Si le chat répond en proposant d'abord de « mettre en place l'architecture », vous le ramenez à la page. L'architecture sans les 12 dates ne se voit pas dans l'aperçu. Vous êtes resté dans l'éditeur pour voir, pas pour déléguer le cadre.

# Exercices

## Exercice 1 : La fenêtre n'est pas la bonne

Vous venez d'installer Cursor et de vous connecter. Le chat est ouvert. L'arbre affiche un dossier « notes-croix-rousse », sans `.git`. Léa attend la page des stages. Que faites-vous avant d'écrire ?

<details>
<summary>Voir la solution</summary>

Vous fermez ce dossier et vous ouvrez la racine du dépôt Sève, celle qui contient l'historique Git. Un chat connecté ne corrige pas un mauvais dossier. Les notes de l'atelier ne sont pas l'application.

Ensuite seulement vous regardez l'arbre, le terminal intégré et le nom de la branche. Le premier message attendra que ces trois contrôles soient vrais.

</details>

## Exercice 2 : Lire la branche

La barre d'état indique `essai-sms`. Le terminal confirme cette branche, avec deux fichiers déjà modifiés autour de l'envoi de SMS. Vous vouliez la page des 12 stages. Que faites-vous ?

<details>
<summary>Voir la solution</summary>

Vous ne parlez pas à l'agent sur `essai-sms`. Cette branche traîne le sujet des 3 absents et du SMS oublié, qui relève de la confirmation, pas de la page.

Vous regardez les deux fichiers modifiés pour ne pas les perdre sans le vouloir, puis vous passez sur une branche propre pour le premier incrément. Le message au chat ne part qu'une fois le nom de branche aligné avec la page des stages.

</details>

## Exercice 3 : Le premier message

Le dépôt Sève est ouvert, la branche est la bonne, l'arbre et le terminal sont visibles. Écrivez le premier message, et dites ce que vous n'y mettez pas.

<details>
<summary>Voir la solution</summary>

« Une page qui liste les 12 stages du mois, avec la date, 8 places, 45 € et les places restantes. » Vous rappelez que le formulaire (refus de la 9e place), la liste d'attente (plafond 12, dans l'ordre) et la confirmation (Léa tranche avant 18 h) ne font pas partie de cette demande.

Vous n'écrivez pas « fais l'application », ni le récit des 70 % de remplissage comme cahier des charges du jour. Le cadre est déjà vérifié dans l'éditeur. Le message ne fait que nommer le résultat.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Ouvrir, puis parler
center: "Compte connecté, dossier de Sève ouvert, branche lue. Le chat vient après."
points:
  - icon: cloud
    title: Installer
    text: "Cursor lancé, compte connecté. Un éditeur vide ne voit pas les 12 stages."
  - icon: file
    title: Le dossier
    text: "La racine du dépôt, pas un fichier isolé ni un dossier de notes sans Git."
  - icon: layers
    title: Trois zones
    text: "L'arbre, le terminal intégré, le chat. Les trois dans la même fenêtre."
  - icon: git
    title: La branche
    text: "Lue en bas d'écran et dans le terminal, avant la première phrase."
  - icon: chat
    title: Le message
    text: "Page des 12 stages, date, 8 places, 45 €, places restantes. Rien d'autre."
pitfall: "Écrire dans le chat dès l'installation, sur un mauvais dossier ou sur la branche essai-sms."
remember: "Ouvrez la racine de Sève, vérifiez la branche de l'incrément, puis seulement nommez la page des stages."
```
