---
title: Mobiles, objets connectés et systèmes industriels
description: Sécurité des applications et flottes mobiles (OWASP MASVS, MDM), des objets connectés (identifiants par défaut, mises à jour, exigences européennes) et des systèmes industriels (priorités OT, modèle de Purdue, protocoles sans authentification, IEC 62443).
duration: 60
objectives:
  - Identifier les risques propres aux applications mobiles et à une flotte de smartphones
  - Appliquer les règles de base de sécurité des objets connectés
  - Expliquer pourquoi les systèmes industriels se sécurisent différemment de l'informatique de gestion
  - Proposer une segmentation et des mesures adaptées à un site industriel
---

# Les terminaux mobiles

## Les applications mobiles

Une application mobile tourne sur un appareil que l'utilisateur (ou un attaquant) **contrôle entièrement**. Tout ce qui est embarqué dans l'application peut être extrait et analysé. L'OWASP publie le **MASVS** (exigences de sécurité des applications mobiles) et le **MASTG** (guide de test).

| Risque | Bonne pratique |
|---|---|
| **Secrets dans l'application** (clé d'API, clé de chiffrement) | Aucun secret de valeur dans le code : il sera extrait. Les droits sont vérifiés **côté serveur** |
| **Stockage local non protégé** | Données sensibles dans le stockage sécurisé du système (Keychain sur iOS, Keystore sur Android) ; rien de sensible dans les journaux ou les sauvegardes |
| **Communication non sécurisée** | TLS partout, validation stricte des certificats ; épinglage de certificat pour les applications les plus sensibles |
| **Contrôles uniquement côté client** | Une vérification faite dans l'application (droits, prix, limite) peut être contournée : l'**API** doit tout revérifier (module 5) |
| **Liens profonds et composants exportés** | Valider toutes les données reçues d'autres applications |

> [!IMPORTANT]
> Du point de vue de la sécurité, une application mobile est un **client non fiable** de votre API, exactement comme un navigateur. La sécurité réelle est dans le serveur.

## La flotte de l'entreprise

- **Gestion des terminaux** (MDM, *Mobile Device Management*) : inventaire, chiffrement imposé, code de déverrouillage, mises à jour, effacement à distance en cas de perte.
- Pour les appareils personnels (BYOD), on préfère souvent la **gestion des applications** (MAM) : un conteneur professionnel séparé, effaçable sans toucher aux données personnelles.
- **Mises à jour** : un appareil qui ne reçoit plus de correctifs du constructeur doit être remplacé.
- Applications installées uniquement depuis les **magasins officiels** ; vigilance sur les permissions demandées.
- L'**hameçonnage par SMS** (*smishing*) et par QR code (*quishing*) cible particulièrement les mobiles, où l'adresse réelle d'un lien est moins visible.

# Les objets connectés

Caméras, badgeuses, imprimantes, écrans, capteurs : les **objets connectés** (IoT) sont nombreux, rarement mis à jour, souvent oubliés dans les inventaires, et régulièrement enrôlés dans des réseaux de machines zombies (*botnets*) utilisés pour des attaques par déni de service massives.

Leurs faiblesses typiques :

