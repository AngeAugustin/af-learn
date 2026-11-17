---
title: Contrôle d'accès, CSRF, CORS et SSRF
description: Les failles de contrôle d'accès (IDOR, fonctions non protégées, affectation de masse), la falsification de requête intersite, les erreurs de configuration CORS et la falsification de requête côté serveur.
duration: 65
objectives:
  - Détecter et corriger les failles de contrôle d'accès (IDOR, fonctions, champs)
  - Expliquer et prévenir les attaques CSRF
  - Configurer CORS sans ouvrir de faille
  - Prévenir les SSRF, notamment dans le cloud
  - Protéger la logique métier contre les abus et les conditions de concurrence
---

# Le contrôle d'accès défaillant

C'est la catégorie la plus fréquente de l'OWASP Top 10. Elle regroupe toutes les situations où un utilisateur peut **lire, modifier ou faire** quelque chose qui ne lui est pas permis.

## IDOR : la référence directe à un objet

```text
GET /api/factures/10452        → ma facture
GET /api/factures/10453        → la facture d'un autre client !
```

Une **IDOR** (*Insecure Direct Object Reference*, appelée BOLA dans le contexte des API) se produit quand l'application utilise l'identifiant fourni par le client **sans vérifier** que l'objet appartient à l'utilisateur (ou lui est accessible). C'est la faille que nous avons évoquée dans le chapitre sur le cadre légal (le reçu fiscal d'un autre donateur).

```python
# VULNÉRABLE
@app.get("/api/factures/<int:facture_id>")
@connexion_requise
def facture(facture_id):
    return jsonify(Facture.query.get_or_404(facture_id).to_dict())

# CORRIGÉ : la requête filtre sur le propriétaire
@app.get("/api/factures/<int:facture_id>")
@connexion_requise
def facture(facture_id):
    f = Facture.query.filter_by(id=facture_id, client_id=utilisateur_courant().client_id).first_or_404()
    return jsonify(f.to_dict())
```

> [!NOTE]
> Des identifiants aléatoires (UUID) au lieu d'entiers successifs rendent les objets plus difficiles à **deviner**, mais ne remplacent **pas** la vérification : un identifiant peut fuiter (lien partagé, journaux, en-tête Referer). La vérification d'appartenance reste obligatoire.

## Les fonctions non protégées

L'interface masque le bouton « Supprimer l'utilisateur » aux non-administrateurs, mais l'API `DELETE /api/admin/utilisateurs/42` ne vérifie pas le rôle. Toute **fonction** sensible doit vérifier les droits côté serveur, idéalement grâce à une règle **par défaut** : tout est refusé sauf ce qui est explicitement autorisé.

## L'affectation de masse

```python
# VULNÉRABLE : tous les champs envoyés sont copiés dans l'objet
utilisateur.update(**request.json)     # {"nom": "Alice", "role": "admin"} → élévation de privilèges
```

L'**affectation de masse** (*mass assignment*) laisse le client modifier des champs qu'il ne devrait pas contrôler (`role`, `solde`, `est_verifie`, `proprietaire_id`). Correction : n'accepter qu'une **liste blanche** de champs modifiables, idéalement par un schéma de validation (Pydantic, Zod, sérialiseurs du framework).

## Tester le contrôle d'accès

La méthode la plus efficace : créer **deux comptes** de même niveau et un compte de niveau inférieur, puis rejouer chaque requête du premier avec la session des autres. Tout ce qui fonctionne alors qu'il ne devrait pas est une faille. Ces tests s'automatisent très bien dans la suite de tests de l'application.

# CSRF : la falsification de requête intersite

Une attaque **CSRF** (*Cross-Site Request Forgery*) fait exécuter à la victime, **à son insu**, une action sur un site où elle est connectée. Le navigateur joint automatiquement les cookies du site cible aux requêtes, même quand elles sont déclenchées par une page d'un **autre** site.

```diagram
type: sequence
title: Une attaque CSRF
actors: [Victime (connectée à sa banque), Site piégé, Banque]
messages:
  - from: 0
    to: 1
    text: Visite d'une page piégée
  - from: 1
    to: 0
    text: Page contenant un formulaire caché envoyé automatiquement
  - from: 0
    to: 2
    text: POST /virement (le navigateur ajoute le cookie de session)
  - from: 2
    to: 0
    text: Virement exécuté si aucune protection CSRF
```

## Les défenses

