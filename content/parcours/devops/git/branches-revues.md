---
title: Branches courtes et revues
description: Ouvrir une branche courte, tenir une demande de fusion, relire pour comprendre, laisser le pipeline bloquer, et écrire des messages de commit qui se retrouvent.
duration: 55
objectives:
  - Isoler un seul sujet sur une branche qui vit moins de deux jours
  - Rédiger une demande de fusion qu'une autre personne peut vérifier sans appel
  - Utiliser la revue et le pipeline comme deux blocages de nature différente
  - Adopter des messages de commit lisibles, sans en faire une cérémonie
---

# Une branche, un sujet

La branche principale d'Atelier Nord s'appelle `main`. Elle est déployable. On n'y committe pas directement un essai du vendredi. On en part, on y revient vite.

```bash
git switch main
git pull
git switch -c fix/frais-centime
```

`git switch -c` crée la branche et s'y place. Le nom dit le sujet : `fix/frais-centime`, pas `lea-wip` ni `soldes`. Dans deux jours, personne ne saura ce que `soldes` contient. Le préfixe `fix/` ou `feat/` aligne le nom sur le message de commit, sans être une obligation d'outillage.

Une branche courte porte **un** lot, celui du chapitre sur la collaboration. L'arrondi des frais. Pas l'arrondi plus le second moyen de paiement plus le renommage du module. Si Inès ajoute une demande en cours de route, elle devient une autre branche, ou elle attend que celle-ci soit fusionnée.

La durée cible, dans l'équipe de six : le jour même, au plus deux jours ouvrés. Au-delà, Nora demande de couper ou d'abandonner. Ce n'est pas de l'impatience. C'est le coût de la divergence. Chaque commit qui arrive sur `main` pendant que la branche vit est un futur conflit, ou pire, un comportement que Léa ne reteste pas.

Avant de pousser :

```bash
git status
git diff
git push -u origin fix/frais-centime
```

`-u` mémorise le lien avec la branche distante. Les poussées suivantes sont un simple `git push`. On pousse une branche que les tests locaux ont déjà vue. Le pipeline distant confirmera. Il n'est pas là pour remplacer le premier lancement des tests sur le portable, surtout quand ils durent trente secondes.

# La demande de fusion comme conversation

La **merge request** (demande de fusion, aussi appelée pull request selon la forge) propose d'intégrer la branche dans `main`. Ce n'est pas un formulaire administratif. C'est le lieu où Samir, Marc et Nora lisent le même texte.

Une demande de l'équipe tient en une page :

- ce que le client ou l'exploitation observe (les frais tombent au centime le plus proche) ;
- ce qui n'est **pas** dans le lot (pas de changement de plafond, pas de nouveau paiement) ;
- comment vérifier (test automatique, scénario de panier en recette) ;
- comment revenir en arrière (artefact précédent, pas de migration) ;
- la configuration, s'il y en a une nouvelle.

Léa ouvre la demande tôt, même si un test manque encore, et elle l'indique. Une demande ouverte le matin se relit l'après-midi. Une demande ouverte à 18 h « parce que c'est fini » se relit mal, ou se fusionne sans lecture.

```diagram
type: sequence
title: "De la branche à la branche principale"
actors: ["Léa", "Pipeline", "Samir"]
messages:
  - from: 0
    to: 1
    text: "Pousse la branche et ouvre la demande"
  - from: 1
    to: 0
    text: "Refuse tant que les tests sont rouges"
  - from: 0
    to: 1
    text: "Pousse le correctif du test"
  - from: 1
    to: 2
    text: "Annonce des tests verts"
  - from: 2
    to: 0
    text: "Relit le diff et le texte de la demande"
```

Le titre de la demande reprend le but, pas le numéro de ticket seul. « fix: arrondir les frais de livraison au centime » se retrouve dans la liste. « Ticket 4821 » oblige à ouvrir l'outil de suivi pour savoir si l'on parle du stock ou du paiement.

On commente dans la demande, pas dans un chat parallèle qui se perd. Un désaccord sur l'arrondi bancaire ou l'arrondi classique reste attaché à la ligne. Inès peut lire sans avoir été dans la conversation de 11 h.

Quand la branche est fusionnée, on la supprime, locale et distante. Une branche fusionnée que l'on garde « au cas où » redevient un endroit où quelqu'un commitera par erreur le mois suivant.

