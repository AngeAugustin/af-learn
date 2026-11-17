---
title: Des tableaux de bord qui font agir
description: "Concevoir un écran autour d'une seule question, avec peu d'indicateurs, des filtres utiles, la fraîcheur visible et un détail au clic, sans transformer le tableau de bord en sapin de Noël."
duration: 50
objectives:
  - Tenir un écran sur une question de décision et cinq à sept indicateurs
  - Choisir les filtres qui changent l'action et afficher la fraîcheur des données
  - Prévoir un chemin de détail au clic, du symptôme vers les lignes qui l'expliquent
  - Rejeter les décorations qui empêchent de voir l'écart à traiter
---

# Une question par écran

Un tableau de bord actionnable sert à **décider ou à déclencher un geste**, pas à prouver que l'entreprise possède beaucoup de données. S'il faut une phrase pour dire ce que l'écran tranche, la phrase est la spécification. S'il en faut trois, vous avez trois écrans, ou vous n'avez pas fini de cadrer.

Exemples de questions qui tiennent sur un écran.

- « Cette semaine, le chiffre d'affaires HT est-il dans la trajectoire du mois, et quel canal explique l'écart ? »
- « Quels magasins ont un taux de rupture au-dessus du seuil, depuis plus de trois jours ? »
- « L'activation à 7 jours des inscrits d'hier est-elle dans la bande habituelle ? »

Exemples qui n'en sont pas : « Vue 360 du client », « Pilotage global », « Tous les KPI marketing ». Ces titres annoncent un mur de cartes. Personne n'en sort avec une action, sauf la personne qui a déjà la réponse en tête et cherche une capture pour la soutenir.

Écrivez la question dans le titre de la page, visible sans infobulle. « Trajectoire du mois : où est l'écart ? » oriente mieux que « Dashboard commercial v3 ». Le lecteur pressé, en comité ou sur son téléphone entre deux magasins, doit savoir s'il est au bon endroit.

> [!IMPORTANT]
> Si deux métiers ne prennent pas la même décision devant l'écran (la finance surveille la marge, le magasin surveille la rupture), ne les forcez pas sur la même page « pour mutualiser ». Deux questions, deux pages, une source commune.

# Cinq à sept indicateurs

Sur l'écran de décision, tenez-vous à **cinq à sept indicateurs**, pas à cinq à sept familles qui en cachent trente. Chaque indicateur doit pouvoir finir la phrase : « si celui-ci sort de sa bande, nous faisons … ».

Pour la trajectoire commerciale de la semaine, un jeu suffisant :

1. chiffre d'affaires HT cumulé du mois, contre l'objectif au même jour ;
2. écart en valeur, pas seulement en pourcentage ;
3. commandes payées ;
4. panier moyen HT ;
5. part du canal qui contribue le plus à l'écart ;
6. taux de commandes annulées ou remboursées (garde-fou : un CA « en hausse » fait de dossiers qui reviendront) ;
7. fraîcheur, qui n'est pas un indicateur métier mais qui conditionne les six autres.

Le septième emplacement est souvent gaspillé en vanity : nombre de visites sans lien avec la question, note NPS du trimestre, logo de la campagne. Ces chiffres ont une maison, sur un écran ou dans une note. Pas ici.

