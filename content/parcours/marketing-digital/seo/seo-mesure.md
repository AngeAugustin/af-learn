---
title: "Mesurer sans score magique"
description: "Lire position et taux de clic d'Atelier Lumen, et distinguer une page qui apparaît d'une page qui vend."
duration: 58
objectives:
  - "Dire ce que Search Console montre, et ce qu'il faut aller chercher dans la boutique"
  - "Lire une position moyenne avec le taux de clic, pas comme une note"
  - "Traiter une page très montrée qui ne produit pas de commande"
  - "Refuser un score sur 100 comme objectif du lundi"
---

# Ce que Search Console montre

Search Console est l'outil où vous voyez comment le site apparaît dans la recherche : quelles requêtes, quelles pages, combien de fois le résultat a été montré, combien de fois il a été ouvert, à quelle position moyenne. Ce n'est pas le tableau de bord de Noah. Les 7 200 visites payantes et les 2 520 € n'y sont pas. Ce n'est pas non plus la caisse. Les 384 commandes n'y sont pas.

Vous et Camille l'ouvrez une fois par semaine, vingt minutes, sur les vingt-huit derniers jours. Cinq lignes suffisent, celles déjà choisies. Le reste de la longue traîne existe (les 9 600 visites organiques dépassent les 1 992 clics de ces cinq requêtes). Vous ne le transformez pas en réunion.

| Requête | Position moyenne | Impressions | Clics | Taux de clic |
|---|---|---|---|---|
| atelier lumen | 1,1 | 2 600 | 1 560 | 60 % |
| bougie figue noire | 4,2 | 900 | 108 | 12 % |
| bougie cire végétale | 6,4 | 4 200 | 210 | 5 % |
| combien de temps brûle une bougie 300 g | 9,1 | 8 400 | 92 | 1,1 % |
| idée cadeau bougie | 14 | 1 100 | 22 | 2 % |

Le taux de clic est simplement les clics divisés par les impressions. 92 / 8 400 = 1,1 %. 108 / 900 = 12 %. 1 560 / 2 600 = 60 %. Vous le calculez pour ne pas le sacraliser. Une requête de marque à 60 % et un guide à 1,1 % ne vivent pas la même situation. Les comparer « au taux » sans la position, c'est reprocher au guide de ne pas être le nom de la maison.

Les commandes, vous les comptez dans la boutique : parmi les visites dont la première page est le guide, combien ont fini en commande dans le mois. Ce rattachement n'est pas une science exacte. Une personne peut lire le guide, partir, revenir par le nom. **Zéro reste zéro.** En octobre, les 92 clics du guide n'ont donné aucune commande. Les 210 clics de « bougie cire végétale » en ont donné 2.

```video
url: https://www.youtube.com/watch?v=pe-NSvBTg2o
title: "How Google Search indexes pages"
channel: "Google Search Central"
duration: "5:33"
lang: en
why: "Google Search Central montre comment ses pages sont indexées, la base pour lire correctement les rapports de Search Console."
```

# La position n'est pas une note

La position moyenne dit à peu près où le résultat s'est affiché sur la période. 1,1 sur « atelier lumen », c'est le nom, tout en haut. 4,2 sur Figue noire, c'est encore haut dans la page. 9,1 sur le guide, c'est le bas de la première page, ou juste à la charnière. 14 sur le cadeau, c'est plus loin : beaucoup de gens ne défilent pas jusque-là.

Ce n'est pas la note de Camille. Une position 9 n'est pas un 9/10, ni un échec personnel. C'est un endroit dans une liste, en moyenne, sur vingt-huit jours. Elle bouge. Un jour à 7 et un jour à 12 peuvent faire un 9,1. Vous ne réorganisez pas le mois sur un écart d'une place.

Vous ne « visez la position 1 » comme si c'était l'objectif de l'entreprise. L'objectif reste les commandes tenables : panier 42 €, promesse de 40 heures, coût d'acquisition qui ne mange pas les 24 € laissés par Hélène. Une position 1 sur « comment fabriquer une bougie » ne vendrait pas votre stock. Vous avez déjà refusé cette requête. Être premier au mauvais endroit est une réussite creuse.

