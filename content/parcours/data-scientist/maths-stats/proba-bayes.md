---
title: Probabilités conditionnelles et Bayes
description: Calculer une probabilité conditionnelle, mettre à jour une croyance avec Bayes sur un test médical, et éviter le piège du taux de base.
duration: 60
objectives:
  - Distinguer une probabilité conjointe, marginale et conditionnelle sur un tableau d'effectifs
  - Nommer le prior, la vraisemblance et le posterior dans une mise à jour
  - Calculer un posterior à partir d'effectifs, puis le retrouver avec la formule
  - Reconnaître le sophisme du taux de base quand on inverse une condition
---

# Compter avant de diviser

Une probabilité, au début, est un **quotient d'effectifs**. Vous comptez, puis vous divisez. Les formules viendront après, quand le tableau est clair.

Une banque examine **1 000** virements. **40** sont frauduleux (4 %). Une règle en marque certains.

| | Fraude | Légitime | Total |
|---|---:|---:|---:|
| Règle déclenchée | 30 | 96 | 126 |
| Règle silencieuse | 10 | 864 | 874 |
| Total | 40 | 960 | 1 000 |

Vérifiez les marges. Fraudes : 30 + 10 = **40**. Légitimes : 96 + 864 = **960**. Déclenchements : 30 + 96 = **126**. Le tableau ferme : 126 + 874 = 1 000.

De ce rectangle sortent trois familles de quotients, et les mélanger est l'erreur du chapitre.

- **Conjointe** : fraude **et** déclenchement, 30 / 1 000 = **0,03**.
- **Marginale** : fraude, quelle que soit la règle, 40 / 1 000 = **0,04**. Déclenchement, quelle que soit la fraude, 126 / 1 000 = **0,126**.
- **Conditionnelle** : on ne divise plus par 1 000, on divise par le sous-total de la condition.

# La probabilité conditionnelle

La probabilité de A **sachant** B est la part de A à l'intérieur des cas où B est vrai.

```text
P(déclenchement | fraude) = 30 / 40 = 0,75
P(fraude | déclenchement) = 30 / 126 ≈ 0,238
```

Le trait vertical se lit « sachant ». Les deux nombres utilisent le même 30, et pourtant **0,75 n'est pas 0,238**. Le premier dit : parmi les fraudes, trois quarts déclenchent la règle. Le second dit : parmi les virements déclenchés, environ **24 %** sont vraiment des fraudes. Le dénominateur a changé (40, puis 126).

```diagram
type: compare
title: Les deux sens de la condition
columns:
  - title: Sachant la fraude
    tone: violet
    items:
      - Dénominateur 40, les fraudes
      - 30 déclenchées sur 40
      - 0,75 soit 75 %
      - Qualité de la règle sur les fraudes
  - title: Sachant le déclenchement
    tone: amber
    items:
      - Dénominateur 126, les alertes
      - 30 fraudes sur 126
      - Environ 0,238 soit 24 %
      - Chance qu'une alerte soit une fraude
```

Sur les légitimes, la règle se trompe 96 fois sur 960, soit **10 %**. Elle est donc assez silencieuse sur les vrais virements, et pourtant une alerte n'est frauduleuse qu'une fois sur quatre, parce que les légitimes sont **24 fois** plus nombreux que les fraudes (960 / 40 = 24). Dix pour cent d'un grand groupe pèsent plus que soixante-quinze pour cent d'un petit groupe : 96 faux déclenchements contre 30 vrais.

Quand vous lisez une phrase du type « le détecteur a raison dans 75 % des fraudes », demandez tout de suite : **75 % de quoi ?** Si le dénominateur n'est pas dit, la phrase ne porte pas encore de décision.

# Bayes, en une phrase

**Bayes** relie les deux sens de la condition. En mots : la plausibilité d'une hypothèse **après** une observation est proportionnelle à sa plausibilité **avant**, multipliée par la chance d'observer cela **si** l'hypothèse est vraie.

Pour une hypothèse H et une observation D :

```text
P(H | D) = P(D | H) × P(H) / P(D)
```

