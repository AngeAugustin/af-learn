---
title: Cadrer un problème de prédiction
description: Transformer une phrase métier en tâche, cible, horizon et coût d'erreur, puis écrire les données disponibles et le critère d'arrêt avant tout modèle.
duration: 40
objectives:
  - Traduire un objectif métier en type de tâche et en décision concrète
  - Définir la cible, le horizon et l'unité statistique sans fuite
  - Relier le coût des erreurs à une métrique et à la capacité d'action
  - Écrire un critère d'arrêt et un cadrage d'une page avant d'entraîner
---

# Une phrase métier n'est pas une tâche

« Il faut prédire le churn », « on veut réduire les impayés », « il nous faut de l'IA sur les résiliations » : ce sont des **intentions**, pas des tâches d'apprentissage. Une tâche dit ce qu'on calcule, pour qui, à quel moment, et quelle décision change si le calcul est bon.

Avant de choisir une famille de modèles, on reformule en quatre éléments.

- **L'utilisateur du score.** Le centre d'appels, un chargé de crédit, un atelier. Pas « l'entreprise » en général.
- **La décision.** Appeler, proposer une offre, demander une pièce, prioriser une visite. Ou ne rien automatiser.
- **Le moment.** Chaque lundi matin, à l'ouverture d'un dossier, à la fin d'un cycle machine.
- **Ce qui est hors sujet.** Résilier automatiquement, fixer un prix, expliquer le passé sans agir.

Exemple. Phrase reçue : « Il faut prédire le churn. » Phrase de travail : « Chaque lundi, classer les contrats encore actifs selon la probabilité d'une résiliation demandée par le client dans les 30 jours, pour qu'une équipe de huit personnes appelle les 500 scores les plus hauts avec une offre. On ne résilie personne par le score, on ne change pas le débit. »

Si aucune décision ne change, le projet n'est pas un projet de modèle. Une analyse descriptive (quel tarif concentre les départs) peut suffire, et elle est souvent plus utile qu'un score que personne n'ouvrira.

```diagram
type: flow
title: "De la phrase au cadrage"
steps:
  - title: "Intention"
    text: "Le mot du métier, encore trop large."
    tone: blue
  - title: "Décision"
    text: "Qui agit, quand, sur combien de cas."
    tone: violet
  - title: "Tâche"
    text: "Cible, horizon, unité, type de sortie."
    tone: teal
  - title: "Arrêt"
    text: "Métrique, données réellement là, critère pour s'arrêter."
    tone: amber
```

# Cible, horizon, unité

Le **type de tâche** suit la décision, pas l'inverse.

| Décision | Tâche naturelle | Sortie |
|---|---|---|
| Appeler un nombre fixe de personnes | Classement | Un score pour trier, pas une accuracy. |
| Estimer un montant | Régression | Un nombre dans l'unité du montant. |
| Séparer deux issues au seuil d'un coût | Classification | Un score, puis un seuil choisi à part. |
| Découvrir des groupes sans étiquette | Non supervisé | Des segments, à faire relire par le métier. Pas une « précision ». |

La **cible** est un événement défini, pas un synonyme flou. Pour une résiliation : départ à l'initiative du client, entre la date de décision et 30 jours après. On exclut les fins de contrat déjà connues, les lignes internes de l'entreprise, les créations du jour même (aucun historique). On écrit ces exclusions. Deux personnes qui comptent « le churn » autrement ne comparent pas des modèles, elles comparent des sujets.

L'**horizon** est le délai entre le moment où l'on décide et le moment où l'événement est observable. Prédire à 30 jours avec des features calculées à J+15 est une fuite : ces features n'existeront pas le lundi où il faut agir. Tout champ utilisé doit être **connu à la date de décision**. Le nombre d'appels le jour de la résiliation, le motif saisi à la clôture, le dernier geste commercial consécutif au départ : exclus.

