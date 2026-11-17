---
title: Le métier de Data Analyst
description: "Ce que fait un Data Analyst au quotidien, comment il se distingue des métiers data voisins, et comment une question devient une décision appuyée sur un chiffre défini."
duration: 55
objectives:
  - Situer le Data Analyst face au Data Engineer, au Data Scientist, à l'Analytics Engineer et à l'analyste BI
  - Décrire le cycle question, données, analyse, décision
  - Reconnaître les compétences et les livrables attendus d'un analyste
---

# Un métier tourné vers la décision

Le Data Analyst transforme une question métier en un chiffre fiable, puis en une recommandation que quelqu'un peut suivre. Le graphique n'est pas le but. La décision l'est : lancer une promotion, couper un canal, revoir un prix, ou ne rien changer parce que la baisse observée tient dans le bruit.

Votre journée mêle quatre gestes. Vous cadrez la demande avec la personne qui décide. Vous allez chercher les données (tableur, SQL, parfois un extrait déjà préparé). Vous contrôlez le résultat avant de le montrer. Vous le restituez dans une forme que le lecteur peut utiliser : une note, un tableau de bord, une définition de métrique. La requête n'est pas le livrable. Le livrable est une décision mieux éclairée, avec ses limites écrites.

Prenons Fil & Cie, une mercerie en ligne. La directrice dit : « les ventes baissent ». Vous ne produisez pas tout de suite une courbe. Vous précisez le périmètre (le site, hors marketplaces), la période (huit semaines complètes, comparées aux mêmes semaines de l'année précédente) et la métrique (chiffre d'affaires hors taxes des commandes payées, retours déduits). Sans ces trois choix, deux analystes rendront deux chiffres justes et contradictoires.

> [!NOTE]
> Un bon analyste sait dire « je ne peux pas répondre encore ». Un chiffre rapide, calculé sur une définition floue, coûte plus cher qu'une journée de cadrage.

```video
url: https://www.youtube.com/watch?v=T7iWG2qqw4E
title: "Qu'est-ce qu’un Data Analyst ?"
channel: "Liora"
duration: "3:49"
lang: fr
why: "Une présentation courte, en français, du métier de data analyst et de ses missions au quotidien."
```

# Cinq rôles pour cinq questions

Les intitulés de poste se recouvrent. La question principale, elle, ne se recouvre pas. Vous travaillez souvent à côté de ces quatre métiers. Savoir qui fait quoi évite d'attendre d'un pipeline ce qu'une requête suffit à trancher, ou d'attendre d'un modèle ce qu'un taux bien défini montre déjà.

| Métier | Question principale | Livrable typique |
| --- | --- | --- |
| Data Analyst | Que s'est-il passé, pour qui, et que décide-t-on ? | Note, métrique, analyse ad hoc |
| Data Engineer | Les données arrivent-elles fiables, fraîches, accessibles ? | Pipeline, table, contrat de données |
| Data Scientist | Peut-on prédire, classer ou optimiser au-delà du descriptif ? | Modèle, expérience, score |
| Analytics Engineer | Le modèle analytique est-il testé, documenté, réutilisable ? | Modèles dbt, tests, documentation |
| Analyste BI | Comment industrialiser un suivi que beaucoup de gens ouvrent ? | Tableau de bord, couche sémantique |

```diagram
type: layers
title: Cinq questions, cinq métiers
layers:
  - title: Data Analyst
    text: Répond à une question métier avec les données déjà disponibles.
  - title: Data Engineer
    text: Construit l'acheminement, la fraîcheur et l'accès aux tables.
  - title: Data Scientist
    text: Modélise quand la description ne suffit plus à décider.
  - title: Analytics Engineer
    text: Transforme le brut en modèles testés et documentés.
  - title: Analyste BI
    text: Industrialise le suivi récurrent pour toute l'entreprise.
```

La frontière est poreuse, et c'est sain. Vous écrirez parfois une transformation que l'Analytics Engineer reprendra. L'analyste BI reprendra une métrique que vous avez stabilisée. Le critère reste la question du moment. « Pourquoi le renouvellement baisse-t-il sur le plan annuel ? » est une question d'analyste. « Peut-on scorer le risque de résiliation à J+30 ? » devient une question de Data Scientist, une fois la définition de résiliation posée. « Cette table est-elle recalculée chaque nuit sans doublon ? » est une question d'ingénierie.

