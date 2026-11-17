---
title: "Livrer la réservation des 8 places"
description: "Mener l'incrément 2 dans le terminal : un plan, les permissions lues, le test qui refuse la 9e place, un diff relu, puis le commit."
duration: 50
objectives:
  - "Isoler l'incrément 2 : huit places, et la neuvième inscription refusée"
  - "Lire le plan et les permissions avant toute écriture"
  - "Exiger un test qui échoue si la 9e place est acceptée"
  - "Relire le diff, puis committer seulement ce lot"
---

# Seulement les huit places

Cet incrément est le deuxième. La liste des stages existe déjà : le samedi 10 h-13 h, Lyon Croix-Rousse, à 45 €, se voit dans App Sève. Vous ne la refaites pas. Vous ne livrez pas non plus l'attente, ni la confirmation. Vous livrez le refus.

La règle de Léa Vernet est nette. Huit personnes peuvent réserver le stage. La 9e est refusée. Aucune place n'est créée pour elle. Le compteur, le message et la liste des inscrits racontent la même chose. Un écran « complet » qui enregistre quand même le neuvième nom n'a pas tenu la règle.

Le contexte reste dans le brief, pas dans le diff : douze stages par mois, remplissage autour de 70 %, environ trois absents parce qu'un SMS a été oublié. Ces faits expliquent pourquoi le plafond est strict. Ils ne s'implémentent pas aujourd'hui. L'attente jusqu'à 12 et la décision avant 18 h la veille attendent leurs incréments.

> [!IMPORTANT]
> Si la session commence à ordonner une file d'attente ou à rédiger le SMS, vous la ramenez au refus de la 9e place.

# Un plan avant les fichiers

Vous ouvrez Claude Code et vous entrez en mode plan avec `/plan`, ou avec Shift+Tab jusqu'à l'indicateur « plan ». Vous demandez un plan pour l'incrément 2 seulement, sur la branche `seve/refus-9e-place`. Le plan doit dire où le plafond de 8 est appliqué, comment le refus se voit, et quel test prouvera que la 9e place est refusée. Il doit dire aussi ce qu'il ne touchera pas : l'attente, la confirmation, le prix si la liste l'affiche déjà, les secrets.

Vous lisez le plan avant de l'accepter. Un plan qui « en profite » pour accepter 9 places le jour du stage, ou pour lier le refus à un paiement, se renvoie. Un plan qui modifie CLAUDE.md pour y mettre une clé se renvoie aussi. Quand le plan est borné, vous l'acceptez. Les écritures commencent alors, pas avant.

Vous gardez la phrase du test dans le plan, mot pour mot : la 9e place est refusée. Cette phrase évitera, une heure plus tard, un test renommé en « la réservation fonctionne » qui ne prouve plus rien.

# Lire les permissions

Avant la première commande, vous lisez les permissions de la session. Dans `.claude/settings.json`, l'allowlist partagée vise la commande de test écrite dans CLAUDE.md, par exemple `Bash(node --test)`, sans astérisque. Le diff, l'état Git et le démarrage redemandent, et vous les lisez. Vous refusez `Bash(*)`. Vous refusez le mode qui ne demande plus rien.

Quand une commande apparaît, vous la lisez. Lancer le test de la 9e place est attendu. Installer un outil, pousser la branche, afficher un `.env`, élargir les droits : non. Vous dites non dans la session, pour que la commande ne revienne pas habillée autrement.

```diagram
type: sequence
title: "L'incrément 2 dans le terminal"
actors: ["Vous", "Claude Code", "Tests"]
messages:
  - from: 0
    to: 1
    text: "Mode plan : seulement le refus de la 9e"
  - from: 1
    to: 0
    text: "Plan borné, permissions lues"
  - from: 0
    to: 1
    text: "Plan accepté, écritures ouvertes"
  - from: 1
    to: 2
    text: "Lance le test de la 9e place"
  - from: 2
    to: 0
    text: "Rouge puis vert, sous vos yeux"
  - from: 0
    to: 1
    text: "Diff relu, puis commit du seul lot"
```

La commande de démarrage peut être proposée pour que vous ouvriez la page. Ce n'est pas une permission d'aller vérifier à votre place. Après le test vert, vous pourrez regarder le refus à l'écran. Le témoin du commit, lui, reste le test plus le diff.

# Le test de la neuvième place

Vous demandez un test dont le nom porte la règle. « La 9e place est refusée » convient. Le scénario est concret. Huit inscriptions au stage du samedi, Croix-Rousse, passent. La neuvième est refusée. Le nombre d'inscrits reste 8. Le prix, s'il est asserté, reste 45 €. Le test ne crée pas une attente de 12 personnes : ce n'est pas cet incrément.

Vous le voyez échouer une fois si le refus n'existe pas encore, puis passer quand le comportement est là. Un test écrit après coup pour coller à un code qui accepte 9 personnes ne compte pas. Vous regardez l'assertion : elle doit attendre le refus, pas le succès de la 9e inscription.

Si l'agent propose de commenter le test, de monter le plafond à 9, ou d'attendre « au moins une place », vous refusez. Le remplissage à 70 % n'ouvre pas une neuvième chaise. Vous faites corriger le code, vous relancez **ce** test, vous lisez le vert dans la session.

| Étape | Vert qui compte | Vert qui ne compte pas |
|---|---|---|
| Huit inscrits | Les huit sont acceptés | Le test s'arrête à un seul nom |
| Neuvième | Refus, aucun neuvième inscrit | « Complet » affiché mais ligne créée |
| Plafond | La règle reste à 8 | Le test et le code passent à 9 ensemble |