L'**unité** est la ligne que le modèle voit. Un client, un contrat, un contrat par mois. Si un client a trois contrats, prédire « le client » sans dire lequel mélange des échéances différentes. Si l'on produit une ligne par mois, le même contrat apparaît quatorze fois : un tirage aléatoire des lignes met le futur de ce contrat dans le train. Le cadrage choisit l'unité **avant** le split, pas après avoir vu une accuracy trop belle.

> [!WARNING]
> Une cible définie avec un champ qui n'existe qu'après l'événement (motif de départ, dernier questionnaire) donne des modèles spectaculaires et inutilisables. Si le champ n'est pas là le lundi matin, il n'est pas une feature, et il ne doit pas non plus servir à fabriquer l'étiquette de façon à la rendre trop facile.

# Le coût d'erreur choisit la métrique

Toutes les erreurs ne coûtent pas le même prix. On les écrit en langage de décision, puis on en déduit la métrique. On ne part pas de l'accuracy parce qu'elle est dans le tutoriel.

Pour l'équipe qui appelle 500 personnes :

- **Faux positif** : un client qui ne serait pas parti est appelé. Coût : le temps de l'opérateur, une gêne légère, parfois une offre inutile.
- **Faux négatif** : un client qui part n'est pas appelé. Coût : la marge perdue sur les mois qu'il serait resté si l'offre avait marché. L'offre ne marche pas à tous les coups : le coût se discute avec le métier, il ne se invente pas au centime près.
- **Contrainte dure** : 500 appels, pas 500 000. Le modèle ne « traite » pas toute la base. Il **ordonne**.

La métrique qui colle est alors la **précision parmi les 500** (quelle part des appelés part vraiment), éventuellement le rappel à cette capacité, pas le taux de bonnes réponses sur toute la base. Avec 4 % de départs, un modèle constant « personne ne part » affiche 96 % d'accuracy et une liste d'appels vide de sens.

Si les coûts changent (l'équipe passe à 200 appels, ou l'offre devient très chère), le seuil ou la profondeur de liste change **sans** réentraîner. C'est encore une raison de sortir un score et de garder le point de fonctionnement dans la décision, pas dans les poids.

On écrit aussi ce que la métrique ne couvre pas : un appel réussi qui agace et abîme la marque n'est pas dans la précision. Si ce risque compte, il devient une contrainte (ne pas appeler certains segments, plafonner la fréquence), pas une ligne de plus dans l'AUC.

# Les données disponibles à la date de décision

On dresse l'inventaire de ce qui existe **aujourd'hui**, pas de ce qu'un entrepôt idéal contiendrait.

- **Sources.** Facturation mensuelle, tickets du support, catalogue d'offres. Pas le prix du concurrent s'il n'est nulle part.
- **Historique.** Si les tickets n'existent que depuis six mois, l'historique fait six mois. On ne promet pas une saisonnalité annuelle.
- **Fraîcheur.** La photo de dimanche soir est-elle là lundi à 7 h ? Si elle arrive le mercredi, la décision du lundi ne peut pas s'en servir.
- **Étiquette.** Quelqu'un a-t-il enregistré les résiliations, avec une date et un motif fiable ? Sans étiquette, il n'y a pas d'apprentissage supervisé. On le dit avant le notebook.
- **Droits.** A-t-on le droit d'utiliser ce champ pour cette finalité ? Un champ disponible techniquement peut être interdit. Le cadrage le sort de la liste.

La granularité suit l'unité : une ligne par contrat et par fin de mois, features calculées avec les seuls événements antérieurs à cette fin de mois. Un exemple de champ légitime : nombre d'appels au support dans les 90 jours **précédant** la date d'observation. Un champ illégitime : nombre d'appels dans les 90 jours autour de la date, fenêtre centrée qui regarde le futur.

