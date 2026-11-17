---
title: "Intégration continue des modèles BI"
description: "Chaque changement de modèle relance les tests dbt et le lint SQL. Une clé en double interdit le merge. Le contrôle vert est la seule porte vers main."
duration: 40
objectives:
  - "Faire tourner tests dbt et lint SQL à chaque changement de modèle"
  - "Distinguer un test de clé bloquant et un test de plausibilité en avertissement"
  - "Empêcher le merge quand unique ou not_null échoue"
  - "Garder la réconciliation du CA dans le même passage obligatoire"
---

# Un changement de modèle ne part pas seul

Lina modifie `fct_ventes` le jeudi. Nora présente le lundi. Entre les deux, le seul chemin vers `main` est un contrôle automatique. Un correctif appliqué depuis un portable, même « petit », même « pour le comité », n'est pas un déploiement. C'est un chiffre sans témoin.

Le passage s'appelle **bi-ci**. Il se lance à chaque demande de fusion qui touche un modèle, un test ou la couche sémantique. Il fait trois choses, dans cet ordre : lint SQL, `dbt build` sur ce qui a changé et sur ce qui en dépend, puis le statut du contrôle. `main` est protégée. Tant que bi-ci est rouge, le bouton de fusion ne fait rien.

On ne reconstruit pas les 42 magasins sur dix ans à chaque virgule. On sélectionne le modèle modifié et sa descendance, en s'appuyant sur l'état déjà construit :

```bash
sqlfluff lint models/
dbt build --select state:modified+ --defer --state ./prod-artifacts
```

`state:modified+` prend la modification et ce qui est en aval (le mart, le test de réconciliation, la métrique qui somme `montant_ht`). `--defer` réutilise les tables amont déjà bonnes. Le contrôle reste assez court pour qu'on l'attende, assez large pour qu'une clé cassée en staging se voie dans `fct_ventes`.

```diagram
type: pipeline
title: "Le passage obligatoire avant main"
lanes:
  - title: "bi-ci"
    steps:
      - title: "Lint SQL"
        text: "sqlfluff sur models/. Une virgule cassée arrête là."
        tone: violet
      - title: "Build dbt"
        text: "Modèle modifié, descendance, tests du graphe."
        tone: blue
      - title: "Clés en erreur"
        text: "unique et not_null rouges : merge interdit."
        tone: rose
      - title: "Avertissement"
        text: "Un bond de CA se note. Il ne bloque pas seul."
        tone: amber
      - title: "main"
        text: "Uniquement si le contrôle est vert."
        tone: teal
```

# Les tests dbt qui bloquent

Tous les tests ne protègent pas la même chose. Une **clé** identifie une ligne. Si elle est nulle ou en double, les sommes du lundi comptent deux fois un ticket ou perdent un magasin. Ces tests sont en **erreur**. Leur échec fait échouer `dbt build`, donc bi-ci, donc le merge.

| Test | Sur quoi, chez Halte | Sévérité | Si ça casse |
| --- | --- | --- | --- |
| `not_null`, `unique` | `fct_ventes.ligne_id`, `dim_magasin.magasin_id` | erreur | Merge interdit |
| `relationships` | `magasin_id` du fait vers `dim_magasin` | erreur | Merge interdit |
| Réconciliation | Reste inexpliqué du CA de mars | erreur | Merge interdit |
| Plausibilité | CA du jour qui bondit de 80 % | avertissement | Visible, ne bloque pas seul |

La clé s'écrit avec la sévérité, pour que personne ne la passe en avertissement « le temps du comité » :

```yaml
columns:
  - name: ligne_id
    tests:
      - not_null:
          config:
            severity: error
      - unique:
          config:
            severity: error
```

Le test de réconciliation du chapitre précédent est dans le même sac : un reste au-dessus de 5 000 € ou de 0,5 % est une erreur, pas un commentaire. Le bond de CA d'un jour férié peut être un avertissement : il demande un regard, il ne doit pas empêcher de corriger une faute de frappe. L'inverse est faux. On ne reclasse pas `unique` en avertissement parce que la revue approche.

# Le lint SQL dans le même pipeline

`sqlfluff` lit les modèles avant que dbt ne les exécute. Il attrape la virgule orpheline, le mot-clé collé, l'alias illisible, la règle de style du dépôt. Il ne sait pas qu'un `ligne_id` est en double. Ce n'est pas son métier. Les tests dbt ne savent pas qu'une mise en forme va rendre la prochaine relecture fausse. Ce n'est pas le leur.

Les deux sont **bloquants**. Une demande qui ne passe pas le lint ne part pas en revue humaine. On ne discute pas du sens d'une mesure sur un diff que personne ne peut lire. La configuration (règles, dialecte de l'entrepôt) est dans le dépôt, à côté des modèles. Changer une règle de lint est une demande comme une autre, pas un fichier local sur le poste de Lina.

> [!TIP]
> Le lint échoue vite. Autant qu'il échoue avant le build : une heure d'entrepôt pour découvrir une virgule est une heure volée au test de clé.

# Interdire le merge si une clé casse

L'interdiction n'est pas une consigne dans un canal. C'est un réglage de la forge.

- Personne ne pousse directement sur `main`.
- bi-ci est un contrôle **obligatoire**.
- Un test `unique` ou `not_null` en erreur rend le contrôle rouge.
- Le bouton de fusion reste inactif tant que le rouge est là.
- Relancer le même commit sans rien changer ne constitue pas une correction. On lit la ligne en double, on la dédoublonne dans le modèle, on pousse un nouveau commit.

