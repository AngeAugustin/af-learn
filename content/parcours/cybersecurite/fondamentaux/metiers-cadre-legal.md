---
title: Les métiers et le cadre légal
description: Le paysage des menaces, les métiers de la cybersécurité, les acteurs institutionnels et les règles légales et éthiques à respecter avant toute pratique.
duration: 45
objectives:
  - Décrire les principales menaces et leurs auteurs
  - Situer les grands métiers de la cybersécurité
  - Connaître le cadre légal français et les acteurs institutionnels
  - Savoir où et comment s'entraîner légalement
---

# Pourquoi la cybersécurité ?

Toutes les organisations dépendent de systèmes numériques : messagerie, comptabilité, production, relation client. Une attaque peut **arrêter l'activité** (rançongiciel), **voler des données** (fichiers clients, secrets industriels), **détourner de l'argent** (fraude au virement) ou **porter atteinte à la réputation**. Les victimes ne sont pas seulement les grandes entreprises : collectivités, hôpitaux, PME et particuliers sont touchés chaque jour.

## Qui attaque, et pourquoi ?

| Auteur | Motivation principale | Exemples d'actions |
|---|---|---|
| **Cybercriminels** | Argent | Rançongiciels, vol et revente de données, fraude, hameçonnage |
| **Acteurs étatiques** | Espionnage, influence, sabotage | Intrusions longues et discrètes, attaques sur les infrastructures |
| **Hacktivistes** | Idéologie | Dénis de service, défigurations de sites, fuites |
| **Menace interne** | Vengeance, appât du gain, ou simple erreur | Vol de données, mauvaise manipulation, droits excessifs |

> [!NOTE]
> Beaucoup d'incidents ne viennent pas d'une attaque sophistiquée mais de **fondamentaux négligés** : mot de passe réutilisé, logiciel non mis à jour, absence d'authentification multifacteur, sauvegardes non testées, droits trop larges. Ce parcours insiste sur ces fondamentaux.

# Les métiers

La cybersécurité regroupe des métiers très différents, qu'on peut répartir en trois familles.

```diagram
type: compare
title: Les grandes familles de métiers
columns:
  - title: Gouverner
    tone: blue
    items:
      - RSSI (responsable de la sécurité des systèmes d'information)
      - Consultant gouvernance, risques et conformité (GRC)
      - Auditeur
  - title: Protéger et construire
    tone: teal
    items:
      - Architecte et ingénieur sécurité
      - Sécurité applicative (AppSec), DevSecOps
      - Sécurité du cloud, gestion des identités
  - title: Détecter, tester, répondre
    tone: amber
    items:
      - Analyste SOC (centre opérationnel de sécurité)
      - Auditeur technique, pentesteur
      - Analyste CSIRT / CERT, forensique
```

- Le **RSSI** définit la politique de sécurité, pilote les risques et rend compte à la direction.
- Le **consultant GRC** traduit les exigences (normes, réglementations) en mesures et vérifie leur application.
- L'**ingénieur sécurité** déploie et exploite les protections (pare-feu, gestion des identités, durcissement).
- L'**analyste SOC** surveille les alertes, qualifie les événements suspects et déclenche la réponse.
- Le **pentesteur** (*penetration tester*) recherche les vulnérabilités en simulant des attaques, **avec autorisation**.
- L'**analyste CSIRT** (*Computer Security Incident Response Team*) gère les incidents et mène les investigations numériques.

# Le cadre légal

## Le Code pénal

En France, les **atteintes aux systèmes de traitement automatisé de données** (STAD) sont réprimées par les articles **323-1 et suivants** du Code pénal. Constituent notamment des délits :

- **accéder ou se maintenir frauduleusement** dans tout ou partie d'un système (article 323-1) ;
- **entraver ou fausser** son fonctionnement (article 323-2) ;
- **introduire, extraire, modifier ou supprimer frauduleusement** des données (article 323-3) ;
- **détenir, mettre à disposition ou diffuser sans motif légitime** un outil conçu pour commettre ces infractions (article 323-3-1).