# Relire pour comprendre

La revue n'est pas une note de style, ni un rite de passage. Samir relit pour comprendre le changement assez bien pour le soutenir en production. S'il ne le comprend pas, il ne l'approuve pas « pour débloquer Léa ».

Il regarde, dans l'ordre :

1. le texte de la demande, pour savoir quel comportement est promis ;
2. le diff, pour voir si le code fait cette promesse et rien d'autre ;
3. les tests, pour voir si le cas du centime et le cas du plafond voisin sont couverts ;
4. l'exploitation, si Nora n'est pas la relectrice : variable, journal, retour arrière.

Il n'exige pas que le diff soit écrit comme il l'aurait écrit. Il signale un bug, un secret, un lot mélangé, un test qui ne vérifie rien, une migration impossible à défaire. Un renommage de variable sans effet peut être mentionné. Il ne bloque pas la semaine.

Léa reçoit les remarques comme des faits sur le diff, pas comme un jugement. « Cette branche ajoute un délai de 30 secondes que la recette ne supporte pas » se traite. « Tu fais toujours des trucs compliqués » ne se traite pas, et n'a pas sa place dans la demande.

Deux approbations ne sont pas toujours nécessaires dans une équipe de six. Une approbation d'une personne qui n'est pas l'auteur, plus un pipeline vert, suffit pour un lot de la taille de l'arrondi. Un changement de paiement ou de migration demande Nora **et** une personne du développement. La règle est écrite dans la forge (qui peut approuver, qui peut fusionner), pas dans la mémoire de Nora.

> [!IMPORTANT]
> L'auteur ne fusionne pas sa propre demande sans qu'un autre l'ait lue, sauf accord explicite de l'équipe pour un correctif d'urgence déjà vu à l'oral et rattrapé par une revue le lendemain. L'urgence qui saute la revue à chaque vendredi n'est plus une urgence, c'est le processus.

```video
url: https://www.youtube.com/watch?v=1Ge__2Yx_XQ
title: "Code Review Best Practices For Software Engineers"
channel: "Clément Mihailescu"
duration: "15:27"
lang: en
why: "Des bonnes pratiques de revue de code : taille des changements, ton des commentaires et ce qu'on cherche vraiment."
```

# Le pipeline qui bloque

La revue humaine rate des choses. Le pipeline en rate d'autres. Les deux bloquent la fusion, pour des raisons différentes.

Le pipeline de la demande lance lint et tests sur le commit proposé. Tant qu'il est rouge, le bouton de fusion est inactif. Ce n'est pas une suggestion. Samir ne peut pas dire « on fusionnera quand même, le test est capricieux » sans retirer le blocage, et retirer le blocage est un événement rare, assumé, pas un réflexe.

```diagram
type: decision
title: "Peut-on fusionner ?"
nodes:
  - question: "Le pipeline de la demande est-il vert sur le dernier commit ?"
    yes: "La partie automatique est satisfaite. Question suivante."
    no: "On ne fusionne pas. On corrige ou on traite le test instable comme un vrai travail."
  - question: "Une personne autre que l'auteur a-t-elle approuvé le diff ?"
    yes: "La revue humaine est là. Question suivante."
    no: "On attend la lecture. Un pipeline vert ne relit pas le métier."
  - question: "Le texte dit-il le signal et le retour arrière ?"
    yes: "La demande peut entrer dans main."
    no: "Elle reste ouverte. Terminé inclut l'exploitation."
```

Ce que le pipeline bloque bien : le test des frais qui échoue, le lint, une dépendance qui ne s'installe pas, un secret détecté par la forge.

Ce que le pipeline ne bloque pas : un arrondi métier faux mais cohérent avec un test faux, une variable de production oubliée, un lot trop gros. C'est le travail de Samir et de Nora.

Quand le pipeline est rouge, on lit la première cause. On ne relance pas le job trois fois en espérant un vert. Si le test échoue une fois sur trois, l'équipe a un test instable. Le chapitre sur la qualité automatique explique pourquoi le rendre silencieux est pire que le laisser rouge. Ici, la conséquence est simple : une demande dont le pipeline clignote n'est pas fusionnable. Marc ne « valide quand même ».

