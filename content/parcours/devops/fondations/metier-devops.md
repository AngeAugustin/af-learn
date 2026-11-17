---
title: Le métier DevOps
description: Comprendre le rôle DevOps, le distinguer du développement, de l'administration, du SRE et de la plateforme, et suivre un changement du commit jusqu'à la production.
duration: 55
objectives:
  - Expliquer ce que le rôle DevOps rend possible dans une équipe produit
  - Distinguer développement, administration système, SRE et équipe plateforme
  - Décrire le trajet d'un commit jusqu'à une production identifiable
  - Reconnaître qu'un outil ou un renommage ne constituent pas une pratique DevOps
---

# À quoi sert ce rôle

Atelier Nord est une boutique en ligne. Six personnes livrent l'API des commandes : Léa, Samir et Chloé au développement, Marc à la qualité, Inès au produit, Nora au DevOps. Le lundi, Inès veut afficher le stock réel avant le paiement. Le code peut être prêt le mardi. Les clients ne le voient que si le changement traverse les tests, un artefact, la recette et la production sans surprise.

Nora ne « fait pas les serveurs à la place des autres ». Elle rend ce trajet **répétable**. Elle s'occupe de la chaîne qui prend un commit et le transforme en version que l'on peut nommer, déployer, observer et annuler. Quand le trajet est clair, Léa livre un correctif sans attendre une fenêtre nocturne. Quand il ne l'est pas, tout passe par Nora, à la main, souvent le vendredi soir. L'équipe a alors un héros, donc un point de panne.

Sur l'API commandes, le rôle devient concret :

- un pipeline qui vérifie, construit et publie ;
- une recette et une production qui reçoivent **le même artefact**, avec une configuration différente ;
- une page de santé qui dit quelle version répond ;
- un retour à la version précédente qui ne dépend pas de la mémoire de quelqu'un.

Le métier se juge à ce flux. Une équipe qui livre un petit changement d'API en une heure, avec un retour arrière prévu, pratique déjà l'essentiel. Une équipe qui a installé un serveur d'intégration et qui livre encore une fois par mois, depuis un portable, a surtout installé un outil.

```video
url: https://www.youtube.com/watch?v=M6F6GWcGxLQ
title: "Le DevOps expliqué en emojis"
channel: "Cookie connecté"
duration: "8:09"
lang: fr
why: "Le DevOps expliqué en français et en emojis par Cookie connecté : la culture, la collaboration et l'automatisation."
```

# Développeur, admin, SRE, plateforme

On confond souvent DevOps avec le développement, l'administration système, le SRE et l'équipe plateforme. Dans une grande organisation, ce sont des métiers voisins. Dans une équipe de six, une même personne en porte plusieurs. Les questions, elles, ne se confondent pas.

```diagram
type: compare
title: "Quatre questions voisines"
columns:
  - title: Développeur
    tone: blue
    items:
      - "Le comportement du produit est-il le bon ?"
      - "Le changement est-il testé et relisible ?"
      - "L'API respecte-t-elle le contrat annoncé ?"
  - title: Admin système
    tone: amber
    items:
      - "La machine est-elle saine ?"
      - "Qui a le droit d'y entrer ?"
      - "Sauvegardes et correctifs sont-ils faits ?"
  - title: SRE
    tone: teal
    items:
      - "Le service tient-il son objectif de fiabilité ?"
      - "Le travail manuel répétitif diminue-t-il ?"
      - "Le budget d'erreur autorise-t-il ce risque ?"
  - title: Plateforme
    tone: violet
    items:
      - "Le chemin balisé existe-t-il pour les équipes ?"
      - "Peut-on livrer sans ticket d'infrastructure ?"
      - "Les garde-fous sont-ils dans le chemin ?"
```

**Léa** change le produit. Elle modifie le calcul du stock, écrit le test, fait relire le changement, et reste responsable de ce que le code fait une fois en ligne. Nora ne lui retire pas cette responsabilité, et ne « finit » pas le calcul à sa place.

L'**administrateur système** garde des machines en état : comptes, disques, mises à jour, sauvegardes. Son geste historique est le ticket et la session. Ce travail reste nécessaire. La pratique DevOps refuse seulement que chaque mise en production soit une session différente de la précédente, impossible à refaire.

