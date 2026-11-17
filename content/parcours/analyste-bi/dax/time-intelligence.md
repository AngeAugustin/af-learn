---
title: Time intelligence et comparaisons de périodes
description: Marquer la table de dates, puis écrire un cumul annuel, un mois précédent et un N-1, y compris l'exercice décalé et les semaines.
duration: 66
objectives:
  - Préparer une table de dates marquée pour les fonctions de temps
  - Écrire un cumul depuis le début de l'année et un mois précédent
  - Comparer une période à la même période de l'année précédente
  - Décaler un exercice qui ne finit pas en décembre, et une semaine retail
---

# La table de dates marquée

Les fonctions de temps ne devinent pas le calendrier. Elles **décalent des dates** dans la table marquée comme table de dates, puis la relation filtre le fait. Si la table a un trou, si elle n'est pas marquée, ou si la mesure s'appuie sur une hiérarchie automatique cachée, le cumul est vide ou il porte sur le mauvais jour.

La table `Date` a une ligne par jour, sans trou, du premier jour d'historique jusqu'à l'horizon des budgets. Elle est marquée. La colonne utilisée par les fonctions est `'Date'[Date]`, de type date. C'est aussi la colonne de la relation vers `Ventes`, `StockJour` et `Objectifs`.

| Contrôle | Si on l'oublie |
|---|---|
| Marquage de la table | Le cumul peut s'appuyer sur un calendrier automatique, différent par colonne |
| Aucun jour manquant | Un décalage tombe dans le trou et la mesure reste vide |
| La période couvre le N-1 | Janvier 2025 comparé à janvier 2024 est vide si la table commence le 1er janvier 2025 |
| Relation sur la date | Le décalage de `'Date'[Date]` ne filtre pas le fait |
| Hiérarchies automatiques désactivées | Deux logiques de mois cohabitent dans le même rapport |

Les fonctions ne lisent pas le libellé « mars ». Elles lisent l'ensemble de dates du contexte. Si le visuel filtre mars 2025, le contexte contient les 31 jours du 1er au 31 mars. `SAMEPERIODLASTYEAR` fabrique les 31 jours du 1er au 31 mars 2024. Si le visuel ne filtre qu'une colonne texte `Mois` qui ne passe pas par `Date`, il n'y a pas de plage de dates à décaler.

> [!IMPORTANT]
> On pose l'année, le mois et la semaine **de la table `Date`** sur les axes. On passe `'Date'[Date]` aux fonctions. On n'écrit pas ces fonctions sur `Ventes[Date ticket]` « parce que c'est là que se trouve la date ».

# Le cumul depuis le début de l'année

`TOTALYTD` cumule la mesure depuis le premier jour de l'année qui contient le contexte, jusqu'au dernier jour de ce contexte. Sans quatrième argument, l'année se termine le 31 décembre.

Les ventes 2025 de l'enseigne, en milliers d'euros arrondis pour la lecture, sont celles-ci. Les additions du chapitre utilisent les montants exacts en euros.

| Mois 2025 | CA |
|---|---|
| Janvier | 10 000 |
| Février | 20 000 |
| Mars | 30 000 |
| Avril | 40 000 |
| Mai | 10 000 |
| Juin | 20 000 |
| Juillet | 15 000 |
| Août | 25 000 |

```dax
CA YTD =
TOTALYTD ( [CA], 'Date'[Date] )
```

Sur la ligne **mars 2025**, le contexte est le mois de mars. Le cumul part du 1er janvier et s'arrête au 31 mars : 10 000 + 20 000 + 30 000 = **60 000**. Sur février, il vaut 30 000. Sur août, il vaut 10 000 + 20 000 + 30 000 + 40 000 + 10 000 + 20 000 + 15 000 + 25 000 = **170 000**.

Sur une carte qui filtre déjà toute l'année 2025 et rien de plus fin, le YTD coïncide avec le CA de l'année : il n'y a rien après le dernier jour filtré. Le YTD devient utile dès que l'axe est le mois, ou qu'on est en cours de mois.

`TOTALYTD` ne crée pas l'axe. Si vous mettez la mesure dans une carte sans filtre de date, le dernier jour visible est le dernier jour de la table, éventuellement un jour de budget dans le futur. Le cumul court alors jusqu'à cet horizon. On filtre la période que l'on veut montrer, ou l'on s'arrête à aujourd'hui avec un prédicat sur `'Date'[Date]`.

