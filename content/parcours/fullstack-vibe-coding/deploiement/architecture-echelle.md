---
title: Architecture, conteneurs et montée en charge
description: Concevoir une application sans état qui peut tourner sur plusieurs instances, mettre en cache aux bons niveaux (navigateur, CDN, application, Redis), conteneuriser avec Docker, comprendre CORS, et choisir entre monolithe modulaire et microservices.
duration: 60
objectives:
  - Concevoir une application sans état, prête à tourner sur plusieurs instances
  - Choisir le bon niveau de cache et gérer son invalidation
  - Conteneuriser une application avec Docker et Docker Compose
  - Expliquer CORS et le configurer correctement
  - Argumenter le choix entre monolithe modulaire et microservices
---

# Une application sans état

Quand le trafic augmente, deux options : une machine **plus puissante** (montée en charge verticale, vite limitée) ou **plusieurs instances** de l'application derrière un **répartiteur de charge** (montée en charge horizontale). La seconde suppose que l'application soit **sans état** : n'importe quelle instance doit pouvoir traiter n'importe quelle requête.

```diagram
type: layers
title: Une architecture web qui monte en charge
layers:
  - title: CDN
    text: Fichiers statiques et pages mises en cache au plus près des utilisateurs
  - title: Répartiteur de charge
    text: Distribue les requêtes entre les instances
  - title: Instances de l'application (sans état)
    text: Identiques et interchangeables ; on en ajoute ou en retire selon la charge
  - title: Services partagés
    text: Base de données, Redis (cache, sessions, files), stockage objet
```

Ce qui ne doit **pas** rester dans une instance :

| État | Où le mettre |
|---|---|
| Sessions des utilisateurs | Base de données, Redis, ou cookie signé/chiffré |
| Fichiers téléversés | Stockage objet |
| Cache partagé | Redis |
| Tâches en cours | File de tâches |
| Compteurs de limitation de débit | Redis |

> [!TIP]
> Les hébergeurs « serverless » (Vercel, Netlify, Cloudflare) poussent naturellement vers cette architecture : chaque requête peut être servie par une nouvelle instance. Une application pensée sans état fonctionne aussi bien sur un serveur, sur dix, ou en serverless.

# Le cache

Le moyen le plus efficace d'accélérer une application est de **ne pas refaire** un travail déjà fait. Le cache existe à plusieurs niveaux :

| Niveau | Exemple | Ce qu'on y met |
|---|---|---|
| **Navigateur** | En-tête `Cache-Control` | Fichiers statiques versionnés (`/_next/static/...`) mis en cache un an |
| **CDN** | Vercel, Cloudflare, CloudFront | Pages publiques, images, fichiers statiques |
| **Framework** | Cache des données et du rendu de Next.js | Résultats de `fetch`, pages statiques, revalidation par chemin ou étiquette |
| **Application** | Redis | Résultats de calculs coûteux, réponses d'API externes, sessions |
| **Base de données** | Index, vues matérialisées | Requêtes fréquentes et coûteuses |

```ts
// Le schéma « cache-aside » avec Redis
async function statistiquesProjet(id: string) {
  const cle = `stats:projet:${id}`;
  const enCache = await redis.get(cle);
  if (enCache) return JSON.parse(enCache);

  const stats = await calculerStatistiques(id); // requête coûteuse
  await redis.set(cle, JSON.stringify(stats), { EX: 300 }); // expire dans 5 minutes
  return stats;
}

// Après une modification, on invalide
await redis.del(`stats:projet:${id}`);
```

> [!WARNING]
> Le cache crée deux risques : des données **périmées** (prévoir une **durée d'expiration** et une **invalidation** après chaque modification) et des **fuites** de données (ne **jamais** mettre en cache CDN une réponse personnalisée ou privée : `Cache-Control: private, no-store` pour les pages d'un utilisateur connecté). Une page de compte servie depuis le CDN à un autre utilisateur est une fuite grave.

# Docker

**Docker** emballe une application et tout ce dont elle a besoin (système, Node.js, dépendances, code) dans une **image**, qui s'exécute à l'identique partout sous forme de **conteneur** : sur votre poste, en CI, chez n'importe quel hébergeur. Fini le « chez moi ça marche ».

```dockerfile
# Dockerfile - construction en plusieurs étapes pour une application Next.js
FROM node:22-alpine AS dependances
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS construction
WORKDIR /app
COPY --from=dependances /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS execution
WORKDIR /app
ENV NODE_ENV=production
# Next.js en mode "standalone" (output: "standalone" dans next.config) produit un serveur autonome
COPY --from=construction /app/.next/standalone ./
COPY --from=construction /app/.next/static ./.next/static
COPY --from=construction /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
```

- La construction **en plusieurs étapes** garde une image finale petite : ni outils de construction ni dépendances de développement.
- L'ordre des instructions profite du **cache des couches** : `package.json` est copié avant le code, donc `npm ci` n'est rejoué que si les dépendances changent.
- `USER node` : le conteneur ne tourne pas en administrateur.
- Un fichier **`.dockerignore`** exclut `node_modules`, `.env`, `.git`.
- Les **secrets** ne sont jamais copiés dans l'image : ils sont fournis à l'exécution par des variables d'environnement.

**Docker Compose** décrit plusieurs conteneurs ensemble, idéal pour l'environnement de développement :

```yaml
# compose.yaml
services:
  db:
    image: postgres:17
    environment:
      POSTGRES_PASSWORD: dev
    ports: ["5432:5432"]
    volumes: [donnees:/var/lib/postgresql/data]
  redis:
    image: redis:7
    ports: ["6379:6379"]
volumes:
  donnees:
```

