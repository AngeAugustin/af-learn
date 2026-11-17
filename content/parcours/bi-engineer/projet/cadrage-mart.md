---
title: "Cadrer le mart des ventes Halte"
description: "Avant le SQL, le contrat : le grain de la ligne de ticket, quatre mesures (CA, marge, quantité, N-1), une fraîcheur avant 7 h, et deux consommateurs, la direction et les responsables de région."
duration: 40
objectives:
  - "Nommer la question, les consommateurs et ce qui est hors cadrage"
  - "Choisir le grain ligne de ticket pour des sommes par magasin"
  - "Définir CA, marge, quantité et CA N-1 sur le mois témoin"
  - "Écrire la promesse de fraîcheur à 7 h dans le contrat"
---

# La question et les consommateurs

La direction réseau de Halte pose une question, le lundi : **où en sont les ventes par magasin**. Pas « toutes les données de la caisse ». Quarante-deux magasins intégrés, quatre régions (Nord, Est, Ouest, Sud), un mois que l'on sait déjà lire : mars 2026.

Deux consommateurs signent le contrat. Personne d'autre ne le fait grossir.

- **La direction réseau** voit les quatre régions. Son CA de mars est 6 240 000 €.
- **Le responsable de région** voit sa région. Marie, à l'Ouest, voit 1 560 000 €, soit 25 % du réseau, et pas le CA du Nord.

Nora, analyste BI, s'en sert pour préparer la revue. Elle n'est pas un troisième consommateur qui aurait le droit d'ajouter une mesure « en attendant ». Camille Renard possède le sens du CA. Lina Costa possède le calcul. Le cadrage nomme ces quatre rôles pour qu'une cinquième demande (un export, une franchise, un graphique) sache à qui elle s'adresse, et le plus souvent à qui elle ne s'adresse pas.

> [!IMPORTANT]
> Un consommateur est quelqu'un qui décide avec le chiffre. Une personne qui veut « tout avoir sous la main » n'élargit pas le contrat. Elle ouvre une autre demande, un autre jour.

# Le grain du fait

« Ventes par magasin » est la **question**. Ce n'est pas le grain. Le grain est la ligne la plus fine que l'on stocke, celle dont les sommes ont le droit d'être additionnées.

On retient la **ligne de ticket** : une ligne, un `ligne_id`, rattachée à un jour, un magasin, un produit. Le magasin est une dimension. Le CA du magasin est une somme. Le CA de la région est une somme de magasins. Le CA du réseau est une somme de régions. Les trois montants du contrat (CA, marge, quantité) sont additifs à ce grain.

Le piège inverse est de stocker déjà le magasin-mois, parce que la question prononce le mot magasin. On ne pourrait plus expliquer un jour, ni reconstruire une quantité si on ne l'a pas gardée, ni changer d'avis sur un filtre sans recharger une autre table. Le taux, lui, n'a pas le droit d'être stocké sur la ligne pour être moyenné ensuite : il se calculera dans la couche sémantique.

```diagram
type: flow
title: "Ce que le contrat fige avant le SQL"
steps:
  - title: "Question"
    text: "Ventes par magasin, pour la direction et les régions"
    tone: violet
  - title: "Grain"
    text: "Ligne de ticket. Le magasin est une somme, pas une table figée."
    tone: blue
  - title: "Mesures"
    text: "CA, marge, quantité, N-1 de mars. Le taux attendra la couche."
    tone: teal
  - title: "7 h"
    text: "Avant 7 h, Europe/Paris. charge_le est le témoin."
    tone: amber
  - title: "Hors champ"
    text: "Pas de maquette, pas de flux au fil de l'eau, pas de franchise."
    tone: rose
```

# Quatre mesures et le N-1

Quatre mesures, pas une douzaine. Les nombres de mars 2026 sont le témoin du contrat. Une définition qui ne les retrouve pas n'est pas « une variante » : elle est fausse.

| Mesure | Définition | Mars 2026, réseau |
| --- | --- | --- |
| CA HT | Somme de `montant_ht`. Retours déjà négatifs, conservés. Hors ventes au personnel. Magasins intégrés. | 6 240 000 € |
| Marge € | Somme de `montant_ht - cout_ht`. Un coût manquant est une ligne en erreur, pas un coût à zéro. | 2 184 000 € |
| Quantité | Somme de `quantite`, retours compris (signe négatif). | 624 000 |
| CA N-1 | Le même CA HT, mars 2025, mêmes magasins, mêmes exclusions. | 6 000 000 € |

Les ventes brutes hors personnel font 6 480 000 €. Les retours à la date du ticket font 240 000 € en moins. 6 480 000 − 240 000 = 6 240 000. Filtrer `est_retour = non` casse le témoin.

Le N-1 n'est pas « l'année dernière en vrac ». C'est mars contre mars, HT contre HT, intégrés contre intégrés. Prendre février 2026, ou réinclure les franchises dans le seul N-1, fabrique un écart de croissance imaginaire. L'écart de mars est 6 240 000 − 6 000 000 = 240 000 € de plus que l'an dernier. On le dit ainsi. On ne le mélange pas avec l'écart de réconciliation finance (18 000 € expliqués), qui est un autre sujet.

La marge et la quantité n'ont pas de N-1 dans ce contrat. Si la direction le demande plus tard, ce sera la même règle de calendrier, dans une demande signée. On ne l'ajoute pas au milieu du build.

# La fraîcheur de 7 h

Le contrat porte une heure, pas un adjectif.

- **Promesse** : le mart a bougé avant **7 h**, fuseau Europe/Paris, les jours ouvrés.
- **Témoin** : `max(charge_le)` sur `fct_ventes`.
- **Jour couvert** : les tickets de la veille, clôture magasin.
- **Si ça rate** : Nora ne présente pas le matin. Elle présente le dernier jour certifié. Lina est prévenue.

