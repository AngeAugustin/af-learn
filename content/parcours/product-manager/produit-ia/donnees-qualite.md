---
title: "Les données qui tiennent la promesse"
description: "Dire de quelles données le brief du matin dépend, quelle fraîcheur et quels droits il exige, et quels exemples cassent la promesse."
duration: 35
objectives:
  - "Lister les données sans lesquelles la décision du matin n'existe pas"
  - "Fixer une fraîcheur visible, pas une fraîcheur espérée"
  - "Interdire les données que le brief n'a pas le droit de montrer"
  - "Reconnaître un mauvais exemple qui rend la promesse fausse"
---

# De quelles données le brief dépend

Le cadrage a fixé la décision de Karim. Cette décision ne vit que si quelques faits sont là, à l'heure, pour le bon magasin. Votre rôle n'est pas de dessiner un entrepôt. Il est de dire **sans quoi le brief ment**, et donc ne doit pas s'afficher.

Pour une ligne du matin, il vous faut cinq faits, pas un dossier client.

- **Le magasin.** Celui de Karim, et aucun autre. Sans cela, le brief de Lille peut montrer Nantes.
- **La commande et le créneau promis.** Sans créneau, « en retard » ne veut rien dire. Une commande sans heure annoncée n'entre pas dans le brief.
- **Le statut transporteur**, avec des valeurs que le magasin comprend déjà : en préparation, en tournée, livré, échec. Un code interne non traduit n'est pas une donnée produit.
- **L'heure de ce statut.** C'est elle qui décide si la ligne a le droit d'être sûre.
- **Un drapeau, oui ou non : le client a déjà été joint** depuis hier 18 h. Pas le récit de l'appel. Le drapeau suffit pour choisir entre « appeler » et « confier à Hugo ».

Tout le reste est une tentation. Le nom complet, le téléphone, le commentaire libre du transporteur, le motif d'absence, l'historique d'achats. Karim peut ouvrir la commande dans la caisse s'il décide d'appeler. Le brief n'a pas à emporter la vie du client pour proposer une action.

> [!IMPORTANT]
> Une donnée qui n'aide pas l'une des trois actions n'entre pas dans le brief. Elle augmente le risque sans changer la décision.

Vous écrivez aussi ce qui fait **sortir** une commande de la liste : annulée, déjà livrée, créneau pas encore dépassé et pas menacé avant 10 h, magasin fermé ce jour. Une commande annulée hier qui reste « en retard » ce matin est une donnée pourrie, même si le texte est joli.

# La fraîcheur fait partie du produit

Une donnée vraie à 22 h peut être fausse à 8 h. Pour le brief, la fraîcheur n'est pas une qualité technique qu'on espère. C'est une règle que Karim voit.

Vous fixez **quarante-cinq minutes**. Si l'heure du statut est plus vieille, la ligne existe encore, en gris, avec la phrase « statut trop ancien, ouvrez la commande ». Aucune action n'est proposée. Le modèle n'a pas le droit de compléter le trou par une histoire plausible. Le trou est le message.

Pourquoi quarante-cinq, et pas « le plus frais possible » ? Parce qu'une formule vague ne se vérifie pas. À 8 h 10, un statut de 7 h 20 est encore utilisable. Un statut de 6 h 10 ne l'est plus pour dire « appelez ». Vous pouvez revoir le seuil après le pilote, avec des matins réels. Vous ne le laissez pas implicite le jour du lancement.

Le brief a aussi une heure de présence. Les faits doivent être prêts **avant 8 h 00**, pour que Karim lise avant 8 h 15. Un statut excellent qui arrive à 9 h 30 a raté la décision. Vous le dites à Sofia comme une contrainte produit : pas un souhait de confort, une condition pour afficher le brief. Si les statuts d'un transporteur n'arrivent qu'en fin de matinée, ses commandes restent incertaines. Vous ne les « estimez » pas.

| Âge du statut à 8 h 10 | Ce que le brief a le droit de faire |
| --- | --- |
| Moins de 45 minutes | Proposer une action, si le reste des faits est là |
| 45 minutes ou plus | Ligne grise, aucune action, lien vers la commande |
| Absent | La commande n'apparaît pas comme un retard sûr |
| Statut « livré » | La commande sort de la liste, même si le créneau était tendu |

