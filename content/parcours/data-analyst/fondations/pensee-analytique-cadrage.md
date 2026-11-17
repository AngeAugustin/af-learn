---
title: Pensée analytique et cadrage
description: "Passer d'une demande floue à une question mesurable, avec hypothèses, périmètre, granularité et définition de métrique, et reconnaître ce qui n'est pas la question."
duration: 55
objectives:
  - Transformer une plainte (« les ventes baissent ») en question mesurable
  - Fixer hypothèses, périmètre, granularité et définition de métrique
  - Écarter ce qui n'est pas la question avant d'ouvrir les données
---

# Une baisse n'est pas une question

« Les ventes baissent » est un symptôme, pas une question. Elle ne dit pas de quelles ventes, sur quelle période, par rapport à quoi, ni quelle décision en dépend. Si vous ouvrez SQL à ce stade, vous allez calculer quelque chose de précis et répondre à côté.

Le premier geste est de faire parler la demande. Qui a observé la baisse, sur quel écran, et quelle action est en jeu ? Chez Fil & Cie, la directrice a vu le total du mois en cours dans un tableau de bord, comparé au mois précédent. Le mois en cours n'est pas fini. Le mois précédent incluait les soldes. La « baisse » peut être un calendrier, pas un problème commercial. Vous le découvrez en cinq minutes de conversation, pas dans une jointure.

Écrivez la demande brute telle qu'elle a été dite, puis la décision attendue. « Savoir si l'on relance une opération laine la semaine prochaine » est une décision. « Avoir une vision globale » n'en est pas une. Tant que la décision manque, toute analyse exhaustive est un moyen de retarder le choix.

> [!WARNING]
> Une demande floue acceptée trop vite se transforme en semaine de graphiques. Le demandeur n'a toujours pas de réponse, et vous n'avez plus le temps de cadrer.

# Formuler une question mesurable

Une question mesurable tient dans une phrase que deux personnes calculeraient de la même façon. Elle nomme la population, la métrique, la période, le point de comparaison, le grain et la décision.

Le canevas est stable. Pour qui ? Quel chiffre ? Sur quelles dates, complètes ? Comparé à quelle référence ? À quel grain le lit-on (jour, semaine, catégorie, client) ? Que fera-t-on si l'écart dépasse un seuil convenu ?

Appliqué à Fil & Cie, la plainte devient : « Le chiffre d'affaires hors taxes des commandes payées sur le site, hors marketplaces et hors commandes de test, a-t-il baissé de plus de 8 % sur les huit semaines complètes écoulées, par rapport aux mêmes semaines de l'année précédente, et la baisse est-elle concentrée sur une catégorie ? » Si la baisse dépasse 8 % et qu'elle est concentrée sur la laine, l'équipe achats vérifie les ruptures avant de lancer une promotion.

Le seuil fait partie de la question. Sans lui, tout écart devient une alerte. Un recul de 1 % sur une petite catégorie n'appelle pas la même action qu'un recul de 20 % sur la moitié du chiffre. Vous négociez le seuil avec le demandeur. Vous ne le choisissez pas après avoir vu le résultat, sinon vous racontez ce que vous avez trouvé au lieu de tester ce qui était en jeu.

| Élément | Version floue | Version mesurable |
| --- | --- | --- |
| Population | Les ventes | Commandes payées du site, hors tests |
| Métrique | Le chiffre | CA hors taxes, retours déduits |
| Temps | En ce moment | Huit semaines complètes |
| Comparaison | Ça baisse | Mêmes semaines, année précédente |
| Grain | Global | Semaine, puis catégorie |
| Décision | Il faut agir | Vérifier les ruptures si écart > 8 % et concentré |

# Hypothèses, périmètre et granularité

