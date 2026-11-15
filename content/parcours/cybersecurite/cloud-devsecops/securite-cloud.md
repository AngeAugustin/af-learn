---
title: La sécurité du cloud
description: Le modèle de responsabilité partagée, la gestion des identités et des accès cloud, les erreurs de configuration fréquentes, le chiffrement, la sécurité des conteneurs et le CSPM.
duration: 55
objectives:
  - Appliquer le modèle de responsabilité partagée
  - Sécuriser les identités et les accès dans le cloud
  - Éviter les erreurs de configuration les plus fréquentes
  - Sécuriser conteneurs et orchestrateurs, et surveiller sa posture (CSPM)
---

# Le modèle de responsabilité partagée

Dans le cloud, la sécurité est **partagée** entre le fournisseur et le client. La répartition dépend du service utilisé.

```diagram
type: compare
title: Qui est responsable de quoi ?
columns:
  - title: Le fournisseur
    tone: blue
    items:
      - Sécurité physique des centres de données
      - Matériel, réseau sous-jacent, hyperviseur
      - Sécurité DU cloud
  - title: Le client
    tone: teal
    items:
      - Configuration des services
      - Identités, accès, données, chiffrement
      - Sécurité DANS le cloud
```

Plus le service est **managé**, plus le fournisseur en prend en charge : pour une machine virtuelle (IaaS), le client gère le système, les correctifs et les applications ; pour une base managée (PaaS), le fournisseur gère le moteur, le client gère les accès et les données ; pour un logiciel en SaaS, le client ne gère guère que ses comptes et ses données.

> [!WARNING]
> L'erreur classique : croire que « le cloud est sécurisé par le fournisseur ». La grande majorité des incidents cloud viennent de la part **client** : mauvaise configuration, accès trop larges, données exposées. Le fournisseur sécurise l'infrastructure ; **vous** êtes responsable de ce que vous en faites.

# Identités et accès dans le cloud

L'**IAM** est le véritable périmètre de sécurité du cloud. Les principes du module 4 s'y appliquent, avec des spécificités :

