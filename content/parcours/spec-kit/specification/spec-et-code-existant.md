---
title: "Spécifier sur un code déjà là"
description: "Écrire la spec de l'attente sans redemander la liste des 12 stages ni contredire le refus de la 9e place."
duration: 50
objectives:
  - "Traiter la liste des 12 stages et le refus de la 9e place comme déjà vrais"
  - "Écrire seulement l'attente ordonnée et la confirmation visible"
  - "Empêcher la spec de contredire les 8 places déjà refusées au-delà"
  - "Prévoir un plan qui réutilise l'architecture existante"
---

# Deux comportements sont déjà vrais

Léa Vernet ouvre déjà Atelier Sève dans l'application : Lyon Croix-Rousse, samedi 10 h-13 h, 8 places, 45 €. Le mois compte 12 stages. Le remplissage observé est de 70 %. Trois absents par mois viennent d'un SMS oublié. Ce décor ne se respecifie pas à chaque fonctionnalité.

Deux comportements sont déjà dans le code. La page liste les 12 stages. Une 9e inscription est refusée, puisque le stage n'a que 8 places. GitHub Spec Kit, pour la fonctionnalité en cours, ne reçoit pas l'ordre de les recréer. `/speckit-specify` reçoit l'ajout : l'attente ordonnée, et la confirmation visible.

Vous le dites dans le texte du chat, en une phrase de frontière. « La liste des 12 stages et le refus de la 9e place existent déjà. » Cette phrase empêche la spec de les redemander. Elle empêche aussi de les contredire en passant le stage à 10 places.

> [!IMPORTANT]
> Une spec sur un code déjà là nomme ce qui est acquis, puis décrit seulement le comportement nouveau. Elle ne réécrit pas l'application.

# Ne pas redemander la liste

Redemander la liste, c'est écrire des scénarios du type « la page affiche 12 stages », « chaque stage montre le samedi 10 h-13 h », « le prix 45 € apparaît », comme si rien de tout cela n'existait. L'agent comprend alors qu'il faut construire cette page. Vous obtenez une seconde liste, ou une liste réécrite à côté de la première.

Dans `spec.md`, ces faits peuvent être rappelés comme contexte, au passé de l'application : ils sont déjà là. Ils ne deviennent pas des critères de cette fonctionnalité, ni des histoires à implémenter. Le lecteur doit voir la différence entre le décor et l'ajout.

Le remplissage de 70 % et les 3 absents restent aussi du contexte. Les citer n'oblige pas à afficher « 70 % » sur chaque stage, ni à envoyer le SMS manquant. Cette fonctionnalité ne fait ni l'un ni l'autre.

# Ne pas contredire les 8 places

Contredire le code déjà là, c'est changer une règle qui fonctionne. « Le stage passe à 10 places. » « La 9e personne entre. » « On retire le refus pour remplir les 70 %. » Ces phrases cassent le comportement que Léa utilise déjà. Elles n'entrent pas dans la spec de l'attente.

Le refus de la 9e place reste. L'attente ne le remplace pas. Elle concerne une personne qui n'a pas obtenu de place. Cette personne voit qu'elle est en attente. L'ordre est celui de l'arrivée. Le plafond de la file est 12 noms : le 12e est accepté, le 13e est refusé. Rien de cela n'augmente les 8 places du samedi.

Le chiffre 10 est le symptôme habituel d'une contradiction. Il n'est ni le nombre de places, ni le plafond d'attente. S'il apparaît dans `spec.md`, vous le retirez avant de continuer, comme vous le feriez pour toute autre dérive.

> [!WARNING]
> Une spec qui « améliore » le refus des 8 places en le passant à 10 contredit l'application. Vous gardez le refus, et vous spécifiez l'attente à côté.

# Ce que cette spec ajoute

Le texte nouveau tient en quelques constats. La personne voit l'état « en attente ». L'ordre affiché est l'ordre d'arrivée. Douze noms au plus, le treizième refusé. La page publique ne montre pas les téléphones. Léa tranche avant 18 h la veille, et la phrase « avant 18 h » est à l'écran.

Ces phrases sont le corps de `/speckit-specify` pour cette fonctionnalité. Elles se constatent. Elles ne nomment pas de framework, pas de base, pas de SDK. Next ou Postgres, si un jour il fallait les écrire, attendraient `/speckit-plan`. Ici, vous n'avez pas à les introduire : l'application a déjà une architecture.

La confirmation visible ne devient pas un paiement, ni un SMS. 45 € reste affiché. Les 3 absents restent expliqués par le SMS oublié, sans que cette spec commande un envoi. Le but est que la personne sache où elle en est, et que l'heure de décision de Léa se voie.

```diagram
type: pipeline
title: "Acquis, ajout, plan"
lanes:
  - title: "Déjà dans l'application"
    steps:
      - title: "Liste"
        text: "12 stages, samedi 10 h-13 h, 45 € affichés"
        tone: blue
      - title: "Refus"
        text: "8 places, la 9e inscription est refusée"
        tone: blue
  - title: "Cette spécification"
    steps:
      - title: "Attente"
        text: "Ordre d'arrivée, 12 noms, le 13e refusé, aucun téléphone public"
        tone: teal
      - title: "Confirmation"
        text: "Léa tranche avant 18 h la veille, phrase visible à l'écran"
        tone: teal
  - title: "Devoir du plan"
    steps:
      - title: "Réutiliser"
        text: "Même architecture que la liste et le refus déjà en place"
        tone: violet
      - title: "Ne pas ouvrir"
        text: "Pas une seconde application à côté de la première"
        tone: amber
```

# Le plan devra réutiliser