Le blocage s'applique à `main` seulement. Léa peut pousser des commits rouges sur sa branche courte pendant qu'elle cherche. Elle ne les amène pas dans la branche que le lendemain déploiera.

# Conventional commits, l'idée

Les **conventional commits** sont une façon d'écrire la première ligne du message :

```text
fix: arrondir les frais de livraison au centime
feat: ajouter un plafond de frais configurable
chore: épingler la version du client HTTP
docs: décrire la variable TAUX_TVA
```

`fix` corrige un comportement. `feat` ajoute un comportement visible. `chore` est l'entretien (outil, dépendance) sans changement promis au client. `docs` ne touche que la documentation. D'autres types existent. L'équipe de six n'a pas besoin de la liste exhaustive.

L'idée, pas le dogme : un message préfixé se parcourt dans `git log`, aide à rédiger le journal des changements, et évite le « modifs ». Le corps du message, séparé par une ligne vide, explique le cas du centime si la première ligne ne suffit pas.

Ce qui n'est pas l'idée : bloquer une revue de deux heures parce que Léa a écrit `Fix` avec une majuscule, ou parce qu'un correctif de documentation est marqué `chore`. Nora peut rappeler la convention. Elle ne refuse pas un correctif de paiement urgent pour une virgule de préfixe. Si l'équipe veut une vérification automatique du préfixe, elle l'ajoute au pipeline plus tard, quand les messages sont déjà propres la plupart du temps. L'outil avant l'habitude produit des messages conformes et vides.

Le lien avec la branche : `fix/frais-centime` et `fix: arrondir les frais de livraison au centime` racontent la même histoire. Quelqu'un qui lit la liste des branches et quelqu'un qui lit l'historique ne décodent pas deux langues.

# Le flux dans l'équipe de six

Voici la journée type, une fois les habitudes en place.

Le matin, Léa met `main` à jour et crée `fix/frais-centime`. Elle commite le calcul et le test. Elle pousse et ouvre la demande avec le scénario de Marc et la phrase de retour arrière.

Le pipeline passe au rouge : un cas à 0 centime n'était pas prévu. Léa pousse un correctif. Le pipeline repasse au vert. Samir relit, demande que le plafond de Chloé reste couvert par un test, approuve.

Nora jette un œil parce que la demande touche le total payé. Elle n'a rien à ajouter sur la configuration : aucune variable nouvelle. Elle ne fusionne pas à la place de l'équipe pour « aller plus vite ». Samir fusionne. La branche distante est supprimée. Le pipeline de `main` publie l'artefact et le déploie en recette. Marc joue le panier.

Chloé, le même jour, a sa propre branche `feat/plafond-frais`. Elle ne la pose pas sur celle de Léa. Deux sujets, deux demandes. Si le plafond a besoin de l'arrondi déjà fusionné, Chloé met `main` à jour **après** la fusion de Léa, pas avant en copiant des commits à la main.

Personne ne garde de branche personnelle permanente. `nora-prod` ou `lea-dev` deviennent des deuxièmes produits, sans revue. Le jour où l'on déploie depuis l'une d'elles « parce que le correctif y est », on ne sait plus ce qui est dans `main`. La règle tient en une phrase : ce qui est en recette vient de `main`, et `main` ne reçoit que des demandes vertes et lues.

```bash
git switch main
git pull
git log -3 --oneline
git branch --merged main
```

`git branch --merged main` montre les branches locales déjà contenues dans `main`. Ce sont des candidates à la suppression. On ne supprime pas une branche non fusionnée sans savoir où est son travail.

# Exercices

## Exercice 1 : Nommer et couper

Chloé a une branche `soldes` ouverte depuis douze jours. Elle contient le plafond de frais, un brouillon du second paiement, et un correctif du message d'erreur déjà demandé par Inès pour cette semaine. `main` a reçu quinze commits depuis le départ de la branche.

Que lui demandez-vous de faire avant toute revue, et quel nom porte la branche qui peut partir cette semaine ?

<details>
<summary>Voir la solution</summary>

On ne relit pas `soldes` comme un seul lot. Douze jours et trois sujets garantissent une revue superficielle et une fusion risquée.

