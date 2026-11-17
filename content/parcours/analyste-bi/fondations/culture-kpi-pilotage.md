---
title: Culture des KPI et du pilotage
description: "Distinguer métrique et KPI, construire un arbre d'indicateurs, puis fixer cible, seuil, propriétaire et rythme de revue, sans céder aux indicateurs de vanité."
duration: 50
objectives:
  - Distinguer une métrique, un indicateur et un KPI de pilotage
  - Construire un arbre d'indicateurs du résultat vers l'action
  - Associer à un KPI une cible, un seuil, un propriétaire et un rythme
  - Écarter les indicateurs de vanité d'une revue de direction
---

# Métrique, indicateur, KPI

Dans beaucoup d'entreprises, tout nombre s'appelle « KPI ». La revue en compte alors quarante, personne ne décide, et l'analyste passe sa semaine à commenter des variations sans conséquence. Le vocabulaire de ce chapitre est volontairement strict.

Une **métrique** est un nombre mesuré. Le nombre de références au catalogue, le trafic magasin, le CA HT, le taux de marge, le nombre de pages ouvertes dans le rapport : ce sont des métriques. Elles peuvent être exactes et malgré tout inutiles pour décider.

Un **indicateur** est le mot parapluie que le métier emploie. Dans un arbre, vous trouverez des métriques de contexte et des KPI. Quand quelqu'un dit « indicateur » sans préciser, demandez : est-ce un nombre que l'on suit, ou un nombre sur lequel on s'engage ?

Un **KPI** (indicateur clé de pilotage) est une métrique choisie pour une décision qui revient. Il n'est pas « plus vrai » qu'une autre métrique. Il est **armé** : on sait quelle décision il éclaire, et ce qui se passe quand il sort des clous.

```diagram
type: decision
title: Ce nombre mérite-t-il une revue ?
nodes:
  - question: Une décision change-t-elle si ce nombre bouge ?
    yes: Il peut entrer dans le pilotage
    no: Métrique de contexte, ou simple vanité
  - question: A-t-il une cible, un seuil, un propriétaire et un rythme de revue ?
    yes: C'est un KPI
    no: Ne le mettez pas sur la page de pilotage
```

Chez Halte Marché, le nombre de références au catalogue est une métrique. Il bouge peu la décision du lundi. Le CA HT de la semaine contre le budget est un candidat KPI : s'il décroche, la directrice régionale appelle des magasins. Il ne devient KPI qu'une fois la cible, le seuil, le propriétaire et le rythme écrits. Sans ces quatre éléments, c'est encore une métrique intéressante, pas un instrument de pilotage.

# L'arbre d'indicateurs

Un KPI de résultat, seul, ne dit pas quoi faire. « La marge baisse » ne dit pas si le problème est le prix, le volume, la démarque ou le mix rayon. L'**arbre d'indicateurs** relie le résultat revu en comité aux leviers qu'un magasin peut actionner.

```diagram
type: layers
title: Arbre de la marge chez Halte Marché
layers:
  - title: Résultat de comité
    items: ["Marge commerciale du mois"]
  - title: Moteurs
    items: ["CA HT", "Taux de marque", "Démarque"]
  - title: Leviers magasin
    items: ["Trafic", "Taux de transformation", "Panier moyen"]
  - title: Métriques d'action
    items: ["Ruptures du frais", "Heures en caisse", "Prix d'appel"]
```

Le comité voit le résultat et l'écart à la cible. Le directeur régional voit les moteurs (où la marge se perd). Le directeur de magasin voit les leviers et les métriques d'action (ruptures, heures, prix). **Même définition à tous les étages.** Seule la profondeur change. Si le magasin calcule un « panier moyen » différent de celui du comité, l'arbre est un poster, pas un système.

Quelques règles de construction.

- Partez de la décision du haut, pas de la liste des colonnes disponibles.
- Chaque étage explique l'étage du dessus. Le CA HT se décompose en trafic × transformation × panier. Si l'identité n'est pas vraie sur vos données, ne la dessinez pas.
- Limitez les KPI affichés en revue. Trois à sept nombres sur lesquels on peut agir valent mieux que trente courbes.
- Les métriques d'action peuvent rester hors de la page de direction, dans la page magasin, tant qu'elles descendent des mêmes mesures.

