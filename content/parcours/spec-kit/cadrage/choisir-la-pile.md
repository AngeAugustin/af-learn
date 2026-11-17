---
title: "Choisir la pile dans le plan"
description: "Écrire la pile dans /speckit-plan : pour Sève, rester sur l'application en place, sans framework nouveau, sans paiement, sans SMS."
duration: 50
objectives:
  - "Réserver le choix technique à /speckit-plan, dans le chat de l'agent"
  - "Demander de rester sur l'application qui liste déjà les stages et refuse la 9e place"
  - "Exclure un nouveau framework, un SDK de paiement et l'envoi de SMS"
  - "Ne pas renégocier le prix, le plafond ni l'heure dans ce message"
---

# La pile a un endroit

Jusqu'ici, `spec.md` dit le quoi et le pourquoi de l'attente. Une personne voit qu'elle est en attente, dans l'ordre d'arrivée. Le 12e nom est accepté, le 13e est refusé. La page publique ne montre pas les téléphones. Léa Vernet tranche avant 18 h la veille, et la phrase est à l'écran. Le stage d'Atelier Sève reste samedi, 10 h-13 h, 8 places, 45 €, à Lyon Croix-Rousse.

Ces phrases ne nomment pas de pile. C'est voulu. GitHub Spec Kit place la technique dans `/speckit-plan`. Vous lancez ce skill dans le chat de l'agent, quand `spec.md` est relu et que plus aucun chiffre n'hésite entre 8 et 10. Le terminal ne reçoit pas le skill.

Le plan produit `plan.md` dans le dossier de la fonctionnalité, celui qu'indique `.specify/feature.json`. Il peut écrire d'autres fichiers de conception à côté. Le geste de cette étape est d'envoyer le choix technique, pas de découper les tâches.

> [!IMPORTANT]
> `/speckit-plan` est l'endroit de la pile. `/speckit-specify` et `/speckit-clarify` ne le sont pas. Vous n'y revenez que si le comportement, lui, doit changer.

# Ce que « choisir » veut dire pour Sève

Choisir une pile, sur un dépôt vide, ce serait nommer un framework et une base. Next, Postgres, ou d'autres noms, iraient dans ce message-là, et nulle part avant. Atelier Sève n'est pas ce cas. L'application existe. Elle liste les 12 stages. Elle refuse la 9e inscription.

Le choix technique tient donc en une consigne : rester sur cette application. Pas un nouveau framework. Pas une seconde base à côté. Pas un SDK branché pour l'occasion. Le plan doit réutiliser l'architecture qui porte déjà la liste et le refus.

Vous n'expliquez pas le framework dans le message. Vous ne donnez pas un cours sur ses dossiers. Vous dites ce que le plan a le droit d'utiliser : le code déjà là. Le skill se débrouille avec le dépôt, dans la limite de cette consigne.

# Le message à envoyer

Quand `spec.md` est stable, le chat reçoit un message de ce genre.

```text
/speckit-plan Rester sur l'application déjà en place. Réutiliser l'architecture qui affiche les 12 stages et qui refuse la 9e place. Pas de nouveau framework. Pas de SDK de paiement. Pas d'envoi de SMS.
```

Les chiffres ne sont pas une négociation dans ce texte. S'il faut les rappeler pour qu'ils ne dérivent pas, vous les rappelez comme des contraintes déjà décidées : 8 places, attente de 12 noms, 45 € affichés, décision avant 18 h la veille. Vous ne demandez pas au plan de choisir entre 8 et 10, ni entre 45 € et 40 €.

Le contexte du mois reste hors des travaux. Remplissage observé de 70 %, 3 absents parce que le SMS est oublié : cela explique l'atelier. Le message interdit l'envoi de SMS. Il n'en fait pas une tâche.

> [!NOTE]
> Nommer Next ou Postgres serait le geste d'un projet qui choisit sa pile maintenant. Pour Sève, le geste est de rester. Le nom d'un outil nouveau n'entre pas.

