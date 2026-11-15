---
title: Travailler avec un ORM (Prisma)
description: Le rôle d'un ORM, définir un schéma, les migrations, les requêtes et relations, et relier une base à une application Next.js.
duration: 55
objectives:
  - Expliquer ce qu'apporte un ORM
  - Définir un schéma et générer des migrations
  - Lire et écrire des données, y compris avec des relations
  - Éviter les pièges courants (N+1, connexions)
---

# Qu'est-ce qu'un ORM ?

Écrire du SQL à la main fonctionne, mais devient répétitif et source d'erreurs dans une grande application. Un **ORM** (*Object-Relational Mapping*) fait le pont entre les **tables** de la base et les **objets** de votre code : vous manipulez des objets typés, l'ORM génère le SQL.

**Prisma** est l'ORM le plus utilisé dans l'écosystème TypeScript/Next.js. Ses atouts : un **schéma** central lisible, des **types TypeScript générés automatiquement** (autocomplétion et sécurité de bout en bout), un système de **migrations**, et une API de requêtes claire. (Alternatives : Drizzle, plus proche du SQL ; ou le pilote `pg` brut pour un contrôle total, comme ce site.)

# Définir un schéma

Le schéma Prisma décrit les modèles (tables) dans un fichier `schema.prisma` :

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Utilisateur {
  id       Int       @id @default(autoincrement())
  email    String    @unique
  nom      String
  articles Article[]            // relation : un utilisateur a plusieurs articles
  creeLe   DateTime  @default(now())
}

model Article {
  id        Int         @id @default(autoincrement())
  titre     String
  contenu   String
  publie    Boolean     @default(false)
  auteur    Utilisateur @relation(fields: [auteurId], references: [id])
  auteurId  Int
}
```

Le schéma est **la source de vérité** : les relations, contraintes et types y sont déclarés une fois, et tout le reste (types, client de requêtes) en découle.

# Les migrations

Une **migration** traduit un changement de schéma en modification de la base, de façon **versionnée** et **reproductible** :

```bash
npx prisma migrate dev --name creation_articles   # créer et appliquer une migration (dev)
npx prisma migrate deploy                          # appliquer les migrations (production)
npx prisma generate                                # (re)générer le client typé
```

Chaque migration est un fichier **versionné dans Git** : toute l'équipe et tous les environnements appliquent les **mêmes** changements, dans le même ordre. On ne modifie **jamais** la base de production à la main.

# Lire et écrire

Le **client** Prisma est typé d'après le schéma : l'éditeur connaît vos modèles et leurs champs.

```ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Créer
const article = await prisma.article.create({
  data: { titre: "Bonjour", contenu: "…", auteurId: 1 },
});

// Lire avec filtre, tri, pagination
const articles = await prisma.article.findMany({
  where: { publie: true },
  orderBy: { id: "desc" },
  take: 10,
});

// Lire un seul
const un = await prisma.article.findUnique({ where: { id: 42 } });

// Modifier
await prisma.article.update({ where: { id: 42 }, data: { publie: true } });

// Supprimer
await prisma.article.delete({ where: { id: 42 } });
```

## Les relations

```ts
// Charger les articles AVEC leur auteur (évite une requête par article)
const articles = await prisma.article.findMany({
  include: { auteur: true },
});
console.log(articles[0].auteur.nom);   // typé

// Créer un utilisateur et ses articles d'un coup
await prisma.utilisateur.create({
  data: {
    email: "a@b.fr",
    nom: "Alice",
    articles: { create: [{ titre: "Premier", contenu: "…" }] },
  },
});
```

> [!WARNING]
> Le piège **N+1** : charger une liste, puis faire une requête **par élément** pour sa relation (une requête pour les articles, puis une par article pour l'auteur) = N+1 requêtes, très lent. Utilisez **`include`** (ou `select`) pour tout charger en une fois. C'est l'optimisation la plus fréquente avec un ORM.

> [!TIP]
> Prisma protège contre l'**injection SQL** : les valeurs sont toujours paramétrées. Un ORM n'exempte toutefois **pas** de valider les entrées (avec Zod) ni de vérifier les **droits** : il sécurise la couche SQL, pas la logique métier.

# Relier à Next.js

Dans une application Next.js, on crée **une seule** instance du client, réutilisée partout, pour éviter d'ouvrir trop de connexions (surtout avec le rechargement à chaud en développement) :

```ts
// lib/db.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const db = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

