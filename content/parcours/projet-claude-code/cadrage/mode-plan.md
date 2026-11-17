---
title: "Obtenir un plan avant toute écriture"
description: "Entrer en mode plan avec /plan ou Shift+Tab, faire lire le brief sans modifier les sources, retirer le paiement, garder 8 places, puis accepter."
duration: 50
objectives:
  - "Entrer en mode plan avec /plan ou en faisant défiler les modes avec Shift+Tab"
  - "Laisser la session lire et chercher sans modifier les sources"
  - "Corriger le plan de Sève avant de l'accepter : pas de paiement, 8 places"
  - "N'accepter qu'un plan qui ne couvre que l'incrément en cours"
---

# Lire avant la première ligne

Le mode plan existe pour que la première chose écrite ne soit pas du code. Claude Code lit le dépôt, suit le chemin de `docs/brief.md`, et propose un plan. Vous corrigez ce plan. Vous l'acceptez ensuite, d'un geste explicite. L'écriture commence après ce oui, pas pendant la lecture.

Sans ce détour, la première demande « liste les 12 stages » devient une série de fichiers, parfois justes, parfois déjà partis vers un formulaire ou un encaissement. Le plan est l'endroit où vous voyez cette dérive pendant qu'elle est encore une phrase.

# Entrer en mode plan

Dans le terminal, la commande `/plan` entre en mode plan. `Shift+Tab` fait défiler les modes de permission : un appui ne tombe pas forcément sur plan, il passe au mode suivant. Vous continuez jusqu'à ce que l'indicateur affiche plan, et vous le regardez avant la première demande. Une session restée dans un autre mode écrira dès que vous parlerez de la liste.

Si vous hésitez entre les deux gestes, `/plan` est le plus direct. `Shift+Tab` sert quand vous êtes déjà dans le terminal et que vous voulez voir dans quel mode vous êtes, puis atteindre plan sans quitter la session.

