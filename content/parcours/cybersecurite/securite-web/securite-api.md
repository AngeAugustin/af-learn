---
title: La sécurité des API
description: L'OWASP API Security Top 10, authentification et autorisation des API, validation par schéma, exposition de données, limitation de débit, inventaire, webhooks et GraphQL.
duration: 55
objectives:
  - Connaître les risques spécifiques aux API (OWASP API Security Top 10)
  - Valider strictement les entrées et filtrer les sorties avec des schémas
  - Limiter la consommation de ressources et protéger les flux métier sensibles
  - Tenir un inventaire des API et sécuriser webhooks et GraphQL
---

# Pourquoi les API sont exposées

Les applications modernes (web, mobiles, objets connectés, partenaires) reposent sur des **API** qui exposent directement la logique et les données. Contrairement à une page web, une API est conçue pour être appelée par des **programmes** : un attaquant peut l'appeler avec n'importe quels paramètres, à n'importe quel rythme, sans passer par l'interface.

L'OWASP publie un classement spécifique, l'**API Security Top 10** (édition 2023) :

| Rang | Risque | En bref |
|---|---|---|
| API1 | Autorisation défaillante au niveau objet (BOLA) | Accéder à l'objet d'un autre en changeant l'identifiant |
| API2 | Authentification défaillante | Jetons faibles, mal vérifiés, force brute possible |
| API3 | Autorisation défaillante au niveau des propriétés | Lire ou modifier des champs non autorisés (exposition excessive, affectation de masse) |
| API4 | Consommation de ressources non restreinte | Pas de limite de débit, de taille, de pagination |
| API5 | Autorisation défaillante au niveau fonction | Appeler une fonction d'administration sans en avoir le droit |
| API6 | Accès non restreint aux flux métier sensibles | Automatiser un flux métier (achat, réservation) au détriment de l'entreprise |
| API7 | SSRF | Faire appeler des ressources internes par le serveur |
| API8 | Mauvaise configuration de sécurité | CORS, erreurs verbeuses, TLS, en-têtes |
| API9 | Gestion d'inventaire inappropriée | Anciennes versions et API oubliées toujours en ligne |
| API10 | Consommation non sûre d'API tierces | Faire aveuglément confiance aux données des API partenaires |

Les trois premières places et la cinquième sont des problèmes d'**autorisation** : la plupart des failles d'API viennent d'une vérification de droits manquante, traitée au chapitre précédent.

# Authentifier les appels

| Mécanisme | Usage | Points d'attention |
|---|---|---|
| **Jetons OAuth 2.0 / OIDC** | Utilisateurs et services, avec droits limités (scopes) | Vérifier signature, expiration, émetteur, audience et scopes |
| **Clés d'API** | Identifier un client (partenaire, application) | Ce n'est pas une authentification d'utilisateur ; à transmettre dans un en-tête, jamais dans l'URL ; rotation possible |
| **TLS mutuel** | Services internes, partenaires sensibles | Gestion des certificats |
| **Cookies de session** | API utilisées par le front-end du même site | Protection CSRF nécessaire |

# Valider les entrées, filtrer les sorties

## Des schémas stricts

Décrivez exactement ce que chaque point d'entrée accepte et renvoie, et laissez le framework **rejeter** le reste. Exemple avec FastAPI et Pydantic :

```python
from fastapi import Depends, FastAPI
from pydantic import BaseModel, ConfigDict, Field

app = FastAPI()


class CommandeEntree(BaseModel):
    model_config = ConfigDict(extra="forbid")       # tout champ inconnu est refusé (affectation de masse)
    produit_id: int = Field(gt=0)
    quantite: int = Field(gt=0, le=100)             # bornes métier


class CommandeSortie(BaseModel):
    id: int
    produit_id: int
    quantite: int
    statut: str                                     # pas de marge, pas de données internes


@app.post("/commandes", response_model=CommandeSortie, status_code=201)
def creer_commande(entree: CommandeEntree, client=Depends(client_authentifie)):
    commande = service_commandes.creer(client_id=client.id, **entree.model_dump())
    return commande          # filtré par response_model : seuls les champs déclarés sortent
```

