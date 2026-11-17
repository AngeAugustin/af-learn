---
title: Parcours d'usage
description: "Suivre Yassine, un objectif, les étapes sur la feuille ou au terminal, puis les variantes qui s'arrêtent ou qui sautent une étape."
duration: 55
objectives:
  - Tenir un parcours pour un seul acteur et un seul objectif
  - Décrire les étapes dans l'ordre du quai, feuille à Rouen ou écran là où Quai existe
  - Écrire les variantes acceptée, refusée, mise de côté et non commandée
  - Laisser hors du parcours le travail de Claire, de Pauline et de Thomas
---

# Un acteur, un objectif

Le processus cible mélange encore ce que le quai décide et ce que d'autres liront plus tard. Le **parcours d'usage** descend au niveau de quelqu'un qui a les mains prises. Un acteur. Un objectif. Les étapes dans l'ordre où il les vit.

Acteur : **Yassine**, équipier réception à Rouen. Pas « le magasin ». Pas « les quarante ». Si vous ne pouvez pas le regarder faire entre 5 h 30 et 9 h 30, vous n'avez pas un acteur.

Objectif : **quitter la palette avec une décision tracée, avant que le chauffeur parte.** Acceptée, refusée, ou mise de côté. Motif écrit quand ce n'est pas une acceptation simple.

Claire consulte les refus frais avant 10 h. C'est un autre objectif, un autre parcours. Pauline fait tomber le stock le soir. Thomas reçoit le motif. Les coller ici produit une histoire à quatre héros, et vous ne savez plus lequel doit avoir fini quand le camion ferme ses portes.

Rouen est au papier. Le parcours cible de Yassine est donc d'abord une **feuille**, aux champs du modèle. Les 21 magasins au terminal jouent les mêmes champs à l'écran. Ce n'est pas un second métier. C'est le même objectif, un autre support.

# Les étapes, dans l'ordre du quai

Vous nommez les étapes comme Yassine les voit, pas comme un menu.

1. **Le bon du camion.** Il prend le bon de Thomas. C'est la livraison de Rouen, pas celle d'hier.
2. **La ligne en main.** Produit, famille, quantité annoncée. Surgelé : il sonde. Frais : il regarde la vie restante. Sec : il ne sonde pas.
3. **L'issue.** Acceptée, refusée, ou mise de côté. Il l'écrit tout de suite, pas « dans le carnet pour plus tard ».
4. **Le motif**, seulement si l'issue n'est pas une acceptation simple. Température, casse, manquant, DLC, non commandé. Pas « un peu mou ».
5. **La quantité acceptée.** Zéro si refus. La quantité du bon si tout correspond. Jamais une quantité inventée pour faire tomber la journée.
6. **La trace montrable.** Heure, son nom. Il peut la montrer au chauffeur avant le départ. Les deux palettes à -16 °C y figurent comme refusées.

Chaque étape a une preuve qu'elle est finie. À l'étape 2, la preuve est le chiffre lu (-16 °C, pas une impression). À l'étape 6, la preuve est la ligne relisible sans Yassine. « Jeter un œil » n'est pas une étape.

```diagram
type: sequence
title: Yassine trace le refus avant le départ
actors: ["Yassine", "Feuille ou écran", "Chauffeur"]
messages:
  - from: 0
    to: 1
    text: "Ouvre le bon de la livraison de Rouen"
  - from: 1
    to: 0
    text: "Montre la ligne surgelée et la quantité annoncée"
  - from: 0
    to: 1
    text: "Saisit -16 °C, issue refusée, motif température"
  - from: 1
    to: 0
    text: "Affiche quantité acceptée à zéro"
  - from: 0
    to: 2
    text: "Montre le refus avant la fermeture des portes"
  - from: 0
    to: 1
    text: "Laisse la trace à son nom, avec l'heure"
```

```video
url: https://www.youtube.com/watch?v=2W13ext26kQ
title: "Customer Journey Mapping 101"
channel: "NNgroup"
duration: "2:18"
lang: en
why: "Le Nielsen Norman Group présente la cartographie du parcours utilisateur en deux minutes."
```

# Les variantes qui changent le chemin

Une variante n'est pas un nouveau parcours. C'est le même objectif, avec une étape sautée ou une fin différente. Vous en tenez quatre.

**Acceptée.** Le physique suit le bon, la règle est tenue. L'étape motif n'apparaît pas. Si la feuille demande quand même un motif vide, Yassine écrira n'importe quoi. Vous retirez l'étape. Vous ne la grisez pas.

**Refusée.** Le chemin des deux palettes à -16 °C, ou d'un frais sous les 2 jours de vie restante. Motif obligatoire. Quantité acceptée à zéro. La palette ne part pas en chambre ni en rayon.

**Mise de côté.** On ne tranche pas encore, ou la palette est abîmée sans que le refus soit clair. Elle ne part pas en rayon « en attendant Claire ». La trace dit mise de côté, avec le motif le plus honnête (casse, ou à confirmer). Claire lira cette ligne avant 10 h. Ce n'est pas à Yassine de jouer le parcours de Claire au milieu du sien.

**Non commandée.** La palette n'est pas sur le bon. Le parcours s'arrête avant une quantité acceptée positive. Mise de côté, rien en stock. Pas de bouton « forcer sur le bon ».

Le terminal des 21 magasins reprend ces quatre chemins. S'il sature entre 7 h et 9 h et que le chemin le plus court redevient « tout accepter », le parcours est faux, même si les champs existent. La variante écran ne gagne pas le droit d'effacer le motif.

