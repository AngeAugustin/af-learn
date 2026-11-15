---
title: L'OWASP Top 10 et le développement sécurisé
description: Les grandes familles de vulnérabilités web selon l'OWASP, les en-têtes de sécurité, la configuration, les composants vulnérables et l'intégration de la sécurité dans le cycle de développement.
duration: 55
objectives:
  - Connaître les catégories de l'OWASP Top 10 et ce qu'elles recouvrent
  - Configurer les en-têtes de sécurité HTTP essentiels
  - Éviter les erreurs de configuration et les composants vulnérables
  - Intégrer la sécurité à chaque étape du développement
---

# L'OWASP et son Top 10

L'**OWASP** (*Open Worldwide Application Security Project*) est une fondation à but non lucratif qui publie des ressources libres de référence sur la sécurité des applications : le **Top 10**, le standard de vérification **ASVS**, le guide de test **WSTG**, les **Cheat Sheets** (fiches pratiques par sujet) et des outils comme ZAP ou Juice Shop.

Le **Top 10** est un document de **sensibilisation** qui classe les catégories de risques les plus importants pour les applications web, à partir de données réelles et d'une enquête auprès de la communauté. L'édition **2021** a longtemps servi de référence :

| Rang | Catégorie (2021) | En bref |
|---|---|---|
| A01 | Contrôle d'accès défaillant | Accéder à des données ou fonctions non autorisées |
| A02 | Défaillances cryptographiques | Données sensibles non ou mal chiffrées |
| A03 | Injection | SQL, commandes, XSS : des données interprétées comme du code |
| A04 | Conception non sécurisée | Défauts dans la conception même, pas dans le code |
| A05 | Mauvaise configuration de sécurité | Paramètres par défaut, mode debug, erreurs verbeuses |
| A06 | Composants vulnérables et obsolètes | Bibliothèques et frameworks non mis à jour |
| A07 | Défaillances d'identification et d'authentification | Force brute, sessions mal gérées |
| A08 | Défaillances d'intégrité des logiciels et des données | Mises à jour et dépendances non vérifiées, désérialisation |
| A09 | Défaillances de journalisation et de surveillance | Attaques non détectées |
| A10 | Falsification de requête côté serveur (SSRF) | Le serveur forcé à appeler des ressources internes |

> [!NOTE]
> L'OWASP a publié une **édition 2025** du Top 10 qui réorganise ce classement : le contrôle d'accès reste en tête (la SSRF y est rattachée), la mauvaise configuration remonte, et deux catégories apparaissent : les **défaillances de la chaîne d'approvisionnement logicielle** (dépendances, outils de build) et la **mauvaise gestion des conditions exceptionnelles** (erreurs mal traitées). Consultez le site de l'OWASP pour la liste détaillée : les **familles de vulnérabilités** étudiées dans ce module restent les mêmes.

Le Top 10 est un point de départ, **pas** une norme exhaustive. Pour définir et vérifier les exigences de sécurité d'une application, on utilise l'**ASVS** (*Application Security Verification Standard*), organisé en niveaux selon la sensibilité de l'application.

Les chapitres suivants détaillent les vulnérabilités les plus importantes : injections et XSS, contrôle d'accès, CSRF et SSRF, puis la sécurité des API.

# La configuration de sécurité

Une grande partie des failles ne vient pas du code mais de la **configuration** :

- **mode debug** ou pages d'erreur détaillées en production (traces d'exécution, versions, requêtes SQL affichées à l'attaquant) ;
- **comptes et mots de passe par défaut** non changés (consoles d'administration, bases de données, équipements) ;
- **fonctions inutiles** activées : listage des répertoires, méthodes HTTP superflues, pages d'exemple ;
- **stockage cloud** ouvert au public par erreur ;
- en-têtes de sécurité absents.

## Les en-têtes de sécurité HTTP

Le navigateur applique des protections supplémentaires si le serveur les demande par des en-têtes :

| En-tête | Protection |
|---|---|
| `Content-Security-Policy` (CSP) | Limite les sources de scripts, styles, images… : réduit fortement l'impact des XSS |
| `Strict-Transport-Security` | Impose HTTPS (module 3) |
| `X-Content-Type-Options: nosniff` | Empêche le navigateur de deviner le type d'un fichier (et d'exécuter un fichier texte comme script) |
| `frame-ancestors` (dans la CSP) | Interdit l'intégration de la page dans un cadre d'un autre site (*clickjacking*) |
| `Referrer-Policy` | Limite les informations envoyées aux autres sites dans l'en-tête `Referer` |
| `Permissions-Policy` | Désactive les fonctions inutiles du navigateur (caméra, géolocalisation…) |

