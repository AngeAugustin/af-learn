---
title: Premiers pas dans un outil BI
description: "Relier un modèle à des visuels, poser des filtres, actualiser et publier un rapport. Choisir Power BI, Tableau ou Looker selon l'usage analyste, sans entrer dans le DAX avancé."
duration: 55
objectives:
  - Expliquer le rôle du modèle sémantique, du visuel et du filtre dans un rapport
  - Choisir Power BI, Tableau ou Looker selon qui possède le modèle et comment le rapport circule
  - Vérifier qu'une actualisation a bien eu lieu et l'afficher aux lecteurs
  - Publier un rapport avec un public, une définition et un propriétaire
---

# Le modèle avant le graphique

Un outil de BI (Power BI, Tableau, Looker) ne « fait » pas l'analyse. Il montre un **modèle** : des tables, des relations, un grain, et des indicateurs déjà nommés. Si le modèle est faux, le visuel le plus soigné l'est aussi.

Vous recevez, par exemple, trois tables d'une enseigne :

- `commandes` : une ligne par commande payée, avec `date_commande`, `magasin_id`, `montant_ht` ;
- `magasins` : une ligne par magasin, avec la région ;
- `objectifs` : une ligne par magasin et par mois, avec `objectif_ht`.

Le grain de `commandes` est la commande. Le jour où quelqu'un y importe le détail des lignes d'articles sans changer les relations, les montants doublonnent et le graphique reste joli. Avant de créer un visuel, vous écrivez : « une ligne de cette table = … ». Vous vérifiez qu'un magasin relie **plusieurs** commandes et **un** objectif du mois, pas l'inverse.

Dans l'outil, séparez deux idées, quel que soit le vocabulaire du logiciel.

- **Colonne.** Une valeur déjà portée par la ligne (la région, la date, le montant de la commande).
- **Mesure.** Un calcul réagrégé selon les filtres du lecteur (somme des montants, nombre de commandes distinctes, somme divisée par l'objectif). La mesure doit rester juste quand on passe de l'année au mois, ou de la France à une région.

> [!NOTE]
> Les formules riches (DAX dans Power BI, calculs de table dans Tableau, mesures LookML) appartiennent surtout au parcours BI et à celles et ceux qui maintiennent le modèle. Ici, vous devez savoir **où** vit la définition, la lire, et refuser de la réinventer dans un titre de graphique.

Nommez la mesure comme dans la note de décision : « chiffre d'affaires HT, commandes payées, hors commandes test ». Un champ `CA` sans unité ni périmètre sera repris de travers dans trois rapports.

# Visuels, filtres, interaction

Un visuel répond à une question. Le choix se fait comme dans un graphique statique : évolution dans le temps en courbe ou en barres, comparaison de catégories en barres triées, part d'un total seulement si les parts sont peu nombreuses et font 100 %. Un camembert de 14 régions ne devient pas plus clair parce qu'il est dans un outil interactif.

Les **filtres** changent le périmètre de lecture. Distinguez leur portée, les noms varient peu d'un outil à l'autre.

| Portée | Effet | Usage typique |
|---|---|---|
| Rapport entier | Tous les écrans | Enseigne, devise, exclusion des comptes test |
| Page | Un écran | La période, si chaque écran a sa question |
| Visuel | Un graphique | Une annotation, pas un filtre caché qui contredit la page |

Le **filtre croisé** (cliquer une barre filtre les autres visuels) est utile s'il reste visible : le lecteur doit voir qu'il ne regarde plus que la région Sud. Un clic oublié est la première cause de « ton chiffre n'est pas le mien » en réunion.

Posez peu de filtres, ceux qui changent la décision : période, région, canal. Un filtre « couleur du produit » sur un écran de direction régionale noie la question. Rangez le détail dans un second écran, accessible au clic, plutôt que dans une rangée de vingt segments.

Vérifiez toujours le même réflexe après un filtre : le total affiché est-il la **somme** des lignes visibles, ou une moyenne de moyennes ? Si l'outil a été branché sur une colonne déjà agrégée (un taux par magasin), le « total » automatique est souvent faux. La mesure doit être calculée au grain des faits, pas moyennée depuis un export.

# L'actualisation

Un rapport publié n'est pas vivant tout seul. Une **actualisation** relance la lecture de la source (entrepôt, fichier, extrait) et remplace les données montrées. Tant qu'elle n'a pas réussi, vous commentez hier, ou pire un mélange.

Ce que vous devez savoir faire, sans administrer la plateforme :

- dire **d'où** viennent les chiffres (table certifiée, extract, fichier déposé à la main) ;
- dire **quand** ils ont été rafraîchis pour la dernière fois, et si cet horaire est celui attendu (chaque matin à 7 h, après la clôture finance) ;
- reconnaître un échec : identifiants expirés, source en retard, volume à zéro, délai dépassé ;
- ne pas « rafraîchir » en réimportant un classeur personnel par-dessus le rapport officiel.

```diagram
type: flow
title: Avant de commenter un rapport publié
steps:
  - title: Source nommée
    text: Table certifiée, pas un fichier déposé une fois
    tone: blue
  - title: Heure affichée
    text: Dernière actualisation réussie, visible pour le lecteur
    tone: teal
  - title: Volume plausible
    text: Lignes du jour, pas un import vide qui affiche zéro
    tone: amber
  - title: Même définition
    text: Le total du rapport égale le contrôle SQL convenu
    tone: violet
```

Deux modes reviennent partout. L'**import** (ou l'extrait) copie les données dans l'outil à heure fixe : rapide à lire, mais figé entre deux rafraîchissements. La **requête directe** interroge l'entrepôt à l'ouverture : plus fraîche, plus sensible à la charge et aux droits. Le choix est souvent déjà fait par l'équipe data. Votre rôle est de ne pas promettre « du temps réel » à un comité si l'extrait date de 6 h du matin, et de l'écrire sur l'écran.

