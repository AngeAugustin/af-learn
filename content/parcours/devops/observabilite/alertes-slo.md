---
title: "Alertes, SLI et SLO"
description: "Distinguer le symptôme de la cause, n'alerter que sur une action possible, poser un SLI et un SLO, et limiter la fatigue avec un budget d'erreur."
duration: 40
objectives:
  - "Séparer une alerte de symptôme et un signal de cause"
  - "Écrire une alerte qui nomme l'action attendue"
  - "Formuler un SLI et un SLO sur un parcours utilisateur"
  - "Utiliser le budget d'erreur pour choisir page ou ticket"
---

# Le symptôme n'est pas la cause

Le **symptôme** est ce que le client subit. Le `POST /commandes` renvoie des erreurs, ou il dépasse une seconde. La **cause** est ce qui, en dessous, a bougé : un déploiement, un processeur saturé, un disque plein, un délai du service de stock.

Les deux ont de la valeur, et ils n'ont pas le même canal. Le symptôme réveille quelqu'un, parce que des clients sont en train de perdre une commande. La cause aide ensuite à comprendre. Une alerte sur le processeur à 80 %, seule, ne dit pas si une seule commande a échoué. Une alerte sur les erreurs clients, elle, dit que le service ne tient plus sa promesse, même si le processeur est tranquille.

```diagram
type: compare
title: "Ce qui réveille, et ce qui explique"
columns:
  - title: "Symptôme"
    tone: rose
    items:
      - "Vu par l'utilisateur"
      - "Erreurs ou latence du parcours"
      - "Peut déclencher une page"
      - "Ne nomme pas encore le composant"
  - title: "Cause"
    tone: amber
    items:
      - "Vu par la plateforme"
      - "CPU, disque, déploiement, dépendance"
      - "Va au tableau ou au ticket"
      - "Sert une fois le symptôme confirmé"
```

Pendant les soldes, le processeur peut monter parce que le trafic est sain. Pager à chaque pic de CPU forme l'astreinte à ignorer le téléphone. À l'inverse, un stock qui répond 200 en 3 secondes peut laisser le CPU de l'API bas, tout en rendant la commande inutilisable. C'est le symptôme qu'il fallait voir.

# Une alerte qui demande une action

Une alerte **actionnable** réunit quatre éléments. Un symptôme mesuré. Une fenêtre assez longue pour ne pas partir sur un pic d'une seconde. Un destinataire qui peut agir. Une première action écrite, même en une ligne.

Exemple qui peut réveiller :

> Sur 5 minutes, plus de 2 % des `POST /commandes` finissent en 5xx ou en délai. Page l'astreinte. Première action : ouvrir le tableau RED, prendre un `request_id` en erreur, et décider d'un retour arrière si un déploiement a eu lieu dans l'heure.

Exemple qui ne doit pas réveiller à 3 h :

> Le CPU d'un pod dépasse 70 % pendant 2 minutes. Aucune action nommée.

Le second peut exister en courbe. Il peut ouvrir un ticket s'il dure et qu'une capacité manque. Il ne sonne pas la nuit.

```diagram
type: decision
title: "Cette alerte doit-elle sonner ?"
nodes:
  - question: "Le symptôme est-il visible par un utilisateur du parcours critique ?"
    yes: "On continue. Le client est concerné."
    no: "Tableau ou ticket. Pas de page."
  - question: "La fenêtre dépasse-t-elle le bruit (plusieurs minutes, pas une seconde) ?"
    yes: "On continue. Ce n'est pas un pic isolé."
    no: "On allonge la fenêtre ou on n'alerte pas."
  - question: "Une personne peut-elle agir tout de suite (retour arrière, bascule, réduction) ?"
    yes: "Page, avec le lien et la première action."
    no: "Ticket pour les heures ouvrées. Pas de page."
```

Une alerte sans action est une notification. Une notification répétée apprend à l'équipe à tout classer comme bruit. Le test est simple : la dernière fois que cette alerte a sonné, quelqu'un a-t-il fait un geste qui a changé le service ? Si la réponse est « on a regardé, c'était normal », l'alerte est à réécrire ou à retirer.

# SLI et SLO

Le **SLI** (indicateur de niveau de service) est la mesure. Le **SLO** (objectif de niveau de service) est la cible que l'on promet sur cette mesure, sur une fenêtre. On les écrit pour un parcours, pas pour un composant vague.

Pour l'API de commandes, un SLI possible :

> Part des `POST /commandes` qui renvoient un statut autre que 5xx, en moins de 1 seconde, hors des 4xx qui refusent une commande invalide.

Le 4xx « panier vide » n'est pas une panne du service. Le compter comme un échec du SLO fait sonner l'alerte quand un client se trompe. Le 5xx, le délai dépassé et le 408, eux, comptent.

