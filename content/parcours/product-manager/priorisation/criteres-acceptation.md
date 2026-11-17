---
title: "Des critères qui prouvent la fin"
description: "Écrire des critères en donné, quand, alors, couvrir le cas limite, et dire ce qui prouve qu'un incrément Halte est fini."
duration: 55
objectives:
  - "Rédiger un critère en donné, quand, alors, qu'on peut rejouer"
  - "Nommer le cas limite ou le laisser explicitement dehors"
  - "Dire quelle preuve, observée, montre que c'est fini"
  - "Refuser l'adjectif qui ne se constate pas"
---

# Donné, quand, alors

Un critère d'acceptation se rejoue. Il ne se ressent pas. La forme **donné / quand / alors** oblige à écrire le décor, le geste, et ce qu'on voit.

**Donné** Villeneuve, samedi 8 mars, magasin qui ferme à 19 h, signal connu à 17 h 10 : le camion ne passe pas avant 19 h.

**Quand** Karim consulte avant 17 h 30, et quand un client s'apprête à payer une commande liée à cette arrivée.

**Alors** Karim voit non. Il n'a pas à appeler pour le savoir. Le client ne se voit pas proposer 19 h comme heure précise. Il voit un créneau large. Inès, si elle ouvre le dossier, lit « après fermeture », mot de la liste courte.

Chaque alors se constate. On voit l'écran de Karim, l'écran du client, le mot d'Inès. On ne voit pas « une meilleure expérience ». Trois critères nets valent mieux que douze adjectifs.

Vous les écrivez avec ceux qui les vivront, avant qu'Hugo ne commence. Inès relit le motif. Karim relit le oui ou non, parce que c'est lui qui gardera ou non Lina. Un critère découvert pendant la construction n'est pas un détail. C'est une règle qui n'était pas décidée.

> [!IMPORTANT]
> Si vous ne pouvez pas dire oui ou non sur un samedi nommé, le critère n'est pas écrit. Il est encore un souhait.

# Le cas qui casse la règle

La règle est simple jusqu'au premier samedi qui ne rentre pas. Vous en écrivez peu, ou vous écrivez qu'ils sont dehors.

**Signal à 18 h 45.** La décision de 17 h 30 est passée. Le signal tardif ne retourne pas le non en oui, et ne rend pas au client une heure précise. Si vous ne l'écrivez pas, quelqu'un « mettra à jour » le soir, et deux clients du même samedi auront vu deux promesses.

**Pas de signal du tout.** Huit transporteurs n'exposent rien. Pour un pilote dont le transporteur, ce jour-là, n'a pas de signal à 17 h 30, on n'invente pas 19 h. On affiche le créneau large, motif « pas de signal ». Inventer l'heure pour « respecter le 1er septembre » est le cas limite qui casse le produit.

**Le samedi où le camion est déjà passé à 15 h.** La décision de garder quelqu'un ne se pose pas. Le critère ne se rejoue pas sur ce samedi-là. Vous ne le comptez pas comme une preuve. Vous attendez un samedi où le doute existe, deux à trois fois par mois.

**Dimanche, ou magasin qui ferme à 21 h.** Dehors pour cette histoire. Les nommer évite qu'on les joue comme des échecs.

Le quinzième cas inventé au siège n'entre pas. Vous le noterez s'il arrive à Villeneuve.

```diagram
type: flow
title: "Du cas limite à une phrase"
steps:
  - title: Le cas arrive
    text: "Signal à 18 h 45, aucun signal, camion déjà passé, dimanche."
    tone: amber
  - title: Il casse la règle
    text: "Deux lectures honnêtes donnent deux promesses."
    tone: rose
  - title: On le place
    text: "Dans un donné / quand / alors, ou dans le hors périmètre."
    tone: teal
  - title: On s'arrête
    text: "Le cas imaginé au siège n'entre pas pour faire complet."
    tone: blue
```

# Ce qui prouve que c'est fini

« Fini » n'est pas « l'équipe a beaucoup travaillé ». Pour cette histoire, la preuve est courte.

- Sur Villeneuve, ou une répétition fidèle du 8 mars, Karim voit non avant 17 h 30, sans appeler.
- Le client ne voit pas 19 h. Il voit le créneau large.
- Inès lit « après fermeture » sans rappeler le magasin.
- Le signal de 18 h 45 ne retourne pas la décision, si c'est la règle écrite.
- Le cas sans signal affiche le créneau large, pas une heure inventée.

Une capture choisie ne suffit pas. « Ça marche de mon côté », dit par Hugo, non plus : il n'est pas à 17 h 20. Le critère dit ce qui doit être vrai. La preuve dit comment on l'a vu. « Les vérifications sont vertes » ne dit pas quel samedi a été rejoué.

