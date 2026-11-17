---
title: Backlog, épopées et histoires
description: "Écrire une épopée, une histoire en tant que, des critères d'acceptation testables, puis tenir une définition de prêt et une définition de terminé sans en faire une liturgie."
duration: 60
objectives:
  - Relier une épopée Halte à des histoires qu'un sprint peut finir
  - Rédiger une histoire « en tant que » avec des critères observables
  - Séparer définition de prêt et définition de terminé
  - Utiliser INVEST comme une idée de découpage, pas comme un examen
---

# Épopée et histoire en tant que

L'épopée de la refonte tient en une phrase : **un client Halte voit une promesse de livraison que le magasin peut tenir.** Elle couvre les quarante magasins et les six mois. Elle n'entre dans aucun sprint. Elle sert à reconnaître qu'une histoire en fait partie, ou qu'elle s'égare (changer les étiquettes prix, refaire le programme de fidélité).

L'histoire est le morceau qu'on peut finir et montrer. La forme « en tant que » oblige à nommer qui souffre et pourquoi.

- En tant que client, je veux ne voir que les créneaux que le magasin peut préparer, afin de ne pas me déplacer pour rien.
- En tant que préparateur, je veux une liste limitée au stock confirmé, afin de ne pas chercher un article absent.
- En tant que conseillère du service client, je veux le motif du refus, afin d'expliquer sans rappeler le magasin.

« En tant que Halte, je veux une refonte de la livraison » n'est pas une histoire. Halte n'est pas un utilisateur. La refonte est le projet. Inès refuse cette phrase au backlog, même si elle sonne stratégique.

La formule n'est pas un poème. Si le rôle, l'action et le bénéfice ne tiennent pas, l'histoire n'est pas mûre. On la laisse en épopée jusqu'à ce qu'un préparateur, un client ou Hugo puisse la reconnaître.

```diagram
type: layers
title: Du projet jusqu'à l'histoire qu'on peut finir
layers:
  - title: Projet
    text: "Six mois, quarante magasins, enveloppe de 220 k€."
    items:
      - "Sponsor : Claire"
      - "Hors du backlog"
  - title: Épopée
    text: "Une promesse que le magasin peut tenir."
    items:
      - "Reconnaît ce qui est dedans"
      - "Trop grande pour un sprint"
  - title: Histoire
    text: "Un rôle, une action, un bénéfice."
    items:
      - "Client, préparateur ou service client"
      - "Tenue dans deux semaines"
  - title: Critères
    text: "Des oui et des non qu'on peut rejouer."
    items:
      - "Stock à zéro"
      - "Magasin fermé"
      - "Motif affiché"
```

# Des critères qu'on peut observer

Un critère d'acceptation se constate. Il ne dit pas « l'expérience est fluide » ni « le magasin est satisfait ». Il dit ce qu'on voit, dans quel cas.

Pour l'histoire du créneau :

- Si le stock du matin est à zéro, le retrait du jour n'apparaît pas.
- Si le magasin est fermé le dimanche, aucun retrait dimanche n'apparaît.
- Si la commande arrive après 16 h, le retrait du jour n'apparaît plus (heure de fin de préparation).
- Le motif vu par Hugo est l'un des motifs de la liste : stock, fermeture, transporteur complet. Pas une phrase libre.

Inès écrit ces critères avec l'équipe, avant le sprint. Julien ne les découvre pas en codant. Hugo les relit, parce que c'est lui qui les dira au téléphone. Un critère que le service client ne peut pas expliquer est un critère incomplet, pas un détail.

Trois critères nets valent mieux que douze critères flous. Si la liste grossit jusqu'à raconter tout le projet, l'histoire est encore une épopée.

> [!TIP]
> Lisez le critère à voix haute devant un cas. « Stock du matin à zéro, magasin de Nantes, mardi 10 h. » Si personne ne sait dire oui ou non, le critère n'est pas prêt.

```video
url: https://www.youtube.com/watch?v=kkihaNjwRik
title: "What Is a User Story in Agile? (Examples + Template)"
channel: "Mountain Goat Software: Agile & Scrum Mastery"
duration: "8:52"
lang: en
why: "Mike Cohn, auteur de référence sur les user stories, explique ce qu'est une histoire et comment l'écrire."
```

# Découper sans perdre le client

Découper, ce n'est pas couper une phrase en trois pour faire plaisir au tableau. C'est obtenir un morceau **utilisable** sans attendre les quarante magasins.

