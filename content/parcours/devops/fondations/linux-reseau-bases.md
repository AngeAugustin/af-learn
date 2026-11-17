---
title: Linux et réseau pour déployer
description: Lire processus, fichiers, permissions, SSH, ports, DNS et HTTP au moment d'un déploiement, sans prétendre à un cours d'administration complet.
duration: 60
objectives:
  - Vérifier qu'un service tourne avec le bon utilisateur et les bons fichiers
  - Se connecter en SSH sans partager une clé privée ni contourner un avertissement
  - Distinguer un port fermé, un nom mal résolu et un code HTTP trompeur
  - Utiliser une page de santé comme premier fait, pas comme preuve que la boutique va bien
---

# L'ordre de diagnostic

Ce chapitre n'est pas un cours d'administration Linux. C'est la page que Nora garde ouverte quand l'API commandes d'Atelier Nord ne répond pas comme prévu. Six commandes, lues dans un ordre stable, évitent de changer dix réglages au hasard.

On part de ce que le client rencontre, puis on descend.

```diagram
type: layers
title: "Du symptôme vers la machine"
layers:
  - title: HTTP
    text: "Quel code, sur quel chemin, avec quel en-tête d'hôte."
  - title: DNS
    text: "Le nom vu par la machine est-il l'adresse attendue."
  - title: Port
    text: "Quelque chose écoute-t-il, et le proxy peut-il le joindre."
  - title: Processus
    text: "Le service est-il actif, sous le bon utilisateur."
  - title: Fichiers
    text: "La configuration est-elle lisible par cet utilisateur."
```

L'erreur classique de l'équipe de six est de commencer par le bas : Chloé change un droit sur un fichier alors que le nom `api.atelier-nord.example` pointe encore vers l'ancienne machine. Ou l'inverse : Nora relance le service alors que le proxy reçoit un `200` sur `/sante` et que seul le paiement est cassé. L'ordre ci-dessus empêche de réparer la mauvaise couche.

Vous n'avez pas besoin, ici, de savoir écrire une unité systemd complète, ni de régler un pare-feu d'entreprise. Vous avez besoin de reconnaître **où** ça casse, et de ne pas confondre les couches. Le reste de l'administration (sauvegardes, durcissement, réseau avancé) est un autre métier, que l'on croise sans le remplacer.

# Processus

Un processus est un programme en cours d'exécution. L'API commandes est censée en être un, lancé au démarrage de la machine, sous l'utilisateur `commandes`, pas sous `root`. S'il n'existe pas, aucune configuration fine ne le fera répondre.

```bash
systemctl status commandes --no-pager
ps -o user,pid,lstart,cmd -C commandes
journalctl -u commandes -n 30 --no-pager
```

`systemctl status` dit si l'unité est active, depuis quand, et le dernier code de sortie. `ps` confirme l'utilisateur. `journalctl` montre les dernières lignes du service : une exception au démarrage, un fichier introuvable, un port déjà pris.

Ce que vous cherchez au moment d'un déploiement :

- le processus est **actif** après le redémarrage déclenché par le pipeline ;
- il tourne sous `commandes`, pas sous votre compte personnel ;
- son heure de démarrage correspond au déploiement, pas à la semaine dernière ;
- les premières lignes de journal après cette heure ne montrent pas une erreur de configuration.

Un redémarrage « réussi » qui laisse l'ancien processus en place arrive quand deux mécanismes lancent l'API : l'unité systemd et un script lancé à la main il y a trois mois. `ps` montre alors deux lignes. Le proxy peut encore parler à l'ancienne. `/sante` tranche, si la version y est écrite. Deux processus sans version affichée, c'est une devinette.

> [!WARNING]
> Ne lancez pas l'API à la main « pour dépanner » sous votre compte, dans un terminal que vous fermerez en partant. Le dépannage devient le mode de production, et il meurt avec la session.

Si le journal dit `address already in use`, un autre processus tient déjà le port. On identifie lequel (section ports), on ne change pas le code des frais pour autant.

