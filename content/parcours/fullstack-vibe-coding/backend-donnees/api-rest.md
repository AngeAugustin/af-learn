---
title: Concevoir une API REST
description: Les principes REST, concevoir des ressources et des URL, les codes de statut, créer des routes d'API avec Next.js, la validation et la gestion des erreurs, l'idempotence, la limitation de débit et la pagination.
duration: 65
objectives:
  - Appliquer les principes d'une API REST
  - Concevoir des URL et choisir les bons codes de statut
  - Créer des routes d'API avec Next.js
  - Valider les entrées et structurer les réponses d'erreur
  - Rendre les opérations sensibles idempotentes, limiter le débit et paginer les listes
---

# Qu'est-ce qu'une API REST ?

Une **API** (*Application Programming Interface*) permet à des programmes de communiquer. Une **API web** expose des fonctions et des données par HTTP, consommées par un frontend, une application mobile ou un autre service.

**REST** (*Representational State Transfer*) est un **style** d'API très répandu, fondé sur quelques idées simples :

- on expose des **ressources** (des « choses » : utilisateurs, articles, commandes) ;
- chaque ressource a une **URL** ;
- on agit dessus avec les **méthodes HTTP** (GET, POST, PUT/PATCH, DELETE) ;
- l'API est **sans état** : chaque requête contient tout ce qu'il faut pour être traitée.

# Concevoir les ressources et les URL

On nomme les ressources avec des **noms** (pas des verbes), au **pluriel**, et on exprime l'action par la **méthode** :

```text
GET    /api/articles          → lister les articles
POST   /api/articles          → créer un article
GET    /api/articles/42       → lire l'article 42
PATCH  /api/articles/42       → modifier l'article 42
DELETE /api/articles/42       → supprimer l'article 42

GET    /api/articles/42/commentaires   → les commentaires de l'article 42
```

> [!TIP]
> Évitez les URL « verbe » comme `/api/creerArticle` ou `/api/getArticle?id=42`. En REST, le **verbe** est la méthode HTTP, l'**URL** désigne la ressource. Les filtres, tris et pagination passent par la **query string** : `GET /api/articles?statut=publie&page=2&limit=20`.

# Les bons codes de statut

Le code de statut (chapitre 1) communique le résultat de façon standard :

| Situation | Code |
|---|---|
| Lecture réussie | `200 OK` |
| Création réussie | `201 Created` |
| Succès sans contenu (suppression) | `204 No Content` |
| Requête invalide (validation) | `400 Bad Request` |
| Non authentifié | `401 Unauthorized` |
| Authentifié mais non autorisé | `403 Forbidden` |
| Ressource introuvable | `404 Not Found` |
| Conflit (doublon) | `409 Conflict` |
| Trop de requêtes | `429 Too Many Requests` |
| Erreur du serveur | `500 Internal Server Error` |

Renvoyer le bon code permet au client de **réagir correctement** (réessayer, rediriger vers la connexion, afficher un message).

# Créer une route d'API avec Next.js

Dans l'App Router, un fichier **`route.ts`** définit un point d'API. On y exporte une fonction par **méthode HTTP**.

```ts
// app/api/articles/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

// GET /api/articles
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statut = searchParams.get("statut") ?? undefined;
  const articles = await db.article.findMany({ where: { statut } });
  return NextResponse.json(articles);
}

const ArticleSchema = z.object({
  titre: z.string().min(1).max(200),
  contenu: z.string().min(1),
});

// POST /api/articles
export async function POST(request: Request) {
  const corps = await request.json();
  const resultat = ArticleSchema.safeParse(corps);
  if (!resultat.success) {
    return NextResponse.json(
      { erreur: "Données invalides", details: resultat.error.issues },
      { status: 400 },
    );
  }
  const article = await db.article.create({ data: resultat.data });
  return NextResponse.json(article, { status: 201 });
}
```

