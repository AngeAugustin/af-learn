---
title: Git depuis l'éditeur
description: "Voir la branche et le diff, committer depuis le panneau Source Control, garder .env hors du commit, et valider vous-même ce que l'agent a préparé."
duration: 50
objectives:
  - "Lire la branche et le diff dans le panneau Source Control"
  - "Tenir une branche par incrément d'App Sève"
  - "Laisser .env et les secrets hors du commit"
  - "Valider un commit préparé par l'agent avant qu'il parte"
---

# La branche est affichée

Dans Cursor, la branche se voit sans quitter l'éditeur. Son nom est dans la barre d'état, et le panneau Source Control reprend les fichiers de cette branche. Vous le lisez avant d'écrire le moindre message de commit. App Sève se construit par incréments. Le nom de la branche dit lequel est en cours.

Léa Vernet, à l'Atelier Sève de Lyon Croix-Rousse, ne lit pas Git. Elle lit l'écran. Pour vous, la branche est le moyen de ne pas mélanger ce qu'elle vérifiera. Vous créez la branche dans l'éditeur au début de l'incrément, puis vous y restez jusqu'au commit de ce seul morceau.

> [!NOTE]
> Si le nom de branche ne correspond pas au travail ouvert, vous changez de branche avant d'indexer. Le panneau montre alors un autre diff.

# Une branche, un incrément

Quatre incréments, quatre branches. La première porte la liste : 12 stages dans le mois, places restantes, 45 €. La deuxième porte le refus d'une 9e place, sur un samedi de 8 places, 10 h-13 h. La troisième porte l'attente ordonnée, au plus 12 personnes. La quatrième porte la confirmation et la règle des 18 h la veille. Cette dernière existe parce qu'environ 3 personnes par mois ne viennent pas : le SMS a été oublié. Elle n'entre pas dans le commit de la liste.

Vous nommez les branches d'après l'incrément, par exemple `increment-liste`, `increment-refus-9e`, `increment-attente`, `increment-18h`. Un seul commit peut tenir sur la branche, ou quelques commits du même incrément. Le mélange de la liste et de la règle des 18 h dans le même diff rend la revue impossible.

```diagram
type: flow
title: "Une branche, puis le panneau"
steps:
  - title: "Nommer"
    text: "La branche porte un incrément, pas tout App Sève."
    tone: violet
  - title: "Voir"
    text: "Le panneau Source Control montre cette branche et son diff."
    tone: blue
  - title: "Écarter"
    text: "Vous sortez .env et les fichiers d'un autre incrément."
    tone: amber
  - title: "Valider"
    text: "Vous lisez le message et vous committez vous-même."
    tone: teal
```

# Le diff dans le panneau

Le chat peut résumer les fichiers. Le panneau les montre. Vous cliquez chaque fichier modifié et vous lisez le diff dans l'éditeur : lignes ajoutées, lignes retirées. Pour la liste, vous vous attendez à voir les 12 stages et les places restantes. Un bloc qui décide déjà de l'heure limite de 18 h n'a rien à faire sur cette branche.

Vous distinguez ce qui est indexé, prêt à partir, et ce qui est seulement modifié dans le dossier. L'agent a pu tout indexer d'un coup. Le panneau sert à revenir en arrière sur un fichier, sans toucher au texte. Vous ne committez pas « tout le dossier » parce que la liste des fichiers est longue.

> [!IMPORTANT]
> Le résumé du chat ne remplace pas le diff du panneau. Vous ouvrez les fichiers avant de croire le résumé.

# Committer depuis l'éditeur

Le message s'écrit dans le panneau Source Control, au-dessus du bouton de commit. Pour l'incrément de la liste, vous écrivez : afficher les 12 stages et les places restantes. Vous relisez la branche, la liste des fichiers indexés, le message. Puis vous committez depuis ce panneau.

« update » laisse un historique illisible. Dans une semaine, vous ne saurez plus si ce commit montrait les stages, le refus de la 9e place, ou l'attente. Le message dit le but, comme la revue l'a fixé. Le bouton de l'éditeur suffit. Vous n'avez pas besoin d'une cérémonie à côté de Cursor pour ce geste.

| Dans le panneau | Lecture attendue sur la branche liste |
|---|---|
| Nom de la branche | L'incrément liste, rien d'autre |
| Fichiers indexés | La liste et les places restantes |
| Fichier à écarter | `.env`, ou un fichier de l'attente |
| Message | Afficher les 12 stages et les places restantes |

# Le fichier qui ne part pas

`.env` ne s'indexe pas. Il contient ce qui ne se montre pas à Croix-Rousse : un jeton, une clé, un mot de passe. Le prix de 45 € n'est pas un secret. Le jeton qui servirait plus tard à un rappel, si, et il n'accompagne pas les 12 stages. S'il apparaît dans la liste du panneau, vous le retirez de l'index avant le commit.

