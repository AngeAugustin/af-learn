---
title: "Le modèle sémantique au-dessus du mart"
description: "Tenir une seule définition de CA au-dessus de fct_ventes, la loger dans le modèle partagé, et la laisser au BI Engineer."
duration: 60
objectives:
  - "Expliquer pourquoi le mart ne suffit pas à définir le CA"
  - "Situer la définition dans le modèle Power BI, LookML ou une metric layer"
  - "Garder la propriété de cette couche côté BI Engineer"
  - "Laisser l'analyste consommer la définition sans la recopier"
---

# Une définition au-dessus du mart

`fct_ventes` est juste : une ligne de ticket, `montant_ht_signe` en euros HT, retours négatifs, ventes internes déjà sorties. Sommer cette colonne donne le CA. Pourtant trois rapports peuvent encore afficher trois CA.

L'un retire les magasins fermés dans un filtre qu'il est seul à poser. L'autre ajoute une colonne TTC « en attendant ». Le troisième exporte le détail et resomme dans un classeur, avec un arrondi et un magasin oublié. Le mart n'a pas bougé. Les définitions, si.

La **couche sémantique** est l'étage au-dessus du mart où le CA HT est nommé une fois : la mesure, son périmètre, les dimensions avec lesquelles on a le droit de la croiser. Les pages demandent ce nom. Elles ne réécrivent pas la somme.

Vous ne stockez pas une deuxième copie des tickets dans cette couche. Vous décrivez comment les lire. Le stockage reste `fct_ventes` et `dim_magasins`. Sans cet étage, chaque auteur de rapport devient propriétaire d'une variante.

```diagram
type: layers
title: "Où s'arrête le mart"
layers:
  - title: "Pages"
    text: "Filtres de revue, visuels. Aucune formule de CA."
  - title: "Couche sémantique"
    text: "Une mesure CA HT, des dimensions, la sécurité des lignes."
  - title: "Mart"
    text: "fct_ventes et dim_magasins, grain et colonnes déjà tenus."
  - title: "dbt en amont"
    text: "Signe, périmètre, tests, descriptions de colonnes."
```

# Une mesure, pas trois sommes

La mesure s'appuie sur la colonne, elle ne la remplace pas. Le contrat de `montant_ht_signe` reste vrai. La mesure ajoute ce que la colonne ne peut pas empêcher : le geste de la sommer autrement.

Dans un modèle Power BI publié, la mesure est le point d'entrée.

```dax
CA HT = SUM ( fct_ventes[montant_ht_signe] )
```

Dans LookML, la mesure vit dans la vue, pas dans chaque explore bricolée.

```lookml
measure: ca_ht {
  type: sum
  sql: ${montant_ht_signe} ;;
  description: "CA HT magasins, retours déduits, hors ventes internes."
  value_format: "#,##0.00 €"
}
```

Dans une metric layer (couche de métriques au-dessus des modèles dbt), le même nom est déclaré une fois et interrogé par plusieurs outils.

```yaml
metrics:
  - name: ca_ht
    label: "CA HT"
    type: simple
    type_params:
      measure: montant_ht_signe
```

Les trois écritures disent la même chose. Une seule est la source dans votre contexte. Les autres outils s'y branchent. Si Power BI, Looker et un notebook additionnent chacun `montant_ht_signe` avec un filtre en plus, vous avez trois couches, donc aucune.

Le périmètre qui reste dans la mesure, et pas seulement dans la doc dbt : ce que l'analyste ne doit pas re-filtrer (les retours), et le nom stable que la revue prononce. Une exclusion nouvelle (le canal atelier) se fait dans dbt, puis la description de la mesure suit. On ne l'ajoute pas comme filtre par défaut d'une page.

# Où elle vit

La couche vit là où les définitions sont centrales, dans l'outil que les rapports consomment vraiment.

| Maison | Elle est la couche quand... | Elle ne l'est plus quand... |
| --- | --- | --- |
| Modèle Power BI | Un jeu publié unique porte l'étoile, les mesures et les rôles | Chaque auteur enregistre un .pbix local |
| LookML | Les explores lisent les mesures versionnées | On exporte et on resomme dans un tableur |
| Metric layer | Plusieurs outils interrogent les mêmes noms | Un outil « fait plus vite » sa propre somme |

Halte peut très bien n'avoir qu'une de ces maisons. Le critère n'est pas d'en collectionner trois. Le critère est qu'un changement de CA se fasse à un endroit, et que la revue du lundi lise cet endroit.

Le modèle sémantique n'est pas la page. Une page filtrée sur mars, région Nord, est un usage. Le CA HT reste la même mesure. Changer le titre du visuel ne change pas la définition. Changer la mesure, si.

> [!IMPORTANT]
> Le fichier de slides n'est pas une maison possible. Une somme recopiée dans une présentation se fige le jour de la copie. Le lundi suivant, elle ment sans passer au rouge.

# Le BI Engineer la possède

La couche a un propriétaire technique : vous. Le propriétaire métier du chiffre reste la finance, celle qui signe le périmètre. Vous traduisez ce périmètre dans le modèle, vous le testez, vous le déployez. L'analyste ne fork pas le jeu pour « ajuster le CA de sa région ».

Concrètement, la propriété se voit.

- Le modèle est dans un dépôt, pas seulement sur le poste de la personne qui l'a créé.
- Une mesure nouvelle passe par une revue, comme un modèle dbt.
- Les rapports se connectent au jeu publié. Ils n'embarquent pas une copie des formules.
- Un .pbix envoyé par mail n'est pas une source. S'il circule, vous le retirez du circuit de la revue.

