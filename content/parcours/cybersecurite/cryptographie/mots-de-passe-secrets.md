---
title: Mots de passe et gestion des secrets
description: Stocker correctement des mots de passe (Argon2id, bcrypt), définir une politique de mots de passe moderne, et gérer clés d'API, jetons et identifiants techniques.
duration: 50
objectives:
  - Stocker des mots de passe avec une fonction de hachage adaptée et salée
  - Définir une politique de mots de passe conforme aux recommandations actuelles
  - Gérer les secrets applicatifs dans un coffre-fort, avec rotation
  - Réagir à la fuite d'un secret
---

# Stocker des mots de passe

Une application qui authentifie ses utilisateurs doit stocker de quoi **vérifier** leurs mots de passe, sans jamais pouvoir les **retrouver**. Les bases de données finissent parfois par fuiter : le stockage doit rester sûr **même si l'attaquant obtient toute la base**.

```diagram
type: compare
title: Du pire au correct
columns:
  - title: À proscrire
    tone: rose
    items:
      - En clair
      - Chiffré de façon réversible
      - Haché avec MD5, SHA-1 ou SHA-256 seul
      - Haché sans sel
  - title: Recommandé
    tone: teal
    items:
      - Fonction dédiée, lente et coûteuse en mémoire (Argon2id)
      - Sel aléatoire unique par mot de passe (inclus automatiquement)
      - Paramètres ajustés au matériel actuel
      - Éventuellement un « poivre » secret stocké hors de la base
```

## Pourquoi un hachage rapide ne suffit pas

Avec SHA-256, une carte graphique teste des **milliards** de candidats par seconde : les mots de passe courants d'une base volée sont retrouvés en quelques minutes. Les fonctions dédiées au stockage des mots de passe sont **volontairement lentes** et, pour les plus modernes, **gourmandes en mémoire**, ce qui rend les attaques massivement parallèles beaucoup plus coûteuses.

Le **sel** (*salt*) est une valeur aléatoire propre à chaque mot de passe, stockée avec l'empreinte. Il garantit que deux utilisateurs ayant le même mot de passe ont des empreintes différentes, et rend inutiles les tables précalculées.

## Les fonctions recommandées

Selon les recommandations de l'OWASP (*Password Storage Cheat Sheet*) :

| Fonction | Paramètres minimaux indicatifs | Remarque |
|---|---|---|
| **Argon2id** | 19 Mio de mémoire, 2 itérations, parallélisme 1 | Premier choix |
| **scrypt** | Coût 2¹⁷, taille de bloc 8, parallélisme 1 | Si Argon2id n'est pas disponible |
| **bcrypt** | Facteur de coût d'au moins 10 | Systèmes existants ; ne prend en compte que les 72 premiers octets |
| **PBKDF2-HMAC-SHA256** | 600 000 itérations | Quand une conformité FIPS l'impose |

```python
# pip install argon2-cffi
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

ph = PasswordHasher()                      # Argon2id, paramètres par défaut raisonnables

empreinte = ph.hash("correct cheval agrafe batterie")   # sel aléatoire inclus dans le résultat
# $argon2id$v=19$m=65536,t=3,p=4$...$...   ← algorithme, paramètres, sel et empreinte

def verifier(empreinte_stockee: str, saisi: str) -> bool:
    try:
        ph.verify(empreinte_stockee, saisi)
    except VerifyMismatchError:
        return False
    if ph.check_needs_rehash(empreinte_stockee):
        ...  # paramètres devenus trop faibles : recalculer et enregistrer la nouvelle empreinte
    return True
```

> [!TIP]
> Dans la plupart des cas, n'écrivez pas cela vous-même : utilisez le système d'authentification de votre cadriciel (Django, Laravel, Spring Security, ASP.NET Identity…) ou un fournisseur d'identité, qui appliquent ces règles et les font évoluer.

# Une politique de mots de passe moderne

