---
title: Corrélation et régression simple
description: "Relier deux chiffres sans leur inventer une cause : nuage de points, corrélation de Pearson, droite de régression, résidus, et variables qui trompent le lien."
duration: 60
objectives:
  - Lire un nuage de points avant de citer un coefficient
  - Interpréter une corrélation de Pearson et son carré sans en faire une cause
  - Ajuster une droite simple, calculer un résidu et repérer une forme que la droite rate
  - Nommer une variable confondante et dire ce que la droite ne permet pas de décider
---

# Commencer par le nuage de points

Le marketing d'Atelier Nord veut savoir si « plus on dépense en publicité, plus on vend ». Six jours se suivent. Les dépenses et le CA sont en milliers d'euros.

| Jour | Dépense pub | CA |
| --- | --- | --- |
| Lundi | 1 | 10 |
| Mardi | 2 | 12 |
| Mercredi | 3 | 13 |
| Jeudi | 4 | 16 |
| Vendredi | 5 | 18 |
| Samedi | 6 | 19 |

Le **nuage de points** place chaque jour : dépense en abscisse, CA en ordonnée. Ici les points montent, à peu près en ligne. Cette phrase visuelle précède tout coefficient. Un coefficient sans nuage a déjà fait accepter une droite là où les points formaient un U, deux paquets, ou une seule journée extrême qui fabriquait la pente à elle seule.

Deux formes que la suite du chapitre ne verrait pas si vous commenciez par le nombre. Les commandes selon l'heure : un creux le matin, un pic à midi, un pic le soir. Une droite à travers ces deux bosses est presque plate, le coefficient est proche de 0, et le lien est pourtant évident sur le graphique. Un jour de soldes isolé, très haut en dépense et en CA, peut au contraire créer un coefficient fort alors que les cinq autres jours ne montrent rien. Le nuage règle ces deux cas en dix secondes.

# La corrélation de Pearson

La **corrélation de Pearson**, notée r, mesure à quel point les points s'alignent sur une droite, et dans quel sens. Elle va de −1 à 1. Proche de 1, quand l'un monte l'autre monte, et les points sont serrés autour d'une droite. Proche de −1, quand l'un monte l'autre descend, toujours de façon linéaire. Proche de 0, pas de pente linéaire claire : soit peu de lien, soit un lien que la droite ne sait pas voir (le U, les deux pics de la journée).

r ne dépend pas des unités. Que la dépense soit en euros ou en milliers d'euros, la corrélation entre dépense et CA est la même. Elle est **symétrique** : la corrélation de la dépense avec le CA est celle du CA avec la dépense. Elle ne dit pas qui sert à prévoir l'autre.

Sur les six jours, le calcul donne r ≈ 0,99. C'est un jouet pédagogique : six points presque alignés. Sur une année réelle, attendez-vous à moins, et méfiez-vous d'un r élevé obtenu avec très peu de points. Un coefficient n'est pas plus « vrai » parce qu'il est proche de 1 sur une semaine choisie.

Le carré r² dit la part de la variance du CA qui est **linéairement associée** à la dépense, dans cet extrait. Ici r² ≈ 0,98 : presque toute la variation de ces six CA suit la variation des dépenses, au sens de la droite. Ce n'est pas « 98 % du CA est causé par la pub ». La variance expliquée n'est pas une part du chiffre d'affaires, et l'association n'est pas une cause. Sur des données moins sages, un r de 0,50 donne un r² de 0,25 : un quart de la variance du CA suit la droite, les trois quarts sont ailleurs (saison, stock, promo, hasard).

```python
depenses = [1, 2, 3, 4, 5, 6]
ca = [10, 12, 13, 16, 18, 19]
n = len(depenses)
mx = sum(depenses) / n
my = sum(ca) / n
num = sum((x - mx) * (y - my) for x, y in zip(depenses, ca))
dx = sum((x - mx) ** 2 for x in depenses)
dy = sum((y - my) ** 2 for y in ca)
r = num / (dx * dy) ** 0.5
print(round(r, 3), round(r ** 2, 3))  # 0.991 et 0.983
```

Pearson est sensible aux points extrêmes. Un décembre très haut des deux côtés peut soutenir à lui seul un r flatteur sur douze mois. Recalculez sans ce point, ou regardez le nuage : si le coefficient s'effondre, vous aviez un point, pas un lien stable.