# Le mois précédent

« Mois précédent » cache deux questions. Le **même extrait de jours, un mois plus tôt**, ou le **mois calendaire entier** qui précède. `DATEADD` fait la première. `PREVIOUSMONTH` fait la seconde.

Du 1er au 10 mars 2025, le CA vaut **12 000**. Février entier vaut **20 000**. Du 1er au 10 février, il vaut **7 000**.

```dax
CA mois décale =
CALCULATE (
    [CA],
    DATEADD ( 'Date'[Date], -1, MONTH )
)
```

Le contexte est une plage de dix jours. `DATEADD` recule cette plage d'un mois : du 1er au 10 février. La mesure vaut **7 000**. Elle ne va pas chercher les vingt autres jours de février. C'est le bon choix pour un mois en cours, quand on ne veut pas comparer dix jours à vingt-huit.

```dax
CA mois précédent =
CALCULATE (
    [CA],
    PREVIOUSMONTH ( 'Date'[Date] )
)
```

`PREVIOUSMONTH` ignore la forme de la plage et prend **tout** le mois calendaire précédent. Du 1er au 10 mars, la mesure vaut **20 000**, février entier. Comparer 12 000 à 20 000 sans le dire fait croire à une baisse. Le nom `CA mois précédent` doit être réservé à ce mois entier, et le rapport ne l'affiche pas à côté d'un extrait de dix jours sans une légende.

```diagram
type: compare
title: Du 1er au 10 mars, deux façons de reculer
columns:
  - title: DATEADD d'un mois
    tone: teal
    items:
      - Garde la forme de la période
      - Du 1er au 10 février
      - Résultat 7 000 €
  - title: PREVIOUSMONTH
    tone: amber
    items:
      - Prend le mois calendaire entier
      - Tout février
      - Résultat 20 000 €
```

Les deux fonctions renvoient **vide** si les dates d'arrivée n'existent pas dans `Date`. Un décalage de janvier vers décembre précédent est vide tant que la table ne contient pas ce décembre. On n'y remédie pas en remplaçant le vide par zéro sans regarder : zéro dirait « pas de ventes », le vide dit souvent « le calendrier ne couvre pas ».

# La même période l'an dernier

`SAMEPERIODLASTYEAR` décale la plage de dates d'un an. La forme est conservée. Mars 2025, trente et un jours, devient mars 2024. Du 1er au 10 mars 2025 devient du 1er au 10 mars 2024.

Mars 2025 vaut **30 000**. Mars 2024 vaut **22 000**.

```dax
CA N-1 =
CALCULATE (
    [CA],
    SAMEPERIODLASTYEAR ( 'Date'[Date] )
)
```

Sur la ligne mars 2025, `CA N-1` vaut **22 000**. L'écart et l'écart relatif s'écrivent **à partir de ces mesures**, pas en recopiant `SUM` :

```dax
Ecart CA = [CA] - [CA N-1]

Ecart CA % = DIVIDE ( [Ecart CA], [CA N-1] )
```

L'écart de mars est 30 000 − 22 000 = **8 000**. L'écart relatif est 8 000 / 22 000 = **36,4 %**. Le format de `Ecart CA %` est un pourcentage. Si mars 2024 est vide parce que la table de dates commence en 2025, `DIVIDE` renvoie vide, et l'on ne publie pas +100 %.

`SAMEPERIODLASTYEAR` compare des **dates**, pas le numéro de semaine et pas la fête mobile. Un 8 mars tombe le même quantième l'année suivante, pas le même jour de semaine. Pour le mois, c'est en général ce que la finance demande. Pour la semaine commerciale, ce ne l'est pas. La section suivante sur les semaines reprend ce point.

La mesure suit la relation **active**. Si l'active est la date du ticket, `CA N-1` compare les tickets, pas les livraisons. Le N-1 livré réutilise `USERELATIONSHIP` autour de la même logique, sinon on mélange deux rôles dans un écart.

```video
url: https://www.youtube.com/watch?v=dBSOYxyRR_w
title: "SAMEPERIODLASTYEAR vs PARALLELPERIOD vs DATEADD // DAX Basics // Beginners Guide to Power BI in 2022"
channel: "Fernan | Power BI"
duration: "15:18"
lang: en
why: "SAMEPERIODLASTYEAR, PARALLELPERIOD et DATEADD comparés côte à côte, avec ce que chacune renvoie vraiment."
```

# L'exercice qui ne finit pas en décembre

