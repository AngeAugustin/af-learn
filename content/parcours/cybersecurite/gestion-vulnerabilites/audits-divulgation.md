---
title: Audits de sécurité et divulgation coordonnée
description: Commander et exploiter un audit de sécurité, comprendre les types d'évaluation et le cadre légal, mettre en place une politique de divulgation coordonnée et un programme de bug bounty.
duration: 50
objectives:
  - Choisir le type d'évaluation adapté à un besoin
  - Commander un audit et en exploiter les résultats
  - Mettre en place une politique de divulgation coordonnée (security.txt)
  - Comprendre l'intérêt et les limites d'un programme de bug bounty
---

# Faire évaluer sa sécurité

Les mesures internes (durcissement, gestion des vulnérabilités) ne suffisent pas à savoir si un système **résisterait réellement** à une attaque. Un **regard extérieur et spécialisé** révèle des angles morts. Ce chapitre adopte le point de vue de l'**organisation** qui veut faire évaluer et améliorer sa sécurité, dans un cadre légal et contractuel.

## Les types d'évaluation

| Démarche | Ce qu'elle apporte | Quand y recourir |
|---|---|---|
| **Audit de configuration** | Écart par rapport à un référentiel (guides ANSSI, CIS) | Vérifier le durcissement d'un parc |
| **Audit de code** | Vulnérabilités dans le code source | Avant la mise en production d'une application sensible |
| **Audit d'architecture** | Faiblesses de conception, cloisonnement | Lors de la conception ou d'une refonte |
| **Audit organisationnel** | Politiques, procédures, conformité | Démarche de certification, revue globale |
| **Test d'intrusion** | Ce qu'un attaquant pourrait concrètement atteindre | Valider la robustesse d'un périmètre défini |
| **Exercice red team** | Teste aussi la détection et la réponse | Organisations matures, de façon discrète |

Le choix dépend de la **question** posée. « Mon application est-elle bien codée ? » appelle un audit de code ; « ma configuration serveur est-elle conforme ? » un audit de configuration ; « mon équipe détecterait-elle une intrusion ? » un exercice red team.

> [!NOTE]
> En France, l'ANSSI qualifie des prestataires d'audit (**PASSI**) selon un référentiel exigeant. Recourir à un prestataire qualifié est parfois obligatoire pour les administrations et les opérateurs les plus sensibles, et constitue dans tous les cas un gage de sérieux.

# Commander et exploiter un audit

## Le cadre contractuel

> [!CAUTION]
> Toute évaluation technique active doit faire l'objet d'une **autorisation écrite** signée par une personne ayant autorité sur les systèmes, et d'une **convention** encadrant la mission. Sans ce cadre, les actes seraient des infractions pénales (module 1). L'autorisation doit couvrir aussi les systèmes hébergés par des **tiers** (hébergeur, cloud, éditeur SaaS), dont les conditions propres s'appliquent.

La convention (lettre de mission) précise : le **périmètre** exact et ce qui en est exclu, la **période** autorisée, les techniques permises ou interdites, la conduite à tenir en cas de découverte critique, les **contacts** d'urgence, et la **confidentialité** des résultats et des données.

Selon le niveau d'information donné au prestataire, l'évaluation est dite **boîte noire** (aucune information), **boîte grise** (comptes et documentation partielle, le plus courant) ou **boîte blanche** (accès au code et aux configurations, le plus efficace pour trouver un maximum de failles dans un temps donné).

## Exploiter le rapport

Un audit n'a de valeur que par ce qu'on en **fait**. Un bon rapport fournit, pour chaque constat :

- une **description** claire et la **preuve** de son existence ;
- une **évaluation du risque** (gravité, probabilité, contexte) ;
- des **recommandations** concrètes de correction ;
- une **priorisation**.

