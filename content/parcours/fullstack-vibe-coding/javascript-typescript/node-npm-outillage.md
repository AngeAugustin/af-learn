---
title: Node.js, npm et l'outillage JavaScript
description: JavaScript côté serveur avec Node.js, la boucle d'événements, les paquets npm et le fichier package.json, les versions et le fichier de verrouillage, les scripts, les modules ES et les outils de construction.
duration: 55
objectives:
  - Expliquer ce qu'est Node.js et le fonctionnement de la boucle d'événements
  - Gérer les dépendances d'un projet avec npm (ou pnpm) et package.json
  - Comprendre le versionnage sémantique et le rôle du fichier de verrouillage
  - Utiliser les scripts, les variables d'environnement et les outils de construction
---

# JavaScript hors du navigateur

**Node.js** exécute du JavaScript **en dehors du navigateur**, sur un serveur ou sur votre poste. Il repose sur le moteur V8 (celui de Chrome) et ajoute ce qu'un navigateur n'a pas : accès aux **fichiers**, au **réseau**, aux **processus**. C'est lui qui fait tourner Next.js, les outils de construction, les tests et la plupart de l'outillage du web moderne. D'autres environnements existent (**Deno**, **Bun**), compatibles avec une grande partie de l'écosystème.

```javascript
// serveur.mjs - un serveur HTTP minimal, sans dépendance
import { createServer } from "node:http";

const serveur = createServer((requete, reponse) => {
  reponse.writeHead(200, { "Content-Type": "application/json" });
  reponse.end(JSON.stringify({ message: "Bonjour", chemin: requete.url }));
});

serveur.listen(3000, () => console.log("http://localhost:3000"));
```

```bash
node serveur.mjs
```

