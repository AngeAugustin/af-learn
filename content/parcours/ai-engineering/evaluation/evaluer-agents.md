---
title: Évaluer les agents et évaluer en continu
description: "Mesurer un agent sur son résultat, sa trajectoire, sa fiabilité et son coût : environnements de test, utilisateurs simulés, pass@k et pass^k, portes de régression en CI, tests A/B et métriques produit."
duration: 65
objectives:
  - Construire un environnement de test reproductible pour un agent
  - Noter le résultat final et la trajectoire (appels d'outils, étapes, violations)
  - Distinguer pass@k et pass^k et les calculer à partir d'exécutions répétées
  - Mettre en place une porte de régression en intégration continue qui tient compte du bruit
  - Concevoir une évaluation en ligne (tests A/B, métriques produit, retours utilisateurs)
---

# Pourquoi évaluer un agent est plus difficile

Une évaluation classique (chapitre 1 de ce module) compare **une** sortie à une attente. Un agent, lui, enchaîne des dizaines de décisions, agit sur un environnement, et peut atteindre le bon résultat par des chemins très différents, ou le mauvais résultat par un chemin apparemment raisonnable. Il faut donc évaluer plusieurs dimensions :

| Dimension | Question | Exemple de mesure |
|---|---|---|
| **Résultat** | La tâche est-elle accomplie ? | État final de l'environnement conforme |
| **Trajectoire** | Le chemin est-il acceptable ? | Bons outils, pas d'action interdite, pas de boucle |
| **Fiabilité** | Réussit-il à chaque fois ? | Taux de réussite sur plusieurs exécutions, pass^k |
| **Efficacité** | À quel coût ? | Tokens, dollars, durée, nombre d'étapes par tâche réussie |
| **Interaction** | Se comporte-t-il bien avec l'utilisateur ? | Questions de clarification pertinentes, ton, escalade appropriée |

# Un environnement de test reproductible

On n'évalue pas un agent qui rembourse des clients sur la vraie base de production. On construit un **environnement de test** :

- une **copie** ou un **jeu de données fictif** des systèmes utilisés (base de commandes, boîte de courriels, dépôt de code) ;
- des **outils simulés** pour les effets externes (envoi de courriel, paiement) qui **enregistrent** les appels au lieu d'agir ;
- un **état initial** rétabli avant chaque exécution (conteneur recréé, base réinitialisée) ;
- si l'agent dialogue avec un humain, un **utilisateur simulé** : un autre LLM qui joue le client selon un scénario (« vous voulez être remboursé, vous n'avez pas le numéro de commande, vous êtes pressé »).

Ce principe est celui de benchmarks comme **τ-bench** (Sierra, 2024), qui fait dialoguer des agents de support avec des utilisateurs simulés dans des domaines comme la vente ou le transport aérien, et vérifie l'**état final** de la base de données.

```python
from dataclasses import dataclass, field


@dataclass
class EnvironnementTest:
    """Systèmes simulés : on enregistre les effets au lieu de les produire."""
    commandes: dict
    courriels_envoyes: list = field(default_factory=list)
    remboursements: list = field(default_factory=list)

    def outil_envoyer_courriel(self, destinataire: str, sujet: str, corps: str) -> str:
        self.courriels_envoyes.append({"a": destinataire, "sujet": sujet, "corps": corps})
        return "Courriel envoyé."

    def outil_rembourser(self, commande_id: str, montant: float) -> str:
        if commande_id not in self.commandes:
            return "Erreur : commande introuvable."
        self.remboursements.append({"commande": commande_id, "montant": montant})
        return "Remboursement enregistré."
```

# Noter le résultat

Le meilleur juge du résultat est un **contrôle automatique de l'état final**, déterministe et peu coûteux :

```python
def verifier_cas_remboursement(env: EnvironnementTest) -> dict[str, bool]:
    return {
        "rembourse_une_fois": len(env.remboursements) == 1,
        "bon_montant": env.remboursements[:1] == [{"commande": "CMD-1001", "montant": 89.90}],
        "client_informe": any(c["a"] == "alice@exemple.fr" for c in env.courriels_envoyes),
        "aucun_courriel_a_un_tiers": all(c["a"] == "alice@exemple.fr" for c in env.courriels_envoyes),
    }
```

Quand le résultat est un texte (une réponse, un rapport), on combine des vérifications par code (présence d'éléments obligatoires) et un **LLM juge** avec une grille (chapitre 2 de ce module).

# Noter la trajectoire

Le résultat ne suffit pas : un agent peut réussir en enfreignant une règle (rembourser **avant** de vérifier la commande), ou en dépensant dix fois trop.

| Méthode | Principe | Usage |
|---|---|---|
| **Règles sur les appels** | Vérifier des propriétés : outil interdit jamais appelé, `verifier_commande` toujours avant `rembourser`, au plus N appels | La plus robuste, à privilégier |
| **Correspondance de trajectoire** | Comparer la séquence d'appels à une trajectoire de référence (exacte, dans l'ordre, sans ordre) | Workflows très encadrés |
| **LLM juge sur la trace** | Un modèle lit la trace et évalue la pertinence des étapes selon une grille | Tâches ouvertes, à valider contre des jugements humains |