```diagram
type: compare
title: "Disponible ne veut pas dire utilisable"
columns:
  - title: "On peut s'en servir"
    tone: teal
    items:
      - "Connu avant la décision"
      - "Historique assez long pour le horizon"
      - "Définition stable (unité, modalité)"
      - "Finalité couverte par le droit d'usage"
  - title: "On le laisse de côté"
    tone: rose
    items:
      - "Renseigné seulement après l'événement"
      - "Promis par un autre projet, pas encore là"
      - "Identifiant trop fin qui réidentifie une personne"
      - "Proxy d'un attribut qu'on n'a pas le droit de cibler"
```

S'il manque l'étiquette ou la fraîcheur, le livrable du cadrage est « on ne modélise pas encore », plus la donnée à collecter. Ce n'est pas un report honteux. C'est le critère d'arrêt qui fonctionne.

# Un critère d'arrêt avant le premier modèle

Le **critère d'arrêt** se fixe avant de voir un score de test. Il dit dans quels cas on cesse d'améliorer, et ce qu'on livre à la place.

Formulations utilisables :

- « Si, sur un découpage temporel, la précision parmi les 500 n'est pas supérieure d'au moins 5 points à la règle "fin d'engagement dans les 30 jours", on déploie la règle et on arrête les essais de modèles. »
- « Si l'étiquette n'est pas fiable sur plus de 20 % des départs, on ne lance pas l'apprentissage. On revoit la collecte. »
- « Si l'avis sur les features sensibles refuse le périmètre, on s'arrête, même si la métrique est belle. »

Un critère écrit après coup (« finalement 1 point suffit, le réseau a tellement de potentiel ») n'en est pas un. Il enregistre la déception ou l'enthousiasme. La marge se discute avec la personne qui paiera les appels et vivra avec les erreurs, pas seulement dans l'équipe modèle.

L'arrêt peut aussi être positif et court : la baseline atteint déjà le besoin, on la livre, on ne cherche pas un deuxième chiffre. Le chapitre suivant en fait la discipline par défaut.

# Le cadrage tient sur une page

Une page, pas un dossier. Elle se relit en comité sans ouvrir de code. Rubriques minimales :

1. **Décision** : qui, quand, quelle action, quel volume, ce qui est interdit.
2. **Tâche** : type, unité, cible en une phrase, horizon, exclusions.
3. **Coût** : ce que coûtent les deux erreurs, métrique qui en découle.
4. **Données** : sources, historique, ce qui est connu à la date de décision, ce qui manque.
5. **Arrêt** : marge contre la baseline, motifs d'abandon (données, droit, éthique).
6. **Hors scope** : les usages qu'on ne fera pas avec le même score.

Cette page est le contrat avec le métier. Le modèle qui la contredit (autre cible, autre population, autre usage) n'est pas une amélioration. C'est un autre projet, qui recommence au premier paragraphe.

> [!TIP]
> Faites relire la définition de la cible par la personne qui saisit les résiliations, pas seulement par le sponsor. C'est là que « départ », « fin d'engagement » et « portabilité » se révèlent être trois événements différents.

# Exercices

## Exercice 1 : Réécrire la phrase

La direction écrit : « Utilisez le machine learning pour fidéliser et faire baisser le churn de 20 %. » L'équipe d'appels compte huit personnes, cinq jours par semaine, et peut passer environ 500 appels utiles. Aucune résiliation automatique n'est souhaitée.

Proposez une reformulation opérationnelle (décision, volume, horizon). Dites pourquoi « −20 % de churn » n'est pas encore une métrique de modèle.

<details>
<summary>Voir la solution</summary>

Reformulation : chaque semaine, produire un **classement** des contrats actifs selon le risque de résiliation à l'initiative du client dans les 30 prochains jours, et n'en retenir que **500** pour une offre de fidélisation. Pas de résiliation automatique, pas de dégradation de service.

« −20 % de churn » mélange l'effet de l'offre, la capacité d'appels, la saison, et la qualité du classement. Le modèle ne contrôle que le **tri**. Sa métrique est la qualité de ce tri (précision ou rappel parmi les 500), pas le taux de churn global, qui bougera aussi si l'offre est mauvaise ou si l'équipe n'appelle pas. L'objectif de −20 % peut rester un objectif **métier**, suivi à part, une fois l'offre et le volume tenus constants. Ce n'est pas le coût qu'on optimise dans `fit`.

