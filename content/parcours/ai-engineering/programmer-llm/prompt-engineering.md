---
title: Prompt engineering
description: Rédiger des instructions claires et robustes (contexte, exemples, structure, raisonnement) et itérer de manière méthodique.
duration: 60
objectives:
  - Rédiger un prompt clair, contextualisé et précis sur le format attendu
  - Utiliser des exemples (few-shot) et des balises pour structurer un prompt
  - Savoir quand demander un raisonnement avant la réponse
  - Itérer sur un prompt avec une méthode mesurable
---

# Qu'est-ce qu'un bon prompt ?

Le **prompt engineering** est l'art de formuler les instructions données à un modèle pour obtenir de façon **fiable** le résultat attendu. Ce n'est pas une collection de formules magiques : c'est avant tout de la **communication claire**, comme on briefe un collègue compétent qui ne connaît rien de votre projet.

Le meilleur test : **si vous donniez ce prompt à une personne intelligente découvrant le sujet, saurait-elle exactement quoi faire ?** Si la réponse est non, le modèle hésitera aussi.

```diagram
type: layers
title: Anatomie d'un prompt efficace
layers:
  - title: Rôle et objectif
    text: Qui est l'assistant, quel est le but final et pour qui
  - title: Contexte
    text: Informations nécessaires, données, documents, contraintes métier
  - title: Tâche
    text: Ce qu'il faut faire, étape par étape si nécessaire
  - title: Règles et cas limites
    text: Ce qu'il faut éviter, que faire en cas de doute ou d'information manquante
  - title: Format de sortie
    text: Structure, longueur, langue, ton, avec un exemple si possible
```

# Les principes essentiels

## 1. Être clair, précis et direct

| Prompt vague | Prompt précis |
|---|---|
| « Résume ce texte. » | « Résume ce compte rendu de réunion en 5 puces maximum, destinées à un directeur qui n'y était pas. Mets en avant les décisions prises et les actions avec leur responsable. » |
| « Écris du code pour trier. » | « Écris une fonction Python typée qui trie une liste de dictionnaires par la clé `date` (format ISO 8601), du plus récent au plus ancien, sans modifier la liste d'origine. » |

## 2. Donner le contexte et la raison

Expliquer **pourquoi** une règle existe aide le modèle à l'appliquer intelligemment aux cas imprévus.

- Moins bien : « N'utilise jamais de jargon. »
- Mieux : « Nos lecteurs sont des clients non techniques qui découvrent le produit : évite le jargon, et si un terme technique est indispensable, explique-le en une phrase. »

## 3. Dire quoi faire, pas seulement quoi éviter

Les instructions positives sont plus efficaces : « Réponds en paragraphes rédigés » fonctionne mieux que « N'utilise pas de listes à puces ».

## 4. Prévoir les cas limites

Que doit faire le modèle si l'information manque, si la question sort du périmètre, si le document est vide ? Dites-le explicitement, par exemple : « Si la réponse ne figure pas dans les documents fournis, réponds : “Je ne trouve pas cette information dans la documentation.” »

> [!TIP]
> Les modèles récents suivent les instructions de façon très **littérale et précise**. Un prompt écrit pour d'anciens modèles, plein de MAJUSCULES et de « TRÈS IMPORTANT », peut provoquer des comportements excessifs. Un ton calme et des explications claires fonctionnent mieux.

# Structurer avec des exemples et des balises

## Les exemples (few-shot)

Montrer **quelques exemples** d'entrée et de sortie attendue est l'une des techniques les plus efficaces pour obtenir un format et un style constants.

```text
Classe le sentiment de l'avis client : positif, négatif ou mitigé.

<exemples>
<exemple>
Avis : « Livraison rapide, produit conforme. »
Sentiment : positif
</exemple>
<exemple>
Avis : « Bonne qualité mais beaucoup trop cher. »
Sentiment : mitigé
</exemple>
<exemple>
Avis : « Cassé à l'arrivée, aucune réponse du service client. »
Sentiment : négatif
</exemple>
</exemples>

Avis : « {avis} »
Sentiment :
```

Bonnes pratiques : des exemples **variés** (pour éviter que le modèle ne copie un détail superficiel), **représentatifs** des cas réels, y compris des cas difficiles, et clairement séparés des instructions.

## Les balises

