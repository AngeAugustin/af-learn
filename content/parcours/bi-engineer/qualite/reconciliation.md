---
title: "Réconcilier le CA du mart et la finance"
description: "Le CA du mart Ventes Halte égale le CA finance à une règle près (retours, taxes, ventes au personnel). L'écart se décompose, le seuil dit quand on s'arrête, et le message part aux bonnes personnes."
duration: 40
objectives:
  - "Rendre le CA du mart comparable au CA finance avec une règle écrite"
  - "Séparer l'écart expliqué du reste inexpliqué"
  - "Appliquer le seuil de 5 000 € ou de 0,5 % avant une revue"
  - "Prévenir la finance, le BI Engineer et l'analyste quand le reste dépasse le seuil"
---

# Le CA que l'on a le droit de comparer

Chez **Halte**, le comité du lundi lit le chiffre d'affaires hors taxes des **42 magasins intégrés**. Le mart `fct_ventes` et le compte 707 de la finance doivent raconter le même mois. Ils ne partent pas du même fichier : la caisse date un ticket, la finance date une pièce, et les deux mots « chiffre d'affaires » ne visent pas le même périmètre tant que la règle n'est pas écrite.

Mars 2026 est le mois témoin. Le mart, une fois la règle appliquée, vaut **6 240 000 €**. La finance envoie **6 258 000 €** HT. L'écart de 18 000 € n'est pas une erreur de chargement. C'est deux lignes que l'on sait nommer. Le travail de réconciliation consiste à les écrire, à calculer ce qui reste, et à décider si Nora, l'analyste qui présente, a le droit d'ouvrir la revue.

> [!IMPORTANT]
> On ne rapproche pas un total de caisse brut d'un extrait TTC. On rapproche deux montants déjà ramenés à la même règle. Sinon l'écart mesure le désaccord de définition, et on le prend pour un bug.

```diagram
type: flow
title: "Du ticket au reste inexpliqué"
steps:
  - title: "Caisse"
    text: "Lignes HT, retours négatifs, date de ticket"
    tone: violet
  - title: "Règle"
    text: "Intégrés, hors taxes, hors ventes au personnel"
    tone: blue
  - title: "Mart"
    text: "CA de mars : 6 240 000 €"
    tone: teal
  - title: "Finance"
    text: "Compte 707 HT : 6 258 000 €, lignes nommées"
    tone: amber
  - title: "Seuil"
    text: "Reste au-dessus de 5 000 € ou de 0,5 % : on prévient"
    tone: rose
```

# La règle des retours et des taxes

La règle tient en quatre phrases. Elle est le contrat du CA, pas un filtre que chacun ajoute le lundi.

1. **Périmètre.** Magasins `type = integre` seulement. Les franchises n'entrent ni dans le mart ni dans le fichier de contrôle.
2. **Taxes.** Le CA comparé est **hors taxes**. La TVA collectée n'est pas du chiffre d'affaires. Si l'extrait finance n'est pas libellé HT, on le renvoie. On ne multiplie pas le mart par 1,20 : les taux de TVA de Halte ne sont pas tous à 20 %.
3. **Retours.** Ils sont déjà des montants **négatifs** à la date du ticket. Sur mars, les ventes brutes HT hors personnel font 6 480 000 € et les retours font −240 000 €. Le net est 6 240 000 €. Filtrer `est_retour = non` retire une deuxième fois des lignes déjà négatives et gonfle le CA à 6 480 000 €.
4. **Ventes au personnel.** Elles restent dans le 707 et sortent du mart. Ce n'est pas un oubli de jointure.

Le signe « − » devant 240 000 € est celui de la caisse. Le mart le conserve. La finance, elle, peut passer une pièce un autre jour : ce décalage se traite comme une ligne d'écart, pas comme un nouveau filtre sur `est_retour`.

# L'écart expliqué et le reste

L'écart total entre 6 258 000 € et 6 240 000 € se décompose. Ce qui a un nom et un propriétaire va dans le journal. Ce qui n'en a pas est le **reste inexpliqué**.

