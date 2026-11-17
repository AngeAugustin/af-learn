---
title: "Évaluer ce que le magasin vit"
description: "Tenir un jeu d'exemples métier, un taux d'erreur toléré, une revue humaine, et un écran clair quand le modèle doute."
duration: 40
objectives:
  - "Construire un jeu d'exemples que Karim reconnaît, pas un score abstrait"
  - "Fixer le taux d'erreur toléré et l'erreur qui arrête"
  - "Organiser la revue humaine des premiers matins"
  - "Décider ce que l'utilisateur voit quand le modèle doute"
---

# Un jeu d'exemples métier

Vous n'évaluez pas « l'IA ». Vous évaluez le brief du matin sur des cas que le magasin a déjà vécus. Un score unique, sorti d'un jeu de phrases quelconques, peut être excellent et inutile. Karim ne vit pas un score. Il vit une commande.

Vous constituez un **jeu d'exemples** avec Inès et Karim. Trente matins réels, anonymisés : numéro de commande, magasin, créneau, statut, heure du statut, drapeau « déjà joint ». Pas de nom, pas de téléphone, pas de commentaire libre. Chaque exemple a une attente écrite **avant** de regarder ce que le modèle propose. L'attente est une action, ou le silence.

Cinq familles doivent y être, sinon le jeu ne protège que les matins faciles.

| Famille | Attente du brief |
| --- | --- |
| Créneau pas encore dépassé, statut frais « en tournée » | Pas de retard, pas d'appel |
| Créneau dépassé, statut frais, client pas joint | Appeler |
| Colis encore au magasin, transporteur pas parti | Repasser en préparation |
| Client déjà joint, ou cas déjà chez Hugo | Confier à Hugo, ne pas rappeler |
| Statut de plus de 45 minutes, livré, annulé, autre magasin | Gris, sortie de liste, ou absence. Jamais une action sûre |

Vous ajoutez les cas désagréables exprès : deux commandes proches qu'on pourrait fusionner, un statut « livré » tout récent, un magasin voisin avec un numéro de commande semblable. Un jeu composé seulement de retards évidents félicite le modèle et laisse passer le mélange de magasins.

L'attente se note en langage magasin. « Appeler » ou « se taire ». Pas « réponse pertinente ». Si Inès et Karim ne sont pas d'accord sur l'attente, le cas n'entre pas dans le jeu tant que la règle produit n'est pas tranchée. Évaluer un désaccord de règle comme si c'était une faute du modèle mélange deux sujets. Vous tranchez la règle d'abord.

> [!IMPORTANT]
> L'attente est écrite avant la réponse du modèle. Sinon vous finirez par trouver brillante la phrase que vous venez de lire.

```video
url: https://www.youtube.com/watch?v=TL527yTpxlk
title: "Complete Beginner's Course on AI Evaluations in 50 Minutes (2025) | Aman Khan"
channel: "Peter Yang"
duration: "51:48"
lang: en
why: "Un cours complet pour débutants sur l'évaluation des produits d'IA : jeux d'exemples, critères et revue humaine."
```

# Le taux qu'on tolère

Le jeu sert à poser un taux, pas à admirer des exemples. Vous séparez deux comptes.

**Erreur acceptable.** Oubli d'un retard de moins de vingt minutes. Ligne grise alors qu'un humain très au fait aurait quand même appelé. Ces écarts se comptent, ils ne bloquent pas le pilote à eux seuls. Vous les suivez pour voir s'ils grossissent.

