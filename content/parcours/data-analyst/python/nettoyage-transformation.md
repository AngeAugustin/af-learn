---
title: Nettoyage et transformation
description: "Rendre une table d'e-commerce analysable : types, dates, doublons, manquants, valeurs extrêmes, textes, catégories, grain, et un journal de ce qui a été modifié."
duration: 60
objectives:
  - Convertir montants et dates sans perdre des lignes en silence
  - Repérer doublons, mauvais grain et valeurs manquantes avant d'agréger
  - Examiner les valeurs extrêmes et normaliser textes et catégories
  - Tenir un journal de nettoyage qui permet de refaire et d'expliquer le chiffre
---

# Typer les colonnes avant de calculer

Un CSV n'a pas de types. Tant que `montant` est du texte, le tri place `"9"` après `"80"` (l'ordre alphabétique) et la somme échoue ou, si vous avez forcé une conversion trop tôt, des lignes disparaissent. Le premier geste sur l'export d'Atelier Nord est de **déclarer** ce que chaque colonne devrait être, puis de compter ce qui n'a pas pu l'être.

```python
import pandas as pd

commandes = pd.read_csv("commandes.csv", sep=";", dtype="string")
commandes["montant"] = (
    commandes["montant"].str.replace("\u00a0", "", regex=False).str.replace(" ", "", regex=False).str.replace(",", ".", regex=False)
)
commandes["montant"] = pd.to_numeric(commandes["montant"], errors="coerce")
commandes["id"] = pd.to_numeric(commandes["id"], errors="coerce").astype("Int64")
```

`dtype="string"` empêche pandas de deviner trop tôt (un code postal `04100` ne doit pas devenir le nombre `4100`). `errors="coerce"` transforme l'inconvertible en manquant, au lieu de faire planter le script au milieu d'un fichier de 80 000 lignes. Ce n'est pas une autorisation d'ignorer ces lignes : vous les comptez.

```python
n_montants_illisibles = commandes["montant"].isna().sum()
```

Trois textes `"N/A"`, `"-"`, ou une cellule vide, ce n'est pas la même décision que 3 000 montants illisibles (mauvais séparateur, colonne décalée). Dans le premier cas, vous notez trois commandes à regarder. Dans le second, vous arrêtez le nettoyage et vous réparez la lecture.

`Int64` avec une majuscule, en pandas, est un entier qui **accepte** les manquants. `int` classique refuse une seule valeur vide et vous pousse à remplir par 0, ce qui inventerait des identifiants.

Le type guide aussi la jointure. Un `produit_id` texte `"1042"` et un `produit_id` entier `1042` ne se rejoignent pas : le merge « réussit » avec zéro correspondance. Alignez les types des clés avant de conclure que le catalogue est vide.

# Dates, heures et fuseaux

`03/04/2026` est le 3 avril en France et le 4 mars aux États-Unis. Sur un export français, dites-le au parseur.

```python
commandes["date"] = pd.to_datetime(
    commandes["date_texte"],
    dayfirst=True,
    errors="coerce",
)
print(commandes["date"].isna().sum())
```

Comptez les dates devenues manquantes (`NaT`). Une date `31/04/2026` ou un texte `"à confirmer"` doit apparaître dans le journal, pas dans le CA d'avril par hasard.

Si la colonne contient une heure, distinguez l'instant et le fuseau. Une commande enregistrée `2026-03-29 02:30` à Paris, la nuit du changement d'heure, peut être ambiguë. Pour un CA **par jour civil français**, convertissez en `Europe/Paris` puis tronquez au jour. Pour comparer des pays, stockez l'instant en UTC et ne passez à l'heure locale qu'à l'affichage. Un filtre « jusqu'à minuit » sans fuseau mélange la fin de journée de Paris et celle de Montréal.

Le filtre de période a un second piège, déjà rencontré : `between` inclut les deux bords. Pour des semaines successives, construisez des intervalles qui ne partagent pas un jour.

```python
semaine = commandes.loc[
    (commandes["date"] >= "2026-03-02") & (commandes["date"] < "2026-03-09")
]
```

La borne de fin est exclue. La semaine suivante commence le 9 mars à 00:00, sans reprendre le 8. Documentez le calendrier : semaine du lundi, jour de commande, ou jour d'expédition. Le marketing et la finance n'utilisent pas toujours le même.

# Doublons et grain des données