Le contrôle de gestion tient souvent un second arbre, financier : marge, frais de personnel, résultat de magasin. Reliez les deux par les mesures communes (CA HT, marge commerciale). Ne fusionnez pas tout sur une page : les rythmes ne sont pas les mêmes (semaine commerciale, mois de clôture).

```video
url: https://www.youtube.com/watch?v=RavVGd9of6w
title: "KPI Trees Explained in 3 Minutes"
channel: "Made to Measure KPIs"
duration: "3:03"
lang: en
why: "L'arbre d'indicateurs expliqué en trois minutes : relier un objectif aux leviers qui le font bouger."
```

# Cible, seuil et propriétaire

Trois mots transforment une métrique en KPI. Sans eux, la revue commente. Avec eux, elle tranche.

La **cible** est la valeur visée. Chez Halte Marché, la cible de CA HT hebdomadaire est le budget du contrôle de gestion, pas « faire mieux que la semaine dernière » si la semaine dernière était un jour férié. La cible a une source nommée. Si le budget change en cours de mois, la date de version fait partie du chiffre (« budget V2 du 4 novembre »).

Le **seuil** est l'écart qui déclenche une action, pas un simple commentaire. Exemple écrit avec la directrice des opérations :

- écart de CA HT au budget entre 0 et −2 % : mention en revue, pas d'appel ;
- au-delà de −2 % sur la semaine : le régional contacte les trois magasins qui portent l'écart, avant mercredi ;
- taux de rupture frais au-dessus de 8 % un matin : action le jour même en magasin.

Le seuil évite de traiter tous les magasins comme des urgences. Il se négocie avec ceux qui agiront. Un seuil que personne ne peut tenir (écart maximal de 0,1 % sur un rayon volatile) sera ignoré dès la deuxième revue.

Le **propriétaire** est une personne, pas un service. Séparez deux propriétés que les entreprises mélangent :

| Objet | Propriétaire typique | Ce qu'il garantit |
|---|---|---|
| Définition, fraîcheur, rapport | Analyste BI nommé | La formule, le périmètre, l'heure des données |
| Cible (budget) | Contrôle de gestion | La version de budget utilisée |
| Action commerciale | Directeur régional ou de magasin | L'appel, le plan, le suivi du seuil |

« L'équipe data » n'est pas propriétaire du CA. Elle est propriétaire du **miroir**. Le propriétaire de l'action doit pouvoir changer le réel (commandes, prix, heures), pas seulement le graphique. Si vous acceptez d'être propriétaire de l'action, vous promettez un métier qui n'est pas le vôtre, et personne ne pilote vraiment.

> [!IMPORTANT]
> Un KPI sans propriétaire d'action est une métrique décorative. Un KPI dont vous êtes l'unique propriétaire finit dans votre boîte mail, pas dans la revue.

# Le rythme de la revue

Le **rythme de revue** est la cadence à laquelle des humains regardent le KPI et peuvent encore agir. Il n'est pas égal à la cadence de rafraîchissement des données.

| Rythme | Exemple Halte Marché | Pourquoi cette cadence |
|---|---|---|
| Quotidien | Ruptures du frais, le matin | Le magasin peut réassortir dans la journée |
| Hebdomadaire | CA HT contre budget, le lundi | La semaine commerciale est l'unité de la revue opérations |
| Mensuel | Marge après clôture | Le chiffre finance n'existe pas avant la clôture |

Un rafraîchissement quotidien d'un KPI qui ne se décide qu'une fois par an est du théâtre. Une revue quotidienne d'une marge qui n'est fiable qu'après clôture mensuelle l'est aussi : vous commentez du bruit. Alignez trois horloges, et écrivez-les sur la page :

1. **Horloge du réel** : à quelle vitesse le magasin peut-il agir ?
2. **Horloge de la donnée** : quand le chiffre est-il complet (fin de journée de caisse, clôture) ?
3. **Horloge de la revue** : quel jour, quelle heure, quels présents ?