```diagram
type: flow
title: Du rapport d'audit à la sécurité améliorée
steps:
  - title: Restitution
    text: Présentation des constats et des priorités
    tone: blue
  - title: Plan d'action
    text: Correctifs assignés, responsables, échéances
    tone: amber
  - title: Correction
    text: Traitement selon la priorité
    tone: teal
  - title: Contre-vérification
    text: L'auditeur confirme que les failles sont corrigées
    tone: teal
  - title: Suivi
    text: Intégration au registre des risques et aux prochaines revues
    tone: violet
```

Le piège classique : recevoir un rapport, le classer, et ne corriger que les failles les plus visibles. Un audit dont les constats ne sont pas **suivis d'effet** est une dépense inutile. La **contre-vérification** (l'auditeur revient confirmer les corrections) et l'intégration au **registre des risques** garantissent que le travail aboutit.

# La divulgation coordonnée de vulnérabilités

Même avec des audits réguliers, des personnes extérieures (chercheurs, utilisateurs attentifs) découvrent parfois des vulnérabilités dans vos services. La question est : **peuvent-elles vous le signaler facilement et en confiance ?** Sans canal clair, une personne de bonne foi hésite (crainte de poursuites) et la faille reste ouverte, ou finit par être divulguée publiquement sans que vous ayez pu corriger.

La **divulgation coordonnée de vulnérabilités** (CVD, *Coordinated Vulnerability Disclosure*) organise ce dialogue :

```diagram
type: flow
title: Le processus de divulgation coordonnée
steps:
  - title: Signalement
    text: Le chercheur contacte l'organisation par un canal dédié
    tone: blue
  - title: Accusé de réception
    text: L'organisation confirme et évalue
    tone: amber
  - title: Correction
    text: Développement et déploiement du correctif
    tone: teal
  - title: Publication coordonnée
    text: Divulgation après correction, créditant le chercheur
    tone: violet
```

## Mettre en place un canal de signalement

- Publier une **politique de divulgation** : qui contacter, le périmètre couvert, les engagements (délai de réponse, non-poursuite des personnes agissant de bonne foi dans le périmètre).
- Exposer un fichier **`security.txt`** (standard RFC 9116) à `https://exemple.fr/.well-known/security.txt` :

```text
Contact: mailto:security@exemple.fr
Expires: 2027-01-01T00:00:00.000Z
Preferred-Languages: fr, en
Policy: https://exemple.fr/securite/divulgation
```

- **Traiter** les signalements sérieusement et rapidement, et **remercier** (reconnaissance, mention) les personnes qui aident.

> [!NOTE]
> En France, l'article L. 2321-4 du Code de la défense permet, sous conditions, de signaler de bonne foi une vulnérabilité à l'**ANSSI**, qui peut servir d'intermédiaire avec l'organisation concernée sans que le découvreur soit inquiété. C'est une voie utile quand aucun canal direct n'existe.

# Les programmes de bug bounty

Un **programme de bug bounty** va plus loin : l'organisation **invite** une communauté de chercheurs à tester ses systèmes **en continu**, et les **récompense** (souvent financièrement) pour chaque vulnérabilité valide, selon sa gravité. Des plateformes (YesWeHack : française, HackerOne, Intigriti…) mettent en relation organisations et chercheurs et encadrent le processus.

```diagram
type: compare
title: Audit ponctuel et bug bounty
columns:
  - title: Audit / test d'intrusion
    tone: blue
    items:
      - Période définie, périmètre précis
      - Prestataire identifié, rapport complet
      - Vision à un instant donné
  - title: Bug bounty
    tone: teal
    items:
      - En continu, de nombreux chercheurs
      - Paiement au résultat
      - Couvre les évolutions du produit
```

Ce qu'il faut pour réussir un bug bounty :

- un **périmètre clair** (ce qui est dans le scope, ce qui est exclu) et des **règles** explicites ;
- une **grille de récompenses** cohérente avec la gravité ;
- une **équipe capable de traiter** le flux de signalements et de **corriger** vite : un programme qui ne corrige pas décourage les chercheurs et n'améliore rien ;
- une certaine **maturité** préalable : lancer un bug bounty sur un produit truffé de failles connues coûte cher et sature l'équipe. On commence souvent en **privé** (quelques chercheurs invités) avant d'ouvrir au public.

