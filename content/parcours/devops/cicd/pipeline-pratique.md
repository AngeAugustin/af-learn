---
title: Un pipeline en pratique
description: Lire et modifier un pipeline GitHub Actions de l'API commandes, avec des jobs séparés, un cache, des secrets d'environnement et un journal d'échec exploitable.
duration: 65
objectives:
  - Situer le fichier de workflow et ses déclencheurs dans le dépôt
  - Séparer vérification, recette et production pour ne pas déployer une demande de fusion
  - Accélérer l'installation par un cache sans en faire une source de vérité
  - Placer les secrets dans l'environnement du job, et lire un échec avant de relancer
---

# Le fichier, au bon endroit

L'équipe a choisi **GitHub Actions** et s'y tient. Le pipeline de l'API commandes est un fichier du dépôt :

```text
.github/workflows/commandes.yml
```

Il est relu comme le code des frais. Une case cochée seulement dans l'interface de la forge, invisible dans Git, redevient la mémoire de Nora. Chloé change le pipeline par une demande de fusion.

Le début du fichier dit **quand** il part.

```yaml
name: commandes

on:
  pull_request:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
```

`pull_request` : chaque mise à jour d'une demande de fusion. `push` sur `main` : ce qui vient d'être intégré. `workflow_dispatch` : un bouton, pour la production, pas pour « essayer une branche ». `permissions` limite le jeton automatique du job à la lecture du dépôt. On n'ouvre pas l'écriture « au cas où ».

Le fichier complet tient en trois jobs. Vous allez le lire par morceaux. Le voici d'abord en entier, pour ne pas reconstruire un autre pipeline au fil de l'eau.

```yaml
name: commandes

on:
  pull_request:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

jobs:
  verifier:
    runs-on: ubuntu-latest
    steps:
      - name: Récupérer le commit
        uses: actions/checkout@v4

      - name: Préparer Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"
          cache: pip
          cache-dependency-path: requirements.txt

      - name: Installer les dépendances épinglées
        run: pip install -r requirements.txt

      - name: Lint et tests
        run: make verifier

  recette:
    needs: verifier
    if: "github.event_name == 'push' && github.ref == 'refs/heads/main'"
    runs-on: ubuntu-latest
    environment: recette
    steps:
      - name: Récupérer le commit
        uses: actions/checkout@v4

      - name: Publier l'artefact de ce commit
        run: make publier SHA="${{ github.sha }}"
        env:
          REGISTRE_JETON: ${{ secrets.REGISTRE_JETON }}

      - name: Déployer cet artefact en recette
        run: make deployer SHA="${{ github.sha }}" CIBLE=recette
        env:
          REGISTRE_JETON: ${{ secrets.REGISTRE_JETON }}

  production:
    needs: verifier
    if: "github.event_name == 'workflow_dispatch' && github.ref == 'refs/heads/main'"
    runs-on: ubuntu-latest
    environment: production
    concurrency:
      group: production-commandes
      cancel-in-progress: false
    steps:
      - name: Récupérer le commit
        uses: actions/checkout@v4

      - name: Déployer l'artefact déjà publié
        run: make deployer SHA="${{ github.sha }}" CIBLE=production
        env:
          REGISTRE_JETON: ${{ secrets.REGISTRE_JETON }}
```

Le dépôt fournit trois cibles, sans que vous ayez à connaître l'application web. `make verifier` lance le lint et les tests. `make publier` envoie au registre le paquet de ce commit, et refuse d'écraser un paquet déjà publié. `make deployer` déploie **ce** paquet vers la cible demandée. Il ne recompile pas sur le serveur.

# Trois jobs, trois décisions

Un **job** est une suite d'étapes sur une machine neuve (`runs-on: ubuntu-latest`). Les jobs ne partagent pas leur disque. Ce qui doit passer de l'un à l'autre passe par le registre (l'artefact), pas par un fichier oublié dans `/tmp`.

```diagram
type: flow
title: "Qui part, selon l'événement"
steps:
  - title: verifier
    text: "Toute demande de fusion, tout push sur main, tout bouton."
    tone: blue
  - title: recette
    text: "Seulement un push sur main, après verifier."
    tone: teal
  - title: production
    text: "Seulement le bouton, sur main, après verifier."
    tone: rose
```

