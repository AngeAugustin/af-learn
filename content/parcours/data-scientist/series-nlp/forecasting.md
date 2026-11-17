---
title: Prévoir une série
description: Battre une baseline naïve ou saisonnière avant d'ajouter un modèle, et annoncer un horizon avec une erreur honnête.
duration: 60
objectives:
  - Construire une prévision naïve et une prévision saisonnière
  - Choisir un horizon aligné sur la décision
  - Lire une erreur en unités métier, avec prudence sur le MAPE
  - Savoir quand des retards dans un modèle tabulaire suffisent
---

# Sans baseline, le modèle n'a pas d'adversaire

Avant un algorithme, deux prévisions toutes simples :

- **Naïve.** Demain vaudra aujourd'hui. Pour un stock stable, c'est souvent dur à battre.
- **Saisonnière.** Demain vaudra le même jour de la semaine dernière, ou ce mois vaudra le même mois l'an dernier.

Vous notez leur erreur **sur le même horizon** que le modèle. Si le boosting gagne **2 %** et met une heure à s'expliquer, vous gardez la saisonnière.

```diagram
type: decision
title: Faut-il un modèle au-delà de la baseline ?
nodes:
  - question: La saisonnière est-elle déjà assez juste pour la décision ?
    yes: On la garde et on documente son erreur
    no: On teste un modèle sur le même horizon
```

# Horizon

Prévoir **1 jour** et prévoir **90 jours** n'est pas le même problème. L'erreur grossit avec l'horizon. Vous fixez l'horizon dont le métier a besoin (commander à J+7, pas à J+90 « tant qu'à faire »), et vous n'annoncez pas l'erreur de J+1 comme si elle valait pour le trimestre.

Un modèle qui utilise les **lags** (valeurs passées : hier, J-7, J-14) dans une régression ou un boosting est souvent suffisant sur du tabulaire. Vous n'avez pas besoin d'un réseau spécialisé pour une série courte et une saison nette.

```video
url: https://www.youtube.com/watch?v=GE3JOFwTWVM
title: "What is Time Series Analysis?"
channel: "IBM Technology"
duration: "7:29"
lang: en
why: "IBM Technology présente l'analyse de séries temporelles : tendance, saisonnalité et prévision."
```

# Mesurer l'erreur

| Mesure | Lecture | Limite |
|---|---|---|
| MAE | Erreur moyenne en unités (bouteilles, euros) | Traite de la même façon un petit et un gros magasin |
| RMSE | Pénalise plus les gros écarts | Moins parlante en réunion |
| MAPE | Erreur en % | Explose ou devient absurde quand la vérité vaut **0** ou presque |

Un jour à **0 vente**, le MAPE se divise par zéro. Un jour à **2** ventes avec une prévision de **4** affiche **100 %** et pèse autant qu'un magasin à **2 000** ventes. Préférez le MAE, ou un MAPE calculé seulement au-dessus d'un plancher, et dites-le.

> [!WARNING]
> Moyenner des MAPE de magasins minuscules fait croire à un désastre alors que le volume, lui, est bien prévu. Pondérez par le volume, ou restez en unités.

# Intervalle

Une prévision ponctuelle (« 120 pièces ») est incomplète. Vous annoncez une fourchette apprise sur les erreurs passées du même horizon (« entre 100 et 145 dans 80 % des semaines semblables »). Si la fourchette est plus large que la marge de manœuvre logistique, le chiffre central ne sert pas à commander. Il sert à dire que l'on ne sait pas.

> [!TIP]
> Recalculez la baseline à chaque nouveau point. Une naïve « aujourd'hui = hier » se met à jour sans réentraînement. Un modèle figé depuis six mois peut perdre face à elle après un choc.

# Exercices

## Exercice 1 : L'adversaire

Sur les 8 dernières semaines, la naïve (aujourd'hui = hier) a un MAE de 18 unités, la saisonnière (même jour, semaine précédente) un MAE de 11, le boosting un MAE de 10,5. Que retenez-vous pour une commande hebdomadaire ?

<details>
<summary>Voir la solution</summary>

La **saisonnière**. Le boosting ne gagne qu'une demi-unité, dans le bruit, pour beaucoup plus de complexité. On documente les trois MAE sur le même horizon.

</details>

## Exercice 2 : MAPE piégé

Lundi : vérité 0, prévision 3. Mardi : vérité 2 000, prévision 1 900. Pourquoi un MAPE moyen de ces deux jours est-il un mauvais résumé ?

<details>
<summary>Voir la solution</summary>

Lundi n'a pas de MAPE défini (division par zéro), ou un pourcentage énorme si l'on trafique le zéro. Mardi est une erreur de **5 %** sur l'essentiel du volume. Le résumé utile est en **unités** (MAE), éventuellement pondéré par le volume.

</details>

## Exercice 3 : Mauvais horizon

Le modèle annonce un MAE de 4 unités à J+1. L'acheteur commande à J+21. Peut-il utiliser ce 4 ?

<details>
<summary>Voir la solution</summary>

Non. L'erreur à **21 jours** est une autre mesure, en général plus grande. Il faut l'erreur calculée sur l'horizon de la commande, avec une fourchette. Le MAE de J+1 flatte la décision lointaine.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Prévoir une série
center: Un modèle ne vaut que s'il bat, sur le même horizon, une copie d'hier ou de la saison.
points:
  - icon: clock
    title: Deux baselines
    text: Demain égale aujourd'hui, ou demain égale le même jour de la saison passée.
  - icon: target
    title: Horizon
    text: L'erreur de J+1 ne décrit pas une commande à J+21.
  - icon: gauge
    title: MAE d'abord
    text: L'erreur en unités résiste aux jours à zéro, contrairement au MAPE.
  - icon: chart
    title: Fourchette
    text: Un chiffre seul est incomplet. Annoncez une plage apprise sur les erreurs passées.
  - icon: tool
    title: Lags
    text: Des valeurs passées dans un modèle tabulaire suffisent souvent.
pitfall: Publier le MAPE moyen de magasins minuscules et de jours à zéro.
remember: Si la saisonnière fait aussi bien, elle reste la prévision de production.
```