Préférez l'écart à l'objectif ou à une référence comparable (même jour l'an passé, même jour de semaine) plutôt qu'un nombre nu. « 1,2 M€ » ne dit rien tant que le lecteur n'a pas le repère en tête. « −80 k€ vs trajectoire, soit −6 % » déclenche la suite.

```diagram
type: stack
title: Ce que l'écran de décision contient vraiment
segments:
  - label: Question
    value: 15
    tone: violet
    text: Une phrase, dans le titre
  - label: Écart principal
    value: 25
    tone: amber
    text: Le chiffre qui déclenche
  - label: Décomposition
    value: 30
    tone: blue
    text: Canal, magasin ou offre
  - label: Gardes-fous
    value: 20
    tone: rose
    text: Ce qui ne doit pas se dégrader
  - label: Fraîcheur
    value: 10
    tone: teal
    text: Heure et périmètre
```

Les références (objectif, année précédente) se calculent sur le **même périmètre** que le réalisé : mêmes magasins, hors TVA, hors commandes test. Un objectif annuel collé à côté d'une semaine glissante produit des feux rouges permanents, et plus personne ne les regarde.

# Des filtres qui changent l'action

Un filtre est utile s'il change le geste. Le directeur régional filtre sa région parce qu'il n'agit pas sur les autres. L'analyste filtre le canal parce que la campagne en cours ne concerne que l'e-commerce. Le filtre « civilité du client » sur un écran de trajectoire de chiffre d'affaires ne change aucune action du matin : il occupe une place et invite au tri sélectif en réunion.

Gardez une barre courte.

- **Période**, avec un défaut sensé (mois en cours, ou sept derniers jours complets), jamais « toute l'histoire » qui noie la semaine.
- **Périmètre d'action** : région, enseigne, canal. Idéalement les droits limitent déjà ce que chacun voit, et le filtre ne sert qu'à naviguer à l'intérieur.
- **Un filtre de diagnostic** au plus, clairement nommé.

Le défaut compte plus que la liste. Un écran qui s'ouvre sur une période vide, ou sur un filtre croisé resté actif depuis hier, montre un faux écart. À l'ouverture : période par défaut, aucun magasin isolé, mention « France, tous canaux, hors comptes test ».

N'empilez pas des segments « au cas où ». Chaque filtre supplémentaire multiplie les cas où deux personnes ne parlent pas du même chiffre. Si un découpage sert une fois par trimestre, il vit dans l'exploration, pas sur l'écran quotidien.

# La fraîcheur affichée, le détail au clic

La fraîcheur n'est pas un sujet technique à laisser dans un coin gris de 9 pixels. Elle fait partie de la décision. Placez-la au même endroit sur tous les écrans : « Données du 16 novembre 2026, 06 h 12, fuseau de Paris. Journée en cours non incluse. »

Précisez le **retard connu**. Si les magasins franchisés remontent à J+1, l'écran du matin ne doit pas laisser croire que leur zéro est une absence de ventes. Une phrase vaut mieux qu'une infobulle : « Franchisés : dernier jour complet, hier. Succursales : cette nuit. »

Le **détail au clic** relie le symptôme à ce qu'on peut vérifier. Depuis l'écart du canal e-commerce, un clic ouvre la liste des familles de produits, puis, si le droit le permet, les commandes. Le lecteur ne devrait pas vous réclamer un export pour répondre à « c'est quelles références ? ».

Ce chemin a des règles.

- Il descend d'**un** cran de grain à la fois (canal → famille → référence), pas d'un saut vers une table brute illisible.
- Il garde les filtres de la page, et les montre.
- Il n'expose pas plus de données personnelles que l'action ne l'exige. Voir les références en rupture ne demande pas le nom du client.
- Il s'arrête quand le métier peut agir ou ouvrir un ticket. Le tableau de bord n'est pas l'entrepôt.

> [!TIP]
> Testez le chemin avec la question réelle : « Le canal est en retard, qu'est-ce que j'ouvre ensuite ? » Si la réponse est « j'envoie un message à l'analyste », l'écran n'est pas fini.

# Éviter le sapin de Noël

Le sapin de Noël est un écran où chaque indicateur a sa couleur, sa jauge, son icône et sa flèche. Rien ne ressort, parce que tout crie. Le lecteur décroche ou, pire, picore la carte verte qui l'arrange.

Réservez la couleur à l'**état par rapport à la décision**.

- Un seul rouge, pour l'écart qui dépasse le seuil convenu (par exemple trajectoire en retard de plus de 5 % et de plus de 20 k€ : les deux, pour ne pas hurler sur un petit magasin).
- Un neutre pour le reste.
- Pas de dégradé arc-en-ciel sur une carte de France si la question n'est pas géographique.
- Pas de jauge ronde pour un chiffre qui se lit mieux en grand, avec son écart en dessous.

Le fond reste calme. Les titres disent l'unité (€ HT, commandes, %). Les axes des graphiques commencent à zéro pour les barres de montant. Une courbe peut zoomer, à condition que l'échelle soit évidente et que vous ne compariez pas deux courbes aux axes différents pour « faire voir » un lien.

Enlevez aussi le décor qui vieillit mal : captures de campagne, texte d'accueil « bonjour », compteur de visiteurs du rapport. Chaque pixel qui ne répond pas à la question du titre est un pixel qui la concurrence.

Relisez l'écran à un mètre, ou en réduisant la fenêtre. Vous devez voir, dans l'ordre : la question, l'écart, le lieu de l'écart, la fraîcheur. Si vous voyez d'abord une jauge, recommencez.

```video
url: https://www.youtube.com/watch?v=t3cAUt7sOQg
title: "12 Dashboard design tips for better data visualization"
channel: "Geckoboard"
duration: "9:51"
lang: en
why: "Douze conseils concrets de conception de tableaux de bord, dont beaucoup recoupent les règles de ce chapitre."
```

# Exercices

## Exercice 1 : Découper le mur de cartes

On vous transmet une page unique intitulée « Pilotage » avec 22 cartes : CA, marge, NPS, ruptures, heures caisses, e-mails envoyés, taux d'ouverture, météo des ventes, note Google, effectifs, CA par m², etc. Le rendez-vous du lundi sert à savoir si la semaine commerciale tient la trajectoire du mois. Que gardez-vous sur cet écran, et où va le reste ?

<details>
<summary>Voir la solution</summary>

L'écran du lundi ne garde que la question de trajectoire : CA HT cumulé vs objectif au même jour, écart en euros, commandes, panier, contribution des canaux à l'écart, garde-fou retours / annulations, fraîcheur. Cela fait six ou sept emplacements.

Le NPS, la note Google, les effectifs et le taux d'ouverture d'e-mails répondent à d'autres décisions, à d'autres rythmes. Ils partent sur d'autres pages, ou hors du tableau de bord quotidien. Les heures de caisse et les ruptures peuvent devenir le **détail au clic** ou un second écran « pourquoi le magasin décroche », pas des cartes de plus sur la première page.

Le titre devient la question, pas « Pilotage ».

</details>

## Exercice 2 : Un filtre de trop

Le tableau de bord « ruptures de plus de trois jours » a ces filtres : région, magasin, famille, couleur, taille, fournisseur, saison, genre, prix moyen, note client. Les chefs de rayon disent qu'ils ne l'ouvrent plus. Quels filtres gardez-vous par défaut, et que faites-vous des autres ?

<details>
<summary>Voir la solution</summary>

Par défaut : région (ou droits déjà limités à la région), et éventuellement la famille si le chef de rayon n'agit que sur la sienne. Période implicite : ruptures encore ouvertes depuis plus de trois jours, déjà dans la définition, pas un filtre libre qui permet de « cacher » les vieux dossiers.

Couleur, taille, fournisseur, saison, genre, prix et note client sont des explorations. Ils alourdissent l'écran et permettent de faire disparaître une rupture gênante en réunion. Vous les laissez sur un écran de détail, après le clic sur le magasin ou la famille, là où ils servent à préparer une commande fournisseur.

Vous fixez un état d'ouverture propre : aucun filtre résiduel, compteur de références en alerte visible sans clic.

</details>

## Exercice 3 : Où est le clic utile ?

L'écran montre « e-commerce, −80 k€ vs trajectoire ». Au clic, il ouvre une page de 40 indicateurs marketing. Le responsable e-commerce demande encore un export des familles. Proposez le chemin de détail et dites ce que vous retirez.

<details>
<summary>Voir la solution</summary>

Chemin : écart du canal → familles triées par contribution à l'écart (réalisé contre référence, même périmètre HT) → références de la famille → arrêt. Les filtres de période et de canal restent affichés. La fraîcheur aussi. Pas de noms de clients.

Vous retirez la page fourre-tout de 40 indicateurs du chemin principal. Elle peut exister pour une revue marketing mensuelle, mais elle ne répond pas à « où sont les 80 k€ ? ». Tant que le clic ne montre pas les familles, l'écran n'est pas actionnable : il sous-traite l'analyse à un export.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Tableaux de bord actionnables
center: Un écran répond à une question, montre l'écart, et emmène au détail qui permet d'agir.
points:
  - icon: target
    title: Une question
    text: Dans le titre. Deux décisions différentes, ce sont deux pages.
  - icon: gauge
    title: Cinq à sept
    text: Chaque indicateur déclenche un geste. L'écart bat le nombre nu.
  - icon: filter
    title: Filtres utiles
    text: Période et périmètre d'action. Le défaut d'ouverture doit être sain.
  - icon: clock
    title: Fraîcheur
    text: Jour, heure, fuseau, ce qui n'est pas encore inclus. Visible sans infobulle.
  - icon: eye
    title: Calme visuel
    text: La couleur marque le seuil franchi. Le reste ne clignote pas.
pitfall: Ajouter une carte parce que la donnée existe, jusqu'à ce que plus personne n'ouvre la page.
remember: Si le lecteur ne voit pas la question, l'écart et l'heure des données, l'écran n'est pas prêt.
```
