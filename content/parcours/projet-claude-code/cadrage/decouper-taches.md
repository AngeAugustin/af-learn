---
title: "Découper le travail en tâches vérifiables"
description: "Découper App Sève en quatre incréments, chacun avec une commande ou une observation qui prouve qu'il est fini, et n'en confier qu'un par session."
duration: 50
objectives:
  - "Nommer les quatre incréments de Sève dans l'ordre où ils se prouvent"
  - "Écrire, pour chacun, la commande ou l'observation qui dit qu'il est fini"
  - "Ouvrir une session sur une seule tâche, jamais sur l'application entière"
  - "Garder la liste des 12 stages comme première preuve, avant le formulaire"
---

# Une tâche que l'on peut rater

Une tâche est vérifiable quand quelque chose de visible est faux si elle n'est pas finie. « Fais l'application » n'a pas ce moment. On peut toujours dire qu'App Sève est presque prête, ou déjà finie. Léa ne peut pas signer une phrase pareille.

Vous écrivez donc, avant d'ouvrir le terminal, ce qui sera vrai à la fin de la session, et comment vous le verrez. Une commande dont vous lirez la sortie, ou une observation sur la page. Les deux se notent à côté de la tâche. « L'agent a dit que c'était bon » n'est ni l'une ni l'autre.

# Quatre incréments, dans cet ordre

Le travail de Sève se coupe en quatre incréments. Chacun suppose le précédent. Les sauter, c'est vérifier une règle sur un stage qui n'est pas celui de Léa.

1. **La liste.** Les 12 stages du mois, sur une page.
2. **Le refus.** Une 9e inscription est refusée. Les 8 premières restent.
3. **L'attente.** Les demandes au-delà de 8 forment une file, dans l'ordre d'arrivée, avec un plafond de 12. La 13e demande d'attente est refusée.
4. **La confirmation.** Une place non confirmée avant 18 h la veille se libère pour la première personne de l'attente. Une confirmation après 18 h ne la reprend pas.

Le mal des 3 absents explique l'incrément 4. Il ne donne pas le droit de le coder en premier. Sans liste juste, sans refus de la 9e place, sans file ordonnée, la règle des 18 h ne sait pas quelle place libérer, ni à qui.

# La preuve à côté du nom

