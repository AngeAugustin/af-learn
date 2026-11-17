# Cursus : plateforme d'apprentissage en ligne

Cursus est une plateforme de formation **responsive** (mobile, tablette, ordinateur) construite avec **Next.js** et **PostgreSQL**.
Les formations sont organisées en **parcours → modules → chapitres → sections**. Chaque chapitre se termine par des
**exercices corrigés** et une **évaluation** à réussir avec **au moins 75 %** pour débloquer le chapitre suivant.

Seize parcours complets sont disponibles, chacun avec exercices corrigés, sketchnotes de synthèse et évaluations :

| Parcours | Modules | Chapitres | Questions | Durée |
|---|---|---|---|---|
| **AI Engineering** | 11 | 49 | 599 | ≈ 52 h |
| **Data Engineering** | 10 | 33 | 435 | ≈ 33 h |
| **Cybersécurité** | 9 | 28 | 368 | ≈ 27 h |
| **Développement fullstack & Vibe coding** | 8 | 30 | 420 | ≈ 29 h |
| **Data Analyst** | 10 | 34 | 442 | ≈ 33 h |
| **Data Scientist** | 10 | 36 | 468 | ≈ 34 h |
| **Analyste BI** | 9 | 32 | 416 | ≈ 28 h |
| **DevOps** | 9 | 30 | 390 | ≈ 28 h |
| **Project Manager** | 9 | 30 | 390 | ≈ 27 h |
| **Marketing digital** | 8 | 28 | 364 | ≈ 27 h |
| **Product Manager** | 9 | 30 | 390 | ≈ 26 h |
| **Business Analyst** | 8 | 28 | 364 | ≈ 27 h |
| **BI Engineer** | 9 | 28 | 364 | ≈ 26 h |
| **Développer un projet de bout en bout avec Cursor** | 9 | 33 | 429 | ≈ 28 h |
| **Développer un projet de bout en bout avec Claude Code** | 9 | 33 | 429 | ≈ 28 h |
| **Utiliser GitHub Spec Kit** | 8 | 28 | 364 | ≈ 24 h |

Soit **510 chapitres**, **3778 sections**, **6632 questions d'évaluation** et des centaines d'exercices avec solutions.

## Design

L'interface suit le système de design **« Technical Precision »** conçu dans Google Stitch (dossier `design/` : maquettes, code HTML exporté et `technical_precision/DESIGN.md`) : palette Ruby Red `#A41623` (couleur principale), Air Force Blue `#4C86A8`, Saffron `#E1BC29`, White et Evergreen `#172815` (texte et base du thème sombre), typographies Sora (texte) et JetBrains Mono (code), micro-libellés monospace, badges de statut, encadrés à bordure gauche, blocs de code sombres et mise en page en trois colonnes pour la lecture. Les maquettes contenaient du contenu et des fonctionnalités fictifs (score en direct pendant le quiz, chronomètre, communauté, documentation, dates d'ouverture…) : seule la mise en forme a été reprise, avec les données et fonctionnalités réelles de la plateforme.

## Fonctionnalités