Un **doublon** est une ligne répétée que le métier ne veut compter qu'une fois. Le **grain** est ce que représente une ligne quand elle n'est pas un doublon. Les deux questions se posent avant la première somme.

Sur un export relancé deux fois, le même `id` de commande apparaît deux fois. Parfois les lignes sont identiques. Parfois la seconde a un statut plus récent (`payee` puis `remboursee`).

```python
n_ids_doublons = commandes["id"].duplicated().sum()
commandes = commandes.sort_values("mis_a_jour")
commandes = commandes.drop_duplicates(subset=["id"], keep="last")
```

`keep="last"` ne veut dire « le plus récent » que si vous avez trié sur la date de mise à jour. Sans ce tri, « last » veut dire « la dernière ligne du fichier », ce qui dépend de l'humeur de l'export.

Le grain se vérifie par une phrase. « Une ligne égale une commande » autorise `montant.sum()` comme CA. « Une ligne égale un article » autorise la somme de `quantite * prix_unitaire`, pas la somme d'un total de commande répété sur chaque article. La commande 1042 vaut 80 €, dont 8 € de frais de port, et contient deux articles à 36 €. Répéter 80 € sur les deux lignes produit 160 €. Ignorer les frais de port produit 72 €. Les deux chiffres sont calculables. Un seul correspond à la question « argent encaissé sur cette commande ».

Quand vous changez de grain, écrivez la règle des montants qui ne vivent qu'à l'étage du dessus : frais de port, remise panier, avoir global. Les ventiler au prorata du montant des lignes est une règle possible. La taire n'en est pas une.

```diagram
type: flow
title: Avant d'additionner
steps:
  - title: Phrase de grain
    text: "Une ligne représente une commande, un article, ou un jour ?"
    tone: violet
  - title: Clé
    text: "Quel identifiant devrait être unique à ce grain ?"
    tone: blue
  - title: Doublons
    text: "Même clé plusieurs fois : export double, ou statut plus récent ?"
    tone: teal
  - title: Somme
    text: "Le montant additionné vit-il vraiment à ce grain ?"
    tone: amber
```

# Valeurs manquantes

Un manquant n'est pas un zéro. Zéro commande ce jour-là veut dire « nous savons qu'il n'y a rien eu ». Un montant vide veut dire « nous ne savons pas ». Remplir les montants vides par 0 crée de fausses commandes gratuites et baisse le panier moyen. Supprimer toute ligne incomplète peut aussi baisser le CA, si le montant était renseigné mais le canal vide.

Choisissez selon la colonne et la question.

| Situation | Geste prudent | Pourquoi |
| --- | --- | --- |
| Montant illisible | Laisser manquant, sortir la ligne du CA, la compter | 0 € inventerait une vente |
| Canal vide, montant connu | Libellé `inconnu`, garder la ligne dans le total | Le CA existe, le classement non |
| Quantité vide sur une ligne article | Ne pas deviner 1 | Vous créeriez du chiffre |
| E-mail client vide | Laisser vide | Il ne sert pas au CA, et l'inventer est inutile |

```python
n_canal_vide = commandes["canal"].isna().sum()
commandes["canal"] = commandes["canal"].fillna("inconnu")
ca = commandes.loc[commandes["montant"].notna(), "montant"].sum()
```

`dropna()` sans liste de colonnes jette une ligne dès qu'**une** colonne est vide. Sur une table large (adresse, téléphone, canal, montant), vous pouvez perdre des ventes parfaitement chiffrées à cause d'un téléphone absent. Limitez le critère : `dropna(subset=["id", "montant"])`.

Dans un `groupby`, pandas écarte aussi les clés manquantes. Le `fillna("inconnu")` ci-dessus est ce qui aligne la somme des canaux sur le total. Vérifiez-le.

```python
par_canal = commandes.groupby("canal")["montant"].sum()
# par_canal.sum() doit retrouver ca, aux centimes près
```

Dites le taux de manquants dans la note, pas seulement dans le code. « 2 % des commandes n'ont pas de canal, elles sont dans Inconnu » change la lecture d'une part de marché. Un trou à 40 % change la confiance dans le tableau.

# Valeurs extrêmes, textes et catégories

Une **valeur extrême** se regarde avant de se supprimer. Le CA n'est pas une cloche : quelques grosses commandes B2B sont réelles. Une règle automatique du type « au-delà de trois écarts-types, on efface » coupera ces commandes et baissera le chiffre d'affaires d'Atelier Nord sans raison métier.

