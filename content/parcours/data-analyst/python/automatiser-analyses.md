---
title: Automatiser une analyse
description: "Transformer une analyse répétée en script paramétré : exports CSV et Parquet, dépendances figées, planification simple, et la frontière avec l'ingénierie data."
duration: 55
objectives:
  - Écrire un script relançable, paramétré par la période et les chemins
  - Exporter un CSV pour les lecteurs et un Parquet pour la suite du calcul
  - Figer les bibliothèques et planifier une exécution sans orchestrateur
  - Décider ce qui reste un script d'analyste et ce qui doit passer à l'ingénierie
---

# Un script que quelqu'un d'autre peut relancer

L'analyse du CA hebdomadaire d'Atelier Nord a vécu trois lundis dans un notebook. Le quatrième lundi, vous êtes absent, le chemin pointe vers `Downloads\export (3).csv`, et les cellules ne sont justes que si on les exécute dans un ordre que vous seul connaissez. Ce n'est pas encore une analyse d'équipe.

Un script reproductible tient en une phrase : une autre personne, sur une autre machine, avec les mêmes fichiers en entrée, obtient le même tableau. Pour cela, le fichier `ca_hebdo.py` se lit de haut en bas, la définition du CA est la même que dans le journal de nettoyage (payé, hors comptes `@example.com`, un identifiant = une commande), et rien ne dépend de l'heure à laquelle vous avez cliqué.

```python
from pathlib import Path

import pandas as pd


def ca_par_canal(commandes: pd.DataFrame) -> pd.DataFrame:
    travail = commandes.copy()
    travail = travail.loc[travail["statut"].eq("payee") & travail["montant"].gt(0)]
    travail = travail.loc[~travail["email"].fillna("").str.endswith("@example.com")]
    travail["canal"] = travail["canal"].fillna("inconnu")
    return (
        travail.groupby("canal", as_index=False)
        .agg(ca=("montant", "sum"), commandes=("id", "nunique"))
        .sort_values("ca", ascending=False)
    )
```

La fonction ne lit pas de fichier et n'écrit rien. Elle se teste sur un petit tableau de cinq lignes (vous connaissez le CA attendu) avant d'être branchée sur l'export réel. Le chargement et l'export vivent à côté, pas dedans. Quand la règle change (les commandes partiellement remboursées sortent du CA), vous changez la fonction, pas douze notebooks.

Le bloc du bas ne s'exécute que lorsque le fichier est lancé comme programme, pas lorsqu'un collègue importe la fonction pour la tester.

```python
def main() -> None:
    # paramètres, lecture, appel, export : voir les sections suivantes
    ...


if __name__ == "__main__":
    main()
```

> [!NOTE]
> « Reproductible » ne veut pas dire « joli ». Cela veut dire : mêmes entrées, mêmes versions de bibliothèques, même règle, même fichier de sortie. Un graphique commenté dans la note peut rester manuel. Le chiffre qui y figure, non.

# Paramètres plutôt que dates en dur

Les dates écrites au milieu du code (`debut = "2026-03-02"`) obligent à éditer le script chaque lundi, et personne ne sait plus quelle version a produit le fichier envoyé. Les **paramètres** sont les informations qui changent d'une exécution à l'autre : période, chemin d'entrée, chemin de sortie.

```python
import argparse


def lire_args():
    parser = argparse.ArgumentParser(description="CA payé par canal")
    parser.add_argument("--debut", required=True, help="Inclus, format AAAA-MM-JJ")
    parser.add_argument("--fin", required=True, help="Exclu, format AAAA-MM-JJ")
    parser.add_argument("--source", required=True, help="CSV des commandes")
    parser.add_argument("--sortie", required=True, help="CSV de résultat")
    return parser.parse_args()
```

Lancement :

```text
python ca_hebdo.py --debut 2026-03-02 --fin 2026-03-09 --source data/commandes.csv --sortie sorties/ca_2026-03-02.csv
```

`--fin` est exclu, comme le filtre de la semaine précédente, pour que la semaine d'après commence sans recouvrir un jour. Relancer **la même** commande doit **écraser** le même fichier de sortie, pas ajouter les lignes en dessous. `to_csv` sans mode ajout fait déjà cela. Un export en `mode="a"` double le CA la deuxième fois que vous corrigez un bug et relancez.

Gardez un paramètre pour rejouer une semaine passée. C'est ce qui vous sauve quand une règle change et qu'il faut reconstruire le 2 mars, pas seulement « la semaine dernière calculée à partir de l'horloge du portable ». Calculer la semaine précédente à partir de la date du jour est acceptable pour un rapport local, **si** les dates restent passables en paramètres et **si** le script écrit quelle période il a réellement traitée dans le fichier ou dans un journal d'exécution.

