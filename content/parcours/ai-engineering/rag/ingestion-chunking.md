---
title: Ingestion et découpage des documents
description: Extraire un texte propre de documents réels, choisir une stratégie de découpage, enrichir les passages et maintenir la base à jour.
duration: 55
objectives:
  - Identifier les difficultés d'extraction selon les formats de documents
  - Comparer les stratégies de découpage (taille fixe, récursif, structurel)
  - Enrichir les passages avec des métadonnées et du contexte
  - Concevoir une ingestion incrémentale et idempotente
---

# Extraire un texte propre

La qualité d'un RAG se joue en grande partie **avant** toute recherche : si le texte extrait est mauvais, rien ne pourra le rattraper. Les documents réels sont rarement propres.

| Format | Difficultés typiques | Outils courants (Python) |
|---|---|---|
| PDF « texte » | Colonnes, en-têtes et pieds de page répétés, tableaux, césures | pypdf, PyMuPDF, pdfplumber |
| PDF scanné | Aucun texte : il faut de l'OCR | Tesseract, services d'OCR cloud, modèles de vision |
| HTML | Menus, publicités, scripts mêlés au contenu | BeautifulSoup, trafilatura |
| Word, PowerPoint | Mise en forme, notes, objets intégrés | python-docx, python-pptx |
| Mixte | Beaucoup de formats à gérer | Bibliothèques généralistes comme Unstructured ou Docling |

Bonnes pratiques :

- **Inspecter visuellement** un échantillon de textes extraits avant d'aller plus loin. C'est l'étape la plus rentable et la plus souvent négligée.
- **Conserver la structure** : titres, listes et tableaux (convertis par exemple en Markdown) aident à la fois le découpage et la compréhension par le modèle.
- **Supprimer le bruit** répété : en-têtes, pieds de page, numéros de page, mentions légales en double.
- Pour des documents très visuels (schémas, tableaux complexes), envisager des **modèles multimodaux** capables de lire directement les pages en image ou le PDF.

> [!TIP]
> Les LLM multimodaux récents acceptent directement des **PDF** ou des **images** de pages. Pour un petit nombre de documents complexes, leur confier l'extraction (vers du Markdown structuré) donne souvent de meilleurs résultats qu'un extracteur classique, au prix d'un coût plus élevé.

# Les stratégies de découpage

Les documents sont découpés en **passages** (*chunks*) pour deux raisons : un embedding représente mal un texte trop long (le sens se dilue), et on ne veut envoyer au modèle que les parties utiles.

Le dilemme :

