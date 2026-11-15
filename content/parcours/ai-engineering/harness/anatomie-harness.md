---
title: Anatomie d'un harness d'agent
description: Comprendre tout ce qui entoure le modèle dans un agent (boucle, outils, contexte, permissions, environnement, hooks, sous-agents et skills) et pourquoi la qualité d'un agent dépend autant du harness que du modèle.
duration: 60
objectives:
  - Définir un harness d'agent et en nommer les composants
  - Expliquer comment un harness transforme un LLM en agent capable d'agir
  - Concevoir un système de permissions et un environnement d'exécution isolé
  - Utiliser hooks, sous-agents et skills pour étendre un agent sans saturer son contexte
  - Comparer les harness existants et savoir quand en construire un
---

# Le modèle n'est pas l'agent

Au module 6, vous avez écrit une boucle agentique : le modèle choisit un outil, le code l'exécute, le résultat repart vers le modèle, et ainsi de suite. Cette boucle de vingt lignes fonctionne pour une démonstration. Mais un agent qui travaille réellement (qui corrige du code pendant une heure, gère des dossiers clients ou fait de la recherche) a besoin de beaucoup plus : gérer un contexte qui déborde, demander une autorisation avant de supprimer un fichier, s'exécuter dans un environnement sûr, reprendre après une panne, déléguer une sous-tâche…

On appelle **harness** (littéralement « harnais ») **l'ensemble du logiciel qui entoure le modèle** et le transforme en agent : la boucle, les outils, la construction du contexte, les permissions, l'environnement d'exécution, la persistance et les points d'extension.

> [!IMPORTANT]
> Un même modèle peut donner un agent médiocre ou excellent selon son harness. Sur les tâches de programmation, il est courant que deux agents utilisant **exactement le même modèle** obtiennent des résultats très différents sur un benchmark : la différence vient des outils proposés, du prompt système, de la gestion du contexte et des boucles de vérification. **Concevoir le harness est le cœur du travail de l'AI Engineer qui construit des agents.**

Des exemples de harness que vous avez peut-être déjà utilisés :

| Harness | Usage | Particularité |
|---|---|---|
| Claude Code, Codex CLI, Gemini CLI | Agents de programmation en terminal | Outils fichiers et shell, permissions, sous-agents, hooks |
| Cursor, Windsurf, GitHub Copilot (mode agent) | Agents intégrés à l'éditeur | Contexte tiré de l'éditeur, validation des modifications par l'utilisateur |
| Claude Agent SDK, OpenAI Agents SDK | Bibliothèques pour construire **vos** agents | Le harness d'un produit, réutilisable avec vos outils |
| LangGraph, Pydantic AI, smolagents | Frameworks d'agents | Vous assemblez vous-même les briques |

# Les composants d'un harness

```diagram
type: layers
title: Les couches d'un harness d'agent
layers:
  - title: Interface
    text: Terminal, application web, API, déclencheur automatique (ticket, courriel, cron)
  - title: Boucle d'orchestration
    text: Appel du modèle, exécution des outils, conditions d'arrêt, reprise sur erreur
    items: [Limites d'itérations et de budget, Streaming, Interruption par l'utilisateur]
  - title: Gestion du contexte
    text: Prompt système, instructions du projet, historique, compaction, mémoire
  - title: Outils et extensions
    text: Outils natifs, serveurs MCP, sous-agents, skills, hooks
  - title: Contrôle et sécurité
    text: Permissions, validation humaine, journal d'audit
  - title: Environnement d'exécution
    text: Système de fichiers, shell, sandbox, réseau, points de reprise
```

Passons-les en revue.

## 1. La boucle d'orchestration

C'est le moteur : appeler le modèle, exécuter les outils demandés (éventuellement **en parallèle** quand le modèle en demande plusieurs), renvoyer les résultats, recommencer. Un harness robuste y ajoute :

- des **conditions d'arrêt** : fin naturelle (le modèle ne demande plus d'outil), nombre maximal d'itérations, budget de tokens ou de dollars, durée maximale ;
- la gestion des **erreurs** : erreur réseau du fournisseur (nouvelle tentative avec délai croissant), erreur d'outil (renvoyée au modèle comme résultat, pour qu'il corrige), limite de contexte atteinte (compaction, chapitre suivant) ;
- l'**interruption** : l'utilisateur doit pouvoir arrêter l'agent à tout moment, ou lui envoyer un message en cours de route ;
- le **streaming** des étapes, pour que l'utilisateur voie ce que fait l'agent.

