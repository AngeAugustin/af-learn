---
title: Tableau de pilotage marketing
description: "Tenir six indicateurs au plus, datés, lus par canal, et n'en garder aucun qui ne déclenche pas une décision pour Lumen."
duration: 50
objectives:
  - "Limiter le tableau à six lignes, chacune avec une décision"
  - "Dater les chiffres et refuser une ligne qui a plus de sept jours"
  - "Lire search, social et e-mail séparément"
  - "Relier chaque ligne au seuil de marge, 25 € de CPA ou 60 %"
---

# Six lignes, pas un mur

Un tableau qui ne tient pas sur un écran ne se lit pas le lundi. L'équipe de quatre a un quart d'heure. Léa veut savoir s'il reste de l'argent. Vous voulez savoir quoi couper. Nora veut savoir si un envoi a abîmé la base. Samir veut savoir si l'atelier va recevoir un pic qu'il ne tient pas en 48 h. Six lignes font ce travail. La septième est presque toujours une vanité qu'on n'a pas osé refuser.

Les six lignes de Lumen, dans cet ordre :

1. **Dépense pub**, 7 jours, par canal.
2. **Commandes encaissées**, caisse, et l'écart avec l'outil.
3. **CPA**, dépense divisée par les commandes encaissées du canal.
4. **Marge après pub**, encaissé × 0,60 − dépense. C'est l'étoile.
5. **Part des commandes avec un code de 20 % ou plus.**
6. **Plaintes et désinscriptions** liées aux e-mails de la semaine.

Pas les impressions. Pas les ouvertures. Pas les abonnés. Si un jour une ligne ne change aucune décision, elle sort, elle n'est pas « gardée pour le contexte ».

# Chaque ligne a une décision déjà écrite

Le chiffre sans décision est une décoration. La décision est écrite **avant** de voir le chiffre, sinon vous l'ajustez pour ne pas agir.

| Ligne | Décision si le seuil lâche |
| --- | --- |
| Dépense | On fige le canal qui dépasse son rythme de la semaine sans CPA connu |
| Commandes caisse | Si l'outil dépasse la caisse d'environ un tiers ou plus, on ne scale pas |
| CPA | Au-dessus de 25 € après 7 jours et 400 € : on coupe. Entre 18 et 25 : on laisse. Sous 18 : un palier possible |
| Marge après pub | Négative sur le canal, avec au moins 400 € : on coupe, même si un ROAS outil est joli |
| Part de codes | Au-dessus de 15 % des commandes du mois : Nora n'ajoute aucun nouveau code |
| Plaintes, désinscriptions | Un envoi au-dessus du rythme habituel : on coupe le scénario le jour même |

« On surveille » n'est pas une décision. « On en reparle » non plus. Le verbe est couper, laisser, ou augmenter d'un palier.

> [!TIP]
> Écrivez la décision dans la colonne de droite au moment où vous créez la ligne, pas après la mauvaise semaine. Une ligne sans verbe n'entre pas.

```diagram
type: pipeline
title: "Le lundi, dans l'ordre"
lanes:
  - title: "Avant de parler"
    steps:
      - title: "Fraîcheur"
        text: "Chaque chiffre a moins de 7 jours, sinon la ligne est vide."
        tone: amber
      - title: "Caisse d'abord"
        text: "Les euros encaissés priment sur l'outil."
        tone: violet
  - title: "Décider"
    steps:
      - title: "Par canal"
        text: "Search, social, e-mail. Pas une moyenne qui rassure."
        tone: blue
      - title: "Un verbe"
        text: "Couper, laisser, ou un palier. Puis on ferme le tableau."
        tone: teal
```

# La fraîcheur fait partie du chiffre

Une dépense « du mois dernier », collée à des commandes « d'hier », fabrique un CPA imaginaire. Chaque ligne porte une **date de fraîcheur** : à quelle heure le chiffre a été tiré, et quelle période il couvre. La période de pilotage est les **7 derniers jours**. Le mois sert à la part de codes, parce qu'un vendredi de promo ne se voit pas sur sept jours seulement : on regarde le mois en cours, et on le dit.

Si lundi matin la caisse n'est pas à jour, vous ne remplacez pas par l'outil « en attendant ». Vous notez « caisse indisponible », et vous **ne scalez pas**. Augmenter un budget sur un CPA d'interface, en sachant que le pixel a déjà menti une fois, est une façon rapide de dépasser 25 € pour de vrai.

Un chiffre de plus de sept jours peut rester dans un classeur. Il ne reste pas sur le tableau qui décide. La fraîcheur n'est pas une manie d'analyste. C'est ce qui sépare une décision d'un souvenir.

# Par canal, ou la moyenne ment

Search, social et e-mail n'ont pas le même CPA, ni le même rôle. L'e-mail n'a presque pas de dépense média. Il a des codes et des désinscriptions. Le mettre dans la même moyenne que le search fait paraître le search moins cher qu'il n'est, ou l'e-mail « non rentable » parce qu'il n'a pas de ROAS.

Trois blocs, les mêmes six questions adaptées :

- **Search.** Dépense, commandes caisse qu'on peut lui rattacher sans double compte avec le social, CPA, marge après sa dépense. Décision : la règle des 18 et 25 €.
- **Social.** Même chose, séparé. Un social à 22 € ne doit pas être sauvé par un search à 14 € dans une case unique « payant ».
- **E-mail.** Pas de CPA média. À la place, sur les lignes 5 et 6 : part de codes, plaintes, désinscriptions, et commandes du segment de jour 50 au prix normal. Décision : stoppe les codes, ou coupe le scénario.

