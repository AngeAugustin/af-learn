---
title: "Éthique et RGPD dans l'analyse"
description: "Limiter les données à la question, distinguer anonymat et pseudonymat, refuser les segments sensibles et les indicateurs qui pénalisent un groupe sans examen, et savoir quelles productions vous ne livrez pas."
duration: 50
objectives:
  - Appliquer la minimisation et la finalité à une demande d'extraction concrète
  - Distinguer une donnée anonyme d'une donnée seulement pseudonymisée
  - Repérer un segment sensible ou un proxy qui en tient lieu
  - Refuser ou retravailler un indicateur qui pénalise un groupe, et dire ce que vous ne produirez pas
---

# Minimisation et finalité

Le RGPD ne s'adresse pas qu'aux juristes. Dès que vous manipulez des informations qui identifient une personne, ou qui peuvent y ramener, vous êtes dans le sujet. Deux principes guident le geste analyste au quotidien : la **minimisation** et la **finalité**.

La minimisation : vous ne prenez que ce qui est nécessaire à la question. « Nécessaire » se juge sur le brief, pas sur la curiosité. Pour un taux de réachat par région, vous avez besoin d'une région, de dates de commande et d'un identifiant technique stable. Vous n'avez pas besoin du nom, de l'e-mail, de la date de naissance ni de l'adresse complète. Le code postal complet est déjà souvent trop fin : un département ou une région suffit, et expose moins.

La finalité : les données ont été collectées pour un but annoncé (livrer une commande, tenir un compte, mesurer l'audience dans un cadre précis). Les réutiliser pour un autre but n'est pas « juste une requête de plus ». Scorer les clients à partir des transcripts du support pour leur appliquer un prix plus élevé change la finalité. Vous ne le faites pas passer en force parce que la table est déjà dans l'entrepôt.

Cas concret. Le marketing demande « la liste des clients qui n'ont pas commandé depuis 90 jours, avec e-mail, téléphone et dernier produit acheté, pour que les magasins les appellent ». La question analytique (« quelle est la part d'inactifs à 90 jours, par magasin ? ») n'exige aucune liste nominative. L'appel en magasin, lui, est une **opération de prospection**, avec sa base légale, son opposition possible, ses scripts. Vous pouvez produire l'agrégat. Vous ne produisez la liste que si le traitement est autorisé, tracé, et limité aux personnes habilitées. En cas de doute, vous demandez au délégué à la protection des données ou au référent désigné. Vous ne tranchez pas le droit tout seul, et vous ne livrez pas « en attendant ».

> [!IMPORTANT]
> Une extraction sur votre poste est déjà un traitement. « C'est juste pour regarder » ne réduit ni le risque ni l'obligation. Moins il y a de colonnes, moins un fichier égaré fait de dégâts.

# Anonyme ou seulement pseudonyme

Une donnée **anonyme** ne permet plus, par des moyens raisonnables, de retrouver une personne, même en la croisant avec d'autres sources. Une donnée **pseudonyme** a remplacé le nom par un identifiant (`user_7f3a`), mais quelqu'un, quelque part, peut refaire le lien (table de correspondance, compte, ticket de caisse). Pour le RGPD, la donnée pseudonyme reste une **donnée personnelle**.

Conséquences pratiques.

- Un export `user_id` + historique d'achats n'est pas « anonyme » parce que la colonne s'appelle `user_id`.
- Agréger à un niveau où une case contient une seule personne (« femme, 34 ans, code postal exact, acheté un landau ») réidentifie. Ce n'est pas un agrégat, c'est une personne déguisée.
- Supprimer le nom sans supprimer les quasi-identifiants rares ne suffit pas.

| Situation | Lecture prudente |
|---|---|
| Totaux par région, milliers de clients par case | Agrégat, peu de risque de réidentification |
| `user_id` hashé, une ligne par personne | Pseudonyme, toujours personnel |
| Case à 1 ou 2 personnes (commune × âge × produit) | Réidentification facile, à regrouper ou à supprimer |
| Fichier « anonymisé » par un prestataire, sans méthode écrite | Vous ne le prenez pas pour argent comptant |

```diagram
type: compare
title: Anonyme et pseudonyme ne se traitent pas pareil
columns:
  - title: Anonyme
    tone: teal
    items:
      - Plus de réidentification raisonnable
      - Cases larges, quasi-identifiants retirés
      - Sortie possible si la question est un total
  - title: Pseudonyme
    tone: amber
    items:
      - Un identifiant remplace le nom
      - Quelqu'un peut refaire le lien
      - Toujours une donnée personnelle
  - title: Faux anonymat
    tone: rose
    items:
      - Hash sans casser le lien
      - Case d'une seule personne
      - Santé plus code postal
```

Le hash n'est pas une anonymisation. Le même e-mail produit le même hash : quiconque possède l'e-mail retrouve la ligne. Un sel secret et une suppression de la table de correspondance changent la discussion, mais c'est un choix de conception, pas un `MD5` ajouté dans le notebook le vendredi soir.

