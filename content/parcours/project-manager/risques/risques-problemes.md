---
title: Risques et problèmes
description: "Distinguer ce qui peut encore arriver de ce qui est déjà là, qualifier probabilité et impact, nommer une parade et un propriétaire, et tenir un registre qu'on rouvre."
duration: 60
objectives:
  - Séparer un risque (pas encore arrivé) d'un problème (déjà là)
  - Qualifier probabilité et impact sans faux pourcentage
  - Écrire une parade et un propriétaire, pas une vigilance
  - Tenir un registre revu, et en sortir ce qui s'est réalisé
---

# Pas encore arrivé, ou déjà là

Un **risque** est un événement incertain. S'il arrive, il écarte Halte du résultat : les quarante magasins, les six mois, la promesse tenable, l'enveloppe de 220 k€. Il n'est pas encore là. On peut encore éviter, réduire, transférer ou accepter.

Un **problème** est arrivé. On ne le « surveille » plus. On le traite, avec un geste, un nom, une date de clôture. Le laisser dans le registre des risques rassure à tort : la ligne a l'air sous contrôle alors que le dégât est en cours.

Chez Halte, la différence se voit sur le stock.

- Risque : l'éditeur de caisse pourrait livrer le flux des quatre pilotes avec trois semaines de retard. Ce n'est pas sûr. Nadia a une date annoncée, pas encore dépassée.
- Problème : le magasin de Nantes a déjà envoyé vingt retraits sur un stock faux cette semaine. C'est arrivé. On coupe la promesse de retrait du jour sur ce magasin aujourd'hui. On n'écrit pas « risque de stock faux à Nantes » en orange dans un tableau.

La langue courante mélange les deux. « On a un risque, Nantes est en train de mal livrer. » Vous reprenez la phrase. Soit ça peut arriver, soit c'est là. Le traitement n'est pas le même, le décideur non plus. Un risque se revue chaque semaine. Un problème se pilote jusqu'à disparition du symptôme.

```diagram
type: pipeline
title: Deux files, deux traitements
lanes:
  - title: Risque, pas encore arrivé
    steps:
      - title: Qualifier
        text: "Probabilité et impact, sans pourcentage inventé"
        tone: amber
      - title: Parer
        text: "Éviter, réduire, transférer ou accepter"
        tone: violet
      - title: Revoir
        text: "Un propriétaire et une date, chaque semaine"
        tone: teal
  - title: Problème, déjà arrivé
    steps:
      - title: Sortir du registre
        text: "Ce n'est plus une hypothèse à surveiller"
        tone: rose
      - title: Contenir
        text: "Geste du jour, par exemple couper un magasin"
        tone: blue
      - title: Clore
        text: "Le symptôme a disparu, la cause est nommée"
        tone: teal
```

# Probabilité, impact, parade, propriétaire

Quatre colonnes suffisent. Une cinquième colonne « commentaire » devient vite le lieu où l'on cache l'absence de parade.

**Probabilité**, en trois mots, pas en pourcentage. Rare, possible, probable. « 37 % » sur un éditeur qui n'a pas de historique chiffré est une mise en scène. « Probable » veut dire : on a déjà vu le signal (date qui glisse, interlocuteur qui ne répond plus). « Possible » : ça peut arriver, rien ne le confirme cette semaine. « Rare » : on le garde parce que l'impact serait lourd, pas parce qu'on a peur de tout.

**Impact**, sur le résultat du projet, pas sur l'humeur. Délai des six mois, enveloppe, promesse client, nombre de magasins qu'on ne pourra pas ouvrir. « Fort » à Halte : le pilote ne peut pas filtrer les créneaux, ou la vague des quarante sort des six mois. « Limité » : un magasin pilote décale d'une semaine, la date finale tient.

