---
title: "La discovery continue"
description: "Tenir ouverts les risques de valeur, d'usage, de faisabilité et de viabilité sur Halte, sans transformer la discovery en phase que l'on clôture."
duration: 60
objectives:
  - "Nommer les quatre risques d'un pari produit sur la livraison Halte"
  - "Associer une preuve simple à chaque risque encore ouvert"
  - "Refuser de clôturer la discovery comme si elle était une phase"
  - "Apporter à Léa le risque qui reste dangereux, pas un dossier fermé"
---

# Quatre risques avant de construire

Vous avez le droit de construire. Vous n'avez pas le droit de construire pour découvrir, trop tard, que la question importante n'a jamais été posée. Avant de charger l'équipe d'Hugo, vous nommez quatre risques. Chacun peut tuer le produit même si les trois autres sont verts.

**Le risque de valeur.** Est-ce que le problème vaut vraiment qu'on y passe les prochains mois, et est-ce que les gens choisiront cette réponse plutôt que leur habitude ? Sur Halte, les réclamations existent : 20 pour 1 000. Cela prouve un agacement. Cela ne prouve pas que le sujet du samedi, à Villeneuve, est celui que les quarante magasins paieraient de leur temps.

**Le risque d'usage.** Même un problème réel rate si la personne ne peut pas s'en servir dans la situation vraie. Karim, le samedi, a les mains prises. Un écran qui demande une minute d'attention à 17 h 20 ne sera pas utilisé. Il appellera le transporteur, comme avant.

**Le risque de faisabilité.** Hugo peut-il obtenir l'information à temps ? Quatre transporteurs exposent un horaire d'arrivée. Huit n'en exposent aucun. Promettre une heure précise pour les douze, c'est ignorer ce risque. Le traiter, ce n'est pas écrire le code à sa place. C'est borner la promesse à ce qu'on peut savoir.

**Le risque de viabilité.** Halte peut-elle vivre avec cette réponse ? L'obligation du 1er septembre demande une date ou un créneau avant paiement. Une heure inventée respecterait la lettre et casserait la confiance. Un créneau large, tenable par le magasin, peut respecter les deux. La marge, le temps d'équipe le samedi soir, le droit : ce sont des questions de viabilité. Le suivi des 420 000 €, lui, reste le travail de Camille. Vous ne transformez pas ce chapitre en cours de budget.

```diagram
type: decision
title: "Quel risque de Halte est encore ouvert ?"
nodes:
  - question: "Le problème revient-il assez souvent pour mériter les prochains mois ?"
    yes: "Le risque de valeur baisse. On garde la fréquence écrite, pas une impression."
    no: "On ne choisit pas une solution. On retourne voir un samedi réel."
  - question: "Karim peut-il s'en servir à 17 h 20, les mains prises ?"
    yes: "Le risque d'usage baisse pour ce geste-là, dans ce magasin-là."
    no: "Nora reprend le geste. On ne déclare pas le sujet compris."
  - question: "A-t-on un signal d'arrivée avant l'heure de la décision ?"
    yes: "La faisabilité tient pour ce transporteur. Pas pour les douze."
    no: "On n'affiche pas une heure inventée. Le créneau large reste la règle."
```

Un risque n'est pas une peur rédigée en langage mou. C'est une question à laquelle vous pouvez encore répondre « je ne sais pas ». Tant que la réponse est « je ne sais pas », le risque est ouvert.

# La valeur et l'usage

Ces deux risques se ressemblent en réunion, parce que les deux finissent par la phrase « les magasins n'adhèrent pas ». Ils ne se traitent pas de la même façon.

Le risque de valeur se regarde avant de polir l'écran. Questions utiles : à quelle heure la peine arrive-t-elle, combien de samedis par mois, que fait la personne à la place, que lui coûte l'habitude ? Si Karim ne garde quelqu'un que deux ou trois samedis par mois, le sujet est réel mais borné. Si un magasin de centre-ville a une équipe de nuit et ne se pose jamais la question, il n'a pas ce problème. Générer une application « pour les quarante » avant d'avoir vu cette différence, c'est parier la valeur sur un slogan.

Le risque d'usage se regarde dans le geste, pas dans l'opinion. Vous ne demandez pas à Karim s'il « aimerait une application ». Vous regardez s'il peut répondre à sa question en dix secondes, debout, sans formation. Nora conduit cette observation. Vous en tirez la conséquence produit : si le geste rate, on ne déclare pas que « la valeur n'y est pas ». On dit que l'usage n'est pas là. Construire un deuxième écran par-dessus un geste raté n'enlève pas le risque.

| Risque | Question Halte | Preuve qui le baisse | Preuve qui ne compte pas |
| --- | --- | --- | --- |
| Valeur | Le samedi sans nouvelle du camion coûte-t-il assez souvent ? | Deux à trois samedis par mois, heure d'équipe ou marchandise sur le quai | « Les directeurs sont enthousiastes » |
| Usage | Le responsable peut-il s'en servir à 17 h 20 ? | Il décide sans appel, les mains prises | Une démo applaudie au siège, le mardi |

