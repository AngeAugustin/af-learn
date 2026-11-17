---
title: "Détection : journalisation, SIEM et SOC"
description: Collecter les bons journaux, comprendre SIEM, EDR/XDR et SOC, écrire des règles de détection utiles, s'appuyer sur MITRE ATT&CK et sur le renseignement sur les menaces.
duration: 55
objectives:
  - Identifier les journaux à collecter et les protéger
  - Distinguer SIEM, EDR/XDR, SOAR et le rôle d'un SOC
  - Écrire des détections utiles et limiter les faux positifs
  - Utiliser MITRE ATT&CK pour structurer la détection
---

# Pourquoi la détection ?

La prévention n'arrête pas tout : il faut **détecter** les attaques qui passent, le plus tôt possible. Le délai entre la compromission initiale et sa découverte se compte souvent en **jours ou en semaines** : autant de temps pendant lequel l'attaquant progresse. Réduire ce délai limite les dégâts.

Détecter suppose trois choses : **collecter** les bonnes traces, les **analyser** pour repérer l'anormal, et **alerter** les bonnes personnes de façon exploitable.

# Collecter les bons journaux

On ne détecte que ce qu'on observe. Les sources de journaux les plus utiles :

| Source | Exemples d'événements utiles |
|---|---|
| **Authentification** | Connexions réussies et échouées, MFA, élévations de privilèges |
| **Systèmes** | Création de comptes, de services, de tâches planifiées, exécutions de processus |
| **Réseau** | Connexions, requêtes DNS, trafic vers l'extérieur, pare-feu |
| **Applications** | Accès sensibles, erreurs, actions d'administration |
| **Cloud** | Journaux d'activité (API), modifications de droits et de configuration |
| **Sécurité** | Antivirus/EDR, pare-feu, proxy, IDS |

> [!IMPORTANT]
> Un journal n'est utile que s'il est **complet**, **horodaté** de façon cohérente (une référence de temps commune, en UTC), **conservé** assez longtemps et **protégé**. Comme vu pour Linux, un attaquant qui obtient des droits élevés efface les journaux locaux : il faut les **centraliser** en continu vers un système à part, en écriture seule pour les sources.

La **durée de conservation** se définit selon les besoins de détection, d'investigation et les obligations légales. Les investigations découvrent souvent une intrusion bien après son début : des journaux conservés quelques jours seulement ne permettent pas de remonter à l'origine.

```video
url: https://www.youtube.com/watch?v=9RfsRn7m7OE
title: "What Is SIEM?"
channel: "IBM Technology"
duration: "4:29"
lang: en
why: "Ce qu'est un SIEM et ce qu'il apporte à un SOC, en moins de cinq minutes par IBM Technology."
```

# Les outils de détection

```diagram
type: layers
title: La chaîne de détection
layers:
  - title: Sources
    text: Systèmes, applications, réseau, cloud, outils de sécurité
  - title: Collecte et centralisation
    text: Agents et collecteurs qui envoient les journaux, normalisés, vers un point central
  - title: SIEM
    text: Stockage, corrélation, règles de détection, alertes, tableaux de bord
  - title: SOAR
    text: Automatisation des réponses (enrichissement, tri, actions de confinement)
  - title: Analystes (SOC)
    text: Tri, investigation, décision, amélioration des règles
```

- Le **SIEM** (*Security Information and Event Management*) centralise les journaux, les **corrèle** (relier des événements de sources différentes), applique des **règles de détection** et génère des **alertes**. Exemples : Splunk, Elastic Security, Microsoft Sentinel, Wazuh (open source).
- L'**EDR** (*Endpoint Detection and Response*) surveille finement les **postes et serveurs** (processus, comportements) et permet d'**isoler** une machine à distance. Le **XDR** étend cette approche à plusieurs domaines (postes, réseau, cloud, messagerie) de façon intégrée.
- Le **SOAR** (*Security Orchestration, Automation and Response*) **automatise** les tâches répétitives de réponse (enrichir une alerte, bloquer une adresse, ouvrir un ticket), pour que les analystes se concentrent sur ce qui demande un jugement humain.
- Le **SOC** (*Security Operations Center*) est l'**équipe** (et l'organisation) qui surveille, trie les alertes, investigue et déclenche la réponse, souvent 24 h/24 pour les structures sensibles. Beaucoup d'organisations externalisent tout ou partie du SOC.

# Écrire des détections utiles

Une détection transforme une **hypothèse d'attaque** en une règle qui lève une alerte. Quelques exemples d'idées :

- un compte réussit à se connecter après de **nombreux échecs** (force brute aboutie) ;
- une connexion depuis **deux pays éloignés** en un temps trop court pour un voyage (*voyage impossible*) ;
- la **création d'un compte** administrateur en dehors des procédures ;
- l'**exécution d'outils d'administration** inhabituels sur un poste utilisateur ;
- un **volume de données sortant** anormal vers une destination externe (exfiltration possible) ;
- la **désactivation** de l'antivirus ou l'**effacement** de journaux.

## Détection par signature et par comportement

```diagram
type: compare
title: Deux approches complémentaires
columns:
  - title: Par signature / règle
    tone: blue
    items:
      - Reconnaît un motif connu
      - Précise, peu de faux positifs
      - Aveugle aux attaques nouvelles
  - title: Par comportement / anomalie
    tone: teal
    items:
      - Repère ce qui s'écarte de l'habituel
      - Peut détecter l'inconnu
      - Plus de faux positifs, à régler
```

