---
title: Le métier d'analyste BI
description: "Rôle de l'analyste BI, frontières avec l'analyse ad hoc, l'analytics engineering et l'ingénierie de données, et livrables qui engagent l'entreprise."
duration: 55
objectives:
  - Situer l'analyste BI entre les décideurs et les données déjà préparées
  - Distinguer analyste BI, data analyst, analytics engineer et data engineer
  - Décrire le modèle sémantique, les mesures et les rapports certifiés
  - Décider ce qui reste ponctuel et ce qui doit devenir officiel
---

# Ce que l'entreprise attend de vous

Chez **Halte Marché**, enseigne alimentaire de 80 magasins, le comité de direction se réunit chaque lundi. La directrice des opérations pose toujours la même question : le chiffre d'affaires hors taxes de la semaine, par région, comparé au budget. Le contrôle de gestion pose la sienne : la marge commerciale du mois, sur le même périmètre que la comptabilité.

Ces questions ne sont pas des curiosités. Ce sont des **décisions qui reviennent**. Ouvrir le dimanche, renforcer un rayon, expliquer un écart de marge. L'analyste BI est la personne qui rend ces chiffres **stables** : même nom, même formule, même périmètre, d'une revue à l'autre.

Votre travail n'est pas d'abord de dessiner un graphique. Il est de faire en sorte qu'un directeur puisse agir sur un nombre sans le reconstruire dans un tableur, et qu'un contrôleur de gestion puisse le rapprocher de ses comptes. Quand deux réunions affichent deux « CA » différents, l'entreprise n'a plus de chiffre. Elle a une dispute.

> [!IMPORTANT]
> Un chiffre de pilotage est un engagement. Si vous le publiez comme officiel, vous devez pouvoir dire ce qu'il contient, ce qu'il exclut, à quelle heure il a été rafraîchi, et qui le défend en revue.

Le reste de ce parcours vous donne les moyens de tenir cet engagement : préparer les données, les contrôler, les modéliser, les calculer, les présenter. Ce chapitre fixe le rôle, avant les outils. Vous n'y construirez pas la plateforme qui collecte les caisses. Vous y apprendrez à rendre un chiffre défendable.

# Quatre métiers, quatre contrats

Les intitulés de poste varient. Le contrat, lui, se voit aux questions auxquelles la personne répond. Quatre rôles se côtoient autour du même chiffre. Les confondre produit soit des rapports que personne ne maintient, soit des flux techniques que le métier n'ouvre jamais.

```diagram
type: compare
title: Quatre contrats autour du même chiffre
columns:
  - title: Data analyst
    tone: amber
    items:
      - Une question, une fois
      - Explore, explique, recommande
      - Ne garantit pas le chiffre du mois suivant
  - title: Analyste BI
    tone: rose
    items:
      - Une décision qui revient
      - Modèle, mesures, rapport certifié
      - Tient la définition en revue
  - title: Analytics engineer
    tone: blue
    items:
      - Des tables métier partagées
      - Grain, clés et tests en SQL
      - Sert plusieurs rapports, pas une slide
  - title: Data engineer
    tone: teal
    items:
      - Des sources disponibles et fraîches
      - Stockage et mises à disposition
      - Ne choisit pas la formule du CA
```

Le **data analyst** répond à une question ponctuelle. Le juridique de Halte Marché demande les tickets d'un magasin sur une journée de litige. Il explore, explique le contexte, rend un fichier daté. Il ne promet pas que ce découpage existera encore en mars, ni qu'il est le CA officiel. C'est de l'analyse **ad hoc** : utile, souvent brillante, et volontairement hors du chiffre certifié.

L'**analyste BI** prend en charge ce qui doit rester vrai d'une revue à l'autre. Il nomme les notions (magasin intégré, franchisé, CA hors carburant s'il y en a), il fixe les mesures, il publie le rapport que la direction ouvre sans le refaire.

