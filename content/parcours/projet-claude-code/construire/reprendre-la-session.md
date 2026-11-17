---
title: "Reprendre une session sans tout réexpliquer"
description: "Ouvrir une session neuve le lendemain, laisser relire CLAUDE.md et le brief, et remplacer trois lignes d'état sans recopier la conversation d'hier."
duration: 50
objectives:
  - "Ouvrir une session neuve plutôt que de recharger tout le transcript de la veille"
  - "S'appuyer sur la relecture de CLAUDE.md et de docs/brief.md"
  - "Écrire trois lignes : incrément en cours, dernier test, ce qu'il ne faut pas refaire"
  - "Remplacer ces trois lignes à chaque reprise, sans les empiler"
---

# Le lendemain, une session neuve

Le soir, vous vous arrêtez sur un état connu. Le matin, vous relancez Claude Code dans le dossier du projet. C'est une session neuve : le transcript d'hier n'est pas le prompt. Reprendre ce transcript (`claude -c`, ou `/resume`) recharge aussi les détours : un paiement esquissé, un plan passé à 10 places, une liste un moment fausse. Vous choisissez la session neuve pour que ces détours ne reviennent pas avec l'historique.

Le travail, lui, continue. Il continue parce que les fichiers sont toujours là, pas parce que le chat s'en souvient. Léa Vernet, Atelier Sève, le samedi à la Croix-Rousse : tout cela est dans `docs/brief.md`. Vous n'allez pas le redicter.

# Ce qui est relu sans collage

`CLAUDE.md` est chargé en ouvrant la session. Il pointe vers `docs/brief.md`. Les règles qui ne doivent pas dériver y sont déjà : 8 places, attente maximum 12, décision avant 18 h la veille, aucun paiement, un incrément par session. La page porte les chiffres et le mal des 3 absents. Le résumé porte les garde-fous.

Vous pouvez demander cette lecture en une ligne, pour la voir : « Relis CLAUDE.md et docs/brief.md ». Vous ne collez pas la page dans le terminal. Coller la page, c'est recréer la deuxième source que le brief avait évitée. Si un chiffre a changé hier soir dans la page, la session du matin doit lire la page, pas votre copie.

# Trois lignes, pas le transcript

Vous ajoutez trois lignes en tête de `CLAUDE.md`. Vous les remplacez chaque matin. Vous ne les ajoutez pas sous les précédentes.

```text
Incrément en cours : 2, refus de la 9e place.
Dernier test : 12 stages affichés, samedi 10 h-13 h, formulaire non ouvert.
Ne pas refaire : pas de paiement.
```

La première dit où vous en êtes. La deuxième dit la dernière preuve, avec son résultat, pas un adjectif. La troisième dit ce qu'il ne faut pas rouvrir. « Pas de paiement » est déjà une règle du brief. Elle est quand même sur cette troisième ligne : un encaissement esquissé hier est un chemin à fermer, pas seulement un principe.

Vous n'y mettez pas les 12 stages du récit, ni les 70 %, ni les 3 absents. Ces faits sont dans la page. Les trois lignes sont l'état de la session, pas un deuxième brief.

```diagram
type: compare
title: "Deux façons de reprendre le matin"
columns:
  - title: "Coller la conversation"
    tone: rose
    items:
      - "Tout le transcript d'hier, détours compris"
      - "Un paiement esquissé qui revient avec le reste"
      - "Les chiffres récités, peut-être déjà faux"
  - title: "Trois lignes"
    tone: teal
    items:
      - "Incrément en cours, ici le refus de la 9e place"
      - "Dernier test : 12 stages, formulaire non ouvert"
      - "Ne pas refaire : pas de paiement"
```

# Remplacer, ne pas empiler

Trois lignes du lundi plus trois lignes du mardi deviennent un petit transcript. La session du matin hésite alors entre l'incrément 1 et l'incrément 2, ou entre un test vert et un test rouge. Vous remplacez. Les règles stables restent sous ces trois lignes. Le brief reste la page des nombres.

