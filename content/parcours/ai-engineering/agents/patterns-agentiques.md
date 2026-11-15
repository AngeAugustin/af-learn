---
title: Les patterns de workflows et d'agents
description: "Chaînage, routage, parallélisation, orchestrateur-exécutants et évaluateur-optimiseur : cinq patterns éprouvés, avec leur implémentation."
duration: 60
objectives:
  - Reconnaître les cinq patterns de workflows les plus courants
  - Implémenter un chaînage avec étape de contrôle, un routage et une parallélisation
  - Construire une boucle évaluateur-optimiseur
  - Choisir le pattern adapté à un problème
---

# Cinq patterns éprouvés

L'article *Building effective agents* d'Anthropic décrit cinq patterns de workflows qui couvrent une grande partie des besoins réels. Ils se combinent librement. Dans les exemples, on suppose une petite fonction utilitaire :

```python
import anthropic

client = anthropic.Anthropic()


def appeler(prompt: str, systeme: str = "", modele: str = "claude-opus-5-5", max_tokens: int = 2048) -> str:
    reponse = client.messages.create(
        model=modele,
        max_tokens=max_tokens,
        system=systeme,
        messages=[{"role": "user", "content": prompt}],
    )
    return "".join(b.text for b in reponse.content if b.type == "text")
```

```diagram
type: layers
title: Les cinq patterns
layers:
  - title: Chaînage de prompts
    text: Une suite d'étapes, chacune traitant la sortie de la précédente, avec des contrôles entre les étapes
  - title: Routage
    text: Une classification oriente la demande vers le traitement spécialisé adapté
  - title: Parallélisation
    text: Plusieurs appels simultanés, sous-tâches indépendantes, ou votes multiples
  - title: Orchestrateur-exécutants
    text: Un modèle planifie dynamiquement des sous-tâches et délègue à des exécutants
  - title: Évaluateur-optimiseur
    text: Un modèle produit, un autre évalue et renvoie des critiques, en boucle
```

# Chaînage et routage

## Le chaînage de prompts

On décompose une tâche en **étapes fixes**, chaque appel traitant la sortie du précédent. Entre deux étapes, on peut insérer des **contrôles** (*gates*) programmatiques qui vérifient que tout se passe bien.

```diagram
type: flow
title: Chaînage avec contrôle
steps:
  - title: Étape 1
    text: Rédiger le plan d'un article
  - title: Contrôle
    text: Le plan contient-il 3 à 6 parties ? Sinon, arrêt ou nouvel essai
    tone: amber
  - title: Étape 2
    text: Rédiger l'article à partir du plan
  - title: Étape 3
    text: Traduire l'article
```

```python
def article_traduit(sujet: str) -> str:
    plan = appeler(f"Rédige le plan d'un article de blog sur : {sujet}. "
                   "Une partie par ligne, commençant par « - ». Entre 3 et 6 parties.")
    parties = [ligne for ligne in plan.splitlines() if ligne.strip().startswith("-")]
    if not 3 <= len(parties) <= 6:  # contrôle programmatique
        raise ValueError(f"Plan invalide ({len(parties)} parties)")
    article = appeler(f"Rédige un article de blog d'environ 600 mots suivant ce plan :\n{plan}")
    return appeler(f"Traduis cet article en anglais, en conservant la mise en forme :\n\n{article}")
```

**Quand l'utiliser :** la tâche se découpe naturellement en sous-tâches fixes. On échange un peu de latence contre une meilleure qualité, car chaque appel a une tâche plus simple.

## Le routage

Une première étape **classe** la demande, puis l'oriente vers un traitement spécialisé : prompt différent, outils différents, voire modèle différent.

```python
CATEGORIES = {"facturation", "technique", "commercial", "autre"}

PROMPTS = {
    "facturation": "Tu es un expert de la facturation. ...",
    "technique": "Tu es un technicien support niveau 2. ...",
    "commercial": "Tu es un conseiller commercial. ...",
    "autre": "Tu es un agent d'accueil. Oriente le client vers le bon service.",
}


def traiter(demande: str) -> str:
    categorie = appeler(
        f"Classe cette demande dans une catégorie parmi {sorted(CATEGORIES)}. "
        f"Réponds par un seul mot.\n\n<demande>{demande}</demande>",
        modele="claude-haiku-5-5",   # classification simple : un petit modèle rapide suffit souvent
        max_tokens=1024,
    ).strip().lower()
    if categorie not in CATEGORIES:  # repli sûr
        categorie = "autre"
    return appeler(demande, systeme=PROMPTS[categorie])
```

**Quand l'utiliser :** des catégories de demandes bien distinctes, qui gagnent à être traitées séparément. Le routage permet aussi d'envoyer les questions simples à un modèle économique et les complexes à un modèle plus capable. *(Pour une classification fiable en production, on utilisera une sortie structurée avec une liste fermée.)*

# Parallélisation

On lance plusieurs appels **simultanément**, puis on agrège les résultats. Deux variantes :

