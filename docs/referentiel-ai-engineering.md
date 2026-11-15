# Référentiel AI Engineering — carte des écarts et plan de refonte

*Version 1 — 14 novembre 2026. Document de travail à valider avant l'écriture des chapitres.*

## Méthode

Le référentiel cible ci-dessous croise les sources qui font aujourd'hui référence pour le métier :
l'ouvrage *AI Engineering* (Chip Huyen), la roadmap « AI Engineer » de roadmap.sh, les guides
d'ingénierie d'agents et de contexte publiés par Anthropic et OpenAI, l'OWASP Top 10 pour les
applications LLM (2025) et les travaux OWASP sur les menaces agentiques, le NIST AI RMF et
l'AI Act européen.

Chaque compétence est comparée au contenu actuel (33 chapitres, ~31 h) :

- ✅ **couvert** : le sujet est traité avec assez de profondeur ;
- 🟡 **partiel** : mentionné ou traité en quelques paragraphes, insuffisant pour être opérationnel ;
- ❌ **absent**.

## 1. Carte des écarts

### A. Fondations logicielles

| Compétence | État | Où | Action |
|---|---|---|---|
| Python moderne, typage, Pydantic, async | ✅ | python-pour-ia | — |
| HTTP, API REST, FastAPI, secrets | ✅ | apis-http-fastapi | — |
| Git, pytest, tests de code non déterministe, logs | ✅ | outillage-professionnel | — |
| SQL et PostgreSQL de base | 🟡 | utilisé dans recherche-vectorielle sans introduction | Encadré « SQL minimal » dans recherche-vectorielle |
| Manipulation de données (NumPy, pandas) | 🟡 | quelques usages | Section dans python-pour-ia |
| Docker | ✅ | deploiement | — |

### B. Fondamentaux du machine learning

| Compétence | État | Où | Action |
|---|---|---|---|
| Apprentissage supervisé, validation, sur-apprentissage, métriques | ✅ | concepts-ml | — |
| Réseaux de neurones, gradient, PyTorch | ✅ | reseaux-neurones | — |
| Tokens, embeddings, similarité | ✅ | tokens-embeddings | — |
| Maths utiles (vecteurs, produit scalaire, softmax, probabilités) | 🟡 | dispersées | Encadré récapitulatif dans tokens-embeddings |

### C. IA générative et LLM

| Compétence | État | Où | Action |
|---|---|---|---|
| Transformers, attention, cache KV | ✅ | transformers-attention | — |
| Pré-entraînement, SFT, RLHF, DPO, IA constitutionnelle | ✅ | entrainement-llm | — |
| Modèles de raisonnement (réflexion étendue, effort, coût) | 🟡 | quelques paragraphes | Approfondir dans inference-limites |
| Échantillonnage, contexte, hallucinations | ✅ | inference-limites | — |
| Choisir un modèle, benchmarks, open-weight | ✅ | choisir-modele | — |
| Architectures récentes (MoE, contexte long) | 🟡 | — | Section dans transformers-attention |
| **Multimodal** : vision, documents, audio, voix, génération d'images | ❌ | — | **Nouveau chapitre** |

### D. Programmer avec les LLM

| Compétence | État | Où | Action |
|---|---|---|---|
| API, rôles, streaming, erreurs, consommation | ✅ | api-llm | — |
| Prompt engineering, few-shot, versionnage des prompts | ✅ | prompt-engineering | — |
| Sorties structurées, validation, repli | ✅ | sorties-structurees | — |
| Tool use, boucle d'exécution, conception d'outils | ✅ | tool-use | — |
| Couches d'abstraction multi-fournisseurs (LiteLLM, AI SDK…) | 🟡 | choisir-modele | Section dans api-llm |
| Gestion de l'historique d'une conversation longue | 🟡 | — | Traité dans le nouveau chapitre contexte |

### E. RAG

| Compétence | État | Où | Action |
|---|---|---|---|
| Principes, prompt RAG, prototype | ✅ | principes-rag | — |
| Extraction, découpage, métadonnées, contextual retrieval, ingestion incrémentale | ✅ | ingestion-chunking | — |
| Bases vectorielles, ANN, recherche hybride, reranking | ✅ | recherche-vectorielle | — |
| Réécriture de requêtes, HyDE, RAG agentique, évaluation | ✅ | rag-avance | — |
| **GraphRAG, graphes de connaissances** | ❌ | — | **Nouveau chapitre** |
| **Text-to-SQL, interroger des données structurées** | ❌ | — | (même chapitre) |
| RAG multimodal (tableaux, images, schémas) | 🟡 | une astuce | Traité dans le chapitre multimodal |

### F. IA agentique

