---
title: HTML sémantique et accessible
description: La structure d'un document HTML, les balises sémantiques, les formulaires, les images et liens, et les bases de l'accessibilité.
duration: 50
objectives:
  - Écrire un document HTML bien structuré
  - Choisir les balises sémantiques adaptées au contenu
  - Construire des formulaires corrects et accessibles
  - Appliquer les bases de l'accessibilité web
---

# La structure d'un document

**HTML** (*HyperText Markup Language*) décrit la **structure** et le **sens** d'une page, à l'aide de **balises**. Il ne s'occupe ni de la mise en forme (c'est le CSS) ni de l'interactivité (c'est le JavaScript).

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Ma page</title>
  </head>
  <body>
    <h1>Bonjour</h1>
    <p>Mon premier paragraphe.</p>
  </body>
</html>
```

- `<!doctype html>` déclare un document HTML moderne.
- `lang="fr"` indique la langue (important pour l'accessibilité et le référencement).
- `<meta charset="utf-8">` : l'encodage, pour afficher correctement les accents.
- `<meta name="viewport">` : indispensable pour l'affichage sur mobile.
- `<head>` contient les **métadonnées** (invisibles) ; `<body>` le **contenu** visible.

Une balise s'ouvre et se ferme (`<p>…</p>`) ; certaines sont **auto-fermantes** (`<img />`, `<br />`). Les balises peuvent porter des **attributs** (`<a href="...">`).

# Les balises sémantiques

Le **sens** des balises compte autant que le rendu. Plutôt que des `<div>` partout, on utilise des balises qui **décrivent** le rôle du contenu :

```html
<body>
  <header>
    <nav><!-- menu de navigation --></nav>
  </header>
  <main>
    <article>
      <h1>Titre de l'article</h1>
      <section>
        <h2>Une partie</h2>
        <p>…</p>
      </section>
    </article>
    <aside><!-- contenu secondaire --></aside>
  </main>
  <footer><!-- pied de page --></footer>
</body>
```

| Balise | Rôle |
|---|---|
| `<header>` | En-tête d'une page ou d'une section |
| `<nav>` | Navigation principale |
| `<main>` | Contenu principal (un seul par page) |
| `<article>` | Contenu autonome (un billet, une fiche) |
| `<section>` | Regroupement thématique |
| `<aside>` | Contenu secondaire (encadré, barre latérale) |
| `<footer>` | Pied de page |

> [!TIP]
> Les **titres** `<h1>` à `<h6>` structurent le document comme un plan : un seul `<h1>` par page, puis une hiérarchie logique sans sauter de niveau. Les lecteurs d'écran et les moteurs de recherche s'en servent pour comprendre la page.

```video
url: https://www.youtube.com/watch?v=bOUhq46fd5g
title: "Why & When to Use Semantic HTML Elements over Divs"
channel: "ByteGrad"
duration: "12:01"
lang: en
why: "ByteGrad explique pourquoi et quand préférer les éléments sémantiques aux div, pour le navigateur, les moteurs et les lecteurs d'écran."
```

# Liens, images et listes

```html
<a href="https://exemple.fr">Lien externe</a>
<a href="/contact">Lien interne</a>

<img src="/photo.jpg" alt="Description de l'image pour l'accessibilité" width="400" height="300" />

<ul>
  <li>Élément non ordonné</li>
  <li>Autre élément</li>
</ul>

<ol>
  <li>Première étape</li>
  <li>Deuxième étape</li>
</ol>
```

L'attribut **`alt`** d'une image est essentiel : il décrit l'image pour les personnes qui ne la voient pas (lecteurs d'écran) et s'affiche si l'image ne charge pas. Une image purement décorative prend un `alt=""` vide.

# Les formulaires

Les formulaires collectent les données de l'utilisateur :

```html
<form action="/inscription" method="post">
  <label for="email">Adresse e-mail</label>
  <input type="email" id="email" name="email" required />

  <label for="mdp">Mot de passe</label>
  <input type="password" id="mdp" name="mdp" required minlength="12" />

  <fieldset>
    <legend>Formule</legend>
    <label><input type="radio" name="formule" value="base" /> Base</label>
    <label><input type="radio" name="formule" value="pro" /> Pro</label>
  </fieldset>

  <button type="submit">S'inscrire</button>
