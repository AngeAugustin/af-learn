---
title: "Le métier de business analyst"
description: "Traduire le besoin de réception de Halte Marché en processus, exigences, critères et recette que le magasin peut signer."
duration: 55
objectives:
  - "Situer le business analyst comme traducteur du besoin en exigences recettables"
  - "Nommer les quatre livrables : processus, exigences, critères et recette"
  - "Partir des faits du quai avant de parler d'un écran ou d'un calendrier"
  - "Laisser le planning à Hugo Pennec et la roadmap produit à Sarah Nguyen"
---

# Traduire le besoin, le rendre recettable

Halte Marché est une enseigne alimentaire de quarante magasins intégrés. Le sujet qui vous est confié est la réception des marchandises en magasin : le sec, le frais, le surgelé. Le lundi, entre 5 h 30 et 9 h 30, un magasin type décharge 36 palettes. Sur le réseau, cela fait 1 440 palettes dans la même plage. Jonas Keller, responsable supply magasins, dit que le frais rejoint le rayon trop tard et que l'écart de stock du soir ne raconte pas ce qui s'est passé au quai. Amina Sorel, directrice des opérations et sponsor, vous demande de rendre ce besoin clair.

Votre métier est de traduire. Vous partez de ce que le quai vit, et vous le rendez assez précis pour qu'on puisse le recetter. Traduire, ici, produit des phrases que le métier reconnaît et que Nina Vidal, la testeuse, peut jouer sans vous demander ce que « mieux » voulait dire.

Quatre questions guident le travail.

- **Quoi.** Quel résultat Halte Marché attend de la réception, en mots de magasin.
- **Comment on le sait.** Quel geste, quelle règle, quelle exception rendent ce résultat vrai.
- **À quoi on le reconnaît.** Quel critère, sur un cas chiffré, se répond par oui ou par non.
- **Qui signe.** Jonas pour le besoin, Amina quand le cap ou une règle de réseau change, vous pour la forme et la trace.

Hugo Pennec, project manager, tient le planning : jalons, charge, ordre des magasins. Sarah Nguyen, product manager de l'outil magasin, tient la roadmap produit : étiquettes électroniques au prochain trimestre, inventaire tournant au trimestre suivant. Vous leur remettez un besoin recettable. Le calendrier et l'ordre des sujets produit ont déjà un responsable.

> [!IMPORTANT]
> Une exigence décrit ce que la réception doit permettre de constater. Le moyen vient après. Ce moyen peut être une procédure, un geste de quai, ou un changement d'outil. Vous le nommez quand le métier l'a déjà choisi. Vous ne le choisissez pas pour aller plus vite.

```video
url: https://www.youtube.com/watch?v=STVRW9UzS48
title: "Business Analysis Explained in Under 10 Minutes"
channel: "David McLachlan"
duration: "9:29"
lang: en
why: "L'analyse métier expliquée en moins de dix minutes : le rôle, les livrables et la place dans un projet."
```

# Quatre livrables

Le business analyst de Halte Marché est jugé sur quatre livrables. Chacun a un lecteur. Chacun peut être faux si les autres manquent.

**Le processus.** La réception telle qu'elle se déroule : ce qui la déclenche, les étapes, qui agit, avec quel outil, et ce qui se passe quand ça déraille. Pauline Roux, directrice du magasin de Rouen, doit s'y reconnaître. Un dessin qui ne parle que du terminal « Quai » rate les sept magasins qui n'ont que le bon papier.

**Les exigences.** Des phrases courtes, une idée par phrase, du type qui convient : métier, fonctionnelle, non fonctionnelle, contrainte ou règle. « Le lundi, le frais accepté est en rayon en moins de 4 heures après la fin du déchargement. » Jonas peut dire si cette phrase est la sienne. « La réception doit être fluide » n'a pas de contraire observable. Personne ne la recettera.

**Les critères.** La façon de jouer l'exigence sur un cas. Un chiffre, un rôle, un échec explicite. Nina coche oui ou non. « Le magasin est à l'aise » ne se coche pas.

**La recette.** Le moment où les critères sont joués pour de vrai, au quai ou sur un jeu de cas fidèle, et où le métier dit tenu ou écart. Vous préparez ce que l'on joue et ce que l'on conclut. Nina conduit le jeu. Jonas conclut pour le métier. Le tampon final a leur nom, pas le vôtre seul.

| Livrable | Question à laquelle il répond | Qui le reconnaît |
| --- | --- | --- |
| Processus | Que se passe-t-il vraiment au quai ? | Pauline, Yassine, Jonas |
| Exigences | Que doit-on pouvoir constater ? | Jonas, et Amina si la règle change |
| Critères | Comment sait-on que c'est tenu ? | Nina, puis Jonas |
| Recette | Le constat a-t-il été joué ? | Jonas pour le fond, Nina pour le jeu |

