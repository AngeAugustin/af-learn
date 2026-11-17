---
title: Git au quotidien
description: Cloner le dépôt de l'équipe, lire le statut, faire un commit relisible, récupérer le travail des autres, démêler un conflit simple, et ne jamais versionner un secret.
duration: 55
objectives:
  - Cloner le dépôt et lire l'état de la copie avant toute modification
  - Produire un commit ciblé, puis récupérer la branche principale sans écraser le travail local
  - Résoudre un conflit simple en gardant un comportement testé
  - Empêcher secrets et fichiers générés d'entrer dans le dépôt, et réagir si un secret est déjà parti
---

# Cloner le dépôt de l'équipe

Le code de l'API commandes vit dans un dépôt partagé. Chacun des six a une copie. La copie de Léa n'est pas « le » code : c'est un instantané, plus ses modifications pas encore envoyées. La référence commune est le dépôt distant, sur la branche principale.

```bash
git clone git@github.com:atelier-nord/commandes.git
cd commandes
git status
```

`git clone` récupère l'historique et prépare la branche principale pour suivre son homologue distante. `git status` est la première commande de la journée, et la dernière avant de fermer le portable. Il dit si vous êtes sur la branche attendue, si des fichiers sont modifiés, s'il reste un conflit.

Nora, Samir et Chloé clonent le même dépôt. Ils ne s'envoient pas de zip. Un zip n'a pas d'historique, pas de revue, pas de pipeline. Il redevient vite « la version de vendredi » dont personne ne connaît le commit.

Si `git status` annonce une branche dont vous ne connaissez pas le nom, vous ne commencez pas un correctif de frais dessus. Vous revenez sur la branche principale à jour. Un correctif posé sur la mauvaise base mélange deux sujets avant même la première ligne utile.

Le dépôt contient le code, les tests, le pipeline et un exemple de configuration sans secret (`.env.example`). Il ne contient pas la base de production, ni les certificats, ni le jeton du registre. Ces objets vivent ailleurs, volontairement.

```video
url: https://www.youtube.com/watch?v=e9lnsKot_SQ
title: "How Git Works: Explained in 4 Minutes"
channel: "ByteByteGo"
duration: "4:18"
lang: en
why: "Le fonctionnement interne de Git en quatre minutes : répertoire de travail, index, dépôt local et dépôt distant."
```

# Voir ce qui a changé

Avant d'enregistrer quoi que ce soit, Léa regarde le diff. `git status` liste les fichiers. `git diff` montre les lignes.

```bash
git status
git diff
git diff -- api/frais.py
```

Le diff des frais doit parler d'arrondi, pas d'un reformatage de tout le fichier, pas d'une clé collée « pour tester le paiement ». Si le diff est illisible, le commit le sera aussi, et Samir ne pourra pas relire.

Deux zones comptent.

La zone de travail : vos modifications pas encore sélectionnées. `git diff` les montre.

L'index : ce que vous avez explicitement choisi d'enregistrer au prochain commit. `git diff --staged` montre cette sélection. La différence entre les deux évite le commit fourre-tout. Léa a touché `api/frais.py` et, par essai, `config/locale.env`. Seul le premier fichier doit être sélectionné.

```bash
git diff --staged
```

Si `--staged` montre `.env`, on s'arrête. On retire ce fichier de l'index avant de committer. Le réflexe « je vérifierai plus tard » est exactement la façon dont les secrets partent.

```diagram
type: flow
title: "Avant d'envoyer quoi que ce soit"
steps:
  - title: Statut
    text: "La bonne branche, les fichiers touchés, un conflit encore ouvert."
    tone: blue
  - title: Diff
    text: "Les lignes, puis ce qui est déjà dans l'index."
    tone: violet
  - title: Commit
    text: "Un seul but, un message lisible, aucun secret."
    tone: teal
  - title: Pull
    text: "Copie propre, travail des autres, tests relancés."
    tone: amber
```

# Un commit que l'on peut relire

Un commit est un instantané nommé, avec un auteur, une date et un message. Chez Atelier Nord, un commit a un seul but. « Arrondir les frais au centime » est un but. « Frais, paiement, et au passage le lint » n'en est pas un.

```bash
git add api/frais.py tests/test_frais.py
git diff --staged
git commit -m "fix: arrondir les frais de livraison au centime"
git status
```

