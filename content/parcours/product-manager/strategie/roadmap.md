---
title: "La roadmap maintenant, ensuite, plus tard"
description: "Tenir la roadmap de Halte en trois temps et en thèmes, montrer à Léa le résultat et le risque, et laisser à Camille le planning."
duration: 65
objectives:
  - "Ranger le produit en maintenant, ensuite et plus tard"
  - "Écrire des thèmes reliés à un outcome, pas un Gantt de dix-huit mois"
  - "Montrer au sponsor le cap, le refus et le risque ouvert"
  - "Passer à Camille le morceau « maintenant » sans lui céder le problème"
---

# Maintenant, ensuite, plus tard

Une roadmap produit dit dans quel ordre vous apprenez et vous élargissez. Elle ne dit pas quel jour chaque écran sera en production. Trois colonnes suffisent. **Maintenant** : ce que vous poursuivez dans la période en cours, assez petit pour qu'un samedi puisse vous donner tort. **Ensuite** : ce qui a du sens juste après, si le maintenant tient. **Plus tard** : ce qui sert la vision, et que vous refusez de dater.

Pour Halte, les trois colonnes parlent de la même promesse, à des échelles différentes. Pas de trois produits collés pour faire plaisir à trois directeurs.

**Maintenant.** Sur les magasins pilotes qui ferment à 19 h, avec un transporteur qui a déjà un signal : le responsable sait avant 17 h 30 si le camion passe avant la fermeture. Le client de ces pilotes ne voit une heure précise que si ce signal existe à temps. Sinon, il voit un créneau large que le magasin peut tenir. L'outcome : Karim n'appelle plus, et on ne ment pas sur l'heure.

**Ensuite.** Étendre cette règle aux magasins du même contexte, pas aux quais de nuit pour le job du samedi. Monter la part de commandes qui affichent un créneau avant paiement, sans ouvrir les huit transporteurs sans signal à coups d'heures inventées. C'est là que l'obligation du 1er septembre pèse : il faudra afficher quelque chose. Le quelque chose reste honnête. Camille dira si le calendrier de cette extension tient. Vous dites ce que l'extension signifie.

**Plus tard.** Traiter les transporteurs qui n'ont aucun signal, seulement si les créneaux des autres sont vraiment tenus. Resserrer la précision. Le dimanche, si un jour des magasins ouvrent et qu'une opportunité est écrite. Rien de cela n'a de date. Le mettre en juin de l'année prochaine, c'est faire semblant de savoir.

```diagram
type: pipeline
title: "Trois temps, une seule promesse"
lanes:
  - title: Maintenant
    steps:
      - title: Pilotes
        text: "Magasins qui ferment à 19 h, transporteur déjà lisible"
        tone: violet
      - title: Outcome
        text: "Savoir avant 17 h 30, sans heure inventée"
        tone: teal
  - title: Ensuite
    steps:
      - title: Même contexte
        text: "Étendre la règle, pas les quais de nuit pour ce job"
        tone: blue
      - title: Outcome
        text: "Le créneau avant paiement, large s'il le faut, tenu"
        tone: teal
  - title: Plus tard
    steps:
      - title: Pas de date
        text: "Transporteurs sans signal, précision, dimanche éventuel"
        tone: amber
      - title: Condition
        text: "Seulement si la promesse actuelle est vraiment tenue"
        tone: rose
```

Maintenant doit pouvoir échouer vite. Si vous y mettez les quarante magasins, les douze transporteurs et le dimanche, vous n'apprendrez rien avant des mois, et vous appellerez cela une roadmap. Ensuite doit être désirable et pas commencé. Plus tard doit être dicible, pour qu'on voie que vous n'avez pas oublié, et indatable, pour qu'on ne vous demande pas un avancement.

# Des thèmes, pas des lots datés

