---
title: Mesures, dimensions dégénérées et SCD
description: Classer les mesures selon ce qu'on a le droit de sommer, reconnaître une dimension dégénérée, et historiser un segment client.
duration: 65
objectives:
  - Classer une mesure en additive, semi-additive ou non additive
  - Laisser sur le fait une dimension dégénérée comme le numéro de ticket
  - Expliquer l'effet d'un SCD de type 1 sur un rapport déjà publié
  - Conserver l'historique d'un segment client avec un SCD de type 2
---

# Les mesures additives

Une mesure est **additive** quand on a le droit de la sommer **sur toutes les dimensions**, y compris le temps. Le montant HT et la quantité des lignes de ticket le sont. La somme de janvier et de février est le cumul des deux mois. La somme de Lyon et de Paris est le cumul des deux magasins. La somme de deux familles, si chaque produit n'a qu'une famille, est le cumul des deux familles.

| Lignes | Montant HT | Quantité |
|---|---|---|
| Pain, Lyon, 12 mars | 3,20 | 2 |
| Café, Lyon, 12 mars | 2,10 | 1 |
| Pain, Paris, 12 mars | 3,20 | 2 |
| Total | 8,50 | 5 |

Le total est la somme des lignes. C'est le contrat d'une mesure additive. Le coût de revient de la ligne suit le même contrat. La marge en euros aussi, si elle est montant HT moins coût **au même grain** : on peut sommer les marges, ou soustraire les sommes, le résultat coïncide.

Ce contrat tombe dès que le nombre n'est pas un montant du grain. Un prix unitaire de 1,60 € sur la ligne de pain n'est pas une mesure additive. Sommer 1,60 € et 2,10 € ne donne pas un prix. Sommer des stocks de fin de journée ne donne pas un stock. Le réflexe « tout ce qui est numérique se somme » est celui qui casse les rapports de pilotage.

# Les mesures semi-additives

Une mesure est **semi-additive** quand la somme a un sens **sur certaines dimensions seulement**. Le cas le plus fréquent est le temps. Le stock et le solde bancaire s'additionnent entre produits, entre magasins ou entre comptes. Ils ne s'additionnent pas entre les dates.

Stock du café à Lyon :

| Date | Quantité en rayon |
|---|---|
| 1er mars | 10 |
| 2 mars | 12 |
| 3 mars | 9 |

La somme des trois quantités vaut 31. Ce n'est pas le stock. Personne n'a 31 unités. Le stock sur la période est le stock de **fin de période**, ici 9 au 3 mars. Entre Lyon et Paris, en revanche, on additionne : 9 à Lyon plus 14 à Paris font 23 unités détenues ce jour-là.

Le solde d'un compte fonctionne de la même façon. Les mouvements de mars sont +100, +50 et −20, et le solde d'ouverture est 1 000. Le solde au 31 mars est 1 130. La somme des soldes quotidiens n'est pas un solde. La somme des mouvements du seul mois de mars vaut 130, ce qui est un flux, pas le solde, tant que l'ouverture est oubliée.

> [!NOTE]
> Additive sur le produit et le magasin, non additive sur la date : c'est la définition pratique de la semi-additivité. Le libellé de la mesure doit le dire, par exemple « Stock de fin de période », jamais « Somme du stock ».

Le fait qui porte ce nombre n'est pas le fait des ventes. Un **cliché** `StockJour` a pour grain le jour, le produit et le magasin, et sa quantité est un niveau. Un fait de **mouvements** `Ecritures` a pour grain l'écriture, et le solde se reconstruit en cumulant les mouvements jusqu'à la date voulue. Les deux sont semi-additifs. Leur calcul n'est pas le même. On n'additionne pas un cliché « parce que la table ressemble à des ventes ».

# Les mesures non additives

Une mesure est **non additive** quand la somme n'a de sens sur **aucune** dimension. Il faut la recalculer après coup, à partir de mesures additives, au niveau affiché.

| Mesure | Pourquoi on ne somme pas | Ce qu'on calcule à la place |
|---|---|---|
| Prix unitaire | 1,60 € + 2,10 € n'est pas un prix | Montant HT divisé par la quantité, au niveau affiché |
| Taux de marge | 40 % + 10 % n'est pas 50 % | Somme des marges divisée par la somme des montants |
| Panier moyen | La moyenne des moyennes ignore la taille des magasins | Chiffre d'affaires divisé par le nombre de tickets |
| Clients distincts | Un client vu à Lyon et à Paris compte deux fois si l'on somme les magasins | Comptage distinct au niveau affiché |

