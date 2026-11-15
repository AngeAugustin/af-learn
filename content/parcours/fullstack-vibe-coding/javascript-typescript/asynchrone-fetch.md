---
title: JavaScript asynchrone et fetch
description: Le modèle asynchrone, les promesses, async/await, l'appel d'API avec fetch, la gestion des erreurs et les pièges courants.
duration: 55
objectives:
  - Comprendre pourquoi et comment JavaScript est asynchrone
  - Utiliser les promesses et async/await
  - Appeler une API avec fetch et traiter la réponse
  - Gérer les erreurs et les cas limites
---

# Pourquoi l'asynchrone ?

Certaines opérations prennent du **temps** : appeler un serveur, lire un fichier, attendre un délai. JavaScript ne les exécute pas en **bloquant** tout le reste, sinon la page se figerait pendant chaque requête réseau. Il lance l'opération, **continue** son travail, et traite le résultat **quand il arrive**. C'est la programmation **asynchrone**.

```javascript
console.log("1");
setTimeout(() => console.log("2"), 1000);  // dans 1 seconde
console.log("3");
// Affiche : 1, 3, puis 2 une seconde plus tard
```

Le `"2"` s'affiche en dernier : `setTimeout` programme une action **pour plus tard** sans bloquer la suite.

# Les promesses

Une **promesse** (*Promise*) représente une valeur **qui sera disponible plus tard** : le résultat d'une opération asynchrone. Elle peut être **tenue** (*resolved*, avec une valeur) ou **rompue** (*rejected*, avec une erreur).

```javascript
promesse
  .then((resultat) => console.log(resultat))   // quand elle est tenue
  .catch((erreur) => console.error(erreur));   // si elle est rompue
```

Historiquement, on enchaînait les `.then()`. Aujourd'hui, on préfère la syntaxe `async`/`await`, plus lisible.

# async / await

Le mot-clé **`await`** met en pause une fonction **`async`** jusqu'à ce qu'une promesse soit résolue, puis reprend avec sa valeur. Le code **ressemble** à du code synchrone, tout en restant non bloquant.

```javascript
async function chargerUtilisateur(id) {
  const reponse = await fetch(`/api/utilisateurs/${id}`);
  const utilisateur = await reponse.json();
  return utilisateur;
}

// Appel
const alice = await chargerUtilisateur(42);
```

- `await` ne s'utilise que dans une fonction **`async`** (ou au niveau supérieur d'un module).
- Une fonction `async` renvoie toujours une **promesse** : pour utiliser son résultat ailleurs, on l'`await` aussi.

# Appeler une API avec fetch

**`fetch`** est la fonction standard pour faire des requêtes HTTP depuis le navigateur (et Node.js récent).

```javascript
async function creerArticle(donnees) {
  const reponse = await fetch("/api/articles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(donnees),
  });

  if (!reponse.ok) {
    throw new Error(`Erreur ${reponse.status}`);
  }

  return reponse.json();
}
```

- un simple `fetch(url)` fait un `GET` ; pour les autres méthodes, on passe un objet d'options ;
- le corps envoyé est une **chaîne JSON** (`JSON.stringify`), avec l'en-tête `Content-Type` adapté ;
- `reponse.json()` lit et analyse le corps JSON de la réponse (c'est **aussi** asynchrone, d'où le second `await`).

> [!WARNING]
> `fetch` ne **rejette pas** la promesse pour un code d'erreur HTTP (404, 500…) : il ne rejette que pour une erreur **réseau**. Une réponse 404 est considérée comme « reçue avec succès ». Vérifiez **toujours** `reponse.ok` (vrai pour les codes 2xx) et traitez les autres cas vous-même.

# Gérer les erreurs

```javascript
async function afficherUtilisateur(id) {
  try {
    const utilisateur = await chargerUtilisateur(id);
    console.log(utilisateur.nom);
  } catch (erreur) {
    console.error("Impossible de charger l'utilisateur :", erreur);
    // afficher un message à l'utilisateur, réessayer, etc.
  }
}
```

Le bloc **`try`/`catch`** capture aussi bien les erreurs réseau (fetch qui rejette) que celles qu'on **lève** soi-même (`throw`) quand `reponse.ok` est faux. Toujours prévoir le cas d'échec : une application qui suppose que le réseau marche toujours échoue mal.

