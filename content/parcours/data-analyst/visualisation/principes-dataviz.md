---
title: Principes de la visualisation de données
description: "Perception visuelle, rapport encre/données, mensonges courants (axe tronqué, 3D, double axe), hiérarchie de l'information et adaptation au public."
duration: 55
objectives:
  - "Juger un graphique selon ce que l'œil compare vraiment"
  - "Alléger l'encre qui ne porte aucune donnée"
  - "Repérer un axe tronqué, un effet 3D et un double axe"
  - "Régler la hiérarchie du message sur le public qui décide"
---

# Ce que l'œil compare vraiment

Un graphique n'est pas une décoration du tableau : c'est un encodage. Vous transformez des nombres en positions, en longueurs, en angles ou en couleurs, et le lecteur reconstitue les nombres avec son système visuel. Ce système n'est pas également précis pour tous les encodages. Les expériences de Cleveland et McGill, reprises depuis dans toute la pratique de la dataviz, classent à peu près ainsi la justesse de lecture :

1. **Position sur une échelle commune** (le point aligné sur un axe gradué).
2. **Longueur** partant d'une même base (la barre).
3. **Angle et pente**.
4. **Surface**.
5. **Volume**.
6. **Teinte ou intensité de couleur**, utiles pour une catégorie ou un ordre approximatif, médiocres pour lire un écart précis.

Conséquence directe : pour comparer des régions, des barres alignées sur un même zéro battent un camembert. Le camembert demande de comparer des angles. La bulle demande de comparer des surfaces, alors que l'œil lit plutôt le diamètre.

**Exemple.** Deux marges, 20 % et 40 %. En barres depuis zéro, la seconde est visiblement le double. En bulles, une surface double n'augmente le rayon que d'un facteur d'environ 1,4 : le dessin dit « un peu plus gros » là où la donnée dit « le double ». En parts d'un camembert (un tiers et deux tiers), beaucoup de lecteurs sous-estiment la part la plus grande.

La couleur reste précieuse, mais pour une autre tâche : distinguer une série, signaler un dépassement de seuil, montrer un ordre du clair au foncé. Elle ne remplace pas une échelle quand l'écart compte.

```diagram
type: compare
title: "Ce que l'œil lit bien, et ce qu'il estime mal"
columns:
  - title: Position
    tone: teal
    items:
      - "Point sur un axe commun"
      - "Écart lu avec le plus de justesse"
      - "Idéal pour une évolution chiffrée"
  - title: Longueur
    tone: blue
    items:
      - "Barre depuis une base commune"
      - "Très fiable si le zéro est là"
      - "Idéal pour comparer des catégories"
  - title: Angle et surface
    tone: amber
    items:
      - "Camembert, pente, bulle"
      - "L'ordre se voit, le ratio beaucoup moins"
      - "À réserver aux parts grossières"
  - title: Couleur
    tone: violet
    items:
      - "Catégorie ou alerte"
      - "Mauvais support pour un écart fin"
      - "Toujours doubler d'un libellé"
```

> [!IMPORTANT]
> Choisissez l'encodage selon la question, pas selon le menu du logiciel. « Quelle région est au-dessus du seuil ? » supporte une couleur. « De combien l'Est est-il en dessous du Nord ? » demande une position ou une longueur sur une échelle commune.

# Le rapport entre l'encre et les données

Edward Tufte résume une discipline utile sous le nom de **rapport encre/données** : parmi toute l'encre du graphique (ou les pixels), quelle part porte réellement une donnée ? Le reste est de l'encre non data. Un peu de structure est nécessaire (les axes, le nom des séries, la période). Le décor ne l'est pas.

Encre qui aide :

- la marque qui encode la valeur (barre, point, segment) ;
- le libellé qui dit de quoi on parle, collé à la marque quand c'est possible ;
- l'échelle, avec son unité ;
- l'annotation qui désigne le fait saillant.

Encre qui gêne, souvent appelée *chartjunk* :

