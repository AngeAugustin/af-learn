---
title: "Sécurité réseau avancée : accès distants, Wi-Fi, messagerie et détection"
description: VPN (WireGuard, IPsec) et ZTNA, attaques et protections du réseau local, Wi-Fi d'entreprise (WPA3, 802.1X), sécurité de la messagerie (SPF, DKIM, DMARC), DNS protecteur, IDS/IPS et analyse des flux.
duration: 65
objectives:
  - Choisir et configurer un accès distant sécurisé (VPN ou ZTNA)
  - Expliquer les attaques du réseau local et les protections des commutateurs
  - Sécuriser un Wi-Fi d'entreprise et un Wi-Fi invités
  - Configurer SPF, DKIM et DMARC pour protéger un domaine contre l'usurpation
  - Mettre en place une détection réseau (IDS, journaux DNS, flux)
---

# Les accès distants

## Le VPN

Un **VPN** (*Virtual Private Network*) crée un **tunnel chiffré et authentifié** entre deux points : un poste nomade et le réseau de l'entreprise (VPN d'accès distant), ou deux sites (VPN site à site).

| Technologie | Caractéristiques |
|---|---|
| **IPsec** (IKEv2) | Standard historique, très répandu pour les liaisons site à site et chez les équipementiers |
| **VPN TLS** (« SSL VPN ») | Passe facilement les pare-feu (port 443) ; proposé par la plupart des passerelles commerciales |
| **WireGuard** | Moderne, code très réduit, cryptographie fixe et récente, configuration simple ; intégré au noyau Linux |

```ini
# /etc/wireguard/wg0.conf - côté serveur (laboratoire)
[Interface]
Address = 10.8.0.1/24
ListenPort = 51820
PrivateKey = <clé privée du serveur, générée par « wg genkey »>

[Peer]
# Poste de l'administrateur : une seule adresse autorisée dans le tunnel
PublicKey = <clé publique du poste>
AllowedIPs = 10.8.0.2/32
```

