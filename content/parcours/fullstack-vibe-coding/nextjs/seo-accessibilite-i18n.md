---
title: Référencement, accessibilité et internationalisation
description: Métadonnées et Open Graph avec Next.js, plan du site et robots.txt, rendu favorable au référencement ; accessibilité selon les WCAG (clavier, focus, contrastes, formulaires, tests) ; internationalisation des textes, dates et nombres.
duration: 55
objectives:
  - Définir les métadonnées, images de partage, sitemap et robots.txt d'une application Next.js
  - Expliquer ce qui rend une page bien référencée
  - Appliquer et tester les règles d'accessibilité essentielles (WCAG)
  - Formater dates, nombres et devises selon la langue et préparer une traduction
---

# Le référencement

Le **référencement naturel** (SEO) rend les pages publiques trouvables par les moteurs de recherche et bien présentées quand on les partage. Pour une application derrière une connexion (tableau de bord), il compte peu ; pour un site vitrine, un blog ou un catalogue, il est essentiel.

Ce qui compte le plus :

- un **contenu utile** et un HTML **sémantique** (titres hiérarchisés, liens explicites) ;
- un contenu présent **dans le HTML envoyé** par le serveur : les composants serveur et le rendu statique de Next.js le permettent naturellement ;
- un **titre** et une **description** propres à chaque page ;
- des **URL lisibles** et stables (`/blog/bien-choisir-sa-base`) ;
- une page **rapide** et utilisable sur mobile (Core Web Vitals, module 6).

## Les métadonnées dans Next.js

```tsx
// app/layout.tsx - valeurs par défaut pour tout le site
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.exemple.fr"),
  title: { default: "Tâches Pro", template: "%s · Tâches Pro" },
  description: "Gérez les projets de votre équipe simplement.",
};
```

```tsx
// app/blog/[slug]/page.tsx - métadonnées calculées pour chaque article
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await chargerArticle(slug);
  return {
    title: article.titre,
    description: article.resume,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { title: article.titre, description: article.resume, images: [article.image] },
  };
}
```

- Les balises **Open Graph** contrôlent l'aperçu affiché lors d'un partage (réseaux sociaux, messageries).
- L'URL **canonique** indique la version de référence d'une page accessible par plusieurs adresses.
- Next.js génère aussi des images de partage dynamiques (`opengraph-image.tsx`).

## Plan du site et robots

```ts
// app/sitemap.ts - la liste des pages à indexer
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await listerArticles();
  return [
    { url: "https://www.exemple.fr/", lastModified: new Date() },
    ...articles.map((a) => ({ url: `https://www.exemple.fr/blog/${a.slug}`, lastModified: a.misAJourLe })),
  ];
}
```

```ts
// app/robots.ts - ce que les robots peuvent explorer
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/tableau-de-bord/", "/api/"] },
    sitemap: "https://www.exemple.fr/sitemap.xml",
  };
}
```

> [!WARNING]
> `robots.txt` n'est **pas** une protection : il demande poliment aux robots de ne pas explorer, et il est public. Une page privée se protège par l'**authentification**, pas par `disallow`. Pour empêcher l'indexation d'une page publique, on utilise la métadonnée `robots: { index: false }`.

# L'accessibilité

Une application **accessible** est utilisable par tous, y compris les personnes qui naviguent au clavier, avec un lecteur d'écran, un zoom important, ou qui distinguent mal certaines couleurs. C'est une exigence légale pour de nombreux services (en Europe, l'**Acte européen sur l'accessibilité** s'applique depuis juin 2025 à de nombreux services numériques, en plus des obligations du secteur public), et elle améliore l'expérience de tous.

La référence internationale est le **WCAG** (*Web Content Accessibility Guidelines*), version 2.2, organisé autour de quatre principes : **perceptible**, **utilisable**, **compréhensible**, **robuste**. Le niveau visé est en général **AA**.

| Règle | En pratique |
|---|---|
| **Tout au clavier** | Chaque action est possible avec Tab, Entrée, Espace, Échap ; aucun piège au clavier |
| **Focus visible** | L'élément actif est clairement visible (ne pas supprimer `outline` sans le remplacer) |
| **Contrastes** | Au moins 4,5:1 pour le texte courant (3:1 pour le grand texte) |
| **Textes alternatifs** | `alt` décrivant les images utiles ; `alt=""` pour les images décoratives |
| **Formulaires** | Chaque champ a un `<label>` ; erreurs explicites, liées au champ, pas seulement en rouge |
| **Structure** | Un seul `h1`, titres hiérarchisés, repères (`header`, `nav`, `main`), langue déclarée (`<html lang="fr">`) |
| **Information non visuelle** | Ne jamais transmettre une information uniquement par la couleur |
| **Mouvement** | Respecter `prefers-reduced-motion` pour les animations |

## Le focus dans une application

Dans une application à navigation côté client, certains cas demandent une attention particulière :

- à l'ouverture d'une **boîte de dialogue**, le focus va dans la boîte, y reste, et revient sur le bouton d'origine à la fermeture (les composants accessibles le font pour vous) ;
- après une **action** (enregistrement, erreur), le résultat est annoncé : message dans une zone `role="status"` ou `role="alert"`, ou focus déplacé vers le message d'erreur ;
- un lien **« Aller au contenu »** en tête de page permet de sauter la navigation.

```tsx
// Annoncer le résultat d'une Server Action aux lecteurs d'écran
<p role="status" aria-live="polite">{etat.message}</p>
```

> [!TIP]
> La **première règle d'ARIA** : ne pas utiliser ARIA quand un élément HTML natif fait l'affaire. `<button>` vaut mieux que `<div role="button" tabindex="0">` avec la gestion du clavier à réécrire.

## Tester l'accessibilité

1. **Au clavier** : parcourir la page avec Tab uniquement, sans souris.
2. **Outils automatiques** : Lighthouse ou axe dans le navigateur, et dans les tests (`@axe-core/playwright` pour les tests de bout en bout). Ils trouvent environ un tiers des problèmes : contrastes, `alt` manquants, champs sans label.
3. **Lecteur d'écran** : NVDA (Windows), VoiceOver (macOS, iOS), TalkBack (Android) sur les parcours clés.
4. **Zoom à 200 %** et affichage sur petit écran : rien ne doit être coupé ni se chevaucher.

# L'internationalisation

Même une application en une seule langue gagne à **formater correctement** dates, nombres et devises. Les API **`Intl`**, intégrées à JavaScript, le font sans bibliothèque :

```ts
const prix = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(1234.5);
// "1 234,50 €"

