---
title: "Dev, recette et production BI"
description: "Trois environnements pour Ventes Halte. Le dev porte des données anonymisées, la recette sert à valider le sens, et seules deux personnes du groupe bi-prod-publish peuvent ouvrir la production."
duration: 35
objectives:
  - "Donner un rôle distinct à dev, recette et production"
  - "Anonymiser les données personnelles avant qu'elles n'entrent en dev"
  - "Valider un changement de sens en recette sur les totaux réels"
  - "Réserver la publication en production au groupe nommé"
---

# Trois endroits, trois contrats

Le mart Ventes Halte n'existe pas en un seul exemplaire « sur l'entrepôt ». Il existe en **dev**, en **recette** et en **prod**. Chacun a un droit d'écriture, un jeu de données et une question à laquelle il a le droit de répondre.

| | Dev | Recette | Prod |
| --- | --- | --- | --- |
| Question | « Est-ce que mon SQL tient ? » | « Est-ce que le CA veut encore dire 6 240 000 € ? » | « Est-ce que Nora peut présenter ? » |
| Données | Anonymisées, échantillon | Vraies, accès limité au groupe BI | Vraies, modèle publié, RLS |
| Écriture | L'auteur du changement | Le groupe BI | Le compte `ci-bi`, après accord |
| CA témoin de mars | Absent, ou brouillé | 6 240 000 € | 6 240 000 € |

Mélanger les trois questions dans un seul schéma prod est la panne classique : on débogue sur le chiffre de la direction, ou on certifie un modèle qui n'a vu que quatre magasins fictifs.

```diagram
type: flow
title: "Ce que chaque environnement a le droit de prouver"
steps:
  - title: "Dev"
    text: "SQL et clés, sur un échantillon sans données personnelles"
    tone: violet
  - title: "Recette"
    text: "Le sens du CA, mars à 6 240 000 €, accès groupe BI"
    tone: blue
  - title: "Accord"
    text: "bi-prod-publish, et Camille si la mesure change de sens"
    tone: amber
  - title: "Prod"
    text: "Compte ci-bi uniquement. Nora lit, elle ne publie pas."
    tone: teal
  - title: "Refus"
    text: "Pas de copie prod sur un poste, pas de dev publié tel quel."
    tone: rose
```

# Dev, avec des données anonymisées

Le dev est le bac de Lina. Il a le droit d'être cassé. Il n'a pas le droit de contenir une personne réelle.

La caisse, en amont, connaît des identifiants de fidélité, parfois un nom, parfois un jeton de paiement, et le nom du magasin. Le mart publié, lui, est au grain de la ligne de ticket **sans** client. Le danger est la copie de staging que l'on ramène en dev « pour aller plus vite ». On anonymise **à l'extraction** qui alimente le dev, pas dans la bonne volonté de ne pas ouvrir la colonne.

Règles de l'échantillon dev :

- aucun nom, aucun e-mail, aucun jeton de carte, aucun identifiant caissier en clair : ces colonnes ne sont pas copiées ;
- `ligne_id` et identifiants techniques sont hachés ;
- le nom du magasin devient `Magasin Nord 1`, un magasin fictif par région, pour que la règle de région se teste sans montrer le réseau ;
- les montants sont ceux de l'échantillon, ou un coefficient, pas le CA réel d'un magasin que l'on pourrait reconnaître ;
- le total de contrôle 6 240 000 € **n'est pas** en dev. Il ne servirait qu'à y coller la prod.

Quatre magasins fictifs suffisent à casser une jointure et à voir une clé en double. Ils ne suffisent pas à dire que le CA de mars est le bon. C'est volontaire.

> [!WARNING]
> Un export prod « le temps d'un bug » vers le poste de Lina annule l'anonymisation. Le bug se reproduit en recette, sur un accès déjà limité, ou sur l'échantillon.

# Recette, pour valider le sens

La recette répond à la question que le dev ne peut pas trancher. Les magasins y ont leur vrai nom. Mars 2026 y vaut **6 240 000 €** HT, la marge **2 184 000 €**, la quantité **624 000**, l'Ouest **1 560 000 €**. Nora et Lina peuvent relire une mesure avant que la direction ne la voie.

L'accès est le **groupe BI**, pas l'entreprise. Un responsable de région ne se promène pas en recette : son chiffre, il le lit en prod, filtré. La recette n'est pas un deuxième produit. C'est la répétition.

On y valide trois choses, et seulement après un bi-ci vert :

1. le mois témoin retombe (CA, marge, quantité, N-1 à 6 000 000 €) ;
2. le reste de réconciliation est à 0 € avec les lignes de 15 000 € et 3 000 € ;
3. l'identité de Marie ne voit que l'Ouest, l'identité direction voit le réseau, une identité sans région ne voit rien.

Un changement purement technique (renommage interne, partition) passe aussi par la recette, avec le même total. S'il fait bouger 6 240 000 €, ce n'était pas un renommage.

# Prod, et qui a le droit de publier

La production est le modèle que Nora présente et que Marie ouvre. L'écriture n'appartient pas à leur compte.

Le droit de **publier** est le groupe `bi-prod-publish` : **Lina Costa** et son binôme **Adam Leroy**. L'un des deux approuve. Le compte de service `ci-bi` applique alors le job. Un compte personnel, y compris celui de Lina, a la lecture en prod et l'écriture en dev. Il n'a pas l'écriture prod. `dbt build --target prod` lancé depuis un portable échoue par les droits de l'entrepôt, pas par une consigne.