La position sert à choisir le geste. Peu montré (le cadeau, position 14, 1 100 impressions) : un nouveau titre ne vous fera pas surgir. Très montré et peu cliqué (le guide, 8 400 impressions) : le résultat mérite d'être relu. Très cliqué (Figue noire, la marque) : on protège.

# Le taux de clic se lit avec la position

Un taux de clic faible n'a pas le même sens en position 2 et en position 9. En haut de page, un résultat clair prend une large part des ouvertures. Plus bas, beaucoup de gens ont déjà cliqué ailleurs, ou se sont arrêtés. Le 1,1 % du guide, en position 9,1, n'est pas en soi un scandale. Le 60 % de la marque, en position 1,1, n'est pas un exploit à reproduire sur le guide. Personne ne tape « combien de temps brûle une bougie » en cherchant spécifiquement Lumen.

Le scandale du guide est ailleurs : le title dit encore « Nos conseils bougie, le blog ». Il ne promet pas la réponse. Vous pouvez le changer pour « Combien de temps brûle une bougie 300 g ? », parce que la page répond. Vous le jugez au retour, sur la même requête. Une hypothèse de lecture, pas une loi : si le taux passait vers 3 %, 8 400 impressions feraient autour de 250 clics, au lieu de 92. Vous saurez alors que le titre a bougé quelque chose. S'il reste près de 1 %, le titre n'était pas le frein principal. Vous ne l'aurez pas décrété.

```diagram
type: decision
title: "La page apparaît. Que changez-vous ?"
nodes:
  - question: "Les impressions sont-elles déjà nombreuses sur vingt-huit jours ?"
    yes: "On lit le taux de clic avec la position."
    no: "Le titre n'est pas le premier levier. La page est peu montrée."
  - question: "Le résultat promet-il la même réponse que le premier écran ?"
    yes: "On ne réécrit pas pour le plaisir. On regarde les commandes."
    no: "On aligne title et page, puis on remesure."
  - question: "Ces clics deviennent-ils des commandes ?"
    yes: "On protège la page. Un score ne la fera pas réécrire."
    no: "Preuve, prix, un bouton. Pas 800 mots de synonymes."
```

# La page qui apparaît et ne vend pas

Le guide est le cas d'octobre. Position 9,1. 8 400 impressions. 92 clics. 0 commande. Il apparaît. Il répond assez pour qu'une personne puisse apprendre « 40 heures » et fermer l'onglet. Il ne propose pas, assez tôt, la bougie qui porte cette durée.

Ajouter 800 mots ne crée pas le bouton. Les synonymes de « bougie » non plus. Le travail tient en deux gestes, dans la même demi-journée que le maillage : un title qui promet la durée, et un lien visible « bougie 300 g, tenue 40 h, 42 € » avant le bas de page. Le protocole interne reste dit comme interne. Vous ne glissez pas un laboratoire imaginaire pour « rassurer le taux ».

Même dans l'hypothèse généreuse (autour de 250 clics, et 2 % d'entre eux qui commandent), vous êtes près de **5 commandes**, soit autour de **210 €**. C'est réel. Ce n'est pas le chantier à 3 192 € de la fiche 300 g, celle qui a déjà 8 400 visites tous canaux et 1,1 % de commandes, cible 2,0 %. Vous faites le guide parce qu'il prend une demi-journée et qu'il est malhonnête de répondre à une durée sans montrer la bougie. Vous ne reportez pas la fiche pour « finir le SEO ».

Les 2 commandes issues des 210 clics « bougie cire végétale » racontent une autre version du même piège, plus petit. La catégorie est en position 6,4, le taux de clic est de 5 %, le résultat n'est pas ridicule. La page envoie peu vers une décision. Huit liens utiles, le 300 g en évidence, pas quarante URL. Là encore, le levier est la page, pas une chasse à la position 3.

