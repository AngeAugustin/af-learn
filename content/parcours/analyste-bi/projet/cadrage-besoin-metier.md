---
title: Cadrer un besoin métier
description: "Un atelier court pour fixer la décision, les indicateurs, le grain, les utilisateurs et le hors périmètre, avant d'ouvrir l'outil."
duration: 45
objectives:
  - Animer un atelier qui part de la décision, pas de la liste des colonnes
  - Choisir peu d'indicateurs et le grain qui les rend justes
  - Nommer les utilisateurs, leurs droits et ce qu'ils feront du chiffre
  - Écrire le hors périmètre pour protéger le délai
---

# L'atelier avant l'outil

Le cadrage est un **atelier**, pas un cahier des charges de quarante pages rédigé seul. Une heure et demie à deux heures suffisent si les bonnes personnes sont là : celui qui décidera, celui qui connaît les cas limites (souvent la finance ou le contrôle de gestion), et l'analyste qui devra le construire. La plateforme vient seulement si la question est déjà « à quelle heure les données existent ».

On n'ouvre pas l'outil pendant l'atelier. On écrit sur un tableau. L'outil attire trop tôt vers les colonnes disponibles, et l'on oublie la décision.

Le compte rendu tient sur **une page**, envoyée le jour même, avec les désaccords encore ouverts. Un désaccord caché (« on verra ») revient au moment de certifier, quand c'est le plus cher.

```diagram
type: flow
title: "Le fil de l'atelier"
steps:
  - title: Décisions
    text: "Quelles phrases la page doit permettre de conclure"
    tone: violet
  - title: Indicateurs
    text: "Peu de mesures, chacune avec sa cible"
    tone: blue
  - title: Grain
    text: "Jusqu'où l'on descend sans changer le sens"
    tone: teal
  - title: Utilisateurs
    text: "Qui ouvre, qui décide, qui ne voit pas tout"
    tone: amber
  - title: Hors périmètre
    text: "Ce que l'on ne fera pas dans ce tour"
    tone: rose
```

S'il manque le décideur, on reporte. Cadrer avec des représentants qui ne pourront pas tenir le contrat produit un modèle que la revue refusera.

# Les décisions

On demande des **décisions**, pas des thèmes. « Avoir de la visibilité sur les ventes » n'est pas une décision. « Chaque lundi, maintenir ou non la promo de la région en retard de marge » en est une.

Pour chaque décision, cinq lignes :

- **qui** décide ;
- **quand** (le lundi 9 h, pas « en continu » sans que ce soit vrai) ;
- **sur quoi** l'on tranche (un oui, un non, un report) ;
- **quel coût** si le chiffre est faux ou en retard ;
- **quelle page** portera cette décision (souvent une seule).

