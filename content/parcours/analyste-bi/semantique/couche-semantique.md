---
title: La couche sémantique
description: "Une définition unique des indicateurs, des métriques certifiées, et l'endroit où elles vivent : LookML, modèle Power BI ou métriques dbt."
duration: 45
objectives:
  - Expliquer pourquoi une définition unique évite les chiffres contradictoires
  - Situer la couche sémantique entre l'entrepôt et les outils de restitution
  - Comparer à grands traits LookML, un modèle Power BI et des métriques dbt
  - Formuler le contrat métier qu'une métrique doit tenir
---

# Une définition, partout

La couche sémantique est l'endroit où l'entreprise **nomme** ses indicateurs une seule fois : ce qu'est le chiffre d'affaires, la marge, le panier, la rupture, et avec quelles dimensions on a le droit de les croiser. Les tableaux de bord, les explorations et les extractions **demandent** ces noms. Ils ne les redéfinissent pas.

Sans cette couche, la définition voyage dans les visuels. Chaque copie dérive. Avec elle, un changement de contrat (retirer les cartes cadeau, passer en hors taxes) se fait à la source du nom, puis se propage. Le comité n'a plus à voter entre trois fichiers.

La couche ne stocke pas à elle seule l'historique des ventes. Elle **décrit** comment les lire. Les lignes restent dans l'entrepôt ou dans le modèle. Ce partage des rôles évite deux excès : tout recalculer dans l'outil de restitution, ou croire qu'une table brute « bien nommée » suffit alors que trois jointures restent possibles.

> [!IMPORTANT]
> Une colonne qui s'appelle `ca` dans une table n'est pas encore une définition. La définition dit le périmètre, le grain, l'unité et ce qui est exclu.

```video
url: https://www.youtube.com/watch?v=9eV8XHLe_fI
title: "Finally. Semantic Layer. Explained in 9 minutes."
channel: "Dawn Choo"
duration: "9:05"
lang: en
why: "Ce qu'est une couche sémantique et pourquoi elle évite plusieurs versions d'un même chiffre, en neuf minutes."
```

# Des métriques certifiées

Toutes les mesures d'un bac à sable ne sont pas des métriques de pilotage. Une **métrique certifiée** a :

- un **nom** stable, celui que la revue prononce ;
- une **formule** lisible (somme, ratio de deux sommes, pas une moyenne de moyennes cachée) ;
- un **propriétaire** métier qui répond quand le chiffre surprend ;
- un **périmètre** écrit (taxes, retours, canaux, fuseau, sociétés incluses) ;
- une **date** de dernière confirmation.

