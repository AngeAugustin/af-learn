---
title: Les biais et les pièges de l'analyse
description: "Reconnaître la sélection, le survivant, la confirmation et le tri sélectif, puis éviter les corrélations trompeuses, les périodes mal alignées et la moyenne des ratios."
duration: 55
objectives:
  - Reconnaître un biais de sélection, de survivant ou de confirmation dans un brief
  - Refuser un résultat obtenu en essayant des découpages jusqu'à ce que l'un d'eux plaise
  - Recaler une comparaison de périodes et distinguer un taux global d'une moyenne de taux
  - Expliquer une corrélation fallacieuse par le facteur qui agit sur les deux séries
---

# Le biais de sélection

Vous n'analysez presque jamais « tout le monde ». Vous analysez ceux qui sont **dans la table**. Le biais de sélection apparaît quand cette présence dépend déjà du phénomène que vous voulez mesurer.

Cas concret. Une chaîne de salles de sport envoie une enquête de satisfaction aux abonnés, par e-mail, le lundi. Taux de réponse : 9 %. Les répondants donnent 4,6 / 5. Le comité veut l'afficher en vitrine. Les répondants sont ceux qui ouvrent les e-mails du club, un lundi, et qui ont encore un abonnement. Les personnes parties furieuses le mois dernier n'ont pas reçu le lien. Le 4,6 décrit les répondants, pas les abonnés, encore moins les anciens abonnés.

Autres sélections fréquentes.

- **Entonnoir.** Comparer le panier moyen des gens qui ont payé, pour juger une campagne dont l'effet principal est d'amener plus de monde à l'étape panier.
- **Consentement.** Un outil de mesure ne voit que les visiteurs qui ont accepté les traceurs. Ils n'ont pas le même appareil ni le même pays que les autres.
- **Disponibilité.** Étudier les magasins « qui ont bien remonté leurs stocks ». Ce sont souvent les mieux tenus.

Avant un chiffre, écrivez la phrase : « ce taux est calculé parmi …, qui entrent dans l'échantillon parce que … ». Si la raison d'entrer est liée au résultat (ils sont contents, ils ont survécu, ils ont cliqué), vous avez un problème de sélection, pas un détail de jointure.

# Le biais du survivant

Le biais du survivant est une sélection dans le temps : vous ne voyez plus ceux qui ont disparu, et vous prenez les restants pour la norme.

Une marketplace publie : « nos vendeurs actifs depuis trois ans réalisent 80 % de leur chiffre sur moins de vingt références, donc un petit catalogue est la clé du succès ». Les vendeurs au catalogue étroit qui ont fait faillite à dix-huit mois ne sont plus dans l'extrait « actifs depuis trois ans ». Vous avez décrit les survivants. Vous n'avez pas mesuré l'effet d'un petit catalogue.

Même piège côté produit.

- « Les utilisateurs qui utilisent la fonction Favoris ont une rétention à 90 jours de 70 %. » Ceux qui allaient partir n'ont jamais rempli leurs favoris. L'écart mélange l'effet de la fonction et le fait d'être déjà engagés.
- « Les enseignes centenaires ont toutes une boutique flagship. » Vous ne voyez pas les flagships des enseignes disparues.

```diagram
type: flow
title: Deux questions avant de citer un groupe
steps:
  - title: Qui manque ?
    text: Non-répondants, partis, non consentants, magasins muets
    tone: rose
  - title: Pourquoi manquent-ils ?
    text: Lié au résultat, ou simple trou de collecte ?
    tone: amber
  - title: Depuis quand ?
    text: Le filtre « encore là » efface les échecs
    tone: violet
  - title: Que peut-on dire ?
    text: Décrire les présents, pas la recette du succès
    tone: teal
```

Le correctif n'est pas toujours d'avoir « plus de données ». C'est de **remettre les disparus dans le dénominateur**, ou de suivre une cohorte depuis un instant commun (l'inscription, la première commande) au lieu de photographier les vivants.

```video
url: https://www.youtube.com/watch?v=P9WFpVsRtQg
title: "Survivorship Bias"
channel: "Eddie Woo"
duration: "6:10"
lang: en
why: "Eddie Woo raconte l'exemple classique des avions de la Seconde Guerre mondiale pour expliquer le biais du survivant."
```

# Confirmation et tri sélectif

Le biais de confirmation consiste à ne retenir que ce qui soutient l'idée de départ. Le **cherry-picking** (tri sélectif) en est la version opérationnelle : vous découpez jusqu'à ce qu'un morceau confirme.

La directrice régionale est convaincue que le nouveau packaging marche « surtout en Bretagne ». Vous avez douze régions, trois canaux, quatre familles de produits, deux devices. Cela fait des centaines de cases. Au seuil naïf de 5 %, plusieurs cases seront « significatives » par hasard. Si vous ne montrez que la Bretagne sur mobile pour les écharpes, vous racontez le bruit.

Habitudes qui limitent le dégât.

