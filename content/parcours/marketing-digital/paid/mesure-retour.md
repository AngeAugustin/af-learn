---
title: Mesurer le retour
description: "Lire un ROAS et un CPA avec la marge de Lumen, choisir une fenêtre courte sans se raconter d'histoire, et couper quand le seuil est dépassé."
duration: 60
objectives:
  - "Calculer ce qu'il reste vraiment après la pub, pas seulement le chiffre d'affaires"
  - "Lire un ROAS avec le plancher de 1,7 imposé par une marge de 60 %"
  - "Tenir une fenêtre d'attribution courte et dire ce qu'elle oublie"
  - "Couper un groupe après assez de dépense, pas après une mauvaise journée"
---

# Le chiffre d'affaires n'est pas le retour

Une commande Lumen affiche **42 €**. Ce n'est pas 42 € pour l'équipe. La marge est de **60 %** : **25,20 €** avant la publicité, le reste paie la cire, le verre, le colis, le paiement. Samir et Léa le savent. Une interface publicitaire, non. Elle additionne des ventes. Elle peut vous féliciter pendant que vous perdez de l'argent.

Le retour, pour vous, est ce qui reste **après** la pub :

**marge en euros − coût d'acquisition**

Sur une commande au prix habituel : 25,20 € − CPA. À 18 € de CPA, il reste **7,20 €**. À 25 €, il reste **0,20 €**. À 30 €, vous perdez **4,80 €** par commande, et Nora a quand même un client à servir. Le seuil de coupure utilisé dans ce parcours est donc **25 €** de CPA. La cible, celle qui laisse de l'air pour le temps des quatre, est **18 €**.

Si Nora a un code de 20 %, le calcul change avant même la pub. Panier 33,60 €, marge 20,16 €. Un CPA de 18 € ne laisse plus que 2,16 €. Annoncer « on tient les 18 € » sans dire à quel prix la commande a été payée est un chiffre incomplet.

# ROAS et CPA disent la même chose, si le panier est stable

Le **CPA** est le coût pour une commande. Le **ROAS** est le chiffre d'affaires divisé par la dépense pub. Avec un panier stable à 42 €, les deux se traduisent.

| CPA | Calcul du ROAS | Ce qui reste après pub |
| --- | --- | --- |
| 14 € | 42 / 14 = 3,0 | 25,20 − 14 = 11,20 € |
| 18 € | 42 / 18 = 2,3 | 7,20 € |
| 25 € | 42 / 25 = 1,7 | environ 0 € |
| 35 € | 42 / 35 = 1,2 | perte d'environ 10 € |

Le ROAS d'équilibre, avec 60 % de marge, est **1,7** (42 / 25,20). En dessous, le premier achat perd de l'argent. Un ROAS de 4 a l'air spectaculaire et l'est souvent : environ 10,50 € de pub, il reste près de 15 €. Un ROAS de 2,3 est la cible, pas un échec. Un ROAS de 1,2 est une perte, même si « les ventes montent ».

Le ROAS devient menteur quand le panier bouge. Un coffret à 78 € (marge 46,80 €) et une bougie à 42 € n'ont pas le même ROAS d'équilibre en apparence, mais le même plancher de marge : 1,7, tant que la marge reste 60 % du prix payé. Ce qui change, c'est le CPA acceptable en euros : environ 47 € sur le coffret avant de manger la marge, 25 € sur la bougie. Raison pour laquelle on ne pilote pas les deux groupes avec un seul ROAS moyen.

> [!TIP]
> Écrivez le seuil en euros sur le groupe, pas seulement en ROAS. « Couper au-dessus de 25 € » se vérifie. « Viser un bon ROAS » ne se vérifie pas.

```diagram
type: stack
title: "Une commande à 42 €, où vont les euros"
segments:
  - label: "Coûts (40 %)"
    value: 16.8
    tone: rose
    text: "Cire, verre, colis, paiement. 16,80 €. Ce n'est pas de la marge."
  - label: "Pub, si CPA 18 €"
    value: 18
    tone: amber
    text: "La cible. Il reste 7,20 € pour l'équipe après cette dépense."
  - label: "Reste"
    value: 7.2
    tone: teal
    text: "7,20 €. À 25 € de pub, ce reste tombe à presque rien."
```

# Une fenêtre courte, assumée

