---
title: "Skills et commandes réutilisables"
description: "Ranger un geste répétable dans un skill SKILL.md, l'invoquer avec /, et distinguer une commande d'une règle."
duration: 50
objectives:
  - "Placer un skill dans le dépôt ou dans le dossier utilisateur, avec un SKILL.md"
  - "Laisser l'agent charger un skill pertinent, ou l'invoquer avec /"
  - "Réserver les commandes aux prompts que vous ne voulez pas retaper"
  - "Écrire un skill qui vérifie 8 places, 45 € et une attente plafonnée à 12"
---

# Une règle dit non, un skill dit comment vérifier

Une règle tient en une phrase : une réservation ne dépasse jamais 8 places. Un skill décrit un geste en plusieurs étapes, que vous ne voulez pas réexpliquer. L'agent le charge quand il est pertinent. Vous pouvez aussi le nommer vous-même.

Atelier Sève, Lyon Croix-Rousse. Léa Vernet, céramiste, tient 12 stages par mois, le samedi de 10 h à 13 h, 8 places, 45 €. La liste d'attente est plafonnée à 12. Léa confirme ou refuse avant 18 h la veille. Le remplissage actuel est de 70 %. 3 absents en moyenne par mois, parce que la confirmation est un SMS oublié. L'application s'appelle Sève.

Le skill utile ici s'appelle « vérifier une réservation ». Il ne crée pas un cinquième incrément. Il rappelle, au moment de relire un diff, les chiffres déjà décidés : 8 places, 45 €, attente 12. La page, le formulaire, l'attente et la confirmation restent les quatre incréments. Le skill est la checklist, pas le produit.

> [!NOTE]
> Si la consigne tient en une ligne et doit être là à chaque fois, c'est une règle. Si c'est une procédure que vous relancez, c'est un skill ou une commande.

# Où vit un skill

Deux portées, deux paires de dossiers.

| Portée | Dossiers |
| --- | --- |
| Projet, versionné avec Sève | `.cursor/skills` et `.agents/skills` |
| Utilisateur, sur votre machine | `~/.cursor/skills` et `~/.agents/skills` |

Le skill de vérification des réservations va dans le **projet**. Toute personne qui ouvre le dépôt de Sève doit pouvoir le lancer. Un skill dans le dossier utilisateur reste sur votre poste : pratique pour une manie personnelle, inutile pour Léa si un collègue clone le projet.

Vous ne le mettez pas dans le dossier réservé aux skills internes de Cursor. Vous créez le vôtre dans l'un des quatre chemins ci-dessus. Au démarrage, Cursor découvre ces dossiers et présente les skills à l'agent.

Un skill de projet se commite. Il voyage avec les `.mdc`. Un skill utilisateur ne remplace pas une règle des 8 places que le dépôt doit porter même sans vous.

# Un dossier, un fichier SKILL.md

Un skill est un **dossier** dont le nom est celui du skill, et ce dossier contient `SKILL.md`. Pas un fichier isolé au milieu de `.cursor`. Pas un roman dans `AGENTS.md`.

```text
.cursor/skills/verifier-une-reservation/SKILL.md
```

L'en-tête minimal nomme le skill et dit quand il sert. Le nom est en minuscules, avec des traits d'union, et il correspond au dossier. La description dit le quoi et le quand : vérifier une réservation Sève (8 places, 45 €, attente 12) quand on relit une inscription ou un diff de réservation.

Le corps est la procédure, courte.

1. Lire le stage concerné : un des 12 du mois, samedi de 10 h à 13 h.
2. Compter les places déjà prises. Refuser si la demande ferait une 9e place.
3. Vérifier que le prix affiché est 45 €.
4. Si les 8 places sont prises, vérifier que la liste d'attente ne dépasse pas 12 et qu'elle garde l'ordre.
5. Ne pas confirmer à la place de Léa. La confirmation visible, avant 18 h la veille, est un autre incrément. Signaler si le diff la bricole en SMS.