- `P(H)` est ce que vous pensiez **avant** de voir D.
- `P(D | H)` est la chance de voir D quand H est vraie.
- `P(D)` est la chance de voir D toutes hypothèses confondues. C'est le dénominateur qui remet le résultat entre 0 et 1.
- `P(H | D)` est ce que vous pouvez penser **après**.

Sur les virements, H est « fraude », D est « règle déclenchée ».

```text
P(fraude)                 = 40/1000 = 0,04
P(déclenchement | fraude) = 30/40   = 0,75
P(déclenchement)          = 126/1000 = 0,126
P(fraude | déclenchement) = 0,75 × 0,04 / 0,126 = 0,03 / 0,126 ≈ 0,238
```

0,03 / 0,126 ≈ 0,238, soit 30 / 126. La formule retrouve le quotient du tableau. Vous n'en avez pas besoin quand tous les effectifs sont sous vos yeux. Elle devient nécessaire quand on vous donne des **taux** séparés (une prévalence, une sensibilité) sans le rectangle déjà rempli. C'est le cas du test médical qui suit.

```video
url: https://www.youtube.com/watch?v=HZGCoVF3YvM
title: "Bayes theorem, the geometry of changing beliefs"
channel: "3Blue1Brown"
duration: "15:11"
lang: en
why: "Le théorème de Bayes rendu visuel par 3Blue1Brown, en comptant des personnes plutôt qu'en manipulant des formules."
```

# Un test médical sur 10 000 personnes

Une maladie touche **1 %** d'une population. Sur **10 000** personnes : **100** malades, **9 900** personnes saines.

Le test rend un positif pour **90 %** des malades (il en manque 10). Il rend aussi un positif pour **5 %** des personnes saines, soit 0,05 × 9 900 = **495** faux positifs.

| | Malade | Sain | Total |
|---|---:|---:|---:|
| Test positif | 90 | 495 | 585 |
| Test négatif | 10 | 9 405 | 9 415 |
| Total | 100 | 9 900 | 10 000 |

Parmi les positifs, la part de malades vaut :

```text
P(malade | positif) = 90 / 585 ≈ 0,154
```

Environ **15 %**, pas 90 %. Sur 585 personnes rappelées, environ **495** sont saines. Le test n'est pas « mauvais » au sens où il a bien vu 90 malades sur 100. Il est appliqué à une maladie **rare**, donc les faux positifs, même à 5 %, sont nombreux.

La formule donne le même 15 % :

```text
P(positif) = 0,90 × 0,01 + 0,05 × 0,99
           = 0,009 + 0,0495
           = 0,0585

P(malade | positif) = (0,90 × 0,01) / 0,0585
                    = 0,009 / 0,0585
                    ≈ 0,154
```

0,0585, c'est aussi 585 / 10 000. Le premier terme du numérateur, 0,009, c'est les 90 vrais positifs sur 10 000. Le second terme du dénominateur, 0,0495, c'est les 495 faux positifs.

Changez seulement la rareté, gardez le même test. Si la maladie touchait **50 %** des 10 000 personnes (5 000 malades, contexte de dépistage ciblé, pas la rue) :

```text
vrais positifs  = 0,90 × 5 000 = 4 500
faux positifs   = 0,05 × 5 000 = 250
P(malade | +)   = 4 500 / 4 750 ≈ 0,947
```

Le même test, la même « fiabilité de 90 % » sur les malades, et le positif veut dire **94,7 %** au lieu de **15 %**. Ce qui a changé, c'est la fréquence de la maladie **avant** le test.

> [!IMPORTANT]
> Un test ne porte pas sa conclusion en lui. 90 % de détection ne veut pas dire 90 % de chances d'être malade quand le test est positif. Il manque la rareté.

# Prior, vraisemblance, posterior

Les trois mots nomment les trois pièces de la formule. Autant les fixer sur l'exemple médical, avec la maladie à 1 %.

