---
title: Raconter une analyse qui fait décider
description: "Structure situation, complication, résolution, une idée par slide, annotation du fait saillant et titres qui concluent au lieu de nommer le graphique."
duration: 55
objectives:
  - "Structurer une restitution en situation, complication et résolution"
  - "Tenir une seule idée par slide, annotée sur le fait qui compte"
  - "Écrire un titre qui énonce la conclusion chiffrée"
  - "Ordonner une revue de décision sans noyer le public"
---

# Une analyse n'est pas encore une décision

Vous pouvez avoir la bonne requête, le bon graphique et le bon chiffre, et sortir d'une réunion sans décision. Il manquait le récit : pourquoi ce chiffre, pourquoi maintenant, quoi faire lundi. Le storytelling de données n'est pas une couche de métaphores. C'est l'ordre dans lequel vous donnez les faits pour qu'une personne occupée puisse trancher.

Le public de Lumen, dans ce chapitre, est le comité de direction. Il a quinze minutes. Le T2 vient de se clore. Vos extraits, tous HT, commandes livrées, avoirs déjà déduits :

| | CA | Marge brute |
|---|---|---|
| T2, groupe | 1 200 k€, stable vs T1 | 52 % (624 k€), contre 58 % au T1 |
| Est | 310 k€, soit 26 % du CA | 42 %, contre 58 % au T1 |

La baisse de marge groupe est de 6 points, soit environ 72 k€ (58 % − 52 % appliqués à 1 200 k€). À l'Est, la marge passe de 58 % à 42 %, soit environ 50 k€ de marge en moins sur 310 k€. L'Est explique donc **environ 70 % de la perte de marge** (50 / 72) alors qu'il ne pèse qu'un quart du CA. La remise moyenne y est de 18 %, contre 9 % dans les autres régions. Quinze comptes Est sont sous 45 % de marge et concentrent l'essentiel de cet écart.

Aucun de ces chiffres ne « parle » tout seul si vous les posez dans l'ordre de votre exploration (d'abord le détail des quinze comptes, ensuite le total, ensuite la comparaison au T1). Le comité décroche, ou pire, il retient un chiffre annexe. Votre travail de récit commence quand les calculs sont finis.

> [!IMPORTANT]
> Raconter n'autorise pas à simplifier au-delà du calcul. « Tout vient de l'Est » serait faux : environ 30 % de la baisse est ailleurs. Le récit juste dit « surtout l'Est », puis le chiffre 70 %.

```video
url: https://www.youtube.com/watch?v=8EMW7io4rSI
title: "Storytelling with Data | Cole Nussbaumer Knaflic | Talks at Google"
channel: "Talks at Google"
duration: "53:15"
lang: en
why: "Cole Nussbaumer Knaflic, autrice de Storytelling with Data, présente sa méthode pour passer d'un graphique à un message."
```

# Situation, complication, résolution

La structure **situation, complication, résolution** (souvent abrégée SCR) est un squelette robuste pour une note comme pour une séquence de slides. Elle suit la façon dont une décision se forme : on rappelle le cadre que tout le monde partage, on montre ce qui casse ce cadre, on propose quoi faire.

**Situation.** Le monde stable, les chiffres que le public reconnaît, sans alerte artificielle. Ici : le CA du T2 est de 1,2 M€, au même niveau que le T1. Lumen n'a pas un problème de demande. La marge brute habituelle, au T1, était de 58 %.

**Complication.** Ce qui menace ce cadre, avec le mécanisme, pas seulement le symptôme. La marge tombe à 52 %. Environ 70 % de cette baisse vient de l'Est, passé de 58 % à 42 %, avec des remises à 18 % contre 9 % ailleurs. Vous nommez aussi ce que ce n'est pas : ce n'est pas un effondrement du CA, ce n'est pas homogène sur les quatre régions.

