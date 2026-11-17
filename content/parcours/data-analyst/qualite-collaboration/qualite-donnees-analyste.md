---
title: La qualité des données, côté analyste
description: "Contrôler volumes, valeurs manquantes, clés et bornes avant de conclure, rapprocher un chiffre de la finance, signaler un incident et refuser de corriger un écart en silence dans un classeur."
duration: 55
objectives:
  - Exécuter les contrôles minimaux avant de commenter un indicateur
  - Rapprocher un total analytique d'un chiffre finance et expliquer l'écart qui reste
  - Signaler un incident de données avec son périmètre, sans attendre un diagnostic parfait
  - Refuser une correction silencieuse qui ferait diverger le classeur et le rapport officiel
---

# Les contrôles avant de conclure

Le Data Engineer pose des tests dans le pipeline. Vous, vous êtes souvent la dernière personne à voir le chiffre avant qu'il ne serve une décision. Vos contrôles ne remplacent pas les siens. Ils répondent à une question plus étroite : **est-ce que je peux commenter cette extraction aujourd'hui ?**

Quatre familles suffisent pour la plupart des briefs. Faites-les avant le graphique, sur le grain de votre analyse.

**Volumes.** Le nombre de lignes, de clients ou de commandes est-il dans la bande habituelle ? Comparez au même jour de semaine, pas seulement à hier (le lundi n'est pas le dimanche). Une chute de 40 % un mardi, sans fait métier connu, est un arrêt. Vous n'expliquez pas « les clients ont disparu » tant que l'ingestion n'est pas innocentée.

**Valeurs manquantes.** Le taux de `NULL` sur les colonnes qui portent la décision (canal, montant, date, identifiant magasin) a-t-il bougé ? Passer de 1 % à 12 % de canaux vides change un mix, même si le total des ventes tient. Comptez les vides à part, ne les rangez pas dans « autre » sans le dire.

**Clés.** L'identifiant que vous croyez unique l'est-il ? Des `commande_id` en double doublonnent le chiffre d'affaires dès que vous sommez. Une clé de jointure qui ne trouve pas (commandes sans magasin, paiements sans commande) se mesure en lignes et en montant, pas en « quelques orphelins ».

**Bornes.** Des montants négatifs inexpliqués, des dates dans le futur, un taux de conversion supérieur à 100 %, un panier à 80 000 € qui n'est pas une commande B2B connue, une quantité à zéro. Une borne n'a pas besoin d'être statistique : elle a besoin d'être **impossible ou rare** dans ce métier, et revue quand elle sonne.

```diagram
type: flow
title: Quatre contrôles avant le premier graphique
steps:
  - title: Volumes
    text: Même jour de semaine, pas seulement hier
    tone: blue
  - title: Nulls
    text: Taux de vide sur les colonnes de la décision
    tone: amber
  - title: Clés
    text: Unicité et jointures orphelines, en lignes et en euros
    tone: violet
  - title: Bornes
    text: Dates, taux impossibles, montants hors métier
    tone: rose
```

Écrivez le résultat des contrôles en deux lignes dans la note, même quand tout va bien : « Volumes de commandes dans ±5 % des quatre mardis précédents. Aucun doublon sur `commande_id`. 0,4 % de montants négatifs, tous identifiés comme avoirs. » Le jour où ça ne va pas, vous avez déjà l'habitude de le dire.

# Rapprocher avec la finance

Un indicateur qui porte le même nom que le chiffre du contrôle de gestion doit pouvoir s'y **retrouver**, ou l'écart doit être expliqué ligne à ligne. « Ce n'est pas tout à fait la même chose » n'est pas une explication. C'est le début d'une liste.

Cas concret. Votre extraction de mars donne 4,20 M€ de « chiffre d'affaires ». La finance publie 3,92 M€. L'écart de 280 k€ n'est pas une erreur tant qu'il n'est pas décomposé. Pistes ordinaires, à cocher plutôt qu'à deviner :

- **Périmètre.** Vous avez inclus les franchisés, la finance ne consolide que les succursales. Ou l'inverse.
- **Unité.** TTC contre HT, remises déjà déduites ou non, frais de livraison dans le montant.
- **Date.** Date de commande contre date de facture ou date d'expédition. Un pic du 31 mars bascule en avril chez l'un et pas chez l'autre.
- **Avoirs.** Vous comptez les commandes brutes, la finance déduit les retours du mois, y compris sur des commandes de février.
- **Exclusions.** Comptes test, ventes au personnel, inter-sociétés, commandes annulées le lendemain.
- **Devise et arrondi.** Conversion figée au jour de commande contre taux mensuel finance.

Construisez un pont, du total analytique vers le total finance :

| Étape | Montant | Commentaire |
|---|---|---|
| Extraction analyste, mars, TTC | 4,20 M€ | Commandes payées, date de commande |
| Passage en HT | −0,18 M€ | TVA |
| Retours constatés en mars | −0,07 M€ | Y compris commandes de février |
| Hors franchisés | −0,04 M€ | Périmètre finance |
| Reste non expliqué | 0,01 M€ | À trancher avant le comité |

Le reste non expliqué a un seuil convenu avec la finance (par exemple moins de 1 % et moins de 20 k€). Au-delà, vous ne publiez pas « le CA de mars ». Vous publiez les deux chiffres et le pont, ou vous attendez.

> [!NOTE]
> Le rapprochement se fait sur une **période close**. Comparer votre temps réel de mardi à la clôture mensuelle n'a pas de sens. Dites quelle version est officielle pour quelle décision : le flash quotidien n'est pas le chiffre certifié.

# Signaler un incident

Un incident de données, côté analyste, commence dès qu'un contrôle empêche de faire confiance au chiffre **et** que quelqu'un pourrait quand même s'en servir. Vous n'attendez pas de connaître la cause technique. Vous attendez encore moins que le comité le découvre tout seul.

Le signal tient en peu de lignes, envoyées au propriétaire de la table et aux gens qui allaient décider :

- **Quoi.** Quel indicateur, quelle table, quel rapport.
- **Depuis quand.** Premier jour ou première heure anormale, et ce qui est encore fiable (« jusqu'au 14 novembre inclus »).
- **Symptôme.** Volume, doublons, montant, fraîcheur. Un ordre de grandeur de l'erreur si vous l'avez, clairement marqué comme estimation.
- **Qui est exposé.** Le rapport des ventes est partagé, la capture d'hier circule déjà ou non.
- **Quoi faire en attendant.** Ne pas commenter le mardi. Utiliser le flash finance. Ne pas recoller l'ancien fichier.
- **Qui suit.** Votre nom, le ticket, l'heure. Vous mettrez la cause à jour quand elle sera connue (release, filtre de consentement, fichier partenaire en retard).

```diagram
type: sequence
title: Signaler sans attendre la cause
actors: [Analyste, Équipe data, Décideurs]
messages:
  - from: 0
    to: 1
    text: Symptôme, période, ticket
  - from: 0
    to: 2
    text: Ce qu'il ne faut plus citer
  - from: 1
    to: 0
    text: Cause et heure de correction
  - from: 0
    to: 2
    text: Chiffre rétabli, ou écart restant
```

Un incident n'est pas une humiliation. Un chiffre faux annoncé comme vrai en est une. Prévenez tôt, même si le message dit « je ne sais pas encore si c'est le tracking ou la boutique ».

Après correction, vérifiez que l'historique a été **rejoué** sur les jours touchés, pas seulement que « demain sera bon ». Une table réparée à partir d'aujourd'hui laisse mars faux pour toujours. Redemandez le rapprochement sur la période de l'incident avant de réutiliser la série.

# Ne pas corriger en silence

Le geste interdit : ouvrir l'export, repérer 200 commandes doublonnées, les supprimer dans le classeur, refaire le graphique, et envoyer « le bon chiffre » sans trace. Le rapport officiel, lui, montre encore le mauvais. La finance n'a pas le même total. Dans trois semaines, personne ne sait pourquoi votre note disait 3,8 M€.

Corriger en silence casse trois choses.

- **La reproductibilité.** Personne ne refait votre geste, vous non plus.
- **La confiance.** Deux chiffres officieux circulent, chacun « vérifié ».
- **La correction réelle.** L'équipe data ne voit pas le doublon, donc il reviendra dimanche.

Ce que vous faites à la place.

1. Vous **stoppez** l'usage du chiffre pour la décision.
2. Vous **documentez** l'anomalie (requête, nombre de lignes, montant, exemple d'identifiants) dans le ticket, pas seulement dans un onglet caché.
3. Si une décision ne peut pas attendre, vous produisez un **chiffre de travail** explicitement nommé ainsi, avec la règle écrite (« hors 200 `commande_id` en double, liste en annexe »), et vous le distinguez du chiffre certifié.
4. Vous ne remplacez pas la source. Le correctif durable est dans la table ou dans la définition, revue avec l'équipe data et, s'il change un KPI, avec la finance.

> [!WARNING]
> Une colonne « montant_corrigé » dans un fichier personnel n'est pas une définition. Le jour où vous êtes absent, le comité ouvrira le rapport, pas votre colonne.

Le même interdit vaut pour les filtres « que vous seuls connaissez » : exclure trois magasins parce qu'ils gênent la courbe, sans ligne dans la note. Une exclusion métier (entrepôt sinistré, cession d'une filiale) est légitime si elle est **dite**, datée, et appliquée de la même façon au comparatif.

