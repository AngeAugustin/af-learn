---
title: Tests et qualité du code
description: Pourquoi tester, la pyramide des tests, tests unitaires avec Vitest, tests de composants et de bout en bout, et les outils de qualité (lint, format, types, CI).
duration: 55
objectives:
  - Expliquer l'intérêt des tests automatisés
  - Écrire des tests unitaires et de composants
  - Situer les tests de bout en bout
  - Mettre en place les outils de qualité et une CI
---

# Pourquoi tester ?

Un **test automatisé** est du code qui **vérifie** que votre code fonctionne. Son intérêt : attraper les régressions (un changement qui casse ce qui marchait), documenter le comportement attendu, et permettre de **modifier** le code en confiance. Sans tests, chaque modification risque de casser quelque chose sans qu'on le sache avant la production.

> [!TIP]
> On ne teste pas « tout à 100 % ». On teste en **priorité** ce qui est **important** (logique métier, calculs, cas limites) et ce qui est **fragile** (code complexe, souvent modifié). Un peu de tests bien choisis vaut mieux que beaucoup de tests sur du code trivial.

# La pyramide des tests

```diagram
type: layers
title: La pyramide des tests
layers:
  - title: Bout en bout (peu nombreux)
    text: L'application entière dans un vrai navigateur ; lents mais réalistes
  - title: Intégration / composants
    text: Plusieurs pièces ensemble (un composant, une route) ; équilibre
  - title: Unitaires (nombreux et rapides)
    text: Une fonction isolée ; rapides, précis, faciles à écrire
```

Beaucoup de tests **unitaires** rapides à la base, moins de tests d'**intégration**, et quelques tests **de bout en bout** pour les parcours critiques. Trop de tests de bout en bout rend la suite lente et fragile.

# Tests unitaires avec Vitest

**Vitest** est l'outil de test moderne de l'écosystème (compatible avec l'API de Jest). On teste des **fonctions pures** (sans réseau ni base) :

```ts
// prix.ts
export function prixTTC(prixHT: number, taux = 0.2): number {
  return Math.round(prixHT * (1 + taux) * 100) / 100;
}
```

```ts
// prix.test.ts
import { describe, it, expect } from "vitest";
import { prixTTC } from "./prix";

describe("prixTTC", () => {
  it("applique la TVA par défaut de 20 %", () => {
    expect(prixTTC(100)).toBe(120);
  });

  it("accepte un taux personnalisé", () => {
    expect(prixTTC(100, 0.1)).toBe(110);
  });

  it("arrondit à deux décimales", () => {
    expect(prixTTC(9.99)).toBe(11.99);
  });
});
```

Un bon test suit le schéma **préparer / agir / vérifier** : on prépare les données, on appelle la fonction, on vérifie le résultat avec `expect`. On teste le **cas normal** et les **cas limites** (zéro, valeurs négatives, limites).

> [!IMPORTANT]
> Rendez votre logique **testable** en l'isolant dans des **fonctions pures**, séparées des accès réseau, base de données et interface. Une fonction pure (mêmes entrées → mêmes sorties, sans effet de bord) se teste en quelques lignes. Du code qui mélange calcul, requête et affichage est difficile à tester : signe qu'il faut le découper.

# Tests de composants

On teste un composant React en le **rendant** et en vérifiant ce qu'il affiche et comment il réagit, avec **Testing Library** :

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Compteur } from "./Compteur";

it("incrémente au clic", async () => {
  render(<Compteur />);
  const bouton = screen.getByRole("button");
  expect(bouton).toHaveTextContent("0");
  await userEvent.click(bouton);
  expect(bouton).toHaveTextContent("1");
});
```

La philosophie de Testing Library : tester comme un **utilisateur** (chercher par rôle, par texte visible), pas les détails internes. Un test qui ne casse pas quand on refactorise l'implémentation, mais casse quand le comportement change, est un bon test.

# Tests de bout en bout

Les tests **de bout en bout** (*end-to-end*, E2E) pilotent l'application entière dans un **vrai navigateur**, comme un utilisateur : ouvrir une page, remplir un formulaire, cliquer, vérifier le résultat. Les outils de référence sont **Playwright** et **Cypress**.

```ts
// Principe avec Playwright
import { test, expect } from "@playwright/test";

