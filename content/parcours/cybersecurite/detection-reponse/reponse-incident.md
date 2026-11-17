---
title: La réponse à incident
description: Les phases de la réponse (préparation, détection, confinement, éradication, rétablissement, retour d'expérience), les bases de l'investigation numérique, le cas du rançongiciel et les obligations de notification.
duration: 65
objectives:
  - Dérouler les phases d'une réponse à incident
  - Préserver les preuves et mener une première investigation
  - Collecter les traces dans le bon ordre et construire une chronologie
  - Réagir correctement à un rançongiciel
  - Connaître les obligations de notification et de communication
---

# Qu'est-ce qu'un incident ?

Un **incident de sécurité** est un événement qui porte atteinte (ou menace de porter atteinte) à la disponibilité, l'intégrité ou la confidentialité d'un système ou de données. Tous les événements de sécurité ne sont pas des incidents : un échec de connexion isolé est un **événement**, une intrusion confirmée est un **incident**.

La **réponse à incident** vise à **limiter les dégâts**, **rétablir** le service et **apprendre**. Elle se prépare **avant** : improviser pendant une crise coûte cher.

# Les phases de la réponse

Le cadre de référence du **NIST** (SP 800-61) décrit un cycle en grandes étapes :

```diagram
type: flow
title: Le cycle de réponse à incident
steps:
  - title: Préparation
    text: Plan, rôles, contacts, outils, sauvegardes, entraînement
    tone: blue
  - title: Détection et analyse
    text: Identifier, qualifier et évaluer la portée de l'incident
    tone: amber
  - title: Confinement
    text: Empêcher l'extension, en préservant les preuves
    tone: rose
  - title: Éradication
    text: Supprimer la cause (maliciel, accès de l'attaquant)
    tone: teal
  - title: Rétablissement
    text: Restaurer les systèmes et surveiller leur retour à la normale
    tone: teal
  - title: Retour d'expérience
    text: Post-mortem, leçons, améliorations
    tone: violet
```

## Préparation

Avant tout incident : un **plan de réponse** écrit (qui fait quoi, dans quel ordre), une **équipe** et ses rôles (coordination, technique, communication, juridique, direction), des **contacts** à jour (internes, prestataires, assureur, autorités, hébergeur), des **sauvegardes** testées et **hors ligne**, des **moyens de communication de secours** (si la messagerie est compromise), et des **exercices** réguliers.

## Détection, analyse et confinement

Une fois l'incident confirmé, on en évalue la **portée** : quels systèmes, quels comptes, quelles données, depuis quand. Puis on **confine** pour empêcher l'extension.

> [!CAUTION]
> **Ne pas éteindre brutalement une machine compromise par réflexe** : la mémoire vive contient des preuves précieuses (processus, clés, connexions) qui disparaissent à l'extinction. Préférez **isoler** la machine du réseau (la débrancher du réseau, ou l'isoler via l'EDR) tout en la laissant allumée, sauf consigne contraire des personnes chargées de l'investigation. Ne modifiez pas les systèmes avant d'avoir préservé ce qui doit l'être.

Le confinement peut être **immédiat** (isoler une machine, désactiver un compte, bloquer une adresse) et **progressif**, selon l'équilibre entre arrêter l'attaquant et maintenir l'activité.

## Éradication et rétablissement

- **Éradication** : supprimer la présence de l'attaquant (maliciel, comptes et accès créés, tâches planifiées, portes dérobées), en s'étant assuré d'avoir compris **comment** il est entré, sinon il reviendra.
- **Rétablissement** : restaurer à partir de sauvegardes **saines** (antérieures à la compromission), reconstruire proprement les systèmes les plus touchés, **changer les secrets** (mots de passe, clés), et **surveiller** étroitement le retour à la normale pour détecter un éventuel retour de l'attaquant.

## Retour d'expérience

Un **post-mortem sans blâme** (comme en DataOps) documente la chronologie, l'impact, les causes profondes, ce qui a bien et mal fonctionné, et les **actions d'amélioration** (nouvelles détections, correctifs, procédures, formation). C'est ce qui transforme un incident douloureux en progrès durable.

```video
url: https://www.youtube.com/watch?v=ToVVhMyU3dQ
title: "The 6 Steps of the Incident Response Life Cycle and What Is a Security Incident?"
channel: "Cyber Gray Matter"
duration: "7:39"
lang: en
why: "Les étapes du cycle de réponse aux incidents, de la préparation au retour d'expérience."
```

# Les bases de l'investigation numérique

L'**investigation numérique** (*forensics*) cherche à comprendre ce qui s'est passé à partir des traces, de façon rigoureuse. Deux principes fondamentaux :

- **préserver l'intégrité des preuves** : travailler sur des **copies**, calculer des **empreintes** (hachage) pour prouver qu'elles n'ont pas été modifiées, et tenir une **chaîne de possession** (qui a manipulé quoi, quand) ;
- **documenter** chaque action, horodatée.

```diagram
type: compare
title: Deux familles de preuves
columns:
  - title: Volatiles (d'abord)
    tone: rose
    items:
      - Mémoire vive, processus, connexions réseau
      - Disparaissent à l'extinction
      - À capturer en priorité si possible
  - title: Persistantes
    tone: blue
    items:
      - Disques, journaux, fichiers
      - Survivent au redémarrage
      - Copie bit à bit pour analyse
```

## L'ordre de collecte et les sources de traces

On collecte du **plus volatil au moins volatil** : mémoire vive et connexions réseau d'abord (elles disparaissent à l'extinction), puis disques, puis journaux centralisés et sauvegardes. C'est pourquoi on **n'éteint pas** une machine compromise par réflexe : on l'**isole du réseau** (par l'EDR ou en débranchant le câble réseau), ce qui préserve la mémoire.

