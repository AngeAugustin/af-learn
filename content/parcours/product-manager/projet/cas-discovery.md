---
title: "Un cas de discovery flou"
description: "Partir du brief « il nous faut de l'IA » et en sortir une opportunité, un non-objectif, et le risque qui peut faire renoncer."
duration: 40
objectives:
  - "Refuser de prendre « il nous faut de l'IA » pour une opportunité"
  - "Écrire l'opportunité en décision, utilisateur et moment"
  - "Poser un non-objectif qui protège le sujet"
  - "Nommer le risque qui autorise à ne pas continuer"
---

# « Il nous faut de l'IA » n'est pas une opportunité

Le brief de Léa tient en une phrase, dite en comité : « Il nous faut de l'IA. Les magasins perdent un temps fou sur les retards. » Autour de la table, la phrase gonfle. Inès pense à un accueil client qui répondrait tout seul. Chloé pense aux mails des transporteurs, qu'on pourrait « faire écrire ». Un directeur de région pense à un classement des magasins trop lents à appeler. Tout le monde a raison d'avoir mal. Personne n'a encore un produit.

Votre discovery ne commence pas par un choix de solution. Elle commence par séparer **le symptôme**, **les envies**, et **une décision qu'on pourrait améliorer**. Le symptôme est réel : le matin, le responsable reconstitue les retards avec des mails, et parfois il appelle trop tard, parfois pour rien. Les envies sont des produits différents. Les mettre dans le même sujet parce qu'ils contiennent le mot IA, c'est garantir un outil que nul ne saura juger.

Vous posez trois questions, et vous notez qui répond.

- Quel geste, fait par qui, change si on réussit ?
- À quelle heure ce geste a-t-il encore une valeur ?
- Qu'est-ce qui se passe de pire si l'aide se trompe ?

Si la salle répond « on gagne du temps » sans dire le geste, vous n'avez pas fini. Le temps de qui, sur quelle tâche, à la place de quoi ? Karim qui ferme ses mails deux minutes plus tôt n'est pas le même gain que Hugo qui n'a plus à rappeler un client déjà joint.

> [!IMPORTANT]
> Une opportunité se raconte comme une décision. « Il nous faut de l'IA » se raconte comme un outil. Vous ne signez pas un outil.

# Écrire l'opportunité

Vous n'écrivez qu'une opportunité pour ce sujet. Les autres envies ne sont pas insultées. Elles sont d'autres sujets, avec d'autres risques. L'opportunité du brief du matin, si les entretiens avec Karim et deux autres responsables la tiennent, se formule ainsi.

**Qui.** Le responsable de magasin, les jours où il est là avant l'ouverture.

**Quelle décision.** Choisir, avant 8 h 15, quelles livraisons appeler, lesquelles repasser en préparation, lesquelles confier à Hugo.

**Quel problème actuel.** Il reconstitue cela depuis des mails de transporteurs hétérogènes. Il rate des appels utiles ou en passe d'inutiles. Hugo récupère les clients surpris.

**Pourquoi maintenant.** Le volume du matin sur une partie des magasins dépasse ce qu'une lecture de mails permet avant l'ouverture. Ce n'est pas « parce que l'IA est disponible ». Si le volume ne tient que dans quatre magasins, l'opportunité est un pilote, pas un programme national.

**À quoi on verra que c'est vrai.** Des responsables qui, plusieurs matins de suite, changent qui ils appellent, sans augmenter les appels à tort. Vous le notez comme hypothèse, pas comme bénéfice acquis. La discovery affirme le problème. Elle ne promet pas le résultat.

Vous vérifiez l'opportunité contre l'alternative sans modèle. Si un écran trié (son magasin, créneau dépassé, statut pas livré) suffit à la décision, l'opportunité existe encore, et la solution n'est pas un assistant. Le noter est une bonne discovery. Arriver en comité avec « l'opportunité, c'est l'IA » est une discovery ratée.

Deux responsables suffisent pour une première formulation, pas pour une généralisation. Vous écrivez « observé à Lille et à Rennes, pas encore ailleurs ». Léa peut décider d'un pilote sur cette base. Elle ne peut pas décider des quarante.

