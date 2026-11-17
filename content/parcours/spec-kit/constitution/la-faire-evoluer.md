---
title: "Faire évoluer la constitution"
description: "On rouvre la constitution seulement si un principe de Sève change. Un test qui bloque ne suffit pas. Les specs déjà écrites se relisent contre le nouveau principe."
duration: 50
objectives:
  - "Rouvrir la constitution seulement quand un principe de l'atelier change"
  - "Refuser une réécriture dont le but est de faire passer un test"
  - "Relire les specs déjà écrites à la lumière du principe nouveau"
  - "Laisser en place les règles que Léa n'a pas modifiées"
---

# On la rouvre si un principe change

La constitution de Sève est écrite et relue. Elle vit dans `.specify/memory/constitution.md`. Vous n'y revenez pas pour changer un mot, ni parce qu'une skill a échoué, ni parce qu'un test est rouge. Vous y revenez quand un principe change : une règle de l'atelier n'est plus celle que le fichier énonce.

Le reste du cadre demeure sous vos yeux, pour ne pas le perdre en route. Léa Vernet, Lyon Croix-Rousse. Samedi 10 h-13 h. Huit places, 45 €. Attente ordonnée, douze noms au plus, tant que Léa n'a pas dit autre chose. Décision avant 18 h la veille. Pas de téléphone sur la page publique. Le serveur refuse la neuvième place. Douze stages par mois, remplissage autour de 70 %, trois absents parce que le SMS a été oublié. L'application liste déjà les stages. La fonctionnalité du parcours reste la confirmation visible et la liste d'attente ordonnée.

Un changement de principe est une décision de Léa, dite explicitement. Ce n'est pas une préférence de l'agent, ni une envie de « simplifier le code ». Vous la notez, vous rouvrez la constitution, vous relisez le fichier, puis vous relisez les specs déjà écrites.

> [!IMPORTANT]
> On rouvre la constitution pour un principe qui a changé. Pas pour débloquer un test, pas pour débloquer une skill.

# L'attente passe de 12 à 10

L'exemple de ce chapitre est net. Léa décide que l'attente s'arrête à dix noms, plus à douze. La salle reste à huit places. Le prix reste 45 €. L'heure de décision reste 18 h la veille. Le téléphone reste hors de la page. Le serveur continue de refuser la neuvième place. Un seul principe bouge.

Vous retournez dans le chat, pas dans le terminal :

```text
/speckit-constitution
Même atelier, même salle. L'attente ordonnée s'arrête maintenant à 10 noms.
Huit places, 45 €, samedi 10 h-13 h, décision avant 18 h la veille.
Pas de téléphone sur la page publique.
Le serveur refuse la neuvième place.
```

Vous rouvrez ensuite `.specify/memory/constitution.md`. Vous y cherchez dix, pas douze, pour l'attente. Vous vérifiez que les autres nombres n'ont pas été « harmonisés » au passage. Un agent zélé pourrait passer la salle à dix places pour faire simple. Ce serait un second principe, que Léa n'a pas pris. Vous l'annulez dans le fichier.

La branche Git ne fait pas cette mise à jour. `.specify/feature.json` non plus : il désigne la fonctionnalité active, il ne contient pas les principes. Le texte à faire évoluer est la constitution. Si l'extension Git a créé une branche `001-nom`, elle ne remplace pas cette relecture.

> [!WARNING]
> Changer l'attente de 12 à 10 ne change pas les huit places. Vous relisez chaque nombre, pas seulement celui que vous vouliez modifier.

# Un test rouge n'est pas un principe

Un test échoue. La phrase de confirmation n'a pas le mot attendu. La couleur d'un bandeau ne plaît pas au test. L'ordre des noms dans la file est inversé dans le code. Aucune de ces pannes n'est une raison de réécrire la constitution.

Le test dit quelque chose sur le code, ou sur la spec, ou sur le test lui-même. Vous corrigez à cet étage. Si le test exige encore douze noms alors que Léa est passée à dix, le test est en retard sur le principe : vous le mettrez à jour après avoir relu la spec, pas en ramenant la constitution à douze pour obtenir du vert. Si le test échoue alors que les principes n'ont pas bougé, la constitution reste fermée.

