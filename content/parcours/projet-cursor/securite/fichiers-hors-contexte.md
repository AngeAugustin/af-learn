---
title: "Exclure un fichier du contexte"
description: "Écrire un .cursorignore à la racine, savoir ce qu'il bloque, et laisser la liste réelle hors de l'agent."
duration: 50
objectives:
  - "Créer un .cursorignore à la racine, avec la syntaxe de .gitignore"
  - "Dire qu'il bloque l'agent, Tab et les mentions @, en plus de .gitignore"
  - "Reconnaître que le terminal et les outils MCP peuvent encore lire le fichier"
  - "Garder la liste d'attente réelle hors contexte et un jeu fictif dans le dépôt"
---

# Un fichier à la racine

App Sève aide Léa Vernet, Atelier Sève, Lyon Croix-Rousse. Samedi 10 h-13 h, 8 places, 45 €, attente maximum 12, décision avant 18 h la veille. Douze stages par mois, remplissage autour de 70 %, environ 3 absents liés à un SMS oublié. Pour tester l'attente, il vous faut des lignes. Les vraies lignes portent des prénoms et des téléphones. Elles n'ont pas à entrer dans le contexte de l'agent.

`.cursorignore` se place à la racine du dépôt. Sa syntaxe est celle de `.gitignore` : un motif par ligne, les mêmes façons de nommer un fichier, un dossier ou une famille. Vous le créez comme un fichier du projet, à la racine, pas dans un sous-dossier au hasard, pas dans le chat.

> [!NOTE]
> La syntaxe est celle de `.gitignore`. Un motif que vous sauriez écrire pour Git s'écrit de la même façon ici.

# Ce que Git ignore déjà

Cursor respecte déjà `.gitignore`. Un fichier que Git ignore est donc déjà hors du contexte de l'agent. `.cursorignore` sert aux exclusions en plus : vous y nommez ce que vous voulez écarter même si Git ne l'ignore pas, ou ce que vous voulez citer explicitement.

Vous ne videz pas `.gitignore` pour tout recopier. Vous ouvrez `.cursorignore` et vous y ajoutez ce qui doit rester hors de l'agent, de Tab et des mentions `@`, au-delà de ce que Git couvre déjà. La liste d'attente réelle en fait partie, sous le nom que vous lui avez donné dans le projet, par exemple `attente-reelle.csv`.

# Agent, Tab, mentions

Le fichier cité dans `.cursorignore` n'est plus un contexte que l'agent peut prendre. Tab ne s'en sert pas pour proposer une suite. Une mention `@` ne l'attache pas à la demande. Vous le vérifiez par le geste : dans le chat, vous tentez de mentionner `attente-reelle.csv`. Le fichier ne se propose pas. Le jeu fictif, lui, se propose, parce qu'il n'est pas dans la liste.

Vous pouvez encore ouvrir le fichier vous-même dans l'éditeur. L'exclusion vise l'agent, Tab et `@`. Elle ne ferme pas le fichier. Elle empêche de le glisser dans une demande sans le vouloir, par une mention ou une complétion.

```diagram
type: compare
title: "Ce que .cursorignore change"
columns:
  - title: "Bloqué"
    tone: teal
    items:
      - "L'accès de l'agent"
      - "Tab"
      - "Les mentions @"
  - title: "Pas bloqué"
    tone: rose
    items:
      - "Le terminal"
      - "Les outils MCP"
      - "Une commande qui lit le fichier"
```

# Ce qui n'est pas bloqué

Le terminal n'est pas bloqué par `.cursorignore`. Une commande peut encore lire le fichier et en afficher le contenu. Les outils MCP ne sont pas bloqués non plus. Un outil branché sur le dépôt peut ouvrir le même chemin. Ce n'est donc pas une garantie totale. C'est une exclusion du contexte de l'agent, de Tab et des mentions, pas un coffre.

Si l'agent dit qu'il ne voit pas `attente-reelle.csv`, puis propose une commande pour l'afficher, vous refusez la commande. Le contournement est précisément ce que le terminal permet encore. Vous ne demandez pas non plus à un outil MCP de lire ce fichier « puisque l'agent ne peut pas ». Vous travaillez avec le jeu fictif.

> [!WARNING]
> `.cursorignore` n'arrête ni le terminal ni les outils MCP. Une commande peut encore lire le fichier. Ce n'est pas une garantie totale.

# Les motifs

Vous écrivez des motifs, pas une phrase. Les exemples utiles pour Sève, à la racine :

```gitignore
.env
.env.*
secrets/
*.pem
attente-reelle.csv
```

