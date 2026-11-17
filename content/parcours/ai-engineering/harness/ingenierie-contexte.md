---
title: L'ingénierie du contexte
description: "Fournir au modèle, à chaque étape, le plus petit ensemble d'informations utiles : budget de contexte, récupération juste-à-temps, compaction, notes structurées et défaillances typiques."
duration: 60
objectives:
  - Expliquer pourquoi le contexte est une ressource limitée même avec de très grandes fenêtres
  - Décomposer le contexte d'un agent et mesurer la part de chaque élément
  - Choisir entre préchargement et récupération juste-à-temps
  - Mettre en œuvre compaction, nettoyage des résultats d'outils et notes structurées
  - Reconnaître et corriger les défaillances de contexte (empoisonnement, distraction, confusion, contradiction)
---

# Du prompt au contexte

Le **prompt engineering** (module 4) consiste à bien rédiger une requête. Pour un agent qui enchaîne des dizaines d'appels, la question devient plus large : **qu'est-ce que le modèle doit voir à cette étape précise ?** Instructions, outils, historique, résultats d'outils, mémoire, documents, tout ce qui entre dans la fenêtre à un instant donné forme le **contexte**.

L'**ingénierie du contexte** (*context engineering*) est la discipline qui consiste à **construire ce contexte à chaque étape** pour qu'il contienne **le plus petit ensemble d'informations à fort signal** permettant au modèle de bien décider.

> [!IMPORTANT]
> L'objectif n'est pas de remplir la fenêtre, mais de la **remplir juste**. Ajouter de l'information n'est jamais gratuit : chaque token coûte de l'argent, de la latence et un peu d'attention du modèle.

# Le contexte est une ressource limitée

Les fenêtres de contexte atteignent des centaines de milliers, voire des millions de tokens. Pourtant, il ne faut pas les remplir sans compter :

