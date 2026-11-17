---
title: "Projet final : l'API de commandes"
description: "Cas guidé pour une enseigne : décrire le pipeline, l'image, le déploiement, l'alerte et le rollback d'une API de commandes, en trois jalons."
duration: 90
objectives:
  - "Cadrer une API de commandes pour une équipe de huit et un pic de soldes"
  - "Décrire un pipeline et une image immuable taguée par le SHA"
  - "Choisir un déploiement staging puis production avec la même empreinte"
  - "Définir une alerte de symptôme et un rollback compatible avec les migrations"
---

# Le mandat d'Atelier Brume

**Atelier Brume** est une enseigne fictive. Cent vingt magasins, un site, et une API qui crée les commandes. L'équipe qui vous emploie compte **huit personnes**. Elle sait livrer du code avec Git. Le reste est fragile : déploiements depuis un poste, peu de signaux, un retour arrière « si Sam est là ».

La direction écrit : « Il nous faut une plateforme industrielle, multi-région, prête pour les soldes. » Vous traduisez. Le mandat que vous acceptez est plus étroit, et c'est celui que le dossier devra tenir.

> Chaque changement de l'API de commandes passe par un pipeline unique, une image identifiée, un staging, une approbation, une production surveillée, et un retour arrière en moins de dix minutes quand le schéma le permet.

Vous ne construisez pas le cluster dans ce chapitre. Vous **décrivez** le dispositif, avec assez de précision pour qu'une autre personne de l'équipe puisse le mettre en place sans réinventer les décisions. Le travail dure le temps du chapitre : trois jalons, un dossier cohérent.

```diagram
type: flow
title: "Ce que le dossier doit couvrir"
steps:
  - title: "Pipeline"
    text: "Du commit jusqu'à l'image qui a le droit de partir"
    tone: blue
  - title: "Image"
    text: "SHA, empreinte, scan, registre"
    tone: violet
  - title: "Déploiement"
    text: "Staging, approbation, production, config à part"
    tone: teal
  - title: "Alerte"
    text: "Un symptôme, une page, un identifiant"
    tone: amber
  - title: "Rollback"
    text: "Empreinte précédente, ou refus si migration destructive"
    tone: rose
```

# L'API de commandes et son objectif

L'API expose trois opérations qui comptent pour le dossier.

| Opération | Rôle | Remarque |
|---|---|---|
| `POST /commandes` | Créer une commande | Appelle le stock, puis le paiement |
| `GET /commandes/{id}` | Relire une commande | Doit rester possible si la création dégrade |
| Santé du processus | Savoir s'il écoute | Ne prouve pas que le stock répond |

Charge fournie par l'enseigne, à utiliser telle quelle : **2 requêtes par seconde** en journée, **50 requêtes par seconde** pendant **vingt minutes**, deux fois par an (soldes). Hors ces pics, la nuit est calme. Le mois dernier, la lenteur venait du stock, pas d'un manque de machines.

Objectif de service que vous prenez, sauf justification écrite : sur **30 jours**, **99,9 %** des `POST /commandes` répondent autrement qu'en erreur serveur, en **moins de 1 seconde**. Les 4xx de commande invalide ne comptent pas comme une panne. Ce SLO laisse environ **43 minutes** de budget sur le mois.

Contraintes d'équipe : personne n'a opéré de cluster en astreinte. Le réseau de l'enseigne n'impose pas de placement. Un PaaS simple est acceptable. Un cluster est acceptable seulement si vous expliquez qui le dépannera un mardi.

# Le livrable en cinq blocs

Le dossier, équivalent à quelques pages, répond aux cinq blocs. Chaque jalon en produit une partie. À la fin, les cinq se relisent d'un trait, sans se contredire.

1. **Pipeline.** L'ordre des étapes, ce qui bloque, ce qui ne bloque pas.
2. **Image.** Comment elle est nommée, où elle vit, ce qu'elle ne contient pas (secrets), comment le scan l'empêche ou non de partir.
3. **Déploiement.** Runtime choisi, staging, approbation, ce qui diffère entre staging et production, requests ou taille pour la charge donnée.
4. **Alerte.** Le symptôme qui page, la fenêtre, la première action, ce qui reste un simple ticket.
5. **Rollback.** L'action, le délai visé, le cas de migration où vous refusez de revenir en arrière.

On attend des **décisions**, pas un catalogue d'outils. « On mettra un orchestrateur connu » ne suffit pas. « PaaS, deux applications, l'empreinte `sha256:…` déjà vue en staging, approuvée par une personne de la liste de trois » suffit.

Les noms de produits sont libres s'ils illustrent une décision. La décision doit rester compréhensible si l'on change de fournisseur.

# Contraintes de l'équipe

Vous n'avez pas le droit d'inventer une équipe plus grande. Huit personnes livrent l'API **et** tiennent le chemin. Une personne en est responsable. Les autres passent par la revue. Vous ne détachez pas trois personnes pour construire un portail.

