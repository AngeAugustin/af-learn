---
title: "Déployer le modèle sémantique"
description: "Le modèle sémantique de Ventes Halte se versionne comme le SQL. On promeut un commit, et on revient au tag précédent si une mesure a changé de sens."
duration: 40
objectives:
  - "Versionner mesures, descriptions et droits dans le même dépôt que le mart"
  - "Promouvoir un commit identique de la recette vers la production"
  - "Reconnaître qu'une mesure a changé de sens"
  - "Revenir au tag certifié précédent sans reconstruire depuis un portable"
---

# Le modèle sémantique est du code

`ca_ht`, `marge_eur`, `quantite`, `ca_n1` et `taux_marge` ne vivent pas dans la tête de Nora ni dans un fichier qu'elle aurait enregistré à part. Ils vivent dans le dépôt, à côté de `fct_ventes`, sous la forme du modèle sémantique : définitions, libellés, description du périmètre, règle de région.

Un classeur qui recopie la somme n'est pas une version. Il n'a pas de tag, pas de revue, pas de retour arrière. Le modèle, lui, se relit comme le SQL.

```yaml
metrics:
  - name: ca_ht
    label: "CA HT"
    description: "Somme hors taxes, magasins intégrés, retours négatifs conservés."
  - name: taux_marge
    label: "Taux de marge"
    description: "Somme de la marge divisée par la somme du CA, au grain de la question."
```

La syntaxe exacte dépend de l'outil (couche dbt, LookML, modèle publié). Le principe ne change pas : **un fichier, un commit, une revue**. La description fait partie du contrat. Une formule qui bouge sans que la description bouge est déjà un défaut de revue.

Le tag certifié courant s'appelle par exemple `ventes-2026.03.1`. Le catalogue affiche ce tag. Si Nora ne peut pas le lire, elle ne sait pas quel sens elle présente.

```diagram
type: flow
title: "Promouvoir un sens, ou revenir au précédent"
steps:
  - title: "Commit"
    text: "Mesures, descriptions et droits dans le même dépôt"
    tone: violet
  - title: "bi-ci"
    text: "Lint, clés, réconciliation. Rouge : on s'arrête."
    tone: blue
  - title: "Recette"
    text: "Mars retombe à 6 240 000 €. Nora relit."
    tone: teal
  - title: "Prod"
    text: "Même commit, approuvé par bi-prod-publish"
    tone: amber
  - title: "Retour"
    text: "Si le sens a bougé, on republie le tag d'avant"
    tone: rose
```

# Promouvoir le même commit

La promotion n'est pas une deuxième édition du modèle « à la main en prod ». C'est **le même commit** que la recette a validé.

Ordre tenu :

1. La demande entre sur une branche. bi-ci est vert (lint, clés, reste de réconciliation).
2. La fusion déploie ce commit en **recette**. Nora vérifie le mois témoin et, si le droit est touché, l'identité de Marie.
3. Lina ou Adam, dans `bi-prod-publish`, approuve la **prod**. Le compte `ci-bi` applique ce commit-là, pas le fichier ouvert sur un bureau.
4. Le catalogue passe au nouveau tag seulement après ce succès. Avant, l'ancien tag reste celui qu'on a le droit de citer.

Deux commits différents entre recette et prod, même « avec juste un libellé », cassent la preuve. Le libellé se corrige dans une demande, repart en recette, puis en prod. On ne l'édite pas dans l'outil le lundi à 7 h 30.

Un déploiement de performance qui ne touche pas les formules suit le même couloir. S'il change un total, il a touché le sens, quoi qu'en dise le titre de la demande.

# Quand une mesure change de sens

Le sens change quand le nombre **pour la même question** n'est plus celui du contrat. Ce n'est pas une affaire de goût.

| Changement | Sens | Qui relit avant prod |
| --- | --- | --- |
| Faute de frappe dans la description, formule intacte, mars toujours à 6 240 000 € | Non | Lina ou Adam |
| Commentaire SQL | Non | Lina ou Adam |
| Filtre `est_retour = non` ajouté | Oui, le CA passe à 6 480 000 € | Camille, puis bi-prod-publish |
| Taux de marge devenu moyenne des taux par magasin | Oui, le réseau ne vaut plus 35 % | Camille, puis bi-prod-publish |
| CA basculé en TTC | Oui | Camille, puis bi-prod-publish |
| Partition qui garde 6 240 000 € | Non | Lina ou Adam |

La demande a une case : « cette demande change le sens d'une mesure certifiée ». Cochée, elle bloque l'approbation prod tant que Camille n'a pas accepté. Décochée à tort, elle se voit en recette : le mois témoin bouge. C'est pour ça que le témoin existe. Une case vide et un CA qui bouge : on n'approuve pas, on renvoie.

`taux_marge` est le cas le plus facile à rater. 35 % sur le réseau, c'est 2 184 000 / 6 240 000. La moyenne des taux de chaque magasin donne un autre nombre, parce qu'un petit magasin pèse alors autant qu'un grand. Le visuel a l'air sage. Le sens a changé.

# Revenir en arrière

Le retour arrière est le déploiement du **tag précédent**, par le même couloir. Ce n'est pas l'inverse d'un `DROP`, bricolé à la main, ni un correctif écrit pendant que la salle attend.

Le lundi, prod affiche 6 480 000 € après une promotion de 6 h 10. Le tag d'avant est `ventes-2026.03.1`, CA 6 240 000 €. Lina enchaîne.