- **Pas d'identifiants longue durée dans le code** : utiliser des **rôles** attribués aux machines et aux services (une instance obtient automatiquement des identifiants temporaires), et la **fédération d'identité** (OIDC) pour que la CI ou une application externe obtienne des jetons temporaires.
- **Moindre privilège** : accorder des permissions précises, pas des rôles « administrateur » par commodité. Les outils du fournisseur (analyseurs d'accès) aident à réduire les permissions au réellement utilisé.
- **MFA** obligatoire, surtout sur le **compte racine**, qui doit être verrouillé et quasiment jamais utilisé.
- **Séparation** en comptes/projets/abonnements distincts par environnement (dev, recette, prod) et par équipe, pour cloisonner.
- **Journalisation** de toute l'activité d'administration (CloudTrail, journaux d'audit), centralisée et protégée.

# Les erreurs de configuration fréquentes

```diagram
type: flow
title: Les configurations à vérifier en priorité
steps:
  - title: Stockage exposé
    text: Buckets ou conteneurs d'objets ouverts au public
    tone: rose
  - title: Accès trop larges
    text: Rôles administrateurs, ports ouverts à 0.0.0.0/0
    tone: rose
  - title: Chiffrement
    text: Données au repos et en transit, gestion des clés
    tone: amber
  - title: Journalisation
    text: Activée, centralisée, conservée
    tone: teal
  - title: Sauvegardes
    text: Présentes, testées, protégées
    tone: teal
```

- **Stockage d'objets public** : la cause de nombreuses fuites massives. Par défaut, bloquer tout accès public (les fournisseurs proposent un réglage « block public access » au niveau du compte) et n'ouvrir qu'au cas par cas, de façon explicite.
- **Groupes de sécurité trop ouverts** : SSH, RDP ou bases de données accessibles depuis `0.0.0.0/0`. N'exposer que le strict nécessaire.
- **Service de métadonnées** : forcer IMDSv2 (module 5) pour limiter l'impact des SSRF.
- **Secrets** dans des variables d'environnement en clair ou dans le code : utiliser le gestionnaire de secrets et le KMS du fournisseur.
- **Clés d'accès** oubliées, jamais tournées : préférer les rôles ; auditer et supprimer les clés inutilisées.

# Chiffrement et données

- **Au repos** : activer le chiffrement des stockages, bases et sauvegardes (souvent activé par défaut). Pour les données sensibles, utiliser des **clés gérées par le client** (CMK) dans le KMS, avec un contrôle d'accès et une journalisation des usages de la clé.
- **En transit** : TLS partout, y compris entre services internes (module 3).
- **Localisation** : choisir la **région** d'hébergement selon les exigences de souveraineté et le RGPD. Attention aux données qui pourraient transiter ou être répliquées ailleurs.
- **Minimisation et conservation** : ne stocker que le nécessaire, appliquer des règles de cycle de vie (suppression ou archivage automatique).

# Conteneurs et orchestrateurs

Les applications cloud s'exécutent souvent dans des **conteneurs** (Docker, module 2) orchestrés par **Kubernetes**. Points de sécurité spécifiques :

- **Images** : partir d'images **minimales** et de confiance, les **scanner** (Trivy, Grype) pour les vulnérabilités, ne pas y mettre de secrets, et les **signer** pour garantir leur origine.
- **Exécution** : conteneurs **non-root**, systèmes de fichiers en lecture seule quand c'est possible, capacités Linux réduites ; ne pas monter le socket Docker dans un conteneur.
- **Kubernetes** : contrôle d'accès **RBAC** strict, **secrets** gérés (chiffrés au repos, ou via un gestionnaire externe), **politiques réseau** pour cloisonner les pods, politiques d'admission pour refuser les configurations dangereuses, et mise à jour régulière du cluster.
- **Chaîne d'approvisionnement** : maîtriser d'où viennent les images et leurs dépendances (chapitre suivant).

> [!TIP]
> La sécurité des conteneurs et du cloud se décrit en **code** (Infrastructure as Code, module Production de Data Engineering). On peut donc l'**analyser automatiquement** avant déploiement avec des outils comme Checkov, tfsec ou KICS, qui repèrent les mauvaises configurations (bucket public, chiffrement absent, port ouvert) dans les fichiers Terraform ou les manifestes Kubernetes.

# Surveiller sa posture (CSPM)

Un environnement cloud change en permanence et se configure à de multiples endroits : il est impossible de tout vérifier à la main. Les outils de **CSPM** (*Cloud Security Posture Management*) analysent en continu la configuration du cloud et signalent les écarts par rapport aux bonnes pratiques et aux référentiels (CIS Benchmarks, recommandations du fournisseur) : stockage exposé, chiffrement manquant, accès trop larges, journalisation désactivée.

Les fournisseurs proposent leurs propres services (AWS Security Hub, Microsoft Defender for Cloud, Google Security Command Center), complétés par des outils tiers et open source (Prowler, ScoutSuite, Steampipe). Le **CNAPP** regroupe plusieurs de ces capacités (posture, conteneurs, vulnérabilités, droits) dans une plateforme intégrée.

# Exercices

## Exercice 1 : Responsabilité partagée

Pour chaque incident, dites s'il relève de la responsabilité du fournisseur ou du client :

1. Un bucket de stockage contenant des factures est accessible publiquement.
2. Une panne électrique d'un centre de données du fournisseur.
3. Une base de données managée est accessible sans mot de passe fort car le client l'a configurée ainsi.

<details>
<summary>Voir la solution</summary>

1. **Client** : la configuration des accès au stockage lui incombe.
2. **Fournisseur** : sécurité physique et disponibilité de l'infrastructure (le client gère la résilience via plusieurs zones).
3. **Client** : même sur un service managé, l'accès et l'authentification relèvent du client.

La plupart des incidents cloud relèvent de la part client.

</details>

## Exercice 2 : Durcir un compte cloud

Vous héritez d'un compte cloud où tout le monde utilise le compte racine avec une clé d'accès partagée, sans MFA, et les journaux d'activité sont désactivés. Proposez les premières actions.

<details>
<summary>Voir la solution</summary>

1. **Activer la journalisation** d'activité et la centraliser (indispensable pour tout le reste).
2. **Verrouiller le compte racine** : MFA, suppression de ses clés d'accès, usage réservé aux rares opérations qui l'exigent.
3. Créer des **comptes nominatifs** avec MFA et des **rôles** au moindre privilège ; supprimer la clé partagée.
4. Remplacer les clés d'accès par des **rôles** pour les machines et la fédération pour la CI.
5. Vérifier le **stockage public**, les **accès réseau** trop larges et le **chiffrement**, puis mettre en place un **CSPM** pour surveiller en continu.

</details>

## Exercice 3 : Image de conteneur

Une équipe déploie une image basée sur une image complète d'OS, construite avec un `Dockerfile` qui copie un fichier `.env` et s'exécute en root. Quels risques et corrections ?

<details>
<summary>Voir la solution</summary>

Risques : **surface d'attaque** large (image complète avec de nombreux paquets vulnérables), **secrets dans l'image** (le `.env` reste dans les couches, lisible), **exécution en root** (une compromission du conteneur donne des droits élevés). Corrections : image **minimale** (slim, distroless) ; **ne pas copier** de secrets, les injecter à l'exécution depuis un gestionnaire ; `.dockerignore` ; utilisateur **non-root** ; **scan** de l'image dans la CI ; système de fichiers en lecture seule si possible.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: La sécurité du cloud
center: Le fournisseur sécurise l'infrastructure ; vous êtes responsable des accès, des configurations et des données.
points:
  - icon: scale
    title: Responsabilité partagée
    text: Sécurité DU cloud côté fournisseur, DANS le cloud côté client ; variable selon le service.
  - icon: key
    title: Identités
    text: Rôles et jetons temporaires, moindre privilège, MFA, compte racine verrouillé, journaux.
  - icon: alert
    title: Erreurs fréquentes
    text: Stockage public, accès trop larges, chiffrement absent, secrets en clair, clés oubliées.
  - icon: layers
    title: Conteneurs
    text: Images minimales scannées et signées, non-root, RBAC et politiques réseau Kubernetes.
  - icon: eye
    title: CSPM
    text: Analyser la configuration en continu ; analyser aussi l'IaC avant déploiement.
pitfall: Croire que « le cloud est sécurisé » et laisser un bucket ou une base ouverts au public.
remember: La plupart des fuites cloud viennent d'une configuration du client, pas d'une faille du fournisseur.
```