Chloé vous dira que certains transporteurs mettent à jour quand ils peuvent. C'est une donnée de cadrage, pas une fatalité à maquiller. Le produit montre l'incertitude. Il ne la transforme pas en retard pour que la liste paraisse complète.

# Les droits, avant le texte envoyé

Chaque fait envoyé au modèle, ou simplement affiché, est un choix de droit autant que de confort. Le responsable de magasin a une raison de voir les commandes de son magasin. Il n'a pas une raison de recevoir, dans un résumé, le téléphone, l'adresse complète, ou une note médicale glissée dans un commentaire.

Vous interdisez trois familles, par écrit, avant que quiconque colle un export dans un essai.

**Les identifiants directs du client.** Nom complet, téléphone, e-mail, adresse. Le numéro de commande suffit à retrouver la fiche si Karim décide d'appeler. Le brief travaille avec ce numéro et le créneau.

**Le commentaire libre.** « Cliente enceinte », « chien méchant », « a crié hier ». Ces phrases ne sont pas des statuts. Elles sortent du cadre, elles voyagent, elles biaisent l'action. Si un motif opérationnel compte vraiment (accès immeuble, pas de digicode), il a une case structurée, pas une phrase recopiée.

**Les données d'un autre magasin, et les données d'un autre but.** Le brief de Karim ne sert pas à comparer les responsables, ni à alimenter une relance marketing. Un export « tant qu'on y est » est un changement de produit. Il se refuse.

Inès et vous relisez cette liste avec une question simple : si ce texte était lu à voix haute en magasin, devant un client, serait-il encore acceptable ? Si non, il n'entre pas dans le brief, même « pour aider le modèle ».

```diagram
type: layers
title: "Ce qui a le droit d'alimenter une ligne"
layers:
  - title: Décision
    text: "Appeler, repasser, ou confier à Hugo, avant 8 h 15."
    items:
      - "Sans cette décision, aucune donnée n'est utile"
  - title: Faits permis
    text: "Magasin, commande, créneau, statut, heure du statut, drapeau déjà joint."
    items:
      - "Cinq faits, pas un dossier"
  - title: Fraîcheur
    text: "Plus de 45 minutes : ligne grise, pas d'action."
    items:
      - "Prêt avant 8 h 00, sinon on ne promet rien"
  - title: Interdit
    text: "Nom, téléphone, commentaire libre, autre magasin."
    items:
      - "La caisse sert si Karim doit appeler"
```

Le droit ne se rattrape pas par une phrase en bas de page. Si le commentaire libre est dans le texte envoyé, le mal est fait, même si l'écran de Karim ne le répète pas. Vous coupez la source, vous ne demandez pas au modèle d'être discret.

# Les exemples qui cassent la promesse

Un mauvais exemple n'est pas une anecdote. C'est un cas où les données, telles quelles, rendent la promesse fausse. Vous en tenez une liste courte, et vous refusez de lancer tant qu'un de ces cas peut s'afficher comme un retard sûr.

**Le mauvais magasin.** Une commande de Nantes dans le brief de Lille. La donnée « magasin » a été ignorée, ou le filtre est faux. Promesse cassée, brief coupé.

**Le déjà livré.** Statut livré à 7 h 02, encore proposé à l'appel à 8 h 10. On a gardé un retard de la veille au lieu de croire le statut frais. Karim appelle pour rien.

**L'annulée d'hier.** La commande n'existe plus. Elle reste dans un fichier du soir. Le brief raconte un retard fantôme.

**Le statut d'hier soir, habillé en fait du matin.** Heure à 22 h 10, phrase sûre à 8 h 05. La fraîcheur n'a pas été appliquée. C'est le cas que la ligne grise doit absorber.

**Le commentaire qui devient une consigne.** « Livrer avant 9 h, cliente fragile » recopié comme raison d'appeler. Vous n'avez pas le droit d'utiliser cette phrase, et vous n'avez pas vérifié qu'elle est vraie. L'exemple est mauvais même si l'intention était gentille.

**Le drapeau manquant.** Le client a appelé Hugo à 7 h 50, et le brief dit encore « appeler ». Le drapeau « déjà joint » n'était pas là, ou pas à jour. L'action est alors interdite : sans drapeau frais, on ne propose pas « appeler », on propose « confier à Hugo » ou on se tait. Vous choisissez cette règle et vous la tenez. Mieux vaut un passage à Hugo qu'un double appel.

