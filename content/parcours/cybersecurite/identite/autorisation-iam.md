---
title: Autorisation, IAM, OAuth et Zero Trust
description: Modèles d'autorisation (RBAC, ABAC), cycle de vie des identités et accès privilégiés, authentification unique (SAML, OpenID Connect), délégation avec OAuth 2.0 et architecture Zero Trust.
duration: 60
objectives:
  - Choisir un modèle d'autorisation et l'appliquer côté serveur
  - Gérer le cycle de vie des identités et des accès privilégiés
  - Distinguer SSO, OpenID Connect et OAuth 2.0, et choisir le bon flux
  - Expliquer les principes d'une architecture Zero Trust
---

# Les modèles d'autorisation

Une fois l'utilisateur authentifié, il faut décider de ce qu'il a le droit de faire. Plusieurs modèles existent :

| Modèle | Principe | Exemple |
|---|---|---|
| **RBAC** (rôles) | Les droits sont attribués à des **rôles**, les rôles aux utilisateurs | Rôle « comptable » : lire et valider les factures |
| **ABAC** (attributs) | La décision dépend d'**attributs** de l'utilisateur, de la ressource et du contexte | Un médecin lit les dossiers des patients de **son** service, depuis un poste de l'hôpital |
| **ReBAC** (relations) | La décision dépend des **relations** entre l'utilisateur et la ressource | Je peux modifier un document si je suis membre du dossier qui le contient |

En pratique, on combine souvent : des **rôles** pour les grandes familles de droits, et des **vérifications de propriété** ou d'attributs pour chaque ressource.

## Vérifier côté serveur, à chaque requête

> [!IMPORTANT]
> Masquer un bouton dans l'interface n'est **pas** un contrôle d'accès : un attaquant appelle l'API directement. **Chaque** requête qui accède à une ressource doit être vérifiée **côté serveur** : l'utilisateur est-il authentifié, a-t-il le **rôle** requis, et cette ressource précise **lui** est-elle accessible ?

```python
def lire_facture(utilisateur: Utilisateur, facture_id: int) -> Facture:
    facture = factures.trouver(facture_id)
    autorise = facture is not None and (
        facture.client_id == utilisateur.client_id      # propriétaire de la ressource
        or utilisateur.a_le_role("comptable")           # ou rôle habilité
    )
    if not autorise:
        raise RessourceIntrouvable()   # même réponse que si elle n'existait pas : ne rien révéler
    return facture
```

