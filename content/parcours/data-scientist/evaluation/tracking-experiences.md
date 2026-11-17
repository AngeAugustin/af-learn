---
title: Suivre les expériences
description: Noter ce qui rend une expérience reproductible, et comparer honnêtement un modèle à sa baseline.
duration: 55
objectives:
  - Lister ce qu'une expérience doit enregistrer pour être relancée
  - Comparer des essais à une baseline figée
  - Éviter de garder le meilleur score de test par chance
  - Choisir un tableau simple ou un outil de suivi selon l'équipe
---

# Une expérience que vous ne pouvez pas relancer n'a pas eu lieu

Deux semaines plus tard, personne ne sait plus quel fichier, quel seed ni quel seuil ont produit le **0,74**. Le chiffre est inutilisable. Un suivi d'expérience sert à pouvoir répondre : **quelles données, quel code, quels réglages, quelle métrique, sur quel découpage**.

Le minimum à noter, même dans un tableau :

| Champ | Exemple |
|---|---|
| Identifiant | exp-014 |
| Données | churn_2024_extract, hash ou date d'export |
| Découpage | temporel, test = mars 2025, seed 7 |
| Code | commit `a1b2c3` |
| Modèle | gradient boosting, profondeur 4, 300 arbres |
| Métrique primaire | rappel à précision ≥ 0,30, sur la validation |
| Résultat | 0,61 ± 0,03 |
| Baseline | règle « inactif 45 jours » : 0,44 |

```diagram
type: flow
title: Ce que l'on fige avant de comparer
steps:
  - title: Baseline
    text: Une règle simple, notée une fois
    tone: amber
  - title: Protocole
    text: Même découpage, même métrique
    tone: blue
  - title: Essais
    text: Un identifiant par réglage
    tone: teal
  - title: Décision
    text: On ne garde pas le coup de chance
    tone: violet
```

# Baseline d'abord

La baseline est l'essai **000**. Sans elle, un modèle à **0,61** n'a pas de sens : la règle métier faisait peut-être **0,58**. Vous la figez (classe majoritaire, moyenne, valeur de la veille, règle déjà en production) et vous ne la « réparez » pas après avoir vu les modèles.

# Ne pas élire le hasard

Si vous lancez **30** réglages et que vous publiez le meilleur score de **test**, vous avez optimisé le test. Le suivi correct est :

1. choisir le candidat sur la **validation** (moyenne des plis) ;
2. n'envoyer au test que ce candidat, et éventuellement la baseline ;
3. si l'écart à la baseline est plus petit que la variation entre plis, dire « pas de gain démontré ».

> [!WARNING]
> Garder l'essai dont le test est le plus joli parmi trente, c'est une sélection déguisée. Le suivi doit montrer les essais écartés, pas seulement le vainqueur.

```video
url: https://www.youtube.com/watch?v=RnYa3QsXRAc
title: "MLFlow Tutorial Part 1: Experiment Tracking"
channel: "Anton T. Ruberts"
duration: "27:03"
lang: en
why: "Un tutoriel MLflow consacré au suivi d'expériences : paramètres, métriques et artefacts enregistrés à chaque essai."
```

# Tableau ou outil

Un fichier d'expériences suffit à une personne. Dès que deux personnes comparent des modèles, un registre (MLflow ou équivalent) évite les copies divergentes : paramètres, métrique, fichier de données, commit. L'outil ne choisit pas à votre place. Il empêche d'égarer le contexte.

Ce que vous n'enregistrez pas : les données personnelles brutes dans le registre, ni un score sans dire **sur quel jeu** il a été calculé.

> [!TIP]
> Nommez la métrique dans la colonne, pas seulement « score ». Un 0,74 de rappel n'est pas un 0,74 d'accuracy.

# Lire une comparaison

| Essai | Validation | Commentaire |
|---|---|---|
| Baseline, inactif 45 j | 0,44 | Règle actuelle du marketing |
| Régression logistique | 0,53 ± 0,02 | Gain net, modèle simple |
| Boosting profond | 0,54 ± 0,04 | Gain dans le bruit, plus fragile |

Ici, la logistique est le choix honnête : le boosting ne la dépasse pas au-delà de sa propre instabilité. Le rapport dit cela, il ne dit pas « le boosting a fait 0,58 sur un pli ».

# Exercices

## Exercice 1 : Fiche incomplète

On vous transmet : « XGBoost, 0,81, c'était mieux ». Quelles quatre questions posez-vous avant d'en tenir compte ?

<details>
<summary>Voir la solution</summary>

1. **0,81 de quoi** (rappel, précision, accuracy) ? 2. Sur **validation ou test**, et avec quel découpage ? 3. Quel **fichier** et quel **commit** ? 4. Quelle **baseline** sur le même protocole ? Sans ces réponses, le chiffre ne se compare pas.

</details>

## Exercice 2 : Trente essais

Vous avez lancé 30 forêts. La meilleure atteint 0,70 en test, la médiane des validations est 0,62, la baseline est à 0,60 en validation. Que publiez-vous ?

<details>
<summary>Voir la solution</summary>

Vous ne publiez pas 0,70. Vous choisissez le réglage d'après la **validation**, vous le mesurez **une fois** sur le test, et vous le comparez à la baseline sur le même protocole. Un maximum parmi 30 tests est un biais de sélection.

</details>

## Exercice 3 : Deux modèles

La logistique fait 0,53 ± 0,02, le boosting 0,54 ± 0,04, la baseline 0,44. Le boosting est plus lent à expliquer. Lequel retenez-vous, et pourquoi ?

<details>
<summary>Voir la solution</summary>

La **logistique**. Elle bat nettement la baseline. Le boosting n'ajoute qu'un point, inférieur à sa variation entre plis, pour plus de fragilité et moins d'explication. Le suivi sert précisément à refuser ce faux progrès.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Suivre les expériences
center: Un score sans données, sans code et sans baseline ne se relance pas et ne se compare pas.
points:
  - icon: file
    title: Le minimum
    text: Données, découpage, commit, réglages, métrique nommée, résultat, baseline.
  - icon: ruler
    title: Baseline figée
    text: L'essai zéro est une règle simple. On ne la réécrit pas après les modèles.
  - icon: alert
    title: Pas le maximum
    text: Choisir sur la validation. Le test ne départage pas trente essais.
  - icon: scale
    title: L'écart compte
    text: Un gain plus petit que la variation entre plis n'est pas un progrès.
  - icon: tool
    title: L'outil
    text: Un tableau suffit seul. Un registre évite les copies dès qu'on est deux.
pitfall: Archiver seulement le vainqueur et le plus beau chiffre de test.
remember: Notez de quoi le score est fait, sur quel jeu, face à quelle règle simple.
```
