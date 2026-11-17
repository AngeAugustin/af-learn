---
title: Segments et cohortes d'inscription
description: "Construire des segments actionnables, lire le RFM en intuition, comparer des cohortes d'inscription au même âge, et éviter le segment trop petit comme le biais de survie."
duration: 60
objectives:
  - "Juger si un segment déclenche une action différente"
  - "Lire récence, fréquence et valeur sans en faire une formule magique"
  - "Comparer des cohortes d'inscription au même âge"
  - "Repérer un segment trop petit et un biais de survie"
---

# Un segment sert à agir

Un **segment** est un groupe de comptes que vous traitez autrement que les autres. S'il ne change ni l'offre, ni le canal, ni le seuil de remise, ni la personne qui appelle, ce n'est pas un segment : c'est une étiquette. Découper la base en huit parts colorées, puis envoyer le même e-mail à toutes, décore le tableau de bord sans piloter.

Un segment actionnable réunit quatre conditions.

- **Il est trouvable.** Vous pouvez sortir la liste depuis les données, avec une règle que quelqu'un d'autre refera. « Les clients qui aiment le design » n'est pas trouvable s'il n'existe aucun champ, aucun comportement, aucun seuil.
- **Il est assez grand pour la décision prévue.** Quinze comptes peuvent justifier quinze appels. Ils ne justifient pas un pourcentage affiché comme une loi. La taille se juge sur l'action, pas sur un effectif universel.
- **Il est joignable.** Vous avez un levier : un commercial nommé, un message, une limite de remise, un réapprovisionnement. Un groupe que vous ne pouvez pas traiter autrement reste une observation.
- **L'action est différente.** Le segment « Est, marge sous 45 %, au moins trois commandes sur douze mois » n'a de sens que si ces comptes ne reçoivent pas la remise générique de 10 % proposée à tout le fichier.

**Exemple Lumen.** Cette règle sort **15 comptes** à l'Est, pour **180 k€** de CA sur douze mois. L'action est une revue commerciale sous quinze jours, avec plafond de remise, pas une campagne nationale. Le segment est petit en nombre et lourd en euros : on le traite comme une **liste**, pas comme un taux à un chiffre après la virgule.

À l'inverse, « tous les comptes créés un mardi » est trouvable, parfois grand, et inutile : vous n'avez rien de différent à leur dire. La première question n'est pas « combien de segments puis-je faire ? ». C'est « quelle décision change si ce groupe existe ? ».

```diagram
type: compare
title: "Segment qui pilote, segment qui décore"
columns:
  - title: Actionnable
    tone: teal
    items:
      - "Règle refaisable sur les données"
      - "Une action que les autres ne reçoivent pas"
      - "Un propriétaire et une date"
  - title: Décoratif
    tone: amber
    items:
      - "Le même message pour chaque part"
      - "Une étiquette sans seuil chiffré"
      - "Personne ne sort la liste lundi"
  - title: Introuvable
    tone: violet
    items:
      - "Le critère n'est pas dans les données"
      - "On ne peut pas recompter le groupe"
      - "Deux analystes, deux populations"
  - title: Trop fin
    tone: rose
    items:
      - "L'effectif ne tient pas un pourcentage"
      - "Un compte de plus change la conclusion"
      - "À regrouper, ou à traiter nom par nom"
```

# Le RFM, en intuition

**RFM** classe les comptes selon trois idées, pas selon une formule unique à recopier.

- **Récence** : depuis combien de temps n'ont-ils pas commandé ? Un compte vu il y a 20 jours n'est pas dans le même état qu'un compte silencieux depuis 200 jours.
- **Fréquence** : combien de commandes sur une fenêtre fixe, ici douze mois ? La répétition décrit une habitude. Une seule grosse commande ne suffit pas.
- **Montant** (le M historique, *monetary*) : quelle valeur sur la même fenêtre ? Le CA est le réflexe. Chez Lumen, la **contribution après coûts variables** est plus honnête, parce qu'une remise de 18 % gonfle l'activité et abîme la marge. Si vous n'avez que le CA, utilisez-le, mais écrivez-le. Ne mélangez pas CA et marge dans le même classement sans le dire.

