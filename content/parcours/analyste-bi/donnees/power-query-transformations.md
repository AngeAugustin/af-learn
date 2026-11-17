---
title: Transformations Power Query
description: "Préparer un rapport dans Power Query : typer, dépivoter, fusionner, colonnes conditionnelles, comprendre le query folding et refuser les longues suites d'étapes opaques."
duration: 55
objectives:
  - "Enchaîner des étapes lisibles : types, filtre, dépivot, fusion, colonne conditionnelle"
  - Expliquer le query folding et reconnaître ce qui le casse
  - Refuser une requête de plusieurs dizaines d'étapes sans intention nommée
  - Décider quand la transformation doit quitter Power Query pour une vue SQL
---

# Une requête, une intention

Power Query enregistre chaque clic comme une **étape**. C'est une force : on peut relire le chemin qui mène du fichier au chiffre. C'est un piège : cinquante clics de nettoyage deviennent cinquante étapes sans phrase, et plus personne ne sait à quel moment le CA perd les avoirs.

Chez Halte Marché, une requête de rapport tient en une intention écrite dans son nom : `Budget_magasin_mois`, `Ventes_filtrees_semaine`, `Magasins_referentiel`. Chaque étape porte, elle aussi, un nom d'intention, pas « Personnalisée 12 ». Vous devez pouvoir lire la liste des étapes à voix haute en revue technique, en moins d'une minute.

L'ordre utile, quand la source est un classeur ou une table :

```diagram
type: flow
title: Intentions, dans un ordre relisible
steps:
  - title: Colonnes
    text: Garder seulement ce que le rapport utilise
    tone: blue
  - title: Filtre
    text: Période et périmètre, le plus tôt possible
    tone: teal
  - title: Types
    text: Date, nombre, texte, avant tout calcul
    tone: amber
  - title: Dépivoter
    text: Les mois en colonnes deviennent des lignes
    tone: violet
  - title: Fusionner
    text: Référentiel magasin, jointure choisie
    tone: rose
  - title: Condition
    text: Vente ou retour, puis noms métier
    tone: blue
```

Cet ordre est une intention de lecture, pas une loi aveugle. Sur une source SQL, le filtre et le choix des colonnes doivent rester **avant** la première étape qui ne peut plus être renvoyée à la base. Le dépivot d'un classeur local, lui, ne sera jamais fait par la base : il n'y a pas de base. Le chapitre revient sur ce point avec le query folding.

Vous ne mélangez pas, dans la même requête, le budget, les ventes et une règle de campagne temporaire. Trois intentions, trois requêtes, fusionnées ensuite si la page en a besoin. Une requête qui « fait tout » ne se relit plus.

```video
url: https://www.youtube.com/watch?v=0aeZX1l4JT4
title: "How to use Microsoft Power Query"
channel: "Kevin Stratvert"
duration: "16:35"
lang: en
why: "Une prise en main de Power Query pas à pas : importer, nettoyer et transformer sans formule."
```

# Typer avant de calculer

Power Query devine les types. Sur un export de caisse français, il se trompe souvent. `1 234,50` reste du texte, ou devient un nombre faux si le séparateur n'est pas celui de votre poste. `16/11/2026` peut être lu comme le 11 juin sur un poste réglé autrement. `0142`, code magasin, perd son zéro et ne joint plus avec le référentiel.

Vous fixez les types **dès que la colonne existe**, et vous les revérifiez après un dépivot : la colonne des montants revient fréquemment en texte.

Règles pratiques pour Halte Marché :

- les montants HT sont des nombres décimaux, après suppression des espaces et remplacement de la virgule si la source est un texte ;
- les dates de caisse sont des dates, sans heure, alignées sur le jour de gestion et non sur l'horloge du poste ;
- les codes magasin et produit restent du **texte**, même s'ils ne contiennent que des chiffres ;
- les colonnes que vous ne savez pas typer ne sont pas « laissées en générique » : vous les retirez, ou vous demandez la définition.

Un calcul sur du texte ne se voit pas toujours comme une erreur. Il peut concaténer, ou ignorer des lignes. Le total est alors trop bas, avec une requête qui « fonctionne ». Le contrôle du chapitre qualité (total contre la finance) rattrape ce que l'œil ne voit pas. Le type, lui, se fixe avant, pas après la plainte du contrôleur.

