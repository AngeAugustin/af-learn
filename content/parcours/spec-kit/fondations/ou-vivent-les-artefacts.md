---
title: "Où vivent les artefacts"
description: "La fonctionnalité active de Sève est le dossier indiqué dans .specify/feature.json. Changer de branche ne la change pas. Sous Windows, les scripts sont dans .specify/scripts/powershell."
duration: 50
objectives:
  - "Retrouver la fonctionnalité active dans .specify/feature.json"
  - "Distinguer ce fichier d'une branche Git, y compris après un checkout"
  - "Situer la branche numérotée 001-nom comme un effet optionnel de l'extension Git"
  - "Ouvrir les scripts Windows dans .specify/scripts/powershell"
---

# Le pointeur de la fonctionnalité active

Après l'init, Spec Kit a un endroit pour la fonctionnalité en cours. Ce n'est pas le nom de la branche affichée par Git. C'est un fichier :

```text
.specify/feature.json
```

Il indique le dossier de la fonctionnalité active. Les skills lisent ce pointeur. Quand vous écrirez la confirmation visible et la liste d'attente ordonnée, leurs documents iront dans ce dossier, souvent sous `specs/`. Vous ouvrez le fichier pour savoir où chercher, au lieu de deviner depuis l'onglet Git.

Le fichier peut apparaître au moment où la première fonctionnalité est créée, pas forcément à la seconde de l'init. Tant qu'il n'existe pas, aucune fonctionnalité n'est active : c'est cohérent, vous n'avez encore rien spécifié. Dès qu'il existe, c'est lui la référence. Il est un état local de la machine. Le kit le laisse de côté pour Git : un commit ne transporte pas « quelle fonctionnalité est ouverte ici ».

Léa Vernet n'a qu'une fonctionnalité dans ce parcours. Confirmation visible, file ordonnée, atelier de la Croix-Rousse. Le pointeur devra désigner ce travail-là, pas un ancien essai, pas un dossier vide.

> [!IMPORTANT]
> La fonctionnalité active est celle que `.specify/feature.json` désigne. Vous l'ouvrez avant de conclure que « la spec a disparu ».

# Changer de branche ne suffit pas

Vous pouvez avoir plusieurs branches. `main` avec l'application d'aujourd'hui. Une branche de travail. Peut-être, plus tard, une branche proposée par l'extension Git. `git checkout` change les fichiers suivis par Git. Il ne réécrit pas `.specify/feature.json`.

Conséquence directe : vous pouvez être sur `main` et pourtant viser encore le dossier de la confirmation. Ou l'inverse : être sur une branche au nom parlant, alors que le pointeur vise un autre dossier. Les skills suivent le fichier. Elles ne suivent pas l'étoile dans l'interface Git.

Pour travailler sur une autre fonctionnalité, on met le pointeur à jour. Un checkout, seul, ne le fait pas. Avant de lancer une skill sur Sève, vous lisez `feature.json` et vous vérifiez que le dossier indiqué est bien celui de la confirmation et de l'attente. Huit places, 45 €, douze noms d'attente, décision avant 18 h la veille : ces règles vivent dans les documents de ce dossier, une fois écrits. Les chercher sur « la branche d'à côté » sans lire le pointeur mène à la mauvaise spec.

> [!WARNING]
> Changer de branche ne change pas la fonctionnalité active. Relisez `.specify/feature.json` après un checkout.

# La branche numérotée, en option

Une extension Git peut accompagner le kit. Elle est optionnelle. Quand elle est là, elle peut créer une branche numérotée, de la forme `001-nom`. Pour cette fonctionnalité, le nom pourrait ressembler à `001-confirmation`. Le numéro range les travaux dans Git. Il ne désigne pas, à lui seul, la fonctionnalité active.

Vous pouvez très bien spécifier sans cette branche. L'application liste déjà les stages et refuse déjà la neuvième place sur le dépôt tel qu'il est. L'extension n'est pas un prérequis pour écrire le quoi et le pourquoi. Si vous l'activez, vous gagnez une branche `001-nom`. Vous ne gagnez pas un second pointeur. `.specify/feature.json` reste celui que les skills lisent.

