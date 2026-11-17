---
title: Entonnoir et rétention
description: "Lire un entonnoir par ses taux de passage, localiser la fuite, mesurer la rétention J1, J7 et J30, et ne pas confondre acquisition et engagement."
duration: 60
objectives:
  - "Calculer des taux de passage et le rendement de bout en bout"
  - "Localiser l'étape qui fuit par rapport à une référence interne"
  - "Lire une rétention J1, J7 et J30 sans confondre les définitions"
  - "Choisir entre un levier d'acquisition et un levier d'engagement"
---

# L'entonnoir compte des passages, pas un stock

Un **entonnoir** (funnel) suit une population dans une suite d'étapes ordonnées. On ne mesure pas « combien de devis existent dans la base ». On mesure « parmi ceux qui ont passé l'étape précédente, combien atteignent la suivante ». Le stock de devis ouverts, lui, mélange des mois différents et des devis abandonnés. Il ne dit pas où le parcours casse.

Pour Lumen, l'entonnoir du **T2** porte sur les visites qualifiées du site professionnel (une page produit a été vue) jusqu'à l'activation : une commande livrée dans les 14 jours après la création du compte.

| Étape | Volume | Taux depuis l'étape d'avant | Taux depuis le compte |
|---|---|---|---|
| Visites qualifiées | 1 500 |  |  |
| Comptes créés | 240 | 16 % |  |
| Devis | 150 | 62,5 % | 62,5 % |
| Commandes passées | 132 | 88 % | 55 % |
| Livrées en 14 jours | 120 | 91 % | 50 % |

De bout en bout, 120 / 1 500 = **8 %** des visites qualifiées deviennent un compte activé. Depuis le compte, 120 / 240 = **50 %**. Ces deux pourcentages répondent à deux questions. Les mélanger (« notre funnel est à 50 % ») fait croire que la moitié des visiteurs achètent.

Le volume perdu le plus grand n'est pas forcément l'étape la plus cassée. Entre la visite et le compte, 1 260 visites ne créent pas de compte : c'est beaucoup de monde, et 16 % peut être normal en B2B. Entre le compte et le devis, 90 comptes « disparaissent ». C'est moins de monde, mais ce sont des gens qui ont déjà franchi le pas de s'inscrire. La priorité ne se décide pas au volume brut. Elle se décide en comparant chaque taux à **sa** référence.

```diagram
type: flow
title: "Entonnoir T2 de Lumen, de la visite à la livraison"
steps:
  - title: "1 500 visites"
    text: "Sessions qualifiées, une page produit au moins"
    tone: blue
  - title: "240 comptes · 16 %"
    text: "Passage depuis la visite. Référence T1 : 15 %"
    tone: teal
  - title: "150 devis · 62,5 %"
    text: "Passage depuis le compte. Référence T1 : 75 %"
    tone: amber
  - title: "132 commandes · 88 %"
    text: "Passage depuis le devis. Référence T1 : 85 %"
    tone: violet
  - title: "120 livrés · 91 %"
    text: "Livraison en 14 jours. Référence T1 : 95 %"
    tone: rose
```

> [!IMPORTANT]
> Fixez la population d'entrée et ne la changez pas au milieu. Un entonnoir qui commence à « visites » et dont le dernier taux est calculé sur « tous les clients historiques » n'est plus un entonnoir : les étapes ne parlent plus des mêmes personnes.

# Lire les taux de passage

Le **taux de passage** d'une étape est le volume qui atteint cette étape divisé par le volume qui a atteint l'étape précédente. Il se lit toujours avec son dénominateur à côté.

Trois erreurs reviennent sans cesse.

**Moyenner les taux.** Le passage compte → devis est à 62,5 %, le passage devis → commande à 88 %. La moyenne des deux, environ 75 %, ne correspond à rien. Le rendement compte → commande est 132 / 240 = **55 %**, c'est-à-dire le produit 0,625 × 0,88, pas la moyenne. Moyenner des taux d'étapes successives invente un entonnoir plus flatteur que le parcours réel.

**Oublier que les petits dénominateurs crient.** Un passage de 2 comptes sur 4 est un « 50 % » inutilisable. Annoncez l'effectif. En dessous de quelques dizaines de comptes, commentez la liste, pas le pourcentage.

**Changer la fenêtre de temps.** Un devis créé au T2 pour une visite du T1 ne doit pas améliorer le taux du T2 si votre entonnoir est « cohorté » sur la date de visite. Choisissez une règle et tenez-la : soit vous suivez la cohorte de visites du T2 jusqu'à 14 jours après la fin du trimestre (et vous attendez que la fenêtre soit close avant de figer le chiffre), soit vous acceptez un chiffre provisoire et vous l'étiquetez comme tel. Publier 50 % le 30 juin alors que des commandes du 28 juin ne sont pas encore livrables en 14 jours **baisse artificiellement** l'activation.

