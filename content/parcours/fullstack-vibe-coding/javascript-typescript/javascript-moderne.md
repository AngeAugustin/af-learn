---
title: JavaScript moderne
description: Les bases du langage, variables et types, fonctions et portée, tableaux et objets, méthodes de tableau, modules et manipulation du DOM.
duration: 65
objectives:
  - Déclarer variables et fonctions avec la syntaxe moderne
  - Manipuler tableaux et objets, et leurs méthodes essentielles
  - Organiser le code en modules
  - Interagir avec la page via le DOM et les événements
---

# JavaScript, le langage du web

**JavaScript** est le langage qui rend les pages **interactives**. Il s'exécute dans le navigateur (et, avec Node.js, côté serveur). C'est un langage incontournable du développement web : frontend, backend et outillage.

Ce chapitre couvre le **JavaScript moderne** (depuis la version dite « ES2015 » et suivantes), la base de tout ce qui suit.

# Variables et types

```javascript
const nom = "Alice";      // constante : ne peut pas être réassignée (par défaut)
let age = 30;             // variable : peut changer
age = 31;
// éviter var (ancienne syntaxe, portée déroutante)
```

> [!TIP]
> Utilisez **`const` par défaut**, et `let` seulement quand la valeur doit changer. N'utilisez jamais `var`. Un `const` qui contient un objet ou un tableau peut voir son **contenu** modifié ; c'est la **réassignation** de la variable qui est interdite.

Les **types primitifs** : `string` (texte), `number` (nombre, entier ou décimal), `boolean` (`true`/`false`), `null` (absence volontaire de valeur), `undefined` (non défini), et plus rarement `bigint` et `symbol`. Tout le reste est un **objet** (y compris les tableaux et les fonctions).

```javascript
const texte = `Bonjour ${nom}, tu as ${age} ans`;  // gabarit avec interpolation
const estMajeur = age >= 18;
```

> [!WARNING]
> Comparez toujours avec `===` (égalité stricte), jamais `==` : `0 == ""` vaut `true` (conversions implicites surprenantes), alors que `0 === ""` vaut `false`. De même `!==` plutôt que `!=`.

# Les fonctions

```javascript
// Fonction classique
function additionner(a, b) {
  return a + b;
}

// Fonction fléchée (syntaxe concise, très utilisée)
const doubler = (x) => x * 2;
const saluer = (nom) => {
  return `Bonjour ${nom}`;
};

// Paramètres par défaut
const incrementer = (x, pas = 1) => x + pas;
```

Les **fonctions fléchées** sont omniprésentes, notamment comme arguments d'autres fonctions. Les variables déclarées avec `const`/`let` ont une **portée de bloc** : elles n'existent que dans les accolades `{}` où elles sont définies.

# Tableaux et objets

```javascript
const fruits = ["pomme", "poire", "cerise"];
fruits.push("fraise");          // ajouter à la fin
console.log(fruits.length);     // 4
console.log(fruits[0]);         // "pomme"

const utilisateur = {
  nom: "Alice",
  age: 30,
  actif: true,
};
console.log(utilisateur.nom);   // accès par point
utilisateur.age = 31;           // modification
```

## La déstructuration et l'opérateur de décomposition

```javascript
const { nom, age } = utilisateur;        // extraire des propriétés
const [premier, deuxieme] = fruits;      // extraire des éléments

const copie = { ...utilisateur, ville: "Lyon" };   // copier et étendre
const tous = [...fruits, "kiwi"];                  // concaténer
```

La **décomposition** (`...`) crée une **copie** plutôt que de modifier l'original : essentiel pour programmer sans effets de bord, en particulier avec React.

# Les méthodes de tableau

Ces méthodes transforment les tableaux de façon déclarative, sans boucle explicite :

```javascript
const nombres = [1, 2, 3, 4, 5];

const doubles = nombres.map((n) => n * 2);           // [2, 4, 6, 8, 10]
const pairs = nombres.filter((n) => n % 2 === 0);    // [2, 4]
const somme = nombres.reduce((acc, n) => acc + n, 0); // 15
const trouve = nombres.find((n) => n > 3);           // 4
const auMoinsUn = nombres.some((n) => n > 4);        // true
const tous = nombres.every((n) => n > 0);            // true

nombres.forEach((n) => console.log(n));              // itérer sans retour
```

| Méthode | Rôle |
|---|---|
| `map` | Transformer chaque élément, renvoie un nouveau tableau de même taille |
| `filter` | Garder les éléments qui passent un test |
| `reduce` | Combiner tous les éléments en une seule valeur |
| `find` | Trouver le premier élément qui passe un test |
| `some` / `every` | Au moins un / tous passent le test (booléen) |