`needs: verifier` empêche de déployer un commit que les tests refusent. `if` empêche la recette de partir sur une demande de fusion : Marc ne doit pas perdre la recette de `1.8.3` parce que Chloé a poussé un brouillon.

Le job `production` ne rappelle pas `make publier`. Il déploie le commit de `main`, déjà publié quand ce commit est entré sur la branche. Si l'artefact n'existe pas, `make deployer` échoue. C'est la bonne erreur. On ne reconstruit pas « vite fait » un autre paquet dans le job de production.

`concurrency` sur la production évite deux déploiements qui se marchent dessus. `cancel-in-progress: false` : on ne coupe pas un déploiement déjà commencé. On attend, ou l'on refuse le second. Couper au milieu laisserait des exemplaires de l'API à deux versions sans que personne n'ait décidé d'un retour arrière.

Un piège de la forge mérite une phrase. Si `production` déclarait `needs: recette`, un clic sur le bouton **sauterait** la production. Sur un `workflow_dispatch`, le job `recette` est sauté à cause de son `if`. Un job sauté n'est pas un succès, et le job qui en dépend ne part pas. La production dépend donc de `verifier`, qui tourne vraiment, pas de `recette`.

> [!WARNING]
> Un bouton sans `github.ref == 'refs/heads/main'` déploie la branche affichée à l'écran. Le brouillon de paiement partirait avec le même bouton que `1.8.3`.

# Le cache accélère, il ne décide pas

`actions/setup-python` avec `cache: pip` réutilise les paquets déjà téléchargés, tant que `requirements.txt` ne change pas. La clé de cache suit ce fichier (`cache-dependency-path`). Léa gagne une minute ou deux. Elle ne gagne pas le droit de sauter `pip install`.

Le cache n'est pas une source de vérité.

- Les versions servies sont celles du fichier épinglé, pas « ce qui traînait dans le cache ».
- Un cache corrompu se supprime. Le job suivant retélécharge. Le résultat des tests doit être le même.
- On ne cache pas l'artefact publié à la place du registre. Le registre a une identité et refuse l'écrasement. Un cache de forge est un accélérateur jetable.

Si Chloé ajoute une dépendance et oublie de l'épingler dans `requirements.txt`, le cache peut rendre l'oubli intermittent : ça passe chez elle, ça casse demain. L'épinglage est le sujet. Le cache n'est que la vitesse.

On ne met pas de secret dans un chemin de cache. Un cache se restaure sur d'autres branches. Un jeton qui y entre est un jeton qui fuit.

# Les secrets du pipeline

`REGISTRE_JETON` n'apparaît pas dans le dépôt. Il est enregistré dans la forge, et le job le reçoit en variable d'environnement :

```yaml
env:
  REGISTRE_JETON: ${{ secrets.REGISTRE_JETON }}
```

`make publier` lit la variable. Il ne la reçoit pas en argument de ligne de commande : la ligne est souvent recopiée dans le journal. On n'écrit pas non plus `echo "$REGISTRE_JETON"` pour « vérifier ». La forge masque en général la valeur connue comme secret, mais un secret multiligne, ou une valeur dérivée, passe à travers. Le réflexe est de ne pas l'afficher.

Même nom, valeur selon l'environnement. Le job `recette` voit le jeton de l'environnement `recette`. Le job `production` voit celui de `production`. Un job sans `environment` ne doit pas avoir le jeton de production sous la main. Sinon, une demande de fusion malveillante, ou simplement maladroite, pourrait l'utiliser. Les secrets de production sont des **secrets d'environnement**, pas des secrets globaux du dépôt.

Si un journal a affiché le jeton, on le révoque. On ne « surveille les prochains jours ». Le registre d'Atelier Nord émet un nouveau jeton, l'ancien meurt, la forge est mise à jour. Le commit qui a provoqué l'affichage est corrigé ensuite.

Le jeton présent sur le portable de Nora pour un essai local n'est pas copié dans le fichier « le temps de la démo ». Cet essai utilise un jeton de recette, dans un `.env` ignoré par Git, comme au chapitre quotidien.

# Les environnements nomment la cible

`environment: recette` et `environment: production` ne sont pas des commentaires. Ils branchent trois mécanismes.

**Les secrets** de cet environnement, déjà vus.