- le relief, l'ombre portée, le dégradé sur une barre ;
- la grille tous les 1 % alors que le lecteur cherche un ordre de grandeur ;
- la légende qui répète des couleurs déjà écrites au bout des lignes ;
- le fond illustré, le pictogramme qui déforme une barre, le cadre épais.

**Exemple.** Vous comparez la marge brute de quatre régions de Lumen, un fournisseur de luminaires pour professionnels : Nord 61 %, Est 42 %, Sud 54 %, Ouest 46 %. Quatre barres horizontales, triées par valeur, un titre, l'unité « % du CA HT, T2 », et une couleur forte sur l'Est suffisent. Un fond photo d'ampoule, une légende « bleu = marge », des grilles et un effet 3D n'ajoutent aucun de ces quatre nombres. Ils ralentissent la lecture et, dans le cas du 3D, la faussent.

Alléger n'est pas mentir par omission. Retirer le zéro d'un diagramme en barres pour « faire plus moderne » diminue l'encre et détruit la proportion. Le minimalisme qui casse l'échelle est pire qu'une grille discrète.

> [!TIP]
> Avant d'envoyer le fichier, masquez mentalement le titre et les couleurs. Si la comparaison utile disparaît, l'encodage est trop faible. Si elle reste évidente en gris, sur un axe propre, vous pouvez encore retirer du décor.

# L'axe tronqué fabrique un écart

Une barre est lue comme une longueur. Cette longueur n'est proportionnelle à la valeur que si elle part de zéro. Couper l'axe (le faire commencer à 40, à 90, à 18) garde un dessin de barre mais change le contrat avec le lecteur : la différence visuelle n'est plus la différence des données.

**Exemple, Lumen, marge de l'Est au T2.**

| Mois | Marge brute |
|---|---|
| Avril | 48 % |
| Mai | 42 % |
| Juin | 36 % |

La moyenne du trimestre, celle des revues, est bien **42 %** : (48 + 42 + 36) / 3. Le fait mensuel est une perte de **12 points** en deux mois. Juin vaut 36 / 48 = 0,75 fois avril.

Si les barres partent de zéro, juin est plus court qu'avril, sans être effacé. L'écart de 12 points se dit dans le titre.

Si l'axe commence à 32, la hauteur visible est 16, 10 puis 4 points au-dessus du plancher. Avril paraît 16 / 4 = **4 fois** plus haut que juin, pour une valeur seulement 1,33 fois plus élevée (48 / 36). Le dessin multiplie le contraste par environ 4 / 1,33 ≈ **3**. Le lecteur pressé retient « la marge s'est effondrée », alors que la moyenne du T2 reste 42 %.

La courbe n'obéit pas au même réflexe. On lit une ligne comme une position et une pente, pas comme une longueur depuis zéro. Zoomer un axe de courbe peut être légitime pour voir une variation faible, à trois conditions : l'axe affiche ses bornes, le titre ne dramatise pas au-delà du chiffre, et vous n'utilisez pas ce zoom pour comparer des « hauteurs » comme s'il s'agissait de barres. Dans le doute, pour une barre, le zéro n'est pas négociable.

> [!WARNING]
> Un axe de barres qui ne commence pas à zéro est le mensonge visuel le plus fréquent dans les reportings, parce qu'il est proposé en un clic par l'outil « pour mieux voir les écarts ». Les écarts se montrent par l'annotation (« −12 points »), pas par une base truquée.

```video
url: https://www.youtube.com/watch?v=E91bGT9BjYk
title: "How to spot a misleading graph - Lea Gaslowitz"
channel: "TED-Ed"
duration: "4:10"
lang: en
why: "TED-Ed montre comment repérer un graphique trompeur, axe tronqué compris."
```

# Le relief et le second axe inventent un récit

## Le 3D ne contient pas de donnée supplémentaire