> [!IMPORTANT]
> La variante acceptée saute le motif. Elle ne demande pas une case vide que l'on remplit pour passer.

# Quand il n'y a pas de terminal

À Rouen, l'absence de terminal n'est pas une panne. C'est le support du groupe des 7. La feuille porte **les mêmes noms** que l'écran des 21 : bon, ligne, famille, annoncée, température ou vie restante, issue, motif, quantité acceptée, heure, nom.

L'objectif ne change pas : les portes ne se ferment pas sur un refus non écrit. Ce qui change, c'est qu'il n'y a pas de « saisie le soir par la direction » dans la cible. Si la feuille attend Pauline, vous avez recréé l'existant, avec un papier mieux imprimé.

Vous n'inventez pas une feuille « RAS / problème » pour aller plus vite les lundis à 36 palettes. Cette feuille ne sait pas dire -16 °C, ni zéro accepté, ni lequel des onze écarts. Les noms des champs sont le contrat entre Rouen et un magasin au terminal.

Vous marchez le parcours. Transpalette, gants, sonde, soleil. Si l'étape 3 demande un aller au bureau, elle est au mauvais endroit. Le lundi, Yassine ne quitte pas le quai pour chercher un écran.

# Ce que vous laissez dehors

Le débat -18 °C ou -15 °C n'est pas une étape de Yassine. Il applique la règle que Jonas porte. Lui demander « tu refuses ou tu mets en chambre, aujourd'hui ? » lui fait trancher à la place du réseau, avec le chauffeur qui attend.

La liste de Claire n'est pas une étape 7. « Attendre que le rayon confirme » bloque le quai pour un objectif qui n'est pas le sien. Elle a son parcours : avant 10 h, lire les refus frais et leur motif. Vous l'écrirez devant elle, un autre jour.

La correction de Pauline n'est pas la dernière étape. L'ajouter « au cas où la feuille se perd » autorise la feuille à se perdre. Thomas n'est pas une étape non plus. Il doit recevoir le motif. Il ne le dicte pas au quai.

Les quarante magasins ne font pas quarante parcours. Rouen sert d'exemple parce que vous pouvez y marcher, et parce que c'est le cas le plus loin du terminal. Le geste est commun. Un magasin qui « ajoute le carnet » décrit l'existant, pas une variante à protéger.

> [!WARNING]
> Quatre acteurs dans le même parcours, et vous ne savez plus qui doit avoir fini avant que les portes se ferment.

# Exercices

## Exercice 1 : Découper l'objectif

On vous demande un parcours « quai, rayon et stock du soir » avec Yassine, Claire et Pauline. Réécrivez l'acteur et l'objectif du seul parcours de quai.

<details>
<summary>Voir la solution</summary>

Acteur : Yassine. Objectif : quitter chaque palette avec une décision tracée avant le départ du chauffeur. Acceptée, refusée ou mise de côté, motif si besoin, quantité acceptée écrite.

Claire lit les refus avant 10 h. Pauline ne reconstitue plus le quai le soir. Thomas reçoit le motif. Aucun des trois n'est une étape de Yassine. « Le magasin » n'est pas un acteur : vous ne pouvez pas le regarder sonder.

</details>

## Exercice 2 : La case vide

La feuille montre « motif » même quand la palette est acceptée sans écart. Yassine écrit « RAS » pour aller plus vite. Que changez-vous, et que deviennent les palettes à -16 °C ?

<details>
<summary>Voir la solution</summary>

Variante acceptée : l'étape motif n'existe pas. On passe de l'issue « acceptée » à la quantité acceptée, égale à l'annoncée.

Variante refusée : le motif est obligatoire. À -16 °C, motif température, quantité acceptée zéro, pas de mise en chambre. « RAS » n'est pas proposé. Une case toujours visible apprend à la remplir sans lire, y compris sur un refus.

</details>

## Exercice 3 : RAS / problème

Pour tenir les 36 palettes, on propose une feuille réduite à « RAS / problème ». Que doit-elle porter à la place, et pourquoi la saisie du soir n'est-elle pas le repli ?

<details>
<summary>Voir la solution</summary>

Les mêmes noms que l'écran : bon, ligne, famille, quantité annoncée, température ou vie restante, issue, motif, quantité acceptée, heure, nom. « RAS / problème » ne distingue pas -16 °C, un manquant, et une palette absente du bon.

Le repli n'est pas Pauline le soir. La trace existe avant le départ, sur la feuille, au quai. Sinon les sept lignes sans décision reviennent, et Thomas rappelle sans pièce.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Le parcours de Yassine
center: "Un acteur, un objectif, les étapes dans l'ordre du quai. La feuille de Rouen porte les mêmes noms que l'écran."
points:
  - icon: users
    title: Un acteur
    text: "Yassine, pas « le magasin ». Claire, Pauline et Thomas ont d'autres objectifs."
  - icon: target
    title: Un objectif
    text: "Décision tracée avant le départ : acceptée, refusée ou mise de côté."
  - icon: list
    title: Étapes
    text: "Bon, ligne, issue, motif seulement s'il le faut, quantité acceptée, heure et nom."
  - icon: filter
    title: Variantes
    text: "Acceptée sans case vide. Refus à -16 °C. Non commandé : rien sur le bon."
  - icon: file
    title: Feuille
    text: "Mêmes champs que le terminal. Pas de « RAS ». Pas de report au soir de Pauline."
pitfall: "Demander à Yassine s'il applique -18 °C ou -15 °C pendant que le chauffeur attend."
remember: "Si l'étape ne se marche pas avec la sonde en main, elle n'est pas au bon endroit."
```
