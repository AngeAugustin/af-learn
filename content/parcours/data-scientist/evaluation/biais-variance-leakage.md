---
title: Biais, variance et fuite de données
description: Reconnaître un modèle trop simple, un modèle qui récite, et une information qui n'existera pas le jour de la décision.
duration: 65
objectives:
  - Distinguer sous-apprentissage et sur-apprentissage
  - Repérer une fuite de la cible, du futur ou du prétraitement
  - Appliquer une liste de contrôles avant de croire un score
  - Relier l'écart train/validation à une action concrète
---

# Deux façons de se tromper

L'erreur d'un modèle se lit en comparant l'entraînement et la validation.

- **Sous-apprentissage (biais élevé).** Le modèle est trop simple pour le signal. Il se trompe déjà sur l'entraînement, et autant sur la validation. Une droite ne suivra pas un U.
- **Sur-apprentissage (variance élevée).** Il colle aux exemples, y compris au bruit. L'entraînement est excellent, la validation décroche.

```diagram
type: compare
title: Lire l'écart entre les deux scores
columns:
  - title: Sous-apprentissage
    tone: amber
    items:
      - Erreur haute des deux côtés
      - Le modèle est trop pauvre
      - Enrichir les variables ou changer de famille
  - title: Sur-apprentissage
    tone: rose
    items:
      - Entraînement très bon, validation mauvaise
      - Le modèle récite le bruit
      - Simplifier, régulariser, ou ajouter des données
  - title: Fuite
    tone: violet
    items:
      - Validation trop belle pour être honnête
      - Une info du futur ou de la cible est dans les X
      - Retirer la variable et refaire le découpage
```

Un écart train **0,95** / validation **0,62** sent le sur-apprentissage. Un couple **0,60 / 0,59** sent un modèle trop faible, ou un signal pauvre. Un **0,99 / 0,99** sur un problème difficile sent la fuite : le modèle a vu la réponse.

```video
url: https://www.youtube.com/watch?v=EuBBz3bI-aA
title: "Machine Learning Fundamentals: Bias and Variance"
channel: "StatQuest with Josh Starmer"
duration: "6:36"
lang: en
why: "Le compromis biais-variance illustré simplement par StatQuest."
```

# La fuite, c'est une information interdite

Au moment de la décision, certaines colonnes n'existent pas encore. Les utiliser à l'entraînement fabrique un score de laboratoire.

Cas classiques :

1. **La cible déguisée.** Prédire le défaut, avec une colonne « montant déjà en recouvrement ».
2. **Le futur.** Prédire la vente de la semaine, avec le stock compté **après** les ventes de cette semaine.
3. **L'identité.** Un identifiant client que l'arbre transforme en règle « ce numéro-là a déjà résilié ».
4. **Le prétraitement global.** Calculer une moyenne ou un encodage de cible sur **tout** le fichier, puis découper. La validation a contribué aux chiffres que le modèle utilise.
5. **Les doublons.** La même ligne en entraînement et en validation après un export mal joint.

> [!WARNING]
> Imputer, normaliser ou encoder la cible **avant** le `train_test_split` fait fuir la validation dans l'entraînement. Ces étapes vivent dans un pipeline ajusté sur le train seul.

# Liste courte avant de croire un score

