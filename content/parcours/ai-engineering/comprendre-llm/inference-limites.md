---
title: Paramètres d'inférence et limites des LLM
description: Température, échantillonnage, fenêtre de contexte, coûts, latence, et les limites à connaître, à commencer par les hallucinations.
duration: 55
objectives:
  - Expliquer l'effet de la température et du top-p sur la génération
  - Raisonner en termes de fenêtre de contexte et de budget de tokens
  - Estimer le coût et la latence d'une requête
  - Identifier les principales limites des LLM et les moyens de les atténuer
---

# Comment le modèle choisit un token

À chaque étape, le modèle produit un score (**logit**) pour chaque token du vocabulaire. Un softmax transforme ces scores en probabilités. Reste à **choisir** un token : c'est l'**échantillonnage** (*sampling*).

- **Décodage glouton** : on prend toujours le token le plus probable. Déterministe en théorie, mais souvent répétitif.
- **Échantillonnage** : on tire au sort selon les probabilités, ce qui donne des textes plus variés.

## La température

La **température** modifie la forme de la distribution avant le tirage :

```diagram
type: custom
name: temperature
caption: Distribution illustrative du token suivant après « Le ciel est… ». À basse température, la probabilité se concentre sur le token le plus probable ; à haute température, elle s'étale sur des choix moins probables.
```

- **Basse** (proche de 0) : sorties plus prévisibles, adaptées à l'extraction, au classement, au code.
- **Plus élevée** : sorties plus variées, utiles pour la création ou le remue-méninges, avec plus de risques d'incohérence.

## Top-p et top-k

- **Top-k** : on ne garde que les *k* tokens les plus probables avant de tirer au sort.
- **Top-p** (*nucleus sampling*) : on garde le plus petit ensemble de tokens dont les probabilités cumulées atteignent *p* (par exemple 0,9).

> [!NOTE]
> Les paramètres disponibles dépendent du fournisseur **et du modèle**. Certains modèles récents, notamment les modèles de raisonnement de plusieurs fournisseurs, n'acceptent plus de valeurs personnalisées de température ou de top-p : l'API renvoie une erreur si on les fournit. Le réglage passe alors par d'autres paramètres, comme le niveau d'**effort** de réflexion. Vérifiez toujours la documentation du modèle que vous utilisez.

> [!IMPORTANT]
> Même à température 0, une API de LLM n'est **pas garantie déterministe** : des différences de calcul côté serveur (regroupement des requêtes, matériel) peuvent modifier la sortie. Ne construisez jamais une logique qui suppose qu'une même requête renverra exactement le même texte.

# La fenêtre de contexte

