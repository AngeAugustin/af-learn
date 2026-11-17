---
title: Surveiller la dérive
description: Distinguer dérive des features, de la cible et du score, tenir un jeu de référence, et séparer un bug de données d'un vrai changement du monde.
duration: 45
objectives:
  - Définir la dérive de features, la dérive de cible et la dérive de score
  - Comparer la production à un jeu de référence figé plutôt qu'à la veille
  - Distinguer un incident de données d'un changement réel du phénomène
  - Choisir ce qui mérite une alerte immédiate et ce qui se suit sur un tableau de bord
---

# Le modèle ne se met pas à jour tout seul

Un pipeline servi applique des poids **figés**. Le monde, lui, bouge : une offre change de prix, un formulaire perd un champ, la saisonnalité revient, un concurrent apparaît. Le score continue de sortir, avec la même version, la même latence, et une erreur qui augmente. Rien ne « casse » au sens informatique. C'est pour cela qu'il faut une surveillance **à part** de la santé du serveur.

On compare ce qui arrive en production à une **référence** connue, sur trois objets différents. Les confondre mène soit à réentraîner sur un bug, soit à ignorer un changement réel parce que le serveur répond 200.

```diagram
type: compare
title: "Trois dérives, trois horloges"
columns:
  - title: "Features"
    tone: blue
    items:
      - "Les colonnes d'entrée changent de loi"
      - "Visible sans attendre les labels"
      - "Prix, catégories, taux de manquants, unités"
  - title: "Cible"
    tone: amber
    items:
      - "Le taux de l'événement bouge"
      - "Visible seulement quand le label arrive"
      - "Souvent en retard de tout le horizon"
  - title: "Score"
    tone: violet
    items:
      - "La distribution des scores bouge"
      - "Visible tout de suite"
      - "Ne dit pas à elle seule si le modèle a tort"
```

Aucune des trois n'est « la » dérive. Un tableau de bord qui ne montre que la moyenne du score laisse passer un champ devenu vide. Un tableau qui ne montre que les features laisse passer un changement de comportement à features stables : c'est la dérive de **concept**, le lien entre X et y a changé.

# Dérive des features

La **dérive des features** (ou dérive de covariables) compare la loi des entrées en production à la loi de référence. On ne cherche pas une égalité parfaite, jour après jour. On cherche un écart assez grand, assez durable, pour qu'une investigation vaille le coup.

Signaux simples, souvent suffisants avant d'ajouter un indice spécialisé :

- taux de **manquants** par colonne, et taux de valeurs hors des modalités connues ;
- médiane et quantiles d'une colonne numérique (la facture médiane passe de 40 à 65 euros) ;
- part de chaque modalité (`pack` était à 10 %, il est à 45 %) ;
- volume de requêtes : une chute à zéro est d'abord une panne d'alimentation, pas une dérive subtile.

Des indices comme le PSI (écart entre deux histogrammes) ou un test de Kolmogorov-Smirnov résument un décalage en un nombre. Ils aident à trier les colonnes. Ils ne remplacent pas le fait de **regarder** la colonne incriminée, en unités métier, sur vingt lignes brutes. Un PSI « rouge » sur une colonne que le modèle n'utilise pas n'a pas le même poids qu'un PSI rouge sur le retard de paiement.

Ce que la dérive de features ne dit pas : si les clients se résilient autrement **à facture égale**, les histogrammes d'entrée peuvent rester sages. Il faudra les labels.

```video
url: https://www.youtube.com/watch?v=HGIgUH11nVo
title: "Machine Learning Monitoring: What Is Data Drift?"
channel: "Evidently AI"
duration: "3:06"
lang: en
why: "Ce qu'est la dérive des données, en trois minutes, par l'équipe d'Evidently AI, un outil de monitoring open source."
```

# Dérive de la cible et dérive du score

La **dérive de cible** compare le taux observé de l'événement au taux de référence. Pour une résiliation à 30 jours, ce taux n'existe que lorsque les 30 jours sont écoulés. Surveiller « le churn d'aujourd'hui » le jour même est impossible : on surveille le churn **des dossiers assez anciens pour être étiquetés**. Le retard est structurel. Le mettre à zéro en utilisant un proxy (le score moyen) mélange deux notions.

