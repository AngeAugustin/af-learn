---
title: Travailler avec les Data Engineers
description: "Rédiger un ticket exploitable, consommer une table certifiée plutôt que de reconstruire l'entrepôt dans un notebook, et revoir avec l'ingénierie la définition d'un indicateur avant qu'elle ne se fige."
duration: 55
objectives:
  - Rédiger une demande de donnée avec le grain, la fraîcheur et la définition
  - Consommer une table certifiée et reconnaître quand elle ne couvre pas le besoin
  - Expliquer pourquoi un notebook ne doit pas devenir un second entrepôt
  - Mener une revue de définition de KPI avec l'ingénierie et le métier
---

# Un ticket qui se réalise

Un ticket vague produit une table vague, puis trois semaines de « ce n'est pas ce que je voulais ». L'équipe data engineering n'a pas votre brief en tête. Elle a le texte que vous écrivez. Un bon ticket tient sur une page et répond à cinq questions.

**La décision.** À quoi le chiffre sert, et qui le lit. « Préparer le comité commercial du lundi » n'est pas la même contrainte que « explorer une piste, rien ne sera publié ».

**Le grain.** Ce que représente une ligne. « Une ligne par commande payée et par jour » n'est pas « une ligne par article » ni « une ligne par client et par mois ». Donnez un exemple de trois lignes fictives, avec les colonnes attendues. Les malentendus de grain sont la première cause de montants doublés.

**La fraîcheur.** L'heure à laquelle le chiffre doit être fiable, le fuseau, et ce qui se passe s'il est en retard. « Temps réel » veut souvent dire « avant 8 h, journée de la veille complète ». Écrivez l'heure. Dites si un flash incomplet est pire qu'un chiffre de la veille.

**La définition.** Numérateur, dénominateur, exclusions, unité (HT ou TTC), date qui fait foi (commande, facture, expédition). Les cas limites se listent : commande annulée le lendemain, avoir partiel, carte cadeau, commande test, multi-devises. Si vous ne les tranchez pas, ils seront tranchés dans le code, sans vous.

**Le critère d'acceptation.** Le test qui dira que la table est bonne. « Pour mars 2026, la somme de `montant_ht` égale le pont finance à 1 % près, et `commande_id` est unique. » Sans critère, la recette devient une impression.

```diagram
type: flow
title: Ce qu'un ticket de donnée doit trancher
steps:
  - title: Décision
    text: Qui décide, à quelle heure, avec quel risque si c'est faux
    tone: amber
  - title: Grain
    text: Une ligne égale quoi, avec trois exemples
    tone: blue
  - title: Fraîcheur
    text: Heure, fuseau, comportement en cas de retard
    tone: teal
  - title: Définition
    text: Inclusions, exclusions, unité, date de référence
    tone: violet
  - title: Recette
    text: Un total de contrôle et une clé unique
    tone: rose
```

Vous joignez le calcul actuel s'il existe (requête ou tableur), non pas pour qu'on le recopie aveuglément, mais pour montrer le chiffre que le métier reconnaît aujourd'hui. Et vous nommez un propriétaire métier du KPI, pas seulement vous-même comme demandeur pressé.

# Consommer une table certifiée

Une **table certifiée** (ou un modèle publié, un mart, un Explore gouverné) a un propriétaire, une définition écrite, des tests, et une fraîcheur connue. C'est votre point de départ. Pas la table brute de l'application, qui change de schéma quand une équipe produit livre une release, et qui contient les commandes test, les doublons de synchronisation et les statuts que personne ne vous a expliqués.

Avant d'ouvrir un ticket « nouvelle table », cherchez si le besoin est déjà couvert. Le catalogue (ou la documentation dbt, le wiki, le message épinglé du canal data) doit vous dire :

- le grain et la clé ;
- la définition de chaque mesure sensible ;
- l'heure de mise à jour ;
- ce qui est **hors** périmètre (franchisés, pays, historique avant 2024) ;
- le nom de la personne à qui parler si le chiffre vous semble faux.

