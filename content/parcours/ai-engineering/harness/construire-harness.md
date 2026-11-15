---
title: "TP : Construire un harness d'agent"
description: "Écrire pas à pas un harness minimal mais complet en Python : boucle, outils de fichiers et de commandes, permissions, hooks, gestion du contexte, persistance et sous-agent."
duration: 90
objectives:
  - Implémenter une boucle d'agent avec outils, limites et streaming des étapes
  - Ajouter un système de permissions à trois niveaux et une validation humaine
  - Brancher des hooks avant et après les appels d'outils
  - Gérer le contexte (nettoyage des résultats, compaction) et persister la session
  - Déléguer une exploration à un sous-agent et évaluer le harness sur des tâches
---

# Ce que vous allez construire

Dans ce TP, vous écrivez **`mini_harness`**, un agent de programmation en ligne de commande, en environ 300 lignes de Python. Il sait lire, chercher et modifier des fichiers d'un projet, lancer des commandes (tests notamment), et il intègre tout ce que vous avez vu dans ce module :

```diagram
type: layers
title: Architecture de mini_harness
layers:
  - title: cli.py
    text: Interface en terminal, validation humaine, reprise de session
  - title: boucle.py
    text: Boucle d'agent, budget, appels d'outils, compaction
  - title: outils.py
    text: lire, chercher, lister, modifier, executer, explorer (sous-agent)
  - title: permissions.py et hooks.py
    text: Politique autoriser / demander / interdire, hooks avant et après
  - title: session.py
    text: Persistance JSON de l'historique et de l'état
```

Prérequis : Python 3.11+, une clé d'API dans `ANTHROPIC_API_KEY`, `pip install anthropic`. Le code utilise l'API d'Anthropic ; l'adapter à un autre fournisseur ne change que la fonction d'appel au modèle.

> [!CAUTION]
> Un agent qui exécute des commandes peut endommager vos fichiers. Faites ce TP dans un **dossier de test** sous Git (pour pouvoir tout annuler), idéalement dans un **conteneur** ou une machine virtuelle. Ne lancez jamais ce harness dans un dossier contenant des secrets.

# Étape 1 : Les outils

Chaque outil a une **définition** (nom, description, schéma JSON) et une **implémentation**. Tous les chemins sont confinés au dossier du projet.