Gardez la trace minimale : la requête, la date d'extraction, le total avant exclusion, le total après, le nom du ticket. C'est assez pour qu'un pair reprenne le dossier. Ce n'est pas assez pour maquiller un écart.

# Le flash et le mois clos

Tous les contrôles n'ont pas le même contrat. Le **flash** du matin sert à piloter la journée : il accepte un périmètre étroit (commandes payées, date de commande, hier complet) et une fraîcheur affichée. Le **mois clos** sert à la finance et aux primes : il n'est commenté qu'une fois le pont terminé, avoirs inclus, périmètre aligné.

Mélanger les deux est une erreur de qualité, pas seulement de communication. Annoncer le flash de mardi comme « le chiffre de mars » parce que le mois vient de se terminer, c'est publier une version que la clôture va encore bouger (retours, factures datées autrement, écritures d'inventaire). À l'inverse, refuser de donner le flash parce qu'il n'est pas égal à la clôture bloque des décisions qui n'ont pas besoin de la clôture.

Écrivez le contrat en tête du chiffre.

- Flash : « hier, commandes payées HT, date de commande, actualisé à 7 h, non opposable à la clôture ».
- Mois clos : « mars facturé HT, pont finance sous le seuil, version du 8 avril ».

Si un contrôle de volume échoue sur le flash, vous suspendez **le flash**, pas forcément le mois clos déjà rapproché. Si le pont du mois clos laisse 4 % inexpliqués, vous suspendez **le mois**, même si le flash quotidien avait l'air sage. Chaque contrat a ses contrôles, et l'échec de l'un ne se répare pas en citant l'autre.