# Écrire le non-objectif

Le non-objectif protège l'opportunité de ses voisins. Sans lui, le sujet du matin devient en trois réunions un chatbot, un SMS et un baromètre des magasins. Vous en écrivez peu, et vous les écrivez comme des refus de **ce** sujet, pas comme des mépris.

Pour Halte, les non-objectifs du brief du matin sont :

- prévenir le client à sa place, par SMS ou par e-mail ;
- répondre aux questions libres du magasin ou du client ;
- choisir ou relancer un transporteur ;
- noter, classer ou comparer les responsables ;
- décider un avoir, un remboursement, ou une réponse à une réclamation.

Chacun de ces voisins a peut-être une valeur. Aucun n'est un élargissement gratuit. Prévenir le client change le droit et la charge d'Hugo. Classer les magasins change la confiance : plus personne ne tapera « ce n'est pas un retard ». Vous le dites en discovery, parce que c'est maintenant que les voisins essaient d'entrer, pas après la spec.

```diagram
type: flow
title: "Du brief flou à une page de discovery"
steps:
  - title: Symptôme
    text: "Le matin se reconstitue dans les mails"
    tone: amber
  - title: Décision
    text: "Qui appeler, repasser, confier, avant 8 h 15"
    tone: violet
  - title: Non-objectif
    text: "Pas de SMS, pas de note des magasins, pas de chat"
    tone: rose
  - title: Risque d'arrêt
    text: "Retard inventé, mauvais magasin, donnée personnelle"
    tone: teal
  - title: Suite
    text: "Pilote cadré, écran seul, ou on n'y va pas"
    tone: blue
```

Un non-objectif se teste par une phrase. Si Inès peut ajouter « et aussi le SMS » sans que votre page devienne fausse, le non-objectif n'était pas écrit. Vous le relisez à voix haute en fin de discovery. Les gens hochent la tête sur l'opportunité et sursautent sur le refus. Le sursaut est le signe que la ligne sert.

# Le risque qui peut faire renoncer

Une discovery honnête dit aussi pourquoi on pourrait **ne pas** faire le sujet. Ce n'est pas une liste d'inquiétudes pour paraître sérieux. C'est le risque qui, s'il est probable, rend l'opportunité mauvaise.

Pour ce brief, le risque qui tue est connu : **un retard inventé**, un **mauvais magasin**, ou une **donnée personnelle** dans le texte. Si vous ne voyez pas comment les empêcher avec les données actuelles (statut sans heure, magasin mal renseigné, commentaires libres partout), vous ne recommandez pas un assistant. Vous recommandez d'abord l'écran de la règle, ou même de ne rien lancer tant que l'heure du statut n'existe pas.

Le deuxième risque est l'adoption fantôme. Si les responsables n'ont pas le temps d'ouvrir quoi que ce soit avant 8 h 15, un brief de plus est une gazette. Vous le vérifiez en les suivant un matin, pas en le supposant. Deux observations valent mieux qu'un sondage « seriez-vous intéressé par une IA ».

Le troisième risque est politique : le sujet sert de vitrine. Léa a besoin d'annoncer quelque chose en région. Vous séparez l'annonce et le produit. On peut annoncer un pilote de quatre magasins avec une phrase tenable. On ne lance pas les quarante pour fournir la phrase « toujours exact ». Si la vitrine exige la phrase interdite, votre recommandation est de ne pas faire le sujet sous cette bannière.

| Issue possible | Quand la choisir |
| --- | --- |
| Pilote de l'assistant | La décision est réelle, les faits ont une heure, l'erreur est cadrée |
| Écran de la règle seul | La liste triée suffit, le modèle n'apporte pas l'action |
| On ne lance pas | Pas d'heure de statut, ou la vitrine exige « toujours exact » |

Vous terminez la discovery par une recommandation, une seule. « Les trois options restent ouvertes » n'est pas une discovery. C'est un report. Léa peut refuser votre recommandation. Elle ne doit pas avoir à la deviner.

> [!WARNING]
> Si le comité ne supporte pas un non-objectif, il ne supportera pas le produit. Mieux vaut l'apprendre avant d'écrire la spec.