La spec ne choisit pas la pile. Elle crée toutefois une obligation pour le plan : réutiliser l'architecture existante. Quand vous lancerez `/speckit-plan`, le message dira de rester sur l'application déjà en place, celle qui liste les stages et refuse la 9e place. Le plan ne proposera pas un second outil à côté.

Vous pouvez l'annoncer dans la frontière, sans cours de framework. « Le comportement nouveau s'ajoute à l'application actuelle. » Cette phrase suffit dans `spec.md`. Les noms de dossiers, de composants ou de services, s'il faut les écrire, appartiennent au plan, qui les reprendra de ce qui existe.

Si la spec exige « une application séparée pour l'attente », le plan sera poussé à désobéir ou à dupliquer. Vous n'écrivez pas cette exigence. L'attente et la confirmation vivent dans la même application que la liste.

> [!NOTE]
> Réutiliser l'architecture est une consigne de plan, préparée par la frontière de la spec. La spec elle-même continue de parler de ce que l'on voit.

# Une lecture de frontière

Avant de quitter `spec.md`, vous le lisez avec trois questions. Qu'est-ce qui est cité comme déjà vrai ? Qu'est-ce qui est demandé comme nouveau ? Quelle phrase contredirait le code ?

Déjà vrai : liste des 12 stages, refus de la 9e place, 8 places, 45 €, samedi 10 h-13 h, Lyon Croix-Rousse. Nouveau : attente ordonnée jusqu'à 12, refus du 13e nom, page publique sans téléphone, phrase « avant 18 h ». Contradiction à chasser : 10 places, attente illimitée, SMS à envoyer, paiement, seconde application, téléphones affichés.

`.specify/feature.json` vous donne le dossier de cette fonctionnalité. Vous vérifiez que `spec.md` est bien celui de l'attente, pas un ancien fichier qui redemandait la liste. Ensuite seulement, un skill de clarification peut interroger ce qui reste flou, sans rouvrir l'acquis.

# Exercices

## Exercice 1 : Une spec qui reconstruit Sève

`spec.md` demande : « Afficher les 12 stages du mois, samedi 10 h-13 h, 8 places, 45 €, et refuser la 9e inscription. » L'application le fait déjà. L'attente n'est pas décrite. Que gardez-vous, et que retirez-vous ?

<details>
<summary>Voir la solution</summary>

Vous retirez ces demandes comme travaux à faire. Vous les remplacez par une frontière : la liste des 12 stages et le refus de la 9e place existent déjà, la spec ne les redemande pas.

Vous écrivez l'ajout manquant. La personne voit qu'elle est en attente, dans l'ordre d'arrivée. Le 12e nom est accepté, le 13e est refusé. La page publique ne montre pas les téléphones. Léa tranche avant 18 h la veille, phrase à l'écran. Le prix reste 45 €, affiché. Pas de SMS, pas de paiement.

</details>

## Exercice 2 : Une amélioration qui contredit

Pour « limiter les 3 absents », on propose de passer le stage à 10 places et de supprimer le refus de la 9e inscription. L'attente prendrait tout le monde, téléphones inclus, sur la page publique. Que devient la spec ?

<details>
<summary>Voir la solution</summary>

La spec refuse cette amélioration. Les 8 places et le refus de la 9e inscription restent. Les 3 absents et le SMS oublié expliquent le mois, ils ne changent pas la règle, et cette fonctionnalité n'envoie pas de SMS.

L'attente reste plafonnée à 12 noms, le 13e refusé, dans l'ordre d'arrivée. Aucun téléphone sur la page publique. La phrase « avant 18 h » reste le critère visible. Le chiffre 10 n'entre pas. Le plan, plus tard, réutilisera l'architecture qui porte déjà le refus.

</details>

## Exercice 3 : Ce que le plan devra reprendre

Vous préparez la suite sans lancer le plan. Écrivez la consigne que `/speckit-plan` devra respecter, et dites ce que la spec ne nomme pas encore.

<details>
<summary>Voir la solution</summary>

La consigne : rester sur l'application déjà en place, réutiliser l'architecture qui liste les 12 stages et refuse la 9e place, ne pas créer une seconde application.

La spec ne nomme pas de framework, pas de base, pas de SDK. Next, Postgres ou un autre nom, s'il fallait en écrire un, attendrait le plan. Ici le choix technique sera de rester, pas d'en changer. Les chiffres, eux, sont déjà fixés : 8 places, 12 noms d'attente, 45 €, 18 h la veille, samedi 10 h-13 h.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Ajouter sans reconstruire"
center: "La spec de l'attente ne redemande pas la liste ni le refus des 8 places. Le plan réutilisera l'existant."
points:
  - icon: list
    title: "Déjà listé"
    text: "Les 12 stages, samedi 10 h-13 h, sont déjà affichés. La spec ne demande pas une seconde liste."
  - icon: shield
    title: "Déjà refusé"
    text: "La 9e inscription est déjà refusée. Huit places restent huit. Dix places contredirait le code."
  - icon: users
    title: "L'ajout"
    text: "Attente dans l'ordre d'arrivée, 12 noms, 13e refusé, phrase « avant 18 h », aucun téléphone public."
  - icon: layers
    title: "Même application"
    text: "Le plan devra réutiliser l'architecture en place. Pas une seconde application à côté."
  - icon: filter
    title: "Contexte seulement"
    text: "70 % et 3 absents expliquent le mois. Ils ne deviennent ni un SMS à envoyer, ni un paiement."
pitfall: "Redemander la liste des 12 stages ou passer le refus de 8 places à 10. La spec contredit alors un code qui marche."
remember: "On spécifie l'attente et la confirmation visible. La liste et le refus de la 9e place restent acquis pour le plan."
```