La **dérive de score** compare la distribution des scores produits aujourd'hui à la référence : moyenne, quantiles, part au-dessus du seuil d'action. Elle est immédiate, puisque le score l'est. Elle n'est pas une métrique de qualité.

| Observation | Lecture prudente |
|---|---|
| Le score moyen monte, les features aussi (les factures ont augmenté) | Le modèle réagit peut-être comme prévu. On vérifie quand les labels arriveront. |
| Le score moyen monte, les features sont stables | Bug de préparation, ou changement de concept encore invisible sur les marges. |
| Les features dérivent, le score ne bouge pas | Le modèle ignore peut-être la colonne, ou une préparation écrase l'écart (tout devient « autre »). |
| Les labels arrivent, le rappel chute, les features semblaient stables | Dérive de concept. Les entrées n'ont pas bougé, le lien avec y si. |

La qualité réelle (précision parmi les 500 appels, AUC sur la semaine étiquetée) se calcule **sur les labels**, avec la même définition que l'entraînement. Un tableau de bord de scores sans ce calcul périodique rassure sans mesurer.

> [!NOTE]
> Un modèle calibré pour que 0,3 veuille dire « 30 % de chances » peut garder un bon classement et perdre sa calibration, ou l'inverse. Si le produit utilise le score comme une probabilité (provision, tarif), suivez la calibration sur la fenêtre étiquetée. Si le produit ne fait que trier, le classement suffit, et il faut le dire.

# Un jeu de référence figé

La référence est un jeu dont on **accepte** la loi comme point de comparaison : le jeu de validation de la version champion, ou une fenêtre de production réputée saine juste après la promotion. On fige le choix par écrit, avec les dates et la version du modèle.

Deux erreurs symétriques :

- Comparer chaque jour à **la veille**. Une dérive lente (un euro de plus par semaine) ne déclenche jamais, parce que l'écart d'un jour à l'autre reste petit. Au bout de six mois, la production n'a plus rien à voir avec l'entraînement.
- Comparer à une référence **glissante** recalculée chaque semaine sur le passé récent. On normalise le changement. Le graphique est plat. Le modèle, non.

