---
title: "Modèle et mesures d'un cas retail"
description: "Construire l'étoile d'un réseau de magasins et six mesures de pilotage : CA, marge, panier, N-1, objectif et taux de rupture."
duration: 50
objectives:
  - Dessiner une étoile retail au grain des décisions, pas au grain de la caisse
  - Définir six mesures dont les ratios et les objectifs ne se somment pas n'importe comment
  - Repérer les doubles comptes (retours, objectifs, ruptures)
  - Contrôler chaque mesure sur un mois de référence avant d'ouvrir un visuel
---

# Le cas Atelier Nord

Atelier Nord est une enseigne fictive d'ameublement, une trentaine de magasins intégrés, quatre régions. La décision du lundi : le mois est-il en ligne avec l'objectif de CA et de marge, et où agir. La page direction n'a pas besoin des lignes de caisse. Elle a besoin de six mesures stables.

Les sources utiles, déjà nettoyées pour ce chapitre :

- les **lignes de tickets** (date, magasin, produit, ticket, montant HT net des retours, coût HT, quantité) ;
- les **magasins** (région, ouvert ou non) ;
- les **produits** (famille) ;
- les **objectifs** votés (mois, magasin, objectif de CA, objectif de marge) ;
- le **stock du matin** (jour, magasin, produit, en rupture oui ou non).

Les franchises ne sont pas dans ces fichiers. Les montants sont déjà hors taxes, retours déduits (un retour est un montant négatif sur un ticket). Le fuseau est celui des magasins, l'Europe de Paris. Ce contrat est celui du cadrage. On ne le rediscute pas dans la formule.

# L'étoile

L'étoile sépare ce que l'on **somme** et ce par quoi l'on **découpe**.

```diagram
type: layers
title: "Étoile Atelier Nord"
layers:
  - title: "Dimensions"
    text: "Date, magasin (avec sa région), produit (avec sa famille)"
  - title: "Fait ventes"
    text: "Une ligne de ticket : montant HT, coût, quantité, n° de ticket"
  - title: "Fait objectifs"
    text: "Une ligne par mois et par magasin : objectif CA, objectif marge"
  - title: "Fait rupture"
    text: "Une ligne par jour, magasin et produit : rupture oui ou non"
```

Relations : ventes vers date, vers magasin, vers produit. Objectifs vers le mois (ou vers la date de début de mois) et vers magasin. Rupture vers date, magasin, produit. Sens unique, du fait vers la dimension. On ne relie pas les faits entre eux.

Le **numéro de ticket** reste sur le fait ventes. Il sert à compter les tickets. Ce n'est pas une dimension à partir de laquelle on filtre le stock. Mélanger stock et ventes dans une seule table « pour simplifier » casse un des deux grains : le stock n'a pas de ticket, l'objectif n'a pas de produit.

On masque les clés techniques. On garde visibles région, magasin, famille, mois, et les mesures ci-dessous.

> [!IMPORTANT]
> L'objectif ne doit pas être copié sur chaque ligne de ticket. Sinon un magasin qui a beaucoup de lignes « a » un plus gros objectif. L'objectif vit à son grain : mois × magasin.

# CA et marge

**CA HT** est la somme du montant HT net. Les retours, déjà négatifs, diminuent le total. On ne filtre pas une seconde fois « hors retours », sinon on les retire deux fois si un drapeau existe en plus du montant signé. On le vérifie : le total de mars doit tomber sur le chiffre convenu avec le contrôle de gestion, au centime près sur le mois de référence.

**Marge €** est la somme du montant HT moins le coût HT, sur les mêmes lignes. Une remise qui réduit le montant réduit la marge. Un coût manquant ne doit pas devenir zéro en silence : une ligne sans coût est une alerte de qualité, pas une marge de 100 %.

**Taux de marge** = marge € / CA HT, au grain de la case (mois, région, magasin). On ne moyenne pas les taux de marge de chaque magasin. Un petit magasin à 50 % ne pèse pas comme un grand à 30 %. Si le CA de la case est nul, le taux est vide, pas une erreur affichée en comité.

Ces deux sommes sont additives : la marge de la région est la somme des marges des magasins. Le taux, lui, ne s'additionne pas. On le réaffiche calculé, on ne le stocke pas pour le resommer.

# Panier et N-1

**Panier moyen** = CA HT / nombre distinct de tickets, au grain de la question. Le numéro de ticket est compté en distinct, pas en nombre de lignes. Deux lignes du même ticket font un seul panier.

