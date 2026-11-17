---
title: "Faire adopter le mart par les analystes"
description: "Catalogue, certification, formation de trente minutes et canal d'écart. Le mart Ventes Halte est adopté quand les analystes cessent de recopier le SQL dans douze fichiers."
duration: 35
objectives:
  - "Rendre Ventes Halte trouvable dans le catalogue, avec un propriétaire"
  - "Certifier le mart sur des critères vérifiables"
  - "Tenir une formation de trente minutes, sans cours de visuel"
  - "Ouvrir un canal d'écart et mesurer la fin des douze fichiers SQL"
---

# Le catalogue, avant le bouche-à-oreille

Nora sait que Lina a « un mart quelque part ». Les assistants de région, eux, ont encore un fichier. Le catalogue est l'endroit où l'on trouve Ventes Halte **sans écrire à Lina**. Une fiche qui n'existe que dans un message épinglé n'est pas un catalogue.

La fiche tient sur un écran :

- **Nom** : Ventes Halte. Pas `fct_ventes_v3_final`.
- **Tag** : `ventes-2026.03.1`.
- **Grain** : ligne de ticket. Les sommes par magasin se font dans la couche, pas dans un `GROUP BY` local.
- **Mesures** : CA HT, marge €, quantité, CA N-1, taux de marge.
- **Périmètre** : 42 magasins intégrés, HT, retours négatifs, hors ventes au personnel.
- **Fraîcheur** : avant 7 h, Europe/Paris, jours ouvrés. Dernier `charge_le` affiché.
- **Propriétaires** : Camille Renard (sens), Lina Costa (calcul).
- **Droits** : direction, tout le réseau. Responsable de région, sa région. Marie, Ouest, 1 560 000 € sur mars.
- **Badge** : certifié, ou non. Pas de badge « presque ».

Si un champ manque, la fiche n'est pas publiée. Un analyste qui doit deviner le périmètre recopie le SQL. C'est précisément le geste que le catalogue doit rendre inutile.

```diagram
type: flow
title: "Du bouche-à-oreille au fichier abandonné"
steps:
  - title: "Fiche"
    text: "Nom, tag, grain, périmètre, fraîcheur, deux propriétaires"
    tone: violet
  - title: "Badge"
    text: "Certifié seulement si les contrôles du mois tiennent"
    tone: blue
  - title: "30 minutes"
    text: "Où cliquer, quoi ne pas resommer, comment signaler"
    tone: teal
  - title: "Canal"
    text: "Un écart se poste, il ne devient pas un treizième SQL"
    tone: amber
  - title: "Succès"
    text: "Les 12 fichiers ne servent plus la revue du lundi"
    tone: rose
```

# Certifier Ventes Halte

Le badge dit : on peut décider avec ces mesures. Il ne dit pas que chaque page branchée dessus est bien composée. La page est le métier de l'analyste. Le badge est le métier du BI Engineer et de la finance, ensemble.

On certifie quand **tous** les points suivants sont vrais.

1. Mars 2026 : CA 6 240 000 €, marge 2 184 000 €, quantité 624 000, CA N-1 6 000 000 €.
2. Reste de réconciliation à 0 €, lignes de 15 000 € et 3 000 € écrites.
3. Fraîcheur : la promesse de 7 h a été tenue les cinq derniers jours ouvrés, ou l'alerte est bien partie les matins où elle ne l'était pas.
4. Droits testés avec trois identités, pas avec le compte admin : Marie voit 1 560 000 €, la direction voit 6 240 000 €, un compte sans région ne voit rien.
5. Deux propriétaires nommés, et une date de prochaine revue (par exemple fin avril 2026).
6. La formation de trente minutes a eu lieu, avec la liste des présents.

On **retire** le badge, sans attendre la revue d'avril, si le reste dépasse le seuil, si un sens change sans Camille, si le test de Marie montre une autre région, ou si Lina part sans binôme nommé. Un badge poli sur un mart faux est pire que l'absence de badge : il autorise la salle à ne pas vérifier.

# Trente minutes, pas une formation outil

La formation ne montre pas comment choisir un graphique. Elle montre comment **ne plus recalculer** le CA. Trente minutes, chrono tenu, sur le catalogue déjà certifié. Pas de bac à sable parallèle.

| Minutes | Ce que Lina montre | Ce que les analystes font |
| --- | --- | --- |
| 0 à 5 | Ouvrir la fiche Ventes Halte, lire tag et fraîcheur | Retrouver la fiche sans aide |
| 5 à 15 | CA, marge, quantité, N-1, taux de marge (division de sommes, pas moyenne de taux) | Lire mars : 6 240 000 € et 35 % |
| 15 à 20 | Marie voit l'Ouest. Exporter puis refiltrer n'est pas un droit | Constater 1 560 000 € avec l'identité de Marie |
| 20 à 25 | Feu rouge : message de fraîcheur, ne pas présenter | Lire un message d'exemple |
| 25 à 30 | Canal `#ecarts-mart-halte`, ce qu'un bon signal contient | Savoir où poster, pas où réécrire le SQL |

On s'arrête à 30. Les questions de couleur de barre partent vers l'analyste BI, un autre jour. Si les trente minutes glissent en atelier « pendant qu'on y est, ajoutons la météo », le mart n'est pas adopté : il est noyé.

# Un canal pour l'écart

Les douze fichiers existent parce qu'un écart, un jour, n'avait nulle part où aller. Le canal `#ecarts-mart-halte` est cet endroit. Il est surveillé par Lina les jours ouvrés, avec Adam en relais. Un message sans réponse pendant deux jours rouverts est un fichier SQL qui renaît.