Si la revue a lieu le lundi à 9 h et que les caisses du dimanche n'arrivent qu'à 11 h, le pack du lundi porte la semaine **close le samedi**, et la page le dit. Décider sur un dimanche manquant, sans le dire, fabrique de faux écarts au budget.

Le rythme se tient. Annuler trois lundis de suite « parce que les chiffres étaient presque bons » dissout le KPI. Mieux vaut une revue courte (quinze minutes sur les seuls magasins hors seuil) qu'une heure où l'on relit toutes les métriques.

# Les indicateurs de vanité

Un **indicateur de vanité** est une métrique qui flatte, qui monte souvent, et qui ne change aucune décision. Elle occupe la première page parce qu'elle est facile à calculer ou agréable à montrer.

Signaux habituels :

- le nombre n'a pas de cible, ou la cible est « en hausse » sans plancher ;
- personne ne sait quoi faire si le nombre baisse de 10 % ;
- le volume sous le ratio est minuscule (100 % de satisfaction sur deux réponses) ;
- on cumule depuis le début de l'année pour masquer une mauvaise semaine ;
- l'indicateur mesure l'activité de l'équipe BI (nombre de rapports publiés) à la place du résultat de l'enseigne.

Chez Halte Marché, trois classiques reviennent.

1. **Le catalogue.** « 12 000 références » en ouverture de comité, pendant que les 100 produits qui font le trafic sont en rupture. La métrique catalogue peut rester dans une annexe achats. Elle ne pilote pas la marge de la semaine.
2. **La satisfaction sans volume.** Une note de 4,8 sur un magasin qui a reçu six avis. Affichez le volume à côté, ou imposez un minimum d'avis avant d'en faire un KPI.
3. **La prévision toujours optimiste.** Un écart de prévision présenté sans le biais (systématiquement au-dessus du réel depuis six mois). Le nombre a l'air scientifique. Il ne sert qu'à rassurer. Si vous publiez une prévision retenue par le métier, publiez aussi le biais constaté. Vous ne fabriquez pas le modèle. Vous refusez qu'il décore la page.

La vanité n'est pas un nombre faux. C'est un nombre **vrai, mal placé**. Le sortir de la page de pilotage n'est pas le censurer. C'est le rendre à son rôle : contexte, annexe, ou analyse ponctuelle.

# Halte Marché, deux niveaux de pilotage

Le même arbre alimente deux revues. Les mélanger est la cause la plus fréquente de « trop de KPI ».

**Revue opérations, le lundi, 30 minutes.** Page unique : CA HT semaine contre budget, écart en euros et en %, trois magasins hors seuil, un moteur (trafic, transformation ou panier) pour chacun. Les ruptures frais ne montent au régional que si le seuil magasin a déjà été franchi plusieurs matinées. Propriétaire d'action : directrice régionale. Propriétaire du miroir : vous.

**Revue finance opérationnelle, après clôture.** Page unique : marge commerciale contre budget, pont depuis le CA (taux de marque, démarque), écart résiduel avec la comptabilité, version de budget. On n'y commente pas le dimanche d'il y a trois jours. Propriétaire de la cible : contrôle de gestion. Propriétaire du miroir : vous, avec le rapprochement signé.

Les métriques qui n'entrent dans aucune des deux revues n'ont pas à porter le nom de KPI. Elles peuvent exister. Elles n'ouvrent pas le comité.

> [!TIP]
> Écrivez sur chaque KPI une fiche de huit lignes : décision, formule, cible et sa source, seuil, propriétaire du miroir, propriétaire de l'action, rythme, métriques exclues de la page. Cette fiche vaut plus qu'un nouveau visuel.

# Exercices

## Exercice 1 : Classer cinq nombres

