---
title: "Découper la release qui apprend"
description: "Choisir la plus petite release Halte qui apprend quelque chose, tenir un interrupteur par magasin, et écrire ce qui ne rentre pas dans la v1."
duration: 55
objectives:
  - "Définir la plus petite release qui répond à une question encore ouverte"
  - "Limiter qui voit la règle, quitte à l'éteindre sans toucher tout le réseau"
  - "Écrire ce qui ne rentre pas dans la v1, sur la même page"
  - "Refuser le petit ajout qui empêche d'apprendre"
---

# La plus petite release qui apprend

Une release n'est pas « tout ce que l'équipe a fini ». C'est le plus petit changement **en magasin et côté client** qui répond à une question encore ouverte. Sur Halte : si Karim voit un oui ou un non avant 17 h 30, cesse-t-il d'appeler et de garder Lina au hasard, et la part des commandes dont la promesse est affichée et tenue monte-t-elle, parce qu'on n'invente plus d'heure ?

Tant que la question n'est pas écrite, on empile. Le SMS, le dimanche, le créneau fin, une nouvelle phrase dans le tunnel. Chacun a un défenseur. Aucun ne répond à la question. La v1 gonfle, le samedi utile recule.

La plus petite release tient en une phrase. Sur les pilotes qui ferment à 19 h et dont le transporteur a un signal, Villeneuve d'abord : avant 17 h 30, oui ou non. Le client ne voit une heure précise que si ce oui est là à temps. Sinon, un créneau large. Rien d'autre.

Cette petitesse n'est pas un manque d'ambition. Les quarante magasins restent le cap. Ils ne sont pas la release qui apprend. Si vous y mettez aussi les huit transporteurs sans signal, vous ne saurez pas si l'échec vient de la règle ou d'une heure inventée.

> [!IMPORTANT]
> Une release qui n'a pas de question n'est pas petite. Elle est incomplète. Écrivez la question avant la liste de ce qu'on allume.

# Un interrupteur, pas une annonce au réseau

Vous voulez allumer la règle à Villeneuve un samedi, et l'éteindre le suivant si les clients ne voient plus aucun créneau et abandonnent, ou si Karim voit un non alors que le camion passe. Vous ne voulez pas, pour cela, expliquer à quarante directeurs que « c'est revenu comme avant ». L'**interrupteur** (on dit aussi feature flag) est cette idée : la règle est allumée pour des magasins nommés, éteinte pour les autres.

Vous ne décrivez pas le mécanisme. Hugo sait comment une règle peut ne valoir que pour Villeneuve. Votre décision est ailleurs.

- **Qui est allumé.** Villeneuve d'abord, un samedi où la décision se pose. Puis les autres pilotes du même contexte, si ce samedi ne casse pas la commande.
- **Qui est éteint.** Le reste du réseau, et tout magasin dont le transporteur n'a pas de signal.
- **Qui peut éteindre.** Vous, le jour même, si un garde-fou casse : plus aucun créneau, ou un oui qui contredit le quai. Éteindre n'est pas un échec honteux.
- **Ce que vous ne cachez pas.** Léa sait qui est allumé. L'interrupteur ne sert pas à faire croire que les quarante ont déjà la règle.

Sans propriétaire, dans trois semaines Villeneuve est encore seul, et un magasin « a été ajouté pour dépanner ». Vous écrivez la liste, et la date où vous élargissez ou vous éteignez. Élargir est une décision, pas une fuite.

```diagram
type: flow
title: "Allumer seulement pour apprendre"
steps:
  - title: Question
    text: "Karim n'appelle plus, et la promesse tenue monte-t-elle sans heure inventée ?"
    tone: violet
  - title: Plus petit
    text: "Oui ou non avant 17 h 30. Heure précise seulement si le signal est à temps."
    tone: teal
  - title: Interrupteur
    text: "Villeneuve d'abord. Le réseau et les transporteurs sans signal restent éteints."
    tone: blue
  - title: Décision
    text: "Élargir, tenir, ou éteindre. Pas un magasin ajouté en silence."
    tone: amber
```

# Ce qui reste hors de la v1

Le hors v1 est à côté de la question.

- Le SMS de retard.
- Le dimanche.
- Le créneau matin ou après-midi.
- Les huit transporteurs sans signal.
- Les magasins qui ne sont pas les pilotes de ce contexte.
- Le retournement de la décision si un signal arrive à 18 h 45.

Chacun peut être une release suivante, quand la question a une réponse. Le test d'entrée : si l'ajout ne change pas la réponse (Karim appelle-t-il encore, la promesse tenue monte-t-elle), il n'entre pas. Une icône, un texte de réassurance, une heure plus fine : dehors.

