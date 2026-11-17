---
title: "Ce qui quitte la machine"
description: "Savoir ce que Cursor envoie au fournisseur, régler Privacy Mode, et garder la vraie liste d'attente hors du chat."
duration: 50
objectives:
  - "Dire que le prompt et le contexte de code partent chez le fournisseur du modèle"
  - "Régler Privacy Mode dans Cursor Settings, page General, avec Ctrl+Shift+J"
  - "Distinguer l'envoi du contexte, l'entraînement et les accords de non-rétention"
  - "Travailler avec Camille et 3 places restantes, sans coller la vraie liste"
---

# Deux choses quittent la machine

Léa Vernet tient l'Atelier Sève à Lyon Croix-Rousse. Le samedi, 10 h-13 h, 8 places, 45 €. L'attente monte au plus à 12 personnes. Léa tranche avant 18 h la veille. Douze stages par mois, remplissage autour de 70 %, environ 3 absents parce qu'un SMS a été oublié. App Sève porte ces faits. Quand vous demandez de l'aide à l'IA de Cursor, deux choses partent : le prompt, et le contexte de code qui l'accompagne.

Ils sont envoyés au fournisseur du modèle, pour que la réponse puisse se construire. Ce n'est pas un fichier qui reste ouvert seulement sur votre écran. La demande quitte la machine. Vous choisissez donc ce que vous mettez dans le chat, et quels fichiers vous laissez dans le contexte, avant d'écrire la question.

> [!IMPORTANT]
> Le prompt et le contexte de code sont envoyés au fournisseur du modèle. Le contexte part pour que le modèle puisse répondre.

# Ouvrir General

Privacy Mode se règle dans Cursor Settings. Sous Windows, vous ouvrez ces réglages avec Ctrl+Shift+J. La page est General. Vous y lisez l'état du mode avant une question qui touche Sève, pas après coup.

Le geste tient en trois temps. Vous appuyez sur Ctrl+Shift+J. Vous ouvrez General. Vous regardez Privacy Mode, activé ou non, et vous en tirez la conséquence avant de coller quoi que ce soit. Si vous ne voyez pas la page, vous ne devinez pas l'état du réglage. Vous cherchez General, puis vous revenez au chat.

> [!TIP]
> Faites ce détour avant la question, pas au milieu d'un collage. Le réglage se lit. Il ne se suppose pas.

# Activé et désactivé

Activé, Privacy Mode change l'usage qui peut être fait du code. Le code n'est pas utilisé pour entraîner Cursor, ni les fournisseurs. Des accords de non-rétention existent. Le contexte, lui, est quand même envoyé : sans lui, le modèle ne pourrait pas répondre à partir de vos fichiers.

Désactivé, l'envoi a toujours lieu, pour la même raison. En plus, Cursor peut conserver des extraits, et les utiliser pour améliorer les modèles. Vous ne confondez pas les deux positions. L'une et l'autre envoient le contexte. Elles ne disent pas la même chose sur l'entraînement ni sur la conservation d'extraits.

```diagram
type: compare
title: "Privacy Mode sur la page General"
columns:
  - title: "Activé"
    tone: teal
    items:
      - "Le contexte est envoyé pour répondre"
      - "Le code n'entraîne ni Cursor ni les fournisseurs"
      - "Des accords de non-rétention existent"
  - title: "Désactivé"
    tone: amber
    items:
      - "Le contexte est envoyé aussi, pour répondre"
      - "Cursor peut conserver des extraits"
      - "Ces extraits peuvent servir à améliorer les modèles"
```

Une équipe peut imposer Privacy Mode. Vous vérifiez tout de même la page General : l'état affiché est celui de votre session. Vous ne le déduisez pas d'une habitude d'équipe racontée dans le chat.

> [!NOTE]
> Une équipe peut imposer Privacy Mode. La page General reste l'endroit où vous lisez le réglage.

# Une clé personnelle, le même chemin

Une clé d'API personnelle ne raccourcit pas le trajet. Même avec cette clé, la requête passe par Cursor. Elle ne saute pas l'éditeur pour aller seule chez le fournisseur. Le schéma reste le vôtre : vous écrivez, Cursor transmet le prompt et le contexte, le fournisseur répond, le chat affiche le texte.

Vous ne traitez donc pas la clé comme une raison de coller davantage. Elle ne ramène pas les fichiers sur la seule machine. Elle ne change pas non plus la règle de l'atelier : 8 places, 45 €, attente 12, 18 h la veille. Elle change un moyen d'accès au modèle, pas le chemin de la demande.

```diagram
type: flow
title: "Le chemin de la demande"
steps:
  - title: "Vous"
    text: "Le prompt, plus le contexte de code que vous avez laissé autour."
    tone: violet
  - title: "Cursor"
    text: "La requête passe par Cursor, y compris avec une clé d'API personnelle."
    tone: blue
  - title: "Fournisseur"
    text: "Il reçoit ce contexte pour construire la réponse."
    tone: teal
  - title: "Le chat"
    text: "Vous lisez la réponse. L'envoi a déjà eu lieu."
    tone: amber
```

# Ce que l'interrupteur ne couvre pas

