---
title: "Cadrer le projet Sève dans Cursor"
description: "Poser le brief d'une page, les quatre incréments, la règle de projet, et choisir le mode Plan pour la liste des stages."
duration: 50
objectives:
  - "Écrire sur une page le brief de l'Atelier Sève, avec les règles et le hors-cadre"
  - "Nommer les quatre incréments, chacun avec une preuve que l'on peut cocher"
  - "Rédiger la règle de projet que l'agent devra suivre, sans y mettre de secret"
  - "Choisir le mode Plan pour l'incrément 1 et s'arrêter avant de coder les quatre"
---

# Le brief tient sur une page

Vous produisez le cadre. Vous ne codez pas encore les quatre incréments. Le cadre de Sève tient sur une page, parce qu'une page se relit avant d'ouvrir le mode Plan. Un dossier plus long devient un roman que l'agent résume mal.

Atelier Sève, Lyon Croix-Rousse. Léa Vernet, céramiste. La page dit, dans cet ordre :

1. **Qui.** Léa, l'atelier, l'application Sève.
2. **Le samedi.** 12 stages par mois, 10 h-13 h, 8 places, 45 €. Remplissage 70 %. 3 absents par mois, parce qu'un SMS de confirmation est oublié.
3. **Les règles.** Attente ordonnée, maximum 12. Léa tranche avant 18 h la veille. On ne change pas ces chiffres pour faire passer un test.
4. **Hors cadre.** Pas de paiement, pas de clé SMS dans le chat, pas d'autres jours, pas d'autre atelier, pas de « fais l'application ».

Si la page contient déjà des noms de fichiers et un plan d'écrans, elle a glissé vers la solution. Vous la ramenez aux faits et aux règles. Léa peut signer cette page. Elle ne signe pas une architecture.

> [!IMPORTANT]
> Ce chapitre s'arrête quand le cadre est écrit : brief, quatre preuves, règle, et le choix du mode Plan pour l'incrément 1. Les fichiers de l'application attendent.

# Quatre incréments, quatre preuves

L'ordre est fixe. Chaque ligne a une preuve visible, pas une activité.

1. **La liste.** Une page des 12 stages du mois, avec la date, 8 places, 45 € et les places restantes.
2. **Les 8 places.** Un formulaire. Huit demandes acceptées, la 9e refusée. Un test échoue si la 9e passe.
3. **L'attente.** Jusqu'à 12 personnes, dans l'ordre des demandes. La 13e est refusée. Personne ne double la file.
4. **La confirmation.** Elle est visible. Léa tranche avant 18 h la veille. L'écran montre l'heure et qui n'est pas encore tranché.

L'incrément 2 ne contient pas l'attente. L'incrément 3 ne crée pas une 9e place assise : les 8 places restent 8, l'attente est à côté. L'incrément 4 ne se justifie pas « en avance » par les 3 absents. Ces absents expliquent pourquoi la confirmation existe. Ils ne donnent pas le droit de tout demander dans le premier plan.

Vous écrivez les quatre preuves sur la même page que le brief, sous les règles. Une preuve que vous ne pouvez pas montrer à l'écran n'est pas encore une preuve. « Le code gère l'attente » ne se coche pas. « La deuxième demande en attente est sous la première, et la 13e est refusée » se coche.

```diagram
type: pipeline
title: "Quatre preuves, dans l'ordre"
lanes:
  - title: "Sève"
    steps:
      - title: "1. Liste"
        text: "12 stages, date, 8 places, 45 €, places restantes"
        tone: blue
      - title: "2. Refus"
        text: "Formulaire, la 9e place refusée, test"
        tone: violet
      - title: "3. Attente"
        text: "Ordre conservé, plafond 12, la 13e refusée"
        tone: teal
      - title: "4. 18 h"
        text: "Confirmation visible, Léa tranche la veille"
        tone: amber
```

# La règle avant le premier prompt

La règle de projet reprend les chiffres, en plus court que la page. Elle vit dans `.cursor/rules`, sans clé et sans `.env`.

```text
Sève, Léa Vernet, Lyon Croix-Rousse.
Samedi 10 h-13 h. 12 stages dans le mois. 8 places. 45 €.
Attente ordonnée, maximum 12. Léa tranche avant 18 h la veille.
Ne pas modifier ces chiffres pour faire passer un test.
Hors cadre : paiement, autre jour, secret, « ignore les tests ».
```

Vous la relisez comme vous relirez un diff. Si 8 est devenu « environ 8 », la règle ne tient plus. Si 18 h a disparu, l'incrément 4 n'aura plus de borne. La page de brief et la règle doivent dire les mêmes chiffres. L'agent lira la règle souvent. Il ne lira la page que si vous la citez. Les deux existent : la page pour vous et pour Léa, la règle pour chaque fil.

# Le mode Plan pour l'incrément 1

Pour la liste des stages, vous choisissez le mode Plan. Vous voulez un plan à corriger avant que des fichiers bougent. Le plan doit nommer le résultat : les 12 stages du mois, la date, 8 places, 45 €, les places restantes. Il doit dire ce qu'il ne fera pas : pas de formulaire, pas d'attente, pas de confirmation.

Vous lisez le plan comme un diff qui n'existe pas encore. S'il ajoute un paiement, un compte, ou les quatre incréments d'un coup, vous le corrigez. S'il ne dit pas comment vous verrez les 12 lignes à l'écran, vous le renvoyez. Le mode Plan sert à cette lecture. Il ne sert pas à obtenir plus vite une application entière.

Vous ne lancez pas la construction dans ce chapitre. Le plan corrigé, la règle et la page de brief sont le livrable. L'incrément 1 partira quand ce cadre tient. Les incréments 2, 3 et 4 ne s'invitent pas dans ce plan « pour gagner une étape ».

