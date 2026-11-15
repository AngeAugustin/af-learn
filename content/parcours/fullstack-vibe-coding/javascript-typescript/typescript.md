---
title: TypeScript
description: Pourquoi typer, les types de base, interfaces et types, les unions, le typage des fonctions et des données d'API, et la configuration d'un projet.
duration: 60
objectives:
  - Expliquer ce qu'apporte TypeScript
  - Annoter variables, fonctions, objets et tableaux
  - Utiliser interfaces, types, unions et génériques simples
  - Typer les données d'une API et configurer un projet
---

# Pourquoi TypeScript ?

**TypeScript** est JavaScript **avec des types**. On écrit du JavaScript enrichi d'**annotations de types**, qu'un **compilateur** vérifie puis traduit en JavaScript ordinaire exécutable partout.

Son intérêt : **attraper les erreurs avant l'exécution**. Beaucoup de bugs (appeler une méthode sur `undefined`, passer un nombre là où on attend une chaîne, se tromper de nom de propriété) sont détectés **pendant que vous écrivez**, directement dans l'éditeur, au lieu de surgir chez l'utilisateur.

```typescript
function saluer(nom: string): string {
  return `Bonjour ${nom}`;
}

saluer("Alice");    // OK
saluer(42);         // Erreur détectée à la compilation : 42 n'est pas une string
```

TypeScript est devenu le **standard de fait** pour les projets web sérieux (c'est le langage de ce site lui-même). Il améliore aussi l'**autocomplétion** et la **documentation** : l'éditeur sait quels champs et méthodes existent.

# Les types de base

```typescript
let nom: string = "Alice";
let age: number = 30;
let actif: boolean = true;
let liste: number[] = [1, 2, 3];
let fruits: string[] = ["pomme", "poire"];

// Souvent, TypeScript DÉDUIT le type : pas besoin de l'écrire
let ville = "Lyon";          // inféré comme string
```

> [!TIP]
> Laissez TypeScript **inférer** les types quand c'est évident (`const age = 30` est déjà typé `number`). On annote surtout les **paramètres de fonctions**, les **valeurs de retour** quand c'est utile, et les **structures de données**. Trop d'annotations inutiles alourdissent le code.

Deux types particuliers :

- **`any`** désactive la vérification de types pour une valeur, à **éviter**, car il supprime justement l'intérêt de TypeScript ;
- **`unknown`** est le cousin sûr d'`any` : on doit vérifier le type avant de l'utiliser.

# Objets, interfaces et types

Pour décrire la **forme** d'un objet, on utilise une `interface` ou un `type` :

```typescript
interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  age?: number;            // optionnel (peut être absent)
  readonly cree_le: Date;  // lecture seule
}

const alice: Utilisateur = {
  id: 1,
  nom: "Alice",
  email: "alice@exemple.fr",
  cree_le: new Date(),
};
```

`interface` et `type` se ressemblent beaucoup. En pratique : `interface` pour décrire des objets (extensible), `type` pour tout le reste (unions, alias). Les deux conviennent dans la plupart des cas.

# Les unions et les types littéraux

Une **union** autorise plusieurs types possibles ; un **type littéral** restreint à des valeurs précises :

```typescript
type Statut = "brouillon" | "publie" | "archive";   // seulement ces 3 valeurs

function changerStatut(statut: Statut) { /* ... */ }
changerStatut("publie");     // OK
changerStatut("supprime");   // Erreur : "supprime" n'est pas un Statut

type Identifiant = number | string;   // l'un ou l'autre
```

Les types littéraux sont très utiles pour modéliser un ensemble **fini** d'états, et l'éditeur propose automatiquement les valeurs valides.

# Typer les fonctions et les données d'API

```typescript
// Fonction typée
const additionner = (a: number, b: number): number => a + b;

// Une fonction qui peut ne rien renvoyer
function journaliser(message: string): void {
  console.log(message);
}
```

Typer les **données reçues d'une API** est l'un des usages les plus utiles :

```typescript
interface Article {
  id: number;
  titre: string;
  publie: boolean;
}

async function chargerArticles(): Promise<Article[]> {
  const reponse = await fetch("/api/articles");
  if (!reponse.ok) throw new Error(`Erreur ${reponse.status}`);
  return reponse.json() as Promise<Article[]>;
}
```

> [!WARNING]
> `as Article[]` est une **assertion** : vous **affirmez** à TypeScript que la donnée a cette forme, sans qu'il le vérifie vraiment à l'exécution. Si l'API renvoie autre chose, l'erreur surgira plus loin. Pour une validation **réelle** à l'exécution (recommandée pour les données externes), on utilise une bibliothèque comme **Zod**, qui vérifie **et** en déduit le type.

```typescript
import { z } from "zod";

const ArticleSchema = z.object({
  id: z.number(),
  titre: z.string(),
  publie: z.boolean(),
});
type Article = z.infer<typeof ArticleSchema>;   // type déduit du schéma

const article = ArticleSchema.parse(donneesInconnues);  // vérifie ET type
```

# Les génériques (notion)

Un **générique** est un type « paramétré », qui s'adapte au type qu'on lui donne. On en utilise souvent sans les écrire :

```typescript
const nombres: Array<number> = [1, 2, 3];   // Array<number> = number[]

function premier<T>(liste: T[]): T | undefined {
  return liste[0];
}

premier([1, 2, 3]);        // renvoie un number
premier(["a", "b"]);       // renvoie un string
```

`<T>` est un type « à remplir » : `premier` fonctionne pour n'importe quel type d'éléments, tout en gardant le typage précis. Pas besoin de maîtriser les génériques pour débuter ; il suffit de les reconnaître.

# Configurer un projet

Un projet TypeScript se configure avec un fichier **`tsconfig.json`** :

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "noUncheckedIndexedAccess": true
  }
}
```

> [!IMPORTANT]
> Activez **`strict: true`** dès le départ. Ce mode impose un typage rigoureux (notamment la gestion des `null`/`undefined`), qui est précisément ce qui évite le plus de bugs. Démarrer sans, puis l'activer plus tard, est bien plus douloureux.

# Exercices

## Exercice 1 : Typer une fonction

Ajoutez les types à cette fonction qui calcule le prix TTC à partir d'un prix HT et d'un taux de TVA (par défaut 0,2) :

```javascript
function prixTTC(prixHT, taux = 0.2) {
  return prixHT * (1 + taux);
}
```

<details>
<summary>Voir la solution</summary>

```typescript
function prixTTC(prixHT: number, taux: number = 0.2): number {
  return prixHT * (1 + taux);
}
```

Les paramètres et la valeur de retour sont `number`. Le type du paramètre par défaut est déduit, mais l'annoter reste clair.

</details>

## Exercice 2 : Modéliser des états

Une commande peut être « en attente », « payée », « expédiée » ou « annulée ». Définissez un type, et une interface `Commande` avec un `id`, un `montant` et un `statut`.

<details>
<summary>Voir la solution</summary>

```typescript
type StatutCommande = "en_attente" | "payee" | "expediee" | "annulee";

