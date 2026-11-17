---
title: "Apporter le problème au design"
description: "Travailler avec Nora sur la livraison Halte sans dessiner à sa place : le problème, les contraintes de 17 h 20, et la décision qui change la promesse."
duration: 50
objectives:
  - "Apporter le problème et le résultat, pas un écran déjà décidé"
  - "Nommer les contraintes que le designer ne peut pas deviner"
  - "Trancher seulement quand une option change la promesse faite au client ou au magasin"
  - "Traiter un croquis comme une hypothèse, pas comme une commande"
---

# Le problème, pas l'écran

Nora conçoit l'interface. Vous ne la remplacez pas parce que vous avez une idée d'écran. Le soir où vous arrivez avec une maquette « pour aller plus vite », l'équipe construit votre dessin, y compris les cas que vous n'avez pas pensés : signal absent, liste vide, heure trop tardive, mains déjà prises.

Votre apport tient en une page, et ce n'est pas une page de pixels.

**Le problème.** Le samedi, entre 17 h et 17 h 30, Karim ne sait pas si le camion passe avant 19 h. Il garde Lina pour rien, ou il ferme et le quai l'attend lundi. Le client paie souvent sans date, ou avec une heure que le magasin ne pourra pas tenir. Une commande sur deux n'a pas de date. Quand une date existe, elle est tenue dans 82 % des cas.

**Le résultat déjà décidé.** Sur les pilotes, Karim voit oui ou non avant 17 h 30, sans appeler. Le client voit une heure précise seulement si le signal est à temps et positif. Sinon, un créneau large. Nora ne rouvre pas cette décision en proposant d'afficher quand même 19 h « en grisé, pour ne pas frustrer ».

**Ce qui n'est pas décidé.** La façon de montrer le oui, le non, l'absence. Deux options qui tiennent le même résultat sont son travail. Vous les comparez. Vous ne les dessinez pas la veille pour qu'elle n'ait plus qu'à colorier.

> [!IMPORTANT]
> Vous arrivez avec le problème, les contraintes et la décision déjà prise. L'écran est une réponse de Nora, pas votre spécification.

# Les contraintes que Nora ne devine pas

Nora peut observer un samedi. Elle ne peut pas deviner ce que vous avez déjà tranché, ni ce que 17 h 20 impose si personne ne l'y a emmenée.

À Villeneuve, Karim a les mains prises, le comptoir n'est pas fini, il a quelques secondes. Une carte du camion à explorer ne sera pas lue. Un oui ou un non, lisible tout de suite, peut l'être. Ce n'est pas un goût. C'est une contrainte d'usage. Le substitut, aujourd'hui, est l'appel au transporteur, souvent tardif. Si votre écran est plus lent que l'appel, il ne remplacera pas l'appel.

Côté client, la contrainte est de ne pas afficher une heure que le signal ne tient pas. Une belle frise d'heures qui montre 19 h « quand même » est un échec. Côté Inès, le motif tient en un mot de la liste. Côté règle, un signal de 18 h 45 ne retourne pas la décision.

Vous écrivez aussi ce que cette version ne résout pas : le SMS, le dimanche, les huit transporteurs sans signal, les quarante magasins. Sans ce cadre, Nora dessinera l'enseigne entière. Le cadre lui permet de finir un geste utile.

Le bon moment est un samedi où la décision se pose vraiment, pas un samedi où le camion est passé à 15 h. Vous ne narrez pas les gestes de Karim. Vous le laissez décider. S'il n'ouvre l'écran que parce que vous dites « regarde là », vous n'avez rien appris.

# La décision qui change la promesse

Nora revient avec deux pistes. La première : un oui ou un non, et côté client un créneau large quand ce n'est pas oui. La seconde : l'heure 19 h reste visible, barrée, « pour expliquer ». Les deux sont soignées. Vous ne choisissez pas la plus jolie.

Vous demandez : **qu'est-ce que la personne comprend qu'elle peut faire ?** Dans la première, Karim ne garde pas Lina au hasard, le client ne s'organise pas sur 19 h. C'est la décision. Dans la seconde, 19 h est encore là. Une partie des clients la lira comme une promesse abîmée. Vous avez rouvert l'heure. Ce n'est plus un dessin. C'est une promesse, et elle vous appartient.

Vous dites non à la seconde, au nom de la promesse, pas du goût. Vous laissez à Nora la taille du oui, l'état quand il n'y a pas de signal, ce qui se passe si Karim ouvre trop tard. Ces ajustements ne changent pas ce que le client peut croire. Les lui reprendre, c'est dessiner à sa place.

Quand une option change le mot lu par Inès, vous le tranchez avec elle. Quand une option ne change ni le geste de Karim, ni l'heure du client, ni ce mot, vous le dites et vous sortez.

