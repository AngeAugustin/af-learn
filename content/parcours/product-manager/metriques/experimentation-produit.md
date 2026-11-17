---
title: "Décider après une expérience"
description: "Poser une hypothèse produit Halte, une métrique primaire et une durée, puis décider même quand l'écart n'est pas significatif."
duration: 60
objectives:
  - "Écrire une hypothèse en si, alors, parce que, avant d'allumer la règle"
  - "Choisir une seule métrique primaire, et des garde-fous qui ne la remplacent pas"
  - "Fixer la durée avant de regarder les chiffres"
  - "Prendre une décision explicite quand l'écart n'est pas significatif"
---

# Une hypothèse, pas un espoir

Vous n'allumez pas Villeneuve « pour voir si ça marche ». « Ça marche » se réécrit le jour où un chiffre arrange. Une expérience commence par une **hypothèse** que les faits peuvent contredire.

Si, sur les pilotes, on n'affiche une heure précise que lorsque le signal existe avant 17 h 30 et dit que le camion passe avant 19 h, et un créneau large sinon, alors la part des commandes dont la promesse est affichée et tenue augmente, parce qu'on cesse d'inventer des heures.

Le **si** est étroit : cette règle, pas le SMS, pas le créneau fin, pas les huit transporteurs sans signal. Le **alors** est la north star, sur les commandes des pilotes. Le **parce que** vous interdit d'expliquer n'importe quelle hausse. Si la part monte alors que Karim n'a pas ouvert avant 17 h 30, le parce que est faux. Vous ne gardez pas la conclusion.

Vous n'expérimentez pas l'obligation. Au 1er septembre, afficher quelque chose avant paiement ne se met pas en balance avec « ne rien afficher ». L'expérience porte sur **comment** vous montrez un créneau tenable, pas sur le droit de vous taire.

« Les pilotes vont aimer, et les chiffres suivront » ne peut pas vous donner tort. Ce n'est pas une hypothèse. Ça sort de la page.

> [!IMPORTANT]
> Si aucune observation ne peut vous donner tort, vous n'avez pas une hypothèse. Vous avez un souhait.

# Une seule métrique primaire

La métrique **primaire** est le alors, et il n'y en a qu'une. Ici : la part des commandes des pilotes pour lesquelles une promesse a été affichée et tenue, sur toutes leurs commandes.

Le reste est garde-fou. La part de promesses rompues ne doit pas monter. Les appels au transporteur et les soirs où Lina est gardée pour rien ne doivent pas exploser. Karim doit ouvrir avant 17 h 30 les samedis de décision, et le matin avant de préparer : sinon le parce que ne peut pas être vrai. Ce n'est pas une deuxième primaire. Les téléchargements ne sont pas dans la page.

Avec deux primaires, vous choisirez celle qui a bougé. La primaire se nomme **avant** d'allumer.

Vous écrivez aussi ce qui vous ferait arrêter même si la primaire est belle. Plus aucun créneau n'est proposé. Les promesses rompues montent. Le numérateur et l'offre se vident ensemble. Un garde-fou franchi bat une primaire flatteuse. Dit avant, pas découvert comme une excuse.

Vous n'avez pas à produire une formule. Vous demandez à la personne qui lit les chiffres : l'écart est-il assez net, sur assez de commandes et de samedis de décision, pour qu'on accepte de ne pas le mettre sur le compte d'une semaine bizarre ? « Non » est une réponse. Vous ne demandez pas un calcul plus généreux.

```diagram
type: flow
title: "Écrit avant d'allumer"
steps:
  - title: Hypothèse
    text: "Si on n'invente plus l'heure, la promesse affichée et tenue monte."
    tone: violet
  - title: Primaire
    text: "Une seule : affiché et tenu, sur toutes les commandes des pilotes."
    tone: blue
  - title: Garde-fous
    text: "Promesses rompues, Lina gardée pour rien, plus aucun créneau."
    tone: amber
  - title: Durée
    text: "Trois semaines, décidées avant le premier graphique."
    tone: teal
```

# Une durée choisie avant

Vous fixez **trois semaines** avant le premier jour allumé. Pas « on regardera ». Trois semaines couvrent plus d'un rythme : une promotion, un samedi où le camion est déjà passé, et au moins un samedi où la décision de 17 h 30 se pose vraiment. Une semaine seule peut être entièrement le tract. Vous croiriez tester la règle, vous testeriez la promotion.

Vous ne déclarez pas victoire au jour 4, ni n'éteignez par déception, sauf garde-fou cassé net (aucun créneau, ou une heure qui promet l'inverse du signal). La durée protège l'équipe de votre humeur.

Prolonger se décide. Si au jour 21 on vous dit que trop peu de samedis de décision sont passés, vous pouvez prolonger **une fois**, même primaire, même règle. Vous ne changez pas la question. Vous ne raccourcissez pas parce qu'un directeur veut annoncer les quarante jeudi.

La comparaison reste simple : les pilotes pendant ces trois semaines, face aux mêmes magasins avant, en sachant qu'une promotion d'un seul côté fausse la lecture. Vous ne choisissez pas la comparaison après avoir vu celle qui vous donne raison.

```video
url: https://www.youtube.com/watch?v=jEpwNaHjD68
title: "How To A/B Test a Product"
channel: "Aced (formerly Exponent)"
duration: "4:24"
lang: en
why: "Comment mener un test A/B sur un produit, étape par étape."
```

# Quand ce n'est pas significatif

