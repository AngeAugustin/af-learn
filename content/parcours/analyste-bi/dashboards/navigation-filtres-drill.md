---
title: Navigation, filtres et exploration
description: "Filtres de page et filtres de visuel, exploration détaillée, signets et personnalisation : guider la lecture sans couvrir la page de segments."
duration: 40
objectives:
  - Distinguer un filtre global d'un filtre propre à un visuel
  - Concevoir une exploration détaillée qui garde le contexte
  - Utiliser les signets pour des états de page, pas pour empiler des vues
  - Limiter les segments visibles à ce qui sert la décision
---

# Un parcours, pas un tableau de commande

La navigation est le chemin que le lecteur emprunte **sans se perdre**. Il arrive sur un verdict, comprend le périmètre, puis descend vers la cause ou le détail. Chaque contrôle (filtre, lien, signet) doit répondre à une question qu'il se pose vraiment.

Si la page ressemble à un cockpit d'avion, le lecteur passe son temps à régler les boutons et ne décide plus. On conçoit d'abord le parcours avec les filtres par défaut (le mois en cours, son périmètre), et seulement ensuite les écarts qu'il a le droit d'explorer.

Trois gestes suffisent souvent :

1. changer le **périmètre** (région, mois) ;
2. voir **pourquoi** (une répartition) ;
3. ouvrir le **détail** d'une exception (un magasin, une famille).

Le reste est secondaire. Il peut exister, mais pas en permanence sous les yeux.

# Filtre global ou filtre de visuel

Un **filtre global** (page ou rapport) change le périmètre de lecture : « je parle de l'Ouest, en mars ». Il s'applique à tous les visuels qui partagent cette question, y compris les cartes d'indicateurs. Le lecteur doit voir **quels filtres sont actifs**, pas les découvrir au survol.

Un **filtre de visuel** ne concerne qu'un graphique. Il sert à exclure un bruit local (masquer « non renseigné » sur une répartition) sans changer le verdict du haut de page. S'il contredit le filtre global, la page dit deux choses à la fois : le chiffre d'affaires de l'Ouest en haut, et un graphique qui inclut encore l'Est.

| | Filtre global | Filtre de visuel |
| --- | --- | --- |
| Effet | Tout le récit change de périmètre | Un seul graphique s'ajuste |
| Visible | Oui, en tête, avec les valeurs actives | Souvent discret, documenté si piégeant |
| Exemple | Mois, région, enseigne | Exclure une modalité technique |
| Risque | Trop de segments en tête de page | Un graphique qui ne suit plus le titre |

Posez les filtres dans un ordre stable d'une page à l'autre : temps, puis géographie, puis famille. Le lecteur apprend le geste une fois.

> [!WARNING]
> Un filtre de visuel invisible qui contredit le titre est une des premières causes de « le dashboard est faux ». Si le graphique est volontairement différent, écrivez-le (« France entière, pour comparaison »).

# L'exploration détaillée

L'**exploration détaillée** (drill-through) ouvre une autre page **en emportant le contexte** : on clique une région sur la page comité, on arrive sur la page région, filtrée sur cette région, avec le même mois.

