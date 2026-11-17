---
title: Sorties structurées et validation
description: "Obtenir des données exploitables par le code : schémas JSON, sorties structurées des API, validation Pydantic et stratégies de repli."
duration: 50
objectives:
  - Expliquer pourquoi le texte libre ne suffit pas pour alimenter du code
  - Décrire une sortie attendue avec un schéma JSON ou un modèle Pydantic
  - Utiliser les sorties structurées d'une API de LLM
  - Valider les sorties et prévoir des replis robustes
---

# Pourquoi structurer les sorties ?

Dès que la réponse d'un modèle doit être **utilisée par du code** (enregistrée en base, affichée dans des champs, passée à une autre API), le texte libre devient un problème. Même avec un prompt très clair, on peut obtenir :

- une phrase d'introduction avant le JSON (« Voici le résultat : ») ;
- un JSON mal formé (virgule en trop, guillemets manquants) ;
- un champ manquant, mal nommé ou d'un mauvais type ;
- une valeur hors de la liste autorisée.

Les **sorties structurées** résolvent ce problème à la source : on décrit le format attendu avec un **schéma**, et l'API contraint la génération pour qu'elle respecte ce schéma.

```diagram
type: flow
title: Du schéma à l'objet validé
steps:
  - title: Modèle Pydantic
    text: Description typée des données attendues
  - title: Schéma JSON
    text: Généré automatiquement et transmis à l'API
  - title: Génération contrainte
    text: Le modèle produit un JSON conforme au schéma
  - title: Validation
    text: Pydantic vérifie types et contraintes métier
  - title: Objet Python
    text: Utilisable directement dans le code
```

# Décrire la sortie attendue

Un **schéma JSON** (*JSON Schema*) décrit la structure d'un document JSON : types, champs obligatoires, valeurs autorisées. En Python, on l'écrit rarement à la main : on le génère à partir d'un modèle Pydantic.

```python
from typing import Literal
from pydantic import BaseModel, Field


class Facture(BaseModel):
    fournisseur: str = Field(description="Nom du fournisseur tel qu'il apparaît sur la facture")
    numero: str
    date_emission: str = Field(description="Date au format AAAA-MM-JJ")
    montant_ttc: float
    devise: Literal["EUR", "USD", "GBP", "XOF", "autre"]
    lignes: list[str] = Field(description="Libellés des lignes de la facture")


print(Facture.model_json_schema())
```

Les **descriptions** des champs font partie du prompt : elles guident le modèle. Soignez-les comme vous soigneriez vos instructions.

> [!TIP]
> Prévoyez dans le schéma la possibilité d'une **absence d'information** : un champ optionnel (`str | None`) ou une valeur explicite comme `"inconnu"`. Sinon, contraint de remplir un champ obligatoire, le modèle risque d'inventer une valeur.

# Les sorties structurées des API

Les principaux fournisseurs proposent des sorties structurées garanties par un schéma JSON. Avec le SDK Python d'Anthropic, la méthode `messages.parse` accepte directement un modèle Pydantic et renvoie un objet validé :

```python
import anthropic

client = anthropic.Anthropic()

texte_facture = """FACTURE N° 2026-0412 - Imprimerie Dupont SARL
Date : 3 septembre 2026
- 500 flyers A5 recto-verso ........ 120,00 €
- Livraison ........................ 15,00 €
Total TTC : 135,00 €"""

reponse = client.messages.parse(
    model="claude-opus-5-5",
    max_tokens=2048,
    messages=[{
        "role": "user",
        "content": f"Extrais les informations de cette facture.\n\n<facture>\n{texte_facture}\n</facture>",
    }],
    output_format=Facture,
)

facture = reponse.parsed_output  # instance de Facture, déjà validée
print(facture.numero, facture.montant_ttc, facture.devise)
```

Sans Pydantic, on peut passer un schéma JSON brut avec `messages.create(..., output_config={"format": {"type": "json_schema", "schema": {...}}})`, puis lire le texte JSON renvoyé avec `json.loads`.

> [!NOTE]
> Chez OpenAI, la fonctionnalité équivalente s'appelle également *Structured Outputs* et accepte un schéma JSON ou un modèle Pydantic via son SDK. Les schémas acceptés ont des **restrictions** (certains mots-clés de JSON Schema ne sont pas pris en charge, les objets doivent souvent interdire les propriétés supplémentaires) : consultez la documentation du fournisseur.

## Ce que garantit la génération contrainte, et ce qu'elle ne garantit pas

| Garanti par le schéma | Non garanti |
|---|---|
| JSON valide | Que les valeurs soient **exactes** |
| Champs obligatoires présents | Que la date extraite soit la bonne |
| Types respectés | Que le montant corresponde à la facture |
| Valeurs dans une liste fermée (`enum`) | Le respect de règles métier complexes |

Autrement dit : la **forme** est garantie, pas le **fond**. Une extraction peut être parfaitement formée et fausse.

```video
url: https://www.youtube.com/watch?v=xpvFinvqRCA
title: "Structured Output from LLMs: Grammars, Regex, and State Machines"
channel: "Efficient NLP"
duration: "17:20"
lang: en
why: "Comment les sorties structurées sont garanties sous le capot : grammaires, expressions régulières et décodage contraint."
```

# Valider le fond et prévoir des replis

## Les validations métier

Ajoutez dans votre code les vérifications que le schéma ne peut pas exprimer :

```python
from datetime import date
from pydantic import field_validator


class FactureValidee(Facture):
    @field_validator("date_emission")
    @classmethod
    def date_valide(cls, valeur: str) -> str:
        jour = date.fromisoformat(valeur)  # lève une erreur si le format est invalide
        if jour > date.today():
            raise ValueError("La date d'émission ne peut pas être dans le futur")
        return valeur

    @field_validator("montant_ttc")
    @classmethod
    def montant_positif(cls, valeur: float) -> float:
        if valeur <= 0:
            raise ValueError("Le montant doit être positif")
        return valeur
```

