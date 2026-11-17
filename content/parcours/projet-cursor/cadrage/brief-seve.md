---
title: "Écrire le brief d'Atelier Sève"
description: "Tenir sur une page les chiffres que Léa Vernet peut contredire, et coller ce brief au lieu de le réinventer à chaque prompt."
duration: 50
objectives:
  - "Rédiger un brief d'une page que Léa peut contredire"
  - "Fixer le problème, les règles et l'absence de paiement réel"
  - "Coller ce brief dans le chat ou dans un fichier du dépôt"
  - "Garder les mêmes chiffres d'un prompt à l'autre"
---

# Une page que Léa peut contredire

Léa Vernet tient Atelier Sève, à Lyon Croix-Rousse. Elle ne lit pas un dossier. Elle lit une page. Si une ligne est fausse, elle doit pouvoir dire non tout de suite : le samedi n'est pas le dimanche, le stage ne dure pas « la matinée », il y a 8 places et pas 10, le prix est 45 €.

Une page que personne ne peut contredire n'est pas un brief. « Une application moderne, simple et intuitive pour gérer les stages » passe partout. Léa ne peut ni la valider ni la refuser. L'agent, lui, la remplira avec ce qu'il devine : un autre horaire, un autre prix, un paiement.

Le test tient en une lecture à voix haute. Chaque phrase utile contient un fait que Léa peut nier avec un chiffre ou un nom. Le reste, les adjectifs, les promesses vagues, sort de la page.

> [!IMPORTANT]
> Si Léa ne peut pas dire « non, c'est faux » sur une phrase, cette phrase n'est pas une règle. Elle ne guide pas l'agent.

# Le problème en chiffres

Le problème n'est pas « digitaliser l'atelier ». Il est chiffré.

Léa propose 12 stages par mois. Le créneau est le samedi, 10 h-13 h. Le remplissage est de 70 %. Et 3 personnes par mois ne viennent pas, parce que le SMS est oublié. Léa décide qui est confirmé avant 18 h la veille. Ensuite quelqu'un devait écrire. Ce quelqu'un oublie. La place reste vide, le stage était pourtant compté comme pris.

Ces chiffres expliquent pourquoi l'Application Sève existe. Ils ne décorent pas le texte. 12 stages, 70 %, 3 absents : c'est la situation de départ. L'horaire, le lieu, le nom de Léa aussi. Si vous écrivez « souvent des absents » à la place de « 3 absents par mois », vous avez déjà perdu le fait que Léa peut contredire.

> [!NOTE]
> Le remplissage de 70 % et les 3 absents disent le problème. Ils ne deviennent pas un texte à afficher sur chaque stage. La page montrera les règles, pas la statistique du mois.

# Les règles qu'on ne change pas

Les règles tiennent en quatre lignes. Vous les recopiez telles quelles, y compris les nombres.

- 8 places par stage.
- 45 €.
- Une attente ordonnée, 12 personnes au plus.
- La décision de Léa se prend avant 18 h la veille.

Le créneau fait partie du même bloc : samedi, 10 h-13 h, à Lyon Croix-Rousse. Une règle sans chiffre (« un petit groupe », « un prix accessible », « prévenir assez tôt ») sera traduite différemment à chaque prompt. 8, 45, 12 et 18 h ne se traduisent pas. Ils se vérifient.

L'attente n'est pas un tas de noms. Elle est ordonnée, et elle s'arrête à 12. La décision n'est pas « Léa confirmera ». Elle a une heure limite, la veille. Vous écrivez l'heure dans le brief pour ne pas la redécouvrir au milieu d'un diff.

# Hors de ce tour, pas de paiement réel

Le brief dit aussi ce qu'on ne fait pas. Dans ce tour, il n'y a pas de paiement réel. Pas de carte, pas de lien de paiement, pas d'écran qui encaisse les 45 €. Le prix s'affiche. Il ne se prélève pas.

