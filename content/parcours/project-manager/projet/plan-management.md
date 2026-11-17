---
title: "Écrire un plan de management court"
description: "Le plan de Halte tient en dix pages : gouvernance, planning, risques, communication, qualité. Ce qui ne change aucune décision n'y entre pas."
duration: 45
objectives:
  - "Tenir un plan de management en dix pages, utile jusqu'au 27 août"
  - "Écrire la gouvernance, le planning et le seuil d'argent sur deux pages"
  - "Renvoyer aux registres au lieu de les recopier en soixante lignes"
  - "Laisser hors du plan le contrat, la spécification et les modèles de mails"
---

# Dix pages, parce qu'Inès doit pouvoir le rouvrir

Un plan de management dit **comment le projet sera conduit**, pas ce que le connecteur fera dans le détail. Pour Halte, la question est concrète : le 1er juin, quand le jalon 3 est refusé et que l'écart est de 14 000 €, est-ce que le plan dit **qui décide, sur quel seuil, et où est l'information** ? Si oui, il est bon. S'il faut chercher dans 80 pages, il a déjà échoué.

Dix pages sont un maximum, pas un objectif de remplissage. Le plan signé avec le cadrage, le **31 mars 2027**, peut en faire huit. Il en fait dix si l'on compte une page de garde utile et une page de renvois. Il n'en fait pas quarante « pour être complet ». Complet, ici, veut dire : aucune décision courante sans règle écrite. Cela tient largement en dix pages quand on refuse d'y coller le reste du projet.

| Page | Contenu | Ce que l'on n'y développe pas |
| --- | --- | --- |
| 1 | Objectif, contraintes, hors périmètre | Le récit du brief |
| 2 | Gouvernance et seuil de 5 000 € | L'organigramme de Halte |
| 3 | Parties prenantes, dix lignes | Les fiches individuelles |
| 4 et 5 | Six jalons, dates, critère d'acceptation | Les 400 tâches |
| 6 | Budget : la répartition des 180 000 € | Le grand livre |
| 7 | Cinq risques et la règle de sortie | Un registre de 60 lignes recopié |
| 8 | Qualité : bloquant, majeur, mineur | Les 120 cas de test |
| 9 | Communication : qui reçoit quoi | Les modèles de mails |
| 10 | Où sont le contrat, le dossier, les registres | Le contrat lui-même |

Après le 1er juin, si Inès choisit l'option A, on **ajoute une page** ou l'on met à jour la page 6 : enveloppe de travail 194 000 €, décision signée, budget initial **conservé** à 180 000 €. On ne réécrit pas les dix pages. Un plan qui change de version toutes les semaines n'est plus une référence. Deux versions pour tout le projet, c'est assez : celle du 31 mars, celle d'après la seule décision qui modifie l'argent.

```diagram
type: layers
title: "Ce que les pages portent vraiment"
layers:
  - title: "Gouvernance"
    text: "Inès décide. Seuil 5 000 €. Comité le premier mardi, une heure."
  - title: "Planning"
    text: "Six jalons du 31 mars au 27 août. Un critère binaire chacun."
  - title: "Risques et qualité"
    text: "Cinq risques. Zéro bloquant pour accepter. Le registre n'est pas recopié."
  - title: "Communication"
    text: "Note du vendredi, comité, magasins. Pas un journal de bord."
  - title: "Renvois"
    text: "Le contrat, les cas de test et le détail budget vivent ailleurs."
```

# La gouvernance tient sur une page

La page 2 répond à : **qui a le droit de dire oui**. Pas à : qui est dynamique, qui est sponsor « au sens large ». Pour Halte, cinq lignes suffisent.

| Décision | Seuil | Qui décide | Qui prépare |
| --- | --- | --- | --- |
| Objectif, hors périmètre | Tout changement | Inès | Chef de projet, note avant comité |
| Enveloppe au-delà de 180 000 € | Dès le premier euro d'écart affiché | Inès | Chef de projet, options chiffrées |
| Commande absente du budget | Au-dessus de 5 000 € | Inès | Marc ou Nadia, devis à l'appui |
| Acceptation d'un jalon | Zéro bloquant | Nadia et Marc, par écrit | Chef de projet, dossier de recette |
| Gel du vendredi 16 h | La règle elle-même | Inès la confirme | Marc |
| Défauts de la semaine | Sous le seuil du jalon | Nadia, Marc, Paul | Point du mardi, pas le comité |