La **fenêtre de contexte** est le nombre maximal de tokens que le modèle peut traiter en une requête : **entrée et sortie comprises** (instructions système, historique de conversation, documents, définitions d'outils, réponse générée et, le cas échéant, tokens de raisonnement).

```diagram
type: stack
title: Ce qui occupe la fenêtre de contexte
segments:
  - label: Instructions système
    value: 8
    tone: violet
  - label: Définitions d'outils
    value: 7
    tone: blue
  - label: Historique
    value: 30
    tone: teal
  - label: Documents récupérés
    value: 35
    tone: amber
  - label: Réponse générée
    value: 20
    tone: rose
```

Les fenêtres ont fortement augmenté ces dernières années : plusieurs modèles actuels acceptent des centaines de milliers, voire un million de tokens. Mais **un grand contexte ne règle pas tout** :

- le coût et la latence augmentent avec la quantité de tokens envoyés ;
- les modèles n'exploitent pas toujours aussi bien toutes les parties d'un long contexte. Une étude de 2023 (Liu et al., *Lost in the Middle*) a montré que des informations placées **au milieu** d'un long contexte pouvaient être moins bien utilisées que celles placées au début ou à la fin. Les modèles récents ont progressé sur ce point, mais le principe reste valable : **un contexte ciblé vaut mieux qu'un contexte exhaustif**.

Le paramètre **`max_tokens`** (ou équivalent) fixe la longueur maximale de la **réponse**. Si le modèle l'atteint, la réponse est tronquée : l'API l'indique par une **raison d'arrêt** spécifique (par exemple `max_tokens` chez Anthropic, `length` chez OpenAI), qu'il faut toujours vérifier.

# Coûts et latence

## Les coûts

Les API facturent généralement **par million de tokens**, avec des prix différents pour l'**entrée** et la **sortie** (la sortie est en général nettement plus chère). Des remises existent souvent pour les tokens **mis en cache** et pour les traitements **par lots** asynchrones.

> coût ≈ (tokens d'entrée × prix d'entrée) + (tokens de sortie × prix de sortie)

Les écarts de prix entre modèles d'un même fournisseur sont importants (souvent un facteur 10 ou plus entre le plus petit et le plus grand). Les prix évoluent fréquemment : consultez toujours la page de tarifs officielle.

## La latence

Deux mesures comptent :

- le **délai avant le premier token** (TTFT, *time to first token*), qui dépend surtout de la longueur du prompt et de la charge du service ;
- le **débit** de sortie, en tokens par seconde.

La durée totale est approximativement : TTFT + (nombre de tokens de sortie ÷ débit). **Réduire la longueur de la réponse** est donc souvent le levier le plus efficace pour réduire la latence, et le **streaming** améliore fortement la latence *perçue*.

# Les limites à connaître

## Les hallucinations

Un LLM peut produire une réponse **fluide, assurée et fausse** : une citation inventée, une fonction de bibliothèque qui n'existe pas, une référence juridique fictive. Ce n'est pas un bogue ponctuel, mais une conséquence de son fonctionnement : il génère du texte **plausible**.

Moyens de les réduire :

- fournir les **sources** dans le contexte (RAG) et demander de s'y limiter ;
- autoriser explicitement le modèle à répondre « je ne sais pas » ;
- demander des **citations** vérifiables, puis les vérifier ;
- donner des **outils** (calcul, recherche, exécution de code) plutôt que de compter sur la mémoire du modèle ;
- **évaluer** systématiquement (module 8).

## Autres limites

| Limite | Exemple | Atténuation |
|---|---|---|
| Calcul exact | Erreurs sur de grandes multiplications | Outil de calcul, exécution de code |
| Connaissances datées | Ignorer une version récente d'une bibliothèque | RAG, recherche web |
| Sensibilité au prompt | Une reformulation change la réponse | Prompts testés, évaluations |
| Biais | Stéréotypes hérités des données | Évaluations ciblées, consignes, relecture humaine |
| Manipulation | Injection de prompt dans un document | Garde-fous, permissions limitées (module 9) |
| Complaisance | Approuver une affirmation erronée de l'utilisateur | Consignes explicites, évaluations |

> [!TIP]
> Une bonne question de conception : « que se passe-t-il si le modèle se trompe ici ? » Si l'erreur est coûteuse (finance, santé, juridique, action irréversible), prévoyez une **vérification** automatique ou humaine.

```video
url: https://www.youtube.com/watch?v=zjkBMFhNj_g
title: "[1hr Talk] Intro to Large Language Models"
channel: "Andrej Karpathy"
duration: "59:48"
lang: en
why: "Une heure pour revoir d'un coup ce qu'est un LLM, ce qu'il sait faire et ses limites, y compris les attaques par jailbreak et injection de prompt."
```

# Exercices

## Exercice 1 : Choisir les réglages

Pour chaque tâche, proposez une température basse ou plus élevée (en supposant que le modèle l'accepte) et justifiez :

1. Extraire la date et le montant d'une facture.
2. Proposer dix idées de noms pour un produit.
3. Générer une requête SQL à partir d'une question.

<details>
<summary>Voir la solution</summary>

1. **Basse** : on veut la valeur exacte, pas de créativité.
2. **Plus élevée** : la diversité des propositions est l'objectif.
3. **Basse** : la requête doit être correcte et cohérente. On la validera en plus (exécution sur une base de test, contrôle des droits).

</details>

## Exercice 2 : Estimer coût et latence

Un modèle facture 3 $ par million de tokens en entrée et 15 $ par million en sortie. Son TTFT moyen est de 0,8 s et son débit de 60 tokens/s. Une requête comporte 6 000 tokens d'entrée et 900 tokens de sortie. Estimez son coût et sa durée. Que se passe-t-il si l'on demande une réponse de 300 tokens au lieu de 900 ?

<details>
<summary>Voir la solution</summary>

- Coût : 6 000 × 3 / 1 000 000 + 900 × 15 / 1 000 000 = 0,018 + 0,0135 = **0,0315 $**.
- Durée : 0,8 + 900 / 60 = 0,8 + 15 = **15,8 s**.
- Avec 300 tokens de sortie : coût 0,018 + 0,0045 = **0,0225 $** ; durée 0,8 + 5 = **5,8 s**. La longueur de sortie a un impact majeur sur la latence.

</details>

## Exercice 3 : Réduire les hallucinations

Votre assistant juridique interne cite parfois des articles de loi inexistants. Proposez au moins trois mesures concrètes.

<details>
<summary>Voir la solution</summary>

- Mettre en place un **RAG** sur une base de textes officiels à jour, et demander au modèle de ne citer que des articles présents dans les extraits fournis.
- Exiger des **citations structurées** (identifiant de l'article, extrait) puis **vérifier automatiquement** que chaque article cité existe dans la base.
- Autoriser et encourager la réponse « je ne trouve pas d'article applicable dans les sources ».
- Construire un **jeu d'évaluation** de questions juridiques avec réponses validées par des juristes et mesurer le taux de citations correctes.
- Afficher les sources à l'utilisateur et prévoir une **validation humaine** pour les usages sensibles.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Inférence et limites des LLM
center: Régler la génération, budgéter les tokens et anticiper les erreurs du modèle.
points:
  - icon: gauge
    title: Température et top-p
    text: Basse température = prévisible ; certains modèles récents n'acceptent plus ces réglages.
  - icon: layers
    title: La fenêtre de contexte
    text: Entrée + sortie ; un contexte ciblé vaut mieux qu'un contexte exhaustif.
  - icon: alert
    title: Vérifier la raison d'arrêt
    text: max_tokens signifie réponse tronquée, à détecter systématiquement.
  - icon: money
    title: Coûts et latence
    text: Facturés au token ; la longueur de sortie pèse lourd sur le prix et la durée.
  - icon: search
    title: Les hallucinations
    text: Sources fournies, droit de dire « je ne sais pas », citations vérifiées, outils.
pitfall: Supposer qu'une même requête renverra toujours exactement le même texte, même à température 0.
remember: "Pour le calcul exact ou les faits récents, donnez un outil ou une source : pas un vœu pieux."
```