| Ligne | Montant HT | Où il vit |
| --- | --- | --- |
| Compte 707, mars 2026, déjà HT | 6 258 000 € | Finance, point de départ |
| Retours du 31 mars, pièce au 2 avril | 15 000 € | Dans le mart (date ticket), pas encore dans le 707 de mars |
| Ventes au personnel | 3 000 € | Dans le 707, hors contrat du mart |
| CA mart attendu | 6 240 000 € | 6 258 000 − 15 000 − 3 000 |
| Reste inexpliqué | 0 € | Sous le seuil |

Le calcul tient dans une formule que le test rejoue chaque matin :

```sql
-- reste = ca_mart - (ca_finance_ht - retours_decales - ventes_personnel)
-- mars 2026 : 6240000 - (6258000 - 15000 - 3000) = 0
```

Les 15 000 € font partie des 240 000 € de retours du mois. La finance en a passé 225 000 € en mars et 15 000 € le 2 avril. On n'ajoute pas 15 000 € « en plus » des retours. On explique seulement le décalage de date.

Camille Renard, au contrôle de gestion, possède le sens de ces deux lignes. Lina Costa, BI Engineer, possède le calcul. Une ligne sans montant, sans mois et sans propriétaire n'est pas une explication : c'est une phrase.

# Le seuil qui bloque la revue

Le seuil porte sur le **reste**, jamais sur les lignes déjà écrites. On alerte dès que le reste dépasse **5 000 €**, et dès qu'il dépasse **0,5 %** du CA finance du mois. Le premier des deux suffit. Sur mars, 0,5 % de 6 258 000 € vaut 31 290 €. Le plancher de 5 000 € est donc franchi en premier.

Conséquences, sur ce mois témoin :

- Reste à 0 €, écart expliqué de 18 000 € : le journal suffit. Nora présente 6 240 000 €.
- Reste de 6 000 € : alerte, même si 6 000 € est très en dessous de 0,5 %. Le plancher est fait pour ça.
- Reste de 240 000 € (retours filtrés deux fois) : alerte franche. On ne « recolle » pas la finance en relevant le seuil à 5 % pour absorber le bug. 5 % de ce mois, c'est plus de 300 000 € : le bug des retours passerait.

Le test automatique échoue le build quand le reste dépasse le seuil. Le journal des lignes expliquées reste une table (`ecarts_expliques`), relue quand la règle change, pas un commentaire au fond d'un ticket.

> [!WARNING]
> Un seuil qui bouge le matin de la revue pour faire tenir le chiffre n'est plus un seuil. C'est une autorisation d'avoir tort.

# Qui prévenir, et avec quel message

Trois personnes, pas le réseau entier.

| Situation | Camille (finance) | Lina (mart) | Nora (analyste) | Direction |
| --- | --- | --- | --- | --- |
| Reste à 0, lignes écrites | Voit le journal | Voit le journal | Présente le CA | Rien de plus |
| Reste au-dessus du seuil | Oui, le sens | Oui, le calcul | Oui, ne pas présenter | Seulement si le dernier jour certifié ne peut pas servir |
| Extrait sans libellé HT | Oui, renvoyer le fichier | Non, on ne convertit pas | Oui, revue en attente | Non |

Le message tient en cinq lignes. Il ne contient pas une pièce jointe de plus.

> Mart Ventes Halte, mars 2026. CA mart : 6 480 000 €. CA finance HT : 6 258 000 €. Règle : moins 15 000 € de retours décalés, moins 3 000 € de ventes au personnel. Reste inexpliqué : 222 000 €, au-dessus de 5 000 €. Ne présentez pas ce chiffre. Dernier CA certifié : 6 240 000 €.

Camille dit si la règle a changé. Lina dit si le modèle a changé. Nora s'arrête. La direction n'a pas à arbitrer un `WHERE` en séance. Si le chiffre certifié de la veille peut tenir la revue, on le dit en une phrase, avec l'heure de fraîcheur. Le détail reste dans le journal.

