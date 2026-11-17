---
title: "Ce qui part avec le prompt"
description: "Un fichier lu par Claude Code entre dans le prompt envoyé au modèle. On vérifie le réglage du compte avant de parler de personnes réelles, et on ne colle pas la liste d'attente."
duration: 50
objectives:
  - "Savoir qu'une lecture de fichier entre dans le prompt envoyé au modèle"
  - "Vérifier le réglage de confidentialité du compte avant de parler de personnes réelles"
  - "Laisser les transcriptions de session à leur place, en local sous ~/.claude/projects"
  - "Travailler avec Camille et « 3 places restantes », sans coller les téléphones"
---

# Une lecture entre dans le prompt

Quand Claude Code lit un fichier, le contenu lu ne reste pas seulement sur le disque. Il entre dans le prompt envoyé au modèle. Sur App Sève, ouvrir le fichier des stages envoie donc dans cette conversation ce que le fichier contient : le samedi, 10 h à 13 h, Lyon Croix-Rousse, 8 places, 45 €. Ouvrir la liste d'attente enverrait aussi les prénoms et les téléphones, s'ils y sont.

Ce n'est pas un deuxième geste mystérieux. La lecture est le geste. Le modèle répond à partir de ce qu'on lui a donné, et un fichier lu fait partie de ce qu'on lui donne. Vous choisissez les fichiers en connaissance de cause. Un export « pour aider la session » est déjà un envoi si la session le lit.

Léa Vernet tient l'atelier. Les 12 stages du mois, le remplissage autour de 70 %, les trois absents dont le SMS a été oublié : ces faits tiennent en quelques mots, sans liste nominative. Le prompt a besoin du métier. Il n'a pas besoin de chaque personne qui attend une place.

> [!IMPORTANT]
> Lire un fichier pour que Claude Code s'en serve, c'est mettre ce fichier dans le prompt. Vous décidez de cette lecture avant, pas après.

# Le dossier de travail se lit sans demande

Les lectures dans le dossier de travail ne demandent pas d'approbation. Claude Code peut ouvrir un fichier de ce dossier, puis continuer. Vous ne verrez pas une question du type « puis-je lire ce tableau ? » à chaque fichier. C'est le fonctionnement ordinaire de la session, pas un oubli de réglage.

La conséquence est directe pour Sève. Si la liste d'attente est dans le dépôt, une demande vague (« regarde les inscrits et dis-moi qui relancer ») peut la faire lire, donc l'envoyer dans le prompt, sans que vous ayez cliqué oui sur cette lecture. Le fichier des stages, lui, est fait pour être lu : horaires, prix, plafond. La liste des téléphones n'est pas du même ordre.

Vous rangez donc la demande. Vous nommez le fichier utile, et vous dites ce qu'il ne faut pas ouvrir. « Lis le fichier des stages. Ne lis pas la liste d'attente. » La session n'a pas à deviner la frontière. L'attente maximale reste 12. Ce chiffre se dit sans dérouler les douze noms.

# Le réglage du compte, avant les personnes

L'usage des conversations pour l'entraînement dépend du réglage de confidentialité du compte. Vous le trouvez sur claude.ai, dans les data privacy controls. Il ne se devine pas depuis le dépôt Sève, et il n'est pas le même sujet que le `.gitignore`. Vous l'ouvrez et vous le lisez avant de faire entrer dans une session des personnes réelles.

Ce chapitre ne fixe pas une durée. Le réglage dit ce que le compte autorise. Vous le vérifiez sur le compte qui lance Claude Code, pas sur un souvenir, pas sur le compte d'une autre personne de l'atelier. Si vous ne l'avez pas regardé, vous ne collez pas de liste nominative « en attendant ».

Les faits de l'atelier, eux, ne sont pas une liste de personnes. 8 places, 45 €, décision avant 18 h la veille, 12 stages, remplissage autour de 70 %, trois absents par mois : cela se dit sans prénom et sans téléphone. Vous pouvez travailler toute une session sur App Sève avec ces seuls éléments.

> [!WARNING]
> « Je vérifierai le réglage plus tard » arrive trop tard si la liste est déjà lue. Le contrôle se fait avant de parler de personnes réelles.

# La transcription reste sur la machine

Les transcriptions de session restent en local, sous `~/.claude/projects`. Le fil que vous venez d'avoir, y compris ce qu'un outil a renvoyé, y laisse une trace sur la machine. Ce n'est pas un coffre à part : c'est le journal de la session, chez vous.

Si un téléphone a été collé dans le prompt, il est dans cette transcription autant que dans la conversation. Effacer le message à l'écran ne retire pas tout seul la ligne du fichier local. La bonne protection est en amont : ne pas donner la liste à lire. Le chemin `~/.claude/projects` vous rappelle où regarder si vous devez vérifier ce qu'une session a déjà vu. Il ne vous invite pas à y déposer la liste d'attente pour « l'avoir sous la main ».

La transcription locale et le prompt envoyé au modèle sont deux faits distincts. L'un est le fichier sur la machine. L'autre est ce que la lecture a inclus dans l'envoi. Les deux comptent. Aucun des deux ne devient une raison de coller les inscrits.

# Camille et trois places restantes

Pour avancer sur la page, vous n'avez pas besoin de la liste. Vous travaillez avec un prénom d'exemple, Camille, et avec la phrase « 3 places restantes ». Camille n'est pas extrait de l'export. C'est un repère pour écrire l'écran : une personne voit qu'il reste des places le samedi. « 3 places restantes » dit le calcul sur 8, sans nommer ceux qui ont déjà pris les cinq autres.

