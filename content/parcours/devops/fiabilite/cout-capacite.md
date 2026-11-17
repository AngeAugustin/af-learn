---
title: "Coût et capacité"
description: "Régler les requests et l'autoscaling, retrouver les environnements oubliés, lire une facture cloud par ses plus grosses lignes, et refuser une infrastructure trop grande."
duration: 40
objectives:
  - "Relier requests, limites et autoscaling à la charge réelle de l'API"
  - "Repérer un environnement ou une rétention qui continuent de coûter"
  - "Lire une facture par les cinq lignes qui pèsent"
  - "Refuser une infrastructure surdimensionnée avec une contre-proposition"
---

# Requests, limites et ce qu'on réserve

Sur un orchestrateur, la **request** est ce que l'ordonnanceur **réserve** pour le processus. La **limite** est le plafond au-delà duquel il est bridé ou tué. La facture et la place dans le cluster suivent surtout la réservation, pas la consommation polie que l'on espère.

L'API de commandes, mesurée sur deux semaines hors soldes : le processeur utilisé tourne autour de 0,15 cœur, avec un p95 à 0,4. Réserver 2 cœurs « pour être tranquille » bloque de la place pour presque rien, et pousse à ajouter des nœuds. Réserver 0,05 cœur alors que le p95 est à 0,4 fait évincer le pod dès que les soldes arrivent.

Un point de départ honnête : request proche de l'usage typique avec une marge, limite au-dessus du pic que l'on accepte, puis on **relit** après une semaine de métriques. On ne copie pas les chiffres d'un tutoriel.

| Réglage | Trop bas | Trop haut |
|---|---|---|
| Request CPU ou mémoire | Évictions, démarrages en boucle, latence | Nœuds vides réservés, facture qui monte sans trafic |
| Limite mémoire | Processus tué au pic (OOM) | Un bug peut emporter toute la machine |
| Réplicas fixes | File d'attente dès que le trafic double | On paie la nuit comme le samedi des soldes |

La mémoire se traite avec plus de marge que le processeur : un manque de CPU ralentit, un manque de mémoire tue. On le voit dans les événements du pod, pas dans une impression de « lenteur générale ».

# L'autoscaling a un plancher et un plafond

L'**autoscaling** ajoute ou retire des replicas selon un signal : CPU, ou mieux un signal proche du parcours (requêtes en cours, latence de file). Il a besoin d'un **minimum** et d'un **maximum** écrits.

- Le minimum trop haut paie des replicas la nuit. Pour 2 requêtes par seconde, un replica (ou deux, pour encaisser un redémarrage) suffit souvent.
- Le maximum trop haut transforme un bug de boucle en facture : cent replicas qui appellent la base cent fois plus fort.
- Le signal CPU seul rate une lenteur due au stock : le pod attend, le CPU est bas, rien ne scale, les clients attendent quand même.
- La montée n'est pas instantanée. Un pic de trente secondes ne justifie pas un maximum prévu pour les soldes. Les soldes, eux, se préparent : on monte le maximum **avant**, on le redescend **après**.

La base de données ne scale pas comme les pods. Plus de replicas d'API, c'est plus de connexions. On fixe le nombre de connexions par processus en même temps que le maximum de replicas, sinon l'autoscaling « réussit » et la base refuse les nouvelles connexions. C'est une panne plus chère que la file d'attente qu'on voulait éviter.

```diagram
type: flow
title: "Régler la capacité dans l'ordre"
steps:
  - title: "Mesurer"
    text: "Usage réel, pas le tutoriel"
    tone: blue
  - title: "Réserver"
    text: "Request proche du palier, limite au-dessus du pic"
    tone: violet
  - title: "Borner"
    text: "Minimum de nuit, maximum des soldes"
    tone: amber
  - title: "Relire"
    text: "Connexions base, facture, latence"
    tone: teal
```

# Les environnements qu'on oublie

La production n'est pas la seule ligne. Ce qui coûte sans servir a souvent été créé pour une bonne raison, puis laissé.

- un environnement de **prévisualisation** par branche, encore là trois mois après la fusion ;
- une « démo » copie de la base de production, taille comprise ;
- un second staging que plus personne n'utilise depuis le changement de pipeline ;
- des disques détachés, des répartiteurs sans backend, des adresses IP réservées ;
- des logs en `debug` gardés **un an**, plus chers que le calcul de l'API ;
- un cluster de build qui tourne le week-end sans job.

La règle simple : tout environnement hors production a un **propriétaire** et une **date de fin**. La date passée, il s'arrête, sauf renouvellement explicite. Un nom du type `staging-old-final-2` est un aveu. On le planifie à la suppression, on ne lui ajoute pas de la surveillance.

