---
title: Composants serveur et chargement de données
description: Composants serveur et client, charger des données côté serveur, les stratégies de rendu et de cache, et les états de chargement et d'erreur.
duration: 60
objectives:
  - Distinguer composants serveur et composants client
  - Charger des données directement dans un composant serveur
  - Comprendre les stratégies de rendu et de cache
  - Gérer les états de chargement et d'erreur
---

# Composants serveur et composants client

L'App Router introduit une distinction essentielle. Par défaut, les composants Next.js sont des **composants serveur** : ils s'exécutent **sur le serveur**, pas dans le navigateur. Leur code (y compris les accès à la base de données et les clés secrètes) ne part **jamais** au client ; seul le HTML produit est envoyé.

Certains composants ont besoin d'**interactivité** (état, événements, hooks `useState`/`useEffect`) : ce sont des **composants client**, marqués par la directive `"use client"` en haut du fichier.

```diagram
type: compare
title: Serveur ou client ?
columns:
  - title: Composant serveur (défaut)
    tone: teal
    items:
      - S'exécute sur le serveur
      - Accès direct à la base, aux secrets
      - Pas d'état ni d'événements
      - Moins de JavaScript envoyé
  - title: Composant client (use client)
    tone: blue
    items:
      - S'exécute dans le navigateur
      - useState, useEffect, onClick
      - Pour l'interactivité
      - Pas d'accès direct aux secrets
```

```tsx
// Composant client : interactif
"use client";
import { useState } from "react";

export function Compteur() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}
```

> [!TIP]
> Règle pratique : **composant serveur par défaut**, `"use client"` seulement quand on a besoin d'interactivité. On garde les composants client **petits et « aux extrémités »** de l'arbre (un bouton, un champ), et on laisse le reste (structure, données) côté serveur. Un composant serveur peut inclure des composants client, l'inverse est plus restreint.

# Charger des données côté serveur

Le grand avantage des composants serveur : on y charge les données **directement**, en `async`, sans `useEffect` ni `fetch` côté client.

```tsx
// app/articles/page.tsx - composant serveur
import { db } from "@/lib/db";

export default async function PageArticles() {
  const articles = await db.article.findMany();   // accès direct à la base, sur le serveur
  return (
    <ul>
      {articles.map((a) => (
        <li key={a.id}>{a.titre}</li>
      ))}
    </ul>
  );
}
```

Avantages par rapport au chargement côté client (`useEffect` + `fetch`) :

- **plus simple** : pas d'état de chargement à gérer manuellement, pas de « cascade » de requêtes ;
- **plus rapide et meilleur pour le référencement** : le HTML arrive déjà rempli ;
- **plus sûr** : les requêtes et les secrets restent sur le serveur.

