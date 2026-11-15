---
title: "Projet final : un assistant documentaire agentique de production"
description: Concevoir, construire, évaluer, sécuriser et déployer un assistant RAG complet, puis le transformer en agent doté d'outils et de mémoire, en appliquant l'ensemble du parcours.
duration: 180
objectives:
  - Cadrer un projet d'IA avec des critères de succès mesurables
  - Construire un assistant RAG complet avec API, streaming et citations
  - Étendre l'assistant en agent avec outils, mémoire et garde-fous
  - Mettre en place l'évaluation automatisée de l'assistant et de l'agent
  - Sécuriser, superviser et documenter le système
  - Présenter le projet de façon professionnelle dans un portfolio
---

# Le cahier des charges

Ce projet réunit tout le parcours. Vous allez construire un **assistant documentaire** qui répond aux questions des utilisateurs à partir d'un corpus de documents, avec citations, puis le faire évoluer en **agent** capable d'agir et de se souvenir, et le livrer comme un vrai produit : testé, évalué, sécurisé, supervisé et documenté.

Si vous avez réalisé le **projet 2** (module 5), vous disposez déjà d'un RAG complet et évalué : réutilisez son corpus, son ingestion, sa configuration recommandée, sa génération citée et ses deux évaluations. À l'étape 1, complétez simplement le jeu avec des **questions de relance** et vos critères de succès chiffrés ; l'étape 2 consiste alors à brancher l'API de conversation et à mesurer votre version de référence. Vous consacrez ainsi l'essentiel du projet à ce qui est nouveau : la conversation, l'agent, la mémoire, la sécurité et la production.

**Choisissez un corpus réel** que vous connaissez et dont vous avez le droit de vous servir : la documentation d'une bibliothèque open source, les règlements de votre école ou association, les pages d'aide publiques d'un logiciel, des textes juridiques publics… Comptez au moins une cinquantaine de pages, de formats variés si possible.

Exigences fonctionnelles :

1. L'utilisateur pose une question en langage naturel ; la réponse s'affiche **en streaming**.
2. Chaque réponse **cite ses sources** (document et section), consultables.
3. Si l'information n'est pas dans le corpus, l'assistant **le dit** clairement.
4. L'assistant gère le **suivi de conversation** (questions de relance).
5. L'utilisateur peut donner un **retour** (utile / pas utile) sur chaque réponse.
6. **Version agent** (étape 4) : l'assistant peut **agir** via au moins deux outils (par exemple créer un ticket quand la documentation ne répond pas, et consulter une source de données structurée) et **se souvenir** des préférences de l'utilisateur d'une session à l'autre.

Exigences techniques :

- API backend (par exemple FastAPI) ; clé du fournisseur **uniquement côté serveur** ;
- PostgreSQL avec pgvector (ou une autre base vectorielle justifiée) ;
- ingestion **incrémentale** et **idempotente** ;
- jeu d'évaluation d'au moins **40 questions** ; évaluation automatisée exécutable en une commande ;
- traces de chaque requête, quotas par utilisateur, conteneurisation Docker ;
- un **README** complet.

```diagram
type: pipeline
title: Architecture cible du projet
lanes:
  - title: Ingestion
    steps:
      - title: Sources
        text: Fichiers du corpus
      - title: Extraction
        text: Texte et structure
      - title: Découpage
        text: Passages + métadonnées
      - title: Embeddings
        text: Un vecteur par passage
      - title: PostgreSQL
        text: pgvector + plein texte
  - title: Requête
    steps:
      - title: Interface web
        text: Streaming, citations, retours
      - title: API
        text: Authentification, quotas
      - title: Réécriture
        text: Question autonome
      - title: Recherche hybride
        text: Puis reranking éventuel
      - title: Génération
        text: Réponse citée, traces
```

# Étape 1 : Cadrer et préparer l'évaluation

Avant d'écrire la moindre ligne de code de RAG :

