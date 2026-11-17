---
title: "Fiabilité et budget d'erreur"
description: "Traduire une disponibilité de 99,9 % en temps d'arrêt, nommer le toil, et laisser le budget d'erreur autoriser ou geler les mises en production."
duration: 45
objectives:
  - "Convertir 99,9 % de disponibilité en minutes sur un mois et sur un an"
  - "Lire le budget d'erreur restant avant de décider une mise en production"
  - "Distinguer le toil d'un travail qui améliore le service"
  - "Écrire une règle simple qui autorise ou gèle selon le reste du budget"
---

# 99,9 % en minutes

**99,9 %** de disponibilité veut dire qu'on accepte **0,1 %** du temps hors service. Le pourcentage impressionne. Les minutes, elles, se planifient.

| Fenêtre | Minutes totales | 0,1 % autorisé |
|---|---|---|
| 7 jours | 10 080 | environ 10 minutes |
| 30 jours | 43 200 | environ 43 minutes |
| 365 jours | 525 600 | environ 526 minutes, soit 8 heures 46 |

Sur un mois de 30 jours, le service peut être « en panne » au sens du SLO pendant **43 minutes** et tenir encore 99,9 %. Deux incidents de 15 minutes et un retour arrière de 10 minutes remplissent déjà presque le mois. Une heure d'arrêt d'affilée le casse.

Le même chiffre sur une semaine n'est pas le même contrat. Dix minutes par semaine est plus dur à tenir que 43 minutes par mois, parce qu'un seul déploiement raté peut manger la semaine. On écrit la **fenêtre** à côté du pourcentage. « 99,9 % » sans fenêtre ne dit pas si l'incident de mardi est encore dans les clous.

La mesure suit le SLI du parcours, pas l'état d'un pod. Un pod qui redémarre en quelques secondes, pendant que les clients passent, ne consomme pas le budget. Un `POST /commandes` qui échoue ou dépasse le délai, lui, le consomme, même si tous les pods sont « Running ».

```diagram
type: flow
title: "Du pourcentage aux minutes du mois"
steps:
  - title: "99,9 %"
    text: "Mille requêtes bonnes sur mille, moins une"
    tone: teal
  - title: "30 jours"
    text: "43 200 minutes dans le mois"
    tone: blue
  - title: "0,1 %"
    text: "Environ 43 minutes autorisées"
    tone: amber
  - title: "Décider"
    text: "Le reste se lit avant chaque mise en prod"
    tone: violet
```

On retient les **minutes** pour décider, et le **pour mille** pour ne pas promettre un chiffre que l'équipe ne sait pas tenir. Un pod affiché « Running » ne prouve pas que ces minutes sont intactes.

# Le budget d'erreur se dépense

Le **budget d'erreur** est cette marge, tenue à jour. Au début du mois : 43 minutes. Après un incident de 12 minutes : 31 minutes. Après un déploiement qui dégrade le SLI pendant 20 minutes : 11 minutes. Le reste est un fait, pas une opinion.

On le dépense pour de vraies raisons : un incident, une bascule, une expérience assumée. On ne le « garde pour plus tard » au point de ne jamais livrer. Un budget intact en fin de mois, avec une file de changements bloqués par peur, peut vouloir dire que l'objectif était trop mou, ou que l'équipe n'ose pas l'utiliser. Un budget vidé le 4 du mois veut dire que la fiabilité, pas la prochaine fonction, est le sujet.

La vitesse compte autant que le reste. Perdre 20 minutes en une heure (brûlure rapide) n'a pas le même sens que perdre 20 minutes étalées sur trois semaines. La brûlure rapide est un incident. L'érosion lente est un sujet de semaine.

> [!NOTE]
> Le budget n'est pas une punition. Le dépenser pour un lancement décidé, en le disant avant, est un usage légitime. Le découvrir vide un vendredi, sans décision, est un échec de pilotage.

# Autoriser ou geler la production

La règle se rédige **avant** d'en avoir besoin, sinon elle se négocie au moment où tout le monde veut livrer. Pour l'équipe de huit et le SLO à 99,9 % sur 30 jours, une règle tenable :

