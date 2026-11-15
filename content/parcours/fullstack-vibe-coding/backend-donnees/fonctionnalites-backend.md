---
title: Les fonctionnalités backend courantes
description: Téléverser des fichiers vers un stockage objet, envoyer des e-mails transactionnels, encaisser des paiements avec webhooks et idempotence, exécuter des tâches en arrière-plan et planifiées, et pousser des mises à jour en temps réel.
duration: 65
objectives:
  - Téléverser des fichiers vers un stockage objet avec des URL présignées
  - Envoyer des e-mails transactionnels fiables
  - Intégrer un paiement en ligne et traiter ses webhooks de façon sûre et idempotente
  - Déplacer les traitements longs vers des tâches de fond et des tâches planifiées
  - Choisir entre interrogation périodique, SSE et WebSocket pour le temps réel
---

# Les fichiers des utilisateurs

Photos de profil, pièces jointes, factures : les fichiers ne se stockent **ni dans la base de données ni sur le disque du serveur** (il disparaît à chaque déploiement et n'est pas partagé entre plusieurs instances). On utilise un **stockage objet** : Amazon S3 ou un service compatible (Cloudflare R2, Scaleway, MinIO en local), ou le stockage intégré de l'hébergeur. La base ne garde que la **référence** du fichier (sa clé, son type, sa taille, son propriétaire).

## Les URL présignées

Faire transiter un gros fichier par votre serveur le surcharge inutilement. La méthode recommandée : le serveur vérifie les droits puis génère une **URL présignée**, valable quelques minutes, qui autorise **un seul envoi** directement vers le stockage.

```diagram
type: sequence
title: Téléversement avec une URL présignée
actors: [Navigateur, Serveur, Stockage objet]
messages:
  - from: 0
    to: 1
    text: Je veux envoyer « facture.pdf » (2 Mo, application/pdf)
  - from: 1
    to: 0
    text: Session, type et taille vérifiés ; URL présignée valable 5 minutes pour une clé unique
  - from: 0
    to: 2
    text: PUT du fichier directement
  - from: 0
    to: 1
    text: Téléversement terminé ; le serveur enregistre la référence
```

```ts
// app/api/televersement/route.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

const s3 = new S3Client({ region: process.env.S3_REGION });
const TYPES_AUTORISES = ["image/png", "image/jpeg", "application/pdf"];

export async function POST(requete: Request) {
  const utilisateur = await exigerSession();
  const { type, taille } = await requete.json();
  if (!TYPES_AUTORISES.includes(type) || taille > 10_000_000) {
    return Response.json({ erreur: "Fichier refusé" }, { status: 400 });
  }
  const cle = `utilisateurs/${utilisateur.id}/${randomUUID()}`;
  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key: cle, ContentType: type }),
    { expiresIn: 300 },
  );
  return Response.json({ url, cle });
}
```

> [!WARNING]
> Un fichier envoyé par un utilisateur est une **donnée non fiable** : limitez le **type** et la **taille**, générez vous-même le **nom** (jamais celui fourni, qui peut contenir `../`), gardez le compartiment **privé** et servez les fichiers privés par des URL présignées de lecture à durée courte. Ne servez jamais un fichier HTML ou SVG envoyé par un utilisateur depuis votre propre domaine (risque de XSS).

# Les e-mails transactionnels

Confirmation d'inscription, réinitialisation de mot de passe, facture : ce sont des e-mails **transactionnels**, déclenchés par une action. On ne les envoie pas avec son propre serveur de messagerie mais via un **service d'envoi** (Resend, Postmark, Amazon SES, Brevo…) qui gère la délivrabilité.

- **Configurer le domaine** : enregistrements DNS **SPF**, **DKIM** et **DMARC**, sans lesquels les messages finissent en spam ou sont rejetés.
- **Ne pas bloquer la requête** : l'envoi peut être lent ou échouer ; on le place idéalement dans une **tâche de fond** avec nouvelles tentatives.
- **Séparer** les e-mails transactionnels et les envois marketing (domaine ou flux distinct), et respecter le consentement pour ces derniers.
- **Tester** avec un service de capture en développement (Mailpit, ou le mode test du fournisseur) : aucun e-mail réel ne doit partir d'un environnement de test.

# Les paiements

Ne manipulez **jamais** vous-même les numéros de carte : un prestataire de paiement (**Stripe**, Adyen, Mollie, PayPal…) les prend en charge, avec la conformité PCI DSS et l'authentification forte exigée en Europe (3-D Secure). Le schéma le plus simple est une **page de paiement hébergée** (Stripe Checkout) :

1. le serveur crée une **session de paiement** (produit, prix, URL de retour) et redirige l'utilisateur ;
2. l'utilisateur paie sur la page du prestataire ;
3. le prestataire appelle votre **webhook** pour confirmer le paiement ;
4. c'est **le webhook** (et non la page de retour) qui active la commande ou l'abonnement.

> [!IMPORTANT]
> La page « Merci pour votre achat » ne prouve rien : l'utilisateur peut y arriver sans payer, ou fermer l'onglet avant d'y arriver alors qu'il a payé. **Seul le webhook signé** fait foi. De même, le **prix** est toujours déterminé côté serveur, jamais lu dans la requête du navigateur.

## Les webhooks

Un **webhook** est une requête HTTP qu'un service externe envoie à votre application quand un événement se produit (paiement réussi, abonnement annulé). Trois règles :

```ts
// app/api/webhooks/stripe/route.ts
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(requete: Request) {
  const corps = await requete.text(); // le corps brut, nécessaire à la vérification
  const signature = requete.headers.get("stripe-signature") ?? "";

  let evenement: Stripe.Event;
  try {
    // 1. Vérifier la signature : sinon n'importe qui peut « confirmer » un paiement
    evenement = stripe.webhooks.constructEvent(corps, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response("Signature invalide", { status: 400 });
  }

  // 2. Idempotence : un même événement peut être livré plusieurs fois
  const dejaTraite = await db.evenementTraite.findUnique({ where: { id: evenement.id } });
  if (dejaTraite) return new Response("Déjà traité", { status: 200 });

  if (evenement.type === "checkout.session.completed") {
    const session = evenement.data.object;
    await db.$transaction([
      db.commande.update({ where: { sessionId: session.id }, data: { statut: "PAYEE" } }),
      db.evenementTraite.create({ data: { id: evenement.id } }),
    ]);
  }

  // 3. Répondre vite (2xx) ; un traitement long part dans une tâche de fond
  return new Response("OK", { status: 200 });
}
```

- **Authentifier** : vérifier la signature avec le secret du webhook.
- **Être idempotent** : le prestataire **renvoie** l'événement s'il n'a pas reçu de réponse 2xx ; le même paiement ne doit jamais activer deux fois une commande. On enregistre l'identifiant de l'événement (contrainte d'unicité) dans la même transaction que son effet.
- **Répondre vite**, et ne pas supposer que les événements arrivent **dans l'ordre**.

