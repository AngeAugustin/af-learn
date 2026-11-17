---
title: Le métier de Data Scientist
description: Ce que fait un Data Scientist, comment il se distingue des métiers voisins, et le cycle qui mène du problème à la décision.
duration: 55
objectives:
  - Situer le Data Scientist face à l'analyste, à l'engineer, au ML Engineer et à l'AI Engineer
  - Décrire le cycle problème, données, baseline, modèle, évaluation, décision
  - Reconnaître ce qu'un modèle ne doit pas faire
  - Juger un score par le coût de la décision, pas seulement par un pourcentage
---

# Qu'est-ce qu'un Data Scientist ?

Un **Data Scientist** transforme une décision incertaine en une question mesurable, puis estime ce qui est probable à partir de données. Il ne se contente pas de décrire le passé. Il propose une règle, un score ou un regroupement, il le compare à une solution simple, et il dit clairement dans quelles conditions le résultat peut servir.

Prenons une banque qui traite **10 000 paiements par jour**, dont environ **2 %** sont frauduleux, soit **200 fraudes**. La question utile n'est pas « peut-on faire de l'intelligence artificielle ? ». Elle est : « parmi les paiements de demain, lesquels bloquer ou faire relire, sachant qu'un faux blocage coûte **6 €** de service client et qu'une fraude manquée coûte **140 €** en moyenne ? »

Le travail consiste alors à :

- nommer la **cible** : un paiement est frauduleux s'il est contesté dans les **14 jours** ;
- n'utiliser que des informations **connues au moment du paiement** (montant, pays, heure, historique du client) ;
- estimer un risque, le comparer à une règle déjà en caisse, et seulement ensuite proposer un seuil.

> [!NOTE]
> Un modèle est un outil d'estimation. La décision (bloquer, relancer, soigner, accorder) reste un choix, avec un responsable et un coût.

Le reste de ce parcours apprend à faire ce travail pour du **machine learning classique** : tableaux, probabilités, modèles, évaluation, séries, texte sous forme de variables, puis mise à disposition d'un modèle. Vous y construirez des expériences que l'on peut relancer et critiquer.

# Quatre métiers voisins, quatre questions

Les intitulés de poste varient, mais les questions, elles, se séparent assez bien. Confondre les rôles mène à recruter un modèle là où il manque un pipeline, ou un tableau de bord là où il manque une estimation.

```diagram
type: compare
title: Quatre métiers, quatre questions
columns:
  - title: Data Analyst
    tone: amber
    items:
      - Que s'est-il passé ?
      - Tableaux de bord et études
      - Décrit, segmente, explique un écart
  - title: Data Engineer
    tone: teal
    items:
      - La donnée arrive-t-elle propre et à l'heure ?
      - Pipelines et stockage
      - Qualité, volume, fraîcheur
  - title: Data Scientist
    tone: violet
    items:
      - Que va-t-il probablement se passer ?
      - Baseline, modèle, évaluation
      - Incertitude et coût des erreurs
  - title: ML Engineer
    tone: blue
    items:
      - Le modèle tourne-t-il en production ?
      - Service, latence, surveillance
      - Réentraînement et versions
```

| Métier | Livrable typique sur la fraude | Ce qu'il ne fait pas à votre place |
|---|---|---|
| Data Analyst | « Le mois dernier, 200 fraudes, dont 70 au-dessus de 600 €. » | Estimer le risque d'un paiement pas encore vu |
| Data Engineer | Un extrait quotidien, daté, sans doublon, de 10 000 lignes | Choisir le seuil de blocage |
| Data Scientist | Un score comparé à la règle « montant > 600 € », avec le coût des erreurs | Garantir le service à 50 ms, 24 h sur 24 |
| ML Engineer | Une API qui renvoie le score, des alertes si le taux de fraude dérive | Inventer la cible métier |

L'**AI Engineer** est un cinquième voisin. Il construit des produits qui s'appuient sur des **modèles génératifs déjà entraînés** (résumer, rédiger, classer un texte libre, dialoguer avec un utilisateur). Son centre de gravité est l'application, pas l'estimation d'un paramètre sur un tableau historique. Ce parcours ne forme pas à ce métier : il reste sur l'expérimentation statistique et le machine learning classique.

Dans une équipe de trois personnes, les mêmes mains cumulent souvent deux rôles. Cela ne mélange pas les questions. Avant d'ouvrir un notebook, écrivez laquelle vous êtes en train de traiter.