Ce n'est pas un simple lien vers une page vierge, et ce n'est pas non plus un niveau de plus dans le même graphique (cela, c'est un drill-down : année, puis mois, puis jour, dans le même visuel).

Une page cible d'exploration réussie :

- reprend les filtres transmis et les **affiche** ;
- répond à une question plus fine (« quels magasins expliquent l'Ouest ? ») ;
- offre un retour explicite vers la page d'origine ;
- ne redemande pas au lecteur de resaisir le mois et la région.

On limite les cibles. Une page comité qui peut explorer vers quinze destinations devient un menu. Deux ou trois destinations (région, magasin, famille) couvrent presque toutes les revues.

Le drill-down dans un visuel reste utile pour le temps (mois, puis semaine). Il est piégeux pour des hiérarchies bancales (famille vers produit sans effectif) : le lecteur croit « descendre » et tombe sur un grain où la mesure n'a plus le même sens. Si le panier moyen change de définition en descendant, arrêtez la descente et changez de page, avec une phrase qui le dit.

# Les signets

Un **signet** (bookmark) enregistre un état de la page : filtres, visuels masqués, focus. Il sert à raconter **deux ou trois situations préparées**, pas à remplacer une navigation.

Usages justes :

- « Vue comité » et « vue préparation » de la même page (la seconde montre les contrôles, la première les cache) ;
- un scénario comparé (« avec la promo » / « sans la promo ») si les deux états ont été vérifiés ;
- le retour à l'état par défaut en un geste, en réunion, quand quelqu'un a déréglé les filtres.

Usages qui dérapent :

- douze signets qui sont en réalité douze rapports déguisés ;
- un signet qui capture un filtre personnel et que l'on partage comme s'il était officiel ;
- un signet dont le libellé ne dit pas ce qu'il change (« Signet 3 »).

Nommez le signet comme une vue : « Défaut, mois en cours », « Écarts de marge seulement ». En réunion, la personne qui présente sait lequel rappeler.

# La personnalisation, sans casser le chiffre

La **personnalisation** laisse au lecteur un geste qui lui appartient : enregistrer son signet, épingler sa région, choisir les colonnes d'un tableau. Elle ne lui laisse pas redéfinir le chiffre d'affaires.

Ce qui peut être personnel :

- le périmètre de départ (sa région, son magasin), dans la limite de ses droits ;
- l'ordre de colonnes d'une liste opérationnelle ;
- un signet privé pour sa revue du lundi.

Ce qui reste commun :

- la définition des mesures ;
- les seuils officiels (le rouge « rupture » n'est pas au choix de chacun) ;
- la page certifiée que le comité commente.

Une vue personnelle se distingue visuellement d'une vue certifiée (un libellé « ma vue », pas le badge du jeu officiel). Sinon, deux managers arrivent en réunion avec deux « pages comité » qui ne sont plus la même.

# Quinze segments, c'est une page qui a renoncé

Chaque segment (slicer) visible est une question posée au lecteur avant même le chiffre. Cinq segments utiles valent mieux que quinze « au cas où ». Au-delà, les gens n'en utilisent que deux, et les autres ralentissent la page, se contredisent, et poussent le verdict sous la ligne de flottaison.

```diagram
type: flow
title: "Que faire d'un filtre demandé en plus"
steps:
  - title: Sert la décision
    text: "Il change le périmètre de la phrase du titre"
    tone: teal
  - title: Déjà couvert
    text: "Mois, région, enseigne : on n'ajoute pas un doublon"
    tone: blue
  - title: Rare mais légitime
    text: "On le met dans le volet de filtres, pas en vitrine"
    tone: amber
  - title: Exploration
    text: "Plutôt un drill-through que dix segments permanents"
    tone: violet
  - title: Hors sujet
    text: "On le refuse, ou on ouvre une autre page"
    tone: rose
```

Gardez en vitrine le temps et le périmètre organisationnel. Le produit, le fournisseur ou le canal arrivent quand la question de la page est vraiment celle-là. Pour une revue mensuelle de marge, le filtre « couleur du packaging » n'a pas sa place en tête, même si quelqu'un l'a demandé une fois.

> [!TIP]
> Comptez les segments visibles sur la page par défaut. S'il y en a plus de cinq, rayez-en jusqu'à pouvoir justifier chacun par un mot de la décision.

# Exercices

## Exercice 1 : Ranger les filtres

Une page « Marge du mois » affiche quinze segments : année, mois, semaine, jour, région, secteur, magasin, vendeur, famille, sous-famille, marque, couleur, fournisseur, canal, et « hors zéros ». La direction s'en plaint. Proposez le dispositif par défaut et où va le reste.

<details>
<summary>Voir la solution</summary>

**En vitrine (filtre global)** : mois (le temps de la décision) et région (le périmètre du comité). L'enseigne si elle change vraiment le récit. On affiche les valeurs actives.

**Pas en doublon** : année, semaine et jour en même temps que le mois. Le temps se descend par drill-down ou par la page détail, pas par quatre segments.

**Volet de filtres, masqué par défaut** : famille, canal. Utiles pour une question de suivi, pas pour le verdict.

**Exploration détaillée** : magasin, vendeur, fournisseur. On y va depuis une ligne d'exception, le contexte (mois, région) est transmis.

**Filtre de visuel, documenté** : « hors zéros » seulement s'il corrige un bruit technique, avec une note. Sinon il change le total en cachette.

**Refus ou autre page** : couleur, sous-famille, marque, sauf décision explicite. Ils ne répondent pas à « la marge du mois est-elle tenue ? ».

</details>

## Exercice 2 : Un drill-through qui perd le fil

Depuis la page comité filtrée sur mars et l'Ouest, un clic sur « détail magasins » ouvre une page où le mois est « toute l'année » et la région « toutes ». Le lecteur croit voir l'explication de l'écart affiché au-dessus. Que corrigez-vous ?

<details>
<summary>Voir la solution</summary>

La page cible doit **recevoir et montrer** mars et l'Ouest. Le titre ou le bandeau répète ce contexte (« Magasins de l'Ouest, mars »). Un bouton ramène à la page comité sans perdre ces filtres.

On vérifie trois choses : les filtres transmis sont bien ceux du clic (pas un signet ancien), les mesures ont le même sens aux deux grains, et aucun filtre de visuel caché ne réintroduit les autres régions.

Si la page détail a vocation à être ouverte seule, elle a ses propres filtres, mais l'arrivée depuis le comité ne doit pas les réinitialiser en silence.

</details>

## Exercice 3 : Signet officiel ou vue personnelle

Léa, contrôleuse, a enregistré un signet « Comité » qui exclut trois magasins en travaux et masque la marge. Elle demande à le publier comme page par défaut pour la direction. Comment répondez-vous ?

<details>
<summary>Voir la solution</summary>

On ne publie pas tel quel. Le signet mélange un **périmètre métier** (magasins en travaux) et un **masquage** qui retire le verdict (la marge).

- Si les magasins en travaux sont hors pilotage pour tout le monde, c'est une règle du jeu de données, écrite, pas un signet personnel.
- Si c'est un besoin de Léa seule, le signet reste privé, libellé « ma vue », distinct de la page certifiée.
- La page direction par défaut continue d'afficher la marge et le périmètre officiel. Un second signet nommé (« Hors travaux, préparation ») peut exister s'il est revu et libellé, sans prendre la place du défaut.

Un signet partagé dont le nom dit « Comité » mais qui ne l'est plus est une seconde vérité.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Filtres et navigation
center: Peu de filtres visibles, un contexte qui suit le clic, des signets nommés.
points:
  - icon: filter
    title: Global ou local
    text: Le filtre de page change le récit. Le filtre de visuel ne le contredit pas en silence.
  - icon: compass
    title: Drill-through
    text: La page détail reçoit le mois et le périmètre, et les affiche.
  - icon: sparkles
    title: Signets rares
    text: Deux ou trois états nommés, pas douze rapports cachés sous des signets.
  - icon: users
    title: Perso distinct
    text: Une vue personnelle ne porte pas le badge de la page certifiée.
  - icon: alert
    title: Cinq, pas quinze
    text: Chaque segment en vitrine doit tenir dans la phrase de décision.
pitfall: "Un filtre de visuel invisible qui contredit le titre fait dire que le chiffre est faux."
remember: Le parcours tient en trois gestes, périmètre, cause, puis détail.
```
