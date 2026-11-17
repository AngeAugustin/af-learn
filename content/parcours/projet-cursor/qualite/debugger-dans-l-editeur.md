---
title: Déboguer dans l'éditeur
description: "Un stage affiche 9 places restantes au lieu de 8. Coller l'erreur, citer le fichier avec @, exiger une hypothèse, relancer, et refuser un nettoyage général."
duration: 50
objectives:
  - "Décrire le symptôme avec le chiffre vu et le fichier cité par @"
  - "Exiger une hypothèse et la lire avant tout correctif"
  - "Relancer le même cas après un changement étroit"
  - "Refuser un diff qui nettoie le dépôt autour du bug"
---

# Neuf places à l'écran

Léa Vernet ouvre App Sève avant le samedi. Le stage de l'Atelier Sève, Lyon Croix-Rousse, 10 h-13 h, coûte 45 € et compte 8 places. Personne n'est encore inscrit. La carte affiche pourtant 9 places restantes. Une personne de trop peut croire qu'il reste un tour libre.

Ce chapitre est le geste de débogage dans l'éditeur. Vous ne réécrivez pas l'application. Vous ne changez pas le prix, ni l'horaire, ni le plafond d'attente de 12 personnes. Vous cherchez pourquoi l'écran dit 9 là où la salle en a 8. Le mois compte 12 stages : un seul affiche le mauvais reste, et c'est celui-là que vous ouvrez.

> [!IMPORTANT]
> Le symptôme est un chiffre. 9 places restantes, attendu 8. Sans ces deux nombres, l'agent devine un autre problème.

# Coller ce que vous voyez

Vous copiez l'erreur, ou la ligne qui affiche le reste. Vous la posez dans le chat telle quelle. Vous citez le fichier du calcul avec `@`, pour que le contexte soit ce fichier et non tout le dépôt. Le message demande une hypothèse. Il interdit de modifier tant que vous ne l'avez pas lue.

```text
@fichier-des-places
Le samedi 10 h-13 h affiche 9 places restantes.
Attendu : 8, alors que personne n'est inscrit.
Sortie : placesRestantes = 9
Donne une seule hypothèse. Ne modifie aucun fichier avant.
Ne nettoie pas le reste du code.
```

Le nom après `@` est le fichier réel du projet, celui qui calcule le reste. Vous le laissez ouvert dans l'éditeur pendant que le chat répond. L'écran de Léa, ou la sortie du terminal, reste visible. Vous ne remplacez pas le chiffre par un résumé du genre « il y a un bug d'affichage ».

> [!NOTE]
> `@` ajoute le fichier au contexte du message. Le symptôme, lui, vient de vous : le 9 que Léa a lu, et le 8 de la salle.

# Une hypothèse avant le diff

Une hypothèse est une phrase sur la cause. Elle peut dire : le compteur part de 9, ou il ajoute 1 aux 8 places, ou il compte une place qui n'existe pas dans l'atelier. Elle tient en une ou deux lignes. Vous la comparez au symptôme. Si elle explique un autre écran, un autre prix, ou l'envoi du SMS, vous la renvoyez.

Vous acceptez l'hypothèse quand elle relie le 9 obtenu au 8 attendu. Alors seulement, vous demandez le correctif. Le diff doit rendre le reste égal à 8 quand aucune place n'est prise, et le diminuer d'une place à chaque inscription, jusqu'au refus de la 9e. Vous lisez le diff avant de l'accepter.

```diagram
type: decision
title: "Accepter ou renvoyer"
nodes:
  - question: "L'hypothèse explique-t-elle 9 places restantes au lieu de 8 ?"
    yes: "Vous demandez un correctif limité à ce calcul."
    no: "Vous ne faites rien modifier. Vous demandez une autre hypothèse."
  - question: "Le diff touche-t-il seulement ce compteur ?"
    yes: "Vous relancez le même samedi, et vous relisez le chiffre."
    no: "Vous refusez le nettoyage et vous gardez le correctif étroit."
```

> [!WARNING]
> Une hypothèse lue après le diff arrive trop tard. Le fichier a déjà changé, et vous ne savez plus si le 9 venait de là.

# Relancer le même samedi

Le correctif se juge sur le cas qui a ouvert la séance. Personne d'inscrit, samedi 10 h-13 h, Croix-Rousse : l'écran doit afficher 8 places restantes. Une inscription ramène l'affichage à 7. La 9e demande ne crée pas une 9e place confirmée.

Vous relancez dans le terminal intégré le test qui porte ce cas, ou vous rouvrez la carte. Vous comparez au chiffre collé au début. S'il affiche encore 9, l'hypothèse n'a pas tenu, ou le diff n'a pas touché le bon endroit. Vous le dites avec la nouvelle sortie. Vous ne déclarez pas l'écran réparé parce que l'agent l'annonce.

Le reste du mois, les 12 stages à 45 €, ne doit pas bouger pendant ce correctif. Si un autre stage change de prix ou de nombre de places, vous le voyez dans le diff et vous le retirez de ce geste.

# Le nettoyage n'est pas un correctif