Deux décisions incompatibles sur la même page (le comité mensuel et l'appel magasin du matin) se séparent ici, pas après la maquette. L'atelier a le droit d'en **retirer**. Une troisième décision « tant qu'on y est » est le premier symptôme d'un projet qui n'aura pas de fin.

On fait relire les phrases par le décideur avant de passer aux indicateurs. S'il les reformule complètement, on n'avait pas la bonne question. On recommence ce bloc, on ne bricole pas les graphiques en aval.

# Les indicateurs

Chaque décision appelle peu d'indicateurs. On vise ceux qui **changeraient la décision** s'ils bougeaient. Le reste est de la curiosité, utile peut-être, pas dans ce tour.

Pour chaque indicateur retenu, le contrat minimal se note dans l'atelier, même s'il sera précisé ensuite :

- le nom prononcé en revue ;
- la cible (objectif, N-1, seuil) ;
- ce qui est dedans et dehors, en une phrase ;
- le propriétaire du sens.

Exemple pour un réseau de magasins d'ameublement, enseigne fictive Atelier Nord : CA HT, marge commerciale, panier, écart à l'objectif, écart à N-1, taux de rupture. Six noms. Pas « et aussi le NPS, la météo, le détail vendeur ». Si le taux de rupture ne change aucune des décisions écrites, il sort, même s'il est à la mode.

On marque les indicateurs **déjà certifiés** ailleurs. Les réutiliser est le cas normal. En créer un nouveau est un coût (contrat, contrôle, revue), pas un réflexe.

> [!WARNING]
> « On prendra toutes les colonnes, on triera après » n'est pas un cadrage. C'est un report. L'atelier qui sort sans liste courte n'a pas fini.

# Le grain

Le **grain** est le niveau le plus fin auquel la décision regarde encore le chiffre : mois et magasin, jour et référence, ticket. Il commande le modèle. Un grain trop fin alourdit tout. Un grain trop gros interdit la question (« quels magasins ? » si l'on n'a que la région).

On le fixe avec des phrases de refus :

- « Pas le ticket pour la page de direction. Le ticket est une annexe ou une autre page. »
- « L'objectif est au mois et au magasin. On ne l'invente pas au jour. »
- « Le panier se calcule au grain de la question, on ne stocke pas un panier déjà moyenné par jour pour le resommer. »

On note aussi le **historique** utile (quatorze mois pour voir N-1, pas dix ans « au cas où ») et la **fraîcheur** (la veille à 7 h suffit au lundi ; le matin du magasin, lui, veut le stock du jour). Deux fraîcheurs veulent souvent dire deux usages, pas un modèle unique poussé à la minute pour tout le monde.

Le grain se teste avec un exemple chiffré minuscule. Deux tickets, deux familles. Si les participants ne sont pas d'accord sur le panier de cet exemple, ils ne sont pas d'accord sur l'indicateur. Mieux vaut le découvrir dans l'atelier.

# Les utilisateurs

On nomme des **rôles**, pas « tout le siège ». Pour chacun : ce qu'il décide ou fait, ce qu'il a le droit de voir, à quelle fréquence il ouvre.

| Rôle | Geste | Périmètre | Rythme |
| --- | --- | --- | --- |
| Direction réseau | Arbitrer promo et objectif | Toutes les régions | Lundi, 15 min |
| Directeur régional | Agir sur ses magasins | Sa région seulement | Deux fois par semaine |
| Contrôle de gestion | Tenir le contrat des indicateurs | Tout, y compris l'annexe | À la certification et sur alerte |
| Responsable magasin | Traiter ruptures et écart local | Son magasin | Le matin, si ce tour l'inclut |

Si le responsable magasin est dans la liste, la page du matin entre dans le périmètre, avec son grain. S'il n'y est pas, on ne dessine pas « quand même » son écran. Le directeur régional **ne voit pas** les autres régions : ce n'est pas un filtre de politesse, c'est un droit à prévoir dès le cadrage, pas la veille de la publication.

On désigne aussi qui **validera** la recette (le décideur ou son délégué nommé) et qui expliquera le chiffre en première revue. Un projet dont personne ne se dit utilisateur le jour de l'atelier n'a pas d'adoption à espérer.

# Le hors périmètre

Le hors périmètre protège la date. Il est aussi précis que le périmètre. « On verra plus tard » n'exclut rien.

Pour un premier tour Atelier Nord, on peut écrire :

- pas de comptabilité sociale, seulement la marge commerciale de pilotage ;
- pas les franchises ;
- pas le détail vendeur ni la paie ;
- pas d'application mobile magasin dans ce tour ;
- pas de prévision statistique, seulement l'objectif déjà voté ;
- pas de modification du contrat CA : on prend la métrique certifiée si elle existe.

Chaque élément retiré a un **endroit** où il vivra s'il revient (un second projet, une explore, un rapport paginé). Le demandeur entend que ce n'est pas un oubli. On lui donne le critère de reprise : « le détail vendeur si la revue lundi a tenu quatre semaines sur le grain magasin ».

> [!TIP]
> Relisez la page de cadrage en cherchant les mots « complet », « temps réel », « toutes les données ». S'ils sont encore là sans décision associée, rayez-les avant d'envoyer.

Le cadrage se termine par une date de recette et le contenu de cette recette : trois totaux de contrôle, une page, un jeu de droits. Pas par une promesse de « dashboard complet ».

# Exercices

## Exercice 1 : Réécrire la demande

Mail reçu : « Bonjour, il nous faudrait un dashboard complet, temps réel, toutes les données magasins, pour la direction et les équipes, dès que possible. » Animez les questions d'atelier et proposez une reformulation en décisions.

<details>
<summary>Voir la solution</summary>

Questions : quelle décision lundi matin, quelle décision le reste de la semaine, que se passe-t-il si le chiffre a un jour de retard, qui n'a pas le droit de voir les autres régions, quels indicateurs changeraient vraiment le choix.

Reformulation possible : « Chaque lundi, la direction réseau décide si la promo de la région la plus en retard de marge est maintenue. Indicateurs : CA HT versus objectif et versus N-1, marge, panier. Fraîcheur : J-1 à 7 h, pas le temps réel. Les directeurs régionaux voient leur région. Le détail ticket, les franchises et le temps réel sont hors de ce tour. »

« Complet » et « toutes les données » sont rayés. « Dès que possible » devient une date de recette.

</details>

## Exercice 2 : Le grain qui ne colle pas

Le comité veut le panier par famille de produits, et aussi « le » panier du réseau, sur la même carte, même formule. Deux tickets d'exemple ne donnent pas le même nombre selon le découpage. Que notez-vous au cadrage ?

<details>
<summary>Voir la solution</summary>

On sépare deux indicateurs. Le **panier réseau** est le CA divisé par le nombre de tickets, au grain de la question globale (mois, région, magasin). Le découpage par famille **n'est pas** ce panier : un ticket multi-familles serait compté plusieurs fois. On le nomme autrement (montant de la famille, ou part), ou on le sort de la page.

Le grain le plus fin de la page direction reste le magasin et le mois pour l'objectif. La famille est un axe d'explication, pas une redéfinition du panier. L'exemple à deux tickets est collé dans le compte rendu, pour que la recette s'y réfère.

</details>

## Exercice 3 : Tenir le hors périmètre

En fin d'atelier, un participant ajoute : détail par vendeur, application magasin, prévision par intelligence artificielle, et les franchises « sinon c'est incomplet ». La date de recette est dans trois semaines. Que gardez-vous, et comment le dites-vous ?

<details>
<summary>Voir la solution</summary>

On garde le tour qui sert la décision du lundi : intégrés, indicateurs convenus, page direction, droits par région. Le reste est écrit en hors périmètre, avec une porte de reprise.

- Vendeur et paie : rapport à part, plus tard, question de droit différente.
- Application magasin : autre projet, autre rythme (le matin), pas la même page.
- Prévision : hors tour, l'objectif voté suffit.
- Franchises : seulement si le contrat CA les inclut déjà. Sinon c'est un changement de métrique, pas une case à cocher.

« Incomplet » ne fait pas entrer un sujet. On montre la phrase de décision : tant qu'elle tient sans ces ajouts, ils attendront. La page de cadrage part le jour même avec cette liste.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Cadrer le besoin
center: "Une page d'atelier : décisions, indicateurs, grain, utilisateurs, et ce que l'on ne fera pas."
points:
  - icon: target
    title: Décisions
    text: Une phrase que quelqu'un tranchera à une heure dite. Pas « de la visibilité ».
  - icon: gauge
    title: Peu d'indicateurs
    text: Ceux qui changeraient le choix. On réutilise une métrique déjà certifiée.
  - icon: layers
    title: Le grain
    text: Le niveau le plus fin encore utile. Un exemple à deux tickets lève les faux accords.
  - icon: users
    title: Les rôles
    text: Qui décide, qui ne voit que sa région, qui valide la recette.
  - icon: alert
    title: Hors périmètre
    text: Franchises, temps réel, « complet ». Écrit, avec une porte de reprise.
pitfall: Ouvrir l'outil dans l'atelier. On suit les colonnes disponibles et l'on perd la décision.
remember: Sans le décideur dans la salle, on reporte. Un contrat que personne ne tient ne sert pas.
```
