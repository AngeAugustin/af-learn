---
title: "Excel et Google Sheets, usage professionnel"
description: "Tenir un tableur d'analyse fiable : tableaux structurés, RECHERCHEX, tableaux croisés, aperçu de Power Query, pièges de types et de dates, et le moment de passer à SQL."
duration: 55
objectives:
  - Structurer un tableur pour qu'un collègue puisse le refaire
  - Croiser, rechercher et synthétiser sans casser les chiffres
  - Repérer les pièges de types, de doublons et de dates, et savoir quand quitter le tableur
---

# Le tableur comme atelier

Excel et Google Sheets restent les outils les plus rapides pour un extrait court, un contrôle, ou une restitution qu'un responsable veut annoter. Le problème n'est pas le tableur. C'est le brouillon qui devient la source de vérité : cellules fusionnées, totaux tapés à la main, couleurs à la place de valeurs, et une formule que vous seul comprenez.

Un classeur d'analyse a une feuille de données et une feuille de lecture. La feuille de données ne contient qu'un tableau rectangulaire : une ligne d'en-tête, une ligne par fait, aucun total au milieu, aucune couleur qui porterait une information absente d'une colonne. La feuille de lecture contient les indicateurs, la période, la date d'extraction et la source. Fil & Cie vous envoie chaque lundi un export de commandes. Vous ne réécrivez pas l'export en y insérant des lignes de titre. Vous le chargez tel quel, puis vous travaillez à côté.

Google Sheets et Excel ne s'équivalent pas terme à terme. Les idées de ce chapitre (une seule ligne d'en-tête, des types cohérents, des recherches explicites, un croisement dynamique) valent pour les deux. Les noms de menus diffèrent. Quand un geste est propre à Excel, il est indiqué. Dans Sheets, le séparateur d'arguments suit aussi la locale : virgule ou point-virgule. Vous le voyez tout de suite en ouvrant une fonction.

> [!NOTE]
> Si l'information n'existe que dans la couleur de la cellule ou dans un commentaire, elle n'existe pas pour le prochain calcul. Ajoutez une colonne.

# Tableaux structurés

Dans Excel, vous transformez la plage en tableau structuré (Ctrl+L, ou Ctrl+T selon le raccourci actif). Le tableau porte un nom, `Commandes`, pas `Tableau1`. Les formules utilisent des références structurées : `=SOMME(Commandes[montant_ht])`. Si quelqu'un ajoute une ligne, la formule l'englobe. Une plage figée `A2:A5000` oublie la ligne 5001, sans message d'erreur.

Chaque colonne a un nom stable, court, sans unité cachée. `montant_ht` vaut mieux que `Montant (€) *`. Pas d'espace superflu, pas de colonne « divers ». Une colonne calculée du tableau (`montant_ht` multiplié par un taux) se remplit toute seule sur les nouvelles lignes. Vous ne copiez pas la formule à la main jusqu'en bas : c'est ainsi qu'une ligne reste vide le jour de l'export le plus long.

Dans Google Sheets, convertissez la plage en tableau lorsque la fonction est proposée, sinon figez la ligne d'en-tête, activez le filtre, et nommez la plage. Le principe ne change pas : un rectangle, des noms, aucune ligne de total à l'intérieur des données. Les totaux vivent dans la feuille de lecture ou dans un croisement.

Exemple. L'export Fil & Cie contient `commande_id`, `date_commande`, `statut`, `montant_ht`, `categorie`, `email`. Vous nommez le tableau `Commandes`. Une colonne `est_interne` vaut `=SI(ESTERREUR(CHERCHE("@fil-et-cie.fr";[@email]));0;1)` dans un Excel français. Le croisement filtrera ensuite `est_interne` égal à 0. Le test n'est pas une couleur jaune posée à la main sur « les lignes bizarres ».

| Geste | À faire | À refuser |
| --- | --- | --- |
| En-tête | Une ligne, noms stables | Titres fusionnés sur trois lignes |
| Corps | Une ligne, un fait | Sous-totaux insérés dans les données |
| Formules | Référence au tableau nommé | Plage `A2:A5000` recopiée à la main |
| Information | Une colonne | Une couleur ou un commentaire seul |