# Le cycle question, données, analyse, décision

Le travail suit un cycle. Le sauter est la cause la plus fréquente d'une analyse inutilisable : beaucoup de colonnes, aucune décision.

```diagram
type: flow
title: Le cycle de l'analyste
loop: Après l'action, mesurer l'effet et reposer la question
steps:
  - title: Question
    text: Décision, métrique, périmètre
    tone: amber
  - title: Données
    text: Source, grain, fraîcheur
    tone: blue
  - title: Analyse
    text: Calcul, contrôle, limites
    tone: teal
  - title: Décision
    text: Action, responsable, délai
    tone: violet
```

La question nomme la décision. Si le chiffre monte, que fait-on ? Si personne ne peut répondre, la question n'est pas mûre. Les données viennent ensuite : quelle table, quelle ligne (une commande, une ligne de commande, un client), à quelle date d'extraction. L'analyse calcule, compare, découpe, et cherche ce qui contredirait le résultat. La décision désigne une action, une personne et un délai. Puis vous mesurez l'effet. Une promotion qui « a bien marché » sans métrique d'avant et d'après n'est qu'une impression.

Chez Nota, un SaaS de prise de notes, le produit affirme que « l'activation est en baisse ». Le cycle impose de définir l'activation (un compte qui crée une note dans les sept jours), de fixer la cohorte (inscriptions des quatre dernières semaines complètes), de vérifier que l'événement « note créée » n'a pas changé de nom dans le suivi, puis seulement de conclure. Si le suivi est cassé, la décision n'est pas « relancer les utilisateurs ». La décision est « réparer la mesure ».

> [!TIP]
> Avant d'ouvrir l'outil, écrivez une phrase : « Si ce chiffre est en baisse franche, X fera Y avant vendredi. » Si la phrase reste vide, vous n'avez pas encore de question.

# Les compétences qui font la différence

Les outils changent. Le réflexe reste. Vous avez besoin de cadrer une demande floue, de manipuler un tableur sans le casser, d'écrire du SQL analytique, de lire une distribution (moyenne, médiane, dispersion) et de choisir un graphique qui ne ment pas. Vous avez aussi besoin du métier : une mercerie ne se lit pas comme un abonnement.

La compétence la plus rare n'est pas une fonction. C'est le scepticisme utile. Un chiffre surprenant est d'abord un candidat au bug : filtre oublié, doublon de jointure, semaine en cours comparée à une semaine complète, commande de test comptée comme une vente. Vous annoncez un résultat quand vous pouvez expliquer ce qui le ferait changer.

La communication fait partie du métier, pas d'un supplément. Une analyse juste que le comité ne peut pas lire n'a pas été livrée. Vous écrivez la définition, la période, la comparaison, le résultat, la limite, puis la recommandation. Cinq à dix lignes suffisent souvent. Le détail technique (requête, grain, contrôles) se range en annexe pour celui qui voudra refaire le calcul.

Le domaine s'apprend sur le terrain. Chez Fil & Cie, « vente » peut vouloir dire commande passée, commande payée, commande expédiée ou chiffre d'affaires après retours. Chez Nota, « utilisateur actif » peut vouloir dire connexion, note créée ou note partagée. Vous n'inventez pas la définition dans votre coin. Vous la faites valider, puis vous la réutilisez.

# Les livrables que l'on attend de vous

On ne vous demande pas « des données ». On vous demande un objet que quelqu'un d'autre peut relire dans deux mois.

Une **note de décision** tient sur une page : question, chiffre, comparaison, limite, action proposée. Un **tableau de bord** sert un suivi récurrent, avec peu d'indicateurs et une définition visible. Une **définition de métrique** fige le nom, la formule, le grain, les filtres et ce que le chiffre ne mesure pas. Une **requête commentée** ou une vue permet à un collègue de refaire le calcul. Un **classeur** reste acceptable pour un extrait court, à condition qu'une feuille « Lisez-moi » indique la date d'extraction, la source et les filtres.