| Compétence | État | Où | Action |
|---|---|---|---|
| Workflows vs agents, boucle agentique, conditions d'arrêt | ✅ | workflows-agents | — |
| Les 5 patterns (chaînage, routage, parallélisation, orchestrateur, évaluateur) | ✅ | patterns-agentiques | — |
| MCP : architecture, primitives, serveur, sécurité | ✅ | model-context-protocol | — |
| **Frameworks d'agents en pratique** (Claude Agent SDK, OpenAI Agents SDK, LangGraph) | 🟡 | une section | **Nouveau chapitre** pratique |
| **Systèmes multi-agents**, protocole A2A | 🟡 | une section | **Nouveau chapitre** |
| **Agents d'action** : navigateur, *computer use*, agents de code | ❌ | — | **Nouveau chapitre** |
| Planification, réflexion, auto-correction | 🟡 | patterns | Section dans le chapitre frameworks |
| Exécution durable, agents de longue durée, reprise | ❌ | — | Section dans le chapitre harness |
| Humain dans la boucle, garde-fous | ✅ | agents-fiables | Recentrer le chapitre là-dessus |

### G. Harness d'agent

| Compétence | État | Où | Action |
|---|---|---|---|
| **Qu'est-ce qu'un harness** : modèle + boucle + outils + contexte + permissions + environnement | ❌ | — | **Nouveau chapitre** |
| Permissions, approbations, sandbox d'exécution | ❌ | — | (même chapitre) |
| Compaction, sous-agents, skills, hooks, points de reprise | ❌ | — | (même chapitre) |
| **Construire un harness minimal de A à Z** | ❌ | — | **Nouveau chapitre-TP** |

### H. Contexte et mémoire

| Compétence | État | Où | Action |
|---|---|---|---|
| **Ingénierie du contexte** : budget, *context rot*, récupération juste-à-temps, compaction, notes structurées | 🟡 | une section de agents-fiables | **Nouveau chapitre** |
| **Mémoire des agents** : mémoire de travail, épisodique, sémantique, procédurale | 🟡 | ~10 lignes dans agents-fiables | **Nouveau chapitre** |
| Écrire, retrouver, consolider, corriger et oublier | 🟡 | une liste à puces | (même chapitre) |
| Stockage (vecteurs, clé-valeur, fichiers, outil mémoire), isolation, RGPD | 🟡 | une liste à puces | (même chapitre) |
| Évaluer une mémoire | ❌ | — | (même chapitre) |

### I. Évaluation et observabilité

| Compétence | État | Où | Action |
|---|---|---|---|
| Jeux d'évaluation, notation, analyse d'erreurs, bruit statistique | ✅ | fondamentaux-evals | — |
| LLM juge, biais, validation (kappa) | ✅ | llm-juge | — |
| Traces, métriques, alertes, dérive, confidentialité | ✅ | observabilite | — |
| **Évaluer un agent** : trajectoires, appels d'outils, pass@k / pass^k, environnements | 🟡 | une section | **Nouveau chapitre** |
| Évaluations en CI (portes de régression), tests A/B, métriques produit | 🟡 | brièvement | (même chapitre) |
| Conventions OpenTelemetry GenAI | 🟡 | mention | Section dans observabilite |

### J. Sécurité de l'IA

| Compétence | État | Où | Action |
|---|---|---|---|
| OWASP LLM Top 10, injection directe et indirecte, défense en profondeur | ✅ | securite-llm | — |
| Fuite du prompt système, RAG et droits d'accès, données personnelles | ✅ | securite-llm | — |
| **Sécurité des agents** : agentivité excessive, empoisonnement d'outils MCP, *lethal trifecta*, exfiltration, sandbox | 🟡 | quelques mentions | **Nouveau chapitre** |
| **Jailbreaks, red teaming**, outils d'attaque automatisée | ❌ | 0 mention | **Nouveau chapitre** |
| Garde-fous dédiés (classifieurs, modèles de modération) | 🟡 | mentions | (même chapitre) |
| Supply chain des modèles (pickle vs safetensors, empoisonnement, provenance) | ❌ | — | (même chapitre) |

### K. Gouvernance et IA responsable

| Compétence | État | Où | Action |
|---|---|---|---|
| **AI Act** : niveaux de risque, obligations, calendrier | 🟡 | 2 mentions | **Nouveau chapitre** |
| RGPD appliqué à l'IA, droit d'auteur, licences de modèles | 🟡 | dispersé | (même chapitre) |
| Biais, équité, transparence, documentation (model cards) | ❌ | — | (même chapitre) |
| Cadres (NIST AI RMF, ISO/IEC 42001) | ❌ | — | (même chapitre) |

### L. Production et LLMOps

| Compétence | État | Où | Action |
|---|---|---|---|
| Architecture, streaming, Docker, async, quotas | ✅ | deploiement | — |
| Coûts, cache de prompts, batch, routage | ✅ | couts-performance | — |
| Modèles locaux, quantification, Ollama, vLLM | ✅ | modeles-locaux | — |
| Passerelle IA, repli multi-fournisseurs, déploiement progressif | 🟡 | — | Section dans deploiement |

### M. Personnalisation des modèles