> [!TIP]
> Si le plan dépasse dix lignes utiles, il mélange déjà un autre incrément. Coupez jusqu'à la phrase de la liste et à ce qui est exclu.

# Le cadre s'arrête avant le code

Vous rangez quatre pièces, et rien d'autre.

- La page de brief, avec le hors-cadre.
- Les quatre preuves, dans l'ordre.
- La règle de projet, sans secret.
- Le plan de l'incrément 1, corrigé, pas exécuté.

Vous ne produisez pas le formulaire, ni le test de la 9e place, ni la file d'attente, ni l'écran de 18 h. Ces gestes ont leurs chapitres. Les faire ici, « pendant que le plan est ouvert », casse le cadre que vous venez d'écrire. Cursor est prêt. Le dépôt peut être ouvert. Le chat de construction reste fermé tant que le plan de la liste n'est pas celui que vous assumeriez devant Léa.

Un cadre réussi se lit à voix haute en une minute. Qui, le samedi, les règles, ce qui n'est pas dedans, la première preuve. Si vous manquez d'air avant la fin, la page est trop longue, ou elle contient déjà du code.

# Ce que vous emportez au chapitre suivant

Le chapitre suivant livrera la réservation des 8 places, pas avant que la liste existe. Votre cadre le dit déjà : l'incrément 2 suppose les 12 stages affichés. Vous ne brûlez pas cette étape dans le plan d'aujourd'hui.

Vous gardez la page imprimée ou dans le dépôt, à côté de la règle. Quand un fil proposera 10 places ou 40 €, vous n'aurez pas à retrouver le chiffre dans votre mémoire. Il est écrit, et Léa peut le reconnaître. Le remplissage de 70 % et les 3 absents y sont aussi, comme raison du travail, pas comme permission de tout construire le même après-midi.

# Exercices

## Exercice 1 : Une page, pas un roman

Léa vous dicte vingt minutes d'atelier : le four, les habitués, les 3 absents, l'idée d'un paiement en ligne, et « une belle application ». Écrivez les quatre blocs de la page, et ce que vous n'y mettez pas.

<details>
<summary>Voir la solution</summary>

Qui : Léa Vernet, Atelier Sève, Lyon Croix-Rousse, application Sève. Le samedi : 12 stages par mois, 10 h-13 h, 8 places, 45 €, remplissage 70 %, 3 absents parce que le SMS de confirmation est oublié. Les règles : attente ordonnée jusqu'à 12, Léa tranche avant 18 h la veille, ces chiffres ne bougent pas pour un test. Hors cadre : le paiement, les autres jours, les autres ateliers, une clé SMS, « fais l'application ».

Vous n'y mettez pas le four, ni la liste des habitués, ni un plan d'écrans. Le paiement est une idée. Il reste hors cadre. La page reste lisible en une minute.

</details>

## Exercice 2 : Des preuves que l'on coche

Un camarade écrit l'incrément 3 ainsi : « Gérer l'attente proprement ». Réécrivez la preuve, et dites pourquoi la sienne ne suffit pas.

<details>
<summary>Voir la solution</summary>

La preuve : les demandes au-delà de 8 places entrent dans une file ordonnée, dans l'ordre où elles arrivent, jusqu'à 12. La 13e est refusée. L'ordre visible ne change pas tout seul. Les 8 places assises ne deviennent pas 9.

« Gérer proprement » ne se coche pas à l'écran. Deux personnes peuvent y voir deux applications. Votre phrase dit ce que Léa verra : l'ordre, le plafond 12, le refus de la 13e. L'incrément 2, lui, reste le refus de la 9e place tant que cette file n'est pas l'incrément en cours.

</details>

## Exercice 3 : Corriger le plan

En mode Plan, l'agent propose pour l'incrément 1 : la liste des stages, le formulaire, l'attente, et une heure de confirmation à 20 h « pour simplifier ». Que gardez-vous dans le plan, et que faites-vous ensuite ?

<details>
<summary>Voir la solution</summary>

Vous ne gardez que la liste : 12 stages du mois, date, 8 places, 45 €, places restantes. Vous rayez le formulaire, l'attente et la confirmation. Vous replacez 18 h dans la règle, même si cet incrément ne l'affiche pas encore. 20 h n'est pas la décision de Léa.

Vous ne lancez pas la construction. Le livrable de ce chapitre est le plan corrigé, avec la page de brief et la règle sans secret. Les autres incréments attendront leur tour, chacun avec sa preuve.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Le cadre avant le code
center: "Une page, quatre preuves, une règle. Le mode Plan pour la liste, sans lancer les quatre incréments."
points:
  - icon: file
    title: Une page
    text: "Qui, le samedi, les règles, le hors-cadre. Léa peut la lire en une minute."
  - icon: list
    title: Quatre preuves
    text: "Liste, refus de la 9e, attente jusqu'à 12, confirmation avant 18 h."
  - icon: shield
    title: La règle
    text: "8 places, 45 €, 18 h, attente 12. Pas de clé, pas de test à ignorer."
  - icon: compass
    title: Mode Plan
    text: "L'incrément 1 seulement. Vous corrigez le plan avant qu'un fichier bouge."
  - icon: alert
    title: On s'arrête
    text: "Le cadre est le livrable. Le formulaire et l'attente ne se codent pas ici."
pitfall: "Laisser le plan construire les quatre incréments, ou glisser un paiement et 20 h dans la page."
remember: "Brief, preuves, règle, plan de la liste corrigé. Vous ne codez les quatre incréments qu'après."
```