7 h est choisie parce que la direction et les responsables de région lisent après. Une fraîcheur « dans la matinée » ne se teste pas. Une fraîcheur à 7 h se teste à 7 h 05.

Cette heure ne parle pas de la vitesse du visuel. Un écran lent sur un mart chargé à 6 h 50 tient le contrat. Un écran instantané sur des données de la veille le rate. Le cadrage l'écrit pour que personne n'échange les deux sujets au moment du build.

# Ce qui reste hors cadrage

Le hors cadrage protège les quatre mesures. Il s'écrit dans le même document, avant la liste des idées.

- **La mise en page** des pages et le choix des graphiques. C'est le travail de l'analyste BI, sur le modèle certifié. Le BI Engineer ne cadre pas une maquette.
- **Un flux d'événements au fil de l'eau.** La promesse est un chargement de nuit, tenu à 7 h. On ne l'échange pas contre un bus de messages.
- **Le client, le panier, la fidélité.** Pas de dimension client dans ce mart. Les identifiants personnels ne descendent pas en dev.
- **Les franchises, les ventes au personnel, la TVA.** Dehors, ou alors ce sont des lignes d'écart nommées (3 000 € de personnel, extrait finance déjà HT), pas des colonnes à sommer « au cas où ».
- **Une sixième mesure de confort** (météo, objectif non fourni, stock). Elle attend un consommateur et un témoin chiffré.

La finance reste le point de comparaison du CA : 6 258 000 € HT, moins 15 000 € de retours datés au 2 avril, moins 3 000 € de ventes au personnel. Reste attendu : 0 €. Seuil d'alerte sur le reste : 5 000 € ou 0,5 %. Ce paragraphe est le pont vers la réconciliation. Il ne transforme pas Camille en consommatrice du lundi : elle garde le sens, la direction décide.

# Exercices

## Exercice 1 : Question ou grain ?

Un directeur demande « juste une table par magasin et par mois, ce sera plus simple ». La quantité par jour et le taux de marge sont pourtant dans la conversation. Quel grain écrivez-vous dans le contrat, et que devient le magasin ?

<details>
<summary>Voir la solution</summary>

Le grain est la ligne de ticket (`ligne_id`, jour, magasin, produit). CA, marge et quantité y sont additifs. Le magasin est une dimension : le CA magasin est une somme, pas une table déjà agrégée.

La table magasin-mois répond à la phrase du directeur et perd le jour. Une quantité absente de cette table ne se reconstruit pas. Un taux stocké à ce grain se moyenne ensuite de travers. On le dit dans le contrat, on ne « simplifie » pas le grain pour faire tenir la phrase.

</details>

## Exercice 2 : Les quatre nombres

Écrivez les quatre mesures avec le témoin de mars 2026 et la règle du N-1. Indiquez le CA que l'on obtient si l'on retire les retours déjà négatifs (240 000 € sur 6 480 000 € de brut).

<details>
<summary>Voir la solution</summary>

CA HT : 6 240 000 €, somme de `montant_ht`, retours négatifs gardés, hors personnel, magasins intégrés. Marge : 2 184 000 €, somme de `montant_ht - cout_ht`, coût manquant en erreur. Quantité : 624 000. CA N-1 : 6 000 000 €, même règle sur mars 2025. Écart N-1 : +240 000 €. Ce n'est pas l'écart finance.

Retirer les retours une deuxième fois donne 6 480 000 €. Le témoin est raté. On ne change pas la définition pour coller à ce total.

</details>

## Exercice 3 : Qui consomme, et qu'est-ce qu'on refuse ?

Listez les consommateurs, l'heure de fraîcheur, et trois demandes que le cadrage refuse. Dites où va une demande de « beau tableau pour lundi ».

<details>
<summary>Voir la solution</summary>

Consommateurs : la direction réseau (6 240 000 €, quatre régions) et les responsables de région (Marie, Ouest, 1 560 000 €). Fraîcheur : avant 7 h, Europe/Paris, jours ouvrés, témoin `charge_le`.

On refuse : la maquette des pages, un flux au fil de l'eau à la place du batch de nuit, une dimension client ou les franchises dans le CA. Camille n'est pas consommatrice : elle possède le sens. Nora prépare, elle n'ajoute pas une mesure.

Une demande de beau tableau part vers l'analyste BI, sur ce contrat déjà figé. Elle ne rouvre pas le grain.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Cadrage du mart
center: "Ligne de ticket, quatre mesures, avant 7 h. La direction voit le réseau, Marie voit l'Ouest."
points:
  - icon: users
    title: Deux consommateurs
    text: "Direction : 6 240 000 €. Marie, Ouest : 1 560 000 €. Nora prépare, elle n'élargit pas."
  - icon: ruler
    title: Grain
    text: "La question dit magasin. Le fait est la ligne de ticket. Le magasin est une somme."
  - icon: money
    title: Quatre mesures
    text: "CA 6 240 000 €, marge 2 184 000 €, quantité 624 000, N-1 mars 2025 à 6 000 000 €."
  - icon: clock
    title: Avant 7 h
    text: "Europe/Paris, jours ouvrés. charge_le est le témoin. L'écran rapide ne compte pas."
  - icon: filter
    title: Hors cadrage
    text: "Pas de maquette, pas de flux au fil de l'eau, pas de client, pas de franchise dans le CA."
pitfall: "Stocker le magasin-mois pour faire simple, puis moyenner un taux que l'on ne sait plus reconstruire."
remember: "Retirer les retours déjà négatifs fait 6 480 000 €. Le contrat, lui, reste à 6 240 000 €."
```
