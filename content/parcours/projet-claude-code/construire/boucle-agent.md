---
title: "Tenir la boucle lire, modifier, vérifier"
description: "Tenir un tour pour un seul objectif : la session lit, modifie, propose une commande, vous lisez la sortie, et vous collez l'échec s'il est rouge."
duration: 50
objectives:
  - "Formuler un tour comme un seul objectif vérifiable"
  - "Exiger une commande de vérification après la lecture et la modification"
  - "Lire vous-même la sortie, sans la remplacer par un résumé"
  - "Coller l'échec tel quel quand le test est rouge, sans demander de tout réparer"
---

# Un tour, un objectif

Un tour tient en une phrase d'intention. « La page affiche 11 stages, il en faut 12, le samedi de 10 h à 13 h. » Pas trois fonctionnalités. La boucle de l'agent enchaîne lire, agir, vérifier, puis recommencer. Vous gardez un seul objectif à l'intérieur de ce cycle. Vous l'interrompez s'il en commence un second.

L'objectif se reconnaît à sa preuve, celle du découpage. Pour l'incrément 1, c'est la page des 12 stages. Pour l'incrément 2, c'est le refus de la 9e inscription. Un tour qui mélange les deux ne se vérifie plus : une sortie rouge peut venir de l'une ou de l'autre, et la correction touche les deux.

# Lire, modifier, proposer

Sur cet objectif, la session lit les fichiers concernés, les modifie, et propose une commande de vérification. La commande fait partie du tour. Sans elle, vous avez une affirmation.

Vous lisez la commande avant de l'autoriser, comme toute permission. Elle doit montrer l'objectif : un comptage, un refus, un horaire. Une commande qui réécrit des données, envoie un message ou ajoute un paiement n'est pas la vérification d'une liste. Vous la refusez et vous redemandez une commande qui affiche l'état, sans le changer.

> [!IMPORTANT]
> « Ça devrait passer » n'est pas une commande. Vous demandez le texte à lancer, vous l'autorisez si vous l'avez lu, puis vous attendez la sortie.

# Vous lisez la sortie

La sortie revient dans le terminal. Vous la lisez. Vous ne demandez pas « est-ce que c'est vert ? » à la place des lignes. Un résumé peut appeler rouge ce qui est vert, ou l'inverse, en arrondissant 11 à « à peu près 12 ».

Vous cherchez dans la sortie le fait de l'objectif : le nombre de stages, l'horaire, le lieu, le code de sortie. Samedi 10 h-13 h, Lyon Croix-Rousse, 8 places, 45 € affichés. Si ces mots n'apparaissent pas, la commande ne vérifiait pas l'objectif, même si elle s'est terminée sans erreur.

Une sortie utile ressemble à ceci, et c'est elle que vous gardez, pas la phrase qui l'entoure.

```text
stages: 12
horaire: samedi 10 h-13 h
lieu: Lyon Croix-Rousse
places: 8
prix: 45 € affichés
paiement: aucun
```

Si une ligne diffère, le tour n'est pas vert. Vous ne complétez pas le trou de mémoire (« le lieu doit bien être la Croix-Rousse »). Vous collez la ligne qui diffère.

# Coller l'échec, mot pour mot

Si le test est rouge, le message suivant contient l'échec, pas une paraphrase. La commande, le code de sortie, les lignes qui montrent l'attendu et l'obtenu. Vous rappelez l'objectif en une ligne. Vous n'écrivez pas « répare tout ».

```text
La commande a échoué. Sortie collée :
attendu 12 stages, samedi 10 h-13 h
obtenu 11 stages, dont un dimanche 14 h
Objectif inchangé : la liste seulement. Pas le formulaire, pas le paiement.
```

« Répare tout » autorise des éditions hors de l'échec : le formulaire, l'attente, un paiement esquissé la veille, un chiffre de places passé à 10 « pour que le test passe ». L'échec collé garde la cible. 11 contre 12. Dimanche contre samedi. La correction a un bord.

```diagram
type: flow
title: "Un tour, puis la sortie"
loop: "Sortie rouge : on colle l'échec, on garde le même objectif"
steps:
  - title: Objectif
    text: "Une phrase, une preuve. Ici, 12 stages le samedi 10 h-13 h."
    tone: violet
  - title: Lire
    text: "La session ouvre les fichiers qui portent la liste, pas tout le dépôt."
    tone: blue
  - title: Modifier
    text: "L'édition reste dans cet objectif. Vous avez lu la permission."
    tone: amber
  - title: Vérifier
    text: "Une commande proposée, lue, lancée. Vous lisez la sortie vous-même."
    tone: teal
```

# Ce que vous ne résumez pas

