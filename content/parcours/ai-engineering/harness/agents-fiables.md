---
title: Construire des agents fiables
description: "Rendre un agent sûr et prévisible en production : limites, validation des actions, idempotence, humain dans la boucle, reprise sur erreur, exécution durable et escalade."
duration: 60
objectives:
  - Mettre en place des limites d'itérations, de budget et de durée
  - Valider les arguments d'outils et rendre les actions idempotentes
  - Concevoir une validation humaine utile, sans fatiguer l'utilisateur
  - Gérer les erreurs, les reprises et l'exécution durable d'un agent
  - Prévoir l'escalade vers un humain et la dégradation contrôlée
---

# Ce qui rend un agent peu fiable

Un agent combine trois sources d'incertitude : un **modèle non déterministe**, des **outils** qui échouent parfois, et un **environnement** qui change (données, API, utilisateurs). Les défaillances typiques observées en production :

| Défaillance | Exemple |
|---|---|
| Boucle sans fin | L'agent relance la même recherche infructueuse quarante fois |
| Action erronée | Mauvais destinataire, mauvais montant, mauvais fichier supprimé |
| Doublon | Une commande créée deux fois après une nouvelle tentative réseau |
| Abandon silencieux | L'agent s'arrête à mi-chemin en affirmant avoir terminé |
| Dérive | L'agent poursuit un sous-objectif sans rapport avec la demande |
| Coût explosif | Une tâche qui coûte habituellement 0,20 $ en coûte 40 |

La fiabilité ne viendra pas d'un « meilleur prompt » seul : elle se **construit** autour du modèle, dans le harness (chapitre 1 de ce module).

# Les limites

Toute boucle d'agent doit avoir des **limites explicites**, vérifiées par le code :

```python
from dataclasses import dataclass, field
import time


class LimiteAtteinte(Exception):
    pass


@dataclass
class Budget:
    max_iterations: int = 25
    max_tokens: int = 400_000
    max_secondes: float = 300
    max_appels_par_outil: dict[str, int] = field(default_factory=lambda: {"rechercher_web": 10})
    iterations: int = 0
    tokens: int = 0
    debut: float = field(default_factory=time.monotonic)
    appels: dict[str, int] = field(default_factory=dict)

    def tour(self, tokens_utilises: int) -> None:
        self.iterations += 1
        self.tokens += tokens_utilises
        if self.iterations > self.max_iterations:
            raise LimiteAtteinte(f"{self.max_iterations} itérations atteintes")
        if self.tokens > self.max_tokens:
            raise LimiteAtteinte(f"budget de {self.max_tokens} tokens dépassé")
        if time.monotonic() - self.debut > self.max_secondes:
            raise LimiteAtteinte("durée maximale dépassée")

    def appel_outil(self, nom: str) -> None:
        self.appels[nom] = self.appels.get(nom, 0) + 1
        limite = self.max_appels_par_outil.get(nom)
        if limite is not None and self.appels[nom] > limite:
            raise LimiteAtteinte(f"trop d'appels à {nom}")
```

Quand une limite est atteinte, l'agent ne doit pas simplement s'arrêter : il **rend compte** de ce qui a été fait, de ce qui reste, et passe la main (voir « Escalade »).

> [!TIP]
> Réglez les limites à partir des **traces réelles** : si 95 % des tâches réussies prennent moins de 12 itérations, une limite à 25 laisse de la marge tout en coupant les boucles pathologiques. Surveillez la distribution dans le temps (module 8).

On ajoute souvent une **détection de répétition** : si l'agent appelle le même outil avec les mêmes arguments trois fois de suite, on lui renvoie un message (« Cet appel a déjà été fait avec le même résultat ; change d'approche ou demande de l'aide ») plutôt que de le laisser tourner.

# Valider avant d'agir

## Valider les arguments

