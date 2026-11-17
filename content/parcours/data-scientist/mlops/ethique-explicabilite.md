---
title: Éthique et explicabilité
description: Distinguer importance globale et explication locale, voir les limites de SHAP, prendre en compte les groupes protégés, et savoir refuser un usage.
duration: 40
objectives:
  - Distinguer l'importance d'une feature et l'explication d'une décision individuelle
  - Expliquer l'idée de SHAP et les limites des importances quand les variables sont liées
  - Repérer un proxy de groupe protégé et le besoin d'une explication en langage clair
  - Refuser un usage dont la finalité ou les erreurs sont inacceptables
---

# Deux questions, deux outils

« Le modèle est explicable » ne veut rien dire tant qu'on n'a pas dit **à qui** et **sur quoi**. Deux questions se mélangent souvent.

- **Globale** : quelles colonnes le modèle utilise-t-il, en général, sur tout le jeu ?
- **Locale** : pourquoi **ce** dossier a-t-il reçu **ce** score ?

La première intéresse l'équipe qui construit le modèle et le métier qui veut savoir si le score « regarde les bonnes choses ». La seconde intéresse la personne qui subit la décision, le conseiller qui appelle, l'auditeur qui reprend un dossier. Un graphique d'importance globale ne répond pas à la seconde. Une phrase sur un dossier ne résume pas la première.

Aucune des deux n'est une preuve d'équité, ni une preuve que le modèle a raison. On peut expliquer très clairement un score faux. L'explication rend la décision **discutable**. Elle ne la rend pas juste.

```diagram
type: compare
title: "Globale ou locale"
columns:
  - title: "Importance globale"
    tone: blue
    items:
      - "Une colonne, un poids moyen sur un ensemble"
      - "Sert à auditer le modèle, pas un dossier"
      - "Permutation ou impureté des arbres"
      - "Ne dit pas pourquoi ce client-ci est appelé"
  - title: "Explication locale"
    tone: teal
    items:
      - "Un dossier, des contributions par feature"
      - "Sert à une phrase et à un recours"
      - "SHAP en est une famille, pas la seule"
      - "Ne prouve pas que la feature a causé l'événement"
```

# Importance globale et SHAP, à l'intuition

L'**importance par permutation** est l'idée la plus stable à retenir pour un tableau. Sur un jeu que le modèle n'a pas appris (la validation), on mélange au hasard une colonne, on recalcule la métrique. Si la métrique chute, le modèle se servait de cette colonne. Si elle ne bouge pas, la colonne était décorative, ou redondante avec une autre qui est restée en place. On répète le mélange, parce qu'un seul tirage est bruité. On obtient un classement **global**.

L'importance native des arbres (combien une colonne a réduit l'impureté) est plus rapide et plus flatteuse pour les variables à beaucoup de modalités. Elle sert d'indice pendant l'exploration. Pour une discussion avec le métier, la permutation sur la validation est plus honnête : elle est liée à la métrique que vous avez choisi d'optimiser, pas à un critère interne de l'arbre.

**SHAP**, vu sans formule, attribue le score d'**une** ligne. On part d'une valeur de base : le score moyen du modèle sur un ensemble de fond (souvent un échantillon de la validation). Pour le dossier en cours, chaque feature « pousse » ce score vers le haut ou vers le bas. La somme des poussées, plus la valeur de base, retombe sur le score prédit (pour les variantes additives usuelles). Une poussée grande et positive sur `appels_sav_90j` se lit : pour **ce** dossier, ce nombre d'appels a contribué à augmenter le score, relativement au fond.

Ce n'est pas une probabilité que la feature soit « la cause ». C'est une répartition du score entre les colonnes, étant donné le modèle et l'ensemble de fond. Changer l'ensemble de fond change les poussées. Un fond qui ne ressemble pas à la population scorée en production rend les phrases fausses, même si le graphique est net.

Calculer une explication locale pour chaque ligne d'un historique d'un million de dossiers a un coût. On explique les dossiers **actionnés** (les 500 appels, les refus) et un échantillon de contrôle, pas nécessairement toute la base chaque nuit.

```video
url: https://www.youtube.com/watch?v=MQ6fFDwjuco
title: "SHAP values for beginners | What they mean and their applications"
channel: "A Data Odyssey"
duration: "7:07"
lang: en
why: "Les valeurs SHAP pour débutants : ce qu'elles mesurent et comment lire les graphiques usuels."
```

# Ce que l'explication ne prouve pas