**Parade**, un verbe et un fait. Éviter (ne pas ouvrir le magasin tant que le flux n'est pas là). Réduire (fichier manuel du matin sur les quatre pilotes seulement). Transférer (le contrat transporteur prévoit une pénalité, Chloé la rend exigible). Accepter (on vit avec un motif de refus incomplet pendant deux semaines, Hugo est prévenu, Claire le sait). « Rester vigilant » et « suivre de près » ne sont pas des parades. On ne peut pas les faire.

**Propriétaire**, une personne. Nadia pour l'éditeur. Chloé pour le transporteur. Vous n'êtes propriétaire de toutes les lignes que si vous faites le travail vous-même. Vous êtes propriétaire du registre : il est à jour, revu, montré à Claire. Le propriétaire de la parade agit. S'il n'a pas le pouvoir d'agir, ce n'est pas le bon nom : on met son responsable, ou vous escaladez.

> [!TIP]
> Si la parade n'a pas de date, elle n'est pas engagée. « Nadia relance l'éditeur » devient « Nadia a une réponse écrite vendredi, sinon vous appelez Claire lundi ».

```video
url: https://www.youtube.com/watch?v=xXV_gjtXMSk
title: "Project Risk Management - How to Manage Project Risk"
channel: "Online PM Courses - Mike Clayton"
duration: "11:26"
lang: en
why: "Mike Clayton détaille comment identifier, évaluer et traiter les risques d'un projet."
```

# Un registre qu'on rouvre

Le registre naît au cadrage. Il meurt s'il y reste. Une ligne sans date de dernière revue est une ligne morte : soit le risque a disparu et on l'archive, soit personne ne le regarde et il vous surprendra.

Rythme Halte : **chaque lundi, trente minutes**, vous, et les propriétaires des lignes ouvertes. Pas les neuf personnes. Cinq à dix lignes vivantes, pas quarante. Au-delà, vous n'avez plus un registre, vous avez une angoisse recopiée.

Chaque revue déplace la ligne :

- Le signal a baissé : la probabilité descend, ou la ligne s'archive.
- Le signal a monté : la parade change, ou vous escaladez.
- L'événement est arrivé : la ligne quitte les risques, un problème s'ouvre, avec le geste déjà fait ou à faire dans la journée.
- La parade était fictive (« être vigilant ») : vous la réécrivez ou vous acceptez explicitement, avec Claire si l'impact est fort.

Amina relit les lignes qui touchent l'enveloppe. Inès relit celles qui touchent la promesse. Elles ne coprésident pas tout le registre. Vous arrivez avec les lignes, pas avec une page blanche « de quoi avez-vous peur ? ». Cette question, une fois par mois, alimente le registre. Elle ne remplace pas la revue.

Le fichier tient en colonnes : énoncé, probabilité, impact, parade, propriétaire, date de revue, statut (ouvert, réalisé donc devenu problème, archivé). Une couleur ne suffit pas. Le vert sur une ligne non relue depuis un mois est un mensonge.

# Escalader une ligne, pas une angoisse

Vous escaladez vers Claire quand la parade dépasse votre mandat ou celui du propriétaire : argent au-delà de l'enveloppe, date des quarante magasins, conflit avec un directeur de région, éditeur qui ne répond plus. Vous n'escaladez pas une liste de douze peurs. Vous escaladez **une ligne**, avec l'impact et les options.

Forme courte. « L'éditeur annonce trois semaines de retard. Impact : le pilote des quatre magasins ne filtre pas, la vague des quarante sort des six mois si on attend. Option A : fichier manuel du matin, Nadia, deux semaines, qualité moindre, date tenue. Option B : décaler le pilote, date finale menacée. Je recommande A, Inès accepte la promesse dégradée sur les quatre seulement. Décision demandée lundi. »

Claire peut refuser A. Elle ne peut pas découvrir le retard en mois 5. Escalader trop tard est la faute. Escalader trop tôt, sans parade proposée, lui rend votre inquiétude au lieu d'une décision.

Un risque accepté s'écrit aussi. « On accepte que le motif de refus soit incomplet pendant deux semaines. Hugo prévient les pilotes. Revue le 20. » Accepter n'est pas oublier. La date de revue reste.

# Trois lignes du projet Halte

Le registre de cette semaine pourrait tenir en trois lignes. Pas davantage dans la page sponsor. Le détail reste dans le fichier.

1. **Flux éditeur en retard** (risque). Probable, impact fort. Parade : fichier manuel avant 8 h sur les quatre pilotes, Nadia, essai vendredi. Propriétaire Nadia. Vous escaladez si vendredi échoue.
2. **Transporteur qui rate le passage** (risque). Possible, impact fort sur la promesse J+2. Parade : Chloé rend la pénalité exigible et obtient le fichier à 16 h. Revue dans deux semaines. Pas encore un problème : cette semaine, les passages tenus.
3. **Nantes, vingt retraits sur stock faux** (problème, sorti du registre). Contenir : retrait du jour coupé sur ce magasin jusqu'au flux du matin. Karim l'a dit au directeur. Clôture quand une journée entière se passe sans retrait impossible. La cause (stock faux) reste un risque sur les autres magasins, avec la parade du fichier manuel. On ne confond pas la cause encore possible ailleurs et le dégât déjà là à Nantes.

Cette troisième ligne est celle que les équipes oublient de sortir. Elle reste « risque Nantes » alors que les clients sont déjà en route. Votre geste de project manager : couper le mot risque dès que le fait est daté.

> [!WARNING]
> Un registre figé le jour du lancement, relu « s'il reste du temps » en comité, n'est pas un registre. C'est une archive de ce qui vous faisait peur en mars.

# Exercices

## Exercice 1 : Risque ou problème ?

Classez ces trois phrases et dites le premier geste. A. « L'éditeur pourrait glisser de trois semaines, la date n'est pas encore dépassée. » B. « Nantes a honoré vingt retraits impossibles depuis lundi. » C. « Un directeur craint que les équipes magasin n'aiment pas la nouvelle liste. »

<details>
<summary>Voir la solution</summary>

A est un risque. Probable ou possible selon les signaux, impact fort. Parade à écrire (fichier manuel sur les quatre pilotes), propriétaire Nadia, date de revue. On ne coupe pas encore les magasins.

B est un problème. On sort la ligne des risques. Geste du jour : couper le retrait du jour à Nantes, Karim prévient le directeur, Hugo a le motif. Clôture quand une journée se passe sans nouveau retrait impossible. Le stock faux des autres magasins peut rester un risque, distinct.

C n'est pas encore un risque. C'est une crainte sans événement ni conséquence sur la date, l'enveloppe ou la promesse. Vous demandez ce qui se passerait de constatable. Sans réponse, vous ne l'inscrivez pas. Le registre n'est pas le recueil des inquiétudes.

</details>

## Exercice 2 : Réécrire une fausse parade

La ligne dit : « Risque transporteur. Probabilité 35 %. Impact élevé. Parade : rester vigilant et suivre de près. Propriétaire : l'équipe. » Réécrivez-la pour qu'elle soit tenable lundi.

<details>
<summary>Voir la solution</summary>

« Transporteur rate le passage sur un pilote. Probabilité : possible (aucun raté cette semaine, le fichier arrive encore à 18 h). Impact : fort, la promesse J+2 ne tient pas et le pilote perd la confiance du magasin.

Parade : Chloé obtient le fichier à 16 h d'ici mardi et confirme par écrit la pénalité si un passage est manqué. Vérification au daily de mardi par Marc pour l'heure du fichier, par vous jeudi si l'heure a sauté.

Propriétaire : Chloé. Vous escaladez vers Claire seulement si le transporteur refuse l'horaire ou la pénalité. »

« 35 % », « rester vigilant » et « l'équipe » sont barrés. Une personne, un fait, une date.

</details>

## Exercice 3 : La revue du lundi

Vous avez quatorze lignes. Huit n'ont pas été relues depuis le lancement, il y a six semaines. Deux sont des problèmes déjà en cours (Nantes, et un fichier client incomplet signalé par Hugo). Quatre sont de vraies incertitudes. Comment tenez-vous les trente minutes ?

<details>
<summary>Voir la solution</summary>

Vous n'essayez pas de relire les quatorze. Vous sortez d'abord les deux problèmes du registre : ils ont un geste et un propriétaire ailleurs (Nantes avec Karim, fichier client avec Hugo et Inès). Vous archivez, en séance, les lignes sans signal et sans impact fort parmi les huit abandonnées, ou vous en gardez une seule si l'impact serait de sortir des six mois.

Restent les quatre incertitudes, plus éventuellement une ligne rescapée. Trente minutes suffisent : signal, parade, date. Les lignes archivées restent lisibles, elles ne s'affichent plus comme ouvertes. Vous notez sur la page sponsor une ligne de risque et les problèmes à part. Un registre de quatorze peurs non relues ne se présente pas à Claire.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Risques et problèmes
center: "Le risque peut encore ne pas arriver. Le problème est déjà là. On ne les pilote pas dans la même colonne."
points:
  - icon: alert
    title: Risque
    text: "Incertain. Rare, possible ou probable. Impact sur la date, l'argent, la promesse, les magasins."
  - icon: zap
    title: Problème
    text: "Daté et constaté. On le sort du registre. Exemple : vingt retraits impossibles à Nantes."
  - icon: shield
    title: Parade
    text: "Éviter, réduire, transférer ou accepter. « Rester vigilant » ne se fait pas lundi matin."
  - icon: users
    title: Un propriétaire
    text: "Une personne qui agit. Vous tenez le registre. Vous n'héritez pas de toutes les lignes."
  - icon: loop
    title: Registre vivant
    text: "Revue le lundi, date sur chaque ligne. Une ligne non relue depuis un mois est morte."
pitfall: "Laisser Nantes dans les risques alors que les clients sont déjà partis chercher un article absent."
remember: "Quatre colonnes suffisent : probabilité, impact, parade, propriétaire. Et une date de revue."
```
