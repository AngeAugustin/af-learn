---
title: "Branches, commits et demandes de revue"
description: "Ouvrir une branche par incrément d'App Sève, écrire un message qui dit le but, refuser git add . s'il embarque .env, et résumer ce que Léa peut vérifier."
duration: 50
objectives:
  - "Isoler chaque incrément de Sève sur sa propre branche"
  - "Écrire un message de commit qui énonce le but"
  - "Accepter un git add ciblé et refuser git add . si .env est dedans"
  - "Rédiger une demande de revue que Léa peut vérifier sans deviner"
---

# Une branche par incrément

Léa Vernet avance App Sève dans le terminal, avec Claude Code. Atelier Sève est à Lyon Croix-Rousse. Quatre incréments, quatre branches. On part d'une base à jour, on y pose un seul but, on y revient quand la revue est faite.

```bash
git switch main
git pull
git switch -c seve/refus-9e-place
```

Les noms suivent les incréments.

- `seve/liste` : les 12 stages du mois, à 45 €, dont le samedi 10 h-13 h.
- `seve/refus-9e-place` : 8 places prises, la 9e personne est refusée.
- `seve/attente` : 12 personnes au plus sur la liste d'attente.
- `seve/confirmation-18h` : la décision se prend avant 18 h la veille.

Une branche `seve-wip` qui mélange la liste, le refus, l'attente et l'heure de 18 h ne se relit pas. Le remplissage d'environ 70 % et les 3 absents liés à un SMS oublié restent le contexte du mois. Ils ne deviennent pas une cinquième branche fourre-tout.

# Un message qui dit le but

Le message dit pourquoi le commit existe. La première ligne suffit quand le but est net.

```text
Afficher les 12 stages à 45 €
Refuser la 9e place quand 8 sont prises
Limiter l'attente à 12 personnes
Tenir la décision avant 18 h la veille
```

« modifs », « wip » ou « fix » ne disent pas ce que Léa pourra vérifier le lendemain. Le message ne répète pas tout le diff. Il nomme la règle. S'il faut une seconde ligne, elle donne le cas : samedi, Croix-Rousse, 8 inscrits.

Claude Code peut proposer le message. Léa le lit avant de le valider. Un message qui annonce le refus alors que la branche contient aussi un changement de prix à la place de 45 € est à réécrire, ou la branche est à couper.

# git add ciblé

L'agent peut préparer l'ajout. Léa exige les noms.

```bash
git status
git add reservation.js verifier.js
```

`git status` montre ce qui est modifié, ce qui est déjà indexé, et ce qui est encore ignoré ou non. `.env` y apparaît parfois comme fichier non suivi. `reservation.js` porte la règle. `verifier.js` porte le test nommé. Ces deux-là correspondent à l'incrément.

```bash
git add .
```

Cette forme embarque tout le répertoire de travail. Si `.env` est dans la liste, Léa refuse. Le jeton du SMS, ou n'importe quelle clé, n'entre pas dans le commit. Elle redemande un ajout nommé. Elle relit `git diff --cached` pour voir exactement ce qui partira.

Un fichier déjà suivi et modifié entre aussi dans `git add .`. Le refus ne vise pas seulement `.env`. Il vise tout ce que la demande du moment ne réclame pas. L'ajout ciblé laisse `notes-prix.txt` dehors.

# Refuser quand .env est du voyage

Léa compare la proposition de la session et la sortie de `git status`.

```text
Modifiés : reservation.js, verifier.js
Non suivi : .env
```

Si la session écrit `git add .`, la réponse est non. La commande de remplacement cite les deux fichiers de l'incrément. Puis `git diff --cached` doit montrer `inscrits >= 8` et le test « la 9e place est refusée », sans ligne de secret.

Si `.env` était déjà suivi, le retirer de cet ajout ne suffit pas à l'effacer de l'historique ancien. Léa ne l'ajoute pas de nouveau. Elle ne colle pas son contenu dans le message. Le chapitre des secrets du parcours reprendra l'historique. Ici, la règle du geste est simple : cet incrément ne l'embarque pas.

```diagram
type: sequence
title: "De la branche à la demande"
actors: ["Léa", "Claude Code", "Revue"]
messages:
  - from: 0
    to: 1
    text: "Ouvre seve/refus-9e-place"
  - from: 1
    to: 0
    text: "Propose git add reservation.js"
  - from: 0
    to: 1
    text: "Refuse git add . tant que .env est là"
  - from: 0
    to: 2
    text: "Résume ce que Léa peut vérifier"
```

# La demande que Léa peut vérifier

La demande de revue est le texte qui accompagne la branche. Elle résume ce que Léa peut vérifier, sans renvoyer à la mémoire de la session.