# Exercices

## Exercice 1 : Quel contrôle sonne ?

Vous préparez le flash de mardi. La table `mart_commandes` donne, pour le lundi : 1 200 commandes contre environ 1 150 les quatre lundis précédents, aucun `commande_id` en double, montants entre 5 € et 900 €. En revanche, `canal` est vide sur 30 % des lignes, contre 2 % d'habitude, et ces lignes pèsent 28 % du montant. Le total des ventes est cohérent avec le prestataire de paiement. Pouvez-vous commenter le mix par canal ?

<details>
<summary>Voir la solution</summary>

Vous pouvez commenter le **total**, avec prudence, parce que le volume, les clés, les bornes et le rapprochement paiement tiennent. Vous ne pouvez pas commenter le **mix par canal** : 30 % de vides n'est pas un canal « autre », c'est un trou. Le ranger dans « non renseigné » et conclure que le canal e-mail s'est effondré serait faux : une partie de ces vides **est** peut-être de l'e-mail.

Vous signalez l'incident sur `canal`, vous dites depuis quand le taux de vide est anormal, et vous demandez à ne pas utiliser la répartition tant que le champ n'est pas rétabli ou expliqué (changement de tracking, nouvelle caisse, jointure ratée).

</details>

## Exercice 2 : Tenir le pont finance

