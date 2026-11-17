---
title: Les fondamentaux de React
description: Pourquoi React, composants et JSX, props, rendu de listes et affichage conditionnel, et comment React met à jour l'interface.
duration: 60
objectives:
  - Expliquer ce qu'apporte React
  - Écrire des composants avec JSX
  - Passer des données avec les props
  - Afficher des listes et du contenu conditionnel
---

# Pourquoi React ?

Manipuler le DOM à la main (chapitre JavaScript) devient vite ingérable dès qu'une application a de nombreux éléments qui changent. **React** est une bibliothèque qui résout ce problème avec une idée simple : vous **décrivez** à quoi l'interface doit ressembler **en fonction des données**, et React se charge de **mettre à jour le DOM** pour qu'il corresponde.

```diagram
type: compare
title: Deux façons de construire l'interface
columns:
  - title: DOM manuel
    tone: rose
    items:
      - On décrit les étapes de modification
      - On synchronise soi-même l'affichage et les données
      - Difficile à maintenir quand ça grossit
  - title: React (déclaratif)
    tone: teal
    items:
      - On décrit le résultat voulu selon les données
      - React calcule et applique les changements
      - Composants réutilisables
```

React est la bibliothèque frontend la plus utilisée, et la base de frameworks comme **Next.js** (module 4). On l'utilise ici avec **TypeScript**.

```video
url: https://www.youtube.com/watch?v=Tn6-PIqc4UM
title: "React in 100 Seconds"
channel: "Fireship"
duration: "2:08"
lang: en
why: "React en cent secondes : composants, JSX, état et rendu, pour avoir la vue d'ensemble avant le détail."
```

# Les composants et JSX

Une interface React est faite de **composants** : des fonctions qui renvoient une description de l'interface, écrite en **JSX** (du HTML dans du JavaScript).

```tsx
function Bienvenue() {
  return (
    <div className="carte">
      <h1>Bonjour !</h1>
      <p>Bienvenue sur mon application.</p>
    </div>
  );
}
```

Règles du JSX :

- un composant commence par une **majuscule** (`Bienvenue`, pas `bienvenue`) ;
- il renvoie **un seul élément racine** (on enveloppe au besoin dans un fragment `<>...</>`) ;
- on écrit **`className`** au lieu de `class` (car `class` est un mot réservé en JavaScript) ;
- on insère du **JavaScript** entre accolades `{}` :

```tsx
function Salutation() {
  const nom = "Alice";
  const heure = new Date().getHours();
  return <p>Bonjour {nom}, il est {heure}h</p>;
}
```

Les composants se **composent** entre eux comme des balises :

```tsx
function App() {
  return (
    <main>
      <Bienvenue />
      <Salutation />
    </main>
  );
}
```

# Les props

Les **props** (propriétés) sont les **données** qu'un composant parent passe à un enfant, comme les attributs d'une balise. Elles rendent les composants **réutilisables**.

```tsx
interface CarteProps {
  titre: string;
  description: string;
  important?: boolean;
}

function Carte({ titre, description, important = false }: CarteProps) {
  return (
    <div className={important ? "carte carte-importante" : "carte"}>
      <h2>{titre}</h2>
      <p>{description}</p>
    </div>
  );
}

// Utilisation
function App() {
  return (
    <>
      <Carte titre="Premier" description="Une description" />
      <Carte titre="Second" description="Une autre" important />
    </>
  );
}
```

