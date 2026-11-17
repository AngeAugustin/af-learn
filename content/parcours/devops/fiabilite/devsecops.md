---
title: "DevSecOps dans le pipeline"
description: "Placer secrets, dépendances, scan d'image, moindre privilège et une idée de SAST ou DAST dans la livraison, sans les confondre avec un audit annuel."
duration: 40
objectives:
  - "Situer les contrôles de sécurité sur le chemin de chaque changement"
  - "Empêcher un secret, une dépendance critique ou une image non scannée d'atteindre la production"
  - "Réduire les droits du pipeline et du service au strict nécessaire"
  - "Placer SAST et DAST sans en faire un audit une fois par an"
---

# Dans le pipeline, pas une fois par an

Un **audit annuel** photographie le système à une date. Il est utile pour un tiers, un client, un régulateur. Il ne voit pas le changement fusionné mardi. Le **DevSecOps**, ici, désigne autre chose : des contrôles qui passent **sur chaque livraison**, dans la chaîne, avec un résultat en minutes. Échec visible. Exception rare, nommée, datée.

Les deux ne se remplacent pas. Une équipe qui « a eu son audit en mars » peut encore poser un jeton dans un Dockerfile en avril. Une équipe qui scanne chaque image peut quand même devoir montrer un rapport annuel. On ne coche pas l'un en croyant avoir fait l'autre.

```diagram
type: compare
title: "Audit annuel et contrôles continus"
columns:
  - title: "Audit annuel"
    tone: amber
    items:
      - "Une date, un périmètre, un rapport"
      - "Parle à un tiers"
      - "Rate les changements d'après"
      - "Ne bloque pas un commit"
  - title: "Dans le pipeline"
    tone: teal
    items:
      - "À chaque build ou déploiement"
      - "Parle à l'auteur du changement"
      - "Échoue avant la production"
      - "Laisse une exception datée, pas un contournement oral"
```

Pour une API et une équipe de huit, le premier palier tient en quatre contrôles : pas de secret dans le dépôt ni dans l'image, dépendances connues, image scannée, identité de déploiement au moindre privilège. Le SAST et le DAST viennent en idée claire, pas en usine à outils le premier mois.

```video
url: https://www.youtube.com/watch?v=J73MELGF6u0
title: "What is DevSecOps?"
channel: "IBM Technology"
duration: "6:55"
lang: en
why: "Ce qu'est le DevSecOps, en sept minutes par IBM Technology."
```

# Les secrets ne passent pas par le dépôt

Un **secret** (jeton, clé, mot de passe de base) n'a rien à faire dans Git, dans un Dockerfile, dans un journal de pipeline, ni dans une couche d'image. Une fois commité, il reste dans l'historique même si l'on « supprime la ligne » au commit suivant. Une fois dans une couche d'image, il se lit avec les outils d'inspection de l'image.

Règles praticables :

- le pipeline reçoit le secret **au moment de l'exécution**, depuis un coffre, masqué dans les logs ;
- une variable affichée par une commande `echo` ou un mode debug du script est un incident, pas un détail ;
- un argument de build (`ARG`) qui contient un jeton se retrouve souvent dans l'historique de l'image ;
- si un secret a été poussé, on le **révoque** d'abord, puis on nettoie l'historique. Le nettoyage seul laisse l'ancienne valeur valide.

Le contrôle automatique minimum : un détecteur de secrets sur la branche, qui échoue le pipeline s'il reconnaît une clé. Il rate des secrets maison trop courts. Il attrape les jetons dont le format est connu. On le complète par la revue : un fichier `.env` n'a pas à être ajouté « pour dépanner ».

> [!WARNING]
> Réécrire le Dockerfile sans révoquer le jeton laisse une clé valide dans le registre, dans le cache CI, et dans les clones déjà faits.

# Les dépendances ont une version

L'application dépend de bibliothèques, et l'image dépend d'une image de base. Les deux bougent, les deux ont des failles publiées. Le contrôle continu s'appelle souvent analyse de composition : on lit le fichier de verrouillage et l'on compare à une base de failles connues.

On ne bloque pas l'équipe sur tout.

| Gravité et contexte | Décision |
|---|---|
| Critique, exploit connu, dépendance chargée en production, correctif disponible | Le pipeline échoue tant que la version n'est pas montée |
| Critique, sans correctif en amont | Exception datée, propriétaire nommé, contournement ou isolation, revue dans la semaine |
| Moyenne, outil de test seulement, pas dans l'image finale | Ticket, pas de blocage de la livraison |
| « Il y a 400 alertes » sans tri | On n'a pas de politique, on a une liste |

Le fichier de verrouillage fait partie du dépôt. Reconstruire « la dernière version » à chaque pipeline change l'artefact sans changer le commit. On construit ce qui est verrouillé, et l'on met à jour par un commit volontaire, avec le scan au vert.