Le taux est le piège le plus cher. Lyon vend 100 € avec 40 € de marge, soit 40 %. Paris vend 1 000 € avec 100 € de marge, soit 10 %. La moyenne des deux taux est 25 %. Le taux de l'enseigne est 140 € de marge sur 1 100 €, soit **12,7 %**. Le pilotage qui moyenne les taux des magasins surpondère le petit magasin et raconte une rentabilité qui n'existe pas.

Le nombre de clients distincts a le même symptôme visuel qu'un pont N-N : la somme des lignes n'est pas le total. Lyon 100 clients, Paris 80, et 30 personnes ont acheté dans les deux magasins. La somme des lignes vaut 180. Le total enseigne vaut 150. Ici le modèle relationnel peut être parfait. C'est la mesure qui n'est pas additive. On ne « répare » pas ce total pour qu'il vaille 180.

# Les dimensions dégénérées

Une **dimension dégénérée** est un identifiant qui sert à grouper ou à compter, mais qui **n'a pas d'attributs à lui**. Il reste une colonne du fait. On ne crée pas de table autour.

Le numéro de ticket est l'exemple type. Il permet de compter les tickets, de retrouver un passage en caisse, de calculer un panier. Tout le contexte du ticket est déjà ailleurs : la date, le magasin, le client, les produits. Une table `Tickets` ne contiendrait que la clé, et répéterait des attributs déjà portés par les dimensions.

| Colonne du fait | Table séparée ? | Raison |
|---|---|---|
| Numéro de ticket | Non | Aucun attribut propre. On compte les valeurs distinctes |
| Numéro de facture | Non, dans le même cas | Identifiant de pièce, pas une entité décrite |
| Mode de paiement | Oui, si on le décrit | Libellé, famille d'encaissement, délai. C'est une vraie dimension |
| Code promotion | Oui, dès qu'il a un nom et des dates | La promotion se filtre et se décrit |

Créer une dimension pour le seul numéro de ticket alourdit l'étoile sans rien donner au slicer. À l'inverse, laisser le mode de paiement en texte libre sur le fait empêche de ranger « carte », « Carte bancaire » et « CB » dans une même famille d'encaissement. Le critère n'est pas la cardinalité. Un ticket est très cardinal et reste dégénéré. Un mode de paiement a peu de valeurs et mérite quand même sa dimension, parce qu'il a des attributs et une qualité de données à tenir.

Le numéro dégénéré se prête au comptage distinct, pas à une somme. Sommer les numéros de ticket ne veut rien dire. Les compter sans doublon répond à « combien de passages en caisse ».

# Le SCD de type 1

Une dimension change. Le client C-104, Marie Lambert, était **Silver** en 2024. Elle est **Gold** depuis le 1er janvier 2025. Le **SCD de type 1** (*slowly changing dimension*, dimension à évolution lente) **écrase** l'ancienne valeur. Il ne reste qu'une ligne client. Le segment affiché est Gold. L'historique du segment a disparu de la dimension.

Les ventes, elles, sont toujours là.

| Date de vente | Montant HT | Segment stocké après écrasement |
|---|---|---|
| 15 mars 2024 | 200 | Gold |
| 2 février 2025 | 350 | Gold |

Un rapport « chiffre d'affaires par segment » relu en 2025 montre **550 € en Gold** et **0 € en Silver**. Le rapport de mars 2024, s'il est recalculé sur ce modèle, ne montre plus Silver. Le type 1 **réécrit le passé**. Ce n'est pas un défaut technique. C'est le comportement du type, et il faut le choisir en connaissance de cause.

Le type 1 est le bon choix quand la correction doit s'appliquer partout, y compris à l'historique.

- Une faute de ville : « Lyon » corrigé en « Lyon » avec l'accent, ou un code postal faux.
- Un libellé produit renommé, si le métier veut le nom d'aujourd'hui sur toutes les années.
- Une clé de rattachement qui était fausse dès le départ.

