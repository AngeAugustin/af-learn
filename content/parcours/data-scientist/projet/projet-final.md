---
title: "Projet final : le churn d'un opérateur"
description: Mener un cas guidé de bout en bout sur un jeu fictif de résiliation, de la cible à la baseline, au découpage temporel, à la métrique capacitaire et à la limite éthique.
duration: 90
objectives:
  - Cadrer un score de résiliation pour une équipe d'appels à capacité fixe
  - Justifier un découpage temporel et une baseline de règle métier
  - Choisir la métrique au volume d'appels et la marge d'arrêt
  - Rendre un dossier reproductible qui refuse un usage discriminatoire
---

# Le mandat NordTel

NordTel est un opérateur **fictif**. Il vend du mobile, de la fibre et un pack qui réunit les deux. La direction de la fidélisation vous écrit :

> Nos clients partent, faites un modèle de churn, et visez une baisse de 20 %.

Vous n'êtes pas tenu de livrer cette phrase. Vous êtes tenu de la **transformer**. L'équipe compte huit personnes. Elle peut passer environ **500 appels par semaine**, avec une offre de remise ou de réengagement. Elle ne veut pas résilier à la place du client, ni dégrader une ligne, ni « optimiser » le budget en évitant certains quartiers.

Le mandat que vous acceptez, et que le dossier devra reprendre, est celui-ci.

Chaque lundi, classer les **contrats encore actifs** selon le risque d'une résiliation **demandée par le client dans les 30 jours**. L'action est un appel avec une offre. Le volume est 500. Le score ne déclenche aucune sanction. Une revue humaine peut retirer un contrat déjà engagé dans un geste commercial.

Le projet dure le temps de ce chapitre : cadrer, construire une baseline, comparer un modèle simple et un boosting sur un protocole fermé, écrire le rapport. Vous n'avez pas à mettre une API en production. Vous devez dire **comment** le score serait servi (pipeline figé, pas d'entraînement dans la requête) en un paragraphe, pas en un service déployé.

```diagram
type: pipeline
title: "Le chemin du projet, dans l'ordre"
lanes:
  - title: "Cadrage"
    steps:
      - title: "Décision"
        text: "500 appels, offre, pas de sanction"
      - title: "Cible"
        text: "Résiliation client à 30 jours"
      - title: "Arrêt"
        text: "Marge contre la règle, et refus éthique"
  - title: "Preuve"
    steps:
      - title: "Découpage"
        text: "Mois futurs tenus hors du train"
      - title: "Baseline"
        text: "Fin d'engagement, puis appels support"
      - title: "Comparaison"
        text: "Logistique puis boosting, même métrique"
      - title: "Test"
        text: "Une lecture, modèle déjà choisi"
  - title: "Livrable"
    steps:
      - title: "Rapport"
        text: "Question, données, méthode, limites"
      - title: "Décision"
        text: "Livrer le tri, ou livrer la règle"
      - title: "Registre"
        text: "Version, période, commande, graine"
```

# Le jeu fictif

Aucune extraction réelle n'est fournie. Vous travaillez sur une **spécification** : soit vous simulez un tableau qui la respecte, soit vous raisonnez sur elle et vous le dites. Inventer une accuracy sans données, dans le rapport, est une faute. Simuler, puis rapporter le protocole et les chiffres **de votre simulation**, est l'exercice.

**Population.** Environ 80 000 contrats. Une ligne par contrat et par fin de mois, sur **14 mois** notés M01 à M14. Un contrat présent tout du long apparaît donc 14 fois. Les contrats ouverts ou clos en cours de route apparaissent moins souvent.

**Cible.** `a_resilie_dans_30j` vaut 1 si le client demande la résiliation dans les 30 jours qui suivent la date d'observation, 0 sinon. Taux d'environ **4 %** par mois, sur les contrats encore actifs à cette date. Les contrats déjà clos n'ont pas de ligne. Les lignes internes NordTel sont exclues.

**Changement de monde.** En **M10**, NordTel lance une offre pack moins chère. La facture médiane baisse sur une partie du parc, et les résiliations de mobile nu augmentent les mois suivants. Un modèle qui n'a jamais vu M10 ne « connaît » pas ce régime. C'est voulu : le découpage devra affronter ce décalage, pas le moyenner avec un tirage aléatoire.

