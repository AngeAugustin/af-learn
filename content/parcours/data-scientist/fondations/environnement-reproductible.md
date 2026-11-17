---
title: Un environnement d'expérience reproductible
description: Isoler les dépendances, fixer les graines aléatoires, versionner le code d'une expérience et laisser les données volumineuses hors de Git.
duration: 55
objectives:
  - Isoler un projet avec venv ou uv et des versions épinglées
  - Relancer le même tirage grâce à une graine fixée
  - Choisir le notebook pour chercher et le script pour conclure
  - Ranger data/raw et data/processed sans les committer
---

# Une expérience que l'on peut relancer

Un résultat de Data Scientist est une **affirmation chiffrée** : « sur les paiements de mars, la règle des 600 € coûte 680 € de moins que le seuil B ». Cette phrase n'a de valeur que si une autre personne, six mois plus tard, peut la **recalculer** et tomber sur le même ordre de grandeur. Sinon vous avez un souvenir, pas une expérience.

Trois choses doivent être rejouables :

- le **code**, dans l'ordre, sans cellule oubliée ;
- les **versions** des bibliothèques, parce que le défaut d'un algorithme change ;
- la **donnée**, identifiée par sa date et son volume, même si le fichier lui-même ne voyage pas dans Git.

Exemple concret. Vous annoncez une erreur moyenne de **265 €** sur **4 600** biens. Un collègue relance le notebook, obtient **310 €**, et personne ne sait lequel des deux chiffres était dans le mail à la direction. L'écart vient souvent d'un détail banal : autre version de scikit-learn, cellule exécutée dans le désordre, ou extrait du 12 mars contre extrait du 2 avril (**18 400** lignes contre **19 050**). Ce chapitre ferme ces trois portes.

# Isoler les dépendances

N'installez pas pandas « dans le Python de la machine ». Le projet A peut avoir besoin de NumPy **2.1.3** pendant que le projet B n'a été essayé qu'avec NumPy **1.26**. Un environnement **par projet** règle le conflit.

Avec la bibliothèque standard, `venv` :

```bash
python -m venv .venv
.venv\Scripts\activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Sous macOS ou Linux, l'activation est `source .venv/bin/activate`. Le principe est le même : le `python` de ce terminal n'est plus celui du système.

Avec **uv**, plus rapide pour créer l'environnement et installer :

```bash
uv venv
uv pip install -r requirements.txt
```

Dans les deux cas, le fichier qui compte s'appelle souvent `requirements.txt` et il **épingle** les versions que vous avez réellement fait tourner :

```text
numpy==2.1.3
pandas==2.2.3
matplotlib==3.9.2
scikit-learn==1.5.2
```

`numpy==2.1.3` n'est pas un conseil de version universelle. C'est un contrat : l'expérience des loyers a été chiffrée avec celle-ci. `numpy>=2` accepterait une 2.4 sortie l'an prochain, dont un défaut a pu changer, et votre erreur de 265 € ne serait plus comparable.

Pour figer ce que le venv contient vraiment :

```bash
python -m pip freeze > requirements.txt
```

Relisez le fichier avant de le committer. Vous y voulez les bibliothèques du calcul, pas un outil de debug installé une après-midi. uv peut aussi verrouiller un projet décrit dans `pyproject.toml` : le principe reste un fichier de versions, relu et versionné. Choisissez venv ou uv, pas les deux dans le même dépôt sans le dire dans le README.

> [!IMPORTANT]
> Le README tient en quelques lignes : comment créer l'environnement, quelle commande relance le chiffre du rapport, et quel extrait de données (date, nombre de lignes) a servi.

# Fixer les graines aléatoires

Beaucoup d'étapes tirent au sort : un échantillon, un ordre de mélange, une initialisation. Sans **graine**, deux lancements donnent deux chiffres, et vous ne savez pas si le modèle a changé ou si le hasard a bougé.

```python
import numpy as np

