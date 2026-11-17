---
title: TLS, certificats et PKI
description: Comment TLS protège les communications, l'établissement d'une session TLS 1.3, les certificats X.509 et les autorités de certification, l'automatisation avec ACME, HSTS et la configuration d'un serveur.
duration: 55
objectives:
  - Expliquer ce que garantit TLS et comment une session s'établit
  - Lire un certificat et vérifier une chaîne de confiance
  - Automatiser les certificats et configurer correctement un serveur HTTPS
  - Diagnostiquer les erreurs et attaques liées à TLS
---

# Ce que garantit TLS

**TLS** (*Transport Layer Security*), successeur de SSL, protège les communications entre deux programmes. C'est le « S » de HTTPS, mais il sécurise aussi la messagerie (SMTP, IMAP), les bases de données, les API internes, les VPN…

TLS apporte trois garanties :

1. **Confidentialité** : le contenu est chiffré.
2. **Intégrité** : toute modification en transit est détectée.
3. **Authentification du serveur** (et, en option, du client) : vous parlez bien à `banque.fr`, et non à un intermédiaire qui se fait passer pour elle.

> [!IMPORTANT]
> Le cadenas du navigateur signifie que la connexion est chiffrée et que le certificat correspond au nom affiché. Il ne dit **rien** sur l'honnêteté du site : les sites d'hameçonnage utilisent eux aussi HTTPS, avec des certificats parfaitement valides pour leur propre nom de domaine.

# L'établissement d'une session TLS 1.3

**TLS 1.3** (RFC 8446, 2018) est la version recommandée ; **TLS 1.2** reste acceptable avec une configuration correcte. TLS 1.0, 1.1 et toutes les versions de SSL sont obsolètes et doivent être désactivées.

```diagram
type: sequence
title: Poignée de main TLS 1.3 (simplifiée)
actors: [Navigateur, Serveur]
messages:
  - from: 0
    to: 1
    text: "ClientHello : versions et algorithmes supportés, part de clé éphémère"
  - from: 1
    to: 0
    text: "ServerHello : algorithmes choisis, part de clé éphémère"
  - from: 1
    to: 0
    text: Certificat et preuve de possession de la clé privée (chiffrés)
  - from: 1
    to: 0
    text: Finished
  - from: 0
    to: 1
    text: Vérification du certificat, puis Finished
  - from: 0
    to: 1
    text: Données applicatives chiffrées (requête HTTP…)
```

Les deux parties échangent des **parts de clé éphémères** (Diffie-Hellman sur courbe elliptique, de plus en plus en mode hybride post-quantique) et en dérivent les clés de session symétriques (AES-GCM ou ChaCha20-Poly1305). Comme ces clés éphémères sont jetées après la session, une compromission **ultérieure** de la clé privée du serveur ne permet pas de déchiffrer les échanges passés : c'est la **confidentialité persistante** (*forward secrecy*), obligatoire en TLS 1.3.

```video
url: https://www.youtube.com/watch?v=7W7WPMX7arI
title: "Comprendre le chiffrement SSL / TLS avec des emojis (et le HTTPS)"
channel: "Cookie connecté"
duration: "9:34"
lang: fr
why: "Le chiffrement TLS et HTTPS expliqué avec des emojis : l'échange de clés et le rôle des certificats deviennent très clairs."
```

# Les certificats et la confiance

## Le certificat X.509

Un **certificat** lie une **clé publique** à une **identité** (un nom de domaine, une organisation), et cette association est **signée** par une **autorité de certification** (AC, ou CA en anglais). Il contient notamment :

- le **sujet** et surtout les **noms alternatifs** (*Subject Alternative Name*) : les noms de domaine couverts ;
- la **clé publique** ;
- l'**émetteur** (l'AC qui a signé) ;
- les **dates de validité** ;
- les **usages** autorisés de la clé.

```bash
# Voir le certificat présenté par un serveur
openssl s_client -connect www.exemple.fr:443 -servername www.exemple.fr </dev/null 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates -ext subjectAltName
```

## La chaîne de confiance

```diagram
type: layers
title: Une chaîne de certification
layers:
  - title: AC racine
    text: Auto-signée, présente dans le magasin de confiance du navigateur ou du système
  - title: AC intermédiaire
    text: Signée par la racine ; signe les certificats des sites (la racine reste hors ligne)
  - title: Certificat du serveur
    text: "www.exemple.fr : signé par l'intermédiaire, présenté avec elle lors de la poignée de main"
```

Pour accepter un certificat, le client vérifie que : la chaîne remonte jusqu'à une **racine de confiance** ; chaque signature est valide ; les **dates** sont valides ; le **nom** demandé figure dans les noms alternatifs ; le certificat n'est pas **révoqué**. L'ensemble des AC, des règles et des processus qui rendent ce système possible est une **infrastructure à clés publiques** (PKI).

> [!NOTE]
> La **transparence des certificats** (*Certificate Transparency*) oblige les AC publiques à inscrire chaque certificat émis dans des journaux publics. Vous pouvez y surveiller les certificats émis pour vos domaines (par exemple via crt.sh) et détecter un certificat frauduleux ou oublié.

# Mettre en place HTTPS correctement

## Automatiser les certificats

Le protocole **ACME** permet d'obtenir et de renouveler automatiquement des certificats, notamment auprès de **Let's Encrypt** (gratuit). Des clients comme **Certbot** ou les serveurs **Caddy** et **Traefik** le font nativement.