Le modèle produit des arguments d'outils qui respectent généralement le schéma, mais pas forcément les **règles métier**. Validez-les **dans le code de l'outil**, comme vous le feriez pour une entrée utilisateur (module 4) :

```python
from pydantic import BaseModel, Field, field_validator


class Remboursement(BaseModel):
    commande_id: str = Field(pattern=r"^CMD-\d{6}$")
    montant: float = Field(gt=0)
    motif: str = Field(min_length=10)

    @field_validator("montant")
    @classmethod
    def plafond(cls, v: float) -> float:
        if v > 500:
            raise ValueError("Au-delà de 500 €, un remboursement doit être validé par un humain.")
        return v


def outil_rembourser(arguments: dict, commandes) -> dict:
    try:
        demande = Remboursement(**arguments)
    except ValueError as e:
        return {"is_error": True, "content": f"Demande invalide : {e}"}
    commande = commandes.get(demande.commande_id)
    if commande is None:
        return {"is_error": True, "content": "Commande introuvable. Vérifie l'identifiant avec l'outil chercher_commande."}
    if demande.montant > commande.montant_paye:
        return {"is_error": True, "content": "Le montant dépasse ce qui a été payé pour cette commande."}
    ...
```

Les messages d'erreur sont **actionnables** : ils disent au modèle quoi faire ensuite.

## Rendre les actions idempotentes

Une action est **idempotente** si l'exécuter deux fois a le même effet qu'une seule fois. C'est essentiel, car un agent (ou le harness, après une erreur réseau) **rejoue** parfois une action.

- Lecture, recherche : naturellement idempotentes.
- Création (commande, paiement, ticket) : utiliser une **clé d'idempotence** transmise au système cible, qui ignore une deuxième demande portant la même clé.
- Modification : préférer « mettre le statut à *expédié* » (idempotent) à « avancer le statut d'une étape » (non idempotent).

```python
import hashlib
import json


def cle_idempotence(session_id: str, outil: str, arguments: dict) -> str:
    """Même session + même outil + mêmes arguments => même clé : le système cible déduplique."""
    contenu = json.dumps({"s": session_id, "o": outil, "a": arguments}, sort_keys=True)
    return hashlib.sha256(contenu.encode()).hexdigest()
```

## Prévisualiser avant d'exécuter

Pour les actions importantes, un mode **« simulation »** (*dry run*) renvoie ce qui **serait** fait (« 37 courriels seraient envoyés à… ») sans le faire. L'agent ou l'humain valide, puis l'action réelle est lancée.

# L'humain dans la boucle

Pour les actions sensibles, l'agent **propose** et l'humain **décide**. La difficulté est de trouver le bon dosage : trop de validations et l'utilisateur clique « Oui » sans lire (*fatigue d'approbation*) ; trop peu et une erreur passe.

```diagram
type: decision
title: Faut-il une validation humaine ?
nodes:
  - question: L'action est-elle irréversible ou a-t-elle un effet externe (argent, client, production) ?
    yes: Validation humaine systématique, avec un résumé clair de l'action
    no: Question suivante
  - question: L'action sort-elle du périmètre habituel (montant inhabituel, nouveau destinataire, volume élevé) ?
    yes: Validation humaine
    no: Exécution automatique, journalisée et annulable
```

Une bonne demande de validation :

