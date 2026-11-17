---
title: La gestion des vulnérabilités
description: Comprendre les vulnérabilités (CVE, CVSS, EPSS, KEV), les détecter par le scan et l'inventaire, puis les prioriser et les corriger dans un processus continu.
duration: 55
objectives:
  - Lire une CVE et interpréter un score CVSS
  - Prioriser avec l'exploitabilité (EPSS) et les failles activement exploitées (KEV)
  - Mettre en place un scan de vulnérabilités et un inventaire des actifs
  - Organiser un cycle de correction et de gestion des correctifs
---

# Qu'est-ce qu'une vulnérabilité ?

Une **vulnérabilité** est une faiblesse d'un système (logiciel, configuration, conception) qu'un attaquant pourrait exploiter pour porter atteinte à la sécurité. La **gestion des vulnérabilités** est le processus **continu** qui consiste à les **identifier**, les **évaluer**, les **prioriser**, les **corriger** et **vérifier** la correction, puis à recommencer, car de nouvelles vulnérabilités apparaissent chaque jour.

Ce n'est pas un projet ponctuel : les logiciels évoluent, de nouvelles failles sont publiées, le système change. C'est une **boucle** qui tourne en permanence.

```diagram
type: flow
title: Le cycle de gestion des vulnérabilités
loop: La boucle tourne en continu, de nouvelles vulnérabilités apparaissant chaque jour
steps:
  - title: Inventorier
    text: Connaître ses actifs et ses logiciels
    tone: blue
  - title: Détecter
    text: Scanner, suivre les avis de sécurité
    tone: amber
  - title: Prioriser
    text: Gravité, exploitabilité, exposition, criticité
    tone: amber
  - title: Corriger
    text: Correctif, contournement ou acceptation documentée
    tone: teal
  - title: Vérifier
    text: Confirmer que la faille est bien traitée
    tone: teal
```

# Nommer et mesurer les vulnérabilités

## Les CVE

Une **CVE** (*Common Vulnerabilities and Exposures*) est un **identifiant unique** attribué à une vulnérabilité publiquement connue, de la forme `CVE-2024-12345`. Ce système, coordonné par MITRE, permet à tout le monde de parler de **la même** faille. Chaque CVE renvoie à une description, aux produits et versions affectés, et souvent à un correctif.

Des bases enrichissent ces données : la **NVD** (*National Vulnerability Database* du NIST) aux États-Unis, et en Europe la base **EUVD** de l'ENISA. Les éditeurs publient leurs propres **avis de sécurité**, et le **CERT-FR** relaie les plus importants pour la France.

## Le score CVSS

Le **CVSS** (*Common Vulnerability Scoring System*, version 4.0 depuis 2023) attribue à une vulnérabilité une **note de gravité** de 0 à 10, calculée à partir de caractéristiques techniques :

- comment la faille est atteignable (par le réseau ? localement ?) ;
- la **complexité** de l'exploitation ;
- les **privilèges** et l'**interaction utilisateur** nécessaires ;
- l'**impact** sur la confidentialité, l'intégrité et la disponibilité.

| Score | Niveau |
|---|---|
| 9,0 – 10,0 | Critique |
| 7,0 – 8,9 | Élevé |
| 4,0 – 6,9 | Moyen |
| 0,1 – 3,9 | Faible |

> [!WARNING]
> Le CVSS mesure une **gravité potentielle**, pas un **risque** pour *votre* organisation. Une faille critique sur un logiciel que vous n'exposez pas, ou protégé par d'autres barrières, peut être moins urgente qu'une faille « moyenne » sur un service exposé sur Internet. Ne corrigez pas « par score » sans tenir compte de votre contexte.

## Prioriser avec l'exploitabilité réelle

Le nombre de vulnérabilités dépasse toujours la capacité à toutes les corriger immédiatement. Deux sources aident à prioriser ce qui compte vraiment :

- l'**EPSS** (*Exploit Prediction Scoring System*, publié par le FIRST) estime la **probabilité** qu'une vulnérabilité soit exploitée dans les 30 jours. Une faille très grave mais jamais exploitée dans la nature est souvent moins urgente qu'une faille moyenne activement exploitée ;
- le catalogue **KEV** (*Known Exploited Vulnerabilities*) de l'agence américaine CISA recense les vulnérabilités **effectivement exploitées** observées sur le terrain. Une faille qui y figure doit être traitée **en priorité absolue**.

