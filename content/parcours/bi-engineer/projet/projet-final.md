---
title: "Projet guidé : le mart des ventes Halte"
description: "Projet guidé de 90 minutes : contrat, étoile et tests, couche sémantique et RLS, fraîcheur et certification. Trois exercices, trois solutions de référence, les nombres de mars 2026 sont imposés."
duration: 90
objectives:
  - "Rédiger le contrat du mart Ventes Halte avec grain, mesures, seuil et consommateurs"
  - "Décrire l'étoile, les tests bloquants et le mois témoin"
  - "Poser le taux de marge, la règle de région et l'heure de 7 h"
  - "Dire quand le badge se pose et quand les douze fichiers ont perdu"
---

# Le mandat

Vous êtes Lina Costa, BI Engineer de **Halte**. La direction réseau et les responsables de région veulent les ventes **par magasin** sans que chaque assistant garde son SQL. Nora présentera le lundi à partir de votre couche. Elle ne la redessine pas. Vous ne dessinez pas sa page.

Vous rendez **quatre jalons**, en trois exercices. Les solutions de référence sont sous chaque énoncé. Faites le jalon avant de les ouvrir. Une copie juste retrouve les mêmes nombres et les mêmes refus, même si vos phrases diffèrent.

Les jalons, dans l'ordre : le **contrat**, l'**étoile et les tests**, la **sémantique et la RLS**, la **fraîcheur et la certification**. Le troisième exercice réunit les deux derniers, parce qu'un badge sans heure de fraîcheur et sans droit de Marie ne certifie rien.

# Les chiffres imposés

Mars **2026**, fuseau Europe/Paris, magasins **intégrés** seulement (42), régions Nord, Est, Ouest, Sud. Hors taxes. Les retours sont déjà négatifs. Les franchises sont hors contrat. Les ventes au personnel sont hors mart.

| Repère | Valeur |
| --- | --- |
| Ventes brutes HT hors personnel | 6 480 000 € |
| Retours à la date du ticket | 240 000 € en moins |
| CA HT mart | 6 240 000 € |
| Marge € | 2 184 000 € |
| Quantité nette | 624 000 |
| Taux de marge réseau | 35 % (2 184 000 / 6 240 000) |
| CA N-1, mars 2025, mêmes règles | 6 000 000 € |
| Ouest, 25 % du CA | 1 560 000 € |
| Finance, compte 707, mars, HT | 6 258 000 € |
| Retours du 31 mars passés le 2 avril | 15 000 € |
| Ventes au personnel dans le 707 | 3 000 € |
| Reste inexpliqué attendu | 0 € |
| Seuil sur le reste | 5 000 € ou 0,5 % (31 290 € sur ce 707) |
| Fraîcheur | Avant 7 h, jours ouvrés, témoin `charge_le` |
| Fichiers SQL parallèles au départ | 12 |

Une copie qui « arrondit » le CA à 6,2 millions, qui passe le taux en moyenne de magasins, ou qui met les franchises « pour plus tard » rate le projet. Les nombres ci-dessus sont le réel du cas.

```diagram
type: flow
title: "Quatre jalons, un seul CA"
steps:
  - title: "Contrat"
    text: "Grain, quatre mesures, seuil, 7 h, deux consommateurs"
    tone: violet
  - title: "Étoile"
    text: "Modèles dbt, clés en erreur, reste à 0 €"
    tone: blue
  - title: "Sémantique"
    text: "Taux en ratio, Marie bloquée sur l'Ouest"
    tone: teal
  - title: "Badge"
    text: "Fraîcheur tenue, fiche, zéro fichier en revue"
    tone: amber
  - title: "Retour"
    text: "Si le sens a bougé, on republie le tag précédent"
    tone: rose
```

# Les quatre jalons

**Contrat.** Une page. La question (ventes par magasin pour la direction et les responsables de région). Le grain (ligne de ticket, le magasin est une somme). Les quatre mesures et leurs témoins. La règle finance (6 258 000 − 15 000 − 3 000 = 6 240 000, reste 0, seuil 5 000 € ou 0,5 %). La fraîcheur à 7 h. Le hors cadrage : pas de maquette, pas de flux au fil de l'eau, pas de client, pas de franchise dans le CA. Propriétaires : Camille pour le sens, Lina pour le calcul.

**Étoile et tests.** La liste des modèles, de `stg_caisse__lignes` à `fct_ventes`, plus `ecarts_expliques` au mois. Le filtre unique dans `int_lignes_integrees`. Les tests en erreur : clés, relations, coût non nul, zéro franchise dans le fait, réconciliation. Le contrôle chiffré du mois, Ouest compris.

