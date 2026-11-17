---
title: Kanban, flux et limites
description: "Tenir un flux continu avec une limite de travail en cours, choisir Kanban plutôt qu'un sprint pour les incidents, et ne pas mélanger les mots des deux cadres."
duration: 50
objectives:
  - Expliquer un flux continu et une limite de travail en cours
  - Choisir Kanban quand le travail arrive sans rendez-vous
  - Séparer le sprint de la refonte et le flux des incidents livraison
  - Refuser les mots empruntés qui changent la règle en silence
---

# Flux continu et travail en cours

Un sprint groupe le travail dans une boîte de deux semaines, avec un objectif à la fin. Un **flux** ne groupe pas. Le travail entre quand une place se libère, et il sort dès qu'il est fini. Personne n'attend le lundi pour prendre un incident de mardi.

La **limite de travail en cours** est le nombre maximum de sujets ouverts dans une colonne. Sans elle, un tableau kanban n'est qu'une liste collée au mur. Chacun démarre, personne ne finit. Chez Halte, Hugo et Nadia voient arriver les incidents livraison (commande promise, stock faux, transporteur absent, magasin qui ne trouve pas la liste). S'ils en ouvrent six, aucun n'est clos avant la fin de la journée. Le client rappelle. Le magasin improvisera.

Limite tenue pour ce flux : **deux** incidents en cours, **un** en recette magasin. Un troisième incident attend, même s'il crie. Le cri se traite en choisissant lequel des deux en cours on finit ou on suspend, pas en ouvrant une septième ligne. Marc n'anime pas ce flux : il n'est pas le cadre du sprint. Vous et Hugo tenez la limite, parce que le support est le métier d'Hugo, pas une cérémonie.

La limite se voit. Une colonne au-dessus du maximum est un incident de pilotage, pas une preuve d'engagement. « On a beaucoup de travail en cours » n'est pas une fierté.

```video
url: https://www.youtube.com/watch?v=rIaz-l1Kf8w
title: "Scrum vs Kanban - What's the Difference?"
channel: "Development That Pays"
duration: "5:08"
lang: en
why: "Scrum et Kanban comparés clairement : itérations contre flux continu, et limites de travail en cours."
```

# Quand le sprint n'est pas le bon cadre

Le sprint vaut pour la refonte : un incrément daté, des critères, une revue avec un préparateur. Il vaut mal pour trois situations du projet Halte.

- **L'arrivée est imprévisible.** Un transporteur qui ne passe pas à Nantes mardi n'attend pas la planification de lundi prochain.
- **Le travail se termine un par un**, sans objectif commun à montrer dans deux semaines. Clore l'incident de Nantes ne constitue pas, avec trois autres tickets, une promesse nouvelle.
- **Mélanger les deux casse l'objectif.** Si chaque incident entre dans le sprint « pour qu'on le voie », l'objectif du filtre de stock meurt le mercredi. Julien quitte l'incrément pour un magasin en colère. La revue n'a plus rien à accepter.

Kanban vaut mieux ici parce que la question n'est pas « que montre-t-on dans deux semaines ? ». La question est « combien en traitons-nous à la fois, et lequel d'abord ? ». La priorité des incidents suit une règle écrite : client bloqué en magasin, puis commande non partie, puis demande d'explication. Pas le dernier directeur qui a appelé.

```diagram
type: compare
title: Deux questions, deux tableaux
columns:
  - title: Sprint de la refonte
    tone: blue
    items:
      - "Que montre-t-on dans deux semaines"
      - "Histoires d'Inès, revue avec un préparateur"
      - "Julien ne quitte pas le filtre pour Lille"
  - title: Flux des incidents
    tone: amber
    items:
      - "Combien à la fois, et lequel d'abord"
      - "Limite de deux en cours, Hugo porte la file"
      - "On tire quand une place se libère"
```

```diagram
type: decision
title: Sprint de la refonte ou flux incident
nodes:
  - question: "Ce travail arrive-t-il sans rendez-vous, plusieurs fois par semaine ?"
    yes: "Le poser sur le flux incidents, avec une limite de travail en cours."
    no: "On peut le grouper dans un objectif daté."
  - question: "Faut-il un incrément qu'un préparateur pourra voir à une date de sprint ?"
    yes: "Sprint de deux semaines, backlog d'Inès, revue."
    no: "Flux continu : on tire le suivant quand une place se libère."
```

