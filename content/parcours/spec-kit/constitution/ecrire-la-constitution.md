---
title: "Écrire la constitution"
description: "Une fois par projet, dans le chat : /speckit-constitution puis les principes de Sève. On relit .specify/memory/constitution.md. Ni React, ni un nom de paquet."
duration: 50
objectives:
  - "Lancer /speckit-constitution une fois, dans le chat, avec les principes de l'atelier"
  - "Relire le fichier produit avant toute spec de la confirmation"
  - "Retirer un framework ou un nom de paquet s'il s'est glissé dans le texte"
  - "Garder la constitution au niveau du projet, pas au niveau d'une seule fonctionnalité"
---

# Une fois, au début du projet

La constitution s'écrit une fois pour Sève. Pas avant chaque stage, pas avant chaque chapitre, pas pour « relancer » l'agent. Elle fixe les principes. Ensuite les specs s'y mesurent. Vous la produirez dans le chat, puis vous la relirez. Le jour où un principe changera vraiment, un chapitre ultérieur dira comment la rouvrir. Aujourd'hui, vous l'écrivez.

Le projet est Atelier Sève, Lyon Croix-Rousse, Léa Vernet. Samedi 10 h-13 h, huit places, 45 €. Attente maximale de douze, décision avant 18 h la veille. Pas de téléphone sur la page publique. Le serveur refuse la neuvième place. L'application liste déjà les stages. La fonctionnalité qui viendra est la confirmation visible et la liste d'attente ordonnée. Douze stages par mois, remplissage autour de 70 %, trois absents parce que le SMS a été oublié : ce pourquoi éclaire la spec future. Il ne remplace pas les principes.

Vous êtes dans le dépôt initialisé pour Cursor, avec `--integration cursor-agent`. Le terminal a fini son travail d'init. La suite se passe dans le chat.

> [!IMPORTANT]
> Une fois par projet. Le chat reçoit les principes. Le terminal ne reçoit pas la skill.

# La skill, dans le chat

Dans le chat de Cursor, vous invoquez :

```text
/speckit-constitution
```

Vous enchaînez avec les principes, dans le même message. Pas avec une pile. Pas avec « fais la confirmation ». Un message tient en quelques lignes que Léa reconnaîtrait.

```text
/speckit-constitution
Atelier Sève, Lyon Croix-Rousse, Léa Vernet.
Samedi 10 h-13 h. Huit places. 45 €.
Attente ordonnée, 12 noms au plus.
Léa décide avant 18 h la veille.
Pas de téléphone sur la page publique.
Le serveur refuse la neuvième place.
```

La skill écrit le fichier. Elle peut reformuler, ajouter des titres, ranger les phrases. Elle ne doit pas inventer un horaire, un prix, une treizième place. Si le message de départ est complet, le fichier a de quoi rester fidèle. S'il manque le téléphone ou le serveur, le fichier manquera la même chose : vous le verrez à la relecture, pas « plus tard ».

Vous ne lancez pas `/speckit-specify` dans la foulée. La constitution d'abord, relue, puis seulement la spec. Les skills s'appellent une par une, dans le chat. `/speckit-constitution` ne se tape pas dans PowerShell, même si les scripts du projet y vivent, sous `.specify/scripts/powershell/`.

> [!NOTE]
> Le fichier de la skill suit le même rangement que les autres : un dossier sous `.cursor/skills/`, avec un `SKILL.md`. L'invocation, elle, reste le chat.

# Relire le fichier produit

Le fichier produit est :

```text
.specify/memory/constitution.md
```

Vous l'ouvrez vous-même. Vous ne vous fiez pas au résumé du chat qui dit « la constitution est en place ». Vous cherchez les six règles, mot à mot ou à très peu près. Huit places. 45 €. Attente de douze. Décision avant 18 h la veille. Pas de téléphone sur la page publique. Le serveur refuse la neuvième place. Le samedi 10 h-13 h et la Croix-Rousse y figurent aussi.