L'analyste demande une coupe ou une mesure manquante. Vous l'ajoutez au modèle, au bon nom, ou vous expliquez pourquoi elle existe déjà sous un autre nom. Vous ne lui répondez pas par une capture d'écran chiffrée à coller dans le comité. Ce serait vous substituer à lui, et laisser la définition dans l'image.

La doc de colonne dbt et la description de la mesure disent la même règle. Si elles divergent, le modèle sémantique a pris de l'avance, ou dbt a changé sans prévenir. Vous alignez les deux avant la revue, pas pendant.

# Ce que l'analyste consomme

Il ouvre un rapport branché sur le modèle. Il filtre le mois, la région, le magasin. Il lit `CA HT`. Il ne crée pas `CA HT v2`, ni une colonne calculée qui resomme le détail « pour vérifier ».

S'il doute du chiffre, le chemin est le test de réconciliation et la description, pas une quatrième formule. S'il a besoin des ventes brutes avant retours, ce besoin est une mesure nommée autrement, que vous ajoutez. Deux noms, deux définitions. Jamais un seul nom pour les deux.

Votre livrable de ce chapitre est le modèle partagé : mesures, dimensions autorisées, description à jour. Le livrable de l'analyste commence au-dessus : quelle page, quel public, quelle décision du lundi. Les deux métiers se touchent sur le nom du CA. Ils ne s'échangent pas les livrables.

# Exercices

## Exercice 1 : Le mart suffit-il ?

`fct_ventes` est testé, `montant_ht_signe` est décrit. Trois rapports somment cette colonne. Le premier exclut les magasins ouverts depuis moins de six mois, le deuxième est parti d'un export, le troisième a ajouté la TVA « parce que le directeur la demande ». A-t-on une couche sémantique ? Que mettez-vous en place pour le CA HT ?

<details>
<summary>Voir la solution</summary>

Non. On a une colonne juste, et trois lectures. La couche manque : une mesure nommée `CA HT`, dans un modèle publié unique, dont la formule est `SUM` de `montant_ht_signe`, avec la description déjà tenue dans dbt (HT, retours signés, hors internes).

L'ancienneté du magasin est un filtre d'usage, pas une variante de CA. La TVA est une autre mesure, si la finance la veut, avec un autre nom. L'export cesse d'être une source : le classeur se rebranche sur la mesure, ou il sort du circuit de la revue.

</details>

## Exercice 2 : Quelle maison

Vingt fichiers Power BI locaux resomment le CA. Deux explores Looker refont la jointure. La finance veut un chiffre. Le parc réel des revues est Power BI, et la direction accepte d'arrêter Looker. Où posez-vous la définition, et qu'est-ce qui prouvera qu'elle est unique ?

<details>
<summary>Voir la solution</summary>

La maison est un modèle Power BI publié, un seul jeu, mesures et étoile dedans. Les pages s'y connectent. Les .pbix locaux qui portent leur propre somme sortent de la revue.

Looker s'arrête, puisque la décision est prise. Le garder « au cas où » sans le brancher sur la même définition recrée un deuxième CA. Si, plus tard, un deuxième outil doit rester, la définition montera dans une metric layer, et Power BI la consommera au lieu de la réécrire.

La preuve : un mois de contrôle finance, lu dans le modèle publié, colle au rapprochement dbt. Un rapport qui ne peut pas afficher un autre CA sans créer une mesure locale a encore du travail : cette mesure locale ne doit pas exister.

</details>

## Exercice 3 : Qui change le canal atelier

La finance exclut le canal atelier. Un analyste propose de poser le filtre sur sa page et d'envoyer la capture au comité. Un autre duplique le .pbix et modifie la mesure chez lui. Que faites-vous, et que ne livrez-vous pas ?

<details>
<summary>Voir la solution</summary>

Le périmètre bouge dans `int_ventes__perimetre`, avec reconstruction de `fct_ventes` si le modèle est incrémental, test de réconciliation, description de colonne et description de la mesure `CA HT` mises à jour. Tous les rapports branchés suivent, sans filtre de page.

Vous ne livrez pas la capture, ni un .pbix modifié en local. Le filtre de page ne concerne que ce rapport, et il s'enlève. La copie locale est une deuxième définition. L'analyste, lui, met à jour la lecture du lundi (le commentaire, la page), sur le chiffre qui a changé pour tout le monde en même temps.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Une définition de CA"
center: "Le mart tient la colonne. La couche sémantique tient le nom CA HT, et les rapports ne font que le demander."
points:
  - icon: layers
    title: "Au-dessus du mart"
    text: "La mesure empêche trois sommes locales sur une colonne pourtant juste."
  - icon: book
    title: "Une maison"
    text: "Modèle Power BI publié, LookML, ou metric layer si plusieurs outils lisent."
  - icon: tool
    title: "Vous la tenez"
    text: "Dépôt, revue, jeu publié. La finance signe le périmètre, vous le codez."
  - icon: users
    title: "L'analyste lit"
    text: "Il filtre le mois et la région. Il ne crée pas un CA HT v2."
  - icon: alert
    title: "Pas une image"
    text: "Une capture ou un .pbix envoyé par mail figent un chiffre déjà périmé."
pitfall: "Une colonne bien décrite ne protège pas contre un filtre ou un export qui redéfinit le CA."
remember: "Un seul nom, dans le modèle que vous publiez. La page du lundi s'y branche."
```
