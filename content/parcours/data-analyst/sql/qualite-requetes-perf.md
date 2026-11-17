---
title: Qualité et performance des requêtes
description: "Lire un résultat avec méfiance, tenir compte du grain, des dates et des fuseaux, demander un index sans administrer la base, et laisser des requêtes et des vues qu'un collègue peut relire."
duration: 55
objectives:
  - Contrôler grain, filtres de dates et fuseaux avant d'interpréter un chiffre
  - Lire un EXPLAIN au niveau utile à l'analyste et formuler une demande d'index
  - Écrire des requêtes commentées et proposer une vue pour une définition partagée
---

# Lire un résultat avec méfiance

Un résultat qui s'affiche n'est pas un résultat juste. La base a exécuté ce que vous avez écrit, y compris le filtre oublié et la jointure qui double. Le scepticisme du premier chapitre se traduit ici en contrôles, avant la phrase que vous direz en réunion.

Vous recomptez des choses que vous connaissez déjà. Le nombre de commandes payées de janvier, lu dans la requête, se compare au total du tableau de bord validé, ou à un `count(*)` sur la seule table `commandes` avec le même filtre. S'ils divergent, vous ne commentez pas la baisse. Vous cherchez l'écart. Les suspects habituels : statut trop large, jointure vers les articles, comptes de test inclus, mois entamé comparé à un mois clos, fuseau qui déplace le 1er du mois.

Fil & Cie a déjà vécu le CA « trop bon » un lundi matin. La requête était syntaxiquement parfaite. Elle joignait les lignes d'article et sommait le montant commande. Le contrôle de lignes (18 000 commandes devenues 52 000) aurait suffi. Il n'avait pas été fait. La règle tient en une ligne : un chiffre que vous ne pouvez pas recouper n'est pas publiable.

```diagram
type: flow
title: Avant de croire le chiffre
steps:
  - title: Grain
    text: Compter les lignes avant et après chaque jointure
    tone: amber
  - title: Filtre
    text: Statuts, tests, période close
    tone: blue
  - title: Fuseau
    text: Le mois métier, pas le mois de la session
    tone: teal
  - title: Recoupement
    text: Le même total, par un second chemin
    tone: violet
```

> [!WARNING]
> Un export « pour aller vite » sans date d'extraction ni fuseau ne se réconcilie plus le lendemain. Notez les deux dans le commentaire de la requête, pas dans votre mémoire.

# Dates, grains et fuseaux

Le grain se contrôle avec des comptages, pas avec l'intuition. `count(*)` après jointure compte des couples. `count(distinct c.id)` compte des commandes dans un résultat déjà démultiplié, et masque parfois le problème au lieu de le montrer. Vous affichez les deux. S'ils diffèrent, vous expliquez pourquoi avant de sommer.

Les dates se filtrent en intervalle semi-ouvert, sur des semaines ou des mois complets. La semaine en cours est un piège régulier : son CA est plus petit parce qu'elle n'est pas finie, pas parce que les ventes se sont effondrées. Vous l'excluez des comparaisons, ou vous la comparez au même nombre de jours. Le libellé du graphique dit « semaines closes ».

`passee_le` est un `timestamptz` : un instant, pas une date murale. `date_trunc('month', passee_le)` tronque dans le fuseau de la session. Si la session est en UTC et que la boutique vit à Paris, une commande du 1er avril 2026 à 00 h 20 heure de Paris tombe le 31 mars à 22 h 20 UTC. Le mois change selon la personne qui ouvre l'outil. Pour un chiffre Fil & Cie, le mois métier est celui de Paris. Vous le forcez.

```sql
SELECT
    date_trunc('month', passee_le AT TIME ZONE 'Europe/Paris') AS mois_paris,
    sum(montant_ht) AS ca_ht
FROM commandes
WHERE statut = 'payee'
  AND passee_le >= TIMESTAMPTZ '2026-04-01 00:00:00+02'
  AND passee_le <  TIMESTAMPTZ '2026-05-01 00:00:00+02'
GROUP BY 1;
```

