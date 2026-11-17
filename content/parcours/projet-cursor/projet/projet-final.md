---
title: "Projet final : Sève réservable avec Cursor"
description: "Mener les quatre incréments de Sève avec le rituel Cursor et remettre à Léa ce qui est en ligne, le hors-cadre et la reprise."
duration: 90
objectives:
  - "Mener chaque incrément avec un plan, un contexte court, un diff relu et un test lu"
  - "Vérifier à l'écran la preuve de l'incrément avant d'écrire la phrase de commit"
  - "Tenir 8 places, 45 €, l'attente jusqu'à 12 et la décision de 18 h sans les déplacer"
  - "Rédiger le dossier de Léa : en ligne, hors périmètre, et comment reprendre demain"
---

# Le même rituel, quatre fois

Vous menez Sève du premier écran jusqu'à la confirmation. Pas d'un seul fil. Quatre incréments, quatre fois le même rituel dans Cursor. Le projet final est ce rituel tenu jusqu'au bout, plus le dossier que Léa peut lire sans ouvrir l'éditeur.

Atelier Sève, Lyon Croix-Rousse. Léa Vernet, céramiste. 12 stages par mois, le samedi de 10 h à 13 h, 8 places, 45 €. Attente ordonnée, maximum 12. Léa tranche avant 18 h la veille. Remplissage 70 %. 3 absents par mois, parce qu'un SMS de confirmation est oublié. L'application s'appelle Sève. Le paiement, l'envoi par un fournisseur de SMS, les autres jours et les autres ateliers restent hors cadre.

Le rituel, à chaque incrément :

1. **Plan.** Vous le corrigez avant les fichiers. Il nomme la preuve et ce qui est exclu.
2. **Contexte court.** Un fil dédié. La règle, les fichiers de cet incrément, la phrase de preuve. Pas l'historique des trois autres.
3. **Diff relu.** Vous acceptez seulement ce que le plan annonçait.
4. **Test lancé.** Vous lisez la ligne qui porte la preuve, dans le terminal.
5. **Écran.** Aperçu ou URL : vous refaites le geste de Léa.
6. **Commit.** Une phrase qui dit le résultat métier.

Si une étape saute, l'incrément n'est pas livré. Vous ne rattrapez pas au commit suivant.

```diagram
type: flow
title: "Le rituel d'un incrément"
loop: "On recommence à l'étape qui a dérivé, pas au résumé du chat"
steps:
  - title: "Plan"
    text: "Preuve nommée, exclusions écrites"
    tone: blue
  - title: "Contexte"
    text: "Fil court, règle, fichiers de l'incrément"
    tone: violet
  - title: "Diff et test"
    text: "Relu, puis lancé et lu par vous"
    tone: teal
  - title: "Écran"
    text: "La preuve se voit, puis la phrase de commit"
    tone: amber
```

# Les quatre preuves

Vous les tenez dans l'ordre. Chacune a sa branche ou, au minimum, son commit isolé. Mélanger deux preuves dans un diff vous empêche de revenir au dernier état sain.

1. **Liste.** La page montre les 12 stages du mois, la date, 8 places, 45 €, les places restantes. Pas de formulaire dans ce commit.
2. **Huit places.** Le formulaire accepte huit demandes et refuse la 9e. Le test dit la même chose. Phrase possible : « Refuse la 9e place quand un stage a déjà 8 réservations. »
3. **Attente.** Au-delà de 8, les demandes entrent dans l'ordre, jusqu'à 12. La 13e est refusée. Les 8 places assises ne deviennent pas 20. Le test de l'incrément 2 évolue exprès : la 9e demande n'est plus un refus sec, elle est la première de l'attente. Vous changez le test parce que l'incrément le dit, pas pour éteindre un échec.
4. **Confirmation.** L'écran montre qui est inscrit et si Léa a tranché. La borne est 18 h la veille, pas une autre heure. Un stage non tranché se voit. Vous ne collez pas de clé d'envoi de SMS pour « finir » cet incrément.

Le passage de 2 à 3 est le point délicat. Vous ne dites pas « ignore l'ancien test ». Vous le remplacez par la nouvelle preuve, dans le commit de l'attente, avec une phrase qui le dit.

# Un contexte court à chaque fois

Le fil de la liste ne sert pas à coder l'attente. Vous en ouvrez un autre. Vous y mettez la règle (8, 45 €, 12, 18 h, pas de secret, pas de test ignoré) et les fichiers que cet incrément a le droit de toucher. Vous y mettez la preuve en une phrase.

