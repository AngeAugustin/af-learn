---
title: "Construire le premier incrément"
description: "Lancer la construction seulement après le plan de la liste, avec un prompt court, puis compter 12 stages avant toute réservation."
duration: 50
objectives:
  - "Construire l'incrément 1 seulement une fois le plan corrigé"
  - "Envoyer un prompt court qui rappelle 8 places, 45 € et les places restantes"
  - "Lire les fichiers touchés, puis lancer l'application"
  - "Refuser de passer à la réservation tant que la liste est fausse"
---

# Construire après le plan, pas à la place

Vous lancez la construction quand le plan de la page des 12 stages est corrigé et enregistré. Pas avant. Si le plan dit encore 10 places, ou s'il contient un paiement, vous ne « verrez bien en construisant ». Vous retournez au plan.

Le mode Plan a fini son travail de recherche et de questions. Construire, c'est demander d'exécuter cette version-là. Vous citez le fichier du plan dans le workspace. Vous ne réexpliquez pas Atelier Sève depuis zéro, et vous n'en profitez pas pour ajouter le formulaire.

Léa Vernet n'est pas dans l'éditeur. La preuve que vous lui devez est encore la même : 12 stages, samedi 10 h-13 h, à Lyon Croix-Rousse, 8 places, 45 €, places restantes. La construction réussit ou échoue sur cet écran, pas sur le nombre de fichiers modifiés.

> [!IMPORTANT]
> Pas de plan corrigé, pas de construction. Un plan faux, exécuté vite, produit une liste fausse plus rapidement.

# Un prompt court qui rappelle les chiffres

Le prompt de construction est court. Il pointe le plan. Il rappelle les faits que l'écran doit montrer, pour qu'ils ne se perdent pas. Il répète les interdits déjà écrits.

Vous pouvez envoyer ceci, en citant vos fichiers :

```text
Construis l'incrément 1 du plan enregistré.
La page liste les 12 stages.
Chaque stage affiche samedi 10 h-13 h, 8 places, 45 €, et les places restantes.
Pas de réservation. Pas de paiement.
```

Court ne veut pas dire vague. « Fais la page » est court et inutile. Le message ci-dessus rappelle 8 places, 45 € et les places restantes, et il ferme la porte au formulaire. Il ne réinvente pas le brief : il le répète, les mêmes chiffres, pas d'autres.

Vous n'y mettez pas les 3 absents, ni le remplissage de 70 %, ni la règle des 18 h. Ces faits restent vrais. Ils ne sont pas la preuve de cet incrément. Les ajouter, c'est inviter la confirmation ou une statistique sur la carte.

> [!TIP]
> Un bon prompt de construction tient en quelques lignes, cite le plan, et répète 8, 45 € et les places restantes. Il n'ouvre pas l'incrément suivant.

# Lire la liste des fichiers touchés

Quand l'agent a fini, vous ne lancez pas l'application tout de suite. Vous lisez d'abord la liste des fichiers touchés, dans la revue du chat.

Pour cet incrément, vous vous attendez à des fichiers de données (les 12 stages), à la page qui les affiche, et au style qui rend la liste lisible. Plusieurs fichiers sont normaux. Le plan les annonçait.

Vous vous arrêtez si la liste contient autre chose : un paiement, un formulaire de réservation, une page à propos, un fichier que le plan ne citait pas. Vous n'ouvrez pas l'application pour « voir si c'est joli quand même ». Un fichier en trop est déjà une dérive. Ici, le premier geste est de regarder les noms. La lecture ligne à ligne vient juste après, avant d'accepter.

> [!WARNING]
> Des noms inattendus (paiement, à propos, réservation) veulent dire que l'incrément 1 n'est pas seul dans le changement. Vous ne lancez pas l'appli pour noyer ça.

# Lancer l'application et compter

Si les noms collent au plan, vous lancez l'application depuis le terminal intégré de Cursor. Vous utilisez la commande qui sert déjà le projet. Vous ouvrez la page des stages.

Vous comptez. 12 lignes, pas 11, pas « quelques stages ». Sur chacune : samedi, 10 h-13 h, 8 places, 45 €, places restantes. Si personne n'est inscrit, les places restantes valent 8. Le lieu peut se lire : Atelier Sève, Lyon Croix-Rousse. Vous lisez comme Léa, pas comme l'auteur du prompt.

Vous notez ce qui cloche, par écrit, en une liste courte : horaire faux, prix faux, nombre de stages faux, places restantes absentes. Vous ne corrigez pas « à la main dans un coin » sans l'avoir vu. La liste fausse est un fait, pas une impression.

# Une liste fausse bloque la réservation

Tant que la liste est fausse, vous ne passez pas à la réservation. Pas de formulaire, pas de 9e place, pas d'attente, pas de confirmation. L'incrément 2 n'a pas de sens sur 11 stages, ni sur un samedi écrit dimanche, ni sur 40 €.

« On branchera le formulaire, ça obligera à corriger la liste » est une mauvaise économie. Le formulaire cachera le décompte. Vous aurez deux preuves fausses au lieu d'une. Vous restez sur l'incrément 1 jusqu'à pouvoir compter 12 lignes justes devant Léa.

Une liste juste, elle, ne s'améliore pas en lui ajoutant un bouton Réserver dans la foulée. Vous vous arrêtez. Vous montrez la page. Le formulaire aura son propre plan. L'attente jusqu'à 12 et la décision avant 18 h la veille attendront aussi.

