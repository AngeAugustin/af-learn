---
title: "Ce que Spec Kit change"
description: "GitHub Spec Kit sépare la spec du code pour Atelier Sève. On écrit le quoi et le pourquoi dans le chat, avant la pile. Le terminal installe et initialise."
duration: 50
objectives:
  - "Séparer la spec du code, et tenir le quoi et le pourquoi avant toute pile"
  - "Réserver le terminal à l'installation et à l'initialisation de specify"
  - "Invoquer les skills dans le chat de l'agent, pas comme des commandes shell"
  - "Remplacer une phrase unique par une demande que Léa peut contredire"
---

# La spec d'un côté, le code de l'autre

GitHub Spec Kit sert à écrire une fonctionnalité avant de la coder. Le produit s'appelle ainsi. La commande du terminal s'appelle `specify`, le paquet s'appelle `specify-cli`. Spec Kit garde la spécification dans des fichiers du dépôt, et le code dans les fichiers de l'application. Les deux se lisent. Ils ne se confondent pas.

Léa Vernet est céramiste à Lyon, sur les pentes de la Croix-Rousse. Atelier Sève ouvre le samedi, de 10 h à 13 h. Huit places, 45 €. La liste d'attente s'arrête à douze noms. Léa tranche avant 18 h la veille. Le mois compte douze stages. Le remplissage tourne autour de 70 %. Trois personnes par mois ne viennent pas, parce que le SMS de confirmation a été oublié.

L'application liste déjà les stages. Elle refuse déjà la neuvième place. La fonctionnalité de ce parcours est ailleurs : une confirmation visible, et une liste d'attente ordonnée. Spec Kit vous fait écrire ces deux résultats avant que l'agent touche au code.

> [!IMPORTANT]
> La spec dit ce que l'on construit et pourquoi. Le code vient après, dans un autre geste. Mélanger les deux dans une seule phrase rend la relecture impossible.

# Le quoi et le pourquoi, avant la pile

Le quoi, pour Sève, tient en deux faits observables. La personne qui a une place voit une confirmation. Les demandes au-delà de huit places forment une file ordonnée, douze noms au plus. Le pourquoi est le mois réel de Léa : trois absents, un SMS oublié, un stage déjà compté comme pris alors que la chaise reste vide.

La pile technique n'entre pas dans cette phrase. Un nom de bibliothèque, un framework, un choix de base de données : tout cela attend le plan. Ici, vous décrivez ce qu'un élève peut constater, et ce que Léa peut contredire. « Huit places » se contredit. « Une interface moderne » ne se contredit pas.

Vous écrivez aussi ce qui existe déjà, pour que l'agent ne le reconstruise pas. La liste des douze stages du mois est en place. Le refus de la neuvième place est en place, y compris côté serveur. La spec de cette fonctionnalité s'appuie sur ces deux faits. Elle ne les remplace pas par un nouveau projet.

> [!NOTE]
> Le samedi 10 h-13 h, le prix de 45 € et la décision avant 18 h la veille font partie du quoi. Ils ne sont pas un décor autour d'un choix technique.

# Le terminal installe, le chat spécifie

Deux endroits, deux rôles. Le terminal sert à installer `specify-cli` et à initialiser le dépôt. Les skills de Spec Kit s'invoquent dans le chat de l'agent, une par une. `/speckit-specify` écrit la spec. Elle ne se tape pas dans le shell.

Le terminal reste utile après l'init : voir la version, contrôler l'outil, ajouter plus tard une autre intégration. Il ne rédige pas la confirmation. Si vous collez une skill dans le terminal, vous obtenez une erreur du shell, ou rien qui ressemble à un fichier de spec. Le chat, lui, lit le dépôt et écrit les artefacts au bon endroit.

```diagram
type: compare
title: "Où se passe chaque geste"
columns:
  - title: Terminal
    tone: blue
    items:
      - "Installer le paquet specify-cli"
      - "Initialiser le dépôt avec specify"
      - "Lire la version, contrôler l'outil"
  - title: Chat de l'agent
    tone: teal
    items:
      - "Invoquer la skill, par exemple /speckit-specify"
      - "Écrire le quoi et le pourquoi de Sève"
      - "Relire le fichier produit avant de continuer"
```

Vous gardez cet ordre pour toute la fonctionnalité. D'abord l'outil est en place. Ensuite le chat reçoit une demande précise. Ensuite vous lisez le fichier. Le code de la confirmation n'est pas le premier message.

> [!WARNING]
> Une skill tapée dans le terminal n'est pas lancée. Le terminal installe et initialise. Le chat spécifie.

# Une phrase ne tient pas lieu de spec

« Fais la confirmation » était une demande commode. Elle ne dit pas ce qui est visible, ni pour qui, ni pourquoi trois chaises restent vides. L'agent choisit alors à votre place : un texte vague, un envoi que vous n'avez pas décrit, ou une reprise de toute l'application.

Avec Spec Kit, cette phrase ne suffit plus. Vous la remplacez par des faits. La confirmation se voit dans l'application, pour la personne qui a une place. L'attente est une liste ordonnée, douze noms au plus. Léa a tranché avant 18 h la veille. Le SMS oublié est la raison : sans trace visible, l'élève ne sait pas s'il vient samedi.

La phrase unique mélange aussi des travaux déjà faits. Demander « fais la confirmation » peut pousser l'agent à réécrire la liste des stages, ou à rouvrir la neuvième place. Vous dites l'inverse, en positif : la liste reste, le serveur continue de refuser la neuvième place, et le travail nouveau est la confirmation visible plus la file ordonnée.

