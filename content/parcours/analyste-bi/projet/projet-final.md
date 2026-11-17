---
title: "Projet final : piloter un réseau de magasins"
description: "Projet guidé : à partir de sources fictives, construire le modèle, les mesures, la page de direction et les critères de réussite d'un réseau de quarante-deux magasins."
duration: 90
objectives:
  - Relier des sources fictives à une étoile sans double compte
  - Figer six mesures sur un mois témoin et une région
  - Maquetter une page de direction certifiable, avec droits par région
  - Tenir les trois jalons avec les critères de réussite du projet
---

# Le mandat

Vous pilotez **Halte**, enseigne fictive de quarante-deux magasins intégrés de jardin et de maison, répartis en quatre régions (Nord, Est, Ouest, Sud). La direction réseau se réunit **le lundi, quinze minutes**, pour décider si le mois tient face à l'objectif de chiffre d'affaires et de marge, et quels magasins appeler pour rupture.

Le projet n'est pas « un dashboard de toutes les données ». Il est réussi quand la salle peut trancher sur **une** page, branchée sur **un** jeu dont les totaux sont ceux de la fiche, et quand un directeur régional ne voit pas les autres régions.

Vous travaillez en trois jalons. Chacun a une solution de référence plus bas. Ne passez pas au suivant si les nombres du mois témoin ne tombent pas.

Mois témoin : **mars 2026**. Fuseau : Europe/Paris. Devise : euro. Hors taxes. Retours déjà signés dans le montant.

# Les sources fictives

Cinq tables, comme si elles venaient de l'entrepôt. Les volumes sont ceux d'un réseau réel réduit, les pièges sont volontaires.

| Source | Grain | Colonnes qui comptent | Piège |
| --- | --- | --- | --- |
| `ventes` | Ligne de ticket | date, magasin_id, produit_id, ticket_id, montant_ht, cout_ht | Les retours sont négatifs. Un drapeau `est_retour` existe aussi : ne pas les retirer une seconde fois |
| `magasins` | Magasin | magasin_id, nom, region, type | `type` vaut `integre` ou `franchise`. Les franchises sont hors contrat |
| `produits` | Produit | produit_id, famille | Sert à expliquer, pas à porter l'objectif |
| `objectifs` | Mois × magasin | mois, magasin_id, objectif_ca, objectif_marge | Une ligne `magasin_id = TOTAL` double le réseau si on la somme |
| `stock` | Jour × magasin × produit | date, magasin_id, produit_id, en_rupture, suivi | Seules les lignes `suivi = oui` entrent dans le taux |

Il n'y a pas de table de tickets à part : le ticket est le `ticket_id` des ventes. Il n'y a pas d'objectif par produit ni par jour. L'historique couvre mars 2025 et mars 2026, assez pour le N-1, pas « dix ans ».

Repères du mois témoin, **magasins intégrés seulement**, ligne TOTAL exclue, mars 2026 :

