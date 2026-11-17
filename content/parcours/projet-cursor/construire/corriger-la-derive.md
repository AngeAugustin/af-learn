---
title: "Revenir au plan quand l'agent dérive"
description: "Quand le résultat quitte le plan, annuler les changements, préciser le plan, et relancer sans empiler des prompts de réparation."
duration: 50
objectives:
  - "Reconnaître une dérive en comparant le résultat au plan, pas à l'effort"
  - "Annuler les changements quand un paiement s'invite sur la liste"
  - "Préciser le plan enregistré avant de relancer la construction"
  - "Refuser d'enchaîner des réparations sur un agent déjà parti"
---

# Quand le résultat quitte le plan

Vous comparez le résultat au plan enregistré, pas à votre humeur. Le plan de l'incrément 1 disait : la liste des 12 stages, samedi 10 h-13 h, 8 places, 45 €, places restantes. Pas de formulaire. Pas de paiement réel.

Si l'écran ou les fichiers disent autre chose, le résultat ne correspond pas au plan. L'agent a dérivé. Le cas le plus net : il a ajouté un paiement, alors que cet incrément est seulement la liste. Autres dérives du même ordre : une page à propos, une 9e place déjà codée, une attente, une confirmation avant 18 h la veille, un prix qui n'est plus 45 €.

Une dérive n'est pas une richesse. « Il a fait plus que demandé » est le problème. Léa Vernet n'a pas de moyen de compter les 12 stages si le bouton payer occupe la page. Le remplissage de 70 % et les 3 absents (SMS oublié) n'autorisent pas non plus un envoi ajouté au passage. Atelier Sève, Lyon Croix-Rousse, se tient au plan.

> [!WARNING]
> Plus que le plan, ce n'est pas en avance. C'est une dérive. Le paiement sur la liste des 12 stages en est l'exemple.

# Annuler les changements

Le geste, dans Cursor : vous annulez les changements de cette passe. Tant que la revue est ouverte, vous refusez les fichiers de cette exécution. S'ils sont trop mélangés pour garder la liste et jeter seulement le paiement, vous refusez l'ensemble et vous revenez à l'état d'avant ce lancement.

Si vous aviez déjà accepté, vous annulez quand même cette passe avant de continuer. Garder le mélange et « ranger ensuite » laisse le paiement dans le dépôt. Le plan ne peut pas regagner contre des fichiers déjà partis dans une autre direction.

Vous ne commencez pas à éditer le paiement à la main pour le commenter, le cacher, ou le désactiver. Un paiement commenté reste une dérive. L'état d'avant est plus propre que l'état bricolé. Les 8 places et les 45 € reviendront avec une passe neuve, pas avec un bouton masqué.

> [!IMPORTANT]
> Si le résultat ne correspond pas au plan, annulez les changements. Ne partez pas de la version qui a déjà dérivé.

# Préciser le plan, puis relancer

Ensuite vous rouvrez le plan dans le workspace. Vous le précisez à l'endroit où l'agent s'est trompé. Vous ne vous contentez pas de « sois plus fidèle ». Vous écrivez la ligne qui manquait.

Pour le paiement : « Hors de cet incrément : aucun paiement, aucun bouton payer, aucun fichier d'encaissement. 45 € est un prix affiché. » Pour un horaire faux : « Le créneau affiché est samedi 10 h-13 h, pas un autre. » Pour une liste courte : « La preuve est 12 stages comptés sur la page. »

Vous enregistrez à nouveau le plan. Puis vous relancez la construction à partir de ce plan précisé. Le message cite le fichier. Il ne raconte pas l'échec en long, ce qui remettrait le paiement au centre de l'attention. Il redit la preuve et l'interdit. Vous éditez le fichier du plan, pas un souvenir du chat. L'ancienne version enregistrée ne doit pas rester à côté, contradictoire.

# Pourquoi les réparations salissent

