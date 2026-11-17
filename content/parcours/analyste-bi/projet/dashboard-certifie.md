---
title: Maquetter et certifier le rapport
description: "De la maquette d'une page de direction aux contrôles de certification, à la sécurité par région et au plan d'adoption."
duration: 45
objectives:
  - Maquetter une page avant de la construire dans l'outil
  - Lister les contrôles qui conditionnent le badge
  - Prévoir la sécurité par région comme un critère de recette
  - Écrire un plan d'adoption sur les premières revues, pas seulement un mode d'emploi
---

# La maquette avant l'outil

La **maquette** est un dessin de la page, au crayon ou dans un cadre vide, avec les vrais noms d'indicateurs. Elle se juge en quinze secondes : voit-on le verdict, la cause, la demande implicite (« où agir »). On ne choisit pas les couleurs avant d'avoir placé les zones.

Pour Atelier Nord, page « Lundi, cap du mois » :

- **Bandeau** : titre, mois, « données à jour au … », filtre région (inutile pour un directeur régional s'il n'en a qu'une, utile pour la direction).
- **Tête** : CA HT et écart à l'objectif, marge € et taux, panier, petit écart N-1. Quatre cartes, pas dix.
- **Corps** : barres des régions (ou des magasins) triées par écart à l'objectif. C'est la cause.
- **Bas** : taux de rupture versus seuil 4 %, et la liste courte des magasins au-dessus du seuil. C'est l'action de la quinzaine.
- **Dehors** : tickets, familles décoratives, camembert, jauges.

On fait lire la maquette au décideur **avant** le branchement des données. Ses corrections coûtent un crayon. Les mêmes corrections dans l'outil coûtent une journée, et l'on hésite à les faire.

> [!TIP]
> Écrivez les libellés exacts des cartes (« CA HT vs objectif mensuel »). Un libellé faux sur la maquette devient un libellé faux en production, parce que personne ne le relit.

# Les contrôles de certification

Le badge du jeu (et, séparément, le droit de mettre la page dans l'application) repose sur une liste que l'on peut cocher. Pas sur une impression générale de « fini ».

Contrôles de **chiffre** :

- CA, marge, tickets, panier, N-1, objectif et taux de rupture du mois témoin égalent la fiche ;
- le même mois filtré sur une région retombe sur la somme des magasins de cette région ;
- l'objectif n'a pas été multiplié par les lignes ;
- un taux n'est pas une moyenne de taux.

Contrôles de **page** :

- une décision, une page, fraîcheur visible, périmètre en pied (« intégrés, hors franchises, HT ») ;
- les cartes utilisent les mesures du jeu, pas un calcul local ;
- le seuil de rupture est écrit, pas seulement coloré ;
- l'ordre de tabulation suit la lecture, les noms de filtres sont humains.

Contrôles de **tenue** :

- propriétaire nommé, date de revue, fiche de catalogue ;
- actualisation après l'heure réelle des sources, alerte en cas d'échec ;
- personne joignable le lundi à 8 h 30 si le chargement a échoué.

Un contrôle rouge **empêche** la publication large. On ne le transforme pas en « dette acceptée » sans que le décideur signe le risque. Signer « on publie quand même avec un CA faux » n'est en pratique jamais acceptable. Signer « on publie sans la liste des ruptures, elle viendra vendredi » peut l'être, si la décision du lundi ne portait que sur la marge.

# La sécurité par région

Le directeur de l'Ouest ne doit voir que l'Ouest, **y compris** s'il change le filtre, exporte, ou ouvre le détail. La maquette est la même pour tout le monde. Les lignes changent.

On le spécifie dans la recette, pas en post-scriptum :

- une table relie l'identifiant de connexion à une ou plusieurs régions ;
- la direction réseau n'a pas ce filtre, et ce rôle est nommé ;
- un identifiant absent ne voit aucune ligne ;
- le total affiché à Marie (Ouest) égale le contrôle région Ouest, pas le réseau.

On teste avec **son** compte, ou l'équivalent « voir en tant que ». Tester avec le compte administrateur ne prouve rien : l'administrateur voit tout, c'est précisément le risque.

Les cartes « part du réseau » ou « moyenne nationale » sont des **fuites** si on les ajoute sans le dire. Si la direction veut que l'Ouest se compare au réseau, cette comparaison est un choix écrit (une mesure autorisée à ignorer le filtre région). Sinon, on ne l'affiche pas. Le défaut est : Marie ne voit pas le CA des autres.

> [!WARNING]
> Un export Excel qui contourne la sécurité annule le travail. L'export doit partir du même modèle filtré, ou ne pas exister pour ce public.

# Le plan d'adoption

L'adoption ne s'ajoute pas après la livraison. Elle se planifie avec la date de publication. Pour Atelier Nord, quatre temps :

1. **Avant** : le décideur a vu la maquette et les totaux. Les directeurs régionaux savent que lundi on commentera cette page, plus la pièce jointe.
2. **Première revue** : quinze minutes, animateur, fraîcheur lue à voix haute, seulement les écarts. Le compte rendu cite le lien de l'application, pas une capture.
3. **Deux semaines** : permanence courte pour les « où est mon ancien chiffre ». On y répond par le contrat, pas par un classeur de secours.
4. **Revue de certification** : à la date prévue, on reconduit ou on retire. On regarde si des pièces jointes circulent encore.

On nomme un **parrain** métier (pas l'analyste seul) qui ouvre la page en séance. Si seul l'analyste y croit, la page mourra à son premier congé. Le parrain sait dire la phrase de périmètre (« hors franchises ») sans ouvrir l'annexe technique.

Le plan tient en une demi-page. Un plan d'adoption de vingt pages n'est pas lu, exactement comme un rapport de quarante pages.

# La fiche de publication

Le jour où l'on publie, la fiche accompagne le bouton. Elle reprend, en une fois :

- le jeu et la page, le mois témoin contrôlé ;
- l'heure d'actualisation et le responsable d'astreinte du lundi ;
- les rôles (réseau, région) et le nom de qui a rejoué le test Ouest ;
- le lien de l'application, pas celui de l'espace de travail ;
- ce qui est **hors** badge (une page brouillon laissée dans l'espace).

On publie d'abord en recette, avec deux utilisateurs réels (un réseau, un régional). Ils exécutent trois gestes : ouvrir, lire le CA, filtrer ou constater qu'ils ne peuvent pas voir l'autre région. Leurs remarques de libellé se corrigent avant l'application de production. Leurs remarques de « il me faudrait aussi les vendeurs » retournent au hors périmètre du cadrage, elles ne retardent pas le lundi sauf décision explicite.

# La revue de go-live

Le go-live n'est pas l'absence de bug technique. C'est le **premier lundi réel**. On le prépare comme une revue, pas comme une inauguration.

```diagram
type: pipeline
title: "De la maquette au premier lundi"
lanes:
  - title: Recette
    steps:
      - title: Totaux
        text: Mois témoin et une région
        tone: teal
      - title: Droits
        text: Compte Ouest rejoué
        tone: violet
  - title: Publication
    steps:
      - title: Application
        text: Pas l'espace atelier
        tone: blue
      - title: Fiche
        text: Heure, propriétaire, lien
        tone: amber
  - title: Adoption
    steps:
      - title: Parrain
        text: Ouvre la page en séance
        tone: rose
      - title: Suites
        text: Permanence, puis date de revue
        tone: teal
```

Après ce lundi, on note : le chiffre commenté était-il celui de l'application, la fraîcheur a-t-elle été dite, une décision a-t-elle été écrite. Si la salle est revenue à la pièce jointe, le go-live technique a réussi et l'adoption a échoué. C'est le deuxième problème le plus fréquent, et il se traite par le parrain et le retrait de l'envoi parallèle, pas par un graphique de plus.

# Exercices

## Exercice 1 : Lire une maquette trop pleine

La maquette montre : huit jauges, un camembert des familles, un tableau de 200 produits, le CA en petit en bas, pas de date, pas de seuil de rupture. Le décideur dit « c'est complet, on aime ». Que renvoyez-vous comme maquette, sans être désagréable ?

<details>
<summary>Voir la solution</summary>

On revient à la décision du lundi. Nouvelle maquette : bandeau avec fraîcheur, quatre cartes (CA vs objectif, marge, panier, N-1), barres d'écart par région, taux de rupture avec le seuil écrit et cinq magasins au-dessus du seuil.

Le camembert et les jauges sortent. Les 200 produits deviennent un rapport paginé ou une page détail, pas la page comité. On fait relire **cette** maquette, en disant ce qui a été retiré et où cela reviendra si la décision change. « Complet » n'est pas un critère de la page. La lisibilité du verdict l'est.

</details>

## Exercice 2 : Un contrôle rouge

La recette trouve un CA réseau juste, mais l'objectif de l'Ouest vaut dix fois le chiffre convenu. Un sponsor propose de publier « et de corriger l'objectif la semaine prochaine ». Que décidez-vous ?

<details>
<summary>Voir la solution</summary>

On ne publie pas la page dont la décision est précisément l'écart à l'objectif. Un objectif décuplé inverse les régions « en retard ». Le contrôle rouge bloque.

On cherche la cause probable (objectif recopié sur les lignes, ou ligne TOTAL sommée avec les magasins), on corrige, on rejoue le mois témoin **et** l'Ouest. Ensuite seulement la publication.

S'il existait une autre page qui ne montre pas l'objectif, elle pourrait partir. Ce n'est pas le cas de la page lundi. « La semaine prochaine » veut dire un lundi de décisions fausses.

</details>

## Exercice 3 : Le premier lundi

L'application est en ligne. En revue, le directeur ouvre encore sa pièce jointe, parce que « les franchises y sont, elles ». Le parrain n'est pas dans la salle. L'analyste commente les deux chiffres. Que prévoit le plan d'adoption pour la semaine qui suit ?

<details>
<summary>Voir la solution</summary>

On arrête de commenter deux chiffres. Le parrain (on le rappelle, ou la revue est recentrée) dit le périmètre : intégrés seuls. Les franchises restent hors contrat, sauf demande formelle de nouvelle métrique.

La pièce jointe est retirée de l'envoi. Une permanence répond aux « où sont les franchises » par le cadrage, pas par un export. Le compte rendu du lundi ne cite que le lien de l'application. À la date de revue du badge, si les pièces jointes sont revenues, on le traite comme un échec d'adoption, pas comme un besoin de nouveaux graphiques.

L'analyste seul ne porte pas la séance suivante.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Certifier la page
center: "Maquette lue, totaux cochés, droits rejoués, parrain en séance. Ensuite seulement le lundi."
points:
  - icon: eye
    title: Maquette
    text: Verdict, cause, action. Le décideur la lit avant le branchement des données.
  - icon: check
    title: Contrôles
    text: Mois témoin, une région, taux qui ne sont pas des moyennes. Un rouge bloque.
  - icon: lock
    title: Région
    text: Test avec le compte du directeur régional, export compris. L'admin ne suffit pas.
  - icon: users
    title: Parrain
    text: Quelqu'un du métier ouvre la page. L'analyste seul ne fait pas l'adoption.
  - icon: rocket
    title: Premier lundi
    text: On juge si la salle a commenté l'application, pas seulement si elle s'ouvre.
pitfall: Publier avec un objectif faux « en corrigeant la semaine prochaine ». Le lundi décide dessus.
remember: Une comparaison au réseau entier, montrée à une région, est un choix écrit ou une fuite.
```