# Incidents et projet sur deux tableaux

Halte a les deux besoins en même temps. La refonte avance par sprints. Les magasins vivent des incidents tous les jours, y compris sur l'ancienne promesse, tant que les quarante ne sont pas passés. **Deux tableaux.** Les fusionner « pour un seul reporting » remet les incidents dans le sprint.

Tableau 1, sprint : histoires d'Inès, équipe de réalisation, daily de Marc, revue. On n'y colle pas le ticket « transporteur absent à Lille ».

Tableau 2, flux : colonnes À prendre, En cours (limite 2), À vérifier en magasin (limite 1), Clos. Hugo porte la file. Nadia y entre seulement si l'incident est un flux de stock, et elle y entre à la place d'un autre sujet, pas en plus. Karim confirme le geste magasin. Chloé confirme le transporteur. Vous regardez la file deux fois par semaine : âge des tickets, limite respectée, incidents qui révèlent un risque de la refonte (le stock faux n'est plus un risque s'il arrive chaque jour : c'est un problème).

Un incident peut **devenir** une histoire. Si les mêmes refus de créneau reviennent, Hugo ne les traite plus un par un seulement : il les signale à Inès. Elle décide d'une histoire de refonte. Le ticket unitaire reste dans le flux jusqu'à sa clôture. On ne le copie pas dans les deux tableaux pour le compter deux fois.

> [!IMPORTANT]
> Le flux n'est pas une salle d'attente du sprint. Un incident n'y « patiente » pas jusqu'à lundi. S'il attend, c'est parce que la limite est pleine et qu'un sujet plus urgent est en cours.

# Ne pas mélanger les mots

Les deux cadres ont des mots précis. Les échanger permet de changer la règle sans le dire. Chez Halte, on parle comme on travaille.

| On dit | Sens sur ce projet | On ne dit pas |
| --- | --- | --- |
| Sprint | Deux semaines, un objectif, une revue | « Notre kanban de quinze jours » |
| Incrément | Comportement utilisable en fin de sprint | Un ticket incident clos |
| Limite de travail en cours | Maximum ouvert dans une colonne du flux | La vélocité de l'équipe |
| Flux | On prend quand une place se libère | Un sprint sans date « pour être agile » |
| Daily de sprint | Obstacle sur l'objectif, quinze minutes | Le point sur les incidents d'Hugo |
| Priorité d'incident | Règle écrite : client bloqué d'abord | L'ordre du backlog d'Inès |

« Agile » ne sert pas de synonyme. Si quelqu'un dit « on sera agile, on verra », demandez quel cadre : sprint avec objectif, ou flux avec limite. Les deux sont sérieux. Le flou ne l'est pas.

Marc ne facilite pas le flux avec les cérémonies du sprint. Vous n'imposez pas une vélocité au tableau d'Hugo. Inès n'ordonne pas les incidents comme des histoires, sauf ceux qu'elle reprend dans la refonte. Chacun garde ses mots, donc ses règles.

# Ce que vous regardez sans fusionner

Votre page sponsor peut citer les deux cadres en quatre lignes, sans les additionner. « Sprint : objectif tenu, revue avec le préparateur de Nantes vendredi. Flux : limite respectée, douze incidents clos, trois de plus de cinq jours, dont le stock faux de Lille déjà basculé en problème. » Vous ne fabriquez pas un indicateur unique « pièces livrées » qui mélange histoires et tickets. Claire ne saurait plus si la refonte avance ou si le support compense.

Deux fois par semaine, vingt minutes avec Hugo : âge de la file, limite, ce qui doit devenir histoire ou risque. Pas un second daily. Si la limite saute tous les jours, le sujet n'est pas la discipline d'Hugo. C'est la capacité : 30 % de son temps ne suffisent pas à absorber l'ancienne promesse et la refonte. Vous le dites à son responsable et à Claire, avec le nombre de tickets, pas avec une exhortation.

Le jour où les quarante magasins sont sur la promesse nouvelle, le flux ne disparaît pas. Le support reste un flux. Le sprint, lui, s'arrête à la fin du projet. Les garder distincts maintenant évite de réinventer la confusion dans six mois.

# Exercices

## Exercice 1 : Où poser l'appel de Lille

Mardi 11 h, le directeur de Lille appelle : le transporteur n'est pas passé, six commandes attendent en réserve. Julien est en train de finir le filtre des quatre pilotes. Un directeur vous demande de « le mettre dans le sprint pour que ce soit suivi ». Où posez-vous ce travail, et que dites-vous à Julien ?

<details>
<summary>Voir la solution</summary>

C'est un incident. Il va sur le flux, pas dans le sprint. La question n'est pas de le montrer dans deux semaines : les six commandes attendent aujourd'hui. Hugo le prend si une des deux places « en cours » est libre. Sinon il finit ou suspend un incident moins urgent (la règle : client ou commande bloquée d'abord), puis il prend Lille.

