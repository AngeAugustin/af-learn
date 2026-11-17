---
title: Règles de gestion
description: "Écrire la règle de température en si / alors, la vérifier sur des degrés, nommer l'exception et le propriétaire qui peut la changer."
duration: 60
objectives:
  - Formuler REG-01 en si / alors, sans « un peu mou »
  - Vérifier la règle sur -16 °C, sur -19 °C et sur un frais
  - Écrire l'exception de la sonde inutilisable sans ouvrir un seuil local
  - Nommer Jonas comme propriétaire, et Amina seulement si le réseau se divise
---

# Une règle que l'on peut appliquer

Le processus dit que la décision est tracée. Il ne dit pas quel degré fait refuser. Cette réponse, la même dans les quarante magasins, est une **règle de gestion**. Jonas en porte déjà le texte au siège. Neuf magasins, dont Rouen, pratiquent autre chose. Votre travail n'est pas d'adoucir le degré pour que tout le monde ait l'air d'accord.

Une règle tient en **si / alors**. Le « si » se mesure. Le « alors » se constate.

**REG-01. Si la température à cœur d'un surgelé dépasse -18 °C, alors la palette est refusée : quantité acceptée à zéro, motif température, pas de mise en chambre.**

**Si la température est égale ou plus froide que -18 °C, alors la règle température ne refuse pas.** Le reste du contrôle (casse, manquant) peut encore refuser. La règle ne dit pas « tout surgelé froid est bon à tout ».

Dépasser -18 °C, ici, veut dire plus chaud : -16 °C dépasse, -19 °C ne dépasse pas. Vous l'écrivez, parce que « au-dessus » se lit parfois à l'envers sur un quai pressé.

La règle voisine ne se mélange pas à celle-ci. **REG-02** : si un frais a moins de 2 jours de vie restante, alors il ne va pas en rayon. Un yaourt et une palette de surgelé ne se jugent pas avec le même si.

# L'exemple chiffré

Le lundi observé à Rouen : deux palettes de surgelé, température à cœur **-16 °C**.

-16 est plus chaud que -18. Le « si » est vrai. Le « alors » : refus, quantité acceptée zéro, motif température. Elles ne partent pas en chambre. « Un peu mou » n'est pas une application de la règle. C'est son contournement.

Deuxième mesure, pour que le seuil ne soit pas décoratif. Une palette à **-19 °C**, pas de casse, présente sur le bon. -19 ne dépasse pas -18. REG-01 ne refuse pas. La décision peut être acceptée, si rien d'autre ne s'y oppose.

Troisième cas, pour ne pas tout faire porter à REG-01. Un frais avec **1 jour** de vie restante. REG-01 ne s'applique pas : ce n'est pas un surgelé. REG-02 s'applique : pas de rayon. Le mettre en rayon « parce que l'aspect est bon », c'est la pratique constatée à Rouen, pas la règle.

Si vous n'avez que l'exemple au-dessus du seuil, personne ne sait ce que -19 °C devient. Les deux températures font partie de REG-01. Elles voyagent avec elle jusqu'à l'atelier et jusqu'au cas.

```diagram
type: decision
title: Refuser le surgelé, ou non
nodes:
  - question: "Est-ce un surgelé, avec une température à cœur lue ?"
    yes: "Comparer cette température à -18 °C."
    no: "REG-01 ne s'applique pas. Un frais se juge avec REG-02, pas avec ce degré."
  - question: "La température dépasse-t-elle -18 °C (plus chaud, comme -16 °C) ?"
    yes: "Refus. Quantité acceptée zéro, motif température, pas de chambre."
    no: "REG-01 ne refuse pas. Le contrôle casse et manquant continue."
```

# L'exception qui ne réécrit pas le degré

Une exception est un cas nommé, où le « alors » change **pour une raison écrite**. Elle ne dit pas « sauf bon sens », et elle ne dit pas « sauf à Rouen ».

