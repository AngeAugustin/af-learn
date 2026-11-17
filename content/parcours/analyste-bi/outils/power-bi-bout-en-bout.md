---
title: Power BI de bout en bout
description: "Du modèle en étoile à la publication : rapport, espace de travail, application, actualisation, et l'idée d'une sécurité qui filtre par région."
duration: 55
objectives:
  - Enchaîner modèle en étoile, mesures, page et publication
  - Distinguer espace de travail, application et rapport partagé à la volée
  - Expliquer l'actualisation planifiée et ce qu'elle garantit vraiment
  - Décrire la sécurité au niveau des lignes comme un filtre lié à la personne
---

# De l'étoile jusqu'à la personne qui décide

Power BI couvre tout le trajet : on prépare un modèle, on écrit des mesures, on dessine une page, on publie, on actualise, on restreint qui voit quoi. Le piège est de commencer par la page. Le trajet sain part du **modèle**.

```diagram
type: pipeline
title: "Du modèle publié à la décision"
lanes:
  - title: Modèle
    steps:
      - title: Étoile
        text: Faits, dimensions, relations
        tone: violet
      - title: Mesures
        text: Définitions uniques, testées
        tone: blue
  - title: Restitution
    steps:
      - title: Rapport
        text: Pages, filtres, hiérarchie
        tone: teal
      - title: Contrôle
        text: Totaux, fraîcheur, droits
        tone: amber
  - title: Mise à disposition
    steps:
      - title: Espace
        text: Là où l'on publie
        tone: rose
      - title: Application
        text: Ce que le métier ouvre
        tone: teal
```

Chaque étape a un résultat vérifiable. L'étoile se comprend en une phrase. Les mesures retombent sur un total connu de la finance. La page répond à une décision. L'application s'ouvre avec la bonne région et une heure d'actualisation.

Ce chapitre suit ce trajet sans reprendre le cours de DAX. On suppose des mesures déjà justes. On regarde comment elles arrivent devant le bon lecteur, à l'heure dite.

# L'étoile dans le modèle

Dans le modèle, les **faits** (ventes, stocks) portent les montants. Les **dimensions** (date, magasin, produit) portent les libellés par lesquels on filtre et on regroupe. Les relations vont des faits vers les dimensions, à sens unique, le plus souvent plusieurs-à-un.

Ce dessin sert le rapport : un filtre sur la région du magasin filtre les ventes **parce que la relation existe**, pas parce qu'on a recopié la région dans vingt tables. On masque les clés techniques et les colonnes que le métier ne doit pas glisser sur une page. On laisse visibles les mesures et les attributs nommés comme on parle (« Marge € », « Région »).

Avant d'ouvrir une page, trois contrôles :

- un total de chiffre d'affaires du mois, comparé à une source de référence ;
- le même total filtré sur une région, qui doit diminuer et non se dupliquer ;
- une date qui filtre bien (attention aux relations inactives et aux colonnes de date posées sur le fait « par confort »).

Si ces trois contrôles échouent, on ne dessine pas. On répare le modèle. Une page élégante sur une étoile fausse diffuse l'erreur plus vite.

# Le rapport, puis la publication

Le rapport assemble les pages vues dans les chapitres précédents : une question par page, peu de filtres, la fraîcheur, les mesures du modèle (pas des calculs recopiés dans un visuel). On publie le rapport **et** son modèle vers un **espace de travail**.

L'espace de travail est l'atelier de l'équipe qui produit : auteurs, jeu de données, rapports, planification. Ce n'est pas, en principe, la porte d'entrée de toute l'entreprise. Y inviter cent personnes « pour qu'elles voient » mélange ceux qui modifient et ceux qui consultent.

À la publication, on vérifie :