Un signal utile contient :

- la date et le magasin (ou la région) ;
- la mesure (`ca_ht`, pas « le chiffre ») ;
- le nombre lu dans Ventes Halte et le nombre attendu ;
- le tag affiché sur la fiche.

Il ne contient pas une nouvelle requête « qui, elle, est la bonne », à coller dans le classeur de la région. Cette requête est le symptôme. Lina la compare au contrat. Trois issues seulement : le mart a un reste (incident, Nora prévenue), la règle a un trou (Camille tranche), ou la lecture a filtré de travers (on le dit, on ne change pas le modèle).

> [!TIP]
> Répondez dans le canal, pas en message privé. La réponse privée recrée le bouche-à-oreille que la fiche devait remplacer.

# Le succès se compte en fichiers abandonnés

Au départ, **douze fichiers** recalculent le CA par magasin. Chacun a un `WHERE` un peu différent : un retire les retours, un autre est en TTC, un troisième garde une franchise. Douze revues, douze CA. Le mart est adopté le jour où **aucun** de ces fichiers ne sert la revue du lundi.

La mesure est un inventaire, pas une impression.

- Jour 0 : 12 fichiers nommés, avec leur auteur.
- Jour de la formation : les auteurs sont dans la salle, la fiche est le seul support.
- Jour 30 : 0 fichier utilisé pour préparer ou projeter la revue. Un fichier rangé dans un dossier d'archive, et qui n'est plus ouvert, compte comme abandonné.
- Un fichier encore envoyé par mail compte comme vivant. Le projet n'est pas fini.

Le succès n'est pas « les analystes sont contents » ni « le badge est collé ». Le badge peut être là pendant que le treizième SQL circule. On compte les fichiers. Quand le compte tombe à zéro, Lina peut dire que la couche sert. Avant, elle a un canal et une formation, pas encore une adoption.

# Exercices

## Exercice 1 : La fiche incomplète

La fiche dit « Mart ventes, mis à jour récemment, contact : équipe data ». Nora demande le périmètre par message. Quels champs manquent pour que cette demande n'ait plus de raison d'être ?

<details>
<summary>Voir la solution</summary>

Il manque le nom stable (Ventes Halte), le tag, le grain (ligne de ticket), les mesures, le périmètre (42 intégrés, HT, retours négatifs, hors personnel), la fraîcheur (avant 7 h) avec le dernier `charge_le`, les deux propriétaires (Camille, Lina), la règle de région, et un badge oui ou non.

« Équipe data » n'est pas un propriétaire. « Récemment » n'est pas un tag. Tant que Nora doit écrire pour connaître le périmètre, les fichiers parallèles restent rationnels.

</details>

## Exercice 2 : Tenir les trente minutes

On vous demande d'allonger la formation à deux heures pour couvrir les graphiques, les filtres de page et « quelques requêtes SQL de secours ». Que gardez-vous dans les trente minutes, et que refusez-vous ?

<details>
<summary>Voir la solution</summary>

On garde le déroulé : fiche et fraîcheur (5 min), cinq mesures et le 35 % qui est une division de sommes (10 min), identité de Marie à 1 560 000 € (5 min), message de feu rouge (5 min), canal d'écart (5 min).

On refuse le cours de visuel, les SQL de secours et l'atelier météo. Un SQL de secours est un treizième fichier. Les graphiques sont le métier de l'analyste BI, sur un autre créneau. Si les trente minutes débordent, on coupe, on ne reporte pas le canal « à la fin, s'il reste du temps ».

</details>

## Exercice 3 : Le fichier qui reste

Jour 30. Onze fichiers sont archivés. Nora en garde un « seulement pour l'export du comité », qui retire les retours. Le matin même, un assistant poste dans le canal : « mon SQL donne 6,3 millions ». Le badge est en place. L'adoption est-elle réussie ? Que répondez-vous dans le canal ?

<details>
<summary>Voir la solution</summary>

Non. Un fichier encore utilisé pour le comité compte comme vivant. Onze sur douze n'est pas zéro. Le badge ne compense pas.

Dans le canal, en public : le CA certifié de mars est 6 240 000 €, tag affiché sur la fiche. Un SQL qui retire les retours recompte 240 000 €. On ne prend pas cette requête comme nouvelle définition. On demande à Nora d'arrêter l'export parallèle. S'il existe un vrai besoin d'export, il sort de la mesure `ca_ht`, avec le même périmètre, pas d'un fichier à part.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Adoption du mart
center: "Le succès, c'est zéro fichier SQL recopié pour la revue. Le badge seul ne suffit pas à le décréter."
points:
  - icon: book
    title: Fiche complète
    text: "Nom, tag, grain, périmètre, 7 h, Camille et Lina. Pas une équipe sans nom."
  - icon: check
    title: Badge
    text: "Mois témoin, reste à zéro, droits de Marie, cinq jours de fraîcheur, date de revue."
  - icon: clock
    title: Trente minutes
    text: "Où lire, quoi ne pas resommer, quel message stoppe la revue. Pas un cours de visuel."
  - icon: chat
    title: Canal d'écart
    text: "Date, mesure, deux nombres, tag. La réponse reste dans le canal, pas en privé."
  - icon: file
    title: Douze fichiers
    text: "Inventaire au jour 0. Au jour 30, aucun ne prépare plus le lundi."
pitfall: "Certifier alors qu'un export parallèle retire encore les retours. Le badge autorise alors un deuxième CA."
remember: "Onze fichiers archivés et un encore envoyé par mail : l'adoption n'est pas finie. On compte jusqu'à zéro."
```