Les prévisualisations utiles durent le temps de la revue. Au-delà, elles deviennent un deuxième parc à patcher, souvent sans scan et sans budget d'erreur. Le coût n'est pas seulement la facture : c'est aussi la surface.

# Lire la facture par les plus grosses lignes

Une facture cloud se lit **par le haut**. Cinq lignes portent en général l'essentiel. Les deux cents autres sont du bruit tant que les cinq premières ne sont pas comprises.

Pour une API de cette taille, les familles habituelles :

| Famille | Question à poser |
|---|---|
| Calcul (nœuds, pods, PaaS) | Réserve-t-on la nuit ce que les soldes exigent ? |
| Base gérée | La taille suit-elle les données, ou une copie de démo ? |
| Journaux et métriques | La rétention et le `debug` sont-ils voulus ? |
| Sortie réseau | Un appel bavard ou une copie de base traverse-t-il les zones ? |
| Registre, stockage, IP | Des artefacts et des disques orphelins restent-ils ? |

On compare au **mois précédent**, pas à une intuition. Une ligne qui double est la question de la semaine. Une ligne stable et comprise se laisse. Sans **étiquettes** (`env`, `service`), on ne peut pas dire si le double vient de la production, du staging oublié ou des prévisualisations. Poser les étiquettes est le préalable à tout refus argumenté.

L'ordre de lecture : total, top cinq, ligne qui a bougé, étiquette d'environnement, nom de la ressource. On s'arrête là avant d'ouvrir le détail de chaque gigaoctet. « Lire la facture » veut dire pouvoir expliquer les cinq lignes à l'équipe en dix minutes.

```diagram
type: stack
title: "Une facture d'exemple, en euros"
segments:
  - label: "Calcul"
    value: 420
    tone: blue
    text: "Nœuds et réplicas, nuit comprise"
  - label: "Base"
    value: 380
    tone: violet
    text: "Production plus une copie de démo"
  - label: "Journaux"
    value: 260
    tone: amber
    text: "Debug gardé longtemps"
  - label: "Sortie"
    value: 90
    tone: teal
    text: "Trafic entre zones"
  - label: "Autres"
    value: 40
    tone: rose
    text: "Registre, disques, adresses"
```

Sur cet exemple, le calcul n'est pas le premier sujet si la base « démo » et les journaux expliquent plus de la moitié du hors-calcul. Couper des replicas sans regarder les logs rate la ligne qui a gonflé.

# Le droit de dire non

Dire **non** à une infrastructure trop grande fait partie du travail de fiabilité. Un cluster de douze nœuds pour une API à 2 requêtes par seconde (50 pendant vingt minutes de soldes) est plus lent à comprendre, plus long à patcher, plus cher, et il ne rend pas le SLO plus vrai. La panne viendra d'un délai du stock ou d'un déploiement, pas d'un manque de douze machines.

Le refus a une forme.

1. Ce qui est demandé, en une phrase, avec le coût approximatif.
2. La charge réelle : débit habituel, pic, durée du pic.
3. La contre-proposition : deux replicas la nuit, maximum prêt pour les soldes, une base à la taille des données.
4. Ce qui ferait changer d'avis : une mesure (p95 de CPU au plafond, file qui grandit, SLO manqué **à cause** de la capacité), pas une crainte.
5. Le SLO : l'architecture proposée tient l'objectif, ou l'on dit quel objectif elle ne tiendrait pas.

« Non » sans contre-proposition passe pour un blocage. Une contre-proposition sans chiffre passe pour une préférence. Les deux ensemble sont une décision d'ingénierie. L'équipe de huit a mieux à faire que d'exploiter un parc prévu pour une charge qu'elle n'a pas.

> [!TIP]
> Le droit de dire non s'exerce aussi sur une rétention de logs « on ne sait jamais » et sur une copie de base « au cas où ». Le oui par défaut est une facture. Le oui argumenté est un choix.

# Exercices

## Exercice 1 : Deux cœurs pour 0,4

Le déploiement `commandes` demande 2 cœurs et 4 Go par replica, avec 4 replicas en permanence. Les métriques sur quatorze jours : CPU p95 à 0,4 cœur, mémoire p95 à 700 Mo, nuit à moins de 0,1 cœur. Pas d'éviction. Les soldes, deux fois par an, montent le CPU p95 à 1,2 cœur pendant vingt minutes. Quelqu'un dit : « on ne touche pas, c'est stable ».

Que changez-vous dans les requests et le nombre de replicas, et que gardez-vous comme garde-fou pour les soldes ?

<details>
<summary>Voir la solution</summary>

