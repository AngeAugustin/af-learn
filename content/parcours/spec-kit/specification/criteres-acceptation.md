---
title: "Des critères que Léa peut constater"
description: "Écrire des critères visibles pour l'attente de Sève : 12e accepté, 13e refusé, phrase avant 18 h, aucun téléphone."
duration: 50
objectives:
  - "Formuler un critère comme un fait que Léa constate à l'écran"
  - "Tenir les quatre preuves de l'attente : 12e, 13e, phrase avant 18 h, aucun téléphone"
  - "Laisser « code propre » hors des critères d'acceptation"
  - "Ranger ces critères dans spec.md, à côté du comportement déjà écrit"
---

# Un critère se voit

Léa Vernet peut ouvrir la page d'Atelier Sève sans lire le dépôt. Un critère d'acceptation est une phrase qu'elle peut confirmer ou nier depuis cet écran. Samedi, 10 h-13 h, 8 places, 45 €, Lyon Croix-Rousse : ce décor est déjà fixé. La fonctionnalité ajoute l'attente ordonnée et la confirmation visible. Les critères parlent de cet ajout.

GitHub Spec Kit range ces phrases dans `spec.md`, celui qu'écrit `/speckit-specify`. Vous les rédigez comme des constats, pas comme des souhaits. « La personne comprend vite » ne se constate pas. « Le 13e nom est refusé » se constate : on inscrit douze noms, puis un treizième, et on regarde la page.

L'application a déjà la liste des 12 stages et le refus de la 9e place. Ces deux faits ont déjà leurs preuves, ailleurs. Vous ne les réécrivez pas comme si la liste restait à créer. Vous ajoutez les preuves de l'attente et de la confirmation.

> [!IMPORTANT]
> Si Léa ne peut pas trancher en regardant l'écran, la phrase n'est pas un critère. Elle peut rester une envie. Elle ne guide pas le skill.

# Le 12e entre, le 13e non

Le stage a 8 places. Ce n'est pas le critère de l'attente. L'attente a son propre plafond : 12 noms. Vous écrivez deux constats séparés, pour que personne ne les fusionne.

Le 12e nom présenté à l'attente est accepté. La personne voit qu'elle est en attente, et sa place dans l'ordre est celle de son arrivée. Le premier arrivé est devant le suivant. Vous ne demandez pas un ordre alphabétique, ni un ordre au hasard.

Le 13e nom est refusé. La page le montre sans ambiguïté : ce nom n'entre pas dans l'attente. Un critère qui dirait « l'attente reste raisonnable » ne permet pas à Léa de compter. Douze entre, treize non. Le chiffre 10 n'apparaît pas dans ces phrases.

# La phrase est à l'écran

Léa tranche avant 18 h la veille. Le critère n'est pas « Léa est prévenue quelque part ». Le critère est la phrase lisible : « avant 18 h » est à l'écran. La personne qui attend la voit sans ouvrir un message privé et sans appeler l'atelier.

Vous précisez le moment dans la spec, pour que la phrase courte ne devienne pas floue. Il s'agit de 18 h la veille du stage, pas du matin même, pas de « la soirée » sans heure. Le critère d'écran reste la phrase « avant 18 h ». Le critère de sens, juste à côté, dit que cette heure est celle de la veille.

La confirmation est visible. On voit que la décision tombe à cette heure, et on voit l'état de la personne : en attente, puis la suite que Léa a tranchée. Un critère qui dirait seulement « le système gère la confirmation » ne montre rien.

> [!NOTE]
> Deux critères voisins : la phrase « avant 18 h » est affichée, et elle désigne 18 h la veille. L'un se lit sur la page. L'autre empêche de déplacer l'heure au jour du stage.

# Aucun téléphone sur la page publique

La page publique ne montre pas les numéros de téléphone. Le critère se teste en ouvrant cette page avec des noms qui ont un numéro connu : aucun de ces numéros n'apparaît, ni en entier, ni en partie.

Vous n'écrivez pas « les données personnelles sont protégées », qui peut vouloir dire dix choses. Vous écrivez ce que Léa voit : zéro téléphone sur la page publique. L'ordre d'arrivée, le statut d'attente et la phrase « avant 18 h » restent visibles. Le numéro, non.

Ce critère ne demande pas d'effacer le fait que Léa connaisse ses stagiaires. Il borne l'écran public. Un plan qui publierait les téléphones « pour que ce soit plus simple » contredirait déjà `spec.md`.

# « Code propre » ne se constate pas

« Code propre », « architecture moderne », « composants réutilisables », « expérience fluide » : Léa ne peut pas cocher ces phrases en regardant la page du samedi. Elles ne disent ni 12, ni 13, ni 18 h, ni l'absence de téléphone. Elles n'entrent pas dans les critères.

Un test qui ne regarde que le dépôt (« les fonctions sont courtes ») n'est pas non plus un critère d'acceptation de cette fonctionnalité. Il pourra intéresser une relecture de code, plus tard. Il ne remplace pas l'écran. `/speckit-specify` doit recevoir des faits constatables, sinon la spec se remplit de jugements.

Le remplissage de 70 % et les 3 absents du mois n'en font pas des critères de la page d'attente. Ce sont le contexte. Le critère n'est pas « le mois atteint 70 % ». Le critère est ce qu'une personne voit sur son nom : en attente, dans l'ordre, sous le plafond, sans son téléphone, avec l'heure limite.

