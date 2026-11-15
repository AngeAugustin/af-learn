---
title: Les fondamentaux de la cryptographie
description: Chiffrement symétrique et authentifié, cryptographie asymétrique, fonctions de hachage, codes d'authentification, signatures, aléa, gestion des clés et cryptographie post-quantique.
duration: 60
objectives:
  - Distinguer chiffrement, hachage, MAC et signature, et leurs usages
  - Utiliser un chiffrement authentifié correctement (AES-GCM, ChaCha20-Poly1305)
  - Comprendre l'échange de clés et les signatures asymétriques
  - Éviter les erreurs classiques et anticiper la transition post-quantique
---

# Ce que la cryptographie apporte

La cryptographie fournit des **garanties mathématiques** sur des données, même lorsqu'elles transitent ou sont stockées dans un environnement non maîtrisé :

| Besoin | Outil cryptographique |
|---|---|
| **Confidentialité** : seul le destinataire peut lire | Chiffrement |
| **Intégrité** : toute modification est détectée | Hachage, MAC, chiffrement authentifié |
| **Authenticité** : on sait qui a produit le message | MAC (secret partagé), signature (clé privée) |
| **Non-répudiation** : l'auteur ne peut nier | Signature numérique |

> [!CAUTION]
> Règle d'or : **ne concevez jamais votre propre algorithme ni votre propre protocole cryptographique**, et n'implémentez pas vous-même les algorithmes standard. Utilisez des bibliothèques reconnues et maintenues (libsodium, la bibliothèque `cryptography` en Python, les API natives de votre plateforme), avec leurs réglages recommandés. La plupart des failles cryptographiques viennent d'une **mauvaise utilisation**, pas d'algorithmes cassés.

# Le chiffrement symétrique

En chiffrement **symétrique**, la **même clé** sert à chiffrer et à déchiffrer. C'est rapide, et c'est ce qui chiffre l'essentiel des données (disques, fichiers, trafic réseau une fois la session établie).

- **AES** (*Advanced Encryption Standard*), avec des clés de 128 ou 256 bits, est le standard mondial.
- **ChaCha20** est une alternative très performante sur les processeurs sans accélération matérielle AES (mobiles notamment).

## Le chiffrement authentifié

Chiffrer ne suffit pas : un attaquant peut **modifier** un message chiffré sans le lire, et provoquer des effets prévisibles. On utilise donc un **chiffrement authentifié** (AEAD, *Authenticated Encryption with Associated Data*), qui chiffre **et** protège l'intégrité en une seule opération : **AES-GCM** ou **ChaCha20-Poly1305**.

```python
# pip install cryptography
import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

cle = AESGCM.generate_key(bit_length=256)    # à stocker dans un gestionnaire de secrets
aesgcm = AESGCM(cle)

nonce = os.urandom(12)                       # 96 bits, UNIQUE pour chaque chiffrement avec cette clé
donnees_associees = b"facture:2026-0042"     # authentifiées mais non chiffrées (contexte)
chiffre = aesgcm.encrypt(nonce, b"IBAN FR76 ...", donnees_associees)

# On stocke ou transmet nonce + chiffré ; le nonce n'est pas secret
clair = aesgcm.decrypt(nonce, chiffre, donnees_associees)   # lève une exception si modifié
```

> [!WARNING]
> Avec AES-GCM, **ne réutilisez jamais un nonce** avec la même clé : cela peut révéler des informations sur les messages et permettre de forger des messages valides. Générez-le aléatoirement (12 octets) ou avec un compteur garanti unique. Et n'utilisez **jamais** le mode **ECB**, qui chiffre identiquement les blocs identiques et laisse apparaître la structure des données.

# La cryptographie asymétrique

Le symétrique pose un problème : comment deux parties qui ne se sont jamais rencontrées partagent-elles une clé secrète ? La cryptographie **asymétrique** (ou à **clé publique**) utilise une **paire de clés** : une clé **publique**, diffusable à tous, et une clé **privée**, gardée secrète.

```diagram
type: compare
title: Deux usages de la paire de clés
columns:
  - title: Échange de clés et chiffrement
    tone: blue
    items:
      - Établir une clé secrète commune sur un canal public (Diffie-Hellman, X25519)
      - Ou chiffrer pour le détenteur de la clé privée
      - Base de l'établissement des sessions TLS
  - title: Signature
    tone: teal
    items:
      - Signer avec la clé privée
      - Vérifier avec la clé publique
      - Mises à jour logicielles, certificats, documents
```

