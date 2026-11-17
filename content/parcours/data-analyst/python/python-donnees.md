---
title: Python pour l'analyste
description: "Le minimum de Python pour un analyste : variables, listes, dictionnaires, fonctions, lecture CSV, aperçu de pandas, notebook ou script, et le moment où le tableur ne suffit plus."
duration: 55
objectives:
  - Choisir entre Excel et Python selon le volume, la répétition et le public du résultat
  - Manipuler variables, listes, dictionnaires et fonctions sur un cas de commandes
  - Lire un export CSV avec la bibliothèque standard, puis l'ouvrir avec pandas
  - Distinguer un notebook d'exploration et un script relançable, dans un environnement isolé
---

# Quand Python bat Excel

Vous savez déjà filtrer un tableau et construire un tableau croisé dynamique. Ce chapitre ne fait pas de vous un développeur. Il vous donne le Python utile le lundi matin, quand l'export d'**Atelier Nord** (meubles et déco) ne tient plus dans un classeur confortable, ou quand le même calcul revient chaque semaine.

Excel ou Google Sheets restent le bon outil dans trois cas. Le fichier est petit (quelques milliers de lignes). Une personne doit **modifier des cellules** et renvoyer le fichier. Le travail est unique, fait à côté du demandeur. Un budget de 40 lignes que la direction ajuste à la main n'a pas besoin d'un script.

Python devient le meilleur choix quand au moins une de ces contraintes apparaît.

- **Volume.** Un export de 400 000 lignes de commandes s'ouvre mal, les tableaux croisés rament, et une copie du classeur pèse des dizaines de mégaoctets.
- **Répétition.** Chaque lundi, quatorze fichiers régionaux subissent les mêmes six contrôles. Dans un classeur, un filtre oublié ou un tri collé au mauvais endroit change le chiffre sans laisser de trace.
- **Plusieurs fichiers.** Joindre les commandes, les produits et les remboursements par identifiant, sur douze mois d'historiques, est pénible et fragile en feuilles.
- **Traçabilité.** Un script dit, ligne après ligne, quelles commandes ont été gardées. Un classeur dont on a copié les valeurs ne le dit plus.

Le chiffre officiel de l'entreprise, s'il existe déjà dans l'entrepôt ou l'outil de BI, ne se recalcule pas dans un coin. Python sert à explorer, à contrôler et à produire une analyse que le tableur ne porte plus. Il ne sert pas à créer un second chiffre d'affaires parallèle.

```diagram
type: decision
title: Excel ou Python pour cette analyse ?
nodes:
  - question: Le fichier est-il trop lourd, ou le même calcul revient-il chaque semaine sur plusieurs exports ?
    yes: Python (script, ou notebook si vous explorez encore)
    no: Question suivante
  - question: Quelqu'un doit-il modifier le résultat à la main et le renvoyer au format classeur ?
    yes: Excel ou Sheets, quitte à préparer les données en Python puis à exporter un petit fichier
    no: Python, même sur un petit volume, dès que le calcul doit pouvoir être relancé à l'identique
```

# Variables, listes et dictionnaires

Une **variable** est un nom collé sur une valeur. Vous la relisez ensuite, au lieu de retaper le nombre.

```python
canal = "email"
montant = 40.0
payee = True
```

`canal` est du texte (`str`), `montant` un nombre à virgule (`float`), `payee` un booléen (`True` ou `False`). Un entier (`int`) suffit pour un identifiant ou un effectif : `n_commandes = 3`.

Deux pièges d'analyste, pas de développeur. D'abord, le texte `"40"` et le nombre `40` ne s'additionnent pas : il faut convertir. Ensuite, l'argent en `float` accumule des poussières (`0.1 + 0.2` ne vaut pas exactement `0.3`). Pour un total affiché, arrondissez à deux décimales au moment de présenter. Pour une somme sensible au centime, le module `decimal` de la bibliothèque standard est plus sûr. Sur un contrôle de chiffre d'affaires, un écart de quelques centimes entre Python et Excel vient souvent de là, pas d'une commande perdue.