# Relire le diff

Le test vert n'est pas le dernier mot. Vous affichez le diff et vous le lisez. Vous cherchez quatre choses. Le plafond à 8 est bien celui qui refuse. Le diff ne contient pas l'attente ni le texte des 18 h, sauf une ligne vraiment nécessaire et que vous comprenez. Le diff ne contient pas de secret, pas de `.env`, pas de clé dans CLAUDE.md. Le diff ne désactive pas un autre test pour rester vert.

Un fichier surprenant se fait expliquer, ou se retire. « J'en ai profité pour préparer l'attente » est une phrase qui annule la relecture : vous faites sortir ces lignes du lot. Le commit doit pouvoir se décrire en une ligne : refuser la 9e place quand 8 inscriptions tiennent.

Vous ouvrez aussi la page, vous, à la commande de démarrage proposée. Huit réservations, puis un refus pour la suivante. Si l'écran contredit le test, le test ne suffit pas. Vous revenez au diff avant de committer.

# Committer le vert

Vous committez quand le plan a été tenu, les permissions n'ont pas été ouvertes en grand, le test « la 9e place est refusée » est vert sous vos yeux, et le diff ne contient que ce lot. Le message de commit dit la règle, pas l'humeur de la session.

```text
Refuser la 9e inscription quand les 8 places sont prises.

Le test de règle est vert dans la session. Pas d'attente, pas de confirmation.
```

Vous ne poussez que si la revue de votre côté est prête à dire la même chose à Léa. L'attente ordonnée jusqu'à 12 et la confirmation qui rappelle 18 h ne sont pas dans ce commit. Les nommer dans le message serait mentir sur le lot. La session peut s'arrêter ici. L'incrément 3 aura le sien.

# Exercices

## Exercice 1 : Le plan qui déborde

Le plan accepté parle du refus de la 9e place. Au milieu des écritures, l'agent ajoute la file d'attente jusqu'à 12 et le rappel « décision avant 18 h », « pour ne pas y revenir ». Le test de la 9e place est déjà vert. Que faites-vous du diff ?

<details>
<summary>Voir la solution</summary>

Vous faites retirer l'attente et le rappel. L'incrément 2 est le plafond de 8 et le refus de la 9e. Les deux autres règles ont leurs tâches, plus tard.

Vous relisez le diff jusqu'à ce qu'il ne porte que le refus. Vous relancez le test « la 9e place est refusée ». S'il est encore vert et que le diff est borné, vous pouvez committer. Un message qui annonce l'attente ou les 18 h se réécrit. Le vert du test ne couvre pas les lignes en trop.

</details>

## Exercice 2 : Permissions et test

L'agent demande l'autorisation de lancer toutes les commandes, puis propose de modifier le test pour accepter 9 inscrits « le temps que le vert revienne ». Le mode plan est terminé, des fichiers ont déjà changé. Que lisez-vous, et que refusez-vous ?

<details>
<summary>Voir la solution</summary>

Vous lisez la demande de permission et vous la refusez. L'allowlist partagée reste `Bash(node --test)` si c'est la commande du CLAUDE.md, sans astérisque. Le diff redemande. Toutes les commandes ne sont pas nécessaires pour prouver le refus.

Vous refusez aussi de faire accepter la 9e place par le test. L'assertion reste : huit inscrits, la neuvième refusée, le compteur à 8. Si le code accepte la 9e, c'est le code qui change. Vous relancez le test après correction, sous vos yeux, sans élargir les droits.

</details>

## Exercice 3 : Commit ou pas

Le test est vert. Le diff montre le refus, et aussi une clé d'API collée dans un commentaire « pour le SMS plus tard », plus un passage du plafond documenté à 9 dans CLAUDE.md. L'agent propose le commit avec le message « réservation terminée ». Que manque-t-il ?

<details>
<summary>Voir la solution</summary>

Il manque un diff propre et un message vrai. Vous faites retirer la clé, vous la révoquez si elle est réelle, et vous ramenez le plafond à 8 dans CLAUDE.md. « Pour le SMS plus tard » n'a pas sa place dans ce lot : l'envoi réel est hors périmètre, et un secret ne se commite pas.

Vous relisez le diff. Vous relancez le test de la 9e place. Le message devient celui du refus, sans dire que l'attente ou la confirmation sont faites. Ensuite seulement, le commit. « Réservation terminée » promet les incréments 3 et 4, qui ne sont pas dans la session.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Huit places, neuvième refusée
center: "Incrément 2 dans le terminal : plan borné, permissions lues, test de la 9e place, diff relu, puis commit."
points:
  - icon: target
    title: Un seul lot
    text: "Huit places, la 9e est refusée. Pas l'attente, pas la confirmation, pas le paiement."
  - icon: compass
    title: Plan d'abord
    text: "Le mode plan nomme le refus et le test. Vous l'acceptez quand il n'avale pas la suite."
  - icon: shield
    title: Permissions
    text: "Vous les lisez. Tests et diff. Vous refusez toutes les commandes et le secret affiché."
  - icon: test
    title: La 9e
    text: "Le test dit le refus. Huit inscrits restent huit. On ne monte pas le plafond pour le vert."
  - icon: git
    title: Diff puis commit
    text: "Vous relisez. Le message dit la règle tenue, pas que la réservation entière est finie."
pitfall: "Accepter 9 places dans le test, ou committer l'attente, la clé SMS et un CLAUDE.md passé à 9."
remember: "Plan, permissions, test « la 9e place est refusée », diff relu, commit du seul refus."
```