`AT TIME ZONE 'Europe/Paris'` sur un `timestamptz` donne l'heure murale parisienne, et `date_trunc` s'applique à cette heure-là. Le `+02` des bornes est le décalage d'été en avril. En janvier, le même minuit s'écrit `+01`. Un horodatage sans décalage est lu dans le fuseau de la session, souvent UTC, et le bug de début de mois revient. Quand la période traverse le changement d'heure, une seule constante ne suffit plus. Vous le signalez, et la définition de métrique nomme le fuseau. Vous ne mélangez pas, dans le même tableau, un mois tronqué en UTC et un mois tronqué à Paris.

| Contrôle | Question | Signe que c'est faux |
| --- | --- | --- |
| Lignes | Le nombre de lignes a-t-il bougé après le JOIN ? | CA proche d'un multiple du total commande |
| Période | La dernière semaine est-elle close ? | Une baisse qui disparaît en l'enlevant |
| Fuseau | Le mois est-il celui de Paris ou celui de la session ? | Des commandes du 1er qui changent de mois |
| Population | Les e-mails internes sont-ils exclus ? | Un pic le jour d'un test de paiement |

# Lire un plan sans devenir administrateur

`EXPLAIN` montre comment le moteur compte s'y prendre. Sans `ANALYZE`, PostgreSQL n'exécute pas la requête. Vous n'avez pas à lire chaque nœud. Vous cherchez si le plan ressemble à la question. Un filtre sur un mois récent, dans une table de plusieurs années, ne devrait pas avoir l'air de relire toute l'histoire à chaque fois. S'il en a l'air, vous n'ajoutez pas un index vous-même en production. Vous apportez le plan à la personne qui administre la base.

```sql
EXPLAIN
SELECT id, client_id, montant_ht
FROM commandes
WHERE statut = 'payee'
  AND passee_le >= TIMESTAMPTZ '2026-04-01 00:00:00+02'
  AND passee_le <  TIMESTAMPTZ '2026-05-01 00:00:00+02';
```

Vous repérez trois mots. `Seq Scan` sur `commandes` : lecture séquentielle de la table. Ce n'est pas un défaut en soi sur une petite table, ou quand vous lisez vraiment presque toutes les lignes. C'en est un si vous ne vouliez qu'un mois sur cinq ans. `Index Scan` ou `Bitmap Index Scan` : le moteur part d'un index. Les nombres de lignes estimées (`rows`) se comparent à ce que vous savez. Une estimation de 50 lignes là où avril a 40 000 commandes payées dit que les statistiques sont à côté, ou que le filtre n'est pas celui que vous croyez. Vous ne réglez pas la mémoire du serveur. Vous signalez l'écart.

`EXPLAIN ANALYZE` exécute pour de vrai et ajoute les durées. Vous ne le lancez pas, à 9 h, sur une jointure que vous n'avez pas encore bornée, contre la base opérationnelle. Vous le lancez sur l'entrepôt, ou sur une requête déjà filtrée, en prévenant si l'usage est partagé. Le plan est un argument. Une capture du nœud le plus lourd, collée au ticket, vaut mieux qu'une capture illisible de deux cents lignes.

> [!NOTE]
> Deux exécutions ne prennent pas le même temps : cache froid, charge du matin, requête voisine. Un chiffre de durée isolé ne prouve pas qu'il faut un index. La forme du plan et la fréquence de la question pèsent plus.

# Ce que vous pouvez demander comme index

Un index accélère certains filtres et certains tris, et il ralentit les écritures. Ce compromis n'est pas le vôtre. Votre rôle est de décrire le besoin avec assez de précision pour qu'on puisse le juger. « C'est lent, il faut des index » ne se traite pas. « Ces trois requêtes filtrent toujours le statut payé et un intervalle sur `passee_le`, elles tournent chaque lundi, et le plan montre un parcours de toute la table » se traite.

