---
title: Pandas et Polars
description: "Manipuler un DataFrame d'e-commerce : sélection, filtre, groupby et merge, puis choisir entre pandas et Polars selon la taille du fichier et le mode lazy."
duration: 60
objectives:
  - Sélectionner, filtrer et agréger un DataFrame de commandes
  - Relier commandes, lignes et produits sans dupliquer le chiffre d'affaires
  - Lire un plan Polars lazy et le comparer à l'exécution immédiate de pandas
  - Choisir pandas, Polars ou le SQL de l'entrepôt selon la question et le volume
---

# Le DataFrame, une table en mémoire

Un **DataFrame** est une table : des lignes, des colonnes nommées, un type par colonne. pandas l'appelle `DataFrame`, Polars aussi. Pour Atelier Nord, une ligne de `commandes` est une commande, pas une ligne de panier. Cette précision (le *grain*) décide de tout ce que vous additionnerez ensuite.

```python
import pandas as pd

commandes = pd.read_csv(
    "commandes.csv",
    sep=";",
    decimal=",",
    parse_dates=["date"],
)
commandes.shape          # (18420, 6) par exemple : 18 420 commandes, 6 colonnes
commandes.dtypes
```

Les colonnes typiques de ce chapitre : `id`, `date`, `client_id`, `canal`, `statut`, `montant`. Le fichier `lignes.csv` détaille chaque article (`commande_id`, `produit_id`, `quantite`, `prix_unitaire`). Le fichier `produits.csv` porte `produit_id`, `nom`, `categorie`.

Avant un calcul, regardez trois choses. Le nombre de lignes, pour le comparer à ce que la boutique annonce. Les types, parce qu'un montant encore en texte ne se somme pas comme un nombre. Les premières valeurs de `statut` et de `canal`, parce que `"Payée"`, `"payee"` et `"paid"` feront trois groupes.

Polars se lit presque de la même façon, avec un vocabulaire un peu différent.

```python
import polars as pl

commandes_pl = pl.read_csv("commandes.csv", separator=";", try_parse_dates=True)
commandes_pl.schema
```

pandas accepte beaucoup de libertés et devine souvent les types. Polars est plus strict : une colonne qui mélange des nombres et le texte `"N/A"` ne devient pas silencieuse. Cette sévérité est pénible cinq minutes, utile ensuite, parce que l'erreur apparaît au chargement plutôt que dans un total trop petit.

# Sélectionner des colonnes et des lignes

Sélectionner, c'est ne garder que ce qui sert la question. Le CA par canal n'a pas besoin de l'adresse de livraison.

```python
colonnes = commandes[["date", "canal", "statut", "montant"]]
une_colonne = commandes["montant"]          # une Series, pas une table
mars = commandes.loc[commandes["date"].between("2026-03-01", "2026-03-31")]
```

`loc` sélectionne par **étiquettes** et par conditions. `iloc` sélectionne par **position** (la ligne 0, les cinq premières). Préférez `loc` tant que vous pensez en colonnes métier. `iloc` dépend de l'ordre du fichier : un tri plus haut dans le notebook et vous n'extrayez plus les mêmes commandes.

Deux écritures à ne pas mélanger :

```python
commandes["canal"]                 # une colonne
commandes[["canal", "montant"]]    # une table à deux colonnes
```

Avec Polars, la sélection de colonnes est explicite.

```python
commandes_pl.select(["date", "canal", "statut", "montant"])
```

> [!NOTE]
> `between` en pandas **inclut** les deux bornes. Un filtre du 1er au 8 mars et un filtre du 8 au 15 mars comptent deux fois la journée du 8. Pour des semaines qui se suivent, faites finir la première la veille du début de la suivante, ou travaillez sur des semaines déjà étiquetées dans une colonne.

# Filtrer les commandes qui comptent

Le filtre est la décision métier la plus fréquente, et la plus silencieuse quand elle est fausse. « Le CA de mars » n'est pas « toutes les lignes dont la date tombe en mars ».

```python
payees = commandes.loc[
    commandes["statut"].eq("payee")
    & commandes["montant"].gt(0)
    & commandes["date"].between("2026-03-01", "2026-03-31")
]
```