# Fichiers et permissions

Le processus lit des fichiers : le programme, un répertoire de travail, une configuration, parfois un certificat. S'il ne peut pas les lire, il démarre puis s'arrête, ou il démarre avec des valeurs par défaut que personne n'a voulues.

```bash
ls -ld /opt/commandes /opt/commandes/config
ls -l /opt/commandes/config/config.env
```

Une ligne typique après un déploiement sain :

```text
drwxr-x--- 2 commandes commandes 4096 nov 16 09:10 /opt/commandes/config
-rw-r----- 1 commandes commandes  180 nov 16 09:10 config.env
```

Lisez les dix caractères de gauche par groupes. `d` annonce un répertoire. Ensuite, trois droits pour le propriétaire, trois pour le groupe, trois pour les autres : `r` lire, `w` écrire, `x` exécuter. Sur un répertoire, `x` veut dire « entrer et traverser ». Sans `x`, connaître le nom du fichier ne suffit pas à l'ouvrir.

`config.env` en `-rw-r-----` est lisible par le propriétaire et le groupe `commandes`, pas par le reste du système. C'est ce que l'on veut pour un fichier qui contient l'adresse de la base. `-rw-r--r--` le rend lisible par tout compte de la machine. `777` (tout le monde lit, écrit, exécute) n'est pas une réparation, c'est l'abandon du contrôle.

L'incident le plus fréquent chez Atelier Nord : Nora copie les fichiers en tant que `root`. Le service, lui, tourne en `commandes` et ne peut plus lire `config.env`. Le journal dit « permission denied ». Le correctif est de rendre le fichier au bon propriétaire, pas d'ouvrir les droits au monde entier.

```bash
sudo chown -R commandes:commandes /opt/commandes/config
sudo chmod 750 /opt/commandes/config
sudo chmod 640 /opt/commandes/config/config.env
```

`750` sur le répertoire : le propriétaire entre et modifie, le groupe entre et lit, les autres ne traversent pas. `640` sur le fichier : le propriétaire écrit, le groupe lit, les autres ne voient rien.

Le répertoire de travail compte aussi. Une configuration en chemin relatif (`./config/config.env`) dépend du répertoire depuis lequel le processus est lancé. L'unité systemd fixe ce répertoire. Un essai manuel lancé depuis `/root` ne lit pas les mêmes fichiers que le service. Encore une raison de ne pas « dépanner à la main » et de croire que c'est la production.

# SSH sans partager la clé

SSH est la porte d'entrée d'administration. Pour déployer, vous vous en servez encore parfois : regarder un journal sur la recette, confirmer un droit, vérifier quel binaire est en place. Le pipeline doit rester le chemin normal de mise en ligne. SSH est le chemin pour comprendre, pas pour copier un dossier à la sauvette.

```bash
ssh -i ~/.ssh/id_ed25519 deploy@recette.atelier-nord.example
```

La clé privée (`id_ed25519`, sans extension `.pub`) reste sur le poste de Léa ou de Nora. La clé publique (`.pub`) est copiée dans `authorized_keys` du compte `deploy` sur le serveur. Le compte `deploy` n'est pas `root`. Il a les droits dont le diagnostic a besoin, pas davantage.

```bash
# Créer une clé dédiée à ce poste, une fois
ssh-keygen -t ed25519 -C "nora@atelier-nord" -f ~/.ssh/id_ed25519
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
```

Trois refus nets, dans l'équipe de six.

On n'envoie pas la clé privée dans le chat, ni dans le dépôt, ni dans le ticket « pour que Marc puisse voir ». On lui crée une clé à lui, ou mieux : il passe par le pipeline et par les journaux déjà collectés.

On ne se connecte pas avec un mot de passe partagé `deploy`. Le jour où il fuit, on ne sait pas quelle personne couper.

