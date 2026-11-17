---
title: "Sécuriser la page que Léa ouvre"
description: "La page publique de Sève compte les personnes en attente sans montrer les téléphones. Le serveur refuse la 9e place, et un prénom reste du texte."
duration: 50
objectives:
  - "Afficher « 3 personnes en attente » sur la page publique, sans les téléphones"
  - "Réserver les noms à Léa, hors de l'adresse publique"
  - "Faire refuser la 9e place par le serveur, pas par le champ du formulaire"
  - "Afficher un prénom contenant du HTML comme du texte, et ne pas confirmer via un lien ouvert"
---

# La page publique compte

Léa Vernet ouvre deux choses, et elles ne montrent pas la même chose. La page publique d'App Sève est celle d'un visiteur : le stage du samedi, 10 h à 13 h, à Lyon Croix-Rousse, 45 €, les places sur 8. Dans l'état que vous lui faites vérifier, cette page affiche « 3 personnes en attente ». Elle affiche un nombre. Elle n'affiche pas les téléphones.

Le nombre suffit au visiteur. Il sait que l'attente existe, et que le stage n'est pas une liste ouverte. Il n'a pas besoin de savoir qui attend, ni comment les joindre. Les trois absents du mois, ceux dont le SMS a été oublié, restent un fait de gestion. Ils ne deviennent pas trois numéros sur l'écran public. Le remplissage autour de 70 % et les 12 stages du mois se disent de la même façon : un cadre, pas un annuaire.

> [!IMPORTANT]
> « 3 personnes en attente » est une phrase de la page publique. Les téléphones de ces personnes n'y figurent pas.

# Les noms sont pour Léa

Les noms servent à Léa, quand elle gère l'atelier. Ils ne servent pas l'adresse publique. Un visiteur qui ouvre l'URL du stage voit le créneau, le prix, le plafond, le compteur d'attente. Il ne voit pas la colonne des prénoms, et encore moins celle des téléphones.

Vous le vérifiez en ouvrant la page comme un visiteur, pas seulement comme la personne qui a les fichiers sous les yeux. Si un nom d'inscrit apparaît sur cette URL, la page en montre trop. Camille peut rester un exemple dans vos essais de mise en page, avec « 3 places restantes ». Camille n'est pas une raison d'afficher la vraie file sur l'écran public. L'attente maximale est 12 : ce plafond se tient côté serveur, et la page publique n'a pas à lister ces douze personnes pour prouver qu'elle sait compter.

Ce n'est pas un second produit. C'est la même App Sève, avec une surface pour le public et ce que Léa consulte pour tenir les inscriptions. Vous ne « simplifiez » pas en mettant les deux sur la même URL le temps de la démo.

# Le serveur refuse la 9e place

Huit places sont prises. Une neuvième personne envoie le formulaire. Le refus vient du serveur. Le champ du formulaire ne décide pas. S'il contient 9, ou 80, ou le mot « oui », le serveur compare à la règle de Léa et refuse la place au-delà de 8.

Vous le vérifiez avec un cas, pas avec une impression. Huit inscrits, une demande de plus, un refus. Le message peut être court. Il ne doit pas dépendre d'une case que le navigateur aurait cochée, ni d'un nombre que la page aurait affiché « pour faire joli ». La page peut montrer qu'il reste 0 place. C'est le serveur qui tient le compte.

```text
Inscrits : 8
Demande suivante : refusée
Qui décide : le serveur, pas le champ du formulaire
```

L'attente suit la même idée de plafond, jusqu'à 12, tenue au même endroit. Une page qui accepterait « parce que le champ le dit » aurait déplacé la règle dans le navigateur du visiteur. Vous ne laissez pas faire ce déplacement. 45 € et l'heure de 18 h ne se décident pas dans un champ non plus : ils s'affichent, ils ne se négocient pas depuis le formulaire.

> [!WARNING]
> Un formulaire qui envoie 9, ou plus, ne crée pas la 9e place. Le serveur refuse. Le champ n'a pas le dernier mot.

# Un prénom s'affiche comme du texte

Un prénom est du texte. S'il contient des chevrons, des balises, ou ce qui ressemble à du HTML, la page les montre comme elle montre les lettres. Elle ne les interprète pas. Le visiteur lit le prénom. Il ne voit pas une mise en page injectée à la place du nom.

Sur l'écran de Léa, là où les noms ont le droit d'apparaître, la même règle tient. Un prénom d'essai `Camille <atelier>` s'affiche avec les chevrons visibles, dans le nom, pas comme un effet sur la page. Vous le contrôlez une fois, avec un prénom d'exemple. Vous n'en faites pas un jeu d'essai sur la liste réelle, et vous ne collez pas cette liste dans la session pour « voir ce que ça donne ».

La page publique, elle, n'a déjà pas les noms. Le compteur « 3 personnes en attente » ne devient pas un bloc de HTML venu de l'extérieur. C'est une phrase à vous, un nombre calculé, pas un contenu collé depuis un prénom.

# Confirmer n'est pas un lien ouvert

La confirmation rappelle la décision avant 18 h la veille. Ce rappel n'est pas un lien public sans contrôle. Ouvrir une adresse ne doit pas, à lui seul, confirmer une place, l'annuler, ou montrer un téléphone. Le serveur vérifie. L'adresse seule, recopiée, transférée, ouverte par quelqu'un d'autre, ne suffit pas.

Vous ne construisez pas ici un cours sur les comptes et les mots de passe. La règle de cette page tient en une phrase : l'heure de 18 h se rappelle, elle ne se délègue pas à un lien que n'importe qui peut suivre. Léa garde la décision. La personne concernée ne la prend pas en cliquant une URL trouvée dans un message transmis.

