---
title: "Écrire la spécification"
description: "Lancer /speckit-specify dans le chat, relire spec.md, corriger 10 places en 8, et laisser la checklist à sa place."
duration: 50
objectives:
  - "Lancer /speckit-specify dans le chat avec le texte de l'attente Sève"
  - "Relire spec.md et remplacer un chiffre faux avant de continuer"
  - "Garder 8 places au stage et 12 noms dans l'attente, sans les confondre"
  - "Lire checklists/requirements.md comme une checklist de spec, pas une fin de code"
---

# Le texte qui part avec le skill

Léa Vernet tient Atelier Sève à Lyon Croix-Rousse. Samedi, 10 h-13 h, 8 places, 45 €. Douze stages dans le mois, remplissage observé de 70 %, 3 absents parce que le SMS est oublié. L'application a déjà la liste et le refus de la 9e place. Vous spécifiez l'attente ordonnée et la confirmation visible.

Vous ouvrez le chat de l'agent, dans le dépôt. La première ligne du message est le skill. Le reste est le comportement. Vous envoyez les deux ensemble. Vous n'ouvrez pas le terminal pour taper `/speckit-specify` : le terminal n'a pas ce skill.

Le texte à envoyer est celui-ci.

```text
/speckit-specify Une personne qui n'a pas de place voit qu'elle est en attente. L'ordre est celui de l'arrivée. Le 12e nom est accepté dans l'attente, le 13e nom est refusé. La page publique ne montre pas les téléphones. Léa Vernet tranche avant 18 h la veille, et la phrase « avant 18 h » est à l'écran. Le but est que la personne sache où elle en est sans appeler l'atelier. Le stage reste le samedi, 10 h-13 h, 8 places, 45 €, Atelier Sève, Lyon Croix-Rousse. La liste des 12 stages et le refus de la 9e place existent déjà.
```

Ce message ne nomme ni Next, ni Postgres, ni un autre framework. Il ne demande ni paiement, ni SMS. Il fixe le quoi et le pourquoi. La pile viendra avec `/speckit-plan`, après la relecture.

> [!IMPORTANT]
> Vous lancez le skill dans le chat de l'agent. Ensuite vous ouvrez le fichier produit. Un chat qui « a l'air juste » ne remplace pas `spec.md`.

# Où spec.md apparaît

GitHub Spec Kit écrit la spécification dans `spec.md`, dans le dossier de la fonctionnalité en cours. Ce dossier est celui qu'indique `.specify/feature.json`. Vous ouvrez ce fichier, pas un résumé collé plus haut dans le chat.

La spec reprend vos phrases avec des titres, des scénarios, parfois des reformulations. Une reformulation peut changer un chiffre sans changer le ton. C'est pour cela que vous lisez le fichier en entier, y compris les scénarios du bas, avant le skill suivant.

Vous cherchez les faits de Sève un par un. Samedi, 10 h-13 h. 8 places. 45 € affichés. Attente ordonnée par l'arrivée. 12 noms, donc le 13e refusé. Phrase « avant 18 h ». Page publique sans téléphone. Liste des 12 stages et refus de la 9e place cités comme déjà vrais, sans être redemandés.

# Le chiffre 10 se corrige tout de suite

Le cas à connaître : `spec.md` parle de 10 places. Le stage en a 8. La 9e inscription est déjà refusée par l'application. Dix places contredit ce refus et contredit Léa. Vous corrigez le fichier avant de continuer.

Vous remplacez 10 par 8 partout où le stage est décrit. Vous vérifiez que l'attente n'a pas été alignée sur la même erreur. L'attente reste à 12 noms. Le 12e est accepté, le 13e est refusé. Si la spec a écrit « attente illimitée » ou « attente de 10 », vous rétablissez ce plafond de 12.

La correction vit dans `spec.md`. Un message du chat qui dit « on verra plus tard pour le 10 » laisse le fichier faux. Le skill suivant lira le fichier. Il ne lira pas votre intention.

> [!WARNING]
> Tant que `spec.md` dit 10 places, vous ne lancez ni `/speckit-clarify` pour « avancer quand même », ni `/speckit-plan`. Vous corrigez le 8, vous relisez, ensuite vous continuez.

# Relire avant le skill suivant

Après la correction, vous relisez encore une fois, comme Léa ouvrirait la page. Le prix est 45 €, pas 40 € et pas 50 €. L'heure limite est 18 h la veille, pas « dans la soirée ». Le créneau reste 10 h-13 h, pas 9 h-12 h. Lyon Croix-Rousse ne devient pas un autre quartier.

Vous regardez aussi ce que la spec aurait ajouté de son propre chef. Un paiement, un envoi de SMS, une reconstruction de la liste des 12 stages, un nouveau framework : ces phrases sortent du fichier. Elles ne font pas partie du texte que vous avez envoyé.

```diagram
type: flow
title: "Du chat au fichier juste"
steps:
  - title: "Chat"
    text: "/speckit-specify, puis le texte visible, sans pile"
    tone: violet
  - title: "spec.md"
    text: "Vous ouvrez le fichier du dossier indiqué par feature.json"
    tone: blue
  - title: "Chiffre"
    text: "10 places redevient 8. L'attente reste plafonnée à 12"
    tone: amber
  - title: "Suite"
    text: "Le skill suivant ne part que si le fichier relu tient les faits"
    tone: teal
```

Cette relecture est le geste qui protège la suite. Clarify posera des questions sur ce fichier. Le plan s'appuiera sur ce fichier. Un 10 laissé « en attendant » se propage.

# La checklist à côté de la spec

