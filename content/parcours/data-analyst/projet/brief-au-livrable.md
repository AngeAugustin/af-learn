---
title: D'un brief à un livrable
description: "Conduire une analyse de bout en bout sur la baisse du taux de réachat d'une enseigne : cadrage, requêtes, graphique, recommandation proportionnée et limites explicites."
duration: 70
objectives:
  - Cadrer une baisse de réachat avant d'ouvrir l'outil, avec définition, période et hypothèses
  - Vérifier le constat en SQL ou en Python, puis localiser où l'écart se concentre
  - Choisir un graphique qui montre la concentration, pas toute l'exploration
  - Formuler une recommandation à la hauteur des preuves, avec ce que l'analyse ne dit pas
---

# Le brief et le cadrage

Lundi, la direction d'une enseigne de prêt-à-porter vous écrit : « Le taux de réachat s'écroule, trouvez pourquoi avant le comité de jeudi. » Vous ne commencez pas par une requête. Vous cadrez, par écrit, en une demi-page, et vous la faites confirmer par la personne qui a porté le sujet.

**La définition que vous proposez**, parce que « réachat » n'en est pas une. Taux de réachat à 90 jours : parmi les clients **identifiés** ayant une commande payée HT en France au mois M, la part qui en a au moins une autre dans les 90 jours. Une fenêtre par client, ancrée sur la **première** commande du mois, pour ne pas compter trois fois les habitués. Les annulations totales sortent. Les cartes cadeaux ne comptent pas comme une commande. Vous le dites avant que le chiffre circule.

**La période.** Les cohortes de mars, avril et mai, observées assez longtemps pour que les 90 jours soient complets. Si l'on est en novembre, la cohorte d'août est mûre ; celle d'octobre ne l'est pas. Vous refusez de mélanger des fenêtres incomplètes dans la courbe « qui s'écroule ».

**Le comparatif.** Les mêmes cohortes un an plus tôt, même définition, mêmes exclusions. Pas « mai contre avril », qui mélange la saison et le sujet.

**Les hypothèses, écrites avant l'exploration.** Vous en posez quatre, pour ne pas n'en voir qu'une.

1. Le code de bienvenue −30 %, lancé en mars, attire des clients qui n'avaient l'intention d'acheter qu'une fois.
2. Des ruptures sur les basiques ont empêché le second achat.
3. Un incident de tracking a fait disparaître des commandes identifiées (faux écroulement).
4. La baisse est générale (marché, météo) et pas spécifique à un canal.

```diagram
type: pipeline
title: Du message du lundi au comité de jeudi
lanes:
  - title: Cadrer
    steps:
      - title: Définition
        text: Fenêtre, grain, exclusions
        tone: blue
      - title: Période mûre
        text: 90 jours complets seulement
        tone: violet
  - title: Mesurer
    steps:
      - title: Contrôles
        text: Volumes, clés, pont finance
        tone: amber
      - title: Localiser
        text: Canal, offre, cohorte
        tone: teal
  - title: Livrer
    steps:
      - title: Un graphique
        text: Là où l'écart se concentre
        tone: rose
      - title: Une recommandation
        text: Proportionnée, avec limites
        tone: amber
```

Tant que la définition n'est pas acceptée, vous pouvez calculer un brouillon, vous ne l'envoyez pas. Jeudi est une contrainte réelle. Ce n'est pas une raison de changer la définition à 18 h parce qu'un autre découpage « fait plus baisser ».

# Vérifier le constat, puis le localiser

Vous partez d'une table certifiée, `mart_commandes`, une ligne par commande payée, et `mart_clients` pour la date de première commande. Première requête : le taux par cohorte mensuelle, année N et N−1, France, clients identifiés. Vous contrôlez les volumes de premières commandes (une chute du **dénominateur** n'est pas une chute du taux) et l'unicité de `commande_id`.