Cette ligne est une règle négative. Sans elle, l'agent voit « 45 € » et ouvre un paiement, parce que beaucoup d'applications de stage en ont un. Léa n'a pas demandé ça. Le hors-périmètre se lit sur la même page que les règles, pas dans un message que vous enverrez seulement si ça dérape.

Vous n'ajoutez pas, pour faire sérieux, une liste de techniques. Le brief ne choisit pas une technique, une base, ni une couleur. Il reste sur ce que Léa peut contredire. La façon de construire viendra dans le plan, un incrément à la fois.

> [!WARNING]
> Un prix écrit dans le brief n'est pas un ordre d'encaisser. 45 € s'affiche. Le paiement réel reste hors de ce tour, sur la même page que le reste.

# Coller le brief, une seule fois

Vous avez deux endroits justes, et un endroit faux.

Le juste, dans le dépôt : vous créez un fichier, par exemple `BRIEF.md`, à la racine du projet de l'Application Sève. Vous y collez la page, rien d'autre. Dans le chat de Cursor, vous le citez avec `@` quand vous en avez besoin. Le fichier ne change pas parce que la conversation a défilé.

Le juste, dans le chat : le premier message contient la page entière. Les messages suivants disent « selon le brief déjà donné ». Ils ne réécrivent pas une deuxième version.

Le faux : le brief seulement dans votre tête. Ou réécrit de mémoire à chaque prompt. Au troisième message, 8 places deviennent 10, 18 h devient « la veille au soir », et l'agent suit la dernière version, pas la bonne.

Si le fichier et le chat ne disent pas la même chose, vous arrêtez. Vous alignez les deux sur la page que Léa a pu contredire. Ensuite seulement vous envoyez.

```text
Atelier Sève, Lyon Croix-Rousse
Commanditaire : Léa Vernet
Application Sève

Problème
12 stages par mois, samedi 10 h-13 h.
Remplissage 70 %. 3 absents par mois (SMS oublié).

Règles
8 places. 45 €.
Attente ordonnée, 12 au plus.
Décision de Léa avant 18 h la veille.

Hors de ce tour
Pas de paiement réel.
```

> [!TIP]
> Après le premier collage, vos prompts citent le fichier. Ils ne reposent pas la page. `@BRIEF.md` évite de retaper 8, 45, 12 et 18 h.

# Le message d'après ne réinvente rien

Le brief n'est pas un prologue qu'on oublie. C'est la pièce que vous rouvrez. Quand vous demanderez la liste des stages, le formulaire, l'attente ou la confirmation, vous pointez cette page. Vous ne négociez pas de nouveaux chiffres dans la phrase qui lance le travail.

Regardez la différence. « Fais une belle page de stages pour une céramiste » invente un produit. « Selon le brief : la page des 12 stages, samedi 10 h-13 h » exécute une page déjà contredite par Léa, ou déjà acceptée par elle. Le deuxième message est plus court parce que les faits vivent dans le fichier.

Si Léa change un chiffre plus tard, vous changez le brief d'abord, devant elle. Puis vous citez le fichier mis à jour. Vous ne glissez pas le nouveau prix seulement dans un prompt, en laissant 45 € dans `BRIEF.md`. Deux sources, c'est déjà une contradiction. L'agent en choisira une, souvent la mauvaise.

```diagram
type: flow
title: "Du fait contredit au prompt suivant"
steps:
  - title: Page
    text: "Problème, règles, hors-paiement. Léa peut dire non sur chaque chiffre."
    tone: violet
  - title: Contradiction
    text: "Elle corrige l'horaire, les 8 places, 45 €, l'attente 12 ou les 18 h."
    tone: amber
  - title: Collage
    text: "La page va dans le chat, ou dans un fichier du dépôt. Une seule version."
    tone: teal
  - title: Suite
    text: "Les prompts citent cette version. Ils ne réinventent pas les chiffres."
    tone: blue
```

# Exercices

## Exercice 1 : La page que Léa peut refuser

