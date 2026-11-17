---
title: De la baseline au modèle
description: Poser une baseline honnête, comparer les modèles sur un protocole figé, et ne jamais régler les choix sur le jeu de test.
duration: 40
objectives:
  - Construire une baseline adaptée à la tâche avant tout modèle élaboré
  - Écrire un protocole de comparaison identique pour toutes les méthodes
  - Réserver le jeu de test à une mesure finale, hors réglage
  - Choisir le modèle le plus simple dans la marge convenue, ou s'arrêter
---

# Sans baseline, le score ne dit rien

Un modèle à 0,82 d'AUC n'est ni bon ni mauvais tant qu'on ne dit pas **contre quoi**. Sur une classe rare, le hasard et le classifieur constant sont faciles à battre, et ce n'est pas une nouvelle. Sur une résiliation, la règle « l'engagement se termine dans le mois » est souvent déjà forte, parce que le métier a repéré le motif principal avant vous.

La **baseline** est la réponse la plus simple encore honnête : calculable avec les informations **connues à la date de décision**, expliquable, et évaluée sur le **même** découpage et la **même** métrique que les modèles suivants. Elle n'a pas à être naïve jusqu'à l'absurde. Elle a à être le plancher en dessous duquel un modèle complexe ne mérite pas d'exister.

Si la baseline atteint déjà le critère d'arrêt du cadrage, on la livre. Ajouter un boosting pour gagner un demi-point que personne ne traitera est une activité de notebook, pas un projet.

# Une baseline par type de tâche

| Tâche | Baseline minimale | Baseline souvent plus juste |
|---|---|---|
| Classification déséquilibrée | Classe majoritaire | Une règle métier à une ou deux conditions |
| Classement pour une action capacitaire | Tirage aléatoire de la liste | Trier sur la feature que le métier cite déjà |
| Régression | Prédire la moyenne d'entraînement | Prédire la dernière valeur observée |
| Série temporelle | Persistance, ou saison naïve | La méthode simple du chapitre de forecasting, pas un réseau |

Pour un churn d'opérateur, une baseline de travail ressemble à ceci. On classe d'abord les contrats dont la fin d'engagement tombe dans l'horizon (30 jours), puis, à égalité, ceux qui ont le plus d'appels au support sur 90 jours. Pas d'apprentissage, pas de seuil caché. On mesure la précision parmi les 500 premiers. Le classifieur majoritaire, lui, ne **trie** personne : tout le monde a le même score. Le citer en AUC de 0,5 rappelle l'échelle, il ne constitue pas la baseline de décision.

La règle doit être applicable le lundi. « Trier par le motif de départ » n'est pas une baseline, c'est une fuite. « Trier par l'ancienneté » est une baseline faible mais licite, utile comme barre basse, insuffisante comme adversaire final si une règle d'engagement existe déjà.

On code la baseline dans le **même** pipeline d'évaluation que le reste. Une baseline recalculée à la main dans une cellule, sur un filtre différent, ne se compare à rien.

```diagram
type: stack
title: "Qui doit battre qui"
segments:
  - label: "Hasard ou constante"
    value: 15
    tone: rose
    text: "Montre l'échelle. Trop faible pour décider un déploiement."
  - label: "Règle métier"
    value: 25
    tone: amber
    text: "L'adversaire réel. Si elle suffit, on s'arrête."
  - label: "Modèle simple"
    value: 25
    tone: teal
    text: "Logistique ou arbre peu profond, features peu nombreuses."
  - label: "Modèle riche"
    value: 35
    tone: violet
    text: "Boosting, puis réseau seulement s'il bat le boosting."
```

# Un protocole écrit avant la comparaison

Le protocole tient en une liste qu'on ne retouche pas après avoir vu qui gagne.

