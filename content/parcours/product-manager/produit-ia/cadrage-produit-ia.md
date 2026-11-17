---
title: "Cadrer un produit d'IA"
description: "Nommer la décision du matin que l'assistant assiste, l'erreur acceptable, et l'alternative par une règle, un écran ou un humain."
duration: 35
objectives:
  - "Nommer la décision assistée avant de parler d'un modèle"
  - "Distinguer une erreur acceptable d'une erreur qui casse la confiance"
  - "Comparer l'assistant à une règle, un écran ou un humain"
  - "Écrire une promesse courte que la sponsor peut signer"
---

# La décision avant le modèle

Lundi, Léa pose une phrase sur la table : « Il nous faut un assistant qui résume les retards de livraison pour le responsable de magasin. » La phrase nomme un outil. Elle ne nomme pas encore un produit. Votre travail de product manager commence avant le modèle. Vous demandez quelle décision change, pour qui, à quelle heure, et ce qui se passe si l'assistant se tait.

Chez Halte, la décision est celle de Karim, responsable du magasin pilote. Avant 8 h 15, les jours ouvrés, il doit savoir quoi faire des livraisons qui dérapent. Trois gestes, pas davantage.

1. **Appeler** le client, parce que le créneau promis est déjà dépassé et que personne ne l'a joint.
2. **Repasser en préparation**, parce que le colis est encore au magasin et que le transporteur n'est pas parti.
3. **Confier à Hugo**, au service client, parce que le client a déjà appelé ou que le cas dépasse le magasin.

L'assistant propose un brief : les retards de **ce** magasin, depuis 18 h la veille, avec une de ces trois actions. Karim décide. L'assistant n'appelle pas, n'envoie rien, ne choisit pas un geste commercial. Si vous ne pouvez pas dire la décision en une phrase que Karim reconnaît, vous n'avez pas de produit. Vous avez un souhait.

> [!IMPORTANT]
> On ne commence pas par le modèle. On commence par la décision, l'heure, et la personne qui tranche encore après le brief.

Le comité aime parler d'« intelligence » parce que le mot évite de choisir. Vous ramenez la salle à une scène. Il est 8 h 05 à Lille. Douze commandes ont un créneau ce matin. Trois semblent en retard. Karim a six minutes avant d'ouvrir au public. Que doit-il avoir lu, et que doit-il encore décider lui-même ? La réponse tient sur un écran, pas dans un discours.

| Question | Réponse pour Halte |
| --- | --- |
| Qui décide ? | Le responsable de magasin, pas le client et pas le comité |
| À quel moment ? | Avant 8 h 15, les jours ouvrés |
| Quelle décision ? | Appeler, repasser en préparation, ou confier à Hugo |
| Que ne décide-t-il pas à sa place ? | Le contact réel, le geste commercial, le choix du transporteur |

# L'erreur qu'on a le droit de faire

Un produit d'IA se cadre aussi par l'erreur qu'on accepte de voir. Sans cette phrase, toute erreur ressemble à un scandale, et personne n'ose lancer. Avec une phrase trop molle, Karim appelle des clients qui sont à l'heure, et il ferme le brief au troisième matin.

Deux erreurs n'ont pas le même prix.

**L'oubli d'un petit retard** se rattrape. Si le créneau n'est dépassé que de moins de vingt minutes, Karim ne devait pas appeler tout de suite. La liste du transporteur est encore là. Le client n'a pas été trompé par Halte au téléphone. Cette erreur est acceptable, à condition qu'elle reste rare et qu'elle ne mélange pas les magasins.

**Le retard inventé** casse la promesse. Le brief dit « en retard, appeler » alors que le colis est dans les temps, ou déjà livré, ou appartient à Nantes alors que Karim est à Lille. Karim dérange un client pour rien. La fois suivante, il ne lit plus. Un seul mélange de magasins est une erreur inacceptable : on coupe le brief du jour, on ne « surveille ».

Il existe une troisième issue, et c'est souvent la bonne : **ne pas savoir**. Quand le statut du transporteur a plus de quarante-cinq minutes, le brief ne devine pas. Il le dit. Une ligne incertaine n'est pas un échec du produit. C'est le produit qui tient sa parole.

Vous écrivez ces trois issues avant de demander à Sofia si « c'est faisable ». Faisable ne dit pas souhaitable. Le modèle saura produire une phrase dans tous les cas. Votre cadre dit dans quels cas il n'a pas le droit d'avoir l'air sûr.