`docker compose up -d` démarre la base et Redis pour toute l'équipe, dans les mêmes versions.

# CORS

Par sécurité, un navigateur applique la **politique de même origine** : un script chargé depuis `https://app.exemple.fr` ne peut pas lire les réponses de `https://api.autre.fr`. **CORS** (*Cross-Origin Resource Sharing*) permet à un serveur d'**autoriser** explicitement certaines origines à lire ses réponses, via des en-têtes :

```ts
// Autoriser uniquement le front-end officiel à appeler l'API
const ORIGINES = ["https://app.exemple.fr"];

export function entetesCors(origine: string | null) {
  if (!origine || !ORIGINES.includes(origine)) return {};
  return {
    "Access-Control-Allow-Origin": origine,
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}
```

Pour les requêtes « non simples » (méthode `PATCH`, en-tête `Authorization`, JSON), le navigateur envoie d'abord une **requête préalable** `OPTIONS` (*preflight*) à laquelle le serveur doit répondre avec ces en-têtes.

> [!IMPORTANT]
> CORS est appliqué **par le navigateur** pour protéger l'utilisateur : ce n'est **pas** un contrôle d'accès à votre API. `curl` ou un script serveur ignorent CORS complètement. Votre API doit toujours **authentifier et autoriser** chaque requête. Et n'utilisez jamais `Access-Control-Allow-Origin: *` avec des cookies ou des données privées. Avec Next.js, front-end et API sont souvent sur la **même origine** : aucun réglage CORS n'est alors nécessaire.

# Monolithe ou microservices ?

| | Monolithe modulaire | Microservices |
|---|---|---|
| **Principe** | Une application, découpée en modules aux frontières claires | Plusieurs services déployés indépendamment, qui communiquent par le réseau |
| **Atouts** | Simple à développer, tester, déployer et déboguer ; transactions faciles | Déploiement et montée en charge indépendants, équipes autonomes |
| **Coûts** | Doit rester discipliné pour ne pas devenir un « plat de spaghettis » | Réseau, pannes partielles, cohérence des données, observabilité, beaucoup d'infrastructure |
| **Pour qui** | La grande majorité des projets et des équipes | Grandes organisations avec de nombreuses équipes et des besoins de charge très différents |

> [!TIP]
> Commencez par un **monolithe modulaire** : des modules par domaine (`facturation`, `projets`, `utilisateurs`) qui ne communiquent que par des fonctions publiques. Si un jour un module doit vraiment devenir un service, ses frontières sont déjà tracées. Découper trop tôt multiplie les difficultés sans bénéfice.

# Exercices

## Exercice 1 : Les déconnexions aléatoires

Après le passage de une à trois instances, des utilisateurs sont déconnectés au hasard et certains fichiers téléversés « disparaissent ». Diagnostiquez.

<details>
<summary>Voir la solution</summary>

L'application **n'est pas sans état** : les sessions sont gardées en mémoire et les fichiers sur le disque local d'une instance. Une requête traitée par une autre instance ne trouve ni la session ni le fichier. Corrections : sessions en **base**, dans **Redis** ou dans un cookie signé ; fichiers dans un **stockage objet** ; vérifier aussi les caches en mémoire et les compteurs de limitation de débit, à déplacer dans Redis.

</details>

## Exercice 2 : La page de compte partagée

Pour accélérer le site, une équipe ajoute `Cache-Control: public, max-age=3600` à toutes les réponses. Le lendemain, un utilisateur voit le tableau de bord d'un autre. Expliquez et corrigez.

<details>
<summary>Voir la solution</summary>

`public` autorise le **CDN** à mettre en cache et à resservir la réponse à tout le monde : la page personnalisée du premier utilisateur a été servie aux suivants. Corrections : `Cache-Control: private, no-store` pour toute réponse personnalisée ; cache public réservé aux pages et fichiers identiques pour tous ; fichiers statiques versionnés en cache long (`immutable`). Purger le CDN immédiatement et traiter l'incident comme une fuite de données.

</details>

## Exercice 3 : « On a réglé le problème avec CORS »

Un développeur affirme que l'API est protégée car elle n'autorise CORS que pour `https://app.exemple.fr`. Qu'en pensez-vous ?

<details>
<summary>Voir la solution</summary>

C'est faux : CORS est appliqué par le **navigateur** et empêche seulement un autre site de **lire** les réponses dans le navigateur d'un utilisateur. N'importe qui peut appeler l'API avec `curl` ou un script. L'API doit **authentifier** chaque requête et **vérifier les droits** sur chaque ressource ; CORS est un réglage complémentaire, pas un contrôle d'accès.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Architecture, conteneurs et montée en charge
center: Des instances sans état, un cache maîtrisé et une architecture simple tant qu'elle suffit.
points:
  - icon: server
    title: Sans état
    text: Sessions, fichiers et caches hors des instances, pour en ajouter à volonté.
  - icon: zap
    title: Cache
    text: Navigateur, CDN, framework, Redis ; expiration et invalidation prévues.
  - icon: lock
    title: Pas de fuite
    text: private, no-store pour toute réponse personnalisée.
  - icon: puzzle
    title: Docker
    text: Image multi-étapes, petite, sans secret, utilisateur non administrateur.
  - icon: shield
    title: CORS
    text: Une règle du navigateur, pas un contrôle d'accès à l'API.
  - icon: layers
    title: Monolithe modulaire
    text: Le bon point de départ ; des microservices seulement si le besoin est réel.
pitfall: Mettre en cache public une page personnalisée, ou découper en microservices dès le premier jour.
remember: Une application qui monte en charge est d'abord une application sans état.
```