> [!WARNING]
> Ne corrigez pas un type en multipliant par 1 « pour voir ». Si la conversion échoue sur quelques lignes, ces lignes portent souvent les montants les plus sales, justement ceux qu'il ne faut pas perdre en silence. Isolez les erreurs de conversion et comptez-les.

# Dépivoter, fusionner, colonnes conditionnelles

Trois transformations couvrent la majorité des fichiers de pilotage. Les autres (découper une colonne, remplacer une valeur) restent des étapes nommées, rares, justifiées.

**Dépivoter.** Le budget arrive ainsi : une ligne par magasin, puis une colonne par mois (`nov_2026`, `dec_2026`, …). Aucun rapport sérieux ne filtre un mois qui est un nom de colonne. Vous gardez `magasin_id` en place, et vous dépivotez les colonnes de mois. Résultat : `magasin_id`, `mois`, `montant_budget`. Le grain devient magasin-mois, joignable au CA réel. Vous retirez les colonnes de totaux déjà présentes dans le classeur (« Total an ») **avant** le dépivot, sinon le total annuel redescend en ligne et double le budget dès qu'on le somme.

**Fusionner.** Vous ramenez la région et le format depuis le référentiel magasin. Vous choisissez la jointure comme en SQL. Pour un budget qui doit rester complet, une jointure externe gauche **depuis le budget** : un magasin inconnu reste visible. Pour un référentiel que vous voulez épurer, vous ne partez pas des ventes. Après la fusion, vous développez seulement `region` et `format`, pas toutes les colonnes du référentiel. Puis vous vérifiez que le nombre de lignes n'a pas augmenté. S'il augmente, le référentiel a deux lignes pour le même `magasin_id`.

**Colonne conditionnelle.** Elle classe, elle ne recalcule pas le CA officiel. Exemples légitimes : si `montant_ht` est négatif, libellé « Avoir », sinon « Vente » ; si `format` est vide, libellé « Magasin non référencé ». Exemple à refuser : une condition qui remet le CA à zéro pour « masquer » les franchises. Ce filtre doit être visible sur la page, pas enfoui dans une étape.

Le dépivot et la colonne conditionnelle se testent sur un petit extrait dont vous connaissez la somme. Vous notez le total du fichier avant transformation, et vous le retrouvez après, au centime, hors colonnes de total que vous avez volontairement retirées.

# Le query folding, l'idée

Quand la source est une base ou un entrepôt, Power Query essaie de **traduire** vos premières étapes en requête de la source. C'est le **query folding** (repli de requête). Le filtre « semaine du 2 novembre » s'exécute alors dans la base, qui ne vous envoie que ces lignes. Si le repli casse, l'outil télécharge un large extrait, puis finit le travail dans la mémoire du rapport. Le rafraîchissement devient long, et un collègue ne voit plus le SQL réel derrière le chiffre.

L'idée vous suffit. Vous n'avez pas à lire le moteur.

Étapes qui se replient souvent : choix des colonnes, filtre de lignes, renommage simple, jointure avec une autre table **de la même source**, agrégat simple.

Étapes qui cassent souvent le repli : dépivoter, fusionner avec un classeur local, colonne conditionnelle complexe, index ajouté « pour dédoublonner », remplacement de valeurs selon une liste saisie à la main.

Le geste de contrôle, dans l'outil : **Afficher la requête native** sur une étape. Si la commande est disponible, le repli tient encore jusque-là. Si elle est grisée, tout ce qui suit se fait hors de la source. Placez donc filtre et colonnes **au-dessus** de la première étape qui casse le repli. Acceptez la cassure quand elle est inévitable (dépivot d'un fichier), et gardez peu d'étapes après elle.

Typer une colonne peut, selon la source et la langue du poste, casser le repli tout de suite. Si cela arrive dès la deuxième étape, préférez typer dans la vue SQL, et laissez Power Query afficher des types déjà bons. Vous gagnez un rafraîchissement stable, et un chiffre qui ne dépend plus de la langue du portable.

