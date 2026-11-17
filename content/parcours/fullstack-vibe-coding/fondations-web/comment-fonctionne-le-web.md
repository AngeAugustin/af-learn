---
title: Comment fonctionne le web
description: Client et serveur, DNS, HTTP et HTTPS, le trajet d'une requête, le rôle du navigateur, et l'outillage de base du développeur web.
duration: 45
objectives:
  - Décrire le modèle client-serveur et le rôle de chaque acteur
  - Expliquer ce qui se passe quand on ouvre une page web
  - Comprendre les bases de HTTP (méthodes, codes de statut, en-têtes)
  - Installer et utiliser l'outillage de base du développeur
---

# Le modèle client-serveur

Le web repose sur un dialogue entre deux rôles :

- le **client** : le plus souvent un **navigateur** (Chrome, Firefox, Safari…) qui **demande** des ressources ;
- le **serveur** : une machine qui **répond** à ces demandes en envoyant des pages, des images, des données.

Le client envoie une **requête**, le serveur renvoie une **réponse**. Ce dialogue suit un **protocole** commun, **HTTP**, qui garantit que n'importe quel client comprend n'importe quel serveur.

```diagram
type: flow
title: Le trajet d'une requête web
steps:
  - title: Saisie de l'adresse
    text: L'utilisateur tape exemple.fr
    tone: blue
  - title: Résolution DNS
    text: Le nom est traduit en adresse IP
    tone: amber
  - title: Connexion
    text: Le navigateur ouvre une connexion (TLS pour HTTPS)
    tone: amber
  - title: Requête HTTP
    text: GET de la page
    tone: teal
  - title: Réponse
    text: Le serveur renvoie le HTML, puis CSS, images, scripts
    tone: teal
  - title: Rendu
    text: Le navigateur affiche la page
    tone: violet
```

## Le DNS

Les machines se joignent par des **adresses IP** (`93.184.216.34`), difficiles à retenir. Le **DNS** (*Domain Name System*) est l'annuaire du web : il traduit un **nom de domaine** (`exemple.fr`) en adresse IP. Quand vous tapez une adresse, le navigateur interroge d'abord le DNS pour savoir **à quelle machine** s'adresser.

## Frontend et backend

- Le **frontend** (côté client) est ce qui s'exécute dans le navigateur : la structure (HTML), la présentation (CSS) et l'interactivité (JavaScript). C'est ce que l'utilisateur voit et manipule.
- Le **backend** (côté serveur) traite les demandes, applique la logique métier, parle à la base de données et renvoie des données ou des pages.

Un **développeur fullstack** travaille sur les **deux** côtés. Ce parcours construit d'abord le frontend, puis le backend, puis les relie.

# HTTP en bref

**HTTP** (*HyperText Transfer Protocol*) structure chaque échange. Une requête précise une **méthode**, une **URL** et des **en-têtes** ; la réponse contient un **code de statut**, des **en-têtes** et un **corps**.

## Les méthodes

| Méthode | Rôle | Exemple |
|---|---|---|
| `GET` | Lire une ressource | Afficher une page, récupérer des données |
| `POST` | Créer / envoyer des données | Soumettre un formulaire, créer un compte |
| `PUT` / `PATCH` | Modifier une ressource | Mettre à jour un profil |
| `DELETE` | Supprimer une ressource | Supprimer un élément |

