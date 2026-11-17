---
title: "Agent, Plan, Ask et Tab"
description: "Choisir Agent, Plan, Ask ou Tab selon que le geste sur Sève est clair, flou, ou seulement une question."
duration: 50
objectives:
  - "Faire tourner les modes avec Shift+Tab depuis le champ de chat"
  - "Garder Plan pour un changement flou ou réparti sur plusieurs fichiers"
  - "Utiliser Agent pour un petit changement déjà clair, et Ask pour comprendre sans éditer"
  - "Situer Tab comme la complétion dans l'éditeur, distincte des modes du chat"
---

# Quatre gestes, pas un bouton

Le champ de chat a des modes. Depuis ce champ, **Shift+Tab** les fait tourner, dont Plan. Le sélecteur de mode, dans le panneau, affiche le même choix. Vous regardez le nom du mode avant d'envoyer. Envoyer au mauvais mode fait éditer quand vous vouliez lire, ou lancer une construction quand vous vouliez un plan.

Atelier Sève, Lyon Croix-Rousse. Léa Vernet, céramiste, tient 12 stages par mois, le samedi de 10 h à 13 h, 8 places, 45 €. La liste d'attente est plafonnée à 12. Léa confirme ou refuse avant 18 h la veille. Le remplissage actuel est de 70 %. 3 absents en moyenne par mois, parce que la confirmation est un SMS oublié. L'application s'appelle Sève.

Les modes du chat qui servent ici sont Agent, Plan et Ask. La rotation passe aussi par Debug : vous le laisserez tant que rien n'est cassé à l'exécution. Tab n'est pas un mode du chat. C'est la complétion dans l'éditeur, traitée au chapitre suivant. La situer maintenant évite de la confondre avec un quatrième bouton du panneau.

Changer de mode ouvre un contexte neuf. Vous ne tournez pas Shift+Tab au milieu d'un incrément en espérant que la phrase précédente suive. Vous finissez le geste, ou vous ouvrez un fil clair.

# Agent, pour un changement déjà clair

Agent édite. Il lit le dépôt, modifie les fichiers, peut lancer une commande dans le terminal intégré. Vous le prenez quand le résultat tient en une phrase et que vous savez déjà quoi vérifier dans le diff.

Sur Sève, Agent convient au petit ajustement de la page déjà cadrée : « sur la page des 12 stages, affiche 45 € à côté de chaque date, sans toucher au nombre de places ». Le diff doit rester court. Vous y cherchez 45 €, et vous vérifiez que 8 places n'a pas bougé.

Agent ne convient pas à « améliore la réservation ». Cette phrase n'a pas de bord. L'agent va ouvrir le formulaire, l'attente et la confirmation dans le même passage. Vous récupérez un diff que vous ne pouvez plus lire d'un coup.

> [!TIP]
> Si vous pouvez désigner le fichier et la ligne attendue, prenez Agent. Si vous en êtes encore à chercher quels fichiers, prenez Plan.

# Plan, pour un changement flou

Plan Mode ne code pas tout de suite. Il cherche dans le code, pose des questions, écrit un plan que vous pouvez modifier, puis vous cliquez pour construire. Cursor le propose aussi quand la demande a l'air large. Vous pouvez le choisir vous-même avec Shift+Tab.

Vous gardez Plan pour un changement flou ou pour un changement qui traverse plusieurs fichiers. Le troisième incrément est de cet ordre : une liste d'attente jusqu'à 12, dans l'ordre, branchée sur une page qui montre déjà les 8 places. Plusieurs fichiers, une règle de plafond, un ordre à ne pas inventer. Le plan doit dire quels fichiers, quelle règle (pas plus de 12, l'ordre d'arrivée), et ce qu'il ne fait pas (il ne tranche pas à la place de Léa).

Vous lisez le plan comme vous lirez le diff. S'il prévoit un paiement, un compte, ou des stages en plus des 12 du mois, vous le corrigez avant de cliquer. Construire sur un plan faux est plus long à défaire qu'une phrase à réécrire.

Le plan reste éditable. Vous pouvez y remettre les chiffres : samedi de 10 h à 13 h, 8 places, 45 €, attente plafonnée à 12, Léa confirme ou refuse avant 18 h la veille. Ces chiffres ne sont pas un décor. Un plan qui les oublie construira autre chose.

```diagram
type: decision
title: Quel mode pour le geste en cours
nodes:
  - question: "Voulez-vous seulement comprendre, sans modifier les fichiers ?"
    yes: "Ask. Par exemple, où les 8 places sont-elles écrites ?"
    no: "Le geste doit changer le dépôt."
  - question: "Le changement est-il déjà petit et clair ?"
    yes: "Agent. Un diff court, un résultat que vous pouvez relire."
    no: "Plan. Changement flou ou plusieurs fichiers, plan éditable, puis construire."
```

# Ask, pour comprendre sans éditer

Ask lit le dépôt et répond. Il n'écrit pas le diff. Vous le prenez quand la question est « comment c'est fait », pas « change ceci ».

Avant le formulaire qui refuse la 9e place, vous pouvez demander : « Où le nombre de places est-il fixé, et que se passe-t-il si une réservation dépasse 8 ? » Ask montre les fichiers. Vous décidez ensuite, dans un autre geste, de faire éditer.

Ask sert aussi à ne pas abîmer un incrément terminé. La page des 12 stages est juste. Vous voulez savoir si le prix est écrit une fois. Vous ne passez pas en Agent « pour voir ». Un mode qui édite va « voir » en modifiant.