Si la table couvre 90 % du besoin, préférez un **ajout ciblé** (une colonne, un filtre documenté) à une copie parallèle. Deux tables « commandes » divergent toujours. Le jour de l'écart, le comité vous demandera lequel est vrai, et vous n'aurez que des historiques Git à opposer.

Quand la table certifiée ne convient vraiment pas, dites pourquoi dans le ticket : grain trop grossier, date qui n'est pas celle de la décision, exclusion qui contredit la définition finance. « Je préfère mon SQL » n'est pas un argument. « La table exclut les avoirs alors que la décision de marge les exige » en est un.

> [!TIP]
> La première requête sur une table inconnue est un contrôle, pas un graphique : `COUNT(*)`, nombre de clés distinctes, minimum et maximum de date, somme d'un montant sur un mois clos que vous savez rapprocher.

# Ne pas reconstruire l'entrepôt

Le notebook est un bon endroit pour une question nouvelle, un contrôle, un graphique. Il devient un problème quand il réimplémente, en Python ou en SQL collé, ce que l'entrepôt sait déjà faire : conversion de devises, historisation d'une catégorie produit, déduplication des paiements, calendrier commercial, exclusion des tests.

Signes que vous êtes en train de reconstruire l'entrepôt.

- Un fichier de 400 lignes « à lancer dans l'ordre » que vous seul savez exécuter.
- Une sauvegarde CSV « au cas où la table changerait », qui devient la source de la note mensuelle.
- Une règle de gestion (les annulations dans les 30 minutes ne comptent pas) écrite dans le notebook et nulle part ailleurs.
- Un rafraîchissement manuel le dimanche soir, sans alerte si vous l'oubliez.

Le coût n'est pas l'élégance. Le coût est la **dérive**. L'entrepôt corrige la règle d'annulation. Votre notebook non. Pendant deux mois, deux chiffres officieux cohabitent. La personne qui vous remplace ne saura pas lequel le comité a déjà vu.

Ce que vous faites à la place : vous consommez la table certifiée, vous isolez dans le notebook **uniquement** le calcul nouveau (une cohorte, un découpage expérimental), et vous remontez toute règle durable dans un ticket. Si l'analyse doit vivre chaque lundi, elle n'a pas sa place dans un fichier lancé à la main : elle a sa place dans le modèle publié et dans le rapport, avec un propriétaire.

```diagram
type: compare
title: Où vit le calcul ?
columns:
  - title: Dans le notebook
    tone: amber
    items:
      - Question ponctuelle
      - Contrôle d'un incident
      - Prototype d'une définition, clairement brouillon
      - Graphique d'une note, à partir d'une table certifiée
  - title: Dans l'entrepôt
    tone: teal
    items:
      - Règle utilisée plus d'une fois
      - Chiffre repris par un rapport
      - Conversion, déduplication, calendrier
      - Définition à rapprocher de la finance
```

Vous avez le droit de prototyper la règle dans le notebook **pour la revue**. Vous n'avez pas le droit de laisser le prototype devenir la production parce que le ticket attend dans la file.

# Revoir la définition d'un KPI

Une définition de KPI se fige au moment où quelqu'un la code. La revoir après, quand trois rapports l'utilisent, coûte beaucoup plus cher. La revue se fait **avant**, avec trois rôles autour de la table : le métier qui décide, vous qui formulez la mesure, l'ingénierie qui devra la tenir dans le temps.

Ordre du jour court, sur un seul indicateur (pas « revoir tous les KPI »).

