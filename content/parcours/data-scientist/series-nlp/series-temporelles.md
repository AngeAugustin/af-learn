---
title: Séries temporelles
description: Lire une série comme une tendance, une saison et un bruit, et couper le temps dans le bon sens.
duration: 60
objectives:
  - Décomposer une série en tendance, saisonnalité et résidu
  - Interdire le mélange aléatoire quand on prévoit le futur
  - Repérer une fuite qui utilise une valeur encore inconnue
  - Choisir la granularité (jour, semaine) selon la décision
---

# Une ligne n'est pas indépendante de la veille

Une série est une mesure **ordonnée** : ventes par jour, appels par heure, température par mois. La valeur de mardi ressemble à celle de lundi. Si vous mélangez les lignes comme pour un fichier clients, vous mettez **mercredi dans l'entraînement et mardi dans le test**. Le modèle a vu le futur.

```diagram
type: flow
title: Découpage temporel
steps:
  - title: Passé
    text: Entraînement, uniquement ce qui précède
    tone: blue
  - title: Frontière
    text: Le jour de la décision
    tone: amber
  - title: Futur proche
    text: Test, la période que l'on prétendait prévoir
    tone: teal
```

Exemple : données de janvier 2023 à mars 2025. Vous voulez le mois prochain. L'entraînement s'arrête fin février 2025, le test est mars 2025. On ne pioche pas des jours de mars au hasard.

# Trois morceaux

- **Tendance.** Le mouvement lent : les ventes montent de **8 %** par an.
- **Saisonnalité.** Le motif qui revient : chaque lundi est creux, chaque décembre est fort.
- **Résidu.** Ce qui reste, irrégulier, parfois une grève ou une rupture.

Regarder la série brute sans cette lecture mène à « expliquer » décembre par une promotion qui a lieu tous les ans. Vous comparez décembre à **décembre dernier**, pas à novembre.

> [!NOTE]
> Une moyenne mobile sur 7 jours montre la tendance courte et gomme le bruit d'un mardi férié. Elle ne prévoit pas. Elle aide à voir.

```video
url: https://www.youtube.com/watch?v=GE3JOFwTWVM
title: "What is Time Series Analysis?"
channel: "IBM Technology"
duration: "7:29"
lang: en
why: "Les composantes d'une série temporelle (tendance, saisonnalité, bruit) présentées simplement."
```

# Fuites propres au temps

| Colonne | Licite pour prévoir demain ? |
|---|---|
| Ventes d'hier | Oui, elles sont déjà connues |
| Ventes de demain | Non, c'est la cible |
| Moyenne des 7 prochains jours | Non, elle contient le futur |
| Stock compté ce soir, après les ventes du jour | Non, si la décision est le matin |
| Jour de la semaine, mois | Oui |

Le piège fréquent est le **fenêtrage mal bordé** : un `rolling(7).mean()` calculé sur toute la série, qui à la date J inclut J+1, J+2, J+3. La validation devient brillante et la production, aveugle.

# Granularité

Prédire l'heure alors que la décision est hebdomadaire ajoute du bruit. Prédire l'année alors qu'il faut commander pour lundi est inutile. Vous alignez le pas de la série sur le pas de la décision, et vous agrégerez **avant** de modéliser (somme des ventes du jour, pas la moyenne de moyennes).

> [!WARNING]
> Plusieurs séries (un magasin par ligne) ne se mélangent pas non plus au hasard si les magasins partagent un choc le même jour. Un test « derniers 14 jours, tous magasins » est plus honnête qu'un magasin entier tiré dans le futur des autres.

# Exercices

## Exercice 1 : Où est la frontière ?

Vous prévoyez les ventes de la semaine du 7 avril. Les données vont jusqu'au 6 avril inclus. Quelles semaines peuvent servir à l'entraînement ?

<details>
<summary>Voir la solution</summary>

Toutes celles **strictement avant** le 7 avril. La semaine du 7 avril est le test, ou le futur à prévoir. Aucun jour de cette semaine ne retourne dans l'entraînement, même « pour équilibrer ».

</details>

## Exercice 2 : Colonne interdite

Pour décider le matin du stock à commander, quelles colonnes sont interdites ?

1. Ventes d'hier.
2. Ventes du jour, comptées le soir.
3. Jour de la semaine.
4. Moyenne mobile incluant les trois jours suivants.

<details>
<summary>Voir la solution</summary>

**2 et 4.** Les ventes du soir n'existent pas le matin. Une moyenne qui avance dans le futur fuit. Hier et le jour de la semaine sont connus.

</details>

## Exercice 3 : Décembre

Les ventes de décembre sont 40 % au-dessus de novembre. Une collègue y voit l'effet d'une campagne lancée le 1er décembre, comme chaque année. Quel comparatif demandez-vous ?

<details>
<summary>Voir la solution</summary>

Décembre **contre décembre précédent**, pas contre novembre. L'écart à novembre est d'abord la saison. L'effet campagne, s'il existe, est ce qui reste au-delà du motif annuel.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Séries temporelles
center: On n'entraîne pas sur le futur. On compare une date à son motif, pas seulement à la veille.
points:
  - icon: clock
    title: Ordre
    text: Passé pour apprendre, période récente pour juger. Pas de mélange aléatoire.
  - icon: chart
    title: Trois morceaux
    text: Tendance lente, saison qui revient, résidu irrégulier.
  - icon: alert
    title: Fenêtre
    text: Une moyenne mobile ne doit pas inclure les jours d'après la décision.
  - icon: clock
    title: Même saison
    text: Décembre se compare à décembre, pas à novembre.
  - icon: ruler
    title: Le bon pas
    text: Le grain de la série est celui de la décision, jour ou semaine.
pitfall: Laisser un rolling calculé sur toute la série avaler le lendemain.
remember: À l'instant de la décision, seules les valeurs déjà réalisées sont des features.
```