# Opérations en parallèle

Si plusieurs opérations sont **indépendantes**, les lancer en parallèle est bien plus rapide que l'une après l'autre :

```javascript
// Séquentiel (lent) : attend chaque requête l'une après l'autre
const a = await chargerUtilisateur(1);
const b = await chargerUtilisateur(2);

// Parallèle (rapide) : lance les deux, attend que les deux finissent
const [c, d] = await Promise.all([
  chargerUtilisateur(1),
  chargerUtilisateur(2),
]);
```

`Promise.all` attend que **toutes** les promesses soient tenues (et rejette si **l'une** échoue). `Promise.allSettled` attend toutes, qu'elles réussissent ou échouent.

> [!TIP]
> N'`await` en séquence que ce qui **dépend** du résultat précédent. Pour des appels indépendants, `Promise.all` évite d'additionner les temps d'attente. C'est une optimisation simple et fréquente.

# Exercices

## Exercice 1 : Réécrire en async/await

Réécrivez ce code avec async/await et une gestion d'erreur :

```javascript
fetch("/api/meteo")
  .then((r) => r.json())
  .then((data) => console.log(data.temperature))
  .catch((e) => console.error(e));
```

<details>
<summary>Voir la solution</summary>

```javascript
async function afficherMeteo() {
  try {
    const reponse = await fetch("/api/meteo");
    if (!reponse.ok) throw new Error(`Erreur ${reponse.status}`);
    const data = await reponse.json();
    console.log(data.temperature);
  } catch (erreur) {
    console.error(erreur);
  }
}
```

On ajoute la vérification de `reponse.ok`, que la version `.then()` oubliait.

</details>

## Exercice 2 : Le bug du fetch

Ce code affiche « OK » même quand le serveur renvoie une erreur 500. Pourquoi, et comment corriger ?

```javascript
async function sauvegarder(data) {
  try {
    await fetch("/api/sauver", { method: "POST", body: JSON.stringify(data) });
    console.log("OK");
  } catch (e) {
    console.log("Échec");
  }
}
```

<details>
<summary>Voir la solution</summary>

`fetch` ne rejette pas pour un code 500 : la promesse est **tenue**, donc on passe dans le `try` et on affiche « OK » même en cas d'erreur serveur. Correction : vérifier `reponse.ok`.

```javascript
const reponse = await fetch("/api/sauver", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
if (!reponse.ok) throw new Error(`Erreur ${reponse.status}`);
console.log("OK");
```

On a aussi ajouté l'en-tête `Content-Type` manquant.

</details>

## Exercice 3 : Paralléliser

Ce code charge trois ressources indépendantes l'une après l'autre. Rendez-le plus rapide.

```javascript
const profil = await fetch("/api/profil").then((r) => r.json());
const commandes = await fetch("/api/commandes").then((r) => r.json());
const messages = await fetch("/api/messages").then((r) => r.json());
```

<details>
<summary>Voir la solution</summary>

```javascript
const [profil, commandes, messages] = await Promise.all([
  fetch("/api/profil").then((r) => r.json()),
  fetch("/api/commandes").then((r) => r.json()),
  fetch("/api/messages").then((r) => r.json()),
]);
```

Les trois requêtes partent en même temps ; on attend la plus longue, pas la somme des trois.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: JavaScript asynchrone et fetch
center: Lancer les opérations longues sans bloquer, et traiter leur résultat quand il arrive.
points:
  - icon: clock
    title: Asynchrone
    text: Les opérations longues ne bloquent pas ; le résultat est traité plus tard.
  - icon: loop
    title: Promesses et await
    text: Une promesse est une valeur future ; await la déroule, dans une fonction async.
  - icon: link
    title: fetch
    text: Requêtes HTTP ; corps en JSON, en-tête Content-Type, reponse.json est aussi asynchrone.
  - icon: alert
    title: Vérifier reponse.ok
    text: fetch ne rejette pas sur un code d'erreur HTTP ; il faut le vérifier soi-même.
  - icon: zap
    title: Parallèle
    text: Promise.all pour les appels indépendants, au lieu d'additionner les attentes.
pitfall: Croire qu'un fetch vers une réponse 404 ou 500 déclenche le catch.
remember: Toujours prévoir le cas d'échec ; une app qui suppose le réseau parfait échoue mal.
```
