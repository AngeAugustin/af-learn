---
title: "Inférence, intervalles et tests"
description: "Passer d'un échantillon de clients à une conclusion prudente : intervalle de confiance, test d'hypothèse, lecture d'une p-value, taille d'effet, et écart entre significatif et important."
duration: 65
objectives:
  - Lire un intervalle de confiance à 95 % comme une méthode, pas comme une probabilité collée au vrai chiffre
  - Formuler une hypothèse nulle et dire ce qu'un test ne démontre pas
  - Interpréter une p-value sans la prendre pour la probabilité que l'hypothèse soit vraie
  - Séparer un écart statistiquement détecté d'un écart qui compte en commandes ou en euros
---

# De l'échantillon à toute la clientèle

Les 400 clients tirés au hasard parmi les 80 000 d'Atelier Nord ont un panier moyen de 48 €. Ce 48 € décrit l'échantillon. La question de l'inférence est différente : que peut-on dire du panier moyen **de l'ensemble**, que vous n'avez pas mesuré client par client ?

Vous ne le connaîtrez pas au centime. Vous pouvez dire dans quelle fourchette une méthode honnête le place, et si un écart observé (deux objets d'e-mail, deux accroches) est du genre de ceux que le seul tirage produit souvent. C'est tout le chapitre. Il n'y aura pas de démonstration longue. Il y aura les lectures qui changent une décision, et celles qui la sur-vendent.

Trois conditions, déjà vues, restent devant la formule. L'échantillon vise bien la population dont vous parlez (pas seulement les répondants à un bandeau). Les observations ne sont pas des copies du même client comptées dix fois. L'indicateur est celui de la question (moyenne pour un total, médiane si vous avez promis un client typique : les formules ci-dessous visent une **moyenne**).

# L'intervalle de confiance

Un **intervalle de confiance à 95 %** est produit par une recette qui, si on la répétait sur beaucoup d'échantillons du même type, encadrerait le vrai panier moyen environ 95 fois sur 100. Pour une moyenne, sur un échantillon assez grand, la recette tient en une ligne : moyenne ± 1,96 × (écart-type / racine de n). Le 1,96 est le coefficient associé au niveau 95 % pour une loi normale. Vous le prenez comme un outil, pas comme un théorème à refaire.

```python
import math

moyenne, ecart_type, n = 48.0, 18.0, 256
marge = 1.96 * ecart_type / math.sqrt(n)
print(round(marge, 2))                 # 2.21
print(round(moyenne - marge, 1), round(moyenne + marge, 1))  # 45.8 et 50.2
```

Sur cet échantillon (n = 256, écart-type 18 €), la marge vaut environ 2,2 €. L'intervalle va d'environ 45,8 € à 50,2 €. Phrase correcte : « La méthode à 95 % place le panier moyen de la population entre 45,8 et 50,2 €. » Phrase à ne pas dire : « Il y a 95 % de chances que le vrai panier soit dans cet intervalle », comme si le vrai panier était une loterie et l'intervalle une boîte déjà tirée. Le vrai panier est fixé. C'est l'échantillon, donc l'intervalle, qui aurait pu être autre. Sur 100 échantillons, environ 95 intervalles contiendraient ce vrai chiffre, et environ 5 le rateraient. Vous ne savez pas si le vôtre fait partie des 95.

Conséquences pratiques.

- Un niveau 99 % élargit l'intervalle (on utilise un coefficient plus grand que 1,96). Vous ratez moins souvent le vrai chiffre, vous dites quelque chose de moins précis.
- La marge diminue comme 1 / racine de n. Multiplier l'échantillon par 4 (passer de 256 à 1 024) divise la marge par 2 environ, ici vers 1,1 €. Elle ne la divise pas par 4. Recueillir « un peu plus » de réponses ne resserre pas l'intervalle autant que l'intuition le croit.
- Un écart-type plus grand (des paniers très hétérogènes) élargit l'intervalle. Aucun seuil magique de 400 personnes ne convient à toutes les questions.

L'intervalle ne répare pas un mauvais dénominateur ni un biais de sélection. Il quantifie le hasard du tirage **une fois la mesure bien définie**.

```video
url: https://www.youtube.com/watch?v=TyzbNXGMNGU
title: "Estimation d’une moyenne par intervalle de confiance – Théorie"
channel: "Mathéma-TIC"
duration: "8:22"
lang: fr
why: "La construction d'un intervalle de confiance pour une moyenne, expliquée au tableau et en français."
```

# Le test d'hypothèse

Vous comparez deux objets d'e-mail sur Lumen, 10 000 envois chacun, tirés de façon comparable.

- Objet A : 420 ouvertures, soit 4,20 %.
- Objet B : 465 ouvertures, soit 4,65 %.

L'écart est de 0,45 point (45 ouvertures de plus pour B sur 10 000 envois). Avant de le qualifier de « gagnant », vous posez une **hypothèse nulle** : les deux objets ont le même taux d'ouverture, et l'écart observé n'est que le hasard du tirage. L'**hypothèse alternative** est celle qui vous intéresse : les taux diffèrent (test bilatéral), ou B est supérieur à A (test unilatéral, à déclarer avant de regarder le vainqueur).

Le test demande : si la nulle était vraie, à quel point un écart au moins aussi grand que 0,45 point serait-il fréquent ? Un calcul de comparaison de proportions, sur ces effectifs, donne une **p-value d'environ 0,12**. Le logiciel la fournit. Votre travail n'est pas de refaire la formule en réunion. Il est de ne pas transformer 0,12 en une phrase que le test n'a pas dite.

Ce que le test ne dit pas. Il ne « prouve » pas que les objets sont identiques quand la p-value reste au-dessus du seuil. Il dit que cet échantillon n'a pas mis en évidence d'écart. Avec 200 envois au lieu de 10 000, presque aucun écart réaliste ne serait détecté : ne pas rejeter la nulle, sur un petit volume, n'est pas un acquittement. On dit « on ne conclut pas à une différence », pas « on a démontré qu'il n'y en a pas ».

Le seuil 5 % (rejeter la nulle si p < 0,05) est une **convention** héritée des usages, pas une loi de la boutique. Une équipe peut exiger plus de prudence avant de changer une marque (seuil plus bas) ou accepter plus de faux signaux sur un test bon marché. Le seuil se choisit avant de connaître la p-value, sinon on le déplace jusqu'à ce que le résultat plaise.

# Lire une p-value sans la trahir

La p-value est la probabilité d'observer un écart **au moins aussi grand** que celui des données, **si l'hypothèse nulle est vraie**. Dans l'exemple, si les deux objets ouvraient pareil, un écart d'au moins 0,45 point arriverait encore environ 12 fois sur 100 dans des envois de cette taille. Ce n'est pas rare. Vous ne rejetez pas la nulle au seuil de 5 %.

Les lectures fausses, très stables d'une entreprise à l'autre :

- « Il y a 12 % de chances que les objets soient identiques. » Non. 0,12 n'est pas la probabilité de la nulle. La nulle a été supposée vraie pour calculer ce nombre.
- « Il y a 88 % de chances que B soit meilleur. » Non. 1 − p n'est pas la probabilité que B gagne.
- « L'effet a 12 % de chances d'être dû au hasard » est au mieux un raccourci dangereux, au pire la même confusion. La p-value ne découpe pas l'écart en une part « hasard » et une part « vrai effet ».
- « p = 0,03 prouve que l'écart est important. » Non. La p-value parle de surprise sous la nulle, pas de la taille de l'écart en euros.
- « p = 0,06, on jette le travail. » Un résultat juste au-dessus du seuil n'est pas le contraire d'un résultat juste en dessous. Regardez l'intervalle et l'effet.

Si vous testez vingt indicateurs sur la même expérience et que vous guettez le premier p < 0,05, vous en trouverez environ un par hasard (20 × 0,05 = 1), même si rien ne diffère. Le taux d'ouverture annoncé **avant** l'envoi n'a pas ce problème. Le quinzième découpage (« et chez les nouveaux, sur mobile, le mardi ») l'a. Une p-value non prévue se présente comme une piste, pas comme une décision.

```video
url: https://www.youtube.com/watch?v=vemZtEM63GY
title: "p-values: What they are and how to interpret them"
channel: "StatQuest with Josh Starmer"
duration: "11:21"
lang: en
why: "StatQuest explique ce qu'est vraiment une p-value et ce qu'elle ne dit pas, avec des exemples simples."
```

# La taille d'effet

La **taille d'effet** est l'écart dans l'unité du métier, pas le niveau de surprise. Ici, +0,45 point d'ouverture, soit +45 ouvertures pour 10 000 envois.

Traduisez jusqu'à l'argent, avec des taux que la boutique connaît déjà, et dites que cette traduction est un scénario. Si 10 % des ouvertures cliquent et 5 % de ces clics achètent, avec 40 € de marge :

```python
ouvertures_en_plus = 45
marge_euros = ouvertures_en_plus * 0.10 * 0.05 * 40
print(marge_euros)  # 9
```

Neuf euros de marge pour 10 000 envois. L'objet B peut être « un peu au-dessus » dans les données et ne rien valoir comme chantier. À l'autre bout, +0,4 point de conversion du paiement sur 2 millions de sessions, à 25 € de marge, représente 0,004 × 2 000 000 × 25 = 200 000 €. Là, la taille d'effet justifie une réunion. Les deux écarts peuvent, selon les volumes, obtenir une petite p-value. Seule la taille dit si on bouge.

Pour un panier, la taille d'effet est des euros par commande, ou des euros sur le mois une fois multipliée par le nombre de commandes. « +1,2 € de panier » sur 50 000 commandes n'est pas le même sujet que « +1,2 € » sur 80 commandes. Citez les deux : l'écart unitaire et l'écart sur la période.

Un intervalle de confiance **sur l'écart** est souvent plus utile que la p-value seule. Il montre la taille d'effet plausible, du bas de la fourchette jusqu'en haut. Si l'intervalle de l'écart d'ouverture va de −0,1 point à +1,0 point, vous n'avez pas démontré un gain, et vous n'avez pas non plus démontré que le gain est nul : un point d'ouverture, s'il était réel, resterait dans la fourchette.

# Significatif n'est pas important

**Significatif** veut dire : l'écart est peu compatible avec l'hypothèse nulle, au seuil que vous vous étiez fixé. **Important** veut dire : l'écart vaut le coût du changement (design, risque de marque, temps d'ingénierie, euros). Les quatre combinaisons arrivent vraiment.