Inès peut vous dire que les clients détestent l'absence de date. C'est un indice de valeur côté client : une commande sur deux part sans date, et 18 % des dates affichées sont manquées. Cet indice ne ferme pas le risque d'usage du magasin. Ce sont deux scènes différentes. Vous les écrivez séparément, sinon vous « résoudrez » les deux avec un seul écran, et vous n'aurez testé ni l'une ni l'autre.

# La faisabilité et la viabilité

Hugo n'est pas un mur. Il est la personne qui vous empêche de vendre une heure que personne ne connaît. La faisabilité de Halte, aujourd'hui, tient en une frontière : quatre transporteurs peuvent donner un signal avant la décision de 17 h 30, huit ne le peuvent pas. Votre décision produit n'est pas « on branchera les douze ». Elle est : on n'affiche une heure précise que lorsqu'un signal permet de la tenir. Pour le reste, on affiche un créneau assez large pour que le magasin le tienne, jamais une heure décorative.

Cette frontière est révisable. Si un cinquième transporteur ouvre un signal, la faisabilité bouge, et la promesse peut se resserrer pour ses tournées. Tant qu'il ne l'a pas fait, élargir la promesse est un vœu. Vous le notez comme risque ouvert. Vous ne le planifiez pas à la place de Camille, et vous ne demandez pas à Hugo d'estimer une intégration « pour la beauté du slide ».

La viabilité est l'endroit où la contrainte de Léa rencontre le résultat. Au 1er septembre, une date ou un créneau doit apparaître avant le paiement. Si vous n'affichez rien, Halte manque l'obligation. Si vous affichez une heure fausse pour les huit transporteurs sans signal, vous tenez l'obligation et vous augmentez les réclamations. Le produit viable est celui que l'enseigne peut assumer : un créneau honnête, parfois large, plutôt qu'une précision menteuse. Léa doit entendre ce choix. Ce n'est pas un détail d'interface. C'est la condition pour que le résultat et la contrainte puissent vivre ensemble.

D'autres questions de viabilité existent, et vous les posez sans ouvrir un registre de risques projet. Garder quelqu'un jusqu'à 19 h 40 coûte une heure d'équipe : le produit qui évite cette heure a un sens pour le magasin. Un produit qui demande à Karim dix minutes de saisie chaque samedi n'est pas viable, même s'il est « complet ». Le droit sur les données des livreurs, s'il apparaît, se traite avec les personnes dont c'est le métier. Vous ne le balayez pas, et vous n'en faites pas un chapitre technique.

> [!WARNING]
> Un risque de faisabilité traité par une promesse plus belle est un risque de viabilité en préparation. L'heure affichée sans signal se paie en réclamations.

```video
url: https://www.youtube.com/watch?v=l7-5x0ra2tc
title: "Introduction to Modern Product Discovery - Teresa Torres"
channel: "Productized"
duration: "36:45"
lang: en
why: "Teresa Torres présente la discovery produit moderne et ses habitudes continues."
```

# Une discovery qui ne se ferme pas

La discovery est le travail qui réduit ces risques. Ce n'est pas une phase de six semaines avec une diapositive finale « discovery clôturée ». Le jour où vous clôturez, vous décidez d'arrêter d'apprendre. Halte n'a pas ce luxe. Les transporteurs changent, les samedis ne se ressemblent pas, et un écran livré peut rater le geste.

Vous continuez, avec une discipline. Chaque semaine, vous nommez **un** risque encore ouvert, et la plus petite preuve qui le ferait baisser. Pas quatre études en parallèle pour avoir l'air sérieux. Une question.

Exemples de preuves petites, sur Halte :

- Valeur : cinq responsables de magasins qui ferment à 19 h racontent leur dernier samedi. Vous comptez combien de fois la décision de garder quelqu'un s'est posée en mars.
- Usage : sur un samedi pilote, Karim utilise le signal sans Nora à côté de lui. Vous notez s'il a appelé le transporteur quand même.
- Faisabilité : Hugo confirme, sur un transporteur, l'heure à laquelle le signal existe vraiment. Pas l'heure de la plaquette.
- Viabilité : Léa dit si un créneau large, affiché avant paiement, répond à l'obligation du 1er septembre mieux qu'une heure précise fausse.

Après la mise en ligne, la discovery ne s'arrête pas. Si les six pilotes ont l'écran et que Karim l'ouvre à 18 h 40, trop tard pour décider, vous venez d'apprendre quelque chose. Ce n'est pas un échec de « la phase de discovery ». C'est la discovery qui continue, parce que le risque d'usage était encore ouvert. Vous le rouvrez explicitement. Vous ne le cachez pas dans un bilan de tickets.

Ce que vous ne faites pas : relancer chaque lundi une exploration sans question, « pour rester proches des utilisateurs ». La continuité n'est pas une agitation. C'est un risque nommé, une preuve, une décision. Quand la preuve baisse le risque, vous construisez un peu plus. Quand elle le confirme, vous changez le problème ou la promesse. Quand elle ne dit rien, vous ne déclarez pas le sujet compris.

# Ce que vous emmenez à Léa