- passages **trop courts** : précis, mais privés de contexte (« Il est fixé à 25 jours », qu'est-ce qui est fixé ?) ;
- passages **trop longs** : riches, mais l'embedding devient flou et on envoie beaucoup de texte inutile.

```diagram
type: compare
title: Trois stratégies de découpage
columns:
  - title: Taille fixe avec chevauchement
    tone: blue
    items:
      - "Ex. : 800 caractères, chevauchement de 100"
      - Simple et prévisible
      - Peut couper au milieu d'une phrase ou d'une idée
  - title: Récursif par séparateurs
    tone: violet
    items:
      - Découpe d'abord par sections, puis paragraphes, puis phrases
      - Respecte mieux les frontières naturelles
      - Bon choix par défaut
  - title: Structurel
    tone: teal
    items:
      - Suit la structure du document (titres, articles, questions de FAQ)
      - Passages cohérents sémantiquement
      - Nécessite un document bien structuré
```

## Le chevauchement

Un **chevauchement** (*overlap*) entre passages consécutifs, typiquement 10 à 20 % de leur taille, évite qu'une information coupée en deux soit perdue.

## Un découpage récursif simple

```python
def decouper(texte: str, taille_max: int = 1000, chevauchement: int = 150,
             separateurs: tuple[str, ...] = ("\n## ", "\n\n", "\n", ". ", " ")) -> list[str]:
    """Découpe récursivement un texte en essayant d'abord les séparateurs les plus « forts »."""
    if len(texte) <= taille_max:
        return [texte.strip()] if texte.strip() else []
    for sep in separateurs:
        morceaux = texte.split(sep)
        if len(morceaux) == 1:
            continue  # ce séparateur n'apparaît pas, on essaie le suivant
        passages, courant = [], ""
        for morceau in morceaux:
            candidat = f"{courant}{sep}{morceau}" if courant else morceau
            if len(candidat) <= taille_max:
                courant = candidat
            else:
                if courant:
                    passages.append(courant)
                courant = morceau
        if courant:
            passages.append(courant)
        # Redécoupe les morceaux encore trop longs, puis ajoute le chevauchement
        resultat: list[str] = []
        for p in passages:
            resultat.extend(decouper(p, taille_max, chevauchement, separateurs) if len(p) > taille_max else [p.strip()])
        return [
            (resultat[i - 1][-chevauchement:] + " " + r) if i > 0 and chevauchement else r
            for i, r in enumerate(resultat)
        ]
    # Aucun séparateur : découpage brut
    return [texte[i:i + taille_max] for i in range(0, len(texte), taille_max - chevauchement)]
```

En pratique, on utilise souvent des implémentations éprouvées, par exemple le `RecursiveCharacterTextSplitter` de LangChain, qui suit exactement cette logique. L'intérêt de l'écrire soi-même une fois est de comprendre ce que l'on paramètre.

> [!IMPORTANT]
> Il n'existe pas de taille de passage universellement optimale. Des valeurs de quelques centaines à un millier de tokens sont des points de départ courants, mais la bonne valeur dépend de vos documents, de vos questions et de votre modèle d'embeddings. **Mesurez** l'impact sur un jeu d'évaluation (chapitre 4).

# Enrichir les passages

## Les métadonnées

Chaque passage doit être stocké avec des **métadonnées** :

- **source** : identifiant du document, titre, URL, numéro de page ou de section ;
- **dates** : création, dernière modification ;
- **droits d'accès** : équipes ou rôles autorisés ;
- **type** : contrat, FAQ, procédure, ticket…

Elles servent à **citer** les sources, à **filtrer** la recherche (seulement les documents de 2026, seulement ceux auxquels l'utilisateur a accès) et à **mettre à jour** la base.

## Le contexte du passage

Un passage isolé perd le contexte de son document. Deux techniques simples :

1. **Préfixer** chaque passage par le titre du document et le chemin de sections : « Politique RH > Congés > Congés payés : Les salariés disposent de 25 jours… ».
2. **Contextualiser avec un LLM** : pour chaque passage, demander à un modèle de rédiger une ou deux phrases situant le passage dans le document, puis indexer « contexte + passage ». Anthropic a décrit cette méthode sous le nom de *Contextual Retrieval* (2024) et rapporté sur ses tests une réduction d'environ **49 %** des échecs de recherche (embeddings et BM25 contextualisés), et d'environ **67 %** en ajoutant un reranking. Le coût d'ingestion augmente, mais la mise en cache du prompt (le document entier étant répété pour chacun de ses passages) le réduit fortement.

```python
PROMPT_CONTEXTE = """<document>
{document}
</document>

Voici un passage extrait de ce document :
<passage>
{passage}
</passage>

Rédige une ou deux phrases qui situent ce passage dans le document, pour améliorer
sa recherche. Réponds uniquement avec ces phrases."""
```

# Maintenir la base à jour

Une base documentaire vit : documents ajoutés, modifiés, supprimés. L'ingestion doit être :

- **incrémentale** : ne retraiter que ce qui a changé, détecté par exemple grâce à une **empreinte** (hash) du contenu ;
- **idempotente** : relancer l'ingestion ne doit pas créer de doublons ;
- **complète** : la suppression d'un document doit supprimer **tous** ses passages (sinon le RAG cite des informations obsolètes).

```python
import hashlib


def empreinte(texte: str) -> str:
    return hashlib.sha256(texte.encode("utf-8")).hexdigest()


def synchroniser(document_id: str, texte: str, base) -> None:
    nouvelle = empreinte(texte)
    if base.empreinte_document(document_id) == nouvelle:
        return  # inchangé : rien à faire
    base.supprimer_passages(document_id)            # on retire l'ancienne version
    for i, passage in enumerate(decouper(texte)):
        base.inserer_passage(document_id, i, passage, calculer_embedding(passage))
    base.enregistrer_empreinte(document_id, nouvelle)
```

*(Les méthodes de `base` et la fonction `calculer_embedding` sont à implémenter selon votre stockage ; le chapitre suivant utilise PostgreSQL avec pgvector.)*

> [!WARNING]
> Les documents peuvent contenir des **données personnelles** ou des **instructions malveillantes** (injection de prompt indirecte, module 9). L'ingestion est le bon endroit pour filtrer, masquer ou marquer ces contenus.

# Exercices

## Exercice 1 : Choisir une stratégie

Proposez une stratégie de découpage pour chacun de ces corpus :

1. Une FAQ de 300 questions-réponses courtes.
2. Des contrats de 40 pages organisés en articles numérotés.
3. Des transcriptions de réunions sans structure.

<details>
<summary>Voir la solution</summary>

1. **Structurel** : une question et sa réponse forment un passage. Pas besoin de chevauchement.
2. **Structurel par article**, avec un découpage récursif des articles trop longs et un **préfixe** indiquant le contrat et le numéro d'article (« Contrat X > Article 12 – Résiliation »).
3. **Récursif** par paragraphes ou par prises de parole, avec **chevauchement**, et éventuellement une contextualisation par LLM (date, sujet de la réunion).

</details>

## Exercice 2 : Tester le découpage

Appliquez la fonction `decouper` du cours à un texte de votre choix d'environ 5 000 caractères, avec `taille_max=800` et `chevauchement=100`. Vérifiez que : (a) aucun passage ne dépasse largement 800 caractères, (b) le début de chaque passage reprend la fin du précédent. Que se passe-t-il avec `chevauchement=0` ?

<details>
<summary>Voir la solution</summary>

```python
texte = open("mon_document.txt", encoding="utf-8").read()
passages = decouper(texte, taille_max=800, chevauchement=100)
print(len(passages), max(len(p) for p in passages))
for a, b in zip(passages, passages[1:]):
    assert a[-100:].strip()[:20] in b  # le chevauchement est présent
```

Avec le chevauchement, un passage peut atteindre environ `taille_max + chevauchement` caractères. Avec `chevauchement=0`, les passages sont disjoints : une phrase coupée à la frontière perd son contexte, ce qui peut dégrader la recherche.

</details>

## Exercice 3 : Ingestion incrémentale

Expliquez ce qui se passe, avec la fonction `synchroniser` du cours, dans les trois cas suivants : le document est inchangé ; une phrase a été modifiée ; le document a été supprimé de la source. Quel cas la fonction ne gère-t-elle pas, et comment le traiter ?

<details>
<summary>Voir la solution</summary>

- **Inchangé** : l'empreinte est identique, rien n'est fait (pas de coût d'embedding).
- **Modifié** : l'empreinte change ; tous les anciens passages sont supprimés, puis le document est redécoupé et revectorisé. (Une version plus fine ne recalculerait que les passages modifiés.)
- **Supprimé** : la fonction n'est jamais appelée pour ce document, donc ses passages **restent dans la base**. Il faut une étape de **réconciliation** : comparer la liste des documents présents dans la source avec ceux de la base, et supprimer les passages des documents disparus.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Ingestion et découpage
center: La qualité d'un RAG se joue avant la recherche, dans l'extraction et le découpage.
points:
  - icon: file
    title: Extraire proprement
    text: Inspecter le texte extrait, garder la structure, retirer le bruit répété.
  - icon: ruler
    title: Taille des passages
    text: Trop courts = sans contexte ; trop longs = sens dilué. Se règle par la mesure.
  - icon: layers
    title: Stratégies de découpage
    text: Taille fixe, récursif par séparateurs (par défaut) ou structurel ; chevauchement de 10 à 20 %.
  - icon: list
    title: Métadonnées
    text: Source, dates, droits d'accès, type, pour citer, filtrer et mettre à jour.
  - icon: sparkles
    title: Contextualiser
    text: Préfixer le titre ou ajouter un court contexte généré pour chaque passage.
pitfall: "Oublier de supprimer les passages d'un document retiré : le RAG cite alors des informations obsolètes."
remember: L'ingestion doit être incrémentale, idempotente et complète, suppressions comprises.
```
