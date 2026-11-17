---
title: Rédiger un rapport d'expérience
description: Structurer un rapport que quelqu'un d'autre peut relire, rendre la comparaison reproductible, et tracer des graphiques qui ne gonflent pas un écart.
duration: 40
objectives:
  - Organiser un rapport en question, données, méthode, résultats, limites et décision
  - Décrire le protocole assez précisément pour qu'une autre personne refasse le chiffre
  - Inclure les essais négatifs et les limites qui contraignent la décision
  - Construire des graphiques dont l'échelle et le titre ne trompent pas le lecteur
---

# Le notebook est le labo, le rapport est la décision

Le notebook garde le détail : essais, graphes intermédiaires, erreurs de chemin. Il est précieux le jour où il faut reprendre, et illisible pour qui doit **décider**. Le rapport est le texte qu'une collègue, un métier ou vous-même dans six mois pouvez lire en vingt minutes sans exécuter une cellule.

Il tient en six mouvements, dans cet ordre. Changer l'ordre pour « mettre les bons chiffres en premier » produit une plaquette. On cherche un compte-rendu.

```diagram
type: flow
title: "Les six mouvements du rapport"
steps:
  - title: "Question"
    text: "La décision, la cible, le horizon, tels que le cadrage les a fixés."
    tone: blue
  - title: "Données"
    text: "Sources, période, volume, taux de cible, exclusions, manquants."
    tone: violet
  - title: "Méthode"
    text: "Découpage, baseline, modèles, métrique, ce qui a été réglé où."
    tone: teal
  - title: "Résultats"
    text: "Le tableau de comparaison, le segment utile, ce qui a échoué."
    tone: amber
  - title: "Limites"
    text: "Ce que le chiffre ne couvre pas, et ce qui peut le faire mentir."
    tone: rose
  - title: "Décision"
    text: "On livre ceci, on refuse cela, on revoit à telle date."
    tone: blue
```

Une page peut suffire si le projet est un arrêt précoce (la règle gagne). Vingt pages de captures ne remplacent pas une phrase de décision manquante. Le volume suit la complexité de la **limite**, pas le nombre d'algorithmes essayés.

# Question et données