Une **liste** garde des valeurs dans l'ordre, doublons compris. Les indices commencent à 0.

```python
montants = [40.0, 25.0, 15.0]
montants[0]          # 40.0
len(montants)        # 3
sum(montants)        # 80.0
```

Un **dictionnaire** associe une clé à une valeur. C'est le bon réflexe pour un total par canal, ou pour une ligne d'export (le nom de colonne pointe vers la cellule).

```python
ca_par_canal = {"email": 55.0, "seo": 25.0}
ca_par_canal["email"]                 # 55.0
ca_par_canal["paid_social"] = 0.0     # ajoute une clé
```

Vous parcourez une liste avec `for`. Ici, chaque commande est elle-même un dictionnaire, comme une ligne de tableau.

```python
commandes = [
    {"id": 1, "canal": "email", "statut": "payee", "montant": 40.0},
    {"id": 2, "canal": "seo", "statut": "payee", "montant": 25.0},
    {"id": 3, "canal": "email", "statut": "annulee", "montant": 40.0},
    {"id": 4, "canal": "email", "statut": "payee", "montant": 15.0},
]

totaux = {}
for commande in commandes:
    if commande["statut"] != "payee":
        continue
    canal = commande["canal"]
    totaux[canal] = totaux.get(canal, 0) + commande["montant"]
# totaux vaut {"email": 55.0, "seo": 25.0}
```

`dict.get(cle, 0)` évite l'erreur quand le canal apparaît pour la première fois. Sans le filtre sur `payee`, le canal email afficherait 95 au lieu de 55 : l'annulation de 40 € serait encore dans le chiffre. C'est exactement le filtre oublié dans un tableau croisé, sauf qu'ici il est écrit.

# Fonctions pour réutiliser un calcul

Une **fonction** nomme un calcul que vous referiez sinon en copiant-collant. Vous lui passez des paramètres, elle **retourne** un résultat avec `return`.

```python
def ca_paye(commandes, canal):
    total = 0.0
    for commande in commandes:
        if commande["statut"] == "payee" and commande["canal"] == canal:
            total += commande["montant"]
    return round(total, 2)

ca_paye(commandes, "email")   # 55.0
```

Le nom dit l'intention métier (`ca_paye`), pas le geste technique (`boucle1`). Les paramètres rendent le calcul réutilisable : le même corps sert pour `"seo"`, puis pour le fichier de la semaine prochaine, sans réécrire la boucle.

Quelques habitudes suffisent.

- Une fonction fait **une chose** que vous pouvez résumer dans son nom. `ca_paye` ne devrait pas aussi envoyer un e-mail.
- Elle reçoit ses données en paramètres. Elle ne va pas chercher toute seule un fichier `C:\Users\Camille\Downloads\export (3).csv` caché dans le corps.
- `return` rend la valeur à l'appelant. Un `print` affiche seulement : la ligne d'après ne peut pas réutiliser ce qui a été affiché.

Quand le même nettoyage s'applique à douze exports régionaux, vous écrivez la fonction une fois, puis vous l'appelez douze fois. La correction d'un bug (par exemple oublier les commandes partiellement remboursées) se fait à un seul endroit.

# Lire un CSV avec la bibliothèque standard

Le CSV est le format que les outils acceptent presque tous : une ligne par enregistrement, des colonnes séparées par une virgule ou, très souvent en France, par un **point-virgule**. Le module `csv` est livré avec Python. Vous n'installez rien.

```python
import csv

def ca_par_canal(chemin):
    totaux = {}
    with open(chemin, newline="", encoding="utf-8-sig") as fichier:
        lecteur = csv.DictReader(fichier, delimiter=";")
        for ligne in lecteur:
            if ligne["statut"] != "payee":
                continue
            montant = float(ligne["montant"].replace(" ", "").replace(",", "."))
            canal = ligne["canal"]
            totaux[canal] = totaux.get(canal, 0.0) + montant
    return {canal: round(valeur, 2) for canal, valeur in totaux.items()}
```

