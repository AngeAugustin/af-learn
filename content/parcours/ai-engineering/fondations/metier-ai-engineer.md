---
title: Le métier d'AI Engineer
description: Ce que fait réellement un AI Engineer, en quoi il se distingue des autres métiers de la donnée, et la pile technique qu'il manipule au quotidien.
duration: 40
objectives:
  - Définir le rôle d'AI Engineer et le distinguer du ML Engineer, du Data Scientist et du chercheur
  - Identifier les couches de la pile technique d'une application d'IA
  - Décrire le cycle de vie d'un produit fondé sur un LLM
  - Repérer les compétences prioritaires à développer
---

# Qu'est-ce qu'un AI Engineer ?

Un **AI Engineer** construit des **produits logiciels** qui s'appuient sur des modèles d'IA existants, en particulier les **grands modèles de langage** (LLM, *Large Language Models*). Son travail ne consiste pas à inventer de nouvelles architectures de réseaux de neurones : il consiste à **prendre des modèles déjà entraînés**, puis à les intégrer de manière fiable, mesurable et sûre dans une application utilisée par de vrais utilisateurs.

Le métier s'est structuré à partir de 2022–2023, quand des modèles très capables sont devenus accessibles par simple appel d'API. Une partie du travail qui demandait auparavant une équipe de machine learning (collecter des données, entraîner un modèle, le déployer) peut désormais commencer par **un prompt et un appel HTTP**. La difficulté s'est déplacée : il ne s'agit plus seulement d'obtenir un modèle, mais de construire **autour** de lui un système qui fonctionne en production.

## Ce que fait un AI Engineer au quotidien

- **Intégrer des modèles** via des API (Anthropic, OpenAI, Google, Mistral…) ou des modèles open-weight hébergés soi-même.
- **Concevoir des prompts** et des instructions système robustes.
- **Connecter le modèle aux données** de l'entreprise (RAG, bases vectorielles, outils).
- **Construire des workflows et des agents** capables d'appeler des outils.
- **Évaluer** la qualité des réponses avec des jeux de tests et des métriques.
- **Mettre en production** : API, déploiement, supervision, maîtrise des coûts et de la latence.
- **Sécuriser** le système contre les injections de prompt et les fuites de données.

> [!NOTE]
> L'intitulé « AI Engineer » recouvre des réalités variables selon les entreprises. Dans certaines offres d'emploi, il désigne un profil proche du ML Engineer. Dans ce parcours, nous adoptons la définition la plus répandue aujourd'hui : un ingénieur logiciel spécialisé dans la construction d'applications fondées sur des modèles de fondation.

## Les métiers voisins

```diagram
type: compare
title: AI Engineer et métiers voisins
columns:
  - title: Chercheur en IA
    tone: violet
    items:
      - Invente de nouvelles architectures et méthodes
      - Entraîne des modèles de fondation
      - Publie des articles scientifiques
  - title: ML Engineer
    tone: blue
    items:
      - Entraîne et déploie des modèles sur des données métier
      - Gère les pipelines de données et d'entraînement (MLOps)
      - Optimise les performances des modèles
  - title: Data Scientist
    tone: teal
    items:
      - Analyse les données pour répondre à des questions
      - Construit des modèles statistiques et prédictifs
      - Communique des résultats aux décideurs
  - title: AI Engineer
    tone: amber
    items:
      - Construit des produits autour de modèles existants
      - Prompts, RAG, agents, évaluations
      - Déploiement, coûts, sécurité, expérience utilisateur
```

Ces frontières sont poreuses. Un AI Engineer gagne beaucoup à comprendre les bases du machine learning (c'est l'objet du module 2), et un ML Engineer travaille de plus en plus avec des LLM. La différence tient surtout au **point de départ** : le ML Engineer part des données pour produire un modèle, l'AI Engineer part d'un modèle existant pour produire un produit.

# La pile technique d'une application d'IA

Une application fondée sur un LLM ne se résume pas au modèle. On peut la décrire comme un empilement de couches, chacune avec ses propres choix techniques.