> [!IMPORTANT]
> Ne mettez **jamais** de secret (clé d'API, mot de passe de base) dans un composant **client** : tout son code est envoyé au navigateur. Les accès sensibles se font dans des composants **serveur** ou des routes d'API. C'est un point de sécurité majeur (rappel du parcours cybersécurité).

# Les stratégies de rendu et le cache

Next.js peut produire une page de plusieurs façons :

| Stratégie | Quand la page est produite | Usage |
|---|---|---|
| **Statique** | À la construction (*build*) | Contenu qui change peu (blog, documentation) : très rapide |
| **Dynamique** | À chaque requête | Contenu personnalisé ou très frais (tableau de bord) |
| **Revalidation** | Statique, régénérée après un délai | Compromis : rapide et raisonnablement à jour |

On contrôle ce comportement au niveau de `fetch` ou de la page :

```tsx
// Revalider les données au maximum toutes les 60 secondes
const donnees = await fetch("https://api.exemple.fr/prix", {
  next: { revalidate: 60 },
}).then((r) => r.json());

// Toujours frais (pas de cache)
const live = await fetch(url, { cache: "no-store" }).then((r) => r.json());
```

> [!NOTE]
> Le comportement par défaut du cache a évolué d'une version de Next.js à l'autre. Le principe reste : **choisir** entre rapidité (statique, mis en cache) et fraîcheur (dynamique), selon le contenu. En cas de doute, la documentation de votre version fait foi ; `revalidate` offre souvent le meilleur compromis.

```video
url: https://www.youtube.com/watch?v=gSSsZReIFRk
title: "Next.js App Router: Routing, Data Fetching, Caching"
channel: "Vercel"
duration: "14:32"
lang: en
why: "Vercel présente l'App Router : routage, chargement des données côté serveur et cache."
```

# États de chargement et d'erreur

Pour les parties dynamiques, Next.js affiche automatiquement un **état de chargement** si on fournit un fichier `loading.tsx`, et un **état d'erreur** avec `error.tsx`.

```tsx
// app/articles/loading.tsx
export default function Chargement() {
  return <p>Chargement des articles…</p>;
}
```

```tsx
// app/articles/error.tsx - doit être un composant client
"use client";

export default function Erreur({ reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <p>Une erreur est survenue.</p>
      <button onClick={reset}>Réessayer</button>
    </div>
  );
}
```

On peut aussi utiliser **`<Suspense>`** pour afficher une partie de la page immédiatement et faire arriver le contenu lent **progressivement** (*streaming*), sans bloquer tout l'affichage.

# Exercices

## Exercice 1 : Serveur ou client ?

Pour chaque composant, serveur ou client ?

1. Une liste d'articles chargée depuis la base de données.
2. Un bouton « J'aime » avec un compteur qui réagit au clic.
3. Un en-tête affichant le logo et le menu de navigation.

<details>
<summary>Voir la solution</summary>

1. **Serveur** : chargement de données, aucune interactivité → accès direct à la base.
2. **Client** (`"use client"`) : état et gestion du clic.
3. **Serveur** : contenu statique ; les `<Link>` fonctionnent sans « use client ». (Si une partie était interactive, on isolerait ce petit morceau en composant client.)

</details>

## Exercice 2 : Le secret exposé

Un développeur met `const cle = process.env.CLE_API` dans un composant marqué `"use client"` et s'étonne qu'elle soit visible dans le navigateur. Expliquez et corrigez.

<details>
<summary>Voir la solution</summary>

Tout le code d'un composant **client** est envoyé au navigateur : la clé y est donc **lisible par tous**. Il faut faire l'appel utilisant cette clé dans un composant **serveur** ou une **route d'API** (module backend), où le code reste sur le serveur. Le composant client appelle alors cette route interne, sans jamais voir la clé. (Les variables d'environnement préfixées `NEXT_PUBLIC_` sont, elles, volontairement exposées, à n'utiliser que pour des valeurs non sensibles.)

</details>

## Exercice 3 : Choisir la stratégie

Quelle stratégie de rendu pour :

1. La page d'accueil marketing, qui change une fois par mois.
2. Le tableau de bord personnel d'un utilisateur connecté.
3. Une liste de prix mise à jour plusieurs fois par heure.

<details>
<summary>Voir la solution</summary>

1. **Statique** : rapide, régénérée au build (ou avec une revalidation longue).
2. **Dynamique** (`cache: "no-store"`) : personnalisé et frais à chaque requête.
3. **Revalidation** (`revalidate: 300` par exemple) : statique mais régénérée régulièrement, bon compromis entre fraîcheur et performance.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Composants serveur et données
center: Charger les données sur le serveur, réserver le client à l'interactivité, et choisir cache ou fraîcheur.
points:
  - icon: server
    title: Serveur par défaut
    text: S'exécute sur le serveur, accès direct à la base et aux secrets, pas d'interactivité.
  - icon: zap
    title: use client
    text: Pour l'état et les événements ; petit et aux extrémités de l'arbre.
  - icon: database
    title: Données
    text: Chargées en async dans un composant serveur ; plus simple, rapide, sûr.
  - icon: loop
    title: Rendu et cache
    text: Statique, dynamique ou revalidation ; arbitrer rapidité et fraîcheur.
  - icon: filter
    title: Chargement et erreurs
    text: loading.tsx, error.tsx, Suspense pour le streaming progressif.
pitfall: Mettre une clé secrète dans un composant client, dont tout le code part au navigateur.
remember: Composant serveur par défaut ; « use client » seulement là où il faut de l'interactivité.
```