Vous pouvez demander un index sur `passee_le`, ou un index limité aux commandes payées, si ce filtre est vraiment stable. Vous listez les requêtes, pas une liste de colonnes « au cas où ». Vous précisez ce que vous ne filtrerez pas : si demain le comité veut tous les statuts, l'index limité aux payées ne servira plus. L'ingénierie voit ce que vous ne voyez pas : volume d'écritures, index déjà présents, table découpée par mois.

```sql
-- Besoin, pas un ordre. Les requêtes du lundi filtrent statut = 'payee'
-- et un intervalle sur passee_le. Le plan actuel lit toute la table.
-- Un index adapté à ce filtre éviterait le parcours complet.
-- À valider côté ingénierie. Je ne le crée pas en production.
SELECT id, montant_ht
FROM commandes
WHERE statut = 'payee'
  AND passee_le >= TIMESTAMPTZ '2026-04-01 00:00:00+02'
  AND passee_le <  TIMESTAMPTZ '2026-05-01 00:00:00+02';
```

Vous pouvez aussi alléger la requête sans index, et c'est souvent le premier levier. Borner la période. Ne joindre que les tables nécessaires. Agréger avant de joindre, pour ne pas trimballer les articles si la question est au grain commande. Sélectionner dix colonnes plutôt que tout. Ces gestes vous appartiennent. L'index ne vous appartient pas, tant que vous n'êtes pas la personne responsable de la base.

```diagram
type: sequence
title: Demander un index
actors:
  - Analyste
  - Plan
  - Ingénierie
messages:
  - from: 0
    to: 1
    text: Filtre récurrent, période bornée, EXPLAIN
  - from: 0
    to: 2
    text: Requêtes, fréquence, extrait du plan
  - from: 2
    to: 0
    text: Index créé seulement si le coût d'écriture est acceptable
```

# Une requête qu'on relit

Une requête lisible n'est pas une requête courte à tout prix. C'est une requête dont la phrase métier se retrouve dans les noms. CTE nommées, une colonne par ligne, alias stables (`c`, `cl`, `l`), filtres groupés : statut, puis dates, puis exclusions. Le commentaire dit la règle et la date de validation. Il ne répète pas le mot `SELECT`.

```sql
-- CA HT des commandes payées, mois calendaires Europe/Paris.
-- Définition validée le 12 mars 2026 : statut payee uniquement.
-- Hors remboursements et hors annulées.
-- Les comptes internes s'excluent en joignant clients, pas ici.

WITH payees AS (
    SELECT
        id,
        client_id,
        passee_le AT TIME ZONE 'Europe/Paris' AS passee_paris,
        montant_ht
    FROM commandes
    WHERE statut = 'payee'
)
SELECT
    date_trunc('month', passee_paris) AS mois_paris,
    count(*)                          AS nb_commandes,
    sum(montant_ht)                   AS ca_ht
FROM payees
GROUP BY 1
ORDER BY 1;
```

Vous rangez la requête là où le prochain analyste la trouvera : dépôt partagé, outil de requêtes avec un titre, pas seulement l'historique de votre session. Le titre reprend la métrique et le grain, par exemple « CA HT payé par mois, fuseau Paris ». Un titre du genre `requete_finale_v7` est un avertissement. La v7 et la v3 circuleront ensemble.

Le formatage se discute d'équipe en équipe. Ce qui ne se discute pas : le même calcul ne s'écrit pas de deux façons sous deux noms. Si vous corrigez un filtre, vous corrigez le commentaire. Un commentaire faux est pire qu'un commentaire absent, parce qu'on lui fait confiance.

# Une vue pour une définition partagée

Une vue est une requête nommée dans la base. Elle ne copie pas les données. Elle rejoue le `SELECT` à chaque lecture. Elle sert à figer « commande payée » pour que le lundi de dans trois mois utilise le même filtre que vous. Elle ne sert pas à cacher une jointure que personne ne comprend plus.

