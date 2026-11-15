---
title: Ingérer les données de façon fiable
description: Chargement complet ou incrémental, filigrane, capture des changements (CDC), idempotence, rattrapage historique, données en retard et outils d'ingestion.
duration: 60
objectives:
  - Choisir entre chargement complet, incrémental et CDC
  - Concevoir une ingestion idempotente et rejouable
  - Gérer les données en retard, les rattrapages et les changements de schéma
  - Connaître les principaux outils d'ingestion
---

# Les trois stratégies d'extraction

```diagram
type: compare
title: Comment extraire les données d'une source
columns:
  - title: Chargement complet
    tone: blue
    items:
      - Tout relire à chaque exécution
      - Simple, capte aussi les suppressions
      - Inadapté aux grosses tables
  - title: Incrémental par filigrane
    tone: teal
    items:
      - Lire ce qui a changé depuis la dernière fois
      - S'appuie sur une colonne mis_a_jour_le
      - Ne voit pas les suppressions physiques
  - title: Capture des changements (CDC)
    tone: amber
    items:
      - Lire le journal de transactions de la base
      - Chaque insertion, modification, suppression
      - Plus complexe à exploiter
```

## Le chargement complet

On relit toute la table source et on **remplace** la copie. C'est la méthode la plus simple et la plus robuste pour les petites tables (référentiels de quelques milliers ou millions de lignes) : elle capte automatiquement les modifications **et** les suppressions. Elle devient trop lente et trop coûteuse pour les grandes tables.

## L'incrémental par filigrane

On mémorise un **filigrane** (*watermark*) : la plus grande valeur de `mis_a_jour_le` déjà extraite. À l'exécution suivante, on ne lit que les lignes plus récentes.

```python
def extraire_incremental(connexion_source, etat) -> list[dict]:
    filigrane = etat.lire("commandes", defaut="1970-01-01T00:00:00+00:00")
    lignes = connexion_source.execute(
        """
        SELECT * FROM commandes
        WHERE mis_a_jour_le > %(filigrane)s::timestamptz - INTERVAL '10 minutes'
        ORDER BY mis_a_jour_le
        """,
        {"filigrane": filigrane},
    ).fetchall()
    return lignes   # le filigrane n'est avancé qu'après un chargement réussi
```

Points d'attention :