> [!IMPORTANT]
> Un bug bounty **complète** les audits et la gestion des vulnérabilités, il ne les remplace pas. Il ne couvre pas l'organisationnel, dépend de l'intérêt des chercheurs, et suppose déjà un bon niveau de sécurité. C'est un outil de **vérification continue**, à sa juste place dans une démarche globale.

# Exercices

## Exercice 1 : Choisir l'évaluation

Quelle démarche recommander dans chaque cas ?

1. Une entreprise va mettre en ligne une nouvelle application bancaire et veut s'assurer qu'elle est robuste avant le lancement.
2. Une organisation veut savoir si son équipe de sécurité détecterait une intrusion réelle.
3. Une collectivité veut vérifier que ses serveurs sont configurés conformément aux recommandations de l'ANSSI.

<details>
<summary>Voir la solution</summary>

1. **Audit de code** (boîte blanche) complété par un **test d'intrusion** applicatif avant la mise en production ; idéalement un prestataire qualifié vu la sensibilité.
2. **Exercice red team** : seul à tester réellement la détection et la réponse.
3. **Audit de configuration** par rapport au référentiel ANSSI/CIS.

</details>

## Exercice 2 : Le rapport classé

Une entreprise a payé un audit il y a un an. Le rapport listait 20 constats ; seuls les 3 « critiques » ont été corrigés, le reste a été oublié. Quels problèmes, et que proposez-vous ?

<details>
<summary>Voir la solution</summary>

Problèmes : les 17 constats restants (dont des « élevés ») demeurent exploitables ; aucune **contre-vérification** n'a confirmé la correction des 3 critiques ; l'investissement est largement perdu. Propositions : établir un **plan d'action** complet avec responsables et échéances pour les constats restants, selon leur priorité et le contexte ; **contre-vérifier** les corrections ; intégrer les constats au **registre des risques** et aux revues régulières ; pour l'avenir, prévoir dès la commande une restitution, un suivi et une contre-vérification.

</details>

## Exercice 3 : Prêt pour un bug bounty ?

Une start-up sans aucune pratique de sécurité, dont la dernière application n'a jamais été testée, veut « lancer un bug bounty public pour être sûre ». Que conseillez-vous ?

<details>
<summary>Voir la solution</summary>

Déconseiller le **public** tout de suite : l'application contient probablement de nombreuses failles faciles, qui satureraient l'équipe de signalements et coûteraient cher en récompenses, sans que la start-up ait la capacité de corriger. Démarche recommandée : d'abord le **socle** (gestion des vulnérabilités, correction des failles connues, un audit ou un test d'intrusion), mettre en place un **canal de signalement** (`security.txt`) et la capacité à **corriger vite**, puis éventuellement un bug bounty **privé** (quelques chercheurs invités) avant d'envisager l'ouverture au public.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Audits et divulgation coordonnée
center: Faire évaluer sa sécurité dans un cadre légal, exploiter les résultats et ouvrir un canal de signalement.
points:
  - icon: search
    title: Types d'évaluation
    text: Configuration, code, architecture, organisationnel, test d'intrusion, red team.
  - icon: scale
    title: Cadre
    text: Autorisation écrite, convention, périmètre, tiers inclus ; PASSI en France.
  - icon: check
    title: Exploiter le rapport
    text: Plan d'action, correction priorisée, contre-vérification, suivi des risques.
  - icon: link
    title: Divulgation coordonnée
    text: security.txt, politique claire, non-poursuite de bonne foi ; l'ANSSI peut relayer.
  - icon: users
    title: Bug bounty
    text: Vérification continue par une communauté, au résultat ; complète, ne remplace pas.
pitfall: Classer un rapport d'audit sans plan d'action, ou ouvrir un bug bounty public sans pouvoir corriger.
remember: Une évaluation ne vaut que par les corrections qu'elle déclenche et que l'on vérifie.
```