```python
print(f"Période traitée : {args.debut} inclus, {args.fin} exclu")
```

Ce que vous ne mettez pas en paramètre caché : la définition du statut payé, le domaine des e-mails de test, le seuil qui retire une commande. Ces choix sont des règles, versionnées dans le code et citées dans la note. Un paramètre `--ignorer-les-gros` sans valeur par défaut documentée est une façon de publier deux chiffres selon l'humeur.

# Exporter en CSV et en Parquet

Deux lecteurs, deux formats. La responsable marketing ouvre un tableur. Le prochain script (nettoyage déjà fait, agrégat à croiser avec les dépenses pub) a besoin des types et n'a pas besoin d'un fichier que l'on retrie à la main.

```python
def exporter(resume: pd.DataFrame, sortie_csv: Path) -> None:
    sortie_csv.parent.mkdir(parents=True, exist_ok=True)
    resume.to_csv(sortie_csv, index=False, encoding="utf-8-sig")
    resume.to_parquet(sortie_csv.with_suffix(".parquet"), index=False)
```

`index=False` évite une colonne `Unnamed: 0` qui reviendrait au prochain chargement. `utf-8-sig` aide Excel sous Windows à reconnaître les accents. Le CSV reste du texte : les dates et les nombres devront souvent être réinterprétés. C'est le bon format pour une pièce jointe et pour un contrôle visuel.

Le **Parquet** garde les types (date, nombre), se compresse bien et se relit plus vite. pandas l'écrit avec la bibliothèque `pyarrow`, à déclarer dans les dépendances. Excel ne l'ouvre pas. Vous ne l'envoyez donc pas à la place du CSV. Vous le gardez comme étape entre deux scripts, pour ne pas réexporter tout l'historique en CSV à chaque fois.

Nommez le fichier par son contenu et sa période : `ca_canal_2026-03-02.csv`, pas `final_v3_vraiment.xlsx`. La version « finale » est celle que la commande régénère.

Ajoutez une ligne de contrôle à côté du fichier, même sommaire : nombre de commandes retenues, CA total, période. Un CSV de canaux dont la somme ne retrouve pas ce total ne part pas par e-mail.

```diagram
type: pipeline
title: Une analyse hebdomadaire que l'on peut relancer
lanes:
  - title: Entrées
    steps:
      - title: Paramètres
        text: Début inclus, fin exclue, chemins
        tone: amber
      - title: CSV source
        text: Export commandes, pas un fichier Downloads
        tone: blue
  - title: Calcul
    steps:
      - title: Règles
        text: Payé, hors tests, canal inconnu
        tone: violet
      - title: Contrôles
        text: Lignes retenues et somme des canaux
        tone: teal
  - title: Sorties
    steps:
      - title: CSV
        text: Pièce pour le tableur et la note
        tone: rose
      - title: Parquet
        text: Reprise par le script suivant
        tone: teal
```

# Figer les bibliothèques avec requirements

« Ça marche sur mon poste » veut souvent dire : une version de pandas installée un jour, plus une mise à jour faite pour un autre projet. `read_csv` et `to_parquet` n'ont pas toujours eu les mêmes paramètres. Vous figez les bibliothèques **que le script importe**, avec les numéros que vous avez vraiment utilisés.

```text
pandas==2.2.3
pyarrow==17.0.0
```

