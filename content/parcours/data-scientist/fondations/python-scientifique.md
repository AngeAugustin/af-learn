---
title: Python scientifique pour la modélisation
description: Manipuler des vecteurs avec NumPy, résumer un tableau avec pandas, tracer un nuage de points et écrire des fonctions pures légèrement typées.
duration: 60
objectives:
  - Créer un vecteur NumPy et prévoir le résultat d'une opération vectorisée
  - Anticiper un broadcasting en alignant les formes depuis la droite
  - Résumer un tableau pandas et tracer un nuage de points lisible
  - Écrire une fonction pure dont les types d'entrée et de sortie sont annotés
---

# Des listes aux tableaux NumPy

Une liste Python garde des objets un par un. Pour **18 400 loyers**, écrire une boucle qui soustrait la moyenne fonctionne, mais elle est lente et elle cache la forme du calcul. **NumPy** range les nombres dans un tableau typé, le `ndarray`, et applique l'opération à tout le tableau.

```python
import numpy as np

loyers = np.array([900.0, 1200.0, 1500.0, 750.0])
print(loyers.shape)       # (4,)
print(loyers.dtype)       # float64
print(loyers.mean())      # 1087.5
```

La **forme** (`shape`) est le renseignement que vous lisez avant toute opération. `(4,)` est un vecteur de 4 nombres. `(3, 2)` est un tableau de 3 lignes et 2 colonnes. Confondre les deux est la première source de bugs silencieux : le code répond, mais il ne répond pas à la question que vous croyez poser.

NumPy impose un seul type dans le tableau. `np.array([1, 2.5])` devient flottant. `np.array([900, None])` n'est plus un tableau numérique confortable. Les manquants numériques se notent `np.nan`, et `nan` contamine les sommes : `np.array([1.0, np.nan]).sum()` vaut `nan`. Vous traiterez les manquants dans un chapitre dédié. Ici, retenez qu'un tableau NumPy est un rectangle de nombres, pas un tableur tolérant.

# Vecteurs et opérations d'un coup

Une opération entre tableaux de même forme se fait **élément par élément**. Pas de boucle à écrire, et l'intention reste visible.

```python
reel = np.array([800.0, 1100.0, 1500.0])
prevu = np.array([780.0, 1200.0, 1400.0])
ecart = reel - prevu
print(ecart)                  # [ 20. -100.  100.]
print(np.abs(ecart).mean())   # 73.333...
```

L'erreur absolue moyenne vaut (|20| + |−100| + |100|) / 3 = **73,3 €**. Vous venez de calculer une métrique sans `for`.

Le produit de deux vecteurs avec `*` est aussi élément par élément, ce n'est **pas** le produit scalaire. Pour le produit scalaire (la somme des produits, que le chapitre d'algèbre reprendra), utilisez `@` ou `np.dot`.

```python
poids = np.array([0.2, 0.5, 0.3])
notes = np.array([12.0, 15.0, 10.0])
print(poids * notes)     # [2.4  7.5  3. ]
print(poids @ notes)     # 13.0
```

Vérification : 0,2 × 12 + 0,5 × 15 + 0,3 × 10 = 2,4 + 7,5 + 3 = **13,0**. Si vous aviez fait la moyenne des notes sans poids, vous auriez trouvé (12 + 15 + 10) / 3 = **12,3**. Le `@` change le résultat, et c'est voulu.

Deux pièges de forme :

- `reel - np.array([780.0, 1200.0])` lève une erreur : les longueurs 3 et 2 ne collent pas. Tant mieux, l'erreur est visible.
- `reel.reshape(3, 1) - prevu.reshape(1, 3)` ne lève **pas** d'erreur : il fabrique un tableau 3 × 3. C'est le broadcasting, au chapitre suivant. Si vous vouliez trois écarts, cette forme est fausse tout en étant silencieuse.

# Le broadcasting, à l'intuition

Le **broadcasting** étire un tableau plus petit pour qu'il prenne la forme du plus grand, **sans copier les données dans votre tête**. L'alignement se fait **depuis la droite**. Une dimension manque, ou vaut 1 : elle s'étire. Deux dimensions différentes et toutes deux différentes de 1 : l'opération est refusée.

Cas le plus simple, un scalaire. Ajouter 273,15 à quatre températures ajoute 273,15 à chacune.

