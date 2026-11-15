---
title: Composition et bonnes pratiques React
description: Découper et composer les composants, la prop children, partager l'état, le contexte, les listes et formulaires, et les grands principes de performance.
duration: 55
objectives:
  - Découper une interface en composants bien pensés
  - Composer avec la prop children et faire remonter l'état
  - Partager un état global avec le contexte
  - Connaître les bons réflexes de performance et d'organisation
---

# Découper en composants

Un bon composant fait **une chose**, porte un **nom clair** et reste de taille **raisonnable**. Quand une fonction de rendu devient longue ou répétitive, c'est le signe qu'il faut la **découper**.

```tsx
// Une page composée de composants dédiés
function PageProduit({ produit }: { produit: Produit }) {
  return (
    <article>
      <EnteteProduit produit={produit} />
      <GalerieImages images={produit.images} />
      <PrixEtAchat produit={produit} />
      <AvisClients produitId={produit.id} />
    </article>
  );
}
```

Avantages : chaque morceau est **lisible**, **testable** et **réutilisable**. On nomme les composants d'après **ce qu'ils représentent**, pas d'après leur apparence (`BoutonAchat`, pas `BoutonVert`).

# La prop children

La prop spéciale **`children`** permet de passer du **contenu** à l'intérieur d'un composant, comme on met du contenu entre des balises HTML. C'est la base de la composition.

```tsx
function Carte({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="carte">
      <h2>{titre}</h2>
      <div className="carte-corps">{children}</div>
    </section>
  );
}

// Utilisation : tout ce qui est entre les balises devient children
function App() {
  return (
    <Carte titre="Mon profil">
      <p>Du texte libre.</p>
      <button>Un bouton</button>
    </Carte>
  );
}
```

Un composant « conteneur » comme `Carte` gère la **structure et le style**, sans connaître son contenu : très réutilisable.

# Faire remonter l'état

Quand **deux composants** doivent partager une donnée, on place l'état dans leur **parent commun** le plus proche, et on la redistribue par props. C'est le **lifting state up**.

```tsx
function App() {
  const [recherche, setRecherche] = useState("");
  return (
    <>
      <BarreRecherche valeur={recherche} onChangement={setRecherche} />
      <Resultats filtre={recherche} />
    </>
  );
}
```

Ici `BarreRecherche` (qui modifie) et `Resultats` (qui lit) partagent l'état `recherche`, détenu par leur parent `App`. La barre reçoit une fonction pour le modifier, les résultats reçoivent la valeur.

# Le contexte : éviter le passage en cascade

Quand une donnée doit être accessible **loin** dans l'arbre (le thème, l'utilisateur connecté, la langue), la passer de props en props à chaque niveau (*prop drilling*) devient pénible. Le **contexte** permet de la rendre disponible à tout un sous-arbre.

```tsx
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext<"clair" | "sombre">("clair");

function App() {
  const [theme, setTheme] = useState<"clair" | "sombre">("clair");
  return (
    <ThemeContext.Provider value={theme}>
      <Page />
      <button onClick={() => setTheme(theme === "clair" ? "sombre" : "clair")}>
        Changer de thème
      </button>
    </ThemeContext.Provider>
  );
}

// N'importe quel composant du sous-arbre lit le contexte, sans props intermédiaires
function Titre() {
  const theme = useContext(ThemeContext);
  return <h1 className={theme}>Bonjour</h1>;
}
```

> [!TIP]
> Le contexte est fait pour des données **globales** qui changent **peu** (thème, utilisateur, langue). Pour un état applicatif complexe et très dynamique, on utilise plutôt une bibliothèque de gestion d'état (Zustand, Redux Toolkit). Ne mettez pas tout dans le contexte : les props restent la façon normale de passer des données.

# Les formulaires

