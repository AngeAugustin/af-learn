---
title: DevSecOps et sécurité de la chaîne logicielle
description: Intégrer la sécurité dans le pipeline (SAST, SCA, secrets, DAST, IaC), sécuriser la chaîne d'approvisionnement logicielle (dépendances, SBOM, signature, provenance) et le pipeline CI/CD lui-même.
duration: 50
objectives:
  - Intégrer les contrôles de sécurité dans un pipeline CI/CD
  - Comprendre les menaces sur la chaîne d'approvisionnement logicielle
  - Utiliser SBOM, signature et provenance pour la traçabilité
  - Sécuriser le pipeline CI/CD lui-même
---

# Le DevSecOps

Le **DevSecOps** intègre la sécurité **dans** le flux de développement et de déploiement (DevOps), de façon **automatisée** et au plus tôt (*shift left*, module 5), plutôt que comme un contrôle final qui bloque tout. L'idée : faire de la sécurité l'affaire de **toute l'équipe**, outillée pour détecter les problèmes pendant qu'ils sont faciles à corriger.

```diagram
type: flow
title: Les contrôles de sécurité dans le pipeline
steps:
  - title: Développement
    text: Analyse dans l'éditeur, pré-commit (secrets, lint)
    tone: blue
  - title: Intégration
    text: SAST, SCA, scan IaC et images, à chaque pull request
    tone: amber
  - title: Recette
    text: DAST sur l'application en fonctionnement
    tone: amber
  - title: Déploiement
    text: Signature des artefacts, politiques d'admission
    tone: teal
  - title: Production
    text: Supervision, posture (CSPM), gestion des vulnérabilités
    tone: teal
```

## Les familles d'outils

| Type | Analyse | Exemples |
|---|---|---|
| **SAST** | Le code source, sans l'exécuter | Semgrep, CodeQL, SonarQube |
| **SCA** | Les dépendances et leurs vulnérabilités | Dependabot, Renovate, Trivy, OWASP Dependency-Check |
| **Détection de secrets** | Clés et mots de passe dans le code | Gitleaks, detect-secrets |
| **Scan IaC** | Les configurations d'infrastructure | Checkov, tfsec, KICS |
| **Scan d'images** | Les conteneurs | Trivy, Grype |
| **DAST** | L'application en fonctionnement | OWASP ZAP |

> [!TIP]
> Commencez par les contrôles à **fort rapport valeur/bruit** : détection de secrets (toujours), SCA des dépendances, et un SAST ciblé. Introduisez-les en **avertissement** d'abord, le temps de traiter l'existant, avant de les rendre **bloquants**, sinon l'équipe les contourne. Chaque alerte doit être **triable** (faux positifs gérés) pour éviter la fatigue.

# La chaîne d'approvisionnement logicielle

Une application moderne n'est pas seulement le code que vous écrivez : c'est aussi toutes ses **dépendances**, les **outils** qui la construisent, les **images** de base, les **actions** de CI… Un attaquant peut compromettre n'importe lequel de ces maillons pour vous atteindre **indirectement** : c'est l'**attaque sur la chaîne d'approvisionnement**.

