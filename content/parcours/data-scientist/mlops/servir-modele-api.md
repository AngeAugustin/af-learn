---
title: Servir un modèle derrière une API
description: Sérialiser un pipeline scikit-learn, exposer un endpoint de features, tenir un contrat d'entrée, versionner le modèle et garder l'entraînement hors de la requête.
duration: 45
objectives:
  - Sérialiser le pipeline complet plutôt que le seul estimateur final
  - Définir le contrat d'entrée et la réponse d'un endpoint de score
  - Associer une version de modèle à chaque réponse et viser une latence mesurée
  - Expliquer pourquoi l'entraînement n'a pas sa place dans la requête
---

# Sérialiser le pipeline, pas seulement le modèle

En entraînement, un dossier passe par une imputation, un encodage, parfois une mise à l'échelle, puis par le classifieur. Si l'API ne recharge que le classifieur, elle attend des nombres déjà transformés. Le jour où l'ordre des colonnes change, ou qu'une catégorie nouvelle apparaît, le score est faux sans message d'erreur clair.

On sérialise le **pipeline entier** : préparation et modèle, fit sur le train, puis figé.

```python
pipeline = Pipeline([
    ("prep", preprocesseur),
    ("modele", HistGradientBoostingClassifier(random_state=0)),
])
pipeline.fit(X_train, y_train)
joblib.dump(pipeline, "artifacts/churn-1.3.0.joblib")
```

Au démarrage du service, une seule fois :

```python
pipeline = joblib.load("artifacts/churn-1.3.0.joblib")
scores = pipeline.predict_proba(frame)[:, 1]
```

`predict_proba` applique alors la **même** préparation que l'entraînement. Le fichier porte la version dans son nom. On n'écrase pas `model.joblib` en place : l'ancienne version doit rester rechargeable.

> [!WARNING]
> `joblib` et `pickle` reconstruisent des objets Python. Ne chargez qu'un fichier **produit par votre entraînement**, dans un environnement dont les versions de scikit-learn et des librairies du pipeline sont celles de l'entraînement. Un fichier reçu d'ailleurs peut exécuter du code.

Le service et l'entraînement déclarent ces versions (fichier de dépendances figé). Un pipeline sauvé en scikit-learn 1.4 et rechargé en 1.2 peut échouer, ou pire, scorer autrement sans échouer.

# Un endpoint qui reçoit des features

L'endpoint de score reçoit les **features d'une décision**, pas un extrait du jeu d'entraînement, pas la cible, pas un CSV « à aller chercher ». Une requête, un score. Pour plusieurs dossiers du même instant, un petit lot est acceptable si la latence reste dans le contrat. Un million de lignes n'est pas une requête HTTP : c'est un traitement différé.

```diagram
type: sequence
title: "Une requête de score"
actors: ["Appelant", "API", "Pipeline"]
messages:
  - from: 0
    to: 1
    text: "POST /scores avec les features et un identifiant de dossier"
  - from: 1
    to: 1
    text: "Vérifie le contrat, refuse les champs inconnus ou les types faux"
  - from: 1
    to: 2
    text: "Transforme puis calcule le score, sans réentraînement"
  - from: 2
    to: 1
    text: "Retourne le score numérique"
  - from: 1
    to: 0
    text: "Répond score, version du modèle, horodatage"
```

La réponse minimale tient en trois champs : le score, la **version** du modèle qui l'a produit, et de quoi tracer la requête. Elle ne renvoie pas les données d'entraînement, ni les poids, ni une explication improvisée si vous n'avez pas prévu ce calcul.

```json
{
  "dossier_id": "C-10492",
  "score": 0.27,
  "modele": "churn-1.3.0",
  "calcule_le": "2026-04-02T08:15:03Z"
}
```

Le seuil métier (appeler ou non) peut vivre **hors** du modèle, dans la configuration de l'application, parce qu'il dépend de la capacité du centre d'appels. Le modèle rend un score. Le produit décide. Mélanger les deux oblige à réentraîner pour changer un seuil.

# Le contrat d'entrée

Le **contrat** est la liste des champs acceptés : nom, type, unité, obligatoire ou non, valeurs permises. Il est versionné **avec** le modèle. Un pipeline entraîné avec `facture_mensuelle_eur` ne peut pas recevoir `facture` en centimes sous le même nom.

Exemple pour un score de résiliation :

| Champ | Type | Règle |
|---|---|---|
| `anciennete_mois` | entier ≥ 0 | Obligatoire. |
| `facture_mensuelle_eur` | nombre ≥ 0 | Obligatoire, en euros, pas en centimes. |
| `offre` | texte | Une valeur parmi `mobile`, `fibre`, `pack`. |
| `appels_sav_90j` | entier ≥ 0 | Obligatoire. Absent n'est pas zéro. |

Une offre inconnue (`satellite`) ne doit pas être silencieuse. Deux politiques explicites, à choisir dans le contrat, pas au hasard du code :