Les numéros viennent de votre environnement (`python -m pip freeze`), pas d'un article. Vous n'y copiez pas toute la liste du portable (des dizaines de paquets tirés par un notebook d'essai). Vous y mettez ce que `ca_hebdo.py` importe, et ce dont `to_parquet` a besoin.

Le collègue recrée l'environnement et installe cette liste.

```text
py -3 -m venv .venv
.venv\Scripts\activate
python -m pip install -r requirements.txt
```

Le script, `requirements.txt`, un `README` de dix lignes (quelle commande lancer, où déposer le CSV, ce que veut dire « payé ») et le journal de règles voyagent ensemble. Un notebook sans cette liste n'est pas transmissible : l'autre personne installera « la dernière version » et vos types de dates pourront changer de comportement.

Ne versionnez pas les données clients dans le dépôt du script. Le code et un **jeu fictif** de dix lignes pour l'exemple, oui. L'export complet des commandes, non. Le chemin des vraies données reste un paramètre.

# Planifier sans Airflow

Quand le script est ennuyeux et stable, vous pouvez le lancer tout seul le lundi à 7 h. Vous n'avez pas besoin d'un orchestrateur d'entreprise pour un seul rapport d'équipe.

Sous Windows, le **Planificateur de tâches** lance `python.exe` avec les arguments du script, dans le dossier du projet, avec l'environnement qui contient pandas. Sous Linux ou macOS, une ligne **cron** fait le même office. Dans les deux cas, écrivez la sortie dans un fichier daté (`ca_canal_2026-03-02.csv`) et gardez un journal texte : la commande a démarré, elle a fini, le CA total valait tant. Si le lundi le fichier est absent, il faut que quelqu'un s'en aperçoive. Un planificateur ne prévient pas tout seul, sauf si vous ajoutez un e-mail d'échec, et beaucoup d'équipes oublient cette ligne.

Le portable éteint ou en veille ne lance rien. Une tâche « qui marche » parce que vous êtes au bureau à 7 h n'est pas une tâche planifiée. Si le rapport doit partir même pendant vos congés, il tourne sur une machine allumée, convenue avec l'équipe, pas sur le disque de votre sac.

Le **notebook daté** a un autre rôle. `rapports/2026-03-16-ca-hebdo.ipynb`, exécuté et enregistré avec ses résultats, est la photo de ce qui a été montré en réunion. Il ne remplace pas le script. On ne « corrige » pas un total dans une cellule après la réunion sans le dire : la photo mentirait. On corrige le script, on relance, on enregistre une nouvelle photo.

Airflow, Dagster ou un orchestrateur cloud servent quand plusieurs traitements dépendent les uns des autres, doivent réessayer, être surveillés, et alimenter beaucoup de monde. Installer Airflow pour un CSV du lundi ajoute de la panne, pas de la fiabilité.

# Ce que l'analyste laisse à l'ingénierie

Automatiser n'est pas construire une plateforme dans son coin. Quelques questions tranchent.

Le chiffre est-il lu par une personne ou par la direction chaque matin, avec une heure promise ? Doit-il survivre à votre départ, à un mot de passe, à un historique de trois ans ? Contient-il des données personnelles au-delà de ce que votre équipe a le droit de stocker sur un disque local ? Plusieurs étapes se succèdent-elles (récupérer, nettoyer, agréger, pousser dans l'outil de BI) avec des reprises en cas de panne ?

Si vous répondez oui, le script a fait son travail de **prototype de règle**. La suite (planification surveillée, droits d'accès, historique, reprise) appartient à l'ingénierie data, ou à l'équipe qui opère déjà l'entrepôt. Vous restez responsable de la définition : ce qu'est une commande payée, ce qu'on fait des tests, ce que le canal inconnu contient. L'ingénieur ne devine pas ces règles, et vous ne devinez pas l'infrastructure.

```diagram
type: decision
title: Le script suffit-il ?
nodes:
  - question: Le rapport doit-il partir même si votre portable est éteint, pour des lecteurs qui attendent une heure précise ?
    yes: Le confier à une machine partagée, et à l'ingénierie s'il devient critique
    no: Question suivante
  - question: Une seule personne relance un fichier d'équipe, sans donnée sensible hors périmètre ?
    yes: Un script paramétré, éventuellement une tâche planifiée, avec un CSV daté
    no: "Arrêtez la copie locale : droits, historique et surveillance ne se bricolent pas dans Downloads"
```

En pratique, beaucoup d'analyses restent légitimement des scripts : étude ponctuelle, contrôle d'un export, récapitulatif d'un canal que le tableau de bord ne coupe pas encore. Le signal d'alerte est le succès. Le jour où votre CSV du lundi est cité en comité de direction, il ne devrait plus dépendre d'un `Downloads` ni d'une tâche que personne ne surveille.

# Exercices

## Exercice 1 : Ce qui empêche de relancer

Le notebook d'un collègue contient ceci, et « il suffit de tout exécuter ».

```python
commandes = pd.read_csv(r"C:\Users\Camille\Downloads\export (3).csv")
commandes = commandes[commandes["date"] >= "2026-03-02"]
commandes = commandes[commandes["date"] <= "2026-03-08"]
resume = commandes.groupby("canal")["montant"].sum()
resume.to_csv(r"C:\Users\Camille\Desktop\final_v3.csv", mode="a")
```

Listez au moins quatre problèmes pour une analyse que quelqu'un d'autre devrait refaire lundi prochain.

<details>
<summary>Voir la solution</summary>

1. Le chemin `Downloads\export (3).csv` est personnel, et le `(3)` change à chaque téléchargement. Personne d'autre ne peut lancer le fichier, et vous non plus dans deux semaines.
2. Les dates sont en dur. Lundi prochain, il faudra éditer le notebook. On ne sait pas non plus si le 8 mars est inclus (ici oui, via `<=`) et si cela recouvre la semaine suivante.
3. Il n'y a ni filtre de statut, ni exclusion des tests, ni canal `inconnu`. On somme tout ce qui a un montant, y compris annulations si elles sont dans l'export.
4. `mode="a"` **ajoute** au fichier `final_v3.csv` au lieu de le remplacer. Une seconde exécution double le CA. Le nom `final_v3` ne dit ni la période ni la règle.
5. Bonus : pas de `index=False` n'est pas le pire ici, mais l'absence de contrôle (somme, nombre de lignes) et l'absence de `requirements.txt` empêchent de savoir avec quelle version de pandas le chiffre a été produit.

</details>

## Exercice 2 : CSV, Parquet, ou les deux

Vous produisez le CA par canal de la semaine pour (a) la responsable marketing, qui va trier le fichier dans Excel et le coller dans une note, et (b) un second script, demain, qui croisera ce résultat avec les dépenses publicitaires déjà typées.

Que livrez-vous à chacun, et pourquoi pas l'inverse ?

<details>
<summary>Voir la solution</summary>

(a) Un **CSV** UTF-8 (avec indicateur pour Excel), nommé par la période, `index=False`. Elle peut l'ouvrir sans outil supplémentaire. Un Parquet ne s'ouvre pas dans Excel.

(b) Un **Parquet** du même tableau, pour garder les types numériques et éviter de réinterpréter un CSV. Le second script le relit sans deviner le séparateur.

Livrer seulement le CSV oblige le script du lendemain à reconvertir les nombres. Livrer seulement le Parquet bloque la responsable. Les deux exports viennent du **même** DataFrame, pour ne pas faire diverger les deux fichiers.

</details>

## Exercice 3 : Script local ou ingénierie

Classez chaque demande : script d'analyste (éventuellement planifié), ou passage à l'ingénierie data.

1. Une fois, croiser 2 000 lignes d'un export service client avec le catalogue, pour une note de jeudi.
2. Le comité de direction veut chaque matin à 8 h le CA de la veille, même pendant les congés, avec trois ans d'historique et des alertes si le chiffre ne part pas.
3. Chaque lundi, votre équipe marketing (quatre personnes) veut le même CSV par canal. Le fichier ne contient pas de donnée personnelle, et une absence est gênante mais visible dans la journée.

<details>
<summary>Voir la solution</summary>

1. **Script ou notebook d'analyste.** Travail ponctuel, petit volume, pas d'heure promise à toute l'entreprise. Vous gardez quand même la règle écrite et vous ne laissez pas le seul exemplaire dans un téléchargement au nom obscur.
2. **Ingénierie.** Heure promise, continuité pendant les absences, historique long, surveillance : c'est un pipeline partagé, pas une tâche sur un portable. Vous fournissez la définition du CA.
3. **Script planifié**, sur une machine qui reste allumée, avec paramètres de dates, CSV daté et un moyen de voir l'échec. Si ce CSV devient la source citée en direction, vous repasserez la main (cas 2) au lieu d'ajouter des rustines.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Automatiser une analyse
center: "Un script paramétré refait le même chiffre. Un orchestrateur n'est utile que lorsque ce chiffre devient critique."
points:
  - icon: terminal
    title: Haut en bas
    text: "La règle est une fonction testable. Le fichier se relance sans ordre de cellules secret."
  - icon: tool
    title: Paramètres
    text: "Période et chemins sont des arguments. Relancer écrase la même sortie, sans mode ajout."
  - icon: file
    title: CSV et Parquet
    text: "CSV pour Excel et la note. Parquet pour le script suivant, avec les types conservés."
  - icon: clock
    title: Tâche simple
    text: "Le planificateur suffit à un rapport d'équipe. Le portable en veille ne tient pas une promesse."
  - icon: users
    title: Frontière
    text: "Heure promise, historique, droits, alertes : on transmet la règle à l'ingénierie, on ne la réécrit pas."
pitfall: "Un chemin Downloads et un export en mode ajout produisent un CA que personne ne sait régénérer, puis un CA doublé."
remember: "Automatiser, c'est figer la définition et les entrées. Le jour où la direction attend le fichier, il ne vit plus sur un seul poste."
```