Votre total HT « commandes payées, date de commande, mars » est de 1,00 M€. La finance annonce 0,91 M€ « facturé HT, mars ». Vous trouvez : 40 k€ de commandes payées le 31 mars et facturées le 2 avril ; 30 k€ de retours de février déduits en mars par la finance ; 15 k€ de ventes au personnel que vous avez gardées et qu'elle exclut. Que reste-t-il, et que dites-vous en comité si l'on vous demande « le » chiffre de mars ?

<details>
<summary>Voir la solution</summary>

Pont : 1,00 M€ − 0,040 − 0,030 − 0,015 = **0,915 M€**, à 5 k€ près du chiffre finance (0,91 M€). L'écart résiduel est petit : vous le signalez, vous ne le forcez pas à zéro en arrondissant des lignes au hasard.

En comité, vous ne dites pas un seul chiffre sans qualificatif. « 1,00 M€ de commandes payées HT en date de commande, ou 0,91 M€ facturés HT au sens finance. L'écart est expliqué par le décalage de facturation, les retours et le personnel. Pour la trajectoire commerciale du flash, nous suivons les commandes. Pour la clôture, le chiffre finance fait foi. »

</details>

## Exercice 3 : La correction silencieuse

Un doublon de jointure a gonflé le CA e-commerce de 8 % dans votre export. Le comité est dans deux heures. Un collègue a déjà « nettoyé » le fichier et veut l'envoyer. Le rapport Power BI, branché sur la même table, n'est pas corrigé. Que faites-vous des deux heures ?

<details>
<summary>Voir la solution</summary>

Vous n'envoyez pas le fichier nettoyé comme s'il était le rapport. Vous ouvrez un ticket avec un exemple de clé dupliquée, le montant gonflé (environ 8 % sur l'e-commerce, pas sur tout le réseau si c'est le cas), et la période.

Vous prévenez les participants : le rapport surestime l'e-commerce, ne pas citer le CA e-commerce de l'écran. Si la décision ne peut pas attendre, vous montrez un chiffre de travail **étiqueté**, avec la règle (dédoublonnage sur `commande_id` avant somme, liste des identifiants en annexe) et le total avant / après. Vous dites qu'il n'est pas certifié.

Vous ne corrigez pas le rapport à la main. Vous demandez un correctif de la table et un rejeu, puis un nouveau rapprochement avant de rétablir le chiffre officiel.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Qualité des données, côté analyste
center: Avant de conclure, contrôlez l'extraction, rapprochez le total, et laissez une trace si vous l'ajustez.
points:
  - icon: check
    title: Quatre contrôles
    text: Volumes, nulls, clés, bornes. Le même jour de semaine, pas seulement hier.
  - icon: money
    title: Pont finance
    text: HT, dates, avoirs, périmètre. L'écart qui reste a un seuil, pas un haussement d'épaules.
  - icon: alert
    title: Signaler tôt
    text: Quoi, depuis quand, qui est exposé, quoi ne plus citer. La cause peut attendre.
  - icon: file
    title: Trace
    text: Un chiffre de travail est nommé comme tel, avec la règle et le ticket.
  - icon: shield
    title: Pas de silence
    text: Le correctif durable est dans la table, pas dans une colonne personnelle.
pitfall: Supprimer des lignes dans le classeur pour que le total colle, sans ticket et sans prévenir le rapport officiel.
remember: Deux chiffres peuvent coexister s'ils portent deux définitions. Ils ne peuvent pas porter le même nom en secret.
```