> [!IMPORTANT]
> Les props sont **en lecture seule** : un composant ne doit **jamais** modifier ses props. Les données circulent **de haut en bas** (du parent vers l'enfant). Pour qu'un enfant communique vers le haut, le parent lui passe une **fonction** en prop (que l'enfant appelle). C'est le flux de données **unidirectionnel** de React.

# Afficher des listes

Pour afficher une liste, on utilise `map` (chapitre JavaScript) pour transformer un tableau de données en tableau d'éléments :

```tsx
interface Tache {
  id: number;
  texte: string;
}

function ListeTaches({ taches }: { taches: Tache[] }) {
  return (
    <ul>
      {taches.map((tache) => (
        <li key={tache.id}>{tache.texte}</li>
      ))}
    </ul>
  );
}
```

> [!WARNING]
> Chaque élément d'une liste a besoin d'une prop **`key`** unique et stable (ici l'`id`). React s'en sert pour suivre efficacement les éléments lors des mises à jour. N'utilisez **pas** l'index du tableau comme `key` si la liste peut changer d'ordre ou être filtrée : cela provoque des bugs d'affichage subtils.

# L'affichage conditionnel

```tsx
function Profil({ utilisateur }: { utilisateur: Utilisateur | null }) {
  // Retour anticipé
  if (!utilisateur) {
    return <p>Veuillez vous connecter.</p>;
  }

  return (
    <div>
      <h2>{utilisateur.nom}</h2>
      {/* Et logique : affiche seulement si vrai */}
      {utilisateur.admin && <span className="badge">Administrateur</span>}
      {/* Ternaire : l'un ou l'autre */}
      {utilisateur.actif ? <p>Compte actif</p> : <p>Compte suspendu</p>}
    </div>
  );
}
```

- **retour anticipé** pour les cas particuliers ;
- **`condition && <Element />`** pour afficher ou non ;
- **`condition ? <A /> : <B />`** pour choisir entre deux.

# Exercices

## Exercice 1 : Un composant avec props

Écrivez un composant `Badge` qui affiche un texte, avec une couleur passée en prop (`"vert"`, `"rouge"` ou `"gris"`), appliquée comme classe CSS.

<details>
<summary>Voir la solution</summary>

```tsx
interface BadgeProps {
  texte: string;
  couleur: "vert" | "rouge" | "gris";
}

function Badge({ texte, couleur }: BadgeProps) {
  return <span className={`badge badge-${couleur}`}>{texte}</span>;
}

// <Badge texte="Nouveau" couleur="vert" />
```

Le type littéral pour `couleur` empêche de passer une valeur invalide.

</details>

## Exercice 2 : Afficher une liste

À partir de `const produits = [{id: 1, nom: "A", prix: 10}, {id: 2, nom: "B", prix: 25}]`, écrivez un composant qui affiche chaque produit dans une liste, avec son nom et son prix.

<details>
<summary>Voir la solution</summary>

```tsx
function ListeProduits({ produits }: { produits: Produit[] }) {
  return (
    <ul>
      {produits.map((p) => (
        <li key={p.id}>
          {p.nom} - {p.prix} €
        </li>
      ))}
    </ul>
  );
}
```

On utilise `p.id` comme `key`, pas l'index.

</details>

## Exercice 3 : Communication enfant vers parent

Pourquoi un composant enfant ne peut-il pas modifier directement les données d'un parent ? Comment fait-on alors ?

<details>
<summary>Voir la solution</summary>

Les props sont **en lecture seule** et les données circulent **de haut en bas** : l'enfant reçoit des valeurs, il ne possède pas la donnée. Pour communiquer vers le haut, le parent passe une **fonction de rappel** (*callback*) en prop ; l'enfant l'**appelle** avec l'information. Le parent, lui, met à jour son propre état (chapitre suivant) et transmet les nouvelles valeurs vers le bas. Exemple : `<Bouton onClick={() => supprimer(id)} />` où `supprimer` appartient au parent.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Les fondamentaux de React
center: Décrire l'interface selon les données, en composants réutilisables, et laisser React mettre à jour le DOM.
points:
  - icon: code
    title: Composants et JSX
    text: Des fonctions qui renvoient du JSX ; majuscule, un seul racine, className, accolades.
  - icon: link
    title: Props
    text: Données du parent vers l'enfant, en lecture seule ; flux unidirectionnel.
  - icon: list
    title: Listes
    text: map pour transformer un tableau en éléments ; une key unique et stable.
  - icon: filter
    title: Conditionnel
    text: Retour anticipé, condition &&, ternaire pour choisir l'affichage.
  - icon: loop
    title: Communication
    text: Vers le haut via une fonction passée en prop que l'enfant appelle.
pitfall: Utiliser l'index du tableau comme key d'une liste qui change d'ordre ou se filtre.
remember: Les props sont en lecture seule ; les données descendent, les événements remontent via des callbacks.
```