1. Message à Nora : ne pas présenter le nouveau chiffre, le sens des retours a bougé.
2. Approuver le redéploiement de `ventes-2026.03.1` par `ci-bi`. Pas de correctif depuis le portable.
3. Vérifier en prod que mars vaut de nouveau 6 240 000 €, et que le catalogue montre ce tag.
4. Ouvrir ensuite une demande de correction, qui repartira en recette. Le correctif n'entre pas dans la revue de ce matin.

On ne « répare en avant » pendant la réunion. Réparer en avant, c'est inventer un troisième sens devant la direction. Le tag précédent est un sens déjà certifié. Il a le défaut d'être ancien. Il a l'avantage d'être connu.

> [!IMPORTANT]
> S'il n'existe pas de tag précédent certifié, on n'a pas de retour arrière : on a seulement un espoir. On tague au moment où l'on certifie, pas le jour où l'on panique.

# Ce que le catalogue doit montrer

Après chaque promotion, la fiche Ventes Halte dit :

- le tag (`ventes-2026.03.1`) ;
- l'heure de `charge_le` ;
- le propriétaire du sens (Camille) et le propriétaire du calcul (Lina) ;
- la phrase de périmètre : HT, intégrés, retours négatifs, hors personnel ;
- si la dernière demande a changé un sens, et le lien vers cet accord.

Un catalogue qui montre « mis à jour récemment » sans tag ne permet pas le retour arrière : on ne sait pas vers quoi revenir. Le tag est la poignée. La description est la mémoire. Les deux voyagent avec le modèle, pas dans un compte rendu de réunion que personne ne rouvrira en avril.

# Exercices

## Exercice 1 : Une virgule ou un sens

Deux demandes sont ouvertes. A. Une faute dans la description de `ca_ht`, le SQL ne change pas, mars reste 6 240 000 €. B. `taux_marge` devient la moyenne des taux par magasin. Le réseau n'affiche plus 35 %. Pour chacune : est-ce un changement de sens, qui doit relire, quel chemin de promotion ?

<details>
<summary>Voir la solution</summary>

A ne change pas le sens. Lina ou Adam suffit, après bi-ci vert et un passage recette qui confirme 6 240 000 €. Camille n'a pas à signer une typo. Le même commit va en prod. Le tag avance.

B change le sens. 2 184 000 / 6 240 000 = 35 % au grain du réseau. La moyenne des magasins répond à une autre question. Camille accepte ou refuse. Ensuite seulement `bi-prod-publish`. On ne profite pas de la demande A pour y glisser B.

</details>

## Exercice 2 : Prod à 6 480 000 € à 6 h 40

La promotion de 6 h 10 a ajouté `est_retour = non`. À 6 h 40, le CA de mars en prod vaut 6 480 000 €. La revue est à 8 h. Le tag précédent `ventes-2026.03.1` valait 6 240 000 €. Décrivez le retour arrière, dans l'ordre.

<details>
<summary>Voir la solution</summary>

On prévient Nora tout de suite : ne pas présenter 6 480 000 €, les retours ont été retirés deux fois. On redéploie `ventes-2026.03.1` par le compte `ci-bi`, avec l'approbation de Lina ou d'Adam. On ne corrige pas le filtre depuis un portable pendant la revue.

On vérifie que la prod affiche de nouveau 6 240 000 € et que le catalogue montre ce tag. Le correctif du filtre est une demande nouvelle, pour un autre jour, avec Camille, parce que le sens avait bougé. On ne répare pas en avant à 7 h 50.

</details>

## Exercice 3 : Deux commits entre recette et prod

La recette a validé le commit `a1`. En prod, quelqu'un a publié le commit `b2`, « juste le libellé CA ». `a1` et `b2` ne sont pas le même objet. Pourquoi c'est un problème, et comment vous republiez ?

<details>
<summary>Voir la solution</summary>

La recette n'a pas vu `b2`. Le libellé peut cacher une formule, et même un libellé seul peut faire lire un autre sens en salle. La preuve « la recette a dit oui » ne porte plus sur ce qui est en prod.

On revient au dernier tag certifié si `b2` est déjà en prod et non relu. Puis on met le libellé dans une demande sur `a1`, on la passe en recette, on vérifie que mars est toujours 6 240 000 €, et `bi-prod-publish` promeut **ce** commit. Le catalogue affiche le nouveau tag seulement ensuite.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Déployer le sens
center: "Le modèle sémantique a un tag. On promeut le commit relu, et on revient au précédent si le sens a bougé."
points:
  - icon: git
    title: Un dépôt
    text: "Mesures, descriptions et droits à côté du SQL. Un classeur n'est pas une version."
  - icon: layers
    title: Même commit
    text: "Recette puis prod. Pas un deuxième fichier édité le lundi à 7 h 30."
  - icon: scale
    title: Sens touché
    text: "Filtre de retours, TTC, moyenne des taux. Camille signe avant la prod."
  - icon: loop
    title: Tag précédent
    text: "Retour par ci-bi. ventes-2026.03.1 rend les 6 240 000 €."
  - icon: file
    title: Catalogue
    text: "Tag, heure, deux propriétaires, phrase de périmètre. Sans tag, pas de retour."
pitfall: "Réparer en avant pendant la revue. On invente alors un troisième sens devant la direction."
remember: "Le taux à 35 % est une division de deux sommes. La moyenne des magasins est une autre mesure."
```
