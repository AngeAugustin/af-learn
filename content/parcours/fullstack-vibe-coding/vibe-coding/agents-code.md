---
title: Travailler avec un agent de code
description: Ce qu'est un agent de code, comment lui donner le contexte du projet (CLAUDE.md, AGENTS.md), planifier avant d'écrire, découper en petites tâches vérifiées par les tests, le connecter à des outils avec MCP, encadrer ses permissions et relire ses modifications.
duration: 55
objectives:
  - Expliquer ce qui distingue un agent de code d'un assistant de complétion
  - Rédiger un fichier de contexte de projet utile
  - "Mener une tâche en quatre temps : explorer, planifier, implémenter, vérifier"
  - Utiliser les tests et les outils comme boucle de vérification de l'agent
  - Connecter des outils avec MCP et encadrer les permissions
  - Relire et intégrer les modifications d'un agent en gardant la responsabilité du code
---

# Qu'est-ce qu'un agent de code ?

Un **assistant de complétion** propose la suite de la ligne que vous écrivez. Un **agent de code** (Claude Code, Codex, Cursor en mode agent, GitHub Copilot en mode agent…) reçoit un **objectif** et agit en boucle : il lit les fichiers du projet, cherche dans le code, lance des commandes (tests, lint, build), modifie plusieurs fichiers, observe les résultats et corrige, jusqu'à ce que la tâche soit terminée.

```diagram
type: flow
title: La boucle d'un agent de code
steps:
  - title: Comprendre
    text: Lit les fichiers, cherche les usages, consulte le contexte du projet
    tone: blue
  - title: Agir
    text: Modifie le code, crée des fichiers
    tone: violet
  - title: Vérifier
    text: Lance les tests, le typage, le lint, observe les erreurs
    tone: teal
  - title: Corriger
    text: Ajuste jusqu'à ce que les vérifications passent, puis rend compte
    tone: amber
```

La qualité du résultat dépend surtout de deux choses : le **contexte** que l'agent reçoit et la qualité de sa **boucle de vérification**. Un agent qui peut lancer des tests fiables se corrige seul ; un agent sans tests produit du code plausible dont personne ne sait s'il fonctionne.

# Donner le contexte du projet

Un agent démarre chaque session **sans mémoire** du projet. Un fichier de contexte, lu automatiquement à chaque session : `CLAUDE.md` pour Claude Code, `AGENTS.md` (format partagé par plusieurs outils), règles de Cursor, lui donne ce qu'un nouveau développeur apprendrait les premiers jours :

```markdown
# Tâches Pro

Application Next.js 16 (App Router), TypeScript strict, Prisma + PostgreSQL, Tailwind.

## Commandes
- `npm run dev` : serveur de développement
- `npm test` : tests unitaires (vitest) - à lancer après chaque modification
- `npm run lint` et `npx tsc --noEmit` : doivent passer avant de rendre la main
- `npx prisma migrate dev --name <nom>` : nouvelle migration (ne jamais modifier une migration existante)

## Conventions
- Les mutations passent par des Server Actions dans `app/**/actions.ts`, validées par zod
- Toute requête Prisma filtre par `equipeId` de la session (multi-locataire)
- Composants d'interface dans `components/ui/` (shadcn/ui) : les réutiliser, ne pas en créer de nouveaux sans raison

## À ne pas faire
- Ne pas ajouter de dépendance sans le signaler
- Ne pas toucher à `lib/auth.ts` sans demande explicite
```

> [!TIP]
> Un bon fichier de contexte est **court** et **concret** : commandes exactes, conventions qui ne se devinent pas en lisant le code, pièges connus. Inutile d'y recopier ce que l'agent trouvera seul dans le code. Mettez-le à jour quand vous corrigez plusieurs fois l'agent sur le même point : c'est une consigne qui manque.

