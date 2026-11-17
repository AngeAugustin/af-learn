---
title: Faire tourner les tests dans la session
description: "Nommer le test dans la demande, laisser l'agent proposer la commande, puis lire le rouge ou le vert avant de clore l'incrément d'Atelier Sève."
duration: 50
objectives:
  - "Écrire dans la demande le test qui porte la règle du moment"
  - "Lire la commande proposée et la sortie rouge ou verte"
  - "Garder l'incrément ouvert tant que le test nommé n'est pas vert"
  - "Relier chaque incrément de Sève au test qui le concerne"
---

# La demande nomme le test

Léa Vernet construit App Sève dans le terminal, avec Claude Code. L'atelier est à Lyon Croix-Rousse. Le stage du samedi va de 10 h à 13 h, il coûte 45 €, il tient 8 places. L'attente en accueille 12 au plus. La décision de confirmation se prend avant 18 h la veille. Le mois compte 12 stages, le remplissage tourne autour de 70 %, et 3 personnes manquent parce qu'un SMS a été oublié.

La demande dit quel test doit passer. Deux formulations reviennent : « la 9e place est refusée », « 12 stages à 45 € ». Le nom porte la règle. « Lance les tests » laisse l'agent choisir un vert commode. Léa écrit la phrase qu'elle veut voir dans la sortie.

Les quatre incréments gardent chacun leur phrase.

1. La liste : « 12 stages à 45 € », avec le samedi 10 h-13 h à Croix-Rousse.
2. Le refus : « la 9e place est refusée » quand 8 places sont prises.
3. L'attente : « la 13e personne en attente est refusée ».
4. La confirmation : « la décision après 18 h la veille est refusée ».

# L'agent propose la commande

Claude Code connaît le dépôt. Il propose la commande, par exemple `node verifier.js`. Léa la lit avant de la laisser partir. Elle vérifie qu'elle vise le vérificateur du projet, pas une installation, pas un effacement, pas un envoi de SMS.

Si la commande est trop large, elle la resserre. `node verifier.js` qui affiche tous les noms est lisible. Une commande qui n'imprime que `OK` cache quel test a parlé. Léa demande les lignes du test nommé.

Elle reste dans la même session. Le rouge se corrige ici, puis la même commande repart. Changer de session au milieu fait perdre la sortie que l'on était en train de lire.

# Lire le rouge et le vert

Le vert est une ligne qui reprend le nom demandé et annonce la réussite. Le rouge reprend ce nom et montre l'écart. Léa lit ces deux lignes. Elle ne déduit pas le résultat d'un résumé de l'agent.

```text
✗ la 9e place est refusée
  inscrits = 8, résultat = accepté
```

Huit personnes sont déjà inscrites. La suivante est la 9e. Le test attend un refus. La sortie dit que l'inscription a été acceptée. L'incrément reste ouvert. Léa renvoie cette sortie à la session : le test nommé est rouge, la 9e personne est entrée.

```text
✓ la 9e place est refusée
  inscrits = 8, résultat = refusé
```

Là, la règle tenue dans ce test est verte. On peut passer à la relecture du diff. Le vert ne dispense pas de cette relecture.

```diagram
type: decision
title: "Le vert clôt-il l'incrément ?"
nodes:
  - question: "La sortie verte porte-t-elle le test demandé ?"
    yes: "On peut relire le diff de cet incrément"
    no: "L'incrément reste ouvert dans la session"
```

# Un vert hors sujet

Un test vert qui ne porte pas la phrase de la demande ne clôt pas l'incrément. L'exemple le plus trompeur est un succès à côté du sujet.

```text
✓ le dossier contient un fichier
✓ 12 stages à 45 €
```

Si la demande du moment est « la 9e place est refusée », la deuxième ligne peut être vraie depuis l'incrément de la liste. Elle ne dit rien des 8 places. La première ligne est vraie dès qu'un fichier existe. Léa les voit. Elle ne les compte pas comme la fin du refus.

Autre cas : « 12 stages à 45 € » est rouge parce qu'un stage est à 0 €, et « liste non vide » est vert. L'incrément de la liste reste ouvert. Le remplissage de 70 % n'est pas un test de remplacement. Les 3 absents du SMS non plus. Ces chiffres expliquent le mois. Ils ne cochent pas la phrase écrite dans la demande.

# Chaque incrément a sa phrase

L'incrément 1 est clos quand la sortie verte dit « 12 stages à 45 € » et que le créneau du samedi, 10 h-13 h, Croix-Rousse, est celui de la liste. Un compteur de lignes sans le prix laisse la demande inachevée.

