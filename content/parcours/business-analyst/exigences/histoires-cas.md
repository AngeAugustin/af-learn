---
title: "Histoires et cas d'utilisation"
description: "Écrire une user story et un cas d'utilisation de la réception, et savoir quand l'un éclaire ce que l'autre laisse dans l'ombre."
duration: 60
objectives:
  - "Rédiger une histoire avec un rôle réel du quai, pas avec l'enseigne pour sujet"
  - "Décrire un cas d'utilisation quand l'échange entre acteurs change l'issue"
  - "Choisir l'histoire ou le cas selon le trou à éclairer"
  - "Montrer les deux sur le refus d'une palette de surgelé"
---

# L'histoire dit qui et pourquoi

L'histoire, ou user story, est une phrase courte au service d'une exigence. Elle ne la remplace pas. Elle rend visible qui en a besoin, et pour quelle peine. La forme tenue à Halte Marché est : en tant que, je veux, afin de.

Trois histoires suffisent pour le cœur de la réception. Chacune pointe une exigence, elle n'en invente pas une quatrième.

- En tant qu'équipier réception, je veux enregistrer l'acceptation, le refus ou la mise de côté avant le départ du chauffeur, afin de ne plus laisser le motif dans le carnet noir. Elle éclaire EF-01.
- En tant que cheffe de rayon frais, je veux voir avant 10 h les refus du matin et leur motif, afin de ne pas décider seulement sur l'aspect. Elle éclaire EF-02.
- En tant que responsable expédition, je veux recevoir le motif d'un manquant ou d'un refus sans rappeler le magasin, afin de savoir quoi réexpédier. Elle éclaire le même geste, vu de Thomas.

« En tant que Halte Marché, je veux une réception fluide » n'est pas une histoire. L'enseigne n'est pas un rôle du quai. « Fluide » n'est pas une exigence. Jonas refuserait cette phrase, et il aurait raison.

L'histoire ne contient pas le seuil de 4 heures dans le « je veux ». Ce seuil est EM-01, déjà écrit, avec son indicateur. L'histoire montre qui souffre si le geste manque. Elle reste assez petite pour être racontée sur une palette, pas sur les quarante magasins d'un coup. Les 40 et le pic du lundi vivent dans les exigences non fonctionnelles. Les mettre dans l'histoire la transforme en discours.

Vous n'écrivez une histoire que lorsqu'un rôle humain doit s'y reconnaître. CON-02 (ne pas changer l'éditeur de caisse) n'a pas d'histoire utile : personne ne « veut » cette limite pour un bénéfice de quai. C'est une contrainte. La forcer dans « en tant que » produit une fiction.

# Le cas dit le dialogue

Le cas d'utilisation raconte un échange qui a une issue. On le nomme, on nomme les acteurs, on suit le chemin principal, puis les chemins où ça dévie. Il éclaire l'histoire quand le « je veux » ne dit pas qui parle à qui, ni ce qui se passe si la température est mauvaise.

Cas : **refuser une palette de surgelé**.

Acteurs : l'équipier réception, le chauffeur, la trace (le support où le motif sera lu ensuite, quel qu'il soit aujourd'hui). La cheffe de rayon n'est pas dans ce cas-ci. Le frais et la DLC ont un autre cas. Tout mettre dans un seul cas reproduit la phrase à « et » que vous avez déjà coupée.

Chemin principal, si la règle validée est REG-01 :

1. Le chauffeur présente la palette de surgelé. Le bon l'annonce.
2. L'équipier mesure la température à cœur.
3. La température dépasse -18 °C.
4. L'équipier refuse la palette, choisit le motif « température », et l'enregistre avant que le chauffeur parte.
5. Le chauffeur repart avec la palette, ou elle est isolée selon le motif. Elle ne va pas en chambre pour être vendue.
6. La trace permet à Thomas de voir le motif sans appeler.

Ce chemin suppose REG-01 validée. Tant qu'elle est en analyse à cause des neuf magasins à -15 °C, le cas n'est pas jouable comme cible. Vous pouvez écrire un second chemin « pratique actuelle de Rouen » dans la photo d'existant. Vous ne le mélangez pas au cas cible.

L'histoire de Yassine disait pourquoi il veut enregistrer. Le cas dit les six échanges qui rendent cet enregistrement vrai ou faux. Sans le cas, Nina pourrait cocher « il a noté quelque part » dès que le carnet noir a une ligne. Le cas exige le motif, le moment (avant le départ), et l'issue (pas en vente).