```diagram
type: layers
title: Les couches d'une application d'IA
layers:
  - title: Expérience utilisateur
    text: Interface web ou mobile, streaming des réponses, retours utilisateurs
    items: [Next.js, React, applications mobiles]
  - title: Application et orchestration
    text: Logique métier, prompts, workflows, agents, appels d'outils
    items: [Python, TypeScript, FastAPI, SDK des fournisseurs]
  - title: Données et contexte
    text: Documents, bases de données, recherche vectorielle, mémoire
    items: [PostgreSQL, pgvector, moteurs de recherche, stockage objet]
  - title: Modèles
    text: Modèles de langage, d'embeddings, de reranking, de vision ou de voix
    items: [API propriétaires, modèles open-weight]
  - title: Infrastructure et opérations
    text: Hébergement, GPU, supervision, évaluations, sécurité
    items: [Docker, cloud, observabilité, CI/CD]
```

**Point essentiel :** la majorité du code d'une application d'IA est du code logiciel classique : API, base de données, authentification, gestion des erreurs, tests. Le modèle est un composant, puissant mais **non déterministe**, qu'il faut encadrer. C'est pourquoi les fondations d'ingénierie logicielle (module 1) sont indispensables.

## Un composant non déterministe

Un programme classique, avec la même entrée, produit la même sortie. Un LLM peut produire des réponses différentes pour une même question, se tromper avec assurance (on parle d'**hallucination**) ou être détourné par un texte malveillant. Tout le métier consiste à transformer ce composant probabiliste en un système **fiable** :

- en **contraignant** ses sorties (formats structurés, validation) ;
- en lui fournissant le **bon contexte** (RAG, outils) ;
- en **mesurant** systématiquement sa qualité (évaluations) ;
- en **surveillant** son comportement en production (observabilité) ;
- en **limitant** ce qu'il a le droit de faire (sécurité, permissions).

> [!TIP]
> Retenez cette idée, elle reviendra dans tout le parcours : **on ne fait pas confiance à une sortie de modèle, on la vérifie.** Validation de schéma, tests, garde-fous et évaluations sont les outils de cette vérification.

# Le cycle de vie d'un produit fondé sur un LLM

Construire une fonctionnalité d'IA suit un cycle itératif. La différence majeure avec un développement classique : on ne sait pas à l'avance si le modèle sera « assez bon ». Il faut donc **mesurer tôt et souvent**.

```diagram
type: flow
title: Cycle de vie d'une fonctionnalité d'IA
loop: On recommence dès qu'un problème est détecté
steps:
  - title: Cadrer
    text: Problème utilisateur, critères de succès mesurables
  - title: Prototyper
    text: Un prompt et un modèle performant, sur quelques exemples
  - title: Évaluer
    text: Jeu de tests représentatif, métriques, analyse d'erreurs
  - title: Améliorer
    text: Prompt, contexte, outils, choix du modèle
  - title: Déployer
    text: API, garde-fous, maîtrise des coûts
  - title: Superviser
    text: Traces, retours utilisateurs, nouveaux cas de test
```

## Les étapes en détail

1. **Cadrer.** Quel problème résout-on, pour qui ? À quoi reconnaîtra-t-on une bonne réponse ? Sans critère de succès, impossible de savoir si une modification améliore ou dégrade le système.
2. **Prototyper.** On commence avec le modèle le plus capable disponible et un prompt simple, pour vérifier que la tâche est faisable. Optimiser les coûts trop tôt fait perdre du temps.
3. **Évaluer.** On constitue un jeu d'exemples représentatifs (y compris des cas difficiles) et on mesure. C'est l'étape la plus souvent négligée et la plus importante.
4. **Améliorer.** On agit sur le levier le plus simple d'abord : prompt, puis contexte (RAG, outils), puis architecture (workflow, agent), et seulement en dernier recours l'adaptation du modèle (fine-tuning).
5. **Déployer.** On expose la fonctionnalité derrière une API, avec gestion des erreurs, limites de débit, garde-fous et maîtrise des coûts.
6. **Superviser.** On enregistre les traces, on collecte les retours, et les cas d'échec observés en production deviennent de **nouveaux cas de test**.

> [!IMPORTANT]
> L'ordre des leviers compte. Une erreur fréquente consiste à vouloir faire du fine-tuning ou construire un agent complexe alors qu'un meilleur prompt ou un meilleur contexte aurait suffi. Commencez toujours par la solution la plus simple qui pourrait fonctionner.

# Penser produit : concevoir pour un système qui se trompe

Un AI Engineer ne livre pas un modèle, il livre une **fonctionnalité** utilisée par des personnes. Comme le modèle se trompera parfois, la conception du produit compte autant que la qualité du prompt.

## Choisir le bon niveau d'automatisation

| Niveau | Exemple | Quand le choisir |
|---|---|---|
| **Suggestion** | Brouillon de réponse que l'agent du support relit et envoie | Erreur coûteuse, utilisateur expert disponible |
| **Action avec validation** | L'agent prépare un remboursement, un humain clique « Confirmer » | Action irréversible ou engageante |
| **Automatisation complète** | Classement automatique des demandes entrantes | Erreur peu coûteuse et facile à corriger, qualité mesurée |

On commence souvent au niveau le plus prudent, puis on **augmente l'autonomie** à mesure que les mesures le justifient.

## Les règles d'une bonne expérience d'IA

- **Rendre l'erreur visible et réparable** : citer les sources, afficher les données extraites pour qu'on puisse les corriger, permettre d'annuler.
- **Fixer les attentes** : dire ce que l'assistant sait faire et ne sait pas faire, plutôt qu'une zone de saisie vide qui promet tout.
- **Gérer la latence** : streaming, indicateur d'étapes (« Recherche dans 3 documents… »), traitement en arrière-plan pour les tâches longues.
- **Prévoir l'échec** : un message utile quand le modèle ne sait pas, et une voie vers un humain.
- **Recueillir le retour** : pouce haut/bas, corrections de l'utilisateur, taux d'acceptation d'une suggestion. Ces signaux alimentent le jeu d'évaluation (module 8).

> [!TIP]
> Mesurez la valeur **métier**, pas seulement la qualité technique : temps gagné par dossier, taux de résolution sans escalade, taux d'acceptation des suggestions. Une fonctionnalité à 95 % d'exactitude que personne n'utilise est un échec.

# Les compétences à développer

Ce parcours est organisé autour des compétences réellement attendues d'un AI Engineer. Le tableau suivant les relie aux modules.

| Compétence | Pourquoi c'est important | Module |
|---|---|---|
| Python, API web, tests, Git | La base de tout code de production | 1 |
| Bases du machine learning | Comprendre ce que fait un modèle, ses limites, les embeddings | 2 |
| Fonctionnement des LLM | Choisir un modèle, régler l'inférence, anticiper les erreurs | 3 |
| API de LLM, prompts, outils | Le cœur de l'intégration | 4 |
| RAG et recherche | Donner au modèle accès aux bonnes informations | 5 |
| Workflows et agents | Automatiser des tâches en plusieurs étapes | 6 |
| Harness, contexte et mémoire | Rendre un agent fiable sur des tâches longues | 7 |
| Évaluations et observabilité | Savoir si le système fonctionne, et le prouver | 8 |
| Sécurité et IA responsable | Protéger les utilisateurs, les données et respecter la loi | 9 |
| Déploiement et coûts | Passer du prototype au produit | 10 |
| Fine-tuning et données synthétiques | Adapter un modèle quand le reste ne suffit pas | 11 |

## Comment progresser efficacement

- **Construire plus que lire.** Chaque chapitre propose des exercices : faites-les réellement, dans un éditeur, avec un vrai appel de modèle quand c'est possible.
- **Toujours mesurer.** Prenez l'habitude de constituer un petit jeu de tests avant de modifier un prompt.
- **Lire la documentation officielle.** Les API évoluent vite. La documentation des fournisseurs fait foi, pas un tutoriel daté.
- **Livrer des projets complets.** Un projet déployé, évalué et documenté vaut plus que dix tutoriels terminés. Le dernier chapitre de ce parcours vous guide dans un projet de bout en bout.

> [!WARNING]
> Le domaine évolue très vite : noms de modèles, prix et fonctionnalités changent plusieurs fois par an. Ce cours insiste sur les **concepts durables** et vous indique, quand c'est nécessaire, où vérifier les informations à jour.

# Exercices

## Exercice 1 : Classer des tâches

Pour chacune des tâches suivantes, indiquez quel profil (Chercheur, ML Engineer, Data Scientist, AI Engineer) en serait le plus naturellement responsable :

1. Construire un assistant qui répond aux questions des clients à partir de la documentation produit.
2. Proposer une nouvelle variante du mécanisme d'attention et la tester sur des benchmarks.
3. Entraîner un modèle de détection de fraude à partir de l'historique des transactions.
4. Analyser l'évolution des ventes et présenter les causes d'une baisse au comité de direction.
5. Mettre en place des évaluations automatiques pour un agent qui rédige des courriels.

<details>
<summary>Voir la solution</summary>

1. **AI Engineer** : on part d'un LLM existant et on le connecte à la documentation (RAG).
2. **Chercheur** : il s'agit d'inventer une nouvelle méthode.
3. **ML Engineer** : entraînement d'un modèle spécifique sur des données métier tabulaires.
4. **Data Scientist** : analyse et communication de résultats.
5. **AI Engineer** : l'évaluation de systèmes à base de LLM est au cœur du métier.

</details>

## Exercice 2 : Cartographier une application

On vous demande de construire un outil interne qui résume automatiquement les tickets de support et propose une catégorie. Pour chaque couche de la pile (expérience utilisateur, orchestration, données, modèles, infrastructure), listez au moins un composant concret dont vous auriez besoin.

<details>
<summary>Voir une proposition de solution</summary>

- **Expérience utilisateur** : une page listant les tickets avec le résumé et la catégorie proposée, un bouton pour corriger la catégorie (retour utilisateur).
- **Orchestration** : un service Python ou TypeScript qui récupère les nouveaux tickets, construit le prompt, appelle le modèle et valide la sortie (catégorie appartenant à une liste fermée).
- **Données** : la base de tickets existante, la liste des catégories, éventuellement des exemples de tickets déjà classés à insérer dans le prompt.
- **Modèles** : un LLM accessible par API (un modèle rapide et économique suffit souvent pour ce type de tâche, à confirmer par l'évaluation).
- **Infrastructure** : une tâche planifiée ou une file de messages, des journaux et des traces, un tableau de suivi du taux de corrections manuelles (qui sert d'indicateur de qualité).

</details>

## Exercice 3 : Définir des critères de succès

Pour l'outil de l'exercice 2, rédigez trois critères de succès **mesurables**.

<details>
<summary>Voir une proposition de solution</summary>

- Au moins 90 % des catégories proposées sont acceptées sans correction sur un jeu de 200 tickets annotés.
- Le résumé ne contient aucune information absente du ticket (vérifié par relecture d'un échantillon ou par un évaluateur automatique).
- Le traitement d'un ticket prend moins de 5 secondes et coûte moins d'un montant cible fixé par l'équipe.

Les seuils exacts dépendent du contexte métier ; l'important est qu'ils soient **chiffrés** et **vérifiables**.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Le métier d'AI Engineer
center: Construire des produits fiables autour de modèles existants, pas inventer de nouveaux modèles.
points:
  - icon: tool
    title: Un ingénieur produit
    text: Il intègre des modèles existants (API ou open-weight) dans de vraies applications.
  - icon: layers
    title: Une pile en 5 couches
    text: Interface, orchestration, données et contexte, modèles, infrastructure.
  - icon: alert
    title: Un composant non déterministe
    text: Le modèle peut se tromper avec assurance. On contraint, on vérifie, on limite.
  - icon: loop
    title: Un cycle itératif
    text: Cadrer, prototyper, évaluer, améliorer, déployer, superviser… et recommencer.
  - icon: list
    title: Le bon ordre des leviers
    text: Prompt, puis contexte (RAG, outils), puis architecture, puis fine-tuning en dernier.
pitfall: Se lancer dans un agent complexe ou un fine-tuning alors qu'un meilleur prompt ou un meilleur contexte aurait suffi.
remember: On ne fait pas confiance à une sortie de modèle, on la vérifie, et on mesure avant de changer quoi que ce soit.
```
