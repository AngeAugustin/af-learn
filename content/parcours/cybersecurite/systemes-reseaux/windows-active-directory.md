---
title: Windows et Active Directory
description: Sécuriser des postes Windows, comprendre Active Directory (domaine, Kerberos, GPO), les attaques courantes contre l'annuaire et le modèle d'administration en tiers.
duration: 65
objectives:
  - Appliquer les protections essentielles d'un poste Windows
  - Expliquer le fonctionnement d'un domaine Active Directory et de Kerberos
  - Reconnaître les attaques courantes contre Active Directory et leurs parades
  - Mettre en place un modèle d'administration cloisonné et une supervision adaptée
---

# Sécuriser un poste Windows

Windows équipe la grande majorité des postes de travail en entreprise. Les protections essentielles :

- **Mises à jour** automatiques du système et des applications (navigateur, suite bureautique, lecteur PDF).
- **Comptes standard** pour le travail quotidien ; les droits d'administrateur local sont réservés à des comptes dédiés. Le **contrôle de compte d'utilisateur** (UAC) doit rester activé.
- **Microsoft Defender** (antivirus intégré) ou une solution **EDR** (*Endpoint Detection and Response*), qui détecte les comportements malveillants et permet d'isoler un poste à distance.
- **Chiffrement du disque** avec **BitLocker** : un ordinateur portable volé ne livre pas ses données.
- **Mots de passe administrateur local uniques** par poste, gérés par **Windows LAPS** (intégré à Windows) : sinon, un même mot de passe administrateur sur tous les postes permet à un attaquant de passer de l'un à l'autre.
- **Restriction des macros** Office provenant d'Internet et **contrôle des applications** (AppLocker, App Control for Business) pour empêcher l'exécution de programmes non autorisés.
- **Journalisation PowerShell** (journalisation des blocs de script) : PowerShell est très utilisé par les attaquants.

# Active Directory

**Active Directory** (AD) est l'annuaire de Microsoft qui centralise, dans un **domaine**, les comptes utilisateurs, les ordinateurs, les groupes et les règles de configuration. Il est au cœur de la plupart des systèmes d'information d'entreprise, ce qui en fait la **cible principale** des attaquants : qui contrôle l'AD contrôle tout le domaine.

```diagram
type: layers
title: Les éléments d'un domaine Active Directory
layers:
  - title: Forêt et domaines
    text: Frontière d'administration et de sécurité (entreprise.local)
  - title: Contrôleurs de domaine
    text: "Serveurs qui hébergent l'annuaire et authentifient les utilisateurs : les plus critiques du SI"
  - title: Unités d'organisation (OU)
    text: Dossiers pour organiser comptes et machines, et leur appliquer des stratégies
  - title: Utilisateurs, groupes, ordinateurs
    text: Les objets de l'annuaire et leurs appartenances
  - title: Stratégies de groupe (GPO)
    text: Configurations appliquées automatiquement aux machines et utilisateurs
```

## L'authentification : Kerberos et NTLM

Dans un domaine, l'authentification repose principalement sur **Kerberos**, un protocole à **tickets** :

```diagram
type: sequence
title: Kerberos simplifié
actors: [Utilisateur, Contrôleur de domaine (KDC), Serveur de fichiers]
messages:
  - from: 0
    to: 1
    text: Demande d'authentification (preuve dérivée du mot de passe)
  - from: 1
    to: 0
    text: Ticket d'accès au service de tickets (TGT)
  - from: 0
    to: 1
    text: Demande d'un ticket pour le serveur de fichiers (avec le TGT)
  - from: 1
    to: 0
    text: Ticket de service, chiffré avec la clé du compte du service
  - from: 0
    to: 2
    text: Présentation du ticket de service
  - from: 2
    to: 0
    text: Accès accordé selon les droits
```

Le mot de passe ne circule pas : l'utilisateur prouve qu'il le connaît, puis utilise des tickets à durée limitée. **NTLM**, plus ancien et plus faible, existe encore pour la compatibilité ; on cherche à en réduire l'usage (Microsoft a annoncé sa dépréciation progressive).

