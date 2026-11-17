---
title: "Itérer avec le retour de Léa"
description: "Transformer une phrase de Léa en incrément court, rouvrir un fil limité, et montrer le diff sans réécrire Sève."
duration: 50
objectives:
  - "Transformer « les places restantes en gros » en un incrément avec une preuve visible"
  - "Rouvrir un fil court qui cite la liste et la règle, pas l'historique entier"
  - "Montrer un diff limité à cet affichage et le rejeter s'il réécrit l'application"
  - "Vérifier l'écran avec les mots de Léa avant de lui répondre"
---

# Une phrase, pas un nouveau produit

Léa Vernet regarde la page des stages et dit : « Je veux voir les places restantes en gros. » Ce n'est pas un cahier des charges. C'est une gêne. Les places restantes sont déjà sur la liste des 12 stages. Elles sont trop petites pour qu'elle les lise en tenant le téléphone au-dessus du plan de travail, le samedi, entre 10 h et 13 h.

Atelier Sève, Lyon Croix-Rousse. 8 places, 45 €, attente plafonnée à 12, décision de Léa avant 18 h la veille. Douze stages par mois, remplissage 70 %, 3 absents parce qu'un SMS a été oublié. Rien de tout cela n'est à reconstruire parce que le chiffre des places est illisible.

Votre travail est de faire de sa phrase un incrément. Un seul. Puis de le tenir dans l'éditeur, comme les précédents : contexte court, diff relu, écran vérifié.

# Traduire « en gros »

« En gros » ne se code pas. Vous le traduisez en une preuve que vous pouvez cocher sans interpréter.

Sur la liste des 12 stages, le nombre de places restantes se lit sans ouvrir la fiche. Pour un stage où il reste 3 places, on voit 3, nettement, avant de voir le reste. Le prix 45 € est toujours là. Le plafond reste 8. Un stage complet ne laisse pas croire qu'il reste de la place.

Vous écrivez cette preuve en deux lignes, avant le chat. Vous n'y ajoutez pas « et tant qu'on y est, l'attente » ni « et un meilleur envoi de SMS ». Les 3 absents sont réels. Ils ne transforment pas cette phrase en quatrième incrément. La confirmation visible a déjà son tour, ou l'aura. Aujourd'hui, Léa a parlé de la taille du chiffre.

> [!IMPORTANT]
> L'incrément tient en une preuve : sur la liste, les places restantes se lisent en grand, 45 € et 8 places inchangés. Le reste de Sève ne bouge pas.

# Un fil court

Vous n'enchaînez pas dans le long fil qui a construit la page, le formulaire et le déploiement. Ce fil est plein de décisions anciennes. L'agent s'y raccroche et « améliore » l'application. Vous ouvrez un fil nouveau.

Le message cite trois choses, pas le roman de l'atelier.

```text
Incrément : places restantes lisibles en grand sur la liste des 12 stages.
Preuve : un stage à 3 places restantes montre 3 sans ouvrir la fiche. 45 € reste affiché. Le plafond reste 8.
Contexte : la vue de liste, et la règle de projet. Pas le formulaire, pas l'attente, pas la confirmation.
Ne réécris pas l'application.
```

Vous joignez le fichier de la liste, pas le dépôt. La règle rappelle 8 et 45 € pour que « en gros » ne devienne pas « 10 places, c'est plus lisible ». Si l'agent pose une question hors de ce cadre, vous répondez par la preuve, pas par un nouveau sujet.

```diagram
type: flow
title: "De la phrase de Léa au diff"
loop: "Si le diff sort de la liste, on refuse et on resserre le fil"
steps:
  - title: "Phrase"
    text: "« Les places restantes, en gros »"
    tone: amber
  - title: "Preuve"
    text: "Un 3 lisible sur la liste, 45 € et 8 inchangés"
    tone: violet
  - title: "Fil court"
    text: "Nouveau fil, fichier de liste, règle citée"
    tone: blue
  - title: "Diff"
    text: "La vue de liste seulement, relu avant d'accepter"
    tone: teal
```

# Montrer le diff

Vous ne répondez pas à Léa par un résumé. Vous ouvrez le diff. Le fichier attendu est celui de la liste. Le chiffre des places restantes change de présence à l'écran : taille, contraste, place dans la ligne. Le calcul, lui, reste « 8 moins les places prises ». S'il devient autre chose, le diff est faux même s'il est joli.

Vous rejetez le diff s'il touche le formulaire de réservation, l'ordre de l'attente, la règle de 18 h, ou s'il remplace la page par une nouvelle application. « J'en ai profité pour simplifier » est le signe que le fil était trop large, ou que vous avez accepté trop tôt. Vous revenez au message court. Vous redemandez la liste seule.

Un diff d'une vue, que vous pouvez expliquer à Léa en une phrase, est le bon taille. Un diff de douze fichiers pour un chiffre plus grand est une réécriture.

# L'écran, avec ses mots

Vous ouvrez l'aperçu, ou l'URL si c'est elle qu'elle utilise. Vous cherchez un stage à 3 places. Vous vous mettez à la distance où Léa tient le téléphone. Le 3 se voit. 45 € se voit encore. Un stage plein ne montre pas un reste trompeur.