```python
# outils.py
import subprocess
from pathlib import Path

RACINE = Path.cwd().resolve()
MAX_CARACTERES = 8_000


class ErreurOutil(Exception):
    """Erreur renvoyée au modèle comme résultat d'outil (is_error=True)."""


def chemin_sur(relatif: str) -> Path:
    chemin = (RACINE / relatif).resolve()
    if not chemin.is_relative_to(RACINE):
        raise ErreurOutil(f"Chemin hors du projet refusé : {relatif}")
    return chemin


def tronquer(texte: str) -> str:
    if len(texte) <= MAX_CARACTERES:
        return texte
    return texte[:MAX_CARACTERES] + f"\n[... tronqué : {len(texte)} caractères au total. Affine ta demande.]"


def lire(chemin: str, debut: int = 1, nb_lignes: int = 200) -> str:
    p = chemin_sur(chemin)
    if not p.is_file():
        raise ErreurOutil(f"Fichier introuvable : {chemin}. Utilise lister ou chercher.")
    lignes = p.read_text(encoding="utf-8", errors="replace").splitlines()
    extrait = lignes[debut - 1 : debut - 1 + nb_lignes]
    numerotees = [f"{debut + i:>5} | {l}" for i, l in enumerate(extrait)]
    suite = f"\n[{len(lignes)} lignes au total]" if len(lignes) > debut - 1 + nb_lignes else ""
    return "\n".join(numerotees) + suite


def lister(dossier: str = ".") -> str:
    p = chemin_sur(dossier)
    ignorer = {".git", "node_modules", ".venv", "__pycache__"}
    entrees = sorted(
        str(f.relative_to(RACINE)) + ("/" if f.is_dir() else "")
        for f in p.rglob("*") if not ignorer & set(f.relative_to(RACINE).parts)
    )
    return tronquer("\n".join(entrees[:300]))


def chercher(motif: str, dossier: str = ".") -> str:
    p = chemin_sur(dossier)
    res = subprocess.run(["grep", "-rn", "--exclude-dir=.git", "-I", motif, str(p)],
                         capture_output=True, text=True, timeout=30)
    sortie = res.stdout.replace(str(RACINE) + "/", "")
    return tronquer(sortie) or "Aucun résultat."


def modifier(chemin: str, ancien: str, nouveau: str) -> str:
    """Remplacement ciblé : `ancien` doit apparaître exactement une fois (ou être vide pour créer le fichier)."""
    p = chemin_sur(chemin)
    if ancien == "":
        if p.exists():
            raise ErreurOutil("Le fichier existe déjà ; fournis le texte à remplacer.")
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(nouveau, encoding="utf-8")
        return f"Fichier créé : {chemin}"
    contenu = p.read_text(encoding="utf-8")
    n = contenu.count(ancien)
    if n != 1:
        raise ErreurOutil(f"Le texte à remplacer apparaît {n} fois ; il doit être unique. Ajoute du contexte.")
    p.write_text(contenu.replace(ancien, nouveau), encoding="utf-8")
    return f"Modifié : {chemin}"


def executer(commande: str) -> str:
    res = subprocess.run(commande, shell=True, cwd=RACINE, capture_output=True, text=True, timeout=120)
    return tronquer(f"code de sortie : {res.returncode}\n--- stdout ---\n{res.stdout}\n--- stderr ---\n{res.stderr}")


IMPLEMENTATIONS = {"lire": lire, "lister": lister, "chercher": chercher, "modifier": modifier, "executer": executer}

DEFINITIONS = [
    {"name": "lister", "description": "Liste les fichiers du projet (ou d'un sous-dossier).",
     "input_schema": {"type": "object", "properties": {"dossier": {"type": "string"}}}},
    {"name": "chercher", "description": "Cherche un motif (grep) dans les fichiers ; renvoie fichier:ligne:texte.",
     "input_schema": {"type": "object", "properties": {"motif": {"type": "string"}, "dossier": {"type": "string"}},
                      "required": ["motif"]}},
    {"name": "lire", "description": "Lit un fichier, avec numéros de ligne. Utilise debut et nb_lignes pour les gros fichiers.",
     "input_schema": {"type": "object", "properties": {"chemin": {"type": "string"}, "debut": {"type": "integer"},
                                                       "nb_lignes": {"type": "integer"}}, "required": ["chemin"]}},
    {"name": "modifier", "description": "Remplace un texte unique par un autre dans un fichier. Avec ancien vide, crée le fichier.",
     "input_schema": {"type": "object", "properties": {"chemin": {"type": "string"}, "ancien": {"type": "string"},
                                                       "nouveau": {"type": "string"}},
                      "required": ["chemin", "ancien", "nouveau"]}},
    {"name": "executer", "description": "Exécute une commande shell à la racine du projet (tests, linters...).",
     "input_schema": {"type": "object", "properties": {"commande": {"type": "string"}}, "required": ["commande"]}},
]
```