Il est le mauvais choix dès que la question du rapport est « **qu'est-ce qui était vrai au moment de la vente ?** ». Le segment, le vendeur attitré, la région de rattachement d'un magasin, le barème : si le comité compare les segments dans le temps, l'écrasement lui fait dire que Marie a toujours été Gold.

# Le SCD de type 2

Le **type 2** conserve les versions. Chaque changement ajoute **une ligne** dans la dimension, avec sa propre clé technique. Le fait de vente pointe vers **la version en vigueur le jour de la vente**, pas vers « le client en général ».

| Client Key | Code client | Segment | Début | Fin | Version actuelle |
|---|---|---|---|---|---|
| 12 | C-104 | Silver | 1er janv. 2024 | 31 déc. 2024 | Non |
| 48 | C-104 | Gold | 1er janv. 2025 |  | Oui |

La vente du 15 mars 2024 porte la clé 12. Celle du 2 février 2025 porte la clé 48.

| Vente | Clé client dans le fait | Segment vu par le rapport |
|---|---|---|
| 15 mars 2024, 200 € | 12 | Silver |
| 2 février 2025, 350 € | 48 | Gold |

Le même rapport qu'au type 1 donne maintenant **200 € en Silver** et **350 € en Gold**. Mars 2024 reste Silver, même si Marie est Gold aujourd'hui. C'est ce que demande la phrase « chiffre d'affaires du segment tel qu'il était à la date d'achat ».

```diagram
type: compare
title: Les 550 € de Marie selon le type de SCD
columns:
  - title: Type 1, écrasement
    tone: amber
    items:
      - Une seule ligne client
      - Segment actuel Gold partout
      - Mars 2024 reclassé en Gold
      - Silver affiche 0 €
  - title: Type 2, versions
    tone: teal
    items:
      - Une ligne par version, clés 12 et 48
      - Chaque vente pointe vers sa version
      - Mars 2024 reste Silver, 200 €
      - Gold ne porte que les 350 € de 2025
```

Le grain de la dimension a changé. Une ligne n'est plus un client, c'est **une version de client**. Conséquences directes pour le rapport :

- Compter les clés techniques compte des versions. Marie compte deux. Le nombre de clients s'obtient sur le **code client**, pas sur `Client Key`.
- Filtrer « version actuelle = oui » ne garde que la clé 48. La vente de mars, rattachée à la clé 12, **sort du chiffre d'affaires**. On n'a pas « les ventes des clients qui sont Gold aujourd'hui ». On a seulement les ventes survenues pendant la version actuelle.
- Pour répondre « toutes les ventes des clients qui sont Gold aujourd'hui, y compris leur passé Silver », il faut une autre relation, ou un regroupement par code client. Le type 2 ne le donne pas gratuitement. Il répond d'abord à l'historique **au moment des faits**.

> [!WARNING]
> Type 2 plus filtre « actuel » n'est pas un type 1. Le type 1 reclasse l'historique. Le filtre « actuel » le **supprime** du visuel, parce que les anciennes clés ne passent plus.

# Quel type pour le rapport

On choisit le type à partir de la **question du rapport**, pas à partir de la facilité de chargement. L'écrasement est plus simple à alimenter. Il est irréversible pour l'analyse : une fois Silver écrasé, aucun calcul ne le retrouve.

```diagram
type: decision
title: Type 1 ou type 2 pour un attribut client
nodes:
  - question: La question parle-t-elle de la valeur au moment de la vente ?
    yes: Type 2, une version par période, le fait pointe vers cette version
    no: Question suivante
  - question: Une correction doit-elle réécrire toutes les périodes, comme un libellé faux ?
    yes: Type 1, on écrase
    no: Type 2 si l'historique peut servir, sinon type 1 en le disant au métier
```

Pour le segment client d'une enseigne, la revue mensuelle demande presque toujours le type 2 : « les Silver de l'an dernier ont-ils acheté autant que les Silver d'aujourd'hui ? » Le type 1 répond à une autre question, qu'il faut nommer autrement : « où se classent, avec le barème d'aujourd'hui, les clients et tout leur historique d'achat ? » Les deux rapports peuvent coexister. Ils ne peuvent pas partager la même colonne en silence.

Le minimum à écrire à côté du modèle : l'attribut, le type retenu, et la phrase du rapport. « Segment : type 2. Le chiffre d'affaires par segment utilise le segment en vigueur le jour du ticket. Le segment actuel est une autre colonne, qui ne reclasse pas les ventes passées. »