On ne répond pas à l'avertissement de clé d'hôte inconnue, ou de clé qui a changé, en désactivant la vérification de façon permanente. Cet avertissement dit « ce n'est peut-être pas la machine à laquelle vous croyez ». On vérifie l'empreinte par un canal déjà connu (la console du fournisseur, Nora au téléphone), puis on met à jour `known_hosts` si le changement est légitime (serveur reconstruit).

Le compte `deploy` sur la production peut exister pour le diagnostic. Il ne doit pas être le seul moyen de livrer. Si Samir ne peut corriger un arrondi qu'en copiant un fichier par SSH, le chapitre sur le métier n'est pas encore appliqué.

# Ports

Un port est un numéro sur lequel un processus attend des connexions. L'API écoute en `8080`, uniquement sur la machine. Le proxy public écoute en `443` et transmet vers `8080`. Le port `22` sert à SSH. Les clients de la boutique ne parlent jamais à `8080` directement.

```bash
ss -lnt
```

`-l` : en écoute. `-n` : numéros, pas de résolution de noms. `-t` : TCP. Vous devez voir `0.0.0.0:443` ou l'adresse du proxy, et `127.0.0.1:8080` pour l'API si elle n'est pas exposée. Si `8080` apparaît sur `0.0.0.0`, l'API est joignable en contournant le proxy : à signaler, pas à laisser « parce que ça marche ».

Deux symptômes que l'on confond :

**Connexion refusée tout de suite.** La machine est joignable, rien n'accepte ce port, ou un refus est explicite. Piste : processus arrêté, mauvais port dans la configuration, proxy qui vise `8081` alors que l'API écoute en `8080`.

**Attente, puis échec.** Le paquet n'arrive pas, ou la réponse est jetée. Piste : mauvaise adresse, groupe de sécurité, pare-feu, machine éteinte. Relancer le processus sur la mauvaise machine ne changera rien. On vérifie l'adresse (section DNS) avant de redéployer le code.

```bash
ss -lntp
```

Le `-p` affiche le nom du processus, souvent réservé à un compte privilégié. C'est la commande qui répond à « qui tient déjà le port » quand le journal dit que l'adresse est prise. On arrête le doublon identifié, on ne tire pas un nouveau port au hasard : le proxy, lui, connaît l'ancien numéro.

# DNS

Le DNS traduit un nom en adresse. `api.atelier-nord.example` doit viser la machine qui porte le proxy de l'API, pas l'ancienne, pas le portable de Léa.

```bash
dig +short api.atelier-nord.example A
getent hosts api.atelier-nord.example
```

`dig` interroge un résolveur et montre l'enregistrement public. `getent` montre ce que **cette** machine utilisera vraiment, y compris une ligne de `/etc/hosts` qui écrase le nom. Les deux peuvent différer. Après une bascule, c'est une cause classique : la production a été déplacée, mais la recette garde une vieille ligne `hosts` qui pointe vers un serveur détruit. `dig` a l'air sain, `curl` sur la recette parle à un fantôme.

Les enregistrements ont un TTL, une durée de cache. Après un changement d'adresse, deux personnes de l'équipe peuvent voir deux adresses différentes pendant quelques minutes. Ce n'est pas « le DNS est aléatoire ». C'est un cache. On attend la durée annoncée, ou on vérifie quelle adresse chaque machine a encore en mémoire, avant de conclure que le déploiement est cassé.

> [!TIP]
> Quand seule une personne « ne voit pas » la nouvelle API, comparez l'adresse qu'elle résout à celle du pipeline. Un désaccord de DNS se règle au DNS, pas en reconstruisant l'artefact.

Vous n'avez pas à connaître ici toutes les familles d'enregistrements. Pour déployer l'API, `A` (adresse IPv4) ou `AAAA` (IPv6) suffisent presque toujours. Si le nom ne résout rien, le problème n'est pas le code des frais.

# HTTP au moment du déploiement

HTTP est ce que le proxy et les clients parlent. Au déploiement, vous lisez un code de statut avant de lire une opinion.

```bash
curl -sS -D - -o /dev/null https://api.atelier-nord.example/sante
```