Même refus quand l'agent propose d'ajouter un framework « pour que le test passe ». La constitution n'accueille ni React, ni un nom de paquet, ni `specify-cli`. Un test bloqué ne crée pas une exception. Vous gardez le fichier au métier de l'atelier.

```diagram
type: decision
title: "Faut-il rouvrir la constitution ?"
nodes:
  - question: "Un principe de Léa a-t-il changé ?"
    yes: "Rouvrir dans le chat, relire le fichier, puis relire les specs"
    no: "Laisser la constitution. Corriger le test, la spec ou le code"
```

# Les specs déjà écrites se relisent

La constitution nouvelle ne réécrit pas les specs toute seule. Les documents déjà produits, dans le dossier que désigne `.specify/feature.json`, parlent encore de l'ancien principe. Après le passage de douze à dix, vous les rouvrez un par un.

Vous y cherchez « 12 » là où il voulait dire la taille de l'attente. La spec de la liste ordonnée doit maintenant s'arrêter à dix. Une spec de la confirmation visible peut ne citer que la place accordée : vous la relisez quand même, au cas où elle promettrait une file de douze « en dessous ». Le plan et les tâches, s'ils existent déjà, suivent le même passage. Une ligne qui fabrique encore une attente de douze est fausse, même si elle était juste hier.

Vous ne profitez pas de cette relecture pour changer autre chose. Le pourquoi des trois absents, le SMS oublié, le remplissage autour de 70 %, les douze stages du mois : tout cela reste, sauf si Léa a aussi changé ces faits. Douze stages par mois n'est pas l'attente de douze noms. Le mot « douze » apparaît deux fois dans l'atelier, pour deux idées. Vous ne les écrasez pas ensemble.

> [!NOTE]
> Relire une spec contre le nouveau principe, c'est y chercher l'ancienne règle. Ici, une attente de 12 devenue 10. Le reste se vérifie, il ne se réinvente pas.

# Ce qui reste en place

Après la modification, la liste stable est celle-ci. Vous la tenez à côté du fichier, pour voir ce qui n'avait pas le droit de bouger.

- Huit places, et le serveur qui refuse la neuvième.
- 45 €, samedi 10 h-13 h, Croix-Rousse.
- Décision de Léa avant 18 h la veille.
- Pas de téléphone sur la page publique.
- La liste des stages déjà en place dans l'application.
- La fonctionnalité : confirmation visible, attente ordonnée, désormais jusqu'à dix.

L'attente est le seul principe modifié dans l'exemple. La confirmation doit toujours se voir dans l'application, parce que trois personnes par mois manquent encore à cause d'un SMS oublié. Passer la file de douze à dix ne publie pas le téléphone, et ne crée pas une neuvième chaise « le temps de la transition ».

Si vous avez un doute sur un chiffre du fichier, vous demandez à Léa, vous n'arrondissez pas. Dix est une décision. « Une petite dizaine » n'en est pas une. Le chat reformule parfois. Votre relecture remet le nombre exact.

> [!TIP]
> Écrivez l'ancien nombre et le nouveau sur une ligne, avant de lancer la skill. « Attente : 12 devient 10. Le reste inchangé. » Vous relisez contre cette ligne.

# L'ordre du geste

Le geste complet, quand Léa change un principe, tient dans un ordre court. Le sauter d'une marche laisse une spec ancienne au milieu d'une constitution nouvelle. Les skills suivantes croiront les deux.

1. Noter le principe qui change, et ceux qui ne changent pas.
2. Dans le chat, `/speckit-constitution`, avec l'ensemble des principes à jour.
3. Relire `.specify/memory/constitution.md`, nombres compris.
4. Ouvrir `.specify/feature.json` pour savoir quelles specs sont actives.
5. Relire ces specs contre le nouveau principe, sans élargir le chantier.
6. Laisser le test, le code et la pile en dehors de la constitution.

