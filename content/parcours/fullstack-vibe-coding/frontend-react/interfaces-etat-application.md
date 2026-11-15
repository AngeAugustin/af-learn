---
title: "Interfaces à l'échelle : Tailwind, composants et état de l'application"
description: Styliser avec Tailwind CSS, s'appuyer sur une bibliothèque de composants accessibles et un système de design, puis choisir où placer chaque état (local, partagé, serveur ou URL) avec TanStack Query et les paramètres d'URL.
duration: 60
objectives:
  - Styliser une interface avec Tailwind CSS et des jetons de design
  - Utiliser une bibliothèque de composants accessibles sans réinventer la roue
  - Distinguer état local, état partagé, état serveur et état d'URL
  - Charger et mettre en cache des données côté client avec TanStack Query
  - Conserver filtres et pagination dans l'URL
---

# Tailwind CSS

Quand une application grandit, le CSS « classique » devient difficile à maintenir : des noms de classes à inventer, des styles qui se contredisent, des fichiers que personne n'ose supprimer. **Tailwind CSS** propose une autre approche : des **classes utilitaires** qui font chacune une chose, combinées directement dans le balisage.

```tsx
export function CarteProjet({ titre, description }: { titre: string; description: string }) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{titre}</h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      <button className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
        Ouvrir
      </button>
    </article>
  );
}
```

- `p-6`, `mt-2` : espacements sur une **échelle** commune (pas de valeurs au hasard) ;
- `md:`, `lg:` : variantes **responsive** (à partir d'une largeur d'écran) ;
- `hover:`, `focus-visible:`, `dark:` : variantes d'**état** et de **thème** ;
- seules les classes réellement utilisées sont générées : le CSS final reste petit.

```diagram
type: compare
title: CSS classique et Tailwind
columns:
  - title: CSS classique
    tone: blue
    items:
      - Styles dans des fichiers séparés, noms de classes inventés
      - Risque de styles morts et de conflits de cascade
      - Balisage plus lisible
  - title: Tailwind
    tone: teal
    items:
      - Styles à côté du balisage, échelle commune
      - Pas de nom à inventer, pas de CSS mort
      - Classes longues ; on factorise par des composants
```

> [!TIP]
> La répétition se règle par des **composants**, pas par du CSS : si dix boutons ont les mêmes classes, créez un composant `<Bouton>`. Pour gérer proprement les variantes (`primaire`, `secondaire`, `danger`), des petits utilitaires comme `clsx` ou `tailwind-merge` combinent les classes selon les props.

## Les jetons de design

Un **système de design** fixe les décisions visuelles de l'interface : couleurs, typographies, espacements, rayons, ombres. On les définit une fois comme **jetons** (*design tokens*) (en pratique des variables CSS) et tous les composants les utilisent. Changer la couleur principale ou ajouter un thème sombre devient une modification **à un seul endroit**.

```css
/* app/globals.css - Tailwind v4 : les jetons sont déclarés dans le CSS */
@import "tailwindcss";

@theme {
  --color-primaire: oklch(0.55 0.2 260);
  --color-surface: oklch(0.99 0 0);
  --radius-carte: 0.75rem;
}
```

Les classes `bg-primaire`, `bg-surface` ou `rounded-carte` deviennent alors disponibles dans tout le projet.

# Les bibliothèques de composants

Une fenêtre modale, un menu déroulant ou un sélecteur de date **accessibles** sont bien plus difficiles à écrire qu'il n'y paraît : gestion du focus, navigation au clavier, touche Échap, rôles ARIA, lecteurs d'écran. Plutôt que de les réinventer, on s'appuie sur des bibliothèques éprouvées :

| Approche | Exemples | Principe |
|---|---|---|
| **Composants « sans style »** | Radix UI, React Aria, Headless UI | Comportement et accessibilité fournis, apparence entièrement à vous |
| **Composants à copier dans le projet** | shadcn/ui | Composants Radix + Tailwind dont le code est copié dans votre projet et modifiable |
| **Bibliothèques complètes** | MUI, Mantine, Chakra UI | Composants stylés prêts à l'emploi, thème configurable |

> [!IMPORTANT]
> Un `<div onClick>` stylé comme un bouton n'est pas un bouton : il n'est ni focalisable au clavier ni annoncé correctement par un lecteur d'écran. Utilisez les éléments natifs (`<button>`, `<a>`, `<input>`) ou des composants accessibles, et testez au clavier.

# Où placer l'état ?

Toutes les données d'une interface ne sont pas du même type. Bien les classer évite la plupart des complications.

```diagram
type: layers
title: Quatre types d'état
layers:
  - title: État d'URL
    text: "Filtres, recherche, onglet, page : partageable, survit au rechargement"
  - title: État serveur
    text: Données qui appartiennent au serveur (projets, tâches), à charger, mettre en cache, revalider
  - title: État partagé
    text: Utile à plusieurs composants éloignés (thème, utilisateur connecté, panier)
  - title: État local
    text: Propre à un composant (menu ouvert, saisie en cours)
```

- **Local** : `useState` dans le composant concerné. C'est le cas par défaut.
- **Partagé** : faire remonter l'état au parent commun, puis un **contexte** si nécessaire ; pour un état partagé riche et souvent modifié, une petite bibliothèque comme **Zustand**.
- **Serveur** : dans Next.js, le plus simple est de charger dans les **composants serveur** et de modifier avec les **Server Actions** (module 4). Pour des données à charger depuis le navigateur (rafraîchissement fréquent, défilement infini), on utilise **TanStack Query**.
- **URL** : les paramètres de recherche de l'URL (`?statut=ouvert&page=2`).