Trois limites suffisent à ne pas sur-vendre un graphique.

**Ce n'est pas causal.** « SHAP dit que la facture cause la résiliation » est un glissement de langue. Le modèle a associé facture et score. La facture peut être le reflet d'une offre, d'un usage, d'une ancienne promotion. Agir sur la facture (offrir une remise) peut marcher ou non : l'explication ne le démontre pas. Elle suggère une piste que seule une décision métier, ou une expérimentation, tranche.

**Les colonnes liées se partagent le crédit.** Ancienneté, type d'offre et engagement finissent souvent ensemble. D'un tirage de permutation à l'autre, ou d'un dossier à l'autre, le crédit passe de l'une à l'autre. Afficher « la » variable numéro un comme une vérité stable est excessif. On regroupe les features qui disent la même chose, ou l'on assume dans la phrase qu'il s'agit d'un faisceau (engagement et ancienneté), pas d'un coupable unique.

**Une belle explication n'excuse pas un mauvais modèle.** Si la précision au volume d'appels est mauvaise, expliquer les erreurs avec SHAP produit des phrases convaincantes sur des mauvais appels. On n'envoie pas ces phrases au client pour « faire de l'éthique ». On corrige le modèle, ou l'on n'automatise pas.

> [!WARNING]
> Un texte généré à partir des deux plus grandes features, **même quand leurs contributions sont minuscules**, donne une fausse précision. Si aucune feature ne porte le score, la phrase honnête est « le score est proche de la moyenne, sans facteur dominant », pas une histoire inventée pour meubler.

L'importance globale peut aussi être un miroir du **biais de collecte**. Si un groupe est sous-représenté ou étiqueté plus sévèrement, la colonne proxy qui le désigne paraîtra « importante ». Retirer la colonne du graphique ne retire pas le problème des données.

# Groupes protégés et variables proxy

Des attributs sont encadrés parce que s'en servir pour traiter les personnes autrement est discriminatoire ou illicite : selon les contextes, l'origine, le sexe, la religion, l'état de santé, l'opinion, la situation économique quand elle sert à exclure d'un droit. Le cadre exact dépend du pays, du secteur et de la finalité. Ce chapitre ne remplace pas un avis juridique. Il fixe le réflexe du data scientist : **on ne décide pas seul que « ce n'est pas sensible »**.

Ne pas mettre la colonne `sexe` dans le pipeline ne suffit pas. Un **proxy** porte la même information par un détour : le prénom, le code postal fin, l'intitulé de métier, le magasin habitué, parfois l'offre elle-même si elle a été vendue de façon ciblée. Le modèle n'a pas besoin qu'on lui « donne » l'attribut protégé pour le reconstruire.

Que mesurer, quand on a le droit et un but précis (vérifier qu'on ne concentre pas les erreurs) :

- le **taux d'erreur** par groupe, pas seulement l'accuracy globale ;
- en particulier les erreurs qui font mal dans ce produit : ne pas proposer l'offre de fidélisation (on prive d'un avantage), ou au contraire cibler un groupe pour une contrainte (relance agressive, refus).

Une accuracy identique peut cacher un rappel très différent. Le groupe le plus « facile » à scorer tire la moyenne. On publie les effectifs : un écart sur 40 personnes n'a pas le même sens qu'un écart sur 40 000.

Si la mesure montre un écart inacceptable et qu'on ne sait pas le corriger sans proxy ni sans dégrader l'usage pour tout le monde, la conclusion peut être de **ne pas déployer**, ou de restreindre l'usage (aide à la priorisation interne, revue humaine, pas d'action automatique). C'est une issue normale du travail, pas un échec de dernière minute à cacher dans une annexe.

> [!IMPORTANT]
> Collecter un attribut protégé « pour vérifier l'équité » est parfois nécessaire et parfois interdit. On ne l'ajoute pas au datamart par curiosité. On le fait avec une base légale, une durée, un accès restreint, et de préférence **hors** des features du modèle servi.

# Une explication en mots

Quand la décision produit un effet sérieux pour la personne (crédit, embauche, assurance, accès à un service), elle doit pouvoir entendre **pourquoi**, dans des mots qu'elle peut contester, et comment demander une revue humaine. Un vecteur de nombres, un graphique SHAP, ou la phrase « le modèle l'a décidé » ne sont pas cette explication.

Une phrase acceptable cite les facteurs **réellement** contributifs, dans le vocabulaire du contrat, avec une prudence causale :

