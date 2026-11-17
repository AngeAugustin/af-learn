---
title: Texte, les fondamentaux
description: Transformer un avis ou un ticket en nombres avec un sac de mots et un TF-IDF, et voir ce que cela rate.
duration: 55
objectives:
  - Découper un texte en tokens et choisir quoi garder
  - Construire un sac de mots et un vecteur TF-IDF
  - Repérer négation, ordre et rareté que ces vecteurs ignorent
  - Décider si ce niveau suffit avant un modèle plus lourd
---

# Un texte n'est pas encore une colonne

Un avis client, « livré en retard, mais l'emballage tient », ne se met pas tel quel dans une régression. On le découpe en **tokens** (mots, parfois bouts de mots) : livré, en, retard, mais, emballage, tient.

Tous les tokens ne se valent pas. « en », « mais », « le » sont partout. Les garder multiplie des colonnes peu informatives. Les retirer (liste de mots vides) aide, jusqu'au moment où « pas » et « ne » portaient la négation. Vous ne videz pas la liste sans regarder des exemples faux.

```diagram
type: flow
title: Du texte brut au vecteur
steps:
  - title: Nettoyer
    text: Casse, accents, URL, selon le corpus
    tone: blue
  - title: Découper
    text: Tokens, éventuellement groupes de deux mots
    tone: teal
  - title: Compter
    text: Présence, fréquence, ou TF-IDF
    tone: amber
  - title: Modéliser
    text: Une régression ou un arbre sur ces nombres
    tone: violet
```

# Sac de mots

Le **sac de mots** compte, il ne range pas. « chien mord homme » et « homme mord chien » deviennent le même vecteur. Pour beaucoup de tickets (« colis abîmé », « facture en double »), le sujet tient dans les mots, pas dans la syntaxe. Le sac suffit.

Un **n-gramme** de taille 2 garde les paires : « pas content », « en double ». Cela rattrape une partie de la négation et fait grossir le vocabulaire. On limite aux paires qui apparaissent au moins **5 fois**, sinon chaque faute de frappe devient une colonne.

# TF-IDF

La fréquence seule met en avant les mots banals du corpus (« client », « commande »). Le **TF-IDF** hausse un mot fréquent **dans ce texte** et rare **dans les autres**. « Remboursement » dans un avis où le reste du corpus parle de délais devient plus saillant que « commande ».

Ce n'est pas une compréhension. C'est une pondération. Un mot rare peut être une typo. Vous regardez les plus forts poids d'un texte mal classé avant de croire le vecteur.

> [!NOTE]
> Le vocabulaire s'apprend sur l'entraînement seulement. Un mot vu pour la première fois en test devient un inconnu, pas une colonne créée après coup. Sinon la dimension du vecteur fuit.

```video
url: https://www.youtube.com/watch?v=zLMEnNbdh4Q
title: "Term Frequency Inverse Document Frequency (TF-IDF) Explained"
channel: "DataMListic"
duration: "8:59"
lang: en
why: "Le TF-IDF expliqué en neuf minutes : fréquence du terme, rareté dans le corpus et calcul du poids."
```

# Ce que cela rate

- La **négation** loin du mot : « je ne dirais pas que c'est rapide ».
- L'**ironie** et le contexte de marque.
- L'**ordre** des arguments dans un long message.
- Les **formules** qui changent (« RAS », « rien à signaler », « ok ») et disent la même chose sans partager de token.

Quand ces ratés dominent les erreurs, un sac de mots plafonne. Le chapitre suivant mesure ce plafond avec une régression logistique. Un grand modèle de langue n'est pas le premier réflexe : il est justifié si ce plafond, documenté, est encore trop bas pour la décision.

> [!WARNING]
> Coller un texte libre de client dans un tableau avec son nom et son téléphone n'est pas une feature. Vous minimisez. Le chapitre d'éthique du parcours rappelle la finalité.

# Exercices

## Exercice 1 : Même sac

Ces deux phrases donnent-elles le même sac de mots (mots pleins, sans n-gramme) ?

1. « Le colis est arrivé abîmé. »
2. « Abîmé, le colis est arrivé. »

<details>
<summary>Voir la solution</summary>

Oui, aux mots vides près. L'ordre a changé, les comptes non. Si la distinction d'ordre comptait, il faudrait des n-grammes ou une autre représentation. Ici le sujet « colis abîmé » est commun, et le sac suffit.

</details>

## Exercice 2 : Garder « pas »

Une liste de mots vides retire « ne » et « pas ». L'avis « pas satisfait » devient « satisfait ». Quel effet sur un classifieur d'insatisfaction ?

<details>
<summary>Voir la solution</summary>

Il **inverse** le signal. « pas satisfait » rejoint « satisfait ». On garde la négation, ou on utilise le bigramme « pas satisfait », et on le vérifie sur des exemples.

</details>

## Exercice 3 : Vocabulaire

Vous construisez le vocabulaire TF-IDF sur train et test réunis, puis vous découpez. Quel est le problème ?

<details>
<summary>Voir la solution</summary>

Le test a choisi quels mots existent comme colonnes, et il a participé aux raretés IDF. Le vecteur du train connaît déjà un peu le test. On ajuste le vectorizer **sur le train**, dans le pipeline, et on l'applique ensuite.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Texte en nombres
center: Un sac de mots compte des tokens. Il ne lit pas l'ordre, ni une négation éloignée.
points:
  - icon: file
    title: Tokens
    text: On découpe, on décide des mots vides, et on garde la négation si elle inverse le sens.
  - icon: list
    title: Sac de mots
    text: Les comptes ignorent l'ordre. Deux phrases mélangées peuvent se confondre.
  - icon: gauge
    title: TF-IDF
    text: Un mot fréquent ici et rare ailleurs pèse plus qu'un mot banal du corpus.
  - icon: filter
    title: Vocabulaire
    text: On l'apprend sur le train. Un mot nouveau en test reste inconnu.
  - icon: alert
    title: Plafond
    text: Ironie et syntaxe longue échappent au sac. On mesure ce plafond avant plus lourd.
pitfall: Retirer « pas » et « ne » avec les mots vides, et transformer une plainte en compliment.
remember: Compter les mots suffit souvent aux tickets courts. Documentez les erreurs que le compte ne peut pas voir.
```