> [!WARNING]
> L'erreur la plus courante est de **copier l'état serveur dans un état local** (`useEffect` qui charge des données puis `useState` pour les stocker) : on doit alors gérer à la main le chargement, les erreurs, le cache, la revalidation et les requêtes en double. C'est précisément le travail des composants serveur ou de TanStack Query.

## TanStack Query

**TanStack Query** gère l'état serveur côté client : il met les réponses en **cache** par clé, évite les requêtes en double, gère les états de chargement et d'erreur, et **revalide** les données quand c'est utile (retour sur l'onglet, après une modification).

```tsx
"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Tache = { id: string; titre: string; terminee: boolean };

export function ListeTaches({ projetId }: { projetId: string }) {
  const client = useQueryClient();

  const { data, isPending, error } = useQuery({
    queryKey: ["taches", projetId],
    queryFn: async (): Promise<Tache[]> => {
      const r = await fetch(`/api/projets/${projetId}/taches`);
      if (!r.ok) throw new Error("Chargement impossible");
      return r.json();
    },
  });

  const basculer = useMutation({
    mutationFn: (id: string) => fetch(`/api/taches/${id}/basculer`, { method: "POST" }),
    onSuccess: () => client.invalidateQueries({ queryKey: ["taches", projetId] }),
  });

  if (isPending) return <p>Chargement…</p>;
  if (error) return <p role="alert">Erreur : {error.message}</p>;
  return (
    <ul>
      {data.map((t) => (
        <li key={t.id}>
          <label>
            <input type="checkbox" checked={t.terminee} onChange={() => basculer.mutate(t.id)} />
            {t.titre}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

L'application est enveloppée une fois dans un `QueryClientProvider`. La **clé** (`["taches", projetId]`) identifie les données : après la modification, invalider cette clé déclenche un rechargement.

## L'état dans l'URL

Les filtres, la recherche et la pagination ont leur place dans l'**URL** : l'utilisateur peut partager le lien, l'ajouter à ses favoris, utiliser le bouton Précédent, et la page s'affiche correctement après un rechargement.

```tsx
// app/taches/page.tsx - composant serveur : les filtres viennent de l'URL
export default async function PageTaches({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string; page?: string }>;
}) {
  const { statut = "tous", page = "1" } = await searchParams;
  const taches = await chargerTaches({ statut, page: Number(page) });
  return <TableauTaches taches={taches} statut={statut} />;
}
```

Côté client, un filtre met à jour l'URL (avec `useRouter` et `useSearchParams` de `next/navigation`, ou de simples liens `<Link href="?statut=ouvert">`), et la page se recharge avec les bonnes données.

# Exercices

## Exercice 1 : Classer les états

Pour une page « Tableau de bord des tâches », classez : (a) la liste des tâches de l'équipe, (b) le filtre « en retard », (c) l'ouverture du menu d'actions d'une tâche, (d) le thème clair/sombre, (e) la page 3 de la liste.

<details>
<summary>Voir la solution</summary>

- (a) **État serveur** : chargé par un composant serveur (ou TanStack Query si rechargé depuis le client).
- (b) **URL** : `?filtre=en-retard`, partageable.
- (c) **Local** : `useState` dans le composant de la tâche.
- (d) **Partagé** : contexte (ou préférence stockée dans un cookie pour le rendu serveur).
- (e) **URL** : `?page=3`.

</details>

## Exercice 2 : Le useEffect de trop

Un composant charge les projets avec `useEffect` + `fetch`, stocke le résultat dans `useState`, et un autre composant de la même page fait la même requête. Après une création de projet, la liste n'est pas mise à jour. Que proposez-vous ?

<details>
<summary>Voir la solution</summary>

C'est de l'état serveur copié en état local. Deux options : (1) charger les projets dans un **composant serveur** et créer le projet avec une **Server Action** suivie de `revalidatePath`, la liste est à jour sans code client ; (2) si le chargement doit se faire côté client, utiliser **TanStack Query** avec une clé `["projets"]` partagée par les deux composants (une seule requête grâce au cache) et invalider cette clé après la création.

</details>

## Exercice 3 : Le faux bouton

Une revue de code trouve `<div className="btn" onClick={supprimer}>Supprimer</div>`. Quels problèmes, et comment corriger ?

<details>
<summary>Voir la solution</summary>

Le `div` n'est pas **focalisable** au clavier, ne réagit pas à Entrée ou Espace, et n'est pas annoncé comme un bouton par les lecteurs d'écran. Correction : `<button type="button" className="..." onClick={supprimer}>Supprimer</button>`. Pour une action destructrice, ajouter une **confirmation** (boîte de dialogue accessible d'une bibliothèque comme Radix ou shadcn/ui).

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Interfaces à l'échelle
center: Un système de design pour le style, des composants accessibles, et chaque état à sa place.
points:
  - icon: sparkles
    title: Tailwind
    text: Classes utilitaires sur une échelle commune ; factoriser par des composants.
  - icon: ruler
    title: Jetons de design
    text: Couleurs, espacements, rayons définis une fois, thèmes faciles.
  - icon: puzzle
    title: Composants accessibles
    text: Radix, React Aria, shadcn/ui plutôt que des modales maison.
  - icon: layers
    title: Quatre états
    text: Local, partagé, serveur, URL ; chacun son outil.
  - icon: database
    title: TanStack Query
    text: Cache par clé, chargement, erreurs et invalidation de l'état serveur.
  - icon: link
    title: L'URL
    text: Filtres, recherche et pagination partageables et persistants.
pitfall: Copier des données serveur dans un useState avec useEffect et gérer le cache à la main.
remember: Avant d'ajouter un état, demandez-vous à qui il appartient.
```
