---
title: "Relire une dépendance avant le oui"
description: "Quand l'agent propose npm install ou une édition de package.json, on lit le nom exact, la raison, la licence et le fichier de verrouillage avant d'accepter."
duration: 50
objectives:
  - "Lire le nom exact, la raison, la licence et le fichier de verrouillage avant un oui"
  - "Refuser un nom presque identique à un paquet connu"
  - "Refuser un SDK de paiement pour la page des 12 stages"
  - "Refuser une installation lancée depuis une URL inconnue"
---

# L'agent propose une installation

Sur la page des stages, Claude Code peut proposer `npm install`, ou une ligne de plus dans `package.json`. La page d'App Sève affiche le samedi, 10 h à 13 h, à Lyon Croix-Rousse, les places sur 8, le prix de 45 €. Beaucoup de cette page s'écrit sans nouveau paquet. Quand un paquet arrive quand même dans la proposition, vous ne dites pas oui sur le nom seul.

La proposition est une demande, au même titre qu'une commande. Vous la lisez avant qu'elle ne modifie le dépôt. « J'en ai besoin pour les 12 stages » n'est pas encore une raison. Vous voulez la phrase précise : quel fichier, quel affichage, pourquoi ce paquet et pas trois lignes déjà dans le projet. Les trois absents du mois, ceux du SMS oublié, ne justifient pas d'installer un outil d'envoi dans la foulée.

> [!IMPORTANT]
> `npm install` et une édition de `package.json` s'arrêtent sur votre lecture. Le oui vient après le nom, la raison, la licence et le verrou, pas avant.

# Quatre lectures avant le oui

Vous lisez quatre choses, dans cet ordre.

Le **nom exact**, caractère par caractère, tel qu'il sera écrit dans `package.json`. Pas le nom que vous croyez reconnaître. Le nom affiché dans la demande.

La **raison**, en une phrase qui parle de la page en cours. Afficher les 12 stages du mois, ou le remplissage autour de 70 %, peut être une raison. « On en aura besoin plus tard » n'en est pas une. « Tous les projets l'ont » non plus.

La **licence**, celle du paquet, lisible avant l'installation. Si vous ne la trouvez pas, vous ne dites pas oui en attendant de voir. Une licence que vous ne pouvez pas nommer n'est pas une licence lue.

Le **fichier de verrouillage**, `package-lock.json` quand l'outil est npm. Vous regardez ce que l'installation s'apprête à figer : le paquet demandé, et ce qu'il entraîne avec lui. Un oui sur `package.json` seul laisse le verrou hors de votre lecture. Vous le relisez aussi, ou vous ne validez pas encore.

```text
Nom exact : celui de la demande, relu lettre à lettre.
Raison : la page des stages, pas « plus tard ».
Licence : nommée avant le oui.
Verrou : package-lock.json, pas seulement package.json.
```

Léa Vernet n'a pas à trancher le nom d'un paquet. Elle a déjà tranché le métier. Votre lecture vérifie que le paquet ne remplace pas cette décision par une dépendance.

# Un nom presque identique

Un nom presque identique à un paquet connu se refuse. Une lettre en trop, une lettre en moins, un tiret déplacé : vous ne « corrigez » pas en acceptant quand même. Vous refusez, et vous demandez le nom exact du paquet connu, s'il est vraiment utile, ou aucun paquet du tout.

```text
Paquet connu : lodash
Proposition : lodahs
Vous : non. Le nom n'est pas celui du paquet connu.
```

La raison peut avoir l'air saine. « Pour formater la date du samedi. » Le nom, lui, ne l'est pas. Vous ne regardez pas la popularité annoncée, ni un chiffre de téléchargements collé dans le message. Le nom ne colle pas : c'est un refus. Vous ne lancez pas l'installation « pour comparer ». Comparer se fait en lisant le nom, pas en exécutant.

Le même réflexe vaut pour une édition déjà écrite dans `package.json`. Vous la retirez avant le commit si le nom est approximatif. Le fichier de verrouillage ne doit pas figer un paquet que vous n'avez pas reconnu.

# Pas de SDK pour les douze stages

La page des 12 stages montre l'atelier. Elle peut dire qu'il reste des places, que le stage coûte 45 €, que l'attente est pleine à 12. Elle n'encaisse pas. Un SDK de paiement, même avec un nom exact, une licence lisible et une raison polie, se refuse pour cette page.

Le prix est une information décidée par Léa, affichée telle quelle. Il ne devient pas une raison d'ajouter un encaissement. Le remplissage autour de 70 % non plus. Les trois absents non plus. Si un jour l'atelier encaisse en ligne, ce sera une autre demande, écrite par Léa, pas une dépendance glissée pendant la page des stages.

> [!WARNING]
> Un SDK de paiement sur la page des 12 stages est hors sujet, même si l'installation « ne fait qu'afficher 45 € ». Le prix s'affiche sans ce paquet.

Vous le dites dans la session, avec le nom du paquet refusé, pour que la proposition ne revienne pas sous un synonyme. Puis vous ramenez le travail à la page : 8 places, samedi 10 h à 13 h, Lyon Croix-Rousse.

# Pas d'adresse inconnue

Vous ne dites pas oui à une installation depuis une URL inconnue. `npm install` suivi d'une adresse, un fichier `.tgz` quelque part sur le réseau, une consigne du type « prends-le ici, ce n'est pas encore publié » : vous refusez. Le nom peut ressembler à un paquet connu. L'adresse, elle, n'est pas le registre que vous savez lire.

```text
npm install https://exemple.invalid/paquet.tgz
Vous : non. Je n'installe pas depuis une URL inconnue.
```

