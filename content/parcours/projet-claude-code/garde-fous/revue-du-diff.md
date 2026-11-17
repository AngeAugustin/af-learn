---
title: Relire le diff avant de committer
description: "Lire git diff dans le terminal, y chercher la règle métier, un fichier inattendu ou un secret, et refuser le commit tant que la 9e place passerait."
duration: 50
objectives:
  - "Lire git diff dans le terminal avant tout commit"
  - "Reconnaître la règle des 8 places, un fichier inattendu et un secret"
  - "Refuser le commit tant qu'une 9e place serait acceptée"
  - "Renvoyer à la session les lignes qui empêchent de committer"
---

# Le diff est le texte à lire

Léa Vernet travaille dans le terminal avec Claude Code, sur App Sève. Atelier Sève est à Lyon Croix-Rousse. Le samedi, de 10 h à 13 h, 8 places à 45 €. L'attente s'arrête à 12. La confirmation se décide avant 18 h la veille. Le test nommé peut être vert. Le commit attend encore une lecture.

Cette lecture est `git diff` dans le terminal. Le résumé de l'agent (« j'ai ajouté le refus ») n'est pas le diff. Léa lance la commande, ou elle laisse la session la lancer, puis elle lit la sortie elle-même.

```bash
git diff
git diff --stat
```

`git diff` montre les lignes ajoutées et retirées. `git diff --stat` donne la liste des fichiers et le volume. Un fichier que la demande ne citait pas apparaît là, même s'il est noyé dans un long texte.

# Chercher la règle métier

Pour l'incrément du refus, la règle tient dans une comparaison. Huit places sont prises. La personne suivante est la 9e et doit être refusée. La condition qui porte cette règle est `inscrits >= 8`.

Léa cherche ce seuil dans le diff. Elle lit le signe, pas seulement le chiffre 8.

```text
- if (inscrits > 8) refuser()
+ if (inscrits >= 8) refuser()
```

Avec `inscrits > 8`, huit inscrits ne déclenchent pas le refus. La 9e personne entre. Le refus n'arrive qu'à la 10e. Tant que cette ligne est là, Léa refuse le commit, même si le reste du diff est court et même si un autre test est vert.

Avec `inscrits >= 8`, la 9e demande s'arrête. C'est la ligne qui correspond au test « la 9e place est refusée ». Le prix de 45 €, le créneau 10 h-13 h et Croix-Rousse se relisent de la même façon quand l'incrément est la liste : la valeur promise est dans le diff, pas seulement dans le message de l'agent.

# Un fichier inattendu

`git diff --stat` se lit en premier quand plusieurs fichiers bougent. L'incrément du refus touche la règle des places et le test qui la nomme. Un autre fichier demande une explication.

```text
 reservation.js   | 4 ++--
 verifier.js      | 6 ++++++
 notes-prix.txt   | 12 ++++++++++++
```

`reservation.js` et `verifier.js` collent à la demande. `notes-prix.txt` n'était pas dans l'incrément. Il peut changer 45 €, mélanger l'attente de 12 personnes, ou préparer le SMS des 3 absents du mois. Léa l'ouvre dans le diff. S'il n'est pas nécessaire au refus de la 9e place, il sort du commit. Le remplissage d'environ 70 % peut rester une note personnelle. Il ne voyage pas dans le diff de cet incrément.

Un fichier inattendu n'est pas toujours une erreur. S'il porte vraiment la règle, Léa doit pouvoir le dire en une phrase. Si elle ne peut pas, il n'entre pas.

# Un secret dans les lignes

Léa parcourt le diff en cherchant un secret : `.env`, un jeton, un mot de passe, une clé de SMS. Le mois compte 3 absents parce qu'un SMS a été oublié. Ce fait ne justifie pas une ligne `SMS_TOKEN=...` dans les fichiers commités.

```text
+ SMS_TOKEN=sk-live-seve-croix-rousse
```

La règle `inscrits >= 8` peut être juste à la ligne du dessus. Le commit reste refusé. Le secret sortirait avec l'historique. Léa retire la ligne du fichier et relance `git diff` jusqu'à ce que le jeton n'apparaisse plus. Elle ne se dit pas qu'elle le retirera dans un commit suivant.

Un secret déjà affiché dans le terminal a été vu. On évite de le recopier dans la demande de revue, dans un hook ou dans un message de commit. Le diff suivant doit être propre.

```diagram
type: decision
title: "Peut-on préparer le commit ?"
nodes:
  - question: "La 9e place passerait-elle encore ?"
    yes: "On refuse le commit"
    no: "On cherche un fichier inattendu ou un secret"
  - question: "Le diff contient-il un secret ou un fichier hors incrément ?"
    yes: "On le retire, puis on relit git diff"
    no: "Le commit de cet incrément peut se préparer"
```

# Refuser tant que la 9e entre