Enchaîner des prompts de réparation sur un agent déjà parti produit un code plus sale. Le premier message dit « enlève le paiement ». Le deuxième dit « le prix est passé à 40 € ». Le troisième dit « il manque des stages ». Chaque tour part du dépôt déjà tordu. L'agent contourne. Il cache le bouton sans retirer le fichier. Il remet 45 € dans la page et le laisse à 40 € dans les données. Il ajoute les stages manquants en double.

Vous reconnaissez la saleté à ceci : vous ne savez plus quelle ligne vient du plan et quelle ligne vient d'un correctif. Léa voit peut-être 12 stages, et le diff contient encore trois façons de payer, dont une commentée. L'écran, un instant, ment moins que le dépôt.

La réparation a l'air économique. Elle coûte la relecture d'après. Annuler, préciser, relancer coûte un passage. Ce passage repart du plan, pas du bricolage. C'est le chemin le plus court dès que la dérive est un vrai écart, pas une virgule sur une liste déjà juste.

> [!TIP]
> « Enlève le paiement », puis « et le prix », puis « et l'horaire » : trois prompts sur un agent parti. Le dépôt devient plus sale qu'après une annulation.

# L'exemple du paiement sur la liste

Rejouez le cas. Plan : incrément 1, liste seulement. L'agent revient avec la liste, et avec un paiement des 45 €. Vous ouvrez la revue. Le fichier de la page mélange le prix juste et le bouton payer. Un autre fichier ne parle que d'encaissement.

Vous n'envoyez pas « retire le paiement mais garde le reste, et profites-en pour préparer la 9e place ». Ce message ajoute une deuxième dérive (la 9e place) pour en corriger une. Vous annulez la passe. Vous ajoutez au plan la phrase d'interdiction du paiement. Vous relancez l'incrément 1 seul.

Quand la nouvelle passe revient, vous recommencez la revue normale : fichiers, règles, phrases de Léa. 12 stages. Samedi 10 h-13 h. 8 places. 45 € affichés. Places restantes. Pas de paiement. Là, vous pouvez accepter ce qui sert la liste. Pas avant.

Le même réflexe vaut si la dérive est l'attente jusqu'à 12 ou la règle des 18 h arrivée trop tôt. Ce sont de bons incréments, plus tard. Sur la liste, ce sont des intrus. On annule, on précise, on relance.

# Repartir d'un incrément propre

Après la relance, l'incrément est de nouveau un objet simple. Vous pouvez le montrer à Léa : les 12 stages du mois, à Croix-Rousse, sans bouton qui n'était pas dans le rendez-vous. Les 3 absents et le SMS oublié ne se règlent pas dans ce correctif. Ils attendent la confirmation, incrément 4, avec la décision avant 18 h la veille.

Vous ne gardez pas le fil de réparation au cas où le paiement reviendrait. S'il revient, c'est encore une dérive : annuler, préciser plus nettement, relancer. Vous ne discutez pas avec la version sale pour l'arrondir. Le plan gagne parce que vous partez de lui, pas parce que vous avez convaincu l'agent dans un long fil.

Le petit geste habituel, celui du mode Agent direct, reste réservé à autre chose : une virgule sur une liste déjà juste, que vous avez déjà revue. Il ne sert pas à dépanner une passe qui a quitté le plan. Dès que le résultat ne correspond pas, vous revenez au plan. C'est le chemin court.

```diagram
type: flow
title: "Quand l'agent quitte le plan"
loop: "S'il dérive encore, on annule de nouveau. On n'empile pas les réparations."
steps:
  - title: Comparer
    text: "Le résultat doit coller au plan. La liste seule n'inclut pas un paiement."
    tone: violet
  - title: Annuler
    text: "Vous refusez cette passe et vous revenez à l'état d'avant."
    tone: rose
  - title: Préciser
    text: "Le plan écrit l'interdit manquant : pas de paiement, 12 stages, 45 € affichés."
    tone: amber
  - title: Relancer
    text: "Une construction neuve, depuis le plan. Pas un prompt de réparation."
    tone: teal
```

> [!NOTE]
> La confirmation et les 18 h viendront à leur incrément. Les ajouter pour compenser un paiement raté mélange deux erreurs. On termine d'abord une liste propre.

