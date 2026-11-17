---
title: "Fraîcheur promise du mart"
description: "Ventes Halte est promis avant 7 h. Si le mart n'a pas bougé, l'alerte part et Nora reçoit un message clair. La fraîcheur mesure l'âge de la donnée, pas la vitesse de la requête."
duration: 35
objectives:
  - "Tenir l'heure de fraîcheur promise sur le mart, avant 7 h"
  - "Déclencher une alerte quand le mart n'a pas bougé"
  - "Écrire le message que l'analyste peut lire avant la revue"
  - "Séparer la fraîcheur de la performance d'une requête"
---

# L'heure que l'on a promise

La direction de Halte et les responsables de région lisent les ventes **après 7 h**, fuseau **Europe/Paris**, les jours ouvrés. Cette heure n'est pas l'heure à laquelle Lina aimerait que le chargement finisse. C'est l'heure écrite dans le contrat du mart : à 7 h, `fct_ventes` contient les tickets jusqu'à la clôture de la veille.

La promesse porte sur le **mart**, pas sur la caisse seule et pas sur le temps d'ouverture d'un visuel. Une source arrivée à 5 h ne sert à rien si la transformation échoue à 6 h. Un écran qui s'ouvre à 7 h 01 sur les données d'avant-hier tient la performance et rate la fraîcheur.

On publie la promesse à côté du modèle, là où Nora la voit :

- nom : Ventes Halte ;
- fraîcheur : avant 7 h, Europe/Paris, jours ouvrés ;
- colonne témoin : `charge_le`, le moment où le mart a réellement bougé ;
- jour couvert : tickets dont la date magasin est la veille.

Le samedi de forte affluence ne décale pas la promesse en silence. Si un jour la fenêtre doit bouger, on change le contrat, on prévient Nora, on ne laisse pas 7 h affiché au-dessus d'un chargement de 9 h.

# Voir que le mart a bougé

« Le job est vert » ne suffit pas. Un job peut réussir sans rien charger, ou recharger la veille en croyant charger la nuit. Le témoin est la donnée.

À 7 h 05, un contrôle lit :

```sql
select max(charge_le) as dernier_mouvement
from marts.fct_ventes;
```

Le mart est **frais** si `dernier_mouvement` est dans la fenêtre de la nuit, après la clôture, et avant 7 h. Il est **arrêté** si ce maximum date d'hier matin, ou s'il est nul. On alerte aussi quand la partition du jour attendu est vide alors que les magasins ont ouvert la veille : un `max(charge_le)` récent sur de vieilles lignes est un faux mouvement.

L'alerte s'appelle `fraicheur_ventes_halte`. Elle part à 7 h 05 si le témoin n'est pas tenu. Elle ne part pas à 6 h 30 pendant que le chargement a encore le droit de finir. Elle ne se répète pas toutes les minutes : un message, puis un rappel à 8 h si personne n'a accusé réception.

```diagram
type: flow
title: "De la clôture magasin au message"
steps:
  - title: "Nuit"
    text: "Les tickets de la veille entrent, puis le mart se reconstruit"
    tone: violet
  - title: "charge_le"
    text: "L'heure réelle du mouvement, pas l'heure prévue du job"
    tone: blue
  - title: "7 h"
    text: "Promesse Europe/Paris. Le contrôle parle à 7 h 05."
    tone: teal
  - title: "Alerte"
    text: "Le mart arrêté ouvre fraicheur_ventes_halte"
    tone: amber
  - title: "Nora"
    text: "Un message : ne pas présenter, dernier jour certifié"
    tone: rose
```

# Le message à l'analyste

Nora n'a pas à ouvrir l'orchestrateur pour savoir si elle peut parler. Le message est le livrable de l'alerte. Il tient sur un écran de téléphone, avant la revue.