Pour une ressource précise, on crée `app/api/articles/[id]/route.ts` avec `GET`, `PATCH`, `DELETE` recevant l'`id` via `params`.

# Valider, autoriser, gérer les erreurs

Les règles vues dans les parcours de sécurité s'appliquent intégralement :

- **Valider** toutes les entrées (corps, paramètres, query) avec un schéma, jamais faire confiance au client.
- **Authentifier** et **autoriser** : vérifier qui appelle et qu'il a le droit d'accéder à **cette** ressource (éviter les IDOR).
- **Ne pas trop exposer** : renvoyer seulement les champs nécessaires, jamais une empreinte de mot de passe ou des données internes.
- **Erreurs structurées et cohérentes** : un format d'erreur uniforme aide le client.
- **Ne pas fuiter** de détails techniques : pas de trace d'exception brute en production ; un message générique au client, les détails dans les journaux serveur.

```ts
// Forme d'erreur cohérente
return NextResponse.json(
  { erreur: { code: "NON_TROUVE", message: "Article introuvable" } },
  { status: 404 },
);
```

> [!IMPORTANT]
> Une API est **publique** dès qu'elle est en ligne : on l'appelle avec n'importe quels paramètres, au-delà de ce que prévoit votre interface. Toute la robustesse se joue **côté serveur** : validation, autorisation, limites. L'interface n'est qu'un client parmi d'autres.

# Idempotence, limites et pagination

## L'idempotence

Une requête est **idempotente** si la répéter produit le même résultat qu'une seule fois. `GET`, `PUT` et `DELETE` le sont par définition ; **`POST` ne l'est pas** : un client qui renvoie une requête de création après une coupure réseau crée un **doublon** (deux commandes, deux paiements).

Pour les opérations sensibles, le client envoie une **clé d'idempotence** unique par opération ; le serveur l'enregistre avec le résultat et, s'il la revoit, renvoie le même résultat sans refaire l'opération :

```ts
export async function POST(requete: Request) {
  const cle = requete.headers.get("Idempotency-Key");
  if (!cle) return NextResponse.json({ erreur: { code: "CLE_MANQUANTE" } }, { status: 400 });

  const existante = await db.requeteIdempotente.findUnique({ where: { cle } });
  if (existante) return NextResponse.json(existante.reponse, { status: 201 });

  const commande = await creerCommande(await requete.json());
  await db.requeteIdempotente.create({ data: { cle, reponse: commande } }); // contrainte UNIQUE sur cle
  return NextResponse.json(commande, { status: 201 });
}
```

## La limitation de débit

