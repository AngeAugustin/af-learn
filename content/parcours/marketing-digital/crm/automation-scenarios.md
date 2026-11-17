---
title: Scénarios automatiques
description: "Décrire un scénario par son déclencheur, son délai, sa condition et sa sortie, assez court pour tenir en cinq lignes."
duration: 50
objectives:
  - "Nommer les quatre pièces d'un scénario, sans écran de réglage"
  - "Écrire un abandon et un après-achat que l'équipe peut raconter"
  - "Faire sortir la personne dès que le geste est fait ou refusé"
  - "Refuser un scénario qu'on ne peut pas expliquer simplement"
---

# Si vous ne pouvez pas le dire, vous ne pouvez pas le lancer

Un scénario automatique envoie des e-mails sans que Nora appuie sur le bouton à chaque fois. C'est utile pour une équipe de quatre. C'est dangereux pour la même raison : une erreur part la nuit, à tout le segment, sans relecture. La parade n'est pas un outil plus complexe. C'est un texte de **cinq lignes** que Léa, vous, Nora et Samir comprenez de la même façon.

Ces cinq lignes répondent toujours aux mêmes questions.

1. **Déclencheur.** Quel fait fait entrer la personne ?
2. **Délai.** Combien de temps après, et pourquoi ce délai ?
3. **Condition.** Qu'est-ce qui doit être encore vrai pour que le message parte ?
4. **Message.** Quel e-mail, avec son objectif unique ?
5. **Sortie.** Quel fait arrête le scénario, même au milieu ?

S'il faut une sixième ligne « et aussi, parfois, un code », le scénario n'est pas prêt. Vous le simplifiez avant de le brancher. L'Atelier Lumen n'a pas un pôle CRM. Il a Nora, qui doit pouvoir le couper un dimanche sans mode d'emploi de dix pages.

# Déclencheur, délai, condition, sortie

Le **déclencheur** est un fait daté, pas une humeur. « A coché la newsletter. » « A saisi son adresse et laissé un panier non payé. » « Commande payée. » « Dernier achat il y a 120 jours, consentement encore oui. » « Semble intéressé » n'est pas un déclencheur. Personne ne peut le vérifier dans la base.

Le **délai** a une raison. Quatre heures pour un panier : assez pour laisser sortir la carte bancaire, pas assez pour que ce soit un autre mois. Trois jours après l'expédition pour le mode d'emploi : le colis est en route ou arrivé. Cinquante jours après l'achat pour parler de réachat : une bougie d'environ 45 heures, brûlée le soir, se termine dans cette zone, sans tomber le lendemain de la livraison. Un délai de zéro partout est de l'impatience. Un délai de « on verra » n'est pas un scénario.

La **condition** se revérifie **au moment de l'envoi**, pas seulement à l'entrée. Le panier a été payé entre-temps : on n'envoie pas l'abandon. La personne s'est désinscrite : on n'envoie rien. Le stock de la bougie montrée est à zéro, Samir l'a dit : on n'envoie pas une réactivation vers une rupture. La condition est une phrase négative utile. « Encore vrai que… »

La **sortie** retire la personne de la file. Paiement, désinscription, fin de la série, ou délai dépassé (un seul rappel, pas une boucle). Sans sortie, le scénario devient une pompe. La personne qui a déjà acheté reçoit quand même « vous avez oublié votre panier ». C'est le symptôme le plus clair d'une sortie oubliée.

> [!TIP]
> Écrivez la sortie avant le texte de l'e-mail. Un beau message sans porte de sortie partira aux gens pour qui il est devenu faux.

```diagram
type: sequence
title: "Le rappel de panier, de bout en bout"
actors:
  - "Client"
  - "Site"
  - "Scénario"
  - "Nora"
messages:
  - from: 0
    to: 1
    text: "Laisse la bougie à 42 €, avec son adresse"
  - from: 1
    to: 2
    text: "Déclencheur, puis délai de 4 heures"
  - from: 2
    to: 2
    text: "Condition, toujours pas payé, pas désinscrit"
  - from: 2
    to: 0
    text: "Un seul e-mail, lien vers ce panier"
  - from: 0
    to: 1
    text: "Paie, ou se désinscrit"
  - from: 1
    to: 2
    text: "Sortie, plus aucun rappel"
```