# Exercices

## Exercice 1 : Le paiement s'est invité

Le plan enregistré décrit seulement la liste des 12 stages. L'agent livre la liste et un encaissement des 45 €. Écrivez les trois gestes, dans l'ordre, et la phrase que vous ajoutez au plan.

<details>
<summary>Voir la solution</summary>

1. Vous annulez les changements de cette passe. Vous ne partez pas du dépôt qui contient déjà le paiement.
2. Vous précisez le plan : « Hors de cet incrément : aucun paiement, aucun bouton payer, aucun fichier d'encaissement. 45 € est un prix affiché. La preuve reste 12 stages, samedi 10 h-13 h, 8 places, places restantes. »
3. Vous enregistrez ce plan, puis vous relancez la construction en le citant.

Vous n'ajoutez pas la 9e place, l'attente ou les 18 h dans ce message. Vous ne demandez pas d'abord « enlève le paiement » à l'agent déjà parti.

</details>

## Exercice 2 : Trois prompts ont déjà empiré le dépôt

Vous avez écrit, dans l'ordre : « retire le paiement », « remets 45 € », « il manque des stages, et prépare quand même la confirmation ». La page montre 12 lignes, le diff contient un bouton commenté, un prix différent dans les données, et un début de règle des 18 h. Que faites-vous maintenant ?

<details>
<summary>Voir la solution</summary>

Vous arrêtez les réparations. Ce fil est parti, et le code est plus sale qu'au premier écart : paiement caché, 45 € incohérent, confirmation commencée trop tôt.

Vous annulez pour revenir à l'état d'avant ces prompts. Vous rouvrez le plan de l'incrément 1 et vous y écrivez les interdits manquants, sans y mettre la règle des 18 h. Vous relancez une construction neuve. Vous n'envoyez pas un quatrième message du type « nettoie tout ça ». Léa doit revoir une liste simple, pas un dépôt réparé en couches.

</details>

## Exercice 3 : Virgule ou dérive

Deux situations. A : la liste est acceptée, juste (12 stages, samedi 10 h-13 h, 8 places, 45 €, places restantes), et un libellé dit « tarif » au lieu de « 45 € », sur la page que vous connaissez. B : la passe en cours a ajouté un paiement alors que le plan disait seulement la liste. Quel chemin pour A, quel chemin pour B ?

<details>
<summary>Voir la solution</summary>

A n'est pas une dérive de passe. La liste correspond au plan, le geste est petit et habituel : un libellé, un fichier connu. Le mode Agent direct peut corriger ce mot, sans rouvrir tout le plan.

B ne correspond pas au plan. Vous annulez les changements, vous précisez l'interdit de paiement dans le plan, vous relancez. Vous ne traitez pas B comme A avec un petit prompt « enlève le bouton ». Enchaîner des réparations sur cet agent produirait un code plus sale. Le paiement n'est pas une virgule.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Annuler, préciser, relancer
center: "Si le résultat quitte le plan, on annule. On ne répare pas un agent déjà parti."
points:
  - icon: scale
    title: Comparer au plan
    text: "La liste des 12 stages n'inclut pas un paiement. Plus que demandé est une dérive, pas un gain."
  - icon: loop
    title: Annuler
    text: "On refuse cette passe et on revient à l'état d'avant. Un paiement commenté reste une dérive."
  - icon: file
    title: Préciser
    text: "Le plan dit l'interdit : 45 € affiché, aucun encaissement, samedi 10 h-13 h, 8 places."
  - icon: rocket
    title: Relancer
    text: "Une construction neuve cite le plan enregistré. Elle ne raconte pas l'échec en long."
  - icon: alert
    title: Pas de rustines
    text: "Trois prompts de réparation empilent des caches. Le dépôt devient plus sale que l'annulation."
pitfall: "Écrire « retire le paiement » puis « et le prix » puis « et les stages » sans revenir au plan."
remember: "Résultat hors plan : annuler, préciser le plan, relancer. On ne répare pas l'agent déjà parti."
```
