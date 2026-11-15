---
title: Prompt, RAG ou fine-tuning ?
description: Comprendre ce que le fine-tuning apporte vraiment, le comparer aux autres leviers et préparer un jeu de données de qualité.
duration: 45
objectives:
  - Distinguer ce que le fine-tuning améliore de ce qu'il n'améliore pas
  - Choisir entre prompt engineering, RAG et fine-tuning
  - Connaître les principales formes d'adaptation des modèles
  - Préparer un jeu de données d'ajustement de qualité
---

# Ce que fait le fine-tuning

Le **fine-tuning** (ajustement fin) poursuit l'entraînement d'un modèle déjà entraîné sur un jeu de données spécifique, pour **modifier son comportement**. Comme vu au module 3, c'est ainsi que les modèles de base deviennent des assistants.

Ce que le fine-tuning **fait bien** :

- imposer un **format** ou un **style** de façon très constante (ton de marque, structure de réponse) ;
- améliorer une **tâche étroite et répétitive** (classification spécialisée, extraction dans un domaine particulier) ;
- **réduire la longueur des prompts** : des comportements qui demandaient de longues instructions et de nombreux exemples deviennent implicites ;
- permettre à un **petit modèle** d'atteindre, sur une tâche précise, la qualité d'un plus grand (distillation), avec moins de coût et de latence.

Ce qu'il **fait mal** :

- **ajouter des connaissances** factuelles fiables et à jour : le modèle risque d'halluciner des détails, les mises à jour imposent un nouvel entraînement, et il ne peut pas citer ses sources ;
- **corriger un problème mal compris** : si l'on ne sait pas pourquoi le système échoue, l'entraînement risque de masquer le problème plutôt que de le résoudre.

# Choisir le bon levier

```diagram
type: decision
title: Quel levier actionner ?
nodes:
  - question: Le problème vient-il d'instructions mal comprises ou d'un format mal respecté ?
    yes: Améliorer le prompt (consignes, exemples, sorties structurées) et mesurer
    no: Continuer le diagnostic
  - question: Le modèle manque-t-il d'informations (documents internes, données récentes) ?
    yes: "RAG ou outils : pas de fine-tuning pour cela"
    no: Continuer le diagnostic
  - question: Un comportement ou un style constant est-il requis, malgré un bon prompt, ou faut-il réduire coût et latence sur une tâche étroite et volumineuse ?
    yes: Le fine-tuning devient pertinent, avec un jeu de données et une évaluation solides
    no: Revoir l'analyse d'erreurs avant d'aller plus loin
```

| Critère | Prompt engineering | RAG | Fine-tuning |
|---|---|---|---|
| Coût de mise en place | Faible | Moyen | Élevé (données, calcul, compétences) |
| Délai | Heures | Jours | Semaines |
| Ajout de connaissances | Limité au contexte | Oui, à jour, avec sources | Mal adapté |
| Modification du comportement | Bonne | Faible | Très bonne |
| Mise à jour | Immédiate | Immédiate (réindexation) | Nouvel entraînement |

Ces leviers se **combinent** : un modèle ajusté pour respecter un format et un ton peut tout à fait être utilisé dans un pipeline RAG.

> [!IMPORTANT]
> Avant un fine-tuning, épuisez les leviers simples **et mesurez-les**. Le fine-tuning n'est pertinent que si vous disposez d'une **évaluation** fiable pour prouver qu'il apporte un gain, et d'un **jeu de données** de qualité suffisante.

# Les formes d'adaptation

- **Fine-tuning supervisé (SFT)** : on entraîne sur des paires entrée → sortie attendue. C'est la forme la plus courante.
- **Ajustement sur des préférences** (par exemple DPO, module 3) : on entraîne sur des paires de réponses préférée / rejetée, pour affiner un comportement subtil (ton, niveau de détail).
- **Fine-tuning complet** : tous les paramètres sont modifiés. Coûteux en mémoire et en calcul.
- **Fine-tuning efficace en paramètres (PEFT)**, dont **LoRA** et **QLoRA** : on n'entraîne qu'une petite fraction de paramètres ajoutés. C'est l'approche standard pour les modèles open-weight (chapitre suivant).

Deux façons d'y accéder :

- par une **API de fine-tuning** proposée par certains fournisseurs ou plateformes cloud (on envoie ses données, le fournisseur entraîne et héberge le modèle ajusté) : l'offre et les modèles éligibles varient selon les fournisseurs et évoluent dans le temps ;
- sur des **modèles open-weight**, avec ses propres GPU ou des GPU loués, et des bibliothèques comme Hugging Face Transformers, TRL et PEFT.