Ces quatre pièces restent liées. Une exigence sans processus oublie le chauffeur qui repart. Un critère sans exigence devient une liste de gestes sans but. Une recette sans critère se termine par « globalement, ça va ».

# Le quai du lundi, avant l'écran

Avant d'écrire, vous passez un lundi à Rouen. Rouen fait partie des sept magasins qui saisissent le soir, à partir du bon papier. Yassine Haddad, équipier réception, décharge et note les refus sur un carnet noir. Claire Dumont, cheffe de rayon frais, appelle vers 10 h pour savoir ce qui a été refusé. Pauline corrige le stock le soir pour que les chiffres tombent. Thomas Girard, à l'entrepôt, reçoit les appels sans pièce écrite du refus.

Vous notez des faits.

- Fin de déchargement observée : 9 h 10. Dernier frais de cette livraison en rayon : 14 h 35. Écart : 5 h 25, proche de la médiane réseau du frais le lundi, 5 h 20.
- Deux palettes de surgelé mesurées à -16 °C. Le carnet dit « un peu mou ». La règle écrite du siège refuse au-dessus de -18 °C. Les palettes sont parties en chambre froide.
- Onze lignes du bon ne correspondent pas au physique. Quatre seulement seront saisies le soir. Les sept autres restent dans le carnet.

Ces faits alimentent le processus et les exigences. Ils ne vous donnent pas le droit d'annoncer que le carnet sera remplacé par une application. Sarah n'a pas inscrit la réception dans la roadmap. Hugo n'a pas de jalon à vous souffler. Omar Diop, l'architecte du système magasin, n'a pas encore dit ce que le réseau tient le lundi matin. Votre livraison, à ce stade, est une photo juste et des phrases testables.

> [!WARNING]
> Le premier dessin qui contient un bouton a déjà choisi une solution. Revenez au quai : qui fait quoi, avec quoi, et qu'est-ce qui casse le lundi.

# Ce que vous tenez, ce que d'autres signent

Vous tenez la qualité de la traduction. Une exigence a un type, un propriétaire, une source, un statut, un critère. Vous refusez une phrase sans propriétaire. Vous refusez un critère que Nina ne peut pas jouer. Vous signalez quand deux magasins n'appliquent pas la même règle.

D'autres signent le fond.

- Le besoin et la règle de réception : Jonas.
- Le cap, les moyens, l'arbitrage entre régions : Amina.
- Les dates, la charge, l'ordre des magasins : Hugo.
- L'entrée éventuelle dans l'outil magasin, et son rang dans la roadmap : Sarah.
- La tenue du pic sur le réseau et le terminal : Omar.
- Le jeu des cas : Nina.

En atelier, la phrase utile est : « Je peux l'écrire proprement. La validation a votre nom. » Vous dites ensuite qui valide, et sur quel point. Sans ce nom, la phrase reste un brouillon, même si elle sonne bien.

Le dossier d'exigences peut citer une date que Hugo a déjà posée, pour savoir quand la recette se joue. Il ne devient pas un planning. Il peut décrire un résultat que l'outil devra permettre, si Sarah a accepté de le porter. Il ne devient pas une roadmap.

# De la phrase jusqu'à la recette

Reprenons un fait du lundi de Rouen et suivons-le jusqu'au bout de votre métier.

Exigence métier, propriétaire Jonas : « Le lundi, le frais accepté est en rayon en moins de 4 heures après la fin du déchargement. »

La phrase dit le résultat. Jonas suit déjà le délai, et la cible de 4 heures est la sienne : la médiane actuelle du frais le lundi est 5 h 20. Le critère se joue sur une livraison. On note l'heure de fin de déchargement et l'heure où la dernière pièce de frais acceptée est en rayon. Au-delà de 4 heures, le critère est en échec. Une palette refusée ne compte pas dans « accepté ». Si le critère oublie ce mot, Yassine le fera échouer en refusant un produit abîmé, alors que la phrase parlait d'autre chose.

La recette rejouera ce critère sur un vrai lundi, avec Nina au quai et Jonas qui conclut. Hugo peut avoir placé ce lundi dans son calendrier. La date est à lui. Le critère est à vous, avec Jonas. Sarah peut conclure que l'outil n'y est pour rien et qu'une procédure de quai suffit. L'exigence reste la même dans les deux cas : elle parle du frais en rayon, pas du logiciel.