Une dépendance directe que l'on n'appelle plus se retire. Moins de code tiers, moins de surface. Ce n'est pas un projet de réécriture : c'est le refus d'emporter une bibliothèque « au cas où ».

# L'image est scannée avant d'être promue

Scanner le Dockerfile ne suffit pas. La faille est souvent **dans la couche** qui a été construite : paquet système, bibliothèque native, fichier copié par erreur. On scanne **l'image produite**, identifiée par son empreinte, avant qu'elle soit éligible à la production.

Le geste minimal :

1. construire l'image à partir du commit ;
2. la taguer par le SHA, l'envoyer au registre ;
3. lancer le scan sur cette empreinte ;
4. si une faille critique avec correctif est présente, **ne pas** déployer cette empreinte ;
5. attacher le résumé du scan au SHA, pour que la personne qui approuve le voie.

L'image de base est épinglée par empreinte, pas par un tag flottant du genre `python:latest`. `latest` mardi et `latest` jeudi ne sont pas la même image. Le scan d'hier ne couvre pas celle d'aujourd'hui.

On sépare « le registre accepte l'image » et « la production a le droit de la tirer ». Un registre unique avec une promotion explicite (l'empreinte scanée peut partir en staging, puis en prod) évite qu'un pipeline de branche déploie ce qu'il vient de pousser sans scan.

# Le moindre privilège sur les identités

Le **moindre privilège** : chaque identité ne peut faire que ce que son travail exige, rien de ce qui serait pratique « au cas où ».

Pour le pipeline de l'API :

- le job de test ne peut pas déployer ;
- le job qui déploie en staging ne peut pas lire la base de production ni déployer en production ;
- le job de production peut mettre à jour le service `commandes`, pas supprimer le cluster, pas lire les secrets du paiement s'il n'en a pas besoin pour ce déploiement ;
- une personne qui développe n'utilise pas au quotidien un kubeconfig d'administrateur.

Les droits larges accélèrent le vendredi et agrandissent l'incident le jour où un script se trompe de namespace, ou le jour où un jeton de CI fuit. Réduire les droits est un contrôle continu : on les relit quand le pipeline change, pas seulement à l'audit de mars.

Une exception (« donne-moi admin pour débloquer ») a une fin. Sans date de fin, l'exception devient le droit normal, et le moindre privilège n'existe plus que dans le slide.

# SAST et DAST, chacun à sa place

Le **SAST** (analyse statique) lit le code sans l'exécuter. Il repère des motifs : requête SQL concaténée, appel dangereux, secret en dur, dépendance d'une API crypto déconseillée. Il se place **sur le commit ou la fusion**. Il produit des faux positifs. On le règle pour échouer sur quelques règles graves, pas pour noyer la revue sous deux cents style warnings.

Le **DAST** (analyse dynamique) interroge une application **qui tourne**, en général sur le staging. Il voit ce que le code seul ne prouve pas : une route sans contrôle d'accès, un en-tête manquant, une erreur qui renvoie une pile. Il se place **après le déploiement de staging**, avant l'approbation de production. Il a besoin d'un environnement stable et d'un jeu de comptes de test, pas de la base réelle des clients.

```diagram
type: pipeline
title: "Où chaque contrôle s'assoit"
lanes:
  - title: "Sur le commit"
    steps:
      - title: "Secrets"
        text: "Échec si un jeton est reconnu"
        tone: rose
      - title: "SAST"
        text: "Quelques règles graves"
        tone: violet
      - title: "Dépendances"
        text: "Critique exploitable : stop"
        tone: amber
  - title: "Sur l'image"
    steps:
      - title: "Build"
        text: "Base épinglée, SHA du commit"
        tone: blue
      - title: "Scan"
        text: "L'empreinte, pas le Dockerfile seul"
        tone: amber
      - title: "Registre"
        text: "Promue seulement si le scan passe"
        tone: teal
  - title: "Sur le staging"
    steps:
      - title: "Déploiement"
        text: "Identité au moindre droit"
        tone: teal
      - title: "DAST"
        text: "Parcours exposé, comptes de test"
        tone: violet
      - title: "Approbation"
        text: "La prod ne part pas sur une exception orale"
        tone: blue
```

Aucun de ces outils ne remplace la revue d'un changement sensible (paiement, droits, suppression de données). Aucun ne remplace l'audit annuel si un contrat le demande. Ils empêchent la classe d'erreurs que l'on sait chercher toute seule, à chaque livraison, pendant que l'auteur est encore là.

Le premier mois, on peut vivre avec le détecteur de secrets, le scan de dépendances sur le verrou, le scan d'image, et des droits séparés. Le SAST sur deux règles graves et un DAST léger sur le staging viennent dès que le pipeline tient. Ajouter cinq produits avant d'avoir un pipeline vert ne sécurise pas la livraison : cela la rend illisible.