L'incrément 2 est clos quand « la 9e place est refusée » est vert pour 8 inscrits. Un vert obtenu avec 0 inscrit, ou avec 2, ne prouve pas la limite. Léa veut le cas plein.

L'incrément 3 est clos quand la 13e personne en attente est refusée. Douze personnes peuvent attendre. La suivante non. Un test qui remplit l'attente de trois noms est un essai, pas la règle.

L'incrément 4 est clos quand une décision prise après 18 h la veille est refusée. Le stage a lieu le samedi. La veille, à 18 h, la confirmation est tranchée. Un test « le message contient bonjour » peut être vert toute la journée. Il ne clôt pas cet incrément.

# Renvoyer la sortie dans la session

Léa colle les lignes utiles, pas tout un journal. Elle nomme le test, la valeur (8 inscrits, 45 €, 18 h) et le résultat lu. Elle demande une correction, puis la même commande.

Si l'agent annonce « tout est vert » sans coller la phrase, Léa redemande la sortie. L'annonce n'est pas le test. Si le rouge parle d'un autre incrément, elle le note et elle revient à la phrase du moment. On ne répare pas l'attente pendant que la 9e place est encore acceptée, sauf si la sortie montre que les deux règles partagent la même ligne.

La session se termine sur une sortie que Léa a lue. Ensuite seulement, le diff.

# Exercices

## Exercice 1 : Un vert à côté

La demande dit : « la 9e place est refusée ». La sortie montre uniquement « ✓ le dossier contient un fichier ». L'agent propose de committer. Que répond Léa ?

<details>
<summary>Voir la solution</summary>

Elle refuse de clore l'incrément. Le test vert ne porte pas la phrase demandée. Un fichier présent ne dit pas ce qui arrive quand 8 places sont prises.

Elle redemande la commande qui affiche « la 9e place est refusée », puis elle lit le rouge ou le vert. Le commit attend cette lecture, et la relecture du diff ensuite.

</details>

## Exercice 2 : Lire le cas plein

La sortie dit : « ✗ la 9e place est refusée », « inscrits = 8 », « résultat = accepté ». Quelle phrase Léa renvoie-t-elle à la session ?

<details>
<summary>Voir la solution</summary>

Elle renvoie le fait lu : avec 8 inscrits, la 9e personne a été acceptée, alors que le test attend un refus. Elle redemande la même vérification après correction.

Elle ne se contente pas de « le test a échoué », qui ne dit ni le seuil ni le résultat. Elle ne change pas la demande pour un test plus facile, par exemple 2 inscrits, qui resterait vert même si la 9e place passait.

</details>

## Exercice 3 : Le prix et le SMS

L'incrément en cours est la liste. « 12 stages à 45 € » est rouge : un stage est à 0 €. « liste non vide » est vert. L'agent ajoute que les 3 absents du mois viennent d'un SMS oublié, et que le remplissage est d'environ 70 %. Peut-on clore la liste ?

<details>
<summary>Voir la solution</summary>

Non. Le test nommé est rouge. Le vert de « liste non vide » est hors sujet pour une demande qui fixe le nombre et le prix. Les 3 absents et les 70 % décrivent le mois de l'atelier. Ils ne remplacent pas « 12 stages à 45 € ».

Léa fait corriger le stage à 0 €, relance la commande, et lit une sortie verte qui reprend cette phrase. Le samedi 10 h-13 h à Croix-Rousse se vérifie dans la même liste.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Les tests dans la session"
center: "La demande nomme le test. Léa lit le rouge ou le vert de cette phrase."
points:
  - icon: chat
    title: "Phrase explicite"
    text: "« La 9e place est refusée » ou « 12 stages à 45 € ». Le nom porte la règle."
  - icon: terminal
    title: "Commande proposée"
    text: "L'agent propose la commande. Léa vérifie qu'elle affiche le test nommé."
  - icon: alert
    title: "Lire le rouge"
    text: "8 inscrits et un résultat accepté : l'incrément du refus reste ouvert."
  - icon: check
    title: "Lire le vert"
    text: "Le vert compte s'il reprend la phrase demandée, avec le cas utile."
  - icon: target
    title: "Hors sujet"
    text: "Un autre test vert, le 70 % ou les 3 SMS oubliés ne closent pas l'incrément."
pitfall: "Accepter un OK sans le nom du test, ou un vert qui parle d'un autre incrément."
remember: "On clôt quand la phrase demandée est verte. Ensuite Léa relit le diff."
```