# Ce que le plan de Sève refuse

Trois refus accompagnent la réutilisation. Pas de nouveau framework : l'attente et la confirmation s'ajoutent à l'application actuelle, elles ne la remplacent pas. Pas de SDK de paiement : 45 € est un prix affiché, personne ne paie dans cette fonctionnalité. Pas d'envoi de SMS : les 3 absents expliquent un oubli, ils ne commandent pas un expéditeur.

Un plan qui propose « une petite application à côté, plus simple » a quitté la consigne. Un plan qui ajoute un module de carte bancaire aussi. Un plan qui envoie un rappel le vendredi soir aussi. Vous le verrez en lisant `plan.md`. Cette étape-ci sert à ne pas le demander.

La page publique sans téléphone n'est pas une option technique. C'est un critère de la spec. Le plan ne « l'optimise » pas en affichant les numéros pour faciliter un SMS. Il respecte l'écran déjà spécifié.

```diagram
type: pipeline
title: "Ce qui est déjà décidé, ce que le plan choisit"
lanes:
  - title: "Déjà dans spec.md"
    steps:
      - title: "Chiffres"
        text: "8 places, attente de 12, 45 €, avant 18 h la veille"
        tone: teal
      - title: "Écran"
        text: "Ordre d'arrivée, 13e refusé, aucun téléphone public"
        tone: blue
  - title: "Choix de /speckit-plan"
    steps:
      - title: "Rester"
        text: "L'application déjà en place, liste et refus de la 9e réutilisés"
        tone: violet
      - title: "Rien ajouter"
        text: "Pas de nouveau framework, pas de SDK de paiement, pas de SMS"
        tone: amber
```

# Le prix, le plafond et l'heure

Ces trois-là ne se discutent pas contre la pile. Le prix reste 45 €, affiché, sans encaissement. Le plafond de l'attente reste 12 noms, le 13e refusé. L'heure reste 18 h la veille, avec la phrase « avant 18 h » à l'écran. Les 8 places du stage restent 8, avec le refus de la 9e inscription déjà en place.

Si l'agent répond « 10 places seraient plus simples avec l'architecture actuelle », la réponse est non. La simplicité technique ne déplace pas un chiffre de Léa. Vous renvoyez à `spec.md`. Vous ne modifiez pas la spec pour faire plaisir au plan.

Même règle pour « on confirme en encaissant » ou « on confirme par SMS ». La confirmation spécifiée est visible sur la page. Elle n'est pas un paiement et pas un message. Le plan la loge dans l'application existante, sans ces deux ajouts.

> [!WARNING]
> Un plan qui rouvre 45 €, le plafond de 12 ou l'heure de 18 h n'est pas en train de choisir une pile. Il renégocie la spec. Vous le ramenez aux contraintes déjà écrites.

# Le plan s'arrête avant les tâches

`/speckit-plan` s'arrête à la conception. Il ne découpe pas le travail en tâches, et il n'écrit pas la page. Le skill suivant, `/speckit-tasks`, attendra que vous ayez lu `plan.md`. Cette lecture est le chapitre d'après. Ici, vous envoyez la consigne et vous laissez le fichier de plan s'écrire.

Vous ne mélangez pas les skills dans un seul message du type « planifie et découpe les tâches ». Le plan se relit seul. S'il a dérivé vers un framework nouveau, un paiement ou des téléphones, vous le corrigerez avant les tâches. Vous ne comptez pas sur les tâches pour réparer une consigne trop large.

La checklist `checklists/requirements.md` reste celle de la spec, tenue par specify et clarify. Elle ne devient pas, à cette étape, la preuve que la pile est la bonne. La preuve de la pile, c'est le texte de `plan.md` comparé à la consigne : rester, réutiliser, ne pas ajouter de paiement ni de SMS.

# Exercices

## Exercice 1 : Quel skill reçoit la phrase

