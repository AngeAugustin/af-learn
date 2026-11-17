---
title: La gestion des risques et les référentiels
description: Évaluer et traiter un risque, tenir un registre, les méthodes et référentiels (EBIOS Risk Manager, ISO/IEC 27001, NIST CSF 2.0, guide d'hygiène de l'ANSSI) et la continuité d'activité.
duration: 50
objectives:
  - Évaluer un risque selon sa vraisemblance et sa gravité
  - Choisir une option de traitement et tenir un registre des risques
  - Situer EBIOS RM, ISO/IEC 27001 et le NIST CSF
  - Définir des objectifs de continuité (RTO, RPO)
---

# Qu'est-ce qu'un risque ?

Un **risque** de sécurité est la possibilité qu'une **menace** exploite une **vulnérabilité** pour porter atteinte à un **bien** (données, service, réputation), avec un **impact** pour l'organisation.

- **Bien** (actif) : ce qui a de la valeur (fichier clients, site de commande, chaîne de production).
- **Menace** : ce qui peut causer un dommage (rançongiciel, employé malveillant, panne électrique).
- **Vulnérabilité** : une faiblesse exploitable (logiciel non mis à jour, absence de MFA, sauvegarde non testée).

On l'évalue selon deux axes :

- la **vraisemblance** : quelle est la probabilité que le scénario se produise ?
- la **gravité** (ou impact) : quelles conséquences s'il se produit ? (financières, juridiques, humaines, réputation)

```diagram
type: compare
title: Une échelle simple sur 4 niveaux
columns:
  - title: Vraisemblance
    tone: blue
    items:
      - "1 : Peu vraisemblable"
      - "2 : Vraisemblable"
      - "3 : Très vraisemblable"
      - "4 : Quasi certain"
  - title: Gravité
    tone: rose
    items:
      - "1 : Mineure (gêne)"
      - "2 : Significative (perturbation)"
      - "3 : Grave (perte importante)"
      - "4 : Critique (survie de l'activité)"
```

Le croisement des deux (matrice des risques) permet de **prioriser** : un risque très vraisemblable et grave passe avant un risque peu vraisemblable et mineur.

# Traiter les risques

Pour chaque risque, quatre options :

| Option | Principe | Exemple |
|---|---|---|
| **Réduire** | Mettre en place des mesures qui diminuent vraisemblance ou gravité | MFA, sauvegardes hors ligne, mises à jour |
| **Transférer** | Faire porter une partie de l'impact par un tiers | Assurance cyber, sous-traitance contractuelle |
| **Éviter** | Supprimer l'activité ou le bien à l'origine du risque | Ne plus conserver les numéros de carte bancaire |
| **Accepter** | Assumer consciemment le risque résiduel | Risque mineur dont la réduction coûterait plus cher que l'impact |

> [!IMPORTANT]
> Accepter un risque est une **décision de la direction**, documentée, pas une absence de décision. Un risque « oublié » n'est pas un risque accepté.

Le **registre des risques** consigne pour chacun : le scénario, le bien concerné, la vraisemblance et la gravité, l'option de traitement, les mesures, le responsable, l'échéance et le risque **résiduel** après mesures. On le revoit régulièrement : les menaces, le système et l'activité évoluent.

```video
url: https://www.youtube.com/watch?v=_c2L4z-v06g
title: "Risky Business: Strengthening Cybersecurity with Risk Analysis"
channel: "IBM Technology"
duration: "11:21"
lang: en
why: "IBM Technology présente l'analyse de risque : actifs, menaces, vulnérabilités, probabilité et impact."
```

# Les méthodes et référentiels

## EBIOS Risk Manager

**EBIOS Risk Manager** (EBIOS RM) est la méthode d'analyse de risques publiée par l'**ANSSI** et le Club EBIOS. Elle s'organise en **cinq ateliers** :

```diagram
type: flow
title: Les cinq ateliers d'EBIOS Risk Manager
steps:
  - title: 1. Cadrage et socle
    text: Périmètre, valeurs métier, événements redoutés, socle de sécurité
    tone: blue
  - title: 2. Sources de risque
    text: Qui pourrait attaquer, avec quels objectifs ?
    tone: blue
  - title: 3. Scénarios stratégiques
    text: Chemins d'attaque via l'écosystème (fournisseurs, partenaires)
    tone: amber
  - title: 4. Scénarios opérationnels
    text: Modes opératoires techniques détaillés
    tone: amber
  - title: 5. Traitement du risque
    text: Mesures, risques résiduels, plan d'amélioration
    tone: teal
```

Sa particularité : elle part des **valeurs métier** et des **attaquants**, et prend en compte l'**écosystème** (une grande partie des attaques passe aujourd'hui par un prestataire ou un fournisseur).

## ISO/IEC 27001 et 27002

**ISO/IEC 27001** est la norme internationale qui spécifie les exigences d'un **système de management de la sécurité de l'information** (SMSI) : une démarche d'amélioration continue (analyse de risques, choix de mesures, contrôle, revue). Une organisation peut être **certifiée** par un organisme accrédité. Sa version actuelle date de 2022.

**ISO/IEC 27002** détaille les **mesures de sécurité** possibles. Sa version 2022 en compte 93, réparties en quatre thèmes : organisationnelles, liées aux personnes, physiques et technologiques.

## NIST Cybersecurity Framework 2.0

Le **NIST CSF** (États-Unis), très utilisé internationalement, organise la sécurité en grandes **fonctions**. Sa version 2.0 (2024) en compte six :

