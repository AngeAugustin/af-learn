---
title: "Implémenter l'étoile"
description: "Construire l'étoile Halte : fct_ventes au grain du ticket, dimensions date, magasin et produit, et les colonnes qui n'entrent pas dans le fait."
duration: 65
objectives:
  - "Relier le fait de ventes aux dimensions jour, magasin et produit"
  - "Choisir les clés que la page joint sans dupliquer mars"
  - "Laisser région et famille dans les dimensions"
  - "Refuser dans le fait le taux, le stock et le commentaire de revue"
---

# Une étoile pour les ventes

L'étoile est la forme que Nora parcourt sans la réécrire. Au centre, ce qui s'est passé. Autour, comment on le découpe. Pour Halte, une étoile suffit à la revue : les ventes par magasin, par jour et par produit.

```diagram
type: layers
title: L'étoile des ventes Halte
layers:
  - title: Dimensions
    text: "Le découpage. Une ligne par entité."
    items:
      - "dim_date : un jour"
      - "dim_magasin : un magasin"
      - "dim_produit : un produit"
  - title: Fait
    text: "fct_ventes, une ligne de ticket."
    items:
      - "ligne_id, ticket_id, trois clés"
      - "montants signés, marge_ht, quantite"
  - title: Lecture
    text: "La page somme et filtre."
    items:
      - "Région, famille, mois"
      - "Aucun libellé recopié sur le ticket"
```

`fct_ventes` répond à : combien, sur cette ligne. Les dimensions répondent à : qui, quoi, quand. « Ouest », « famille boisson », « mars 2026 » ne sont pas des combien. Ils vivent à côté. Les sommer n'a pas de sens. Sommer `montant_ht_signe` après les avoir filtrés, si.

# Le fait ne décrit pas le magasin

Copier la région sur le ticket fige une description au chargement, et la répète sur toutes les lignes du magasin. Le jour où le rattachement change, vous réécrivez le passé, ou vous acceptez deux régions selon la date de chargement.

Le fait garde `magasin_id`. Le nom et la région restent dans `dim_magasin`, une ligne par magasin tant que vous n'historisez pas le segment. Une correction de libellé se fait dans la dimension. Toutes les lectures la voient. Le chapitre suivant dira comment versionner un segment sans gonfler le fait.

| Colonne | Table | Pourquoi |
|---|---|---|
| `ligne_id` | Fait | Clé de la ligne, unique |
| `ticket_id` | Fait | Identifiant de ticket, sans table autour |
| `magasin_id`, `produit_id`, `jour` | Fait et dimensions | Clés de jointure |
| `region`, nom du magasin | Dimension magasin | Attributs, une seule fois |
| Famille, libellé | Dimension produit | Attributs, une seule fois |
| `montant_ht_signe`, `marge_ht`, `quantite` | Fait | Mesures du grain |

`ticket_id` reste sur le fait. Il sert à compter des tickets distincts si un jour le contrat le demande. Il n'a pas d'attribut propre : pas de `dim_ticket` qui ne contiendrait que la clé. Ce n'est pas une raison pour l'effacer. Au grain `ligne_id`, plusieurs lignes partagent le même ticket. Le garder est honnête. Le promouvoir en dimension vide ne l'est pas.

`charge_le` reste aussi, comme témoin de fraîcheur. Ce n'est pas un jour de vente. Personne ne le somme.

La dimension magasin liste les quarante-deux intégrés, plus une ligne « inconnu » si une clé arrive sans référentiel. Le fait pointe vers elle plutôt que de perdre le montant. Un test compte ce CA. Au-dessus de zéro, le référentiel n'est pas complet, et le total, lui, n'a pas baissé en silence.

# Trois clés, plus la ligne

**`dim_date`.** Une ligne par jour civil, y compris les jours sans vente. Clé : `jour`. Attributs : année, mois, lundi de semaine. Le 31 mars 2026 existe. Son mois est mars. Vous le vérifiez avant de laisser la page filtrer dessus.

**`dim_magasin`.** Une ligne par magasin intégré, plus « inconnu ». Clé : `magasin_id`. Attributs : nom, `region`. Quarante-deux lignes métier. L'Ouest de Marie s'y lit. Il ne se recalcule pas dans la page.

**`dim_produit`.** Une ligne par produit. Clé : `produit_id`. Attributs : libellé, famille. Le fait pointe vers le produit de la ligne. Plusieurs lignes du même jour peuvent partager ce produit : la somme par produit est alors le CA de ce produit.

**`fct_ventes`.** Clé primaire `ligne_id`. Clés étrangères `magasin_id`, `produit_id`, `jour`. `ticket_id` dégénéré. Mesures additives. Pas de seconde clé cachée qui contredirait `ligne_id`.

```sql
SELECT
  f.magasin_id,
  f.jour,
  f.produit_id,
  SUM(f.montant_ht_signe) AS ca_ht
FROM fct_ventes AS f
JOIN dim_magasin AS m ON m.magasin_id = f.magasin_id
JOIN dim_produit AS p ON p.produit_id = f.produit_id
JOIN dim_date AS d ON d.jour = f.jour
WHERE d.jour >= DATE '2026-03-01'
  AND d.jour <  DATE '2026-04-01'
GROUP BY f.magasin_id, f.jour, f.produit_id;
```

Cette jointure ne multiplie pas mars si chaque dimension est unique sur sa clé. Le test de l'étoile : le nombre de `ligne_id` après les trois jointures égale le nombre dans le fait, et la somme reste 6 240 000 €. Le jour où vous historiserez le magasin, la jointure sur `magasin_id` seul ne sera plus licite. Vous changerez la clé en même temps que la dimension.

> [!TIP]
> Clé de dimension unique, clé de fait égale au grain. La jointure relie les clés. Elle ne répare pas un attribut mal rangé.

