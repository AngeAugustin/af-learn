---
title: Relire une analyse avec un œil critique
description: "Appliquer une grille de relecture à l'analyse de quelqu'un d'autre : question, définition, grain, biais, graphique et recommandation proportionnée, sur un exemple fragile à démonter."
duration: 60
objectives:
  - Relire une note avec une grille stable, dans l'ordre, sans se laisser porter par le ton
  - Repérer une définition absente, un grain incohérent ou un biais qui porte la conclusion
  - Juger si le graphique et la recommandation sont à la hauteur de ce qui a été mesuré
  - Réécrire ce qu'il est encore possible d'affirmer une fois l'analyse fragile démontée
---

# Une grille, dans l'ordre

Relire, ce n'est pas chercher la phrase qui vous déplaît. C'est passer une **grille** toujours dans le même ordre, pour ne pas être impressionné par un pourcentage écrit gros. Six questions suffisent. Si l'une d'elles casse, les suivantes ne sauvent pas la note.

1. **Question.** Quelle décision ce texte est-il censé éclairer ? Si vous ne pouvez pas la reformuler, l'analyse n'a pas de cible. Elle a un thème.
2. **Définition.** Le taux a-t-il un numérateur, un dénominateur, une fenêtre, des exclusions ? « La conversion » n'est pas une définition.
3. **Grain.** Une ligne, un client, une session, un magasin ? Les totaux additionnent-ils des choses de même grain ?
4. **Biais.** Qui manque, qui a été choisi, quelles périodes sont alignées, a-t-on essayé vingt découpes ?
5. **Graphique.** Montre-t-il la comparaison annoncée, avec un axe et une population lisibles, ou décore-t-il une conclusion déjà écrite ?
6. **Recommandation.** Le geste proposé est-il plus petit ou plus grand que ce que les faits portent ?

```diagram
type: flow
title: Ordre de relecture d'une note
steps:
  - title: Question
    text: Quelle décision, pour qui, pour quand
    tone: violet
  - title: Définition
    text: Numérateur, dénominateur, fenêtre
    tone: blue
  - title: Grain et biais
    text: Qui est dans la table, qui a disparu
    tone: amber
  - title: Graphique
    text: La comparaison est-elle celle du texte
    tone: teal
  - title: Recommandation
    text: Le geste tient-il dans le périmètre mesuré
    tone: rose
```

Vous annotez dans la marge, factuellement : « dénominateur non dit », « sessions comparées à des clients », « recommandation enseigne entière, écart mesuré sur un device ». Vous ne commencez pas par « c'est nul ». Une relecture utile dit ce qui tient encore.

# Question, définition, grain

La question et la définition se jugent ensemble. Une bonne question avec un taux mal défini donne une fausse précision. Un taux propre qui répond à côté donne une belle annexe inutile.

Demandez-vous : si je devais recalculer le chiffre principal demain, sur la même période, est-ce que la note me suffit ? S'il manque la fenêtre (« conversion » sans dire session ou utilisateur, sans dire 1 jour ou 7 jours), la réponse est non. La note n'est pas relisible, même si l'auteur a raison dans sa tête.

Le grain se voit dans les additions. Moyenner des taux de magasins, sommer un montant déjà agrégé par semaine, comparer un **taux de sessions mobiles** à un **taux d'utilisateurs desktop** : à chaque fois, l'unité change en cours de phrase. Le symptôme dans le texte est le mot « globalement » collé à un calcul qui n'a pas de dénominateur commun.

> [!NOTE]
> Une analyse peut être intéressante et non actionnable. « Belle piste, définition à figer, pas de décision cette semaine » est une relecture honorable. Tout n'est pas à jeter, tout n'est pas à voter.

# Biais, graphique, proportion

Sur le biais, cherchez trois glissements, dans cet ordre parce qu'ils sont les plus fréquents dans les notes internes.

- **La population qui a choisi.** Les gens qui ont fini le tutoriel, qui ont répondu, qui ont le nouveau device. On les compare à « les autres » comme s'ils avaient été tirés au sort.
- **Le calendrier.** Une mise en production comparée à la semaine d'avant, qui était un férié, des soldes, ou une semaine incomplète.
- **Le tri.** Une région, un device, une famille, présentés seuls alors que le texte laisse entendre qu'on a surtout retenu ce qui baissait.

Le graphique se relit comme une phrase. Titre, axe, unité, période, ce qui est exclu. Un axe qui ne commence pas à zéro sur des barres de taux, deux axes pour forcer deux courbes à se superposer, un camembert de parts qui ne font pas le dénominateur du taux : ce sont des objections précises, pas des questions de goût.

La proportion se juge à la fin, quand le reste tient. Un écart de conversion **observé** entre mobile et desktop, sans test, peut justifier « aller voir le tunnel mobile ». Il ne justifie pas « couper l'application ». Le verbe de la recommandation doit pouvoir se recopier sous le tableau sans enfler.

