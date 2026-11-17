---
title: Clustering
description: Regrouper des lignes sans étiquette, choisir un nombre de groupes, et ne pas confondre un cluster avec une vérité métier.
duration: 60
objectives:
  - Expliquer ce que k-means optimise, et ce qu'il n'optimise pas
  - Préparer les variables avant une distance
  - Juger un découpage par son usage, pas par un score seul
  - Refuser un cluster trop petit ou impossible à actionner
---

# Regrouper n'est pas prédire

En classification supervisée, vous connaissez l'étiquette. En **clustering**, vous ne l'avez pas. Vous demandez seulement : quelles lignes se ressemblent, au sens d'une distance que vous avez choisie ?

Une enseigne veut des groupes de clients pour **trois** messages, pas pour quarante. Les colonnes sont la fréquence d'achat, le panier moyen et le délai depuis la dernière visite. Il n'y a pas de « bonne » étiquette cachée dans un fichier à part. Il y a un regroupement utile ou inutile.

```diagram
type: flow
title: Du tableau aux groupes
steps:
  - title: Choisir les variables
    text: Celles qui définissent la ressemblance
    tone: blue
  - title: Mettre à l'échelle
    text: Sinon une colonne en euros écrase les autres
    tone: teal
  - title: Regrouper
    text: k-means ou une autre distance
    tone: amber
  - title: Nommer l'usage
    text: Un message, une offre, ou rien
    tone: violet
```

# k-means, en une idée

k-means place **k** centres et affecte chaque ligne au centre le plus proche, puis déplace les centres, jusqu'à stabilisation. Il cherche des groupes **rondement** séparés, de taille comparable. Il échoue sur des anneaux, des groupes très allongés, ou des densités très différentes.

**k** n'est pas découvert par les données. Vous le proposez. L'inertie (la dispersion interne) baisse toujours quand k augmente : avec une ligne par groupe, elle vaut zéro, et le résultat est inutile. On regarde plutôt le coude, et surtout **ce que l'on peut faire** des groupes.

La silhouette, entre -1 et 1, résume si les lignes sont plus proches de leur groupe que des autres. Un score de **0,28** peut accompagner un découpage quand même exploitable. Un score de **0,70** peut isoler un artefact (tous les comptes inactifs d'un côté, et rien d'actionnable).

```video
url: https://www.youtube.com/watch?v=4b5d3muPQmA
title: "StatQuest: K-means clustering"
channel: "StatQuest with Josh Starmer"
duration: "8:30"
lang: en
why: "L'algorithme k-means déroulé étape par étape, et la façon de choisir le nombre de groupes."
```

# Avant la distance

- **Échelle.** Un panier de **80 €** et une fréquence de **4** : sans standardisation, le panier décide de tout.
- **Unités dupliquées.** « Montant » et « montant hors taxe » disent presque la même chose et pèsent deux fois.
- **Valeurs extrêmes.** Un client à **40 000 €** tire un centre. On plafonne, on passe au logarithme, ou on traite ce compte à part.
- **Catégories.** k-means travaille sur des nombres. Une région encodée en 0/1 multiplie les dimensions. Parfois une segmentation métier (RFM déjà en cases) est plus claire.

> [!NOTE]
> Standardiser **après** avoir mis de côté un jeu que vous ne toucherez plus, si vous comptez comparer ensuite un modèle supervisé. Pour un clustering exploratoire unique, documentez la moyenne et l'écart utilisés.

# Le cluster n'est pas une vérité

| Groupe | Taille | Portrait | Action |
|---|---|---|---|
| A | 41 % | Visite récente, petit panier | Rien de spécifique |
| B | 27 % | Panier haut, visite espacée | Relance conseil |
| C | 30 % | Inactifs depuis 180 jours | Réactivation, ou exclusion |
| D | 2 % | Montants extrêmes | À traiter à la main, pas un message de masse |

Le groupe D n'est pas « le segment premium découvert par l'algorithme ». C'est souvent une poignée de comptes qui cassent la distance. Le groupe A, majoritaire et sans geste associé, ne mérite pas une campagne.

> [!WARNING]
> Ne présentez pas les clusters comme des personas stables. Relancez avec un autre seed : si les groupes changent de bord, le découpage est fragile.

# Exercices

## Exercice 1 : Qui domine la distance ?

Variables : panier en euros (de 10 à 500), nombre de visites (de 1 à 30), note de satisfaction (de 1 à 5). Vous lancez k-means sans standardiser. Que va dominer le regroupement ?

<details>
<summary>Voir la solution</summary>

Le **panier**, dont l'échelle est bien plus large. Deux clients au même panier seront proches même si leur fréquence et leur note diffèrent. Il faut standardiser, ou choisir des rangs, avant de parler de ressemblance.

</details>

## Exercice 2 : k qui baisse l'inertie

L'inertie vaut 100 pour k = 2, 70 pour k = 4, 55 pour k = 8, 20 pour k = 30. Le marketing ne peut écrire que 3 messages. Quel k retenez-vous, et pourquoi pas 30 ?

<details>
<summary>Voir la solution</summary>

Autour de **3 ou 4**, selon les portraits obtenus, parce que l'usage borne k. **30** baisse l'inertie et produit des groupes impossibles à actionner. L'inertie seule ne choisit pas.

</details>

## Exercice 3 : Groupe de 2 %

Un cluster de 2 % concentre les montants au-dessus de 10 000 €. Une collègue veut en faire « les ambassadeurs » et leur envoyer le même e-mail qu'à un segment de 30 %. Que répondez-vous ?

<details>
<summary>Voir la solution</summary>

Ces lignes sont d'abord des **extrêmes** à regarder une par une, pas un segment de masse. Un e-mail unique suppose un geste commun. Ici la taille et le mécanisme (une queue de distribution) ne le justifient pas. On les écarte du k-means ou on les traite à part.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Clustering
center: Un groupe n'existe que pour une distance, une échelle, et une action que vous pouvez mener.
points:
  - icon: users
    title: Sans étiquette
    text: On rapproche des lignes. On ne découvre pas une vérité cachée.
  - icon: ruler
    title: Même échelle
    text: Sans standardisation, la colonne aux grands nombres décide seule.
  - icon: target
    title: k est un choix
    text: L'inertie baisse toujours. Le nombre de messages utiles borne k.
  - icon: alert
    title: Fragilité
    text: Si un autre seed réécrit les groupes, ne les vendez pas comme des personas.
  - icon: filter
    title: Taille utile
    text: Un groupe minuscule d'extrêmes se traite à part, pas en campagne.
pitfall: Présenter le k qui minimise l'inertie comme la segmentation de l'entreprise.
remember: Nommez l'action de chaque groupe. Sans action, le cluster reste un dessin.
```