Un camembert en volume incline les parts vers le lecteur. La part placée devant gagne de l'épaisseur et de la surface apparente. Une part de 15 % au premier plan peut sembler rivaliser avec une part de 25 % au fond. Or le 3D n'encode aucune troisième variable : c'est du décor. Cumulé avec la faiblesse naturelle de l'angle, il rend une comparaison déjà fragile franchement trompeuse.

Le même défaut touche les barres en perspective : la barre de derrière paraît plus haute parce que le point de fuite étire le dessin, pas parce que la valeur est plus grande. Si vous avez quatre régions, dessinez quatre barres plates. Si vous tenez à montrer une composition, préférez des barres empilées à 100 %, avec les libellés sur les segments, plutôt qu'un disque en relief.

## Deux axes, deux histoires collées de force

Un **double axe** superpose deux séries qui n'ont pas la même unité, chacune avec son échelle. Rien dans le plan du graphique n'oblige ces échelles à avoir un rapport. En déplaçant le minimum et le maximum de l'axe de droite, vous faites se croiser, se suivre ou se décrocher n'importe quel couple de courbes.

**Exemple.** Le CA HT de Lumen sur quatre trimestres : 100, 108, 115, 120 (base 100 au T1). Le NPS des comptes livrés : 42, 44, 41, 43. Sur un axe de 0 à 100, le NPS est presque plat. Sur un axe serré de 40 à 45, la même série occupe toute la hauteur et semble aussi mouvementée que le CA. Le comité lit « la satisfaction accompagne la croissance ». Les données disent « le CA monte d'environ 20 % en un an, le NPS oscille de 3 points autour de 42 ».

Ce dessin est particulièrement dangereux quand il suggère une cause. Deux courbes qui se suivent après réglage des axes ne prouvent pas que l'une explique l'autre. Vous avez choisi le cadrage.

À la place :

- deux graphiques empilés, chacun avec son échelle écrite en toutes lettres (des **petits multiples**, détaillés dans le chapitre suivant) ;
- ou un seul indicateur par slide, celui qui porte la décision ;
- ou, si vous devez vraiment les confronter, un nuage (NPS en fonction du CA, un point par période) qui montre la relation sans truquer deux échelles linéaires collées.

```diagram
type: flow
title: "Que faire à la place d'un double axe"
steps:
  - title: Deux questions
    text: "Chaque série répond-elle à une décision différente ?"
    tone: violet
  - title: Deux échelles
    text: "Alors deux graphiques, avec l'unité écrite sur chacun"
    tone: blue
  - title: Une relation
    text: "Si le lien est la question, passez à un nuage de points"
    tone: teal
  - title: Une conclusion
    text: "Le titre dit le résultat chiffré, pas le nom des colonnes"
    tone: rose
```

# Une hiérarchie : le message, puis le contexte

Le lecteur ne lit pas un graphique comme une page de roman, de gauche à droite et de haut en bas, ligne à ligne. L'œil accroche d'abord ce qui tranche : un titre court, une couleur isolée, une annotation, le point le plus extrême. Ensuite seulement il décode l'échelle. Si tout est coloré, rien n'est prioritaire. Si le titre dit « Marge par région », vous avez dépensé l'endroit le plus lu pour répéter le nom de l'axe.

Ordre qui fonctionne pour un graphique de décision :

