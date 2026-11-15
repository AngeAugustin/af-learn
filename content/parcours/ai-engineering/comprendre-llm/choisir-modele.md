---
title: Panorama et choix d'un modèle
description: Modèles propriétaires et open-weight, lecture critique des benchmarks, et méthode concrète pour choisir le bon modèle pour une tâche.
duration: 45
objectives:
  - Distinguer modèles propriétaires accessibles par API et modèles open-weight
  - Lire les benchmarks avec esprit critique
  - Appliquer une grille de critères pour choisir un modèle
  - Concevoir une architecture qui permet de changer de modèle facilement
---

# Deux grandes familles de modèles

## Les modèles propriétaires accessibles par API

Les poids du modèle restent chez le fournisseur ; on l'utilise par des appels d'API, facturés à l'usage. Principaux acteurs : **Anthropic** (famille Claude), **OpenAI** (familles GPT et modèles de raisonnement), **Google** (famille Gemini). D'autres entreprises, comme Mistral AI ou Cohere, proposent aussi des modèles par API.

Les fournisseurs organisent généralement leurs modèles en **gammes** : un modèle le plus capable (plus lent et plus cher), un modèle intermédiaire équilibré et un modèle petit, rapide et économique. Par exemple, à la date de rédaction de ce cours (fin 2026), la gamme d'Anthropic comprend notamment Claude Opus, Claude Sonnet et Claude Haiku, ainsi que Claude Fable, présenté comme son modèle le plus capable largement disponible.

Avantages : qualité au meilleur niveau, aucune infrastructure à gérer, mises à jour régulières. Points d'attention : dépendance à un fournisseur, données envoyées à un tiers (à encadrer contractuellement), **retrait** programmé des anciens modèles (il faudra migrer).

> [!NOTE]
> Ces modèles sont aussi disponibles via les grands clouds : par exemple les modèles Claude sur Amazon Bedrock, Google Cloud Vertex AI et Microsoft Foundry, ou les modèles d'OpenAI sur Microsoft Azure. Cela peut simplifier la facturation, la conformité et la localisation des données.

## Les modèles open-weight

Les **poids** du modèle sont publiés : on peut le télécharger et l'exécuter sur sa propre infrastructure. Exemples de familles connues : **Llama** (Meta), **Mistral** et **Mixtral** (Mistral AI), **Qwen** (Alibaba), **DeepSeek**, **Gemma** (Google).

