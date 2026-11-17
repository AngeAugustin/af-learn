---
title: Concevoir un test A/B
description: "Formuler une hypothèse, choisir l'unité de randomisation et une métrique primaire, puis tenir la durée, éviter le peeking et lire un résultat, y compris non significatif."
duration: 60
objectives:
  - Formuler une hypothèse testable avant de regarder les résultats
  - Choisir l'unité de randomisation et une seule métrique de décision
  - Estimer à l'intuition la taille d'échantillon et la durée du test
  - Repérer un écart de répartition (SRM) et interpréter un résultat non significatif
---

# Une hypothèse avant les chiffres

Un test A/B compare au moins deux versions d'une expérience, tirées au sort, pour estimer l'effet d'un changement. Sans hypothèse écrite, le test devient une pêche aux chiffres : vous regarderez dix découpages jusqu'à en trouver un qui arrange.

Une hypothèse utile tient en quatre éléments.

1. **Le changement.** Ce que vous modifiez vraiment (le libellé du bouton, le délai de livraison annoncé, l'ordre des étapes).
2. **Pour qui.** La population éligible (nouveaux visiteurs France, abonnés mensuels, commandes de plus de 40 €).
3. **L'effet attendu.** La métrique, le sens du mouvement, et un ordre de grandeur qui vaudrait la peine (par exemple +0,8 point de conversion paiement).
4. **Le mécanisme.** Pourquoi ce changement produirait cet effet. Si vous ne pouvez pas l'expliquer en une phrase, vous ne saurez pas quoi apprendre en cas d'échec.

Exemple, pour une enseigne de prêt-à-porter. Aujourd'hui, les frais de livraison s'affichent seulement à l'étape paiement. L'hypothèse : « Afficher "livraison offerte dès 60 €" dès la fiche produit augmente le taux de commandes payées des visiteurs France, d'au moins 0,5 point sur deux semaines, parce que la surprise des frais en fin de parcours fait abandonner. »

> [!IMPORTANT]
> Écrivez aussi ce que vous **ne** conclurez pas. Ce test ne dira pas si la livraison offerte est rentable à long terme, ni si les clients reviennent. Il dit si, sur la fenêtre prévue, la métrique primaire bouge.

L'hypothèse nulle est l'hypothèse d'absence d'effet (ou d'un effet trop petit pour vous intéresser). Vous ne la « prouvez » pas : vous regardez si les données la rendent peu crédible, **à la date prévue**, sur la métrique choisie.

```video
url: https://www.youtube.com/watch?v=eiIhTbFP0ls
title: "Simple explanation of A/B Testing"
channel: "codebasics"
duration: "5:49"
lang: en
why: "Le principe d'un test A/B expliqué simplement, de l'hypothèse à la lecture du résultat."
```

# L'unité de randomisation

L'unité de randomisation est l'entité qui reçoit une variante et la garde. Si vous tirez au sort la **page vue**, la même personne voit A le matin et B l'après-midi : les deux groupes se contaminent, et vous mesurez un mélange.

| Situation | Unité en général adaptée | Piège |
|---|---|---|
| Couleur ou libellé d'un bouton | Le compte utilisateur, à défaut le cookie | Les visiteurs sans cookie changent de variante |
| Prix ou offre promotionnelle | Le compte, parfois le foyer | Les gens comparent entre eux, l'effet fuite |
| E-mail envoyé une fois | Le destinataire | Ouvrir l'e-mail n'est pas un tirage au sort |
| Délai annoncé sur une place de marché | Parfois la zone ou le créneau | Les livreurs sont partagés : A ralentit aussi B |

Deux questions suffisent presque toujours.

- **Stabilité.** La personne (ou le magasin, ou la ville) reste-t-elle dans la même variante pendant tout le test ?
- **Interférence.** Le traitement de A modifie-t-il l'expérience de B ? Si oui, tirez au sort une unité plus large (magasin, ville, créneau) et acceptez qu'il vous en faudra peu : la puissance baisse, parce que vous n'avez plus des milliers d'unités indépendantes mais quelques dizaines de grappes.

```diagram
type: flow
title: Choisir l'unité avant d'allumer le test
steps:
  - title: Qui subit le changement ?
    text: Visiteur, compte, magasin, ville ou créneau
    tone: blue
  - title: Peut-il voir les deux variantes ?
    text: Si oui, l'unité est trop fine
    tone: amber
  - title: A modifie-t-il B ?
    text: Stock, livreurs, bouche-à-oreille, prix comparés
    tone: rose
  - title: Figer l'unité
    text: Même identifiant, même variante, jusqu'à la fin
    tone: teal
```

Documentez l'identifiant utilisé (`user_id`, cookie, `store_id`) et la règle de rattachement. Un test « 50 / 50 » dont le journal perd les utilisateurs non connectés n'est plus un tirage au sort.

# Une seule métrique primaire

La métrique primaire est **la** métrique de décision. Vous la choisissez avant le lancement, elle correspond à l'hypothèse, et c'est elle qui tranche. Les autres chiffres éclairent, ils ne renversent pas le verdict parce qu'ils vous arrangent mardi.

Classez le reste.

- **Gardes-fous.** Ce qui ne doit pas se dégrader pour que la variante soit acceptable : panier moyen, taux de remboursement, tickets au support, temps de chargement. Un gain de conversion qui double les retours n'est pas une victoire.
- **Secondaires.** Mécanisme et effets voisins : taux d'ajout au panier, taux d'atteinte de l'étape livraison. Ils expliquent *comment*, pas *si* vous déployez.
- **Diagnostics.** Qualité du tirage, part de trafic éligible, latence. Ils ne sont pas une métrique produit.

Pour le message sur les frais de livraison, une primaire propre est le **taux de sessions avec commande payée**, chez les visiteurs France éligibles. Le chiffre d'affaires par session peut être un garde-fou : vous ne voulez pas d'une conversion en hausse faite de toutes petites commandes.

> [!WARNING]
> Deux primaires, c'est zéro primaire. Si la conversion est flatteuse et le chiffre d'affaires ne l'est pas, vous serez tenté de citer celle qui passe. Décidez à l'avance de la règle : « on déploie si la primaire monte et si aucun garde-fou ne franchit son seuil ».

Le dénominateur fait partie de la définition. Sessions, utilisateurs, ou commandes : un taux de 4 % n'a aucun sens si personne ne sait sur quoi il est calculé. Écrivez la phrase : « nombre d'utilisateurs avec au moins une commande payée dans les 7 jours, divisé par le nombre d'utilisateurs entrés dans le test ».

# Taille d'échantillon et durée

Vous n'avez pas besoin d'un logiciel pour sentir si le test est réaliste. Plus l'effet que vous espérez est **petit**, plus il faut d'observations. Une hausse de 2 points sur une base de 40 % se voit vite. Une hausse de 0,3 point sur une base de 4 % se noie dans le bruit.

Repère pour deux groupes, environ 80 % de puissance et un seuil de 5 % : le nombre d'unités **par variante** est de l'ordre de

`16 × p × (1 − p) / δ²`

où `p` est le taux de base et `δ` le plus petit écart (en points, pas en pourcentage relatif) que vous voulez pouvoir détecter.

Cas concret. Conversion paiement à 8 % (`p = 0,08`). Vous voulez détecter **+0,8 point** (`δ = 0,008`), soit un relatif d'environ +10 %, en dessous duquel le changement ne vaut pas le coût de maintenance.

- `p × (1 − p) = 0,0736`
- `δ² = 0,000064`
- `16 × 0,0736 / 0,000064 ≈ 18 000` utilisateurs éligibles **par variante**

À 2 000 éligibles par jour, il faut environ **18 jours**, puis vous arrondissez au cycle d'activité. Le lundi n'est pas le samedi. Un test de 18 jours qui commence un jeudi mélange mal les semaines : tenez **au moins deux semaines pleines**, ici plutôt **trois**, pour couvrir deux week-ends et une montée en charge.

Ce repère est une intuition, pas une expertise statistique complète. Il suppose des unités indépendantes, un taux stable, un seul regard à la fin. Si vous randomisez des **magasins**, comptez les magasins, pas les clients : trente magasins ne deviennent pas « beaucoup de données » parce que chacun a mille tickets.

La durée a aussi des raisons métier.

- **Nouveauté.** La première semaine, les habitués cliquent par curiosité. Un test trop court mesure la surprise.
- **Cycle d'achat.** Un meuble ne se décide pas comme un café. Allonger la fenêtre de mesure (commande sous 14 jours) allonge le test.
- **Effet retardé.** Un onboarding peut baisser l'activation le jour même et améliorer la rétention à 30 jours. Si la primaire est à 30 jours, vous ne concluez pas au jour 7.

# Ne pas regarder pour décider trop tôt

Le **peeking**, c'est consulter le test plusieurs fois et l'arrêter au premier passage sous le seuil de 5 %. Chaque regard est une nouvelle chance de vous tromper. Cinq pour cent au départ peuvent devenir de l'ordre de **20 à 30 %** de faux positifs si vous regardez souvent et que vous stoppez dès que « c'est vert ».

Vous pouvez **surveiller** sans **décider** : courbe de recrutement, plantages, garde-fou catastrophique (le paiement est cassé, le taux tombe de moitié). Une alerte de sécurité n'est pas une lecture de la primaire.

```diagram
type: decision
title: Ce regard autorise-t-il une décision ?
nodes:
  - question: Le paiement, le tracking ou un garde-fou critique est-il cassé ?
    yes: Stopper la variante et corriger, ce n'est pas une conclusion produit
    no: Ne pas déployer sur la foi de ce regard
  - question: La date de fin prévue est-elle atteinte ?
    yes: Lire la primaire, les gardes-fous et l'intervalle
    no: Laisser courir, même si le graphique est tentant
```

Les méthodes séquentielles (regarder plusieurs fois avec un seuil ajusté **prévu à l'avance**) existent. Elles se décident avant le lancement, avec quelqu'un qui sait les calculer. Improviser « on arrête si ça a l'air bon jeudi » n'en est pas une.

# SRM et résultat non significatif

Le **SRM** (*sample ratio mismatch*) est un écart entre la répartition prévue et la répartition observée. Vous attendiez 50 / 50 et vous observez 46 / 54, bien au-delà du hasard. Ce n'est pas un détail cosmétique : une partie des unités a été perdue, filtrée ou mal attribuée. Les groupes ne sont plus comparables.

Causes fréquentes : redirection qui échoue sur un navigateur, variante plus lente donc plus d'abandons avant le log, filtre « bots » appliqué après coup à un seul groupe, utilisateurs non connectés exclus d'un côté seulement. Le bon réflexe est d'**arrêter l'interprétation**, de chercher le bug, et de relancer un test sain. Retirer des lignes à la main pour « rétablir » le 50 / 50 fabrique un autre biais.

À la date prévue, trois lectures reviennent sans cesse.

| Ce que vous voyez | Ce que vous pouvez dire |
|---|---|
| Primaire en hausse, intervalle au-dessus de zéro, gardes-fous calmes, pas de SRM | Le test soutient un déploiement, dans le cadre mesuré |
| Primaire non significative, intervalle large qui contient encore l'effet utile | **Non concluant.** Le test n'avait pas la puissance prévue, ou la variance a été plus forte |
| Primaire non significative, intervalle entier sous l'effet minimal utile | Pas d'effet **assez grand** pour justifier le changement. Ce n'est pas « preuve que c'est nul au centième de point » |

« Non significatif » ne veut pas dire « les deux variantes sont égales ». Cela veut dire : les données, avec cette taille et ce bruit, ne permettent pas d'écarter l'absence d'effet. Regardez l'**intervalle**. S'il va de −0,2 point à +2 points et que vous aviez besoin de +0,5 point, vous ne savez toujours pas. S'il va de −0,3 à +0,3 point alors que le projet n'a de sens qu'à partir de +1 point, vous pouvez conclure que l'effet n'est pas à la hauteur, et ranger le sujet.

> [!NOTE]
> Annoncez le résultat avec la fenêtre, la population, la primaire et l'intervalle. « La variante B ne marche pas » est une phrase trop grande pour la plupart des tests.

# Exercices

## Exercice 1 : Réécrire l'hypothèse

Le responsable e-commerce vous dit : « On lance un test sur la page d'accueil, on verra bien ce qui sort. » La maquette ajoute un bandeau « −20 % sur la seconde pièce ce week-end ». Proposez une hypothèse exploitable (changement, population, métrique, mécanisme) et une métrique que vous refusez comme primaire.

<details>
<summary>Voir la solution</summary>

Hypothèse possible : « Pour les visiteurs France déjà identifiés, afficher le bandeau "−20 % sur la seconde pièce" du vendredi au dimanche augmente la part d'entre eux qui paient au moins deux articles sur la session, d'au moins 1 point, parce que le seuil de la seconde pièce devient visible avant la navigation. »

Primaire cohérente : taux d'utilisateurs avec une commande d'au moins deux articles. Garde-fou : marge par commande, taux de retour sous 14 jours.

À refuser comme primaire : le taux de clic sur le bandeau. Il mesure l'attention, pas la décision que le bandeau est censé provoquer, et il montera presque mécaniquement.

</details>

## Exercice 2 : Le test est-il réaliste ?

Le taux d'activation à 7 jours est de 20 %. L'équipe veut détecter une hausse de 1 point. Le repère donne environ `16 × 0,2 × 0,8 / 0,01² = 25 600` utilisateurs par variante. Vous n'avez que 1 000 inscrits éligibles par jour, et le comité veut une réponse vendredi (dans 5 jours). Que répondez-vous ?

<details>
<summary>Voir la solution</summary>

En 5 jours vous en aurez environ 5 000, soit près de 2 500 par variante, **dix fois moins** que l'ordre de grandeur. Le test sera presque sûrement non concluant, et la tentation de stopper au premier pic sera forte.

Options honnêtes : viser un effet plus grand (si un gain de 1 point ne change pas la décision, pourquoi le détecter ?) ; allonger le test à environ 8 semaines en couvrant des semaines entières ; réduire la question (un seul pays, une seule étape) seulement si le taux de base et l'effet détectable remontent vraiment ; ne pas lancer tant que la durée n'est pas acceptée.

Conclure vendredi serait du peeking déguisé en urgence.

</details>

## Exercice 3 : Lire deux fins de test

Test 50 / 50, primaire : taux de commande payée. Effet minimal utile : +0,5 point. Deux situations à la date prévue.

1. Groupe A : 20 000 utilisateurs, taux 8,1 %. Groupe B : 20 400, taux 8,4 %. Un test de répartition indique un écart de tirage très improbable. L'intervalle de B moins A est [−0,1 ; +0,7] point.
2. A : 20 000, taux 8,0 %. B : 20 050, taux 8,1 %. Pas d'alerte de répartition. Intervalle [−0,4 ; +0,6] point. Quelqu'un dit : « B est mieux, on déploie. »

Que décidez-vous dans chaque cas ?

<details>
<summary>Voir la solution</summary>

1. **SRM.** 20 000 contre 20 400 sur un tirage 50 / 50 n'est pas un arrondi. Vous ne déployez pas et vous ne « corrigez » pas en supprimant 400 utilisateurs. Vous cherchez qui manque (navigateur, consentement, lenteur, filtre). L'intervalle ne se lit pas tant que les groupes sont cassés.
2. L'écart observé est de +0,1 point, l'intervalle contient 0 et contient aussi +0,5 point. C'est **non concluant**, pas une victoire de B. Déployer « parce que le point central est positif » ignore le bruit. Vous pouvez relancer avec plus de volume, ou juger que le chantier n'est plus prioritaire, sans prétendre que B a gagné.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Concevoir un test A/B
center: "Un test se décide avant de le regarder : hypothèse, unité, une primaire, une fin."
points:
  - icon: target
    title: Hypothèse écrite
    text: Changement, population, effet minimal utile, et le mécanisme qui les relie.
  - icon: users
    title: Unité stable
    text: La même personne garde sa variante. Si A gêne B, élargissez l'unité.
  - icon: gauge
    title: Une primaire
    text: Les gardes-fous protègent, les secondaires expliquent, ils ne renversent pas le verdict.
  - icon: clock
    title: Taille et durée
    text: Petit effet, grand échantillon. Couvrez des semaines entières, pas un vendredi pressé.
  - icon: alert
    title: SRM et non significatif
    text: Répartition cassée, on ne lit pas. Intervalle large, on ne dit pas que c'est égal.
pitfall: Arrêter le test au premier passage sous 5 % puis raconter que la variante a gagné.
remember: Non significatif veut dire non concluant, sauf si l'intervalle exclut l'effet qui aurait justifié le changement.
```
