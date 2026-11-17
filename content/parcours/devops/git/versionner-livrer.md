---
title: Versionner ce qui part
description: Poser des tags, suivre la version sémantique, tenir un journal des changements, et lier un artefact immutable au commit qui est vraiment en production.
duration: 60
objectives:
  - Identifier un commit livré par un tag annoté que l'on ne réutilise pas
  - Choisir un niveau de version sémantique selon le contrat de l'API
  - Rédiger un journal des changements lisible par le produit et par l'exploitation
  - Vérifier qu'un artefact immutable, un tag et la page de santé racontent la même chose
---

# Pourquoi identifier ce qui part

Mardi, 9 h 12. Le paiement d'Atelier Nord dévie. Inès demande : « c'est la version d'hier soir ou celle de ce matin ? » Léa répond : « j'ai poussé ». Nora répond : « le serveur a redémarré ». Aucune des deux phrases n'est une identité. Pousser ne dit pas ce qui a été construit. Redémarrer ne dit pas quel instantané a été lancé.

Sans identité, le retour arrière est un pari. On remet « l'ancienne version » que quelqu'un a peut-être écrasée. On compare des courbes qui ne portent pas le même nom. On corrige un bug déjà corrigé dans un commit qui n'est pas celui qui tourne.

L'équipe de six se fixe trois étiquettes qui doivent coïncider :

- le **commit** Git, identifiant du source ;
- le **tag** de version, nom stable pour les humains (`v1.8.3`) ;
- l'**artefact**, paquet construit par le pipeline à partir de ce commit, que l'on ne modifie plus une fois publié.

La page `/sante` répète la version et le commit. Si l'un des trois diverge, on ne sait pas ce qui est en production, et on s'arrête avant d'ajouter un nouveau correctif par-dessus l'inconnu.

# Le tag pointe vers un commit

Un tag est un nom posé sur un commit. Pour une livraison, on utilise un tag **annoté** : il porte un message, une date et un auteur, contrairement à un simple alias facile à déplacer sans laisser de trace.

```bash
git switch main
git pull
git log -1 --oneline
git tag -a v1.8.3 -m "corrige l'arrondi des frais de livraison"
git push origin v1.8.3
git show v1.8.3 --no-patch
```

On tague un commit déjà sur `main`, déjà vert, pas une branche personnelle, pas un répertoire de travail sale. Le message dit ce que cette version apporte, en une ligne. `git show` doit afficher le tag puis le commit attendu. Si le commit n'est pas celui que Léa croit, on ne « déplace » pas le tag déjà poussé.

Réutiliser `v1.8.3` pour un autre commit est un mensonge. Le registre, la recette et le journal des changements ont peut-être déjà parlé de ce nom. On crée `v1.8.4` pour le correctif suivant. Si un tag a été poussé par erreur et que **personne** ne l'a déployé, on peut le supprimer et le recréer, en le disant aux six. Dès qu'un environnement l'a tiré, le nom est pris.

```bash
git fetch --tags
git tag -l "v1.8.*"
```

La liste des tags est la liste des livraisons nommées. Un trou (`v1.8.1` puis `v1.8.3`) se justifie : `v1.8.2` a peut-être été abandonné avant déploiement. On l'écrit dans le journal. On ne réattribue pas le numéro « parce qu'il est joli ».

Le pipeline peut poser le tag à votre place quand une livraison est décidée. Le geste manuel ci-dessus reste celui que vous devez comprendre. Un tag créé sur un portable à partir d'une branche non fusionnée ne doit pas déclencher la production. La règle de la forge : seuls les tags `v*` posés sur `main` lancent une publication.

# La version sémantique sans mystère

La version **sémantique** (semver) écrit trois nombres : `MAJEUR.MINEUR.CORRECTIF`. Pour l'API commandes, déjà en `1.x`, chaque nombre a un contrat.

Le **correctif** (`1.8.2` vers `1.8.3`) répare sans changer le contrat. L'arrondi au centime, si les clients recevaient déjà un montant de frais et que le sens du champ ne change pas, est un correctif. Les appelants n'ont rien à modifier.

Le **mineur** (`1.8.3` vers `1.9.0`) ajoute quelque chose sans casser l'existant. Un champ facultatif `frais_detail` que les anciens clients ignorent est un mineur. Le moyen de paiement actuel reste le chemin par défaut.

