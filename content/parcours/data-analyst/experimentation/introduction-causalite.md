---
title: Introduction à la causalité
description: "Distinguer corrélation et causation, formuler le contre-factuel, reconnaître une variable confondante et savoir ce qu'un analyste peut affirmer après une expérience ou une simple observation."
duration: 60
objectives:
  - Formuler le contre-factuel d'une question métier en une phrase
  - Expliquer pourquoi une expérience aléatoire et une comparaison observée ne donnent pas le même droit de conclure
  - Repérer une variable confondante et la dessiner sur un graphe causal simple
  - Tenir un vocabulaire précis sur ce que l'analyse autorise à affirmer
---

# Corrélation n'est pas causation

Deux indicateurs bougent ensemble : c'est une **association**. L'un produit l'autre : c'est une **cause**, et vous ne l'avez presque jamais sous les yeux directement. Confondre les deux mène à des décisions coûteuses.

Exemple classique, version entreprise. Les villes où l'enseigne a ouvert un flagship ont un chiffre d'affaires régional plus élevé. Faut-il ouvrir des flagships partout pour « créer » ce chiffre ? Pas sur cette seule comparaison. Les flagships ont été ouverts là où la demande était déjà forte, là où le loyer se justifiait, là où la marque recrutait. La taille du marché cause à la fois l'ouverture et le chiffre. L'association est réelle. L'effet d'ouvrir un flagship à taille de marché égale n'est pas identifié.

Autre classique : plus une agence a de conseillers senior, plus la satisfaction client est haute. Il se peut que les seniors améliorent le service. Il se peut aussi que les agences déjà saines attirent les seniors et reçoivent les clients les plus faciles. Les données brutes ne départagent pas.

Le vocabulaire à tenir devant un comité :

- « est associé à », « coïncide avec », « prédit » : vous restez sur l'observation ;
- « a produit », « grâce à », « l'effet de » : vous prétendez une cause, et il vous faut un dispositif à la hauteur.

# Le contre-factuel

La question causale compare deux mondes dont un seul s'est produit. Le **contre-factuel**, c'est ce qui serait arrivé aux **mêmes** unités si le changement n'avait pas eu lieu.

« Les clients qui ont utilisé le chat ont un panier de 70 €, les autres de 45 €. » Le contre-factuel des utilisateurs du chat n'est pas « les autres ». C'est : quel aurait été le panier **de ces mêmes clients** s'ils n'avaient pas ouvert le chat ? Beaucoup l'ont ouvert parce que la commande était déjà grosse, ou parce qu'ils étaient perdus et allaient abandonner. Le groupe « sans chat » mélange des gens qui n'en avaient pas besoin.

Écrire le contre-factuel oblige à préciser trois choses.

1. **L'unité.** Client, session, magasin, semaine.
2. **Le traitement.** Ce qui change (voir le chat, recevoir le code, subir la nouvelle grille tarifaire), assez précis pour qu'on sache qui est traité.
3. **L'issue.** Le panier à 7 jours, pas « l'engagement » sans définition.

```diagram
type: compare
title: Deux questions qui se ressemblent
columns:
  - title: Question descriptive
    tone: blue
    items:
      - Qui a cliqué, et combien ont acheté ?
      - Utile pour décrire et segmenter
      - Le groupe non cliqué est un autre public
  - title: Question causale
    tone: amber
    items:
      - Que se serait-il passé sans le clic forcé ?
      - Il faut un monde comparable
      - Le hasard du test s'en approche
```

Une bonne phrase de cadrage : « Parmi les inscrits de la semaine 12, quel est l'effet **d'envoyer** le code de bienvenue, par rapport à ne pas l'envoyer, sur la probabilité d'un premier achat sous 14 jours ? » Elle ne ressemble pas à : « les gens qui ont reçu le code achètent-ils plus ? », parce que la réception peut dépendre de l'ouverture des e-mails, donc du client lui-même.

# Expérience et observation