Le chef de projet **n'est pas** dans la colonne « qui décide », sauf pour refuser d'inscrire un sujet non préparé. Son pouvoir est de préparer, de tenir le seuil, de ne pas laisser une commande de 12 000 € passer dans le silence. Le jour où le plan dit « le chef de projet arbitre le budget », Inès n'arbitre plus, et le comité devient une chambre d'enregistrement.

Le rythme est sur la même page : comité une heure, premier mardi du mois ; point prestataire quarante minutes, chaque mardi ; photo budgétaire le dernier jour du mois. Trois rythmes, pas un calendrier de quinze cérémonies. La rétrospective n'a pas à être décrite en méthode : une ligne, « 90 minutes après la clôture, une page archivée ».

> [!IMPORTANT]
> Un seuil non chiffré (« les décisions importantes remontent ») ne sert à rien le jour des imprimantes. 5 000 € est un seuil. « Important » est une discussion.

# Le planning que l'on peut tenir à jour

Les pages 4 et 5 portent les **six jalons**, pas un diagramme de 200 lignes que personne ne met à jour après avril. Pour chaque jalon : la date, le livrable, le critère d'acceptation en une phrase, le paiement s'il y en a un. Les jalons de projet et les paiements ne coïncident pas tous. Le plan le dit, pour qu'en mai personne ne confonde « date de pilotage » et « facture due ».

| Jalon | Date | Accepté si | Paiement |
| --- | --- | --- | --- |
| Cadrage signé | 31 mars | Objectif, hors périmètre, 5 risques signés par Inès | 22 000 € |
| Conception | 30 avril | Parcours, étiquette, flux de données vus par le DPO, dossier remis à Nadia | 33 000 € |
| Recette des 4 pilotes | 31 mai | Lille, Strasbourg, Nantes, Toulouse, zéro bloquant | 33 000 € |
| Pilote réel | 30 juin | Commandes vraies sur 2 semaines, mesure lue, pas seulement un test | Aucun |
| 36 autres magasins | 30 juillet | 40 magasins en service | Aucun |
| Recette finale et transfert | 27 août | Cibles mesurées, reste à faire signé, accès transférés | 22 000 € |

110 000 € se retrouvent sur quatre lignes, pas sur six. C'est voulu. Le plan qui « met un paiement partout » invente des factures.

La page 6 est le budget **initial**, figé : intégrateur 110 000, Relais 18 000, formation 20 000, pilote 12 000, réserve 20 000. Elle rappelle que les salaires de Nadia, Marc et du chef de projet n'y sont pas. Elle rappelle le seuil de 5 000 €. Elle ne contient pas la photo de mai : cette photo est un **suivi**, elle vit dans la note mensuelle. Si on l'écrit dans le plan à chaque fois, le plan devient un journal et l'initial disparaît. Après le 1er juin, une seule mise à jour : la décision d'enveloppe, en haut de page, l'initial barré nulle part, toujours lisible en dessous.

On n'estime pas ici les 400 tâches de Léa. Elles vivent chez Quai & Co. Halte vérifie les jalons. Descendre plus bas dans le plan, c'est faire le planning du prestataire à sa place, puis ne plus le tenir.

# Risques et qualité, assez pour dire non

La page 7 ne recopie pas le registre. Elle donne la **règle** et les cinq risques du 31 mars, en une ligne chacun : événement, exposition, porteur. La règle : exposition = probabilité × impact, échelle 1 à 3 ; à 6 ou plus, le risque est sur la planche du comité **s'il demande une décision** ; un risque arrivé sort du registre et devient un problème avec une date. Le détail (réponse complète, historique) est le registre, document à part, mis à jour quand un fait change, pas quand on s'ennuie.

Pourquoi ne pas coller les soixante risques « au cas où » ? Parce que le plan est ce qu'Inès relit. Cinq risques tiennent dans sa mémoire. Le sixième, s'il naît en juin, entre au registre le mardi, et n'entre au plan que si la règle des cinq pages doit être réimprimée. En pratique, on ne réimprime pas : le registre est la pièce vivante, le plan garde la photo du 31 mars plus la règle.

La page 8 est la qualité, et elle doit suffire à **refuser un jalon sans rouvrir un débat de définition**.

- **Bloquant** : étiquette fausse, créneau non transmis à Relais, commande perdue, données client exposées. Seuil pour accepter un jalon : **zéro**.
- **Majeur** : suivi client en retard de plus de 30 minutes, reprise manuelle lourde. Acceptable seulement avec un contournement écrit.
- **Mineur** : libellé, cosmétique. Ne vient pas en comité.

Les 120 cas de test ne sont pas dans le plan. Ils sont le dossier du jalon 3, produit en conception, exécuté en mai. Le plan dit comment on s'en sert : 80 cas passés ne rachètent pas 6 bloquants. Cette phrase, page 8, évite une heure de discussion le 1er juin.