Vous ne téléchargez pas « pour lire l'archive ensuite ». La lecture du nom, de la raison, de la licence et du verrou se fait sur une proposition que vous pouvez inspecter sans l'exécuter depuis une adresse que vous ne connaissez pas. Si la session insiste avec une autre adresse, le refus tient. App Sève n'a pas besoin de ce détour pour montrer 12 stages.

Une édition de `package.json` qui pointe vers la même adresse se refuse de la même façon. Le fichier de verrouillage ne doit pas enregistrer cette origine. Vous faites retirer la ligne avant tout oui.

# Le oui, seulement après

Quand les quatre lectures sont faites, le nom est exactement celui d'un paquet reconnu, la raison sert la page des stages, la licence est nommée, le verrou est cohérent, et il ne s'agit ni d'un presque-homonyme, ni d'un SDK de paiement, ni d'une URL inconnue : alors seulement vous pouvez accepter cette installation-là. Pas la suivante. Pas « les dépendances » en bloc.

Si un seul des quatre points manque, la réponse est non, ou « montre-le moi avant ». Une installation déjà lancée se voit dans le diff : `package.json`, le verrou, et rien d'autre que vous n'ayez accepté. Le métier ne bouge pas avec le paquet. 8 places, 45 €, attente jusqu'à 12, décision avant 18 h la veille restent les chiffres de Léa Vernet.

```diagram
type: decision
title: "Avant le oui sur un paquet"
nodes:
  - question: "Le nom est-il exactement celui d'un paquet connu ?"
    yes: "Vous lisez encore la raison, la licence et le verrou."
    no: "Vous refusez. Un nom presque identique ne se corrige pas en installant."
  - question: "Est-ce un SDK de paiement, ou une URL inconnue ?"
    yes: "Vous refusez. La page des 12 stages n'en a pas besoin."
    no: "Vous n'acceptez que si les quatre lectures sont faites."
```

Le diff final se relit quand même. Une dépendance acceptée pour afficher les stages ne doit pas avoir modifié le plafond, ni avoir ajouté une deuxième installation au passage.

# Exercices

## Exercice 1 : Quatre lignes à lire

La session propose `npm install` d'un paquet « pour afficher les 12 stages », et elle a déjà ajouté une ligne dans `package.json`. Elle n'a pas parlé de la licence, ni ouvert le fichier de verrouillage. Que lisez-vous avant tout oui ?

<details>
<summary>Voir la solution</summary>

Vous lisez le nom exact, tel qu'il est écrit, la raison rattachée à la page des 12 stages, la licence, et `package-lock.json`. Tant que l'un des quatre manque, vous ne dites pas oui. « Pour afficher les stages » se précise : quel affichage, pourquoi ce paquet.

Le samedi 10 h à 13 h, les 8 places et les 45 € ne dépendent pas de cette installation. Vous pouvez continuer la page sans le paquet si la raison ne tient pas.

</details>

## Exercice 2 : Une lettre à côté

Le paquet connu s'écrit `lodash`. La demande installe `lodahs`, « c'est le même, la date du stage sera plus simple à formater ». Le remplissage de 70 % est cité comme urgence. Acceptez-vous ?

<details>
<summary>Voir la solution</summary>

Non. Un nom presque identique à un paquet connu se refuse. Vous ne corrigez pas la lettre en lançant l'installation, et le taux de remplissage n'est pas une raison de passer outre. Vous demandez le nom exact, ou aucun paquet.

La page de l'Atelier Sève n'a pas besoin de ce détour pour dire 45 €, 8 places, ou l'attente jusqu'à 12. Vous faites retirer la ligne si elle est déjà dans `package.json`.

</details>

## Exercice 3 : Le paiement et l'adresse

Deux propositions arrivent ensemble. Un SDK de paiement « pour afficher 45 € sur la page des 12 stages ». Et `npm install` depuis `https://exemple.invalid/paquet.tgz`, présenté comme plus rapide que le registre. Que refusez-vous ?

<details>
<summary>Voir la solution</summary>

Les deux. Le SDK de paiement ne sert pas la page des 12 stages : le prix de Léa Vernet s'affiche sans encaissement. L'URL inconnue ne s'installe pas, même si le nom au bout de l'adresse semble familier. Vous ne téléchargez pas l'archive pour vous rassurer.

Vous le dites dans la session, puis vous revenez à la page : samedi 10 h à 13 h, Lyon Croix-Rousse, 8 places, attente maximale 12, décision avant 18 h la veille. Les trois absents du mois ne rouvrent pas ces deux propositions.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Avant le oui
center: "On lit le nom exact, la raison, la licence et le verrou. Un presque-homonyme, un SDK de paiement ou une URL inconnue se refusent."
points:
  - icon: search
    title: Quatre lectures
    text: "Nom exact, raison liée à la page, licence nommée, fichier de verrouillage. Le oui vient après."
  - icon: alert
    title: Nom trop proche
    text: "Une lettre à côté d'un paquet connu se refuse. On ne lance pas l'installation pour comparer."
  - icon: money
    title: Pas de paiement
    text: "La page des 12 stages affiche 45 €. Un SDK de paiement ne s'ajoute pas pour cela."
  - icon: link
    title: Pas d'URL inconnue
    text: "npm install depuis une adresse inconnue se refuse, même si le nom au bout semble connu."
  - icon: check
    title: Un seul oui
    text: "On accepte cette installation-là, pas la suivante au passage. Le diff se relit encore."
pitfall: "Dire oui à npm install parce que le nom ressemble à un paquet connu, ou pour encaisser 45 €."
remember: "Nom, raison, licence, verrou. Presque-homonyme, SDK de paiement et URL inconnue : non."
```