« Le compte est un peu à côté » efface le nombre. L'échec collé le garde. Vous faites de même avec une sortie verte : une ligne, recopiée depuis le terminal, pas reformulée. Elle deviendra le « dernier test » du lendemain.

Vous ne demandez pas non plus à la session de décider si l'échec est « assez proche ». Proche de 12, ce n'est pas 12. Proche du samedi, ce n'est pas le créneau de Léa. La boucle s'arrête sur l'observation écrite dans le découpage, pas sur une impression.

# Fermer le tour

Le tour est fini quand l'observation de cet objectif est vraie, ou quand vous stoppez parce que la commande elle-même ne mesure pas la bonne chose. Vous ne chaînez pas « maintenant, la 9e place » dans la même phrase qu'une liste devenue verte, si ce n'était pas l'objectif.

Une liste verte ferme l'incrément 1. L'incrément 2, le refus de la 9e place, ouvrira un autre tour, avec une autre commande : 8 inscriptions tenues, la 9e refusée. L'attente de 12 et la règle des 18 h attendent les leurs. Le paiement n'ouvrira aucun tour.

> [!WARNING]
> Un tour vert sur la liste ne donne pas un blanc-seing pour la suite dans les minutes qui restent. Vous notez la sortie, vous vous arrêtez, vous choisissez l'objectif suivant à froid.

# Exercices

## Exercice 1 : La sortie rouge

La commande se termine en erreur. La sortie dit : attendu 8 places, obtenu 9, et un stage daté du dimanche. On vous suggère d'écrire seulement « répare tout ». Quel message envoyez-vous à la place ?

<details>
<summary>Voir la solution</summary>

Vous collez la commande, l'erreur, et les lignes « attendu 8, obtenu 9 » et « dimanche ». Vous rappelez l'objectif : 8 places, samedi 10 h-13 h, liste seulement.

Vous n'écrivez pas « répare tout ». Cette phrase laisse modifier le formulaire, l'attente ou un paiement pour faire passer le test. L'échec collé borne la correction aux deux écarts affichés.

</details>

## Exercice 2 : Trois objectifs d'un coup

Vous aviez demandé la liste. La session a aussi codé le refus de la 9e place et l'attente, « pour avancer », et propose une seule commande qui mélange les trois. Comment recoupez-vous le tour ?

<details>
<summary>Voir la solution</summary>

Vous ramenez le tour à un objectif : la liste des 12 stages, samedi 10 h-13 h, Croix-Rousse, 8 places, 45 € affichés, sans paiement. Vous demandez une commande qui ne vérifie que cela.

Le refus et l'attente ne se valident pas dans la même sortie. S'ils ont déjà été écrits, vous les laissez de côté pour cette lecture : vous ne les « profitez » pas. Leur preuve viendra dans un tour à eux, après une liste vraie. Vous lisez le diff de ce qui a bougé hors objectif avant d'aller plus loin.

</details>

## Exercice 3 : L'affirmation sans commande

La session annonce : « La liste est correcte, les 12 stages y sont, tu peux me croire. » Aucune commande n'est proposée. Que demandez-vous, et que ne concluez-vous pas ?

<details>
<summary>Voir la solution</summary>

Vous demandez la commande qui affiche le nombre de stages, l'horaire, le lieu, les places et le prix, et vous la lisez avant de l'autoriser. Vous ne concluez pas que l'incrément 1 est tenu.

Quand la sortie arrive, vous la lisez. Si elle montre 12, samedi 10 h-13 h, Lyon Croix-Rousse, 8 places, 45 €, sans paiement, vous copiez cette ligne. Si elle est rouge ou incomplète, vous la collez. « Tu peux me croire » n'entre pas dans la note du soir.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Un tour, une sortie
center: "Un objectif par tour. La session lit, modifie, propose une commande. Vous lisez la sortie. Le rouge se colle."
points:
  - icon: target
    title: Un objectif
    text: "Une phrase qui peut être fausse. La liste, ou le refus, pas les deux dans le même tour."
  - icon: terminal
    title: Une commande
    text: "Après l'édition, une vérification proposée. Vous lisez la commande avant de l'autoriser."
  - icon: eye
    title: La sortie
    text: "Vous lisez le nombre, l'horaire, le code. Un « c'est vert » ne remplace pas les lignes."
  - icon: alert
    title: Coller le rouge
    text: "Commande, erreur, attendu et obtenu. On n'écrit pas « répare tout » à la place."
  - icon: loop
    title: Refermer
    text: "Vert : on note la ligne et on s'arrête. Rouge : même objectif, échec collé, on recommence."
pitfall: "Écrire « répare tout » après un test rouge, et laisser le formulaire ou le paiement entrer dans la correction."
remember: "La sortie du terminal est le fait du tour. On la colle quand elle est rouge, on la copie quand elle est verte."
```
