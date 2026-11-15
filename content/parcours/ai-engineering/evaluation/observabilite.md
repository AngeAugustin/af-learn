---
title: Observabilité et supervision en production
description: Tracer chaque requête, suivre les métriques techniques et de qualité, collecter les retours et boucler avec les évaluations.
duration: 50
objectives:
  - Expliquer la notion de trace et de span pour une application d'IA
  - Choisir les métriques techniques et de qualité à surveiller
  - Collecter et exploiter les retours utilisateurs
  - Mettre en place des évaluations en ligne et des alertes
---

# Pourquoi l'observabilité est différente pour l'IA

Dans une application classique, une requête réussie (code 200, temps de réponse correct) est généralement une bonne requête. Avec un LLM, une requête peut être **techniquement parfaite et fonctionnellement mauvaise** : réponse fausse, hors sujet, ton inapproprié. L'observabilité d'une application d'IA doit donc couvrir **deux dimensions** :

- la **santé technique** : erreurs, latence, consommation, coûts ;
- la **qualité** des réponses : exactitude, fidélité, satisfaction des utilisateurs.

Elle sert aussi à **comprendre** le comportement d'un système complexe (RAG, agents) : quelles sources ont été récupérées, quels outils ont été appelés, dans quel ordre, avec quels résultats.

# Traces et spans

Une **trace** représente le traitement complet d'une requête. Elle est composée de **spans** : des étapes chronométrées, imbriquées, avec leurs entrées, sorties et métadonnées.

```diagram
type: custom
name: trace-timeline
caption: Trace d'une requête de RAG agentique. Chaque barre est un span ; la longueur représente la durée. On voit immédiatement que la génération finale domine la latence.
```

Pour chaque appel au modèle, on enregistre typiquement :

- le **modèle**, la **version du prompt** et les paramètres ;
- les **entrées** et **sorties** (selon la politique de confidentialité) ;
- les **tokens** d'entrée, de sortie et mis en cache ;
- la **latence** (dont le délai avant le premier token) ;
- la **raison d'arrêt** et les éventuelles erreurs.

## Les outils

