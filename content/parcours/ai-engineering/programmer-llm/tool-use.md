---
title: Donner des outils au modèle (tool use)
description: "Permettre au modèle d'appeler vos fonctions : définition d'outils, boucle d'exécution, gestion des erreurs et bonnes pratiques de sécurité."
duration: 60
objectives:
  - Expliquer le principe de l'appel d'outils (function calling)
  - Définir un outil avec un nom, une description et un schéma d'entrée
  - Implémenter la boucle complète demande d'outil → exécution → résultat
  - Concevoir des outils sûrs et faciles à utiliser pour le modèle
---

# Le principe

Un LLM ne peut, par lui-même, ni consulter une base de données, ni connaître la météo du jour, ni envoyer un courriel. L'**appel d'outils** (*tool use* ou *function calling*) lui permet de **demander** l'exécution d'une fonction que **votre application** met à sa disposition.

Point fondamental : **le modèle n'exécute rien**. Il produit une demande structurée (« appelle `obtenir_meteo` avec `{"ville": "Lyon"}` »). C'est votre code qui décide d'exécuter la fonction, puis renvoie le résultat au modèle, qui s'en sert pour poursuivre sa réponse.

```diagram
type: sequence
title: Le cycle d'un appel d'outil
actors: [Utilisateur, Application, Modèle]
messages:
  - from: 0
    to: 1
    text: "« Quel temps fait-il à Lyon ? »"
  - from: 1
    to: 2
    text: Question + définitions des outils disponibles
  - from: 2
    to: 1
    text: "tool_use : obtenir_meteo({ville : « Lyon »})"
  - from: 1
    to: 1
    text: Votre code exécute la fonction (API météo)
  - from: 1
    to: 2
    text: "tool_result : {temp : 18, ciel : « nuageux »}"
  - from: 2
    to: 1
    text: "« Il fait 18 °C à Lyon, ciel nuageux. »"
  - from: 1
    to: 0
    text: Réponse finale
```

Les usages sont innombrables : interroger une base de données, rechercher dans une documentation, appeler une API métier, effectuer un calcul exact, lire un fichier, créer un ticket…

# Définir un outil

Un outil se définit par trois éléments :

- un **nom** explicite ;
- une **description** détaillée : ce que fait l'outil, quand l'utiliser, ce qu'il renvoie, ses limites ;
- un **schéma d'entrée** (JSON Schema) décrivant les paramètres.

```python
outils = [
    {
        "name": "obtenir_meteo",
        "description": (
            "Renvoie la météo actuelle d'une ville : température en degrés Celsius "
            "et état du ciel. À utiliser uniquement pour la météo actuelle, pas pour des prévisions."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "ville": {"type": "string", "description": "Nom de la ville, par exemple « Lyon »"},
            },
            "required": ["ville"],
            "additionalProperties": False,
        },
        "strict": True,  # garantit que les arguments respectent exactement le schéma
    }
]
```

> [!TIP]
> La **description** est le facteur le plus important de la qualité des appels d'outils. Le modèle choisit d'utiliser un outil, et ses arguments, à partir de ce texte. Décrivez-le comme vous le feriez pour un nouveau collègue : à quoi il sert, quand ne pas l'utiliser, le format des paramètres, ce qui est renvoyé.

# La boucle d'exécution

Le modèle peut enchaîner plusieurs appels d'outils avant de répondre. On écrit donc une **boucle** : tant que le modèle demande des outils (`stop_reason == "tool_use"`), on les exécute et on lui renvoie les résultats.

```python
import json
import anthropic

client = anthropic.Anthropic()


def obtenir_meteo(ville: str) -> dict:
    # Ici, un vrai appel à une API météo ; valeurs fixes pour l'exemple
    donnees = {"lyon": {"temperature": 18, "ciel": "nuageux"}}
    if ville.lower() not in donnees:
        raise ValueError(f"Ville inconnue : {ville}")
    return donnees[ville.lower()]


FONCTIONS = {"obtenir_meteo": obtenir_meteo}


def executer_outil(nom: str, arguments: dict) -> dict:
    """Exécute un outil et renvoie un bloc tool_result (contenu et éventuelle erreur)."""
    try:
        resultat = FONCTIONS[nom](**arguments)
        return {"content": json.dumps(resultat, ensure_ascii=False)}
    except Exception as erreur:
        return {"content": f"Erreur : {erreur}", "is_error": True}


def repondre(question: str, max_tours: int = 10) -> str:
    messages = [{"role": "user", "content": question}]
    for _ in range(max_tours):
        reponse = client.messages.create(
            model="claude-opus-5-5",
            max_tokens=4096,
            tools=outils,
            messages=messages,
        )
        if reponse.stop_reason != "tool_use":
            return "".join(b.text for b in reponse.content if b.type == "text")

        # 1. On ajoute la réponse complète de l'assistant (avec ses blocs tool_use)
        messages.append({"role": "assistant", "content": reponse.content})

        # 2. On exécute TOUS les outils demandés et on renvoie TOUS les résultats
        #    dans un seul message utilisateur
        resultats = []
        for bloc in reponse.content:
            if bloc.type == "tool_use":
                resultats.append({
                    "type": "tool_result",
                    "tool_use_id": bloc.id,  # doit correspondre à l'id de la demande
                    **executer_outil(bloc.name, bloc.input),
                })
        messages.append({"role": "user", "content": resultats})

    return "Désolé, je n'ai pas pu terminer cette demande."


print(repondre("Quel temps fait-il à Lyon ?"))
```