Les recommandations ont beaucoup évolué. Les référentiels actuels (NIST SP 800-63B, ANSSI, CNIL) convergent vers :

- **La longueur avant la complexité** : une **phrase de passe** longue est plus robuste et plus facile à retenir qu'un mot court plein de symboles. Fixez une longueur minimale élevée, surtout quand le mot de passe est le seul facteur.
- **Accepter tous les caractères**, y compris les espaces, et des longueurs importantes (au moins 64 caractères).
- **Refuser les mots de passe connus** : listes de mots de passe courants et de mots de passe ayant fuité.
- **Ne pas imposer de changement périodique** sans raison : les changements forcés poussent à des variations prévisibles (`Printemps2026!` → `Ete2026!`). On impose un changement en cas de **soupçon de compromission**.
- **Limiter les tentatives** (temporisation croissante, verrouillage temporaire) pour freiner la force brute en ligne.
- **Encourager les gestionnaires de mots de passe**, qui permettent un mot de passe unique et aléatoire par service.
- Surtout : ajouter un **second facteur**, ou remplacer le mot de passe par une **clé d'accès** (*passkey*), résistante à l'hameçonnage (module 4).

> [!NOTE]
> Le service *Have I Been Pwned* permet de vérifier si un mot de passe figure dans des fuites connues **sans l'envoyer** : on transmet seulement les 5 premiers caractères de son empreinte SHA-1, et la comparaison se fait localement (principe du k-anonymat).

# Gérer les secrets applicatifs

Une application manipule de nombreux **secrets techniques** : mots de passe de bases de données, clés d'API, clés de chiffrement, jetons d'accès, certificats. Leur fuite est l'une des causes d'incident les plus fréquentes.

## Où ne pas les mettre