On **rafraîchit** la référence quand on promeut une nouvelle version, ou après un changement du monde assumé et documenté (nouvelle grille tarifaire, et tout le monde est d'accord pour que ce soit le nouveau normal). On ne la rafraîchit pas pour faire taire une alerte.

```diagram
type: flow
title: "À quoi on compare la production"
steps:
  - title: "Référence figée"
    text: "Validation du champion, ou fenêtre saine datée."
    tone: blue
  - title: "Fenêtre récente"
    text: "Le jour ou la semaine de production, même définition des champs."
    tone: violet
  - title: "Écart"
    text: "Manquants, quantiles, modalités, scores, puis labels quand ils existent."
    tone: amber
  - title: "Décision"
    text: "Rien, enquête, ou gel du modèle. Pas un réentraînement réflexe."
    tone: teal
```

La fenêtre récente doit avoir assez de volume. Un écart sur 30 dossiers est du bruit. On fixe un effectif minimal avant d'interpréter un indice, surtout sur une modalité rare.

# Bug de données ou changement du monde

Les deux produisent des courbes qui bougent. Le geste qui les distingue est de croiser **l'horaire** et un **échantillon brut**, pas d'augmenter le seuil de l'alerte jusqu'à ce qu'elle se taise.

**Plutôt un bug de données** quand le cassage est soudain, aligné sur une mise en service, un changement de schéma ou un job d'alimentation :

- à 18 h 05, juste après un déploiement, `offre` est manquant sur 40 % des lignes ;
- les factures sont cent fois trop grandes (centimes écrits dans un champ en euros) ;
- une colonne a glissé : les appels support contiennent des codes postaux ;
- le volume tombe à zéro le temps d'un connecteur en échec, puis revient avec trois jours en double.

**Plutôt un changement du monde** quand le mouvement est cohérent avec un fait métier, et que plusieurs signaux liés bougent ensemble sans rupture de schéma :

- lundi, lancement d'une offre à bas prix : la part de `pack` monte, la facture médiane baisse, sur plusieurs jours ;
- un concurrent publie une promotion : le taux de résiliation étiqueté monte **après** le délai de 30 jours, pas à la minute du déploiement ;
- la saison revient : le même mois l'an dernier montrait le même profil.

Les deux peuvent s'empiler. Une vraie promotion mal branchée dans le formulaire produit à la fois un changement du monde et un bug. L'échantillon de vingt lignes, lu avec quelqu'un du métier, départage mieux qu'un indice unique. On regarde les valeurs, les identifiants, les dates, et le schéma attendu par le contrat d'API.

> [!WARNING]
> Réentraîner sur la fenêtre cassée grave le bug dans les poids. Le nouveau modèle « colle » aux factures en centimes ou aux champs vides. On répare l'alimentation, on rejoue la fenêtre saine, et seulement ensuite on parle de réentraînement.

Un gel du modèle (revenir à la version précédente, ou stopper l'action automatique) est légitime le temps de l'enquête si les scores alimentent une action coûteuse. Un simple appel commercial peut attendre le lendemain. Un refus de crédit automatique, non.

# Quoi alerter, et à qui

Tout écart n'est pas une page à 3 h du matin. On sépare ce qui demande une action **le jour même** de ce qui se lit le matin sur un tableau de bord.

| Niveau | Exemples | Réaction |
|---|---|---|
| Blocage | Schéma refusé en masse, volume nul, taux d'erreur de l'API, manquants au-delà d'un plafond sur une feature obligatoire | Quelqu'un intervient. On peut suspendre l'usage du score. |
| Enquête | Indice de dérive durable sur une feature importante, moyenne des scores hors de la bande prévue | Analyse aux heures ouvrées. Pas de réentraînement tant que le bug n'est pas écarté. |
| Suivi étiqueté | Précision ou rappel de la cohorte dont le label vient d'arriver, sous la barre écrite à l'entraînement | Décision de réentraînement ou de retour à une règle, selon le chapitre suivant. |
| Journal | Petites oscillations, colonnes non utilisées, écarts sous l'effectif minimal | Pas d'alerte. Conservé pour enquête. |

La barre se cale sur l'historique, pas sur un seuil copié d'un article. Si le PSI de la facture dépasse souvent 0,1 sans incident, mettre l'alerte à 0,1 fabrique de la fatigue. On regarde ce que la référence a connu comme variation normale (saisonnalité déjà vue), et l'on alerte au-delà.

Le message d'alerte dit **quelle** colonne, **quel** écart, **depuis quand**, et **quelle** version de modèle. « Drift detected » sans colonne n'est pas exploitable. Le destinataire est nommé : l'équipe qui peut corriger l'alimentation pour un bug de schéma, l'équipe modèle pour une chute de métrique étiquetée. Une alerte sans propriétaire est un courriel que tout le monde archive.

# Exercices

## Exercice 1 : Nommer la dérive

Classez chaque situation : dérive de features, de cible, de score, ou dérive de concept. Une situation peut en combiner deux, dites-le.

1. La part d'offres `pack` passe de 12 % à 40 % en dix jours. Les scores baissent, ce qui est cohérent avec des factures plus basses. Les labels à 30 jours ne sont pas encore là.
2. Les histogrammes de toutes les features collent à la référence, mais, une fois les labels arrivés, le taux de résiliation a doublé et le rappel parmi les 500 appels a chuté.
3. Depuis un déploiement à 18 h, la moyenne des scores passe de 0,2 à 0,9. Les features brutes en base n'ont pas changé. Le champ `offre` arrive vide et devient la modalité d'imputation.

<details>
<summary>Voir la solution</summary>

1. **Dérive de features** (mix d'offres, factures) et **dérive de score** cohérente avec elle. Pas encore de dérive de cible observable : les labels ne sont pas arrivés. On ne conclut pas que le modèle a tort. On note l'événement métier et on attend la cohorte étiquetée.
2. **Dérive de cible**, et **dérive de concept** : les entrées n'ont pas bougé, le lien avec la résiliation si. Le score, s'il n'a pas bougé, a précisément manqué le changement. C'est le cas où la surveillance des seules features rassure à tort.
3. **Bug de données** qui se voit comme une dérive de features (offre vide) et une dérive de score. Ce n'est pas un changement du monde. On ne réentraîne pas là-dessus. On répare le champ, on vérifie que les scores reviennent dans la bande.

</details>

## Exercice 2 : Référence glissante

Pour « être adaptatif », un tableau compare chaque semaine à la semaine précédente. Depuis cinq mois, la facture médiane monte de 2 % par semaine. Aucune alerte ne part. Le modèle a été entraîné il y a cinq mois.

Pourquoi le graphique est-il calme, et quelle référence faudrait-il ?

<details>
<summary>Voir la solution</summary>

L'écart d'une semaine à l'autre reste sous le seuil, donc l'alerte se tait, alors que l'écart **au jeu d'entraînement** est devenu large. La référence glissante a absorbé la dérive.

Il faut une référence **figée** : la validation de la version en production, ou la fenêtre saine juste après la promotion, datée et versionnée. On y compare la semaine courante, à effectif suffisant. On ne change cette référence qu'en promouvant un nouveau modèle ou en actant, par écrit, un nouveau normal. La comparaison à la veille peut rester un **complément** pour voir une rupture soudaine (le bug de 18 h), pas le seul instrument.

</details>

## Exercice 3 : Que page-t-on ?

Vous avez quatre signaux en même temps, un jeudi à 22 h. Le modèle sert un centre d'appels qui travaille le vendredi matin. Aucun refus de crédit n'est automatique.

1. Volume de requêtes divisé par deux pendant 10 minutes, puis revenu.
2. `appels_sav_90j` manquant sur 70 % des lignes depuis 21 h, après une mise en production du CRM.
3. PSI de la facture légèrement au-dessus du seuil, dans une zone déjà vue en fin de mois.
4. La cohorte étiquetée de la semaine d'il y a 30 jours a perdu 8 points de précision, calcul disponible depuis ce matin, personne ne l'a lu.

Que faites-vous ce soir, et que laissez-vous au vendredi matin ?

<details>
<summary>Voir la solution</summary>

Ce soir : le signal **2** est un blocage. Les scores depuis 21 h sont nourris d'une feature majeure imputée n'importe comment. On traite cela comme un incident de données, on prévient le propriétaire du CRM, et l'on **suspend l'usage** des scores produits depuis 21 h pour constituer la liste d'appels de vendredi. On ne réentraîne pas.

Le signal 1 est retombé : on le note, on ne réveille personne s'il n'a pas reperdu. Le signal 3 ressemble à la variation de fin de mois déjà dans la référence : pas une page nocturne. Le signal 4 est important mais il attend depuis le matin et les labels ont 30 jours : il se traite **vendredi**, à tête reposée, comme une décision de réentraînement ou de retour à la règle, pas comme une panne à 22 h.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Surveiller la dérive"
center: "On compare la production à une référence figée. Features, cible et score ne bougent pas au même rythme, ni pour les mêmes raisons."
points:
  - icon: chart
    title: "Trois objets"
    text: "Features tout de suite, scores tout de suite, cible quand le label arrive. Le concept peut changer à features stables."
  - icon: database
    title: "Référence figée"
    text: "La validation du champion, pas la veille. Une référence glissante avale la dérive lente."
  - icon: search
    title: "Vingt lignes brutes"
    text: "Un indice rouge ne dit pas la cause. L'horaire et un échantillon séparent le bug du monde."
  - icon: alert
    title: "Alerter peu"
    text: "Schéma cassé et volume nul réveillent. Une oscillation connue attend le tableau de bord."
  - icon: loop
    title: "Pas de fit réflexe"
    text: "On ne réentraîne pas une fenêtre cassée. On répare les données, puis on remesure."
pitfall: "Prendre une hausse de score pour une preuve que le modèle se trompe, ou pour une preuve qu'il a raison."
remember: "Sans labels, on voit les entrées et les scores. La qualité réelle n'arrive qu'avec la cible, en retard du horizon."
```