| Colonne | Sens | Connue le dimanche de la date d'observation |
|---|---|---|
| `contrat_id` | Identifiant stable | Oui, mais ce n'est pas une feature |
| `date_observation` | Fin de mois M01…M14 | Oui |
| `anciennete_mois` | Ancienneté du contrat | Oui |
| `offre` | `mobile`, `fibre` ou `pack` | Oui |
| `engagement_fin_dans_jours` | Jours restants avant la fin d'engagement, vide si sans engagement | Oui |
| `facture_mensuelle_eur` | Dernière facture **close**, en euros | Oui |
| `data_go_mois` | Consommation data du mois clos | Oui |
| `appels_sav_90j` | Appels au support dans les 90 jours passés | Oui |
| `tickets_ouverts` | Tickets encore ouverts | Oui |
| `retard_paiement_jours` | Retard courant, 0 si aucun | Oui |
| `option_internationale` | 0 ou 1 | Oui |
| `canal_acquisition` | Boutique, web, partenaire | Oui |
| `region` | Grande région, maille large | Oui, voir la limite éthique |
| `a_resilie_dans_30j` | Cible | **Non** : elle se révèle 30 jours plus tard |

`quartier_prioritaire` n'est **pas** dans le jeu. Le métier vous demandera de l'ajouter en cours de route. Le jalon éthique consiste à répondre, pas à la créer pour « voir ce que ça donne ».

Pour une simulation crédible, faites dépendre la cible, avec du bruit, de la fin d'engagement proche, des appels support, du retard de paiement, et, à partir de M10, d'un surplus de départs sur l'offre mobile. Ne mettez pas la cible elle-même dans les features. Gardez quelques manquants sur la facture et sur la fin d'engagement (les sans-engagement ne sont pas des zéros déguisés : un zéro voudrait dire « l'engagement se termine aujourd'hui »).

> [!NOTE]
> Les chiffres de ce chapitre (500 appels, 4 %, marge de 5 points, découpage M01-M10 / M11-M12 / M13-M14) sont le **protocole de référence**. Vos simulations produiront d'autres scores. Le dossier est jugé sur le protocole et sur la cohérence des conclusions avec **vos** scores, pas sur l'atteinte d'une accuracy donnée.

# Ce que le cadrage doit trancher

Vous écrivez la page de cadrage avant le premier `fit`. Elle fige les choix suivants. Vous pouvez les discuter dans le rapport, pas les changer après avoir vu le test.

**Unité.** Une ligne par contrat et par `date_observation`. Le modèle prédit pour cette date, avec les colonnes de la ligne, sans regarder les mois futurs du même `contrat_id`.

**Découpage de référence.** Temporel.

- entraînement : M01 à M10 ;
- validation : M11 et M12 ;
- test : M13 et M14, ouvert une seule fois, après le choix du modèle.

