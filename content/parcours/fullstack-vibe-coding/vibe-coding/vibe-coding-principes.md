---
title: Les principes du vibe coding
description: Ce qu'est le vibe coding, les outils d'assistance IA, leurs forces et limites, et comment garder le contrôle et la responsabilité du code produit.
duration: 50
objectives:
  - Définir le vibe coding et le situer dans la pratique moderne
  - Connaître les principaux outils d'assistance IA au développement
  - Comprendre les forces et les limites des assistants
  - Garder la responsabilité et le contrôle du code
---

# Qu'est-ce que le vibe coding ?

Le **vibe coding** désigne une façon de développer où l'on **décrit en langage naturel** ce que l'on veut, et où un **assistant IA** génère le code. Le terme a été popularisé en 2025. Dans sa forme la plus pure, on se concentre sur l'**intention** et le **résultat** plutôt que sur chaque ligne.

C'est un changement réel dans la pratique : les assistants IA accélèrent énormément certaines tâches (prototypes, code répétitif, exploration d'une bibliothèque inconnue). Mais « décrire et laisser faire » a des **limites** sérieuses, surtout dès qu'on dépasse le prototype. Ce module vous apprend à en tirer parti **sans perdre le contrôle**, car c'est **vous** qui restez responsable du code.

> [!IMPORTANT]
> L'IA est un **outil puissant au service d'un développeur compétent**, pas un remplaçant de la compréhension. Tout ce que vous avez appris dans ce parcours (HTML, JavaScript, React, bases de données, sécurité, tests) est ce qui vous permet de **guider**, **vérifier** et **corriger** l'IA. Sans ces fondations, on produit du code qu'on ne comprend pas, qu'on ne peut ni déboguer ni sécuriser.

# Les outils d'assistance

```diagram
type: compare
title: Trois façons d'être assisté par l'IA
columns:
  - title: Complétion dans l'éditeur
    tone: blue
    items:
      - Suggère la suite pendant la frappe
      - GitHub Copilot et équivalents
      - Garde le développeur aux commandes
  - title: Chat / assistant
    tone: teal
    items:
      - On dialogue, on demande, on itère
      - Expliquer, générer, corriger, relire
      - Claude, ChatGPT, et autres
  - title: Agents de code
    tone: amber
    items:
      - Exécutent des tâches de bout en bout
      - Créent, modifient, lancent plusieurs fichiers
      - Puissants mais à superviser de près
```

Les **agents de code** (comme Claude Code, celui qui a construit ce site) peuvent lire un projet, écrire plusieurs fichiers, lancer des commandes et itérer. Ils sont très puissants, mais demandent une **supervision** d'autant plus attentive que leur portée est large. Le chapitre « Travailler avec un agent de code » de ce module détaille comment leur donner le contexte du projet, découper les tâches, encadrer leurs permissions et relire leurs modifications.

# Forces et limites

```diagram
type: compare
title: Ce que l'IA fait bien, et moins bien
columns:
  - title: Forces
    tone: teal
    items:
      - Code répétitif, structures de base
      - Expliquer du code ou une erreur
      - Explorer une bibliothèque inconnue
      - Prototypes rapides, tests, documentation
  - title: Limites
    tone: rose
    items:
      - Peut se tromper avec aplomb (hallucinations)
      - Code daté, déprécié ou non sécurisé
      - Manque le contexte global du projet
      - Choix d'architecture douteux sur le long terme
```

> [!WARNING]
> Un assistant IA produit parfois du code **plausible mais faux** : une fonction qui n'existe pas, une approche obsolète, une faille de sécurité (SQL concaténé, secret en clair, validation oubliée). Il le présente avec **assurance**, ce qui est trompeur. **Ne faites jamais confiance aveuglément** : tout code généré doit être **lu, compris et vérifié** comme s'il venait d'un collègue junior pressé.

# Garder le contrôle

Quelques principes pour développer avec l'IA sans perdre la maîtrise :

1. **Comprendre avant d'accepter** : ne validez pas un code que vous ne comprenez pas. Si vous ne le comprenez pas, demandez une explication ou simplifiez.
2. **Vérifier et tester** : exécuter le code, écrire ou faire écrire des **tests**, vérifier les cas limites. L'IA peut aider à tester, mais c'est vous qui jugez.
3. **Petits incréments** : demander des morceaux **ciblés** et les intégrer un par un, plutôt qu'un énorme bloc d'un coup, impossible à relire.
4. **Relire pour la sécurité** : appliquer systématiquement les réflexes du parcours (validation des entrées, autorisation, requêtes paramétrées, secrets hors du code). L'IA les oublie souvent.
5. **Garder la cohérence** : veiller à ce que le code généré respecte les conventions et l'architecture du projet, au lieu d'empiler des styles disparates.
6. **Rester le décideur** : les choix structurants (architecture, dépendances, modèle de données) vous appartiennent ; l'IA propose, vous décidez.

