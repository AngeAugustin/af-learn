---
title: "Déployer et vérifier le parcours de Léa"
description: "Demander la commande de build déjà prévue, lire la sortie, puis ouvrir l'URL et refaire le parcours de Léa."
duration: 50
objectives:
  - "Demander à l'agent la commande de build que le dépôt prévoit déjà"
  - "Lire la sortie du terminal au lieu de s'arrêter au résumé du chat"
  - "Ouvrir l'URL et y vérifier 12 stages, 45 € et le refus de la 9e place"
  - "N'écrire à Léa que ce que vous avez vu vous-même sur cette adresse"
---

# L'URL que Léa peut ouvrir

La preuve de Sève n'est pas une commande qui se termine bien. La preuve, c'est Léa Vernet qui ouvre une adresse, voit les 12 stages du mois, voit 45 €, et ne peut pas prendre une 9e place.

Atelier Sève, Lyon Croix-Rousse. Léa, céramiste, tient 12 stages par mois, le samedi de 10 h à 13 h, 8 places, 45 €. La liste d'attente est plafonnée à 12. Elle tranche avant 18 h la veille. Le remplissage est de 70 %. 3 absents par mois, parce qu'un SMS de confirmation a été oublié. L'application s'appelle Sève.

Un résumé du chat qui dit « c'est déployé » ne change rien au samedi. Léa n'ouvre pas le chat. Elle ouvre l'URL. Tant que vous ne l'avez pas ouverte vous-même, vous n'avez rien à lui annoncer.

> [!IMPORTANT]
> Vous pouvez écrire à Léa seulement après avoir vu, sur l'URL, les 12 stages, 45 €, et le refus de la 9e place. Un build sans erreur est l'étape d'avant.

# Rester sur un hébergement déjà connu

Vous ne partez pas apprendre une nouvelle plateforme pour ce chapitre. Vous prenez l'aperçu partageable, ou l'hébergement simple que vous savez déjà lancer pour ce dépôt. Le geste compte : obtenir une URL, puis la vérifier. Le nom du service ne compte pas.

Vous demandez à l'agent quelle commande le projet prévoit déjà pour construire l'application et pour exposer cette adresse. La réponse doit citer un script du dépôt, pas une procédure inventée le jour même. S'il propose d'ouvrir un compte, de brancher un paiement ou de réécrire la page « pour que le déploiement passe », vous refusez. Le paiement n'est pas un incrément de Sève. Les 8 places et les 45 € le sont.

L'aperçu dans l'éditeur vous sert à relire l'écran pendant que vous travaillez. L'URL sert à Léa, chez elle ou à l'atelier. Les deux vérifications se font. L'aperçu seul ne permet pas de dire que le parcours est en ligne.

# Demander la commande, puis lire

Le message au chat reste court.

« Quelle commande de build ce dépôt prévoit-il déjà ? Ne la modifie pas. Je la lance dans le terminal et je lis la sortie. »

Vous la lancez vous-même, dans le terminal intégré, à la racine de Sève. Vous lisez jusqu'à la dernière ligne. Vous relevez trois choses : la commande s'est terminée, l'URL est connue (écrite dans la sortie, ou déjà notée), aucune ligne ne dit que la page part sans les données des stages.

« Build réussi », dans le chat, n'est pas cette lecture. Le résumé peut sauter un avertissement qui laisse la liste vide. Si la sortie échoue, vous la recopiez dans le fil et vous faites corriger la cause. Vous ne demandez pas de déployer quand même.

```diagram
type: flow
title: "De la commande au parcours de Léa"
steps:
  - title: "Commande"
    text: "Le script déjà prévu par le dépôt, demandé à l'agent"
    tone: blue
  - title: "Sortie"
    text: "Lue par vous, jusqu'au bout, erreurs comprises"
    tone: violet
  - title: "URL"
    text: "Ouverte dans le navigateur, pas décrite par le chat"
    tone: teal
  - title: "Parcours"
    text: "12 stages, 45 €, puis une 9e place refusée"
    tone: amber
```

# Compter sur la page

Vous collez l'adresse dans le navigateur. Vous comptez comme Léa comptera, sans le diff à côté.

Douze stages du mois, des samedis de 10 h à 13 h, pas une liste « à venir » sans date. Le prix affiché est 45 €, pas 40, pas un libellé « tarif ». Chaque stage montre 8 places et les places restantes. Si l'un de ces points manque, l'URL n'est pas livrée, même si le terminal s'est tut.

Vous notez l'écart avant de retourner au chat : quel stage manque, quel prix s'affiche, si les places restantes sont lisibles. Cette note tient en quatre cases, pas en un récit.

- Le nombre de stages vus, et s'ils tombent un samedi de 10 h à 13 h.
- Le prix lu sur la page, qui doit être 45 €.
- Les places affichées : 8, et les places restantes.
- L'adresse exacte, pour ne pas revérifier une ancienne URL.

Le remplissage de 70 % ne se devine pas. Il se lit stage par stage, une fois la page vraiment ouverte. Une case vide dans cette note est une case à corriger avant d'écrire à Léa.

Une page blanche, une erreur d'ouverture, une ancienne version : vous revenez à la sortie, puis au diff. Vous ne demandez pas à l'agent si « en principe » la page est la bonne. Il ne voit pas l'écran que Léa verra.

