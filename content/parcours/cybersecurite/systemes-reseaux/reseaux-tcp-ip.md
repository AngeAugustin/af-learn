---
title: Réseaux TCP/IP et sécurité réseau
description: Modèle en couches, adresses IP, ports, TCP et UDP, DNS et HTTP ; pare-feu, segmentation, DMZ, VPN et outils d'observation du réseau.
duration: 60
objectives:
  - Expliquer le fonctionnement d'une communication TCP/IP
  - Identifier les protocoles et ports courants et leurs risques
  - Concevoir une segmentation réseau avec pare-feu et DMZ
  - Observer le trafic de son propre réseau avec les outils standard
---

# Le modèle en couches

Une communication réseau est découpée en **couches**, chacune rendant un service à la couche supérieure. Le modèle **OSI** en décrit sept ; le modèle **TCP/IP**, utilisé en pratique, en regroupe quatre :

```diagram
type: layers
title: Le modèle TCP/IP
layers:
  - title: Application
    text: Ce que voit le programme
    items: [HTTP/HTTPS, DNS, SMTP, SSH, RDP]
  - title: Transport
    text: Communication entre processus, identifiés par des ports
    items: [TCP, UDP]
  - title: Internet (réseau)
    text: Acheminement entre réseaux, adresses IP
    items: [IPv4, IPv6, ICMP]
  - title: Accès réseau (liaison)
    text: Transmission sur le support local, adresses MAC
    items: [Ethernet, Wi-Fi, ARP]
```

Comprendre les couches aide à situer une attaque ou une protection : un pare-feu classique filtre aux couches réseau et transport (adresses, ports), un pare-feu applicatif web (WAF) inspecte la couche application (contenu des requêtes HTTP).

# Adresses, ports et protocoles

## Les adresses IP

- **IPv4** : 32 bits, notées `192.0.2.17`. Le préfixe (`/24`) indique la taille du réseau.
- Des plages sont réservées aux **réseaux privés** (RFC 1918) : `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`. Elles ne sont pas routées sur Internet ; la **traduction d'adresses** (NAT) permet aux machines d'en sortir via une adresse publique.
- **IPv6** : 128 bits, notées `2001:db8::17`. Sa généralisation progresse ; attention aux règles de pare-feu qui ne couvrent qu'IPv4.

## TCP et UDP

```diagram
type: compare
title: Les deux protocoles de transport
columns:
  - title: TCP
    tone: blue
    items:
      - Connexion établie (poignée de main SYN, SYN-ACK, ACK)
      - Livraison fiable et ordonnée
      - Web, messagerie, SSH, bases de données
  - title: UDP
    tone: amber
    items:
      - Sans connexion, sans garantie de livraison
      - Faible latence
      - DNS, voix et vidéo, jeux, QUIC (HTTP/3)
```

```diagram
type: sequence
title: La poignée de main TCP
actors: [Client, Serveur]
messages:
  - from: 0
    to: 1
    text: "SYN : je veux ouvrir une connexion"
  - from: 1
    to: 0
    text: "SYN-ACK : d'accord, et toi ?"
  - from: 0
    to: 1
    text: "ACK : connexion établie"
```

## Les ports courants

Un **port** identifie un service sur une machine. Quelques ports à connaître, avec leur enjeu de sécurité :

| Port | Service | Remarque de sécurité |
|---|---|---|
| 22/TCP | SSH | Administration à distance ; authentification par clé, jamais exposé sans protection |
| 25, 587/TCP | SMTP | Envoi de courriels ; SPF, DKIM, DMARC contre l'usurpation |
| 53/UDP et TCP | DNS | Résolution de noms ; détournements et exfiltration possibles |
| 80/TCP | HTTP | **En clair** : à rediriger vers HTTPS |
| 443/TCP (et UDP pour HTTP/3) | HTTPS | Chiffré par TLS (module 3) |
| 445/TCP | SMB | Partage de fichiers Windows ; ne **jamais** l'exposer sur Internet |
| 3389/TCP | RDP | Bureau à distance ; cible majeure des attaques, à placer derrière un VPN |
| 3306, 5432/TCP | MySQL, PostgreSQL | Bases de données ; jamais accessibles depuis Internet |