Le piège est de croire que `git checkout 001-confirmation` a « sélectionné » la fonctionnalité. Le checkout a sélectionné des fichiers versionnés. Le pointeur local, lui, n'a pas bougé. Vous le rouvrez. S'il vise déjà ce dossier, tant mieux. S'il vise ailleurs, la skill suivante écrira ailleurs, même si le nom de branche est joli.

```diagram
type: compare
title: "Deux mécanismes qui ne se remplacent pas"
columns:
  - title: Fonctionnalité active
    tone: violet
    items:
      - "Fichier .specify/feature.json"
      - "Les skills lisent ce pointeur"
      - "Un checkout ne le réécrit pas"
  - title: Branche Git
    tone: amber
    items:
      - "Optionnelle, forme 001-nom"
      - "Range le travail dans Git"
      - "Ne choisit pas le dossier actif"
```

# Les scripts PowerShell du dépôt

Le projet contient aussi les scripts du kit. Sous Windows, ils sont ici :

```text
.specify/scripts/powershell/
```

C'est le défaut, pas un dossier de secours. Vous l'ouvrez si une skill annonce qu'elle s'appuie sur un script, ou si vous voulez voir ce qui a été copié à l'init. Vous n'y tapez pas `/speckit-specify`. Les skills restent dans le chat. Les scripts restent des fichiers du dépôt, prêts pour la machine Windows.

Sur un autre système, le défaut serait un autre dossier de scripts. Ici, vous êtes sous Windows : PowerShell, donc ce chemin. Si vous ne voyez que des scripts bash et aucun dossier `powershell`, l'init n'a pas pris le défaut de la machine. Vous le constatez avant de spécifier, plutôt que de réécrire les scripts à la main.

Ces scripts ne contiennent pas les règles de Léa. Huit places, attente de douze, 45 €, 18 h la veille : rien de cela n'est « dans PowerShell ». Les règles seront dans la constitution, puis dans la spec. Les scripts sont la mécanique du kit.

> [!NOTE]
> Windows : `.specify/scripts/powershell/`. Vous les lisez. Vous ne les confondez pas avec le chat, ni avec la spec de la confirmation.

# Deux endroits, deux rôles

À côté du pointeur, le dépôt a une mémoire de projet. La constitution, quand vous l'écrirez, vivra dans `.specify/memory/constitution.md`. Elle vaut pour tout Sève : les huit places, le prix, l'attente, l'heure de décision, l'absence de téléphone sur la page publique, le refus serveur de la neuvième place. Elle n'est pas rangée dans le dossier d'une seule fonctionnalité.

Le dossier désigné par `feature.json` est plus étroit. Il reçoit la spec de la confirmation visible et de la liste d'attente ordonnée, puis, plus tard, le plan et les tâches. Si vous ouvrez la constitution pour y chercher le texte de la confirmation, vous êtes au mauvais étage. Si vous ouvrez la spec pour y changer un principe de l'atelier, vous êtes au mauvais étage aussi.

Douze stages par mois, remplissage autour de 70 %, trois absents parce que le SMS a été oublié : ces faits éclairent la fonctionnalité. Ils se racontent dans la spec, avec le pourquoi. Les principes stables, eux, restent dans la constitution. Le pointeur vous dit seulement quelle fonctionnalité est ouverte. Il ne remplace aucun des deux textes.

# Ce que vous ouvrez pour la confirmation

Le geste, une fois le dépôt initialisé, tient en une courte liste. Vous la referez souvent. Elle évite d'éditer le mauvais fichier, puis de s'étonner que l'agent « n'a pas vu » la file d'attente.

1. Ouvrir `.specify/feature.json` et noter le dossier qu'il indique.
2. Ouvrir ce dossier, pas la branche Git du moment.
3. Laisser `.specify/scripts/powershell/` à sa place, sous Windows.
4. Garder la constitution dans `.specify/memory/constitution.md`, à part de la spec.
5. N'enclencher la branche `001-nom` que si l'extension Git est voulue, et relire le pointeur après.

