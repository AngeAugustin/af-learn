---
title: E-mails de cycle de vie
description: "Écrire quatre e-mails utiles, bienvenue, abandon, après l'achat et réveil, chacun avec un seul objectif et sans solder le panier de 42 €."
duration: 55
objectives:
  - "Donner à chaque e-mail un seul objectif, vérifiable"
  - "Écrire une bienvenue et un après-achat sans réduction"
  - "Limiter l'abandon à un rappel du panier réellement laissé"
  - "Réveiller un dormant sans enchaîner les codes"
---

# Un e-mail, un travail

Nora n'écrit pas « pour rester en contact ». Elle écrit pour **un** résultat. Si l'e-mail doit à la fois présenter l'atelier, offrir 20 %, demander un avis et vendre le coffret à 78 €, il ne fait rien de tout cela. La personne lit une affiche. Elle ne fait pas le geste.

L'Atelier Lumen a quatre moments où un e-mail se justifie. La **bienvenue**, quand quelqu'un a demandé les nouvelles. L'**abandon**, quand un panier est resté ouvert. L'**après-achat**, quand une bougie à 42 € ou un coffret à 78 € vient de partir. La **réactivation**, quand un client consenti n'a plus commandé depuis longtemps. Pas un cinquième « parce que vendredi ».

L'équipe de quatre relit ces textes comme des clients. Léa vérifie que le prix annoncé est le vrai. Samir vérifie le délai et le geste d'usage (mèche, durée). Vous vérifiez que la pub n'a pas promis autre chose. Nora vérifie qu'il y a **une** demande, et un lien qui fait cette demande, pas trois boutons concurrents.

# Bienvenue : expliquer la maison, pas solder

Déclencheur : la case newsletter, cochée par la personne. Objectif unique : qu'elle sache ce qu'est Lumen et à quoi ressemble une commande, pour reconnaître les prochains messages. Pas pour qu'elle achète dans l'heure avec une réduction.

Le texte tient en peu de lignes. Nous faisons des bougies, vendues en ligne, souvent autour de 42 €, livrées en 48 h quand Samir a le stock. Une bougie se brûle ainsi (première fois, mèche). Les nouvelles arrivent une à deux fois par mois, pas deux fois par semaine. Lien : la page de la bougie du moment, prix visible. Pas de code. Pas de « −15 % parce que vous êtes nouveau ». Ce rabais apprend que le vrai prix n'est pas 42 €.

Ceux qui ont commandé **et** coché la case ne reçoivent pas en plus une promo de bienvenue. Ils reçoivent le message de commande, puis, plus tard, le rythme normal. Deux réductions empilées sur la même personne, la même semaine, sont une erreur de fichier, pas une générosité.

> [!TIP]
> L'objectif tient en une ligne au-dessus du texte, dans l'outil : « Faire reconnaître Lumen ». Si vous ne pouvez pas le dire sans « et », coupez le second verbe.

# Abandon : le panier, pas la culpabilité

Objectif unique : revenir au **panier laissé**, s'il existe encore. Un seul e-mail. Quelques heures après, pas dix minutes (la personne est peut-être allée chercher sa carte), pas une semaine (ce n'est plus un oubli).

Le message montre ce qui était dedans. « Votre bougie pluie, 42 €, est encore là. » Bouton vers ce panier. Délai de Samir si le stock tient. Lien pour ne plus recevoir ce type de rappel. Il ne dit pas « vous nous avez abandonnés ». Il ne dit pas « −10 % si vous finissez dans l'heure », sinon le réflexe suivant est d'attendre le code avant de payer.

S'il n'y a pas d'adresse saisie, il n'y a pas d'e-mail. Un pixel qui « devine » qui est passé sur la fiche ne suffit pas à écrire. S'il y a déjà une commande payée entre-temps, l'e-mail ne part pas : le scénario s'arrête. Le chapitre suivant règle le déclencheur et la sortie. Ici, le texte a un seul travail.

# Après l'achat : faire réussir la bougie

Objectif unique : que la bougie soit bien utilisée, pour qu'elle dure et qu'elle donne envie d'en reprendre une dans huit à dix semaines. Ce n'est pas un e-mail de vente. La personne vient de payer. Lui proposer −20 % sur la suivante le lendemain lui dit que son achat était prématuré.