Le constat, dans ce cas fictif mais réaliste, est le suivant. Cohortes mars à mai 2026 : réachat à 90 jours **17,7 %**, contre **22 %** un an plus tôt. Le dénominateur, lui, a augmenté : plus de nouveaux clients identifiés. Le total des commandes de l'enseigne n'a pas chuté autant que le taux. Vous n'écrivez donc pas « les ventes s'écroulent ». Vous écrivez « les nouveaux clients identifiés reviennent moins ».

Deuxième couche, prévue dans les hypothèses : le **canal d'acquisition** et la présence du code −30 %.

| Cohorte mars à mai | Clients | Réachat 90 j |
|---|---|---|
| N−1, tous canaux | 80 000 | 22 % |
| N, sans code −30 % | 70 000 | 21 % |
| N, avec code −30 % | 40 000 | 12 % |
| N, ensemble | 110 000 | 17,7 % |

Le « 17,7 % » est un **mélange**. Hors code, on est à 21 %, proche de l'an passé. Avec le code, à 12 %. Le taux global baisse surtout parce que le mélange a changé et parce que ce segment-là est bas. Vous vérifiez que ce n'est pas un artefact de premier panier (les clients au code achètent-ils des montants très différents ?) en regardant le réachat **à tranche de premier panier**. Dans ce cas, l'écart reste dans chaque tranche : ce n'est pas seulement « ils ont acheté moins cher ».

Côté ruptures, vous regardez si les clients **sans** code ont aussi décroché dans les familles en rupture. Ici, non : leur taux tient. L'hypothèse 2 passe au second plan. Côté tracking, les volumes de commandes identifiées collent au pont finance à 0,6 % : l'hypothèse 3 ne porte pas l'écart d'environ 4 points. Vous le notez, vous ne l'effacez pas.

```sql
-- Réachat à 90 jours, une ligne par client de la cohorte
-- première commande du mois M, seconde commande payée dans (J, J+90]
SELECT
  cohorte_mois,
  code_bienvenue_30,
  COUNT(*) AS clients,
  AVG(CASE WHEN jours_jusqu_au_second BETWEEN 1 AND 90 THEN 1.0 ELSE 0 END) AS taux_reachat
FROM cohortes_premier_achat
WHERE pays = 'FR'
  AND fenetre_complete
GROUP BY 1, 2;
```

En Python, le geste est le même : partir du grain client déjà contrôlé, pas réagréger des taux de fichiers mensuels. `pandas` ou `Polars` servent à joindre, filtrer les fenêtres incomplètes et produire le tableau. Ils ne servent pas à « corriger » à la main les 12 %.

# Le graphique qui porte la décision

Vous avez produit douze vues. Le comité n'en verra qu'une dans la note, deux au plus en annexe. Le graphique retenu doit rendre **visible le mélange**, puisque c'est le cœur du constat.

Un graphique en barres groupées, ou deux points par période, suffit : réachat à 90 jours, cohortes mars-mai, trois barres (N−1, N sans code, N avec code), l'effectif écrit sous chaque barre. Pas de double axe. Pas de courbe quotidienne qui trempe dans le bruit. Pas de camembert de la répartition des codes, qui dirait la composition sans dire le taux.

Le titre est une phrase : « Le réachat tient à 21 % hors code, il est à 12 % avec le code −30 %. » L'axe part de zéro. L'unité est « part des clients », pas un index 100 dont personne ne connaît la base. Une note sous le graphique rappelle : clients identifiés, France, HT, fenêtres de 90 jours complètes, mars à mai.

Vous mettez en annexe, pas dans le corps : la stabilité par tranche de panier, le contrôle tracking, la série mensuelle qui montre que le décrochage coïncide avec la montée en charge du code et non avec un mois isolé. Si quelqu'un demande « et les régions ? », vous avez regardé avant : l'écart code / sans code est du même sens dans les grandes régions, vous le dites en une ligne, vous ne transformez pas la note en atlas.

