---
title: Qualité automatique
description: Distinguer tests unitaires et tests d'intégration, lire la couverture comme un signal, et faire échouer le pipeline pour une vraie cause, lint ou dépendance comprise.
duration: 60
objectives:
  - Placer un test unitaire ou un test d'intégration selon ce que le risque exige
  - Interpréter un pourcentage de couverture sans en faire l'objectif du pipeline
  - Bloquer sur un lint utile et sur une dépendance dont le correctif est décidé
  - Faire échouer le job pour la cause réelle, pas pour un décor ou un test instable
---

# Deux familles de tests

Marc et Léa ne parlent pas du même « test » quand ils disent que les frais sont couverts. Le pipeline non plus. L'équipe de six sépare deux familles, et elle les lance dans cet ordre.

Le **test unitaire** exerce une règle, sans réseau, sans base, sans paiement. Il dure des millisecondes. Pour l'arrondi :

```bash
# make verifier lance d'abord ceci
python -m pytest tests/unit/test_frais.py
```

Le test donne 1050 centimes et attend 11 euros, ou 10,50 euros, selon la règle écrite avec Inès. S'il échoue, inutile de démarrer une base. Le retour arrive pendant que Léa a le doigt sur la ligne.

Le **test d'intégration** exerce deux morceaux ensemble : l'API et sa base, ou l'API et le client HTTP du paiement factice. Il est plus lent, plus proche du parcours, plus fragile si l'on mélange de vrais services externes. Il répond à une question que l'unitaire ne pose pas : est-ce que la route `/commandes` enregistre bien le total que la fonction d'arrondi a calculé ?

```diagram
type: compare
title: "Unitaire ou intégration"
columns:
  - title: Unitaire
    tone: blue
    items:
      - "Une règle, des entiers, pas de réseau"
      - "Millisecondes, sur chaque demande"
      - "Dit si l'arrondi est la règle écrite"
      - "Ne voit pas la base ni le proxy"
  - title: Intégration
    tone: amber
    items:
      - "API plus base, ou client factice"
      - "Secondes ou minutes, après l'unitaire"
      - "Dit si la route enregistre le total"
      - "Ne remplace pas le panier joué par Marc"
```

On ne « monte en intégration » un cas qui est une pure fonction. Démarrer une base pour vérifier `round` ralentit toutes les demandes de fusion et tombe en panne quand la base du pipeline tousse. On ne se contente pas non plus d'unitaires pour le paiement : la panne de la veille était un délai, pas une formule. Le test d'intégration utilise le prestataire factice, avec un délai proche du réel, pas un `sleep` d'une milliseconde qui rend le test vert et la boutique rouge.

Les tests de Marc, joués à la main en recette sur l'artefact publié, restent nécessaires pour le parcours que personne n'a encore encodé. Ils ne sont pas un troisième job que l'on ferait passer pour automatique. Les appeler « tests » dans le même tableau que `pytest` mélange un signal bloquant et une observation humaine.

# La couverture est un signal

La **couverture** dit quelles lignes ont été exécutées pendant les tests. Elle ne dit pas quelles règles ont été vérifiées. Un test sans assertion peut exécuter toute la fonction d'arrondi et faire monter le pourcentage. Le pipeline est content. Le centime est peut-être faux.

```bash
python -m pytest tests/unit --cov=api --cov-report=term-missing
```

La colonne utile n'est pas le pourcentage global. C'est la liste des lignes **non** exécutées dans `api/frais.py` et dans la route de paiement. Si le plafond de Chloé n'apparaît jamais, le 92 % global est une bonne nouvelle ailleurs et un trou ici.

Ce que l'équipe refuse :

- un objectif de 100 %, qui pousse à tester des accesseurs sans risque et à écrire des assertions vides ;
- un seuil qui baisse « pour cette demande » parce que le nouveau fichier n'est pas couvert ;
- un seuil qui bloque un correctif de documentation parce que le global a bougé de 0,1 point pour une raison inconnue.

Ce qu'elle fait : regarder la couverture du **module touché**. La demande qui modifie `api/frais.py` ne doit pas baisser la couverture de ce fichier sans une raison écrite (code de secours volontairement non exercé, par exemple). Le pourcentage du dépôt entier est un contexte, pas une note.

