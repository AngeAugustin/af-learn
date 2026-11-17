---
title: KPI et métriques produit
description: "Distinguer vanité et pilotage, poser une north star, définir ARPU et activation, et écrire un KPI avec propriétaire, fréquence et seuil."
duration: 60
objectives:
  - "Séparer une métrique de vanité d'une métrique de pilotage"
  - "Formuler une north star liée à la valeur délivrée"
  - "Calculer un ARPU et un taux d'activation avec le bon dénominateur"
  - "Rédiger la définition d'un KPI, son propriétaire et sa fréquence"
---

# Une métrique de vanité ne fait pas agir

Un **KPI** (indicateur clé) n'est pas « un chiffre que l'on suit ». C'est un chiffre qui change une décision quand il bouge. La **métrique de vanité** flatte ou inquiète sans dire quoi faire. La **métrique de pilotage** est branchée sur un levier que quelqu'un possède.

Lumen vend des luminaires professionnels. Depuis le lancement, **12 000 comptes** ont été créés. Le nombre impressionne en réunion. Il mélange cinq ans d'inscriptions, des doublons, des comptes jamais livrés, des comptes fermés et des tests internes. S'il monte de 200 la semaine prochaine, vous ne savez pas si le produit prend, si une campagne a acheté des formulaires vides, ou si un import a créé des fiches. Aucune action précise n'en sort.

À côté, une métrique de pilotage du même sujet : **comptes activés dans les 14 jours**. Au T2, 240 comptes ont été créés, 120 ont eu une commande livrée dans les 14 jours, soit **50 %**. Si le taux passe à 35 % pendant deux semaines, l'équipe d'onboarding sait quoi ouvrir : les comptes sans devis, pas « le marketing en général ».

| | Vanité | Pilotage |
|---|---|---|
| Question | « Est-ce qu'on a l'air grand ? » | « Quel levier bouger cette semaine ? » |
| Exemple Lumen | 12 000 comptes créés depuis l'origine | 50 % d'activation à 14 jours au T2 |
| Si le chiffre baisse | Inconfort, pas de geste clair | Revue du passage compte → devis |
| Dénominateur | Souvent absent ou gonflé | Écrit, daté, filtrable |

Le même indicateur change de camp selon l'usage. Le CA de 1,2 M€ est une vanité s'il est affiché seul pour rassurer. Il devient un outil de pilotage s'il est décomposé (prix × volume, par région) et comparé à un seuil qui déclenche une revue des remises. La question n'est pas « le CA est-il mal ? ». C'est « qui fait quoi quand il bouge ? ».

> [!WARNING]
> Un tableau de bord couvert de compteurs cumulés (inscrits, pages vues, téléchargements) donne le sentiment de piloter. Si aucun compteur n'a de seuil ni de propriétaire, vous exposez des trophées, pas des commandes.

# La north star n'est pas un mur d'indicateurs

La **north star** (étoile polaire) est **une** métrique qui résume la valeur reçue par le client et qui, sur la durée, tire un revenu durable. Ce n'est pas le chiffre le plus facile à faire monter cette semaine, ni le CA brut.

Pour Lumen, un bon candidat est : **le nombre de comptes actifs**, défini comme les comptes avec **au moins une commande livrée sur les 28 derniers jours**. Au T2, la moyenne s'établit à **400 comptes actifs**. Cette définition a trois qualités :

- elle compte une valeur livrée (un professionnel a vraiment reçu du matériel), pas une visite ;
- elle se dégrade si l'on achète des inscriptions vides ou si l'on livre en retard au point que les comptes sortent de la fenêtre ;
- elle ne félicite pas une grosse commande bradée autant qu'un CA nu le ferait, parce qu'un compte n'est compté qu'une fois. Le CA et la marge restent indispensables, mais ils expliquent **comment** la north star gagne de l'argent, ils ne la remplacent pas.

De mauvaises north stars, et pourquoi :

- **CA** : on peut le gonfler avec des remises qui détruisent la marge (Lumen est passé de 58 % à 52 % de marge brute sans perdre de CA) ;
- **comptes créés cumulés** : stock historique, pas une valeur de la période ;
- **nombre de pages vues** : activité du site, pas preuve que le bâtiment du client est équipé.

La north star ne vit pas seule. Deux ou trois **indicateurs pilotes** expliquent ses mouvements : acquisition de comptes qualifiés, taux d'activation, rétention à 30 jours, marge des comptes actifs. Si la north star monte et que la marge s'effondre, les pilotes doivent le montrer. Une étoile qui ignore l'économie du modèle devient une vanité déguisée.