Le cas du jeudi : `ligne_id` sort en double sur 40 tickets, parce qu'une jointure au référentiel magasin a multiplié les lignes. Le tableau de Nora « s'ouvre encore ». Les totaux, eux, sont faux. Ouvrir un visuel ne prouve pas une clé. Lina ne fusionne pas « pour débloquer le lundi ». Elle corrige la jointure. Si le lundi arrive avant la correction, Nora présente le **dernier tag certifié**, pas la branche rouge.

Un contournement (admin qui force le merge, `--no-verify` local, build prod depuis un portable) est un incident, au même titre qu'un reste de réconciliation. On le note. On ne le transforme pas en habitude de veille de comité.

# Ce que la CI ne prouve pas

Un contrôle vert prouve que les tests écrits ont passé sur le périmètre sélectionné. Il ne prouve pas que la règle du CA est la bonne règle. Si le test de réconciliation compare le mart à lui-même, il sera vert et inutile. La valeur attendue vient de la finance (6 258 000 €) et des lignes expliquées (15 000 € et 3 000 €), pas d'une copie du mart.

Il ne prouve pas non plus la fraîcheur du lundi 7 h : bi-ci tourne au moment du changement, le chargement de nuit tourne plus tard. Il ne prouve pas que Marie ne voit que l'Ouest : ce contrôle-là est un test de droit, sur des identités, pas un `unique`. Il ne remplace pas la relecture de Camille quand une mesure **change de sens**. Le pipeline peut être vert sur une formule nouvelle et fausse, si aucun test n'encode l'ancienne valeur.

On ajoute donc un test quand une erreur a déjà coûté un comité, et on garde les clés en erreur quoi qu'il arrive. On ne couvre pas le modèle de tests d'avertissement pour afficher un compteur. Un avertissement que tout le monde ignore est un bruit. Une clé que l'on peut contourner n'est plus une clé.

# Exercices

## Exercice 1 : La clé en double, jeudi soir

`unique` sur `fct_ventes.ligne_id` échoue. Quarante tickets sont en double. Nora dit que son brouillon s'ouvre et que le comité est lundi. Que faites-vous du merge, et quel chiffre sera présenté si la correction n'est pas prête ?

<details>
<summary>Voir la solution</summary>

Le merge est interdit. bi-ci est rouge, `main` est protégée, et un visuel qui s'ouvre ne remplace pas une clé. On ne reclasse pas `unique` en avertissement. On corrige la jointure qui multiplie les lignes, puis on relance sur un nouveau commit.

Si le lundi arrive avant, Nora présente le dernier tag certifié, dont le CA de mars est 6 240 000 €. Elle ne présente pas la branche. Forcer le merge ou builder la prod depuis un portable est un incident.

</details>

## Exercice 2 : Lint rouge, tests verts

`sqlfluff` échoue sur une virgule et un alias. `dbt build` n'a pas encore tourné. L'auteur veut fusionner « parce que les tests d'hier étaient verts ». Le lint doit-il bloquer ? Où le placez-vous par rapport au build ?

<details>
<summary>Voir la solution</summary>

Oui, le lint bloque. Les tests d'hier ne regardent pas le diff d'aujourd'hui. Une virgule et un alias illisible se règlent avant la relecture du sens, et avant une heure d'entrepôt.

Ordre dans bi-ci : `sqlfluff lint models/`, puis `dbt build --select state:modified+`. Les deux commandes doivent réussir. La configuration de sqlfluff est dans le dépôt. On ne la désactive pas sur le poste de l'auteur.

</details>

## Exercice 3 : Avertissement ou erreur

Le CA de dimanche bondit de 80 % (test en avertissement). Les clés, les relations et la réconciliation de mars sont vertes. Le reste inexpliqué est à 0 €. Fusionnez-vous ? Que notez-vous quand même ?

<details>
<summary>Voir la solution</summary>

On peut fusionner : aucun test de clé n'est rouge, et le test bloquant de réconciliation passe. L'avertissement ne se reclasse pas en erreur le dimanche sans décision, et il ne s'ignore pas non plus.

On note la cause (jour fermé, ou promotion) dans la demande, pour que Nora ne lise pas +80 % comme une panne. Si la cause est une jointure, on rouvre le modèle : un avertissement peut cacher une clé mal choisie. Dans ce cas on ajoute le bon `unique` en erreur, on ne se contente pas du feu orange.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: CI des modèles BI
center: "Chaque changement passe par le lint et par dbt. Une clé en double interdit le merge, même si le visuel s'ouvre."
points:
  - icon: git
    title: bi-ci obligatoire
    text: "Pas de poussée directe sur main. Le bouton de fusion attend un contrôle vert."
  - icon: terminal
    title: Lint puis build
    text: "sqlfluff d'abord. Ensuite dbt build sur le modèle modifié et sa descendance."
  - icon: key
    title: Clés en erreur
    text: "unique et not_null sur ligne_id et magasin_id. Une clé rouge bloque."
  - icon: scale
    title: CA dans le pipeline
    text: "Le reste au-dessus de 5 000 € ou de 0,5 % fait échouer le build."
  - icon: alert
    title: Avertissement
    text: "Un bond de CA se commente. Il ne donne pas le droit de reclasser une clé."
pitfall: "Fusionner jeudi soir parce que le brouillon de Nora s'ouvre encore. Quarante tickets en double faussent le lundi."
remember: "Si la correction n'est pas prête, on présente le dernier tag certifié. On ne contourne pas bi-ci."
```