Le mauvais livrable a une forme reconnaissable : quarante onglets, des couleurs sans légende, aucun horodatage, et trois formules différentes pour le même « panier moyen ». Personne ne peut le défendre en réunion. Le bon livrable est plus court et plus ennuyeux à regarder. Il se laisse vérifier.

| Livrable | Quand le choisir | Ce qu'il doit contenir |
| --- | --- | --- |
| Note d'une page | Décision ponctuelle | Question, chiffre, limite, action |
| Définition de métrique | Le chiffre sera réutilisé | Formule, grain, filtres, exclusions |
| Tableau de bord | Suivi hebdomadaire stable | Peu d'indicateurs, période, fraîcheur |
| Requête ou vue | Le calcul doit être refait | Commentaire métier, pas seulement le SQL |
| Classeur | Extrait court, usage local | Date d'extraction, source, mode d'emploi |

> [!WARNING]
> Un classeur envoyé par mail devient la source de vérité dès le lendemain, même s'il est faux. Si le chiffre doit vivre, il ne vit pas seulement dans votre fichier personnel.

# Travailler avec les métiers voisins

Vous ne reconstruisez pas un pipeline dans un tableur « en attendant ». Si la table des commandes payées n'existe pas, ou si elle arrive avec deux jours de retard sans que ce soit dit, vous le signalez au Data Engineer avec un exemple : période, nombre de lignes attendu, nombre de lignes reçu. Vous décrivez le symptôme, pas une solution d'infrastructure improvisée.

Vous n'ouvrez pas un projet de modèle parce qu'une question descriptive fait peur. Si Nota veut savoir quelle part des inscrits de mars a créé une note sous sept jours, un taux par semaine suffit. Le scoring viendra si le produit veut prioriser des relances individuelles et que le taux, lui, est déjà stable. Inversement, vous ne camouflez pas une prédiction dans une moyenne : « les clients qui ressemblent aux résiliés » sans méthode n'est pas une analyse, c'est une intuition.

Quand un indicateur devient récurrent, vous le transmettez. L'analyste BI (ou vous, si ce rôle vous revient) l'industrialise. Le passage de relais comprend la définition validée, les cas exclus (commandes de test, comptes internes, remboursements) et un chiffre de contrôle sur une période connue. Deux tableaux de bord qui disent « chiffre d'affaires » avec deux formules sont un incident, pas une différence de style.

Le réflexe de collaboration tient en une question : « qui est responsable de ce chiffre dans trois mois ? » Si la réponse est « la pièce jointe de mon mail », le livrable n'est pas fini.

# Exercices

## Exercice 1 : À qui s'adresse la demande ?

Fil & Cie vous transmet cinq demandes. Pour chacune, indiquez le métier le plus concerné au premier chef (Data Analyst, Data Engineer, Data Scientist, Analytics Engineer, analyste BI) et la raison, en une phrase.

1. « La table des commandes de lundi matin contient deux fois les mêmes numéros. »
2. « Le comité veut chaque lundi le même tableau : CA, panier, taux de retour, par catégorie. »
3. « Peut-on estimer, à la première commande, la probabilité qu'un client revienne sous 90 jours ? »
4. « Les modèles de l'entrepôt n'ont pas de test : le CA hors retours change de formule selon les branches. »
5. « La laine a-t-elle baissé en mars, ou est-ce le mélange des catégories qui a changé ? »

<details>
<summary>Voir la solution</summary>

1. Data Engineer. Le symptôme est un doublon dans une table servie le matin : fraîcheur, ingestion ou clé de déduplication. L'analyste peut le signaler avec un exemple de clés en double, il ne répare pas le pipeline dans son coin.
2. Analyste BI. Le besoin est un suivi récurrent, identique chaque lundi, pour un public large. L'analyste peut en poser la définition, le tableau de bord l'industrialise.
3. Data Scientist. On demande une probabilité individuelle, donc un modèle, une fois la définition de « revenir » posée. L'analyste peut d'abord publier le taux observé de retour à 90 jours, qui sert de référence au modèle.
4. Analytics Engineer. Le problème est l'absence de modèle versionné, testé et documenté. Deux formules de CA selon les branches sont un défaut de transformation analytique.
5. Data Analyst. C'est une question descriptive de décomposition : effet volume, effet mix, effet prix ou catégorie. Aucun modèle ni nouveau pipeline n'est requis pour y répondre.