Les points à respecter :

1. Ajouter la **réponse complète** de l'assistant à l'historique, avec ses blocs `tool_use`.
2. Renvoyer un `tool_result` pour **chaque** `tool_use`, avec le même identifiant.
3. Quand le modèle demande **plusieurs outils à la fois** (appels parallèles), renvoyer **tous les résultats dans un seul message**.
4. **Limiter le nombre de tours** pour éviter une boucle infinie.

> [!NOTE]
> Les SDK proposent aussi des aides qui gèrent cette boucle pour vous (chez Anthropic, un *tool runner* en version bêta dans le SDK). Écrire la boucle une fois à la main reste le meilleur moyen de comprendre ce qui se passe, et de la contrôler finement (journalisation, validation humaine…).

## Gérer les erreurs d'outils

Quand un outil échoue, **ne faites pas planter la boucle** : renvoyez un `tool_result` avec `is_error: True` et un message explicite. Le modèle peut alors corriger son appel (autre orthographe de la ville, autre paramètre) ou expliquer le problème à l'utilisateur.

## Choix de l'outil

Par défaut, le modèle **décide lui-même** s'il appelle un outil (`tool_choice` en mode `auto`). Certaines API permettent de forcer l'appel d'un outil précis, mais cette option n'est pas acceptée par tous les modèles : sur plusieurs modèles Claude récents, forcer un outil renvoie une erreur. Dans ce cas, on guide le modèle par le prompt (« utilise l'outil `obtenir_meteo` ») et on garantit le format des arguments avec `strict: True`. Si l'objectif est seulement d'obtenir du JSON, on préfère les **sorties structurées** (chapitre précédent).

# Concevoir de bons outils

## Pour le modèle

- **Peu d'outils, bien délimités** : trop d'outils proches les uns des autres provoquent des confusions. Un outil `rechercher_commandes(client_id, statut)` vaut mieux que cinq variantes.
- **Des noms et paramètres explicites** : `date_debut` au format AAAA-MM-JJ plutôt que `d1`.
- **Des résultats concis et utiles** : renvoyer 10 000 lignes brutes sature le contexte. Filtrez, paginez, résumez.
- **Des messages d'erreur exploitables** : « Client 4521 introuvable. Les identifiants clients sont des nombres à 6 chiffres. » plutôt que « Erreur 500 ».

## Pour la sécurité

> [!WARNING]
> Les arguments d'un appel d'outil sont produits par le modèle, et le modèle peut être influencé par du contenu malveillant (injection de prompt dans un document ou une page web). Traitez ces arguments comme des **entrées non fiables**.

- **Validez** les arguments (schéma strict, contrôles métier) avant d'exécuter.
- Appliquez le **principe du moindre privilège** : un outil de lecture n'a pas besoin de droits d'écriture ; un outil SQL ne doit accéder qu'aux tables nécessaires, idéalement en lecture seule.
- Vérifiez les **droits de l'utilisateur** : l'outil agit au nom de l'utilisateur connecté, jamais avec des droits d'administrateur.
- Exigez une **confirmation humaine** pour les actions sensibles ou irréversibles (paiement, suppression, envoi de courriel).
- **Journalisez** chaque appel d'outil (nom, arguments, résultat, utilisateur).

# Exercices

## Exercice 1 : Définir un outil

Définissez un outil `rechercher_produits` qui permet de chercher dans un catalogue par mot-clé, avec un filtre optionnel de prix maximum et une catégorie parmi « livres », « électronique », « maison ». Rédigez une description de qualité.

<details>
<summary>Voir la solution</summary>

```python
outil_recherche = {
    "name": "rechercher_produits",
    "description": (
        "Recherche des produits du catalogue par mot-clé. Renvoie au plus 10 produits "
        "(identifiant, nom, prix en euros, disponibilité). Utilise cet outil dès que l'utilisateur "
        "cherche un produit ou demande un prix. Ne l'utilise pas pour suivre une commande."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "mot_cle": {"type": "string", "description": "Termes de recherche, par exemple « lampe de bureau »"},
            "prix_max": {"type": "number", "description": "Prix maximum en euros (optionnel)"},
            "categorie": {"type": "string", "enum": ["livres", "électronique", "maison"]},
        },
        "required": ["mot_cle"],
        "additionalProperties": False,
    },
}
```

</details>

## Exercice 2 : Compléter la boucle

Ajoutez à l'exemple du cours un second outil `convertir_temperature(valeur, vers)` qui convertit des degrés Celsius en Fahrenheit (`vers="F"`) ou l'inverse (`vers="C"`). Testez la question : « Quel temps fait-il à Lyon, en Fahrenheit ? ». Combien d'appels d'outils sont nécessaires ?

<details>
<summary>Voir la solution</summary>

```python
def convertir_temperature(valeur: float, vers: str) -> dict:
    if vers == "F":
        return {"valeur": round(valeur * 9 / 5 + 32, 1), "unite": "F"}
    if vers == "C":
        return {"valeur": round((valeur - 32) * 5 / 9, 1), "unite": "C"}
    raise ValueError("Le paramètre vers doit valoir 'C' ou 'F'")


FONCTIONS["convertir_temperature"] = convertir_temperature
outils.append({
    "name": "convertir_temperature",
    "description": "Convertit une température entre Celsius et Fahrenheit. vers='F' convertit de Celsius vers Fahrenheit, vers='C' l'inverse.",
    "input_schema": {
        "type": "object",
        "properties": {
            "valeur": {"type": "number"},
            "vers": {"type": "string", "enum": ["C", "F"]},
        },
        "required": ["valeur", "vers"],
        "additionalProperties": False,
    },
})
```

Deux appels **successifs** sont nécessaires : d'abord `obtenir_meteo`, puis `convertir_temperature` avec la valeur obtenue (18 °C → 64,4 °F). La boucle gère cet enchaînement automatiquement. (Un modèle peut aussi effectuer cette conversion simple de lui-même ; l'outil garantit un calcul exact.)

