---
title: "Mener l'attente jusqu'au plan"
description: "Planifier l'attente en réutilisant l'app de Sève, puis checklist, tâches et analyze, et s'arrêter avant implement si l'analyse est rouge."
duration: 50
objectives:
  - "Écrire un plan qui réutilise la liste et le refus déjà en place"
  - "Produire la checklist des exigences, puis les tâches dans l'ordre des dépendances"
  - "Lancer analyze en lecture seule sur spec, plan et tâches"
  - "Ne pas implémenter tant que l'analyse signale un écart"
---

# Le plan réutilise l'app

`spec.md` est relu. L'attente (12 noms, 13e refusé), le compte public sans téléphone et la phrase des 18 h y sont. La constitution aussi. Vous passez au plan dans le chat, un message à part. Cursor ou Claude Code : `/speckit-plan`. Codex : `$speckit-plan`.

```text
/speckit-plan
Réutiliser l'application Sève déjà en place.
Ne pas recréer la liste des stages ni le refus de la 9e place.
Ajouter le refus du 13e nom, le compte public « 3 personnes en attente » sans téléphone,
et la phrase à l'écran : Léa tranche avant 18 h la veille. La phrase n'envoie rien.
45 € reste affiché. Pas de paiement. Pas de SMS. Pas de nouveau framework.
```

Le plan est l'endroit de la mise en œuvre. Il nomme ce qu'on touche dans l'application existante. Il ne propose pas de recommencer l'atelier dans une autre pile. Ce parcours ne forme pas à un framework. Il ajoute une file bornée, un compte et une phrase à un outil que Léa utilise déjà.

Vous ouvrez `plan.md`. Vous y cherchez la réutilisation, le plafond de 12, l'absence de téléphone public, le prix affiché, l'absence d'envoi et de paiement. Une phrase du genre « accepter 9 inscrits les samedis chargés » ou « encaisser les 45 € » se retire ici, avant les tâches.

> [!NOTE]
> `.specify/feature.json` doit pointer cette fonctionnalité, sur cette copie de travail. Un plan brillant sur un autre dossier ne compte pas.

# La checklist des exigences

Ensuite `/speckit-checklist` (dollar dans Codex). Elle produit une liste sur la **qualité des exigences**, pas sur le code. Questions utiles : le 13e nom est-il explicitement refusé ? Le compte public exclut-il les téléphones ? La phrase des 18 h est-elle sans envoi ? Le paiement et le SMS sont-ils hors champ ?

Vous la relisez. Une case cochée veut dire que **vous** jugez le critère d'exigence satisfait. L'agent ne coche pas tout seul pour débloquer la suite. La checklist intégrée `checklists/requirements.md`, elle, reste tenue par specify et clarify. La checklist que vous venez de créer est la vôtre.

Si une ligne révèle un trou (« que lit le visiteur, le compte ou les noms ? »), vous revenez à `/speckit-clarify` ou à `spec.md`. Vous ne bricolez pas la réponse seulement dans la checklist.

> [!IMPORTANT]
> Cocher n'est pas implémenter. `/speckit-implement`, le moment venu, lira ces cases et demandera s'il en reste de vides. Il n'a pas le droit de les cocher à votre place.

# Les tâches, dans l'ordre

`/speckit-tasks` découpe le plan en `tasks.md`. L'ordre suit les dépendances, pas l'envie d'afficher vite :

1. Ne pas refaire la liste ni le refus de la 9e place. Huit places restent huit. 45 € reste affiché.
2. Refuser le 13e nom. Les 12 déjà là restent dans l'ordre d'arrivée.
3. Afficher « 3 personnes en attente » sans téléphone quand trois personnes patientent. Le visiteur ne voit pas les noms.
4. Afficher la phrase : Léa tranche avant 18 h la veille. Elle se lit. Elle n'envoie rien.

L'écran de Léa peut garder l'ordre des noms. Ce n'est pas la phrase publique, et ce n'est pas une tâche fusionnée avec le compte « pour aller plus vite ». Une tâche « migrer vers un autre framework », « brancher le SMS » ou « encaisser 45 € » n'a pas sa place. Les 70 % et les trois absents restent le pourquoi, dans la spec.

Aujourd'hui, vous n'implémentez pas. Vous rendez `tasks.md` lisible.

```diagram
type: pipeline
title: "Après la spec, avant le code"
lanes:
  - title: "Artefacts de l'attente"
    steps:
      - title: "plan.md"
        text: "Réutilise l'app. Pas de framework neuf, pas de paiement."
        tone: violet
      - title: Checklist
        text: "Qualité des exigences. Vous cochez. requirements.md a déjà son titulaire."
        tone: blue
      - title: "tasks.md"
        text: "13e refusé, puis le compte sans téléphone, puis la phrase des 18 h."
        tone: teal
      - title: Analyze
        text: "Lecture seule. Rouge : on corrige la source, on ne code pas."
        tone: amber
```

# Analyze lit, il n'écrit pas

`/speckit-analyze` compare `spec.md`, `plan.md` et `tasks.md`. Il signale conflits, trous et ambiguïtés. Il ne modifie pas les fichiers. Un rapport, éventuellement des pistes, que vous approuvez ou non.

Écarts qui doivent sortir, pour Sève :

- la spec dit 12 en attente, une tâche en accepte 15 ;
- le plan recrée l'application, la spec dit d'étendre l'existante ;
- une tâche envoie un SMS ou encaisse 45 € ;
- une tâche publie les téléphones alors que la spec les interdit sur la page publique ;
- la phrase des 18 h a disparu des tâches.