```diagram
type: compare
title: "Ce que Léa peut cocher"
columns:
  - title: "Critère constatable"
    tone: teal
    items:
      - "Le 12e nom est accepté dans l'attente"
      - "Le 13e nom est refusé"
      - "La phrase « avant 18 h » est à l'écran"
      - "La page publique ne montre aucun téléphone"
      - "L'ordre affiché est celui de l'arrivée"
  - title: "Jugement, pas un critère"
    tone: rose
    items:
      - "Le code est propre"
      - "L'attente est moderne et fluide"
      - "L'architecture est élégante"
      - "Le mois fera meilleur effet"
```

# Les critères vivent dans spec.md

Vous placez ces phrases dans `spec.md`, à l'endroit des scénarios ou des critères, selon la forme que le skill a donnée au fichier. Vous les relisez avec les mêmes yeux que pour le chiffre des places. Huit places au stage, pas 10. Douze noms d'attente, pas une file illimitée. 45 € affichés, sans paiement. Pas de SMS.

Si un critère contredit le refus déjà en place, vous le retirez. « La 9e personne est mise en attente à la place du refus » casserait l'application actuelle. La 9e inscription reste refusée. L'attente concerne celles et ceux qui n'ont pas eu de place, dans la limite de 12 noms.

`/speckit-clarify` pourra interroger un critère encore mou. Il ne transforme pas « code propre » en critère en le posant sous forme de question. Si la seule preuve proposée est un adjectif, vous réécrivez la preuve avant de planifier.

> [!WARNING]
> Un critère qui dit « environ 10 places » ou « code propre » ne se montre pas à Léa. Vous le remplacez par un constat chiffré ou visible, dans `spec.md`, avant le plan.

# Exercices

## Exercice 1 : Garder ou écarter

Voici six phrases candidates. Gardez les critères que Léa peut constater. Écartez les autres.

1. Le 12e nom est accepté dans l'attente.
2. Le code est propre.
3. Le 13e nom est refusé.
4. L'interface est fluide.
5. La phrase « avant 18 h » est à l'écran.
6. La page publique ne montre aucun téléphone.

<details>
<summary>Voir la solution</summary>

Vous gardez 1, 3, 5 et 6. Léa compte les noms, lit la phrase, et vérifie qu'aucun numéro n'est affiché. L'ordre d'arrivée se constate de la même façon, même s'il n'est pas dans cette liste.

Vous écartez 2 et 4. « Code propre » et « fluide » sont des jugements. Ils ne disent pas ce que la page du samedi montre. Ils n'entrent pas dans `spec.md` comme critères d'acceptation.

</details>

## Exercice 2 : Réécrire trois jugements

On vous donne : « attente intelligente », « confirmation gérée proprement », « respect de la vie privée ». Remplacez chaque formule par un constat que Léa peut faire sur l'écran d'Atelier Sève.

<details>
<summary>Voir la solution</summary>

L'attente intelligente devient : la personne voit qu'elle est en attente, l'ordre est celui de l'arrivée, le 12e nom est accepté, le 13e est refusé.

La confirmation gérée proprement devient : la phrase « avant 18 h » est à l'écran, et il s'agit de 18 h la veille du stage. Léa tranche avant cette heure. La personne le voit sans appeler.

Le respect de la vie privée devient : la page publique ne montre aucun téléphone. Vous ne laissez pas l'adjectif à la place de ce constat. Le stage reste à 8 places, 45 €, samedi 10 h-13 h.

</details>

## Exercice 3 : Un critère qui contredit l'existant

Un critère proposé dit : « Pour éviter les 3 absents, la 9e inscription entre dans l'attente au lieu d'être refusée, et la page publique affiche le téléphone pour relancer. » Que mettez-vous à la place dans `spec.md` ?

<details>
<summary>Voir la solution</summary>

Vous ne prenez pas ce critère. L'application refuse déjà la 9e inscription, parce que le stage a 8 places. La spec ne contredit pas ce refus. Les 3 absents expliquent le mois, ils ne changent pas la règle des places. Aucun SMS n'est demandé.

À la place : le 12e nom d'attente est accepté, le 13e est refusé, l'ordre est celui de l'arrivée, la phrase « avant 18 h » est à l'écran, la page publique ne montre aucun téléphone. Le prix affiché reste 45 €. La liste des 12 stages n'est pas à refaire.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Léa coche l'écran"
center: "Un critère se constate : 12e accepté, 13e refusé, phrase « avant 18 h », aucun téléphone."
points:
  - icon: eye
    title: "Ça se voit"
    text: "Léa confirme ou nie depuis la page. Une phrase qu'elle ne peut pas trancher n'est pas un critère."
  - icon: users
    title: "12 puis 13"
    text: "Le 12e nom entre dans l'attente. Le 13e est refusé. Ce plafond n'est pas les 8 places du stage."
  - icon: clock
    title: "Phrase à l'écran"
    text: "« avant 18 h » se lit sur la page. C'est 18 h la veille, pas une soirée sans heure."
  - icon: shield
    title: "Zéro téléphone"
    text: "La page publique n'affiche aucun numéro, même partiel. On le vérifie en ouvrant cette page."
  - icon: scale
    title: "Pas un jugement"
    text: "« Code propre » ne se constate pas sur le stage du samedi. On le laisse hors de spec.md."
pitfall: "Accepter « code propre » ou « environ 10 places » comme critère. Léa ne peut ni cocher l'adjectif, ni constater le 10."
remember: "Les critères de Sève se voient : 12e accepté, 13e refusé, « avant 18 h » à l'écran, aucun téléphone public."
```