- La cible est-elle calculée **uniquement** avec ce qui sera connu à l'instant T ?
- Une colonne est-elle un synonyme de la cible (statut, motif, date de l'événement) ?
- Le découpage respecte-t-il le temps et les groupes ?
- Moyennes, médianes, vocabulaire et encodages sont-ils appris **dans** le pipeline, sur le train du pli ?
- Le score s'effondre-t-il si vous retirez la variable « trop belle » ?
- Une baseline naïve (moyenne, classe majoritaire, valeur de la veille) est-elle battue de peu, ou d'un écart absurde ?

Si retirer une colonne fait tomber le score de **0,97** à **0,71**, cette colonne portait la réponse. Ce n'est pas une feature ingénieuse, c'est une fuite, jusqu'à preuve du contraire.

# Que faire selon le diagnostic

| Diagnostic | Action |
|---|---|
| Sous-apprentissage | Variables plus parlantes, modèle un peu plus souple, vérifier que le signal existe |
| Sur-apprentissage | Moins de profondeur, régularisation, plus de données, revoir les variables rares |
| Fuite | Supprimer la colonne, refaire split puis pipeline, réécrire la définition de la cible |
| Écart faible et erreur encore chère | Le problème n'est peut-être pas le modèle. Revoir la cible ou les données |

> [!NOTE]
> Ajouter des arbres plus profonds ne répare pas une fuite. Cela la mémorise mieux.

# Un exemple chiffré

Vous prédisez les ruptures de stock. Une colonne `jours_avant_reapprovisionnement` est remplie **après** la rupture, par la logistique. Le modèle atteint un rappel de **0,94**. Le jour où vous l'appelez le matin, cette colonne est vide pour les rayons encore pleins, et le rappel tombe à **0,41**. La colonne n'était pas un prédicteur. C'était le compte-rendu de l'événement.

# Exercices

## Exercice 1 : Nommer le symptôme

Pour chaque paire (score train, score validation), donnez le diagnostic le plus probable : sous-apprentissage, sur-apprentissage, ou fuite à investiguer.

1. 0,58 et 0,57 sur un problème où une règle métier simple atteint déjà 0,55.
2. 0,99 et 0,64.
3. 0,98 et 0,97 alors que la cible est un événement rare et bruité.

<details>
<summary>Voir la solution</summary>

1. **Sous-apprentissage** ou signal faible : les deux scores sont proches et à peine au-dessus de la règle.
2. **Sur-apprentissage** : l'entraînement est mémorisé, la validation non.
3. **Fuite à investiguer** : un événement rare et bruité ne se devine pas à 0,97 des deux côtés sans information interdite.

</details>

## Exercice 2 : Colonne interdite

Vous prédisez « le colis sera en retard » au moment de l'expédition. Parmi ces colonnes, lesquelles sont interdites à cet instant ?

1. Poids annoncé par l'entrepôt.
2. Heure réelle de livraison.
3. Motif de retard saisi par le livreur.
4. Département de destination.

<details>
<summary>Voir la solution</summary>

**2 et 3** sont interdites : elles n'existent qu'une fois l'événement passé. Le poids annoncé et le département sont connus à l'expédition, donc licites, même s'ils peuvent être de mauvais prédicteurs.

</details>

## Exercice 3 : Où placer l'imputation ?

Un notebook remplace les valeurs manquantes par la médiane du fichier complet, puis appelle `train_test_split`, puis entraîne une régression. Quelle est l'erreur, et quel est l'ordre correct ?

<details>
<summary>Voir la solution</summary>

La médiane a vu la validation : petite fuite de prétraitement. L'ordre correct est : découper d'abord, puis ajuster l'imputation **sur le train seulement** (idéalement dans un `Pipeline`), puis appliquer cette médiane au test sans la recalculer.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Biais, variance, fuite
center: Un beau score est suspect tant que vous n'avez pas prouvé que la réponse n'était pas dans les colonnes.
points:
  - icon: scale
    title: Deux erreurs
    text: Trop simple des deux côtés, ou excellent à l'entraînement et faible en validation.
  - icon: alert
    title: Fuite
    text: Cible déguisée, futur, identifiant ou statistique calculée avant le découpage.
  - icon: filter
    title: Pipeline
    text: Imputer et encoder dans le pipeline, ajusté sur le train du pli seulement.
  - icon: search
    title: Test de retrait
    text: Si une colonne fait chuter le score en disparaissant, elle portait peut-être la réponse.
  - icon: check
    title: Baseline
    text: Un écart absurde avec une règle naïve appelle une enquête, pas une mise en production.
pitfall: Approfondir le modèle pour mémoriser une colonne qui décrit déjà l'événement.
remember: Au moment de la décision, la colonne doit déjà exister. Sinon ce n'est pas une feature.
```