Des incidents marquants (une mise à jour piégée d'un logiciel de supervision diffusée à des milliers de clients ; des bibliothèques open source très populaires compromises par un mainteneur malveillant ou un compte piraté) ont montré l'ampleur du risque : un seul maillon compromis touche tous ceux qui en dépendent.

```diagram
type: layers
title: Les maillons de la chaîne
layers:
  - title: Dépendances
    text: Bibliothèques tierces et leurs propres dépendances (transitives)
  - title: Outils de build
    text: Compilateurs, gestionnaires de paquets, actions de CI
  - title: Images de base
    text: Images de conteneurs et systèmes de base
  - title: Artefacts et distribution
    text: Paquets publiés, registres, mécanismes de mise à jour
```

## Les défenses

- **Maîtriser les dépendances** : fichiers de **verrouillage** (installations reproductibles), épingler les versions, vérifier les **empreintes** (hachage) quand c'est possible, limiter le nombre de dépendances, préférer des bibliothèques **maintenues** et largement utilisées.
- **Se méfier des pièges** : le **typosquattage** (un paquet au nom très proche d'un paquet légitime), les paquets récemment compromis, d'où l'intérêt des outils de SCA qui alertent vite.
- **SBOM** (*Software Bill of Materials*) : une **nomenclature** listant tous les composants d'un logiciel et leurs versions (formats CycloneDX, SPDX). Elle permet, quand une vulnérabilité est publiée, de savoir **immédiatement** si et où l'on est concerné. Elle est de plus en plus **exigée** (réglementations, exigences clients).
- **Signature et provenance** : **signer** les artefacts produits (images, paquets) pour garantir leur origine, et attester **comment** ils ont été construits. Des projets comme **Sigstore** (signature simplifiée) et le cadre **SLSA** (*Supply-chain Levels for Software Artifacts*) structurent cette démarche. À la réception, on **vérifie** signatures et provenance avant de déployer (politiques d'admission).
- **Mises à jour** : les appliquer régulièrement **tout en** les vérifiant, une mise à jour est aussi un vecteur potentiel. L'équilibre se trouve dans la surveillance (SCA, avis de sécurité) et des canaux de confiance.

# Sécuriser le pipeline CI/CD lui-même

Le pipeline de CI/CD est une **cible de choix** : il a souvent accès au code, aux secrets de déploiement et à la production. Le compromettre permet d'injecter du code malveillant dans **tout** ce qui est livré.

- **Secrets** : stockés dans le coffre de la forge ou un gestionnaire externe, injectés à l'exécution, **jamais** affichés dans les journaux ; préférer la **fédération d'identité** (jetons temporaires) aux clés permanentes.
- **Moindre privilège** des tâches de CI : des permissions minimales, limitées au dépôt et aux ressources nécessaires ; des **jetons** de portée réduite et de courte durée.
- **Épingler les actions et images** de CI à une **version précise** (idéalement par empreinte), car une action tierce mise à jour peut devenir malveillante.
- **Protéger les branches** : revue obligatoire, interdiction de pousser directement en production, historique protégé.
- **Isoler** les exécutions (runners éphémères), surtout pour les contributions externes (pull requests de dépôts publics), qui ne doivent pas accéder aux secrets.
- **Journaliser et superviser** l'activité du pipeline comme un système sensible.

> [!IMPORTANT]
> Un pipeline qui déploie en production avec des droits étendus est, de fait, un **système de production**. Il mérite le même niveau de protection que les serveurs qu'il met à jour : moindre privilège, MFA, journalisation, revue des accès.

# Exercices

## Exercice 1 : Prioriser les contrôles

Une équipe sans aucune automatisation de sécurité veut introduire des contrôles dans sa CI sans bloquer tout le monde du jour au lendemain. Proposez un ordre d'introduction.

<details>
<summary>Voir la solution</summary>

1. **Détection de secrets** (pré-commit et CI) : évite des fuites graves, peu de faux positifs, à rendre **bloquant** rapidement.
2. **SCA** des dépendances : fort impact, démarrer en **avertissement**, corriger les vulnérabilités critiques, puis bloquer les nouvelles.
3. **Scan IaC** et **scan d'images** si concernés.
4. **SAST** ciblé sur les règles à forte valeur (injections, secrets, désérialisation), en avertissement d'abord.
5. **DAST** en recette, plus tard.

Chaque étape : traiter l'existant en mode avertissement, gérer les faux positifs, puis rendre bloquant.

</details>

## Exercice 2 : Une dépendance compromise

Un avis signale qu'une version d'une bibliothèque que vous utilisez a été compromise et exfiltrait des données. Comment savoir si vous êtes concerné, et que faites-vous ?

<details>
<summary>Voir la solution</summary>

1. **Consulter le SBOM** (ou le fichier de verrouillage) pour savoir **immédiatement** si cette version (y compris en dépendance transitive) est présente, et où.
2. Si oui : **mettre à jour** vers une version saine ou **retirer** la dépendance ; reconstruire et redéployer.
3. Traiter comme un **incident** : analyser si la version compromise a réellement tourné et ce qu'elle a pu exfiltrer, **changer les secrets** potentiellement exposés, vérifier les journaux.
4. Renforcer : SCA avec alertes rapides, épinglage des versions, vérification des empreintes.

</details>

## Exercice 3 : Pipeline exposé

Dans un projet, les pull requests venant de l'extérieur (dépôt public) exécutent la CI avec accès aux secrets de déploiement, et les actions tierces sont référencées par une étiquette mobile (`@v1`). Quels risques et corrections ?

<details>
<summary>Voir la solution</summary>

Risques : une pull request externe malveillante peut exécuter du code qui **vole les secrets** de déploiement ; une action tierce en `@v1` peut être **modifiée** par son auteur (ou son compte piraté) et devenir malveillante sans que vous changiez quoi que ce soit. Corrections : **ne pas exposer les secrets** aux workflows déclenchés par des pull requests externes (runners isolés, workflows séparés, approbation manuelle) ; **épingler** les actions à une empreinte de commit précise ; appliquer le **moindre privilège** aux jetons de CI ; superviser l'activité du pipeline.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: DevSecOps et chaîne logicielle
center: Automatiser la sécurité dans le pipeline et se méfier de tout ce qu'on ne construit pas soi-même.
points:
  - icon: test
    title: Contrôles automatisés
    text: Secrets, SCA, SAST, scan IaC et images, DAST ; en avertissement puis bloquant.
  - icon: puzzle
    title: Chaîne d'approvisionnement
    text: Dépendances, outils, images, distribution ; un maillon compromis touche tous les autres.
  - icon: book
    title: SBOM
    text: La nomenclature des composants ; savoir en un instant si une faille vous concerne.
  - icon: check
    title: Signer et vérifier
    text: Sigstore, SLSA ; signature et provenance des artefacts, vérifiées avant déploiement.
  - icon: lock
    title: Protéger le pipeline
    text: Secrets au coffre, moindre privilège, actions épinglées, branches protégées, runners isolés.
pitfall: Exposer les secrets de déploiement aux pull requests externes, ou référencer une action tierce par une étiquette mobile.
remember: Un pipeline qui déploie en production est un système de production ; protégez-le comme tel.
```