Si la règle change vraiment (Léa passe l'attente de 12 à 10), c'est `docs/brief.md` qui change, puis le garde-fou du résumé. Les trois lignes d'état, elles, changent à chaque session parce que l'incrément et le dernier test changent. Une ligne « incrément 1 » laissée en place le jour de l'incrément 3 fera rouvrir la liste au lieu de tenir la règle des 18 h.

> [!IMPORTANT]
> Les trois lignes se remplacent. Une quatrième ligne « et aussi ce qu'on disait avant-hier » recrée la conversation que vous aviez décidé de ne pas coller.

# La première phrase du matin

Le premier message est court, parce que les fichiers viennent d'être relus.

```text
Relis CLAUDE.md et docs/brief.md.
Incrément en cours seulement.
Propose la commande de vérification avant d'éditer.
```

Vous n'attachez pas la conversation d'hier « pour le contexte ». Le contexte utile est la page, le résumé, et les trois lignes. Si le dernier test était rouge, la deuxième ligne le dit, et vous recollez cet échec, pas la soirée. La boucle reprend sur cet objectif : lire, modifier, vérifier. Un seul.

Avant le premier oui du matin, vous vérifiez que la proposition colle aux trois lignes. L'incrément 2 ne « améliore » pas la liste déjà tenue, et il n'ajoute pas d'encaissement. Si la proposition ignore la troisième ligne, vous vous arrêtez et vous la montrez. Elle existe pour que vous n'ayez pas à réexpliquer le paiement de mémoire.

# Ce que vous ne réexpliquez pas

Vous ne réexpliquez pas qui est Léa, ni pourquoi les absents viennent d'un SMS oublié, ni le prix, ni l'horaire. La page le fait mieux que vous, et elle ne se fatigue pas. Vous réexpliquez encore moins les essais ratés d'hier, sauf l'échec qui est encore l'objectif : celui-là tient dans la ligne « dernier test », puis dans la sortie collée.

Le fil reste le même jusqu'au bout des quatre incréments. Liste prouvée, puis refus de la 9e place, puis attente ordonnée de 12, puis confirmation avant 18 h la veille. Chaque matin, les trois lignes avancent d'un cran quand la preuve de la veille est vraie. Elles ne sautent pas un incrément parce que le transcript, lui, en avait parlé.

> [!TIP]
> Si vous ne savez plus quelle était la dernière sortie verte, vous ne l'inventez pas dans les trois lignes. Vous relancez la commande, vous lisez la sortie, et la deuxième ligne copie ce que vous venez de voir.

# Exercices

## Exercice 1 : Les trois lignes du matin

Hier, la liste des 12 stages était juste. Aujourd'hui vous ouvrez l'incrément 2, le refus de la 9e place. Le paiement a été proposé hier et refusé. Écrivez les trois lignes en tête de `CLAUDE.md`.

<details>
<summary>Voir la solution</summary>

Incrément en cours : 2, refus de la 9e place.

Dernier test : 12 stages affichés, samedi 10 h-13 h, formulaire non ouvert.

Ne pas refaire : pas de paiement.

Vous n'ajoutez pas le récit de Léa, ni les 70 %, ni le transcript. Ces trois lignes remplacent celles de la veille. Le brief et les garde-fous restent en dessous, inchangés tant que la règle n'a pas changé.

</details>

## Exercice 2 : Deux cents lignes « pour aider »

Un collègue colle dans la session neuve les deux cents lignes d'hier : hypothèses, paiement esquissé, un moment où la page affichait 10 places, puis la correction. Il dit que sinon « elle ne comprendra pas ». Que gardez-vous ?

<details>
<summary>Voir la solution</summary>

Vous ne gardez pas le collage. Vous gardez `CLAUDE.md`, `docs/brief.md`, et les trois lignes : incrément en cours, dernier test, pas de paiement.

Les 10 places et le paiement esquissé sont justement ce qu'une session neuve doit oublier. S'il reste un échec ouvert, vous collez cette sortie-là, pas la soirée. Réexpliquer Léa est inutile : la page est relue.

</details>

## Exercice 3 : Des lignes en retard

`CLAUDE.md` dit encore « incrément 1 en cours » et « dernier test : liste incomplète ». Vous en êtes à l'incrément 3, l'attente ordonnée, et la liste est tenue depuis deux jours. Que va faire la session, et que corrigez-vous ?

<details>
<summary>Voir la solution</summary>

La session risque de rouvrir la liste, ou de la traiter comme fausse, au lieu de vérifier l'attente : ordre d'arrivée, plafond de 12, refus de la 13e demande. Les lignes périmées sont devenues une mauvaise consigne.

Vous les remplacez. Incrément en cours : 3, attente ordonnée. Dernier test : le refus de la 9e place, tenu. Ne pas refaire : pas de paiement. Vous ne laissez pas les anciennes lignes en dessous « pour l'historique ». L'historique du produit est le brief et les preuves, pas un journal de sessions.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Trois lignes le matin
center: "Session neuve. CLAUDE.md et le brief sont relus. Trois lignes d'état, remplacées, pas le transcript d'hier."
points:
  - icon: terminal
    title: Session neuve
    text: "On ne recharge pas le transcript. Les détours d'hier, paiement compris, ne reviennent pas avec lui."
  - icon: book
    title: Fichiers relus
    text: "CLAUDE.md et docs/brief.md portent Léa, les 8 places, l'attente, les 18 h. On ne les recolle pas."
  - icon: list
    title: Trois lignes
    text: "Incrément en cours, dernier test, ce qu'il ne faut pas refaire. Ici : pas de paiement."
  - icon: loop
    title: Remplacer
    text: "Chaque matin, ces trois lignes écrasent les précédentes. On n'empile pas un journal."
  - icon: clock
    title: Le cran d'après
    text: "Liste, puis refus, puis attente, puis règle des 18 h. On n'en saute pas un sur un souvenir."
pitfall: "Coller la conversation d'hier « pour le contexte », et faire revenir un paiement ou 10 places déjà écartés."
remember: "Le matin, trois lignes suffisent. Le reste est dans les fichiers, qui sont relus sans que vous les récitez."
```
