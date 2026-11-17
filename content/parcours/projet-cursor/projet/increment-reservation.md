---
title: "Livrer la réservation des 8 places"
description: "Mener l'incrément 2 : un plan, un formulaire qui refuse la 9e place, un test lancé, une phrase de commit."
duration: 50
objectives:
  - "Limiter le plan à l'incrément 2, formulaire et refus de la 9e place"
  - "Relire le diff du formulaire, du refus et du test avant de l'accepter"
  - "Lancer le test vous-même et lire la ligne qui concerne la 9e place"
  - "Écrire une phrase de commit qui dit le refus, pas un mot fourre-tout"
---

# L'incrément 2, et rien d'autre

La liste des 12 stages est déjà là : date, 8 places, 45 €, places restantes. Vous livrez maintenant la réservation. Huit demandes peuvent être acceptées. La 9e est refusée. Un test le prouve. Vous n'ajoutez pas l'attente, ni la confirmation.

Atelier Sève, Lyon Croix-Rousse. Léa Vernet. Samedi 10 h-13 h. Le plafond de 8 n'est pas une suggestion de l'agent. L'attente ordonnée jusqu'à 12 viendra après, dans son incrément. Léa tranche avant 18 h la veille : cette heure ne se code pas aujourd'hui. Les 3 absents par mois rappellent pourquoi la confirmation existera. Ils ne l'avancent pas dans ce diff.

Vous ouvrez un fil pour cet incrément seul, sur la branche de la réservation. Le message nomme la preuve : avec 8 places prises, la 9e demande est refusée, et un test échoue si elle passe.

# Le plan, avant les fichiers

Vous passez par un plan, que vous corrigez avant d'accepter des modifications. Le plan tient en peu de lignes.

- Un formulaire court : qui demande la place.
- Si le stage a moins de 8 réservations, la demande est acceptée.
- Si 8 places sont prises, la 9e est refusée par une phrase que Léa peut lire.
- Un test : huit acceptations, la neuvième refusée. Le prix affiché reste 45 €. La liste des 12 stages reste en place.
- Exclu : liste d'attente, confirmation, heure, paiement, SMS.

Si le plan « prépare déjà l'attente » ou déplace 8 vers 10, vous le coupez. Préparer l'incrément suivant dans celui-ci, c'est livrer deux résultats dont vous ne pourrez pas dire lequel a été vérifié. Le mode Plan sert à voir cette dérive tant qu'elle n'est encore que du texte.

> [!IMPORTANT]
> Le plan de cet incrément s'arrête au refus de la 9e place et à son test. L'attente jusqu'à 12 n'y entre pas, même en « structure vide ».

# Formulaire, refus, test : le diff

Vous laissez l'agent modifier les fichiers seulement quand le plan est le bon. Puis vous ouvrez le diff, pas le résumé. Vous cherchez trois présences et quelques absences.

Présent : le formulaire, la branche qui refuse à la 9e demande, le test qui échoue si cette demande passe. Le texte du refus se lit sans connaître le code. Absent : un fichier d'attente, une heure à 18 h ou à une autre heure, un prix modifié, une clé, une consigne qui ignore un test.

Un remaniement « pendant qu'on y est » sur la page des 12 stages se refuse s'il change le résultat déjà livré. Les places restantes peuvent rester. Elles ne deviennent pas le sujet. Si le diff est trop large pour que vous y retrouviez le refus en une lecture, vous le rejetez et vous redemandez les trois pièces, pas l'application.

```diagram
type: flow
title: "Livrer le refus de la 9e place"
steps:
  - title: "Plan"
    text: "Formulaire, refus, test. Attente et 18 h exclus"
    tone: blue
  - title: "Diff"
    text: "Vous y retrouvez ces trois pièces, pas un autre incrément"
    tone: violet
  - title: "Test"
    text: "Lancé par vous. La ligne de la 9e place est lue"
    tone: teal
  - title: "Commit"
    text: "Une phrase qui dit le refus des 8 places"
    tone: amber
```

# Lancer le test et lire la ligne

Vous lancez le test dans le terminal intégré. Vous ne demandez pas à l'agent s'il est « globalement vert ». Vous cherchez la ligne qui parle de la 9e place. Elle doit dire que la demande est refusée quand 8 réservations existent déjà. Elle ne doit pas avoir été sautée, commentée, ou assouplie en « au plus 9 ».

Si le test échoue, vous lisez l'assertion. Ou le code accepte une place de trop, ou le test n'attend pas la règle de Léa. Vous faites corriger ce décalage. Vous ne dites pas « ignore les tests ». Vous relancez, vous relisez. Un écran qui refuse et un test qui ne le dit pas : vous ne commitez pas non plus. Les deux doivent raconter la même chose.

Le prix se contrôle dans le même passage si le test le mentionne. 45 €. Un test vert qui a obtenu son vert en passant à 40 € est un test que vous rejetez.

# Une phrase de commit

