---
title: Lire la finance, le marketing et les opérations
description: "CA, marge, coût d'acquisition, LTV à hauteur d'analyste, stock, délai, et lecture d'un compte de résultat simple sans devenir comptable."
duration: 55
objectives:
  - "Lire un compte de résultat simplifié jusqu'au résultat d'exploitation"
  - "Calculer un coût d'acquisition sans y mélanger la dépense de fidélisation"
  - "Estimer une LTV en la présentant comme un ordre de grandeur fragile"
  - "Relier couverture de stock et délai réel à une décision opérationnelle"
---

# Le chiffre d'affaires n'est pas le bénéfice

Le **chiffre d'affaires** (CA) est la somme vendue sur une période, pas ce qu'il reste à l'entreprise. Pour un analyste, la première ligne de défense est le périmètre, écrit sous le nombre :

- **HT ou TTC.** Dans ce chapitre, tout est hors taxes. Un CA TTC comparé à des achats HT fabrique une marge imaginaire.
- **La date.** Commande, facture ou livraison ne tombent pas le même mois. Lumen aligne ici le CA sur les **commandes livrées**.
- **Les avoirs.** Un retour concédé diminue le CA. L'oublier gonfle les ventes du mois et la marge du mois suivant, quand l'avoir tombe.
- **Ce qui n'est pas une vente.** Subventions, refacturations internes, produits exceptionnels : s'ils sont dans la ligne, dites-le. Sinon, sortez-les.

Au T2, Lumen livre **1 200 k€ HT**, stable par rapport au T1. Cette stabilité n'empêche pas l'entreprise d'aller moins bien : la marge brute passe de 58 % à 52 %. Un reporting qui s'arrête au CA conclut « trimestre tenu ». Un reporting qui s'arrête une ligne plus bas conclut « on a acheté le CA avec de la remise ».

Vous n'avez pas besoin d'être comptable pour poser ces questions. Vous en avez besoin pour ne pas présenter 1,2 M€ comme un résultat.

# Marge et compte de résultat simplifié

La **marge brute** est ce qui reste du CA après le coût des marchandises vendues (achats des produits livrés, fret pour les amener au dépôt). Elle parle du prix, de la remise, du mix et des achats. Elle ne paie pas encore les salaires du siège ni la publicité.

Le **compte de résultat** (souvent appelé P&L, *profit and loss*) empile ensuite les autres coûts jusqu'à un résultat. Voici une version **de gestion**, volontairement courte, pour le T2 de Lumen. Ce n'est pas une liasse fiscale : pas d'impôt, pas de détail d'amortissement, pas d'exceptionnel. C'est assez pour voir la structure, pas assez pour certifier les comptes.

| Ligne | k€ | % du CA |
|---|---|---|
| CA HT livré | 1 200 | 100 % |
| Achats et fret entrant | 576 | 48 % |
| **Marge brute** | **624** | **52 %** |
| Marketing et ventes | 144 | 12 % |
| Livraison clients | 72 | 6 % |
| Frais généraux (support, loyer, outils) | 252 | 21 % |
| **Résultat d'exploitation** | **156** | **13 %** |

Vérification : 1 200 − 576 = 624. Puis 624 − 144 − 72 − 252 = 156. Et 156 / 1 200 = 13 %. Si votre total ne retombe pas, une ligne est comptée deux fois ou un signe est inversé. Faites cette soustraction avant d'interpréter.

Comment lire en analyste, sans jouer au contrôleur de gestion :

- La marche **CA → marge brute** est l'histoire commerciale et achats. Ici, 52 % contre 58 % au T1, à CA égal : environ 72 k€ de marge en moins. C'est le sujet des remises, pas le sujet du loyer.
- La **livraison clients** (72 k€) est un coût variable : elle suit les colis. Elle n'est pas dans la marge brute de ce tableau. Si vous la laissez dans les frais généraux, vous croirez le siège trop lourd et la logistique gratuite.
- Les **frais généraux** de 252 k€ ne « s'optimisent » pas en pourcentage magique. En montant, demandez ce qui a bougé (un recrutement, un entrepôt). En pourcentage du CA, ils montent mécaniquement si le CA baisse, même si la dépense est fixe.
- Le **résultat d'exploitation** de 156 k€ est ce qui reste après ces lignes. Il peut baisser alors que la marge brute tient, si le marketing ou le siège a grossi. Il peut tenir alors qu'une région est en perte, si une autre compense. Le total groupe ne dispense pas de la coupe par région vue dans les chapitres précédents.