1. **Rédigez les critères de succès**, chiffrés. Par exemple : rappel@5 ≥ 0,85 ; fidélité ≥ 0,90 ; refus correct sur au moins 90 % des questions hors corpus ; latence avant le premier token inférieure à 2 secondes au p95.
2. **Constituez le jeu d'évaluation** : 40 questions au minimum, dont :
   - 25 questions dont la réponse est dans **un** passage précis (notez lequel) ;
   - 5 questions qui nécessitent de **combiner** deux passages ;
   - 5 questions **hors corpus**, auxquelles l'assistant doit refuser de répondre ;
   - 5 questions **difficiles** : vocabulaire différent des documents, termes exacts (codes, noms propres), questions de relance.
3. Pour chaque question, notez la **réponse de référence** ou les **éléments** que la réponse doit contenir.

> [!TIP]
> C'est l'étape que les débutants sautent et celle qui distingue un projet professionnel. Un portfolio qui montre « voici comment j'ai mesuré la qualité, et comment elle a évolué » impressionne bien plus qu'une démonstration sans chiffres.

# Étape 2 : Le pipeline de base

1. **Ingestion** (module 5, chapitre 2) : extraction propre, découpage récursif avec préfixe de titre, métadonnées, empreintes pour l'ingestion incrémentale.
2. **Stockage** (module 5, chapitre 3) : table de passages avec embedding, colonne plein texte, index HNSW et GIN.
3. **Recherche** : commencez par la recherche vectorielle seule.
4. **Génération** (module 5, chapitre 1) : prompt avec sources numérotées, citations obligatoires, refus explicite si l'information manque.
5. **API** (module 10, chapitre 1) : route de conversation en streaming, validation des entrées.

Puis **mesurez** : exécutez l'évaluation de la recherche (rappel@5, MRR) et de la génération (fidélité avec un juge validé sur un échantillon, refus corrects). Notez ces chiffres : c'est votre **version de référence**.

# Étape 3 : Itérer avec méthode

À partir de l'analyse d'erreurs (module 8), améliorez **une chose à la fois** et mesurez à chaque fois. Pistes, selon ce que révèle l'analyse :

| Problème observé | Piste |
|---|---|
| Rappel@5 faible sur les termes exacts | Recherche hybride avec fusion RRF |
| Bons passages mal classés | Reranking |
| Passages sans contexte | Préfixes de titres, contextualisation par LLM |
| Questions de relance mal comprises | Réécriture de requête |
| Affirmations non soutenues | Prompt plus strict, moins de passages, citations natives de l'API |
| Réponses trop longues ou trop lentes | Consigne de concision, effort de réflexion adapté, cache du prompt |

Tenez un **journal des expériences** : version, changement, scores, coût, latence, décision. Il figurera dans votre README.

```diagram
type: flow
title: Journal des expériences
steps:
  - title: "v1 : référence"
    text: "Vectoriel seul : rappel@5 = 0,72"
  - title: "v2 : hybride"
    text: "+ BM25 et RRF : rappel@5 = 0,84"
  - title: "v3 : reranking"
    text: "+ reranker : rappel@5 = 0,90"
  - title: "v4 : prompt"
    text: "Citations obligatoires : fidélité 0,86 → 0,93"
```

*(Valeurs illustratives : les vôtres dépendront de votre corpus.)*

# Étape 4 : Passer à l'agent

Une fois l'assistant RAG mesuré et stabilisé, transformez-le en **agent** (modules 6 et 7). Gardez la version RAG comme **référence** : l'agent doit faire au moins aussi bien sur les questions documentaires.