> [!TIP]
> En développement, la CLI du prestataire (`stripe listen --forward-to localhost:3000/api/webhooks/stripe`) relaie les webhooks vers votre poste, et le **mode test** fournit des clés et des numéros de carte de test. Les clés de test et de production sont strictement séparées.

# Les tâches en arrière-plan

Une requête HTTP doit répondre en quelques centaines de millisecondes. Tout ce qui est **long**, **lent** ou **peu fiable** sort du cycle de la requête : envoi d'e-mails, génération de PDF, redimensionnement d'images, appels à des API externes, imports volumineux.

```diagram
type: flow
title: Une tâche de fond avec une file
steps:
  - title: La requête enregistre
    text: Crée l'export en base (statut EN_ATTENTE) et ajoute une tâche à la file
    tone: blue
  - title: Réponse immédiate
    text: « Votre export est en préparation »
    tone: blue
  - title: Un worker traite
    text: Processus séparé qui prend la tâche, avec nouvelles tentatives en cas d'échec
    tone: teal
  - title: Résultat
    text: Statut TERMINE, e-mail ou notification à l'utilisateur
    tone: violet
```

- Une **file de tâches** (*queue*) conserve les tâches jusqu'à leur traitement : BullMQ (sur Redis), pg-boss (sur PostgreSQL), ou des services gérés (Inngest, Trigger.dev, Amazon SQS).
- Les tâches doivent être **idempotentes** et **réessayables** : un worker peut s'arrêter au milieu d'une tâche, qui sera rejouée. Au-delà d'un nombre d'essais, la tâche part dans une **file des échecs** à examiner.
- Les **tâches planifiées** (*cron*) s'exécutent à heure fixe : relances quotidiennes, nettoyage des sessions expirées, rapports. La plupart des hébergeurs proposent des tâches planifiées qui appellent une route protégée par un secret.

> [!WARNING]
> Sur un hébergement « serverless », une fonction s'arrête dès que la réponse est envoyée : un `envoyerEmail()` lancé sans `await` après la réponse peut ne **jamais** s'exécuter. Utilisez une vraie file, ou les mécanismes prévus par la plateforme (`after()` dans Next.js pour un petit travail après la réponse).

# Le temps réel

Pour afficher des changements sans que l'utilisateur recharge la page (notifications, progression d'un export, messagerie, édition à plusieurs), trois techniques existent :