```video
url: https://www.youtube.com/watch?v=4emxjxonNRI
title: "UML use case diagrams: Everything you need to know"
channel: "Lucid Software"
duration: "12:42"
lang: en
why: "Les diagrammes de cas d'utilisation UML expliqués en détail : acteurs, cas et relations."
```

# Quand l'un éclaire l'autre

Vous n'écrivez pas les deux par habitude. Vous écrivez celui qui manque.

L'histoire suffit, ou elle suffit d'abord, quand le trou est le bénéficiaire. EF-02 était claire sur le geste et floue sur la peine. L'histoire de Claire (« afin de ne pas décider sur l'aspect ») relie l'irritant à la phrase. Un cas complet de sa matinée serait trop long tant que la liste des motifs n'est pas stable.

Le cas devient nécessaire quand l'issue dépend d'un dialogue ou d'une exception. Le refus de surgelé est de ceux-là : la sonde, le seuil, le chauffeur encore là, le motif, la palette qui ne part pas en chambre. Une histoire d'une ligne laisserait chaque magasin inventer l'ordre. Le cas fige l'ordre cible, pas l'ordre bricolé du carnet.

Le cas ne réécrit pas l'exigence. S'il a besoin d'un seuil que REG-01 n'a pas, vous retournez au cycle, vous ne le glissez pas dans l'étape 3. S'il a besoin d'un écran, vous avez trop dessiné : l'étape dit « enregistre », pas « ouvre le menu froid ». Sarah décidera du support si l'outil porte le sujet. Le cas reste vrai sur un papier bien tenu, dans les 7 magasins, le jour où la procédure est la solution retenue.

Hugo peut utiliser le cas pour comprendre ce qu'un lundi de recette doit contenir comme palettes. Il n'en fait pas un planning. Nina l'utilise pour jouer. Jonas vérifie que l'issue est bien la sienne : refus, pas « mis en chambre quand même ».

> [!TIP]
> Lisez l'histoire à l'acteur, et le cas à deux acteurs. Si Yassine se reconnaît et que le chauffeur n'a rien à faire dans le dialogue, le cas est incomplet ou trop long.

# Le refus, histoire puis cas

Reprenons le même fait de Rouen, deux palettes à -16 °C notées « un peu mou », parties en chambre, chauffeur parti après 35 minutes. L'existant est celui-là. La cible, si Jonas valide -18 °C, est autre. L'histoire et le cas parlent de la cible. La photo parle du lundi vu. Vous ne les fusionnez pas.

Histoire : en tant qu'équipier réception, je veux refuser sur le quai un surgelé au-dessus de -18 °C, afin que la palette ne parte pas en vente et que le motif existe pour l'entrepôt.

Cette histoire éclaire REG-01 et EF-01 ensemble, et c'est acceptable **si** le cas montre qu'il s'agit d'un seul dialogue, pas de deux projets. Le critère devra quand même les distinguer : règle fausse (on accepte à -16 °C) et geste faux (on refuse de tête, sans motif, après le départ) sont deux échecs.

Cas, chemins d'erreur à ne pas oublier, parce que l'histoire ne les voit pas :

- La sonde affiche une température, la chambre dira plus tard qu'elle était fausse. Le cas renvoie à la question ouverte : qu'est-ce qui fait foi. On ne l'improvise pas à l'étape 2.
- Le chauffeur part pendant la mesure. Le cas échoue EF-01, même si la température était bonne.
- Le motif est une phrase libre, « un peu mou ». Le cas échoue : le motif est un choix dans une liste, pas un souvenir.
- La palette est refusée sur le papier et quand même entrée en stock le soir. EM-02 et REG-01 échouent ensemble. Le cas le dit, pour que Pauline ne « répare » pas un refus.

Quand l'histoire et le cas se contredisent, le cas a souvent raison sur l'ordre, et l'histoire a souvent raison sur le bénéficiaire. Vous corrigez les deux pour qu'ils pointent les mêmes identifiants. S'ils pointent une phrase qui n'existe pas (« garantir la fraîcheur perçue »), vous jetez cette phrase. Vous ne créez pas l'exigence pour faire joli sous l'histoire.

