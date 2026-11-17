---
title: Sécurité et performance web
description: Les réflexes de sécurité d'une application web, la validation et les secrets, puis les leviers de performance (Core Web Vitals, images, chargement, cache).
duration: 50
objectives:
  - Appliquer les réflexes de sécurité essentiels d'une application web
  - Gérer secrets et variables d'environnement correctement
  - Mesurer et améliorer la performance perçue
  - Optimiser images, chargement et cache
---

# Les réflexes de sécurité

Les parcours cybersécurité détaillent ces sujets ; voici les réflexes **indispensables** pour toute application web, résumés pour le développeur fullstack.

```diagram
type: layers
title: Les réflexes de sécurité d'une app web
layers:
  - title: Entrées
    text: Tout valider côté serveur (Zod) ; ne jamais faire confiance au client
  - title: Accès
    text: Authentifier ET autoriser chaque requête sensible ; vérifier la propriété des ressources
  - title: Données
    text: Requêtes paramétrées (anti-injection), échappement en sortie (anti-XSS)
  - title: Secrets
    text: Hors du code, dans l'environnement ; jamais côté client
  - title: Transport
    text: HTTPS partout, cookies HttpOnly/Secure/SameSite, en-têtes de sécurité
```

Les vulnérabilités les plus fréquentes (OWASP Top 10) et leurs parades :

- **Contrôle d'accès défaillant** → vérifier l'autorisation sur **chaque** ressource (pas seulement l'authentification).
- **Injection (SQL, XSS)** → requêtes paramétrées (ou ORM), échappement automatique des gabarits (React échappe par défaut), jamais `dangerouslySetInnerHTML` avec des données non maîtrisées.
- **Mauvaise configuration** → pas de mode debug ni d'erreurs détaillées en production, en-têtes de sécurité.
- **Composants vulnérables** → mettre à jour les dépendances, analyser avec `npm audit`.

# Secrets et variables d'environnement

```ts
// .env.local (jamais versionné dans Git)
DATABASE_URL=postgresql://...
CLE_API_PAIEMENT=sk_live_...
```

> [!IMPORTANT]
> Deux règles absolues : les secrets vivent dans des **variables d'environnement** (jamais dans le code ni dans Git, le fichier `.env.local` est dans le `.gitignore`), et ils ne doivent **jamais** atteindre le navigateur. Dans Next.js, seules les variables préfixées **`NEXT_PUBLIC_`** sont envoyées au client : réservez-les aux valeurs **non sensibles** (une clé publique d'analytics, par exemple). Une clé secrète ne porte **jamais** ce préfixe et ne s'utilise que côté serveur.

En cas de secret exposé par erreur (poussé sur Git, affiché dans un journal) : le **révoquer et le remplacer** immédiatement, le supprimer ne suffit pas (parcours cybersécurité).

# La performance : pourquoi et comment mesurer

Une application lente fait fuir les utilisateurs et nuit au référencement. On mesure la performance **perçue** avec les **Core Web Vitals** de Google :

| Métrique | Mesure | Bon seuil (indicatif) |
|---|---|---|
| **LCP** (*Largest Contentful Paint*) | Temps d'affichage du plus gros élément | < 2,5 s |
| **INP** (*Interaction to Next Paint*) | Réactivité aux interactions | < 200 ms |
| **CLS** (*Cumulative Layout Shift*) | Stabilité visuelle (éléments qui sautent) | < 0,1 |

Outils de mesure : les **DevTools** (onglet Lighthouse), **PageSpeed Insights**, et les données réelles des utilisateurs.

> [!TIP]
> **Mesurez avant d'optimiser.** On optimise ce qui est **lent et important**, pas au hasard. Next.js applique déjà beaucoup de bonnes pratiques par défaut (rendu serveur, découpage du code) : souvent, le plus gros gain vient des **images** et des **dépendances trop lourdes**.

```video
url: https://www.youtube.com/watch?v=pTswmgVWSH8
title: "What are Core Web Vitals? | Core Web Vitals explained in 7 minutes"
channel: "Sematext"
duration: "7:14"
lang: en
why: "Les Core Web Vitals (LCP, INP, CLS) expliqués en sept minutes : ce qu'ils mesurent et pourquoi Google les suit."
```

# Les leviers de performance

## Les images