Beaucoup d'enseignes ne clôturent pas le 31 décembre. Une clôture au **30 juin** veut dire que l'exercice 2025-2026 commence le **1er juillet 2025**. `TOTALYTD` accepte cette fin d'année en troisième argument, une chaîne de caractères au format `"06-30"`.

```dax
CA YTD fiscal =
TOTALYTD ( [CA], 'Date'[Date], "06-30" )
```

Sur **août 2025**, le cumul calendaire part du 1er janvier et vaut **170 000**. Le cumul fiscal part du 1er juillet et ne contient que juillet et août : 15 000 + 25 000 = **40 000**.

Sur **mars 2025**, le cumul fiscal ne part pas de janvier. Mars appartient à l'exercice commencé le **1er juillet 2024**. Le chiffre inclut donc tout le second semestre 2024, plus janvier, février et mars 2025. Le publier sur un axe « Année = 2025 » le fait comparer à un YTD calendaire qui n'a pas le même point de départ.

```diagram
type: compare
title: Août 2025 selon le point de départ du cumul
columns:
  - title: YTD calendaire
    tone: blue
    items:
      - Départ le 1er janvier 2025
      - De janvier à août
      - 170 000 €
  - title: YTD fiscal au 30 juin
    tone: violet
    items:
      - Départ le 1er juillet 2025
      - Juillet et août seulement
      - 40 000 €
```

La fonction ne change pas les colonnes de l'axe. Si `Année` est l'année civile, le visuel range août 2025 dans 2025 alors que l'exercice, lui, a commencé en juillet. On ajoute à `Date` les colonnes `Exercice` et `Mois d'exercice`, et c'est **elles** que l'on pose sur l'axe d'un rapport fiscal. La mesure `CA YTD fiscal` et l'axe racontent alors la même année.

> [!WARNING]
> Un YTD fiscal sur un axe calendaire n'est pas « presque » la même chose. En août, 40 000 et 170 000 sont tous les deux justes, et ils ne pilotent pas la même question.

# Les semaines et le décalage de 364 jours

La semaine ne se comporte pas comme le mois. Elle chevauche les mois et les années. Elle n'a pas toujours un jumeau le même quantième. Et 365 n'est pas divisible par 7 : le même quantième tombe un jour plus tard dans la semaine, deux jours plus tard après une année bissextile traversée.

Le 10 mars 2025 est un **lundi**. La semaine du 10 au 16 mars 2025 va du lundi au dimanche. Le CA de cette semaine est **18 000**.

`SAMEPERIODLASTYEAR` décale ces sept dates d'un an : du 10 au 16 mars 2024. Le 10 mars 2024 est un **dimanche**. On compare un lundi-dimanche à un dimanche-samedi. Les samedis ne sont plus en face des samedis. Pour un magasin, dont le samedi pèse le double d'un mardi, l'écart est faux même si le DAX est « la fonction N-1 ».

Le décalage retail qui aligne les jours de semaine est **364 jours**, soit 52 semaines exactement.

```dax
CA S-52 =
CALCULATE (
    [CA],
    DATEADD ( 'Date'[Date], -364, DAY )
)
```

Le lundi 10 mars 2025 recule sur le lundi **11 mars 2024**. La semaine comparable va du 11 au 17 mars 2024. Son CA est **16 000**. L'écart de semaine est 2 000, les lundis face aux lundis.

```diagram
type: flow
title: Aligner une semaine commerciale
steps:
  - title: Semaine affichée
    text: Lundi 10 mars 2025 au dimanche 16 mars, CA 18 000.
    tone: teal
  - title: Piège du N-1 calendaire
    text: 10 mars 2024 est un dimanche. Les jours de semaine glissent.
    tone: rose
  - title: Moins 364 jours
    text: Retour au lundi 11 mars 2024. CA comparable 16 000.
    tone: violet
  - title: Mesure nommée
    text: CA S-52 dit le décalage. On ne l'appelle pas mois précédent.
    tone: amber