Sans limite, un script peut appeler votre API des milliers de fois par seconde : essais de mots de passe, aspiration des données, facture d'un service externe qui explose. La **limitation de débit** (*rate limiting*) fixe un nombre maximal de requêtes par période, par utilisateur ou par adresse IP. Au-delà, l'API répond **`429 Too Many Requests`** avec un en-tête `Retry-After`. Les compteurs sont stockés dans un service partagé (Redis, ou la protection de l'hébergeur), pas en mémoire, pour fonctionner avec plusieurs instances. Les limites les plus strictes s'appliquent aux routes sensibles : connexion, inscription, réinitialisation de mot de passe, appels coûteux.

## La pagination

Une liste ne se renvoie jamais en entier : 100 000 tâches dans une réponse saturent le serveur, le réseau et le navigateur. On **pagine** :

- **par décalage** (`?page=3&taille=20`, soit `LIMIT 20 OFFSET 40`) : simple, mais lent sur les grandes tables et instable si des lignes sont ajoutées entre deux pages ;
- **par curseur** (`?apres=<id de la dernière tâche reçue>`) : stable et performant, idéal pour le défilement infini.

On impose une **taille maximale** (par exemple 100) côté serveur, quelle que soit la valeur demandée.

> [!NOTE]
> Si l'API est appelée depuis un **autre domaine** que celui du front-end, le navigateur applique la politique de même origine : il faut configurer **CORS**, détaillé dans le chapitre sur l'architecture du module de déploiement. CORS n'est pas un contrôle d'accès : l'authentification reste indispensable.

# Documenter l'API

Une spécification **OpenAPI** décrit les points d'entrée, paramètres, schémas et réponses : elle sert de documentation, de contrat et de base pour générer des clients et des tests. Pour une petite API interne, une documentation claire et des types TypeScript partagés suffisent souvent au départ.

# Exercices

## Exercice 1 : Concevoir les URL

Concevez les routes REST pour gérer des **tâches** : lister, créer, lire une tâche, la modifier, la supprimer, et lister les tâches d'un projet.

<details>
<summary>Voir la solution</summary>

```text
GET    /api/taches                      → lister (avec filtres : ?faite=true&page=1)
POST   /api/taches                      → créer
GET    /api/taches/42                    → lire
PATCH  /api/taches/42                    → modifier
DELETE /api/taches/42                    → supprimer
GET    /api/projets/7/taches             → les tâches du projet 7
```

Noms au pluriel, action exprimée par la méthode HTTP.

</details>

## Exercice 2 : Choisir les codes

Quel code de statut renvoyer dans chaque cas ?

1. Création réussie d'un utilisateur.
2. Tentative de lecture d'une ressource qui n'existe pas.
3. L'utilisateur est connecté mais n'a pas le droit de supprimer cette ressource.
4. Le corps envoyé ne passe pas la validation.

<details>
<summary>Voir la solution</summary>

1. **201 Created**.
2. **404 Not Found**.
3. **403 Forbidden** (authentifié mais non autorisé ; **401** serait « non authentifié »).
4. **400 Bad Request**, idéalement avec le détail des erreurs de validation.

</details>

## Exercice 3 : Revue d'une route

Relevez les problèmes de cette route `GET /api/utilisateurs/[id]` :

```ts
export async function GET(request, { params }) {
  const user = await db.user.findUnique({ where: { id: Number(params.id) } });
  return NextResponse.json(user);
}
```

<details>
<summary>Voir la solution</summary>

1. **Pas de contrôle d'accès** : n'importe qui peut lire n'importe quel utilisateur (IDOR). Vérifier l'authentification et que l'appelant a le droit de voir **cet** utilisateur.
2. **Sur-exposition** : `user` complet contient probablement l'empreinte du mot de passe et des champs internes. Sélectionner uniquement les champs publics.
3. **Cas introuvable non géré** : si `user` est `null`, renvoyer **404**, pas `null` avec un code 200.
4. `params` peut être une promesse selon la version de Next.js (`await params`), et `Number(params.id)` doit être validé (un id non numérique donne `NaN`).

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Concevoir une API REST
center: Exposer des ressources par des URL, agir avec les méthodes HTTP, valider et autoriser côté serveur.
points:
  - icon: link
    title: Ressources et URL
    text: Noms au pluriel, verbe = méthode HTTP ; filtres et pagination en query string.
  - icon: check
    title: Codes de statut
    text: 200, 201, 204, 400, 401, 403, 404, 409, 429, 500 ; le bon code aide le client.
  - icon: server
    title: route.ts
    text: Une fonction par méthode HTTP ; NextResponse.json avec le bon status.
  - icon: shield
    title: Valider et autoriser
    text: Schéma sur toutes les entrées, authentification, droits sur la ressource, pas de sur-exposition.
  - icon: book
    title: Documenter
    text: OpenAPI comme contrat ; types partagés pour une petite API interne.
  - icon: key
    title: Idempotence et limites
    text: Clé d'idempotence pour les créations sensibles, 429 au-delà du débit, listes paginées.
pitfall: Croire que l'interface protège l'API ; elle n'est qu'un client parmi d'autres.
remember: Une API en ligne est publique ; toute la robustesse se joue côté serveur.
```