```diagram
type: compare
title: "Dans le plan, ou dans un autre document"
columns:
  - title: "Dans les dix pages"
    tone: teal
    items:
      - "Qui décide, et le seuil de 5 000 €"
      - "Les six jalons et leur critère"
      - "La règle qualité : zéro bloquant"
      - "Qui reçoit la note du vendredi"
  - title: "Ailleurs"
    tone: amber
    items:
      - "Le contrat et ses clauses"
      - "Les 120 cas de test"
      - "Le registre détaillé des risques"
      - "La spécification de l'étiquette"
```

# La communication, cinq lignes

La page 9 ne forme personne à « communiquer ». Elle empêche les doubles messages. Cinq lignes.

| Qui | Quoi | Quand | Taille |
| --- | --- | --- | --- |
| Inès, Marc, Nadia | Note de faits et de décisions à préparer | Vendredi, si la semaine a bougé un jalon, un risque ≥ 6, ou plus de 5 000 € | Une page |
| Comité | Ordre du jour et options | Deux jours avant le premier mardi | Une page |
| Paul Estève | Défauts, jalon, ce qui le concerne dans la décision | Le mardi, et après chaque comité | La partie utile, pas l'enveloppe commentée |
| 40 directeurs | Date de formation, ce qui change en caisse, ce qui ne change pas | Trois semaines avant leur session | Une page, la même pour tous |
| 4 pilotes | Calendrier de recette, droit de refuser un vendredi soir | Dès avril, puis chaque semaine de pilote | Court, nominatif |

Ce qui n'est pas dans le tableau ne s'invente pas au fil de l'eau. Pas de lettre hebdomadaire « à tout le réseau » pour raconter l'avancement : les directeurs ont besoin de leur date, pas du pourcentage de Quai & Co. Pas de copie systématique d'Inès sur les défauts du mardi : elle a la planche mensuelle, et la note du vendredi seulement si un seuil a bougé. La copier partout, c'est garantir qu'elle ne lira plus.

La page 10 est un sommaire de liens internes : contrat signé le 28 février, registre des risques, dossier de recette, photos budgétaires, journal des décisions. Un chemin, pas une pièce jointe. Le jour où quelqu'un joint le contrat dans le plan « pour que tout soit au même endroit », le plan pèse le poids du contrat et plus personne ne distingue la règle de la clause.

# Ce qui n'entre pas, même si c'est sérieux

Quelques pièces sérieuses, et qui doivent exister, **hors** des dix pages.

- **Le contrat.** Le plan dit quels jalons déclenchent les 22 000, 33 000, 33 000 et 22 000 €. Il ne commente pas la responsabilité, les pénalités, la réversibilité. Cela se lit avec le juridique, sur le contrat, le jour où la question se pose. Recopier une clause dans le plan, c'est risquer deux versions le jour où un avenant passe.
- **La spécification d'étiquette.** Livrable du 30 avril, pas règle de pilotage. Le comité ne s'en sert pas pour choisir A, B ou C.
- **Le découpage fin des tâches.** Utile à Léa, inutile à Inès. S'il entre dans le plan, le chef de projet passera août à le colorier au lieu de transférer les accès.
- **Les CV.** L'appel demandait des noms. Le plan cite Léa Ormont et Karim Besson comme dépendance, page risques. Il ne contient pas leur biographie.
- **Les modèles d'e-mail** « bienveillance », « fermeté », « relance n°3 ». Le ton se juge sur la décision écrite. Un modèle n'a jamais fait signer un compte-rendu.
- **Une analyse de risques de trente pages** refaite chaque mois. Le registre court, mis à jour, bat une analyse que l'on n'ose plus toucher.

> [!WARNING]
> Un plan de 80 pages n'est pas « plus professionnel ». C'est un cadrage, un contrat, une spécification et un journal collés ensemble. Le 1er juin, personne ne sait plus quelle page fait foi.

Le critère de relecture, avant de figer la version du 31 mars, est physique : Inès doit pouvoir retrouver le seuil de 5 000 €, le critère du jalon 3 et la liste du hors périmètre en moins de deux minutes, sans aide. Si elle ne le peut pas, le plan est trop long ou mal ordonné. On coupe. On ne rajoute pas un sommaire de sommaire.

# Exercices

## Exercice 1 : Couper un plan de quarante pages

