---
title: Du modèle pré-entraîné à l'assistant
description: "Les grandes étapes de fabrication d'un LLM : pré-entraînement, ajustement aux instructions, alignement sur les préférences et entraînement au raisonnement."
duration: 50
objectives:
  - Décrire le pré-entraînement et ce qu'il apporte (et n'apporte pas)
  - Distinguer un modèle de base d'un modèle ajusté aux instructions
  - Expliquer le principe du RLHF, de la Constitutional AI et de DPO
  - Comprendre ce que sont les modèles de raisonnement et la date de coupure des connaissances
---

# Vue d'ensemble

Un assistant comme Claude, ChatGPT ou Gemini n'est pas le résultat d'un seul entraînement, mais d'une **succession d'étapes**. Chaque fournisseur a sa propre recette, dont tous les détails ne sont pas publics, mais les grandes phases sont bien documentées dans la littérature scientifique.

```diagram
type: flow
title: Les étapes de fabrication d'un assistant
steps:
  - title: Pré-entraînement
    text: Prédire le token suivant sur un très grand corpus
    tone: violet
  - title: Ajustement aux instructions
    text: Exemples de questions et de bonnes réponses (SFT)
    tone: blue
  - title: Alignement sur les préférences
    text: RLHF, IA constitutionnelle, DPO…
    tone: teal
  - title: Raisonnement
    text: Apprentissage par renforcement sur des tâches vérifiables
    tone: amber
  - title: Assistant
    text: Évalué, sécurisé, puis déployé
    tone: rose
```

# Le pré-entraînement

Le **pré-entraînement** est l'étape la plus coûteuse : le modèle apprend à **prédire le token suivant** sur un corpus gigantesque (pages web filtrées, livres, articles, code source…), qui se compte en milliers de milliards de tokens pour les grands modèles actuels. Elle mobilise des milliers de GPU pendant des semaines, voire des mois.

Ce qu'il apporte :

- la **maîtrise de la langue** (grammaire, style, plusieurs langues) ;
- une grande quantité de **connaissances** sur le monde ;
- des **capacités** émergentes : résumer, traduire, coder, raisonner dans une certaine mesure.

## Les lois d'échelle

Des travaux empiriques ont montré que la performance des modèles s'améliore de façon prévisible quand on augmente conjointement la taille du modèle, la quantité de données et le calcul (Kaplan et al., 2020). L'étude dite **Chinchilla** (Hoffmann et al., 2022) a montré que de nombreux modèles de l'époque étaient sous-entraînés et que, pour un budget de calcul donné, il valait mieux entraîner un modèle plus petit sur davantage de tokens : de l'ordre d'une vingtaine de tokens par paramètre pour un entraînement « optimal en calcul ». Depuis, beaucoup de modèles sont entraînés bien au-delà de ce ratio, car un modèle plus petit est moins cher à **utiliser** une fois déployé.

## Le modèle de base

Le résultat du pré-entraînement est un **modèle de base** (*base model*). Il complète du texte, mais ne suit pas les instructions de manière fiable. Si on lui écrit « Quelle est la capitale de la France ? », il peut très bien poursuivre avec d'autres questions de quiz, car c'est une continuation plausible d'une page web.

> [!NOTE]
> Certains fournisseurs de modèles open-weight publient à la fois la version de base et la version ajustée (souvent suffixée *Instruct* ou *Chat*). Pour construire une application, on utilise presque toujours la version ajustée.

# Ajustement aux instructions et alignement

## L'ajustement supervisé (SFT)

On poursuit l'entraînement sur un jeu, beaucoup plus petit, d'exemples **instruction → réponse de qualité**, souvent rédigés ou relus par des humains. Le modèle apprend le **format conversationnel** et le comportement attendu d'un assistant : répondre à la question posée, suivre les consignes, refuser certaines demandes.

## L'apprentissage par renforcement à partir de retours humains (RLHF)

Rédiger des réponses parfaites coûte cher ; **comparer** deux réponses est plus facile. Le RLHF, popularisé par les travaux d'OpenAI sur **InstructGPT** (Ouyang et al., 2022), fonctionne ainsi :

1. le modèle produit plusieurs réponses à une même consigne ;
2. des annotateurs humains indiquent laquelle ils **préfèrent** ;
3. on entraîne un **modèle de récompense** à prédire ces préférences ;
4. on optimise le LLM par **apprentissage par renforcement** pour maximiser cette récompense.

## L'IA constitutionnelle

Anthropic a proposé la **Constitutional AI** (Bai et al., 2022) : une partie des retours humains est remplacée par des retours produits par un modèle, guidé par un ensemble explicite de principes (une « constitution »). On parle plus généralement de **RLAIF** (*RL from AI Feedback*).

## DPO

**DPO** (*Direct Preference Optimization*, Rafailov et al., 2023) optimise directement le modèle à partir de paires de réponses préférée / rejetée, sans entraîner de modèle de récompense séparé ni recourir à une boucle d'apprentissage par renforcement classique. Plus simple à mettre en œuvre, cette méthode est très utilisée, notamment pour affiner des modèles open-weight.

> [!IMPORTANT]
> Ces étapes façonnent le **comportement** du modèle (ton, format, refus, honnêteté), mais n'ajoutent pas, pour l'essentiel, de nouvelles connaissances. C'est une idée clé pour le module 11 : le fine-tuning sert surtout à modifier un comportement ou un format, pas à « apprendre » une base documentaire, pour cela, on utilise plutôt le RAG.