On **baisse** la request vers l'usage réel : par exemple 0,5 cœur et 1 Go, limite mémoire au-dessus du pic (autour de 1,5 Go) pour ne pas tuer le processus. Quatre replicas permanents à 2 cœurs réservent 8 cœurs pour un service qui en utilise moins d'un en p95 hors soldes : c'est de la place vide.

Hors soldes, **deux** replicas suffisent pour encaisser un redémarrage. Pour les soldes, un maximum d'autoscaling (ou un relèvement planifié) couvre le pic à 1,2 cœur, puis on redescend. Garde-fou : surveiller les évictions et la latence au prochain pic, et le nombre de connexions à la base si le maximum monte. « C'est stable » voulait dire « on paie le calme ». La stabilité du SLO se vérifie après le resserrage, pas avant.

</details>

## Exercice 2 : La ligne qui a doublé

La facture du mois, étiquetée, en euros : calcul production 300 (stable), calcul `preview-*` 180 (était 20), base production 250 (stable), base `demo-copy` 200, journaux 260 (était 90, rétention passée à 365 jours et niveau debug), sortie réseau 40. Total en forte hausse. L'équipe propose de réduire les replicas de production.

Par quelles lignes commencez-vous, et quelle action concrète pour chacune des deux plus anormales ?

<details>
<summary>Voir la solution</summary>

On ne commence **pas** par les replicas de production : 300 euros, stables, ce n'est pas la hausse. Les deux lignes anormales sont les **prévisualisations** (180 contre 20) et les **journaux** (260 contre 90). La copie `demo-copy` à 200 euros se justifie ou s'arrête, même si elle n'a pas « doublé » ce mois-ci.

Actions : supprimer les environnements `preview` plus vieux que la revue en cours, et empêcher qu'ils vivent sans date de fin. Ramener la rétention des logs et couper le `debug` permanent, pour revenir vers la ligne d'avant. Ensuite seulement, si le calcul de production est surdimensionné par rapport au trafic, on serre les requests. Couper la production d'abord aurait abîmé le SLO pour économiser la ligne stable.

</details>

## Exercice 3 : Douze nœuds

Une proposition arrive : « cluster de douze nœuds, multi-zones, pour être sereins aux soldes ». Charge mesurée : 2 requêtes par seconde en journée, pic à 50 req/s pendant vingt minutes, deux fois par an. L'API tient aujourd'hui sur un PaaS modeste, SLO du mois respecté, le pic précédent a été limité par le délai du stock, pas par le CPU.

Rédigez le refus en cinq points, avec la contre-proposition et ce qui vous ferait dire oui plus tard.

<details>
<summary>Voir la solution</summary>

1. Demandé : un cluster de douze nœuds multi-zones, coût et charge d'exploitation d'un vrai parc.
2. Charge : 2 req/s, pic 50 req/s pendant vingt minutes, deux fois par an.
3. Contre-proposition : rester sur le PaaS, deux replicas hors pic, plafond relevé **avant** les soldes, redescendu après. Le SLO est déjà tenu.
4. Le pic précédent a buté sur le **stock**, pas sur le calcul. Douze nœuds n'auraient pas raccourci ce délai.
5. On dira oui si une mesure montre le contraire : CPU ou file au plafond **et** SLI manqué à cause de la capacité, pas par précaution.

Le refus porte sur le surdimensionnement. Il ne dit pas « on ne scale jamais ». Il dit que l'échelle se prouve, et que l'équipe de huit n'opère pas un grand cluster tant que la charge ne le demande pas.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Coût et capacité"
center: "On réserve ce que la charge montre, on lit le haut de la facture, on peut dire non."
points:
  - icon: gauge
    title: "Request mesurée"
    text: "Proche de l'usage réel. Trop haute, on paie du vide. Trop basse, on évince au pic."
  - icon: scale
    title: "Plancher et plafond"
    text: "Peu de replicas la nuit, un maximum pour les soldes, et les connexions de la base avec."
  - icon: cloud
    title: "Environnements datés"
    text: "Prévisualisation, démo, disque oublié : un propriétaire et une fin, sinon on éteint."
  - icon: money
    title: "Le haut de la facture"
    text: "Cinq lignes, l'écart au mois dernier, l'étiquette d'environnement. Le reste attend."
  - icon: compass
    title: "Non argumenté"
    text: "Charge réelle, contre-proposition, mesure qui ferait changer d'avis."
pitfall: "Couper les replicas de production alors que les logs et les prévisualisations expliquent la hausse."
remember: "Une infra trop grande se paie, se patche et se comprend mal. La charge mesurée a le dernier mot."
```