```diagram
type: layers
title: "De la north star aux leviers"
layers:
  - title: North star
    text: "400 comptes actifs : au moins une livraison sur 28 jours. Valeur reçue, pas un stock d'inscrits."
  - title: Activation
    text: "50 % des 240 nouveaux comptes du T2 sont livrés en 14 jours. C'est l'entrée dans l'étoile."
  - title: Rétention
    text: "Les comptes restent-ils actifs aux échéances J7 et J30, ou sortent-ils de la fenêtre de 28 jours ?"
  - title: Économie
    text: "ARPU et marge des comptes actifs. Une étoile qui monte en bradant n'est pas une victoire."
  - title: Décision
    text: "Chaque étage a un propriétaire. Sans geste associé, l'étage redevient un affichage."
```

# ARPU et taux d'activation, dénominateur inclus

Deux métriques produit reviennent dans presque toutes les revues. Elles sont utiles le jour où la définition tient en une phrase que deux analystes calculent de la même façon.

## L'ARPU

L'**ARPU** (*average revenue per user*, revenu moyen par compte) est un CA divisé par un nombre de comptes. Le numérateur et le dénominateur doivent parler de la **même population** et de la **même période**.

Au T2, Lumen réalise **1 200 k€ HT** de CA livré. Il y a **400 comptes actifs** sur la définition « au moins une livraison dans le trimestre ». 

ARPU = 1 200 000 / 400 = **3 000 € HT par compte actif et par trimestre**.

Si vous divisez par les 12 000 comptes historiques, vous obtenez 100 €. Ce n'est pas « l'ARPU du produit » : vous avez dilué le revenu des comptes vivants avec des fiches mortes. Si vous divisez par les seuls 120 nouveaux comptes activés au T2, vous obtenez 10 000 €, mais le numérateur contient surtout les commandes des anciens. Vous avez attribué à l'acquisition le CA de la base installée.

Écrivez donc : « ARPU T2 = CA HT livré du trimestre / comptes avec au moins une livraison sur le trimestre = 3 000 € ». TVA, avoirs, comptes internes : dites ce qui est dedans. Un ARPU en hausse peut venir d'une hausse de prix, d'un mix plus cher, ou de petits comptes qui ont disparu du dénominateur. Décomposez avant de célébrer.

## Le taux d'activation

L'**activation** est le moment où le nouveau compte atteint la première valeur, celle qui correspond à votre north star. Chez Lumen, ce n'est pas « a ouvert l'e-mail de bienvenue ». C'est : **commande livrée dans les 14 jours suivant la création du compte**.

Taux d'activation T2 = 120 / 240 = **50 %**.

Le délai fait partie de la définition. Livré au jour 40, le compte a peut-être acheté, il n'est pas activé au sens de ce KPI : l'onboarding n'a pas tenu sa promesse de mise en route. Vous pouvez suivre à côté « livré un jour, sans limite de délai ». Ne mélangez pas les deux dans le même pourcentage.

Le taux seul ne dit pas où ça casse. 50 % peut cacher un passage visite → compte correct et un passage compte → devis en chute. L'activation est un résultat. L'entonnoir, dans le chapitre suivant, en est la décomposition.

> [!TIP]
> Quand deux équipes annoncent deux ARPU, ne débattez pas du « bon outil ». Posez les deux fractions au tableau. Neuf fois sur dix, le désaccord est le dénominateur (actifs, inscrits, payants) ou la règle d'avoir, pas le calcul.

# Écrire la définition avant de publier le chiffre

Un KPI qui n'existe que dans un graphique n'existe pas. La définition écrite tient sur une fiche, versionnée, que l'on peut citer. Voici celle de l'activation Lumen, comme vous devriez pouvoir l'écrire pour n'importe quel indicateur du tableau de bord.

| Rubrique | Activation à 14 jours |
|---|---|
| Question | Les nouveaux comptes atteignent-ils une livraison rapidement ? |
| Formule | Comptes livrés dans les 14 jours / comptes créés sur la période |
| Numérateur | Compte dont la première commande est livrée au plus tard 14 jours après la date de création |
| Dénominateur | Comptes créés dans la période, hors comptes internes et hors doublons fusionnés |
| Exclusions | Avoirs : une commande entièrement annulée ne compte pas comme livrée. Le CA n'entre pas dans ce taux |
| Grain | 1 ligne = 1 compte. Période de création : le trimestre ou la semaine, jamais un cumul depuis l'origine |
| Source | Tables comptes et livraisons, date de livraison réelle, pas la date promise |
| Valeur T2 | 120 / 240 = 50 % |

