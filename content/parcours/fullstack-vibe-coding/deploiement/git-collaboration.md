---
title: Git et collaboration
description: Versionner son code avec Git, le flux branches et pull requests, résoudre les conflits, et collaborer sur GitHub.
duration: 50
objectives:
  - Utiliser Git pour versionner un projet
  - Travailler avec des branches et des pull requests
  - Résoudre un conflit de fusion
  - Collaborer efficacement sur une forge
---

# Pourquoi Git ?

**Git** est un système de **gestion de versions** : il enregistre l'historique de votre code, permet de **revenir en arrière**, de **travailler à plusieurs** sans s'écraser, et de comprendre **qui a changé quoi, quand et pourquoi**. C'est un outil **indispensable**, utilisé sur quasiment tous les projets.

Une **forge** comme **GitHub** (ou GitLab, Bitbucket) héberge les dépôts Git en ligne et ajoute la collaboration : pull requests, revues, suivi des tâches, intégration continue.

# Les commandes de base

```bash
git init                      # initialiser un dépôt dans un dossier
git status                    # voir l'état des fichiers
git add fichier.ts            # préparer un fichier (ou "git add ." pour tout)
git commit -m "Message clair" # enregistrer un instantané
git log --oneline             # voir l'historique
```

Un **commit** est un instantané du projet à un moment donné, avec un message. On fait des commits **petits et cohérents**, avec des messages qui décrivent le **pourquoi** (« Corrige le calcul de TVA sur les remises », pas « modif »).

## Ce qu'on ne versionne pas

Un fichier **`.gitignore`** liste ce qui ne doit pas entrer dans Git :

```text
node_modules/      # dépendances (réinstallables avec npm install)
.env.local         # secrets - JAMAIS dans Git
.next/             # fichiers générés par le build
*.log
```

