---
title: Traiter les valeurs manquantes
description: Distinguer MCAR, MAR et MNAR, choisir entre suppression et imputation, ajouter un indicateur de manquant, et ne jamais imputer avant la séparation train-test.
duration: 60
objectives:
  - Expliquer MCAR, MAR et MNAR à partir du mécanisme de collecte
  - Choisir une suppression ou une imputation (moyenne, médiane, indicateur) selon le cas
  - Éviter la fuite créée par une statistique calculée avant le split
  - Documenter la règle de manquant pour que le même traitement serve en production
---

# Pourquoi une case vide n'est pas un détail

Une valeur manquante n'est pas un zéro qui s'ignore. C'est une information sur la collecte : le capteur a failli, la question a été refusée, le champ n'existait pas encore, ou le métier a laissé vide ce qui ne s'appliquait pas.

Avant de remplir quoi que ce soit, répondez à trois questions.

- **Que signifie le vide ici ?** « Inconnu », « sans objet », « pas encore observé » et « zéro véritable » ne se traitent pas de la même façon. Un chauffage codé vide n'est pas un chauffage à 0 kWh.
- **Quelle part des lignes est touchée, et lesquelles ?** Un taux global de 8 % peut cacher 80 % de manquants sur un seul canal.
- **Le vide sera-t-il le même le jour de la prédiction ?** Si, en production, le champ est toujours rempli, le manquant historique est un artefact. S'il manque encore souvent, le modèle doit savoir vivre avec.

Comptez les manquants par colonne et, quand c'est parlant, par groupe (par année, par agence, par type de contrat). Un taux qui saute à une date précise raconte un changement de formulaire, pas un hasard.

```python
taux = df.isna().mean().sort_values(ascending=False)
par_annee = df.groupby(df["date_depot"].dt.year)["revenus"].apply(lambda s: s.isna().mean())
```

> [!WARNING]
> Ne remplacez pas un manquant par 0 « pour que le modèle tourne ». Zéro est une valeur. Pour un revenu, un loyer ou une durée, vous venez d'inventer des personnes sans ressources, et souvent de fabriquer le meilleur prédicteur accidentel du fichier.

# MCAR, MAR et MNAR en mots

Ces trois sigles décrivent **pourquoi** la case est vide. Vous ne les prouvez pas avec un test magique. Vous les tenez d'une histoire de collecte, puis vous regardez si les données la contredisent.

**MCAR, manquant complètement au hasard.** La probabilité qu'une case soit vide ne dépend ni de la valeur qui aurait dû s'y trouver, ni des autres colonnes. Exemple : un bug enregistre mal 2 % des formulaires, au hasard, quel que soit le client. Jeter ces quelques lignes change peu la population. C'est le cas le plus confortable, et le moins fréquent dès qu'un humain remplit le champ.

**MAR, manquant au hasard sachant ce que l'on observe.** La probabilité dépend de colonnes que vous voyez, mais plus de la valeur cachée une fois ces colonnes prises en compte. Exemple : le revenu est plus souvent vide chez les moins de 25 ans, parce que le formulaire le rend facultatif pour eux. Parmi les personnes du même âge, le fait de répondre ne dépend plus du montant. Vous pouvez alors vous appuyer sur l'âge pour imputer, sans prétendre avoir vu le revenu refusé.

**MNAR, manquant selon la valeur elle-même.** La probabilité dépend de ce qui manque. Exemple : les revenus très élevés refusent la question, précisément parce qu'ils sont élevés. Les personnes malades graves sautent l'item de santé. Aucune autre colonne ne raconte toute l'histoire. Le vide est alors un signal. Le faire disparaître dans une moyenne efface le message.

```diagram
type: decision
title: Quel mécanisme de manquant ?
nodes:
  - question: "Le vide dépend-il de la valeur qui manque, même à colonnes observées égales ?"
    yes: "MNAR. L'absence est un signal, prévoyez un indicateur."
    no: "Passez à la question suivante."
  - question: "Le vide dépend-il de colonnes que vous voyez (âge, canal, année) ?"
    yes: "MAR. Une imputation qui utilise ces colonnes est défendable."
    no: "MCAR plausible. Une suppression légère ou une imputation simple suffit souvent."
```