Le même sujet (les ventes) circule donc entre les cinq rôles. Ce qui change, c'est la question.

</details>

## Exercice 2 : Remettre une demande dans le cycle

La responsable produit de Nota écrit : « L'activation s'écroule, il faut une analyse complète pour le comité de jeudi. » Le comité doit décider s'il décale la refonte de l'écran d'accueil.

Rédigez le cycle en quatre lignes (question, données, analyse, décision), avec une définition provisoire de l'activation. Signalez un cas où la bonne décision n'est pas de toucher à l'écran.

<details>
<summary>Voir la solution</summary>

Question. Parmi les comptes inscrits lors des quatre semaines complètes précédant le comité, la part de ceux qui créent au moins une note dans les sept jours a-t-elle baissé de plus de cinq points par rapport aux quatre semaines d'avant ? Si oui, le comité décale la refonte. Sinon, la refonte reste au calendrier.

Données. Table des inscriptions (identifiant, horodatage) et table des notes créées (identifiant de compte, horodatage). On exclut les comptes internes. On vérifie que l'événement « note créée » n'a pas été renommé ni échantillonné pendant la période.

Analyse. Taux d'activation par semaine d'inscription, comparaison des deux blocs de quatre semaines, et un contrôle : le volume d'inscriptions et le délai médian jusqu'à la première note. On ne conclut pas sur la semaine en cours, incomplète.

Décision. Si la baisse dépasse cinq points et que la mesure est intacte, la responsable produit décale la refonte et ouvre un chantier sur l'écran d'accueil. Si le taux est stable mais que l'événement a cessé d'être envoyé le 2 du mois, la décision est de réparer le suivi, pas de refondre l'écran. Une « analyse complète » sans ce seuil aurait produit des graphiques, pas une décision.

</details>

## Exercice 3 : Choisir le livrable

Nota veut suivre, chaque lundi, trois chiffres : inscriptions, activation à 7 jours, résiliation du mois. Aujourd'hui, chacun les recalcule dans un classeur personnel. On vous demande « un beau tableau ».

Proposez le livrable adapté, ce qu'il doit contenir pour rester fiable dans trois mois, et ce que vous ne livrez pas.

<details>
<summary>Voir la solution</summary>

Le bon livrable est un tableau de bord court, précédé d'une définition écrite des trois métriques (formule, grain, exclusions, fuseau, date de fraîcheur). Une note d'une page ne suffit pas : le besoin est hebdomadaire et partagé. Un classeur personnel non plus : c'est déjà la situation qui produit des chiffres divergents.

Dans trois mois, le tableau doit encore montrer la période couverte, l'heure de dernier rafraîchissement, et les exclusions (comptes internes, essais non convertis si vous les sortez de la résiliation). Un chiffre de contrôle sur un mois clos, noté à côté de la définition, permet de voir si une modification a fait bouger l'historique.

Vous ne livrez pas un mur de graphiques « au cas où », ni une prédiction de résiliation : personne ne l'a demandée, et les trois définitions ne sont pas encore stables. Vous ne livrez pas non plus la requête sans propriétaire. Vous indiquez qui met à jour la définition si le produit change la notion de résiliation.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Le métier d'analyste
center: "Relier une question métier à une décision, avec un chiffre dont la définition est explicite."
points:
  - icon: target
    title: Décider, pas décorer
    text: "Un graphique ne sert que s'il éclaire une action, un responsable et un délai."
  - icon: users
    title: Cinq questions, cinq rôles
    text: "Analyste, ingénieur, scientist, analytics engineer et BI ne traitent pas le même besoin."
  - icon: loop
    title: Un cycle, pas un export
    text: "Question, données, analyse, décision, puis mesure de l'effet de l'action choisie."
  - icon: file
    title: Un livrable relisible
    text: "Note, définition, requête commentée ou tableau, avec la date et les filtres."
  - icon: alert
    title: Une seule formule
    text: "Deux définitions de client actif produisent deux chiffres justes et inutilisables."
pitfall: "Envoyer un classeur sans définition, puis laisser chaque équipe recalculer le chiffre."
remember: "Nommez la décision et la métrique avant d'ouvrir le tableur ou l'éditeur SQL."
```