Le bon moment est court, quelques jours après l'expédition, quand le colis est là ou proche. Contenu : première combustion, longueur de mèche, durée indicative (une bougie Lumen tourne autour de 45 heures, pas « pour toujours »). Ce que Samir dirait à l'atelier, en cinq lignes. Lien : une page d'aide, pas une page de promo.

Un second message, beaucoup plus tard, parlera du réachat. Ce n'est pas celui-ci. Mélanger « voici comment allumer » et « profitez de −20 % sur le coffret » casse les deux objectifs. L'un rassure. L'autre marchande.

> [!WARNING]
> Demander un avis cinq étoiles dans le même e-mail que le mode d'emploi transforme un service en pression. L'avis, s'il existe un jour, a son propre envoi, à ceux qui ont reçu le colis, et il accepte les avis qui ne sont pas parfaits.

```diagram
type: pipeline
title: "Quatre e-mails, quatre travaux"
lanes:
  - title: "Bienvenue"
    steps:
      - title: "Droit"
        text: "Case newsletter, pas la commande seule."
        tone: violet
      - title: "Travail"
        text: "Faire reconnaître la maison, le prix, le rythme."
        tone: teal
  - title: "Abandon"
    steps:
      - title: "Droit"
        text: "Adresse saisie pour ce panier, un seul rappel."
        tone: amber
      - title: "Travail"
        text: "Rouvrir ce panier-là, sans code et sans reproche."
        tone: rose
  - title: "Après l'achat"
    steps:
      - title: "Droit"
        text: "La commande payée autorise le mode d'emploi."
        tone: blue
      - title: "Travail"
        text: "Réussir la bougie. Le réachat viendra plus tard."
        tone: teal
  - title: "Réactivation"
    steps:
      - title: "Droit"
        text: "Consentement encore oui, dernier achat ancien."
        tone: violet
      - title: "Travail"
        text: "Une raison de revenir, pas une série de soldes."
        tone: amber
```

# Réactivation : une raison, puis le silence

Objectif unique : proposer **une** raison de revenir à quelqu'un qui n'a pas commandé depuis plus de 120 jours et qui a encore dit oui à la newsletter. La raison est concrète. Une nouvelle odeur, le coffret à 78 € pour un cadeau, le rappel qu'une bougie de 45 heures se termine. Pas trois raisons, pas un code « pour se faire pardonner l'absence ».

Un envoi par trimestre au plus, pour ce segment. S'il ne clique pas, on ne le relance pas la semaine suivante avec −10 %, puis −20 %, puis −30 %. Cette échelle est un dressage. Le client apprend le calendrier des réductions, et le panier de 42 € ne se paie plus plein tarif. Après le message sans réponse, Nora le laisse jusqu'au trimestre suivant, ou elle arrête s'il ne lit plus rien depuis longtemps. Écrire à des silencieux coûte la délivrabilité des autres.

Le lien mène à la nouveauté annoncée, prix affiché, pas à une page « soldes ». Léa a validé que le produit existe. Samir a le stock. Sinon l'e-mail attend. Une réactivation vers une rupture est pire qu'un silence : elle rappelle Lumen pour décevoir.

```video
url: https://www.youtube.com/watch?v=znyXp2xqCQE
title: "What is Lifecycle Marketing? + Tips for Email Marketers"
channel: "Litmus"
duration: "3:51"
lang: en
why: "Le marketing de cycle de vie expliqué par Litmus, avec des conseils pour l'e-mail."
```

# Ce qu'on mesure sur l'e-mail, et pas plus