- acceptable : « Le score de risque est élevé surtout à cause de deux impayés sur les six derniers mois et d'une ancienneté de moins de trois mois. Vous pouvez fournir des pièces et demander une revue. »
- inacceptable : « L'algorithme a classé votre dossier en catégorie B. »
- inacceptable aussi : « C'est à cause de votre quartier », si le quartier n'est qu'un proxy et que la phrase le présente comme un motif légitime.

Le texte doit être **produit à partir du modèle qui a scoré**, pas d'un second discours écrit d'avance qui ignore le dossier. Si le conseiller lit un script fixe (« nous appelons nos meilleurs clients ») pendant que le score, lui, vise les clients les plus susceptibles de partir, le script ment.

Pour un usage à enjeu plus faible (ordre d'une liste d'appels commerciaux, sans sanction et sans retrait de service), l'obligation n'est pas la même. Le devoir de ne pas mentir, de ne pas punir, et de ne pas reconstruire un attribut sensible, reste. Le client appelé n'a pas à recevoir un cours de SHAP. L'opérateur, lui, doit pouvoir dire pourquoi **cette** personne est sur la liste du jour, au moins par les deux facteurs principaux, sinon la liste n'est pas auditable.

Le recours n'est pas un formulaire vers une boîte mail morte. Quelqu'un a le droit de **renverser** la décision automatique quand le dossier contient un fait que le modèle ne voit pas (un geste commercial déjà promis, une erreur de facturation reconnue).

# Refuser un usage

Construire le modèle n'oblige pas à le livrer pour n'importe quelle finalité. Refuser fait partie du livrable. On le fait par écrit, court, sans sermon : ce qui était demandé, pourquoi ce n'est pas acceptable, ce qu'on peut faire à la place s'il existe une alternative réelle.

Cas où le refus est le bon résultat :

- **Finalité détournée.** Le score de résiliation a été cadré pour proposer une offre. On vous demande de couper la qualité de service des scores élevés « pour qu'ils partent plus vite ». Ce n'est plus le même produit. C'est un usage hostile des mêmes poids.
- **Inférence sensible.** Déduire un état de santé, une grossesse, une opinion, à partir de comportements, pour cibler la personne. Même si la métrique est bonne, la finalité ne se sauve pas par l'AUC.
- **Proxy assumé pour exclure.** Ajouter un indicateur de quartier pauvre afin d'appeler **moins** ces clients et « économiser les offres ». On organise un traitement moins favorable. On ne le masque pas dans une feature anodine.
- **Erreur concentrée, non corrigée.** Le rappel de l'avantage est nettement plus bas pour un groupe, l'écart est documenté, aucune correction acceptable n'existe, et l'action est automatique. On ne déploie pas en se promettant de « surveiller plus tard ».

L'alternative n'est pas toujours un autre modèle. Parfois c'est une statistique **agrégée** (le taux de résiliation par offre, pour réparer l'offre) sans score individuel. Parfois c'est une règle métier relue. Parfois c'est rien : le projet s'arrête.

```diagram
type: flow
title: "Avant de livrer l'usage"
steps:
  - title: "Finalité"
    text: "Écrite, celle du cadrage, pas celle ajoutée en bout de course."
    tone: blue
  - title: "Effet"
    text: "Avantage, contrainte, ou simple priorisation interne."
    tone: violet
  - title: "Erreurs"
    text: "Qui les subit, sur quels groupes, avec quels effectifs."
    tone: amber
  - title: "Phrase et recours"
    text: "Mots vrais, revue humaine si l'effet est sérieux."
    tone: teal
  - title: "Livrer ou refuser"
    text: "Les deux s'écrivent. Le silence n'est pas un accord."
    tone: rose
```

Un refus propre laisse les collègues continuer sur la partie saine du besoin. Il ne brûle pas le travail d'analyse descriptif qui a montré, par exemple, qu'une offre est mal tarifée. Il refuse le **ciblage** qui poserait problème, pas l'idée de comprendre le phénomène.

# Exercices

## Exercice 1 : Globale ou locale

Le comité de direction demande « les variables qui font le churn ». Un client dont le score vaut 0,81 demande pourquoi **il** a été relancé avec une offre de rétention, et il conteste.

Quels outils répondent à quelle question, et quelle phrase ne faut-il pas lui lire ?

<details>
<summary>Voir la solution</summary>