| Situation | Lecture | Décision type |
| --- | --- | --- |
| Détecté, et gros en euros | L'intervalle exclut 0 et la fourchette est utile | On change, si le test est bien fait |
| Détecté, et minuscule | p petite parce que n est énorme, effet de quelques euros | On ne mobilise pas une équipe |
| Non détecté, intervalle large | Le bruit peut encore cacher un effet qui compterait | On ne conclut pas, on allonge ou on arrête en le disant |
| Non détecté, intervalle serré autour de 0 | Un gros effet est peu plausible | On peut traiter l'écart comme négligeable |

```diagram
type: decision
title: Que faire de ce résultat
nodes:
  - question: L'intervalle de l'écart exclut-il zéro au seuil convenu avant l'expérience ?
    yes: Question suivante
    no: "Pas de différence établie : l'intervalle contient-il encore un gain qui vaudrait le coût ?"
  - question: Le gain, en commandes ou en euros, dépasse-t-il le coût du changement ?
    yes: Résultat détecté et utile pour le métier
    no: Résultat détecté, trop petit pour mobiliser l'équipe
```

Reprenons les objets d'e-mail. p ≈ 0,12 : pas de différence établie au seuil de 5 %. Avant de dire « les objets se valent », regardez jusqu'où l'intervalle de l'écart monte. S'il laisse encore passer un gain qui, sur les vrais volumes d'envoi, payerait le changement, la bonne phrase est « échantillon trop flou », pas « on a prouvé l'égalité ». S'il est serré autour de quelques euros, vous pouvez classer le sujet.