> [!NOTE]
> Une couverture qui monte et des incidents qui restent au même endroit veulent dire que l'on exécute davantage de lignes sans vérifier le parcours qui casse. On ajoute l'assertion, pas dix points de pourcentage.

Le rapport de couverture peut être publié même quand on ne bloque pas dessus. Il ne doit pas être le job dont l'échec empêche de voir le test rouge. D'abord les tests. Ensuite, en information, le rapport.

# Le lint attrape ce que la revue ne devrait pas relire

Le **lint** vérifie des règles mécaniques : syntaxe, import inutilisé, nommage convenu, parfois une erreur probable (variable utilisée avant d'exister). Il finit en secondes. Samir garde sa revue pour le plafond des frais, pas pour une ligne trop longue.

```bash
make lint
```

`make verifier` lance le lint **avant** les tests. Une faute de frappe ne démarre pas la base du test d'intégration.

Le lint échoue le pipeline quand la règle est objective et déjà acceptée par les six. On ne commence pas par cent règles le lundi, dont la moitié sont du goût. On commence par ce qui a déjà causé une perte de temps : import cassé, fichier non formaté qui rend le diff illisible, appel d'une fonction qui n'existe pas.

Un désaccord de style se règle une fois, dans la configuration du linter, pas dans chaque demande. Si l'outil peut réécrire le fichier (`format`), la demande de Léa contient le résultat, ou un job le vérifie. On ne demande pas à Samir de compter les espaces.

Le lint ne voit pas qu'Inès voulait l'arrondi bancaire. Un pipeline vert de ce côté-là est silencieux sur le métier. L'écrire dans le nom du job (« qualité ») ne change pas cette limite. Les tests portent la règle. Le lint porte la forme.

# Les dépendances ont une version, et parfois un avis

`requirements.txt` épingle ce que l'API installe. Le pipeline installe **ce** fichier, pas « la dernière version du matin ». C'est ce qui rend `make verifier` reproductible entre le portable de Léa et la forge.

L'analyse des dépendances ajoute une autre question : parmi ces versions épinglées, certaines ont-elles un avis de sécurité que l'équipe a décidé de ne pas ignorer ?

```bash
pip-audit -r requirements.txt
```

La commande échoue si une dépendance a un avis connu. Toute la nuance est dans **lequel**. L'équipe écrit la politique en quatre lignes, pas dans un ressenti le jour des soldes.

On bloque quand l'avis est grave, qu'un correctif existe, et que la dépendance est sur le chemin des commandes (client HTTP du paiement, bibliothèque qui lit les requêtes). On met à jour dans une demande `chore`, avec le pipeline vert, pas en même temps que l'arrondi des frais.

On ne bloque pas forcément un avis faible, sans correctif, sur un outil qui ne tourne qu'en développement. On le note, avec une date de revue. Le silence total (« on verra ») et le blocage total (« rien ne part tant qu'il reste un avis ») produisent le même résultat : les gens contournent `pip-audit`.

```diagram
type: decision
title: "Cet avis bloque-t-il la demande ?"
nodes:
  - question: "L'avis concerne-t-il une dépendance du chemin de commande, avec un correctif disponible ?"
    yes: "On traite l'avis. Question suivante."
    no: "On le note avec une date. Il ne bloque pas l'arrondi du jour."
  - question: "La demande en cours est-elle justement cette mise à jour ?"
    yes: "Le pipeline d'analyse doit passer sur le fichier épinglé nouveau."
    no: "On sépare. D'abord le correctif de frais, ensuite une demande chore."
```

Le résultat de l'analyse est un journal, pas une liste que Nora recopie dans un tableur. Si `pip-audit` est rouge, la cause est un nom de paquet et un identifiant d'avis. On ne relance pas en espérant que l'avis ait disparu dans l'heure, sauf si l'on vient de changer l'épingle.

# Échouer pour la bonne raison

Un pipeline utile est **rouge pour une cause vraie**, et vert seulement quand cette cause a disparu. Plusieurs façons de mentir ont déjà été vues sur l'API commandes.

