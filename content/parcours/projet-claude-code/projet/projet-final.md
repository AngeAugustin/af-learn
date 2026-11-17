---
title: "Projet final : Sève réservable avec Claude Code"
description: "Enchaîner les quatre incréments d'App Sève dans le terminal, avec le même rituel, et remettre à Léa une note de livraison qu'elle peut vérifier."
duration: 90
objectives:
  - "Livrer les quatre incréments dans l'ordre, chacun avec son plan et son test"
  - "Tenir le rituel : plan, permissions, test, diff, contrôle à l'écran"
  - "Écrire ce qui est vérifiable, et ce qui reste hors périmètre"
  - "Laisser de quoi reprendre la session demain sans réinventer l'atelier"
---

# Quatre incréments, un rituel

Le projet final rend App Sève réservable pour l'Atelier Sève, à Lyon Croix-Rousse. Léa Vernet doit pouvoir suivre le samedi de 10 h à 13 h sans qu'une neuvième personne prenne une chaise, sans une attente qui n'en finit pas, et avec une confirmation qui rappelle l'heure. Vous ne livrez pas cela en une passe. Vous enchaînez quatre incréments. Chacun revient au même rituel dans le terminal.

Les faits ne bougent plus. Douze stages par mois. Remplissage autour de 70 %. Environ trois absents par mois, parce que le SMS a été oublié. Huit places. 45 €. Attente ordonnée, arrêt à 12. Décision avant 18 h la veille. Ces chiffres sont dans le brief et dans CLAUDE.md. Une session qui les « ajuste » pour finir plus vite sort du projet.

L'ordre est celui du cadrage.

1. La liste des stages, avec le samedi 10 h-13 h, Croix-Rousse, et 45 €.
2. Le refus : la 9e place est refusée.
3. L'attente ordonnée, qui s'arrête à 12.
4. La confirmation : avant 18 h la veille la place tient, après elle passe à la première personne de l'attente, et une confirmation tardive ne la reprend pas.

```diagram
type: flow
title: "Le rituel, à chaque incrément"
loop: "Incrément suivant"
steps:
  - title: "Plan"
    text: "Mode plan, un seul incrément"
    tone: blue
  - title: "Permissions"
    text: "Lues, courtes, sans secret"
    tone: violet
  - title: "Test"
    text: "La règle du lot, vue dans la session"
    tone: teal
  - title: "Diff"
    text: "Relu, borné à ce lot"
    tone: amber
  - title: "Écran"
    text: "Vous ouvrez la page et vous dites le contrôle"
    tone: rose
```

# Le rituel, à chaque fois

**Plan.** Vous entrez en mode plan avec `/plan` ou Shift+Tab. L'agent lit `docs/brief.md` et propose ce qu'il va toucher. Vous vérifiez que ce n'est que l'incrément en cours, sur sa branche (`seve/liste`, `seve/refus-9e-place`, `seve/attente`, `seve/confirmation-18h`). Un plan qui anticipe les suivants se renvoie, même si l'idée est juste. Vous acceptez, et les écritures s'ouvrent pour ce lot-là.

**Permissions.** Vous les lisez avant les commandes. Tests, diff, état Git, commande de démarrage que vous connaissez. Pas toutes les commandes. Pas de clé dans la commande. Pas de `.env` versé dans le commit. Si une demande sort de cette liste, vous la refusez à voix haute dans la session.

**Test.** Chaque incrément a son test nommé, lancé dans la session, sous vos yeux. Liste : « 12 stages à 45 € ». Refus : « la 9e place est refusée ». Attente : « la 13e personne en attente est refusée ». Confirmation : « la décision après 18 h la veille est refusée ». Un test commenté, ou une assertion assouplie, n'est pas un vert.

**Diff.** Vous le relisez. Il ne contient que le lot, pas le travail des incréments futurs, pas un secret, pas un plafond passé de 8 à 9. Le message de commit dit la règle tenue.

**Contrôle écran.** L'agent peut proposer la commande de démarrage. C'est vous qui ouvrez la page. Vous dites le contrôle de cet incrément en montrant l'écran. Puis vous passez au suivant. Pas avant.

> [!IMPORTANT]
> Un incrément dont le test est vert et dont vous n'avez pas ouvert la page n'est pas livré. Le rituel compte cinq temps, pas quatre.

# La liste, puis le refus

L'incrément 1 est fini quand vous voyez les stages. Douze dans le mois, ou une vue qui permet de les reconnaître. Le samedi 10 h-13 h et Lyon Croix-Rousse sont écrits. Le prix est 45 €. Le test correspondant est vert dans la session. Le diff ne refuse pas encore la 9e place : ce serait de l'avance. Vous commettez la liste seule.