| Source | Ce qu'elle révèle |
|---|---|
| **Mémoire vive** | Processus en cours, connexions, code malveillant qui n'existe qu'en mémoire, clés et identifiants |
| **Journaux système et applicatifs** | Connexions, créations de comptes, services installés, commandes PowerShell |
| **Artefacts Windows** | Programmes exécutés (*Prefetch*, *Amcache*), clés de registre de démarrage automatique, tâches planifiées |
| **Artefacts Linux** | Historique du shell, `authorized_keys` ajoutées, tâches cron, binaires modifiés |
| **Réseau** | Journaux du pare-feu, du proxy, du DNS, flux ; destinations contactées et volumes envoyés |
| **Cloud et SaaS** | Journaux d'audit (création de clés d'accès, règles de transfert de messagerie, partages publics) |

Des outils spécialisés existent pour chaque étape : acquisition de la mémoire et des disques, analyse de la mémoire (**Volatility**), collecte rapide d'artefacts sur un poste (**Velociraptor**, KAPE), ou les fonctions d'investigation de l'EDR.

## La chronologie

Le cœur de l'analyse est une **chronologie** (*timeline*) : tous les événements datés, de toutes les sources, sur un même axe de temps (en UTC, en vérifiant les fuseaux et les horloges des machines). Elle répond aux questions clés : **quand** l'attaquant est-il entré, **par où**, **qu'a-t-il fait**, **qu'a-t-il emporté**, et **est-il encore présent** ? Le premier événement malveillant trouvé est rarement le premier qui a eu lieu.

> [!IMPORTANT]
> Si l'incident est grave ou peut donner lieu à des **poursuites** (dépôt de plainte), faites appel à des **spécialistes** de la réponse à incident et de l'investigation (en interne ou via un prestataire), et conservez les preuves selon leurs consignes. Une manipulation maladroite peut détruire des preuves ou les rendre irrecevables.

# Le cas du rançongiciel

Le **rançongiciel** (*ransomware*) chiffre les données et réclame une rançon, souvent avec une **double extorsion** : l'attaquant **vole** aussi les données et menace de les publier. C'est aujourd'hui l'une des menaces majeures pour les organisations.

Réaction (en lien avec Cybermalveillance.gouv.fr et l'ANSSI) :

- **isoler** immédiatement les machines touchées pour stopper la propagation ; déconnecter les sauvegardes encore saines ;
- **ne pas payer** la rançon : le paiement ne garantit ni la récupération des données ni la non-publication, finance la criminalité, et désigne la victime comme payeuse ;
- **préserver les preuves** et **déposer plainte** ;
- **restaurer** à partir de sauvegardes saines et hors ligne, d'où l'importance capitale de la **règle 3-2-1** (trois copies, sur deux supports, dont une hors site et idéalement hors ligne) et de **tester** les restaurations ;
- **comprendre le point d'entrée** avant de tout remettre en service, pour ne pas être rechiffré.

> [!TIP]
> La meilleure réponse au rançongiciel se joue **avant** : sauvegardes hors ligne testées, MFA, mises à jour, segmentation et détection. Le site **Cybermalveillance.gouv.fr** fournit des guides et oriente les victimes ; le projet **No More Ransom** propose parfois des outils de déchiffrement gratuits pour certaines familles.

# Les obligations

Un incident peut déclencher des **obligations légales**, à anticiper avec le juridique :

- **Données personnelles (RGPD)** : une **violation de données** personnelles doit en principe être notifiée à la **CNIL** dans les **72 heures** après en avoir pris connaissance, et les personnes concernées doivent être informées si le risque pour elles est élevé.
- **Entités essentielles et importantes (NIS 2)** : la directive européenne **NIS 2**, qui élargit fortement le nombre d'organisations concernées, impose des mesures de sécurité et la **notification** des incidents significatifs aux autorités compétentes (en France, l'ANSSI), avec des délais courts (alerte précoce sous 24 h, puis notification plus complète).
- **Secteurs réglementés** (santé, finance avec DORA, etc.) : obligations spécifiques propres.