On importe ensuite `db` dans les composants serveur, les Server Actions et les routes d'API :

```ts
import { db } from "@/lib/db";
const articles = await db.article.findMany({ where: { publie: true } });
```

> [!IMPORTANT]
> Le client de base de données ne s'utilise **que côté serveur** (composants serveur, Server Actions, routes d'API), jamais dans un composant client, où le code (et l'accès à la base) partirait au navigateur. C'est à la fois une question de fonctionnement et de sécurité.

# Exercices

## Exercice 1 : Lire la relation

Avec le schéma du chapitre, écrivez la requête Prisma qui renvoie les 5 derniers articles publiés **avec le nom de leur auteur**, sans provoquer de N+1.

<details>
<summary>Voir la solution</summary>

```ts
const articles = await db.article.findMany({
  where: { publie: true },
  orderBy: { id: "desc" },
  take: 5,
  include: { auteur: true },
});
// articles[0].auteur.nom est disponible, en une seule requête
```

`include: { auteur: true }` charge l'auteur en une fois, évitant une requête par article.

</details>

## Exercice 2 : Migration ou modification manuelle ?

Un collègue ajoute une colonne directement dans la base de production avec un outil graphique, « pour aller vite ». Pourquoi est-ce une mauvaise idée ?

<details>
<summary>Voir la solution</summary>

La base de production ne correspond plus au **schéma** ni aux **migrations** versionnées : les autres environnements (développement, recette) et les collègues n'ont pas ce changement, ce qui provoque des incohérences et des bugs difficiles à diagnostiquer. Le prochain `migrate` peut échouer ou écraser la modification. Il faut **toujours** passer par une **migration** : modifier le schéma, générer la migration, la versionner dans Git, et l'appliquer à tous les environnements de la même façon.

</details>

## Exercice 3 : Le N+1

Ce code est lent sur une liste de 100 articles. Pourquoi, et comment corriger ?

```ts
const articles = await db.article.findMany();
for (const a of articles) {
  a.auteur = await db.utilisateur.findUnique({ where: { id: a.auteurId } });
}
```

<details>
<summary>Voir la solution</summary>

C'est un **N+1** : 1 requête pour les articles, puis **une requête par article** pour son auteur (100 requêtes), soit 101 au total. Correction : charger les auteurs **en une fois** avec `include` :

```ts
const articles = await db.article.findMany({ include: { auteur: true } });
```

Une seule requête (ou deux optimisées par Prisma), au lieu de 101.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Travailler avec un ORM (Prisma)
center: Manipuler la base via des objets typés, avec un schéma central et des migrations versionnées.
points:
  - icon: layers
    title: ORM
    text: Pont entre tables et objets ; types générés, autocomplétion, SQL généré.
  - icon: file
    title: Schéma
    text: Source de vérité ; modèles, champs, relations et contraintes déclarés une fois.
  - icon: loop
    title: Migrations
    text: Changements versionnés dans Git, appliqués partout à l'identique ; jamais à la main.
  - icon: database
    title: Requêtes
    text: create, findMany, update, delete ; include pour charger les relations.
  - icon: alert
    title: Pièges
    text: Éviter le N+1 avec include ; une seule instance du client, côté serveur uniquement.
pitfall: Charger une relation par une requête par élément (N+1) au lieu d'un include.
remember: Un ORM sécurise la couche SQL, pas la logique ; validez les entrées et vérifiez les droits.
```