Un SLO possible, écrit avant la prochaine période :

> Sur 30 jours glissants, 99,9 % des `POST /commandes` respectent ce SLI.

99,9 % n'est pas un slogan. Sur 30 jours, cela laisse environ **43 minutes** où le SLI a le droit d'être faux. Le chapitre sur le budget d'erreur reprend ce calcul et la décision de livrer ou de geler. Ici, le chiffre sert déjà à régler l'alerte : on ne page pas pour 0,01 % pendant trente secondes si le mois tient encore largement. On page quand la vitesse de consommation menace la fenêtre.

Le SLO se choisit avec le métier. Une vitrine qui affiche le catalogue peut viser moins strict que l'encaissement. Copier « 99,99 % » sans savoir qui est réveillé la nuit promet un niveau que l'équipe de huit ne tiendra pas. Mieux vaut un 99,9 % mesuré, avec une alerte que l'on honore, qu'un chiffre plus dur que personne ne surveille.

```video
url: https://www.youtube.com/watch?v=E3ReKuJ8ewA
title: "The Art of SLOs (Service Level Objectives)"
channel: "Google Cloud Tech"
duration: "4:01"
lang: en
why: "L'équipe Google Cloud Tech présente les objectifs de niveau de service, l'idée centrale de la pratique SRE de Google."
```

# Le budget d'erreur, première lecture

Le **budget d'erreur** est la part d'échec que le SLO autorise. Si l'objectif est 99,9 % de requêtes bonnes, le budget est 0,1 %. Le dépenser n'est pas un accident moral. C'est la marge prévue pour les déploiements, les dépendances et les surprises.

On le lit en vitesse, pas seulement en reste.

- **Brûlure rapide.** Au rythme actuel, le budget du mois serait vide dans quelques heures. C'est un symptôme grave. On page.
- **Brûlure lente.** Le mois finirait légèrement au-dessus du SLO si rien ne change. On ouvre un ticket, on regarde aux heures ouvrées.
- **Budget largement intact.** Une alerte de cause (disque à 60 %) n'a pas de raison de sonner.

Cette introduction suffit à régler les alertes. Le chapitre suivant sur la fiabilité dira comment le budget **autorise ou gèle** une mise en production. Ici, il sert à ne pas traiter chaque écart comme une urgence égale.

> [!NOTE]
> Deux seuils valent mieux qu'un seul. Le seuil rapide réveille. Le seuil lent crée un ticket. Un seul seuil, trop sensible, fatigue. Un seul seuil, trop lâche, rate la brûlure lente.

# Couper la fatigue

La **fatigue d'alertes** commence quand l'astreinte n'associe plus un son à une action. Les signes sont concrets : alertes acquittées sans regard, canal en muet, douze messages pour la même panne, seuils qui oscillent toutes les trois minutes.

On la réduit par des gestes, pas par un discours.

| Geste | Effet |
|---|---|
| Une page par incident, sur le symptôme | Le CPU, le disque et les 5xx de la même panne ne sonnent pas trois fois |
| Fenêtre de plusieurs minutes | Un pic d'une poignée de requêtes ne page plus |
| Lien vers le tableau et vers un log déjà filtré | L'action démarre sans chercher l'outil |
| Revue mensuelle | Toute alerte jamais suivie d'un geste est supprimée ou devient un ticket |
| Maintenance annoncée | Le déploiement prévu ne page pas l'équipe qui est en train de le faire |

La revue tient en une liste : alerte, nombre de pages sur 30 jours, nombre de fois où un geste a suivi. Zéro geste, plusieurs pages : on réécrit ou on retire. C'est la même hygiène que pour un test flaky. On ne « s'habitue » pas.

Ajouter une alerte est facile. En retirer une demande de dire à voix haute qu'elle ne protégeait personne. Cette phrase fait partie du travail.

# La page d'astreinte minimale

Pour une API et une équipe de huit, la page d'astreinte du parcours commande peut tenir sur un écran.

- **SLO** : 99,9 % des `POST /commandes` bons en moins de 1 s, sur 30 jours.
- **Page** : plus de 2 % d'échecs sur 5 minutes, ou p95 au-dessus de 1 s sur 10 minutes, si cette vitesse viderait le budget en quelques heures.
- **Ticket** : budget consommé plus vite que le calendrier, sans urgence dans l'heure.
- **Pas une page** : CPU, mémoire, file interne, tant que le SLI tient.
- **Première ligne** : tableau RED, `request_id` d'une erreur, déploiement dans l'heure ou non, nom de la personne d'astreinte.