Vous vérifiez aussi les exemples et les notes collées par l'agent. Un secret recopié dans un fichier de code voyage aussi sûrement que `.env`. Le remplissage de 70 % et les 8 places peuvent figurer dans le produit. Une clé n'a pas de place dans le diff, même sur une branche que « personne ne pousse aujourd'hui ». La branche se pousse un jour.

> [!WARNING]
> Retirer `.env` au commit suivant ne l'efface pas de celui-ci. Vous l'écartez avant de committer, pas après.

# L'agent prépare, vous validez

L'agent peut proposer le message, indexer les fichiers de l'incrément, et préparer la commande. Il ne valide pas à votre place. Vous ouvrez le panneau, vous lisez la branche, le diff et le message, vous écartez `.env`, puis vous acceptez le commit. Si le message dit « update », vous le réécrivez avant d'accepter.

Préparer et committer sont deux gestes. Quand vous dites oui, vous dites oui à une branche, à une liste de fichiers et à une phrase. Un oui global, sans regarder le panneau, indexe souvent le secret et l'incrément voisin. Vous vérifiez le contenu que Léa pourra constater : 12 stages, places restantes sur 8, 45 €, samedi 10 h-13 h.

> [!TIP]
> Demandez à l'agent de préparer, puis arrêtez-vous sur le panneau. Le commit part quand la branche, le diff et le message racontent le même incrément.

# Dire le panneau avant le clic

Avant le bouton, vous pouvez énoncer la scène en lisant l'écran. Branche `increment-liste`. Fichiers indexés : la liste des stages et le calcul des places restantes. Fichier écarté : `.env`. Message : afficher les 12 stages et les places restantes. Si une de ces mentions ne correspond pas au panneau, vous ne cliquez pas.

La même lecture sert les autres incréments, avec un autre nom et un autre but. Pour le refus : la branche du refus, un diff qui empêche la 9e place sur le samedi de 8 places, un message qui le dit. L'attente ordonnée, puis la confirmation et la règle des 18 h, attendent leur branche. Léa vérifiera l'écran à Croix-Rousse. Le panneau vous dit si cet écran est le seul contenu du commit.

> [!NOTE]
> Une phrase dite de mémoire n'est pas une lecture. Vous la prononcez en regardant la branche, les fichiers et le message affichés dans l'éditeur.

# Exercices

## Exercice 1 : Deux incréments dans le même diff

Vous êtes sur `increment-liste`. Le diff affiche les 12 stages et, plus bas, la règle « décision avant 18 h la veille ». L'agent propose un seul commit. Que gardez-vous sur cette branche ?

<details>
<summary>Voir la solution</summary>

Vous ne gardez sur cette branche que la liste : 12 stages et places restantes. La règle des 18 h appartient à `increment-18h`, avec la confirmation. Vous la retirez de l'index, ou vous ne l'incluez pas dans ce commit.

Le message, s'il part, dira : afficher les 12 stages et les places restantes. Il ne promet pas la règle de la veille.

</details>

## Exercice 2 : Ce que l'agent a indexé

L'agent a préparé un commit. Le panneau montre `.env`, le fichier de la liste, et le message « update ». Que validez-vous, et que retirez-vous ?

<details>
<summary>Voir la solution</summary>

Vous retirez `.env` de l'index. Vous réécrivez le message avec le but, par exemple afficher les 12 stages et les places restantes, si c'est bien l'incrément de la branche. Vous relisez le diff du fichier de la liste, puis vous committez depuis le panneau.

Vous ne validez pas le paquet tel qu'il a été préparé. Préparer n'est pas accepter.

</details>

## Exercice 3 : Nommer la branche du refus

Le prochain incrément refuse une 9e place sur le samedi de 8 places. Quel nom de branche cherchez-vous dans l'éditeur, et que doit montrer le panneau avant le commit ?

<details>
<summary>Voir la solution</summary>

La branche se nomme d'après cet incrément, par exemple `increment-refus-9e`. Le panneau montre cette branche, le diff du refus, et aucun `.env`. Le message dit le but : refuser la 9e place. Il ne dit pas « update ».

La liste des 12 stages et la règle des 18 h ne sont pas dans ce diff. Vous committez après cette lecture, depuis Source Control.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Git dans le panneau
center: "Une branche par incrément. Le diff se lit dans Source Control. Vous validez le commit que l'agent a préparé."
points:
  - icon: git
    title: La branche
    text: "Liste, refus de la 9e, attente, puis confirmation et règle des 18 h."
  - icon: eye
    title: Le diff
    text: "Vous ouvrez chaque fichier dans le panneau. Le résumé du chat ne suffit pas."
  - icon: lock
    title: Hors du commit
    text: "Le fichier .env et les jetons ne s'indexent pas avec les 12 stages."
  - icon: check
    title: Vous validez
    text: "L'agent prépare fichiers et message. Le commit part après votre lecture."
  - icon: file
    title: Le but écrit
    text: "Afficher les 12 stages et les places restantes, plutôt que le mot update."
pitfall: "Accepter un commit préparé qui mélange deux incréments, indexe .env, et dit update."
remember: "Branche, diff, secret écarté, message de but. Le panneau est le lieu du oui."
```