1. **Cookies `SameSite`** (`Lax` ou `Strict`) : le cookie de session n'est pas envoyé dans les requêtes intersites de modification. Les navigateurs récents appliquent souvent `Lax` par défaut, mais il faut le définir explicitement.
2. **Jeton anti-CSRF** : un jeton aléatoire lié à la session, inclus dans chaque formulaire et vérifié par le serveur. Le site piégé ne peut pas le connaître. La plupart des frameworks le font nativement (Django, Laravel, Rails, Spring) : ne le désactivez pas.
3. **Vérification de l'en-tête `Origin`** (ou `Sec-Fetch-Site`) pour les requêtes de modification.
4. **Jamais de modification par `GET`** : un simple lien ou une image peut déclencher une requête `GET`.
5. **Réauthentification** pour les actions critiques (virement, changement d'e-mail).

```video
url: https://www.youtube.com/watch?v=vRBihr41JTo
title: "Cross Site Request Forgery - Computerphile"
channel: "Computerphile"
duration: "9:20"
lang: en
why: "La falsification de requête intersite (CSRF) expliquée par Computerphile, avec les défenses qui fonctionnent."
```

# CORS : partager sans tout ouvrir

Par défaut, la **politique de même origine** empêche le JavaScript d'un site de **lire** les réponses d'un autre site. **CORS** (*Cross-Origin Resource Sharing*) permet à un serveur d'**assouplir** cette règle pour des origines choisies, via des en-têtes comme `Access-Control-Allow-Origin`.

> [!WARNING]
> Une configuration qui **renvoie l'origine reçue telle quelle** dans `Access-Control-Allow-Origin` avec `Access-Control-Allow-Credentials: true` autorise **n'importe quel site** à lire les données de l'utilisateur connecté via son navigateur. N'autorisez qu'une **liste explicite** d'origines de confiance, et n'activez les identifiants que si c'est indispensable.

```python
ORIGINES_AUTORISEES = {"https://app.exemple.fr", "https://admin.exemple.fr"}

@app.after_request
def cors(reponse):
    origine = request.headers.get("Origin")
    if origine in ORIGINES_AUTORISEES:
        reponse.headers["Access-Control-Allow-Origin"] = origine
        reponse.headers["Vary"] = "Origin"
    return reponse
```

Rappel : CORS n'est **pas** une protection du serveur. Il ne contrôle que ce que les **navigateurs** permettent aux pages de lire ; un script ou un outil en ligne de commande appelle l'API directement. L'authentification et l'autorisation restent indispensables.

# SSRF : la falsification de requête côté serveur

Une **SSRF** (*Server-Side Request Forgery*) se produit quand une application récupère une URL fournie par l'utilisateur (aperçu de lien, import d'image par URL, webhook) et qu'un attaquant lui fait appeler une ressource **interne**, inaccessible depuis Internet mais accessible depuis le serveur.

Cibles typiques :

