---
title: Demandes de changement
description: "Traiter une demande de changement par son impact sur le délai, le coût et le périmètre, dire qui approuve, oser refuser, et empêcher le périmètre de gonfler en silence."
duration: 50
objectives:
  - Exiger une demande écrite avant tout engagement de délai, de coût ou de périmètre
  - Chiffrer l'impact sur les six mois, l'enveloppe et la promesse
  - Dire qui approuve selon le seuil, et écrire un refus
  - Repérer les petits oui qui élargissent le projet sans passer par une demande
---

# Une demande n'est pas un accord

Une demande de changement est une proposition écrite. Ce n'est pas un oui en couloir, ni un « on en profite » dans une histoire déjà en cours. Tant qu'elle n'est pas acceptée par la personne qui a le droit de le faire, le périmètre reste celui qui a été signé : retrait du jour seulement avec stock confirmé, domicile sous quarante-huit heures, quatre pilotes puis les quarante magasins, six mois, 220 k€ hors salaires déjà budgétés.

La région Ouest veut la livraison à domicile **le jour même**. C'est une autre promesse : second passage transporteur, autre heure limite, autres jeux d'essai, autre discours d'Hugo. Karim peut trouver cela raisonnable. Un directeur peut l'annoncer en réunion de secteur. Rien de tout cela n'est un accord. Vous ouvrez une demande, vous ne laissez pas Julien l'estimer « entre deux » dans le sprint.

La demande tient sur une demi-page.

- Qui demande, et pour quel magasin ou quelle région.
- Le geste nouveau, en une phrase, comparé à la promesse actuelle.
- Ce qu'on saura si on dit oui (ce que le client verra).
- La date souhaitée, sans la prendre pour une date tenue.

Vous accusez réception le jour même. Le silence passe pour un oui dans beaucoup d'équipes. Chez Halte, le silence veut dire : pas commencé, pas promis.

# Délai, coût, périmètre

Toute demande se lit sur trois axes. En oublier un, c'est accepter sans le voir.

**Délai.** Le jour même domicile ne tient pas dans le sprint en cours, ni dans les six mois si on le ajoute aux quarante magasins. Le pilote glisse, ou la vague finale sort de la date. Vous le dites en semaines, pas en « un peu plus long ».

**Coût.** Second passage transporteur, hors des 220 k€ si on le généralise. Amina chiffre un ordre de grandeur avant l'arbitrage. « On verra la facture » n'est pas un impact. Si le chiffre n'est pas mûr, la demande attend, elle ne passe pas.

**Périmètre.** Nouvelle promesse, nouvelles histoires, nouveaux jeux (commande à 11 h, stock partiel, zone trop loin pour un retour le jour même). Ce n'est pas une option dans l'histoire du filtre. C'est un autre résultat.

Les trois bougent ensemble. Tenir la date et l'enveloppe impose de **retirer** autre chose si on ajoute le jour même : par exemple ne pas ouvrir les quarante magasins, seulement l'Ouest, et abandonner une autre histoire. Ajouter sans retirer, c'est décider en douce que les six mois ou les 220 k€ sautent.

```diagram
type: flow
title: De la demande écrite à la trace
steps:
  - title: Écrire
    text: "Qui demande, quel geste, quel écart avec la promesse"
    tone: blue
  - title: Chiffrer
    text: "Semaines, euros, histoires nouvelles, avant tout oui"
    tone: violet
  - title: Trancher
    text: "Claire si la promesse, la date ou l'enveloppe bouge"
    tone: amber
  - title: Tracer
    text: "Accepté, refusé ou échangé, avec le nom et la date"
    tone: teal
```

```diagram
type: decision
title: Qui peut dire oui à la demande
nodes:
  - question: "La demande change-t-elle la promesse, la date des quarante magasins ou l'enveloppe ?"
    yes: "Claire tranche, après un impact écrit sur les trois axes. Inès ne l'absorbe pas dans le sprint."
    no: "Inès et vous pouvez trancher dans le cadre déjà signé, et vous l'écrivez."
  - question: "Peut-on dire non sans casser le résultat déjà promis aux pilotes ?"
    yes: "On refuse par écrit. La suite éventuelle vit hors de ces six mois."
    no: "On propose un échange, on ajoute ceci seulement si l'on retire cela."
```

# Qui approuve, et ce qu'on refuse

Le droit de dire oui suit l'axe touché. Le flou « on en parle en équipe » produit des oui que personne n'assume.