On peut aussi effectuer des **contrôles croisés** : la somme des lignes correspond-elle au total ? Le numéro de facture existe-t-il déjà ?

## Les stratégies de repli

Que faire quand la validation échoue ?

1. **Réessayer** en renvoyant au modèle l'erreur de validation (« le champ date_emission est invalide : … ; corrige ta réponse »). Limitez le nombre de tentatives.
2. **Signaler pour revue humaine** : marquer le document comme « à vérifier » plutôt que d'enregistrer une donnée douteuse.
3. **Appliquer une valeur par défaut sûre** quand c'est acceptable (catégorie « autre » par exemple).

```python
from pydantic import ValidationError


def extraire_facture(texte: str, tentatives: int = 2) -> FactureValidee | None:
    messages = [{"role": "user", "content": f"Extrais les informations de cette facture.\n\n<facture>\n{texte}\n</facture>"}]
    for _ in range(tentatives):
        reponse = client.messages.parse(
            model="claude-opus-5-5", max_tokens=2048, messages=messages, output_format=Facture,
        )
        try:
            return FactureValidee.model_validate(reponse.parsed_output.model_dump())
        except ValidationError as erreur:
            messages += [
                {"role": "assistant", "content": reponse.content},
                {"role": "user", "content": f"La validation a échoué : {erreur}. Corrige l'extraction."},
            ]
    return None  # l'appelant place le document en file de revue humaine
```

> [!IMPORTANT]
> Ne réessayez pas indéfiniment : chaque tentative coûte des tokens et du temps. Deux ou trois tentatives, puis un repli explicite (revue humaine, erreur claire), constituent une stratégie saine.

# Exercices

## Exercice 1 : Concevoir un schéma

Concevez un modèle Pydantic pour extraire d'une offre d'emploi : l'intitulé du poste, le type de contrat (CDI, CDD, stage, alternance, freelance, non précisé), la ville, le télétravail (aucun, partiel, total, non précisé), le salaire minimum et maximum s'ils sont indiqués, et la liste des compétences demandées.

<details>
<summary>Voir la solution</summary>

```python
from typing import Literal
from pydantic import BaseModel, Field


class OffreEmploi(BaseModel):
    intitule: str
    contrat: Literal["CDI", "CDD", "stage", "alternance", "freelance", "non précisé"]
    ville: str | None = Field(description="Ville du poste, null si absente")
    teletravail: Literal["aucun", "partiel", "total", "non précisé"]
    salaire_min: float | None = Field(description="Salaire annuel brut minimum, null si non indiqué")
    salaire_max: float | None = Field(description="Salaire annuel brut maximum, null si non indiqué")
    competences: list[str]
```

Points clés : des listes fermées avec une valeur « non précisé », des champs optionnels pour les informations souvent absentes (pour ne pas forcer le modèle à inventer), et des descriptions qui précisent les unités.

</details>

## Exercice 2 : Validation métier

Ajoutez au modèle de l'exercice 1 une validation qui vérifie que `salaire_min` est inférieur ou égal à `salaire_max` lorsque les deux sont présents.

<details>
<summary>Voir la solution</summary>

```python
from pydantic import model_validator


class OffreEmploiValidee(OffreEmploi):
    @model_validator(mode="after")
    def verifier_salaires(self) -> "OffreEmploiValidee":
        if self.salaire_min is not None and self.salaire_max is not None:
            if self.salaire_min > self.salaire_max:
                raise ValueError("salaire_min doit être inférieur ou égal à salaire_max")
        return self
```

Un validateur de modèle (`model_validator`) est nécessaire car la règle porte sur **deux** champs à la fois.

</details>

## Exercice 3 : Forme ou fond ?

Pour chacune de ces erreurs, indiquez si les sorties structurées l'empêchent :

1. Le modèle renvoie `"montant": "cent euros"` alors que le schéma attend un nombre.
2. Le modèle renvoie un montant de 1 350,00 au lieu de 135,00.
3. Le modèle omet le champ obligatoire `numero`.
4. Le modèle attribue la facture au mauvais fournisseur.

<details>
<summary>Voir la solution</summary>

1. **Empêché** : le type est imposé par le schéma.
2. **Non empêché** : c'est une erreur sur le fond ; un contrôle croisé (somme des lignes) peut la détecter.
3. **Empêché** : les champs obligatoires sont garantis.
4. **Non empêché** : seule une vérification métier (référentiel de fournisseurs, revue) peut la repérer.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Sorties structurées et validation
center: Le schéma garantit la forme ; la validation métier vérifie le fond.
points:
  - icon: file
    title: Décrire la sortie
    text: Un modèle Pydantic, dont les descriptions de champs guident le modèle.
  - icon: shield
    title: Génération contrainte
    text: messages.parse renvoie un objet validé ; plus de JSON mal formé.
  - icon: alert
    title: Prévoir l'absence
    text: Des champs optionnels ou « non précisé » pour ne pas forcer l'invention.
  - icon: check
    title: Validations métier
    text: Dates plausibles, montants positifs, contrôles croisés comme somme des lignes = total.
  - icon: loop
    title: Replis bornés
    text: Réessayer 2 ou 3 fois avec l'erreur, puis revue humaine.
pitfall: "Croire qu'un JSON valide est forcément exact : une extraction peut être bien formée et fausse."
remember: Schéma pour la forme, code métier pour le fond, humain quand le doute persiste.
```
