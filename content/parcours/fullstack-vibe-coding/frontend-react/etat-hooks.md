---
title: L'état et les hooks
description: Gérer l'état avec useState, les événements, les effets avec useEffect, les règles des hooks et les pièges courants de l'état.
duration: 60
objectives:
  - Gérer l'état local d'un composant avec useState
  - Réagir aux événements utilisateur
  - Synchroniser avec l'extérieur avec useEffect
  - Respecter les règles des hooks et éviter les pièges
---

# L'état d'un composant

Les props viennent du parent et ne changent pas de l'intérieur. Pour des données qui **évoluent dans le temps** à l'intérieur d'un composant (un compteur, le texte d'un champ, l'ouverture d'un menu), on utilise l'**état** (*state*).

Quand l'état change, React **re-rend** le composant : il rappelle la fonction et met à jour l'affichage. C'est le cœur de la réactivité de React.

```tsx
import { useState } from "react";

function Compteur() {
  const [compte, setCompte] = useState(0);   // valeur initiale : 0

  return (
    <div>
      <p>Compteur : {compte}</p>
      <button onClick={() => setCompte(compte + 1)}>+1</button>
      <button onClick={() => setCompte(0)}>Réinitialiser</button>
    </div>
  );
}
```

`useState` renvoie un tableau de deux éléments : la **valeur actuelle** (`compte`) et une **fonction pour la modifier** (`setCompte`). On déstructure ce tableau. Appeler `setCompte` déclenche un nouveau rendu avec la nouvelle valeur.

> [!IMPORTANT]
> Ne modifiez **jamais** l'état directement (`compte = compte + 1` ou `taches.push(...)`). Passez **toujours** par la fonction de mise à jour (`setCompte`, `setTaches`). Sinon React ne « voit » pas le changement et l'affichage ne se met pas à jour.

# Les événements

React gère les événements avec des props comme `onClick`, `onChange`, `onSubmit`. On y passe une **fonction**.

```tsx
function Formulaire() {
  const [nom, setNom] = useState("");

  function envoyer(e: React.FormEvent) {
    e.preventDefault();          // empêche le rechargement de la page
    console.log("Envoyé :", nom);
  }

  return (
    <form onSubmit={envoyer}>
      <input
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        placeholder="Votre nom"
      />
      <button type="submit">Envoyer</button>
    </form>
  );
}
```

Ici le champ est **contrôlé** : sa valeur vient de l'état (`value={nom}`), et chaque frappe met à jour l'état (`onChange`). L'état est la **source de vérité** de ce que contient le champ.

# Mettre à jour un état complexe

Pour un objet ou un tableau, on crée une **nouvelle** valeur (immuabilité, chapitre JavaScript) plutôt que de modifier l'ancienne :

```tsx
const [taches, setTaches] = useState<Tache[]>([]);

// Ajouter : nouveau tableau avec la décomposition
function ajouter(texte: string) {
  setTaches([...taches, { id: Date.now(), texte, faite: false }]);
}

// Supprimer : filter crée un nouveau tableau
function supprimer(id: number) {
  setTaches(taches.filter((t) => t.id !== id));
}

// Modifier un élément : map crée un nouveau tableau
function basculer(id: number) {
  setTaches(taches.map((t) => (t.id === id ? { ...t, faite: !t.faite } : t)));
}
```

> [!TIP]
> Quand la nouvelle valeur **dépend** de l'ancienne, utilisez la forme **fonction** : `setCompte((c) => c + 1)`. C'est plus sûr, notamment lors de plusieurs mises à jour rapprochées, car React vous garantit la valeur à jour.

# useEffect : se synchroniser avec l'extérieur

Certaines actions ne font pas partie du rendu : charger des données depuis une API, s'abonner à un événement, manipuler directement quelque chose en dehors de React. On les met dans un **effet** avec `useEffect`.

```tsx
import { useEffect, useState } from "react";

function ListeArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    let annule = false;
    async function charger() {
      const reponse = await fetch("/api/articles");
      const data = await reponse.json();
      if (!annule) {              // éviter de mettre à jour un composant démonté
        setArticles(data);
        setChargement(false);
      }
    }
    charger();
    return () => { annule = true; };   // nettoyage
  }, []);   // tableau de dépendances vide : exécuté une fois au montage

  if (chargement) return <p>Chargement…</p>;
  return <ul>{articles.map((a) => <li key={a.id}>{a.titre}</li>)}</ul>;
}
```

- le **tableau de dépendances** (`[]`) contrôle **quand** l'effet se ré-exécute : vide = une seule fois au montage ; `[id]` = à chaque changement de `id` ;
- la fonction **retournée** est le **nettoyage** (désabonnement, annulation), exécutée avant la ré-exécution et au démontage.