Vous n'y mettez pas le contenu d'un `.env`, ni un jeton « pour aller plus vite », ni le récit du four. Si l'agent propose de changer un chiffre pour faire passer le test, vous refusez. Ces chiffres sont à Léa. L'agent propose une formulation, un découpage, un nom de test. Vous décidez après le diff.

Un fil qui dépasse le sujet se ferme. Vous n'essayez pas de le « recentrer » avec un cinquième rappel. Un fil neuf, la même phrase de preuve, coûte moins cher qu'un diff qui réécrit Sève.

> [!WARNING]
> Le jour où le test de 18 h échoue, la consigne n'est pas « ignore les tests » et l'heure ne passe pas à 20 h. Vous lisez l'échec et vous corrigez le code.

# L'écran, puis le dossier

L'écran se vérifie comme Léa le verra. Liste : vous comptez 12 samedis. Réservation : vous prenez 8 places et vous tentez la 9e. Attente : vous regardez l'ordre et vous tentez la 13e. Confirmation : vous lisez 18 h la veille et l'état tranché ou non. L'aperçu suffit pendant le travail. Ce que vous annoncez « en ligne » a été ouvert sur l'URL, après la commande de build du dépôt, sortie lue par vous.

Le dossier de livraison tient sur une page, dans le dépôt, à destination de Léa. Trois blocs.

- **En ligne.** L'URL. Seulement ce que vous avez vu sur cette adresse : par exemple les 12 stages, 45 €, le refus ou l'attente si vous l'avez exercée. Le numéro du commit. Pas ce que le plan promettait encore.
- **Hors périmètre.** Paiement, fournisseur de SMS, autres jours, autres ateliers, refonte du site. Les 3 absents ne sont pas « réglés » par une clé collée dans le chat. Ils le sont si la confirmation se voit et si Léa peut trancher avant 18 h.
- **Reprendre demain.** Dernier incrément dont le rituel est complet. Branche. Prochaine preuve. Fichiers à citer. Test encore rouge, s'il y en a un, recopié en une ligne. Vous ne rouvrez pas le long fil.

Ce dossier est le livrable du projet, avec les quatre commits, ou avec les commits réellement tenus et le trou avoué. Une page qui dit « application terminée » alors que l'URL n'a pas la confirmation est une page fausse. Léa s'en sert le samedi. Elle doit pouvoir s'y fier.

# Tenir jusqu'au bout sans tout refaire

Vous ne recommencez pas Sève à l'incrément 4 parce que l'écran de confirmation vous déplaît. Vous ajoutez la visibilité de la décision de Léa sur ce qui existe : les 12 stages, les 8 places, l'attente jusqu'à 12. Un diff de confirmation qui réécrit la liste est un diff à rejeter.

Si vous vous arrêtez au milieu, le dossier de reprise le dit. « Incréments 1 et 2 commités. Incrément 3 : l'ordre se voit, le test de la 13e est rouge, sortie collée ci-dessous. Ne pas ouvrir l'ancien fil. Citer la vue d'attente et la règle. » C'est un vrai livrable. Un dépôt silencieux, avec un chat plein et aucun commit, n'en est pas un.

Les 70 % de remplissage ne sont pas un chiffre à atteindre dans le projet. C'est la situation de départ. Votre preuve n'est pas « l'atelier est plein ». Votre preuve est : Léa voit les stages, ne dépasse pas 8 places assises, ordonne jusqu'à 12 personnes qui patientent, et tranche avant 18 h sans dépendre de sa mémoire.

> [!TIP]
> Écrivez le dossier de Léa au fur et à mesure, à chaque commit. Le reconstituer le dernier soir mélange ce qui est en ligne et ce qui était seulement dans le plan.

# Exercices

## Exercice 1 : L'incrément 3 en rituel

La liste et le refus de la 9e place sont commités. Vous attaquez l'attente. Écrivez le plan (preuve et exclusions), ce que le fil cite, ce que vous rejetez dans un diff, le test que vous lisez, et la phrase de commit.

<details>
<summary>Voir la solution</summary>

Plan : au-delà de 8 places, les demandes entrent dans une file, dans l'ordre d'arrivée, jusqu'à 12. La 13e est refusée. Les places assises restent 8. Le prix reste 45 €. Exclu : confirmation, 18 h, paiement, SMS, réécriture de la liste.

