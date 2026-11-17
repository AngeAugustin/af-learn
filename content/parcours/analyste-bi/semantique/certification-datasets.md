---
title: Certifier un jeu de données
description: "Le badge certifié a un propriétaire, un périmètre et une date de revue. Voici ce qui le retire, et comment le catalogue le rend trouvable."
duration: 40
objectives:
  - Dire ce qu'un badge certifié garantit, et ce qu'il ne garantit pas
  - Nommer un propriétaire, un périmètre et une date de revue
  - Lister les événements qui retirent la certification
  - Rendre le jeu trouvable dans un catalogue plutôt que par le bouche-à-oreille
---

# Le badge n'est pas un sticker

Un jeu **certifié** est un jeu sur lequel l'organisation accepte que l'on décide. Le badge concentre une promesse : les métriques qu'il porte sont celles du contrat, le périmètre est connu, quelqu'un répond, et une date dit jusqu'à quand cette promesse a été revue.

Sans critère, le badge se colle sur tout ce qui est « fini ». Il ne distingue plus rien. Avec trop de critères flous (« qualité maximale »), plus personne ne certifie, et les classeurs parallèles reviennent. La barre est donc **courte et vérifiable**.

Promesse minimale :

- les métriques de pilotage retombent sur un total de référence ;
- le propriétaire est une personne joignable, pas un service sans nom ;
- le périmètre tient en un paragraphe ;
- la date de prochaine revue est écrite ;
- les droits (qui voit quelle région) ont été testés si le jeu est partagé largement.

Le badge ne promet pas que chaque page branchée dessus est bien dessinée. Une mauvaise hiérarchie visuelle peut s'appuyer sur un bon jeu. On certifie le **jeu** (les définitions, le grain, l'actualisation). On peut, en plus, certifier une **page**. Les deux badges ne se confondent pas.

# Le propriétaire

Le propriétaire **répond** quand le chiffre surprend et **accepte** les changements de contrat. Il n'est pas forcément celui qui écrit la mesure. Souvent, le métier (la finance, le commerce) possède le sens, et l'analyste BI possède la mise en œuvre. Les deux noms peuvent être écrits. Un seul est le point d'entrée.

Ce qu'on attend de lui, concrètement :

- trancher un cas limite (une vente interne, un magasin en travaux) ;
- être prévenu **avant** qu'une définition certifiée change ;
- relire le jeu à la date prévue, ou déléguer explicitement ;
- retirer le badge si la promesse ne tient plus, plutôt que de le laisser par politesse.

Un propriétaire parti sans remplaçant **décertifie**. Un jeu dont personne ne se souvient pourquoi il est officiel est un risque, pas un patrimoine. Le catalogue doit montrer le nom. Si le nom est une liste de diffusion morte, on n'a pas de propriétaire.

> [!WARNING]
> « L'équipe data » n'est pas un propriétaire. Une équipe ne vient pas en comité expliquer un écart de 3 %. Une personne, oui.

# Le périmètre

Le périmètre dit **ce que le jeu couvre** et **ce qu'il laisse dehors**. Il évite qu'on lui fasse dire autre chose.

Exemple tenu : « Magasins intégrés France, hors franchises, ventes HT retours déduits, objectifs de la version votée en début de mois, stocks de la photo de 6 h. Ne couvre pas la comptabilité sociale ni les sociétés étrangères. »

On y trouve en pratique :

