---
title: "Ce que Claude Code change dans un projet"
description: "Claude Code est une session dans le dépôt Sève. L'agent lit, propose des commandes, édite, et s'arrête sur les permissions. Vous restez responsable du diff, et le résultat attendu se dit avant la première commande."
duration: 50
objectives:
  - "Situer une session Claude Code dans le dépôt, avec les quatre temps lire, proposer, éditer, s'arrêter"
  - "Écrire le résultat attendu de Sève avant d'autoriser la moindre commande"
  - "Relire le diff vous-même, y compris quand le résumé de la session annonce que c'est fini"
  - "Tenir les quatre incréments séparés, avec les nombres de Léa inchangés"
---

# Une session dans le dépôt

Claude Code s'ouvre dans un terminal, dans le dossier du projet. La session lit les fichiers de ce dossier, propose des commandes, édite le code, et s'arrête dès qu'une permission est nécessaire. Le fil de discussion est accroché au dépôt. Pour l'atelier Sève, ce dépôt est celui de l'application, pas un cahier à côté.

Léa Vernet est céramiste à Lyon, sur les pentes de la Croix-Rousse. Le stage a lieu le samedi, de 10 h à 13 h. Huit places, 45 €. La liste d'attente s'arrête à douze noms, et Léa tranche avant 18 h la veille. Le mois compte douze stages. Le remplissage tourne autour de 70 %. Trois personnes par mois ne viennent pas, parce que le SMS de confirmation a été oublié. L'application Sève doit rendre ces règles visibles. La session doit vous aider à les écrire dans le code.

> [!IMPORTANT]
> Vous lancez la session dans le dépôt Sève. Elle travaille sur ces fichiers. Un discours général sur « une application de réservation » ne remplace pas une lecture du dossier, puis un diff que vous pouvez relire.

# Lire, proposer, éditer, s'arrêter

Quatre temps reviennent dans chaque session. L'agent lit ce qui est déjà dans le dépôt. Il propose une commande ou une modification. Il édite si vous laissez passer l'écriture. Il s'arrête quand il lui faut une permission : lancer une commande, écrire un fichier, sortir du dépôt. Vous voyez la demande. Le oui ou le non vient de vous.

Sur Sève, le premier temps utile est souvent une lecture. Où sont les stages. Où le nombre de places est écrit. Le deuxième temps est une proposition : lancer le test déjà présent, ou préparer la page des douze stages. Le troisième temps est l'édition, fichier par fichier. Le quatrième temps est le vôtre. La session attend pendant que vous lisez la demande.

```diagram
type: flow
title: "Les quatre temps d'une session"
steps:
  - title: Lire
    text: "Le dépôt réel : les stages, les places, les fichiers déjà là."
    tone: blue
  - title: Proposer
    text: "Une commande ou un changement, montré avant de l'exécuter."
    tone: teal
  - title: Éditer
    text: "Les fichiers changent seulement après votre oui."
    tone: amber
  - title: S'arrêter
    text: "La permission vous revient. Vous pouvez refuser."
    tone: rose
```

> [!NOTE]
> En mode par défaut, la lecture du dépôt fait partie du travail. Une commande du shell, une écriture ou un accès réseau s'affiche et attend. Le texte de la demande dit laquelle des actions est en jeu.

# Vous restez responsable du diff

Le résultat d'une session, c'est le diff. `git status` liste les fichiers touchés. `git diff` montre les lignes ajoutées et retirées. Vous les lisez. Un résumé qui dit « les places restantes sont affichées » se vérifie dans ces lignes, et ensuite dans la page.

Responsable du diff, cela se tient en trois gestes. Vous lisez les lignes, phrase par phrase. Vous refusez un changement que vous ne sauriez pas expliquer à Léa, même court. Vous committez après cette lecture, quand le comportement demandé est celui que le dépôt montre. Un commit lancé pour « ranger la session » fige un travail que vous n'avez pas vu.

Léa, elle, verra si une page annonce encore de la place alors que les huit sièges sont pris. Vous, vous voyez si le fichier qui décide de ce nombre a vraiment changé. Les deux regards se complètent. Le résumé de la session ne suffit à aucun des deux.

> [!WARNING]
> « C'est fait » dans le fil ne prouve pas le comportement. La preuve est le diff, plus la page des douze stages avec les places restantes, quand c'est le résultat que vous aviez écrit.

# Le résultat se dit avant la première commande

Avant de donner du travail, vous écrivez le résultat en une phrase que l'on peut constater. Pour le premier incrément de Sève :

```text
Résultat : une page liste les 12 stages du mois.
Chaque stage affiche les places restantes sur 8.
Le formulaire, l'attente et la confirmation viendront après.
```

Cette phrase précède la première commande que vous autoriserez. Elle sert de filtre. Une commande qui installe un outil, renomme l'arborescence, ou ouvre un sujet loin des stages attend votre arbitrage : sert-elle cette phrase ? Si la réponse est floue, vous demandez pourquoi, ou vous refusez.

Le résultat parle de ce qu'un élève peut voir. « Remettre la couche métier à plat » décrit une activité. « Camille voit qu'il reste 3 places samedi » décrit un fait. Vous pouvez joindre la vérification, quand vous la connaissez : le test des stages doit passer. Tant que vous ignorez le nom de ce test, la session peut le chercher en lecture. Elle ne code pas encore.

> [!TIP]
> Mettez les nombres dans la phrase. Huit places, 45 €, attente de 12, décision avant 18 h. Un nombre absent de la demande a de grandes chances d'être arrondi.

# Quatre incréments, dans l'ordre

Sève se construit en quatre résultats. Vous n'en confiez qu'un à la fois.

