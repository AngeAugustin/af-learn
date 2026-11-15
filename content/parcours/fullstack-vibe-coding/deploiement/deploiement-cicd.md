---
title: Déploiement et mise en production
description: Les environnements, déployer une application Next.js, les variables d'environnement, les migrations de base, la CI/CD et la supervision en production.
duration: 50
objectives:
  - Distinguer les environnements et le cycle de déploiement
  - Déployer une application Next.js
  - Gérer les variables d'environnement et les migrations en production
  - Mettre en place CI/CD et supervision
---

# Du développement à la production

Déployer, c'est rendre son application **accessible aux utilisateurs**. On distingue plusieurs **environnements**, isolés et aussi semblables que possible :

```diagram
type: flow
title: Les environnements
steps:
  - title: Développement
    text: Sur la machine du développeur
    tone: blue
  - title: Recette (preview)
    text: Pour tester avant la mise en ligne
    tone: amber
  - title: Production
    text: L'application utilisée par les vrais utilisateurs
    tone: teal
```

On ne déploie en production que du code **relu, testé et validé**, jamais du code non vérifié, jamais « en direct » sur le serveur.

# Déployer une application Next.js

Une application Next.js se déploie de plusieurs façons :

- **Plateformes gérées** : **Vercel** (créateur de Next.js, le plus simple), **Netlify**, **Cloudflare**… On connecte le dépôt Git, et chaque push déclenche un déploiement automatique, avec une URL de **preview** par pull request. Idéal pour démarrer.
- **Conteneur Docker** (parcours cybersécurité/Data Engineering) : on empaquette l'application, déployable sur n'importe quel hébergeur ou cloud. Plus de contrôle, plus de travail.
- **Serveur classique** : construire (`npm run build`) puis lancer (`npm start`) derrière un reverse proxy.

```bash
npm run build       # construire la version de production optimisée
npm start           # lancer le serveur de production (après build)
```

> [!TIP]
> Pour un premier projet, une **plateforme gérée** comme Vercel évite presque toute la configuration : HTTPS, CDN, déploiements automatiques et previews sont inclus. On passe au conteneur ou au serveur dédié quand des besoins spécifiques le justifient (coût à grande échelle, contraintes de souveraineté, infrastructure existante).

# Variables d'environnement en production

Les secrets et la configuration (URL de base, clés) **diffèrent** entre environnements et ne sont **jamais** dans le code (chapitre sécurité). En production, on les configure dans l'**interface de l'hébergeur** (ou un gestionnaire de secrets), pas dans un fichier versionné.

- `DATABASE_URL` pointe vers la base de **production** (différente du développement).
- Les clés sont les clés **de production** (`sk_live_...`, pas `sk_test_...`).
- On vérifie qu'aucune variable sensible n'a le préfixe `NEXT_PUBLIC_`.

# Les migrations de base en production

La base de production contient les **vraies données** : on ne la modifie jamais à la main. Les changements de schéma passent par des **migrations** versionnées (chapitre ORM), appliquées lors du déploiement :

```bash
npx prisma migrate deploy      # applique les migrations en attente, en production
```

> [!WARNING]
> Une migration mal conçue peut **casser** la production ou **perdre des données** (supprimer une colonne encore utilisée, par exemple). Bonnes pratiques : **tester** les migrations en recette d'abord, les rendre **compatibles** avec l'ancienne version du code le temps du déploiement (déploiement sans interruption), et **sauvegarder** la base avant une migration risquée. Ne jamais appliquer une migration non testée directement en production.

# CI/CD

On automatise le chemin du code jusqu'à la production avec un **pipeline CI/CD** :

- **CI** (intégration continue) : à chaque pull request, lancer **lint**, **vérification des types** et **tests**. Un changement qui casse est détecté avant la fusion.
- **CD** (déploiement continu) : une fois fusionné dans `main`, déployer automatiquement (après la CI).