Le comité veut une lecture **globale** : importance par permutation sur la validation, métrique de décision à l'appui, avec prudence sur les colonnes liées (ancienneté et engagement). Ce classement ne parle pas de ce client.

Le client veut une lecture **locale** : contributions de **son** dossier (SHAP ou équivalent), traduites en mots, plus un recours. On cite les facteurs qui poussent vraiment son score, pas le top 3 global du comité.

Il ne faut pas lui lire « vous êtes dans le segment à risque du modèle » sans facteur, ni « c'est à cause de votre catégorie de client » si cette catégorie est un proxy, ni un script commercial qui contredit le score. Il ne faut pas non plus lui affirmer que la feature a **causé** sa future résiliation : on décrit ce qui a contribué au score.

</details>

## Exercice 2 : Le proxy

Le modèle de fidélisation n'a pas la colonne `revenus`. Il a le code postal détaillé et l'offre souscrite. L'importance met le code postal en tête. Une analyse, autorisée et faite à part, montre que les codes les plus contributifs sont aussi les plus pauvres, et que ces clients reçoivent moins souvent l'offre alors que leur taux de résiliation réel est proche des autres.

Que concluez-vous, et que retirez-vous en premier ?

<details>
<summary>Voir la solution</summary>

Le code postal fonctionne comme un **proxy** socio-économique. L'absence de la colonne `revenus` n'a rien protégé. Le modèle concentre un **avantage** (l'offre) loin de ce groupe, sans que la cible le justifie clairement, puisque le taux de résiliation est proche.

On ne « corrige » pas en ajoutant `revenus` dans le modèle servi. On retire d'abord le **code postal fin** (ou on le remplace par une maille vraiment utile au réseau, si un motif opérationnel autre que le revenu existe, et on re-mesure). On refait la comparaison de taux d'offre et d'erreur. Si l'écart reste inacceptable, on ne déploie pas ce ciblage. L'analyse agrégée par offre, elle, peut continuer.

</details>

## Exercice 3 : Refuser ou recadrer

Trois demandes arrivent la même semaine. Pour chacune : livrer, recadrer, ou refuser, avec une phrase.

1. Utiliser le score de résiliation pour prioriser les appels d'une offre, avec une phrase type pour l'opérateur et un moyen de retirer un client déjà en geste commercial.
2. Ajouter `quartier_prioritaire` pour **réduire** les appels dans ces quartiers et économiser le budget d'offres.
3. Réutiliser le même score pour dégrader le débit des clients les plus susceptibles de partir, afin de libérer du réseau.

<details>
<summary>Voir la solution</summary>

1. **Livrer**, dans le cadrage prévu. C'est une priorisation d'un avantage, avec explication pour l'opérateur et recours (retrait manuel). On vérifie quand même les écarts par groupe avant de figer la liste.
2. **Refuser.** L'indicateur sert à accorder moins un avantage à un groupe déjà désigné par un critère socio-économique. Ce n'est pas un raffinement du modèle. Alternative : suivre le taux de résiliation agrégé, et répartir le budget d'appels sans cette variable d'exclusion.
3. **Refuser.** La finalité change : d'une offre de rétention on passe à une **punition** (débit dégradé) fondée sur un score. Les poids ne sont pas réutilisables pour cela. Aucune AUC ne répare le changement de finalité.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Éthique et explicabilité"
center: "L'importance dit ce que le modèle utilise. L'explication locale dit pourquoi ce dossier. Aucune ne rend l'usage juste."
points:
  - icon: chart
    title: "Permutation, puis SHAP"
    text: "Mélanger une colonne mesure son rôle global. SHAP répartit un score individuel autour d'une valeur de base."
  - icon: alert
    title: "Pas une cause"
    text: "Les colonnes liées se volent le crédit. Une phrase précise sur un mauvais modèle reste une mauvaise décision."
  - icon: users
    title: "Proxy"
    text: "Retirer la colonne sensible ne suffit pas. Code postal ou prénom peuvent porter le même signal."
  - icon: chat
    title: "En mots"
    text: "La personne entend les vrais facteurs et peut demander une revue. Un vecteur n'est pas une explication."
  - icon: shield
    title: "Refuser"
    text: "Finalité détournée, inférence sensible, exclusion par proxy : le refus s'écrit, avec l'alternative saine."
pitfall: "Croire le modèle neutre parce que la colonne du groupe protégé n'est pas dans le fichier d'entraînement."
remember: "On explique une décision qu'on a le droit de prendre. Si l'usage est inacceptable, on n'explique pas : on refuse."
```