```python
commandes["montant"].quantile([0.5, 0.9, 0.99, 1])
commandes.nlargest(10, "montant")[["id", "date", "canal", "montant"]]
```

Vous comparez le maximum au quantile 99 %. Un panier médian autour de 40 €, un 99e centile à 400 € et une commande à 99 999 € méritent une lecture de la ligne. Trois explications reviennent souvent. Une commande test (`client@example.com`, montant rond). Une erreur d'unité, le prix en centimes (`12 999` au lieu de `129,99`). Une vraie commande professionnelle, à garder dans le CA et à sortir du **panier typique**. Supprimer, garder, ou isoler : la décision va dans le journal, avec le nombre de lignes.

Les textes se fragmentent tout seuls. `" Lyon"`, `"lyon"` et `"LYON"` font trois villes et partagent un CA qui devrait être un.

```python
commandes["ville"] = commandes["ville"].str.strip().str.lower()
```

`strip` retire les espaces aux bords, `lower` aligne la casse. Pour l'affichage vous pourrez remettre une capitale, après avoir regroupé. Ne corrigez pas les fautes de frappe à la main dans une cellule : une règle (`"lyon  "` → `lyon`) se réapplique la semaine prochaine, un correctif manuel non.

Les catégories se recensent avec les manquants visibles.

```python
commandes["statut"].str.strip().str.lower().value_counts(dropna=False)
```

`"Payée"`, `"payee"`, `"paid"` et `"PAYEE "` sont un seul statut métier. Une table de correspondance explicite vaut mieux qu'une longue chaîne de remplacements oubliés.

```python
statuts = {
    "payée": "payee",
    "payee": "payee",
    "paid": "payee",
    "annulée": "annulee",
    "canceled": "annulee",
}
commandes["statut"] = commandes["statut"].str.strip().str.lower().replace(statuts)
```

Ce qui ne figure pas dans la table reste visible au prochain `value_counts`. Vous voyez les nouveaux libellés au lieu de les faire tomber dans un filtre qui ne les reconnaît pas.

# Tenir un journal de nettoyage

Le journal est la liste de ce que vous avez changé, pour que le chiffre soit défendable. Il peut vivre en tête du script, dans un tableau markdown de la note, ou dans un petit CSV `journal_nettoyage.csv` produit par le code. Chaque ligne dit la date, la règle, les lignes touchées, et la décision.

| Date | Règle | Lignes | Décision |
| --- | --- | --- | --- |
| 2026-03-16 | Montant non numérique | 3 | Exclues du CA, listées |
| 2026-03-16 | Doublon d'`id`, garde la mise à jour la plus récente | 420 | Une commande = un id |
| 2026-03-16 | Canal vide | 180 | Libellé `inconnu` |
| 2026-03-16 | E-mail `@example.com` | 14 | Commandes test, hors CA |
| 2026-03-16 | Commande 88312 à 99 999 € | 1 | Conservée, commande B2B confirmée |

Sans journal, deux analystes sur le même export publient deux CA et ne savent plus lequel a retiré les tests. Avec le journal, la discussion porte sur la règle (les tests doivent-ils sortir ?) et non sur un écart inexplicable.

Le code peut alimenter le journal au lieu de le rédiger de mémoire après coup.

```python
journal = []
masque_test = commandes["email"].fillna("").str.endswith("@example.com")
journal.append({"regle": "commandes test", "lignes": int(masque_test.sum())})
commandes_analyse = commandes.loc[~masque_test].copy()
```

Une transformation qui ne change pas le nombre de lignes (mettre la ville en minuscules) se journalise aussi : elle change les effectifs par ville. Relisez le journal comme si vous étiez la personne qui signe le chiffre. Si une ligne dit « j'ai retiré les gros montants » sans dire combien ni pourquoi, la règle n'est pas prête.

> [!IMPORTANT]
> Nettoyer n'est pas rapprocher les données d'une moyenne. C'est rendre chaque ligne fidèle à une définition (une commande réelle, un jour, un statut) et pouvoir le montrer.

# Exercices

## Exercice 1 : Quelle date, quel CA de semaine

L'export français contient la date texte `03/04/2026`. Vous calculez le CA de la semaine du lundi 30 mars 2026 au dimanche 5 avril 2026, avec un filtre `date >= 2026-03-30` et `date < 2026-04-06`.

