---
title: Fine-tuning efficace avec LoRA et QLoRA
description: Le principe des adaptateurs de rang faible, la quantification pendant l'entraînement, et un fine-tuning complet avec Hugging Face TRL et PEFT.
duration: 60
objectives:
  - Expliquer le principe mathématique de LoRA et son intérêt
  - Calculer le nombre de paramètres entraînables d'un adaptateur
  - Comprendre l'apport de QLoRA
  - Configurer et lancer un fine-tuning avec TRL et PEFT
  - Évaluer et déployer un modèle ajusté
---

# Le problème du fine-tuning complet

Ajuster **tous** les paramètres d'un modèle de plusieurs milliards de paramètres demande énormément de mémoire : il faut stocker les poids, leurs gradients et l'état de l'optimiseur (AdamW conserve deux valeurs supplémentaires par paramètre). Pour un modèle de 8 milliards de paramètres, cela représente bien plus de 100 Go de mémoire GPU, hors données d'activation. Et chaque version ajustée est une **copie complète** du modèle à stocker et à servir.

Les méthodes de **fine-tuning efficace en paramètres** (*Parameter-Efficient Fine-Tuning*, PEFT) n'entraînent qu'une petite fraction de paramètres. La plus utilisée est **LoRA**.

# Le principe de LoRA

**LoRA** (*Low-Rank Adaptation*, Hu et al., 2021) part d'une observation : la **modification** à apporter aux poids lors d'un fine-tuning peut être bien approximée par une matrice de **rang faible**.

Au lieu de modifier une matrice de poids W (de taille d × k), on la **gèle** et on lui ajoute le produit de deux petites matrices entraînables :

> W' = W + (α / r) · B · A, avec B de taille d × r et A de taille r × k, et r très petit devant d et k

```diagram
type: custom
name: lora
caption: "Les poids d'origine W restent gelés. Seules les deux petites matrices B et A sont entraînées ; leur produit B·A a la même taille que W mais un rang r très faible (par exemple 8 ou 16)."
```

Conséquences :

- **beaucoup moins de paramètres entraînables**, donc beaucoup moins de mémoire pour les gradients et l'optimiseur ;
- un **adaptateur** léger (quelques mégaoctets à quelques centaines de mégaoctets) au lieu d'une copie complète du modèle ;
- la possibilité de **fusionner** l'adaptateur dans les poids (W' calculé une fois pour toutes, sans coût à l'inférence), ou de garder **plusieurs adaptateurs** pour un même modèle de base et de les charger selon le client ou la tâche (des moteurs comme vLLM savent servir plusieurs adaptateurs LoRA).

## Les hyperparamètres de LoRA