| Compétence | État | Où | Action |
|---|---|---|---|
| Quand fine-tuner, préparer les données | ✅ | quand-fine-tuner | — |
| LoRA, QLoRA, TRL/PEFT | ✅ | lora-qlora | — |
| **Données synthétiques, distillation**, DPO en pratique | ❌ / 🟡 | 1 mention | **Nouveau chapitre** |

### N. Produit et UX de l'IA

| Compétence | État | Où | Action |
|---|---|---|---|
| Concevoir l'expérience d'un système non déterministe (attentes, citations, retours, reprise) | 🟡 | projet final | Section dans metier-ai-engineer |

### O. Pratique

| Compétence | État | Où | Action |
|---|---|---|---|
| Projets intermédiaires validés par critères | ❌ | un seul projet, à la fin | **2 projets intermédiaires** + projet final enrichi |

### Bilan

| | Nombre |
|---|---|
| Compétences couvertes ✅ | 33 |
| Partielles 🟡 | 24 |
| Absentes ❌ | 16 |

Les manques sont concentrés là où le métier a le plus évolué : **harness, contexte et mémoire,
agents d'action, sécurité des agents, multimodal, gouvernance**.

## 2. Nouvelle structure proposée

En **gras** : les nouveaux chapitres (16, dont 2 projets intermédiaires). Les chapitres existants sont conservés et enrichis
selon la colonne « Action » ci-dessus.

| # | Module | Chapitres |
|---|---|---|
| 1 | Fondations de l'AI Engineer | metier-ai-engineer, python-pour-ia, apis-http-fastapi, outillage-professionnel |
| 2 | Fondamentaux du ML | concepts-ml, reseaux-neurones, tokens-embeddings |
| 3 | Comprendre les LLM | transformers-attention, entrainement-llm, inference-limites, choisir-modele, **modeles-multimodaux** |
| 4 | Programmer avec les LLM | api-llm, prompt-engineering, sorties-structurees, tool-use, **projet-1-assistant-structure** |
| 5 | RAG | principes-rag, ingestion-chunking, recherche-vectorielle, rag-avance, **graphes-donnees-structurees**, **projet-2-rag** |
| 6 | Workflows et agents | workflows-agents, patterns-agentiques, **frameworks-agents**, model-context-protocol, **multi-agents**, **agents-action** (navigateur, computer use, code) |
| 7 | **Harness, contexte et mémoire** *(nouveau)* | **anatomie-harness**, **ingenierie-contexte**, **memoire-agents**, **construire-harness** (TP), agents-fiables (recentré garde-fous et humain dans la boucle) |
| 8 | Évaluation et observabilité | fondamentaux-evals, llm-juge, **evaluer-agents**, observabilite |
| 9 | **Sécurité et IA responsable** *(nouveau)* | securite-llm (déplacé), **securite-agents**, **red-teaming-garde-fous**, **gouvernance-ia-responsable** |
| 10 | Production et coûts | deploiement, couts-performance, modeles-locaux |
| 11 | Personnalisation et projet final | quand-fine-tuner, lora-qlora, **donnees-synthetiques-distillation**, projet-final (enrichi : agent + mémoire + évaluation d'agent) |

Volume estimé : **49 chapitres, ~50 h** (contre 33 chapitres, ~31 h).

## 3. Ancrer les connaissances (rétention)

### Dans le contenu (aucune modification de l'application)

1. **Quiz réécrits** selon une grille commune :
   - au moins 50 % de **mises en situation** (« Votre agent fait X… que faites-vous ? ») ;
   - des distracteurs **plausibles** : erreurs typiques de débutant, jamais de réponses absurdes ;
   - des explications qui justifient la bonne réponse **et** réfutent les mauvaises ;
   - des questions qui mobilisent les **chapitres précédents** (rappel espacé intégré au contenu).
2. Une section **« Testez-vous avant de lire »** au début de chaque chapitre (2–3 questions
   ouvertes) et **« Points de vigilance »** à la fin.
3. **Exercices progressifs** : compréhension → application → conception, avec au moins un
   exercice de code par chapitre technique.
4. **Projets intermédiaires** avec grille de critères objectifs.

### Dans l'application (à décider)

5. **Banque de questions** (20+ par chapitre) et tirage aléatoire de 10 à chaque tentative.
6. **Examen de fin de module**, cumulatif.
7. **Révisions espacées** (J+1, J+7, J+30) sur les questions déjà rencontrées ou ratées.
8. **Examen final** du parcours, conditionnant le certificat.

## 4. Ordre de réalisation proposé

1. Module 7 (harness, contexte, mémoire) — le plus gros écart.
2. Module 9 (sécurité et IA responsable).
3. Module 6 (agents : frameworks, multi-agents, agents d'action) et évaluation des agents.
4. Multimodal, GraphRAG/text-to-SQL, données synthétiques.
5. Enrichissement des chapitres existants.
6. Réécriture des 49 quiz et ajout des projets intermédiaires.
7. Fonctionnalités de rétention dans l'application (si retenues).