> [!IMPORTANT]
> `map`, `filter` et `reduce` **ne modifient pas** le tableau d'origine : ils en renvoient un nouveau. C'est la base du style de programmation **immuable**, privilégié en développement moderne et indispensable avec React.

```video
url: https://www.youtube.com/watch?v=Urwzk6ILvPQ
title: "Array Iteration: 8 Methods - map, filter, reduce, some, every, find, findIndex, forEach"
channel: "freeCodeCamp.org"
duration: "6:22"
lang: en
why: "freeCodeCamp passe en revue huit méthodes de tableau en six minutes : map, filter, reduce, some, every, find, findIndex et forEach."
```

# Les modules

On découpe le code en **fichiers** (modules) qui s'**exportent** et s'**importent** :

```javascript
// maths.js
export function additionner(a, b) {
  return a + b;
}
export const PI = 3.14159;

// app.js
import { additionner, PI } from "./maths.js";
console.log(additionner(2, 3));
```

Un module peut avoir un export **par défaut** (`export default`). Les modules isolent le code : une variable d'un module n'est pas visible ailleurs sauf si elle est exportée.

# Manipuler le DOM

Dans le navigateur, JavaScript modifie la page via le **DOM** :

```javascript
const bouton = document.querySelector("#mon-bouton");
const titre = document.querySelector("h1");

bouton.addEventListener("click", () => {
  titre.textContent = "Bouton cliqué !";
  titre.classList.add("actif");
});
```

- `querySelector` sélectionne un élément (avec un sélecteur CSS).
- `addEventListener` réagit à un **événement** (`click`, `input`, `submit`…).
- `textContent` modifie le texte (jamais `innerHTML` avec des données non maîtrisées : rappel du parcours sécurité, risque de XSS).

> [!NOTE]
> Manipuler le DOM à la main devient vite fastidieux pour une vraie application. C'est pourquoi on utilise des **bibliothèques** comme React (module 3), qui gèrent le DOM pour nous. Mais comprendre le DOM natif reste essentiel.

# Exercices

## Exercice 1 : Transformer des données

À partir de `const produits = [{nom: "A", prix: 10}, {nom: "B", prix: 25}, {nom: "C", prix: 5}]`, écrivez le code qui renvoie les noms des produits à plus de 8 €, et le prix total.

<details>
<summary>Voir la solution</summary>

```javascript
const chers = produits
  .filter((p) => p.prix > 8)
  .map((p) => p.nom);              // ["A", "B"]

const total = produits.reduce((acc, p) => acc + p.prix, 0);  // 40
```

On chaîne `filter` puis `map`, et on utilise `reduce` pour le total.

</details>

## Exercice 2 : const et mutation

Ce code lève-t-il une erreur ? Expliquez.

```javascript
const liste = [1, 2, 3];
liste.push(4);
liste = [5, 6];
```

<details>
<summary>Voir la solution</summary>

`liste.push(4)` fonctionne : on **modifie le contenu** du tableau, ce qui est permis même avec `const`. En revanche `liste = [5, 6]` **réassigne** la variable, ce qui est interdit avec `const` et lève une erreur (`TypeError: Assignment to constant variable`). `const` interdit la réassignation, pas la mutation du contenu.

</details>

## Exercice 3 : == ou === ?

Que valent ces comparaisons, et laquelle utiliser ?

```javascript
0 == "";        // ?
0 === "";       // ?
"5" == 5;       // ?
"5" === 5;      // ?
```

<details>
<summary>Voir la solution</summary>

- `0 == ""` → `true` (conversion implicite des deux côtés).
- `0 === ""` → `false` (types différents : number vs string).
- `"5" == 5` → `true` (la chaîne est convertie en nombre).
- `"5" === 5` → `false` (string vs number).

Toujours utiliser `===` : il ne fait pas de conversion implicite, donc pas de surprise.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: JavaScript moderne
center: Le langage du web, avec une syntaxe moderne et un style déclaratif et immuable.
points:
  - icon: code
    title: Variables
    text: const par défaut, let si ça change, jamais var ; comparer avec triple égal.
  - icon: zap
    title: Fonctions
    text: Fonctions fléchées, paramètres par défaut, portée de bloc.
  - icon: list
    title: Tableaux et objets
    text: Déstructuration, décomposition pour copier ; map, filter, reduce, find.
  - icon: puzzle
    title: Modules
    text: export et import pour découper le code en fichiers isolés.
  - icon: eye
    title: DOM
    text: querySelector, addEventListener, textContent ; les bibliothèques le gèrent ensuite.
pitfall: Utiliser double égal et subir des conversions implicites surprenantes.
remember: map, filter et reduce ne modifient pas l'original ; ils renvoient un nouveau tableau.
```