1. **Outils** : la recherche documentaire devient un outil (`rechercher_documentation`), ce qui permet le RAG agentique (plusieurs recherches, reformulées). Ajoutez au moins deux outils d'action ou de données : `creer_ticket` (quand la documentation ne répond pas), et une source structurée interrogée en lecture seule (module 5, chapitre 5).
2. **Harness** : limites d'itérations et de budget, permissions (la création de ticket est soumise à confirmation de l'utilisateur), outils idempotents, erreurs actionnables (module 7).
3. **Mémoire** : retenir les préférences durables de l'utilisateur (langue, niveau, produit utilisé), avec consolidation, consultation et suppression par l'utilisateur, isolation stricte (module 7, chapitre 3).
4. **Contexte** : nettoyage des anciens résultats d'outils, compaction pour les longues conversations (module 7, chapitre 2).
5. **Sécurité** : identifiez la **trifecta létale** dans votre architecture et cassez-la (module 9) ; ajoutez des documents piégés au corpus de test.
6. **Évaluation de l'agent** : 15 scénarios multi-tours exécutés 3 fois chacun dans un environnement de test (outils simulés qui enregistrent), avec vérification de l'état final, propriétés de trajectoire et **pass^3** (module 8, chapitre 3). Incluez des scénarios de mémoire sur deux sessions.

> [!TIP]
> Comparez honnêtement la version agent à la version RAG : qualité sur les questions documentaires, coût et latence par question. Si l'agent est plus cher et plus lent sans être meilleur sur les questions simples, routez ces questions vers le pipeline RAG direct et réservez l'agent aux demandes qui le justifient.

# Étape 5 : Production, sécurité et documentation

## Sécurité

- Clé du fournisseur côté serveur ; secrets hors de Git ; `.env.example` fourni.
- Quotas par utilisateur et taille maximale des questions.
- Sorties échappées à l'affichage ; pas d'images externes dans les réponses.
- Ajoutez au jeu d'évaluation **trois tentatives d'injection** (dans une question, et dans un document du corpus de test) et vérifiez le comportement.

## Supervision

- Une trace par requête : passages récupérés avec leurs scores, modèle, version du prompt, tokens, latence, raison d'arrêt.
- Enregistrement des retours utilisateurs, et procédure pour transformer les retours négatifs en cas de test.

## Livraison

- `Dockerfile` et, idéalement, `docker compose` (API + PostgreSQL) pour lancer le projet en une commande.
- Tests unitaires (découpage, construction du prompt, analyse des citations, limiteur de débit) exécutés en intégration continue, avec l'évaluation automatisée.
- **README** : objectif, architecture (schéma), installation, choix techniques justifiés, résultats d'évaluation et journal des expériences, limites connues et pistes d'amélioration, coûts estimés.

# Grille d'auto-évaluation

Avant de considérer votre projet comme terminé, vérifiez chaque point :

| Domaine | Critère | ✓ |
|---|---|---|
| Cadrage | Critères de succès chiffrés et écrits | |
| Évaluation | Au moins 40 questions annotées, dont hors corpus et difficiles | |
| Évaluation | Métriques de recherche et de génération mesurées séparément | |
| Évaluation | Juge LLM validé sur un échantillon annoté à la main | |
| Qualité | Journal des expériences avec au moins trois itérations mesurées | |
| Fonctionnel | Streaming, citations consultables, refus hors corpus, relances | |
| Ingestion | Incrémentale, idempotente, gère les suppressions | |
| Sécurité | Clé côté serveur, quotas, sorties échappées, tests d'injection | |
| Agent | Au moins deux outils d'action ou de données, limites, confirmation des actions | |
| Agent | Mémoire consultable et supprimable, isolée par utilisateur | |
| Agent | 15 scénarios × 3 exécutions, état final vérifié, pass^3 rapporté | |
| Sécurité agent | Trifecta létale analysée et cassée, documents piégés testés | |
| Exploitation | Traces, retours utilisateurs, Docker | |
| Code | Tests unitaires, configuration centralisée (modèle, prix) | |
| Documentation | README complet avec architecture, résultats et limites | |

> [!IMPORTANT]
> Soyez **honnête** dans la section « limites » de votre README : un système qui annonce ses faiblesses mesurées inspire bien plus confiance qu'un système présenté comme parfait. C'est aussi ce qu'on attend d'un AI Engineer en entreprise.

# Exercices

## Exercice 1 : Rédiger les critères de succès

Pour votre corpus, rédigez cinq critères de succès chiffrés couvrant la recherche, la génération, la latence, le coût et la sécurité.