L'ordre de lecture est stable. D'abord la règle des 8 places. Ensuite les fichiers. Ensuite les secrets. Un diff élégant avec `>` à la place de `>=` ne passe pas. Un diff juste avec un jeton ne passe pas. Un diff juste avec `notes-prix.txt` non expliqué ne passe pas.

Léa renvoie à la session les lignes fautives, copiées depuis `git diff`. Elle nomme le cas : 8 inscrits, la 9e personne entrerait. Elle redemande le test « la 9e place est refusée », puis un nouveau `git diff`. Le vert ancien, obtenu avant la correction, ne compte plus.

Les autres incréments se relisent avec la même exigence. La liste montre 12 stages à 45 €. L'attente s'arrête à 12. La confirmation s'arrête à 18 h la veille du samedi. Tant que la ligne contredit la règle de l'incrément, le commit attend.

# Ce que Léa dit à la session

Une demande courte suffit. « Voici le diff : `inscrits > 8`. La 9e place passerait. Corrige, relance le test nommé, puis montre `git diff`. » L'agent propose. Léa relit.

Elle ne demande pas « est-ce bon ? » comme seule vérification. La réponse oui de la session ne remplace pas les lignes. Elle ne committe pas « pour sauvegarder » un diff qu'elle n'a pas fini de lire. La sauvegarde du travail en cours peut rester locale, sans entrer dans l'historique partagé, tant que la 9e place passerait.

Quand les trois regards sont nets (règle, fichiers, secrets), le chapitre suivant peut ouvrir la branche et le message. Pas avant.

# Exercices

## Exercice 1 : Le signe qui laisse entrer

`git diff` montre une seule modification utile : `if (inscrits > 8) refuser()`. Le test lancé juste avant était vert sur un cas à 2 inscrits. Peut-on committer le refus de la 9e place ?

<details>
<summary>Voir la solution</summary>

Non. Avec 8 inscrits, `inscrits > 8` est faux, donc la 9e personne entre. La règle de Sève est `inscrits >= 8`. Léa refuse le commit tant que cette 9e place passerait.

Le vert à 2 inscrits est hors du cas plein. Elle redemande le test « la 9e place est refusée » avec 8 inscrits, puis elle relit `git diff` jusqu'à voir `>=`.

</details>

## Exercice 2 : La règle juste, le fichier en trop

Le diff contient `inscrits >= 8` dans `reservation.js`, le test nommé, et un fichier nouveau `notes-prix.txt` qui passe un stage de 45 € à 30 €. Il n'y a pas de secret. Que fait Léa avant tout commit ?

<details>
<summary>Voir la solution</summary>

Elle garde `reservation.js` et le test, qui portent le refus. Elle sort `notes-prix.txt` de cet incrément : le prix de 45 € n'a pas à changer pendant le refus de la 9e place.

Elle relance `git diff --stat` et `git diff`. Le commit se prépare quand le fichier inattendu a disparu et que la comparaison `>= 8` est toujours là. Le créneau du samedi, 10 h-13 h à Croix-Rousse, ne se réécrit pas dans une note à part.

</details>

## Exercice 3 : Un jeton sous une bonne règle

La comparaison est `inscrits >= 8`. Le test « la 9e place est refusée » est vert pour 8 inscrits. Le même diff ajoute `SMS_TOKEN=sk-live-seve-croix-rousse`, pour « régler » les 3 absents du mois. Le commit est-il acceptable ?

<details>
<summary>Voir la solution</summary>

Non. La règle métier est bonne et le test nommé est vert. Le secret dans le diff suffit à refuser le commit. Les 3 absents expliquent un oubli de SMS. Ils ne mettent pas un jeton dans le dépôt.

Léa retire la ligne, vérifie que `git diff` ne la montre plus, et ne recopie pas le jeton dans le message de commit. Le remplissage d'environ 70 % ne change pas cette décision.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Relire le diff avant de committer"
center: "git diff dans le terminal : la règle, les fichiers, les secrets."
points:
  - icon: search
    title: "Lire les lignes"
    text: "git diff et git diff --stat. Le résumé de l'agent ne remplace pas la sortie."
  - icon: scale
    title: "Le signe des 8"
    text: "inscrits >= 8 refuse la 9e place. Le signe > la laisserait entrer."
  - icon: file
    title: "Fichier inattendu"
    text: "Un fichier hors incrément, comme une note de prix, sort du commit."
  - icon: lock
    title: "Secret visible"
    text: "Un jeton dans le diff bloque le commit, même si la règle des places est juste."
  - icon: alert
    title: "Commit refusé"
    text: "Tant qu'une 9e place passerait, Léa ne committe pas App Sève."
pitfall: "Committer parce que le diff est court, alors que inscrits > 8 laisse entrer la 9e personne."
remember: "Règle des 8 places, fichiers prévus, aucun secret. Ensuite seulement le commit."
```
