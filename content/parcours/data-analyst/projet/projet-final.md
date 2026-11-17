---
title: "Projet final : une note de décision pour une application d'abonnement"
description: "Projet guidé sur une application d'abonnement fictive : à partir d'un jeu de données décrit, produire une note de décision sur l'activation, la rétention et une expérience, avec des jalons corrigés."
duration: 90
objectives:
  - Cadrer trois décisions (activation, rétention, expérience) sur un jeu de données fictif
  - Calculer les indicateurs au bon grain et localiser l'écart avant de recommander
  - Proposer une expérience tenue (unité, primaire, gardes-fous, durée) sans en surinterpréter le futur
  - Livrer une note d'une page dont la recommandation, les chiffres et les limites se tiennent
---

# Le contexte et la décision attendue

Vous êtes l'analyste de **Orée**, application fictive d'abonnement à des cours de dessin en vidéo. L'entreprise n'existe pas : les chiffres de ce chapitre sont un jeu de données décrit, conçu pour le projet. Personne ne vous demande de les « améliorer » pour qu'ils racontent une plus belle histoire.

La direction a une heure jeudi. Elle veut une **note de décision d'une page**, plus une annexe courte, qui réponde à trois questions et à trois seulement.

1. **Activation.** Parmi les inscrits, qui termine une première leçon dans les 7 jours, et où est le trou ?
2. **Rétention.** Parmi ces inscrits, qui est encore actif 30 jours plus tard, et ce trou est-il le même ?
3. **Une expérience.** Quel seul test vaut la peine d'être lancé ensuite, avec une métrique primaire et des gardes-fous ?

Vous ne proposerez pas une refonte de la marque, un nouveau prix pour tous les pays, ni un modèle de data science. Vous proposerez un geste que les tableaux permettent, et un test pour le geste que les tableaux ne font que suggérer.

Le succès du projet n'est pas un notebook long. C'est une note qu'une personne absente de votre démarche peut voter, et une annexe qui permet de refaire les trois chiffres.

# Le jeu de données fictif

Tout est fictif, déjà agrégé pour le projet. Vous n'avez pas à inventer des lignes. Si un chiffre vous manque pour une conclusion, la conclusion est hors jeu : vous le direz dans les limites.

Population : inscrits de **septembre 2026**, pays **France**, application Orée. Chacun a un essai de 7 jours. L'activation retenue pour le projet, sauf si votre cadrage en justifie une autre **avant** de calculer : au moins une leçon **terminée** dans les 7 jours après l'inscription. L'activité à J+30 : au moins une leçon terminée entre le jour 28 et le jour 34. L'abonnement payant : un prélèvement réussi au-delà de l'essai, observé jusqu'au 31 octobre, donc la fenêtre est complète pour les inscrits de septembre.

| Canal | Inscrits | Activés à J+7 | Actifs à J+30 | Abonnés payants |
|---|---|---|---|---|
| Organique | 4 000 | 2 400 | 1 600 | 1 400 |
| Réseaux payants | 6 000 | 1 800 | 900 | 720 |
| Parrainage | 2 000 | 1 400 | 1 100 | 1 000 |
| Ensemble | 12 000 | 5 600 | 3 600 | 3 120 |

Détail utile, déjà contrôlé, pour ne pas vous lancer dans une fausse piste.

- Le **prix** est le même partout : 12 € par mois ou 90 € par an. La part d'annuel est de 20 % sur chaque canal. Le prix n'explique pas l'écart entre canaux.
- La première leçon proposée dure **25 minutes**. Les campagnes des réseaux payants, elles, promettent « un dessin en 5 minutes ».
- Les parrainés viennent d'un proche déjà abonné. Ils ne sont pas un groupe tiré au sort.
- Volumes de septembre comparés à juin : inscrits stables à ±8 % par canal. Pas de trou de tracking signalé. Les clés `user_id` sont uniques dans cette table.
- Vous n'avez **pas** la marge publicitaire, ni le motif d'annulation, ni les pays hors France, ni de test déjà lancé.

```diagram
type: layers
title: Ce que la note a le droit d'utiliser
layers:
  - title: Décisions demandées
    text: Activation, rétention, une seule expérience
  - title: Table de septembre
    text: Trois canaux, quatre colonnes, France, fenêtre complète
  - title: Contexte donné
    text: Prix identique, promesse « 5 minutes », leçon réelle de 25 minutes
  - title: Hors jeu
    text: Marge pub, autres pays, motifs d'annulation, modèle prédictif
```

