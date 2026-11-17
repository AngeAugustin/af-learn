---
title: Faire écrire et lancer les tests
description: "Demander un test qui échoue si une 9e place est acceptée, un test de la liste (12 stages à 45 €), les faire lancer dans le terminal, et lire l'échec avant tout correctif."
duration: 50
objectives:
  - "Demander un test qui échoue si une 9e place est acceptée"
  - "Demander un test de la liste, 12 stages à 45 €"
  - "Faire écrire le test et le lancer dans le terminal intégré"
  - "Lire l'échec et refuser un vert qui ne couvre pas la règle"
---

# Un test qui peut échouer

App Sève sert Léa Vernet, à l'Atelier Sève, Lyon Croix-Rousse. Le samedi, le stage va de 10 h à 13 h. Il a 8 places. Il coûte 45 €. Le mois en compte 12. Le remplissage tourne autour de 70 %. Environ 3 personnes par mois ne viennent pas, parce que le SMS a été oublié. La confirmation et la décision avant 18 h la veille viendront avec un autre incrément. Le test d'aujourd'hui protège les 8 places et la liste.

Un test est une phrase que le terminal peut rendre fausse. Pour les places, la phrase dit : une 9e inscription sur un stage déjà plein est refusée. Pour la liste, la phrase dit : le mois affiche 12 stages, et chacun coûte 45 €. Le 12 de la liste compte des stages. Le 12 de l'attente compte des personnes. Le test nomme lequel des deux.

> [!IMPORTANT]
> Vous demandez la règle avec le chiffre qui peut la faire échouer. Une demande vague du type « ajoute des tests » ne dit pas quelle place doit être refusée.

# Deux demandes, pas un paquet

Le message dans le chat tient en quelques lignes. Il nomme les deux tests, le samedi, les 8 places, les 12 stages et les 45 €. Il demande d'écrire le test, puis de le lancer. Il dit de laisser le produit tranquille tant que vous n'avez pas lu la sortie.

Vous citez avec `@` le fichier qui accepte ou refuse une place, et celui qui construit la liste. Le reste du dépôt n'a pas à entrer dans le contexte. Vous ne demandez pas une leçon sur l'interface. Le geste est le test, dans l'éditeur.

```text
Écris un test qui échoue si une 9e place est acceptée
sur un stage du samedi (8 places, 10 h-13 h).
Écris un test de la liste : 12 stages, chacun à 45 €.
Cite les fichiers avec @. Lance les deux dans le terminal intégré.
Ne modifie pas le produit tant que je n'ai pas lu l'échec.
```

> [!NOTE]
> Si le test dit seulement « il y a 12 », il peut réussir sur l'attente, plafonnée à 12 personnes. La phrase doit dire 12 stages, à 45 €.

# L'agent écrit, puis il lance

Le fichier de test ajouté dans le dépôt ne prouve encore rien. Tant que la commande n'a pas tourné, vous ignorez si la 9e place est refusée. Vous demandez que l'agent lance les tests dans le terminal intégré de Cursor. La commande et sa sortie restent visibles dans l'éditeur.

Vous laissez l'agent reprendre la commande déjà en usage dans le projet. Vous lisez le nom du test, la valeur attendue, la valeur obtenue. Une phrase dans le chat, « les tests passent », ne tient pas lieu de sortie. S'il manque le terminal, vous le redemandez avant toute suite.

```diagram
type: flow
title: "Écrire, lancer, lire"
steps:
  - title: "Demander"
    text: "Refus de la 9e place, et liste de 12 stages à 45 €."
    tone: violet
  - title: "Écrire"
    text: "L'agent ajoute le test dans le dépôt."
    tone: blue
  - title: "Lancer"
    text: "La commande s'exécute dans le terminal intégré."
    tone: teal
  - title: "Lire"
    text: "Vous lisez le rouge avant de parler d'un correctif."
    tone: amber
  - title: "Relancer"
    text: "Les mêmes tests, après un changement étroit du produit."
    tone: rose
```

# Lire l'échec avant le correctif

Le rouge est l'information. S'il dit que la 9e place a été acceptée, la règle des 8 places n'est pas dans le produit. Vous recopiez cette ligne dans le message suivant, avec les mots de la sortie.

```text
9e inscription
attendu : refus
obtenu : acceptée
```

Ensuite seulement, vous demandez un correctif. Vous demandez de rendre le refus vrai. Vous ne demandez pas de « rendre les tests verts » : cette formule laisse à l'agent le choix d'effacer l'assertion, d'attendre une acceptation, ou de compter jusqu'à 9. Le terminal deviendrait vert, et une personne de trop pourrait encore entrer le samedi.

> [!WARNING]
> Tant que vous n'avez pas lu la sortie, vous ne faites pas modifier le code du stage. L'échec dit si le test vise bien la 9e place, ou s'il vise autre chose.

# Un vert qui ne couvre pas la règle

