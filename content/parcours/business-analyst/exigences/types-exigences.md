---
title: "Les types d'exigences"
description: "Distinguer exigence métier, fonctionnelle, non fonctionnelle, contrainte et règle, et n'écrire qu'une exigence par phrase."
duration: 60
objectives:
  - "Ranger une phrase de réception dans le bon type"
  - "Écrire une seule exigence par phrase, avec un identifiant stable"
  - "Empêcher une contrainte ou une règle de se déguiser en souhait"
  - "Garder le moyen et la roadmap hors de la phrase d'exigence"
---

# Cinq questions, cinq types

Une exigence de Halte Marché est une phrase que l'on peut valider et recetter. Le type dit quelle question elle pose. Mélanger les types, c'est demander à Jonas de signer un délai, un droit d'accès et une interdiction de changer de caisse dans le même souffle.

Cinq questions suffisent.

| Type | Question | Exemple de réception | Identifiant |
| --- | --- | --- | --- |
| Métier | Quel résultat l'enseigne constate-t-elle ? | Le frais du lundi en moins de 4 heures | EM |
| Fonctionnelle | Que peut faire un rôle ? | Enregistrer la palette avant le départ du chauffeur | EF |
| Non fonctionnelle | Dans quelles conditions de service cela tient-il ? | Les 40 magasins le lundi matin | ENF |
| Contrainte | Quelle limite n'est pas à rediscuter dans ce besoin ? | Le bon de l'entrepôt reste la pièce de référence | CON |
| Règle | Quel cas donne un oui ou un non métier ? | Surgelé au-dessus de -18 °C : refus | REG |

Le type n'est pas un ornement. Il dit qui relit en premier. Jonas relit EM et REG. Nina relit toutes, avec un critère. Omar relit ENF, parce que le volume et la coupure sont sa question. Hugo ne relit pas pour changer le type : il regarde si la phrase validée tient dans un calendrier. Sarah ne transforme pas une EM en fonctionnalité de roadmap. Une exigence métier peut être tenue par une procédure.

Vous posez la question avant de choisir le préfixe. « Yassine doit cliquer sur refus » a l'air fonctionnelle. Elle a déjà choisi l'écran. La fonctionnelle propre est : l'équipier enregistre le refus, avec un motif, avant le départ. Le clic viendra, ou ne viendra pas.

# Métier et fonctionnelle

**L'exigence métier** parle du résultat que Jonas suit ou qu'il accepte de protéger. Elle ne parle pas du geste détaillé.

- EM-01 : « Le lundi, le frais accepté est en rayon en moins de 4 heures après la fin du déchargement. »
- EM-02 : « Chaque écart entre le bon et la quantité acceptée est tracé le jour même, avec un motif. »

EM-01 bouge le délai. EM-02 bouge la part non tracée des écarts. Aucune des deux ne dit si l'outil s'appelle Quai. Aucune ne dit qui a le droit de corriger le soir. Si vous ajoutez « grâce au terminal », vous avez quitté le métier pour un moyen.

**L'exigence fonctionnelle** parle de ce qu'un rôle peut faire dans le processus. Elle a un acteur et un moment.

- EF-01 : « L'équipier réception enregistre l'acceptation, le refus ou la mise de côté de chaque palette avant le départ du chauffeur. »
- EF-02 : « La cheffe de rayon frais consulte, avant 10 h, les refus frais du matin et leur motif. »

EF-01 sert Yassine et Thomas. EF-02 sert Claire. Elles rendent EM-01 et EM-02 possibles. Elles ne les remplacent pas. On peut enregistrer vite et mettre le frais en rayon en 6 heures : EF-01 serait tenue, EM-01 non. On peut avoir le frais en rayon à temps et aucun motif : EM-01 tenue, EM-02 non. C'est pour cela que les phrases restent séparées.

Le test de la fonctionnelle : retirez l'outil. Si la phrase tient encore, elle est bonne. « L'équipier enregistre » tient. « L'équipier ouvre l'écran 3 du terminal Quai » ne tient pas : c'est un scénario d'outil, utile plus tard à Nina si Sarah a choisi ce moyen, inutile comme exigence tant que 7 magasins n'ont pas cet écran.

# Non fonctionnelle, contrainte, règle

**L'exigence non fonctionnelle** dit à quelles conditions de service le geste reste possible. Elle ne crée pas un nouveau résultat métier. Elle empêche le résultat d'être vrai seulement le mardi calme.