Les images sont souvent le plus gros poids d'une page. Le composant **`<Image>`** de Next.js optimise automatiquement : format moderne, redimensionnement, chargement différé (*lazy loading*), et réservation de l'espace (évite le CLS).

```tsx
import Image from "next/image";

<Image src="/photo.jpg" alt="Description" width={800} height={600} />
```

Règles générales : servir des images à la **bonne taille** (pas une image 4000px pour un affichage 400px), en **format moderne** (WebP/AVIF), et **différer** celles hors écran.

## Le chargement du JavaScript

- **Composants serveur** (module Next.js) : moins de JavaScript envoyé au navigateur.
- **Code splitting** : Next.js découpe automatiquement par page ; on peut charger à la demande un composant lourd avec `dynamic()`.
- **Éviter les dépendances lourdes** : vérifier le poids d'une bibliothèque avant de l'ajouter (une grosse bibliothèque pour une petite fonction est un mauvais calcul).

## Le cache et les données

- **Mettre en cache** ce qui change peu (rendu statique, revalidation : module Next.js).
- **Charger en parallèle** les données indépendantes (`Promise.all`, chapitre asynchrone).
- **Paginer** les grandes listes plutôt que tout charger.
- **Index** sur les colonnes filtrées en base (module backend).

# Exercices

## Exercice 1 : Le secret exposé

Un développeur crée une variable `NEXT_PUBLIC_CLE_PAIEMENT=sk_live_...` pour l'utiliser dans un composant. Quel est le problème ?

<details>
<summary>Voir la solution</summary>

Le préfixe **`NEXT_PUBLIC_`** envoie la variable au **navigateur** : la clé de paiement **secrète** est donc visible par tous les visiteurs dans le code client. C'est une fuite grave. Il faut : retirer le préfixe, n'utiliser la clé que **côté serveur** (Server Action, route d'API, composant serveur), et **révoquer immédiatement** la clé exposée pour en générer une nouvelle.

</details>

## Exercice 2 : Optimiser une page lente

Une page affiche 30 photos en pleine résolution (4000px chacune) via des balises `<img>`, et son LCP est de 8 secondes. Que proposez-vous ?

<details>
<summary>Voir la solution</summary>

Les images sont la cause évidente. Utiliser le composant **`<Image>`** de Next.js : redimensionnement à la taille réelle d'affichage, format moderne (WebP/AVIF), **chargement différé** des images hors écran, et réservation de l'espace (moins de CLS). Servir des miniatures dans la grille et la pleine résolution seulement à l'ouverture. Vérifier ensuite le LCP avec Lighthouse.

</details>

## Exercice 3 : Mesurer d'abord

Un développeur passe deux jours à micro-optimiser une fonction de tri « parce qu'elle lui semble lente ». Qu'aurait-il dû faire d'abord ?

<details>
<summary>Voir la solution</summary>

**Mesurer** d'abord, avec les DevTools (profileur de performance, Lighthouse), pour savoir si cette fonction est réellement un **goulot d'étranglement**. Très souvent, le vrai problème est ailleurs (images, dépendances lourdes, requêtes N+1, données non mises en cache). Optimiser une fonction qui représente 0,1 % du temps est une perte de temps : on optimise ce qui est **lent et important**, identifié par la mesure, pas par intuition.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Sécurité et performance web
center: Valider, autoriser et protéger les secrets ; mesurer puis optimiser ce qui est lent et important.
points:
  - icon: shield
    title: Réflexes sécurité
    text: Valider côté serveur, autoriser chaque ressource, requêtes paramétrées, HTTPS et en-têtes.
  - icon: key
    title: Secrets
    text: Dans l'environnement, hors de Git, jamais côté client ; NEXT_PUBLIC pour le non sensible seulement.
  - icon: gauge
    title: Core Web Vitals
    text: LCP, INP, CLS ; mesurer avec Lighthouse et les données réelles.
  - icon: file
    title: Images
    text: Composant Image, bonne taille, format moderne, chargement différé.
  - icon: zap
    title: Leviers
    text: Composants serveur, code splitting, cache, parallélisme, pagination, index.
pitfall: Micro-optimiser au hasard sans mesurer, ou exposer une clé secrète avec NEXT_PUBLIC.
remember: Mesurer avant d'optimiser ; une clé secrète ne doit jamais atteindre le navigateur.
```