Inversement, une p-value de 0,01 sur +0,02 point de conversion, obtenue parce que le site a des millions de sessions, n'est pas une victoire. C'est un effet réel au sens du test, et peut-être sans intérêt. Demandez toujours « combien de commandes, combien d'euros, sur quelle période ? » après avoir demandé « est-ce compatible avec le hasard du tirage ? ».

> [!IMPORTANT]
> Une p-value basse ne donne pas la cause. Deux objets peuvent différer parce que l'un est parti un jour de solde, ou vers une liste plus chaude. Le test chiffre un écart dans le dispositif réellement mené. Il ne remplace pas le contrôle de ce dispositif. Les biais et les tests A/B se traitent plus loin dans le parcours. Ici, refusez déjà de lire p comme une importance ou comme une probabilité de vérité.

# Exercices

## Exercice 1 : Deux phrases pour un intervalle

Un échantillon aléatoire donne un panier moyen de 48 €, intervalle de confiance à 95 % : 45,8 € à 50,2 €.

1. Écrivez la phrase que vous mettez dans la note.
2. Quelle phrase courante refusez-vous, et pourquoi ?
3. Que devient la marge, en ordre de grandeur, si vous passez de 256 à 1 024 clients comparables, à écart-type égal ?

<details>
<summary>Voir la solution</summary>