# Exercices

## Exercice 1 : Un jeton dans la chaîne

Pour « débloquer le registre », un script de pipeline contient `echo $REGISTRY_TOKEN` en cas d'échec, et le Dockerfile a eu la semaine dernière `ARG REGISTRY_TOKEN` pour un essai, depuis retiré. Le jeton n'a pas été révoqué. Le scan de secrets sur le dépôt actuel est vert.

Qu'est-ce qui est encore exposé, et dans quel ordre agissez-vous ?

<details>
<summary>Voir la solution</summary>

Le scan vert ne couvre que le **dépôt actuel**. Le jeton a pu rester dans l'historique Git, dans une couche de l'image déjà poussée, dans les logs du pipeline à cause du `echo`, et dans le cache du builder. Il est peut-être encore **valide**.

Ordre : **révoquer** le jeton et en émettre un nouveau côté coffre, tout de suite. Ensuite retirer le `echo`, vérifier que les logs ne le reçoivent plus, reconstruire l'image sans `ARG` secret, et traiter l'historique (invalidation des clones, nettoyage si la politique du dépôt l'exige). Chercher la ligne dans Git avant de révoquer laisse une fenêtre où la clé fonctionne encore.

</details>

## Exercice 2 : Quelle faille bloque

Le scan du jour remonte trois sujets. A : faille critique, exploit public, dans la bibliothèque HTTP qui sert `POST /commandes`, correctif disponible. B : faille moyenne dans un outil de formatage lancé seulement sur le poste, absent de l'image. C : faille critique dans un paquet de l'image de base, sans correctif publié.

Que bloque le pipeline, que transforme-t-on en ticket, et quelle forme prend l'exception ?

<details>
<summary>Voir la solution</summary>

**A bloque.** La bibliothèque part en production, l'exploit existe, le correctif aussi. On monte la version dans le fichier de verrouillage, on recommence le scan, on ne déploie pas l'empreinte rouge.

**B est un ticket.** L'outil ne voyage pas dans l'image. Bloquer la livraison dessus mélange hygiène du poste et risque de production.

**C ne se « corrige » pas par une montée de version.** Exception écrite : propriétaire, date de revue dans la semaine, contournement (changer d'image de base, isoler, ou accepter le risque le temps que le correctif existe). Pas un message oral « on verra après les soldes » sans date. L'empreinte et le résumé du scan restent attachés au SHA.

</details>

## Exercice 3 : SAST, DAST, ou audit

Trois demandes arrivent la même semaine. (1) « Interdire les requêtes SQL construites par concaténation. » (2) « Vérifier qu'une route d'admin répond 403 sans le bon rôle, sur l'environnement qui tourne. » (3) « Le client veut le rapport d'audit de mars pour le contrat. »

Où placez-vous chaque demande ? Pourquoi l'audit de mars ne couvre-t-il pas (1) et (2) pour les commits d'avril ?

<details>
<summary>Voir la solution</summary>

(1) est un **SAST** : règle sur le code, au moment du commit ou de la fusion, avant que la requête n'existe en production. (2) est un **DAST** (ou un test d'autorisation dédié) contre le **staging** qui tourne : le défaut se voit en interrogeant la route. (3) est l'**audit annuel** : on fournit le rapport de mars, qui dit ce qui a été vu en mars.

Mars ne voit pas les commits d'avril. Une concaténation ajoutée après l'audit, ou une route d'admin ouverte mardi, ne figure pas dans ce rapport. Les contrôles (1) et (2) vivent dans le pipeline justement pour couvrir ce que la photo annuelle laisse passer. Fournir le PDF de mars ne dispense pas de faire échouer la chaîne.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "DevSecOps dans le pipeline"
center: "Chaque livraison repasse secrets, dépendances, image et droits. L'audit annuel ne suffit pas."
points:
  - icon: lock
    title: "Secret hors du dépôt"
    text: "Venu du coffre à l'exécution, masqué dans les logs. Une fuite se révoque d'abord."
  - icon: puzzle
    title: "Dépendances triées"
    text: "Le critique exploitable en prod bloque. Le bruit d'un outil local devient un ticket."
  - icon: search
    title: "Image scannée"
    text: "On scanne l'empreinte construite. La base est épinglée, pas un tag flottant."
  - icon: shield
    title: "Droits justes"
    text: "Tester, déployer en staging, déployer en prod : trois identités, pas un admin partagé."
  - icon: scale
    title: "SAST puis DAST"
    text: "Le statique sur le commit. Le dynamique sur le staging. La revue garde le sensible."
pitfall: "Croire que l'audit de mars couvre le Dockerfile d'avril, ou révoquer un secret après avoir seulement effacé la ligne."
remember: "Un contrôle utile échoue la livraison tant que l'auteur du changement est encore là."
```
