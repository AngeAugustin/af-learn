---
title: "Mesures et taux dans la couche"
description: "Distinguer mesure et colonne, calculer le taux de marge dans la couche sémantique, et empêcher chaque rapport Halte de réinventer la formule."
duration: 58
objectives:
  - "Distinguer une colonne de ligne et une mesure d'agrégat"
  - "Calculer un taux comme un quotient de sommes dans la couche"
  - "Publier une seule marge pour tous les rapports"
  - "Dire quels filtres le rapport a le droit de poser"
---

# La colonne reste sur la ligne

Dans `fct_ventes`, `montant_ht_signe` et `marge_ht` sont des **colonnes**. Chacune a une valeur par ligne de ticket. Elles se stockent, elles se testent, elles se décrivent. Elles ne savent pas, seules, répondre à « la marge de l'Ouest en mars ».

Cette réponse dépend du filtre : le mois, la région, le magasin, et de rien d'autre. C'est le travail d'une **mesure**. La mesure s'évalue dans le contexte du visuel. Le même nom `Marge HT` vaut 2 000 € sur un magasin et la somme du réseau sur la page d'à côté, sans que vous ayez stocké ces deux nombres.

Une colonne calculée « marge du ticket divisée par montant du ticket », puis moyennée dans le visuel, n'est pas cette mesure. Elle fige un taux par ligne, et la moyenne donne le même poids à un ticket de 3 € et à un ticket de 300 €. Le réseau Halte ne se pilote pas comme ça.

```diagram
type: compare
title: "Colonne de ligne ou mesure"
columns:
  - title: "Colonne"
    tone: blue
    items:
      - "Une valeur par ligne de ticket"
      - "Stockée dans fct_ventes"
      - "Testée et décrite dans dbt"
  - title: "Mesure"
    tone: teal
    items:
      - "Un agrégat dans le filtre du visuel"
      - "Nommée dans la couche sémantique"
      - "La même formule pour chaque rapport"
  - title: "Rapport"
    tone: amber
    items:
      - "Choisit le mois, la région, le magasin"
      - "Pose la mesure sur un visuel"
      - "N'écrit pas une deuxième formule"
```

# Le taux est un quotient de sommes

Le taux de marge du réseau est la marge totale divisée par le CA total, sur le périmètre filtré. Il n'est pas la moyenne des taux de magasins, ni la moyenne des taux de lignes.

En SQL, la forme juste, celle que la couche doit garantir quel que soit le `GROUP BY` demandé :

```sql
select
    sum(marge_ht) / nullif(sum(montant_ht_signe), 0) as taux_de_marge
from {{ ref('fct_ventes') }}
```

La forme fausse, à ne pas laisser dans un rapport :

```sql
select avg(marge_ht / nullif(montant_ht_signe, 0)) as taux_moyen_des_lignes
from {{ ref('fct_ventes') }}
```

Dans le modèle Power BI, les trois mesures vont ensemble. Le taux appelle les deux sommes. Il ne rappelle pas les colonnes en parallèle, pour qu'un changement de marge se fasse à un seul endroit.

```dax
Marge HT = SUM ( fct_ventes[marge_ht] )

CA HT = SUM ( fct_ventes[montant_ht_signe] )

Taux de marge = DIVIDE ( [Marge HT], [CA HT] )
```

`DIVIDE` rend vide une division par zéro au lieu d'une erreur au milieu de la revue. Le vide se lit. Il ne se remplace pas par zéro : un magasin sans CA n'a pas une marge de 0 %.

LookML exprime le même quotient sur les mesures, pas sur les lignes.

```lookml
measure: taux_de_marge {
  type: number
  sql: ${marge_ht} / nullif(${ca_ht}, 0) ;;
  value_format_name: percent_2
}
```

Au grain d'une ligne, le taux de cette ligne peut exister pour une enquête ticket. Il porte un autre nom (`taux_ligne`), il n'entre pas dans la revue, et personne ne le moyenne pour obtenir le réseau.

# Une marge pour tous les rapports

La formule de marge est déjà dans le mart : `montant_ht_signe - cout_ht_signe`. La mesure `Marge HT` ne fait que la sommer. Si un rapport « enlève les démarques » et qu'un autre « garde le coût logistique », ce n'est plus une présentation. Ce sont deux marges.

Le symptôme : des mesures locales `Marge réseau`, `Marge région Nord`, `Marge hors promo`. Chacune vit dans un fichier, aucune n'est dans le modèle publié. Le comité additionne des choses différentes en croyant lire un écart de magasins.

Vous publiez `Marge HT` et `Taux de marge`. Un besoin réel (marge hors un canal, marge avant une famille de coûts) devient une mesure supplémentaire, nommée pour ce qu'elle est, avec une description. Il ne devient pas une copie renommée dans le rapport de la personne qui a demandé.

| Besoin | Où ça se règle | Nom |
| --- | --- | --- |
| Marge des magasins, périmètre du mart | Mesure sur `marge_ht` | `Marge HT` |
| Taux au grain du visuel | Quotient des deux mesures | `Taux de marge` |
| Autre périmètre demandé par la finance | Nouvelle mesure, autre description | Un nom qui ne dit pas seulement « marge » |

La description de `Taux de marge` rappelle l'interdit utile : « Quotient de la somme des marges par la somme des CA. Pas une moyenne de taux. »

> [!WARNING]
> Un taux stocké dans l'agrégat, puis moyenné ou sommé, redevient faux dès qu'on change de grain. Le taux se recalcule à partir des sommes du contexte. Il ne se stocke pas comme une colonne à additionner.

# Ce que le rapport a le droit de filtrer