Cette fiche évite trois disputes classiques. « Activé » voulait dire « a téléchargé la brochure » pour le marketing et « a été livré » pour les opérations. « Nouveau » incluait les réouvertures de comptes dormants. « La période » mélangeait la date de création et la date de livraison, si bien qu'un compte créé le 28 juin et livré le 5 juillet sortait des deux mois.

Rédigez la fiche **avant** de choisir la couleur de la jauge. Si vous n'arrivez pas à remplir la ligne « exclusions », vous n'êtes pas prêt à afficher le pourcentage.

# Un propriétaire, une fréquence, un seuil

Un chiffre sans propriétaire est un chiffre que tout le monde commente et que personne ne traite. Le propriétaire n'est pas « la data ». C'est la personne qui peut lancer l'action quand le seuil est franchi. L'analyste calcule, documente et alerte. Il ne devient pas, par défaut, le responsable de l'onboarding.

Pour l'activation Lumen :

- **Propriétaire** : responsable de l'onboarding commercial. L'analyste est le référent de la définition.
- **Fréquence** : revue le lundi sur la semaine échue. Pas chaque matin (le taux quotidien sur 8 comptes créés saute de 25 % à 60 % sans que le processus ait changé) et pas seulement une fois par trimestre (six semaines de dégradation passeraient inaperçues).
- **Seuil** : alerte si le taux hebdomadaire reste **sous 35 % deux semaines de suite**, avec au moins 20 comptes créés dans la semaine. En dessous de 20 créations, on ne conclut pas : l'échantillon est trop petit, on allonge la fenêtre.
- **Action écrite** : sortir la liste des comptes non activés, distinguer « pas de devis » et « devis sans livraison », et tenir un point de 30 minutes avec la personne propriétaire avant le mercredi.

La fréquence suit la vitesse à laquelle vous pouvez agir, pas la vitesse à laquelle la base se met à jour. Un stock critique se regarde chaque jour. Une marge annuelle ne se commente pas chaque matin : vous y verriez du bruit et vous finiriez par ignorer l'alerte. Un KPI que l'on ne regarde jamais à la fréquence prévue doit être retiré du tableau de bord, pas « laissé au cas où ».

```diagram
type: flow
title: "Mettre un KPI en service"
steps:
  - title: Question
    text: "Quelle décision change si le chiffre bouge ?"
    tone: violet
  - title: Fiche
    text: "Formule, grain, exclusions, source. Deux analystes, le même résultat"
    tone: blue
  - title: Propriétaire
    text: "Une personne qui peut agir, pas un service « data » générique"
    tone: teal
  - title: Rythme
    text: "Fréquence alignée sur l'action, seuil et taille minimale d'échantillon"
    tone: amber
  - title: Retrait
    text: "S'il n'y a pas de geste associé, on l'enlève du mur de jauges"
    tone: rose
```

# Relier le KPI à une décision

Revenez au T2 de Lumen avec les trois chiffres ensemble, plutôt qu'en compétition :

- north star : **400 comptes actifs** ;
- ARPU : **3 000 €** HT par compte actif sur le trimestre (1,2 M€ / 400) ;
- activation : **50 %** (120 / 240).

Un comité qui ne regarde que les 400 peut rater la marge, passée de 58 % à 52 %. Un comité qui ne regarde que le CA de 1,2 M€ peut rater une activation qui décroche. Un comité qui ne regarde que les 12 000 inscrits ne voit rien de tout cela.