# Un exemple fragile

Voici une note réelle dans sa forme, fictive dans les faits. Vous allez la démonter avec la grille. Ne corrigez pas encore : lisez-la comme si elle arrivait le jeudi à 18 h.

> **Objet : l'application mobile détruit la conversion, il faut la retirer des stores.**
>
> La conversion est de 2 % sur mobile et de 6 % sur ordinateur ce mois-ci. Le mobile fait donc trois fois moins bien. En outre, depuis le lancement de la nouvelle application en mars, le chiffre d'affaires total est inférieur à celui de février. Les utilisateurs de l'application sont surtout des clients peu fidèles (une seule commande), ce qui prouve que l'application attire un mauvais public. Nous recommandons de dépublier l'application avant l'été et de concentrer le budget sur le site ordinateur, qui convertit trois fois mieux. Le graphique en camembert ci-joint montre que le mobile pèse 70 % des sessions : c'est bien là qu'est le problème.

Aucun tableau de volumes n'accompagne la note. L'auteur ajoute à l'oral : « j'ai enlevé la semaine du Black Friday de l'an passé parce que ça faussait, et sur la région Sud le mobile est encore pire, à 1 %. »

# Démonter l'exemple

**Question.** La décision demandée est énorme : retirer l'application. La question implicite (« l'application cause-t-elle une baisse de conversion ? ») n'est pas celle que les chiffres calculent. Les chiffres comparent deux **devices** sur un même mois, pas l'existence de l'application contre son absence.

**Définition.** « Conversion » n'a ni numérateur ni dénominateur. Session, utilisateur, 1 jour, commande payée ? Un taux de 2 % de sessions n'est pas un taux de 2 % de clients. On ne peut pas refaire le chiffre.

**Grain.** 70 % des **sessions** sont mobiles. La recommandation parle de chiffre d'affaires et de clients. Les sessions mobiles sont plus nombreuses parce qu'on y revient souvent sans acheter, ou parce que le trafic s'y est déplacé. Sommer des sessions et conclure sur l'argent mélange les grains. Le camembert des sessions n'est pas un camembert du problème de marge.

**Biais.** Les publics ne sont pas tirés au sort. Les clients ordinateur, sur cette enseigne, sont plus souvent déjà connectés, déjà équipés d'un compte, déjà en train de finaliser un achat commencé ailleurs. Les « peu fidèles » sur mobile peuvent être des **nouveaux**, et les nouveaux ont toujours moins de commandes derrière eux : c'est la définition d'un nouveau, pas la preuve d'un mauvais public. Comparer février à mars ajoute un calendrier (longueur du mois, campagne, saison) et l'auteur a déjà avoué avoir retiré une semaine gênante et isolé la région Sud. C'est un tri.

**Graphique.** Le camembert dit la part des sessions, pas l'écart de conversion. Il ne montre ni le 2 %, ni le 6 %, ni février contre mars à jours comparables. Il illustre « le mobile est gros », ce qui n'est pas l'argument de causalité.

**Recommandation.** Même si l'écart 2 % contre 6 % était un vrai écart de qualité de tunnel, le geste proportionné serait : lire le tunnel mobile (où les gens partent), vérifier le paiement sur petit écran, instrumenter. Dépublier l'application supprime aussi les sessions qui achètent, et 70 % des sessions si le camembert dit vrai. Le geste est plus grand que la preuve, et la preuve ne porte pas la cause.

```diagram
type: compare
title: Ce que la note dit, ce que les chiffres portent
columns:
  - title: Ce qui est écrit
    tone: rose
    items:
      - L'application détruit la conversion
      - Le mobile fait trois fois moins bien
      - Elle attire un mauvais public
      - Il faut la dépublier
  - title: Ce qui est mesuré
    tone: teal
    items:
      - Deux taux dont on ignore le dénominateur
      - Deux publics qui n'ont pas été tirés au sort
      - Des nouveaux décrits comme peu fidèles
      - Une part de sessions, pas un effet causal
```

# Ce qu'il reste de vrai

Démonter n'est pas tout jeter. Après relecture, il reste un **signal**, pas une décision.

- Il existe un écart annoncé entre un taux mobile et un taux ordinateur. Avant d'agir, il faut la définition (commandes payées / utilisateurs identifiés, même fenêtre) et les volumes.
- Le poids des sessions mobiles est peut-être élevé. Cela rend le tunnel mobile **prioritaire à inspecter**, pas prioritaire à fermer.
- Février contre mars n'est pas exploitable en l'état. Il faudra une comparaison à jours équivalents, avec et sans l'application seulement si un vrai bascule existe (pays encore sans application, ou test).