- Catalogue de parcours multi-domaines, programme détaillé de chaque parcours
- Lecture section par section en trois colonnes : sommaire du chapitre, contenu, sommaire « Dans cette section » (repliés sur mobile et tablette), durée de lecture et suivi de progression
- Exercices présentés en cartes numérotées avec solutions repliables
- Une **sketchnote** à la fin de chaque chapitre : synthèse visuelle au style dessiné à la main (idée centrale, 4 à 6 points clés illustrés, piège à éviter, phrase à retenir), à relire avant l'évaluation, avec un bouton **« Télécharger en PDF »** (page A4 générée dans le navigateur, toujours en thème clair)
- Contenu en Markdown enrichi : coloration syntaxique (Shiki), encadrés, tableaux, solutions repliables
- Illustrations : diagrammes de flux, comparaisons, couches, séquences, arbres de décision et schémas SVG sur mesure, tous responsives et compatibles thème sombre
- Évaluation par chapitre présentée question par question (frise Q1 → Q10, aperçu des réponses) : correction uniquement côté serveur après l'envoi, seuil de 75 %, tentatives illimitées, ordre des options mélangé, correction détaillée affichée après réussite
- **Testez-vous avant de lire** : en tête de chaque chapitre pas encore commencé, 3 questions de l'évaluation à tenter avant la lecture (non noté, rien n'est enregistré), avec correction et explications ; chercher une réponse avant d'apprendre améliore la mémorisation (effet de pré-test)
- **Tirage aléatoire** : chaque tentative pose 10 questions tirées dans la banque du chapitre (12 à 14 questions), avec un nouveau tirage à chaque essai
- **Révisions espacées** (page *Révisions*) : chaque chapitre validé ajoute ses questions aux révisions, qui reviennent à J+1, J+7, J+30 puis J+90 tant que la réponse est juste ; une erreur ramène la question au lendemain
- **Examens de module** (recommandés, non bloquants) : 15 questions tirées équitablement dans les chapitres du module, seuil de 75 %, correction révélée seulement après réussite
- **Examen final** : 30 questions réparties sur tous les modules, ouvert une fois le parcours validé et requis pour obtenir l'attestation
- Progression séquentielle : un chapitre s'ouvre quand le précédent est validé ; l'évaluation s'ouvre quand toutes les sections sont lues
- Tableau de bord (progression par module, dernières évaluations) et attestation imprimable de fin de parcours (tous les chapitres validés et examen final réussi)
- Comptes utilisateurs (mots de passe hachés avec bcrypt, sessions en base, cookies `httpOnly`), limitation des tentatives de connexion
- Thème clair / sombre
- **Back office** (`/admin`, réservé aux administrateurs) : voir la section [Back office](#back-office)

## Back office

Espace d'administration à l'adresse `/admin`, invisible pour les apprenants (une 404 leur est renvoyée). Le rôle est
vérifié côté serveur sur chaque page, chaque export et chaque action.

- **Vue d'ensemble** : inscrits, nouveaux inscrits et apprenants actifs (7 et 30 jours), chapitres validés, attestations,
  visites ; graphiques quotidiens des inscriptions et de l'activité ; entonnoir par parcours (1re section lue,
  1er chapitre validé, moitié du parcours, examen final tenté, attestation)
- **Catalogue** : tous les parcours avec leurs chiffres (modules, chapitres, questions, apprenants, attestations) et
  leur disponibilité : **Disponible**, **Bientôt disponible** (page d'annonce sans accès au contenu) ou **Masqué**
  (retiré du site, consultable par les administrateurs seuls avec un bandeau d'aperçu ; la progression des apprenants
  est conservée). Ordre d'affichage du catalogue, fiche du parcours (titre, accroche, description, niveau, couleur,
  icône, prérequis, objectifs), titres et descriptions des modules, chapitres (titre, description, durée, objectifs) et
  contenu Markdown de chaque section. Le HTML actif (script, iframe, formulaire, attribut `on…`, lien `javascript:`)
  est refusé hors des blocs de code. Les modifications sont notées dans une colonne `overrides` : `npm run db:seed`
  les conserve au lieu de les écraser, et chaque élément modifié peut être remis à la version des fichiers.
  **Questions d'évaluation** : énoncé, extrait de code, réponses (jusqu'à 8), bonne(s) réponse(s), choix multiple et
  explication, avec le taux d'erreur de chaque question en évaluation. La page Pédagogie renvoie directement vers les
  questions les plus ratées. Ajouter ou supprimer une question reste une opération sur les fichiers `.quiz.yaml`
- **Apprenants** : recherche par nom ou adresse, filtres (parcours commencé, actif ou inactif, suspendu, attestation),
  tris (inscription, dernière activité, progression), export CSV
- **Fiche apprenant** : progression par module et chapitre en cours, historique des évaluations et examens, révisions
  espacées, attestations avec lien de vérification, sessions ouvertes, historique d'administration
- **Gestion du compte** : modifier le nom ou l'adresse, envoyer un lien de réinitialisation du mot de passe (l'administrateur
  ne voit ni ne choisit jamais le mot de passe), suspendre ou réactiver, fermer toutes les sessions, réinitialiser la
  progression d'un chapitre ou d'un parcours, révoquer ou rétablir une attestation (la page `/verifier` affiche alors
  « révoquée »), exporter les données (droit d'accès), supprimer le compte (droit à l'effacement)
- **Visites** : mesure interne sans cookie ni outil tiers. L'adresse IP n'est jamais enregistrée : chaque visiteur est
  représenté par une empreinte quotidienne (IP + navigateur + sel du jour) et le sel est effacé après 48 heures. Rien
  n'est collecté si le navigateur envoie Do Not Track ou Global Privacy Control, ni pour les robots et l'espace
  d'administration. Pages vues, visiteurs par jour, pages les plus vues, sites d'origine, campagnes (`?utm_source=`),
  appareils, conversion visites vers inscriptions
