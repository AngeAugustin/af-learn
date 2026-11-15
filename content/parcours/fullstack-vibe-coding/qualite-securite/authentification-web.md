---
title: Authentification et autorisation web
description: Sessions et jetons, le stockage des mots de passe, l'authentification dans une application Next.js, l'autorisation et les bibliothèques dédiées.
duration: 55
objectives:
  - Choisir un mécanisme de session adapté
  - Stocker les mots de passe correctement
  - Protéger les pages et les actions selon les droits
  - Utiliser une bibliothèque d'authentification
---

# Authentifier, autoriser

Deux notions distinctes (rappel du parcours cybersécurité) :

- l'**authentification** répond à « **qui** es-tu ? » : vérifier l'identité (connexion) ;
- l'**autorisation** répond à « **as-tu le droit** ? » : vérifier les permissions.

Les deux se font **côté serveur**, à **chaque** requête sensible. Masquer un bouton dans l'interface n'est pas une protection.

# Les sessions

Après une connexion réussie, l'application doit **se souvenir** que l'utilisateur est connecté. Deux grandes approches :

```diagram
type: compare
title: Deux façons de maintenir une session
columns:
  - title: Session côté serveur
    tone: teal
    items:
      - Un identifiant aléatoire dans un cookie
      - Les données de session stockées sur le serveur
      - Révocation immédiate possible
      - Simple et sûr pour une app web
  - title: Jeton (JWT)
    tone: blue
    items:
      - Un jeton signé contenant les infos
      - Rien à stocker côté serveur
      - Révocation plus difficile
      - Pratique entre services
```

Pour une application web classique, la **session côté serveur** avec un **cookie** est souvent le choix le plus simple et le plus sûr. Le cookie doit être configuré correctement (parcours sécurité) :

```text
Set-Cookie: session=<aléatoire>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400
```

- **`HttpOnly`** : inaccessible au JavaScript (protège contre le vol par XSS) ;
- **`Secure`** : envoyé uniquement en HTTPS ;
- **`SameSite=Lax`** : limite les attaques CSRF ;
- identifiant **long et aléatoire**, régénéré à la connexion.

# Stocker les mots de passe

> [!IMPORTANT]
> Ne stockez **jamais** un mot de passe en clair, ni avec un simple hachage rapide (MD5, SHA-256). Utilisez une fonction **dédiée, lente et salée** : **Argon2id** (recommandé) ou **bcrypt**. Même si la base fuite, les mots de passe restent protégés (parcours cybersécurité).

```ts
import bcrypt from "bcryptjs";

// À l'inscription
const empreinte = await bcrypt.hash(motDePasse, 12);   // 12 = facteur de coût

// À la connexion
const ok = await bcrypt.compare(motDePasseSaisi, empreinte);
```

Complétez par une **politique moderne** (longueur avant complexité, refus des mots de passe fuités), une **limitation des tentatives**, et surtout proposez une **authentification multifacteur** ou des **passkeys** (parcours cybersécurité).

# L'authentification dans Next.js

Écrire soi-même toute l'authentification est **risqué** : les détails (sessions, CSRF, OAuth, réinitialisation) sont subtils et les erreurs coûteuses. On utilise une **bibliothèque** éprouvée :

- **Auth.js** (anciennement NextAuth) : la plus répandue dans l'écosystème Next.js ; gère connexion par e-mail/mot de passe, liens magiques, et fournisseurs externes (Google, GitHub…) via **OAuth**.
- **Lucia**, **Clerk**, **Supabase Auth**, **Better Auth** : autres options, certaines hébergées.

Le principe commun : la bibliothèque gère la session, et vous l'**interrogez** côté serveur pour savoir qui est connecté.

```ts
// Exemple de principe (API selon la bibliothèque)
const session = await auth();          // lit la session côté serveur
if (!session) {
  redirect("/connexion");              // non connecté → rediriger
}
console.log(session.user.email);
```

> [!TIP]
> La **connexion par fournisseur externe** (OAuth avec Google, GitHub…) évite de gérer les mots de passe vous-même : c'est souvent la façon la plus simple et la plus sûre de démarrer. L'utilisateur se connecte avec un compte existant, vous ne stockez aucun mot de passe.

