---
title: Apprendre à partir des données
description: "Les concepts fondamentaux du machine learning : types d'apprentissage, découpage des données, surapprentissage et métriques d'évaluation."
duration: 55
objectives:
  - Distinguer apprentissage supervisé, non supervisé et auto-supervisé
  - Expliquer le rôle des jeux d'entraînement, de validation et de test
  - Reconnaître le surapprentissage et le sous-apprentissage
  - Calculer et interpréter précision, rappel, F1 et exactitude
---

# Qu'est-ce que le machine learning ?

En programmation classique, on écrit des **règles** : « si le courriel contient tel mot, alors c'est un spam ». En **machine learning** (apprentissage automatique), on fournit des **exemples** et un algorithme **apprend** lui-même une fonction qui relie les entrées aux sorties.

```diagram
type: compare
title: Programmation classique et machine learning
columns:
  - title: Programmation classique
    tone: blue
    items:
      - "Entrées : données + règles écrites à la main"
      - "Sortie : des réponses"
      - Fragile dès que les cas se multiplient
  - title: Machine learning
    tone: violet
    items:
      - "Entrées : données + réponses attendues (exemples)"
      - "Sortie : un modèle qui a appris les règles"
      - Généralise à de nouveaux cas, avec une marge d'erreur
```

Un **modèle** est une fonction mathématique avec des **paramètres** (des nombres). **Entraîner** le modèle consiste à ajuster ces paramètres pour que ses prédictions se rapprochent des réponses attendues sur les exemples. Un LLM moderne est exactement cela, à une échelle immense : une fonction dont les milliards de paramètres ont été ajustés sur d'énormes quantités de texte.

## Les grands types d'apprentissage

| Type | Données | Exemple |
|---|---|---|
| **Supervisé** | Exemples avec étiquettes (entrée → réponse attendue) | Prédire si un courriel est un spam à partir de courriels étiquetés |
| **Non supervisé** | Données sans étiquettes | Regrouper des clients en segments similaires (*clustering*) |
| **Auto-supervisé** | L'étiquette est extraite des données elles-mêmes | Prédire le mot suivant d'un texte : c'est ainsi que les LLM sont pré-entraînés |
| **Par renforcement** | Un agent agit et reçoit des récompenses | Jeux, robotique, et une partie de l'alignement des LLM (module 3) |

Dans l'apprentissage supervisé, on distingue :

- la **classification** : prédire une catégorie (spam / non spam, sentiment positif / négatif) ;
- la **régression** : prédire une valeur numérique (prix d'un logement, durée d'un trajet).

> [!NOTE]
> L'apprentissage **auto-supervisé** est la clé du succès des LLM : nul besoin d'annoter à la main des milliards de textes, puisque chaque texte fournit lui-même la réponse attendue (le mot suivant).

# Entraînement, validation et test

Un modèle n'a d'intérêt que s'il fonctionne sur des données **qu'il n'a jamais vues**. C'est ce qu'on appelle la **généralisation**. Pour la mesurer honnêtement, on découpe les données en trois ensembles :

```diagram
type: stack
title: Découpage typique d'un jeu de données
segments:
  - label: Entraînement
    value: 70
    tone: violet
    text: Ajuster les paramètres
  - label: Validation
    value: 15
    tone: amber
    text: Comparer les réglages
  - label: Test
    value: 15
    tone: teal
    text: Mesure finale, une seule fois
```

- **Entraînement** : le modèle apprend sur ces exemples.
- **Validation** : on compare différents réglages (hyperparamètres, architectures) et on choisit le meilleur.
- **Test** : on mesure la performance **finale**, une seule fois, à la fin. Si l'on modifie le modèle en regardant les résultats sur le test, celui-ci n'est plus une mesure honnête.

Les proportions 70/15/15 ou 80/10/10 sont des ordres de grandeur courants, pas des règles absolues.

> [!WARNING]
> **Fuite de données** (*data leakage*) : si des exemples du jeu de test se retrouvent dans l'entraînement, ou si une information indisponible au moment de la prédiction réelle est utilisée, les scores sont artificiellement bons. Ce problème existe aussi avec les LLM : un modèle peut avoir vu les questions d'un benchmark public pendant son pré-entraînement, ce qui gonfle ses résultats. C'est l'une des raisons pour lesquelles **vos propres évaluations**, sur vos données, sont indispensables.

# Surapprentissage et sous-apprentissage

- **Sous-apprentissage** (*underfitting*) : le modèle est trop simple et rate même les exemples d'entraînement.
- **Surapprentissage** (*overfitting*) : le modèle « apprend par cœur » les exemples d'entraînement, y compris leur bruit, et généralise mal.

On les repère en suivant l'erreur (la **perte**, *loss*) sur l'entraînement et sur la validation au fil de l'entraînement :

```diagram
type: custom
name: overfitting-curves
caption: La perte d'entraînement continue de baisser, mais la perte de validation remonte, c'est le signe du surapprentissage. On retient le modèle au point où la perte de validation est minimale.
```

Remèdes courants contre le surapprentissage :

- **plus de données**, ou des données plus variées ;
- un modèle **plus simple** ou une **régularisation** (pénaliser les paramètres trop grands, *dropout*) ;
- l'**arrêt précoce** (*early stopping*) : arrêter l'entraînement quand la perte de validation remonte.