**Résolution.** L'action, le responsable, l'ordre de grandeur de l'effet, et ce que vous ne promettez pas. Par exemple : geler, dès lundi, toute remise Est au-dessus de 12 % sans accord de la direction commerciale ; passer en revue les quinze comptes sous 45 % de marge sous quinze jours. Si l'Est revenait seulement à 50 % (pas encore au 58 % d'avant), l'écart récupéré serait d'environ 8 points sur 310 k€, soit près de 25 k€ de marge par trimestre. Vous ne promettez pas 25 k€ : vous montrez le levier.

```diagram
type: flow
title: "Le fil situation, complication, résolution"
steps:
  - title: Situation
    text: "Le cadre partagé : CA stable à 1,2 M€, marge T1 à 58 %"
    tone: violet
  - title: Complication
    text: "Marge T2 à 52 %. L'Est explique environ 70 % de la perte"
    tone: rose
  - title: Mécanisme
    text: "Remises Est à 18 % contre 9 % ailleurs, 15 comptes sous 45 %"
    tone: amber
  - title: Résolution
    text: "Plafond de remise et revue des 15 comptes, effet chiffré avec prudence"
    tone: teal
  - title: Suivi
    text: "Date du prochain point, et la question encore ouverte (le mix produit)"
    tone: blue
```

Deux erreurs cassent ce fil. La première est de commencer par la méthode (« nous avons joint les avoirs sur la date de livraison… »). La méthode tient en une ligne de note, sauf si la décision dépend d'un choix de définition. La seconde est d'ouvrir dix pistes (le stock, le transporteur, le site web, les remises, la météo). Une complication principale, les autres en annexe si elles ne changent pas la décision de lundi.

Le titre de l'ensemble peut déjà porter la résolution ou la complication. Faire attendre slide 12 pour apprendre pourquoi la réunion existe fatigue le public et vous fait perdre les retardataires. SCR décrit l'ordre de la **preuve**. Il n'interdit pas d'annoncer la conclusion dès la page de garde.

# Une idée par slide

Une slide est une phrase, pas un dossier. Si vous couvrez le titre avec la main et que vous ne pouvez pas dire l'idée en une respiration, la slide en contient plusieurs. Coupez.

Pour la revue de Lumen, cinq slides suffisent. Chacune survivrait si les autres disparaissaient.

1. **Le CA ne explique pas la réunion.** CA T2 : 1,2 M€, stable. Donc on ne lance pas un plan de prospection en croyant remplir un trou de ventes.
2. **La marge groupe perd 6 points.** 58 % au T1, 52 % au T2, soit environ 72 k€. C'est le symptôme.
3. **L'Est concentre la perte.** Environ 50 k€ sur les 72, avec 26 % du CA. Carte ou barres des quatre régions, l'Est seul en couleur.
4. **Le mécanisme principal est la remise**, pas un mystère comptable. 18 % contre 9 %, et quinze comptes sous 45 % de marge. Vous précisez que la remise n'explique pas 100 % des 16 points perdus à l'Est : le mix et le fret peuvent compléter. Honnêteté utile, qui évite un plan d'action trop étroit.
5. **La décision demandée.** Plafond à 12 % hors accord, revue des quinze comptes, point dans quinze jours. L'effet illustratif (retour de l'Est à 50 % ≈ 25 k€) est marqué comme scénario, pas comme forecast.

Ce qui n'entre pas : la requête SQL, les quatre définitions de marge que vous avez écartées, le détail des quinze comptes (annexe, pour la personne qui mènera la revue), un camembert du CA « pour contexte » qui répète la slide 1 sans rien décider.

> [!WARNING]
> « Une idée » n'est pas « un graphique vide ». C'est une phrase démontrable. Une slide sans phrase, couverte de quatre vignettes, demande au public de faire le travail d'analyste pendant la réunion. Il ne le fera pas.

Si une slide sert de support oral, le texte dessus reste court. Vous parlez le lien. Vous n'écrivez pas le discours en corps 12 sous le graphique : personne ne le lit, et vous le relisez à voix haute, ce qui fait deux fois le même texte.

# Le titre qui conclut

Le titre est la ligne qui reste dans le compte rendu et dans la tête de ceux qui n'ont vu que l'écran partagé. Il énonce le **résultat**, pas le contenant.

| Titre faible (il nomme le graphe) | Titre qui conclut |
|---|---|
| Marge par région | La marge baisse à l'Est |
| Évolution du CA | Le CA tient à 1,2 M€, stable vs T1 |
| Remises | Les remises Est sont à 18 %, contre 9 % ailleurs |
| Plan d'action | Geler les remises Est au-dessus de 12 % |
| Analyse T2 | L'Est explique environ 70 % de la baisse de marge |

Le titre faible force le lecteur à interpréter. Deux lecteurs sortent avec deux morales. Le titre qui conclut prend position, et c'est vérifiable : on peut le contredire avec les données. « La marge baisse à l'Est » se confirme ou se réfute. « Marge par région » n'est ni vrai ni faux : c'est une étiquette de dossier.

Quelques contraintes pour que le titre reste honnête :