Dans chaque colonne, vous écrivez un thème et l'outcome, pas un lot. « Savoir avant la fermeture » est un thème. « Écran carte version 1, sprint 12, magasin 14 » est un lot. Le thème survit si le moyen change. Le lot, non. Quand Hugo apprend que le signal de Villeneuve arrive à 18 h 45, le thème reste : savoir avant la décision. Le lot « carte temps réel » tombe. La roadmap n'a pas à être réécrite de zéro. Le moyen, si.

Un thème tient en quatre lignes.

- Le nom, court, sans numéro de version.
- L'outcome qu'il sert (comportement ou résultat).
- La croyance que vous êtes en train de tester.
- Ce que le thème ne contient pas.

Pour « maintenant », la croyance est : un oui ou un non avant 17 h 30 remplace l'appel, sur un transporteur qui a vraiment un signal. Ce que ce n'est pas : les huit transporteurs aveugles, le dimanche, le tableau de coûts, une carte à explorer le soir.

Vous résistez à la demande de « juste une ligne de plus dans maintenant, c'est petit ». Le maintenant gonfle par politesse, jamais par stratégie. Trois thèmes dans maintenant, c'est trois manières de ne pas choisir. Vous n'en tenez qu'un. Les autres sont ensuite ou plus tard, ou hors roadmap si ce n'est pas le produit.

Camille a le droit de découper le thème « maintenant » en travaux, en dépendances, en jalons. C'est son métier. Ce découpage ne remonte pas dans la roadmap que vous montrez aux régions. Sinon les régions pilotent des lots, demandent à avancer un lot de « plus tard », et le thème disparaît. Vous lui donnez le thème, l'outcome, les pilotes, la règle de promesse (pas d'heure sans signal). Elle vous rend un chemin. Si son chemin montre que le maintenant ne peut pas être appris avant que l'obligation de septembre force l'affichage, vous ne truquez pas une date. Vous emmenez le conflit à Léa : que rétrécit-on (nombre de pilotes, précision de l'heure), et que refuse-t-on d'inventer ?

```video
url: https://www.youtube.com/watch?v=KPwRprJNt8E
title: "What is a Product Roadmap? | Examples and Overview"
channel: "ProductPlan"
duration: "3:40"
lang: en
why: "Ce qu'est une roadmap produit et ce qu'elle doit montrer, par ProductPlan."
```

# Ce qu'on montre au sponsor

Léa n'a pas besoin de dix-huit mois de barres. Elle a besoin de décider et de répéter. Vous lui montrez une page.