**Sémantique et RLS.** `ca_ht`, `marge_eur`, `quantite`, `ca_n1` en sommes. `taux_marge` en ratio de deux sommes, 35 % sur le réseau, sans colonne dans le fait. Règle : direction sans filtre, région sur `dim_magasin.region`, absence de région égale à aucune ligne. Trois identités notées. Le segment de page ne sert pas de droit.

**Fraîcheur et certification.** Promesse 7 h, alerte `fraicheur_ventes_halte` à 7 h 05, message à Nora si le mart n'a pas bougé. Fiche de catalogue avec tag. Badge seulement si les témoins, le reste, les droits et la fraîcheur tiennent. Formation de trente minutes. Succès : les 12 fichiers ne servent plus la revue. Canal `#ecarts-mart-halte`.

# Ce que chaque jalon rend

Chaque jalon a un livrable que l'on peut refuser. « J'y ai réfléchi » n'est pas un livrable.

| Jalon | Livrable | On le refuse si |
| --- | --- | --- |
| Contrat | Une page signable par Camille | Le grain est le magasin-mois, ou la TVA se « rattrape » par × 1,20 |
| Étoile | Liste de modèles + tests + sept contrôles | Le 707 est joint dans le fait, ou `unique` est en avertissement |
| Sémantique | Mesures + trois résultats d'identité | Le taux est une moyenne, ou seul l'admin a été testé |
| Badge | Fiche + message de fraîcheur + compte de fichiers | Le badge est là alors qu'un SQL parallèle sert encore le lundi |

Vous ne livrez pas de maquette d'écran. Si une phrase décrit des barres, des couleurs ou un menu, elle est hors copie. Le projet s'arrête à la couche que Nora a le droit de consommer.

# Ce qui fait échouer la copie

Un seul de ces points suffit.

1. CA différent de 6 240 000 €, ou retours retirés une deuxième fois (6 480 000 €).
2. Finance comparée en TTC, ou seuil relevé pour absorber un reste.
3. Grain magasin-mois alors que la quantité et le jour doivent rester sommables.
4. `taux_marge` moyenné par magasin, ou stocké puis moyenné.
5. Marie voit une autre région, ou le test n'a été fait qu'avec un compte admin.
6. Fraîcheur décrite comme « le visuel s'ouvre vite », ou heure absente.
7. Badge posé pendant que l'un des 12 fichiers prépare encore la revue.
8. Une page de tableau de bord à la place d'un jalon. Ce livrable est celui de l'analyste BI, pas celui-ci.

Le retour arrière fait partie du métier : si un jalon sémantique a changé le sens, la copie doit dire que l'on republie le tag précédent, pas que l'on corrige en salle.

# Exercices

## Exercice 1 : Jalon contrat

Rédigez le contrat d'une page : question, consommateurs, grain, quatre mesures avec les témoins, règle finance et seuil, fraîcheur, hors cadrage, propriétaires. Montrez le calcul qui ramène 6 258 000 € à 6 240 000 €.

<details>
<summary>Voir la solution</summary>

Question : ventes par magasin, pour décider le lundi. Consommateurs : direction réseau (quatre régions) et responsables de région. Marie, Ouest, est le cas nommé : 1 560 000 €. Nora prépare, elle ne signe pas le périmètre.

Grain : ligne de ticket. Jour, magasin et produit sont des dimensions. CA, marge et quantité s'additionnent. Le magasin affiché est une somme.

Mesures, mars 2026 : CA HT 6 240 000 € (brut 6 480 000 €, retours −240 000 €, hors personnel, intégrés), marge 2 184 000 €, quantité 624 000, CA N-1 6 000 000 € sur mars 2025 avec la même règle. Écart N-1 : +240 000 €.

Finance : 6 258 000 € HT. Moins 15 000 € (retours du 31 mars pièce au 2 avril, déjà dans le mart). Moins 3 000 € (ventes au personnel, dans le 707 seulement). Attendu mart : 6 240 000 €. Reste : 0 €. Alerte si le reste dépasse 5 000 € ou 0,5 % (31 290 €). On ne multiplie pas par 1,20.

Fraîcheur : avant 7 h, Europe/Paris, jours ouvrés, témoin `charge_le`. Hors cadrage : maquette, flux au fil de l'eau, client, franchises dans le CA. Camille possède le sens, Lina le calcul.

</details>

## Exercice 2 : Jalon étoile et tests