rng = np.random.default_rng(7)
tirage_a = rng.normal(loc=42.0, scale=8.0, size=5)

rng = np.random.default_rng(7)
tirage_b = rng.normal(loc=42.0, scale=8.0, size=5)
# tirage_a et tirage_b sont identiques
```

`default_rng(7)` construit un générateur dont la graine vaut **7**. Recréez-le avec la même graine avant le tirage que vous voulez identique. Ne réutilisez pas un générateur déjà avancé en croyant qu'il est « encore à 7 » : chaque appel le fait avancer. Deux appels `normal` de suite sur le **même** `rng` ne se répètent pas. Deux générateurs **recrées** avec 7, si.

La graine ne rend pas le résultat « vrai ». Elle le rend **stable**. Un échantillon de 400 clients autour d'une moyenne de 42 € bouge encore d'un échantillon à l'autre si vous changez la graine. C'est le sujet du chapitre d'inférence. Ici, vous voulez que la graine 7 reproduise l'échantillon du rapport, et que la graine 8 soit un **autre** essai, nommé comme tel.

Le même contrat existe plus loin dans les outils de modèles : un argument `random_state=42` fixe le découpage ou l'initialisation. Notez le nombre dans la configuration de l'expérience (`seed: 42`), pas seulement dans un coin du notebook. Si vous lancez cinq graines (7, 11, 42, 99, 123) pour voir la dispersion, publiez les **cinq** erreurs, par exemple 258 €, 271 €, 265 €, 249 € et 280 €, pas seulement la plus flatteuse (249 €).

```diagram
type: flow
title: Relancer le même chiffre
steps:
  - title: Environnement
    text: venv ou uv, versions épinglées
    tone: blue
  - title: Graine
    text: Un entier noté, recréé avant le tirage
    tone: teal
  - title: Donnée datée
    text: "Extrait du 12 mars, 18 400 lignes"
    tone: amber
  - title: Une commande
    text: Le script, pas une cellule isolée
    tone: violet
```

# Notebook pour chercher, script pour conclure

Le **notebook** est un bon établi. Vous y regardez 20 lignes, un histogramme, une idée de variable. Il garde le récit à côté des graphiques. Il est mauvais comme source unique d'un chiffre officiel, parce que l'état de la mémoire dépend de l'**ordre** dans lequel vous avez lancé les cellules.

Scène classique. Cellule 1 : `n = 400`. Cellule 2, un essai que vous avez oublié : `n = 50`. Cellule 3 :

```python
import math

ecart_type = 20.0
marge = 1.96 * ecart_type / math.sqrt(n)
```

Avec n = 400, la marge vaut 1,96 × 20 / 20 = **1,96**. Avec n = 50, elle vaut 1,96 × 20 / √50 ≈ **5,54**. Vous relancez seulement la cellule 3, le texte au-dessus parle encore de 400 clients, et le mail part avec 5,54. Les deux nombres sont des vrais calculs. Un seul correspond à l'échantillon annoncé.

La règle de travail :

1. **Chercher** dans le notebook. Y laisser les impasses, c'est utile.
2. **Copier** les étapes retenues dans un script, par exemple `src/train.py`, qui lit ses réglages au début et affiche le chiffre à la fin.
3. **Citer** dans le rapport uniquement ce que le script affiche quand on le lance sur un environnement frais.

```bash
python src/train.py --seed 42
```

Une commande, un ordre, une sortie. Le notebook reste la narration. Le script est la preuve que la narration se rejoue. Si les deux divergent, le script gagne, et vous corrigez le texte.

# Git suit le code, pas les données

**Git** versionne le travail que vous relisez : scripts, notebook d'exploration, `requirements.txt`, fichier de réglages, README. Un commit correspond à une expérience que vous sauriez nommer.

```text
seed: 42
seuil_montant: 600
test_size: 0.25
```

Message de commit possible : « Comparer la régression logistique à la règle des 600 € sur l'extrait de mars. » Dans six mois, `git log` raconte les essais. `git checkout` retrouve le script qui produisait 265 €, à condition que la donnée de mars soit encore identifiée.

Vous ne commitez pas l'environnement (`.venv/`, des centaines de mégaoctets régénérables) ni les caches (`__pycache__/`, `.ipynb_checkpoints/`). Un checkpoint de notebook réapplique de vieilles sorties et donne l'illusion qu'une cellule a été relancée.

```diagram
type: compare
title: Ce qui entre dans Git
columns:
  - title: On versionne
    tone: teal
    items:
      - src/train.py et le notebook d'exploration
      - requirements.txt épinglé
      - Réglages (graine, seuil) et README
      - .gitignore
  - title: On laisse dehors
    tone: rose
    items:
      - .venv et les caches
      - data/raw, souvent des centaines de Mo
      - data/processed, que le script reconstruit
      - Le chiffre collé dans un mail sans commande