Deux limites, à garder en tête. D'abord, MAR et MNAR se ressemblent dans le tableau : vous ne voyez pas la valeur qui trancherait. L'entretien avec le métier compte plus qu'un acronyme. Ensuite, un même fichier mélange les mécanismes. Le revenu peut être MAR selon l'âge et, en plus, MNAR chez ceux qui gagnent le plus.

# Supprimer des lignes ou des colonnes

Supprimer est honnête quand ce que vous retirez n'est pas précisément ce que le modèle devra affronter plus tard.

**Supprimer des lignes** (liste complète) convient si les trous sont rares, proches du MCAR, et si la ligne sans cette mesure n'a plus de sens. Cinq logements sans surface sur 50 000, surface sans laquelle vous ne savez pas lire le dossier : vous les écartez, et vous l'écrivez. Vous ne le faites pas quand 30 % des revenus manquent chez les dossiers les plus risqués. Vous changeriez alors la population, et le taux de défaut du fichier d'entraînement ne serait plus celui de la production.

**Supprimer une colonne** convient dans trois cas nets.

- Elle est vide presque partout, et le fait qu'elle soit vide n'apporte rien (un champ abandonné depuis des années, toujours null).
- Elle ne sera pas disponible au moment de prédire.
- Elle double une autre colonne mieux remplie.

Elle ne convient pas quand le seul fait qu'elle manque prédit la cible. Dans ce cas, la colonne « vide ou non » vaut souvent plus que la colonne imputée.

> [!IMPORTANT]
> Chaque suppression est un filtre sur la population. Écrivez qui disparaît. Si les lignes jetées ont un taux de défaut deux fois plus haut, vous n'avez pas « nettoyé ». Vous avez rendu le problème plus facile que la réalité.

# Imputer par la moyenne, la médiane, et un indicateur

Imputer, c'est remplacer le vide par une valeur de travail. Le modèle a besoin d'un nombre. À vous de ne pas lui raconter n'importe quoi.