1. **La phrase.** « Taux de réachat à 90 jours : part des clients identifiés ayant au moins une commande payée HT au jour J qui en ont une autre entre J+1 et J+90. »
2. **Les cas limites**, décidés un par un. Le client qui annule la seconde commande compte-t-il ? Le J est-il la première commande de la vie ou n'importe quelle commande ? Les marketplaces entrent-elles ? Un avoir complet annule-t-il la commande d'origine ?
3. **Le grain de publication.** Un taux par semaine de cohorte et par canal, pas une ligne par client dans le rapport.
4. **Le rapprochement.** Quel total finance ou quel stock de commandes doit coller, et à quel seuil on ouvre un incident.
5. **La fraîcheur et l'historique.** Depuis quand la série est comparable. Une définition changée en avril ne se recolle pas sur janvier sans le dire.
6. **Le propriétaire.** Qui accepte un changement plus tard. Pas « l'équipe data » au sens large.

Sortez de la revue avec la phrase, la liste des cas, et le critère de recette. L'ingénierie en fait un modèle testé. Vous en faites la première note. Si un cas limite n'a pas été tranché, il n'est pas « un détail » : il est un futur écart de 3 % que chacun expliquera autrement.

> [!WARNING]
> Changer une définition sans versionner la série, c'est réécrire l'histoire. « On a enfin le bon taux » et « le taux a progressé » deviennent indistinguables. Notez la date de bascule et montrez l'ancienne série à côté, le temps que les lecteurs s'habituent.

Vous n'avez pas à coder le pipeline. Vous avez à ne pas signer une définition que vous ne pourriez pas réexpliquer au comité, cas limites compris. Si la revue est expédiée (« on verra à l'usage »), les cas limites seront tranchés par le premier `WHERE` venu.

# Recevoir la table et signer la recette

Le jour où la table arrive, le travail n'est pas fini. Vous jouez le **critère d'acceptation** écrit dans le ticket, sur la période convenue, et vous répondez par écrit : acceptée, acceptée avec réserve, ou refusée.

Acceptée : la clé est unique, le mois de contrôle tombe dans le seuil, le grain des trois lignes d'exemple se retrouve dans les données, la fraîcheur de ce matin est celle promise. Vous branchez alors la note ou le rapport sur cette table, et vous arrêtez le calcul parallèle.

Acceptée avec réserve : un cas limite mineur reste ouvert (les cartes cadeaux, 0,3 % du montant, non tranché en revue). Vous pouvez vous en servir pour une exploration, pas pour le chiffre du comité, tant que la réserve est visible. Vous ne « corrigez » pas les cartes cadeaux dans votre coin pour faire disparaître la réserve.

Refusée : doublons, mauvais grain, date qui n'est pas celle demandée, écart au-dessus du seuil. Vous renvoyez des exemples de clés, pas seulement « ça a l'air faux ». Vous ne publiez pas en attendant « qu'ils affinent ». Une table refusée qui alimente quand même le lundi devient la définition de fait, et la recette ne sert plus à rien.

La signature est datée. Quand la définition changera, on saura quelle version vous aviez acceptée, et l'historique ne sera pas recolle en silence.

# Exercices

## Exercice 1 : Réécrire le ticket

Ticket reçu tel quel par l'équipe data : « Besoin du CA en temps réel pour demain, comme dans Excel. Merci. » Réécrivez-le en une demande réalisable pour le flash du lundi matin, enseigne France, sans inventer de règle cachée.

<details>
<summary>Voir la solution</summary>

Décision : flash commercial du lundi 8 h 30 (Paris), trajectoire du mois. Pas une décision de clôture.

Grain : une ligne par commande payée. Colonnes : `commande_id`, `date_commande` (fuseau Paris), `canal`, `montant_ht`. Exemple de ligne décrit dans le ticket.

Fraîcheur : journée de la veille complète, disponible à 7 h. Si le chargement échoue, ne pas publier de zéro : garder le dernier jour fiable et alerter. « Temps réel » n'est pas demandé.

Définition : somme de `montant_ht` des commandes au statut payé, hors commandes test (`est_test = false`), hors TVA. Les annulations du jour même sont exclues. Les avoirs des jours suivants ne sont pas redéduits dans ce flash (écart connu avec la finance, déjà dans le pont). Date de commande, pas date de facture.

