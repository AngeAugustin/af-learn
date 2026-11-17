---
title: Modéliser les informations
description: "Nommer le bon, la ligne et la décision de réception, leurs attributs et leurs liens, sans dessiner une base."
duration: 60
objectives:
  - Reconnaître le bon, la ligne et la décision comme objets du quai
  - Choisir les attributs qui permettent à Yassine et à Pauline de les reconnaître
  - Écrire les liens en phrases, y compris la ligne jamais saisie
  - Refuser un schéma de tables à la place du vocabulaire de Rouen
---

# Les objets que le quai peut montrer du doigt

Le processus cible dit ce qu'on fait. Il ne dit pas de quoi on parle. Yassine dit « la palette ». Pauline dit « la ligne du soir ». Thomas dit « le bon ». Jonas dit « l'écart non tracé ». Quatre mots, parfois la même chose, parfois non.

Trois objets suffisent, plus ce qui les détaille.

- Le **bon** : ce que l'entrepôt annonce, pour un magasin, pour une livraison. Thomas le constitue. Le magasin ne le réécrit pas.
- La **ligne** : un produit sur ce bon, avec une quantité annoncée.
- La **décision** : ce que le quai a conclu sur cette ligne, avant le départ du chauffeur. Acceptée, refusée, ou mise de côté.

Vous ne partez pas des colonnes du terminal Quai, ni de celles du tableur. Vous partez de ce que Yassine peut poser sur la table : le bon, la sonde, le carnet. Si un objet n'a pas d'exemple dans la main à Rouen, il est trop tôt.

# Les attributs qui font reconnaître

Un attribut est un renseignement sans lequel on confond deux objets. Vous le nommez comme au quai.

**Bon.** Magasin (Rouen), date, heure d'arrivée, transporteur seulement s'il sert à retrouver la livraison. Le numéro que Thomas et Yassine citent déjà. Pas un identifiant inventé pour une base.

**Ligne.** Produit, famille (sec, frais, surgelé), quantité annoncée sur le bon. Pour le surgelé, la température à cœur constatée. Pour le frais, la vie restante. Sans la famille, la règle de Jonas ne sait pas quelle question poser. Le sec n'a pas de température. Lui en inventer une, c'est créer un objet faux.

**Décision.** Issue : acceptée, refusée, mise de côté. Quantité acceptée. Motif, obligatoire si l'issue n'est pas une acceptation simple. Heure. Nom de celui qui a décidé (Yassine). La quantité acceptée d'un refus température est zéro. La garder implicite, c'est laisser Pauline deviner le soir.

Le motif n'est pas une phrase libre. « Un peu mou » n'est pas un motif. Les motifs que le métier sait relire sont courts : température, casse, manquant, DLC, non commandé. Une ligne dont la quantité acceptée diffère de la quantité annoncée, sans l'un de ces motifs, est précisément l'écart non tracé de Jonas : elle compte dans les 2 sur 5, et dans les 980 € par magasin et par mois.

```diagram
type: layers
title: Du bon jusqu'à la décision
layers:
  - title: Bon
    text: "Ce que l'entrepôt annonce, pour un magasin, un jour."
    items:
      - "Rouen, lundi, camion au quai"
      - "Le magasin ne réécrit pas le bon"
  - title: Ligne
    text: "Un produit, une famille, une quantité annoncée."
    items:
      - "Surgelé, température à cœur"
      - "Frais, vie restante. Le sec n'a pas de sonde"
  - title: Décision
    text: "Issue, quantité acceptée, motif, heure, nom."
    items:
      - "Refusée, accepté à zéro, motif température"
      - "« Un peu mou » n'est pas un motif"
```

```video
url: https://www.youtube.com/watch?v=xsg9BDiwiJE
title: "Entity Relationship Diagram (ERD) Tutorial - Part 1"
channel: "Lucid Software"
duration: "6:10"
lang: en
why: "Les bases du diagramme entité-association : entités, attributs et relations."
```

# Les liens, dits en phrases

Un lien se lit comme une phrase que Pauline peut contredire.

- Un bon porte **plusieurs lignes**. Le lundi de Rouen n'est pas « une palette ». C'est un bon, et onze de ses lignes différaient du physique.
- Une décision se rapporte à **une ligne de ce bon**. Elle ne flotte pas « sur Rouen ».
- Une ligne peut n'avoir **aucune décision**. C'est le trou d'aujourd'hui : sept lignes sur les onze restaient au carnet. Dans le modèle cible, ce trou doit se voir. Vous ne le masquez pas en fusionnant bon et décision.
- Une décision de refus ou de mise de côté **n'est pas une entrée en stock**. Jonas le dit déjà : quantité acceptée à zéro, rien en stock, ce n'est pas un écart de stock, c'est un refus. Le modèle garde les deux, sinon on « améliore » l'indicateur en refusant moins, ou on le dégrade en refusant bien.
- Le bon reste la référence des quantités annoncées. La décision ne le corrige pas. Elle constate.

Vous ne créez pas un objet « magasin » tant que Rouen n'est qu'un nom sur le bon. Le jour où il faudra la liste des quais, vous le promouvrez. Pas avant. Le carnet noir n'est pas un objet cible. C'est le contournement. Le mettre au centre du modèle officialise l'oubli.

# Le lundi de Rouen, posé sur les objets

Vous rangez le constat, sans inventer de table.

| Objet | Ce qu'on inscrit |
| --- | --- |
| Bon | Rouen, lundi, arrivée dans la plage 5 h 30 à 9 h 30 |
| Lignes en écart | Onze lignes dont le physique ne suit pas le bon |
| Décisions tracées le soir seulement | Quatre, trop tard pour le chauffeur et pour Thomas |
| Décisions absentes | Sept, carnet ou mémoire, dans les 2 sur 5 non saisis |
| Deux lignes surgelé | Température constatée -16 °C |
| Décision cible de ces deux lignes | Refusée, quantité acceptée zéro, motif température |

