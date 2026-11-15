---
title: Les fondamentaux de Next.js
description: Pourquoi un framework fullstack, l'App Router, le routage par fichiers, les layouts, les liens et la navigation, et la structure d'un projet.
duration: 55
objectives:
  - Expliquer ce qu'apporte Next.js par rapport à React seul
  - Créer des pages avec le routage par fichiers (App Router)
  - Utiliser les layouts et la navigation
  - Organiser un projet Next.js
---

# Pourquoi un framework fullstack ?

React seul ne gère que l'interface, côté navigateur. Pour une vraie application, il faut aussi : du **routage** (plusieurs pages), du **rendu côté serveur** (pour la performance et le référencement), un **backend** (API, accès base de données), l'**optimisation** (images, chargement), le **déploiement**… Assembler tout cela à la main est long et délicat.

**Next.js** est un **framework fullstack** bâti sur React qui fournit tout cela de façon intégrée et cohérente. C'est le framework React le plus utilisé, et celui de ce site. Ce module utilise l'**App Router**, l'approche moderne de Next.js, avec TypeScript.

```diagram
type: compare
title: React seul ou Next.js
columns:
  - title: React seul
    tone: blue
    items:
      - L'interface côté navigateur
      - Routage, rendu serveur, backend à ajouter soi-même
      - Beaucoup d'assemblage
  - title: Next.js
    tone: teal
    items:
      - Routage, rendu serveur et client, API intégrés
      - Optimisations automatiques
      - Prêt pour la production
```

# Créer un projet

```bash
npx create-next-app@latest mon-app
# Répondre oui à TypeScript, ESLint, App Router
cd mon-app
npm run dev        # serveur de développement sur http://localhost:3000
```

Le serveur de développement se **recharge automatiquement** à chaque modification (*hot reload*).

# Le routage par fichiers

Dans l'App Router, les **dossiers** du répertoire `app/` définissent les **routes** (les URL), et un fichier **`page.tsx`** rend le contenu d'une route.

```text
app/
├── page.tsx              →  /                 (accueil)
├── layout.tsx            →  mise en page commune
├── a-propos/
│   └── page.tsx          →  /a-propos
├── blog/
│   ├── page.tsx          →  /blog
│   └── [slug]/
│       └── page.tsx      →  /blog/mon-article (route dynamique)
```

```tsx
// app/a-propos/page.tsx
export default function APropos() {
  return (
    <main>
      <h1>À propos</h1>
      <p>Bienvenue sur la page à propos.</p>
    </main>
  );
}
```

Chaque `page.tsx` exporte **par défaut** un composant React. L'URL découle directement de l'arborescence : pas de configuration de routage à écrire.

## Les routes dynamiques

Un dossier entre crochets (`[slug]`) crée une route **dynamique** : un segment d'URL variable, disponible en paramètre.

```tsx
// app/blog/[slug]/page.tsx
export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <h1>Article : {slug}</h1>;
}
```

Pour `/blog/mon-premier-article`, `slug` vaut `"mon-premier-article"`. On charge ensuite l'article correspondant depuis la base ou un fichier.

# Les layouts

Un fichier **`layout.tsx`** définit une mise en page **partagée** par toutes les pages de son dossier (et sous-dossiers) : en-tête, menu, pied de page, qui ne se rechargent pas d'une page à l'autre.

```tsx
// app/layout.tsx - layout racine (obligatoire)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <header><nav>{/* menu */}</nav></header>
        <main>{children}</main>
        <footer>© 2026</footer>
      </body>
    </html>
  );
}
```

`{children}` est l'emplacement où s'insère la page courante. On peut imbriquer des layouts (un layout racine, puis un layout propre à la section blog, par exemple).

# La navigation

Pour naviguer entre les pages, on utilise le composant **`<Link>`** plutôt qu'un `<a>` classique : la navigation est **instantanée** (sans rechargement complet de la page) et Next.js **précharge** les pages liées.

