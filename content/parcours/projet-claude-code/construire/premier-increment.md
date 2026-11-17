---
title: "Lancer le premier incrément"
description: "Après le plan accepté, faire la page des 12 stages, lire chaque permission, lancer l'appli, et rester sur la liste tant qu'elle est fausse."
duration: 50
objectives:
  - "Limiter la session d'après le oui à la page des 12 stages"
  - "Lire chaque demande de permission avant de l'accepter"
  - "Lancer l'appli et compter les stages, l'horaire, le lieu et le prix"
  - "Refuser de passer au formulaire tant que cette liste est fausse"
---

# Le oui n'ouvre que la liste

Le plan accepté dit une chose : la page des 12 stages du mois. Samedi 10 h-13 h, Lyon Croix-Rousse, 8 places, 45 € affichés, aucun paiement. Le formulaire d'inscription n'est pas dans ce oui. Le refus de la 9e place non plus. Il aura sa session quand cette page sera vraie.

Vous le rappelez dans la première demande après l'acceptation, sans réciter tout le brief.

```text
Le plan est accepté. Incrément 1 seulement : la page des 12 stages.
Selon docs/brief.md. Pas de formulaire dans cette session.
```

Le chemin suffit. Les chiffres sont dans la page. Votre phrase borne le travail.

# Lire chaque permission

Chaque édition et chaque commande peuvent demander un accord. La demande montre l'outil, puis le chemin du fichier ou la commande entière. Vous lisez cette ligne avant le oui, jusqu'au bout. Un oui sur une demande non lue accepte le geste d'à côté : une dépendance, un fichier qui n'est pas la liste, un envoi.

Vous acceptez une édition qui construit la page des stages, si le chemin correspond à ce que le plan a nommé. Vous refusez une commande qui ajoute un paiement, qui contacte un service extérieur, ou qui « prépare déjà le formulaire ». Le brief a classé l'encaissement hors périmètre. La permission ne le fait pas rentrer par la fenêtre.

> [!WARNING]
> La phrase autour de la permission est souvent rassurante. Le texte qui compte est le chemin et la commande. Vous les lisez en entier, y compris la fin de la ligne.

# Lancer, puis compter

Quand la page est en place, vous lancez l'appli. La commande est celle du dépôt, ou celle que la session vient de proposer et que vous avez lue. Vous regardez la page vous-même. Vous ne demandez pas « est-ce que c'est bon ? » à la place du comptage.

Vous comptez, dans cet ordre.

1. **12 stages**, pas 11 ni 13.
2. **Samedi, 10 h-13 h**, sur chacun. Un dimanche ou un 14 h est une liste fausse.
3. **Lyon Croix-Rousse**, pas un autre lieu.
4. **8 places** affichées, et **45 €** affichés.
5. **Aucun paiement** : pas de bouton qui encaisse, pas de carte.

« On dirait un calendrier » n'est pas la preuve. Le nombre, l'horaire, le lieu et le prix le sont. Vous les notez tels que la page les montre, pas tels que le plan les promettait.

```diagram
type: sequence
title: "Du oui du plan à la page comptée"
actors: ["Vous", "Claude Code", "App Sève"]
messages:
  - from: 0
    to: 1
    text: "Plan accepté. Incrément 1 seulement, la liste."
  - from: 1
    to: 0
    text: "Permission : chemin du fichier ou commande à lire."
  - from: 0
    to: 1
    text: "Oui si c'est la liste. Non si c'est un paiement ou un formulaire."
  - from: 1
    to: 2
    text: "Lancer l'appli, une fois la commande lue."
  - from: 2
    to: 0
    text: "La page : 12 stages, ou une liste fausse."
  - from: 0
    to: 1
    text: "Si c'est faux, on reste. Le formulaire n'est pas ouvert."
```

# Tant que la liste est fausse

11 stages, un mauvais horaire, un autre quartier, 10 places, ou un bouton de paiement : vous ne passez pas au formulaire. Vous ne demandez pas le refus de la 9e inscription. Cette règle se vérifierait sur une liste qui n'est pas celle de Léa, et le résultat ne voudrait rien dire.

Vous collez ce que vous avez vu, en une demande, avec le seul objectif de rendre la liste vraie.

```text
La page montre 11 stages, dont un dimanche à 14 h.
Il en faut 12, samedi 10 h-13 h, Lyon Croix-Rousse, 8 places, 45 € affichés, sans paiement.
On ne touche pas au formulaire.
```

Vous relancez, vous recompez. La session reste sur l'incrément 1 jusqu'à ce que les cinq points soient vrais en même temps.

# Le formulaire attend