| Paramètre | Rôle | Valeurs courantes |
|---|---|---|
| `r` (rang) | Capacité de l'adaptateur | 8 à 64 |
| `lora_alpha` | Facteur d'échelle (α / r) appliqué à B·A | souvent égal à r ou à 2r |
| `lora_dropout` | Régularisation | 0 à 0,1 |
| `target_modules` | Couches modifiées | projections de l'attention, souvent aussi les couches denses (MLP) |
| Taux d'apprentissage | Taille des pas | de l'ordre de 1e-4 à 2e-4 pour LoRA (plus élevé qu'en fine-tuning complet) |

Ces valeurs sont des **points de départ** issus de la pratique, pas des règles : on les ajuste en suivant la perte de validation et, surtout, l'évaluation finale.

```video
url: https://www.youtube.com/watch?v=t509sv5MT0w
title: "LoRA explained (and a bit about precision and quantization)"
channel: "DeepFindr"
duration: "17:06"
lang: en
why: "Les matrices de faible rang de LoRA, puis la précision numérique et la quantification : exactement le pont entre cette section et la suivante sur QLoRA."
```

# QLoRA

**QLoRA** (Dettmers et al., 2023) combine LoRA et **quantification** : le modèle de base, gelé, est chargé en **4 bits** (avec un format conçu pour l'occasion, NF4), tandis que les adaptateurs LoRA sont entraînés en précision plus élevée. L'article montrait qu'il devenait possible d'ajuster un modèle de 65 milliards de paramètres sur un seul GPU de 48 Go, avec une qualité proche d'un fine-tuning en 16 bits.

En pratique, QLoRA permet d'ajuster des modèles de quelques milliards de paramètres sur un **GPU grand public** ou un GPU loué à l'heure, ce qui a largement démocratisé le fine-tuning. La contrepartie : un entraînement un peu plus lent, et une légère perte de qualité possible selon les cas.

```diagram
type: compare
title: Trois façons d'ajuster un modèle
columns:
  - title: Fine-tuning complet
    tone: rose
    items:
      - Tous les paramètres sont entraînés
      - Mémoire très importante
      - Une copie complète par version
  - title: LoRA
    tone: violet
    items:
      - Modèle gelé en 16 bits, adaptateurs entraînés
      - Mémoire fortement réduite
      - Adaptateurs légers et interchangeables
  - title: QLoRA
    tone: teal
    items:
      - Modèle gelé quantifié en 4 bits, adaptateurs entraînés
      - Mémoire minimale
      - Accessible sur un seul GPU
```

# Un fine-tuning avec TRL et PEFT

L'écosystème Hugging Face fournit les briques nécessaires : **Transformers** (modèles), **Datasets** (données), **PEFT** (LoRA) et **TRL** (entraîneurs pour le fine-tuning supervisé et l'ajustement sur préférences). Voici le squelette d'un fine-tuning supervisé avec LoRA sur des données au format conversationnel (JSONL avec un champ `messages`, comme au chapitre précédent).

```python
# pip install transformers datasets peft trl accelerate
from datasets import load_dataset
from peft import LoraConfig
from trl import SFTConfig, SFTTrainer

MODELE_DE_BASE = "<identifiant-d-un-modele-instruct-sur-hugging-face>"

donnees = load_dataset("json", data_files={"train": "train.jsonl", "validation": "validation.jsonl"})

config_lora = LoraConfig(
    r=16,
    lora_alpha=32,
    lora_dropout=0.05,
    target_modules="all-linear",  # toutes les couches linéaires du modèle
    task_type="CAUSAL_LM",
)

config_entrainement = SFTConfig(
    output_dir="modele-ajuste",
    num_train_epochs=2,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,   # taille de lot effective : 16
    learning_rate=2e-4,
    eval_strategy="steps",
    eval_steps=50,
    logging_steps=10,
    save_strategy="steps",
    save_steps=50,
    load_best_model_at_end=True,     # garde le point de contrôle avec la meilleure perte de validation
)

entraineur = SFTTrainer(
    model=MODELE_DE_BASE,
    args=config_entrainement,
    train_dataset=donnees["train"],
    eval_dataset=donnees["validation"],
    peft_config=config_lora,
)
entraineur.train()
entraineur.save_model("modele-ajuste/final")  # enregistre l'adaptateur LoRA
```

Pour QLoRA, on charge en plus le modèle de base en 4 bits (via `BitsAndBytesConfig` de Transformers et la bibliothèque bitsandbytes) avant de le passer à l'entraîneur.

> [!NOTE]
> Ces bibliothèques évoluent rapidement et leurs paramètres changent parfois de nom d'une version à l'autre. Référez-vous à la documentation de la version installée (TRL, PEFT, Transformers) et partez de leurs exemples officiels. Des outils comme Unsloth ou Axolotl proposent également des configurations prêtes à l'emploi et optimisées.

# Évaluer et déployer

## Surveiller l'entraînement

- La **perte d'entraînement** doit baisser ; la **perte de validation** aussi, puis se stabiliser. Si elle remonte, c'est du **surapprentissage** (module 2) : réduire le nombre d'époques, le taux d'apprentissage ou le rang, ou enrichir les données.
- Une perte qui diverge (augmente brutalement) signale souvent un taux d'apprentissage trop élevé ou un problème de données.

## Évaluer le modèle ajusté

La perte ne suffit pas. Évaluez le modèle sur le **jeu de test** réservé, avec les **mêmes critères** que le système de référence (prompt seul) :

- le gain attendu est-il au rendez-vous (format, ton, exactitude de la tâche) ?
- d'autres capacités se sont-elles **dégradées** ? Un fine-tuning étroit peut faire « oublier » au modèle certaines compétences générales (on parle d'**oubli catastrophique**), ou affaiblir son respect des consignes de sécurité. Incluez des cas hors de la tâche principale dans l'évaluation.