</form>
```

Points clés :

- chaque champ a un **`<label>`** relié par `for`/`id` : indispensable pour l'accessibilité et le confort (cliquer le libellé active le champ) ;
- le **`type`** adapté (`email`, `password`, `number`, `date`…) améliore la saisie, surtout sur mobile, et active une validation native ;
- les attributs `required`, `minlength`, `pattern` offrent une **validation côté navigateur** : pratique pour l'utilisateur, mais qui ne remplace **jamais** la validation côté serveur (rappel des parcours de sécurité).

# Les bases de l'accessibilité

L'**accessibilité** (souvent abrégée **a11y**) vise à rendre le web utilisable par **tous**, y compris les personnes en situation de handicap. C'est une obligation légale pour de nombreux sites, et une bonne pratique universelle.

Quelques fondamentaux :

- **HTML sémantique** : c'est déjà l'essentiel de l'accessibilité, car les technologies d'assistance s'appuient dessus.
- **`alt`** pertinent sur les images.
- **Labels** sur tous les champs de formulaire.
- **Contraste** suffisant entre le texte et le fond (relève du CSS).
- **Navigation au clavier** : tout doit être utilisable sans souris.
- Les attributs **ARIA** (`aria-label`, `role`…) complètent le HTML quand il ne suffit pas, mais la règle est : « un bon HTML natif vaut mieux que des ARIA ajoutés ».

> [!IMPORTANT]
> Le standard de référence est le **WCAG** (*Web Content Accessibility Guidelines*). En France, le **RGAA** en découle pour les sites publics. On n'a pas besoin de tout connaître pour commencer : HTML sémantique, `alt`, labels et contraste couvrent déjà une grande part des besoins.

# Exercices

## Exercice 1 : Corriger une structure

Améliorez ce code en utilisant des balises sémantiques et une structure correcte :

```html
<div class="titre">Mon blog</div>
<div class="menu">Accueil | Articles</div>
<div class="contenu">
  <div class="gros-titre">Premier article</div>
  <div>Du texte...</div>
</div>
```

<details>
<summary>Voir la solution</summary>

```html
<header>
  <h1>Mon blog</h1>
  <nav>
    <a href="/">Accueil</a>
    <a href="/articles">Articles</a>
  </nav>
</header>
<main>
  <article>
    <h2>Premier article</h2>
    <p>Du texte...</p>
  </article>
</main>
```

Les balises décrivent le rôle du contenu, et les titres suivent une hiérarchie.

</details>

## Exercice 2 : Un formulaire accessible

Écrivez un formulaire de contact avec un nom, un e-mail et un message, tous obligatoires, accessible.

<details>
<summary>Voir la solution</summary>

```html
<form action="/contact" method="post">
  <label for="nom">Nom</label>
  <input type="text" id="nom" name="nom" required />

  <label for="email">E-mail</label>
  <input type="email" id="email" name="email" required />

  <label for="message">Message</label>
  <textarea id="message" name="message" required></textarea>

  <button type="submit">Envoyer</button>
</form>
```

Chaque champ a un `<label>` relié, un `type` adapté et `required`.

</details>

## Exercice 3 : L'attribut alt

Pour chaque image, quel `alt` écrire ?

1. Le logo cliquable de l'entreprise, qui ramène à l'accueil.
2. Un graphique montrant la hausse des ventes au T4.
3. Une bordure décorative entre deux sections.

<details>
<summary>Voir la solution</summary>

1. `alt="Nom de l'entreprise, accueil"` : décrit la destination du lien.
2. `alt="Les ventes ont augmenté de 20 % au quatrième trimestre"` : transmet l'**information** du graphique, pas juste « graphique ».
3. `alt=""` : image purement décorative, ignorée par les lecteurs d'écran.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: HTML sémantique et accessible
center: Décrire la structure et le sens du contenu, pour tous les utilisateurs et toutes les machines.
points:
  - icon: file
    title: Structure
    text: doctype, head avec métadonnées, body avec le contenu ; charset et viewport.
  - icon: list
    title: Sémantique
    text: header, nav, main, article, section, aside, footer ; titres h1–h6 hiérarchisés.
  - icon: link
    title: Liens et images
    text: a avec href, img avec un alt pertinent (ou vide si décoratif).
  - icon: check
    title: Formulaires
    text: label relié à chaque champ, type adapté, validation native puis serveur.
  - icon: users
    title: Accessibilité
    text: HTML natif d'abord, alt, labels, contraste, clavier ; WCAG / RGAA.
pitfall: Remplir la page de div sans sens au lieu d'utiliser les balises sémantiques.
remember: Un bon HTML sémantique est déjà la plus grande partie de l'accessibilité.
```