> [!TIP]
> Si Léa ne peut pas dire « non, c'est faux » sur une ligne, cette ligne n'est pas encore une spec. Ajoutez le nombre ou le nom qui manque.

# Ce que Sève a déjà

Avant d'écrire, vous nommez l'existant. Douze stages par mois, affichés. Huit places, et un refus net quand une neuvième personne demande. Le prix affiché est 45 €. L'horaire affiché est le samedi, 10 h-13 h. Ces lignes sont vraies dans l'application d'aujourd'hui. La spec les cite comme un sol, pas comme un chantier.

Ce qui manque est précis. La personne confirmée ne voit pas encore une confirmation claire. Les demandes en trop ne forment pas encore une file dont l'ordre se relit. Trois absents par mois viennent de là : le message a été oublié, la place semblait prise, personne ne s'est présenté à la Croix-Rousse.

Le remplissage autour de 70 % rappelle pourquoi les places affichées doivent rester vraies. Une confirmation qui dirait oui alors que les huit sièges sont pris aggraverait le mois, elle ne le réparerait pas. La file ordonnée sert à proposer la place suivante sans réinventer la règle.

# Ce que vous demandez à la place

La demande que vous préparerez plus tard, dans le chat, ressemble déjà à ceci. Vous la gardez sous les yeux. Vous ne la lancez pas tant que le dépôt n'est pas initialisé, et tant que les principes du projet ne sont pas écrits. Le geste de ce chapitre est de savoir à quoi elle doit ressembler.

```text
Quoi : une confirmation visible pour qui a une place,
et une liste d'attente ordonnée, 12 noms au plus.
Pourquoi : 3 absents par mois, le SMS a été oublié.
Déjà en place : la liste des stages, le refus de la 9e place.
Léa tranche avant 18 h la veille. Samedi 10 h-13 h, 45 €.
```

Aucun nom de framework dans ce bloc. Aucune phrase du type « fais la confirmation ». Les nombres de l'atelier y sont, ainsi que la raison des trois absents. La suite du module installe `specify`, ouvre le dépôt, et montre où les fichiers produits vont vivre.

# Exercices

## Exercice 1 : Remplacer la phrase

Un collègue veut gagner du temps. Il propose d'écrire dans le chat : « Fais la confirmation du stage. » Réécrivez la demande avec le quoi, le pourquoi, et ce qui est déjà en place à l'atelier.

<details>
<summary>Voir la solution</summary>

La confirmation est visible pour la personne qui a une place. L'attente est une liste ordonnée, douze noms au plus. Le pourquoi est chiffré : douze stages par mois, remplissage autour de 70 %, trois absents parce que le SMS a été oublié. Léa Vernet tranche avant 18 h la veille. Le samedi va de 10 h à 13 h, huit places, 45 €, à Lyon Croix-Rousse.

Vous ajoutez l'existant. L'application liste déjà les stages et refuse déjà la neuvième place. La demande ne reconstruit pas ces deux comportements. Elle ne cite aucun framework.

</details>

## Exercice 2 : Le terminal et le chat

Vous avez le dépôt ouvert. Quelqu'un tape `/speckit-specify` dans le terminal, puis colle « fais la confirmation ». Que lui indiquez-vous, et où la skill doit-elle partir ?

<details>
<summary>Voir la solution</summary>

Le terminal sert à installer `specify-cli` et à initialiser le dépôt. Il ne lance pas les skills. `/speckit-specify` se tape dans le chat de l'agent, après l'init, et seulement quand la demande est écrite.

« Fais la confirmation » ne part pas non plus dans le chat. Vous la remplacez par le quoi et le pourquoi : confirmation visible, file ordonnée jusqu'à douze, trois absents liés au SMS oublié, liste des stages et refus de la neuvième place déjà en place.

</details>

## Exercice 3 : La pile trop tôt

L'agent répond : « Je pars sur un framework et je refais l'écran des stages, ce sera plus propre pour la confirmation. » Que gardez-vous dans la spec, et que renvoyez-vous à plus tard ?

<details>
<summary>Voir la solution</summary>

La spec garde le quoi et le pourquoi. Confirmation visible, attente ordonnée de douze noms, décision de Léa avant 18 h la veille, huit places, 45 €, samedi 10 h-13 h. Elle rappelle que la liste des stages et le refus de la neuvième place existent déjà.

Le nom du framework sort de la spec. Il pourra venir au moment du plan, pas maintenant. Refaire l'écran des stages n'est pas la fonctionnalité. Vous le dites avant toute édition de code.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: La spec avant le code
center: "Spec Kit sépare la spec du code de Sève. Le quoi et le pourquoi précèdent la pile. Le chat spécifie, le terminal installe."
points:
  - icon: file
    title: La spec
    text: "Confirmation visible et attente ordonnée. Les fichiers de spec se relisent à part du code."
  - icon: target
    title: Le quoi
    text: "Huit places, 45 €, attente de 12, décision avant 18 h. Léa peut contredire chaque nombre."
  - icon: chat
    title: Le chat
    text: "Les skills s'invoquent dans le chat. /speckit-specify ne se tape pas dans le terminal."
  - icon: terminal
    title: Le terminal
    text: "Il installe specify-cli et initialise le dépôt. Il ne rédige pas la confirmation."
  - icon: alert
    title: Déjà là
    text: "La liste des stages et le refus de la 9e place restent. On ne les redemande pas."
pitfall: "Demander « fais la confirmation » en une phrase, ou choisir le framework avant d'avoir écrit le quoi et le pourquoi."
remember: "Écrivez le quoi et le pourquoi d'abord. Trois absents, SMS oublié. Le terminal installe. Le chat spécifie."
```