**Les règles de protection.** La production exige une approbation : Inès ou Nora, selon la règle écrite. Le job attend. La recette, elle, part seule quand `main` est vert, pour que Marc ait quelque chose à jouer sans réunion. On ne met pas la même règle aux deux, sinon chaque arrondi attend une cérémonie, et l'équipe finit par déployer à la main.

**La trace.** La forge affiche « déployé sur production » avec le commit, la personne qui a approuvé, l'heure. C'est le journal que l'on consulte quand `/sante` ne dit pas ce que l'on croyait.

```diagram
type: compare
title: "Recette et production dans le même fichier"
columns:
  - title: Recette
    tone: teal
    items:
      - "Déclenchée par un push sur main"
      - "Pas d'approbation manuelle"
      - "Jeton et base de recette"
      - "Publie puis déploie ce SHA"
  - title: Production
    tone: rose
    items:
      - "Déclenchée par le bouton, sur main"
      - "Approbation obligatoire"
      - "Jeton et base de production"
      - "Déploie le SHA déjà publié, sans le reconstruire"
```

Le SHA (`github.sha`) est le commit exact de l'exécution. Recette et production qui citent le même SHA déploient le même source. Si la production reconstruisait « la dernière version de main » une heure plus tard, `main` aurait pu bouger. Ici, le bouton déploie le commit choisi au moment du clic, pas un successeur apparu entre-temps. On clique sur le commit que Marc a validé.

`CIBLE=recette` ou `CIBLE=production` dit au script quelle configuration appliquer. Le paquet, lui, ne change pas. Une cible inconnue doit faire échouer `make deployer`, pas déployer en production par défaut.

# Lire un échec avant de relancer

Un job rouge ouvre un journal. On lit la **première** commande en erreur, pas la dernière ligne générique.

```text
Run make verifier
test_frais: 1050 centimes arrondis en 10, pas en 11
make: *** [verifier] Error 2
Error: Process completed with exit code 2.
```

La ligne utile est le test des frais. `Error 2` dit seulement que le programme a refusé. Relancer le job ne change pas 1050 centimes. Léa corrige l'arrondi, pousse, et le pipeline repart sur le nouveau commit. L'ancien exécution reste rouge. C'est l'historique, pas une honte à effacer.

Quelques échecs, et ce qu'ils veulent dire.

**`permission denied` sur le registre.** Le jeton de cet environnement est absent, expiré, ou n'a pas le droit de publier. On ne met pas le jeton en clair pour comparer. On le régénère, on le range dans l'environnement, on relance.

**`tag already exists` ou refus d'écrasement.** Quelqu'un a déjà publié ce numéro ou ce SHA. On n'insiste pas avec un drapeau « forcer ». On vérifie si l'artefact en place est bien celui de ce commit. S'il l'est, on déploie. Sinon, on incrémente la version, comme au chapitre sur le versionnement.

**Le job production est sauté.** Regardez le `if` et les `needs`. Un job dépendant d'un job sauté ne part pas. Ce n'est pas un succès discret.

**Le job est vert et la boutique est fausse.** Le pipeline a fait ce qui est écrit. Si `make verifier` ne lance pas le test des frais, le vert ne couvre pas les frais. On corrige la cible, on ne félicite pas le pipeline.

Si l'équipe écrit un script à la place d'une cible `make`, la première ligne utile est :

```bash
#!/usr/bin/env bash
set -euo pipefail
make verifier
```

Sans `set -e`, un test en échec peut être suivi d'un `echo` qui laisse le script sortir en 0. Le job est vert pour la mauvaise raison. `set -e` arrête à la première commande refusée. `-u` refuse une variable absente (un jeton oublié). `pipefail` propage l'échec dans un tube. Le chapitre suivant reprend cette idée : échouer pour la cause réelle, pas pour le décor.

On ne clique pas trois fois sur « relancer » avant d'avoir une hypothèse. Une relance se justifie si le journal montre un accroc du réseau de la forge, et la deuxième exécution doit être comparée à la première. Deux rouges identiques sont un défaut du commit ou du pipeline. On le corrige dans Git.

# Exercices

## Exercice 1 : Où part ce commit

Léa pousse sur `fix/frais-centime` et ouvre la demande de fusion. Une heure plus tard, Samir fusionne dans `main`. Le lendemain, Nora clique sur le bouton du workflow, en étant sur `main`, au commit que Marc a validé en recette.

