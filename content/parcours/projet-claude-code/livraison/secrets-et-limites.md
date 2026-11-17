---
title: "Secrets, permissions et limites"
description: "Garder les clés hors de CLAUDE.md et hors du dépôt, refuser une allowlist de toutes les commandes, et laisser à Léa le prix, le plafond et l'heure."
duration: 50
objectives:
  - "Tenir les secrets hors de CLAUDE.md et hors des fichiers commités"
  - "N'autoriser que les commandes nécessaires à la session, une par une"
  - "Laisser à Léa le prix de 45 €, le plafond de 8 places et l'heure de 18 h"
  - "Refuser qu'un test fasse assouplir la règle des 8 places"
---

# Pas de clé dans CLAUDE.md

CLAUDE.md est lu au début de chaque session. Il est fait pour être commité. Tout ce que vous y écrivez entre dans le contexte de l'agent, et souvent dans le dépôt que d'autres lisent. C'est l'endroit des règles de l'Atelier Sève. Ce n'est pas un coffre.

Vous y mettez ce que Léa Vernet a décidé et que l'agent doit retrouver demain : stage du samedi, 10 h à 13 h, Lyon Croix-Rousse, 12 stages par mois, 45 €, 8 places, attente ordonnée jusqu'à 12, confirmation qui rappelle la décision avant 18 h la veille. Vous pouvez y rappeler le contexte : remplissage autour de 70 %, environ trois absents par mois parce qu'un SMS a été oublié. Ces faits aident à ne pas « optimiser » la mauvaise chose.

Vous n'y mettez aucune clé. Pas de jeton d'API, pas de mot de passe de messagerie, pas de secret pour « que l'agent puisse envoyer le SMS de test ». Une clé dans CLAUDE.md se recopie dans les logs de session, dans un diff, dans un message. Le jour où le fichier est poussé, le secret est public. Vous la retirez, vous la révoquez, vous ne la déplacez pas deux lignes plus bas.

> [!WARNING]
> Un secret écrit « temporairement » dans CLAUDE.md pour débloquer une session reste dans l'historique du fichier dès le premier commit.

# Pas de .env commité

Les valeurs qui ouvrent un service vivent dans un fichier d'environnement local, hors dépôt. Le `.env` est ignoré par Git. Un `.env.example` peut lister les **noms** des variables, avec des valeurs vides ou fausses, pour qu'une autre personne sache quoi demander. Il ne contient pas la clé qui marche.

Vous vérifiez avant chaque commit que le diff ne montre pas `.env`, ni une clé collée dans un test, ni une URL avec un jeton dans la requête. L'agent a le droit de créer un exemple. Il n'a pas le droit d'ajouter le fichier réel « pour que les tests d'envoi passent ». Les trois absents du mois expliquent pourquoi un rappel existe. Ils ne justifient pas de committer l'accès à l'opérateur SMS.

Si une clé a déjà été commitée, la suite est courte : la retirer du fichier, la révoquer auprès du service, recommencer avec une clé neuve qui n'est pas dans l'historique. Effacer la ligne au commit suivant laisse l'ancienne dans le dépôt.

# Pas toutes les commandes

Une allowlist dit quelles commandes passent sans redemander. Elle vit dans `.claude/settings.json`, le fichier de l'équipe, que vous commitez. Elle reprend la commande de test écrite dans CLAUDE.md, par exemple `Bash(node --test)`, sans astérisque. Le diff, le démarrage, un envoi : la session redemande, et vous lisez.

Elle n'est pas « toutes les commandes ». `Bash(*)` ouvre le shell : installer, effacer, pousser, afficher un `.env`. Vous refusez cette allowlist même si la session semble pressée. `.claude/settings.local.json` reste sur votre machine et hors de Git. Une allowlist large « seulement chez moi » ouvre le même shell sur le dépôt de Léa.