# Le cycle du problème à la décision

Un projet de modélisation tient en six temps. Les sauter dans l'ordre inverse (choisir un algorithme le lundi, chercher une question le vendredi) produit un score que personne ne sait utiliser.

```diagram
type: flow
title: Du problème à la décision
steps:
  - title: Problème
    text: Décision, horizon, coût des deux erreurs
    tone: violet
  - title: Données
    text: Lignes connues à l'instant de décider
    tone: blue
  - title: Baseline
    text: Majorité, moyenne ou règle métier
    tone: teal
  - title: Modèle
    text: Une hypothèse qui doit battre la baseline
    tone: teal
  - title: Évaluation
    text: Métrique alignée sur le coût, hors apprentissage
    tone: amber
  - title: Décision
    text: Déployer, ajuster le seuil, ou s'arrêter
    tone: rose
```

**Problème.** Formulez la décision, l'horizon et les deux erreurs. Ici : relire ou non un paiement dans les secondes qui suivent. Un faux positif coûte 6 €. Un faux négatif coûte 140 €. Si vous ne pouvez pas remplir ces trois cases, vous n'avez pas encore un problème de Data Scientist.

**Données.** Comptez les lignes et la date de chaque colonne. Sur 90 jours, vous avez **900 000 paiements**. La colonne « montant remboursé » n'existe que **14 jours plus tard** : elle peut servir d'étiquette pour le passé, jamais de variable pour scorer un paiement en cours. Une colonne disponible seulement après la décision gonfle les résultats et les détruit en production.

**Baseline.** Une prédiction sans modèle, écrite avant de comparer les algorithmes. Elle sert de plancher.

**Modèle.** Une famille d'hypothèses (une droite, un arbre, une combinaison) ajustée sur une partie des lignes. Le modèle n'a de valeur que s'il bat la baseline sur la métrique qui compte.

**Évaluation.** Mesure sur des paiements que l'ajustement n'a pas vus. Vous détaillerez les protocoles plus loin dans le parcours. Retenez déjà qu'un score calculé sur les mêmes lignes que l'apprentissage est une répétition, pas une preuve.

**Décision.** Déployer, changer le seuil, collecter une autre variable, ou arrêter. Arrêter est un résultat honorable : il évite d'industrialiser un score inutile.

# Une baseline avant tout modèle

La baseline est la réponse que vous donneriez **sans** algorithme, avec une règle que vous pouvez expliquer en une phrase. Vous la calculez sur les mêmes données que celles qui serviront à juger le modèle.

Trois baselins reviennent sans cesse.

- **Classe majoritaire**, en classification. Avec 2 % de fraudes, prédire « jamais fraude » réussit **9 800 fois sur 10 000**, soit **98 %** de bonnes réponses. Ce chiffre ne détecte **aucune** fraude. Il est vrai, et il est inutile.
- **Moyenne**, en régression. Le loyer moyen d'un parc est **1 150 €**. Prédire 1 150 € pour chaque bien donne une erreur absolue moyenne de **280 €**. Un modèle à **265 €** d'erreur n'a gagné que **15 €** : souvent pas de quoi payer sa mise en service.
- **Règle métier**. « Alerter si le montant dépasse **600 €** et si le pays n'est pas le pays habituel du client. » Sur 10 000 paiements et 200 fraudes, cette règle lève **500 alertes** et en attrape **70**. Le rappel vaut 70 / 200 = **35 %**. La précision vaut 70 / 500 = **14 %**.

Votre modèle doit améliorer **le coût**, pas seulement un pourcentage flatteur. S'il attrape 90 fraudes mais lève 2 000 alertes, la relecture peut coûter plus cher que la règle des 600 €. Vous faites alors le calcul, vous ne concluez pas au feeling.

> [!TIP]
> Écrivez la baseline dans le cahier d'expérience **avant** le premier entraînement. Une baseline choisie après coup se plie au modèle au lieu de le juger.

# Ce qu'un modèle ne doit pas faire

Un score peut être numériquement correct et tout de même interdit, ou simplement hors sujet. Voici les refus qui reviennent dans la pratique.

```diagram
type: decision
title: Le score a-t-il le droit de trancher ?
nodes:
  - question: L'information sera-t-elle connue à l'instant de la décision ?
    yes: Poursuivre l'évaluation
    no: Score invalide, information du futur
  - question: Une règle simple bat-elle déjà le modèle sur le coût ?
    yes: Gardez la règle
    no: Le modèle peut éclairer la décision
  - question: L'erreur est-elle réversible, avec un recours humain ?
    yes: Un seuil automatique est envisageable
    no: Le score aide, une personne tranche
```