1. « Sur cet échantillon, le panier moyen est 48 €. La méthode à 95 % place le panier moyen de la population entre 45,8 et 50,2 €. »
2. « Il y a 95 % de chances que le vrai panier soit entre 45,8 et 50,2 €. » Le vrai panier n'est pas aléatoire. C'est la méthode qui, répétée, attrape le vrai chiffre environ 95 fois sur 100. Vous ne savez pas si cet intervalle-ci fait partie des intervalles qui l'attrapent.
3. La marge est divisée par environ 2 (la racine de 4), pas par 4. Elle passe d'environ 2,2 € à environ 1,1 €. Quadrupler le terrain ne quadruple pas la précision.

</details>

## Exercice 2 : Lire p ≈ 0,12

Objets A et B, 10 000 envois chacun, 4,20 % et 4,65 % d'ouverture, p-value d'environ 0,12 au seuil prévu de 5 %.

1. Que veut dire 0,12 ?
2. Pourquoi « 88 % de chances que B soit meilleur » est faux ?
3. A-t-on prouvé que les deux objets se valent ?

<details>
<summary>Voir la solution</summary>

1. Si les taux étaient identiques, un écart au moins aussi grand que celui observé arriverait encore environ 12 fois sur 100 dans des envois de cette taille. On ne rejette pas l'hypothèse nulle au seuil de 5 %.
2. 1 − p n'est pas la probabilité que B soit meilleur. La p-value est calculée **en supposant** la nulle vraie. Elle n'est pas la probabilité que cette nulle soit vraie.
3. Non. Ne pas rejeter la nulle veut dire « cet échantillon ne met pas l'écart en évidence ». Un intervalle large pourrait encore contenir un gain utile. Il faudrait cet intervalle, pas seulement la p-value, pour dire que l'écart est négligeable.

</details>

## Exercice 3 : Détecté ou utile

Classez chaque cas : on change, on ne mobilise pas, ou on ne conclut pas.

1. +0,4 point de conversion du paiement, 2 millions de sessions, marge 25 €, intervalle qui exclut 0, gain d'ordre 200 000 €, coût de mise en production modeste.
2. p = 0,01 sur +0,02 point, quelques centaines d'euros sur le mois, chantier d'une semaine d'ingénierie.
3. p = 0,30 sur un écart de panier, intervalle de l'écart allant de −4 € à +6 €, alors que +3 € paierait déjà le changement.

<details>
<summary>Voir la solution</summary>

1. **On change**, si le dispositif du test est sain. L'écart est détecté et la taille d'effet (environ 200 000 €) dépasse un coût modeste. La p-value seule ne suffirait pas, le montant si.
2. **On ne mobilise pas.** L'effet est statistiquement détecté parce que le volume est énorme, et il est trop petit en euros pour une semaine de travail.
3. **On ne conclut pas** que le panier a bougé, ni qu'il est stable. L'intervalle contient 0 et contient encore +3 €, le gain qui compterait. La phrase juste est « échantillon trop imprécis », pas « pas d'effet ».

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Inférence : intervalles et tests"
center: "L'intervalle dit où la méthode place le vrai chiffre. La p-value dit la surprise si rien ne différait. Les euros disent si on agit."
points:
  - icon: ruler
    title: Intervalle 95 %
    text: "Répétée, la méthode encadre le vrai chiffre 95 fois sur 100. Ce n'est pas une probabilité sur ce chiffre."
  - icon: test
    title: Hypothèse nulle
    text: "On suppose « pas de différence ». Ne pas la rejeter ne prouve pas que les deux options se valent."
  - icon: alert
    title: p-value
    text: "Probabilité d'un écart au moins aussi grand si la nulle est vraie. Pas la probabilité qu'elle soit vraie."
  - icon: money
    title: Taille d'effet
    text: "Points, commandes, euros. +45 ouvertures peuvent ne valoir que quelques euros de marge."
  - icon: scale
    title: Utile ou pas
    text: "Détecté et minuscule : on ne lance pas le chantier. Flou mais peut-être gros : on ne conclut pas."
pitfall: "Lire 1 − p comme la probabilité que B gagne, ou traiter p < 0,05 comme la preuve que l'écart est rentable."
remember: "Demandez d'abord si l'écart dépasse le bruit du tirage, ensuite combien il vaut, et seulement alors si on change."
```