- **Dans le cadre** (ordre des histoires déjà prévues, libellé d'un motif, ordre de deux magasins dans une vague sans changer la date) : Inès pour la promesse et le backlog, vous pour le calendrier des magasins. Vous vous informez, vous n'ouvrez pas un comité.
- **Hors cadre** (promesse nouvelle, date des six mois, euro au-delà de l'enveloppe, vague qui saute une région pour une raison politique) : Claire. Vous apportez l'impact et une recommandation. L'équipe ne s'auto-approuve pas une demande de directeur.
- **Le transporteur et l'éditeur** : aucun oui oral de Chloé ou de Nadia ne vaut engagement. Le contrat et le bon de commande passent par les achats. Vous le rappelez dans la demande.

Refuser est une décision, pas une impolitesse. Le jour même domicile **se refuse pour ces six mois**. Vous l'écrivez : « Demande Ouest du 3 mars, refusée par Claire le 10 mars. Motif : second passage hors enveloppe, pilote des quatre magasins pas encore recetté. Suite possible après clôture, pas un engagement. » La région peut être déçue. Elle n'est pas laissée dans le flou. Un refus flou (« on verra plus tard ») revient sous forme de promesse locale.

Vous pouvez recommander le refus et Claire peut dire oui. Dans ce cas, l'échange de périmètre s'écrit le même jour : quels magasins, quelle histoire sort du sprint, quel euro, quelle nouvelle date. Un oui sans échange est un dépassement, pas un arbitrage.

> [!WARNING]
> Un directeur qui annonce la nouvelle promesse en réunion n'a pas obtenu le changement. Tant que Claire n'a pas signé l'impact, vous démentez la date, calmement, par écrit, le jour même.

# Le périmètre qui gonfle en silence

Le gros changement se voit. Le petit oui ne se voit pas, et il mange le pilote. Karim ajoute « tant qu'on y est, on change l'étiquette prix » dans la fiche préparateur. Julien le fait, parce que c'est « deux heures ». Hugo demande un motif de plus, puis un canal de plus. Un magasin pilote veut son transporteur local. Aucune de ces lignes n'a de demande. Dans deux sprints, l'objectif du filtre a glissé, et personne ne sait dire quel oui l'a fait glisser.

Parade simple, dite au lancement et répétée par Marc dès qu'une histoire gonfle :

- Toute histoire nouvelle passe par Inès, même « deux heures ».
- Toute heure prise sur le sprint se voit dans la planification, pas dans un message du jeudi.
- Vous tenez une liste des petits oui refusés ou renvoyés. La montrer à Claire une fois par mois vaut mieux qu'un grand écart surprise.
- « Déjà commencé » n'est pas un argument pour officialiser. On peut arrêter une étiquette prix commencée sans demande.

Le test : si vous additionnez les petits oui, tiennent-ils encore dans les six mois et les 220 k€ ? Si vous ne savez pas les additionner, c'est qu'ils ne sont pas écrits. Vous les écrivez cette semaine, quitte à en arrêter trois.

Inès est votre alliée sur ce point, pas votre frein. Elle protège le backlog. Vous protégez la date et l'argent. Quand un petit oui touche les deux, vous le qualifiez ensemble en dix minutes, vous ne le laissez pas à l'appréciation de celui qui l'a codé.

```video
url: https://www.youtube.com/watch?v=4FwjP2WT4vI
title: "How to Prevent Scope Creep"
channel: "Online PM Courses - Mike Clayton"
duration: "10:02"
lang: en
why: "Mike Clayton explique comment éviter la dérive du périmètre, et le rôle d'un processus de demande de changement."
```

# Tenir la trace jusqu'à la clôture

Un registre des changements tient à côté du registre des risques. Colonnes : demande, demandeur, impact délai, impact coût, impact périmètre, décision (acceptée, refusée, échangée), décideur, date. Une demande sans décision depuis dix jours se revue. Elle ne reste pas « en réflexion » jusqu'à ce que l'équipe l'ait faite quand même.

À la clôture, cette liste est la mémoire du périmètre réel. Elle explique pourquoi le jour même n'est pas là, et pourquoi un libellé a changé. Sans elle, le projet semble avoir « mal livré » ce qu'il avait en fait refusé.

Vous en mettez une ligne dans la page sponsor quand une décision est en attente, pas les vingt refus déjà clos. Claire doit voir ce qu'on lui demande de trancher. Elle n'a pas besoin de relire les étiquettes prix que vous avez déjà arrêtées. Ces étiquettes restent dans le registre, pour le jour où quelqu'un dira « on avait dit oui ».

Le registre n'est pas une bureaucratie de plus si chaque ligne évite une heure d'équipe. Une demande orale non écrite coûte plus cher qu'une demi-page. Vous le montrez sur l'exemple Ouest : une page, un refus, le sprint du filtre intact.

# Exercices

## Exercice 1 : La région Ouest

Le directeur Ouest vous écrit : « On a dit en réunion que le domicile le jour même sortirait sur mes magasins en mai. Julien peut commencer. » Rédigez la demande et votre réponse du jour, sans accepter et sans mépriser.

<details>
<summary>Voir la solution</summary>

Réponse du jour : « Je n'ai pas d'accord de Claire sur cette promesse. Julien ne commence pas. J'ouvre la demande aujourd'hui, avec l'impact, pour un arbitrage. La promesse en cours reste le domicile sous quarante-huit heures et le retrait du jour avec stock confirmé. »

Demande : qui (directeur Ouest), geste (domicile le jour même sur sa région), écart (aujourd'hui J+2 seulement), conséquence client (un créneau de plus, un second passage). Vous ajoutez ensuite, avant l'arbitrage, les trois impacts : délai (le pilote et la vague des quarante ne tiennent pas si on l'ajoute sans retirer), coût (second passage, ordre de grandeur d'Amina, hors 220 k€ si on généralise), périmètre (nouveaux jeux, Hugo, transporteur). Recommandation : refus sur ces six mois, suite possible après clôture, rien annoncé aux magasins d'ici là.

</details>

## Exercice 2 : Le petit oui de l'étiquette

Karim a fait ajouter par Julien le changement d'étiquette prix sur la fiche des pilotes. « Deux heures, déjà fait, les magasins aiment. » Inès n'était pas au courant. Le filtre a pris du retard d'une journée. Que faites-vous de ce qui est déjà fait, et quelle règle répétez-vous ?

<details>
<summary>Voir la solution</summary>

« Déjà fait » n'officialise pas. Vous arrêtez la suite : pas d'extension aux autres magasins, pas de deuxième heure. Inès dit si l'étiquette déjà posée sur les pilotes reste ou si on revient en arrière. S'il faut deux heures de plus pour revenir en arrière et que l'étiquette ne gêne pas le filtre, elle peut la laisser comme réserve, écrite, hors promesse. Elle ne devient pas un nouveau standard.

Vous l'inscrivez au registre : demande absente, réalisé sans accord, arrêtée. Règle répétée en planification et par Marc : aucune histoire, même de deux heures, sans Inès. Une journée perdue sur le filtre se dit dans le feu du sprint, pas comme un détail. Vous ne faites pas le procès de Karim en comité. Vous fermez la porte.

</details>

## Exercice 3 : Oui, mais en échange

Claire veut accepter un essai de domicile le jour même sur **un** magasin pilote, pas sur la région. Amina estime 8 k€, dans l'enveloppe si rien d'autre ne bouge. Le sprint du filtre n'a plus de mou. Proposez l'échange écrit, ou le refus si l'échange est impossible.

<details>
<summary>Voir la solution</summary>

L'essai sur un seul magasin est un vrai changement (promesse, jeux, transporteur), même limité. Il peut tenir dans l'enveloppe (8 k€). Il ne tient pas dans le sprint en plus du filtre.

Échange à faire signer par Claire et Inès : l'essai démarre **après** la recette du filtre sur les quatre pilotes, sur un magasin nommé, deux semaines, 8 k€, jeux d'essai écrits avant. On retire de la vague suivante la formation élargie qui occupait Julien, ou on décale d'une semaine l'ouverture du cinquième magasin, au choix que vous chiffrez. Sans ce retrait, vous recommandez le refus : le oui ajouterait du périmètre au moment où le filtre n'a plus de mou.

La décision nomme le magasin, le plafond de 8 k€, la date de fin d'essai, et ce qui ne sera pas fait. Un essai sans date de fin devient la promesse Ouest par la petite porte.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Décider un changement
center: "Une demande écrite n'est pas un oui. On regarde le délai, le coût et le périmètre avant que quelqu'un annonce."
points:
  - icon: file
    title: Demande écrite
    text: "Qui, quel geste, quel écart avec la promesse. Le silence ne vaut pas accord. Julien n'a pas commencé."
  - icon: scale
    title: Trois impacts
    text: "Semaines, euros, histoires nouvelles. En oublier un, c'est accepter sans le voir."
  - icon: key
    title: Qui dit oui
    text: "Dans le cadre, Inès et vous. Promesse, date ou enveloppe : Claire. Pas le directeur en réunion."
  - icon: shield
    title: Le refus
    text: "Le jour même domicile se refuse pour ces six mois. Un refus écrit vaut mieux qu'un « on verra »."
  - icon: eye
    title: Petits oui
    text: "Deux heures d'étiquette prix mangent le filtre. Toute histoire nouvelle repasse par Inès."
pitfall: "Laisser un « déjà commencé » devenir le périmètre, puis découvrir que les six mois ont glissé sans décision."
remember: "Ajouter sans retirer, c'est décider que la date ou l'enveloppe sautera. Il faut l'écrire."
```