Le commit nomme le métier, pas l'effort. Vous écrivez une phrase que Léa comprendrait si elle la lisait dans l'historique.

« Refuse la 9e place quand un stage a déjà 8 réservations. »

Vous n'écrivez pas « fix », « wip », « update », ni « gère la réservation et l'attente ». L'attente n'est pas dans le diff. Si la phrase promet plus que le diff, vous réduisez la phrase ou vous retirez les fichiers en trop. Si le diff contient plus que la phrase, vous n'avez pas fini la relecture.

La phrase se décide après le test lu, pas avant. Un commit qui devance un test rouge fige le samedi dans l'état que vous vouliez éviter.

# Relire avant d'accepter

Dernier passage, dans l'éditeur, avant de considérer l'incrément livré.

1. Le plan excluait l'attente, la confirmation et le paiement. Le diff aussi.
2. Le formulaire accepte tant qu'il reste une place sur 8.
3. La 9e demande est refusée, à l'écran et dans le test que vous avez lu.
4. 45 € et les 12 stages n'ont pas bougé.
5. La phrase de commit dit ce refus, et rien de plus.

Vous pouvez alors montrer le formulaire à Léa sur l'aperçu : huit oui, un non lisible. Vous ne lui dites pas que l'attente est prête. Elle ne l'est pas. Le remplissage de 70 % ne se « termine » pas avec cet incrément. Il devient seulement impossible d'inscrire une neuvième personne sans le voir.

> [!WARNING]
> Un diff qui accepte la 9e place « pour les habitués » se rejette, même si le test a été modifié pour suivre. Les habitués comptent dans les 8.

# Exercices

## Exercice 1 : Corriger le plan

Le plan proposé dit : formulaire, refus de la 9e place, test, « et la structure de l'attente pour ne pas y revenir », plus une note « prix d'exemple 40 € ». Que coupez-vous avant de laisser modifier les fichiers ?

<details>
<summary>Voir la solution</summary>

Vous coupez l'attente, même « en structure ». Elle appartient à l'incrément suivant : file ordonnée jusqu'à 12. Vous coupez 40 €. Le prix est 45 €, et un test ne le change pas.

Vous gardez le formulaire, le refus quand 8 places sont prises, et le test qui échoue si la 9e passe. Vous gardez aussi l'exclusion explicite : pas de confirmation, pas de 18 h dans cet incrément, pas de paiement. Les fichiers ne bougent qu'une fois ce plan-là écrit.

</details>

## Exercice 2 : Lire le test

Vous lancez les tests. Le chat dit « tout est vert ». En lisant la sortie, vous voyez que le test de la 9e place est marqué ignoré, et qu'un autre test attend 9 places. Que faites-vous avant de committer ?

<details>
<summary>Voir la solution</summary>

Vous ne committez pas. « Tout est vert » a sauté la seule ligne qui protège le samedi. Un test ignoré et un plafond à 9 contredisent la règle de Léa.

Vous faites réactiver le test et rétablir 8. Vous relancez vous-même. Vous lisez la ligne : la 9e demande est refusée. Tant que cette ligne n'est pas là, la phrase de commit n'existe pas. Vous ne demandez pas d'ignorer les tests pour avancer.

</details>

## Exercice 3 : La phrase de commit

Le diff contient seulement le formulaire, le refus et le test. L'agent propose le message « update reservation flow and prepare waitlist ». Écrivez la phrase que vous commitez, et dites pourquoi vous écartez la sienne.

<details>
<summary>Voir la solution</summary>

Vous commitez : « Refuse la 9e place quand un stage a déjà 8 réservations. »

La phrase de l'agent est en anglais vague, et elle annonce l'attente, absente du diff. Elle ne dit pas le refus. La vôtre dit le métier, colle aux fichiers, et reste lisible pour Léa. Vous ne l'élargissez pas aux 12 places d'attente ni à 18 h.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Huit places, pas neuf
center: "Incrément 2 : un plan, le refus de la 9e place, un test lu, une phrase de commit."
points:
  - icon: compass
    title: Le plan
    text: "Formulaire et refus. L'attente, 18 h et le paiement restent écrits comme exclus."
  - icon: code
    title: Le diff
    text: "Trois pièces : formulaire, refus lisible, test. Rien qui ne change 8 ou 45 €."
  - icon: test
    title: La ligne lue
    text: "Vous lancez le test. La 9e place refusée se lit dans la sortie, pas dans le chat."
  - icon: git
    title: Le commit
    text: "« Refuse la 9e place quand un stage a déjà 8 réservations. »"
  - icon: alert
    title: Pas l'attente
    text: "Jusqu'à 12, c'est l'incrément suivant. Une structure vide compte déjà comme un mélange."
pitfall: "Committer parce que le chat dit vert, alors que le test de la 9e place a été ignoré."
remember: "Plan tenu, diff des trois pièces, test lu, phrase qui dit le refus. Ensuite vous montrez le formulaire."
```