## Le juste équilibre

> [!WARNING]
> Le principal ennemi de la détection est le **bruit**. Des milliers d'alertes peu pertinentes conduisent à la **fatigue d'alerte** : les analystes finissent par ignorer les alertes, et la vraie passe inaperçue. Mieux vaut **peu** d'alertes **fiables et actionnables** que beaucoup d'alertes vagues.

Pour chaque règle, on vise : une **intention** claire (quelle attaque elle cible), un **faible taux de faux positifs** (ajusté avec des exceptions légitimes), une **sévérité** adaptée, et un **guide d'intervention** (que faire quand elle se déclenche). On **teste** et on **affine** les règles en continu.

# Structurer la détection avec MITRE ATT&CK

**MITRE ATT&CK** est une base de connaissances publique qui décrit les **tactiques** (les objectifs d'un attaquant : accès initial, persistance, élévation de privilèges, exfiltration…) et les **techniques** qu'il emploie pour les atteindre, observées dans des attaques réelles.

Son intérêt pour la défense :

- un **langage commun** pour décrire les attaques et les détections ;
- une **cartographie de couverture** : pour chaque technique pertinente, ai-je une détection ? C'est l'idée de la *matrice de couverture*, parfois visualisée avec l'outil ATT&CK Navigator ;
- une aide à **prioriser** : couvrir d'abord les techniques les plus courantes et les plus utilisées contre son secteur.

Le **renseignement sur les menaces** (*threat intelligence*) complète cette approche : des **indicateurs de compromission** (adresses, empreintes de fichiers, noms de domaine malveillants) et des descriptions des modes opératoires des groupes d'attaquants, diffusés notamment par le CERT-FR, l'ANSSI et des communautés de partage. Ils alimentent les détections et aident à comprendre à qui on a affaire.

# Exercices

## Exercice 1 : Choisir les journaux

Une PME veut pouvoir détecter une intrusion et enquêter dessus, avec un budget limité. Quelles sources de journaux prioriser, et quelle précaution commune ?

<details>
<summary>Voir la solution</summary>

Prioriser : **authentification** (connexions, MFA, échecs), **journaux des contrôleurs de domaine** si Active Directory, **EDR** sur les postes et serveurs, journaux **cloud** (activité d'administration) et **réseau** (DNS, proxy, pare-feu). Précaution commune : **centraliser** ces journaux vers un système distinct, avec un **horodatage cohérent** (UTC) et une **conservation** suffisante, pour qu'un attaquant ne puisse pas les effacer et pour pouvoir remonter dans le temps lors d'une investigation.

</details>

## Exercice 2 : Faux positifs

Une règle « connexion hors des heures de bureau » génère 400 alertes par jour, et l'équipe ne les regarde plus. Comment l'améliorer ?

<details>
<summary>Voir la solution</summary>

Le problème est le **bruit**. Pistes : restreindre la règle aux **comptes sensibles** (administrateurs) ou aux **actions sensibles** plutôt qu'à toute connexion ; **combiner** avec d'autres signaux (lieu inhabituel **et** heure inhabituelle **et** compte privilégié) ; exclure les cas **légitimes** connus (astreintes, équipes en décalage) ; abaisser la **sévérité** si l'événement est seulement « à examiner » ; mesurer le taux de vrais positifs et supprimer la règle si elle n'apporte rien. L'objectif : des alertes peu nombreuses, fiables et actionnables.

</details>

## Exercice 3 : ATT&CK pour prioriser

Votre direction demande « sommes-nous capables de détecter une attaque par rançongiciel ? ». Comment MITRE ATT&CK aide-t-il à répondre ?

<details>
<summary>Voir la solution</summary>

Identifier les **techniques** typiquement employées dans ce type d'attaque (accès initial par hameçonnage ou service exposé, élévation de privilèges, mouvement latéral, désactivation des sauvegardes et de l'antivirus, chiffrement massif de fichiers), puis dresser une **matrice de couverture** : pour chaque technique, dispose-t-on d'une détection et d'un journal la rendant possible ? Les cases non couvertes montrent précisément où investir (nouvelles règles, nouvelles sources de journaux). On priorise les techniques les plus fréquentes et celles ciblant son secteur.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Détection : journaux, SIEM, SOC"
center: Collecter les bonnes traces, les corréler et alerter de façon fiable pour repérer l'attaque au plus tôt.
points:
  - icon: eye
    title: Collecter
    text: Authentification, systèmes, réseau, cloud, sécurité ; centralisés, horodatés, protégés.
  - icon: server
    title: Les outils
    text: SIEM corrèle, EDR/XDR surveille et isole, SOAR automatise, le SOC analyse.
  - icon: alert
    title: Détections utiles
    text: Signature et comportement ; peu d'alertes fiables plutôt que beaucoup de bruit.
  - icon: list
    title: MITRE ATT&CK
    text: Tactiques et techniques réelles ; cartographier sa couverture et prioriser.
  - icon: compass
    title: Renseignement
    text: Indicateurs et modes opératoires (CERT-FR, ANSSI) alimentent les détections.
pitfall: Noyer les analystes sous des alertes vagues jusqu'à ce que la vraie passe inaperçue.
remember: On ne détecte que ce qu'on journalise, et une alerte n'a de valeur que si elle est actionnable.
```
