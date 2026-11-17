---
title: Explorer les données avant de modéliser
description: Poser les questions utiles, lire distributions et corrélations, juger la cardinalité, repérer les fuites visuelles, puis sortir d'un notebook d'EDA avec des décisions.
duration: 60
objectives:
  - Formuler les questions métier avant de tracer le moindre graphique
  - Lire une distribution, une association et une cardinalité sans les surinterpréter
  - Repérer une fuite visuelle et une variable inutilisable au moment de prédire
  - Clore un notebook d'EDA par une liste de décisions explicites
---

# Poser les questions avant les graphes

Un graphique n'est pas une exploration. C'est une réponse dessinée. Si la question n'est pas écrite, vous allez commenter des formes et appeler cela une analyse.

Avant d'ouvrir une librairie de tracé, fixez quatre points, par écrit, en haut du notebook.

1. **L'unité d'une ligne.** Une ligne est-elle un logement, un client, une visite, une facture ? Si une personne apparaît dix fois, une statistique « par ligne » n'est pas une statistique « par personne ».
2. **La cible et le moment où elle existe.** Prix signé, résiliation à 90 jours, défaut à 12 mois. Une cible floue produit un modèle fluide, et inutile.
3. **L'instant de la prédiction.** Quelles colonnes connaîtrez-vous *avant* de devoir répondre ? Tout le reste est hors jeu, même si la corrélation est superbe.
4. **La décision que le chiffre éclaire.** Estimer un prix pour un mandat, prioriser un appel, refuser un dossier. La précision utile n'est pas la même.

Ajoutez une baseline en une phrase : « sans modèle, nous prédireions la moyenne du prix, ou la classe majoritaire ». Vous ne saurez pas si l'exploration a servi tant que vous n'aurez pas battu cette référence, plus tard, sur des lignes mises de côté.

> [!IMPORTANT]
> Séparez tout de suite un jeu de test (ou une date de coupure) et ne le rouvrez pas pour choisir une variable. Regarder la cible du test pour « mieux comprendre » influence déjà vos choix. L'inventaire du schéma peut se faire sur l'ensemble. Tout seuil, tout regroupement, toute variable retenue *parce qu'elle prédit* se décide sur l'entraînement seul.

# Lire les distributions

Une distribution dit comment une variable se répartit, pas pourquoi. Commencez par les chiffres, puis un seul graphique qui les rend visibles.

Pour une variable numérique, notez le nombre de valeurs, le taux de manquants, min, max, moyenne, médiane, et un quantile haut (le 95e ou le 99e). Puis tracez un histogramme.

| Forme | Ce que vous en tirez | Ce que vous ne concluez pas |
|---|---|---|
| Médiane très inférieure à la moyenne, longue queue à droite | Prix, revenus, durées : la moyenne est tirée par quelques extrêmes. La médiane décrit mieux le cas typique. | Que ces extrêmes sont des erreurs à jeter |
| Un pic énorme sur une seule valeur | Valeur par défaut, plafond technique, ou colonne presque constante | Que la variable est « importante » |
| Deux bosses | Deux populations mélangées (studio et maison, deux canaux) | Qu'il faut un modèle compliqué avant d'avoir nommé ces populations |
| Des valeurs impossibles | Surface négative, âge de 240 ans, date dans le futur | Que le reste de la colonne est sain |

La moyenne seule ment dès que la distribution est dissymétrique. Un loyer moyen de 1 400 € avec une médiane de 900 € décrit mal le logement typique. À l'inverse, supprimer toute valeur au-delà de « moyenne + 3 écarts-types » est une règle mécanique : un penthouse rare n'est pas une faute de saisie. Distinguez l'impossible (surface négative) de l'inhabituel (surface de 400 m²). L'impossible se corrige ou se retire, avec une règle écrite. L'inhabituel se garde, sauf raison métier.

Pour une catégorie, un tableau d'effectifs suffit souvent mieux qu'un camembert. Regardez la part de la modalité la plus fréquente et le nombre de modalités qui n'apparaissent qu'une fois.

```python
resume = df["loyer"].describe(percentiles=[0.05, 0.5, 0.95])
taux_manquant = df.isna().mean().sort_values(ascending=False)
effectifs = df["quartier"].value_counts(normalize=True)
```

> [!TIP]
> Si vous ne pouvez pas dire à voix haute ce que l'histogramme change dans votre préparation (transformer, borner, découper, laisser tel quel), le graphique est décoratif. Écrivez la décision à côté.

# Corrélations, sans en faire une cause

