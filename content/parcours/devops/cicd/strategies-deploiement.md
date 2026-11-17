---
title: Stratégies de déploiement
description: Choisir entre roulant, bleu-vert et canari, séparer déployer et exposer avec un interrupteur, et revenir en arrière sans big bang la veille des soldes.
duration: 70
objectives:
  - Déployer le même artefact en recette et en production, avec une configuration différente
  - Choisir un déploiement roulant, bleu-vert ou canari selon la compatibilité et le trafic
  - Séparer le déploiement du code et l'exposition aux clients grâce à un interrupteur
  - Revenir à l'artefact précédent, et refuser un big bang quand le retour arrière n'existe pas
---

# Le même artefact, deux configurations

La recette d'Atelier Nord a validé `commandes:1.8.3`. La production doit recevoir **ces octets-là**, pas une reconstruction faite une heure plus tard depuis `main`. Entre les deux environnements, ce qui change est la configuration : adresse de la base, jeton du paiement (factice ou réel), interrupteurs, nombre d'exemplaires.

```diagram
type: compare
title: "Ce qui change, ce qui ne change pas"
columns:
  - title: Identique
    tone: teal
    items:
      - "L'artefact commandes:1.8.3"
      - "Le commit et l'empreinte"
      - "Les migrations déjà compatibles"
  - title: Différent
    tone: amber
    items:
      - "Base, jetons, noms de domaines"
      - "Interrupteurs et volume de trafic"
      - "Qui approuve le déploiement"
```

Si la recette recompile, Marc n'a pas validé ce qui partira. Si la production « ajuste une petite ligne » sur le serveur, `/sante` ment. Le chapitre sur le pipeline a déjà séparé les jobs. Ici, la stratégie commence après ce choix : comment remplacer les exemplaires qui répondent aux clients, sans couper la boutique d'un coup.

La recette n'est pas une copie des commandes réelles. Elle joue un jeu de données fictif ou anonymisé. Un dump de production « pour que ce soit pareil » copie aussi les personnes. On rapproche le **comportement** (délais, version du moteur, mêmes noms de variables), pas les données des clients.

Plusieurs exemplaires de l'API tournent derrière un répartiteur. Le déploiement consiste à les remplacer selon une stratégie. Une seule machine, un seul processus : plusieurs stratégies ci-dessous se simplifient, et le risque se concentre. On le dit avant de choisir un canari qu'une seule instance ne sait pas faire.

# Déployer en roulant

Le déploiement **roulant** (rolling) remplace les exemplaires un par un. Le répartiteur envoie le trafic aux exemplaires encore sains. Sur quatre exemplaires, on en retire un, on démarre `1.8.3`, on attend `/sante`, on passe au suivant. À mi-chemin, `1.8.2` et `1.8.3` répondent en même temps.

```diagram
type: flow
title: "Un roulement sur quatre exemplaires"
steps:
  - title: Retirer un ancien
    text: "Il finit les requêtes en cours, puis s'arrête."
    tone: blue
  - title: Démarrer 1.8.3
    text: "Même artefact, configuration de production."
    tone: teal
  - title: Attendre la santé
    text: "Le répartiteur ne l'envoie du trafic qu'ensuite."
    tone: amber
  - title: Continuer
    text: "Les autres suivent, ou l'on s'arrête si les erreurs montent."
    tone: rose
```

Cette coexistence est l'exigence cachée. L'ancien et le nouveau doivent accepter les mêmes commandes pendant le roulement. Un champ obligatoire ajouté d'un coup, que `1.8.2` ne sait pas lire, casse la moitié du trafic. On élargit d'abord le contrat (champ facultatif), on déploie, on resserre plus tard. C'est le même principe qu'une colonne de base : ajouter, remplir, basculer la lecture, supprimer l'ancienne seulement quand plus aucun exemplaire ne l'utilise.

