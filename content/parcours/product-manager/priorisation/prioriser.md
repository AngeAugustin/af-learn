---
title: "Prioriser ce qui change la promesse"
description: "Ordonner les demandes de Halte selon la valeur, l'effort, le risque et la dépendance, avec RICE et le coût du délai comme intuitions, et faire trancher les égalités par la sponsor quand l'argent ou le légal est en jeu."
duration: 55
objectives:
  - "Comparer une demande selon la valeur, l'effort, le risque et la dépendance"
  - "Utiliser RICE et le coût du délai comme des intuitions, pas comme une précision fausse"
  - "Proposer un ordre de résultat, et le tenir"
  - "Faire trancher par la sponsor une égalité qui engage l'argent ou le légal"
---

# La valeur ne suffit pas

Lundi matin, trois demandes arrivent en même temps. Inès, qui suit l'expérience client, veut un SMS dès que le camion est en retard : les réclamations tournent à 20 pour 1 000, et les clients appellent. Un directeur de région veut un créneau matin ou après-midi sur les quarante magasins : la promesse « dans la journée » lui semble trop large. Karim, à Villeneuve, veut un oui ou un non avant 17 h 30 : le magasin ferme à 19 h, et le samedi il garde Lina pour rien, ou il ferme et retrouve la marchandise sur le quai le lundi.

Les trois demandes sont sincères. Les trois parlent du client ou du magasin. Si vous les classez au volume de la voix, le SMS gagne, parce que les appels s'entendent. Prioriser, pour un product manager, c'est autre chose : **mettre devant ce qui augmente la part des commandes dont la promesse affichée est tenue**, et ce qui évite à Karim de décider à l'aveugle. Puis dire ce qui attend.

La valeur se lit là. Une commande web sur deux part sans date. Quand une date existe, elle est tenue dans 82 % des cas. Le retrait annoncé « prêt en deux heures » n'est prêt à temps que dans 61 % des cas. Le oui ou non avant 17 h 30 change un comportement que vous pouvez voir : Karim ne garde plus quelqu'un au hasard, et le client ne reçoit une heure précise que si le signal existe à temps. Le créneau fin sur quarante magasins peut aider plus tard, seulement si le créneau large est déjà vrai. Le SMS n'empêche pas l'heure fausse. Il la commente après coup. Sa valeur sur la promesse tenue est basse, même si la peine d'Inès est réelle.

> [!IMPORTANT]
> Une demande qui soulage un métier n'est pas automatiquement une demande qui change le résultat. Vous nommez les deux, et vous ne les additionnez pas.

# Effort, risque et dépendance

La valeur seule classerait tout ce qui touche le client au même rang. Trois autres questions séparent les demandes.

**L'effort** est une taille relative, dite par l'équipe, pas une note que vous inventez. Hugo, engineering manager, peut dire : un oui ou un non sur les pilotes dont le transporteur a déjà un signal se compte en jours. Le SMS est un canal nouveau, en semaines. Le créneau fin partout suppose un signal que huit transporteurs sur douze n'exposent pas. Jours, semaines, ou « ça bloque le reste » suffisent. Vous n'avez pas besoin d'une décimale.

**Le risque** est la chance de rendre la promesse pire. Annoncer un créneau matin partout, alors que la tenue est déjà incomplète, multiplie les heures fausses. Le SMS risque d'apprendre au client que la première annonce ne compte pas. Le oui ou non a un risque aussi : si le signal arrive trop tard, Karim verra « non » alors que le camion passe, ou l'inverse. Ce risque se voit sur Villeneuve, un samedi où la décision se pose. Il ne se voit pas en l'étendant d'abord aux quarante.

**La dépendance** dit ce qui doit exister avant. Le créneau fin dépend d'une heure déjà tenue. Le SMS dépend d'un retard que le magasin apprend souvent trop tard. Le oui ou non dépend d'un transporteur qui expose déjà un horaire, ce qui est vrai pour Villeneuve et faux pour huit transporteurs. Une demande dépendante d'un sujet non fait ne passe pas devant ce sujet.

| Demande | Valeur sur la promesse tenue | Effort | Risque | Dépendance |
|---|---|---|---|---|
| Oui ou non avant 17 h 30, pilotes qui ferment à 19 h et dont le signal existe | Haute | Bas à moyen | Limité, visible un samedi | Le signal de ce transporteur existe |
| Créneau honnête avant paiement, heure précise seulement si le signal est à temps | Haute, et liée au 1er septembre | Moyen | Moyen | La règle de ce qui est tenable |
| Créneau matin ou après-midi sur les quarante | Moyenne tant que le large ne tient pas | Haut | Haut | Un signal que huit transporteurs n'ont pas |
| SMS de retard | Basse sur la tenue, haute sur les appels | Haut | Le client se fie au SMS, plus à l'annonce | Un retard connu avant la peine |