Affichez la fraîcheur en toutes lettres : « Données jusqu'au 15 novembre 2026, 06 h 40 (fuseau de Paris). Les commandes de la nuit n'y sont pas. » Une mention en pied de page évite une heure de débat.

# Power BI, Tableau, Looker

Les trois outils peuvent produire un graphique de ventes. Ils ne donnent pas le même travail à l'analyste, parce qu'ils ne placent pas le modèle au même endroit. Le DAX avancé, les calculs de table complexes et le LookML détaillé se traitent dans un parcours BI : ici, vous choisissez l'outil selon **qui maintient la définition** et **comment le rapport circule**.

```diagram
type: compare
title: Trois outils, trois places pour l'analyste
columns:
  - title: Power BI
    tone: amber
    items:
      - Modèle souvent dans le rapport ou un jeu de données partagé
      - Proche d'Excel et de Microsoft 365
      - Publication dans le service, applications, droits par rôle
      - Vous consommez des mesures, vous n'inventez pas un second CA
  - title: Tableau
    tone: blue
    items:
      - Exploration visuelle d'abord, feuilles puis tableaux de bord
      - Fort pour une question ad hoc sur données déjà propres
      - Publication sur Tableau Server ou Cloud, extraits planifiés
      - Le risque est la mesure recréée dans la feuille locale
  - title: Looker
    tone: teal
    items:
      - Le modèle LookML appartient en général à l'équipe data
      - Vous explorez des champs déjà définis, sans refaire les jointures
      - Utile quand la gouvernance prime sur la liberté de modèle
      - Looker Studio est un autre outil, plus libre, moins gouverné
```

Repères d'usage.