Vous ne collez pas les prénoms et les téléphones de la liste d'attente. Ni dans le message, ni dans un fichier que vous demandez à la session de « résumer », ni dans un essai de SMS « pour voir la formulation ». Les trois absents du mois justifient qu'un rappel existe. Ils ne justifient pas d'envoyer la liste dans le prompt pour rédiger ce rappel.

```text
À dire : Camille voit « 3 places restantes » pour le samedi, 45 €.
À ne pas coller : la liste d'attente, ses prénoms, ses téléphones.
```

Le reste du métier tient sans l'export. Attente maximale 12. Décision avant 18 h la veille. Stage de 10 h à 13 h à Lyon Croix-Rousse. Douze stages dans le mois. Remplissage autour de 70 %. App Sève se construit sur ces phrases.

# Ce que la session peut encore lire

Tout n'est pas interdit. Le fichier qui décrit les stages, avec le plafond et le prix, est le bon matériau. Un test qui refuse la 9e place aussi. Un texte de page qui dit « 3 places restantes » aussi. Vous relisez la demande : est-ce qu'elle a besoin d'une personne réelle, ou d'un exemple ?

Si la réponse est l'exemple, vous restez sur Camille. Si Léa doit un jour traiter une vraie liste, ce sera une décision à part, après le réglage du compte, et sans coller l'export dans le fil « pour aller vite ». D'ici là, la session produit la page et le refus des places. Elle ne devient pas le carnet d'adresses de l'atelier.

```diagram
type: flow
title: "D'un fichier au travail utile"
steps:
  - title: Lecture
    text: "Dans le dossier de travail, Claude Code lit sans vous redemander."
    tone: blue
  - title: Prompt
    text: "Le fichier lu entre dans le prompt envoyé au modèle."
    tone: violet
  - title: Réglage
    text: "Avant des personnes réelles, on vérifie les data privacy controls du compte."
    tone: amber
  - title: Exemple
    text: "On travaille avec Camille et « 3 places restantes », pas avec les téléphones."
    tone: teal
```

La transcription sous `~/.claude/projects` garde la trace de ce choix. Autant que la trace soit celle de Camille et des 3 places, pas celle de la liste.

# Exercices

## Exercice 1 : L'export sous la main

Pour rédiger le rappel des trois absents, vous êtes tenté de coller dans la session le CSV d'attente, avec les prénoms et les téléphones. Le fichier est dans le dossier de travail. La session peut le lire sans vous le demander. Que faites-vous à la place ?

<details>
<summary>Voir la solution</summary>

Vous ne collez pas le CSV, et vous ne demandez pas à la session de le lire. Une lecture dans le dossier de travail ne demande pas d'approbation, et le fichier lu entre dans le prompt envoyé au modèle. Les prénoms et les téléphones partiraient avec.

Vous travaillez avec Camille et la phrase « 3 places restantes ». Les trois absents expliquent le besoin d'un rappel. Ils ne publient pas la liste dans le fil. Le plafond, le prix et l'heure restent 8 places, 45 €, décision avant 18 h la veille.

</details>

## Exercice 2 : Le réglage pas encore vu

Un collègue dit : « On verra le réglage de confidentialité après la démo. Colle déjà les inscrits, c'est plus concret que Camille. » Vous n'avez pas ouvert le compte. Que répondez-vous ?

<details>
<summary>Voir la solution</summary>

Vous ouvrez d'abord le réglage de confidentialité du compte, sur claude.ai, dans les data privacy controls. L'usage pour l'entraînement en dépend. Tant que vous ne l'avez pas lu, vous ne parlez pas de personnes réelles dans la session.

Camille et « 3 places restantes » suffisent pour la page du samedi. Vous ne remplacez pas cet exemple par la liste, même pour une démo, même si le collègue trouve cela plus concret.

</details>

## Exercice 3 : La transcription

Après une session, vous retrouvez sous `~/.claude/projects` le fil de la session précédente, et vous y voyez un téléphone collé par erreur. Le message a été effacé à l'écran. Que retenez-vous pour la prochaine fois ?

<details>
<summary>Voir la solution</summary>

La transcription de session reste en local sous `~/.claude/projects`. Effacer l'écran ne retire pas, à lui seul, ce que le fichier a déjà enregistré. Un téléphone collé dans le prompt y laisse une trace, en plus d'être parti dans l'envoi au modèle.

La prochaine session ne relit pas la liste d'attente. Elle repart de Camille, des 3 places restantes, et des règles de Léa Vernet : 8 places, 45 €, attente jusqu'à 12, 18 h la veille. Le stage reste celui de Lyon Croix-Rousse, le samedi de 10 h à 13 h.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Ce qui part
center: "Un fichier lu entre dans le prompt. On vérifie le compte, et on travaille avec Camille plutôt qu'avec la liste."
points:
  - icon: cloud
    title: Dans le prompt
    text: "Claude Code envoie au modèle le contenu du fichier qu'il a lu. La lecture est déjà l'envoi."
  - icon: eye
    title: Sans approbation
    text: "Les lectures dans le dossier de travail ne demandent pas d'approbation. Nommez ce qu'il ne faut pas ouvrir."
  - icon: lock
    title: Le réglage
    text: "L'entraînement dépend des data privacy controls, sur claude.ai. On vérifie avant les personnes réelles."
  - icon: file
    title: Transcription locale
    text: "Le fil reste en local sous ~/.claude/projects. Un téléphone collé y laisse une trace."
  - icon: users
    title: Camille
    text: "On travaille avec Camille et « 3 places restantes ». Pas les prénoms ni les téléphones de l'attente."
pitfall: "Coller la liste d'attente, prénoms et téléphones, pour rendre le rappel des absents plus concret."
remember: "Fichier lu, prompt concerné. Réglage vérifié. Camille et 3 places restantes, pas la liste."
```
