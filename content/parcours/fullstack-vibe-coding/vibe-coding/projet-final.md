---
title: "Projet final : une application fullstack"
description: Construire de bout en bout une application web complète (gestionnaire de tâches partagées), en combinant tout le parcours et un usage maîtrisé de l'IA.
duration: 90
objectives:
  - Concevoir et construire une application fullstack complète
  - Appliquer l'ensemble des compétences du parcours
  - Utiliser l'IA de façon maîtrisée dans un vrai projet
  - Tester, sécuriser et déployer l'application
---

# Le cahier des charges

Vous allez construire **« Ensemble »**, un gestionnaire de **tâches partagées** : des utilisateurs s'inscrivent, créent des **projets**, y ajoutent des **tâches**, et **invitent** d'autres utilisateurs à collaborer sur un projet.

Fonctionnalités attendues :

1. **Comptes** : inscription, connexion, déconnexion.
2. **Projets** : un utilisateur crée des projets ; il en est le propriétaire.
3. **Tâches** : dans un projet, créer, modifier (texte, statut fait/à faire), supprimer des tâches.
4. **Collaboration** : le propriétaire invite d'autres utilisateurs ; un membre voit et modifie les tâches des projets auxquels il participe, **et seulement ceux-là**.
5. **Tableau de bord** : la liste des projets de l'utilisateur, avec l'avancement.

C'est un projet **réaliste** qui mobilise tout le parcours : interface, état, routes, base de données, authentification, autorisation, tests, déploiement.

# L'architecture

```diagram
type: pipeline
title: Architecture de l'application
lanes:
  - title: Frontend (React / Next.js)
    steps:
      - title: Pages
        text: Accueil, connexion, tableau de bord, projet
      - title: Composants
        text: Listes, formulaires, cartes
      - title: Interactivité
        text: Composants client ciblés
  - title: Backend (Next.js)
    steps:
      - title: Server Actions
        text: Créer/modifier/supprimer
      - title: Validation
        text: Zod sur chaque entrée
      - title: Autorisation
        text: Propriété et appartenance vérifiées
  - title: Données et qualité
    steps:
      - title: Base (Prisma)
        text: Utilisateurs, projets, tâches, membres
      - title: Auth
        text: Bibliothèque éprouvée
      - title: Tests et CI
        text: Unitaires, E2E critiques
```

## Le modèle de données

```prisma
model Utilisateur {
  id       Int       @id @default(autoincrement())
  email    String    @unique
  nom      String
  projets  Projet[]            // projets dont il est propriétaire
  membres  Membre[]            // projets auxquels il participe
}

model Projet {
  id            Int       @id @default(autoincrement())
  nom           String
  proprietaire  Utilisateur @relation(fields: [proprietaireId], references: [id])
  proprietaireId Int
  taches        Tache[]
  membres       Membre[]
}

model Membre {        // table d'association : qui participe à quel projet
  id          Int         @id @default(autoincrement())
  projet      Projet      @relation(fields: [projetId], references: [id])
  projetId    Int
  utilisateur Utilisateur @relation(fields: [utilisateurId], references: [id])
  utilisateurId Int
  @@unique([projetId, utilisateurId])
}

model Tache {
  id        Int      @id @default(autoincrement())
  texte     String
  faite     Boolean  @default(false)
  projet    Projet   @relation(fields: [projetId], references: [id])
  projetId  Int
}
```

La relation **plusieurs-à-plusieurs** entre utilisateurs et projets (collaboration) passe par la table `Membre` (chapitre bases de données).

# Les étapes

## Étape 1 : Mise en place

Créer le projet Next.js (TypeScript, App Router), configurer ESLint/Prettier, initialiser Git avec un `.gitignore` correct (dont `.env.local`), mettre en place la base (PostgreSQL ou SQLite) et Prisma avec le schéma ci-dessus.

## Étape 2 : Authentification

Intégrer une bibliothèque d'authentification, avec inscription, connexion, déconnexion. Protéger le tableau de bord et les pages de projet (redirection si non connecté).

## Étape 3 : Projets et tâches

Les pages et Server Actions pour créer/lister des projets, et créer/modifier/supprimer des tâches dans un projet. Validation Zod sur chaque entrée, revalidation après chaque mutation.

## Étape 4 : Collaboration et autorisation

L'invitation d'un membre, et **surtout** l'autorisation : à **chaque** accès à un projet ou une tâche, vérifier que l'utilisateur est **propriétaire ou membre** du projet. C'est le cœur de la sécurité de l'application.

## Étape 5 : Qualité et déploiement