L'**attribution** répond à : quelle dépense a le droit de revendiquer cette commande ? La régie propose des fenêtres. « 7 jours après le clic », « 1 jour après le clic », « vue plus clic ». Plus la fenêtre est longue, plus le ROAS de l'interface est flatteur, parce que des commandes qui seraient arrivées autrement lui sont rattachées.

Pour piloter Lumen, vous lisez une fenêtre **courte et stable : 7 jours après le clic**. Courte, pour ne pas vous raconter qu'une impression d'il y a un mois a « fait » la vente de samedi. Stable, pour comparer deux semaines entre elles. Vous ne changez pas de fenêtre le jour où le chiffre déplaît.

Ce que cette fenêtre oublie, dites-le à voix haute.

- Un cadeau de Noël réfléchi pendant trois semaines peut être sous-estimé.
- Un e-mail de Nora, ouvert le jour même, peut prendre le dernier clic alors que la recherche a fait le travail dix jours plus tôt.
- Une commande au-delà de 7 jours existe dans la caisse, et dans aucune colonne pub. La caisse de Léa reste le juge du chiffre d'affaires. La fenêtre est le juge de la **décision pub**, pas de la santé de l'atelier.

Vous n'allongez pas la fenêtre pour « atteindre » le ROAS de 2,3. Si à 7 jours le CPA est à 32 €, la campagne ne devient pas rentable parce que vous comptez 28 jours. Elle devient plus difficile à contredire.

> [!WARNING]
> Deux ROAS ne se comparent pas s'ils n'ont pas la même fenêtre, le même événement (commande payée, pas ajout au panier) et le même prix (avec ou sans code).

# Quand couper, quand laisser, quand augmenter

Trois décisions, pas une atmosphère.

**Couper** un groupe si, sur la fenêtre de 7 jours, vous avez dépensé **au moins 400 €** et le CPA est **au-dessus de 25 €** (ou au-dessus de la marge réelle si un code a baissé le panier). Couper veut dire : ce groupe ne dépense plus. Pas « on baisse un peu en espérant ». L'argent libéré ne doit pas être redépensé le jour même sur un groupe que vous n'avez pas encore jugé.

**Laisser** si le CPA est entre 18 et 25 €. La marge n'est pas mangée. Elle est mince. On n'y met pas la réserve. On n'y ajoute pas un code pour « passer sous 18 ». Le code baisserait la marge en même temps que le CPA, et vous ne sauriez plus lequel des deux a bougé.

**Augmenter** par paliers si le CPA est sous 18 €, stable sur 7 jours, stock confirmé par Samir, page inchangée. Un palier, c'est une hausse modérée du budget du jour, puis de nouveaux 7 jours avant le palier suivant. Doubler parce que « vendredi il reste du budget » ramène des ventes plus chères : la régie va chercher plus loin, vers des gens moins prêts à payer 42 €.

La deuxième commande, dans huit à dix semaines, peut justifier un CPA un peu plus haut **si** vous la mesurez. Tant que vous ne la mesurez pas, vous ne l'avancez pas comme argument pour garder un groupe à 30 €. Espérer un réachat n'est pas un réachat.

# La caisse et l'interface ne se remplacent pas

Chaque semaine, une ligne suffit : dépense pub, commandes payées vues par la caisse, chiffre d'affaires encaissé, marge à 60 % de cet encaissé, marge moins pub. Si l'interface annonce 40 commandes et la caisse 28, vous pilotez avec 28 pour l'argent, et vous cherchez l'écart (fenêtre, retours, annulations, pixel qui compte un début de paiement). Vous ne « faites confiance » ni à l'un ni à l'autre les yeux fermés.

Les retours existent. Une bougie revenue n'a pas laissé 25,20 €. Si les retours sont rares, les ignorer une semaine ne change pas la décision. S'ils se concentrent sur le produit que vous poussez, le CPA « réussi » est faux. Samir le voit dans les colis qui rentrent. Vous le demandez avant d'augmenter un budget.

L'équipe de quatre n'a pas besoin d'un tableau de quarante lignes pour cette décision. Elle a besoin d'un seuil écrit, d'une fenêtre écrite, et du droit de ne pas dépenser.

# Exercices

## Exercice 1 : Il reste combien ?

Trois groupes, fenêtre 7 jours, prix plein, marge 60 %. Search : 640 € de pub, 40 commandes. Social A : 440 €, 20 commandes. Social B : 300 €, 8 commandes. Pour chacun : CPA, ROAS, euros restants après pub. Que faites-vous ?

<details>
<summary>Voir la solution</summary>