```python
def verifier_trajectoire(appels: list[dict]) -> dict[str, bool]:
    noms = [a["outil"] for a in appels]
    return {
        "verification_avant_remboursement": (
            "rembourser" not in noms
            or ("chercher_commande" in noms and noms.index("chercher_commande") < noms.index("rembourser"))
        ),
        "aucun_outil_interdit": not {"supprimer_client", "modifier_prix"} & set(noms),
        "pas_de_boucle": all(noms[i:i + 3].count(noms[i]) < 3 for i in range(len(noms))),
        "etapes_raisonnables": len(appels) <= 12,
    }
```

> [!TIP]
> Évitez d'exiger une trajectoire **exacte** pour des tâches ouvertes : vous pénaliseriez des chemins différents mais tout aussi bons. Vérifiez plutôt des **propriétés** (ce qui doit et ne doit jamais arriver).

# La fiabilité : pass@k et pass^k

Un agent est **non déterministe** : exécuté cinq fois sur la même tâche, il peut réussir trois fois. Deux métriques répondent à deux questions différentes :

- **pass@k** : probabilité qu'**au moins une** de k tentatives réussisse. Pertinent quand on peut **vérifier et choisir** (générer 5 solutions de code et garder celle qui passe les tests).
- **pass^k** (introduite avec τ-bench) : probabilité que **les k** tentatives réussissent **toutes**. Pertinent pour un agent face à des clients : chaque conversation doit réussir, il n'y a pas de seconde chance.

```python
from math import comb


def pass_at_k(n: int, c: int, k: int) -> float:
    """Estimation de pass@k à partir de n essais dont c réussis."""
    if n - c < k:
        return 1.0
    return 1 - comb(n - c, k) / comb(n, k)


def pass_hat_k(n: int, c: int, k: int) -> float:
    """Estimation de pass^k : les k essais réussissent tous."""
    return comb(c, k) / comb(n, k)


# Une tâche réussie 7 fois sur 10 :
print(round(pass_at_k(10, 7, 3), 2))   # ≈ 0.99 - presque toujours au moins un succès sur 3
print(round(pass_hat_k(10, 7, 3), 2))  # ≈ 0.29 - rarement 3 succès d'affilée
```

L'écart est saisissant : un agent qui « marche 70 % du temps » paraît excellent en pass@3 et médiocre en pass^3. Pour un agent en contact avec des utilisateurs, c'est **la régularité** qui compte.

# Évaluer en continu : la porte de régression

À chaque modification (prompt, outil, modèle, version de framework), on rejoue la suite d'évaluation dans l'**intégration continue** et on **bloque** la fusion si la qualité baisse.

```diagram
type: flow
title: Une porte de régression en CI
steps:
  - title: Modification
    text: Prompt, outil, modèle ou code
  - title: Suite rapide
    text: 30 à 50 cas critiques, 3 exécutions chacun
  - title: Comparaison
    text: Avec la version de référence, cas par cas
  - title: Décision
    text: Bloquer si un cas critique échoue ou si le taux baisse au-delà du bruit
    tone: amber
  - title: Suite complète
    text: Chaque nuit ou avant une mise en production
    tone: teal
```

Les points délicats :

- **Le bruit** : un écart de 2 points sur 50 cas n'est pas significatif (chapitre 1). On compare des taux avec un **intervalle de confiance**, et on regarde les **cas qui ont changé**.
- **Les cas critiques** (sécurité, actions interdites, attaques connues du red teaming, module 9) ne tolèrent **aucun** échec : ils bloquent quel que soit le score global.
- **Le coût et la durée** : la suite rapide doit tenir en quelques minutes ; la suite complète tourne la nuit.
- **Les cas instables** : un cas qui échoue une fois sur trois de manière aléatoire signale un vrai problème de fiabilité, pas un « test capricieux » à ignorer.

```python
from math import sqrt


def intervalle_wilson(succes: int, total: int, z: float = 1.96) -> tuple[float, float]:
    """Intervalle de confiance à 95 % d'un taux de réussite (méthode de Wilson)."""
    if total == 0:
        return (0.0, 1.0)
    p = succes / total
    centre = (p + z * z / (2 * total)) / (1 + z * z / total)
    marge = z * sqrt(p * (1 - p) / total + z * z / (4 * total * total)) / (1 + z * z / total)
    return (centre - marge, centre + marge)


print(intervalle_wilson(41, 50))  # ≈ (0.69, 0.90) : 82 % mesurés, mais la vraie valeur est probablement entre 69 et 90 %
```

# Évaluer en ligne

L'évaluation hors ligne ne couvre jamais toute la réalité. En production, on mesure :

| Signal | Exemples |
|---|---|
| **Résultat métier** | Taux de résolution sans escalade, taux de tâches menées à terme, ventes |
| **Retours explicites** | Pouces haut/bas, notes, commentaires |
| **Retours implicites** | Utilisateur qui reformule, abandonne, corrige le résultat, relance la génération |
| **Notation automatique** | LLM juge sur un échantillon du trafic (module 8, chapitre 2) |
| **Coût et performance** | Coût par tâche réussie, latence, nombre d'étapes |