Le script qui continue après l'échec. Sans `set -euo pipefail`, `make verifier` peut échouer et le script sortir en succès parce qu'une ligne suivante s'est bien exécutée. Le job est vert. Le frais est faux. On l'a vu dans le chapitre pratique. Ici, la règle s'étend à tout script du pipeline : un échec se propage, une variable absente est une erreur, un tube ne cache pas le code de retour.

```bash
#!/usr/bin/env bash
set -euo pipefail
make lint
python -m pytest tests/unit
python -m pytest tests/integration
```

La case « continuer en cas d'erreur » sur le job de tests. La publication a lieu quand même. Marc reçoit un artefact que les tests ont refusé. Cette case peut exister pour un rapport facultatif. Elle n'existe pas pour `pytest`.

Le test instable. Il échoue une fois sur trois, selon l'heure ou l'ordre des fichiers. L'équipe relance jusqu'au vert. Au bout d'une semaine, personne ne lit plus les rouges. Le test instable est un défaut, au même titre qu'un arrondi faux. On le corrige (horloge figée, donnée isolée, pas de réseau réel) ou on le retire du chemin bloquant avec un propriétaire et une date. Le retirer sans date, c'est l'oublier.

Le test qui vérifie la mauvaise chose. Il relit le code au lieu du comportement : il vérifie que la fonction s'appelle `arrondir`, pas que 1050 centimes deviennent 10,50 euros. Un renommage le casse. Un arrondi faux le laisse vert. On assert le résultat visible.

L'analyse ou le lint qui crient sur des fichiers générés. Le job est rouge, Léa ne peut rien y changer dans sa demande. Elle apprend à l'ignorer. On exclut ces fichiers, ou l'on corrige le générateur. Un rouge que l'auteur ne peut pas traiter n'est pas un garde-fou. C'est du bruit.

> [!WARNING]
> Relancer un job jusqu'au vert, sans changer de commit, enseigne que le rouge est temporaire. Le jour où il ne l'est pas, il part quand même.

# Ce que l'équipe automatise d'abord

Nora ne met pas douze outils le premier mois. L'ordre, pour une équipe de six qui livre l'API commandes, est celui du risque déjà rencontré.

D'abord les tests unitaires des calculs qui ont déjà coûté une commande : frais, stock affiché, total. Ils bloquent chaque demande.

Ensuite un test d'intégration du parcours minimal : créer une commande, obtenir le total, refuser un paiement factice en erreur. Il bloque `main`. Il peut être le même sur la demande de fusion s'il reste sous quelques minutes.

Ensuite le lint sur les règles qui polluent les revues. Pas sur le goût.

Ensuite `pip-audit` sur le fichier épinglé, avec la politique écrite à côté, dans le dépôt. Un avis bloquant est un `chore` séparé.

La couverture vient en rapport, pas en objectif. On s'en sert quand quelqu'un touche `api/frais.py`, pour voir les branches oubliées.

Chaque ajout est une demande de fusion sur `.github/workflows/commandes.yml` et sur `make verifier`. Pas un robot configuré dans l'interface. Si Samir ne peut pas lancer la même commande sur son portable, le pipeline est une boîte noire, et le portable redeviendra le chemin « plus rapide ».

Le critère de fin : un rouge du matin a **une** phrase de cause. « Le test des frais attend 10,50 et obtient 11. » « `pip-audit` signale un avis sur le client HTTP, correctif en 2.4.1. » « `api/frais.py` n'est pas formaté. » Si la phrase est « le job est rouge », le pipeline n'a pas encore échoué pour la bonne raison.

# Exercices

## Exercice 1 : Où placer le test

Trois risques sont sur la table.

1. 1050 centimes doivent devenir 10,50 euros, plafond non atteint.
2. La route `POST /commandes` doit refuser la commande si la base dit que l'article n'existe pas.
3. Le texte du bouton sur le site vitrine « a l'air aligné à gauche ».

Pour chacun : test unitaire, test d'intégration, ou pas un job du pipeline de l'API. Dites pourquoi le cas 2 n'est pas un unitaire.

<details>
<summary>Voir la solution</summary>

1. Unitaire. C'est une fonction, des nombres, aucune base. Il va dans `tests/unit` et bloque chaque demande en quelques secondes.

