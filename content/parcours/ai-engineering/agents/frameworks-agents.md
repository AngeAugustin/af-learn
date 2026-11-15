---
title: Les frameworks d'agents en pratique
description: Construire le même agent avec trois approches (un SDK d'agent (OpenAI Agents SDK), un framework orienté graphe (LangGraph) et le Claude Agent SDK) puis planification, réflexion et critères de choix.
duration: 70
objectives:
  - Situer les grandes familles de frameworks d'agents et ce qu'elles apportent
  - Écrire un agent avec outils et délégation avec un SDK d'agent
  - Modéliser un workflow avec état, branchement, persistance et validation humaine dans LangGraph
  - Utiliser un harness complet sous forme de bibliothèque avec le Claude Agent SDK
  - Mettre en œuvre planification et réflexion, et choisir une approche selon le projet
---

# Pourquoi un framework ?

Au chapitre 1 de ce module, vous avez vu qu'un agent peut s'écrire avec quelques dizaines de lignes autour de l'API. C'est la meilleure façon de **comprendre**. En production, on rencontre pourtant vite les mêmes besoins : persister l'état, reprendre après une erreur, déléguer à un autre agent, tracer chaque étape, demander une validation humaine, changer de fournisseur de modèle. Les frameworks apportent ces briques.

On peut les ranger en trois familles :

```diagram
type: compare
title: Trois familles d'outils pour construire des agents
columns:
  - title: SDK d'agent légers
    tone: blue
    items:
      - "OpenAI Agents SDK, Pydantic AI, smolagents"
      - Agent = instructions + outils + modèle
      - Délégation entre agents, garde-fous, traces intégrées
      - Peu d'abstraction, rapide à prendre en main
  - title: Frameworks orientés graphe
    tone: violet
    items:
      - "LangGraph (et dans une certaine mesure LlamaIndex Workflows)"
      - Le flux est un graphe explicite de nœuds et de transitions
      - Persistance, reprise, validation humaine, contrôle fin
      - Plus verbeux, idéal pour les workflows métier
  - title: Harness complets en bibliothèque
    tone: teal
    items:
      - "Claude Agent SDK"
      - Le moteur d'un agent de code (fichiers, shell, web, sous-agents, hooks)
      - Contexte et permissions déjà gérés
      - Moins de contrôle sur la boucle elle-même
```

> [!NOTE]
> Ces bibliothèques évoluent très vite : noms de fonctions, paramètres et fonctionnalités changent d'une version à l'autre. Les exemples de ce chapitre illustrent les **concepts** ; reportez-vous à la documentation de la version que vous installez, et **figez** cette version dans votre projet.

Pour comparer, nous allons construire le même **agent de support** pour une boutique en ligne : il consulte une commande, peut proposer un remboursement (avec validation humaine au-delà d'un montant) et transfère les questions techniques à un agent spécialisé.

```python
# donnees.py - un faux système de commandes, partagé par les exemples
COMMANDES = {
    "CMD-1001": {"client": "alice@exemple.fr", "statut": "livrée", "montant": 89.90},
    "CMD-1002": {"client": "bob@exemple.fr", "statut": "en transit", "montant": 1250.00},
}
```

# Un SDK d'agent : OpenAI Agents SDK

Le SDK d'agents d'OpenAI (paquet `openai-agents`) repose sur quelques primitives : l'**agent** (instructions, outils, modèle), les **outils** déclarés par décorateur, le **transfert** (*handoff*) vers un autre agent, les **garde-fous** et le **traçage** intégré. Il peut utiliser des modèles d'autres fournisseurs via des adaptateurs.

```python
# pip install openai-agents
from agents import Agent, Runner, function_tool
from donnees import COMMANDES


@function_tool
def consulter_commande(numero: str) -> str:
    """Renvoie le statut et le montant d'une commande à partir de son numéro (format CMD-XXXX)."""
    commande = COMMANDES.get(numero)
    if commande is None:
        return f"Aucune commande {numero}. Demande au client de vérifier le numéro."
    return f"{numero} : {commande['statut']}, {commande['montant']:.2f} €"


support_technique = Agent(
    name="Support technique",
    handoff_description="Questions techniques sur l'utilisation des produits",
    instructions="Tu aides les clients à utiliser leurs produits. Réponds de façon concise et pas à pas.",
)

support = Agent(
    name="Support client",
    instructions=(
        "Tu es l'agent de support d'une boutique en ligne. Consulte toujours la commande avant de répondre "
        "à une question de livraison. Pour toute question technique sur un produit, transfère au support technique."
    ),
    tools=[consulter_commande],
    handoffs=[support_technique],
)

resultat = Runner.run_sync(support, "Où en est ma commande CMD-1002 ?")
print(resultat.final_output)
```

Ce que le SDK gère pour vous : la boucle d'appels d'outils, la génération du schéma JSON à partir de la signature et de la docstring de la fonction, le transfert de la conversation à l'autre agent, et une **trace** de chaque étape consultable dans un tableau de bord.

> [!TIP]
> Remarquez que la **docstring** devient la description de l'outil vue par le modèle : rédigez-la avec le même soin qu'un prompt (module 4, conception des outils).

# Un framework orienté graphe : LangGraph

LangGraph modélise un agent ou un workflow comme un **graphe d'états** : des **nœuds** (fonctions) qui lisent et modifient un **état** partagé, reliés par des **transitions**, éventuellement conditionnelles. Ses points forts sont la **persistance** (un *checkpointer* sauvegarde l'état après chaque nœud), la **reprise** et l'**interruption** pour validation humaine.

```diagram
type: flow
title: Le graphe de l'agent de remboursement
steps:
  - title: analyser
    text: Le modèle extrait le numéro de commande et la demande
  - title: consulter
    text: Lecture de la commande dans le système
  - title: décider
    text: Remboursement automatique si montant ≤ 100 €
  - title: validation humaine
    text: Interruption au-delà de 100 €, reprise à la décision
    tone: amber
  - title: répondre
    text: Message final au client
    tone: teal
```

```python
# pip install langgraph anthropic
from typing import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.types import interrupt, Command
from donnees import COMMANDES


class Etat(TypedDict, total=False):
    message: str
    numero: str
    commande: dict
    decision: str
    reponse: str


def analyser(etat: Etat) -> Etat:
    # En pratique : un appel au modèle avec sortie structurée (module 4). Simplifié ici.
    numero = next((mot for mot in etat["message"].split() if mot.startswith("CMD-")), "")
    return {"numero": numero.strip(".,?!")}


def consulter(etat: Etat) -> Etat:
    return {"commande": COMMANDES.get(etat["numero"], {})}


def router(etat: Etat) -> str:
    if not etat.get("commande"):
        return "repondre"
    return "valider" if etat["commande"]["montant"] > 100 else "rembourser"


def valider(etat: Etat) -> Etat:
    # Le graphe s'interrompt ici ; l'état est sauvegardé par le checkpointer.
    decision = interrupt({"question": f"Rembourser {etat['commande']['montant']} € pour {etat['numero']} ?"})
    return {"decision": "accepte" if decision == "oui" else "refuse"}


def rembourser(etat: Etat) -> Etat:
    return {"decision": "accepte"}


def repondre(etat: Etat) -> Etat:
    if not etat.get("commande"):
        return {"reponse": "Je ne trouve pas cette commande. Pouvez-vous vérifier le numéro ?"}
    if etat["decision"] == "accepte":
        return {"reponse": f"Le remboursement de la commande {etat['numero']} est validé."}
    return {"reponse": "Votre demande a été transmise à un conseiller, qui reviendra vers vous."}


graphe = StateGraph(Etat)
for nom, fonction in [("analyser", analyser), ("consulter", consulter), ("valider", valider),
                      ("rembourser", rembourser), ("repondre", repondre)]:
    graphe.add_node(nom, fonction)
graphe.add_edge(START, "analyser")
graphe.add_edge("analyser", "consulter")
graphe.add_conditional_edges("consulter", router, ["valider", "rembourser", "repondre"])
graphe.add_edge("valider", "repondre")
graphe.add_edge("rembourser", "repondre")
graphe.add_edge("repondre", END)

app = graphe.compile(checkpointer=InMemorySaver())  # en production : un checkpointer PostgreSQL ou SQLite

config = {"configurable": {"thread_id": "ticket-42"}}
app.invoke({"message": "Je veux être remboursé pour CMD-1002."}, config)  # s'arrête sur interrupt()
# ... plus tard, quand le manager a décidé :
final = app.invoke(Command(resume="oui"), config)
print(final["reponse"])
```

Observez la différence de philosophie : ici, **le code décide du flux** (le modèle n'intervient que dans certains nœuds), ce qui correspond au **workflow** du chapitre 1. LangGraph permet aussi de construire des agents « libres » (un nœud modèle et un nœud outils dans une boucle), mais sa valeur se révèle surtout quand on veut **contrôler** le chemin.

# Un harness en bibliothèque : Claude Agent SDK

Le Claude Agent SDK expose le **harness** de Claude Code sous forme de bibliothèque (Python et TypeScript) : outils de fichiers, de shell et de recherche web, gestion du contexte (compaction), sous-agents, hooks, permissions, serveurs MCP. Vous n'écrivez pas la boucle : vous **configurez** l'agent.

```python
# pip install claude-agent-sdk
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions


async def main() -> None:
    options = ClaudeAgentOptions(
        system_prompt="Tu es un analyste. Tu réponds en français, avec les chiffres exacts et la méthode utilisée.",
        allowed_tools=["Read", "Glob", "Grep", "Bash"],
        permission_mode="default",  # les actions non autorisées d'office demandent une validation
        cwd="./donnees_ventes",
        max_turns=20,
    )
    async for message in query(prompt="Quel produit a le plus progressé entre T1 et T2 ?", options=options):
        print(message)


asyncio.run(main())
```

Il convient bien aux agents qui ont besoin des capacités d'un agent de code (lire et écrire des fichiers, exécuter des scripts d'analyse, chercher sur le web) : analyse de données, génération de rapports, automatisation de tâches de développement, agents de recherche. Vos outils métier s'ajoutent via des **serveurs MCP** (y compris définis directement dans votre code Python).

# Planification et réflexion

Quel que soit l'outil, deux techniques améliorent les agents sur les tâches complexes.

## Planifier puis exécuter

Au lieu de décider une action à la fois, l'agent **rédige d'abord un plan**, puis l'exécute étape par étape, en le **révisant** si un résultat le contredit. Avantages : meilleure cohérence sur les longues tâches, plan **lisible** et **validable** par un humain avant exécution, possibilité d'exécuter certaines étapes avec un modèle moins cher. On l'a vu côté sécurité : fixer le plan avant de lire du contenu non fiable limite l'impact d'une injection (module 9).

Les agents de code matérialisent souvent le plan sous forme de **liste de tâches** (un outil dédié), mise à jour au fil du travail.

## La réflexion

Après une tentative, l'agent **critique** son résultat à partir d'un retour **concret** (tests qui échouent, erreur d'exécution, vérification par un outil), puis réessaie en tenant compte de cette critique. C'est le pattern **évaluateur-optimiseur** du chapitre 2, appliqué dans la boucle de l'agent ; des travaux comme *Reflexion* (Shinn et al., 2023) ont montré son intérêt sur la programmation et le raisonnement.

> [!IMPORTANT]
> La réflexion est efficace quand elle s'appuie sur un **signal externe** (un test, un compilateur, une donnée vérifiée). Une « auto-critique » sans aucun retour extérieur améliore peu et peut même renforcer une erreur.

# Comment choisir ?

| Votre situation | Approche conseillée |
|---|---|
| Apprendre, prototyper, cas simple | API directe, quelques dizaines de lignes |
| Agent conversationnel avec outils et délégation entre spécialistes | SDK d'agent léger |
| Processus métier aux étapes connues, validation humaine, reprise après plusieurs jours | Framework orienté graphe avec persistance |
| Agent qui manipule fichiers, code, données, web | Harness en bibliothèque (Claude Agent SDK) |
| Fortes contraintes (latence, modèle local, sécurité, contrôle total) | Votre propre harness (module 7) |

Critères transverses à vérifier : **observabilité** (traces exportables, compatibles OpenTelemetry), **indépendance vis-à-vis du fournisseur** de modèle, **maturité** et rythme des changements incompatibles, **testabilité** (peut-on remplacer le modèle par un faux en test ?), et **ce qui est caché** (pouvez-vous voir les prompts réellement envoyés ?).

# Exercices

## Exercice 1 : Choisir une approche

Pour chaque projet, choisissez une approche et justifiez :

1. Un assistant interne qui répond aux questions RH et transfère aux experts paie ou juridique selon le sujet.
2. Le traitement des demandes de prêt : collecte des pièces, vérifications automatiques, avis d'un analyste, décision, notification, sur plusieurs jours.
3. Un agent qui produit chaque lundi un rapport d'analyse à partir de fichiers CSV et de scripts Python existants.

<details>
<summary>Voir la solution</summary>

1. **SDK d'agent léger** : un agent d'accueil avec des transferts (*handoffs*) vers des agents spécialisés, des outils de consultation, des garde-fous.
2. **Framework orienté graphe** avec persistance : étapes connues, branchements, interruption pour l'avis de l'analyste, reprise après plusieurs jours, traçabilité de chaque étape (c'est aussi un système à haut risque au sens de l'AI Act, module 9).
3. **Harness en bibliothèque** (Claude Agent SDK) : l'agent lit les fichiers, exécute les scripts existants, écrit le rapport ; ou un simple workflow programmé si les étapes ne varient jamais.

</details>

## Exercice 2 : Étendre le graphe

Modifiez le graphe LangGraph du chapitre pour que, si le manager refuse un remboursement, le graphe passe par un nœud `proposer_avoir` qui propose un avoir de 20 % du montant, avant de répondre.

<details>
<summary>Voir la solution</summary>

```python
def apres_validation(etat: Etat) -> str:
    return "repondre" if etat["decision"] == "accepte" else "proposer_avoir"


def proposer_avoir(etat: Etat) -> Etat:
    avoir = round(etat["commande"]["montant"] * 0.2, 2)
    return {"reponse": f"Nous ne pouvons pas rembourser cette commande, mais nous vous proposons un avoir de {avoir} €."}


graphe.add_node("proposer_avoir", proposer_avoir)
# remplacer graphe.add_edge("valider", "repondre") par :
graphe.add_conditional_edges("valider", apres_validation, ["repondre", "proposer_avoir"])
graphe.add_edge("proposer_avoir", END)
```

Le nœud `repondre` reste utilisé pour les cas acceptés et les commandes introuvables ; le refus aboutit à la proposition d'avoir.

</details>

## Exercice 3 : Réflexion utile ou inutile ?

Dans lesquels de ces cas une boucle de réflexion a-t-elle de bonnes chances d'améliorer le résultat ? Justifiez.

1. Générer une fonction Python, l'exécuter contre des tests, corriger.
2. Rédiger un poème, puis demander au même modèle « Ton poème est-il bon ? Améliore-le », trois fois.
3. Écrire une requête SQL, l'exécuter, examiner l'erreur ou le résultat, corriger.

<details>
<summary>Voir la solution</summary>

1. **Oui** : les tests fournissent un signal externe précis.
3. **Oui** : l'exécution de la requête (erreur de syntaxe, résultat vide ou incohérent) est un retour concret.
2. **Peu probable** : sans critère ni retour extérieur, l'auto-critique tourne en rond ; mieux vaut définir des critères explicites, ou recueillir un avis humain ou un juge avec une grille (module 8).

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Les frameworks d'agents
center: Comprendre la boucle d'abord, puis choisir l'outil qui apporte ce dont le projet a besoin.
points:
  - icon: puzzle
    title: SDK légers
    text: Agent = instructions + outils ; transferts entre agents, garde-fous, traces intégrées.
  - icon: network
    title: Graphes d'états
    text: Flux explicite, persistance, interruption pour validation humaine, reprise.
  - icon: terminal
    title: Harness en bibliothèque
    text: Fichiers, shell, web, sous-agents et hooks prêts à configurer.
  - icon: list
    title: Planifier
    text: Un plan lisible et validable, révisé au fil des résultats.
  - icon: loop
    title: Réfléchir
    text: "Corriger à partir d'un signal externe : tests, erreurs, données vérifiées."
pitfall: Adopter un framework sans pouvoir voir les prompts réellement envoyés au modèle.
remember: Figer les versions, vérifier l'observabilité et garder la possibilité de changer de modèle.
```