Vous écrivez la preuve en même temps que le nom. Pour Sève, les quatre preuves sont des observations, produites par une commande que vous aurez lue (lancer l'appli, ou la vérification que la session propose).

| Incrément | Ce qui prouve qu'il est fini |
| --- | --- |
| 1. Liste | 12 stages, samedi 10 h-13 h, Lyon Croix-Rousse, 8 places, 45 € affichés, aucun paiement |
| 2. Refus | La 9e inscription est refusée, avec un message, et les 8 places déjà prises restent prises |
| 3. Attente | L'ordre d'arrivée est visible, la 13e personne en attente est refusée |
| 4. 18 h | Avant 18 h la veille, la place tient. Après, elle passe à la première personne en attente |

« On verra bien à la fin » n'est pas une case de ce tableau. Si vous ne pouvez pas dire quelle sortie ou quelle page serait fausse, la tâche est encore trop grosse, ou trop floue.

```diagram
type: compare
title: "Deux façons d'ouvrir la session"
columns:
  - title: "Phrase trop large"
    tone: rose
    items:
      - "Fais l'application"
      - "Places, attente, SMS et paiement dans le même tour"
      - "Rien qui puisse être visiblement faux"
  - title: "Une tâche, une preuve"
    tone: teal
    items:
      - "Incrément 1 seulement, la liste"
      - "Compter 12 stages, lire l'horaire et le lieu"
      - "Chercher un bouton de paiement, et ne pas en trouver"
```

# Une session, une tâche

La session du jour porte un seul incrément. La première demande le dit, après le chemin du brief.

```text
Lis docs/brief.md.
Session d'aujourd'hui : incrément 1 seulement, la liste des 12 stages.
La preuve : la page affiche ces 12 stages, samedi 10 h-13 h, Croix-Rousse, 8 places, 45 €, sans paiement.
```

Vous n'ajoutez pas « et le formulaire s'il te reste du temps ». Le temps qui reste est précisément la façon dont l'incrément 2 démarre trop tôt, pendant que la liste est encore fausse. Une tâche finie se ferme. La suivante aura sa session, sa preuve, et votre lecture à vous.

> [!IMPORTANT]
> Une session qui commence par « fais l'application » n'a pas de fin observable. Vous la reformulez avant le premier oui, pas au moment où dix fichiers ont déjà bougé.

# La phrase que vous n'écrivez pas

Trois formulations reviennent, et aucune n'est une tâche.

- « Fais l'application. »
- « Fais la réservation complète. »
- « Gère les places, l'attente, le SMS et le paiement. »

Vous les remplacez par le numéro, le nom, et la preuve. Le paiement n'est dans aucune des quatre : il est hors périmètre dans `docs/brief.md`. Le « SMS » de l'incrément 4 est la règle des 18 h, pas un envoi réel. Si la phrase contient un prestataire ou un encaissement, ce n'est pas un découpage. C'est le brief qui a été oublié.

# L'ordre protège la preuve

Vous notez les quatre lignes dans le dépôt, près du brief, avant de lancer la première session de code. L'ordre est une consigne, pas une préférence. L'attente ordonnée se vérifie sur des places déjà refusées au-delà de 8. La règle des 18 h se vérifie sur une file déjà ordonnée. Commencer par l'heure limite, c'est inventer des noms et un ordre que la page ne montre pas encore.

Quand l'incrément 1 est prouvé, vous l'écrivez en une ligne datée du jour, avec ce que vous avez vu. Cette ligne servira demain. Elle ne remplace pas les trois autres preuves, qui restent à obtenir, chacune dans sa session.

# Exercices

## Exercice 1 : Réécrire la phrase large

On vous tend cette demande, prête à coller : « Fais l'application de réservation d'Atelier Sève, avec les places, l'attente, le rappel et le paiement. » Réécrivez la demande de la session d'aujourd'hui.

<details>
<summary>Voir la solution</summary>

Vous n'en gardez que l'incrément 1. La demande cite `docs/brief.md`, annonce la liste des 12 stages, et donne la preuve : samedi 10 h-13 h, Lyon Croix-Rousse, 8 places, 45 € affichés, aucun paiement.

Le refus de la 9e place, l'attente, la règle des 18 h et le paiement sortent de cette session. Le paiement ne revient dans aucune session : il est hors périmètre. Les trois autres incréments attendent leur tour, chacun avec sa preuve déjà écrite.

</details>

## Exercice 2 : Deux incréments dans le même créneau

La liste des 12 stages s'affiche correctement. Il reste une heure. Quelqu'un propose d'enchaîner, dans la même session, le formulaire et l'attente « pour avancer ». Que décidez-vous ?

<details>
<summary>Voir la solution</summary>

Vous fermez la session sur l'incrément 1. Vous notez l'observation (12 stages, horaire, lieu, 8 places, 45 €, pas de paiement). Le formulaire est l'incrément 2 : il a sa propre preuve, le refus de la 9e inscription, et il mérite une session où vous lirez chaque demande.

Enchaîner « pour avancer » mélange deux objectifs. Si le refus est faux, vous ne saurez plus si la liste a bougé en même temps. Une heure restante n'est pas une deuxième tâche.

</details>

## Exercice 3 : L'incrément sans preuve

L'incrément 2 est écrit ainsi : « Gérer les inscriptions ». Aucune commande, aucune observation. Complétez la ligne pour qu'elle puisse échouer visiblement.

<details>
<summary>Voir la solution</summary>

Vous remplacez le verbe vague par le refus. Preuve : après 8 inscriptions tenues, la 9e est refusée, le message le dit, et les 8 places déjà prises ne sautent pas.

Vous pouvez ajouter la commande qui montre cet état (lancer l'appli et saisir la 9e personne, ou la vérification proposée dans la session). Sans cette sortie, « gérer » est une activité, pas une tâche finie. Le plafond de l'attente et les 18 h ne font pas partie de cette preuve : ils ont leurs lignes à eux.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Quatre tâches que l'on peut rater
center: "Quatre incréments, une preuve chacun, une seule tâche par session. On n'écrit pas « fais l'application »."
points:
  - icon: list
    title: Liste
    text: "12 stages, samedi 10 h-13 h, Croix-Rousse, 8 places, 45 € affichés, aucun paiement."
  - icon: shield
    title: Refus
    text: "La 9e inscription est refusée. Les 8 places déjà prises restent prises."
  - icon: users
    title: Attente
    text: "File dans l'ordre d'arrivée, 12 personnes au plus. La 13e demande est refusée."
  - icon: clock
    title: Règle des 18 h
    text: "Sans confirmation avant 18 h la veille, la place passe à la première personne en attente."
  - icon: target
    title: Une session
    text: "La demande du jour nomme un incrément et sa preuve. Le suivant attend sa propre session."
pitfall: "Ouvrir le terminal avec « fais l'application », paiement compris, sans rien qui puisse être visiblement faux."
remember: "Si vous ne pouvez pas dire quelle page ou quelle sortie serait fausse, la tâche n'est pas encore découpée."
```
