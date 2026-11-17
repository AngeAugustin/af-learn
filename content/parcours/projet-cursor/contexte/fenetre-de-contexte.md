---
title: "Tenir la fenêtre de contexte"
description: "Ouvrir un fil par incrément de Sève et résumer l'état au début, sans compter sur une mémoire entre conversations."
duration: 50
objectives:
  - "Traiter chaque conversation comme sans mémoire du fil précédent"
  - "S'appuyer sur les règles et les fichiers, qui eux restent dans le dépôt"
  - "Ouvrir un fil par incrément, sans mélanger brief, bug et paiement"
  - "Écrire en tête de fil l'état réel de Sève avant de demander la suite"
---

# Pas de mémoire d'un fil à l'autre

Le modèle n'a pas de mémoire entre deux conversations. Fermer le chat efface le fil pour lui. Le suivant ne sait pas ce que vous avez décidé, même si vous vous en souvenez parfaitement. Il sait ce qui est écrit dans les fichiers, et ce que les règles remettent au début du contexte.

Atelier Sève, Lyon Croix-Rousse. Léa Vernet, céramiste, tient 12 stages par mois, le samedi de 10 h à 13 h, 8 places, 45 €. La liste d'attente est plafonnée à 12. Léa confirme ou refuse avant 18 h la veille. Le remplissage actuel est de 70 %. 3 absents en moyenne par mois, parce que la confirmation est un SMS oublié. L'application s'appelle Sève.

Vous pouvez avoir passé une heure à fixer ces chiffres dans un fil. Le fil d'après les ignore, tant qu'ils ne sont pas dans une règle ou dans le jeu de données. « Comme tout à l'heure » n'est pas une instruction. Il n'y a pas de tout à l'heure.

> [!IMPORTANT]
> Ce qui revient seul : les règles (`.mdc`, `AGENTS.md`) et les fichiers du dépôt. Ce qui ne revient pas : le fil que vous venez de fermer, les hésitations, le chiffre dit seulement à l'oral.

# Une fenêtre se remplit, puis se dégrade

Chaque message, chaque fichier cité avec @, chaque diff, occupe la fenêtre de contexte. Au début, les 8 places et les 45 € pèsent. Au bout de quarante échanges, ils pèsent moins que le dernier bug CSS et que la discussion sur un paiement qui n'est même pas un incrément.

Les signes que la fenêtre est devenue mauvaise :

- l'agent « corrige » la page des stages alors que vous parliez d'un espacement ;
- il ressort un vieux choix, 10 places, que vous aviez refusées en début de fil ;
- il mélange la liste d'attente (plafond 12) avec le formulaire qui refuse la 9e place ;
- il propose un SMS de rappel, alors que les 3 absents viennent justement d'un SMS oublié.

Ajouter « sois attentif » ne vide pas la fenêtre. Le texte ancien est toujours là. Vous ouvrez un fil neuf. Vous y remettez l'état en quelques lignes. Les fichiers, eux, ont déjà la version que vous avez gardée.

Changer de mode avec Shift+Tab ouvre aussi un contexte neuf. Ce n'est pas une façon de ranger le fil : vous perdez le fil en cours sans avoir écrit le résumé. Vous changez de mode au début d'un geste, pas pour « faire de la place ».

# Un fil qui mélange tout

Le mauvais fil de Sève ressemble à ceci, dans l'ordre : le brief de Léa, puis un bug d'alignement sur la page, puis une question de paiement, puis « tant qu'on y est » la confirmation. À la fin, personne ne sait quel incrément est en cours. Le diff touche quatre sujets. Vous ne pouvez plus le lire.

Le brief a sa place une fois : ouvrir le dépôt, nommer la page. Le bug CSS a sa place dans un fil court, qui cite le fichier de présentation et ne parle pas des 8 places, sauf si le bug les cache. Le paiement n'a pas de place dans les incréments. Le mélanger au reste lui en fabrique une.

Les quatre incréments, quatre fils, pas un :

