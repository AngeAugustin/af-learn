---
title: Revue avant le commit
description: "Tenir dans l'éditeur une checklist avant le commit : règle métier, textes de Léa, tests lancés, aucun secret. Le message dit le but de l'incrément."
duration: 50
objectives:
  - "Garder visible une checklist de quatre lignes avant de committer"
  - "Vérifier la règle métier, les textes de Léa et les tests lancés"
  - "Retirer un secret du diff avant qu'il parte"
  - "Écrire un message de commit qui dit le but de l'incrément"
---

# Quatre lignes, visibles

Le commit fige ce que Léa Vernet verra dans App Sève. Avant le bouton, vous avez sous les yeux quatre lignes, dans le chat ou dans une note ouverte à côté du diff. Elles ne restent pas dans votre tête. Une liste mentale disparaît dès que le diff est long.

Les quatre lignes sont stables. La règle métier de cet incrément. Les textes de Léa. Les tests lancés. L'absence de secret. Vous les cochez dans l'éditeur, fichier par fichier. L'Atelier Sève, à Lyon Croix-Rousse, sert de repère : si une ligne ne peut pas être racontée avec ses chiffres, elle n'est pas cochée.

> [!IMPORTANT]
> La checklist est un objet dans l'éditeur, à côté du diff. Elle ne se reconstitue pas après le commit.

# La règle de cet incrément

La règle change selon la branche, les titres de la checklist non. Pour la liste, la règle dit : le mois montre 12 stages, et chaque carte indique les places restantes sur un plafond de 8. Un stage qui annonce 9 places libres rate cette ligne. Pour l'incrément suivant, la règle dira le refus d'une 9e place. Plus tard, l'attente ordonnée, au plus 12 personnes. Encore après, la confirmation et la décision avant 18 h la veille.

Vous lisez le diff avec la règle de la branche en cours, pas avec tout le produit. Un changement qui prépare déjà le SMS, alors que vous montrez la liste, ne coche pas la case. Environ 3 absents par mois viennent d'un SMS oublié : ce constat explique un futur incrément. Il n'élargit pas le commit de la liste.

```diagram
type: decision
title: "Cocher ou retenir"
nodes:
  - question: "Le diff tient-il la règle de cet incrément, et seulement celle-là ?"
    yes: "Vous passez aux textes, aux tests et au secret."
    no: "Vous retirez l'écart ou vous reportez le commit."
  - question: "Textes de Léa, tests lancés, aucun secret : les trois tiennent-ils ?"
    yes: "Vous écrivez le but dans le message, puis vous committez."
    no: "Vous corrigez la ligne en échec et vous relisez le diff."
```

# Les mots que Léa prononce

Léa dit : samedi, de 10 h à 13 h, à Croix-Rousse, 45 €, 8 places. Vous retrouvez ces mots dans le diff, ou vous constatez qu'ils n'ont pas bougé depuis le dernier incrément accepté. Un prix à 50 €, un dimanche, une durée d'une heure, une adresse autre que Lyon Croix-Rousse : la ligne « textes de Léa » reste ouverte.

Vous lisez les phrases visibles, pas seulement les noms de variables. Un libellé « places illimitées », ou « dernier tour offert », n'est pas une phrase de l'atelier. Le remplissage autour de 70 % ne s'affiche pas comme une promesse au visiteur. C'est un fait de pilotage, pas un texte de carte.

> [!WARNING]
> Un texte inventé dans le diff se retrouve sur la porte de l'atelier. Vous le comparez à ce que Léa dit vraiment, avant le commit.

# Les tests ont tourné

La case « tests lancés » demande une sortie, pas un fichier. Vous avez vu dans le terminal le test de la règle en cours. Pour la liste : 12 stages, 45 €, places restantes cohérentes avec 8. Pour le refus : la 9e place n'est pas acceptée. Un fichier de test présent dans le diff, jamais exécuté, ne coche pas la case.

Si la sortie est plus ancienne que le diff, vous relancez. Un test vert lu la veille ne couvre pas la ligne modifiée il y a une minute. Vous gardez la sortie visible pendant que vous cochez, au même titre que les quatre lignes.

> [!TIP]
> Cochez « tests lancés » seulement si vous pouvez montrer la commande et le résultat à côté du diff, dans le terminal intégré.

# Aucun secret dans le diff

Vous parcourez les noms de fichiers avant les lignes de code. Un `.env`, un jeton, un mot de passe de boîte SMS, une clé collée dans un exemple : la quatrième ligne échoue. Vous retirez le fichier du commit. Vous ne le « cachez » pas dans le message en espérant qu'il passe inaperçu.

Le secret n'est pas un texte de Léa. Le prix de 45 € peut être public. Le jeton qui enverrait un rappel, lui, ne part pas avec l'incrément qui affiche les stages. S'il a été collé dans le chat pendant la séance, vous vérifiez qu'il n'a pas atterri dans un fichier suivi.

| Ligne visible | Elle est cochée quand | Elle bloque le commit quand |
|---|---|---|
| Règle métier | Le diff tient le chiffre de cet incrément | Une 9e place libre, ou une autre règle glissée |
| Textes de Léa | 45 €, samedi 10 h-13 h, Croix-Rousse | Un prix, un jour ou un lieu inventés |
| Tests lancés | La sortie du terminal est sous vos yeux | Le test est seulement écrit, ou ancien |
| Pas de secret | Aucun `.env` ni jeton dans les fichiers | Une clé accompagne la liste des stages |