- **Refus** (422) : l'appelant corrige. Préférable si la catégorie nouvelle est une anomalie.
- **Valeur dédiée** `autre`, **si** le pipeline a été entraîné avec cette modalité. Inventer `autre` au moment du service, alors que l'encodeur ne la connaît pas, décale toutes les colonnes binaires.

L'ordre des colonnes dans un JSON n'a pas d'importance si vous construisez le tableau par **noms**. Il en a si vous construisez une liste positionnelle « comme dans le CSV ». Le contrat par noms est plus sûr.

Les champs en trop se refusent. Un appelant qui envoie `a_resilie` (la cible) ou `score_precedent` ne doit pas influencer le calcul par accident. La cible n'est pas une feature de production : au moment de la décision, elle est inconnue. C'est tout l'objet du modèle.

> [!IMPORTANT]
> Documentez les unités dans le nom ou à côté du champ. `delai: 30` sans dire s'il s'agit de jours ou d'heures est un incident en attente, pas un contrat.

# La version voyage avec la réponse

Chaque artefact a un identifiant immuable : `churn-1.3.0`, ou la date d'entraînement plus l'empreinte du fichier. La réponse HTTP le répète. Sans cela, un incident « les scores ont changé mardi » ne se relie à aucun entraînement.

Conséquences pratiques :

- Deux versions peuvent coexister. L'API de production pointe vers le **champion**. Une version candidate peut scorer en parallèle (**ombre**) sans que l'application n'en tienne compte.
- On ne « met à jour le fichier » sous le même nom. On publie un nouvel identifiant, puis on déplace le pointeur.
- Le journal de chaque appel contient la version, l'identifiant de dossier et le score. Pas nécessairement toutes les features en clair si elles sont sensibles : dans ce cas, un identifiant de dossier suffit à les retrouver dans la source autorisée.
- Le code qui a entraîné cette version est un commit. Le registre, traité dans le chapitre sur le réentraînement, relie version, commit, jeu de données et métrique.

Une version qui n'a pas passé la validation ne devient pas champion parce que le fichier est présent dans le dossier `artifacts`. La présence d'un `.joblib` n'est pas une promotion.

# Latence : mesurer le percentile

Pour un modèle tabulaire de cette taille, le score d'une ligne est d'ordinaire une affaire de millisecondes, une fois le pipeline **déjà en mémoire**. Le chiffre à surveiller n'est pas la moyenne, qui cache les requêtes lentes : c'est un percentile élevé, par exemple le temps sous lequel tombent 95 % des requêtes (p95), mesuré sur le service réel.

Ce qui gonfle la latence sans rapport avec l'algorithme :

- recharger le fichier joblib **à chaque** requête ;
- réentraîner, même « un peu » ;
- construire le préprocesseur à la volée ;
- enchaîner des allers-retours vers une base pour chaque champ, au lieu de recevoir les features déjà rassemblées par l'appelant qui a le droit de les lire ;
- accepter un lot de cent mille lignes dans le fil de la requête web.

```diagram
type: compare
title: "Où mettre la charge"
columns:
  - title: "Requête de score"
    tone: teal
    items:
      - "Une ligne ou un petit lot"
      - "Pipeline déjà chargé"
      - "Validation du contrat, puis predict"
      - "Réponse synchrone avec la version"
  - title: "Traitement différé"
    tone: amber
    items:
      - "Des centaines de milliers de lignes"
      - "Fichier ou file, pas un POST bloquant"
      - "Même artefact versionné"
      - "Résultat déposé, pas tenu dans la requête HTTP"
```

On fixe un objectif avant de discuter d'optimisation, par exemple : p95 sous 50 ms pour une ligne, hors réseau du client, pipeline chaud. Si le p95 dépasse l'objectif, on mesure **où** le temps passe (contrat, préparation, modèle, journalisation) avant de changer d'algorithme. Remplacer un boosting rapide par un réseau pour « faire plus moderne » dégrade souvent la latence sans améliorer la décision.

Le démarrage à froid existe : le premier appel après un redémarrage paie le chargement. On charge au **démarrage du processus**, et on ne déclare le service prêt qu'ensuite. Sinon le premier client réel absorbe le coût, et le monitoring croit à un incident aléatoire.

# On n'entraîne pas dans la requête

L'entraînement lit l'historique, produit un artefact, une validation décide de le promouvoir. La requête **applique** l'artefact. Les deux temps ne se mélangent pas.

```python
@app.post("/scores")
def scores(dossier: Dossier):
    frame = dossier.vers_tableau()
    score = pipeline.predict_proba(frame)[:, 1][0]
    return {"score": float(score), "modele": VERSION}
```

Ce qui n'a pas sa place dans ce gestionnaire :

- `fit`, `partial_fit`, une boucle d'epochs ;
- un `train_test_split` sur le corps de la requête ;
- le recalcul d'un scaler « avec les lignes reçues ce matin », qui rend deux clients non comparables selon le voisinage du lot ;
- l'écriture des poids à chaque appel.

Pourquoi c'est grave, au-delà de la lenteur. Le résultat n'est plus **reproductible** : le même dossier, envoyé deux fois, peut changer de score si les poids bougent. Il n'y a plus de version à citer dans un recours. Et si le corps de la requête mélange des dates futures et passées, ou la cible de quelques lignes, vous fabriquez une fuite à l'intérieur du service.