```

Relisez `git status` avant chaque commit. Si un fichier de données apparaît, ce n'est pas « du bonus » : c'est le signe que l'ignore est incomplet.

# raw, processed, et les fichiers à ne pas committer

Séparez la donnée **reçue** de la donnée **calculée**. La première ne se réécrit pas. La seconde doit pouvoir être jetée et reconstruite.

```text
experience-loyers/
  data/
    raw/            # extrait du 12 mars 2026, 18 400 lignes
    processed/      # matrices prêtes, recalculables
  notebooks/
    exploration.ipynb
  src/
    train.py
  requirements.txt
  README.md
  .gitignore
```

`data/raw/` est une archive. Si votre script y écrit, vous perdez la possibilité de repartir du même extrait. Un filtre « je supprime les loyers au-dessus de 4 000 € » s'applique dans `processed`, ou mieux en mémoire au début du script, avec le seuil **4 000** écrit dans les réglages. Ainsi, relancer avec 5 000 € est un changement visible, pas une modification silencieuse du fichier source.

`.gitignore` minimal :

```text
.venv/
__pycache__/
.ipynb_checkpoints/
data/raw/
data/processed/
```

Ne commitez pas les fichiers volumineux. Un CSV de **1,8 Go** ajouté par erreur est téléchargé par chaque clone. Un commit ultérieur qui l'efface ne l'enlève **pas** de l'historique : Git garde les objets. Le dépôt devient lourd pour toujours, sauf une réécriture d'historique que vous ne voulez pas découvrir un vendredi.

À la place, notez dans le README **où** se trouve l'extrait et **ce qu'il contient** : « fichier `loyers_2026-03-12.csv`, 18 400 lignes, 12 colonnes, déposé sur le partage d'équipe, non versionné. » Un collègue qui n'a pas le fichier doit obtenir une erreur claire (« extrait introuvable »), pas un autre chiffre calculé sur un vieux jeu resté dans son dossier personnel.

Le même réflexe vaut pour les modèles enregistrés s'ils pèsent des centaines de mégaoctets. Le script qui les **reconstruit** à partir de la graine, des versions et de l'extrait daté est le livrable. Le fichier de poids est un cache.

# Exercices

## Exercice 1 : L'environnement de mars

Vous reprenez un projet dont le README dit seulement « installer pandas et scikit-learn ». Le mail de mars annonçait **265 €** d'erreur moyenne. En réinstallant les dernières versions, vous obtenez **298 €**, sans avoir touché au script.

1. Quelle information manque pour trancher entre un vrai changement de résultat et un changement d'outillage ?
2. Que doit contenir `requirements.txt` pour fermer cette ambiguïté ?
3. Citez la commande `venv` qui crée un environnement local nommé `.venv`.

<details>
<summary>Voir la solution</summary>

1. Les **versions** exactes utilisées en mars (et l'extrait de données, et la graine). Sans elles, 298 € peut venir de scikit-learn, de pandas, ou d'un autre fichier.
2. Des versions **épinglées**, par exemple `pandas==2.2.3` et `scikit-learn==1.5.2`, celles du calcul de mars, pas `pandas` seul ni `pandas>=2`.
3. `python -m venv .venv`, puis activation et `python -m pip install -r requirements.txt`. L'équivalent uv est `uv venv` suivi de `uv pip install -r requirements.txt`.

</details>

## Exercice 2 : Quelle graine a servi ?

```python
import numpy as np