Contrôle sur un jeu minuscule : un ticket de 80 € en deux lignes et un ticket de 20 € donnent un panier de 50 €, pas de 33 €. Si la feuille par famille donne autre chose, on ne l'appelle plus panier (le ticket est dans plusieurs familles). La page direction porte le panier **réseau ou magasin**, pas un panier par famille, sauf mention explicite.

**CA N-1** est le CA HT de la période décalée d'un an, sur le même calendrier (mars N contre mars N-1), mêmes filtres de magasin et de famille. Ce n'est pas le CA du mois précédent. On aligne les jours : comparer 31 jours à 28 jours se dit, ou l'on compare des mois civils entiers, comme la revue le fait vraiment.

L'écart N-1 = CA HT − CA N-1, et le taux d'évolution = cet écart / CA N-1. Un magasin ouvert cette année n'a pas de N-1 : on ne le met pas à zéro dans le dénominateur de toute la région sans le dire. On peut montrer le CA des magasins comparables à part. Pour ce cas, les magasins de l'exemple existaient déjà l'an dernier : le comparable est le réseau entier.

Le N-1 suit les **mêmes règles** que le CA (HT, retours, hors franchises). Un N-1 bricolé dans un classeur sur un autre périmètre n'est pas la mesure.

# Objectif et rupture

**Objectif CA** somme la table d'objectifs au grain mois × magasin. Filtrer la région filtre les magasins, donc leurs objectifs. On ne répartit pas l'objectif sur les jours sauf si un objectif quotidien a été voté, ce qui n'est pas le cas ici. Une page « au 15 du mois » compare alors le CA réalisé au **mois**, et dit « objectif mensuel », pas un objectif prorata inventé. Si le comité veut un prorata, c'est une règle écrite (par exemple linéaire sur les jours ouverts), une septième mesure, pas un ajustement oral.

L'écart à l'objectif = CA HT − objectif CA. Il n'a de sens qu'au grain où l'objectif existe. Au grain produit, il est vide : il n'y a pas d'objectif par produit dans ce cas.

**Taux de rupture** = nombre de lignes stock en rupture / nombre de lignes stock observées, sur le grain jour × magasin × produit. Une ligne observée est un produit suivi ce jour-là dans ce magasin. On n'utilise pas les ventes pour deviner la rupture (un produit non vendu n'est pas forcément en rupture). Le taux du mois est le ratio des comptes sur tous les jours du mois, pas la moyenne des taux quotidiens si les jours n'ont pas le même nombre de références suivies. En pratique les deux sont proches ; on documente le choix « ratio des comptes » et on s'y tient.

Le seuil d'alerte convenu est 4 %. La mesure ne peint pas en rouge toute seule. Elle rend le taux. La page écrit « seuil 4 % ».

```text
CA HT            = somme(montant HT net)
Marge €          = somme(montant HT net - coût HT)
Panier moyen     = CA HT / tickets distincts
CA N-1           = CA HT, même périmètre, un an avant
Objectif CA      = somme(objectif), grain mois × magasin
Taux de rupture  = lignes en rupture / lignes observées
```

# Contrôler avant le visuel

Chaque mesure a un **chiffre de mars** noté avec le contrôle de gestion, avant la première page. Exemple d'ordre de grandeur pour le réseau, à titre de méthode (les vôtres viendront des fichiers) : on fige CA, marge, nombre de tickets, donc panier, CA N-1, somme des objectifs, taux de rupture. On rejoue le même mois filtré sur une région. Le CA région est plus petit. L'objectif région est la somme des objectifs des magasins de la région, pas l'objectif réseau.

Pièges à cocher :

- retours comptés deux fois ;
- objectif multiplié par les lignes de tickets ;
- panier = moyenne des lignes ;
- N-1 sur un calendrier qui ne filtre pas la même région ;
- rupture calculée seulement sur les produits vendus ;
- taux de marge moyen des magasins.

> [!TIP]
> Écrivez les sept nombres de contrôle (les six mesures plus le nombre de tickets) dans la fiche du jeu. La recette les relit. Un visuel ne se discute pas tant qu'ils bougent.

La page viendra ensuite. Elle n'a pas le droit d'inventer une septième arithmétique dans un titre.

# Exercices

## Exercice 1 : Placer l'objectif

Un collègue propose d'ajouter `objectif_ca` sur chaque ligne de ticket, « comme ça tous les graphiques l'ont ». Le magasin A a 10 000 lignes et un objectif de 100 000 €. Le magasin B a 1 000 lignes et le même objectif. Que se passe-t-il si l'on somme cette colonne, et quelle est la bonne étoile ?