L'incrément 2 reprend le rituel. Le plan ne parle que du plafond. Le test s'appelle par la règle : la 9e place est refusée. Huit inscriptions tiennent. La suivante non, et elle n'est pas enregistrée. Vous ouvrez la page, vous jouez la neuvième personne, vous dites le refus. Le remplissage à 70 % ne vous fait pas accepter une chaise de plus « pour coller à la moyenne ». La moyenne n'est pas le plafond.

Vous ne mélangez pas les commits. Une liste et un refus dans le même diff empêchent de savoir lequel a cassé l'écran. Deux messages, deux relectures.

# L'attente, puis les dix-huit heures

L'incrément 3 commence quand 8 places sont prises. La personne suivante entre en attente, à sa place dans l'ordre. La 12e est acceptée en attente. La 13e est refusée. Si une place se libère, la première de la file est servie, pas la dernière. Le test fixe l'ordre et l'arrêt. Le diff ne réécrit pas le prix et ne change pas l'heure.

L'incrément 4 ajoute la confirmation. Le texte rappelle la décision **avant 18 h la veille**. Avant cette heure, la place tient. Après, elle passe à la première personne de l'attente. Une confirmation arrivée après 18 h ne la reprend pas. Le test nommé est « la décision après 18 h la veille est refusée ». Vous ne testez pas un envoi réel : l'opérateur, la clé, le téléphone de Léa restent dehors. Les trois absents du mois disent pourquoi le rappel existe. Ils ne vous font pas committer un secret pour « prouver le SMS ».

| Incrément | Test que vous voyez | Contrôle dit devant l'écran |
|---|---|---|
| 1. Liste | Samedi, Croix-Rousse, 45 € | « Je vois le stage et le prix » |
| 2. Refus | La 9e place est refusée | « Huit tiennent, la suivante non » |
| 3. Attente | Ordre tenu, arrêt à 12 | « Douze, pas treize, la première d'abord » |
| 4. Confirmation | La décision après 18 h la veille est refusée | « L'heure est écrite, la place libérée part en tête de file » |

# La note que Léa peut lire

Les exercices de ce chapitre **sont** la note de livraison. Vous ne la dictez pas à l'agent pour qu'il la rende flatteuse. Vous la rédigez après les quatre rituels, avec ce que vous avez vu. Elle tient sur une page. Léa doit pouvoir la lire sans ouvrir le terminal.

Trois blocs, pas un récit.

**Ce qui est vérifiable.** Pour chaque incrément : le test nommé, le fait qu'il était vert dans la session, et la phrase que vous avez dite devant l'écran. Si vous n'avez pas ouvert la page, vous n'écrivez pas « vérifié à l'écran ». Vous écrivez « test vert, écran non ouvert ».

**Ce qui reste hors périmètre.** Le paiement. L'envoi réel de SMS. Un autre jour que le samedi, un autre lieu, un autre prix. Une attente au-delà de 12. Une 9e place « exceptionnelle ». Le changement de l'heure de 18 h. Le prévoir évite qu'une session suivante le prenne pour un oubli à combler.

**Comment reprendre demain.** Une session neuve, pas le transcript d'hier. Trois lignes en tête de CLAUDE.md, qui remplacent celles de la veille : incrément en cours, dernier test, ce qu'il ne faut pas refaire (pas de paiement, pas de 9e place). La branche, la commande de tests, la commande de démarrage. Les chiffres restent dans `docs/brief.md`. Vous ne les recollez pas.

```diagram
type: layers
title: "La note de livraison pour Léa"
layers:
  - title: "Vérifiable"
    text: "Test nommé, vert vu, phrase dite devant la page"
  - title: "Hors périmètre"
    text: "Paiement, SMS réel, autre tarif, autre plafond, autre heure"
  - title: "Reprise"
    text: "Branche, dernier incrément, commandes, chiffres tenus par Léa"
```

# Tenir les limites jusqu'au bout

Le projet final est l'endroit où l'on « finit » et où l'on est tenté d'assouplir. Le test de la 13e personne échoue : vous ne montez pas l'attente à 15. Le message de confirmation oublie la veille : vous ne changez pas l'assertion en « le texte n'est pas vide ». Le contrôle continu, s'il est en place, relance les mêmes tests. Vous ne le faites pas passer en retirant le refus.

Le cadre reste la session Claude Code : mode plan, permissions, test, diff. La page s'ouvre dans votre navigateur. L'agent propose la commande. Vous décidez, vous lisez, vous ouvrez.

Quand les quatre incréments ont leur commit, leur test et leur contrôle écran, vous posez la note dans le dépôt, à côté du brief. La session du lendemain commence par la lire. Si elle contredit l'écran, c'est la note que vous corrigez, ou l'écran, pas les chiffres de Léa.

# Exercices

## Exercice 1 : Ce qui est vérifiable