Mauvais découpage : « base de données » au sprint 1, « écran » au sprint 2, « branchement magasin » au sprint 5. Pendant quatre sprints, aucun client n'est protégé. Personne ne peut accepter l'incrément.

Découpage tenu pour Halte :

1. Quatre magasins pilotes, retrait du jour masqué si le stock du matin est à zéro. Le domicile J+2 reste inchangé.
2. Même règle, plus le motif de refus pour Hugo, sur les mêmes quatre magasins.
3. Heure limite de 16 h et dimanche fermé, toujours sur les quatre.
4. Ensuite seulement, la vague suivante de magasins, quand la recette des pilotes est signée.

La première histoire a de la valeur même si les trente-six autres magasins attendent. C'est le test du découpage. Si le morceau ne protège personne avant la fin des six mois, il est encore trop plat : une couche technique, pas une tranche de promesse.

Nadia a besoin du flux de stock pour que Julien filtre le site. Cette dépendance ne justifie pas de « finir toute l'intégration » avant toute valeur. Une histoire peut livrer le filtre sur quatre magasins avec un flux limité à ces quatre-là. Le flux des quarante est une autre histoire, plus tard.

# Prêt et terminé

Deux définitions, deux moments. Les mélanger produit des sprints qui démarrent à moitié et des revues qui discutent du vocabulaire.

La **définition de prêt** (definition of ready) dit quand une histoire peut entrer dans un sprint. Chez Halte, cinq conditions, pas vingt :

- La phrase « en tant que » tient, avec un rôle réel.
- Les critères se répondent par oui ou non.
- Les dépendances sont nommées (flux de stock des quatre pilotes disponible, ou contournement écrit).
- L'équipe l'a estimée. Une histoire que personne ne sait tailler n'entre pas.
- Inès peut dire pourquoi elle passe avant les autres.

La **définition de terminé** (definition of done) dit quand l'histoire sort. Elle est la même pour toutes les histoires du sprint, pas renégociée le vendredi.

- Les critères sont rejoués, y compris stock à zéro, dimanche et après 16 h.
- Hugo a relu le motif affiché.
- Un préparateur pilote, ou une simulation fidèle, a vu la liste de commandes.
- Inès accepte en revue. « On finira la recette le mois prochain » n'est pas terminé.

Prêt regarde l'amont. Terminé regarde la sortie. Une histoire peut être prête et ne jamais être prise : le sprint est plein. Elle n'est pas terminée parce qu'elle était prête.

```diagram
type: flow
title: Deux moments, pas un seul mot
steps:
  - title: Prêt
    text: "Rôle réel, critères oui ou non, dépendance datée, estimation"
    tone: blue
  - title: Entrer
    text: "L'équipe ne prend que ce qu'elle peut finir"
    tone: teal
  - title: Terminé
    text: "Cas rejoués, motif relu par Hugo, Inès accepte"
    tone: amber
  - title: Pas avant
    text: "« On recettera le mois prochain » n'est pas terminé"
    tone: rose
```

> [!WARNING]
> Une définition de prêt de deux pages sert à refuser le travail d'Inès, pas à protéger le sprint. Si l'équipe s'en sert comme d'un veto sans dire quel critère manque, Marc la ramène à une phrase : qu'est-ce qui empêche de commencer lundi ?

# INVEST en une idée

INVEST est un pense-bête, pas une grille à remplir en comité. L'idée tient en une ligne : **une histoire se discute, se teste, apporte un bout de valeur, et peut entrer dans un sprint sans emporter tout le projet.**

- **I**, indépendante : le filtre sur quatre pilotes se vérifie sans attendre le guide des quarante magasins.
- **N**, négociable : le motif peut être une liste courte. La forme exacte se discute, le besoin d'expliquer non.
- **V**, valeur : un client évite un déplacement inutile. Pas « l'équipe a avancé ».
- **E**, estimable : l'équipe sait dire si ça tient en deux semaines. Sinon on découpe encore.
- **S**, assez petite : un sprint. L'épopée des quarante magasins ne l'est pas.
- **T**, testable : stock à zéro, oui ou non.

Si une lettre casse, on réécrit l'histoire. On ne coche pas INVEST en bas d'une page pour faire sérieux. Sur Halte, la lettre qui casse le plus souvent est le S : on remet les quarante magasins dans une histoire de pilote. La parade est de nommer les quatre magasins dans la phrase.

