---
title: "Looker et LookML : une introduction"
description: "Vue, explore et mesure écrite une seule fois dans LookML, versionnée avec Git, pour ne plus avoir douze chiffres d'affaires en circulation."
duration: 45
objectives:
  - Décrire une vue LookML et ce qu'elle expose au métier
  - Composer une explore qui relie les vues sans jointure sauvage
  - Expliquer pourquoi une mesure définie une fois évite les versions contradictoires
  - Situer Git comme l'historique des définitions, pas comme un outil réservé aux développeurs
---

# Une couche écrite, pas une formule dans un graphique

Looker sépare deux gestes. Le métier **explore** (il choisit des dimensions et des mesures, il filtre, il enregistre une question). L'équipe qui tient les définitions **écrit** ces dimensions et ces mesures dans **LookML**, un langage de description versionné. Le graphique ne réinvente pas le chiffre d'affaires. Il le demande.

C'est l'inverse d'un classeur où chacun retape `montant * quantité` avec sa propre liste d'exclusions. Ici, la formule vit dans un fichier. Ceux qui explorent la réutilisent. S'il faut la corriger (passer hors taxes, retirer les ventes internes), on la corrige **là**, et les questions déjà enregistrées suivent.

Looker n'est pas « un Tableau de plus ». Son pari est la **couche sémantique** : le nom, le calcul et les jointures autorisées sont un contrat, pas une option de graphique.

```video
url: https://www.youtube.com/watch?v=VYekpqoI04g
title: "Look & Learn - Intro to LookML"
channel: "Looker"
duration: "5:06"
lang: en
why: "L'introduction officielle de Looker à LookML : vues, explores et modèle."
```

# La vue

