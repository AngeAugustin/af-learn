---
title: Le facteur humain et l'ingénierie sociale
description: Comprendre l'ingénierie sociale (hameçonnage et variantes), reconnaître les signaux, bâtir une culture de sécurité et des procédures qui résistent à la manipulation.
duration: 45
objectives:
  - Expliquer les ressorts de l'ingénierie sociale
  - Reconnaître l'hameçonnage et ses variantes
  - Concevoir des procédures résistantes à la manipulation
  - Construire une culture de sécurité efficace
---

# L'humain, au cœur de la sécurité

La plupart des attaques réussies commencent par une **personne** : un clic sur un lien, un mot de passe donné, un virement effectué sur ordre d'un faux dirigeant. Les attaquants exploitent non pas des failles techniques, mais des **réflexes humains** : la confiance, l'obéissance à l'autorité, l'urgence, la peur, la curiosité, l'envie d'aider.

> [!IMPORTANT]
> Blâmer « l'utilisateur qui a cliqué » est à la fois injuste et inefficace. Les attaques sont **conçues** pour tromper, parfois très bien. L'objectif n'est pas des humains infaillibles, mais un **système** qui résiste même quand une personne se fait piéger (défense en profondeur, procédures, MFA), et une **culture** où l'on ose signaler une erreur.

# L'ingénierie sociale

L'**ingénierie sociale** (*social engineering*) est l'art de manipuler une personne pour qu'elle révèle une information ou effectue une action. Elle s'appuie sur des **leviers psychologiques** :

| Levier | Comment l'attaquant l'utilise |
|---|---|
| **Autorité** | Se faire passer pour un dirigeant, un service informatique, une administration |
| **Urgence** | « Il faut agir immédiatement, sinon… » pour empêcher la réflexion |
| **Peur** | Menace de sanction, de blocage, de problème légal |
| **Confiance / familiarité** | Usurper un collègue, un partenaire, une marque connue |
| **Appât / curiosité** | Une offre, un gain, un document « confidentiel » |
| **Réciprocité / sympathie** | Rendre un petit service pour obtenir une faveur en retour |

## L'hameçonnage et ses variantes

- **Hameçonnage** (*phishing*) : courriel de masse qui imite une entité connue pour voler des identifiants ou faire exécuter une action (ouvrir une pièce jointe piégée, cliquer un lien).
- **Harponnage** (*spear phishing*) : hameçonnage **ciblé** et personnalisé, à partir d'informations sur la victime. La **fraude au président** (ou *BEC*, *Business Email Compromise*) cible un comptable au nom d'un dirigeant pour un virement urgent et confidentiel.
- **Smishing** (par SMS) et **vishing** (par téléphone, usurpant une banque ou un support).
- **Quishing** : hameçonnage par **QR code**, qui mène vers un faux site.
- **Appâtage physique** : une clé USB « perdue » laissée sur un parking, dans l'espoir qu'on la branche.

> [!WARNING]
> Les attaques gagnent en crédibilité avec l'**IA générative** : courriels sans fautes, dans la langue et le ton de l'entreprise, voire **clonage de voix** pour un faux appel du dirigeant. Les repères classiques (« ils font des fautes ») ne suffisent plus. Il faut s'appuyer sur des **procédures** et sur la **vérification par un canal indépendant**, pas seulement sur la vigilance individuelle.

```video
url: https://www.youtube.com/watch?v=Y7zNlEMDmI4
title: "What is phishing? Learn how this attack works"
channel: "TECHtalk"
duration: "2:57"
lang: en
why: "Comment fonctionne une attaque par hameçonnage et les signaux qui doivent alerter, en trois minutes."
```

# Reconnaître et réagir

Signaux d'alerte fréquents :

