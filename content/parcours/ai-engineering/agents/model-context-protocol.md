---
title: Le Model Context Protocol (MCP)
description: "Le standard ouvert qui connecte les applications d'IA aux outils et aux données : architecture, primitives, création d'un serveur et sécurité."
duration: 55
objectives:
  - Expliquer le problème que résout MCP
  - Décrire l'architecture hôte, client et serveur, et les transports
  - Distinguer les primitives outils, ressources et prompts
  - Créer et tester un serveur MCP en Python
  - Appliquer les bonnes pratiques de sécurité
---

# Pourquoi un protocole ?

Au module 4, vous avez défini des outils directement dans le code de votre application. Imaginez maintenant que vous vouliez connecter **plusieurs applications d'IA** (un assistant de bureau, un éditeur de code, votre propre agent) à **plusieurs sources** (GitHub, une base de données, votre wiki, votre outil de tickets). Sans standard, il faut écrire une intégration spécifique pour **chaque paire** application × source.

Le **Model Context Protocol** (MCP) est un **standard ouvert**, publié par Anthropic en novembre 2024, qui résout ce problème : une source de données ou un service expose ses capacités **une fois**, sous forme de **serveur MCP**, et toute application compatible peut s'y connecter. On le compare souvent à un « port USB-C » pour les applications d'IA. Le protocole a depuis été adopté par de nombreux acteurs de l'écosystème (éditeurs de code, autres fournisseurs de modèles, plateformes d'agents).

```diagram
type: compare
title: Sans et avec MCP
columns:
  - title: Sans standard
    tone: rose
    items:
      - Une intégration spécifique par application et par source
      - "M applications × N sources = M × N intégrations"
      - Maintenance lourde, comportements incohérents
  - title: Avec MCP
    tone: teal
    items:
      - Chaque source est exposée une fois par un serveur MCP
      - Chaque application implémente un client MCP
      - "M + N implémentations, réutilisables"
```

# L'architecture

MCP repose sur trois rôles :

- l'**hôte** (*host*) : l'application d'IA avec laquelle l'utilisateur interagit (un assistant de bureau, un IDE, votre agent) ;
- le **client** : le composant de l'hôte qui maintient une connexion avec **un** serveur ;
- le **serveur** : le programme qui expose des capacités (outils, données, prompts) d'un service donné.

```diagram
type: sequence
title: Un hôte connecté à deux serveurs MCP
actors: [Hôte (application d'IA), Serveur GitHub, Serveur base de données]
messages:
  - from: 0
    to: 1
    text: "Client 1 : initialisation, puis liste des outils disponibles"
  - from: 0
    to: 2
    text: "Client 2 : initialisation, puis liste des outils disponibles"
  - from: 0
    to: 0
    text: "Le modèle choisit un outil pour répondre à l'utilisateur"
  - from: 0
    to: 2
    text: "Appel de l'outil executer_requete({...})"
  - from: 2
    to: 0
    text: Résultat, transmis au modèle
```

Les messages échangés suivent le format **JSON-RPC 2.0**. Deux **transports** principaux sont définis :

- **stdio** : l'hôte lance le serveur comme un processus local et communique par l'entrée et la sortie standard. Simple, idéal pour des outils locaux.
- **Streamable HTTP** : le serveur est un service web, éventuellement distant, accessible par HTTP (avec diffusion en continu possible). Adapté aux serveurs partagés, avec authentification (le protocole s'appuie sur OAuth pour l'autorisation des serveurs distants).

# Les primitives

Un serveur MCP peut exposer trois types de capacités :

| Primitive | Contrôlée par | Rôle | Exemple |
|---|---|---|---|
| **Outils** (*tools*) | Le modèle | Des fonctions que le modèle peut décider d'appeler | `creer_ticket`, `rechercher_documents` |
| **Ressources** (*resources*) | L'application | Des données en lecture, identifiées par une URI, que l'application peut fournir au modèle comme contexte | `fichier://rapport.md`, `db://schema` |
| **Prompts** | L'utilisateur | Des modèles de prompts réutilisables, souvent proposés comme commandes | « Résumer une pull request » |

