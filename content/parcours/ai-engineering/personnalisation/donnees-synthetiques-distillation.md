---
title: Données synthétiques, distillation et préférences
description: Produire des données avec un LLM pour évaluer et entraîner, contrôler leur qualité, distiller un grand modèle dans un petit, et ajuster un modèle sur des préférences avec DPO.
duration: 60
objectives:
  - Générer des données synthétiques diversifiées pour l'évaluation et le fine-tuning
  - Contrôler la qualité des données générées (déduplication, vérification, filtrage, revue)
  - "Connaître les risques : effondrement, biais amplifiés, contamination, licences"
  - Mettre en œuvre une distillation d'un grand modèle vers un petit modèle
  - Construire des paires de préférences et entraîner avec DPO
---

# Pourquoi générer des données ?

Les données sont souvent le goulot d'étranglement d'un projet d'IA : pas assez d'exemples pour évaluer, pas assez de cas limites, des données réelles trop sensibles pour être utilisées librement. Les LLM permettent de **générer** des données :

| Besoin | Exemple |
|---|---|
| **Jeu d'évaluation** | 300 questions réalistes sur une documentation, pour évaluer un RAG |
| **Cas limites et attaques** | Demandes ambiguës, hors sujet, tentatives d'injection (module 9) |
| **Données de fine-tuning** | 5 000 exemples d'extraction structurée dans le format de l'entreprise |
| **Distillation** | Les réponses d'un grand modèle pour entraîner un petit modèle |
| **Protection de la vie privée** | Des dossiers fictifs mais réalistes plutôt que des dossiers clients réels |

> [!IMPORTANT]
> Des données synthétiques ne valent que par leur **contrôle qualité**. Générer 10 000 exemples prend une heure ; en vérifier la qualité est le vrai travail.

# Générer avec diversité

Le défaut principal des données générées naïvement est leur **uniformité** : demandez 100 questions de clients à un modèle, vous obtiendrez 100 variations du même style poli et bien rédigé. Les vrais utilisateurs font des fautes, sont pressés, mélangent deux demandes, oublient l'essentiel.

Les techniques pour diversifier :