La liste des stages et le refus de la neuvième place restent dans le code de l'application. Vous ne les cherchez pas dans `feature.json`. Ce fichier ne contient pas l'atelier. Il contient l'adresse de la fonctionnalité en cours. L'atelier, vous le mettrez dans les textes, avec les mots de Léa.

> [!TIP]
> Après un checkout, première question : que contient `feature.json` ? Le nom de branche vient ensuite, et seulement s'il vous sert.

# Exercices

## Exercice 1 : Le checkout trompeur

Vous étiez sur une branche de travail de la confirmation. Vous revenez sur `main` pour relire le refus de la neuvième place. Un collègue dit : « La fonctionnalité active est maintenant main. » Que lui montrez-vous ?

<details>
<summary>Voir la solution</summary>

Vous ouvrez `.specify/feature.json`. La fonctionnalité active est le dossier indiqué là, pas la branche courante. `git checkout` n'a pas réécrit ce fichier.

Le code sur `main` peut bien montrer la liste des stages et le refus de la neuvième place. Cela ne déplace pas la spec. Si le pointeur vise encore le dossier de la confirmation, les skills continueront d'y écrire.

</details>

## Exercice 2 : La branche numérotée

L'extension Git a créé `001-confirmation`. Le pointeur, lui, désigne encore un autre dossier, resté d'un essai. Où la prochaine skill va-t-elle écrire, et à quoi sert la branche ?

<details>
<summary>Voir la solution</summary>

La skill écrit dans le dossier de `.specify/feature.json`, pas sur la branche `001-confirmation` en tant que telle. Vous mettez le pointeur sur le bon dossier avant de continuer. Un checkout de `001-confirmation` ne fait pas ce réglage.

La branche numérotée `001-nom` est un plus de l'extension Git, optionnelle. Elle range le travail dans Git. Elle ne remplace pas le pointeur. La confirmation visible et l'attente ordonnée se lisent dans le dossier actif.

</details>

## Exercice 3 : Le dossier des scripts

Sous Windows, quelqu'un cherche un script bash « parce que les tutoriels montrent souvent bash », et il est prêt à copier `/speckit-specify` dans un fichier `.ps1`. Où sont les scripts, et où se lance la skill ?

<details>
<summary>Voir la solution</summary>

Les scripts par défaut sont dans `.specify/scripts/powershell/`. C'est le chemin Windows. Vous n'inventez pas un script bash pour faire comme un autre système, et vous ne collez pas la skill dans un fichier PowerShell.

`/speckit-specify` s'invoque dans le chat. Les règles de Léa (huit places, 45 €, attente de douze, 18 h la veille, trois absents, SMS oublié) seront dans la constitution et dans la spec, pas dans le dossier des scripts.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Où est la fonctionnalité
center: "La fonctionnalité active est dans .specify/feature.json. Une branche Git, même 001-nom, ne la remplace pas."
points:
  - icon: file
    title: Le pointeur
    text: "feature.json désigne le dossier actif. Les skills le lisent avant d'écrire la spec."
  - icon: git
    title: La branche
    text: "Un checkout ne change pas le pointeur. Vous le rouvrez après avoir changé de branche."
  - icon: puzzle
    title: 001-nom
    text: "L'extension Git, optionnelle, peut créer cette branche. Le pointeur reste le fichier."
  - icon: terminal
    title: PowerShell
    text: "Sous Windows, les scripts sont dans .specify/scripts/powershell. On les lit, on n'y spécifie pas."
  - icon: layers
    title: Deux étages
    text: "La constitution est dans .specify/memory. La spec de la confirmation est dans le dossier actif."
pitfall: "Croire qu'un git checkout change la fonctionnalité active, ou chercher la spec dans le dossier des scripts."
remember: "Lisez .specify/feature.json. La branche 001-nom est optionnelle. Les scripts Windows sont sous powershell."
```