Vous pouvez ajouter un dossier `references` ou `scripts` plus tard. Pour Sève, `SKILL.md` seul suffit. Un script qui « envoie le SMS » reproduirait la cause des 3 absents. Vous n'en mettez pas.

# L'agent le charge s'il est pertinent

Cursor montre à l'agent la liste des skills et leur description. Si votre message parle de vérifier une réservation, l'agent peut ouvrir ce skill sans que vous le nommiez. La description fait ce travail. « Aide au projet » ne le fait pas. « Vérifier une réservation Sève : 8 places, 45 €, liste d'attente jusqu'à 12 » le fait.

Vous pouvez empêcher ce chargement automatique et n'autoriser que l'appel explicite. Pour une checklist de relecture, le chargement quand c'est pertinent est le bon réglage : vous oubliez souvent de la demander, et c'est justement là qu'une 9e place passe.

Le skill n'est pas une mémoire magique. C'est un fichier. Une nouvelle conversation ne « se souvient » pas de l'avoir utilisé. Elle le redécouvre parce que le fichier est dans le dépôt et que la description correspond. Les 70 % de remplissage n'ont pas à figurer dans la description : ils n'aident pas l'agent à décider s'il doit charger le skill.

# L'invoquer avec /

Dans le chat, vous tapez **/** puis le nom. `/verifier-une-reservation` attache le skill à ce message. L'agent lit `SKILL.md` et suit les étapes. Vous l'utilisez après un diff du formulaire, ou avant de montrer la page à Léa.

Le même menu **/** sert aux commandes. La différence n'est pas la touche. C'est ce qui est rangé derrière.

- Le **skill** est un dossier de travail : étapes, et au besoin des fichiers à côté.
- La **commande** est un prompt réutilisable : un texte que vous ne voulez pas retaper, réinjecté quand vous tapez `/`.

Une commande `/cadre-seve` peut coller dans le chat : « 12 stages par mois, samedi 10 h-13 h, 8 places, 45 €, attente plafonnée à 12, Léa tranche avant 18 h. Incrément en cours : … ». Pratique en début de fil. Elle ne vérifie rien toute seule. Le skill, lui, dit comment contrôler une réservation.

Vous ne transformez pas la règle des 8 places en commande. La règle doit entrer même quand vous oubliez `/`. La commande n'entre que si vous la tapez. Le skill pertinent peut entrer tout seul, grâce à sa description.

```diagram
type: compare
title: Règle, commande, skill
columns:
  - title: Règle
    tone: violet
    items:
      - "Une phrase, souvent toujours là"
      - "Jamais plus de 8 places"
      - "Pas une procédure"
  - title: Commande
    tone: amber
    items:
      - "Un prompt rappelé avec /"
      - "Colle le cadre, ne vérifie pas"
      - "Vous devez la nommer"
  - title: Skill
    tone: teal
    items:
      - "Dossier et SKILL.md"
      - "Chargé si pertinent, ou via /"
      - "Vérifier 8, 45 €, attente 12"
```

# Le skill de Sève, rien de plus

Le skill « vérifier une réservation » rappelle trois chiffres et s'arrête : **8 places, 45 €, attente 12**. Il dit aussi de ne pas confirmer à la place de Léa. Il ne décide pas de l'heure à sa place : la règle « avant 18 h la veille » se constate sur l'écran de confirmation, à l'incrément 4, pas dans une checklist d'inscription.

Vous le rangez dans `.cursor/skills` du dépôt. Vous le testez une fois : ouvrez un fil, tapez `/`, lancez-le sur un exemple où 8 places sont prises et où une 9e demande arrive. La réponse doit refuser. Si elle propose d'élargir à 10 « vu le remplissage de 70 % », la description ou les étapes sont trop molles. Vous les resserrez. Vous ne rajoutez pas un second skill « être strict ».