| Technique | Fonctionnement | Quand l'utiliser |
|---|---|---|
| **Interrogation périodique** (*polling*) | Le client redemande toutes les N secondes | Le plus simple ; suffisant pour une progression ou un tableau de bord |
| **Server-Sent Events (SSE)** | Une connexion HTTP où le **serveur** envoie des événements au fil de l'eau | Flux du serveur vers le client : notifications, réponse d'un LLM mot à mot |
| **WebSocket** | Connexion **bidirectionnelle** permanente | Échanges dans les deux sens et fréquents : messagerie, jeu, édition collaborative |

```ts
// Côté client : recevoir des événements SSE
const source = new EventSource("/api/notifications/flux");
source.onmessage = (e) => afficherNotification(JSON.parse(e.data));
```

> [!NOTE]
> Les connexions permanentes se prêtent mal aux fonctions serverless de courte durée et compliquent le passage à plusieurs serveurs (un message reçu par une instance doit atteindre des clients connectés à une autre : on passe alors par un canal Redis ou un service géré comme Pusher, Ably ou Supabase Realtime). Commencez par l'interrogation périodique si elle suffit.

# Exercices

## Exercice 1 : La commande payée deux fois

Des clients reçoivent deux colis pour une seule commande. Les journaux montrent que le webhook `checkout.session.completed` a été reçu deux fois pour le même événement, après un délai de réponse de 25 secondes. Expliquez et corrigez.

<details>
<summary>Voir la solution</summary>

Le gestionnaire mettait trop longtemps à répondre ; le prestataire, sans réponse 2xx à temps, a **renvoyé** l'événement, traité une seconde fois. Corrections : rendre le traitement **idempotent** (enregistrer `evenement.id` avec une contrainte d'unicité, dans la même transaction que l'effet, et ignorer un événement déjà vu) ; **répondre vite** et déplacer le travail long (préparation de l'expédition, e-mails) dans une **tâche de fond** idempotente elle aussi ; vérifier la signature.

</details>

## Exercice 2 : Le téléversement fragile

Une application reçoit les photos dans une Server Action, les enregistre dans `public/uploads/` avec le nom d'origine, et les sert depuis le même domaine. Après le passage à deux serveurs, la moitié des photos sont introuvables. Listez les problèmes.

<details>
<summary>Voir la solution</summary>

- **Disque local** : non partagé entre les serveurs et effacé aux déploiements → **stockage objet**, avec la référence en base.
- **Fichiers via le serveur** : charge inutile → **URL présignées** pour envoyer directement au stockage.
- **Nom d'origine** : risque de traversée de chemin et de collisions → nom généré (UUID).
- **Pas de contrôle de type et de taille**, et des fichiers servis depuis le domaine principal (risque de XSS avec un SVG ou un HTML) → liste de types autorisés, taille maximale, domaine séparé ou URL de lecture présignées, en-tête `Content-Disposition` adapté.

</details>

## Exercice 3 : Choisir la technique

Pour chaque besoin, choisissez interrogation périodique, SSE ou WebSocket : (a) afficher la progression d'un import qui dure 2 minutes ; (b) afficher la réponse d'un assistant IA au fil de sa génération ; (c) un tableau blanc partagé où chacun dessine en direct.

<details>
<summary>Voir la solution</summary>

(a) **Interrogation périodique** toutes les 2 à 5 secondes : simple et suffisant. (b) **SSE** (ou un flux HTTP) : le serveur envoie le texte au fur et à mesure, dans un seul sens. (c) **WebSocket** : échanges fréquents dans les deux sens, avec un service temps réel ou un canal partagé si plusieurs serveurs.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Les fonctionnalités backend courantes
center: Ce qui est lent, externe ou rejouable se conçoit pour l'échec et la répétition.
points:
  - icon: cloud
    title: Fichiers
    text: Stockage objet, URL présignées, type, taille et nom contrôlés.
  - icon: chat
    title: E-mails
    text: Service d'envoi, SPF, DKIM et DMARC, envoi en tâche de fond.
  - icon: money
    title: Paiements
    text: Prestataire et page hébergée ; seul le webhook signé fait foi.
  - icon: key
    title: Idempotence
    text: Un événement rejoué ne produit son effet qu'une fois.
  - icon: clock
    title: Tâches de fond
    text: File, worker, nouvelles tentatives, tâches planifiées.
  - icon: zap
    title: Temps réel
    text: Interrogation d'abord, SSE vers le client, WebSocket dans les deux sens.
pitfall: Activer une commande sur la page de retour du paiement au lieu du webhook signé.
remember: Tout ce qui peut être livré deux fois le sera un jour.
```