```diagram
type: sequence
title: "Qui apporte quoi"
actors: ["Vous", "Nora", "Karim"]
messages:
  - from: 0
    to: 1
    text: "Problème, contraintes de 17 h 20, décision déjà prise"
  - from: 1
    to: 2
    text: "Deux façons de montrer que 19 h n'est pas une promesse"
  - from: 2
    to: 1
    text: "Ce qui se lit en quelques secondes, mains prises"
  - from: 0
    to: 1
    text: "Vous gardez la piste qui ne promet pas l'heure fausse"
```

# Un croquis n'est pas une commande

Vous pouvez crayonner pour penser. Vous écrivez « hypothèse », et Nora peut barrer le rectangle. Le croquis a nui s'il part dans le fil avec « voilà l'écran ». Hugo le prendra comme spécification. Karim découvrira un bouton que vous aviez mis « pour voir », par exemple « garder quand même ».

La phrase, au moment où vous montrez le trait : « Ceci n'est pas l'interface. Nora propose. Je ne tranche que si la promesse change. »

Un ami qui dit « c'est clair » n'est pas Karim à 17 h 20. Une maquette cliquée pendant que vous guidez la main ne dit pas s'il quittera l'appel. Vous retournez un samedi où le doute est réel. Nora observe. Ce qu'il rate sans vous est le retour.

> [!WARNING]
> Une heure barrée qui reste visible rouvre la promesse que vous aviez fermée. Ce n'est pas une variante visuelle. C'est un autre produit.

# Exercices

## Exercice 1 : La maquette du dimanche soir

Dimanche soir, vous dessinez l'écran « idéal » : une carte, une pastille, le texte « peut-être 19 h », un bouton « garder Lina quand même ». Vous voulez l'envoyer à Hugo pour gagner lundi. Que faites-vous du dessin ?

<details>
<summary>Voir la solution</summary>

Vous ne l'envoyez pas comme spécification. « Peut-être 19 h » et le bouton rouvrent la promesse. La carte ignore les quelques secondes et les mains prises. Nora a reçu une commande, pas un problème.

Vous pouvez garder le rectangle comme hypothèse barrée. Lundi, vous apportez le problème, le résultat (oui ou non, pas d'heure précise sans signal à temps, motif court) et les contraintes de 17 h 20. Nora propose.

</details>

## Exercice 2 : Deux pistes

Nora propose A : oui ou non, et un créneau large côté client quand ce n'est pas oui. Elle propose B : 19 h reste visible, barrée, « pour que le client comprenne ». Karim dit que A se lit d'un coup d'œil. Un directeur préfère B, « plus pédagogique ». Que décidez-vous ?

<details>
<summary>Voir la solution</summary>

Vous choisissez A. B montre encore 19 h. Ce n'est pas un débat de pédagogie. C'est la décision : on n'affiche pas une heure que le signal ne tient pas. Le goût du directeur ne la rouvre pas.

Vous laissez à Nora ce qui ne change pas le geste : taille du oui, écran quand il n'y a pas de signal, lisibilité au comptoir. Le mot du motif se tranche avec Inès. S'il reste un doute, vous retournez un samedi sans guider la main.

</details>

## Exercice 3 : Le samedi commenté

Vous accompagnez Nora à Villeneuve. Vous dites à Karim « clique là ». Il trouve le non. Nora note « le parcours fonctionne ». Le camion, ce samedi-là, était passé à 15 h. Qu'est-ce qui ne va pas ?

<details>
<summary>Voir la solution</summary>

Vous avez testé votre narration, et vous l'avez testée un samedi où la décision ne se posait pas. Le clic guidé ne dit pas s'il ouvrira l'écran seul avant 17 h 30, à la place de l'appel.

Vous refaites le passage un samedi où le doute est réel, sans commentaire. Nora observe. Le raté sans votre aide est l'information. « Ça fonctionne » ne se note pas.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Le problème, pas l'écran
center: "Vous apportez le problème, les contraintes et la décision. Nora dessine. Vous ne dessinez pas à sa place."
points:
  - icon: compass
    title: Le problème
    text: "Lina gardée pour rien, le quai le lundi, le client sans date fiable. Nora doit pouvoir le raconter."
  - icon: ruler
    title: Contraintes
    text: "17 h 20, mains prises, quelques secondes. Un oui ou un non, pas une carte à explorer. Dit avant les pistes."
  - icon: target
    title: La décision
    text: "Vous tranchez si la promesse change. 19 h barrée mais visible est un autre produit."
  - icon: eye
    title: Le samedi
    text: "Vous ne guidez pas la main. Un samedi où le camion est déjà passé n'apprend rien sur la décision."
  - icon: alert
    title: Le croquis
    text: "Un rectangle peut penser. Marqué hypothèse, il s'efface. Envoyé comme écran, il devient la commande."
pitfall: "Envoyer dimanche une carte avec « garder Lina quand même », pour qu'Hugo gagne lundi."
remember: "L'écran est la réponse de Nora. Votre métier est le problème, le cadre, et l'heure que l'écran ne doit pas rouvrir."
```
