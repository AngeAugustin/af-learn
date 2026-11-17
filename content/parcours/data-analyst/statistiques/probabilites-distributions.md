---
title: Probabilités et distributions
description: "Lire une fréquence sans la prendre pour une loi : probabilité, indépendance, loi normale, loi binomiale, échantillon, et loi des grands nombres, avec des visites et des e-mails."
duration: 55
objectives:
  - Relier une probabilité à une fréquence observée sur beaucoup de cas
  - Reconnaître l'indépendance, la loi normale et la loi binomiale dans des situations métier
  - Distinguer un échantillon utilisable d'un échantillon de convenance
  - Appliquer la loi des grands nombres sans la confondre avec un rattrapage dû
---

# La probabilité comme fréquence à long terme

Sur le site d'Atelier Nord, 680 visites sur 20 000 se terminent par un achat. Le taux observé est 3,4 %. Vous pouvez appeler ce 3,4 % une **fréquence**. Vous l'appelez une **probabilité** quand vous vous en servez comme d'un modèle pour des visites du même genre, pas encore observées : « une visite comparable a environ 3,4 % de chances de devenir un achat ».

Le « environ » est le sujet du chapitre. 3,4 % n'est pas une propriété mystérieuse collée à chaque visiteur. C'est un résumé de cas nombreux et suffisamment semblables. Sur 30 visites, 0 achat ou 3 achats restent ordinaires. Le modèle ne promet pas 3,4 achats pile à chaque petit paquet de 100 visites. Il promet que, si les conditions restent stables, la fréquence se rapproche du taux quand le nombre de visites grandit.

Deux questions précèdent donc tout calcul. Les cas sont-ils **comparables** ? Mélanger les visites des soldes et celles d'un mardi de février produit un taux moyen qui ne décrit ni les soldes ni février. Le futur ressemble-t-il au passé que vous avez mesuré ? Une probabilité estimée sur l'ancien tunnel d'achat ne survit pas au nouveau tunnel. Vous n'avez pas « faux en maths » : le modèle ne s'applique plus.

```python
achats = 680
visites = 20_000
taux = achats / visites
print(round(taux * 100, 1))  # 3.4
```

Gardez l'effectif à côté du taux. 3,4 % sur 20 000 visites et 3,4 % sur 87 visites (trois achats) n'ont pas la même solidité. Le second chiffre est une fréquence fragile. Le chapitre sur les intervalles dira comment afficher cette fragilité. Ici, retenez qu'une probabilité d'analyste est une fréquence que vous acceptez de réutiliser, avec son volume et ses conditions.

# L'indépendance ne se décrète pas

Deux événements sont **indépendants** si le fait de savoir le premier ne change pas la probabilité du second. En fréquences : la part des cas où les deux arrivent ensemble est le produit des deux parts.

20 % des visites viennent de la publicité. 4 % des visites achètent. Si l'origine publicitaire et l'achat étaient indépendants, les visites qui sont **à la fois** publicitaires et acheteuses représenteraient 0,20 × 0,04 = 0,8 % de toutes les visites. Vous mesurez en réalité 2 %. Deux pour cent, ce n'est pas 0,8 %. Les visites publicitaires achètent plus souvent que les autres : savoir qu'une visite vient d'une pub **change** la probabilité d'achat. Les événements ne sont pas indépendants.

Ce n'est pas un échec de la campagne. C'est souvent son but. C'est un échec seulement si votre calcul a multiplié les taux en supposant l'indépendance (par exemple « 20 % du trafic pub × 4 % de conversion du site = 0,8 % du trafic en achats pub ») alors que les données disent 2 %. Le produit n'est pas une loi. C'est un test : s'il ne retrouve pas la fréquence conjointe, vous n'avez pas le droit de multiplier.

L'indépendance échoue encore dans deux situations quotidiennes. Les visites d'un même client ne sont pas des pièces lancées à part : s'il a acheté hier, sa visite d'aujourd'hui n'a pas la probabilité « moyenne du site ». Les e-mails ouverts dans un même foyer non plus. Compter 10 000 lignes n'est pas compter 10 000 essais indépendants si ce sont 2 000 personnes qui reviennent. Vos effectifs sont alors gonflés, et un taux a l'air plus stable qu'il ne l'est.