# Retrouver une valeur avec RECHERCHEX

Vous avez une feuille `Produits` (`produit_id`, `categorie`, `fournisseur`) et les lignes de commande n'ont que `produit_id`. Il faut ramener la catégorie. `RECHERCHEV` (VLOOKUP) impose que la colonne cherchée soit à gauche et casse dès que quelqu'un insère une colonne. `RECHERCHEX` (XLOOKUP) nomme la colonne de recherche et la colonne renvoyée, séparément. Dans Excel français, sur un tableau structuré :

```text
=RECHERCHEX([@produit_id]; Produits[produit_id]; Produits[categorie]; "Inconnue")
```

Le quatrième argument est la valeur si rien n'est trouvé. Sans lui, une clé inconnue affiche une erreur et peut faire échouer un croisement en aval. Le cinquième argument, le mode de correspondance, doit rester la correspondance exacte (0). La correspondance approximative, héritage de `RECHERCHEV` sans le dernier argument `FAUX`, attribue la catégorie d'un autre produit sans que rien ne saute aux yeux. Google Sheets reprend la même logique. Le séparateur d'arguments suit la locale du classeur :

```text
=XLOOKUP(A2; Produits!A:A; Produits!B:B; "Inconnue")
```

Vous vérifiez le résultat sur trois cas : une clé présente, une clé absente, une clé en double dans `Produits`. Si `produit_id` 1042 apparaît deux fois avec deux catégories, `RECHERCHEX` renvoie la première et ignore le conflit. Le chiffre par catégorie devient alors arbitraire. Vous dédupliquez le référentiel avant la recherche, ou vous stoppez et vous demandez lequel est le bon.

> [!TIP]
> Comptez les lignes avant et après la recherche. Si vous attendiez 12 000 lignes de commande et que le tableau en affiche 12 000, la recherche n'a pas multiplié les lignes. Une jointure de tableur mal construite, elle, peut le faire. `RECHERCHEX` ramène une valeur par ligne. Il ne duplique pas la ligne source.

# Tableaux croisés dynamiques

Le tableau croisé dynamique (dans Sheets : tableau croisé dynamique également) résume sans réécrire de `SOMME.SI`. Vous le construisez à partir du tableau structuré, pas à partir d'une plage qui inclut un titre au-dessus. Lignes : `categorie`. Colonnes : le mois de `date_commande`. Valeurs : somme de `montant_ht`. Filtres : `statut` égal à `payee`, `est_interne` égal à 0.

Le croisement répond à une question, il n'explore pas toutes les combinaisons. « CA HT payé par catégorie et par mois, hors internes » est une question. Ajouter en même temps le pays, le fournisseur, le canal et le jour noie le lecteur et multiplie les petites cases instables.

Méfiez-vous de la moyenne d'une moyenne. Si chaque ligne est une commande, la moyenne de `montant_ht` est le panier moyen. Si vous avez d'abord agrégé par jour, puis demandé la moyenne de ces totaux journaliers, vous ne calculez plus le panier. Vous calculez une moyenne de chiffres d'affaires quotidiens, où un dimanche pèse autant qu'un samedi. Placez le croisement au grain des commandes, ou calculez explicitement `somme / nombre`.

Exemple Fil & Cie. Le croisement de mars montre la laine en baisse et les tissus stables. Vous double-cliquez (ou vous filtrez la source) pour voir les commandes de laine : s'agit-il de moins de commandes, ou de commandes plus petites ? Le croisement ne répond pas tout seul. Il ouvre la vérification. Vous notez à côté la date d'extraction, parce qu'un remboursement saisi le lendemain changera le mois.

> [!WARNING]
> Un croisement posé sur une plage `A1:F100` ne voit pas la ligne 101 du prochain export. Appuyez-vous sur le tableau structuré, ou élargissez la source à des colonnes entières que vous contrôlez, jamais à un rectangle trop court.

# Power Query, le minimum utile