Vous montrez ces six cas à Léa sans jargon. Ce ne sont pas des défauts du modèle. Ce sont des données qui, si on les laisse passer, font mentir la phrase qu'elle s'apprête à signer. Un bel essai sur trois commandes faciles ne prouve rien. Un matin avec une annulée, un statut vieux et un mauvais magasin prouve si le produit tient.

> [!WARNING]
> Un exemple « pour voir » qui contient un téléphone ou un commentaire libre n'est pas un brouillon innocent. C'est déjà un usage que vous avez interdit.

# Exercices

## Exercice 1 : L'export généreux

Nadia propose d'ajouter au brief le nom, le téléphone et le dernier commentaire transporteur, « pour que Karim n'ouvre pas la caisse ». Le commentaire du jour dit : « client agressif, ne pas rappeler ». Acceptez-vous ces trois ajouts ?

<details>
<summary>Voir la solution</summary>

Vous refusez les trois. Le nom et le téléphone ne servent pas à choisir l'action : si Karim décide d'appeler, la caisse a la fiche. Les mettre dans le brief élargit le droit sans changer la décision.

Le commentaire libre est pire. « Client agressif » n'est pas un statut, peut être faux, et oriente le geste. Vous ne le recopiez ni à l'écran ni dans le texte envoyé au modèle. Le seul signal humain permis est le drapeau oui ou non « déjà joint ». S'il est oui, l'action n'est pas « appeler ».

</details>

## Exercice 2 : Le statut de 6 h

À 8 h 12, une commande a un créneau 7 h-9 h et un statut « en tournée » horodaté à 6 h 05. Le modèle propose « appeler », avec une phrase convaincante. Que doit montrer le brief, et pourquoi ?

<details>
<summary>Voir la solution</summary>

Le statut a plus de quarante-cinq minutes. Le brief n'a pas le droit d'être sûr. La ligne reste visible, en gris, avec « statut trop ancien, ouvrez la commande », et sans action.

La phrase convaincante est exactement ce que la règle de fraîcheur empêche. Un créneau dépassé ne transforme pas un statut de 6 h 05 en fait de 8 h 12. Karim ouvre la commande s'il veut en savoir plus. Le produit a tenu sa promesse en se taisant.

</details>

## Exercice 3 : La livrée et l'annulée

Dans un jeu d'essai, deux lignes sortent : une commande livrée à 7 h 40 encore marquée « appeler », et une commande annulée hier soir encore listée comme retard. Classez ces cas. Faut-il « améliorer le modèle », ou changer ce que le produit accepte en entrée ?

<details>
<summary>Voir la solution</summary>

Les deux cassent la promesse, et les deux se traitent avant le modèle. Une commande livrée sort de la liste. Une commande annulée n'est plus un retard. Si elles apparaissent comme des actions sûres, la règle d'entrée n'est pas tenue.

Vous ne demandez pas au modèle d'être plus prudent sur des lignes qui n'auraient pas dû lui être soumises. Vous corrigez le produit : ces statuts sont exclus. Ensuite seulement, vous regardez les cas ambigus que la règle a le droit de lui laisser.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Données, fraîcheur, droits
center: "Cinq faits, quarante-cinq minutes, aucun commentaire libre. Sans cela le brief ment, donc il se tait."
points:
  - icon: database
    title: Cinq faits
    text: "Magasin, commande, créneau, statut, heure du statut, plus le drapeau déjà joint. Pas le dossier client."
  - icon: clock
    title: Fraîcheur
    text: "Au-delà de 45 minutes, ligne grise et aucune action. Les faits doivent être prêts avant 8 h 00."
  - icon: lock
    title: Droits
    text: "Pas de nom, pas de téléphone, pas de commentaire libre. La caisse suffit si Karim décide d'appeler."
  - icon: alert
    title: Mauvais exemples
    text: "Mauvais magasin, déjà livré, annulée, statut d'hier soir, note personnelle recopiée. La promesse tombe."
  - icon: filter
    title: Entrée
    text: "Livré et annulé sortent avant le modèle. On ne lui demande pas de réparer une liste interdite."
pitfall: "Enrichir le brief avec le téléphone et le commentaire « pour éviter d'ouvrir la caisse »."
remember: "Une donnée qui ne change pas l'une des trois actions n'entre pas. La fraîcheur se voit, elle ne se devine pas."
```