# Exercices

## Exercice 1 : Réécrire une fausse histoire

Le backlog contient : « En tant que Halte, je veux une livraison moderne et fluide sur les quarante magasins, afin d'être au niveau du marché. » Critère proposé : « les magasins sont satisfaits ». Réécrivez une histoire et trois critères pour le sprint des quatre pilotes.

<details>
<summary>Voir la solution</summary>

Histoire : « En tant que client d'un magasin pilote, je veux ne voir le retrait du jour que si le stock du matin est confirmé, afin de ne pas me déplacer pour un article absent. »

Critères :

- Stock du matin à zéro sur un article : le retrait du jour ne s'affiche pas pour cet article.
- Stock confirmé et magasin ouvert : le retrait du jour s'affiche.
- Le périmètre est limité aux quatre magasins pilotes. Les trente-six autres ne changent pas dans ce sprint.

« Moderne », « fluide » et « au niveau du marché » sortent de la phrase. « Magasins satisfaits » n'est pas un critère. Inès peut poser cette histoire en tête. L'épopée des quarante magasins reste au-dessus, elle n'entre pas dans le sprint.

</details>

## Exercice 2 : Prêt ou pas prêt

Nadia dit que le flux de stock des quatre pilotes arrivera « dans le sprint, normalement ». Julien estime quand même l'histoire du filtre à huit jours. Inès veut la prendre lundi. Appliquez la définition de prêt et dites ce que vous exigez avant l'entrée dans le sprint.

<details>
<summary>Voir la solution</summary>

L'histoire n'est pas prête. La dépendance n'est pas tenue : « normalement » n'est pas une date. L'estimation de Julien suppose un flux qui n'existe pas encore.

Avant lundi, Nadia écrit soit la date à laquelle les quatre magasins sont dans le flux, soit le contournement (fichier du matin, déposé avant 8 h, responsable nommé). L'équipe réestime avec ce fait. Si le flux n'est pas là et qu'aucun contournement n'est accepté par Inès, l'histoire n'entre pas. On prend une histoire qui ne dépend pas de ce flux, plutôt que de découvrir le blocage au daily de mercredi.

Le project manager note le risque éditeur s'il est la cause du retard. Il ne force pas l'entrée dans le sprint pour « occuper Julien ».

</details>

## Exercice 3 : La lettre qui casse

Karim demande une histoire : « Préparer le guide complet des quarante magasins, former tous les directeurs, et brancher le filtre. » Dites quelle lettre d'INVEST casse en premier, et proposez le découpage du premier morceau.

<details>
<summary>Voir la solution</summary>

La lettre S casse en premier : rien de tout cela ne tient dans un sprint, et les trois morceaux n'ont pas le même public. Le I casse aussi : le guide des quarante n'a pas besoin d'être fini pour tester le filtre sur quatre magasins.

Premier morceau : « En tant que préparateur d'un magasin pilote, je veux une fiche d'une page (pas le guide) et une liste de commandes limitée au stock confirmé, afin de préparer sans chercher un article absent. » Périmètre : quatre pilotes. Le guide complet et la formation des trente-six autres directeurs sont des histoires plus tard, après la recette des pilotes.

On ne coche pas les six lettres. On réécrit jusqu'à ce que le morceau se teste sur un magasin nommé.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Backlog et histoires
center: "Une histoire se termine dans un sprint et se vérifie par oui ou non. L'épopée des quarante magasins, non."
points:
  - icon: layers
    title: Épopée
    text: "La promesse que le magasin peut tenir. Elle reconnaît le périmètre, elle n'entre pas dans le sprint."
  - icon: users
    title: En tant que
    text: "Un client, un préparateur ou Hugo. Un geste et un bénéfice. Pas « en tant que Halte »."
  - icon: check
    title: Critères
    text: "Stock à zéro, dimanche, après 16 h, motif dans la liste. Observables, relus par le service client."
  - icon: filter
    title: Prêt puis terminé
    text: "Prêt : on peut commencer. Terminé : critères rejoués, magasin vu, Inès accepte. Deux moments."
  - icon: puzzle
    title: INVEST
    text: "Une idée : valeur testable, assez petite, sans emporter les quarante magasins dans la même phrase."
pitfall: "Découper en couches techniques (flux, écran, magasin) et n'avoir aucun client protégé avant le sixième mois."
remember: "Si le morceau ne protège personne avant la fin du projet, ce n'est pas encore une histoire."
```