Dans le même dossier, `checklists/requirements.md` accompagne la spécification. GitHub Spec Kit la tient à jour quand `/speckit-specify` écrit la spec, et quand `/speckit-clarify` la resserre. Vous la lisez pour voir ce que le skill a relevé sur la qualité du texte. Vous ne la transformez pas en tableau de tâches de code.

Une case cochée veut dire que le skill a jugé un point de la spec. Elle ne veut pas dire que la page existe, que le 13e nom est vraiment refusé à l'écran, ni que Léa a vu la phrase « avant 18 h ». Le code n'est pas le sujet de ce fichier.

Si la checklist a l'air complète alors que `spec.md` dit encore 10 places, le fichier de spec gagne. Vous corrigez le chiffre. Vous ne cochez rien pour « passer outre ». Les cases ne sont pas là pour annoncer que l'application est finie.

> [!NOTE]
> `checklists/requirements.md` est tenue par `/speckit-specify` et `/speckit-clarify`. La cocher ne dit pas que le code est fini. Elle parle de la spec.

# Ce que vous ne faites pas à cette étape

Vous ne lancez pas `/speckit-plan` dans la foulée du premier jet. Vous ne découpez pas des tâches. Vous ne demandez pas à l'agent d'écrire la page « pour voir ». Le seul livrable de cette étape est un `spec.md` dont les chiffres sont ceux de Léa.

Vous pouvez renvoyer un court message dans le chat si vous voulez que le skill réécrive un passage : « Dans spec.md, le stage a 8 places, pas 10. L'attente reste à 12 noms. » Ensuite vous rouvrez le fichier. La phrase dans le chat et la phrase dans `spec.md` doivent dire la même chose.

Le contexte reste en place pendant cette relecture. 12 stages par mois, 70 %, 3 absents, SMS oublié : cela explique pourquoi l'atelier a une application. Cela ne s'ajoute pas comme comportement nouveau au milieu de la spec.

# Exercices

## Exercice 1 : Où part le message

Vous êtes dans le dépôt d'Atelier Sève. Dites où vous tapez `/speckit-specify`, ce que vous faites juste après, et quel fichier vous ouvrez en premier.

<details>
<summary>Voir la solution</summary>

Vous tapez le skill dans le chat de l'agent, suivi du texte de l'attente : ordre d'arrivée, 12e accepté, 13e refusé, aucun téléphone sur la page publique, phrase « avant 18 h », stage à 8 places et 45 €, liste et refus de la 9e place déjà là.

Vous n'utilisez pas le terminal pour ce skill. Juste après la réponse, vous ouvrez `spec.md` dans le dossier indiqué par `.specify/feature.json`. Vous le lisez en entier avant tout autre skill.

</details>

## Exercice 2 : Un spec.md qui dit 10

Le fichier contient : « Le stage accueille 10 places. L'attente est illimitée. Le prix affiché est 40 €. » Le reste du fil rouge est juste, y compris la phrase « avant 18 h » et l'absence de téléphone. Que corrigez-vous, et quel skill gardez-vous pour plus tard ?

<details>
<summary>Voir la solution</summary>

Vous corrigez `spec.md` avant de continuer. Le stage a 8 places : la 9e inscription reste refusée, comme dans l'application déjà en place. L'attente n'est pas illimitée : 12 noms, le 12e accepté, le 13e refusé. Le prix affiché redevient 45 €.

Vous ne lancez pas `/speckit-plan`, ni un skill de tâches, tant que ces lignes sont fausses. Vous relisez le fichier corrigé. Samedi 10 h-13 h, Lyon Croix-Rousse, Léa Vernet, et la liste des 12 stages déjà là ne bougent pas.

</details>

## Exercice 3 : Des cases cochées

`checklists/requirements.md` est entièrement cochée. Un collègue dit : « La checklist est verte, le code de l'attente est donc fini, on peut montrer la page à Léa. » Que répondez-vous ?

<details>
<summary>Voir la solution</summary>

La checklist intégrée est tenue par `/speckit-specify` et `/speckit-clarify`. Elle qualifie la spécification. Une case cochée ne montre pas la page, ne prouve pas le refus du 13e nom, et ne remplace pas la phrase « avant 18 h » à l'écran.

Vous ouvrez encore `spec.md`. Si un chiffre y est faux, vous le corrigez même si la checklist est cochée. Le code viendra plus tard, après clarification et plan. Montrer une page à Léa n'est pas le geste de cette étape.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Relire spec.md avant la suite"
center: "On lance /speckit-specify dans le chat, on relit spec.md, on corrige 10 places en 8."
points:
  - icon: chat
    title: "Skill dans le chat"
    text: "Le message commence par /speckit-specify, dans le chat de l'agent. Le terminal ne lance pas ce skill."
  - icon: file
    title: "Ouvrir spec.md"
    text: "Le fichier est dans le dossier indiqué par .specify/feature.json. Vous lisez le fichier, pas seulement le chat."
  - icon: alert
    title: "10 redevient 8"
    text: "Dix places est faux. Le stage en a 8, la 9e inscription reste refusée. L'attente, elle, reste à 12."
  - icon: list
    title: "Checklist de spec"
    text: "checklists/requirements.md est tenue par specify et clarify. Elle ne dit pas que le code est fini."
  - icon: check
    title: "Puis seulement la suite"
    text: "Clarify et le plan attendent un spec.md relu. Un chiffre faux dans le fichier se propage sinon."
pitfall: "Continuer parce que la checklist est cochée alors que spec.md dit encore 10 places. La case ne corrige pas le chiffre."
remember: "On envoie le skill dans le chat, on relit spec.md, on remet 8 places, et la checklist ne termine pas le code."
```