Vous n'inventez pas non plus une charge. Le pic est 50 req/s pendant vingt minutes, pas « le black friday mondial ». Une proposition de douze nœuds doit être refusée dans le dossier, avec la contre-proposition (peu de replicas hors pic, plafond relevé avant les soldes).

Le budget d'erreur s'applique. Si votre règle gèle les fonctions sous un quart du budget, dites-le dans le bloc déploiement, pour que l'approbation ait un critère. Vous n'êtes pas obligé de recopier une politique longue : trois lignes et un chiffre (43 minutes) montrent que la règle existe.

Les secrets : le pipeline n'embarque pas un jeton personnel. L'image n'a pas de mot de passe de base. Staging et production ne partagent pas le secret. Une phrase par point suffit, si elle est ferme.

# Comment on relit un jalon

Chaque jalon se relit avec les mêmes questions. Elles servent de barème, pas de surprise.

- Une autre personne peut-elle exécuter la décision sans vous demander « tu mettrais quoi ? »
- Le même artefact va-t-il de staging à la production ?
- Un secret peut-il se retrouver dans Git ou dans une couche d'image, selon votre texte ?
- L'alerte réveille-t-elle pour un symptôme client, avec une action ?
- Le rollback a-t-il un délai et un cas d'interdiction ?
- Avez-vous construit, ce mois-ci, quelque chose que le mandat repousse (seconde région, maille de services, portail) ?

La solution de référence, sous chaque exercice, est **un** dispositif cohérent, pas le seul imaginable. Si vous choisissez un cluster au lieu du PaaS, la relecture exige le nom de la personne qui sait le dépanner et la raison de ce choix. Le reste (SHA, même empreinte, alerte, rollback) ne change pas.

> [!NOTE]
> Écrire « ça dépend » sans trancher ne valide pas le jalon. Le cas est guidé : les chiffres sont là pour que vous tranchiez.

# Hors sujet assumé

Le dossier **ne demande pas** :

- le code de l'API, ni le schéma complet de la base ;
- une région de secours active en même temps que la première ;
- un maillage de services, un portail interne, un outil de chaos ;
- un audit de sécurité annuel, ni un test d'intrusion ;
- la construction réelle du pipeline dans un compte cloud.

Il **demande** de savoir où le SAST et le DAST s'assoiraient plus tard (commit, staging), en une phrase, sans les installer. Il demande une migration compatible avec le rollback : étendre d'abord, retirer ensuite. Il ne demande pas d'écrire le SQL.

Si un choix est hors sujet, vous le notez dans une liste « pas ce trimestre » avec une ligne de motif. Cette liste fait partie d'un bon dossier. Elle prouve que le minimum a été choisi, pas subi.

# Exercices

## Exercice 1 : Pipeline et image

Décrivez le pipeline et l'image pour `POST /commandes`. Contraintes : équipe de huit, Git déjà là, un secret de base ne doit pas entrer dans l'image, une faille critique exploitable avec correctif ne part pas en production, l'auteur du changement ne construit pas l'artefact sur son poste.

Votre texte nomme l'ordre des étapes, ce qui bloque, le nom de version (SHA et empreinte), et le sort de `latest`.

<details>
<summary>Voir la solution</summary>

**Ordre.** Branche et revue. Intégration : tests (démarrage, règles de commande, contrat du POST) qui **bloquent** la fusion s'ils sont rouges. Construction **dans le pipeline**, dépendances verrouillées, image poussée au registre privé. Détecteur de secrets sur le commit. Scan de l'image **construite**. Staging seulement si le scan n'a pas de critique exploitable avec correctif. Le DAST léger, plus tard, visera le staging. Le SAST grave, s'il arrive, visera le commit. Ni l'un ni l'autre ne remplace cette barrière.

**Blocages.** Tests rouges, secret détecté, faille critique exploitable et corrigeable, fumée de staging rouge. Une faille moyenne limitée à un outil de développement devient un ticket, pas un arrêt. Une exception de scan a un nom et une date.

**Noms.** Les humains citent le **SHA complet** du commit. Le runtime tire l'**empreinte** `sha256:…` notée à côté. `latest` peut exister sur un poste, il n'est jamais le pointeur de staging ni de production.

**Secret.** Le mot de passe de la base vient du coffre au démarrage du processus, identité du service, valeur différente en staging. Il n'est pas un `ARG` de build, ni une variable affichée dans les logs. L'identité qui construit n'est pas le jeton personnel d'un développeur.

Ce jalon ne choisit pas encore le nombre de replicas : c'est le déploiement. Il laisse une image que le jalon suivant n'a plus le droit de reconstruire.

</details>

## Exercice 2 : Déploiement

Le pic est à 50 req/s pendant vingt minutes, deux fois par an, et à 2 req/s le reste du temps. Personne n'est d'astreinte Kubernetes. Le budget du mois est 43 minutes. Proposez le runtime, la différence entre staging et production, l'approbation, et la taille (replicas ou équivalent PaaS).

