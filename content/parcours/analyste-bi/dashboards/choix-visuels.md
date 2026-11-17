---
title: Choisir le bon visuel
description: "Barres, lignes, cascade, tableaux et cartes d'indicateurs : choisir le visuel qui répond à la question, et savoir quand écarter jauge et camembert."
duration: 45
objectives:
  - Associer une question métier au visuel qui la rend lisible
  - Utiliser barres, lignes, cascade, tableau et carte d'indicateur à bon escient
  - Repérer les jauges et les camemberts qui nuisent à la décision
  - Justifier un refus de visuel auprès d'un demandeur
---

# La question choisit le visuel

On ne part pas de la galerie de l'outil. On part de la question, puis on choisit **la forme qui compare juste**.

| Question | Visuel qui tient |
| --- | --- |
| Combien, et qui est devant ? | Barres classées |
| Comment cela évolue-t-il ? | Ligne dans le temps |
| D'où vient l'écart entre deux totaux ? | Cascade (waterfall) |
| Quel est le verdict ? | Carte d'indicateur, avec la cible |
| Quel est le détail à traiter ? | Tableau court, trié, filtré |

Un visuel réussi se comprend sans mode d'emploi. S'il faut une phrase pour expliquer comment le lire, la phrase doit être sur la page (un sous-titre), ou le visuel est trop malin.

> [!NOTE]
> Le titre du visuel énonce le message ou la question : « Ouest, principale cause de l'écart de marge », plutôt que « Marge par région ».

# Barres et lignes