Les peines sont lourdes (plusieurs années d'emprisonnement et de fortes amendes, aggravées lorsque le système appartient à l'État ou lorsque l'infraction est commise en bande organisée). La plupart des pays ont des lois équivalentes.

> [!CAUTION]
> Tester la sécurité d'un système **sans autorisation écrite** de son propriétaire est illégal, **même sans intention de nuire**, même si la faille est « évidente », même pour « rendre service ». La règle de ce parcours est absolue : on ne pratique **que** sur ses propres systèmes, sur des plateformes d'entraînement prévues pour cela, ou dans le cadre d'un contrat d'audit signé.

## Signaler une vulnérabilité

Si vous découvrez par hasard une vulnérabilité sur un site (sans l'avoir recherchée activement), la bonne pratique est la **divulgation coordonnée** : la signaler à l'organisation concernée (beaucoup publient une adresse dédiée, par exemple dans un fichier `security.txt`), sans l'exploiter ni la publier, en lui laissant le temps de corriger. En France, l'**ANSSI** peut servir d'intermédiaire pour un signalement. Les **programmes de bug bounty** offrent un cadre explicite : périmètre autorisé, règles et récompenses.

# Les acteurs institutionnels

| Acteur | Rôle |
|---|---|
| **ANSSI** (Agence nationale de la sécurité des systèmes d'information) | Autorité nationale : défense des systèmes d'information, guides et recommandations, qualification de produits et de prestataires |
| **CERT-FR** | Centre gouvernemental de veille, d'alerte et de réponse aux attaques, rattaché à l'ANSSI ; publie avis et alertes de sécurité |
| **Cybermalveillance.gouv.fr** | Dispositif national d'assistance aux victimes (particuliers, entreprises, collectivités), prévention et sensibilisation |
| **CNIL** | Protection des données personnelles ; reçoit les notifications de violations de données |
| **ENISA** | Agence de l'Union européenne pour la cybersécurité |

> [!TIP]
> Les **guides de l'ANSSI** (guide d'hygiène informatique, recommandations de configuration, guides de durcissement) et les **fiches de Cybermalveillance.gouv.fr** sont gratuits, à jour et de grande qualité. Ils sont une excellente source de référence tout au long de ce parcours.

# S'entraîner légalement

Les compétences pratiques s'acquièrent en manipulant. Plusieurs environnements sont **conçus pour être attaqués** :

- **plateformes d'entraînement** : Root-Me (francophone), TryHackMe, Hack The Box, PortSwigger Web Security Academy (sécurité web, gratuite) ;
- **applications volontairement vulnérables** à installer chez soi : OWASP Juice Shop, DVWA ;
- **compétitions CTF** (*Capture The Flag*), en ligne ou en présentiel ;
- un **laboratoire personnel** : machines virtuelles isolées (VirtualBox, Proxmox) sur un réseau privé.

```diagram
type: decision
title: Ai-je le droit de tester ce système ?
nodes:
  - question: Le système m'appartient-il entièrement (y compris l'hébergement) ?
    yes: Oui, dans un réseau isolé de préférence
    no: Question suivante
  - question: Est-ce une plateforme d'entraînement ou un bug bounty, et la cible est-elle dans le périmètre autorisé ?
    yes: Oui, en respectant strictement les règles publiées
    no: Question suivante
  - question: Ai-je une autorisation écrite du propriétaire précisant le périmètre et la période ?
    yes: Oui, dans ce périmètre et cette période uniquement
    no: "Non : ne pas tester"
```

## Comment ce parcours est organisé

| Module | Ce que vous y apprenez |
|---|---|
| 1. Fondamentaux | Menaces, métiers, cadre légal, principes de conception sécurisée, gestion des risques |
| 2. Réseaux et systèmes | TCP/IP, accès distants, Wi-Fi, messagerie, durcissement Linux, Windows et Active Directory |
| 3. Cryptographie appliquée | Chiffrement, hachage, signatures, TLS et certificats, mots de passe et secrets |
| 4. Identité et accès | Authentification forte et passkeys, sessions, autorisation, SSO, OAuth 2.0, Zero Trust |
| 5. Applications web, API et IA | OWASP Top 10, injections, XSS, contrôle d'accès, API, applications utilisant des LLM |
| 6. Vulnérabilités, tests d'intrusion et audits | Gestion des correctifs, méthodologie du pentest, audits, divulgation coordonnée |
| 7. Détection et réponse | Journalisation, SIEM, EDR, renseignement sur la menace, chasse, réponse à incident |
| 8. Cloud, environnements spécifiques et DevSecOps | Cloud, mobiles, objets connectés, systèmes industriels, chaîne logicielle |
| 9. Facteur humain et conformité | Ingénierie sociale, culture de sécurité, réglementations, projet final |

Les modules se suivent dans l'ordre : chacun s'appuie sur les précédents (on ne sécurise pas une API sans comprendre TLS et l'authentification, on ne détecte pas une attaque sans connaître ses techniques).

# Exercices

## Exercice 1 : Qui fait quoi ?

Associez chaque situation au métier le plus concerné :

1. Une alerte signale des connexions inhabituelles sur un serveur à 3 h du matin.
2. L'entreprise doit se mettre en conformité avec une nouvelle réglementation européenne.
3. Avant la mise en ligne d'une application, la direction veut savoir si elle résiste à des attaques.
4. Un rançongiciel a chiffré une partie du réseau.

<details>
<summary>Voir la solution</summary>

1. **Analyste SOC** (qualification de l'alerte).
2. **Consultant GRC** et **RSSI**.
3. **Pentesteur** / auditeur technique (avec une autorisation écrite).
4. **CSIRT** (réponse à incident), avec le RSSI pour le pilotage et la communication.

</details>

## Exercice 2 : Légal ou non ?

Pour chaque situation, indiquez si l'action est légale :

1. Lancer un scanner de ports sur le site de votre banque « pour voir ».
2. Attaquer la machine « Easy » d'une plateforme d'entraînement, dans le cadre de son abonnement.
3. Tester l'application de votre employeur à la demande orale d'un collègue développeur.
4. Tester votre propre serveur hébergé chez un fournisseur cloud, en respectant sa politique de tests.

<details>
<summary>Voir la solution</summary>

1. **Non** : aucune autorisation ; cela peut constituer une tentative d'accès frauduleux et déclencher des poursuites.
2. **Oui** : c'est l'objet de la plateforme, dans les règles publiées.
3. **Non** en l'état : un collègue n'a pas autorité pour autoriser ; il faut une **autorisation écrite** de la personne responsable, avec périmètre et dates.
4. **Oui**, à condition de respecter la politique de tests d'intrusion du fournisseur (certains interdisent par exemple les tests de déni de service).

</details>

## Exercice 3 : Une faille trouvée par hasard

En utilisant normalement le site d'une association, vous remarquez qu'en modifiant un numéro dans l'adresse de la page « Mon reçu », vous voyez le reçu fiscal d'un autre donateur. Que faites-vous ?

<details>
<summary>Voir la solution</summary>

1. **Arrêter immédiatement** : ne pas consulter d'autres reçus, ne pas les télécharger ni les conserver.
2. **Signaler** la vulnérabilité à l'association (contact dédié, `security.txt`, ou contact général), en décrivant le problème de façon factuelle et sans données d'autres personnes.
3. Ne **pas** la publier ; laisser le temps de corriger. En cas de difficulté, l'ANSSI peut faire l'intermédiaire.

Il s'agit d'une vulnérabilité de contrôle d'accès (IDOR), étudiée dans le module 5.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Les métiers et le cadre légal
center: Protéger des systèmes dont tout dépend, avec des compétences variées et un cadre légal strict.
points:
  - icon: alert
    title: Les menaces
    text: Cybercriminels, États, hacktivistes, menace interne ; souvent des fondamentaux négligés.
  - icon: users
    title: Les métiers
    text: Gouverner (RSSI, GRC), protéger (ingénierie, AppSec), détecter et répondre (SOC, CSIRT, pentest).
  - icon: scale
    title: La loi
    text: "Accès ou maintien frauduleux, entrave, altération de données : articles 323-1 et suivants."
  - icon: shield
    title: Les acteurs
    text: ANSSI, CERT-FR, Cybermalveillance.gouv.fr, CNIL, ENISA.
  - icon: target
    title: S'entraîner
    text: Root-Me, TryHackMe, Hack The Box, Juice Shop, CTF, laboratoire isolé.
pitfall: Tester un système « pour rendre service » sans autorisation écrite de son propriétaire.
remember: Sans autorisation écrite, aucun test ; avec autorisation, seulement dans le périmètre prévu.
```
