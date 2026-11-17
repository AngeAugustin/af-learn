---
title: Les principes de la sécurité
description: Disponibilité, intégrité, confidentialité et traçabilité ; défense en profondeur, moindre privilège, surface d'attaque ; modélisation des menaces avec STRIDE.
duration: 45
objectives:
  - Définir les besoins de sécurité (DICT) d'un système
  - Appliquer les grands principes de conception sécurisée
  - Réduire la surface d'attaque d'un système
  - Conduire une modélisation des menaces simple avec STRIDE
---

# Les besoins de sécurité

On exprime ce qu'on veut protéger avec quatre critères, souvent abrégés **DICT** en français (*CIA triad* en anglais pour les trois premiers) :

| Critère | Question | Exemple d'atteinte |
|---|---|---|
| **Disponibilité** | Le système et les données sont-ils accessibles quand on en a besoin ? | Rançongiciel, déni de service, panne sans sauvegarde |
| **Intégrité** | Les données sont-elles exactes et non modifiées sans autorisation ? | IBAN modifié dans un fichier fournisseur, défiguration de site |
| **Confidentialité** | Seules les personnes autorisées y accèdent-elles ? | Fuite d'un fichier clients, mot de passe intercepté |
| **Traçabilité** (preuve) | Peut-on savoir qui a fait quoi, et le prouver ? | Absence de journaux, journaux modifiables par l'attaquant |

Les besoins **varient** selon les données et les systèmes. Un site vitrine a un fort besoin de disponibilité et d'intégrité, mais pas de confidentialité. Un dossier médical a un très fort besoin de confidentialité et d'intégrité. On évalue chaque critère sur une échelle (par exemple de 1 à 4) pour **prioriser** les mesures.

## Identifier, authentifier, autoriser, tracer

Le contrôle d'accès repose sur une chaîne de quatre étapes :

```diagram
type: flow
title: La chaîne du contrôle d'accès
steps:
  - title: Identification
    text: Qui prétendez-vous être ? (identifiant)
    tone: blue
  - title: Authentification
    text: Prouvez-le (mot de passe, clé, facteur supplémentaire)
    tone: amber
  - title: Autorisation
    text: Qu'avez-vous le droit de faire ?
    tone: teal
  - title: Traçabilité
    text: Ce que vous avez fait est journalisé
    tone: violet
```

Ne confondez pas **authentification** (prouver son identité) et **autorisation** (vérifier ses droits) : beaucoup de vulnérabilités viennent d'une application qui authentifie correctement l'utilisateur mais oublie de vérifier qu'il a le droit d'accéder à **cette** ressource (module 5).

# Les principes de conception sécurisée

## La défense en profondeur

Aucune protection n'est parfaite. La **défense en profondeur** superpose plusieurs barrières **indépendantes**, de sorte que la défaillance de l'une n'entraîne pas la compromission du système.

```diagram
type: layers
title: La défense en profondeur
layers:
  - title: Organisation et humains
    text: Politiques, sensibilisation, procédures
  - title: Périmètre et réseau
    text: Pare-feu, segmentation, filtrage, accès distants sécurisés
  - title: Systèmes
    text: Mises à jour, durcissement, antivirus et EDR
  - title: Applications
    text: Développement sécurisé, validation des entrées, contrôle d'accès
  - title: Données
    text: Chiffrement, sauvegardes, droits minimaux
```

Exemple : un mot de passe volé par hameçonnage (échec de la sensibilisation) est arrêté par l'**authentification multifacteur** ; si elle est contournée, la **segmentation** limite ce que l'attaquant atteint ; la **détection** repère le comportement anormal ; les **sauvegardes** hors ligne permettent de restaurer.

## Les autres principes

- **Moindre privilège** : chaque utilisateur, programme et service ne dispose que des droits strictement nécessaires, et seulement le temps nécessaire. Un compte administrateur ne sert qu'aux tâches d'administration, pas à lire ses courriels.
- **Séparation des tâches** : une même personne ne peut pas à la fois créer un fournisseur et valider un paiement vers lui.
- **Sécurité par défaut** : la configuration livrée est la plus sûre (fonctions inutiles désactivées, mots de passe par défaut à changer obligatoirement).
- **Échec sécurisé** (*fail secure*) : en cas d'erreur, le système refuse l'accès plutôt que de l'accorder.
- **Simplicité** : un système simple a moins de failles et se vérifie mieux qu'un système complexe.
- **Pas de sécurité par l'obscurité** : la sécurité ne doit pas reposer sur le secret de la conception (algorithme maison, URL « cachée »), mais sur des secrets bien gérés (clés, mots de passe). C'est le principe de Kerckhoffs en cryptographie.

> [!TIP]
> Le modèle **Zero Trust** pousse ces principes plus loin : ne jamais accorder de confiance implicite en fonction de l'emplacement réseau (« il est dans le réseau interne, donc il est fiable »), et vérifier explicitement chaque accès selon l'identité, l'état de l'appareil et le contexte. Le module 4 y revient.

# La surface d'attaque

La **surface d'attaque** est l'ensemble des points par lesquels un attaquant peut tenter d'interagir avec un système : ports réseau ouverts, pages et API exposées, comptes utilisateurs, logiciels installés, fournisseurs connectés, personnes ciblables par hameçonnage.

La réduire est l'une des mesures les plus efficaces :

- fermer les ports et services inutiles ;
- supprimer les comptes inactifs et les applications inutilisées ;
- ne pas exposer sur Internet les interfaces d'administration (accès par VPN ou bastion) ;
- tenir un **inventaire** à jour : on ne protège pas ce qu'on ne connaît pas.