Julien ne quitte pas le filtre. Vous le dites au directeur : le sprint protège la refonte, Chloé et Hugo traitent le passage manqué aujourd'hui. Si les passages manqués se répètent, vous ouvrez un risque transporteur, et Inès décidera plus tard s'il devient une histoire. On ne copie pas Lille dans les deux tableaux.

</details>

## Exercice 2 : La limite saute

Le tableau d'Hugo affiche huit incidents « en cours » pour une limite de deux. Il dit : « si je n'ouvre pas, les magasins croient qu'on les ignore. » La file a douze jours d'âge sur le plus vieux ticket. Que changez-vous, sans ajouter une cérémonie ?

<details>
<summary>Voir la solution</summary>

Vous remettez la limite. Huit lignes ouvertes ne rassurent pas : elles montrent que rien ne finit. Hugo en garde deux, choisies avec la règle (client bloqué, puis commande non partie). Les six autres retournent dans « à prendre », visibles, avec leur date d'arrivée. Les magasins voient l'ordre, pas huit « en cours » fictifs.

Vous ne créez pas un daily du flux. Vous regardez avec Hugo, vingt minutes, l'âge des tickets. Si la limite est intenable parce que 30 % de son temps ne suffisent pas, vous le portez à son responsable et à Claire : soit plus de temps d'Hugo, soit un périmètre d'incidents plus étroit, soit les deux. Baisser la limite sur le papier sans trancher la capacité ne sert à rien. Monter la limite à huit pour coller à la réalité non plus : vous officialisez le fait de ne rien finir.

</details>

## Exercice 3 : Les mots ont glissé

Dans le compte-rendu, Marc a écrit : « vélocité du kanban : 14, notre sprint flux est agile cette semaine. » Le tableau unique mélange histoires de filtre et incidents. Réécrivez quatre lignes que Claire peut lire sans prendre un ticket pour un incrément.

<details>
<summary>Voir la solution</summary>

« Refonte, sprint en cours : objectif inchangé, filtre des quatre pilotes, revue vendredi avec un préparateur. On ne mesure pas cela en tickets clos.

Support livraison, flux séparé : limite de deux incidents en cours, tenue. Huit clos cette semaine, trois encore ouverts depuis plus de cinq jours. Ce ne sont pas des histoires, et ce n'est pas une vélocité.

Aucun des deux cadres n'est appelé agile pour éviter de dire sa règle. Les incidents répétés de stock faux sont basculés en problème, pas ajoutés au sprint. »

Vous séparez à nouveau les deux tableaux le jour même. « Sprint flux » et « vélocité du kanban » sortent du vocabulaire du projet.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Kanban sans mélanger les mots
center: "Le sprint livre la refonte. Le flux absorbe l'incident du jour. On ne les additionne pas pour faire un reporting."
points:
  - icon: loop
    title: Flux
    text: "On prend le suivant quand une place se libère. Personne n'attend le lundi du sprint."
  - icon: gauge
    title: Limite
    text: "Deux incidents en cours, pas huit. Une colonne pleine se voit. Ouvrir davantage ne rassure pas."
  - icon: alert
    title: Incident
    text: "Transporteur absent, stock faux : flux d'Hugo. Julien ne quitte pas l'incrément pour cela."
  - icon: layers
    title: Deux tableaux
    text: "Sprint d'Inès d'un côté, file du support de l'autre. Fusionner les deux casse l'objectif."
  - icon: book
    title: Les mots
    text: "Limite n'est pas vélocité. Un ticket clos n'est pas un incrément. Agile n'est pas une règle."
pitfall: "Glisser chaque incident dans le sprint pour qu'il soit suivi, puis n'avoir plus rien à montrer en revue."
remember: "Kanban vaut mieux qu'un sprint quand le travail arrive sans rendez-vous et doit finir un par un."
```