- une **urgence** ou une **pression** inhabituelle, une demande de **confidentialité** ;
- une demande qui **contourne les procédures** normales (virement exceptionnel, changement d'IBAN) ;
- un **expéditeur** dont l'adresse réelle diffère du nom affiché, un domaine très proche mais pas identique ;
- un **lien** dont la destination réelle (visible au survol) ne correspond pas au texte ;
- une demande d'**identifiants**, de code MFA ou d'informations sensibles.

Les bons réflexes :

- **ne pas agir dans l'urgence** : prendre le temps de vérifier ;
- **vérifier par un autre canal** : rappeler la personne à un numéro **connu** (pas celui indiqué dans le message) ;
- **ne jamais communiquer** de mot de passe ou de code MFA : aucun service légitime ne les demande ;
- **signaler** au service informatique, même en cas de doute, et **même après** avoir cliqué.

# Des procédures qui résistent

La vigilance individuelle ne suffit pas : on conçoit des **processus** qui rendent la manipulation inopérante.

```diagram
type: flow
title: Une procédure anti-fraude pour les virements
steps:
  - title: Demande
    text: Un paiement ou un changement d'IBAN est demandé
    tone: blue
  - title: Vérification indépendante
    text: Contre-appel à un numéro connu, jamais celui du message
    tone: amber
  - title: Double validation
    text: Deux personnes distinctes pour les montants élevés
    tone: teal
  - title: Traçabilité
    text: Demande, vérification et validation journalisées
    tone: violet
```

Exemples de garde-fous : **double validation** (séparation des tâches) pour les virements et les changements d'IBAN ; vérification systématique d'un changement de coordonnées bancaires par **contre-appel** ; **MFA résistante à l'hameçonnage** (passkeys) pour neutraliser le vol d'identifiants ; **limites** et alertes sur les opérations sensibles ; procédure claire de **signalement**.

# Construire une culture de sécurité

Une culture de sécurité efficace repose sur quelques principes :

- **Former régulièrement**, de façon concrète et courte, plutôt qu'une longue session annuelle vite oubliée. Des exemples réels et adaptés aux métiers marquent davantage.
- **Simulations d'hameçonnage** bienveillantes : non pour piéger et punir, mais pour **entraîner** et mesurer les progrès. Une personne qui tombe dans le piège doit recevoir une **aide**, pas une sanction.
- **Faciliter le signalement** : un bouton « signaler un courriel suspect », un contact clair, une réaction rapide et un **remerciement**. Chaque signalement, même d'un faux positif, est précieux.
- **Sécurité par défaut et sans friction** : quand c'est possible, retirer la charge de l'utilisateur (MFA par passkey, gestionnaire de mots de passe fourni, pièces jointes dangereuses filtrées en amont).
- **Exemplarité** de la direction et **absence de blâme** : si signaler une erreur expose à des reproches, les erreurs seront cachées, et c'est bien plus dangereux.

> [!TIP]
> Mesurez ce qui compte : non pas seulement le **taux de clic** aux simulations, mais surtout le **taux de signalement** et le **délai** de signalement. Une organisation où les gens signalent vite un courriel suspect détecte les vraies campagnes bien plus tôt.

# Exercices

## Exercice 1 : Identifier les leviers

Dans ce message, repérez les leviers d'ingénierie sociale : « Bonjour, ici le service informatique. Votre compte sera **bloqué dans 1 heure** pour raison de sécurité. **Confirmez immédiatement** votre mot de passe en répondant à ce message pour éviter l'interruption. Merci de votre réactivité. »

<details>
<summary>Voir la solution</summary>

- **Autorité** : « le service informatique ».
- **Urgence** et **peur** : « bloqué dans 1 heure », « immédiatement », « interruption ».
- **Demande d'identifiants** : confirmer son mot de passe, qu'aucun service légitime ne demande.

Réaction : ne pas répondre, ne pas donner le mot de passe, **signaler** au vrai service informatique via un canal connu.

</details>

## Exercice 2 : La fraude au président

Un comptable reçoit un courriel apparemment du PDG : « Je suis en déplacement, opération confidentielle, effectuez un virement de 48 000 € aujourd'hui vers ce compte, ne parlez à personne, je compte sur vous. » Quelle procédure aurait dû exister ?

<details>
<summary>Voir la solution</summary>

Une procédure anti-fraude : **vérification indépendante** systématique (contre-appel au PDG à son numéro **connu**, jamais via le message) ; **double validation** par deux personnes pour tout virement de ce montant ; **refus** des demandes de contournement et de confidentialité comme signal d'alerte en soi ; vérification renforcée de tout **nouveau bénéficiaire**. La confidentialité et l'urgence demandées sont précisément les marqueurs de l'arnaque : la procédure doit primer sur l'ordre reçu.

</details>

## Exercice 3 : Concevoir une sensibilisation

On vous confie la sensibilisation de 200 salariés non techniques. Proposez une approche qui fonctionne mieux qu'une réunion annuelle d'une heure.

<details>
<summary>Voir la solution</summary>

- **Modules courts et réguliers** (quelques minutes), avec des exemples **concrets** adaptés aux métiers.
- **Simulations d'hameçonnage** bienveillantes et régulières, suivies d'une aide immédiate pour ceux qui cliquent (pas de sanction).
- **Bouton de signalement** simple et réaction rapide valorisant chaque signalement.
- Mesures **sans friction** déployées en parallèle (MFA par passkey, filtrage des pièces jointes, gestionnaire de mots de passe).
- **Mesure** du taux et du délai de signalement, communication des progrès.
- **Exemplarité** de la direction et culture **sans blâme**.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Le facteur humain
center: Les attaques visent nos réflexes ; on y répond par des procédures et une culture, pas par le blâme.
points:
  - icon: users
    title: Ingénierie sociale
    text: Autorité, urgence, peur, confiance, curiosité ; manipuler plutôt que pirater.
  - icon: chat
    title: Hameçonnage et variantes
    text: Phishing, harponnage, fraude au président, smishing, vishing, quishing.
  - icon: eye
    title: Reconnaître
    text: Urgence, confidentialité, contournement de procédure, expéditeur et liens trompeurs.
  - icon: check
    title: Procédures
    text: Vérifier par un canal connu, double validation, passkeys, signalement facile.
  - icon: idea
    title: Culture
    text: Formations courtes, simulations bienveillantes, signalement valorisé, aucun blâme.
pitfall: Compter sur « les fautes d'orthographe » pour repérer des attaques désormais rédigées par IA.
remember: Le but n'est pas des humains infaillibles, mais un système qui tient même quand quelqu'un se fait piéger.
```