Devant un 9 inexpliqué, l'agent propose souvent d'en profiter. Renommer des variables, réindenter tout le fichier, déplacer la liste, réécrire l'attente, préparer déjà la règle des 18 h. Le diff devient long. Le symptôme disparaît au milieu du bruit, ou il reste, caché par des fichiers que vous n'aviez pas ouverts.

Vous répondez par le cadre. Un fichier, le calcul des places restantes, le passage de 9 à 8. Les autres changements attendent leur incrément. L'attente ordonnée a son tour. La confirmation et la décision avant 18 h la veille aussi. Les 3 absents du mois, ceux du SMS oublié, ne se règlent pas en reformattant ce fichier.

> [!TIP]
> Si le diff est difficile à raconter en une phrase, il dépasse le bug. La phrase juste est : le samedi affiche 8 places restantes quand personne n'est inscrit.

# Ce que vous gardez sous les yeux

Vous terminez avec trois traces dans l'éditeur. Le message d'origine, avec le 9 et le `@`. L'hypothèse, courte, acceptée par vous. La relance, qui montre 8. Ces trois traces tiennent dans le chat. Elles expliquent le diff à qui le relira.

Vous ne demandez pas à l'agent de « tout vérifier » après coup. Cette formule rouvre la porte au nettoyage. Vous demandez la relance du même cas. Le remplissage habituel, autour de 70 %, ne change rien au plafond : la salle a 8 places même les samedis bien remplis. Afficher 9, c'est annoncer une place qui n'existe pas.

| Vous collez | Vous exigez avant le diff | Vous relancez |
|---|---|---|
| 9 obtenu, 8 attendu | Une hypothèse sur ce calcul | Le samedi sans inscrit |
| Le fichier cité avec `@` | Aucune modification tant que vous n'avez pas lu | Le même chiffre, qui doit passer à 8 |
| L'interdiction de nettoyer | Un correctif que vous pouvez raconter en une phrase | Les 12 stages et les 45 €, inchangés |

# Exercices

## Exercice 1 : Le message qui cadre le bug

La carte du samedi, 0 inscrit, affiche 9 places restantes. Le fichier du calcul est ouvert. Écrivez le message pour l'agent.

<details>
<summary>Voir la solution</summary>

Le message cite le fichier avec `@`. Il donne le symptôme chiffré : 9 places restantes, attendu 8, personne n'est inscrit, stage du samedi 10 h-13 h. Il demande une seule hypothèse et interdit de modifier avant cette lecture. Il interdit aussi de nettoyer le reste du code.

Il ne demande pas de changer le prix de 45 €, ni d'ouvrir l'attente, ni de préparer la règle des 18 h.

</details>

## Exercice 2 : L'hypothèse à côté

L'agent répond : « Je vais réorganiser les fichiers, moderniser l'écran et en profiter pour l'attente. » Il n'a pas parlé du 9. Que faites-vous ?

<details>
<summary>Voir la solution</summary>

Vous ne laissez rien modifier. Cette réponse n'explique pas pourquoi l'écran affiche 9 au lieu de 8. Vous redemandez une hypothèse sur le calcul des places restantes, en une phrase, avant tout diff.

Un grand rangement peut faire disparaître le symptôme de la discussion sans le corriger. Le samedi de Léa a toujours 8 places.

</details>

## Exercice 3 : Le 9 est encore là

Vous aviez accepté une hypothèse étroite. Après le diff, la carte affiche encore 9 places restantes. L'agent écrit que le fichier est plus propre et propose de passer à la suite. Que relancez-vous ?

<details>
<summary>Voir la solution</summary>

Vous relancez le même cas : samedi, personne d'inscrit, attendu 8. Le chiffre obtenu est encore 9, donc le bug est toujours là. Vous collez cette nouvelle sortie et vous demandez une autre hypothèse. Vous ne validez pas le diff au motif qu'il est plus propre.

La suite, l'attente ou la règle des 18 h, attend que ce samedi affiche 8.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Déboguer le chiffre 9
center: "Léa voit 9 places restantes au lieu de 8. On colle le chiffre, on cite le fichier, on lit une hypothèse, on relance."
points:
  - icon: search
    title: Le symptôme
    text: "9 places restantes, attendu 8, samedi 10 h-13 h, personne encore inscrit."
  - icon: file
    title: Le fichier avec @
    text: "Vous citez le fichier du calcul. Le chat ne reçoit pas tout le dépôt."
  - icon: idea
    title: L'hypothèse
    text: "Une phrase sur la cause, lue par vous, avant la moindre modification."
  - icon: loop
    title: La relance
    text: "Le même samedi doit afficher 8. Vous comparez à la sortie collée au début."
  - icon: shield
    title: Le cadre
    text: "Le diff ne renomme pas le projet et ne prépare pas la règle des 18 h."
pitfall: "Laisser l'agent tout nettoyer, ou accepter un fichier plus propre alors que l'écran affiche encore 9."
remember: "Hypothèse d'abord, correctif étroit, relance du même cas. Huit places dans la salle, huit à l'écran."
```