```diagram
type: stack
title: "Où vont 1 200 k€ de CA au T2"
segments:
  - label: Achats et fret
    value: 576
    tone: rose
    text: "48 % du CA, avant toute marge"
  - label: Marketing et ventes
    value: 144
    tone: violet
    text: "12 %. Acquisition et fidélisation sont encore mélangées"
  - label: Livraison clients
    value: 72
    tone: amber
    text: "6 %. Coût variable, à ne pas cacher dans les frais généraux"
  - label: Frais généraux
    value: 252
    tone: blue
    text: "21 %. Plutôt fixes à court terme"
  - label: Résultat d'exploitation
    value: 156
    tone: teal
    text: "13 %. Ce n'est pas la marge brute"
```

> [!WARNING]
> Ne soustrayez pas un coût deux fois. Si le fret entrant est déjà dans les achats, il ne réapparaît pas en livraison clients. Demandez une fois, par ligne, « qu'est-ce qui est dedans ? ». Cette question remplace beaucoup de technique comptable.

# Le coût d'acquisition

Le **coût d'acquisition** (CAC, *customer acquisition cost*) est la dépense engagée pour obtenir un **nouveau** client, divisée par le nombre de nouveaux clients. Le tout sur la même période, avec la même définition de « nouveau ».

Chez Lumen, « nouveau » veut dire : compte dont la **première** livraison tombe au T2. Il y en a **120**. La ligne marketing et ventes fait 144 k€, mais elle mélange deux intentions : **96 k€** pour acquérir (annonces, commission au premier contrat, mise en route des nouveaux) et **48 k€** pour accompagner les comptes déjà clients. 

CAC = 96 000 / 120 = **800 €** par nouveau compte livré.

Si vous divisez les 144 k€ entiers, vous affichez 1 200 €. Vous avez fait payer à l'acquisition le coût de la fidélisation. Le CAC « s'est dégradé » sans qu'aucune campagne n'ait changé. L'erreur inverse existe : sortir du CAC la commission des commerciaux « parce que c'est du salaire » alors qu'elle n'est versée qu'à la signature d'un nouveau logo. Vous sous-estimez alors ce qu'il en coûte vraiment d'obtenir un compte.

Trois précautions suffisent à votre niveau :

1. **Écrire la liste** de ce qui est dans les 96 k€, pas seulement le total.
2. **Aligner les dates.** Une campagne de juin dont les comptes sont livrés en juillet ne se divise pas par les livraisons de juin. Décalez, ou indiquez que le chiffre est provisoire.
3. **Ne pas diviser par les leads.** 96 k€ / 240 comptes créés = 400 € par fiche, ce n'est pas un CAC client. La moitié de ces fiches n'est pas activée. Décidez si le dénominateur est le compte créé, le compte livré, ou le compte encore actif à 90 jours, et gardez-le d'un trimestre à l'autre.

# La LTV, en ordre de grandeur

La **LTV** (*lifetime value*) est une estimation de ce qu'un client rapporte sur toute sa relation avec l'entreprise. Les versions financières complètes actualisent les flux, prévoient le risque et le taux de marge futur. Vous n'avez pas à les produire. Vous avez à ne pas présenter un ratio comme une vérité comptable.

Version analyste, assumée comme un **raccourci** :

1. Partez de la contribution, pas du CA. Au T2, CA 1 200 k€, moins achats 576 k€, moins livraison clients 72 k€, soit **552 k€** de contribution après coûts variables.
2. Rapportez-la aux comptes servis : 552 000 / 400 comptes actifs ≈ **1 380 €** de contribution par compte actif et par trimestre.
3. Estimez une durée. Les cohortes assez anciennes de Lumen restent commanditaires environ **4 trimestres** en moyenne. Cette durée est observée, pas promise.
4. LTV ≈ 1 380 × 4 = **5 520 €** de contribution par compte.

Face au CAC de 800 €, le rapport LTV / CAC vaut environ **6,9**. Le retour sur la dépense d'acquisition (*payback*) vaut 800 / 1 380 ≈ **0,6 trimestre** dans ce raccourci. Beaucoup d'équipes de croissance citent, comme repère de conversation, un rapport supérieur à 3 et un retour en moins de 12 mois. Lumen semble à l'aise **dans ce raccourci**. Votre travail est d'en montrer les fissures avant que le comité n'augmente le budget.

Fissures à dire à voix haute :

- Les 1 380 € sont la moyenne des **comptes déjà là**, pas celle des 120 nouveaux, souvent plus remisés. Si les nouveaux ne font que 60 % de cette contribution, on tombe vers 830 € par trimestre, soit environ 3 300 € sur 4 trimestres, et un rapport proche de 4. Encore correct, déjà moins spectaculaire.
- Les 4 trimestres ignorent les cohortes récentes, dont on ne connaît pas la fin. Allonger la durée parce que « les meilleurs clients restent cinq ans » est le biais de survie, traité au chapitre des cohortes.
- Les **252 k€ de frais généraux** ne sont pas dans la LTV. Un rapport de 6,9 ne veut pas dire que l'on peut dépenser 5 520 € pour acquérir un compte : le siège doit encore être payé.
- Aucune actualisation, aucun taux de retour au-delà des avoirs déjà déduits, aucun scénario de hausse du coût d'achat.