- les entités (enseignes, pays, canaux) ;
- le début d'historique disponible ;
- la fraîcheur visée (quotidienne, horaire) et l'heure habituelle ;
- les métriques incluses dans la certification (pas « toutes les mesures du fichier », si des essais s'y trouvent) ;
- les limites assumées.

Un périmètre mou (« toutes les ventes ») n'est pas un périmètre. Il sera contredit à la première question sur les franchises. Mieux vaut une phrase restrictive et vraie qu'une phrase large et fausse.

# La date de revue

La certification **expire dans les têtes** même si l'outil ne retire pas le badge tout seul. La date de revue force un regard : le contrat tient-il encore, l'actualisation échoue-t-elle souvent, le propriétaire est-il toujours là, un nouveau canal a-t-il été oublié.

Une revue courte, trimestrielle pour un jeu de pilotage stable, mensuelle si le périmètre bouge, suffit. Elle produit trois issues possibles : on reconduit, on reconduit avec un correctif daté, ou on retire le badge.

Entre deux revues, un changement de définition **avance** la revue. On ne glisse pas une nouvelle règle dans un jeu certifié en se disant que le trimestre prochain verra bien.

```diagram
type: flow
title: "La vie d'un badge"
steps:
  - title: Candidature
    text: "Contrat, total de référence, propriétaire"
    tone: blue
  - title: Contrôles
    text: "Périmètre, fraîcheur, droits testés"
    tone: teal
  - title: Badge
    text: "Visible dans le catalogue, date de revue"
    tone: violet
  - title: Usage
    text: "Les pages de décision s'y branchent"
    tone: amber
  - title: Revue ou retrait
    text: "Reconduire, corriger, ou décertifier"
    tone: rose
```

La date est visible à côté du badge. « Certifié » sans date veut dire « certifié un jour ». Ce n'est pas assez pour une revue de lundi.

# Ce qui retire le badge

Déclarer ce qui **décertifie** évite la négociation gênée le jour où il faudrait le faire. Le badge saute, au minimum, si :

- le propriétaire n'est plus là et personne n'est nommé ;
- une métrique certifiée change de contrat sans revue ;
- le total de référence ne tombe plus juste, et ce n'est pas expliqué ;
- l'actualisation échoue de façon répétée sans que la page le dise ;
- un contrôle de droits montre qu'une région voit les autres ;
- le périmètre réel a dérivé (les franchises sont entrées « temporairement ») ;
- la date de revue est dépassée d'un délai convenu (par exemple un mois).

Retirer le badge n'efface pas le jeu. Cela l'étiquette comme **non décisionnel** tant qu'il n'est pas réparé. Les pages qui s'en servaient doivent le montrer (un bandeau), pas continuer à porter l'ancien sceau. Recertifier est un geste explicite, avec un nouveau total de contrôle, pas un clic distrait.

> [!IMPORTANT]
> Un badge qu'on n'ose jamais retirer n'informe plus. Le retrait est une réussite du dispositif, pas un échec social.

# Le catalogue

Le **catalogue** est l'endroit où l'on **trouve** le jeu sans écrire à la personne qui l'a construit. Une certification invisible ne guide personne : les nouveaux arrivants recréent un classeur.

Une fiche courte suffit :

- nom du jeu, badge, date de revue, propriétaire ;
- périmètre en un paragraphe ;
- liste des métriques certifiées et lien vers leur contrat ;
- fraîcheur, espace ou application où l'ouvrir ;
- jeux proches **non** certifiés, pour ne pas les prendre par erreur.

On n'y met pas toute la documentation du monde. On y met de quoi choisir le bon jeu en deux minutes. Un catalogue qui liste cent jeux sans badge, sans propriétaire et sans date est un annuaire. Il n'aide pas à décider lequel ouvrir.

Le bouche-à-oreille (« prends le fichier de Léa ») est le catalogue par défaut. Il survit tant que le vrai catalogue est vide ou mensonger. Tenir la fiche à jour fait partie de la revue, pas d'un projet à part que l'on fera « quand on aura le temps ».

# Exercices

## Exercice 1 : Coller ou refuser le badge

Un jeu « Ventes réseau » est très utilisé. Le total de mars est juste. Le propriétaire est « équipe data ». Le périmètre ne dit rien des franchises, alors que la moitié des lecteurs les croit incluses. La dernière relecture date de quatorze mois. Certifiez-vous ?

<details>
<summary>Voir la solution</summary>

Non, pas en l'état. Le total juste ne suffit pas.

- Nommer une personne propriétaire, métier plus mise en œuvre.
- Écrire le périmètre, en particulier **avec ou sans franchises**, et le faire reconnaître par les lecteurs.
- Poser une date de revue proche, puisque quatorze mois dépassent un rythme sain.
- Tant que ce n'est pas fait, le jeu peut rester publié avec un statut **non certifié**, et un bandeau qui le dit. Coller le badge maintenant figerait l'ambiguïté des franchises.

</details>

## Exercice 2 : Un changement en douceur

En avril, un analyste retire les cartes cadeau de la mesure certifiée `ca_ht`, sans prévenir la finance, parce que « c'était plus logique ». Le badge est toujours affiché. La revue de mai s'étonne d'un écart. Que s'est-il passé au regard de la certification, et que faites-vous ?

<details>
<summary>Voir la solution</summary>

Le contrat a changé **sans revue**. Le badge n'aurait pas dû rester. On le retire (ou on le suspend) le temps de trancher : la finance confirme ou refuse le nouveau périmètre.

Si elle confirme, on met à jour la description, le message de changement, la date, et on **recertifie** explicitement. Si elle refuse, on revient à l'ancienne définition. Dans les deux cas, la revue de mai est prévenue que la série n'est plus comparable sans note.

On ne « laisse le badge puisqu'on a corrigé depuis ». Le geste de recertification est visible.

</details>

## Exercice 3 : Une fiche de catalogue

Rédigez la fiche, en quelques lignes, d'un jeu que vous accepteriez d'ouvrir le lundi matin sans demander à son auteur.

<details>
<summary>Voir la solution</summary>

**Pilotage magasins intégrés.** Certifié. Propriétaire : Camille N. (finance commerciale), mise en œuvre : Alexis R. Prochaine revue : 15 juin. Périmètre : magasins intégrés France, hors franchises, HT retours déduits, date de ticket, fuseau Paris, historique depuis janvier N-2, actualisation visée à 7 h. Métriques : CA HT, marge commerciale, panier moyen, taux de rupture. N'est pas la comptabilité sociale. Ouvrir via l'application « Pilotage réseau ». Ne pas utiliser le jeu « Ventes brouillon promo », non certifié.

Une fiche de ce genre se lit en moins d'une minute et empêche le mauvais fichier.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Certifier un jeu
center: "Badge, personne nommée, périmètre écrit, date de revue. Sinon ce n'est qu'un sticker."
points:
  - icon: check
    title: La promesse
    text: Totaux de référence, droits testés, métriques listées. Pas la beauté de la page.
  - icon: users
    title: Propriétaire
    text: Une personne qui tranche et que l'on peut appeler. Pas une équipe anonyme.
  - icon: file
    title: Périmètre
    text: Ce qui est dedans, ce qui est dehors, la fraîcheur, l'historique disponible.
  - icon: clock
    title: Date de revue
    text: Reconduire, corriger ou retirer. Un changement de contrat avance la date.
  - icon: book
    title: Catalogue
    text: La fiche se trouve sans écrire à l'auteur. Le bouche-à-oreille n'est pas un catalogue.
  - icon: alert
    title: Retrait
    text: Chiffre faux, droits troués, revue caduque. Retirer le badge informe.
pitfall: Laisser le badge après un changement de formule silencieux. Le comité compare alors deux contrats.
remember: Recertifier est un geste daté. On ne recolle pas le sceau en passant.
```