Pourquoi pas un tirage aléatoire des lignes : le même contrat fuirait d'un mois sur l'autre, et le régime d'après M10 serait présent des deux côtés. Le modèle paraîtrait fort et échouerait au prochain changement d'offre. Un tirage aléatoire **par contrat** (toutes les dates d'un contrat du même côté) évite la fuite d'identité, pas le voyage dans le temps : des mois tardifs serviraient encore à prédire des mois anciens. Il est meilleur qu'un tirage de lignes, et **moins juste** que le découpage temporel pour cette décision, qui devra vivre après M10.

**Métrique de référence.** La précision parmi les **500** scores les plus hauts, moyenne sur les dates d'observation de la période évaluée (on calcule la précision de la liste de chaque mois, puis on moyenne). Secondaire : l'aire sous la courbe précision-rappel, parce que la cible est à 4 %. L'accuracy n'est pas un critère. L'AUC ROC peut être citée, elle ne départage pas.

**Marge d'arrêt.** On ne remplace la baseline que si la précision@500 gagne **au moins 5 points** en validation. À 1 point près entre deux modèles qui passent cette marge, on garde le plus simple. Le test ne sert pas à assouplir la marge.

**Features.** Identifiant exclu. Cible exclue. `region` autorisée seulement à maille large, et surveillée : si elle domine sans raison opérationnelle, on la retire et on recommence la comparaison. `quartier_prioritaire` refusé (jalon 3).

**Point de fonctionnement.** 500 n'est pas un seuil appris. C'est la capacité de l'équipe. Il reste dans la décision même si l'on change de modèle.

# Les jalons, dans l'ordre

Chaque jalon a un livrable court. Les trois exercices de la fin sont les jalons notés : baseline, découpage et métrique, limite éthique. Le reste structure le travail pour que ces jalons ne flottent pas.

**Jalon A, cadrage (une page).** Décision, cible, horizon, exclusions, coût d'un appel inutile et d'un départ non appelé, métrique, marge, données manquantes. Vous pouvez estimer le coût en ordres de grandeur (un appel coûte du temps d'opérateur, un départ coûte plusieurs mois de marge) sans fabriquer une comptabilité fausse.

**Jalon B, baseline.** La règle de référence, codée et mesurée sur la validation avec la précision@500. Spécification de référence : classer en priorité les contrats dont `engagement_fin_dans_jours` est inférieur ou égal à 30, puis, pour départager, ceux dont `appels_sav_90j` est le plus élevé. Les sans-engagement (valeur manquante) ne sont pas traités comme une fin d'engagement. Vous mesurez aussi, une fois, le classifieur constant, pour montrer qu'il ne constitue pas une liste.

**Jalon C, protocole.** Le découpage temporel ci-dessus, écrit avec le motif du refus du tirage aléatoire. La liste des modèles autorisés avant le test : la règle, une régression logistique sur un petit nombre de features, un gradient boosting. Un réseau dense est **facultatif** et seulement après le boosting, sur les mêmes dates. S'il ne gagne pas, on l'écarte en une phrase. On ne le présente pas comme le cœur du projet.

**Jalon D, comparaison.** Hyperparamètres choisis sur M11-M12 seulement. Tableau : précision@500 et métrique secondaire, pour la règle et les modèles. Un segment : les contrats de moins de trois mois d'ancienneté, ou l'offre mobile après le choc de M10. Vous choisissez le segment avant de le lire, et vous le dites.

**Jalon E, test et décision.** Un seul passage sur M13-M14 pour le modèle retenu et pour la règle. Phrase de décision : on sert ce classement pour les 500 appels, ou l'on sert la règle, parce que la marge n'est pas tenue. Date de revue : quand la cohorte suivante sera étiquetée, au plus tard à 60 jours.

**Jalon F, reproductibilité.** Graine, liste de features, commande ou notebook ordonné, instantané simulé identifié (même une graine de simulation). Quelqu'un d'autre doit retrouver votre précision de validation à la tolérance que vous annoncez.

```diagram
type: flow
title: "Ce qui a le droit de voir le test"
steps:
  - title: "Validation"
    text: "Règle, logistique, boosting. Réglages et choix du vainqueur."
    tone: teal
  - title: "Gel"
    text: "La phrase de choix est écrite avant d'ouvrir M13."
    tone: amber
  - title: "Test"
    text: "Une mesure du vainqueur et de la règle. Pas de nouveau modèle."
    tone: rose
```

# Les critères qui comptent

Le dossier est réussi si un lecteur peut vérifier les points suivants, que vos scores soient modestes ou non.

| Critère | Attendu |
|---|---|
| Cible | Résiliation client à 30 jours, pas « tout événement de fin ». Features antérieures à la date. |
| Découpage | Temporel, motif écrit. Le choc d'offre de M10 n'est pas mélangé au hasard dans le train et le test. |
| Baseline | La règle d'engagement est mesurée avec la **même** précision@500. Le constant ne sert pas d'adversaire principal. |
| Métrique | Précision au volume de 500. L'accuracy n'est pas le titre du graphique. |
| Test | Au plus une utilisation pour le choix déjà gelé. Les essais supplémentaires sont avoués. |
| Simplicité | Le réseau n'est pas retenu s'il ne bat pas le boosting. À 1 point près, le plus simple gagne. |
| Éthique | Refus explicite d'un ciblage par quartier prioritaire, et de toute sanction (débit, résiliation). |
| Rapport | Limites (choc d'offre, historique, labels en retard) puis décision. |
| Honnêteté | Aucun chiffre de performance inventé sans simulation. Les exemples de ce chapitre ne sont pas **vos** résultats. |

Un projet qui conclut « on garde la règle, le boosting ne gagne que 2 points » est **réussi** si le protocole est tenu. Un projet qui annonce 99 % d'accuracy est raté, même avec un notebook long.

# Le dossier à rendre

Cinq pièces, pas davantage.

1. **La page de cadrage**, y compris la marge et les usages interdits.
2. **Le tableau de comparaison** sur la validation, avec la règle, et la ligne de test du seul modèle retenu.
3. **Un graphique** précision@500, axe lisible, baseline présente, titre en phrase, période indiquée.
4. **Le rapport** en six mouvements (question, données, méthode, résultats, limites, décision), deux à cinq pages. Les échecs en font partie.
5. **La note de reproductibilité** : comment régénérer le tableau, avec la graine de simulation si vous simulez.

Le paragraphe de mise en service, volontairement court : le modèle retenu serait sérialisé **avec** sa préparation, versionné, chargé au démarrage d'un service de score, jamais réentraîné dans la requête. Le seuil d'action reste 500 appels, en dehors des poids. Ce paragraphe montre que vous ne confondez pas le notebook et le service. Il ne demande pas de déployer NordTel.

> [!IMPORTANT]
> La solution des exercices ci-dessous est la **référence de méthode**. Si votre simulation vous donne d'autres écarts, c'est votre tableau qui commande la décision, pas les chiffres d'illustration des chapitres précédents. La méthode, elle, ne se négocie pas après coup : découpage temporel, précision@500, refus du quartier.

# Exercices

## Exercice 1 : Baseline de référence

Sur le jeu NordTel, proposez la baseline que le boosting devra battre. Précisez les colonnes utilisées, le traitement des engagements manquants, la métrique, et pourquoi le classifieur majoritaire ne suffit pas comme adversaire. Donnez la règle de tri assez précisément pour qu'une autre personne la code.

<details>
<summary>Voir la solution</summary>

Baseline de décision : un **tri**, pas un modèle entraîné.

1. D'abord les contrats dont `engagement_fin_dans_jours` est connu et **inférieur ou égal à 30**.
2. Ensuite, à égalité, `appels_sav_90j` décroissant.
3. Les contrats **sans** engagement (valeur manquante) ne passent pas dans le premier groupe. Remplacer le manquant par 0 les ferait passer devant tout le monde, ce qui est le contraire du sens métier (0 jour = l'engagement se termine maintenant).

Métrique : **précision parmi les 500 premiers**, calculée par date d'observation puis moyennée, sur la période de validation M11-M12. Les deux colonnes sont connues le dimanche. On n'utilise pas la cible, ni un motif de départ.

Le classifieur majoritaire (« personne ne résilie », environ 96 % d'accuracy) ne produit **aucun ordre**. Il ne remplit pas une liste de 500. On peut le citer pour rappeler que l'accuracy est hors sujet. L'adversaire du boosting est la règle ci-dessus, mesurée avec la même précision@500. La marge de référence est de **5 points** sur cette règle. En dessous, on livre la règle.

</details>

## Exercice 2 : Split et métrique

Un collègue propose : « On tire 80 % des lignes au hasard, on optimise l'accuracy, et comme le mois d'offre est spécial on le met des deux côtés pour que le modèle le voie. » 

Expliquez pourquoi ce protocole est inadapté à NordTel. Donnez le découpage de référence, la métrique principale, la métrique secondaire, et le moment où le test a le droit d'être ouvert.

<details>
<summary>Voir la solution</summary>

Le tirage de **lignes** met plusieurs mois du même `contrat_id` dans le train et dans le test : le modèle reconnaît le contrat plus que le risque futur. Mélanger M10 « des deux côtés » apprend le nouveau régime avec des mois qui, en production, seraient encore **dans le futur** au moment de l'entraînement. L'accuracy, avec 4 % de positifs, est saturée par la classe « ne part pas » et ne décrit pas une liste de 500 appels.

Référence :

- **Train** M01-M10, **validation** M11-M12, **test** M13-M14.
- Le choc d'offre de M10 est ainsi dans le train tardif, et la validation / le test sont un futur que le modèle n'a pas appris mois par mois.
- Métrique principale : précision@500, moyenne des mois de la période.
- Métrique secondaire : aire précision-rappel. Pas l'accuracy.
- Les réglages et le choix entre règle, logistique et boosting se font sur la validation. Le test s'ouvre **une fois**, après ce choix, pour le vainqueur et la règle. On ne réintroduit pas M10 dans le test pour « aider ».

Un split aléatoire par contrat, sans fuite d'identifiant, resterait inférieur : il utiliserait encore des dates futures pour prédire des dates passées, et diluerait le choc d'offre.

</details>

## Exercice 3 : Limite éthique

En fin de projet, la direction demande d'ajouter `quartier_prioritaire` afin d'appeler **moins** ces quartiers et d'économiser les remises. Elle demande aussi si le même score peut couper le débit des contrats les plus « à risque » pour libérer le réseau.

Que refusez-vous, que pouvez-vous livrer quand même, et quelle limite le rapport doit-il écrire même si vous refusez ces deux demandes ?

<details>
<summary>Voir la solution</summary>

On **refuse** `quartier_prioritaire` comme feature de réduction des appels. L'appel est un **avantage** (une offre). Réduire cet avantage dans des quartiers déjà désignés par un critère socio-économique est un traitement défavorable, pas un réglage. L'indicateur n'est pas dans le jeu, et on ne le crée pas « pour comparer ».

On **refuse** la coupure de débit. La finalité cadrée est une offre de fidélisation. S'en servir pour dégrader le service est une sanction. Les poids, même bons en précision@500, ne se réutilisent pas pour cela.

On peut **livrer** le classement des 500 appels sans cette colonne, avec une phrase pour l'opérateur (facteurs principaux du dossier) et la possibilité de retirer un contrat déjà en geste commercial. On peut aussi livrer un taux de résiliation **agrégé par offre**, utile pour comprendre le choc de M10, sans cibler des personnes.

Limite à écrire même après ces refus : `region`, maille large, peut encore servir de proxy. Si elle domine l'importance sans motif de réseau (couverture, boutique), on la retire et on refait la comparaison en validation. Le rapport rappelle aussi que le test s'arrête en M14 : le prochain changement d'offre n'est pas garanti par le chiffre, d'où la revue à 60 jours. Le refus des deux demandes figure dans la décision, pas seulement dans un échange oral.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Projet churn NordTel"
center: "On classe 500 contrats à appeler, sur un futur non vu à l'entraînement. La règle d'engagement reste l'adversaire."
points:
  - icon: users
    title: "500 offres, pas une sanction"
    text: "Le score ordonne des appels de fidélisation. Il ne résilie pas et ne dégrade pas le débit."
  - icon: clock
    title: "Découpage en mois"
    text: "Train jusqu'à M10, validation M11-M12, test M13-M14 une seule fois. Pas de tirage de lignes."
  - icon: ruler
    title: "La règle d'abord"
    text: "Fin d'engagement à 30 jours, puis appels support. Le constant ne remplit pas la liste."
  - icon: gauge
    title: "Précision au volume"
    text: "Précision parmi les 500, marge de 5 points. L'accuracy masque un taux de départ à 4 %."
  - icon: shield
    title: "Quartier refusé"
    text: "On n'économise pas les offres en évitant un quartier. La région qui sert de proxy se surveille."
  - icon: file
    title: "Chiffres à vous"
    text: "Simulez ou décrivez, mais ne recopiez pas un score imaginaire. La méthode prime sur le niveau."
pitfall: "Mélanger les mois d'un même contrat entre train et test, puis annoncer une accuracy de 96 %."
remember: "Livrer la règle quand la marge n'est pas tenue est un succès. Inventer la performance n'en est pas un."
```