> [!WARNING]
> N'abusez pas de `useEffect`. Il sert à se **synchroniser avec l'extérieur** (API, abonnements), pas à réagir à un clic (ça, c'est un gestionnaire d'événement) ni à calculer une valeur dérivée de l'état (ça se calcule pendant le rendu). Dans un vrai projet, le chargement de données passe souvent par une bibliothèque dédiée (TanStack Query) ou par le framework (Next.js, module 4), qui gèrent cache, erreurs et rechargement.

# Les règles des hooks

Les fonctions commençant par `use` (`useState`, `useEffect`…) sont des **hooks**. Deux règles **impératives** :

1. **Appeler les hooks au niveau supérieur** du composant, jamais dans une condition, une boucle ou une fonction imbriquée. React compte sur un ordre d'appel **constant** entre les rendus.
2. **Appeler les hooks uniquement** dans des composants React ou dans d'autres hooks.

```tsx
// INTERDIT
if (connecte) {
  const [x, setX] = useState(0);   // hook dans une condition
}

// CORRECT
const [x, setX] = useState(0);
if (connecte) { /* utiliser x */ }
```

On peut créer ses **propres hooks** (des fonctions `useQuelqueChose` qui composent les hooks existants) pour réutiliser de la logique, mais ce n'est pas nécessaire pour débuter.

# Exercices

## Exercice 1 : Le compteur qui ne se met pas à jour

Pourquoi ce code n'affiche-t-il pas le bon compteur ? Corrigez.

```tsx
function Compteur() {
  let compte = 0;
  return <button onClick={() => { compte = compte + 1; }}>{compte}</button>;
}
```

<details>
<summary>Voir la solution</summary>

`compte` est une simple variable locale : la modifier ne déclenche **aucun** nouveau rendu, donc l'affichage ne change pas (et la variable est réinitialisée à chaque rendu). Il faut un **état** :

```tsx
function Compteur() {
  const [compte, setCompte] = useState(0);
  return <button onClick={() => setCompte((c) => c + 1)}>{compte}</button>;
}
```

</details>

## Exercice 2 : Champ contrôlé

Écrivez un composant avec un champ de recherche contrôlé, qui affiche en dessous « Vous cherchez : X » en temps réel.

<details>
<summary>Voir la solution</summary>

```tsx
function Recherche() {
  const [terme, setTerme] = useState("");
  return (
    <div>
      <input value={terme} onChange={(e) => setTerme(e.target.value)} />
      <p>Vous cherchez : {terme}</p>
    </div>
  );
}
```

La valeur du champ et le texte affiché viennent du même état.

</details>

## Exercice 3 : useEffect ou pas ?

Pour chaque besoin, faut-il un useEffect ?

1. Charger la liste des produits au premier affichage de la page.
2. Calculer le nombre de produits en stock à partir de la liste.
3. Enregistrer une préférence quand l'utilisateur change un réglage.

<details>
<summary>Voir la solution</summary>

1. **Oui** : synchronisation avec l'extérieur (une API) au montage → `useEffect(..., [])`. (Dans un vrai projet, plutôt une bibliothèque de données ou le framework.)
2. **Non** : c'est une valeur **dérivée** de l'état ; elle se calcule pendant le rendu (`produits.filter(p => p.stock > 0).length`), sans effet ni état supplémentaire.
3. **Non** (en général) : c'est une réaction à une **action** utilisateur ; on le fait dans le **gestionnaire d'événement** du changement, pas dans un effet.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: L'état et les hooks
center: Gérer les données qui changent avec useState, se synchroniser avec useEffect, respecter les règles des hooks.
points:
  - icon: loop
    title: useState
    text: Valeur et fonction de mise à jour ; modifier via la fonction déclenche un nouveau rendu.
  - icon: zap
    title: Événements
    text: onClick, onChange, onSubmit ; champs contrôlés dont l'état est la source de vérité.
  - icon: code
    title: État immuable
    text: Créer une nouvelle valeur (décomposition, map, filter) ; forme fonction si ça dépend de l'ancien.
  - icon: link
    title: useEffect
    text: Synchroniser avec l'extérieur ; tableau de dépendances et fonction de nettoyage.
  - icon: shield
    title: Règles des hooks
    text: Au niveau supérieur, jamais dans une condition ; seulement dans des composants ou des hooks.
pitfall: Modifier l'état directement au lieu de passer par la fonction de mise à jour.
remember: Un changement d'état déclenche un nouveau rendu ; une variable ordinaire, non.
```