- `extra="forbid"` bloque les champs non prévus (`prix`, `statut`, `client_id`…).
- Le `client_id` vient de l'**authentification**, jamais du corps de la requête.
- `response_model` évite l'**exposition excessive** : renvoyer l'objet complet de la base (avec champs internes, données d'autres entités) en comptant sur le front-end pour « n'afficher que ce qu'il faut » est une faille, puisque l'attaquant lit la réponse brute.

## Une spécification comme contrat

Une spécification **OpenAPI** décrit tous les points d'entrée, paramètres, schémas et exigences d'authentification. Elle sert de référence pour la documentation, pour générer des tests et pour configurer une **passerelle d'API** qui rejette les requêtes non conformes.

# Limiter la consommation

Sans limites, un seul client (malveillant ou simplement mal programmé) peut épuiser les ressources de l'API ou engendrer des coûts importants (envoi de SMS, appels à un modèle d'IA, services payants).

- **Limitation de débit** (*rate limiting*) par client, par utilisateur et par adresse : au-delà, répondre `429 Too Many Requests` avec un en-tête `Retry-After`.
- **Tailles maximales** : corps de requête, fichiers téléversés, nombre d'éléments dans une liste.
- **Pagination obligatoire** avec une taille de page maximale (`?limit=1000000` doit être refusé ou plafonné).
- **Délais** d'exécution et **quotas** sur les opérations coûteuses.

## Protéger les flux métier

Certaines attaques n'exploitent aucune faille technique : elles **automatisent** un usage légitime à grande échelle. Achat de tout un stock d'articles limités pour les revendre, réservation de tous les créneaux, création massive de comptes pour profiter d'une offre de bienvenue. Parades : limites par compte et par moyen de paiement, détection des automates, vérification d'appareil, règles métier (un article par client).

```video
url: https://www.youtube.com/watch?v=6WZ6S-qmtqY
title: "Top 12 Tips For API Security"
channel: "ByteByteGo"
duration: "9:47"
lang: en
why: "Douze conseils de sécurité des API par ByteByteGo : authentification, validation, limitation de débit et journalisation."
```

# Inventaire, tiers, webhooks et GraphQL

## L'inventaire

On ne protège pas une API qu'on a oubliée. Les **API fantômes** (non documentées) et **zombies** (anciennes versions jamais retirées, comme `/api/v1/` toujours en ligne sans les correctifs de `/v2/`) sont des cibles de choix. Tenez un **inventaire** de toutes les API, versions et environnements exposés, avec un responsable et une date de fin de vie pour les anciennes versions.

## Les API tierces et les webhooks