Délimiter les différentes parties du prompt avec des **balises** de type XML (`<document>`, `<instructions>`, `<exemples>`) aide le modèle à distinguer instructions, données et exemples. C'est aussi une première protection : le contenu d'un document est clairement identifié comme une **donnée**, pas comme une instruction (le module 9 montre que cela ne suffit pas contre les injections de prompt, mais c'est une bonne base).

```text
<document>
{contenu_du_contrat}
</document>

À partir du document ci-dessus, liste les obligations du prestataire.
Pour chaque obligation, cite le passage exact entre balises <citation>.
```

> [!NOTE]
> Pour les **longs documents**, la documentation d'Anthropic recommande de placer les documents **en haut** du prompt et la question ou les instructions **à la fin**, ce qui améliore généralement la qualité des réponses.

```video
url: https://www.youtube.com/watch?v=ysPbXH0LpIE
title: "Prompting 101 | Code w/ Claude"
channel: "Anthropic"
duration: "24:53"
lang: en
why: "L'équipe d'Anthropic construit un prompt pas à pas devant vous : rôle, contexte, exemples et balises, les principes de ce chapitre mis en pratique."
```

# Faire réfléchir le modèle

Pour une tâche qui demande du raisonnement (analyse, calcul, décision en plusieurs critères), demander au modèle de **réfléchir avant de répondre** améliore souvent la qualité. Cette technique, appelée **chaîne de pensée** (*chain-of-thought*), a été étudiée notamment par Wei et al. (2022). Elle fonctionne parce que, comme vu au module 3, chaque token généré donne au modèle du « calcul » supplémentaire.

Deux manières de l'obtenir :

1. **Les modèles de raisonnement**, qui réfléchissent nativement avant de répondre : on règle la profondeur via les paramètres de l'API (niveau d'effort, réflexion adaptative). C'est l'approche à privilégier quand elle est disponible.
2. **Le prompt** : demander d'écrire le raisonnement dans des balises (par exemple `<analyse>`), puis la réponse finale dans d'autres (`<reponse>`), ce qui permet de n'afficher que la réponse à l'utilisateur.

```text
Analyse la demande de remboursement ci-dessous selon notre politique.
Raisonne d'abord dans des balises <analyse> : vérifie chaque condition de la politique.
Puis donne ta décision dans des balises <decision> : « accepté » ou « refusé », suivie d'une justification d'une phrase.
```

> [!WARNING]
> Le raisonnement affiché n'est pas une garantie : il peut contenir des erreurs ou ne pas refléter exactement la manière dont la réponse a été produite. Les décisions importantes doivent être **vérifiées**, pas seulement justifiées.

# Les techniques avancées

## Découper en plusieurs prompts

Une tâche complexe gagne souvent à être découpée en **étapes successives**, chacune avec un prompt simple : extraire → analyser → rédiger. On appelle cela le **chaînage de prompts** (*prompt chaining*), étudié au module 6. Chaque étape est plus facile à tester et à améliorer.

## Contrôler le format de sortie

- Décrire précisément le format attendu, avec un exemple.
- Pour du JSON exploitable par du code, utiliser les **sorties structurées** de l'API plutôt que de compter sur le prompt seul (chapitre suivant).

