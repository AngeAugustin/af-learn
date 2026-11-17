---
title: Réentraîner et promouvoir
description: Décider quand réentraîner, valider un candidat contre le champion avant promotion, poser des tests de pipeline et tenir un registre de modèles simple.
duration: 45
objectives:
  - Distinguer les motifs légitimes de réentraînement des faux motifs
  - Comparer un candidat au champion sur un holdout que l'entraînement n'a pas vu
  - Écrire des tests qui vérifient le chargement et l'effondrement de métrique
  - Tenir un registre suffisant pour promouvoir et revenir en arrière
---

# Quand réentraîner, et quand s'abstenir

Réentraîner produit un **nouvel artefact**. Ce n'est pas un rafraîchissement cosmétique. Chaque artefact a une version, un jeu de données, une métrique, et le droit ou non de remplacer le champion. Le rythme se décide, il ne se subit pas.

Motifs légitimes :

- **Calendrier**, quand le phénomène bouge assez vite pour qu'une fenêtre fixe vieillisse (un score de résiliation revu chaque mois), **et** que la validation du nouveau passage tient encore.
- **Dérive confirmée** après enquête : ce n'est pas un bug d'alimentation, les labels récents sont sous la barre écrite, la référence figée dit la même chose.
- **Nouvelle feature** disponible, licite, connue à la date de décision, et qui vaut le coût d'une comparaison.
- **Correction** d'une cible ou d'un pipeline qui rend l'artefact actuel invalide (une fuite découverte, une unité fausse). Dans ce cas on réentraîne parce que l'ancien score n'est plus défendable, pas parce que la métrique a baissé.

Motifs qui ne suffisent pas :

- une mauvaise journée, un pic d'une heure, une alerte revenue seule ;
- un bug de données encore en place : réentraîner dessus enseigne le bug au nouveau modèle ;
- la demande d'« avoir le modèle à jour » sans métrique ni fenêtre ;
- l'envie d'essayer une architecture, qui est une expérience, pas une promotion.

```diagram
type: decision
title: "Faut-il lancer un réentraînement ?"
nodes:
  - question: "L'alimentation des features et des labels est-elle saine sur la fenêtre visée ?"
    yes: "On peut utiliser cette fenêtre. Question suivante."
    no: "On répare les données d'abord. Pas d'entraînement sur la fenêtre cassée."
  - question: "Un motif clair est-il là (calendrier prévu, dérive confirmée, nouvelle feature, correction) ?"
    yes: "On entraîne un candidat, sans le promouvoir."
    no: "On ne réentraîne pas. On note pourquoi l'alerte ne suffisait pas."
  - question: "Le candidat bat-il le champion de la marge prévue, sur un holdout commun ?"
    yes: "Il peut être proposé à la promotion."
    no: "Il reste candidat rejeté. Le champion ne bouge pas."
```

Le calendrier seul ne force pas la promotion. Il force une **comparaison**. Si le candidat du mois est moins bon, on garde le champion et on écrit le résultat négatif. « On a réentraîné » n'est pas un succès. « On a promu parce que la marge est tenue » en est un.

# Valider avant de promouvoir

Le candidat s'entraîne sur une fenêtre qui **s'arrête** avant le holdout. Le holdout est une période postérieure, la même pour le candidat et pour le champion. On ne réutilise pas la validation qui a servi à choisir les hyperparamètres du candidat comme si elle était neuve : cette validation a déjà été regardée.

Protocole minimal :