```text
Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'
Strict-Transport-Security: max-age=63072000; includeSubDomains
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

> [!TIP]
> Déployez une CSP progressivement : commencez en mode `Content-Security-Policy-Report-Only` pour collecter les violations sans rien bloquer, ajustez, puis passez en mode bloquant. Évitez `'unsafe-inline'` pour les scripts : préférez des **nonces** générés à chaque réponse.

# Les composants vulnérables

Une application moderne contient souvent **bien plus de code tiers que de code propre** : bibliothèques, frameworks, et leurs propres dépendances (dépendances transitives). Une vulnérabilité dans l'une d'elles rend l'application vulnérable.

Mesures :

- **inventaire** des dépendances (avec un SBOM, module 8) ;
- **analyse automatique** des vulnérabilités connues dans la CI : `npm audit`, `pip-audit`, Dependabot, Renovate, OWASP Dependency-Check, Trivy… ;
- **mises à jour régulières**, en petits incréments, plutôt qu'une migration douloureuse tous les trois ans ;
- **suppression** des dépendances inutilisées ;
- **fichiers de verrouillage** (`package-lock.json`, `poetry.lock`…) pour des installations reproductibles.

# La sécurité dans le cycle de développement

Corriger une vulnérabilité coûte d'autant plus cher qu'on la découvre tard. On intègre donc la sécurité à **chaque étape** (*shift left*) :

```diagram
type: flow
title: Un cycle de développement sécurisé
steps:
  - title: Exigences
    text: Besoins de sécurité, niveau ASVS visé
    tone: blue
  - title: Conception
    text: Modélisation des menaces (STRIDE)
    tone: blue
  - title: Développement
    text: Bibliothèques sûres, revue de code
    tone: teal
  - title: Vérification
    text: Analyse statique, dépendances, tests dynamiques
    tone: amber
  - title: Exploitation
    text: Journalisation, supervision, correctifs
    tone: rose
```

- **Ne pas réinventer** : utiliser les protections intégrées des frameworks (requêtes paramétrées des ORM, échappement automatique des gabarits, protections CSRF, gestion des sessions).
- **Revue de code** avec une attention particulière aux zones sensibles (authentification, autorisation, entrées utilisateur, appels système, cryptographie).
- **Outils** dans la CI : analyse statique (SAST), analyse des dépendances (SCA), détection de secrets, tests dynamiques (DAST) sur un environnement de recette (module 8).
- **Former** les développeurs : c'est le levier le plus efficace à long terme.

# Exercices

## Exercice 1 : Classer des vulnérabilités

Associez chaque constat à une catégorie de l'OWASP Top 10 (édition 2021) :

1. La page d'erreur affiche la trace complète de l'exception et la version du framework.
2. En changeant `?compte=1052` en `?compte=1053`, on voit le compte d'un autre client.
3. L'application utilise une version d'une bibliothèque de journalisation qui contient une vulnérabilité critique publiée il y a un an.
4. Aucune alerte n'a été déclenchée lors de 50 000 tentatives de connexion en une heure.

<details>
<summary>Voir la solution</summary>

1. **A05** : Mauvaise configuration de sécurité.
2. **A01** : Contrôle d'accès défaillant (IDOR).
3. **A06** : Composants vulnérables et obsolètes.
4. **A09** : Défaillances de journalisation et de surveillance (et A07 pour l'absence de limitation des tentatives).

</details>

## Exercice 2 : Écrire une CSP

Un site charge ses scripts et styles depuis son propre domaine, ses images depuis son domaine et `images.cdn-exemple.fr`, n'utilise aucun plugin et ne doit jamais être intégré dans un cadre. Proposez une politique CSP.

<details>
<summary>Voir la solution</summary>

```text
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' https://images.cdn-exemple.fr; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
```

À tester d'abord en mode `Report-Only`, puis activer.

</details>

## Exercice 3 : Prioriser

Une équipe de 4 développeurs, sans aucune pratique de sécurité, vous demande par quoi commencer. Proposez 5 actions classées.

<details>
<summary>Voir la solution</summary>

1. **Analyse des dépendances** dans la CI et mise à jour des composants vulnérables (gain rapide, risque élevé).
2. **Contrôle d'accès** : vérifier que chaque endpoint vérifie l'authentification et les droits sur la ressource (première catégorie du Top 10).
3. **Configuration** : désactiver le mode debug et les erreurs verbeuses, changer les mots de passe par défaut, ajouter les en-têtes de sécurité.
4. **Détection de secrets** et déplacement des secrets dans un coffre.
5. **Formation** courte de l'équipe aux vulnérabilités principales (injections, XSS, contrôle d'accès) et ajout d'une checklist de sécurité dans les revues de code.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: L'OWASP Top 10
center: Connaître les grandes familles de vulnérabilités et intégrer la sécurité à chaque étape du développement.
points:
  - icon: list
    title: Le Top 10
    text: Contrôle d'accès, crypto, injection, conception, configuration, composants, authentification…
  - icon: book
    title: Les ressources OWASP
    text: ASVS pour les exigences, WSTG pour les tests, Cheat Sheets pour la pratique.
  - icon: tool
    title: Configuration
    text: Pas de debug ni d'erreurs verbeuses, pas de mots de passe par défaut, en-têtes de sécurité.
  - icon: puzzle
    title: Composants
    text: Inventaire, analyse automatique, mises à jour régulières, fichiers de verrouillage.
  - icon: loop
    title: Développement sécurisé
    text: Menaces modélisées, protections des frameworks, revue de code, outils en CI, formation.
pitfall: Prendre le Top 10 pour une liste exhaustive d'exigences plutôt que pour un outil de sensibilisation.
remember: La plupart des failles web connues ont des parades connues ; il faut les appliquer partout et toujours.
```