Le protocole définit aussi des capacités côté **client**, que les serveurs peuvent solliciter, par exemple l'**échantillonnage** (*sampling* : le serveur demande à l'hôte de faire une génération avec son modèle) ou l'**élicitation** (le serveur demande une information complémentaire à l'utilisateur). Leur prise en charge varie selon les hôtes.

> [!NOTE]
> Le protocole évolue par versions datées de sa spécification. Consultez le site officiel [modelcontextprotocol.io](https://modelcontextprotocol.io) pour la spécification à jour et la liste des SDK officiels (Python, TypeScript et de nombreux autres langages).

# Créer un serveur MCP

Le SDK Python officiel (`mcp`) fournit une interface de haut niveau, **FastMCP**, qui transforme des fonctions Python typées en outils, ressources et prompts.

```python
# serveur_notes.py - pip install "mcp[cli]"
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("notes")

NOTES: dict[str, str] = {"bienvenue": "Ceci est la première note."}


@mcp.tool()
def ajouter_note(titre: str, contenu: str) -> str:
    """Ajoute une note. Le titre doit être unique et court."""
    if titre in NOTES:
        return f"Erreur : une note « {titre} » existe déjà."
    NOTES[titre] = contenu
    return f"Note « {titre} » ajoutée."


@mcp.tool()
def rechercher_notes(mot_cle: str) -> list[str]:
    """Renvoie les titres des notes dont le titre ou le contenu contient le mot-clé."""
    mot = mot_cle.lower()
    return [t for t, c in NOTES.items() if mot in t.lower() or mot in c.lower()]


@mcp.resource("notes://{titre}")
def lire_note(titre: str) -> str:
    """Contenu d'une note."""
    return NOTES.get(titre, "Note introuvable.")


@mcp.prompt()
def resumer_notes() -> str:
    """Prompt pour résumer l'ensemble des notes."""
    toutes = "\n".join(f"- {t} : {c}" for t, c in NOTES.items())
    return f"Résume les notes suivantes en trois points clés :\n{toutes}"


if __name__ == "__main__":
    mcp.run()  # transport stdio par défaut
```

Comme pour le tool use, la **docstring** devient la description de l'outil et les **annotations de type** deviennent son schéma d'entrée : soignez-les.

## Tester et connecter le serveur

- L'**inspecteur MCP** officiel permet de tester un serveur dans le navigateur (lister et appeler les outils, lire les ressources) : `npx @modelcontextprotocol/inspector python serveur_notes.py`.
- Pour le connecter à une application hôte (assistant de bureau, IDE…), on déclare dans sa configuration la commande qui lance le serveur. Par exemple, pour une application de bureau qui lit une configuration JSON :

```json
{
  "mcpServers": {
    "notes": {
      "command": "python",
      "args": ["/chemin/absolu/vers/serveur_notes.py"]
    }
  }
}
```

Le format exact de configuration dépend de l'hôte : référez-vous à sa documentation.

> [!TIP]
> Avant de développer un serveur, vérifiez s'il en existe déjà un, officiel ou maintenu par l'éditeur du service : de nombreux services (gestion de code, bases de données, outils de productivité) publient leur propre serveur MCP.

# Sécurité

Un serveur MCP donne à un modèle la capacité d'**agir** sur vos systèmes. Les risques du tool use s'appliquent pleinement, avec quelques spécificités :

- **Serveurs non fiables** : un serveur malveillant peut voler des données ou insérer des instructions cachées dans les **descriptions de ses outils** (on parle d'empoisonnement d'outils, *tool poisoning*). N'installez que des serveurs de sources fiables, et lisez leur code ou leur documentation.
- **Injection de prompt indirecte** : le contenu renvoyé par un outil (une page web, un ticket, un courriel) peut contenir des instructions malveillantes destinées au modèle.
- **Combinaisons dangereuses** : un agent qui a accès à la fois à des **données privées**, à du **contenu non fiable** et à un moyen de **communiquer vers l'extérieur** peut être manipulé pour exfiltrer des données. Évitez de réunir ces trois capacités sans contrôle.
- **Moindre privilège** : jetons d'accès limités au strict nécessaire, en lecture seule quand c'est possible.
- **Validation humaine** des actions sensibles, que la plupart des hôtes proposent pour les appels d'outils.

> [!WARNING]
> Pour les serveurs distants, utilisez l'authentification prévue par la spécification (OAuth) et ne transmettez jamais de jetons d'accès de l'utilisateur à des serveurs tiers qui n'en ont pas besoin.

# Exercices

## Exercice 1 : Choisir la primitive

Pour chaque capacité d'un serveur MCP « gestion de projet », indiquez s'il s'agit plutôt d'un outil, d'une ressource ou d'un prompt :

1. Créer une tâche avec un titre, un responsable et une échéance.
2. Le document de cadrage du projet, que l'application peut joindre au contexte.
3. Un modèle « Rédiger le compte rendu hebdomadaire » que l'utilisateur déclenche.
4. Rechercher les tâches en retard.

<details>
<summary>Voir la solution</summary>

1. **Outil** : une action décidée par le modèle.
2. **Ressource** : des données en lecture fournies comme contexte.
3. **Prompt** : un modèle réutilisable déclenché par l'utilisateur.
4. **Outil** : une recherche paramétrée que le modèle appelle au besoin.

</details>

## Exercice 2 : Étendre le serveur

Ajoutez au serveur de notes un outil `supprimer_note(titre)` qui renvoie un message d'erreur clair si la note n'existe pas. Testez-le avec l'inspecteur MCP. Quelle précaution supplémentaire prendriez-vous dans un vrai produit ?

<details>
<summary>Voir la solution</summary>

```python
@mcp.tool()
def supprimer_note(titre: str) -> str:
    """Supprime définitivement la note portant ce titre exact."""
    if titre not in NOTES:
        return f"Erreur : aucune note « {titre} ». Utilise rechercher_notes pour trouver le titre exact."
    del NOTES[titre]
    return f"Note « {titre} » supprimée."
```

Précautions : la suppression est **irréversible** ; dans un vrai produit, on demanderait une **confirmation** de l'utilisateur (la plupart des hôtes le permettent), on privilégierait une suppression logique (corbeille) et on journaliserait l'opération.

</details>

## Exercice 3 : Analyse de risque

Un agent dispose de trois serveurs MCP : la messagerie de l'entreprise (lecture et envoi), un navigateur web et le dossier partagé des ressources humaines. Identifiez le risque principal et proposez des mesures.

<details>
<summary>Voir la solution</summary>

Le risque principal est l'**exfiltration** : une page web visitée (contenu non fiable) peut contenir une injection de prompt demandant au modèle de lire des fichiers RH (données privées) puis de les envoyer par courriel à une adresse externe (canal de communication). L'agent réunit les trois capacités dangereuses.

Mesures : séparer les usages (pas d'accès RH pour un agent qui navigue sur le web) ; envoi de courriels limité aux adresses internes ou soumis à **confirmation humaine** ; accès RH en lecture seule et restreint ; journalisation et alertes sur les envois ; revue des serveurs installés.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Le Model Context Protocol
center: Un standard ouvert pour connecter n'importe quelle application d'IA aux outils et aux données.
points:
  - icon: puzzle
    title: M + N au lieu de M × N
    text: Chaque service est exposé une fois par un serveur MCP réutilisable.
  - icon: network
    title: Hôte, client, serveur
    text: JSON-RPC 2.0, transports stdio (local) ou Streamable HTTP (distant).
  - icon: tool
    title: Trois primitives
    text: Outils (le modèle), ressources (l'application), prompts (l'utilisateur).
  - icon: code
    title: FastMCP
    text: Docstrings et types Python deviennent descriptions et schémas ; test avec l'inspecteur.
  - icon: shield
    title: Sécurité
    text: Serveurs de confiance seulement, moindre privilège, validation des actions sensibles.
pitfall: Réunir données privées, contenu non fiable et envoi vers l'extérieur dans un même agent.
remember: "Un serveur MCP donne à un modèle le pouvoir d'agir : installez-le comme un logiciel à privilèges."
```