| Reste du budget du mois | Mise en production |
|---|---|
| Plus de la moitié (plus d'environ 20 minutes) | Les changements prévus partent, y compris un sujet un peu risqué, avec retour arrière prêt |
| Entre un quart et la moitié | Correctifs et changements à petit risque. Le chantier risqué attend |
| Moins d'un quart, ou brûlure rapide en cours | Gel des fonctions. On ne livre que ce qui **rend** du budget (correctif de fiabilité, retour arrière) |

Le gel n'est pas un blocage de Git. Les branches continuent. C'est la **production** qui ne reçoit plus de nouveauté. Un correctif du délai stock, lui, passe : il protège le reste du budget. Une refonte du panier, non.

```diagram
type: decision
title: "Ce changement part-il en production ?"
nodes:
  - question: "Une brûlure rapide est-elle en cours, ou le budget du mois est-il sous un quart ?"
    yes: "Gel des fonctions. Seul un correctif de fiabilité passe."
    no: "On regarde le risque du changement."
  - question: "Le reste est-il encore au-dessus de la moitié, et le retour arrière est-il prêt ?"
    yes: "On peut livrer, y compris un sujet risqué annoncé."
    no: "On livre le petit risque. Le chantier lourd attend une fenêtre plus large."
```

« Le métier insiste » ne saute pas la ligne. Si le métier veut dépenser le budget pour une date commerciale, la décision est explicite : on écrit que l'on accepte de passer sous le SLO, ou que l'on décale. Les deux sont des décisions. Livrer quand même sans le dire transforme la règle en décor.

```video
url: https://www.youtube.com/watch?v=LkuunG_GBfs
title: "Error Budgets Explained: Balancing Reliability and Feature Velocity"
channel: "Harness"
duration: "4:04"
lang: en
why: "Le budget d'erreur expliqué en quatre minutes : arbitrer entre fiabilité et vitesse de livraison."
```

# Le toil

Le **toil** est le travail opérationnel **manuel, répétitif, automatisable**, qui ne laisse pas le service meilleur une fois l'effort fini. Il se reconnaît à ceci : si on le refait la semaine prochaine à l'identique, rien n'a été appris ni renforcé.

Exemples de toil sur cette API :

- redéployer en cliquant la même checklist de douze étapes ;
- renouveler un certificat à la main chaque trimestre, avec la même peur ;
- acquitter chaque nuit la même alerte connue, sans correctif ;
- copier un secret d'un fichier vers un autre à chaque environnement.

Ce qui n'est **pas** du toil : conduire un incident, écrire le postmortem, construire le pipeline qui supprime la checklist, analyser un coût. Ces gestes laissent une trace utile. Le toil, lui, occupe la soirée et revient mercredi.

Le lien avec le budget est direct. L'heure passée à recliquer un déploiement n'est pas passée à réduire les 12 minutes d'incident. Une équipe de huit qui accepte un toil sans plafond voit son SLO tenu par des héros, puis plus tenu du tout quand les héros sont en congé. On plafonne, par exemple : si une tâche revient chaque semaine et prend plus d'une demi-heure, elle a un ticket d'automatisation daté, ou l'on assume par écrit de continuer à la payer en heures.

# Une règle écrite avant l'incident

La règle tient sur une page, à côté du SLO. Elle nomme :

- la fenêtre (30 jours glissants) et le budget (43 minutes) ;
- comment on compte une minute « mauvaise » (le SLI de `POST /commandes`) ;
- les trois paliers : livrer, restreindre, geler ;
- qui peut décider de **dépenser exprès** (par exemple la personne responsable du produit et l'incident commander, ensemble) ;
- où se lit le reste (un chiffre sur le tableau, pas un calcul dans un tableur privé).

Sans chiffre visible, la règle ne s'applique pas : chacun estime « ça va à peu près ». Avec le chiffre, la conversation du mardi change. « Il reste 11 minutes, ce chantier attend » est une phrase opérationnelle. « On est plutôt fiables en ce moment » ne l'est pas.

On révise la page si le SLO change. On ne la révise pas au milieu d'une mise en production pour faire passer le changement en cours.

# Relire le mois

En fin de fenêtre, une demi-heure suffit.

- Budget prévu, budget consommé, principaux postes (incident du 4, déploiement du 18).
- Décisions d'autorisation ou de gel : ont-elles été tenues ?
- Toil repéré : qu'est-ce qui a été automatisé, qu'est-ce qui reste ?
- Le SLO était-il le bon ? Trop souvent gelé sans incident réel : l'objectif ou les alertes sont peut-être trop durs. Vidé chaque mois : on investit dans la fiabilité avant d'ajouter des fonctions.

Cette relecture alimente le mois suivant. Elle évite que 99,9 % redevienne un slogan sur une diapositive, déconnecté des 43 minutes que l'équipe a vraiment eues.

# Exercices

## Exercice 1 : Combien reste-t-il

SLO : 99,9 % sur 30 jours, budget 43 minutes, mesuré sur `POST /commandes`. Nous sommes le 12. Un incident a consommé 18 minutes le 3. Un déploiement le 9 a dégradé le SLI pendant 8 minutes. Aucun autre écart.

Combien reste-t-il ? Ce reste est-il au-dessus de la moitié, entre un quart et la moitié, ou sous un quart ?

<details>
<summary>Voir la solution</summary>

Consommé : 18 + 8 = **26 minutes**. Reste : 43 − 26 = **17 minutes**.

La moitié de 43 est environ 21 minutes. Le quart est environ 11 minutes. **17 minutes** est entre le quart et la moitié. On n'est pas en gel automatique, et on n'est plus dans la zone « chantier risqué bienvenu ». La règle de l'équipe envoie les petits changements et fait attendre le sujet lourd.

</details>

## Exercice 2 : Livrer ou attendre

Il reste 17 minutes, comme dans l'exercice précédent. Deux changements sont prêts. A : correction du délai du stock, retour arrière simple, le dernier incident venait de là. B : nouvelle étape de panier qui réécrit le contrat de l'API, migration de table comprise, répétée une fois en staging.

Lesquels partent cette semaine ? Que dites-vous si l'on vous demande de « faire passer B quand même » sans changer la règle ?

<details>
<summary>Voir la solution</summary>

**A part.** C'est un correctif de fiabilité, dans la zone « entre un quart et la moitié », et il protège le budget restant. Le retour arrière est prêt.

**B attend.** La réécriture et la migration sont le chantier risqué. Avec 17 minutes, un échec de 20 minutes viderait le mois. On le garde pour une fenêtre où le reste est au-dessus de la moitié, ou pour le mois suivant si la fenêtre se recharge.

« Faire passer B quand même » sans toucher à la règle casse la règle. La seule voie propre est une **décision explicite** de dépenser le budget (produit et commandement ensemble), en acceptant de finir le mois sous 99,9 %, écrite avant le déploiement. Sinon B attend.

</details>

## Exercice 3 : Toil ou travail utile

Classez chaque tâche. (1) Chaque mise en production demande de suivre à la main une checklist de douze clics, identique depuis trois mois. (2) Après l'incident du 3, écrire deux actions datées et tenir le postmortem. (3) Acquitter chaque nuit une alerte de disque de logs connue, sans ticket ouvert. (4) Passer une après-midi à faire échouer le pipeline si cette checklist n'est plus faite à la main.

Pour celle qui est du toil et qui revient, quelle suite exigez-vous ?

<details>
<summary>Voir la solution</summary>

(1) est du **toil** : manuel, répétitif, la prod n'est pas meilleure le lendemain, seulement redéployée. (2) n'en est pas : le postmortem laisse des actions qui changent le système. (3) est du toil : le même acquittement, aucune correction. (4) n'en est pas : l'après-midi supprime le toil de (1).

Suite pour (1) et (3) : un ticket daté d'automatisation ou de correctif. Pour (1), le pipeline devient le seul chemin, la checklist disparaît. Pour (3), on supprime l'alerte de page ou on corrige la rétention des logs, on n'ajoute pas une personne de plus pour cliquer « acquitter ». Sans date, le toil reste le vrai processus de l'équipe.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Fiabilité et budget d'erreur"
center: "99,9 % sur 30 jours, c'est environ 43 minutes. Ce reste autorise ou gèle la prod."
points:
  - icon: clock
    title: "Des minutes, pas un slogan"
    text: "43 minutes par mois, environ 10 par semaine, 8 heures 46 sur l'année."
  - icon: gauge
    title: "Le reste se lit"
    text: "Chaque incident et chaque déploiement raté enlève des minutes visibles sur le tableau."
  - icon: scale
    title: "Trois paliers"
    text: "Moitié restante : on livre. En dessous : on restreint. Sous un quart : on gèle les fonctions."
  - icon: loop
    title: "Le toil plafonné"
    text: "La checklist rejouée chaque semaine a un ticket d'automatisation, ou l'on paie l'heure en clair."
  - icon: file
    title: "Règle avant le rush"
    text: "Dépenser exprès se décide par écrit. On ne révise pas la page pour faire passer le changement."
pitfall: "Livrer un chantier risqué avec 10 minutes restantes, ou croire qu'un pod Running prouve le SLO."
remember: "Le budget est une marge à dépenser sciemment. Vide sans décision, il gèle la suite."
```