> [!WARNING]
> La **distillation** (générer des données d'entraînement avec un grand modèle propriétaire pour entraîner un petit modèle) peut être limitée par les **conditions d'utilisation** de certains fournisseurs, notamment pour entraîner des modèles concurrents. Vérifiez-les avant de vous lancer.

# Préparer les données

La qualité des données est **le** facteur déterminant. Quelques centaines d'exemples **excellents** valent mieux que des dizaines de milliers d'exemples médiocres.

## Le format

Les données d'ajustement pour un modèle conversationnel sont généralement des conversations au format **JSONL** (un objet JSON par ligne), avec des rôles :

```json
{"messages": [{"role": "system", "content": "Tu classes les tickets de support."}, {"role": "user", "content": "Ma facture de mars est en double."}, {"role": "assistant", "content": "{\"categorie\": \"facturation\", \"urgence\": \"moyenne\"}"}]}
{"messages": [{"role": "system", "content": "Tu classes les tickets de support."}, {"role": "user", "content": "L'application plante au démarrage depuis la mise à jour."}, {"role": "assistant", "content": "{\"categorie\": \"technique\", \"urgence\": \"haute\"}"}]}
```

Le format exact dépend de l'outil ou du fournisseur : consultez sa documentation.

## Les bonnes pratiques

- **Représentativité** : les exemples couvrent la diversité réelle des entrées, y compris les cas difficiles.
- **Cohérence** : des cas similaires ont des sorties cohérentes ; des annotations contradictoires dégradent l'apprentissage.
- **Exactitude** : chaque sortie est **relue** ; le modèle reproduira fidèlement les erreurs du jeu de données.
- **Séparation** : gardez un jeu de **validation** (pour suivre l'entraînement) et un jeu de **test** jamais utilisé à l'entraînement (pour l'évaluation finale), comme au module 2.
- **Conformité** : les données de production utilisées doivent l'être dans le respect de la vie privée et des droits (consentement, anonymisation).
- **Déduplication** : les doublons faussent l'entraînement et l'évaluation.

# Exercices

## Exercice 1 : Choisir le levier

Pour chaque problème, indiquez le levier le plus adapté (prompt, RAG, fine-tuning) :

1. L'assistant ignore les nouveautés du catalogue de ce mois-ci.
2. Le modèle ne respecte pas toujours le format JSON demandé.
3. Après de nombreuses itérations de prompt, le ton des réponses reste irrégulier et ne correspond pas à la charte de marque très particulière de l'entreprise ; vous disposez de 2 000 réponses validées par l'équipe éditoriale.
4. Vous devez classer 5 millions de documents par mois dans 40 catégories internes, et le grand modèle utilisé coûte trop cher.

<details>
<summary>Voir la solution</summary>

1. **RAG** (ou outil d'accès au catalogue) : il s'agit d'informations nouvelles.
2. **Prompt + sorties structurées** : le format se garantit par un schéma, pas par un entraînement.
3. **Fine-tuning** : comportement constant difficile à obtenir par le prompt, données de qualité disponibles.
4. **Fine-tuning d'un petit modèle** (éventuellement à partir de sorties validées du grand modèle, en respectant les conditions d'utilisation), à comparer avec un petit modèle généraliste bien instruit et avec le traitement par lots. Décision à prendre sur la base d'une évaluation de qualité et de coût.

</details>

## Exercice 2 : Auditer un jeu de données

Un jeu de données de classification contient ces exemples. Identifiez les problèmes :

- « Je n'arrive pas à me connecter » → technique
- « Impossible de me connecter à mon compte » → facturation
- « Je n'arrive pas à me connecter » → technique
- « Quand arrive ma commande ??? » → livraison
- « Bonjour » → technique

<details>
<summary>Voir la solution</summary>

- **Incohérence** : deux demandes de connexion presque identiques sont classées différemment (technique / facturation).
- **Doublon** : « Je n'arrive pas à me connecter » apparaît deux fois.
- **Étiquette discutable** : « Bonjour » n'a pas d'intention identifiable ; « technique » est arbitraire. Il faudrait une catégorie « autre » ou « indéterminé ».
- Le jeu manque probablement de **diversité** (une seule demande de livraison).

</details>

## Exercice 3 : Plan de fine-tuning

Rédigez les grandes étapes d'un projet de fine-tuning pour le cas 3 de l'exercice 1, de la préparation à la mise en production.

<details>
<summary>Voir une proposition de solution</summary>

1. **Évaluation de référence** : mesurer le système actuel (prompt seul) sur un jeu de test annoté par l'équipe éditoriale, avec des critères de ton précis (juge LLM validé + relecture humaine).
2. **Préparation des données** : nettoyer, dédupliquer et vérifier les 2 000 réponses ; séparer entraînement, validation et test.
3. **Entraînement** : via une API de fine-tuning ou un modèle open-weight avec LoRA ; suivre la perte de validation pour éviter le surapprentissage.
4. **Évaluation** : comparer le modèle ajusté au système de référence sur le jeu de test (ton, mais aussi exactitude et respect des consignes, qui peuvent se dégrader).
5. **Déploiement progressif** sur une partie du trafic, avec supervision.
6. **Maintenance** : réentraîner quand la charte évolue ou quand un nouveau modèle de base, plus performant, est disponible.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Prompt, RAG ou fine-tuning ?
center: Le fine-tuning change un comportement ; il ne sert pas à stocker des connaissances.
points:
  - icon: idea
    title: Ce qu'il fait bien
    text: Style ou format constant, tâche étroite, prompts plus courts, petit modèle spécialisé.
  - icon: alert
    title: Ce qu'il fait mal
    text: Connaissances à jour et citables, c'est le rôle du RAG.
  - icon: list
    title: L'ordre des leviers
    text: Prompt et sorties structurées, puis RAG ou outils, puis fine-tuning.
  - icon: file
    title: Des données excellentes
    text: Quelques centaines d'exemples relus, cohérents, dédupliqués, au format JSONL.
  - icon: scale
    title: Conditions d'utilisation
    text: La distillation peut être restreinte par les conditions des fournisseurs.
pitfall: Lancer un fine-tuning sans évaluation de référence ni jeu de test réservé.
remember: Pas de fine-tuning sans données de qualité et sans une évaluation qui prouve le gain.
```
