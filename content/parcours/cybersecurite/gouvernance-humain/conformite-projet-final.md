---
title: Conformité et projet final
description: Le paysage réglementaire (RGPD, NIS 2, DORA, Cyber Resilience Act, ISO 27001), articuler conformité et sécurité réelle, puis un projet final de sécurisation d'une PME de bout en bout.
duration: 80
objectives:
  - Situer les principales réglementations de cybersécurité
  - Distinguer conformité et sécurité réelle, et les articuler
  - Mener une démarche de sécurisation complète d'une organisation
  - Présenter et justifier ses choix de sécurité
---

# Le paysage réglementaire

La cybersécurité est de plus en plus **encadrée par la loi**, ce qui en fait un sujet de direction et pas seulement technique. Les principaux textes à connaître :

| Texte | Qui / quoi | En bref |
|---|---|---|
| **RGPD** | Toute organisation traitant des données personnelles | Protection des données, droits des personnes, notification des violations (module 3 de Data Engineering et module 7) |
| **NIS 2** | « Entités essentielles et importantes » de nombreux secteurs | Mesures de sécurité et notification d'incidents ; élargit fortement le périmètre de NIS 1 |
| **DORA** | Secteur financier dans l'UE | Résilience opérationnelle numérique, gestion du risque lié aux prestataires informatiques |
| **Cyber Resilience Act (CRA)** | Fabricants de produits avec composants numériques dans l'UE | Exigences de sécurité « par conception », gestion des vulnérabilités sur la durée de vie du produit |
| **Règlement européen sur l'IA** (*AI Act*) | Fournisseurs et utilisateurs professionnels de systèmes d'IA dans l'UE | Obligations graduées selon le niveau de risque ; les systèmes à haut risque doivent notamment être robustes et sécurisés (module 5) |
| **ISO/IEC 27001** | Volontaire, toute organisation | Certification d'un système de management de la sécurité (module 1) |
| **Directive, référentiels sectoriels** | Santé, OIV/OSE, etc. | Obligations spécifiques |

> [!NOTE]
> Les **dates d'application** et la transposition nationale de ces textes évoluent (NIS 2, CRA et le règlement sur l'IA sont récents et se déploient progressivement). Pour une organisation donnée, il faut identifier **lesquels s'appliquent** et **à quelle échéance**, en s'appuyant sur les ressources de l'ANSSI et, si besoin, un conseil juridique. L'important ici est de connaître leur **existence** et leur **esprit**.

# Conformité et sécurité ne sont pas synonymes

```diagram
type: compare
title: Deux objectifs liés mais distincts
columns:
  - title: Conformité
    tone: blue
    items:
      - Respecter des exigences formelles
      - Démontrable, auditable
      - Un instantané à une date
  - title: Sécurité réelle
    tone: teal
    items:
      - Résister réellement aux attaques
      - Se mesure face à la menace
      - Un état continu
```

Une organisation peut être **conforme sur le papier** et **vulnérable en pratique** (cases cochées sans mesures efficaces), ou au contraire **bien protégée** sans certification formelle. Les deux ne s'opposent pas : la conformité **structure** la démarche, impose un socle et engage la direction ; la sécurité réelle lui donne du **sens**.

> [!IMPORTANT]
> Le piège de la conformité est le « théâtre de sécurité » : des mesures visibles et documentées qui rassurent les auditeurs mais ne réduisent pas le risque. Utilisez les référentiels comme **guides** vers une protection réelle, pas comme une liste de cases à cocher. La question à se poser pour chaque mesure : « contre quelle attaque me protège-t-elle concrètement ? »

# Synthèse : une démarche de sécurité cohérente

Ce parcours a parcouru les grands domaines. Voici comment ils s'articulent en une démarche d'ensemble, du plus fondamental au plus avancé :

```diagram
type: layers
title: Une démarche de sécurité, du socle au pilotage
layers:
  - title: Gouvernance
    text: Risques, conformité, politique, implication de la direction
  - title: Protection
    text: Durcissement, identités et MFA, cryptographie, sécurité applicative, cloud
  - title: Détection et réponse
    text: Journalisation, SIEM, SOC, plan de réponse, sauvegardes testées
  - title: Amélioration continue
    text: Gestion des vulnérabilités, audits, sensibilisation, retours d'expérience
```

Aucune mesure isolée ne suffit : c'est la **cohérence** de l'ensemble, en défense en profondeur, qui protège. Et tout repose sur des **fondamentaux** bien appliqués (inventaire, mises à jour, MFA, sauvegardes, moindre privilège) avant les dispositifs avancés.

# Projet final : sécuriser une PME

## Le contexte

Vous êtes la première personne en charge de la sécurité d'une PME de **120 salariés** (services, données clients sensibles). L'existant : un Active Directory, des postes Windows, quelques serveurs internes, une application web clients hébergée dans le cloud, une messagerie en ligne, pas de MFA généralisée, des sauvegardes non testées, aucune démarche formelle. La direction a pris conscience du risque après une alerte dans le secteur et vous demande un **plan sur 12 mois**.

## Le livrable attendu

Un dossier structuré et une présentation à la direction comprenant :