Vous pouvez donc écrire : « Ordre de grandeur, contribution après coûts variables, environ 5 500 € sur 4 trimestres observés, soit près de 7 fois le CAC de 800 €. Ce n'est pas une LTV certifiée. Avant d'augmenter l'acquisition, vérifier la contribution des **nouveaux** comptes. »

Cette phrase est au bon niveau. En deçà, le ratio est un slogan. Au-delà, vous empiétez sur le contrôle de gestion sans en avoir le mandat.

# Stock et délai

Les opérations se lisent avec deux grandeurs simples : combien de temps le stock couvre les ventes, et combien de temps le client attend vraiment.

**Couverture de stock**, en unités, pour ne pas mélanger des euros de valeur d'achat et des euros de prix de vente :

| Référence | Stock | Ventes / mois | Couverture | Délai fournisseur |
|---|---|---|---|---|
| Rail 1,5 m | 1 800 | 450 | 1 800 / 450 = **4 mois** | 10 semaines, soit environ 2,3 mois |
| Driver 40W | 200 | 400 | 200 / 400 = **0,5 mois** | 6 semaines, soit environ 1,4 mois |

Le rail est couvert plus longtemps que son réapprovisionnement : pas d'urgence, et même une question de surstock si la vente ralentit. Le driver ne couvre pas deux semaines, alors qu'il en faut six pour être livré par le fournisseur. La rupture est déjà dans les chiffres, avant le premier ticket client. La couverture n'est pas une performance à maximiser. Trop courte, vous cassez la promesse. Trop longue, vous immobilisez du cash que la LTV, plus haut, ne voit pas.

Le **délai** client se raconte en distribution, pas en seule moyenne. Promesse commerciale : 5 jours. Sur les commandes du mois : médiane **6 jours**, moyenne **9 jours**, 90e centile **18 jours** (90 % des commandes font mieux que 18 jours, 10 % font pire). La moyenne à 9 jours est tirée par la queue, en particulier les commandes qui attendent un driver. Dire « nous livrons en 9 jours » fait croire à un retard homogène de 4 jours sur la promesse. La médiane dit « la commande typique est à peu près dans les clous ». Le 90e centile dit « une commande sur dix attend plus de deux semaines ».

L'action suit cette coupe : réapprovisionner le driver, pas réécrire toute la promesse à 9 jours. Vous vérifiez ensuite que le 90e centile redescend. Si seule la moyenne bouge, la queue est peut-être encore là.

> [!TIP]
> Couverture = stock / débit de ventes, **dans la même unité**, sur un débit récent et réaliste. Un débit de décembre utilisé en août, ou un stock en unités divisé par un CA en euros, donne un nombre de mois qui n'existe pas.

# Ce que vous concluez, et ce que vous laissez

Vous pouvez, avec ce niveau de lecture, soutenir une décision de comité :

- le CA stable de 1,2 M€ coexiste avec une marge brute à 52 % et un résultat d'exploitation à 13 % du CA ;
- le CAC des nouveaux comptes livrés est d'environ 800 € si l'on retire l'accompagnement des clients existants ;
- la LTV en contribution est un ordre de grandeur autour de 5 500 €, trop fragile pour justifier seul une hausse de budget ;
- le driver 40W ne couvre pas son délai fournisseur, et cela se voit dans la queue des délais clients.

Vous ne signez pas les comptes, vous ne choisissez pas le traitement comptable d'un contrat pluriannuel, vous ne décidez pas si une dépense est une charge ou un investissement amortissable. Quand la question devient « est-ce du chiffre d'affaires au sens de la norme ? », vous la transmettez à la finance avec le périmètre que vous avez utilisé. Votre valeur est ailleurs : rendre les lignes comparables d'un mois à l'autre, refuser un CAC sans liste de coûts, et relier un délai p90 à une référence en stock plutôt qu'à une moyenne confortable.

# Exercices

## Exercice 1 : Lire le résultat

Une activité mensuelle, en k€ : CA HT 300, achats 150, marketing 30, livraison 15, frais généraux 60. Le commentaire joint dit : « marge 50 %, l'entreprise garde la moitié du CA ».

1. Calculez la marge brute et le résultat d'exploitation, en k€ et en % du CA.
2. Que corrigez-vous dans le commentaire ?
3. Quelle question posez-vous si, le mois suivant, le CA double et les frais généraux restent à 60 ?