```diagram
type: flow
title: Les six fonctions du NIST CSF 2.0
steps:
  - title: Gouverner
    text: Stratégie, rôles, politique, gestion des risques
    tone: violet
  - title: Identifier
    text: Inventaire, risques, améliorations
    tone: blue
  - title: Protéger
    text: Identités, données, plateformes, sensibilisation
    tone: teal
  - title: Détecter
    text: Supervision continue, analyse des événements
    tone: amber
  - title: Répondre
    text: Gestion, analyse et communication des incidents
    tone: rose
  - title: Rétablir
    text: Restauration et retour à la normale
    tone: teal
```

## Le guide d'hygiène informatique de l'ANSSI

Pour une organisation qui démarre, le **guide d'hygiène informatique** de l'ANSSI est le meilleur point d'entrée : une quarantaine de mesures concrètes (inventaire, mots de passe, mises à jour, sauvegardes, cloisonnement, journalisation…) qui constituent un **socle** à atteindre avant des démarches plus lourdes.

# La continuité d'activité

Malgré toutes les protections, un incident majeur peut arrêter l'activité. On s'y prépare avec :

- un **plan de continuité d'activité** (PCA) : comment continuer à fonctionner, éventuellement en mode dégradé, pendant l'incident ;
- un **plan de reprise d'activité** (PRA) : comment restaurer les systèmes après l'incident.

Deux objectifs chiffrés, définis **avec le métier** pour chaque service :

- **RTO** (*Recovery Time Objective*) : durée maximale d'interruption acceptable (« le site de commande doit être rétabli en 4 heures ») ;
- **RPO** (*Recovery Point Objective*) : perte de données maximale acceptable, exprimée en temps (« on peut perdre au plus 15 minutes de commandes »). Le RPO détermine la fréquence des sauvegardes ou de la réplication.

> [!WARNING]
> Une sauvegarde qui n'a **jamais été restaurée** n'est pas une sauvegarde fiable. Testez régulièrement la restauration complète, et mesurez le temps réel : c'est souvent bien plus long que prévu.

# Exercices

## Exercice 1 : Évaluer et traiter

Une PME de 40 personnes n'a pas d'authentification multifacteur sur sa messagerie en ligne, et ses salariés reçoivent régulièrement des courriels d'hameçonnage. Formulez le risque, évaluez-le et proposez un traitement.

<details>
<summary>Voir la solution</summary>

- **Scénario** : un attaquant obtient par hameçonnage le mot de passe d'un salarié, accède à sa messagerie et l'utilise pour une fraude au virement ou pour hameçonner des clients.
- **Vraisemblance** : 3 à 4 (attaques fréquentes, aucune barrière après le vol du mot de passe).
- **Gravité** : 3 (perte financière, atteinte à la réputation, possible violation de données personnelles).
- **Traitement** : **réduire**, activer la MFA pour tous (de préférence résistante à l'hameçonnage), sensibiliser, alerter sur les connexions inhabituelles, procédure de double validation des virements. Éventuellement **transférer** une partie de l'impact (assurance cyber).

</details>

## Exercice 2 : RTO et RPO

Une boutique en ligne réalise 2 000 commandes par heure. La direction estime qu'au-delà de 2 heures d'interruption, les clients partent à la concurrence, et qu'aucune commande payée ne doit être perdue. Traduisez en RTO et RPO, et déduisez une conséquence technique.

<details>
<summary>Voir la solution</summary>

- **RTO** : 2 heures.
- **RPO** : proche de zéro pour les commandes payées.
- Conséquence : une sauvegarde nocturne ne suffit pas (elle ferait perdre jusqu'à 24 heures de commandes). Il faut une **réplication** continue de la base (ou un journal de transactions sauvegardé en continu), et une procédure de bascule **testée** capable de rétablir le service en moins de 2 heures. Les paiements peuvent aussi être rapprochés avec les données du prestataire de paiement.

</details>

## Exercice 3 : Choisir un référentiel

Une association de 15 personnes sans aucune démarche de sécurité vous demande « de faire ISO 27001 ». Que lui conseillez-vous ?

<details>
<summary>Voir la solution</summary>

Commencer par le **socle** : appliquer le **guide d'hygiène informatique** de l'ANSSI (inventaire, MFA, mises à jour, sauvegardes testées, droits d'administration limités, sensibilisation), avec une analyse de risques simple pour prioriser. Une certification ISO 27001 demande un système de management complet et des audits : utile si des clients ou une réglementation l'exigent, mais disproportionné comme premier pas. Les mesures du socle protègent bien davantage, bien plus vite.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Gestion des risques
center: Prioriser les mesures selon la vraisemblance et la gravité des scénarios, et décider explicitement du reste.
points:
  - icon: scale
    title: Évaluer
    text: Menace, vulnérabilité, bien ; vraisemblance croisée avec la gravité.
  - icon: list
    title: Traiter
    text: Réduire, transférer, éviter ou accepter, par décision documentée.
  - icon: compass
    title: EBIOS RM
    text: Cinq ateliers, des valeurs métier aux scénarios, écosystème compris.
  - icon: book
    title: Référentiels
    text: ISO/IEC 27001 et 27002, NIST CSF 2.0, guide d'hygiène de l'ANSSI comme socle.
  - icon: clock
    title: Continuité
    text: PCA, PRA, RTO et RPO fixés avec le métier ; restaurations testées.
pitfall: Confondre un risque oublié avec un risque accepté, ou une sauvegarde jamais restaurée avec une sauvegarde fiable.
remember: La sécurité parfaite n'existe pas ; la bonne sécurité traite d'abord les risques les plus importants.
```