Les quatre incréments restent des demandes dans le chat, mode Agent ou Plan. Le skill ne les remplace pas. Il évite, à chaque relecture, d'oublier le chiffre que Tab ou un diff trop large vient de changer.

# Exercices

## Exercice 1 : Où le ranger

Vous écrivez le skill « vérifier une réservation » pour que toute l'équipe Sève l'ait après un clone. Quel chemin, et que contient le dossier au minimum ?

<details>
<summary>Voir la solution</summary>

Un dossier de projet : `.cursor/skills/verifier-une-reservation/` ou `.agents/skills/verifier-une-reservation/`. Dedans, `SKILL.md`, avec un nom qui correspond au dossier et une description qui cite 8 places, 45 € et l'attente jusqu'à 12.

Pas dans le dossier utilisateur (`~/.cursor/skills` ou `~/.agents/skills`) : vos collègues ne l'auraient pas. Pas un fichier isolé hors d'un dossier. Vous le commitez avec le dépôt.

</details>

## Exercice 2 : Skill ou commande

Vous en avez assez de retaper, en tête de chaque fil : « 12 stages, samedi 10 h-13 h, 8 places, 45 €, attente 12, Léa avant 18 h, incrément en cours indiqué ». Vous voulez aussi une procédure de relecture qui refuse la 9e place. Quoi ranger où ?

<details>
<summary>Voir la solution</summary>

Le texte de cadrage est une commande : un prompt réutilisable, invoqué avec `/`. Il colle le rappel, il ne vérifie pas une inscription.

La relecture est le skill « vérifier une réservation » : un dossier avec `SKILL.md`, étapes pour 8 places, 45 €, attente plafonnée à 12, sans confirmer à la place de Léa. L'agent peut le charger s'il est pertinent. Vous pouvez aussi le lancer avec `/`.

La phrase « jamais plus de 8 places » reste une règle. Ni la commande ni le skill ne la remplacent pour les conversations où vous oubliez `/`.

</details>

## Exercice 3 : La description molle

Le skill existe. Sur un stage déjà à 8 places, l'agent accepte une 9e « parce que le remplissage n'est que de 70 % ». La description dit seulement « aide sur Sève ». Que corrigez-vous ?

<details>
<summary>Voir la solution</summary>

Vous réécrivez la description : vérifier une réservation, 8 places, 45 €, liste d'attente jusqu'à 12. Vous réécrivez l'étape qui refuse la 9e place, sans exception liée aux 70 % ni aux 3 absents.

Les 70 % sont un fait d'atelier, pas une autorisation d'élargir. Vous relancez `/verifier-une-reservation` sur le même exemple. Tant que la 9e place passe, le skill n'est pas fini. Vous ne créez pas un incrément nouveau pour « gérer le remplissage ».

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Le geste rangé
center: "Un skill est un dossier avec SKILL.md. On le lance avec /, ou l'agent le prend s'il est pertinent."
points:
  - icon: puzzle
    title: Quatre dossiers
    text: ".cursor/skills et .agents/skills dans le projet. ~/.cursor/skills et ~/.agents/skills pour vous."
  - icon: file
    title: SKILL.md
    text: "Un dossier par skill. Nom en minuscules. La description dit 8 places, 45 €, attente 12."
  - icon: sparkles
    title: Pertinent
    text: "L'agent charge le skill si la description correspond. Une description molle ne se déclenche pas."
  - icon: terminal
    title: La touche /
    text: "Invoque un skill ou une commande. La commande colle un prompt. Le skill suit une procédure."
  - icon: check
    title: Vérifier
    text: "8 places, 45 €, attente jusqu'à 12. Ne pas confirmer à la place de Léa."
pitfall: "Ranger la checklist seulement sur votre machine, ou remplacer la règle des 8 places par une commande que vous oubliez."
remember: "Skill de projet, description précise, /verifier-une-reservation. La règle reste pour le cas où personne ne tape /."
```