## 2. La construction du contexte

À chaque tour, le harness **assemble** ce que voit le modèle :

1. le **prompt système** du harness (rôle, style, règles d'utilisation des outils) ;
2. les **instructions du projet ou de l'utilisateur**, souvent lues dans un fichier (par exemple `CLAUDE.md` ou `AGENTS.md` à la racine d'un dépôt) ;
3. la **description des outils** disponibles ;
4. l'**historique** de la session, éventuellement compacté ;
5. des éléments de **mémoire** ou d'**état** (fichier de progression, plan en cours).

C'est l'objet de l'**ingénierie du contexte**, traitée au chapitre suivant.

## 3. Les outils

Les outils sont les « mains » de l'agent. Un harness généraliste propose typiquement :

| Famille | Exemples | Remarque |
|---|---|---|
| Fichiers | lire, écrire, modifier par remplacement ciblé, rechercher (glob, grep) | Une modification ciblée coûte bien moins de tokens qu'une réécriture complète |
| Exécution | lancer une commande shell, exécuter du code | L'outil le plus puissant… et le plus dangereux |
| Web | rechercher, lire une page | Source majeure d'**injection de prompt indirecte** |
| Organisation | liste de tâches, plan | Aide le modèle à rester sur sa trajectoire dans les longues tâches |
| Délégation | lancer un sous-agent | Voir plus bas |
| Métier | via MCP ou des outils propres | CRM, base de données, ticketing… |

> [!TIP]
> Un bon harness propose **peu d'outils, bien conçus et complémentaires**, plutôt qu'une centaine d'outils redondants. Chaque définition d'outil consomme du contexte, et un modèle hésite davantage quand plusieurs outils se ressemblent.

## 4. Permissions et validation humaine

Le harness décide, pour chaque appel d'outil, s'il est **autorisé d'office**, **soumis à validation**, ou **interdit**. Une politique de permissions typique :

| Niveau | Exemples d'actions | Comportement |
|---|---|---|
| Lecture seule | Lire un fichier du projet, rechercher | Autorisé d'office |
| Modification locale réversible | Modifier un fichier suivi par Git | Autorisé ou validé selon le mode choisi |
| Effet externe ou irréversible | `git push`, envoyer un courriel, payer, supprimer, déployer | Toujours soumis à validation |
| Hors périmètre | Lire `~/.ssh`, écrire hors du dossier du projet | Interdit |

Les harness proposent souvent plusieurs **modes** : tout valider, valider seulement les commandes, ou mode autonome dans une sandbox. Les règles s'expriment généralement par listes d'autorisation et d'interdiction, par exemple :

```json
{
  "permissions": {
    "allow": ["Read", "Bash(npm test)", "Bash(git status)", "Bash(git diff:*)"],
    "ask":   ["Edit", "Bash(git commit:*)"],
    "deny":  ["Read(./.env)", "Bash(rm -rf:*)", "Bash(curl:*)"]
  }
}
```

> [!WARNING]
> Une liste d'interdiction fondée sur des motifs de commandes est **contournable** : `rm -rf` peut s'écrire autrement, et un script Python peut faire la même chose. Les permissions sont une **première barrière**, pas une garantie. La garantie vient de l'**isolation** de l'environnement.

## 5. L'environnement d'exécution et la sandbox

Dès qu'un agent exécute du code ou des commandes, il faut décider **où**. Les options, de la moins à la plus isolée :

```diagram
type: compare
title: Où exécuter les actions d'un agent ?
columns:
  - title: Machine de l'utilisateur
    tone: amber
    items:
      - Accès direct aux fichiers et outils
      - Rapide et pratique
      - Risque maximal en cas d'erreur ou d'injection
      - Exige des permissions strictes
  - title: Sandbox locale
    tone: blue
    items:
      - Restriction du système de fichiers et du réseau au niveau du système
      - L'agent peut travailler en autonomie dans le projet
      - Bon compromis pour un agent de code
  - title: Conteneur ou micro-VM distante
    tone: teal
    items:
      - Environnement jetable, isolé de vos données
      - Idéal pour exécuter du code non fiable
      - Ressources et durée limitées, accès réseau contrôlé
```