Ce qu'il faut voir, dans l'ordre.

`with open(...)` ouvre le fichier et le referme même si une ligne casse. `encoding="utf-8-sig"` lit de l'UTF-8 et ignore le caractère invisible que Excel ajoute parfois en début de fichier. Si Python lève `UnicodeDecodeError`, l'export est sans doute en `cp1252` (Excel Windows ancien) : relisez avec cet encodage, puis enregistrez une copie UTF-8 pour ne plus deviner. Le symptôme inverse, des `Ã©` à la place de `é`, veut dire que de l'UTF-8 a été lu comme un autre encodage.

`delimiter=";"` est indispensable sur un export français. Sans lui, toute la ligne reste une seule colonne et `ligne["statut"]` n'existe pas. `DictReader` utilise la première ligne comme noms de colonnes : `ligne["montant"]` est plus lisible que « la troisième case ».

`newline=""` laisse le module `csv` gérer les retours à la ligne. `replace(",", ".")` transforme `1 234,50` en un nombre que `float` comprend. Sur un vrai fichier, testez cette conversion sur dix lignes avant de l'appliquer à l'année.

La boucle ne charge pas une « base » : elle regarde **une ligne à la fois**. Un export de plusieurs millions de lignes peut ainsi être totalisé sur un ordinateur portable, tant que vous n'entassez pas toutes les lignes dans une liste « au cas où ».

```diagram
type: flow
title: D'un export CSV à un chiffre par canal
steps:
  - title: Export
    text: CSV, souvent en point-virgule, encodage UTF-8 ou cp1252
    tone: amber
  - title: Lecture
    text: csv.DictReader, une ligne à la fois
    tone: blue
  - title: Filtre
    text: Garder le statut qui correspond à la question
    tone: teal
  - title: Agrégat
    text: Somme du montant par canal, arrondie à l'affichage
    tone: violet
```

> [!WARNING]
> Un CSV ne transporte pas les types. Tout arrive en texte, y compris les dates et les montants. La virgule décimale, le point-virgule et l'encodage sont les trois raisons les plus fréquentes pour lesquelles « le fichier est faux » alors que le fichier est seulement français.

# Premier contact avec pandas

**pandas** est la bibliothèque de tableaux la plus utilisée par les analystes. Vous l'installez (voir la section suivante), puis vous chargez le même export en une table, le *DataFrame*.

```python
import pandas as pd

commandes = pd.read_csv(
    "commandes.csv",
    sep=";",
    decimal=",",
    encoding="utf-8-sig",
)
commandes["montant"] = pd.to_numeric(commandes["montant"], errors="coerce")
payees = commandes.loc[commandes["statut"].eq("payee")]
ca = payees.groupby("canal", as_index=False)["montant"].sum()
```

`read_csv` reconnaît l'en-tête, `sep` et `decimal` règlent l'export français, et `groupby` remplace la boucle de la section précédente. Sur les quatre commandes de l'exemple, `ca` contient email à 55 et seo à 25. Le chapitre suivant détaille sélection, filtre, agrégat et jointure. Ici, retenez le geste : **lire, filtrer, agréger, vérifier le nombre de lignes**.

Vérifier, concrètement :

```python
commandes.head()          # les premières lignes, pas une preuve de qualité
commandes.shape           # (nombre de lignes, nombre de colonnes)
payees["montant"].sum()   # le total, à recouper avec une somme connue
```

`head()` montre un aperçu. Il ne dit pas si la dernière ligne est tronquée, si un canal est vide, ou si les annulations sont encore dans le total. Gardez un ordre de grandeur en tête (le CA payé de la semaine dernière, le nombre de commandes annoncé par la boutique) et comparez. Un script qui « tourne » et un chiffre juste sont deux choses différentes.