Dites ce que vous refusez comme infrastructure, et dans quel cas l'approbation doit attendre à cause du budget.

<details>
<summary>Voir la solution</summary>

**Runtime.** Un **PaaS**, deux applications (`commandes-staging`, `commandes-prod`). Personne ne dépannera un cluster cette nuit, et le réseau ne l'exige pas. Une personne de l'équipe tient le pipeline. On ne détache pas une sous-équipe.

**Même empreinte.** Staging reçoit l'image du SHA. La fumée crée une commande de test. L'approbation, par **une des trois personnes** de la liste, autre que l'auteur seul, envoie **cette empreinte** en production. Ce qui change : l'URL du stock, le secret, l'étiquette `env`, le plafond de capacité. Pas le binaire. Pas les données clients copiées dans le staging.

**Taille.** Deux replicas (ou l'équivalent PaaS) hors pic, pour survivre à un redémarrage. Avant les soldes, on relève le plafond pour tenir 50 req/s pendant vingt minutes, puis on le redescend. Requests proches de l'usage mesuré quand il existera, pas deux cœurs « par précaution » le premier jour. Les connexions vers la base restent bornées par ce plafond.

**Refus.** Pas de cluster de douze nœuds, pas de seconde région, pas de maille de services ce trimestre. Le mois dernier, le stock était le goulet, pas le calcul.

**Budget.** Au-dessus de la moitié des 43 minutes, un changement risqué peut passer si le rollback est prêt. Entre un quart et la moitié, seulement le petit risque et les correctifs. Sous un quart, l'approbation **attend** pour toute fonction, et laisse passer un correctif de fiabilité. Cette phrase est dans le dossier, à côté du bouton d'approbation.

</details>

## Exercice 3 : Alerte et rollback

Écrivez l'alerte qui a le droit de réveiller, et le rollback. Le `GET /commandes/{id}` doit rester hors de cette page s'il va bien. Un déploiement peut avoir supprimé une colonne encore lue par l'image précédente.

Incluez la première action de l'astreinte, le délai visé du retour arrière, et le cas où vous ne cliquez pas.

<details>
<summary>Voir la solution</summary>

**Alerte.** Page si, sur **5 minutes**, plus de **2 %** des `POST /commandes` finissent en erreur serveur ou au-delà du délai, ou si le p95 du POST reste **au-dessus de 1 s** pendant **10 minutes** alors que cette vitesse mangerait le budget du mois. Une seule page. Le CPU, le disque de logs et le `GET` sain ne réveillent pas : courbes ou ticket. Le texte de l'alerte pointe le tableau RED et demande un `request_id`.

**Première action.** Regarder si un déploiement a eu lieu dans l'heure. Ouvrir une erreur récente, prendre son identifiant, confirmer sur la trace ou le log si le stock ou le paiement porte le délai. Si l'empreinte nouvelle est en cause et que l'ancienne sait encore lire les données : **rollback**.

**Rollback.** Action du pipeline : redéployer l'**empreinte précédente**, conservée au registre, visée en **moins de dix minutes**. Puis vérifier que le taux d'erreurs du POST redescend. Pas de reconstruction du vieil SHA à la main. Pas de tag `latest`.

**Interdit.** Si la migration a **déjà détruit** une colonne que l'ancienne image lit encore, on ne clique pas. On ouvre un incident : correctif qui comprend le nouveau schéma, ou restauration décidée, avec un commander. Le dossier impose des migrations en deux temps (ajouter, déployer le code qui sait les deux, supprimer plus tard) pour que l'interdit reste rare.

Le `GET` qui répond encore sert au point de situation (« la consultation passe, la création est dégradée »), il ne sert pas de seconde page.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "L'API de commandes"
center: "Pour Brume : une image, un staging, une alerte sur le POST, un rollback en moins de dix minutes."
points:
  - icon: list
    title: "Cinq blocs"
    text: "Pipeline, image, déploiement, alerte, rollback. Des décisions, pas une liste d'outils."
  - icon: git
    title: "SHA et empreinte"
    text: "Construite une fois par la chaîne. latest ne pointe ni le staging ni la production."
  - icon: cloud
    title: "PaaS, petite taille"
    text: "Deux replicas hors pic, plafond avant les soldes. Pas douze nœuds pour 2 req/s."
  - icon: alert
    title: "Page sur le POST"
    text: "Erreurs ou latence du POST. Le GET sain et le CPU restent des courbes."
  - icon: loop
    title: "Retour préparé"
    text: "Empreinte précédente, sauf si une colonne lue par l'ancienne image a déjà disparu."
pitfall: "Décrire une plateforme multi-région alors que le mandat tient en un chemin de livraison répété."
remember: "Le dossier est bon si une coéquipière peut livrer et revenir en arrière sans vous réveiller."
```
