---
title: "Cinq outils, et quand les laisser coupés"
description: "Dans la session, brancher GitHub, un navigateur, Playwright, une base en lecture ou Figma seulement si l'incrément l'exige."
duration: 50
objectives:
  - "Ajouter dans .mcp.json le serveur qui prouve l'incrément, pas les cinq"
  - "Distinguer un coup d'œil navigateur et un scénario Playwright"
  - "Tenir la base en lecture et Figma pour le jour où un lien existe"
  - "Ranger le choix de l'outil dans un skill, et le contrôler avec /mcp"
---

# La preuve décide du serveur

`.mcp.json` sait déjà accueillir un serveur, celui qui lit le tableau des stages. Les cinq outils que l'on branche le plus souvent ne s'y ajoutent pas ensemble. À l'Atelier Sève, Léa Vernet, Lyon Croix-Rousse, tient 12 stages le samedi de 10 h à 13 h, 8 places, 45 €. L'attente s'arrête à 12 noms. Elle tranche avant 18 h la veille. Le remplissage est autour de 70 %, et 3 personnes manquent chaque mois parce qu'un SMS a été oublié.

Dans la session, vous nommez la preuve avant d'accepter un serveur de plus. `/mcp` montre ensuite ce qui est vraiment connecté. Un serveur présent « au cas où » se retire du fichier partagé.

| Incrément | Preuve | Dans .mcp.json | Ailleurs |
| Liste des 12 stages | 12 lignes, 45 € | Le tableau, puis un navigateur si vous devez voir la page | Pas de Figma, pas de GitHub |
| Refus de la 9e place | Le scénario échoue si la place passe | Playwright | Pas de SMS |
| Attente ordonnée | 12 noms, le 13e refusé | Base en lecture, si les noms y sont déjà | Pas d'écriture |
| Confirmation, 18 h | La phrase est à l'écran | Navigateur | Pas d'envoi |

> [!WARNING]
> Un serveur d'envoi ne se justifie pas par les 3 absents. La règle des 18 h se voit sur la page. Le jeton SMS ne rentre ni dans `.mcp.json`, ni dans le skill.

# GitHub lit un ticket, il n'en invente pas

Le serveur MCP GitHub sert quand le retour de Léa est déjà un ticket : un numéro, une phrase sur les places restantes. Vous le demandez en lecture. La session cite le numéro. Elle ne commente pas et ne ferme pas le ticket tant que vous n'avez pas lu le texte vous-même.

S'il n'y a pas de numéro, la ligne GitHub ne va pas dans `.mcp.json`. La coller « pour plus tard » force chaque clone du dépôt à approuver un outil muet. Un essai personnel, sur votre machine seulement, irait dans `~/.claude.json`, et vous le désactivez pour Sève s'il n'a rien à lire.

# Navigateur une fois, Playwright pour demain

Le terminal ne voit pas la page. Un serveur navigateur, ajouté pour l'incrément, ouvre l'URL locale. Vous lui faites compter 12 stages et lire 45 €. C'est une observation. Elle ne se relance pas toute seule vendredi.

Playwright est le serveur du geste qui doit rester. À l'incrément 2, le scénario est fixe : stage déjà à 8 places, une 9e demande, échec si elle est acceptée. Vous laissez la session proposer la commande, vous lisez la sortie, vous ne la résumez pas à « ça passe ». Le serveur Playwright se commite dans `.mcp.json` le jour de ce scénario, pas le jour de la liste.

```diagram
type: flow
title: "De la preuve au serveur"
steps:
  - title: Preuve
    text: "Ce que Léa peut constater sur cet incrément"
    tone: blue
  - title: Un serveur
    text: "La ligne qui produit cette preuve, pas les cinq"
    tone: teal
  - title: "/mcp"
    text: "Vous vérifiez qu'il est connecté, et que le SMS n'y est pas"
    tone: amber
  - title: Sortie
    text: "Vous lisez le compte ou le test. Le résumé ne suffit pas"
    tone: violet
```

# Base en lecture, Figma avec un lien

Le serveur de base se limite à des lectures : places prises samedi, ordre des noms en attente. Dans la demande, vous l'écrivez. Une proposition d'outil qui insère ou efface se refuse, même si `/mcp` montre le serveur en bon état. L'état lu sert à comparer. Le correctif vit dans le dépôt, et le test dit si l'ordre tient.

Figma se branche quand Léa a envoyé un lien de maquette, par exemple les places restantes affichées en gros. Sans lien, vous n'ajoutez pas la ligne. Un serveur Figma dans `.mcp.json` sans fichier à lire est une approbation vide pour toute l'équipe.

> [!NOTE]
> Le tableau des stages reste le bon serveur tant que les dates n'habitent pas ailleurs. Vous ne le remplacez pas par la base par goût de l'outil.