`.env` vise le fichier d'environnement. `.env.*` vise les variantes. `secrets/` vise le dossier. `*.pem` vise les fichiers de ce suffixe. `attente-reelle.csv` vise la liste réelle, par son nom. Vous adaptez le nom si le vôtre diffère. Vous ne mettez pas le jeu fictif dans cette liste : il doit rester mentionnable pour les tests.

> [!TIP]
> Une ligne, un motif. Vous relisez le fichier comme vous reliriez un `.gitignore`, du haut vers le bas.

# La liste réelle et le jeu fictif

La liste réelle reste hors contexte. Le dépôt garde un jeu fictif, par exemple `attente-fictive.csv`, assez petit pour un test : Camille, et une situation du genre « 3 places restantes ». Pas de téléphone réel. Pas de prénom copié de la file de Léa. Le test de la page peut citer ce fichier avec `@`, ou le lire parce qu'il fait partie du projet.

Vous séparez les deux fichiers dans votre tête avant chaque demande. Le réel ne s'attache pas. Le fictif sert à vérifier les 8 places, le prix de 45 €, le plafond d'attente de 12 et la décision avant 18 h, sans emporter la file vraie. Exclure le fichier n'autorise pas non plus à coller son contenu dans le chat : la commande et le collage sont deux autres portes, et vous ne les ouvrez pas.

> [!IMPORTANT]
> La liste réelle reste hors contexte. Le jeu fictif reste dans le dépôt, pour les tests. Les deux ne s'échangent pas.

# Exercices

## Exercice 1 : Écrire les motifs

Vous créez `.cursorignore` à la racine d'App Sève. Quelles lignes y mettez-vous pour les exemples du chapitre, et quel fichier de test n'y entre pas ?

<details>
<summary>Voir la solution</summary>

Vous écrivez, avec la syntaxe de `.gitignore` : `.env`, `.env.*`, `secrets/`, `*.pem`, et le nom de la liste réelle, `attente-reelle.csv`. Cursor respecte déjà `.gitignore`. Ces lignes sont les exclusions en plus.

`attente-fictive.csv` n'y entre pas. Il reste dans le dépôt pour les tests, avec un jeu du genre Camille et 3 places restantes, sans téléphone réel.

</details>

## Exercice 2 : La commande qui lit quand même

L'agent dit qu'il ne peut pas lire `attente-reelle.csv`, puis propose une commande de terminal pour en afficher le contenu. Un outil MCP pourrait faire de même. Que répondez-vous ?

<details>
<summary>Voir la solution</summary>

Vous refusez. `.cursorignore` bloque l'agent, Tab et les mentions `@`. Il ne bloque ni le terminal ni les outils MCP. Une commande peut encore lire le fichier. Ce n'est pas une garantie totale, et vous ne vous en servez pas comme d'un passage.

Le travail continue sur `attente-fictive.csv`. Vous ne collez pas non plus la liste réelle dans le chat pour compenser.

</details>

## Exercice 3 : Quelle mention @

Vous voulez vérifier la phrase des places restantes, samedi 10 h-13 h, 8 places, 45 €. Deux fichiers existent. Lequel mentionnez-vous, et pourquoi l'autre ne se propose pas ?

<details>
<summary>Voir la solution</summary>

Vous mentionnez `attente-fictive.csv`. Il est dans le dépôt pour les tests. `attente-reelle.csv` est dans `.cursorignore` : la mention `@` ne l'attache pas, Tab ne s'en sert pas, l'agent n'y accède pas par le contexte.

S'il se proposait quand même, la ligne d'exclusion serait absente, mal placée, ou le fichier ne serait pas celui que vous croyez. Vous corrigez le motif avant de continuer. La règle métier, elle, reste 8 places, attente 12, 18 h.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Hors du contexte
center: ".cursorignore bloque l'agent, Tab et les mentions @. Le terminal et les outils MCP peuvent encore lire."
points:
  - icon: file
    title: À la racine
    text: "Un .cursorignore, syntaxe de .gitignore. Cursor respecte déjà .gitignore. Ici, les exclusions en plus."
  - icon: filter
    title: Trois blocages
    text: "L'agent, Tab et les mentions @ ne prennent pas le fichier listé."
  - icon: terminal
    title: Pas total
    text: "Le terminal et les outils MCP ne sont pas bloqués. Une commande peut encore lire le fichier."
  - icon: lock
    title: Les motifs
    text: "Exemples : .env, .env.*, secrets/, *.pem, plus le fichier de la liste réelle."
  - icon: database
    title: Deux fichiers
    text: "La liste réelle reste hors contexte. Un jeu fictif reste dans le dépôt pour les tests."
pitfall: "Croire la garantie totale, puis laisser une commande ou un outil MCP lire la liste réelle."
remember: "Vous excluez la liste réelle. Vous testez avec le jeu fictif. Le terminal peut encore lire : vous ne le lui demandez pas."
```
