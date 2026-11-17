---
title: La méthodologie du test d'intrusion
description: Cadre légal et règles d'engagement, reconnaissance et OSINT, découverte et énumération, exploitation, élévation de privilèges, mouvement latéral, rapport ; pentest, red team et purple team.
duration: 70
objectives:
  - Cadrer un test d'intrusion (autorisation, périmètre, règles d'engagement)
  - Dérouler les phases d'un test, de la reconnaissance au rapport
  - Utiliser les outils de base (nmap, proxy web) dans un laboratoire
  - Comprendre l'élévation de privilèges et le mouvement latéral pour mieux s'en protéger
  - Distinguer pentest, red team et purple team, et s'entraîner légalement
---

# Ce qu'est un test d'intrusion

Un **test d'intrusion** (*pentest*) simule l'action d'un attaquant, **avec l'accord écrit** du propriétaire du système, pour découvrir les vulnérabilités **exploitables** et en mesurer l'impact réel. Il complète le scan de vulnérabilités (module précédent) : le scan liste des faiblesses connues, le pentest montre ce qu'un attaquant peut **réellement** en faire, en combinant plusieurs faiblesses.

> [!CAUTION]
> Sans autorisation écrite du propriétaire, un test d'intrusion est une **intrusion** au sens pénal (articles 323-1 et suivants du Code pénal, module 1). Toutes les commandes de ce chapitre se pratiquent **uniquement** sur vos propres machines virtuelles, sur des plateformes d'entraînement prévues pour cela, ou dans le cadre d'une mission signée.

## Les approches