Un test vert peut ne rien prouver. Il vérifie que la liste existe, que le prix est un nombre, que le mot « places » s'affiche, ou que la page répond. Aucune de ces phrases ne devient fausse si une 9e place est acceptée. Aucune ne devient fausse s'il y a 11 stages, ou si un stage passe à 40 €.

Le critère tient en une question. Si la 9e place était acceptée, ou si un prix n'était plus 45 €, le test rougirait-il ? S'il resterait vert, il ne compte pas. Vous le dites, et vous redemandez l'assertion manquante. Le nom du test peut porter la règle : « refuse la 9e place », « liste 12 stages à 45 € ». Un nom vague cache un vert vide.

| Sortie dans le terminal | Ce qu'elle établit | Ce que vous faites |
|---|---|---|
| Rouge, la 9e place est acceptée | La règle manque dans le produit | Vous lisez, puis vous demandez le correctif |
| Vert, 12 stages, 45 €, 9e refusée | Les deux demandes de la séance | Vous vous appuyez sur cette sortie |
| Vert, la liste n'est pas vide | Il existe au moins une ligne | Vous refusez de compter ce vert |

# Relancer les mêmes phrases

Le correctif reste sur la règle que le rouge a montrée. Vous ne glissez pas dans ce diff l'attente ordonnée, la confirmation, ni l'heure limite de 18 h la veille. Ces incréments auront leurs tests quand leur tour viendra. Ici, vous relancez les deux mêmes tests, avec la même commande.

Vous voulez revoir les deux résultats : la 9e place refusée, les 12 stages à 45 €. Le correctif des places ne doit pas casser la liste. Si le second test rougit, vous lisez cette sortie aussi, avant un nouveau changement. Vous gardez le texte du premier échec à côté du diff, pour vérifier que le produit rend cet échec impossible.

> [!TIP]
> Deux tests ciblés, lus dans le terminal, valent mieux qu'une suite verte qui ne nomme ni les 8 places ni les 45 €.

# Exercices

## Exercice 1 : Le message des deux tests

Léa Vernet tient le samedi de 10 h à 13 h, 8 places, 45 €, à Lyon Croix-Rousse. Le mois affiche 12 stages. Écrivez le message que vous envoyez à l'agent pour les tests de cette séance.

<details>
<summary>Voir la solution</summary>

Le message demande deux tests. Le premier échoue si une 9e place est acceptée sur un stage de 8 places. Le second vérifie 12 stages, chacun à 45 €. Il cite les fichiers avec `@`. Il demande le lancement dans le terminal intégré. Il dit de ne pas modifier le produit avant la lecture de l'échec.

Il ne demande pas l'attente, ni la règle des 18 h, ni une réécriture de l'écran.

</details>

## Exercice 2 : Le vert trop facile

Le terminal est vert. Le seul test affirme que la liste contient au moins un stage. L'agent propose de passer au commit. Que répondez-vous ?

<details>
<summary>Voir la solution</summary>

Ce vert ne compte pas. Il resterait vert avec un seul stage, avec un prix autre que 45 €, et avec une 9e place acceptée. Vous redemandez les assertions précises, puis vous faites relancer.

Vous lisez la nouvelle sortie avant d'accepter le diff. Un vert sans la règle des 8 places ne protège pas le samedi de Léa.

</details>

## Exercice 3 : Rougir, puis ne pas truquer

La sortie dit : attendu un refus, obtenu une acceptation de la 9e place. L'agent propose de modifier le test pour attendre une acceptation, afin d'obtenir un vert, et d'en profiter pour nettoyer les autres tests. Que gardez-vous ?

<details>
<summary>Voir la solution</summary>

Vous gardez l'attendu : le refus. Le rouge décrit une règle absente du produit. Vous demandez un correctif étroit, puis la relance des mêmes tests dans le terminal.

Vous refusez le changement d'attendu et le nettoyage. Un vert obtenu en acceptant 9 places laisserait une personne de trop devant le tour.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Tests écrits et lancés
center: "Deux tests pour Sève, lancés dans le terminal. On lit le rouge avant de corriger. Un vert qui ignore la règle ne compte pas."
points:
  - icon: test
    title: La 9e place
    text: "Le test échoue si une 9e inscription est acceptée sur un stage de 8 places."
  - icon: list
    title: La liste
    text: "L'autre test exige 12 stages, chacun à 45 €. Un nombre 12 sans unité ne suffit pas."
  - icon: terminal
    title: Lancer
    text: "L'agent écrit le test et le lance dans le terminal intégré. Vous lisez la sortie."
  - icon: eye
    title: Lire le rouge
    text: "Attendu un refus, obtenu une acceptation. Cette ligne précède le correctif."
  - icon: alert
    title: Vert inutile
    text: "Une liste non vide peut rester verte et laisser passer la 9e place."
pitfall: "Dire de rendre les tests verts, puis accepter un test qui reste vert quand la 9e place passe."
remember: "On relance les mêmes phrases. Le correctif rend le refus vrai, sans élargir le stage à 9 places."
```