Le **SRE** (Site Reliability Engineering) traite la fiabilité comme un objectif chiffré. Il réduit le toil, ce travail manuel répétitif qui ne laisse pas le service meilleur, et s'appuie sur un budget d'erreur : si le service a déjà trop cassé ce mois-ci, on ralentit les changements risqués. Le SRE est une manière d'appliquer la collaboration DevOps avec une obsession de fiabilité. Ce n'est pas un nouveau nom pour l'astreinte.

L'**équipe plateforme** construit le chemin balisé : pipeline modèle, règles déjà en place, environnements que l'on ne réinvente pas à chaque fois. Les équipes produit s'en servent sans ouvrir un ticket pour chaque livraison. Chez Atelier Nord, il n'y a pas d'équipe plateforme séparée. Nora en esquisse une, petite : un pipeline que Léa, Samir et Chloé comprennent, plutôt qu'une console que seule elle sait ouvrir.

> [!NOTE]
> Les étiquettes peuvent se recouvrir dans une petite équipe. La confusion, elle, ne doit pas se recouvrir : « c'est DevOps » ne veut pas dire « ce n'est plus mon problème ».

# Du commit à la production

Suivez un changement réel. Léa corrige un arrondi sur les frais de livraison. Le fichier a changé sur sa machine. Rien n'est en production tant que la chaîne n'a pas fait son travail.

```diagram
type: flow
title: "Le trajet d'un commit"
steps:
  - title: Commit
    text: "Un changement petit, un message lisible, aucun secret."
    tone: blue
  - title: Intégration
    text: "Lint et tests. Le rouge arrête le trajet."
    tone: violet
  - title: Artefact
    text: "Un paquet nommé, lié au commit, que l'on ne modifie plus."
    tone: teal
  - title: Recette
    text: "Le même artefact, la configuration de recette, un scénario joué."
    tone: amber
  - title: Production
    text: "Déploiement progressif, version visible, retour arrière prêt."
    tone: rose
```

1. **Commit.** Le changement est dans Git, relu, limité à l'arrondi. Le diff ne contient pas de mot de passe.
2. **Intégration.** Le pipeline lance les vérifications. Si le test des frais de port échoue, on ne parle pas de déploiement.
3. **Artefact.** Le pipeline publie une version figée, par exemple `commandes-1.8.3`, construite à partir du commit `a1b2c3d`. On ne recompile pas « à peu près la même chose » sur le serveur de production.
4. **Recette.** On déploie cet artefact exact, avec la base de recette et le paiement factice. Inès et Marc passent un panier, des frais, un total.
5. **Production.** On déploie le même artefact, avec la configuration de production. On regarde les erreurs et le taux de commandes. Si l'arrondi casse le paiement, on revient à `commandes-1.8.2`.

Nora conçoit ce trajet pour qu'il devienne ennuyeux, au bon sens du terme. Léa n'a pas besoin d'elle pour cliquer vingt boutons. Elle a besoin que le pipeline fasse toujours la même chose.

La page de santé rend le résultat vérifiable :

```bash
curl -sS https://api.atelier-nord.example/sante
# {"version":"1.8.3","commit":"a1b2c3d","environnement":"production"}
```

Si cette réponse manque, la production est un souvenir. Personne ne peut dire ce qui tourne, donc personne ne peut dire à quoi revenir.

```video
url: https://www.youtube.com/watch?v=0yWAtQ6wYNM
title: "What is DevOps? REALLY understand it | DevOps vs SRE"
channel: "TechWorld with Nana"
duration: "35:33"
lang: en
why: "TechWorld with Nana revient sur ce qu'est vraiment DevOps, et sur la différence avec le SRE."
```

# Ce que DevOps n'est pas

DevOps n'est pas un outil. Installer un serveur d'intégration, un orchestrateur ou un canal d'alertes ne change pas une équipe qui se renvoie encore les incidents. L'outil aide quand le flux et la responsabilité sont déjà décidés. Il décore le mur quand ils ne le sont pas.

Ce n'est pas non plus un renommage. Si les développeurs livrent encore par ticket et disparaissent au moment de la mise en ligne, le badge « DevOps » sur l'ancienne équipe d'exploitation n'a rien changé au trajet.

Ce n'est pas une personne unique qui déploie la nuit. Si seule Nora peut mettre en production, l'équipe s'arrête quand elle est absente, et elle ne peut pas prendre de vacances sans emporter le portable.

Ce n'est pas la disparition de l'exploitation. Il reste des machines, des certificats, des sauvegardes. L'objectif est de les traiter par des procédures partagées et, dès que possible, par du code que l'on relit. On ne fait pas semblant que les serveurs n'existent plus.