> [!WARNING]
> Les passerelles VPN exposées sur Internet sont parmi les **cibles favorites** des attaquants : leurs vulnérabilités critiques sont exploitées en masse quelques jours, voire quelques heures, après leur publication. Il faut les **mettre à jour en priorité absolue**, exiger une **authentification forte** (MFA résistante à l'hameçonnage ou certificat machine) et superviser leurs journaux.

## Du VPN au ZTNA

Un VPN classique donne souvent accès à **tout le réseau interne** une fois connecté. Le **ZTNA** (*Zero Trust Network Access*, module 4) applique le Zero Trust aux accès distants : l'utilisateur n'accède qu'aux **applications** autorisées, après vérification de son identité **et** de l'état de son poste, à chaque connexion.

```diagram
type: compare
title: VPN classique et ZTNA
columns:
  - title: VPN classique
    tone: amber
    items:
      - Connexion au réseau entier
      - Confiance accordée une fois connecté
      - Passerelle exposée sur Internet
  - title: ZTNA
    tone: teal
    items:
      - Accès application par application
      - Identité et état du poste vérifiés à chaque accès
      - Les applications ne sont pas directement exposées
```

# Le réseau local et ses attaques

Sur un réseau local, les protocoles de base ont été conçus **sans authentification**. Un attaquant branché sur le réseau (prise réseau d'une salle de réunion, poste compromis) peut en abuser :

| Attaque | Principe | Protection |
|---|---|---|
| **Usurpation ARP** (*ARP spoofing*) | Répondre « l'adresse IP de la passerelle, c'est moi » pour intercepter le trafic (homme du milieu) | Inspection ARP dynamique (DAI) sur les commutateurs, chiffrement de bout en bout (TLS) |
| **Faux serveur DHCP** | Distribuer une fausse passerelle ou un faux DNS | *DHCP snooping* : seuls les ports autorisés peuvent répondre aux requêtes DHCP |
| **Saut de VLAN** | Envoyer des trames étiquetées pour atteindre un autre VLAN | Désactiver la négociation automatique des liens *trunk*, ne pas utiliser le VLAN natif pour les données |
| **Empoisonnement LLMNR / NBT-NS** | Répondre aux résolutions de noms Windows pour capturer des empreintes de mots de passe | Désactiver LLMNR et NBT-NS par stratégie de groupe |
| **Branchement d'un équipement inconnu** | Accès direct au réseau interne | Contrôle d'accès au réseau (**NAC**, 802.1X filaire), ports inutilisés désactivés |

> [!TIP]
> Ces attaques rappellent pourquoi il ne faut **jamais** faire confiance au réseau interne : le chiffrement systématique (TLS, SSH) et l'authentification des machines rendent une interception locale beaucoup moins utile.

# Le Wi-Fi d'entreprise

```diagram
type: compare
title: Deux modes d'authentification Wi-Fi
columns:
  - title: Personnel (PSK / SAE)
    tone: amber
    items:
      - Une clé partagée par tous
      - Un départ oblige à changer la clé partout
      - Adapté au domicile ou à un Wi-Fi invités
  - title: Entreprise (802.1X / EAP)
    tone: teal
    items:
      - Chaque utilisateur ou machine s'authentifie (certificat ou identifiants)
      - Serveur d'authentification RADIUS relié à l'annuaire
      - Révocation individuelle, attribution du VLAN selon le profil
```

Bonnes pratiques :

- **WPA3** (ou au minimum WPA2 avec AES) ; jamais WEP ni WPA (TKIP), cassés ;
- en mode Entreprise, **vérifier le certificat du serveur** RADIUS sur les postes : sinon un faux point d'accès (*evil twin*) portant le même nom peut récupérer les identifiants ;
- de préférence **EAP-TLS** (certificats machine) plutôt que des mots de passe ;
- un **Wi-Fi invités isolé**, avec accès Internet uniquement, et un réseau séparé pour les objets connectés ;
- la détection des **points d'accès illégitimes** (*rogue AP*) branchés par des salariés ou des attaquants.

> [!NOTE]
> Sur un Wi-Fi public, le trafic chiffré par TLS reste protégé ; le risque principal est le faux point d'accès et les sites encore en HTTP. Le VPN d'entreprise ou le ZTNA protègent les nomades.

# La sécurité de la messagerie

Le protocole SMTP ne vérifie pas l'expéditeur : n'importe qui peut envoyer un courriel qui **prétend** venir de `direction@exemple.fr`. Trois mécanismes, publiés dans le DNS, permettent aux destinataires de vérifier qu'un message vient bien de votre domaine :

```diagram
type: flow
title: Comment un serveur destinataire vérifie un message
steps:
  - title: SPF
    text: L'adresse IP d'envoi fait-elle partie des serveurs autorisés par le domaine ?
    tone: blue
  - title: DKIM
    text: La signature cryptographique du message est-elle valide avec la clé publique du domaine ?
    tone: blue
  - title: DMARC
    text: SPF ou DKIM est-il valide ET aligné sur le domaine affiché dans « De » ? Sinon, appliquer la politique
    tone: violet
  - title: Rapports
    text: Le domaine reçoit des rapports sur les messages envoyés en son nom
    tone: teal
```

```text
; Enregistrements DNS du domaine exemple.fr
exemple.fr.                     TXT  "v=spf1 include:_spf.fournisseur-mail.example -all"
selecteur1._domainkey.exemple.fr. TXT "v=DKIM1; k=rsa; p=MIIBIjANBgkqh..."
_dmarc.exemple.fr.              TXT  "v=DMARC1; p=reject; rua=mailto:dmarc@exemple.fr"
```

- **SPF** liste les serveurs autorisés à envoyer pour le domaine (`-all` : rejeter les autres).
- **DKIM** signe chaque message ; la clé publique est publiée sous un **sélecteur**.
- **DMARC** exige l'**alignement** avec l'adresse visible par l'utilisateur et fixe la **politique** : `none` (observer), `quarantine` (courrier indésirable), `reject` (refuser).

> [!TIP]
> Déploiement progressif : publier DMARC en `p=none` avec des rapports, identifier tous les services légitimes qui envoient au nom du domaine (outil marketing, logiciel de facturation…), les configurer en SPF et DKIM, puis passer à `quarantine` puis `reject`. Les grands fournisseurs de messagerie exigent désormais SPF, DKIM et DMARC pour les expéditeurs en volume. Publiez aussi un SPF `v=spf1 -all` et un DMARC `p=reject` pour les **domaines qui n'envoient jamais** de courriel.

Ces mécanismes protègent **votre domaine** contre l'usurpation ; ils n'empêchent pas un domaine **ressemblant** (`exemp1e.fr`). La passerelle de messagerie (filtrage antispam et antimalware, analyse des liens et pièces jointes, bannière « expéditeur externe ») et la sensibilisation (module 9) restent indispensables. **MTA-STS** impose en plus le chiffrement TLS entre serveurs de messagerie.

# Le DNS, outil de défense

- **DNS protecteur** (*protective DNS*) : les postes utilisent un résolveur qui refuse de résoudre les domaines malveillants connus (hameçonnage, serveurs de commande). Simple et très efficace.
- **Journaliser les requêtes DNS** : elles révèlent un poste qui contacte un domaine malveillant, un tunnel DNS (exfiltration dans des sous-domaines très longs) ou un domaine généré aléatoirement par un logiciel malveillant.
- **DoH / DoT** (DNS chiffré) protègent la vie privée, mais un navigateur qui contourne le résolveur de l'entreprise contourne aussi son filtrage : on configure les postes pour utiliser le résolveur interne.
- **DNSSEC** signe les zones pour garantir l'authenticité des réponses.

# Détecter sur le réseau

## IDS et IPS

Un **IDS** (*Intrusion Detection System*) analyse le trafic et **alerte** ; un **IPS** (*Intrusion Prevention System*), placé en coupure, peut aussi **bloquer**. **Suricata** et **Snort** sont des moteurs open source répandus, qui utilisent des règles par signature :

```text
# Règle Suricata (illustration) : alerte sur une requête HTTP vers un chemin d'exploitation connu
alert http any any -> $HOME_NET any (msg:"Tentative d'accès à un fichier sensible"; \
  http.uri; content:"/.env"; nocase; classtype:attempted-recon; sid:1000001; rev:1;)
```

> [!NOTE]
> Avec la généralisation du chiffrement, un IDS réseau voit de moins en moins le **contenu** des échanges. Il reste utile sur les **métadonnées** (adresses, volumes, empreintes TLS, noms de domaine demandés) et sur les protocoles internes encore en clair ; l'EDR sur les postes (module 7) voit, lui, ce qui se passe avant le chiffrement.

## Les flux et l'analyse réseau

- Les **journaux de flux** (NetFlow, IPFIX, *flow logs* du cloud) enregistrent qui a parlé à qui, quand et quel volume : précieux pour repérer une exfiltration (volume sortant inhabituel) ou un mouvement latéral.
- **Zeek** transforme le trafic en journaux structurés (connexions, DNS, HTTP, certificats TLS) faciles à envoyer au SIEM.
- La **NDR** (*Network Detection and Response*) applique de l'analyse comportementale à ces données.

# Exercices

## Exercice 1 : Usurpation de la direction

Des fournisseurs ont reçu de faux courriels « de » `comptabilite@pme-exemple.fr` demandant un changement de RIB. Le domaine n'a ni SPF, ni DKIM, ni DMARC. Que faire ?

<details>
<summary>Voir la solution</summary>

1. Publier un **SPF** listant les services d'envoi légitimes (messagerie, outils de facturation) avec `-all`.
2. Activer la **signature DKIM** chez le fournisseur de messagerie et publier la clé.
3. Publier **DMARC** en `p=none` avec des rapports, vérifier pendant quelques semaines que tous les envois légitimes sont alignés, puis passer à `quarantine` et `reject`.
4. Prévenir les fournisseurs et rappeler la **procédure** : tout changement de RIB se confirme par un appel à un numéro connu (module 9).

DMARC empêche l'usurpation **exacte** du domaine, pas un domaine ressemblant : la procédure de vérification reste indispensable.

</details>

## Exercice 2 : Le Wi-Fi de l'entreprise

Une entreprise de 80 personnes utilise un seul Wi-Fi WPA2 dont le mot de passe, inchangé depuis 4 ans, est affiché en salle de réunion. Visiteurs, salariés et imprimantes l'utilisent. Proposez une cible.

<details>
<summary>Voir la solution</summary>

- **Wi-Fi salariés** en WPA3-Entreprise (ou WPA2-Entreprise) avec **802.1X**, idéalement EAP-TLS avec certificats machine, authentification reliée à l'annuaire, vérification du certificat serveur sur les postes.
- **Wi-Fi invités** séparé, isolé du réseau interne, accès Internet uniquement, clé changée régulièrement ou portail d'accès.
- **Réseau des objets** (imprimantes, écrans) dans un VLAN dédié, accessible seulement pour les flux nécessaires.
- Détection des points d'accès illégitimes et départ d'un salarié géré par la désactivation de son compte ou de son certificat.

</details>

## Exercice 3 : Requêtes DNS suspectes

Dans les journaux DNS, un poste envoie chaque minute des requêtes vers des sous-domaines de 60 caractères aléatoires d'un même domaine inconnu, enregistré il y a 3 jours. Qu'en pensez-vous et que faire ?

<details>
<summary>Voir la solution</summary>

C'est très probablement un **tunnel DNS** ou un canal de **commande et contrôle** : des données sont encodées dans les sous-domaines, et la régularité évoque un logiciel malveillant qui se signale (*beaconing*). Un domaine très récent renforce le soupçon. Actions : traiter comme un **incident** (module 7), isoler le poste via l'EDR, bloquer le domaine dans le DNS protecteur, rechercher d'autres postes qui le contactent, analyser le poste.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Sécurité réseau avancée
center: Chiffrer et authentifier chaque accès, et utiliser le réseau comme source de détection.
points:
  - icon: lock
    title: Accès distants
    text: VPN à jour avec MFA forte, ou ZTNA application par application.
  - icon: network
    title: Réseau local
    text: ARP, DHCP, LLMNR sans authentification ; DAI, DHCP snooping, 802.1X, chiffrement.
  - icon: zap
    title: Wi-Fi
    text: WPA3, 802.1X avec certificat serveur vérifié, invités et objets isolés.
  - icon: chat
    title: Messagerie
    text: SPF, DKIM, DMARC jusqu'à p=reject ; procédures contre les faux RIB.
  - icon: eye
    title: Détection
    text: DNS protecteur et journalisé, IDS, flux et Zeek vers le SIEM.
pitfall: Une passerelle VPN exposée sur Internet et mise à jour « quand on aura le temps ».
remember: Le réseau interne n'est pas une zone de confiance ; il est une source de traces.
```