const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date("2026-03-02"));
// "2 mars 2026"

const relatif = new Intl.RelativeTimeFormat("fr", { numeric: "auto" }).format(-1, "day");
// "hier"
```

> [!WARNING]
> Stockez les dates en **UTC** (type `timestamptz` en PostgreSQL) et ne convertissez dans le **fuseau de l'utilisateur** qu'à l'affichage. Attention aussi aux composants serveur : le serveur ne connaît pas le fuseau du navigateur, passez-le explicitement (préférence du compte, cookie) ou formatez côté client.

## Traduire l'application

Pour proposer plusieurs langues :

- les textes ne sont plus écrits dans les composants mais dans des **fichiers de messages** par langue (`fr.json`, `en.json`), identifiés par des clés ;
- la langue se choisit par l'**URL** (`/fr/...`, `/en/...`, bon pour le référencement), une préférence du compte ou l'en-tête `Accept-Language` ;
- une bibliothèque comme **next-intl** gère le chargement des messages, les **pluriels** (« 1 tâche », « 3 tâches ») et les variables dans les phrases ;
- les métadonnées déclarent les versions de chaque langue (`alternates.languages`).

Prévoyez de la **place** : un texte allemand est souvent 30 % plus long que son équivalent anglais, et certaines langues s'écrivent de droite à gauche (`dir="rtl"`).

# Exercices

## Exercice 1 : L'article invisible

Un blog fait avec React charge ses articles dans le navigateur via `useEffect`. Les aperçus de partage affichent tous « Mon blog » sans image, et les articles sont mal référencés. Que proposez-vous ?

<details>
<summary>Voir la solution</summary>

- Charger l'article dans un **composant serveur** (ou générer la page statiquement) pour que le contenu soit dans le HTML envoyé.
- Définir `generateMetadata` par article : titre, description, URL canonique, **Open Graph** avec une image.
- Ajouter `app/sitemap.ts` listant les articles et `app/robots.ts`.
- Vérifier des URL lisibles (`/blog/[slug]`) et la performance de la page.

</details>

## Exercice 2 : Audit d'accessibilité

Un formulaire d'inscription utilise des placeholders à la place des labels, affiche les erreurs en bordure rouge seulement, et son bouton « Valider » est un `div`. Listez les problèmes et les corrections.

<details>
<summary>Voir la solution</summary>

- **Placeholders sans labels** : le texte disparaît à la saisie et n'est pas toujours lu → un `<label htmlFor>` visible pour chaque champ.
- **Erreur seulement en rouge** : information transmise uniquement par la couleur → message texte explicite, relié au champ (`aria-describedby`), `aria-invalid="true"`, et focus ou annonce du premier champ en erreur.
- **Bouton en `div`** : inutilisable au clavier → `<button type="submit">`.
- Vérifier les **contrastes**, tester au clavier et avec axe ou Lighthouse.

</details>

## Exercice 3 : Les dates qui changent

Une échéance enregistrée « 2 mars à 23 h 30 » par un utilisateur à Paris s'affiche « 3 mars » chez un collègue à Montréal… et parfois aussi chez l'utilisateur parisien. Expliquez.

<details>
<summary>Voir la solution</summary>

La date est stockée en **UTC** (22 h 30 UTC), c'est correct. Chez le collègue à Montréal, l'affichage dans **son** fuseau est normal si l'on veut l'heure locale (il est alors 17 h 30 le 2 mars : afficher « 3 mars » signale un bug de conversion). Chez l'utilisateur parisien, l'erreur vient sans doute d'un formatage **côté serveur**, dans le fuseau du serveur, ou d'une manipulation de la date comme une chaîne. Correction : stocker en UTC (`timestamptz`), formater avec `Intl.DateTimeFormat` en précisant le `timeZone` de l'utilisateur (préférence du compte), et tester avec plusieurs fuseaux.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Référencement, accessibilité et internationalisation
center: Une page trouvable, utilisable par tous et compréhensible dans la langue de chacun.
points:
  - icon: search
    title: Référencement
    text: Contenu dans le HTML, titre et description par page, URL lisibles.
  - icon: file
    title: Métadonnées
    text: generateMetadata, Open Graph, canonique, sitemap et robots.
  - icon: users
    title: WCAG 2.2 AA
    text: Clavier, focus visible, contrastes, labels, alternatives textuelles.
  - icon: check
    title: Tester
    text: Clavier, axe et Lighthouse, lecteur d'écran, zoom à 200 %.
  - icon: compass
    title: Intl
    text: Dates, nombres et devises formatés ; stockage en UTC.
  - icon: chat
    title: Traduction
    text: Fichiers de messages, langue dans l'URL, pluriels gérés par la bibliothèque.
pitfall: Croire que robots.txt protège une page privée, ou qu'un div cliquable est un bouton.
remember: L'accessibilité se teste au clavier avant de se mesurer avec un outil.
```