pandas charge la table **en mémoire**. C'est parfait pour des centaines de milliers de lignes, souvent acceptable jusqu'à quelques millions, inconfortable au-delà sur un portable. Le chapitre sur pandas et Polars dit quoi faire à ce moment-là. Pour un contrôle ligne à ligne sans installer de bibliothèque, le module `csv` suffit déjà.

# Jupyter, script et environnement

Deux façons de lancer Python servent des moments différents.

Le **notebook** (Jupyter, ou le même format dans VS Code et Cursor) mélange texte, code et résultat. Il est excellent pour explorer : vous chargez l'export, vous regardez `head()`, vous essayez un filtre, vous montrez le graphique au marketing. Son défaut est l'ordre d'exécution. Si vous relancez la cellule du haut sans relancer celle du milieu, la variable `commandes` ne correspond plus à ce qui est écrit à l'écran. Le chiffre affiché en bas peut dater d'un filtre que vous avez effacé.

Le **script** (un fichier `ca_hebdo.py`) s'exécute de haut en bas. Relancé, il refait le même chemin. C'est la forme à viser dès que l'analyse revient, ou dès qu'un collègue doit la reprendre pendant vos congés. Un usage sain : explorer dans le notebook, puis copier les étapes utiles dans un script quand le calcul se stabilise.

Un **environnement** isole les bibliothèques de ce projet. pandas n'est pas dans la bibliothèque standard : sans environnement, vous l'installez dans l'interpréteur global de la machine, et le prochain projet casse le précédent en changeant de version.

```text
py -3 -m venv .venv
.venv\Scripts\activate
python -m pip install pandas
python -m pip freeze > requirements.txt
```

`venv` crée un dossier `.venv` propre au projet. L'activation (sous Windows, la commande `Scripts\activate`) fait pointer `python` et `pip` vers ce dossier. `requirements.txt` liste ce que vous avez installé, avec les numéros de version. Un collègue recrée le même environnement au lieu de découvrir, le jour de la restitution, que `read_csv` n'a pas le même comportement.

> [!TIP]
> Le notebook et le script doivent utiliser **le même** environnement. Un résultat que vous ne reproduisez que dans « le Jupyter de mon poste » n'est pas encore une analyse que l'équipe possède.

Vous n'avez pas besoin, pour analyser, de classes, de frameworks web ni d'algorithmes de concours. Vous avez besoin de nommer des valeurs, de parcourir des lignes, d'isoler un calcul dans une fonction, de lire le CSV tel qu'il est vraiment, et de pouvoir relancer tout cela la semaine prochaine.

# Exercices

## Exercice 1 : Excel ou Python

Pour chaque demande, dites si vous restez dans le tableur ou si vous passez à Python, et pourquoi.

1. La directrice financière veut modifier une hypothèse de marge sur 25 lignes et renvoyer le fichier avant 18 h.
2. Chaque lundi, vous recevez 14 CSV régionaux (environ 30 000 lignes chacun) et vous produisez le même récapitulatif de CA payé par canal.
3. Le responsable marketing s'assoit à côté de vous pour regarder, une seule fois, 800 réponses à une enquête.

<details>
<summary>Voir la solution</summary>

1. **Tableur.** Le fichier est petit, et la valeur du travail est que quelqu'un modifie des cellules puis partage le classeur.
2. **Python.** Le volume et surtout la répétition rendent le copier-coller fragile. Un script applique le même filtre aux 14 fichiers et se relance le lundi suivant.
3. **Tableur**, pour cette séance unique à deux. Si l'enquête revient au trimestre prochain avec les mêmes questions, vous figerez alors le traitement dans un script plutôt que de retrouver les filtres de mémoire.

</details>

## Exercice 2 : Trois défauts dans la lecture

Ce script doit totaliser le montant des commandes **payées**. L'export d'Atelier Nord est un CSV français : point-virgule, montants du type `1 234,50`, statut dans la colonne `statut`. Trouvez au moins trois défauts.