Une hypothèse est une explication candidate, écrite avant le calcul, que les données peuvent affaiblir. Ce n'est pas la conclusion. Pour une baisse de chiffre, les candidates habituelles sont : moins de commandes, panier plus petit, prix plus bas, mélange de catégories différent, ruptures, canal d'acquisition en panne, ou mesure cassée (doublons, commandes annulées comptées, suivi interrompu). Vous en gardez trois ou quatre, pas vingt. Chaque hypothèse doit pouvoir être écartée par un chiffre.

Le périmètre dit ce qui entre et ce qui sort. Fil & Cie vend aussi sur une marketplace et à quelques revendeurs. Les mélanger au site change la réponse. Les commandes annulées, les remboursements, les comptes salariés et les lignes cadeau à zéro euro se décident explicitement. « On verra » produit deux historiques le jour où quelqu'un les exclut.

La granularité est ce que représente un point du résultat. Le jour, pour une mercerie, est souvent du bruit (un mardi férié, une rupture d'une référence). La semaine complète se compare mieux. Le mois masque une campagne de dix jours. Le grain de la donnée source n'est pas le grain de la lecture : vous pouvez partir de lignes de commande et publier un chiffre par semaine et par catégorie. Vous ne publiez pas un grain plus fin que la décision. Personne ne réapprovisionne « à l'heure ».

```diagram
type: flow
title: Du symptôme au calcul
steps:
  - title: Symptôme
    text: La phrase entendue en réunion
    tone: rose
  - title: Décision
    text: L'action qui dépend du chiffre
    tone: amber
  - title: Périmètre
    text: Ce qui entre et ce qui sort
    tone: blue
  - title: Métrique
    text: Formule, grain, comparaison
    tone: teal
  - title: Hypothèses
    text: Trois pistes que le chiffre peut écarter
    tone: violet
```

Chez Nota, « le churn augmente » se décline autrement. Hypothèses : hausse des résiliations volontaires, échecs de paiement comptés comme des résiliations, cohorte d'essai gratuit arrivée à échéance, ou changement de la définition dans le tableau de bord. Le périmètre exclut les comptes internes. Le grain utile est la semaine de résiliation, pas la minute. Une hypothèse que vous ne pouvez pas mesurer (« les gens sont moins motivés ») n'entre pas dans le cadrage. Vous la reformulez (« la part des résiliations dont le motif déclaré est le prix a augmenté ») ou vous la laissez de côté.

> [!TIP]
> Si vous ne pouvez pas dire quel tableau, une fois filtré, rendrait l'hypothèse fausse, ce n'est pas encore une hypothèse. C'est un avis.

```video
url: https://www.youtube.com/watch?v=kWZEXXd2tZA
title: "How to Think Like a Data Analyst | Step-by-Step Guide"
channel: "Maven Analytics"
duration: "7:23"
lang: en
why: "Maven Analytics décrit pas à pas la démarche d'un analyste, de la question métier à la réponse chiffrée."
```

# Écrire la métrique avant de la calculer

La métrique s'écrit avant l'ouverture des données, sous peine de la ajuster au résultat. Une fiche courte suffit.

Le nom est celui que le métier prononce, pas un alias technique. La formule est un quotient ou une somme dont les deux termes sont définis. Le grain dit ce qu'une ligne du résultat représente. Les filtres listent les statuts, les canaux, les pays, les exclusions. La source nomme la table ou l'extrait, et la date à laquelle vous l'avez lu. La rubrique « ce que ce n'est pas » évite les contresens : le panier moyen n'est pas le chiffre d'affaires divisé par les clients, si un client passe plusieurs commandes.

Exemple pour Fil & Cie. Nom : panier moyen HT du site. Formule : somme du montant hors taxes des commandes au statut payé, expédié ou livré, moins les remboursements rattachés, divisée par le nombre de ces commandes. Grain de lecture : semaine civile, du lundi au dimanche, fuseau Europe/Paris. Exclusions : marketplace, revendeurs, commandes dont l'e-mail se termine par `@fil-et-cie.fr`, montants nuls. Ce que ce n'est pas : ni le panier médian, ni le chiffre divisé par les visiteurs, ni le panier TTC.

Les mots pièges reviennent dans presque chaque brief. « Vente », « client », « actif », « conversion », « revenu » changent de sens selon l'équipe. Vous les remplacez par la formule. Une conversion marketing (visite vers compte créé) n'est pas une conversion produit (compte créé vers note créée sous sept jours). Les additionner dans une phrase est déjà une erreur d'analyse.

| Mot du brief | Question à poser | Exemple de formule explicite |
| --- | --- | --- |
| Vente | Payée, expédiée, ou encore annulable ? | Commande payée, HT, retours déduits |
| Client | Acheteur, inscrit, ou visiteur ? | Compte avec au moins une commande payée |
| Actif | Quel événement, sur quelle fenêtre ? | Une note créée dans les 7 derniers jours |
| Conversion | De quel état vers quel état ? | Inscrits qui créent une note sous 7 jours |
| Revenu | HT ou TTC, net de remises et de retours ? | HT encaissé, remboursements déduits |

# Ce qui n'est pas la question

Le cadrage sert aussi à refuser, poliment, le travail qui ne répond pas. Un tableau de bord de toutes les colonnes disponibles n'est pas une question. C'est un catalogue. Une prédiction n'est pas la question tant que le descriptif demandé n'est pas tranché. « Rends-le plus joli » n'est pas la question si la définition est encore instable. Confirmer l'opinion déjà annoncée en réunion n'est pas la question : vous pouvez aboutir à l'inverse, et vous devez pouvoir le dire.

Certaines demandes sont de vraies questions voisines, et vous les renvoyez au bon endroit au lieu de les absorber. « Il manque trois jours de commandes dans la table » est un incident de données. Vous le documentez, vous ne le compensez pas avec un coefficient. « Il nous faudrait un score par client pour l'appel sortant » est un projet de modèle, après que le taux de retour est connu. « Il nous faut le même graphique chaque lundi pour douze personnes » est un sujet de tableau de bord, une fois la fiche métrique signée.

```diagram
type: decision
title: Cette demande est-elle la question ?
nodes:
  - question: Une décision change-t-elle selon le résultat ?
    yes: Continuez le cadrage
    no: "Pas de question, seulement une envie de graphique"
  - question: Deux personnes calculeraient-elles le même chiffre ?
    yes: La métrique est assez précise
    no: Écrivez la formule avant d'extraire
  - question: Le blocage est-il un trou de données ou un suivi cassé ?
    yes: Traitez l'incident avant d'interpréter
    no: Vous pouvez analyser le périmètre défini
```

Le piège le plus coûteux est la question élargie en cours de route. Vous avez cadré la laine sur huit semaines. À la lecture du premier tableau, on vous demande « et les tissus, et l'an dernier entier, et la marge, et les avis clients ». Chaque ajout est légitime plus tard. Aucun n'entre dans le premier rendu s'il change la décision de jeudi. Vous les notez dans une liste « ensuite », avec un propriétaire. Vous livrez la question posée.

> [!NOTE]
> Dire non à un élargissement n'est pas un manque de service. C'est ce qui permet de répondre à l'heure à la question qui débloque l'action.

# Le cadrage tient sur une page

Avant le premier graphique, vous envoyez une page, parfois un message. Elle contient la question réécrite, la décision et le seuil, le périmètre (inclus, exclus), la fiche métrique, trois hypothèses, le grain, la période exacte, et ce que vous ne traiterez pas cette fois. Vous demandez une validation courte. Un « oui » écrit évite la réunion où l'on vous reproche d'avoir exclu la marketplace.

Cette page est déjà un livrable. Elle aligne le vocabulaire. Elle vous protège quand le résultat déplaît : le calcul correspond à ce qui a été accepté, il n'a pas été choisi après coup. Elle sert aussi de brouillon à la note finale. La moitié du texte de restitution est déjà là. Seuls le chiffre, le contrôle et la recommandation manquent.

Exemple de phrase de clôture du cadrage, pour Fil & Cie : « Je calcule le CA HT des commandes payées du site, semaines 10 à 17 de 2026 contre semaines 10 à 17 de 2025, par catégorie. J'écarte marketplace, revendeurs et comptes internes. Si l'écart global dépasse 8 % et qu'une catégorie explique la majorité de l'écart, je regarde les ruptures de cette catégorie. Je ne traite ni la marge ni les avis clients dans ce rendu. » La personne qui reçoit ce message peut le corriger en une ligne. C'est le but.

# Exercices

## Exercice 1 : Réécrire « le churn augmente »

La responsable succès client de Nota écrit : « Le churn augmente, les clients n'aiment plus le produit, fais-moi un dashboard complet. » Le comité doit décider vendredi s'il lance une offre de rétention (un mois offert) sur les comptes qui résilient.

Réécrivez une question mesurable. Précisez la population, la métrique, la période, la comparaison, le grain et un seuil d'action. Donnez deux hypothèses mesurables et une formulation que vous refusez parce qu'elle n'est pas mesurable.

<details>
<summary>Voir la solution</summary>

Question. Parmi les abonnements payants actifs en début de semaine, hors comptes internes et hors essais non convertis, la part résiliée dans la semaine a-t-elle dépassé 2,5 % sur les quatre semaines complètes écoulées, contre 1,6 % les quatre semaines précédentes ? Si oui, et si la hausse n'est pas un artefact de facturation, l'équipe prépare l'offre « un mois offert » pour vendredi. Sinon, l'offre ne part pas.

Population : abonnements payants, hors internes, hors essais. Métrique : résiliations de la semaine divisées par les abonnements actifs en début de semaine. Période : quatre semaines complètes, comparées aux quatre précédentes. Grain : semaine (fuseau Europe/Paris). Seuil : au-dessus de 2,5 %, avec un écart clair versus 1,6 %. Les pourcentages ici sont un exemple de seuil négocié, pas une loi du churn.

Hypothèses mesurables. Les échecs de paiement sont désormais comptés dans les résiliations. Une cohorte d'essai arrivée au même moment gonfle le dénominateur puis les fins d'abonnement. Formulation refusée : « les clients n'aiment plus le produit ». Aucun tableau ne peut la rendre fausse telle quelle. On peut, plus tard, regarder la part des motifs « prix » ou « je n'utilise plus », si ce champ existe et s'il est rempli.

Le dashboard complet n'est pas la question de vendredi. Vous le notez pour après, une fois la définition de résiliation signée.

</details>

## Exercice 2 : Fiche de métrique

Fil & Cie parle de « taux de retour » sans plus de précision. Les achats veulent savoir si la laine revient davantage que les tissus, sur les commandes payées en février 2026.

Rédigez la fiche : nom, formule, grain, filtres et exclusions, source, et « ce que ce n'est pas ». Signalez un choix qui changerait le classement laine contre tissus s'il était inversé.

<details>
<summary>Voir la solution</summary>

Nom : taux de retour par catégorie, commandes de février 2026. Formule : nombre de commandes payées en février ayant au moins un remboursement de cette catégorie, divisé par le nombre de commandes payées en février contenant cette catégorie. On peut aussi raisonner en montant remboursé HT divisé par le CA HT encaissé. Il faut choisir une des deux et s'y tenir. Ici, le taux en commandes répond à « les clients renvoient-ils ? », le taux en montant répond à « combien cela coûte-t-il ? ».

Grain : une ligne par catégorie (laine, tissus), pas par jour. Filtres : commandes passées du 1er février 2026 inclus au 1er mars 2026 exclus, statut payé, site uniquement. Exclusions : marketplace, revendeurs, comptes `@fil-et-cie.fr`. Source : tables commandes, lignes et remboursements, extraites à une date indiquée, fuseau Europe/Paris. Ce que ce n'est pas : ni le délai de retour, ni les échanges sans remboursement, ni les retours des commandes de janvier remboursées en février (sauf si vous changez explicitement la règle d'attribution).

