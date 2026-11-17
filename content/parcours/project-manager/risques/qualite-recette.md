---
title: Qualité et recette métier
description: "Bâtir la qualité pendant le sprint, recetter avec le métier avant d'ouvrir la vague suivante, écrire des jeux d'essai qui cherchent la panne, et savoir qui signe."
duration: 55
objectives:
  - Distinguer la qualité construite pendant le sprint et le contrôle de fin de vague
  - Rejouer les critères d'acceptation sans les réécrire le jour de la recette
  - Préparer des jeux d'essai qui cherchent le cas pénible, pas seulement le cas facile
  - Dire qui signe, et quelle réserve bloque l'ouverture des magasins
---

# Bâtir pendant, contrôler à la fin

La qualité de la promesse Halte ne se rattrape pas en mois 6. Si les quatre pilotes affichent des créneaux faux pendant trois sprints, la recette finale constatera le dégât. Elle ne l'empêchera pas. **Bâtir pendant**, c'est mettre le critère dans l'histoire, le rejouer avant la revue, et refuser de dire « terminé » sans cela. **Contrôler à la fin**, c'est la recette métier avant d'ouvrir la vague suivante de magasins. Les deux existent. Le second ne remplace pas le premier.

Pendant le sprint, Julien ne livre pas le filtre « à peu près ». Le stock à zéro se joue avant la revue. Hugo lit le motif avant qu'Inès accepte. C'est la définition de terminé, pas une faveur.

Avant d'étendre au-delà des quatre pilotes, une recette fige le geste : on rejoue les cas, on écrit les réserves, quelqu'un signe. Ouvrir les trente-six autres magasins sur la foi d'une démo interne, c'est parier l'enseigne. Vous tenez cette porte. Inès ne la franchit pas seule, le préparateur non plus, vous non plus.

```diagram
type: compare
title: Deux moments, deux questions
columns:
  - title: Pendant le sprint
    tone: teal
    items:
      - "Le critère est dans l'histoire avant de commencer"
      - "On le rejoue avant la revue"
      - "Inès n'accepte pas un filtre « à peu près »"
      - "Un magasin pilote voit la liste réelle"
  - title: Avant la vague suivante
    tone: amber
    items:
      - "Recette métier, jeux d'essai écrits"
      - "Réserves classées, bloquantes ou non"
      - "Signatures nommées, pas un silence"
      - "Sans accord, les trente-six magasins attendent"
```

# Le critère comme contrat

Le critère d'acceptation écrit au backlog est le contrat de la recette. On ne le durcit pas le matin de la séance pour piéger l'équipe, et on ne l'adoucit pas pour tenir le calendrier. S'il était faux, on le change **avant**, par Inès, et on dit ce que ça coûte (un sprint de plus, une réserve assumée).

Pour le filtre des pilotes, le contrat est déjà connu : stock du matin à zéro, magasin fermé le dimanche, commande après 16 h, motif dans la liste (stock, fermeture, transporteur complet). La recette coche ces lignes. Elle n'invente pas « et aussi la livraison offerte » ni « et le programme de fidélité ». Ces idées sont des demandes de changement, pas des surprises de recette.

Si un cas manque au contrat et qu'il est grave (le stock partiel : un article sur trois est à zéro), on l'ajoute comme réserve ou comme histoire, pas comme échec rétroactif. L'équipe n'avait pas à deviner. Vous notez le trou pour la définition de prêt du sprint suivant : les cas pénibles s'écrivent avant, pas en séance.

> [!IMPORTANT]
> Une recette qui réécrit les critères pour faire passer la vague ne protège pas les magasins. Elle protège le calendrier, une semaine. Les clients, eux, voient le créneau faux ensuite.

# Recette métier et jeux d'essai

La recette métier vérifie la promesse, pas seulement le tuyau. Nadia peut dire « le flux passe » et le client peut quand même réserver un article absent, si le site lit le mauvais stock. On recette le geste complet : ce que le client voit, ce que le préparateur fait, ce que Hugo dit au téléphone.

Les **jeux d'essai** cherchent la panne. Le cas facile (stock large, magasin ouvert, mardi 10 h) ne suffit pas. Il confirme que le chemin heureux existe. Il ne confirme pas la promesse.