Les bonnes pratiques d'une sandbox :

- **système de fichiers** limité au répertoire de travail ;
- **réseau** coupé par défaut, ou limité à une liste de domaines autorisés (registre de paquets, API de l'entreprise), c'est ce qui empêche l'exfiltration de données ;
- **ressources** limitées (CPU, mémoire, durée) ;
- **aucun secret** de production dans l'environnement ;
- environnement **jetable** : on le recrée plutôt que de le réparer.

## 6. Les points de reprise

Un agent se trompe. Le harness doit permettre de **revenir en arrière** : sauvegarde des fichiers avant modification, commits Git réguliers, instantanés de l'environnement. Il doit aussi permettre de **reprendre une session** interrompue : l'historique et l'état sont persistés (fichier, base de données) plutôt que gardés en mémoire du processus.

# Étendre un agent sans le surcharger

## Les hooks

Un **hook** est un script que le harness exécute **automatiquement** à un moment précis du cycle de l'agent. Contrairement à une instruction dans le prompt, que le modèle peut oublier ou ignorer, un hook s'exécute **toujours** : c'est du code, pas une consigne.

| Moment | Exemple d'usage |
|---|---|
| Avant un appel d'outil | Bloquer l'écriture dans un fichier protégé, refuser une commande dangereuse |
| Après un appel d'outil | Formater automatiquement le fichier modifié, lancer le linter |
| À la soumission d'un message | Ajouter au contexte la date, la branche Git, le ticket en cours |
| À la fin de la tâche | Lancer les tests ; si échec, renvoyer l'agent au travail |
| À la fin de session | Notifier l'équipe, archiver la trace |

```python
# Hook « avant appel d'outil » : reçoit la demande en JSON sur l'entrée standard.
# Code de sortie 0 = autoriser ; code 2 = bloquer (le message d'erreur est renvoyé au modèle).
import json
import sys

demande = json.load(sys.stdin)
chemin = demande.get("tool_input", {}).get("file_path", "")

if demande.get("tool_name") in {"Edit", "Write"} and chemin.endswith((".env", ".pem")):
    print(f"Modification interdite : {chemin} contient des secrets.", file=sys.stderr)
    sys.exit(2)
sys.exit(0)
```

> [!TIP]
> Règle pratique : ce qui **doit toujours** se produire (formatage, tests, interdictions) va dans un **hook** ; ce qui relève du **jugement** (style, architecture, priorités) va dans les **instructions**.

## Les sous-agents

Un **sous-agent** est un agent lancé par l'agent principal pour une sous-tâche, avec **son propre contexte**, ses propres instructions et souvent un jeu d'outils restreint. Il travaille, puis ne renvoie qu'un **résumé**.

L'intérêt principal est de **protéger le contexte** de l'agent principal : explorer 200 fichiers pour trouver où est gérée l'authentification remplirait son contexte ; un sous-agent fait cette exploration et rend trois lignes. Autres intérêts : **parallélisme** (plusieurs sous-agents en même temps) et **spécialisation** (un sous-agent « relecteur de sécurité » avec ses propres consignes et un accès en lecture seule).

Le revers : un sous-agent ne voit pas ce que sait l'agent principal. La **consigne de délégation** doit être complète : objectif, contexte nécessaire, format attendu du compte rendu.

## Les skills

Une **skill** (compétence) est un **dossier d'instructions, de scripts et de ressources** que l'agent peut charger quand il en a besoin : « comment créer un fichier Excel avec nos conventions », « procédure de déploiement de l'équipe », « grille de revue de code »…

Le mécanisme clé est la **divulgation progressive** (*progressive disclosure*) :

```diagram
type: flow
title: Chargement progressif d'une skill
steps:
  - title: Au démarrage
    text: Seuls le nom et une description d'une ligne de chaque skill sont dans le contexte
  - title: Tâche pertinente
    text: Le modèle reconnaît qu'une skill s'applique et lit son fichier principal
  - title: Si nécessaire
    text: Il lit les fichiers annexes ou exécute les scripts fournis
    tone: teal
```

On peut ainsi mettre à disposition des dizaines de skills pour un coût de contexte minime. Une skill typique :

```text
rapport-mensuel/
├── SKILL.md          # nom, description, puis procédure détaillée
├── modele.md         # gabarit du rapport
└── scripts/
    └── extraire_kpi.py
```

```markdown
---
name: rapport-mensuel
description: Produire le rapport mensuel d'activité au format de l'équipe. À utiliser quand on demande un rapport, un bilan ou des KPI mensuels.
---

# Rapport mensuel

1. Exécuter `scripts/extraire_kpi.py --mois AAAA-MM` pour obtenir les indicateurs.
2. Remplir `modele.md` ; ne jamais inventer un chiffre absent de l'extraction.
3. ...
```

> [!NOTE]
> MCP, skills, sous-agents et hooks sont complémentaires. **MCP** connecte l'agent à des systèmes externes (des outils et des données) ; une **skill** lui apprend une **procédure** ; un **sous-agent** isole une sous-tâche ; un **hook** impose un comportement déterministe.

# Agents de longue durée

Certaines tâches dépassent largement une fenêtre de contexte : développer une application complète, migrer une base de code, mener une recherche sur plusieurs jours. Le harness doit alors organiser le travail **sur plusieurs sessions**, chacune démarrant avec un contexte neuf.

Les retours d'expérience publiés (notamment par Anthropic fin 2025 sur les agents de programmation de longue durée) convergent vers quelques principes :

1. **Une session d'initialisation** qui prépare le terrain : liste détaillée des fonctionnalités à réaliser (dans un fichier structuré), script de démarrage de l'environnement, premier commit.
2. **Des sessions de travail incrémentales** : chacune lit l'état (fichier de progression, historique Git), choisit **une** tâche, la termine, la **vérifie** (tests, essai réel), puis met à jour la progression et fait un commit.
3. **Un état externe lisible** : le fichier de progression et l'historique Git sont la mémoire du projet, pas le contexte du modèle.
4. **Une vérification de bout en bout** avant de déclarer une tâche terminée : l'échec typique d'un agent est de déclarer victoire trop tôt.

```diagram
type: flow
title: Un agent de longue durée, session après session
loop: Recommencer jusqu'à ce que toutes les tâches soient validées
steps:
  - title: Lire l'état
    text: Fichier de progression, git log, tâches restantes
  - title: Vérifier la base
    text: Lancer l'application et les tests existants
  - title: Une tâche
    text: Implémenter une seule fonctionnalité
  - title: Valider
    text: Tests et essai de bout en bout
    tone: teal
  - title: Consigner
    text: Mettre à jour la progression, commit Git
```

Pour l'exécution d'agents en production sur de longues durées (processus métier qui attendent une validation humaine pendant deux jours, par exemple), on s'appuie aussi sur des moteurs d'**exécution durable** (Temporal, Inngest, ou la persistance de LangGraph) : chaque étape est enregistrée, et le travail reprend exactement là où il s'était arrêté après un redémarrage.

# Construire ou réutiliser ?

| Situation | Recommandation |
|---|---|
| Agent de programmation ou d'automatisation sur un poste de travail | Utiliser un harness existant, le configurer (instructions, permissions, hooks, skills, MCP) |
| Agent intégré à votre produit, avec des outils proches de ceux d'un agent de code (fichiers, shell, web) | Partir d'un SDK d'agent (Claude Agent SDK, OpenAI Agents SDK) |
| Workflow métier aux étapes bien définies | Un workflow explicite (module 6) ou un framework orienté graphe (LangGraph) |
| Contraintes spécifiques fortes (latence, modèle local, sécurité, contrôle total) | Construire votre propre harness, minimal, c'est l'objet du chapitre-TP de ce module |

> [!TIP]
> Même si vous utilisez un harness existant, construisez-en un petit vous-même une fois. Vous comprendrez ce que vous configurez, et vous saurez diagnostiquer un agent qui se comporte mal.

# Exercices

## Exercice 1 : Classer les composants

Pour chacun des besoins suivants, indiquez quel mécanisme du harness est le plus adapté (instruction, outil, permission, sandbox, hook, sous-agent, skill, MCP) :

1. Garantir que chaque fichier Python modifié est formaté avec `ruff format`.
2. Permettre à l'agent de consulter les tickets Jira de l'équipe.
3. Expliquer à l'agent la procédure de mise en production de l'équipe, longue de 4 pages, utile une fois par semaine.
4. Empêcher l'agent d'envoyer des données vers un site inconnu, même en cas d'injection de prompt.
5. Rechercher dans 3 000 fichiers où est calculée la TVA, sans saturer le contexte.
6. Exiger un accord humain avant tout `git push`.

<details>
<summary>Voir la solution</summary>

1. **Hook** après modification de fichier : c'est une action qui doit **toujours** avoir lieu, on ne la confie pas au jugement du modèle.
2. **MCP** (serveur Jira) ou un outil métier dédié.
3. **Skill** : seule sa description est chargée en permanence, la procédure complète n'est lue que lorsqu'elle sert.
4. **Sandbox** avec réseau limité à une liste de domaines autorisés. Une permission sur `curl` ne suffit pas : l'exfiltration peut passer par un autre programme.
5. **Sous-agent** d'exploration, qui renvoie un résumé (fichiers et fonctions concernés).
6. **Permission** de type « demander » sur la commande, éventuellement doublée d'un hook de blocage.

</details>

## Exercice 2 : Une politique de permissions

Vous configurez un agent de programmation pour une équipe. Le projet contient un fichier `.env` avec des secrets, un dossier `migrations/` sensible, et l'équipe déploie avec `make deploy`. Rédigez une politique (autoriser / demander / interdire) et expliquez ce qu'elle ne garantit pas.

<details>
<summary>Voir une proposition de solution</summary>

- **Autoriser** : lecture des fichiers du projet (sauf secrets), recherche, `pytest`, `git status`, `git diff`, `git log`.
- **Demander** : modification de fichiers, `git commit`, installation de dépendances, toute modification dans `migrations/`.
- **Interdire** : lecture et écriture de `.env` et des fichiers de clés, `make deploy`, `git push --force`, accès hors du dossier du projet.

Ce qu'elle ne garantit pas : un motif de commande est contournable (un script Python peut lire `.env`, une commande peut être obfusquée). Pour une vraie garantie : ne pas mettre de secrets de production sur le poste de développement, exécuter l'agent dans une **sandbox** (système de fichiers et réseau restreints), et faire du déploiement une étape d'un pipeline CI protégé.

</details>

## Exercice 3 : Un agent qui déclare victoire trop tôt

Votre agent de longue durée doit implémenter 40 fonctionnalités d'une application web. Après quelques sessions, il annonce « Application terminée » alors que la moitié des fonctionnalités ne marchent pas. Proposez trois modifications du harness.

<details>
<summary>Voir la solution</summary>

1. Une **liste de fonctionnalités structurée** (par exemple un fichier JSON avec un statut `passe: false` par fonctionnalité), créée à l'initialisation ; l'agent n'a le droit de passer un statut à `true` qu'après vérification, et pas de supprimer ou réécrire les entrées.
2. Une **vérification de bout en bout obligatoire** : un outil de test du navigateur ou une suite de tests exécutée par un **hook de fin de tâche**, qui renvoie l'agent au travail si elle échoue.
3. Une règle de travail **incrémental** : une fonctionnalité par session, puis mise à jour du fichier de progression et commit, ce qui rend l'état réel visible et réversible.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Anatomie d'un harness
center: Le harness transforme un modèle en agent, et pèse autant que le modèle dans la qualité finale.
points:
  - icon: loop
    title: Boucle robuste
    text: Arrêts, budgets, reprise sur erreur, interruption et streaming des étapes.
  - icon: lock
    title: Permissions + sandbox
    text: Autoriser, demander ou interdire ; la vraie garantie vient de l'isolation.
  - icon: zap
    title: Hooks
    text: Ce qui doit toujours arriver est du code exécuté par le harness, pas une consigne.
  - icon: users
    title: Sous-agents
    text: Isolent une sous-tâche coûteuse dans leur propre contexte et rendent un résumé.
  - icon: book
    title: Skills
    text: Procédures chargées à la demande grâce à la divulgation progressive.
  - icon: git
    title: Longue durée
    text: État externe (progression, Git), une tâche par session, vérification de bout en bout.
pitfall: Croire qu'une liste d'interdiction de commandes suffit à sécuriser un agent qui exécute du code.
remember: "Même modèle, harness différent, résultats différents : concevez le harness avec autant de soin que le prompt."
```
