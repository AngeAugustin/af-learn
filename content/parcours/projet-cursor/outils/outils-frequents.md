---
title: "Cinq outils, et quand les laisser coupés"
description: "Choisir entre GitHub, le navigateur, Playwright, une base en lecture et Figma, et le skill qui dit lequel appeler."
duration: 50
objectives:
  - "Brancher l'outil qui prouve l'incrément en cours, et couper les autres"
  - "Distinguer un coup d'œil dans le navigateur et un test Playwright"
  - "Garder la base en lecture seule et Figma pour le jour où Léa a un écran"
  - "Écrire un skill qui choisit l'outil au lieu d'en empiler cinq"
---

# Un outil par preuve

Le chapitre sur MCP a branché un seul serveur, celui qui lit le tableau des stages. Les outils que l'on installe le plus souvent sont au nombre de cinq. Les brancher tous « pour être paré » noie le chat et multiplie les approbations. À l'Atelier Sève, Lyon Croix-Rousse, Léa Vernet tient 12 stages par mois, le samedi de 10 h à 13 h, 8 places, 45 €. L'attente s'arrête à 12. Elle tranche avant 18 h la veille. Le remplissage est à 70 %, et 3 personnes manquent chaque mois parce qu'un SMS a été oublié.

Chaque incrément a une preuve. L'outil branché est celui qui produit cette preuve. Les autres restent coupés dans la page Customize, ou absents de `.cursor/mcp.json`.

| Incrément | Preuve | Outil branché | Laissé coupé |
| Liste des 12 stages | 12 cartes, 45 €, places restantes | Navigateur | Figma, base, Playwright, GitHub |
| Refus de la 9e place | Le formulaire refuse | Playwright | SMS, paiement |
| Attente jusqu'à 12 | L'ordre des noms, le 13e refusé | Base en lecture, si les noms y sont | Écriture en base |
| Confirmation et 18 h | L'écran rappelle l'heure | Navigateur | Serveur d'envoi |

> [!WARNING]
> Un serveur d'envoi de SMS ou un SDK de paiement ne se branche pas parce que 3 absents viennent d'un message oublié. La confirmation visible est une règle de l'application. L'envoi viendra le jour où Léa le demandera.

# GitHub, seulement s'il y a un ticket

Le serveur MCP GitHub lit un ticket ou une revue sans que vous colliez le fil dans le chat. Il sert quand Léa, ou un collègue, a déjà écrit le retour quelque part : « les places restantes sont trop petites », avec le numéro du ticket.

Sans ticket, le serveur ne sait rien de Sève. Le brancher pour l'incrément 1 n'aide pas à compter 12 stages. Vous le laissez coupé. Le jour où un retour existe, vous l'activez, vous citez le numéro, et vous demandez une lecture. Vous n'autorisez pas l'outil à commenter ou à fermer le ticket à votre place.

Le skill `verifier-une-reservation` ne va pas chercher le ticket. Il rappelle 8 places, 45 € et l'attente de 12. GitHub et ce skill ne font pas le même métier.

# Le navigateur compte, Playwright rejoue

Deux outils regardent l'écran, pour deux preuves différentes.

Le **navigateur** de l'agent ouvre la page une fois. Vous lui demandez de compter les cartes, de lire 45 €, de noter les places restantes. C'est le geste de l'incrément 1, et celui de l'incrément 4 quand il faut voir « Léa tranche avant 18 h ». Un coup d'œil ne reste pas. Demain, personne ne le relance.

**Playwright** transforme le geste en test. Il sert à partir de l'incrément 2 : ouvrir le formulaire, remplir une 9e demande sur un stage déjà à 8 places, et échouer si la place est acceptée. Le serveur MCP Playwright lance ce scénario. Vous lisez la sortie. Un résumé de l'agent qui dit « la page a l'air bonne » ne remplace pas cette sortie.

```diagram
type: decision
title: "Navigateur ou Playwright"
nodes:
  - question: "Le geste doit-il rester un test, relançable demain ?"
    yes: "Playwright. Le refus de la 9e place en est un."
    no: "Navigateur. Compter 12 cartes une fois suffit."
  - question: "Êtes-vous encore sur la liste, sans formulaire ?"
    yes: "Navigateur seulement. Playwright attend le formulaire."
    no: "Le test du refus peut s'ajouter, le coup d'œil aussi."
```

# La base en lecture, Figma si l'écran existe

Un serveur de base, Postgres ou l'équivalent déjà utilisé par Sève, sert quand les réservations sont enregistrées et que vous devez les lire : combien de places sont prises samedi, dans quel ordre sont les 12 noms d'attente. La connexion que vous approuvez est en **lecture**. Un outil qui insère, met à jour ou efface ne se valide pas dans ce chapitre. Le refus de la 9e place se prouve par le test, puis par une lecture. Il ne se prouve pas en laissant l'agent « corriger la ligne ».

Figma sert le jour où Léa envoie un lien de maquette, par exemple les places restantes en gros. Sans lien, le serveur n'a rien à lire. Le brancher pendant l'incrément 1 ajoute une approbation et aucun stage. Vous le couperez encore après la maquette : le fichier de design n'est pas la règle des 8 places.