- dans le **code source** ou un fichier de configuration **versionné** (ils restent dans l'historique Git) ;
- dans une **image Docker** ;
- dans des **journaux** (attention aux traces d'erreur qui affichent la configuration) ;
- dans un **ticket**, un **chat** ou un **courriel**.

## Où les mettre

```diagram
type: flow
title: Cycle de vie d'un secret bien géré
steps:
  - title: Création
    text: Générée aléatoirement, jamais choisie à la main
    tone: blue
  - title: Stockage
    text: Coffre-fort de secrets, chiffré, accès journalisé
    tone: teal
  - title: Distribution
    text: Injectée à l'exécution, à la seule application qui en a besoin
    tone: teal
  - title: Rotation
    text: Renouvelée régulièrement et immédiatement en cas de doute
    tone: amber
  - title: Révocation
    text: Supprimée quand elle n'est plus utilisée
    tone: rose
```

- Un **coffre-fort de secrets** : HashiCorp Vault, OpenBao, AWS Secrets Manager, Google Secret Manager, Azure Key Vault, ou les secrets chiffrés de l'orchestrateur (Kubernetes avec chiffrement au repos et accès restreints).
- Des **identifiants à courte durée de vie** plutôt que des clés permanentes : rôles cloud attribués aux machines et aux applications, **fédération d'identité** (OIDC) pour que la CI obtienne des jetons temporaires au lieu de stocker des clés d'accès.
- Le **moindre privilège** : chaque secret donne accès au strict nécessaire (une clé d'API en lecture seule si l'application ne fait que lire).

## Détecter et réagir

- **Prévenir** : détection de secrets avant le commit (hooks avec `gitleaks` ou `detect-secrets`) et analyse des dépôts (la plupart des forges proposent un *secret scanning*).
- **Réagir à une fuite** : **révoquer** et **remplacer** immédiatement le secret (le supprimer du dépôt ne suffit pas), puis analyser les journaux d'utilisation pour savoir s'il a été exploité.

> [!CAUTION]
> Des robots parcourent en permanence les dépôts publics à la recherche de clés : une clé cloud publiée par erreur peut être exploitée en **quelques minutes**, par exemple pour lancer des serveurs de minage de cryptomonnaie à vos frais.

# Exercices

## Exercice 1 : Auditer un stockage

Une application stocke `sha256(mot_de_passe)` en hexadécimal dans la table `utilisateurs`. Quels sont les problèmes ? Comment migrer sans demander à tous les utilisateurs de changer de mot de passe ?

<details>
<summary>Voir la solution</summary>

Problèmes : hachage **rapide** (milliards d'essais par seconde) et **sans sel** (même mot de passe → même empreinte, tables précalculées utilisables).

Migration :
1. **Immédiatement**, envelopper les empreintes existantes : stocker `argon2id(sha256_existant)` pour tous les comptes, et marquer ces comptes comme « enveloppés ». La base ne contient plus aucune empreinte faible.
2. À la **prochaine connexion** réussie de chaque utilisateur (vérification par `argon2id(sha256(saisi))`), recalculer une empreinte `argon2id(saisi)` directe et retirer le marqueur.
3. Supprimer toute copie (sauvegardes, exports) contenant les anciennes empreintes, selon la politique de conservation.

</details>

## Exercice 2 : Politique de mots de passe

La politique actuelle impose 8 caractères minimum avec majuscule, chiffre et symbole, un changement tous les 60 jours, et interdit les espaces. Proposez une politique conforme aux recommandations actuelles.

<details>
<summary>Voir la solution</summary>

- Longueur minimale plus élevée (par exemple 12 caractères avec un second facteur, davantage sans), longueur maximale d'au moins 64 caractères, **tous les caractères** autorisés, y compris les espaces.
- Pas de règles de composition imposées, mais **refus des mots de passe courants ou ayant fuité**.
- **Pas de changement périodique** forcé ; changement en cas de suspicion de compromission.
- Limitation des tentatives.
- **Authentification multifacteur** obligatoire, et passkeys proposées.
- Recommandation d'un gestionnaire de mots de passe.

</details>

## Exercice 3 : Clé publiée

Un développeur a poussé par erreur une clé d'accès cloud ayant des droits d'administrateur sur un dépôt **public** il y a 3 heures. Que faites-vous, dans l'ordre ?

<details>
<summary>Voir la solution</summary>

1. **Révoquer** immédiatement la clé (la désactiver puis la supprimer dans la console IAM).
2. **Analyser** les journaux d'activité cloud depuis la publication : création de ressources, de comptes ou de clés, accès aux données, modifications de droits. Supprimer tout ce qui a été créé par l'attaquant.
3. Traiter comme un **incident** (module 7) si une utilisation malveillante est constatée, y compris les obligations de notification s'il y a eu accès à des données personnelles.
4. Retirer la clé de l'historique du dépôt (en sachant qu'elle a pu être copiée).
5. **Prévenir la récidive** : détection de secrets avant commit et dans la CI, suppression des clés permanentes au profit d'identifiants temporaires, droits minimaux.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Mots de passe et secrets
center: Des mots de passe impossibles à retrouver même en cas de fuite, et des secrets qui ne quittent jamais le coffre.
points:
  - icon: lock
    title: Stockage
    text: Argon2id salé (ou scrypt, bcrypt, PBKDF2) ; jamais de SHA-256 seul.
  - icon: ruler
    title: Politique moderne
    text: Longueur, tous caractères, refus des mots de passe fuités, pas de rotation forcée sans raison.
  - icon: shield
    title: Au-delà du mot de passe
    text: MFA, passkeys et gestionnaires de mots de passe.
  - icon: key
    title: Coffre-fort
    text: Secrets générés, stockés, injectés à l'exécution, renouvelés ; identifiants temporaires.
  - icon: alert
    title: En cas de fuite
    text: Révoquer d'abord, analyser ensuite ; supprimer du dépôt ne suffit pas.
pitfall: Supprimer une clé publiée dans un nouveau commit sans la révoquer.
remember: Un secret qui a été exposé, même quelques minutes, doit être considéré comme compromis.
```