Une corrélation mesure une association sur l'échantillon. Elle ne dit pas qu'une variable *produit* l'autre, ni qu'elle sera disponible le jour de la prédiction.

Le coefficient de Pearson résume une liaison **linéaire**. Proche de 1 ou de -1, les points s'alignent à peu près. Proche de 0, il n'y a pas de pente droite nette. Il peut pourtant exister une liaison forte en U, un seuil, ou deux régimes. Un nuage de points, ou une corrélation des rangs (Spearman) quand vous cherchez une liaison monotone, évite cet aveuglement.

Servez-vous de la corrélation comme d'un tri, pas comme d'un verdict.

- **Avec la cible**, sur l'entraînement seulement : quelles variables numériques bougent dans le même sens que le prix ou le risque. Une liaison nulle n'innocente pas la variable. Une liaison forte n'autorise pas à la garder si elle est connue trop tard.
- **Entre variables** : deux colonnes très liées (surface habitable et surface loi Carrez, par exemple) racontent presque la même chose. Dans une régression linéaire, leurs coefficients se partagent le crédit et deviennent instables. Dans un arbre, l'une des deux suffit souvent.
- **Après une transformation** : un loyer et un revenu se comparent parfois mieux en logarithme. Recalculez alors, et dites que vous parlez du log.

Les catégories ne se « corrélent » pas avec Pearson. Comparez la cible par modalité (médiane du prix par quartier, taux de défaut par type de contrat) et la taille de chaque groupe. Une médiane spectaculaire sur 4 lignes n'est pas un quartier, c'est un accident.

> [!WARNING]
> Une association calculée sur tout le fichier, y compris les lignes que vous réservez pour l'évaluation, vous aide à choisir ce qui marche « en regardant les réponses ». Le graphe a l'air honnête. La sélection, elle, a déjà vu le test.

# Cardinalité et modalités rares

La cardinalité est le nombre de valeurs distinctes. Elle décide du codage, et souvent de la suppression.

| Cardinalité | Exemple | Lecture |
|---|---|---|
| 1 | une colonne « pays » toujours égale à France | Aucune information. Vous la retirez. |
| Quelques unités | type de bien, oui / non | Lisible, codable sans risque particulier |
| Quelques dizaines | département, marque | Encore gérable, mais les modalités rares sont fragiles |
| Des centaines ou des milliers | code postal fin, identifiant produit | Un codage naïf explose, et les niveaux vus une fois mémorisent le bruit |
| Autant que de lignes | identifiant client, numéro de dossier | Ce n'est pas une variable. C'est une clé. |

Méfiez-vous des quasi-identifiants. Un couple (date de naissance, code postal) peut désigner une personne sans s'appeler « id ». Le modèle s'en sert comme d'une mémoire des cas d'entraînement, pas comme d'une règle réutilisable.

Regroupez les modalités rares **avec une règle fixée sur l'entraînement** : par exemple, toute ville vue moins de 30 fois devient « autre ». Appliquez ensuite la même liste de villes conservées au test. Une ville nouvelle en production rejoint « autre », elle ne crée pas une colonne inédite au dernier moment.

```python
n_distinct = df.nunique(dropna=False).sort_values(ascending=False)
cles = n_distinct[n_distinct == len(df)].index.tolist()
```

Si `cles` contient autre chose qu'une vraie clé technique, vous avez trouvé soit un doublon de ligne mal compris, soit une variable qui ne se généralisera pas.

# Repérer les fuites visuelles

Une fuite visuelle est un graphique qui a l'air d'une découverte alors qu'il utilise une information interdite, ou qu'il a été construit en rangeant les données selon la réponse.

Cas typiques, à chasser avant de vous réjouir d'une « variable parfaite » :

- **La colonne d'après coup.** Vous prédisez le prix de mise en vente, et le nuage utilise le prix signé, les frais de notaire, ou le délai réel jusqu'à la signature. Ces chiffres n'existent pas le jour où le modèle doit parler.
- **Le ratio qui contient la cible.** `prix / surface` corrélé au prix n'est pas une trouvaille. La cible est dans la formule.
- **Le tri par la cible.** Vous triez les lignes par prix croissant, puis vous tracez une courbe. La courbe monte parce que vous l'avez ordonnée ainsi.
- **La fenêtre qui voit le futur.** Une moyenne mobile centrée (`center=True`) mélange, pour chaque date, des points qui ne sont pas encore arrivés.
- **Le remplissage par la cible.** Colorer un nuage après avoir comblé les trous avec le prix, ou avec une moyenne calculée par modalité de la cible, peint une liaison que les données brutes n'ont pas.
- **L'agrégat calculé sur tout le monde.** Le loyer moyen du quartier, si le quartier inclut le logement que vous évaluez et les logements du test, fait circuler la réponse d'une ligne à l'autre.