Quand vous publiez un tableau, imposez un **seuil de case** (par exemple ne pas afficher une case de moins de 20 personnes) ou regroupez les modalités rares. Cela protège les personnes et, souvent, empêche aussi de surinterpréter un taux calculé sur trois clients.

# Les segments sensibles

Certaines informations sont particulièrement protégées : santé, opinions politiques, convictions religieuses, appartenance syndicale, vie sexuelle, données biométriques, origine dite raciale ou ethnique. Vous ne les déduisez pas « parce que ce serait utile au ciblage ».

Le piège courant est le **proxy**, le substitut qui révèle la même chose sans porter le nom interdit.

- Achat répété en pharmacie de produits liés à une pathologie, pour un segment « santé fragile ».
- Rayon puériculture + prénom, pour un segment « probablement enceinte ».
- Quartier ou établissement scolaire comme substitut d'une origine.
- Horaires de connexion très réguliers le vendredi comme substitut d'une pratique religieuse.

Même quand l'attribut n'est pas une catégorie « spéciale » au sens strict, un segment peut être indéfendable : cibler des personnes en difficulté financière à partir des rejets de paiement pour leur proposer un crédit cher. La question n'est pas seulement « est-ce techniquement faisable ? ». Elle est « au service de quoi, et quel tort cela peut-il causer ? ».

Vous pouvez, dans un cadre prévu, **mesurer** un écart de traitement pour corriger une injustice (un algorithme de fraude qui vise surtout un quartier). Ce n'est pas la même chose que **produire** le segment pour exclure ces personnes. La finalité se dit dans la demande, pas dans le nom de la colonne.

```diagram
type: decision
title: Cette demande de segment est-elle livrable ?
nodes:
  - question: La question peut-elle se traiter sur un agrégat, sans liste de personnes ?
    yes: Livrer l'agrégat, pas la liste
    no: Vérifier la finalité et la base du traitement nominatif
  - question: Le segment révèle-t-il la santé, l'origine, la religion ou un proxy évident ?
    yes: Ne pas le produire, escalader au référent
    no: Documenter la finalité, minimiser les colonnes, tracer l'accès
```

# Un indicateur qui pénalise un groupe

Un indicateur neutre en apparence peut désavantager un groupe de façon systématique. Votre rôle n'est pas d'ajouter le genre ou l'origine dans tous les modèles. Il est de **ne pas livrer un score ou un classement comme s'il était un fait de nature**, sans avoir regardé qui il écrase.

Exemple. Un score « qualité de candidature » pour un programme de stage donne un fort poids à « a étudié dans une liste de cinq écoles » et à « a pu faire un stage non rémunéré de six mois ». Le score se présente comme un mérite. Il récompense surtout l'aisance financière et un vivier déjà étroit. Les candidatures hors liste sont mécaniquement en bas, même à dossier solide. Si ce score sert à écarter des dossiers avant qu'un humain les lise, il industrialise le biais.

Autre exemple, côté produit. Un indicateur « client à risque d'impayé » utilise le code postal et l'heure des achats. Il déclenche des contrôles d'identité plus fréquents dans certains quartiers. Le taux de fraude évité peut monter un peu, pendant que des clients honnêtes d'un même quartier subissent l'essentiel des frictions. Un taux global flatteur cache la concentration du tort.

Ce que vous faites quand on vous demande de « juste calculer le score ».

- Vous demandez la **décision** que le score déclenche (écarter, contrôler, tarifer, prioriser un appel).
- Vous demandez qui a validé la finalité.
- Vous regardez, lorsque c'est légitime et prévu, si le taux de décision positive varie fortement selon un groupe déjà dans les données pour un motif de contrôle (par exemple le pays de livraison, pas une origine inférée).
- Vous refusez les variables qui sont des proxies grossiers, et vous le dites par écrit.
- Vous ne vendez pas le score comme « objectif parce que c'est un calcul ».

Un écart entre groupes n'est pas à lui seul une preuve de discrimination, ni une permission d'ignorer le sujet. C'est un signal pour arrêter la mise en production automatique et en parler avec le métier, le juridique et les personnes qui portent le risque. Vous documentez ce que vous avez vu. Vous ne le faites pas disparaître en retirant la colonne du rapport final.

# Ce que vous refusez de produire

Certaines demandes se refusent, poliment, et tout de suite. Le refus fait partie du métier, au même titre qu'un dénominateur propre.

Vous ne produisez pas :

- une **liste nominative** de personnes à relancer, écarter ou surveiller, si la finalité n'est pas claire ou si un agrégat suffit ;
- une **réidentification** d'un fichier présenté comme anonyme (« remettre les e-mails, vous avez bien la table de correspondance ») ;
- un **segment santé, religion, orientation, opinion**, y compris par proxy évident, pour cibler ou exclure ;
- un **classement individuel de salariés** à partir de traces de travail (frappes, heures de badge, temps passé dans un outil) destiné à sanctionner, surtout quand ces traces n'ont pas été collectées pour cela ;
- un chiffre **faux ou maquillé** parce qu'un commanditaire veut un résultat précis ;
- une extraction « juste pour un prestataire » vers une messagerie personnelle ou un outil non prévu.