- le rapport pointe vers le jeu que l'on croit (pas un doublon de test) ;
- les pages par défaut ont les bons filtres (mois en cours, pas « toute l'histoire » laissée par le développeur) ;
- la description du jeu dit le périmètre et le propriétaire.

> [!TIP]
> Publiez d'abord dans un espace de recette, faites lire la page par une personne du métier, puis seulement vers l'espace qui alimente l'application.

# Espaces de travail et applications

L'**application** est la vitrine. Elle reprend, depuis un espace, les rapports que le métier a le droit de consulter, avec une navigation simple. Le lecteur ouvre l'application « Pilotage réseau ». Il ne parcourt pas les brouillons de l'espace.

| Objet | Rôle | Qui y entre |
| --- | --- | --- |
| Espace de travail | Produire, actualiser, régler les droits du jeu | Auteurs et responsables du jeu |
| Jeu de données | Le modèle partagé, les mesures, l'actualisation | Ceux qui construisent dessus |
| Rapport | Les pages | Inclus ou non dans l'application |
| Application | L'entrée du métier | Lecteurs, souvent un grand nombre |

Plusieurs rapports peuvent s'appuyer sur **un** jeu de données publié. C'est le geste qui évite de recopier l'étoile dans chaque fichier. Un nouveau besoin de page se branche sur le jeu certifié. Il n'emporte pas une seconde copie des ventes « pour aller plus vite ».

L'application se met à jour quand on la republie. Tant que ce n'est pas fait, les lecteurs voient l'ancienne navigation, même si l'espace contient déjà le nouveau rapport. Le dire évite la phrase « j'ai publié, personne ne voit rien ».

# L'actualisation

L'**actualisation** recharge l'import selon un horaire. Elle ne rend pas le chiffre « vivant » entre deux passages. Si elle réussit à 6 h 12, la page doit pouvoir le dire. Si elle échoue, le silence est dangereux : on commente hier en croyant commenter ce matin.

Ce que l'on cadre :

- **l'heure**, après la disponibilité des sources (inutile de lancer à 5 h si l'entrepôt finit à 6 h) ;
- **le responsable** prévenu en cas d'échec, avec une action (relancer, prévenir la revue, afficher le bandeau) ;
- **la fenêtre métier** : la revue de 9 h doit savoir si le chargement est passé ;
- **le périmètre** rechargé (tout le modèle, pas une table oubliée).

Une actualisation verte ne prouve pas que le chiffre est le bon. Elle prouve que le chargement s'est terminé. Le contrôle de total (le mois comparé à la finance) reste nécessaire, au moins sur les mesures de la page certifiée. On peut l'automatiser plus tard. On ne le suppose pas.

> [!WARNING]
> En réunion, ouvrez la page et lisez l'heure d'actualisation avant le premier commentaire. Un échec de nuit se traite en une phrase, pas en vingt minutes de débat sur un chiffre périmé.

# La sécurité par région, l'idée

La **sécurité au niveau des lignes** (RLS, row-level security) filtre les lignes selon la personne qui consulte. L'idée, pour un réseau de magasins : un directeur de région ne voit que les magasins de sa région. La page est la même. Le modèle applique un filtre qu'il ne peut pas retirer.

On s'appuie en général sur une table qui relie l'identifiant de connexion à une région (« marie@… » voit l'Ouest, « jean@… » voit l'Est). Le rôle dit : la région du magasin doit être parmi les régions de la personne. Un rôle « direction générale » ne porte pas ce filtre, ou le porte sur toutes les régions.

Ce n'est pas un filtre de page que le lecteur pourrait effacer. C'est une règle du jeu de données, testée **avec l'identité** de la personne, pas seulement avec la vôtre. Les contrôles minimaux :

- Marie voit l'Ouest, et le total de la page correspond à l'Ouest seul ;
- elle ne voit pas l'Est, même en changeant le segment Région ;
- Jean, dans les mêmes pages, voit un autre total ;
- un utilisateur sans ligne dans la table de droits ne voit rien, plutôt que tout.

La RLS ne remplace pas la certification des mesures. Elle évite qu'une bonne mesure, sur une belle page, montre à quelqu'un un périmètre qui n'est pas le sien. Les agrégats « groupe » affichés à côté doivent être voulus : si la page compare la région à la moyenne nationale, cette moyenne est un choix explicite, pas une fuite accidentelle.