Le rapport choisit le contexte : mois, région, magasin, famille si la dimension existe. Ce contexte s'applique aux mesures. Il ne réécrit pas leur formule.

Il n'a pas à filtrer `type de ligne`, puisque le mart ne publie plus cette colonne pour le CA. Il n'a pas à poser « montant positif seulement » pour écarter les retours : il écarterait des lignes négatives et gonflerait le CA. S'il a besoin du nombre de retours, vous publiez une mesure `Montant des retours`, calculée en amont, nommée comme telle.

Deux rapports peuvent afficher des taux différents le même lundi. C'est normal s'ils ne filtrent pas le même mois ou la même région. Ce n'est pas normal s'ils filtrent la même chose et divergent : l'un des deux n'utilise pas `Taux de marge`.

Votre contrôle est concret. Même filtre, même mesure, même total. Vous le faites avant de laisser la page partir, sur un mois déjà rapproché avec la finance. Le visuel a le droit d'être moche. Il n'a pas le droit d'avoir sa propre marge.

# Le livrable reste le modèle

Vous ajoutez les mesures dans la couche que vous possédez. Vous retirez les mesures locales des rapports qui font la revue, ou vous les faites remplacer par les vôtres. L'analyste garde la mise en page, l'ordre des magasins, le commentaire.

Une demande « tu peux mettre la marge en plus sur la slide » se traduit par : la mesure existe, pose-la sur la page. Si elle n'existe pas, vous la créez dans le modèle, pas dans la slide. Le chiffre de la slide sans mesure derrière ne se mettra pas à jour vendredi.

# Exercices

## Exercice 1 : Le taux à 40 % qui n'existe pas

Un magasin a deux tickets. L'un : CA 10 €, marge 8 €. L'autre : CA 1 000 €, marge 200 €. Un rapport moyenne les taux de lignes et affiche un ordre de grandeur proche de 40 %. Quel est le taux de marge du magasin, et quelle mesure le garantit ?

<details>
<summary>Voir la solution</summary>

Sommes : CA 1 010 €, marge 208 €. Taux 208 / 1 010, soit environ 20,6 %. La moyenne des taux de lignes (80 % et 20 %) tourne autour de 50 % si on moyenne sans pondérer, ou « près de 40 % » selon l'arrondi que le rapport a bricolé. Dans les deux cas, le petit ticket pèse trop.

La mesure `Taux de marge = DIVIDE ( [Marge HT], [CA HT] )` recalcule le quotient dans le filtre « ce magasin ». Elle ne moyenne pas une colonne de taux. Au grain d'une seule ligne, elle retombe sur le taux de la ligne, ce qui est correct, parce que les deux sommes n'ont qu'un terme.

</details>

## Exercice 2 : Trois noms pour la même marge

Vous trouvez `Marge HT` dans le modèle publié, `Marge_Nord` dans un rapport de région, et `Marge hors logistique` dans un fichier local dont personne ne sait si le coût logistique est vraiment retiré. Que gardez-vous, que supprimez-vous, que créez-vous seulement si la finance le demande ?

<details>
<summary>Voir la solution</summary>

`Marge HT` reste. C'est la somme de `marge_ht`, le périmètre du mart.

`Marge_Nord` est un filtre de région sur la même mesure, pas une formule. Vous la retirez du rapport et vous posez `Marge HT` avec le filtre Nord (ou le rôle de sécurité, qui limitera la région de toute façon).

`Marge hors logistique` ne reste pas dans le fichier local. Si la finance confirme un deuxième indicateur, vous créez une mesure au nom explicite, description à l'appui, dans le modèle publié. Sinon le fichier sort de la revue. Trois noms pour une formule, ou un nom flou pour une formule inconnue, ne se présentent pas au comité.

</details>

## Exercice 3 : Le filtre qui gonfle le CA

Un analyste veut « voir les ventes sans les retours ». Il filtre `montant_ht_signe > 0` sur la page qui utilise `CA HT`. Le total monte. Pourquoi, et que lui proposez-vous à la place ?

<details>
<summary>Voir la solution</summary>

Les retours sont déjà des montants négatifs. Les retirer du filtre les sort de la somme : le CA n'est plus net, il est brut, et les lignes à zéro disparaissent aussi. Le nom `CA HT` devient faux sur cette page.

Vous ne changez pas la mesure pour lui faire plaisir. S'il veut le brut, vous publiez `CA HT brut` (somme des seules ventes, nom et description dédiés) ou vous lui donnez une mesure `Montant des retours`. La page du CA officiel n'a pas ce filtre. Le contrôle : sur un mois rapproché, `CA HT` sans filtre de signe colle encore au chiffre finance.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Mesures et taux"
center: "La colonne décrit la ligne. La mesure somme dans le filtre. Le taux divise deux sommes, une seule fois, dans la couche."
points:
  - icon: database
    title: "Colonne"
    text: "montant_ht_signe et marge_ht vivent sur la ligne de ticket, dans le mart."
  - icon: chart
    title: "Mesure"
    text: "CA HT et Marge HT somment ces colonnes dans le contexte du visuel."
  - icon: scale
    title: "Le taux"
    text: "DIVIDE de la marge par le CA. Jamais la moyenne des taux de lignes."
  - icon: money
    title: "Une marge"
    text: "Les copies Marge_Nord ou Marge v2 sortent des rapports de revue."
  - icon: filter
    title: "Filtres utiles"
    text: "Mois, région, magasin. Pas un filtre qui retire les montants négatifs."
pitfall: "Moyenner les taux de tickets donne le même poids à 3 euros et à 300 euros."
remember: "Un rapport pose la mesure officielle. Il ne réécrit pas la marge dans une formule locale."
```