> Ventes Halte n'est pas frais. Dernier mouvement : hier 6 h 40 (charge_le). Promesse : avant 7 h, Europe/Paris. N'utilisez pas les ventes de ce matin. Dernier jour certifié : celui d'hier. Lina est prévenue.

Ce message dit quatre choses : le mart, l'heure réelle, l'interdiction de présenter, le repli. Il ne dit pas « incident P1 » sans heure, et il ne colle pas un journal de 200 lignes. Le journal est le lien en dessous, pour Lina.

Destinataires :

- **Nora**, systématiquement : elle est devant la salle.
- **Lina** (et le binôme de garde) : elle répare ou elle confirme le repli.
- **Camille**, seulement si le repli change le sens du chiffre (un autre périmètre, un mois incomplet présenté comme clos).
- **La direction**, en une phrase de Nora : « on lit le jour certifié d'hier », pas le stack trace.

Quand le mart est frais, on n'envoie pas de message de victoire chaque matin. Le catalogue affiche « à jour à 6 h 48 ». Le silence est le cas normal. L'alerte est l'exception que l'on croit, parce qu'elle ne sonne pas pour un chargement encore dans les temps.

# Fraîcheur et performance

La fraîcheur dit **l'âge** de la donnée. La performance dit **le temps de réponse**. Les deux se mesurent. Aucune des deux ne remplace l'autre.

| Question | Fraîcheur | Performance |
| --- | --- | --- |
| Ce qu'on mesure | `max(charge_le)` face à 7 h | Durée de la requête ou du visuel |
| Un cas tenu | Chargé à 6 h 52, requête en 25 s | Réponse en 2 s sur un mart chargé à 6 h 52 |
| Un cas raté | Réponse en 1,2 s sur des données d'hier 6 h 40 | Chargé à 6 h 52, requête en 4 min, revue bloquée |
| Le mauvais réflexe | Servir un extrait en cache pour aller plus vite | Déclarer le mart « en panne » parce qu'une requête est lente |

Une requête en 1,2 s sur le mart d'hier est une fraîcheur ratée, même si l'écran a l'air sain. Une requête en 25 s sur un mart chargé à 6 h 52 tient la promesse de 7 h. La lenteur se traite avec les leviers de performance (partition, agrégat), **sans** changer l'heure affichée et **sans** coller une alerte de fraîcheur. Inversement, mettre en cache l'extrait d'hier pour que la page s'ouvre en une seconde casse la promesse : le visuel est rapide et le chiffre est vieux.

> [!IMPORTANT]
> On n'achète pas la fraîcheur en accélérant une lecture fausse, ni la performance en élargissant l'heure promise jusqu'à ce que l'alerte se taise.

# Tenir la promesse un matin où ça glisse

Le mardi, le chargement finit à 7 h 22. À 7 h 05 l'alerte est déjà partie. C'est le comportement attendu : la promesse est 7 h, pas 7 h 30 « si la nuit a été dure ».

Lina a alors un choix écrit, pas un réflexe.

1. **Tenir le repli.** Nora présente le dernier jour certifié. On ne montre pas un mart à moitié rechargé.
2. **Attendre la fin réelle**, seulement si la revue peut glisser et si le message le dit : « mouvement à 7 h 22, chiffre utilisable ». On ne laisse pas Nora deviner.
3. **Ne pas avancer l'heure dans le catalogue** pour faire coller 7 h 22. Si 7 h n'est plus tenable trois jours de suite, on renégocie la promesse avec la direction et on change l'heure affichée. Jusque-là, l'alerte a raison.

Le contrôle de 7 h 05 ne remplace pas la réconciliation. Un mart frais peut porter un reste de CA au-dessus de 5 000 €. Fraîcheur verte et réconciliation rouge : Nora ne présente pas non plus. Les deux feux sont indépendants. Le message le dit quand les deux sont rouges, pour qu'on ne croie pas qu'un chargement tardif « répare » un écart de définition.

# Exercices

## Exercice 1 : Une seconde deux, des données d'hier