`git add` sélectionne. Il n'envoie rien au dépôt distant. `git commit` enregistre dans votre copie. `git status` doit ensuite dire que la zone de travail est propre, ou ne montrer que les fichiers que vous avez volontairement laissés dehors.

Le message dit **pourquoi**, en une ligne que l'on retrouvera dans six mois. « modifs » ou « wip » obligent Nora à ouvrir le diff pendant une panne. Le préfixe `fix:` est une convention de l'équipe, détaillée dans le chapitre sur les revues. Même sans la convention, une phrase verbale et précise suffit.

On ne committe pas pour « sauver » un fichier cassé que les tests refusent, en se disant que l'on corrigera sur la branche principale. La branche principale reçoit des commits que le pipeline peut examiner. Un brouillon reste local, ou sur une branche courte, jusqu'à ce que les tests du frais passent.

```bash
git log -5 --oneline
```

Les cinq derniers messages doivent se lire comme un journal, pas comme une discussion. Si le dernier commit embarque un fichier de trop, et qu'il n'a **pas** été envoyé au distant, Léa peut encore le reprendre tant qu'elle est seule sur ce commit. Dès qu'il est poussé et que quelqu'un d'autre s'en sert, on n'écrit pas l'histoire en silence : on ajoute un commit qui retire le fichier.

# Récupérer le travail des autres

Pendant que Léa arrondit les frais, Samir a intégré un correctif de stock sur la branche principale. La copie de Léa ne le sait pas toute seule.

```bash
git status
git pull
```

`git pull` ramène les commits distants et les fusionne dans la branche courante. C'est un `git fetch` (aller chercher) suivi d'une fusion. On le lance depuis une copie propre : `git status` ne montre pas de modification en cours. Sinon, le pull s'arrête, ou mélange votre brouillon au travail de Samir.

Si la branche courte de Léa doit intégrer le correctif de stock avant la revue :

```bash
git switch main
git pull
git switch fix/frais-centime
git merge main
```

Elle récupère d'abord la branche principale, puis elle l'intègre dans sa branche. L'inverse (mettre sa branche à moitié finie dans la branche principale) n'est pas un pull, c'est une publication. Elle passe par une demande de fusion, pas par un réflexe.

`git pull --rebase` est une variante : elle réécrit vos commits locaux par-dessus ceux du distant, pour un historique linéaire. Elle convient à une branche courte dont Léa est la seule autrice, **avant** que d'autres s'appuient sur ces commits. On ne rebase pas une branche déjà partagée sur laquelle Samir a construit. Réécrire des commits publiés force les autres à réconcilier leur copie à la main. Dans le doute, une fusion ordinaire est le choix le plus sûr.

Après un pull, les tests des frais sont relancés. Le correctif de stock de Samir peut toucher le total du panier. « Le pull a réussi » veut dire que Git a su combiner les lignes, pas que le panier est juste.

# Démêler un conflit simple

Un conflit arrive quand deux commits ont modifié les mêmes lignes, et que Git refuse de deviner. Ce n'est pas une panne de l'outil. C'est un désaccord qu'un humain doit trancher.

Léa a changé l'arrondi. Chloé a changé le même bloc pour un plafond de frais. Au merge, `api/frais.py` contient des marqueurs :

```text
<<<<<<< HEAD
frais = round(centimes)
=======
frais = min(round(centimes), plafond)
>>>>>>> main
```

`HEAD` est la branche sur laquelle Léa se trouve. Entre `=======` et `>>>>>>>`, c'est l'autre côté. Git n'a pas d'avis sur le métier. Les deux comportements peuvent être voulus ensemble : arrondir **et** plafonner.

La résolution :

1. réécrire le bloc pour qu'il fasse les deux, sans laisser aucun marqueur ;
2. lancer le test des frais, y compris un cas au-dessus du plafond ;
3. `git add api/frais.py` pour marquer le conflit comme résolu ;
4. terminer la fusion avec un commit, si Git le demande.

```bash
git status
git add api/frais.py
git commit -m "merge: conserver l'arrondi et le plafond des frais"
```

`git status` liste les fichiers « unmerged » tant que ce n'est pas fait. On ne supprime pas le fichier pour faire taire le conflit. On ne choisit pas non plus « le mien » par fatigue si le plafond de Chloé est déjà en production : le prochain déploiement effacerait son lot.

Si le conflit dépasse ce que vous comprenez (généré, énorme, ou sur un fichier que vous ne devriez pas éditer), vous arrêtez la fusion plutôt que d'inventer.

```bash
git merge --abort
```

