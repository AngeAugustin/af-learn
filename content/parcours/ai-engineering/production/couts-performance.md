---
title: Maîtriser les coûts et la latence
description: "Mesurer avant d'optimiser, puis actionner les bons leviers : mise en cache des prompts, hygiène des tokens, traitement par lots, choix du modèle et routage."
duration: 55
objectives:
  - Établir un profil de coûts et de latence avant d'optimiser
  - Utiliser la mise en cache des prompts et vérifier son efficacité
  - Réduire les tokens d'entrée et de sortie sans perdre en qualité
  - Choisir le bon modèle, le bon niveau d'effort et le routage
---

# Mesurer d'abord

On n'optimise pas ce qu'on ne mesure pas. Avant toute optimisation, établissez un **profil** :

- coût par **requête**, par **fonctionnalité** et par **utilisateur** ;
- répartition entre tokens **d'entrée**, **de sortie** et **mis en cache** ;
- **latence** (délai avant le premier token, durée totale, percentiles) ;
- et surtout la **qualité**, mesurée par vos évaluations : une optimisation qui dégrade la qualité n'est pas une économie.

Jugez le **coût par tâche réussie** plutôt que le coût par requête : un modèle moins cher qui nécessite plus de tentatives ou d'étapes pour aboutir peut finalement coûter davantage.

```diagram
type: layers
title: Les leviers, dans l'ordre recommandé
layers:
  - title: 1. Gains sans compromis
    text: Mise en cache des prompts, hygiène des tokens, traitement par lots pour ce qui n'est pas urgent
  - title: 2. Ajustements à valider par l'évaluation
    text: Longueur des réponses, niveau d'effort de réflexion, nombre de passages de RAG
  - title: 3. Changements d'architecture
    text: Modèle plus petit, routage entre modèles, cache des réponses
```

# La mise en cache des prompts

De nombreuses requêtes partagent un **long préfixe identique** : instructions système, définitions d'outils, document de référence, historique d'une conversation. La **mise en cache des prompts** (*prompt caching*) permet au fournisseur de réutiliser le traitement de ce préfixe d'une requête à l'autre (c'est le cache KV vu au module 3), ce qui réduit fortement le **coût** et la **latence** des tokens mis en cache.

Le principe est le même chez les principaux fournisseurs, avec des modalités différentes :

- chez **Anthropic**, on marque explicitement le point jusqu'où mettre en cache (`cache_control`), ou on active la mise en cache automatique ; la lecture depuis le cache est facturée environ **10 %** du prix normal, l'écriture un peu plus cher que le prix normal ; la durée de vie par défaut est de quelques minutes, renouvelée à chaque utilisation, avec une option plus longue ;
- chez **OpenAI**, la mise en cache des préfixes longs est **automatique**, avec une remise sur les tokens mis en cache.

```python
reponse = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=1024,
    system=[{
        "type": "text",
        "text": DOCUMENTATION_PRODUIT,           # long texte identique à chaque requête
        "cache_control": {"type": "ephemeral"},  # met en cache jusqu'ici
    }],
    messages=[{"role": "user", "content": question}],
)
print(reponse.usage.cache_creation_input_tokens)  # tokens écrits dans le cache
print(reponse.usage.cache_read_input_tokens)      # tokens lus depuis le cache
```

## La règle d'or : un préfixe strictement identique

Le cache fonctionne par **correspondance exacte du préfixe** : le moindre octet différent invalide tout ce qui suit. Organisez donc vos prompts du **plus stable au plus variable** :

```diagram
type: stack
title: Ordre d'un prompt optimisé pour le cache
segments:
  - label: Définitions d'outils (stables)
    value: 15
    tone: violet
  - label: Instructions système (stables)
    value: 20
    tone: blue
  - label: Documents de référence (stables)
    value: 40
    tone: teal
  - label: Historique, puis question (variables)
    value: 25
    tone: amber
```

> [!WARNING]
> Pièges classiques qui cassent le cache sans bruit : insérer la **date et l'heure** ou un identifiant de requête dans les instructions système ; sérialiser du JSON avec un **ordre de clés variable** ; changer l'**ordre des outils** d'une requête à l'autre. Vérifiez toujours, dans les métriques d'usage, que les tokens **lus depuis le cache** sont bien non nuls sur des requêtes répétées.

# L'hygiène des tokens

## Réduire l'entrée

- N'envoyez que le contexte **utile** : un RAG bien réglé avec 5 bons passages vaut mieux que 30 passages moyens.
- **Résumez** ou tronquez les longues conversations ; retirez les anciens résultats d'outils.
- Gardez des définitions d'outils **concises** et ne fournissez que les outils pertinents pour la tâche.
- Évitez les formats verbeux : un tableau en CSV ou en Markdown est souvent plus compact que du JSON très imbriqué.

## Réduire la sortie

Les tokens de sortie sont généralement **bien plus chers** que les tokens d'entrée, et ils déterminent la latence.

- Demandez des réponses **concises**, avec une longueur cible.
- Pour les traitements automatiques, demandez **uniquement** les données utiles (sortie structurée), sans explication superflue.
- Réglez `max_tokens` à une valeur adaptée pour **plafonner** les dérapages, tout en surveillant le taux de réponses tronquées.

## Régler l'effort de réflexion

Sur les modèles de raisonnement, la réflexion produit des tokens facturés. Un **effort réduit** suffit souvent pour les tâches simples (classification, extraction, conversation courante), tandis que les tâches complexes (code, analyse en plusieurs étapes) bénéficient d'un effort plus élevé. Mesurez la qualité à chaque niveau sur votre évaluation, tâche par tâche.

# Traitement par lots, choix du modèle et routage

## Le traitement par lots

Pour tout ce qui n'est **pas urgent** (analyses nocturnes, enrichissement de données, évaluations, génération de contenu en masse), les API de **traitement par lots** (*batch*) d'Anthropic et d'OpenAI traitent les requêtes de manière asynchrone (résultats en général en quelques heures au plus) avec une **remise d'environ 50 %**. Les résultats peuvent arriver dans un ordre quelconque : associez chaque requête à un identifiant.

## Le choix du modèle

Les écarts de prix entre modèles atteignent souvent un facteur 10 ou plus. Une fois l'évaluation en place, testez des modèles **plus petits** : si la qualité tient, l'économie est immédiate, et la latence s'améliore aussi. Comparez aussi un modèle **plus capable à effort réduit** : il peut égaler un modèle plus petit à effort élevé, avec une seule configuration à maintenir.

## Le routage

Le **routage** envoie chaque requête au modèle le plus économique **capable** de la traiter : un petit modèle (ou une règle simple) classe la demande, puis les cas simples vont à un modèle rapide et les cas complexes à un modèle plus capable. Attention : le routage ajoute un appel, de la complexité, et chaque modèle a son propre cache. Il se justifie surtout pour de gros volumes de requêtes hétérogènes.

## Le cache des réponses

Si de nombreux utilisateurs posent **exactement** la même question (FAQ), mettre en cache la **réponse** elle-même évite tout appel au modèle. Les caches « sémantiques », qui réutilisent la réponse d'une question **similaire**, sont plus risqués : deux questions proches peuvent appeler des réponses différentes. Réservez-les à des contenus génériques et évaluez-les soigneusement.

# Exercices

## Exercice 1 : Calculer l'économie du cache

Un assistant envoie à chaque requête un prompt système de 20 000 tokens (identique) suivi d'une question de 200 tokens, et reçoit 300 tokens de sortie. Prix : 4 $ par million de tokens d'entrée, 20 $ par million en sortie ; lecture du cache facturée 10 % du prix d'entrée. Calculez le coût de 1 000 requêtes sans cache, puis avec cache (en négligeant le coût d'écriture initial).

