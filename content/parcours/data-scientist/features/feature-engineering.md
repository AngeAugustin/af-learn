---
title: Fabriquer des variables utiles
description: Décomposer les dates, construire des ratios et des tranches, choisir entre one-hot, ordinal et target encoding, ajouter une interaction, et savoir jeter une variable.
duration: 65
objectives:
  - Construire des variables de date, de ratio et de tranche sans y glisser la cible
  - Choisir un codage catégoriel (one-hot, ordinal, target encoding) selon le sens et la cardinalité
  - Ajouter une interaction seulement quand l'effet d'une variable dépend d'une autre
  - Écarter une variable inutile, instable ou indisponible au moment de prédire
---

# Dates décomposées et ratios

Un modèle tabulaire ne « voit » pas qu'une date est une date, ni qu'un prix et une surface forment un rendement. Vous lui écrivez les grandeurs qui ont un sens au moment de la prédiction.

**Décomposer une date** connue à cet instant, pas la date où la cible se réalise. Pour un prix de mise en vente, la date de publication est légitime. La date de signature ne l'est pas : elle n'existe pas encore quand il faut annoncer le prix.

Vous en tirez des pièces que le métier reconnaît : année, mois, jour de semaine, et surtout des **durées** entre deux événements déjà passés (âge du bien à la mise en ligne, ancienneté du client au moment de la demande).

```python
df["annee"] = df["date_publication"].dt.year
df["mois"] = df["date_publication"].dt.month
df["jour_semaine"] = df["date_publication"].dt.dayofweek
df["age_bien"] = (df["date_publication"] - df["date_construction"]).dt.days / 365.25
```

Le mois codé 1 à 12 a un défaut : décembre et janvier sont voisins dans l'année et éloignés sur la droite des nombres. Un arbre peut recoller ces mois par des seuils. Une régression linéaire, non. Si la saison compte vraiment pour un modèle linéaire, deux colonnes en sinus et cosinus de l'angle du mois restituent le cycle. Vous ne le faites pas par réflexe sur toutes les dates.

**Un ratio** énonce une intensité : pièces par mètre carré, mensualité sur revenu, dette sur valeur. Les deux côtés du rapport doivent être connus avant la cible. Vous protégez la division.

```python
df["pieces_par_m2"] = df["nb_pieces"] / df["surface"].clip(lower=1)
```

`prix / surface` est interdit quand `prix` est la cible. Le ratio est alors une copie déguisée de la réponse. Après construction, vous regardez la distribution : un dénominateur minuscule fabrique des ratios géants, qui domineront une régression si vous ne les bornez pas.

> [!WARNING]
> Une durée calculée jusqu'à « aujourd'hui » change de sens selon le jour où vous relancez le notebook. Fixez la date de référence (date de la demande, date de l'extraction d'entraînement), la même en production.

# Découper en tranches