Le choix qui inverse le classement : attribuer le retour à la date du remboursement plutôt qu'à la date de la commande, ou passer du taux en commandes au taux en montant. Une catégorie chère avec peu de colis renvoyés peut dominer en montant et pas en nombre. Vous le dites dans la fiche pour qu'on ne découvre pas le glissement en réunion.

</details>

## Exercice 3 : Ce qui n'est pas la question

Vous avez envoyé le cadrage suivant, validé : CA HT du site, semaines 10 à 17, contre l'an dernier, par catégorie, seuil 8 %. Le lendemain, le message suivant arrive : « Super. Ajoute la marge, les avis, la météo, un score de propension à racheter, et compare aussi au budget. Le comité est jeudi. »

Classez chaque ajout : dans le rendu de jeudi, dans la liste « ensuite », ou hors sujet tant que la donnée ou la décision manque. Justifiez en une phrase par ajout.

<details>
<summary>Voir la solution</summary>

Marge. Liste « ensuite », sauf si la décision de jeudi est un arbitrage de marge et que la marge est déjà fiable par catégorie. Le cadrage validé porte sur le CA. Ajouter la marge sans définition (marge commerciale ou marge nette, frais de port inclus ou non) recrée une question floue.

Avis clients. Liste « ensuite ». Ils peuvent éclairer une catégorie en rupture ou en baisse de qualité, mais ils ne répondent pas au seuil de 8 %. Jeudi, ils disperseraient la lecture.