Le roulement convient à l'arrondi des frais, si les deux versions calculent un montant que le paiement sait encaisser. Il ne convient pas à une rupture que l'on devrait imposer à tout le monde à la même seconde. Il économise les machines : pas besoin d'un second parc complet.

Quelques `503` pendant qu'un exemplaire s'arrête peuvent être prévus, si le répartiteur l'a retiré avant. Des erreurs qui continuent après le démarrage du nouveau ne le sont pas. On arrête le roulement et l'on revient à `1.8.2` sur les exemplaires déjà mis à jour, au lieu de « finir puisque c'est commencé ».

# Bleu et vert

Le **bleu-vert** (blue-green) tient deux parcs. Le bleu sert les clients en `1.8.2`. Le vert démarre en `1.8.3`, sans trafic, ou avec seulement les vérifications. On joue le scénario contre le vert. Puis le répartiteur bascule. Le retour arrière est la bascule inverse, tant que le bleu est encore là.

Le coût est réel : deux fois les exemplaires, le temps de la bascule. Pour une équipe de six, on ne le paie pas sur chaque arrondi. On le paie quand le roulement est impossible (rupture brève que l'on préfère assumer d'un coup, avec un retour encore simple) ou quand on veut une validation finale sur le parc de production, à l'écart des clients.

La base est souvent **partagée**. Bleu et vert parlent à la même donnée. La bascule ne duplique pas les commandes. Une migration destructive (colonne supprimée) casse la couleur que l'on n'a pas encore éteinte. Le bleu-vert n'est un retour arrière facile que si les deux versions savent encore lire la base. Sinon, on a deux parcs et un seul sens possible. On a payé le double pour un big bang déguisé.

Le piège du nom de domaine : basculer en changeant un enregistrement DNS dont le cache dure une heure. Une partie des clients reste sur le bleu, longtemps, sans que le pipeline le montre. On préfère un répartiteur que l'on commande tout de suite. Le DNS, s'il sert quand même, a un TTL court **avant** le jour de la bascule, pas le jour même.

```video
url: https://www.youtube.com/watch?v=AWVTKBUnoIg
title: "Top 5 Most-Used Deployment Strategies"
channel: "ByteByteGo"
duration: "10:00"
lang: en
why: "ByteByteGo compare les stratégies de déploiement les plus courantes : big bang, rolling, bleu-vert, canari et tests A/B."
```

# Le canari

Le **canari** envoie une petite part du trafic au nouveau, et garde le reste sur l'ancien. Cinq pour cent des paiements vont vers `1.8.3`. On regarde le taux d'erreur et le nombre de commandes payées. Si la courbe tient, on passe à vingt-cinq, puis à cent. Si elle casse, les cinq pour cent reviennent en arrière. Les quatre-vingt-quinze autres n'ont pas vu le défaut.

Il faut un répartiteur capable de ce pourcentage, et assez de trafic pour que cinq pour cent veuillent dire quelque chose. À 2 h du matin, cinq pour cent d'Atelier Nord peuvent être trois commandes. Trois succès ne prouvent pas le samedi des soldes. On choisit une heure où le volume rend la comparaison lisible, ou l'on allonge l'observation.

Le canari ne remplace pas les tests. Il limite le rayon d'un défaut que les tests n'ont pas vu (un délai réel, un cas de panier rare). L'équipe écrit **avant** ce qu'elle regarde et ce qui arrête : « si les paiements réussis baissent de plus de dix pour cent sur le canari, on revient ». Décider le seuil pendant l'angoisse, c'est le relever jusqu'à ce qu'il ne sonne plus.

Sans deux exemplaires au moins, il n'y a pas de canari. Un seul processus est soit l'ancien, soit le nouveau. On ne simule pas un pourcentage avec l'espoir.

# L'interrupteur sépare déployer et exposer