- **Power BI** convient quand l'entreprise vit dans Microsoft, que des collègues ouvrent déjà Excel, et qu'un jeu de données publié sert de source commune à plusieurs rapports. Vous épinglez un rapport dans un espace de travail, vous planifiez l'actualisation, vous gérez l'accès par groupe. Vous ne dupliquez pas le fichier « CA_final_v7 » sur un partage réseau.
- **Tableau** convient quand vous devez **explorer** : croiser vite, isoler une catégorie, montrer le chemin au métier, puis figer un tableau de bord. La discipline consiste à publier la source de données (ou l'extrait certifié) plutôt qu'un classeur qui embarque un CSV téléchargé jeudi.
- **Looker** (l'outil d'exploration Google Cloud, pas Looker Studio) convient quand vous ne devez **pas** reconstruire les jointures. Vous partez d'un Explore : les mesures « chiffre d'affaires » et « commandes » existent, les filtres aussi. Votre valeur est la question et la mise en forme, pas un nouveau SQL caché dans un champ calculé. **Looker Studio**, lui, se branche facilement à un tableur ou à une base et ressemble davantage à un outil de tableaux de bord libre : pratique pour un prototype, fragile si chacun y redéfinit le taux de marge.

Si les trois existent dans la même entreprise, suivez la **source certifiée**, pas votre préférence esthétique. Un chiffre officiel ne devrait avoir qu'une définition, même s'il est dessiné dans deux outils le temps d'une transition.

# Publier un rapport

Publier, c'est rendre le rapport trouvable par les bonnes personnes, avec une actualisation qui tient sans vous. Un fichier envoyé par e-mail n'est pas publié : il se duplique, et vendredi personne ne sait quelle pièce jointe est la bonne.

Checklist minimale.

1. **Périmètre.** Ce que le rapport couvre et ce qu'il ne couvre pas (HT, pays, marques, commandes annulées).
2. **Source et fraîcheur.** Nom de la table ou du jeu de données, horaire d'actualisation, comportement si elle échoue (on ne commente pas, on prévient).
3. **Public.** Qui a le droit de le voir. Les droits de ligne (un directeur régional ne voit que sa région) se règlent dans l'outil ou en amont, pas par un filtre qu'un lecteur peut retirer.
4. **Propriétaire.** Un nom. Quand la définition change, c'est cette personne qui met à jour le rapport et la note, pas « l'équipe » en général.
5. **Endroit unique.** Espace de travail, dossier serveur ou URL stable. L'ancienne version est archivée ou supprimée de la circulation, avec une mention si des captures ont déjà été présentées.

> [!WARNING]
> Un rapport peut être techniquement « partagé avec toute l'organisation » et rester inutilisable : pas de période par défaut, pas de fraîcheur, totaux qui ne se reconcilient pas avec la finance. Publier inclut ces contrôles, pas seulement le bouton de partage.

Après publication, ouvrez le rapport avec un compte de lecteur, pas avec le vôtre. Les filtres que vous aviez en tête ne sont pas les siens. Vérifiez le total sur un mois clos contre le chiffre convenu avec le contrôle de gestion. S'il diffère, vous ne prévenez pas par une phrase discrète dans un tooltip : vous laissez le rapport en retrait le temps de comprendre, ou vous affichez l'écart.

Le rapport publié renvoie à la définition (une page, un lien vers le catalogue de données, une note). Sans cela, le visuel devient la définition, et chaque lecteur la réinterprète.

# Exercices

## Exercice 1 : Où est la définition ?

Un collègue a déposé dans Power BI un fichier `ventes.xlsx`. Il a créé une carte « CA » qui somme la colonne `montant`. Le contrôle de gestion, lui, suit le montant HT des commandes payées, après retours, dans la table certifiée `mart_ventes`. Le rapport est déjà dans un espace vu par la direction. Que faites-vous, concrètement, avant la réunion de lundi ?

<details>
<summary>Voir la solution</summary>

Vous ne laissez pas la carte servir de chiffre officiel. Vous identifiez l'écart de définition (brut contre HT, retours, commandes non payées, éventuels doublons de lignes) et vous le dites au propriétaire de la réunion.

Ensuite vous rebranchez le rapport sur `mart_ventes`, ou vous retirez le partage tant que ce n'est pas fait. Vous affichez la fraîcheur et le périmètre sur la page. Vous vérifiez qu'un mois clos tombe sur le même total que le contrôle de gestion.

Vous ne « corrigez » pas le classeur avec une colonne bricolée pour coller au total : la définition doit vivre dans la table certifiée, pas dans un fichier que vous seul pouvez refaire.

</details>

## Exercice 2 : Quel outil pour quel geste ?

Pour chaque demande, dites si vous partiriez plutôt d'un Explore Looker déjà gouverné, d'un rapport Power BI publié, ou d'une exploration Tableau, et ce que vous évitez.

1. Le directeur régional veut le suivi hebdomadaire officiel, celui que la finance reconnaît.
2. Une chef de produit veut, aujourd'hui, isoler les références dont le taux de retour dépasse 8 %, pour préparer trois questions.
3. Vous n'avez pas le droit de refaire les jointures commandes / clients : elles sont dans le modèle d'entreprise.

<details>
<summary>Voir la solution</summary>

1. Le **rapport officiel** déjà publié (souvent Power BI ou l'outil choisi comme standard), pas une exploration neuve. Vous évitez de reconstruire le CA dans un classeur parallèle.
2. Une **exploration** (Tableau, ou l'équivalent ad hoc de votre outil), clairement marquée comme non officielle, sur une source certifiée. Vous évitez de publier ce brouillon dans l'espace direction sans propriétaire ni fraîcheur.
3. **Looker** (Explore) ou le jeu de données sémantique déjà publié. Vous évitez le SQL recollé dans un champ calculé et le second modèle « temporaire » qui restera deux ans.

Le critère n'est pas la marque préférée : c'est l'existence d'une définition commune et le risque de la doubler.

</details>

## Exercice 3 : L'actualisation a échoué

Mardi à 9 h, le rapport des ventes montre un lundi à zéro. L'horaire prévu d'actualisation est 6 h 30. Un collègue propose d'annoncer « journée morte en magasin » et de coller une capture dans le comité de 10 h. Que vérifiez-vous, et que dites-vous à la place ?

<details>
<summary>Voir la solution</summary>

Vous ouvrez l'historique d'actualisation : succès ou échec, heure, message. Vous comparez au volume de la table source (une requête simple, ou l'indicateur de fraîcheur de l'équipe data). Zéro euro un lundi, avec une actualisation en échec, n'est pas une journée morte : c'est un rapport vide.

Vous ne collez pas la capture. Vous dites : « Le rapport n'a pas été rafraîchi, je ne commente pas le lundi. Dernière donnée fiable : dimanche 6 h 30. Incident signalé. » Si un chiffre de secours existe (export finance, requête sur la table certifiée), vous le présentez avec sa source et son heure, sans le faire passer pour le rapport habituel.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Premiers pas dans un outil BI
center: L'outil montre un modèle. La définition, la fraîcheur et le public comptent plus que le visuel.
points:
  - icon: layers
    title: Modèle d'abord
    text: Grain, relations, mesures réagrégées. Un champ CA sans périmètre sera repris de travers.
  - icon: filter
    title: Filtres visibles
    text: Rapport, page ou visuel. Un clic croisé oublié explique la moitié des disputes.
  - icon: clock
    title: Actualisation
    text: Heure du dernier succès affichée. Un import de 6 h n'est pas du temps réel.
  - icon: chart
    title: Trois usages
    text: Power BI partage un modèle, Tableau explore, Looker consomme un Explore gouverné.
  - icon: rocket
    title: Publier
    text: Une URL, un propriétaire, des droits, un total qui se reconcilie. Pas une pièce jointe.
pitfall: Laisser un classeur personnel devenir le chiffre de la direction parce que le graphique était prêt.
remember: Avant de commenter un écran, nommez la source, l'heure de fraîcheur et la définition de la mesure.
```