# La règle, l'écran, l'humain

Avant d'accepter un modèle, vous décrivez l'alternative qui n'en a pas. Trois voies, dans cet ordre.

**La règle.** Une commande du magasin de Karim, un créneau promis dépassé, un statut qui n'est pas « livré ». Cette règle fabrique déjà une liste. Elle ne rédige pas de phrase. Elle ne se trompe pas d'imagination : elle applique un seuil. Si la décision de Karim est seulement « voir qui est en retard de plus de trente minutes », la règle suffit. L'assistant qui résume cette liste est un habillage.

**L'écran.** La même règle, montrée avant 8 h 15, triée par gravité, filtrée sur son magasin. Karim n'a pas besoin qu'on lui raconte ce qu'une colonne peut montrer. Vous ne lancez pas un modèle pour remplacer un tri que personne n'a encore dessiné. Souvent, le premier incrément honnête est cet écran. L'assistant n'a de place que là où la liste ne dit pas l'action : statut flou, client déjà en contact, colis encore en réserve.

**L'humain.** Hugo peut lire les cas limites. Karim peut continuer comme ce matin, avec les mails des transporteurs. Vous chronométrez. Si douze lignes se traitent en quatre minutes sans appel inutile, vous n'ajoutez pas un modèle pour le prestige. Si le volume du matin fait rater des appels utiles, l'aide a un motif. Le motif est le temps de la décision, pas la modernité.

```diagram
type: decision
title: "Un modèle seulement si la voie simple ne tient pas"
nodes:
  - question: "Une règle (son magasin, créneau dépassé, pas livré) donne-t-elle déjà la liste utile ?"
    yes: "Dessinez l'écran trié. Ne posez pas un modèle dessus pour faire moderne."
    no: "La liste ne dit pas encore l'action. Passez au volume humain."
  - question: "Karim ou Hugo tiennent-ils ce volume avant 8 h 15, sans appels inutiles ?"
    yes: "Gardez l'humain. Mesurez son temps réel avant d'ouvrir un assistant."
    no: "Le volume justifie une aide. Elle n'est pas encore choisie."
  - question: "L'erreur acceptable est-elle écrite, avec le retard inventé comme interdit ?"
    yes: "Vous pouvez écrire la promesse courte, puis seulement parler d'un modèle."
    no: "Vous vous arrêtez. Sans erreur nommée, il n'y a pas de produit."
```

Le modèle, si vous y venez, ne fait qu'une chose : proposer l'action quand la règle hésite, et se taire quand le statut est vieux. Il ne devient pas le produit. Le produit est le brief, l'heure, le silence assumé, et le droit de Karim de dire « ce n'est pas un retard ».

# Une promesse que Léa peut signer

Vous revenez vers Léa avec quatre lignes, pas avec un nom de fournisseur.

- Chaque matin ouvré, avant 8 h 15, le responsable voit les retards de son magasin depuis 18 h la veille.
- Chaque ligne propose au plus une action : appeler, repasser en préparation, confier à Hugo.
- Si le statut a plus de quarante-cinq minutes, la ligne est incertaine et ne propose pas d'action.
- Rien n'est envoyé au client. Karim reste celui qui appelle.

Léa peut signer cela. Elle ne peut pas signer « l'assistant comprend la livraison ». Cette phrase n'a pas d'heure, pas d'erreur, pas de refus. Vous la rayez du compte rendu, même si elle a plu en réunion.

Inès, côté expérience client, relit la promesse avec une question : est-ce qu'un client peut être appelé à tort parce que nous avons voulu une phrase élégante ? Si la réponse est oui, la promesse est trop large. Vous resserrez l'action, ou vous augmentez les cas où le brief se tait. Vous ne compensez pas par un adjectif.

> [!WARNING]
> Une promesse qui ne dit pas ce que le produit ne fera pas sera complétée par le marketing, puis par le magasin, puis par le client. Vous l'aurez quand même sur les bras.

Le cadrage tient sur une page. Décision, erreur acceptable, erreur interdite, alternative sans modèle, promesse signable. Le choix du modèle vient après, et seulement si la règle, l'écran et l'humain ont été écartés pour un motif que vous pouvez relire dans trois mois.

# Exercices

## Exercice 1 : La phrase de Léa