> [!WARNING]
> Les protocoles **en clair** (HTTP, Telnet, FTP, et toute connexion sans TLS) transmettent identifiants et données lisibles par toute personne capable d'observer le trafic (Wi-Fi public, équipement compromis). Utilisez systématiquement leurs équivalents chiffrés (HTTPS, SSH, SFTP).

## DNS

Le **DNS** traduit un nom (`www.exemple.fr`) en adresse IP. C'est un service critique : un DNS détourné envoie les utilisateurs vers un faux site. Bonnes pratiques : protéger le compte du registraire (MFA), surveiller les enregistrements, utiliser **DNSSEC** pour signer les réponses quand c'est possible, et superviser les requêtes DNS sortantes (elles servent parfois à exfiltrer des données ou à contacter un serveur de commande).

# Sécuriser le réseau

## Pare-feu et filtrage

Un **pare-feu** filtre le trafic selon des règles (adresses source et destination, ports, protocole, état de la connexion). Le principe de base est la **liste blanche** : tout est refusé par défaut, seuls les flux nécessaires sont autorisés, dans les deux sens (entrant **et** sortant).

```bash
# Pare-feu d'un serveur web Linux avec ufw (Ubuntu)
sudo ufw default deny incoming        # tout refuser en entrée par défaut
sudo ufw default allow outgoing       # (à restreindre aussi sur un serveur sensible)
sudo ufw allow from 10.0.5.0/24 to any port 22 proto tcp   # SSH seulement depuis le réseau d'administration
sudo ufw allow 443/tcp                # HTTPS depuis partout
sudo ufw enable
sudo ufw status verbose
```

## Segmentation et DMZ

Un réseau « à plat », où toutes les machines se voient, permet à un attaquant qui compromet un poste d'atteindre tout le reste : c'est le **mouvement latéral**. La **segmentation** découpe le réseau en zones (VLAN, sous-réseaux) séparées par des pare-feu, selon la sensibilité et le rôle.

```diagram
type: layers
title: Un réseau segmenté
layers:
  - title: Internet
    text: Non fiable
  - title: DMZ (zone démilitarisée)
    text: "Serveurs exposés : site web, relais de messagerie, reverse proxy"
  - title: Zone serveurs internes
    text: "Applications métier, bases de données : accessibles uniquement depuis les zones autorisées"
  - title: Zone utilisateurs
    text: "Postes de travail : ne parlent pas directement aux bases de données"
  - title: Zone d'administration
    text: Postes et bastions d'administration, seuls autorisés à administrer les serveurs
```

La **DMZ** héberge les services exposés à Internet : si l'un d'eux est compromis, l'attaquant reste bloqué par un second pare-feu avant les zones internes.

## Accès distants et équipements de sécurité

