---
title: CSS moderne et responsive
description: Sélecteurs et cascade, le modèle de boîte, la mise en page avec Flexbox et Grid, le responsive avec les media queries, et les variables CSS.
duration: 60
objectives:
  - Appliquer des styles avec les sélecteurs et comprendre la cascade
  - Maîtriser le modèle de boîte
  - Construire des mises en page avec Flexbox et Grid
  - Rendre une page responsive et utiliser les variables CSS
---

# CSS en bref

**CSS** (*Cascading Style Sheets*) décrit la **présentation** du HTML : couleurs, polices, espacements, mise en page. Une règle CSS associe un **sélecteur** à des **déclarations** (propriété : valeur).

```css
/* sélecteur { propriété: valeur; } */
h1 {
  color: #1a1a2e;
  font-size: 2rem;
}
```

On relie le CSS au HTML par une feuille externe (recommandé) :

```html
<link rel="stylesheet" href="/styles.css" />
```

# Sélecteurs et cascade

```css
h1 { }                 /* par type de balise */
.carte { }             /* par classe (réutilisable) */
#menu { }              /* par identifiant (unique) */
nav a { }              /* descendant : les liens dans nav */
.carte:hover { }       /* état : au survol */
.carte > p { }         /* enfant direct */
```

La **classe** est le sélecteur le plus utilisé : réutilisable sur plusieurs éléments. Quand plusieurs règles s'appliquent, deux principes tranchent :

- la **spécificité** : un sélecteur plus précis l'emporte (identifiant > classe > balise) ;
- l'**ordre** : à spécificité égale, la dernière règle écrite gagne (la « cascade »).

> [!TIP]
> Évitez les identifiants et le `!important` pour styler : ils cassent la cascade et rendent le CSS difficile à maintenir. Préférez les **classes**, et une convention de nommage cohérente.

# Le modèle de boîte

Chaque élément est une **boîte** composée, de l'intérieur vers l'extérieur, du **contenu**, du **padding** (marge intérieure), de la **border** (bordure) et du **margin** (marge extérieure).

```diagram
type: layers
title: Le modèle de boîte
layers:
  - title: margin
    text: Espace extérieur, entre cet élément et les autres
  - title: border
    text: La bordure
  - title: padding
    text: Espace intérieur, entre le contenu et la bordure
  - title: contenu
    text: Le texte ou les éléments enfants
```

```css
/* Réglage quasi universel : inclure padding et border dans la largeur */
*, *::before, *::after {
  box-sizing: border-box;
}

.carte {
  padding: 1rem;
  border: 1px solid #ddd;
  margin-bottom: 1rem;
  border-radius: 8px;
}
```

> [!IMPORTANT]
> `box-sizing: border-box` est la première règle à poser dans tout projet : sans elle, ajouter du padding **agrandit** la boîte au-delà de la largeur fixée, source de frustration constante. Avec elle, la largeur déclarée inclut padding et bordure.

# Flexbox : aligner en ligne ou en colonne

**Flexbox** dispose des éléments sur **un axe** (une ligne ou une colonne) et gère leur alignement et leur espacement. Idéal pour une barre de navigation, une carte, un centrage.

```css
.barre {
  display: flex;
  justify-content: space-between;  /* répartition sur l'axe principal */
  align-items: center;             /* alignement sur l'axe secondaire */
  gap: 1rem;                       /* espace entre les éléments */
}
```

- `justify-content` : `flex-start`, `center`, `space-between`, `space-around`…
- `align-items` : `stretch`, `center`, `flex-start`…
- `flex-direction: column` pour empiler verticalement.

```video
url: https://www.youtube.com/watch?v=LNqBKTeeiWo
title: "Tutoriel CSS : Flexbox"
channel: "Grafikart.fr"
duration: "33:38"
lang: fr
why: "Le tutoriel Flexbox de Grafikart, en français, avec de nombreux exemples d'alignement."
```

# Grid : mise en page en deux dimensions

**CSS Grid** dispose les éléments en **lignes et colonnes** : parfait pour une grille de cartes ou la structure générale d'une page.

```css
.grille {
  display: grid;
  grid-template-columns: repeat(3, 1fr);   /* 3 colonnes de largeur égale */
  gap: 1.5rem;
}

/* Grille responsive qui s'adapte sans media query */
.grille-auto {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}
```

`minmax(250px, 1fr)` avec `auto-fill` crée autant de colonnes d'au moins 250 px que la largeur le permet : la grille passe de 1 à plusieurs colonnes **toute seule**.