rng = np.random.default_rng(7)
a = rng.normal(loc=100.0, scale=12.0, size=3)
b = rng.normal(loc=100.0, scale=12.0, size=3)
```

1. `a` et `b` sont-ils égaux ? Pourquoi ?
2. Réécrivez le tirage pour que le second vecteur reproduise le premier.
3. Vous avez lancé les graines 7, 11 et 42, avec des erreurs de 258 €, 271 € et 249 €. Laquelle citez-vous dans le résumé, et que faites-vous des autres ?

<details>
<summary>Voir la solution</summary>

1. **Non.** C'est le même générateur, déjà avancé après `a`. Le second appel consomme la suite du tirage, il ne revient pas à la graine 7.
2. Recréer le générateur : `rng = np.random.default_rng(7)` une seconde fois, puis rappeler `normal` avec les mêmes arguments.
3. Vous citez les **trois** (258 €, 271 €, 249 €), ou leur dispersion, pas seulement 249 €. Choisir la graine la plus flatteuse après coup n'est pas une reproductibilité, c'est un tri.

</details>

## Exercice 3 : Que commite-t-on ?

Un dossier pèse 2,1 Go. Dites pour chaque élément s'il va dans Git.

1. `src/train.py` (4 Ko) et `config.yaml` avec `seed: 42`.
2. `.venv/` (400 Mo).
3. `data/raw/loyers_2026-03-12.csv` (1,8 Go, 18 400 lignes).
4. `data/processed/matrice.parquet`, reconstruit en 20 secondes par le script.
5. Le README qui indique le chemin du partage et la commande `python src/train.py --seed 42`.

<details>
<summary>Voir la solution</summary>

1. **Oui.** Code et réglages.
2. **Non.** Régénérable par `python -m venv .venv` ou `uv venv`, et lourd. Il va dans `.gitignore`.
3. **Non.** Trop lourd, et un commit ne se « défait » pas vraiment : l'historique garderait les 1,8 Go. On documente la date et les 18 400 lignes.
4. **Non.** C'est un cache. S'il faut 20 secondes pour le reconstruire, le script suffit.
5. **Oui.** Sans ce mode d'emploi, le reste n'est pas rejouable par quelqu'un d'autre.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Expérience reproductible
center: Le chiffre du rapport doit ressortir d'une commande, avec les mêmes versions et la même graine.
points:
  - icon: lock
    title: Un environnement par projet
    text: venv ou uv, et un requirements.txt épinglé. numpy==2.1.3 est un contrat, pas un slogan.
  - icon: key
    title: La graine est notée
    text: Recréez default_rng(7) pour rejouer un tirage. Publiez toutes les graines, pas la plus belle.
  - icon: file
    title: Notebook puis script
    text: Le notebook cherche. Le script, lancé d'une traite, est le seul chiffre que vous citez.
  - icon: git
    title: Git garde le code
    text: Scripts, réglages, README. Pas le .venv, pas les checkpoints, pas le CSV d'1,8 Go.
  - icon: database
    title: raw ne se réécrit pas
    text: L'extrait daté reste intact. processed se jette et se reconstruit. Le README dit où est le fichier.
pitfall: Relancer une seule cellule et envoyer la marge calculée avec n = 50 alors que le texte parle de n = 400.
remember: Versions épinglées, graine écrite, extrait daté, une commande. Sans les quatre, le chiffre ne se défend pas.
```