# Ce qui n'entre pas dans le fait

**Les libellés.** Région, nom, famille. Une jointure les retrouve.

**Le taux de marge.** 35 % en mars est 2 184 000 / 6 240 000, après les sommes. Le stocker sur la ligne invite une moyenne. `marge_ht` en euros, lui, a le droit d'être là : c'est la différence au même grain.

**Le stock.** La quantité en rayon n'est pas une vente. La sommer avec `quantite` mélange un niveau et un flux. Le contrat de Halte ne publie pas de stock. S'il en faut un plus tard, ce sera un autre fait, avec un autre nom de colonne.

**Le rang et le CA de mars 2025.** Ce sont des calculs, à un autre grain. Les poser sur le ticket les rend sommables par erreur. CA N-1 est une mesure.

**Le commentaire de revue.** « L'Ouest décroche » est une phrase de Nora. Elle date. Elle n'a pas de `ligne_id`.

**Le jour de chargement à la place du jour de vente.** `charge_le` reste le témoin. Il ne remplace pas `jour` dans le filtre de mars.

Une colonne candidate passe trois questions. Décrit-elle cette ligne, et rien de plus large ? A-t-on le droit de la sommer, ou est-elle une clé ? Si on la copie depuis une dimension, que se passe-t-il quand la dimension change ? Deux réponses défavorables, et elle n'entre pas.

# La jointure que Nora n'écrit plus

Dans le modèle, les trois relations sont posées. Nora prend CA HT, elle pose Région et Famille, elle filtre mars. Elle ne voit pas le `JOIN`. C'est le but.

Vous lui garantissez : plusieurs lignes vers un magasin, un produit, un jour ; filtrer la région filtre les ventes, il n'en fabrique pas ; pas de second chemin vers le CA ; les noms à l'écran branchés sur les bonnes colonnes.

Si une page a besoin d'une jointure que le modèle ne sait pas faire, vous étendez l'étoile ou vous dites que la question est hors grain. Vous ne donnez pas un SQL qui relit `caisse.lignes`. L'exception de ce matin est la copie de la semaine prochaine.

Mars : somme sur le fait seul, somme après les trois jointures, mêmes 6 240 000 €. Vous les notez. L'étoile est livrée quand ce contrôle passe, pas quand le diagramme est joli.

# Exercices

## Exercice 1 : La région sur le ticket

Pour aller plus vite, un collègue ajoute `region` dans `fct_ventes`. En avril, un magasin passe de l'Ouest au Nord. La page de mars montre encore Ouest. Marie ne retrouve plus 1 560 000 € sur le même périmètre de magasins. Que corrigez-vous ?

<details>
<summary>Voir la solution</summary>

Vous retirez `region` du fait. La page joint `dim_magasin`. La région est celle de la dimension.

Vous ne lancez pas un script qui réécrit les textes copiés sur les tickets de mars. Si le métier veut la région de mars, c'est un historique de dimension, traité comme tel. Le témoin de l'Ouest se rejoue après la jointure propre, pas après un texte figé.

</details>

## Exercice 2 : Une dimension ticket

Le fait porte déjà `ticket_id`. Quelqu'un propose `dim_ticket` avec pour seule colonne cette clé, « pour faire propre ». Pourquoi refusez-vous, et pourquoi gardez-vous la colonne sur le fait ?

<details>
<summary>Voir la solution</summary>

`ticket_id` n'a pas d'attribut. Une dimension ne contiendrait que la clé et alourdirait l'étoile sans rien donner à filtrer. C'est un identifiant dégénéré : il reste sur `fct_ventes`.

Le retirer empêcherait de compter les tickets distincts le jour où une mesure le demanderait. Le grain, lui, reste `ligne_id` : un ticket a plusieurs lignes. Vous ne remplacez pas la clé du fait par `ticket_id`.

</details>

## Exercice 3 : Neuf cents euros disparus

Après jointure à `dim_magasin`, la somme de mars baisse. La dimension n'a pas de doublon. Un `magasin_id` du fait est absent. Que doit devenir ce montant ?

<details>
<summary>Voir la solution</summary>

Un `INNER JOIN` a écarté l'orphelin. Le CA certifié ne baisse pas parce qu'un référentiel est incomplet. Vous ajoutez la ligne « inconnu » dans `dim_magasin`, vous y rattachez la clé, et le total du fait redevient complet.

Un test compte le CA porté par cette ligne. Tant qu'il n'est pas nul, vous voyez le trou. Vous ne supprimez pas le montant pour que la jointure tombe juste. Le réseau doit pouvoir retrouver 6 240 000 €.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Implémenter l'étoile
center: "Le fait compte les tickets. Les dimensions décrivent. Nora joint des clés, pas des textes."
points:
  - icon: database
    title: fct_ventes
    text: "Clé ligne_id. ticket_id reste sur la ligne. Montants signés, marge_ht, quantite."
  - icon: layers
    title: Trois dimensions
    text: "Jour, magasin, produit. Une ligne par clé. Le calendrier existe même sans vente."
  - icon: key
    title: Clés seules
    text: "Le fait garde les identifiants. Région et famille restent dans les dimensions."
  - icon: alert
    title: Hors du fait
    text: "Taux, stock, rang, commentaire. marge_ht en euros, oui. 35 % stocké sur la ligne, non."
  - icon: link
    title: Même total
    text: "Après les trois jointures, mars vaut encore 6 240 000 €. Sinon l'étoile n'est pas livrée."
pitfall: "Copier la région sur le ticket, puis afficher Ouest alors que le magasin est passé au Nord."
remember: "Livrez ligne_id, les trois dimensions uniques, et un total qui ne bouge pas quand on les joint."
```