```python
import csv

total = 0
with open("commandes.csv") as fichier:
    for ligne in csv.DictReader(fichier):
        total += float(ligne["montant"])
print(total)
```

<details>
<summary>Voir la solution</summary>

1. **Séparateur.** `DictReader` attend des virgules par défaut. Sur un fichier en point-virgule, les colonnes ne sont pas séparées et `ligne["montant"]` échoue, ou le montant n'est pas celui que vous croyez.
2. **Virgule décimale et espaces.** `float("1 234,50")` lève une erreur. Il faut retirer les espaces de milliers et remplacer la virgule par un point, ou laisser pandas le faire avec `decimal=","`.
3. **Pas de filtre métier.** Les commandes annulées et remboursées entrent dans le total. Le chiffre n'est pas le CA payé.
4. Bonus : aucun `encoding`. Un export Excel en `cp1252`, ou un UTF-8 avec indicateur de début de fichier, peut faire échouer la lecture ou coller un caractère invisible au nom de la première colonne.

</details>

## Exercice 3 : Ce que la fonction retourne

Sans exécuter le code, donnez la valeur de `synthese(commandes)` pour la liste suivante. Justifiez le sort des deux lignes qui ne sont pas des ventes payées.

```python
commandes = [
    {"canal": "email", "statut": "payee", "montant": 40},
    {"canal": "email", "statut": "annulee", "montant": 40},
    {"canal": "seo", "statut": "payee", "montant": 25},
    {"canal": "email", "statut": "payee", "montant": 10},
    {"canal": "seo", "statut": "payee", "montant": 0},
]

def synthese(commandes):
    resultat = {}
    for ligne in commandes:
        if ligne["statut"] != "payee":
            continue
        if ligne["montant"] <= 0:
            continue
        canal = ligne["canal"]
        resultat[canal] = resultat.get(canal, 0) + ligne["montant"]
    return resultat
```

<details>
<summary>Voir la solution</summary>

`{"email": 50, "seo": 25}`

La commande annulée de 40 € est ignorée par le test sur `statut`. La ligne seo de montant 0 est ignorée par le test `montant <= 0` : elle ne change pas le total, et elle ne crée pas non plus de clé si aucune autre ligne seo payée et positive n'existait. Ici une ligne seo de 25 € existe, donc la clé `seo` vaut 25. Email cumule 40 + 10.

Le `0` n'est pas une erreur de données dans cet énoncé : la fonction décide explicitement de ne pas le compter. Dans une vraie analyse, vous écririez ce choix (les commandes à 0 € sont hors CA) plutôt que de le laisser implicite.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Python pour l'analyste
center: "Python refait un calcul fiable quand Excel sature, sans faire de vous un développeur."
points:
  - icon: scale
    title: Excel ou Python
    text: "Tableur pour un petit fichier modifié à la main. Python si le volume ou la répétition rend le classeur fragile."
  - icon: code
    title: Le minimum utile
    text: "Variables, listes, dictionnaires et fonctions suffisent pour filtrer des commandes et totaliser un canal."
  - icon: file
    title: CSV tel qu'il est
    text: "Séparateur, encodage et virgule décimale se règlent avant l'agrégat, avec csv puis avec pandas."
  - icon: terminal
    title: Script relançable
    text: "Le notebook explore. Le script refait le chemin de haut en bas, dans un environnement à part."
  - icon: alert
    title: Un chiffre de contrôle
    text: "head() n'est pas une validation. Recoupez le total et le nombre de lignes avec un ordre de grandeur connu."
pitfall: "Un notebook exécuté dans le désordre, ou un CSV français lu avec les réglages par défaut, produit un chiffre sûr d'apparence et faux."
remember: "Python est le bon outil quand le calcul doit pouvoir être relancé, pas quand il s'agit de modifier vingt cellules ensemble."
```