# Les modèles de raisonnement

Depuis 2024, une nouvelle étape s'est généralisée : entraîner les modèles, par **apprentissage par renforcement**, à produire un **raisonnement** avant leur réponse finale, sur des tâches dont le résultat est **vérifiable** automatiquement (problèmes de mathématiques, code qui doit passer des tests…). OpenAI a présenté o1 en septembre 2024 ; DeepSeek a publié en janvier 2025 le modèle open-weight DeepSeek-R1 accompagné d'une description détaillée de sa méthode.

Pour l'utilisateur d'une API, cela se traduit par des modèles qui :

- **réfléchissent** avant de répondre, en produisant des tokens de raisonnement (souvent facturés comme des tokens de sortie, même lorsqu'ils ne sont pas affichés intégralement) ;
- obtiennent de meilleurs résultats sur les tâches complexes (mathématiques, programmation, planification) ;
- sont **plus lents et plus coûteux** par requête.

Les fournisseurs exposent des paramètres pour régler cet effort de réflexion. Chez Anthropic par exemple, les modèles récents proposent une réflexion **adaptative** et un niveau d'**effort** (`low`, `medium`, `high`…). Les noms et options exacts varient selon les fournisseurs et les versions : référez-vous à leur documentation.

# Les connaissances d'un modèle ont une date

Un modèle ne connaît que ce qui figurait dans ses données d'entraînement. Sa **date de coupure des connaissances** (*knowledge cutoff*) est la limite au-delà de laquelle il ne sait rien, sauf si on lui fournit l'information dans le prompt ou via des outils (recherche web, RAG).

Conséquences pratiques :

- ne comptez pas sur un modèle pour connaître les **dernières versions** d'une bibliothèque, des prix récents ou l'actualité ;
- fournissez-lui la **date du jour** si la tâche en dépend ;
- pour des informations à jour ou propres à votre entreprise, utilisez le **RAG** (module 5) ou des **outils** (module 4).

> [!WARNING]
> Un modèle peut répondre avec assurance à une question portant sur des événements postérieurs à sa date de coupure, en inventant une réponse plausible. Ne confondez pas aisance et exactitude.

# Exercices

## Exercice 1 : Remettre dans l'ordre

Remettez ces étapes dans l'ordre habituel : alignement sur les préférences ; pré-entraînement ; ajustement supervisé aux instructions ; déploiement.

<details>
<summary>Voir la solution</summary>

Pré-entraînement → ajustement supervisé aux instructions (SFT) → alignement sur les préférences (RLHF, DPO…) → déploiement. L'entraînement au raisonnement, quand il existe, intervient lui aussi après le pré-entraînement.

</details>

## Exercice 2 : Modèle de base ou modèle ajusté ?

Vous téléchargez deux versions d'un modèle open-weight : `Modele-8B` et `Modele-8B-Instruct`. Laquelle choisir pour un chatbot de support client, et pourquoi ? Dans quel cas la version de base pourrait-elle être pertinente ?

<details>
<summary>Voir la solution</summary>

Pour un chatbot, la version **Instruct** : elle suit les consignes et adopte le format conversationnel. La version de base peut servir de point de départ à un fine-tuning complet avec votre propre recette d'ajustement, ou à des tâches de pure complétion de texte (par exemple l'autocomplétion), mais c'est un usage plus avancé.

</details>

## Exercice 3 : Diagnostiquer une réponse

Un utilisateur demande à votre assistant : « Quelle est la dernière version de la bibliothèque X ? » L'assistant répond avec un numéro de version, sans hésitation, mais celui-ci est dépassé. Expliquez pourquoi et proposez une solution.

<details>
<summary>Voir la solution</summary>

L'information demandée est probablement **postérieure à la date de coupure** des connaissances du modèle, qui produit alors la réponse la plus plausible d'après ses données d'entraînement. Solutions : donner au modèle un **outil** de recherche (registre de paquets, recherche web) ou un **contexte à jour** via RAG, et lui demander dans le prompt de signaler qu'il ne peut pas connaître les versions récentes quand il n'a pas d'outil à disposition.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Du modèle pré-entraîné à l'assistant
center: Un assistant naît d'un pré-entraînement massif, puis d'étapes qui façonnent son comportement.
points:
  - icon: database
    title: Le pré-entraînement
    text: Prédire le token suivant sur des milliers de milliards de tokens ; c'est l'étape la plus coûteuse.
  - icon: book
    title: Le modèle de base
    text: Il complète du texte mais ne suit pas les consignes ; on utilise la version Instruct.
  - icon: users
    title: SFT et préférences
    text: Exemples instruction → réponse, puis RLHF, IA constitutionnelle ou DPO.
  - icon: brain
    title: Les modèles de raisonnement
    text: Entraînés à réfléchir avant de répondre ; meilleurs sur les tâches difficiles, plus lents.
  - icon: clock
    title: La date de coupure
    text: Le modèle ignore ce qui est postérieur à ses données d'entraînement.
pitfall: Croire qu'un modèle connaît l'actualité ou les dernières versions d'une bibliothèque.
remember: L'alignement façonne le comportement ; pour des connaissances à jour, on apporte le contexte (RAG, outils).
```