Donnez les modèles dans l'ordre, l'endroit unique du filtre, les tests en erreur, et les contrôles chiffrés (réseau et Ouest). Dites ce que le build doit faire si le CA vaut 6 480 000 €.

<details>
<summary>Voir la solution</summary>

Modèles : `stg_caisse__lignes`, `stg_referentiel__magasins`, `stg_finance__ca_mois` (contrôle, pas la mesure), `int_lignes_integrees`, `dim_date`, `dim_magasin`, `dim_produit`, `fct_ventes` au grain `ligne_id`, `ecarts_expliques` au mois. Le fait relie les dimensions. Il ne joint pas le 707 et ne relie pas un autre fait.

Filtre unique dans `int_lignes_integrees` : `type = integre`, ventes au personnel retirées, `est_retour` non filtré.

Tests en erreur : `unique` et `not_null` sur `ligne_id`, `magasin_id`, `produit_id`, `date_jour`. Relations vers les trois dimensions. Régions et types admis. Zéro franchise dans le fait. `montant_ht`, `quantite` et `cout_ht` non nuls. Réconciliation du reste.

Contrôles : CA 6 240 000 €, marge 2 184 000 €, quantité 624 000, N-1 6 000 000 €, Ouest 1 560 000 €, reste 0 €. Si le CA vaut 6 480 000 €, les retours ont été retirés deux fois : le test de réconciliation échoue, bi-ci est rouge, on ne fusionne pas.

</details>

## Exercice 3 : Jalon sémantique, fraîcheur et badge

Écrivez `taux_marge`, les trois résultats d'identité, le message si `charge_le` date d'hier, et la condition de badge. Indiquez quand vous redéployez le tag précédent, et à quoi vous voyez que les analystes ont adopté la couche.

<details>
<summary>Voir la solution</summary>

`taux_marge` divise la somme de marge par la somme de CA au grain de la question. Réseau : 35 %. Pas de colonne de taux, pas de moyenne des 42 magasins. `ca_n1` est le même CA sur mars 2025, pas février 2026.

Identités : direction 6 240 000 €, Marie (Ouest) 1 560 000 € sans Nord même en export, compte sans région vide. La règle filtre `dim_magasin.region`. Un test admin ne compte pas.

Message, si le mart n'a pas bougé à 7 h 05 : « Ventes Halte n'est pas frais. Dernier charge_le : hier. Promesse : avant 7 h. Ne présentez pas. Dernier jour certifié seulement. » Alerte `fraicheur_ventes_halte`. Une requête en 1 s sur ce mart ne change rien : c'est l'âge qui compte, pas la vitesse.

Badge seulement si les témoins chiffrés tiennent, le reste est à 0 €, les trois identités passent, la promesse de 7 h est tenue ou l'alerte est vraiment partie, la fiche montre le tag, Camille et Lina, et la formation de 30 minutes a eu lieu. On retire le badge si le sens change sans Camille.

Si une promotion fait passer le CA à 6 480 000 €, on republie le tag certifié précédent par `ci-bi`, on ne corrige pas en salle. Adoption : au jour 30, les 12 fichiers SQL ne servent plus la revue. Un export qui retire encore les retours veut dire que le badge est en avance sur l'usage.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Mart des ventes Halte
center: "Quatre jalons, des nombres imposés. 6 240 000 €, Marie à l'Ouest, frais avant 7 h, plus aucun SQL parallèle."
points:
  - icon: file
    title: Contrat
    text: "Ligne de ticket, quatre mesures, seuil 5 000 € ou 0,5 %, Camille et Lina nommées."
  - icon: database
    title: Étoile testée
    text: "Un filtre dans int_lignes_integrees. Clé en double : merge interdit."
  - icon: scale
    title: Taux et RLS
    text: "35 % par division de sommes. Direction, Marie, compte vide : trois tests."
  - icon: clock
    title: Avant 7 h
    text: "charge_le, alerte à 7 h 05, message à Nora. La vitesse de requête est un autre sujet."
  - icon: check
    title: Badge
    text: "Témoins, reste à zéro, droits, fiche. Succès final : 12 fichiers abandonnés."
  - icon: loop
    title: Tag précédent
    text: "Un sens qui bouge en prod se retire par le tag d'avant, pas par une correction en salle."
pitfall: "Livrer une maquette de page, ou certifier pendant qu'un des douze SQL prépare encore le lundi."
remember: "6 258 000 moins 15 000 moins 3 000 égale 6 240 000. Reste 0. Marie voit 1 560 000, pas le réseau."
```
