---
title: "Dev, staging, production"
description: "Séparer les environnements et les comptes, viser une parité raisonnable, surveiller les coûts, et limiter qui peut appliquer en production."
duration: 64
objectives:
  - Distinguer dev, staging et production par le risque et par les données
  - Isoler les comptes ou les projets pour limiter le rayon d'un apply raté
  - Dire quelle parité vaut le coût, et laquelle masque les écarts
  - Réserver l'apply de production à un rôle de CI, après revue du plan
---

# Dev, staging, production

Trois environnements suffisent à une équipe qui livre une API. En ajouter dix « par squad » sans propriétaire multiplie les clusters oubliés.

**Dev** est l'endroit où l'on casse. Données synthétiques, taille petite, apply fréquent, parfois depuis la CI d'une branche. Une erreur y coûte du temps, pas des clients.

**Staging** est la répétition. On y déploie **le même artefact** que la production verra, avec les migrations, les sondes et le chemin de la CI. On n'y met pas la base des clients. On y met un jeu réaliste par la forme (volumes, cas limites), pas par l'identité des personnes.

**Production** sert le trafic réel. Les changements y arrivent après staging, pendant une fenêtre que l'équipe sait surveiller. On n'y essaie pas une idée.

```diagram
type: compare
title: "Trois environnements"
columns:
  - title: "Dev"
    tone: blue
    items:
      - "Essais, branches, données factices"
      - "Petite taille, apply fréquent"
      - "Une casse reste locale"
  - title: "Staging"
    tone: amber
    items:
      - "Répétition du même digest"
      - "Migrations et sondes comme en prod"
      - "Jeu réaliste, sans clients réels"
  - title: "Production"
    tone: rose
    items:
      - "Trafic et données réels"
      - "Apply rare, revu, réversible"
      - "Le coût d'une erreur est celui du service"
```

Le même **digest** d'image monte les trois marches. Reconstruire en staging « pour aller plus vite », puis reconstruire encore en production, produit d'autres octets : une base `latest` tirée entre-temps, une dépendance résolue autrement. On ne sait plus ce que staging a validé. La CI construit une fois, pousse, et chaque environnement épingle ce digest.

# Comptes ou projets séparés

Un **compte** (AWS), un **projet** (GCP) ou un **abonnement** (Azure) est une frontière de droits et de facture. Dev et production dans le même compte, avec les mêmes clés administrateur, veulent dire qu'un script d'essai peut lister, modifier ou détruire la production. Le plan « vert » de dev n'est vert que jusqu'au moment où la variable de compte est la mauvaise.

On sépare au minimum le jeu et le sérieux : un compte pour dev (et les bacs à sable), un compte pour staging, un compte pour production. Les identifiants ne se croisent pas. Un rôle de dev n'a pas de politique dans le compte de production, donc il ne peut pas « se tromper de bucket » : le bucket n'existe pas dans son univers.

La facture suit la frontière. On voit ce que staging coûte sans le mélanger aux clients. Les politiques du compte de production peuvent interdire ce que le code n'oserait pas demander (un bucket public, une clé d'accès à vie). Le code reste la description. Le compte est le mur.

Séparer ne dispense pas de nommer. Trois comptes sans convention (`test`, `test2`, `nouveau-test`) redeviennent une console. Chaque compte a un propriétaire, un état Terraform distant **dans ce compte ou dans un compte d'état dédié**, et une CI qui ne possède qu'un rôle.

# Une parité raisonnable

La **parité** veut dire que staging échoue pour les mêmes raisons que la production échouerait. Elle ne veut pas dire la photocopie de la production, à la même taille, avec les mêmes données. Cette photocopie coûte autant que la production et concentre des données réelles dans un environnement moins gardé.

On aligne ce qui change le comportement :

- le même chart ou les mêmes modules, la même version ;
- le même digest d'image, les mêmes migrations ;
- les sondes, les requests, la forme du réseau (privé, pas de base ouverte) ;
- le chemin de déploiement (la CI, pas un portable en staging et une CI en production).