**Pas significatif** veut dire : l'écart peut encore être le hasard de ces semaines. Ce n'est pas un presque oui. Ce n'est pas un échec de l'équipe. Ce n'est pas une autorisation d'élargir « parce que le sens est bon ».

Vous choisissez, et vous l'écrivez.

1. **On éteint.** La règle n'a pas montré qu'elle change la primaire, et un garde-fou a souffert, ou le parce que est faux.
2. **On garde au pilote, sans élargir.** L'écart est dans le bon sens, il n'est pas net, et vous savez pourquoi le geste n'a souvent pas eu lieu (ouvert à 11 h, ou à 18 h 50). Vous corrigez cela. Vous ne vendez pas le réseau.
3. **On prolonge une fois**, même primaire, parce que trop peu de samedis de décision sont dans la période, et que les garde-fous tiennent.

Vous ne changez pas la primaire après coup pour en trouver une qui bouge. Vous ne moyennez pas un non significatif avec l'enthousiasme de la démo. La démo a montré que le cas se rejoue. L'expérience demande si le résultat bouge. Les deux peuvent diverger.

Léa peut vouloir élargir quand même, à cause du 1er septembre. Vous lui dites ce que les semaines ont montré, y compris « pas assez net ». Si elle élargit en l'assumant, elle ne vous fait pas dire que l'expérience est concluante.

> [!WARNING]
> « Le sens est bon, on y va » n'est pas une lecture. Si l'écart peut être le hasard, vous décidez en le disant. Vous ne le rebaptisez pas succès.

# Exercices

## Exercice 1 : L'hypothèse qui ne peut pas perdre

Un directeur écrit : « Si on améliore la livraison, les clients seront plus contents, parce que Halte sera plus moderne. » Que lui demandez-vous de réécrire ?

<details>
<summary>Voir la solution</summary>

Un si étroit, un alors qui se compte, un parce que qu'on peut trouver faux. Le si : on n'affiche une heure précise que si le signal est là avant 17 h 30 et dit que le camion passe avant 19 h, sinon un créneau large, sur les pilotes. L'alors : la part des commandes avec promesse affichée et tenue augmente. Le parce que : on cesse d'inventer des heures.

« Plus contents » et « plus moderne » ne peuvent pas vous donner tort. Si, dans trois semaines, la part ne bouge pas alors que Karim a bien ouvert à l'heure, l'hypothèse est contredite. C'est cela, une hypothèse.

</details>

## Exercice 2 : Deux primaires

Au jour 10, la primaire est stable, et les appels d'Inès vers les magasins ont baissé. On propose de déclarer les appels comme primaire, puisque c'est ce qui a bougé, et d'élargir. Que répondez-vous ?

<details>
<summary>Voir la solution</summary>

Vous refusez le changement. Les appels étaient un garde-fou, pas le alors écrit avant d'allumer. Les prendre comme étoile après le graphique, c'est choisir le chiffre qui arrange.

Vous notez la baisse comme une bonne nouvelle de garde-fou. Vous attendez les trois semaines, sauf garde-fou cassé. À la fin, si la primaire n'est pas nette, vous éteignez, vous restez au pilote, ou vous prolongez une fois. Vous n'élargissez pas sur un chiffre de remplacement.

</details>

## Exercice 3 : Pas assez net

À trois semaines, la primaire est un peu plus haute. On vous dit que l'écart n'est pas significatif : peu de commandes, une promotion, un seul samedi où la décision se posait. Les garde-fous tiennent. Karim n'a ouvert avant la préparation que quatre matins sur quinze, et le samedi de décision il a ouvert à 18 h 50. Léa demande si c'est concluant. Que dites-vous ?

<details>
<summary>Voir la solution</summary>

Vous dites que ce n'est pas concluant. L'écart peut être le hasard ou la promotion. Le parce que est fragile : la plupart des matins, l'écran n'a pas été ouvert avant la préparation, et le samedi utile il l'a été après 17 h 30. La règle n'a souvent pas agi.

Vous ne maquillez pas le récit pour le 1er septembre. Vous proposez de garder la règle sur les pilotes, et de corriger d'abord l'heure d'ouverture. Si Léa élargit quand même, elle le fait en sachant que la preuve n'est pas là. Vous n'appelez pas cela un résultat significatif.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Décider même sans écart net
center: "Hypothèse si, alors, parce que. Une primaire. Une durée écrite avant. Pas significatif, on choisit quand même."
points:
  - icon: idea
    title: Hypothèse
    text: "Si on n'invente plus l'heure, la promesse tenue monte, parce que le signal remplace l'heure au hasard."
  - icon: target
    title: Une primaire
    text: "Affiché et tenu, sur toutes les commandes pilotes. Deux primaires, et vous choisirez celle qui arrange."
  - icon: clock
    title: Trois semaines
    text: "Fixées avant le jour 1. Le jour 4 ne couronne pas. Prolonger se décide, une fois, sans changer la question."
  - icon: scale
    title: Pas significatif
    text: "L'écart peut être le hasard. Ce n'est pas un presque oui. On éteint, on reste au pilote, ou on prolonge une fois."
  - icon: shield
    title: Garde-fou
    text: "Aucun créneau, promesses rompues, Lina gardée pour rien. Un garde-fou cassé bat une primaire belle."
pitfall: "Rebaptiser les appels en primaire au jour 10, ou dire à Léa que c'est concluant parce que le sens est bon."
remember: "L'expérience est faite pour pouvoir avoir tort. Si l'écart n'est pas net, vous décidez à voix haute, vous ne le transformez pas en succès."
```
