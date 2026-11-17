---
title: Sources et préparation légère
description: "Fichiers, bases et API SaaS vus par l'analyste BI : grain, clés, Power Query ou SQL côté consommateur, et rechargement d'une fenêtre sans orchestrateur."
duration: 60
objectives:
  - Choisir un mode d'accès adapté aux fichiers, aux bases et aux API SaaS
  - Placer la transformation dans Power Query ou dans un SQL partagé
  - Définir le grain et les clés avant d'agréger un chiffre de pilotage
  - Recharger une fenêtre de dates sans dupliquer ni oublier les mises à jour
---

# D'où vient le chiffre

Avant d'écrire une mesure, vous devez savoir **d'où vient la ligne**, à quel grain elle est née, et qui a le droit de la corriger. Chez Halte Marché, le CA HT du lundi n'a pas une seule source. Les tickets de caisse, les commandes du site, le budget du contrôle de gestion et le référentiel magasin n'arrivent ni au même rythme, ni sous la même forme.

Votre rôle n'est pas de construire la collecte de l'enseigne. Il est de ne pas mélanger ces origines dans un total que la finance ne pourra pas refaire. Chaque source a un contrat minimal, que vous écrivez même quand vous n'êtes pas celui qui la charge :

- le grain (ligne de ticket, commande, magasin-mois) ;
- la clé qui identifie une ligne ;
- la fraîcheur promise ;
- le propriétaire métier qui tranche en cas d'écart.

Si l'un de ces quatre points est inconnu, le chiffre peut quand même s'afficher. Il ne peut pas être certifié.

# Fichiers, bases et API

Trois familles couvrent l'essentiel du pilotage. Vous les traitez différemment, parce que leurs pannes ne se ressemblent pas.

```diagram
type: pipeline
title: Trois origines, une préparation légère
lanes:
  - title: Fichier budget
    steps:
      - title: Lire
        text: Classeur du contrôle de gestion, mois en colonnes
        tone: amber
      - title: Mettre en lignes
        text: Une ligne par magasin et par mois
        tone: amber
  - title: Base des ventes
    steps:
      - title: Filtrer
        text: Période ouverte, lecture seule
        tone: blue
      - title: Agréger
        text: Mesures additives au grain du rapport
        tone: teal
  - title: API e-commerce
    steps:
      - title: Cadrer
        text: Commandes livrées, pas les paniers abandonnés
        tone: violet
      - title: Aligner
        text: Même CA HT que le magasin, mêmes avoirs
        tone: rose
```

**Les fichiers** (CSV de caisse déposé le matin, classeur de budget, export ponctuel) sont la source la plus courante, et la plus fragile. Un en-tête renommé, un montant avec espace et virgule, une feuille « V2 finale vraiment » : le total bouge sans que le métier ait vendu différemment. Vous figez le nom du fichier attendu, la feuille, la ligne d'en-tête, et vous refusez de certifier un total collé depuis un classeur personnel.