<details>
<summary>Voir la solution</summary>

Sommer la colonne recopiée donne 10 000 × 100 000 pour A et 1 000 × 100 000 pour B. L'objectif est écrasé par le volume de lignes. A paraît avoir un objectif dix fois plus gros.

L'objectif reste dans le **fait objectifs**, une ligne par mois et par magasin. La mesure somme cette table. Le filtre magasin ou région passe par la dimension magasin, partagée avec les ventes. On ne joint pas l'objectif aux lignes de ticket.

Contrôle : la somme des objectifs du réseau égale la somme des objectifs des magasins, une seule fois.

</details>

## Exercice 2 : Deux tickets pour le panier et la marge

Ticket T1 : deux lignes, 40 € et 60 €, coûts 20 € et 30 €. Ticket T2 : une ligne, 20 €, coût 10 €. Un retour T3 : −10 €, coût −4 €. Calculez CA HT, marge €, taux de marge, nombre de tickets, panier. Dites ce que donnerait à tort une moyenne des trois lignes de vente hors retour.

<details>
<summary>Voir la solution</summary>

CA HT = 40 + 60 + 20 − 10 = **110 €**.

Marge € = (40−20) + (60−30) + (20−10) + (−10−(−4)) = 20 + 30 + 10 − 6 = **54 €**.

Taux de marge = 54 / 110, pas la moyenne des taux de lignes.

Tickets distincts : T1, T2 et T3, soit **3** si le retour a son propre ticket. Panier = 110 / 3. (Si le contrat dit « tickets de vente hors tickets de retour », il faut l'écrire : alors 2 tickets et un CA qui inclut quand même le retour. On ne mélange pas les deux règles. Ici le retour est un ticket : on le compte, le contrat doit le dire dans la fiche.)

Une moyenne naïve des trois lignes hors retour (40, 60, 20) donne 40 €, ce qui n'est ni le panier ni le CA. Elle ignore le retour et compte les lignes.

Le choix « le retour compte comme un ticket » doit être dans le contrat. L'exercice sert à le **forcer** avant la page. Si le comité ne veut pas compter T3 dans le dénominateur, la mesure devient : tickets distincts dont le type est vente, CA net incluant les retours. Les deux nombres changent. On fige l'un des deux, pas les deux en même temps.

</details>

## Exercice 3 : Le taux de rupture du mois

Lundi : 100 références observées, 10 en rupture. Mardi : 200 références observées, 10 en rupture. Quelqu'un propose la moyenne de 10 % et 5 %, soit 7,5 %. Quel taux retenez-vous, et pourquoi ne pas le calculer à partir des ventes ?

<details>
<summary>Voir la solution</summary>

Ratio des comptes : (10 + 10) / (100 + 200) = **20 / 300**, soit environ 6,7 %, pas 7,5 %. La moyenne des taux donne le même poids aux deux jours alors que mardi suit deux fois plus de références.

On documente « ratio des comptes sur le mois » et le contrôle de gestion fige ce nombre. La page ne montre pas 7,5 un lundi et 6,7 le suivant.

On ne prend pas les ventes : un produit absent des tickets peut être en stock, et un produit en rupture peut avoir vendu le matin. La source est le fait stock du matin, pas le fait ventes.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Étoile et six mesures
center: "Six mesures au bon grain. L'objectif n'est pas recopié sur les tickets. Le ratio se recalcule."
points:
  - icon: layers
    title: Trois faits
    text: Ventes, objectifs au mois × magasin, rupture au jour × magasin × produit.
  - icon: money
    title: CA et marge
    text: Sommes additives. Le taux de marge divise, il ne moyenne pas les magasins.
  - icon: chart
    title: Panier et N-1
    text: Tickets distincts. N-1, même contrat, un an avant, pas le mois précédent.
  - icon: target
    title: Objectif
    text: Une ligne par mois et magasin. Vide au grain produit s'il n'existe pas.
  - icon: alert
    title: Rupture
    text: Lignes en rupture sur lignes observées. Pas la moyenne naïve des taux.
  - icon: check
    title: Mois témoin
    text: Sept nombres figés avant le premier visuel, puis une région pour vérifier le filtre.
pitfall: Copier l'objectif sur chaque ligne de ticket. Le magasin bavard hérite d'un objectif gonflé.
remember: Un taux se recalcule au grain de la case. On ne stocke pas une moyenne pour la resommer.
```