Avantages : contrôle total des données, possibilité de fine-tuning complet, pas de coût par token (mais un coût d'infrastructure). Points d'attention : il faut des GPU et des compétences d'exploitation, et la qualité peut être inférieure à celle des meilleurs modèles propriétaires selon les tâches.

> [!WARNING]
> « Open-weight » ne veut pas dire « libre de droits ». Les **licences varient** : certaines sont très permissives (par exemple Apache 2.0 pour plusieurs modèles de Mistral AI et de Qwen), d'autres imposent des conditions d'usage ou des restrictions commerciales (comme la licence communautaire des modèles Llama). Lisez la licence avant tout usage en production.

# Lire les benchmarks avec esprit critique

Les fournisseurs publient des scores sur des **benchmarks** publics. Quelques exemples répandus :

| Benchmark | Ce qu'il mesure |
|---|---|
| MMLU / MMLU-Pro | Connaissances et raisonnement sur de nombreux domaines (QCM) |
| GPQA | Questions scientifiques de niveau expert |
| SWE-bench | Capacité à corriger de vrais tickets de dépôts GitHub |
| LMArena (ex-Chatbot Arena) | Préférences d'utilisateurs entre réponses anonymisées, sous forme de classement |

Ces mesures sont utiles pour une **première sélection**, mais elles ont des limites :

- **Contamination** : les questions publiques peuvent s'être retrouvées dans les données d'entraînement.
- **Saturation** : quand tous les modèles dépassent 90 %, le benchmark ne les départage plus.
- **Écart avec votre usage** : un excellent score en mathématiques ne dit rien de la qualité sur vos tickets de support en français.
- **Conditions de mesure** : réglages, nombre d'essais et prompts diffèrent d'une publication à l'autre.

> [!IMPORTANT]
> Le seul benchmark qui compte vraiment est **votre propre évaluation**, sur vos données, avec vos critères. Le module 8 vous apprend à la construire.

# Une grille de choix

Pour choisir un modèle, passez en revue les critères suivants, dans cet ordre :

1. **Qualité suffisante sur votre tâche**, mesurée sur votre jeu d'évaluation.
2. **Contraintes non négociables** : confidentialité et localisation des données, conformité réglementaire, licence, exécution hors ligne éventuelle.
3. **Latence** acceptable pour l'expérience utilisateur.
4. **Coût** au volume prévu.
5. **Fonctionnalités** : taille du contexte, vision, appel d'outils, sorties structurées, mise en cache, traitement par lots.
6. **Exploitation** : limites de débit, disponibilité, support, politique de retrait des modèles.

```diagram
type: decision
title: Méthode de sélection
nodes:
  - question: Des contraintes imposent-elles l'hébergement interne (données, hors ligne, souveraineté) ?
    yes: Évaluer des modèles open-weight, ou des offres cloud dédiées conformes
    no: Commencer par les meilleurs modèles disponibles par API
  - question: Le modèle le plus capable atteint-il vos critères de qualité ?
    yes: Tester des modèles plus petits et moins chers sur la même évaluation
    no: Améliorer prompt, contexte et outils avant de conclure
  - question: Un modèle plus petit conserve-t-il la qualité requise ?
    yes: "Le retenir : moins cher et plus rapide"
    no: Garder le plus capable, ou router selon la difficulté de la requête
```

## Commencer haut, descendre ensuite

La stratégie recommandée : prototyper avec le modèle **le plus capable** pour vérifier que la tâche est faisable, construire l'évaluation, puis **essayer des modèles plus petits** et ne descendre que si la qualité tient. Beaucoup d'applications combinent plusieurs modèles : un petit modèle pour les tâches simples (classification, extraction), un grand modèle pour les tâches complexes. On parle de **routage** (module 10).

# Concevoir pour changer de modèle

Les modèles évoluent vite : un modèle plus performant ou moins cher sort régulièrement, et les anciens sont retirés. Votre architecture doit rendre le **changement de modèle** simple et sûr :

- l'identifiant du modèle est un **paramètre de configuration**, pas une chaîne répétée dans tout le code ;
- les appels au modèle passent par **une couche d'abstraction** propre à votre application (une fonction ou un petit module), ce qui limite les endroits à modifier ;
- une **évaluation automatisée** permet de comparer l'ancien et le nouveau modèle avant de basculer ;
- on teste la migration : un nouveau modèle peut demander des **ajustements de prompts** et changer certains paramètres d'API.

```python
# config.py
import os

MODELE_PRINCIPAL = os.environ.get("MODELE_PRINCIPAL", "claude-opus-5-5")
MODELE_RAPIDE = os.environ.get("MODELE_RAPIDE", "claude-haiku-5-5")
```

> [!TIP]
> Les bibliothèques qui unifient plusieurs fournisseurs derrière une même interface (par exemple LiteLLM) facilitent les comparaisons. Elles ajoutent toutefois une dépendance et peuvent masquer des fonctionnalités propres à chaque fournisseur. Une couche d'abstraction maison, mince, est souvent suffisante.

# Exercices

## Exercice 1 : Choisir une famille de modèles

Pour chaque situation, recommandez plutôt un modèle propriétaire par API ou un modèle open-weight auto-hébergé, en justifiant :

1. Une start-up qui lance un assistant de rédaction et veut la meilleure qualité possible rapidement.
2. Un hôpital qui doit traiter des comptes rendus médicaux sans qu'aucune donnée ne quitte son infrastructure.
3. Une application mobile qui doit fonctionner hors ligne sur l'appareil.

<details>
<summary>Voir la solution</summary>

1. **API propriétaire** : qualité maximale, pas d'infrastructure à monter, mise sur le marché rapide.
2. **Open-weight auto-hébergé** (ou, si la réglementation et les contrats le permettent, une offre cloud dédiée certifiée pour les données de santé) : la contrainte de localisation des données prime.
3. **Petit modèle open-weight** exécuté sur l'appareil (souvent quantifié, voir le module 10) : une API nécessite une connexion.

</details>

## Exercice 2 : Critiquer un benchmark

Un collègue propose de choisir le modèle A plutôt que le modèle B parce que A obtient 2 points de plus sur MMLU. Rédigez une réponse argumentée.

<details>
<summary>Voir la solution</summary>

Un écart de 2 points sur un benchmark public généraliste ne suffit pas : contamination possible, conditions de mesure différentes, et surtout aucun lien démontré avec **notre** tâche. Proposition : constituer un jeu d'évaluation représentatif de notre usage (par exemple 100 cas réels), mesurer A et B dans les mêmes conditions, et comparer aussi la latence et le coût au volume prévu avant de décider.

</details>

## Exercice 3 : Préparer une migration

Votre application appelle un modèle dont le retrait est annoncé dans trois mois. Décrivez les étapes pour migrer sans risque.

<details>
<summary>Voir la solution</summary>

1. Lire le **guide de migration** du fournisseur (paramètres modifiés, changements de comportement).
2. Centraliser l'identifiant du modèle dans la **configuration** si ce n'est pas déjà le cas.
3. Exécuter le **jeu d'évaluation** avec l'ancien et le nouveau modèle ; analyser les régressions.
4. Ajuster les **prompts** et paramètres si nécessaire, puis relancer l'évaluation.
5. Déployer progressivement (une partie du trafic d'abord), surveiller les métriques de qualité, de coût et de latence, puis basculer entièrement bien avant la date de retrait.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Panorama et choix d'un modèle
center: Le meilleur modèle est celui qui réussit votre évaluation, au coût et à la latence acceptables.
points:
  - icon: cloud
    title: Propriétaires ou open-weight
    text: API sans infrastructure, ou poids publiés et contrôle total des données.
  - icon: file
    title: Lire les licences
    text: Open-weight ne veut pas dire libre de droits ; certaines licences restreignent les usages.
  - icon: chart
    title: Benchmarks avec recul
    text: "Contamination, saturation, conditions variables : un tri initial, pas une décision."
  - icon: target
    title: Commencer haut, descendre ensuite
    text: Prototyper avec le plus capable, puis tester des modèles plus petits.
  - icon: loop
    title: Prévoir les migrations
    text: Identifiant en configuration, couche d'abstraction mince, évaluation avant bascule.
pitfall: Choisir un modèle pour 2 points de plus sur un benchmark public sans tester sur ses propres données.
remember: "Les modèles changent vite : rendez le changement de modèle simple, mesuré et réversible."
```
