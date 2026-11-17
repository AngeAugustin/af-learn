---
title: Principes d'un tableau de bord
description: "Concevoir une page qui sert une décision : hiérarchie visuelle, fraîcheur affichée, public visé, et frontière avec le rapport paginé."
duration: 40
objectives:
  - Relier chaque page à une décision et à un public nommé
  - Organiser une hiérarchie visuelle sur une seule page
  - Afficher la fraîcheur et choisir entre dashboard et rapport paginé
  - Distinguer le besoin d'une direction de celui d'une équipe opérationnelle
---

# Une décision avant les graphiques

Un tableau de bord n'est pas une vitrine de graphiques. C'est une page qui aide **une personne** à prendre **une décision** dans un délai court. Avant d'ouvrir l'outil, écrivez la phrase que la page doit permettre de conclure.

Exemples de décisions, pas de sujets :

- « Faut-il décaler la promo de la semaine 12 sur la région Ouest ? »
- « Quels magasins rappeler aujourd'hui parce que la rupture dépasse le seuil ? »
- « Le mois est-il en ligne avec l'objectif de marge, et où est l'écart ? »

Si vous ne pouvez pas écrire cette phrase, vous n'avez pas encore un tableau de bord. Vous avez un sujet (« les ventes »), et un sujet produit des graphiques sans ordre. Le test est simple : après trente secondes, le lecteur doit pouvoir dire si la situation est tenue, dégradée ou à arbitrer, et quelle question il pose ensuite.

> [!IMPORTANT]
> Le titre de la page reprend la décision, pas le nom de la source. « Pilotage marge, réseau » est un titre. « Export ventes v3 final » n'en est pas un.

# Une page, une question

La page tient sur **un écran**, sans scroll pour l'essentiel. Ce qui ne répond pas à la question sort : autre onglet, annexe, ou rapport paginé. Une direction qui doit descendre pour « voir la suite » a déjà perdu le fil.

Trois règles tiennent la page :

1. **Un objectif par page.** La page « mois en cours » ne mélange pas le suivi quotidien des caisses et le bilan annuel.
2. **Peu de chiffres mis en avant.** Trois à sept indicateurs suffisent en tête. Le reste explique l'écart, il ne concourt pas avec le message.
3. **Un chemin de lecture.** Le regard part du haut à gauche, descend vers la cause, finit sur l'action ou le détail utile.

Une deuxième page se justifie quand la décision change. « Le mois est-il tenu ? » et « Quel magasin j'appelle ? » sont deux questions. Deux pages, reliées par un filtre ou un lien, valent mieux qu'une page qui tente de servir les deux.

# La hiérarchie visuelle

La hiérarchie dit au regard **quoi lire en premier**. Elle se construit avec la taille, la position, le contraste et le vide, pas avec une couleur de plus.

| Zone | Rôle | Ce qu'on y met |
| --- | --- | --- |
| Bandeau | Contexte | Titre, période, fraîcheur, filtre principal |
| Tête | Le verdict | Indicateurs, écart à la cible, tendance courte |
| Corps | La cause | Une ou deux répartitions qui expliquent l'écart |
| Bas ou côté | L'action | Exceptions, liste courte, lien vers le détail |

Le plus grand n'est pas « le graphique que l'on aime ». C'est le chiffre qui tranche. Un camembert décoratif de 400 pixels à côté d'une marge en corps 12 inverse la hiérarchie : l'œil lit la décoration et rate la décision.

Le vide est un outil. Une carte d'indicateur entourée d'air se lit. La même carte collée à six autres devient une mosaïque. Si tout est en gras, plus rien n'est important.

> [!TIP]
> Squintez la page (plissez les yeux). La forme qui reste doit être le verdict, pas le logo ni la légende.

# Montrer la fraîcheur

Un chiffre sans date est une opinion. La page affiche **jusqu'à quand** les données sont à jour, dans le langage du lecteur : « Ventes à jour au lundi 16 mars, 7 h. Objectifs : version validée le 2 mars. »

Deux horloges cohabitent souvent. Les ventes peuvent être fraîches à J-1, les stocks à l'heure, les objectifs figés pour le mois. Les mélanger sans le dire produit de fausses alertes : un magasin « en retard » alors que sa journée n'est pas encore chargée.