Vous n'êtes pas obligé de calculer des quintiles et une note sur 555 pour que le RFM serve. Des seuils métier, peu nombreux, suffisent. Sur les **600 comptes** qui ont commandé au moins une fois en douze mois :

| Groupe | Règle simple | Effectif | Action différente |
|---|---|---|---|
| Habitués | Dernière commande ≤ 30 jours, ≥ 6 commandes, contribution dans le quart haut | 70 | Proposer un cadre annuel, pas un coupon |
| À rappeler | Dernière commande entre 90 et 180 jours, ≥ 4 commandes auparavant | 80 | Appel du commercial nommé |
| Endormis | Dernière commande > 180 jours, ≥ 4 commandes dans l'année d'avant | 110 | Test de relance mesuré, remise plafonnée |
| Un seul achat | Exactement une commande sur 12 mois | 200 | Pas de programme de fidélité coûteux |

Il reste environ 140 comptes au milieu, qui ne sont dans aucun de ces paquets. C'est normal. Un RFM qui range 100 % de la base dans des cases spectaculaires a des seuils trop mous.

Le compte « projet unique » illustre pourquoi les trois lettres vont ensemble. **40 k€** de CA, une commande, dernière activité il y a **200 jours** : le montant crie « stratégique », la récence et la fréquence disent « ne pas le traiter comme un habitué ». Lui offrir la remise fidélité des 70 habitués subventionne un one-shot et brouille le segment. À l'opposé, un compte à 8 k€ qui commande tous les mois est un habitué même s'il n'est pas le plus gros.

> [!TIP]
> Écrivez la fenêtre (12 mois), la date de référence (fin de T2) et la métrique du M (CA ou contribution). « Nos champions RFM » sans ces trois lignes n'est pas reproductible le trimestre suivant.

# Les cohortes d'inscription