La **question** reprend le cadrage, elle ne le réinvente pas. Une phrase : qui agit, sur quelle population, avec quelle cible et quel horizon. Si le cadrage a bougé en cours de route (la cible « tout départ » est devenue « départ à l'initiative du client »), le rapport le dit au début. Un lecteur qui compare deux rapports doit voir que le sujet a changé.

La section **données** donne de quoi juger si le chiffre a un sol.

- source et date d'extraction, ou identifiant de l'instantané ;
- période couverte et granularité (contrat × mois, 14 mois, 80 000 contrats) ;
- taux de la cible, et comment l'étiquette est construite ;
- exclusions (lignes internes, contrats déjà clos, historique d'appels trop court) ;
- taux de manquants sur les quelques features qui portent la décision ;
- ce qui n'est **pas** dans la table (prix des concurrents, appels de plus de six mois).

Un taux de cible passé sous silence, ou un « données clients » sans effectif, empêche de lire une accuracy. 96 % de bonnes réponses avec 4 % de départs n'a pas le même sens qu'avec 40 %. L'effectif des segments tient dans la même section : un écart sur les nouveaux clients se lit avec le nombre de nouveaux clients, pas seul.

> [!NOTE]
> Si 30 % des étiquettes sont douteuses, cela se dit ici, pas dans une note de bas de page après la conclusion. Une donnée fragile qui n'apparaît qu'une fois le modèle vanté est une donnée cachée.

# Méthode, assez pour refaire

La méthode n'est pas le code intégral. C'est ce qu'il faut pour **refaire la comparaison** ou pour voir qu'elle n'est pas refaisable.

- découpage : quelles dates en train, en validation, en test, et pourquoi ce choix (temporel, ou aléatoire par groupe) ;
- baseline : la règle exacte, en une phrase opérationnelle ;
- modèles comparés, et ceux qu'on s'était interdit (un réseau, si le protocole le plaçait derrière le boosting) ;
- métrique de décision et métrique secondaire ;
- où les hyperparamètres et le seuil ont été choisis (validation seulement) ;
- commit, ou numéro de configuration, et version des librairies qui comptent.

« Nous avons utilisé un modèle de machine learning optimisé » n'est pas une méthode. « Gradient boosting histogramme, profondeur choisie sur la validation d'octobre-novembre, graine 0, features listées en annexe » en est une. La liste des features peut être une annexe, à condition qu'elle existe et qu'elle distingue les champs connus à la date de décision.

On mentionne le test **une** fois dans la méthode : il n'a pas servi au choix. Si ce n'est pas vrai, la méthode dit combien de fois il a été ouvert. L'honnêteté ici vaut mieux qu'un protocole idéal fictif.

# Résultats, y compris ce qui n'a pas marché

Les résultats commencent par le tableau prévu au protocole : baseline et modèles, métrique de décision, sur la validation **et**, pour le seul modèle retenu, sur le test. On n'aligne pas cinq scores de test si cinq modèles ont été mesurés après coup. On aligne les scores de validation qui ont servi à choisir, puis une ligne de test.

On ajoute le point de fonctionnement réel : précision parmi les 500, pas seulement l'AUC. Un segment, celui de l'action, suffit. Dix segments « pour explorer » relèvent du notebook. Un segment qui **renverse** la décision (le global gagne, la file d'appels perd) se met dans le corps du texte, pas en annexe.

Les échecs tiennent en quelques lignes : le réseau n'a pas battu le boosting, une feature prometteuse fuyait et a été retirée, le gain a disparu sur la deuxième fenêtre. Un rapport qui ne montre que la courbe gagnante interdit d'apprendre, et il sera relu comme une publicité le jour où le gain ne se reproduira pas.

Les nombres ont un effectif à côté. « +8 points » avec 500 appels se comprend. « +8 points » sans dire sur combien de cas positifs se survendent. Un intervalle, même approximatif (variation entre deux mois de validation), vaut mieux qu'une précision au millième.

# Limites, puis décision

Les **limites** sont les raisons pour lesquelles le chiffre pourrait ne pas se transporter.

- population non vue : une offre lancée après la fin du test, un canal de vente absent ;
- étiquette en retard : la qualité réelle ne se lit qu'à horizon écoulé ;
- historique court : pas de saison complète ;
- proxy : une colonne utile mais suspecte, retirée ou surveillée ;
- dépendance à une fraîcheur : si le job du dimanche glisse, le score du lundi n'existe pas ;
- essai usé : le test a été regardé plus d'une fois, le chiffre est optimiste.

La **décision** vient après, et elle tient compte des limites au lieu de les oublier. Elle dit ce qu'on fait lundi prochain.

- « On sert le boosting 1.3.0 comme ordre d'appel, liste de 500, sans automatiser la résiliation. Revue dans 60 jours sur la cohorte étiquetée. »
- « On ne sert pas de modèle. La règle d'engagement reste. Motif : +2 points en validation, marge fixée à 5. »
- « On refuse d'ajouter le quartier pour réduire les appels. Le classement continue sans cette colonne. »

Un rapport sans décision est un exercice. Une décision sans limite est un argumentaire. Les deux paragraphes se touchent : la revue à 60 jours existe **parce que** l'étiquette arrive en retard et que l'offre nouvelle n'était pas dans le test.

```diagram
type: compare
title: "Ce que la fin du rapport doit trancher"
columns:
  - title: "On livre"
    tone: teal
    items:
      - "Le modèle ou la règle, nommé"
      - "L'usage autorisé, et l'usage refusé"
      - "Le chiffre qui a justifié, avec sa période"
      - "La date de revue"
  - title: "On ne livre pas"
    tone: rose
    items:
      - "Un score sans dire qui s'en sert"
      - "Une accuracy sans la baseline"
      - "Une promesse sur une population absente des données"
      - "Un usage ajouté après le cadrage"
```

# Rendre le chiffre reproductible

Une collègue doit pouvoir retrouver **le même** ordre de grandeur, sur le même instantané, sans vous appeler. Cela demande peu d'objets, tous cités dans le rapport ou dans le registre :

- identifiant de l'instantané de données (pas « l'export d'avril » sans date) ;
- commit du code d'entraînement et d'évaluation ;
- fichier de dépendances figé ;
- graine aléatoire si un tirage ou un modèle en a une ;
- commande du type `python -m train --config configs/churn_1_3.yaml` ;
- tolérance : la métrique se reproduit à 0,01 près, ou exactement, selon que le calcul est déterministe.

Le rapport n'a pas à contenir les poids. Il contient le **chemin** vers l'artefact versionné et la métrique annoncée. Si la commande ne tourne que sur la machine de l'auteur, avec un fichier local non versionné, le résultat n'est pas reproductible : on l'écrit comme une limite, ou on range le fichier avant de conclure.

Les graphiques du rapport sont produits par cette commande ou par un script voisin, pas recollés depuis une cellule modifiée ensuite à la souris. Un graphique qu'on ne peut pas régénérer devient faux dès que la donnée est corrigée, et personne ne le voit.

> [!WARNING]
> Reproduire, ce n'est pas obtenir un meilleur score en relançant. Si une nouvelle graine gagne 3 points et que vous publiez celle-là, vous avez de nouveau choisi sur le résultat. La graine se fixe avant, ou l'on moyenne un petit nombre de graines prévu au protocole.

# Des graphiques qui ne mentent pas

Un graphique honnête montre la comparaison que la phrase énonce, à l'échelle qui ne la gonfle pas.

- Les barres d'une précision entre 0,22 et 0,36 partent de **zéro**, ou le texte dit que l'axe est zoomé et les valeurs sont imprimées sur les barres. Un axe qui commence à 0,20 fait paraître un écart de 4 points comme un doublement.
- La **baseline** est sur le même graphique. Un modèle seul, sans la règle, n'a pas de référence visuelle.
- Le **titre est une phrase** : « Le boosting gagne 8 points de précision sur la règle, parmi 500 appels, en validation de novembre. » « Figure 3 » ne dit rien.
- L'effectif ou le nombre de cas positifs est dans le sous-titre ou l'axe. Un taux sur 12 positifs n'a pas le même trait qu'un taux sur 1 200.
- On ne remplace pas le tableau par un camembert en trois dimensions. Pour deux ou quatre modèles, des barres ou des points suffisent.
- La couleur n'est pas le seul canal : un libellé reste lisible en gris.

On n'illustre pas cinq essais sur le test « parce que le graphique est joli ». On illustre le tableau de décision. Le réseau écarté peut apparaître, clairement comme écarté, si cela évite qu'on le redemande la semaine suivante. Il n'apparaît pas comme vainqueur d'un autre indicateur choisi après coup.

Si le mois du changement d'offre casse la série, on l'annote sur le graphique au lieu de le lisser. Le lecteur doit voir la cassure là où le monde a cassé. La retirer du tracé sans le dire est le même geste que de changer le découpage après avoir vu le test.

# Exercices

## Exercice 1 : Remettre dans l'ordre

Un document s'ouvre sur un camembert de l'accuracy, puis un glossaire d'algorithmes, puis « les données seront décrites en annexe », puis une conclusion « le modèle est performant et prêt pour tous les usages ». La cible n'apparaît pas. La baseline non plus.

Quels blocs manquent, et par quoi remplacer la conclusion ?

<details>
<summary>Voir la solution</summary>

Il manque, dans l'ordre utile : la **question** (décision, cible, horizon), les **données** (période, effectif, taux de cible, exclusions) dans le corps du texte, la **méthode** (découpage, baseline, métrique, où l'on a réglé), les **résultats** comparés à la baseline, les **limites**. Le glossaire et le camembert d'accuracy ne portent pas ces blocs. L'accuracy sans taux de cible est ambiguë.

Conclusion de remplacement, une fois les chiffres réellement produits : « On sert le boosting comme liste de 500 appels de fidélisation, pas pour d'autres usages. Il gagne X points de précision sur la règle en validation, confirmé une fois sur le test du mois M. Revue à 60 jours. On ne l'utilise ni pour résilier ni pour écarter un quartier. » Sans les X mesurés, la conclusion honnête est : le rapport n'est pas prêt, pas que le modèle est performant.

</details>

## Exercice 2 : Un graphique trompeur

Le boosting est à 0,31 de précision@500, la règle à 0,27. Le graphique barre commence à 0,25, n'affiche pas les valeurs, omet la règle, et titre « Forte amélioration grâce au deep learning » alors que le modèle est un boosting. L'effectif n'est pas indiqué. Le chiffre vient du meilleur de trois lectures du test.

Listez les corrections, sans changer les deux nombres.

<details>
<summary>Voir la solution</summary>

- Axe depuis **0**, ou zoom annoncé et **valeurs écrites** sur les barres (0,27 et 0,31).
- **Règle et boosting** sur le même graphique. Quatre points d'écart doivent se voir comme quatre points, pas comme une barre deux fois plus haute.
- Titre en phrase vraie : « Quatre points de précision@500 séparent le boosting de la règle », et surtout pas « deep learning ».
- Effectif : 500 appels, et le nombre de positifs si on l'a.
- Le commentaire dit que ce chiffre est le **meilleur de trois lectures du test**, donc optimiste, ou le graphique est retiré jusqu'à une mesure unique sur une période neuve. On ne garde pas le titre enthousiaste sur un essai usé.

</details>

## Exercice 3 : Limite et décision

Le test temporel s'arrête avant le lancement d'une offre low-cost. Les appels support ne sont historisés que sur six mois. Le boosting gagne 7 points de précision@500 sur la règle, marge exigée 5 points, test lu une seule fois. Le métier demande en plus d'utiliser le score pour couper les réductions des clients « à risque ».

Rédigez le paragraphe de limites et le paragraphe de décision.

<details>
<summary>Voir la solution</summary>

Limites : le test ne contient pas l'offre low-cost, donc le gain de 7 points ne se transporte pas tel quel aux clients de cette offre. L'historique d'appels ne couvre que six mois : la feature support est aveugle au-delà, et aucune saison complète n'est observée. Les labels restent en retard de 30 jours. La revue devra mesurer la précision sur la première cohorte qui inclut la nouvelle offre.

Décision : on sert le boosting pour **ordonner les 500 appels d'une offre de fidélisation**, parce que les 7 points dépassent la marge, sur un test lu une fois. On **refuse** de couper les réductions à partir du même score : ce n'est pas l'usage cadré, c'est une sanction. Première revue à 60 jours, ou dès qu'une cohorte étiquetée inclut l'offre nouvelle, selon ce qui arrive en premier.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Rapport d'expérience"
center: "Question, données, méthode, résultats, limites, décision. Le graphique montre la baseline, à une échelle qui ne gonfle pas l'écart."
points:
  - icon: file
    title: "Six mouvements"
    text: "La décision est le dernier, pas le premier. Elle s'appuie sur des limites écrites avant elle."
  - icon: database
    title: "Des données comptées"
    text: "Période, effectif, taux de cible, exclusions. Une accuracy sans taux de base ne se lit pas."
  - icon: loop
    title: "Refaire le chiffre"
    text: "Instantané, commit, graine, commande. Un export local non cité n'est pas une reproductibilité."
  - icon: chart
    title: "Graphique honnête"
    text: "Axe qui ne truque pas l'écart, baseline présente, titre qui énonce le résultat, effectif visible."
  - icon: check
    title: "Dire non aussi"
    text: "Usage refusé, modèle écarté, test usé : cela se publie. Un rapport sans échec est incomplet."
pitfall: "Ouvrir sur l'accuracy du vainqueur, et reléguer la cible, la baseline et les limites après la conclusion."
remember: "Un lecteur pressé doit pouvoir refaire l'ordre de grandeur et citer l'usage interdit, sans ouvrir le notebook."
```