## Déployer

- **Fusionner** l'adaptateur dans le modèle de base pour un déploiement simple, ou le **servir séparément** (plusieurs adaptateurs sur un même modèle de base).
- Éventuellement **quantifier** le modèle final pour l'inférence (module 10).
- Déployer **progressivement**, superviser, et prévoir un **retour arrière** vers le système précédent.

# Exercices

## Exercice 1 : Compter les paramètres

Une matrice de poids fait 4 096 × 4 096. Combien de paramètres compte-t-elle ? Combien de paramètres entraînables ajoute un adaptateur LoRA de rang 8 ? Quel pourcentage cela représente-t-il ?

<details>
<summary>Voir la solution</summary>

- Matrice complète : 4 096 × 4 096 = **16 777 216** paramètres.
- LoRA de rang 8 : B (4 096 × 8) + A (8 × 4 096) = 32 768 + 32 768 = **65 536** paramètres.
- Soit 65 536 / 16 777 216 ≈ **0,39 %** des paramètres de la matrice.

</details>

## Exercice 2 : Diagnostiquer une courbe

Pendant un fine-tuning LoRA, la perte de validation baisse jusqu'à l'étape 300, puis remonte régulièrement jusqu'à l'étape 1 200, alors que la perte d'entraînement continue de baisser. Que se passe-t-il et que faites-vous ?

<details>
<summary>Voir la solution</summary>

C'est du **surapprentissage** à partir de l'étape 300 environ. Actions : retenir le point de contrôle de l'étape 300 (c'est ce que fait `load_best_model_at_end=True` en se basant sur la perte de validation) ; pour les entraînements suivants, réduire le nombre d'époques ou le taux d'apprentissage, augmenter le dropout ou réduire le rang, et surtout vérifier la **diversité** et le **volume** des données. Puis évaluer ce point de contrôle sur le jeu de test.

</details>

## Exercice 3 : Choisir la méthode

Vous disposez d'un seul GPU de 24 Go et souhaitez ajuster un modèle de 8 milliards de paramètres. Fine-tuning complet, LoRA ou QLoRA ? Justifiez avec un calcul approximatif.

<details>
<summary>Voir la solution</summary>

- **Fine-tuning complet** : impossible. Rien que les poids en BF16 occupent environ 16 Go ; il faut y ajouter les gradients (environ 16 Go) et l'état d'AdamW (environ 32 Go ou plus), soit bien au-delà de 24 Go.
- **LoRA** sur le modèle en BF16 : les poids gelés occupent déjà environ 16 Go ; avec les activations, cela peut tenir pour de courtes séquences et de petits lots, mais c'est juste.
- **QLoRA** : modèle de base en 4 bits, environ 5 Go, ce qui laisse une marge confortable pour les activations, les adaptateurs et des séquences plus longues. C'est le choix le plus sûr sur ce matériel.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Fine-tuning efficace avec LoRA et QLoRA
center: Geler le modèle et n'entraîner que de petites matrices de rang faible.
points:
  - icon: puzzle
    title: Le principe de LoRA
    text: W′ = W + (α / r) · B · A ; une fraction minime de paramètres entraînables.
  - icon: layers
    title: Des adaptateurs légers
    text: Fusionnables dans les poids ou interchangeables sur un même modèle de base.
  - icon: cpu
    title: QLoRA
    text: "Modèle de base en 4 bits et adaptateurs entraînés : accessible sur un seul GPU."
  - icon: tool
    title: TRL et PEFT
    text: SFTConfig + LoraConfig + SFTTrainer ; la documentation de la version installée fait foi.
  - icon: chart
    title: Surveiller la validation
    text: Retenir le meilleur point de contrôle ; vérifier l'absence d'oubli catastrophique.
pitfall: Juger un modèle ajusté sur sa seule perte d'entraînement, sans tester ses autres capacités.
remember: Le fine-tuning se conclut par une évaluation complète, puis un déploiement progressif réversible.
```