Ces notions reviendront au module 11 : un fine-tuning sur trop peu d'exemples, ou trop longtemps, conduit typiquement au surapprentissage.

# Mesurer la performance d'un classifieur

Prenons un détecteur de spam testé sur 1 000 courriels, dont 100 spams. On range les prédictions dans une **matrice de confusion** :

| | Prédit spam | Prédit non spam |
|---|---|---|
| **Vraiment spam** | 80 (vrais positifs, VP) | 20 (faux négatifs, FN) |
| **Vraiment non spam** | 40 (faux positifs, FP) | 860 (vrais négatifs, VN) |

À partir de là :

- **Exactitude** (*accuracy*) = (VP + VN) / total = (80 + 860) / 1000 = **94 %**.
- **Précision** = VP / (VP + FP) = 80 / 120 ≈ **66,7 %** : parmi les courriels signalés comme spam, combien en sont vraiment.
- **Rappel** (*recall*) = VP / (VP + FN) = 80 / 100 = **80 %** : parmi les vrais spams, combien ont été détectés.
- **F1** = 2 × précision × rappel / (précision + rappel) ≈ **72,7 %** : moyenne harmonique des deux.

> [!IMPORTANT]
> L'exactitude est **trompeuse quand les classes sont déséquilibrées**. Un modèle qui répond toujours « non spam » obtiendrait ici 90 % d'exactitude… tout en ne détectant aucun spam (rappel nul). Regardez toujours la précision et le rappel.

## Choisir entre précision et rappel

Le bon compromis dépend du **coût des erreurs** :

- Un filtre antispam doit éviter de jeter un courriel important : on privilégie la **précision** (peu de faux positifs).
- Un dépistage médical préliminaire doit éviter de rater un malade : on privilégie le **rappel** (peu de faux négatifs).

Ces métriques s'appliquent directement à de nombreuses tâches confiées aux LLM : classification de tickets, détection de contenus à modérer, extraction d'informations. Vous les réutiliserez au module 8 pour évaluer vos systèmes.

# Exercices

## Exercice 1 : Choisir le type d'apprentissage

Pour chaque problème, indiquez s'il s'agit de classification, de régression ou de clustering :

1. Estimer le temps de résolution d'un ticket en heures.
2. Déterminer si une transaction est frauduleuse.
3. Regrouper des articles de blog par thèmes, sans thèmes définis à l'avance.

<details>
<summary>Voir la solution</summary>

1. **Régression** : la sortie est une valeur numérique continue.
2. **Classification** binaire : frauduleuse ou non.
3. **Clustering** (non supervisé) : aucune étiquette n'est fournie.

</details>

## Exercice 2 : Calculer des métriques

Un classifieur de tickets « urgents » est testé sur 200 tickets dont 40 sont réellement urgents. Il signale 50 tickets comme urgents, dont 30 le sont vraiment. Calculez la précision, le rappel, le F1 et l'exactitude.

<details>
<summary>Voir la solution</summary>

- VP = 30, FP = 50 − 30 = 20, FN = 40 − 30 = 10, VN = 200 − 30 − 20 − 10 = 140.
- Précision = 30 / 50 = **60 %**.
- Rappel = 30 / 40 = **75 %**.
- F1 = 2 × 0,6 × 0,75 / (0,6 + 0,75) = 0,9 / 1,35 ≈ **66,7 %**.
- Exactitude = (30 + 140) / 200 = **85 %**.

</details>

## Exercice 3 : Diagnostiquer un entraînement

Après 20 époques, la perte d'entraînement vaut 0,05 et la perte de validation 0,90. À l'époque 8, elles valaient respectivement 0,30 et 0,35. Que se passe-t-il, et que recommandez-vous ?

<details>
<summary>Voir la solution</summary>

Le modèle **surapprend** : il s'améliore sur l'entraînement mais se dégrade fortement sur la validation après l'époque 8 environ. Recommandations : retenir le modèle autour de l'époque où la perte de validation était minimale (arrêt précoce), ajouter de la régularisation, ou enrichir les données d'entraînement.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Apprendre à partir des données
center: Un modèle apprend une fonction à partir d'exemples ; seule la généralisation compte.
points:
  - icon: book
    title: Les types d'apprentissage
    text: Supervisé, non supervisé, auto-supervisé (les LLM) et par renforcement.
  - icon: layers
    title: Trois jeux de données
    text: Entraînement pour apprendre, validation pour choisir, test pour mesurer une seule fois.
  - icon: chart
    title: Le surapprentissage
    text: La perte d'entraînement baisse mais celle de validation remonte → arrêt précoce.
  - icon: target
    title: Précision et rappel
    text: Précision = VP / (VP + FP) ; rappel = VP / (VP + FN) ; le F1 les combine.
  - icon: scale
    title: Choisir selon le coût de l'erreur
    text: Éviter les fausses alertes → précision ; ne rien rater → rappel.
pitfall: "Se fier à l'exactitude quand les classes sont déséquilibrées : un modèle trivial peut afficher 90 %."
remember: Un bon score n'a de valeur que mesuré sur des données que le modèle n'a jamais vues.
```