Le glossaire de Claude Code fixe le vocabulaire : le mode plan se prend avec `/plan` ou avec `Shift+Tab`. La page à ouvrir quand un raccourci hésite est [le glossaire](https://code.claude.com/docs/en/glossary). Vous y vérifiez le mot, plutôt que de reconstruire le geste de mémoire.

# Lire et chercher, sans écrire

En mode plan, Claude recherche et propose. Il peut lire les fichiers, chercher dans le dépôt, lancer des commandes d'exploration. Il ne modifie pas les sources. C'est la définition du mode : un plan à approuver avant de toucher aux fichiers.

Vous en tirez une règle simple. Une demande de permission qui édite un fichier, renomme un dossier ou ajoute une dépendance arrive trop tôt. Vous la refusez. Le plan n'est pas accepté. L'exploration qui lit `docs/brief.md` et décrit les 12 stages, elle, est dans le mode.

> [!IMPORTANT]
> Tant que vous n'avez pas accepté le plan, une permission d'écriture ne se « juste cette fois ». Le mode plan sert à voir le geste avant qu'il existe dans les fichiers.

# Corriger, puis accepter

Vous comparez le plan à la page, pas à votre souvenir. Deux corrections ne se négocient pas sur Sève.

- **Retirer le paiement.** Tout encaissement, toute dépendance qui encaisse, toute phrase « on affichera 45 € donc on branchera le paiement ». Le prix reste affiché.
- **Garder 8 places.** Un plan qui passe à 10 « pour avoir de la marge », ou qui oublie l'attente de 12 et les 18 h, se corrige. Les 8 places du samedi 10 h-13 h à la Croix-Rousse restent 8.

Vous écrivez la correction dans le terminal, et vous dites que vous n'acceptez pas encore.

```text
Retire tout paiement et toute dépendance d'encaissement.
Garde 8 places, attente maximum 12, règle des 18 h la veille.
Le prix de 45 € s'affiche seulement.
Incrément 1 seulement : la liste des 12 stages.
Je n'accepte pas encore.
```

Quand le plan révisé nomme cet incrément, ces chiffres, et l'absence de paiement, vous acceptez. Accepter plus tôt fige la dérive dans les fichiers.

```diagram
type: decision
title: "Avant d'accepter le plan"
nodes:
  - question: "Le plan parle-t-il d'un paiement ou d'un encaissement ?"
    yes: "On le retire. Les 45 € restent un prix affiché, puis on relit le plan."
    no: "On passe au nombre de places."
  - question: "Le plan garde-t-il 8 places, sans élargir la session ?"
    yes: "On accepte. L'écriture de l'incrément 1 peut commencer."
    no: "On corrige à 8 places et à la seule liste, avant tout oui."
```

# Un plan trop large n'est pas « presque bon »

Un plan peut ouvrir juste, par la liste des 12 stages, puis annoncer la suite dans le même souffle : le formulaire, l'attente, le rappel, parfois le paiement « pour aller plus vite ». Le premier paragraphe juste ne rachète pas la suite.

Vous coupez. La session qui suit le oui ne fait que l'incrément dont la preuve est écrite : la page des 12 stages. Le refus de la 9e place aura son plan, un autre jour. Accepter un plan à quatre incréments, c'est revenir à « fais l'application », avec une mise en forme de plus.

# Ce que vous relisez dans le plan

Avant le oui, vous cochez cinq traces, toutes déjà dans `docs/brief.md`.

- 12 stages dans le mois, samedi 10 h-13 h, Lyon Croix-Rousse.
- 8 places, pas une autre valeur.
- 45 € affichés, aucun encaissement.
- L'attente de 12 et les 18 h sont citées comme règles à venir, pas comme travail de cette session.
- Aucun fichier n'a encore été modifié : vous êtes toujours en train de lire.

Si une trace manque, vous corrigez le plan. Vous n'acceptez pas « on ajustera en codant ». Ajuster en codant, c'est découvrir la 10e place dans un fichier, après coup.

> [!WARNING]
> Accepter pour « voir ce que ça donne », puis compter sur un retour arrière, déplace la relecture trop tard. Le mode plan est cette relecture, pendant que les sources sont encore intactes.

# Exercices

## Exercice 1 : Un plan à 10 places

Le plan propose une page des stages, un paiement des 45 €, et 10 places « pour les demandes de dernière minute ». L'attente et les 18 h n'apparaissent pas. Que répondez-vous avant d'accepter ?

<details>
<summary>Voir la solution</summary>

Vous n'acceptez pas. Vous faites retirer tout paiement : les 45 € s'affichent, rien n'est encaissé. Vous faites revenir le nombre à 8 places, et vous faites citer l'attente maximum de 12 et la règle des 18 h comme règles du brief, pas comme chantier du jour.

Vous bornez le plan à l'incrément 1, la liste des 12 stages, samedi 10 h-13 h, Croix-Rousse. Vous redemandez le plan corrigé. Le oui vient après cette relecture, pas à la place.

</details>

## Exercice 2 : La permission trop tôt

L'indicateur affiche le mode plan. Une permission demande pourtant de modifier un fichier pour « préparer la liste ». Le plan n'est pas encore sur la table. Que faites-vous ?

<details>
<summary>Voir la solution</summary>

Vous refusez la permission. En mode plan, la session lit, cherche, et peut lancer une exploration. Elle ne modifie pas les sources. Une édition, même petite, même présentée comme une préparation, sort du mode.

Vous redemandez un plan, sans écriture. Vous le corrigerez (paiement, 8 places, un seul incrément) avant de l'accepter. Le fichier bougera après ce oui, pas avant.

</details>

## Exercice 3 : Le bon premier paragraphe

Le plan commence bien : 12 stages, samedi 10 h-13 h, 8 places, 45 € affichés, pas de paiement. La dernière phrase ajoute : « puis j'enchaîne le formulaire, l'attente et le rappel dans la foulée ». Acceptez-vous ?

<details>
<summary>Voir la solution</summary>

Vous n'acceptez pas ce plan-là. Le début respecte le brief et l'incrément 1. La dernière phrase rouvre les incréments 2, 3 et 4 dans la même session, sans leurs preuves séparées.

Vous faites retirer l'enchaînement. Le plan accepté s'arrête à la liste. Le formulaire viendra avec son propre plan, quand l'observation des 12 stages sera tenue. Un premier paragraphe juste ne couvre pas une suite trop large.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Un plan avant d'écrire
center: "Mode plan avec /plan ou Shift+Tab. On lit, on corrige le paiement et les 8 places, puis on accepte."
points:
  - icon: compass
    title: Entrer
    text: "/plan ouvre le mode plan. Shift+Tab fait défiler les modes jusqu'à l'indicateur plan."
  - icon: search
    title: Lire
    text: "La session cherche et lit le dépôt. Elle ne modifie pas les sources tant que le plan tient."
  - icon: money
    title: Retirer
    text: "Tout encaissement sort du plan. Les 45 € restent un prix affiché sur le stage."
  - icon: users
    title: Huit places
    text: "On ne laisse pas passer 10 places « pour la marge ». Le samedi de Léa a 8 places."
  - icon: check
    title: Accepter
    text: "Le oui porte sur l'incrément 1, la liste. Le formulaire n'est pas dans le même plan."
pitfall: "Accepter un plan qui encaisse les 45 € ou passe à 10 places, parce que le premier paragraphe semblait juste."
remember: "On corrige le plan pendant qu'aucun fichier n'a bougé. L'écriture commence après le oui, pas pendant la lecture."
```