interface Commande {
  id: number;
  montant: number;
  statut: StatutCommande;
}
```

Le type littéral garantit qu'aucun statut invalide ne peut être affecté, et l'éditeur propose les quatre valeurs.

</details>

## Exercice 3 : any ou validation ?

Un développeur écrit `const data: any = await reponse.json()` pour « éviter les erreurs de TypeScript ». Pourquoi est-ce une mauvaise idée, et que proposer ?

<details>
<summary>Voir la solution</summary>

`any` **désactive** toute vérification : on perd l'autocomplétion, et une erreur de structure (champ absent, mauvais type) ne sera plus détectée, elle resurgira à l'exécution, plus loin et plus difficile à diagnostiquer. Mieux : définir une **interface** pour les données attendues, et pour des données **externes** non fiables, utiliser une validation à l'exécution (Zod) qui vérifie la forme reçue **et** fournit le type. On ne fait confiance à la structure d'une réponse d'API qu'après l'avoir validée.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: TypeScript
center: Du JavaScript typé qui attrape les erreurs dans l'éditeur, avant qu'elles n'atteignent l'utilisateur.
points:
  - icon: check
    title: Pourquoi
    text: Détecter les erreurs à la compilation, meilleure autocomplétion et documentation.
  - icon: code
    title: Types de base
    text: string, number, boolean, tableaux ; laisser l'inférence quand c'est évident ; éviter any.
  - icon: puzzle
    title: Interfaces et unions
    text: Décrire la forme des objets ; unions et types littéraux pour des états finis.
  - icon: link
    title: Données d'API
    text: Typer les réponses ; valider les données externes à l'exécution avec Zod.
  - icon: shield
    title: strict
    text: Activer strict dès le départ pour la gestion des null et un typage rigoureux.
pitfall: Utiliser any ou une assertion as pour faire taire TypeScript, et perdre toute la protection.
remember: TypeScript ne vérifie qu'à la compilation ; les données externes se valident aussi à l'exécution.
```