Le test pratique tient en une question : *au moment où le modèle devra prédire un cas nouveau, cette grandeur sera-t-elle déjà connue, et calculée sans ce cas ni ses voisins de test ?* Si la réponse est non, le graphique est une fuite, quelle que soit sa beauté.

```diagram
type: flow
title: Contrôler un graphique avant de le croire
steps:
  - title: Question écrite
    text: Unité, cible, instant de la prédiction
    tone: violet
  - title: Source des colonnes
    text: Chaque axe existe-t-il avant la cible ?
    tone: blue
  - title: Périmètre
    text: Calculs faits sur l'entraînement seul
    tone: teal
  - title: Lecture
    text: Forme, effectif, cas impossibles
    tone: amber
  - title: Décision
    text: Garder, transformer, ou écarter
    tone: rose
```

# Un notebook d'EDA structuré

Un bon notebook se relit dans six mois. Rangez-le dans un ordre stable, et écrivez une phrase de conclusion sous chaque bloc. Les graphes sans phrase sont une galerie.

1. **Intention.** Question, unité d'une ligne, définition de la cible, instant de prédiction, baseline envisagée.
2. **Inventaire.** Dimensions, types, doublons de clé, taux de manquants, période couverte. Aucun modèle dans cette section.
3. **Cible.** Distribution, valeurs impossibles, équilibre des classes s'il s'agit d'un oui / non. Vous vérifiez que la cible est bien celle du métier.
4. **Univarié.** Numériques, puis catégories. Vous notez dissymétrie, pics suspects, modalités dominantes.
5. **Cardinalité.** Clés, constantes, modalités rares. Une liste « à ne pas coder tel quel ».
6. **Relations, sur l'entraînement.** Nuages, médianes par groupe, corrélations linéaires. Effectifs affichés à côté de chaque écart.
7. **Fuites et qualité.** Colonnes d'après coup, ratios contaminés, règles de collecte (qui remplit le champ, quand, avec quelle valeur par défaut).
8. **Décisions.** Le tableau de la section suivante. Rien ne reste « à voir » sans propriétaire.

Gardez le code de tracé ennuyeux et lisible. Un graphique, un titre qui énonce le constat (« Le loyer est dissymétrique : médiane 900 €, moyenne 1 400 € »), pas « histogramme 3 ».

> [!NOTE]
> L'EDA prépare des hypothèses. Elle ne les valide pas. La validation viendra d'un score sur des lignes que ces graphiques n'ont pas servies à choisir.

# Les décisions qui sortent de l'EDA

Vous n'avez pas fini tant que le notebook ne tient pas sur une page de décisions. Chaque ligne nomme une action que le pipeline pourra exécuter, pas une impression.

| Décision | Exemple de formulation testable |
|---|---|
| Cible retenue | Prix de signature, hors frais, logements vendus entre 2019 et 2025 |
| Lignes écartées | Surface manquante ou négative, doublons de `bien_id` |
| Variables écartées | Identifiants, prix au m², date de signature, colonnes vides à plus de 95 % sans signal d'absence |
| Transformations à essayer | Log du loyer, âge du bien à partir de la date de mise en ligne, villes rares regroupées |
| Découpage | Coupure temporelle si l'on prévoit demain, plutôt qu'un tirage au hasard |
| Questions ouvertes | Le code 0 du chauffage est-il « inconnu » ou « pas de chauffage » ? |

Relisez cette page avec quelqu'un du métier. Une modalité que vous prenez pour une panne est parfois une règle de gestion. Une variable « trop belle » est parfois saisie après la décision commerciale.

L'EDA s'arrête quand vous pouvez entraîner une baseline sans rouvrir les graphes. La suite (manquants, fabrication de variables, pipeline) exécute ces décisions. Elle ne les redécouvre pas dans le désordre.

# Exercices

## Exercice 1 : Le brief avant les graphes

On vous demande un modèle de résiliation d'abonnement mobile. La table a une ligne par ligne téléphonique et par mois, de 2022 à 2025. La colonne `resilie` vaut 1 si le client a quitté l'opérateur au cours des 30 jours suivants. `motif_resiliation` et `date_resiliation` sont remplis après le départ.

Quelles questions écrivez-vous avant tout graphique, et quelles colonnes écartez-vous d'emblée ?

<details>
<summary>Voir la solution</summary>