- **Le coût et la latence** croissent avec la taille du contexte, à **chaque** appel (et un agent fait beaucoup d'appels).
- **L'attention se dilue.** Le mécanisme d'attention (module 3) met chaque token en relation avec tous les autres. Plus il y a de tokens, plus l'information utile est « noyée ». Des études ont montré que les performances baissent quand l'information pertinente est au **milieu** d'un long contexte (*lost in the middle*, Liu et al., 2023), et plus généralement que la qualité se dégrade à mesure que le contexte s'allonge, même bien avant la limite : phénomène surnommé *context rot*.
- **Les éléments non pertinents distraient** : un document hors sujet, un ancien résultat d'outil ou une tentative ratée peuvent orienter le modèle dans la mauvaise direction.

On peut donc raisonner en **budget d'attention** : chaque élément du contexte doit « mériter sa place ».

# Anatomie du contexte d'un agent

```diagram
type: stack
title: Exemple de contexte d'un agent de support après 25 étapes (en milliers de tokens)
segments:
  - label: Prompt système
    value: 3
    tone: violet
  - label: Définitions d'outils
    value: 6
    tone: blue
  - label: Instructions et mémoire
    value: 2
    tone: teal
  - label: Messages échangés
    value: 4
    tone: amber
  - label: Résultats d'outils
    value: 45
    tone: rose
    text: Souvent la plus grosse part, et la plus facile à réduire
```

Le premier réflexe est de **mesurer** : journalisez, pour chaque appel, le nombre de tokens de chaque partie. On découvre presque toujours que les **résultats d'outils** dominent.

```python
def bilan_contexte(systeme: str, outils: list[dict], messages: list[dict], compter) -> dict:
    """Répartition approximative des tokens du contexte. `compter` renvoie le nombre de tokens d'un texte."""
    bilan = {"systeme": compter(systeme), "outils": compter(str(outils)), "messages": 0, "resultats_outils": 0}
    for m in messages:
        blocs = m["content"] if isinstance(m["content"], list) else [{"type": "text", "text": m["content"]}]
        for b in blocs:
            cle = "resultats_outils" if b.get("type") == "tool_result" else "messages"
            bilan[cle] += compter(str(b.get("content", b.get("text", b.get("input", "")))))
    return bilan
```

> [!TIP]
> Les API des fournisseurs proposent généralement un comptage exact des tokens d'une requête avant de l'envoyer, et renvoient la consommation réelle dans chaque réponse. Utilisez-les plutôt qu'une estimation.

```video
url: https://www.youtube.com/watch?v=BwXremQ-i6I
title: "Context Engineering for AI Agents: 4 Failure Modes to Avoid"
channel: "IBM Technology"
duration: "10:21"
lang: en
why: "Quatre façons dont le contexte d'un agent se dégrade (empoisonnement, distraction, confusion, conflit), par IBM Technology."
```

# Les principes de construction

## Des instructions à la bonne altitude

Un prompt système d'agent échoue de deux façons opposées :

- **trop bas** : une logique codée en dur (« si le client dit X, réponds Y »), fragile et interminable ;
- **trop haut** : des généralités (« sois utile et précis ») qui ne guident aucune décision.

La bonne altitude donne des **principes et des heuristiques** assez précis pour orienter le comportement, assez généraux pour s'appliquer à des cas imprévus. Organisez-le en sections claires (rôle, contexte, outils, règles, format) et commencez **minimal**, puis ajoutez des consignes **en réponse à des échecs observés**.

## Des outils économes en contexte

Les outils sont la principale source de tokens. Concevez-les pour renvoyer **peu mais utile** :

- filtrage et **pagination** (`limite`, `curseur`), avec un défaut raisonnable ;
- **troncature explicite** : « 2 340 résultats ; affichage des 20 premiers ; affinez avec `service` » ;
- champs **utiles uniquement** (pas d'identifiants internes inutiles, pas de HTML brut) ;
- un paramètre de **verbosité** (`format: "concis" | "detaille"`) quand les deux usages existent ;
- des **erreurs actionnables** : dire au modèle quoi faire autrement.

## Peu d'exemples, mais typiques

Plutôt qu'une longue liste de cas particuliers, quelques **exemples canoniques**, variés, qui montrent le comportement attendu.

# Précharger ou récupérer juste à temps ?

Deux stratégies pour donner de l'information au modèle :

```diagram
type: compare
title: Deux façons d'apporter l'information
columns:
  - title: Préchargement
    tone: blue
    items:
      - On récupère d'avance ce qui semble utile (RAG classique) et on le place dans le contexte
      - Rapide, une seule étape
      - Risque d'inclure du bruit ou de rater l'essentiel
  - title: Juste à temps
    tone: teal
    items:
      - "L'agent garde des références légères (chemins, identifiants, requêtes) et charge le contenu via ses outils quand il en a besoin"
      - Contexte ciblé, exploration progressive
      - Plus lent, dépend de la qualité des outils
```

Un agent de programmation illustre bien la seconde : il ne charge pas tout le dépôt, il **liste** les fichiers, **cherche** un mot-clé, **lit** les quelques fichiers pertinents. Les noms de fichiers, la structure des dossiers, la date de modification sont autant de **métadonnées** qui l'aident à décider quoi lire.

En pratique, on **combine** : précharger ce qui est presque toujours utile et petit (instructions du projet, profil de l'utilisateur), laisser l'agent récupérer le reste.

# Les techniques pour les longues tâches

## Nettoyer les anciens résultats d'outils

Un résultat d'outil déjà exploité n'a souvent plus besoin d'être conservé en entier. On peut le remplacer par un marqueur :

```python
def nettoyer_resultats(messages: list[dict], garder_derniers: int = 3) -> list[dict]:
    """Remplace le contenu des anciens résultats d'outils par un marqueur court."""
    positions = [
        (i, j) for i, m in enumerate(messages) if isinstance(m["content"], list)
        for j, b in enumerate(m["content"]) if b.get("type") == "tool_result"
    ]
    for i, j in positions[:-garder_derniers]:
        messages[i]["content"][j] = {
            **messages[i]["content"][j],
            "content": "[Résultat retiré du contexte - relancer l'outil si nécessaire]",
        }
    return messages
```

C'est la forme de compaction la plus sûre : l'appel d'outil reste visible (le modèle sait qu'il l'a fait), seul le volumineux résultat disparaît.

## La compaction

Quand le contexte approche d'un seuil (par exemple 70 à 80 % de la fenêtre), on demande au modèle de **résumer** la session, puis on repart d'un contexte neuf contenant ce résumé et les derniers échanges.

```python
PROMPT_COMPACTION = """Résume cette session de travail pour qu'un agent puisse la poursuivre
sans l'historique complet. Conserve impérativement :
- l'objectif et les contraintes données par l'utilisateur ;
- les décisions prises et leur justification ;
- l'état d'avancement : fait, en cours, reste à faire ;
- les fichiers, identifiants et valeurs exactes encore utiles ;
- les erreurs rencontrées et ce qui a été essayé sans succès.
Omets les résultats d'outils bruts et les tentatives sans intérêt."""


def compacter_si_necessaire(client, modele: str, messages: list[dict], tokens: int, limite: int) -> list[dict]:
    if tokens < 0.75 * limite:
        return messages
    resume = client.messages.create(
        model=modele, max_tokens=2000,
        messages=messages + [{"role": "user", "content": PROMPT_COMPACTION}],
    ).content[0].text
    derniers = messages[-4:]  # garder les échanges les plus récents tels quels
    return [{"role": "user", "content": f"<resume_session>\n{resume}\n</resume_session>"}] + derniers
```

> [!WARNING]
> La compaction **perd de l'information**. Le risque principal est d'oublier un détail qui s'avère crucial plus tard (une contrainte exprimée au début, une valeur exacte). Testez votre prompt de compaction sur de vraies traces longues, en privilégiant d'abord le **rappel** (ne rien perdre d'important), puis en élaguant. Attention aussi au découpage : ne coupez jamais entre un appel d'outil et son résultat.

> [!NOTE]
> Plusieurs fournisseurs proposent désormais la compaction ou l'effacement des anciens résultats d'outils **côté serveur**, configurable par seuil. Consultez la documentation à jour de votre fournisseur avant de tout réimplémenter.

## Les notes structurées

L'agent tient lui-même des **notes persistantes hors du contexte** : un fichier `NOTES.md`, une liste de tâches, un fichier de progression. Il les met à jour au fil de l'eau et les relit au besoin, y compris après une compaction ou dans une nouvelle session.

```markdown
# Progression - migration de l'API v1 vers v2
## Fait
- Endpoints /clients et /commandes migrés, tests verts (commit a3f9c2)
## En cours
- /factures : le champ `montant` passe de float à Decimal (attention aux arrondis)
## Décisions
- On garde /v1 en lecture seule jusqu'au 30/06 (demande de l'équipe mobile)
## Pistes écartées
- Migration automatique par script : échoue sur les factures multi-devises
```

C'est une forme de **mémoire** de travail externe, que le chapitre suivant approfondit.

## Les sous-agents

Comme vu au chapitre précédent, déléguer une exploration à un sous-agent permet de n'introduire dans le contexte principal que son **compte rendu condensé** (quelques centaines à quelques milliers de tokens) au lieu de dizaines de milliers de tokens d'exploration.

| Technique | Quand l'utiliser |
|---|---|
| Nettoyage des résultats d'outils | Toujours, c'est le gain le plus simple et le plus sûr |
| Compaction | Conversations et sessions longues, avec beaucoup d'échanges |
| Notes structurées | Tâches itératives avec des jalons clairs, travail sur plusieurs sessions |
| Sous-agents | Recherches et explorations parallélisables ou très volumineuses |

# Contexte et cache de prompt

La **mise en cache des prompts** (module 10) réutilise le calcul d'un **préfixe strictement identique**. L'ingénierie du contexte doit en tenir compte :

- placez ce qui est **stable** au début (prompt système, définitions d'outils, instructions du projet) et ce qui **change** à la fin ;
- évitez d'insérer une donnée variable (date, heure, identifiant de requête) au début du prompt : elle invalide le cache de tout ce qui suit ;
- une compaction ou un nettoyage **modifie** l'historique et invalide le cache à partir de ce point : regroupez ces opérations plutôt que de les faire à chaque tour.

# Les défaillances de contexte

Quatre défaillances reviennent souvent (la classification est popularisée dans plusieurs retours d'expérience de 2025) :

| Défaillance | Symptôme | Parade |
|---|---|---|
| **Empoisonnement** | Une erreur ou une hallucination entre dans le contexte et est ensuite traitée comme un fait | Vérifier les informations avant de les mémoriser, repartir d'un contexte propre plutôt que corriger indéfiniment |
| **Distraction** | Le contexte est si long que le modèle répète des actions passées au lieu de raisonner | Compaction, nettoyage, sous-agents |
| **Confusion** | Des éléments superflus (outils inutiles, documents hors sujet) influencent la réponse | Ne charger que les outils et documents pertinents pour l'étape |
| **Contradiction** | Des informations incompatibles coexistent (ancienne et nouvelle version d'une consigne) | Remplacer plutôt qu'ajouter, dater les informations, résoudre les conflits avant de les présenter |

> [!TIP]
> Quand un agent « s'embourbe » après une longue session, le remède le plus efficace est souvent de **repartir d'un contexte neuf** avec un bon résumé, plutôt que d'ajouter des consignes correctives à un contexte déjà pollué.

# Exercices

## Exercice 1 : Diagnostiquer un contexte

Le bilan de contexte d'un agent de support, à la 30e étape, est le suivant : prompt système 2 000 tokens, 45 définitions d'outils 18 000 tokens, messages 5 000 tokens, résultats d'outils 95 000 tokens. Les réponses deviennent lentes et l'agent rappelle des outils déjà utilisés. Proposez un plan d'action ordonné.

<details>
<summary>Voir la solution</summary>

1. **Résultats d'outils** (95 000) : nettoyer les anciens résultats en ne gardant que les 3 à 5 derniers ; revoir les outils pour qu'ils filtrent, paginent et renvoient des champs utiles. C'est le plus gros gain.
2. **Définitions d'outils** (18 000 pour 45 outils) : réduire le nombre d'outils exposés, fusionner les doublons, ou charger seulement les outils pertinents selon le type de demande (routage préalable).
3. **Compaction** au-delà d'un seuil, avec un prompt qui conserve l'objectif, l'état et les valeurs exactes.
4. Le symptôme « rappelle des outils déjà utilisés » est typique de la **distraction** : il devrait disparaître avec les mesures 1 et 3. Mesurer à nouveau après chaque changement.

</details>

## Exercice 2 : Un prompt de compaction

Un agent aide un utilisateur à préparer un voyage. Au début, l'utilisateur a précisé qu'il est allergique aux arachides et que son budget total est de 2 000 €. Après une compaction, l'agent propose un restaurant thaïlandais connu pour ses plats aux cacahuètes et dépasse le budget. Qu'est-ce qui a échoué et comment le corriger ?

<details>
<summary>Voir la solution</summary>

Le résumé de compaction a perdu des **contraintes** exprimées au début : c'est la défaillance typique d'une compaction orientée « avancement » plutôt que « contraintes ».

Corrections :

- le prompt de compaction doit exiger la conservation **explicite** des contraintes de l'utilisateur (santé, budget, dates, préférences) ;
- mieux encore : enregistrer ces contraintes dans une **note structurée** ou une mémoire (« Contraintes : allergie arachides ; budget 2 000 € ») qui est **toujours** réinjectée, indépendamment de la compaction ;
- ajouter des cas de test de compaction à l'évaluation : une contrainte donnée au premier tour doit être respectée après 50 tours.

</details>

## Exercice 3 : Ordonner pour le cache

Votre agent construit son prompt ainsi : `[date et heure actuelles] + [prompt système] + [définitions d'outils] + [historique]`. Le taux de réussite du cache est quasi nul. Expliquez pourquoi et proposez un nouvel ordre.

<details>
<summary>Voir la solution</summary>

Le cache réutilise un **préfixe strictement identique**. La date et l'heure changent à chaque requête et se trouvent au début : tout ce qui suit est invalidé.

Nouvel ordre : `[définitions d'outils] + [prompt système] + [instructions stables] + [historique] + [date et heure dans le dernier message]`. L'information variable est placée à la fin, et le grand préfixe stable peut être mis en cache.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: L'ingénierie du contexte
center: "À chaque étape, le plus petit ensemble d'informations à fort signal : pas le plus grand."
points:
  - icon: gauge
    title: Budget d'attention
    text: Plus de contexte = plus de coût, de latence et de dilution, bien avant la limite.
  - icon: chart
    title: Mesurer d'abord
    text: Les résultats d'outils dominent presque toujours ; c'est là qu'on gagne le plus.
  - icon: search
    title: Juste à temps
    text: Garder des références légères et charger le contenu via les outils quand il sert.
  - icon: layers
    title: Compaction et nettoyage
    text: Retirer les vieux résultats, résumer en conservant contraintes et valeurs exactes.
  - icon: file
    title: Notes structurées
    text: Progression, décisions et pistes écartées vivent hors du contexte et sont relues.
  - icon: alert
    title: Défaillances
    text: "Empoisonnement, distraction, confusion, contradiction : repartir propre si besoin."
pitfall: Un résumé de compaction qui conserve l'avancement mais perd les contraintes posées par l'utilisateur.
remember: "Remplir la fenêtre n'est pas un objectif : chaque token du contexte doit mériter sa place."
```