# Cadrer avant de calculer

Écrivez une demi-page de cadrage, même si les chiffres sont déjà dans le tableau. Elle fixe ce que vous refuserez de conclure.

**Définitions.** Reprenez l'activation à J+7, l'activité à J+30 et l'abonnement payant, avec les phrases du jeu de données. Dites que le dénominateur commun des trois taux est l'**inscrit** de septembre France, pas l'activé. Un taux de rétention « parmi les activés seulement » est un second indicateur, intéressant, mais il change la question.

**Hypothèses, avant de commenter les pourcentages.**

1. Les réseaux payants promettent 5 minutes et livrent 25 : l'activation devrait être le trou principal, pas le prix.
2. Le parrainage mélange l'effet du programme et le fait d'avoir un proche déjà convaincu : vous ne recommanderez pas de « tout miser sur le parrainage » comme si c'était un levier qu'on allume.
3. Si les non-activés ne reviennent pas à J+30, le sujet rétention des réseaux payants est d'abord un sujet d'activation.

**Contrôles déjà donnés.** Vous les recopiez dans l'annexe (unicité, stabilité des volumes, prix identique, part d'annuel identique). Vous ne faites pas semblant de les avoir découverts dans un entrepôt.

# Lire l'activation et la rétention

Calculez les taux sur le dénominateur **inscrits**. Arrondissez au point près dans la note, gardez une décimale dans l'annexe.

Activation J+7 : organique 2 400 / 4 000 = **60 %** ; réseaux payants 1 800 / 6 000 = **30 %** ; parrainage 1 400 / 2 000 = **70 %** ; ensemble 5 600 / 12 000 = **46,7 %**.

Activité J+30 : organique **40 %** ; réseaux payants **15 %** ; parrainage **55 %** ; ensemble 3 600 / 12 000 = **30 %**.

Abonnés payants : organique **35 %** ; réseaux payants **12 %** ; parrainage **50 %** ; ensemble 3 120 / 12 000 = **26 %**.

Le trou est au même endroit pour les trois indicateurs : les **réseaux payants**, qui pèsent la moitié des inscrits (6 000 / 12 000) et tirent l'ensemble vers le bas. L'organique et le parrainage ne « compensent » pas. Ils sont un autre mix.