1. Page qui liste les 12 stages du mois, date, 8 places, 45 €, places restantes.
2. Formulaire qui refuse la 9e place.
3. Liste d'attente jusqu'à 12, dans l'ordre.
4. Confirmation visible, et règle « Léa tranche avant 18 h ».

Un bug trouvé au milieu d'un incrément se note en une ligne, il ne détourne pas le fil. Vous le traitez après, dans un fil qui ne cite que le fichier concerné. Les 70 % de remplissage ne justifient pas d'ajouter un sujet « statistique » dans le fil du formulaire.

```diagram
type: flow
title: Un fil par incrément
steps:
  - title: Fil 1
    text: "Les 12 stages, date, 8 places, 45 €, places restantes."
    tone: violet
  - title: Fil 2
    text: "Le formulaire refuse la 9e place."
    tone: blue
  - title: Fil 3
    text: "Liste d'attente jusqu'à 12, dans l'ordre."
    tone: teal
  - title: Fil 4
    text: "Confirmation visible. Léa tranche avant 18 h."
    tone: amber
loop: "Chaque fil neuf commence par l'état, pas par « comme tout à l'heure »."
```

# Résumer l'état en début de fil

Le premier message d'un fil neuf tient en un bloc que vous pourriez relire à voix haute. Il ne raconte pas l'atelier. Il dit où en est le dépôt.

Pour ouvrir l'incrément 3, par exemple :

« Dépôt Sève. La page liste les 12 stages du mois (samedi, 10 h-13 h, 8 places, 45 €, places restantes). Le formulaire refuse déjà la 9e place. Incrément en cours : liste d'attente jusqu'à 12, dans l'ordre d'arrivée. Ne pas toucher à la confirmation. Léa tranche avant 18 h la veille, ce n'est pas ce fil. »

Ce bloc répète des chiffres déjà écrits dans les règles et les fichiers. C'est volontaire. La règle rappelle la contrainte, le fichier porte les dates, le message dit **lequel** des quatre incréments vous ouvrez. Sans cette phrase, un agent qui voit les quatre règles peut attaquer les quatre.

Vous y joignez, avec @, seulement les fichiers de cet incrément. Le résumé ne compense pas un dossier racine cité en plus. Contexte court et résumé court vont ensemble.

> [!TIP]
> Gardez le bloc d'état dans une commande réutilisable, invoquée avec `/` en tête de fil. Vous changez une ligne : le numéro d'incrément. Vous ne réécrivez pas les 12 stages à la main chaque matin.

# Quand fermer, quand rester

Vous restez dans le fil tant que le diff porte le même résultat nommé. La page des 12 stages peut prendre plusieurs messages : un pour les dates, un pour aligner 45 €, un pour les places restantes. Même incrément, même fil, tant que la fenêtre répond encore juste.

Vous fermez et vous ouvrez un fil neuf quand :

- vous passez à l'incrément suivant ;
- le fil a mélangé un bug ou un paiement avec le brief ;
- l'agent répète une erreur déjà corrigée dans les fichiers, signe qu'il suit l'ancien texte du chat plutôt que le dépôt ;
- vous changez de branche et le sujet change avec elle.

Avant de fermer, le dépôt doit être à jour de ce que vous gardez. Le fil ne sert pas d'archive. Si la décision « 8 places, pas 10 » n'est que dans le chat, elle mourra avec lui. Elle doit être dans la règle ou dans le code.

Les 3 absents restent un fait pour le fil 4, écrits dans le résumé de ce fil-là : la confirmation doit être visible parce que le SMS est oublié. Les coller en tête de chaque fil pousse l'agent à parler de SMS partout. Le résumé dit l'incrément, pas toute l'histoire de la Croix-Rousse.

# Relire le début avant d'envoyer la suite

Au bout d'un moment, vous remontez. Le premier message dit-il encore vrai ? Si la page a été acceptée et que le fil parle maintenant d'attente, vous n'êtes plus dans le résumé. Vous ouvrez le fil 3, vous collez l'état, vous citez la file et la règle de plafond.