Ce droit technique ne suffit pas quand le **sens** d'une mesure change (formule, filtre, taxes, grain). Camille Renard accepte alors la demande **avant** l'approbation de Lina ou d'Adam. Un rebuild qui ne change pas le sens (même SQL, nouvelle partition) n'a pas besoin de Camille. Il a quand même besoin de `bi-prod-publish`.

Nora lit la prod. Elle peut construire en recette. Elle ne publie pas. Un analyste qui « pousse un petit DAX de secours » en prod sort du contrat : la mesure vit dans le modèle versionné, pas dans un fichier local.

| Geste | Nora | Camille | Lina ou Adam | Compte personnel |
| --- | --- | --- | --- | --- |
| Lire la prod | Oui | Oui | Oui | Oui, s'il est autorisé |
| Builder le dev | Non | Non | Oui | Oui, le sien |
| Accepter un changement de sens | Non | Oui | Non, elle ne signe pas le sens | Non |
| Approuver la publication | Non | Non | Oui | Non |
| Écrire la prod | Non | Non | Non | Non, seul `ci-bi` écrit |

# Ce qui n'a pas le droit de traverser

Trois traversées sont interdites, même « pour cette fois ».

- **Prod vers dev**, avec les vrais noms ou les vrais montants. L'échantillon anonymisé fait le chemin inverse, et il ne revient pas enrichi.
- **Dev vers prod**, sans recette. Quatre magasins fictifs ne certifient pas mars.
- **Recette vers la salle**, comme si c'était la prod. Un total de recette peut être en cours de correction. Seul le tag publié, avec sa fraîcheur, se présente.

Le mot de passe partagé du compte `ci-bi` est un quatrième travers. Personne ne l'utilise pour « débloquer ». L'approbation passe par la forge. Si Adam est absent, Lina publie. Si les deux sont absents, on présente le dernier tag, on ne crée pas un troisième éditeur le dimanche soir.

# Exercices

## Exercice 1 : Le vrai CA de l'Ouest en dev

Lina veut copier la prod dans le dev pour comprendre pourquoi l'Ouest ne tombe pas sur 1 560 000 €. Que lui répondez-vous, et où reproduit-elle le contrôle ?

<details>
<summary>Voir la solution</summary>

On refuse la copie. Le dev est anonymisé : pas de vrais noms, pas de vrais montants, pas du CA de contrôle. Un export vers son poste casse cette règle.

Elle reproduit le contrôle en recette, où mars vaut 6 240 000 € et l'Ouest 1 560 000 €, avec un accès groupe BI. Le dev reste sur `Magasin Nord 1` et sert à casser la jointure, pas à reconnaître un magasin.

</details>

## Exercice 2 : Qui appuie sur publier ?

Une demande modifie le filtre des retours. Nora l'a relue en recette. Camille n'a pas répondu. Le portable de Lina peut lancer un build prod. Qui a le droit de publier, et que manque-t-il ?

<details>
<summary>Voir la solution</summary>

Le filtre des retours change le sens du CA. Il faut l'accord écrit de Camille, puis l'approbation de Lina ou d'Adam (`bi-prod-publish`). Le compte `ci-bi` applique. Nora ne publie pas, même après une bonne relecture.

Le portable de Lina ne doit pas pouvoir écrire en prod. S'il le peut, c'est un trou de droits, pas une solution d'attente. On ne publie pas dimanche depuis ce portable en attendant Camille.

</details>

## Exercice 3 : Une recette trop propre

Le mois témoin a été vérifié seulement en dev, sur quatre magasins fictifs dont la somme fait 80 000 €. Les tests de clés sont verts. Peut-on publier ? Qu'est-ce que la recette doit encore montrer ?

<details>
<summary>Voir la solution</summary>

Non. Le dev prouve que le SQL tourne sans donnée personnelle. Il ne prouve pas le sens. La recette doit montrer 6 240 000 € de CA, 2 184 000 € de marge, 624 000 de quantité, 6 000 000 € de N-1, l'Ouest à 1 560 000 €, et un reste de réconciliation à 0 €.

Elle doit aussi rejouer trois identités : Marie (Ouest seul), direction (réseau), compte sans région (rien). Des clés vertes sur un échantillon ne remplacent aucun de ces totaux.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Trois environnements
center: "Dev anonymisé, recette sur le vrai mars, prod écrite seulement par ci-bi après un accord nommé."
points:
  - icon: lock
    title: Dev sans personnes
    text: "Pas de nom, pas de jeton, magasins fictifs. Le 6 240 000 € n'y est pas."
  - icon: scale
    title: Recette
    text: "Groupe BI. CA, marge, quantité, N-1 et l'Ouest à 1 560 000 €."
  - icon: users
    title: Qui publie
    text: "Lina ou Adam dans bi-prod-publish. Nora lit. Camille signe le sens."
  - icon: server
    title: ci-bi
    text: "Seul ce compte écrit la prod. Un portable personnel n'a pas le droit."
  - icon: alert
    title: Traversées
    text: "Pas de prod copiée en dev, pas de dev publié, pas de recette présentée en salle."
pitfall: "Copier la prod sur le poste de Lina pour déboguer l'Ouest. L'anonymisation est alors déjà perdue."
remember: "Un changement de filtre sur les retours attend Camille, puis Lina ou Adam. Le build du portable ne publie pas."
```