Classez chaque nombre : métrique de contexte, KPI (s'il est déjà armé), ou indicateur de vanité. Justifiez en une phrase.

1. CA HT hebdomadaire contre budget V2, seuil à −2 %, régional responsable de l'appel, revue le lundi.
2. Nombre total de références au catalogue, affiché en première page, sans cible.
3. Taux de rupture du frais à 8 h, seuil 8 %, directeur de magasin, action dans la journée.
4. Note moyenne de satisfaction du mois, tous magasins confondus, sans nombre d'avis.
5. Trafic magasin de la semaine, suivi par le régional pour expliquer le CA, sans seuil propre.

Solution :
<details>
<summary>Voir la solution</summary>

1. **KPI.** Décision, cible (budget V2), seuil, propriétaire d'action, rythme : les quatre armes sont là.
2. **Vanité** dans ce placement. Le nombre peut être vrai, il n'oriente pas la revue et occupe la page du résultat.
3. **KPI** opérationnel, à la maille magasin. Le rythme colle à l'action (le matin même).
4. **Vanité**, tant que le volume d'avis n'est pas là. Un ratio sans dénominateur se manipule tout seul.
5. **Métrique de contexte** (levier de l'arbre), pas un KPI tant qu'elle n'a pas son propre seuil. Elle explique le CA, elle ne le remplace pas.

</details>

## Exercice 2 : Compléter l'arbre

Le comité ne veut voir que la marge commerciale. Le directeur du magasin de Lille dit : « Je ne sais pas quoi faire de ce chiffre. » Proposez deux moteurs et deux métriques d'action, et dites laquelle de ces quatre nombres a le droit de figurer sur la page du comité.

Solution :
<details>
<summary>Voir la solution</summary>

Moteurs possibles, sous la marge : **CA HT**, **taux de marque**, **démarque** (deux suffisent dans la réponse, trois sont cohérents).

Métriques d'action magasin : **ruptures du frais**, **heures en caisse**, ou un **prix d'appel** mal tenu. Elles vivent sur la page magasin.

Sur la page du comité : la **marge** (résultat) et, en cas d'écart hors seuil, le moteur qui l'explique, pas la liste des ruptures de chaque magasin. Le comité décide d'un écart de marge. Le magasin agit sur la rupture. Même arbre, deux profondeurs.

</details>

## Exercice 3 : Armer un KPI

Le marketing propose comme KPI « le nombre de visites sur l'application ». La direction hésite. Rédigez la fiche minimale (décision, cible, seuil, deux propriétaires, rythme) **ou** expliquez pourquoi vous refusez de l'armer. Les visites application ne changent aujourd'hui aucune décision de Halte Marché. Le CA HT, si.

Solution :
<details>
<summary>Voir la solution</summary>

Vous **refusez de l'armer** en l'état. Aucune décision ne change si les visites bougent : c'est le test du premier losange. Le nombre peut rester une métrique dans une annexe marketing.

Si le marketing veut un vrai KPI, il doit d'abord nommer la décision (par exemple : augmenter le budget d'acquisition seulement si les visites application se transforment en CA identifié). Alors seulement vous exigez une cible, un seuil, un propriétaire d'action (marketing, pas vous), un rythme, et un lien avec le CA HT déjà certifié. Sans ce lien, vous ne placez pas le nombre sur la page de pilotage.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Culture des KPI et du pilotage
center: "Un KPI est une métrique armée pour une décision qui revient, pas un nombre de plus."
points:
  - icon: gauge
    title: Métrique ou KPI
    text: "La métrique se mesure. Le KPI décide, avec cible, seuil, propriétaire et rythme."
  - icon: layers
    title: Arbre court
    text: "Du résultat vers les moteurs, puis vers l'action magasin. Même formule à chaque étage."
  - icon: target
    title: Cible et seuil
    text: "La cible dit où aller. Le seuil dit à partir de quand quelqu'un agit vraiment."
  - icon: users
    title: Deux propriétaires
    text: "Vous tenez le miroir et la définition. Le métier tient l'action, nominativement."
  - icon: clock
    title: Rythme humain
    text: "La revue suit la vitesse de l'action, pas la vitesse théorique du rafraîchissement."
  - icon: alert
    title: Vanité
    text: "Un nombre vrai, flatteur, sans décision, sort de la page. Il peut vivre en annexe."
pitfall: "Appeler KPI quarante métriques sans seuil, puis commenter chaque variation sans jamais trancher."
remember: "Si personne n'agit quand le nombre bouge, ce n'est pas un KPI. C'est du contexte, ou de la vanité."
```