Le **majeur** (`1.9.0` vers `2.0.0`) casse un contrat. Supprimer le champ `frais`, changer l'unité des centimes en euros, ou exiger un en-tête nouveau que les anciens clients n'envoient pas : les appelants doivent changer en même temps, ou être accompagnés.

```diagram
type: decision
title: "Quel numéro incrémenter ?"
nodes:
  - question: "Un client actuel de l'API doit-il modifier son code pour continuer à commander ?"
    yes: "Version majeure. On accompagne les appelants, on ne glisse pas ça dans un correctif."
    no: "Le contrat tient. Question suivante."
  - question: "Ajoute-t-on un comportement ou un champ que les anciens peuvent ignorer ?"
    yes: "Version mineure."
    no: "Correctif : réparation, sans nouvelle promesse."
```

Avant `1.0.0`, certaines équipes laissent les mineurs casser le contrat. L'API d'Atelier Nord est en `1.8`. On ne joue plus avec cette tolérance. Un changement cassant dans `1.8.4` est une erreur de numérotation, pas un détail.

Le numéro est décidé dans la demande de fusion, pas après coup pour « rattraper » un tag. Inès entend « mineur » comme « les applications existantes continuent de payer ». Si c'est faux, le numéro ment, et le journal des changements aussi.

# Un journal que l'on peut lire

Le **changelog** (journal des changements) est un fichier du dépôt, `CHANGELOG.md`, écrit pour Inès, Marc et les appelants de l'API. Ce n'est pas la copie brute de `git log`. Les messages de commit aident à le rédiger. Un humain enlève le bruit.

```text
## 1.8.3

- Corrigé : les frais de livraison s'arrondissent au centime le plus proche.
- Les commandes au-dessus du plafond de frais ne changent pas de règle.

## 1.8.2

- Corrigé : le stock des précommandes ne s'affiche plus comme disponible.
```

Chaque entrée dit l'effet, pas le nom du fichier. « Modifié `api/frais.py` » n'aide pas Inès. « Les frais s'arrondissent au centime » l'aide à répondre au support.

On met à jour le journal dans la même demande que le changement visible. Un correctif interne de pipeline, invisible pour la boutique et pour les appelants, peut rester hors du journal produit et vivre dans le message de commit. On ne gonfle pas le journal pour prouver que l'on a travaillé. On ne l'oublie pas pour un changement que le support devra expliquer lundi matin.

Les conventional commits rendent la relecture plus facile : tous les `fix:` et `feat:` depuis `v1.8.2` sont des candidats. Nora n'installe pas, dès le premier jour, un générateur qui publie le journal sans le relire. Un générateur produit un brouillon. Inès doit pouvoir le lire à voix haute.

Une entrée fausse est pire qu'une entrée absente. Si `1.8.3` annonce le plafond de frais alors que ce lot est resté derrière un interrupteur éteint, le support donnera une mauvaise réponse. Le journal décrit ce qui est **actif** pour les clients, ou il dit explicitement « disponible, encore désactivé ».

# L'artefact immutable

L'artefact est le paquet que le pipeline construit à partir d'un commit, publie dans un registre, et que les environnements déploient. Immutable veut dire : une fois `commandes` version `1.8.3` publié, ses octets ne changent plus. Un correctif, même d'une ligne, est `1.8.4`.

Le registre refuse un second envoi qui écraserait `1.8.3`. Cette erreur est une protection, pas une gêne. Elle apparaît quand quelqu'un relance une construction « avec un petit changement en plus » en réutilisant le numéro.

```bash
# Ce que le pipeline enregistre, conceptuellement
# artefact : commandes:1.8.3
# commit   : a1b2c3d
# empreinte: sha256:9f2c... (calculée sur le paquet, pas recopiée à la main)
```

L'empreinte (un condensat du paquet) identifie les octets. Le tag Git identifie le source. Les deux sont liés par le journal du pipeline : « à partir de `a1b2c3d`, j'ai publié `commandes:1.8.3` dont l'empreinte est `sha256:9f2c…` ». On ne recalcule pas l'artefact sur le serveur de production à partir d'un dossier que l'on espère identique.