Privacy Mode activé ne rend pas un collage anodin. Le code n'est pas repris pour l'entraînement, et des accords de non-rétention existent. La liste que vous auriez collée a tout de même été envoyée, parce que le contexte part pour répondre. Désactivé, des extraits peuvent en plus être conservés pour améliorer les modèles.

Vous séparez donc deux questions. La première : quel est l'état sur la page General ? La seconde : ai-je le droit de mettre ce texte dans le chat ? Un oui à la première ne répond pas à la seconde. Les prénoms et les téléphones de la file d'attente échouent à la seconde, quel que soit l'interrupteur.

> [!WARNING]
> Activé ne veut pas dire « rien ne part ». Le contexte est envoyé pour répondre. Vous choisissez encore ce qui a le droit d'y figurer.

# Camille à la place de la vraie liste

La liste d'attente de Sève contient des prénoms et des téléphones. Vous ne collez pas cette liste dans le chat. Vous ne la résumez pas non plus en gardant les vrais numéros « pour que le modèle compte juste ». Le compte dont vous avez besoin pour travailler se fait avec des données fictives.

L'exemple du chapitre : Camille, 3 places restantes. Ce prénom ne vient pas de la file réelle. « 3 places restantes » parle des sièges encore libres sur les 8, pas des personnes qui patientent, et pas d'un téléphone. Vous pouvez demander : « Avec 8 places et 5 inscrites, Camille voit 3 places restantes. Quelle phrase la page doit-elle afficher ? » Le modèle répond sans la liste vraie.

Si la question porte sur l'attente, vous inventez le même genre de jeu : un prénom fictif, un nombre, aucun numéro. Vous gardez 45 €, le plafond de 8, l'attente maximum de 12 et l'heure de 18 h dans la phrase, quand ils servent la question. Vous n'y ajoutez personne de réel.

# Exercices

## Exercice 1 : L'interrupteur avant la question

Vous allez demander de l'aide sur le texte des places restantes. Vous êtes sous Windows. Où lisez-vous Privacy Mode, et que change un mode activé ?

<details>
<summary>Voir la solution</summary>

Vous ouvrez Cursor Settings avec Ctrl+Shift+J, page General, et vous lisez Privacy Mode. Activé, le code n'est pas utilisé pour entraîner Cursor ni les fournisseurs, et des accords de non-rétention existent.

Le contexte est quand même envoyé, pour que le modèle puisse répondre. Vous ne collez pas la liste réelle avant d'avoir lu ce réglage, ni après.

</details>

## Exercice 2 : La clé et la liste

Un collègue dit : « J'ai mis ma clé d'API, donc la requête ne passe plus par Cursor. Je peux coller les prénoms et les téléphones de l'attente. » Que répondez-vous ?

<details>
<summary>Voir la solution</summary>

La requête passe par Cursor même avec une clé d'API personnelle. La clé ne ramène pas le prompt sur la seule machine. Les prénoms et les téléphones de la liste réelle ne vont pas dans le chat.

Vous travaillez avec des données fictives. L'exemple : Camille, 3 places restantes. Privacy Mode, lu sur la page General, ne rend pas ce collage acceptable : le contexte part pour répondre.

</details>

## Exercice 3 : Désactivé, puis un collage

Privacy Mode est désactivé. Pour aller plus vite, vous collez quand même la file, numéros compris, « le temps du calcul ». Qu'est-ce qui est déjà vrai, et que faites-vous à la place ?

<details>
<summary>Voir la solution</summary>

Désactivé, le contexte part aussi. Cursor peut conserver des extraits et les utiliser pour améliorer les modèles. Le collage a déjà envoyé des prénoms et des téléphones. Vous arrêtez. Vous ne complétez pas avec d'autres numéros.

Le calcul reprend avec un jeu fictif : Camille, 3 places restantes, 8 places, 45 €. Une équipe peut imposer Privacy Mode : vous vérifiez la page General, vous ne vous fiez pas au souvenir du collage.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Ce qui part vraiment
center: "Le prompt et le contexte sont envoyés pour répondre. Privacy Mode change l'entraînement, pas cet envoi."
points:
  - icon: cloud
    title: Le trajet
    text: "Prompt et contexte de code vont au fournisseur du modèle. La requête passe par Cursor."
  - icon: lock
    title: Mode activé
    text: "Pas d'entraînement pour Cursor ni les fournisseurs. Des accords de non-rétention existent."
  - icon: alert
    title: Mode désactivé
    text: "Cursor peut conserver des extraits et s'en servir pour améliorer les modèles."
  - icon: key
    title: Clé personnelle
    text: "Elle ne retire pas Cursor du chemin. Le contexte part toujours pour la réponse."
  - icon: users
    title: La file réelle
    text: "Prénoms et téléphones restent hors du chat. Vous travaillez avec Camille, 3 places restantes."
  - icon: tool
    title: Le réglage
    text: "Ctrl+Shift+J, Cursor Settings, page General. Une équipe peut imposer Privacy Mode."
pitfall: "Croire que Privacy Mode, ou une clé personnelle, garde la liste réelle sur la machine, puis la coller dans le chat."
remember: "Le contexte part pour répondre. Vous lisez General. Vous travaillez avec Camille, pas avec les téléphones de la file."
```