Vous cherchez ensuite ce qui ne devrait pas y être. Un framework. Un nom de paquet. Une consigne du type « refaire la liste des stages ». Une file sans limite. Un numéro de téléphone « au cas où ». Si une de ces lignes est là, le fichier n'est pas prêt. Vous corrigez avant d'écrire la spec : en relançant la skill avec les principes rectifiés, ou en retirant la ligne étrangère puis en relisant encore. Le résumé du chat ne clôt pas ce passage.

`.specify/feature.json` ne remplace pas cette lecture. Il dira, plus tard, quelle fonctionnalité est active. La constitution, elle, vaut pour tout le projet. Elle n'est pas le dossier de la confirmation. Vous la laissez à cet emplacement.

> [!WARNING]
> « C'est écrit » dans le chat ne prouve pas le fichier. Ouvrez `.specify/memory/constitution.md` et cochez les principes de Léa.

# Ni React, ni un nom de paquet

Le piège habituel est une constitution « utile pour coder ». L'agent y glisse le framework du moment, ou le paquet qu'il préfère pour les dates, les formulaires, les files. Cela se lit comme un principe. Ce n'en est pas un. Léa ne tient pas un atelier React. Elle tient huit places à 45 €.

Si le fichier contient ces noms, vous les enlevez. La règle qui reste est celle de l'atelier. Le plan technique, bien plus tard, pourra nommer une pile. La constitution, non. Vous ne « complétez » pas non plus avec le nom du paquet `specify-cli` : c'est l'outil qui a préparé le dépôt, pas une règle du samedi.

Même traitement pour une phrase trop large. « Offrir une expérience simple » ne se vérifie pas. Vous la remplacez par un principe déjà décidé, ou vous la retirez. Mieux vaut six règles courtes qu'une page que personne ne peut contredire. Trois absents par mois peuvent être rappelés comme contexte. Ils ne deviennent pas un ordre d'afficher « 70 % » sur la fiche du stage.

```diagram
type: sequence
title: "Du message au fichier relu"
actors:
  - Vous
  - Chat
  - Fichier
messages:
  - from: 0
    to: 1
    text: "/speckit-constitution et les principes de Léa"
  - from: 1
    to: 2
    text: "Écrit .specify/memory/constitution.md"
  - from: 0
    to: 2
    text: "Relit les six règles, retire la pile"
```

# Une constitution que Léa reconnaît

Lisez le fichier comme si Léa le tenait entre deux stages. Elle doit y retrouver sa salle et son horaire. Elle ne doit pas y découvrir un outil. Une formulation un peu plus longue que votre message est acceptable, tant que les nombres n'ont pas bougé. Huit reste huit. Douze reste douze. 18 h reste 18 h la veille, pas 18 h le jour même.

Vous vérifiez aussi le sens du refus. « Le serveur refuse la neuvième place » ne doit pas être devenu « l'interface cache le bouton ». Le bouton peut se cacher en plus. Le principe est le refus là où la place est accordée. De même, « pas de téléphone » ne doit pas être devenu « téléphone en petit, en bas ». La page publique n'affiche pas le numéro.

La liste des stages déjà écrite n'a pas à être répétée comme un chantier. Une phrase de contexte suffit : l'application liste les stages et refuse déjà la neuvième place. La constitution ne demande pas de les reconstruire. Elle empêche de les contredire.

> [!TIP]
> Si un nombre a bougé entre votre message et le fichier, vous corrigez le fichier avant toute autre skill. Un huit devenu dix se propage.

# Ensuite, seulement ensuite

Quand le fichier tient, vous vous arrêtez. Vous ne lancez pas la spec dans le même élan « puisque le chat est ouvert ». La constitution est le cadre. La spec de la confirmation visible et de l'attente ordonnée sera le prochain travail, avec son quoi et son pourquoi : trois absents, SMS oublié, décision déjà prise avant 18 h, trace visible dans l'application.