# Exercices

## Exercice 1 : Décomposer les 18 000 €

La finance annonce 6 258 000 € HT pour mars 2026. Le mart affiche 6 240 000 €. Une collègue veut ouvrir un incident « écart de chargement ». Décomposez l'écart et dites si Nora peut présenter.

<details>
<summary>Voir la solution</summary>

L'écart de 18 000 € est expliqué. 15 000 € sont des retours du 31 mars, déjà dans le mart à la date du ticket, passés par la finance le 2 avril. 3 000 € sont des ventes au personnel, dans le 707, hors contrat du mart.

CA attendu = 6 258 000 − 15 000 − 3 000 = 6 240 000 €. Reste inexpliqué = 0 €. Le seuil n'est pas franchi. On écrit les deux lignes dans le journal, avec Camille comme propriétaire du sens. On n'ouvre pas d'incident. Nora présente 6 240 000 €.

</details>

## Exercice 2 : Le filtre sur les retours

Un correctif ajoute `est_retour = non`. Le mart de mars passe à 6 480 000 €. Les ventes brutes hors personnel étaient de 6 480 000 € et les retours de −240 000 €. Calculez le reste, dites s'il franchit le seuil, et écrivez qui vous prévenez.

<details>
<summary>Voir la solution</summary>

Le filtre retire des montants déjà négatifs. Le CA gonfle de 240 000 €. Le CA attendu reste 6 240 000 €, parce que la règle finance (15 000 € et 3 000 €) n'a pas changé. Reste = 240 000 €.

240 000 € dépasse 5 000 € et dépasse 0,5 % (31 290 €). On ne présente pas. Message à Camille (la règle des retours n'a pas changé), à Lina (le modèle a un filtre en trop), à Nora (s'arrêter, dernier CA certifié 6 240 000 €). On ne relève pas le seuil. On retire le filtre.

</details>

## Exercice 3 : Choisir le seuil

Deux propositions circulent. A. Alerter sur chaque euro d'écart, y compris les 18 000 € expliqués. B. Alerter seulement au-delà de 5 % du CA, « le retail est bruité ». Laquelle tenez-vous, et pourquoi le plancher de 5 000 € existe à côté du 0,5 % ?

<details>
<summary>Voir la solution</summary>

Ni A ni B. On alerte sur le reste inexpliqué, dès que ce reste dépasse 5 000 € ou 0,5 % du CA finance. Les 18 000 € nommés restent dans le journal : alerter dessus chaque mois apprend à ignorer l'alerte.

5 % de 6 258 000 € dépasse 300 000 €. Le bug des retours (240 000 €) passerait dessous. Le plancher de 5 000 € attrape un reste modeste que le pourcentage, sur un mois de 6 millions, laisserait filer (0,5 % vaut déjà 31 290 €). Le premier des deux seuils suffit.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Réconcilier le CA
center: "Le mart égale la finance une fois la règle écrite. On alerte sur le reste inexpliqué, pas sur les lignes déjà nommées."
points:
  - icon: scale
    title: Même règle
    text: "HT, magasins intégrés, retours négatifs gardés, ventes au personnel hors mart."
  - icon: money
    title: Mois témoin
    text: "Mart 6 240 000 €. Finance 6 258 000 €. Écart nommé : 15 000 € puis 3 000 €."
  - icon: list
    title: Reste à zéro
    text: "Ce qui a un montant, un mois et un propriétaire n'est pas un incident."
  - icon: gauge
    title: Seuil
    text: "Alerte dès 5 000 € ou dès 0,5 % du CA finance. Le premier des deux suffit."
  - icon: chat
    title: Trois noms
    text: "Camille pour le sens, Lina pour le calcul, Nora pour ne pas présenter."
pitfall: "Relever le seuil le matin de la revue, ou multiplier le HT par 1,20 pour coller à un TTC."
remember: "Filtrer est_retour une deuxième fois gonfle mars de 240 000 €. On retire le filtre, on ne négocie pas le seuil."
```