| Pièce | Notation | Valeur ici | Lecture |
|---|---|---|---|
| Prior | P(malade) | 0,01 | Avant le test, 1 personne sur 100 est malade |
| Vraisemblance | P(positif \| malade) | 0,90 | Si la personne est malade, le test est positif 9 fois sur 10 |
| Marginale | P(positif) | 0,0585 | Le positif arrive 585 fois sur 10 000, malades et sains mélangés |
| Posterior | P(malade \| positif) | 0,154 | Après un positif, environ 15 % de chances d'être malade |

Le **prior** est l'information d'avant. Il peut venir d'un registre (1 % dans cette population), pas d'une impression. Un prior de 1 % et un prior de 50 % ne sont pas deux « avis » interchangeables : vous avez vu qu'ils changent le posterior de 15 % à 94,7 %.

La **vraisemblance** n'est pas la probabilité de l'hypothèse. C'est la probabilité de l'observation si l'hypothèse est tenue pour vraie. P(positif \| malade) = 0,90 parle du test, pas du patient qui attend le résultat.

Le **posterior** est le prior mis à jour. Il devient le prior du prochain renseignement. Un second test, indépendant, repartirait de 0,154 et non plus de 0,01. Vous ne réappliquez pas 1 % comme si le premier positif n'avait pas eu lieu.

Dans la fraude, le même vocabulaire : prior 0,04, vraisemblance 0,75, posterior environ 0,24. La règle a **multiplié** le risque par environ 6 (0,238 / 0,04 ≈ 6), elle ne l'a pas transformé en certitude.

```diagram
type: flow
title: Une mise à jour, pas une preuve
steps:
  - title: Prior
    text: 1 % de malades avant le test
    tone: blue
  - title: Observation
    text: Le test revient positif
    tone: amber
  - title: Vraisemblance
    text: 90 % des malades sont positifs, 5 % des sains aussi
    tone: teal
  - title: Posterior
    text: Environ 15 % de chances d'être malade
    tone: violet
```

# Le sophisme du taux de base

Le **sophisme du taux de base** consiste à ignorer le prior. La phrase type, sur le test : « il détecte 90 % des malades, donc un positif a 90 % de chances d'être malade. » Elle échange P(positif \| malade) et P(malade \| positif). Le taux de base, 1 %, a disparu. Le calcul avec le taux de base donne **15 %**.

Même glissement sur la fraude. « La règle attrape 75 % des fraudes, donc un virement déclenché est frauduleux à 75 %. » Non : 75 % est P(déclenchement \| fraude). La part de fraudes parmi les alertes est **24 %**, parce que le taux de base est 4 % et que 10 % des virements légitimes déclenchent aussi la règle.

Vous le reconnaîtrez à deux signes.

1. On vous cite une performance **dans un seul sens** (détection des malades, détection des fraudes) et on vous demande l'autre sens (que veut dire un positif).
2. Le groupe recherché est rare, et personne n'a dit **combien** il est rare.

Le réflexe de travail : reconstruire le rectangle sur une population ronde, **10 000** personnes ou **1 000** virements, remplir les quatre cases, puis diviser par la bonne ligne. Si vous n'avez pas le prior, vous ne calculez pas le posterior. Vous dites qu'il manque le taux de base, ce qui est une réponse plus juste qu'un 90 % récité.

Ce réflexe revient dès qu'un modèle produit un score. Un modèle qui rappelle 90 % des fraudes peut, selon le seuil et la rareté, noyer l'équipe sous les faux positifs. Le chapitre sur le métier l'a dit en euros. Bayes le dit en effectifs : regardez la colonne « sain » du tableau, pas seulement la case 90.

```video
url: https://www.youtube.com/watch?v=lG4VkPoG3ko
title: "The medical test paradox, and redesigning Bayes' rule"
channel: "3Blue1Brown"
duration: "21:14"
lang: en
why: "Le paradoxe du test médical et une façon plus intuitive d'écrire la règle de Bayes, en écho direct au sophisme du taux de base."
```

# Exercices

## Exercice 1 : Le bon dénominateur

Reprenez les 1 000 virements : 30 fraudes déclenchées, 10 fraudes silencieuses, 96 légitimes déclenchés, 864 légitimes silencieux.