On accepte des écarts qui réduisent la facture sans mentir :

- moins de réplicas, de plus petites machines, une seule zone en dev ;
- pas de données clients, un jeu généré ;
- des quotas plus bas, une rétention de logs plus courte ;
- un domaine et des secrets **différents**, jamais une copie du coffre de production.

On refuse les écarts qui truquent la répétition. Staging en Docker Compose et production en Kubernetes : les sondes, les Services et les volumes n'ont jamais été répétés. PostgreSQL 15 en staging et 16 en production : la migration du lundi est la première. Un Ingress avec un timeout seulement en production : staging ne peut pas montrer la panne.

```diagram
type: flow
title: "Le même artefact, des murs différents"
steps:
  - title: "Build unique"
    text: "Un digest, un commit, un scan."
    tone: violet
  - title: "Dev"
    text: "Compte d'essai, petite taille."
    tone: blue
  - title: "Staging"
    text: "Même chemin, données synthétiques."
    tone: amber
  - title: "Production"
    text: "Même digest, apply approuvé."
    tone: teal
```

# Les coûts qui s'accumulent

Le cloud facture ce qui tourne, pas ce qui sert. Les sommes qui reviennent dans une équipe DevOps sont ennuyeuses et grosses.

- Un cluster de dev allumé 168 heures par semaine pour 40 heures de travail.
- Un LoadBalancer **par** service, y compris l'admin et les environnements de branches.
- Des journaux en `debug`, ingérés et conservés comme si c'était de l'audit.
- Des disques, des IP et des bacs à sable sans date de fin, dans un compte que plus personne n'ouvre.
- Du trafic inter-zones copié « pour faire comme la prod » en dev, sans le trafic qui le justifie.

On écrit un propriétaire et une date sur les essais. La CI détruit l'environnement de la pull request au merge. Le cluster de dev s'éteint la nuit si le métier s'en accommode, ou il reste petit. Les alertes de budget partent avant la facture, pas après. Staging reste assez proche pour la répétition, pas assez grand pour doubler la production « au cas où ».

La parité raisonnable **est** une décision de coût. Trois réplicas et deux zones en staging, si la production en a trois et trois, suffisent souvent à voir un pod mourir. Neuf réplicas « pour la fidélité » n'apprennent rien de plus.

# Qui a le droit d'appliquer en production

Proposer un changement et **l'appliquer** en production ne sont pas le même droit. Tout le monde peut ouvrir une pull request. Peu de rôles peuvent l'appliquer sur le compte de production.

Le chemin courant : la CI du compte de production assume un rôle étroit (ce dépôt, ces resources), elle publie le plan, une ou deux personnes l'approuvent, puis `terraform apply` reprend **ce** plan. Pas de clé à vie sur un portable. Pas de compte administrateur partagé dans un gestionnaire de mots de passe « pour dépanner ». Pas de `-auto-approve` sur ce compte.

Le même schéma vaut pour Kubernetes : déployer le digest en production est une étape protégée de la CI, pas un `kubectl` depuis une machine qui a aussi le contexte de dev. Se tromper de contexte est la panne la plus bête, et la séparation des comptes la rend plus difficile : le contexte de dev n'a simplement pas les identifiants.

Le break-glass existe, séparé, journalisé, sans usage hebdomadaire. S'en servir rouvre le chapitre précédent : le code rattrape le clic. Les personnes qui approuvent l'apply ne sont pas un goulot silencieux. Si elles ne lisent pas le plan, l'approbation est une signature vide. Si elles sont seules en vacances, le rôle d'astreinte est prévu, il n'est pas « tout le monde devient admin ».

> [!IMPORTANT]
> Un apply de production se reconnaît à trois choses : un plan déjà lu, un rôle de CI, un compte où les clés de dev n'existent pas.

# Exercices

## Exercice 1 : Le digest qui change de marche