```text
Incrément : refuser la 9e place
Branche : seve/refus-9e-place

Léa peut vérifier :
- samedi 10 h-13 h, Lyon Croix-Rousse, 45 €, 8 places
- avec 8 inscrits, la 9e demande est refusée
- le test lu s'appelle « la 9e place est refusée »
- le diff ne contient pas .env

Hors de cet incrément : l'attente, la confirmation de 18 h
```

Une personne qui n'a pas vu le terminal peut cocher ces lignes. « Comme convenu avec l'agent » ne se coche pas. Le hors-sujet évite qu'on cherche l'attente de 12 personnes dans une branche qui ne la traite pas.

La demande de la liste parle des 12 stages à 45 €. Celle de l'attente parle du plafond de 12. Celle de la confirmation parle de 18 h la veille. Chacune tient sur une branche.

# L'ordre des quatre incréments

On n'empile pas les quatre buts sur `seve/liste` pour « gagner une revue ». La liste se relit, se fusionne, puis le refus part d'une base qui contient déjà les 12 stages. L'attente part ensuite. La confirmation de 18 h en dernier, quand les places et l'attente existent.

Si la session propose de committer sur `main` directement, Léa refuse et crée la branche de l'incrément. Si le message dit « Attente » sur la branche du refus, elle aligne le message sur le but réel, ou elle retire les lignes d'attente du diff.

Le geste complet, une fois le diff relu : branche, `git status`, ajout nommé, `git diff --cached`, message qui dit le but, demande qui dit ce que Léa vérifie. `git add .` n'entre dans ce geste que si `git status` prouve qu'aucun `.env` et aucun fichier étranger ne partent. Dans le doute, on nomme les fichiers.

# Exercices

## Exercice 1 : Quatre buts, une branche

La session a tout commité sur `seve-wip` : la liste à 45 €, le refus de la 9e place, l'attente de 12, et l'heure de 18 h. Le message est « avancement Sève ». Que demande Léa ?

<details>
<summary>Voir la solution</summary>

Une branche par incrément, et un message par but. `seve-wip` et « avancement Sève » mélangent quatre vérifications. Léa reprend une base à jour et isole d'abord `seve/liste`, avec un message du type « Afficher les 12 stages à 45 € ».

Les trois autres buts auront `seve/refus-9e-place`, `seve/attente` et `seve/confirmation-18h`. La demande de chaque branche dira ce que Léa peut vérifier, et ce qui attend l'incrément suivant.

</details>

## Exercice 2 : .env dans le statut

`git status` montre `reservation.js`, `verifier.js` et un `.env` non suivi. Claude Code propose `git add .` puis le message « Refuser la 9e place quand 8 sont prises ». Quelle commande Léa accepte-t-elle ?

<details>
<summary>Voir la solution</summary>

Elle refuse `git add .`, qui embarquerait `.env`. Elle accepte un ajout ciblé : `git add reservation.js verifier.js`. Le message, lui, dit bien le but, à condition que le diff indexé porte cette règle.

Elle relit `git diff --cached`. Le jeton ne doit pas y figurer. La demande de revue rappellera : 8 places, 9e demande refusée, pas de `.env`.

</details>

## Exercice 3 : Une demande que l'on peut cocher

Rédigez les vérifications de la branche `seve/confirmation-18h`. Le diff ne traite que l'heure limite. L'attente de 12 personnes est déjà sur la branche principale.

<details>
<summary>Voir la solution</summary>

La demande dit le but : tenir la décision avant 18 h la veille. Léa peut vérifier que, après 18 h la veille du samedi, la confirmation est refusée, sur le stage de Croix-Rousse, 10 h-13 h, 45 €, 8 places.

Elle peut vérifier le nom du test lu, et l'absence de secret. Elle indique que l'attente (12 personnes) n'est pas dans ce diff. « Comme convenu » ne remplace pas ces lignes. Les 3 absents du SMS oublié expliquent l'enjeu. Ils ne deviennent pas un jeton dans la demande.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Branches, commits et revues"
center: "Une branche par incrément, un message qui dit le but, une demande vérifiable."
points:
  - icon: git
    title: "Quatre branches"
    text: "Liste, refus de la 9e place, attente de 12, confirmation avant 18 h."
  - icon: chat
    title: "Message utile"
    text: "La première ligne énonce le but. « wip » ne dit pas ce que Léa vérifie."
  - icon: list
    title: "Ajout nommé"
    text: "git add reservation.js verifier.js. git status précède l'ajout."
  - icon: lock
    title: "Pas de .env"
    text: "On refuse git add . quand .env serait embarqué dans le commit."
  - icon: check
    title: "Demande cochable"
    text: "8 places, 45 €, samedi 10 h-13 h, test lu, hors-sujet annoncé."
pitfall: "Tout poser sur seve-wip avec git add . alors que .env est non suivi."
remember: "Branche, ajout ciblé, message clair. La demande dit ce que Léa peut vérifier."
```