```video
url: https://www.youtube.com/watch?v=gv0WHhKelSE
title: "Claude Code best practices | Code w/ Claude"
channel: "Anthropic"
duration: "25:53"
lang: en
why: "Les bonnes pratiques de Claude Code présentées par Anthropic : donner du contexte au projet, planifier, puis faire vérifier le travail."
```

# Mener une tâche

## Explorer, planifier, implémenter, vérifier

Pour une tâche non triviale, demander directement le code donne souvent une solution qui ignore l'existant. Il vaut mieux procéder en étapes :

1. **Explorer** : « Lis le module de facturation et explique-moi comment sont calculés les montants. Ne modifie rien. »
2. **Planifier** : « Propose un plan pour ajouter les avoirs : fichiers touchés, migration, tests. » On relit et on corrige le plan, c'est le moment le moins cher pour changer de direction.
3. **Implémenter** le plan validé, par petites étapes.
4. **Vérifier** : tests, typage, lint, puis essai réel dans le navigateur.

## Des tâches petites et vérifiables

| Demande floue | Demande efficace |
|---|---|
| « Améliore la page des tâches » | « Ajoute un filtre par statut à `/taches`, stocké dans l'URL (`?statut=`), avec un test du filtrage dans `taches.test.ts` » |
| « Corrige le bug du paiement » | « Le webhook Stripe active deux fois certaines commandes (journaux joints). Écris d'abord un test qui reproduit le double traitement, puis rends le gestionnaire idempotent » |
| « Refais l'authentification » | Plusieurs tâches successives, chacune relue et commitée |

> [!IMPORTANT]
> Les **tests sont la boucle de rétroaction** de l'agent. Demandez d'écrire le test **avant** la correction (il doit échouer, puis passer), et vérifiez que l'agent n'a pas « fait passer » les tests en les affaiblissant, en les supprimant ou en codant en dur le résultat attendu.

## Les outils et MCP

Le **Model Context Protocol** (MCP) est un protocole ouvert qui connecte un agent à des **outils** et des **sources de données** externes par des serveurs MCP : base de données de développement, gestionnaire de tickets, documentation, navigateur pour tester l'interface, outil de conception. L'agent peut alors lire le ticket, interroger le schéma de la base ou vérifier visuellement la page qu'il vient de modifier.

> [!WARNING]
> Chaque serveur MCP ajouté donne de **nouvelles capacités** à l'agent, et le contenu qu'il renvoie (ticket, page web, document) peut contenir une **injection de prompt**. N'installez que des serveurs de confiance, donnez-leur les droits minimaux (une base de **développement** en lecture seule, jamais la production), et méfiez-vous des contenus externes.

# Encadrer l'agent

## Permissions et isolement

Un agent qui exécute des commandes peut faire des dégâts : supprimer des fichiers, lancer une migration sur la mauvaise base, publier une branche. Les outils proposent des **niveaux de permission** (demander avant chaque commande, autoriser certaines commandes sûres comme les tests, refuser les commandes dangereuses) et des modes d'**isolement** (bac à sable, conteneur).

- Aucun **secret de production** dans l'environnement de l'agent ; une base locale ou de test.
- Les actions irréversibles ou visibles (pousser, déployer, publier, supprimer des données) restent soumises à **votre accord**.
- Travailler sur une **branche** (ou un *worktree* Git, qui permet de faire travailler plusieurs agents en parallèle sur des copies séparées du dépôt) et commiter souvent : on peut toujours revenir en arrière.

## Relire les modifications

Le code produit par un agent est **votre** code : vous en êtes responsable devant l'équipe et les utilisateurs. Avant de l'intégrer :