Tests unitaires (logique d'avancement, autorisations), un test de bout en bout du parcours principal, CI (lint, types, tests), puis déploiement avec une base de production et les variables d'environnement.

# La grille d'évaluation

| Critère | Ce qui est attendu |
|---|---|
| **Fonctionnalités** | Tout le cahier des charges fonctionne |
| **Autorisation** | Impossible d'accéder aux projets/tâches des autres (vérifié à chaque requête) |
| **Sécurité** | Entrées validées, mots de passe hachés, secrets hors du code, pas d'injection |
| **Qualité du code** | Lisible, composants bien découpés, logique testée |
| **Fullstack** | Base, backend et frontend cohérents et bien reliés |
| **Déploiement** | Application en ligne, CI verte, migrations propres |
| **Maîtrise** | Vous comprenez et pouvez expliquer **tout** le code, y compris ce que l'IA a aidé à écrire |

> [!IMPORTANT]
> Le critère final est le plus important de ce parcours : **comprendre tout votre code**. Utilisez l'IA autant que vous voulez pour accélérer, mais chaque ligne livrée doit être une ligne que vous **comprenez, pouvez défendre et savez déboguer**. C'est la différence entre un prototype jetable et une application dont on est responsable.

# Exercices

## Exercice 1 : La faille d'autorisation

Dans la Server Action qui bascule une tâche (`fait`/`à faire`), un développeur écrit : charger la tâche par son id, inverser `faite`, sauvegarder. Quelle vérification manque, et quelle attaque permet-elle ?

<details>
<summary>Voir la solution</summary>

Il manque l'**autorisation** : rien ne vérifie que l'utilisateur connecté est **membre ou propriétaire** du projet auquel appartient cette tâche. N'importe quel utilisateur authentifié pourrait, en devinant ou incrémentant un id de tâche, **modifier les tâches des projets d'autres personnes** (contrôle d'accès défaillant / IDOR, parcours sécurité). Correction : charger la tâche **avec son projet**, et vérifier que l'utilisateur courant est propriétaire ou membre de ce projet **avant** toute modification.

</details>

## Exercice 2 : Découper avec l'IA

Vous voulez demander de l'aide à un assistant pour l'étape 3. Formulez une première demande maîtrisée (pas « code tout le CRUD »).

<details>
<summary>Voir la solution</summary>

Une demande **ciblée et contextualisée**, par exemple :

« Dans une app Next.js (App Router, TypeScript, Prisma : voici mon modèle `Tache` et une Server Action existante pour les projets), écris une Server Action `creerTache(projetId, texte)` qui : valide `texte` avec Zod (1–200 caractères), vérifie que l'utilisateur connecté est propriétaire ou membre du projet, crée la tâche, puis revalide la page du projet. Renvoie une erreur lisible sinon. »

On garde le contrôle : un morceau précis, avec le contexte, les contraintes de validation et d'autorisation explicites. On relira ensuite selon la grille.

</details>

## Exercice 3 : Plan de tests

Quels tests écririez-vous pour sécuriser la collaboration ?

<details>
<summary>Voir la solution</summary>

- **Unitaires** : la logique d'autorisation (une fonction `peutAccederAuProjet(utilisateur, projet)` testée pour un propriétaire, un membre, un non-membre) ; le calcul d'avancement d'un projet.
- **Intégration** : les Server Actions refusent bien un utilisateur non autorisé.
- **Bout en bout** : un utilisateur A crée un projet, invite B ; B voit et modifie les tâches ; un utilisateur C (non invité) ne peut **pas** y accéder.

Le test « C ne peut pas accéder » est le plus important : il vérifie la sécurité, pas seulement le fonctionnement.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Projet final fullstack
center: Construire une vraie application de bout en bout, en combinant tout le parcours et une IA maîtrisée.
points:
  - icon: layers
    title: Architecture
    text: Frontend React/Next, backend et Server Actions, base via Prisma, le tout cohérent.
  - icon: lock
    title: Autorisation d'abord
    text: Vérifier propriété ou appartenance à chaque accès à un projet ou une tâche.
  - icon: shield
    title: Sécurité
    text: Validation Zod, mots de passe hachés, secrets hors du code, pas d'injection.
  - icon: test
    title: Qualité
    text: Tests de la logique et de l'autorisation, E2E du parcours, CI verte, déploiement propre.
  - icon: sparkles
    title: IA maîtrisée
    text: Demandes ciblées, relecture systématique, et compréhension de tout le code livré.
pitfall: Charger une tâche par son id et la modifier sans vérifier que l'utilisateur a le droit d'y accéder.
remember: Chaque ligne livrée doit être une ligne que vous comprenez, pouvez défendre et savez déboguer.
```