<details>
<summary>Voir un exemple</summary>

1. **Recherche** : rappel@5 ≥ 0,85 sur les 30 questions dont la réponse est dans le corpus.
2. **Génération** : fidélité ≥ 0,90 (juge LLM validé, accord avec les annotations humaines ≥ 85 %) ; refus correct sur au moins 4 des 5 questions hors corpus.
3. **Latence** : délai avant le premier token inférieur à 2 s au p95, en local.
4. **Coût** : moins d'un montant cible par question en moyenne (calculé à partir des tokens mesurés et des tarifs officiels du moment).
5. **Sécurité** : aucune des tentatives d'injection du jeu d'évaluation ne conduit à une action ou une divulgation non prévue.

</details>

## Exercice 2 : Analyser un journal d'expériences

Votre journal indique : v2 (recherche hybride) améliore le rappel@5 de 0,72 à 0,84 mais la latence p95 passe de 1,4 s à 1,6 s ; v3 (reranking) porte le rappel@5 à 0,86 mais la latence p95 à 2,9 s. Votre critère de latence est 2 s. Que décidez-vous ?

<details>
<summary>Voir la solution</summary>

v2 apporte un gain important (+12 points) pour un surcoût de latence faible : on la conserve. v3 n'apporte que +2 points (peut-être du bruit sur 30 questions, soit moins d'une question) et fait **dépasser le critère de latence** : on ne la retient pas en l'état. Pistes : un reranker plus léger, moins de candidats à reclasser, ou y renoncer. On vérifie aussi l'effet sur la **fidélité**, car un meilleur classement peut améliorer la génération même à rappel quasi égal.

</details>

## Exercice 3 : Présenter le projet

Rédigez le paragraphe d'introduction du README de votre projet (5 à 8 phrases) : problème résolu, utilisateurs, approche, résultats clés mesurés et principale limite.

<details>
<summary>Voir un exemple</summary>

> **DocAssist** est un assistant qui répond aux questions sur la documentation publique d'une bibliothèque Python open source, en citant systématiquement les pages sources. Il s'adresse aux développeurs qui découvrent la bibliothèque et perdent du temps à chercher dans plus de 200 pages. Le système repose sur un RAG avec recherche hybride (pgvector et recherche plein texte, fusion RRF) et une génération contrainte à citer ses sources. Sur un jeu d'évaluation de 45 questions annotées, il atteint un rappel@5 de 0,88 et une fidélité de 0,93, et refuse correctement 5 questions hors corpus sur 5. La latence avant le premier token est de 1,5 s au p95. Principale limite : les questions qui nécessitent de combiner plus de deux pages restent difficiles (3 échecs sur 5), une piste étant un mode de recherche agentique.

*(Les chiffres doivent être ceux que vous avez réellement mesurés.)*

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Projet final : assistant documentaire"
center: Livrer un RAG complet comme un vrai produit, mesuré, sécurisé et documenté.
points:
  - icon: target
    title: Cadrer d'abord
    text: Critères de succès chiffrés et au moins 40 questions annotées avant d'écrire le RAG.
  - icon: rocket
    title: Le pipeline de base
    text: Ingestion, pgvector, génération citée, API en streaming ; puis mesurer la référence.
  - icon: chart
    title: Itérer avec un journal
    text: "Une modification à la fois : hybride, reranking, réécriture… avec scores, coût, latence."
  - icon: users
    title: Passer à l'agent
    text: Outils, mémoire, limites et confirmations ; scénarios évalués en pass^3 face à la version RAG.
  - icon: shield
    title: Production
    text: Clé côté serveur, quotas, sorties échappées, tests d'injection, traces, Docker.
  - icon: book
    title: Documenter
    text: README avec architecture, résultats mesurés et limites honnêtes.
pitfall: Présenter des chiffres non mesurés ou masquer les limites du système.
remember: Un portfolio convaincant montre ce qui a été mesuré, comment c'est mesuré et ce qui reste à améliorer.
```