Les 980 € ne sont pas un objet de plus. C'est le montant que Jonas estime, par magasin et par mois, derrière les lignes sans décision. Vous le citez comme l'effet du trou. Vous ne le saisissez pas à la main sur une ligne, à la place du motif.

Claire n'a pas, dans ce modèle, un quatrième objet « appel ». Son besoin est une lecture : avant 10 h, les décisions de refus frais et leur motif. Si les décisions existent, la liste existe. Si vous créez un objet « appel de Claire » avant d'avoir les décisions, vous modélisez le contournement.

> [!IMPORTANT]
> Une ligne sans décision n'est pas une ligne acceptée. C'est le trou que Pauline colmate le soir, et que Jonas compte comme non tracé.

# Ce qui n'est pas un schéma de base

Omar pourra, le jour où l'on construit, parler de clés et de messages vers la caisse. L'éditeur de caisse ne change pas dans ce besoin. Vous ne dessinez donc pas la caisse. Vous dites seulement le lien utile : la quantité qui pourra bouger le stock est la quantité acceptée, pas la quantité du bon.

Vous n'écrivez pas qu'une décision est « nullable ». Vous écrivez qu'une ligne peut n'en avoir aucune, et que ce vide est le sujet d'EM-02. Le mot du métier est « non tracée », pas un drapeau technique.

Vous ne fusionnez pas bon et décision « parce que le tableur n'a qu'un onglet ». Le camion peut être arrivé et la décision absente. C'est le lundi. Un seul bloc « livraison » ne sait pas le dire, et les 12 magasins au tableur continueront de s'écraser un onglet sans qu'on voie le trou.

Le test est oral. Vous montrez à Yassine les deux palettes, à Pauline les sept lignes sans décision, à Jonas la frontière entre refus et écart. Chacun retrouve ses mots. Si Pauline demande « où est ce que j'invente le soir ? », vous montrez l'absence de décision, pas une colonne de correction.

# Exercices

## Exercice 1 : Ranger le lundi

On vous tend : « Rouen, onze lignes, quatre saisies le soir, sept au carnet, deux palettes à -16 °C, un peu mou. » Rangez chaque élément dans l'objet qui doit le porter. Dites ce qui n'est pas un motif.

<details>
<summary>Voir la solution</summary>

Bon : Rouen, ce lundi. Lignes : onze écarts entre le physique et l'annoncé, dont deux surgelés à -16 °C. Décisions tardives : quatre, le soir, après le départ. Décisions absentes : sept. Ce vide est l'écart non tracé, pas une acceptation.

« Un peu mou » n'est pas un motif et n'est pas une décision. La décision cible de ces deux lignes est : refusée, quantité acceptée zéro, motif température. Le bon, lui, n'est pas réécrit.

</details>

## Exercice 2 : Le refus et l'écart

Jonas rappelle : un refus bien sorti du bon, quantité acceptée à zéro, rien en stock, n'est pas un écart de stock. Un collègue veut une seule case « anomalie ». Que casse-t-il ?

<details>
<summary>Voir la solution</summary>

Il mélange le refus et l'écart. Le refus tenu (zéro accepté, rien en stock, motif température) n'entre pas dans les 4,6 % de la même façon qu'une ligne jamais saisie. Une seule case « anomalie » félicite ou pénalise le mauvais geste : refuser bien pourrait gonfler le taux, ou disparaître dedans.

Vous gardez la décision (issue, quantité acceptée, motif) séparée du bon. L'écart de Jonas naît quand l'accepté et le stock du jour ne se rejoignent pas, ou quand la ligne n'a pas de décision. Le refus propre n'est pas ce trou.

</details>

## Exercice 3 : Refuser la table

On vous propose `ligne_id, flag_mou, qte_null, magasin_fk`. Que gardez-vous pour Yassine, Pauline et Jonas, et que laissez-vous pour plus tard ?

<details>
<summary>Voir la solution</summary>

Pour le métier : bon, ligne (famille, quantité annoncée, température si surgelé, vie restante si frais), décision (acceptée, refusée ou mise de côté, quantité acceptée, motif dans la liste, heure, nom). Une ligne peut n'avoir aucune décision. Ce vide se voit.

Vous ne validez pas `flag_mou` : « un peu mou » n'est pas un motif. La clé technique et la caisse attendront qu'une option soit tranchée. Le numéro que Thomas cite est celui du bon, pas un identifiant invisible.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Objets de la réception
center: "Le bon annonce, la ligne décrit, la décision tranche. Une ligne sans décision est le trou, pas une acceptation."
points:
  - icon: file
    title: Bon
    text: "Rouen, le lundi, les quantités de Thomas. Le magasin ne le réécrit pas."
  - icon: list
    title: Ligne
    text: "Famille, quantité annoncée. Température si surgelé, vie restante si frais."
  - icon: check
    title: Décision
    text: "Acceptée, refusée ou mise de côté. Motif, heure, nom. « Un peu mou » ne compte pas."
  - icon: link
    title: Trou
    text: "Sept lignes sans décision. Ce vide est le non tracé, celui des 980 €."
  - icon: database
    title: Pas une base
    text: "On refuse clés et drapeaux à la place des mots de Yassine et de Jonas."
pitfall: "Fusionner le bon et la décision dans un onglet, puis ne plus voir qu'une ligne n'a pas été tranchée."
remember: "Un refus à zéro en stock n'est pas un écart. Une ligne sans motif, si."
```