Chloé met de côté le brouillon de paiement (il n'est pas prêt) et isole le correctif du message d'erreur, qui est le seul promis cette semaine, sur une branche nouvelle partie de `main` à jour. Nom possible : `fix/message-paiement`. Le plafond, s'il est prêt, va sur `feat/plafond-frais`, dans une seconde demande, après la première ou en parallèle s'il ne touche pas les mêmes lignes.

La branche `soldes` est abandonnée ou réduite une fois les commits utiles extraits. On ne la « finit » pas pendant le week-end pour justifier les douze jours. Les quinze commits de `main` doivent être dans la base de la nouvelle branche, pas rattrapés la veille des soldes.

</details>

## Exercice 2 : Pipeline vert, revue insuffisante

La demande « feat: second moyen de paiement » a un pipeline vert. Le diff fait 1 200 lignes, le texte dit « comme convenu », il n'y a pas de scénario de repli vers l'ancien moyen, et l'auteur a cliqué sur fusionner parce que l'outil l'autorisait encore.

Quels blocages manquaient, et lesquels le pipeline ne pouvait pas fournir ?

<details>
<summary>Voir la solution</summary>

Le pipeline a fait son travail : les tests qu'il connaît sont verts. Il ne pouvait pas savoir que le texte est vide, que le lot est trop gros pour être compris, ni que le repli vers l'ancien moyen est absent. Ce sont des blocages humains.

Il manquait une règle de forge : l'auteur ne fusionne pas seul, et une approbation d'une autre personne est obligatoire. Il manquait aussi le critère de terminé : comment revenir au moyen de paiement actuel, écrit dans la demande. Enfin, 1 200 lignes sur un paiement indiquent un lot à couper avant revue, pas une revue à accélérer.

Rendre le pipeline encore plus strict n'aurait pas remplacé la lecture. En revanche, laisser le bouton actif sans approbation a transformé un oubli en mise en ligne. On active l'approbation obligatoire sur `main` le jour même, et on revient sur cette demande si elle est déjà entrée : pas en blâmant le clic, en remettant le garde-fou.

</details>

## Exercice 3 : Réécrire trois messages

Le journal de la branche de Samir contient :

```text
wip
fix
encore le test
```

Le diff réel, commit par commit : correction du stock affiché, ajout du test qui manquait, mise à jour d'une dépendance sans lien avec le stock.

Proposez trois premières lignes au format conventional commits, et dites lequel de ces commits n'aurait pas dû être sur cette branche.

<details>
<summary>Voir la solution</summary>

```text
fix: afficher le stock réel avant le paiement
test: couvrir le stock des articles en précommande
chore: épingler la version du client HTTP
```

Le troisième n'aurait pas dû partager la branche du stock. Une mise à jour de dépendance est un lot `chore` séparé, avec son propre pipeline, parce qu'un retour arrière du stock ne doit pas ramener l'ancienne dépendance, et inversement. Si le test est le complément direct du correctif, le garder dans la même demande est légitime : on peut même le combiner au premier commit tant que la branche n'est pas partagée. Le séparer en `test:` reste lisible.

`wip` et `fix` seuls ne permettent pas à Nora, pendant une panne, de savoir lequel des trois commits a touché le stock. Le préfixe sans phrase ne suffit pas non plus : `fix` tout seul n'est pas un message.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Branches courtes et revues"
center: "Une branche, un sujet, une lecture humaine, un pipeline qui peut dire non."
points:
  - icon: git
    title: "Moins de deux jours"
    text: "On part de main à jour et on y revient vite. Une branche de douze jours mélange trois produits."
  - icon: file
    title: "Demande lisible"
    text: "Promesse, hors-sujet, vérification, retour arrière. Le chat ne remplace pas ce texte."
  - icon: eye
    title: "Relire pour soutenir"
    text: "On approuve ce que l'on comprend. Un style différent ne bloque pas. Un secret ou un trou, si."
  - icon: test
    title: "Rouge interdit"
    text: "Le pipeline bloque la fusion. On corrige la cause. On ne relance pas trois fois en espérant."
  - icon: list
    title: "Messages préfixés"
    text: "fix, feat, chore, docs : une idée pour se relire. Pas une cérémonie qui retient un correctif."
pitfall: "Fusionner sa propre demande parce que le pipeline est vert et que le texte dit comme convenu."
remember: "Le pipeline garde les tests. La revue garde le sens. Les deux sont obligatoires sur main."
```
