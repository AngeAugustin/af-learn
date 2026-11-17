---
title: "Le quoi et le pourquoi"
description: "Décrire dans le chat, avec /speckit-specify, ce que la personne voit et pourquoi, et laisser la pile technique au plan."
duration: 50
objectives:
  - "Décrire le comportement visible et le but, sans nommer de pile"
  - "Réserver Next, Postgres et toute autre technique à /speckit-plan"
  - "Tenir l'attente de Sève : ordre d'arrivée, plafond 12, aucun téléphone, décision avant 18 h"
  - "Laisser la liste des 12 stages et le refus de la 9e place tels qu'ils existent déjà"
---

# Ce que la personne peut constater

Léa Vernet tient Atelier Sève, un stage de céramique à Lyon Croix-Rousse. Le créneau est le samedi, de 10 h à 13 h, avec 8 places à 45 €. Elle ouvre 12 stages dans le mois. Le remplissage observé est de 70 %. Trois personnes manquent chaque mois, parce que le SMS de rappel est oublié.

L'application a déjà la liste de ces 12 stages. Elle refuse déjà une 9e inscription. La fonctionnalité en cours ajoute deux choses visibles : une attente ordonnée, et une confirmation que la personne peut lire. GitHub Spec Kit reçoit ce comportement par le skill `/speckit-specify`, dans le chat de l'agent.

Le quoi, c'est ce qu'une personne constate sur la page. Elle voit qu'elle est en attente. Elle voit l'ordre. Elle voit un refus, ou une phrase. Le pourquoi, c'est le but de cet écran : savoir où l'on en est sans appeler l'atelier, et voir que Léa tranche avant 18 h la veille.

> [!IMPORTANT]
> `/speckit-specify` décrit le comportement visible et le but. Vous l'écrivez dans le chat de l'agent. Le terminal ne reçoit pas ce skill.

# Le but tient dans une phrase de Léa

Léa doit pouvoir contredire le but. « Une belle attente » ne se contredit pas. « La personne voit qu'elle attend, et elle lit l'heure limite » se contredit : il suffit d'ouvrir la page et de ne pas trouver la phrase.

Le SMS oublié explique les 3 absents. Il reste le contexte. Cette spécification ne demande pas d'envoyer un SMS. Elle demande que l'attente et la décision se voient. Le prix reste un prix affiché, 45 €. Personne ne paie depuis cette page.

Vous pouvez dire le but à voix haute devant le stage du samedi. Si la phrase contient 8 places, 12 noms, 18 h ou 45 €, Léa peut répondre oui ou non. Si elle contient un nom de framework, elle a quitté le quoi.

# Le message parle de l'écran

Dans le chat, le skill ouvre le message. Le texte qui suit dit ce qui se passe pour une personne, puis pourquoi cela existe. Vous n'ajoutez pas un second message « et maintenant choisis la technique ». Un seul envoi, un seul sujet : le comportement.

Pour Sève, le cœur du message est celui-ci. Une personne qui n'a pas de place voit qu'elle est en attente. L'ordre est celui de l'arrivée. Le 12e nom est accepté dans l'attente, le 13e nom est refusé. La page publique ne montre pas les téléphones. Léa tranche avant 18 h la veille, et cette heure se lit à l'écran.

Le stage décrit dans ce message reste celui du fil rouge : samedi, 10 h-13 h, 8 places, 45 €, Lyon Croix-Rousse. La liste des 12 stages et le refus de la 9e place existent déjà. Le message peut le rappeler pour borner le sujet. Il ne redemande pas de les construire.

> [!NOTE]
> L'ordre d'arrivée, le plafond de 12 noms et l'absence de téléphone sont des faits d'écran. Ils se vérifient en regardant la page, sans ouvrir un fichier de code.

# La pile attend le plan

Next, Postgres, un autre framework, une autre base : ces mots nomment une pile. Ils n'entrent pas dans `/speckit-specify`. Ils attendent `/speckit-plan`, quand le comportement est écrit et relu.

Pour Atelier Sève, la question n'est pas de choisir une pile nouvelle. L'application est déjà en place. Nommer une technique dans la spécification pousse l'agent à reconstruire l'atelier au lieu de décrire l'attente. Le plan, plus tard, dira de rester sur cette application. La spec, maintenant, dit ce que l'on voit.

```diagram
type: compare
title: "Deux moments, deux textes"
columns:
  - title: "Chat : /speckit-specify"
    tone: teal
    items:
      - "La personne voit qu'elle est en attente"
      - "L'ordre est celui de l'arrivée"
      - "Le 13e nom est refusé"
      - "La page publique ne montre pas les téléphones"
      - "Léa tranche avant 18 h, et la phrase se voit"
  - title: "Plus tard : /speckit-plan"
    tone: amber
    items:
      - "Rester sur l'application déjà en place"
      - "Un nom de pile, seulement si le projet en choisit un"
      - "Aucun SDK de paiement"
      - "Aucun envoi de SMS"
```

Si un brouillon mélange les deux colonnes, vous le coupez avant l'envoi. La colonne de gauche part avec `/speckit-specify`. La colonne de droite attend une spec relue. Le prix, le plafond et l'heure ne se choisissent pas au moment de la pile : ils sont déjà dans le quoi.

# Deux plafonds, deux chiffres

Le stage a 8 places. La 9e inscription est refusée, et ce refus est déjà dans l'application. L'attente est une autre file. Elle accepte 12 noms. Le 12e nom entre dans l'attente. Le 13e nom est refusé. Confondre les deux plafonds produit un stage à 12 places, ou une attente de 8 noms. Aucun des deux n'est le comportement demandé.