L'incrément 2 est le refus de la 9e place. Il a besoin d'une liste vraie : 8 places sur le bon stage, pas sur un créneau inventé. Ouvrir le formulaire « pour gagner du temps » pendant que le dimanche est encore affiché, c'est construire le refus au mauvais endroit.

Vous le dites explicitement quand on vous propose d'enchaîner. La liste d'abord. Le formulaire à la session suivante, avec son plan et sa preuve. Les 3 absents du mois, l'attente de 12 et les 18 h ne sont pas oubliés : ils sont écrits dans le brief, et ils ne sont pas le travail de cet après-midi.

# Noter ce que vous avez vu

Quand les cinq points tiennent, vous écrivez une ligne que vous pourrez relire demain. Elle décrit la page, pas l'intention.

```text
Incrément 1 tenu : 12 stages, samedi 10 h-13 h, Lyon Croix-Rousse, 8 places, 45 € affichés, pas de paiement.
```

Cette ligne est la preuve. « C'est fait » ne l'est pas. Vous la mettrez, au prochain chapitre de reprise, parmi les trois lignes du matin. Pour l'instant, elle ferme la session. Vous ne la transformez pas en autorisation d'ouvrir le formulaire dans la foulée.

> [!TIP]
> Comptez les stages à la main sur la page lancée. Un total annoncé par la session, sans la page sous les yeux, ne remplace pas ce comptage.

# Exercices

## Exercice 1 : La dépendance qui encaisse

Le plan de la liste est accepté. Une permission demande d'ajouter une bibliothèque de paiement, « puisque le stage coûte 45 € ». Le chemin n'a rien à voir avec l'affichage des 12 stages. Que décidez-vous ?

<details>
<summary>Voir la solution</summary>

Vous refusez. Les 45 € sont un prix affiché, le brief interdit l'encaissement, et cette session ne fait que la liste. La commande n'est pas une vérification de l'incrément 1.

Vous le redites en une ligne : pas de paiement, on reste sur la page des 12 stages. Vous ne laissez pas la bibliothèque « au cas où », quitte à ne pas s'en servir. Une dépendance installée est déjà une écriture hors incrément.

</details>

## Exercice 2 : Douze lignes, un mauvais jour

Vous lancez l'appli. La page compte bien 12 stages, à la Croix-Rousse, à 8 places et 45 €. Trois d'entre eux sont le dimanche à 14 h. On vous propose d'ouvrir le formulaire maintenant, « la liste est là ». Que faites-vous ?

<details>
<summary>Voir la solution</summary>

Vous n'ouvrez pas le formulaire. La liste est fausse : le créneau de Léa est le samedi 10 h-13 h, pas le dimanche 14 h. Un compte de 12 ne suffit pas si l'horaire ment.

Vous collez l'observation (12 lignes, dont des dimanches à 14 h) et vous restez sur l'incrément 1. Le refus de la 9e place attendra une page dont chaque stage est le bon créneau, au bon lieu.

</details>

## Exercice 3 : La ligne du soir

La page est juste : 12 stages, samedi 10 h-13 h, Lyon Croix-Rousse, 8 places, 45 €, pas de bouton de paiement. Écrivez la ligne que vous gardez, et dites ce que vous ne démarrez pas.

<details>
<summary>Voir la solution</summary>

Vous écrivez : « Incrément 1 tenu : 12 stages, samedi 10 h-13 h, Lyon Croix-Rousse, 8 places, 45 € affichés, pas de paiement. »

Vous ne démarrez pas le formulaire, ni l'attente, ni la règle des 18 h. La ligne ferme la session. Elle servira de dernier test au matin, dans une session neuve. « C'est bon » sans ces mots ne se relit pas.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: La page des 12 stages
center: "Après le oui, on lit chaque permission, on lance l'appli, on compte. Liste fausse : pas de formulaire."
points:
  - icon: check
    title: Un seul oui
    text: "Le plan accepté couvre la liste des 12 stages. Le formulaire n'est pas dans ce oui."
  - icon: eye
    title: Lire
    text: "Chaque permission montre un chemin ou une commande. On lit la ligne avant d'accepter."
  - icon: rocket
    title: Lancer
    text: "On démarre l'appli et on compte : 12, samedi 10 h-13 h, Croix-Rousse, 8 places, 45 €."
  - icon: alert
    title: Liste fausse
    text: "11 stages, un dimanche, ou un paiement : on colle ce qu'on voit, on ne change pas d'incrément."
  - icon: file
    title: La ligne
    text: "Le soir, une phrase dit ce que la page montre. « C'est fait » ne se relit pas demain."
pitfall: "Ouvrir le formulaire parce que 12 lignes s'affichent, alors que trois stages sont le dimanche à 14 h."
remember: "On passe au formulaire quand la liste est vraie, pas quand elle est seulement nombreuse."
```
