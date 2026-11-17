---
title: Bien prompter et relire le code de l'IA
description: Écrire de bonnes instructions, donner le bon contexte, itérer efficacement, et relire systématiquement le code généré avec une grille de vérification.
duration: 50
objectives:
  - Formuler des instructions claires et contextualisées
  - Fournir le contexte utile à un assistant
  - Itérer et déboguer avec l'IA
  - Relire le code généré avec une grille systématique
---

# Un bon prompt, un bon résultat

La qualité du code généré dépend énormément de la qualité de la **demande**. Un prompt vague donne un résultat générique, souvent à côté ; un prompt précis et contextualisé donne un résultat utile.

```diagram
type: compare
title: Prompt vague ou prompt précis
columns:
  - title: Vague
    tone: rose
    items:
      - "Fais-moi un formulaire"
      - Pas de contexte ni de contraintes
      - Résultat générique, à retravailler
  - title: Précis
    tone: teal
    items:
      - Objectif, contraintes, pile technique
      - Exemples d'entrée et de sortie attendues
      - Format de réponse souhaité
```

Les ingrédients d'un bon prompt :

- le **contexte** : la pile technique (Next.js, TypeScript, Prisma…), les conventions du projet, les fichiers concernés ;
- l'**objectif** précis : ce que le code doit faire, et pour quel cas d'usage ;
- les **contraintes** : sécurité, performance, style, bibliothèques autorisées ou interdites ;
- des **exemples** quand c'est possible (entrées/sorties attendues) ;
- le **format** de réponse voulu (juste le code, avec explications, étape par étape…).

```text
Exemple de bon prompt :
« Dans une app Next.js (App Router, TypeScript, Prisma), écris une Server Action
qui crée un commentaire. Valide le texte avec Zod (1 à 500 caractères), vérifie
que l'utilisateur est connecté, associe le commentaire à l'utilisateur courant,
et revalide la page de l'article. Renvoie une erreur lisible en cas d'échec. »
```

```video
url: https://www.youtube.com/watch?v=ysPbXH0LpIE
title: "Prompting 101 | Code w/ Claude"
channel: "Anthropic"
duration: "24:53"
lang: en
why: "Les bases du prompting présentées par des équipes d'Anthropic, avec un exemple construit et amélioré en direct."
```

# Donner le bon contexte

Les assistants travaillent mieux avec le **contexte** du projet : le code existant concerné, les types, les conventions. Les agents de code lisent le projet eux-mêmes ; avec un assistant de chat, on **fournit** les extraits pertinents. Trop peu de contexte produit du code qui ne s'intègre pas ; le bon contexte produit du code cohérent avec l'existant.

> [!TIP]
> Donnez les **types** et les **signatures** existants, et un exemple de code du projet pour le **style**. « Voici mon modèle Prisma et un exemple de Server Action existante ; écris-en une nouvelle sur le même modèle pour X » donne un bien meilleur résultat que la même demande sans contexte.

# Itérer et déboguer

Le premier résultat est rarement parfait. On **itère** :

- **affiner** : « c'est presque ça, mais gère aussi le cas où la liste est vide » ;
- **corriger** : coller le **message d'erreur** exact et demander la cause ;
- **faire expliquer** : « explique-moi ce que fait cette ligne » pour comprendre avant d'accepter ;
- **demander des alternatives** : « propose une approche plus simple » ou « quelles sont les limites de cette solution ? ».

Pour déboguer, donner à l'IA le **code**, le **comportement attendu**, le **comportement observé** et le **message d'erreur** : c'est le même réflexe que pour demander de l'aide à un collègue.

> [!WARNING]
> Attention à la **spirale de la confiance** : quand on ne comprend pas une erreur, il est tentant d'appliquer correctif sur correctif suggéré par l'IA sans comprendre. On accumule alors de la complexité et des bugs cachés. Si vous tournez en rond, **arrêtez-vous**, lisez le code, comprenez le problème, quitte à demander à l'IA de l'**expliquer** plutôt que de le **corriger**.

# La grille de relecture

Tout code généré se relit **avant** de l'intégrer. Une grille systématique, qui reprend tout le parcours :