```diagram
type: decision
title: Où doit vivre cette transformation ?
nodes:
  - question: Plusieurs rapports dépendent-ils de la même règle de chiffre ?
    yes: Placez-la dans une vue SQL partagée
    no: Power Query peut rester dans ce rapport
  - question: Le repli de requête casse-t-il avant même le filtre de période ?
    yes: Filtrez dans la vue, ou rapprochez le filtre de la source
    no: Gardez une liste courte d'étapes nommées
```

# Pourquoi quatre-vingts étapes deviennent un risque

Une requête de soixante à quatre-vingts étapes « fonctionne » souvent le jour où on la crée. Elle devient un risque de pilotage pour quatre raisons.

1. **Personne ne relit la règle.** L'avoir est retiré à l'étape 47, sous un nom automatique. La finance croit qu'il est encore dans le CA. Vous ne pouvez plus le jurer en revue.
2. **Le rafraîchissement casse loin de la cause.** Un en-tête de colonne renommé dans le classeur fait échouer une étape tardive, avec un message qui ne dit pas « le budget a changé de forme ».
3. **Le repli est mort depuis longtemps.** Chaque matin, l'outil ramène trop de lignes, puis les retrie sur le poste. La revue de 9 h attend un modèle encore en cours.
4. **La copie est inévitable.** Un collègue n'ose pas toucher la requête. Il en crée une deuxième, « simplifiée », avec une autre règle. Deux CA reviennent au comité.

Le remède n'est pas d'interdire Power Query. C'est de **replier la requête sur une dizaine d'étapes nommées**, ou de la déplacer.

- Si la règle est partagée, elle va dans une vue SQL. Power Query ne fait plus que filtrer la période de la page, ou rien du tout si la couche sémantique s'en charge.
- Si la règle est locale, vous regroupez les remplacements de texte en une seule étape commentée, vous supprimez les allers-retours (découper puis recoller la même colonne), et vous gardez le dépivot, la fusion et la condition.
- Vous notez en tête de requête le total de contrôle attendu sur un mois figé, pour voir tout de suite qu'une étape a dérivé.

Une étape que vous ne savez pas expliquer à un pair se supprime, ou s'écrit en une phrase dans le nom. Il n'y a pas de troisième voie honorable.

> [!IMPORTANT]
> Le nombre d'étapes n'est pas une médaille. Une requête de huit étapes nommées, dont le total retrouve le classeur, bat une requête de quatre-vingts étapes que seul son auteur osait rafraîchir.

# Une préparation lisible pour Halte Marché

Voici une préparation réelle, tenue courte, pour le budget que le contrôle de gestion envoie encore en classeur.

| Étape nommée | Intention |
|---|---|
| Source | Feuille `Budget_V2`, en-tête en ligne 4, pas la feuille `Travail` |
| Colonnes | `magasin_id` et les mois, sans la colonne `Total_an` |
| Codes | `magasin_id` en texte, zéros conservés |
| Dépivot | Mois en lignes, colonne `montant_budget` |
| Nombres | `montant_budget` en décimal, erreurs isolées et comptées |
| Fusion | Référentiel magasins, jointure gauche, sur `magasin_id` |
| Attributs | Développer `region` et `format` seulement |
| Contrôle | Nombre de lignes inchangé après fusion |

Les ventes, elles, ne passent pas par ce classeur. Elles viennent de `vw_vente_magasin_jour`. Le rapport fusionne budget et ventes **au grain magasin-mois**, après avoir ramené les ventes à ce grain. Vous ne dépivotez pas les ventes. Vous ne reconstruisez pas le CA dans Power Query « parce que le budget y est déjà ».

La page de revue n'affiche qu'une mesure d'écart : CA HT moins budget, même magasin, même mois de gestion. Si le grain des deux côtés n'est pas le même, l'écart est un artefact, pas une performance de magasin.

Quand cette préparation est relue par un pair en dix minutes, elle peut alimenter un rapport certifié. Quand elle ne peut pas l'être, elle reste une exploration, datée, hors du pack du lundi.

# Exercices

## Exercice 1 : Ranger les étapes