Il est 7 h 10. La requête de Nora répond en 1,2 s. `max(charge_le)` vaut hier 6 h 40. Le job de cette nuit est resté rouge. Peut-elle présenter les ventes du matin ? Que mesurez-vous : la fraîcheur, la performance, ou les deux ?

<details>
<summary>Voir la solution</summary>

Elle ne présente pas. Le mart n'a pas bougé depuis hier 6 h 40. La promesse (avant 7 h, jour ouvré) est ratée. Le temps de 1,2 s est une performance correcte sur un jeu périmé : ce n'est pas une fraîcheur tenue.

L'alerte `fraicheur_ventes_halte` aurait dû partir à 7 h 05. Le message dit l'heure réelle, l'interdiction, et le repli sur le dernier jour certifié. On ne met pas l'extrait d'hier en cache pour « garder » la seconde de réponse.

</details>

## Exercice 2 : Chargé à 6 h 52, lent à lire

Le mart a `charge_le` à 6 h 52. La requête qui somme le CA par magasin met 25 s. La revue est à 8 h. Y a-t-il un incident de fraîcheur ? Que planifiez-vous pour les 25 s, et que refusez-vous de faire ?

<details>
<summary>Voir la solution</summary>

Pas d'incident de fraîcheur : 6 h 52 est avant 7 h. On n'envoie pas le message « mart arrêté ». Nora peut présenter, en sachant que le premier affichage est lent.

Les 25 s sont une dette de performance (agrégat ou partition), à traiter sans changer la promesse. On ne sert pas un cache d'un jour plus vieux pour descendre sous la seconde. On ne décale pas non plus l'heure du catalogue à 6 h 52 pour « avoir de la marge » : la promesse reste 7 h.

</details>

## Exercice 3 : Écrire le message de 7 h 22

Le chargement se termine à 7 h 22. L'alerte est partie à 7 h 05. La réconciliation, elle, est verte (reste à 0 €). Rédigez le message à Nora et dites ce que vous ne changez pas dans le catalogue.

<details>
<summary>Voir la solution</summary>

Message : « Ventes Halte en retard. À 7 h 05, dernier mouvement : hier. Promesse : avant 7 h. Le chargement a fini à 7 h 22, réconciliation verte, CA utilisable à partir de maintenant. Avant 7 h 22, le dernier jour certifié était le repli. »

On ne réécrit pas la promesse à 7 h 30 dans le catalogue pour effacer l'alerte. Si ce retard se répète, on renégocie l'heure avec la direction. Camille n'est pas dans ce message : le sens du CA n'a pas changé, le reste est à 0 €. Lina confirme l'heure de 7 h 22. Nora ne devine pas entre les deux états.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Fraîcheur du mart
center: "Avant 7 h, le mart a bougé. Sinon Nora reçoit un message. Une requête rapide ne rajeunit pas la donnée."
points:
  - icon: clock
    title: Promesse 7 h
    text: "Europe/Paris, jours ouvrés. L'heure affichée est celle du contrat, pas celle du job."
  - icon: database
    title: charge_le
    text: "Le témoin est le max du mouvement réel. Un job vert sans lignes nouvelles ne compte pas."
  - icon: alert
    title: Alerte 7 h 05
    text: "fraicheur_ventes_halte si le mart est arrêté. Un rappel à 8 h s'il n'y a pas d'accusé."
  - icon: chat
    title: Message à Nora
    text: "Heure réelle, ne pas présenter, dernier jour certifié. Pas un journal de 200 lignes."
  - icon: gauge
    title: Deux mesures
    text: "L'âge de la donnée et le temps de réponse. Un cache d'hier accélère un chiffre faux."
pitfall: "Afficher 7 h dans le catalogue alors que le chargement finit à 9 h, ou couper l'alerte pour faire taire le retard."
remember: "Fraîcheur verte et réconciliation rouge : on ne présente pas. Les deux feux se lisent ensemble."
```