Météo. Hors sujet tant que personne n'a formulé une hypothèse mesurable et une décision qui en dépend. Une corrélation météo-laine, explorée la veille du comité, ne change pas l'action « vérifier les ruptures ».

Score de propension à racheter. Hors sujet pour jeudi. C'est un projet de modèle, pas un ajout de colonne. La question validée est descriptive.

Comparaison au budget. Dans le rendu seulement si le budget existe au même grain (semaine, catégorie, même périmètre site, même définition HT) et si le comité s'est engagé à agir sur l'écart au budget. Sinon, liste « ensuite » : une comparaison à un budget défini autrement est un second cadrage, pas une colonne gratuite.

Vous répondez en rappelant la phrase validée et en proposant un créneau pour le reste. Jeudi, vous livrez le CA, l'écart, la concentration par catégorie, et le contrôle ruptures si le seuil est franchi.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Cadrer avant de calculer
center: "Une baisse est un symptôme. La question nomme le chiffre, le périmètre, le seuil et la décision."
points:
  - icon: chat
    title: Faire parler la demande
    text: "Qui a vu quoi, comparé à quoi, et quelle action part si le seuil est franchi."
  - icon: target
    title: Une phrase mesurable
    text: "Population, métrique, période complète, comparaison, grain et décision tiennent ensemble."
  - icon: filter
    title: Périmètre explicite
    text: "Ce qui entre et ce qui sort s'écrit avant l'extraction, pas après la surprise."
  - icon: ruler
    title: Le grain de lecture
    text: "Le jour bruit souvent. La semaine se compare. Le mois peut masquer une campagne."
  - icon: alert
    title: Ce n'est pas la question
    text: "Un catalogue de graphiques, un modèle prématuré ou une intuition non testable s'écartent."
  - icon: file
    title: Une page de cadrage
    text: "La question réécrite se fait valider. Elle protège le rendu quand le chiffre déplaît."
pitfall: "Élargir l'analyse à chaque nouvelle idée et arriver jeudi sans réponse à la question validée."
remember: "Si deux personnes ne calculeraient pas le même chiffre, la métrique n'est pas encore écrite."
```