Vous rangez la phrase, sa source (le lundi observé, l'indicateur de Jonas), son statut (proposée, tant que Jonas ne l'a pas validée) et le critère. C'est le geste central du métier. La suite du parcours détaille chaque livrable. Le cap reste celui-ci : la réception de Halte Marché doit pouvoir être recettée.

```diagram
type: flow
title: "Du quai jusqu'à la recette"
steps:
  - title: "Besoin"
    text: "Ce que le quai vit et ce que Jonas mesure déjà"
    tone: violet
  - title: "Processus"
    text: "Déclencheur, étapes, rôle, outil, exception"
    tone: blue
  - title: "Exigences"
    text: "Une phrase, un type, un propriétaire, un statut"
    tone: teal
  - title: "Critères"
    text: "Un cas chiffré que Nina peut jouer"
    tone: amber
  - title: "Recette"
    text: "Le métier dit tenu ou écart sur le cas joué"
    tone: rose
```

# Exercices

## Exercice 1 : L'écran demandé trop tôt

Après le lundi à Rouen, Sarah vous écrit : « Pour avancer, décrivez l'écran de saisie quai que l'outil magasin devrait avoir au prochain trimestre. » La roadmap de ce trimestre porte déjà les étiquettes électroniques. Que répondez-vous, et que livrez-vous quand même ?

<details>
<summary>Voir la solution</summary>

Vous ne dessinez pas l'écran. Le rang des sujets dans l'outil appartient à Sarah. Un écran choisirait le moyen avant que le besoin soit recettable, et il bousculerait une roadmap déjà tenue.

Vous livrez le processus observé à Rouen et des exigences que Jonas peut reconnaître, chacune avec un critère jouable. Sarah décidera si l'outil porte ce besoin, et à quel moment. Hugo placera les dates si un travail est lancé. Vous pouvez proposer la phrase et sa source. Vous ne promettez pas un écran pour le trimestre des étiquettes.

</details>

## Exercice 2 : Le mot fluide

Jonas dit en réunion : « L'exigence, c'est que la réception soit enfin fluide pour les équipes. » Amina approuve d'un signe. Que faites-vous de cette phrase avant de la ranger dans le dossier ?

<details>
<summary>Voir la solution</summary>

Vous ne la recopiez pas comme exigence. « Fluide » ne se constate pas : Nina ne peut pas cocher oui ou non, et personne ne signerait le contraire.

Vous revenez aux faits déjà connus. Le frais le lundi est à 5 h 20 de médiane, Jonas parle de moins de 4 heures, des lignes du bon ne sont pas saisies. Vous proposez une phrase que Jonas peut assumer, par exemple celle du délai du frais, et vous lui demandez de la valider. « Fluide » reste un mot de réunion. Il ne devient pas une ligne du dossier.

</details>

## Exercice 3 : La date dans le dossier

Hugo annonce un lundi de constat à Rouen le 12 mars. Il vous demande de « figer le planning des quatre livrables » dans le dossier d'exigences. Où passe la limite de votre rôle ?

<details>
<summary>Voir la solution</summary>

Le 12 mars est une date de chemin. Elle appartient à Hugo, avec Amina si elle déplace des moyens de magasin. Votre dossier peut la citer comme cadre reçu, pour savoir quand les critères seront joués.

Vous ne figez pas de planning dans le dossier : pas de jalons, pas de charges, pas d'ordre des autres magasins. Vos livrables restent le processus, les exigences, les critères et la préparation de la recette. Si le 12 mars est intenable parce qu'un critère n'est pas jouable, vous le dites à Hugo avec le fait. Vous ne réécrivez pas son calendrier.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Le métier de business analyst"
center: "Le business analyst traduit le quai en exigences que l'on peut recetter."
points:
  - icon: compass
    title: "Traduire"
    text: "Du vécu magasin vers des phrases précises. Le moyen vient après la phrase."
  - icon: list
    title: "Quatre livrables"
    text: "Processus, exigences, critères, recette. Chacun a un lecteur qui peut le contredire."
  - icon: clock
    title: "Quai du lundi"
    text: "36 palettes, frais autour de 5 h 20. Les faits précèdent l'écran et le calendrier."
  - icon: users
    title: "Qui signe"
    text: "Jonas porte le besoin, Amina le cap. Hugo le planning, Sarah la roadmap."
  - icon: test
    title: "Recetter"
    text: "Nina joue un cas chiffré. Le métier dit tenu ou écart. Vous tenez la forme."
pitfall: "Dessiner un écran de saisie pour aller vite, avant que Jonas ait reconnu une exigence."
remember: "Vous rendez le besoin recettable. Le planning et la roadmap produit ont déjà un responsable."
```