- lire le **diff complet**, pas seulement le résumé de l'agent, qui peut être optimiste ;
- vérifier les points sensibles : **autorisation** (filtre par propriétaire), validation des entrées, secrets, requêtes N+1, gestion des erreurs ;
- repérer le code **inutile** ou dupliqué (une fonction recréée alors qu'elle existait), les dépendances ajoutées ;
- exécuter soi-même l'application sur le parcours concerné ;
- passer par la **revue de code** habituelle et la CI, comme pour tout autre changement.

## Le coût et la mesure

Les agents consomment beaucoup de jetons (ils lisent de nombreux fichiers et font plusieurs allers-retours). Pour garder un bon rapport coût / bénéfice : sessions **courtes et ciblées** (une tâche par session, contexte repris de zéro pour la suivante), fichier de contexte à jour plutôt que des explications répétées, et choix du modèle selon la difficulté de la tâche.

# Exercices

## Exercice 1 : Le fichier de contexte

Lors de ses trois dernières sessions, l'agent a : utilisé `npm` alors que le projet utilise `pnpm`, oublié de filtrer les requêtes par équipe, et créé un composant `Bouton` alors que `components/ui/button.tsx` existe. Que faire ?

<details>
<summary>Voir la solution</summary>

Ces corrections répétées signalent des **consignes manquantes** dans le fichier de contexte (`CLAUDE.md` ou `AGENTS.md`). Ajouter : les commandes exactes avec `pnpm` ; la règle « toute requête filtre par `equipeId` de la session » (et, mieux encore, un test ou une fonction d'accès aux données qui l'impose) ; « réutiliser les composants de `components/ui/` ». Garder le fichier court et concret.

</details>

## Exercice 2 : Les tests verts trop vite

Vous demandez à un agent de corriger un calcul de TVA. Il annonce « Tous les tests passent ». Le diff montre qu'il a modifié la valeur attendue dans le test existant. Que s'est-il passé et comment cadrer la tâche ?

<details>
<summary>Voir la solution</summary>

L'agent a fait passer le test en **changeant l'attendu** au lieu de corriger le code : le test ne protège plus rien. Cadrage : préciser que les tests existants sont la référence et ne doivent pas être modifiés sans justification ; demander d'abord un **test qui reproduit le bug** (et échoue), puis la correction ; **relire le diff** des fichiers de test à chaque fois ; demander une explication de la cause du bug.

</details>

## Exercice 3 : Les permissions

Un développeur lance un agent en mode « tout autoriser » dans un terminal où les variables d'environnement pointent vers la base de production, pour « gagner du temps » sur une migration. Quels risques, et quelle configuration recommander ?

<details>
<summary>Voir la solution</summary>

L'agent peut exécuter une migration destructrice, un `DELETE` de test ou un script de remise à zéro **sur la production**, sans demande de confirmation ; un contenu malveillant lu pendant la session (injection de prompt) pourrait aussi déclencher des commandes. Recommandations : environnement **sans secret de production**, base locale ou de test ; permissions qui autorisent les commandes sûres (tests, lint) et demandent confirmation pour le reste ; migration de production appliquée **par la CI** après revue, jamais par l'agent ; travail sur une branche.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Travailler avec un agent de code
center: Un bon contexte, une boucle de vérification fiable et une relecture humaine.
points:
  - icon: loop
    title: La boucle
    text: Comprendre, agir, vérifier, corriger, jusqu'à ce que les tests passent.
  - icon: file
    title: Fichier de contexte
    text: "CLAUDE.md ou AGENTS.md : commandes, conventions, pièges ; court et à jour."
  - icon: compass
    title: Planifier d'abord
    text: Explorer, planifier, implémenter, vérifier ; petites tâches précises.
  - icon: test
    title: Tests
    text: Le test d'abord ; vérifier qu'il n'a pas été affaibli.
  - icon: network
    title: MCP
    text: Des outils et données en plus, avec droits minimaux et méfiance.
  - icon: eye
    title: Relire
    text: Diff complet, autorisation, secrets, doublons ; le code reste le vôtre.
pitfall: Accepter le résumé de l'agent sans lire le diff, dans un environnement qui a accès à la production.
remember: Un agent est aussi bon que les tests qu'il peut lancer et la relecture qui suit.
```