En pratique, on écrit rarement un serveur à la main : on utilise un framework (**Next.js** dans ce parcours, ou des frameworks d'API comme **Express**, **Fastify** ou **Hono**).

## La boucle d'événements

Node.js exécute votre code JavaScript sur **un seul fil d'exécution**. Il reste pourtant capable de servir des milliers de requêtes simultanées, car les opérations lentes (lire un fichier, interroger une base, appeler une API) sont **asynchrones** : Node lance l'opération, passe à autre chose, et exécute la suite (le *callback* ou la fin du `await`) quand le résultat arrive. C'est la **boucle d'événements**.

```diagram
type: flow
title: Une requête dans la boucle d'événements
steps:
  - title: Requête reçue
    text: Le gestionnaire démarre
    tone: blue
  - title: await db.query(...)
    text: La requête part vers la base ; Node traite d'autres requêtes pendant ce temps
    tone: teal
  - title: Résultat disponible
    text: La boucle reprend la suite du gestionnaire
    tone: teal
  - title: Réponse envoyée
    text: Le fil est de nouveau libre
    tone: violet
```

> [!WARNING]
> La conséquence : un **calcul long et synchrone** (boucle sur des millions d'éléments, hachage de mot de passe synchrone, `fs.readFileSync` sur un gros fichier dans une route) **bloque tout le serveur** pendant sa durée, aucune autre requête n'est servie. Utilisez les versions asynchrones des API, et déplacez les calculs lourds vers des tâches de fond ou des *worker threads*.

# Les paquets et npm

**npm** (installé avec Node.js) gère les **dépendances** : des bibliothèques publiées sur le registre npm. Le fichier **`package.json`** décrit le projet :

```json
{
  "name": "mon-application",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "lint": "eslint ."
  },
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "zod": "^4.0.0"
  },
  "devDependencies": {
    "typescript": "^5.9.0",
    "vitest": "^4.0.0"
  }
}
```

- **`dependencies`** : nécessaires à l'exécution de l'application.
- **`devDependencies`** : nécessaires seulement au développement (tests, typage, lint).
- **`scripts`** : des commandes nommées, lancées par `npm run dev`, `npm test`…

```bash
npm install                 # installe tout ce que décrit package.json (et le fichier de verrouillage)
npm install zod             # ajoute une dépendance
npm install -D vitest       # ajoute une dépendance de développement
npm run build               # lance le script "build"
npx prisma migrate dev      # exécute un outil installé dans le projet
npm outdated                # liste les dépendances qui ont des versions plus récentes
```

> [!TIP]
> **pnpm** et **Yarn** sont des alternatives à npm, avec les mêmes concepts. pnpm est apprécié pour sa rapidité et son économie d'espace disque. Une équipe choisit **un seul** gestionnaire par projet, et ne mélange jamais leurs fichiers de verrouillage.

## Les versions sémantiques

Les paquets suivent le **versionnage sémantique** (*semver*) : `MAJEURE.MINEURE.CORRECTIF`.

| Changement | Signification | Exemple |
|---|---|---|
| **Correctif** | Corrections, sans changement d'API | 4.1.2 → 4.1.3 |
| **Mineure** | Nouvelles fonctionnalités compatibles | 4.1.3 → 4.2.0 |
| **Majeure** | Changements **incompatibles** : lire le guide de migration | 4.2.0 → 5.0.0 |

Dans `package.json`, `^4.1.2` accepte toutes les versions `4.x.x` à partir de 4.1.2 (mais pas 5.0.0), `~4.1.2` seulement les correctifs `4.1.x`.

## Le fichier de verrouillage

`package-lock.json` (ou `pnpm-lock.yaml`) enregistre la **version exacte** de chaque paquet installé, y compris les dépendances de vos dépendances. Il garantit que toute l'équipe, la CI et la production installent **exactement la même chose**.

- Il se **versionne** dans Git.
- En CI et en production, on utilise `npm ci` : installation stricte à partir du fichier de verrouillage, qui échoue s'il ne correspond pas à `package.json`.
- Le dossier `node_modules/` ne se versionne **jamais** (il se reconstruit avec `npm ci`).

## Les dépendances, une responsabilité

Chaque paquet ajouté est du code **que vous exécutez** sans l'avoir écrit, avec ses propres dépendances. Avant d'ajouter une dépendance :

- en a-t-on vraiment besoin, ou quelques lignes suffisent-elles ?
- est-elle **maintenue** (dernière version, activité, nombre d'utilisateurs) ?
- le **nom** est-il exact ? Des paquets malveillants imitent des noms connus (typosquattage).

Puis on garde les dépendances **à jour** par petits incréments (outils comme Dependabot ou Renovate) et on surveille les vulnérabilités connues avec `npm audit` ou l'analyse de la plateforme de code.

# Modules, variables d'environnement et construction

## Les modules ES

Le JavaScript moderne utilise les **modules ES** (`import` / `export`), activés dans Node par `"type": "module"` dans `package.json` ou l'extension `.mjs`. L'ancien système **CommonJS** (`require` / `module.exports`) existe encore dans de nombreuses bibliothèques ; Node sait importer les deux, mais on écrit le code neuf en modules ES. Les modules intégrés à Node s'importent avec le préfixe `node:` (`node:fs/promises`, `node:path`, `node:crypto`).

## Les variables d'environnement

La configuration qui change selon l'environnement (adresse de la base, clés d'API) se lit dans les **variables d'environnement**, jamais en dur dans le code :

```javascript
const urlBase = process.env.DATABASE_URL;
if (!urlBase) throw new Error("DATABASE_URL manquante");
```

En développement, un fichier `.env` (non versionné, listé dans `.gitignore`) les définit localement ; Next.js le charge automatiquement, et Node.js le peut avec `node --env-file=.env`. Un fichier `.env.example` versionné documente les variables attendues, sans valeurs secrètes.

## Les outils de construction

Le code que vous écrivez (TypeScript, JSX, modules, CSS moderne) n'est pas toujours celui qu'exécute le navigateur. Les **outils de construction** le transforment : compilation de TypeScript, regroupement des modules en fichiers optimisés (*bundling*), minification, découpage du code. **Vite** est l'outil de référence pour les projets front-end hors framework ; Next.js intègre son propre outil (**Turbopack**). Vous les configurez rarement, mais savoir qu'ils existent aide à comprendre les messages d'erreur et la différence entre `npm run dev` (serveur de développement, rechargement à chaud) et `npm run build` (version optimisée pour la production).

# Exercices

## Exercice 1 : Le serveur figé

Une route d'API calcule un rapport en parcourant 50 millions de lignes dans une boucle synchrone. Pendant les 8 secondes du calcul, plus personne ne peut charger le site. Pourquoi, et que faire ?

<details>
<summary>Voir la solution</summary>

Node.js exécute le JavaScript sur **un seul fil** : la boucle synchrone l'occupe entièrement, la boucle d'événements ne peut traiter aucune autre requête. Solutions : faire le calcul **dans la base** (une requête SQL d'agrégation est bien plus efficace), le déplacer dans une **tâche de fond** dont on récupère le résultat plus tard, ou l'exécuter dans un *worker thread*. Et mettre en cache le rapport s'il est demandé souvent.

</details>

## Exercice 2 : « Chez moi ça marche »

Un développeur a ajouté une dépendance avec `npm install`, mais n'a commité que `package.json`. La CI échoue avec une version différente de la bibliothèque. Qu'est-ce qui manque, et quelles pratiques adopter ?

<details>
<summary>Voir la solution</summary>

Il manque le **fichier de verrouillage** (`package-lock.json`), qui fixe les versions exactes de toutes les dépendances. Pratiques : toujours commiter le fichier de verrouillage avec `package.json` ; utiliser `npm ci` en CI et en production ; ne jamais commiter `node_modules/` ; un seul gestionnaire de paquets par projet.

</details>

## Exercice 3 : Lire une version

Votre `package.json` indique `"zod": "^3.22.0"`. La version 3.25.1 et la version 4.0.0 sont publiées. Laquelle sera installée lors d'une nouvelle installation sans fichier de verrouillage, et pourquoi ne passe-t-on pas automatiquement à la 4 ?

<details>
<summary>Voir la solution</summary>

La **3.25.1** : `^3.22.0` accepte les versions mineures et les correctifs de la version majeure 3, mais pas la 4.0.0. Une version **majeure** peut contenir des changements incompatibles : on la fait à la main, en lisant le guide de migration, en adaptant le code et en lançant les tests.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Node.js, npm et l'outillage JavaScript
center: Node exécute le JavaScript côté serveur ; npm gère des dépendances qu'il faut choisir et tenir à jour.
points:
  - icon: server
    title: Node.js
    text: JavaScript hors du navigateur, accès aux fichiers et au réseau.
  - icon: loop
    title: Boucle d'événements
    text: Un seul fil, des E/S asynchrones ; ne jamais bloquer avec un calcul synchrone long.
  - icon: list
    title: package.json
    text: Dépendances, dépendances de développement et scripts nommés.
  - icon: lock
    title: Verrouillage
    text: Fichier de verrouillage versionné, npm ci en CI, jamais node_modules dans Git.
  - icon: shield
    title: Dépendances
    text: Utiles, maintenues, bien nommées ; mises à jour par petits pas.
  - icon: tool
    title: Construction
    text: Vite, Turbopack ; dev pour développer, build pour la production.
pitfall: Ajouter une dépendance pour trois lignes de code, sans vérifier son nom ni sa maintenance.
remember: Chaque paquet installé est du code que vous exécutez sans l'avoir écrit.
```