```diagram
type: compare
title: "Ce que la session a le droit de faire"
columns:
  - title: "Commande nommée"
    tone: teal
    items:
      - "Bash(node --test), sans astérisque"
      - "Le diff et le démarrage redemandent"
      - "settings.json commité, le local dehors"
  - title: "Allowlist ouverte"
    tone: rose
    items:
      - "Bash(*), tout le shell"
      - "Push, effacement, install au passage"
      - "Lecture d'un .env ou d'une clé"
```

Le mode qui saute toutes les demandes (« faites tout sans me demander ») est la même porte, sous un autre nom. Pour Sève, vous gardez les questions. Une commande inattendue s'arrête. Vous la lisez. Vous la refusez si elle ne sert pas le lot en cours.

# Léa garde le prix, le plafond, l'heure

Trois décisions ne sont pas des variables d'implémentation. **45 €**, le prix du stage. **8 places**, le plafond d'inscription. **18 h la veille**, l'heure de la décision rappelée dans la confirmation. Léa les garde. L'agent les applique. Vous les surveillez.

Un agent qui propose 40 € « pour un test plus simple », 10 places « le temps de la démo », ou 20 h « parce que le fuseau embête le test » sort de son rôle. Vous répondez avec la règle, pas avec un compromis. Le CLAUDE.md peut citer ces trois valeurs pour qu'elles reviennent à chaque session. Les citer n'autorise pas l'agent à les négocier.

Le reste peut bouger dans une session : le nom d'une fonction, l'ordre des fichiers, la façon d'afficher le refus. Le prix, le plafond et l'heure ne bougent que si Léa le dit, par écrit, dans le dépôt. Une phrase dans le chat ne suffit pas. Demain, une autre session ne l'aura pas vue.

| Décision | Qui la tient | Ce que l'agent peut faire |
|---|---|---|
| 45 € | Léa | Afficher ce prix, le tester |
| 8 places | Léa | Refuser la 9e inscription |
| 18 h la veille | Léa | L'écrire dans la confirmation |
| Texte d'un bouton | Vous, dans le lot | Le proposer, vous le relisez |

# Le test ne plie pas la règle

L'agent n'assouplit pas la règle des 8 places pour faire passer un test. Si le test attend 8 inscrits et un refus pour le 9e, un échec se corrige dans le comportement. Si le test attend 9 inscrits, le test a tort. Vous le dites avant qu'il « répare » l'assertion dans le sens qui fait taire l'échec.

La même limite vaut pour l'attente et pour l'heure. Une 13e personne en attente n'est pas un cas à accepter pour terminer la suite. Une confirmation sans « 18 h » ni « la veille » n'est pas un test à assouplir en « le message n'est pas vide ». Vous gardez l'assertion qui porte la règle de Léa.

> [!IMPORTANT]
> « Fais passer le test » veut dire : le comportement rejoint la règle. Cela ne veut pas dire : la règle rejoint le test.

Vous pouvez l'écrire dans CLAUDE.md, en une phrase, à côté des chiffres : ne pas modifier 8, 12, 45 € ni 18 h pour obtenir un test vert. La phrase ne remplace pas votre lecture. Elle empêche la session de demain de traiter l'assouplissement comme une idée neuve.

# Ce qui reste permis

L'agent peut encore beaucoup. Lire le dépôt. Proposer un plan. Écrire le refus de la 9e place. Proposer la commande de démarrage. Lancer les tests que vous avez autorisés. Montrer le diff. Préparer un message de revue qui dit ce que Léa vérifie.

Il ne décide pas du tarif, du plafond, ni de l'heure. Il ne range pas une clé dans CLAUDE.md ni dans un fichier suivi. Il ne s'ouvre pas toutes les commandes. Quand une de ces limites est touchée, vous arrêtez la session sur ce point, vous le dites, vous faites retirer la ligne. Ensuite seulement, le travail reprend sur le lot.

La limite est le cadre qui rend le reste utile. Une session sans secret dans le dépôt, avec une allowlist courte et des chiffres tenus par Léa, peut aller jusqu'au commit. Une session qui a « juste » mis la clé dans CLAUDE.md pour gagner dix minutes a déjà trop donné.

# Exercices