Une tranche remplace un nombre par un intervalle : âge en « moins de 25 ans », « 25 à 44 », « 45 à 64 », « 65 et plus ». Vous le faites pour deux raisons honnêtes. Le métier décide déjà par paliers (un barème, une règle d'éligibilité). Ou l'effet n'est pas une pente continue, et un modèle linéaire simple a besoin de ces marches.

Vous ne le faites pas pour « aider un arbre ». Un arbre cherche lui-même ses seuils. Lui imposer les vôtres jette de l'information (62 et 64 ans deviennent identiques) sans lui apprendre quelque chose qu'il ne pouvait pas couper.

Deux façons de placer les bords.

- **Les bords métier**, fixés à l'avance : tranches d'âge d'un produit, classes d'énergie. Ils ne bougent pas quand vous relancez le tirage. C'est le meilleur cas.
- **Les bords statistiques** (quantiles, écarts égaux), appris sur l'entraînement seul. `KBinsDiscretizer` se place dans le pipeline. Recalculer les quantiles sur tout le fichier, ou choisir les bords parce qu'ils collent à la cible du test, fuit.

```python
from sklearn.preprocessing import KBinsDiscretizer

tranches = KBinsDiscretizer(n_bins=4, encode="ordinal", strategy="quantile")
# fit sur le train, transform sur le test, idéalement dans un pipeline
```

Trop de tranches revient à la variable brute, en plus bruité. Trop peu écrase un effet réel. Quatre à six paliers métier se justifient. Vingt quantiles « pour voir » se justifient rarement.

# One-hot ou encodage ordinal

Une catégorie n'est pas un nombre tant que vous ne lui avez pas donné un sens numérique. Deux codages simples couvrent la plupart des cardinalités modestes.

**L'indicateur, ou one-hot,** crée une colonne par modalité, 1 si la ligne porte cette modalité, 0 sinon. Il ne suppose aucun ordre. Couleur, ville peu nombreuse, type de contrat : c'est le bon réflexe. `handle_unknown="ignore"` évite qu'une modalité inédite en production fasse planter la prédiction : elle devient une ligne de zéros.

Pour une régression linéaire avec constante, les colonnes one-hot sont redondantes (si ce n'est pas « maison » ni « appartement », c'est le troisième type). `drop="first"` retire une modalité de référence. Les coefficients se lisent alors comme des écarts à cette référence. Un arbre n'a pas besoin de cette précaution.

**L'ordinal** remplace une échelle ordonnée par 0, 1, 2, dans l'ordre réel : faible, moyen, élevé. Il est juste quand l'ordre existe dans le métier. Il est faux pour une ville : rien ne dit que Bordeaux est « entre » Lyon et Nantes.

Le piège restant : un modèle linéaire traite l'écart de 0 à 1 comme égal à l'écart de 1 à 2. Si « élevé » n'est pas aussi loin de « moyen » que « moyen » l'est de « faible », le coefficient est un compromis. Dans ce doute, le one-hot, plus gourmand en colonnes, est plus honnête. Un arbre, lui, peut utiliser l'ordinal sans croire à l'égalité des écarts, parce qu'il coupe plutôt qu'il ne multiplie.

```python
from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder

type_bien = OneHotEncoder(handle_unknown="ignore")
etat = OrdinalEncoder(
    categories=[["mauvais", "moyen", "bon"]],
    handle_unknown="use_encoded_value",
    unknown_value=-1,
)
```

Au-delà de quelques dizaines de modalités, le one-hot devient une forêt de colonnes presque toujours nulles. Les niveaux vus trois fois produisent des coefficients extravagants. Vous regroupez d'abord les rares, ou vous passez à un codage qui résume la modalité autrement.

```diagram
type: compare
title: Trois codages d'une catégorie
columns:
  - title: One-hot
    tone: blue
    items:
      - "Sans ordre supposé"
      - "Quelques modalités"
      - "Inconnue ignorée en production"
      - "Explose si des centaines de niveaux"
  - title: Ordinal
    tone: teal
    items:
      - "Un ordre métier réel"
      - "Compact, une seule colonne"
      - "Écarts traités comme égaux en linéaire"
      - "Faux dès que l'ordre est inventé"
  - title: Target encoding
    tone: rose
    items:
      - "Forte cardinalité"
      - "Résumé par la cible du train"
      - "Lissage obligatoire"
      - "Fuite nette s'il voit la ligne ou le test"
```

# Le target encoding et son danger

Le target encoding remplace une modalité par la moyenne de la cible dans cette modalité, calculée sur l'entraînement. Pour un prix, la ville devient le prix moyen observé dans cette ville. Pour un défaut oui / non, elle devient la fréquence de défaut. C'est tentant dès que la cardinalité est haute : une colonne, au lieu de mille indicateurs.

Le danger est direct. Une ville vue **une seule fois** reçoit comme code le prix de cette unique vente. La variable contient alors la réponse de la ligne. Le modèle n'a plus qu'à la relire. Même avec plusieurs lignes, si vous calculez la moyenne en incluant la ligne que vous êtes en train de coder, chaque prix tire son propre code vers lui.

Deux garde-fous, les deux nécessaires.

- **Le lissage.** Vous tirez la moyenne de la modalité vers la moyenne globale quand l'effectif est petit. Une ville de 5 ventes ne garde pas son prix brut. Une ville de 2 000 ventes reste proche de sa propre moyenne. Le paramètre de lissage dit à partir de quel effectif vous faites confiance au groupe.
- **Le calcul hors de la ligne, et hors du test.** Sur l'entraînement, un schéma par blocs (le cross-fitting de `TargetEncoder`) code chaque ligne avec les autres lignes du train, pas avec elle-même. Le test, et la production, reçoivent les moyennes figées de l'entraînement. Une ville jamais vue reçoit la moyenne globale.

```python
from sklearn.preprocessing import TargetEncoder

ville = TargetEncoder(target_type="continuous", smooth="auto")
# Dans un pipeline : fit sur le train seulement.
# Le cross-fitting interne évite qu'une ligne code sa propre cible.
```

Ce codage reste une mémoire des cibles passées. Il vieillit si les prix d'une ville changent de régime. Il fuit si vous l'ajustez sur le fichier complet « pour simplifier ». Et il n'est pas une explication : un code postal très prédicteur recopie souvent le niveau de vie du quartier, parfois un biais que vous n'avez pas le droit d'automatiser. Vous le traitez comme une variable puissante et fragile, jamais comme une preuve.

> [!IMPORTANT]
> Si une modalité rare obtient un score parfait sur l'entraînement et s'effondre dès que vous la codez hors de ses propres lignes, vous n'aviez pas une bonne variable. Vous aviez la cible, recopiée.

# Écrire une interaction

Une interaction dit que l'effet de A n'est pas le même selon B. La valeur d'une pièce en plus n'est pas la même dans un studio et dans une maison. La mensualité ne pèse pas de la même façon selon le revenu. Le produit `surface * maison` (maison valant 1 ou 0), ou le ratio déjà vu, écrit cette idée en colonnes.

Vous en avez besoin surtout pour un modèle **linéaire**, qui additionne des effets séparés et ne invente pas leur produit. Un arbre, à force de coupes successives (d'abord le type de bien, puis la surface dans chaque branche), approxime beaucoup d'interactions tout seul. Lui ajouter vingt produits « au cas où » complique la lecture sans gain sûr.

`PolynomialFeatures` de degré 2 fabrique tous les produits. Sur 40 colonnes, vous en sortez des centaines, dont la plupart sont du bruit. Vous le réservez à un petit groupe de variables déjà justifiées, ou vous écrivez à la main les deux ou trois interactions que le métier sait nommer.

Le signe que l'interaction mérite d'exister : sur l'entraînement, le lien entre A et la cible change clairement de pente selon B, et les deux groupes ont assez de lignes. Un croisement spectaculaire sur 10 dossiers ne s'écrit pas dans le pipeline.

# Savoir jeter une variable

Fabriquer est valorisé. Jeter est souvent le geste qui améliore le modèle. Une variable sort du jeu dès qu'une de ces raisons tient.

- **Elle est constante**, ou presque, sur l'entraînement.
- **C'est une clé**, ou un quasi-identifiant qui isole les lignes.
- **Elle double** une autre colonne (même information, autre nom).
- **Elle contient la cible**, un calcul fait après la cible, ou un agrégat qui a vu le test.
- **Elle ne sera pas là** au moment de prédire, ou sa définition change sans prévenir d'une année sur l'autre.
- **Elle est vide** au point que seul un indicateur aurait du sens, et que cet indicateur ne prédit rien de stable.
- **Vous ne pouvez pas l'expliquer**, et elle n'aide que l'entraînement. Une colonne opaque qui gagne 0,2 point sur le train et rien au-delà est une mémorisation.
- **Le cadre d'usage l'interdit**, par exemple un attribut sensible utilisé comme raccourci d'une population, alors que la décision ne doit pas s'en servir. Le chapitre d'éthique y revient. Ici, le réflexe est déjà de ne pas la glisser « parce qu'elle corrèle ».

Le test de la corbeille est simple : si la variable disparaissait en production demain matin, la prédiction aurait-elle encore le même sens ? Si oui, elle n'était pas nécessaire. Si la prédiction devenait impossible, elle est centrale, et vous devez être capable de la recalculer à l'identique.

Gardez la liste des variables jetées dans le notebook de décisions, avec le motif. « On verra plus tard » est la façon la plus sûre de réintroduire une fuite au moment de la mise en prod.

# Exercices

## Exercice 1 : Dates et ratios légitimes

Vous prédisez le **prix de mise en vente** d'un logement, fixé le jour de la publication de l'annonce. Parmi ces colonnes fabriquées, lesquelles sont utilisables ce jour-là ?

1. Année et mois de `date_publication`.
2. Nombre de jours entre `date_publication` et `date_signature`.
3. `prix / surface`.
4. `nb_pieces / surface`.
5. Âge du bien : `date_publication` moins `date_construction`.

<details>
<summary>Voir la solution</summary>

1. **Utilisable.** La date de publication est connue au moment de fixer le prix. Le mois reste un cycle : pour une régression linéaire, pensez à un codage sinusoïdal si la saison compte.
2. **Interdite.** La signature n'a pas eu lieu. La durée jusqu'à la vente est un futur.
3. **Interdite.** Le prix est la cible. Le ratio la contient.
4. **Utilisable**, avec un plancher sur la surface pour éviter les divisions par zéro, puis un œil sur les ratios extrêmes.
5. **Utilisable**, si la date de construction est connue à la publication. Vous fixez la référence sur `date_publication`, pas sur le jour où vous lancez le script.

</details>

## Exercice 2 : Choisir le codage

Pour le même problème, proposez un codage pour : `type_bien` (appartement, maison, terrain), `etat` (à rénover, correct, bon, excellent), `code_postal` (4 000 valeurs, beaucoup de codes à moins de 5 ventes).

<details>
<summary>Voir la solution</summary>

- `type_bien` : **one-hot**, avec `handle_unknown="ignore"`. Il n'y a pas d'ordre. Trois colonnes (ou deux plus une référence, en régression linéaire) suffisent.
- `etat` : **ordinal** dans l'ordre métier à rénover < correct < bon < excellent, si vous acceptez ce rang. Pour une régression linéaire, signalez que les écarts entre notes ne sont pas forcément égaux. En cas de doute, le one-hot est plus prudent. Ce n'est pas un target encoding.
- `code_postal` : pas de one-hot brut. Vous regroupez les codes trop rares, puis un **target encoding lissé**, ajusté sur l'entraînement avec cross-fitting, moyenne globale pour un code inconnu. Vous surveillez les codes à très petit effectif : sans lissage, ils recopient le prix de quelques biens.

</details>

## Exercice 3 : Ce qui part à la corbeille

On vous propose d'ajouter : l'identifiant de l'annonce, une colonne `pays` toujours égale à « France », le prix au mètre carré, la moyenne de prix du quartier calculée sur tout le fichier, et le produit `surface * nb_pieces` « pour aider la forêt aléatoire ».

Que jetez-vous, que gardez-vous, et à quelle condition ?

<details>
<summary>Voir la solution</summary>

- Identifiant d'annonce : **jeté** comme variable, conservé comme clé.
- `pays` : **jeté**, constante.
- Prix au mètre carré : **jeté**, il contient la cible.
- Moyenne de quartier sur tout le fichier : **jetée telle quelle**, parce qu'elle a vu le test. Vous pouvez la recalculer sur l'entraînement seul, avec une valeur de repli pour un quartier nouveau. Ce n'est plus la même variable.
- Produit `surface * nb_pieces` : vous ne l'ajoutez pas seulement « pour la forêt ». La forêt cherche déjà des interactions par ses coupes. Vous ne le gardez que si une régression linéaire en a besoin et si le nuage, sur l'entraînement, montre un effet qui change vraiment. Sinon vous le jetez pour ne pas multiplier les colonnes au hasard.

Le motif de chaque rejet s'écrit dans la liste des décisions, à côté des variables gardées.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Fabriquer des variables"
center: "Une bonne variable est connue à l'heure de prédire, et calculée sans la cible."
points:
  - icon: clock
    title: "Dates en pièces"
    text: "Année, mois, durées entre événements passés. Jamais la date de la cible."
  - icon: scale
    title: "Ratios et tranches"
    text: "Intensité utile, ou palier métier. Bords statistiques calés sur le train."
  - icon: layers
    title: "Coder une catégorie"
    text: "One-hot sans ordre, ordinal si l'échelle est vraie, target encoding si ça explose."
  - icon: alert
    title: "Cible recopiée"
    text: "Une modalité rare non lissée contient la réponse. Le test ne sert pas au calcul."
  - icon: puzzle
    title: "Interaction ciblée"
    text: "Le produit s'écrit pour un modèle linéaire. L'arbre en trouve déjà beaucoup."
  - icon: filter
    title: "Savoir jeter"
    text: "Clé, constante, doublon, fuite, champ absent demain, colonne que vous n'expliquez pas."
pitfall: "Garder le prix au mètre carré, ou un code de ville égal à la cible de ses deux ventes."
remember: "Si la variable disparaissait demain, la prédiction aurait-elle encore le même sens ?"
```