- **Pédagogie** : questions les plus ratées, chapitres bloquants (taux d'échec, essais avant réussite, apprenants
  décrochés), durée médiane pour terminer un parcours
- **Journal** : toutes les actions d'administration, avec leur auteur. À la suppression d'un compte, ses entrées sont
  anonymisées
- **Administrateurs** : ajouter ou retirer un administrateur (impossible de se retirer soi-même ou de retirer le dernier)

Aucune route publique ne permet de devenir administrateur. Pour créer le premier, inscrivez-vous sur le site puis :

```bash
npm run admin:add -- votre@adresse.fr
```

## Prérequis

- Node.js 20 ou plus (testé avec Node.js 24)
- PostgreSQL 14 ou plus en local (testé avec PostgreSQL 17)

## Installation

### 1. Créer la base de données

Avec l'utilisateur `postgres` (le mot de passe est celui choisi à l'installation de PostgreSQL) :

```powershell
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h localhost -c "CREATE DATABASE cursus;"
```

> Dans PowerShell, le `&` est obligatoire devant un chemin entre guillemets. Dans Git Bash ou l'invite de commandes
> (`cmd`), retirez-le.

### 2. Configurer la connexion

Copiez `.env.example` en `.env.local` et renseignez votre mot de passe PostgreSQL :

```bash
cp .env.example .env.local
```

```
DATABASE_URL=postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/cursus
```

> Si le mot de passe contient des caractères spéciaux (`@`, `:`, `/`, `#`…), encodez-les pour l'URL (par exemple `@` devient `%40`).

### 3. Installer, créer les tables et charger le contenu

```bash
npm install
npm run db:setup
```

`db:setup` applique les migrations SQL (`db/migrations`) puis charge tout le contenu (`content/`) dans PostgreSQL.
La commande est **idempotente** : relancez-la après chaque modification du contenu, la progression des utilisateurs est conservée.
Sur Vercel, chaque déploiement de production l'exécute avant de construire le site. Les aperçus ne modifient pas la base.

### 4. Lancer le site

```bash
npm run dev
```

Puis ouvrez <http://localhost:3000>. Pour une version optimisée :