Un **feature flag** (interrupteur) laisse le code en production sans le montrer aux clients. `1.8.3` contient le second moyen de paiement. L'interrupteur est éteint. Les clients paient comme avant. On l'allume pour les comptes de l'équipe, puis pour une part des clients, puis pour tout le monde. On l'éteint sans redéployer si le prestataire tousse.

```diagram
type: flow
title: "Déployer éteint, exposer ensuite"
steps:
  - title: Déployer 1.8.3
    text: "L'interrupteur est éteint. Le parcours actuel ne change pas."
    tone: blue
  - title: Équipe seulement
    text: "Inès et Marc paient avec le nouveau moyen."
    tone: violet
  - title: Petite part
    text: "On compare les paiements réussis à l'ancien moyen."
    tone: amber
  - title: Tout le monde
    text: "Puis on retire l'interrupteur du code, dans un lot suivant."
    tone: teal
```

Déployer n'est pas exposer. Cette phrase évite les branches de trois semaines : Chloé intègre le code éteint, au lieu de le cacher jusqu'aux soldes. Elle évite aussi de croire que l'interrupteur dispense de tests. Le chemin éteint et le chemin allumé s'exercent. Un interrupteur dont le chemin allumé n'a jamais tourné en recette est une surprise datée.

Les interrupteurs qui restent des années deviennent un second produit, illisible. L'équipe note, dans la demande, quand l'interrupteur sera retiré. Un lot plus tard, une fois le moyen de paiement stable, le code mort part. Sinon Nora ne sait plus lequel des douze interrupteurs protège encore quelque chose.

L'interrupteur n'est pas une autorisation de mettre en production un artefact non identifié. C'est une couche de plus, sur un paquet versionné.

# Revenir en arrière

Le **rollback** remet l'artefact précédent. Pour l'API, c'est déployer `commandes:1.8.2`, encore au registre, par le même job que la mise en avant, avec le SHA ou la version écrite. Pas un dossier « old » sur le serveur. Pas une recompilation de la branche d'hier soir.

On le répète en recette quand la stratégie est nouvelle. Un retour arrière jamais essayé est une hypothèse. Le jour où le paiement chute, l'hypothèse prend dix minutes de trop. Marc sait quel scénario rejouer après le retour : un panier, un paiement, une version sur `/sante` qui affiche `1.8.2`.

Le code peut revenir en arrière et la donnée, non. Si `1.8.3` a supprimé une colonne, `1.8.2` redémarre et ne sait plus lire. Le retour arrière du paquet ne suffit pas. On évite ce piège en deux temps. D'abord une version qui écrit l'ancien **et** le nouveau, sans rien supprimer. Ensuite, quand plus aucun exemplaire ancien ne tourne, une version ultérieure qui retire l'ancien. La suppression n'est pas dans le même lot que le premier déploiement.

On écrit la décision avant de commencer : qui peut lancer le retour, quel signal le déclenche, jusqu'à quelle version on accepte de revenir. Revenir à `1.8.2` le matin où `1.8.0` a un défaut de paiement connu n'est pas un progrès. La version cible est la dernière connue saine, pas « plus ancienne » en général.

> [!IMPORTANT]
> Pendant un roulement, revenir en arrière veut dire remettre `1.8.2` aussi sur les exemplaires déjà passés à `1.8.3`. S'arrêter au milieu laisse deux comportements de frais en même temps, sans l'avoir choisi.

# Quand le big bang est interdit

Le **big bang** remplace tout, d'un coup, sans coexistence et sans petit pourcentage. Tout le trafic bascule, ou rien. Pour l'API commandes, c'est interdit dans les cas suivants.

Le retour arrière n'a pas été nommé, ou la migration empêche de relire les données avec l'ancien paquet.

Plusieurs changements partent ensemble (frais, paiement, e-mail) et une courbe mauvaise ne dira pas lequel retirer.

C'est la veille des soldes, ou le vendredi à 18 h, avec une équipe réduite le lendemain. Le moment agrandit le coût, il ne change pas la physique du déploiement. Il interdit d'en profiter pour une première fois.