Les **barres** comparent des catégories. Triez-les par la valeur qui sert la décision (l'écart, le montant), pas par l'ordre alphabétique, sauf si le lecteur cherche un nom précis. L'axe part de zéro : une barre coupée ment sur le rapport entre deux régions.

Les barres horizontales aident quand les libellés sont longs (noms de magasins). Les barres groupées comparent deux séries (réalisé et objectif) si les catégories restent peu nombreuses. Au-delà de deux séries, la lecture se brouille : préférez l'écart, ou une petite série de barres séparées.

La **ligne** sert le temps. L'axe horizontal est chronologique, continu, sans trou masqué. On limite les séries : une ligne pour le réalisé, une pour l'objectif ou pour N-1. Cinq lignes de familles sur le même axe deviennent un plat de spaghettis. Dans ce cas, montrez le total et la famille qui explique l'écart, et gardez le détail pour un filtre.

N'utilisez pas une ligne pour des catégories sans ordre (les régions). Relier « Est » à « Ouest » invente une pente qui n'existe pas.

# La cascade pour expliquer un écart

La **cascade** (waterfall) part d'un total, ajoute et retranche des contributions, et arrive à un autre total. Elle est faite pour la phrase : « Nous passions de 100 à 92, voici les marches. »

Exemple de marge : objectif, puis effet volume, effet prix, effet remises, effet coûts, puis marge réalisée. Chaque marche a un signe visible et un libellé métier. La première et la dernière colonnes sont des totaux (souvent d'une couleur différente). Les marches intermédiaires sont des variations.

La cascade échoue dans trois cas :

- plus de sept ou huit marches (on regroupe le reste dans « autres ») ;
- des marches qui ne s'additionnent pas vraiment (on a forcé un graphique) ;
- un public qui voulait une tendance dans le temps (alors c'est une ligne, pas une cascade).

> [!TIP]
> Si vous n'arrivez pas à lire la cascade à voix haute (« on part de…, on ajoute…, on arrive à… »), ce n'est pas le bon visuel.

```video
url: https://www.youtube.com/watch?v=pkLIdrY8gVs
title: "How To Use Waterfall Charts: 3 Types With Real Examples"
channel: "Dan Galletta"
duration: "8:09"
lang: en
why: "Trois usages du graphique en cascade, avec des exemples concrets pour expliquer un écart."
```

# La jauge, souvent une fausse précision

La **jauge** (demi-cercle, compteur, thermomètre) séduit parce qu'elle « fait tableau de bord ». Elle occupe une grande surface pour un seul chiffre, elle compare mal deux entités, et ses zones rouge / orange / vert sont souvent des seuils décoratifs.

Préférez une **carte d'indicateur** : le chiffre, l'unité, l'écart à la cible, une flèche ou un signe. Deux cartes côte à côte se comparent. Deux jauges se comparent mal, et quatre jauges mangent la page.

La jauge n'est acceptable que si le métier a un vrai seuil unique, compris de tous, et qu'une seule mesure est en jeu. Même alors, écrivez le seuil en texte (« alerte au-delà de 4 % de rupture »). La couleur seule ne suffit pas, et la jauge n'ajoute presque rien à la carte.

# Tableaux et cartes d'indicateurs

La **carte d'indicateur** (KPI card) porte le verdict. Elle contient peu de choses : le nom de la mesure, la valeur, la comparaison promise (objectif, N-1, mois précédent), et c'est tout. Une carte qui ajoute une sparkline, un second écart, un commentaire et un classement n'est plus une carte, c'est un mini-dashboard illisible.

Le **tableau** sert quand le lecteur doit **lire des valeurs précises** ou **parcourir une liste d'actions**. Règles courtes :

- peu de colonnes, celles de la décision ;
- tri par gravité (le pire écart en haut), pas par nom ;
- unités dans l'en-tête, pas répétées dans chaque cellule ;
- totaux seulement s'ils ont un sens (attention aux moyennes de moyennes) ;
- une hauteur limitée : au-delà de quinze lignes, filtre, top N, ou rapport paginé.

Un tableau n'est pas un aveu d'échec. Pour « les magasins à appeler », il est souvent meilleur qu'un graphique. Le graphique montre la forme, le tableau donne le nom et le numéro.

# Quand ne pas utiliser un camembert

Le **camembert** (et le donut) montre des parts d'un tout. L'œil compare mal les angles. Dès que les parts se ressemblent, ou qu'il y en a plus de trois, la lecture devient un jeu de légende.

```diagram
type: decision
title: "Un camembert est-il vraiment le bon choix ?"
nodes:
  - question: "La question porte-t-elle sur des parts d'un seul tout ?"
    yes: "Continuez, un tout et seulement un."
    no: "Prenez des barres. Le camembert ne compare pas deux années."
  - question: "Y a-t-il au plus trois parts, bien différentes ?"
    yes: "Possible, si les libellés sont sur les parts."
    no: "Barres triées. L'angle ne départage pas six régions."
  - question: "Le lecteur doit-il comparer des valeurs précises ?"
    yes: "Non au camembert. Une barre ou un tableau sera plus juste."
    no: "Un camembert simple peut suffire pour une part dominante."
```

Refusez le camembert quand :

- les parts ne somment pas à un tout clair (deux années côte à côte, deux camemberts « à comparer ») ;
- il y a des valeurs négatives (une marge négative ne fait pas une part) ;
- le lecteur doit classer précisément (« qui est juste derrière ? ») ;
- la légende est loin des parts et compte plus de trois couleurs.

Une seule part vraiment dominante (« 80 % du chiffre sur l'enseigne historique ») peut se dire en une phrase ou en une barre empilée simple. Le camembert n'est pas interdit. Il est rarement le meilleur choix, et il ne mérite presque jamais la plus grande place de la page.

> [!WARNING]
> « Mettre un camembert pour faire joli » est une demande fréquente. Répondez par la question du lecteur, proposez la barre triée, et gardez le camembert seulement s'il gagne le test ci-dessus.

# Exercices

## Exercice 1 : Cinq demandes, cinq formes

Associez un visuel principal à chaque demande et justifiez en une phrase : (1) classer vingt magasins par écart de chiffre d'affaires, (2) voir la marge hebdomadaire depuis janvier, (3) expliquer le passage de l'objectif de marge au réalisé, (4) afficher le taux de rupture du jour face à un seuil de 4 %, (5) lister les huit références à réapprovisionner.

<details>
<summary>Voir la solution</summary>

1. **Barres horizontales** triées par écart, axe depuis zéro. Vingt libellés longs se lisent mieux qu'en colonnes. Un top 10 plus « autres » si la page est un comité.
2. **Ligne** dans le temps, réalisé et éventuellement objectif. Pas de barres isolées qui cassent la continuité.
3. **Cascade** : objectif, puis les effets (volume, prix, remises, coûts), puis réalisé. Peu de marches, libellés métier.
4. **Carte d'indicateur** avec le taux, le seuil écrit (« seuil 4 % »), l'écart en points. Pas une jauge pleine page.
5. **Tableau court** trié par gravité (rupture, stock, magasin). Le nom de la référence doit être lisible, un graphique ne suffit pas pour agir.

</details>

## Exercice 2 : Défaire trois mauvais choix

On vous montre : (a) une ligne qui relie cinq régions, (b) six jauges de même taille pour six indicateurs sans seuil, (c) deux camemberts « cette année / l'an dernier » avec huit familles chacun. Que proposez-vous à la place ?

<details>
<summary>Voir la solution</summary>

- **(a)** Des barres triées par la mesure. Une ligne suppose un ordre continu. Les régions n'en ont pas.
- **(b)** Six cartes compactes, ou mieux trois cartes de verdict et le reste en explication. Sans seuil partagé, la jauge n'apporte que de l'encre. Écrire l'écart (objectif ou N-1) sur la carte.
- **(c)** Une barre groupée ou un tableau d'écarts par famille (réalisé, N-1, écart). Huit parts se ressemblent, et deux camemberts ne se comparent pas. Si une famille domine vraiment, une phrase suffit.

Dans les trois cas, le titre du visuel dit la comparaison, pas le nom du champ.

</details>

## Exercice 3 : La cascade qui ne tombe pas juste

Un collègue construit une cascade « marge » avec douze marches, dont « météo », « satisfaction » et « nombre de vendeurs », qui ne s'additionnent pas aux euros de marge. Le total de fin ne retombe pas sur la marge réalisée. Que lui répondez-vous ?

<details>
<summary>Voir la solution</summary>

La cascade n'est légitime que si les marches **relient vraiment** le total de départ au total d'arrivée, dans la même unité. On reprend les effets qui expliquent l'écart de marge (volume, prix, mix, remises, coûts) et on vérifie que la somme retombe sur le réalisé.

Les indicateurs d'un autre ordre (météo, satisfaction, effectif) peuvent éclairer le commentaire, pas entrer dans l'addition. Au-delà de sept ou huit marches, on regroupe les petites contributions dans « autres », avec le détail au survol ou en annexe.

Si le contrôle de somme échoue, on ne publie pas le visuel : il raconte une arithmétique fausse.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Choisir le bon visuel
center: La question décide du visuel. La galerie de l'outil ne décide pas.
points:
  - icon: chart
    title: Barres et lignes
    text: Barres pour classer des catégories. Ligne pour une évolution dans le temps.
  - icon: scale
    title: Cascade
    text: Elle relie deux totaux par des marches qui s'additionnent vraiment.
  - icon: gauge
    title: Jauge rare
    text: Une carte avec le chiffre et l'écart dit mieux, sur moins de place.
  - icon: list
    title: Tableau utile
    text: Pour agir, une liste courte triée bat souvent un graphique élégant.
  - icon: alert
    title: Camembert
    text: Trois parts d'un seul tout, au plus. Sinon des barres triées.
  - icon: eye
    title: Titre utile
    text: Le titre du visuel dit le message, pas seulement le nom du champ.
pitfall: Un camembert ou une jauge « pour faire joli » vole la place du verdict.
remember: Si l'on doit expliquer comment lire le visuel, il est trop malin.
```