```tsx
import Link from "next/link";

function Menu() {
  return (
    <nav>
      <Link href="/">Accueil</Link>
      <Link href="/blog">Blog</Link>
      <Link href="/a-propos">À propos</Link>
    </nav>
  );
}
```

> [!TIP]
> Utilisez `<Link>` pour les liens **internes** à l'application, et `<a>` pour les liens **externes**. `<Link>` apporte la navigation côté client et le préchargement ; un `<a>` recharge toute la page.

# Fichiers spéciaux et structure

L'App Router reconnaît des fichiers par convention :

| Fichier | Rôle |
|---|---|
| `page.tsx` | Le contenu d'une route |
| `layout.tsx` | Mise en page partagée |
| `loading.tsx` | Affichage pendant le chargement |
| `error.tsx` | Affichage en cas d'erreur |
| `not-found.tsx` | Page 404 |
| `route.ts` | Point d'API (chapitre suivant du module backend) |

Les fichiers **statiques** (images, polices) vont dans `public/`. Les composants réutilisables sont souvent rangés dans un dossier `components/`, la logique dans `lib/`.

> [!NOTE]
> Next.js évolue vite et propose d'autres conventions (groupes de routes, routes parallèles…). Pour débuter, `page.tsx`, `layout.tsx` et `<Link>` suffisent largement. La documentation officielle est la référence à jour.

# Exercices

## Exercice 1 : Créer des routes

Quelle arborescence de fichiers pour obtenir les URL `/`, `/produits` et `/produits/[id]` ?

<details>
<summary>Voir la solution</summary>

```text
app/
├── page.tsx                   →  /
└── produits/
    ├── page.tsx               →  /produits
    └── [id]/
        └── page.tsx           →  /produits/42
```

Chaque `page.tsx` exporte par défaut un composant. `[id]` rend le segment dynamique.

</details>

## Exercice 2 : Lire un paramètre dynamique

Écrivez la page `/produits/[id]` qui affiche « Produit numéro X ».

<details>
<summary>Voir la solution</summary>

```tsx
// app/produits/[id]/page.tsx
export default async function Produit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <h1>Produit numéro {id}</h1>;
}
```

On récupère `id` depuis `params`, puis on charge le produit correspondant.

</details>

## Exercice 3 : Link ou a ?

Pour chaque lien, `<Link>` ou `<a>` ?

1. Vers la page `/panier` de l'application.
2. Vers `https://docs.exemple.fr` (site externe).
3. Vers l'ancre `#contact` de la page courante.

<details>
<summary>Voir la solution</summary>

1. **`<Link href="/panier">`** : lien interne, navigation instantanée et préchargement.
2. **`<a href="https://docs.exemple.fr">`** : lien externe (souvent avec `target="_blank"` et `rel="noopener"`).
3. Un **`<a href="#contact">`** suffit pour une ancre sur la même page ; `<Link>` fonctionne aussi mais n'apporte rien ici.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Les fondamentaux de Next.js
center: "Un framework fullstack sur React : routage, rendu serveur et backend intégrés, prêt pour la production."
points:
  - icon: rocket
    title: Pourquoi
    text: React gère l'interface ; Next.js ajoute routage, rendu serveur, API, optimisations.
  - icon: file
    title: Routage par fichiers
    text: Dossiers dans app/, page.tsx par route, crochets pour les routes dynamiques.
  - icon: layers
    title: Layouts
    text: layout.tsx partage en-tête et menu ; children accueille la page courante.
  - icon: link
    title: Navigation
    text: Link pour les liens internes (instantané, préchargé), a pour les externes.
  - icon: list
    title: Fichiers spéciaux
    text: page, layout, loading, error, not-found, route ; statiques dans public.
pitfall: Utiliser un a classique pour un lien interne et recharger toute la page inutilement.
remember: L'URL découle de l'arborescence des dossiers ; aucune configuration de routage à écrire.
```
