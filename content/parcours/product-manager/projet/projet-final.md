---
title: "Projet final : le brief du matin"
description: "Conduire le sujet Halte de l'opportunité à la promesse : spec d'une page, évaluation, phrase tenable et usages refusés."
duration: 90
objectives:
  - "Formuler l'opportunité du brief sans partir du modèle"
  - "Tenir une spec d'une page et trois métriques vérifiables"
  - "Préparer un jeu d'exemples et l'écran du doute"
  - "Écrire la promesse autorisée et les refus que Léa peut citer"
---

# Le projet, et ce que vous rendez

Vous êtes le product manager. Léa vient de dire, en comité : « Il nous faut de l'IA. Les magasins perdent un temps fou sur les retards. » Inès ajoute qu'un SMS au client « ferait gagner encore plus ». Un directeur propose de classer les magasins qui appellent trop tard. Chloé rappelle que deux transporteurs n'envoient presque pas de statut le matin.

Le projet est de **cadrer** l'assistant de retards, pas de le construire. Vous ne choisissez pas de modèle, vous n'écrivez pas de mécanisme technique, vous ne promettez pas un entraînement. Vous rendez quatre jalons, dans l'ordre. Chacun tient sur une page ou moins. Le suivant n'a pas le droit de contredire le précédent.

1. **Opportunité.** La décision, la personne, l'heure, le non-objectif, le risque qui peut faire renoncer.
2. **Spec.** Une page signable, avec le coût par usage et les trois métriques.
3. **Évaluation.** Le jeu d'exemples, le seuil, la revue des premiers matins, l'écran quand ça doute.
4. **Promesse et refus.** La seule phrase publique, et les usages que l'écran ne proposera pas.

Le fil est celui des chapitres : Karim, avant 8 h 15, choisit qui appeler, qui repasser en préparation, qui confier à Hugo. L'oubli d'un retard de moins de vingt minutes est acceptable. Le retard inventé, le mauvais magasin et la donnée personnelle ne le sont pas. Le statut de plus de quarante-cinq minutes ne donne pas d'action.

Vous pouvez conclure, à un jalon, qu'il ne faut **pas** d'assistant. C'est une réponse valide si l'heure du statut manque, si l'écran trié suffit, ou si la direction exige « toujours exact ». Un projet qui s'interdit d'arrêter n'est pas un cadrage. C'est une justification.

> [!IMPORTANT]
> Chaque jalon se lit sans le mot « IA ». Si la phrase a besoin de ce mot pour avoir un sens, elle décrit un outil, pas une décision.

# Jalon 1. L'opportunité

Vous partez du comité, pas de la solution. Vous écrivez cinq lignes.

**Qui décide.** Le responsable de magasin, pas le client et pas le directeur de région.

**Quelle décision.** Avant 8 h 15, les jours où il est là : appeler, repasser en préparation, ou confier à Hugo. Rien n'est envoyé à sa place.

**Le problème observé.** Il reconstitue les retards depuis des mails hétérogènes. Il appelle parfois pour rien, parfois trop tard. Vous le limitez à ce que vous avez vu (deux magasins, dont celui de Karim), sans généraliser aux quarante.

**Le non-objectif.** SMS ou e-mail au client, classement des responsables, question libre, choix du transporteur, geste commercial. Une envie voisine n'entre pas « pour faire un seul dossier ».

**Le risque d'arrêt.** Pas d'heure sur le statut, vitrine qui exige « toujours exact », ou volume du matin déjà tenu par une liste triée. Dans ces cas, votre recommandation est l'écran de la règle, ou l'arrêt, pas un pilote d'assistant.

Vous terminez par **une** recommandation. Pilote cadré, écran seul, ou on n'y va pas. « On verra » n'est pas un jalon.

# Jalon 2. La spec d'une page

Si la recommandation est l'écran seul ou l'arrêt, la spec décrit **cela**, et vous ne fabriquez pas un assistant pour remplir le jalon. Si la recommandation est le pilote, la page a six blocs.

- Décision, personne, heure.
- Ce que le brief montre, y compris la ligne grise et les deux horloges (faits avant 8 h 00, ouverture en moins de vingt secondes).
- Ce qu'il ne fait pas.
- Le recours : liste transporteur, jamais le brief de la veille.
- Le coût : un brief par magasin et par matin, ordre de grandeur, pas une conversation à huit questions.
- Les trois métriques, avec cibles.

**Usage.** Ouvert avant 8 h 15 au moins quatre matins sur cinq. Le jour de la démo ne compte pas.

**Qualité perçue.** « Ce brief m'a aidé à choisir », oui ou non, au moins deux oui dans la semaine. Pas une note d'étoiles.