**La moyenne** convient à une variable numérique à peu près symétrique, sans extrêmes dominants, dans un cas proche de MCAR ou de MAR simple. Elle a deux défauts visibles. Elle est tirée par les extrêmes (un revenu moyen n'est pas un revenu typique). Elle fabrique un pic artificiel : beaucoup de lignes reçoivent exactement le même nombre, et la variance de la colonne baisse. Le modèle voit des gens « moyens » qui n'ont simplement pas répondu.

**La médiane** convient mieux dès que la distribution est dissymétrique ou chargée d'extrêmes : prix, revenus, durées, montants. Elle ignore l'ampleur des queues. Elle crée elle aussi un pic à la valeur de remplacement, mais elle ne se laisse pas emporter par quelques fortunes. Pour une première imputation numérique, la médiane est le choix le plus sûr.

**Le mode** (valeur la plus fréquente) est l'équivalent pour une catégorie. Il renforce encore la modalité déjà dominante. Souvent, une modalité explicite « inconnu » est plus claire qu'un mode silencieux : vous ne faites pas passer un refus de répondre pour la ville la plus courante.

**L'indicateur de manquant** est une colonne binaire, 1 si la valeur d'origine était vide, 0 sinon. Vous l'ajoutez **en plus** de l'imputation, pas à la place des valeurs observées. L'imputation donne un nombre utilisable. L'indicateur dit au modèle que ce nombre a été fabriqué. C'est particulièrement utile en MNAR, et chaque fois que l'absence elle-même est liée à la cible (le revenu non déclaré, le champ facultatif des dossiers fragiles).

Sans indicateur, une médiane bien choisie reste un mensonge plat : le modèle ne peut pas distinguer un revenu vraiment médian d'un revenu caché. Avec l'indicateur, il peut apprendre que « revenu absent » n'a pas le même risque que « revenu médian ».

| Situation | Geste prudent |
|---|---|
| Quelques trous au hasard, colonne symétrique | Moyenne, ou médiane par simplicité |
| Montants dissymétriques | Médiane |
| Catégorie | Modalité « inconnu », plutôt que le mode si le vide a un sens |
| L'absence informe (MNAR, ou lien avec la cible) | Imputation + indicateur |
| Champ vide à plus de 95 % et absence sans lien | Suppression de la colonne |

Des imputations plus riches existent (prédiction du champ manquant à partir des autres colonnes). Elles restent des modèles : elles s'ajustent sur l'entraînement seul, et elles peuvent surapprendre. La médiane plus un indicateur bat souvent ces usines tant que vous n'avez pas montré, sur un jeu tenu à l'écart, qu'elles améliorent la baseline.

```python
from sklearn.impute import SimpleImputer

imputer = SimpleImputer(strategy="median", add_indicator=True)
# fit sur l'entraînement uniquement, transform sur le test
X_train_ok = imputer.fit_transform(X_train)
X_test_ok = imputer.transform(X_test)
```

`add_indicator=True` empile les indicateurs à la suite des colonnes imputées. Vous n'avez pas à les bricoler à la main, à condition que cet objet vive dans le pipeline et voie le train avant le test.

# La fuite quand on impute avant le split

La moyenne ou la médiane est une statistique. Si vous la calculez sur tout le fichier puis que vous séparez train et test, le train a déjà vu un résumé des lignes de test. Le chiffre est souvent proche de celui du train seul, et la fuite paraît petite. L'habitude, elle, est grave.

Elle devient grosse dès que la statistique dépend de la cible (moyenne de la cible par modalité), du futur, ou d'un choix fait en regardant tout le monde (seuil de revenu calé sur la distribution complète). Elle casse aussi la reproductibilité : en production, les dossiers de demain ne sont pas dans le fichier d'aujourd'hui. La seule médiane que vous pourrez recalculer est celle de l'entraînement, figée au moment de l'ajustement.

L'ordre correct est toujours le même.

1. Vous séparez entraînement et test (ou vous coupez par la date).
2. Vous calculez médiane, moyenne, mode et indicateurs **sur l'entraînement**.
3. Vous appliquez ces valeurs figées à l'entraînement, au test, puis aux cas nouveaux.

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=0
)
mediane = X_train["revenus"].median()
X_train["revenus"] = X_train["revenus"].fillna(mediane)
X_test["revenus"] = X_test["revenus"].fillna(mediane)
```

Ce que vous ne faites pas : `X["revenus"].fillna(X["revenus"].median())` sur la table entière, puis le split. Ni un `fillna` qui utilise `y`. Ni une médiane par quartier calculée en incluant les quartiers du test.

> [!CAUTION]
> La même règle vaut pour tout ce qui se « cale » sur les données : centrage et réduction, bornes de tranches, liste des modalités fréquentes, sélection de variables. Le split d'abord, le calcul ensuite, sur le train. Le pipeline du chapitre suivant rend cet ordre difficile à rater.

# Choisir et documenter la stratégie

Vous n'avez pas besoin d'une stratégie différente par élégance. Vous avez besoin d'une stratégie que vous pouvez défendre, et réappliquer.

Pour chaque colonne imparfaite, une ligne de registre suffit : mécanisme supposé, geste (suppression, médiane, modalité « inconnu », indicateur), et population touchée. Exemple : « `revenus`, refus probable des hauts revenus (MNAR), médiane du train plus indicateur, 18 % de vides, surtout chez les indépendants ».

Puis vous vérifiez, sur l'entraînement, que l'indicateur n'est pas une constante et que la valeur imputée ne crée pas un pic absurde au milieu d'une échelle. Vous comparez plus tard la baseline avec et sans indicateur. S'il n'apporte rien de stable, vous pouvez le retirer. Vous ne le retirez pas seulement parce que la colonne fait « moins propre ».

En production, le même imputer, déjà ajusté, transforme les dossiers nouveaux. Vous ne recalculez pas la médiane chaque nuit sur un mélange d'ancien et de nouveau, sauf décision explicite de réentraînement. Un champ qui se met à manquer deux fois plus souvent qu'à l'entraînement est un incident de données, pas un détail que la médiane va absorber en silence.

# Exercices

## Exercice 1 : Nommer le mécanisme

Classez chaque situation en MCAR, MAR ou MNAR, et dites ce qui rend le classement plausible. Restez prudent là où le tableau ne suffit pas.

1. Un capteur de température envoie un blanc sur 1 % des minutes, sans lien avec l'heure ni avec la température des minutes voisines. Le constructeur confirme un bug aléatoire.
2. Le revenu est facultatif sous 25 ans et obligatoire ensuite. À âge égal, rien n'indique que les non-réponses aient un revenu différent.
3. Dans une enquête, les patrimoines les plus hauts laissent la case vide, d'après les contrôleurs qui connaissent une source externe.

<details>
<summary>Voir la solution</summary>

1. **MCAR.** Le vide ne dépend ni de la température manquante ni des autres colonnes observées. Le témoignage du constructeur est ici la pièce décisive, pas seulement le taux de 1 %.
2. **MAR**, si l'hypothèse « à âge égal, la non-réponse ne dépend plus du revenu » est vraie. L'âge observé suffit à décrire le mécanisme. Vous pouvez imputer en tenant compte de l'âge, et vérifier que le vide des moins de 25 ans n'est pas, en plus, lié au risque.
3. **MNAR.** Le fait de répondre dépend de la valeur du patrimoine elle-même. Une moyenne des répondants sous-estime les hauts patrimoines. Un indicateur de non-réponse est indispensable, et l'imputation simple ne « répare » pas le biais.

</details>

## Exercice 2 : Supprimer, médiane, ou indicateur

Pour un scoring de défaut, vous avez : `revenus` vide à 20 % et plus souvent vide chez les dossiers qui feront défaut ; `anciennete_emploi` vide sur 12 lignes sur 40 000 ; `notes_appel` vide à 98 %, vestige d'un logiciel arrêté, sans lien avec le défaut.

Quel geste choisissez-vous pour chaque colonne ?

<details>
<summary>Voir la solution</summary>

- `revenus` : vous ne supprimez pas les 20 % de lignes, car ce sont justement les dossiers les plus risqués. Vous imputez par la **médiane de l'entraînement** (les revenus sont dissymétriques) et vous ajoutez un **indicateur de manquant**, parce que l'absence est liée à la cible. Une moyenne serait tirée par les très hauts revenus déclarés.
- `anciennete_emploi` : 12 lignes, mécanisme sans gravité apparente. Vous pouvez supprimer ces lignes ou imputer par la médiane. Vous le notez. Vous ne construisez pas une usine pour 12 cas.
- `notes_appel` : vous **supprimez la colonne**. Elle est presque toujours vide, le vide n'informe pas, et le champ n'a plus de sens opérationnel. Un indicateur serait presque constant.

</details>

## Exercice 3 : L'imputation avant le split

Un notebook fait ceci, dans cet ordre : remplacer les revenus vides par la médiane de toute la colonne `revenus`, puis appeler `train_test_split`, puis entraîner le modèle.

Expliquez la fuite. Réécrivez l'ordre correct en quelques lignes.

<details>
<summary>Voir la solution</summary>

La médiane globale utilise les revenus du futur test. L'entraînement est donc rempli avec une statistique qui a vu des lignes d'évaluation. L'écart est parfois faible, mais la procédure n'est pas celle de la production : demain, ces lignes n'existeront pas encore. La même habitude devient une vraie fuite dès que la statistique dépend de la cible.

Ordre correct :

```python
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=0
)
imputer = SimpleImputer(strategy="median", add_indicator=True)
X_train_ok = imputer.fit_transform(X_train[["revenus"]])
X_test_ok = imputer.transform(X_test[["revenus"]])
```

`fit_transform` voit l'entraînement. `transform` réutilise la médiane figée. Le test ne participe pas au calcul.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Valeurs manquantes"
center: "Le vide a un mécanisme. Vous le traitez après le split, jamais avant."
points:
  - icon: search
    title: "Trois mécanismes"
    text: "MCAR au hasard, MAR selon des colonnes vues, MNAR selon la valeur cachée."
  - icon: filter
    title: "Supprimer peu"
    text: "Lignes rares et au hasard, ou colonne vide qui n'informe plus personne."
  - icon: gauge
    title: "Médiane d'abord"
    text: "La moyenne cède sur les montants. Le mode grossit encore la catégorie dominante."
  - icon: alert
    title: "Indicateur"
    text: "Colonne binaire en plus de l'imputation quand l'absence elle-même prédit."
  - icon: lock
    title: "Split puis fit"
    text: "Médiane, mode et bornes se calent sur le train et se figent pour le test."
pitfall: "Remplir toute la table par la médiane globale, puis seulement après couper le test."
remember: "Zéro n'est pas un manquant. L'absence se code, elle ne s'invente pas en valeur réelle."
```