- la colonne doit être **fiable** : mise à jour à **chaque** modification (vérifiez qu'aucun script ne modifie les lignes sans la toucher) ;
- une **marge** de recouvrement (ici 10 minutes) couvre les transactions longues validées après coup ; le chargement doit donc être un **upsert** pour ne pas dupliquer ;
- le filigrane n'est **avancé qu'après** un chargement réussi ;
- les **suppressions physiques** sont invisibles : préférez des suppressions logiques (`supprime_le`) dans la source, ou un chargement complet périodique de contrôle.

## La capture des changements (CDC)

Les bases de données enregistrent toutes les modifications dans un **journal de transactions** (le WAL de PostgreSQL, le binlog de MySQL) pour leur propre fonctionnement. Le **CDC basé sur le journal** lit ce journal et publie chaque insertion, modification et suppression comme un **événement**, avec l'état avant et après.

```diagram
type: flow
title: CDC basé sur le journal de transactions
steps:
  - title: Base source
    text: Écrit chaque modification dans son journal (WAL, binlog)
    tone: blue
  - title: Connecteur CDC
    text: Lit le journal (par exemple Debezium)
    tone: amber
  - title: Flux d'événements
    text: Insertions, modifications, suppressions (souvent via Kafka)
    tone: amber
  - title: Destination
    text: Lakehouse ou entrepôt, appliqué par MERGE
    tone: teal
```

Avantages : **toutes** les modifications (y compris les suppressions et les états intermédiaires), une charge minimale sur la source, une latence de quelques secondes. Inconvénients : une configuration côté base (réplication logique dans PostgreSQL, par exemple), une infrastructure à exploiter (souvent Kafka, module 7) et une gestion fine de l'ordre des événements. **Debezium** est l'outil open source de référence ; la plupart des outils d'ingestion commerciaux proposent aussi du CDC.

> [!WARNING]
> Lire le journal impose de **conserver** les segments de journal non encore lus. Un connecteur CDC arrêté trop longtemps peut faire grossir le disque de la base de production jusqu'à la saturation (avec les *replication slots* de PostgreSQL notamment). Supervisez le retard du connecteur.

# L'idempotence

Un traitement est **idempotent** si l'exécuter plusieurs fois donne **le même résultat** qu'une seule fois. C'est la propriété la plus importante d'un pipeline : les pannes arrivent, les traitements sont relancés, à la main ou automatiquement.

Les techniques, déjà rencontrées :

1. **Écraser une partition** entière : chaque exécution remplace complètement les données de **sa** période (`DELETE` puis `INSERT` de la journée du 2 mars dans une transaction, ou `INSERT OVERWRITE` d'une partition).
2. **Upsert / MERGE** sur une clé unique.
3. **Paramétrer par la période traitée**, et non par « maintenant » : un traitement lancé pour le 2 mars doit produire le même résultat qu'il soit exécuté le 3 mars ou rejoué le 20 avril.

```python
# Mauvais : dépend de l'heure d'exécution
debut = datetime.now(timezone.utc) - timedelta(days=1)

# Bon : la période est un paramètre fourni par l'orchestrateur
def traiter(jour: date) -> None:
    debut = datetime.combine(jour, time.min, tzinfo=timezone.utc)
    fin = debut + timedelta(days=1)
    ...
```

> [!IMPORTANT]
> « Paramétré par la période » est ce qui rend possible le **rattrapage** (*backfill*) : recalculer six mois d'historique après la correction d'un bug revient à lancer le même traitement pour chacune des journées concernées.

# Les aléas de la réalité

## Les données en retard

Un événement daté du 2 mars peut arriver le 5 mars (mobile hors ligne, partenaire en retard). Si la partition du 2 mars est déjà calculée, elle est incomplète. Solutions : recalculer une **fenêtre glissante** de quelques jours à chaque exécution, ou partitionner par **date de chargement** pour les données brutes et réconcilier ensuite.

## Les changements de schéma

Une source ajoute une colonne, en renomme une autre, change un type. Politiques possibles :

- **accepter** automatiquement les ajouts de colonnes (sans casser les modèles en aval) ;
- **bloquer** et alerter sur les suppressions, renommages et changements de type ;
- formaliser l'interface avec l'équipe productrice : c'est l'idée des **contrats de données** (module 8).

## Les données invalides

Une ligne mal formée ne doit pas faire échouer toute l'ingestion, mais ne doit pas non plus disparaître silencieusement. On l'écarte dans une **file de quarantaine** (*dead letter*), avec la raison du rejet, et on surveille son volume.

# Les outils d'ingestion

Écrire et maintenir des connecteurs pour des dizaines d'API SaaS (CRM, paiement, publicité) est un travail ingrat : leurs API changent régulièrement. Des outils spécialisés fournissent des connecteurs prêts à l'emploi :

| Outil | Modèle | Particularité |
|---|---|---|
| **Fivetran** | Service commercial | Des centaines de connecteurs gérés, facturation à l'usage |
| **Airbyte** | Open source et offre cloud | Nombreux connecteurs, possibilité d'en créer |
| **dlt** (data load tool) | Bibliothèque Python open source | Ingestion écrite en Python, schéma inféré, incrémental intégré |
| **Debezium** | Open source | CDC depuis les bases de données |
| Services cloud | AWS DMS, Google Datastream, Azure Data Factory… | Intégrés à chaque cloud |

```diagram
type: decision
title: Construire ou utiliser un connecteur ?
nodes:
  - question: Un connecteur maintenu existe-t-il pour cette source ?
    yes: L'utiliser, après avoir vérifié coût, fiabilité et conformité
    no: Question suivante
  - question: La source est-elle une base de données dont il faut toutes les modifications ?
    yes: CDC (Debezium ou service cloud)
    no: Écrire un connecteur, par exemple avec dlt, en suivant les règles de ce chapitre
```

# Exercices

## Exercice 1 : Choisir la stratégie

Quelle stratégie d'extraction pour :

1. La table `pays` (250 lignes).
2. La table `commandes` (400 millions de lignes, colonne `mis_a_jour_le` fiable, suppressions logiques).
3. La table `soldes_comptes` d'une banque, dont on doit connaître chaque modification, y compris les suppressions.

<details>
<summary>Voir la solution</summary>

1. **Chargement complet** : minuscule, aucun intérêt à faire plus compliqué.
2. **Incrémental par filigrane** sur `mis_a_jour_le`, avec marge et upsert ; les suppressions logiques sont des modifications comme les autres.
3. **CDC basé sur le journal** : seul moyen de capter toutes les modifications, y compris les états intermédiaires et les suppressions.

</details>

## Exercice 2 : Rendre idempotent

Ce traitement quotidien est lancé chaque nuit à 2 h. Relevez les problèmes d'idempotence et proposez une version corrigée.

```python
def job():
    hier = date.today() - timedelta(days=1)
    lignes = extraire_ventes(hier)
    entrepot.execute("INSERT INTO ventes VALUES ...", lignes)
```

<details>
<summary>Voir la solution</summary>

1. La date dépend de **l'heure d'exécution** (`date.today()`) : rejoué le lendemain, il traite le mauvais jour. Le fuseau horaire est en plus implicite.
2. `INSERT` simple : une relance après un échec partiel **duplique** les lignes.

```python
def job(jour: date) -> None:                      # jour fourni par l'orchestrateur
    lignes = extraire_ventes(jour)
    with entrepot.transaction():
        entrepot.execute("DELETE FROM ventes WHERE jour_vente = %s", (jour,))
        entrepot.inserer("ventes", lignes)
```

Le traitement peut désormais être rejoué pour n'importe quel jour, autant de fois que nécessaire, avec le même résultat.

</details>

## Exercice 3 : Le disque qui se remplit

Le disque de la base PostgreSQL de production se remplit soudainement, alors que le volume de données n'a pas changé. L'équipe data a installé un connecteur CDC le mois dernier, arrêté depuis une semaine pour maintenance. Quel est le lien ?

<details>
<summary>Voir la solution</summary>

Le connecteur CDC utilise un **slot de réplication logique** : PostgreSQL conserve tous les segments de WAL que le slot n'a pas encore consommés. Connecteur arrêté = WAL qui s'accumule indéfiniment. Solutions : redémarrer le connecteur pour qu'il rattrape son retard ; si ce n'est pas possible, **supprimer le slot** (puis refaire un chargement initial) ; à l'avenir, superviser le retard des slots et fixer une limite de rétention (`max_slot_wal_keep_size`).

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Ingérer de façon fiable
center: Extraire avec la bonne stratégie, et pouvoir rejouer n'importe quelle période sans dommage.
points:
  - icon: database
    title: Complet ou incrémental
    text: Complet pour les petites tables, filigrane fiable avec marge et upsert pour les grandes.
  - icon: loop
    title: CDC
    text: Lire le journal de la base pour tout capter, suppressions comprises ; surveiller le retard.
  - icon: check
    title: Idempotence
    text: Écraser une partition ou faire un MERGE ; même résultat à chaque relance.
  - icon: clock
    title: Paramétré par la période
    text: Jamais « maintenant » ; c'est ce qui rend les rattrapages possibles.
  - icon: alert
    title: Aléas
    text: Données en retard, schémas qui changent, lignes invalides mises en quarantaine.
pitfall: Un traitement qui dépend de l'heure d'exécution et insère sans précaution, impossible à rejouer.
remember: Les pannes sont certaines ; seule l'idempotence rend leurs relances sans danger.
```