- **identifiants par défaut** identiques sur tous les exemplaires, ou mot de passe codé en dur ;
- **micrologiciel** (*firmware*) jamais mis à jour, ou constructeur qui ne publie plus de correctifs ;
- services inutiles exposés (Telnet, interface web d'administration), protocoles en clair ;
- interface cloud du fabricant elle-même vulnérable.

```diagram
type: flow
title: Intégrer un objet connecté en sécurité
steps:
  - title: Choisir
    text: Fabricant qui publie des correctifs et une politique de vulnérabilités
    tone: blue
  - title: Inventorier
    text: Modèle, version du micrologiciel, emplacement, responsable
    tone: blue
  - title: Configurer
    text: Changer les identifiants, désactiver les services inutiles
    tone: violet
  - title: Isoler
    text: VLAN dédié, flux limités au strict nécessaire, pas d'exposition Internet
    tone: violet
  - title: Maintenir
    text: Mises à jour, remplacement en fin de support
    tone: teal
```

> [!NOTE]
> La réglementation européenne renforce les exigences : le **Cyber Resilience Act** impose aux fabricants de produits comportant des éléments numériques la sécurité par conception, l'absence de mot de passe par défaut universel et la gestion des vulnérabilités pendant la durée de support. La norme **ETSI EN 303 645** décrit des exigences de base pour les objets connectés grand public.

# Les systèmes industriels

## Un monde différent

Les **systèmes industriels** (OT, *Operational Technology*) pilotent des processus physiques : chaînes de production, réseaux d'eau et d'énergie, bâtiments, transports. On y trouve des **automates programmables** (API ou PLC), des **supervisions** (SCADA) et des **interfaces homme-machine** (IHM).

```diagram
type: compare
title: Informatique de gestion (IT) et informatique industrielle (OT)
columns:
  - title: IT
    tone: blue
    items:
      - Priorité à la confidentialité et à l'intégrité des données
      - Matériel renouvelé tous les 3 à 5 ans
      - Correctifs appliqués en jours ou semaines
      - Redémarrage acceptable
  - title: OT
    tone: amber
    items:
      - Priorité à la disponibilité et à la sûreté des personnes
      - Équipements en service 15 à 30 ans
      - Correctifs rares, souvent après qualification du fournisseur
      - Arrêter un processus peut coûter très cher ou être dangereux
```

Conséquences pour le défenseur :

- on ne lance **pas** un scan agressif ou un antivirus non qualifié sur un réseau industriel : certains automates anciens peuvent planter sur un simple scan ;
- beaucoup de protocoles industriels (**Modbus**, nombreuses variantes historiques) n'ont **aucune authentification** : qui peut envoyer un paquet peut donner un ordre à l'automate ;
- les correctifs étant rares, la **segmentation** et la **surveillance** portent l'essentiel de la protection.

## Le modèle de Purdue et la segmentation

Le **modèle de Purdue** organise un site industriel en niveaux, de l'atelier au réseau de gestion. La règle centrale : **pas de communication directe** entre l'informatique de gestion (ou Internet) et les automates.

```diagram
type: layers
title: Un site industriel segmenté (inspiré du modèle de Purdue)
layers:
  - title: "Niveaux 4-5 : Entreprise"
    text: Messagerie, ERP, Internet
  - title: DMZ industrielle
    text: Serveurs d'échange, historiens répliqués, accès distants des mainteneurs via bastion
  - title: "Niveau 3 : Opérations du site"
    text: Historiens, gestion de production
  - title: "Niveau 2 : Supervision"
    text: SCADA, IHM, postes d'ingénierie
  - title: "Niveaux 0-1 : Contrôle et processus"
    text: Automates, capteurs, actionneurs
```

Mesures essentielles :

- **cartographier** les équipements et les flux (outils de détection passive, qui écoutent sans interroger) ;
- **segmenter** par zones et conduits, avec des pare-feu, voire des **diodes** (flux unidirectionnel) pour remonter les données vers la gestion ;
- encadrer les **accès distants** des mainteneurs : bastion, authentification forte, session ouverte seulement à la demande et enregistrée ;
- contrôler les **supports amovibles** (station blanche de décontamination des clés USB) ;
- **surveiller** le réseau avec des sondes qui comprennent les protocoles industriels (un ordre d'écriture inhabituel vers un automate est une alerte forte) ;
- préparer des **sauvegardes** des programmes d'automates et des procédures de fonctionnement en mode dégradé.

> [!TIP]
> Références utiles : la série de normes **IEC 62443** (sécurité des systèmes d'automatisation, avec les notions de zones, conduits et niveaux de sécurité) et les guides de l'**ANSSI** sur la cybersécurité des systèmes industriels (méthode de classification et mesures détaillées).

## Une menace bien réelle

Des attaques ont déjà provoqué des coupures d'électricité, l'arrêt d'usines et de pipelines. Dans de nombreux cas, ce n'est pas l'automate qui est visé directement : un **rançongiciel** sur l'informatique de gestion pousse l'entreprise à arrêter la production par précaution, faute de pouvoir facturer ou planifier. La séparation IT/OT et des plans de continuité limitent cet effet domino.

# Exercices

## Exercice 1 : La clé dans l'application

Une application mobile de livraison contient une clé d'API qui donne accès au service de calcul des tarifs. Un chercheur l'a extraite et l'a utilisée pour calculer des tarifs à zéro euro. Qu'est-ce qui ne va pas, et comment corriger ?

<details>
<summary>Voir la solution</summary>

Deux erreurs : un **secret** embarqué dans l'application (il sera toujours extractible) et une logique de prix **contrôlée côté client**. Corrections : supprimer la clé de l'application et la révoquer ; l'application s'authentifie avec l'identité de l'**utilisateur** (jetons de session) ; le **serveur** calcule le tarif et revérifie tout ce qui a un impact financier ; limitation de débit et surveillance des anomalies sur l'API.

</details>

## Exercice 2 : Les caméras

Un audit trouve 40 caméras de surveillance avec le mot de passe d'usine, sur le même réseau que les postes de travail, et dont l'interface est accessible depuis Internet via une redirection de port. Plan d'action ?

<details>
<summary>Voir la solution</summary>

1. **Immédiatement** : supprimer la redirection de port (plus d'exposition Internet) et changer les mots de passe (uniques, stockés dans le gestionnaire de mots de passe).
2. **Isoler** les caméras dans un VLAN dédié, avec seulement le flux vers l'enregistreur ; pas d'accès aux postes ni à Internet sauf besoin justifié.
3. **Mettre à jour** les micrologiciels ; remplacer les modèles qui ne sont plus maintenus.
4. Si un accès à distance est nécessaire : via le VPN ou la solution d'accès sécurisé de l'entreprise.
5. Vérifier dans les journaux si elles ont été compromises (trafic sortant inhabituel) et les ajouter à l'**inventaire**.

</details>

## Exercice 3 : Le scan de l'usine

Un nouvel analyste propose de lancer le scanner de vulnérabilités habituel sur tout le réseau de l'usine pendant la production. Que lui répondez-vous et que proposez-vous ?

<details>
<summary>Voir la solution</summary>

Non : certains automates et équipements anciens peuvent **planter** ou se comporter de façon imprévisible sous un scan actif, avec un risque d'arrêt de production, voire de sécurité des personnes. Proposition : utiliser une **cartographie passive** (sonde qui écoute une copie du trafic) pour inventorier équipements, versions et flux ; réserver les tests actifs à des fenêtres de maintenance, sur des équipements qualifiés, avec l'accord des responsables de production et du fournisseur ; s'appuyer sur la **segmentation** et la surveillance pour compenser les correctifs difficiles à appliquer.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Mobiles, objets connectés et systèmes industriels
center: Des environnements contraints où l'isolement et la vérification côté serveur font l'essentiel.
points:
  - icon: lock
    title: Mobile
    text: Aucun secret dans l'application, stockage sécurisé, l'API revérifie tout.
  - icon: users
    title: Flotte
    text: MDM ou MAM, chiffrement, mises à jour, effacement à distance.
  - icon: network
    title: Objets connectés
    text: Identifiants changés, VLAN dédié, micrologiciel à jour, jamais exposés.
  - icon: gauge
    title: OT
    text: Disponibilité et sûreté d'abord ; protocoles sans authentification.
  - icon: layers
    title: Purdue
    text: Zones et conduits, DMZ industrielle, pas de flux direct gestion-automates.
pitfall: Lancer un scan actif sur un réseau d'automates en pleine production.
remember: Ce qu'on ne peut pas corriger, on l'isole et on le surveille.
```
