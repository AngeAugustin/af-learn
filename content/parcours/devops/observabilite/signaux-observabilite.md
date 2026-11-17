---
title: "Logs, métriques et traces"
description: "Relier logs, métriques et traces par un identifiant de requête pour savoir si le service marche, s'il est lent, et où il casse."
duration: 40
objectives:
  - "Choisir le signal qui répond à chacune des trois questions d'exploitation"
  - "Lire un log structuré, une métrique RED et une trace sans les confondre"
  - "Propager un identifiant de requête du bord jusqu'aux appels internes"
  - "Garder cet identifiant hors des labels de métriques"
---

# Trois questions avant les outils

Avant de choisir un produit, une équipe qui livre une API a trois questions. Elles reviennent à chaque incident, et elles ne se répondent pas avec le même signal.

1. **Ça marche.** Les clients obtiennent-ils une réponse utile, ou une erreur ?
2. **C'est lent.** La réponse arrive-t-elle dans le temps promis, ou la file grossit-elle ?
3. **Où ça casse.** Quel maillon, parmi l'API, le stock, le paiement ou la base, porte l'échec ou la lenteur ?

Un outil qui affiche « tout » ne répond à aucune des trois si personne n'a décidé quoi garder. Les **logs** racontent un événement. Les **métriques** comptent dans le temps. Les **traces** suivent une requête à travers les services. Les trois se rejoignent par un **identifiant de requête**, le même du premier proxy jusqu'au dernier appel.

```diagram
type: compare
title: "Trois signaux pour trois questions"
columns:
  - title: "Logs"
    tone: blue
    items:
      - "Un événement daté, pour une requête"
      - "Répondent surtout à : que s'est-il passé ?"
      - "Chers si on les noie de détails"
  - title: "Métriques"
    tone: teal
    items:
      - "Un compteur, une jauge, un histogramme"
      - "Répondent à : ça marche, c'est lent ?"
      - "Restent lisibles sur des semaines"
  - title: "Traces"
    tone: violet
    items:
      - "Le chemin d'une requête, span par span"
      - "Répondent à : où ça casse ?"
      - "Souvent échantillonnées"
```

Pour une API de commandes, « ça marche » se voit d'abord sur le taux de réponses en erreur du `POST /commandes`. « C'est lent » se voit sur la latence. « Où ça casse » demande le détail d'une requête précise : le log de cette commande, puis la trace qui montre le span en retard.

```video
url: https://www.youtube.com/watch?v=CAQ_a2-9UOI
title: "Observability vs. APM vs. Monitoring"
channel: "IBM Technology"
duration: "9:41"
lang: en
why: "Observabilité, APM et monitoring distingués par IBM Technology, pour bien situer les trois signaux de ce chapitre."
```

# Ce que contient un log utile

Un log utile est une **ligne structurée**, pas un paragraphe collé dans la sortie standard. Au minimum : l'instant, le niveau, le service, le message, et l'identifiant de requête. Le message dit ce qui s'est passé. Les champs autour permettent de filtrer.

Exemple, au moment où l'appel au stock dépasse le délai :

```json
{"ts":"2026-11-16T09:14:02Z","level":"error","service":"commandes","msg":"delai stock depasse","request_id":"7f3a2c","order_draft":"d-1842","duration_ms":840}
```

Ce qui rend la ligne exploitable :

- le **niveau** sépare l'erreur du bruit (`error` ici, pas `debug`) ;
- le **service** dit qui parle, quand dix processus écrivent au même endroit ;
- le **request_id** permet de retrouver les autres lignes de la même requête ;
- la **durée** donne un fait, pas une impression.

Ce qu'on ne met pas dans le log de production : le corps complet de la commande, le numéro de carte, le jeton d'accès, le mot de passe de la base. Un log qui contient un secret est une fuite avec un horodatage. On y met un identifiant métier (`order_draft`), pas le paiement.

Le volume se décide. Une ligne par requête au niveau `info` (méthode, chemin, statut, durée, identifiant) plus une ligne `error` quand ça échoue, c'est souvent assez. Le niveau `debug` se réserve à une enquête, sur une fenêtre courte. Laisser `debug` en permanence fait payer le stockage et noie la recherche le jour où l'on cherche vraiment.

> [!TIP]
> Écrivez les logs en JSON dès le premier service. Un texte libre « Stock KO !!! » oblige chacun à deviner le format. Un champ `duration_ms` se filtre.

# Ce que compte une métrique

Une métrique agrège. Elle ne raconte pas la commande `d-1842`. Elle dit, minute après minute, combien de requêtes, combien d'échecs, et à quelle vitesse. Le trio utile pour une API s'appelle souvent **RED** : le débit (**Rate**), les erreurs (**Errors**), la durée (**Duration**).