La phrase de pilotage, celle que vous mettez en tête de note, ressemble à ceci : « Nous avons 400 comptes actifs au T2, à 3 000 € de CA HT chacun, et un nouveau compte sur deux est livré en 14 jours. Le point de vigilance n'est pas le volume d'inscrits (12 000 depuis l'origine, non actionnable). C'est la marge des comptes actifs, et le maintien de l'activation au-dessus de 35 % par semaine. »

Cette phrase est testable. Elle nomme la définition, le niveau, et ce que vous ne pilotez pas. Quand vous ajoutez un indicateur au tableau de bord, exigez la même phrase. Si vous ne pouvez pas l'écrire, l'indicateur n'est pas prêt, quel que soit le soin apporté au visuel.

# Exercices

## Exercice 1 : Vanité ou pilotage

Classez chaque indicateur. Pour ceux que vous classez en vanité, proposez la reformulation qui les rendrait pilotables.

1. Nombre cumulé de téléchargements du catalogue PDF.
2. Part des nouveaux comptes avec une livraison en moins de 14 jours.
3. Total de followers de la page entreprise.
4. CA HT du mois.

<details>
<summary>Voir la solution</summary>

1. **Vanité.** Les téléchargements cumulés ne disent pas qui a commandé. Reformulation possible : taux de comptes ayant téléchargé le catalogue **puis** demandé un devis sous 7 jours, avec propriétaire marketing et seuil.

2. **Pilotage**, à condition que la fiche existe (qui est « nouveau », que faire sous le seuil). C'est le taux d'activation du chapitre.

3. **Vanité.** Aucun levier client n'est branché sur un follower. On peut le garder comme contexte de notoriété, pas comme KPI de revue produit.

4. **Les deux**, selon l'habillage. Seul, en cumul, c'est un trophée. Décomposé (volume, prix, remise, région), comparé à un seuil et confié à un propriétaire, il se pilote. Au T2, 1,2 M€ stable avec une marge en baisse montre pourquoi le CA nu ne suffit pas.

</details>

## Exercice 2 : Choisir le dénominateur

Le CA HT du mois est de 400 k€. On vous propose trois ARPU : 400 k€ / 4 000 inscrits = 100 € ; 400 k€ / 380 comptes livrés dans le mois = 1 053 € ; 400 k€ / 40 nouveaux comptes livrés = 10 000 €.

1. Lequel correspond à « revenu moyen des comptes réellement servis ce mois-ci » ?
2. Pourquoi les deux autres sont-ils trompeurs ?
3. Quelle phrase écrivez-vous sous le graphique ?

<details>
<summary>Voir la solution</summary>

1. Le **deuxième** : 1 053 € par compte livré dans le mois. Numérateur et dénominateur portent sur la même population active.

2. Le premier dilue le CA avec des inscrits inactifs : l'ARPU baisse si l'on crée des comptes vides, même quand les clients réels achètent autant. Le troisième met dans le numérateur le CA de toute la base (anciens compris) et dans le dénominateur seulement les nouveaux : il attribue à l'acquisition un revenu qu'elle n'a pas produit.

3. « ARPU = CA HT livré du mois / comptes avec au moins une livraison dans le mois = 1 053 €. Hors TVA, avoirs déduits. » Sans cette phrase, le nombre 1 053 n'est pas comparable au mois suivant.

</details>

## Exercice 3 : Compléter la fiche

On vous demande d'industrialiser le KPI « comptes engagés ». Aujourd'hui, chacun le calcule à sa façon. Rédigez les rubriques minimales (question, formule, exclusions, grain, propriétaire, fréquence, seuil) pour un indicateur que **vous** définissez ainsi : compte avec au moins une connexion à l'espace client sur les 7 derniers jours. Inventez un seuil cohérent et dites ce que vous refusez de conclure.

<details>
<summary>Voir la solution</summary>

Question : les comptes reviennent-ils dans l'espace client dans la semaine ? Formule : comptes avec au moins une connexion sur 7 jours / comptes activés (déjà livrés au moins une fois), pour ne pas mélanger les curieux jamais clients. Exclusions : comptes internes, robots de supervision, connexions du jour de la création si vous mesurez le **retour**. Grain : 1 compte, fenêtre glissante de 7 jours, pas un cumul. Propriétaire : responsable produit de l'espace client, analyste garant de la définition. Fréquence : hebdomadaire. Seuil d'exemple : alerte sous 30 % deux semaines de suite, uniquement si au moins 50 comptes sont éligibles. Vous refusez de conclure sur une journée isolée à 10 connexions, et vous refusez d'appeler cela « satisfaction » : une connexion n'est pas une livraison ni un avis.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Un KPI que l'on peut piloter
center: "Vanité et pilotage ne se distinguent pas au nom du chiffre, mais au dénominateur, au seuil et au propriétaire."
points:
  - icon: sparkles
    title: Vanité
    text: "Le cumul d'inscrits rassure. Il mélange les comptes morts et ne dit pas quel levier bouger."
  - icon: compass
    title: North star
    text: "Une métrique de valeur reçue. Chez Lumen, les comptes livrés au moins une fois sur 28 jours."
  - icon: money
    title: ARPU
    text: "CA de la période divisé par les comptes de la même population. Écrire le dénominateur sous le chiffre."
  - icon: gauge
    title: Activation
    text: "Première valeur tenue dans le délai promis. 120 livrés sur 240 créés, soit 50 % au T2."
  - icon: users
    title: Propriétaire
    text: "Une personne qui agit, une fréquence réaliste, un seuil, et le retrait si aucun geste n'est prévu."
pitfall: "Afficher 12 000 inscrits ou un ARPU dont le dénominateur change selon l'équipe, sans fiche ni seuil."
remember: "Pas de KPI publié sans formule, exclusions, propriétaire et action. Sinon c'est une jauge décorative."
```