Apprendre en continu est un **autre** système, conçu pour cela : fenêtre de données, rythme, validation, garde-fou si les labels sont faux. Ce n'est pas le comportement par défaut d'un endpoint. Tant que ce système n'est pas spécifié, le service charge une version et ne la modifie pas.

> [!CAUTION]
> Un endpoint « pratique » qui refait un `fit` sur l'historique à chaque appel, pour « être à jour », cumule la latence, l'absence de version et l'absence de validation. Être à jour est le travail du réentraînement planifié, pas celui de la requête.

# Exercices

## Exercice 1 : Ce qui manque au fichier

Un notebook termine par `joblib.dump(modele, "model.joblib")`, où `modele` est le classifieur seul. Le préprocesseur (imputation et one-hot) est resté dans des variables du notebook. L'API charge `model.joblib` et lui passe le JSON brut des quatre champs.

Que se passe-t-il à l'appel, et que fallait-il sérialiser ?

<details>
<summary>Voir la solution</summary>

Le classifieur attend la **matrice déjà transformée** (colonnes imputées, catégories devenues indicatrices, ordre figé). Le JSON brut n'a pas cette forme : l'appel lève une erreur, ou, si quelqu'un a bricolé un tableau de nombres dans le mauvais ordre, il renvoie un score faux.

Il fallait sérialiser le **pipeline** complet, préparation comprise, sous un nom versionné (`churn-1.3.0.joblib`), et construire en API un tableau **par noms de colonnes** conforme au contrat. Le préprocesseur du notebook n'existe plus quand le notebook est fermé : s'il n'est pas dans l'artefact, il est perdu.

</details>

## Exercice 2 : Tenir le contrat

Le contrat attend `facture_mensuelle_eur` (euros, ≥ 0) et `offre` parmi `mobile`, `fibre`, `pack`. Une requête arrive avec `facture_mensuelle_eur: 4290` (en fait des centimes) et `offre: "satellite"`.

Décrivez le comportement correct de l'API, et le bug si l'on « corrige » en silence en divisant par 100 toute facture supérieure à 500.

<details>
<summary>Voir la solution</summary>

`satellite` est hors contrat : réponse **422**, sans score, avec un message qui cite le champ. On ne mappe pas vers `fibre` ni vers une modalité `autre` inconnue de l'encodeur.

La facture 4290 euros est dans le type (nombre ≥ 0) mais l'unité est fausse. Le contrat à lui seul ne devine pas les centimes. Le correctif silencieux « si > 500, diviser par 100 » est un bug : une vraie facture professionnelle de 890 euros serait divisée, et une facture de 4,29 euros mal saisie en 429 passerait. On refuse ou l'on alerte sur une plage métier **écrite** (par exemple un plafond connu), et on fait corriger l'appelant. On ne réinterprète pas l'unité appel par appel.

</details>

## Exercice 3 : Latence et entraînement

Le p95 mesuré est de 8 secondes. Le code recharge le joblib à chaque requête, accepte jusqu'à 50 000 lignes, et appelle `fit` sur les lignes du jour « pour affiner ». Classez les trois causes par ce qu'il faut changer, et dites ce qui reste interdit même si la latence redevient bonne.

<details>
<summary>Voir la solution</summary>

1. **Charger le pipeline au démarrage**, une fois. Le rechargement par requête domine souvent les quelques millisecondes du `predict`.
2. **Plafonner le lot** synchrone (une ligne ou un petit lot) et envoyer les 50 000 lignes vers un traitement différé qui utilise le même artefact.
3. **Retirer le `fit`.** Même si, après optimisations, la requête répondait vite, entraîner dans la requête supprime la version stable, la reproductibilité et la validation avant promotion. Affiner « sur les lignes du jour » est un réentraînement non contrôlé, pas un réglage de latence.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Servir un modèle par une API"
center: "L'API charge un pipeline figé, vérifie le contrat, renvoie un score et une version. Elle n'entraîne pas."
points:
  - icon: file
    title: "Pipeline entier"
    text: "Préparation et modèle dans le même artefact. Le classifieur seul ne sait pas encoder."
  - icon: list
    title: "Contrat nommé"
    text: "Champs, types, unités, modalités. On refuse le hors-contrat, on n'invente pas une catégorie."
  - icon: git
    title: "Version dans la réponse"
    text: "Chaque score cite le modèle qui l'a produit. On ne réécrit pas le fichier sous le même nom."
  - icon: gauge
    title: "Latence au percentile"
    text: "Pipeline chaud, petit lot. Un grand volume part en traitement différé, pas dans le POST."
  - icon: alert
    title: "Pas de fit"
    text: "La requête applique une version validée. Se mettre à jour est le travail du réentraînement."
pitfall: "Recharger le fichier et relancer un fit à chaque appel, puis croire que le service est à jour."
remember: "Un score sans version et sans contrat n'est pas un service. C'est un notebook exposé sur le réseau."
```