Centralisez cette logique (une couche d'autorisation, des décorateurs, ou un moteur de politiques comme Open Policy Agent ou Cedar) plutôt que de la disperser : un seul oubli suffit à créer une faille.

# La gestion des identités et des accès (IAM)

## Le cycle de vie

Les droits doivent suivre la vie des personnes dans l'organisation : arrivée, changement de poste, départ (*joiner, mover, leaver*).

```diagram
type: flow
title: Le cycle de vie d'une identité
steps:
  - title: Arrivée
    text: Compte créé avec les droits du poste, rien de plus
    tone: blue
  - title: Changement de poste
    text: Nouveaux droits accordés ET anciens droits retirés
    tone: amber
  - title: Revue périodique
    text: Le responsable confirme les droits de son équipe
    tone: teal
  - title: Départ
    text: Désactivation immédiate de tous les accès, révocation des sessions et jetons
    tone: rose
```

Le danger classique : l'**accumulation de droits** au fil des changements de poste, et les comptes de personnes parties restés actifs. Une source de vérité unique (souvent le système RH) qui pilote automatiquement la création et la suppression des comptes réduit fortement ces risques.

## Les accès à privilèges

Les comptes à privilèges élevés (administrateurs système, cloud, bases de données) méritent des mesures renforcées, regroupées sous le nom de **gestion des accès à privilèges** (PAM) :

- comptes d'administration **séparés** des comptes du quotidien ;
- **MFA résistante à l'hameçonnage** obligatoire ;
- **élévation juste-à-temps** : les droits élevés sont accordés pour une durée limitée, sur demande justifiée, plutôt qu'en permanence ;
- **coffre** pour les mots de passe des comptes techniques, avec rotation ;
- **enregistrement** des sessions d'administration sensibles.

# L'authentification unique et la fédération

L'**authentification unique** (SSO, *Single Sign-On*) permet de se connecter **une fois** auprès d'un **fournisseur d'identité** (IdP : Microsoft Entra ID, Okta, Google Workspace, Keycloak…) pour accéder à de nombreuses applications. Avantages de sécurité : un seul endroit pour imposer la MFA, superviser les connexions et **couper tous les accès** d'un coup au départ d'un salarié.

Deux protocoles dominent :

- **SAML 2.0** : standard XML, très répandu dans les applications d'entreprise ;
- **OpenID Connect** (OIDC) : couche d'**identité** construite sur OAuth 2.0, au format JSON, standard des applications web et mobiles modernes. L'IdP émet un **jeton d'identité** (*ID token*, un JWT) qui dit qui est l'utilisateur.

# OAuth 2.0 : la délégation

**OAuth 2.0** (RFC 6749) n'est pas un protocole d'authentification mais de **délégation d'autorisation** : il permet à une application d'accéder à une ressource **au nom d'un utilisateur**, sans connaître son mot de passe, avec des droits limités (**scopes**). Exemple : autoriser une application de facturation à lire (seulement lire) votre agenda.

```diagram
type: sequence
title: Le flux « code d'autorisation » avec PKCE
actors: [Utilisateur, Application, Serveur d'autorisation, API]
messages:
  - from: 1
    to: 0
    text: Redirection vers le serveur d'autorisation (scopes demandés + défi PKCE)
  - from: 0
    to: 2
    text: Connexion (avec MFA) et consentement aux scopes
  - from: 2
    to: 1
    text: Retour vers l'application avec un code d'autorisation à usage unique
  - from: 1
    to: 2
    text: Échange du code contre un jeton d'accès (+ vérificateur PKCE)
  - from: 1
    to: 3
    text: Appel de l'API avec le jeton d'accès
```

Les bonnes pratiques actuelles (formalisées notamment par la RFC 9700, *OAuth 2.0 Security Best Current Practice*, publiée en 2025) :

- utiliser le flux **code d'autorisation avec PKCE** pour les applications avec un utilisateur, y compris les applications web et mobiles ;
- ne plus utiliser les flux **implicite** et **mot de passe** (*resource owner password credentials*), dépréciés ;
- utiliser le flux **client credentials** pour les communications de machine à machine, sans utilisateur ;
- vérifier **exactement** les URL de redirection enregistrées ;
- demander les **scopes minimaux** et des jetons d'accès de **courte durée**.

> [!WARNING]
> Ne confondez pas jeton d'**accès** OAuth (« ce porteur peut appeler cette API avec ces droits ») et jeton d'**identité** OIDC (« cet utilisateur est Alice »). Utiliser un jeton d'accès comme preuve d'identité dans votre application est une erreur de conception classique.

```video
url: https://www.youtube.com/watch?v=ZV5yTm4pT8g
title: "OAuth 2 Explained In Simple Terms"
channel: "ByteByteGo"
duration: "4:32"
lang: en
why: "ByteByteGo explique OAuth 2 en termes simples : qui délègue quoi, à qui, et avec quel jeton."
```

# Zero Trust

L'approche traditionnelle « château fort » faisait confiance à tout ce qui se trouvait **à l'intérieur** du réseau. Avec le télétravail, le cloud et les attaquants qui s'installent dans les réseaux internes, ce modèle ne tient plus. Le **Zero Trust** (« ne jamais faire confiance, toujours vérifier »), décrit notamment par le NIST (SP 800-207), repose sur :

- **aucune confiance implicite** liée à l'emplacement réseau ;
- une **vérification explicite** de chaque accès, selon l'identité (avec MFA), l'**état de l'appareil** (à jour, géré, chiffré), le contexte et la sensibilité de la ressource ;
- le **moindre privilège** et des accès accordés **par application**, plutôt qu'un accès à tout le réseau comme avec un VPN classique ;
- l'hypothèse que l'attaquant est **peut-être déjà présent** : segmentation, supervision continue, limitation du rayon d'action.

> [!NOTE]
> Le Zero Trust est une **démarche progressive**, pas un produit qu'on achète : on commence souvent par les identités (SSO et MFA partout), puis l'état des appareils, puis l'accès aux applications par proxy d'identité plutôt que par VPN.

# Exercices

## Exercice 1 : Choisir un modèle

Une application de gestion de projets doit permettre : aux administrateurs de tout gérer ; aux chefs de projet de modifier leurs projets ; aux membres de lire et commenter les projets auxquels ils participent. Quel modèle d'autorisation ?

<details>
<summary>Voir la solution</summary>

Une combinaison : **RBAC** pour le rôle global « administrateur », et un contrôle **par relation** (ReBAC) entre l'utilisateur et chaque projet : « chef de » ou « membre de ». À chaque requête, le serveur vérifie la relation entre l'utilisateur et **ce** projet, pas seulement un rôle global (être chef d'un projet ne donne aucun droit sur les autres).

</details>

## Exercice 2 : Le départ

Une salariée quitte l'entreprise vendredi. Lundi, on constate qu'elle peut toujours accéder à l'outil de CRM et à un bucket de stockage cloud. Quelles sont les causes probables et les corrections ?

<details>
<summary>Voir la solution</summary>

Causes probables : le CRM n'est **pas relié au SSO** (compte local) ; une **clé d'accès** cloud personnelle n'a pas été révoquée ; ou des **sessions et jetons** encore valides. Corrections : relier toutes les applications au **fournisseur d'identité** (désactivation unique) ; processus de départ **automatisé** à partir du système RH ; révocation des sessions, jetons et clés ; inventaire des comptes locaux restants ; revue périodique des accès.

</details>

## Exercice 3 : Quel flux OAuth ?

Quel flux OAuth utiliser pour :

1. Une application web qui affiche les fichiers Google Drive de l'utilisateur connecté.
2. Un service de facturation qui appelle chaque nuit l'API d'un autre service interne, sans utilisateur.
3. Une application mobile qui accède au calendrier de l'utilisateur.

<details>
<summary>Voir la solution</summary>

1. **Code d'autorisation avec PKCE** (application web avec utilisateur).
2. **Client credentials** (machine à machine), avec un secret ou un certificat stocké dans un coffre, et des scopes minimaux.
3. **Code d'autorisation avec PKCE** (application mobile, qui ne peut pas garder de secret client), via le navigateur du système.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Autorisation, IAM et Zero Trust
center: Vérifier côté serveur chaque accès à chaque ressource, avec des identités gérées de l'arrivée au départ.
points:
  - icon: lock
    title: Modèles d'autorisation
    text: Rôles, attributs, relations ; vérification côté serveur à chaque requête.
  - icon: users
    title: Cycle de vie
    text: Arrivée, changement de poste, revue, départ ; pas d'accumulation de droits.
  - icon: key
    title: Accès à privilèges
    text: Comptes séparés, MFA forte, élévation juste-à-temps, sessions enregistrées.
  - icon: link
    title: SSO, OIDC, OAuth
    text: Un fournisseur d'identité ; OAuth délègue, OIDC identifie ; code d'autorisation avec PKCE.
  - icon: shield
    title: Zero Trust
    text: Aucune confiance liée au réseau ; identité, appareil et contexte vérifiés à chaque accès.
pitfall: Croire qu'un bouton masqué dans l'interface empêche l'accès à la ressource.
remember: Être authentifié ne donne aucun droit sur une ressource ; chaque accès se vérifie.
```