**Les bases** (caisse, ERP, ou table déjà dans l'entrepôt) se lisent. Vous n'y corrigez pas une ligne pour une revue. Quand c'est possible, vous lisez une table ou une vue préparée pour l'analyse, pas la base qui encaisse les clients en heure de pointe. Vous notez le fuseau et le moment de la journée : un ticket de 23 h 50 doit tomber dans le bon jour de caisse, pas dans le jour du serveur.

**Les API des outils SaaS** (site e-commerce, outil marketing, planning) parlent un langage d'écran, pas un langage de comptabilité. Une « vente » peut être un panier, une commande payée, ou une commande livrée. Vous écrivez laquelle entre dans le CA HT, en accord avec la finance, avant de ramener le flux dans le rapport. Les volumes sont souvent paginés, les champs changent sans prévenir, et un extract du matin peut être incomplet. Si une équipe dépose déjà ces commandes dans l'entrepôt, vous consommez cette table. Vous ne maintenez pas un second branchement dans un coin du rapport.

| Origine | Force pour le pilotage | Risque à écrire noir sur blanc |
|---|---|---|
| Fichier | Disponible tout de suite, y compris le budget | Schéma instable, versions multiples |
| Base | Historique, clés, volumes | Mauvaise journée de caisse, lecture trop proche de la production |
| API SaaS | Ce que l'écran métier appelle une commande | Définition différente du CA magasin, extract partiel |

# Power Query ou modèle SQL côté consommateur

Deux endroits peuvent porter la préparation. Le bon choix dépend du nombre de rapports qui doivent partager la règle, pas de votre préférence d'outil.

**Power Query** (dans Power BI, ou l'équivalent dans Excel) transforme un fichier ou une table **dans le rapport**. C'est le bon outil pour dépivoter le budget local, typer des colonnes capricieuses, et fusionner un petit référentiel qui n'existe nulle part ailleurs. La limite est nette : la règle vit dans ce fichier. Copiée dans six rapports, elle diverge.

**Le SQL côté consommateur** est une vue, ou un modèle versionné type dbt, qui lit des tables **déjà** dans l'entrepôt. Vous n'écrivez pas le chargement de la caisse. Vous écrivez, par exemple, `vente_magasin_jour` : une ligne par magasin et par jour, CA HT et marge sommable. Un test d'unicité sur cette clé échoue si le grain casse. Tous les rapports branchés sur cette vue héritent de la correction le jour où la règle des avoirs change.

| Situation | Où placer la logique |
|---|---|
| Classeur local, mois en colonnes, un seul rapport | Power Query, peu d'étapes, noms explicites |
| Règle de CA partagée par plusieurs rapports | Vue SQL ou modèle consommateur |
| Référentiel magasin déjà en base | Jointure SQL, pas une copie Excel |

dbt, ici, n'est pas une plateforme. C'est une façon de ranger ce SQL, avec le grain écrit à côté et un test sur la clé. Si votre entreprise n'a pas dbt, une vue SQL nommée et relue par un pair rend le même service. L'inverse n'est pas vrai : un modèle dbt que personne ne branche sur les rapports ne certifie rien.

> [!TIP]
> Quand vous hésitez, posez une question : « Si la finance change la règle demain, combien de fichiers dois-je ouvrir ? » Au-delà d'un, la règle ne doit plus vivre dans Power Query.

# Grain et clés

Le **grain** est ce que représente une ligne. « Les ventes » n'est pas un grain. « Une ligne de ticket », « un ticket », « un magasin et un jour » en sont.

Halte Marché encaisse ainsi :

- une **ligne de ticket** : un produit, une quantité, un montant HT, un coût de revient ;
- un **ticket** : plusieurs lignes, un magasin, un instant ;
- un **magasin-jour** : la somme des tickets de la journée de caisse.

Le CA HT s'additionne d'un grain à l'autre, parce que c'est une mesure **additive**. Le taux de marge, non. Si vous le calculez sur chaque ligne puis que vous en faites la moyenne, vous n'obtenez pas le taux du magasin. Vous calculez le taux au grain du rapport : marge divisée par CA, après la somme.

La **clé** est ce qui rend une ligne unique au grain annoncé. Pour la ligne de ticket : `ticket_id` + `ligne`. Pour le magasin-jour : `date_vente` + `magasin_id`. Si la clé se répète, le CA est compté deux fois, souvent parce qu'un fichier a été ajouté sans retirer le précédent.

Deux clés ne se mélangent pas. La clé technique de la caisse (un numéro interne) et la clé métier (le code magasin connu du contrôle de gestion) doivent être rapprochées dans le référentiel. Un code « 0142 » en texte et `142` en nombre sont la même boutique pour le directeur, et deux boutiques pour la jointure. Vous typerez et vous alignerez avant de certifier.

Le grain se choisit **avant** le visuel. Un rapport qui mélange, sur la même somme, des lignes de ticket et des lignes déjà agrégées au jour, double ou perd du CA selon les filtres. Écrivez le grain dans le nom de la requête ou de la vue (`lignes_ticket`, `vente_magasin_jour`), pas dans un commentaire que personne ne rouvre.

# Recharger une fenêtre, sans orchestrateur

Les ventes d'hier ne suffisent pas. Un avoir saisi lundi peut corriger un ticket de vendredi. Un fichier redéposé peut contenir toute la semaine. Si vous **ajoutez** aveuglément « les nouvelles lignes », vous dupliquez. Si vous ne rechargez que la date d'hier, vous ratez la correction.

Vous n'avez pas besoin d'un ordonnanceur pour appliquer une règle saine. Le déclencheur, chez vous, est le rafraîchissement du modèle (planifié dans l'outil) ou le remplacement du fichier du mois ouvert. La règle, elle, tient en quatre gestes.

```diagram
type: flow
title: Recharger la période encore ouverte
steps:
  - title: Clé stable
    text: Ticket et ligne, ou magasin et jour
    tone: blue
  - title: Repère
    text: Dernière journée déjà publiée
    tone: teal
  - title: Fenêtre
    text: Reprendre plusieurs jours en arrière
    tone: amber
  - title: Remplacer
    text: Cette fenêtre seulement, pas un ajout
    tone: rose
```

Exemple. Le modèle contient les ventes jusqu'au dimanche. Le mardi matin, vous rechargez du jeudi au lundi inclus : le repère moins trois jours. Vous **remplacez** ces dates dans le modèle. Vous n'ajoutez pas le fichier par-dessus. Les avoirs saisis lundi sur un ticket de vendredi entrent. Un ticket annulé dans la fenêtre disparaît. Les mois déjà clos, rapprochés avec la finance, ne bougent plus.

La fenêtre se négocie. Trois jours suffisent souvent pour les avoirs de caisse. Ils ne suffisent pas si un magasin peut corriger un ticket à J+15. Dans ce cas, rechargez tout le mois comptable ouvert, une fois par nuit, et gelez le mois seulement après le rapprochement. C'est plus simple qu'une fenêtre trop courte, et le volume d'une enseigne de 80 magasins le permet en général.

Ce que cette règle ne règle pas toute seule :

- une clé instable (le même ticket change d'identifiant d'un extract à l'autre) ;
- un fichier qui n'est pas exhaustif sur la fenêtre (extract « seulement les lignes modifiées » sans mode d'emploi) ;
- une suppression plus vieille que la fenêtre, si vous ne rechargez jamais le mois entier.

Dans ces trois cas, vous ne bricolez pas un filtre pour « faire passer » le total. Vous revenez au propriétaire de la source, et vous baissez le badge certifié tant que le mois ouvert peut encore bouger sans laisser de trace.

# Choisir le bon point d'entrée

Avant d'ouvrir l'outil, répondez à cinq questions. Elles tiennent sur une demi-page, et elles évitent la plupart des doubles comptes.

1. **Quelle décision** ce chiffre éclaire-t-il, et à quel rythme ?
2. **Quelle source** fait foi pour la finance (caisse, site, les deux) ?
3. **Quel grain** doit avoir la table que le rapport interroge ?
4. **Quelle clé** garantit qu'une recharge ne duplique pas ?
5. **Qui d'autre** utilisera la même règle dans les trois mois ?

Le point d'entrée découle des réponses. Source déjà en entrepôt, règle partagée : vue SQL. Fichier seul, règle locale : Power Query court. API dont le mot « vente » ne veut pas dire CA : vous n'affichez rien tant que le périmètre n'est pas écrit avec le contrôle de gestion.

Vous pouvez préparer un chiffre exploratoire plus tôt, daté, non certifié. Vous ne le faites pas passer pour le CA du lundi.

# Exercices

## Exercice 1 : Choisir l'origine et l'outil

Pour chaque besoin, indiquez la famille de source (fichier, base, API) et l'endroit de la transformation (Power Query local, ou SQL partagé).

1. Budget magasin reçu chaque mois dans un classeur, mois en colonnes, utilisé par le seul rapport du régional.
2. Tickets déjà déposés chaque nuit dans l'entrepôt, CA HT consommé par six rapports.
3. Commandes du site, disponibles via l'API de la plateforme e-commerce, à rapprocher du CA magasin. Une table « commandes livrées » existe déjà dans l'entrepôt, alimentée par l'équipe qui tient la source.

Solution :
<details>
<summary>Voir la solution</summary>

1. **Fichier**, transformation **Power Query** locale, tant qu'un seul rapport s'en sert. Documentez la feuille et l'en-tête. Si un second rapport apparaît, faites déposer le budget et passez en SQL partagé.
2. **Base** (table d'entrepôt), transformation en **SQL partagé** (`vente_magasin_jour` ou équivalent). Power Query ne doit pas recalculer le CA dans chacun des six fichiers.
3. Vous ne rebranchez pas l'API dans le rapport. Vous consommez la **table déjà déposée**, en SQL, après avoir écrit avec la finance que « livrée » entre dans le CA. L'API reste l'origine réelle, mais votre point d'entrée est la table.

</details>

## Exercice 2 : Dire le grain et la clé

On vous propose une table `ventes` avec les colonnes `date_vente`, `magasin_id`, `ticket_id`, `ligne`, `montant_ht`, `taux_marge`. Le régional veut le CA HT et le taux de marge par région et par semaine.

1. Quel est le grain de cette table, et quelle est sa clé probable ?
2. Pourquoi ne peut-on pas faire la moyenne de `taux_marge` pour obtenir le taux de la région ?

Solution :
<details>
<summary>Voir la solution</summary>

1. Le grain est la **ligne de ticket** (présence de `ticket_id` et `ligne`). La clé probable est `ticket_id` + `ligne`. Elle doit être unique. `date_vente` + `magasin_id` ne l'est pas à ce grain : un magasin a beaucoup de lignes par jour.
2. `taux_marge` n'est pas additif. La moyenne des taux de ligne ne pondère pas par le CA. Le taux région-semaine se calcule **après** agrégation : somme des marges divisée par somme des CA HT. S'il vous manque la marge en euros, vous ne pouvez pas reconstruire le taux à partir du seul taux de ligne.

</details>

## Exercice 3 : Recharger sans dupliquer

Le fichier de caisse redéposé le mardi contient du jeudi au lundi. Un avoir de lundi corrige un ticket de vendredi. Un stagiaire propose d'ajouter le fichier aux lignes déjà chargées, « pour aller plus vite ». Décrivez la bonne opération, et le bug que l'ajout produirait sur le CA de vendredi.

Solution :
<details>
<summary>Voir la solution</summary>

Vous **remplacez** la fenêtre du jeudi au lundi inclus, à clé de ticket stable. Vous ne l'ajoutez pas. L'avoir de lundi entre ainsi dans le ticket de vendredi, et les lignes déjà présentes de ces cinq jours ne restent pas en double.

L'ajout compterait deux fois les tickets de jeudi à dimanche déjà chargés, et le CA de vendredi exploserait sans vente supplémentaire. La revue du lundi suivant commenterait un faux décrochage, ou une fausse hausse, selon le jour où l'on s'en aperçoit.

Les mois clos, déjà rapprochés, restent hors de la fenêtre.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Sources et préparation légère
center: "Choisissez le grain, la clé et l'endroit de la règle avant d'afficher un total."
points:
  - icon: file
    title: Trois origines
    text: "Fichier fragile, base historisée, API dont le mot vente n'est pas encore un CA."
  - icon: tool
    title: Un seul endroit
    text: "Power Query si la règle est locale. SQL partagé dès qu'un second rapport s'en sert."
  - icon: key
    title: Grain et clé
    text: "Une ligne de ticket n'est pas un magasin-jour. La clé empêche le double comptage."
  - icon: loop
    title: Fenêtre remplacée
    text: "Rechargez les jours encore ouverts en remplaçant, pour prendre les avoirs sans dupliquer."
  - icon: shield
    title: Contrat de source
    text: "Grain, clé, fraîcheur, propriétaire. Sans les quatre, le total n'est pas certifiable."
pitfall: "Ajouter chaque matin le fichier complet de la semaine, puis chercher pourquoi le CA a doublé."
remember: "La préparation légère protège la définition. Elle ne remplace pas la source, et elle ne se copie pas."
```