**Erreur inacceptable.** Au plus un retard inventé confirmé pour vingt briefs. Zéro mélange de magasins. Zéro donnée personnelle. Ces deux zéros suspendent le jour, ils ne se moyennent pas.

Léa doit pouvoir citer la page. Ce qui n'y est pas n'est pas promis. L'extension aux quarante magasins n'est pas dans cette signature. Elle demandera une semaine sans retard inventé, et une nouvelle lecture de la même phrase.

# Jalon 3. L'évaluation

Vous préparez le jugement avant le premier vrai matin. Le jeu compte des familles, pas seulement des retards évidents : créneau pas encore dépassé, colis encore au magasin, client déjà joint, statut trop ancien, commande livrée, commande annulée, magasin voisin. L'attente (« appeler », « se taire », « gris ») est écrite avant de regarder une réponse.

Vous fixez qui confirme l'erreur. Karim, ou le responsable du magasin concerné. Une phrase élégante ne gagne pas contre « j'ai appelé quelqu'un qui était à l'heure ».

Les dix premiers matins ouvrés, Inès ou Hugo lit les lignes d'action avant l'appel. Après, le bouton « ce n'est pas un retard » reste. Si un mélange ou une donnée personnelle apparaît pendant la revue, on ne finit pas la semaine « pour apprendre ». On coupe.

L'écran du doute est décrit en quatre règles : la ligne reste, elle est grise, l'heure du statut se voit, il n'y a pas de bouton. La phrase est « Statut trop ancien, ouvrez la commande. » Pas « retard possible, à votre convenance ».

```diagram
type: flow
title: "Quatre jalons, un seul fil"
steps:
  - title: Opportunité
    text: "Décision, non-objectif, risque d'arrêt"
    tone: violet
  - title: Spec
    text: "Une page, trois métriques, un coût par matin"
    tone: blue
  - title: Évaluation
    text: "Jeu de cas, seuil, revue, écran du doute"
    tone: teal
  - title: Promesse
    text: "Une phrase publique, des refus visibles"
    tone: amber
  - title: Issue
    text: "Pilote, écran seul, ou on n'y va pas"
    tone: rose
```

Vous reliez ce jalon au précédent. Le seuil de l'évaluation est le même que la métrique d'erreur inacceptable. Deux seuils différents, c'est deux produits. Vous n'en voulez qu'un.

# Jalon 4. La promesse et les refus

Vous écrivez la seule phrase que la newsletter, la formation de dix minutes et Léa ont le droit de reprendre.

« Chaque matin ouvré, avant 8 h 15, le responsable voit les retards connus de son magasin et une action suggérée. Quand le statut est trop ancien, la ligne le dit et ne propose rien. C'est lui qui appelle. Rien n'est envoyé au client. »

À côté, les phrases barrées : « toujours exact », « ne rate aucun retard », « le client est prévenu tout seul », « l'assistant gère les retards ». Pas d'astérisque pour les sauver.

Les refus d'usage sont ceux de l'écran, pas seulement ceux du discours : pas de SMS, pas de classement des magasins, pas de téléphone dans le brief, pas de question libre, pas de geste commercial. Un bouton encore présent sera utilisé. Le refus se prouve par l'absence.

La formation tient en dix minutes sur cette phrase : promesse, ligne grise, bouton, passage à Hugo. Le premier public est quatre magasins, trois semaines, choisis pour apprendre (volume, transporteur peu bavard, lien avec Hugo, Karim). Le succès n'est pas le clic du lundi. C'est l'usage avant 8 h 15 et la décision changée.

> [!WARNING]
> Si la phrase du jalon 4 contredit la spec ou l'erreur acceptable, vous revenez en arrière. Vous ne « simplifiez » pas pour la communication.

Vous terminez par la décision de lancement, en une ligne : on lance le pilote sous cette phrase, on lance seulement l'écran trié, ou on n'annonce rien tant que l'heure du statut manque. Les trois jalons précédents doivent rendre cette ligne évidente. Si elle surprend, un jalon a été sauté.

# Exercices

## Exercice 1 : L'opportunité et le non-objectif

Le compte rendu du comité dit : « Projet IA retards : brief magasin, SMS client et classement des responsables, pour une expérience moderne. » Les visites à Lille et à Rennes montrent que le responsable reconstruit sa liste dans les mails avant 8 h 15, et qu'il appelle parfois un client déjà livré. Réécrivez l'opportunité, un non-objectif, et la recommandation.

<details>
<summary>Voir la solution</summary>