Remarquez les choix de conception vus au chapitre 2 de ce module : résultats **tronqués** avec un message explicite, **erreurs actionnables**, modification par **remplacement ciblé** plutôt que réécriture complète (bien moins de tokens, et moins de risques d'effacer du code par erreur).

# Étape 2 : Permissions

Trois niveaux, évalués dans l'ordre **interdire → autoriser → demander** :

```python
# permissions.py
import fnmatch

POLITIQUE = {
    "interdire": ["lire:*.env", "lire:*.pem", "modifier:*.env", "executer:*rm -rf*", "executer:*git push*"],
    "autoriser": ["lire:*", "lister:*", "chercher:*", "executer:pytest*", "executer:git status*", "executer:git diff*"],
}


def cible(nom: str, arguments: dict) -> str:
    valeur = arguments.get("chemin") or arguments.get("commande") or arguments.get("motif") or arguments.get("dossier") or ""
    return f"{nom}:{valeur}"


def decider(nom: str, arguments: dict) -> str:
    """Renvoie 'interdire', 'autoriser' ou 'demander'."""
    c = cible(nom, arguments)
    if any(fnmatch.fnmatch(c, m) for m in POLITIQUE["interdire"]):
        return "interdire"
    if any(fnmatch.fnmatch(c, m) for m in POLITIQUE["autoriser"]):
        return "autoriser"
    return "demander"
```

> [!WARNING]
> Rappel du chapitre 1 : ces motifs sont une **première barrière**, contournable. `executer:pytest*` autorise aussi `pytest; curl ...`. Dans un vrai harness, refusez les commandes composées (`;`, `&&`, `|`, `$(`) dans la liste d'autorisation, et surtout exécutez l'agent dans une **sandbox**.

# Étape 3 : Hooks

Des fonctions appelées **avant** et **après** chaque outil. Un hook « avant » peut **bloquer** l'appel ; un hook « après » peut **compléter** le résultat.

```python
# hooks.py
import subprocess
from outils import RACINE


def interdire_commandes_composees(nom: str, arguments: dict) -> str | None:
    """Avant : renvoie un message pour bloquer, ou None pour laisser passer."""
    if nom == "executer" and any(s in arguments["commande"] for s in [";", "&&", "||", "|", "$(", "`"]):
        return "Commandes composées interdites : lance une seule commande à la fois."
    return None


def formater_python(nom: str, arguments: dict, resultat: str) -> str:
    """Après : formate les fichiers Python modifiés et le signale au modèle."""
    if nom == "modifier" and arguments["chemin"].endswith(".py"):
        res = subprocess.run(["ruff", "format", arguments["chemin"]], cwd=RACINE, capture_output=True, text=True)
        if res.returncode == 0:
            return resultat + " (formaté avec ruff)"
    return resultat


HOOKS_AVANT = [interdire_commandes_composees]
HOOKS_APRES = [formater_python]
```

# Étape 4 : La boucle

C'est le cœur du harness : budget, appel du modèle, exécution des outils avec permissions et hooks, gestion du contexte.

```python
# boucle.py
import json
import anthropic
from outils import DEFINITIONS, IMPLEMENTATIONS, ErreurOutil
from permissions import decider
from hooks import HOOKS_AVANT, HOOKS_APRES

MODELE = "claude-opus-5-5"
FENETRE = 200_000
SYSTEME = """Tu es un agent de programmation qui travaille dans le projet courant.
- Explore avant de modifier : lister, chercher, puis lire les fichiers pertinents.
- Fais des modifications ciblées et lance les tests après chaque changement.
- Ne déclare une tâche terminée qu'après avoir vérifié qu'elle fonctionne (tests verts).
- Si une action est refusée, adapte-toi ou demande des précisions ; n'insiste pas.
- Termine par un court compte rendu : ce qui a été fait, comment c'est vérifié, ce qui reste."""

client = anthropic.Anthropic()


def executer_outil(nom: str, arguments: dict, demander_validation) -> tuple[str, bool]:
    """Renvoie (contenu, est_erreur)."""
    decision = decider(nom, arguments)
    if decision == "interdire":
        return "Action interdite par la politique de sécurité.", True
    if decision == "demander" and not demander_validation(nom, arguments):
        return "Action refusée par l'utilisateur.", True
    for hook in HOOKS_AVANT:
        if (blocage := hook(nom, arguments)) is not None:
            return blocage, True
    try:
        resultat = IMPLEMENTATIONS[nom](**arguments)
    except ErreurOutil as e:
        return str(e), True
    except Exception as e:  # erreur inattendue : on informe le modèle sans planter la boucle
        return f"Erreur inattendue ({type(e).__name__}) : {e}", True
    for hook in HOOKS_APRES:
        resultat = hook(nom, arguments, resultat)
    return resultat, False


def nettoyer_anciens_resultats(messages: list[dict], garder: int = 4) -> None:
    resultats = [b for m in messages if m["role"] == "user" and isinstance(m["content"], list)
                 for b in m["content"] if b.get("type") == "tool_result"]
    for b in resultats[:-garder]:
        b["content"] = "[ancien résultat retiré du contexte]"


def tour(session, demander_validation, afficher, max_iterations: int = 30) -> None:
    """Fait travailler l'agent jusqu'à la fin de la tâche ou d'une limite."""
    for _ in range(max_iterations):
        reponse = client.messages.create(
            model=MODELE, max_tokens=8_000, system=SYSTEME, tools=DEFINITIONS, messages=session.messages,
        )
        session.tokens += reponse.usage.input_tokens + reponse.usage.output_tokens
        session.messages.append({"role": "assistant", "content": [b.model_dump() for b in reponse.content]})

        for bloc in reponse.content:
            if bloc.type == "text":
                afficher("agent", bloc.text)
        if reponse.stop_reason != "tool_use":
            session.sauvegarder()
            return

        resultats = []
        for bloc in reponse.content:
            if bloc.type == "tool_use":
                afficher("outil", f"{bloc.name} {json.dumps(bloc.input, ensure_ascii=False)[:120]}")
                contenu, erreur = executer_outil(bloc.name, bloc.input, demander_validation)
                resultats.append({"type": "tool_result", "tool_use_id": bloc.id, "content": contenu, "is_error": erreur})
        session.messages.append({"role": "user", "content": resultats})

        nettoyer_anciens_resultats(session.messages)
        if reponse.usage.input_tokens > 0.7 * FENETRE:
            session.compacter(client, MODELE)
        session.sauvegarder()  # point de reprise après chaque étape
    afficher("harness", f"Limite de {max_iterations} itérations atteinte : tâche interrompue, voir le compte rendu ci-dessus.")
```

# Étape 5 : Session, compaction et reprise

```python
# session.py
import json
from dataclasses import dataclass, field, asdict
from pathlib import Path

DOSSIER = Path(".mini_harness")

PROMPT_COMPACTION = """Résume cette session pour qu'elle puisse continuer sans l'historique.
Conserve : la demande et les contraintes de l'utilisateur, les décisions, les fichiers modifiés,
l'état des tests, ce qui reste à faire, les erreurs rencontrées. Omets les résultats bruts."""


@dataclass
class Session:
    id: str
    messages: list[dict] = field(default_factory=list)
    tokens: int = 0

    @property
    def fichier(self) -> Path:
        return DOSSIER / f"{self.id}.json"

    def sauvegarder(self) -> None:
        DOSSIER.mkdir(exist_ok=True)
        self.fichier.write_text(json.dumps(asdict(self), ensure_ascii=False, indent=1), encoding="utf-8")

    @classmethod
    def charger(cls, id: str) -> "Session":
        chemin = DOSSIER / f"{id}.json"
        return cls(**json.loads(chemin.read_text(encoding="utf-8"))) if chemin.exists() else cls(id=id)

    def compacter(self, client, modele: str) -> None:
        # On ne compacte qu'après un résultat d'outil complet : l'historique se termine par un message « user ».
        resume = client.messages.create(
            model=modele, max_tokens=3_000,
            messages=self.messages + [{"role": "user", "content": [{"type": "text", "text": PROMPT_COMPACTION}]}],
        ).content[0].text
        # Le dernier message contient des tool_result qui référencent l'appel précédent : on ne peut pas
        # le garder seul. On repart donc du résumé uniquement.
        self.messages = [{"role": "user", "content": f"<resume_session>\n{resume}\n</resume_session>\nPoursuis la tâche."}]
```

Notez la subtilité signalée en commentaire : un résultat d'outil doit **toujours** suivre l'appel qui l'a demandé. Lors de la compaction, on ne peut pas garder un `tool_result` dont l'appel a été résumé.

```python
# cli.py
import sys
import uuid
from session import Session
from boucle import tour


def demander_validation(nom: str, arguments: dict) -> bool:
    print(f"\n⚠  L'agent veut exécuter : {nom}")
    for cle, valeur in arguments.items():
        print(f"   {cle} = {str(valeur)[:300]}")
    return input("   Autoriser ? [o/N] ").strip().lower() == "o"


def afficher(source: str, texte: str) -> None:
    prefixe = {"agent": "🤖", "outil": "🔧", "harness": "⛔"}[source]
    print(f"{prefixe} {texte}")


def main() -> None:
    session = Session.charger(sys.argv[1]) if len(sys.argv) > 1 else Session(id=uuid.uuid4().hex[:8])
    print(f"Session {session.id} (reprendre avec : python cli.py {session.id})")
    while (demande := input("\nVous > ").strip()) not in {"", "quitter"}:
        session.messages.append({"role": "user", "content": demande})
        tour(session, demander_validation, afficher)
        print(f"[tokens consommés depuis le début : {session.tokens:,}]")


if __name__ == "__main__":
    main()
```

# Étape 6 : Un sous-agent d'exploration

Ajoutez un outil `explorer` qui lance un **sous-agent en lecture seule**, avec son propre contexte, et ne renvoie que son compte rendu :

```python
# à ajouter dans outils.py
LECTURE_SEULE = [d for d in DEFINITIONS if d["name"] in {"lister", "chercher", "lire"}]


def explorer(question: str) -> str:
    import anthropic
    client = anthropic.Anthropic()
    messages = [{"role": "user", "content": question}]
    systeme = ("Tu explores un projet en lecture seule pour répondre à une question. "
               "Réponds en 15 lignes maximum : fichiers et fonctions concernés (avec numéros de ligne), "
               "et comment ils s'articulent.")
    for _ in range(15):
        r = client.messages.create(model="claude-opus-5-5", max_tokens=2_000, system=systeme,
                                   tools=LECTURE_SEULE, messages=messages)
        messages.append({"role": "assistant", "content": [b.model_dump() for b in r.content]})
        if r.stop_reason != "tool_use":
            return "".join(b.text for b in r.content if b.type == "text")
        resultats = []
        for b in r.content:
            if b.type == "tool_use":
                try:
                    contenu, erreur = IMPLEMENTATIONS[b.name](**b.input), False
                except ErreurOutil as e:
                    contenu, erreur = str(e), True
                resultats.append({"type": "tool_result", "tool_use_id": b.id, "content": contenu, "is_error": erreur})
        messages.append({"role": "user", "content": resultats})
    return "Exploration interrompue (limite atteinte) ; résultats partiels non disponibles."


IMPLEMENTATIONS["explorer"] = explorer
DEFINITIONS.append({
    "name": "explorer",
    "description": ("Délègue une exploration du code à un sous-agent en lecture seule et renvoie un résumé court. "
                     "À utiliser pour les questions qui demandent de lire beaucoup de fichiers."),
    "input_schema": {"type": "object", "properties": {"question": {"type": "string"}}, "required": ["question"]},
})
```

Ajoutez `"explorer:*"` à la liste `autoriser` de la politique : le sous-agent ne dispose que d'outils de lecture.

> [!TIP]
> Comparez, sur une même question (« Où et comment est gérée l'authentification ? »), le nombre de tokens consommés par l'agent principal **avec** et **sans** l'outil `explorer`. Vous verrez concrètement l'effet de l'isolation du contexte.

# Évaluer votre harness

Un harness s'évalue comme un agent (module 8) : sur un **jeu de tâches**, chacune exécutée **plusieurs fois**. Préparez un petit projet Python de test (une dizaine de fichiers, des tests `pytest`) et cinq tâches vérifiables automatiquement :

| Tâche | Vérification automatique |
|---|---|
| Corriger un bug signalé par un test qui échoue | Le test passe, les autres aussi |
| Ajouter une fonction avec ses tests | Nouveaux tests présents et verts |
| Renommer une fonction utilisée dans 6 fichiers | Plus aucune occurrence de l'ancien nom, tests verts |
| Répondre à une question sur le code (sans modifier) | Aucun fichier modifié ; réponse correcte (grille) |
| Une tâche impossible (« utilise la bibliothèque X », absente) | L'agent le signale au lieu d'inventer |

Mesurez pour chaque tâche : **taux de réussite** sur 3 à 5 exécutions, **tokens** consommés, **nombre d'itérations**, **validations demandées**. Puis améliorez **une chose à la fois** (prompt système, description d'un outil, seuil de nettoyage) et mesurez à nouveau.

# Exercices

## Exercice 1 : Fermer une faille

Avec la politique de l'étape 2, montrez une commande que l'agent pourrait exécuter sans validation et qui lit le fichier `.env`. Puis proposez deux corrections : l'une dans le harness, l'autre dans l'environnement.

<details>
<summary>Voir la solution</summary>

`executer:pytest*` autorise toute commande qui **commence** par `pytest`. Sans le hook de l'étape 3, `pytest; cat .env` passe sans validation. Même avec le hook, il reste une voie détournée : l'agent crée un fichier `test_x.py` qui lit et affiche `.env`, puis lance `pytest -s test_x.py`, qui est autorisé d'office. La création du fichier demande une validation, mais un utilisateur fatigué peut l'accepter sans lire.

- **Harness** : autoriser uniquement des commandes **exactes** ou analysées (découpées avec `shlex.split`, vérification du programme **et** des arguments), refuser les commandes composées, et marquer comme « demander » toute création de fichier de test.
- **Environnement** : ne pas avoir de `.env` contenant de vrais secrets dans le dossier de travail de l'agent, et exécuter l'agent dans un conteneur sans accès réseau sortant, même s'il lit un secret, il ne peut pas l'exfiltrer.

</details>

## Exercice 2 : Un hook de fin de tâche

Écrivez la logique d'un hook « fin de tâche » : quand le modèle s'arrête (`stop_reason` différent de `tool_use`), le harness lance `pytest -q` ; si les tests échouent, il renvoie l'agent au travail avec la sortie des tests, au maximum deux fois.

<details>
<summary>Voir la solution</summary>

```python
import subprocess

def verifier_fin(session, relances: int) -> bool:
    """Renvoie True si l'agent doit reprendre le travail."""
    if relances >= 2:
        return False
    res = subprocess.run(["pytest", "-q"], capture_output=True, text=True, timeout=300)
    if res.returncode == 0:
        return False
    session.messages.append({"role": "user", "content":
        "Vérification automatique : les tests échouent. Corrige avant de conclure.\n" + res.stdout[-4000:]})
    return True
```

Dans `tour`, à la place du `return` quand `stop_reason != "tool_use"` : `if verifier_fin(session, relances): relances += 1; continue` puis `return`. On évite ainsi l'échec classique de l'agent qui déclare victoire trop tôt, sans boucle infinie grâce au plafond de relances.

</details>

## Exercice 3 : Mesurer l'effet d'un changement

Votre harness réussit 11 exécutions sur 15 (5 tâches × 3 exécutions). Vous modifiez la description de l'outil `modifier` et obtenez 13 sur 15. Pouvez-vous conclure que la nouvelle description est meilleure ? Que faire ?

<details>
<summary>Voir la solution</summary>

Non, pas avec certitude : sur 15 essais, passer de 11 à 13 succès peut s'expliquer par la variabilité (module 8, bruit statistique). Il faut :

- **augmenter le nombre d'exécutions** (par exemple 10 par tâche) et, si possible, le nombre de tâches ;
- regarder **quelles** tâches ont changé : si les échecs disparus sont précisément ceux liés aux modifications de fichiers (texte à remplacer non unique), c'est un indice fort ;
- **lire les traces** des échecs restants avant de modifier autre chose.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Construire un harness
center: Trois cents lignes suffisent pour un agent complet, si chaque brique est pensée.
points:
  - icon: tool
    title: Outils sobres
    text: Chemins confinés, résultats tronqués, erreurs actionnables, modifications ciblées.
  - icon: lock
    title: Permissions
    text: Interdire, puis autoriser, sinon demander, et ne pas s'y fier seul.
  - icon: zap
    title: Hooks
    text: Bloquer avant, compléter après, vérifier à la fin (tests).
  - icon: database
    title: Session persistée
    text: Sauvegarde après chaque étape, reprise par identifiant, compaction sûre.
  - icon: users
    title: Sous-agent
    text: Exploration en lecture seule dans son propre contexte, résumé en retour.
  - icon: test
    title: Évaluer
    text: Tâches vérifiables, plusieurs exécutions, un changement à la fois.
pitfall: "Garder un résultat d'outil sans l'appel qui l'a produit lors de la compaction : l'historique devient invalide."
remember: Construire un harness une fois, c'est comprendre tout ce que configurent les agents du marché.
```