2. Intégration. Il faut l'API **et** la base, donc un processus, un schéma, une donnée d'article absente. Un unitaire qui simule « la base a dit non » ne voit pas si la route interroge vraiment la table, ni si elle traduit l'absence en refus HTTP. On garde la simulation éventuelle en unitaire pour la règle, et l'intégration pour la route.

3. Pas un job du pipeline de l'API commandes. C'est le site vitrine, un avis visuel, pas un contrat de l'API. Le mettre ici ralentit les frais sans protéger le paiement. S'il doit être automatique un jour, c'est le pipeline du site, avec un critère objectif, pas « a l'air ».

</details>

## Exercice 2 : 94 % et un trou

Le rapport annonce 94 % de couverture globale. La demande de Léa modifie `api/frais.py`. Le rapport montre que la branche « montant au-dessus du plafond » n'est pas exécutée. Le test ajouté appelle la fonction et n'assert rien. Le pourcentage a quand même monté.

Le pipeline doit-il être content, et que demandez-vous à la place d'un objectif à 97 % ?

<details>
<summary>Voir la solution</summary>

Non. La couverture a monté parce que des lignes ont été exécutées, y compris peut-être par un test sans assertion. La branche du plafond, celle qui a déjà causé un incident, n'est pas exercée. Le global à 94 % ne parle pas de ce fichier.

On demande un test qui pose un montant au-dessus du plafond et qui assert le montant renvoyé (le plafond, pas l'arrondi au-delà). On regarde la couverture de `api/frais.py`, pas celle du dépôt. On n'élève pas le seuil global à 97 % : cela pousserait d'autres tests vides ailleurs, sans garantir le plafond.

Si la branche est volontairement hors test, la demande l'écrit. Ici, elle ne l'est pas. Le pourcentage n'est pas l'objectif. L'assertion sur le plafond l'est.

</details>

## Exercice 3 : Un avis et un arrondi le même jour

`pip-audit` signale un avis grave sur le client HTTP du paiement. Un correctif existe. Léa a, dans la même branche, l'arrondi des frais et la montée de version du client. Le test d'intégration du paiement échoue depuis la montée de version. Inès veut l'arrondi avant midi.

Comment découpez-vous, et que ne faites-vous pas du job d'audit ?

<details>
<summary>Voir la solution</summary>

Deux demandes. La première : l'arrondi seul, sur la dépendance actuelle, tests verts, livrable avant midi si le reste est sain. La seconde : `chore` qui épingle le client HTTP corrigé, répare le test d'intégration, et ne part que lorsque `pip-audit` est vert sur ce fichier. Mélanger les deux rend l'échec du paiement impossible à attribuer (arrondi ou client).

On ne décoche pas `pip-audit` pour laisser passer l'arrondi. On ne marque pas non plus l'avis comme faux. L'arrondi ne touche pas le client HTTP : il peut passer pendant que l'avis reste rouge **sur la demande de chore**, pas en désactivant l'outil pour tout le monde. Si la politique dit que `main` doit rester sans avis bloquant, la chore part juste après l'arrondi, le jour même, pas « après les soldes ».

Relancer l'audit sans changer l'épingle ne fera pas disparaître l'avis.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Qualité automatique"
center: "Le pipeline échoue pour une cause vraie, sur le risque qui a déjà coûté une commande."
points:
  - icon: test
    title: "Deux familles"
    text: "L'unitaire vérifie la règle, vite. L'intégration vérifie la route et la base, ensuite."
  - icon: gauge
    title: "Couverture en signal"
    text: "Elle dit quelles lignes ont tourné, pas quelles assertions existent. On regarde le fichier touché."
  - icon: filter
    title: "Lint mécanique"
    text: "La forme convenue, avant les tests. La revue garde le plafond des frais, pas les espaces."
  - icon: shield
    title: "Avis triés"
    text: "On bloque un avis grave et corrigible sur le chemin de commande. On sépare ce chore de l'arrondi."
  - icon: alert
    title: "Rouge honnête"
    text: "set -e, pas de continuer quand même, pas de relance superstitieuse d'un test instable."
pitfall: "Viser 100 % de couverture avec des tests sans assertion, et ignorer la branche du plafond."
remember: "Un vert utile tient en une phrase de cause absente. Un rouge utile tient en une phrase de cause présente."
```