</details>

## Exercice 3 : Revue de sécurité

Un collègue propose un outil `executer_sql(requete: str)` connecté à la base de production avec un compte administrateur, pour que l'assistant « réponde à toutes les questions sur les données ». Listez les risques et proposez une conception plus sûre.

<details>
<summary>Voir la solution</summary>

Risques : suppression ou modification de données (requêtes `DELETE`, `UPDATE`, `DROP`), fuite de données confidentielles (tables RH, mots de passe hachés), contournement des droits de l'utilisateur, requêtes très lourdes qui ralentissent la production, et exploitation par injection de prompt.

Conception plus sûre :
- des **outils spécialisés** (`chiffre_affaires_par_mois(annee)`, `commandes_client(client_id)`) avec des requêtes paramétrées écrites par les développeurs ;
- si du SQL libre est vraiment nécessaire : un compte **en lecture seule**, limité à des **vues** dédiées sans données sensibles, une base **réplique** plutôt que la production, un délai maximal d'exécution et une limite de lignes ;
- le filtrage par les **droits de l'utilisateur** connecté et la journalisation de chaque requête.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Donner des outils au modèle
center: Le modèle demande, votre code exécute, et garde le contrôle de chaque action.
points:
  - icon: tool
    title: Définir un outil
    text: Nom, description soignée et schéma d'entrée strict ; la description fait tout.
  - icon: loop
    title: La boucle
    text: Tant que stop_reason vaut tool_use, exécuter et renvoyer les tool_result.
  - icon: list
    title: Appels parallèles
    text: Un tool_result par tool_use, tous dans un seul message, avec le même identifiant.
  - icon: alert
    title: Erreurs d'outils
    text: Renvoyer is_error avec un message utile, sans faire planter la boucle.
  - icon: lock
    title: Sécurité
    text: Arguments non fiables, moindre privilège, confirmation humaine pour l'irréversible.
pitfall: Brancher un outil SQL libre sur la base de production avec un compte administrateur.
remember: Peu d'outils, bien décrits, aux droits minimaux, et une limite de tours sur la boucle.
```