`-D -` affiche les en-têtes. `-o /dev/null` ignore le corps pour cette lecture rapide. Vous voulez le code, puis, si le code est `200`, le corps de `/sante` avec une seconde commande pour voir la version.

Codes qui reviennent sans cesse sur la boutique :

- **200** sur `/sante` : ce chemin a répondu. Le paiement peut quand même être cassé. La santé du processus n'est pas la santé du parcours d'achat.
- **301 ou 302** : redirection. Vérifiez que vous n'êtes pas renvoyé en boucle, ou vers l'ancienne adresse.
- **401 ou 403** : vous avez atteint une application, elle refuse cette identité. Ce n'est pas un processus arrêté.
- **404** : ce chemin n'existe pas. Le processus, lui, est souvent en vie. On a déployé un artefact qui n'a pas la route, ou le proxy vise le mauvais préfixe.
- **502** : le proxy n'a aucun exemplaire sain en face. Processus arrêté, mauvais port, ou démarrage trop lent pour le délai du proxy.
- **503** : le service refuse du trafic, souvent parce qu'il s'arrête proprement pendant un déploiement, ou parce qu'il est saturé. Quelques `503` pendant un roulement peuvent être prévus. Des `503` qui restent ne le sont pas.
- **504** : le proxy a attendu trop longtemps. L'API est trop lente, bloquée sur la base ou sur le paiement.

Le nom d'hôte compte. Plusieurs sites peuvent partager une adresse. Le proxy choisit le site avec l'en-tête `Host`. Un `curl` vers l'adresse IP nue peut montrer un autre site, ou un certificat qui ne correspond pas. On teste le nom que les clients utilisent.

```bash
curl -sS https://api.atelier-nord.example/sante
```

On ne désactive pas la vérification TLS pour « faire passer » le contrôle. Un certificat expiré ou un nom qui ne correspond pas est un vrai défaut : les clients de la boutique le verront aussi. On le traite (certificat, nom, horloge de la machine) au lieu de l'effacer de la commande.

La page utile tient donc en une séquence, toujours la même :

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://api.atelier-nord.example/sante
getent hosts api.atelier-nord.example
ss -lnt | grep -E '443|8080'
systemctl status commandes --no-pager
journalctl -u commandes -n 20 --no-pager
```

Vous vous arrêtez à la première couche fausse. C'est tout le chapitre : pas devenir administrateur, savoir ne pas déployer une deuxième fois un artefact sain alors que le nom, le port ou le droit du fichier est le seul problème.

# Exercices

## Exercice 1 : Permission denied au redémarrage

Après un déploiement, `systemctl status commandes` montre le service en échec. Les dernières lignes du journal disent `permission denied` sur `/opt/commandes/config/config.env`. `ls -l` affiche :

```text
-rw-r----- 1 root root 180 nov 16 09:10 /opt/commandes/config/config.env
```

Le service est défini avec `User=commandes`. Que s'est-il passé, quelle commande corrige le propriétaire, et pourquoi `chmod 777` n'est pas la solution de l'équipe ?

<details>
<summary>Voir la solution</summary>

Le fichier appartient à `root`. Le processus tourne en `commandes`. Le mode `640` n'autorise la lecture qu'au propriétaire et au groupe `root`. Le compte `commandes` n'est ni l'un ni l'autre, d'où le refus.

```bash
sudo chown commandes:commandes /opt/commandes/config/config.env
sudo chmod 640 /opt/commandes/config/config.env
sudo systemctl restart commandes
```

On vérifie ensuite le statut et `/sante`.

`chmod 777` ferait taire le symptôme en rendant le fichier lisible et modifiable par tous les comptes de la machine, y compris ceux qui n'ont rien à faire avec l'adresse de la base. Le prochain déploiement en `root` reproduirait le désordre, avec un fichier encore plus exposé. Le correctif durable est le propriétaire, et un pipeline qui ne copie plus les fichiers en `root`.

</details>

## Exercice 2 : Refus immédiat ou attente

Depuis le pipeline, le déploiement dit « réussite », mais les clients ne commandent plus. Deux essais, faits depuis la machine du proxy :

1. `curl` vers `http://127.0.0.1:8080/sante` revient tout de suite avec « connection refused ».
2. `curl` vers `https://api.atelier-nord.example/sante` attend vingt secondes puis échoue.