- **Dimensions explicites** : définir des axes (sujet, niveau d'expertise, ton, longueur, langue, difficulté) et générer en **combinant** leurs valeurs.
- **Personas** : faire générer chaque exemple « par » un personnage différent (« artisan de 55 ans peu à l'aise avec l'informatique, qui écrit depuis son téléphone »).
- **Ancrage dans des données réelles** : partir de documents, de vrais tickets anonymisés ou de logs, pour que les exemples reflètent la réalité.
- **Génération inverse** : pour évaluer un RAG, partir d'un **passage** et demander une question dont il est la réponse, on connaît ainsi le passage attendu.
- **Évolution** : complexifier progressivement des exemples simples (ajouter une contrainte, un cas particulier, une étape de raisonnement), comme dans les travaux de type *Evol-Instruct*.

```python
import itertools
import json
import random

SUJETS = ["livraison", "remboursement", "facturation", "compte", "produit défectueux"]
PROFILS = ["client pressé qui écrit en abrégé", "client âgé très poli", "client professionnel précis",
           "client mécontent qui menace de partir", "client non francophone natif"]
DIFFICULTES = ["demande simple et claire", "deux demandes mélangées", "information essentielle manquante"]

PROMPT = """Écris UN message qu'un client pourrait envoyer au support d'une boutique en ligne.
Sujet : {sujet}. Profil : {profil}. Difficulté : {difficulte}.
Le message doit être réaliste (style, longueur, fautes éventuelles) et NE PAS être une copie des exemples typiques.
Réponds en JSON : {{"message": "...", "intention_attendue": "...", "infos_manquantes": [...]}}"""

combinaisons = list(itertools.product(SUJETS, PROFILS, DIFFICULTES))  # 75 combinaisons
random.shuffle(combinaisons)
prompts = [PROMPT.format(sujet=s, profil=p, difficulte=d) for s, p, d in combinaisons]
# Chaque prompt est envoyé au modèle (idéalement via l'API de traitement par lots) ;
# la sortie JSON est validée puis enregistrée avec ses métadonnées (sujet, profil, difficulté).
```

Conserver les **métadonnées** de génération (sujet, profil, difficulté) permet ensuite de vérifier la **couverture** et d'analyser les résultats par catégorie.

# Contrôler la qualité

```diagram
type: flow
title: Le contrôle qualité des données synthétiques
steps:
  - title: Validation
    text: Format, schéma, longueur, langue
  - title: Déduplication
    text: Exacte, puis par similarité d'embeddings
  - title: Vérification
    text: Exécution du code, réponse vérifiable, cohérence avec la source
  - title: Filtrage
    text: LLM juge avec une grille ; rejet des exemples faibles
  - title: Revue humaine
    text: Échantillon relu par des experts, taux d'erreur mesuré
    tone: teal
```

- **Déduplication** : au-delà des doublons exacts, éliminez les **quasi-doublons** (similarité cosinus des embeddings au-dessus d'un seuil), qui gonflent artificiellement le volume.
- **Vérification objective** quand c'est possible : un code généré doit s'exécuter et passer des tests ; une réponse à un calcul doit être recalculée ; une question générée depuis un passage doit avoir sa réponse dans ce passage.
- **Juge LLM** avec une grille explicite (réalisme, exactitude, conformité au format), utilisé de préférence avec un modèle **différent** du générateur pour limiter les biais partagés.
- **Revue humaine** d'un échantillon aléatoire : si 15 % des exemples relus sont faux, le jeu entier n'est pas utilisable en l'état.
- **Mesure de la diversité** : distribution des métadonnées, distance moyenne entre embeddings, longueur des exemples.

# Les risques

| Risque | Description | Parade |
|---|---|---|
| **Uniformité** | Données trop propres et homogènes, éloignées du réel | Dimensions, personas, ancrage dans des données réelles |
| **Erreurs transmises** | Le générateur se trompe, le modèle entraîné apprend l'erreur | Vérification, filtrage, revue |
| **Biais amplifiés** | Les stéréotypes du générateur se retrouvent concentrés | Contrôle de la répartition, tests contrefactuels (module 9) |
| **Effondrement** | Entraîner des générations successives de modèles sur leurs propres sorties appauvrit la diversité et dégrade la qualité (Shumailov et al., *Nature*, 2024) | Toujours mélanger des données réelles, ne pas boucler indéfiniment |
| **Contamination** | Des exemples d'évaluation se retrouvent dans les données d'entraînement | Séparer strictement les jeux, dédupliquer entre eux |
| **Licences** | Les conditions d'utilisation de certains fournisseurs limitent l'usage de leurs sorties pour entraîner des modèles concurrents | Vérifier avant de commencer (module 9) |

> [!WARNING]
> Un jeu d'**évaluation** entièrement synthétique risque de mesurer la capacité du modèle à traiter des données « à la manière d'un LLM ». Complétez-le toujours avec des **exemples réels** (anonymisés si nécessaire), et vérifiez que les scores sur les deux concordent.

# La distillation

La **distillation** consiste à transférer les capacités d'un grand modèle (**professeur**) vers un modèle plus petit (**élève**), pour une tâche donnée. L'objectif : obtenir une qualité proche à un **coût** et une **latence** bien inférieurs, ou pouvoir exécuter le modèle **localement**.

```diagram
type: flow
title: Distiller un modèle pour une tâche
steps:
  - title: Entrées réelles
    text: Exemples représentatifs de la tâche, sans les réponses
  - title: Professeur
    text: Le grand modèle produit les réponses (avec un prompt soigné)
  - title: Filtrage
    text: Vérification et sélection des meilleures réponses
  - title: Élève
    text: Fine-tuning supervisé (LoRA) sur les paires entrée → réponse
  - title: Évaluation
    text: Comparaison élève vs professeur sur un jeu séparé
    tone: teal
```

Deux variantes :

- **Distillation par les sorties** : on entraîne l'élève sur les **réponses** du professeur (fine-tuning supervisé). C'est la méthode accessible avec un professeur disponible par API. Certains fournisseurs proposent même la distillation comme service intégré.
- **Distillation par les probabilités** : l'élève apprend à reproduire la **distribution de probabilités** du professeur sur les tokens, plus riche qu'une seule réponse. Elle exige l'accès aux probabilités complètes du professeur, donc en pratique un professeur **open-weight**.

On distille aussi des **raisonnements** : en entraînant un petit modèle sur les étapes de raisonnement d'un modèle de raisonnement, on améliore nettement ses capacités sur des tâches comparables. Plusieurs petits modèles de raisonnement open-weight ont été obtenus ainsi.

> [!TIP]
> La distillation fonctionne bien pour des **tâches étroites et bien définies** (classification, extraction, reformulation dans un format précis). Elle échoue souvent à transférer des capacités **générales** : un petit modèle distillé sur le support client ne devient pas bon en raisonnement juridique.

# Ajuster sur des préférences avec DPO

Le fine-tuning supervisé apprend à **imiter** des réponses. Pour des critères plus subtils (ton, concision, refus appropriés, style de l'entreprise) on peut entraîner sur des **préférences** : pour une même entrée, une réponse **préférée** et une réponse **rejetée**.

**DPO** (*Direct Preference Optimization*, module 3) optimise directement le modèle pour augmenter la probabilité relative de la réponse préférée, sans le modèle de récompense ni l'apprentissage par renforcement du RLHF classique.

```json
{"prompt": "Mon colis n'est pas arrivé.", "chosen": "Je suis désolé pour ce retard. Pouvez-vous me donner votre numéro de commande ? Je vérifie tout de suite où en est la livraison.", "rejected": "Les colis arrivent généralement sous 3 à 5 jours ouvrés. Merci de patienter."}
```

Les paires peuvent venir :

- des **retours utilisateurs** (réponse notée positivement vs négativement pour des demandes similaires) ;
- de **corrections** apportées par des experts (la version corrigée est préférée à l'originale) ;
- d'un **LLM juge** qui compare deux réponses générées selon une grille, en validant le juge contre des jugements humains (module 8).

```python
# pip install trl peft transformers datasets
from datasets import load_dataset
from peft import LoraConfig
from transformers import AutoModelForCausalLM, AutoTokenizer
from trl import DPOConfig, DPOTrainer

MODELE = "<identifiant-du-modele-deja-ajuste-par-sft>"
modele = AutoModelForCausalLM.from_pretrained(MODELE)
tokenizer = AutoTokenizer.from_pretrained(MODELE)
paires = load_dataset("json", data_files="preferences.jsonl", split="train")  # champs prompt, chosen, rejected

entraineur = DPOTrainer(
    model=modele,
    args=DPOConfig(output_dir="modele-dpo", beta=0.1, learning_rate=5e-6, num_train_epochs=1),
    train_dataset=paires,
    processing_class=tokenizer,
    peft_config=LoraConfig(r=16, lora_alpha=32, target_modules="all-linear", task_type="CAUSAL_LM"),
)
entraineur.train()
```

Le paramètre `beta` contrôle l'écart autorisé par rapport au modèle de départ : plus il est petit, plus le modèle peut s'éloigner de son comportement initial. Comme toujours, évaluez avant et après, y compris sur des tâches que vous ne cherchiez pas à modifier (pour détecter les régressions).

# Exercices

## Exercice 1 : Un jeu d'évaluation synthétique pour un RAG

Vous devez évaluer un RAG sur une documentation de 400 pages. Décrivez une méthode de génération de 200 questions, avec contrôle qualité.

<details>
<summary>Voir une proposition de solution</summary>

1. **Échantillonner** 150 passages représentatifs (répartis sur toutes les sections), plus 25 paires de passages liés.
2. **Génération inverse** : pour chaque passage, demander une question dont il est la réponse, en variant le profil (débutant, expert), le vocabulaire (synonymes plutôt que les mots du passage) et la forme ; pour les paires, une question qui nécessite les deux passages. Enregistrer le ou les passages attendus et une réponse de référence.
3. Ajouter 25 questions **hors corpus** (réponse attendue : « je ne sais pas »).
4. **Contrôle** : déduplication par similarité ; vérification par un juge (la réponse est-elle bien dans le passage ? la question est-elle autonome et naturelle ?) ; revue humaine de 40 questions, avec correction ou rejet.
5. **Compléter** avec les vraies questions d'utilisateurs dès qu'elles sont disponibles, et comparer les scores.

</details>

## Exercice 2 : Distillation ou non ?

Votre application classe 2 millions de tickets par mois en 12 catégories avec un grand modèle par API, pour un coût jugé trop élevé. La qualité actuelle est de 94 % d'exactitude. Proposez une démarche de distillation et les critères de décision.

<details>
<summary>Voir la solution</summary>

- Vérifier d'abord les **conditions d'utilisation** du fournisseur pour l'usage des sorties.
- Constituer 10 000 à 20 000 tickets **réels** variés (anonymisés), les faire classer par le grand modèle (professeur), **filtrer** les cas douteux (faible confiance, désaccord avec un second passage) et faire relire un échantillon.
- Fine-tuner un **petit modèle open-weight** (LoRA) sur ces paires ; garder un jeu de test **séparé**, étiqueté par des humains.
- Critères : exactitude de l'élève proche de 94 % (par exemple au moins 92 %, selon le coût d'une erreur), analyse **par catégorie** (pas de catégorie effondrée), coût total (inférence + hébergement + maintenance) nettement inférieur, latence acceptable.
- Prévoir une **surveillance** en production et un plan de ré-entraînement si les catégories évoluent.

</details>

## Exercice 3 : Construire des préférences

Les réponses de votre assistant sont correctes mais jugées trop longues et trop formelles par les utilisateurs. Comment construire un jeu de préférences pour DPO, et comment vérifier l'effet ?

<details>
<summary>Voir la solution</summary>

- Pour 1 000 à 2 000 demandes réelles, générer **deux réponses** (par exemple la réponse actuelle et une réponse obtenue avec un prompt « concis et chaleureux », ou deux échantillons différents).
- Choisir la préférée : par des **annotateurs** sur un échantillon, puis par un **LLM juge** validé contre ces annotations pour passer à l'échelle ; écarter les paires où les deux réponses sont trop proches ou toutes deux mauvaises.
- Vérifier que la réponse préférée reste **exacte** : on ne veut pas récompenser la concision au détriment du fond.
- Après l'entraînement : mesurer longueur moyenne, notes de ton, **exactitude** sur le jeu d'évaluation habituel (pas de régression), et éventuellement un test A/B en production.
- Avant tout cela, vérifier qu'une simple **modification du prompt** ne suffit pas (module 11, chapitre 1).

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Données synthétiques et distillation
center: Générer est facile ; la valeur est dans la diversité et le contrôle qualité.
points:
  - icon: sparkles
    title: Diversifier
    text: Dimensions, personas, ancrage dans le réel, génération inverse depuis les documents.
  - icon: filter
    title: Contrôler
    text: Déduplication, vérification objective, juge différent du générateur, revue humaine.
  - icon: alert
    title: Risques
    text: Uniformité, erreurs, biais, effondrement, contamination, licences.
  - icon: layers
    title: Distillation
    text: Professeur → élève sur une tâche étroite ; par les sorties ou les probabilités.
  - icon: scale
    title: DPO
    text: Paires préférée/rejetée pour le ton et le style, sans modèle de récompense.
pitfall: Un jeu d'évaluation 100 % synthétique qui mesure surtout la capacité à traiter des données écrites par un LLM.
remember: Toujours mélanger données réelles et synthétiques, et évaluer sur un jeu séparé et vérifié.
```