**Il ne démontre pas une cause.** Les ventes de glaces et les noyades montent toutes les deux en juillet. Un modèle qui « prédit » les noyades à partir des glaces a capté la saison, pas un levier. Agir sur les glaces ne changera pas les noyades. Si la décision est un levier (changer un prix, un délai, un traitement), il vous faut un dispositif qui isole ce levier, pas seulement une corrélation.

**Il n'utilise pas le futur.** Inclure le motif du rejet bancaire, connu le lendemain, pour « prédire » la fraude du jour est une fuite. Le modèle récite une information que la caisse n'aura pas.

**Il ne remplace pas une règle déjà exacte.** La TVA à 20 % sur un hors taxe de 50 € fait 10 €. Aucun apprentissage n'a à l'estimer. Un modèle ici ajouterait de l'erreur à un calcul certain.

**Il ne décide pas seul quand l'erreur est grave et peu réversible.** Refuser un crédit de **20 000 €** parce qu'un score vaut 0,47, sans seuil documenté et sans recours, transfère la responsabilité à un nombre. Le score peut classer les dossiers. Une personne, ou une règle écrite et contestable, tranche les cas limites.

**Il ne voyage pas sans contrôle vers une autre population.** Un modèle de loyer appris sur **4 200 biens à Lyon** n'est pas un modèle pour **800 biens outre-mer**. Les prix, les surfaces et les biais de collecte diffèrent. Vous mesurez l'écart avant d'étendre le score, vous ne supposez pas qu'il voyage.

**Il ne blanchit pas un critère interdit.** Remplacer une variable sensible par un code postal très corrélé, puis présenter le score comme neutre, ne fait que cacher le critère. Vous devez savoir quelles variables entrent, pourquoi, et quel écart de traitement elles produisent.

**Il ne se juge pas à l'accuracy quand une classe est rare.** 98 % de bonnes réponses avec 0 fraude détectée est un échec métier, comme on l'a vu avec la classe majoritaire.

# De la métrique à la décision

La sortie d'un modèle est une **entrée** de la décision. Vous transformez le score en action en comparant des euros, sur une période que l'apprentissage n'a pas servie à régler le seuil.

Reprenons les coûts : **6 €** pour relire une alerte, **140 €** économisés quand l'alerte est une vraie fraude. Sur une journée de test (paiements non utilisés pour ajuster le modèle), un seuil donné produit :

| | Alertes | Fraudes trouvées | Coût des relectures | Fraude évitée | Bilan |
|---|---:|---:|---:|---:|---:|
| Seuil A | 160 | 28 | 160 × 6 = 960 € | 28 × 140 = 3 920 € | **+ 2 960 €** |
| Seuil B | 400 | 36 | 2 400 € | 5 040 € | **+ 2 640 €** |
| Règle des 600 € | 50 | 7 | 300 € | 980 € | **+ 680 €** |

Le seuil A bat la règle métier et bat aussi le seuil B, qui trouve plus de fraudes mais noie l'équipe. Le lendemain, le même seuil A ne trouve que **6 fraudes** pour 160 alertes : 6 × 140 − 960 = **−120 €**. Vous ne déployez pas un seuil sur la foi d'une seule journée, et vous ne le figez pas sur le jeu qui a servi à le choisir.

Trois issues sont propres :