La formulation du refus est concrète. « Je ne livre pas la liste des clientes ayant acheté un test de grossesse, même agrégée finement par magasin et par semaine : la case désigne des personnes et la finalité publicitaire n'est pas acceptable. Je peux, si le sujet est la rupture de stock, donner le volume hebdomadaire national de la référence, sans autre attribut. »

Vous proposez l'alternative **légitime** quand elle existe (agrégat, seuil, autre source déjà prévue). Vous n'inventez pas une version « un peu moins illégale ». Et vous n'exécutez pas la demande en privé parce que la personne insiste en réunion. L'insistance se renvoie vers le référent, pas vers un fichier de moins en moins tracé.

# Exercices

## Exercice 1 : Quelles colonnes ?

La question est : « le taux de seconde commande à 60 jours diffère-t-il selon le canal d'acquisition, pour les inscrits France du deuxième trimestre ? » On vous propose d'extraire : e-mail, nom, téléphone, date de naissance, adresse, `user_id`, canal, date d'inscription, dates de commandes, montant. Que gardez-vous ?

<details>
<summary>Voir la solution</summary>

Vous gardez : un identifiant technique si vous devez relier inscription et commandes, le canal, la date d'inscription, les dates de commande nécessaires à la fenêtre de 60 jours. Le montant seulement si la définition du « commande » l'exige (commande payée au-dessus d'un seuil). Pays ou « France » déjà filtré, pas l'adresse.

Vous ne prenez ni l'e-mail, ni le nom, ni le téléphone, ni la date de naissance. Ils ne changent pas le taux par canal. Vous agrégerez ensuite par canal : la sortie pour le comité ne contient pas de `user_id`.

Si l'identifiant technique doit voyager, il reste dans l'environnement prévu, pas dans une pièce jointe.

</details>

## Exercice 2 : Anonyme, vraiment ?

Un prestataire envoie un fichier « 100 % anonyme » : une ligne par client, `id_hash`, code postal, année de naissance, liste des médicaments commandés sur la pharmacie en ligne du groupe. Le marketing veut en faire des segments. Que répondez-vous ?

<details>
<summary>Voir la solution</summary>

Ce fichier n'est pas anonyme. L'`id_hash` est un pseudonyme, les médicaments sont des données de santé, et le croisement code postal × année × traitement rare désigne facilement une personne. Les données de santé ne se réutilisent pas pour des segments marketing sur la foi d'un slogan « anonyme ».

Vous ne construisez pas les segments. Vous ne croisez pas ce fichier avec le CRM « pour voir ». Vous alertez le référent protection des données, vous ne stockez pas la pièce jointe dans votre dossier d'analyse, et vous demandez la suppression de la copie si elle n'aurait pas dû arriver.

Alternative possible, seulement dans un cadre déjà validé : un volume national par grande famille de produits de confort, sans données de santé et sans grain fin. Les médicaments nominatifs n'entrent pas dans cette alternative.

</details>

## Exercice 3 : Le score avant lecture humaine

On vous demande un score de priorité des candidatures internes à une mobilité. Le commanditaire propose d'y mettre : école du dernier diplôme, nombre de nuits à l'hôtel l'an passé (signe de « disponibilité »), et temps moyen de réponse aux e-mails après 20 h. Le score écarterait automatiquement le dernier quartile. Que faites-vous ?

<details>
<summary>Voir la solution</summary>

Vous ne livrez pas ce score comme filtre automatique. Les trois variables pénalisent des groupes sans mesurer la capacité à tenir le poste : l'école resserre un vivier, les nuits d'hôtel supposent une vie familiale et un contrat qui les permettent, les e-mails après 20 h récompensent une disponibilité hors temps de travail et peuvent désavantager qui a des obligations en soirée.

Vous l'écrivez, vous demandez la décision réelle (aide à la lecture ou élimination), et vous refusez l'élimination automatique. Si une analyse de mobilité est légitime, elle part du besoin du poste, pas de traces collectées pour autre chose (badge, messagerie). Vous escaladez si l'on vous presse de « le sortir quand même pour le comité de jeudi ».

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Éthique et RGPD dans l'analyse
center: "Vous ne livrez que ce que la question autorise, au grain qui ne désigne pas une personne."
points:
  - icon: filter
    title: Minimiser
    text: Pas de nom ni d'e-mail si un taux par région suffit. La finalité se respecte.
  - icon: key
    title: Pseudonyme
    text: Un identifiant à la place du nom reste une donnée personnelle. Le hash aussi.
  - icon: shield
    title: Segments sensibles
    text: Santé, religion, origine, et les proxies qui les révèlent, ne se ciblent pas.
  - icon: scale
    title: Indicateur juste
    text: Un score peut pénaliser un groupe tout en ayant l'air neutre. Regardez qui il écarte.
  - icon: alert
    title: Savoir refuser
    text: Liste nominative, réidentification, classement punitif. Proposez l'agrégat légitime.
pitfall: Accepter un fichier « anonymisé » plein de médicaments, de codes postaux et d'identifiants hashés.
remember: Un agrégat qui tient en une case d'une personne n'est pas un agrégat. Refusez-le comme une liste.
```