`GET` ne doit **pas** modifier de données (module de sécurité web : c'est aussi une question de sécurité). Les autres méthodes servent aux actions qui changent l'état.

## Les codes de statut

| Famille | Signification | Exemples |
|---|---|---|
| 2xx | Succès | 200 OK, 201 Created |
| 3xx | Redirection | 301 (permanente), 302 (temporaire), 304 (non modifié) |
| 4xx | Erreur du client | 400 (requête invalide), 401 (non authentifié), 403 (interdit), 404 (introuvable) |
| 5xx | Erreur du serveur | 500 (erreur interne), 503 (indisponible) |

## HTTPS

**HTTPS** est HTTP **chiffré par TLS** : il garantit la confidentialité et l'intégrité des échanges, et authentifie le serveur. Aujourd'hui, **tout site doit être en HTTPS**, y compris en développement quand c'est possible. Le cadenas du navigateur indique une connexion chiffrée (mais pas que le site est honnête).

> [!NOTE]
> HTTP est **sans état** (*stateless*) : chaque requête est indépendante, le serveur ne « se souvient » pas de la précédente. Pour reconnaître un utilisateur d'une requête à l'autre (rester connecté), on utilise des **cookies** et des **sessions**, étudiés dans le module backend.

```video
url: https://www.youtube.com/watch?v=WGdOWtKL5nA
title: "HTTP : comprendre l'essentiel en 4 minutes"
channel: "Cookie connecté"
duration: "4:01"
lang: fr
why: "HTTP en quatre minutes et en français : requêtes, réponses, méthodes et codes de statut."
```

# Le rôle du navigateur

Le navigateur fait bien plus qu'afficher du texte. Il :

- **analyse** le HTML pour construire le **DOM** (*Document Object Model*), la représentation en mémoire de la page ;
- applique le **CSS** pour la mise en forme ;
- exécute le **JavaScript**, qui peut modifier le DOM et réagir aux actions de l'utilisateur ;
- gère le réseau, le stockage local, la sécurité (isolation entre sites), et bien plus.

Les **outils de développement** (*DevTools*, ouverts avec F12) sont l'instrument quotidien du développeur web : inspecter le HTML et le CSS, voir les requêtes réseau, déboguer le JavaScript dans la console, mesurer les performances.

```video
url: https://www.youtube.com/watch?v=qzWdzAvfBoo
title: "Comprendre le DNS en 5 minutes"
channel: "Cookie connecté"
duration: "5:11"
lang: fr
why: "Le DNS expliqué en cinq minutes par Cookie connecté : comment un nom de domaine devient une adresse IP avant même la première requête."
```

# L'outillage de base

Pour développer, quelques outils essentiels :

- un **éditeur de code** : **Visual Studio Code** est le plus répandu, gratuit et extensible ;
- un **navigateur** moderne avec ses DevTools ;
- **Node.js** : un environnement qui exécute du JavaScript **hors du navigateur**, indispensable pour l'outillage moderne et le backend (installez la version **LTS**) ;
- **npm** (installé avec Node.js) : le gestionnaire de **paquets** qui installe les bibliothèques ;
- **Git** : pour versionner son code (comme vu dans les autres parcours).

```bash
node --version     # vérifier l'installation (ex. v22.x)
npm --version      # gestionnaire de paquets
git --version      # gestion de versions
```

> [!TIP]
> N'installez pas tout d'un coup. Pour les premiers chapitres (HTML, CSS), un éditeur et un navigateur suffisent. Node.js devient utile dès qu'on aborde l'outillage JavaScript moderne.

# Exercices

## Exercice 1 : Le trajet d'une requête

Expliquez, étape par étape, ce qui se passe entre le moment où vous tapez `https://exemple.fr` et l'affichage de la page.

<details>
<summary>Voir la solution</summary>

1. Le navigateur demande au **DNS** l'adresse IP de `exemple.fr`.
2. Il ouvre une **connexion** vers cette IP et, en HTTPS, établit une session **TLS** chiffrée (vérification du certificat).
3. Il envoie une requête **`GET`** pour la page.
4. Le serveur renvoie une **réponse** (code 200, en-têtes, corps HTML).
5. Le navigateur **analyse** le HTML, construit le **DOM**, puis demande les ressources liées (CSS, images, JavaScript).
6. Il applique le CSS, exécute le JavaScript et **affiche** la page.

</details>

## Exercice 2 : Lire les codes de statut

Que signifie chaque réponse, et est-ce une erreur du client ou du serveur ?

1. `404 Not Found`
2. `500 Internal Server Error`
3. `301 Moved Permanently`
4. `401 Unauthorized`

<details>
<summary>Voir la solution</summary>

1. **404** : ressource introuvable, erreur **client** (l'URL demandée n'existe pas).
2. **500** : erreur interne, erreur **serveur** (un bug côté serveur).
3. **301** : redirection permanente, la ressource a changé d'adresse (ni erreur client ni serveur).
4. **401** : non authentifié, erreur **client** (il faut se connecter).

</details>

## Exercice 3 : Explorer avec les DevTools

Ouvrez un site que vous connaissez, ouvrez les DevTools (F12), et dans l'onglet « Réseau » rechargez la page. Que pouvez-vous observer ?

<details>
<summary>Voir la solution</summary>

On observe la **liste des requêtes** envoyées (document HTML, feuilles de style CSS, scripts JavaScript, images, polices, appels d'API…), pour chacune : la **méthode**, le **code de statut**, le **type**, la **taille** et le **temps** de chargement. On voit ainsi de quoi une page est réellement composée, combien de requêtes elle génère, et ce qui prend du temps. C'est l'outil de base pour comprendre et optimiser une page.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Comment fonctionne le web
center: Un client demande, un serveur répond, selon le protocole HTTP, sur des fondations DNS et HTTPS.
points:
  - icon: network
    title: Client et serveur
    text: Le navigateur demande, le serveur répond ; frontend côté client, backend côté serveur.
  - icon: compass
    title: DNS
    text: L'annuaire qui traduit un nom de domaine en adresse IP.
  - icon: link
    title: HTTP
    text: Méthodes (GET, POST, PUT, DELETE), codes de statut (2xx à 5xx), en-têtes.
  - icon: lock
    title: HTTPS
    text: HTTP chiffré par TLS ; indispensable partout aujourd'hui.
  - icon: terminal
    title: Outillage
    text: Éditeur (VS Code), navigateur et DevTools, Node.js et npm, Git.
pitfall: "Croire que le serveur « se souvient » des requêtes : HTTP est sans état, d'où cookies et sessions."
remember: Chaque page web est le résultat de nombreuses requêtes HTTP qu'on peut observer dans les DevTools.
```