La branche revient à l'état d'avant la tentative. Vous appelez Chloé. Un conflit simple se règle dans l'heure. Un conflit incompréhensible est souvent le signe d'une branche trop longue, pas d'une faiblesse personnelle.

# Laisser dehors ce qui n'est pas le produit

`.gitignore` dit à Git quels fichiers ne pas proposer à l'ajout. Il ne rend pas le dépôt plus secret à lui seul : il évite les erreurs répétées.

```text
.env
.env.*
!.env.example
*.pem
.venv/
__pycache__/
```

`.env` contient des valeurs locales, parfois des jetons. `.env.example` ne contient que des noms de variables et des valeurs factices : l'exception `!.env.example` permet de le versionner alors que `.env.*` est ignoré. Les certificats et clés `*.pem` restent dehors. L'environnement virtuel et les fichiers compilés se recréent, ils ne se relisent pas.

`.gitignore` n'enlève pas un fichier **déjà suivi**. S'il apparaît dans `git ls-files`, Git continue de le versionner, ignore ou pas.

```bash
git ls-files .env
git rm --cached .env
```

`git rm --cached` cesse de le suivre, sans l'effacer de votre disque. Le commit suivant enregistre cette suppression. Il faut que `.gitignore` soit en place avant, sinon le prochain `git add` le reprendra.

Les journaux, les bases locales et les artefacts déjà construits suivent la même règle. Le pipeline reconstruit l'artefact. On ne committe pas `commandes-1.8.3.tar` « pour aller plus vite ». Ce fichier mentirait sur sa fraîcheur dès le commit suivant.

# Ne pas committer de secrets

Un secret est une valeur qui donne un pouvoir : jeton du registre, mot de passe de la base, clé privée SSH, clé d'API du paiement. Dans l'équipe de six, la règle est absolue : aucun de ces objets dans un commit, même « juste pour la recette », même dans un fichier de test.

Le paiement factice a un jeton factice, écrit dans `.env.example` comme `PAIEMENT_JETON=changeme`. Le vrai jeton de production n'est pas une variante du même fichier commitée sous un autre nom. Il est injecté par le pipeline, au moment du déploiement, depuis un coffre. Le chapitre sur le pipeline pratique montre le mécanisme. Ici, le réflexe est en amont : `git diff --staged` ne doit jamais afficher une longue chaîne qui ressemble à une clé.

Si le secret est déjà parti, le considérer comme public. Le supprimer dans un commit suivant ne l'efface pas de l'historique : n'importe qui peut regarder l'ancien commit.

L'ordre de réaction :

1. **Révoquer** le secret tout de suite (nouveau jeton, ancienne valeur invalidée). C'est l'action qui protège la boutique. Le nettoyage du dépôt vient après, pas avant.
2. Retirer le fichier du suivi (`git rm --cached`) et ajouter la règle d'ignorance.
3. Prévenir Nora et la personne qui tient le compte du prestataire. Un secret de paiement exposé n'est pas un détail de Git.
4. Nettoyer l'historique avec l'aide de la forge, parce qu'une suppression ordinaire laisse la valeur dans les anciens commits. La forge signale souvent le secret elle-même : on traite l'alerte, on ne la marque pas comme fausse pour faire taire le pipeline.

> [!WARNING]
> Réécrire l'historique d'une branche déjà partagée sans prévenir les cinq autres personnes casse leurs copies. On le fait ensemble, après la révocation, pas en silence le vendredi soir.

Un secret dans un message de commit, dans un ticket collé au dépôt, ou dans la sortie d'un test qui affiche toute la configuration, compte autant qu'un secret dans un fichier. On ne « vérifie » pas un jeton en le passant à `echo` dans une commande que le pipeline conservera.

# Exercices

## Exercice 1 : Le commit fourre-tout

`git status` de Léa montre :

```text
modified:   api/frais.py
modified:   tests/test_frais.py
modified:   .env
untracked:  .venv/
```

Elle s'apprête à lancer `git add .` puis `git commit -m "wip"`. Que doit-elle enregistrer, que doit-elle laisser dehors, et quel message proposez-vous ?

<details>
<summary>Voir la solution</summary>

Elle enregistre `api/frais.py` et `tests/test_frais.py`, après avoir lu `git diff`. Le message peut être `fix: arrondir les frais de livraison au centime`, si c'est bien le contenu du diff.