```diagram
type: sequence
title: "Refuser une palette de surgelé"
actors:
  - "Équipier"
  - "Chauffeur"
  - "Trace"
  - "Entrepôt"
messages:
  - from: 1
    to: 0
    text: "Présente la palette annoncée sur le bon."
  - from: 0
    to: 2
    text: "Mesure à cœur, refuse au-dessus de -18 °C, enregistre le motif."
  - from: 0
    to: 1
    text: "La palette ne part pas en chambre de vente."
  - from: 3
    to: 2
    text: "Thomas lit le motif sans rappeler le magasin."
```

Thomas arrive après la trace. Il ne mesure pas à la place de l'équipier, et il ne rappelle plus pour savoir ce que le carnet voulait dire.

# Exercices

## Exercice 1 : En tant que Halte Marché

Sarah propose l'histoire : « En tant que Halte Marché, je veux une réception moderne, afin d'être au niveau des étiquettes électroniques. » Que gardez-vous, et que renvoyez-vous ?

<details>
<summary>Voir la solution</summary>

Vous ne gardez pas l'histoire. Halte Marché n'est pas un rôle du quai. « Moderne » ne se recette pas. Le lien avec les étiquettes mélange la réception et la roadmap de Sarah.

Vous proposez, si le besoin est bien EF-01, l'histoire de l'équipier : enregistrer avant le départ, afin de sortir le motif du carnet. Sarah reste libre de ne pas porter ce sujet dans l'outil ce trimestre. L'histoire ne lui prend pas cette décision. Elle ne cite pas les étiquettes.

</details>

## Exercice 2 : L'histoire trop seule

EF-01 et REG-01 sont validées. Nina n'a qu'une histoire d'une ligne et aucun cas. Elle coche « réussi » parce que Yassine a écrit « un peu mou » dans le carnet après le départ du chauffeur. Qu'est-ce qui manquait ?

<details>
<summary>Voir la solution</summary>

Le cas d'utilisation manquait. L'histoire dit le pourquoi. Elle ne dit pas l'ordre : mesurer, comparer à -18 °C, motif dans une liste, enregistrer avant le départ, ne pas mettre en vente.

« Un peu mou » après le départ échoue le motif, le moment, et probablement la règle si la palette est partie en chambre. Vous écrivez le cas, avec ces chemins d'erreur, pour que Nina ne puisse plus cocher sur le carnet seul. Vous ne changez pas l'histoire du bénéficiaire : Yassine en a toujours besoin. Vous complétez ce qu'elle ne voyait pas.

</details>

## Exercice 3 : Le cas qui invente un seuil

Le cas, étape 3, dit : « Si la température dépasse -15 °C, l'équipier refuse. » REG-01, encore en analyse, parle de -18 °C au siège et de -15 °C dans neuf magasins. Que faites-vous du cas ?

<details>
<summary>Voir la solution</summary>

Vous ne laissez pas le cas trancher le degré à la place de Jonas. Un seuil glissé dans une étape devient une règle fantôme, que Nina jouera sans signature.

Vous sortez -15 °C de l'étape cible. Vous notez le chemin « pratique Rouen » dans l'existant, pas dans le cas à recetter. Le cas cible attend que REG-01 passe à validée avec un seul nombre. D'ici là, le statut du cas est le même que celui de la règle : pas jouable comme conclusion métier. Hugo peut préparer des palettes de test. Il ne fait pas conclure sur un degré que le cas aurait choisi tout seul.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Histoires et cas d'utilisation"
center: "L'histoire dit qui souffre. Le cas dit l'échange qui fait réussir ou échouer."
points:
  - icon: chat
    title: "Histoire"
    text: "En tant qu'équipier, cheffe de rayon ou expédition. Jamais en tant que l'enseigne."
  - icon: list
    title: "Cas"
    text: "Refuser un surgelé : mesurer, seuil, motif, départ du chauffeur, pas de mise en vente."
  - icon: idea
    title: "Le trou décide"
    text: "L'histoire quand le bénéficiaire est flou. Le cas quand l'exception change l'issue."
  - icon: alert
    title: "Chemins d'erreur"
    text: "Sonde douteuse, chauffeur déjà parti, motif libre, refus ressaisi en stock le soir."
  - icon: link
    title: "Mêmes identifiants"
    text: "Histoire et cas pointent EF et REG. Ils n'inventent ni seuil ni écran."
pitfall: "Cocher réussi parce que le carnet dit un peu mou, sans cas sur le moment ni sur le motif."
remember: "Une histoire pour le pourquoi, un cas pour le dialogue. Si les deux se contredisent, on les réaligne sur l'exigence."
```
