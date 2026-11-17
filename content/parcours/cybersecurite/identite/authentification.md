---
title: L'authentification
description: Facteurs d'authentification, MFA et résistance à l'hameçonnage, passkeys et WebAuthn, gestion sécurisée des sessions et des jetons, récupération de compte.
duration: 55
objectives:
  - Comparer les méthodes d'authentification multifacteur selon leur robustesse
  - Expliquer pourquoi les passkeys résistent à l'hameçonnage
  - Sécuriser les sessions (cookies, renouvellement, expiration) et éviter les pièges des JWT
  - Protéger les parcours de connexion et de récupération de compte
---

# Les facteurs d'authentification

S'authentifier, c'est **prouver** son identité. Les preuves possibles se rangent en trois catégories, les **facteurs** :

| Facteur | Exemples |
|---|---|
| Ce que je **sais** | Mot de passe, code PIN, réponse secrète |
| Ce que je **possède** | Téléphone, clé de sécurité, carte à puce |
| Ce que je **suis** | Empreinte digitale, reconnaissance faciale |

L'**authentification multifacteur** (MFA) combine au moins deux facteurs de catégories **différentes**. Deux mots de passe ne font pas une MFA. Elle bloque l'immense majorité des attaques qui reposent sur un mot de passe volé, deviné ou réutilisé (*credential stuffing* : essayer en masse des couples identifiant / mot de passe issus de fuites d'autres sites).

# Toutes les MFA ne se valent pas

```diagram
type: flow
title: Robustesse face à l'hameçonnage, de la plus faible à la plus forte
steps:
  - title: Code par SMS
    text: Interception, détournement de ligne, saisie sur un faux site
    tone: rose
  - title: Code TOTP
    text: Résiste au détournement de ligne, mais peut être saisi sur un faux site
    tone: amber
  - title: Push avec nombre
    text: Limite la fatigue MFA, reste contournable par un faux site
    tone: amber
  - title: Passkey ou clé FIDO2
    text: Liée au domaine, inutilisable sur un faux site
    tone: teal
```

- Le **SMS** reste mieux que rien, mais il est vulnérable au **détournement de ligne** (un attaquant convainc l'opérateur de transférer le numéro) et à l'interception.
- Les **codes TOTP** (*Time-based One-Time Password*, RFC 6238), générés par une application d'authentification à partir d'un secret partagé et de l'heure, sont plus sûrs, mais un **faux site** peut demander le code et le rejouer immédiatement sur le vrai site (hameçonnage en temps réel).
- Les **notifications push** peuvent être approuvées par lassitude après des dizaines de demandes : c'est l'attaque par **fatigue MFA**. La parade est la **correspondance de nombre** (l'utilisateur saisit dans l'application le nombre affiché à l'écran) et le contexte de la demande (lieu, application).
- Les **passkeys** et **clés de sécurité FIDO2** sont **résistantes à l'hameçonnage**.

# Les passkeys et WebAuthn

Une **passkey** (clé d'accès) est une paire de clés cryptographiques créée **pour un site précis**. La clé privée reste dans l'appareil (téléphone, ordinateur, clé de sécurité) ou dans un gestionnaire de mots de passe qui la synchronise ; le site ne stocke que la clé publique. Le standard sous-jacent est **WebAuthn** (W3C), avec les protocoles **FIDO2** de la FIDO Alliance.

```diagram
type: sequence
title: Connexion avec une passkey (simplifiée)
actors: [Utilisateur, Navigateur et appareil, Serveur]
messages:
  - from: 1
    to: 2
    text: Je veux me connecter
  - from: 2
    to: 1
    text: Défi aléatoire à signer
  - from: 0
    to: 1
    text: Déverrouillage local (empreinte, visage ou code de l'appareil)
  - from: 1
    to: 2
    text: Défi signé avec la clé privée liée à CE domaine
  - from: 2
    to: 1
    text: "Signature vérifiée avec la clé publique : connecté"
```

Pourquoi c'est résistant à l'hameçonnage :

- le **navigateur** inclut le **domaine réel** dans ce qui est signé et n'utilise que la passkey créée pour ce domaine : sur `banque-securite.com`, la passkey de `banque.fr` est tout simplement inutilisable ;
- il n'y a **aucun secret à saisir**, donc rien à voler ;
- le serveur ne stocke **aucun secret** : une fuite de sa base ne donne que des clés publiques.

> [!TIP]
> Proposez les passkeys comme méthode de connexion principale, avec une MFA classique en solution de repli, et exigez des **clés de sécurité matérielles** pour les comptes les plus sensibles (administrateurs, finance).

# Les sessions

Après l'authentification, l'application doit **se souvenir** que l'utilisateur est connecté. C'est le rôle de la **session**, le plus souvent un identifiant aléatoire stocké dans un **cookie**. Voler une session équivaut à voler le compte, MFA comprise.

## Des cookies bien configurés

```text
Set-Cookie: session=Q8vK3...aléatoire...; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=28800
```

| Attribut | Rôle |
|---|---|
| `Secure` | Envoyé uniquement en HTTPS |
| `HttpOnly` | Inaccessible au JavaScript de la page : un script injecté (XSS, module 5) ne peut pas le lire |
| `SameSite=Lax` ou `Strict` | Non envoyé dans la plupart des requêtes initiées par d'autres sites : limite les attaques CSRF |
| `Max-Age` / `Expires` | Durée de vie limitée |

## Les règles de gestion

- Identifiant de session **long et aléatoire** (générateur cryptographique), jamais prévisible ni dans l'URL.
- **Nouvel identifiant** à chaque connexion et à chaque changement de privilège : sinon un attaquant qui a imposé un identifiant connu à la victime avant sa connexion récupère sa session (**fixation de session**).
- **Expiration** après inactivité et durée maximale absolue, adaptées à la sensibilité (quelques minutes pour une banque, plus pour une messagerie).
- **Déconnexion réelle** : la session est invalidée **côté serveur**, pas seulement le cookie effacé.
- **Réauthentification** pour les actions sensibles (changer d'adresse e-mail, de mot de passe, ajouter un bénéficiaire).

## Les jetons JWT

Les **JWT** (*JSON Web Tokens*) sont des jetons **signés** qui contiennent eux-mêmes des informations (identifiant, rôles, expiration). Pratiques entre services, ils ont des pièges :

- vérifier **toujours** la signature, avec un **algorithme imposé** par le serveur (refuser `alg: none` et toute confusion d'algorithme) ;
- vérifier l'**expiration** (`exp`), l'**émetteur** (`iss`) et le **destinataire** (`aud`) ;
- un JWT ne se **révoque** pas facilement : durées courtes et jetons de rafraîchissement révocables ;
- le contenu est seulement **encodé** en base64, **pas chiffré** : n'y mettez aucune donnée sensible.

> [!NOTE]
> Pour une application web classique, une session côté serveur dans un cookie `HttpOnly` est souvent plus simple et plus sûre qu'un JWT stocké dans le navigateur (le stockage local, `localStorage`, est lisible par tout script de la page).

```video
url: https://www.youtube.com/watch?v=xYfiOnufBSk
title: "How Passkeys Work - Computerphile"
channel: "Computerphile"
duration: "19:07"
lang: en
why: "Le fonctionnement des passkeys expliqué par Computerphile : la cryptographie à clé publique au service de la connexion sans mot de passe."
```

# Protéger la connexion et la récupération

- **Limitation des tentatives** par compte **et** par adresse, temporisation croissante, détection du credential stuffing (beaucoup de comptes différents depuis peu d'adresses).
- **Messages d'erreur neutres** : « identifiant ou mot de passe incorrect », sans indiquer lequel est faux, pour ne pas révéler quels comptes existent.
- **Récupération de compte** : c'est souvent le **maillon faible**. Lien de réinitialisation à usage unique, aléatoire, à courte durée de vie ; questions secrètes à proscrire (réponses devinables ou trouvables sur les réseaux sociaux) ; vérifications renforcées et délai pour les comptes sensibles ; notification de l'utilisateur sur tous ses canaux connus.
- **Notifications** de connexion depuis un nouvel appareil et de changement des paramètres de sécurité.

```video
url: https://www.youtube.com/watch?v=996OiexHze0
title: "OAuth 2.0 and OpenID Connect (in plain English)"
channel: "OktaDev"
duration: "1:02:17"
lang: en
why: "OAuth 2.0 et OpenID Connect expliqués simplement par OktaDev : la référence pour comprendre la délégation d'autorisation et la connexion fédérée."
```

# Exercices

## Exercice 1 : Classer les MFA

Une entreprise propose SMS, application TOTP, notifications push simples et clés de sécurité. Les comptes administrateurs utilisent le SMS. Que recommandez-vous ?

<details>
<summary>Voir la solution</summary>

- **Administrateurs** : clés de sécurité FIDO2 ou passkeys **obligatoires** (résistantes à l'hameçonnage) ; retrait du SMS.
- **Utilisateurs** : passkeys encouragées ; TOTP ou push **avec correspondance de nombre** acceptés ; SMS seulement en dernier recours.
- Supervision des demandes push répétées (signe d'attaque par fatigue).

</details>

## Exercice 2 : Revue d'une session

Une application place l'identifiant de session dans l'URL (`/compte?sid=1234`), utilise des identifiants incrémentaux, garde le même identifiant avant et après la connexion, et la déconnexion se contente de rediriger vers l'accueil. Listez les problèmes et corrections.

<details>
<summary>Voir la solution</summary>

1. **Identifiant dans l'URL** : il fuit dans l'historique, les journaux, l'en-tête `Referer` → le mettre dans un cookie `Secure; HttpOnly; SameSite`.
2. **Identifiants incrémentaux** : prévisibles, un attaquant devine ceux des autres → identifiants aléatoires longs.
3. **Même identifiant avant et après la connexion** : fixation de session → régénérer l'identifiant à la connexion.
4. **Déconnexion sans invalidation** : la session reste valide côté serveur → la supprimer côté serveur.
5. Ajouter une **expiration** après inactivité.

</details>

## Exercice 3 : Pourquoi la passkey bloque l'hameçonnage

Un utilisateur reçoit un faux courriel et clique sur un lien vers `micros0ft-login.com`, copie parfaite de la page de connexion. Expliquez ce qui se passe s'il utilise (a) un mot de passe et un code TOTP, (b) une passkey.

<details>
<summary>Voir la solution</summary>

(a) Il saisit son mot de passe et son code TOTP sur le faux site ; l'attaquant les **rejoue en temps réel** sur le vrai site (le code est encore valide quelques secondes) et récupère la session. Compte compromis.

(b) Le navigateur ne propose **aucune** passkey : celle de l'utilisateur est liée au domaine réel, pas à `micros0ft-login.com`. Même si l'utilisateur ne remarque pas la fausse adresse, il n'y a rien à saisir ni à voler. L'attaque échoue.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: L'authentification
center: Prouver l'identité avec des facteurs robustes, puis protéger la session comme le compte lui-même.
points:
  - icon: key
    title: Facteurs et MFA
    text: Savoir, posséder, être ; deux catégories différentes contre les mots de passe volés.
  - icon: shield
    title: Résister à l'hameçonnage
    text: SMS < TOTP < push avec nombre < passkeys et clés FIDO2 liées au domaine.
  - icon: lock
    title: Cookies de session
    text: Secure, HttpOnly, SameSite, durée limitée ; nouvel identifiant à la connexion.
  - icon: alert
    title: JWT
    text: Signature et algorithme imposés, exp, iss, aud vérifiés ; contenu non chiffré.
  - icon: users
    title: Connexion et récupération
    text: Tentatives limitées, erreurs neutres, réinitialisation à usage unique, notifications.
pitfall: Protéger la connexion par MFA mais laisser une récupération de compte par questions secrètes.
remember: Une passkey ne peut pas être saisie sur un faux site ; c'est ce qui la rend résistante à l'hameçonnage.
```