test("un utilisateur peut se connecter", async ({ page }) => {
  await page.goto("/connexion");
  await page.fill('input[name="email"]', "test@exemple.fr");
  await page.fill('input[name="mdp"]', "motdepasse");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/tableau-de-bord");
});
```

On les réserve aux **parcours critiques** (connexion, achat, création de compte) : réalistes mais lents et plus fragiles.

# Les outils de qualité

Au-delà des tests, quelques outils maintiennent la qualité au quotidien :

| Outil | Rôle |
|---|---|
| **ESLint** | Détecte les erreurs et mauvaises pratiques dans le code |
| **Prettier** | Formate le code automatiquement (fin des débats de style) |
| **TypeScript (`tsc`)** | Vérifie les types (`tsc --noEmit`) |
| **Vitest / Playwright** | Exécutent les tests |

On automatise tout cela dans une **intégration continue** (CI), qui lance ces vérifications à chaque modification (pull request) : lint, types, tests. Un changement qui casse quelque chose est détecté **avant** d'être fusionné (parcours Data Engineering et cybersécurité pour les détails de la CI).

```bash
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm test             # Vitest
```

> [!TIP]
> Mettez en place ces outils **dès le début** d'un projet : les ajouter sur une base existante est bien plus pénible. Un *hook* de pré-commit (avec un outil comme Husky) peut lancer lint et format automatiquement avant chaque commit.

# Exercices

## Exercice 1 : Rendre testable

Pourquoi cette fonction est-elle difficile à tester, et comment la découper ?

```ts
async function afficherTotal() {
  const r = await fetch("/api/panier");
  const panier = await r.json();
  const total = panier.articles.reduce((s, a) => s + a.prix * a.quantite, 0);
  document.querySelector("#total").textContent = `${total} €`;
}
```

<details>
<summary>Voir la solution</summary>

Elle mélange **réseau**, **calcul** et **affichage** : impossible à tester sans navigateur ni serveur. On isole le calcul en fonction **pure**, facile à tester :

```ts
export function calculerTotal(articles: Article[]): number {
  return articles.reduce((s, a) => s + a.prix * a.quantite, 0);
}
```

```ts
it("calcule le total du panier", () => {
  expect(calculerTotal([{ prix: 10, quantite: 2 }, { prix: 5, quantite: 1 }])).toBe(25);
});
```

Le chargement et l'affichage restent testés à part (intégration, E2E).

</details>

## Exercice 2 : Quel type de test ?

Quel niveau de test pour chaque besoin ?

1. Vérifier qu'une fonction de calcul de remise donne le bon résultat.
2. Vérifier que le parcours complet « ajouter au panier puis payer » fonctionne.
3. Vérifier qu'un composant affiche un message d'erreur quand un champ est vide.

<details>
<summary>Voir la solution</summary>

1. **Unitaire** : une fonction pure, rapide à tester.
2. **De bout en bout** (E2E) : parcours critique traversant toute l'application.
3. **Composant** (intégration) : rendu du composant et vérification de son comportement.

</details>

## Exercice 3 : Un bon test de composant

Pourquoi vaut-il mieux chercher un bouton par son **rôle** et son **texte** que par sa classe CSS dans un test ?

<details>
<summary>Voir la solution</summary>

Chercher par rôle/texte teste ce que **voit et fait l'utilisateur**, indépendamment de l'implémentation : si on change la classe CSS ou la structure interne sans changer le comportement, le test continue de passer. Chercher par classe CSS lie le test aux **détails internes** : il casse à la moindre refactorisation, même quand le comportement est inchangé (faux positif). Un bon test casse quand le **comportement** change, pas quand on réorganise le code.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Tests et qualité du code
center: Vérifier automatiquement ce qui compte, en isolant la logique, pour modifier le code en confiance.
points:
  - icon: test
    title: Pourquoi
    text: Attraper les régressions, documenter, modifier sans peur ; tester ce qui est important et fragile.
  - icon: layers
    title: La pyramide
    text: Beaucoup d'unitaires rapides, quelques intégrations, peu de bout en bout.
  - icon: code
    title: Unitaires
    text: Vitest sur des fonctions pures ; préparer, agir, vérifier ; cas normaux et limites.
  - icon: eye
    title: Composants et E2E
    text: Testing Library comme un utilisateur ; Playwright pour les parcours critiques.
  - icon: check
    title: Qualité
    text: ESLint, Prettier, tsc, tests ; automatisés en CI à chaque modification.
pitfall: Mélanger calcul, réseau et affichage dans une fonction, la rendant impossible à tester.
remember: Isoler la logique en fonctions pures est la clé d'un code facile à tester.
```
