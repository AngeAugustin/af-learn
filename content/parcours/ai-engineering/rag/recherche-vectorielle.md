---
title: Recherche vectorielle, hybride et reranking
description: Stocker et interroger des embeddings avec PostgreSQL et pgvector, comprendre les index approximatifs, combiner recherche sémantique et lexicale, puis reclasser.
duration: 65
objectives:
  - Stocker et interroger des embeddings dans PostgreSQL avec pgvector
  - Expliquer la recherche approximative des plus proches voisins (HNSW)
  - Combiner recherche vectorielle et recherche lexicale (recherche hybride)
  - Améliorer la précision avec un reranker
---

# Où stocker les embeddings ?

Une **base vectorielle** stocke des vecteurs et sait retrouver rapidement les plus proches d'un vecteur donné. Plusieurs options existent :

| Option | Exemples | Quand la choisir |
|---|---|---|
| Extension d'une base existante | **pgvector** pour PostgreSQL | Vous utilisez déjà PostgreSQL ; volumes jusqu'à plusieurs millions de vecteurs |
| Base vectorielle dédiée | Qdrant, Weaviate, Milvus, Pinecone (service managé), Chroma | Très gros volumes, fonctionnalités avancées, équipe dédiée |
| Moteur de recherche | Elasticsearch, OpenSearch | Vous avez déjà un moteur de recherche plein texte |

**pgvector** est un excellent choix par défaut : vos passages, leurs métadonnées, les droits d'accès et le reste des données de l'application vivent dans **la même base**, avec des transactions, des sauvegardes et le SQL que vous connaissez déjà.

```video
url: https://www.youtube.com/watch?v=t9IDoenf-lo
title: "What is a Vector Database?"
channel: "IBM Technology"
duration: "8:11"
lang: en
why: "Un tour d'horizon rapide des bases vectorielles : ce qu'elles stockent, comment elles indexent et quand en avoir besoin."
```

# pgvector en pratique

> [!NOTE]
> **Rappel SQL express.** Une base relationnelle range les données dans des **tables** (lignes et colonnes typées). `CREATE TABLE` crée une table ; `INSERT INTO … VALUES` ajoute des lignes ; `SELECT colonnes FROM table WHERE condition ORDER BY critère LIMIT n` lit les lignes qui respectent la condition, triées, en n'en gardant que n. Un **index** accélère les recherches sur une colonne, au prix d'un peu de place et d'écritures plus lentes. Les paramètres `$1`, `$2` (ou `%s` en Python) se remplacent par des valeurs **passées séparément** : ne concaténez jamais une entrée utilisateur dans une requête SQL (injection SQL).

```sql
-- Activer l'extension (une fois par base)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE passages (
    id          bigserial PRIMARY KEY,
    document_id text      NOT NULL,
    position    int       NOT NULL,
    titre       text      NOT NULL,
    contenu     text      NOT NULL,
    equipe      text      NOT NULL,          -- pour filtrer selon les droits
    embedding   vector(384) NOT NULL         -- dimension du modèle d'embeddings
);

-- Les 5 passages les plus proches d'un vecteur de requête ($1), en distance cosinus
SELECT id, titre, contenu, 1 - (embedding <=> $1) AS similarite
FROM passages
WHERE equipe = 'rh'
ORDER BY embedding <=> $1
LIMIT 5;
```

Les opérateurs de distance de pgvector :

| Opérateur | Distance | Remarque |
|---|---|---|
| `<->` | Euclidienne (L2) | |
| `<#>` | Produit scalaire **négatif** | Négatif pour que « plus petit = plus proche » |
| `<=>` | Cosinus | Similarité cosinus = 1 − distance cosinus |

```python
# pip install "psycopg[binary]" pgvector sentence-transformers
import psycopg
from pgvector.psycopg import register_vector
from sentence_transformers import SentenceTransformer

encodeur = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

with psycopg.connect("postgresql://localhost/rag") as conn:
    register_vector(conn)  # permet de passer des tableaux numpy comme vecteurs
    question = "Combien de jours de télétravail sont autorisés ?"
    q = encodeur.encode(question, normalize_embeddings=True)
    lignes = conn.execute(
        "SELECT titre, contenu, 1 - (embedding <=> %s) AS sim "
        "FROM passages ORDER BY embedding <=> %s LIMIT 5",
        (q, q),
    ).fetchall()
    for titre, contenu, sim in lignes:
        print(f"{sim:.3f}  {titre}")
```