La note de remplacement tient en quelques lignes. « Nous n'avons pas montré que l'application réduit le chiffre d'affaires. Nous avons un écart de taux entre devices, définition à confirmer, sur des populations différentes. Prochaine étape : funnel mobile sur les utilisateurs identifiés, et aucun retrait des stores tant que ce funnel n'est pas lu. La région Sud et la semaine retirée ne font pas partie de la conclusion. »

C'est cela, une revue critique : un signal conservé, une cause retirée, un geste ramené à la taille de la preuve.

# Exercices

## Exercice 1 : Appliquer la grille

Reprenez la note sur l'application mobile. Pour chacune des six cases (question, définition, grain, biais, graphique, recommandation), écrivez une objection d'une phrase, factuelle, que vous pourriez envoyer à l'auteur sans moquerie.

<details>
<summary>Voir la solution</summary>

Question : la décision « retirer l'application » exige un effet de son existence, alors que la note compare deux devices au même mois.

Définition : le mot conversion n'a pas de dénominateur (session ou utilisateur) ni de fenêtre, donc le 2 % et le 6 % ne sont pas reproductibles.

Grain : le camembert est en sessions, la décision est en chiffre d'affaires et en clients. Ces unités ne se substituent pas.

Biais : les acheteurs ordinateur et les utilisateurs mobiles ne sont pas des groupes tirés au sort ; qualifier les nouveaux de « mauvais public » parce qu'ils n'ont qu'une commande confond l'ancienneté et la qualité. Retirer une semaine et isoler la région Sud après coup est un tri.

Graphique : le camembert montre une part de sessions, pas l'écart de taux ni la comparaison février-mars à jours comparables.

Recommandation : dépublier est hors de proportion. Le geste qui tient dans le signal est d'inspecter le tunnel mobile, une fois la définition posée.

</details>

## Exercice 2 : Ce qui peut rester

L'auteur répond : « D'accord, je retire la demande de dépublication. Est-ce que je peux quand même écrire que le mobile convertit trois fois moins, donc qu'il est cassé ? » Que lui accordez-vous, et à quelle condition ?

<details>
<summary>Voir la solution</summary>

Vous n'accordez pas « trois fois moins » ni « cassé » tant que le dénominateur n'est pas le même et tant que les populations ne sont pas comparables. « Trois fois » dramatise un ratio de taux (6 / 2) qui peut venir du mix (des sessions de plus en plus légères sur mobile, des clients déjà décidés sur ordinateur).

Vous accordez ceci, si les chiffres se confirment : « Parmi les sessions de ce mois, le taux de commande annoncé est de 2 % sur mobile et de 6 % sur ordinateur. Les publics diffèrent. Cela justifie d'ouvrir le tunnel mobile, pas d'affirmer qu'il est cassé ni que l'application en est la cause. »

Condition : il réécrit avec la définition exacte, les volumes (nombre de sessions et de commandes), sans la région Sud isolée et sans la semaine retirée, ou alors ces choix sont affichés comme exploratoires.

</details>

## Exercice 3 : Une recommandation à la bonne taille

Le funnel, une fois proprement défini (utilisateurs identifiés, commande payée sous 7 jours), montre que 40 % des utilisateurs mobiles abandonnent à l'étape paiement, contre 15 % sur ordinateur, et que le paiement mobile échoue surtout sur un navigateur précis. Proposez la recommandation proportionnée, et une recommandation qui serait encore trop grande.

<details>
<summary>Voir la solution</summary>

Proportionnée : ouvrir un correctif du paiement sur ce navigateur, mesurer le taux d'échec avant / après sur cette étape, garder l'application en ligne. Prévenir le support. Ne pas annoncer un gain de chiffre d'affaires tant que le correctif n'est pas mesuré.

Encore trop grande : « refondre tout le site mobile », « couper l'acquisition mobile », « le mobile ne sait pas convertir ». Vous n'avez localisé qu'une étape et qu'un navigateur. Le geste suit cette localisation.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Relire une analyse fragile
center: "La grille d'abord : question, définition, grain, biais, graphique, puis seulement le geste."
points:
  - icon: list
    title: Six cases
    text: Toujours dans cet ordre. Une case cassée, la conclusion ne passe pas.
  - icon: ruler
    title: Définition
    text: Sans numérateur ni fenêtre, un taux de 2 % ne se refait pas.
  - icon: layers
    title: Même grain
    text: Sessions, clients et euros ne s'additionnent pas dans la même phrase.
  - icon: search
    title: Biais visible
    text: Publics auto-sélectionnés, calendrier, découpe choisie après coup.
  - icon: scale
    title: Proportion
    text: Un écart de tunnel justifie un correctif, pas une fermeture.
pitfall: Jeter toute la note, y compris le signal, parce que la recommandation était trop grande.
remember: Gardez le signal, retirez la cause non démontrée, ramenez le geste à la taille de la preuve.
```
