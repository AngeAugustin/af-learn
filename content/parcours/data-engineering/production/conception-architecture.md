---
title: Concevoir une architecture de données
description: "Une méthode pour passer d'un besoin flou à une architecture argumentée : exigences, estimations chiffrées, architectures de référence, compromis explicites et décisions documentées."
duration: 60
objectives:
  - Transformer un besoin en exigences mesurables (volumes, fraîcheur, latence, coût, conformité)
  - Faire des estimations rapides et chiffrées d'ordres de grandeur
  - Choisir parmi des architectures de référence et justifier les compromis
  - Documenter une décision d'architecture et prévoir son évolution
---

# Une méthode plutôt qu'une liste d'outils

« Quelle architecture pour notre plateforme de données ? » n'a pas de réponse sans contexte. Le travail d'un Data Engineer senior (et l'objet de nombreux entretiens techniques) consiste à **poser les bonnes questions**, **chiffrer**, **choisir en connaissant les compromis**, et **documenter** pour que d'autres puissent comprendre et contester la décision.

```diagram
type: flow
title: Une démarche de conception en cinq étapes
steps:
  - title: Exigences
    text: Usages, volumes, fraîcheur, latence, conformité, budget
    tone: blue
  - title: Estimations
    text: Ordres de grandeur chiffrés
    tone: blue
  - title: Options
    text: Deux ou trois architectures candidates
    tone: amber
  - title: Compromis
    text: Comparaison explicite, choix argumenté
    tone: amber
  - title: Décision
    text: Documentée, avec plan d'évolution
    tone: teal
```

# Étape 1 : Les exigences

Commencez par les **usages**, jamais par les outils : qui consomme quoi, pour décider de quoi ? Puis rendez chaque exigence **mesurable**.

| Dimension | Question | Exemple de réponse mesurable |
|---|---|---|
| **Volume** | Combien de données, à quel rythme ? | 40 millions d'événements par jour, 1 Ko chacun, croissance de 50 % par an |
| **Fraîcheur** | Quel délai entre l'événement et sa disponibilité ? | Tableaux de bord à jour à 7 h ; alertes fraude en moins de 30 s |
| **Latence de requête** | Combien de temps pour obtenir une réponse ? | Moins de 3 s pour un tableau de bord, moins de 100 ms pour l'API produit |
| **Concurrence** | Combien d'utilisateurs ou de requêtes simultanés ? | 50 analystes ; 2 000 requêtes par seconde sur l'API |
| **Historique et rétention** | Combien de temps garder, et à quel niveau de détail ? | Détail sur 2 ans, agrégats sur 10 ans, données personnelles 3 ans maximum |
| **Fiabilité** | Que se passe-t-il si c'est en retard ou faux ? | La facturation dépend de ces données : zéro perte, contrôles bloquants |
| **Conformité** | Contraintes légales et de sécurité ? | Données de santé hébergées en France chez un hébergeur certifié HDS |
| **Équipe et budget** | Qui va exploiter, avec quel budget ? | 3 Data Engineers, 8 000 € par mois maximum |

> [!IMPORTANT]
> Méfiez-vous du « temps réel » demandé par principe. Demandez : « que ferez-vous différemment si la donnée arrive en 10 secondes plutôt qu'en une heure ? ». Souvent, la réponse est « rien », et une architecture par lots, beaucoup plus simple et moins chère, suffit. Le streaming se justifie par une **action** qui doit suivre l'événement rapidement (bloquer une fraude, ajuster un stock, personnaliser une page).

# Étape 2 : Les estimations

Quelques calculs d'ordre de grandeur évitent des erreurs d'un facteur 100. Retenez quelques repères :

- 1 jour ≈ 86 400 secondes, soit environ **10⁵** ; 1 an ≈ 3 × 10⁷ secondes ;
- un fichier Parquet compressé fait souvent **5 à 10 fois moins** que le JSON ou le CSV équivalent ;
- une machine lit plusieurs **Go/s** sur disque local NVMe, quelques centaines de Mo/s à quelques Go/s depuis le stockage objet selon le parallélisme ;
- le stockage objet coûte de l'ordre de **20 € par To et par mois** ; le calcul et les requêtes coûtent en général bien plus cher que le stockage.

Exemple : 40 millions d'événements de 1 Ko par jour.

- Volume brut : 40 × 10⁶ × 1 Ko = **40 Go/jour** en JSON, soit environ **5 Go/jour** en Parquet.
- Sur 2 ans : 730 × 5 Go ≈ **3,7 To** en Parquet, environ 75 € par mois de stockage objet.
- Débit moyen : 40 × 10⁶ / 10⁵ ≈ **400 événements/s** ; avec un pic à 10 fois la moyenne, **4 000/s** : une seule partition Kafka bien dimensionnée en encaisse bien plus, quelques partitions suffisent.
- Un traitement quotidien lit 5 Go : une machine unique avec DuckDB ou Polars suffit ; Spark n'est pas nécessaire.

> [!TIP]
> Écrivez vos hypothèses et vos calculs dans le document de conception. Une estimation fausse mais explicite se corrige ; une intuition implicite (« c'est du big data, il faut Spark ») ne se discute pas.

# Étape 3 : Les architectures de référence

La plupart des besoins se ramènent à quelques architectures connues.

```diagram
type: compare
title: Trois architectures de référence
columns:
  - title: Entrepôt moderne (ELT)
    tone: blue
    items:
      - Ingestion gérée ou maison vers l'entrepôt
      - Transformation SQL avec dbt
      - Orchestrateur, BI, reverse ETL
      - Simple, rapide à livrer ; coûts variables à surveiller
  - title: Lakehouse ouvert
    tone: teal
    items:
      - Stockage objet + tables Iceberg ou Delta
      - Spark, Trino, DuckDB sur les mêmes tables
      - Indépendance vis-à-vis d'un moteur, coût du stockage minimal
      - Plus de composants à exploiter
  - title: Flux (Kappa)
    tone: violet
    items:
      - Événements dans Kafka, traitement continu (Flink, Spark)
      - Écriture continue vers le lakehouse et des bases de service
      - Fraîcheur en secondes
      - Complexité et coût d'exploitation élevés
```

Deux variantes historiques à connaître :

- **Lambda** : une chaîne par lots (exacte, recalculée) **et** une chaîne en flux (rapide, approximative) en parallèle, fusionnées à la lecture. Elle oblige à maintenir deux fois la même logique, d'où son déclin.
- **Kappa** : tout passe par le flux ; pour recalculer, on **rejoue** le journal d'événements (Kafka avec une longue rétention, ou les tables du lakehouse). Les moteurs actuels qui traitent lots et flux avec le même code (Spark, Flink) la rendent plus accessible.

> [!NOTE]
> En pratique, on combine souvent : un socle **par lots** (entrepôt ou lakehouse) pour l'essentiel de l'analytique, et un **flux ciblé** pour le ou les rares cas qui exigent des secondes. Ne passez pas toute la plateforme en streaming pour un seul cas d'usage.

# Étape 4 : Les compromis

Chaque choix déplace un curseur. Rendez-les explicites :

| Compromis | D'un côté | De l'autre |
|---|---|---|
| **Construire ou acheter** | Contrôle, coût de licence nul, compétences internes | Délai de mise en œuvre et maintenance à vie |
| **Service géré ou auto-hébergé** | Moins d'exploitation, montée en charge simple | Coût unitaire plus élevé, dépendance au fournisseur |
| **Fraîcheur et coût** | Données plus fraîches | Calcul plus fréquent, complexité accrue |
| **Normalisation et performance** | Une seule vérité, mises à jour simples | Jointures coûteuses à la lecture |
| **Formats ouverts ou propriétaires** | Portabilité, plusieurs moteurs | Fonctionnalités et optimisations propres à un fournisseur |

Un critère souvent sous-estimé : la **complexité opérationnelle**. Chaque composant ajouté doit être supervisé, mis à jour, sécurisé, documenté et compris par l'équipe d'astreinte. Pour une équipe de trois personnes, une architecture de cinq composants gérés vaut mieux qu'une architecture « idéale » de quinze composants auto-hébergés.

# Étape 5 : Documenter la décision

Une décision d'architecture se documente dans un **ADR** (*Architecture Decision Record*), un court fichier versionné avec le code :

```markdown
# ADR 007 - Lakehouse Iceberg plutôt qu'entrepôt propriétaire

Statut : accepté - 2026-03-02

## Contexte
40 M d'événements/jour (5 Go/jour en Parquet), 3,7 To sur 2 ans.
Trois moteurs à servir : Spark (lots), Trino (analystes), un futur moteur de flux.
Budget : 8 000 €/mois. Équipe : 3 Data Engineers.

## Décision
Tables Apache Iceberg sur stockage objet, catalogue REST géré.
Trino géré pour les analystes ; DuckDB pour les traitements quotidiens (< 10 Go lus).

## Options écartées
- Entrepôt propriétaire seul : plus simple, mais dépendance à un moteur unique et
  coût estimé à 11 000 €/mois au volume de requêtes prévu.
- Spark pour tous les traitements : surdimensionné pour 5 Go/jour.

## Conséquences
+ Formats ouverts, plusieurs moteurs, stockage bon marché.
- Maintenance Iceberg à automatiser (compaction, expiration des snapshots).
- Compétence Trino à développer dans l'équipe.

## Révision
À réévaluer si le volume lu par traitement dépasse 200 Go ou si l'équipe passe sous 3 personnes.
```

> [!TIP]
> La section « Révision » est précieuse : elle dit à l'avance **quel signal** remettrait la décision en cause. Une architecture évolue ; ce qui compte est de savoir quand et pourquoi.

# Exercices

## Exercice 1 : Chiffrer

Une application mobile envoie 2 millions de sessions par jour ; chaque session produit en moyenne 150 événements de 600 octets. Estimez le volume quotidien en JSON et en Parquet, le volume sur 3 ans en Parquet, et le débit moyen et de pointe (facteur 8).

<details>
<summary>Voir la solution</summary>

- Événements par jour : 2 × 10⁶ × 150 = 3 × 10⁸.
- Volume JSON : 3 × 10⁸ × 600 o = 1,8 × 10¹¹ o ≈ **180 Go/jour**.
- Parquet (facteur ~8) : environ **20 à 25 Go/jour**.
- Sur 3 ans : ~1 100 jours × ~22 Go ≈ **24 To** en Parquet.
- Débit moyen : 3 × 10⁸ / 86 400 ≈ **3 500 événements/s** ; pointe ≈ **28 000/s**, soit environ 17 Mo/s en JSON : quelques partitions Kafka suffisent.
- Un traitement quotidien lit ~22 Go : une machine unique convient encore ; un traitement sur un an d'historique (≈ 8 To) justifie un moteur distribué ou des agrégats intermédiaires.

</details>

## Exercice 2 : Le temps réel demandé

Le directeur commercial veut « un tableau de bord des ventes en temps réel ». Les données sont aujourd'hui chargées chaque nuit. Comment menez-vous l'échange, et quelles options proposez-vous ?

<details>
<summary>Voir la solution</summary>

Questions à poser : quelles **décisions** seront prises à partir de ce tableau de bord, et à quelle fréquence ? Que ferait-on différemment avec une donnée à 10 secondes plutôt qu'à 1 heure ? Qui le regardera, et quand ?

Options, de la plus simple à la plus complexe :

1. **Chargements toutes les heures** (ou toutes les 15 minutes) avec des modèles incrémentaux : souvent suffisant, coût modéré.
2. **Micro-lots** via le CDC de la base de ventes, avec une fraîcheur de quelques minutes.
3. **Streaming** (CDC + Kafka + Flink vers une base analytique temps réel) : réservé à un besoin d'action immédiate démontré.

On documente le coût et la complexité de chaque option pour que le choix soit fait en connaissance de cause.

</details>

## Exercice 3 : Écrire un ADR

Votre équipe hésite entre Airflow auto-hébergé sur Kubernetes et une offre Airflow gérée par le fournisseur cloud. Rédigez les sections « Contexte », « Décision », « Options écartées » et « Révision » d'un ADR (avec des hypothèses raisonnables).

<details>
<summary>Voir la solution</summary>

- **Contexte** : 60 DAG, 2 Data Engineers, pas d'expertise Kubernetes dans l'équipe, astreinte limitée, budget de 1 500 €/mois pour l'orchestration.
- **Décision** : offre Airflow gérée.
- **Options écartées** : Airflow sur Kubernetes (coût d'infrastructure plus faible, mais mises à jour, sécurité et supervision à assurer par une équipe sans expertise Kubernetes ; risque opérationnel jugé trop élevé) ; Dagster Cloud (intéressant, mais migration de 60 DAG non prioritaire).
- **Conséquences** : coût unitaire plus élevé, moins de contrôle sur les versions, exploitation fortement réduite.
- **Révision** : si le coût dépasse 3 000 €/mois, ou si une équipe plateforme Kubernetes est créée.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Concevoir une architecture de données
center: Des usages aux exigences mesurables, des estimations aux compromis explicites, puis une décision documentée.
points:
  - icon: target
    title: Exigences
    text: Volume, fraîcheur, latence, concurrence, rétention, conformité, budget.
  - icon: ruler
    title: Estimer
    text: 1 jour ≈ 10⁵ s ; Parquet 5 à 10 fois plus compact ; écrire ses hypothèses.
  - icon: layers
    title: Architectures
    text: Entrepôt ELT, lakehouse ouvert, flux Kappa ; Lambda en déclin.
  - icon: scale
    title: Compromis
    text: Construire ou acheter, géré ou auto-hébergé, fraîcheur ou coût.
  - icon: gauge
    title: Complexité
    text: Chaque composant se supervise, se sécurise et s'explique à l'astreinte.
  - icon: book
    title: ADR
    text: Contexte, décision, options écartées, conséquences, signal de révision.
pitfall: Choisir le streaming ou Spark par principe, sans chiffrer ni demander quelle décision en dépend.
remember: Une estimation explicite se corrige ; une intuition implicite ne se discute pas.
```
