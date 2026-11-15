---
title: La modélisation dimensionnelle
description: Schéma en étoile, tables de faits et de dimensions, granularité, dimensions à évolution lente et alternatives (table large, Data Vault).
duration: 60
objectives:
  - Concevoir un schéma en étoile à partir d'un processus métier
  - Définir la granularité d'une table de faits
  - Choisir le type de faits et de mesures adapté
  - Historiser une dimension avec les dimensions à évolution lente (SCD)
---

# Le schéma en étoile

La **modélisation dimensionnelle**, formalisée par Ralph Kimball (*The Data Warehouse Toolkit*), est la méthode la plus répandue pour organiser les tables analytiques. Elle est conçue pour que les requêtes soient **simples à écrire** pour les analystes et **rapides** à exécuter.

Elle distingue deux types de tables :

- les **tables de faits** enregistrent des **événements mesurables** d'un processus métier (une vente, un paiement, une visite) : elles contiennent des **mesures** numériques et des **clés** vers les dimensions ;
- les **tables de dimensions** décrivent le **contexte** des faits : qui, quoi, où, quand (client, produit, magasin, date). Elles contiennent les **attributs** sur lesquels on filtre et on regroupe.

```diagram
type: layers
title: Un schéma en étoile pour les ventes
layers:
  - title: Dimensions (contexte)
    items: [dim_date, dim_client, dim_produit, dim_magasin]
  - title: Table de faits (événements)
    text: "fct_ventes : une ligne par ligne de ticket de caisse"
    items: [cle_date, cle_client, cle_produit, cle_magasin, quantite, montant_ht, remise]
```

Une requête typique joint la table de faits à quelques dimensions, filtre et agrège :

```sql
SELECT
    d.annee_mois,
    p.categorie,
    sum(f.montant_ht) AS ca_ht
FROM fct_ventes AS f
JOIN dim_date    AS d ON d.cle_date = f.cle_date
JOIN dim_produit AS p ON p.cle_produit = f.cle_produit
WHERE d.annee = 2026
GROUP BY d.annee_mois, p.categorie
ORDER BY d.annee_mois, ca_ht DESC;
```

Les dimensions sont volontairement **dénormalisées** : `dim_produit` contient directement la catégorie, la sous-catégorie et la marque, au lieu de tables séparées. On accepte la redondance pour simplifier les requêtes. (La variante normalisée des dimensions s'appelle le **schéma en flocon**, moins utilisée aujourd'hui.)

# La démarche en quatre étapes

Kimball propose une démarche simple pour concevoir une table de faits :

```diagram
type: flow
title: Concevoir un modèle dimensionnel
steps:
  - title: 1. Processus métier
    text: Quel événement mesure-t-on ? (les ventes en caisse)
    tone: blue
  - title: 2. Granularité
    text: Que représente exactement une ligne ?
    tone: amber
  - title: 3. Dimensions
    text: Qui, quoi, où, quand décrivent chaque ligne ?
    tone: teal
  - title: 4. Faits
    text: Quelles mesures numériques enregistrer ?
    tone: teal
```

## La granularité, décision la plus importante

La **granularité** (*grain*) dit précisément ce que représente **une ligne** de la table de faits : « une ligne par ligne de ticket de caisse », « une ligne par compte et par jour », « une ligne par commande ». Elle se décide **avant** de choisir les colonnes.

> [!IMPORTANT]
> Choisissez la granularité **la plus fine** disponible. On peut toujours agréger des lignes de ticket en chiffre d'affaires par jour, jamais l'inverse. Mélanger deux granularités dans une même table (des lignes de détail et des lignes de total) est l'erreur qui produit les doubles comptages.

## Les types de mesures