> [!WARNING]
> Ne versionnez **jamais** de secrets (`.env`, clés d'API). Un secret poussé reste dans l'**historique** même après suppression : il faut le **révoquer** (parcours cybersécurité). Mettez `.env.local` dans le `.gitignore` **dès le départ**.

# Le flux branches et pull requests

On ne travaille pas directement sur la branche principale (`main`). On crée une **branche** par fonctionnalité ou correction, on y travaille isolément, puis on la fusionne via une **pull request**.

```diagram
type: flow
title: Le flux de travail avec branches et pull requests
steps:
  - title: Brancher
    text: git switch -c ajout-panier
    tone: blue
  - title: Commits
    text: Petits changements cohérents
    tone: blue
  - title: Pousser
    text: git push vers la forge
    tone: amber
  - title: Pull request
    text: Relecture par un pair, CI
    tone: teal
  - title: Fusionner
    text: Intégration dans main
    tone: teal
```

```bash
git switch -c ajout-panier         # créer et aller sur une nouvelle branche
# ... modifications, commits ...
git push -u origin ajout-panier    # pousser la branche sur la forge
# puis ouvrir une pull request sur GitHub
```

La **pull request** (PR) est l'endroit où l'on **relit** le code avant de l'intégrer : un pair vérifie, commente, demande des ajustements ; la CI (lint, types, tests) s'exécute automatiquement. On ne fusionne qu'une fois la revue **approuvée** et la CI **verte**. C'est un pilier de la qualité et de la sécurité (parcours Data Engineering et cybersécurité).

```video
url: https://www.youtube.com/watch?v=nCKdihvneS0
title: "How to create a pull request in 4 min | GitHub for Beginners"
channel: "GitHub"
duration: "3:44"
lang: en
why: "GitHub montre en quatre minutes comment ouvrir une pull request depuis une branche."
```

# Synchroniser et résoudre les conflits

```bash
git pull                     # récupérer les changements des autres
```

Un **conflit** survient quand deux personnes ont modifié **les mêmes lignes**. Git marque les zones en conflit :

```text
<<<<<<< HEAD
const taux = 0.2;
=======
const taux = 0.21;
>>>>>>> autre-branche
```

On **choisit** la bonne version (ou on combine), on retire les marqueurs `<<<`, `===`, `>>>`, puis on valide la résolution :

```bash
# après avoir édité le fichier pour résoudre
git add fichier.ts
git commit
```

> [!TIP]
> Pour limiter les conflits : des branches **courtes** (fusionnées vite), des commits **fréquents**, et une **synchronisation régulière** avec `main`. Plus une branche vit longtemps à l'écart, plus elle diverge et plus les conflits sont douloureux.

# Bien collaborer

- **Messages de commit clairs** : ils racontent l'histoire du projet.
- **Petites PR** : plus faciles et plus rapides à relire qu'une énorme PR.
- **Relire avec bienveillance** : on commente le code, pas la personne ; on explique le pourquoi.
- **Un README** à jour : comment installer et lancer le projet.
- **Ne jamais réécrire l'historique partagé** (`push --force` sur `main`) sauf accord explicite.

> [!NOTE]
> Il existe des conventions d'équipe (noms de branches, format des messages comme *Conventional Commits*, stratégies de fusion). L'essentiel pour débuter : brancher, committer clairement, ouvrir des PR relues, et ne pas versionner de secrets. Le reste s'apprend au sein de chaque équipe.

# Exercices

## Exercice 1 : Le flux de base

Décrivez les commandes pour ajouter une fonctionnalité « page de contact » en suivant le flux branches/PR.

<details>
<summary>Voir la solution</summary>

```bash
git switch -c page-contact            # nouvelle branche
# ... créer la page, tester ...
git add app/contact/page.tsx
git commit -m "Ajoute la page de contact"
git push -u origin page-contact       # pousser
# ouvrir une pull request sur GitHub, attendre la revue et la CI
# après approbation : fusionner dans main
```

</details>

## Exercice 2 : Le secret poussé

Un développeur a committé `.env.local` avec la clé de base de données, puis l'a supprimé dans un commit suivant. Est-ce réglé ?

<details>
<summary>Voir la solution</summary>

Non : le fichier reste dans l'**historique** Git, accessible à quiconque a accès au dépôt. Il faut : (1) **révoquer** et changer immédiatement la clé/le mot de passe ; (2) ajouter `.env.local` au `.gitignore` ; (3) éventuellement réécrire l'historique (avec `git filter-repo`), en sachant que les copies déjà clonées le contiennent toujours. La vraie correction est la **révocation** du secret.

</details>

## Exercice 3 : Résoudre un conflit

Après `git pull`, Git signale un conflit dans `prix.ts` : votre branche met `const taux = 0.2`, `main` met `const taux = 0.21`. La bonne valeur est 0,21. Que faites-vous ?

<details>
<summary>Voir la solution</summary>

Ouvrir `prix.ts`, trouver les marqueurs de conflit, garder `const taux = 0.21`, supprimer les marqueurs `<<<<<<<`, `=======`, `>>>>>>>` et la version 0.2. Puis :

```bash
git add prix.ts
git commit            # valide la résolution du conflit
```

Vérifier ensuite que les tests passent toujours.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Git et collaboration
center: Versionner l'historique, travailler par branches et pull requests, et collaborer proprement.
points:
  - icon: git
    title: Les bases
    text: init, add, commit, log ; commits petits, cohérents, aux messages clairs.
  - icon: lock
    title: gitignore
    text: node_modules, fichiers générés, et surtout jamais de secrets (.env).
  - icon: loop
    title: Branches et PR
    text: Une branche par fonctionnalité, relue en pull request, fusionnée après CI verte.
  - icon: tool
    title: Conflits
    text: Choisir la bonne version, retirer les marqueurs, add puis commit ; branches courtes.
  - icon: users
    title: Collaborer
    text: Petites PR, revue bienveillante, README à jour, pas de force sur main.
pitfall: Laisser une branche diverger longtemps, ou pousser un secret en croyant le supprimer ensuite.
remember: Un secret poussé reste dans l'historique ; la seule vraie correction est de le révoquer.
```