On vous propose ce texte : « Application moderne et intuitive pour les stages de céramique de Léa, avec un parcours fluide, un paiement simple et une belle liste d'attente. » Réécrivez le brief d'une page. Chaque ligne doit pouvoir être contredite.

<details>
<summary>Voir la solution</summary>

Atelier Sève, Lyon Croix-Rousse. Commanditaire : Léa Vernet. Application Sève.

Problème : 12 stages par mois, le samedi de 10 h à 13 h. Remplissage 70 %. 3 absents par mois parce que le SMS est oublié.

Règles : 8 places, 45 €, attente ordonnée jusqu'à 12, décision de Léa avant 18 h la veille.

Hors de ce tour : pas de paiement réel. Le prix s'affiche, il ne s'encaisse pas.

« Moderne », « intuitive », « fluide » et « belle » sortent. Léa ne peut pas les contredire avec un fait. « Paiement simple » sort aussi : il contredit le hors-périmètre.

</details>

## Exercice 2 : Le troisième prompt a changé les chiffres

`BRIEF.md` dit 8 places, 45 €, pas de paiement réel. Votre nouveau message dit : « Finalise avec 10 places, 50 €, et le paiement carte, ce sera plus réaliste. » Que faites-vous avant d'envoyer ?

<details>
<summary>Voir la solution</summary>

Vous n'envoyez pas. Le prompt réinvente le brief. 10 places et 50 € contredisent la page sans que Léa l'ait fait. Le paiement carte est hors de ce tour.

Vous remplacez le message par une citation du fichier, par exemple : « Selon @BRIEF.md, sans changer les règles. » Si Léa a vraiment décidé 10 places, elle le dit d'abord, vous modifiez `BRIEF.md`, puis vous citez le fichier. Vous ne laissez pas deux versions vivre, une dans le dépôt et une dans le chat.

</details>

## Exercice 3 : Le chat et le fichier ne disent pas la même chose

Le fichier indique 8 places et une décision avant 18 h la veille. Un ancien message du chat parle de 9 places et d'une décision « dans la soirée ». L'agent demande laquelle suivre. Que répondez-vous, et que corrigez-vous ?

<details>
<summary>Voir la solution</summary>

Vous répondez avec le brief que Léa peut contredire : 8 places, décision avant 18 h la veille. Pas 9 places, pas « la soirée ».

Vous corrigez la source fausse pour qu'il n'en reste qu'une. Si le fichier est la bonne page, vous le dites, et vous ne réécrivez pas les chiffres dans le message. Si c'est le chat qui a dérivé, vous ne le laissez pas gagner parce qu'il est plus récent. La version récente n'est pas la version vraie. Une seule page, collée, citée ensuite.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Le brief sur une page
center: "Une page que Léa peut contredire. On la colle une fois, on ne réinvente pas les chiffres."
points:
  - icon: users
    title: Léa Vernet
    text: "Atelier Sève, Lyon Croix-Rousse. Elle doit pouvoir dire non sur un fait, pas sur un adjectif."
  - icon: alert
    title: Le problème
    text: "12 stages par mois, samedi 10 h-13 h, remplissage 70 %, 3 absents parce que le SMS est oublié."
  - icon: list
    title: Les règles
    text: "8 places, 45 €, attente ordonnée jusqu'à 12, décision de Léa avant 18 h la veille."
  - icon: money
    title: Hors paiement
    text: "45 € s'affiche. Pas de paiement réel dans ce tour. Le prix n'est pas un ordre d'encaisser."
  - icon: file
    title: Une seule copie
    text: "Dans le chat ou dans un fichier du dépôt. Les prompts suivants citent, ils ne réécrivent pas."
pitfall: "Retaper le brief de mémoire. Au bout de trois prompts, 8 places deviennent 10 et le paiement revient."
remember: "Si Léa ne peut pas contredire la phrase, ce n'est pas une règle. Collez la page, puis citez-la."
```