## Exercice 1 : La clé utile

L'agent veut ajouter dans CLAUDE.md la clé du service de SMS, « seulement pour les tests », afin de vérifier le rappel des trois absents. Il propose aussi de committer le `.env` « pour que l'autre machine ait la même chose ». Que retirez-vous, et où va la clé ?

<details>
<summary>Voir la solution</summary>

Vous retirez la clé de CLAUDE.md et vous refusez le commit du `.env`. CLAUDE.md reste le rappel des règles : 45 €, 8 places, attente jusqu'à 12, décision avant 18 h la veille. Le `.env` reste local, ignoré par Git.

La clé, si un test d'intégration en a vraiment besoin, vit dans l'environnement de la machine ou du contrôle continu, injectée hors dépôt. Un `.env.example` peut nommer la variable sans valeur réelle. Si la clé a été écrite dans un fichier suivi, vous la révoquez. Les trois absents expliquent le besoin d'un rappel. Ils ne publient pas l'accès à l'opérateur.

</details>

## Exercice 2 : Toutes les commandes

Pour « aller plus vite » sur le refus de la 9e place, l'agent propose une allowlist qui autorise toutes les commandes du shell, et le mode qui ne demande plus rien. Les tests ne sont pas encore verts. Que conservez-vous comme permissions ?

<details>
<summary>Voir la solution</summary>

Vous conservez, dans `.claude/settings.json`, la commande exacte du test, par exemple `Bash(node --test)`, sans astérisque. Le diff et le démarrage continuent de s'arrêter sur une demande, que vous lisez. Vous refusez `Bash(*)` et le mode qui ne demande plus rien.

La vitesse ne change pas le risque : un shell ouvert peut pousser, effacer, ou lire un secret. Le test « la 9e place est refusée » se lance avec la commande nommée, pas avec un blanc-seing. Le fichier local ne sert pas à cacher une allowlist plus large.

</details>

## Exercice 3 : Huit qui gênent

Le test « la 9e place est refusée » échoue. L'agent écrit : « Je passe le plafond à 9 dans la règle et dans CLAUDE.md, comme ça le test et la démo sont verts. Léa pourra remettre 8 ensuite. » Quel chiffre reste, et que faites-vous du fichier ?

<details>
<summary>Voir la solution</summary>

Le chiffre reste 8. Léa garde le plafond. L'agent ne l'assouplit pas pour un test, ni « en attendant ». Vous refusez la modification de la règle et de CLAUDE.md.

Vous faites corriger le comportement pour que la 9e inscription soit refusée, puis vous relancez le test. Si l'agent a déjà écrit 9, vous faites revenir 8 avant tout commit. Une note « Léa pourra remettre 8 » ne compte pas : la session suivante lirait 9 comme si c'était la règle.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Secrets, permissions, limites
center: "Pas de clé dans CLAUDE.md, pas de .env commité, pas toutes les commandes. Léa garde 45 €, 8 places et 18 h."
points:
  - icon: key
    title: Hors de CLAUDE.md
    text: "Le fichier commité rappelle les règles de Sève. Une clé s'y copie dans le dépôt et dans la session."
  - icon: lock
    title: .env ignoré
    text: "Le secret reste local. L'exemple ne montre que des noms. Une clé commitée se révoque."
  - icon: shield
    title: Allowlist courte
    text: "Bash(node --test) si CLAUDE.md le nomme. Bash(*) ouvre le shell, même dans le fichier local."
  - icon: money
    title: Trois décisions
    text: "45 €, 8 places, 18 h la veille. Léa les tient. L'agent les applique, il ne les négocie pas."
  - icon: scale
    title: Le test plie
    text: "Un échec sur la 9e place corrige le comportement. Le plafond ne passe pas à 9 pour le vert."
pitfall: "Glisser une clé dans CLAUDE.md, committer le .env, ou passer à 9 places pour faire taire un test."
remember: "Règles dans le dépôt, secrets dehors, commandes nommées. 45 €, 8 places, 18 h restent à Léa."
```