Vous avez terminé les quatre incréments. Pour la liste et le refus, vous avez le test vert et vous avez ouvert la page. Pour l'attente, le test « arrêt à 12 » est vert, vous n'avez pas ouvert la page. Pour la confirmation, le message à l'écran dit « rappel à venir », le test qui cherche « 18 h » et « la veille » est rouge, et l'agent l'a commenté « pour livrer ». Rédigez le bloc « vérifiable » de la note pour Léa.

<details>
<summary>Voir la solution</summary>

Liste : test vert dans la session, écran ouvert, samedi 10 h-13 h, Croix-Rousse, 45 € vus. Refus : test « la 9e place est refusée » vert, écran ouvert, la neuvième personne ne prend pas de place.

Attente : test vert, écran non ouvert. Vous ne cochez pas le contrôle visuel. Vous notez qu'il reste à dire devant la page : douze en attente, la treizième refusée, ordre d'arrivée.

Confirmation : non vérifiable. Le test a été commenté, donc il n'y a pas de vert. L'écran ne rappelle ni 18 h ni la veille. Vous écrivez que l'incrément 4 n'est pas livré, et vous faites rétablir le test avant toute autre phrase rassurante.

</details>

## Exercice 2 : Ce qui reste hors périmètre

Léa demande dans le même message : « Tant que vous y êtes, encaissez les 45 € en ligne, envoyez le vrai SMS, et ouvrez un stage le dimanche si le samedi est plein. » Les quatre incréments tiennent. Que mettez-vous dans le bloc hors périmètre, sans rouvrir les chiffres ?

<details>
<summary>Voir la solution</summary>

Vous écrivez que le paiement en ligne, l'envoi réel de SMS et un stage le dimanche sont hors de cette livraison. Les 45 € restent le prix affiché, pas un encaissement. Le rappel des 18 h est un texte de confirmation, pas une clé d'opérateur dans le dépôt. Le dimanche n'est pas un débordement du samedi plein : la 9e place reste refusée, l'attente s'arrête à 12.

Vous ne changez pas 8, 12 ni 18 h pour absorber la demande. Vous les rappelez dans la note comme tenus par Léa. Une suite éventuelle sera un autre cadrage, pas une ligne ajoutée au diff du samedi.

</details>

## Exercice 3 : Reprendre demain

Il est 19 h. Les branches `seve/liste`, `seve/refus-9e-place` et `seve/attente` sont commitées. Sur `seve/confirmation-18h`, le test « la décision après 18 h la veille est refusée » est rouge, non commenté, et il n'y a pas de commit. La commande de tests est celle du dépôt. Écrivez le bloc « reprendre demain ».

<details>
<summary>Voir la solution</summary>

Vous ouvrez une session neuve, sans coller le transcript. En tête de CLAUDE.md, trois lignes qui remplacent celles d'hier : incrément en cours, 4, confirmation. Dernier test : « la décision après 18 h la veille est refusée », rouge. Ne pas refaire : pas de paiement, pas de test commenté. Branche : `seve/confirmation-18h`.

Les chiffres restent dans `docs/brief.md` : 45 €, 8 places, attente max 12, décision avant 18 h la veille. Vous ne les recollez pas. La première action est `/plan` sur cet incrément seulement, les permissions relues, le test rétabli s'il a été touché, le diff relu, puis la page ouverte par vous.

Vous ne demandez pas à la session de demain de « finir Sève » en bloc. Le rituel reprend au lot rouge.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Sève réservable
center: "Quatre incréments, cinq temps : plan, permissions, test, diff, écran. La note dit le vérifiable, le hors périmètre, la reprise."
points:
  - icon: list
    title: Quatre lots
    text: "Liste à 45 €, refus de la 9e, attente jusqu'à 12, confirmation qui rappelle 18 h la veille."
  - icon: loop
    title: Même rituel
    text: "Mode plan borné, permissions lues, test vu, diff relu, page ouverte par vous."
  - icon: eye
    title: L'écran
    text: "L'agent propose la commande. Le contrôle se dit devant App Sève, pas dans le chat."
  - icon: file
    title: Note pour Léa
    text: "Ce qui est vérifiable, ce qui reste dehors, comment reprendre la branche demain."
  - icon: lock
    title: Chiffres tenus
    text: "45 €, 8 places, 12 en attente, 18 h. Un test rouge ne les déplace pas."
  - icon: rocket
    title: Reprise
    text: "Branche, dernier commit, commandes, incrément ouvert. Le brief reste dans le dépôt."
pitfall: "Livrer les quatre d'un coup, commenter le test des 18 h, ou écrire « vérifié » sans avoir ouvert la page."
remember: "Un rituel par incrément. La note de Léa sépare le vu, le hors périmètre, et la session de demain."
```