Vous ne faites pas ce geste parce qu'un chapitre se termine, ni parce que le fichier vous semble un peu long. Vous le faites parce que l'atelier n'a plus la même règle. Tant que l'attente reste à douze, la constitution écrite au chapitre précédent demeure la bonne.

# Exercices

## Exercice 1 : Dix noms, pas douze

Léa vous écrit : « L'attente, je la coupe à 10. Le reste, on n'y touche pas. » Décrivez le message dans le chat et les deux lectures qui suivent.

<details>
<summary>Voir la solution</summary>

Vous lancez `/speckit-constitution` dans le chat, avec l'attente ordonnée à dix noms, et le reste explicite : huit places, 45 €, samedi 10 h-13 h, décision avant 18 h la veille, pas de téléphone, serveur qui refuse la neuvième place.

Vous relisez `.specify/memory/constitution.md` : dix pour l'attente, huit pour la salle, rien de neuf sur le téléphone. Puis vous relisez les specs déjà écrites, celles du dossier indiqué par `.specify/feature.json`. Toute file de douze noms y devient une file de dix. Les douze stages du mois, eux, restent douze stages.

</details>

## Exercice 2 : Le test qui bloque

Un test de la confirmation échoue : il attend le mot « à bientôt » et le code affiche « vous avez une place ». Les principes n'ont pas changé. On vous propose de réécrire la constitution pour y imposer ce mot, et d'y ajouter un framework « afin que le test passe ». Que faites-vous ?

<details>
<summary>Voir la solution</summary>

Vous ne rouvrez pas la constitution. Un test rouge n'est pas un principe. Le mot du bandeau se règle dans la spec ou dans le code, selon l'endroit où la phrase a été décidée. Le framework n'entre pas dans `.specify/memory/constitution.md`.

Les règles restent celles de Léa : huit places, 45 €, attente de douze tant qu'elle n'a pas dit dix, 18 h la veille, pas de téléphone, refus serveur de la neuvième place. Trois absents et le SMS oublié ne se réparent pas en éditorialisant la constitution.

</details>

## Exercice 3 : Le douze qui reste

Après le passage à une attente de dix, une spec de la confirmation dit encore : « La file sous la confirmation compte 12 noms. » Une autre ligne dit : « Le mois compte 12 stages. » Que corrigez-vous, et que laissez-vous ?

<details>
<summary>Voir la solution</summary>

Vous corrigez la file : elle s'arrête à dix, puisque le principe a changé. Vous laissez « 12 stages » : c'est le mois de l'atelier, pas la taille de l'attente. Le remplissage autour de 70 % et les trois absents du SMS oublié restent aussi.

Vous vérifiez que la spec ne crée pas une neuvième place et n'affiche pas le téléphone. Huit places, 45 €, samedi 10 h-13 h, décision avant 18 h la veille : inchangés. La constitution a déjà été relue. Cette relecture-ci est celle de la spec.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Changer un principe
center: "On rouvre la constitution si Léa change une règle. Exemple : l'attente passe de 12 à 10. Puis on relit les specs."
points:
  - icon: loop
    title: Rouvrir
    text: "Dans le chat, /speckit-constitution, avec le principe nouveau et ceux qui restent."
  - icon: list
    title: 12 vers 10
    text: "Seule l'attente bouge dans l'exemple. Huit places, 45 € et 18 h restent écrits tels quels."
  - icon: test
    title: Test rouge
    text: "Un test qui bloque ne justifie pas une réécriture. On corrige la spec, le code ou le test."
  - icon: search
    title: Relire
    text: "Les specs du dossier actif se relisent contre le nouveau principe. Le 12 des stages reste."
  - icon: shield
    title: Inchangé
    text: "Pas de téléphone, le serveur refuse la 9e place. Aucun framework n'entre par cette occasion."
pitfall: "Réécrire la constitution pour faire passer un test, ou changer les huit places parce que l'attente passe à 10."
remember: "Un principe change, on rouvre, on relit le fichier, on relit les specs. Un test rouge ne suffit pas."
```
