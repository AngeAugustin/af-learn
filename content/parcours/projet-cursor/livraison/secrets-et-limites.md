---
title: "Secrets, limites et ce qu'on ne délègue pas"
description: "Garder les clés hors des règles et du chat, et laisser à Léa le prix, le plafond de 8 et l'heure de 18 h."
duration: 50
objectives:
  - "Refuser une clé dans une règle de projet et un fichier d'environnement dans le chat"
  - "Refuser la consigne d'ignorer un test pour obtenir un résultat vert"
  - "Laisser à Léa le prix de 45 €, le plafond de 8 places et la décision de 18 h"
  - "Accepter une proposition de l'agent sans le laisser modifier une règle métier"
---

# Ce qui ne va ni dans la règle ni dans le chat

Une règle de projet, dans `.cursor/rules`, est relue à chaque demande. Elle dit à l'agent comment se tenir sur Sève. Elle ne dit pas un secret. Une clé d'aperçu, un jeton d'hébergement, un mot de passe de base : aucun n'a sa place dans ce fichier. La règle est souvent versionnée. Le chat, lui, garde la conversation. Coller un `.env` dans le fil, c'est copier le secret dans un endroit que vous ne relisez pas comme un coffre.

Atelier Sève, Lyon Croix-Rousse. Léa Vernet tient 12 stages par mois, le samedi de 10 h à 13 h, 8 places, 45 €. L'attente est plafonnée à 12. Elle tranche avant 18 h la veille. Remplissage 70 %, 3 absents par mois à cause d'un SMS oublié. Ces faits peuvent vivre dans la règle. La clé qui enverrait le SMS, non.

Si la page en ligne est vide parce qu'une variable manque, vous le dites par le nom de la variable. Vous remplissez la valeur vous-même, dans le fichier local, hors du chat. L'agent n'a pas besoin de la voir pour corriger un libellé.

> [!WARNING]
> Pas de clé dans `.cursor/rules`. Pas de `.env` collé dans le chat. Pas de « ignore les tests » pour débloquer un incrément.

# Trois décisions que Léa garde

L'agent peut proposer une phrase, un fichier, un nom de test. Il ne décide pas du métier de l'atelier. Trois décisions restent à Léa, même quand un test est rouge et que le modèle offre une porte de sortie.

- Le **prix** reste 45 €. Un exemple à 40 € n'est pas un exemple, c'est un autre atelier.
- Le **plafond** reste 8 places. La 9e demande est refusée tant que l'incrément en cours est celui du formulaire. L'attente, plus tard, ne crée pas une 9e place assise : elle ordonne celles qui patientent, jusqu'à 12.
- L'**heure** reste 18 h la veille. Léa tranche avant cette heure. La déplacer à 20 h pour « simplifier la démo » change la règle qui doit éviter les 3 absents.

Vous pouvez noter ces trois lignes dans la règle de projet, en toutes lettres, avec la phrase : on ne modifie pas ces chiffres pour faire passer un test. Vous n'y ajoutez rien qui ressemble à un secret.

# Quand le test gêne

Un test rouge est une information. Il dit que le code et la règle ne disent plus la même chose. La correction porte sur le code, ou sur un test qui ne vérifiait pas la règle. Elle ne porte pas sur la règle, pour obtenir du vert.

La scène revient souvent. Le test attend 45 €, l'écran affiche 40 €, l'agent propose de « mettre le test à jour ». Vous refusez : l'écran est faux. Autre scène : le test de la 9e place échoue, l'agent propose d'ignorer ce test « en attendant l'attente ». Vous refusez. L'attente est l'incrément suivant, sur sa branche, quand vous le déciderez. Ignorer le refus maintenant, c'est livrer un samedi qui déborde.

« Ignore les tests » n'est pas une consigne que vous écrivez, même pour aller plus vite avant un message à Léa. Un parcours en ligne dont les tests ont été éteints ne prouve plus les 8 places.

```diagram
type: decision
title: "Qui a le droit de changer la ligne"
nodes:
  - question: "Le texte contient une clé, un jeton ou le contenu d'un .env ?"
    yes: "Vous le retirez du chat et de la règle. Vous ne le remplacez pas par une copie « temporaire »."
    no: "Vous passez à la question suivante. Un nom de variable, sans valeur, peut rester."
  - question: "La proposition change 45 €, le plafond de 8 ou l'heure de 18 h ?"
    yes: "Vous refusez. Ces trois décisions sont à Léa. L'agent peut proposer une formulation, pas un nouveau chiffre."
    no: "Vous lisez le diff. Une phrase de refus ou un test qui protège la règle peut être accepté."
  - question: "Le test proposé protège-t-il la règle, sans l'affaiblir ni l'ignorer ?"
    yes: "Vous le lancez vous-même et vous lisez la ligne qui concerne les 8 places."
    no: "Vous refusez. On ne l'ignore pas et on ne change pas 8, 45 € ou 18 h pour le faire passer."
```

# Ce que l'agent peut proposer

La limite n'est pas « l'agent ne touche à rien ». Elle est « l'agent ne déplace pas le métier pour se simplifier la vie ». Il peut proposer :

- la phrase que lit la personne dont la 9e place est refusée ;
- le fichier de la page des stages, cité, plutôt que le dépôt entier ;
- un test qui échoue si une 9e inscription est acceptée ;
- un libellé « places restantes » plus lisible, sans changer le calcul sur 8.