> [!NOTE]
> Flexbox et Grid sont **complémentaires** : Flexbox pour une distribution sur **un** axe (aligner des éléments dans une barre), Grid pour une mise en page sur **deux** axes (une grille, la structure d'une page). On les combine souvent.

```video
url: https://www.youtube.com/watch?v=rg7Fvvl3taU
title: "Learn CSS Grid the easy way"
channel: "Kevin Powell"
duration: "37:04"
lang: en
why: "Kevin Powell, une référence du CSS, présente Grid de façon progressive et sans complexité inutile."
```

# Le responsive

Un site **responsive** s'adapte à toutes les tailles d'écran. On part de l'approche **mobile-first** : styliser d'abord pour mobile, puis **ajouter** des règles pour les écrans plus larges avec des **media queries**.

```css
/* Styles de base : mobile */
.conteneur {
  padding: 1rem;
}

/* À partir de 768px (tablette) */
@media (min-width: 768px) {
  .conteneur {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

Les unités **relatives** aident aussi : `rem` (relatif à la taille de base, pour les tailles de police et espacements), `%` et `fr` (pour les largeurs), `vw`/`vh` (proportion de la fenêtre). On évite les largeurs fixes en pixels pour les conteneurs.

# Les variables CSS

Les **variables CSS** (propriétés personnalisées) évitent de répéter des valeurs et facilitent les thèmes :

```css
:root {
  --couleur-principale: #4c86a8;
  --espacement: 1rem;
  --rayon: 8px;
}

.bouton {
  background: var(--couleur-principale);
  padding: var(--espacement);
  border-radius: var(--rayon);
}
```

Changer `--couleur-principale` à un seul endroit met à jour tout le site, c'est la base des **thèmes clair/sombre**.

> [!TIP]
> Dans un vrai projet, on utilise souvent un outil ou un framework CSS (Tailwind CSS, par exemple) qui industrialise ces principes. Mais comprendre le CSS natif reste indispensable : les frameworks ne font que l'organiser.

# Exercices

## Exercice 1 : Le padding qui déborde

Une carte a `width: 300px; padding: 20px;` et déborde de son conteneur de 300 px. Pourquoi, et comment corriger ?

<details>
<summary>Voir la solution</summary>

Sans `box-sizing: border-box`, la largeur totale de la carte est `300 + 20 (gauche) + 20 (droite) = 340px`, d'où le débordement. Correction : appliquer `box-sizing: border-box` (idéalement à tous les éléments via `*`), pour que `width: 300px` **inclue** le padding. La carte mesure alors bien 300 px au total.

</details>

## Exercice 2 : Centrer

Comment centrer un élément horizontalement **et** verticalement dans son conteneur avec Flexbox ?

<details>
<summary>Voir la solution</summary>

```css
.conteneur {
  display: flex;
  justify-content: center;   /* centre horizontalement (axe principal) */
  align-items: center;       /* centre verticalement (axe secondaire) */
  min-height: 100vh;         /* pour que le conteneur ait une hauteur */
}
```

C'est le moyen le plus simple et le plus fiable de centrer un élément.

</details>

## Exercice 3 : Grille responsive

Créez une grille de cartes qui affiche 1 colonne sur mobile, et autant de colonnes de 280 px minimum que l'écran le permet ensuite, sans écrire de media query.

<details>
<summary>Voir la solution</summary>

```css
.grille {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
```

Sur un écran étroit, une seule colonne de 280 px tient : la grille affiche une colonne. Quand la largeur augmente, elle ajoute automatiquement des colonnes. Aucune media query nécessaire.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: CSS moderne et responsive
center: Styliser avec des classes, maîtriser la boîte, et composer avec Flexbox, Grid et les media queries.
points:
  - icon: code
    title: Sélecteurs et cascade
    text: Classes surtout ; spécificité et ordre tranchent ; éviter id et !important.
  - icon: layers
    title: Modèle de boîte
    text: Contenu, padding, border, margin ; box-sizing border-box en premier.
  - icon: ruler
    title: Flexbox
    text: Un axe ; justify-content, align-items, gap ; barres, centrage.
  - icon: list
    title: Grid
    text: Deux axes ; grid-template-columns, minmax et auto-fill pour le responsive.
  - icon: sparkles
    title: Responsive et variables
    text: Mobile-first, media queries, unités relatives, variables CSS pour les thèmes.
pitfall: Oublier box-sizing border-box et se battre contre des boîtes qui débordent.
remember: Flexbox pour un axe, Grid pour deux ; les frameworks organisent ces principes, ils ne les remplacent pas.
```