```bash
npm run build
npm start
```

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` / `npm start` | Construction et serveur de production |
| `npm run db:migrate` | Applique les migrations SQL en attente |
| `npm run db:setup` (ou `db:seed`) | Migrations + chargement du contenu |
| `npm run content:check` | Vérifie tout le contenu (structure, évaluations, diagrammes) et affiche un bilan |
| `npm run admin:add -- <email>` / `admin:remove -- <email>` / `admin:list` | Accorde, retire ou liste les droits d'administration |
| `npm test` | Tests unitaires et de contenu (Vitest) |
| `npm run typecheck` | Vérification TypeScript |
| `npm run lint` | ESLint |

Les tests d'intégration avec PostgreSQL s'exécutent si `TEST_DATABASE_URL` est défini. **Ils vident entièrement la base
indiquée** : utilisez une base dédiée, par exemple `cursus_test`.

```bash
TEST_DATABASE_URL=postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/cursus_test npm test
```

## Structure du projet

```
content/parcours/            Contenu des formations (Markdown + YAML)
  ai-engineering/
    parcours.yaml            Métadonnées du parcours et ordre des modules et chapitres
    <module>/<chapitre>.md           Chapitre : en-tête YAML + sections (titres « # »)
    <module>/<chapitre>.quiz.yaml    Évaluation du chapitre
db/migrations/               Schéma SQL versionné
scripts/                     Migrations, chargement du contenu, vérification
src/app/                     Pages (App Router) et actions serveur
src/components/              Interface : mise en page, chapitres, évaluations, diagrammes
src/lib/                     Accès aux données, authentification, rendu Markdown, logique d'évaluation
tests/                       Tests Vitest
```

## Ajouter ou modifier du contenu

### Un chapitre

Chaque chapitre est un fichier Markdown avec un en-tête YAML. Chaque titre de niveau 1 (`# Titre`) ouvre une
**section**. Un chapitre se termine toujours par la section `# Exercices`, suivie de la section
`# Sketchnote : l'essentiel à retenir` (synthèse visuelle relue juste avant l'évaluation).

````markdown
---
title: Titre du chapitre
description: Une phrase de présentation.
duration: 45            # minutes
objectives:
  - Premier objectif
  - Deuxième objectif
---

# Première section

Texte, listes, tableaux, `code`…

> [!TIP]
> Encadré (types : NOTE, TIP, IMPORTANT, WARNING, CAUTION).

```diagram
type: flow
title: Un flux
steps:
  - title: Étape 1
    text: Description
  - title: Étape 2
```

# Exercices

## Exercice 1 : Intitulé

Énoncé.

<details>
<summary>Voir la solution</summary>

Solution en **Markdown** (laisser une ligne vide après `<summary>` et avant `</details>`).

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Titre du chapitre
center: L'idée centrale du chapitre, en une phrase.
points:              # 4 à 6 bulles
  - icon: brain      # icônes disponibles : voir SKETCH_ICONS dans src/lib/sketchnote.ts
    title: Titre court
    text: Une ou deux lignes d'explication.
pitfall: Le piège principal à éviter.
remember: La phrase à retenir.
```
````

Types de diagrammes disponibles : `flow`, `pipeline`, `compare`, `layers`, `stack`, `sequence`, `decision` et `custom`
(schémas SVG sur mesure : voir `src/lib/diagrams/spec.ts`).

Dans le YAML des sketchnotes et des diagrammes, mettez entre guillemets les textes qui contiennent « : » (deux-points
suivis d'une espace), sinon le YAML les interprète comme une clé.

**Typographie : aucun tiret cadratin.** Utilisez « : » pour introduire une explication ou séparer un titre
(`## Exercice 1 : Intitulé`), une virgule pour prolonger une phrase, des parenthèses pour une incise et « · » comme
séparateur. `npm run content:check` et `npm test` échouent si un tiret cadratin apparaît dans `content/`, `src/` ou ce
README.

### Une évaluation

```yaml
questions:
  - prompt: Énoncé de la question ?
    options: [Réponse A, Réponse B, Réponse C]
    answer: [1]                 # indice(s) de la ou des bonnes réponses, à partir de 0
    explanation: Pourquoi B est correcte.
  - prompt: Question à plusieurs réponses ?
    multiple: true
    options: [A, B, C, D]
    answer: [0, 2]
    explanation: …
```

Au moins 8 questions par chapitre. Pour une question à choix multiples, il faut cocher **toutes** les bonnes réponses et
seulement elles.

### Un nouveau parcours

Créez `content/parcours/<slug>/parcours.yaml` (voir les exemples), avec `status: coming_soon` tant qu'il est en
préparation (ou `hidden` pour le relire en toute discrétion depuis un compte administrateur), puis `published` une fois
les modules et chapitres écrits. Lancez ensuite `npm run content:check` puis `npm run db:setup`. La disponibilité
choisie dans le back office l'emporte ensuite sur celle du fichier, jusqu'à ce qu'on y revienne depuis le back office.

## Choix techniques

- **Next.js (App Router)** avec composants serveur : le contenu est rendu côté serveur, seuls quelques composants
  interactifs (menu mobile, thème, formulaires, bouton de copie, export PDF des sketchnotes) s'exécutent dans le navigateur.
- **PostgreSQL** via le pilote `pg` et des migrations SQL versionnées : schéma explicite, sans dépendance lourde.
- **Contenu versionné en fichiers** puis chargé en base : facile à relire, à corriger et à faire évoluer avec Git.
- **Sécurité** : correction des évaluations uniquement côté serveur (les bonnes réponses ne sont jamais envoyées avant
  correction), vérification de l'accès aux chapitres côté serveur, jetons de session aléatoires dont seule l'empreinte
  SHA-256 est stockée, protection contre les redirections ouvertes.
  Mots de passe hachés avec bcrypt (coût 12), temps de réponse identique que le compte existe ou non, limitation des
  tentatives par adresse et par IP (connexion, inscription, réinitialisation, contact, mesure d'audience), ancienne
  session fermée à chaque connexion, et liens absolus construits depuis `APP_URL` en production (jamais depuis l'en-tête
  Host). En-têtes HTTP : CSP sans ressource externe, `frame-ancestors 'none'`, `nosniff`, HSTS en production,
  Permissions-Policy restrictive, back office en `no-store` et `noindex`. Un administrateur ne peut pas modifier
  l'adresse, envoyer un lien de réinitialisation ni fermer les sessions d'un autre administrateur.