# Modéliser les menaces avec STRIDE

La **modélisation des menaces** (*threat modeling*) consiste à se demander, dès la conception : **qu'est-ce qui pourrait mal tourner, et que fait-on pour l'éviter ?** La méthode **STRIDE**, créée chez Microsoft, propose six catégories de menaces, chacune liée à une propriété de sécurité :

| Menace | Signification | Propriété violée | Exemple de contre-mesure |
|---|---|---|---|
| **S**poofing | Usurpation d'identité | Authentification | MFA, signatures |
| **T**ampering | Altération de données | Intégrité | Contrôles d'intégrité, droits d'écriture minimaux |
| **R**epudiation | Répudiation (nier une action) | Traçabilité | Journaux horodatés et protégés |
| **I**nformation disclosure | Fuite d'information | Confidentialité | Chiffrement, contrôle d'accès |
| **D**enial of service | Déni de service | Disponibilité | Limitation de débit, redondance |
| **E**levation of privilege | Élévation de privilèges | Autorisation | Moindre privilège, vérification des droits côté serveur |

La démarche en quatre questions (popularisée par Adam Shostack) :

1. **Sur quoi travaille-t-on ?** Dessiner le système : composants, flux de données, **frontières de confiance** (là où des données passent d'une zone peu fiable à une zone plus fiable, par exemple d'Internet vers le serveur).
2. **Qu'est-ce qui peut mal tourner ?** Appliquer STRIDE à chaque composant et flux.
3. **Que fait-on pour y remédier ?** Choisir des contre-mesures, ou accepter consciemment un risque.
4. **A-t-on fait du bon travail ?** Relire, tester, mettre à jour quand le système évolue.

```video
url: https://www.youtube.com/watch?v=rEnJYNkUde0
title: "STRIDE Threat Modeling for Beginners - In 20 Minutes"
channel: "Netsec Explained"
duration: "21:49"
lang: en
why: "Une introduction pratique à la modélisation des menaces avec STRIDE, en vingt minutes, à partir d'un schéma d'application."
```

# Exercices

## Exercice 1 : Évaluer les besoins

Pour chacun de ces systèmes, quel critère DICT est le plus critique ?

1. Le site de vente en ligne d'un commerçant, pendant les soldes.
2. La base des dossiers de patients d'une clinique.
3. Le registre des virements d'une entreprise.

<details>
<summary>Voir la solution</summary>

1. **Disponibilité** : chaque minute d'indisponibilité coûte des ventes (l'intégrité des prix et des commandes compte aussi).
2. **Confidentialité** (données de santé) et **intégrité** (une erreur de dossier peut être dangereuse).
3. **Intégrité** et **traçabilité** : un IBAN modifié détourne de l'argent, et il faut savoir qui a validé quoi.

</details>

## Exercice 2 : Appliquer STRIDE

Une application de prise de rendez-vous médicaux permet aux patients de se connecter, de réserver un créneau et de téléverser une ordonnance. Identifiez une menace pour chaque lettre de STRIDE.

<details>
<summary>Voir la solution</summary>

- **S** : un attaquant se connecte avec le mot de passe d'un patient récupéré dans une fuite (→ MFA, détection des connexions inhabituelles).
- **T** : modification des rendez-vous d'un autre patient via l'API (→ vérification des droits côté serveur).
- **R** : un patient nie avoir annulé un rendez-vous facturé (→ journalisation des actions).
- **I** : accès aux ordonnances d'autres patients en changeant un identifiant dans l'URL (→ contrôle d'accès par objet, stockage privé).
- **D** : réservation automatisée de tous les créneaux par un robot (→ limitation de débit, CAPTCHA, règles métier).
- **E** : un patient accède à l'interface d'administration des médecins (→ vérification du rôle à chaque requête).

</details>

## Exercice 3 : Défense en profondeur

Un attaquant a obtenu, par hameçonnage, le mot de passe de la messagerie d'une comptable. Citez quatre mesures, à des niveaux différents, qui auraient pu empêcher ou limiter les dégâts.

<details>
<summary>Voir la solution</summary>

1. **Humain** : sensibilisation à l'hameçonnage et procédure de signalement.
2. **Identité** : authentification multifacteur résistante à l'hameçonnage (clé de sécurité, passkey).
3. **Détection** : alerte sur une connexion depuis un pays ou un appareil inhabituel, ou sur la création d'une règle de transfert automatique.
4. **Processus** : double validation des changements d'IBAN fournisseur par un contre-appel à un numéro connu (séparation des tâches).

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Les principes de la sécurité
center: Savoir ce qu'on protège, superposer des barrières indépendantes et penser aux menaces dès la conception.
points:
  - icon: target
    title: DICT
    text: Disponibilité, intégrité, confidentialité, traçabilité, évaluées système par système.
  - icon: key
    title: Authentifier et autoriser
    text: Prouver qui l'on est n'est pas avoir le droit ; vérifier les deux, et tracer.
  - icon: layers
    title: Défense en profondeur
    text: Humain, réseau, système, application, données ; une barrière qui cède ne suffit pas.
  - icon: lock
    title: Moindre privilège
    text: Juste les droits nécessaires, séparation des tâches, sécurité par défaut.
  - icon: search
    title: STRIDE
    text: Usurpation, altération, répudiation, fuite, déni de service, élévation de privilèges.
pitfall: Compter sur une seule protection, ou sur le secret de la conception plutôt que sur des clés bien gérées.
remember: On ne protège bien que ce qu'on connaît ; l'inventaire et la modélisation des menaces viennent d'abord.
```