> [!WARNING]
> Ask qui commence à proposer un patch n'est plus le geste que vous aviez choisi. Vous vouliez une lecture. Revenez au mode affiché dans le champ avant d'envoyer la suite.

# Tab se situe à côté

Tab propose la suite du texte pendant que vous tapez dans l'éditeur. La suggestion apparaît dans la ligne, en grisé. Ce n'est pas le chat, et Shift+Tab ne l'active pas : Shift+Tab fait tourner les modes du champ de chat.

Vous situerez le geste au chapitre suivant : accepter une suggestion courte, lisible d'un coup d'œil, et ne pas laisser Tab inventer la règle des 8 places. Ici, il suffit de ne pas le confondre avec Agent. Agent suit une demande dans le chat. Tab suit le fichier ouvert et ce que vous venez de taper.

Les règles du projet, que vous écrirez plus tard, guident l'agent. Elles ne pilotent pas Tab. D'où la relecture, même sur une suggestion d'une ligne.

# Quel mode pour quel incrément

| Incrément | Mode | Pourquoi |
| --- | --- | --- |
| Page des 12 stages, date, 8 places, 45 €, places restantes | Plan, puis construire | Plusieurs fichiers possibles, résultat à figer avant le diff |
| Formulaire qui refuse la 9e place | Agent, si la page existe et la règle est écrite | Changement court, bord clair : jamais 9 |
| Liste d'attente jusqu'à 12, dans l'ordre | Plan | Plafond, ordre, lien avec les places déjà prises |
| Confirmation visible, Léa tranche avant 18 h | Plan | Règle d'heure, écran à voir, pas un SMS en plus |

Les 3 absents et le SMS oublié expliquent le quatrième incrément. Ils ne sont pas une raison de prendre Agent avec la phrase « gère les absents ». Debug attendra une erreur réelle, pas un remplissage à 70 % qui est un fait d'atelier, pas un plantage.

Vous nommez le mode à voix haute avant d'envoyer. « Plan, liste d'attente, plafond 12. » Si le champ affiche autre chose, Shift+Tab, puis la phrase.

# Exercices

## Exercice 1 : Le champ affiche Agent

Vous voulez savoir, sans rien modifier, où le prix de 45 € est écrit dans la page des 12 stages. Le champ de chat est en Agent. Que faites-vous ?

<details>
<summary>Voir la solution</summary>

Vous passez en Ask avec Shift+Tab, ou avec le sélecteur, jusqu'à ce que le champ affiche Ask. Puis vous posez la question. Agent éditerait pour « répondre ». Vous voulez une lecture.

Vous ne changez pas de mode au milieu de la réponse en espérant garder le même contexte : un changement de mode ouvre un contexte neuf. La question part une fois, dans le bon mode.

</details>

## Exercice 2 : Choisir Plan

La page des stages existe. Léa demande la liste d'attente : 12 personnes au plus, dans l'ordre d'arrivée, sans prendre une place des 8 tant que Léa n'a pas tranché. Pourquoi Plan, et que doit contenir le plan avant le clic ?

<details>
<summary>Voir la solution</summary>

Le changement est flou tant que les fichiers ne sont pas nommés, et il en touche plusieurs : la page, la file, la règle de plafond. Plan cherche dans le code, pose les questions utiles, écrit un plan éditable.

Avant de cliquer pour construire, le plan dit : plafond 12, ordre conservé, pas de 9e place sur les 8, pas de confirmation à la place de Léa (elle tranche avant 18 h, incrément suivant). S'il ajoute un paiement ou des stages hors des 12 du mois, vous le corrigez d'abord.

</details>

## Exercice 3 : Le petit changement

La page affiche « 45 euros » au lieu de « 45 € », et les 8 places sont déjà justes. Agent, Plan ou Ask ? Que relisez-vous ensuite ?

<details>
<summary>Voir la solution</summary>

Agent. Le changement est petit et déjà clair : le libellé du prix, rien d'autre. Plan serait trop lourd. Ask ne modifierait pas le fichier.

Vous relisez le diff pour vérifier que seules ces lignes ont bougé, et que 8 places, les 12 dates et les places restantes sont intacts. Tab n'est pas le bon geste ici : vous ne corrigez pas le fichier à la main ligne après ligne, vous demandez un changement borné et vous le voyez.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Quatre gestes
center: "Shift+Tab tourne les modes du chat. Tab, lui, complète dans l'éditeur."
points:
  - icon: zap
    title: Shift+Tab
    text: "Depuis le champ de chat, fait tourner les modes, dont Plan. Le nom affiché compte."
  - icon: compass
    title: Plan
    text: "Cherche dans le code, pose des questions, plan éditable, puis vous cliquez pour construire."
  - icon: tool
    title: Agent
    text: "Petit changement déjà clair. Le diff reste court, comme un libellé à 45 €."
  - icon: search
    title: Ask
    text: "Comprendre sans éditer. Où sont les 8 places, sans ouvrir un formulaire."
  - icon: code
    title: Tab à part
    text: "Complétion dans la ligne, pas un mode du chat. Le chapitre suivant détaille le geste."
pitfall: "Lancer Agent sur « améliore la réservation », ou croire que Tab se choisit avec Shift+Tab."
remember: "Clair et petit : Agent. Flou ou multi-fichiers : Plan. Lecture seule : Ask. La suite dans la ligne : Tab."
```