Dans une **expérience** aléatoire, vous assignez le traitement au sort. Les groupes diffèrent par le traitement et par le hasard du tirage, pas par une décision métier qui aurait choisi les « bons » clients. Si le tirage est sain (pas de SRM, unité stable, peu d'interférence), l'écart de moyenne estime l'effet causal sur la population tirée au sort.

Dans une **étude observée**, le traitement s'est décidé tout seul : le client a cliqué, le commercial a appelé les gros comptes, la promo a été mise dans les villes en baisse. Les groupes diffèrent par le traitement **et** par tout ce qui a conduit au traitement. Vous pouvez décrire. Vous ne pouvez pas, sans hypothèses supplémentaires, attribuer l'écart au traitement.

| | Expérience aléatoire | Observation |
|---|---|---|
| Qui reçoit le changement | Le tirage au sort | Le terrain, le client, la règle métier |
| Facteurs inconnus | Équilibrés en espérance, si le tirage est sain | Souvent déséquilibrés |
| Ce que vous estimez | L'effet du changement sur les éligibles | Une association, parfois un effet **si** les hypothèses tiennent |
| Phrase honnête | « Le test estime un effet de … » | « Parmi les observés, on voit … » |

L'observation n'est pas un sous-métier. Presque toutes les questions historiques (qu'est-ce qui a coïncidé avec la baisse de mars ?) sont observées, parce que vous ne pouvez pas réécrire mars. Elle devient trompeuse le jour où le verbe glisse de « coïncide » à « a causé ».

# Les variables confondantes

Une **variable confondante** influence à la fois le traitement et l'issue. Si vous l'ignorez, l'écart entre traités et non traités mélange son effet et celui du traitement.

Cas. En avril, les magasins qui ont reçu la visite d'un coach régional ont progressé de 6 %, les autres de 1 %. Le coach cause-t-il +5 points ? Le planning des visites, lui, ciblait les magasins déjà en dynamique, avec un directeur en poste depuis plus d'un an. « Déjà en dynamique » et « directeur stable » poussent la visite **et** la progression. Ce sont des confondeurs. Le mois (Pâques, météo) peut l'être aussi s'il n'est pas le même pour tout le monde.

Ce qui n'est pas un confondeur : une variable **sur le chemin** entre le traitement et l'issue. Le coach forme l'équipe, l'équipe conseille mieux, les ventes montent. « Qualité de conseil » est un mécanisme, pas un parasite à « contrôler » pour faire disparaître l'effet. Ajuster dessus répond à une autre question (l'effet hors de ce mécanisme), et peut l'annuler à tort.

Vous ne pouvez ajuster que sur ce que vous avez mesuré, correctement, **avant** le traitement ou du moins non causé par lui. Ajuster sur une variable mesurée après, elle-même touchée par le traitement, ouvre un biais. Et tout confondeur non mesuré (motivation du directeur, travaux dans la rue) reste dans l'écart.

```video
url: https://www.youtube.com/watch?v=ofweqU0Lz4I
title: "Correlation vs Causation Explained: Why Patterns Can Mislead Us"
channel: "Sprouts"
duration: "4:51"
lang: en
why: "Corrélation et causalité expliquées en cinq minutes, avec le rôle des variables confondantes."
```

# Un graphe causal simple

Un graphe causal est un dessin de flèches « peut influencer ». Il ne calcule rien. Il force l'équipe à dire ce qu'elle croit, avant les requêtes.

Pour les glaces et les noyades : la saison pointe vers les deux, et il n'y a pas de flèche des glaces vers les noyades. Pour le coach :

- dynamique récente → visite du coach ;
- dynamique récente → progression des ventes ;
- stabilité du directeur → visite ;
- stabilité du directeur → progression ;
- visite → progression (c'est l'effet que vous espérez, pas celui que vous avez prouvé).

```diagram
type: flow
title: Lire un confondeur avant d'ajuster
steps:
  - title: Dessiner les flèches
    text: Qui influence la visite, qui influence les ventes
    tone: violet
  - title: Repérer le tronc commun
    text: Une cause commune n'est pas un mécanisme
    tone: amber
  - title: Mesuré avant ?
    text: On n'ajuste pas sur un effet du traitement
    tone: blue
  - title: Dire l'hypothèse
    text: Aucun confondeur important ne reste dehors
    tone: teal
```

Si une flèche manque dans les données (pas de mesure de la dynamique **avant** la visite), le graphe vous dit que l'ajustement est impossible, pas qu'il faut quand même « mettre des variables dans la régression ». Une régression n'est pas une baguette : elle retire seulement les écarts liés aux colonnes que vous lui donnez, sous des hypothèses de forme (linéarité, bon dénominateur, pas de tri des survivants).

# Ce qu'un analyste peut affirmer

Votre travail n'est pas de parler moins. Il est de faire coïncider le verbe et le dispositif.

Vous pouvez affirmer, lorsque c'est vrai :

- la **définition** (taux de réachat à 90 jours, commandes payées hors TVA, clients identifiés France) ;
- le **constat** sur la population réellement mesurée (« dans la cohorte de mars, le taux est passé de 22 % à 17 % ») ;
- la **qualité** du constat (fenêtre complète, rapprochement finance, pas de trou de tracking) ;
- dans un test sain, une **estimation d'effet** avec son intervalle, sa population éligible, sa durée, ses gardes-fous ;
- dans une observation, une association **après** avoir nommé les confondeurs retenus et ceux que vous n'avez pas.

Vous ne pouvez pas affirmer, sur la foi d'une comparaison de gens qui ont choisi :

- « le chat a augmenté le panier de 25 € » ;
- « sans la campagne, nous aurions fait 1,2 M€ de moins », si la campagne a été allumée justement là où ça baissait, sans groupe témoin ;
- « la régression contrôle tout », alors qu'elle contrôle trois colonnes.

> [!IMPORTANT]
> Une recommandation peut rester ferme sans causalité parfaite. « Je ne sais pas si le chat cause le panier, donc je ne propose pas de le rendre obligatoire. En revanche le taux d'échec en caisse a doublé lundi à 11 h, incident tracking exclu : il faut regarder la release. » Le premier verbe est causal et vous le retenez. Le second est un constat opérationnel, et vous le portez.

Quand on vous pousse (« donc c'est bien la promo qui a marché ? »), répondez par le dispositif : « Nous voyons une coïncidence avec la promo, concentrée sur les villes où elle a été déclenchée parce qu'elles baissaient déjà. Sans test, je ne chiffre pas l'effet propre de la promo. Voici ce qu'il faudrait tirer au sort pour le faire. »

# Exercices

## Exercice 1 : Écrire le contre-factuel

Le brief dit : « Les utilisateurs qui ont fini le tutoriel ont une rétention à 30 jours de 50 %, contre 20 % pour les autres. Recommande-t-on de rendre le tutoriel obligatoire ? » Reformulez la question causale, puis dites pourquoi la comparaison actuelle n'y répond pas.

<details>
<summary>Voir la solution</summary>

Question causale : « Si l'on assignait au hasard les nouveaux inscrits à "tutoriel obligatoire" ou "tutoriel facultatif", de combien bougerait la part encore active à 30 jours ? »

La comparaison actuelle oppose des gens qui ont **choisi** de finir le tutoriel (déjà motivés, déjà à l'aise, peut-être déjà décidés à rester) à tous les autres, y compris ceux qui ont quitté l'application à la première minute. Le groupe « 20 % » n'est pas le contre-factuel du groupe « 50 % ». Rendre le tutoriel obligatoire appliquerait le traitement à des gens qui ne lui ressemblent pas, et pourrait même faire partir ceux qui voulaient aller droit au produit.

Vous pouvez dire : finir le tutoriel **marque** les utilisateurs qui restent. Vous ne pouvez pas recommander l'obligation sur ce seul écart.

</details>

## Exercice 2 : Nommer le confondeur

Une note interne affirme : « Les agences qui envoient plus de newsletters ont un meilleur chiffre. Il faut donc augmenter la fréquence pour toutes. » Proposez deux confondeurs plausibles et la flèche qui les relie à l'envoi comme au chiffre. Indiquez une variable qu'il ne faudrait pas « contrôler » sans réfléchir.

<details>
<summary>Voir la solution</summary>

Confondeurs plausibles : la taille de la base locale (une grande agence envoie plus et vend plus) ; la santé commerciale déjà là (une agence qui tourne a du contenu à annoncer et des clients qui achètent). Flèches : taille → volume d'envois, taille → chiffre ; dynamique commerciale → envois, dynamique → chiffre.

Variable à ne pas contrôler à la légère : le taux d'ouverture ou le nombre de visites en magasin **après** l'envoi, si vous pensez que c'est précisément par là que la newsletter agirait. Les retirer de l'écart, c'est effacer le mécanisme pour conclure que « la newsletter ne fait rien ».

Sans mesure de la taille et de la dynamique **avant** la période d'envoi, augmenter la fréquence pour toutes reste une hypothèse, pas une conséquence du chiffre.

</details>

## Exercice 3 : Choisir le verbe

Pour chaque phrase, dites si vous la signez, et par quoi vous la remplacez si besoin. Le contexte : pas de test, extraction sur les commandes de l'année, les clients du programme fidélité ont un panier annuel moyen plus élevé que les autres.

1. « Le programme fidélité augmente le panier annuel. »
2. « Les membres du programme ont, en observé, un panier annuel moyen plus élevé. »
3. « Nous avons prouvé le retour sur investissement du programme. »

<details>
<summary>Voir la solution</summary>

1. Vous ne la signez pas. « Augmente » est causal. Les membres ont pu rejoindre le programme parce qu'ils achetaient déjà beaucoup. Remplacement : « Les membres observés ont un panier plus élevé ; l'écart mélange l'effet éventuel du programme et le profil de ceux qui y entrent. »
2. Vous la signez, à condition de préciser la population, la période, hors TVA ou non, et que « panier annuel » est bien défini (somme des commandes, pas moyenne de ratios par ticket).
3. Vous ne la signez pas. Un ROI exige un contre-factuel (ces membres sans programme) et des coûts. Vous ne les avez pas. Remplacement : « Je ne chiffre pas le ROI sur cette comparaison. Voici le surcroît **observé**, et voici le test qui permettrait d'estimer l'effet. »

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Introduction à la causalité
center: La cause se juge contre ce qui serait arrivé aux mêmes unités, pas contre un autre groupe commode.
points:
  - icon: scale
    title: Association
    text: Deux courbes ensemble décrivent. Elles ne disent pas qui produit l'autre.
  - icon: git
    title: Contre-factuel
    text: Le monde sans traitement, pour les mêmes personnes. Écrivez-le avant la requête.
  - icon: test
    title: Le tirage au sort
    text: Une expérience saine équilibre aussi ce que vous n'avez pas mesuré.
  - icon: puzzle
    title: Confondeur
    text: Une cause commune du traitement et de l'issue. Le mécanisme, lui, n'est pas à effacer.
  - icon: chat
    title: Le verbe juste
    text: "Associer, coïncider, estimer un effet. « A causé » se mérite."
pitfall: Ajouter dix colonnes dans une régression et annoncer que tous les biais sont réglés.
remember: Sans contre-factuel crédible, recommandez un constat ou un test, pas une cause.
```
