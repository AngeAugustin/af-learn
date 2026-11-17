---
title: Étoile, flocon et grain du fait
description: Distinguer fait et dimension, lire un schéma en étoile, comprendre le flocon et fixer le grain d'un fait de ventes.
duration: 60
objectives:
  - Distinguer une table de fait et une table de dimension
  - Lire un schéma en étoile et un schéma en flocon
  - Expliquer pourquoi le flocon est souvent aplati dans le modèle BI
  - Fixer le grain d'un fait ventes avant d'y poser des mesures
---

# Le fait et la dimension

Un modèle décisionnel sépare deux rôles. Le **fait** enregistre ce qui s'est passé et porte les nombres que l'on agrège. La **dimension** décrit le contexte dans lequel cela s'est passé et porte les libellés que l'on filtre, que l'on groupe et que l'on pose sur un axe.

Dans une enseigne de distribution, une ligne de ticket est un fait : quantité, montant HT, coût. Le jour, le produit, le magasin et le client sont des dimensions. Le chiffre d'affaires n'a de sens qu'une fois rattaché à ces axes. « 3,20 € » ne se pilote pas. « 3,20 € de pain, le 12 mars, à Lyon Part-Dieu » se pilote.

| Rôle | Question | Exemples ventes | Volume typique |
|---|---|---|---|
| Fait | Combien, et à quel grain ? | Quantité, montant HT, coût | Une ligne par événement, des millions de lignes |
| Dimension | Qui, quoi, où, quand ? | Date, produit, magasin, client | Une ligne par membre, bien moins que le fait |

Une dimension peut contenir des nombres, mais ce ne sont pas des mesures du fait. Le prix catalogue du produit, la surface du magasin ou l'âge du client décrivent un membre. On ne les additionne pas quand on additionne les ventes. Le montant de la ligne, lui, est fait pour être sommé.

> [!NOTE]
> Le test pratique : si la colonne sert à **filtrer ou à étiqueter**, elle vit dans une dimension. Si elle sert à **être sommée au grain de l'événement**, elle vit dans le fait.

# Le schéma en étoile

Le **schéma en étoile** place le fait au centre et les dimensions autour. Chaque dimension est reliée directement au fait. Il n'y a pas de détour.

Pour les ventes, l'étoile tient en cinq tables.

- `Ventes` : le fait, une ligne de ticket.
- `Date` : le calendrier.
- `Produits` : le catalogue, avec la famille et le rayon déjà portés sur la ligne produit.
- `Magasins` : le réseau, avec la région et la surface.
- `Clients` : le référentiel client, avec le segment.

```diagram
type: flow
title: Des filtres au chiffre d'affaires
steps:
  - title: Dimensions
    text: Date, produit, magasin et client portent les libellés.
    tone: violet
  - title: Relations
    text: Chaque clé de dimension rejoint la clé étrangère du fait.
    tone: blue
  - title: Fait ventes
    text: Une ligne égale une ligne de ticket, avec quantité et montant.
    tone: teal
  - title: Mesure
    text: La somme du montant HT respecte les filtres des dimensions.
    tone: amber
```

Le métier reconnaît cette forme. Un filtre sur la famille « Boulangerie » passe par `Produits`, puis restreint `Ventes`. Un filtre sur la région « Auvergne-Rhône-Alpes » passe par `Magasins`. Les deux filtres se combinent : on obtient le montant HT de la boulangerie dans cette région, sans écrire de jointure dans le rapport.

L'étoile est volontairement **dénormalisée** du côté des dimensions. La famille est répétée sur chaque produit de la famille. Cette répétition est le but : un seul endroit pour filtrer, un seul saut jusqu'au fait, un modèle que l'on peut dessiner sur une page.

```video
url: https://www.youtube.com/watch?v=vZndrBBPiQc
title: "Why Power BI loves a Star Schema"
channel: "Guy in a Cube"
duration: "8:10"
lang: en
why: "Guy in a Cube explique pourquoi Power BI fonctionne le mieux avec un schéma en étoile."
```

# Le schéma en flocon