Opportunité : le responsable (observé à Lille et à Rennes, pas encore ailleurs) doit, avant 8 h 15, choisir qui appeler, qui repasser en préparation, qui confier à Hugo. Aujourd'hui les mails le font se tromper dans les deux sens. L'hypothèse est qu'une aide changera ce choix plusieurs matins de suite, sans augmenter les appels à tort. Si une liste triée suffit, l'aide n'est pas un assistant.

Non-objectif : le SMS au client et le classement des responsables ne sont pas dans ce sujet. L'un parle à la place du magasin, l'autre fait taire le signal d'erreur. « Expérience moderne » ne reste pas dans le texte.

Recommandation : un seul sujet, le brief du matin, à condition que l'heure du statut existe. Sinon, écran de la règle ou arrêt. Pas un dossier unique pour trois produits.

</details>

## Exercice 2 : La spec et l'évaluation

On vous propose cette spec : « L'assistant est toujours exact. Succès = note de satisfaction supérieure à 4 sur 5. On retire les mails transporteurs pour être sûrs qu'ils l'utilisent. Évaluation : vingt retards évidents, 100 % de bonnes réponses. » Réécrivez les trois métriques, le seuil, et ce que le jeu doit contenir. Dites ce que vous faites des mails.

<details>
<summary>Voir la solution</summary>

Vous barrez « toujours exact ». Les trois métriques : usage, ouvert avant 8 h 15 quatre matins sur cinq, hors jour de démo ; qualité perçue, au moins deux oui dans la semaine à « cela a aidé mon choix », pas une note sur 5 ; erreur inacceptable, au plus un retard inventé pour vingt briefs, zéro mélange, zéro donnée personnelle, avec suspension le jour même.

Le jeu de vingt retards évidents ne suffit pas. Il faut le créneau pas dépassé, le colis encore au magasin, le client déjà joint, le statut de plus de quarante-cinq minutes, le livré, l'annulé, le magasin voisin. L'attente est écrite avant. Les dix premiers matins, Inès ou Hugo relit les actions. L'écran du doute n'a pas de bouton.

Vous gardez les mails transporteurs. Les retirer force un usage faux et supprime le recours. Le message d'indisponibilité doit les citer.

</details>

## Exercice 3 : La promesse et les refus

La newsletter veut titrer : « Halte ne rate plus aucun retard, l'assistant prévient le client et montre quels magasins n'appellent pas assez. » Écrivez la phrase de remplacement, les refus, et la décision si deux transporteurs n'ont pas d'heure de statut.

<details>
<summary>Voir la solution</summary>

Phrase de remplacement : chaque matin ouvré, avant 8 h 15, le responsable voit les retards connus de son magasin et une action suggérée. Si le statut est trop ancien, la ligne ne propose rien. C'est lui qui appelle. Rien n'est envoyé au client.

Refus visibles dans l'écran : pas de message automatique, pas de classement des magasins, pas de « ne rate aucun retard ». Ces formules contredisent l'erreur acceptable et le droit de signaler une faute.

Sans heure de statut chez deux transporteurs du périmètre, vous ne lancez pas l'assistant sur leurs commandes, et vous ne signez pas la newsletter. Les lignes sans heure restent hors brief sûr, ou le sujet attend. Annoncer l'exactitude pour fournir le rassemblement n'est pas une décision de lancement. La ligne finale est : pas d'annonce tant que la phrase tenable n'est pas vraie sur les faits du matin.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Le brief, de bout en bout
center: "Opportunité, spec, évaluation, promesse. Une phrase tenable, ou le droit de ne pas lancer."
points:
  - icon: compass
    title: Opportunité
    text: "Le geste de Karim avant 8 h 15. SMS et classement restent dehors. Une recommandation, pas trois options molles."
  - icon: file
    title: Spec
    text: "Une page, un coût par matin, trois métriques. L'extension aux quarante n'est pas incluse en silence."
  - icon: test
    title: Évaluation
    text: "Cas difficiles, attente écrite avant, revue des dix matins, ligne grise sans bouton. Même seuil que la spec."
  - icon: chat
    title: Promesse
    text: "Retards connus, action suggérée, silence si statut vieux, Karim appelle. Jamais « toujours exact »."
  - icon: shield
    title: Refus
    text: "Pas de SMS, pas de note des magasins, pas de téléphone dans le brief. L'écran ne laisse pas le geste refusé."
  - icon: alert
    title: S'arrêter
    text: "Sans heure de statut, ou si la vitrine exige l'impossible, on n'annonce pas l'assistant. C'est un résultat."
pitfall: "Remplir les quatre jalons avec un assistant alors que la recommandation honnête était l'écran trié, ou l'arrêt."
remember: "Les jalons ne se contredisent pas. La phrase publique, le seuil d'erreur et la spec racontent le même produit."
```