L'**analytics engineer** transforme des tables brutes, déjà déposées dans l'entrepôt, en tables métier documentées. Il écrit le grain (une ligne par magasin et par jour, par exemple), les clés, et des tests. Plusieurs rapports s'appuient ensuite sur la même table. Il ne choisit pas la page que le directeur régional lit le lundi. Son outil habituel est le SQL, souvent versionné (dbt côté tables métier). Le chargement des sources n'est pas son sujet.

Le **data engineer** fait en sorte que les données sources arrivent, se conservent et restent interrogeables. Si l'extract de caisse n'est plus là vendredi soir, c'est son incident. Il ne décide pas si les cartes cadeaux entrent dans le CA.

Dans une petite structure, une même personne porte plusieurs contrats. Ce n'est pas une raison pour les mélanger. Le matin, vous constatez qu'un extract manque. L'après-midi, vous certifiez un rapport. Ces deux gestes n'ont ni le même risque, ni le même public. Dites lequel vous êtes en train de tenir.

# Trois livrables qui engagent

L'analyste BI n'est pas jugé au nombre de pages. Trois livrables suffisent à décrire ce que l'entreprise peut vous demander, et ce que vous pouvez refuser tant qu'ils ne sont pas clairs.

```diagram
type: flow
title: Trois livrables, dans cet ordre
steps:
  - title: Modèle sémantique
    text: Grain, entités, noms métier, relations
    tone: blue
  - title: Mesures
    text: Formule, filtres, comparaison dans le temps
    tone: teal
  - title: Rapport certifié
    text: Propriétaire, fraîcheur, rapprochement
    tone: rose
```

Le **modèle sémantique** est le vocabulaire commun, structuré. Chez Halte Marché : un magasin a une région et un format (urbain, périphérie, relais). Un produit a un rayon. Une vente se lit au grain qui a été choisi, par exemple la ligne de ticket, et se rattache à un magasin, un produit, un jour. Les noms à l'écran sont ceux du métier (« Marge commerciale »), pas ceux des colonnes (`mnt_ht_v3`). Sans ce modèle, chaque rapport réinvente les jointures.

La **mesure** est une formule nommée. Le CA HT, c'est la somme des montants hors taxes des tickets encaissés, avec une règle écrite sur les avoirs, les cartes cadeaux et les magasins fermés, comparée au budget du contrôle de gestion sur le même périmètre. Une mesure écrit aussi la comparaison dans le temps (semaine précédente, budget, année comparable). Une colonne additionnée une fois dans un tableau croisé n'est pas une mesure : personne ne pourra la refaire.

Le **rapport certifié** est le support de la revue. Il a un propriétaire (vous, ou un analyste nommé), un rythme de rafraîchissement (chaque nuit, disponible à 7 h), et un rapprochement connu avec la finance. Le badge « certifié » ne veut pas dire « joli ». Il veut dire : ce total a été contrôlé, et l'écart résiduel est écrit quelque part.

Ces trois livrables s'empilent. Un rapport sans mesure nommée est une mise en page. Une mesure sans modèle est une formule que personne ne peut relire. Un modèle sans rapport peut être juste, et rester inutile.

# Tenir la revue, pas fournir un export

Le lundi, la directrice régionale Nord ouvre le rapport. Elle filtre sa région. Le CA HT est sous le budget de 4 %. Elle demande pourquoi. Votre réponse n'est pas un nouveau tableur. C'est le même chiffre, décomposé avec les mêmes règles : trafic, panier, rayon frais, trois magasins qui portent l'écart.

Tenir la revue, c'est trois services concrets.

| Service | Ce que vous garantissez | Ce que vous ne faites pas |
|---|---|---|
| Définition | Le nom à l'écran correspond à une formule écrite | Changer la formule pendant la réunion pour coller au commentaire |
| Fraîcheur | La date des données est visible | Laisser croire qu'un fichier de jeudi est le chiffre de lundi |
| Décomposition | On passe de la région au magasin sans changer de mesure | Recalculer un total parallèle dans un coin de slide |