Une **vue** décrit une table (ou une requête) telle que le métier a le droit de la voir. Elle nomme des **dimensions** (ce par quoi on découpe) et des **mesures** (ce que l'on agrège).

```lookml
view: commandes {
  sql_table_name: magasin.commandes ;;

  dimension: commande_id {
    primary_key: yes
    type: string
    sql: ${TABLE}.commande_id ;;
  }

  dimension: region {
    type: string
    sql: ${TABLE}.region ;;
  }

  measure: ca_ht {
    type: sum
    sql: ${TABLE}.montant_ht ;;
    value_format_name: eur
    description: "Chiffre d'affaires HT, ventes internes exclues en amont"
  }

  measure: nb_commandes {
    type: count_distinct
    sql: ${commande_id} ;;
  }
}
```

Ce qui compte pour l'analyste BI n'est pas d'apprendre chaque mot-clé le premier jour. C'est de voir que **le libellé, le calcul et la description** sont au même endroit. `ca_ht` n'est pas une somme que l'on refait dans douze questions. C'est un objet. La description dit le périmètre. Si les ventes internes sont exclues « en amont », cette phrase est le contrat, pas une note en bas d'un e-mail.

Une vue trop large, qui reprend toutes les colonnes techniques, repousse le problème : les gens sommeront la mauvaise colonne, parce qu'elle est là. On n'expose que ce qui a un sens métier, avec un nom que l'on peut lire en réunion.

# L'explore

Une **explore** est le point de départ d'une question. Elle assemble des vues et **les jointures permises**. L'utilisateur choisit « Commandes » et peut croiser la région, le magasin, la date. Il ne peut pas inventer une jointure qui duplique les lignes, parce que cette jointure n'est pas dans l'explore.

Le travail de conception est là : quelles vues, quelles relations, quel grain. Une explore « commandes » qui joint les lignes de ticket sans précaution multiplie le chiffre d'affaires. On le voit tout de suite si l'on a un total de référence. On ne le voit pas si chacun a son propre total « à peu près ».

Deux explores valent mieux qu'une explore qui joint tout le système d'information « pour être souple ». L'explore commandes sert le chiffre et le panier. L'explore stock sert la rupture. Les mélanger sans grain commun produit des questions qui semblent possibles et des totaux faux.

> [!WARNING]
> Si l'outil laisse poser n'importe quelle jointure au moment du clic, la couche n'a pas fait son travail. La liberté utile, c'est le choix des dimensions **déjà** reliées correctement.

# Une mesure, définie une fois

Le panier moyen ne se retape pas. Il **référence** les deux mesures déjà nommées.

```lookml
measure: panier_moyen {
  type: number
  sql: ${ca_ht} / NULLIF(${nb_commandes}, 0) ;;
  value_format_name: eur
  description: "CA HT divisé par le nombre distinct de commandes"
}
```

`NULLIF` évite la division par zéro les jours sans commande. Le format euro est porté par la mesure, pas par chaque graphique. Quelqu'un qui explore « panier par région et par mois » obtient le ratio **au grain de sa question** : somme du CA de la case sur nombre de commandes de la case. Il n'obtient pas la moyenne des paniers d'un niveau plus fin, sauf si on a écrit (à tort) une moyenne de moyennes.

C'est le cœur du gain. La définition du panier est unique. Les découpages changent. On peut ajouter une mesure « panier N-1 » plus tard, au même endroit, plutôt que dans un coin de tableau.

Quand la finance change le contrat (« désormais hors cartes cadeau »), une modification de `ca_ht` met à jour le panier, les explorations et les tableaux enregistrés qui s'appuient dessus. Douze classeurs ne se mettent pas à jour tout seuls. Une mesure oui, **si tout le monde s'en sert**.

# Git, l'historique des définitions

LookML vit dans des fichiers. **Git** en garde l'historique : qui a changé `ca_ht`, quand, et pourquoi (le message du changement). On relit la définition de mars dernier. On propose une modification dans une branche, quelqu'un la relit, puis elle arrive dans la version que les explorations utilisent.

Ce n'est pas un cérémonial réservé à une équipe d'ingénieurs. C'est ce qui manquait au classeur « CA_final_v7 » : on ne savait pas quelle version était officielle, ni ce qui avait changé depuis la revue précédente.

En pratique, pour l'analyste BI :

- une modification de mesure est une **revue**, même courte (la finance confirme le nouveau périmètre) ;
- le message décrit le contrat (« retrait des cartes cadeau, à compter d'avril »), pas « fix » ;
- la production ne change pas le vendredi à 18 h sans que la revue du lundi le sache ;
- l'ancienne définition reste lisible, ce qui calme les « le chiffre a bougé tout seul ».

```diagram
type: flow
title: "Une définition qui change sans se multiplier"
steps:
  - title: Contrat métier
    text: "HT, hors internes, hors cartes cadeau"
    tone: amber
  - title: Mesure LookML
    text: "Un seul objet ca_ht, décrit"
    tone: violet
  - title: Relecture Git
    text: "Le diff et le message restent"
    tone: blue
  - title: Explore
    text: "Les questions réutilisent la mesure"
    tone: teal
  - title: Revue
    text: "Un chiffre, une fraîcheur, un propriétaire"
    tone: rose
```

# Pourquoi cela évite douze versions du chiffre d'affaires

Douze versions naissent quand le calcul est **copié** : un graphique enlève les retours, l'autre non ; l'un est en TTC ; l'autre coupe le mois à minuit UTC. Chacun peut justifier sa copie. Personne ne peut additionner la réunion.

La couche sémantique réduit cet écart si trois conditions tiennent.

1. **Une mesure officielle**, nommée comme en comité (« Chiffre d'affaires HT »), avec une description du périmètre.
2. **Pas de seconde porte dérobée.** Un export qui resomme une autre colonne, ou un classeur qui « ajuste » le total, recrée la treizième version. On le dit, on le range, ou on le branche sur la même mesure.
3. **Des jointures autorisées**, pour que le total filtré reste le total. Une explore qui duplique les lignes fabrique une version fausse **avec** la bonne formule. La formule ne suffit pas.

Le test de couloir : demandez le chiffre d'affaires de mars à deux personnes qui n'ont pas préparé ensemble. Si elles ouvrent la même explore et la même mesure, elles lisent le même nombre (à la fraîcheur près). Si elles ouvrent deux classeurs, vous avez encore douze versions en puissance.

> [!TIP]
> Quand une exception est réelle (un canal se calcule autrement), créez une **seconde mesure nommée**, « CA HT hors marketplaces », plutôt qu'une copie silencieuse de la première. L'exception devient visible.

# Exercices

## Exercice 1 : Ce qui va dans la vue

On vous propose d'exposer, dans la vue commandes : `montant_ht`, `montant_ttc`, `montant_ht_v2`, `ca_old`, la clé technique du logiciel de caisse, et une mesure `ca_ht` déjà validée par la finance. Que gardez-vous visible, et sous quel nom ?

<details>
<summary>Voir la solution</summary>

On expose **`ca_ht`**, avec la description du contrat (HT, ce qui est inclus ou non). Les colonnes `montant_ht_v2` et `ca_old` ne sont pas proposées au métier : ce sont des essais, elles redeviendraient des versions parallèles.

`montant_ttc` n'est visible que si le métier a un usage assumé, sous un nom qui dit TTC, jamais à côté de `ca_ht` sans qualificatif. La clé de caisse reste masquée : elle ne se somme pas et ne se filtre pas en réunion.

Le nom affiché est celui du comité, par exemple « Chiffre d'affaires HT », pas `ca_old`.

</details>

## Exercice 2 : L'explore qui double

L'explore commandes joint la table des lignes de ticket **et** une table de commentaires qui a plusieurs lignes par commande, sans grain maîtrisé. Le CA de mars, mesure `ca_ht` pourtant correcte sur la table des commandes, sort deux fois trop grand dès qu'on ajoute un champ de commentaire. Que s'est-il passé, et que changez-vous ?

<details>
<summary>Voir la solution</summary>

La jointure **duplique** les commandes : une commande avec deux commentaires compte deux fois dans la somme. La formule de `ca_ht` est innocente. C'est l'explore qui est fausse.

On ne joint pas les commentaires au même grain que le montant. Soit les commentaires vivent dans une autre explore, soit on les agrège d'abord à une ligne par commande, soit on interdit ce champ dans l'explore qui porte le CA.

Contrôle : le total de mars sans le champ commentaire, et avec, doivent être identiques si l'utilisateur n'a fait que « regarder » un attribut. S'ils divergent, on ne publie pas l'explore.

</details>

## Exercice 3 : Douze classeurs, une mesure

Trois services annoncent 1,20 M€, 1,28 M€ et 1,15 M€ pour mars. Les écarts viennent du TTC, des retours, et d'un mois coupé en UTC. On vous demande d'ajouter un quatrième graphique « le vrai ». Comment vous servez-vous de LookML et de Git, concrètement ?

<details>
<summary>Voir la solution</summary>

On n'ajoute pas un quatrième calcul à côté des trois. On écrit **une** mesure, après un contrat court avec la finance : HT ou TTC, retours déduits ou non, fuseau du mois. La description porte ce contrat. Le panier et les autres ratios référencent cette mesure.

Le changement passe par Git : message explicite, relecture, mise en production **avant** la prochaine revue, pas pendant. On prévient que les trois classeurs ne sont plus des sources. On leur donne, s'ils en ont besoin, un accès à l'explore, pas une copie des colonnes.

La semaine suivante, le test de couloir (deux personnes, même mesure, même mars) doit donner le même montant, à l'heure d'actualisation près.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Looker et LookML
center: Une mesure écrite une fois, des explores qui ne dupliquent pas, un historique Git.
points:
  - icon: file
    title: La vue
    text: Dimensions et mesures nommées, décrites, sans colonnes techniques ni essais.
  - icon: layers
    title: L'explore
    text: Jointures autorisées seulement. Une jointure de trop double le chiffre.
  - icon: money
    title: Une mesure
    text: Le panier divise le CA déjà défini. Il ne recopie pas une formule maison.
  - icon: git
    title: L'historique
    text: Qui a changé le contrat, quand, et pourquoi. La revue du lundi peut le relire.
  - icon: check
    title: Un seul CA
    text: Même explore, même mesure, même mois. Les exceptions ont leur propre nom.
pitfall: Une formule juste dans une explore qui duplique les lignes fabrique quand même un faux total.
remember: Le quatrième graphique « le vrai » est encore une version. On remplace, on n'additionne pas.
```