Le complément du taux de passage est la fuite : 100 % − 62,5 % = **37,5 %** des nouveaux comptes n'ont pas de devis. En effectif : 240 − 150 = **90 comptes**. Gardez les deux. Le pourcentage sert à comparer des périodes de taille différente. L'effectif sert à savoir si le sujet mérite une équipe.

# Où ça fuit, et qui peut agir

Comparez chaque passage au même passage au T1, pas à un « benchmark » trouvé dans un article.

| Passage | T1 | T2 | Lecture |
|---|---|---|---|
| Visite → compte | 15 % | 16 % | Stable, légèrement mieux. Pas le lieu de la chute. |
| Compte → devis | 75 % | 62,5 % | **Fuite principale.** Environ 30 devis de moins que si le taux T1 s'était maintenu (75 % de 240 = 180, contre 150). |
| Devis → commande | 85 % | 88 % | Tient. |
| Commande → livrée en 14 jours | 95 % | 91 % | Légère dégradation opérations. 120 livrés pour 132 commandes, soit 12 commandes hors délai d'activation. |

La fuite principale est **entre le compte et le devis**. Les personnes qui peuvent agir sont l'onboarding et le commerce, pas l'équipe d'acquisition : les visites convertissent comme au T1. Doubler le budget publicitaire reproduirait la même fuite sur un volume plus grand. Les 12 commandes livrées trop tard sont un second sujet, plus petit, côté opérations et stock. Vous le signalez. Vous ne le mettez pas au même rang que les 30 devis manquants.

Pour creuser la fuite sans vous disperser, coupez les 90 comptes sans devis en deux ou trois paquets actionnables, pas en vingt segments : pas de connexion après l'inscription, connexion sans demande, demande commencée et abandonnée. Le premier paquet appelle un e-mail ou un appel de mise en route. Le troisième appelle une correction du formulaire. Le chapitre sur les segments dira comment ne pas découper jusqu'à l'absurde.

> [!TIP]
> Traduisez toujours le point de fuite en phrase d'équipe : « le passage compte → devis passe de 75 % à 62,5 %, soit une trentaine de devis manquants sur le trimestre ». Une phrase sans effectif ni référence ne se traite pas.

# Rétention J1, J7, J30

L'entonnoir s'arrête à la première valeur. La **rétention** demande si la personne revient. Sans une définition du « retour », J1, J7 et J30 sont trois nombres incomparables d'une équipe à l'autre.

Deux conventions circulent. Ne les additionnez pas.

- **Rétention au jour n** : parmi les comptes dont le jour 0 est l'activation, la part qui fait l'action **ce jour-là**. La courbe peut remonter. Elle est bruitée.
- **Rétention « encore actif »** : la part qui a fait l'action au moins une fois dans les n derniers jours, ou qui n'a pas été classée churn. Cette courbe descend, ou elle ne devrait pas remonter par construction.

Pour Lumen, l'action du portail n'est pas « passer une commande » : un professionnel n'équipe pas un site tous les jours. L'action retenue pour J1, J7 et J30 est : **ouvrir l'espace client**. Cohorte : les **100 comptes activés en janvier** (première livraison en janvier). Jour 0 = jour de l'activation.

| Échéance | Part qui ouvre l'espace client ce jour-là |
|---|---|
| J1 | 46 % |
| J7 | 31 % |
| J30 | 27 % |

La chute est forte entre J0 (100 %, ils sont dans le produit le jour de la livraison) et J1. Entre J7 et J30, la courbe se stabilise presque (31 % puis 27 %). Le problème n'est pas une érosion lente du mois : c'est l'absence de raison de revenir dans la **première semaine**.

À côté, la rétention **métier**, plus lente, suit une autre action : au moins une nouvelle commande livrée dans le mois. Même cohorte de janvier, 100 comptes :

| Mois d'âge | Part qui recommande |
|---|---|
| M1 (février) | 48 % |
| M2 | 41 % |
| M3 | 38 % |

J30 = 27 % de connexions un jour donné n'est pas « 27 % de clients perdus ». Et 48 % de recommande en M1 n'est pas comparable à 46 % de connexions en J1. Vous annoncez l'action, le jour exact ou la fenêtre, et la cohorte, à chaque fois.