Vous ne jugez pas la classe CSS. Vous jugez la phrase d'origine. Si vous devez plisser les yeux, l'incrément n'est pas fini, même si le diff est petit et propre. Vous le dites dans le même fil court, avec ce que vous voyez : « le 3 est encore plus petit que le prix ». Vous ne rouvrez pas le sujet des SMS.

Puis vous lui montrez, ou vous lui décrivez ce que vous avez vu, pas ce que l'agent a promis. « Sur la liste, le nombre de places restantes est lisible tout de suite. Le prix est toujours 45 €. Huit places, pas une de plus. »

# Ce que vous ne réécrivez pas

Chaque retour de Léa n'est pas une occasion de refaire Sève. Le formulaire qui refuse la 9e place reste le formulaire. L'attente ordonnée jusqu'à 12 reste l'attente. La confirmation, et l'heure de 18 h, restent leur incrément. Le déploiement déjà vérifié ne se relance que si ce diff de liste est vraiment celui que l'URL doit montrer.

Si Léa enchaîne avec une deuxième phrase le même jour, vous la notez. Vous ne la glissez pas dans le diff en cours. Une phrase, un fil, un diff, une vérification. C'est lent sur le moment, et c'est ce qui empêche l'atelier d'avoir trois versions de la page le samedi matin.

> [!TIP]
> Gardez sa phrase d'origine dans le fil. Quand le diff dérive, vous la relisez. « En gros » juge l'écran. Cela ne juge pas l'élégance du code.

# Exercices

## Exercice 1 : Traduire la phrase

Léa écrit seulement : « Je veux voir les places restantes en gros. » Le reste du message parle du four qui chauffe mal. Écrivez la preuve de l'incrément, et dites ce que vous laissez de côté.

<details>
<summary>Voir la solution</summary>

La preuve : sur la liste des 12 stages, un stage à 3 places restantes montre 3, lisible sans ouvrir la fiche. 45 € reste affiché. Le plafond reste 8. Un stage complet ne semble pas encore ouvert.

Vous laissez le four. Vous laissez aussi l'attente, le SMS et la règle de 18 h. Les places restantes existent déjà : vous changez leur présence à l'écran, vous ne reconstruisez pas Sève. Le remplissage de 70 % se lit mieux si le chiffre se voit. Il ne devient pas un nouveau produit.

</details>

## Exercice 2 : Quel fil

Le fil d'hier contient le déploiement, une discussion sur un jeton, et le formulaire des 8 places. Léa vient d'envoyer sa phrase. Où écrivez-vous la demande, et que citez-vous ?

<details>
<summary>Voir la solution</summary>

Vous ouvrez un fil nouveau. L'ancien mélange un secret, qu'il ne fallait déjà pas coller, et des incréments clos. L'agent y reprendrait trop large.

Vous citez le fichier de la liste et la règle (8 places, 45 €, pas de changement de chiffre pour un test). Vous collez la preuve : le 3 lisible, le prix intact. Vous écrivez que le formulaire, l'attente jusqu'à 12 et la confirmation avant 18 h ne font pas partie de la demande.

</details>

## Exercice 3 : Un diff trop large

Le diff agrandit bien le chiffre, et il modifie aussi le formulaire : la 9e place est acceptée « si le nombre affiché est grand ». L'agent parle d'un seul incrément cohérent. Que montrez-vous à Léa ?

<details>
<summary>Voir la solution</summary>

Vous ne lui montrez pas ce diff. Le chiffre en grand peut être le bon geste. Accepter la 9e place contredit le plafond de 8, que Léa n'a pas demandé de changer. « Cohérent » ne remplace pas la preuve.

Vous rejetez le diff. Dans le fil court, vous redemandez uniquement la liste : 3 lisible, 45 €, 8 places, formulaire intact. Vous relirez le nouveau diff, puis l'écran, avant de lui dire que les places restantes se voient en gros.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Une phrase, un diff
center: "« En gros » devient un chiffre lisible sur la liste. On ne réécrit pas Sève pour autant."
points:
  - icon: chat
    title: Sa phrase
    text: "Léa veut les places restantes en grand. Le four, l'attente et le SMS restent dehors."
  - icon: target
    title: La preuve
    text: "Un 3 se lit sur la liste sans ouvrir la fiche. 45 € et 8 places ne bougent pas."
  - icon: file
    title: Fil court
    text: "Nouveau fil. Le fichier de liste et la règle. Pas l'historique du déploiement."
  - icon: git
    title: Diff étroit
    text: "La vue de liste. Si le formulaire ou l'attente change, vous refusez."
  - icon: eye
    title: L'écran
    text: "Vous jugez avec ses mots, à la distance du téléphone, pas avec le résumé du chat."
pitfall: "Continuer dans le long fil et accepter une réécriture parce que le chiffre est devenu plus grand."
remember: "Une phrase, un fil court, un diff de liste, une vérification écran. Ensuite vous répondez à Léa."
```