- CA HT : **6 240 000 €**
- Marge € : **2 184 000 €**
- Tickets distincts : **208 000**
- Panier : **30 €**
- CA N-1 (mars 2025, mêmes règles) : **6 000 000 €**
- Objectif CA : **6 500 000 €**
- Taux de rupture : **3,2 %** (seuil d'alerte 4 %)

L'Ouest pèse **25 %** du CA témoin, soit **1 560 000 €**. C'est le chiffre que doit voir Marie, directrice Ouest, et aucun autre CA régional.

> [!IMPORTANT]
> Si votre CA tombe sur environ le double, vous avez sommé la ligne TOTAL ou laissé les franchises. On ne « ajuste » pas. On refiltre.

# Le modèle attendu

Une étoile, trois faits, trois dimensions.

- **dim_date**, **dim_magasin** (région, type), **dim_produit** (famille).
- **fait_ventes** au grain ligne de ticket, lié aux trois dimensions.
- **fait_objectifs** au grain mois × magasin, lié au mois et au magasin, **sans** la ligne TOTAL, **sans** les franchises.
- **fait_stock** au grain jour × magasin × produit, lignes `suivi = oui` seulement, mêmes exclusions de magasins.

Les relations vont des faits vers les dimensions. Les faits ne sont pas reliés entre eux. Le type franchise est filtré dans le modèle (ou les franchises sont absentes des dimensions de pilotage), pas « à la charge du lecteur qui pensera à décocher ».

Le numéro de ticket ne devient pas une dimension reliée au stock. L'objectif n'est pas recopié sur les ventes.

# Les mesures

Six mesures, les mêmes définitions que dans le cas retail du parcours, appliquées à Halte.

1. **CA HT** : somme de `montant_ht`. Les négatifs restent. On n'ajoute pas un filtre `est_retour = non`.
2. **Marge €** : somme de `montant_ht - cout_ht`. Un coût manquant est une ligne en erreur, pas un coût à zéro.
3. **Panier moyen** : CA HT / nombre distinct de `ticket_id`, au grain de la case.
4. **CA N-1** : le CA HT sur le même mois un an plus tôt, mêmes magasins intégrés. Écart = CA HT − CA N-1.
5. **Objectif CA** : somme de `objectif_ca` sur le fait objectifs. Écart = CA HT − objectif. Vide au grain produit.
6. **Taux de rupture** : lignes `en_rupture = oui` / lignes observées (`suivi = oui`), ratio des comptes, pas moyenne des taux quotidiens. Seuil 4 % écrit à côté, pas dans la formule.

Le taux de marge (marge / CA) peut accompagner la carte marge. Il ne remplace pas la marge en euros, parce que l'objectif de marge du fichier est en euros (`objectif_marge`). On peut donc aussi montrer l'écart de marge en euros. Ne créez pas un septième indicateur de tête s'il n'entre pas dans les quatre cartes.

Contrôle minimum avant la page : les sept nombres de la fiche (six mesures et le compte de tickets), puis le CA Ouest à 1 560 000 €. Un panier réseau différent de 30 € veut dire un mauvais distinct ou des franchises encore là.

# La page de direction

Une page, pas un portail.

- Bandeau : « Halte, cap de mars 2026 », fraîcheur, pied de périmètre « magasins intégrés, hors franchises, HT, retours nets ».
- Quatre cartes : CA HT et écart à l'objectif (6 240 000 contre 6 500 000, soit **−260 000 €**), marge €, panier 30 €, écart N-1 (**+240 000 €**, +4 %).
- Barres des quatre régions triées par écart à l'objectif. L'œil va à la région qui pèse.
- Taux de rupture 3,2 % avec le texte « seuil 4 % », puis la liste des seuls magasins au-dessus du seuil, pas les quarante-deux.
- Pas de camembert de familles, pas de jauge, pas des lignes de tickets.

La page régionale de Marie est **la même** au filtre près : elle ne voit que l'Ouest, son CA de 1 560 000 €, et elle ne peut pas afficher le Nord. On ne lui envoie pas une copie du fichier.

```diagram
type: flow
title: "Ce que le lundi doit pouvoir conclure"
steps:
  - title: Fraîcheur
    text: "Le chargement de la nuit est passé, ou l'on s'arrête"
    tone: blue
  - title: Verdict
    text: "CA sous l'objectif de 260 k€, marge lue à côté"
    tone: violet
  - title: Cause
    text: "La région qui porte l'écart, en barres"
    tone: teal
  - title: Risque
    text: "Rupture sous le seuil réseau, magasins au-dessus listés"
    tone: amber
  - title: Demande
    text: "Tenir, appeler, ou ne rien ouvrir"
    tone: rose
```

# Les critères de réussite

Le projet est réussi si **tous** les points suivants sont vrais. Un beau visuel ne compense pas un total faux.

1. **Sources.** Franchises exclues, ligne TOTAL exclue, retours non double-comptés, stock limité au `suivi = oui`.
2. **Étoile.** Trois faits aux bons grains, objectif non dupliqué sur les tickets.
3. **Mois témoin.** Les repères de mars 2026 tombent juste, et l'Ouest est à 1 560 000 € de CA.
4. **Page.** Une page de direction, hiérarchie lisible, fraîcheur et périmètre écrits, seuil de rupture en mots.
5. **Droits.** Marie voit l'Ouest seulement, y compris en changeant un filtre ou en exportant. Un compte sans région ne voit rien. Le rôle direction voit le réseau.
6. **Adoption.** Un déroulé de quinze minutes existe : trois chiffres, l'écart, une demande. L'annexe porte la méthode. La fiche nomme un propriétaire et une date de revue.

Les trois exercices sont les jalons. La solution de référence dit le résultat attendu, pas seulement l'intention.

# Exercices

## Exercice 1 : Jalon modèle

Décrivez le modèle que vous chargez pour Halte : quels filtres à l'entrée, quel fait porte quoi, quelle relation vous refusez. Expliquez le CA doublé que vous obtiendriez en oubliant deux pièges précis des sources.

<details>
<summary>Voir la solution</summary>

Filtres à l'entrée : `magasins.type = integre`, et suppression (ou exclusion) de `objectifs.magasin_id = TOTAL`. Stock : `suivi = oui` seulement. Ventes : on garde les montants négatifs, on ne filtre pas `est_retour`.

Faits : ventes (ligne de ticket), objectifs (mois × magasin), stock (jour × magasin × produit). Dimensions : date, magasin, produit. Relations fait vers dimension seulement.

Deux pièges qui doublent ou gonflent : sommer la ligne TOTAL **avec** les magasins (l'objectif, et parfois un CA s'il a été mis sur cette ligne) ; laisser les franchises dans la dimension et donc dans les sommes. Un troisième piège, différent, retire les retours alors qu'ils sont déjà négatifs : le CA devient trop grand, il ne double pas forcément.

On refuse de relier le stock au `ticket_id` et de copier l'objectif sur chaque ligne de vente.

</details>

## Exercice 2 : Jalon mesures

Donnez les six valeurs du mois témoin et le CA que Marie doit voir. Écrivez, pour le panier, le N-1 et la rupture, la définition en une phrase et l'erreur classique que votre contrôle doit déjouer.

<details>
<summary>Voir la solution</summary>

Réseau, mars 2026, intégrés : CA HT 6 240 000 €, marge 2 184 000 €, panier 30 € (208 000 tickets), CA N-1 6 000 000 €, objectif CA 6 500 000 €, taux de rupture 3,2 %. Marie (Ouest) voit un CA de 1 560 000 €, pas le réseau.

- Panier : CA HT / tickets distincts au grain de la case. Erreur : compter les lignes, ou moyenner des paniers par famille ou par jour.
- N-1 : même CA, mars 2025, mêmes règles (intégrés, retours nets). Erreur : prendre février 2026, ou un N-1 qui réinclut les franchises.
- Rupture : comptes des lignes en rupture sur lignes suivies. Erreur : moyenne de  taux quotidiens, ou rupture devinée depuis les ventes. Seuil 4 % à côté du 3,2 %, le réseau n'est pas en alerte globale.

L'écart à l'objectif est 6 240 000 − 6 500 000 = −260 000 €. L'écart N-1 est +240 000 €. Ces deux écarts ne se compensent pas dans une seule phrase floue : on est sous l'objectif **et** au-dessus de l'an dernier.

</details>

## Exercice 3 : Jalon page, droits et adoption

Décrivez la page du lundi, le test de droits de Marie, et le déroulé de la première revue (quinze minutes). Indiquez ce qui ferait échouer le projet même si les graphiques sont terminés.

<details>
<summary>Voir la solution</summary>

Page : bandeau (Halte, mars 2026, fraîcheur, périmètre intégrés HT), quatre cartes (CA vs objectif −260 k€, marge 2 184 k€, panier 30 €, N-1 +240 k€), barres de régions par écart à l'objectif, rupture 3,2 % avec seuil 4 % en toutes lettres, liste seulement des magasins au-dessus du seuil.

Droits : avec le compte de Marie, le CA affiché est 1 560 000 €. Aucun filtre, aucun drill, aucun export ne montre le Nord, l'Est ou le Sud. Un compte absent de la table de droits ne voit rien. Le compte direction voit 6 240 000 €. Le test fait avec le seul compte administrateur **ne compte pas**.

Revue : minute 1 fraîcheur, minutes 2 à 5 verdict (sous l'objectif, au-dessus de N-1), minutes 5 à 10 la région qui porte l'écart, minutes 10 à 15 une demande (tenir, appeler les magasins en rupture, ou ne rien ouvrir) notée avec un nom. Méthode en annexe. Pas de pièce jointe.

Échecs qui annulent le projet : totaux différents de la fiche, objectif multiplié par les lignes, Marie qui voit le réseau, page incompréhensible sans la couleur, revue qui lit quarante pages, badge sans propriétaire ni date. Un camembert réussi n'est pas un critère.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Piloter le réseau Halte
center: "Mois témoin juste, page unique, Marie ne voit que l'Ouest, le lundi tient en quinze minutes."
points:
  - icon: database
    title: Sources piégées
    text: Hors franchises, sans la ligne TOTAL, retours déjà négatifs, stock suivi seulement.
  - icon: layers
    title: Trois faits
    text: Ventes, objectifs au mois × magasin, rupture au jour. Pas d'objectif sur les tickets.
  - icon: money
    title: Repères de mars
    text: "CA 6,24 M€, objectif 6,50 M€, N-1 6,00 M€, panier 30 €, rupture 3,2 %."
  - icon: lock
    title: Compte de Marie
    text: L'Ouest à 1,56 M€. Le test avec le compte admin ne prouve pas le droit.
  - icon: users
    title: Le lundi
    text: Fraîcheur, écart, une demande notée. L'annexe porte la méthode, pas la salle.
  - icon: check
    title: Réussi si
    text: Les six critères tiennent ensemble. Un beau visuel ne rattrape pas un total faux.
pitfall: Sommer la ligne TOTAL ou laisser les franchises. Le CA « à peu près le double » n'est pas un arrondi.
remember: Sous l'objectif de 260 k€ et au-dessus de N-1 de 240 k€. Les deux phrases restent, elles ne s'annulent pas.
```