```

Deux autres pièges reviennent dans les rapports hebdomadaires.

- Filtrer le **numéro** de semaine sans l'année mélange la semaine 1 de deux années, ou rattache à janvier des jours de décembre. L'axe porte `2025-S11`, pas `11`.
- Une semaine ISO 1 peut commencer en décembre précédent. Le cumul `TOTALYTD` calendaire, lui, coupe au 1er janvier et **tranche la semaine**. On ne pose pas un YTD annuel sur un axe de semaines en espérant une semaine entière.

`DATEADD` sait reculer d'un nombre de jours. On ne lui invente pas un intervalle semaine que la fonction ne propose pas au même titre que le mois. 364 jours se lisent, se testent sur un lundi, et se documentent.

# Exercices

## Exercice 1 : Mars et août

Avec la table mensuelle du chapitre (janvier 10 000 € jusqu'à août 25 000 €), donnez le YTD calendaire de mars 2025, le YTD calendaire d'août 2025, et le YTD fiscal d'août si l'exercice se termine le 30 juin.

<details>
<summary>Voir la solution</summary>

YTD calendaire de mars : janvier à mars, 10 000 + 20 000 + 30 000 = **60 000 €**.

YTD calendaire d'août : janvier à août = **170 000 €**.

YTD fiscal d'août, clôture `"06-30"` : le départ est le 1er juillet 2025. Juillet 15 000 + août 25 000 = **40 000 €**.

La mesure fiscale est `TOTALYTD ( [CA], 'Date'[Date], "06-30" )`. L'axe du rapport fiscal porte la colonne Exercice, pas l'année civile seule.

</details>

## Exercice 2 : Dix jours ou un mois

Du 1er au 10 mars 2025, le CA est 12 000 €. Février entier vaut 20 000 €. Du 1er au 10 février, il vaut 7 000 €. Le contexte du visuel est ces dix jours de mars.

Que renvoie `DATEADD` d'un mois, que renvoie `PREVIOUSMONTH`, et lequel compare des durées égales ?

<details>
<summary>Voir la solution</summary>

`DATEADD ( 'Date'[Date], -1, MONTH )` conserve les dix jours : du 1er au 10 février, **7 000 €**. Les durées sont égales.

`PREVIOUSMONTH` renvoie février entier, **20 000 €**. Comparer 12 000 à 20 000 mélange dix jours et un mois.

On nomme les deux mesures. On n'affiche `PREVIOUSMONTH` sur un mois en cours que si la légende dit « mois précédent complet ».

</details>

## Exercice 3 : Le lundi face au lundi

La semaine du lundi 10 mars 2025 au dimanche 16 mars fait 18 000 €. Le 10 mars 2024 est un dimanche. La semaine du lundi 11 mars 2024 au dimanche 17 mars fait 16 000 €.

Pourquoi `SAMEPERIODLASTYEAR` n'aligne pas les samedis, et quelle mesure donne les 16 000 € ?

<details>
<summary>Voir la solution</summary>

`SAMEPERIODLASTYEAR` recule du 10 au 16 mars 2024. Le 10 mars 2024 est un dimanche, donc la plage va du dimanche au samedi. Le samedi de 2025 n'est pas comparé au samedi de 2024. 365 n'est pas un multiple de 7.

```dax
CA S-52 =
CALCULATE (
    [CA],
    DATEADD ( 'Date'[Date], -364, DAY )
)
```

364 jours reculent de 52 semaines exactement. Le lundi 10 mars 2025 arrive sur le lundi 11 mars 2024. La mesure vaut **16 000 €**. On la nomme `CA S-52`, pas `CA N-1`, pour ne pas la confondre avec le décalage calendaire du mois.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Time intelligence et comparaisons
center: Les fonctions décalent des dates du calendrier marqué. Le nom de la mesure dit si l'on compare un mois, un exercice ou 364 jours.
points:
  - icon: clock
    title: Table marquée
    text: Une ligne par jour, sans trou, reliée aux faits. L'axe vient de cette table, pas du fait.
  - icon: chart
    title: YTD
    text: Mars calendaire cumule 60 000 depuis janvier. Août fiscal au 30 juin ne cumule que 40 000.
  - icon: loop
    title: Mois précédent
    text: DATEADD garde les dix jours, 7 000. PREVIOUSMONTH prend février entier, 20 000.
  - icon: scale
    title: N-1
    text: Mars 2025 contre mars 2024, 30 000 contre 22 000. L'écart réutilise les mesures.
  - icon: alert
    title: Semaines
    text: Le 10 mars 2025 est un lundi, le 10 mars 2024 un dimanche. On recule de 364 jours.
pitfall: Poser un YTD fiscal sur un axe d'année civile, ou un N-1 calendaire sur une semaine de magasins.
remember: On teste chaque décalage sur une date connue. Si le samedi a bougé, la fonction n'est pas la bonne.
```