- ENF volumes, en une phrase : « Le lundi de 5 h 30 à 9 h 30, les 40 magasins peuvent enregistrer en même temps leurs palettes, soit 1 440 palettes sur la plage. »

Le détail du délai de saisie, des droits et de la coupure viendra dans le chapitre qui leur est consacré. Ici, vous retenez le type : la phrase parle de charge, de temps de réponse, de droit ou de disponibilité, avec une source. Un « le système doit être rapide » sans le lundi et sans les 40 magasins n'est pas de ce type. C'est un adjectif.

**La contrainte** est une limite que le besoin ne choisit pas. Elle se constate. On ne la recette pas comme un rêve. On vérifie qu'aucune exigence ne la casse.

- CON-01 : « Le bon de livraison de l'entrepôt reste la pièce de référence des quantités annoncées. »
- CON-02 : « L'éditeur de caisse ne change pas dans ce besoin. »

CON-02 explique pourquoi Pauline corrige encore dans l'outil actuel le soir. Elle interdit de glisser « changer la caisse » dans une fonctionnelle pour faire propre. Si Amina voulait changer d'éditeur, ce serait un autre cap, une autre décision, pas une ligne cachée ici. Sarah a d'ailleurs d'autres sujets sur l'outil magasin. La contrainte protège le périmètre du besoin. Elle ne lui donne pas un moyen.

**La règle de gestion** dit oui ou non sur un cas métier. Elle se joue sur une palette précise.

- REG-01 : « Un surgelé dont la température à cœur dépasse -18 °C est refusé. »
- REG-02 : « Un frais dont la vie restante est inférieure à 2 jours ne va pas en rayon. »

La photo d'existant a montré que neuf magasins pratiquent -15 °C et que Rouen met en rayon des DLC courtes. La règle écrite n'est donc pas l'existant. Quand vous la spécifiez, le statut dit si Jonas l'a validée comme cible. Une règle non tranchée reste en analyse. Vous n'écrivez pas « environ -18 °C » pour garder tout le monde d'accord.

> [!WARNING]
> Une règle floue se recette toujours en succès : chacun apporte son seuil. Le degré, le nombre de jours, le motif font partie de la phrase.

# Une phrase, et rien d'autre

Le geste d'écriture est sévère. Une phrase, une exigence, un type, un identifiant. Si vous avez besoin de « et », vous avez souvent deux exigences.

Phrase refusée : « Le frais est en rayon en moins de 4 heures et Yassine enregistre le refus et le système répond vite le lundi. »

Trois types s'y cachent : métier, fonctionnelle, non fonctionnelle. Vous les séparez. Chacune aura son critère. Chacune pourra échouer seule.

Phrase refusée encore : « Il est interdit de changer la caisse afin que le frais aille plus vite en rayon. » La contrainte et le résultat n'ont pas le même destin. CON-02 peut rester vraie pendant que EM-01 échoue. Les lier par « afin que » invente une causalité que Jonas n'a pas mesurée.

Vous numérotez sans trou volontaire. EM-01 et EM-02 sont les deux résultats. Si EM-02 est abandonnée, l'identifiant n'est pas réattribué à une autre phrase. Nina et le suivi perdraient la trace. Le statut abandonnée suffit.

Le propriétaire suit le type, avec du jugement. Jonas possède EM et REG, parce que le résultat et la règle sont le métier. Il possède aussi EF, tant que le geste quai n'a pas été donné à quelqu'un d'autre : Yassine exécute, Jonas signe le geste attendu. Omar ne possède pas ENF. Il dit si elle est tenable. Le propriétaire reste Jonas, ou Amina si la condition de service devient un cap (par exemple « tenir les 40 magasins dès le premier lundi »). Vous possédez la forme : type juste, phrase unique, identifiant stable, source vers la photo.

```diagram
type: layers
title: "Cinq types, du résultat jusqu'à la limite"
layers:
  - title: "Métier"
    text: "Le résultat que Jonas constate. EM-01, EM-02."
    items:
      - "Moins de 4 h pour le frais accepté"
      - "Écart tracé le jour même"
  - title: "Fonctionnelle"
    text: "Ce qu'un rôle peut faire. EF-01, EF-02."
    items:
      - "Enregistrer avant le départ"
      - "Voir les refus frais avant 10 h"
  - title: "Non fonctionnelle"
    text: "Le service tient au pic, avec des droits."
    items:
      - "40 magasins, 1 440 palettes"
  - title: "Règle"
    text: "Oui ou non sur une palette. REG-01, REG-02."
    items:
      - "-18 °C, refus"
      - "Moins de 2 jours, pas de rayon"
  - title: "Contrainte"
    text: "Limite non choisie dans ce besoin."
    items:
      - "Le bon fait foi"
      - "L'éditeur de caisse ne change pas"
```