Le `&` (et) et le `|` (ou) travaillent **ligne à ligne**. Le mot Python `and` ne le fait pas : il essaie de réduire toute la colonne à un seul vrai ou faux, et il échoue ou, pire, ne veut pas dire ce que vous croyez. Chaque condition est entre parenthèses, parce que `&` est prioritaire sur les comparaisons.

Gardez une trace du filtre :

```python
print(len(commandes), len(payees), payees["montant"].sum())
```

Si vous passez de 18 420 commandes à 17 100 payées, demandez-vous si 1 320 annulations ou montants nuls sont plausibles pour Atelier Nord ce mois-là. Un filtre sur `"Payée"` alors que le fichier contient `"payee"` donne zéro ligne : le script a l'air correct, le total est nul, et personne n'a « cassé » le fichier.

En Polars, le filtre nomme les colonnes avec `pl.col`, ce qui évite de répéter le nom de la table.

```python
payees_pl = commandes_pl.filter(
    (pl.col("statut") == "payee") & (pl.col("montant") > 0)
)
```

Les valeurs manquantes dans la colonne filtrée ne passent pas un test `==`. Une commande sans statut disparaît du filtre `statut == "payee"` sans rejoindre pour autant un groupe « inconnu ». Le chapitre sur le nettoyage revient sur ce point. En attendant, comptez les manquants **avant** de filtrer.

```python
commandes["statut"].isna().sum()
```

# Agréger avec groupby

`groupby` résume un grain fin en un grain plus grossier : des commandes deviennent un CA par canal, ou par canal et par mois.

```python
resume = (
    payees.groupby("canal", as_index=False)
    .agg(
        ca=("montant", "sum"),
        commandes=("id", "nunique"),
        panier=("montant", "mean"),
    )
    .sort_values("ca", ascending=False)
)
```

`as_index=False` laisse `canal` dans une colonne, plus simple à exporter et à fusionner ensuite. `nunique` compte les commandes distinctes. `count` compterait les lignes non vides : sur une table déjà au grain commande, les deux coïncident, sur une table de lignes panier ils divergent.

Contrôle obligatoire : la somme des CA par canal doit retrouver le CA total des commandes payées.

```python
ecart = payees["montant"].sum() - resume["ca"].sum()
```

Un écart proche de zéro (aux centimes de flottants près) est bon signe. Un écart net veut souvent dire que des `canal` manquants ont été **exclus** du `groupby` (c'est le comportement par défaut de pandas) pendant que le total, lui, les incluait. Remplacez les canaux vides par le libellé `"inconnu"` avant d'agréger, pour que les parts somment à 100 %.

```python
payees = payees.copy()
payees["canal"] = payees["canal"].fillna("inconnu")
```

Le même agrégat en Polars :

```python
resume_pl = (
    payees_pl.group_by("canal")
    .agg(
        pl.col("montant").sum().alias("ca"),
        pl.col("id").n_unique().alias("commandes"),
        pl.col("montant").mean().alias("panier"),
    )
    .sort("ca", descending=True)
)
```

Pour un suivi marketing, le grain « canal × semaine » se fait en groupant sur deux colonnes. Vous obtenez alors une ligne par couple, par exemple email sur la semaine du 2 mars. N'appelez pas cette ligne « le CA email » tout court : c'est le CA email **de cette semaine**.

# Relier deux tables avec merge

Le CA par catégorie n'est pas dans `commandes`. Il se construit en reliant les lignes de panier aux produits.

```python
lignes = pd.read_csv("lignes.csv", sep=";")
produits = pd.read_csv("produits.csv", sep=";")
detail = lignes.merge(produits, on="produit_id", how="left", indicator=True)
detail["montant_ligne"] = detail["quantite"] * detail["prix_unitaire"]
```

`how="left"` garde **toutes** les lignes de panier. Celles dont le `produit_id` n'existe pas dans le catalogue arrivent avec une catégorie vide. `indicator=True` ajoute une colonne `_merge` : `both` si le produit a été trouvé, `left_only` sinon. Comptez les `left_only` avant de publier un CA par catégorie. Les passer sous silence diminue le CA classé, pas forcément le CA total, et le total des catégories ne retombe plus sur le total boutique.

`how="inner"` jette ces lignes. C'est légitime seulement si la question est « parmi les produits encore au catalogue ». Dites-le dans le titre du tableau.

Le piège qui double le chiffre d'affaires : la table de droite n'est pas unique sur la clé. Si `produits` contient deux fiches pour le même `produit_id` (une ancienne catégorie, une nouvelle), chaque ligne de panier est dupliquée et `montant_ligne` est sommé deux fois.

```python
print(produits["produit_id"].duplicated().sum())
print(len(lignes), len(detail))
```

Si `detail` a plus de lignes que `lignes`, arrêtez-vous. Dédoublonnez le catalogue (en général on garde la fiche la plus récente) **avant** le merge. Un merge n'est pas une décoration : il change le nombre de lignes, donc les sommes.

Autre piège de grain. La commande 1042 vaut 80 € TTC, frais de port de 8 € compris, et elle a deux lignes d'articles. Si vous recopiez `montant` de la commande sur chaque ligne puis que vous somme, vous comptez 160 €. Les frais de port et les remises au niveau commande ne se ventilent pas en les répétant. Ou bien vous analysez au grain commande, ou bien vous répartissez explicitement les frais (par exemple au prorata des lignes) et vous écrivez la règle.

Polars nomme l'opération `join` :

```python
detail_pl = lignes_pl.join(produits_pl, on="produit_id", how="left")
```

Le contrôle est le même : unicité de la clé à droite, comparaison du nombre de lignes avant et après.

# Pandas ou Polars

pandas exécute chaque instruction tout de suite et garde le résultat en mémoire. C'est idéal dans un notebook, sur un extrait qui tient largement en RAM (l'export mensuel, l'enquête, le fichier que le marketing vient d'envoyer). L'écosystème autour (exports Excel, beaucoup de tutoriels, des fonctions de stats et de graphiques) est la raison pour laquelle pandas reste le défaut de l'analyste.