Léa écrit dans le compte rendu : « Halte lance un assistant intelligent de gestion des retards. » Karim, lui, dit : « À 8 h, je veux savoir qui j'appelle avant d'ouvrir. » Que gardez-vous comme décision du produit, et que faites-vous de la phrase du compte rendu ?

<details>
<summary>Voir la solution</summary>

Vous gardez la scène de Karim. La décision est : avant 8 h 15, choisir qui appeler, qui repasser en préparation, qui confier à Hugo, pour son magasin seulement. L'assistant prépare ce choix. Il ne l'exécute pas.

Vous faites réécrire la phrase de Léa. « Assistant intelligent » ne dit ni l'heure, ni l'erreur, ni le refus d'envoyer un message. Tant que le compte rendu garde cette formule, chacun complétera le produit à sa façon. La phrase signable est celle des quatre lignes : brief avant 8 h 15, une action au plus, silence si le statut est ancien, aucun envoi au client.

</details>

## Exercice 2 : Deux erreurs

Mardi, le brief oublie une commande en retard de douze minutes. Mercredi, il marque « appeler » une commande déjà livrée à 7 h 40, et Karim joint une cliente surprise. Jeudi, une ligne de Nantes apparaît dans le brief de Lille. Lesquelles sont acceptables, et quel geste produit faites-vous jeudi ?

<details>
<summary>Voir la solution</summary>

L'oubli de douze minutes est dans l'erreur acceptable : en dessous de vingt minutes, Karim ne devait pas appeler tout de suite, et la liste du transporteur peut rattraper le trou. Vous le notez, vous ne le traitez pas comme un scandale.

Le retard inventé de mercredi est interdit : un client à l'heure a été dérangé. Vous le comptez comme erreur inacceptable et vous demandez comment la ligne a été proposée alors que le statut disait livré.

Le mélange de jeudi arrête le brief du jour pour les magasins concernés. Un retard du mauvais magasin n'est pas un écart de qualité qu'on commente vendredi. C'est une confiance cassée. On coupe, on corrige le cadre (quel magasin a le droit d'apparaître), puis on rouvre.

</details>

## Exercice 3 : L'écran d'abord

Sofia propose de brancher un modèle dès la semaine prochaine. En atelier, vous voyez que personne n'a encore une liste filtrée sur le magasin, triée par créneau dépassé. Karim traite douze mails de transporteurs chaque matin. Que décidez-vous de construire en premier, et à quelle condition le modèle entre ensuite ?

<details>
<summary>Voir la solution</summary>

Vous construisez d'abord l'écran de la règle : commandes de son magasin, créneau dépassé, statut pas livré, tri par gravité, visible avant 8 h 15. Tant que cet écran n'existe pas, un modèle ne fait que raconter une liste absente.

Le modèle n'entre que pour les lignes où la règle ne dit pas l'action (statut flou, client déjà en contact, colis encore en réserve), et seulement si Karim ne tient pas ce reste avant l'ouverture. La consigne est déjà écrite : se taire si le statut a plus de quarante-cinq minutes, ne jamais inventer un retard, ne rien envoyer. Sans ces conditions, la proposition de Sofia reste un démarrage technique, pas un produit.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Cadrer avant le modèle
center: "Décision du matin, erreur acceptable, alternative sans modèle. Le modèle arrive en dernier, ou pas."
points:
  - icon: target
    title: Décision
    text: "Avant 8 h 15, Karim choisit qui appeler, qui repasser, qui confier à Hugo. Le brief prépare, il n'agit pas."
  - icon: alert
    title: Erreur
    text: "Oublier un retard de moins de vingt minutes se rattrape. Inventer un retard, ou mélanger deux magasins, est interdit."
  - icon: list
    title: Sans modèle
    text: "Règle, écran trié, puis humain. Si l'un des trois tient la décision, vous ne posez pas un modèle par prestige."
  - icon: shield
    title: Silence
    text: "Statut de plus de quarante-cinq minutes : ligne incertaine, aucune action. Ne pas savoir fait partie du produit."
  - icon: file
    title: Promesse
    text: "Quatre lignes signables. Heure, magasin, action unique, aucun envoi. Pas de formule sur l'intelligence."
pitfall: "Partir du modèle, ou laisser « assistant intelligent » dans le compte rendu à la place de la décision de Karim."
remember: "Si une règle ou un écran tient déjà le matin, le produit est cet écran. L'assistant ne s'ajoute que là où la liste se tait."
```