**Erreur inacceptable.** Retard inventé (action « appeler » ou « repasser » alors que l'attente était le silence ou la sortie de liste). Mélange de magasins. Action proposée sur un statut trop ancien. Commande livrée ou annulée encore active. Donnée personnelle apparue dans le texte.

Le seuil que vous proposez à Léa, pour **rester** en pilote : au plus **un** retard inventé confirmé pour **vingt** briefs, et **zéro** mélange de magasins. Un mélange n'entre pas dans le taux. Il arrête le brief du jour. Pour **sortir** du pilote vers d'autres magasins : une semaine complète des quatre pilotes sans retard inventé confirmé, et toujours zéro mélange.

Pourquoi un sur vingt, et pas zéro dès le premier jour ? Parce que vous voulez un seuil que le pilote peut honorer sans pousser l'équipe à cacher les erreurs. Zéro mélange et zéro donnée personnelle, en revanche, ne se négocient pas. Ce ne sont pas des taux. Ce sont des arrêts.

Vous ne publiez pas un pourcentage de « bonnes réponses » qui noie un retard inventé dans trente oublis mineurs. Le chiffre que Léa voit est le nombre d'erreurs inacceptables, avec le cas sous les yeux. Un taux sans exemple est une moyenne qui rassure.

```diagram
type: flow
title: "Du matin réel au seuil"
steps:
  - title: Cas métier
    text: "Trente matins, attente écrite avant la réponse"
    tone: violet
  - title: Deux comptes
    text: "Oubli mineur d'un côté, retard inventé de l'autre"
    tone: amber
  - title: Seuil
    text: "Un inventé pour vingt briefs, zéro mélange"
    tone: rose
  - title: Décision
    text: "Rester en pilote, étendre, ou couper le jour"
    tone: teal
```

Karim confirme l'erreur inacceptable. S'il dit « j'ai appelé quelqu'un qui n'était pas en retard », c'est compté, même si la phrase était élégante. S'il dit « je n'aurais pas téléphoné pour douze minutes », ce n'est pas le même compte.

# La revue humaine des premiers matins

Le jeu d'exemples est une répétition. Le pilote est le vrai matin. Les dix premiers jours ouvrés, personne ne laisse Karim appliquer « appeler » sur la seule foi du brief.

**La revue.** Inès ou Hugo lit les lignes d'action avant que Karim ne décroche. Ils ont le jeu de règles en main : frais ou pas, déjà joint ou pas, bon magasin ou pas. Ils ne réécrivent pas le style. Ils disent si l'action est licite. Dix minutes, pas une nouvelle réunion.

Après ces dix matins, Karim agit, et le bouton « ce n'est pas un retard » reste. La revue ne disparaît pas comme idée : elle revient le jour où une erreur inacceptable est confirmée, le temps de comprendre le cas. Elle ne devient pas un emploi permanent qui relit tout à la place du responsable. Si Hugo doit tout relire chaque matin, vous n'avez pas lancé un assistant. Vous avez ajouté une étape à Hugo.

La revue a un critère d'arrêt clair. Si, pendant ces dix jours, un mélange de magasins ou une donnée personnelle apparaît, le brief est coupé jusqu'à correction du cadre. On ne « finit la semaine pour avoir plus de données ». La revue protège les clients du matin, elle ne sert pas de laboratoire.

Vous dites à Karim, le premier jour, que son désaccord est une information, pas une impolitesse. Sans lui, vous n'avez que l'avis de ceux qui ont écrit la règle.

# Ce que Karim voit quand le modèle doute

Le doute ne se cache pas dans une phrase plus molle. « Il se pourrait que cette commande ait un peu de retard, peut-être pouvez-vous aviser » est une action déguisée. Karim entend « appelle ». Vous interdisez ce flou.

Quand le modèle doute, ou quand la règle de fraîcheur l'y oblige, l'écran fait quatre choses, toujours les mêmes.

1. La ligne reste, pour que le trou soit visible. Une disparition totale ferait croire que la matinée est calme.
2. Elle est grise, avec une seule phrase : « Statut trop ancien, ouvrez la commande. »
3. Aucun bouton d'action. Pas d'« appeler quand même » en petit.
4. L'heure du statut est affichée, pour que Karim voie pourquoi le produit se tait.

S'il n'y a aucune ligne, ni sûre ni grise, l'écran le dit aussi : « Aucun retard connu pour votre magasin ce matin. » Ce n'est pas la même chose que « tout va bien ». La formule « aucun retard connu » laisse la place au statut manquant. « Tout est à l'heure » serait un mensonge si un transporteur n'a rien envoyé.

> [!WARNING]
> Une phrase prudente qui propose encore une action est un doute que vous avez trahi. Le doute se voit par l'absence du bouton.

Vous testez cet écran sur le jeu d'exemples, avec Karim, sans lui expliquer à l'avance. S'il clique là où il n'y a pas de bouton, l'écran est clair. S'il demande « donc j'appelle ? » devant une ligne grise, la phrase est trop longue ou trop suggestive. Vous changez les mots. Vous ne lui demandez pas de se méfier davantage.

Le produit a alors une boucle complète : des exemples avec une attente, un taux qui sépare l'oubli du retard inventé, une revue humaine au début, et un écran qui sait se taire. Sans ces quatre pièces, une démonstration réussie ne vaut pas une autorisation de lancer.

# Exercices

## Exercice 1 : Le jeu trop gentil

Un collègue vous apporte vingt exemples. Tous sont des retards nets, statut frais, bon magasin, client pas joint. Le modèle répond « appeler » vingt fois. Il annonce 100 % et propose de lancer. Que manque-t-il au jeu, et que répondez-vous ?

<details>
<summary>Voir la solution</summary>

Le jeu ne contient que la famille facile. Il manque le créneau pas encore dépassé, le colis encore au magasin, le client déjà joint, le statut trop ancien, le livré, l'annulé, le magasin voisin. Un 100 % là-dessus ne dit rien sur le retard inventé.

Vous refusez le lancement. Vous complétez le jeu avec Karim et Inès, attente écrite avant de relancer le modèle. Le chiffre que vous regarderez ensuite est le nombre de retards inventés et de mélanges, pas le pourcentage de bonnes réponses sur des cas évidents.

</details>

## Exercice 2 : Le seuil noyé

Sur vingt briefs, on compte douze oublis de retards de dix minutes et deux clients appelés alors qu'ils étaient à l'heure. Une synthèse dit : « 14 écarts, le modèle est perfectible mais prometteur. » Comment présentez-vous cela à Léa ?

<details>
<summary>Voir la solution</summary>

Vous séparez les comptes. Les douze oublis de dix minutes sont des erreurs acceptables : en dessous de vingt minutes, ce n'est pas le scandale, et vous les suivez quand même.

Les deux appels à tort sont des retards inventés. Deux pour vingt briefs, c'est au-dessus du seuil d'un pour vingt. Vous ne dites pas « prometteur ». Vous dites que le pilote ne tient pas le seuil, et vous montrez les deux commandes. Aucun pourcentage global ne doit additionner ces deux familles.

</details>

## Exercice 3 : La phrase molle

Le brief affiche : « Retard possible, nous vous invitons à considérer un appel si vous le jugez opportun. » Il n'y a pas de bouton, mais Karim demande si cela veut dire d'appeler. Le statut a cinquante minutes. Que changez-vous à l'écran ?

<details>
<summary>Voir la solution</summary>

Vous remplacez la phrase par « Statut trop ancien, ouvrez la commande. » Vous affichez l'heure du statut. Vous n'ajoutez pas de bouton, même discret.

« Retard possible » et « considérer un appel » sont des actions déguisées. Le doute doit se lire sans interprétation. Vous retestez avec Karim, sans mode d'emploi. S'il demande encore « j'appelle ? », la phrase n'est pas assez sèche, et vous la raccourcissez encore.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Évaluer l'expérience du matin
center: "Des matins réels, deux comptes d'erreur, une revue au début, un écran qui se tait sans phrase molle."
points:
  - icon: list
    title: Jeu métier
    text: "Trente matins, attente écrite avant. Les cas faciles ne suffisent pas. Il faut le gris, le livré, le mauvais magasin."
  - icon: gauge
    title: Deux taux
    text: "Oubli de moins de vingt minutes d'un côté. Un retard inventé pour vingt briefs au plus. Zéro mélange."
  - icon: users
    title: Revue
    text: "Dix matins : Inès ou Hugo lit les actions avant l'appel. Ensuite Karim agit, le bouton d'erreur reste."
  - icon: eye
    title: Doute
    text: "Ligne grise, heure du statut, aucun bouton. « Retard possible » est une action qui n'assume pas son nom."
  - icon: check
    title: Preuve
    text: "Karim confirme l'appel à tort. Une démo sur trois beaux cas n'autorise pas le lancement."
pitfall: "Publier un pourcentage unique qui additionne les petits oublis et les clients appelés pour rien."
remember: "L'attente s'écrit avant la réponse. Le doute se montre par l'absence d'action, pas par une formule prudente."
```