Pour un formulaire simple, les champs contrôlés (chapitre précédent) suffisent. Dès que le formulaire se complexifie (validation, nombreux champs, messages d'erreur), on utilise une **bibliothèque** dédiée comme **React Hook Form**, souvent couplée à **Zod** pour la validation (chapitre TypeScript) :

```tsx
// Principe (simplifié) : le schéma Zod valide, la bibliothèque gère l'état et les erreurs
const Schema = z.object({
  email: z.string().email("E-mail invalide"),
  age: z.number().min(18, "Vous devez être majeur"),
});
```

L'avantage : moins de code répétitif, une validation **déclarative** et cohérente, et de bons messages d'erreur. Rappel de sécurité : la validation côté client **ne remplace jamais** la validation côté serveur.

# Les grands principes de performance

React est rapide par défaut, mais quelques réflexes aident sur les grandes applications :

- **Ne pas sur-optimiser** : écrivez d'abord du code clair. Mesurez (avec les React DevTools) **avant** d'optimiser.
- **Des keys stables** sur les listes (chapitre précédent) : la base d'un rendu efficace.
- **Éviter les calculs lourds** répétés à chaque rendu : `useMemo` mémorise un calcul coûteux, `useCallback` une fonction, quand c'est réellement justifié.
- **Découper** les composants : un changement d'état ne re-rend que le composant concerné et ses enfants, pas toute la page.
- **Le code splitting** (chargement à la demande) pour ne pas tout envoyer au premier chargement.

> [!IMPORTANT]
> L'erreur la plus fréquente est la **sur-optimisation prématurée** : `useMemo` et `useCallback` partout « au cas où », ce qui ajoute de la complexité sans gain mesurable, voire ralentit. La règle : du code simple d'abord, l'optimisation seulement là où un problème **mesuré** l'exige. Le compilateur React récent optimise d'ailleurs automatiquement une grande partie de ces cas.

# Exercices

## Exercice 1 : Un composant conteneur

Écrivez un composant `Modale` qui affiche un titre et un contenu libre (children), avec un bouton de fermeture qui appelle une fonction `onFermer` passée en prop.

<details>
<summary>Voir la solution</summary>

```tsx
interface ModaleProps {
  titre: string;
  onFermer: () => void;
  children: React.ReactNode;
}

function Modale({ titre, onFermer, children }: ModaleProps) {
  return (
    <div className="modale-fond">
      <div className="modale">
        <header>
          <h2>{titre}</h2>
          <button onClick={onFermer} aria-label="Fermer">×</button>
        </header>
        <div className="modale-corps">{children}</div>
      </div>
    </div>
  );
}
```

`children` rend la modale réutilisable pour n'importe quel contenu.

</details>

## Exercice 2 : Partager l'état

Deux composants frères, un filtre et une liste, doivent partager la valeur du filtre. Où placer l'état ?

<details>
<summary>Voir la solution</summary>

Dans leur **parent commun** le plus proche (*lifting state up*). Le parent détient l'état du filtre, passe la **valeur** et une fonction de mise à jour au composant filtre, et la **valeur** au composant liste. Les deux frères restent synchronisés sans communiquer directement entre eux.

</details>

## Exercice 3 : Contexte ou props ?

Pour chaque donnée, contexte ou props ?

1. Le titre d'une carte, différent pour chaque carte.
2. Le thème clair/sombre de toute l'application.
3. L'utilisateur connecté, lu à de nombreux endroits.

<details>
<summary>Voir la solution</summary>

1. **Props** : donnée locale, propre à chaque carte.
2. **Contexte** : donnée globale, qui change peu, lue partout.
3. **Contexte** : donnée globale lue à de nombreux endroits, qui éviterait un fastidieux passage en cascade. (Pour un état utilisateur très dynamique, une bibliothèque dédiée peut compléter.)

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Composition et bonnes pratiques React
center: Découper en composants clairs, composer avec children, et placer l'état au bon endroit.
points:
  - icon: puzzle
    title: Découper
    text: Un composant, une chose, un nom clair ; nommé par ce qu'il représente.
  - icon: layers
    title: children
    text: Passer du contenu libre ; un conteneur gère structure et style sans connaître le contenu.
  - icon: loop
    title: Remonter l'état
    text: État partagé placé dans le parent commun, redistribué par props.
  - icon: link
    title: Contexte
    text: Données globales qui changent peu (thème, utilisateur) ; pas tout, les props restent la norme.
  - icon: gauge
    title: Performance
    text: Code clair d'abord, keys stables, mesurer avant d'optimiser ; pas de sur-optimisation.
pitfall: Mettre useMemo et useCallback partout « au cas où », au détriment de la clarté.
remember: On place l'état au parent commun le plus proche de ceux qui le partagent.
```