<details>
<summary>Voir la solution</summary>

1. Marge brute = 300 − 150 = **150 k€**, soit **50 %**. Résultat d'exploitation = 150 − 30 − 15 − 60 = **45 k€**, soit **15 %** du CA.

2. « Garde la moitié du CA » décrit la marge brute, pas ce qui reste après marketing, livraison et siège. Il reste 45 k€, pas 150. Les deux mots « marge » ne sont pas interchangeables.

3. Les frais généraux sont sans doute en grande partie **fixes**. S'ils restent à 60 pendant que le CA passe à 600, leur poids en % baisse, et le résultat s'améliore même si la marge brute en % est identique. Vous vérifiez qu'ils sont bien fixes (pas un oubli de facture) avant de parler d'un gain de productivité.

</details>

## Exercice 2 : Deux CAC pour le même trimestre

Dépense marketing et ventes : 90 k€, dont 30 k€ d'équipe dédiée aux comptes de plus d'un an. Nouveaux comptes livrés : 100. Nouveaux comptes créés, livrés ou non : 250. On vous annonce un CAC de 900 €.

1. D'où peut sortir 900 € ?
2. Quel CAC retenez-vous pour « coût d'un nouveau compte livré », et pourquoi ?
3. Quel décalage de dates rendrait ce CAC trop optimiste ?

<details>
<summary>Voir la solution</summary>

1. 90 000 / 100 = **900 €**. Toute la ligne marketing a été divisée par les seuls comptes livrés. Les 30 k€ de fidélisation des anciens sont inclus à tort.

2. (90 − 30) × 1 000 / 100 = **600 €** par nouveau compte livré. Le dénominateur « livré » correspond à la définition de client acquis. 60 000 / 250 = 240 € serait un coût par fiche créée, à ne pas comparer au CAC de 600 €.

3. Si la dépense du trimestre n'a pas encore produit ses livraisons (cycle de vente plus long que le trimestre), le dénominateur est trop petit plus tard et trop grand maintenant, ou l'inverse selon le sens du décalage. Il faut rapprocher la dépense des comptes qu'elle a réellement fait entrer, ou marquer le CAC comme provisoire.

</details>

## Exercice 3 : Stock et promesse client

La promesse est de 5 jours. Moyenne observée : 8 jours. Médiane : 5 jours. 90e centile : 20 jours. Une référence a 100 unités en stock, se vend à 200 unités par mois, et le fournisseur met 2 mois à livrer.

1. Quelle est la couverture, et que dit-elle face au délai fournisseur ?
2. Pourquoi « nous sommes à 8 jours, relevons la promesse à 8 » est un mauvais réflexe ?
3. Quel chiffre suivrez-vous après le réapprovisionnement pour savoir si la queue a disparu ?

<details>
<summary>Voir la solution</summary>

1. Couverture = 100 / 200 = **0,5 mois**, soit environ 2 semaines. Le fournisseur en met 2. Le stock sera vide bien avant la réappro. Le risque de rupture est déjà mesurable.

2. La médiane est à 5 jours : la commande typique tient la promesse. La moyenne à 8 est tirée par une minorité très lente (le p90 à 20 jours). Relever la promesse pour tout le monde dégrade l'offre à cause de la queue, sans traiter la référence en rupture.

3. Le **90e centile** du délai, et la couverture de cette référence. Si la moyenne redescend mais que le p90 reste à 20 jours, la queue est toujours là.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Lire un résultat sans jouer au comptable
center: "CA, marge, CAC, LTV, stock et délai : la structure suffit pour décider, à condition d'écrire ce qui est dans chaque ligne."
points:
  - icon: money
    title: CA puis marge
    text: "1 200 k€ de CA HT n'est pas le bénéfice. La marge brute tombe à 52 % avant les frais."
  - icon: layers
    title: Le P&L simple
    text: "Achats, marketing, livraison, frais généraux, résultat. Une soustraction qui ne retombe pas est une ligne mal lue."
  - icon: target
    title: CAC
    text: "Dépense d'acquisition divisée par les nouveaux clients, même définition. 96 k€ / 120 comptes = 800 €."
  - icon: gauge
    title: LTV fragile
    text: "Contribution × durée observée, en ordre de grandeur. Les frais fixes et les nouveaux comptes peuvent changer le ratio."
  - icon: clock
    title: Stock et délai
    text: "Couverture en unités contre délai fournisseur. Médiane et p90, pas seulement la moyenne qui flatte."
pitfall: "Diviser tout le marketing par les nouveaux clients, ou prendre un rapport LTV/CAC pour un feu vert comptable."
remember: "Vous rendez les lignes comparables et vous transmettez à la finance dès que la question devient une norme comptable."
```
