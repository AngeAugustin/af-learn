---
title: Classer un texte
description: Enchaîner TF-IDF et régression logistique, lire les erreurs, et savoir quand un grand modèle n'est pas nécessaire.
duration: 65
objectives:
  - Monter un pipeline texte ajusté sur le train seulement
  - Choisir une métrique quand les avis négatifs sont rares
  - Lire une matrice de confusion et les exemples faux
  - Décider de rester sur ce modèle simple si le gain suivant est mince
---

# Le premier classifieur de texte est une baseline

Vous classez des avis : **positif** ou **négatif**. La chaîne standard, volontairement simple :

1. découper et vectoriser en **TF-IDF** (mots et bigrammes fréquents) ;
2. ajuster une **régression logistique** ;
3. choisir le seuil sur la **validation** ;
4. lire les erreurs, pas seulement le F1.

Le vectorizer et le modèle vivent dans **un pipeline**. Ajustés sur le train, appliqués au test. Pas de vocabulaire construit sur tout le fichier.

```diagram
type: pipeline
title: Pipeline de classification de texte
lanes:
  - title: Ajusté sur le train
    steps:
      - title: TF-IDF
        text: Vocabulaire et poids
        tone: blue
      - title: Logistique
        text: Un poids par token
        tone: teal
  - title: Figé ensuite
    steps:
      - title: Validation
        text: Seuil et erreurs
        tone: amber
      - title: Test
        text: Une mesure finale
        tone: violet
```

# Classe rare

Si **12 %** des avis sont négatifs, prédire « tout est positif » atteint **88 %** d'accuracy et ne trouve **aucune** plainte. Vous pilotez le **rappel des négatifs** avec une précision plancher, parce qu'une plainte manquée coûte plus qu'une relecture inutile, ou l'inverse si la relecture est chère. Vous l'écrivez avant l'essai.

La matrice de confusion sur la validation, avec un seuil :

|  | Prédit négatif | Prédit positif |
|---|---|---|
| Vrai négatif | 70 | 30 |
| Vrai positif | 40 | 860 |

Rappel des négatifs : **70 / 100 = 0,70**. Précision : **70 / 110 ≈ 0,64**. Quarante avis positifs ont été relus pour rien. Trente plaintes ont été manquées. Le métier dit si cet échange lui convient. Le F1 ne le dit pas à sa place.

# Lire les faux

Vous ouvrez **20** faux négatifs et **20** faux positifs.

- Faux négatifs pleins de « RAS » et « nickel » mal orthographié : le vocabulaire est trop strict, ou la casse.
- Faux positifs pleins de « pas terrible » pris pour « terrible » : la négation.
- Avis longs qui disent les deux : le sac ne sait pas quel bout compte. Un modèle plus riche n'est candidat que si ces cas sont **nombreux** et chers.

Les poids de la logistique se lisent : « remboursé », « abîmé », « retard » tirent vers le négatif. Si « monsieur » ou un prénom tire aussi fort, le modèle a appris un artefact. Vous le retirez.

> [!WARNING]
> Un texte collé depuis un e-mail contient parfois la signature et le service. Le modèle peut classer « service comptabilité » plutôt que le fond du message. Nettoyez avant de vectoriser.

# Rester simple

Vous comparez au même protocole :

- baseline : mot-clé « retard | abîmé | rembours » ;
- TF-IDF + logistique ;
- éventuellement un modèle plus lourd, **une fois**, si l'écart de la logistique à la baseline ne suffit pas.

Si la logistique rappelle **0,70** et le modèle lourd **0,73** pour un coût d'exploitation bien plus haut, vous gardez la logistique. Vous notez les familles d'erreurs que vous acceptez (ironie, avis mixtes).

> [!TIP]
> Versionnez le pipeline (code, seuil, liste de mots retirés). Un avis « mieux classé » sans dire le seuil n'est pas une amélioration.

# Exercices

## Exercice 1 : Accuracy creuse

12 % d'avis négatifs. Un collègue annonce 88 % d'accuracy. Quelle question posez-vous, et quel chiffre demandez-vous ?

<details>
<summary>Voir la solution</summary>

Vous demandez le **rappel** (et la précision) **des négatifs**. 88 % est le score de « tout est positif ». Sans rappel des plaintes, le modèle n'a pas été évalué sur la classe qui compte.

</details>

## Exercice 2 : Lire la matrice

La matrice du cours (70 vrais négatifs trouvés, 30 manqués, 40 positifs relus à tort). Le service ne peut relire que 50 avis par jour, pas 110. Que changez-vous ?

<details>
<summary>Voir la solution</summary>

Vous **remontez le seuil** pour ne garder que les 50 scores les plus négatifs, puis vous recalculez précision et rappel dans cette file. Envoyer 110 avis ne sera pas lu. Le seuil se cale sur la capacité, sur la validation, pas sur le test.

</details>

## Exercice 3 : Faut-il plus lourd ?

Mots-clés : rappel 0,55. Logistique : 0,70. Modèle lourd : 0,73, lent et cher. Les erreurs restantes sont surtout des avis ironiques rares. Que déployez-vous ?

<details>
<summary>Voir la solution</summary>

La **logistique**. Elle bat nettement les mots-clés. Le gain de 0,03 ne paie pas le coût, et l'ironie rare n'est pas le cœur du flux. On documente cette famille d'erreurs acceptée.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Classer un texte
center: TF-IDF et une logistique, dans un pipeline, battent souvent un modèle lourd sur des avis courts.
points:
  - icon: filter
    title: Pipeline
    text: Vocabulaire et modèle s'ajustent sur le train, puis se figent.
  - icon: target
    title: Classe rare
    text: L'accuracy de la majorité cache un rappel nul sur les plaintes.
  - icon: eye
    title: Lire les faux
    text: Vingt erreurs montrent négation, typo ou signature mieux qu'un F1.
  - icon: scale
    title: Seuil
    text: Il suit le nombre d'avis que l'équipe peut relire.
  - icon: check
    title: Rester simple
    text: Trois points de rappel ne paient pas un modèle cher si les erreurs restantes sont rares.
pitfall: Juger un classifieur d'avis négatifs à l'accuracy quand 88 % des avis sont positifs.
remember: Déployez le modèle le plus simple qui atteint le rappel utile, et nommez les erreurs que vous acceptez.
```