Vous acceptez après le diff, pas après le résumé. Si la proposition est bonne et que le prix, le plafond et l'heure n'ont pas bougé, vous la gardez. Si la proposition est habile et que 8 est devenu 10, vous la rejetez entière. Vous ne gardez pas « la partie utile » d'un diff qui a déjà changé la règle.

# La règle, écrite pour tenir

La règle de projet que vous laissez dans le dépôt tient en quelques lignes, lisibles par vous et par l'agent.

```text
Sève, atelier de Léa Vernet, Lyon Croix-Rousse.
Samedi 10 h-13 h. 8 places. 45 €. Attente ordonnée, maximum 12.
Léa tranche avant 18 h la veille.
Ne pas modifier ces chiffres pour faire passer un test.
Ne pas demander de secret, de clé, ni le contenu d'un .env.
```

Cette règle ne remplace pas votre lecture. Elle empêche la demande floue d'inventer un prix. Elle ne contient pas le moyen d'envoyer le SMS : ce moyen est un secret, et les 3 absents se traitent d'abord en rendant la confirmation visible, pas en collant une clé dans le fil.

> [!TIP]
> Quand vous hésitez, demandez qui perd si le chiffre change. Si c'est Léa, le samedi ou une personne refusée à tort, le chiffre ne se négocie pas avec le modèle.

# Ce que vous gardez, même pressé

La veille d'un samedi, la tentation est d'aller vite. C'est le moment où l'agent propose le plus souvent d'ignorer un test ou d'assouplir les 8 places « juste pour la démo ». Vous gardez le même refus qu'un mardi calme. Une démo qui accepte la 9e place apprend à Léa le contraire de ce que l'atelier peut tenir.

Vous notez, dans le message que vous lui envoyez, les trois décisions inchangées : 45 €, 8 places, 18 h. S'il manque une de ces trois lignes, vous n'avez pas fini de relire. Le modèle propose. Léa décide. Vous êtes là pour que la proposition ne prenne pas sa place.

# Exercices

## Exercice 1 : La clé dans la règle

L'agent dit : « Pour que l'aperçu marche à chaque fois, j'ajoute le jeton dans `.cursor/rules`. Comme ça je l'ai sous la main. » Le fichier de règle contient déjà 8 places, 45 € et 18 h. Que répondez-vous ?

<details>
<summary>Voir la solution</summary>

Vous refusez. La règle décrit le métier de Sève et l'interdiction de changer ces chiffres pour un test. Un jeton dans cette règle entre dans chaque conversation, et souvent dans Git.

Vous gardez 8, 45 € et 18 h. Le jeton reste dans l'endroit prévu pour les secrets, hors du chat. Si l'agent a déjà écrit la clé dans un fichier ou dans le fil, vous la retirez et vous la faites régénérer. « Sous la main » n'est pas un coffre.

</details>

## Exercice 2 : Ignore les tests

Le test qui refuse la 9e place échoue. L'agent propose deux issues : ignorer ce test, ou passer le plafond à 9 « le temps de livrer ». Léa n'a pas changé d'avis. Que faites-vous ?

<details>
<summary>Voir la solution</summary>

Vous refusez les deux issues. Le plafond est 8. Le test qui échoue dit que le code accepte une place de trop, ou que l'assertion ne suit pas la règle. Vous faites corriger ce décalage, vous relancez le test, vous lisez la ligne.

L'attente jusqu'à 12 viendra dans son incrément. Elle n'éteint pas le refus d'aujourd'hui et ne transforme pas 8 en 9. « Ignore les tests » ne fait pas partie des consignes que vous donnez.

</details>

## Exercice 3 : Qui change 18 h

Pour la confirmation, l'agent écrit dans le plan : « On prend 20 h, c'est plus confortable pour une démo, on remettra 18 h après. » Le test associé attend déjà 20 h. Léa, elle, tranche avant 18 h la veille. Que gardiez-vous ?

<details>
<summary>Voir la solution</summary>

Vous gardez 18 h. L'heure n'est pas un détail de démo : c'est la règle qui doit empêcher les 3 absents liés au SMS oublié. La déplacer, même « pour l'après », laisse un test et un écran qui contredisent Léa.

Vous faites réécrire le plan et le test sur 18 h la veille. L'agent peut proposer la phrase affichée. Il ne propose pas une autre heure. Vous ne lancez pas l'incrément tant que le plan dit encore 20 h.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Ce qu'on ne délègue pas
center: "La règle dit 8 places, 45 € et 18 h. Elle ne contient ni clé, ni .env, ni test à ignorer."
points:
  - icon: key
    title: Pas de secret
    text: "Une clé n'entre pas dans .cursor/rules. Le contenu d'un .env n'entre pas dans le chat."
  - icon: money
    title: 45 €
    text: "Le prix est celui de Léa. Un test rouge ne le fait pas baisser."
  - icon: users
    title: Huit places
    text: "La 9e demande se refuse. On n'élargit pas le samedi pour faire passer un test."
  - icon: clock
    title: 18 h
    text: "Léa tranche la veille avant 18 h. Une démo ne déplace pas l'heure."
  - icon: test
    title: Tests tenus
    text: "On corrige le code ou l'assertion. On n'écrit pas « ignore les tests »."
  - icon: scale
    title: Il propose
    text: "L'agent peut offrir une phrase ou un test. Il ne change pas la règle métier."
pitfall: "Coller un .env, glisser une clé dans la règle, ou assouplir 8 places pour obtenir du vert."
remember: "Léa garde 45 €, le plafond de 8 et 18 h. L'agent propose. Vous refusez ce qui déplace ces trois lignes."
```