**Exception mesure impossible.** Si la sonde ne donne pas de température à cœur, alors la palette surgelée est mise de côté. Elle ne part pas en chambre. On n'écrit pas « un peu mou » à la place du chiffre. On ne devine pas -18 °C.

La marque de la sonde reste hors photo, tant que la mesure à cœur est possible. L'exception commence quand la mesure ne sort pas, pas quand l'appareil est d'une autre couleur.

Cette exception ne donne pas à Yassine le droit de passer le seuil à -15 °C « le temps que la sonde revienne ». Elle ne donne pas aux neuf magasins un seuil officiel. Neuf pratiques à -15 °C sont une divergence, déjà dans la photo. Ce n'est pas une exception écrite. En faire une, c'est graver l'écart au lieu de le trancher.

Vous écrivez l'exception à côté de REG-01, pas dans une note que Rouen appliquera et qu'un magasin au terminal ne verra pas.

> [!IMPORTANT]
> Mettre en chambre sans chiffre, c'est appliquer « un peu mou ». L'exception dit l'inverse : sans mesure, on ne met pas en chambre.

# Le propriétaire

La règle a un **propriétaire** : celui qui peut changer le degré, et qui répond quand deux magasins ne l'appliquent pas pareil. C'est **Jonas Keller**. Le délai et l'écart de stock sont déjà à son nom. REG-01 aussi.

Yassine mesure. Il n'invente pas -15 °C les lundis lourds. Pauline voit le stock. Elle ne « fait tomber » un surgelé refusé pour que la journée se ferme. Marc Esteban peut dire que l'Ouest ne jettera pas à -16 °C. Il ne raye pas la fiche. Il expose la conséquence à Amina.

**Amina Sorel** tranche seulement si la règle divise le réseau. C'est le cas des neuf magasins. Elle ne rédige pas le degré à la place de Jonas. Elle dit si les quarante suivent une seule règle, ou si elle accepte deux règles, en sachant que Nina ne pourra pas jouer un seul cas. Tant qu'elle n'a pas daté une autre décision, -18 °C reste.

| | |
| --- | --- |
| Règle | Si le surgelé dépasse -18 °C à cœur, alors refus, accepté à zéro, motif température. |
| Exemples | -16 °C : refus. -19 °C : REG-01 ne refuse pas. |
| Voisine | REG-02, frais sous 2 jours : pas le même si, pas le rayon. |
| Exception | Sonde sans mesure : mise de côté, pas de chambre, pas de degré inventé. |
| Propriétaire | Jonas. Amina seulement si les quarante ne doivent plus avoir la même règle. |

Sans date sur un changement, la fiche du tiroir et la pratique de Rouen coexistent, et chacune se dit officielle.

```video
url: https://www.youtube.com/watch?v=O0xcKqnBPx8
title: "What are Business Rules?"
channel: "IBM Technology"
duration: "13:59"
lang: en
why: "Ce qu'est une règle de gestion et comment la séparer du reste, par IBM Technology."
```

# Ce qui n'est pas une règle

« Être plus rigoureux sur le surgelé » ne se mesure pas à 6 h.

« Refuser si possible » rend le « alors » facultatif. Le magasin chargé prendra l'exception. Le magasin calme prendra -18 °C. Vous chassez déjà ce mot.

« Le terminal gérera » n'est pas une règle. Quai pourra appliquer la phrase dans 21 magasins. Il ne choisit pas le degré. Les 7 au papier doivent pouvoir l'appliquer sur la feuille. Si la phrase n'existe pas, Sarah n'a rien à inscrire, et chaque carnet garde son seuil.

Une règle n'est pas non plus le parcours de Yassine. Lui lit la sonde et écrit l'issue. Le « alors » se constate sur la palette : en chambre, ou non. Vous vérifiez au quai et dans la trace, pas dans une réunion où tout le monde hoche la tête sur « la qualité ».