Le **schéma en flocon** part de la même idée, puis normalise les dimensions. Les attributs qui se répètent sont extraits dans leurs propres tables. Le produit ne porte plus que une clé de sous-famille. La sous-famille porte une clé de famille. La famille est une troisième table.

| Table | Colonnes utiles | Rôle dans le flocon |
|---|---|---|
| `Produits` | Produit, clé de sous-famille | Feuille la plus fine |
| `SousFamilles` | Sous-famille, clé de famille | Niveau intermédiaire |
| `Familles` | Famille | Niveau que le métier veut filtrer |
| `Ventes` | Clé produit, montant HT | Fait, inchangé |

Pour afficher le chiffre d'affaires par famille, le filtre traverse trois relations : `Familles`, puis `SousFamilles`, puis `Produits`, puis `Ventes`. Le résultat peut être juste. Le chemin, lui, n'est plus lisible d'un coup d'œil.

```diagram
type: compare
title: Étoile et flocon pour le même catalogue
columns:
  - title: Étoile
    tone: teal
    items:
      - Famille et rayon posés sur le produit
      - Un saut de Produits vers Ventes
      - Un slicer Famille sur la même table que le produit
      - Répétition assumée des libellés
  - title: Flocon
    tone: amber
    items:
      - Famille dans une table à part
      - Trois sauts pour filtrer une famille
      - Le slicer n'est plus à côté du produit
      - Proche du modèle source normalisé
```

Le flocon ressemble souvent à la base opérationnelle recopiée telle quelle : le catalogue est en troisième forme normale, et personne n'a aplati les libellés. Ce n'est pas une erreur de stockage. C'est un mauvais modèle **pour le rapport**.

# Pourquoi on évite souvent le flocon

On évite le flocon dans la couche que les analystes et les rapports interrogent, pour quatre raisons concrètes.

1. **Le chemin de filtre s'allonge.** Chaque table de plus est une relation de plus à nommer, à masquer et à expliquer. Une famille déplacée « pour éviter les doublons » oblige tout le monde à savoir dans quelle table elle se trouve.
2. **Le métier pense en étoile.** La question « les ventes de la famille Boissons » ne devrait pas exiger de connaître la clé de sous-famille. Si l'attribut n'est pas sur `Produits`, il sera oublié, ou recréé dans une colonne calculée.
3. **Les outils BI sont conçus pour l'étoile.** Power BI, un modèle tabulaire ou un extrait Tableau filtrent vite quand chaque axe est une dimension directe du fait. Le flocon fonctionne, mais il multiplie les relations sans rien apporter au calcul.
4. **La duplication est bon marché.** Répéter « Boissons » sur 400 produits coûte quelques kilo-octets. Une relation ambiguë ou un attribut introuvable coûte des heures de support.

