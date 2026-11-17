---
title: "Relire une dépendance nouvelle"
description: "Lire le nom exact, la raison, la licence et le verrou avant d'accepter un paquet, et refuser le paiement hors sujet."
duration: 50
objectives:
  - "Traiter un paquet ajouté dans package.json et dans le verrou comme une décision"
  - "Lire le nom exact, la raison, la licence, et l'étendue du fichier de verrouillage"
  - "Refuser un SDK de paiement pour l'incrément 1, la liste des 12 stages"
  - "Refuser une installation lancée depuis une adresse inconnue"
---

# Deux fichiers, une décision

L'incrément 1 d'App Sève est la liste des 12 stages. Léa Vernet, Atelier Sève, Lyon Croix-Rousse, samedi 10 h-13 h, 8 places à 45 €. Attente maximum 12, décision avant 18 h la veille. Remplissage autour de 70 %, environ 3 absents par mois à cause d'un SMS oublié. Pour afficher ces 12 stages, l'agent peut proposer un paquet.

Un paquet qui apparaît dans `package.json` et dans le fichier de verrouillage n'est pas un détail du diff. C'est une décision. Vous la lisez avant d'accepter. Le résumé du chat (« j'ai ajouté une petite dépendance ») ne suffit pas. Vous ouvrez les deux fichiers dans le diff de Cursor, et vous les lisez comme vous liriez une règle métier.

> [!IMPORTANT]
> `package.json` et le fichier de verrouillage se lisent ensemble. L'un sans l'autre ne dit pas ce qui va s'installer.

# Le nom, lettre par lettre

Vous lisez le nom exact. Un nom presque juste est un piège : une lettre en trop, une lettre en moins, un mot collé ou décollé. `liste-stages` dans la conversation et `liste-stage` dans le verrou ne sont pas le même paquet. Vous ne vous fiez pas au coup d'œil. Vous comparez le nom caractère par caractère à celui que vous avez accepté, ou vous constatez que vous n'en aviez demandé aucun.

Le piège marche parce que l'œil corrige. Vous le déjouez en lisant à voix basse, ou en copiant les deux graphies l'une sous l'autre dans le chat, comme citation, pour les voir différer. Si elles diffèrent, vous refusez. Vous ne demandez pas d'installer « le bon » depuis une autre source dans la foulée. Vous revenez à un diff dont le nom est exactement celui que vous avez choisi, ou vous n'ajoutez aucun paquet.

> [!WARNING]
> Un nom presque juste se refuse. La ressemblance n'est pas une relecture.

# La raison et la licence

La raison se dit en une phrase qui parle de l'incrément. Pour la liste des 12 stages : afficher les stages du mois, leurs horaires, le prix. Une raison qui parle d'encaisser, d'envoyer les SMS des 3 absents, ou de « prévoir la suite » ne justifie pas un paquet dans cet incrément. Vous pouvez noter la suite pour plus tard. Elle n'entre pas dans le diff d'aujourd'hui.

La licence se lit. Vous attendez son nom, sur le diff ou sur la notice que l'agent vous montre, et vous la lisez. « C'est libre » sans le nom ne compte pas. Vous n'avez pas à devenir juriste. Vous avez à voir ce que vous ajoutez au projet de Léa avant de dire oui. Si la licence est absente de ce qu'on vous montre, vous n'acceptez pas encore.

> [!TIP]
> Raison d'abord, en une phrase liée aux 12 stages. Licence ensuite, avec son nom, lue par vous.

# Un seul nom dans le verrou

Vous vérifiez que le fichier de verrouillage ne change qu'une dépendance : celle dont vous venez de lire le nom. Vous comptez les noms qui bougent dans le diff du verrou. Vous en attendez un. Si d'autres paquets apparaissent, se mettent à jour ou disparaissent dans le même geste, vous n'acceptez pas ce diff. Vous demandez un changement limité au paquet décidé, ou vous refusez.

Ce compte est la décision du chapitre. Un verrou réécrit « pendant qu'on y est » mélange votre oui avec des changements que vous n'avez pas lus. Vous ne signez pas cet ensemble. `package.json` et le verrou doivent raconter la même histoire : un nom, le même, et rien d'autre qui n'ait été décidé.

| Vous lisez | Question avant le oui |
|---|---|
| Le nom | Est-ce exactement celui-là, lettre par lettre ? |
| La raison | Sert-elle la liste des 12 stages ? |
| La licence | L'avez-vous lue, avec son nom ? |
| Le verrou | Ne change-t-il qu'une dépendance ? |

# Pas de paiement pour les douze stages

L'incrément 1 affiche la liste. Il n'encaisse pas. Un SDK de paiement se refuse, même si le prix de 45 € est bien celui de Léa, même si l'agent le présente comme une avance utile. Le prix reste 45 € sur la carte. Le moyen de le payer n'est pas ce diff. Les 8 places, l'attente de 12 et l'heure de 18 h ne deviennent pas non plus un argument pour ajouter une caisse.