Léa n'a pas besoin d'un dossier de quarante pages qui « ferme » la recherche. Elle a besoin de savoir où le pari peut encore casser, et ce que vous ferez la semaine prochaine pour le voir.

Vous lui apportez quatre lignes, pas davantage.

1. Le problème en cours, en une phrase, sans nom d'écran.
2. Le risque encore ouvert, un seul, avec la preuve de la semaine.
3. La conséquence si ce risque se confirme (par exemple : on n'affiche pas d'heure pour ce transporteur).
4. Ce dont vous n'avez pas besoin d'elle, et la seule décision qui est la sienne (accepter le créneau large comme réponse à l'obligation, par exemple).

Camille est dans la pièce si la preuve change le chemin : un pilote de plus, un transporteur en moins, une semaine décalée. Elle met à jour le planning. Vous ne lui demandez pas de choisir le risque. Hugo est là si la preuve est technique. Nora est là si la preuve est un geste. La décision de continuer, de rétrécir la promesse ou de changer de problème reste la vôtre, devant Léa.

Une discovery saine se reconnaît à cette phrase, dite sans honte : « Nous ne savons pas encore ceci, et voici comment nous le saurons samedi. » Une discovery morte se reconnaît à l'autre phrase : « C'est validé, on passe en delivery. » Sur Halte, le delivery construit. Il n'éteint pas les questions.

# Exercices

## Exercice 1 : La phase qu'on veut clôturer

Camille vous demande une date de « fin de discovery » pour la poser sur son planning. Le comité aimerait une diapositive verte. Les huit transporteurs sans signal n'ont pas bougé, et aucun samedi pilote n'a encore eu lieu. Que lui donnez-vous, et que refusez-vous de dater ?

<details>
<summary>Voir la solution</summary>

Vous lui donnez la prochaine preuve, pas une fin. Par exemple : samedi prochain, à Villeneuve, on saura si Karim peut décider avant 17 h 30 sans appeler. Cette preuve a une date. Camille peut la mettre sur son chemin.

Vous refusez de dater une « fin de discovery ». Les risques ouverts (le signal des huit transporteurs, l'usage réel, le créneau large face à l'obligation) ne se ferment pas par une diapositive. Construire peut commencer sur le périmètre où le risque a baissé. Le reste reste une question, pas une case verte.

</details>

## Exercice 2 : Le mauvais risque

Après une démo au siège, un directeur dit : « La valeur est prouvée, tout le monde a applaudi. Passez à l'usage plus tard. » L'écran n'a jamais été ouvert un samedi. Quel risque a vraiment baissé, et lequel est intact ?

<details>
<summary>Voir la solution</summary>

Aucun des deux risques n'a baissé comme il le croit. Les applaudis du mardi ne sont pas une preuve de valeur : ils ne disent pas à quelle fréquence la peine existe, ni ce qu'elle coûte. Ils ne sont pas non plus une preuve d'usage.

Le risque d'usage est entièrement ouvert tant que Karim n'a pas fait le geste dans le magasin, à l'heure de la décision. Vous le dites ainsi, et vous proposez le samedi comme preuve. Vous ne « passez pas à l'usage plus tard » en construisant davantage sur une démo.

</details>

## Exercice 3 : Vendredi avec Léa

Vous avez une heure avec Léa. Hugo confirme que le transporteur de Villeneuve n'envoie son horaire qu'à 18 h 45. Le comité du 1er septembre approche. Quelles quatre lignes emportez-vous, et quelle décision est la sienne ?

<details>
<summary>Voir la solution</summary>

Le problème : le responsable doit savoir assez tôt si le camion passe avant 19 h. Le risque ouvert : la faisabilité de l'heure, puisque le signal arrive à 18 h 45, après la décision. La conséquence : on ne promet pas une heure précise sur ce transporteur. La décision de Léa : accepte-t-elle qu'un créneau large, honnête, réponde à l'obligation mieux qu'une heure affichée trop tard ?

Vous ne lui demandez pas de choisir un écran, et vous ne lui demandez pas de trancher le budget. Camille ajustera le chemin une fois ce choix de promesse fait.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "La discovery continue"
center: "Quatre risques restent des questions tant que vous n'avez pas une preuve, y compris après la mise en ligne."
points:
  - icon: scale
    title: "Valeur"
    text: "Le problème revient-il assez souvent pour mériter l'équipe, au-delà des applaudissements ?"
  - icon: eye
    title: "Usage"
    text: "Karim peut-il décider à 17 h 20, les mains prises, sans rappeler le transporteur ?"
  - icon: tool
    title: "Faisabilité"
    text: "Quatre transporteurs ont un signal. Huit n'en ont pas. On ne promet pas les douze."
  - icon: shield
    title: "Viabilité"
    text: "Un créneau large et honnête peut tenir l'obligation. Une heure fausse, non."
  - icon: loop
    title: "Pas une phase"
    text: "Chaque semaine, un risque nommé et une preuve. Jamais une diapositive de clôture."
pitfall: "Déclarer la discovery fermée après une démo au siège, avant le premier samedi dans le magasin."
remember: "On construit là où le risque a baissé. On laisse ouvert, par écrit, le risque qui peut encore casser la promesse."
```