Le chiffre 10 n'a pas de rôle. Ni 10 places, ni une attente de 10. Si vous l'écrivez « pour arrondir », Léa ne peut plus constater la règle. Vous gardez 8 pour le stage et 12 pour l'attente, dès le premier message.

La page publique montre l'état d'attente, l'ordre, et la phrase « avant 18 h ». Elle ne montre pas les numéros de téléphone. Léa peut connaître ces numéros dans son travail. L'écran ouvert à tout le monde ne les affiche pas.

# Ce que le premier message ne rouvre pas

Les 12 stages du mois, le samedi 10 h-13 h, les 45 € affichés, le remplissage de 70 % et les 3 absents restent le décor du fil rouge. Vous ne transformez pas ce décor en liste de travaux. Le remplissage n'est pas une étiquette à poser sur chaque stage. Les absents n'ouvrent pas un envoi de SMS dans le même texte.

Vous laissez aussi le refus de la 9e place tranquille. Le nouveau texte ne dit pas « le stage passe à 10 places », ni « on retire le refus pour remplir davantage ». Il ajoute l'attente à côté du refus déjà là, puis la confirmation visible.

> [!WARNING]
> Un message qui commence par un framework, un paiement ou un SMS n'est pas encore une spécification. Vous le réécrivez en comportements visibles, puis vous le confiez à `/speckit-specify`.

# Exercices

## Exercice 1 : Trois messages, un seul skill

Voici trois textes. Dites lequel peut suivre `/speckit-specify` dans le chat, et où vont les deux autres.

1. « Une personne voit qu'elle est en attente, dans l'ordre d'arrivée. Le 13e nom est refusé. La page publique ne montre pas les téléphones. La phrase « avant 18 h » est à l'écran. »
2. « Utilise Next et Postgres, et prévois un SDK pour encaisser les 45 €. »
3. « Envoie le SMS des 3 absents et reconstruis la liste des 12 stages. »

<details>
<summary>Voir la solution</summary>

Le texte 1 suit `/speckit-specify`. Il dit ce que l'on voit : l'attente, l'ordre, le refus du 13e nom, l'absence de téléphone, la phrase à l'écran.

Le texte 2 parle de pile et de paiement. Next et Postgres attendent `/speckit-plan`. Le SDK de paiement ne fait pas partie de cette fonctionnalité : 45 € reste un prix affiché.

Le texte 3 ne part ni avec specify, ni avec le plan de cette fonctionnalité. L'application a déjà la liste des 12 stages. L'envoi de SMS n'est pas demandé. Les 3 absents expliquent le contexte, ils ne deviennent pas un travail caché dans le message.

</details>

## Exercice 2 : Réécrire un brouillon

On vous propose : « Une attente moderne, sur une nouvelle base, environ 10 places, et les mobiles visibles pour que ce soit pratique. » Réécrivez le quoi et le pourquoi, avec les chiffres de Sève.

<details>
<summary>Voir la solution</summary>

« Une personne qui n'a pas de place parmi les 8 voit qu'elle est en attente. L'ordre est celui de l'arrivée. Le 12e nom est accepté, le 13e est refusé. La page publique ne montre pas les téléphones. Léa Vernet tranche avant 18 h la veille, et la phrase « avant 18 h » est à l'écran. Le but : savoir où l'on en est sans appeler l'atelier. »

Vous retirez « moderne », « nouvelle base » et « pratique ». Vous remplacez 10 places par la règle réelle : 8 places au stage, 12 noms dans l'attente. Les téléphones sortent de la page publique. Ce texte peut suivre `/speckit-specify`. La base, s'il fallait la nommer, attendrait le plan. Ici, l'application est déjà en place.

</details>

## Exercice 3 : Déjà là, ou nouveau

Classez chaque fait. Déjà dans l'application, ou nouveau dans cette spécification ?

1. La page liste 12 stages du mois.
2. Une 9e inscription est refusée.
3. Le 13e nom d'attente est refusé.
4. La phrase « avant 18 h » est à l'écran.

<details>
<summary>Voir la solution</summary>

1 et 2 sont déjà vrais. La spec ne les redemande pas et ne les contredit pas. Le stage reste à 8 places, donc la 9e inscription reste refusée. Les 12 stages restent ceux du mois, le samedi, 10 h-13 h, à Lyon Croix-Rousse.

3 et 4 sont le nouveau comportement. L'attente est plafonnée à 12 noms, le 13e est refusé, et la décision de Léa se voit avant 18 h la veille. Le prix affiché, 45 €, ne change pas non plus. Les 70 % et les 3 absents restent le contexte, pas une troisième fonctionnalité.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Le quoi avant la pile"
center: "Décrire ce que la personne voit et pourquoi. Next et Postgres attendent le plan."
points:
  - icon: eye
    title: "Elle se voit attendre"
    text: "La personne lit qu'elle est en attente. L'ordre affiché est celui de l'arrivée, pas un autre tri."
  - icon: gauge
    title: "Deux plafonds"
    text: "Le stage a 8 places, la 9e inscription est déjà refusée. L'attente prend 12 noms, le 13e est refusé."
  - icon: clock
    title: "Avant 18 h"
    text: "Léa tranche avant 18 h la veille. La phrase « avant 18 h » se lit à l'écran, sur la page."
  - icon: lock
    title: "Sans téléphone"
    text: "La page publique ne montre pas les numéros. On le constate en regardant l'écran, pas le code."
  - icon: compass
    title: "Pile au plan"
    text: "Un nom de framework ou de base part avec /speckit-plan. Le chat de specify reste sur le visible."
pitfall: "Envoyer Next, Postgres, un paiement ou un SMS dans /speckit-specify. Le quoi disparaît sous la pile, et 10 places remplace 8."
remember: "Le chat reçoit /speckit-specify : comportement visible et but. La pile attend /speckit-plan, skill suivant, pas le terminal."
```