Le reste des courbes existe. Il ne sonne pas. Quand la page part, la personne sait déjà quelle question elle pose : ça marche encore, c'est lent, où ça casse. Les signaux du chapitre précédent sont les pièces de cette page, pas un deuxième système.

# Exercices

## Exercice 1 : Réécrire ou déclasser

L'alerte actuelle dit : « CPU du déploiement `commandes` > 75 % pendant 1 minute. Canal : page nuit. » Le SLI des commandes est vert au même moment. Le trafic de 20 h est naturellement plus haut.

Que faites-vous de cette alerte, et que mettriez-vous à la place si vous n'aviez le droit qu'à une page ?

<details>
<summary>Voir la solution</summary>

On **retire la page**. Le CPU à 75 % pendant une minute, avec un SLI vert, est une cause possible et un pic de trafic, pas un symptôme. Personne n'a d'action utile à 3 h : redémarrer rendrait le service moins bon. La courbe CPU reste sur le tableau, pour l'enquête du lendemain.

L'unique page porte sur le symptôme : part d'échecs de `POST /commandes` au-dessus de 2 % pendant 5 minutes, ou p95 au-dessus du SLO pendant 10 minutes. Le texte cite le tableau RED et demande de prendre un `request_id`. Le CPU aidera ensuite, si la page a vraiment sonné.

</details>

## Exercice 2 : Écrire le SLI

Le métier veut « une API fiable ». Aujourd'hui, le tableau compte comme erreurs tous les statuts ≥ 400. Environ un tiers de ces réponses sont des 400 « article inconnu » envoyées par de vieux clients. Les délais au-dessus de 1 s sont rares mais présents, et ils n'entrent pas dans le compte.

Proposez un SLI et un SLO sur 30 jours. Dites ce que vous excluez, et pourquoi.

<details>
<summary>Voir la solution</summary>

**SLI** : part des `POST /commandes` qui répondent en moins de 1 seconde avec un statut autre que 5xx et autre qu'un délai dépassé. **SLO** : 99,9 % sur 30 jours glissants (environ 43 minutes de budget). Le chiffre se confirme avec le métier, il ne se copie pas d'un slogan.

On **exclut** les 4xx de requête invalide, dont le 400 « article inconnu » : le service a répondu correctement à une demande impossible. Les compter casse le SLO quand un vieux client se trompe. On **inclut** les 5xx et les réponses plus lentes que 1 s, même quand le statut est 200 trop tardif : pour l'acheteur, la commande n'est pas tenue.

</details>

## Exercice 3 : Trois sons, une panne

À 11 h 02, trois alertes partent : CPU > 80 %, disque de logs > 85 %, et 8 % de 5xx sur `POST /commandes`. Les trois vont sur la page. L'astreinte coupe le son, puis rate un vrai message à 11 h 40.

Comment réduisez-vous cela à une page, et que deviennent les deux autres signaux ? Que regardez-vous en revue de fin de mois ?

<details>
<summary>Voir la solution</summary>

Une seule **page**, celle des 5xx, qui est le symptôme. Le CPU et le disque restent des courbes, éventuellement un ticket s'ils restent hauts après l'incident. Ils ne réveillent pas en parallèle : c'est la même panne, trois fois. On groupe aussi la fenêtre (5 minutes) pour que le signal ne batte pas.

En revue mensuelle, on compte les pages et les gestes. L'alerte CPU et l'alerte disque, si elles ont souvent sonné sans action propre, sortent du canal de page. On vérifie que la page 5xx, elle, a bien été suivie d'un geste. La fatigue venait du nombre de sons, pas d'un manque de courbes.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Alertes, SLI et SLO"
center: "On page un symptôme actionnable. Le SLO fixe le budget, la cause reste au tableau."
points:
  - icon: alert
    title: "Symptôme d'abord"
    text: "Erreurs et latence du parcours client. Le CPU explique, il ne réveille pas seul."
  - icon: check
    title: "Une action nommée"
    text: "Fenêtre de quelques minutes, destinataire, première ligne : tableau, identifiant, déploiement."
  - icon: target
    title: "SLI puis SLO"
    text: "La mesure exclut les 4xx légitimes. L'objectif, 99,9 % sur 30 jours, se promet par écrit."
  - icon: gauge
    title: "Vitesse du budget"
    text: "Brûlure rapide : page. Brûlure lente : ticket. Le reste du mois n'est pas une urgence."
  - icon: filter
    title: "Une page par panne"
    text: "On retire l'alerte qui sonne sans geste. La revue mensuelle fait le tri."
pitfall: "Pager sur le CPU pendant une minute, ou compter les 4xx métier comme des pannes, habitue à ignorer le téléphone."
remember: "Une alerte juste dit ce que le client subit, et quel geste faire maintenant."
```