Recette : `commande_id` unique. Pour un mois clos, l'écart au pont finance habituel reste sous 1 %. Propriétaire métier : le contrôle de gestion commerce, nommé dans le ticket.

</details>

## Exercice 2 : Notebook ou modèle ?

Vous calculez chaque lundi, dans un notebook, la conversion à 7 jours. Le calcul exclut les comptes dont l'e-mail contient `test`, convertit les devises avec un taux copié dans un CSV, et retire les sessions de moins de 5 secondes. Le résultat est collé dans le rapport de direction. Que remontez-vous à l'équipe data, et que gardez-vous dans le notebook en attendant ?

<details>
<summary>Voir la solution</summary>

Vous remontez les **règles durables** : définition de la conversion à 7 jours, exclusion des comptes test (idéalement un flag, pas un `LIKE` sur l'e-mail), table de taux de change déjà maintenue, filtre éventuel des sessions fantômes s'il est validé. Le chiffre de direction ne peut pas dépendre de votre lundi matin.

En attendant le modèle, le notebook peut produire un chiffre de travail **étiqueté brouillon**, s'il part d'une table certifiée et si les règles sont écrites dans la note. Vous ne lui ajoutez pas de nouvelles exceptions chaque semaine. Dès que le modèle est recetté sur un mois de contrôle, le rapport se branche dessus et le notebook s'arrête d'être la source.

</details>

## Exercice 3 : Un cas limite en revue

Lors de la revue du taux de réachat à 90 jours, trois questions restent ouvertes. Proposez une décision par défaut argumentée, que la revue devra confirmer ou modifier, pour chacune.

1. Une seconde commande annulée dans l'heure compte-t-elle comme un réachat ?
2. Le point de départ est-il la première commande du client, ou chaque commande ouvre-t-elle une fenêtre ?
3. Un client belge sur le site France entre-t-il dans le taux « France » ?

<details>
<summary>Voir la solution</summary>

1. Non, pas dans le défaut proposé : une annulation dans l'heure ressemble à une erreur de paiement ou à un doublon, pas à un retour en magasin. On ne compte que les secondes commandes encore payées. À faire confirmer, et à tester (volume de ces annulations).
2. Pour un indicateur « les nouveaux clients reviennent-ils ? », le point de départ est la **première** commande payée, une fenêtre par client. Ouvrir une fenêtre à chaque commande mélange les habitués et répond à une autre question (fréquence). Si le métier veut la fréquence, c'est un second KPI, pas une option silencieuse du premier.
3. Non : « France » suit le pays de la commande ou du site convenu, pas le fait d'avoir croisé un client belge. Le critère exact (pays de livraison, pays du compte, site) doit être le même que dans le reste du rapport France. On l'écrit. On ne laisse pas la jointure décider.

Chaque défaut est une proposition de revue, pas une règle que vous codez seul dans un coin.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Travailler avec les Data Engineers
center: "Une définition écrite une fois, dans une table certifiée, vaut mieux qu'un notebook que vous seul relancez."
points:
  - icon: file
    title: Ticket complet
    text: Décision, grain, fraîcheur, cas limites, et un total qui servira de recette.
  - icon: database
    title: Table certifiée
    text: Propriétaire, tests, heure de mise à jour. La table brute de l'application n'est pas un raccourci.
  - icon: terminal
    title: Notebook borné
    text: Prototype et contrôle, oui. Règle durable et chiffre du lundi, non.
  - icon: users
    title: Revue de KPI
    text: Métier, analyse, ingénierie. Une phrase, des cas, une date de bascule si ça change.
  - icon: check
    title: Une seule histoire
    text: Deux SQL de « CA » finissent toujours par se contredire en comité.
pitfall: Recopier l'entrepôt dans un notebook « en attendant », puis coller ce chiffre dans le rapport chaque lundi.
remember: Si la règle n'est pas dans le ticket, elle sera décidée par une clause WHERE que vous n'aurez pas relue.
```