> [!WARNING]
> Neuf seuils locaux ne font pas une règle souple. Ils font un cas que Nina ne peut pas jouer une seule fois pour les quarante magasins.

# Exercices

## Exercice 1 : Écrire le si / alors

Jonas dit : « Il faut qu'on soit sérieux sur le surgelé, sans jeter pour un rien. » Le siège a déjà -18 °C. Rédigez REG-01 en si / alors, avec ce que « dépasse » veut dire.

<details>
<summary>Voir la solution</summary>

Si la température à cœur d'un surgelé dépasse -18 °C, c'est-à-dire si elle est plus chaude (par exemple -16 °C), alors la palette est refusée : quantité acceptée à zéro, motif température, pas de mise en chambre.

Si la température est de -18 °C ou plus froide, REG-01 ne refuse pas. Un autre motif peut encore refuser.

« Être sérieux » et « pour un rien » ne restent pas. -18 °C est le fait. Le refus hors chambre est la conséquence. Vous ne remplacez pas le degré par -15 °C pour faire la paix avec neuf magasins : ce serait une autre règle, à dater par Amina.

</details>

## Exercice 2 : Trois mesures

Appliquez la bonne règle. A. Surgelé à -16 °C. B. Surgelé à -19 °C, sans casse, sur le bon. C. Frais avec 1 jour de vie restante, aspect correct. Dites l'issue de chacune.

<details>
<summary>Voir la solution</summary>

A. REG-01 : -16 °C dépasse -18 °C. Refus, accepté à zéro, motif température, pas de chambre. « Un peu mou » est le contournement, pas l'issue.

B. REG-01 ne refuse pas. La palette peut être acceptée si le reste du contrôle est bon. Vous ne la refusez pas « par précaution » sans une autre règle.

C. REG-01 ne s'applique pas. REG-02 : moins de 2 jours, pas de rayon, même si l'aspect est bon. C'est précisément la pratique que la photo a vue à Rouen, et que la règle ne reprend pas.

</details>

## Exercice 3 : Qui change le degré

Marc veut -15 °C pour l'Ouest, « sinon on jette trop ». Yassine, le lundi, a une sonde qui n'affiche rien. Qui tranche le degré, et que fait Yassine en attendant ?

<details>
<summary>Voir la solution</summary>

Jonas est propriétaire du degré. Marc expose l'effet. Amina tranche seulement si le réseau ne doit plus avoir une seule règle. En attendant une décision datée, -18 °C reste, y compris à Rouen.

La sonde muette n'est pas un nouveau seuil. Exception : mise de côté, pas de chambre, pas de -18 °C inventé, pas de -15 °C « en attendant ». Yassine n'écrit pas « un peu mou ». Il n'applique pas le souhait de Marc à la place d'Amina.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: La règle et son propriétaire
center: "Si le surgelé est plus chaud que -18 °C, alors refus. -16 °C refuse, -19 °C non. Jonas tient le degré."
points:
  - icon: scale
    title: Si / alors
    text: "Un degré lu à cœur, une palette qui ne part pas en chambre. « Un peu mou » n'est pas le alors."
  - icon: gauge
    title: "-16 et -19"
    text: "-16 °C dépasse -18 °C : refus, accepté à zéro. -19 °C : REG-01 ne refuse pas."
  - icon: alert
    title: Sonde muette
    text: "Sans mesure, mise de côté. On ne devine pas le degré, on ne met pas en chambre."
  - icon: filter
    title: Pas REG-02
    text: "Le frais sous 2 jours ne se juge pas en degrés. Une règle, un si."
  - icon: key
    title: Propriétaire
    text: "Jonas change le degré. Amina seulement si les quarante ne suivent plus la même règle."
pitfall: "Appeler « exception » les neuf magasins à -15 °C. C'est une divergence, pas une règle écrite."
remember: "Sans propriétaire, Rouen garde -16 °C en chambre et un autre magasin refuse. Nina ne peut plus jouer."
```
