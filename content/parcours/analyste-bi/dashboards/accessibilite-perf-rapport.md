---
title: Accessibilité et performance du rapport
description: "Rendre le rapport lisible sans dépendre de la couleur seule, navigable au clavier, et rapide grâce à un modèle léger et au bon mode d'accès."
duration: 45
objectives:
  - Rendre les écarts compréhensibles sans s'appuyer seulement sur la couleur
  - Prévoir un ordre de tabulation et des textes utiles aux lecteurs d'écran
  - Alléger un modèle en agrégeant en amont plutôt que dans chaque visuel
  - Choisir à l'intuition entre import et interrogation directe
---

# Lisible par tous, pas seulement par vous

Un rapport que seule une personne bien voyante, sur un grand écran, dans le calme, arrive à lire, n'est pas terminé. L'accessibilité n'est pas une couche de peinture en fin de projet. C'est un critère de la même famille que le chiffre juste : si une partie des lecteurs ne peut pas l'utiliser, la décision ne les atteint pas.

Pensez à trois situations concrètes :

- la revue projetée dans une salle trop claire, où les gris se confondent ;
- un directeur qui parcourt la page au clavier, sans souris ;
- un daltonien pour qui le rouge et le vert de votre écart se ressemblent.

Le but n'est pas d'ajouter un mode « spécial ». Le but est une page qui reste claire dans ces trois situations, sans version parallèle.

# Pas seulement la couleur

La couleur peut renforcer un message. Elle ne doit pas être **le seul** support. « En rouge, c'est grave » exclut ceux qui ne distinguent pas cette rouge, et ceux qui impriment en noir et blanc.

Ce qui double la couleur :

- un **signe** (plus, moins, flèche) à côté de l'écart ;
- un **mot** (« au-dessus », « alerte ») ou la valeur du seuil écrite ;
- une **forme** différente (trait plein et trait pointillé, pas seulement deux teintes) ;
- un **texte de remplacement** sur les visuels qui portent une information.

Le contraste entre le texte et le fond doit rester confortable. Un gris clair sur fond blanc, très « élégant » sur une maquette, disparaît au projecteur. Préférez un texte foncé sur fond clair pour les chiffres de verdict, et testez la page en la passant en niveaux de gris : si l'écart n'est plus visible, la couleur travaillait seule.

> [!IMPORTANT]
> Le rouge et le vert ne suffisent pas à dire l'alerte. Écrivez le seuil et le sens. La couleur vient en plus.

# L'ordre de tabulation

Beaucoup de lecteurs, et tous les lecteurs d'écran, parcourent la page dans l'**ordre de tabulation**, pas dans l'ordre où votre regard de concepteur se promène. Si cet ordre est le hasard de la création (le logo, puis un graphique du bas, puis le chiffre principal), la page est incohérente dès qu'on quitte la souris.

Règles simples :

1. Le focus suit l'ordre de lecture : titre et fraîcheur, filtres, cartes de verdict, graphique d'explication, liste d'exceptions.
2. Les éléments décoratifs (formes, images de fond) ne prennent pas le focus.
3. Chaque filtre a un nom compréhensible (« Mois », pas « Slicer 7 »).
4. Le texte alternatif du visuel principal dit le message, pas « graphique 1 » : « Marge du mois à 41 %, soit 2 points sous l'objectif, surtout à cause de l'Ouest. »

Vérifiez en parcourant la page avec la touche tabulation, de haut en bas. Si vous ne savez plus où vous êtes, l'ordre est à reprendre. Ce contrôle prend dix minutes et évite une page inutilisable en réunion sans souris, ou avec une loupe d'écran.

# Un modèle trop lourd

La performance perçue, c'est le temps entre le clic et le chiffre. Une page lente n'est pas « riche ». Elle est abandonnée, ou on l'exporte vers un classeur plus nerveux, et le classeur devient la nouvelle source.

Les symptômes d'un modèle lourd :