1. Les trois colonnes, thèmes et outcomes, pas les tâches.
2. La phrase de vision, pour que « plus tard » ne paraisse pas un oubli ni une promesse datée.
3. Pour qui ce n'est pas, en cinq lignes, les mêmes que dans la vision.
4. Le risque encore ouvert sur « maintenant » (par exemple : le signal existe-t-il vraiment avant 17 h 30 sur le transporteur du pilote ?).
5. La décision que vous lui demandez, s'il y en a une (accepter le créneau large comme réponse honnête à l'obligation), et ce que vous ne lui demandez pas (choisir la couleur de l'écran, tenir le budget à votre place).

Vous n'emmenez pas : le Gantt, la charge personne par personne, la consommation des 420 000 €, la liste des tickets. Ces pages existent. Camille les tient. Les poser devant les directeurs de région transforme la roadmap en négociation de dates. On vous demandera d'avancer « plus tard » en « maintenant » parce qu'une case est vide en juin. La case vide est le principe. Plus tard n'a pas de case.

> [!IMPORTANT]
> Ce que le sponsor doit pouvoir redire : le thème de maintenant, l'outcome, ce qu'on ne date pas. S'il redit une liste de fonctionnalités, la page était la mauvaise.

Vous montrez aussi ce qui ferait passer un thème de plus tard à ensuite. Pour les transporteurs sans signal : la promesse actuelle est tenue (le résultat de tenue ne se dégrade pas), et le reste des ratés vient clairement de ces tournées-là. Sans cette condition, « plus tard » glisse vers maintenant sous la pression, et vous recommencez à afficher des heures que Hugo ne peut pas connaître.

Le comité de région voit la même page que Léa, pas une version « simplifiée » qui remplace les outcomes par des icônes d'écrans. La simplification juste, c'est moins de mots. La simplification fausse, c'est changer de sujet. Léa ouvre. Vous expliquez le risque ouvert. Camille ne parle que si on lui demande ce que le chemin permet. Elle ne « vend » pas plus tard avec des dates pour calmer la salle.

# Ce que la roadmap ne promet pas

La roadmap promet un ordre et des outcomes. Elle ne promet pas que tout sera construit. Plus tard peut rester plus tard, ou sortir, si la vision se précise. Ensuite peut ne pas démarrer si maintenant a montré que la croyance était fausse. C'est une réussite de roadmap, pas un accident : vous avez appris avant de généraliser.

Elle ne promet pas des dates sur ensuite et plus tard. Dès que vous écrivez « carte transporteurs aveugles : mars prochain », vous avez créé un engagement que Camille devra tenir, et que les régions rappelleront. Si vous avez besoin d'une date, c'est sur la prochaine preuve du maintenant (« samedi 12, Villeneuve »), et cette date est une preuve, pas un lancement national. Camille la porte dans son planning. Vous la portez comme moment où la croyance peut tomber.

Elle ne promet pas un moyen. « Maintenant : la carte » est déjà trop précis si le signal est tardif. « Maintenant : savoir avant la fermeture » laisse Nora et Hugo libres du geste, dans la limite que vous avez fixée : avant 17 h 30, fiable, sans saisie de dix minutes.

Elle ne remplace pas l'OKR. L'OKR dit les résultats chiffrés de la période (savoir avant 17 h 30 sur les magasins du contexte, créneau montré, créneau tenu). La roadmap dit l'ordre des thèmes. Si vous n'aviez que la roadmap, vous pourriez enchaîner des thèmes sans jamais compter. Si vous n'aviez que l'OKR, vous ne sauriez pas ce que vous refusez de commencer. Les deux tiennent sur deux pages, cohérentes. Les chiffres de l'OKR ne se répartissent pas en dix-huit jalons mensuels. Ce travail-là, s'il fallait le faire, serait un planning, donc celui de Camille, et seulement pour le maintenant.

# Passer le relais sans céder le problème

Le relais vers Camille est un geste précis. Vous lui transmettez le maintenant : le thème, l'outcome, les magasins du contexte, la règle « pas d'heure sans signal avant 17 h 30 », le risque que le prochain samedi doit éclairer. Elle construit l'ordre des travaux, elle voit les dépendances (un transporteur, un magasin, une personne de Nora disponible le samedi), elle surveille l'enveloppe. Vous ne restez pas dans l'ombre pour réordonner ses tâches « parce que le produit ». Vous revenez si l'outcome ou la croyance change.

Elle vous transmet, elle, ce que le chemin révèle : un pilote impossible avant septembre, un transporteur qui ne tiendra pas la preuve, une charge qui oblige à choisir entre deux magasins. Vous décidez du produit (quel magasin apprend le plus, quelle promesse on retire). Léa décide des moyens si le chemin et le produit ne tiennent plus ensemble. Personne ne « ajuste la roadmap en silence » pour que les dates restent jolies.

Quand un directeur demande une date sur plus tard, la phrase est prête : « Nous ne la datons pas. Le thème est écrit pour qu'on ne l'oublie pas. Il ne commencera que si la promesse actuelle est tenue. Camille peut dire, elle, quand le pilote de maintenant nous aura appris quelque chose. » Puis vous vous taisez. Combler le silence par un mois inventé, c'est offrir un Gantt que vous passerez les mois suivants à défendre.

La roadmap a réussi sa semaine si un nouveau venu peut dire : ce qu'on apprend maintenant, ce qu'on fera juste après si ça tient, ce qu'on ne date pas, et qui tient le planning. Elle a échoué si le nouveau venu peut seulement réciter des fonctionnalités et des mois.

# Exercices

## Exercice 1 : Le Gantt de dix-huit mois

Camille, sous pression d'un directeur, vous demande de transformer la roadmap en Gantt : chaque thème, mois par mois, sur dix-huit mois, avec les huit transporteurs sans signal placés en mars. Que lui donnez-vous à la place, et que datez-vous vraiment ?

<details>
<summary>Voir la solution</summary>

Vous lui laissez le Gantt du maintenant, si elle en a besoin pour son métier : pilotes, preuve du samedi, règle de promesse. Vous ne transformez pas ensuite et plus tard en barres mensuelles. Placer les transporteurs sans signal en mars, c'est dater ce que vous avez promis de ne pas dater.

Ce que vous datez : la prochaine preuve, par exemple le samedi du pilote où l'on saura si Karim décide avant 17 h 30. Cette date est une date d'apprentissage. Elle peut figurer dans son planning. Elle ne devient pas un lancement des douze transporteurs.

</details>

## Exercice 2 : La page de Léa

Vous avez vingt minutes avec Léa avant le comité de région. Quels cinq éléments tenez-vous sur la page, et quel document laissez-vous à Camille ce jour-là ?

<details>
<summary>Voir la solution</summary>

Les trois colonnes avec thèmes et outcomes. La vision en une phrase. Pour qui ce n'est pas. Le risque ouvert sur maintenant. La décision demandée à Léa, s'il y en a une : le créneau large comme réponse honnête à l'obligation.

Vous laissez à Camille le suivi des 420 000 €, la charge et le Gantt détaillé. Elle les apporte si le comité pose une question de chemin. Vous ne les mettez pas sur votre page, sinon la conversation glisse vers des dates de « plus tard ».

</details>

## Exercice 3 : Une date pour « plus tard »

Un directeur dit : « Mettez juste “septembre prochain” sur les transporteurs sans signal, pour que la région voie qu'on s'en occupe. On ajustera. » Pourquoi refusez-vous, et quelle condition écrivez-vous à la place d'un mois ?

<details>
<summary>Voir la solution</summary>

Un mois écrit est un engagement. « On ajustera » n'efface pas le rappel, six mois plus tard, devant la même région. Vous aurez daté un thème dont la faisabilité n'est pas là.

À la place du mois, vous écrivez la condition : ce thème ne commence que si les créneaux déjà promis sont tenus, et si les ratés restants viennent de ces transporteurs-là. La région voit que le sujet existe. Elle ne reçoit pas une date fictive. Camille n'a rien à défendre en septembre prochain.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Maintenant, ensuite, plus tard"
center: "Trois thèmes reliés à un outcome. Plus tard s'écrit, il ne se date pas."
points:
  - icon: zap
    title: "Maintenant"
    text: "Pilotes, signal déjà là, savoir avant 17 h 30. Assez petit pour échouer samedi."
  - icon: rocket
    title: "Ensuite"
    text: "Même règle, même contexte, créneau honnête avant paiement. Pas une heure inventée."
  - icon: clock
    title: "Plus tard"
    text: "Transporteurs sans signal, précision, dimanche. Une condition, pas un mois."
  - icon: eye
    title: "La page sponsor"
    text: "Thèmes, outcomes, exclus, risque ouvert. Pas le Gantt ni les 420 000 €."
  - icon: link
    title: "Le relais"
    text: "Camille planifie le maintenant. Vous gardez le problème, l'outcome et la règle."
pitfall: "Poser un mois sur « plus tard » pour rassurer une région, puis passer l'année à défendre ce mois."
remember: "La roadmap promet un ordre et des résultats. Elle ne promet ni les dates lointaines, ni que tout sera construit."
```