> [!TIP]
> Le filtre `WHERE equipe = 'rh'` illustre un avantage majeur de pgvector : on combine librement recherche vectorielle et conditions SQL classiques (droits d'accès, dates, type de document). C'est ainsi qu'on garantit qu'un utilisateur ne retrouve que les documents auxquels il a droit.

# La recherche approximative

Sans index, la base compare la requête à **tous** les vecteurs : c'est une recherche **exacte**, parfaite pour quelques milliers ou dizaines de milliers de passages, mais trop lente pour des millions.

Les **index de plus proches voisins approximatifs** (ANN, *Approximate Nearest Neighbors*) accélèrent considérablement la recherche, au prix d'une petite perte de **rappel** : on retrouve *presque toujours* les vrais plus proches voisins.

```diagram
type: custom
name: vector-search
caption: La requête (étoile) est comparée aux passages. La recherche exacte examine tous les points ; un index approximatif comme HNSW parcourt un graphe de voisinage pour n'en examiner qu'une petite partie.
```

pgvector propose deux types d'index :

- **HNSW** (*Hierarchical Navigable Small World*, Malkov et Yashunin) : un graphe hiérarchique de voisins, très bon compromis vitesse/rappel. Construction plus lente et plus gourmande en mémoire. C'est en général le choix recommandé.
- **IVFFlat** : partitionne les vecteurs en listes ; construction rapide, mais rappel plus sensible au paramétrage, et l'index doit être créé une fois les données chargées.

```sql
CREATE INDEX ON passages USING hnsw (embedding vector_cosine_ops);

-- Au moment de la requête : plus ef_search est grand, meilleur est le rappel (et plus lente la requête)
SET hnsw.ef_search = 100;
```

> [!IMPORTANT]
> La classe d'opérateurs de l'index doit correspondre à l'opérateur utilisé dans la requête : `vector_cosine_ops` pour `<=>`, `vector_l2_ops` pour `<->`, `vector_ip_ops` pour `<#>`. Sinon l'index n'est pas utilisé. Vérifiez avec `EXPLAIN`.

# La recherche hybride

La recherche vectorielle excelle sur le **sens** (« perdu mes identifiants » retrouve « réinitialiser le mot de passe »), mais elle peut rater des **termes exacts** : références produit (« XR-2045 »), noms propres, codes d'erreur, acronymes internes. La recherche **lexicale** (par mots-clés), elle, est excellente sur ces cas.

La **recherche hybride** combine les deux :

```diagram
type: flow
title: Recherche hybride avec fusion des rangs
steps:
  - title: Question
    text: "« Erreur XR-2045 au démarrage »"
  - title: Deux recherches
    text: Vectorielle (sens) et lexicale (mots exacts), chacune donne un classement
  - title: Fusion (RRF)
    text: Score = somme des 1 / (k + rang) dans chaque classement
  - title: Résultat
    text: Les passages bien classés par l'une ou l'autre méthode remontent
```

- La recherche lexicale de référence est **BM25**, implémentée dans Elasticsearch, OpenSearch et de nombreuses bibliothèques. PostgreSQL propose sa propre **recherche plein texte** (`tsvector`, `ts_rank`), dont le classement diffère de BM25 mais qui est souvent suffisante.
- La **Reciprocal Rank Fusion** (RRF, Cormack et al., 2009) combine des classements sans avoir à harmoniser des scores d'échelles différentes : score = Σ 1 / (k + rang), avec k = 60 couramment.

```python
def fusion_rrf(classements: list[list[str]], k: int = 60) -> list[str]:
    """Combine plusieurs listes d'identifiants classés (du meilleur au moins bon)."""
    scores: dict[str, float] = {}
    for classement in classements:
        for rang, identifiant in enumerate(classement, start=1):
            scores[identifiant] = scores.get(identifiant, 0.0) + 1 / (k + rang)
    return sorted(scores, key=scores.get, reverse=True)


vectoriel = ["p7", "p2", "p9", "p4"]
lexical = ["p4", "p7", "p1"]
print(fusion_rrf([vectoriel, lexical]))  # ['p7', 'p4', 'p2', 'p9', 'p1']
```

```sql
-- Recherche plein texte PostgreSQL (configuration française)
ALTER TABLE passages ADD COLUMN contenu_tsv tsvector
    GENERATED ALWAYS AS (to_tsvector('french', contenu)) STORED;
CREATE INDEX ON passages USING gin (contenu_tsv);

SELECT id, ts_rank(contenu_tsv, requete) AS score
FROM passages, websearch_to_tsquery('french', 'erreur XR-2045 démarrage') AS requete
WHERE contenu_tsv @@ requete
ORDER BY score DESC
LIMIT 20;
```

# Le reranking

La recherche par embeddings compare deux vecteurs calculés **séparément** (question d'un côté, passage de l'autre) : c'est rapide, mais approximatif. Un **reranker** (souvent un modèle de type *cross-encoder*) lit **ensemble** la question et chaque passage, et produit un score de pertinence bien plus fin. Il est trop lent pour toute la base, mais parfait pour **reclasser** quelques dizaines de candidats.

```diagram
type: flow
title: Recherche en deux temps
steps:
  - title: Recherche large
    text: "Hybride, top 50 candidats : rapide"
  - title: Reranking
    text: Le reranker note chaque paire (question, passage)
  - title: Sélection
    text: "Top 5 transmis au LLM : précis"
```

Options : rerankers par API (par exemple Cohere, Voyage AI) ou modèles open-weight (par exemple de la famille `bge-reranker`), utilisables avec `sentence-transformers` :

```python
from sentence_transformers import CrossEncoder

reranker = CrossEncoder("BAAI/bge-reranker-v2-m3")  # modèle multilingue
question = "Combien de jours de télétravail ?"
candidats = ["Le télétravail est possible jusqu'à trois jours par semaine...",
             "Les congés payés sont de 25 jours par an...",
             "Le matériel de télétravail est fourni par l'entreprise..."]
scores = reranker.predict([(question, c) for c in candidats])
classement = sorted(zip(candidats, scores), key=lambda x: x[1], reverse=True)
```

> [!NOTE]
> Chaque brique (hybride, reranking, contextualisation) ajoute de la complexité, de la latence et parfois un coût. Ajoutez-les **une par une**, en mesurant leur gain sur votre jeu d'évaluation.

# Exercices

## Exercice 1 : Écrire la requête SQL

Écrivez la requête pgvector qui renvoie les 8 passages les plus proches d'un vecteur `$1` (distance cosinus), uniquement parmi les documents de type `'procedure'` modifiés depuis le 1er janvier 2026, en supposant des colonnes `type_doc` et `modifie_le`.

<details>
<summary>Voir la solution</summary>

```sql
SELECT id, titre, contenu, 1 - (embedding <=> $1) AS similarite
FROM passages
WHERE type_doc = 'procedure'
  AND modifie_le >= '2026-01-01'
ORDER BY embedding <=> $1
LIMIT 8;
```

Remarque : avec un index HNSW, les filtres très sélectifs peuvent réduire le nombre de résultats renvoyés, car le filtrage s'applique après le parcours de l'index. Les versions récentes de pgvector proposent des options pour atténuer ce problème (parcours itératif de l'index) ; consultez la documentation de votre version.

</details>

## Exercice 2 : Calculer une fusion RRF

Avec k = 60, calculez le score RRF des passages A, B et C à partir des classements suivants : vectoriel = [A, B, C] ; lexical = [C, A]. Quel est l'ordre final ?

<details>
<summary>Voir la solution</summary>

- A : 1/61 + 1/62 ≈ 0,016393 + 0,016129 = **0,032522**
- B : 1/62 ≈ **0,016129**
- C : 1/63 + 1/61 ≈ 0,015873 + 0,016393 = **0,032266**

Ordre final : **A, C, B**. C, absent du top du classement vectoriel mais premier en lexical, dépasse B.

</details>

## Exercice 3 : Choisir les briques

Votre RAG de support technique répond mal aux questions qui contiennent des codes d'erreur (« E-4012 »), mais bien aux questions formulées en langage naturel. Quelle brique ajouter en priorité, et comment vérifier son effet ?

<details>
<summary>Voir la solution</summary>

Ajouter la **recherche lexicale** (BM25 ou recherche plein texte) combinée à la recherche vectorielle par **fusion RRF** : les codes d'erreur sont des termes exacts que les embeddings capturent mal. Vérification : constituer un jeu de questions contenant des codes d'erreur, avec les passages attendus, et mesurer le **rappel@k** (le passage attendu figure-t-il parmi les k premiers résultats ?) avant et après, sans oublier de vérifier que les questions en langage naturel ne se dégradent pas.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Recherche vectorielle, hybride et reranking
center: Combiner le sens et les mots exacts, puis reclasser finement les meilleurs candidats.
points:
  - icon: database
    title: pgvector
    text: Vecteurs et données métier dans PostgreSQL ; opérateur <=> pour la distance cosinus.
  - icon: network
    title: Index HNSW
    text: Recherche approximative très rapide, au prix d'un léger rappel en moins.
  - icon: filter
    title: Filtres SQL
    text: Droits d'accès, dates, type de document combinés à la recherche vectorielle.
  - icon: search
    title: Recherche hybride
    text: Vectoriel + lexical (BM25 ou plein texte) fusionnés par RRF, score 1/(k + rang).
  - icon: target
    title: Reranking
    text: Un cross-encoder note chaque paire question-passage ; top 50 puis top 5.
pitfall: "Créer l'index avec une classe d'opérateurs différente de l'opérateur de la requête : il n'est pas utilisé."
remember: Ajoutez chaque brique une par une et gardez-la seulement si l'évaluation montre un gain.
```