Le samedi 10 h à 13 h, les 8 places et les 45 € restent affichés. Le lien de confirmation ne les modifie pas, et il ne les « débloque » pas non plus. S'il faut un geste pour confirmer, ce geste passe par un contrôle tenu par le serveur, pas par la seule ouverture de l'adresse.

```diagram
type: compare
title: "Deux façons d'ouvrir Sève"
columns:
  - title: Page publique
    tone: teal
    items:
      - "Samedi 10 h-13 h, 45 €, 8 places"
      - "« 3 personnes en attente », sans téléphone"
      - "Le serveur refuse la 9e place"
  - title: Côté Léa
    tone: violet
    items:
      - "Les noms, pour gérer l'atelier"
      - "Pas sur l'URL publique"
      - "La confirmation n'est pas un lien ouvert"
```

# Ce que vous faites vérifier

Vous ouvrez la page publique et vous lisez ce qu'un visiteur voit. Le créneau, le lieu, le prix, le plafond, la phrase « 3 personnes en attente ». Vous cherchez un téléphone : il ne doit pas y être. Vous cherchez un prénom de la file réelle : il ne doit pas y être non plus.

Vous envoyez ensuite une 9e demande alors que 8 places sont prises. Le refus vient du serveur. Vous changez le champ pour un nombre plus grand : le refus tient. Vous affichez un prénom d'exemple qui contient des chevrons : les caractères restent du texte, sur l'écran où Léa a le droit de voir un nom.

Enfin, vous regardez le rappel de 18 h. S'il est devenu une adresse publique qui agit toute seule, vous le refusez. Les 12 stages du mois et le remplissage autour de 70 % n'ont pas besoin de ce raccourci. App Sève montre l'atelier. Elle ne confie ni la file, ni la 9e place, ni la confirmation à la seule page du visiteur.

# Exercices

## Exercice 1 : La file sur l'URL

La page publique affiche déjà « 3 personnes en attente ». La session propose d'ajouter, sous le compteur, les prénoms et les téléphones, « pour que ce soit plus clair ». Léa voudrait aussi voir les noms de son côté. Que mettez-vous où ?

<details>
<summary>Voir la solution</summary>

La page publique garde « 3 personnes en attente » et n'affiche pas les téléphones, ni les prénoms de la file. Les noms sont pour Léa, dans ce qu'elle ouvre pour gérer l'atelier, pas sur l'URL publique. Vous le vérifiez en regardant la page comme un visiteur.

Le compteur ne devient pas un annuaire. L'attente maximale reste 12, tenue par le serveur. Camille et « 3 places restantes » peuvent servir d'exemple de mise en page, sans coller la liste réelle.

</details>

## Exercice 2 : Le champ qui dit 9

Huit places sont prises. Le formulaire envoie 9 dans le champ « places ». La session écrit : « Le champ vaut 9, donc on inscrit. » Où se prend le refus, et que devient un champ qui enverrait 80 ?

<details>
<summary>Voir la solution</summary>

Le refus se prend sur le serveur. Le champ ne décide pas. Huit places prises, la demande suivante est refusée, que le champ dise 9 ou 80. Vous le vérifiez par ce cas, pas par le nombre affiché dans le navigateur.

La règle de Léa Vernet reste 8 places, 45 €, attente jusqu'à 12, décision avant 18 h la veille. Le formulaire du samedi, 10 h à 13 h, ne négocie aucun de ces points.

</details>

## Exercice 3 : Chevrons et lien de 18 h

Un prénom d'essai contient des chevrons. La session veut les « interpréter pour faire joli ». À côté, elle propose un lien public : quiconque l'ouvre confirme sa place, sans autre contrôle, afin de tenir l'heure de 18 h. Que gardez-vous ?

<details>
<summary>Voir la solution</summary>

Le prénom s'affiche comme du texte, chevrons compris. La page ne le transforme pas en mise en page. Vous le contrôlez avec un exemple, pas avec la liste réelle des inscrits.

Confirmer avant 18 h n'est pas un lien public sans contrôle. Ouvrir l'adresse ne confirme pas, n'annule pas, et ne montre pas un téléphone. Le serveur tient ce contrôle. Vous ne faites pas de ce lien un cours sur les mots de passe : vous retirez l'adresse qui agit toute seule.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: La page de Léa
center: "La page publique compte « 3 personnes en attente ». Le serveur refuse la 9e place. Un prénom reste du texte."
points:
  - icon: users
    title: Compteur public
    text: "Le visiteur voit « 3 personnes en attente », le samedi et le prix. Il ne voit pas les téléphones."
  - icon: eye
    title: Noms pour Léa
    text: "Les noms servent à gérer l'atelier. Ils ne sont pas sur l'URL publique, même pour une démo."
  - icon: server
    title: Huit côté serveur
    text: "La 9e place est refusée par le serveur. Un champ qui envoie 9 ou 80 ne décide pas."
  - icon: code
    title: Prénom en texte
    text: "Des chevrons dans un prénom s'affichent comme des caractères. La page ne les interprète pas."
  - icon: lock
    title: Pas un lien ouvert
    text: "Rappeler 18 h n'est pas une adresse publique qui confirme toute seule. Le serveur contrôle."
pitfall: "Mettre les téléphones sur l'URL publique, ou laisser le champ du formulaire créer la 9e place."
remember: "Compteur public, noms pour Léa, refus serveur à 8, prénom en texte, confirmation contrôlée."
```