Le budget est un classeur : `magasin_id`, puis `oct_2026`, `nov_2026`, `dec_2026`, plus une colonne `Total_an`. Vous devez obtenir un montant par magasin et par mois, avec la région. Proposez l'ordre des étapes, et dites ce que vous faites de `Total_an`.

Solution :
<details>
<summary>Voir la solution</summary>

1. Source, feuille et en-tête figés.
2. Retirer `Total_an` **avant** tout dépivot, sinon le total annuel devient une ligne et double le budget.
3. Typer `magasin_id` en texte.
4. Dépivoter les trois mois vers `mois` et `montant_budget`.
5. Typer `montant_budget` en décimal, et compter les lignes en erreur.
6. Fusionner le référentiel en jointure gauche, développer `region` seulement.
7. Vérifier que le nombre de lignes n'a pas augmenté, et que la somme des trois mois égale l'ancien `Total_an` du fichier.

L'ordre peut varier légèrement sur le premier typage, pas sur le sort de `Total_an` ni sur le contrôle de lignes après fusion.

</details>

## Exercice 2 : Dire où le repli meurt

Une requête sur l'entrepôt enchaîne : filtre de la semaine, choix des colonnes, ajout d'une colonne d'index, fusion avec un classeur de franchises enregistré sur le poste, colonne conditionnelle « hors franchise ». Le rafraîchissement du matin dépasse une heure. Où le query folding a-t-il des chances de casser, et que déplacez-vous ?

Solution :
<details>
<summary>Voir la solution</summary>

Le repli tient en général sur le **filtre** et le **choix des colonnes**. Il casse à l'**index** ou, au plus tard, à la **fusion avec un classeur local**. Tout ce qui suit, y compris la condition, se calcule hors de la base, sur un extrait trop large si le filtre n'était pas vraiment au-dessus.

Vous déplacez le filtre (et le retrait des franchises, s'il est officiel) dans une **vue SQL**. Vous supprimez l'index, qui ne dédoublonne rien de sérieux. Power Query ne garde que l'affichage, ou une fusion locale vraiment spécifique à ce rapport. Le classeur de franchises, s'il fait foi, doit devenir un référentiel en base, pas un fichier de poste.

</details>

## Exercice 3 : Nommer ou déplacer

Vous héritez d'une requête de 70 étapes qui calcule le CA HT « maison ». Six rapports l'ont copiée. Deux totaux diffèrent déjà. Que faites-vous cette semaine, sans tout réécrire dans l'urgence de la revue de lundi ?

Solution :
<details>
<summary>Voir la solution</summary>

Vous ne certifiez aucun des deux totaux tant que la règle n'est pas unique. Pour lundi, vous publiez **un** chiffre, celui que vous savez rapprocher de la finance, clairement sourcé, et vous retirez l'autre du pack.

Dans la semaine, vous extrayez la règle commune dans une **vue SQL** (ou vous branchez les rapports sur `vw_vente_magasin_jour` si elle porte déjà ce CA). Les copies Power Query disparaissent, ou ne gardent qu'un filtre de page. Vous ne « nettoyez » pas les 70 étapes une par une dans les six fichiers : vous supprimeriez le symptôme en laissant six endroits où la règle peut revenir.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Transformations Power Query
center: "Une requête se relit à voix haute : peu d'étapes nommées, types tenus, total retrouvé."
points:
  - icon: list
    title: Étapes nommées
    text: "Colonnes, filtre, types, dépivot, fusion, condition. Chaque nom dit l'intention."
  - icon: ruler
    title: Types avant calcul
    text: "Montants en nombres, dates de caisse en dates, codes magasin laissés en texte."
  - icon: filter
    title: Dépivot propre
    text: "Retirez la colonne de total avant de dépivoter, sinon le budget se somme deux fois."
  - icon: zap
    title: Repli de requête
    text: "Filtrez tant que la requête native existe. Une fusion locale casse souvent le repli."
  - icon: alert
    title: Pas quatre-vingts étapes
    text: "Une longue suite opaque se copie, se casse, et fabrique un second chiffre officiel."
pitfall: "Masquer un périmètre dans une colonne conditionnelle, là où la revue ne voit plus le filtre."
remember: "Si vous ne pouvez pas expliquer l'étape à un pair, elle ne doit pas porter un CA certifié."
```