| Signal | Question | Exemple sur `POST /commandes` |
|---|---|---|
| Débit | Le trafic est-il celui qu'on croit ? | 2 req/s en journée, 50 req/s pendant les soldes |
| Erreurs | Ça marche ? | Part des réponses 5xx, ou des timeouts |
| Durée | C'est lent ? | Latence p50, p95, p99 |

Le p50 dit l'expérience typique. Le p95 dit ce que vivent les requêtes déjà lentes. Une moyenne seule cache un p95 à 3 secondes derrière un p50 à 80 ms. Pour décider si « c'est lent », on affiche au moins le p95, sur une fenêtre de quelques minutes.

Les métriques sont le bon endroit pour un tableau de bord tenu dans le temps. Elles coûtent peu si les **labels** restent grossiers : service, route, statut, environnement. Elles explosent si l'on y met un identifiant de requête, un identifiant de commande ou une adresse courriel. Chaque valeur nouvelle crée une série. Un million de commandes, c'est un million de séries, et le système de métriques cesse de répondre. L'identifiant fin va dans les logs et les traces. La métrique garde le compte.

Une jauge a sa place pour une capacité : nombre de pods, file d'attente, connexions à la base. Elle ne remplace pas le taux d'erreur. Un processeur à 70 % peut accompagner un service sain ou un service mort. La question « ça marche » se pose sur les réponses aux clients.

# Ce que suit une trace

Une **trace** est le parcours d'une requête. Elle a un identifiant de trace. Chaque étape est un **span** : l'API, puis l'appel au stock, puis l'appel au paiement, avec un début, une fin, un statut. Quand le client dit « cette commande a mis quatre secondes », la trace montre lequel des trois spans a pris 3,6 secondes.

```diagram
type: flow
title: "Une commande, span par span"
steps:
  - title: "Entrée"
    text: "POST /commandes, 4,1 s au total"
    tone: blue
  - title: "Stock"
    text: "Span à 3,6 s, délai dépassé"
    tone: rose
  - title: "Paiement"
    text: "Span à 0,2 s, succès"
    tone: teal
  - title: "Réponse"
    text: "500 renvoyé au client"
    tone: amber
```

On ne garde pas forcément chaque trace. À 50 requêtes par seconde, tout stocker coûte cher et sert peu. Un échantillonnage simple suffit au début : garder les traces en erreur, garder les traces lentes, et un petit pourcentage du trafic sain pour avoir une référence. L'essentiel est que la requête que l'on enquête ait une chance d'être là, surtout si elle a échoué.

Une trace sans logs reste un squelette : on voit la durée, pas le message « délai stock dépassé ». Un log sans trace, à l'inverse, dit l'événement mais pas si le paiement, lui, était rapide. Les deux se retrouvent parce qu'ils portent le même identifiant.

# Corréler avec un identifiant de requête

La corrélation commence **au bord**. Le proxy ou le premier service crée un identifiant s'il n'arrive pas déjà dans un en-tête, par exemple `X-Request-Id: 7f3a2c`. Il le renvoie au client dans la réponse. Il le transmet à chaque appel interne. Chaque service le recopie dans ses logs. S'il y a des traces, le même identifiant (ou le `traceparent` qui le transporte) relie les spans.

Ce que cet identifiant permet, concrètement :

- le client joint `7f3a2c` au ticket, et l'astreinte filtre les logs dessus ;
- les lignes de l'API, du stock et du paiement se lisent dans l'ordre ;
- la trace du même identifiant montre le span lent ;
- la métrique, elle, n'a pas besoin de cet identifiant : elle a déjà montré que le p95 et les 5xx montaient.

Sans identifiant partagé, chaque équipe exporte « ses » logs. On compare des horloges à une seconde près et l'on devine. Avec l'identifiant, la recherche est un filtre, pas une discussion.

Deux erreurs fréquentes cassent le dispositif. La première : le régénérer à chaque service, ce qui produit trois identifiants pour une seule requête. La seconde : le mettre en label de métrique « pour pouvoir filtrer ». Le filtre fin appartient au log. La métrique reste agrégée.

> [!IMPORTANT]
> Créez l'identifiant une fois, propagez-le, journalisez-le, renvoyez-le au client. Ne le régénérez pas au milieu du chemin, et ne le comptez pas comme label.

# Tenir les trois ensemble

Le geste d'exploitation tient en une minute quand les trois signaux existent.

Le tableau de bord montre les 5xx de `POST /commandes` qui passent de 0,2 % à 6 %, et le p95 de 200 ms à 2 s. Ça ne marche plus, et c'est lent. On ouvre un log `error` récent : `delai stock depasse`, `request_id` `7f3a2c`. On ouvre la trace : le span stock dure 3,6 s, le paiement 0,2 s. L'endroit où ça casse est nommé. La suite (alerte, incident, correctif) part de ce fait, pas d'une impression.

Si l'un des trois manque, la minute devient une heure.