- Des plateformes spécialisées dans les applications de LLM, comme **Langfuse** ou **Arize Phoenix** (open source, auto-hébergeables), **LangSmith**, **Braintrust** ou **Helicone**, offrent traces, tableaux de bord, gestion des jeux d'évaluation et évaluations en ligne.
- **OpenTelemetry**, le standard ouvert d'observabilité, définit des **conventions sémantiques pour l'IA générative** (noms d'attributs pour le modèle, les tokens…), ce qui permet d'envoyer ces traces vers les outils d'observabilité existants de l'entreprise.

Un traçage minimal fait maison permet de bien comprendre le principe :

```python
import json
import logging
import time
import uuid
from contextlib import contextmanager

logger = logging.getLogger("traces")


@contextmanager
def span(nom: str, trace_id: str, **attributs):
    debut = time.perf_counter()
    infos = {"trace_id": trace_id, "span": nom, **attributs}
    try:
        yield infos  # le code appelant peut ajouter des informations (tokens, résultat…)
        infos["statut"] = "ok"
    except Exception as erreur:
        infos["statut"] = "erreur"
        infos["erreur"] = repr(erreur)
        raise
    finally:
        infos["duree_ms"] = round((time.perf_counter() - debut) * 1000)
        logger.info(json.dumps(infos, ensure_ascii=False))


def repondre(question: str) -> str:
    trace_id = str(uuid.uuid4())
    with span("recherche", trace_id) as s:
        passages = rechercher(question)
        s["nb_passages"] = len(passages)
    with span("generation", trace_id, modele="claude-opus-5-5", version_prompt="rag-v3") as s:
        reponse = generer(question, passages)  # renvoie la réponse complète de l'API
        s["tokens_entree"] = reponse.usage.input_tokens
        s["tokens_sortie"] = reponse.usage.output_tokens
        s["stop_reason"] = reponse.stop_reason
    return "".join(b.text for b in reponse.content if b.type == "text")
```

*(Les fonctions `rechercher` et `generer` sont celles de votre pipeline.)*

## Passer à OpenTelemetry

En production, plutôt qu'un format maison, on instrumente avec **OpenTelemetry** : les traces partent alors vers n'importe quel outil compatible (Langfuse, Phoenix, Datadog, Grafana Tempo…) sans changer le code. Le même traçage s'écrit ainsi :

```python
# pip install opentelemetry-sdk opentelemetry-exporter-otlp
from opentelemetry import trace

tracer = trace.get_tracer("assistant-documentaire")


def repondre(question: str) -> str:
    with tracer.start_as_current_span("repondre") as racine:
        racine.set_attribute("app.version_prompt", "rag-v3")
        with tracer.start_as_current_span("recherche") as s:
            passages = rechercher(question)
            s.set_attribute("app.nb_passages", len(passages))
        with tracer.start_as_current_span("chat claude-opus-5-5") as s:
            reponse = generer(question, passages)
            # Attributs des conventions sémantiques GenAI
            s.set_attribute("gen_ai.request.model", "claude-opus-5-5")
            s.set_attribute("gen_ai.usage.input_tokens", reponse.usage.input_tokens)
            s.set_attribute("gen_ai.usage.output_tokens", reponse.usage.output_tokens)
            s.set_attribute("gen_ai.response.finish_reasons", [reponse.stop_reason])
        return "".join(b.text for b in reponse.content if b.type == "text")
```

Les spans imbriqués partagent automatiquement le même identifiant de trace, et ce contexte se **propage** entre services (API, worker, serveur MCP) via les en-têtes HTTP. Des bibliothèques d'**auto-instrumentation** (par exemple OpenLLMetry ou OpenInference) ajoutent ces attributs automatiquement autour des SDK des fournisseurs.

> [!NOTE]
> Les conventions sémantiques GenAI d'OpenTelemetry (attributs `gen_ai.*`) sont encore marquées « en développement » et évoluent : vérifiez les noms exacts dans la documentation officielle au moment de l'implémentation.

# Les métriques à surveiller

## Santé technique

| Métrique | Pourquoi |
|---|---|
| Taux d'erreur (par type : 429, 5xx, délais dépassés) | Détecter les pannes et les limites de débit |
| Latence p50 / p95 / p99 et délai avant le premier token | L'expérience utilisateur dépend surtout des cas lents |
| Tokens et coût par requête, par fonctionnalité, par client | Maîtriser le budget, détecter les abus |
| Taux de réponses tronquées (`max_tokens`) et de refus | Signes de prompts ou de limites mal réglés |
| Taux de réussite du cache de prompt | Vérifier que l'optimisation fonctionne (module 10) |

> [!TIP]
> Suivez la latence en **percentiles**, pas en moyenne : une moyenne de 3 secondes peut cacher 5 % de requêtes à 30 secondes, qui sont celles dont les utilisateurs se souviennent.

## Qualité

- **Retours explicites** : pouces haut/bas, notes, commentaires. Précieux mais rares et biaisés (on signale surtout ce qui ne va pas).
- **Signaux implicites** : l'utilisateur reformule sa question, copie la réponse, corrige le texte généré, abandonne la conversation, demande à parler à un humain.
- **Évaluations en ligne** : un LLM juge (validé, voir le chapitre 2 de ce module) note automatiquement un **échantillon** du trafic sur des critères comme la fidélité ou le respect des consignes.
- **Métriques métier** : taux de tickets résolus sans intervention humaine, taux d'acceptation des suggestions, temps gagné.

# Boucler avec les évaluations

L'observabilité n'a de valeur que si elle alimente l'amélioration :

```diagram
type: flow
title: La boucle d'amélioration continue
loop: En continu
steps:
  - title: Production
    text: Traces, métriques, retours
  - title: Détection
    text: Alertes, échantillonnage, retours négatifs
  - title: Analyse
    text: Lecture des traces, catégorisation des erreurs
  - title: Jeu d'évaluation
    text: Les cas problématiques deviennent des tests
  - title: Correction
    text: Validée hors ligne, puis déployée
```

## Les alertes

Configurez des alertes sur des seuils : hausse du taux d'erreur, explosion du coût journalier, latence p95 au-delà d'une limite, chute du score des évaluations en ligne, hausse des retours négatifs.

## La dérive

Le comportement d'un système peut évoluer **sans que vous ayez rien modifié** : les utilisateurs posent de nouveaux types de questions, la base documentaire change, un fournisseur met à jour un alias de modèle. Surveillez la répartition des types de demandes et les scores dans le temps. Épinglez des **versions précises** de modèles quand le fournisseur le permet, pour que les changements soient décidés et non subis.

# Confidentialité des traces

Les traces contiennent souvent des **données personnelles** et des **informations confidentielles** (questions des utilisateurs, documents, réponses). Il faut :

- définir une **durée de conservation** ;
- **restreindre l'accès** aux traces aux personnes qui en ont besoin ;
- **masquer** les données sensibles quand c'est possible (adresses électroniques, numéros de téléphone, identifiants) ;
- informer les utilisateurs et respecter la réglementation applicable (par exemple le RGPD en Europe) ;
- vérifier où sont **hébergées** les traces si vous utilisez une plateforme externe.

> [!WARNING]
> Ne journalisez jamais de **secrets** (clés d'API, jetons, mots de passe), même dans des environnements de développement. Ils finissent souvent copiés dans des outils tiers.

# Exercices

## Exercice 1 : Concevoir un tableau de bord

Pour un assistant de support client fondé sur un RAG, listez les 8 indicateurs que vous placeriez sur le tableau de bord principal, en séparant santé technique et qualité.

<details>
<summary>Voir une proposition de solution</summary>

**Santé technique** : taux d'erreur par type ; latence p95 et délai avant le premier token ; coût par conversation et coût journalier ; taux de réponses tronquées.

**Qualité** : taux de pouces bas ; taux d'escalade vers un conseiller humain ; score de fidélité mesuré par le LLM juge sur un échantillon quotidien ; taux de questions sans source pertinente trouvée (score de recherche sous le seuil).

</details>

## Exercice 2 : Lire une trace

Une trace montre : recherche 120 ms, reranking 900 ms, génération 2 400 ms (dont 300 ms avant le premier token), 2 800 tokens de sortie. L'utilisateur trouve la réponse « trop longue à arriver et trop longue à lire ». Que proposez-vous ?

<details>
<summary>Voir la solution</summary>

- La génération domine, et elle est longue à cause des **2 800 tokens de sortie** : demander des réponses plus concises (prompt, `max_tokens` adapté) réduit à la fois la latence et le temps de lecture.
- Le **streaming** (s'il n'est pas déjà en place) affichera le texte dès 300 ms environ, en plus des étapes amont.
- Le reranking (900 ms) est significatif : vérifier son apport réel sur l'évaluation, réduire le nombre de candidats reclassés ou choisir un reranker plus rapide.

</details>

## Exercice 3 : Évaluation en ligne

Vous voulez mesurer chaque jour la fidélité des réponses de votre RAG en production, sans exploser le budget. Proposez un dispositif.

<details>
<summary>Voir une proposition de solution</summary>

- Échantillonner aléatoirement un pourcentage fixe des conversations (par exemple 2 %, ou un nombre fixe par jour), en excluant celles dont les utilisateurs ont refusé l'analyse.
- Faire juger chaque réponse échantillonnée par le **LLM juge de fidélité validé**, à partir des passages réellement récupérés (enregistrés dans la trace).
- Utiliser le traitement **par lots** asynchrone du fournisseur quand il existe (moins cher, la latence n'étant pas critique).
- Suivre le score quotidien avec un intervalle de variation, déclencher une alerte en cas de baisse significative, et faire relire régulièrement par un humain une partie des cas jugés infidèles.
- Ajouter au jeu d'évaluation hors ligne les cas infidèles confirmés.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Observabilité en production
center: Observer à la fois la santé technique et la qualité des réponses, puis boucler avec l'évaluation.
points:
  - icon: eye
    title: Traces et spans
    text: "Chaque étape chronométrée : recherche, outils, génération, avec tokens et raison d'arrêt."
  - icon: gauge
    title: Santé technique
    text: Erreurs, latence en percentiles (p95), délai avant le premier token, coût par requête.
  - icon: users
    title: Signaux de qualité
    text: Retours explicites, signaux implicites, juge sur un échantillon, métriques métier.
  - icon: loop
    title: Boucler
    text: Les cas problématiques de production deviennent des cas du jeu d'évaluation.
  - icon: lock
    title: Confidentialité
    text: Conservation limitée, accès restreint, masquage, jamais de secrets dans les traces.
pitfall: "Suivre la latence moyenne : elle masque les requêtes lentes dont les utilisateurs se souviennent."
remember: "Une requête techniquement réussie peut être une mauvaise réponse : surveillez aussi la qualité."
```
