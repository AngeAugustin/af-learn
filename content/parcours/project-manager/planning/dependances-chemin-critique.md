---
title: "Dépendances et chemin critique"
description: "Voir quelles dépendances de Halte décalent vraiment la fin, comprendre le chemin critique sans calcul, et placer des marges là où un glissement coûte."
duration: 60
objectives:
  - "Reconnaître une dépendance réelle, un faux lien et une simple préférence d'ordre"
  - "Repérer par intuition le chemin qui fixe la date de fin"
  - "Dire ce qui décale la généralisation, et ce qui peut glisser sans la déplacer"
  - "Placer la marge sur la chaîne qui commande le 29 août, pas partout au hasard"
---

# Une dépendance est une attente réelle

Une dépendance existe quand un morceau ne peut pas être **fini**, ou parfois même commencé, tant qu'un autre n'est pas vrai. Ce n'est pas une préférence (« on aimerait avoir le logo avant »). Ce n'est pas une politesse (« attendons Marc pour qu'il se sente inclus »). C'est une attente qui, si on la nie, produit un livrable faux ou inutilisable.

Sur Halte, dépendances réelles :

- la procédure enseignée dépend d'une version que Nadia accepte de faire jouer, sinon Chloé forme un geste que le constat contredira ;
- le pilote dépend d'un transporteur retenu, parce qu'un créneau « fictif » ne teste pas la tenue ;
- le pilote dépend d'un parcours où le client voit le créneau avant de payer, au moins sur les commandes test ;
- la vague suivante dépend du constat de passage, sauf si Léa change le critère par écrit ;
- le contrat utile dépend de la page de décision, pas l'inverse : signer pour « aller plus vite » puis découvrir que Litto ne couvre pas deux régions, c'est une dépendance niée.

Faux liens, à couper sans état d'âme :

- la définition des indicateurs n'attend pas le choix du transporteur ;
- la réservation des salles de formation n'attend pas le mot final du juridique ;
- la comparaison NordColis / Litto n'attend pas que les quarante directeurs aient « adhéré » ;
- le repli écrit n'attend pas la dernière vague : il se prépare avec le pilote, puis il s'ajuste.

Vous écrivez une dépendance en une phrase « B ne peut pas être vrai tant que A ne l'est pas », avec un exemple de ce qui casse si on triche. Si vous n'arrivez pas à dire ce qui casse, vous avez une préférence d'ordre. Les préférences se négocient avec l'équipe. Les dépendances se tiennent, ou se remplacent par une autre façon de produire B (un affichage manuel le temps du pilote, par exemple), décidée explicitement, pas bricolée le vendredi.

Le fournisseur crée des dépendances qu'il ne présentera pas comme telles. NordColis peut dire « envoyez-nous votre règle complète, nous répondrons ensuite ». Si la règle complète dépend de leur capacité réelle, vous êtes en cercle. Vous cassez le cercle par un plus petit fini : un créneau type sur quatre zones pilotes, pas le catalogue des quarante magasins. Une dépendance circulaire n'est pas une fatalité. C'est deux morceaux trop gros.

> [!TIP]
> Demandez « qu'est-ce qui est faux si on commence quand même ? ». Une réponse concrète (une formation à refaire, un contrat à défaire) confirme la dépendance. Un malaise sans exemple confirme une préférence.

# Le chemin critique, en intuition

Le chemin critique est la plus longue chaîne de dépendances qui relie aujourd'hui à la fin que vous vous êtes fixée. « Plus longue » ne veut pas dire « celle qui a le plus de réunions ». Cela veut dire : la chaîne dont la durée, mise bout à bout, fixe le 29 août. Si un maillon de cette chaîne prend une semaine de plus, la fin prend une semaine de plus, sauf à retirer un autre maillon ou à changer la cible.

Vous n'avez pas besoin d'un calcul de réseau, ni d'un logiciel, ni d'une formule. Vous avez besoin de suivre le fil avec l'équipe, au tableau, une fois, puis de le revérifier quand une estimation bouge.

Pour Halte, le fil le plus long ressemble souvent à ceci, à confirmer avec les fourchettes réelles et pas avec l'habitude :

1. Cadrage signé, sinon le reste n'a pas de dedans.
2. Page de décision transporteur, puis transporteur retenu.
3. Règle de créneau utilisable sur les zones pilotes.
4. Parcours test qui montre cette règle avant paiement.
5. Procédure magasin en version jouable, en parallèle de l'affichage, mais le pilote attend **les deux**.
6. Pilote, dix jours de constat, seuil de passage.
7. Vagues, dans l'ordre que le rythme réel autorise, jusqu'aux quarante magasins.

Entre 2 et 6, l'affichage et la procédure courent côte à côte. Le pilote attend le plus lent des deux, plus le transporteur. Le plus lent des deux, plus ce qui le précède et ce qui le suit jusqu'au 29 août, est votre chemin critique. Si la procédure est prête et que l'affichage a une fourchette jusqu'à neuf semaines, ce n'est pas « le digital qui traîne » comme une opinion. C'est le maillon qui commande la fin. L'effort de conduite se porte là : couper le lot, obtenir la décision, enlever un cas, pas animer une réunion de plus sur un livret déjà en avance.

Ce qui est hors de ce fil peut être très visible et peu critique. Le livret graphique, la note aux régions déjà informées, le rangement des anciens contrats une fois le calendrier de sortie écrit : un glissement d'une semaine n'emporte pas le 29 août, tant que la marge locale de ce morceau n'est pas épuisée. Vous ne le criez pas en comité comme le risque principal. Vous le surveillez quand même, parce qu'un morceau hors chemin devient critique le jour où sa marge tombe à zéro.

```diagram
type: flow
title: "Le fil qui fixe le 29 août"
steps:
  - title: Transporteur retenu
    text: "Sans créneau réel, le pilote ne teste pas la tenue."
    tone: violet
  - title: Règle et affichage
    text: "Le plus lent des deux commande le démarrage."
    tone: blue
  - title: Procédure jouable
    text: "En parallèle, mais le pilote l'attend aussi."
    tone: teal
  - title: Constat de passage
    text: "Une semaine perdue ici se retrouve en août."
    tone: amber
  - title: Vagues jusqu'aux 40
    text: "Le rythme réel, pas le rythme espéré au slide."
    tone: rose
```

```video
url: https://www.youtube.com/watch?v=rxGcV0tuxRU
title: "What is the Critical Path Method (CPM)?"
channel: "Online PM Courses - Mike Clayton"
duration: "5:27"
lang: en
why: "La méthode du chemin critique résumée en cinq minutes par Mike Clayton."
```

# Ce qui se décale vraiment

Chaque semaine, une seule question de dépendance mérite le haut du compte-rendu : **qu'est-ce qui, s'il prend sept jours de plus, déplace le 29 août ?** Le reste est de la gestion locale.

Se décale vraiment, sur le fil de Halte :

- une semaine de plus pour obtenir la signature transporteur, parce que tout le pilote est derrière elle ;
- une semaine de plus sur le plus lent entre affichage et procédure, pour la même raison ;
- un constat de pilote repoussé, parce que les vagues sont derrière le oui ;
- une vague plus lente que l'analogie des quatorze semaines, une fois le rythme constaté, parce qu'il n'y a plus de « on accélérera à la fin » crédible : la fin est une somme de vagues, pas un sprint moral.

Ne décale pas, tant qu'il reste de la marge locale :

- Julien en retard de quelques jours sur la maquette du comité, si la définition des seuils est déjà signée ;
- Chloé en retard sur la charte du support, si les dates de salle ne bloquent pas un formateur rare ;
- une relecture juridique qui tarde, si elle ne porte pas le mot que le pilote doit afficher. Si elle porte ce mot, elle vient de rejoindre le chemin critique. Vous le dites, vous ne laissez pas « c'est juste du juridique » en bas de liste.

Le déplacement se propage de façon concrète, sans mathématique. Pilote décalé de sept jours : les dix jours de constat finissent sept jours plus tard, la première vague aussi, la dernière aussi, sauf si vous aviez une marge de généralisation encore intacte et si vous choisissez de la consommer. Consommer la marge est une décision visible. « On rattrapera sur les vagues » sans dire laquelle devient plus courte, ni quel magasin sort, est une phrase que vous refusez d'écrire dans le compte-rendu. Le rattrapage inventé est le contraire d'un chemin.

Quand deux chaînes ont presque la même longueur, vous n'ergotez pas pour savoir laquelle est « la » critique au sens d'un logiciel. Vous traitez les deux comme critiques. L'intuition suffit : s'il y a doute, il n'y a pas de marge. Halte n'a pas besoin d'un classement faux-précis. Halte a besoin que personne ne passe la semaine sur le livret pendant que la signature transporteur dort.

> [!WARNING]
> Le sujet le plus bruyant n'est pas le maillon le plus long. Un directeur en colère sur la charte peut occuper le comité pendant que la page de décision transporteur n'a toujours pas de date.

# Les marges et les buffers

Une marge, ou buffer, est du temps placé **après** une chaîne, ou avant un jalon, sans tâche dessus. Elle appartient au chemin, pas à un lot qui aurait « un peu plus de confort ». Dès qu'un responsable s'en sert pour élargir son propre travail, elle disparaît du calendrier commun et tout le monde croit qu'elle existe encore.

Où la placer sur Halte :

- **Avant le démarrage cible du pilote**, pour le contrat et le plus lent de l'affichage ou de la procédure. C'est le buffer qui protège le constat.
- **Avant le 29 août**, après la dernière vague prévue au rythme probable. C'est le buffer qui protège la contrainte du 1er septembre. S'il est déjà à zéro en mai, la cible est un vœu, et Léa doit le savoir pendant qu'on peut encore retirer un Could ou un cas.

Où ne pas la placer :

- sur chaque lot de travail en plus de sa fourchette pessimiste, plus un buffer général, plus une semaine « qualité ». Vous avez alors triple-compté la peur, le calendrier ne tient plus, et l'équipe ne croit plus aucun chiffre ;
- sur les morceaux hors chemin, en priorité. Une marge immense sur le livret ne protège pas août. Une marge nulle sur le transporteur le décide.

Le buffer se gère comme un stock. Vous l'ouvrez quand un risque de la chaîne se réalise, vous notez ce qu'il reste, vous ne le reconstituez pas en demandant aux gens de « se débrouiller ». S'il tombe à zéro, le jalon suivant n'est plus protégé : soit la cible bouge par décision, soit le contenu maigrit, soit vous assumez un aléa nu devant Léa. Ces trois options sont honorables. La quatrième, se taire et espérer une accélération, ne l'est pas.

Un buffer n'est pas non plus une cachette pour le pessimiste. L'estimation 3 à 9 semaines reste dite. Le buffer ne sert pas à afficher 3 et à cacher 6 ailleurs. Sinon vous revenez au mensonge de l'optimiste, avec une comptabilité plus compliquée. Les régions voient la cible. Le comité voit la cible, le buffer restant, et le maillon qui le menace. Trois nombres, pas un réseau.

# Où regarder chaque semaine

Votre revue hebdomadaire de Halte, quarante-cinq minutes, ne reparcourt pas les cinq lots à parts égales. Elle suit le fil.

1. **Le prochain jalon critique** : quelle date cible, qu'est-ce qui doit être vrai, est-ce encore croyable cette semaine ?
2. **Le maillon le plus long** : transporteur, affichage ou procédure, selon celui qui commande aujourd'hui. Quel fini est attendu avant la prochaine revue, quel décideur dort.
3. **Le buffer restant** avant le pilote, puis avant le 29 août. Entamé ou non, et par quoi.
4. **Un seul hors-chemin** qui approche de zéro marge, pour ne pas découvrir trop tard qu'il a rejoint le fil (souvent le mot juridique, ou l'accord d'un directeur de région sur la vague).
5. **La décision manquante**, datée, nommée. S'il n'y en a pas, vous le dites aussi. Inventer une décision pour meubler la revue est une dépendance politique, pas un chemin.

Vous tenez à jour un dessin d'une demi-page, pas un planning mural de toutes les tâches. Les noms des dépendances tiennent en une ligne chacun. Quand Sofia annonce un glissement, vous ne demandez pas d'abord « comment rattraper ». Vous demandez « est-ce le maillon le plus long ? ». Si oui, la revue change de nature : elle prépare une décision de Léa. Si non, le responsable du lot réorganise localement, et le 29 août ne se réécrit pas.

Le chemin critique se réestime après chaque fait nouveau : offre reçue, cas réel d'affichage, constat de pilote, rythme de la première vague. Avant ces faits, votre fil est une hypothèse de conduite, déjà bien meilleure qu'une liste de réunions. Après ces faits, un autre maillon peut prendre la tête. Y rester attaché par habitude (« on a toujours dit que c'était le transporteur ») est la dernière façon de se tromper de délai. Le transporteur, une fois signé et créneau en main, sort du fil. Les vagues y entrent. Vous déplacez le regard le jour même, et vous le dites à l'équipe pour qu'elle cesse de traiter comme urgent ce qui ne décale plus rien.

# Exercices

## Exercice 1 : Le cercle avec NordColis

NordColis écrit : « Transmettez la règle complète des quarante magasins, nous chiffrerons les créneaux ensuite. » Marc répond que la règle complète dépend de ce que NordColis sait tenir. Chacun attend l'autre. Comment cassez-vous cette dépendance ?

<details>
<summary>Voir la solution</summary>

Vous nommez le cercle : la règle complète attend le transporteur, et le transporteur prétend attendre la règle complète. Deux morceaux trop gros. Vous les remplacez par un fini plus petit, daté : un créneau type sur les zones des quatre magasins pilotes, assez précis pour une page de décision et pour un parcours test.

La règle des quarante et les cas rares attendent après le choix, pas avant. Vous l'écrivez à Antoine pour qu'il le dise au fournisseur sans s'excuser. Signer « pour sortir du blocage » sans ce créneau type nierait la dépendance et testerait un pilote fictif.

</details>

## Exercice 2 : Sept jours sur le livret

Chloé annonce une semaine de retard sur la mise en page du livret. Le même jour, Antoine annonce qu'il n'aura pas la page de décision transporteur avant sept jours, faute de créneau type. Le pilote cible est le 2 juin, le buffer devant lui est de dix jours. Qu'est-ce qui décale vraiment, et que mettez-vous en tête de revue ?

<details>
<summary>Voir la solution</summary>

Le livret, hors du fil, glisse d'une semaine sans emporter le 29 août, tant que la formation au geste n'est pas bloquée par cette mise en page. Vous le traitez en local avec Chloé.

La page de décision est sur le chemin : sept jours de plus entament le buffer de dix. Vous le mettez en tête. Il reste trois jours de protection, pas « aucune conséquence ». Vous demandez le fini manquant (le créneau type), le décideur, et la date. Vous ne lancez pas un plan de rattrapage sur le livret pour avoir l'impression d'agir. Si un second glissement transporteur arrive, le buffer tombe à zéro et Léa doit choisir : cible plus tard, ou contenu de pilote plus mince.

</details>

## Exercice 3 : « On rattrapera sur les vagues »

Le constat de pilote glisse de deux semaines. Le buffer avant le 29 août n'est plus que d'une semaine. Un participant propose de « comprimer les vagues » sans retirer de magasin ni de jour de formation. Quelle phrase refusez-vous d'écrire, et quelles options posez-vous à Léa ?

<details>
<summary>Voir la solution</summary>

Vous refusez d'écrire que les vagues se compriment toutes seules. Une fin n'accélère pas par une formule. Deux semaines de constat en plus et une semaine de buffer font une semaine non protégée avant le 1er septembre.

Vous posez des options réelles : déplacer la cible en assumant l'écart à la date légale, retirer du contenu de formation ou un cas pour raccourcir vraiment une vague, ou basculer d'abord un nombre de magasins moindre avec un repli clair pour les autres. Léa choisit. Le compte-rendu dit le buffer restant, négatif d'une semaine, pas un rattrapage moral. Le chemin critique, à ce moment-là, ce sont les vagues. Le regard se place là, pas sur le pilote déjà expliqué.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Dépendances et chemin critique
center: "Le chemin critique est la chaîne qui fixe le 29 août. Une semaine sur ce fil est une semaine de fin."
points:
  - icon: link
    title: Vraie attente
    text: "B est faux tant que A n'est pas vrai. Si rien ne casse en trichant, ce n'était qu'une préférence."
  - icon: compass
    title: Le fil
    text: "Transporteur, puis le plus lent entre règle, affichage et procédure, puis pilote, puis vagues."
  - icon: clock
    title: Sept jours
    text: "Demandez ce qui emporte août. Le sujet bruyant est souvent hors fil. Le silence du décideur, non."
  - icon: shield
    title: Buffer
    text: "Du temps sans tâche, avant le pilote et avant le 29 août. Pas une cachette pour afficher l'optimiste."
  - icon: eye
    title: Chaque semaine
    text: "Prochain jalon, maillon le plus long, buffer restant, une décision nommée. Le fil se redessine après chaque fait."
pitfall: "Optimiser le livret pendant que la signature transporteur dort, ou écrire qu'on rattrapera sur les vagues."
remember: "S'il y a doute entre deux chaînes, les deux sont critiques. Le regard suit le maillon, pas l'habitude de la semaine d'avant."
```