Regardez ensuite si la rétention des réseaux payants n'est qu'une conséquence de l'activation. Parmi les activés de ce canal, 900 / 1 800 = **50 %** sont encore actifs à J+30. Parmi les activés organiques, 1 600 / 2 400 ≈ **67 %**. Il reste un écart après activation, plus petit que l'écart d'activation (30 points à l'entrée, environ 17 points parmi les activés). Vous ne le niez pas. Vous ne le laissez pas non plus prendre toute la note : le plus grand manque de monde est **avant** la première leçon terminée (4 200 inscrits des réseaux payants n'ont pas terminé de leçon).

Le prix identique et la part d'annuel identique écartent, dans ce jeu de données, l'hypothèse « les réseaux payants ont choisi un autre tarif ». La promesse « 5 minutes » contre une leçon de 25 minutes est le mécanisme **crédible**, pas prouvé. Les parrainés à 70 % d'activation ne sont pas la preuve qu'il faut doubler le budget parrainage : ils arrivent avec un proche. Vous le nommez comme biais de sélection.

```diagram
type: flow
title: Où porter le regard, dans l'ordre
steps:
  - title: Taux sur inscrits
    text: Les trois canaux, les trois indicateurs
    tone: blue
  - title: Poids
    text: Les réseaux payants sont la moitié des inscrits
    tone: amber
  - title: Après activation
    text: L'écart de rétention se réduit, il ne disparaît pas
    tone: violet
  - title: Mécanisme
    text: Promesse de 5 minutes, leçon de 25, pas le prix
    tone: teal
```

# Proposer une seule expérience

L'expérience découle du mécanisme, pas d'une envie de « tester quelque chose ».

**Hypothèse.** Pour les nouveaux inscrits France issus des **réseaux payants**, proposer une première leçon de 8 minutes (un dessin fini) au lieu de la leçon actuelle de 25 minutes augmente l'activation à J+7 d'au moins 8 points, parce que la promesse publicitaire et la première séance se rejoignent.

**Unité.** L'inscrit (`user_id`), assigné une fois, au moment de l'inscription. Pas la session : la même personne ne doit pas voir les deux leçons.

**Primaire.** Taux d'activation à J+7, dénominateur : inscrits du canal réseaux payants entrés dans le test.

**Gardes-fous.** Taux d'abonnement payant à J+14 (une leçon facile ne doit pas fabriquer des activés qui ne paient jamais) ; taux de remboursement sous 14 jours ; volume d'inscrits du canal (le test ne doit pas casser le suivi de campagne). Vous ne prenez pas la rétention à J+30 comme primaire : elle arriverait trop tard pour la décision, et elle mélange d'autres causes. Vous pouvez la prévoir en secondaire, lue à la date prévue, sans stopper le test à J+7 sur ce secondaire.

**Taille, à l'intuition.** Base 30 %, effet minimal utile +8 points. L'ordre de grandeur `16 × p × (1 − p) / δ²` donne `16 × 0,3 × 0,7 / 0,08² ≈ 16 × 0,21 / 0,0064 ≈ 525` inscrits **par variante**. Le canal en apporte environ 6 000 par mois, soit environ 200 par jour. Une semaine suffit largement en volume, mais vous tenez **deux semaines pleines** pour couvrir les jours de semaine, et vous ne regardez pas la primaire pour décider avant la fin. Un SRM 50 / 50 se contrôle dès les premiers jours, sans conclure sur l'activation.

**Ce que le test ne dira pas.** Il ne dira pas si les réseaux payants sont rentables. Il ne dira pas quoi faire de l'organique. Il ne « validera » pas le parrainage.

# La note et les critères de réussite

La note d'une page suit le format du parcours.

- **Titre-recommandation.** Par exemple : « Ne pas couper les réseaux payants : lancer une première leçon de 8 minutes, en test, sur ce canal. »
- **Constat.** Activation 30 % sur les réseaux payants contre 60 % en organique, 6 000 inscrits, septembre, France. Rétention J+30 : 15 % contre 40 %. Parmi les activés du paid, 50 % sont encore là à J+30.
- **Mécanisme.** Promesse à 5 minutes, leçon à 25, prix identique donc hors cause dans ce jeu.
- **Geste.** Test décrit en cinq lignes (unité, primaire, gardes-fous, durée). Pas de déploiement général de la leçon courte « parce que c'est évident ».
- **Limites.** Pas de causalité encore, parrainage non comparable, pas de marge pub, France seulement, un mois.
- **Décision demandée.** Accord pour lancer le test à une date, responsable nommé (vous pouvez écrire « équipe produit Orée »).

L'annexe : définitions, tableau des effectifs, taux avec une décimale, contrôle « prix et part d'annuel identiques », phrase sur le parrainage, ce que vous n'avez pas.

| Critère | Ce qui est attendu |
|---|---|
| Définition | J+7, J+30 et payant ont un dénominateur d'inscrits, dit avant les taux |
| Calcul | Les taux du tableau sont justes, le poids du canal aussi |
| Localisation | Le trou principal est nommé (activation, réseaux payants), l'écart résiduel de rétention aussi |
| Proportion | Pas de coupe de canal, pas de « doubler le parrainage » comme si c'était causal |
| Expérience | Une primaire, une unité, des gardes-fous, une durée, ce que le test ne dira pas |
| Limites | Marge, pays, sélection du parrainage, absence de test préalable |
| Forme | Recommandation en tête, méthode en annexe, pas de chiffre inventé hors du jeu |

> [!IMPORTANT]
> Un jalon n'est pas « fini » parce que le calcul est juste. Il est fini quand la phrase que vous en tirez pourrait entrer dans la note sans enfler. Les exercices qui suivent sont ces jalons : la solution de référence est le niveau attendu, pas un barème secret.

# Exercices

## Exercice 1 : Le cadrage signable

Écrivez le cadrage du projet (définitions, population, hypothèses, ce que vous ne conclurez pas) en moins de 150 mots, comme si la direction devait l'accepter avant jeudi.

<details>
<summary>Voir la solution</summary>

Population : inscrits Orée de septembre 2026, France. Dénominateur commun : l'inscrit.

Activation : au moins une leçon terminée dans les 7 jours. Activité J+30 : au moins une leçon terminée entre J+28 et J+34. Payant : prélèvement réussi après l'essai, fenêtre complète au 31 octobre.

Hypothèses : le trou des réseaux payants vient d'abord de l'activation (promesse « 5 minutes », leçon de 25), pas du prix, identique partout. Le parrainage n'est pas un groupe témoin. La rétention basse de ce canal sera relue parmi les activés, pour ne pas confondre « jamais commencé » et « parti après ».

Hors conclusion : rentabilité des campagnes, autres pays, motifs d'annulation, et toute cause attribuée au parrainage. La seule expérience envisagée, si le constat se confirme, porte sur la durée de la première leçon, pas sur un nouveau prix.

</details>

## Exercice 2 : Les taux et le lieu du trou

À partir du tableau, donnez l'activation, l'activité à J+30 et le taux d'abonnés payants des réseaux payants, le poids de ce canal dans les inscrits, et le taux d'activité à J+30 **parmi les activés** de ce canal et de l'organique. Dites en trois phrases où est le trou principal.

<details>
<summary>Voir la solution</summary>

Réseaux payants, sur 6 000 inscrits : activation 1 800 / 6 000 = **30 %** ; actifs J+30 900 / 6 000 = **15 %** ; payants 720 / 6 000 = **12 %**. Poids : 6 000 / 12 000 = **50 %** des inscrits.

Parmi les activés : réseaux payants 900 / 1 800 = **50 %** encore actifs à J+30 ; organique 1 600 / 2 400 ≈ **66,7 %**.

Le trou principal est l'activation des réseaux payants (30 % contre 60 % en organique) sur la moitié des inscrits. Il reste un écart de rétention parmi ceux qui ont commencé (50 % contre environ 67 %), plus petit. Le prix ne le explique pas dans ce jeu : il est identique, comme la part d'annuel. On ne recommande pas de couper le canal sur cette seule comparaison.

</details>

## Exercice 3 : L'expérience et la phrase de tête

Rédigez la recommandation de tête de note (5 lignes maximum) et le bloc expérience : hypothèse, unité, primaire, deux gardes-fous, durée, et une phrase sur ce que vous refusez de conclure le jour du lancement.

<details>
<summary>Voir la solution</summary>

Tête de note : « Ne pas couper les réseaux payants et ne pas généraliser la leçon courte. Lancer, sur les seuls nouveaux inscrits France de ce canal, un test première leçon 8 minutes contre leçon actuelle 25 minutes. L'activation y est de 30 % contre 60 % en organique, pour 50 % des inscrits de septembre. Le prix est le même : ce n'est pas le levier retenu. Décision demandée : accord produit pour un test de deux semaines. »

Expérience. Hypothèse : aligner la première séance sur la promesse (« un dessin fini » en 8 minutes) augmente l'activation à J+7 d'au moins 8 points. Unité : l'inscrit, une seule variante. Primaire : activation à J+7. Gardes-fous : taux de passage à l'abonnement payant à J+14, et taux de remboursement sous 14 jours. Durée : deux semaines pleines, lecture de la primaire à la fin seulement, contrôle de répartition dès le début. Le jour du lancement, le test ne prouve rien : on ne conclut pas que les campagnes sont rentables, ni que l'organique doit changer de leçon.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Projet final, application Orée
center: "Une note tranche trois questions : activer, retenir, et un seul test à la taille du trou."
points:
  - icon: target
    title: Trois questions
    text: Activation à J+7, activité à J+30, une expérience. Pas une refonte.
  - icon: database
    title: Le jeu donné
    text: 12 000 inscrits, trois canaux. Ce qui manque s'écrit en limite, ça ne s'invente pas.
  - icon: chart
    title: Le trou
    text: Réseaux payants, 30 % d'activation, la moitié des inscrits. Le prix est le même.
  - icon: test
    title: Une expérience
    text: Leçon de 8 minutes, unité inscrit, primaire J+7, gardes-fous de paiement.
  - icon: file
    title: Note d'une page
    text: Recommandation en tête, taux en annexe, parrainage non causal, France seulement.
pitfall: Doubler le parrainage parce que son taux est le plus haut, alors que ces inscrits ne sont pas tirés au sort.
remember: Le plus grand manque est l'activation des réseaux payants. Le test sert à le vérifier, pas un slogan.
```