# RICE et le coût d'attendre

RICE est un moyen de ne pas oublier une question. Ce n'est pas une machine à décider.

- **Portée** (Reach) : combien de commandes ou de magasins sont touchés dans le mois qui vient. Villeneuve et les pilotes du même contexte, ce n'est pas quarante. Ce n'est pas rien, si c'est là qu'on apprend.
- **Impact** : l'effet sur la promesse tenue, et sur la décision de 17 h 30. Haut, moyen, bas. Pas un pourcentage inventé.
- **Confiance** (Confidence) : est-ce qu'on l'a vu, ou est-ce qu'on le suppose. Vous avez le samedi de Karim, Lina gardée jusqu'à 19 h 40, le quai le lundi. Le SMS « qui fera baisser les appels » est une hypothèse.
- **Effort** : la taille relative donnée par Hugo.

Vous pouvez poser les quatre mots côte à côte. Vous ne publiez pas 12,4 contre 11,9. Cet écart n'existe pas dans les faits. Deux demandes dont les ordres de grandeur diffèrent se classent sans calcul. Deux demandes du même ordre restent une égalité. RICE ne la dissout pas.

Le **coût du délai** pose une autre question : que perd Halte si cette demande attend une semaine ? Attendre, c'est un samedi de plus où Karim décide sans savoir, et une semaine de moins pour apprendre avant le 1er septembre. Attendre pour le SMS, c'est une semaine d'appels qui existent déjà. Le légal ne bouge pas à cause du SMS. Le coût d'attendre n'est donc pas le même.

La contrainte du 1er septembre (afficher une date ou un créneau avant le paiement) n'est pas une ligne RICE parmi d'autres. C'est une condition pour vendre dans les règles. Vous ne la faites pas perdre à un score. Vous la placez devant, avec un créneau honnête, puis vous utilisez RICE pour ce qui reste. Afficher une heure inventée respecterait la lettre et raterait le produit.

```diagram
type: decision
title: "Égalité ou simple ordre"
nodes:
  - question: "Deux options se valent-elles, sans que l'équipe puisse faire les deux à temps ?"
    yes: "C'est une égalité. Préparez une comparaison sur une page."
    no: "Vous proposez l'ordre et vous le tenez."
  - question: "Trancher engage-t-il une dépense ou une obligation légale ?"
    yes: "La sponsor tranche. Vous ne signez pas à sa place."
    no: "L'ordre du résultat produit vous appartient."
```

```video
url: https://www.youtube.com/watch?v=pzyRafZJ-0M
title: "What is the RICE Scoring Model?"
channel: "ProductPlan"
duration: "4:04"
lang: en
why: "Le modèle de scoring RICE expliqué par ProductPlan : portée, impact, confiance et effort."
```

# Vous proposez, Léa tranche l'égalité

Votre livraison est un **ordre proposé**, pas une moyenne des avis.

1. Sur les pilotes qui ferment à 19 h et dont le transporteur a un signal : un oui ou un non avant 17 h 30.
2. Sur ces mêmes magasins : un créneau avant paiement, précis seulement si ce signal existe à temps, large sinon.
3. Le créneau fin partout, le SMS, et les huit transporteurs sans signal n'entrent pas tant que cette tenue n'est pas observée.

Vous le dites à Inès, au directeur, à Karim, à Hugo. Inès entend que les appels sont vrais, et que le SMS n'est pas le chemin de la promesse tenue. Le directeur entend que le créneau fin viendra après la preuve.

Une égalité, c'est deux options défendables, que l'équipe ne peut pas mener ensemble. Exemple : ouvrir un canal SMS payant, ou tenir l'affichage honnête avant paiement, alors qu'Hugo ne peut pas faire les deux avant septembre. L'une dépense. L'autre est le chemin de l'obligation du 1er septembre. Vous préparez une page : effet sur la promesse tenue, ce qu'on apprend un samedi, ce qu'on refuse. **Léa Morel, la sponsor, tranche.** Vous recommandez. Vous ne remplacez pas sa signature quand l'argent ou le légal est le vrai écart.

Si l'écart est un mot (« après fermeture » ou « trop tard ») et que ni l'argent ni le droit ne bougent, vous le réglez avec Inès. Remonter chaque synonymie, c'est demander à Léa d'être product manager à votre place.