Le badge « certifié » n'est pas un décor. Il dit : vous pouvez décider avec celle-ci. Une mesure d'essai peut exister à côté, sans le badge, sous un nom qui ne prête pas à confusion (« CA brouillon promo » n'apparaît pas dans le comité).

Le ratio est le cas qui justifie le plus la couche. Le panier moyen certifié est le chiffre d'affaires divisé par le nombre de commandes **au grain de la question**. Il n'est pas la moyenne des paniers de chaque magasin, qui donnerait le même poids à un petit magasin et à un grand. Cette règle est écrite dans la métrique. Elle n'est pas laissée au soin de chaque graphique.

# Où elle vit

La couche n'est pas un produit unique. Elle vit **là où les définitions sont centrales** dans votre contexte. Trois endroits reviennent.

```diagram
type: layers
title: "Où peut vivre la définition"
layers:
  - title: "Le métier et le contrat"
    text: "Nom, périmètre, propriétaire, ce qui est hors champ"
  - title: "La couche sémantique"
    text: "LookML, modèle Power BI publié, ou métriques dbt"
  - title: "L'entrepôt"
    text: "Tables au bon grain, jointures sûres, actualisation"
  - title: "Les usages"
    text: "Pages certifiées, explorations, éventuellement une API"
```

Ce qui ne doit pas arriver : une définition dans l'entrepôt, une autre dans le modèle, une troisième dans le titre du graphique. Si les trois existent, **une** est la source, les autres s'y branchent. Sinon le mot « officiel » ne veut plus rien dire.

On choisit l'endroit selon qui consomme. Si toute l'entreprise explore dans Looker, LookML est le lieu naturel. Si le parc est Power BI, le modèle publié joue ce rôle, à condition qu'il n'en existe qu'un. Si plusieurs outils doivent partager les mêmes noms (un tableau de bord, un notebook, un export), une couche en amont des outils, comme des métriques dbt, évite de couronner un seul logiciel.

# Trois maisons, même idée

**LookML** (vu au chapitre précédent) écrit vues, explores et mesures dans des fichiers relus avec Git. Le métier explore sans réécrire le SQL. La jointure autorisée fait partie de la définition.

**Le modèle Power BI** publié est une couche sémantique quand il est **le** jeu partagé : étoile, mesures, descriptions, sécurité des lignes, actualisation. Il cesse de l'être dès que chaque auteur en télécharge une copie. Les pages se branchent sur le jeu. Elles n'emportent pas les formules.

**Les métriques dbt** (aperçu, sans faire ici un cours d'ingénierie) décrivent des mesures au-dessus des modèles de l'entrepôt : une mesure `ca_ht`, une métrique qui la nomme, un ratio panier qui divise deux mesures. L'outil de restitution, quel qu'il soit, interroge ces métriques au lieu de poser son propre SQL. L'intérêt est le partage **entre** outils. Le coût est la discipline : il faut vraiment les consommer, pas les redéfinir à côté « le temps de la maquette ».

| Maison | Elle brille quand... | Elle se vide si... |
| --- | --- | --- |
| LookML | L'exploration est le geste quotidien | Chacun exporte et resomme ailleurs |
| Modèle Power BI | Le parc de rapports est Power BI | Les fichiers .pbix locaux divergent |
| Métriques dbt | Plusieurs outils doivent partager les noms | Elles ne sont le contrat d'aucun outil |

Aucune des trois ne dispense du contrat métier. Un fichier LookML faux, une mesure DAX fausse et une métrique dbt fausse sont trois façons d'être officiellement dans l'erreur. La certification porte sur le contenu, pas sur le logo de l'outil.

# Le contrat avec le métier

Le contrat est court, et il est écrit à côté de la métrique. Il répond à des questions que la formule seule ne tranche pas.

- **Quoi.** Chiffre d'affaires HT, retours déduits, hors ventes internes et hors cartes cadeau.
- **Quand.** Date de facture, fuseau Europe/Paris, une journée close à minuit.
- **Grain.** Additive au mois, au magasin, au canal. Le panier n'est pas additif : on ne somme pas des paniers.
- **Qui répond.** La finance pour le périmètre, l'analyste BI pour la mise en œuvre, un nom plutôt qu'une boîte mail morte.
- **Quoi de neuf.** Depuis quand cette version tient, et où lire la précédente.

On fait relire ce texte par la personne qui défendra le chiffre en comité. Si elle ne le reconnaît pas, la métrique n'est pas prête, même si le SQL est élégant.

Le contrat inclut aussi les **refus** : ce que la métrique ne dira pas. « Cette marge n'est pas la marge comptable publiée, elle sert le pilotage commercial hebdomadaire. » Cette phrase évite qu'un auditeur et un directeur commercial se disputent un écart de définition.

> [!TIP]
> Rangez le contrat dans la description de la métrique, pas seulement dans une présentation. La présentation se perd. La description voyage avec le chiffre.

# Ce qu'elle ne fait pas

La couche sémantique ne choisit pas à votre place le bon visuel, ni le public de la page, ni l'heure de la revue. Elle ne rend pas juste un total si l'entrepôt en amont est faux. Elle ne remplace pas la sécurité : une métrique bien définie peut quand même montrer toutes les régions à quelqu'un qui ne devrait en voir qu'une, si les droits sont ailleurs.

Elle ne dispense pas non plus d'un **contrôle de bout en bout**. Chaque métrique certifiée a un chiffre de référence sur un mois connu. Si `ca_ht` de mars ne tombe pas sur le total convenu avec la finance, on ne discute pas de la couleur du graphique. On rouvre le contrat ou le chargement.

Enfin, elle n'empêche pas un essai. Elle empêche l'essai de se faire passer pour la source. Le bac à sable reste utile le mercredi. Le comité du lundi n'y puise pas.

# Exercices

## Exercice 1 : Colonne ou métrique

Une table `ventes` a une colonne `montant`. Trois rapports la somment. L'un retire les retours dans un filtre de page, l'autre non, le troisième est en TTC parce qu'il a pris `montant_ttc` « en attendant ». A-t-on une couche sémantique ? Que manque-t-il pour en avoir une sur le chiffre d'affaires ?

<details>
<summary>Voir la solution</summary>

Non. On a une colonne, et trois lectures. Il manque une **métrique nommée** (par exemple CA HT), dont la formule inclut la règle des retours et l'exclusion du TTC, une description de périmètre, un propriétaire, et l'obligation pour les trois rapports de l'utiliser.

Le filtre de page « hors retours » n'est pas une définition : il peut être retiré. La colonne `montant_ttc` ne doit plus être le chemin par défaut. On la garde seulement si un usage TTC est assumé et nommé autrement.

Contrôle : les trois rapports, sur mars, affichent le même CA HT que le total de référence.

</details>

## Exercice 2 : Où la poser

L'entreprise a vingt rapports Power BI copiés, plus deux explorations Looker bricolées, plus un notebook qui réécrit le SQL du panier. La finance veut **un** chiffre. On hésite entre « on choisit Power BI et on interdit le reste » et « on pose des métriques en amont ». Quels critères utilisent-vous ?

<details>
<summary>Voir la solution</summary>

On regarde **qui doit consommer** la définition dans six mois. Si la décision est vraiment de tout ramener à Power BI, le modèle publié unique peut être la couche : on supprime les copies, Looker et le notebook s'arrêtent ou s'y connectent s'ils le peuvent. Le critère de succès est l'absence de second fichier.

Si plusieurs outils restent légitimes (exploration, rapport, notebook), une définition **en amont** (métriques dbt ou équivalent) évite de couronner un logiciel tout en laissant les autres diverger. Chaque outil doit interroger ces métriques, pas les réécrire.

Dans les deux cas, le contrat finance est le même, et un total de mars sert de juge. Interdire un outil sans offrir le chiffre officiel dedans pousse aux exports parallèles.

</details>

## Exercice 3 : Un contrat qui se lit en comité

Écrivez le contrat de la métrique « panier moyen », en cinq lignes maximum, pour une enseigne qui pilote en HT, retours déduits, date de ticket, fuseau de Paris, et qui ne veut pas de moyenne de paniers magasins.

<details>
<summary>Voir la solution</summary>

Panier moyen : chiffre d'affaires HT (retours déduits, hors ventes internes) divisé par le nombre distinct de tickets. Date de ticket, journée close à minuit, fuseau Europe/Paris. Le ratio se calcule au grain de la question (mois, région, magasin), jamais comme moyenne des paniers d'un niveau plus fin. Non additif : on n'additionne pas les paniers. Propriétaire métier : finance commerciale. Ce n'est pas un indicateur comptable publié, c'est le panier de pilotage.

Ce texte va dans la description de la métrique. La formule technique ne le remplace pas.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: La couche sémantique
center: Un nom, une formule, un propriétaire. Les outils consomment la définition, ils ne la recopient pas.
points:
  - icon: book
    title: Le contrat
    text: Périmètre, grain, unité, fuseau, et ce que la métrique ne prétend pas être.
  - icon: check
    title: Certifiée
    text: Le badge désigne le chiffre de décision. L'essai reste nommé comme un essai.
  - icon: layers
    title: Où elle vit
    text: LookML, modèle Power BI publié, ou métriques dbt si plusieurs outils partagent.
  - icon: scale
    title: Ratios
    text: Le panier divise des sommes au grain demandé. Pas une moyenne de moyennes.
  - icon: alert
    title: Une source
    text: Si trois endroits définissent le CA, aucun n'est vraiment officiel.
pitfall: Une colonne nommée ca n'est pas une définition tant que le périmètre n'est pas écrit.
remember: Le comité ne tranche pas entre des fichiers. Il lit une métrique qu'il a reconnue.
```
