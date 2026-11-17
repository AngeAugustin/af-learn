---
title: "Sécurité des lignes par région"
description: "Limiter chaque responsable Halte à sa région avec un rôle et une table de mapping, tester deux identités, et ne pas confondre ça avec un filtre de page."
duration: 64
objectives:
  - "Expliquer qu'un responsable ne doit voir que les magasins de sa région"
  - "Mettre en place un rôle et une table de mapping email-région"
  - "Tester le modèle avec deux identités avant de publier"
  - "Refuser un filtre de page comme mécanisme de sécurité"
---

# Camille ne voit que le Nord

Halte a quatre régions : Nord, Est, Ouest, Sud. Camille est responsable du Nord. Malik est responsable de l'Ouest. La revue réseau, elle, voit les quatre. Le même modèle `fct_ventes` sert les trois lectures. La différence n'est pas une copie du fichier par personne. C'est la **sécurité des lignes** : à l'ouverture, le modèle retire les lignes que l'identité n'a pas le droit de lire.

Camille interroge `CA HT`. La somme ne porte que sur les magasins du Nord. Elle ne « masque » pas l'Ouest dans un graphique. L'Ouest n'est pas dans le résultat, ni dans un export, ni dans un tableau croisé branché sur le même jeu. Malik, de son côté, ne voit pas le Nord. Une identité sans ligne dans le mapping ne voit rien. Le modèle est fermé par défaut.

Cette règle vit dans le modèle sémantique que vous publiez. L'analyste ne la pose pas sur sa page, et la finance ne la rappelle pas chaque lundi. Si Camille change de région, vous changez une ligne de mapping, pas vingt rapports.

```diagram
type: sequence
title: "Camille ouvre le CA"
actors: ["Camille", "Rôle région", "Mapping", "fct_ventes"]
messages:
  - from: 0
    to: 1
    text: "Ouvre le modèle publié avec son compte"
  - from: 1
    to: 2
    text: "Quelles régions pour camille.nord@halte.fr ?"
  - from: 2
    to: 1
    text: "Une ligne : Nord"
  - from: 1
    to: 3
    text: "Ne garder que les magasins de cette région"
  - from: 3
    to: 0
    text: "CA HT du Nord, pas celui du réseau"
```

# Le rôle et la table de mapping

Le **rôle** est le conteneur de la règle, côté modèle (rôle Power BI, access grant Looker, ou filtre équivalent dans la metric layer). Il ne contient pas la liste des magasins en dur. La liste bougerait à chaque mutation, et le rôle deviendrait un deuxième référentiel.

La **table de mapping** porte les affectations. Une ligne, un couple identité et région. Camille n'a que le Nord. Une personne qui couvrirait deux régions aurait deux lignes, sans qu'on réécrive la règle.

```sql
-- models/marts/securite_region.sql
select
    email,
    region
from {{ ref('stg_rh__affectations') }}
where role_bi = 'responsable_region'
```

`email` est celui du compte qui ouvre le modèle, pas un prénom saisi dans un slicer. `region` prend les mêmes valeurs que `dim_magasins.region` : Nord, Est, Ouest, Sud. Un libellé « nord » en minuscules ou « Région Nord » ne joint rien, et la personne se retrouve sans magasins, ou, pire, vous « corrigez » en ouvrant le rôle. Le staging aligne les libellés avant le mart.

Le rôle, posé sur `dim_magasins`, ne garde la ligne que si le mapping contient le couple (compte courant, région du magasin).

```dax
CONTAINS (
    securite_region,
    securite_region[email], USERPRINCIPALNAME (),
    securite_region[region], dim_magasins[region]
)
```

Le filtre suit la relation vers `fct_ventes`. Inutile de le recopier sur le fait, au risque d'en oublier un des deux le jour d'une évolution. La revue réseau utilise un autre rôle, sans ce filtre, réservé aux comptes qui ont vraiment le droit au total. Vous ne mettez pas Camille dans les deux « pour qu'elle compare ». Comparer au réseau, si c'est voulu, est une mesure ou un agrégat que vous concevez, pas un oubli de rôle.

