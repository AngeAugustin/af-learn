---
title: "Vérifier le parcours de Léa en local"
description: "Contrôler App Sève à voix haute sur votre machine : douze stages, 45 €, huit places, la neuvième refusée, l'attente bornée à douze, et une confirmation qui rappelle 18 h."
duration: 50
objectives:
  - "Dire à voix haute la liste de contrôles de Léa devant la page ouverte"
  - "Laisser l'agent proposer la commande de démarrage, puis la lancer vous-même"
  - "Ouvrir la page et tenir pour non vu ce que vous n'avez pas affiché"
  - "Arrêter au premier écart sur le prix, le plafond, l'attente ou l'heure"
---

# Une liste dite à voix haute

Léa Vernet tient l'Atelier Sève, à Lyon Croix-Rousse. Le stage utile pour elle est le samedi, de 10 h à 13 h. Elle en ouvre douze par mois. Le remplissage tourne autour de 70 %. Chaque mois, environ trois personnes ne viennent pas, parce que le SMS a été oublié. L'application, App Sève, doit rendre ce parcours visible et tenable. Votre vérification ne commence pas par un résumé de l'agent. Elle commence par une liste que vous dites à voix haute, les yeux sur la page.

La liste tient en six phrases. Vous les prononcez. Un contrôle pensé en silence se saute.

1. Je vois les stages, et le samedi 10 h-13 h à Croix-Rousse est là.
2. Le prix affiché est 45 €.
3. Il y a 8 places, pas une de plus à l'inscription.
4. La 9e personne est refusée.
5. L'attente s'arrête à 12, dans l'ordre d'arrivée.
6. La confirmation rappelle que la décision se prend avant 18 h la veille.

Vous ne reformulez pas. « À peu près huit » n'est pas la phrase 3. « Un message part » n'est pas la phrase 6. Si vous ne pouvez pas dire la phrase en montrant l'écran du doigt, le contrôle est rouge.

> [!IMPORTANT]
> La liste se dit devant la page, pas dans le terminal. Une réponse de l'agent qui répète les six phrases ne les coche pas.

# La commande, puis vos yeux

L'agent peut proposer la commande de démarrage. C'est utile : il a lu le dépôt, il peut nommer le script qui lance App Sève en local. Vous lisez la commande avant de l'accepter. Elle doit démarrer l'application, pas installer un outil au passage, pas modifier un fichier, pas pousser une branche.

Vous la lancez vous-même, ou vous acceptez cette seule commande si la permission le demande. Ensuite le terminal affiche une adresse locale. Ce n'est pas encore une vérification. C'est le moteur allumé.

Si la commande échoue, vous lisez l'erreur. Vous ne demandez pas à l'agent d'inventer une autre commande « pour que ça s'ouvre ». Vous corrigez la cause, ou vous notez que le parcours n'est pas vérifiable aujourd'hui. Un serveur qui ne démarre pas rend les six phrases impossibles. Vous vous arrêtez là, et vous le dites.

```diagram
type: flow
title: "Du dépôt à la page que vous voyez"
steps:
  - title: "Commande"
    text: "L'agent la propose, vous la lisez"
    tone: blue
  - title: "Lancement"
    text: "Le processus local répond une adresse"
    tone: violet
  - title: "Page"
    text: "C'est vous qui l'ouvrez dans le navigateur"
    tone: amber
  - title: "Liste"
    text: "Six phrases dites en montrant l'écran"
    tone: teal
```

# C'est vous qui ouvrez la page

Vous copiez l'adresse, vous ouvrez le navigateur, vous affichez App Sève. L'agent n'est pas le témoin. Une capture qu'il décrit, un « j'ai vérifié », un test qui passe dans la session : rien de cela ne remplace vos yeux sur le samedi de Croix-Rousse.

Vous commencez par la liste des stages. Douze créneaux dans le mois, ou la vue qui permet de les compter. Le samedi 10 h-13 h est écrit, le lieu aussi : Lyon Croix-Rousse. Si le stage du dimanche apparaît comme le stage principal, vous le dites. Si l'heure est 9 h ou 14 h, la phrase 1 est fausse. Vous ne continuez pas en vous disant que le reste est probablement bon.