Pour chacun de ces trois événements, quels jobs tournent vraiment, et lequel ne doit pas déployer en production ?

<details>
<summary>Voir la solution</summary>

Poussée de la demande : seul `verifier` tourne. `recette` a un `if` qui exige un push sur `main`. `production` exige le bouton. Rien n'est déployé.

Fusion dans `main` : `verifier`, puis `recette` (publication et déploiement de ce SHA). `production` ne part pas. Marc peut jouer le scénario.

Bouton sur `main` : `verifier`, puis `production`, qui déploie le SHA déjà publié, sans `make publier`. Le job `recette` est sauté. Comme `production` ne dépend pas de `recette`, il part quand même.

Le premier événement ne doit pas déployer en production : une demande de fusion n'est pas un commit accepté. Le `if` du job production est là pour ça. S'il était absent, le bouton lancé par erreur depuis la branche de Léa déploierait le brouillon.

</details>

## Exercice 2 : Le jeton dans le journal

Le job `recette` échoue. Pour comprendre, Chloé remplace la commande par :

```bash
echo "jeton=$REGISTRE_JETON"
make publier SHA="${{ github.sha }}"
```

Le journal affiche le jeton. Elle supprime la ligne dans un commit suivant et dit que le prochain run sera propre.

Que manque-t-il, et comment le script doit-il recevoir le jeton ?

<details>
<summary>Voir la solution</summary>

Le jeton affiché est compromis, même si le commit suivant retire `echo`. Les journaux de la forge le conservent, et d'autres personnes de l'organisation peuvent les lire. On révoque `REGISTRE_JETON` de l'environnement `recette`, on en crée un nouveau, on met à jour le secret. Ensuite seulement on retire la ligne.

Le script reçoit le jeton par la variable d'environnement du job, pas par `echo`, pas par un argument `make publier --jeton=...` qui se recopierait dans la ligne de commande. `.env` n'est pas committé pour « éviter le secret de la forge ».

Un masquage automatique n'est pas une raison d'afficher. On part du principe que ce qui est écrit dans le journal a fuité.

</details>

## Exercice 3 : Vert pour la mauvaise raison

`make verifier` échoue sur le test des frais, mais le job Actions est vert. Le script du dépôt est :

```bash
#!/usr/bin/env bash
make verifier
echo "vérification terminée"
```

Pourquoi le job est-il vert, quelle ligne ajoutez-vous, et pourquoi relancer sans modifier le script ne suffit pas ?

<details>
<summary>Voir la solution</summary>

Sans `set -e`, l'échec de `make verifier` n'arrête pas le script. `echo` s'exécute et le script se termine en 0. Actions conclut que l'étape a réussi. Le test rouge est devenu un texte dans le journal, plus un blocage.

On ajoute `set -euo pipefail` juste après le shebang. Le prochain run, sur le même commit cassé, doit être rouge. On ne fusionne pas tant que le test des frais n'est pas corrigé **et** que le script propage bien l'échec.

Relancer sans modifier le script redonne un vert mensonger. La relance n'a de sens qu'après le correctif du script, pour prouver que l'échec remonte, puis après le correctif du test, pour revenir au vert.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Un pipeline en pratique"
center: "Trois jobs, un SHA, des secrets d'environnement, un journal lu avant toute relance."
points:
  - icon: file
    title: "Le fichier dans Git"
    text: "commandes.yml est relu comme le code. Une case cochée seulement dans la forge ne compte pas."
  - icon: layers
    title: "verifier, recette, production"
    text: "La demande de fusion ne déploie pas. La production ne reconstruit pas le paquet."
  - icon: zap
    title: "Cache jetable"
    text: "Il accélère pip tant que requirements.txt ne change pas. Le registre reste la référence."
  - icon: lock
    title: "Secret par environnement"
    text: "Même nom, valeur de recette ou de production. On ne l'écrit pas dans le journal."
  - icon: terminal
    title: "La première ligne rouge"
    text: "On corrige la cause. set -e empêche un echo final de peindre le job en vert."
pitfall: "Faire dépendre la production d'un job de recette sauté, ou déployer la branche affichée par le bouton."
remember: "Le job de production déploie le SHA déjà publié. Il ne recompile pas, il ne devine pas la cible."
```