La CI construit l'image sur la branche, la déploie en dev, puis **reconstruit** au merge pour staging, puis reconstruit encore pour la production. Entre les deux, le Dockerfile fait `FROM python:3.12-slim` sans digest, et le registry a bougé.

Pourquoi staging n'a-t-il pas validé ce que la production exécute ? Quel flux remettez-vous ?

<details>
<summary>Voir la solution</summary>

Chaque build a pu tirer une base différente. Le digest de production n'est pas celui que staging a fait tourner. Les tests d'intégration de staging parlent d'un autre artefact.

La CI construit **une fois**, scanne, pousse, et note le digest. Dev, staging puis production déploient ce digest, dans cet ordre, sans rebuild. La base du Dockerfile s'épingle elle aussi quand on veut que le mois prochain ressemble à aujourd'hui. La promotion est un changement de manifeste, pas un nouveau `docker build`.

</details>

## Exercice 2 : Un seul compte, des clés admin

Dev, staging et production sont dans le même compte cloud. Les trois environnements utilisent une clé d'accès administrateur copiée sur les portables « pour terraform apply ». Un script de dev contient le mauvais nom de bucket.

Quel est le rayon de l'erreur, et quelle séparation minimale proposez-vous ?

<details>
<summary>Voir la solution</summary>

Le script peut voir et modifier la production : même compte, mêmes droits admin. Le mauvais nom de bucket n'est pas une barrière, c'est un accident en attente. Les portables sont autant de copies de la clé.

Séparation minimale : un compte (ou projet) par environnement, un état distant par compte, un rôle de CI par compte. Les portables n'ont un apply que sur le compte de dev, ou pas d'apply du tout. La production n'accepte que le rôle de la CI, après plan approuvé. La clé partagée est révoquée, pas « laissée pour les urgences ».

</details>

## Exercice 3 : Staging qui ne répète rien

Staging tourne avec Docker Compose, une base PostgreSQL 15 et des données copiées de la production. La production est un cluster Kubernetes, PostgreSQL 16, sondes comprises. L'équipe dit que staging « passe » avant chaque mise en production.

Qu'est-ce que ce staging ne peut pas montrer ? Quelle parité gardez-vous, et quelles données retirez-vous ?

<details>
<summary>Voir la solution</summary>

Il ne montre ni les sondes, ni le Service, ni le déroulement des pods, ni le comportement de PostgreSQL 16, ni la migration qui va avec. Un succès Compose ne dit rien du manifeste Kubernetes. Les données de production dans staging sont en plus une fuite : staging est moins gardé.

On aligne le chemin : même chart, même digest, PostgreSQL 16, sondes présentes, taille plus petite. Les données deviennent un jeu synthétique de même forme. On retire la copie de production (et on fait tourner les secrets qui ont fui avec elle). Le coût reste inférieur à un second site complet, parce que les réplicas et les disques sont plus petits, pas parce que la plateforme est différente.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Trois environnements"
center: "Dev casse, staging répète, la production sert. Le même digest monte, les comptes ne se mélangent pas."
points:
  - icon: tool
    title: "Dev"
    text: "Données factices, petite taille, apply fréquent. Une erreur n'atteint pas les clients."
  - icon: test
    title: "Staging"
    text: "Même artefact et même chemin que la prod, sans données clients ni taille photocopiée."
  - icon: rocket
    title: "Un seul build"
    text: "La CI pousse un digest. Les environnements le promeuvent, ils ne reconstruisent pas."
  - icon: money
    title: "Coût"
    text: "Clusters de nuit, un équilibreur par service, bacs à sable sans date de fin."
  - icon: key
    title: "Apply prod"
    text: "Rôle de CI, plan déjà lu, compte séparé. Pas de clé admin sur les portables."
pitfall: "Appeler staging un Compose avec une copie de la base clients, puis croire la répétition faite."
remember: "On sépare les comptes et les droits. On aligne le chemin de déploiement, pas la facture."
```