# La loi normale, une forme en cloche

La **loi normale** est une forme en cloche, symétrique autour de sa moyenne. Elle est décrite par deux nombres : la moyenne, et l'écart-type qui dit la largeur. Elle sert de modèle quand beaucoup de petites causes indépendantes s'additionnent (un délai de préparation, une erreur de mesure), pas quand vous décrivez un CA avec une traîne de grosses commandes.

Atelier Nord chronomètre la préparation des commandes courantes : moyenne 12 minutes, écart-type 2 minutes. Si ce délai suit à peu près une normale, l'ordre de grandeur utile est le suivant, à retenir comme une règle de lecture et non comme une démonstration.

- Environ 68 % des préparations tombent à moins d'un écart-type de la moyenne, donc entre 10 et 14 minutes.
- Environ 95 % tombent à moins de deux écarts-types, donc entre 8 et 16 minutes.
- Une préparation à 25 minutes est à (25 − 12) / 2 = 6,5 écarts-types au-dessus de la moyenne. Dans ce modèle, c'est exceptionnel.

Exceptionnel ne veut pas dire « à supprimer ». Cela veut dire : allez lire la commande. Canapé sur mesure, rupture d'un composant, chrono mal armé. La loi normale est une façon de repérer ce qui détonne **si** la cloche est un bon portrait. Sur les montants de panier, elle ne l'est en général pas : la moyenne et la médiane s'écartent, la traîne est longue. Appliquer « au-delà de trois écarts-types, ce n'est pas normal » à un CA coupe des ventes réelles. Le bon usage ici est le délai de préparation, pas le chiffre d'affaires.

Vous n'avez pas besoin de la formule de la cloche. Vous avez besoin de ne pas plaquer la cloche sur une distribution que l'histogramme contredit, et de traduire un écart en nombre d'écarts-types avant de parler d'anomalie.

```video
url: https://www.youtube.com/watch?v=rzFX5NWojp0
title: "The Normal Distribution, Clearly Explained!!!"
channel: "StatQuest with Josh Starmer"
duration: "5:13"
lang: en
why: "StatQuest explique la loi normale simplement, en cinq minutes, sans formule inutile."
```

# La loi binomiale, compter des succès

La **loi binomiale** compte des succès, quand vous répétez n fois une épreuve à deux issues (clic ou pas, achat ou pas), avec la même probabilité p à chaque fois, et des épreuves indépendantes. Vous n'avez pas besoin de la formule des combinaisons pour l'utiliser. Vous avez besoin de l'espérance, et d'un sens de ce qui est un écart banal.

L'équipe CRM envoie 200 e-mails. Chaque message a, dans le modèle, 5 % de chances d'être cliqué, indépendamment des autres. Le nombre de clics **attendu** est n × p = 10. Vous n'observerez pas 10 à chaque envoi. Huit, neuf, onze ou douze clics sont dans les environs. Un écart-type de ce compteur vaut environ la racine de n × p × (1 − p), ici racine de 9,5, soit environ 3 clics. Tomber à 7 ou monter à 13 ne raconte pas encore une nouvelle ère du copywriting.

```python
import math

n, p = 200, 0.05
esperance = n * p
dispersion = math.sqrt(n * p * (1 - p))
print(esperance, round(dispersion, 1))  # 10 et 3.1
```

Quarante clics, en revanche, sont très loin de 10 au regard de cette dispersion. Ou le p = 5 % est faux pour cette liste (ce ne sont pas « les mêmes » destinataires), ou les envois ne sont pas indépendants (un transfert viral, un segment beaucoup plus chaud), ou un bug de tracking compte deux fois. La binomiale ne dit pas laquelle des trois histoires est vraie. Elle dit que « c'est le hasard autour de 5 % » est une mauvaise histoire.

Les conditions font partie du modèle. Si p change selon les destinataires, ou si un même lecteur reçoit trois messages, vous n'êtes plus dans cette binomiale simple. Vous pouvez encore calculer 200 × 0,05 = 10 comme ordre de grandeur, pas comme une loi exacte.