```diagram
type: compare
title: Trois regards complémentaires
columns:
  - title: CVSS
    tone: blue
    items:
      - Gravité technique potentielle
      - De 0 à 10
      - Point de départ, pas verdict
  - title: EPSS
    tone: amber
    items:
      - Probabilité d'exploitation à 30 jours
      - Ce qui risque d'arriver
      - Aide à trier le volume
  - title: KEV
    tone: rose
    items:
      - Failles déjà exploitées sur le terrain
      - Ce qui arrive vraiment
      - Priorité absolue
```

```video
url: https://www.youtube.com/watch?v=oSyEGkX6sX0
title: "CVE and CVSS explained | Security Detail"
channel: "Red Hat"
duration: "3:45"
lang: en
why: "Red Hat explique en moins de quatre minutes la différence entre un identifiant CVE et un score CVSS."
```

# Détecter : scan et inventaire

## L'inventaire, condition préalable

On ne peut pas protéger ce qu'on ne connaît pas. Un **inventaire** tenu à jour des actifs (serveurs, postes, applications, services exposés, bibliothèques utilisées) est le socle de toute gestion des vulnérabilités. Les **actifs oubliés** (un serveur de test laissé en ligne, une ancienne application) sont justement ceux que personne ne met à jour, et donc des cibles de choix.

## Le scan de vulnérabilités

Un **scanner de vulnérabilités** compare automatiquement les versions et configurations détectées à une base de failles connues, et produit un rapport. On distingue :

- le scan **réseau / infrastructure** (OpenVAS/Greenbone, Nessus, Qualys…) : il identifie les services exposés et leurs failles connues ;
- le scan **applicatif (DAST)** sur une application en fonctionnement (OWASP ZAP…) ;
- l'analyse des **dépendances (SCA)** du code (module 5 : `npm audit`, `pip-audit`, Trivy, Dependency-Check…) ;
- l'analyse **statique du code (SAST)**.