# Exercices

## Exercice 1 : Additive, semi-additive ou non

Classez ces indicateurs d'une enseigne : montant HT des ventes, quantité en stock le soir, taux de marge, nombre de clients distincts, prix unitaire catalogue, solde du compte magasin.

Pour chaque ligne, dites sur quelles dimensions une somme aurait un sens.

<details>
<summary>Voir la solution</summary>

- Montant HT : **additif**. Somme légitime sur la date, le produit, le magasin et le client.
- Quantité en stock le soir : **semi-additive**. Somme entre produits et magasins à une date donnée. Pas de somme entre les jours. On retient la fin de période.
- Taux de marge : **non additif**. On recalcule marge divisée par montant HT au niveau affiché. On ne moyenne pas les taux.
- Clients distincts : **non additif**. Un client multi-magasins serait compté plusieurs fois si l'on somait les magasins.
- Prix unitaire catalogue : **non additif**. C'est un attribut de produit, ou un ratio montant sur quantité. Ce n'est pas une somme.
- Solde du compte magasin : **semi-additif**. Somme entre comptes à une date. Pas de somme des soldes quotidiens. Le solde se reconstruit avec l'ouverture et les mouvements.

</details>

## Exercice 2 : Réécrire ou conserver mars

Marie (C-104) achète pour 200 € le 15 mars 2024, alors qu'elle est Silver, puis pour 350 € le 2 février 2025, alors qu'elle est Gold. Le contrôle de gestion ouvre en 2025 le rapport « CA par segment » sur les deux années.

Donnez les montants par segment en type 1 et en type 2.

<details>
<summary>Voir la solution</summary>

Type 1 : une seule ligne client, segment écrasé à Gold. Les deux ventes sont lues comme Gold. **Gold 550 €, Silver 0 €.** Mars 2024 est réécrit.

Type 2 : la vente de mars pointe vers la version Silver (clé 12), celle de février vers la version Gold (clé 48). **Silver 200 €, Gold 350 €.** Le segment au moment de l'achat est conservé.

Si le rapport doit répondre « qu'est-ce que le segment a produit à l'époque », seul le type 2 est juste. Le type 1 répond « où classer tout l'historique avec le segment d'aujourd'hui ».

</details>

## Exercice 3 : Table ou colonne du fait

Pour chaque identifiant, dites s'il devient une dimension ou s'il reste une dimension dégénérée sur le fait : numéro de ticket, mode de paiement (avec une famille d'encaissement), numéro de facture sans autre attribut, code promotion (nom, début, fin).

<details>
<summary>Voir la solution</summary>

- Numéro de ticket : **dégénéré**, colonne du fait. On s'en sert pour compter les tickets. Pas de table, pas d'attribut propre.
- Mode de paiement : **dimension**. La famille d'encaissement est un attribut, et les libellés doivent être normalisés.
- Numéro de facture sans attribut : **dégénéré**, comme le ticket.
- Code promotion : **dimension**. Le nom et les dates se filtrent et se décrivent. Une promotion n'est pas un simple identifiant de ligne.

Le critère est l'existence d'attributs et d'une qualité à tenir, pas le nombre de valeurs distinctes.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Mesures, dimensions dégénérées et SCD
center: On somme ce qui est additif, on fige le stock en fin de période, et le type 2 garde le segment du jour de la vente.
points:
  - icon: money
    title: Additive
    text: Montant HT et quantité se somment sur la date, le magasin et le produit.
  - icon: gauge
    title: Semi-additive
    text: Stock et solde s'additionnent entre magasins, pas entre les jours. On prend la fin de période.
  - icon: scale
    title: Non additive
    text: Un taux se recalcule. Moyenner 40 % et 10 % ne donne pas la marge de l'enseigne.
  - icon: file
    title: Dégradé
    text: Le numéro de ticket reste sur le fait. Le mode de paiement, lui, a une vraie dimension.
  - icon: clock
    title: SCD type 2
    text: Marie reste Silver sur mars 2024. Le type 1 réécrirait ces 200 € en Gold.
pitfall: Filtrer la version actuelle d'un SCD type 2 et croire que l'historique est reclassé. Il est surtout exclu.
remember: La question « au moment de la vente » ou « avec la valeur d'aujourd'hui » choisit le type 2 ou le type 1.
```