- **VPN** : tunnel chiffré pour accéder au réseau interne à distance, avec authentification forte. Les équipements VPN exposés sur Internet sont des cibles prioritaires : leurs **mises à jour de sécurité** doivent être appliquées très rapidement.
- **Bastion** : point d'entrée unique et journalisé pour l'administration des serveurs.
- **Reverse proxy** et **WAF** : intermédiaires devant les applications web, qui terminent TLS, filtrent et journalisent les requêtes.
- **IDS / IPS** (systèmes de détection / prévention d'intrusion) : analysent le trafic à la recherche de signatures ou de comportements d'attaque.

# Observer le réseau

Ces outils servent à **diagnostiquer et vérifier** vos propres systèmes :

```bash
ip addr                       # adresses de la machine (Linux)
ss -tulpn                     # ports en écoute et processus associés (Linux)
ping 192.168.1.1              # la machine répond-elle ?
traceroute www.exemple.fr     # chemin suivi par les paquets
dig www.exemple.fr            # interroger le DNS
nmap -sV 192.168.56.10        # ports ouverts et versions - UNIQUEMENT sur vos machines ou avec autorisation
```

**Wireshark** (interface graphique) et **tcpdump** (ligne de commande) capturent et décodent le trafic : idéal pour comprendre un protocole ou vérifier qu'une communication est bien chiffrée.

> [!CAUTION]
> Scanner ou capturer le trafic d'un réseau qui ne vous appartient pas, sans autorisation, est illégal (module 1). Pratiquez dans un laboratoire de machines virtuelles sur un réseau privé hôte.

# Exercices

## Exercice 1 : Lire une règle de pare-feu

Un serveur de base de données PostgreSQL est accessible sur le port 5432 depuis `0.0.0.0/0`. Quel est le problème ? Proposez une règle correcte.

<details>
<summary>Voir la solution</summary>

`0.0.0.0/0` signifie **n'importe quelle adresse**, y compris tout Internet : la base est exposée aux tentatives de connexion et à l'exploitation de vulnérabilités. Règle correcte : autoriser le port 5432 **uniquement** depuis l'adresse ou le sous-réseau des serveurs d'application (par exemple `10.0.2.0/24`), tout le reste étant refusé par défaut. Idéalement, la base n'a même pas d'adresse publique.

</details>

## Exercice 2 : Segmenter

Une PME a un réseau unique où se trouvent les postes des salariés, le serveur de fichiers, le serveur de comptabilité, les caméras de surveillance et le Wi-Fi des visiteurs. Proposez une segmentation.

<details>
<summary>Voir la solution</summary>

- **Wi-Fi invités** : isolé, accès Internet uniquement.
- **Caméras et objets connectés** : zone dédiée, sans accès aux postes ni aux serveurs, flux limités vers l'enregistreur.
- **Postes de travail** : accès aux serveurs uniquement sur les ports nécessaires (partage de fichiers, application de comptabilité).
- **Serveurs** : zone dédiée, administration uniquement depuis un poste ou un bastion d'administration.
- Des **pare-feu** (ou des règles sur le routeur) entre les zones, en liste blanche.

</details>

## Exercice 3 : Le mot de passe visible

Avec Wireshark, dans votre laboratoire, vous voyez en clair le mot de passe saisi sur une page de connexion. Qu'en déduisez-vous ? Que recommandez-vous ?

<details>
<summary>Voir la solution</summary>

La page est servie en **HTTP**, sans chiffrement : toute personne sur le chemin réseau (Wi-Fi public, équipement compromis) peut lire les identifiants. Recommandations : servir le site **exclusivement en HTTPS**, rediriger HTTP vers HTTPS, activer **HSTS** pour que le navigateur refuse ensuite le HTTP (module 3), et considérer comme compromis les mots de passe ayant transité en clair.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Réseaux TCP/IP et sécurité réseau
center: Comprendre les couches et les ports pour n'ouvrir que le nécessaire et cloisonner le reste.
points:
  - icon: layers
    title: Les couches
    text: Application, transport, réseau, liaison ; chaque protection agit à une couche.
  - icon: network
    title: Ports et protocoles
    text: SSH, HTTPS, DNS, SMB, RDP ; jamais de protocole en clair ni de base exposée.
  - icon: shield
    title: Pare-feu
    text: Tout refuser par défaut, autoriser seulement les flux nécessaires, entrants et sortants.
  - icon: puzzle
    title: Segmentation
    text: DMZ, zones serveurs, utilisateurs, administration ; freiner le mouvement latéral.
  - icon: eye
    title: Observer
    text: ss, dig, traceroute, nmap, Wireshark, sur ses propres systèmes uniquement.
pitfall: Un réseau à plat où un seul poste compromis donne accès à tous les serveurs.
remember: Chaque port ouvert est une porte ; chaque porte doit avoir une raison d'exister.
```