- **Additives** : on peut les sommer selon toutes les dimensions (montant, quantité).
- **Semi-additives** : sommables selon certaines dimensions seulement. Un **solde** de compte se somme entre comptes, mais pas dans le temps (additionner les soldes de chaque jour n'a pas de sens : on prend la dernière valeur ou une moyenne).
- **Non additives** : ratios et pourcentages (taux de marge). On stocke plutôt le numérateur et le dénominateur, et on calcule le ratio **après** agrégation.

## Les types de tables de faits

| Type | Une ligne = | Exemple |
|---|---|---|
| **Transactionnelle** | Un événement | Une ligne de ticket de caisse |
| **Instantané périodique** | Un état à intervalle régulier | Le stock de chaque produit chaque soir |
| **Instantané cumulatif** | Un processus avec plusieurs étapes, mis à jour au fil de l'eau | Une commande avec ses dates de paiement, d'expédition, de livraison |

# Les dimensions

## Clés de substitution et dimension date

Chaque dimension a une **clé de substitution** (entier ou hachage), distincte de l'identifiant du système source. Cela permet d'historiser (voir plus bas), d'intégrer plusieurs sources et de gérer les membres « inconnus » (une vente sans client identifié pointe vers une ligne `client inconnu` plutôt que vers `NULL`).

La **dimension date** est présente dans presque tous les modèles : une ligne par jour, avec des attributs précalculés (année, trimestre, mois, numéro de semaine ISO, jour de la semaine, jour férié, période fiscale). Elle évite de recalculer ces attributs dans chaque requête et rend les filtres métier triviaux (`WHERE est_jour_ouvre`).

## Les dimensions conformes

Une **dimension conforme** est partagée, à l'identique, par plusieurs tables de faits : la même `dim_client` sert aux ventes, aux retours et au support. C'est ce qui permet de **croiser** les processus (« chiffre d'affaires et nombre de tickets de support par segment de client ») avec des définitions cohérentes.

## Les dimensions à évolution lente (SCD)

Les attributs d'une dimension changent : un client déménage, un produit change de catégorie. Comment le refléter ? Les **SCD** (*Slowly Changing Dimensions*) définissent plusieurs stratégies.

```diagram
type: compare
title: Les deux types de SCD les plus utilisés
columns:
  - title: "Type 1 : écraser"
    tone: blue
    items:
      - On remplace l'ancienne valeur
      - Pas d'historique
      - Les ventes passées sont rattachées à la nouvelle ville
  - title: "Type 2 : historiser"
    tone: teal
    items:
      - Nouvelle ligne à chaque changement
      - Colonnes valide_du, valide_au, est_courante
      - Chaque vente reste rattachée à la version en vigueur à sa date
```

Exemple de dimension client en SCD de type 2 :

| cle_client | id_client | nom | ville | valide_du | valide_au | est_courante |
|---|---|---|---|---|---|---|
| 1 | C042 | Durand | Nantes | 2023-05-10 | 2026-02-14 | false |
| 2 | C042 | Durand | Lyon | 2026-02-15 | 9999-12-31 | true |

Les ventes de 2025 pointent vers la clé 1 (Nantes), celles de mars 2026 vers la clé 2 (Lyon) : le chiffre d'affaires **par ville** reste historiquement exact. On choisit le type **attribut par attribut** : historiser la ville a du sens, historiser la correction d'une faute de frappe dans le nom non.

# Alternatives et compléments

- **La table large** (*One Big Table*, OBT) : faits et attributs des dimensions rassemblés dans une seule table très large. Pratique dans les entrepôts en colonnes (les colonnes non lues ne coûtent rien) et pour les outils de visualisation, mais l'historisation et la cohérence entre tables deviennent plus difficiles. On la construit souvent **à partir** du schéma en étoile, comme couche de consommation.
- **Data Vault** (Dan Linstedt) : modélisation en *hubs* (clés métier), *links* (relations) et *satellites* (attributs historisés), conçue pour intégrer de nombreuses sources et tout historiser de façon auditable. Plus lourde, elle sert de couche d'intégration, avec des étoiles construites au-dessus pour les usages.
- **La couche sémantique** : définir **une fois** les indicateurs (« chiffre d'affaires net », « client actif ») dans un outil dédié, pour que tous les tableaux de bord utilisent la même définition.

# Exercices

## Exercice 1 : Concevoir une étoile

Une salle de sport veut analyser la fréquentation : chaque passage d'un adhérent au portique d'un club est enregistré. Proposez la granularité, les dimensions et les mesures.

<details>
<summary>Voir la solution</summary>

- **Processus** : les entrées en club.
- **Granularité** : une ligne par passage au portique.
- **Dimensions** : `dim_date`, `dim_heure` (ou heure dans le fait), `dim_adherent` (formule d'abonnement, ancienneté, âge…), `dim_club` (ville, région, taille).
- **Mesures** : un compteur de passages (1 par ligne, additif). La durée de séance si elle est connue (via la sortie). Les indicateurs comme le « taux de fréquentation » se calculent après agrégation.

</details>

## Exercice 2 : Mesure semi-additive

Une table de faits `fct_soldes_quotidiens` contient le solde de chaque compte chaque soir. Un analyste calcule `sum(solde)` sur le mois de mars pour obtenir « l'encours total de mars ». Qu'est-ce qui ne va pas ?

<details>
<summary>Voir la solution</summary>

Le solde est **semi-additif** : il se somme entre comptes à une date donnée, mais pas dans le temps. Sommer 31 soldes quotidiens multiplie l'encours par environ 31. Il faut prendre l'encours **à une date** (fin de mois) : `sum(solde) WHERE date = '2026-03-31'`, ou une **moyenne** des encours quotidiens si c'est l'indicateur voulu.

</details>

## Exercice 3 : SCD

Un produit passe de la catégorie « Jardin » à « Extérieur » le 1er avril. La direction veut que les rapports de chiffre d'affaires par catégorie de l'année passée restent identiques à ceux publiés. Quel type de SCD pour l'attribut `categorie` ? Qu'est-ce que cela implique pour la table de faits ?

<details>
<summary>Voir la solution</summary>

**Type 2** : une nouvelle ligne de `dim_produit` est créée le 1er avril avec la catégorie « Extérieur », la précédente est close au 31 mars. Les faits antérieurs gardent la **clé de substitution** de l'ancienne version (« Jardin ») ; les ventes à partir du 1er avril reçoivent la nouvelle clé. Le chargement des faits doit donc rechercher la version de dimension **valide à la date du fait**, et non la version courante.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: La modélisation dimensionnelle
center: Des faits mesurables au grain le plus fin, entourés de dimensions qui donnent le contexte.
points:
  - icon: layers
    title: Faits et dimensions
    text: Les faits mesurent des événements, les dimensions disent qui, quoi, où, quand.
  - icon: ruler
    title: La granularité d'abord
    text: Décider ce que représente une ligne, au plus fin ; jamais deux granularités mêlées.
  - icon: scale
    title: Types de mesures
    text: Additives, semi-additives (soldes), non additives (ratios calculés après agrégation).
  - icon: link
    title: Dimensions conformes
    text: Partagées entre tables de faits pour croiser les processus avec les mêmes définitions.
  - icon: clock
    title: SCD type 1 ou 2
    text: Écraser, ou historiser avec valide_du, valide_au et une clé de substitution par version.
pitfall: Sommer un solde dans le temps, ou rattacher les ventes passées à la version courante d'une dimension.
remember: On peut toujours agréger un grain fin, jamais retrouver le détail d'un agrégat.
```