- **Sectionnement** : des sous-tâches **indépendantes** traitées en parallèle. Par exemple, analyser un contrat sous quatre angles (juridique, financier, délais, risques) avec quatre appels spécialisés.
- **Vote** : la **même** tâche exécutée plusieurs fois, pour obtenir plusieurs avis et décider à la majorité ou avec un seuil. Par exemple, trois évaluations indépendantes de la conformité d'un contenu.

```python
import asyncio
import anthropic

client_async = anthropic.AsyncAnthropic()


async def appeler_async(prompt: str) -> str:
    reponse = await client_async.messages.create(
        model="claude-opus-5-5", max_tokens=2048,
        messages=[{"role": "user", "content": prompt}],
    )
    return "".join(b.text for b in reponse.content if b.type == "text")


async def analyser_contrat(contrat: str) -> dict[str, str]:
    angles = ["obligations juridiques", "conditions financières", "délais et échéances", "risques principaux"]
    resultats = await asyncio.gather(*(
        appeler_async(f"Analyse ce contrat sous l'angle : {angle}. Sois factuel et cite les articles.\n\n{contrat}")
        for angle in angles
    ))
    return dict(zip(angles, resultats))
```

**Quand l'utiliser :** pour gagner du **temps** (sous-tâches indépendantes) ou de la **fiabilité** (vote). Chaque appel a un contexte plus ciblé, ce qui améliore souvent la qualité sur chaque aspect.

# Orchestrateur-exécutants

Un modèle **orchestrateur** analyse la tâche, décide **dynamiquement** des sous-tâches nécessaires, les délègue à des **exécutants**, puis synthétise leurs résultats. La différence avec la parallélisation : les sous-tâches ne sont **pas connues à l'avance**.

```diagram
type: flow
title: Orchestrateur-exécutants
steps:
  - title: Demande
    text: "« Mets à jour la documentation pour la nouvelle API »"
  - title: Orchestrateur
    text: Identifie les fichiers concernés et planifie les modifications
  - title: Exécutants
    text: Un appel par fichier à modifier, en parallèle
  - title: Synthèse
    text: L'orchestrateur assemble et vérifie le résultat
```

```python
from pydantic import BaseModel


class Plan(BaseModel):
    sous_taches: list[str]


def orchestrer(tache: str, contexte: str) -> str:
    plan = client.messages.parse(
        model="claude-opus-5-5", max_tokens=4096, output_format=Plan,
        messages=[{"role": "user", "content":
                   f"Décompose cette tâche en sous-tâches indépendantes (3 à 8).\n"
                   f"Tâche : {tache}\n\nContexte :\n{contexte}"}],
    ).parsed_output
    resultats = [appeler(f"Réalise cette sous-tâche.\nSous-tâche : {st}\n\nContexte :\n{contexte}")
                 for st in plan.sous_taches[:8]]  # limite de sécurité
    rapports = "\n\n".join(f"<resultat sous_tache='{st}'>\n{r}\n</resultat>"
                           for st, r in zip(plan.sous_taches, resultats))
    return appeler(f"Assemble ces résultats en une réponse cohérente à la tâche : {tache}\n\n{rapports}")
```