# Échantillonner pour estimer

Vous n'interrogez pas les 80 000 clients du trimestre pour estimer un panier ou une satisfaction. Un **échantillon** est un sous-ensemble dont vous tirez une estimation pour l'ensemble, à condition qu'il représente cet ensemble.

Un tirage **aléatoire** de 400 clients, où chacun des 80 000 avait la même chance d'être pris, permet d'estimer le panier moyen du trimestre. L'estimation ne sera pas égale au vrai panier. Elle tournera autour, d'autant plus près que l'échantillon est grand et que les paniers ne sont pas trop hétérogènes. « Autour » se quantifiera avec un intervalle de confiance. Le point décisif, avant la formule, est le tirage.

Un échantillon de **convenance** n'a pas cette prétention. Les 400 personnes qui répondent à un bandeau après un achat sont des acheteurs encore sur le site, souvent les plus contents ou les plus en colère. Leur note moyenne décrit les répondants, pas les 80 000 clients. Augmenter cet échantillon à 4 000 répondants du même bandeau rend la moyenne des répondants plus stable. Cela ne répare pas le biais. La loi des grands nombres stabilise ce que vous mesurez vraiment, y compris une mauvaise question posée aux mauvaises personnes.

Autres biais fréquents chez un analyste : ne garder que les boutiques qui ont envoyé leur export à l'heure (les boutiques en difficulté manquent), ne tester une accroche que sur les visiteurs déjà connectés, exclure les paniers extrêmes **avant** d'estimer le panier moyen puis présenter le résultat comme celui de tous les clients. Écrire « clients interrogés » ou « répondants au bandeau » au lieu de « les clients » est parfois toute la correction nécessaire.

# La loi des grands nombres, sans formule

La **loi des grands nombres** dit, en langage d'analyste : si vous moyennez de plus en plus d'observations indépendantes et de même probabilité, la moyenne observée se rapproche de la moyenne du modèle. Le taux de conversion sur 150 visites saute d'une semaine à l'autre. Sur 20 000 visites comparables, il se cale près du taux sous-jacent, ici 3,4 %. Six achats sur 150 visites font 4 %. Ce n'est pas la preuve que le site a décollé. C'est un petit effectif.

```diagram
type: flow
title: Avant de réagir à un taux de la semaine
steps:
  - title: Effectif
    text: Six achats, 150 visites
    tone: amber
  - title: Taux
    text: 4 %, à côté d'un fond à 3,4 %
    tone: blue
  - title: Volume
    text: À 20 000 visites, le taux se cale
    tone: teal
  - title: Décision
    text: On ne refait pas la page d'accueil sur une petite semaine
    tone: violet
```

La loi ne dit pas que le hasard « doit se rattraper ». Après cinq jours en dessous de 3,4 %, le sixième jour n'est pas dû au-dessus pour équilibrer les comptes. C'est l'erreur du joueur. La moyenne se stabilise parce que les nouveaux essais **noient** les anciens dans un grand total, pas parce qu'un essai isolé compense le précédent. Couper une campagne le mardi parce que le lundi était bas, sur 150 visites, c'est prendre un bruit pour un signal.

Elle ne dit pas non plus que tout finit par converger si vous attendez. Si le taux change (nouvelle page, rupture de stock, soldes), vous moyennez des régimes différents. La courbe long terme se rapproche alors d'un mélange, pas du taux de la semaine que vous vouliez piloter. Segmentez les périodes avant d'invoquer les grands nombres.

Enfin, elle ne répare pas un biais de sélection. Vingt mille répondants au bandeau post-achat donnent une fréquence très stable **des répondants**. Ce n'est toujours pas la fréquence des clients qui ne voient pas le bandeau.

# Exercices

## Exercice 1 : Peut-on multiplier les taux ?

20 % des visites viennent de la publicité, 4 % de toutes les visites achètent, et 2 % de toutes les visites sont des achats issus de la publicité.

1. Que donnerait le produit des deux premiers taux ?
2. L'origine pub et l'achat sont-ils indépendants sur ces chiffres ?
3. Quelle erreur ferait un tableur qui affiche 0,8 % comme « part des achats pub » ?