Jeux minimaux avant d'ouvrir la vague :

- Stock du matin à zéro sur l'article commandé.
- Stock partiel : un article sur trois est à zéro, les deux autres sont là. La commande ne doit pas promettre les trois.
- Magasin fermé le dimanche.
- Commande passée à 16 h 05, après la fin de préparation.
- Transporteur complet sur la zone : le domicile J+2 disparaît, le motif est « transporteur », pas une phrase libre.
- Annulation : la liste du préparateur se met à jour, Hugo voit le même statut.

Chaque jeu a un résultat attendu, écrit avant la séance, et un témoin (capture, liste magasin, phrase exacte du motif). « Ça a l'air bon » ne se signe pas. Le jeu que personne n'a osé jouer (stock partiel, 16 h 05) est celui que le client trouvera samedi.

Karim organise le passage en magasin pilote. Un jeu seulement en salle, sur des données inventées par Julien, reste un essai technique. Il précède la recette. Il ne la remplace pas.

# Qui signe, et quelle réserve

Signer, c'est attacher son nom à une question précise. Tout le monde ne signe pas la même ligne.

- **Inès** signe la promesse client : ce qui s'affiche, les motifs, le périmètre des magasins.
- **Karim** signe le geste magasin : la liste est préparable, la fiche d'une page suffit aux quatre pilotes.
- **Hugo** signe l'explicabilité : il peut dire le motif sans rappeler le magasin.
- **Nadia** signe le flux sur les jeux, pas la promesse. Son accord technique est nécessaire et insuffisant.
- **Claire** ne rejoue pas les jeux. Elle autorise l'ouverture de la vague si les réserves bloquantes sont vides, ou si elle accepte explicitement une réserve que vous lui avez chiffrée.

Une **réserve bloquante** empêche l'ouverture. Exemple : le client peut encore prendre un retrait du jour sans stock. On n'ouvre pas les magasins suivants.

Une **réserve non bloquante** s'écrit, se date, ne retient pas la vague. Exemple : le libellé du motif est juste mais la phrase est sèche. Hugo peut travailler. Inès planifie le libellé au sprint d'après. Vous ne laissez pas une réserve cosmétique bloquer quarante magasins, et vous ne laissez pas une réserve bloquante passer « parce qu'on est en retard ».

Le compte-rendu de recette tient sur une page : date, jeux joués, résultat, réserves, noms. L'absence de signature n'est pas un accord tacite. Si Karim n'a pas pu venir, la recette magasin n'est pas faite.

> [!WARNING]
> « Validé par le projet » n'est pas une signature. On doit pouvoir dire qui a vu le stock à zéro, et qui a dit que la vague pouvait s'ouvrir.

# Ce qui ne remplace pas une recette

Quelques scènes ont l'air d'une recette. Elles n'en sont pas.

- La revue de sprint des pilotes est un contrôle en cours de route. Elle ne signe pas l'ouverture des trente-six autres.
- Une démo au comité, sur le cas heureux, montre un écran. Elle ne joue pas 16 h 05.
- Le silence de Claire après un compte-rendu flou n'est pas une autorisation. Vous redemandez un oui ou un non sur la réserve bloquante.
- Cocher « recette OK » dans un tableau, sans jeux ni noms, ne protège personne le jour où Nantes recommence.

Vous tenez le calendrier des recettes comme un jalon, au même titre que l'ouverture d'une vague. Recette des quatre pilotes, puis première vague, puis la suivante. Chaque vague a ses jeux sur un magasin de la vague, pas seulement la mémoire des pilotes. Un magasin dont la caisse diffère peut casser un flux que Nantes avait tenu.

Si un jeu bloquant échoue, la vague ne glisse pas en catimini. Vous le mettez en orange ou en rouge selon que la date des six mois tient encore, et Inès décide de l'histoire de correction. La qualité n'est pas un thème. C'est une porte.

# Exercices

## Exercice 1 : Le cas qu'on n'a pas joué

La recette des quatre pilotes a joué le stock large, un mardi matin. Tout le monde est soulagé. Personne n'a commandé à 16 h 05, ni un panier avec un article à zéro et deux articles disponibles. Inès veut signer. Qu'exigez-vous avant la signature ?