> [!IMPORTANT]
> Apparaître n'est pas vendre. 92 clics et 0 commande, c'est un guide qui a répondu puis laissé partir. Le bouton manquant ne se remplace pas par un meilleur score.

# La page qui vend, on la protège

Figue noire, requête dédiée : position 4,2, taux de clic 12 %, 108 clics. La fiche, tous apports confondus, convertit à **2,8 %** quand le parfum est en stock. Deux outils, deux questions. Search Console dit que le résultat donne envie. La boutique dit que la page conclut. Vous n'avez pas besoin qu'ils sortent le même pourcentage pour conclure que cette page-là fonctionne.

Un outil annexe dit que la « densité » du mot figue est trop basse, et propose un titre plus long, plus répétitif. Vous refusez. Vous risqueriez les 12 % et les 2,8 % pour une jauge qui ne paie pas le panier de 42 €. La rupture de six jours se gère en coupant les annonces et en disant la vérité, pas en réécrivant un title qui marche.

« Atelier lumen », position 1,1, 60 % de clics, 1 560 ouvertures : même réflexe. L'accueil doit mener en deux clics au 300 g. Il n'a pas à être réoptimisé parce qu'un score le trouve trop simple. Les gens qui tapent le nom vous ont trouvés. Ne les perdez pas dans un texte qui recommence la marque de zéro.

Protéger, c'est aussi ne pas empiler. Pas de seconde fiche Figue noire « pour tester un title ». Pas de redirection silencieuse vers la menthe pendant la rupture. Une page qui vend est un actif fragile. L'équipe de quatre la laisse stable, et elle met l'énergie sur le guide qui ne vend pas et sur la fiche 300 g qui convertit à 1,1 %.

# Le référencement n'est pas un score magique

Un outil donne **91/100** à « D'où vient la figue », la page orpheline, 40 visites, 0 commande. Il donne **54/100** à l'accueil, celui qui reçoit les 1 560 clics de marque. Si le lundi se pilote au score, vous allez enrichir l'orpheline et inquiéter l'accueil. C'est l'inverse de l'argent.

Le score mélange des checks : un mot répété, une balise remplie, une image nommée, une longueur. Certains checks recoupent un vrai travail (title vide, page sans lien). Le total, lui, ne sait pas ce qu'est un panier de 42 €, ni une promesse de 40 heures, ni une rupture. Il peut noter très bien une page qui ment, et moins bien une page qui vend.

Le rapport du lundi n'a donc pas de note sur 100. Il a cinq lignes : requête, position, impressions, clics, commandes rattachées. Une décision en sort. En octobre, elle est déjà connue, et la mesure la confirme au lieu de la remplacer.

- Le guide : title aligné, lien vers le 300 g, pas 800 mots, pas la priorité devant la fiche à 1,1 %.
- Figue noire et la marque : on ne touche pas un résultat qui fait cliquer et une page qui fait commander.
- Le cadeau en position 14 : on ne lui sacrifie pas la semaine. On le rouvrira si les impressions montent, vers les 240 commandes cadeaux de décembre.
- Aucun budget pour « monter le score ». Les 2 520 € restent un sujet de visites payantes, pas un pourboire à un indicateur.

Le référencement d'une maison de quatre personnes est cela : des pages qui répondent, des liens qui recommandent, des chiffres qu'on peut refaire à la main. Le jour où le score monte et les commandes non, vous gardez les commandes.

# Exercices

## Exercice 1 : 91 pour la figue, 54 pour l'accueil

L'outil affiche 91/100 sur « D'où vient la figue » et 54/100 sur l'accueil. Camille propose de passer la semaine à faire monter l'accueil à 91, en copiant les « bonnes pratiques » détectées sur l'article orphelin. Que mettez-vous dans le rapport du lundi à la place du score ?

<details>
<summary>Voir la solution</summary>

Vous ne mettez pas 91 ni 54. L'orpheline a 40 visites et 0 commande. L'accueil reçoit les 1 560 clics de « atelier lumen », position 1,1, taux de clic 60 %. Copier la forme de l'article sur l'accueil, c'est abîmer une page qui fait son travail pour imiter une page que personne ne recommande.