- plusieurs dizaines de secondes au premier affichage ;
- un clic sur un filtre qui relance toute la page ;
- une taille de fichier qui enfle à chaque ajout de colonne « au cas où » ;
- des mesures qui parcourent le détail ticket par ticket pour afficher un mois.

Causes fréquentes, côté rapport :

- des colonnes importées que aucun visuel n'utilise ;
- un grain trop fin (la ligne de ticket) alors que la page parle au mois et au magasin ;
- des calculs visuels qui recomptent des jointures coûteuses à chaque filtre ;
- quinze visuels qui posent chacun une question large au modèle.

> [!WARNING]
> Ajouter de la mémoire à la machine du lecteur ne répare pas un modèle qui agrège trop tard. Le travail doit être fait avant le clic.

# Agréger en amont

**Agréger en amont**, c'est préparer la table au grain de la question, dans l'entrepôt ou dans la requête de chargement, plutôt que de laisser chaque visuel résumer des millions de lignes.

La page « marge mensuelle par magasin » n'a pas besoin des lignes de ticket. Une table déjà sommée (mois, magasin, famille, chiffre, marge, quantités) répond vite et pèse peu. Le détail ticket reste disponible pour la page qui en a vraiment besoin, pas pour toutes.

Repères :

- le grain du modèle de la page comité est celui de ses filtres les plus fins, pas celui de la caisse ;
- les colonnes non utilisées sortent du chargement ;
- les mesures simples (sommes, comptages) s'appuient sur des colonnes déjà additives ;
- un rapport « détail » séparé, plus lourd, sert l'exploration rare, pas la revue du lundi.

On y gagne trois fois : le clic est plus court, le chiffre est plus stable (la règle d'agrégation est écrite une fois), et le modèle se comprend. Une table de faits mensuelle dont on peut expliquer chaque colonne vaut mieux qu'un clone de la base opérationnelle.

# Import ou interrogation directe, à l'intuition

Deux modes d'accès dominent. L'**import** charge les données dans le modèle, selon un rythme (la nuit, toutes les heures). L'**interrogation directe** (DirectQuery) interroge la source à chaque clic.

```diagram
type: compare
title: "Import ou interrogation directe"
columns:
  - title: Import
    tone: teal
    items:
      - "Les données vivent dans le modèle"
      - "L'affichage est en général rapide"
      - "La fraîcheur suit l'actualisation"
      - "Adapté au pilotage quotidien ou mensuel"
      - "On agrège avant de charger"
  - title: Interrogation directe
    tone: amber
    items:
      - "Chaque clic interroge la source"
      - "Le chiffre est celui de l'instant"
      - "La source doit encaisser la charge"
      - "Les visuels sont souvent plus lents"
      - "Les transformations restent limitées"
  - title: Le bon réflexe
    tone: violet
    items:
      - "Page de cap : import d'un agrégat"
      - "Besoin minute et source solide : direct"
      - "Dire la fraîcheur dans les deux cas"
      - "Ne pas interroger le détail ticket pour un mois"
      - "Un mode mixte seulement si l'on sait pourquoi"
```

L'intuition tient en une phrase. Si la décision supporte la fraîcheur de la dernière actualisation (ce matin, cette heure), **importez un jeu déjà agrégé**. Si la décision est fausse dès que le chiffre a dix minutes (file d'attente en entrepôt, stock critique à la minute) **et** que la source encaisse les requêtes, l'interrogation directe se justifie.

Choisir le direct « pour être toujours à jour » sur une page mensuelle de direction est un mauvais calcul : le comité n'a pas besoin de la minute, et il a besoin que la page s'ouvre. Choisir l'import pour un écran de quai rafraîchi en continu, sans le dire, donne une file d'attente déjà périmée.

Dans les deux modes, la fraîcheur s'écrit sur la page. L'import le rappelle par l'heure de chargement. Le direct le rappelle par l'heure de la source, qui n'est pas magiquement « maintenant » si la source elle-même a du retard.

# Exercices