Précisez aussi le **périmètre** à côté de la date : magasins ouverts, hors franchises, hors ventes internes. Une fraîcheur juste sur un mauvais périmètre reste un mauvais chiffre.

Quand la donnée est en retard, dites-le sur la page (un bandeau), ne le cachez pas dans un e-mail. Le lecteur décide avec ce qu'il voit. S'il croit la page à jour alors que le chargement de la nuit a échoué, la décision est fausse et la confiance aussi.

# Deux publics, deux pages

La direction et le terrain ne lisent pas la même page, même s'ils partagent les mêmes définitions.

```diagram
type: compare
title: "Direction et opérationnel : deux lectures"
columns:
  - title: Direction
    tone: violet
    items:
      - "Question : le cap est-il tenu ?"
      - Peu d'indicateurs, écart à l'objectif
      - Tendance, comparaison N-1, grandes causes
      - "Décision : arbitrer, pas traiter un ticket"
      - "Grain : mois, région, enseigne"
  - title: Opérationnel
    tone: teal
    items:
      - "Question : quoi faire aujourd'hui ?"
      - "File d'exceptions, seuils, retard"
      - Détail actionnable (magasin, produit, commande)
      - "Décision : appeler, réapprovisionner, corriger"
      - "Grain : jour, magasin, parfois l'heure"
  - title: Ce qui est commun
    tone: amber
    items:
      - Les mêmes définitions d'indicateurs
      - La même fraîcheur, dite explicitement
      - Un lien de l'un vers l'autre, pas une copie
      - Un propriétaire des chiffres
      - Pas de second calcul « maison »
```

La direction n'a pas besoin des quarante lignes de rupture. Elle a besoin de savoir que douze magasins dépassent le seuil, et lesquels pèsent. Le responsable de magasin n'a pas besoin de la marge groupe. Il a besoin de ses références en alerte et du geste attendu.

Construire « une page pour tout le monde » produit une page pour personne : trop de détail pour la direction, trop peu de contexte pour le terrain. Partagez le **modèle**, pas la **mise en page**.

# Dashboard ou rapport paginé

Le tableau de bord se consulte à l'écran, se filtre, répond à une question. Le **rapport paginé** (état destiné à l'impression ou à l'export) se feuille, se range, se transmet. Il a un en-tête, un pied, une pagination, et un rendu stable en PDF.

| | Tableau de bord | Rapport paginé |
| --- | --- | --- |
| Usage | Décider, surveiller | Archiver, justifier, diffuser un état |
| Forme | Une page interactive | Plusieurs pages, mise en page fixe |
| Lecture | Écarts et exploration | Liste complète, totaux contrôlés |
| Sortie | Écran, parfois un export court | PDF, Excel, envoi planifié |
| Exemple | Pilotage mensuel de la marge | Grand livre, relevé par magasin, pièce pour un audit |

Les deux se complètent. La page de direction montre que l'Ouest est à -3 points de marge. Le rapport paginé, en annexe, liste les écritures ou les magasins pour ceux qui doivent vérifier. Mettre le grand livre dans le tableau de bord « au cas où » détruit la page. Refuser toute annexe oblige la direction à demander un export parallèle, qui finira par contredire le chiffre officiel.

> [!WARNING]
> Un tableau de quarante colonnes exporté chaque lundi n'est pas un tableau de bord. C'est un rapport qui a perdu sa mise en page. Donnez-lui le bon format, ou il reviendra sous la forme d'un classeur non contrôlé.

```video
url: https://www.youtube.com/watch?v=t3cAUt7sOQg
title: "12 Dashboard design tips for better data visualization"
channel: "Geckoboard"
duration: "9:51"
lang: en
why: "Douze conseils concrets de conception de tableaux de bord, à confronter aux principes de ce chapitre."
```

# Exercices

## Exercice 1 : La phrase de décision

Une équipe vous envoie cette demande : « On veut un dashboard des ventes, avec les produits, les régions, les vendeurs, les marges, le stock et la météo, pour la direction et les magasins. » Réécrivez la demande en décisions séparées.