- Écrire **avant** l'extraction les deux ou trois découpes autorisées (pays, canal d'acquisition, nouveaux contre anciens).
- Distinguer une analyse **confirmatrice** (le test prévu) d'une analyse **exploratoire** (pistes pour le prochain test, pas une décision).
- Si une case surprend, demander une **réplication** sur la période suivante ou sur un autre pays, au lieu de la promouvoir tout de suite.
- Se méfier de la phrase « en excluant ces trois jours, on voit bien l'effet ». Demandez ce qui justifie l'exclusion autrement que le résultat lui-même.

> [!WARNING]
> « J'ai trouvé un segment à +30 % » n'est pas une conclusion si vous avez essayé quarante segments. C'est une hypothèse pour un prochain protocole, avec une métrique et une population figées.

# Corrélations fallacieuses

Deux courbes qui montent ensemble n'ont pas forcément de lien de cause à effet. Le cas d'école : les ventes de glaces et les noyades montent en été. La chaleur (et les vacances) pousse les deux. Interdire les glaces ne viderait pas les plages.

Dans une entreprise, la version locale ressemble souvent à ceci. Le nombre d'ouvertures de tickets support et le chiffre d'affaires montent au quatrième trimestre. Quelqu'un propose de « réduire le support pour protéger la marge ». En réalité, le volume de commandes pousse les deux. Le taux de tickets **par commande** est peut-être stable.

Avant de relier deux indicateurs, cherchez le troisième facteur : saison, taille du magasin, mix de clients, campagne lancée le même jour, changement de tracking. Un nuage de points sans ce facteur est une invitation à se tromper avec confiance.

Trois réflexes simples.

- Regarder la série **dans le temps**, pas seulement le coefficient sur l'année.
- Ramener à une **unité comparable** (par commande, par visiteur, par jour ouvré).
- Demander : « quel facteur ferait bouger les deux séries même si elles ne se causaient rien ? »

# Périodes mal alignées

Comparer « cette semaine » à « la semaine dernière » semble raisonnable, jusqu'au calendrier. Vous comparez une semaine avec le Black Friday à une semaine sans, un mois de 31 jours à un mois de 28, ou un lundi férié à un lundi travaillé. L'écart est réel. Il ne dit pas ce que vous croyez.

| Comparaison bancale | Pourquoi | Recalage utile |
|---|---|---|
| Décembre contre novembre, prêt-à-porter | Cadeaux, soldes, trafic | Décembre contre décembre précédent, à jours comparables |
| Semaine glissante de 7 jours contre les 7 d'avant | Le jour de la semaine change de place | Même jour de semaine, ou deux semaines complètes |
| Avant / après une mise en production un 1er mai | Le férié est dans la fenêtre | Retirer les fériés **des deux côtés**, ou comparer au 1er mai précédent |
| Année N contre N−1, jour calendaire | Le lundi ne tombe pas à la même date | Aligner les semaines commerciales (semaine 12 contre semaine 12) |

Un deuxième décalage, plus sournois : la **fenêtre incomplète**. Le taux de réachat à 90 jours de la cohorte de mars, calculé le 1er juin, est presque mûr. Celui de la cohorte de mai ne l'est pas : beaucoup n'ont pas encore eu leurs 90 jours. La courbe « le réachat s'effondre depuis mars » est souvent une courbe de **censure**, pas de comportement.

Annoncez toujours la période, le nombre de jours comparables, et les événements connus (campagne, rupture, incident de tracking, grève, soldes). Si l'écart disparaît une fois les jours alignés, vous n'avez pas un problème produit. Vous aviez un problème de calendrier.

# La moyenne des ratios

La moyenne des ratios n'est pas le ratio des sommes. Ce piège a un nom dans les comptes d'exploitation autant qu'en analyse produit.

Cinq boutiques. Vous calculez le taux de transformation de chacune (commandes / visites), puis vous faites la moyenne arithmétique.

| Boutique | Visites | Commandes | Taux |
|---|---|---|---|
| A | 10 000 | 500 | 5 % |
| B | 500 | 50 | 10 % |
| C | 400 | 40 | 10 % |
| D | 300 | 30 | 10 % |
| E | 200 | 20 | 10 % |

