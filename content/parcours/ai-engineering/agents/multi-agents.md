---
title: Systèmes multi-agents et protocole A2A
description: Quand et comment répartir le travail entre plusieurs agents (architectures, délégation, partage d'information, défaillances typiques, coûts) et faire communiquer des agents indépendants avec le protocole A2A.
duration: 60
objectives:
  - Décider si un système multi-agents est justifié face à un agent unique
  - Choisir une architecture (orchestrateur, hiérarchie, transferts, débat)
  - Rédiger des consignes de délégation complètes et partager l'information sans la déformer
  - Reconnaître les défaillances typiques des systèmes multi-agents
  - Expliquer le rôle du protocole A2A et sa complémentarité avec MCP
---

# Un agent ou plusieurs ?

Un **système multi-agents** répartit une tâche entre plusieurs agents, chacun avec **son propre contexte**, ses instructions et souvent ses outils. L'idée séduit : une « équipe » de spécialistes. Mais elle a un coût.

Anthropic a décrit en 2025 son système de recherche multi-agents : un agent principal planifie, lance des sous-agents qui explorent chacun un axe **en parallèle**, puis synthétise. Sur son évaluation interne de recherche, cette configuration surpassait nettement un agent unique, mais consommait environ **15 fois plus de tokens** qu'une conversation classique (contre environ 4 fois pour un agent unique). L'analyse de l'équipe : une grande partie du gain s'explique simplement par le **volume de tokens** que le système peut consacrer au problème, réparti sur plusieurs contextes.

À l'inverse, d'autres praticiens (par exemple l'équipe de Cognition, en 2025) ont mis en garde contre le multi-agents pour les tâches où **tout le travail doit partager le même contexte** : des sous-agents qui ne voient pas les décisions des autres produisent des morceaux incompatibles.

```diagram
type: decision
title: Faut-il plusieurs agents ?
nodes:
  - question: Un agent unique, bien outillé et avec une bonne gestion du contexte, échoue-t-il réellement ?
    yes: Question suivante
    no: Rester sur un agent unique
  - question: La tâche se découpe-t-elle en sous-tâches largement indépendantes (lectures, recherches, analyses parallèles) ?
    yes: Question suivante
    no: Agent unique avec sous-agents ponctuels, ou workflow
  - question: La valeur de la tâche justifie-t-elle un coût en tokens plusieurs fois supérieur ?
    yes: Système multi-agents, avec évaluation et budget
    no: Agent unique ou workflow parallèle simple
```

> [!TIP]
> Les bons candidats au multi-agents sont des tâches **larges** (beaucoup d'informations à parcourir), **parallélisables** et **de grande valeur** : recherche documentaire approfondie, audit d'un grand nombre de documents, revue de code sous plusieurs angles. Les mauvais candidats : des tâches où chaque décision dépend étroitement des autres, comme écrire un programme cohérent.

# Les architectures

| Architecture | Fonctionnement | Exemple |
|---|---|---|
| **Orchestrateur et exécutants** | Un agent principal planifie, délègue, puis synthétise | Recherche : un sous-agent par axe |
| **Hiérarchique** | Plusieurs niveaux d'orchestrateurs | Grand projet découpé en sous-projets |
| **Transferts** (*handoffs*) | Un agent passe la main à un autre, qui prend la conversation | Accueil → facturation → support technique |
| **Débat ou vote** | Plusieurs agents produisent indépendamment, puis on confronte ou on vote | Revue de code par plusieurs relecteurs aux angles différents |
| **Pipeline** | Chaque agent traite le résultat du précédent | Extraction → vérification → rédaction |

L'architecture **orchestrateur et exécutants** est la plus répandue et la plus robuste. Le transfert convient aux assistants conversationnels. Le débat améliore parfois la qualité sur des questions difficiles, au prix d'un coût élevé.

```video
url: https://www.youtube.com/watch?v=sWH0T4Zez6I
title: "Multi Agent Systems Explained: How AI Agents & LLMs Work Together"
channel: "IBM Technology"
duration: "7:57"
lang: en
why: "Les architectures multi-agents présentées par IBM Technology : orchestrateur, spécialistes et circulation de l'information entre eux."
```

# Déléguer correctement

Un sous-agent ne sait **que** ce qu'on lui dit. La qualité du système dépend donc beaucoup des **consignes de délégation**. Une bonne consigne précise :

- l'**objectif** et **pourquoi** il compte dans la tâche globale ;
- le **périmètre** : ce qui est inclus, ce qui ne l'est pas (pour éviter les doublons avec les autres sous-agents) ;
- les **outils** et **sources** à privilégier ;
- le **format du compte rendu** attendu ;
- un **budget d'effort** proportionné (nombre d'appels d'outils, profondeur).

```python
import asyncio
import anthropic

client = anthropic.AsyncAnthropic()
MODELE = "claude-opus-5-5"


async def sous_agent(consigne: str) -> str:
    """Exécutant simplifié : un appel unique. En pratique, une boucle avec ses propres outils de recherche."""
    r = await client.messages.create(model=MODELE, max_tokens=2_000, messages=[{"role": "user", "content": consigne}])
    return r.content[0].text


async def orchestrer(question: str, axes: list[str]) -> str:
    consignes = [
        f"""<objectif>Contribuer à répondre à : « {question} ».</objectif>
<ton_axe>{axe}</ton_axe>
<hors_perimetre>Les autres axes ({", ".join(a for a in axes if a != axe)}) sont traités par d'autres analystes.</hors_perimetre>
<format>10 lignes maximum : faits clés avec leur source, puis incertitudes.</format>"""
        for axe in axes
    ]
    comptes_rendus = await asyncio.gather(*(sous_agent(c) for c in consignes))
    synthese = "\n\n".join(f"<compte_rendu axe='{a}'>\n{cr}\n</compte_rendu>" for a, cr in zip(axes, comptes_rendus))
    r = await client.messages.create(
        model=MODELE, max_tokens=3_000,
        messages=[{"role": "user", "content": f"Question : {question}\n\n{synthese}\n\n"
                   "Rédige une synthèse argumentée, signale les contradictions entre comptes rendus et cite les sources."}],
    )
    return r.content[0].text


# asyncio.run(orchestrer("Faut-il migrer notre parc de serveurs vers ARM ?",
#                        ["coûts et performances", "compatibilité logicielle", "risques et calendrier"]))
```

> [!IMPORTANT]
> Une consigne vague (« recherche les semi-conducteurs ») conduit les sous-agents à **dupliquer** le travail ou à mal interpréter la tâche. Dans le retour d'expérience d'Anthropic, apprendre à l'orchestrateur à **bien déléguer** et à **adapter l'effort** à la complexité (un sous-agent pour une question simple, une dizaine pour une recherche complexe) a été l'un des leviers majeurs.

# Partager l'information

Deux grandes façons de faire circuler l'information :

- **Par messages** : chaque agent renvoie un compte rendu à l'orchestrateur. Simple, mais chaque résumé **perd** de l'information, et une chaîne de résumés déforme le contenu comme le « téléphone arabe ».
- **Par un espace partagé** : les sous-agents écrivent leurs résultats complets dans un stockage commun (fichiers, base, état partagé d'un graphe) et ne renvoient qu'une **référence** et un court résumé. L'orchestrateur ou l'agent suivant lit l'original au besoin.

La seconde approche réduit les pertes et la consommation de tokens de l'orchestrateur, mais demande une **organisation** claire (nommage, format, droits d'écriture).

# Les défaillances typiques

Une étude de 2025 analysant des centaines de traces de systèmes multi-agents (*Why Do Multi-Agent LLM Systems Fail?*, Cemri et al.) regroupe les échecs en trois familles :

| Famille | Exemples |
|---|---|
| **Spécification** | Rôles flous, consignes incomplètes, conditions de fin absentes, agent qui sort de son rôle |
| **Désalignement entre agents** | Information non transmise, agent qui ignore l'apport d'un autre, conversation qui dérive, travail dupliqué |
| **Vérification** | Personne ne vérifie le résultat final, ou la vérification est superficielle ; arrêt prématuré |

Parades :

- des **rôles et conditions de fin explicites** ;
- un **vérificateur** (agent ou, mieux, contrôle automatique) qui juge le résultat final ;
- un **budget global** et par agent (tokens, appels, durée) ;
- des **traces** qui montrent l'arbre complet des délégations, pour déboguer (module 8) ;
- des agents **déterministes là où c'est possible** : un pipeline codé vaut mieux qu'une « discussion » entre agents quand les étapes sont connues.

> [!WARNING]
> Chaque frontière entre agents est aussi une **frontière de confiance** (module 9). Un sous-agent qui a lu une page web piégée peut transmettre une injection à l'orchestrateur, qui dispose peut-être d'outils plus puissants. Les comptes rendus des sous-agents sont des **données**, à traiter comme du contenu non fiable.

# Faire communiquer des agents indépendants : A2A

Jusqu'ici, tous les agents appartenaient au même système. Mais comment l'agent d'achat de votre entreprise peut-il dialoguer avec l'agent commercial d'un fournisseur, construit avec un autre framework, chez un autre hébergeur ?

Le protocole **Agent2Agent (A2A)**, proposé par Google en avril 2025 puis confié à la Linux Foundation, standardise cette communication. Ses éléments principaux :

| Élément | Rôle |
|---|---|
| **Carte d'agent** (*Agent Card*) | Document JSON publié à une adresse connue, qui décrit l'agent : nom, compétences, point d'accès, modes d'authentification, formats acceptés |
| **Tâche** (*task*) | Unité de travail confiée à un agent distant, avec un cycle de vie (soumise, en cours, en attente d'information, terminée, échouée) |
| **Messages** | Échanges entre client et agent distant au cours d'une tâche (texte, fichiers, données structurées) |
| **Artefacts** | Résultats produits par la tâche |
| **Transport** | HTTP avec JSON-RPC, diffusion en continu des mises à jour, notifications pour les tâches longues |

```json
{
  "name": "Agent commercial - Fournitures Dupont",
  "description": "Devis, disponibilités et suivi de commandes de fournitures de bureau.",
  "url": "https://agents.fournitures-dupont.exemple/a2a",
  "version": "1.0.0",
  "capabilities": { "streaming": true, "pushNotifications": true },
  "defaultInputModes": ["text/plain", "application/json"],
  "defaultOutputModes": ["text/plain", "application/json"],
  "skills": [
    { "id": "devis", "name": "Établir un devis", "description": "Devis à partir d'une liste d'articles et de quantités." }
  ]
}
```

*(Exemple simplifié : reportez-vous à la spécification pour le format exact et les champs d'authentification.)*

## A2A et MCP

```diagram
type: compare
title: Deux protocoles complémentaires
columns:
  - title: MCP
    tone: blue
    items:
      - Connecte un agent à des outils et des données
      - Le serveur expose des fonctions et ressources
      - Relation agent → outil
  - title: A2A
    tone: violet
    items:
      - Connecte un agent à un autre agent autonome
      - L'agent distant garde sa logique, ses outils et ses données privés
      - Relation agent ↔ agent, tâches longues et échanges
```

Un même système peut utiliser les deux : votre agent d'achat appelle ses outils internes par **MCP**, et délègue la négociation à l'agent du fournisseur par **A2A**.

> [!NOTE]
> L'écosystème des protocoles entre agents est jeune et évolue (d'autres propositions ont existé, certaines ont été fusionnées). Les principes restent : **découverte** (qui sait faire quoi), **délégation de tâches** avec un cycle de vie, **authentification** et **frontières de confiance**.

# Exercices

## Exercice 1 : Multi-agents ou pas ?

Pour chaque tâche, recommandez un agent unique, un workflow ou un système multi-agents :

1. Rédiger un état de l'art sur un sujet scientifique à partir de 200 articles.
2. Développer une nouvelle fonctionnalité dans une application web.
3. Répondre aux questions des clients sur leurs commandes.
4. Vérifier la conformité de 3 000 contrats à une nouvelle réglementation.

<details>
<summary>Voir la solution</summary>

1. **Multi-agents** (orchestrateur + exécutants) : tâche large, parallélisable, de grande valeur ; chaque sous-agent lit un lot d'articles et écrit ses notes dans un espace partagé.
2. **Agent unique** (éventuellement avec des sous-agents d'exploration en lecture seule) : les décisions de conception doivent rester cohérentes dans un même contexte.
3. **Agent unique** avec outils, éventuellement des transferts vers des spécialistes.
4. **Workflow parallèle** (map-reduce) plutôt qu'un « dialogue » entre agents : la même analyse appliquée à chaque contrat, avec une sortie structurée, puis une agrégation. Un orchestrateur intelligent n'apporte pas grand-chose ici.

</details>

## Exercice 2 : Améliorer une délégation

Un orchestrateur délègue ainsi : « Sous-agent 1 : cherche des infos sur le marché des vélos électriques. Sous-agent 2 : cherche des infos sur les vélos électriques en Europe. » Les comptes rendus se recouvrent à 80 %. Réécrivez les consignes.

<details>
<summary>Voir la solution</summary>

- **Sous-agent 1**. Objectif : estimer la taille et la croissance du marché européen des vélos électriques 2023-2026 pour une décision d'investissement. Périmètre : chiffres de marché (volumes, valeur, croissance) par grand pays ; **hors périmètre** : acteurs et réglementation (traités par d'autres). Sources : études sectorielles, statistiques officielles. Format : tableau pays × année + 5 lignes d'analyse + sources.
- **Sous-agent 2**. Objectif : cartographier les principaux fabricants et distributeurs en Europe. Périmètre : parts de marché, positionnement prix, tendances ; **hors périmètre** : taille du marché. Format : 10 acteurs maximum, une ligne chacun, sources.

Les axes sont **disjoints**, l'objectif global est rappelé, le format est fixé.

</details>

## Exercice 3 : A2A ou MCP ?

Pour chaque intégration, indiquez le protocole le plus adapté :

1. Donner à votre agent l'accès en lecture à votre base de données de produits.
2. Permettre à votre agent de voyage de confier la réservation d'hôtel à l'agent d'une chaîne hôtelière, qui négocie les options avec ses propres règles.
3. Permettre à votre agent d'appeler l'API de météo publique.

<details>
<summary>Voir la solution</summary>

1. **MCP** : accès à une source de données via des outils.
2. **A2A** : délégation d'une tâche à un agent autonome externe, qui garde sa logique et ses données, avec des échanges possibles (choix de chambre, confirmation).
3. **MCP** (ou un simple outil) : appel d'une API, pas d'agent autonome de l'autre côté.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Systèmes multi-agents et A2A
center: "Plusieurs agents pour des tâches larges et parallélisables : un seul quand la cohérence prime."
points:
  - icon: money
    title: Coût
    text: Plusieurs fois plus de tokens qu'un agent unique ; réserver aux tâches de grande valeur.
  - icon: network
    title: Architectures
    text: Orchestrateur et exécutants, hiérarchie, transferts, débat, pipeline.
  - icon: list
    title: Bien déléguer
    text: Objectif, périmètre et hors périmètre, outils, format, budget d'effort.
  - icon: database
    title: Espace partagé
    text: Écrire les résultats complets, ne transmettre que des références et des résumés.
  - icon: alert
    title: Défaillances
    text: "Spécification floue, désalignement, vérification absente : ajouter un vérificateur."
  - icon: link
    title: A2A
    text: Cartes d'agents, tâches à cycle de vie, artefacts ; complémentaire de MCP.
pitfall: Découper en agents une tâche dont toutes les décisions doivent rester cohérentes entre elles.
remember: Commencer par un agent unique bien conçu, et ne passer au multi-agents que preuve d'évaluation à l'appui.
```