Le contrôle de gestion est votre allié, pas un public secondaire. Si son total mensuel et le vôtre divergent, la revue des opérations ne tranche pas au feeling. Vous suspendez le caractère officiel, vous expliquez l'écart (périmètre, avoirs, cartes cadeaux, jour de clôture), vous republiez quand l'écart est compris. Le chapitre sur la qualité détaille ces contrôles. Ici, retenez la posture : **mieux vaut un chiffre en retard qu'un chiffre officiel faux**.

# Ce qui reste une analyse ponctuelle

Toute demande n'a pas à entrer dans le rapport certifié. Le critère est simple : la décision reviendra-t-elle, avec une définition stable ?

Une campagne « Rentrée » dure dix jours. Le marketing veut son CA à côté du CA officiel, au comité. Les rayons inclus changeront à la prochaine opération. Si vous pliez cette règle dans la mesure officielle, vous cassez le chiffre que la finance reconnaît. Vous pouvez rendre une **analyse à part**, clairement datée, avec le périmètre écrit sur la page. Vous la promouvez dans le modèle le jour où la décision devient récurrente et où la définition tient d'une campagne à l'autre.

Quelques signaux qu'il faut rester en ponctuel :

- la question ne sera pas reposée ;
- le périmètre est encore en discussion ;
- le demandeur veut un découpage incompatible avec le grain certifié, pour un usage unique ;
- personne n'acceptera de maintenir la règle dans six mois.

Quelques signaux qu'il faut certifier :

- deux équipes ont déjà produit deux totaux contradictoires ;
- la revue hebdomadaire attend ce nombre pour décider ;
- la finance doit pouvoir le rapprocher ;
- le même filtre est recopié à la main dans plusieurs fichiers.

> [!TIP]
> Quand vous refusez d'intégrer une demande au rapport certifié, proposez tout de suite l'alternative : une page séparée, non certifiée, ou une réponse ponctuelle. Un refus sans suite pousse le métier à reconstruire le chiffre ailleurs, et vous perdez la définition.

# Compétences, et ce que vous ne promettez pas

Le métier se tient sur quatre compétences, dans cet ordre.

1. **Le langage du métier.** Vous savez ce qu'est un budget magasin, une démarque, un magasin franchisé, un mois de clôture. Sans cela, le SQL le plus propre calcule la mauvaise chose.
2. **La modélisation décisionnelle.** Grain, faits, dimensions, relations. Vous en êtes responsable côté usage, même quand une autre équipe écrit les tables. Le module de modélisation les traitera en détail.
3. **Le calcul et le contrôle.** SQL de reporting, transformations légères, rapprochements avant publication. Un total que vous ne pouvez pas réconcilier n'est pas publiable.
4. **La restitution.** Un rapport lisible en revue, avec une question par page, des filtres que le directeur comprend, une fraîcheur visible.

Vous ne promettez pas la collecte technique des caisses, ni un algorithme de prévision des ventes. Si une prévision devient un jour un chiffre de pilotage, vous en publierez la **version retenue par le métier**, avec sa date et son propriétaire. Vous n'en fabriquez pas le moteur dans ce parcours.

Vous ne promettez pas non plus que tout le monde peut tout modifier dans l'outil. Le libre-service s'encadrera plus tard. Au départ, votre promesse est plus étroite, et plus solide : **un petit nombre de chiffres officiels, que l'entreprise peut réutiliser sans les réinterpréter**.

# Exercices

## Exercice 1 : Attribuer la demande

Halte Marché, lundi matin. Quatre demandes arrivent en même temps. Pour chacune, nommez le métier le plus adapté et le type de livrable (analyse ponctuelle, rapport certifié, table métier testée, rétablissement de la mise à disposition).

1. La directrice des opérations veut, chaque lundi, le CA HT par région comparé au budget.
2. Le juridique demande les tickets d'un magasin sur une journée, pour un litige.
3. Trois rapports calculent trois marges différentes. Il faut une table unique, au grain magasin-jour, avec une clé testée.
4. L'extract de caisse n'est plus disponible dans l'entrepôt depuis vendredi.