Vous lisez le rapport en face des trois fichiers. Si tout concorde, l'analyse est tenue. Vous vous arrêtez quand même avant `/speckit-implement` dans **ce** chapitre : le code est l'étape d'après. Ici, le livrable est un plan cohérent.

# Rouge : on s'arrête

Si l'analyse est rouge, vous ne lancez pas l'implementation « pour voir ». Vous corrigez la source.

- Un nombre faux dans l'exigence : `spec.md` ou `/speckit-clarify`.
- Un choix technique qui contredit la spec : `/speckit-plan`.
- Une tâche en trop, ou dans le mauvais ordre : `/speckit-tasks`.

Puis vous relancez `/speckit-analyze`. Vous recommencez jusqu'à un rapport sans ces conflits. Corriger seulement le rapport, ou demander d'ignorer l'écart, laisse le fichier faux. Le code suivrait le fichier.

Le remplissage à 70 % n'est pas un argument pour une 9e place. Les trois absents ne sont pas un argument pour une tâche d'envoi. Lyon Croix-Rousse et le samedi 10 h-13 h ne se négocient pas dans `tasks.md`.

> [!WARNING]
> Analyze rouge et implement lancé quand même : vous codez un conflit. Vous vous arrêtez. La source se corrige. L'analyse se relance.

# Ce qui reste hors du plan

Hors tâches : le jeton, le téléphone de Léa, l'opérateur SMS, un encaissement, un cours sur l'outil qui sert déjà l'app. Dans les tâches : le refus du 13e, le compte sans téléphone, la phrase des 18 h.

Vous savez que l'implementation, le jour où elle viendra, se fera par phase, dans cet ordre, et qu'elle relira les cases. Les cocher sans les lire fabrique un feu vert faux. Vous les lisez maintenant.

# Exercices

## Exercice 1 : Un plan qui recommence

`plan.md` propose de recréer Sève dans un autre framework, avec un plafond « 8 ou 10 » et un bouton qui encaisse 45 €. La spec est juste. Que gardez-vous du plan ?

<details>
<summary>Voir la solution</summary>

Vous renvoyez `/speckit-plan` : réutiliser l'application, garder la liste et le refus de la 9e, ajouter le refus du 13e nom, le compte public sans téléphone et la phrase des 18 h. 45 € affiché, pas encaissé. Pas de SMS. Pas de plafond configurable.

Le framework nouveau et le paiement sortent du plan. Vous relisez `plan.md` avant la checklist et les tâches. Vous ne lancez pas analyze sur l'ancienne version, et vous n'implémentez pas.

</details>

## Exercice 2 : Analyze au rouge

Le rapport dit : `tasks.md` accepte un 13e nom « si le mois est à 70 % », publie trois téléphones, et envoie un SMS. `spec.md` dit l'inverse. L'agent propose d'implémenter quand même. Que faites-vous ?

<details>
<summary>Voir la solution</summary>

Vous n'implémentez pas. Analyze est en lecture seule : le rapport ne corrige pas les fichiers, et il ne s'ignore pas. Vous reprenez `/speckit-tasks`. Le 13e nom est refusé. Le compte public ne montre pas de téléphone. Pas de SMS. L'ordre reste : refus du 13e, puis le compte, puis la phrase des 18 h.

Vous relancez `/speckit-analyze`. Tant que c'est rouge, vous restez avant implement. Vous vérifiez aussi 8 places, 45 € affichés, et l'absence de paiement.

</details>

## Exercice 3 : Des cases cochées seules

La checklist est entièrement cochée. Vous ne l'avez pas lue. L'agent dit que c'était nécessaire « pour ne pas bloquer implement ». Où est l'erreur, alors que vous ne comptiez pas coder aujourd'hui ?

<details>
<summary>Voir la solution</summary>

Les cases de la checklist de qualité sont à vous. Elles jugent les exigences, pas l'avancement du code. Les cocher sans lecture fabrique un feu vert faux. Vous les décochez, vous lisez chaque critère (13e nom, compte sans téléphone, phrase des 18 h, hors SMS, hors paiement), vous ne cochez que ce que `spec.md` tient vraiment.

`checklists/requirements.md` reste à specify et à clarify. Implement n'est pas pour ce chapitre, et il n'a pas à cocher vos cases. Analyze se lance sur des artefacts relus.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Jusqu'au plan, pas plus"
center: "Le plan réutilise l'app. Checklist, tâches, analyze. Si analyze est rouge, on s'arrête avant implement."
points:
  - icon: layers
    title: "plan.md"
    text: "On étend Sève. Liste et refus de la 9e restent. Pas de nouveau framework."
  - icon: list
    title: "Checklist"
    text: "Elle teste les exigences. Vous cochez. Cocher n'est pas avoir codé."
  - icon: git
    title: "tasks.md"
    text: "D'abord le 13e refusé, puis le compte sans téléphone, puis la phrase des 18 h."
  - icon: search
    title: "Analyze"
    text: "Lecture seule de spec, plan et tâches. Il ne modifie aucun fichier."
  - icon: alert
    title: "Rouge"
    text: "On corrige la source, on relance analyze. Pas d'implement sur un conflit."
pitfall: "Coder quand le rapport est rouge, ou cocher la checklist sans avoir lu téléphones et phrase."
remember: "Plan sur l'app déjà là, tâches dans l'ordre, analyze vert. Le code viendra après, par phase."
```
