---
title: "Import ou requête directe"
description: "Choisir l'import pour la revue interactive de Halte, la requête directe quand la fraîcheur l'exige et que le volume suit, et en tirer les conséquences sur le modèle."
duration: 66
objectives:
  - "Réserver l'import aux usages interactifs comme la revue du lundi"
  - "N'ouvrir la requête directe que si la fraîcheur l'exige et que la requête tient"
  - "Dire ce que ce choix change dans le modèle sémantique"
  - "Garder une seule définition de CA dans les deux modes"
---

# L'import pour la revue

En **import**, le modèle sémantique charge une copie des tables (l'agrégat jour par magasin, les dimensions) et répond aux clics dans cette copie. Filtrer une région, changer de mois, trier les magasins : le moteur local recalcule les mesures sans rappeler l'entrepôt. C'est le bon mode pour la revue du lundi, où plusieurs personnes explorent le même chiffre en même temps.

La copie a l'âge de la dernière actualisation réussie. Ce n'est pas un défaut si cette heure est connue, affichée, et suffisante pour la décision. La direction commente un matin arrêté, pas la ligne de caisse en train de tomber. L'import de `mart_ventes_jour_magasin` est petit. Il s'ouvre vite. Il porte les mesures `CA HT`, `Marge HT`, `Taux de marge`, et le rôle de région.

Importer `fct_ventes` sur plusieurs années pour cette même revue rejouerait le mauvais grain : lourd à charger, lourd à tenir, inutile pour une somme que l'agrégat a déjà. L'import n'excuse pas de sauter l'agrégat.

```diagram
type: decision
title: "Import ou requête directe"
nodes:
  - question: "La décision a-t-elle besoin d'un chiffre plus récent que la dernière actualisation prévue ?"
    yes: "La fraîcheur pousse vers la requête directe. Question suivante."
    no: "Import. La revue du lundi s'en contente, sur l'agrégat."
  - question: "La question tient-elle dans une requête courte, filtrée, sur un grain que l'entrepôt sait servir ?"
    yes: "Requête directe possible, sur ce périmètre étroit."
    no: "On agrège ou on partitionne d'abord, puis on importe. La requête directe sur tout l'historique ne tiendra pas."
```

# Quand la fraîcheur l'exige

La **requête directe** ne copie pas les lignes. Chaque visuel envoie une requête à l'entrepôt et affiche le résultat du moment. Elle se justifie quand le chiffre doit bouger entre deux imports : un écran magasin qui montre les tickets du jour, pas la revue de 9 h qui commente la veille.

Deux conditions, les deux vraies. La fraîcheur est exigée par la décision. Le volume filtré tient : un magasin, le jour courant, un agrégat ou un fait déjà limité. Si l'une manque, la requête directe devient une revue lente, ou un import déguisé que vous actualisez souvent.

Halte peut avoir les deux besoins le même matin. Ils ne partagent pas le même mode sur la même table géante.

- Direction : import de `mart_ventes_jour_magasin`, actualisé après la nuit (et, si besoin, en milieu de journée sur le mois courant seulement).
- Écran « tickets d'aujourd'hui dans ce magasin » : requête directe acceptable si l'entrepôt répond vite sur ce filtre, et si la décision change vraiment quand un ticket tombe.

Un responsable qui veut « le réseau en direct » obtient en général un import plus fréquent de l'agrégat du mois courant, pas une requête directe sur toutes les lignes de l'année. La fraîcheur demandée est souvent « ce matin », et l'import de l'agrégat la donne déjà.

> [!IMPORTANT]
> La requête directe sur `fct_ventes` sans filtre de magasin ni de période fait porter à l'entrepôt chaque clic de la revue. Le modèle a l'air à jour. La page ne s'ouvre plus.

```video
url: https://www.youtube.com/watch?v=tDIsCVB7mnI
title: "Import vs DirectQuery in Power BI"
channel: "SQLBI"
duration: "7:24"
lang: en
why: "SQLBI compare les modes Import et DirectQuery et ce que chacun implique pour la performance et la fraîcheur."
```

# Ce que le mode change dans le modèle

Le mode ne change pas la définition. Il change ce que le modèle peut se permettre.

En import, une mesure `SUM` est locale et rapide. Un rôle de sécurité filtre la copie. Vous pouvez tenir l'étoile complète de la direction : date, magasin, mesures, agrégat. Le coût est payé à l'actualisation, pas au clic.

En requête directe, chaque mesure devient du SQL. `SUM` et `DIVIDE` passent bien. Une colonne calculée lourde, un cumul complexe, une page de douze visuels sur le fait : chaque élément est une requête, et la page attend la plus lente. Le rôle de sécurité part dans la requête, ce qui est sain, à condition que le mapping soit dans l'entrepôt et pas seulement dans un slicer. Les règles de signe et de périmètre restent dans dbt. Les refaire dans une colonne du modèle direct, c'est les payer à chaque clic, et les désynchroniser du mart.

Conséquences pratiques pour Halte.

- Le modèle de direction est en import, grain agrégé, mesures simples déjà décidées.
- Le modèle du jour, s'il est en requête directe, n'expose que les mesures que l'entrepôt sait agréger vite, sur un fait ou une vue filtrable par magasin et par jour.
- Vous ne mélangez pas « tout l'historique en direct » et « la page de direction interactive » dans un seul modèle fourre-tout.
- Les deux modèles, s'ils coexistent, publient les mêmes noms. `CA HT` du jour et `CA HT` de la revue sont la même formule. Seul le filtre de période change.

Un modèle composite (agrégat importé, détail en requête directe pour un drill étroit) est possible le jour où le fore sur quelques tickets doit être frais et le total de direction doit rester instantané. Il se justifie par ces deux phrases. Il ne se justifie pas par l'envie de n'avoir qu'un fichier. S'il existe, le test de totaux entre agrégat et fait reste obligatoire : le mode double rend l'écart plus facile à rater.

# Le choix tenu

Vous écrivez le choix à côté du modèle, en trois lignes qu'un successeur peut relire.

- Revue du lundi : import de `mart_ventes_jour_magasin`. Fraîcheur = horodatage du dernier succès. Interactif.
- Écran magasin du jour : requête directe seulement si le filtre magasin et jour répond dans le temps d'un écran, sinon import horaire de la partition du jour.
- Interdit : requête directe sur l'historique des lignes pour « éviter les actualisations ».

L'actualisation n'est pas un échec de fraîcheur. C'est le rendez-vous que vous avez fixé, mesuré, et rendu visible. La requête directe est une autre promesse : l'entrepôt répond maintenant, sur un périmètre que vous avez rétréci exprès. Vous ne la faites pas tenir par une formule de CA différente « le temps que ce soit plus rapide ».

# Exercices

## Exercice 1 : La revue qui rame

La page de direction est en requête directe sur `fct_ventes`. Douze visuels, aucun filtre obligatoire, plusieurs années. Chaque clic met une dizaine de secondes. On vous demande de « garder le direct, c'est plus frais ». Que changez-vous, et quelle fraîcheur la revue a-t-elle vraiment besoin d'avoir ?

<details>
<summary>Voir la solution</summary>

La revue commente un matin arrêté, pas le ticket de la minute. Vous passez la page en import sur `mart_ventes_jour_magasin`, mesures inchangées, horodatage du dernier succès visible. L'actualisation suit la partition du mois.

Garder le direct sur le fait entier préserve une fraîcheur que la décision n'utilise pas, et retire l'interactivité qu'elle utilise. Si un visuel doit vraiment voir le jour en cours plus souvent que la nuit, vous actualisez l'agrégat du mois courant dans la journée. Vous ne laissez pas douze requêtes balayer l'historique.

</details>

## Exercice 2 : L'écran de caisse

Un magasin veut un écran : CA du jour, dans ce magasin, rafraîchi sans attendre le lendemain. L'entrepôt répond en moins d'une seconde si la requête filtre `magasin_id` et `jour = current_date`. Au-delà d'une semaine d'historique, elle dépasse cinq secondes. Quel mode, quel grain, et quel nom de mesure ?

<details>
<summary>Voir la solution</summary>

Requête directe acceptable, parce que la fraîcheur change la lecture du chef de magasin et que le filtre tient. Le grain servi est le jour courant de ce magasin, pas `fct_ventes` entier ouvert dans un modèle de revue.

La mesure s'appelle `CA HT`, la même somme de `montant_ht_signe`, pas `CA temps réel` avec une formule raccourcie. Le filtre magasin vient du rôle ou d'un paramètre contraint, pas d'un slicer que l'écran peut élargir à tout le réseau. L'historique au-delà du jour reste dans l'import de l'agrégat. L'écran ne le réclame pas en direct.

</details>

## Exercice 3 : Deux CA pour aller plus vite

Pour accélérer la requête directe, un rapport remplace `CA HT` par la somme des montants positifs seulement : moins de lignes, page plus rapide, chiffre plus haut. Le modèle importé de la direction, lui, garde la mesure officielle. Que dites-vous, et où se règle la lenteur ?

<details>
<summary>Voir la solution</summary>

Vous refusez la formule. Les montants positifs ignorent les retours déjà signés. Le nom `CA HT` ment, et la direction ne pourra plus comparer l'écran au modèle importé. La vitesse ne s'achète pas avec un autre périmètre.

La lenteur se règle par le grain et le filtre : agrégat, magasin, jour, partition. La mesure reste `SUM` de `montant_ht_signe` des deux côtés. Un test sur un jour connu doit donner le même CA dans l'écran et dans l'agrégat importé. S'il diffère, on ne livre pas l'écran.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Import ou direct"
center: "L'import rend la revue interactive. La requête directe ne s'ouvre que pour une fraîcheur utile, sur un filtre que l'entrepôt tient."
points:
  - icon: zap
    title: "Import"
    text: "Agrégat jour par magasin en copie. Les clics du lundi ne rappellent pas l'entrepôt."
  - icon: clock
    title: "Direct"
    text: "Seulement si le chiffre doit bouger avant la prochaine actualisation, et si la requête est courte."
  - icon: gauge
    title: "Le volume décide"
    text: "Un magasin, un jour : possible. Plusieurs années de lignes, sans filtre : non."
  - icon: layers
    title: "Le modèle suit"
    text: "En direct, sommes et quotients simples. Le signe et le périmètre restent dans dbt."
  - icon: scale
    title: "Même CA"
    text: "Les deux modes publient CA HT. Aucun ne retire les retours pour aller plus vite."
pitfall: "Passer tout l'historique en requête directe pour éviter les actualisations fige la revue à chaque clic."
remember: "Vous choisissez le mode selon la décision et le volume. La définition du CA ne change pas avec le mode."
```