- il contient le **chiffre** ou la comparaison dès que c'est possible (« −16 points à l'Est », pas « forte baisse ») ;
- il ne dit pas la cause si vous n'avez montré qu'une corrélation (« les remises accompagnent la baisse » est plus juste que « les remises ont détruit la marge », tant que le mix n'est pas écarté) ;
- il reste court. S'il faut une subordonnée et une parenthèse, vous avez deux slides ;
- il ne contredit pas l'annotation. Titre « marge stable », flèche « −16 points » : le public ne vous croit plus sur la suite.

Vous pouvez garder un sous-titre discret pour le périmètre : « Marge brute, CA HT livré, T2 vs T1 ». Le sous-titre qualifie. Il ne remplace pas la conclusion.

# Annoter le point, pas la décoration

L'annotation est une phrase courte collée au point, à la barre ou à la date qui porte le message. Elle dit ce que le titre ne peut pas localiser sur le dessin : **où** ça se passe.

Sur le graphique des quatre régions : une seule étiquette, sur la barre Est, « 42 % · −16 points vs T1 ». Pas une étiquette identique sur Nord, Sud et Ouest. Répéter « voici la valeur » sur chaque barre transforme le graphique en tableau mal fichu. Les valeurs de contexte peuvent rester sur l'axe ou en gris, plus petites.

Sur la courbe hebdomadaire, l'annotation se pose à la cassure, pas au milieu du segment plat : « semaine du 15 août · 120 livraisons ». Incluez l'unité et le repère de comparaison (vs T1, vs les autres régions, vs la promesse de 5 jours). Une flèche sans texte, ou un cercle rouge autour de tout le graphique, est un geste d'alarme, pas une annotation.

Ce que vous n'annotez pas :

- la méthode (« source : entrepôt, table fct_livraisons ») : elle va en pied de slide, en une ligne ;
- une consigne de lecture (« comme vous pouvez le voir ») ;
- un deuxième message (« et le NPS aussi ») : s'il mérite une flèche, il mérite une slide.

Le test : couvrez le graphique et lisez seulement le titre plus l'annotation. Vous devez obtenir presque toute l'idée. Si ce couple est vide (« Marge par région » + « Est »), recommencez.

# L'ordre d'une revue de quinze minutes

La structure SCR se traduit dans le temps de parole. Pour une revue de décision, un déroulé tient en cinq temps. Vous les annoncez en une phrase d'ouverture, afin que personne ne cherche la conclusion au mauvais moment.

```diagram
type: sequence
title: "Quinze minutes avec la direction"
actors: ["Vous", "Direction"]
messages:
  - from: 0
    to: 1
    text: "Ouverture : la décision demandée, en une phrase"
  - from: 0
    to: 1
    text: "Situation : CA stable, marge T1 à 58 %"
  - from: 0
    to: 1
    text: "Complication : 52 %, surtout l'Est et les remises"
  - from: 1
    to: 0
    text: "Question : est-ce le mix produit plutôt que la remise ?"
  - from: 0
    to: 1
    text: "Réponse chiffrée, puis la résolution et le rendez-vous de suivi"
```

1. **Ouverture (1 minute).** « Je vous demande de plafonner les remises Est à 12 % hors accord, et de valider une revue des quinze comptes sous 45 %. Le CA, lui, est stable. »
2. **Situation (2 minutes).** Le cadre : 1,2 M€, marge de référence 58 %. Une slide.
3. **Complication (6 minutes).** Les 6 points groupe, la part de l'Est, le mécanisme des remises. C'est le cœur. Vous laissez de la place pour la question difficile.
4. **Résolution (4 minutes).** L'action, qui la porte, le scénario d'effet, ce qui resterait non expliqué (le reste des 16 points Est).
5. **Suite (2 minutes).** Date du point, ce que vous ramènerez (les quinze comptes, le mix produit), ce que vous ne ferez pas (refondre la grille tarifaire nationale sur ce seul T2).

Préparez l'annexe pour la question que vous redoutez, pas pour montrer que vous avez beaucoup travaillé. Ici, la question probable est : « n'est-ce pas simplement un changement de mix, des produits à plus faible marge ? ». Ayez la réponse en une slide de secours : part du CA Est par famille de produits, T1 contre T2. Si le mix est stable et que la remise a doublé, vous le dites. S'il a bougé, vous le dites aussi. Le récit se corrige. Il ne se défend pas contre les faits.

Une note écrite suit le même ordre qu'une revue, avec des phrases complètes là où la slide n'avait qu'un titre. Trois paragraphes SCR, un graphique, la décision en tête de note. Les personnes absentes doivent pouvoir trancher sans vous rappeler. C'est le critère de fin : un lecteur qui n'était pas dans la salle retrouve la situation, la complication, la résolution, et sait ce qu'on attend de lui.

# Exercices

## Exercice 1 : Réécrire les titres

Remplacez chaque titre par un titre qui conclut, en vous servant des chiffres du chapitre (vous pouvez arrondir).

1. « Marge par région ».
2. « Évolution du chiffre d'affaires ».
3. « Analyse des remises commerciales ».
4. « Répartition des causes ».

<details>
<summary>Voir la solution</summary>

1. « La marge baisse à l'Est : 42 % au T2, contre 58 % au T1. »

2. « Le CA tient à 1,2 M€, stable par rapport au T1. » (Ainsi la réunion ne part pas sur un problème de ventes.)

3. « À l'Est, la remise moyenne est de 18 %, contre 9 % ailleurs. »

4. Mieux vaut éviter un titre fourre-tout. Par exemple : « L'Est explique environ 70 % de la baisse de marge groupe. » Si vous n'avez pas encore le mécanisme, ne titre pas « les remises sont la cause » sans le dire avec la prudence du chapitre.

</details>

## Exercice 2 : Remettre une revue dans l'ordre

Un collègue propose cet ordre : (a) liste des quinze comptes, (b) capture d'écran de la requête, (c) camembert 3D du CA par région, (d) « tout va bien côté ventes », (e) demande de geler les remises, (f) courbe de marge groupe sans titre chiffré. Reclassez en situation, complication, résolution, et dites ce qui sort de la salle.

<details>
<summary>Voir la solution</summary>

Ouverture possible par (e), formulée comme la décision, puis **situation** : (d) le CA est stable, à condition de le chiffrer (1,2 M€). **Complication** : (f) la marge groupe, avec le titre « 58 % puis 52 % », suivie du zoom Est (pas du camembert). Le mécanisme remises, puis seulement ensuite (a) en aperçu ou en annexe. **Résolution** : (e) développé (seuil 12 %, qui fait quoi, quand). Sortent de la revue principale : (b) la requête, (c) le camembert 3D. La requête va en note technique si quelqu'un audite. Le camembert répète le CA sans montrer la marge, et le 3D déforme les parts.

</details>

## Exercice 3 : Une slide, une idée

La slide unique affiche : barres de marge par région, courbe du CA sur 8 trimestres, tableau des quinze comptes, et le texte « il faudrait aussi regarder le transporteur ». Le titre est « Point data T2 ». Découpez en slides (titre concluant + ce qui est sur la slide) et dites ce que vous faites du transporteur.

<details>
<summary>Voir la solution</summary>

Au moins quatre slides. « Le CA tient à 1,2 M€ » avec la courbe, annotée seulement si un trimestre casse. « La marge groupe passe de 58 % à 52 % ». « La marge baisse à l'Est (42 %, −16 points) » avec les barres et une annotation sur l'Est. « Quinze comptes Est sous 45 % de marge concentrent l'écart » avec un extrait du tableau, pas les quinze lignes en corps 8. Décision à part : « Plafonner les remises Est à 12 % hors accord ».

Le transporteur n'entre pas sur ces slides tant qu'il n'a pas de chiffre lié à la baisse de marge. Soit vous avez le calcul et il devient une complication distincte (une slide, une idée), soit vous le notez comme question ouverte en annexe, sans le mêler au message principal.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Le récit qui fait décider
center: "Situation, complication, résolution : une idée par slide, un titre qui dit déjà la conclusion chiffrée."
points:
  - icon: book
    title: Fil SCR
    text: "Le cadre partagé, ce qui le casse, l'action demandée. La méthode reste en note, pas en ouverture."
  - icon: file
    title: Une idée
    text: "Une slide, une phrase. Si vous couvrez le titre et ne savez plus la dire, coupez la slide en deux."
  - icon: chat
    title: Titre qui conclut
    text: "« La marge baisse à l'Est », pas « Marge par région ». Le titre doit pouvoir être vrai ou faux."
  - icon: target
    title: Annotation
    text: "Une étiquette sur le point qui compte, avec l'unité et la comparaison. Pas une flèche sur chaque barre."
  - icon: clock
    title: Quinze minutes
    text: "Annoncez la décision, prouvez-la, répondez à l'objection préparée, fixez la date de suivi."
pitfall: "Empiler CA, marge, comptes et pistes diverses sur une slide titrée « Point data », sans phrase que l'on puisse contredire."
remember: "Le public doit pouvoir répéter la conclusion sans vous. Le chiffre, le périmètre et l'action tiennent dans le titre."
```