- dit **précisément** ce qui va se passer (destinataire, montant, fichiers concernés), pas « L'agent veut utiliser l'outil envoyer_courriel » ;
- donne le **pourquoi** (la raison de l'agent) ;
- propose **approuver**, **refuser** et **modifier** ;
- renvoie le refus au modèle comme un **résultat d'outil**, pour qu'il s'adapte au lieu de s'interrompre brutalement.

```python
ACTIONS_SENSIBLES = {"envoyer_courriel", "rembourser", "supprimer_fichier"}


def executer_avec_validation(nom: str, arguments: dict, raison: str, demander) -> dict:
    if nom in ACTIONS_SENSIBLES:
        decision = demander(titre=f"Action proposée : {nom}", details=arguments, raison=raison)
        if decision.statut == "refuse":
            return {"is_error": True, "content": f"Action refusée par l'utilisateur. Motif : {decision.commentaire or 'non précisé'}."}
        if decision.statut == "modifie":
            arguments = decision.arguments_modifies
    return executer_outil(nom, arguments)
```

> [!NOTE]
> Dans un processus métier, la validation peut prendre des heures (le responsable est en réunion). L'agent ne doit pas rester « bloqué » dans un processus en mémoire : son état est **persisté**, et il reprend lorsque la décision arrive (voir « Exécution durable »).

# Erreurs et reprises

| Type d'erreur | Traitement |
|---|---|
| Erreur temporaire du fournisseur (surcharge, délai dépassé) | Nouvelle tentative automatique avec délai croissant (module 4) |
| Erreur d'outil (argument invalide, ressource introuvable) | Renvoyée au modèle comme résultat d'outil, avec un message actionnable |
| Panne d'un service externe | Message clair au modèle (« Service de facturation indisponible »), qui peut contourner ou escalader |
| Sortie invalide du modèle | Validation, puis nouvelle demande avec l'erreur, nombre limité de fois |
| Crash du processus | Reprise depuis le dernier point de sauvegarde |

## Les points de sauvegarde et l'exécution durable

Pour qu'un agent survive à un redémarrage, son **état** (historique, étape en cours, résultats d'outils, décisions en attente) est **sauvegardé après chaque étape** dans un stockage durable. C'est le principe des **checkpointers** de LangGraph ou des moteurs d'**exécution durable** comme Temporal ou Inngest : chaque étape terminée est enregistrée et ne sera pas rejouée, et l'exécution reprend exactement au même point.

```diagram
type: flow
title: Une étape d'agent durable
steps:
  - title: Charger l'état
    text: Depuis la base, par identifiant de session
  - title: Appeler le modèle
    text: Avec le contexte reconstruit
  - title: Exécuter l'outil
    text: Avec une clé d'idempotence
  - title: Sauvegarder
    text: État et résultat, avant de continuer
    tone: teal
  - title: Attendre ou continuer
    text: Validation humaine, événement externe, ou tour suivant
```

Deux conséquences pratiques :

- tout ce qui peut être rejoué doit être **idempotent** (une étape interrompue au milieu sera relancée) ;
- les sessions sont **reprenables et auditables** : on sait exactement ce qui a été fait et dans quel ordre.

## Annuler

Quand c'est possible, prévoyez l'**annulation** : actions compensatoires (annuler une commande, restaurer un fichier depuis Git, rembourser un débit), conservation des versions précédentes, corbeille plutôt que suppression définitive.

# Escalade et dégradation contrôlée

Un agent fiable **sait quand s'arrêter** et passer la main :

- la tâche sort de son périmètre ou de ses permissions ;
- il a échoué plusieurs fois sur la même étape ;
- une limite (itérations, budget, durée) est atteinte ;
- l'utilisateur est mécontent ou demande un humain ;
- la confiance est faible (informations contradictoires, données manquantes).

L'escalade produit un **dossier de passation** : la demande, ce qui a été fait, ce qui a échoué, les données collectées, et la question précise posée à l'humain. Rien n'est plus frustrant pour un conseiller que de devoir tout reprendre de zéro.

La **dégradation contrôlée** consiste à offrir un service réduit plutôt qu'un échec : si l'outil de réservation est indisponible, l'agent recueille la demande et promet un rappel, au lieu d'inventer une confirmation.

> [!CAUTION]
> Le pire comportement d'un agent est l'**abandon silencieux** : affirmer qu'une action a été effectuée alors qu'elle a échoué. Exigez dans les instructions **et** vérifiez dans le code que toute affirmation de succès correspond à un résultat d'outil réussi (« Le remboursement est effectué » n'est autorisé que si l'outil `rembourser` a renvoyé un succès).