Le pipeline n'a jamais déployé cet environnement. La première fois se fait un mardi calme, sur la recette, pas devant les clients.

Personne ne regarde de signal. Basculer sans taux d'erreur ni commandes payées, c'est apprendre la panne par Inès, au téléphone.

La branche a trois semaines et « il faut bien tout livrer ». Ce n'est pas une raison, c'est le symptôme d'un lot trop gros. On découpe, ou l'on reporte. On ne se donne pas du courage avec un big bang.

```diagram
type: decision
title: "Ce changement peut-il partir d'un coup ?"
nodes:
  - question: "L'artefact précédent sait-il encore servir le trafic et lire la base ?"
    yes: "Un retour arrière existe. Question suivante."
    no: "Big bang interdit. On rend les deux versions compatibles d'abord."
  - question: "Le lot est-il seul, hors pic, avec un signal et un essai déjà fait en recette ?"
    yes: "Un roulement ou un canari convient. Le big bang n'est toujours pas le premier choix."
    no: "On découpe, on attend le créneau, ou l'on répète en recette."
```

Reste un cas rare : une bascule que la technique ne sait pas faire coexister (un composant unique, sans répartiteur, que l'on doit couper). Ce n'est pas le cas de l'API derrière quatre exemplaires. Si ce cas arrive un jour, il a une fenêtre annoncée, un retour écrit, un responsable, et il ne transporte pas trois sujets produits. L'interdiction du big bang vise le quotidien de la boutique, où l'on a presque toujours le choix de ne pas tout casser en même temps.

La stratégie par défaut de l'équipe tient en une ligne. Artefact déjà validé, roulement compatible, interrupteur si le comportement est nouveau, canari si le trafic et le répartiteur le permettent, retour à la version nommée si le signal convenu casse. Le big bang n'est pas une stratégie de plus dans cette liste. C'est l'absence de stratégie, un soir de soldes.

# Exercices

## Exercice 1 : Choisir la stratégie

Quatre situations. Proposez roulant, bleu-vert, canari, ou « pas maintenant », avec une raison.

1. Arrondi des frais, quatre exemplaires, les deux versions encaissent un montant.
2. Second moyen de paiement, que l'on veut montrer d'abord à l'équipe.
3. Suppression d'une colonne lue par `1.8.2`, dans le même lot que le nouveau code.
4. Un seul exemplaire, à 2 h, trois commandes par heure, Inès voudrait « un petit pourcentage ».

<details>
<summary>Voir la solution</summary>

1. Roulant. Les versions coexistent, le contrat d'encaissement tient, pas besoin d'un second parc. On surveille le taux d'erreur et l'on peut remettre `1.8.2` sur les exemplaires déjà mis à jour.

2. Déploiement de l'artefact avec l'interrupteur éteint (roulant), puis exposition à l'équipe, puis éventuellement canari. Bleu-vert n'est pas nécessaire si l'ancien chemin reste le défaut. L'interrupteur est le bon outil pour « d'abord l'équipe ».

3. Pas maintenant. On n'envoie pas la suppression avec le premier déploiement. D'abord une version compatible qui n'a plus besoin de la colonne mais ne la supprime pas, roulement terminé, plus aucun `1.8.2`, ensuite seulement la suppression. Sinon le retour arrière ne sait plus lire.

4. Pas un canari. Un seul exemplaire ne partage pas le trafic, et trois commandes ne mesurent rien. On reste sur un roulement impossible aussi : il n'y a qu'une instance. On choisit une fenêtre calme, un bleu-vert seulement si un second exemplaire existe le temps de la bascule, sinon une fenêtre courte avec retour nommé. On ne prétend pas à un pourcentage.

</details>

## Exercice 2 : Le retour qui ne revient pas

`1.8.3` est déployé en roulant sur les quatre exemplaires. Le taux de paiements réussis baisse. Nora lance « revenir à `1.8.2` ». Le job redéploie `1.8.2`, puis les exemplaires quittent immédiatement : la colonne `frais_detail`, créée et rendue obligatoire par `1.8.3`, est absente des lectures de `1.8.2`.

À quel moment l'erreur a-t-elle été commise, et comment livrer `frais_detail` la prochaine fois ?

<details>
<summary>Voir la solution</summary>

L'erreur est antérieure au clic de retour. Le lot `1.8.3` a rendu obligatoire une colonne que l'artefact précédent ne sait pas lire. Le retour arrière du code était donc fictif dès la revue. Le moment pour le voir : la demande de fusion, au critère « l'artefact précédent sait encore servir ».

La prochaine fois : `1.8.3` ajoute `frais_detail` facultatif et écrit les deux formes. `1.8.2` ignore le champ. On roule. Quand tout le parc est en `1.8.3` et que l'on ne reviendra plus à `1.8.2`, un lot ultérieur peut resserrer. On n'efface pas l'ancien champ dans le lot qui l'introduit.

Ce soir, on restaure une base compatible avec `1.8.2` seulement si c'est encore possible et déjà prévu. Sinon les deux versions sont coincées, ce qu'un essai en recette sur la migration aurait montré un mardi.

</details>

## Exercice 3 : La veille des soldes

Jeudi, 18 h, veille de soldes. La branche `soldes` a douze jours : plafond de frais, second paiement, e-mail. Elle n'a jamais été déployée par le pipeline de production. Chloé propose de tout basculer ce soir, « une fois, comme un big bang, puisqu'il faut que ce soit là demain ».

Que lui répondez-vous, et que peut encore partir ce soir ?

<details>
<summary>Voir la solution</summary>

Le big bang est interdit ici pour plusieurs raisons qui se cumulent : trois sujets dans le même lot, première utilisation du pipeline de production, veille de pic, retour arrière non démontré. « Il faut que ce soit là demain » décrit un souhait d'Inès, pas une stratégie. On ne gagne pas le droit de tout casser parce que la date est proche.

Ce soir, au mieux, ne part rien de cette branche. Si un des trois sujets est déjà sur `main`, seul, artefact validé en recette, compatible avec l'existant, il peut partir en roulement **seulement** s'il n'est pas le premier essai du pipeline et si l'équipe sait revenir en arrière avant les soldes. Une première du pipeline se fait en recette, pas jeudi soir.

Le second paiement et l'e-mail attendent un lot après les soldes, ou un interrupteur déjà en production **avant** le pic, éteint, prêt à être allumé si et seulement s'il a été exercé. Les introduire demain matin serait le même big bang, décalé de douze heures. On découpe la branche, on ne la livre pas entière pour justifier ses douze jours.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Stratégies de déploiement"
center: "Même artefact, coexistence possible, retour nommé. Le big bang n'est pas un plan."
points:
  - icon: layers
    title: "Recette puis production"
    text: "Les octets validés par Marc sont ceux des clients. Seule la configuration change."
  - icon: loop
    title: "Rouler si compatible"
    text: "Ancien et nouveau servent ensemble. Un champ obligatoire d'un coup casse la moitié du trafic."
  - icon: scale
    title: "Canari ou interrupteur"
    text: "Petite part de trafic, ou code éteint puis montré à l'équipe. On retire l'interrupteur ensuite."
  - icon: rocket
    title: "Retour essayé"
    text: "Redéployer l'artefact précédent, pas un dossier old. On l'a déjà fait en recette."
  - icon: alert
    title: "Pas la veille des soldes"
    text: "Trois sujets, pipeline inédit, migration irréversible : on découpe. On ne bascule pas d'un coup."
pitfall: "Supprimer la colonne dans le même lot que le code, puis découvrir que 1.8.2 ne sait plus lire."
remember: "Déployer n'est pas exposer. Revenir en arrière se décide avant, sur une version qui sait encore servir."
```