> [!TIP]
> Si le graphique a besoin d'un paragraphe pour être lu, ce n'est pas le graphique de la note. Revenez au tableau des trois chiffres. Un tableau clair bat une visualisation confuse.

# La recommandation proportionnée

Les faits soutiennent ceci : un segment précis, les clients acquis avec le code −30 %, réachète beaucoup moins, et il pèse assez (40 000 clients) pour tirer le taux global. Ils ne soutiennent pas : « le marketing d'acquisition ne sert à rien », « il faut arrêter les promotions », « le produit a perdu en qualité ».

Recommandation que vous pouvez signer.

- **Suspendre** l'usage généralisé du code −30 % à l'inscription, à une date proche, parce que chaque semaine supplémentaire recrute une cohorte que vous savez fragile sur le réachat observé.
- **Tester** un palier plus bas (−15 % contre pas de code) sur les nouveaux inscrits, avec pour primaire le réachat précoce **et** un garde-fou sur le volume d'inscrits. Vous n'avez pas prouvé la cause, vous avez un mécanisme crédible et un coût d'attente.
- **Ne pas** reconstruire toute la politique de prix sur ce seul indicateur. Le premier panier de ces clients existe encore : couper le code peut aussi couper des premières commandes. Le test sert à le mesurer. La suspension totale sans test serait déjà un cran trop fort si le code représente une part essentielle de l'acquisition. Ici, vous proposez la suspension du **palier −30 %**, pas de l'acquisition payante.

Le chiffrage reste un ordre de grandeur, séparé du taux. « Si les 40 000 clients avaient réacheté à 21 % au lieu de 12 %, cela ferait environ 3 600 secondes commandes de plus. Au panier médian observé de 45 € HT, de l'ordre de 160 k€ HT, **sans** en déduire que le code est la cause unique, et **sans** soustraire la marge du premier achat. » Vous montrez le calcul. Vous ne le transformez pas en « perte de 160 k€ prouvée ».

# Les limites, écrites avant qu'on vous les oppose

Une limite n'est pas une excuse. C'est ce qui borne la phrase d'ouverture.

- **Clients non identifiés.** Le ticket de caisse sans carte n'entre pas. Si les magasins ont poussé l'identification en même temps que le code, une partie du mouvement de dénominateur vient de là. Vous l'avez regardé : la part de commandes identifiées a bougé de 2 points, pas assez pour fabriquer l'écart entre 12 % et 21 %, mais assez pour être dite.
- **Pas de causalité complète.** Les clients au code n'ont pas été tirés au sort contre un jumeau sans code. Le test que vous proposez sert à ça. D'ici là, vous parlez d'association forte et localisée.
- **Fenêtre unique.** 90 jours n'est pas la valeur vie. Un client peut revenir à 6 mois. Vous ne le niez pas : vous dites que la décision de jeudi ne peut pas attendre la valeur à 12 mois, et qu'un suivi à 180 jours est prévu sur ces mêmes cohortes.
- **Marge incomplète.** Vous n'avez pas le coût du code ni la marge par commande au grain client. La recommandation est prudente justement pour cela : on ne « optimise » pas une marge qu'on n'a pas.
- **Un enseigne, un pays.** Vous ne généralisez pas à l'international.

Vous n'ajoutez pas de limite vague (« toute analyse a ses biais ») qui ne change rien. Chaque limite ci-dessus dit ce qu'elle **empêche** de conclure.

# Exercices

## Exercice 1 : Tenir le cadrage

Le directeur marketing répond à votre demi-page : « 90 jours c'est trop long, prenez 14 jours pour les cohortes de septembre et d'octobre, comme ça on a un chiffre plus récent, et incluez les non identifiés en magasin, mettez-les dans le réachat à zéro s'ils n'ont pas de carte. » Que gardez-vous, que refusez-vous, et quelle alternative proposez-vous pour jeudi ?

<details>
<summary>Voir la solution</summary>