- des services internes sans authentification (interfaces d'administration, bases, caches) ;
- le **service de métadonnées** des machines virtuelles cloud (`http://169.254.169.254/`), qui peut fournir des **identifiants temporaires** donnant accès au compte cloud.

## Les défenses

- **Liste blanche** des domaines ou adresses autorisés quand c'est possible (« images uniquement depuis notre CDN »).
- Sinon, **résoudre le nom** et **refuser** les adresses privées, de bouclage, de lien local (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`, `::1`, `fc00::/7`…), **puis se connecter à l'adresse vérifiée** (sinon un nom peut changer d'adresse entre la vérification et la connexion : *DNS rebinding*).
- **Désactiver les redirections** automatiques, ou revérifier chaque destination.
- Limiter les **schémas** (`https` uniquement) et les **ports**.
- Côté infrastructure : filtrer le **trafic sortant** des serveurs, et utiliser les protections du service de métadonnées (sur AWS, **IMDSv2**, qui exige un jeton obtenu par une requête `PUT`, ce qui bloque la plupart des SSRF simples).

```video
url: https://www.youtube.com/watch?v=3dKavgfL2pA
title: "SSRF in 100 seconds"
channel: "Intigriti"
duration: "1:50"
lang: en
why: "La SSRF résumée en cent secondes par Intigriti : un serveur amené à appeler une adresse choisie par l'attaquant."
```

# Logique métier et conditions de concurrence

Certaines failles ne violent aucune règle technique : elles exploitent la **logique métier** de l'application. Aucun scanner ne les trouve, car il faut comprendre ce que l'application est censée faire.

- **Valeurs inattendues** : quantité négative dans un panier (remboursement au lieu d'un paiement), prix ou remise envoyés par le client et acceptés par le serveur.
- **Étapes sautées** : appeler directement l'étape « confirmation » d'un parcours de commande sans passer par le paiement.
- **Abus de fonctionnalités** : réutiliser un code promo à usage unique, créer des milliers de comptes pour cumuler des bonus de parrainage.

## Les conditions de concurrence

Une **condition de concurrence** (*race condition*) apparaît quand deux requêtes simultanées lisent le même état avant que l'une ou l'autre ne le modifie. Exemple : un bon d'achat de 50 € utilisable une seule fois, vérifié puis marqué comme utilisé en deux étapes. Vingt requêtes envoyées en même temps passent toutes la vérification avant le premier marquage : le bon est utilisé vingt fois.

```python
# VULNÉRABLE : vérification puis mise à jour en deux temps (« time of check, time of use »)
bon = db.execute("SELECT utilise FROM bons WHERE code = %s", (code,)).fetchone()
if not bon.utilise:
    appliquer_remise(panier, 50)
    db.execute("UPDATE bons SET utilise = TRUE WHERE code = %s", (code,))

# SÛR : une seule opération atomique, qui ne réussit qu'une fois
ligne = db.execute(
    "UPDATE bons SET utilise = TRUE WHERE code = %s AND utilise = FALSE RETURNING code",
    (code,),
).fetchone()
if ligne:
    appliquer_remise(panier, 50)
```

Défenses : opérations **atomiques** en base (mise à jour conditionnelle, contraintes d'unicité), **verrous** ou transactions avec le bon niveau d'isolation, et **clés d'idempotence** pour les paiements et les actions sensibles.

> [!IMPORTANT]
> Toute règle métier (prix, limites, quotas, usage unique, ordre des étapes) se vérifie **côté serveur**, au moment de l'action, et de façon **atomique** quand plusieurs requêtes peuvent arriver en même temps.

# Exercices

## Exercice 1 : Trouver la faille

Une API de messagerie expose `PATCH /api/messages/{id}` avec un corps `{"contenu": "...", "auteur_id": 12}`. Le serveur vérifie que l'utilisateur est connecté, puis applique tous les champs reçus au message d'identifiant `id`. Quelles failles ? Quelles corrections ?

<details>
<summary>Voir la solution</summary>

1. **IDOR** : aucune vérification que le message appartient à l'utilisateur → filtrer sur l'auteur : `Message.query.filter_by(id=id, auteur_id=courant.id)`.
2. **Affectation de masse** : le client peut changer `auteur_id` (et attribuer le message à quelqu'un d'autre) → n'accepter que `contenu` via un schéma de validation.
3. Ajouter des **tests automatisés** avec deux comptes.

</details>

## Exercice 2 : CSRF ou pas ?

Une application stocke la session dans un cookie sans attribut `SameSite`, accepte `GET /compte/supprimer` pour supprimer le compte, et n'utilise pas de jeton anti-CSRF. Décrivez une attaque et les corrections.

<details>
<summary>Voir la solution</summary>

Attaque : une page quelconque contient `<img src="https://app.exemple.fr/compte/supprimer">`. Tout utilisateur connecté qui la visite voit son compte supprimé : le navigateur envoie la requête avec le cookie.

Corrections : action de modification en **POST** (ou DELETE) uniquement ; **jeton anti-CSRF** vérifié ; cookie `SameSite=Lax` (ou `Strict`) explicite ; **réauthentification** pour une action aussi critique ; vérification de l'en-tête `Origin`.

</details>

## Exercice 3 : L'aperçu de lien

Une messagerie génère un aperçu des liens partagés : le serveur télécharge la page et en extrait le titre et l'image. Sur quelle infrastructure cela devient-il dangereux, et comment le sécuriser ?

<details>
<summary>Voir la solution</summary>

C'est une **SSRF** potentielle : un utilisateur partage `http://169.254.169.254/latest/meta-data/...` ou `http://10.0.0.12:8080/admin`, et le serveur va chercher la ressource interne. Dans le cloud, cela peut exposer des identifiants temporaires du compte.

Sécurisation : service d'aperçu **isolé** (réseau sans accès aux ressources internes, sortie Internet uniquement) ; résolution DNS puis refus des adresses privées, de bouclage et de lien local, connexion à l'adresse vérifiée ; redirections revérifiées ; `https` uniquement et ports standards ; délais et tailles de réponse limités ; IMDSv2 activé et obligatoire sur les machines.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Contrôle d'accès, CSRF, CORS, SSRF
center: Vérifier côté serveur qui accède à quoi, d'où vient la requête, et où le serveur a le droit d'aller.
points:
  - icon: lock
    title: IDOR
    text: Toujours filtrer par propriétaire ou droit ; un UUID ne remplace pas la vérification.
  - icon: filter
    title: Fonctions et champs
    text: Refus par défaut, rôle vérifié par fonction, liste blanche des champs modifiables.
  - icon: link
    title: CSRF
    text: SameSite, jeton anti-CSRF, Origin vérifié, jamais de modification en GET.
  - icon: network
    title: CORS
    text: Liste explicite d'origines ; ne jamais refléter l'origine avec les identifiants.
  - icon: cloud
    title: SSRF
    text: Liste blanche, adresses internes refusées après résolution, IMDSv2, sortie filtrée.
  - icon: clock
    title: Logique et concurrence
    text: Règles métier vérifiées côté serveur, opérations atomiques, clés d'idempotence.
pitfall: Masquer un bouton dans l'interface au lieu de vérifier le droit dans l'API.
remember: Tester avec deux comptes du même niveau révèle la plupart des failles de contrôle d'accès.
```
