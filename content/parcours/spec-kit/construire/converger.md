---
title: "Converger jusqu'au code"
description: "Comparer le code aux artefacts avec /speckit-converge, ajouter les tâches manquantes, et refuser celle qui passerait de 8 à 9 places."
duration: 50
objectives:
  - "Comparer le code à la spec, au plan et aux tâches avec /speckit-converge"
  - "Accepter qu'il ajoute des tâches à tasks.md sans réécrire la spec"
  - "Relancer implement puis converge jusqu'au message qui dit que c'est convergé"
  - "Refuser une tâche ajoutée qui change 8 places en 9"
---

# Le code face aux artefacts

Léa Vernet tient Atelier Sève, à Lyon Croix-Rousse. Samedi 10 h-13 h, 8 places, 45 €, attente max 12, décision avant 18 h la veille. 12 stages par mois, remplissage 70 %, 3 absents (SMS oublié). La liste et le refus de la 9e place sont déjà en place. Une ou plusieurs phases de l'attente ont été implémentées, et leur diff a été relu.

`/speckit-converge` se lance dans le chat. Le skill de GitHub Spec Kit compare le code aux artefacts : `spec.md`, `plan.md`, `tasks.md`. Il demande ce qui manque encore pour que le dépôt tienne ce que ces fichiers disent. Il ne raconte pas l'historique git. Il regarde le code tel qu'il est.

La comparaison porte sur la fonctionnalité de `.specify/feature.json`. Un code d'attente jugé contre la spec de la liste des stages donnerait un faux écart, ou en masquerait un vrai.

> [!NOTE]
> Converge regarde le code présent. Il ne remplace pas la relecture du diff, et il ne part pas d'une autre fonctionnalité que celle du fichier.

# Il ajoute des tâches

S'il manque quelque chose, le skill ajoute des tâches à `tasks.md`. Il les écrit en bas, dans une phase nouvelle. Il ne réécrit pas les tâches déjà là. Il ne modifie ni la spec ni le plan. Il n'écrit pas le code de l'application. Finir le travail reste le rôle d'implement.

L'ajout juste, pour Sève : la phrase des 18 h n'est pas à l'écran, alors que la spec la demande. La tâche ajoutée dit de l'afficher, décision de Léa avant 18 h la veille, sans envoi. Autre ajout juste : la page publique ne dit pas « 3 personnes en attente », ou elle montre des téléphones. La tâche ramène le compte, sans numéros.

L'ajout que vous ne gardez pas : « brancher le SMS », « encaisser 45 € », « passer le stage à 9 places ». Ces phrases ne manquent pas à la spec. Elles contredisent le hors-champ ou le principe. Une tâche ajoutée n'a pas raison contre les artefacts. Elle doit les servir.

Vous lisez chaque ligne ajoutée avant de la faire exécuter. Le skill a le droit d'ajouter. Vous avez le devoir de refuser une ligne qui change la règle.

# La boucle

Le chemin se répète. Vous lancez implement sur les tâches ajoutées, vous relisez le diff de ce tour, vous relancez converge.

```text
/speckit-implement
Seulement les tâches ajoutées pour la phrase des 18 h.
```

Puis, quand le diff tient :

```text
/speckit-converge
```

S'il ajoute encore, vous recommencez. Une phrase manquante, puis un compte qui montre encore un numéro, sont deux tours. Vous ne les empilez pas dans un message unique qui dirait « fais tout ce qui reste, sans vous arrêter ».

Implement, au début de chaque tour, relit encore les checklists. Des cases vides le font demander. Il ne coche pas. Vous répondez comme au chapitre précédent : non, tant que le critère n'est pas tenu.

```diagram
type: flow
title: "Jusqu'au message qui dit que c'est convergé"
loop: "S'il ajoute des tâches justes, on relance implement, on relit, on converge encore."
steps:
  - title: Comparer
    text: "Le code est lu contre la spec, le plan et les tâches de la fonctionnalité active."
    tone: violet
  - title: Ajouter
    text: "Ce qui manque devient une tâche en bas de tasks.md. La spec, elle, ne change pas."
    tone: amber
  - title: Refuser
    text: "Une tâche qui passe de 8 à 9 places ne s'exécute pas. Le principe reste 8."
    tone: rose
  - title: Relancer
    text: "Implement fait les tâches justes. Converge revérifie le code."
    tone: teal
```

# Le message qui dit que c'est convergé

Vous vous arrêtez quand le skill dit que c'est convergé. Dans cet état, `tasks.md` n'a pas reçu de nouvelle tâche, et le code couvre la spec : 13e nom refusé, « 3 personnes en attente » sans téléphone, phrase des 18 h, 8 places, 45 € affichés, pas de paiement, pas de SMS, pas de secret.

Tant qu'une phase a été ajoutée en bas du fichier, vous n'y êtes pas. Le message qui liste des manques n'est pas le message final, même s'il a l'air encourageant. Vous exécutez les tâches justes, vous relisez, vous convergez encore.

Un fichier inchangé et un message qui dit que c'est convergé vont ensemble. L'un sans l'autre ne suffit pas. Si le skill annonce que c'est convergé et que vous voyez une phase nouvelle, vous relisez : quelque chose ne tient pas. Si le fichier n'a pas bougé mais que le 13e nom entre encore, vous ne déclarez pas la fin vous-même. Vous relancez, ou vous ouvrez le diff.

> [!IMPORTANT]
> On relance implement, puis converge, jusqu'au message qui dit que c'est convergé. Une phase ajoutée veut dire que ce message n'est pas encore là.

# Huit places ne deviennent pas neuf