Rangez chaque phrase. `/speckit-specify`, `/speckit-clarify`, ou `/speckit-plan` ?

1. « La personne voit qu'elle est en attente, le 13e nom est refusé. »
2. « Focus sur l'attente : ordre, plafond 12, ce que voit la page publique. »
3. « Rester sur l'application déjà en place, pas de nouveau framework, pas de SDK de paiement, pas d'envoi de SMS. »

<details>
<summary>Voir la solution</summary>

1 part avec `/speckit-specify` : c'est le comportement visible. 2 part avec `/speckit-clarify` : c'est un focus de questions, et les réponses retourneront dans `spec.md`. 3 part avec `/speckit-plan` : c'est le choix technique de Sève.

Les trois se tapent dans le chat de l'agent, pas dans le terminal. Le prix 45 €, les 8 places et l'heure de 18 h ne se choisissent pas dans la phrase 3 : ils sont déjà décidés.

</details>

## Exercice 2 : Réécrire une pile inventive

L'agent propose : « Nouveau framework, base séparée, SDK de paiement pour les 45 €, SMS le vendredi pour les 3 absents, et on passe à 10 places pour simplifier. » Écrivez le message de plan que vous envoyez à la place.

<details>
<summary>Voir la solution</summary>

`/speckit-plan Rester sur l'application déjà en place. Réutiliser l'architecture qui affiche les 12 stages et qui refuse la 9e place. Pas de nouveau framework. Pas de SDK de paiement. Pas d'envoi de SMS.`

Vous ne négociez pas les chiffres. Le stage reste à 8 places, l'attente à 12 noms, le prix affiché à 45 €, la décision avant 18 h la veille. Les 3 absents n'ouvrent pas un SMS. Les téléphones restent absents de la page publique, comme dans la spec.

</details>

## Exercice 3 : Une question du plan qui rouvre la spec

Pendant le plan, l'agent demande : « Je mets 40 € pour éviter un SDK, je monte l'attente à 20 noms, et je déplace la décision à 20 h le jour même. C'est plus simple avec le code actuel. » Que répondez-vous ?

<details>
<summary>Voir la solution</summary>

Non. Le prix, le plafond et l'heure ne se négocient pas dans le plan. 45 € reste affiché, sans paiement et sans SDK. L'attente reste à 12 noms, le 13e refusé. Léa tranche avant 18 h la veille, phrase à l'écran.

La simplicité du code actuel se traduit autrement : réutiliser l'application qui liste les 12 stages et refuse la 9e place. Pas un nouveau framework. Les 8 places ne deviennent pas 10. Vous renvoyez à `spec.md` et vous gardez ces contraintes dans le message du plan.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "La pile se décide au plan"
center: "Pour Sève, /speckit-plan dit de rester sur l'application en place, sans paiement et sans SMS."
points:
  - icon: tool
    title: "Skill du plan"
    text: "/speckit-plan se lance dans le chat, une fois spec.md stable. Le terminal ne reçoit pas ce skill."
  - icon: layers
    title: "Rester"
    text: "On réutilise l'architecture qui liste les 12 stages et refuse déjà la 9e inscription."
  - icon: shield
    title: "Trois refus"
    text: "Pas de nouveau framework, pas de SDK de paiement, pas d'envoi de SMS pour les 3 absents."
  - icon: money
    title: "45 € affichés"
    text: "Le prix ne se négocie pas ici. Il reste affiché. Aucun encaissement n'entre dans le plan."
  - icon: clock
    title: "Heure tenue"
    text: "Avant 18 h la veille et le plafond de 12 noms restent ceux de la spec. La pile ne les déplace pas."
pitfall: "Profiter du plan pour passer à 10 places, à 40 € ou à un nouveau framework. Ces choix rouvrent une spec déjà tenue."
remember: "Le plan de Sève reste sur l'application en place. Prix, plafond et heure ne se négocient pas dans ce skill."
```