1. Une page des douze stages du mois, avec les places restantes.
2. Un formulaire qui refuse la neuvième place.
3. Une liste d'attente ordonnée, qui s'arrête à douze.
4. Une confirmation visible, et la règle des 18 h : Léa tranche avant 18 h la veille.

Chaque incrément a sa phrase, son diff, et une vérification. Le suivant commence quand le précédent est dans le dépôt, pas quand le fil devient long. Les trois absents du mois, ceux du SMS oublié, justifient l'incrément 4. Ils ne justifient pas de tout écrire le premier soir. Le remplissage à 70 % rappelle pourquoi les places restantes doivent être vraies : une page trop optimiste remplit mal, une page fausse fait venir trop de monde.

```diagram
type: pipeline
title: "Vous et la session, sur un incrément"
lanes:
  - title: Vous
    steps:
      - title: Phrase
        text: "Le résultat constatable, avec les nombres de Léa."
        tone: violet
      - title: Relecture
        text: "git diff, puis le comportement demandé."
        tone: violet
  - title: Session
    steps:
      - title: Lecture
        text: "Où sont les stages, sans édition."
        tone: teal
      - title: Édition
        text: "Un seul incrément, après votre oui."
        tone: teal
```

# Ce que la session ne choisit pas

Les règles de l'atelier sont déjà décidées. Huit places. Quarante-cinq euros. Douze noms en attente, dans l'ordre. 18 h la veille, pas une heure plus tard. La session peut proposer une file plus longue parce que le code serait plus court. La règle de Léa reste celle du dépôt. Vous la rappelez dans la phrase de résultat, puis vous la relisez dans le diff.

La session propose aussi des actions que vous gardez. Envoyer un message. Supprimer un dossier. Committer. Le texte s'affiche, vous lisez, vous décidez. Et quand une réponse cite un fichier que vous ne trouvez pas, ou une règle arrondie (« une dizaine de places »), vous corrigez dans le fil avant toute édition.

Deux phrases suffisent pour commencer. Le résultat de l'incrément en cours. Et la consigne de lecture : montrer les fichiers avant de les modifier. La suite du parcours installe la session, règle les permissions, et fait lire le dépôt pour de bon.

# Exercices

## Exercice 1 : La phrase d'avant

Vous ouvrez une session dans le dépôt Sève. La demande qui vous vient est : « Construis l'application de réservation de l'atelier. » Écrivez à la place le message qui précède toute commande, pour le premier incrément seulement.

<details>
<summary>Voir la solution</summary>

Vous écrivez le résultat constatable : une page liste les douze stages du mois, et chaque stage affiche les places restantes sur huit. Le samedi 10 h-13 h et le prix de 45 € peuvent figurer comme rappel. Ils ne transforment pas la demande en application complète.

Vous précisez que le formulaire, l'attente et la confirmation restent pour plus tard. Aucune commande n'est autorisée tant que cette phrase n'est pas le sujet du travail. La session pourra ensuite chercher où sont les stages. Elle ne « lance » pas le projet au sens vague.

</details>

## Exercice 2 : Le résumé trop beau

La session écrit : « C'est en place. Les élèves voient les places, et la liste d'attente est gérée. » `git diff` ne montre qu'un titre de page. Que décidez-vous, et que répondez-vous dans le fil ?

<details>
<summary>Voir la solution</summary>

Vous tenez le diff pour le fait. Un titre changé ne montre ni les douze stages, ni les places restantes, ni une attente. Vous le dites : le résultat demandé n'est pas dans les lignes, on s'arrête là.

Vous redemandez le premier incrément seul, avec les fichiers concernés. Vous ne committez pas le titre pour conserver une trace. Le résumé qui ajoute l'attente mélange un incrément futur. Trois absents par mois ne se règlent pas par une phrase dans le fil.

</details>

## Exercice 3 : Dix places « au cas où »

Pour simplifier les désistements, la session propose dix places au lieu de huit, et une attente sans limite. Léa tient huit places, douze noms au plus, et elle tranche avant 18 h la veille. Que répondez-vous ?

<details>
<summary>Voir la solution</summary>

Vous maintenez les nombres de l'atelier. Huit places, attente de douze, décision avant 18 h. Une file illimitée et une neuvième place « au cas où » changent le métier, même si le code a l'air plus simple.

Si l'incrément en cours est encore la page des stages, vous ramenez la session à cette page. Le formulaire qui refuse la neuvième place viendra ensuite, avec la règle telle que Léa la pratique. Le diff de ce jour-là devra montrer huit, pas dix.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Une session dans le dépôt
center: "Claude Code lit, propose, édite et s'arrête dans le dépôt Sève. Le résultat se dit avant la commande. Le diff reste le vôtre."
points:
  - icon: terminal
    title: Session
    text: "Vous lancez claude dans le dépôt. La conversation travaille sur ces fichiers."
  - icon: search
    title: Lire
    text: "L'agent regarde le code déjà là avant de proposer une commande ou une édition."
  - icon: shield
    title: Permission
    text: "Une commande ou une écriture s'arrête. Vous dites oui ou non, en lisant la demande."
  - icon: git
    title: Le diff
    text: "git diff montre ce qui a changé. Le résumé du fil ne tient pas lieu de preuve."
  - icon: target
    title: Résultat
    text: "D'abord la phrase : 12 stages, places restantes sur 8. Un incrément à la fois."
pitfall: "Demander de construire toute l'application d'un coup, ou croire un résumé quand le diff ne montre qu'un titre."
remember: "Écrivez le résultat avant la première commande. Huit places, 45 €, attente 12, décision avant 18 h. Puis relisez le diff."
```