# Exercices

## Exercice 1 : Une boucle pathologique

Une trace montre un agent qui appelle `chercher_commande(numero="12345")` onze fois de suite, chaque fois avec le résultat « introuvable », avant d'atteindre la limite d'itérations. Proposez trois améliorations.

<details>
<summary>Voir la solution</summary>

1. **Message d'erreur actionnable** dans l'outil : « Aucune commande 12345. Les numéros ont le format CMD-XXXXXX ; tu peux aussi chercher par adresse courriel avec chercher_commandes_client. »
2. **Détection de répétition** dans le harness : au troisième appel identique, renvoyer « Cet appel a déjà échoué avec les mêmes arguments ; change d'approche ou demande l'information à l'utilisateur ».
3. **Limite par outil** (par exemple 5 appels à `chercher_commande` par session) et **escalade** propre quand elle est atteinte : demander le bon numéro à l'utilisateur ou transmettre à un humain.

</details>

## Exercice 2 : Idempotence

Un agent de commande appelle `creer_commande(client_id, articles)`. Le réseau coupe après l'envoi de la requête mais avant la réponse ; le harness relance l'appel. Que se passe-t-il, et comment l'éviter ? Que change l'utilisation d'un moteur d'exécution durable ?

<details>
<summary>Voir la solution</summary>

Sans précaution, la commande est **créée deux fois** : la première requête a abouti côté serveur, mais le harness ne le sait pas.

Solution : générer une **clé d'idempotence** (dérivée de la session, de l'outil et des arguments, ou un identifiant unique enregistré avant l'appel) et la transmettre au service de commandes, qui ignore toute requête répétée portant la même clé et renvoie le résultat de la première.

Avec l'**exécution durable**, une étape **terminée et enregistrée** n'est pas rejouée. Mais une étape interrompue **pendant** l'appel le sera : l'idempotence reste donc indispensable.

</details>

## Exercice 3 : Concevoir la validation humaine

Un agent gère la boîte de réception d'une petite entreprise : il classe les courriels, prépare des réponses, programme des rendez-vous et peut envoyer des devis. Les utilisateurs se plaignent d'avoir trop de validations. Proposez une politique de validation.

<details>
<summary>Voir une proposition de solution</summary>

- **Automatique, journalisé et annulable** : classement, étiquetage, archivage, préparation de brouillons, propositions de créneaux à des contacts connus.
- **Validation légère** (un clic, regroupée en fin de journée si possible) : réponses standard à des clients connus.
- **Validation systématique et détaillée** : envoi de devis (montant affiché), tout envoi à un nouveau destinataire, toute pièce jointe contenant des données de l'entreprise, toute suppression.
- Réduire la fatigue : **regrouper** les validations, afficher l'essentiel (destinataire, montant, extrait), proposer « modifier », et revoir la politique en fonction du taux d'approbation (une action approuvée 100 % du temps pendant un mois peut passer en automatique).

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Construire des agents fiables
center: "La fiabilité se construit autour du modèle : limites, validations, reprises et escalade."
points:
  - icon: gauge
    title: Limites
    text: Itérations, tokens, durée, appels par outil, détection de répétition.
  - icon: check
    title: Valider et dédoublonner
    text: Règles métier dans le code de l'outil, clés d'idempotence, simulation avant action.
  - icon: users
    title: Humain dans la boucle
    text: Pour l'irréversible et l'inhabituel, avec un résumé clair, sans fatigue d'approbation.
  - icon: clock
    title: Exécution durable
    text: État sauvegardé après chaque étape, reprise après panne ou longue attente.
  - icon: compass
    title: Escalade
    text: Savoir s'arrêter et passer la main avec un dossier complet.
pitfall: Un agent qui affirme qu'une action a réussi alors que l'outil a échoué.
remember: Tout ce qui peut être rejoué doit être idempotent, et tout ce qui est irréversible doit être validé.
```
