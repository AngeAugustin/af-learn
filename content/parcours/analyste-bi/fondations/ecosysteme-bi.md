---
title: L'écosystème décisionnel
description: "Sources, préparation légère, entrepôt, couche sémantique, outil de visualisation et utilisateur métier : le trajet d'une question jusqu'au chiffre."
duration: 55
objectives:
  - Décrire le trajet d'une question métier jusqu'au chiffre affiché
  - Situer sources, préparation, entrepôt, couche sémantique, visualisation et utilisateur
  - Distinguer un ETL léger d'un ELT léger du point de vue de l'analyste
  - Repérer où la définition du chiffre doit vivre pour ne pas se démultiplier
---

# Partir de la question, pas de l'outil

Un outil de visualisation ne produit pas une décision. Il affiche un chiffre que quelqu'un a défini, à partir de données que quelqu'un a rendues disponibles. Chez Halte Marché, la question du lundi est écrite avant le premier graphique :

> Allons-nous maintenir l'ouverture du dimanche en région Nord en novembre ?

Cette phrase impose un périmètre (région Nord, dimanches de novembre, magasins encore ouverts), une mesure (CA HT, puis marge), et une comparaison (budget, et dimanches de l'an passé si le calendrier est comparable). Tant que cette phrase n'existe pas, choisir un visuel est prématuré.

L'écosystème décisionnel est la chaîne qui relie cette question au nombre affiché, puis à la décision prise. Vous n'en opérez pas toutes les briques. Vous devez savoir **laquelle porte la définition**, laquelle porte l'historique, et laquelle se contente d'afficher. Si vous l'ignorez, le chiffre se reconstruit à chaque étage, et la revue compare des objets différents.

> [!NOTE]
> Dans ce parcours, « écosystème » désigne le système de pilotage, pas une plateforme de collecte. Vous raisonnez en consommateur exigeant des données, et en auteur du chiffre officiel.

# Le trajet du chiffre

Le trajet tient en six échanges. Le métier pose une question. Vous vérifiez qu'une mesure existe. La couche sémantique interroge l'entrepôt au bon grain. Le total remonte, comparé au budget. Vous le commentez. La direction décide, ou vous demande une décomposition, pas une nouvelle définition.

```diagram
type: sequence
title: De la question au chiffre
actors: ["Métier", "Analyste BI", "Sémantique", "Entrepôt"]
messages:
  - from: 0
    to: 1
    text: "Quel CA HT pour les dimanches de novembre, région Nord ?"
  - from: 1
    to: 2
    text: "La mesure CA HT et le calendrier dimanche existent-ils déjà ?"
  - from: 2
    to: 3
    text: "Lire les ventes au grain convenu, filtrer région et dimanches"
  - from: 3
    to: 2
    text: "Lignes de ventes et référentiel magasin"
  - from: 2
    to: 1
    text: "CA HT agrégé, comparé au budget sur le même périmètre"
  - from: 1
    to: 0
    text: "Chiffre certifié, écart commenté, fraîcheur affichée"
```

Chaque flèche peut casser le chiffre.

- Si la question reste floue (« les ventes du Nord »), vous calculerez un total que personne ne pourra redire.
- Si la mesure n'existe pas, la tentation est de la créer dans un visuel, invisible des autres rapports.
- Si l'entrepôt n'a pas l'historique de novembre dernier, la comparaison est impossible, même avec un excellent graphique.
- Si vous commentez un total filtré par erreur (franchises exclues alors que le budget les inclut), la décision est fausse avec un chiffre « juste » sur un autre périmètre.

Le trajet se relit à l'envers quand un directeur conteste le nombre. Vous ne défendez pas la couleur des barres. Vous remontez : filtre de la page, mesure, grain de la table, source, question initiale.

# Les briques de l'écosystème

Six briques suffisent à situer un incident ou une demande. Vous n'avez pas à les construire toutes. Vous devez savoir à qui parler, et ce que vous avez le droit d'y modifier.

```diagram
type: layers
title: Les briques, de la décision vers les sources
layers:
  - title: Utilisateur métier
    text: Décide en revue à partir du chiffre affiché
  - title: Outil de visualisation
    text: Pages, filtres, exports, fraîcheur visible
  - title: Couche sémantique
    text: Noms, mesures, relations, badge certifié
  - title: Entrepôt
    text: Tables historisées, jointures, périodes passées
  - title: Préparation légère
    text: ETL ou ELT limité au besoin du chiffre
  - title: Sources
    text: Caisse, ERP, fichiers finance, outils SaaS
```

| Brique | Rôle dans le pilotage | Ce que vous n'y faites pas |
|---|---|---|
| Sources | Naissance du fait (ticket, commande, budget) | Réécrire l'application de caisse |
| Préparation légère | Mettre au grain utile au rapport | Industrialiser toute la collecte de l'entreprise |
| Entrepôt | Conserver l'historique interrogeable | Corriger une ligne « pour la réunion » |
| Couche sémantique | Un seul nom pour un seul chiffre | Dupliquer la formule dans chaque page |
| Visualisation | Rendre le chiffre lisible pour une décision | Inventer une seconde définition |
| Utilisateur | Agir, filtrer, contester à bon escient | Deviner le périmètre d'un filtre laissé actif |

Lisez ce tableau quand une demande arrive. « Ajoute une colonne » peut être une mesure (sémantique), un champ manquant dans la source (quelqu'un d'autre), ou un simple filtre déjà possible. Le bon étage évite des semaines de travail au mauvais endroit.

# ETL léger et ELT léger

Deux enchaînements existent. Vous les choisissez selon **l'endroit où la définition doit vivre**, pas selon une mode.

```diagram
type: compare
title: Préparer peu, mais au bon endroit
columns:
  - title: ETL léger
    tone: amber
    items:
      - Extraire, transformer, puis charger le modèle
      - Typique d'un fichier repris dans l'outil de rapport
      - La règle reste dans ce fichier si vous n'y prenez garde
  - title: ELT léger
    tone: teal
    items:
      - Les données sont déjà chargées, souvent brutes
      - Vous transformez ensuite par une vue ou un modèle SQL
      - La même règle sert plusieurs rapports
```

L'**ETL léger** (extraire, transformer, charger) convient à un fichier que l'entrepôt ne connaît pas encore. Le budget mensuel arrive dans un classeur du contrôle de gestion, mois en colonnes. Vous le transformez dans l'outil (Power Query, par exemple), puis le modèle du rapport le charge. C'est légitime pour un besoin local. C'est dangereux si six rapports recopient les mêmes étapes : le jour où la règle des avoirs change, cinq rapports restent faux.

L'**ELT léger** (extraire, charger, transformer) part de données **déjà** dans l'entrepôt. La transformation est une vue SQL, ou un modèle SQL versionné côté consommateur. Vous ne déclenchez pas la collecte. Vous fixez le grain et la formule au-dessus de tables que d'autres maintiennent à jour. C'est le bon réflexe dès que deux rapports doivent afficher le même CA.

Dans les deux cas, « léger » veut dire : juste assez pour le chiffre de pilotage. Vous ne dessinez pas l'architecture de collecte de l'enseigne. Si le fichier budget devient critique et quotidien, vous demandez qu'il soit déposé dans l'entrepôt, puis vous revenez à une vue partagée.

> [!WARNING]
> Une transformation copiée dans dix rapports n'est plus légère. C'est une définition éclatée. Le symptôme : deux pages certifiées, deux totaux, aucune des deux ne « a tort » sur son propre filtre.

# Entrepôt et couche sémantique

L'**entrepôt** est l'endroit où l'historique se laisse interroger. Pour vous, ce n'est pas une prouesse technique. C'est un contrat :

- les ventes de l'an passé sont encore là, au grain convenu ;
- le référentiel magasin (région, format, date d'ouverture) est joignable ;
- une fraîcheur est promise (par exemple, caisses de J-1 disponibles à 7 h) ;
- vous lisez, vous n'éditez pas une ligne pour faire plaisir à une revue.

Sans entrepôt, le « CA de novembre dernier » dépend du classeur que quelqu'un a gardé. Avec un entrepôt et sans couche sémantique, chaque auteur de rapport réécrit `SUM(montant_ht)` avec ses propres exclusions. L'historique est sain, le chiffre officiel ne l'est pas.

La **couche sémantique** est le contrat avec le métier. Elle porte :

- les noms affichés (« CA HT », « Marge commerciale », « Magasin ») ;
- les mesures, leur format (euro, pourcentage) et leur agrégation par défaut (somme, ou « ne pas sommer » pour un taux) ;
- les relations (une vente appartient à un magasin) ;
- une description en une phrase, relisible par un contrôleur ;
- le badge certifié, quand le rapprochement a été fait.

Power BI appelle souvent cela un jeu de données ou un modèle. Tableau parle de source publiée. D'autres outils parlent de couche sémantique ou de LookML. Le vocabulaire viendra dans les modules outils. L'idée, elle, est stable : **le nom que le directeur lit ne doit exister qu'une fois**.

Si le directeur exporte vers un tableur et ressaisit une somme, la couche sémantique a perdu. Ce n'est pas d'abord un problème d'interdit. C'est un signal : il manque une tranche (le dimanche, le frais), ou il ne croit pas le total. Allez chercher la raison avant d'ajouter une septième page.

# L'outil de visualisation et l'utilisateur

L'outil de visualisation est le dernier mètre. Il doit être celui que la directrice ouvre vraiment le lundi, pas celui que l'équipe data préfère. Excel branché sur le modèle sémantique peut être un outil de visualisation honorable. Un rapport très beau, ouvert par personne, n'est pas un outil de pilotage.

Trois règles suffisent à ce stade.

1. **Une question par page.** « Dimanches de novembre, région Nord, CA HT contre budget » est une page. La marge du mois entier en est une autre. Empiler les deux sans hiérarchie produit un poster.
2. **Les filtres sont une partie du chiffre.** Un filtre « hors franchises » laissé actif change le total. Le rapport doit montrer les filtres en cours, et le total certifié doit avoir un état de filtres connu, celui du rapprochement finance.
3. **La fraîcheur est un texte, pas une supposition.** « Données de caisse arrêtées au dimanche 15 novembre, 23 h 59 » vaut mieux qu'une horloge implicite.

L'utilisateur métier fait partie du système. Le directeur de magasin, le régional, le contrôleur n'ont pas le même grain utile, mais ils doivent reconnaître la **même mesure**. Vous les formez au filtre, au glossaire, au nom de la personne à appeler si le total surprend. Un rapport sans interlocuteur redevient un export anonyme.

La décision ferme la boucle. Après la revue, notez ce qui a été mal lu (un filtre, un libellé, une comparaison N-1 mal comprise). Ces notes valent plus qu'un nouveau graphique : elles disent où la chaîne, de la question au chiffre, a été comprise de travers.

# Exercices

## Exercice 1 : Remettre le trajet dans l'ordre

Une contrôleuse conteste le CA HT des dimanches de novembre en région Nord. Remettez ces actions dans l'ordre de diagnostic, de la page vers la source.

1. Vérifier que la page n'a pas un filtre « hors franchises » actif, absent du budget.
2. Relire la question décidée en revue (quels magasins, quels dimanches).
3. Contrôler que la mesure « CA HT » de la couche sémantique est bien celle de la page.
4. Vérifier dans l'entrepôt que les tickets du 15 novembre sont arrivés.

Solution :
<details>
<summary>Voir la solution</summary>

L'ordre utile part de ce que la contrôleuse a sous les yeux, puis remonte le contrat :

1. **Filtres de la page** (action 1) : un filtre oublié explique souvent l'écart sans que la donnée soit fausse.
2. **Mesure affichée** (action 3) : est-ce bien « CA HT », et pas une variante locale ?
3. **Question et périmètre** (action 2) : dimanches, région, franchises, tels que la revue les a définis.
4. **Entrepôt** (action 4) : seulement ensuite, la fraîcheur des tickets.

Aller d'abord chercher un incident de collecte alors qu'un filtre est actif fait perdre la revue, et accuse la mauvaise brique.

</details>

## Exercice 2 : ETL léger ou ELT léger

Pour chaque situation, choisissez ETL léger ou ELT léger, et dites où la règle doit vivre dans trois mois.

1. Le budget mensuel n'existe que dans un classeur, mois en colonnes, pour un seul rapport de région.
2. La règle « CA HT hors cartes cadeaux » est recopiée dans six rapports, et la finance vient de la changer.
3. Les tickets sont déjà dans l'entrepôt chaque matin. Vous devez seulement les agréger par magasin et par jour pour tous les rapports.

Solution :
<details>
<summary>Voir la solution</summary>

1. **ETL léger**, dans l'outil du rapport, tant que le fichier reste local et unique. Dès qu'un second rapport en a besoin, demandez le dépôt du budget dans l'entrepôt et passez à une vue partagée.
2. **ELT léger** : la règle ne doit plus vivre dans les six fichiers. Une vue ou un modèle SQL consommateur, une mesure dans la couche sémantique, puis les rapports n'affichent plus que cette mesure.
3. **ELT léger** : la collecte est déjà faite. Votre travail est l'agrégat partagé, pas un second chargement.

</details>

## Exercice 3 : Nommer la brique en cause

Lors de la revue, le régional dit : « Votre CA de dimanche est bon, je l'ai refait dans Excel en enlevant les relais, et je n'ai pas le même budget. » Quelle brique a cédé, et que proposez-vous sans créer une seconde définition ?

Solution :
<details>
<summary>Voir la solution</summary>

Le régional a **sorti le chiffre de la couche sémantique** et changé le périmètre (hors relais) sans changer le budget, qui inclut encore les relais. L'outil de visualisation a servi d'export, pas de contrat.

Vous ne créez pas une mesure « CA Excel régional ». Vous vérifiez si le découpage « hors relais » est une vraie décision récurrente. Si oui, vous l'ajoutez comme **filtre explicite** sur la même mesure CA HT, et vous demandez au contrôle de gestion un budget au même périmètre. Si non, vous montrez en revue le total certifié, filtres visibles, et vous laissez l'essai Excel hors du pack officiel.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: L'écosystème décisionnel
center: "Une question écrite traverse des briques précises, jusqu'à un chiffre que l'on peut refaire."
points:
  - icon: chat
    title: La question d'abord
    text: "Périmètre, mesure et comparaison s'écrivent avant de choisir un graphique."
  - icon: layers
    title: Six briques
    text: "Sources, préparation légère, entrepôt, sémantique, visualisation, utilisateur."
  - icon: filter
    title: ETL ou ELT léger
    text: "Fichier local : transformation dans le rapport. Règle partagée : vue ou modèle SQL."
  - icon: book
    title: Un seul nom
    text: "La couche sémantique porte la mesure. Le visuel affiche, il ne redéfinit pas."
  - icon: users
    title: L'utilisateur compte
    text: "Un filtre oublié change le chiffre. La fraîcheur et le périmètre doivent se voir."
pitfall: "Reconstruire le total dans un tableur à chaque étage, puis s'étonner que la revue compare deux objets."
remember: "Vous diagnostiquez la brique, vous ne recopiez pas la formule. Le nom officiel n'existe qu'une fois."
```