Search : CPA 640 / 40 = 16 €. ROAS 40 × 42 / 640 = 2,6. Marge 40 × 25,20 = 1 008 €. Après pub : 1 008 − 640 = 368 €. Sous la cible de 18 €. On peut envisager un palier de budget, si le stock suit et si ces 40 commandes sont bien dans la caisse.

Social A : CPA 22 €. ROAS 20 × 42 / 440 = 1,9. Marge 504 €, après pub 64 €. Entre 18 et 25 : on laisse, on n'y met pas la réserve, on ne met pas de code.

Social B : CPA 37,50 €. ROAS 336 / 300 = 1,1. Marge 201,60 €, après pub une perte d'environ 98 €. Au-dessus de 25 € et au-dessus de 400 € n'est pas atteint (300 €). On ne coupe pas encore sur la règle des 400 €, mais on ne lui donne pas un euro de plus. S'il passe 400 € en restant au-dessus de 25 €, on coupe.

</details>

## Exercice 2 : La fenêtre qui arrange

Le social B est à 37 € de CPA sur 7 jours. En passant l'interface à 28 jours après le clic, le CPA « tombe » à 19 €. Léa demande si on peut présenter 19 €. Que répondez-vous ?

<details>
<summary>Voir la solution</summary>

Non. On ne change pas de fenêtre pour atteindre la cible. Le pilotage Lumen est à 7 jours après le clic, parce que cette fenêtre est courte et comparable d'une semaine à l'autre. 19 € sur 28 jours mélange des commandes que la pub n'a peut-être pas provoquées, et vous interdit de comparer avec le search, lu à 7 jours.

Vous pouvez dire à Léa : « À 28 jours l'outil raconte 19 €. À notre fenêtre, c'est 37 €, donc une perte sur le premier achat. On n'augmente pas. On coupe si on dépasse 400 € au-dessus de 25 €. » La caisse dira, elle, combien a vraiment été encaissé. Elle ne dira pas que le social B a le droit de continuer.

</details>

## Exercice 3 : Le code a bougé le seuil

Nora a offert 20 % sur le search pendant ces 7 jours. 40 commandes, mais le panier encaissé moyen est 33,60 €, pas 42 €. Dépense inchangée : 640 €. Le CPA est toujours 16 €. Est-ce encore un groupe à augmenter ?

<details>
<summary>Voir la solution</summary>

Marge unitaire : 33,60 × 0,60 = 20,16 €. Après 16 € de pub, il reste 4,16 € par commande, pas 9,20 €. Total : 40 × 20,16 − 640 = 806,40 − 640 = 166,40 €. C'est encore positif, et le CPA de 16 € est sous la nouvelle marge. Mais la cible « 18 € de confort » était calée sur 25,20 € de marge. Ici, 16 € est déjà près du nouveau plafond utile. On n'augmente pas le budget tant que le code tourne. On ne mélange pas ces 7 jours avec une semaine à plein tarif.

Le ROAS sur le chiffre encaissé est 40 × 33,60 / 640 = 2,1. Le ROAS sur le prix barré de 42 € serait un mensonge : cet argent n'est pas rentré.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Mesurer le retour"
center: "Le retour, c'est la marge moins la pub. Avec 60 % sur 42 €, le plancher de ROAS est 1,7 et le CPA se coupe à 25 €."
points:
  - icon: scale
    title: "Marge moins pub"
    text: "25,20 € moins le CPA. À 18 € il reste 7,20 €. À 30 € on perd 4,80 € par commande."
  - icon: chart
    title: "ROAS 1,7"
    text: "42 divisé par 25,20. En dessous, le premier achat perd. Un ROAS de 2,3 est la cible, pas un échec."
  - icon: clock
    title: "7 jours, clic"
    text: "Fenêtre courte et stable. On ne l'allonge pas le jour où le CPA déplaît. La caisse juge l'argent."
  - icon: alert
    title: "Couper à 25 €"
    text: "Après 7 jours et au moins 400 €. Entre 18 et 25, on laisse. Sous 18, on peut monter d'un palier."
  - icon: money
    title: "Le prix payé"
    text: "Un code à 20 % baisse le panier à 33,60 € et la marge à 20,16 €. Le seuil baisse avec."
pitfall: "Annoncer un ROAS de 4 sur 28 jours, prix barré, pendant que la caisse encaisse des paniers soldés."
remember: "CPA, ROAS et fenêtre écrite. On coupe quand la marge est mangée, pas quand une journée fait peur."
```