Ce n'est pas non plus la vitesse sans filet. Livrer plus souvent n'a de sens que si chaque livraison est petite, testée et annulable. Aller plus vite vers une panne plus grosse n'est pas le métier.

> [!WARNING]
> Méfiez-vous de la phrase « on est DevOps, on a pris l'outil X ». Demandez qui peut livrer, en combien de temps, et comment on revient en arrière.

Le test du mardi matin, chez Atelier Nord : n'importe laquelle des trois personnes au développement peut-elle proposer un correctif, le voir refusé automatiquement s'il casse les tests, et le voir en recette sans ouvrir une session sur le serveur ? Si oui, le rôle est en place. Si non, l'outil n'est pas le sujet de la semaine.

# Une journée dans l'équipe de six

Voici une journée ordinaire, pas un incident majeur. La conduite d'incident viendra plus loin dans le parcours.

Le matin, le pipeline de la branche principale est vert. Nora regarde les échecs de la veille. Un test a échoué deux fois à cause d'un délai trop court, pas à cause d'un bug de frais. Elle le note avec Marc. Un test qui clignote apprend à toute l'équipe à ignorer le rouge. Le réparer fait partie du métier, au même titre qu'un déploiement.

En milieu de journée, Léa ouvre une demande de fusion. Le pipeline commente la demande : tests verts, artefact de recette publié. Nora ne relit pas le calcul des frais à la place de Léa et de Samir. Elle relit ce qui touche l'exploitation : la nouvelle variable d'environnement est documentée, aucune migration irréversible n'est cachée dans le coin, le journal permettra de voir les totaux faux.

L'après-midi, le déploiement part du pipeline, pas d'un portable. La version `1.8.3` apparaît sur `/sante`. Le taux d'erreur ne bouge pas. Inès valide un panier. Personne n'a eu besoin d'un accès administrateur sur le serveur.

Le travail de fond se voit moins : raccourcir le pipeline, retirer une étape manuelle « provisoire », écrire comment créer un environnement sans séance de magie. Ce travail empêche que la journée de demain redevienne héroïque. Une semaine sans déploiement spectaculaire, avec cinq petits changements passés tranquillement, est une bonne semaine.

# Ce que vous devez pouvoir répondre

À la fin de ce parcours, on ne vous demandera pas de réciter un organigramme. On vous demandera de tenir le trajet de l'API commandes, et de répondre sans ouvrir trois conversations :

- quel commit est en production ;
- quel pipeline l'y a mis, et quelle vérification peut bloquer le chemin ;
- en quoi la recette diffère de la production (la configuration, pas une autre compilation) ;
- comment revenir à la version d'avant en quelques minutes ;
- qui est prévenu si le paiement tombe, et quelle information cette personne trouve : version, dernier changement, où lire les erreurs.

Vous tiendrez aussi la frontière du rôle. Vous ne prenez pas le clavier pour terminer le code de Léa. Vous ne refusez pas un changement « parce que l'exploitation n'a pas le temps » sans nommer le risque : lot trop gros, test manquant, retour arrière impossible, mise en ligne le vendredi à 18 h avant les soldes. Le risque nommé se traite. Le refus vague devient une file d'attente.

Dans l'équipe de six, Nora n'est pas le propriétaire de l'API. Elle est la personne qui empêche le trajet de dépendre d'elle. Le jour où Samir déploie un correctif pendant qu'elle est en atelier, sans l'appeler, le rôle est réussi.

# Exercices

## Exercice 1 : L'outil ne suffit pas

Atelier Nord a installé un serveur d'intégration. Le pipeline peut lancer les tests. Pourtant, chaque vendredi, Léa envoie à Nora le message « c'est bon, tu peux livrer ». Nora se connecte au serveur, met à jour un dossier, et redémarre le service. Il n'y a pas de version affichée sur `/sante`.

Qu'est-ce qui manque pour que ce soit une pratique DevOps, malgré l'outil installé ?

<details>
<summary>Voir la solution</summary>

L'outil est là, le trajet ne l'est pas. Il manque quatre choses.

Le déclenchement ne doit plus être un message privé. Une demande de fusion verte, ou un commit sur la branche principale, lance le déploiement de recette sans que Nora soit le goulot.

L'artefact doit être construit par le pipeline et nommé. Mettre à jour un dossier sur le serveur ne dit pas quel commit tourne, et ne permet pas de revenir à un paquet connu.