# Exercices

## Exercice 1 : L'ordre des travaux

Un commanditaire demande « le visuel pour jeudi » et propose d'importer un fichier à plat, de poser les graphiques, puis « on verra le modèle après ». La finance a déjà un chiffre d'affaires de mars. Que faites-vous dans l'ordre, et que montrez-vous jeudi ?

<details>
<summary>Voir la solution</summary>

L'ordre : étoile (ou le sous-ensemble utile), relations, mesures, contrôle du total de mars contre la finance, puis une page courte, puis publication en recette.

Jeudi, on peut montrer une page unique sur un modèle étroit, pas un fichier à plat promis à la refonte. Le total filtré sur une région est vérifié. Les clés techniques sont masquées.

On refuse de publier dans l'application tant que le total de référence ne tombe pas juste. Un visuel avancé sans ce contrôle accélère la diffusion d'un mauvais chiffre.

</details>

## Exercice 2 : Espace, application, copie

Cent responsables de magasin ont été ajoutés comme membres de l'espace de travail « pour voir le rapport ». Deux analystes y ont aussi publié des brouillons. Un troisième a téléchargé le jeu, l'a modifié, et l'a renvoyé sous un autre nom. Quel dispositif remettez-vous ?

<details>
<summary>Voir la solution</summary>

- Les lecteurs sortent de l'espace. Ils reçoivent l'**application**, qui ne contient que les rapports validés.
- L'espace reste à l'équipe qui produit (auteurs, responsable du jeu).
- On supprime ou on archive le jeu recopié. Les nouveaux rapports se connectent au jeu publié, ils n'en emportent pas une copie.
- On republie l'application et on vérifie qu'un magasin ouvre bien la vitrine, pas l'atelier.

Le brouillon peut rester dans l'espace. Il ne doit pas apparaître dans l'application.

</details>

## Exercice 3 : Actualisation et filtre de région

L'actualisation est planifiée à 5 h. L'entrepôt n'est prêt qu'à 6 h 30. La revue est à 9 h. Par ailleurs, Marie (Ouest) voit les ventes de l'Est en changeant un segment. Que corrigez-vous sur ces deux sujets ?

<details>
<summary>Voir la solution</summary>

**Actualisation.** On la décale après la fin réelle de l'entrepôt (par exemple 7 h), avec une alerte en cas d'échec vers un responsable nommé. À 9 h, la page affiche l'heure du dernier succès. Si le chargement a échoué, on le dit en ouvrant la revue, on ne commente pas le chiffre de la veille comme s'il était frais. Un contrôle de total reste nécessaire en plus du statut vert.

**Droits.** Le segment Région n'est pas une sécurité. On met une règle de sécurité au niveau des lignes : Marie est reliée à l'Ouest, et le modèle filtre les magasins sur cette région. On rejoue le test avec son identité : le segment ne doit pas révéler l'Est. Un utilisateur absent de la table de droits ne voit pas de données. La direction générale, elle, a un rôle sans ce filtre, testé à part.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Power BI de bout en bout
center: "Le modèle d'abord, la page ensuite, l'application pour les lecteurs, l'heure dite en clair."
points:
  - icon: layers
    title: Étoile puis mesures
    text: Relations et totaux de référence avant d'ouvrir le premier visuel.
  - icon: tool
    title: Espace atelier
    text: On y produit et on y actualise. Ce n'est pas la porte de toute l'entreprise.
  - icon: rocket
    title: Application
    text: La vitrine ne montre que les rapports validés, sur le jeu partagé.
  - icon: clock
    title: Actualisation
    text: Planifiée après les sources. Un succès ne prouve pas que le total est juste.
  - icon: lock
    title: Filtre de région
    text: La sécurité des lignes suit la personne. Un segment à l'écran ne suffit pas.
pitfall: Inviter tous les lecteurs dans l'espace mélange brouillons, copies du jeu et rapport officiel.
remember: On teste le droit avec l'identité du lecteur, pas seulement avec la sienne.
```