```python
temperatures_c = np.array([18.5, 21.0, 19.5, 17.0])
temperatures_k = temperatures_c + 273.15
print(temperatures_k)  # [291.65 294.15 292.65 290.15]
```

Cas utile en modélisation : centrer des colonnes. Le tableau `mesures` a la forme `(3, 2)`, trois magasins et deux indicateurs (chiffre d'affaires en milliers d'euros, nombre de vendeurs). Le vecteur des moyennes a la forme `(2,)`.

```python
mesures = np.array([
    [120.0, 4.0],
    [80.0, 6.0],
    [150.0, 3.0],
])
moyennes = np.array([116.7, 4.3])   # forme (2,)
print(mesures - moyennes)
# [[  3.3  -0.3]
#  [-36.7   1.7]
#  [ 33.3  -1.3]]
```

Depuis la droite, `(3, 2)` et `(2,)` : le 2 colle au 2, la dimension manquante s'étire sur les 3 lignes. Chaque magasin perd la moyenne de **sa** colonne. Le premier magasin est 3,3 au-dessus du chiffre d'affaires moyen et 0,3 vendeur en dessous.

Le cas qui échoue, et c'est une bonne nouvelle :

```python
poids_ligne = np.array([1.0, 2.0, 0.5])   # forme (3,)
# mesures * poids_ligne  -> ValueError : 2 et 3 sont incompatibles
```

Vous vouliez multiplier la ligne 1 par 1, la ligne 2 par 2, la ligne 3 par 0,5. NumPy a comparé le **dernier** axe (2 colonnes contre 3 poids) et a refusé. Pour étirer les poids **vers les colonnes**, donnez-leur une forme `(3, 1)`.

```python
poids = poids_ligne.reshape(3, 1)
print(mesures * poids)
# [[120.   4.]
#  [160.  12.]
#  [ 75.   1.5]]
```

```diagram
type: flow
title: Aligner les formes depuis la droite
steps:
  - title: Écrire les shapes
    text: "(3, 2) face à (2,), ou (3, 2) face à (3, 1)"
    tone: blue
  - title: Partir de la droite
    text: Comparer le dernier axe, puis celui d'avant
    tone: teal
  - title: 1 ou absent
    text: La dimension s'étire, le calcul a un sens
    tone: amber
  - title: Autre écart
    text: Erreur immédiate, mieux qu'un résultat faux
    tone: rose
```

Avant chaque opération, prononcez la phrase : « j'aligne depuis la droite, et j'étire seulement les 1. » Si vous ne pouvez pas dire quelle quantité est répétée (une moyenne par colonne, un poids par ligne), ne lancez pas le calcul.

# Un rappel court de pandas

**pandas** pose des **noms** sur les lignes et les colonnes. Vous vous en servez pour lire un extrait, compter, filtrer, agréger. Le calcul numérique lourd peut revenir à NumPy, mais l'exploration démarre ici.

```python
import pandas as pd

tickets = pd.DataFrame({
    "magasin": ["A", "A", "B", "B"],
    "montant": [42.0, 18.5, 60.0, 15.0],
    "retour": [False, True, False, False],
})
print(tickets["montant"].mean())                 # 33.875
print(tickets.groupby("magasin")["montant"].sum())
# A    60.5
# B    75.0
```

Vérifiez à la main. Magasin A : 42 + 18,5 = **60,5 €**. Magasin B : 60 + 15 = **75 €**. Moyenne globale : (42 + 18,5 + 60 + 15) / 4 = 135,5 / 4 = **33,875 €**.

Quelques réflexes suffisent à ce stade :

| Besoin | Appel | Lecture |
|---|---|---|
| Volume | `len(tickets)` | 4 lignes |
| Type d'une colonne | `tickets["montant"].dtype` | flottant, donc agrégeable |
| Filtre | `tickets.loc[tickets["retour"]]` | 1 ligne, le retour de 18,5 € |
| Agrégat | `groupby("magasin")["montant"].sum()` | un total par magasin |

`loc` sélectionne par étiquette et par condition. Écrivez la condition entre crochets, pas une chaîne vague. `tickets.loc[tickets["retour"], "montant"]` isole le montant des retours : ici **18,5 €**, soit 18,5 / 135,5 ≈ **13,7 %** du total encaissé. Un seul filtre nommé vaut mieux que cinq copies du tableau.