Un collègue annonce 40 pages : (a) organigramme complet de Halte, (b) copie du contrat, (c) 200 tâches de l'intégrateur, (d) les cinq risques et la règle d'exposition, (e) charte de 12 valeurs, (f) les six jalons avec leur critère, (g) modèles de mails, (h) seuil de 5 000 € et rythme du comité. Gardez seulement ce qui a sa place dans les dix pages. Dites où va le reste.

<details>
<summary>Voir la solution</summary>

On garde **(d)**, **(f)** et **(h)**. Ce sont la règle de risque, le planning de pilotage et la gouvernance. Ils tiennent en quelques pages et servent le 1er juin.

On sort (a) : l'organigramme de l'entreprise n'aide aucune décision du projet. On sort (b) : le contrat reste le contrat, le plan ne fait que renvoyer aux quatre paiements. On sort (c) : les 200 tâches vivent chez Quai & Co, Halte tient les jalons. On sort (e) et (g) : ni les valeurs ni les modèles de mails ne disent qui décide. S'ils existent, ils vivent dans un coin de l'intranet, pas dans la référence du 31 mars.

</details>

## Exercice 2 : La page de gouvernance

Inès veut « être informée de tout » et le chef de projet « trancher vite ». Écrivez le tableau des décisions (au moins quatre lignes) qui empêche ces deux phrases de casser le seuil. Incluez les imprimantes et le jalon.

<details>
<summary>Voir la solution</summary>

| Décision | Qui décide | Règle |
| --- | --- | --- |
| Changement d'objectif ou de hors périmètre | Inès | Note avant comité, pas une information après coup |
| Écart d'enveloppe, options A, B, C | Inès | Le chef de projet prépare, il ne choisit pas |
| Achat hors budget au-dessus de 5 000 € | Inès | Les imprimantes à 12 000 € n'auraient pas dû partir sans cette ligne |
| Acceptation de jalon | Nadia et Marc | Zéro bloquant, écrit, sous 5 jours. Le chef de projet ne « valide » pas à leur place |
| Défauts sous le seuil | Nadia, avec Marc et Paul | Le mardi. Inès n'est pas copiée |

« Informée de tout » devient : informée quand un seuil bouge (note du vendredi), et décideuse sur le reste. « Trancher vite » devient : trancher ce qui est sous le seuil déjà écrit, pas l'argent.

</details>

## Exercice 3 : Cinq lignes de communication

Rédigez la grille : Inès, Paul, les 40 directeurs, les 4 pilotes, le contrôle de gestion. Pour chacun, le document, le moment, et ce qu'il ne reçoit pas.

<details>
<summary>Voir la solution</summary>

- **Inès** : ordre du jour et options, deux jours avant le comité ; note d'une page le vendredi seulement si un jalon, un risque ≥ 6 ou 5 000 € ont bougé. Elle ne reçoit pas le fil des défauts du mardi.
- **Paul** : les défauts, le jalon, la partie de la décision qui le concerne. Il ne reçoit pas le comparatif des options budgétaires A, B et C.
- **40 directeurs** : une page commune, trois semaines avant la formation (date, ce qui change, ce qui ne change pas). Ils ne reçoivent pas l'avancement mensuel en pourcentage.
- **4 pilotes** : calendrier nominatif et droit de refuser une mise en production le vendredi soir. Ils ne reçoivent pas le contrat.
- **Contrôle de gestion** : la photo du dernier jour du mois (initial, engagé, consommé, reste à faire). Il ne reçoit pas le rôle de choisir l'option. Il signale un écart de factures **avant** la séance, pas pendant.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Dix pages qui se rouvrent"
center: "Le plan dit qui décide, sur quel jalon, avec quel seuil. Le reste a un autre document."
points:
  - icon: ruler
    title: "Dix pages"
    text: "Au-delà, Inès ne retrouve plus le seuil de 5 000 € ni le critère du jalon 3."
  - icon: users
    title: "Qui dit oui"
    text: "Inès pour l'argent et le périmètre. Nadia et Marc pour accepter un jalon."
  - icon: clock
    title: "Six jalons"
    text: "Quatre paiements seulement. Une date de pilotage n'est pas une facture."
  - icon: shield
    title: "Zéro bloquant"
    text: "La page qualité suffit à refuser le jalon. Les 120 cas vivent dans le dossier de recette."
  - icon: chat
    title: "Cinq messages"
    text: "Comité, vendredi si seuil franchi, Paul, directeurs, pilotes. Pas une copie à tout le monde."
pitfall: "Coller le contrat, les 200 tâches et les modèles de mails dans le plan, puis appeler cela un pilotage."
remember: "Deux versions suffisent : le 31 mars, et la page budget mise à jour si le 1er juin change l'enveloppe."
```