<details>
<summary>Voir la solution</summary>

1. 0,20 × 0,04 = 0,8 % de toutes les visites.
2. Non. La fréquence conjointe observée est 2 %, pas 0,8 %. Savoir qu'une visite vient de la pub change la probabilité d'achat : ces visites achètent davantage.
3. Il aurait supposé l'indépendance au lieu de compter les visites qui sont réellement les deux. Le produit est un test d'indépendance, pas un substitut au comptage.

</details>

## Exercice 2 : Cloche ou compteur

Dites si le modèle utile est plutôt une loi normale ou une loi binomiale, et quelle lecture vous en faites.

1. Délai de préparation : moyenne 12 minutes, écart-type 2 minutes, une commande a pris 25 minutes. L'histogramme des délais courants est à peu près symétrique.
2. 200 e-mails, taux de clic historique 5 % sur des envois comparables, vous observez 11 clics.
3. Le montant des paniers, médiane 34 €, moyenne 92 €, une traîne jusqu'à plusieurs centaines d'euros.

<details>
<summary>Voir la solution</summary>

1. **Normale**, comme modèle de lecture. 25 minutes est à 6,5 écarts-types au-dessus de 12. C'est exceptionnel si la cloche tient : on ouvre la commande (produit spécial, chrono) au lieu de la traiter comme un délai banal. On ne la supprime pas automatiquement.
2. **Binomiale**. L'attendu est 10 clics, la dispersion est d'environ 3. Onze clics est un écart banal, pas une victoire de l'objet.
3. **Ni l'un ni l'autre comme résumé unique.** La moyenne loin de la médiane contredit la cloche. Compter des « succès » n'a pas de sens sur un montant. On décrit cette distribution avec médiane, quartiles et total, pas avec une normale.

</details>

## Exercice 3 : Grands nombres ou mauvaise lecture

Le taux de fond du site est 3,4 % sur 20 000 visites comparables. Cette semaine : 6 achats sur 150 visites. Un collègue écrit : « On est à 4 %, la page fonctionne mieux. Après une semaine basse, la suivante doit compenser. Et les 4 000 notes du bandeau post-achat, toutes au-dessus de 4,5, prouvent que les 80 000 clients sont satisfaits. »

Que répondez-vous aux trois phrases ?

<details>
<summary>Voir la solution</summary>

1. 6 / 150 = 4 % n'est pas une preuve d'amélioration. Sur 150 visites, l'écart avec 3,4 % est un bruit d'effectif. On ne refait pas la page sur cette seule semaine.
2. La semaine suivante ne « doit » rien compenser. La loi des grands nombres noie les écarts dans un grand total. Elle ne programme pas un rattrapage sur le prochain essai.
3. Les 4 000 notes stabilisent l'avis des **répondants au bandeau**, qui sont un échantillon de convenance (des gens encore là après un achat). Ce n'est pas l'avis des 80 000 clients. Un plus grand nombre de répondants du même bandeau ne corrige pas ce biais.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Probabilités et distributions
center: "Une probabilité est une fréquence que vous réutilisez, seulement si les cas sont nombreux, comparables et bien tirés."
points:
  - icon: chart
    title: Fréquence
    text: "3,4 % d'achats n'a de sens qu'avec les 20 000 visites et des conditions stables."
  - icon: link
    title: Indépendance
    text: "On multiplie les taux seulement si le produit retrouve la fréquence des deux événements ensemble."
  - icon: gauge
    title: Normale, binomiale
    text: "La cloche lit un délai symétrique. La binomiale compte des clics autour de n × p."
  - icon: users
    title: Échantillon
    text: "Un tirage aléatoire estime l'ensemble. Un bandeau après achat ne décrit que ceux qui répondent."
  - icon: loop
    title: Grands nombres
    text: "La moyenne se stabilise quand n grandit. Le prochain essai ne compense pas les précédents."
pitfall: "Traiter 150 visites comme une preuve, ou 4 000 répondants biaisés comme « tous les clients, puisque l'effectif est grand »."
remember: "Le volume stabilise ce que vous mesurez vraiment. Il ne choisit pas la bonne population à votre place."
```