```bash
sudo certbot --nginx -d www.exemple.fr -d exemple.fr   # obtenir et installer le certificat
sudo certbot renew --dry-run                           # tester le renouvellement automatique
```

> [!TIP]
> Les durées de validité des certificats publics **diminuent** : les règles adoptées en 2025 par le CA/Browser Forum les réduisent progressivement jusqu'à 47 jours en 2029. Un renouvellement manuel n'est plus tenable : automatisez, et supervisez les dates d'expiration. Un certificat expiré est l'une des causes de panne les plus courantes.

## Configurer le serveur

```nginx
server {
    listen 443 ssl;
    http2 on;
    server_name www.exemple.fr;

    ssl_certificate     /etc/letsencrypt/live/www.exemple.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.exemple.fr/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    # Imposer HTTPS au navigateur pendant 2 ans, y compris pour les sous-domaines
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
}

server {
    listen 80;
    server_name www.exemple.fr exemple.fr;
    return 301 https://$host$request_uri;     # rediriger tout le HTTP vers HTTPS
}
```

- **HSTS** (`Strict-Transport-Security`) indique au navigateur de ne plus jamais contacter le site en HTTP : cela neutralise les attaques qui interceptent la première requête en clair pour empêcher le passage en HTTPS. Activez-le une fois **tout** le site (et les sous-domaines, si `includeSubDomains`) servi en HTTPS.
- Les choix de suites et de versions évoluent : le **générateur de configuration de Mozilla** et les guides de l'ANSSI fournissent des configurations à jour.
- Vérifiez votre configuration avec **testssl.sh** ou le test en ligne de **SSL Labs**.

## Au-delà du web

- **TLS mutuel** (mTLS) : le client présente aussi un certificat. Utilisé entre services internes ou pour des API sensibles.
- Les communications **internes** (application vers base de données, entre microservices) doivent aussi être chiffrées : le réseau interne n'est pas un réseau de confiance.

# Exercices

## Exercice 1 : Lire une erreur

Le navigateur affiche `NET::ERR_CERT_COMMON_NAME_INVALID` en ouvrant `https://exemple.fr`, alors que `https://www.exemple.fr` fonctionne. Quelle est la cause et la correction ?

<details>
<summary>Voir la solution</summary>

Le certificat ne couvre que `www.exemple.fr` dans ses **noms alternatifs**, pas `exemple.fr`. Correction : émettre un certificat couvrant les deux noms (par exemple `certbot -d www.exemple.fr -d exemple.fr`), ou rediriger `exemple.fr` vers `www` depuis un serveur disposant d'un certificat valide pour `exemple.fr`.

</details>

## Exercice 2 : Le cadenas rassurant

Un collègue affirme : « Ce site a le cadenas, donc on peut y saisir nos identifiants. » Que lui répondez-vous ?

<details>
<summary>Voir la solution</summary>

Le cadenas garantit seulement que la connexion est **chiffrée** et que le certificat correspond au **nom de domaine affiché**. Un site d'hameçonnage comme `banque-fr-securite.com` peut avoir un certificat parfaitement valide pour **son** nom. Il faut vérifier le **nom de domaine exact** dans la barre d'adresse, et privilégier une authentification résistante à l'hameçonnage (passkeys, clés de sécurité), qui refuse de fonctionner sur un faux domaine.

</details>

## Exercice 3 : Auditer une configuration

Un audit révèle qu'un serveur accepte TLS 1.0 et 1.1, ne redirige pas HTTP vers HTTPS et n'envoie pas d'en-tête HSTS. Son certificat expire dans 6 jours et est renouvelé à la main. Priorisez les corrections.

<details>
<summary>Voir la solution</summary>

1. **Urgent** : renouveler le certificat et **automatiser** le renouvellement (ACME), avec supervision de l'expiration : sinon panne dans 6 jours.
2. **Redirection** HTTP → HTTPS.
3. **Désactiver** TLS 1.0 et 1.1 (garder 1.2 et 1.3), en vérifiant l'absence de clients légitimes très anciens.
4. **HSTS**, une fois tout le site servi en HTTPS ; d'abord avec une durée courte, puis longue.
5. Revérifier avec testssl.sh ou SSL Labs.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: TLS, certificats et PKI
center: Chiffrer et authentifier chaque communication, avec des certificats automatisés et une configuration à jour.
points:
  - icon: lock
    title: TLS
    text: Confidentialité, intégrité, authentification ; TLS 1.3 de préférence, 1.2 acceptable.
  - icon: key
    title: Clés éphémères
    text: Confidentialité persistante ; une clé volée plus tard ne déchiffre pas le passé.
  - icon: link
    title: Chaîne de confiance
    text: Racine, intermédiaire, certificat ; nom, dates, signatures et révocation vérifiés.
  - icon: loop
    title: Automatiser
    text: ACME et Let's Encrypt ; durées de validité en baisse, expiration supervisée.
  - icon: shield
    title: Configurer
    text: Redirection HTTPS, HSTS, anciennes versions désactivées, vérification testssl.sh.
pitfall: Prendre le cadenas pour une preuve d'honnêteté du site, ou renouveler les certificats à la main.
remember: Le réseau interne n'est pas de confiance ; chiffrez aussi les communications entre vos propres services.
```