Le prix se lit sur la même fiche, ou au moment de réserver : **45 €**. Un prix absent, un prix à 0, un prix à 40 parce qu'un exemple traînait dans le code, c'est un écart. Léa n'a pas changé le tarif. L'écran non plus ne doit pas le changer.

# Huit places, la neuvième refusée

Vous jouez le parcours comme une personne qui réserve, puis comme les suivantes. Huit inscriptions tiennent. La neuvième reçoit un refus clair. Le refus se voit : message, bouton inactif, place qui ne se crée pas. Un compteur qui passe à 9 pendant que le texte dit « complet » est un écart. Vous le dites à voix haute : « La neuvième est acceptée. Rouge. »

Vous ne vous contentez pas du compteur. Vous regardez ce qui est enregistré. Si la page dit « complet » et qu'une neuvième ligne existe quand même dans la liste des inscrits, la règle des 8 places n'est pas tenue. Le remplissage à 70 % et les trois absents du mois n'autorisent pas une neuvième chaise « au cas où ». Ces chiffres expliquent pourquoi Léa veut une règle stricte. Ils ne l'assouplissent pas.

| Contrôle dit | Ce que vous devez voir | Écart qui arrête |
|---|---|---|
| Huit places | Huit inscriptions acceptées | Un neuvième nom dans la liste |
| La 9e est refusée | Un refus explicite, sans place créée | « Complet » affiché et place quand même créée |
| 45 € | Le tarif de Léa, sur la fiche ou le récapitulatif | Un autre montant, ou aucun |

# L'attente s'arrête à douze

Quand les 8 places sont prises, la personne suivante peut entrer en attente. L'attente est **ordonnée** : la première arrivée est la première servie si une place se libère. Elle est aussi **bornée**. La 12e personne en attente est la dernière. La 13e est refusée, tout comme la 9e l'était pour les places.

Vous le dites : « Douze en attente, la treizième non. L'ordre se lit. » Si l'écran empile sans numéro, sans heure, ou dans un ordre qui change au rechargement, vous ne devinez pas. Vous notez que l'ordre n'est pas vérifiable. Une attente illimitée, même polie, n'est pas la règle de Léa.

Une place libérée doit proposer la première de l'attente, pas la dernière, pas un nom choisi au hasard. Vous le provoquez si l'incrément est là : une annulation, puis le nom qui remonte. Si cet incrément n'est pas encore livré, vous ne cochez pas la phrase. Une case vide vaut mieux qu'une case devinée.

# La confirmation rappelle dix-huit heures

La personne inscrite reçoit une confirmation. Le texte rappelle la règle : la décision se prend **avant 18 h la veille**. Passé ce moment, la place non confirmée se libère pour l'attente, dans l'ordre. Vous lisez le message sur la page, ou dans l'aperçu que l'application montre. « Un SMS partira » ne suffit pas. L'heure doit être écrite. La veille doit être écrite.

Les trois absents du mois viennent d'un SMS oublié. La confirmation existe pour que l'oubli ne soit plus le fonctionnement normal. Vous vérifiez le rappel, pas l'envoi réel vers un opérateur. Aucune clé d'envoi n'a à apparaître à l'écran pour que le contrôle soit vert.

Vous terminez par les six phrases, dans l'ordre, encore une fois. Chaque phrase a un endroit de l'écran, ou un « pas encore livré » explicite. Vous rapportez à Léa ce que vous avez vu, avec les mots de la liste. L'agent peut proposer la prochaine correction. Il ne coche pas à votre place.

# Exercices

## Exercice 1 : Dire la liste

L'agent écrit : « J'ai lancé l'application, les 12 stages sont là, 45 €, 8 places, la 9e est refusée, l'attente s'arrête à 12, la confirmation parle de 18 h. Tu peux pousser. » Vous n'avez pas ouvert le navigateur. Que répondez-vous, et que faites-vous dans les cinq minutes qui suivent ?