```video
url: https://www.youtube.com/watch?v=x_LvUWmxzNk
title: "C'est quoi le Marketing Automation ?"
channel: "Agence Invox"
duration: "2:36"
lang: fr
why: "Le marketing automation expliqué en français en moins de trois minutes."
```

# Deux scénarios que Lumen peut raconter

**Abandon de panier**, cinq lignes.

1. Déclencheur : adresse saisie, panier non payé, contenant au moins une bougie.
2. Délai : 4 heures.
3. Condition : toujours pas de paiement, pas désinscrit, le produit est encore en stock.
4. Message : un seul e-mail, le contenu du panier et son prix (42 € ou 78 €), bouton vers ce panier, pas de code.
5. Sortie : paiement, désinscription, ou 48 heures écoulées. Pas de second e-mail.

**Après l'achat**, cinq lignes.

1. Déclencheur : commande payée et expédiée.
2. Délai : 3 jours après l'expédition.
3. Condition : commande non annulée, colis non revenu.
4. Message : mode d'emploi de la bougie achetée, environ 45 heures, pas d'autre produit, pas de réduction.
5. Sortie : envoi fait, ou annulation, ou désinscription des messages non indispensables. Ce scénario ne continue pas vers une promo au jour 4.

Le réachat à 50 jours est un **autre** scénario, pas une sixième ligne collée à celui-ci. Déclencheur : une seule commande, 50 jours plus tôt. Condition : pas de deuxième commande, consentement newsletter oui. Message : une phrase sur la bougie qui se termine, lien au prix normal. Sortie : deuxième commande, désinscription, ou message déjà parti. Un scénario, un objectif.

# Ce qui ne tient pas en cinq lignes

Quelques machines que Nora ne branche pas.

Une suite de cinq réductions (10 %, puis 15 %, puis 20 %) selon que la personne n'a pas ouvert. L'ouverture est mal mesurée, et l'échelle apprend à attendre 20 %. Ça ne tient pas en cinq lignes honnêtes : la cinquième serait « on solde ceux qui ignorent ».

Un scénario qui envoie le coffret, demande un avis, propose le parrainage et offre un code, « pour rentabiliser l'outil ». Quatre objectifs, quatre scénarios possibles, zéro si on les empile.

Un déclencheur « a vu une publicité ». La pub se juge au CPA, pas en inscrivant la personne dans un e-mail qu'elle n'a pas demandé. Le consentement ne se déduit pas d'un clic sur une annonce.

Une condition que seul l'outil comprend, du type « score d'engagement supérieur à 70 ». Les quatre ne savent pas ce que 70 veut dire, donc personne ne peut le couper intelligemment. On préfère un fait : dernière commande, oui ou non.

> [!WARNING]
> Testez avec votre propre adresse, un panier à 42 €, puis payez-le avant la quatrième heure. Si le rappel part quand même, la sortie est fausse. Vous ne lancez pas.

# Qui a le droit de le modifier

Nora est la seule à activer ou à couper. Léa valide l'offre citée (pas de prix inventé, pas de code ajouté dans le texte). Samir valide le délai d'expédition cité, 48 h, et peut demander une pause si une bougie est en rupture. Vous vérifiez que le scénario ne contredit pas la pub de la semaine : si la pub annonce le coffret à 78 € et que l'abandon montre une autre remise, le client voit deux Lumen.

Une modification de délai, de condition ou de sortie est une nouvelle version, datée, pas un réglage « petit ». Changer « un e-mail » en « trois e-mails » n'est pas petit. On réécrit les cinq lignes, on reteste avec une vraie adresse, on relance.

Le dimanche, si quelque chose dérape (envoi aux désinscrits, code apparu tout seul, rupture), Nora coupe d'abord, elle comprend ensuite. L'équipe de quatre préfère un soir sans e-mail à une nuit de mauvaises sorties. Le scénario n'est pas un être vivant. L'arrêter n'abîme pas l'atelier.

# Exercices

## Exercice 1 : Les cinq lignes de l'abandon