> [!NOTE]
> Le tableau des stages du chapitre MCP reste le serveur utile tant que les 12 dates vivent dans ce tableau. La base le remplace seulement quand l'application enregistre déjà les demandes.

# Le skill qui choisit

Vous n'empilez pas cinq skills. Vous en ajoutez un à côté de `verifier-une-reservation`, dans `.cursor/skills/choisir-outil/SKILL.md`. La description dit quand le charger : on cherche comment prouver un incrément de Sève. Le corps tient en une table courte, la même que plus haut, plus trois interdits : pas de SMS, pas de paiement, pas d'écriture en base.

L'agent le charge si vous écrivez « comment je vérifie la 9e place ». Il doit répondre Playwright, pas « je peux aussi ouvrir Figma et GitHub ». Si la description dit seulement « aide sur Sève », il se chargera au mauvais moment et proposera trop d'outils. Vous resserrez la description, comme pour le skill de réservation.

Une commande `/cadre-seve` peut encore coller les chiffres en début de fil. Elle ne choisit pas l'outil. Le skill le fait. La règle des 8 places, elle, reste une règle : elle s'applique même quand personne ne tape `/`.

# Ce qui reste coupé

Avant d'accepter un diff de `.cursor/mcp.json`, vous lisez la liste des serveurs. Pour l'incrément en cours, un seul nom nouveau est normal. Deux noms nouveaux se justifient seulement si la preuve en a besoin, par exemple le navigateur et Playwright le jour du formulaire. Cinq noms d'un coup se refusent.

Vous coupez dans Customize ce qui ne sert pas cette semaine. Un serveur coupé ne se charge pas. Le secret d'un outil que vous n'utilisez pas n'a aucune raison d'être sur la machine du projet.

# Exercices

## Exercice 1 : La maquette arrive trop tôt

Léa envoie un lien Figma pendant que vous construisez la liste des 12 stages. L'agent propose d'ajouter le serveur Figma, le serveur GitHub et Playwright « pour prendre de l'avance ». Que branchez-vous ?

<details>
<summary>Voir la solution</summary>

Vous ne branchez aucun des trois. La preuve de cet incrément est 12 cartes, 45 €, des places restantes, vues dans le navigateur. Figma attendra un incrément dont l'écran est le sujet. GitHub attend un ticket. Playwright attend le formulaire qui refuse la 9e place.

Vous le dites dans le fil, en une phrase, et vous refusez le diff de `mcp.json` s'il les ajoute. Le lien Figma se note dans le brief. Il ne se configure pas aujourd'hui.

</details>

## Exercice 2 : Le skill trop accueillant

Le skill `choisir-outil` a pour description « aide sur Sève ». Sur la question « comment je prouve le refus de la 9e place », l'agent propose d'ouvrir Figma, de commenter un ticket GitHub et d'écrire en base. Que corrigez-vous ?

<details>
<summary>Voir la solution</summary>

Vous réécrivez la description : choisir l'outil qui prouve un incrément de Sève (liste, 9e place, attente, 18 h). Le corps dit : 9e place, c'est Playwright. Il interdit le SMS, le paiement et l'écriture en base. Figma seulement avec un lien de Léa. GitHub seulement avec un numéro de ticket.

Vous relancez `/choisir-outil` sur la même question. La réponse attendue nomme Playwright et s'arrête. Le skill `verifier-une-reservation` reste celui des chiffres : 8, 45 €, 12.

</details>

## Exercice 3 : Lecture ou correction

L'attente est en place. L'agent veut un serveur de base « pour remettre les 12 noms dans le bon ordre » et vous montre un appel qui met à jour des lignes. Le test d'ordre n'a pas encore été lancé. Que lui laissez-vous faire ?

<details>
<summary>Voir la solution</summary>

Vous n'approuvez pas l'appel qui écrit. La base, si vous la branchez, est en lecture : elle montre l'ordre actuel. Le bon ordre se corrige dans le code, puis se prouve par le test (le 13e nom est refusé, les 12 restent dans l'ordre d'arrivée). Un outil qui réécrit la table court-circuite cette preuve.

Le serveur d'envoi reste coupé. Les 3 absents expliquent la règle des 18 h. Ils n'autorisent pas un SMS.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Cinq outils pour Sève"
center: "On branche l'outil qui prouve l'incrément. Les autres restent coupés."
points:
  - icon: git
    title: GitHub
    text: "Lit un ticket déjà écrit. Sans numéro, le serveur reste coupé."
  - icon: eye
    title: Navigateur
    text: "Compte 12 cartes et lit 45 €. Le coup d'œil ne se relance pas demain."
  - icon: test
    title: Playwright
    text: "Rejoue le refus de la 9e place. La sortie du test fait foi."
  - icon: database
    title: Base
    text: "Lecture seule des réservations. Pas d'outil qui réécrit les lignes."
  - icon: layers
    title: Figma
    text: "Seulement avec un lien de Léa. Inutile pour la liste des stages."
pitfall: "Tout activer par avance, y compris le SMS, parce que 3 personnes ont manqué un samedi."
remember: "Un skill choisir-outil nomme l'outil et s'arrête. La règle des 8 places reste une règle."
```