> [!NOTE]
> Une ancienne technique consistait à « pré-remplir » le début de la réponse de l'assistant (par exemple avec `{`) pour forcer un format. Elle n'est plus prise en charge par les modèles Claude récents (l'API renvoie une erreur). Utilisez les sorties structurées ou des instructions de format à la place.

## Gérer les prompts comme du code

- **Gabarits** (*templates*) avec des variables clairement identifiées (`{avis}`, `{document}`).
- **Versionnement** dans Git et identifiant de version enregistré dans les journaux.
- **Évaluation** à chaque modification (module 8).

# Une méthode pour itérer

Le prompt engineering est un processus **empirique**. Sans mesure, on tourne en rond : on corrige un cas et on en casse un autre sans s'en rendre compte.

```diagram
type: flow
title: Itérer sur un prompt
loop: Jusqu'à atteindre les critères de succès
steps:
  - title: Jeu de tests
    text: 20 à 50 cas représentatifs, avec résultats attendus
  - title: Version du prompt
    text: Une modification à la fois
  - title: Exécution
    text: Sur tous les cas, pas seulement celui qui posait problème
  - title: Analyse
    text: Score global et lecture des échecs
```

1. Rassemblez des **cas de test** représentatifs, avec la sortie attendue ou des critères de réussite.
2. Écrivez une première version simple du prompt.
3. Exécutez-la sur **tous** les cas et mesurez.
4. **Lisez les échecs** : quelle instruction manque, est ambiguë ou contradictoire ?
5. Modifiez **une chose à la fois** et recommencez.

# Exercices

## Exercice 1 : Réécrire un prompt

Améliorez ce prompt destiné à un assistant interne : « Réponds aux questions des employés sur les congés. »

<details>
<summary>Voir une proposition de solution</summary>

```text
Tu es l'assistant RH interne de l'entreprise. Tu réponds aux questions des employés
sur les congés (congés payés, RTT, congés exceptionnels).

<politique_conges>
{texte_de_la_politique}
</politique_conges>

Règles :
- Appuie-toi uniquement sur la politique ci-dessus ; cite la section concernée.
- Si la question n'est pas couverte, réponds : « Ce point n'est pas couvert par la politique ;
  contactez le service RH à rh@exemple.com. » N'invente jamais de règle.
- Si la question concerne une situation personnelle sensible (santé, conflit), oriente vers le service RH.
- Réponds en français, en 3 à 6 phrases, sur un ton cordial et professionnel.
```

Les améliorations : rôle et public précisés, source d'information fournie et délimitée, comportement en cas d'information manquante, cas sensibles, format et ton.

</details>

## Exercice 2 : Concevoir un prompt few-shot

Concevez un prompt qui extrait de courriels de clients la **catégorie** (livraison, facturation, produit, autre) et le **niveau d'urgence** (faible, moyen, élevé). Incluez trois exemples variés et précisez le format de sortie.

<details>
<summary>Voir une proposition de solution</summary>

```text
Analyse le courriel du client et détermine sa catégorie et son urgence.

Catégories : livraison, facturation, produit, autre.
Urgence : élevé si le client est bloqué ou menace de partir, moyen s'il attend une action,
faible pour une simple question.

<exemples>
<exemple>
Courriel : « Ma commande devait arriver lundi, toujours rien. J'en ai besoin pour demain ! »
Résultat : catégorie=livraison ; urgence=élevé
</exemple>
<exemple>
Courriel : « Pourriez-vous m'envoyer une copie de la facture de mars ? »
Résultat : catégorie=facturation ; urgence=faible
</exemple>
<exemple>
Courriel : « Le chargeur reçu ne fonctionne pas avec mon modèle, que faire ? »
Résultat : catégorie=produit ; urgence=moyen
</exemple>
</exemples>

<courriel>
{courriel}
</courriel>

Réponds uniquement sur une ligne au format : catégorie=<catégorie> ; urgence=<urgence>
```

Pour un traitement automatique fiable, on préférera ensuite une **sortie structurée** validée par un schéma (chapitre suivant).

</details>

## Exercice 3 : Itérer avec méthode

Vous avez modifié votre prompt de classification pour corriger un cas mal classé signalé par un utilisateur. Le cas est désormais correct. Pouvez-vous déployer la nouvelle version ? Que faites-vous ?

<details>
<summary>Voir la solution</summary>

Pas encore : la modification peut avoir **dégradé d'autres cas**. Il faut ajouter le cas signalé au jeu de tests, exécuter la nouvelle version sur **l'ensemble** du jeu, comparer le score avec la version précédente, lire les éventuelles régressions, et ne déployer que si le résultat global est meilleur ou au moins équivalent.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Prompt engineering
center: Un bon prompt est un briefing clair pour un collègue brillant qui ne connaît rien au sujet.
points:
  - icon: target
    title: Clair et précis
    text: Rôle, objectif, public, format attendu, longueur ; dire quoi faire plutôt que quoi éviter.
  - icon: idea
    title: Expliquer le pourquoi
    text: La raison d'une règle aide le modèle à l'appliquer aux cas imprévus.
  - icon: list
    title: Exemples et balises
    text: Quelques exemples variés et des balises <document>, <exemples> pour structurer.
  - icon: brain
    title: Faire réfléchir
    text: Effort de réflexion ou raisonnement dans des balises avant la réponse.
  - icon: chart
    title: Itérer avec méthode
    text: Un jeu de tests, une modification à la fois, mesure sur tous les cas.
pitfall: Corriger le cas signalé par un utilisateur et déployer sans vérifier qu'on n'a rien cassé ailleurs.
remember: Le prompt engineering est empirique, sans jeu de tests, on tourne en rond.
```