```diagram
type: layers
title: Grille de relecture du code généré
layers:
  - title: Correction
    text: Fait-il ce qui est demandé ? Les cas limites sont-ils gérés ?
  - title: Sécurité
    text: Entrées validées, autorisation vérifiée, requêtes paramétrées, secrets hors du code ?
  - title: Qualité
    text: Lisible, cohérent avec le projet, sans code mort ni complexité inutile ?
  - title: Actualité
    text: API et bibliothèques à jour, non dépréciées ?
  - title: Tests
    text: Testé ? Les tests vérifient-ils les bons cas ?
```

- **Correction** : lire le code, vérifier qu'il répond au besoin **et** aux cas limites (liste vide, valeurs nulles, erreurs).
- **Sécurité** : appliquer les réflexes (validation, autorisation, injection, secrets), l'IA les néglige souvent.
- **Qualité** : code lisible, cohérent avec les conventions, sans dépendance inutile ni complexité gratuite.
- **Actualité** : vérifier que les API utilisées existent et ne sont pas **dépréciées** (l'IA peut proposer du code daté).
- **Tests** : exécuter, et couvrir par des tests ce qui est important.

> [!IMPORTANT]
> La règle d'or : **ne mergez jamais du code que vous ne pourriez pas expliquer et défendre vous-même**. Si vous ne sauriez pas le déboguer en production à 3 h du matin, vous ne devriez pas le livrer. L'IA accélère la production ; votre relecture garantit la qualité.

# Exercices

## Exercice 1 : Améliorer un prompt

Améliorez ce prompt : « fais une fonction qui valide un email ».

<details>
<summary>Voir la solution</summary>

Un meilleur prompt précise contexte, contraintes et format :

« En TypeScript, écris une fonction `validerEmail(email: string): boolean` qui vérifie qu'une chaîne est un e-mail plausible. Utilise une validation raisonnable (pas une regex exhaustive impossible à maintenir). Ajoute 3 tests Vitest couvrant un e-mail valide, un sans @, et une chaîne vide. Explique les limites de l'approche. »

On a ajouté : le langage, la signature, une contrainte (validation raisonnable), des tests, et une demande d'explication des limites.

</details>

## Exercice 2 : La spirale de correctifs

Vous demandez un correctif, le bug change mais persiste ; vous demandez un autre correctif, etc. Depuis 30 minutes, ça empire. Que faire ?

<details>
<summary>Voir la solution</summary>

**S'arrêter** et reprendre le contrôle : lire soi-même le code concerné, comprendre le flux réel, et demander à l'IA d'**expliquer** (« explique-moi pourquoi X se produit ») plutôt que de corriger à l'aveugle. Souvent, revenir à un état qui marchait (Git) et avancer par **petits pas compris** est plus efficace qu'empiler des correctifs. Le problème est parfois une mauvaise compréhension initiale que les correctifs successifs masquent.

</details>

## Exercice 3 : Relecture

Un assistant génère une route d'API qui « fonctionne ». Listez les points à vérifier avant de l'intégrer.

<details>
<summary>Voir la solution</summary>

Selon la grille :

- **Correction** : répond-elle au besoin ? cas limites (ressource absente, entrée invalide) gérés ? bons codes de statut ?
- **Sécurité** : entrées validées (Zod) ? authentification **et** autorisation vérifiées ? pas d'injection ? pas de sur-exposition de données ? secrets hors du code ?
- **Qualité** : lisible, cohérente avec les autres routes, sans code inutile ?
- **Actualité** : API Next.js et bibliothèques à jour ?
- **Tests** : testée, au moins sur le cas nominal et un cas d'erreur ?

Et surtout : sauriez-vous l'expliquer et la déboguer vous-même ?

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Bien prompter et relire
center: Des instructions claires et contextualisées, une itération maîtrisée, et une relecture systématique.
points:
  - icon: chat
    title: Bon prompt
    text: Contexte, objectif, contraintes, exemples, format attendu ; précis plutôt que vague.
  - icon: file
    title: Contexte
    text: Types, signatures et exemples du projet pour un code cohérent avec l'existant.
  - icon: loop
    title: Itérer
    text: Affiner, corriger avec l'erreur exacte, faire expliquer, demander des alternatives.
  - icon: eye
    title: Grille de relecture
    text: "Correction, sécurité, qualité, actualité, tests : avant toute intégration."
  - icon: alert
    title: Spirale de correctifs
    text: Si on tourne en rond, s'arrêter, lire, comprendre plutôt que corriger à l'aveugle.
pitfall: Empiler des correctifs suggérés sans comprendre, et masquer le vrai problème.
remember: Ne mergez jamais du code que vous ne sauriez pas expliquer et déboguer vous-même.
```