Le rapport tient en cinq colonnes : requête, position, impressions, clics, commandes. La décision qui en sort n'est pas « viser 91 ». C'est : protéger l'accueil et Figue noire, relier ou ranger l'orpheline, aligner le guide. Un check utile (title vide, aucun lien) peut se traiter à la ligne. Le total sur 100 ne se pilote pas.

</details>

## Exercice 2 : Huit cents mots pour quitter la position 9

Camille voit 9,1 sur le guide et le vit comme une mauvaise note. Elle veut 800 mots de plus « pour passer devant ». Les 92 clics n'ont donné aucune commande. Le title dit encore « Nos conseils bougie, le blog ». La fiche 300 g, elle, est à 1,1 % sur 8 400 visites. Que faites-vous de sa semaine ?

<details>
<summary>Voir la solution</summary>

La position 9,1 n'est pas une note. À cet endroit, un taux de 1,1 % n'est pas le scandale. Le title qui dit « blog » au lieu de la durée, si. Et les 0 commande le sont aussi. 800 mots ne posent ni le title « Combien de temps brûle une bougie 300 g ? », ni le lien « bougie 300 g, tenue 40 h, 42 € ».

Vous lui donnez cette demi-journée-là, pas la rédaction. Même si les clics passaient un jour vers 250, et que 2 % commandaient, vous seriez autour de 5 commandes et 210 €. Utile, petit. La fiche à 1,1 % vise environ 76 commandes et 3 192 €. Elle reste le chantier de la semaine. Le guide ne le remplace pas, il ne l'attend pas non plus six semaines.

</details>

## Exercice 3 : La densité de « figue »

Un outil dit la fiche Figue noire « pauvre » : le mot figue reviendrait trop peu. Il propose un title plus long et trois paragraphes répétés. La requête est en position 4,2, taux de clic 12 %, 108 clics. La fiche convertit à 2,8 % en stock. Noah veut appliquer l'outil avant le week-end. Que protégez-vous ?

<details>
<summary>Voir la solution</summary>

Vous protégez le title et la page. 12 % de clics en position 4,2, et 2,8 % de commandes quand le stock est là : les deux outils disent que cela fonctionne, même s'ils ne mesurent pas la même chose. Une « densité » basse ne paie pas un panier de 42 €. Un title plus répétitif peut abîmer le taux de clic que vous avez.

Vous n'ouvrez pas une seconde fiche pour tester. S'il y a un geste cette semaine-là, c'est celui de la rupture : ne pas payer de clics vers un parfum absent, et ne pas rediriger en silence. Le mot figue est déjà dans le title utile « Bougie Figue noire, 300 g, tenue 40 h ». Le répéter pour une jauge n'est pas une mesure. C'est un risque pris sur une page qui vend.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Mesurer le référencement
center: "Position, impressions, clics, commandes. Le score sur 100 ne dit pas ce que la page vend."
points:
  - icon: search
    title: Deux outils
    text: "Search Console montre le résultat. La boutique compte les commandes. Zéro reste zéro."
  - icon: gauge
    title: La position
    text: "9,1 n'est pas une note. On la lit avec le taux de clic, pas contre le 60 % de la marque."
  - icon: chart
    title: Le guide
    text: "8 400 impressions, 92 clics, 0 commande. Le title promet la durée, le lien montre la bougie."
  - icon: shield
    title: On protège
    text: "Figue noire : position 4,2, 12 % de clics, fiche à 2,8 % en stock. On ne joue pas la densité."
  - icon: money
    title: L'ordre de grandeur
    text: "Même 250 clics à 2 % font environ 210 €. La fiche à 1,1 % vise 3 192 €."
pitfall: "Passer la semaine à monter un 54/100 parce que l'orpheline est à 91 et ne vend rien."
remember: "Le lundi : cinq lignes, pas une note. On garde les commandes le jour où le score monte sans elles."
```