> [!NOTE]
> Un scanner produit des **faux positifs** (failles signalées qui n'en sont pas) et des **faux négatifs** (failles réelles manquées). Ses résultats se **vérifient** et se contextualisent ; un scan n'est pas un audit, mais c'est un outil indispensable de surveillance continue. Lancer un scan actif ne se fait que sur **ses propres** systèmes ou dans un périmètre autorisé (module 1).

# Corriger : la gestion des correctifs

La correction prend plusieurs formes :

- appliquer un **correctif** (*patch*) de l'éditeur : la voie normale ;
- mettre en place un **contournement** (*workaround*) temporaire quand aucun correctif n'existe encore (désactiver une fonction, ajouter un filtre, isoler le service) ;
- **accepter** le risque de façon documentée, par décision de la direction, quand la correction est impossible ou disproportionnée (module 1).

## Organiser les délais

On fixe des **délais de correction** selon la priorité et l'exposition. Un exemple de politique :

| Priorité | Exposé sur Internet | Interne |
|---|---|---|
| Critique ou présente dans le KEV | 48 h – 7 jours | 15 jours |
| Élevée | 15 jours | 30 jours |
| Moyenne | 30 – 60 jours | 90 jours |
| Faible | Au fil des mises à jour | Au fil des mises à jour |

```diagram
type: decision
title: Que faire d'une vulnérabilité détectée ?
nodes:
  - question: Un correctif de l'éditeur est-il disponible ?
    yes: Le tester puis le déployer dans le délai fixé par la priorité
    no: Question suivante
  - question: Un contournement permet-il de réduire le risque ?
    yes: L'appliquer en attendant le correctif, et suivre la faille
    no: Question suivante
  - question: Le risque résiduel est-il acceptable et assumé par la direction ?
    yes: L'accepter et le documenter dans le registre des risques
    no: Isoler ou retirer le service vulnérable
```

## Les bonnes pratiques de déploiement

- **Tester** les correctifs sur un environnement de recette avant la production (un correctif peut casser une fonctionnalité).
- **Automatiser** les mises à jour là où c'est raisonnable (postes, dépendances), planifier les redémarrages.
- Traiter en **priorité** ce qui est exposé sur Internet et ce qui figure au KEV.
- **Vérifier** après coup que la correction est effective (nouveau scan, test ciblé).
- **Mesurer** le processus : nombre de vulnérabilités ouvertes par priorité, délai moyen de correction, respect des délais. Ces indicateurs montrent si la dette de sécurité se réduit ou s'accumule.

> [!IMPORTANT]
> Beaucoup d'attaques majeures ont exploité une vulnérabilité pour laquelle un **correctif existait depuis des mois**. La gestion des correctifs, peu spectaculaire, est l'une des mesures de sécurité les plus efficaces qui soient.

# Exercices

## Exercice 1 : Prioriser

Vous avez trois vulnérabilités ouvertes. Classez-les par ordre de traitement :

1. CVSS 9,8 sur une bibliothèque présente uniquement dans un outil interne accessible à 3 administrateurs, non exploitée dans la nature.
2. CVSS 6,5 sur votre serveur web exposé sur Internet, **présente dans le catalogue KEV**.
3. CVSS 8,1 sur un service interne, EPSS faible, aucun correctif disponible mais un contournement existe.

<details>
<summary>Voir la solution</summary>

1. **La n°2 d'abord** : exposée sur Internet **et** activement exploitée (KEV), priorité absolue malgré un CVSS « seulement » moyen.
2. **La n°3 ensuite** : CVSS élevé, mais interne et peu exploitée ; appliquer immédiatement le **contournement**, puis le correctif dès sa parution.
3. **La n°1 enfin** : CVSS très élevé mais surface d'exposition minime (3 administrateurs, interne) et pas d'exploitation connue ; à corriger dans le délai prévu, sans urgence absolue.

Ce classement illustre que le **contexte** (exposition, exploitation réelle) prime sur le seul score CVSS.

</details>

## Exercice 2 : L'actif oublié

Un scan révèle un serveur `vieux-test.exemple.fr`, exposé sur Internet, non mis à jour depuis deux ans, que personne ne semble connaître. Que faites-vous ?

<details>
<summary>Voir la solution</summary>

1. **Identifier** le propriétaire et l'usage réel (est-il encore utile ?).
2. S'il est inutile : le **retirer** d'Internet et le **décommissionner** proprement, c'est la meilleure correction, elle supprime d'un coup toutes ses vulnérabilités.
3. S'il est utile : l'intégrer à l'**inventaire**, le mettre à jour, le durcir, le superviser.
4. Vérifier dans les journaux s'il a déjà été **compromis** (deux ans sans mise à jour, exposé : le risque est réel).
5. Améliorer le processus d'**inventaire** pour qu'un actif exposé ne soit plus jamais inconnu.

</details>

## Exercice 3 : Mesurer le processus

Votre direction demande si « la sécurité s'améliore ». Quels indicateurs de gestion des vulnérabilités proposez-vous ?

<details>
<summary>Voir la solution</summary>

- Nombre de vulnérabilités **ouvertes** par priorité, et son évolution dans le temps.
- **Délai moyen de correction** par priorité, et **taux de respect** des délais fixés.
- Nombre de vulnérabilités du **KEV** présentes, et temps pour les éliminer.
- **Couverture** de l'inventaire et des scans (part du parc réellement suivie).
- Âge des vulnérabilités les plus anciennes encore ouvertes (la « dette » de sécurité).

Une tendance à la baisse du nombre et de l'âge des failles ouvertes, surtout critiques et exposées, indique une amélioration réelle.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: La gestion des vulnérabilités
center: "Un cycle continu : inventorier, détecter, prioriser selon le contexte, corriger et vérifier."
points:
  - icon: book
    title: CVE
    text: Un identifiant unique par faille connue ; NVD, EUVD, avis des éditeurs, CERT-FR.
  - icon: gauge
    title: CVSS
    text: Gravité potentielle de 0 à 10 ; un point de départ, pas le risque pour vous.
  - icon: target
    title: EPSS et KEV
    text: Probabilité d'exploitation et failles déjà exploitées ; le KEV passe en priorité absolue.
  - icon: search
    title: Détecter
    text: Inventaire d'abord, puis scans réseau, applicatifs et des dépendances, à vérifier.
  - icon: loop
    title: Corriger
    text: Correctif, contournement ou acceptation ; délais selon priorité et exposition.
pitfall: Corriger « par score » CVSS sans tenir compte de l'exposition réelle ni de l'exploitation observée.
remember: Beaucoup d'attaques exploitent une faille dont le correctif existait depuis des mois.
```