Une tâche ajoutée dit : « passer l'atelier de 8 à 9 places, pour coller au code ». Vous la refusez. 8 places est le principe. La 9e place assise est déjà refusée. L'attente accueille jusqu'à 12 noms, elle n'ouvre pas un 9e siège.

Vous ne faites pas exécuter cette tâche. Vous la retirez de `tasks.md`, sinon le prochain implement la prendra dans l'ordre. Vous ouvrez `spec.md`. Si une phrase a dérivé vers 9, vous la corrigez : le nombre redevient 8. Vous ne modifiez pas le principe pour que 9 devienne la règle et que la tâche ait l'air juste.

Le plan suit. S'il disait 9 ou 10, vous le ramenez à 8, puis vous pouvez relancer l'analyse avant de converger encore. La tâche utile, si le code laisse s'asseoir une 9e personne, dit de revenir à 8. Elle ne dit pas d'adopter 9.

# La spec se corrige, le principe tient

Corriger la spec, ici, veut dire la ramener au principe. Pas l'inverse. Le principe de Sève ne se plie pas à une tâche ajoutée, ni à un code qui a déjà dérivé.

Même réflexe si la tâche ajoutée branche le SMS « à cause des 3 absents », ou encaisse les 45 €. Vous la refusez. La spec garde l'envoi et le paiement hors champ. La phrase des 18 h reste une phrase. Le prix reste affiché. Le remplissage de 70 % ne devient pas un argument pour élargir les 8 places.

Ensuite vous relancez `/speckit-converge`. Les tâches qu'il ajoute alors doivent servir le plafond de 12, le compte sans téléphone et l'heure. Vous les faites implémenter, vous relisez le diff, vous convergez, jusqu'au message qui dit que c'est convergé.

> [!WARNING]
> Une tâche qui change 8 en 9 se refuse. On corrige la spec pour qu'elle redise 8. On ne corrige pas le principe pour qu'il dise 9.

# Exercices

## Exercice 1 : Il manque la phrase

Le code refuse le 13e nom et affiche « 3 personnes en attente » sans téléphone. La phrase des 18 h n'est nulle part. `/speckit-converge` ajoute une tâche en bas de `tasks.md` et ne touche pas à la spec. Que faites-vous ensuite ?

<details>
<summary>Voir la solution</summary>

Vous gardez la tâche : elle comble un manque réel. Vous lancez `/speckit-implement` sur elle seule, sans dire d'ignorer les tests. Vous relisez le diff : la phrase dit que Léa tranche avant 18 h la veille, sans SMS et sans paiement.

Puis vous relancez `/speckit-converge`. Vous recommencez tant que le skill ajoute des tâches justes. Vous vous arrêtez au message qui dit que c'est convergé, quand `tasks.md` ne reçoit plus de phase nouvelle.

</details>

## Exercice 2 : La tâche qui passe à 9

Le code a laissé une 9e place assise. Le skill ajoute : « aligner la règle sur le code, 9 places au lieu de 8 ». Il n'a pas modifié la spec, qui dit encore 8. Que refusez-vous, et que corrigez-vous ?

<details>
<summary>Voir la solution</summary>

Vous refusez la tâche. Elle change 8 en 9. Vous la retirez pour qu'implement ne l'exécute pas. Le principe reste 8 places. Vous ne le réécrivez pas pour donner raison à la tâche ou au code.

La spec dit déjà 8 : vous la laissez ainsi. Si une autre phrase de la spec disait 9, vous la corrigeriez, pas le principe. La tâche utile dirait de ramener le code à 8, et de garder le refus de la 9e place. Vous relancez converge après ce rangement.

</details>

## Exercice 3 : Un message trop tôt

Le skill a ajouté deux tâches, dont « brancher le SMS ». Quelqu'un veut quand même écrire que c'est convergé, « parce que l'essentiel est là ». À quoi reconnaissez-vous que le message final n'est pas là ?

<details>
<summary>Voir la solution</summary>

Le message qui dit que c'est convergé n'ajoute pas de tâche. Ici une phase a été ajoutée, donc vous n'y êtes pas. En plus, la tâche SMS se refuse : les 3 absents expliquent la règle des 18 h, ils ne programment pas un envoi.

Vous retirez cette tâche, vous vérifiez que la spec laisse le SMS hors champ, vous faites implémenter seulement ce qui manque vraiment (la phrase, le compte, le 13e nom). Vous relancez converge. Vous attendez le message, avec un `tasks.md` qui n'a pas bougé.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Ajouter, puis relancer
center: "Converge ajoute les tâches manquantes. On relance jusqu'au message qui dit que c'est convergé."
points:
  - icon: scale
    title: Code contre artefacts
    text: "/speckit-converge lit le code face à la spec, au plan et aux tâches. Il ne suit pas l'historique git."
  - icon: list
    title: Il ajoute
    text: "Un manque devient une tâche en bas de tasks.md. Il ne réécrit ni la spec, ni le plan, ni le code."
  - icon: loop
    title: La boucle
    text: "On relance implement, on relit le diff, on converge encore. Une phase ajoutée n'est pas la fin."
  - icon: check
    title: Le message
    text: "On s'arrête quand le skill dit que c'est convergé et que tasks.md ne reçoit plus de tâche."
  - icon: shield
    title: 8 reste 8
    text: "Une tâche qui passe de 8 à 9 places se refuse. On corrige la spec, pas le principe."
pitfall: "Exécuter une tâche ajoutée qui remplace 8 places par 9 pour coller au code."
remember: "Il ajoute, on relance implement puis converge, jusqu'au message. 8 places ne deviennent pas 9."
```