Inès dira que sans SMS la v1 est incomplète. Le directeur dira que le créneau fin est le vrai sujet. Ils ont une suite. Ils n'ont pas le droit de rendre la question illisible. Vous le redites avec la question en tête.

# Apprendre sans élargir

Deux ou trois samedis où la décision se pose suffisent à voir le geste. Tous les samedis ne comptent pas : si le camion est passé à 15 h, le job n'était pas là. Vous regardez trois choses.

La part des commandes pilotes dont la promesse a été affichée et tenue. Elle ne doit pas monter seulement parce que vous n'affichez plus rien. Si plus aucun créneau n'existe, vous avez éteint l'offre.

Le geste de Karim. Ouvre-t-il avant 17 h 30, les samedis où vous n'êtes pas là, et n'appelle-t-il plus ? S'il ouvre à 18 h 50, Lina est déjà gardée. La release a appris que le produit n'arrive pas à l'heure du job.

Les réclamations qu'Inès relie à « je ne savais pas quand ». Si elles ne bougent pas sur les pilotes, vous ne déclarez pas la v1 réussie parce que l'écran est en ligne.

Élargir est une décision d'après ces observations. « On verra en l'étendant » n'est pas garder, corriger, ou éteindre.

> [!WARNING]
> Un magasin ajouté « pour dépanner » est une v2 cachée. La liste des magasins allumés est la release. Ce qui n'y est pas n'y est pas.

# Exercices

## Exercice 1 : Le petit texte

La v1 peut s'allumer à Villeneuve. Inès demande d'ajouter dans le tunnel : « votre magasin vous préviendra par SMS en cas de retard ». Le SMS n'existe pas. Acceptez-vous la phrase ?

<details>
<summary>Voir la solution</summary>

Non. La phrase promet un canal hors v1, et elle ne dit pas si Karim cesse d'appeler ni si la promesse tenue monte. Elle apprend au client à attendre un message que Halte n'envoie pas.

Vous la notez avec le SMS, pour une release où le canal existerait. La v1 reste le oui ou non, et l'heure précise seulement quand le signal est à temps.

</details>

## Exercice 2 : Qui est allumé

Villeneuve a vécu un samedi de décision. Un directeur veut allumer son magasin, qui ferme à 21 h et dont le transporteur n'a pas de signal, parce qu'un client s'est plaint. L'interrupteur le permet. Que décidez-vous ?

<details>
<summary>Voir la solution</summary>

Vous n'allumez pas ce magasin dans la foulée. Il n'est pas le contexte de la question : ni la fermeture à 19 h, ni un signal déjà là. Une plainte ne transforme pas l'essai en réseau.

Vous pouvez rattacher la plainte à la question, et élargir plus tard, après les samedis prévus, si Léa le décide explicitement. Le magasin s'écrit alors sur la liste. Il ne s'ajoute pas en silence, et on ne lui invente pas une heure.

</details>

## Exercice 3 : La question absente

On propose une v1 « riche » : créneau fin, nouveau texte, et oui ou non, sur tous les pilotes, « pour ne passer qu'une fois ». Quelle question peut-elle encore trancher, et que retirez-vous ?

<details>
<summary>Voir la solution</summary>

Presque aucune. Si la tenue monte, vous ne saurez pas si c'est le oui ou non, le créneau fin ou le texte. Passer une seule fois empêche d'apprendre.

Vous retirez le créneau fin et le nouveau texte. Vous gardez le oui ou non avant 17 h 30, et l'heure précise seulement si le signal est à temps. Le reste attend une réponse.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: La v1 qui apprend
center: "La plus petite release répond à une question. Un interrupteur limite qui la voit. Le reste est écrit dehors."
points:
  - icon: target
    title: La question
    text: "Karim n'appelle plus, et la promesse tenue monte sans heure inventée. Sans question, on empile."
  - icon: rocket
    title: Le plus petit
    text: "Villeneuve, oui ou non avant 17 h 30. Heure précise seulement si le signal est là à temps."
  - icon: lock
    title: Interrupteur
    text: "Villeneuve d'abord, le réseau éteint. Vous pouvez éteindre le jour même. Léa sait qui est allumé."
  - icon: filter
    title: Hors v1
    text: "SMS, dimanche, créneau fin, transporteurs sans signal, bascule à 18 h 45. Petit n'est pas un critère."
  - icon: eye
    title: Avant d'élargir
    text: "On garde, on corrige la question, ou on éteint. Étendre pour montrer que ça avance n'est pas une réponse."
pitfall: "Ajouter la phrase SMS « juste pour cette fois », ou allumer un magasin sans signal parce qu'un directeur a appelé."
remember: "La v1 est la question, les magasins allumés, et la liste de ce qui n'y entre pas. Élargir est une autre décision."
```