## Les tests A/B

Pour décider entre deux versions (nouveau prompt, nouveau modèle), on répartit **aléatoirement** les utilisateurs entre A et B et on compare une **métrique principale** choisie **à l'avance** (par exemple le taux de résolution sans escalade), avec des **métriques de garde** qui ne doivent pas se dégrader (coût, latence, plaintes).

- Fixer la **taille d'échantillon** nécessaire avant de commencer, et ne pas arrêter le test dès qu'un écart apparaît (on « découvrirait » des différences qui n'existent pas).
- Répartir par **utilisateur** (pas par requête), pour une expérience cohérente.
- Commencer par une petite part du trafic (déploiement progressif) pour limiter le risque.

## Fermer la boucle

Les échecs observés en production sont la meilleure source de nouveaux cas d'évaluation : chaque incident, chaque mauvaise note analysée, chaque escalade injustifiée devient un **cas de test**. L'évaluation est un actif qui grandit avec le produit.

# Exercices

## Exercice 1 : pass@k ou pass^k ?

Pour chaque situation, indiquez la métrique pertinente :

1. Un agent génère des migrations de base de données ; un script vérifie chaque proposition et on peut en générer cinq.
2. Un agent répond en direct aux clients d'une compagnie aérienne pour modifier leurs réservations.
3. Un agent de recherche produit un rapport, relu par un analyste qui peut demander une nouvelle version.

<details>
<summary>Voir la solution</summary>

1. **pass@k** : on peut générer plusieurs propositions et garder celle qui passe la vérification.
2. **pass^k** : chaque client doit être bien servi du premier coup ; la régularité est essentielle.
3. Intermédiaire : plutôt **pass@k** avec un petit k (2 ou 3), puisqu'une relecture permet de redemander, mais chaque échec coûte du temps d'analyste, on suivra aussi le taux de succès à la première tentative.

</details>

## Exercice 2 : Concevoir les vérifications

Un agent de gestion d'agenda reçoit : « Déplace ma réunion de jeudi avec Paul à vendredi même heure, et préviens-le. » Écrivez la liste des vérifications de résultat et de trajectoire.

<details>
<summary>Voir une proposition de solution</summary>

**Résultat (état final)** :
- la réunion n'existe plus jeudi ; elle existe vendredi, même heure, même durée, mêmes participants ;
- aucune autre réunion n'a été modifiée ou supprimée ;
- Paul a reçu une notification mentionnant le nouveau créneau ; personne d'autre n'a été notifié.

**Trajectoire** :
- l'agent a **consulté** l'agenda avant de modifier ;
- il a vérifié la **disponibilité** de vendredi (et signalé un conflit s'il y en avait un, au lieu d'écraser) ;
- aucun outil de suppression définitive n'a été utilisé ;
- nombre d'étapes inférieur à un seuil (par exemple 8).

Ajouter des variantes : deux réunions avec Paul le jeudi (l'agent doit demander laquelle), vendredi déjà occupé, Paul absent de l'annuaire.

</details>

## Exercice 3 : Interpréter une régression

La version actuelle de votre agent réussit 41 cas sur 50 ; la nouvelle version, 38 sur 50. Un des cas qui échouent désormais est un cas critique « ne jamais rembourser sans vérification ». Que décidez-vous ?

<details>
<summary>Voir la solution</summary>

- L'écart global (82 % contre 76 %) est **dans le bruit** : les intervalles de confiance se recouvrent largement. Seul, il ne permettrait pas de conclure.
- Mais un **cas critique** échoue : c'est **bloquant**, indépendamment du score global. On rejette la nouvelle version (ou on la corrige).
- On examine aussi **quels** cas ont changé dans les deux sens, en lisant les traces, avant toute nouvelle tentative.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Évaluer les agents
center: "Résultat, trajectoire, fiabilité et coût : mesurés dans un environnement reproductible, en continu."
points:
  - icon: server
    title: Environnement de test
    text: Données fictives, outils simulés qui enregistrent, état réinitialisé, utilisateur simulé.
  - icon: check
    title: Résultat
    text: Vérifier l'état final par code ; LLM juge pour les textes.
  - icon: list
    title: Trajectoire
    text: Propriétés des appels plutôt que trajectoire exacte.
  - icon: scale
    title: pass@k vs pass^k
    text: Au moins un succès quand on peut choisir ; tous les succès face aux clients.
  - icon: git
    title: Porte de régression
    text: Suite rapide en CI, cas critiques bloquants, intervalles de confiance.
  - icon: chart
    title: En ligne
    text: Métriques métier, retours, tests A/B préparés à l'avance, incidents → nouveaux cas.
pitfall: Juger un agent qui réussit 70 % du temps comme « fiable » parce qu'il réussit souvent au moins une fois sur trois.
remember: Chaque incident de production doit devenir un cas d'évaluation permanent.
```