`.env` reste dehors : il est local et peut contenir un jeton. S'il est déjà suivi, `git rm --cached .env` et une ligne dans `.gitignore`. `.venv/` est recréé par l'installation des dépendances : il va dans `.gitignore`, on ne l'ajoute pas.

`git add .` prendrait les quatre éléments, y compris le secret éventuel et des milliers de fichiers d'environnement. `wip` ne dit rien à Samir dans six mois. On sélectionne les chemins, on relit `--staged`, puis on committe.

</details>

## Exercice 2 : Un conflit sur trois lignes

Léa est sur `fix/frais-centime`. `git merge main` marque un conflit dans `api/frais.py`. Son côté arrondit au centime. Le côté `main` applique un plafond déjà annoncé aux clients. Elle est tentée de garder uniquement son côté, parce qu'elle « connaît ce fichier ».

Quelle combinaison doit rester dans le fichier, quelles commandes terminent la résolution, et dans quel cas `git merge --abort` est le bon choix ?

<details>
<summary>Voir la solution</summary>

Le fichier doit arrondir **et** plafonner. Effacer le plafond parce qu'il gêne le conflit remettrait en production un comportement que Chloé a déjà livré. On réécrit le bloc sans les marqueurs `<<<<<<<`, `=======` et `>>>>>>>`.

```bash
git add api/frais.py
git commit -m "merge: conserver l'arrondi et le plafond des frais"
```

Avant le commit, le test unitaire couvre un montant sous le plafond (l'arrondi se voit) et un montant au-dessus (le plafond se voit).

`git merge --abort` convient si Léa ne comprend plus le reste du fichier, si d'autres conflits touchent des fichiers générés, ou si elle a commencé la fusion sur une copie sale. On revient à l'état précédent et on en parle. Garder « le mien » par défaut n'est pas une résolution, c'est la suppression du lot de quelqu'un d'autre.

</details>

## Exercice 3 : Le jeton est dans l'historique

Chloé a committé `.env` avec le jeton du registre, a poussé sur sa branche, et a ouvert la demande de fusion. Dix minutes plus tard, elle a fait un second commit qui supprime le fichier. Elle écrit à Nora : « c'est bon, il n'est plus dans le dernier commit ».

Que répondez-vous, dans l'ordre des actions ?

<details>
<summary>Voir la solution</summary>

Le jeton est encore dans le premier commit de la branche. Quiconque peut lire la demande de fusion peut le lire. Le second commit ne répare pas l'historique.

Ordre :

1. Révoquer le jeton auprès du registre et en émettre un nouveau. L'ancien est considéré comme public, même si « peu de gens ont vu la branche ».
2. Dire à Chloé de ne pas fusionner cette branche telle quelle, et de prévenir les six. Pas de honte utile : un procès ralentit la révocation.
3. Retirer le fichier du suivi s'il reste, confirmer `.gitignore`, et vérifier que `.env.example` ne contient pas la vraie valeur.
4. Nettoyer l'historique de la branche avec l'aide de la forge, ou jeter la branche et en rouvrir une sans le commit fautif, **après** la révocation. Si la branche avait été fusionnée dans la branche principale, le nettoyage concerne aussi cette branche, et l'équipe le fait ensemble.

Répondre « le dernier commit est propre » serait faux. La question n'est pas le bout de la branche, c'est l'ensemble des instantanés déjà poussés.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Git au quotidien"
center: "Un commit ciblé, une copie à jour, aucun secret dans l'historique."
points:
  - icon: git
    title: "Statut puis diff"
    text: "git status et git diff avant d'ajouter. On sélectionne des fichiers, pas le répertoire entier."
  - icon: file
    title: "Un but par commit"
    text: "Le message dit le pourquoi. Un fourre-tout de frais, de paiement et de lint ne se relit pas."
  - icon: loop
    title: "Pull sur copie propre"
    text: "Ramener la branche principale, relancer les tests. Combiner les lignes ne prouve pas le panier."
  - icon: puzzle
    title: "Conflit tranché"
    text: "On réécrit le bloc sans marqueurs, on teste les deux règles, on n'efface pas le lot voisin."
  - icon: lock
    title: "Secret révoqué d'abord"
    text: "Un commit qui supprime .env laisse la valeur dans l'historique. On révoque, ensuite on nettoie."
pitfall: "git add . puis un message wip, avec .env et .venv dans le même instantané."
remember: "Le dépôt partagé est la référence. La copie locale n'est pas une brouillonnière pour les jetons."
```
