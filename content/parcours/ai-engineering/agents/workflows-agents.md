---
title: "Workflows et agents : définitions et choix"
description: Distinguer les workflows aux étapes prédéfinies des agents autonomes, comprendre la boucle agentique et savoir quand un agent est justifié.
duration: 45
objectives:
  - Définir un workflow et un agent, et les distinguer
  - Décrire la boucle agentique et ses conditions d'arrêt
  - Évaluer si une tâche justifie un agent
  - Situer les frameworks d'agents et leur intérêt
---

# Du LLM augmenté aux agents

La brique de base de tous les systèmes de ce module est le **LLM augmenté** : un modèle qui dispose d'outils (chapitre 4 du module 4), d'un accès à des données (RAG) et éventuellement d'une mémoire. À partir de cette brique, on construit deux grandes familles de systèmes.

Dans son article *Building effective agents* (décembre 2024), Anthropic propose une distinction devenue une référence :

- les **workflows** : des systèmes où les LLM et les outils sont orchestrés selon des **chemins définis à l'avance dans le code** ;
- les **agents** : des systèmes où le LLM **dirige lui-même** son processus et l'utilisation des outils, en décidant des étapes à suivre pour accomplir la tâche.

```diagram
type: compare
title: Workflow ou agent
columns:
  - title: Workflow
    tone: blue
    items:
      - Le code décide de l'enchaînement des étapes
      - Prévisible, testable, coût maîtrisé
      - Idéal quand les étapes sont connues à l'avance
      - "Ex. : extraire → vérifier → rédiger une réponse"
  - title: Agent
    tone: violet
    items:
      - Le modèle décide des étapes et des outils à utiliser
      - Flexible, capable de traiter des tâches ouvertes
      - Moins prévisible, plus coûteux, plus difficile à tester
      - "Ex. : corriger un bogue dans une base de code inconnue"
```

Les deux ne s'opposent pas : un agent peut être une étape d'un workflow, et un workflow peut être un outil d'un agent.

```video
url: https://www.youtube.com/watch?v=F8NKVhkZZWI
title: "What are AI Agents?"
channel: "IBM Technology"
duration: "12:28"
lang: en
why: "La différence entre un système composé de prompts fixes et un agent qui raisonne, agit et observe, expliquée simplement."
```

# La boucle agentique

Un agent est, au fond, une **boucle** autour d'un LLM qui dispose d'outils. Vous en avez déjà écrit une au module 4 : la boucle d'appels d'outils.

```diagram
type: flow
title: La boucle d'un agent
loop: Jusqu'à ce que la tâche soit terminée ou qu'une limite soit atteinte
steps:
  - title: Contexte
    text: Objectif, instructions, historique, résultats précédents
  - title: Décision
    text: "Le modèle choisit : répondre ou appeler un ou plusieurs outils"
  - title: Action
    text: L'application exécute les outils demandés
  - title: Observation
    text: Les résultats sont ajoutés au contexte
```

Ce schéma « raisonner, agir, observer » a été formalisé notamment par l'approche **ReAct** (Yao et al., 2022), qui alterne étapes de raisonnement et actions. Les modèles actuels, entraînés à l'appel d'outils et au raisonnement, suivent naturellement ce type de boucle.

## Les conditions d'arrêt

Un agent doit **toujours** avoir des limites :