# Protéger pages et actions

L'autorisation se vérifie à chaque point sensible :

```ts
// Dans un composant serveur, une Server Action ou une route d'API
const session = await auth();
if (!session) redirect("/connexion");                 // authentification

const article = await db.article.findUnique({ where: { id } });
if (article?.auteurId !== session.user.id) {
  // autorisation : l'utilisateur est-il bien le propriétaire ?
  throw new Error("Non autorisé");
}
```

Un **middleware** Next.js peut aussi protéger des sections entières (par exemple tout `/admin`) en vérifiant la session avant d'accéder aux pages. Mais le middleware ne **remplace pas** les vérifications fines sur chaque ressource : il complète.

> [!WARNING]
> L'erreur la plus fréquente (parcours sécurité, contrôle d'accès défaillant) : vérifier l'**authentification** (« est-il connecté ? ») mais oublier l'**autorisation** sur la ressource précise (« a-t-il le droit d'accéder à **cet** article ? »). Vérifiez toujours que la ressource demandée appartient bien à l'utilisateur ou qu'il a le rôle requis.

# Exercices

## Exercice 1 : Hacher un mot de passe

Un code stocke `user.password = sha256(motDePasse)`. Qu'est-ce qui ne va pas ? Corrigez.

<details>
<summary>Voir la solution</summary>

SHA-256 est un hachage **rapide** et **sans sel** : un attaquant qui obtient la base peut tester des milliards de candidats par seconde et retrouver les mots de passe courants. Il faut une fonction **dédiée, lente et salée** :

```ts
const empreinte = await bcrypt.hash(motDePasse, 12);   // ou Argon2id
// vérification : await bcrypt.compare(saisi, empreinte)
```

(Idéalement, déléguer tout cela à une bibliothèque d'authentification.)

</details>

## Exercice 2 : Le cookie mal configuré

Une session est stockée dans un cookie sans `HttpOnly`, sans `Secure`, sans `SameSite`. Quels risques ?

<details>
<summary>Voir la solution</summary>

- Sans **`HttpOnly`** : un script injecté (XSS) peut **lire** le cookie et voler la session.
- Sans **`Secure`** : le cookie peut transiter en HTTP non chiffré et être intercepté.
- Sans **`SameSite`** : exposition accrue aux attaques **CSRF**.

Correction : `HttpOnly; Secure; SameSite=Lax`, identifiant long et aléatoire, durée de vie limitée.

</details>

## Exercice 3 : Authentification sans autorisation

Une route `PATCH /api/articles/[id]` vérifie que l'utilisateur est connecté, puis applique la modification. Que manque-t-il ?

<details>
<summary>Voir la solution</summary>

L'**autorisation** sur la ressource : rien ne vérifie que l'article appartient à l'utilisateur connecté. N'importe quel utilisateur authentifié peut donc modifier **l'article d'un autre** (contrôle d'accès défaillant / IDOR). Il faut charger l'article et vérifier `article.auteurId === session.user.id` (ou un rôle d'administration) **avant** de modifier.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Authentification et autorisation web
center: Vérifier qui est connecté et ce qu'il a le droit de faire, côté serveur, à chaque requête sensible.
points:
  - icon: key
    title: Deux notions
    text: Authentifier (qui es-tu) et autoriser (as-tu le droit), toutes deux côté serveur.
  - icon: lock
    title: Sessions
    text: Cookie HttpOnly, Secure, SameSite ; session serveur simple et sûre pour une app web.
  - icon: shield
    title: Mots de passe
    text: Argon2id ou bcrypt salés ; jamais en clair ni en hachage rapide ; MFA et passkeys.
  - icon: users
    title: Bibliothèques
    text: Auth.js et autres ; OAuth avec un fournisseur évite de gérer les mots de passe.
  - icon: filter
    title: Protéger
    text: Middleware pour les sections, et vérification fine de la propriété sur chaque ressource.
pitfall: Vérifier qu'on est connecté mais pas qu'on a le droit d'accéder à cette ressource précise.
remember: Ne réimplémentez pas l'authentification vous-même ; utilisez une bibliothèque éprouvée.
```