Polars peut travailler en **lazy** : vous décrivez le filtre, l'agrégat et le tri, et rien n'est lu tant que vous n'appelez pas `collect()`. Le moteur réorganise le plan. Il peut ne lire que les colonnes utiles et filtrer pendant la lecture, sur plusieurs cœurs.

```python
ca = (
    pl.scan_csv("commandes.csv", separator=";")
    .filter(pl.col("statut") == "payee")
    .group_by("canal")
    .agg(pl.col("montant").sum().alias("ca"))
    .sort("ca", descending=True)
    .collect()
)
```

`scan_csv` ne charge pas le fichier. `collect()` lance le plan optimisé. Sur 20 000 lignes, vous ne verrez pas la différence avec pandas. Sur quelques millions de lignes, Polars est souvent nettement plus rapide et plus économe en mémoire. Ce n'est pas une raison pour réécrire un notebook d'exploration déjà clair.

```diagram
type: compare
title: pandas et Polars pour un analyste
columns:
  - title: pandas
    tone: blue
    items:
      - Exécution immédiate, confortable dans un notebook
      - Idéal quand la table tient largement en mémoire
      - Écosystème large (Excel, graphiques, exemples)
      - Les types devinés peuvent masquer un mélange texte et nombres
  - title: Polars
    tone: teal
    items:
      - Mode lazy, plan optimisé au moment du collect()
      - Plusieurs cœurs, plus à l'aise sur de gros CSV
      - Types plus stricts, erreurs plus tôt
      - Moins d'exemples métier, API à apprendre à côté de pandas
```

Il existe un troisième choix, souvent meilleur que les deux : laisser l'agrégat dans le **SQL** de l'entrepôt, si la table y est déjà à jour. Exporter dix millions de lignes vers un portable pour refaire un `groupby` que la base calcule en une requête alourdit l'analyse et crée un chiffre décalé. pandas et Polars excellent sur un extrait, un fichier reçu par e-mail, un contrôle, une jointure que vous ne pouvez pas encore faire dans l'outil BI.

> [!TIP]
> Commencez en pandas tant que vous construisez le raisonnement. Passez à Polars en lazy quand le fichier se met à peser ou quand le notebook devient lent. Passez au SQL de l'équipe data quand le chiffre doit être le même que celui du tableau de bord.

# Exercices

## Exercice 1 : Filtrer puis agréger

La table `commandes` a les colonnes `id`, `date`, `canal`, `statut`, `montant`. Écrivez le code pandas qui calcule, pour mars 2026, le CA et le nombre de commandes **payées** de montant strictement positif, par canal. Les canaux manquants doivent apparaître sous le libellé `inconnu`, et la somme des CA par canal doit pouvoir être recoupée avec le total.