<details>
<summary>Voir la solution</summary>

Vous demandez de jouer les cas du contrat qui cherchent la panne, avant toute signature : stock à zéro, stock partiel (un article sur trois), dimanche fermé, commande à 16 h 05, transporteur complet, annulation. Le mardi matin au stock large ne prouve que le chemin heureux.

Inès ne signe pas tant que ces jeux n'ont pas un résultat écrit. Nadia peut confirmer le flux. Cela ne suffit pas. Si le stock partiel échoue, c'est une réserve bloquante : la vague suivante n'ouvre pas. Vous ne traitez pas l'oubli comme une formalité. Le client de samedi prendra le cas que la salle a évité.

</details>

## Exercice 2 : Réserve bloquante ou non

Deux réserves sortent de la séance. A. Le client peut encore afficher un retrait du jour quand le stock du matin est à zéro. B. Le motif « stock » est exact, mais Hugo le trouve trop sec et voudrait une phrase plus douce. Karim et Hugo sont prêts à signer le reste. Que bloque l'ouverture, et qui tranche la phrase ?

<details>
<summary>Voir la solution</summary>

A bloque. On n'ouvre pas la vague tant que le retrait du jour s'affiche sans stock. C'est le cœur de la promesse. Inès ne l'adoucit pas en séance pour tenir la date. L'équipe corrige, on rejoue ce jeu, ensuite seulement on reparle d'ouverture.

B ne bloque pas. Hugo signe quand même l'explicabilité : le motif est le bon, il peut téléphoner. La phrase plus douce devient une histoire du sprint suivant, écrite par Inès, pas une condition d'ouverture. Claire n'a pas à choisir l'adjectif. Elle doit savoir que A, s'il restait ouvert, empêcherait la vague. Vous l'écrivez dans le compte-rendu, avec les noms.

</details>

## Exercice 3 : Qui signe cette page

Rédigez les cinq lignes de signature d'une recette réussie des quatre pilotes, assez précise pour qu'on sache qui a vu quoi. Claire autorise ensuite la première vague au-delà des pilotes.

<details>
<summary>Voir la solution</summary>

« Jeux joués le 12 mai sur le magasin pilote de Nantes : stock à zéro, stock partiel, dimanche, 16 h 05, transporteur complet, annulation. Résultats conformes aux critères. Aucune réserve bloquante. Réserve non bloquante : libellé du motif à adoucir au sprint suivant, Hugo peut expliquer en l'état.

Inès signe la promesse affichée. Karim signe la liste préparable et la fiche d'une page. Hugo signe le motif explicable sans appel au magasin. Nadia signe le flux sur ces jeux, pas l'ouverture commerciale.

Claire autorise la vague suivante, informée de la réserve non bloquante. Sans la ligne de Claire, les magasins suivants ne s'ouvrent pas. Sans la ligne de Karim, la recette magasin n'a pas eu lieu. »

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Qualité et recette
center: "La qualité se joue pendant le sprint. La recette ouvre la vague suivante, avec des noms, pas avec un silence."
points:
  - icon: tool
    title: Pendant
    text: "Critère dans l'histoire, rejoué avant la revue. « À peu près » n'est pas terminé."
  - icon: test
    title: Jeux d'essai
    text: "Stock à zéro, stock partiel, dimanche, 16 h 05. Le mardi matin facile ne suffit pas."
  - icon: file
    title: Contrat
    text: "On recette les critères déjà écrits. On ne les invente pas pour faire passer la date."
  - icon: users
    title: Qui signe
    text: "Inès la promesse, Karim le magasin, Hugo le motif, Nadia le flux. Claire ouvre la vague."
  - icon: alert
    title: Réserve
    text: "Le créneau sans stock bloque. Une phrase trop sèche ne bloque pas. On l'écrit quand même."
pitfall: "Ouvrir les trente-six magasins après une démo du cas heureux, sans jeu et sans nom."
remember: "Une réserve bloquante ferme la porte. Une réserve cosmétique se planifie, elle ne retient pas l'enseigne."
```