pandas recopie parfois les données, NumPy expose des vues. Pour ce chapitre, ne cherchez pas à muter une colonne extraite « sur place ». Calculez un nouvel objet et nommez-le (`montants_a = ...`). Vous éviterez l'avertissement `SettingWithCopyWarning` et les tableaux à moitié modifiés.

# Tracer un nuage de points

Un **nuage de points** montre deux variables continues, une par axe. Avant toute droite de modèle, regardez si la relation est à peu près linéaire, s'il y a un point isolé, et si l'axe est truqué par une unité illisible.

Cinq logements :

| Surface (m²) | Loyer (€) |
|---:|---:|
| 45 | 900 |
| 62 | 1 200 |
| 80 | 1 500 |
| 33 | 750 |
| 110 | 2 100 |

```python
import matplotlib.pyplot as plt

surface = [45, 62, 80, 33, 110]
loyer = [900, 1200, 1500, 750, 2100]

fig, ax = plt.subplots(figsize=(6, 4))
ax.scatter(surface, loyer, color="#3d5a80")
ax.set_xlabel("Surface (m²)")
ax.set_ylabel("Loyer mensuel (€)")
ax.set_title("Cinq logements")
fig.tight_layout()
fig.savefig("nuage-loyers.png", dpi=120)
```

Le point (110, 2 100) n'est pas « faux » par principe : 2 100 / 110 ≈ **19 €/m²**, proche de 1 500 / 80 = **18,8 €/m²**. Le petit logement (33 m², 750 €) est à **22,7 €/m²**. Le graphique sert à voir cela, pas à décorer un rapport. Titrez les axes avec l'unité. Une couleur suffit.

La même figure avec seaborn, si vous préférez partir d'un tableau :

```python
import seaborn as sns

logements = pd.DataFrame({"surface": surface, "loyer": loyer})
sns.scatterplot(data=logements, x="surface", y="loyer")
```

seaborn choisit des défauts souvent plus lisibles. matplotlib vous laisse tout régler. Pour un nuage de contrôle, les deux se valent. Enregistrez la figure dans le dossier de l'expérience : un graphique que vous ne pouvez pas relancer n'est pas un résultat.

> [!TIP]
> Si un axe mélange 33 m² et 3 300 (une surface saisie en décimètres par erreur), le nuage s'écrase. Corrigez l'unité avant d'interpréter une pente.

# Fonctions pures et typage léger

Une fonction **pure** ne dépend que de ses arguments et ne modifie rien d'autre. Deux appels avec les mêmes nombres rendent le même nombre. C'est ce que vous voulez pour une métrique, un nettoyage, un découpage : le résultat du rapport doit être recalculable.

```python
def erreur_absolue_moyenne(y: np.ndarray, y_pred: np.ndarray) -> float:
    """Moyenne des écarts absolus, en même unité que y."""
    if y.shape != y_pred.shape:
        raise ValueError(f"formes différentes : {y.shape} et {y_pred.shape}")
    return float(np.abs(y - y_pred).mean())


reel = np.array([800.0, 1100.0, 1500.0])
prevu = np.array([780.0, 1200.0, 1400.0])
print(erreur_absolue_moyenne(reel, prevu))  # 73.333...
```

Les annotations `y: np.ndarray` et `-> float` sont un **typage léger**. Python ne les vérifie pas à l'exécution. Elles disent au lecteur, et à l'éditeur, ce qui entre et ce qui sort. Annotez les frontières (arguments, retour), pas chaque variable locale.

Ce qui casse la pureté, dans une expérience :

- lire un seuil dans une variable globale qu'une cellule a changée entre-temps ;
- ajouter le résultat à une liste `journal` créée dehors ;
- écrire un fichier au milieu du calcul, sans que le nom du fichier soit un argument.

```python
def part_alertes(alertes: int, total: int) -> float:
    if total <= 0:
        raise ValueError("total doit être strictement positif")
    return alertes / total


print(part_alertes(70, 500))  # 0.14
```

70 alertes justes sur 500, soit **0,14**. La fonction ne consulte rien d'autre. Si vous la rappelez avec (70, 500), vous obtenez encore 0,14. Le contrôle `total <= 0` évite une division silencieuse par zéro le jour où un filtre laisse un groupe vide.

Contrastez avec une fonction qui lit `SEUIL = 600` défini plus haut dans le notebook. Vous changez `SEUIL` pour un essai, vous relancez une cellule sur deux, et le taux d'alerte du paragraphe « résultat final » ne correspond plus au seuil cité dans le texte. La fonction pure reçoit le seuil en argument : `def alerte(montant: float, seuil: float) -> bool`. Le cahier d'expérience peut alors écrire `seuil = 600` à côté du chiffre.