Si Léa répond « faites les deux », elle n'a pas tranché. Vous montrez ce qui sort de l'ordre, souvent l'affichage honnête, et vous reposez la question. Vous n'ajoutez pas le SMS « en petit ».

> [!WARNING]
> Un score RICE ne couvre pas une obligation légale, et il ne remplace pas Léa quand la dépense ou le droit est le sujet. La formule range. Elle ne signe pas.

# Exercices

## Exercice 1 : Trois voix, un ordre

Inès insiste : les appels ont doublé, le SMS est « la seule chose que le client comprend ». Le directeur dit que sans créneau matin ou après-midi sur les quarante magasins, « ce n'est pas une vraie livraison ». Karim raconte le samedi où il a gardé Lina jusqu'à 19 h 40 pour un camion qui n'est pas venu. Hugo peut accompagner un seul de ces trois sujets dans les dix jours. Quel ordre proposez-vous, et pourquoi ?

<details>
<summary>Voir la solution</summary>

Vous proposez de commencer par le oui ou non avant 17 h 30, sur les pilotes qui ferment à 19 h et dont le signal existe déjà. La valeur est haute, l'effort est le plus bas, le risque se voit un samedi, et la dépendance est vraie. La confiance est haute : vous avez le quai du lundi.

Le créneau fin sur quarante magasins dépend de signaux que huit transporteurs n'ont pas, avec un risque d'heures fausses. Le SMS ne rend pas la promesse vraie. Vous le dites sans nier les appels. Les sujets refusés restent écrits comme « pas maintenant ».

</details>

## Exercice 2 : Le score qui ne dit rien

Un tableau vous donne 14,2 pour le SMS et 13,8 pour le oui ou non, parce que la portée du SMS est « tous les clients qui appellent » et que quelqu'un a mis une confiance de 80 % « au feeling ». Que faites-vous de ces deux nombres ?

<details>
<summary>Voir la solution</summary>

Vous les écartez comme décision. L'écart de 0,4 est une précision fausse. Vous revenez aux ordres de grandeur : impact sur la promesse tenue et sur la décision de 17 h 30, effort dit par Hugo, confiance appuyée sur un samedi vécu ou sur un souhait.

Vous pouvez garder les quatre mots de RICE pour vérifier qu'on n'a oublié ni la portée ni l'effort. Vous ne publiez pas le score. Si les deux demandes restent du même ordre, vous avez une égalité, pas un vainqueur à la décimale.

</details>

## Exercice 3 : Qui signe

Hugo ne peut pas, d'ici au 1er septembre, à la fois afficher un créneau honnête avant paiement sur les pilotes et brancher un SMS payant. Inès affirme que « le client vaut bien les deux ». Léa n'a pas encore vu le sujet. Que préparez-vous, et qui décide ?

<details>
<summary>Voir la solution</summary>

C'est une égalité de capacité. Elle touche une dépense (le canal) et l'obligation d'afficher une date ou un créneau avant paiement. Vous ne la tranchez pas seul, et vous ne demandez pas à Hugo de faire les deux le soir.

Vous préparez une page pour Léa : effet sur la promesse tenue, ce qu'un samedi apprendra, ce qui est refusé, et le fait que le 1er septembre concerne l'affichage honnête, pas le SMS. Vous recommandez l'affichage. Léa signe. Si elle dit « les deux », vous montrez que l'affichage sort du temps disponible, et vous reposez la question.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Prioriser la promesse
center: "Valeur, effort, risque, dépendance. RICE et le délai en intuition. Léa tranche l'argent et le légal."
points:
  - icon: target
    title: Valeur
    text: "Ce qui augmente la promesse affichée et tenue, et la décision de 17 h 30. Un SMS ne suffit pas."
  - icon: scale
    title: Quatre questions
    text: "Effort dit par Hugo, risque d'heure fausse, dépendance déjà vraie. Jours ou semaines, pas une décimale."
  - icon: gauge
    title: RICE
    text: "Portée, impact, confiance, effort. Un écart de 0,4 n'est pas une décision. Les ordres de grandeur suffisent."
  - icon: clock
    title: Coût du délai
    text: "Une semaine sans oui ou non, c'est un samedi de plus à l'aveugle. Une semaine sans SMS, ce sont des appels déjà là."
  - icon: key
    title: Qui tranche
    text: "Vous proposez l'ordre. Si la dépense ou le droit sépare deux options, Léa signe. Un synonyme ne se remonte pas."
pitfall: "Laisser un score RICE couvrir l'obligation du 1er septembre, ou ajouter le SMS en petit pour éviter Léa."
remember: "Vous ordonnez le résultat. La sponsor ne signe que l'égalité où l'argent ou le légal est vraiment en jeu."
```