1. Fixer la métrique de décision et la **marge** avant de lancer l'entraînement (par exemple +3 points de précision sur les 500 premiers, ou pas de baisse de rappel sur un segment nommé).
2. Scorer le champion et le candidat sur le **même** holdout, avec le même contrat de features.
3. Lire le global **et** les segments qui comptent (nouveaux clients, une offre, une région d'action). Un gain global qui s'effondre sur le segment appelé n'est pas un gain.
4. Promouvoir seulement si la marge est tenue. Sinon, le champion reste servi.

```diagram
type: flow
title: "Du candidat au champion"
steps:
  - title: "Entraîner"
    text: "Fenêtre close, code versionné, artefact nommé."
    tone: blue
  - title: "Holdout"
    text: "Période jamais vue, identique pour les deux modèles."
    tone: violet
  - title: "Comparer"
    text: "Métrique de décision, marge écrite, segments."
    tone: amber
  - title: "Promouvoir ou garder"
    text: "Le pointeur de production bouge, ou ne bouge pas."
    tone: teal
```

La promotion n'est pas le copier-coller du fichier sur le serveur pendant que l'API tourne encore sur l'ancien chemin. C'est un **pointeur** explicite : la configuration nomme `churn-1.4.0` au lieu de `churn-1.3.0`. L'ancien fichier reste. Revenir en arrière est alors un changement de pointeur, pas une restauration depuis la mémoire de quelqu'un.

Quand le coût d'une erreur est élevé, on peut laisser le candidat scorer **en ombre** : il calcule, on journalise, l'application n'agit pas sur son score. On compare ensuite aux labels. L'ombre retarde la promotion. Elle évite de découvrir le lundi que le holdout était trop court. Pour un centre d'appels, une promotion directe après holdout temporel propre est souvent acceptable. Pour un refus automatique, l'ombre ou un déploiement progressif se justifie.

# Des tests qui protègent le pipeline

La comparaison au champion est une décision statistique. Les **tests** sont des garde-fous plus bêtes, et c'est leur qualité : ils échouent fort quand le pipeline est cassé, avant même la discussion sur la marge.

À chaque candidat, une chaîne automatique peut enchaîner au minimum :

| Test | Ce qu'il attrape | Ce qu'il n'attrape pas |
|---|---|---|
| Le pipeline se charge et transforme une fixture de cinq lignes | Fichier corrompu, version de librairie incompatible, colonne manquante | Un modèle médiocre mais valide |
| Le schéma de sortie est un score par ligne, dans [0, 1] si c'est le contrat | Une proba oubliée, un `predict` à la place de `predict_proba` | Un seuil métier absurde |
| Sur un jeu **gelé**, la métrique reste au-dessus d'un plancher | Cible inversée, colonne perdue, fuite « réparée » dans le mauvais sens | Le réglage fin |
| Deux lignes de référence donnent un score à 1e-6 près du snapshot | Un préprocesseur qui a changé en silence | La dérive future du monde |
| L'empreinte du fichier est celle inscrite au registre | Un artefact écrasé ou mal copié | Le choix du champion |

Le plancher de métrique est un **détecteur d'effondrement**, pas l'objectif. Si le champion est à 0,80 d'AUC sur ce jeu gelé, un plancher à 0,65 ne sert pas à choisir entre 0,79 et 0,81. Il sert à rater la construction le jour où l'AUC tombe à 0,50 parce que la cible a été lue à l'envers. Choisir le plancher trop près du score habituel fait échouer la chaîne sur du bruit. Le choisir trop bas ne détecte qu'un modèle devenu constant. Un plancher qui se situe nettement sous le niveau habituel, et nettement au-dessus du hasard, détecte « on a perdu le signal » sans prétendre à la promotion.

Ces tests vivent à côté du code, sur une fixture versionnée, pas dans un notebook relancé à la main. Ils ne remplacent pas le holdout temporel. Un pipeline qui charge et qui dépasse le plancher peut encore perdre contre le champion.

> [!TIP]
> Le test de chargement doit utiliser le **même** chemin que l'API (`joblib.load` du pipeline entier, puis un tableau nommé comme le contrat). Un test qui reconstruit le modèle depuis le notebook vert n'est pas un test du service.

# Un registre de modèles simple

Un registre peut être une table ou un dossier de fichiers, tant que les champs suivants existent et ne se contredisent pas. Pas besoin d'une plateforme dédiée pour commencer. Besoin, en revanche, de ne pas les stocker seulement dans le titre d'un message.

| Champ | Exemple | Rôle |
|---|---|---|
| Version | `churn-1.4.0` | Identifiant immuable, celui que l'API renvoie. |
| Statut | candidat, champion, rejeté, retiré | Un seul champion servi à la fois pour un usage donné. |
| Empreinte et chemin | hash, `artifacts/churn-1.4.0.joblib` | Retrouver le fichier exact. |
| Commit | `a1b2c3d` | Code d'entraînement et de préparation. |
| Instantané de données | `snap-2026-04` | Fenêtre et définition de la cible. |
| Métrique de holdout | précision@500 = 0,46 | Le chiffre de la comparaison, avec sa période. |
| Décision | promu le 4 avril, ou rejeté, motif en une phrase | Pourquoi le pointeur a bougé. |

```diagram
type: layers
title: "Ce que le registre relie"
layers:
  - title: "Décision"
    text: "Statut et motif. Promu, rejeté, ou retiré après incident."
  - title: "Mesure"
    text: "Métrique de holdout, segments, marge qui était exigée."
  - title: "Origine"
    text: "Commit, instantané de données, contrat de features, graine si le modèle est aléatoire."
  - title: "Artefact"
    text: "Fichier, empreinte, version que l'API cite dans chaque réponse."
```

Le rejet se enregistre aussi. Sinon, dans trois mois, quelqu'un relance le même entraînement en croyant que l'essai n'a jamais eu lieu. Le champion précédent reste au registre avec son fichier, le temps qu'un retour arrière soit encore plausible (une fenêtre définie : par exemple tant que le contrat de features n'a pas changé de façon incompatible).

L'API lit le statut champion, ou une configuration qui pointe vers cette version. Elle ne « prend le fichier le plus récent du dossier ». Le plus récent peut être un candidat rejeté.

# Archiver de quoi refaire le chiffre

Promouvoir sans pouvoir **refaire** la métrique, c'est un chiffre sans pièce. À côté de l'artefact, on garde de quoi une autre personne, six mois plus tard, comprenne le score annoncé :

- la période d'entraînement et la période de holdout ;
- la liste des features et le contrat (unités, modalités) ;
- la définition de la cible et du horizon, en une phrase ;
- la métrique, le plancher de test, la marge de promotion ;
- les versions de librairies, parce qu'un `joblib` en dépend ;
- la commande ou le pipeline qui a produit l'artefact, identifiés par le commit.

On ne demande pas que chaque graine aléatoire d'un boosting soit un roman. On demande que relancer la même commande sur le même instantané redonne la métrique à une tolérance écrite, si un aléa reste. Si le modèle est déterministe une fois la graine fixée, la graine est dans la configuration, pas dans la mémoire de l'auteur.

Le rapport scientifique, plus loin dans le parcours, reprend ces pièces pour un lecteur humain. Le registre est la version opérationnelle : plus sèche, assez complète pour un retour arrière.

# Promouvoir est un acte, pas un cron

Une chaîne d'intégration peut, chaque nuit ou à chaque étiquette de commit, installer les dépendances, lancer les tests de pipeline, entraîner un candidat et déposer un rapport de holdout. C'est utile, et ce n'est pas encore la production.

Le **pointeur** de production bouge selon une règle explicite :

- automatique seulement si la marge, les tests et les segments sont verts **et** que le coût d'une erreur de promotion est accepté par écrit ;
- sinon, une personne nommée promeut, en s'appuyant sur le rapport déjà calculé, pas sur un notebook ouvert dans l'urgence.

Dans les deux cas, la promotion est un événement daté dans le registre. Un cron silencieux qui écrase le champion n'est pas une règle : c'est l'absence de règle, avec un horaire.

> [!IMPORTANT]
> Séparer « la chaîne a produit un candidat » et « la production sert ce candidat ». Le premier événement peut être fréquent. Le second doit rester lisible dans le registre, une ligne après l'autre.

Après promotion, la référence de surveillance de la dérive se met à jour **volontairement** pour coller au nouveau champion. Oublier ce geste compare des scores neufs à l'ancienne référence et déclenche des alertes qui ne disent plus rien, ou, pire, empêche de voir une dérive parce que personne ne sait quelle référence est la bonne.

# Exercices

## Exercice 1 : Motif insuffisant

Mardi, la précision de la liste d'appels « a l'air plus faible » selon deux téléopérateurs. Aucun label de la semaine n'est encore complet (horizon 30 jours). Le job de features a eu un incident d'une heure dans la matinée, déjà corrigé. Un responsable demande un réentraînement dans la journée « pour repartir propre ».

Que répondez-vous, et que proposez-vous à la place ?

<details>
<summary>Voir la solution</summary>

On **ne réentraîne pas** aujourd'hui. Les labels de la semaine ne sont pas là, donc on ne sait pas si la métrique a baissé. Le ressenti de deux appels n'est pas une mesure. L'incident d'alimentation est corrigé : les scores de cette heure-là sont suspects, on les écarte de la liste, on ne les apprend pas.

À la place : vérifier que les features sont revenues au contrat, comparer les scores au jeu de référence (dérive de score et de features), et attendre la cohorte étiquetée. Si, à ce moment-là, la précision passe sous la barre, on lancera un **candidat** et on le comparera au champion sur un holdout. « Repartir propre » sans holdout remplacerait un champion validé par un artefact non comparé.

</details>

## Exercice 2 : Lire une comparaison

La marge écrite est +3 points de précision@500, sans baisse de plus de 1 point sur le segment « clients de moins de 3 mois ». Holdout : deux mois postérieurs à l'entraînement.

| Modèle | Précision@500 | Segment nouveaux |
|---|---|---|
| Champion 1.3.0 | 0,36 | 0,30 |
| Candidat 1.4.0 | 0,40 | 0,24 |

Promouvez-vous ? Que manque-t-il si l'équipe ne montre que la première colonne ?

<details>
<summary>Voir la solution</summary>

On **ne promeut pas**. Le global gagne 4 points, au-dessus de la marge, mais le segment des nouveaux clients perd 6 points, au-delà du 1 point toléré. Si ce segment est dans le critère, le candidat est rejeté. On le note au registre avec le motif, et le champion 1.3.0 reste en place.

La première colonne seule aurait fait promouvoir un modèle qui se dégrade là où la marge l'interdisait. Le segment fait partie de la décision, pas d'une annexe facultative. On vérifie aussi que le holdout n'a pas servi à choisir les hyperparamètres du candidat.

</details>

## Exercice 3 : Deux tests et un retour arrière

Le registre contient 1.2.0 (retiré), 1.3.0 (champion), 1.4.0 (candidat dont le fichier vient d'être produit). Proposez deux tests automatiques minimaux avant même la comparaison de marge. Puis dites comment revenir à 1.3.0 si 1.4.0 a été promu à tort le matin.

<details>
<summary>Voir la solution</summary>

Tests minimaux :

1. **Chargement** : `joblib.load` du pipeline 1.4.0, transformation d'une fixture de quelques lignes au contrat (noms, types), sortie un score par ligne dans l'intervalle prévu. Échec si une colonne du contrat manque ou si la version de librairie ne relit pas le fichier.
2. **Plancher** : sur le jeu gelé, la métrique reste au-dessus du seuil d'effondrement (signal encore présent, cible pas inversée). Ce test ne décide pas la promotion.

Retour arrière : le fichier 1.3.0 et sa ligne de registre existent encore. On **repointe** la configuration de l'API vers `churn-1.3.0`, on recharge le processus, on vérifie qu'une requête de test cite bien `churn-1.3.0` dans la réponse. On marque 1.4.0 comme retiré, avec le motif, sans effacer l'artefact tout de suite. Si le fichier 1.3.0 avait été écrasé sous le même nom, le retour arrière serait impossible : c'est justement ce que le registre et les noms versionnés évitent.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Réentraîner et promouvoir"
center: "On réentraîne sur des données saines, on compare au champion, et on ne promeut que si la marge tient."
points:
  - icon: clock
    title: "Un motif, pas un réflexe"
    text: "Calendrier, dérive confirmée, feature nouvelle ou correction. Jamais une fenêtre encore cassée."
  - icon: scale
    title: "Holdout commun"
    text: "Même période future, même métrique, segments inclus. La marge est écrite avant l'entraînement."
  - icon: test
    title: "Tests de garde"
    text: "Le pipeline charge, le schéma répond, la métrique gelée ne s'effondre pas."
  - icon: file
    title: "Registre"
    text: "Version, statut, empreinte, commit, données, métrique, motif. Un seul champion servi."
  - icon: loop
    title: "Pointeur, pas un écrasement"
    text: "Promouvoir change la version citée par l'API. L'ancien artefact reste pour le retour arrière."
pitfall: "Laisser un cron écraser le champion chaque nuit parce que le candidat s'est entraîné sans erreur."
remember: "Un candidat qui charge n'est pas un champion. La promotion est une comparaison, puis un acte tracé."
```