`latest` est un pointeur mobile. Il suit « le dernier envoi », pas une version. La production d'Atelier Nord ne déploie pas `latest` comme seule référence. Demain, `latest` peut être un essai de Chloé. La production déploie `1.8.3`, ou l'empreinte exacte. `latest` peut exister pour la commodité d'un poste de développement. Il n'est pas une identité.

```diagram
type: flow
title: "Du commit au paquet que l'on ne réécrit plus"
steps:
  - title: Commit sur main
    text: "Tests verts, demande déjà relue."
    tone: blue
  - title: Tag v1.8.3
    text: "Nom posé sur ce commit, poussé une fois."
    tone: violet
  - title: Construction
    text: "Le pipeline produit le paquet, pas un portable."
    tone: teal
  - title: Publication
    text: "Le registre garde ces octets sous ce numéro."
    tone: amber
  - title: Déploiement
    text: "Recette puis production tirent ce numéro, sans recompiler."
    tone: rose
```

Si la construction doit être relancée parce qu'elle a échoué avant la publication, aucun client n'a vu `1.8.3`. On peut recommencer **le même commit**. Si le paquet a été publié et déployé, le prochain essai a un nouveau numéro, même si le source n'a changé que dans le pipeline. Les octets publiés restent ceux que la recette a vus.

# Relier les trois en production

Le moment de vérité est après le déploiement, pas avant. Nora, ou Samir, vérifie que les trois identités parlent du même objet.

```bash
curl -sS https://api.atelier-nord.example/sante
git show v1.8.3 --no-patch
```

`/sante` doit répondre `1.8.3` et le commit que `git show` attache au tag. Le journal du pipeline de publication doit citer la même empreinte que celle que le déploiement a tirée. Trois sources, un seul récit.

Écarts que l'équipe a déjà rencontrés, et la réaction :

**La page de santé montre un autre commit que le tag.** Le serveur n'a pas le paquet que l'on croit. On ne déclare pas la livraison réussie. On cherche quel artefact a été démarré (déploiement manuel, ancien processus encore en vie).

**Le tag est bon, le registre n'a pas `1.8.3`.** Le tag a été poussé sans pipeline, ou le pipeline a échoué après le tag. La production ne « se débrouille » pas en compilant. On relance la publication de ce commit, ou l'on abandonne le numéro s'il n'a jamais été tiré.

**Le registre a deux empreintes pour le même numéro.** L'immutabilité a été contournée. On considère le numéro comme peu fiable. On publie `1.8.4` à partir du commit que l'on veut vraiment, on déploie celle-là, et l'on corrige le registre pour qu'un écrasement redevienne une erreur.

La recette et la production tirent le même numéro. Seule la configuration change (base, jeton de paiement, interrupteurs). Si la recette a validé `1.8.3` et que la production reconstruit « la même chose » depuis `main` une heure plus tard, `main` a pu bouger. Ce n'est plus ce que Marc a validé.

Inès peut annoncer aux clients ce que `1.8.3` contient parce que le journal, le tag et la page de santé sont d'accord. Le support lit le journal. L'exploitation lit `/sante`. Le développement lit le commit. La même version est le point de rencontre des six.

# Exercices

## Exercice 1 : Quel numéro

L'API renvoie aujourd'hui `frais` en centimes. Trois demandes sont sur la table.

1. L'arrondi au centime le plus proche, même champ, même unité.
2. Un champ facultatif `frais_detail`, que les anciens clients peuvent ignorer.
3. Le champ `frais` passe en euros, et les clients qui envoient encore des centimes sont refusés.

Quel niveau semver pour chacune, à partir de `1.8.2` ? Dans quel ordre les livrer si Inès veut les trois ?

<details>
<summary>Voir la solution</summary>

1. Correctif : `1.8.3`. Aucun appelant n'a à changer.
2. Mineur : `1.9.0`. On ajoute un contrat, on ne retire rien. Les anciens ignorent le champ.
3. Majeur : `2.0.0`. Le sens de `frais` change, les anciens clients cassent.