# La droite de régression

La **régression linéaire simple** cherche la droite qui prévoit le CA à partir de la dépense : CA prévu = a + b × dépense. b est la pente. a est le CA prévu si la dépense était 0, souvent un raccord numérique sans réalité (personne ne fait tourner la boutique avec 0 € de pub et le reste « inchangé »). On choisit a et b pour que les écarts verticaux entre les points et la droite, mis au carré, soient les plus petits possibles. C'est un critère de calcul. Ce n'est pas une preuve que le monde est une droite.

Sur les six jours, b ≈ 1,89 et a ≈ 8,07, en milliers d'euros. La pente se lit : **dans cet extrait**, 1 000 € de dépense publicitaire en plus vont de pair avec environ 1 890 € de CA en plus. « Vont de pair » n'est pas « rapportent ». La droite résume les points que vous avez. Elle ne dit pas ce qui se passerait si vous décidiez, demain, d'ajouter 1 000 €.

Les lignes suivantes prolongent le calcul précédent (`num`, `dx`, `mx`, `my`).

```python
b = num / dx
a = my - b * mx
print(round(a, 2), round(b, 2))  # 8.07 et 1.89
```

La régression n'est pas symétrique. Prévoir le CA à partir de la dépense n'utilise pas la même droite que prévoir la dépense à partir du CA. Vous annoncez le sens dans la phrase : « nous prévoyons le CA à partir de la dépense observée », pas « les deux variables s'expliquent ».

Une pente se compare à l'unité et à la période. b ≈ 1,89 sur six jours de milliers d'euros n'est pas un ROI à copier dans le budget annuel. Avec si peu de points, la pente bougerait si samedi sortait de l'extrait. Le chapitre sur les intervalles s'applique aussi à b : une pente sans fourchette, sur six points, n'est pas une décision d'investissement. Ici le but est de lire la droite, pas de construire cet intervalle.

# Lire les résidus

Le **résidu** d'un jour est le CA observé moins le CA prévu par la droite. Positif : la droite a visé trop bas. Négatif : elle a visé trop haut.

Mercredi, dépense 3, CA observé 13. CA prévu ≈ 8,07 + 1,89 × 3 ≈ 13,7. Résidu ≈ 13 − 13,7 = −0,7 millier d'euros. La journée est un peu en dessous de la droite, de l'ordre de 700 € sur un CA de 13 000 €. Rien, sur ce jouet, n'appelle une autre histoire.

Avec `a`, `b` et les deux listes du calcul précédent, chaque jour se compare à la droite.

```python
for x, y in zip(depenses, ca):
    prevu = a + b * x
    print(x, y, round(prevu, 2), round(y - prevu, 2))
```

Le réflexe utile est le **nuage des résidus** : résidu en fonction du CA prévu, ou du jour. Une droite qui convient laisse des résidus sans forme, un peu positifs, un peu négatifs, sans éventail qui s'ouvre. Une forme qui reste est une variable oubliée.

Signe classique en e-commerce : les résidus de novembre et décembre sont tous positifs. La droite, ajustée sur l'année, sous-estime systématiquement les fêtes. La pub n'a pas « surperformé » par magie. La saison n'est pas dans le modèle. Ajouter la saison, ou calculer la droite **à l'intérieur** de chaque mois, change la pente. Tant que les résidus ont un calendrier, la pente mélange la pub et le calendrier.

Un résidu énorme et isolé se traite comme une valeur extrême : on l'identifie (bug de tracking, journée de soldes, rupture totale) avant de le laisser décider de b. Le supprimer en silence pour « améliorer r » améliore le coefficient et dégrade l'honnêteté.

# Une corrélation n'établit pas une cause

r ≈ 0,99 sur les six jours est compatible avec plusieurs histoires.

- La pub a vraiment amené les ventes de ces jours-là.
- Les ventes attendues ont conduit l'équipe à dépenser plus les jours déjà prometteurs (le CA « cause » la dépense, à l'envers de la phrase du brief).
- Un troisième facteur a poussé les deux (le week-end, une promo, le stock disponible).
- Le lien n'existe que sur cette semaine, et disparaît en janvier.