- le modèle indique que la tâche est **terminée** (il répond sans demander d'outil) ;
- un **nombre maximal d'itérations** est atteint ;
- un **budget** (tokens, coût, durée) est épuisé ;
- une **erreur** non récupérable survient ;
- une action nécessite une **validation humaine**.

> [!WARNING]
> Sans limites, un agent peut tourner en rond (rappeler le même outil avec les mêmes arguments), accumuler des coûts importants, ou enchaîner des actions indésirables. Les garde-fous font partie de la conception, pas d'une optimisation ultérieure.

# Quand utiliser un agent ?

La recommandation la plus importante de ce module : **commencez par la solution la plus simple**. Un seul appel bien conçu, avec un bon prompt et du contexte pertinent, suffit pour une grande partie des cas. Si ce n'est pas suffisant, un workflow. Un agent seulement si la tâche l'exige.

```diagram
type: decision
title: Faut-il un agent ?
nodes:
  - question: Un seul appel au modèle, avec un bon prompt et le bon contexte, suffit-il ?
    yes: S'arrêter là, c'est la solution la plus fiable et la moins chère
    no: Envisager un workflow
  - question: Les étapes de la tâche sont-elles connues et stables ?
    yes: "Workflow : enchaînement défini dans le code"
    no: Un agent peut se justifier
  - question: Le gain vaut-il le coût et la latence supplémentaires, et les erreurs sont-elles détectables et réparables ?
    yes: Agent, avec garde-fous, limites et supervision
    no: Revoir le périmètre, ou garder un humain dans la boucle
```

Critères pour justifier un agent :

1. **Complexité** : la tâche comporte de nombreuses étapes difficiles à prévoir à l'avance.
2. **Valeur** : le résultat justifie un coût et une latence plus élevés.
3. **Faisabilité** : le modèle est réellement capable de réaliser ce type de tâche (à vérifier par l'évaluation).
4. **Coût de l'erreur** : les erreurs peuvent être détectées et corrigées (tests, relecture, annulation).

> [!TIP]
> Le développement logiciel est un domaine où les agents fonctionnent particulièrement bien : les tâches sont ouvertes, mais le résultat est **vérifiable** automatiquement (le code compile-t-il ? les tests passent-ils ?). Cherchez cette propriété dans vos propres cas d'usage : un agent dont le travail peut être vérifié est beaucoup plus fiable.

# Les frameworks d'agents

De nombreux frameworks facilitent la construction de workflows et d'agents : par exemple **LangGraph** (graphes d'états), les **SDK d'agents** de fournisseurs comme OpenAI (Agents SDK) ou Anthropic (Claude Agent SDK, qui fournit le moteur de Claude Code sous forme de bibliothèque), ou encore CrewAI et LlamaIndex. Les fournisseurs proposent aussi des agents hébergés, où la boucle et l'environnement d'exécution des outils sont gérés de leur côté.

Ils apportent des briques utiles (gestion d'état, reprise après erreur, visualisation, intégrations prêtes à l'emploi), mais aussi :

- des **couches d'abstraction** qui masquent les prompts et les appels réels, rendant le débogage plus difficile ;
- une tentation d'**ajouter de la complexité** inutile ;
- une **dépendance** supplémentaire, qui évolue vite.

La recommandation d'Anthropic, partagée par de nombreux praticiens : commencer par utiliser **directement l'API** (beaucoup de patterns s'implémentent en quelques dizaines de lignes) et, si l'on adopte un framework, **comprendre ce qu'il fait en dessous**. Le chapitre 3 de ce module compare trois approches sur un même agent, et le module 7 vous fait construire votre propre harness.

# Exercices

## Exercice 1 : Workflow ou agent ?

Pour chaque tâche, recommandez un appel unique, un workflow ou un agent :

1. Traduire des fiches produit en trois langues.
2. Analyser une demande de remboursement : extraire les informations, vérifier l'éligibilité selon une politique, rédiger une réponse.
3. Explorer une base de code inconnue pour trouver l'origine d'un bogue et proposer un correctif testé.

<details>
<summary>Voir la solution</summary>

1. **Appel unique** (par langue et par fiche) : tâche simple et bien définie.
2. **Workflow** : les trois étapes sont connues et stables ; on peut les enchaîner dans le code, avec une validation entre chaque.
3. **Agent** : le nombre et la nature des étapes (lire des fichiers, lancer des tests, chercher des références) ne sont pas connus à l'avance, et le résultat est vérifiable par les tests.

</details>

## Exercice 2 : Des garde-fous

Vous construisez un agent qui gère les rendez-vous d'un cabinet (consulter l'agenda, proposer des créneaux, réserver, annuler). Proposez au moins quatre garde-fous.

<details>
<summary>Voir la solution</summary>

- Nombre maximal d'itérations par demande (par exemple 10) et budget de tokens.
- **Confirmation explicite** de l'utilisateur avant toute réservation ou annulation.
- Outils limités à l'agenda du cabinet, avec les droits de l'utilisateur connecté (un patient ne voit pas les rendez-vous des autres).
- Validation des arguments (créneaux existants, dates futures, durées autorisées).
- Journalisation de chaque action, et possibilité d'annuler.
- Transfert à un humain en cas de demande hors périmètre ou d'échec répété.

</details>

## Exercice 3 : Analyse critique

Un collègue veut remplacer un workflow fiable en trois étapes (classification, extraction, réponse type) par un agent « plus intelligent ». Quelles questions lui posez-vous ?

<details>
<summary>Voir la solution</summary>

- Quel **problème** le workflow actuel ne résout-il pas ? Avons-nous des cas d'échec concrets ?
- L'agent fait-il **mieux** sur notre jeu d'évaluation ? Sur quels cas ?
- Quel est l'impact sur le **coût** par demande et la **latence** ?
- Comment allons-nous **tester** et **superviser** un comportement moins prévisible ?
- Une amélioration ciblée du workflow (une étape supplémentaire, un meilleur prompt) ne suffirait-elle pas ?

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Workflows et agents
center: "Le code décide des étapes (workflow) ou le modèle les décide (agent) : commencer simple."
points:
  - icon: list
    title: Workflow
    text: Chemins définis dans le code ; prévisible, testable, coût maîtrisé.
  - icon: compass
    title: Agent
    text: Le modèle choisit les étapes et les outils ; flexible mais moins prévisible.
  - icon: loop
    title: La boucle agentique
    text: "Contexte, décision, action, observation : inspirée de ReAct."
  - icon: shield
    title: Conditions d'arrêt
    text: Itérations maximales, budget, erreurs, validation humaine.
  - icon: test
    title: Résultat vérifiable
    text: Les agents brillent quand le résultat se vérifie, comme du code testé.
pitfall: Remplacer un workflow fiable par un agent « plus intelligent » sans évaluation ni gain démontré.
remember: "Appel unique, puis workflow, puis agent : seulement si la tâche l'exige vraiment."
```