> [!IMPORTANT]
> Une identité absente du mapping ne voit aucune région. Vous vérifiez ce cas. Un rôle qui, à défaut, montre tout le réseau est une porte ouverte.

```video
url: https://www.youtube.com/watch?v=aJkiitEUzHE
title: "Implement row-level security PL-300"
channel: "Microsoft Learn"
duration: "4:36"
lang: en
why: "La sécurité au niveau des lignes dans Power BI présentée par Microsoft Learn : rôles, filtres DAX et vérification."
```

# Deux identités avant de publier

Vous testez avec les comptes, ou avec l'emprunt d'identité de l'outil (« afficher en tant que »), avant que Camille s'en serve en revue. Deux identités au minimum, plus le cas sans droit.

| Identité | Attendu sur CA HT |
| --- | --- |
| camille.nord@halte.fr | Égal à la somme du mart filtrée sur Nord |
| malik.ouest@halte.fr | Égal à la somme du mart filtrée sur Ouest, et aucun magasin du Nord |
| compte sans ligne de mapping | Vide, pas le total réseau |

Le chiffre de Camille se recalcule depuis `fct_ventes` avec le filtre région, pas depuis son ancien fichier. S'il y a un écart, le rôle ou le libellé de région est faux. Vous ne « ajustez » pas la page pour coller à son habitude.

Vous retestez après chaque changement de règle : nouvelle relation, rôle modifié, mapping redevenu une table. Un test vieux de trois mois ne couvre pas le modèle de cette semaine. Les deux identités font partie du passage en revue, au même titre que le rapprochement de CA.

Ouvrez aussi un deuxième rapport branché sur le même jeu, sans aucun filtre de page. Camille doit y voir le même Nord. Si le deuxième rapport montre le réseau, la règle n'est pas dans le modèle.

# Le filtre de page ne protège rien

Un slicer « Région = Nord » sur la page de Camille a l'air de suffire le jour de la démo. Il ne suffit pas.

- Camille, si elle peut modifier la page, retire le slicer.
- Un autre rapport sur le même jeu n'a pas le slicer.
- Un export ou « analyser dans Excel », selon les droits du jeu, emporte les lignes que le modèle a bien voulu charger.
- Vous, en préparant la page, voyez le réseau et oubliez que le slicer n'était qu'un défaut d'affichage.

La sécurité des lignes, elle, s'applique avant le visuel. Elle ne dépend pas de la page. Le slicer peut rester comme confort : Camille arrive sur le Nord déjà sélectionné. S'il l'enlève, elle voit encore le Nord, et rien d'autre. Le confort n'est pas le contrôle.

Looker obéit à la même idée : le filtre d'accès est dans l'explore, pas dans un dashboard filter que l'utilisateur retire. Une metric layer applique le filtre dans la requête, à partir de l'identité, pas dans la feuille qui affiche le résultat.

> [!WARNING]
> Cacher une colonne région, ou trier pour que le Nord soit en haut, ne retire pas les lignes. Ce qui n'est pas filtré par le rôle est encore dans le modèle.

# Ce que vous livrez

Vous livrez le rôle, la table `securite_region` alimentée par les affectations, et le compte rendu des deux identités : Camille colle au Nord, Malik colle à l'Ouest, l'inconnu est vide. Le mapping a un propriétaire côté réseau ou RH : quand Camille quitte le Nord, la ligne change à la source, le mart se reconstruit, le rôle suit. Vous ne maintenez pas la liste dans un slicer.

L'analyste construit la page du responsable avec les mesures officielles. Il n'écrit pas le filtre de sécurité. S'il le fait « pour aider », vous le retirez de la page et vous lui montrez l'essai des deux identités. La preuve est le chiffre de Malik, pas l'apparence de la page de Camille.

# Exercices

## Exercice 1 : Où vit la règle