<details>
<summary>Voir la solution</summary>

La demande mélange des publics et des questions. On la découpe, par exemple :

1. **Direction, chaque lundi.** « Le mois est-il en ligne avec l'objectif de chiffre d'affaires et de marge, et quelle région explique l'écart ? » Page unique, peu d'indicateurs, tendance, top des écarts.
2. **Responsable régional, en cours de mois.** « Quels magasins sont sous l'objectif au rythme actuel ? » Liste courte, seuil, lien vers le magasin.
3. **Magasin, chaque matin.** « Quelles références sont en rupture ou en surstock aujourd'hui ? » File d'action, pas un bilan annuel.
4. **Météo.** Hors page, sauf si une décision l'utilise vraiment (prévoir du trafic). Sinon, c'est un graphique de plus.

On refuse une page unique « pour tout le monde ». On partage ensuite les définitions (chiffre d'affaires, marge, rupture) entre ces pages.

</details>

## Exercice 2 : Remettre la page dans l'ordre

Une page « Comité » affiche, de gauche à droite et dans des tailles proches : un camembert des couleurs de produits, le logo, un tableau de 200 lignes, puis en petit le chiffre d'affaires du mois et l'écart à l'objectif. La date de fraîcheur est absente. Proposez la nouvelle hiérarchie.

<details>
<summary>Voir la solution</summary>

1. **Bandeau** : titre « Mois en cours, cap tenu ou non », période, « données à jour au … », filtre région.
2. **Tête, grande** : chiffre d'affaires, marge, écart à l'objectif, petite tendance sur douze mois. C'est le verdict.
3. **Corps** : une répartition qui explique l'écart (région ou famille), pas le camembert des couleurs.
4. **Bas** : cinq à dix lignes d'exceptions (magasins ou familles les plus en dessous), avec un lien vers le détail.
5. Le tableau de 200 lignes part en rapport paginé ou en page « détail ».
6. Le logo rétrécit. Le camembert sort s'il ne change pas la décision.

En plissant les yeux, on doit voir l'écart à l'objectif, pas le camembert.

</details>

## Exercice 3 : Dashboard ou état paginé

Pour chaque demande, choisissez le format et dites pourquoi : (a) le comité veut savoir si la marge du trimestre tient, (b) l'audit veut le détail des remises par ticket sur douze mois, (c) le directeur régional veut les dix magasins à appeler cette semaine.

<details>
<summary>Voir la solution</summary>

- **(a) Tableau de bord.** Une décision, une page, écart au cap, quelques causes. L'audit n'a pas besoin d'être sur cette page.
- **(b) Rapport paginé.** Volume, mise en page stable, export, conservation. Un graphique de remises peut exister à part, mais le livrable demandé est l'état détaillé.
- **(c) Tableau de bord opérationnel**, ou une vue « exceptions » du même modèle. Dix lignes actionnables, seuil explicite, fraîcheur du jour. Pas un PDF de quarante pages à relire.

Les trois peuvent s'appuyer sur les mêmes indicateurs certifiés. Seule la restitution change.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Principes du tableau de bord
center: Une page, une décision, un public, une date de fraîcheur.
points:
  - icon: target
    title: La décision d'abord
    text: Écrire la phrase que la page doit permettre de conclure avant tout graphique.
  - icon: file
    title: Une seule page
    text: L'essentiel tient sur un écran. Le reste va dans une autre page ou une annexe.
  - icon: layers
    title: Hiérarchie
    text: Taille, position et vide montrent le verdict, puis la cause, puis l'action.
  - icon: clock
    title: Fraîcheur visible
    text: Date, heure et périmètre à côté du chiffre. Un retard se dit sur la page.
  - icon: users
    title: Deux publics
    text: La direction arbitre un écart. Le terrain traite une file d'exceptions.
  - icon: scale
    title: Deux formats
    text: Le dashboard décide à l'écran. Le rapport paginé archive et détaille.
pitfall: Une page « pour tout le monde » empile les graphiques et ne fait plus décider.
remember: Si la décision ne tient pas en une phrase, la page n'est pas prête.
```