Power Query (Excel : Données, Obtenir des données, puis l'éditeur Power Query) enregistre des étapes de préparation et les rejoue au rafraîchissement. C'est le bon outil quand le même fichier arrive chaque lundi et que vous refaites les mêmes gestes : supprimer les lignes vides, typer les colonnes, filtrer les statuts, écarter les e-mails internes, dépivoter un export où les mois sont en colonnes.

Vous ne « nettoyez » pas à la main un fichier que vous recevrez vingt fois. Chaque geste manuel est une occasion d'oublier un filtre. Une requête Power Query nommée `commandes_payees` montre la liste des étapes à un collègue. Au rafraîchissement, les types sont réappliqués. Un montant lu comme du texte redevient un nombre au même endroit du traitement, pas au hasard d'une colonne que vous avez convertie une fois.

L'aperçu suffit pour ce chapitre. Vous devez reconnaître quatre étapes : choisir la source, typer, filtrer, charger le résultat vers un tableau ou vers le modèle. Le dépivotage sert quand l'export ressemble à « janvier, février, mars » en colonnes : vous le transformez en deux colonnes `mois` et `montant`, sinon aucun croisement propre n'est possible. Le détail du langage M viendra si votre poste en fait l'outil principal. Tant que l'étape tient en une phrase (« garder statut = payee »), vous êtes dans le bon usage.

Google Sheets n'a pas Power Query. L'équivalent léger, pour un besoin simple, est la fonction `QUERY`, qui filtre et agrège une plage avec une requête texte. Dès que les étapes s'enchaînent (types, doublons, plusieurs fichiers, dépivot), vous sortez du bricolage de formules. Soit le fichier reste exceptionnel et vous documentez les gestes, soit le flux est hebdomadaire et il mérite SQL ou un vrai outil de préparation, souvent du côté de l'équipe data.

# Types, doublons et dates

Le tableur devine les types, et il devine mal. Un montant `1 234,50` collé avec une espace insécable ou un symbole euro devient du texte. `SOMME` l'ignore. Le total est trop bas, sans erreur visible. Vous repérez le coup avec un comptage de valeurs numériques et un coup d'œil aux cellules alignées à gauche. Dans Power Query, vous forcez le type nombre avec la locale française, pour que la virgule reste la décimale. Sur un Excel anglais, `1.234,50` et `1,234.50` ne sont pas le même nombre.

Les doublons viennent souvent du grain. L'export « commandes » contient en réalité une ligne par article. Vous comptez les lignes et vous croyez compter les commandes. Le panier moyen s'effondre, le nombre de commandes explose. Avant toute somme de `montant` situé au niveau commande, vous vérifiez l'unicité de `commande_id`. S'il y a des doublons, ou bien l'export est au grain ligne et le montant commande y est répété (ne le somme pas), ou bien le fichier a été concaténé deux fois (dédupliquez sur la clé, après avoir compris pourquoi).

Les dates sont le troisième piège. `03/04/2026` est le 3 avril en locale française et le 4 mars en locale américaine. Un export CSV ouvert par double-clic est converti avant que vous ne voyiez le fichier. Une partie des dates reste en texte (`2026-03-03`), une autre devient de vrais numéros de série Excel. `MOIS` ne s'applique qu'aux vraies dates. Vous importez par Power Query ou par l'assistant d'import, en imposant le format, plutôt que par double-clic. Vous stockez la date dans une colonne typée, et le mois dans une colonne calculée, jamais dans une valeur retapée.

| Symptôme | Cause fréquente | Contrôle |
| --- | --- | --- |
| Somme trop faible | Nombres stockés en texte | Compter les valeurs vraiment numériques |
| Trop de commandes | Export au grain article, ou fichier collé deux fois | Unicité de `commande_id` |
| Mois incohérents | `03/04` lu dans la mauvaise locale | Imposer le format à l'import |
| Semaine en cours minuscule | Période non close comparée à une semaine pleine | Filtrer les semaines complètes |

# Quand passer de Excel à SQL

Le tableur reste le bon outil pour un extrait de quelques dizaines de milliers de lignes, un contrôle ponctuel, ou un fichier que le destinataire va modifier devant vous. Il cesse de l'être quand le même chiffre doit être refait par plusieurs personnes, quand les jointures se multiplient, quand le fichier met du temps à recalculer, ou quand personne ne peut dire quelle version est la bonne.

```diagram
type: decision
title: Rester dans le tableur ou passer à SQL
nodes:
  - question: Le même chiffre doit-il être refait à l'identique par plusieurs personnes ?
    yes: Une requête ou une vue partagée évite les copies divergentes
    no: Un classeur documenté peut suffire pour un usage local
  - question: Faut-il joindre plusieurs tables volumineuses, ou relire plus de quelques centaines de milliers de lignes ?
    yes: SQL exprime le grain et le filtre mieux que des recherches en cascade
    no: Le tableau structuré et le croisement restent adaptés
  - question: Le fichier met-il longtemps à s'ouvrir, ou personne ne sait plus quelle version fait foi ?
    yes: Sortez le calcul de la pièce jointe
    no: Gardez le tableur, avec une feuille Lisez-moi
```

Le seuil de lignes n'est pas une loi. Un croisement sur 30 000 commandes bien structurées est confortable. Une recherche approximative sur un million de lignes, recopiée dans trois classeurs, ne l'est pas. Le critère pratique : si vous avez peur de rafraîchir, ou si deux personnes n'obtiennent pas le même total, le calcul ne vit plus au bon endroit.

Vous ne « quittez » pas Excel pour le principe. Vous y revenez souvent en bout de chaîne : SQL produit l'agrégat propre, le tableur sert à annoter, à simuler un seuil, à préparer trois lignes pour une slide. L'erreur est de garder dans le classeur la jointure fragile et la définition du chiffre d'affaires. Cette définition, une fois partagée, appartient à une requête que l'on peut relire, pas à une formule dans la colonne Z.

# Exercices

## Exercice 1 : Une recherche qui se tait

L'export des lignes de commande Fil & Cie a 12 000 lignes. Vous ramenez la catégorie avec `RECHERCHEV`, colonne d'index 4, sans préciser la correspondance exacte. Après insertion d'une colonne « fournisseur » dans le référentiel, le CA de la laine chute de moitié. Aucune cellule n'affiche d'erreur. Trois clés produit sont absentes du référentiel, et le produit 1042 y figure deux fois.

Expliquez les trois défauts de cette recherche et réécrivez la formule Excel française avec `RECHERCHEX`.

<details>
<summary>Voir la solution</summary>

Premier défaut : `RECHERCHEV` vise une position (la 4e colonne). L'insertion de « fournisseur » décale les colonnes. Vous ramenez le fournisseur, un prix ou une autre catégorie, et la somme par « catégorie » mélange des choses différentes, sans erreur affichée.

Deuxième défaut : sans `FAUX` (correspondance exacte), la recherche approximative peut renvoyer la catégorie d'un produit voisin. Une clé absente ne prévient pas. Elle hérite d'une catégorie.

Troisième défaut : le produit 1042 en double. Même `RECHERCHEX` en exact renvoie la première ligne rencontrée et masque le conflit. Il faut dédupliquer le référentiel, ou stopper tant que les deux catégories n'ont pas été arbitrées. Les trois clés absentes doivent tomber dans une valeur explicite (`"Inconnue"`) pour que le croisement montre un reliquat, pas un trou silencieux.

Formule, Excel français, correspondance exacte par défaut de `RECHERCHEX` :

```text
=RECHERCHEX([@produit_id]; Produits[produit_id]; Produits[categorie]; "Inconnue"; 0)
```

Vous contrôlez ensuite que le nombre de lignes est toujours 12 000, que la somme de `montant` est inchangée, et que la catégorie « Inconnue » isole bien les trois clés manquantes.

</details>

## Exercice 2 : Croisement au mauvais grain

Vous recevez un export où chaque ligne est un article. La colonne `montant_commande_ht` répète le total de la commande sur chaque article. Un collègue pose un tableau croisé : somme de `montant_commande_ht`, lignes = catégorie, et annonce un chiffre d'affaires trois fois trop élevé. Il ajoute ensuite la moyenne de cette somme journalière et l'appelle « panier moyen ».

Dites ce qui est faux dans chaque chiffre, et décrivez le croisement qui répond à « CA HT et panier moyen par catégorie, commandes payées ».

<details>
<summary>Voir la solution</summary>

`montant_commande_ht` est au grain commande, mais la table est au grain article. Sommer cette colonne additionne le même total autant de fois qu'il y a d'articles. D'où un CA gonflé, sans message d'erreur. Il faut soit sommer `montant_ligne_ht` s'il existe, soit revenir à une ligne par commande avant de sommer le montant commande. On ne répartit pas non plus le montant commande « à la catégorie » en le sommant tel quel : une commande multi-catégories serait comptée en entier dans chaque catégorie, ou plusieurs fois. Pour un CA par catégorie, la source doit être le montant des lignes de cette catégorie.

La moyenne des CA journaliers n'est pas le panier. Un jour à une seule grosse commande pèse comme un jour à cent petites. Le panier moyen est la somme du montant des commandes divisée par le nombre de commandes, au grain commande, après déduplication.

Croisement correct, une fois une ligne par commande (ou, pour le CA catégorie, une fois les montants de ligne) : filtre `statut = payee` et hors internes, lignes = `categorie`, valeurs = somme du montant de ligne et, pour le panier global, un calcul séparé somme des montants commande uniques / nombre de `commande_id` distincts. Vous n'appelez pas « panier » la moyenne des totaux journaliers. Vous notez le grain sur la feuille de lecture.

</details>

## Exercice 3 : Tableur ou SQL ?

Classez chaque situation : rester dans un tableur documenté, ou passer le calcul dans SQL (ou le confier à une vue partagée). Une phrase de justification à chaque fois.

1. Contrôler 800 lignes d'un avoir fournisseur, que la comptable veut annoter cet après-midi.
2. Chaque lundi, douze personnes recalculent le CA HT par catégorie à partir de trois exports, et deux totaux circulent déjà.
3. Joindre commandes, lignes, produits et remboursements sur 1,2 million de lignes, avec un filtre de dates récurrent.
4. Simuler sur un agrégat déjà extrait (vingt catégories, deux ans) l'effet d'un seuil de rupture à 5 % puis à 10 %.

<details>
<summary>Voir la solution</summary>

1. Tableur. Le volume est faible, l'usage est ponctuel, et l'annotation manuelle fait partie du travail. Une feuille Lisez-moi indique la source et l'heure de l'extrait. Inutile d'industrialiser un avoir unique.

2. SQL ou vue partagée. Le chiffre est récurrent, collectif, et déjà divergent. Le classeur personnel est le problème. La définition du CA HT doit vivre dans une requête relisible, même si le graphique final est collé dans une slide.

3. SQL. Plusieurs tables, un volume qui dépasse le confort du tableur, un filtre que l'on rejouera. Les recherches en cascade masqueraient les doublons de jointure. Une requête avec un grain explicite se contrôle mieux.

4. Tableur, en bout de chaîne. L'agrégat est petit et la simulation (5 % contre 10 %) est un jeu de scénario pour la réunion. Vous ne ramenez pas les 1,2 million de lignes dans le classeur pour tester deux seuils. SQL a déjà produit les vingt lignes. Excel sert à comparer les scénarios et à les commenter.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Tableur d'analyse
center: "Un rectangle typé, des recherches exactes, un croisement au bon grain. Le reste part en SQL."
points:
  - icon: list
    title: Un tableau nommé
    text: "Une ligne d'en-tête, une ligne par fait, des formules qui suivent le tableau, pas une plage courte."
  - icon: search
    title: RECHERCHEX exact
    text: "Nommez les colonnes, prévoyez l'introuvable, et dédupliquez le référentiel avant de chercher."
  - icon: chart
    title: Croiser au bon grain
    text: "La somme d'un montant répété et la moyenne de totaux journaliers ne sont pas le CA ni le panier."
  - icon: tool
    title: Rejouer, pas refaire
    text: "Power Query ou une requête partagée rejoue types et filtres. Le geste manuel s'oublie."
  - icon: alert
    title: Texte, doubles, dates
    text: "Un nombre en texte, un id en double ou un 03/04 mal lu faussent le total sans message."
  - icon: database
    title: Quitter à temps
    text: "Dès que plusieurs personnes doivent retrouver le même chiffre, il ne vit plus dans une pièce jointe."
pitfall: "Sommer un montant de commande répété sur chaque article, et annoncer un CA plusieurs fois trop grand."
remember: "Comptez les lignes et testez une clé absente avant de croire une recherche ou un croisement."
```