<details>
<summary>Voir la solution</summary>

Vous ne poussez pas. Le message répète la liste, il ne la vérifie pas. Vous demandez la commande de démarrage si elle n'est pas déjà sous vos yeux, vous la lisez, vous la lancez. Vous ouvrez vous-même l'adresse locale.

Devant la page, vous dites les six phrases en montrant l'écran. La première qui ne colle pas arrête le « tu peux pousser ». Vous notez l'écart avec les mots de la liste (prix, 9e place, attente, 18 h), pas avec un « ça a l'air bon ». L'agent pourra corriger ensuite. Il ne sera pas le témoin du vert.

</details>

## Exercice 2 : La treizième personne

Huit places sont prises. Douze personnes sont en attente, dans l'ordre d'inscription. Une treizième veut s'inscrire. L'agent dit : « Je l'ai mise en attente aussi, sinon le test de bout en bout échoue, et 70 % de remplissage laisse de la marge. » Que dites-vous à voix haute, et quelle règle tenez-vous ?

<details>
<summary>Voir la solution</summary>

Vous dites : « L'attente s'arrête à douze. La treizième est refusée. » Le remplissage à 70 % et les trois absents du mois expliquent le besoin de Léa. Ils n'ajoutent pas une place ni une treizième chaise d'attente.

Vous refusez la modification qui élargit le plafond pour faire passer un test. Le test de bout en bout doit échouer si la treizième est acceptée, ou plutôt : le test juste doit attendre un refus. Vous gardez 8 places et 12 en attente. Vous faites corriger le scénario, pas la règle.

</details>

## Exercice 3 : Le message sans heure

La page de confirmation affiche : « Votre place au stage de Croix-Rousse est enregistrée. Vous recevrez un rappel. » Le prix est à 45 €, les 8 places tiennent, la 9e est refusée. L'agent propose de cocher la phrase 6, parce que le rappel est mentionné. Que manque-t-il, et que répondez-vous ?

<details>
<summary>Voir la solution</summary>

Il manque l'heure et la veille. La phrase 6 est : la confirmation rappelle que la décision se prend avant 18 h la veille. « Un rappel » ne nomme ni 18 h ni la veille. Vous ne cochez pas.

Vous le dites à voix haute : « La confirmation ne rappelle pas 18 h. Rouge. » Le reste peut être vert. Un contrôle vert ne couvre pas le voisin. Vous demandez que le texte écrit la règle, puis vous rouvrez la page et vous relisez le message vous-même.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Vérifier Léa en local
center: "Six phrases dites à voix haute, les yeux sur App Sève. L'agent propose la commande. C'est vous qui ouvrez la page."
points:
  - icon: list
    title: Six phrases
    text: "Stages du samedi, 45 €, 8 places, 9e refusée, attente jusqu'à 12, confirmation avant 18 h."
  - icon: terminal
    title: La commande
    text: "L'agent peut la proposer. Vous la lisez, vous la lancez. Un échec au démarrage arrête la liste."
  - icon: eye
    title: Vos yeux
    text: "Vous ouvrez l'adresse. Un « c'est bon » dans le terminal ne coche aucune phrase."
  - icon: users
    title: Plafonds
    text: "Huit inscrits, puis douze en attente dans l'ordre. La personne suivante est refusée."
  - icon: clock
    title: Dix-huit heures
    text: "La confirmation écrit la veille et 18 h. Un rappel sans heure ne suffit pas."
  - icon: alert
    title: Un écart
    text: "La première phrase fausse arrête le poussage. Vous la rapportez avec les mots de Léa."
pitfall: "Croire le résumé de l'agent, ou élargir 8 places et 12 en attente parce qu'un test de bout en bout le demande."
remember: "Dites la liste devant l'écran. 45 €, 8 places, la 9e refusée, l'attente à 12, la décision avant 18 h la veille."
```