La corrélation et la droite sont les mêmes dans les quatre histoires. Rien dans a, b ou r ne les départage. Dire « 1 € de pub rapporte 1,89 € » transforme une description du passé en une manette pour l'avenir. Cette phrase n'est licite que si le dispositif permet de parler de cause : par exemple une expérience où le budget pub a été augmenté au hasard sur une partie des jours, le reste étant tenu comparable. Ce parcours y revient avec les tests et l'introduction à la causalité. Dans ce chapitre, la phrase autorisée est : « sur ces jours, dépense et CA montent ensemble, d'environ 1,9 k€ de CA pour 1 k€ de dépense, **sans que cela établisse l'effet d'une dépense supplémentaire** ».

Le sens commun suffit souvent à freiner. Les ventes de glaces et les noyades montent ensemble dans l'année. r peut être élevé. Interdire les glaces ne viderait pas les plages. La chaleur pousse les deux. Le graphique est juste, la décision causale est fausse.

```diagram
type: flow
title: Du nuage à ce que vous avez le droit de dire
steps:
  - title: Nuage
    text: Forme, points extrêmes, deux bosses éventuelles
    tone: blue
  - title: Pearson
    text: Alignement linéaire, entre -1 et 1
    tone: violet
  - title: Droite
    text: Prévision moyenne dans l'extrait, pas un levier
    tone: teal
  - title: Résidus
    text: Ce que la droite rate encore, souvent le calendrier
    tone: amber
  - title: Phrase
    text: Association décrite, cause non revendiquée
    tone: rose
```

```video
url: https://www.youtube.com/watch?v=SCWk-_wh-VY
title: "Tout comprendre aux corrélations et à la causalité"
channel: "Monsieur SES"
duration: "12:06"
lang: fr
why: "Corrélation et causalité démêlées en français, avec des exemples concrets de liens trompeurs."
```

# Les variables confondantes

Une **variable confondante** est liée aux deux chiffres que vous associez, et suffit à fabriquer ou à masquer la pente. Pour la pub et le CA d'Atelier Nord, les candidates habituelles sont le mois (les fêtes), une promotion décidée en même temps que le budget, la disponibilité du stock, et le canal (on dépense plus là où les clients achètent déjà).

Vous ne « corrigez » pas un confondant en l'ignorant. Trois gestes d'analyste, du plus simple au plus lourd.

Regarder le lien **à l'intérieur** du confondant. La pente dépense → CA sur les seuls mardis de hors-saison, ou mois par mois. Si elle s'aplatit, le lien annuel était le calendrier. C'est le même réflexe que Simpson : un résultat global mélange des groupes qui n'ont pas le même niveau de fond.

Garder le confondant **visible** dans le tableau. Une colonne « promo en cours : oui / non » à côté de la dépense empêche de raconter une histoire unique. Vous n'êtes pas obligé d'ajuster un modèle à deux variables pour montrer que les jours de promo sont justement les jours de forte dépense.

Réserver la **régression multiple** (plusieurs variables en même temps) et l'expérience aux questions où la décision coûte cher. La régression multiple n'est pas une baguette : un confondant mal mesuré, ou un confondant que vous n'avez pas, laisse la pente biaisée. Elle dépasse ce chapitre. Nommer le confondant que vous n'avez pas pu tenir constant est déjà une conclusion adulte : « la pente mêle pub et saison, nous ne recommandons pas d'augmenter le budget sur cette seule droite ».

> [!WARNING]
> Plus vous essayez de variables jusqu'à ce que r devienne flatteur, plus vous fabriquez une histoire collée à cet extrait. Le nuage, la droite et les résidus se montrent tels quels, y compris quand ils sont décevants.

```video
url: https://www.youtube.com/watch?v=ebEkn-BiW5k
title: "Simpson's Paradox"
channel: "minutephysics"
duration: "4:40"
lang: en
why: "Le paradoxe de Simpson en quatre minutes : quand une variable cachée inverse la conclusion d'une comparaison."
```

# Exercices

## Exercice 1 : Ce que r ne voit pas

Pour chaque situation, dites si un r de Pearson proche de 0 est rassurant (« pas de lien ») ou trompeur, et ce que le nuage montrerait.