# Exercices

## Exercice 1 : Formes et broadcasting

Vous avez `notes` de forme `(4,)` égal à `[12.0, 15.0, 9.0, 18.0]`, et `bonus` égal à `1.5`.

1. Que vaut `notes + bonus`, élément par élément ?
2. Vous avez aussi `centres` de forme `(2, 2)` égal à `[[1.0, 2.0], [4.0, 0.0]]` et `decalage` de forme `(2,)` égal à `[10.0, 1.0]`. Que vaut `centres + decalage` ?
3. Pourquoi `centres + np.array([10.0, 1.0, 0.0])` échoue-t-il ?

<details>
<summary>Voir la solution</summary>

1. `[13.5, 16.5, 10.5, 19.5]`. Le scalaire 1,5 s'ajoute à chaque note.
2. `[[11.0, 3.0], [14.0, 1.0]]`. Le décalage s'aligne sur les colonnes : +10 sur la première, +1 sur la seconde, pour chaque ligne.
3. Les formes `(2, 2)` et `(3,)` se comparent depuis la droite : 2 contre 3, aucune des deux n'est 1. NumPy refuse, au lieu d'inventer un alignement.

</details>

## Exercice 2 : Lire un agrégat

Le tableau `tickets` du cours a quatre lignes : magasins A, A, B, B et montants 42 €, 18,5 €, 60 €, 15 €. Le seul retour est le ticket de 18,5 €.

1. Quel est le montant total du magasin A ?
2. Quelle part du montant encaissé (tous magasins) ce retour représente-t-il ?
3. Écrivez l'expression pandas qui isole les montants du magasin B.

<details>
<summary>Voir la solution</summary>

1. 42 + 18,5 = **60,5 €**.
2. Total encaissé : 42 + 18,5 + 60 + 15 = **135,5 €**. Part du retour : 18,5 / 135,5 ≈ **13,7 %**.
3. `tickets.loc[tickets["magasin"] == "B", "montant"]`, qui contient 60 € et 15 €.

</details>

## Exercice 3 : Rendre une métrique pure

Le fragment suivant dépend d'une liste globale.

```python
erreurs = []

def ajouter(y: float, y_pred: float) -> None:
    erreurs.append(abs(y - y_pred))
```

1. Pourquoi cette fonction n'est-elle pas pure ?
2. Réécrivez une fonction `ecart_absolu(y: float, y_pred: float) -> float` pure.
3. Avec y = 1 150 et y_pred = 1 000, que renvoie-t-elle ? Que renvoie un second appel avec les mêmes arguments ?

<details>
<summary>Voir la solution</summary>

1. Elle modifie `erreurs`, qui vit en dehors d'elle. Le deuxième appel ne rend pas le même état du programme que le premier : la liste s'allonge. Le résultat utile est un effet de bord, pas une valeur de retour.
2. Une réécriture minimale :

```python
def ecart_absolu(y: float, y_pred: float) -> float:
    return abs(y - y_pred)
```

3. Les deux appels renvoient **150**. Rien d'autre n'a changé.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Python scientifique
center: Lire la forme du tableau avant l'opération, et n'écrire que des fonctions pures.
points:
  - icon: layers
    title: La forme d'abord
    text: "(4,) est un vecteur, (3, 2) est trois lignes et deux colonnes. Dites-le avant de calculer."
  - icon: zap
    title: Le calcul vectorisé
    text: "* multiplie élément par élément. @ fait le produit scalaire. Les deux ne se remplacent pas."
  - icon: compass
    title: Broadcasting
    text: Alignez les formes depuis la droite. Seul un axe absent ou égal à 1 a le droit de s'étirer.
  - icon: chart
    title: Voir avant de modéliser
    text: Un nuage avec unités sur les axes montre la pente, le point isolé et l'erreur d'unité.
  - icon: code
    title: Fonction pure
    text: Mêmes arguments, même retour. Le seuil et les données entrent en paramètres, pas en global.
pitfall: Une forme (3, 1) contre (1, 3) réussit et fabrique un tableau 3 par 3 que vous n'aviez pas demandé.
remember: Si vous ne pouvez pas dire quelle dimension s'étire, ne lancez pas l'opération.
```