Vous gardez la définition à 90 jours sur les cohortes **mûres** (mars à mai, ou jusqu'au dernier mois dont les 90 jours sont complets). Un taux à 14 jours est un **autre** indicateur, utile comme signal précoce, à montrer à part s'il raconte la même histoire, pas à substituer en silence.

Vous refusez de compter les non identifiés comme des réachats à zéro : vous ne savez pas s'ils sont revenus sans carte. Les mettre au dénominateur fabrique une baisse mécanique dès que l'identification varie. Vous les laissez hors taux, et vous donnez à côté la part de commandes identifiées.

Pour jeudi : le taux 90 jours mars-mai, le découpage avec / sans code, et, en signal, le taux 14 jours des cohortes récentes **identifiées**, étiqueté comme précoce et non comparable au 90 jours.

</details>

## Exercice 2 : Lire le mélange

Reprenez le tableau du cours : N−1 22 % (80 000), N sans code 21 % (70 000), N avec code 12 % (40 000). Un collègue dit : « le réachat a perdu 5 points, il faut revoir la qualité produit sur toute l'enseigne. » Calculez le taux global de N et répondez en trois phrases.

<details>
<summary>Voir la solution</summary>

Taux global N = (70 000 × 0,21 + 40 000 × 0,12) / 110 000 = (14 700 + 4 800) / 110 000 = 19 500 / 110 000 = **17,7 %**. L'écart au 22 % est de **4,3 points**, pas cinq, et il n'est pas réparti sur toute l'enseigne.

Réponse : le taux global baisse d'environ 4 points, mais les clients sans code sont à 21 %, proches de l'an passé. L'écart se concentre sur les 40 000 clients au code −30 % (12 %). Une revue « qualité produit sur toute l'enseigne » n'est pas la décision que ce tableau soutient. Le sujet à porter au comité est ce code, pas l'ensemble du catalogue.

</details>

## Exercice 3 : Une recommandation trop grande

On vous demande d'écrire : « Le code −30 % a détruit 160 k€ de réachat, supprimons toutes les promotions d'acquisition. » Réécrivez la recommandation et la phrase de chiffrage, au niveau de preuve du cas.

<details>
<summary>Voir la solution</summary>

« Recommandation : arrêter le palier −30 % pour les nouveaux inscrits France à compter de lundi, et lancer un test −15 % contre absence de code, primaire : réachat à 14 jours puis à 90 jours, garde-fou : nombre d'inscrits et premier panier. Ne pas étendre la décision aux autres mécaniques promotionnelles.

Chiffrage : l'écart entre 12 % et 21 % sur 40 000 clients représente environ 3 600 secondes commandes. À 45 € HT de panier médian, c'est de l'ordre de 160 k€ HT de commandes **observées en moins** par rapport au taux hors code. Ce n'est pas une perte causale prouvée, et la marge du premier achat n'est pas déduite. Le test sert à mesurer ce que la suspension fait vraiment au volume d'inscrits. »

Vous ne signez pas « détruit » ni « toutes les promotions ».

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: D'un brief à un livrable
center: "Cadrez la définition, localisez l'écart, puis recommandez seulement ce que le mélange autorise."
points:
  - icon: compass
    title: Cadrage écrit
    text: Fenêtre, population, comparatif annuel, hypothèses avant l'exploration.
  - icon: database
    title: Constat puis lieu
    text: Le taux global d'abord, le segment qui le tire ensuite. Contrôlez le dénominateur.
  - icon: chart
    title: Un graphique
    text: Trois barres qui montrent le mélange. Le reste de l'exploration reste en annexe.
  - icon: target
    title: Proportion
    text: Suspendre ce code et le tester. Pas toute la politique commerciale.
  - icon: alert
    title: Limites utiles
    text: Non identifiés, causalité, marge, fenêtre. Chacune borne une phrase précise.
pitfall: Changer la fenêtre à 14 jours la veille du comité pour avoir un chiffre « plus récent ».
remember: Un taux global qui baisse peut être un mélange. Trouvez le segment avant de condamner l'enseigne.
```