1. Nombre de commandes selon l'heure, avec un pic à midi et un pic le soir, et peu de commandes à 5 h et à 16 h.
2. Dépense pub et CA sur 12 mois, dont un seul mois de décembre très haut sur les deux, les onze autres mois en vrac sans pente.
3. Les six jours du tableau du cours, points presque alignés et montants.

<details>
<summary>Voir la solution</summary>

1. **Trompeur.** r proche de 0 parce qu'aucune droite ne suit deux pics. Le nuage montre le rythme de la journée. Conclure « l'heure ne compte pas » est faux.
2. **Trompeur dans l'autre sens** si vous citez le r de l'année sans regarder : décembre peut créer un coefficient fort. Sans ce point, le nuage des onze mois n'a pas de pente. Le lien « stable » n'existe pas.
3. **Lisible.** r proche de 1 résume vraiment un alignement. Cela reste une association sur six jours, pas une cause, et pas une base suffisante pour un budget.

</details>

## Exercice 2 : Prévoir mercredi

La droite ajustée sur les six jours est environ CA = 8,07 + 1,89 × dépense, en milliers d'euros. Mercredi, la dépense est 3 et le CA observé est 13.

1. Quel CA la droite prévoit-elle ?
2. Quel est le résidu, et que veut-il dire ?
3. Si tous les résidus de décembre étaient positifs, que faudrait-il ajouter à l'histoire ?

<details>
<summary>Voir la solution</summary>

1. 8,07 + 1,89 × 3 ≈ 13,7 k€, soit environ 13 700 €.
2. Résidu ≈ 13 − 13,7 = −0,7 k€. La droite vise environ 700 € trop haut ce jour-là. Sur un seul jour et un petit écart, ce n'est pas une anomalie à raconter.
3. La droite rate la saison : elle sous-estime systématiquement les fêtes. Il faut regarder le lien à l'intérieur de chaque mois, ou tenir compte du calendrier, avant de lire b comme un effet de la pub.

</details>

## Exercice 3 : La phrase que vous refusez

Un collègue écrit dans la note : « r = 0,99, donc 1 € de publicité rapporte 1,89 €. Nous recommandons d'augmenter le budget de 20 % dès lundi. Les glaces et les noyades, elles, n'ont rien à voir, parce que notre r est plus élevé. »

Que corrigez-vous, point par point ?

<details>
<summary>Voir la solution</summary>

1. r = 0,99 décrit l'alignement des six jours. Il n'est pas une cause, et six points presque parfaits ne se transportent pas en budget annuel.
2. 1,89 est une pente **observée** : 1 k€ de dépense en plus va de pair avec environ 1,9 k€ de CA dans l'extrait. « Rapporte » suppose qu'en dépensant plus, le CA suivrait. Les données ne distinguent pas cet effet d'une dépense qui a suivi des jours déjà bons, ni d'un troisième facteur.
3. Recommander +20 % lundi exige un dispositif (expérience, ou au minimum une pente qui survit au calendrier et aux promos), pas cette droite.
4. Les glaces et les noyades peuvent avoir un r très élevé à cause de la chaleur. La hauteur de r ne protège pas de la variable confondante. Elle rend parfois le piège plus convaincant.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Corrélation et régression simple
center: "La droite résume comment deux variables bougent ensemble. Elle ne dit pas ce qui se passerait si vous en bougiez une."
points:
  - icon: eye
    title: Nuage d'abord
    text: "Deux pics ou un jour extrême rendent r mensonger. Le graphique se regarde avant le coefficient."
  - icon: chart
    title: Pearson
    text: "r va de -1 à 1, linéaire et symétrique. r² est une part de variance, pas une part du CA."
  - icon: ruler
    title: Pente b
    text: "Dans l'extrait, +1 unité de x va de pair avec +b de y. Ce n'est pas un retour sur investissement."
  - icon: search
    title: Résidus
    text: "Observé moins prévu. Une série de résidus positifs en décembre montre une saison oubliée."
  - icon: puzzle
    title: Confondant
    text: "Mois, promo, stock : on refait le lien à l'intérieur du groupe avant de recommander un budget."
pitfall: "Transformer r élevé en « chaque euro de pub rapporte b euros » alors que la dépense a suivi des jours déjà favorables."
remember: "Association décrite, cause non revendiquée, tant qu'un confondant ou le sens du lien n'a pas été écarté."
```