# Responsabilité, licence et confidentialité

- **Vous êtes responsable** du code que vous livrez, qu'il soit écrit à la main ou généré. « L'IA l'a écrit » n'est pas une excuse devant un bug, une faille ou un client.
- **Licence et propriété** : vérifiez les règles de votre employeur et de vos outils ; du code généré peut ressembler à du code existant sous licence.
- **Confidentialité** : ne collez pas de **secrets**, de données personnelles ou de code confidentiel dans un outil IA sans savoir comment ces données sont traitées. Utilisez les offres et réglages adaptés (entreprise, non-entraînement) quand le contexte l'exige.

> [!TIP]
> Le vibe coding est excellent pour **apprendre** et **prototyper vite**, et pour **déléguer le fastidieux**. Mais pour du code destiné à la **production**, le réflexe reste : comprendre, vérifier, tester, sécuriser. Plus vos fondations sont solides, plus l'IA vous rend productif, car vous savez quoi lui demander et comment juger ce qu'elle produit.

# Exercices

## Exercice 1 : Repérer le problème

Un assistant génère ce code pour une route de connexion. Quels problèmes repérez-vous ?

```ts
const user = await db.query(
  `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`
);
if (user) return { connecte: true };
```

<details>
<summary>Voir la solution</summary>

Plusieurs failles graves (tous les réflexes du parcours) :

1. **Injection SQL** : `email` et `password` concaténés dans la requête → requête paramétrée obligatoire.
2. **Mot de passe comparé en clair** : les mots de passe doivent être **hachés** (Argon2id/bcrypt) et comparés par la fonction dédiée, jamais stockés ni comparés en clair.
3. **`SELECT *`** : sur-exposition potentielle.

Ce code « marche » en apparence mais est dangereux : exactement le type de production plausible-mais-fausse qu'il faut savoir repérer.

</details>

## Exercice 2 : Bonne ou mauvaise pratique ?

Pour chaque situation, est-ce une bonne façon d'utiliser l'IA ?

1. Demander d'expliquer un message d'erreur incompris.
2. Copier-coller en production un gros composant généré sans le lire.
3. Faire générer des tests pour une fonction, puis les vérifier.

<details>
<summary>Voir la solution</summary>

1. **Bonne** : expliquer une erreur est un excellent usage, qui fait progresser.
2. **Mauvaise** : accepter du code non lu, c'est livrer du code qu'on ne comprend pas et qu'on ne peut ni déboguer ni sécuriser.
3. **Bonne** (avec vérification) : générer des tests accélère, à condition de **relire** qu'ils testent les bons cas et passent pour les bonnes raisons.

</details>

## Exercice 3 : Garder le contrôle

Vous demandez à un agent IA d'« ajouter l'authentification à l'application ». Comment procéder pour garder le contrôle ?

<details>
<summary>Voir la solution</summary>

- **Découper** la demande : d'abord le choix de l'approche (bibliothèque, sessions), puis l'inscription, puis la connexion, puis la protection des routes, un morceau à la fois.
- **Décider** vous-même des choix structurants (quelle bibliothèque, session serveur ou JWT, OAuth ou mot de passe).
- **Relire** chaque partie pour la sécurité : hachage des mots de passe, cookies `HttpOnly`/`Secure`/`SameSite`, validation, autorisation sur chaque ressource.
- **Tester** les parcours (connexion valide, invalide, accès non autorisé).
- Ne **fusionner** qu'après compréhension, revue et tests, comme pour n'importe quel code.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Les principes du vibe coding
center: Décrire son intention et laisser l'IA générer, tout en gardant la compréhension, le contrôle et la responsabilité.
points:
  - icon: sparkles
    title: Le vibe coding
    text: Décrire en langage naturel, l'IA génère ; puissant pour prototyper et déléguer le fastidieux.
  - icon: tool
    title: Les outils
    text: Complétion, assistants de chat, agents de code ; plus la portée est large, plus la supervision compte.
  - icon: alert
    title: Les limites
    text: Code plausible mais faux, daté ou non sécurisé, présenté avec aplomb ; jamais de confiance aveugle.
  - icon: check
    title: Garder le contrôle
    text: Comprendre avant d'accepter, vérifier, tester, petits incréments, relire la sécurité, décider soi-même.
  - icon: shield
    title: Responsabilité
    text: Vous répondez du code livré ; attention à la licence et à la confidentialité des données.
pitfall: Accepter du code généré sans le lire, et se retrouver avec un projet qu'on ne comprend pas.
remember: L'IA amplifie un développeur compétent ; les fondations sont ce qui permet de la guider et de la vérifier.
```