Solution :
<details>
<summary>Voir la solution</summary>

1. **Analyste BI**, rapport certifié : la décision revient, la définition doit rester stable, le budget est le point de comparaison.
2. **Data analyst**, analyse ponctuelle : question unique, hors chiffre officiel, fichier daté.
3. **Analytics engineer**, table métier testée. L'analyste BI s'en servira pour la mesure, il ne recopie pas trois formules dans trois rapports.
4. **Data engineer**, rétablissement de la mise à disposition. L'analyste BI ne recolle pas les fichiers à la main dans le rapport certifié : il suspend le caractère officiel tant que la fraîcheur n'est pas rétablie.

</details>

## Exercice 2 : Décrire les trois livrables

Le contrôle de gestion vous dit : « Il nous faut un tableau de la marge. » Rédigez trois phrases, une par livrable (modèle sémantique, mesure, rapport certifié). Chaque phrase doit contenir un élément vérifiable, pas un slogan.

Solution :
<details>
<summary>Voir la solution</summary>

Exemple de réponse acceptable :

- **Modèle sémantique.** Une vente se rattache à un magasin (région, format, intégré ou franchisé) et à un jour de caisse. La marge se lit au grain magasin-jour, sous le nom « Marge commerciale ».
- **Mesure.** Marge commerciale = CA HT − coût de revient des marchandises vendues, hors magasins fermés, comparable au budget du contrôle de gestion sur le même périmètre.
- **Rapport certifié.** Page mensuelle pour le comité, rafraîchie après la clôture de caisse, propriétaire nommé, écart avec le compte de marge commenté avant publication.

L'essentiel est la présence des trois niveaux : vocabulaire et grain, formule et comparaison, puis support de revue avec fraîcheur et rapprochement.

</details>

## Exercice 3 : Certifier ou laisser à part

Le marketing veut ajouter au pack du comité le CA de la campagne « Rentrée » (dix jours, rayons choisis par l'équipe, règle appelée à changer). Ce CA serait affiché à côté du CA HT officiel. Que décidez-vous, et que livrez-vous quand même ?

Solution :
<details>
<summary>Voir la solution</summary>

Vous **ne modifiez pas** la mesure de CA HT officiel : le périmètre campagne n'est pas stable, et le comité doit continuer à voir le chiffre que la finance reconnaît.

Vous livrez une **analyse à part**, datée, avec les rayons et les dates écrits sur la page, sans badge certifié. Vous la promouvez dans le modèle sémantique seulement si la décision devient récurrente et si la définition tient d'une campagne à l'autre.

Dire non sans alternative pousserait le marketing à recalculer le CA dans un classeur, et l'entreprise aurait de nouveau deux chiffres.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Le métier d'analyste BI
center: "Rendre un chiffre répétable, nommé et défendable en revue de pilotage."
points:
  - icon: users
    title: Quatre contrats
    text: "L'analyse ponctuelle explore. Vous certifiez. L'analytics engineer prépare les tables. L'ingénieur alimente."
  - icon: layers
    title: Modèle sémantique
    text: "Grain, entités, noms métier et relations : le vocabulaire commun avant le visuel."
  - icon: gauge
    title: Mesures écrites
    text: "Une formule nommée, avec ses filtres et sa règle de comparaison dans le temps."
  - icon: check
    title: Rapport certifié
    text: "Un propriétaire, une fraîcheur visible et un rapprochement avec la finance."
  - icon: target
    title: Décision qui revient
    text: "Le rapport sert une revue récurrente. Le reste reste une analyse datée, à part."
pitfall: "Tout accepter dans le rapport certifié, jusqu'à ce que plus personne ne sache quel chiffre est officiel."
remember: "Vous ne livrez pas un export. Vous livrez une définition que l'entreprise peut réutiliser."
```