Le fil cite la règle et les fichiers de l'attente, plus le test du refus qui doit évoluer. Il ne cite pas le long fil de la liste. Vous rejetez un diff qui accepte 9 places assises, qui mélange l'ordre, ou qui ajoute 18 h « pour préparer ».

Vous lancez le test. Vous lisez deux lignes : la 9e demande est la première de l'attente, la 13e est refusée. L'ancien refus sec n'est pas ignoré en silence : le commit le remplace par cette preuve. Phrase : « Met la 9e demande en attente, dans l'ordre, et refuse la 13e. » Ensuite vous vérifiez l'ordre à l'écran.

</details>

## Exercice 2 : La page pour Léa

L'URL montre les 12 stages, 45 €, et le refus de la 9e place. L'attente existe dans un commit local, pas sur l'URL. La confirmation n'est pas commencée. Un camarade écrit : « Sève est en ligne, attente et SMS inclus. » Rédigez les trois blocs du dossier.

<details>
<summary>Voir la solution</summary>

En ligne : l'URL, les 12 stages du mois, 45 €, 8 places, la 9e demande refusée. Vous avez ouvert l'adresse et fait le geste. Le commit correspondant est nommé. L'attente n'est pas annoncée : elle n'est pas sur l'URL.

Hors périmètre : paiement, fournisseur de SMS, autres jours, autres ateliers. Le SMS oublié, cause des 3 absents, n'est pas « inclus » tant que la confirmation visible et la règle de 18 h ne sont pas livrées, et jamais via une clé dans le chat.

Reprendre demain : incrément 3 en local, à vérifier (ordre, plafond 12, 13e refusée) puis à publier avec la commande du dépôt et une relecture de l'URL. Incrément 4 pas commencé. Nouveau fil, règle, fichiers d'attente. Ne pas reprendre la phrase du camarade.

</details>

## Exercice 3 : Reprendre demain

Il est tard. Les incréments 1 à 3 sont commités et vus sur l'URL. L'incrément 4 a un test rouge : l'écran affiche 20 h, Léa tranche à 18 h. Le fil actuel propose d'ignorer le test. Écrivez la note de reprise, et la première phrase du fil de demain.

<details>
<summary>Voir la solution</summary>

Note : incréments 1, 2 et 3 en ligne (liste, 8 places, attente jusqu'à 12 dans l'ordre). Incrément 4 non commité. Test rouge : l'heure affichée est 20 h, la règle est 18 h la veille. Ne pas ignorer le test. Ne pas coller de secret SMS. Branche notée. Fichiers à citer : l'écran de confirmation et la règle.

Première phrase du fil neuf : « La confirmation doit montrer que Léa tranche avant 18 h la veille. Le test attend 18 h et il est rouge parce que l'écran dit 20 h. Corrige l'écran. Ne change pas l'heure, n'ignore pas le test, ne touche pas à la liste ni à l'attente. » Vous relirez le diff, le test, puis l'écran, avant toute phrase de commit.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Sève, jusqu'au dossier
center: "Quatre incréments, le même rituel. Léa reçoit ce qui est vraiment en ligne, le hors-cadre, et la reprise."
points:
  - icon: loop
    title: Quatre fois
    text: "Plan, fil court, diff, test lu, écran, commit. Une preuve par tour."
  - icon: list
    title: L'ordre
    text: "12 stages, refus puis attente jusqu'à 12, confirmation. Léa tranche avant 18 h."
  - icon: eye
    title: L'URL
    text: "Ce que le dossier appelle « en ligne » a été ouvert et refait par vous."
  - icon: shield
    title: Hors cadre
    text: "Pas de paiement, pas de clé SMS, pas d'autre jour. 45 €, 8 places et 18 h restent."
  - icon: file
    title: Demain
    text: "Branche, dernier incrément tenu, test rouge, fichiers à citer. Pas l'ancien fil."
  - icon: check
    title: Le dossier
    text: "Léa lit une page vraie. Un trou avoué vaut mieux qu'une application « terminée »."
pitfall: "Annoncer l'attente ou le SMS en ligne parce qu'ils sont dans le plan, ou ignorer le test de 18 h."
remember: "Tenez le rituel quatre fois. Le dossier dit l'URL vérifiée, le hors-périmètre, et comment reprendre sans tout réécrire."
```