Un cas nouveau le jour de la démo n'invalide pas l'incrément s'il était hors périmètre. Il l'invalide s'il était écrit et qu'il échoue.

# Un adjectif n'est pas un critère

| On a écrit | Pourquoi ça ne prouve rien | On écrit à la place |
|---|---|---|
| L'expérience est fluide | Deux personnes ne voient pas la même chose | Karim voit non, le client ne voit pas 19 h |
| Le magasin est satisfait | Aucun samedi n'est décrit | Il n'appelle pas pour savoir |
| Le motif est clair | « Clair » dépend de qui lit | Inès lit « après fermeture » |
| C'est prêt pour les quarante | Les quarante ne sont pas l'histoire | Le cas est rejoué sur un pilote |

Quand vous tenez à un adjectif, demandez : quel samedi, quel écran, quelle phrase au téléphone. La réponse est le critère. Dix critères flous coûtent plus cher, le jour de la démo, que trois critères nets : on ne sait plus lequel a échoué.

> [!WARNING]
> « On sent que c'est mieux » n'est pas une preuve. Si Karim voit encore une heure précise alors que le signal dit non, l'incrément n'est pas fini.

# Exercices

## Exercice 1 : Réécrire l'adjectif

On vous rend : « le parcours est fluide », « le responsable est rassuré », « le motif est compréhensible ». Réécrivez-les en donné / quand / alors pour le samedi 8 mars.

<details>
<summary>Voir la solution</summary>

Donné Villeneuve, samedi, fermeture à 19 h, signal à 17 h 10 : le camion ne passe pas avant 19 h. Quand Karim consulte avant 17 h 30, alors il voit non, sans avoir à appeler.

Donné le même signal. Quand le client paie, alors il ne voit pas 19 h comme heure précise. Il voit un créneau large.

Donné le même dossier. Quand Inès l'ouvre, alors elle lit « après fermeture », mot de la liste courte, sans rappeler le magasin.

Si elle préfère un autre mot, vous le changez dans le critère avant de commencer. Vous ne gardez pas « compréhensible ».

</details>

## Exercice 2 : Le signal de 18 h 45

À 18 h 45, un signal dit que le camion passera finalement avant 19 h. Un directeur veut que l'heure précise se rouvre « pour ne pas perdre la soirée ». Les critères ne parlent pas de ce cas. Que décidez-vous avant de construire ?

<details>
<summary>Voir la solution</summary>

Vous ne laissez pas le cas se décider en construisant. Pour cette histoire, la décision de 17 h 30 tient : ce qui était non le reste. Le client de 17 h 15 ne doit pas avoir vu l'inverse du client de 18 h 50.

La réouverture est une autre histoire, plus tard, quand la règle simple est tenue. La mettre maintenant, c'est deux promesses le même soir. Vous l'écrivez en cas limite, pas en optimisation glissée.

</details>

## Exercice 3 : La preuve du vendredi

Vendredi, Hugo montre une capture où Karim voit non. Inès n'a pas lu le motif. Le cas « pas de signal » était dans les critères, et personne ne l'a rejoué. Acceptez-vous ?

<details>
<summary>Voir la solution</summary>

Non. Une capture ne rejoue pas le samedi. Le motif est un alors : s'il n'a pas été lu, la preuve manque. Le cas sans signal était écrit, donc son absence laisse « fini » sans réponse.

Vous dites quels cas restent à rejouer. Un cas qui n'était pas dans les critères ne sert pas à refuser. Ici, l'absence de signal était dedans. L'incrément attend la preuve.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Un critère se rejoue
center: "Donné, quand, alors. Le cas limite est écrit ou dehors. Fini se prouve sur un samedi, pas sur un adjectif."
points:
  - icon: list
    title: Trois mots
    text: "Villeneuve, signal à 17 h 10, Karim voit non, le client n'a pas 19 h, Inès lit le motif."
  - icon: alert
    title: Cas limite
    text: "18 h 45, aucun signal, camion déjà passé. Deux lectures honnêtes veulent dire que la règle manque."
  - icon: eye
    title: La preuve
    text: "On rejoue le samedi. Une capture et « ça marche de mon côté » ne suffisent pas."
  - icon: filter
    title: Dehors
    text: "Dimanche, magasin qui ferme à 21 h : nommés. Ils ne servent pas à refuser s'ils n'étaient pas dus."
  - icon: check
    title: Fini
    text: "Les alors tiennent. Dix adjectifs ne remplacent pas trois cas qu'on peut constater."
pitfall: "Accepter vendredi sur une belle capture, pendant que le cas sans signal, pourtant écrit, n'a pas été rejoué."
remember: "Un critère dit oui ou non sur un samedi nommé. Fini, c'est ce samedi rejoué, pas une impression."
```