Moyenne des taux : (5 + 10 + 10 + 10 + 10) / 5 = **9 %**. Taux du réseau : 640 / 11 400 ≈ **5,6 %**. La moyenne traite la boutique de 200 visites comme celle de 10 000. Pour une décision réseau (où investir, comment va l'enseigne), c'est le **ratio global** qui compte. La moyenne non pondérée répond à une autre question : « une boutique typique, une voix par boutique, convertit-elle à combien ? », et encore faut-il le dire.

Même erreur sur des ratios quotidiens. Moyenner sept taux de conversion journaliers ne donne pas le taux de la semaine, sauf si chaque jour a le même dénominateur. Moyenner des vitesses, des délais « par ticket » de files d'attente de tailles différentes, ou des marges en pourcentage de magasins au chiffre d'affaires très inégal, produit le même glissement.

Quand vous agrégez : sommez les numérateurs, sommez les dénominateurs, puis divisez. Si vous devez moyenner des taux, **pondérez** par le dénominateur (les visites, les commandes, les heures). Et écrivez le poids dans la note.

# Exercices

## Exercice 1 : Qui a disparu de l'échantillon ?

On vous demande de conclure que « le programme de parrainage fidélise : les filleuls ont un taux de seconde commande à 60 jours de 45 %, contre 25 % pour les autres clients ». Quels manques rendent cette comparaison fragile ?

<details>
<summary>Voir la solution</summary>

Les filleuls ne sont pas tirés au sort. Quelqu'un a jugé bon de les inviter : souvent des proches de clients déjà contents. Les « autres clients » mélangent des acquisitions froides, des primo-accédants peu engagés et des gens qui n'ont jamais été exposés au parrainage.

Vous ne voyez pas les filleuls dont l'invitation a été ignorée si la table ne contient que les comptes créés. Vous ne voyez pas non plus, si le filtre est « clients encore actifs », ceux qui sont partis avant 60 jours : les deux taux peuvent être calculés seulement parmi les survivants, ce qui écrase l'écart réel ou le gonfle selon le filtre.

Phrase honnête : les filleuls **observés** recommandent davantage. Pour attribuer l'écart au programme, il faudrait un tirage au sort (invitation envoyée ou non) ou, à défaut, une comparaison d'inscrits de même canal, même semaine, même premier panier, en sachant qu'il restera des facteurs non mesurés.

</details>

## Exercice 2 : Recaler le calendrier

Le 8 janvier, un collègue écrit : « les ventes de la première semaine de janvier sont à −18 % contre la dernière semaine de décembre, le nouveau site a raté ». La première semaine de janvier va du jeudi 1er au mercredi 7, et inclut le 1er janvier férié. La dernière semaine de décembre est une semaine commerciale pleine, avec les cadeaux de dernière minute. Que comparez-vous à la place ?

<details>
<summary>Voir la solution</summary>

Cette comparaison aligne une semaine de fêtes et un férié sur une semaine creuse de janvier. L'écart de −18 % est attendu dans presque toutes les enseignes, avec ou sans nouveau site.

Comparaisons plus justes : la première semaine commerciale de janvier contre la même semaine l'an passé, en alignant les jours de semaine ; ou les jours ouvrés comparables, en isolant le 1er janvier. Regardez aussi le taux de conversion et le panier, pas seulement le montant : un incident de paiement se voit mieux ainsi qu'un simple creux saisonnier.

Tant que le recalage n'est pas fait, vous ne commentez pas le nouveau site.

</details>

## Exercice 3 : Quel taux pour l'enseigne ?

Reprenez les cinq boutiques du cours (11 400 visites, 640 commandes). La direction veut « le taux de transformation de l'enseigne » et « les boutiques en difficulté ». Quel chiffre donnez-vous pour chaque question, et pourquoi la moyenne de 9 % ne sert aucune des deux ?

<details>
<summary>Voir la solution</summary>

Pour l'enseigne, le taux est 640 / 11 400 ≈ **5,6 %**. C'est le ratio des sommes : chaque visite compte une fois.

Pour les boutiques en difficulté, vous regardez **chaque** taux, avec son volume. Ici A est à 5 % sur 10 000 visites : c'est elle qui pèse sur le réseau. B, C, D et E sont à 10 % mais sur de petits flux. Les classer « meilleures » sans montrer les visites exagère leur poids.

La moyenne non pondérée de 9 % ne décrit ni le réseau (trop haute) ni une alerte opérationnelle (elle cache que le volume est chez A). Si vous deviez vraiment résumer « une boutique, une voix », vous le diriez explicitement, et vous ne l'appelleriez pas taux de l'enseigne.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Biais et pièges de l'analyse
center: Le chiffre est souvent juste sur un sous-ensemble qui ne peut pas porter la décision.
points:
  - icon: filter
    title: Sélection
    text: Qui entre dans la table, et est-ce lié au résultat que vous commentez ?
  - icon: users
    title: Survivants
    text: Les partis ne votent plus. Une cohorte depuis l'inscription les garde visibles.
  - icon: search
    title: Tri sélectif
    text: Vingt découpes produisent un gagnant par hasard. Figez les coupes avant.
  - icon: clock
    title: Calendrier
    text: Fériés, soldes, semaines incomplètes. Alignez les jours avant d'accuser le produit.
  - icon: scale
    title: Ratios
    text: Sommez, puis divisez. La moyenne des taux donne une voix égale aux petits dénominateurs.
pitfall: Exclure trois jours ou une région après avoir vu que, sans eux, l'effet apparaît enfin.
remember: Si vous ne pouvez pas dire qui manque à l'échantillon, vous ne pouvez pas dire ce que le taux signifie.
```