Pour chaque envoi, trois nombres suffisent. Combien sont partis (après retrait des désinscrits). Combien ont fait **le** geste demandé (clic vers la page prévue, ou commande pour l'abandon). Combien se sont plaints ou désinscrits. Un bel ouvert ne prouve pas le geste. Beaucoup d'outils comptent une ouverture dès qu'une image se charge, parfois sans lecture.

L'abandon se juge aux paniers repris, pas aux ouvertures. L'après-achat ne se juge pas à une vente le jour même : ce n'était pas son objectif. Le juger ainsi pousse Nora à y coller une promo, et le cycle se dégrade. La réactivation se juge au retour vers la page, puis, avec du délai, à une commande au prix normal. Une commande à −20 % n'est pas le succès de ce message, c'est un autre choix, que ce parcours déconseille.

Aucun de ces e-mails ne remplace un CPA de pub. Ils coûtent peu d'argent direct et beaucoup de confiance. Les traiter comme un canal « gratuit, donc sans seuil » est la façon la plus sûre de solder 42 € sans s'en apercevoir.

# Exercices

## Exercice 1 : Combien d'objectifs ?

Relisez ce brouillon. « Bienvenue chez Lumen ! −15 % avec le code NOUVEAU, dites-nous quelle odeur vous préférez, achetez le coffret à 78 €, et laissez un avis si vous avez déjà commandé. » Que gardez-vous pour l'e-mail de bienvenue ?

<details>
<summary>Voir la solution</summary>

Vous ne gardez qu'une demande : faire reconnaître la maison. Le texte dit ce qu'est Lumen, le prix habituel autour de 42 €, la livraison en 48 h, la façon d'allumer, le rythme d'une à deux fois par mois. Un seul lien, vers la bougie du moment, prix visible.

Vous retirez le code NOUVEAU, le sondage, le coffret et l'avis. Chacun pourra exister dans un autre envoi, à un autre moment, avec son propre objectif. Quatre demandes dans la bienvenue, c'est zéro geste. Le −15 % apprend en plus que 42 € n'est pas le vrai prix.

</details>

## Exercice 2 : Réécrire l'abandon

« Vous nous avez oubliés… −10 % pendant 3 heures, sinon votre panier sera perdu et nous serons tristes. » La personne avait laissé la bougie pluie à 42 €. Proposez le message, et dites ce qui ne doit pas s'y trouver.

<details>
<summary>Voir la solution</summary>

« Votre bougie pluie, 42 €, est encore dans le panier. Vous pouvez le reprendre ici. Elle part en 48 h tant que le stock tient. Si vous ne voulez plus ce rappel, le lien est en bas. »

Il n'y a pas de reproche, pas de compte à rebours angoissant, pas de −10 %. Un seul bouton, vers ce panier. Si la commande a été payée entre-temps, ce texte ne part pas. S'il n'y avait pas d'adresse saisie par la personne, il ne part pas non plus.

</details>

## Exercice 3 : Après-achat et réveil

Un client a reçu sa bougie il y a 4 jours. Un autre n'a rien commandé depuis 5 mois, consentement toujours oui. On vous propose le même e-mail pour les deux : « −20 % ce week-end sur tout le site ». Pourquoi est-ce faux dans les deux cas, et que mettez-vous à la place ?

<details>
<summary>Voir la solution</summary>

Le client de 4 jours a besoin du mode d'emploi (mèche, environ 45 heures), pas d'une réduction qui dévalue l'achat qu'il vient de faire. Objectif : réussir la bougie. Pas de code.

Le client de 5 mois peut recevoir une réactivation, une seule raison, par exemple la nouvelle odeur au prix normal, ou le coffret à 78 € si c'est un cadeau. Pas −20 % « pour se faire pardonner ». S'il ne répond pas, on ne relance pas la semaine d'après avec un code plus fort. Prochain message au plus tôt au trimestre suivant.

Le même texte pour les deux ignore le moment. Et le −20 % fait passer un panier de 42 € à 33,60 €, marge 20,16 €, sans que ce soit l'objectif d'aucun des deux e-mails.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "E-mails du cycle"
center: "Quatre moments, un objectif chacun. La bienvenue et l'après-achat ne soldent pas le panier de 42 €."
points:
  - icon: chat
    title: "Bienvenue"
    text: "Case cochée par la personne. Faire reconnaître Lumen, le prix, le rythme. Pas de code nouveau client."
  - icon: clock
    title: "Un abandon"
    text: "Le panier laissé, à 42 € ou 78 €, un seul rappel. Pas de culpabilité, pas de réduction minute."
  - icon: book
    title: "Après l'achat"
    text: "Mèche et durée, environ 45 heures. La personne vient de payer. On ne lui offre pas −20 % le lendemain."
  - icon: loop
    title: "Réveil rare"
    text: "Plus de 120 jours, consentement oui, une raison, une fois par trimestre. Pas une échelle de codes."
  - icon: target
    title: "Le geste, pas l'ouvert"
    text: "On compte le clic demandé ou le panier repris. Une ouverture seule ne prouve pas la lecture."
pitfall: "Un seul texte, −20 % ce week-end, envoyé au nouveau, au panier, au client de 4 jours et au dormant."
remember: "Si l'objectif a besoin d'un et, ce sont deux e-mails. Le second attend son moment, ou il n'existe pas."
```