Ce geste est le même que rester dans l'éditeur. La fenêtre de contexte est une surface de plus, comme le diff. Quand elle ne montre plus le résultat nommé, vous ne « continuez pas un peu ». Vous la remplacez par un fil dont la première phrase est vraie.

# Exercices

## Exercice 1 : « Comme tout à l'heure »

Le fil d'hier a fixé 8 places, 45 € et le refus de la 9e. Vous ouvrez un chat neuf et vous écrivez : « Continue, ajoute la liste d'attente. » Que manque-t-il, et que peut faire l'agent ?

<details>
<summary>Voir la solution</summary>

Le fil neuf n'a pas lu hier. « Continue » ne désigne rien. L'agent peut inventer un plafond, un ordre, ou reprendre un SMS.

Vous écrivez l'état : page des 12 stages en place (date, 8 places, 45 €, places restantes), formulaire qui refuse la 9e place déjà fait, incrément en cours : attente jusqu'à 12, dans l'ordre. Vous citez avec @ le fichier de la file, pas le fil d'hier. Les règles du dépôt rappellent les chiffres seulement s'ils y sont écrits.

</details>

## Exercice 2 : Le fil qui dérive

Dans le même fil : brief de Léa, puis un écart d'alignement sur la page, puis « et le paiement ? », puis la confirmation avant 18 h. L'agent modifie les quatre. Que faites-vous ?

<details>
<summary>Voir la solution</summary>

Vous arrêtez. Vous ne rajoutez pas un message « concentre-toi ». La fenêtre est déjà pleine de sujets qui se contredisent. Le paiement n'est pas un incrément de Sève.

Vous rejetez le diff qui mélange tout. Vous ouvrez un fil par sujet restant. Le bug d'alignement dans un fil court. La confirmation dans le fil 4, avec la règle « Léa tranche avant 18 h », pas dans la foulée du CSS. Le brief ne se rejoue pas : il est déjà dans les fichiers si la page des 12 stages a été acceptée.

</details>

## Exercice 3 : Le résumé du fil 4

La page, le formulaire et l'attente sont dans le dépôt. Vous ouvrez le fil de la confirmation. Écrivez les premières lignes. Que n'y mettez-vous pas ?

<details>
<summary>Voir la solution</summary>

« Page des 12 stages faite. Formulaire : refus au-delà de 8 places. Attente : 12 personnes, dans l'ordre. Incrément en cours : confirmation visible. Léa confirme ou refuse avant 18 h la veille. Pas de SMS. »

Vous n'y mettez pas le récit des 70 %, ni une demande de paiement, ni un retour sur le bug CSS. Les 3 absents peuvent tenir en une incise, comme raison de rendre la confirmation visible, pas comme nouveau chantier. Vous citez l'écran de confirmation, pas la racine du dépôt.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Un fil, un incrément
center: "Pas de mémoire entre deux conversations. Le fil neuf commence par l'état du dépôt."
points:
  - icon: brain
    title: Sans mémoire
    text: "Le fil fermé disparaît. « Comme tout à l'heure » ne désigne aucun fichier."
  - icon: book
    title: Ce qui reste
    text: "Les règles et les fichiers. 8 places dans un .mdc survit. Un chiffre dit seulement dans le chat, non."
  - icon: filter
    title: Un sujet
    text: "Pas de brief, de bug CSS et de paiement dans le même fil. Le paiement n'est pas un incrément."
  - icon: list
    title: Quatre fils
    text: "Page des 12 stages, refus de la 9e, attente jusqu'à 12, confirmation avant 18 h."
  - icon: chat
    title: L'état d'abord
    text: "Quelques lignes : ce qui est fait, l'incrément en cours, ce qu'il ne faut pas toucher."
pitfall: "Continuer un fil noyé avec « sois attentif », ou croire que changer de mode range la conversation."
remember: "Fermez le fil mêlé. Ouvrez-en un par incrément. La première phrase dit l'état réel de Sève."
```