La cohorte de **février** (80 comptes activés, l'appel de mise en route a été retiré) recommande à **33 %** en M1 et **27 %** en M2. On compare février M1 (33 %) à janvier M1 (48 %), pas février M1 à janvier M3 (38 %). Même âge, même action. Février est plus faible. C'est un signal d'engagement, pas un effet de calendrier à commenter « plus tard quand la cohorte sera grande ».

# Lire la courbe, pas un point isolé

Une courbe de rétention se lit en trois gestes.

1. **La marche du lendemain.** Un J1 très bas (ici 46 % d'ouvertures) dit que la première expérience n'a pas créé de motif de retour. Le levier est le jour 0 : ce que le client voit à la livraison, le rendez-vous de réglage, l'e-mail du surlendemain.
2. **Le palier.** Si J7 et J30 sont proches, ceux qui ont pris l'habitude restent. Investir seulement sur le mois 2 rate la marche. Si au contraire J7 vaut 31 % et J30 vaut 8 %, l'habitude ne se forme pas : le produit sert une fois et s'oublie. Ce n'est pas le portrait de Lumen sur l'espace client (27 % proches de 31 %), mais ce serait le portrait à surveiller sur la recommande si M3 s'écroulait sous M1.
3. **La comparaison de cohortes au même âge.** Janvier M1 à 48 %, février M1 à 33 % : quelque chose a changé pour les entrants de février (ici, la suppression de l'appel). Vous ne concluez pas sur le seul mois de février tant que les effectifs sont minuscules, mais 80 comptes suffisent à poser la question, pas à l'enterrer.

Méfiez-vous des moyennes de cohortes « toutes durées confondues ». Mélanger le M1 de février avec le M3 de janvier fabrique un taux qui ne décrit aucune expérience réelle. Et ne lissez pas la courbe au point d'effacer J1 : c'est souvent le seul point que le produit peut encore influencer facilement.

> [!WARNING]
> J1 à 46 % n'est ni « la moitié des clients sont partis pour toujours », ni « l'activation a échoué ». L'activation a déjà eu lieu (c'est le critère d'entrée dans la cohorte). J1 dit ce qu'ils font le lendemain de cette première valeur.

# L'acquisition ne répare pas l'engagement

L'**acquisition** amène des personnes à la porte : visites, coût pour obtenir un compte, passage visite → compte. L'**engagement** décrit ce qu'elles font une fois entrées : passage vers le devis, activation, retour J1/J7/J30, recommande.

Sur le T2 de Lumen, les deux étages ne racontent pas la même histoire.

- Acquisition : visite → compte à 16 %, proche des 15 % du T1. Le haut de l'entonnoir n'est pas en panne.
- Engagement précoce : compte → devis tombe de 75 % à 62,5 %. C'est la fuite.
- Engagement dans le temps : la cohorte de février, privée d'appel de mise en route, recommande moins au même âge (33 % contre 48 %).

Acheter davantage de visites avec un passage compte → devis dégradé, c'est remplir un seau percé. À l'inverse, restaurer l'appel de mise en route ne corrigera pas un passage visite → compte qui tomberait à 4 % : là, le message, la page ou la cible d'acquisition seraient en cause. Vous ne « compensez » pas un étage par l'autre dans un même pourcentage.

La phrase de décision peut être : « Ne pas augmenter le budget d'acquisition ce mois-ci. Traiter les 90 comptes sans devis et vérifier l'effet de la suppression de l'appel sur la cohorte de février, à âge égal. Reprendre la dépense d'acquisition quand le passage compte → devis se rapproche des 75 % du T1. »

Cette séparation est aussi une séparation d'équipes. L'acquisition ne « rate son objectif » parce que J30 est mou, si son mandat s'arrête au compte créé. L'équipe produit ne se dédouane pas d'un J1 à 46 % en demandant plus de trafic. Écrivez jusqu'où va chaque taux. C'est le même réflexe que la fiche de KPI : le dénominateur dit qui est responsable.

# Exercices

## Exercice 1 : Trouver la fuite

Un entonnoir mensuel : 1 000 visites, 200 comptes, 140 essais du produit, 70 payants. Le mois de référence : 1 000 visites, 180 comptes, 150 essais, 90 payants.

1. Calculez les trois taux de passage du mois actuel et le rendement visite → payant.
2. Où est la fuite par rapport à la référence ?
3. Pourquoi « (20 % + 70 % + 50 %) / 3 » n'est-il pas un résumé acceptable ?

<details>
<summary>Voir la solution</summary>

1. Visite → compte : 200 / 1 000 = **20 %**. Compte → essai : 140 / 200 = **70 %**. Essai → payant : 70 / 140 = **50 %**. Visite → payant : 70 / 1 000 = **7 %**. Vérification : 0,20 × 0,70 × 0,50 = 0,07.

2. Référence : visite → compte 18 %, compte → essai 150 / 180 ≈ **83 %**, essai → payant 90 / 150 = **60 %**. Le haut de l'entonnoir va mieux (20 % contre 18 %). La fuite commence au passage **compte → essai** (70 % contre 83 %), puis se poursuit à l'essai → payant (50 % contre 60 %). Priorité : comprendre pourquoi les nouveaux comptes n'essaient plus le produit, avant d'acheter des visites.

3. La moyenne des taux (environ 47 %) ne vaut aucun parcours réel. Le rendement est le **produit** des passages, 7 %, pas leur moyenne. Moyenner gonfle le résultat et mélange des dénominateurs différents.

</details>

## Exercice 2 : Lire J1, J7 et J30

Deux cohortes d'activation, action = ouverture de l'application ce jour-là.

| | J1 | J7 | J30 |
|---|---|---|---|
| Cohorte A, 200 comptes | 55 % | 40 % | 36 % |
| Cohorte B, 200 comptes | 54 % | 38 % | 12 % |

1. Que pouvez-vous dire de l'habitude dans chaque cohorte ?
2. Quelle erreur ferait-on en ne regardant que J1 ?
3. Que ne devez-vous pas conclure sur « la moitié des clients de A sont partis dès le lendemain » ?

<details>
<summary>Voir la solution</summary>

1. Les deux cohortes perdent beaucoup entre le jour 0 et J1, de façon semblable. La cohorte A **se stabilise** ensuite (40 % puis 36 %) : ceux qui reviennent à J7 sont encore largement là à J30. La cohorte B **ne prend pas l'habitude** : J30 tombe à 12 % après un J7 encore correct. Le levier de B est entre la première semaine et le premier mois, pas le message d'acquisition.

2. J1 est presque identique (55 % et 54 %). On déclarerait les deux cohortes équivalentes et on raterait l'écroulement de B à J30.

3. J1 = 55 % signifie que 55 % ont fait l'action **ce jour-là**, pas que 45 % ont résilié. Ils peuvent revenir à J7. Il faut la définition (action, jour exact, cohorte) pour ne pas traduire le taux en « clients perdus ».

</details>

## Exercice 3 : Acquisition ou engagement

Le passage visite → compte est stable à 16 %. Le passage compte → devis passe de 75 % à 60 %. Une agence propose de doubler le budget publicitaire « pour compenser ». Que répondez-vous, et quel chiffre demanderiez-vous avant toute dépense supplémentaire ?

<details>
<summary>Voir la solution</summary>

Vous refusez de compenser par l'acquisition. Le haut de l'entonnoir n'est pas la fuite : il est stable. Doubler les visites, à taux inchangés, double aussi les comptes qui n'obtiennent pas de devis. L'argent supplémentaire subit la même fuite d'engagement.

Avant de rouvrir le budget, vous voulez revoir le passage compte → devis se rapprocher de 75 %, sur un effectif suffisant (pas une semaine à 10 comptes). Vous demandez la liste des comptes sans devis et le découpage simple « jamais connecté / connecté sans devis ». C'est un sujet d'onboarding, pas un sujet d'achat média.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Entonnoir et rétention
center: "Le taux de passage dit où ça fuit. J1, J7 et J30 disent qui revient. L'acquisition ne bouche pas cette fuite."
points:
  - icon: filter
    title: Passages
    text: "Volume de l'étape divisé par l'étape d'avant. Le rendement total est le produit des taux, pas leur moyenne."
  - icon: alert
    title: La fuite
    text: "Comparez chaque passage à sa référence. Le plus gros volume perdu n'est pas toujours l'étape cassée."
  - icon: clock
    title: J1, J7, J30
    text: "Même cohorte, même action, jour exact ou fenêtre : à écrire. 46 % un jour n'est pas 46 % de clients perdus."
  - icon: chart
    title: La courbe
    text: "Marche du lendemain, palier ensuite, comparaison de cohortes au même âge. On ne mélange pas M1 et M3."
  - icon: scale
    title: Deux leviers
    text: "L'acquisition amène à la porte. L'engagement retient. Acheter du trafic sur un seau percé amplifie la fuite."
pitfall: "Résumer l'entonnoir par une moyenne de pourcentages, ou comparer le mois 1 d'une cohorte au mois 3 d'une autre."
remember: "Nommez l'étape, l'effectif et la référence. Traitez la fuite qui a bougé, pas le volume qui impressionne."
```