## Exercice 1 : La page qui ne passe pas en gris

Une carte montre l'écart de marge uniquement par la couleur (vert si positif, rouge si négatif), sans signe ni valeur d'écart. Le seuil d'alerte rupture est un point orange, sans texte. En niveaux de gris, on ne distingue plus rien. Que modifiez-vous, sans ajouter de longs paragraphes ?

<details>
<summary>Voir la solution</summary>

- Sur la carte : la valeur de l'écart avec son signe (« −2,0 pts »), et un mot court (« sous l'objectif »). La couleur peut rester, elle n'est plus seule.
- Sur la rupture : écrire « alerte si au-dessus de 4 % » à côté du point, ou une icône plus un libellé. Le point orange seul ne suffit pas.
- Contraste : texte foncé sur fond clair, y compris pour les libellés de filtres. Vérifier au projecteur, pas seulement sur l'écran du concepteur.
- Contrôle : repasser la page en niveaux de gris. L'écart et l'alerte doivent rester compréhensibles.

</details>

## Exercice 2 : L'ordre de tabulation incohérent

En parcourant la page au clavier, le focus passe sur une forme décorative, puis sur le tableau du bas, puis sur le filtre « Slicer 7 », et seulement ensuite sur le chiffre d'affaires. Le texte alternatif du graphique dit « image ». Réordonnez.

<details>
<summary>Voir la solution</summary>

1. Retirer les formes décoratives de l'ordre de tabulation.
2. Enchaîner : titre, fraîcheur, filtre Mois, filtre Région, cartes de verdict, graphique d'explication, liste d'exceptions.
3. Renommer « Slicer 7 » en « Mois » (ou le vrai rôle du filtre).
4. Remplacer « image » par une phrase de message, du type « Chiffre d'affaires du mois à 2 % sous l'objectif, écart porté par l'Ouest ».
5. Rejouer la tabulation de bout en bout avant de publier.

</details>

## Exercice 3 : La page mensuelle qui lit les tickets

Le modèle importe toutes les lignes de tickets (trois ans, deux cents colonnes) pour une page qui affiche la marge par mois et par magasin. L'ouverture prend quarante secondes. Quelqu'un propose de passer toute la page en interrogation directe « pour aller plus vite ». Que décidez-vous ?

<details>
<summary>Voir la solution</summary>

On n'inverse pas le mode pour compenser un grain trop fin. On **agrège en amont** : une table au grain mois × magasin × famille, avec les sommes utiles, chargée en import. Les colonnes non utilisées sortent.

L'interrogation directe sur le détail ticket serait en général **plus lente**, et ferait porter la charge à la source à chaque ouverture de comité. Elle se justifierait pour une autre page, qui a besoin de la minute et d'une source dimensionnée.

La page comité affiche l'heure d'actualisation de l'agrégat. Le détail ticket, s'il reste nécessaire, vit dans un rapport séparé, pas dans les quarante secondes du lundi matin.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Accès et performance
center: Le chiffre se lit sans la couleur seule, et la page s'ouvre parce que le grain est le bon.
points:
  - icon: eye
    title: Pas que la couleur
    text: Signe, mot ou seuil écrit. Le gris et le projecteur doivent encore se comprendre.
  - icon: list
    title: Ordre du focus
    text: Tabulation dans l'ordre de lecture, noms de filtres clairs, texte alternatif utile.
  - icon: gauge
    title: Modèle léger
    text: Colonnes utiles, peu de visuels bavards, pas de détail ticket pour un mois.
  - icon: layers
    title: Agrégat en amont
    text: Sommer au grain de la question avant le clic, une fois, pas dans chaque visuel.
  - icon: zap
    title: Import ou direct
    text: Import pour le cap du jour. Direct seulement si la minute compte et si la source tient.
pitfall: Passer en interrogation directe un modèle trop fin rend la page plus lente, pas plus juste.
remember: La fraîcheur s'écrit sur la page, que les données soient importées ou lues en direct.
```