Ordre : d'abord `1.8.3`, pour que l'arrondi soit en production sans attendre la rupture. Ensuite `1.9.0`, pour que les appelants qui le souhaitent lisent le détail pendant que `frais` est encore en centimes. Enfin `2.0.0`, annoncé, avec un délai pour les appelants. Glisser le passage en euros dans `1.8.4` serait un contrat rompu sous un numéro de correctif. Le support et les applications mobiles ne le verraient qu'en panne.

</details>

## Exercice 2 : Le tag déjà pris

Nora a poussé `v1.8.3` et le pipeline a publié l'artefact. Marc trouve un bug d'affichage dans le journal des frais, une ligne, sans effet sur le montant. Léa veut « remettre le tag sur le nouveau commit pour ne pas multiplier les numéros ».

Que faites-vous du tag, de l'artefact et du journal ?

<details>
<summary>Voir la solution</summary>

On ne déplace pas `v1.8.3`. Il a été publié. Des environnements, ou au minimum le registre, connaissent ces octets. Le correctif d'affichage devient `v1.8.4`, nouveau commit sur `main`, nouvel artefact. `1.8.3` reste ce que Marc a vu, y compris le défaut d'affichage.

Le journal gagne une entrée `1.8.4` qui décrit la ligne d'affichage. L'entrée `1.8.3` ne est pas réécrite pour faire semblant que le défaut n'a pas existé. Si `1.8.3` n'a jamais quitté le registre et n'a été déployé nulle part, on pourrait encore discuter d'un abandon du numéro, en le disant à l'équipe. Dès qu'une recette l'a tiré, le nom est consommé.

Multiplier les numéros est le but. Un numéro qui change de contenu n'est plus un numéro.

</details>

## Exercice 3 : Trois sources, un écart

Après le déploiement, vous avez :

- `/sante` : `version 1.8.3`, commit `bbbbbbb` ;
- `git show v1.8.3` : commit `aaaaaaa` ;
- le registre : `commandes:1.8.3` publié à partir de `aaaaaaa`.

La boutique encaisse encore. Inès veut quand même « laisser tourner puisque ça paie ». Quelle identité est en production, et que décidez-vous ?

<details>
<summary>Voir la solution</summary>

La production exécute le commit `bbbbbbb`, qui n'est pas celui du tag ni celui de l'artefact `1.8.3`. Le nom `1.8.3` sur `/sante` est donc mensonger, ou un autre processus que l'artefact publié répond à sa place. « Ça paie » ne dit pas que l'on sait revenir en arrière, ni que Marc a validé ces octets.

On n'annonce pas la livraison comme réussie. On identifie le processus qui répond (deux exemplaires, déploiement hors pipeline, fichier copié à la main). On remet en service l'artefact `commandes:1.8.3` du commit `aaaaaaa`, celui que le registre et le tag décrivent, **si** c'est bien celui validé en recette. Puis on vérifie que `/sante` affiche `aaaaaaa`.

Si `bbbbbbb` était un correctif volontaire, il n'a pas d'artefact ni de tag : on le livre comme `1.8.4`, par le pipeline, au lieu de le laisser tourner sous un faux nom. Laisser l'écart « puisque ça paie » fabrique la prochaine panne, celle où personne ne saura quel source corriger.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Versionner ce qui part"
center: "Tag, artefact et page de santé doivent nommer le même commit."
points:
  - icon: git
    title: "Tag annoté, une fois"
    text: "v1.8.3 désigne un commit de main. On ne le déplace pas après publication."
  - icon: ruler
    title: "Trois nombres"
    text: "Correctif si le contrat tient, mineur si l'on ajoute, majeur si un client doit changer."
  - icon: book
    title: "Journal humain"
    text: "L'effet pour la boutique, pas la liste des fichiers. On décrit ce qui est vraiment actif."
  - icon: lock
    title: "Paquet figé"
    text: "Le registre refuse d'écraser 1.8.3. Un octet de plus, c'est 1.8.4. latest n'est pas une identité."
  - icon: eye
    title: "Trois sources d'accord"
    text: "Santé, tag et registre. Un commit qui diffère, et la livraison n'est pas déclarée faite."
pitfall: "Déployer latest, ou recompiler sur le serveur, puis appeler ça 1.8.3 quand même."
remember: "Ce qui part en production doit pouvoir être nommé, comparé et remis en place sans deviner."
```