# Le message dit le but

Quand les quatre lignes sont cochées, vous écrivez le message dans la foulée, pendant que le diff est encore ouvert. Le message dit ce que l'incrément rend vrai. Pour la liste, la phrase est : afficher les 12 stages et les places restantes.

« update » ne dit pas ce que Léa pourra vérifier. « wip », « fix », « retours » non plus. Une personne qui lit l'historique dans une semaine doit reconnaître l'incrément sans ouvrir chaque fichier. Vous écrivez le but, vous relisez les quatre lignes une dernière fois, puis vous committez.

> [!NOTE]
> Le message ne remplace pas la checklist. Il la résume une fois que les quatre lignes sont cochées dans l'éditeur.

# Un samedi, ligne à ligne

Vous ouvrez le diff de la liste et vous descendez les quatre lignes sans en sauter. Règle métier : douze cartes de stage, places restantes calculées sur 8, aucune carte n'annonce 9 places libres. Textes de Léa : samedi, 10 h-13 h, Croix-Rousse, 45 €. Tests lancés : le terminal, encore visible, montre ces résultats après la dernière modification. Pas de secret : le nom `.env` n'apparaît pas, et aucune clé ne traîne dans les fichiers ajoutés.

Si une ligne cloche, les trois autres ne la rachètent pas. Un prix juste ne fait pas entrer un jeton. Des tests verts ne font pas entrer un dimanche à la place du samedi. Vous corrigez, vous relancez si le code a changé, et vous recochez. Le message « afficher les 12 stages et les places restantes » s'écrit quand les quatre lignes tiennent ensemble.

Le remplissage autour de 70 %, et les 3 absents liés au SMS oublié, ne sont pas des cases de ce commit. Ils expliquent pourquoi un prochain incrément parlera de confirmation. Ils ne s'ajoutent pas en bas du diff « tant qu'à faire ».

> [!TIP]
> Racontez le diff à voix haute avec les chiffres de Léa. Si la phrase accroche sur un prix, une heure ou un secret, la ligne n'est pas cochée.

# Exercices

## Exercice 1 : Le message trop court

Le diff de la liste affiche 12 stages, 45 €, des places restantes sur 8. Les tests viennent de tourner. Aucun secret. Le message proposé est « update ». Que mettez-vous à la place, une fois les quatre lignes cochées ?

<details>
<summary>Voir la solution</summary>

Vous remplacez « update » par un message qui dit le but : afficher les 12 stages et les places restantes. Les quatre lignes sont cochées, donc le commit peut partir. Le mot « update » ne dit pas ce que la liste rend vrai pour Léa.

Vous ne profitez pas du message pour annoncer l'attente ou la règle des 18 h, qui ne sont pas dans ce diff.

</details>

## Exercice 2 : Deux lignes ouvertes

Le même incrément mélange un prix à 50 € sur une carte et un fichier `.env` avec un jeton. Les tests de la liste sont verts dans le terminal. Quelles lignes empêchent le commit ?

<details>
<summary>Voir la solution</summary>

Deux lignes restent ouvertes. Les textes de Léa : le stage coûte 45 €, pas 50 €, le samedi 10 h-13 h à Croix-Rousse. Le secret : le `.env` ne part pas dans le commit.

Les tests lancés ne suffisent pas à compenser ces deux écarts. Vous corrigez le prix, vous retirez le fichier, vous relisez, puis vous écrivez le but.

</details>

## Exercice 3 : La liste à côté du diff

Vous allez committer le refus de la 9e place. Écrivez les quatre lignes telles que vous les laissez visibles, avec ce que vous devez constater pour chacune.

<details>
<summary>Voir la solution</summary>

Règle métier : une 9e place est refusée sur un stage de 8. Textes de Léa : 45 €, samedi 10 h-13 h, Lyon Croix-Rousse, inchangés. Tests lancés : la sortie montre le refus, lue après le diff. Pas de secret : aucun jeton ni `.env` dans les fichiers.

Le message dira le but de ce refus, pas « update ». La checklist reste ouverte dans l'éditeur jusqu'au clic.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Quatre lignes avant le commit
center: "Règle métier, textes de Léa, tests lancés, aucun secret. Visibles dans l'éditeur. Le message dit le but."
points:
  - icon: check
    title: La règle
    text: "Le diff tient l'incrément en cours. La liste ne glisse pas la règle des 18 h."
  - icon: chat
    title: Les textes
    text: "Samedi 10 h-13 h, Croix-Rousse, 45 €, 8 places. Les mots sont ceux de Léa."
  - icon: test
    title: Les tests
    text: "Vous avez la sortie du terminal sous les yeux, plus récente que le diff."
  - icon: lock
    title: Le secret
    text: "Un .env ou un jeton sort du commit. Le prix public de 45 € peut rester."
  - icon: file
    title: Le message
    text: "Afficher les 12 stages et les places restantes. Le mot update ne dit pas le but."
pitfall: "Committer sur un « update » pendant qu'un prix inventé ou un secret est encore dans le diff."
remember: "On coche les quatre lignes dans l'éditeur, puis on écrit le but. Le bouton vient après la liste."
```