1. **Population et unité**, reprises du cadrage (contrat × date d'observation, exclusions).
2. **Découpage.** Temporel si le temps structure la donnée : train jusqu'à une date, validation sur la période suivante, test sur une période encore après. Aléatoire **par groupe** seulement si les lignes sont échangeables dans le temps et qu'aucune même entité ne fuit d'un côté à l'autre. Le choix s'écrit avec sa raison.
3. **Métrique de décision** et métrique secondaire, plus la marge qui compte (5 points de précision@500, pas « l'AUC qui monte »).
4. **Ce qui est commun** : même lignes, même cible, même façon de gérer les manquants **à l'intérieur** de chaque méthode (le boosting peut différer du réseau sur le scaler, pas sur les dates).
5. **Ce qu'on sélectionne sur la validation** : hyperparamètres, seuil ou profondeur de liste, abandon d'une feature.
6. **Une seule lecture du test**, à la fin, pour le modèle déjà choisi.

On compare des **écarts**, pas des vainqueurs isolés. Un tableau lisible :

| Modèle | Métrique validation | Écart à la règle |
|---|---|---|
| Règle d'engagement | valeur | 0 |
| Régression logistique | valeur | écart |
| Gradient boosting | valeur | écart |

Un écart plus petit que la variation d'une graine à l'autre, ou d'une fenêtre de validation à l'autre, n'est pas un écart. On le dit. On ne le décore pas de trois décimales.

> [!IMPORTANT]
> Ajouter un modèle au tableau après avoir vu le test, « pour être complet », transforme le test en validation. Le protocole prévoit la liste des candidats **avant**. Un oubli se corrige en brûlant le test et en prenant une période nouvelle, pas en faisant semblant que la lecture n'a pas eu lieu.

# Ce qu'on ne règle pas sur le test

Le test estime l'erreur **future** une fois les choix figés. Dès qu'un choix dépend de ce qu'on y a vu, il n'estime plus, il s'ajuste.

On ne touche pas, en regardant le test :

- la profondeur des arbres, le taux d'apprentissage, le nombre d'epochs, l'architecture ;
- la liste des features, y compris « j'enlève cette colonne, le test monte » ;
- le seuil de score ou le nombre de personnes appelées, s'il a été optimisé pour plaire au test ;
- le découpage lui-même (« et si le test commençait un mois plus tôt ») ;
- la décision d'écarter des outliers **parce que** le test les rate.

Tous ces gestes sont légitimes sur la **validation**, ou sur une validation temporelle roulante. Le test arrive quand le geste est déjà écrit.

Le point de fonctionnement fait partie des choix. « On appelle les 500 premiers » peut être imposé par la capacité : alors il est fixé par le cadrage, et le test ne fait que le mesurer. « On cherche le seuil qui maximise F1 » se fait sur la validation. Le refaire sur le test, c'est choisir le seuil sur la copie que l'on prétend découvrir.

Combien de regards abîment le test ? Un seul regard propre est le contrat. Cinq essais « pour vérifier une idée » le usent, même si chacun semblait innocent. Si cela s'est produit, le rapport le **dit**, et le chiffre est présenté comme optimiste, ou l'on attend une nouvelle période. Cacher les essais est plus grave que les avoir faits.

```diagram
type: compare
title: "Validation et test"
columns:
  - title: "Validation"
    tone: teal
    items:
      - "Choisit le modèle et les réglages"
      - "Choisit le seuil ou la profondeur de liste"
      - "Peut être regardée souvent"
      - "Reste dans la période prévue, sans le test"
  - title: "Test"
    tone: rose
    items:
      - "Mesure une fois le choix déjà fait"
      - "Ne sert pas à départager une hésitation"
      - "Ne sert pas à supprimer une feature"
      - "Se jette et se remplace s'il a été usé"
```

# Lire un écart, puis s'arrêter

Un tableau de validation fictif, pour le **geste** de lecture, pas comme un résultat à recopier :

| Modèle | Précision@500 |
|---|---|
| Règle d'engagement puis appels support | 0,22 |
| Logistique sur cinq features | 0,28 |
| Gradient boosting | 0,36 |
| Réseau dense, features standardisées | 0,34 |

On déploie le **boosting**, pas le réseau : le réseau ne gagne pas, il coûte plus cher à expliquer et à servir. On ne déploie la logistique que si la marge exigée contre la règle était de 5 points et qu'on avait décidé à l'avance de préférer le modèle simple **dans** cette marge. Ici, 0,28 n'est que 6 points au-dessus de la règle, et le boosting en ajoute encore 8 : l'écart est assez grand pour payer la complexité d'un boosting, pas celle d'un réseau. Ces seuils de « assez grand » viennent du cadrage, pas du tableau.

On regarde aussi le **segment** sur lequel on agit. Un boosting qui gagne en global et perd sur les clients que l'équipe appelle vraiment (les fins d'engagement, les nouveaux) n'est pas le bon vainqueur. La métrique globale ne remplace pas la métrique de la file d'attente.

S'arrêter inclut le cas négatif. Aucun modèle ne dépasse la règle de la marge prévue : on livre la règle, on archive le tableau, on ne relance pas « une dernière architecture » sur le test. Le temps gagné se reporte sur la donnée manquante ou sur l'offre, qui limitent souvent plus que l'algorithme.

> [!TIP]
> Écrivez la phrase de décision dans le même document que le tableau : « On retient le boosting, seuil de liste à 500, car il gagne X points sur la règle en validation. Le réseau est écarté. Le test sera lu une fois après gel des hyperparamètres. » Une phrase absente est souvent le signe que le choix s'est fait en regardant trop de chiffres.

# Le plus simple dans la marge

La complexité est un coût : temps de réglage, risque de fuite, difficulté d'explication, charge du réentraînement. Le protocole peut donc inclure une **préférence pour le simple**, écrite avant :

« À métrique de validation égale à 1 point près, on garde le modèle le plus simple déjà au-dessus de la baseline de 5 points. »

Sans cette phrase, le modèle le plus lourd gagne les discussions, parce qu'il a l'air d'avoir plus travaillé. Avec cette phrase, un arbre peu profond qui fait le travail reste en place, et le boosting ne part en production que pour un écart qui paie.

Le réseau, sur un tableau, est en bout de file : il doit battre le boosting, pas seulement la règle. Le chapitre sur le moment d'utiliser le deep learning s'applique ici sans exception. Un protocole qui saute le boosting « pour aller plus vite vers le réseau » ne va pas plus vite. Il se prive de l'adversaire qui aurait suffi.

# Exercices

## Exercice 1 : Choisir l'adversaire

Pour un classement de contrats à appeler (500 places, horizon 30 jours), un collègue prend comme unique baseline le classifieur constant « pas de résiliation », AUC 0,50. Le métier appelle déjà, sans modèle, les fins d'engagement du mois.

Pourquoi cette baseline est-elle trop faible, et laquelle mettez-vous à la place ? Que mesurez-vous, puisque l'AUC du constant ne décrit pas une liste ?

<details>
<summary>Voir la solution</summary>

Le constant ne produit aucun ordre : tout le monde est ex æquo. L'AUC à 0,50 rappelle que le hasard est bas, elle ne dit pas si le modèle améliore **la liste que le métier sait déjà faire**. Battre 0,50 est presque automatique dès qu'une feature est liée à la cible.

Baseline de décision : trier par fin d'engagement dans les 30 jours, puis par nombre d'appels support sur 90 jours (features connues à la date). Métrique : **précision parmi les 500 premiers**, sur le même découpage que les modèles. On peut garder l'AUC en secondaire, pas en critère de déploiement.

</details>

## Exercice 2 : Ce qui a usé le test

Une équipe a figé le boosting sur la validation. Puis, sur le test, elle a successivement enlevé deux features, changé la profondeur, et déplacé le début du test d'un mois, parce que « le mois de lancement d'offre était spécial ». Le dernier chiffre est le meilleur des quatre.

Lequel, s'il en reste un, peut-on rapporter comme estimation honnête ? Que faire du reste ?

<details>
<summary>Voir la solution</summary>

**Aucun** des quatre chiffres n'est une estimation honnête du futur. Le premier regard aurait pu l'être, avant les retouches. Dès la première feature enlevée à cause du test, le test est devenu une validation. Choisir le meilleur des quatre le surestime encore.

On rapporte que le test a été usé, on ne publie pas le maximum comme performance attendue. La suite propre : geler les choix sur la seule validation (ou sur une nouvelle période de validation), et mesurer **une fois** sur une période de test jamais ouverte. Si aucune période neuve n'existe encore, on attend, ou l'on livre avec une incertitude explicitement plus large. On ne moyenne pas discrètement les essais pour « lisser ».

</details>

## Exercice 3 : Qui part en production ?

Sur la validation temporelle, précision parmi les 500 :

- règle métier : 0,24
- logistique : 0,29
- boosting : 0,33
- réseau dense : 0,32

La marge écrite était : au moins +5 points sur la règle, et, à 1 point près, on préfère le plus simple. Le segment « nouveaux contrats » suit le même ordre, avec des écarts analogues. Personne n'a ouvert le test.

Quel modèle retenez-vous, et lequel écartez-vous sans appel ?

<details>
<summary>Voir la solution</summary>

La logistique gagne 5 points (0,29 contre 0,24), elle atteint juste la marge. Le boosting gagne 9 points, soit **4 points de plus** que la logistique, au-delà de la tolérance de 1 point qui aurait fait préférer le plus simple. On retient donc le **boosting**. Le segment des nouveaux contrats ne renverse pas l'ordre : rien ne vient contredire ce choix.

Le **réseau** est écarté sans appel : il est sous le boosting (0,32 contre 0,33) et plus coûteux. On ne le « garde sous le coude » pour le test. Le test, encore fermé, mesurera **uniquement** le boosting déjà choisi (et la règle, pour rappeler l'écart), une fois.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "De la baseline au modèle"
center: "On bat une baseline honnête, sur un protocole écrit avant. Le test mesure le choix, il ne le fabrique pas."
points:
  - icon: ruler
    title: "Une vraie baseline"
    text: "La règle que le métier sait déjà appliquer. Le hasard est une échelle, pas un adversaire."
  - icon: list
    title: "Protocole commun"
    text: "Mêmes lignes, même cible, même métrique. La liste des modèles est figée avant le test."
  - icon: lock
    title: "Test fermé"
    text: "Réglages, features et seuil se jouent en validation. Un test regardé cinq fois est usé."
  - icon: scale
    title: "L'écart qui paie"
    text: "À un point près, on garde le plus simple. Le réseau doit battre le boosting, pas la règle seule."
  - icon: check
    title: "Savoir s'arrêter"
    text: "Si la marge n'est pas là, on livre la règle. Un résultat négatif se range avec les autres."
pitfall: "Publier le meilleur de plusieurs essais sur le test, après avoir retiré les features qui le gênaient."
remember: "Sans baseline commune et sans test intact, le chiffre le plus haut n'est pas une performance. C'est un essayage."
```