```yaml
# .github/workflows/ci.yml (principe)
name: CI
on: [pull_request]
jobs:
  verifier:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "22" }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
```

Les plateformes gérées font souvent le CD automatiquement. La CI, elle, reste **votre** responsabilité : c'est le filet de sécurité qui empêche le code cassé d'atteindre la production (parcours Data Engineering et cybersécurité pour approfondir).

# Après la mise en ligne : superviser

Déployer n'est pas la fin. En production, on **surveille** :

- les **erreurs** : un outil de suivi (Sentry, par exemple) capture les erreurs réelles des utilisateurs, avec le contexte pour les corriger ;
- la **performance** : Core Web Vitals réels, temps de réponse ;
- la **disponibilité** : une surveillance qui alerte si le site tombe ;
- les **journaux** : pour diagnostiquer les incidents.

On prévoit aussi de pouvoir **revenir en arrière** (*rollback*) rapidement si un déploiement introduit un problème : les plateformes gérées le permettent en un clic.

# Exercices

## Exercice 1 : La bonne cible de base

Un développeur configure `DATABASE_URL` en production avec l'URL de sa base **locale de développement**. Que va-t-il se passer ?

<details>
<summary>Voir la solution</summary>

La base locale n'est **pas accessible** depuis le serveur de production (elle est sur la machine du développeur) : l'application ne pourra pas se connecter et échouera. `DATABASE_URL` en production doit pointer vers la base **de production**, hébergée et accessible, configurée dans l'interface de l'hébergeur, jamais vers une base locale ni dans le code.

</details>

## Exercice 2 : Migration risquée

Une migration supprime la colonne `ancien_prix`, encore lue par la version du code actuellement en production pendant le déploiement. Quel est le risque et comment l'éviter ?

<details>
<summary>Voir la solution</summary>

Pendant le déploiement, l'ancien code tourne encore et lit `ancien_prix` qui vient d'être supprimée → **erreurs en production**. Pour un déploiement sans interruption : procéder en **étapes compatibles**, d'abord cesser d'utiliser la colonne dans le code (déployé), puis, dans une migration **ultérieure**, supprimer la colonne une fois qu'aucune version ne l'utilise. Tester en recette et sauvegarder avant.

</details>

## Exercice 3 : Le déploiement qui casse

Après un déploiement, les utilisateurs signalent une page blanche. Quelles sont vos premières actions ?

<details>
<summary>Voir la solution</summary>

1. **Revenir en arrière** (rollback) vers la version précédente qui fonctionnait, pour rétablir le service immédiatement.
2. **Consulter** les journaux et l'outil de suivi d'erreurs pour identifier la cause.
3. **Reproduire** en recette, corriger, ajouter un test qui aurait détecté le problème.
4. **Redéployer** après validation par la CI.

Rétablir d'abord, diagnostiquer ensuite : les utilisateurs ne doivent pas rester bloqués pendant l'investigation.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Déploiement et mise en production
center: Mettre en ligne du code relu et testé, gérer secrets et migrations, puis superviser et savoir revenir en arrière.
points:
  - icon: layers
    title: Environnements
    text: Développement, recette, production isolés ; seul du code validé va en production.
  - icon: rocket
    title: Déployer Next.js
    text: Plateforme gérée (Vercel) pour démarrer, conteneur ou serveur pour plus de contrôle.
  - icon: key
    title: Config en prod
    text: Secrets dans l'hébergeur, base de production, clés live, pas de NEXT_PUBLIC sensible.
  - icon: database
    title: Migrations
    text: migrate deploy ; testées en recette, compatibles, sauvegarde avant.
  - icon: eye
    title: CI/CD et supervision
    text: Lint, types, tests en CI ; suivi des erreurs, performance, disponibilité, rollback.
pitfall: Appliquer une migration non testée en production, ou déployer du code non validé.
remember: En cas de problème en production, on rétablit d'abord (rollback), on diagnostique ensuite.
```