1. **Le titre conclut.** « La marge de l'Est finit juin à 36 % (42 % sur le T2) », plutôt que « Évolution de la marge ».
2. **Une seule série est en couleur** (l'Est en ambre). Les autres restent grises : elles servent de repère, pas de deuxième sujet.
3. **Une annotation** désigne le fait, avec l'unité et la comparaison : « −12 points depuis avril ».
4. **L'échelle et la source** rassurent : « Marge brute, CA HT, commandes livrées. Hors avoirs. T2. »
5. **Le détail méthodologique** (filtre, jointure, exception) va en note, pas dans le titre.

**Exemple de mise en page pour les quatre régions.** Barres horizontales triées : Nord 61 %, Sud 54 %, Ouest 46 %, Est 42 %. Gris pour trois barres, ambre pour l'Est. Pas de légende : les noms sont sur l'axe. Le titre porte déjà la chute. Une note de bas de graphique précise que 42 % est une marge brute, pas un taux de remise.

La hiérarchie vaut aussi pour un tableau de bord entier. Un écran avec douze indicateurs de la même taille annonce que vous ne savez pas ce qui compte. Un indicateur principal, deux repères, et le reste sur demande : le lecteur sait où poser les yeux.

> [!TIP]
> Si vous devez expliquer le graphique à l'oral pendant plus de vingt secondes, la hiérarchie n'est pas faite. Le titre devrait pouvoir être lu seul dans un compte rendu, sans la figure.

# Le public change le dessin, pas les faits

Les nombres de Lumen ne changent pas selon la salle. Le dessin, si. Vous devez au lecteur le niveau de détail qui lui permet de décider, et rien qui l'induise en erreur.

| Public | Ce qu'il vient chercher | Dessin adapté | À éviter |
|---|---|---|---|
| Direction, 10 minutes | Une décision et l'ordre de grandeur | Un graphique, un titre-conclusion, l'écart en points | Douze séries, double axe, camembert 3D |
| Équipe commerciale Est | Où agir lundi | La série hebdomadaire, les comptes sous 45 % de marge, la définition | Un agrégat national qui masque l'Est |
| Support ou opérations | Le délai réel, pas la moyenne flatteuse | Distribution ou boîte à moustaches, médiane et queue | Une seule moyenne |
| Lecture externe (client, post public) | Un fait vérifiable, sans jargon interne | Mots simples, source, période, couleurs distinguables sans légende | La marge interne, les codes couleur maison non légendés |

Le test du daltonisme fait partie du respect du public. Environ un homme sur douze distingue mal le rouge et le vert. Un graphique dont le seul contraste est « rouge = mauvais, vert = bon » perd ces lecteurs, et perd aussi tout le monde quand il est imprimé en gris ou projeté sur un mur délavé. Un libellé direct (« Est, 42 % ») et un contraste de clarté (ambre sur gris, ou bleu foncé sur bleu clair) survivent à ces situations.

Même rigueur sur le vocabulaire. « Marge » sans adjectif veut dire trois choses selon les métiers : marge brute, marge après logistique, marge d'exploitation. Écrivez laquelle. « CA » sans HT ou TTC, sans période et sans règle sur les avoirs, n'est pas un chiffre : c'est une devinette.

Avant d'exporter, passez la liste suivante. Elle reprend les défauts de ce chapitre, dans l'ordre où ils trompent :

- La question est-elle une comparaison, une évolution, une répartition ou une relation ? L'encodage correspond-il à cette question ?
- Les barres partent-elles de zéro ? Les unités sont-elles écrites ?
- Y a-t-il un second axe, un relief, une bulle dont la surface n'est pas le message ?
- Le titre énonce-t-il le résultat, avec une seule mise en couleur ?
- Une personne qui ne voit pas le rouge et le vert peut-elle lire la conclusion sans la légende ?
- La population, la période et la définition tiennent-elles dans la note ?

Si une réponse bloque, corrigez le dessin. N'ajoutez pas un paragraphe pour excuser un graphique que le lecteur ne lira pas jusqu'au bout.

# Exercices

## Exercice 1 : Mesurer l'exagération

Un collègue envoie des barres de marge brute pour l'Ouest : janvier 44 %, février 46 %, mars 48 %. L'axe commence à 40. Le commentaire dit : « la marge a été multipliée, la dernière barre est quatre fois plus haute ».

1. Calculez le rapport des hauteurs visibles (mars contre janvier) et le rapport des vraies valeurs.
2. Reformulez le commentaire en une phrase honnête.
3. Dites quel dessin vous publieriez pour une direction qui doit voir à la fois le niveau et l'écart.

<details>
<summary>Voir la solution</summary>

1. Au-dessus de 40, les hauteurs visibles sont 4, 6 et 8 points. Mars / janvier = 8 / 4 = **2** (pas 4 : le collègue a mal lu son propre axe). Les valeurs réelles : 48 / 44 ≈ **1,09**, soit **+4 points**, ou environ +9 % en relatif. Le dessin fait paraître mars deux fois plus « haut » pour une valeur seulement 9 % plus élevée.

2. « La marge Ouest gagne 4 points en deux mois, de 44 % à 48 %. »

3. Des barres depuis zéro (les trois niveaux se ressemblent, ce qui est vrai) **et** un titre ou une annotation « +4 points ». Si l'écart fin est le sujet, une courbe ou des points sur un axe gradué, bornes visibles, avec l'annotation. Pas des barres tronquées.

</details>

## Exercice 2 : Démonter un double axe

Le slide « Santé de Lumen » superpose le CA (axe gauche, 0 à 2 M€) et le nombre de tickets support (axe droit, 0 à 80). Les deux courbes montent. Le titre est « La croissance dégrade le support ». Quels problèmes posez-vous, et par quoi remplacez-vous le graphique ?

<details>
<summary>Voir la solution</summary>

Les deux séries n'ont ni la même unité, ni la même échelle imposée par les données : on peut les faire se suivre ou se croiser en changeant les bornes. La hausse commune ne prouve pas que le CA cause les tickets (plus de clients, une version instable, ou un changement de l'outil de tickets produisent le même dessin). Le titre affirme une cause que le graphique ne montre pas.