# Refuser la 9e place sur l'URL

Le test dans le dépôt peut déjà dire que la 9e place est refusée. Cela protège le code. Cela ne protège pas l'adresse en ligne. Vous refaites le geste sur l'URL : huit demandes acceptées, la neuvième refusée par une phrase lisible. Pas une erreur brute. Pas une neuvième inscription « exceptionnelle ».

Les deux contrôles peuvent diverger. Le test passe sur votre copie, et l'URL accepte encore la 9e place parce que vous avez publié un état plus ancien. C'est le cas que ce chapitre traque. Vous ne déclarez pas le parcours vérifié tant que l'adresse, elle, refuse.

Si la 9e place passe, vous corrigez, vous relancez la même commande, vous relisez la sortie, vous rouvrez l'URL. Vous ne changez pas le plafond de 8 pour que la page « ait l'air de marcher ».

# Le message après la vérification

Vous écrivez à Léa ce que vous avez vu, avec l'adresse.

« Voici l'URL. J'y ai vu les 12 stages du mois, à 45 €. Quand 8 places sont prises, la 9e est refusée. »

La liste d'attente jusqu'à 12 et la règle « Léa tranche avant 18 h » n'entrent dans ce message que si vous les avez exercées sur cette même URL. Les 3 absents du mois viennent d'une confirmation oubliée : ce n'est pas ce que vous venez de prouver, sauf à l'avoir ouvert et constaté. Vous notez l'adresse et la phrase à côté du commit publié. Demain, le dépôt dira ce qui était vraiment en ligne.

# Exercices

## Exercice 1 : Le build est vert

L'agent écrit : « Build terminé sans erreur, c'est en ligne, tu peux prévenir Léa. » Vous n'avez pas ouvert d'adresse. Que faites-vous avant tout message à Léa ?

<details>
<summary>Voir la solution</summary>

Vous ne prévenez pas Léa. Vous demandez la commande de build déjà prévue par le dépôt si vous ne l'avez pas sous les yeux, vous la lancez, vous lisez la sortie jusqu'au bout.

Ensuite vous ouvrez l'URL vous-même. Vous comptez 12 stages, vous lisez 45 €, vous tentez une 9e place alors que 8 sont prises. Le message à Léa ne part que si ces trois faits sont vrais sur l'adresse. « Sans erreur » décrit le terminal, pas le samedi de la Croix-Rousse.

</details>

## Exercice 2 : Une URL presque bonne

L'adresse s'ouvre. Vous voyez 12 samedis, de 10 h à 13 h, mais le prix affiché est 40 €. La 9e place est bien refusée. L'agent dit que 40 € est « plus simple pour l'exemple ». Que répondez-vous à Léa, et que faites-vous du prix ?

<details>
<summary>Voir la solution</summary>

Vous ne lui dites pas que le parcours est bon. Le prix de l'atelier est 45 €. Un refus correct de la 9e place ne compense pas un prix faux : Léa encaisserait, ou croirait encaisser, le mauvais montant.

Vous refusez de garder 40 €. Vous faites corriger l'affichage, vous relancez la commande, vous relisez la sortie, vous rouvrez l'URL. Le message part quand les 12 stages, 45 € et le refus de la 9e place sont vrais ensemble.

</details>

## Exercice 3 : Le test passe, la page non

Le test « la 9e place est refusée » est vert sur votre machine. Sur l'URL, une neuvième inscription est acceptée. L'agent propose de marquer la vérification comme faite, puisque le test passe. Que décidez-vous ?

<details>
<summary>Voir la solution</summary>

La vérification n'est pas faite. Le test protège la copie que vous venez de lancer. L'URL montre autre chose, souvent un état plus ancien. Léa, elle, ouvrira l'URL.

Vous ne changez pas le plafond de 8 et vous n'ignorez pas le test. Vous alignez ce qui est publié sur le refus, vous relancez la commande prévue, vous lisez la sortie, vous retentez la 9e place sur l'adresse. Léa n'est prévenue qu'après ce refus-là.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: L'URL de Léa
center: "Léa ouvre l'adresse, voit 12 stages et 45 €, et ne peut pas prendre la 9e place."
points:
  - icon: terminal
    title: La commande
    text: "Vous demandez le script déjà prévu, vous le lancez, vous lisez la sortie."
  - icon: cloud
    title: Une URL simple
    text: "Aperçu ou hébergement déjà connu. Pas une nouvelle plateforme à apprendre."
  - icon: eye
    title: Vos yeux
    text: "Vous ouvrez l'adresse. Le résumé du chat ne compte pas les stages à votre place."
  - icon: users
    title: Le samedi
    text: "12 stages, 8 places, 45 €. La 9e demande est refusée sur cette URL."
  - icon: chat
    title: Le message
    text: "Léa ne reçoit que ce que vous avez constaté. L'attente et 18 h si vous les avez ouverts."
pitfall: "Prévenir Léa parce que le build s'est terminé sans erreur, sans ouvrir l'adresse."
remember: "Commande lue, URL ouverte, 12 stages, 45 €, 9e place refusée. Ensuite seulement, vous écrivez."
```