On vous propose trois mises en œuvre. A : slicer Région verrouillé sur la page de Camille. B : un .pbix par région, chacun filtré à l'import. C : un rôle sur le modèle publié, plus `securite_region`. Laquelle tenez-vous, et que deviennent les deux autres ?

<details>
<summary>Voir la solution</summary>

C. Le rôle avec `CONTAINS` sur l'email et la région, mapping versionné, filtre qui se propage à `fct_ventes`. Un deuxième rapport sans slicer montre encore le Nord seul à Camille.

A saute dès que la page est éditée ou recopié. B multiplie les modèles : quatre CA à maintenir, et aucun n'est « le » modèle. Le jour où la marge change, vous en oubliez un. Les fichiers par région peuvent servir de brouillon. Ils ne servent pas la revue.

</details>

## Exercice 2 : Malik voit un magasin du Nord

Le test « afficher en tant que Malik » montre le CA de l'Ouest, plus un magasin dont `dim_magasins.region` vaut `Nord`. La table de mapping de Malik n'a que `Ouest`. Par où commencez-vous ?

<details>
<summary>Voir la solution</summary>

Le rôle ne fait pas ce qu'on croit, ou il n'est pas appliqué à ce jeu. Piste directe : le libellé. Si le mapping a `Ouest` et le magasin `Ouest `, ou si une relation ignorée laisse passer le fait, le `CONTAINS` ne peut pas expliquer un magasin Nord pour un email seulement Ouest, sauf si une deuxième ligne de mapping existe, ou si Malik a aussi le rôle réseau.

Vous vérifiez les lignes `securite_region` de cet email, les rôles réellement assignés au compte de test, et que vous empruntez bien l'identité sur le jeu publié, pas sur un .pbix local sans rôle. Tant qu'un magasin Nord apparaît, vous ne publiez pas. Vous ne compensez pas avec un slicer.

</details>

## Exercice 3 : Camille change de région

Camille prend l'Est au 1er avril. Un analyste duplique sa page, remplace le slicer Nord par Est, et garde l'ancienne page « pour l'historique ». Que changez-vous dans le modèle, et que dites-vous de l'historique ?

<details>
<summary>Voir la solution</summary>

Vous changez l'affectation à la source : la ligne de Camille dans `stg_rh__affectations` passe à Est. `securite_region` suit au prochain build. Le rôle est inchangé. Au 1er avril, Camille voit l'Est. Elle ne voit plus le Nord, y compris sur l'ancienne page : l'historique des ventes Nord n'est pas « sa » page, c'est une donnée qu'elle n'a plus le droit de lire.

L'historique d'une région se consulte avec un compte qui a encore ce droit (le rôle réseau, ou le nouveau responsable Nord), pas en conservant un slicer. Dupliquer la page ne crée aucun droit, et laisse croire que le slicer est la sécurité.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Une région par responsable"
center: "Le rôle lit le mapping, puis le mart. Camille obtient le Nord même si elle retire tous les filtres de la page."
points:
  - icon: users
    title: "Deux identités"
    text: "Camille colle au CA Nord. Malik colle à l'Ouest et ne voit aucun magasin Nord."
  - icon: key
    title: "Mapping"
    text: "Une ligne email et région, libellés alignés sur dim_magasins. Pas de liste en dur."
  - icon: lock
    title: "Rôle du modèle"
    text: "CONTAINS sur le compte courant. Sans ligne de mapping, le résultat est vide."
  - icon: eye
    title: "Deuxième rapport"
    text: "Sans slicer, la limite tient encore. Sinon la règle n'est pas dans le modèle."
  - icon: alert
    title: "Pas un slicer"
    text: "Un filtre de page s'enlève, ne suit pas l'export, et oublie les autres rapports."
pitfall: "Un rôle qui montre tout le réseau quand l'email est inconnu ouvre la donnée au lieu de la fermer."
remember: "Vous testez Camille et Malik sur le jeu publié avant que la page du lundi s'en serve."
```