| Approche | Ce que sait l'auditeur | Intérêt |
|---|---|---|
| **Boîte noire** | Rien, sauf la cible (une URL, une plage d'adresses) | Point de vue d'un attaquant externe |
| **Boîte grise** | Un compte utilisateur, une documentation | Le plus courant : teste aussi ce qu'un utilisateur ou un client malveillant peut faire |
| **Boîte blanche** | Code source, architecture, accès administrateur en lecture | Le plus exhaustif pour un temps donné |

## Le cadre d'une mission

Avant la moindre action, une mission définit par écrit :

- le **périmètre** : adresses, domaines, applications, comptes inclus **et exclus** (un service hébergé chez un tiers nécessite aussi l'accord de ce tiers) ;
- les **règles d'engagement** : dates et horaires, techniques autorisées ou interdites (déni de service, ingénierie sociale, attaques physiques), conduite à tenir si une donnée sensible est atteinte ;
- les **contacts d'urgence** des deux côtés, pour arrêter immédiatement le test si un service est perturbé ou si l'auditeur découvre une **compromission réelle** déjà en cours ;
- la **confidentialité** des résultats et la destruction des données collectées en fin de mission.

> [!TIP]
> En France, l'ANSSI qualifie des prestataires d'audit de la sécurité des systèmes d'information (**PASSI**). Pour un système sensible, c'est un gage de compétence et de déontologie.

# Les phases d'un test

```diagram
type: flow
title: Les phases d'un test d'intrusion
steps:
  - title: Cadrage
    text: Autorisation, périmètre, règles d'engagement
    tone: violet
  - title: Reconnaissance
    text: Collecter l'information publique (OSINT)
    tone: blue
  - title: Découverte et énumération
    text: Hôtes, ports, services, versions, utilisateurs
    tone: blue
  - title: Exploitation
    text: Prouver qu'une vulnérabilité donne un accès
    tone: rose
  - title: Post-exploitation
    text: Élévation de privilèges, mouvement latéral, impact
    tone: rose
  - title: Rapport
    text: Constats, preuves, risques, corrections
    tone: teal
```

Des méthodologies publiques détaillent ces étapes : le **PTES** (*Penetration Testing Execution Standard*), l'**OWASP Web Security Testing Guide** pour les applications web, l'**OWASP MASTG** pour les applications mobiles.

## La reconnaissance (OSINT)

La **reconnaissance passive** collecte l'information publique, sans toucher aux systèmes de la cible : c'est le renseignement en sources ouvertes (**OSINT**).

- **Domaines et sous-domaines** : journaux de transparence des certificats (crt.sh), enregistrements DNS. Un sous-domaine oublié (`ancien-extranet.exemple.fr`) est souvent la porte d'entrée.
- **Technologies** : en-têtes HTTP, offres d'emploi (« nous recherchons un administrateur Citrix »), dépôts de code publics.
- **Personnes** : organigramme, format des adresses e-mail, réseaux sociaux professionnels, utiles pour l'ingénierie sociale si elle est dans le périmètre.
- **Fuites** : secrets publiés par erreur dans des dépôts publics, identifiants issus de fuites connues.

> [!NOTE]
> C'est exactement le travail que fait un attaquant réel. Le faire soi-même (ou le faire faire) permet de réduire sa **surface d'exposition** : supprimer les sous-domaines inutiles, les informations techniques superflues et les secrets publiés.

## La découverte et l'énumération

La **reconnaissance active** interroge les systèmes. **nmap** est l'outil de référence pour découvrir hôtes, ports et services :

```bash
# Laboratoire uniquement : réseau privé hôte de vos machines virtuelles
nmap -sn 192.168.56.0/24                 # quels hôtes répondent ?
nmap -sS -p- 192.168.56.10               # tous les ports TCP (scan SYN, nécessite les droits root)
nmap -sV -sC -p 22,80,445 192.168.56.10  # versions des services et scripts de détection par défaut
nmap -sU --top-ports 50 192.168.56.10    # les 50 ports UDP les plus courants (lent)
```

L'**énumération** approfondit chaque service trouvé : répertoires et pages d'une application web, partages SMB accessibles, utilisateurs d'un annuaire, versions logicielles à comparer aux vulnérabilités connues (CVE).

## L'exploitation

L'**exploitation** démontre qu'une vulnérabilité donne réellement un accès : contourner une authentification, lire des données d'un autre client (IDOR), exécuter une commande sur le serveur. Pour les applications web, l'outil central est un **proxy d'interception** (Burp Suite, OWASP ZAP, Caido) placé entre le navigateur et l'application : il permet de voir, modifier et rejouer chaque requête.

```diagram
type: sequence
title: Tester un contrôle d'accès avec un proxy d'interception
actors: [Navigateur, Proxy, Application]
messages:
  - from: 0
    to: 1
    text: GET /api/factures/1042 (compte A)
  - from: 1
    to: 2
    text: "Requête rejouée en changeant l'identifiant : /api/factures/1043"
  - from: 2
    to: 1
    text: 200 OK avec la facture du compte B
  - from: 1
    to: 0
    text: "Constat : IDOR, un client lit les factures des autres"
```

Des frameworks comme **Metasploit** regroupent des modules d'exploitation de vulnérabilités connues ; ils servent surtout à prouver rapidement l'impact d'un correctif manquant. Un bon auditeur reste **prudent** : pas d'exploit instable sur un serveur de production sans accord, pas de modification de données réelles, preuve minimale suffisante (une capture qui montre l'accès, pas l'extraction de toute la base).

```video
url: https://www.youtube.com/watch?v=-LevHAzXgFs
title: "Penetration Testing - CompTIA Security+ SY0-701 - 4.3"
channel: "Professor Messer"
duration: "6:21"
lang: en
why: "Professor Messer présente les tests d'intrusion tels que les décrit la certification Security+ : périmètre, règles d'engagement et phases."
```

# Après l'accès initial

## L'élévation de privilèges

Un premier accès est souvent limité (compte de service web, utilisateur standard). L'**élévation de privilèges** cherche à devenir administrateur (root sous Linux, SYSTEM ou administrateur de domaine sous Windows). Les causes typiques sont des **erreurs de configuration** plus que des failles exotiques :

| Système | Faiblesses fréquentes |
|---|---|
| **Linux** | Règle `sudo` trop large (un éditeur ou un interpréteur lancé en root permet d'ouvrir un shell), binaire SUID inattendu, tâche cron exécutant un script modifiable par tous, noyau non mis à jour, secrets lisibles dans des fichiers de configuration |
| **Windows** | Service dont l'exécutable ou le chemin est modifiable, mot de passe administrateur local identique sur tous les postes (sans LAPS), identifiants en mémoire d'un administrateur connecté, droits excessifs dans Active Directory |

```bash
# Sur VOTRE machine Linux de laboratoire : premiers contrôles d'un auditeur… et d'un administrateur
sudo -l                                     # ce que l'utilisateur courant peut lancer en root
find / -perm -4000 -type f 2>/dev/null      # binaires SUID
ls -l /etc/cron.d /etc/crontab              # tâches planifiées et leurs scripts
```

> [!TIP]
> Ces contrôles sont exactement ceux du durcissement (module 2) vus du côté attaquant. Un administrateur qui les lance régulièrement sur ses propres serveurs ferme la plupart des chemins d'élévation.

## Le mouvement latéral et l'impact

Une fois administrateur d'une machine, l'attaquant cherche à **rebondir** vers d'autres : identifiants récupérés en mémoire, partages accessibles, relations d'approbation, chemins d'attaque dans Active Directory (des outils comme **BloodHound** les cartographient sous forme de graphe ; les défenseurs les utilisent pour couper ces chemins). Le pentest s'arrête quand l'**objectif** convenu est atteint ou démontré atteignable (« accéder aux données de paie », « devenir administrateur du domaine »).

```diagram
type: flow
title: Un scénario typique d'attaque interne
steps:
  - title: Poste utilisateur
    text: Accès initial (hameçonnage simulé ou compte fourni)
    tone: blue
  - title: Administrateur local
    text: Mot de passe local partagé trouvé dans un script
    tone: amber
  - title: Autres postes
    text: "Même mot de passe : un administrateur du domaine s'y est connecté"
    tone: amber
  - title: Domaine compromis
    text: Ses identifiants donnent le contrôle de tout l'annuaire
    tone: rose
```

> [!IMPORTANT]
> Ce scénario illustre pourquoi le **modèle d'administration en tiers**, **LAPS** et la segmentation (module 2) sont si efficaces : chacun coupe un maillon de la chaîne.

## Le nettoyage

En fin de mission, l'auditeur **supprime** tout ce qu'il a déposé (comptes créés, fichiers, outils, tâches planifiées) et le documente dans le rapport. Les identifiants et données collectés sont détruits selon la convention.

# Le rapport

Le rapport est le **livrable** : un test sans rapport exploitable n'a aucune valeur.

- une **synthèse pour la direction** : niveau de risque global, scénarios les plus graves en langage métier, priorités ;
- pour chaque **constat** : description, preuve reproductible, systèmes concernés, **gravité** (souvent CVSS ajusté au contexte), impact, **recommandation** de correction précise ;
- les **points positifs** (ce qui a résisté) et les **limites** du test (périmètre, durée, ce qui n'a pas été testé).

> [!NOTE]
> Un pentest est une **photographie** à une date donnée, sur un périmètre donné, en un temps limité. « Aucune vulnérabilité critique trouvée » ne signifie pas « aucune vulnérabilité ». Après correction, une **contre-vérification** confirme que les failles sont bien fermées.

# Pentest, red team et purple team

```diagram
type: compare
title: Trois exercices offensifs différents
columns:
  - title: Pentest
    tone: blue
    items:
      - Trouver le plus de vulnérabilités possible sur un périmètre
      - Les équipes de défense sont souvent prévenues
      - Durée de quelques jours à quelques semaines
  - title: Red team
    tone: rose
    items:
      - Atteindre un objectif en restant discret, comme un vrai attaquant
      - Teste aussi la détection et la réponse (l'équipe bleue n'est pas prévenue)
      - Plusieurs semaines, périmètre large
  - title: Purple team
    tone: violet
    items:
      - Attaquants et défenseurs travaillent ensemble
      - Rejouer des techniques ATT&CK et vérifier qu'elles sont détectées
      - Améliore directement les règles de détection
```

Une organisation commence par des pentests ; la red team n'a de sens qu'avec une détection et une réponse déjà matures.

# S'entraîner légalement

- **Laboratoire personnel** : quelques machines virtuelles sur un réseau privé hôte, avec des cibles volontairement vulnérables (DVWA, OWASP Juice Shop, machines Metasploitable ou issues de VulnHub).
- **Plateformes d'entraînement** : Root-Me (francophone), TryHackMe, Hack The Box, PortSwigger Web Security Academy (gratuite, excellente pour le web).
- **CTF** (*Capture The Flag*) : compétitions par équipes, très formatrices.
- **Certifications** reconnues pour la suite : par exemple OSCP, ou celles proposées par les plateformes d'entraînement.

> [!CAUTION]
> Une technique apprise sur une plateforme ne doit **jamais** être « essayée » sur un site réel, même « juste pour voir ». L'intention ne change rien au caractère illégal de l'accès.

# Exercices

## Exercice 1 : Cadrer la mission

Une PME vous demande de « tester la sécurité de son site ». Le site est hébergé chez un prestataire et utilise un service de paiement externe. Que faut-il fixer avant de commencer ?

<details>
<summary>Voir la solution</summary>

- Une **autorisation écrite** du dirigeant, et l'accord (ou les conditions publiées) de l'**hébergeur** ; le service de paiement externe est **hors périmètre** sauf accord explicite de ce prestataire.
- Le **périmètre** exact : domaines, sous-domaines, environnements (test ou production), comptes fournis (boîte grise).
- Les **règles d'engagement** : horaires, pas de déni de service, conduite à tenir si des données personnelles sont accessibles.
- Les **contacts d'urgence** et la procédure d'arrêt.
- La forme du **rapport**, sa confidentialité et la destruction des données collectées.

</details>

## Exercice 2 : Interpréter un scan

Dans votre laboratoire, `nmap -sV` sur un serveur renvoie : 22/tcp OpenSSH 9.6, 80/tcp nginx (redirige vers 443), 443/tcp nginx, 3306/tcp MySQL 5.7, 8080/tcp Apache Tomcat (page d'administration). Quels points examinez-vous en priorité et pourquoi ?

<details>
<summary>Voir la solution</summary>

1. **3306 MySQL exposé** : une base ne doit pas être accessible depuis l'extérieur ; de plus MySQL 5.7 n'est plus maintenu. Vérifier l'authentification et les versions vulnérables.
2. **8080 Tomcat avec page d'administration** : interface d'administration exposée ; tester les identifiants par défaut (dans le périmètre autorisé), un accès permet souvent de déployer une application et donc d'exécuter du code.
3. **SSH** : vérifier que l'authentification par mot de passe est désactivée.
4. **80/443** : poursuivre l'énumération de l'application web.

Recommandations attendues : fermer 3306 et 8080 à Internet (pare-feu, réseau d'administration), mettre à jour MySQL.

</details>

## Exercice 3 : Du constat au risque

Vous avez obtenu un shell en tant qu'utilisateur `www-data` sur un serveur web, puis root grâce à la règle sudo `www-data ALL=(root) NOPASSWD: /usr/bin/vim`. Rédigez le constat pour le rapport.

<details>
<summary>Voir la solution</summary>

- **Titre** : élévation de privilèges vers root via une règle sudo trop permissive.
- **Description** : l'utilisateur du service web peut lancer l'éditeur vim en root sans mot de passe ; vim permet d'exécuter des commandes, donc d'obtenir un shell root.
- **Preuve** : sortie de `sudo -l`, puis capture montrant `id` → `uid=0(root)` (sans autre action).
- **Impact** : toute vulnérabilité de l'application web mène au contrôle total du serveur et des données.
- **Gravité** : élevée (combinée à l'accès initial, critique).
- **Recommandation** : supprimer cette règle ; si une action privilégiée est nécessaire, autoriser **une commande précise** sans éditeur ni interpréteur (par exemple `systemctl restart application`), et revoir toutes les règles sudo.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: La méthodologie du test d'intrusion
center: Simuler un attaquant, avec autorisation, pour prouver les risques réels et les faire corriger.
points:
  - icon: file
    title: Cadre d'abord
    text: Autorisation écrite, périmètre, règles d'engagement, contacts d'urgence.
  - icon: search
    title: Reconnaissance
    text: OSINT puis nmap et énumération, sur un périmètre autorisé uniquement.
  - icon: key
    title: Exploitation prudente
    text: Proxy d'interception, preuve minimale, jamais de casse en production.
  - icon: network
    title: Après l'accès
    text: Élévation de privilèges et mouvement latéral révèlent les erreurs de configuration.
  - icon: list
    title: Le rapport
    text: Synthèse direction, constats reproductibles, recommandations, contre-vérification.
pitfall: Croire qu'un pentest sans constat critique prouve l'absence de vulnérabilité.
remember: Pas d'autorisation écrite, pas de test, même « juste pour voir ».
```