La **communication** fait partie de la réponse : informer en interne, et à l'extérieur de façon **mesurée et honnête** (clients, partenaires), ni en minimisant ni en affolant. Une communication tardive ou trompeuse aggrave l'atteinte à la confiance.

# Exercices

## Exercice 1 : Le bon réflexe

Un analyste découvre qu'un serveur est manifestement compromis (processus inconnu communiquant vers l'extérieur). Son premier réflexe est de l'éteindre. Est-ce la bonne décision ?

<details>
<summary>Voir la solution</summary>

Non, pas par réflexe. Éteindre fait **perdre les preuves volatiles** (mémoire, processus, connexions) précieuses pour l'investigation. Il vaut mieux **isoler** la machine du réseau (la débrancher ou l'isoler via l'EDR) en la laissant allumée, **préserver** la mémoire si possible, **documenter**, puis suivre le plan de réponse et, pour un incident grave, les consignes des spécialistes. L'arrêt peut se justifier dans certains cas (chiffrement en cours massif), mais c'est une décision raisonnée, pas un réflexe.

</details>

## Exercice 2 : Rançongiciel

Une entreprise est victime d'un rançongiciel un lundi matin : la moitié des serveurs sont chiffrés, un message réclame une rançon. Décrivez les premières actions.

<details>
<summary>Voir la solution</summary>

1. **Isoler** les machines touchées et déconnecter du réseau les systèmes encore sains, **dont les sauvegardes**, pour stopper la propagation.
2. **Activer** la cellule de crise (plan de réponse, rôles, contacts) et un canal de communication **de secours**.
3. **Préserver les preuves** et **déposer plainte** ; contacter Cybermalveillance.gouv.fr, l'assureur, et selon le cas l'ANSSI.
4. **Ne pas payer** la rançon.
5. Évaluer la **portée** (données volées ?) et déclencher les **notifications** requises (CNIL sous 72 h si données personnelles, autorités selon NIS 2).
6. **Comprendre le point d'entrée**, puis **restaurer** à partir de sauvegardes saines et hors ligne, et surveiller.

</details>

## Exercice 3 : Notifier ou non ?

Une application fuit accidentellement les adresses e-mail et l'historique d'achats de 5 000 clients, accessibles plusieurs heures à qui modifiait un paramètre d'URL. Quelles obligations ?

<details>
<summary>Voir la solution</summary>

C'est une **violation de données personnelles** (RGPD). Il faut l'évaluer et, sauf si le risque pour les personnes est négligeable, la **notifier à la CNIL** dans les **72 heures** après en avoir pris connaissance, en documentant les faits, la portée et les mesures prises. Si le risque pour les personnes est **élevé**, les **informer** également. En parallèle : corriger la faille (IDOR, module 5), vérifier dans les journaux si elle a été exploitée et par qui, conserver les preuves, et impliquer le délégué à la protection des données.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: La réponse à incident
center: Se préparer avant, confiner sans détruire les preuves, éradiquer, rétablir à partir de sauvegardes saines, apprendre.
points:
  - icon: loop
    title: Les phases
    text: Préparation, détection, confinement, éradication, rétablissement, retour d'expérience.
  - icon: alert
    title: Préserver les preuves
    text: Isoler plutôt qu'éteindre ; copies, empreintes, chaîne de possession, documentation.
  - icon: lock
    title: Rançongiciel
    text: Isoler, ne pas payer, plainte, restaurer depuis des sauvegardes hors ligne testées.
  - icon: shield
    title: Sauvegardes 3-2-1
    text: Trois copies, deux supports, une hors site et hors ligne ; restaurations testées.
  - icon: scale
    title: Obligations
    text: CNIL sous 72 h pour les données personnelles, NIS 2 vers l'ANSSI ; communication honnête.
  - icon: clock
    title: Chronologie
    text: Du plus volatil au moins volatil, isoler sans éteindre, tout dater en UTC.
pitfall: Payer la rançon, ou tout remettre en service sans avoir compris et fermé le point d'entrée.
remember: La réponse à incident se gagne par la préparation ; en pleine crise, on exécute un plan, on ne l'invente pas.
```