<details>
<summary>Voir la solution</summary>

**Sans cache** : par requête, 20 200 × 4 / 1 000 000 + 300 × 20 / 1 000 000 = 0,0808 + 0,006 = 0,0868 $. Pour 1 000 requêtes : **86,80 $**.

**Avec cache** : par requête, 20 000 × 0,4 / 1 000 000 + 200 × 4 / 1 000 000 + 0,006 = 0,008 + 0,0008 + 0,006 = 0,0148 $. Pour 1 000 requêtes : **14,80 $**.

Économie d'environ **83 %**, avec en plus une latence réduite. (Le coût réel inclut quelques écritures de cache, à chaque expiration du cache.)

</details>

## Exercice 2 : Trouver le bogue de cache

Ce code n'obtient jamais de lecture depuis le cache. Pourquoi ?

```python
system = [{
    "type": "text",
    "text": f"Nous sommes le {datetime.now().isoformat()}.\n\n{DOCUMENTATION}",
    "cache_control": {"type": "ephemeral"},
}]
```

<details>
<summary>Voir la solution</summary>

La date et l'**heure à la seconde près** sont placées **au début** du texte mis en cache : le préfixe change à chaque requête, donc le cache n'est jamais réutilisé. Solution : placer la documentation (stable) en premier et la date **après** le point de mise en cache (par exemple dans le message utilisateur), et ne garder que la **date du jour** si l'heure n'est pas nécessaire.

</details>

## Exercice 3 : Plan d'optimisation

Votre application coûte trop cher. Le profil montre : 70 % du coût vient des tokens de sortie, les réponses font en moyenne 900 tokens, et 40 % des requêtes sont des questions simples de suivi de commande. Proposez un plan d'optimisation ordonné.

<details>
<summary>Voir une proposition de solution</summary>

1. **Réduire la longueur des réponses** (consigne de concision, longueur cible) : levier principal puisque la sortie représente 70 % du coût. Vérifier la qualité sur l'évaluation.
2. **Mise en cache des prompts** pour les instructions et les outils, si ce n'est pas déjà fait.
3. **Effort de réflexion réduit** pour les questions simples, si le modèle le permet.
4. **Routage** : les questions de suivi de commande (40 %) peuvent souvent être traitées par un petit modèle, voire sans LLM (requête directe à la base et réponse type).
5. Mesurer le **coût par tâche réussie** avant et après chaque étape, et ne garder que les changements qui préservent la qualité.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Maîtriser coûts et latence
center: Mesurer d'abord, puis activer les gains gratuits avant les compromis.
points:
  - icon: chart
    title: Coût par tâche réussie
    text: Le bon indicateur, pas le coût par requête isolée.
  - icon: database
    title: Cache des prompts
    text: Préfixe strictement identique, du plus stable au plus variable ; lectures bien moins chères.
  - icon: filter
    title: Hygiène des tokens
    text: Moins de contexte inutile, réponses plus courtes, effort de réflexion adapté.
  - icon: clock
    title: Traitement par lots
    text: Environ 50 % de remise pour ce qui n'est pas urgent.
  - icon: compass
    title: Modèle et routage
    text: Tester des modèles plus petits ; router selon la difficulté si le volume le justifie.
pitfall: Glisser l'heure exacte au début des instructions système et casser le cache sans s'en apercevoir.
remember: Vérifiez dans les métriques que les tokens lus depuis le cache sont bien non nuls.
```