# Les attaques courantes contre AD

Comprendre les attaques permet de prioriser les défenses. Elles exploitent presque toujours des **faiblesses de configuration** plutôt que des failles logicielles.

| Attaque | Principe | Défenses |
|---|---|---|
| **Pulvérisation de mots de passe** (*password spraying*) | Essayer quelques mots de passe très courants sur tous les comptes, pour éviter le verrouillage | Interdire les mots de passe faibles et connus, MFA, détection des échecs répartis |
| **Kerberoasting** | Demander des tickets de service puis tenter de casser hors ligne le mot de passe des **comptes de service** | Mots de passe de service longs et aléatoires, comptes de service gérés (gMSA), chiffrement AES, surveillance |
| **Vol d'identifiants en mémoire** (*pass-the-hash*, *pass-the-ticket*) | Réutiliser des empreintes ou tickets récupérés sur une machine compromise où un administrateur s'est connecté | Modèle en tiers, groupe *Protected Users*, Credential Guard, ne jamais se connecter en administrateur de domaine sur un poste |
| **Délégations et droits excessifs** | Exploiter des droits mal attribués sur des objets de l'annuaire ou des GPO | Audits réguliers de l'AD, nettoyage des droits |
| **Réplication malveillante** (*DCSync*) | Avec des droits de réplication, obtenir les empreintes de tous les mots de passe | Restreindre strictement ces droits, superviser les réplications hors contrôleurs de domaine |

> [!IMPORTANT]
> Le point commun de nombreuses attaques : un **compte très privilégié** dont les identifiants traînent sur une machine **moins protégée**. D'où le principe central du chapitre : le cloisonnement de l'administration.

# Le modèle d'administration en tiers

Le **modèle en tiers**, recommandé par Microsoft et par l'ANSSI, cloisonne l'administration en niveaux :

```diagram
type: layers
title: Le modèle d'administration en tiers
layers:
  - title: Tier 0
    text: "Contrôleurs de domaine, comptes d'administration de l'AD, infrastructure d'identité : le cœur de confiance"
  - title: Tier 1
    text: Serveurs et applications métier
  - title: Tier 2
    text: Postes de travail et périphériques des utilisateurs
```

Règles fondamentales :