Le réglage actuel dit : « Dès qu'on quitte la fiche, envoyer trois e-mails, à 10 minutes, à 1 jour et à 3 jours, avec −10 % puis −20 %, sauf si la personne a l'air froide. » Réécrivez en cinq lignes tenables pour Lumen.

<details>
<summary>Voir la solution</summary>

1. Déclencheur : adresse saisie par la personne, panier non payé.
2. Délai : 4 heures, pour laisser le temps de payer sans rappel.
3. Condition au moment de l'envoi : toujours impayé, pas désinscrit, produit en stock.
4. Message : un e-mail, le panier et son prix, sans code.
5. Sortie : paiement, désinscription, ou 48 heures. Pas de deuxième message, donc pas de −10 % puis −20 %.

« Quitte la fiche » n'est pas un déclencheur : il n'y a souvent pas d'adresse. « A l'air froide » n'est pas une condition. Trois e-mails soldés ne tiennent pas dans la règle d'un seul objectif.

</details>

## Exercice 2 : Où est la sortie ?

Un client laisse un panier à 16 h, paie à 18 h, et reçoit à 20 h « vous avez oublié votre bougie à 42 € ». Le délai prévu était de 4 heures. Quelle pièce est cassée, et comment la réparez-vous ?

<details>
<summary>Voir la solution</summary>

Le délai a été respecté (16 h plus 4 heures). Le déclencheur aussi. La pièce cassée est la condition revérifiée à l'envoi, et la sortie. Le paiement de 18 h aurait dû sortir la personne de la file. Le scénario a gardé l'état de 16 h.

Réparation : au moment d'envoyer, vérifier qu'aucune commande payée ne correspond à cette adresse depuis l'entrée dans le scénario. Si oui, sortie, aucun e-mail. Vous retestez avec votre adresse : panier, paiement avant la quatrième heure, et vous contrôlez qu'il n'y a rien dans la boîte. Tant que le test échoue, le scénario reste coupé.

</details>

## Exercice 3 : Un scénario qu'on refuse

On vous propose : « Si quelqu'un clique une pub et ne commande pas en 24 h, lui envoyer cinq messages sur dix jours, score d'engagement, code croissant, et le coffret même s'il regardait la bougie à 42 €. » Pourquoi refusez-vous, en cinq objections courtes ?

<details>
<summary>Voir la solution</summary>

Le clic pub n'est pas un consentement pour une série d'e-mails, et souvent vous n'avez même pas l'adresse. Cinq messages, ce n'est pas un objectif. Le score d'engagement n'est pas un fait que les quatre savent couper. Le code croissant dresse le client à attendre la plus forte remise, et fait baisser la marge sous les 25,20 €. Le coffret à 78 € n'est pas le produit regardé : le message ment sur l'intention.

Version acceptable, seulement s'il y a une adresse saisie : le scénario d'abandon en cinq lignes, un e-mail, sans code, sortie au paiement. Le reste n'est pas « à brancher plus tard dans le même flux ». C'est à ne pas construire.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Scénarios en cinq lignes"
center: "Déclencheur, délai, condition, message, sortie. Si une sixième ligne apparaît, le scénario n'est pas prêt."
points:
  - icon: zap
    title: "Un fait, pas une humeur"
    text: "Commande payée, panier avec adresse, consentement. « Semble intéressé » ne se vérifie pas."
  - icon: clock
    title: "Un délai justifié"
    text: "4 heures pour le panier, 3 jours pour le mode d'emploi, 50 jours pour le réachat. Pas zéro partout."
  - icon: filter
    title: "Condition à l'envoi"
    text: "On revérifie juste avant. Payé entre-temps, désinscrit, rupture : le message ne part pas."
  - icon: alert
    title: "La sortie d'abord"
    text: "Paiement ou refus, et la personne quitte la file. Sans sortie, l'acheteur reçoit un rappel de panier."
  - icon: list
    title: "Cinq lignes"
    text: "Léa, vous, Nora et Samir racontent la même chose. Un score opaque ou cinq codes, on ne branche pas."
pitfall: "Trois relances soldées dès qu'on quitte une fiche, sans vérifier que le panier a été payé à 18 h."
remember: "On écrit la sortie avant le plus bel e-mail. On teste avec sa propre adresse. On coupe d'abord si ça dérape."
```