1. Quelle est P(fraude | silence de la règle) ?
2. Quelle est P(silence | légitime) ?
3. Pourquoi ces deux nombres ne s'additionnent-ils pas à 1 ?

<details>
<summary>Voir la solution</summary>

1. Parmi les 874 virements silencieux, 10 sont des fraudes. P(fraude | silence) = 10 / 874 ≈ **0,011**, soit environ 1,1 %.
2. Parmi les 960 légitimes, 864 sont silencieux. P(silence | légitime) = 864 / 960 = **0,90**.
3. Les conditions ne portent pas sur le même ensemble (les silencieux, puis les légitimes). Ce ne sont pas deux issues d'une même alternative. En revanche, P(fraude | silence) + P(légitime | silence) = 10/874 + 864/874 = 1.

</details>

## Exercice 2 : Reconstruire le test

Un dépistage concerne **20 000** personnes. La maladie touche **2 %**. Le test est positif pour **80 %** des malades et pour **10 %** des personnes saines.

1. Combien de vrais positifs et de faux positifs ?
2. Quelle est la probabilité d'être malade sachant un test positif ?
3. Quel nom (prior, vraisemblance, posterior) porte le 2 %, et quel nom porte votre résultat ?

<details>
<summary>Voir la solution</summary>

1. Malades : 0,02 × 20 000 = **400**. Sains : **19 600**. Vrais positifs : 0,80 × 400 = **320**. Faux positifs : 0,10 × 19 600 = **1 960**.
2. Positifs au total : 320 + 1 960 = **2 280**. P(malade | positif) = 320 / 2 280 ≈ **0,140**, soit environ 14 %.
3. Le **2 %** est le **prior**. Le résultat 14 % est le **posterior**. Le 80 % est une **vraisemblance**, P(positif | malade), pas la probabilité d'être malade.

</details>

## Exercice 3 : Repérer la phrase fausse

Une note interne dit : « Notre score détecte 90 % des fraudes. Une alerte a donc 90 % de chances d'être une fraude. Inutile de regarder la part de fraudes dans le flux, le modèle est précis. »

1. Quel nom porte cette erreur ?
2. Avec un prior de 4 % et le tableau du cours (30 vraies alertes, 96 fausses), quel est le bon ordre de grandeur ?
3. Quelle donnée manque le jour où l'on vous donne seulement « 90 % de détection » ?

<details>
<summary>Voir la solution</summary>

1. Le **sophisme du taux de base** : on inverse la condition et on oublie la rareté.
2. 30 / (30 + 96) = 30 / 126 ≈ **24 %**, pas 90 %. Le 90 % du cours médical n'est d'ailleurs pas le 75 % de cette règle : les deux phrases font la même erreur de sens, avec des taux différents.
3. Il manque le **taux de base** (la part de fraudes dans le flux) et le taux de faux positifs parmi les paiements légitimes. Sans ces deux pièces, le posterior ne se calcule pas.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Condition et Bayes
center: Le sens de la condition change le dénominateur, et le taux de base ne s'efface pas.
points:
  - icon: filter
    title: Sachant quoi ?
    text: "P(alerte | fraude) divise par les fraudes. P(fraude | alerte) divise par les alertes."
  - icon: database
    title: Le rectangle d'abord
    text: "1 000 virements, 40 fraudes, 126 alertes. 30/40 = 0,75 mais 30/126 ≈ 0,24."
  - icon: loop
    title: Prior fois vraisemblance
    text: Le posterior égale ce produit, divisé par la chance de l'observation toutes causes confondues.
  - icon: alert
    title: Le test à 90 %
    text: Sur une maladie à 1 %, un positif ne laisse qu'environ 15 % de chances d'être malade.
  - icon: eye
    title: Taux de base
    text: Oublier la rareté inverse la condition. Sans prior, vous ne calculez pas le posterior.
pitfall: "Lire « détecte 90 % des malades » comme « un positif est malade à 90 % ». Les dénominateurs diffèrent."
remember: Remplissez quatre cases sur 10 000 personnes avant de croire un pourcentage isolé.
```