Remplacement : deux graphiques séparés, titres chiffrés (« CA T2 : 1,2 M€, +8 % » et « Tickets : 70 sur le mois, +15 »). Si la question est la charge par client, calculez un taux (tickets pour 100 commandes) et montrez **cette** série, avec sa définition. Vous ne collez plus deux axes.

</details>

## Exercice 3 : Régler la hiérarchie

On vous donne un camembert 3D « Répartition du CA T2 » (Nord 35 %, Est 26 %, Sud 23 %, Ouest 16 %), un dégradé, une légende à part, et le titre « CA par région ». La réunion dure dix minutes avec la direction. Proposez le titre, l'encodage, ce que vous mettez en couleur, et la note indispensable.

<details>
<summary>Voir la solution</summary>

Titre qui conclut, par exemple : « Le Nord pèse 35 % du CA T2, l'Ouest 16 % ». Encodage : barres horizontales depuis zéro, triées par valeur, pas un camembert et surtout pas de 3D. Couleur : une seule si un écart sert la décision (l'Ouest en ambre si le sujet est son faible poids), le reste en gris. Noms au bout des barres, donc pas de légende. Note : « CA HT, commandes livrées, T2, avoirs déduits » (ou la règle réelle). Le dégradé sort : il n'encode rien.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Principes d'une dataviz honnête
center: "L'encre doit suivre ce que l'œil sait comparer, sans axe tronqué, sans 3D et sans double échelle."
points:
  - icon: eye
    title: Perception
    text: "Position et longueur d'abord. Angle, surface et couleur montrent mal un écart précis."
  - icon: ruler
    title: Encre utile
    text: "Gardez marques, échelle, libellés et annotation. Retirez ombre, 3D, grille et légende redondante."
  - icon: alert
    title: Axe tronqué
    text: "Une barre se lit depuis zéro. Sinon la hauteur visible n'est plus proportionnelle à la valeur."
  - icon: scale
    title: Double axe
    text: "Deux unités sur un même dessin laissent choisir la pente. Préférez deux graphiques ou un nuage."
  - icon: users
    title: Public
    text: "Même chiffres, dessin différent : une décision pour la direction, le détail pour l'équipe, la source pour tous."
pitfall: "Couper l'axe des barres pour « mieux voir » un écart de quelques points, et faire croire à un effondrement."
remember: "Le titre dit le résultat chiffré. L'échelle, l'unité et la population restent visibles, sans second axe."
```