1. **Analyse de risques** simplifiée (méthode inspirée d'EBIOS RM) : valeurs métier, scénarios redoutés (rançongiciel, fraude au virement, fuite de données clients), évaluation et priorisation.
2. **Inventaire** des actifs et de la surface d'attaque, et identification des **réglementations applicables** (RGPD au minimum ; NIS 2 à vérifier selon le secteur).
3. **Plan de mesures** priorisé en trois horizons :
   - **socle urgent** (0–3 mois) : MFA partout, sauvegardes 3-2-1 testées et hors ligne, mises à jour, inventaire, comptes d'administration séparés, durcissement de base, sensibilisation initiale ;
   - **consolidation** (3–9 mois) : segmentation réseau, journalisation centralisée et détection, gestion des vulnérabilités, sécurité de l'application web (OWASP), modèle d'administration en tiers pour l'AD, politique de mots de passe et de secrets ;
   - **maturité** (9–12 mois) : plan de réponse à incident et exercice, audit ou test d'intrusion de l'application, politique de divulgation, programme de sensibilisation continu, début de démarche de conformité.
4. **Budget et ressources** estimés, et **indicateurs** de suivi (couverture MFA, délai de correction des vulnérabilités, taux de signalement d'hameçonnage, restaurations testées).
5. **Plan de réponse** aux deux scénarios majeurs (rançongiciel, fraude au virement), avec rôles et procédures.

## La grille d'évaluation

| Critère | Ce qui est attendu |
|---|---|
| **Priorisation par le risque** | Les mesures à fort impact et faible coût d'abord (fondamentaux) |
| **Défense en profondeur** | Des barrières à plusieurs niveaux, pas une seule |
| **Réalisme** | Adapté à une PME de 120 personnes (budget, compétences, progressivité) |
| **Couverture** | Gouvernance, protection, détection/réponse, humain, conformité |
| **Mesure** | Des indicateurs pour piloter et démontrer les progrès |
| **Communication** | Un discours clair et honnête pour la direction, sans jargon inutile |

> [!TIP]
> Résistez à la tentation du « tout, tout de suite » et des outils à la mode. Une PME gagne bien plus à **généraliser la MFA, tester ses sauvegardes et appliquer ses mises à jour** qu'à acheter une plateforme sophistiquée qu'elle ne saura pas exploiter. Les fondamentaux, d'abord et partout.

# Exercices

## Exercice 1 : Réglementations applicables

Pour la PME du projet (services, données clients, application cloud), quelles réglementations vérifier en priorité, et pourquoi ?

<details>
<summary>Voir la solution</summary>

- **RGPD** : certain, dès lors qu'il y a des données clients (personnelles). Obligations de protection, de notification des violations, de registre des traitements, de durées de conservation.
- **NIS 2** : à **vérifier** selon le secteur d'activité et la taille, son périmètre est large depuis la révision. Si l'entreprise est concernée (entité essentielle ou importante), obligations de mesures et de notification à l'ANSSI.
- Selon l'activité et les clients : exigences **sectorielles** ou **contractuelles** (par exemple si elle fournit des acteurs financiers soumis à DORA, ou si elle vend des produits numériques visés par le CRA).

Démarche : identifier le statut précis avec l'appui de l'ANSSI et d'un conseil juridique, puis intégrer les obligations au plan.

</details>

## Exercice 2 : Les 90 premiers jours

La direction veut « des résultats rapides ». Quelles 5 mesures mettriez-vous en œuvre en priorité dans les 3 premiers mois, et pourquoi celles-là ?

<details>
<summary>Voir la solution</summary>

1. **MFA résistante à l'hameçonnage** partout (surtout messagerie, accès distants, administration) : bloque la majorité des attaques par mot de passe volé.
2. **Sauvegardes 3-2-1 testées et hors ligne** : seule vraie protection contre le rançongiciel.
3. **Mises à jour** et correction des vulnérabilités critiques exposées : ferme les portes les plus utilisées.
4. **Comptes d'administration séparés** et réduction des droits d'administrateur : limite l'impact d'une compromission.
5. **Procédure anti-fraude au virement** (double validation, contre-appel) et **sensibilisation** initiale : traite les deux scénarios les plus probables.

Ces mesures sont à fort impact, faible coût, et traitent directement les scénarios redoutés.

</details>

## Exercice 3 : Conformité ou sécurité ?

La direction propose de « payer un prestataire pour cocher les cases d'un référentiel et obtenir une attestation, ça suffira ». Que répondez-vous ?

<details>
<summary>Voir la solution</summary>

Une attestation rassure et peut être exigée commercialement, mais **cocher des cases ne protège pas** : on peut être « conforme » et se faire chiffrer par un rançongiciel. Proposer d'utiliser le référentiel comme **guide** vers des mesures **réellement efficaces** (fondamentaux d'abord), de vérifier leur efficacité (tests de restauration, audit, simulations), et de mesurer le risque réel : tout en documentant pour la conformité. Conformité et sécurité se construisent **ensemble** : la première structure et engage, la seconde protège vraiment.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Conformité et projet final
center: Articuler obligations légales et protection réelle, dans une démarche cohérente fondée sur les fondamentaux.
points:
  - icon: scale
    title: Réglementations
    text: RGPD, NIS 2, DORA, Cyber Resilience Act, ISO 27001 ; identifier ce qui s'applique.
  - icon: eye
    title: Conformité ≠ sécurité
    text: Être conforme n'est pas être protégé ; les référentiels guident, ne cochent pas.
  - icon: layers
    title: Démarche d'ensemble
    text: Gouvernance, protection, détection et réponse, amélioration continue.
  - icon: rocket
    title: Projet
    text: Analyse de risques, inventaire, plan priorisé sur 12 mois, budget, indicateurs.
  - icon: target
    title: Priorité
    text: "MFA, sauvegardes testées, mises à jour, moindre privilège : avant les outils avancés."
pitfall: "Le « théâtre de sécurité » : des mesures qui rassurent les auditeurs sans réduire le risque."
remember: Les fondamentaux bien appliqués partout protègent plus que n'importe quel outil sophistiqué mal exploité.
```