Le coffret à 78 € et la bougie à 42 €, s'ils sont dans des groupes différents, ne se fondent pas non plus. Si vous n'avez la place que pour six lignes, vous mettez le **pire** groupe en note sous le canal, celui qui dépasse 25 €. C'est lui qui demande un verbe. Le groupe sain n'a pas besoin d'occuper le tableau.

# Ce que le lundi ne refait pas

Le lundi applique les seuils. Il ne les renégocie pas parce que la semaine a été dure. Passer le seuil de 25 € à 32 € « le temps de voir » est une nouvelle règle, déguisée en souplesse. Si Léa veut changer le seuil, elle le fait **entre** deux semaines, par écrit, avec la marge. 60 % de 42 € font 25,20 €. Le seuil ne peut pas être au-dessus sans accepter de perdre sur le premier achat. Cette acceptation se dit. Elle ne se glisse pas dans une case.

Samir a un droit de veto court : si le délai de 48 h ne tient plus, on fige la dépense même si le CPA est à 14 €. Vendre plus vite que l'atelier ne livre, c'est acheter des plaintes. Nora a le même droit si un scénario part aux mauvaises adresses. Le tableau n'est pas au-dessus du stock ni du consentement.

Après le verbe, vous fermez. Le reste de la semaine, vous ne reconstruisez pas le tableau tous les soirs. Vous coupez seulement si un garde-fou écrit l'exige (scénario aux désinscrits, rupture, dépense qui s'emballe). Rouvrir les six lignes le mardi pour se rassurer est la façon de changer une décision sans le dire.

# Exercices

## Exercice 1 : Quelle ligne entre ?

On vous propose d'ajouter les impressions social, le nombre d'abonnés, et un « score de marque ». Le tableau a déjà ses six lignes. Que répondez-vous, et quelle décision manque à ces trois propositions ?

<details>
<summary>Voir la solution</summary>

Ils n'entrent pas. Le tableau est plein, et aucun des trois n'a de verbe. Des impressions qui doublent ne disent pas s'il faut couper à 25 €. Des abonnés qui n'achètent pas non plus. Un score de marque que les quatre ne savent pas recalculer encore moins.

Pour faire entrer l'un d'eux, il faudrait une décision écrite et retirer une ligne existante. Vous ne le faites pas. Les six actuelles changent déjà un geste : figer, ne pas scaler, couper, laisser, palier, stoppe les codes, couper le scénario.

</details>

## Exercice 2 : Lundi, les verbes

Search, 7 jours frais : dépense 640 €, caisse 40 commandes à 42 €, outil 48 commandes. Social : dépense 300 €, caisse 8 commandes à 42 €, outil 8. Part de codes du mois : 8 %. Désinscriptions : au rythme habituel. Quels verbes ?

<details>
<summary>Voir la solution</summary>

Search : CPA 640 / 40 = 16 €. L'outil est au-dessus de la caisse (48 contre 40, soit 20 %), pas d'un tiers. On peut envisager un palier, stock de Samir vérifié. On pilote avec 40, pas avec 48. Marge 1 008 €, après pub 368 €. L'étoile du canal est positive.

Social : CPA 300 / 8 = 37,50 €. Marge 201,60 €, après pub négative. Mais 300 € sont sous 400 € : on ne coupe pas encore, on **fige**. Pas un euro de plus. On ne le sauve pas avec la bonne moyenne du search.

Codes à 8 %, sous 15 % : Nora n'est pas en stop, elle n'ajoute pas un code « pour aider le social ». Désinscriptions normales : on ne coupe pas de scénario.

</details>

## Exercice 3 : Fraîcheur cassée

La caisse est en retard de douze jours. L'outil, lui, est à jour, CPA search affiché 15 €, et quelqu'un veut doubler le budget aujourd'hui. Le pixel a déjà été trouvé sur le bouton panier le mois dernier, il est corrigé depuis, dit-on. Que faites-vous ?

<details>
<summary>Voir la solution</summary>

Vous ne doublez pas. La ligne commandes n'est pas fraîche : plus de sept jours. « Caisse indisponible » interdit de scaler, même si l'outil dit 15 €. Le souvenir d'un pixel faux renforce le refus, il n'est pas une preuve que le pixel est encore faux. Simplement, la règle ne dépend pas de l'humeur : sans caisse fraîche, pas de palier.

Vous pouvez couper un canal si vous avez une dépense fraîche et une raison de garde-fou (rupture, scénario déréglé). Vous ne pouvez pas augmenter. Léa met la caisse à jour, puis le tableau reprend ses verbes.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Six lignes, un verbe"
center: "Six indicateurs datés, par canal. Chaque ligne coupe, laisse ou augmente. Sans verbe, elle ne monte pas au tableau."
points:
  - icon: list
    title: "Les six"
    text: "Dépense, commandes caisse, CPA, marge après pub, part de codes, plaintes. Pas les impressions."
  - icon: clock
    title: "Moins de 7 jours"
    text: "Un chiffre plus vieux ne décide pas. Caisse en retard : on note l'absence, on ne scale pas."
  - icon: filter
    title: "Par canal"
    text: "Search, social, e-mail. Un search à 14 € ne sauve pas un social à 37 € dans une moyenne."
  - icon: target
    title: "Verbes écrits avant"
    text: "Couper au-dessus de 25 € après 400 €. Laisser entre 18 et 25. Un palier seulement sous 18 €."
  - icon: alert
    title: "Codes et plaintes"
    text: "Plus de 15 % de gros codes : stop. Un envoi qui déclenche des plaintes : on coupe le scénario le jour même."
pitfall: "Doubler le budget sur un CPA d'outil à 15 € pendant que la caisse a douze jours de retard."
remember: "Le lundi applique des seuils déjà écrits. Il ne les renégocie pas pour éviter un verbe désagréable."
```