<details>
<summary>Voir la solution</summary>

```python
mars = commandes.loc[
    commandes["statut"].eq("payee")
    & commandes["montant"].gt(0)
    & commandes["date"].between("2026-03-01", "2026-03-31")
].copy()
mars["canal"] = mars["canal"].fillna("inconnu")
resume = mars.groupby("canal", as_index=False).agg(
    ca=("montant", "sum"),
    commandes=("id", "nunique"),
)
# contrôle : resume["ca"].sum() contre mars["montant"].sum()
```

Le `copy()` évite de modifier la table d'origine en remplaçant les canaux vides. Sans `fillna`, pandas retire en général les clés manquantes du `groupby`, et la somme des canaux est alors inférieure au total. `nunique` sur `id` compte des commandes, pas des doublons de lignes si l'export a répété une commande.

</details>

## Exercice 2 : Le merge qui gonfle le CA

`lignes` a 10 000 lignes et un `produit_id` par ligne. `produits` devrait avoir une fiche par produit, mais 120 `produit_id` y sont en double (ancienne et nouvelle catégorie). Vous faites `lignes.merge(produits, on="produit_id", how="left")`, puis vous somme `quantite * prix_unitaire`.

1. Que devient le nombre de lignes ?
2. Que devient le CA ?
3. Que faites-vous avant de publier le tableau par catégorie ?

<details>
<summary>Voir la solution</summary>

1. Le détail a **plus** de 10 000 lignes. Chaque ligne de panier dont le produit est doublé dans le catalogue est répétée.
2. Le CA est **gonflé** : les lignes dupliquées sont additionnées plusieurs fois. Le total n'est plus celui de la boutique.
3. Vous vérifiez `produits["produit_id"].duplicated().sum()`, vous ne gardez qu'une fiche par produit (la plus récente, selon une règle écrite), vous refaites le merge, et vous contrôlez que le nombre de lignes n'a pas changé. `indicator=True` sert ensuite à compter les produits introuvables, qui sont un autre problème (CA non classé), pas le même que le doublon.

</details>

## Exercice 3 : pandas, Polars ou SQL

Quel outil choisissez-vous dans chaque cas ?

1. Explorer un export de 8 000 lignes que le service client vient d'envoyer en CSV, et tracer deux graphiques.
2. Agréger un CSV de 6 millions de lignes sur votre portable de 16 Go de RAM, avec un filtre puis une somme par jour.
3. Publier le CA officiel par canal, déjà calculable dans l'entrepôt que le tableau de bord interroge.

<details>
<summary>Voir la solution</summary>

1. **pandas.** Petit volume, exploration, graphiques. Polars fonctionnerait, mais vous n'y gagnez rien ici.
2. **Polars en lazy** (`scan_csv`, filtre, `group_by`, `collect`). Le plan peut ne lire que les colonnes utiles et utiliser plusieurs cœurs. Un `read_csv` pandas de 6 millions de lignes risque de saturer la mémoire selon la largeur du fichier.
3. **SQL dans l'entrepôt.** Le chiffre officiel doit avoir une seule source. Réexporter pour refaire le `groupby` en local crée un second CA, qui dérivera dès que la règle métier changera d'un côté seulement.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Pandas et Polars
center: "Un DataFrame se filtre, s'agrège et se joint en gardant le même total qu'avant le calcul."
points:
  - icon: filter
    title: Filtrer avec &
    text: "Le et ligne à ligne s'écrit &, avec des parenthèses. and ne filtre pas une colonne."
  - icon: chart
    title: groupby contrôlé
    text: "La somme des groupes doit retrouver le total. Les clés manquantes ont un libellé, pas un silence."
  - icon: link
    title: merge honnête
    text: "Clé unique à droite, même nombre de lignes après un left, sinon le CA est dupliqué."
  - icon: zap
    title: Lazy Polars
    text: "scan puis collect : Polars optimise le plan. Utile quand le CSV devient lourd pour pandas."
  - icon: database
    title: SQL si c'est officiel
    text: "Le chiffre du tableau de bord se calcule dans l'entrepôt, pas dans un second export local."
pitfall: "Un catalogue en double sur produit_id, ou des canaux vides exclus du groupby, change le CA sans message d'erreur."
remember: "Avant de publier, comparez le nombre de lignes et la somme après le filtre, l'agrégat et la jointure."
```