Vous refusez aussi une installation depuis une adresse que vous n'avez pas choisie. Le nom se lit dans `package.json` et dans le verrou. Vous n'allez pas le chercher sur une adresse inconnue parce que l'agent la propose dans le terminal. Vous ne lancez pas cette commande. Vous revenez au diff, ou vous n'installez pas.

> [!NOTE]
> Deux refus tiennent sans discussion sur cet incrément : un SDK de paiement, et une installation depuis une adresse inconnue.

# Lire le diff avant le oui

Dans Cursor, vous ouvrez le diff proposé, pas seulement le résumé. Vous lisez le bloc `package.json`, puis le fichier de verrouillage. Vous cochez les quatre questions de la table. Si les quatre tiennent, et qu'il ne s'agit ni d'un SDK de paiement ni d'une adresse inconnue, vous pouvez accepter. Si une seule manque, vous n'acceptez pas « pour avancer ».

Un oui après lecture est une vraie décision. Le chapitre ne dit pas qu'aucun paquet n'entrera jamais dans App Sève. Il dit que celui-ci, maintenant, se lit, et que l'incrément de la liste n'est pas un incrément de paiement. La règle du samedi ne bouge pas pendant cette relecture : 8 places, 45 €, attente 12, 18 h.

```diagram
type: flow
title: "Avant d'accepter le paquet"
steps:
  - title: "Nom"
    text: "Le nom exact. Un nom presque juste est un piège."
    tone: violet
  - title: "Raison"
    text: "Une phrase qui sert la liste des 12 stages."
    tone: blue
  - title: "Licence"
    text: "Vous la lisez, avec son nom. « Libre » sans nom ne suffit pas."
    tone: teal
  - title: "Verrou"
    text: "Le fichier de verrouillage ne change qu'une dépendance."
    tone: amber
  - title: "Refus"
    text: "SDK de paiement sur cet incrément, ou adresse inconnue."
    tone: rose
```

# Exercices

## Exercice 1 : Une lettre de moins

Vous aviez en tête `liste-stages`. Le diff de `package.json` écrit `liste-stages`. Le fichier de verrouillage résout `liste-stage`. L'agent dit que c'est le même outil. Que faites-vous ?

<details>
<summary>Voir la solution</summary>

Vous refusez. Un nom presque juste est un piège. `liste-stage` n'est pas `liste-stages`. Vous ne corrigez pas à l'œil, et vous ne lancez pas une installation depuis une adresse inconnue pour « prendre le bon ».

Vous attendez un diff où le nom est exactement le même dans `package.json` et dans le verrou, ou vous n'ajoutez pas de paquet. La raison et la licence se liront sur ce nom-là, pas sur son cousin.

</details>

## Exercice 2 : Le verrou qui s'étale

Le nom est exact, la raison est « afficher les 12 stages », la licence est nommée et vous l'avez lue. Le verrou modifie aussi une dizaine d'autres dépendances. L'agent parle d'un nettoyage utile. Acceptez-vous ?

<details>
<summary>Voir la solution</summary>

Non. Vous vérifiez que le verrou ne change qu'une dépendance, celle que vous avez décidé d'ajouter. Un nettoyage d'autres noms est un autre diff, à lire pour lui-même, pas un à-côté du oui.

Vous demandez un verrou limité à ce paquet, ou vous refusez l'ensemble. Le résumé « nettoyage utile » ne remplace pas le compte des noms.

</details>

## Exercice 3 : La caisse et l'adresse

Pour la liste des 12 stages, l'agent ajoute un SDK de paiement, « puisque le stage coûte 45 € ». La commande proposée installe ce SDK depuis une adresse que vous n'avez pas choisie. Que refusez-vous ?

<details>
<summary>Voir la solution</summary>

Vous refusez les deux. L'incrément 1 est la liste des stages, pas un encaissement. Le prix reste 45 € sur la carte. Il ne justifie pas un SDK de paiement dans ce diff. Une installation depuis une adresse inconnue ne se lance pas.

Vous revenez à la liste : 12 stages, samedi 10 h-13 h, 8 places, attente 12, décision avant 18 h. Sans nouveau paquet, tant que le diff n'est pas celui que vous avez lu et accepté.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Un paquet se décide
center: "Un nom dans package.json et dans le verrou est une décision. Vous le lisez avant d'accepter."
points:
  - icon: search
    title: Le nom exact
    text: "Lettre par lettre. Un nom presque juste est un piège, pas une approximation acceptable."
  - icon: book
    title: Raison, licence
    text: "La raison sert les 12 stages. La licence se lit avec son nom, pas avec un « c'est libre »."
  - icon: git
    title: Le verrou
    text: "Vous vérifiez qu'il ne change qu'une dépendance, celle dont vous avez lu le nom."
  - icon: money
    title: Pas de caisse
    text: "L'incrément 1 est la liste des 12 stages. Un SDK de paiement se refuse."
  - icon: alert
    title: Pas d'adresse
    text: "Vous n'installez pas depuis une adresse inconnue, même si l'agent la propose."
pitfall: "Accepter un nom presque juste, un verrou qui réécrit d'autres paquets, ou une caisse pour afficher la liste."
remember: "Nom exact, raison, licence, un seul changement dans le verrou. Pas de paiement ici. Pas d'adresse inconnue."
```