Vous committez le fichier relu, avec le reste du kit, quand vous savez expliquer chaque principe sans regarder le chat. `.specify/memory/constitution.md` fait partie de ce que l'équipe partage. Le pointeur `.specify/feature.json`, lui, reste local : il ne dit pas les principes. Ne le confondez pas avec la constitution au moment du commit.

Le module suivant écrira la spec. Il n'aura pas à réinventer les huit places ni le téléphone. Il les lira dans le fichier que vous venez de tenir.

# Exercices

## Exercice 1 : Le message du chat

Écrivez le message unique que vous collez dans le chat de Cursor pour créer la constitution. Il contient la skill et les principes. Il ne contient pas de pile, ni « fais la confirmation ».

<details>
<summary>Voir la solution</summary>

Le message commence par `/speckit-constitution`, dans le chat, pas dans le terminal. Il porte Atelier Sève, Lyon Croix-Rousse, Léa Vernet, samedi 10 h-13 h, huit places, 45 €, attente ordonnée de douze, décision avant 18 h la veille, pas de téléphone sur la page publique, serveur qui refuse la neuvième place.

Il ne cite ni React, ni un nom de paquet, ni `specify-cli` comme principe. Il ne demande pas encore la spec de la confirmation. C'est une fois pour le projet.

</details>

## Exercice 2 : La relecture

Le chat dit : « Constitution prête. » Le fichier `.specify/memory/constitution.md` parle d'un framework, omet le téléphone, et écrit « environ dix places ». Que faites-vous avant d'invoquer une autre skill ?

<details>
<summary>Voir la solution</summary>

Vous ne continuez pas. Vous ouvrez le fichier produit, pas le résumé. Vous rétablissez huit places, pas « environ dix ». Vous remettez l'absence de téléphone sur la page publique, l'attente de douze, les 45 €, la décision avant 18 h la veille, et le refus de la neuvième place par le serveur.

Vous retirez le framework et tout nom de paquet. Puis vous relisez encore. `/speckit-specify` attendra que ces lignes tiennent.

</details>

## Exercice 3 : Le deuxième lancement du jour

La constitution vient d'être relue, les six règles y sont, sans pile. Un collègue veut relancer `/speckit-constitution` tout de suite « pour faire plus propre », sans qu'aucun principe n'ait changé. Que lui dites-vous ?

<details>
<summary>Voir la solution</summary>

Vous n'y touchez plus aujourd'hui. Elle s'écrit une fois par projet, puis on la relit. Aucun principe n'a changé : huit places, 45 €, attente de douze, 18 h la veille, pas de téléphone, refus serveur de la neuvième place.

Un second passage « pour le style » risque d'introduire un framework ou d'arrondir un nombre. La spec de la confirmation visible et de l'attente ordonnée viendra après, dans une autre skill. Les trois absents et le SMS oublié y auront leur place de pourquoi, pas dans une réécriture cosmétique.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Écrire puis relire
center: "Une fois dans le chat : /speckit-constitution et les principes. Ensuite on relit .specify/memory/constitution.md."
points:
  - icon: chat
    title: Le chat
    text: "La skill se lance dans le chat Cursor. Le terminal a déjà servi pour l'init, pas pour ce texte."
  - icon: book
    title: Les principes
    text: "8 places, 45 €, attente 12, 18 h, pas de téléphone, le serveur refuse la 9e place."
  - icon: eye
    title: La relecture
    text: "Ouvrez .specify/memory/constitution.md. Le résumé du chat ne tient pas lieu de fichier."
  - icon: shield
    title: Sans pile
    text: "Ni React, ni un nom de paquet, ni specify-cli comme règle de l'atelier."
  - icon: check
    title: Une fois
    text: "On ne relance pas la skill le jour même pour faire plus propre. On passe à la spec après."
pitfall: "Croire le résumé du chat, ou laisser un framework et un nombre arrondi dans le fichier produit."
remember: "Dictez les principes dans le chat, une fois. Relisez constitution.md. Retirez la pile avant toute spec."
```
