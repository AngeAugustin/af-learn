---
title: Détection d'anomalies
description: Repérer l'inhabituel par une règle, une distance ou un score, puis fixer un seuil selon le coût des fausses alertes.
duration: 60
objectives:
  - Distinguer une règle métier, un éloignement et un score d'isolation
  - Relier le seuil au nombre d'alertes que l'on peut traiter
  - Séparer une anomalie ponctuelle d'une dérive de fond
  - Éviter de laisser un modèle définir seul ce qui est « normal »
---

# Inhabituel ne veut pas dire frauduleux

Une **anomalie** est une ligne éloignée de ce que vous avez déclaré normal. Ce n'est pas, à elle seule, une fraude, une panne ou une erreur de saisie. Ce peut être un gros client légitime. Le travail est de produire une **file d'examen**, de la bonne taille, avec une raison lisible.

Trois familles suffisent pour commencer :

```diagram
type: compare
title: Trois façons de dire inhabituel
columns:
  - title: Règle métier
    tone: amber
    items:
      - Un montant au-delà d'un plafond connu
      - Lisible et auditable
      - Rate ce qui n'a pas été prévu
  - title: Distance
    tone: blue
    items:
      - Loin du centre ou des voisins
      - Demande une échelle commune
      - Sensible aux extrêmes déjà dans le centre
  - title: Isolation
    tone: teal
    items:
      - Un point isolé se sépare en peu de coupures
      - Peu de réglages
      - Le score n'est pas une probabilité de fraude
```

Une **forêt d'isolation** tire des seuils au hasard. Un point isolé est séparé du reste en peu de coups. Son score est élevé. Un point banal demande beaucoup de coupures. Vous n'avez toujours pas une probabilité. Vous avez un **rang**.

# Le seuil est une capacité

Si l'équipe lit **50** dossiers par jour, le seuil est « les 50 scores les plus hauts », pas « tout ce qui dépasse 0,6 » si cela envoie **2 000** lignes. Vous mesurez ensuite, sur un échantillon lu : combien d'alertes étaient réellement à traiter. C'est une précision de file, pas une accuracy sur tout le flux.

> [!TIP]
> Commencez par une règle que le métier sait justifier (montant, pays nouveau, heure). Ajoutez un score seulement là où la règle est aveugle. Gardez la règle dans le rapport : elle explique une partie des alertes sans modèle.

```video
url: https://www.youtube.com/watch?v=mhSFyXbCaPM
title: "Anomaly detection 101"
channel: "Anodot"
duration: "4:53"
lang: en
why: "Les bases de la détection d'anomalies en cinq minutes : anomalies ponctuelles, contextuelles et collectives."
```

# Ponctuel ou dérive

- **Ponctuel.** Un paiement à **40 000 €** un mardi, alors que le client paie **40 €**. On l'examine aujourd'hui.
- **Dérive.** Depuis trois semaines, **tous** les montants ont augmenté de **15 %** (inflation, changement de catalogue). Les scores sonnent en masse. Ce n'est pas une épidémie d'anomalies. C'est une normale qui a bougé. Le chapitre sur le suivi des modèles y revient : on compare à une référence datée, on ne laisse pas le score crier.

> [!WARNING]
> Entraîner le détecteur sur un fichier qui contient déjà les fraudes connues, sans les retirer ni les marquer, apprend « la fraude est normale » si elle est assez fréquente, ou fabrique un cercle vicieux autour des vieux cas.

# Ce que vous montrez

Pour chaque alerte : le score ou la règle, **deux ou trois variables** qui l'éloignent (montant ×8, pays jamais vu), et le volume de la file. Sans ces variables, l'analyste ne peut pas trancher et le modèle devient une boîte noire que l'on finit par ignorer.

# Exercices

## Exercice 1 : Règle ou score ?

Cas 1 : bloquer tout virement au-dessus de 20 000 € vers un nouveau bénéficiaire, politique déjà votée. Cas 2 : repérer des paniers dont la combinaison de produits est rare, sans seuil écrit. Que mettez-vous en face de chaque cas ?

<details>
<summary>Voir la solution</summary>

Cas 1 : une **règle**, auditable, déjà décidée. Cas 2 : un **score** de rareté ou d'isolation, parce qu'aucune règle n'énumère les combinaisons. Le score alimente une file, il ne condamne pas.

</details>

## Exercice 2 : File de 2 000

Le seuil 0,6 produit 2 000 alertes par jour. L'équipe en lit 50. Que changez-vous ?

<details>
<summary>Voir la solution</summary>

Vous ne baissez pas le seuil. Vous transmettez les **50** rangs les plus élevés, puis vous mesurez combien étaient vraiment à traiter. Un seuil absolu qui noie la file ne sera pas lu, donc ne détectera rien.

</details>

## Exercice 3 : Tout sonne depuis trois semaines

Les alertes ont été multipliées par quatre, mais les montants moyens ont tous monté après un changement de catalogue. Anomalie ponctuelle ou dérive ?

<details>
<summary>Voir la solution</summary>

**Dérive** de la normale. Il faut dater la référence (avant ou après le catalogue) et revoir le détecteur ou les règles de montant. Traiter chaque ticket comme une fraude isolée épuise l'équipe et rate le vrai changement.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Détection d'anomalies
center: Un score d'anomalie ordonne une file d'examen. Il ne déclare pas une fraude.
points:
  - icon: filter
    title: Trois familles
    text: Règle lisible, distance, ou isolation. Le score n'est pas une probabilité.
  - icon: gauge
    title: Taille de file
    text: Le seuil suit le nombre de dossiers lus, pas un 0,6 abstrait.
  - icon: search
    title: Raison
    text: Montrez les variables qui éloignent la ligne, sinon personne ne tranche.
  - icon: alert
    title: Dérive
    text: Si tout sonne, la normale a bougé. Ce n'est pas une pluie de cas isolés.
  - icon: check
    title: Règle d'abord
    text: Ce que le métier sait déjà justifier n'a pas besoin d'un modèle.
pitfall: Entraîner le détecteur sur des fraudes déjà banales au point de les trouver normales.
remember: Inhabituel signifie à examiner. La décision reste humaine et chiffrée.
```