Questions à écrire en tête de notebook :

1. L'unité est la ligne téléphonique **et** le mois. Un client avec deux lignes compte deux fois. Il faudra le dire au métier.
2. La cible est un départ dans les 30 jours qui suivent le mois observé. Vous vérifiez qu'aucun mois n'utilise un avenir plus long.
3. L'instant de prédiction est la fin du mois en cours. Tout ce qui n'est connu qu'après le départ est interdit.
4. La décision est sans doute « qui appeler cette semaine ». La baseline est le taux de résiliation observé, ou « on n'appelle personne ».

Vous écartez d'emblée `motif_resiliation` et `date_resiliation` : elles n'existent qu'une fois le départ connu. Un graphique qui les relie à `resilie` est une fuite visuelle, pas un indice.

</details>

## Exercice 2 : Trois graphiques trop beaux

Pour un modèle de prix de mise en vente, un collègue montre trois figures calculées sur tout le fichier.

1. Un nuage `prix_m2` contre `prix`, avec `prix_m2 = prix / surface`.
2. Une courbe du prix après avoir trié les biens du moins cher au plus cher.
3. Le prix médian par quartier, quartiers dont la médiane inclut les biens du futur jeu de test.

Que répondez-vous à chaque figure ?

<details>
<summary>Voir la solution</summary>

1. Le ratio contient la cible. La liaison avec `prix` est en grande partie mécanique. `prix_m2` ne peut pas servir à prédire `prix` : au moment de fixer le prix de mise en vente, ce prix n'est pas encore connu. Une surface, elle, est légitime.
2. La courbe monte parce que les lignes ont été ordonnées par la cible. Ce n'est pas une variable prédictive. Vous retirez ce graphique du notebook, ou vous le gardez comme contre-exemple.
3. La médiane de quartier a vu les prix du test. Vous la recalculez sur l'entraînement seul, et un quartier absent de l'entraînement reçoit une valeur de repli (médiane globale du train), pas une médiane recalculée avec le test.

</details>

## Exercice 3 : Trier les cardinalités

Sur 80 000 ventes, vous obtenez : `bien_id` 80 000 valeurs, `pays` 1 valeur, `type_bien` 4 valeurs, `ville` 3 200 valeurs dont 1 900 n'apparaissent qu'une fois, `nb_pieces` 8 valeurs.

Pour chaque colonne, dites si vous la gardez telle quelle, si vous la transformez, ou si vous la jetez. Justifiez.

<details>
<summary>Voir la solution</summary>

- `bien_id` : vous la jetez comme variable. C'est une clé, une valeur par ligne. Vous la conservez uniquement pour dédoublonner et pour tracer les lignes.
- `pays` : vous la jetez. Une constante n'apporte rien.
- `type_bien` : vous la gardez. Quatre modalités, c'est lisible. Un codage simple suffira.
- `ville` : vous ne la passez pas telle quelle en indicateurs. Vous regroupez les villes rares à partir d'un effectif minimal fixé sur l'entraînement (par exemple moins de 30 ventes), sous une modalité « autre ». Vous notez le risque qu'une ville très fine mémorise des prix.
- `nb_pieces` : vous la gardez en numérique, après avoir vérifié qu'il n'y a pas de code sentinelle (0 ou 99) caché dans les 8 valeurs.

La décision s'écrit dans le tableau de fin d'EDA, pas seulement dans une cellule de graphique.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "L'EDA avant le modèle"
center: "Un graphique répond à une question déjà écrite, puis se traduit en décision."
points:
  - icon: compass
    title: "Quatre questions d'abord"
    text: "Unité de la ligne, cible, instant de prédiction, décision que le chiffre éclaire."
  - icon: chart
    title: "Lire la forme"
    text: "Médiane, queue, pic suspect, valeurs impossibles. La moyenne ne suffit pas."
  - icon: search
    title: "Association, pas cause"
    text: "Pearson voit une droite. Un nuage et les effectifs évitent le faux zéro."
  - icon: list
    title: "Cardinalité"
    text: "Constante, catégorie lisible, modalité rare, ou simple clé à retirer."
  - icon: eye
    title: "Fuite visuelle"
    text: "Axe connu trop tard, tri par la cible, agrégat qui a vu le test."
  - icon: check
    title: "Page de décisions"
    text: "Garder, transformer, écarter, couper dans le temps. Puis seulement modeler."
pitfall: "Commenter une galerie de graphes calculés sur tout le fichier, y compris la cible du test."
remember: "L'EDA est finie quand une baseline peut s'entraîner sans rouvrir les graphiques."
```