- un compte d'un tier **ne se connecte jamais** à une machine d'un tier inférieur (un administrateur de domaine ne se connecte pas sur un poste utilisateur) ;
- chaque administrateur a des **comptes distincts** par tier, et un compte standard pour la bureautique ;
- l'administration du tier 0 se fait depuis des **postes d'administration dédiés**, durcis et sans accès à Internet ni à la messagerie ;
- le nombre de comptes à privilèges élevés (*Admins du domaine*, *Administrateurs de l'entreprise*) est réduit au **strict minimum**.

## Auditer et superviser

- Les outils d'audit d'Active Directory identifient les mauvaises configurations : **ORADAD** (outil de l'ANSSI) collecte les données de l'annuaire, et d'autres outils comme **PingCastle** produisent un rapport de risques.
- Les **journaux d'événements** des contrôleurs de domaine sont collectés et supervisés. Quelques identifiants d'événements Windows utiles :

| Événement | Signification |
|---|---|
| 4624 / 4625 | Ouverture de session réussie / échouée |
| 4672 | Privilèges spéciaux attribués à une session (connexion d'un compte privilégié) |
| 4720 | Création d'un compte utilisateur |
| 4728, 4732, 4756 | Ajout d'un membre à un groupe de sécurité |
| 4769 | Demande de ticket de service Kerberos (volumes anormaux : signe possible de Kerberoasting) |

- Les **chemins d'attaque** dans l'annuaire (qui peut devenir administrateur du domaine en passant par quelles appartenances, sessions et délégations) se visualisent sous forme de graphe avec des outils comme **BloodHound**. Les attaquants l'utilisent ; les défenseurs aussi, pour **couper** ces chemins avant eux.
- Sur les postes et serveurs, une journalisation riche complète celle des contrôleurs de domaine : **Sysmon** (création de processus avec la ligne de commande, connexions réseau, chargement de pilotes), la journalisation des **blocs de script PowerShell**, et la collecte centralisée des journaux par le transfert d'événements Windows ou l'agent du SIEM.

> [!TIP]
> Commencez par les mesures à fort impact : MFA pour les accès distants et la messagerie, LAPS, comptes d'administration séparés, réduction des Admins du domaine, mots de passe forts pour les comptes de service, puis audit ORADAD ou PingCastle pour prioriser la suite.

# Exercices

## Exercice 1 : Le mot de passe local partagé

Tous les postes d'une entreprise ont le même mot de passe administrateur local, défini lors de la création de l'image système. Quel est le risque ? Quelle solution ?

<details>
<summary>Voir la solution</summary>

Un attaquant qui compromet **un** poste et récupère ce mot de passe (ou son empreinte) peut se connecter en administrateur à **tous** les autres postes : mouvement latéral immédiat. Solution : **Windows LAPS**, qui génère et fait tourner un mot de passe administrateur local **unique** par poste, stocké de façon protégée dans l'annuaire, lisible uniquement par les administrateurs autorisés.

</details>

## Exercice 2 : Le compte de service

Le compte `svc_sauvegarde`, membre du groupe *Admins du domaine*, a un mot de passe de 9 caractères inchangé depuis 2017. Quels risques ? Que proposez-vous ?

<details>
<summary>Voir la solution</summary>

- **Kerberoasting** : un utilisateur quelconque du domaine peut demander un ticket de service pour ce compte, puis tenter de casser son mot de passe court hors ligne.
- Le compte étant **Admin du domaine**, sa compromission donne le contrôle total.

Propositions : retirer le compte des Admins du domaine et ne lui donner que les droits nécessaires à la sauvegarde ; le remplacer par un **compte de service géré** (gMSA), dont le mot de passe long est géré et renouvelé automatiquement ; à défaut, un mot de passe très long et aléatoire ; superviser les demandes de tickets le concernant.

</details>

## Exercice 3 : Appliquer le modèle en tiers

Un administrateur de domaine utilise son compte privilégié pour dépanner les postes des utilisateurs et lire ses courriels. Expliquez le danger et la bonne organisation.

<details>
<summary>Voir la solution</summary>

En se connectant sur des postes utilisateurs (tier 2), il laisse ses identifiants d'administrateur de domaine (tier 0) en mémoire de machines peu protégées : un attaquant présent sur l'un de ces postes peut les récupérer et prendre le contrôle du domaine. La messagerie l'expose aussi à l'hameçonnage avec un compte surpuissant.

Bonne organisation : un compte **standard** pour la bureautique et la messagerie ; un compte d'administration **tier 2** pour le dépannage des postes ; un compte **tier 0** utilisé uniquement depuis un poste d'administration dédié, pour administrer l'AD.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Windows et Active Directory
center: Qui contrôle l'annuaire contrôle tout ; cloisonner l'administration et protéger les comptes privilégiés.
points:
  - icon: shield
    title: Postes
    text: Mises à jour, comptes standard, EDR, BitLocker, LAPS, macros et applications contrôlées.
  - icon: server
    title: Active Directory
    text: Domaine, contrôleurs, OU, groupes, GPO ; Kerberos à tickets, NTLM à réduire.
  - icon: alert
    title: Attaques courantes
    text: Pulvérisation, Kerberoasting, vol d'identifiants, droits excessifs, DCSync.
  - icon: layers
    title: Modèle en tiers
    text: Tier 0, 1, 2 ; jamais de compte privilégié sur une machine d'un tier inférieur.
  - icon: eye
    title: Auditer et superviser
    text: ORADAD, PingCastle ; événements 4624, 4625, 4672, 4720, 4769.
pitfall: Un administrateur de domaine qui se connecte sur des postes utilisateurs avec son compte privilégié.
remember: Les attaques contre l'AD exploitent surtout des erreurs de configuration, donc corrigeables.
```