1. Avec `dayfirst=True`, à quel jour cette commande appartient-elle, et entre-t-elle dans la semaine ?
2. Sans `dayfirst` (lecture mois/jour), que se passe-t-il ?
3. Pourquoi la borne de fin est-elle exclue ?

<details>
<summary>Voir la solution</summary>

1. `dayfirst=True` lit le **3 avril 2026**. Ce jour est dans la semaine (du 30 mars inclus au 6 avril exclu), la commande entre dans le CA si les autres filtres (statut, test, montant) sont passés.
2. Sans `dayfirst`, beaucoup d'outils lisent le **4 mars 2026**. La commande sort de la semaine d'avril et gonfle mars. Le script ne plante pas : le CA est simplement dans le mauvais mois.
3. La borne exclue empêche le 6 avril à 00:00, qui est le lundi suivant, de compter dans les deux semaines. Un `between` aurait inclus les deux extrémités et, si la semaine suivante commence le même jour, compterait ce jour deux fois.

</details>

## Exercice 2 : Le grain des frais de port

La commande 1042 a un total encaissé de 80 €, dont 8 € de frais de port, et deux lignes article de 36 € chacune. Un collègue joint le total de la commande sur chaque ligne, puis somme cette colonne.

1. Quel CA obtient-il pour cette commande ?
2. Quel CA correspond à l'argent encaissé ?
3. Quelle phrase de grain manque dans sa note ?

<details>
<summary>Voir la solution</summary>

1. Il obtient **160 €**, parce que 80 € est répété sur deux lignes.
2. L'argent encaissé est **80 €**. La somme des articles seuls fait 72 € et oublie le port.
3. Il manque une phrase du type : « une ligne du tableau final est un article, le montant sommé est le montant article, les frais de port sont ajoutés une seule fois par commande » (ou une règle de ventilation au prorata, écrite). Sans cette phrase, le total n'a pas de définition.

</details>

## Exercice 3 : Que faire de ces anomalies

Pour chaque cas, dites si vous supprimez, vous recodez, ou vous isolez, et ce que vous inscrivez dans le journal. Il y a 20 000 commandes.

1. 180 canaux vides, montants renseignés, total 22 000 €.
2. 14 e-mails `@example.com` créés par l'équipe QA.
3. Une commande à 99 999 €, le service client confirme un marché B2B.
4. Le quantile 99 % des paniers est à 420 € et le maximum suivant est à 380 €.

<details>
<summary>Voir la solution</summary>

1. **Recoder** en `inconnu`, garder les 22 000 € dans le CA. Journal : 180 lignes, 22 000 € non attribués à un canal. Les supprimer baisserait le chiffre d'affaires pour une question de classement.
2. **Supprimer** du CA commercial (ou isoler dans un indicateur « hors périmètre »). Journal : 14 commandes test, montants retirés du CA publié.
3. **Garder** dans le CA. L'isoler seulement si l'indicateur est un panier typique (médiane, ou moyenne hors B2B). Journal : commande confirmée, non test, non erreur d'unité.
4. Rien à effacer. L'écart entre le 99e centile et le maximum est banal. Une règle « tout ce qui dépasse la moyenne » n'a pas de motif ici. Le journal peut noter « extrêmes relus, aucune exclusion ».

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Nettoyage et transformation
center: "Chaque ligne doit correspondre à une définition écrite, et chaque modification doit pouvoir être recomptée."
points:
  - icon: ruler
    title: Types et dates
    text: "Montants numériques, dates dayfirst, clés du même type. On compte ce qui n'a pas pu être converti."
  - icon: layers
    title: Grain et doublons
    text: "Une ligne, un objet métier. On ne somme un montant que s'il vit à ce grain-là."
  - icon: filter
    title: Manquants
    text: "Vide n'est pas zéro. Un canal vide devient un libellé, un montant vide ne devient pas une vente à 0 €."
  - icon: eye
    title: Extrêmes lus
    text: "On regarde le top 10 avant d'effacer. Une grosse commande B2B n'est pas une erreur statistique."
  - icon: list
    title: Journal
    text: "Règle, nombre de lignes, décision. Deux analystes doivent pouvoir retrouver le même CA."
pitfall: "dropna() sur toute la ligne, ou une coupe à trois écarts-types, retire des ventes réelles sans que le total ne prévienne."
remember: "Le nettoyage se juge à la définition du chiffre, pas à la propreté visuelle du tableau."
```
