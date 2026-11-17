---
title: Métriques et validation
description: Séparer les données, choisir une métrique primaire et juger un modèle sur ce qu'il n'a pas vu à l'entraînement.
duration: 60
objectives:
  - Découper un jeu en entraînement, validation et test
  - Choisir une métrique alignée sur le coût métier
  - Utiliser une validation croisée sans toucher au test
  - Lire un score de calibration comme une confiance, pas comme une vérité
---

# Pourquoi un score sur les données d'entraînement ne compte pas

Un modèle qui récite ses exemples d'entraînement peut afficher **98 %** de bonnes réponses et échouer le lendemain. La seule question utile est : **sur des cas qu'il n'a pas utilisés pour se régler, quelle erreur coûte le moins cher ?**

Vous disposez de **12 000** clients d'un opérateur, avec une étiquette : le client a résilié dans les **60 jours** (oui ou non). Vous n'en montrez qu'une partie au modèle. Le reste sert de juge.

```diagram
type: flow
title: Trois rôles pour les lignes
steps:
  - title: Entraînement
    text: Le modèle apprend ses paramètres
    tone: blue
  - title: Validation
    text: Vous comparez des réglages
    tone: teal
  - title: Test
    text: Une seule mesure finale, intouchée
    tone: amber
```

Une répartition fréquente : **70 %** entraînement, **15 %** validation, **15 %** test. Le test reste dans un tiroir jusqu'à la fin. Chaque fois que vous le consultez pour « juste vérifier », il cesse d'être un juge indépendant.

# Découper sans tricher

Le découpage doit respecter la structure du problème.

- **Classification déséquilibrée.** Si **8 %** des clients résilient, chaque partie doit garder à peu près ces **8 %**. C'est la **stratification**. Un test sans aucun résiliant ne mesure rien.
- **Séries temporelles.** On n'entraîne pas sur mars pour prédire janvier. Le test est la période **la plus récente**, jamais un tirage mélangé. Le chapitre sur les séries y revient.
- **Plusieurs lignes par client.** Si le même client apparaît **6 fois**, toutes ses lignes vont dans la même partie. Sinon le modèle reconnaît une personne qu'il a déjà vue.

> [!WARNING]
> Mélanger les lignes au hasard quand le temps ou l'identité compte est la fuite la plus courante. Le score grimpe, la production déçoit.

# Une métrique primaire, pas un tableau de chasse

Vous pouvez calculer dix indicateurs. Vous n'en pilotez qu'**un**, choisi avant l'expérience, parce qu'il traduit le coût.

| Situation | Métrique primaire | Pourquoi |
|---|---|---|
| Résiliation rare, un appel inutile coûte peu | Rappel des résiliants, à précision minimale de 30 % | Mieux vaut appeler un client fidèle que rater un départ |
| Fraude, un faux blocage est très cher | Précision élevée | On ne bloque que les cas les plus sûrs |
| Prévoir un montant | MAE ou RMSE | L'erreur s'exprime en euros |
| Score utilisé comme une probabilité | Calibration (courbe de fiabilité) | Un score de 0,2 doit correspondre à environ 20 % de cas positifs |

L'**accuracy** (part de bonnes réponses) est un mauvais guide quand la classe rare est celle qui compte. Prédire « personne ne résilie » donne **92 %** d'accuracy et **zéro** résiliant détecté.

La **précision** demande : parmi les alertes, combien sont justes ? Le **rappel** demande : parmi les vrais cas, combien ont été trouvés ? Le **F1** résume les deux. Il ne remplace pas un coût en euros quand vous le connaissez.

# Validation croisée

Avec peu de données, un seul découpage est bruyant. La **validation croisée** (souvent **5 plis**) entraîne cinq fois : à chaque fois, un pli sert de validation et les quatre autres d'entraînement. Vous retenez la moyenne et l'écart entre les plis.

Le test final, lui, ne participe à aucun pli. Il sert **une fois**, quand le modèle et ses réglages sont figés.

> [!TIP]
> Si les cinq plis donnent 0,71, 0,74, 0,69, 0,73 et 0,72, annoncez **0,72 ± 0,02**, pas le meilleur pli.

```video
url: https://www.youtube.com/watch?v=fSytzGwwBVw
title: "Machine Learning Fundamentals: Cross Validation"
channel: "StatQuest with Josh Starmer"
duration: "6:05"
lang: en
why: "La validation croisée en six minutes par StatQuest."
```

# Calibration, en une idée

Un modèle peut bien **ranger** les clients (les plus risqués en haut) et mal **chiffrer** le risque (il dit 0,8 alors que 0,4 partent vraiment). Si vous fixez un seuil du type « appeler au-dessus de 0,3 », le chiffre doit être une probabilité honnête. Sinon, recalez les scores sur la validation, ou décidez avec un rang (« le top 10 % ») plutôt qu'avec une probabilité.

# Exercices

## Exercice 1 : Où va cette ligne ?

Vous prédisez le défaut d'un prêt à partir de la demande. Pour chaque situation, dites si un tirage aléatoire stratifié convient, ou s'il faut un autre découpage.

1. Une seule ligne par demande, défauts à 6 %, pas de date d'effet dans la cible.
2. Vous devez estimer le défaut des demandes **du trimestre prochain**.
3. Un client peut déposer trois demandes dans le fichier.

<details>
<summary>Voir la solution</summary>

1. Tirage **stratifié** : la structure n'a ni temps ni répétition d'identité à protéger.
2. Découpage **temporel** : le test est le dernier trimestre disponible, l'entraînement ce qui précède.
3. Grouper par **client** : toutes les demandes d'une même personne restent ensemble.

</details>

## Exercice 2 : Choisir la métrique

Un service fraude examine **200** alertes par jour, pas une de plus. Chaque fraude manquée coûte cher, mais au-delà de 200 dossiers l'équipe ne lit plus rien. Quelle consigne donnez-vous au modèle ?

<details>
<summary>Voir la solution</summary>

Ranger les paiements par score décroissant et ne transmettre que le **top 200**. La métrique primaire est la précision (ou le montant de fraude) **dans ces 200 dossiers**, pas l'accuracy sur tout le flux. Un rappel global sans limite de file n'est pas actionnable.

</details>

## Exercice 3 : Le test entrouvert

Une collègue a lancé **14** essais. À chaque essai elle regardait le jeu de test et gardait le réglage qui y scorait le mieux. Le test finit à **0,81**. Que vaut ce 0,81 ?

<details>
<summary>Voir la solution</summary>

Il est **optimiste**. Le test a servi de validation déguisée. Il faut soit un nouveau jeu jamais consulté, soit geler les réglages d'après la seule validation et n'annoncer que la mesure obtenue ensuite, une fois.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Métriques et validation
center: Un score ne vaut que sur des cas que le modèle n'a pas utilisés pour se régler.
points:
  - icon: layers
    title: Trois jeux
    text: Entraînement pour apprendre, validation pour comparer, test pour une mesure finale.
  - icon: target
    title: Une métrique
    text: Choisissez-la avant l'essai, selon le coût des erreurs, pas selon le plus joli tableau.
  - icon: scale
    title: Classes rares
    text: L'accuracy flatte un modèle qui ignore la classe qui compte vraiment.
  - icon: loop
    title: Plis croisés
    text: Moyenne et écart sur la validation. Le test reste hors des plis.
  - icon: gauge
    title: Calibration
    text: Bien ranger ne veut pas dire annoncer une probabilité honnête.
pitfall: Consulter le test à chaque essai jusqu'à ce que le chiffre plaise.
remember: Figez la règle de décision avant de regarder le test, une seule fois.
```