La production doit exposer la version et le commit. Sans `/sante`, l'équipe ne peut pas vérifier ce qu'elle croit avoir livré.

Le geste de Nora doit devenir un job que Samir ou Chloé peuvent relancer. Tant que la mise en ligne est une session manuelle, l'équipe a renommé une astreinte, elle n'a pas changé le flux.

</details>

## Exercice 2 : Qui porte quelle question

Le stock affiché en production est faux : les clients voient « disponible » puis le paiement échoue. En une heure, vous entendez cinq questions.

1. Le calcul dans l'API est-il faux pour les articles en précommande ?
2. Le disque du serveur de base est-il plein ?
3. Le taux d'erreur de paiement dépasse-t-il l'objectif du mois ?
4. Faut-il un ticket à Nora pour redéployer, ou le pipeline sait-il le faire ?
5. La page `/sante` cite-t-elle bien `1.8.3` ?

Pour chaque question, dites qui est le premier interlocuteur dans l'équipe de six, et pourquoi la question 4 n'a pas la même nature que la question 1.

<details>
<summary>Voir la solution</summary>

1. Léa, Samir ou Chloé : c'est le comportement du produit. Nora peut aider à comparer la version, elle ne réécrit pas la règle de précommande à leur place.
2. Nora, sur le volet administration : un disque plein est la santé de la machine. On le confirme (espace, logs) avant de soupçonner le calcul.
3. Nora, sur le volet fiabilité, avec Inès pour l'impact boutique : l'objectif chiffré dit si l'on ralentit les prochains changements. Ce n'est pas encore la cause du bug.
4. Toute l'équipe, et la réponse attendue est « le pipeline ». Si un ticket est obligatoire, le chemin balisé n'existe pas. Cette question parle du trajet, pas du stock.
5. La personne qui déploie, puis n'importe qui : c'est un fait vérifiable, pas une opinion.

La question 1 demande si le produit est juste. La question 4 demande si le trajet est répétable. Un stock faux peut exiger les deux : le bon calcul **et** la preuve que la version corrigée est bien celle qui répond.

</details>

## Exercice 3 : Reconstituer le trajet

Léa a le commit `a1b2c3d` sur sa branche. Elle propose de compiler sur le serveur de production « pour aller plus vite », parce que la recette est occupée par un autre essai.

Décrivez le trajet que vous exigez à la place, et le risque précis de sa proposition.

<details>
<summary>Voir la solution</summary>

Trajet exigé : fusionner seulement si les tests sont verts, publier un artefact immutable à partir de `a1b2c3d`, le déployer en recette (quitte à attendre l'autre essai, ou à utiliser une seconde recette), jouer le scénario des frais, puis déployer **ce même artefact** en production. `/sante` doit afficher la version et `a1b2c3d`. Le retour à la version précédente est décidé avant de commencer.

Risque de compiler sur le serveur : le binaire produit n'est plus celui qu'un pipeline pourra reconstruire. Il dépend des fichiers présents ce jour-là, peut contenir une modification non commitée, et n'a pas de nom stable. Si le paiement casse, on ne sait pas à quel paquet revenir. Gagner vingt minutes de compilation se paie en heure de doute. La recette occupée retarde un essai, elle ne justifie pas de sauter l'identification de ce qui part en production.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Le métier DevOps"
center: "Rendre le trajet du commit à la production répétable, observable et annulable."
points:
  - icon: users
    title: "Un flux, pas un héros"
    text: "L'équipe de six livre sans session manuelle. Une seule personne qui déploie est un point de panne."
  - icon: compass
    title: "Voisins distincts"
    text: "Développement, admin, SRE et plateforme posent des questions différentes. Les étiquettes peuvent se recouvrir."
  - icon: rocket
    title: "Même artefact"
    text: "Recette et production reçoivent le même paquet. On ne recompile pas sur le serveur."
  - icon: alert
    title: "Pas un outil"
    text: "Un serveur d'intégration ne suffit pas. Le test : qui livre, en combien de temps, comment on revient."
  - icon: eye
    title: "Version nommable"
    text: "La page de santé cite la version et le commit. Sans cela, la production est un souvenir."
pitfall: "Renommer l'exploitation DevOps et continuer à livrer par message, la nuit, depuis un portable."
remember: "Le métier se juge au trajet d'un petit changement, pas au nombre d'outils installés."
```