</details>

## Exercice 2 : Cible qui fuit

On vous propose la cible `a_resilie`, et les features suivantes, calculées le jour de l'extraction, sans date d'observation : nombre d'appels sur les 7 derniers jours, motif de clôture, « a appelé le service résiliation », ancienneté, facture du mois en cours.

Lesquelles sont illégitimes pour une décision prise **avant** le départ, et comment reformuler l'unité et l'horizon ?

<details>
<summary>Voir la solution</summary>

Illégitimes pour prédire un départ pas encore arrivé : le **motif de clôture** (connu après), le flag **« a appelé le service résiliation »** s'il n'est vrai qu'au moment du départ, et des appels « des 7 derniers jours » mesurés le jour de l'extraction globale, parce que cette extraction regarde une période qui peut inclure l'après-décision. La facture du mois en cours est suspecte si elle n'est arrêtée qu'en fin de mois, après la décision du lundi.

Reformulation : une ligne par **contrat et par date d'observation** (par exemple chaque dimanche). Cible : résiliation client dans les 30 jours **après** cette date. Features : uniquement des faits antérieurs à la date (appels des 90 jours passés, facture du mois **clos**, ancienneté à cette date). On exclut les contrats déjà clos.

</details>

## Exercice 3 : Écrire l'arrêt

Les données d'appels n'existent que depuis cinq mois. Le taux de départ mensuel est d'environ 4 %. L'équipe peut appeler 500 contrats. Une règle existe déjà : appeler ceux dont l'engagement se termine dans le mois. Le service juridique n'a pas encore statué sur l'usage du code postal.

Écrivez trois critères d'arrêt distincts : données, métrique, droit.

<details>
<summary>Voir la solution</summary>

1. **Données.** Avec cinq mois d'appels seulement, on n'estime pas de saisonnalité annuelle. Si l'étiquette de résiliation n'est pas datée de façon fiable, on n'entraîne pas. On livre au mieux la règle d'engagement.
2. **Métrique.** Si, sur un découpage temporel, la précision parmi les 500 ne gagne pas au moins 5 points sur la règle « engagement qui se termine dans le mois », on déploie la règle et on arrête. Le 4 % de base rappelle que l'accuracy n'est pas le critère.
3. **Droit.** Tant que l'usage du code postal n'est pas accepté, cette colonne est **hors** du modèle. Si le périmètre de features finalement autorisé est jugé trop pauvre pour battre la règle, on s'arrête quand même. On n'attend pas la métrique pour poser une colonne interdite.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Cadrer un problème"
center: "On transforme une intention en décision, cible, horizon et coût. Sans critère d'arrêt écrit, le modèle n'a pas de fin."
points:
  - icon: compass
    title: "Une décision"
    text: "Qui agit, quand, sur combien de cas. Une phrase comme « prédire le churn » ne suffit pas."
  - icon: target
    title: "Cible et horizon"
    text: "Événement daté, exclusions écrites. Chaque feature doit exister à la date de décision."
  - icon: money
    title: "Coût puis métrique"
    text: "Faux positifs et faux négatifs n'ont pas le même prix. La capacité d'action borne la liste."
  - icon: database
    title: "Données réelles"
    text: "Ce qui est là, frais, licite. Une étiquette absente annule le supervisé, elle ne se bricole pas."
  - icon: alert
    title: "Arrêt avant le fit"
    text: "Marge contre la baseline, trou de données, refus juridique. Décidé avant de voir le test."
pitfall: "Optimiser l'accuracy d'une cible définie avec des champs qui n'existent qu'après l'événement."
remember: "Le cadrage tient sur une page. Un modèle qui change la décision ou la population est un autre projet."
```