`ss -lnt` ne montre ni `8080` ni `443`. `dig +short api.atelier-nord.example` renvoie une adresse qui n'est pas celle de cette machine.

Par quelle couche commencez-vous, et que ne faites-vous pas ?

<details>
<summary>Voir la solution</summary>

On commence par les faits déjà sur la table, sans redéployer.

Le refus immédiat sur `127.0.0.1:8080` et l'absence d'écoute dans `ss` disent que le processus n'écoute pas sur cette machine. On confirme avec `systemctl status` et le journal : service arrêté, ou planté au démarrage.

L'attente sur le nom public, et une adresse `dig` qui n'est pas celle de la machine où l'on est, disent que le nom ne vise pas ce proxy. Même si l'on rallume le processus ici, les clients qui suivent le DNS n'arriveront pas. Il faut traiter l'enregistrement (ou le cache, s'il s'agit d'un TTL) **et** le processus, comme deux couches.

On ne commence pas par modifier le calcul des frais, ni par un `chmod`, ni par une seconde compilation sur le serveur. Le code n'a pas encore eu l'occasion de répondre. On ne désactive pas non plus la vérification du nom pour forcer `curl` à réussir.

</details>

## Exercice 3 : Un 200 qui ne prouve pas la boutique

`/sante` répond `200` avec `{"version":"1.8.3","commit":"a1b2c3d"}`. Inès dit que les clients ne peuvent pas payer. Samir veut relancer le déploiement tout de suite.

Que prouve le `200`, que ne prouve-t-il pas, et quelle vérification suivante proposez-vous avant un nouveau déploiement ?

<details>
<summary>Voir la solution</summary>

Le `200` prouve que le proxy joint un processus, que ce processus sert la route `/sante`, et que la version affichée est `1.8.3` du commit `a1b2c3d`. C'est précieux : on sait **qui** répond.

Il ne prouve pas que le paiement, le stock ou la base vont bien. Une route de santé qui ne fait qu'afficher une constante reste verte quand le prestataire de paiement refuse toutes les commandes.

Avant de déployer à nouveau le même commit, on regarde un signal du parcours : code HTTP de la route de paiement sur une commande de recette ou sur les journaux de production, nombre de paiements réussis sur les dernières minutes, dernière erreur écrite par l'API. Si la version est déjà la bonne et que le paiement échoue, un second déploiement du même artefact reproduit le même échec. On cherche la couche métier (prestataire, variable, donnée), pas une nouvelle copie du binaire.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Linux et réseau pour déployer"
center: "Descendre du symptôme HTTP jusqu'au fichier, et s'arrêter à la première couche fausse."
points:
  - icon: server
    title: "Un processus, un utilisateur"
    text: "Le service tourne sous commandes, depuis le déploiement. Pas un second exemplaire lancé à la main."
  - icon: lock
    title: "Droits du fichier"
    text: "Le propriétaire doit pouvoir lire la configuration. 777 n'est pas un correctif de déploiement."
  - icon: key
    title: "SSH personnel"
    text: "La clé privée reste sur le poste. Un avertissement de clé d'hôte se vérifie, il ne se désactive pas."
  - icon: network
    title: "Refus ou silence"
    text: "Un refus immédiat pointe le port ou le processus. Une attente pointe l'adresse, le filtre ou la route."
  - icon: link
    title: "Le nom, puis le code"
    text: "getent et dig peuvent diverger. Un 200 sur /sante ne prouve pas que le paiement fonctionne."
pitfall: "Recompiler et redéployer alors que le nom, le port ou le propriétaire du fichier est le seul problème."
remember: "Cinq vérifications dans l'ordre valent mieux qu'un cours d'administration lu pendant la panne."
```