```sql
CREATE VIEW commandes_payees AS
SELECT
    id,
    client_id,
    passee_le,
    montant_ht
FROM commandes
WHERE statut = 'payee';
```

Vous n'avez souvent pas le droit de lancer ce `CREATE` en production. Vous proposez le SQL dans le ticket, avec un exemple de contrôle : nombre de lignes et CA sur un mois clos, à comparer à un chiffre déjà accepté. Vous listez les colonnes. Une vue écrite avec `SELECT *` change le jour où quelqu'un ajoute une colonne, et tous les exports en aval bougent.

Une vue n'est pas un index et n'est pas plus rapide que la requête qu'elle contient. Si le besoin est un agrégat lourd relu très souvent, l'ingénierie parlera peut-être de vue matérialisée, recalculée sur un rythme connu. Vous ne la promettez pas dans la note au comité. Vous décrivez le besoin : fraîcheur, fréquence, grain.

Deux vues qui s'appellent toutes les deux `ca_ht` et qui ne filtrent pas pareil sont un incident, du même ordre que deux classeurs. Une vue, une définition, un propriétaire. Quand le métier change d'avis (les commandes expédiées comptent désormais comme des ventes), on change la vue explicitement, on note la date, et on sait que l'historique publié avant cette date n'est plus comparable sans le dire.

> [!TIP]
> Avant de proposer une vue, vérifiez qu'elle n'existe pas déjà sous un autre nom. La deuxième définition du CA est le bug que ce chapitre cherche à empêcher.

# Exercices

## Exercice 1 : Le mois qui change de camp

La session SQL est en UTC. Fil & Cie raisonne en heure de Paris. Une commande est passée le 1er avril 2026 à 00 h 20, heure de Paris, soit le 31 mars à 22 h 20 UTC. `date_trunc('month', passee_le)` dans cette session la range en mars.

Expliquez l'erreur d'interprétation si vous publiez « le CA d'avril ». Écrivez l'expression qui aligne le mois sur Paris, et le filtre de bornes pour avril 2026 en tenant compte du décalage d'été (`+02` à cette date).

<details>
<summary>Voir la solution</summary>

La commande est une vente d'avril pour la boutique, et une vente de mars pour une troncature UTC. Publié tel quel, le CA d'avril est trop faible et celui de mars trop fort. Le décalage se répète à chaque début de mois, autour de minuit. Ce n'est pas une baisse commerciale.

Mois métier :

```sql
date_trunc('month', passee_le AT TIME ZONE 'Europe/Paris')
```

Filtre d'avril 2026, heure d'été :

```sql
passee_le >= TIMESTAMPTZ '2026-04-01 00:00:00+02'
AND passee_le <  TIMESTAMPTZ '2026-05-01 00:00:00+02'
```

Le `+02` est le décalage de Paris à ces dates. Un horodatage écrit sans fuseau serait lu selon la session, donc ici en UTC, et le bug resterait. On documente dans la définition de métrique : mois civils Europe/Paris, semaines closes uniquement.

</details>

## Exercice 2 : Que demander, et que ne pas lancer

Chaque lundi, la même requête filtre `statut = 'payee'` et un mois sur `passee_le`. `EXPLAIN` montre un `Seq Scan` de `commandes`, table qui couvre cinq ans. La requête met plus d'une minute. Un collègue propose trois gestes : lancer `EXPLAIN ANALYZE` sur la base opérationnelle à 9 h sans filtre pour « voir », créer tout de suite trois index au cas où, envoyer un ticket avec le SQL, la fréquence et l'extrait du plan.

Dites lequel vous faites, ce que vous changez d'abord dans la requête si le mois n'était pas borné, et pourquoi vous ne créez pas l'index vous-même.

<details>
<summary>Voir la solution</summary>