| Trou | Ce qu'on ne sait plus |
|---|---|
| Pas de métrique | On découvre la panne par les clients, sans savoir depuis quand ni à quel volume |
| Pas de log structuré | On sait que « ça échoue », pas pour quelle raison |
| Pas de trace | On sait que c'est lent, pas quel appel aval |
| Pas d'identifiant partagé | On a les trois, mais on ne peut pas les joindre pour une requête |

On n'installe pas une plateforme d'observabilité complète le premier mois. On installe de quoi répondre aux trois questions sur le parcours critique : une ligne de log par requête, trois métriques RED, un identifiant propagé, et quelques traces sur les erreurs. Le reste s'ajoute quand une question réelle reste sans réponse.

# Exercices

## Exercice 1 : La bonne question

Lundi 9 h 20, le tableau de `POST /commandes` montre un débit stable, un taux de 5xx à 0,4 % (habituel : 0,3 %), et un p95 passé de 180 ms à 1,4 s depuis dix minutes. Le paiement et le stock sont deux services distincts.

Quelle question est ouverte, et quel signal ouvrez-vous juste après la métrique ? Que ne concluez-vous pas encore ?

<details>
<summary>Voir la solution</summary>

La question ouverte est **« c'est lent »**, pas « ça ne marche plus ». Les erreurs n'ont presque pas bougé. Le débit non plus. Le p95, lui, a été multiplié par presque huit.

Juste après la métrique, on ouvre une **trace lente** (ou un log d'une requête dont `duration_ms` est haut), avec son identifiant, pour voir quel span porte la seconde ajoutée. On ne conclut pas encore que « le paiement est en panne » ni que « le processeur est saturé ». La métrique a qualifié le symptôme. L'endroit se lit sur la trace.

</details>

## Exercice 2 : Un identifiant qui ne relie rien

Une requête cliente porte `X-Request-Id: 7f3a2c`. L'API le journalise, puis appelle le stock sans transmettre l'en-tête. Le stock crée `X-Request-Id: aa19`. Le client ouvre un ticket avec `7f3a2c`. Les deux services écrivent des logs corrects, chacun de son côté.

Pourquoi l'astreinte ne peut-elle pas reconstituer le parcours ? Que changez-vous ?

<details>
<summary>Voir la solution</summary>

Chaque service a journalisé **un identifiant différent**. Le filtre `7f3a2c` ne montre que l'API. Les lignes du stock existent sous `aa19`, sans lien. On ne peut pas prouver quel appel stock correspond à cette commande, surtout s'il y en a des dizaines par seconde.

On transmet `7f3a2c` (ou le `traceparent`) dans l'appel vers le stock, et le stock **réutilise** cet identifiant au lieu d'en créer un. On le renvoie aussi dans la réponse HTTP au client, pour que le ticket cite la même valeur que les logs.

</details>

## Exercice 3 : L'identifiant en label

Pour « retrouver une commande dans Grafana », une personne propose d'ajouter le label `request_id` sur l'histogramme de latence. Le service traite environ un million de requêtes par jour, et l'identifiant est unique à chaque fois.

Acceptez-vous ? Où placez-vous l'identifiant, et que gardent les labels de la métrique ?

<details>
<summary>Voir la solution</summary>

On **refuse** le label. Un identifiant unique par requête crée une série par requête. À un million de requêtes par jour, le magasin de métriques se remplit de séries qui ne serviront qu'une fois. Les tableaux deviennent lents, puis inutilisables.

L'identifiant reste dans le **log** et dans la **trace**. Les labels de l'histogramme restent à faible cardinalité : service, route, statut, environnement. On retrouve la commande en filtrant les logs sur `request_id`, puis on ouvre sa trace. La métrique sert à voir que la latence a bougé, pas à indexer chaque appel.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Logs, métriques et traces"
center: "Logs, métriques et traces répondent ensemble : ça marche, c'est lent, où ça casse."
points:
  - icon: list
    title: "Le log raconte"
    text: "Une ligne structurée par événement, avec le service, le niveau et la durée."
  - icon: chart
    title: "La métrique compte"
    text: "Débit, erreurs, latence. Des labels grossiers, lisibles sur des semaines."
  - icon: network
    title: "La trace suit"
    text: "Un span par appel. Elle montre lequel, du stock ou du paiement, a pris le temps."
  - icon: link
    title: "Un seul identifiant"
    text: "Créé au bord, propagé, journalisé, renvoyé au client. Jamais recréé au milieu."
  - icon: filter
    title: "Pas en label"
    text: "L'identifiant de requête reste dans le log et la trace, hors des séries de métriques."
pitfall: "Mettre request_id en label de métrique, ou le régénérer à chaque service, casse le lien ou le magasin."
remember: "La métrique dit que c'est lent. Le log dit quoi. La trace dit où. L'identifiant les réunit."
```