Algorithmes courants : **RSA** (clés d'au moins 2048 bits, 3072 recommandés pour une longue durée de protection), et les algorithmes à **courbes elliptiques**, plus compacts et rapides : **X25519** (échange de clés), **Ed25519** et **ECDSA** (signatures).

Les algorithmes asymétriques sont **lents** : en pratique, on les utilise pour **échanger** ou **protéger** une clé symétrique, qui chiffre ensuite les données. C'est le **chiffrement hybride**, utilisé par TLS (chapitre suivant), PGP ou les messageries chiffrées.

```python
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from cryptography.exceptions import InvalidSignature

cle_privee = Ed25519PrivateKey.generate()
cle_publique = cle_privee.public_key()

document = b"Contrat n°2026-17 : montant 12 000 EUR"
signature = cle_privee.sign(document)

try:
    cle_publique.verify(signature, document)            # OK
    cle_publique.verify(signature, document + b"0")     # document modifié
except InvalidSignature:
    print("Signature invalide : le document a été modifié ou ne vient pas de cette clé")
```

# Hachage, MAC et aléa

## Les fonctions de hachage

Une **fonction de hachage cryptographique** transforme une donnée de taille quelconque en une **empreinte** de taille fixe, avec trois propriétés : impossible de retrouver l'entrée à partir de l'empreinte, impossible de trouver deux entrées de même empreinte (collision), et le moindre changement de l'entrée change complètement l'empreinte.

```bash
sha256sum installeur.iso
# 4f7c...e91a  installeur.iso  → à comparer avec l'empreinte publiée par l'éditeur
```

- Recommandées : **SHA-256**, **SHA-384/512** (famille SHA-2), **SHA-3**, **BLAKE2/BLAKE3**.
- **MD5** et **SHA-1** sont **cassées** pour la résistance aux collisions : à proscrire pour toute nouvelle utilisation de sécurité (signatures, certificats, intégrité face à un attaquant).

> [!IMPORTANT]
> Un hachage simple n'est **pas** adapté pour stocker des mots de passe (trop rapide à calculer pour un attaquant qui teste des milliards de candidats). Il faut des fonctions dédiées, lentes et salées : chapitre 3 de ce module.

## Les codes d'authentification de message (MAC)

Un hachage seul ne prouve rien : un attaquant qui modifie un message peut recalculer l'empreinte. Un **MAC** fait intervenir une **clé secrète** : seul un détenteur de la clé peut produire un MAC valide. **HMAC-SHA256** est le plus utilisé (signature des webhooks, jetons de session, cookies).

```python
import hmac, hashlib

def verifier_webhook(corps: bytes, signature_recue: str, secret: bytes) -> bool:
    attendue = hmac.new(secret, corps, hashlib.sha256).hexdigest()
    return hmac.compare_digest(attendue, signature_recue)   # comparaison en temps constant
```

`compare_digest` compare en **temps constant** : une comparaison classique qui s'arrête au premier caractère différent peut laisser deviner la bonne valeur en mesurant les temps de réponse.

## L'aléa

Clés, nonces, jetons de session et mots de passe temporaires doivent provenir d'un **générateur aléatoire cryptographiquement sûr** : `secrets` ou `os.urandom` en Python, `crypto.getRandomValues` / `crypto.randomUUID` en JavaScript. Le module `random` de Python ou `Math.random()` en JavaScript sont **prévisibles** et ne doivent jamais servir à la sécurité.

```python
import secrets
jeton = secrets.token_urlsafe(32)    # 32 octets aléatoires, encodés pour une URL
```

# Gérer les clés

La sécurité d'un chiffrement repose entièrement sur le **secret de la clé**. Une clé écrite dans le code source ou dans un fichier de configuration versionné annule toute la protection. Bonnes pratiques :

- stocker les clés dans un **gestionnaire de secrets** ou un **KMS** (*Key Management Service*) du fournisseur cloud, ou dans un **HSM** (module matériel) pour les usages les plus sensibles ;
- **séparer** les clés par usage et par environnement ;
- prévoir la **rotation** des clés (et donc pouvoir rechiffrer ou gérer plusieurs versions) ;
- utiliser le **chiffrement d'enveloppe** : une clé de données chiffre les données, elle-même chiffrée par une clé maîtresse qui ne quitte jamais le KMS.

# La menace quantique

Un **ordinateur quantique** suffisamment puissant (qui n'existe pas encore) casserait les algorithmes asymétriques actuels (RSA, courbes elliptiques) grâce à l'algorithme de Shor. Le symétrique et le hachage resteraient sûrs avec des tailles suffisantes (AES-256, SHA-384).

Le risque est déjà actuel pour les données à **longue durée de confidentialité** : un attaquant peut **enregistrer aujourd'hui** des communications chiffrées pour les **déchiffrer plus tard** (*harvest now, decrypt later*). En réponse, le NIST a publié en août 2024 les premiers standards de **cryptographie post-quantique** : **ML-KEM** (FIPS 203, établissement de clés), **ML-DSA** (FIPS 204) et **SLH-DSA** (FIPS 205) pour les signatures. Les navigateurs et de nombreux services déploient déjà des échanges de clés **hybrides** (classique + post-quantique). L'ANSSI recommande cette approche hybride pendant la transition.

# Exercices

## Exercice 1 : Choisir le bon outil

Quel mécanisme cryptographique utiliser dans chaque cas ?

1. Vérifier qu'un fichier téléchargé n'a pas été corrompu, en le comparant à l'empreinte publiée sur le site de l'éditeur (en HTTPS).
2. Vérifier qu'une notification reçue par votre API provient bien de votre prestataire de paiement, avec qui vous partagez un secret.
3. Prouver à n'importe qui qu'une mise à jour logicielle a bien été produite par l'éditeur.
4. Stocker des numéros de contrat de façon confidentielle dans une base.

<details>
<summary>Voir la solution</summary>

1. **Hachage** (SHA-256), l'empreinte de référence étant obtenue par un canal fiable.
2. **MAC** (HMAC-SHA256) avec le secret partagé, comparé en temps constant.
3. **Signature** asymétrique (Ed25519, ECDSA ou RSA) : vérifiable par tous avec la clé publique de l'éditeur.
4. **Chiffrement authentifié** (AES-GCM) avec une clé gérée par un KMS ou un gestionnaire de secrets.

</details>

## Exercice 2 : Revue de code

Relevez les erreurs de ce code.

```python
import random, hashlib
from Crypto.Cipher import AES

CLE = b"maCleSuperSecret"                       # 16 octets
def chiffrer(donnees: bytes) -> bytes:
    return AES.new(CLE, AES.MODE_ECB).encrypt(donnees.ljust(32))

def jeton_reinitialisation() -> str:
    return hashlib.md5(str(random.random()).encode()).hexdigest()
```

<details>
<summary>Voir la solution</summary>

1. **Clé dans le code** (et devinable) : à générer aléatoirement et stocker dans un gestionnaire de secrets.
2. **Mode ECB** : révèle la structure des données ; utiliser AES-GCM.
3. **Aucune intégrité** : pas de chiffrement authentifié.
4. **Bourrage maison** (`ljust`) : tronque ou corrompt les données de plus de 32 octets, et n'est pas réversible proprement.
5. **`random.random()`** n'est pas cryptographiquement sûr : le jeton est prévisible. Utiliser `secrets.token_urlsafe(32)`.
6. **MD5** n'apporte rien ici et est obsolète.

</details>

## Exercice 3 : Données à long terme

Une organisation échange par VPN des plans d'infrastructures sensibles qui doivent rester confidentiels pendant 25 ans. Pourquoi la menace quantique la concerne-t-elle dès aujourd'hui ? Que recommandez-vous ?

<details>
<summary>Voir la solution</summary>

Un attaquant peut **enregistrer** le trafic chiffré aujourd'hui et le déchiffrer dans quelques années si un ordinateur quantique capable de casser l'échange de clés (RSA, courbes elliptiques) devient disponible : la confidentialité sur 25 ans n'est donc pas garantie (*harvest now, decrypt later*). Recommandations : inventorier les usages de cryptographie asymétrique ; privilégier des solutions proposant un échange de clés **hybride** post-quantique (ML-KEM combiné à un algorithme classique) ; utiliser AES-256 pour le symétrique ; suivre les recommandations de l'ANSSI sur la transition.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Les fondamentaux de la cryptographie
center: Choisir le bon outil (chiffrer, hacher, authentifier, signer) et l'utiliser via une bibliothèque reconnue.
points:
  - icon: lock
    title: Chiffrement authentifié
    text: AES-GCM ou ChaCha20-Poly1305 ; jamais de nonce réutilisé, jamais d'ECB.
  - icon: key
    title: Asymétrique
    text: Clé publique et clé privée ; échange de clés X25519, signatures Ed25519 ; hybride avec le symétrique.
  - icon: check
    title: Hachage et MAC
    text: SHA-256 pour l'intégrité, HMAC pour l'authenticité ; MD5 et SHA-1 proscrits.
  - icon: sparkles
    title: Aléa et clés
    text: secrets et os.urandom ; clés dans un KMS, séparées, renouvelées.
  - icon: cpu
    title: Post-quantique
    text: ML-KEM, ML-DSA, SLH-DSA (NIST, 2024) ; transition hybride dès maintenant.
pitfall: Écrire sa propre cryptographie, ou mettre la clé de chiffrement dans le code source.
remember: Les algorithmes sont rarement cassés ; c'est leur mauvaise utilisation qui l'est.
```