Vous envoyez le ticket : requête, fait qu'elle tourne chaque lundi, extrait qui montre le `Seq Scan`, et le filtre réel (statut payé, intervalle de dates). C'est une demande d'index argumentée, pas un ordre. L'ingénierie juge le coût en écriture et les index déjà là.

Vous ne lancez pas `EXPLAIN ANALYZE` sans borne, à 9 h, sur la base opérationnelle. `ANALYZE` exécute. Un parcours non filtré à cette heure gêne ceux qui vendent. Sur l'entrepôt, avec la période déjà dans le `WHERE`, la durée mesurée peut compléter le ticket.

Vous ne créez pas trois index au cas où. Un index se paie à chaque écriture, et un index qui ne correspond pas au filtre stable ne sert pas lundi. Si la requête n'avait pas de borne de mois, le premier geste serait de l'ajouter : lire cinq ans alors qu'on commente avril est un problème de requête, pas un manque d'index. Sélectionner les colonnes utiles et éviter une jointure vers les articles vont dans le même sens, et ils sont de votre ressort.

</details>

## Exercice 3 : Vue ou commentaire mort

Deux analystes calculent le CA HT. L'un filtre `statut = 'payee'`. L'autre prend `statut <> 'annulee'`. On vous demande une vue `commandes_payees` et un commentaire dans le SQL pour que ce soit clair.

Proposez le `SELECT` de la vue (colonnes explicites), le contrôle que vous joignez au ticket, et le commentaire. Expliquez pourquoi un commentaire seul, dans le fichier de l'un des deux, ne suffit pas, et pourquoi une étoile dans le `SELECT` de la vue est un mauvais contrat.

<details>
<summary>Voir la solution</summary>

```sql
-- Commandes au statut payee uniquement.
-- Validé le 12 mars 2026. Ne pas élargir à tout sauf annulé :
-- remboursee et les statuts futurs ne sont pas des ventes.
-- Fuseau et comptes internes : voir la définition de métrique, pas cette vue.

CREATE VIEW commandes_payees AS
SELECT
    id,
    client_id,
    passee_le,
    montant_ht
FROM commandes
WHERE statut = 'payee';
```

Contrôle joint au ticket : sur janvier 2026, le nombre de lignes et la somme de `montant_ht` de la vue, comparés au chiffre déjà accepté pour ce mois. On note la date du contrôle.

Un commentaire dans le fichier personnel du premier analyste ne change pas la requête du second. La vue est le point commun, à condition qu'il n'en existe pas une autre sous un nom voisin. Une étoile dans le `SELECT` embarquerait demain une colonne ajoutée à `commandes` (adresse, commentaire interne) dans tous les exports qui lisent la vue. La liste explicite fige le contrat.

La vue ne rend pas le calcul plus rapide. Elle aligne la définition. Si les deux chiffres (payées seules, et tout sauf annulé) ont déjà circulé, on le dit : les séries d'avant la date de bascule ne se comparent pas sans une note.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Douter, puis partager
center: "Un chiffre publiable se recoupe. Le mois a un fuseau. La définition vit dans une vue, pas dans un fichier."
points:
  - icon: eye
    title: Recouper
    text: "Même total par un second chemin. S'il diverge, on ne commente pas encore la baisse."
  - icon: clock
    title: Mois de Paris
    text: "La troncature suit la session. Minuit à Paris peut tomber la veille en UTC."
  - icon: gauge
    title: Lire le plan
    text: "Un parcours de cinq ans pour un seul mois se montre. On ne règle pas le serveur."
  - icon: key
    title: Demander l'index
    text: "Filtre, fréquence, extrait du plan. L'index se crée si l'écriture le supporte."
  - icon: file
    title: Vue nommée
    text: "Colonnes listées, statut payé, un propriétaire. L'étoile dans la vue casse le contrat."
pitfall: "Publier un mois tronqué en UTC, ou un CA joint aux articles, sans avoir recompté les lignes."
remember: "Notez le fuseau et la date d'extraction dans la requête. La mémoire ne se partage pas."
```