Le flocon reste acceptable dans des cas précis : une dimension énorme partagée par plusieurs faits, ou un niveau qui a sa propre vie (une hiérarchie de comptes dont l'historique ne doit pas être recopié partout). Même alors, beaucoup d'équipes **aplatissent dans le modèle sémantique** ce que l'entrepôt conserve normalisé. L'entrepôt peut être en flocon. Le modèle du rapport gagne à être une étoile.

> [!TIP]
> Si vous hésitez, posez la question à voix haute : « Dans quelle table se trouve la famille ? » Si la réponse n'est pas immédiate, aplatissez.

# Le grain du fait

Le **grain** est la phrase qui dit ce que représente **une ligne** du fait, et ce qu'elle ne représente pas. On le fixe avant les mesures, avant les clés, avant le rapport. Tout le reste en dépend.

Pour un ticket de caisse, trois grains sont possibles. Ils ne répondent pas aux mêmes questions.

| Grain | Une ligne représente | On peut répondre | On ne peut plus répondre |
|---|---|---|---|
| Ticket | Un passage en caisse | Panier, nombre de tickets | Quel produit a été vendu |
| Ligne de ticket | Un produit dans un ticket | Produit, quantité, mix | Le détail des remises ligne à ligne si elles ne sont pas sur la ligne |
| Jour et magasin | Le total d'une journée | Tendance magasin | Le client, le ticket, le produit |

Le grain le plus fin que le métier veut filtrer est le bon grain. Si la direction produit demande le chiffre d'affaires par famille, le fait doit être **au plus fin au niveau produit**. Un fait au grain du ticket est déjà trop grossier : le produit a disparu. On ne redescend jamais en dessous du grain. On peut toujours regrouper (ligne vers ticket, ticket vers jour). On ne peut pas inventer le détail absent.

Le piège classique est de **mélanger deux grains dans la même table**. Le ticket 1042 du 12 mars à Lyon a deux lignes : pain 3,20 € et café 2,10 €. Le total du ticket est 5,30 €. Si l'on recopie 5,30 € sur chaque ligne « pour l'avoir sous la main », `SUM` du montant vaut 10,60 €. Le nombre est faux, et aucune mise en forme ne le répare.

> [!WARNING]
> Une mesure n'est additive que **dans le grain annoncé**. Un montant de ticket posé sur chaque ligne de ticket n'est plus une mesure de ligne : il est compté une fois par ligne.

Quand deux questions exigent deux grains (le détail produit et un objectif mensuel par magasin), on fait **deux faits**, pas une table fourre-tout. `Ventes` au grain ligne, `Objectifs` au grain mois et magasin. Ils partagent les dimensions `Date` et `Magasins`. Ils ne partagent pas leurs montants.

# Un exemple de ventes

Voici un fait de ventes au grain **ligne de ticket**, et les quatre dimensions qui l'entourent. Les noms sont ceux du métier. Les clés ne servent qu'à relier.

**`Ventes`**, une ligne par produit d'un ticket.

| Colonne | Exemple | Rôle |
|---|---|---|
| Date | 2025-03-12 | Clé vers `Date` |
| Produit Key | 1842 | Clé vers `Produits` |
| Magasin Key | 12 | Clé vers `Magasins` |
| Client Key | 104 | Clé vers `Clients` |
| Numéro ticket | T-88421 | Dimension dégénérée, pas une table |
| Quantité | 2 | Mesure additive |
| Montant HT | 3,20 | Mesure additive |
| Coût | 1,40 | Mesure additive |

**Dimensions**, une ligne par membre.

| Table | Clé | Attributs que le rapport affiche |
|---|---|---|
| `Date` | Date | Année, trimestre, mois, semaine, jour |
| `Produits` | Produit Key | Produit, sous-famille, famille, marque |
| `Magasins` | Magasin Key | Magasin, ville, région, surface |
| `Clients` | Client Key | Client, segment, ville |

Le ticket T-88421 devient deux lignes de fait, pas une.

| Date | Produit | Magasin | Client | Ticket | Quantité | Montant HT |
|---|---|---|---|---|---|---|
| 12 mars 2025 | Pain 400 g | Lyon Part-Dieu | C-104 | T-88421 | 2 | 3,20 |
| 12 mars 2025 | Café expresso | Lyon Part-Dieu | C-104 | T-88421 | 1 | 2,10 |

La somme du montant HT est 5,30 €. Le nombre de tickets distincts est 1. Le nombre de lignes est 2. Ces trois chiffres cohabitent parce que le grain est la ligne, et que le numéro de ticket reste disponible pour compter les tickets sans changer de grain.

```diagram
type: layers
title: Ce que chaque couche du modèle ventes a le droit de porter
layers:
  - title: Rapport
    text: Famille, magasin, mois, chiffre d'affaires et nombre de tickets
  - title: Dimensions
    text: Libellés et hiérarchies, une ligne par produit, magasin, client ou jour
  - title: Fait au grain ligne
    text: Quantité, montant HT et coût, plus les clés et le numéro de ticket
  - title: Interdit dans ce fait
    text: Total du ticket recopié sur chaque ligne, ou total du jour déjà agrégé
```

Avant d'écrire la moindre mesure, on doit pouvoir dire la phrase suivante, sans trou : « Une ligne de `Ventes` est une ligne de ticket, pour un produit, un jour, un magasin et un client. Le montant HT s'additionne. Le numéro de ticket sert à compter les tickets. »

# Exercices

## Exercice 1 : Trier le ticket

On vous donne les colonnes d'un export caisse : date de vente, numéro de ticket, code magasin, nom du magasin, région, code produit, libellé produit, famille, code client, segment client, quantité, montant HT, coût de revient.

Classez chaque colonne : fait (mesure), clé du fait, ou attribut de dimension. Indiquez la table de dimension d'accueil.

<details>
<summary>Voir la solution</summary>

Mesures du fait `Ventes` : quantité, montant HT, coût de revient.

Clés portées par le fait : date de vente, numéro de ticket, code magasin, code produit, code client.

Attributs de dimension :

- `Magasins` : nom du magasin, région (la clé est le code magasin).
- `Produits` : libellé produit, famille (la clé est le code produit).
- `Clients` : segment client (la clé est le code client).
- `Date` : la date de vente, qui servira aussi d'axe calendrier.

Le numéro de ticket reste sur le fait. Il n'a pas d'attributs propres : c'est une dimension dégénérée, pas une table `Tickets`.

</details>

## Exercice 2 : Choisir le grain

Le comité d'enseigne veut trois réponses : le panier moyen, le chiffre d'affaires par famille, et le taux de marge par magasin et par mois. Un collègue propose un fait unique au grain « magasin et jour », avec le montant déjà sommé.

Dites si ce grain suffit, et quel grain vous retenez.

<details>
<summary>Voir la solution</summary>

Le grain « magasin et jour » ne suffit pas. La famille a disparu, donc le chiffre d'affaires par famille est impossible. Le ticket a disparu, donc le panier moyen (montant divisé par le nombre de tickets) est impossible. Le taux de marge magasin et mois, lui, serait calculable, mais ce n'est qu'une des trois questions.

Le grain retenu est la **ligne de ticket** : date, produit, magasin, client, numéro de ticket, quantité, montant HT, coût. On retrouve la famille via le produit, le mois via la date, le panier via le numéro de ticket, et la marge via le montant et le coût. Les regroupements magasin et mois se feront dans les mesures, pas en agrégeant le fait trop tôt.

</details>

## Exercice 3 : Aplatir le flocon

Le catalogue est livré en trois tables : `Produits` (produit, clé sous-famille), `SousFamilles` (sous-famille, clé famille), `Familles` (famille). Le rapport n'a besoin que de filtrer produit, sous-famille et famille.

Décrivez la dimension que vous publiez dans le modèle BI, et ce que vous ne publiez pas.

<details>
<summary>Voir la solution</summary>

On publie une seule dimension `Produits`, au grain produit, avec les colonnes produit, sous-famille et famille. Les libellés sont répétés. La relation vers `Ventes` est directe.

On ne publie pas `SousFamilles` ni `Familles` dans le modèle du rapport. Les conserver créerait un flocon que le métier devrait traverser pour un simple slicer. Si l'entrepôt doit garder les trois tables pour d'autres usages, l'aplatissement se fait dans la vue ou la requête qui alimente le modèle sémantique.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Étoile, flocon et grain du fait
center: Une ligne du fait a un grain clair, les dimensions portent le contexte, et l'étoile évite les détours du flocon.
points:
  - icon: database
    title: Fait et dimensions
    text: Le fait porte les montants à sommer. Les dimensions portent les libellés que l'on filtre.
  - icon: network
    title: L'étoile
    text: Date, produit, magasin et client relient le fait en un seul saut, sans table intermédiaire.
  - icon: layers
    title: Le flocon
    text: Normaliser la famille dans une autre table allonge le filtre et cache l'attribut au métier.
  - icon: target
    title: Le grain
    text: Une ligne de ventes est une ligne de ticket. On peut regrouper, jamais redescendre plus fin.
  - icon: alert
    title: Ne pas mélanger
    text: Recopier le total du ticket sur chaque ligne double le chiffre d'affaires dès qu'on somme.
pitfall: Choisir un fait au grain jour et magasin, puis découvrir que la famille et le ticket ont disparu.
remember: On fixe d'abord la phrase du grain, puis on met chaque libellé sur une dimension directement reliée au fait.
```