# Un skill pour choisir, /mcp pour voir

Le skill de vérification existe déjà : `.claude/skills/verifier-reservation/SKILL.md`, avec 8 places, 45 €, attente jusqu'à 12, et l'ordre de ne rien modifier. Vous ajoutez `.claude/skills/choisir-outil/SKILL.md`. La description dit : choisir le serveur qui prouve un incrément de Sève. Le corps reprend la table, et il interdit le SMS, le paiement et l'écriture en base.

Vous l'invoquez avec `/choisir-outil` avant d'éditer `.mcp.json`. Si la réponse cite trois serveurs pour la liste des stages, la description est trop large (« aide sur Sève ») ou le corps ne tranche pas. Vous le resserrez, puis vous relancez. `/mcp`, après coup, doit montrer le serveur retenu, pas la liste que le skill a refusée.

Le skill ne signe pas le diff. Vous relisez `.mcp.json` comme un autre fichier : un secret, un deuxième serveur, un chemin qui n'existe que sur votre machine.

# Ce que la session n'ajoute pas seule

Une session pressée propose souvent d'écrire elle-même les cinq blocs dans `.mcp.json`. Vous refusez l'édition tant que la liste ne tient pas en une ligne justifiée. Le oui sur l'outil MCP, plus tard, reste un oui par appel : lire le tableau, lancer le scénario, ouvrir l'URL. Un appel qui envoie un message ou qui écrit une ligne d'attente ne passe pas parce que le serveur est « déjà là ».

# Exercices

## Exercice 1 : Cinq blocs d'un coup

La session propose d'ajouter dans `.mcp.json` le tableau, GitHub, Figma, Playwright et un envoi de SMS, « puisque 3 personnes manquent chaque mois ». L'incrément en cours est la liste des 12 stages. Que garde le fichier ?

<details>
<summary>Voir la solution</summary>

Le tableau des stages, et un navigateur seulement si vous devez voir les 12 cartes. GitHub sort, faute de ticket. Figma sort, faute de lien. Playwright sort, le formulaire n'existe pas encore. Le SMS sort, et son jeton avec lui.

Vous faites réécrire le fichier, vous lancez `/mcp`, et vous vérifiez que l'envoi n'apparaît pas. Le skill `choisir-outil` doit donner la même liste courte.

</details>

## Exercice 2 : Le scénario de la 9e place

L'incrément 2 est là. La session dit « j'ai regardé, le formulaire refuse » sans commande ni sortie. Quel serveur demandez-vous, et qu'est-ce qui compte comme preuve ?

<details>
<summary>Voir la solution</summary>

Playwright. Le scénario : un stage à 8 places, une 9e demande, échec du test si la place est acceptée. Vous lisez la sortie dans la session. Une phrase de l'agent n'est pas la preuve.

Le navigateur peut montrer l'écran une fois en plus. Il ne remplace pas le scénario. Le SMS reste coupé. `/choisir-outil` doit nommer Playwright avant l'édition de `.mcp.json`.

</details>

## Exercice 3 : Une écriture déguisée en lecture

`/mcp` montre le serveur de base, connecté. L'appel proposé « remet les 12 noms dans l'ordre d'arrivée » par une mise à jour. Le test d'ordre n'a pas tourné. Que répondez-vous ?

<details>
<summary>Voir la solution</summary>

Vous refusez l'appel. La base est en lecture : elle montre l'ordre actuel, elle ne le répare pas. Le correctif est dans le code, le test refuse le 13e nom et vérifie l'ordre des 12. Un serveur connecté n'est pas une permission d'écrire.

Vous relisez le skill : il doit interdire l'écriture. S'il ne le dit pas, vous l'ajoutez avant de continuer.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Cinq outils dans la session"
center: "Un serveur dans .mcp.json, celui de la preuve. /mcp montre qu'il est seul."
points:
  - icon: git
    title: GitHub
    text: "Lit un ticket numéroté. Sans numéro, il reste hors du fichier partagé."
  - icon: eye
    title: Navigateur
    text: "Ouvre l'URL et compte 12 stages. Le terminal, lui, ne voit pas la page."
  - icon: test
    title: Playwright
    text: "Rejoue la 9e place. Vous lisez la sortie, pas le résumé."
  - icon: database
    title: Base
    text: "Lecture des places et de l'ordre. Une mise à jour se refuse."
  - icon: layers
    title: Figma
    text: "Un lien de Léa, ou pas de ligne dans .mcp.json."
pitfall: "Laisser la session écrire les cinq serveurs, dont le SMS, dans le fichier de l'équipe."
remember: "/choisir-outil tranche avant l'édition. /mcp vérifie après. Le skill de réservation garde 8, 45 € et 12."
```