Les données reçues d'un partenaire ne sont pas plus sûres que celles d'un utilisateur : validez-les de la même façon. Pour les **webhooks** (un service tiers appelle votre API pour vous notifier d'un événement) :

- vérifiez la **signature** HMAC du message avec le secret partagé (comparaison en temps constant, module 3) ;
- refusez les messages trop **anciens** (horodatage signé) pour empêcher les rejeux ;
- traitez-les de façon **idempotente** (un même événement peut être livré plusieurs fois) ;
- en cas de doute, **revérifiez** l'information auprès de l'API du partenaire (par exemple le statut d'un paiement) plutôt que de faire confiance au contenu reçu.

## GraphQL

**GraphQL** permet au client de composer ses requêtes. Points spécifiques : limiter la **profondeur** et la **complexité** des requêtes (une requête imbriquée peut faire exploser la charge), contrôler l'autorisation **dans chaque résolveur** (pas seulement à l'entrée), désactiver l'**introspection** en production si le schéma n'a pas vocation à être public, et limiter le regroupement de nombreuses opérations dans une seule requête.

```diagram
type: layers
title: Les couches de protection d'une API
layers:
  - title: Passerelle d'API
    text: TLS, authentification, limitation de débit, tailles maximales, journalisation
  - title: Validation
    text: Schémas stricts (OpenAPI, Pydantic, Zod) ; champs inconnus refusés
  - title: Autorisation
    text: Fonction, objet et propriétés vérifiés à chaque appel
  - title: Logique métier
    text: Règles anti-abus, idempotence, quotas
  - title: Réponse
    text: Seuls les champs autorisés, erreurs génériques
```

# Exercices

## Exercice 1 : Exposition excessive

L'API `GET /api/utilisateurs/moi` renvoie l'objet complet de la base : `id`, `email`, `nom`, `hash_mot_de_passe`, `role`, `notes_internes_support`, `date_derniere_connexion`. L'application mobile n'affiche que le nom et l'e-mail. Quel est le problème et comment le corriger ?

<details>
<summary>Voir la solution</summary>

**Exposition excessive** de données (API3) : l'attaquant lit la réponse brute, pas seulement ce qu'affiche l'application. L'empreinte du mot de passe et les notes internes ne doivent jamais sortir. Correction : un **schéma de réponse** explicite (`id`, `nom`, `email` et uniquement ce qui est nécessaire), appliqué par le framework (`response_model`, sérialiseur dédié), et un test automatisé qui vérifie l'absence des champs sensibles.

</details>

## Exercice 2 : Le stock vidé

Lors du lancement d'une édition limitée de 500 baskets, tout le stock est acheté en 40 secondes par une dizaine de comptes qui revendent ensuite les paires. Aucune faille technique n'a été exploitée. De quel risque s'agit-il et que proposez-vous ?

<details>
<summary>Voir la solution</summary>

**Accès non restreint à un flux métier sensible** (API6). Propositions : limite d'achat par compte, par adresse de livraison et par moyen de paiement ; détection des automates (vitesse, empreinte d'appareil, comportement) ; file d'attente ou tirage au sort pour les lancements ; vérifications renforcées pour les comptes récents ; limitation de débit sur les étapes d'ajout au panier et de paiement.

</details>

## Exercice 3 : Sécuriser un webhook

Votre API reçoit les notifications de paiement d'un prestataire sur `POST /webhooks/paiement`, et marque la commande comme payée dès réception. Que manque-t-il ?

<details>
<summary>Voir la solution</summary>

1. **Vérification de la signature** HMAC fournie par le prestataire (sinon n'importe qui peut marquer une commande comme payée).
2. **Contrôle de fraîcheur** de l'horodatage signé (anti-rejeu).
3. **Idempotence** : un même événement reçu deux fois ne doit pas déclencher deux livraisons.
4. **Vérification** du montant et de la devise par rapport à la commande, éventuellement en interrogeant l'API du prestataire.
5. **Journalisation** des notifications reçues et rejetées.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: La sécurité des API
center: Une API est appelée directement par des programmes ; chaque appel doit être authentifié, validé, autorisé et limité.
points:
  - icon: list
    title: API Security Top 10
    text: BOLA, authentification, propriétés, ressources, fonctions, flux métier, SSRF, config, inventaire, tiers.
  - icon: filter
    title: Schémas stricts
    text: Champs inconnus refusés, identité issue du jeton, réponses filtrées.
  - icon: gauge
    title: Limites
    text: Débit, taille, pagination, délais, quotas ; 429 et Retry-After.
  - icon: book
    title: Inventaire
    text: Toutes les API et versions connues ; anciennes versions retirées.
  - icon: link
    title: Webhooks et tiers
    text: Signature HMAC, fraîcheur, idempotence ; données tierces validées comme les autres.
pitfall: Renvoyer l'objet complet de la base en comptant sur l'application pour n'afficher que l'utile.
remember: La plupart des failles d'API sont des vérifications d'autorisation oubliées.
```