**Quand l'utiliser :** des tâches complexes dont la décomposition dépend de l'entrée (recherche d'informations dans plusieurs sources, modifications de plusieurs fichiers). C'est aussi le principe des systèmes **multi-agents** (chapitre 4).

# Évaluateur-optimiseur

Un modèle **produit** une réponse, un autre l'**évalue** selon des critères précis et renvoie des critiques ; le premier **améliore** sa réponse. On boucle jusqu'à ce que l'évaluateur valide ou qu'une limite soit atteinte.

```diagram
type: flow
title: Boucle évaluateur-optimiseur
loop: Au plus N itérations
steps:
  - title: Générateur
    text: Produit ou révise la réponse
  - title: Évaluateur
    text: Vérifie les critères et rédige des critiques précises
  - title: Décision
    text: Validé → fin ; sinon les critiques repartent vers le générateur
```

```python
class Evaluation(BaseModel):
    valide: bool
    critiques: list[str]


CRITERES = """- Le texte fait moins de 120 mots.
- Il mentionne le prix et la date de disponibilité.
- Le ton est enthousiaste mais sans superlatifs exagérés."""


def rediger_avec_revision(brief: str, max_iterations: int = 3) -> str:
    texte = appeler(f"Rédige une annonce produit.\nBrief : {brief}\nCritères :\n{CRITERES}")
    for _ in range(max_iterations):
        evaluation = client.messages.parse(
            model="claude-opus-5-5", max_tokens=2048, output_format=Evaluation,
            messages=[{"role": "user", "content":
                       f"Évalue ce texte selon les critères. Sois strict et précis.\n"
                       f"Critères :\n{CRITERES}\n\n<texte>\n{texte}\n</texte>"}],
        ).parsed_output
        if evaluation.valide:
            break
        texte = appeler(f"Révise ce texte pour corriger ces critiques :\n- "
                        + "\n- ".join(evaluation.critiques)
                        + f"\n\nCritères :\n{CRITERES}\n\n<texte>\n{texte}\n</texte>")
    return texte
```

**Quand l'utiliser :** des critères d'évaluation **clairs**, et une amélioration démontrable par itération (traduction nuancée, respect de contraintes de format, code qui doit passer des tests). Certains critères, comme le nombre de mots, se vérifient mieux **par du code** que par un modèle : préférez toujours une vérification programmatique quand elle est possible.

# Exercices

## Exercice 1 : Identifier le pattern

Quel pattern (ou combinaison) correspond le mieux à chaque besoin ?

1. Répondre aux courriels clients avec des traitements très différents selon qu'il s'agit d'une réclamation, d'une question technique ou d'une demande de devis.
2. Générer une description produit, la vérifier par rapport à une charte éditoriale, et la corriger jusqu'à conformité.
3. Évaluer la sécurité d'un extrait de code en demandant trois analyses indépendantes et en signalant un problème si au moins deux le détectent.
4. Rédiger un rapport de veille à partir d'un nombre variable de sources à identifier selon le sujet.

<details>
<summary>Voir la solution</summary>

1. **Routage**.
2. **Évaluateur-optimiseur** (éventuellement précédé d'un chaînage).
3. **Parallélisation, variante vote**.
4. **Orchestrateur-exécutants** : les sources et donc les sous-tâches dépendent du sujet.

</details>

## Exercice 2 : Ajouter un contrôle

Dans la fonction `article_traduit`, ajoutez un second contrôle après la rédaction : l'article doit compter entre 400 et 800 mots ; sinon, on redemande une fois une version ajustée.

<details>
<summary>Voir la solution</summary>

```python
def article_traduit(sujet: str) -> str:
    plan = appeler(f"Rédige le plan d'un article de blog sur : {sujet}. "
                   "Une partie par ligne, commençant par « - ». Entre 3 et 6 parties.")
    parties = [l for l in plan.splitlines() if l.strip().startswith("-")]
    if not 3 <= len(parties) <= 6:
        raise ValueError("Plan invalide")
    article = appeler(f"Rédige un article de blog d'environ 600 mots suivant ce plan :\n{plan}")
    nb_mots = len(article.split())
    if not 400 <= nb_mots <= 800:
        article = appeler(f"Cet article fait {nb_mots} mots. Réécris-le pour qu'il fasse "
                          f"entre 500 et 700 mots, sans changer le plan :\n\n{article}")
        if not 400 <= len(article.split()) <= 800:
            raise ValueError("Longueur toujours hors limites")
    return appeler(f"Traduis cet article en anglais, en conservant la mise en forme :\n\n{article}")
```

Le comptage des mots est fait **par du code**, pas par le modèle : c'est fiable et gratuit.

</details>

## Exercice 3 : Concevoir un workflow

Concevez (schéma ou pseudo-code) un workflow qui traite des CV reçus pour une offre d'emploi : extraction des informations, vérification des critères obligatoires, notation, et rédaction d'un résumé pour le recruteur. Quels patterns utilisez-vous et où placez-vous des contrôles ? Quelle précaution particulière prenez-vous ?

<details>
<summary>Voir une proposition de solution</summary>

1. **Extraction** en sortie structurée (diplômes, expériences, compétences, langues) → **contrôle** : validation Pydantic.
2. **Vérification des critères obligatoires** : idéalement **par du code** à partir des données extraites (par exemple « permis B requis »).
3. **Notation** selon une grille explicite, éventuellement en **parallèle** par critère, ou en **vote** pour plus de stabilité.
4. **Résumé** pour le recruteur, citant les éléments du CV.

Précaution essentielle : le recrutement est un domaine **sensible** (risques de discrimination, réglementation sur les décisions automatisées, par exemple le RGPD en Europe et l'AI Act de l'Union européenne qui classe les systèmes d'IA utilisés pour le recrutement parmi les systèmes à haut risque). Le système doit **aider** le recruteur, pas décider à sa place ; il faut exclure les critères discriminatoires, évaluer les biais, documenter le fonctionnement et garder une **décision humaine**.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Les patterns de workflows et d'agents
center: Cinq patterns éprouvés couvrent l'essentiel des besoins réels et se combinent librement.
points:
  - icon: link
    title: Chaînage
    text: Des étapes fixes avec des contrôles programmatiques entre elles.
  - icon: compass
    title: Routage
    text: Classer la demande puis l'orienter vers le traitement ou le modèle adapté.
  - icon: zap
    title: Parallélisation
    text: Sectionnement pour gagner du temps, vote pour gagner en fiabilité.
  - icon: users
    title: Orchestrateur-exécutants
    text: Sous-tâches décidées dynamiquement, déléguées puis synthétisées.
  - icon: loop
    title: Évaluateur-optimiseur
    text: Un modèle produit, un autre critique, jusqu'à validation ou limite.
pitfall: Faire vérifier par un modèle ce qu'une ligne de code vérifie gratuitement (nombre de mots, format).
remember: Choisissez le pattern le plus simple qui résout le problème et prévoyez toujours un repli sûr.
```