> [!NOTE]
> La réservation est l'incrément suivant, pas une finition de la liste. Une liste fausse la bloque. Une liste juste ne l'entraîne pas toute seule.

# Ce que vous montrez à Léa

Vous montrez la page, pas le prompt. Léa compte avec vous. Elle doit pouvoir dire : ce sont mes 12 stages du mois, le samedi de 10 h à 13 h, 8 places, 45 €. Les places restantes se comprennent sans votre commentaire.

Si elle contredit un fait, vous ne débattez pas avec l'écran. Vous revenez au brief, puis au plan. L'application a suivi ce qui était écrit. Si l'écrit était faux, c'est l'écrit qu'on corrige, puis on reconstruit cet incrément. On n'ajoute pas un correctif verbal dans un coin de la page.

Vous ne lui montrez pas le paiement « déjà préparé », ni une page à propos. Ce n'était pas le rendez-vous. Le rendez-vous, c'est la liste. Les 3 absents et le SMS oublié expliquent pourquoi vous reviendrez. Ils ne se démontrent pas aujourd'hui. Le remplissage de 70 % non plus.

```diagram
type: flow
title: "Construire la liste, puis s'arrêter"
steps:
  - title: Plan prêt
    text: "Incrément 1 corrigé et enregistré. Pas de formulaire, pas de paiement."
    tone: violet
  - title: Prompt court
    text: "12 stages, 8 places, 45 €, places restantes, samedi 10 h-13 h."
    tone: blue
  - title: Fichiers
    text: "Vous lisez les noms touchés avant d'ouvrir la page."
    tone: teal
  - title: Comptage
    text: "12 lignes justes. Sinon, pas de réservation."
    tone: amber
```

# Exercices

## Exercice 1 : Raccourcir le prompt sans le vider

On vous propose : « Fais une belle application complète pour Léa, avec les stages, les inscriptions, l'attente, la confirmation et le paiement, moderne et simple. » Réécrivez le message qui lance seulement l'incrément 1.

<details>
<summary>Voir la solution</summary>

« Construis l'incrément 1 du plan enregistré. La page liste les 12 stages. Chaque stage affiche samedi 10 h-13 h, 8 places, 45 €, et les places restantes. Pas de réservation. Pas de paiement. »

Le plan est cité, pas réinventé. 8 places, 45 € et les places restantes sont rappelés. Le formulaire, l'attente jusqu'à 12, la règle des 18 h et le paiement restent dehors. « Belle », « complète » et « moderne » n'entrent pas : Léa ne peut pas les contredire.

</details>

## Exercice 2 : Onze stages, et l'envie d'avancer

Vous lancez l'application. La page montre 11 stages, de 9 h à 12 h, à 40 €. Les places restantes n'apparaissent pas. Un collègue dit : « On fera le formulaire maintenant, la liste se corrigera en passant. » Que décidez-vous ?

<details>
<summary>Voir la solution</summary>

Vous ne passez pas à la réservation. La liste est fausse sur quatre points : 11 au lieu de 12, 9 h-12 h au lieu de 10 h-13 h, 40 € au lieu de 45 €, places restantes absentes. Atelier Sève, Lyon Croix-Rousse, le samedi, n'est pas encore montrable à Léa.

Vous restez sur l'incrément 1. Le formulaire cacherait le décompte et ajouterait une deuxième preuve fausse. Vous notez les écarts, vous revenez au plan, vous ne bricolez pas un bouton Réserver par-dessus.

</details>

## Exercice 3 : Des noms de fichiers avant le terminal

La construction se termine. La revue cite le fichier des stages, la page, la feuille de style, et un fichier de paiement. Le terminal est ouvert, le collègue veut déjà lancer l'application. Que faites-vous en premier ?

<details>
<summary>Voir la solution</summary>

Vous ne lancez pas. Le paiement n'était pas dans le plan de la liste. 45 € s'affiche, il ne s'encaisse pas. Voir une page « à peu près juste » n'efface pas ce fichier.

Vous lisez les noms d'abord. Les données, la page et le style peuvent servir l'incrément 1. Le paiement non. Vous le refusez avant d'ouvrir l'écran. Ensuite seulement, si les fichiers restants collent au plan, vous lancez et vous comptez 12 stages, samedi 10 h-13 h, 8 places, places restantes.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Construire la liste, puis compter
center: "On construit après le plan. Prompt court, fichiers lus, appli lancée, 12 lignes avant la suite."
points:
  - icon: compass
    title: Après le plan
    text: "Le plan de l'incrément 1 est corrigé et enregistré. On ne construit pas pour le découvrir."
  - icon: chat
    title: Prompt court
    text: "12 stages, samedi 10 h-13 h, 8 places, 45 €, places restantes. Pas de réservation."
  - icon: file
    title: Les noms d'abord
    text: "Données, page, style : attendus. Paiement ou page à propos : on s'arrête avant de lancer."
  - icon: terminal
    title: Lancer, compter
    text: "Terminal de Cursor, commande du projet, puis 12 lignes justes. Pas 11, pas 40 €."
  - icon: shield
    title: Pas de suite
    text: "Liste fausse : pas de formulaire. Liste juste : on la montre à Léa, on ne réserve pas encore."
pitfall: "Brancher la réservation pour corriger une liste à 11 stages. Vous obtenez deux preuves fausses."
remember: "Le prompt rappelle 8 places, 45 € et les places restantes. On ne passe pas à la réservation si la liste est fausse."
```