Une **cohorte d'inscription** regroupe les comptes créés à la même période, puis les suit dans le temps. La ligne est le mois de création. La colonne est l'**âge** : mois 0 (le mois de l'inscription), mois 1, mois 2. Vous ne mettez pas en colonne le mois calendaire seul, sinon janvier à M3 et avril à M0 se retrouvent côte à côte sans avoir vécu la même durée.

Ici, l'action suivie est : **au moins une commande livrée pendant le mois d'âge**. Ce n'est pas la rétention « ouverture de l'espace client » du chapitre entonnoir, ni la cohorte des seuls comptes déjà activés. Le dénominateur inclut des inscrits qui n'ont jamais été livrés. Les taux sont donc plus bas, et c'est voulu : une cohorte d'inscription mélange acquisition aboutie et comptes restés au formulaire.

| Cohorte (création) | Comptes | M0 | M1 | M2 | M3 |
|---|---|---|---|---|---|
| Janvier | 80 | 55 % | 40 % | 34 % | 31 % |
| Février | 90 | 42 % | 28 % | 24 % | |
| Mars | 70 | 44 % | 30 % | | |
| Avril | 60 | 46 % | | | |

Lecture utile : **février contre janvier, au même âge**. M0 : 42 % contre 55 %. M1 : 28 % contre 40 %. M2 : 24 % contre 34 %. Février est plus faible à chaque âge déjà observable. En février, l'appel de mise en route a été supprimé. La cohorte ne prouve pas à elle seule que l'appel est la cause (autre chose a pu changer le même mois), mais elle interdit de dire « les inscrits de février vont bien, regardez janvier à M3 ». Janvier à M3 a eu trois mois de plus. Avril n'a pas encore de M1 : la case vide n'est pas un zéro, c'est une donnée pas encore née.

```diagram
type: flow
title: "Lire une cohorte sans mélanger les âges"
steps:
  - title: Entrée
    text: "Date de création du compte. Un autre événement ferait une autre cohorte"
    tone: blue
  - title: Action
    text: "Commande livrée dans le mois d'âge. Écrite, pour ne pas la mêler à une connexion"
    tone: teal
  - title: Diagonale
    text: "Comparer M1 avec M1. La case vide d'avril n'est pas un échec"
    tone: amber
  - title: Effectif
    text: "80, 90, 70, 60 : le pourcentage vient après le nombre de comptes"
    tone: violet
  - title: Hypothèse
    text: "Février décroche à âge égal. On cherche ce qui a changé ce mois-là"
    tone: rose
```

Deux précautions de calendrier. Décembre et août mêlent la saison à la qualité d'inscription : une cohorte de vacances paraît déloyale en janvier si votre métier s'arrête. Notez-le avant de condamner le mois. Et ne calculez pas une « rétention moyenne de la base » en mélangeant le M1 de février et le M3 de janvier : ce nombre ne décrit aucun compte réel.

```video
url: https://www.youtube.com/watch?v=mb2_kskQDDU
title: "What is a Cohort? How to Read a Cohort Analysis Chart..."
channel: "Peel"
duration: "5:32"
lang: en
why: "Comment lire un tableau de cohortes, ligne par ligne et colonne par colonne, en cinq minutes et demie."
```

# Le segment trop petit

Un pourcentage sur un petit groupe bouge trop fort pour porter une stratégie. **8 comptes** d'une niche, **7** ont recommandé : 7 / 8 = **87,5 %**. Un seul compte qui ne revient pas fait passer le taux à 75 %, soit **12,5 points** de moins. À côté, **70 comptes sur 100** dans le segment national, soit **70 %**. La niche a l'air meilleure. Elle est surtout plus bruyante.

Ce n'est pas une interdiction de regarder les 8. C'est une interdiction de **généraliser** à partir d'eux : changer la grille tarifaire, tuer un canal, ou déclarer un marché gagné. Pour une liste d'appels, 8 noms se traitent un par un, sans taux. Pour une décision qui engage un budget, vous regroupez (niche + région voisine), vous allongez la fenêtre (deux trimestres au lieu d'un mois), ou vous attendez.

Le segment Est de 15 comptes et 180 k€ reste légitime **parce que l'action est la liste**, et parce que le montant est assez lourd pour une revue. Il deviendrait illégitime si vous publiiez « 100 % de ces comptes accepteront le cadre annuel » sur la foi de trois rendez-vous. La taille minimale dépend de ce que vous affirmez : un effectif pour une liste, un effectif bien plus grand pour un taux.

> [!WARNING]
> Plus vous croisez de critères (région × gamme × ancienneté × canal × tranche de remise), plus les cases tombent sous dix comptes. Le croisement qui fait plaisir en atelier est souvent celui qu'il faut replier avant la réunion.

# Le biais de survie

Le **biais de survie** consiste à conclure à partir de ceux qui sont encore là, en oubliant ceux que le filtre a fait disparaître. Les survivants ont l'air d'une recette. Ils sont souvent le résultat du filtre.

Quatre formes que vous croiserez :

1. **L'outil réservé aux anciens.** « Les comptes qui utilisent le configurateur avancé ont 80 % de recommande. Rendons-le obligatoire le jour de l'inscription. » Le configurateur n'est proposé qu'après **60 jours** d'activité. Les comptes partis avant ne l'ont jamais vu. Vous comparez des survivants à l'ensemble. L'outil marque peut-être les comptes déjà engagés, il n'a pas montré qu'il crée l'engagement.
2. **La durée de vie des seuls présents.** Calculer « nos clients restent 4 trimestres » uniquement sur les comptes encore actifs allonge la durée : les partis ne tirent plus la moyenne vers le bas. C'est le raccourci qui rend une LTV trop belle. Les cohortes d'inscription, avec leurs cases vides et leurs taux qui incluent les disparus, existent précisément contre ce réflexe.
3. **L'enquête qui ne répond qu'aux contents.** Un NPS calculé sur 40 réponses volontaires ne décrit pas les 400 comptes actifs. Ceux qui sont partis ne remplissent pas le questionnaire. Le chiffre est un avis de répondants, à étiqueter comme tel.
4. **Le nettoyage qui trie les faibles.** Écarter les comptes « sans région renseignée » paraît hygiénique. Si ces fiches sont surtout de petits comptes créés vite et jamais relancés, la cohorte restante a l'air en meilleure santé **parce que vous avez retiré les absents**. Comptez combien vous excluez, et comparez leur devenir quand vous le connaissez encore.

Le test pratique : demandez « qui n'est pas dans cette table, et a-t-il eu le droit d'y être ? ». Si la réponse est « les partis, les non-répondants, les fiches incomplètes », vous n'avez pas encore le droit de généraliser aux nouveaux comptes.

# Croiser segment et cohorte sans mélanger les questions

Le segment et la cohorte ne répondent pas à la même question. Le segment dit **qui traiter maintenant**. La cohorte dit **si un mois d'entrée se comporte mieux qu'un autre, à âge égal**. Les croiser est utile. Les confondre produit des phrases fausses.

Utile : parmi les inscrits de février, quelle part est déjà dans « à rappeler » ou « un seul achat », comparée à janvier au même âge. Si février fabrique davantage de one-shots, l'appel de mise en route supprimé reste une hypothèse concrète, à tester, pas un slogan.

Faux : « nos habitués RFM ont une excellente rétention, donc l'inscription de février est saine ». Les habitués sont, par définition, des comptes récents et fréquents. Ils ont déjà survécu. Ils ne représentent pas les 90 inscrits de février, dont une partie n'a jamais été livrée.

Une note de décision tient alors en quatre lignes, pas en une matrice de quarante cases.

1. La cohorte d'inscription de février est en retrait d'environ 12 points à M1 (28 % contre 40 % en janvier), sur 90 comptes.
2. Le segment à traiter cette semaine reste la liste Est : 15 comptes, 180 k€, marge sous 45 %.
3. On ne lance pas de programme fidélité sur les 200 one-shots, ni de règle nationale sur une niche de 8 comptes.
4. On ne cite pas les 80 % du configurateur comme preuve, tant que l'outil n'est offert qu'aux comptes déjà là depuis 60 jours.

Vous pouvez ajouter un test (rétablir l'appel sur une moitié des nouveaux inscrits) plutôt qu'une certitude. La cohorte a fait son travail dès qu'elle a empêché de mélanger les âges et d'oublier les absents. Le segment a fait le sien dès que lundi quelqu'un a une liste différente du fichier complet.

# Exercices

## Exercice 1 : Garder ou écarter

Pour chaque proposition, dites si le segment est actionnable, décoratif, introuvable ou trop petit pour un taux, et quelle suite vous lui donnez.

1. Comptes Est, marge sous 45 %, au moins trois commandes : 15 comptes, 180 k€. Revue commerciale prévue.
2. « Comptes sensibles au design », sans champ ni comportement dans la base.
3. Huit comptes d'une niche, 7 ont recommandé. On veut en faire la preuve que la niche « convertit à 87 % ».
4. Quatre quartiles RFM, et le même coupon de 10 % envoyé aux quatre.

<details>
<summary>Voir la solution</summary>

1. **Actionnable.** La règle est refaisable, le montant justifie une liste d'appels, l'action (revue, plafond de remise) diffère du traitement de masse. On ne transforme pas ces 15 comptes en pourcentage de précision.

2. **Introuvable.** Deux analystes ne sortiront pas la même liste. Il faut d'abord un critère observable (gamme achetée, pages vues, réponse à une question), ou abandonner le segment.

3. **Trop petit pour un taux.** 7 / 8 = 87,5 %, et un seul compte fait bouger le chiffre de 12,5 points. On peut appeler les 8 noms. On ne change pas la stratégie sur 87 %.

4. **Décoratif.** Le découpage existe, l'action est identique. Soit l'offre change vraiment (cadre annuel pour les habitués, pas de coupon pour les one-shots), soit on arrête d'afficher quatre segments.

</details>

## Exercice 2 : Lire au même âge

Reprenez le tableau du chapitre (janvier 80 comptes : M0 55 %, M1 40 % ; février 90 comptes : M0 42 %, M1 28 % ; avril 60 comptes : M0 46 %, pas de M1).

1. Quelle comparaison est légitime entre janvier et février ?
2. Pourquoi la case vide d'avril n'est-elle pas un taux de 0 % ?
3. Un collègue dit : « février finit à 28 %, janvier à 31 % en M3, c'est pareil ». Que répondez-vous ?

<details>
<summary>Voir la solution</summary>

1. Le **même âge** : M0 contre M0 (42 % contre 55 %) et M1 contre M1 (28 % contre 40 %), en citant les effectifs 90 et 80. Février est en retrait d'une douzaine de points, pas « un peu différent » sans chiffre.

2. Avril n'a pas encore vécu de mois 1. La case vide signifie « pas encore observable ». Mettre 0 % compterait comme perdus des comptes qui n'ont pas eu le temps de commander.

3. Il compare le M1 de février au M3 de janvier. Janvier a eu deux mois de plus. Sa valeur au même âge que les 28 % est le **M1 à 40 %**, pas le M3 à 31 %. La conclusion « c'est pareil » est fausse.

</details>

## Exercice 3 : Qui a disparu du calcul

Une note affirme : « Les comptes qui utilisent le configurateur avancé recommandent à 80 %. Il faut l'imposer à l'inscription. Ils restent en moyenne 6 trimestres, contre 4 dans l'estimation LTV. » Vous apprenez que le configurateur n'apparaît qu'après 60 jours d'activité, et que les 6 trimestres sont calculés sur les comptes encore actifs.

1. Où est le biais de survie, deux fois ?
2. Que faudrait-il mesurer pour que le configurateur devienne un argument ?
3. Quel lien faites-vous avec la LTV du chapitre finance ?

<details>
<summary>Voir la solution</summary>

1. Les comptes partis avant 60 jours n'ont pas pu voir l'outil : les 80 % décrivent des survivants. Et la durée de 6 trimestres ignore ceux qui sont déjà partis, donc elle allonge artificiellement la vie moyenne.

2. Comparer, à âge égal, des inscrits à qui on propose l'outil tôt et des inscrits à qui on ne le propose pas (un test), ou au minimum vérifier que l'accès n'est pas réservé aux comptes déjà retenus. Sans cela, « 80 % » n'est pas un effet de l'outil.

3. Une LTV bâtie sur la durée des seuls actifs reprend exactement ce biais. Les 4 trimestres de l'ordre de grandeur doivent venir de cohortes qui **gardent les disparus dans le dénominateur**, pas d'une moyenne des champions encore là.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Segments et cohortes
center: "Un segment change une action. Une cohorte d'inscription se lit à âge égal, sans oublier ceux qui sont partis."
points:
  - icon: target
    title: Actionnable
    text: "Liste refaisable, geste différent, propriétaire. Le même e-mail pour tous n'est pas une segmentation."
  - icon: filter
    title: RFM
    text: "Récence, fréquence, valeur sur une fenêtre écrite. Un gros one-shot n'est pas un habitué."
  - icon: clock
    title: Cohortes
    text: "L'entrée est la date d'inscription. On compare M1 avec M1. Une case vide n'est pas un zéro."
  - icon: alert
    title: Trop petit
    text: "Huit comptes font danser un taux de 12 points. On les appelle un par un, on ne généralise pas."
  - icon: eye
    title: Biais de survie
    text: "Les encore là, les répondants, l'outil réservé aux anciens : demandez qui n'est pas dans la table."
pitfall: "Croire qu'un outil réservé aux comptes déjà actifs depuis 60 jours explique pourquoi les nouveaux restent."
remember: "Segment pour agir lundi, cohorte pour comparer les entrées. Les absents restent dans le raisonnement."
```