# Exercices

## Exercice 1 : Trois envies, un sujet

En une réunion, vous entendez : un brief du matin pour Karim, un SMS automatique au client, un classement des magasins qui appellent trop lentement. Léa dit : « C'est le même projet IA, on ne va pas faire trois dossiers. » Que répondez-vous ?

<details>
<summary>Voir la solution</summary>

Ce ne sont pas trois présentations du même geste. Le brief aide une décision du responsable avant 8 h 15. Le SMS agit à la place du magasin et change le droit. Le classement change la confiance et décourage le bouton d'erreur.

Vous refusez le dossier unique. Vous proposez une opportunité, celle du matin, si les visites magasin la tiennent. Le SMS et le classement sont des non-objectifs de ce sujet. S'ils méritent un jour un cadre, ce sera un autre problème, une autre erreur acceptable, une autre signature. Les regrouper maintenant, c'est ne plus pouvoir dire si on a réussi.

</details>

## Exercice 2 : L'opportunité creuse

Un compte rendu dit : « Opportunité : utiliser l'IA pour améliorer l'expérience livraison et gagner du temps en magasin. » Réécrivez l'opportunité en cinq lignes utiles, et dites ce qui manquait.

<details>
<summary>Voir la solution</summary>

Il manquait le geste, l'heure et la personne. « Gagner du temps » et « améliorer l'expérience » ne se constatent pas.

Formulation tenable : le responsable, avant 8 h 15, choisit qui appeler, qui repasser en préparation, qui confier à Hugo. Aujourd'hui il reconstitue cela dans des mails hétérogènes et se trompe dans les deux sens. Hypothèse : un brief de son magasin change cette décision plusieurs matins de suite, sans augmenter les appels à tort. Périmètre observé : deux magasins, pas les quarante. Si un écran trié suffit, l'assistant n'est pas la solution.

</details>

## Exercice 3 : La vitrine

La direction veut annoncer au prochain rassemblement : « Halte a une IA toujours exacte sur les retards. » Les statuts de deux transporteurs n'ont pas d'heure. Quelle recommandation de discovery faites-vous ?

<details>
<summary>Voir la solution</summary>

Vous ne recommandez pas l'assistant sous cette bannière. « Toujours exact » est une promesse que vous n'avez pas le droit d'écrire, et l'absence d'heure de statut empêche la règle de fraîcheur. Sans heure, vous ne savez pas quand vous taire.

La recommandation : ne pas lancer le brief tant que l'heure du statut n'existe pas sur les transporteurs du pilote. On peut annoncer un travail sur la liste du matin, pas une IA exacte. Si la vitrine exige la formule interdite, le sujet s'arrête. Un pilote cadré pourra revenir plus tard, avec une phrase tenable, pas avec le slogan du rassemblement.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Discovery quand c'est flou
center: "Une décision, un non-objectif, un risque d'arrêt. « Il nous faut de l'IA » n'est pas une opportunité."
points:
  - icon: search
    title: Symptôme
    text: "Le matin se reconstruit dans les mails. Les envies voisines (SMS, classement, chat) sont d'autres sujets."
  - icon: target
    title: Opportunité
    text: "Qui décide, avant 8 h 15, et comment on verra que la décision change. Deux magasins ne font pas une preuve nationale."
  - icon: shield
    title: Non-objectif
    text: "Pas de message au client, pas de note des magasins, pas de chat, pas de geste commercial. Le sursaut en réunion est bon signe."
  - icon: alert
    title: Renoncer
    text: "Sans heure de statut, ou si la vitrine exige « toujours exact », on ne lance pas l'assistant."
  - icon: compass
    title: Une recommandation
    text: "Pilote, écran de la règle seul, ou arrêt. Laisser les trois ouvertes, c'est reporter la discovery."
pitfall: "Accepter un seul dossier IA pour le brief, le SMS et le classement, afin de ne pas faire trois papiers."
remember: "L'opportunité se raconte comme le geste de Karim. Si l'écran trié suffit, le modèle ne fait pas partie de la recommandation."
```