# Exercices

## Exercice 1 : Ranger cinq phrases

On vous tend cinq lignes. Donnez le type de chacune, sans réécrire tout le dossier.

1. « Le lundi, le frais accepté est en rayon en moins de 4 heures après la fin du déchargement. »
2. « L'équipier enregistre le refus avant le départ du chauffeur. »
3. « Un surgelé au-dessus de -18 °C est refusé. »
4. « L'éditeur de caisse ne change pas dans ce besoin. »
5. « Les 40 magasins enregistrent pendant le pic du lundi. »

<details>
<summary>Voir la solution</summary>

1 est métier : c'est le résultat de Jonas sur le délai. 2 est fonctionnelle : un rôle, un geste, un moment. 3 est une règle : oui ou non sur une palette. 4 est une contrainte : limite de périmètre, pas un rêve à atteindre. 5 est non fonctionnelle : elle parle du volume et du moment de charge, pas d'un nouveau résultat en rayon.

Vous ne fusionnez pas 1 et 2. Le frais peut être en rayon sans enregistrement, et l'enregistrement peut exister avec un délai de 6 heures. Deux phrases, deux critères.

</details>

## Exercice 2 : Le « et »

Pauline propose : « La directrice corrige le stock le soir et chaque écart a un motif et la caisse reste la même. » Combien d'exigences se cachent ici, et laquelle n'est pas une correction du soir ?

<details>
<summary>Voir la solution</summary>

Trois matières. Le motif de l'écart est EM-02, exigence métier : tracer le jour même. « La caisse reste la même » est CON-02, contrainte. « La directrice corrige le soir » décrit l'existant, le contournement, pas la cible. En faire une exigence figerait le pansement.

Vous réécrivez au plus EM-02 et CON-02, chacune en une phrase, si elles ne sont pas déjà au dossier. Vous ne validez pas le droit de corriger sans motif. Si un droit distinct (qui a le droit de corriger) est nécessaire, ce sera une non fonctionnelle de droits, encore une autre phrase, pas un troisième « et ».

</details>

## Exercice 3 : Environ -18

Pour ne fâcher ni le siège ni Marc Esteban, on vous demande d'écrire : « Le surgelé trop chaud est en principe refusé, autour de -18 °C, selon le magasin. » Pourquoi cette phrase n'est-elle d'aucun type utilisable ?

<details>
<summary>Voir la solution</summary>

Elle n'est pas une règle : « trop chaud », « en principe », « autour de », « selon le magasin » empêchent le oui ou le non. Nina ne peut pas jouer -16 °C. Elle n'est pas non plus l'existant, qui distingue clairement -18 °C écrit et -15 °C pratiqué dans neuf magasins.

Vous laissez REG-01 en analyse tant que Jonas n'a pas tranché le degré, avec Amina si la région s'y oppose. Vous n'inventez pas un type « compromis ». Une règle a un seuil. Sans seuil, il n'y a pas de phrase, donc pas d'identifiant à faire passer pour validé.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Les types d'exigences"
center: "Le type dit la question. Une phrase porte une exigence, pas un discours."
points:
  - icon: target
    title: "Métier"
    text: "Le résultat de Jonas. Moins de 4 h pour le frais. L'écart tracé le jour même."
  - icon: check
    title: "Fonctionnelle"
    text: "Un rôle, un geste, un moment. Enregistrer avant le départ. Voir les refus avant 10 h."
  - icon: gauge
    title: "Non fonctionnelle"
    text: "La charge, le délai, les droits, la disponibilité. Les 40 magasins le lundi matin."
  - icon: scale
    title: "Règle"
    text: "Oui ou non. -18 °C, refus. Moins de 2 jours de vie, pas de rayon."
  - icon: lock
    title: "Contrainte"
    text: "Le bon fait foi. L'éditeur de caisse ne change pas. On vérifie qu'on ne la casse pas."
  - icon: filter
    title: "Une phrase"
    text: "Si vous avez besoin de « et », vous avez souvent deux exigences à séparer."
pitfall: "Écrire autour de -18 °C, selon le magasin, et appeler cela une règle pour garder la paix."
remember: "Cinq types, cinq questions. L'identifiant abandonné ne se recycle pas. Le moyen reste hors de la phrase."
```