1. **Déployer**, avec un seuil, un coût attendu et un contrôle la semaine suivante.
2. **Ajuster**, parce que le modèle gagne peu (15 € de loyer, dans l'exemple plus haut) et qu'une variable manque.
3. **S'arrêter**, parce que la baseline reste meilleure ou parce que la donnée nécessaire n'existe pas au moment de décider.

Dans les trois cas, vous laissez une trace : la question, la baseline chiffrée, la période d'évaluation, le coût. C'est cela, le livrable d'un Data Scientist, plus encore que le fichier de poids du modèle.

# Exercices

## Exercice 1 : Qui fait quoi ?

Une mutuelle veut réduire les renoncements aux soins. Attribuez chaque demande au métier le plus adapté.

1. « Chaque nuit, déposer dans l'entrepôt les 1,2 million de lignes de remboursements, sans doublon. »
2. « Le taux de renoncement du trimestre dernier était-il plus haut dans les villes de moins de 20 000 habitants ? »
3. « Estimer, pour chaque assuré, la probabilité qu'il ne réalise pas un soin prescrit dans les 90 jours, et comparer cette estimation à la règle « pas de rendez-vous pris sous 15 jours ». »
4. « Exposer ce score dans l'outil des conseillers, en moins de 100 ms, et alerter si la distribution des scores change. »

<details>
<summary>Voir la solution</summary>

1. **Data Engineer** : pipeline, volume, qualité.
2. **Data Analyst** : décrire ce qui s'est déjà passé.
3. **Data Scientist** : cible, horizon de 90 jours, baseline explicite, estimation.
4. **ML Engineer** : service, latence, surveillance du score en production.

Le produit qui ferait rédiger un courrier par un modèle génératif déjà entraîné relèverait plutôt de l'**AI Engineer**. Ce n'est pas la question posée ici.

</details>

## Exercice 2 : La baseline qui fait illusion

Un jeu de **20 000** dossiers de crédit contient **3 %** de défauts, soit **600** défauts. Un collègue annonce : « mon modèle a **97 %** de bonnes réponses, on le met en production. »

1. Quelle accuracy obtient la baseline « personne ne fera défaut » ?
2. Pourquoi 97 % ne prouve pas que le modèle est utile ?
3. Proposez une baseline métier plus sérieuse qu'une phrase « toujours non ».

<details>
<summary>Voir la solution</summary>

1. Prédire « pas de défaut » pour les 20 000 dossiers réussit sur 97 % des lignes (19 400 / 20 000), puisqu'il y a 3 % de défauts. Le modèle annoncé **égale** cette baseline, il ne la bat pas.
2. Ces 97 % peuvent cacher **zéro** défaut détecté. La décision (accorder, demander une pièce, refuser) dépend des défauts manqués et des bons clients écartés, pas du taux de bonnes réponses brut.
3. Par exemple : « demander une pièce supplémentaire si le taux d'endettement dépasse **35 %** ». Vous comptez ensuite combien de défauts cette règle attrape, et à combien de clients sains elle demande une pièce. Le modèle devra faire mieux sur ce coût.

</details>

## Exercice 3 : Ce que le modèle ne doit pas trancher

Pour chaque situation, dites si le modèle peut servir tel quel, et pourquoi.

1. Prédire le défaut de paiement d'un prêt en utilisant le motif de rejet saisi **après** la décision d'octroi.
2. Estimer le prix d'un appartement lyonnais avec un modèle ajusté sur 4 200 ventes lyonnaises, puis l'appliquer sans mesure à 800 biens outre-mer.
3. Calculer une TVA à 20 %.
4. Classer des dossiers de bourse pour qu'une commission les lise du plus prioritaire au moins prioritaire, avec un recours.

<details>
<summary>Voir la solution</summary>

1. **Non.** Le motif de rejet est une information du futur par rapport à la décision. Le score fuite et s'effondrera quand cette colonne sera vide.
2. **Non, pas tel quel.** La population change. Il faut mesurer l'erreur sur des ventes outre-mer avant d'utiliser le score, ou ne pas l'utiliser.
3. **Non.** La règle est exacte. Un modèle n'ajouterait que de l'erreur.
4. **Oui, comme aide au classement.** L'erreur reste réversible : une commission tranche et un recours existe. Le score ne doit pas être le refus automatique.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Le métier de Data Scientist
center: Un score n'a de sens que s'il éclaire une décision chiffrée, après une baseline.
points:
  - icon: users
    title: Cinq questions distinctes
    text: L'analyste décrit, l'engineer livre, le scientist estime, le ML engineer industrialise.
  - icon: loop
    title: Six temps, dans l'ordre
    text: Problème, données, baseline, modèle, évaluation, puis seulement la décision.
  - icon: gauge
    title: La baseline d'abord
    text: "Classe majoritaire, moyenne ou règle métier : en dessous, le modèle n'apporte rien."
  - icon: alert
    title: Ce qu'il ne fait pas
    text: Pas de cause inventée, pas de donnée du futur, pas de décision grave sans recours.
  - icon: scale
    title: Le coût tranche
    text: Un seuil se juge en euros d'erreurs, sur une période que l'apprentissage n'a pas vue.
pitfall: "Afficher 98 % de bonnes réponses quand la classe rare pèse 2 % et que le modèle n'en détecte aucune."
remember: Sans décision, coût des deux erreurs et baseline chiffrée, le modèle n'est pas prêt à servir.
```
