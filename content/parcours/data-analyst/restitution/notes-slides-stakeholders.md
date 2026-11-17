---
title: Notes et slides pour les décideurs
description: "Rédiger une note d'une page avec la recommandation en tête, ranger la méthode en annexe, tenir un comité en peu de slides, répondre à une question hostile et dire explicitement ce que l'on ne sait pas."
duration: 55
objectives:
  - Structurer une note de décision dont la recommandation tient en tête de page
  - Séparer le résultat, la méthode et les limites pour deux lectures différentes
  - Préparer un comité avec peu de slides, une idée chacune
  - Répondre à une question hostile sans inventer ni élargir la conclusion
---

# La note d'une page

Une note de décision se lit en cinq minutes par quelqu'un qui a trois autres sujets dans l'heure. Si la recommandation est au milieu de la page 3, elle ne sera pas lue, ou elle sera remplacée par la capture que chacun a préférée.

Tenez **une page** pour le corps, annexes à part. Structure qui marche pour une enseigne, un produit ou une opération :

1. **Recommandation**, en deux ou trois lignes, avec le geste et l'échéance. « Suspendre le code −30 % dès lundi 24, et lancer un test à −15 % sur la moitié des nouveaux inscrits pendant trois semaines. »
2. **Pourquoi**, un seul argument principal, chiffré. « Le taux de seconde commande à 90 jours est passé de 22 % à 14 % sur la cohorte acquise avec ce code, à premier panier comparable. L'écart représente environ 180 k€ de commandes en moins sur le trimestre, ordre de grandeur. »
3. **Ce que vous avez vérifié**, trois puces : définition, période, contrôle qui écarte l'incident de données.
4. **Décision demandée**, oui ou non, à qui, pour quand.
5. **Ce qui ferait changer d'avis**, une ligne. « Si le réachat à 90 jours de la cohorte de septembre, encore incomplète, revient au-dessus de 20 % à périmètre égal, on rediscute. »

Le titre est la recommandation, pas « Analyse réachat ». « Suspendre le code −30 % : le réachat à 90 jours décroche » oriente même celui qui ne lit que l'objet du message.

> [!IMPORTANT]
> Une page n'est pas un résumé flou. C'est le même chiffre que dans l'annexe, avec moins de chemins pour y arriver. Si le chiffre de la page et celui de l'annexe divergent, la note n'est pas prête.

Écrivez pour une personne qui n'était pas dans vos fichiers. Pas de nom de table, pas de « cf. le notebook ». Le nombre est accompagné de son périmètre en une incise : « clients identifiés, France, commandes payées HT, cohortes de mars à juin 2026 ».

# La recommandation en tête

Mettre la recommandation en tête ne veut pas dire exagérer. Cela veut dire assumer le geste que les faits soutiennent, y compris le geste « ne rien changer » ou « ne pas décider encore ».

Trois recommandations acceptables, selon la solidité :

- **Agir.** Le constat est assez propre, le coût de l'attente est clair, le geste est réversible ou borné. Vous dites quoi faire lundi.
- **Tester.** Vous avez un mécanisme crédible mais pas de causalité. Vous proposez l'expérience, la métrique, la durée, pas un déploiement général.
- **Attendre une donnée.** La fenêtre est censurée, l'incident qualité n'est pas clos, le mois n'est pas comparable. Vous dites quelle date rendra la lecture possible, et ce qu'il ne faut pas décider d'ici là.

Une recommandation faible ressemble à : « il serait intéressant d'envisager une réflexion sur la promotion ». Personne ne sait quoi voter. Une recommandation trop forte ressemble à : « la promotion a détruit la marque, il faut arrêter tout le marketing ». Les faits montraient un écart de réachat sur un code, pas un effondrement de marque.

```diagram
type: decision
title: Quelle phrase mettez-vous en tête ?
nodes:
  - question: La définition, la période et le volume tiennent-ils ?
    yes: Vous pouvez chiffrer le constat
    no: Tête de note, on ne décide pas sur ce chiffre
  - question: Avez-vous un contre-factuel crédible ?
    yes: Recommander un geste, avec son périmètre
    no: Recommander un test ou une limite, pas une cause
```

Le premier paragraphe contient le verbe d'action, le périmètre, et le chiffre qui le porte. Le reste de la page n'est là que pour qu'on puisse vous croire sans ouvrir l'annexe, ou choisir de l'ouvrir.

```video
url: https://www.youtube.com/watch?v=r5_34YnCmMY
title: "Telling Stories with Data in 3 Steps (Quick Study)"
channel: "Harvard Business Review"
duration: "4:47"
lang: en
why: "La Harvard Business Review résume en trois étapes comment raconter une histoire avec des données devant des décideurs."
```

# Les annexes de méthode

L'annexe n'est pas une punition pour les gens rigoureux. C'est l'endroit où un contrôleur de gestion, un pair ou vous-même dans six mois retrouvez la définition sans relire dix fils de discussion.

Une annexe courte suffit.

- **Définitions.** Numérateur, dénominateur, grain, exclusions (comptes test, TVA, commandes annulées, fenêtres incomplètes).
- **Périmètre et période.** Pays, canal, dates, et pourquoi ces dates (deux mois pleins, hors soldes).
- **Source.** Table certifiée, heure d'extraction, rapprochement avec un total finance si vous en avez fait un.
- **Contrôles.** Volumes, clés, ce que vous avez écarté et pourquoi (trois jours d'incident de tracking, déjà signalé).
- **Ce que vous n'avez pas fait.** Pas de test aléatoire, pas de données concurrents, pas de coût marketing complet.

Vous n'y collez pas le notebook entier. Vous y mettez de quoi **refaire le chiffre principal** : la requête ou la règle, et le total de contrôle. Une annexe que personne ne peut rejouer est un récit, pas une méthode.

Si un chiffre a été ajusté (retrait d'un magasin sinistré, changement de périmètre), l'ajustement est dans l'annexe **et** en une ligne dans la page, pas seulement dans une cellule colorée de votre classeur.

# Des slides pour un comité

Le comité n'a pas le temps de votre enquête. Il a le temps de la décision. Comptez **cinq à huit slides**, une idée par slide, la recommandation sur la première.

1. Décision demandée et recommandation.
2. Le chiffre qui la porte, avec la comparaison juste (cohorte contre cohorte, pas décembre contre novembre).
3. Le mécanisme proposé, en une phrase, et ce qui le rend plausible (le décrochage est concentré sur le code −30 %, pas sur toute l'enseigne).
4. Les options écartées, chacune avec sa raison (baisser tous les prix, ne rien faire, attendre Noël).
5. Limites et ce que vous ne savez pas.
6. La question posée au comité, formulée pour qu'on puisse dire oui ou non.

Le titre de chaque slide est une **phrase**, pas une étiquette. « Le réachat passe de 22 % à 14 % sur le code −30 % » se retient. « Résultats » ne se retient pas. Vous n'y mettez pas votre cheminement (« d'abord j'ai regardé le SQL, puis j'ai eu un doute »). Ce cheminement a sa place si quelqu'un le demande, pas en ouverture.

```diagram
type: flow
title: Ce que le comité voit, dans l'ordre
steps:
  - title: Le geste
    text: Quoi, pour qui, à partir de quand
    tone: amber
  - title: Le chiffre
    text: Une comparaison, un périmètre, une unité
    tone: blue
  - title: Le mécanisme
    text: Pourquoi cet écart, pas un autre
    tone: violet
  - title: Les limites
    text: Ce qui ferait changer la recommandation
    tone: rose
  - title: Le vote
    text: Une question fermée, un responsable
    tone: teal
```

Évitez les slides de secours masquées qui contredisent la recommandation, et les annexes de 40 graphiques que vous déroulerez « si on a le temps ». Vous en aurez trois, maximum, alignées avec la note. Un graphique par slide. S'il faut l'expliquer plus de vingt secondes, il n'est pas le bon.

# Une question hostile, et ce que l'on ne sait pas

Une question hostile n'est pas une agression à gagner. C'est souvent une peur (budget, territoire, chiffre déjà annoncé) déguisée en objection technique. Votre calme est un outil d'analyse.

Méthode courte, à voix haute.

1. **Reformuler** la question en plus étroit, pour être sûr de répondre à celle-là. « Vous me demandez si je peux affirmer que le code a **causé** la baisse, pas seulement si la baisse est là. »
2. **Répondre sur ce que vous savez.** Le constat, le périmètre, le contrôle. Puis vous vous arrêtez.
3. **Nommer le trou** sans le remplir. « Je n'ai pas de tirage au sort, donc je ne chiffre pas l'effet causal. Je ne l'invente pas pour que la slide tienne. »
4. **Proposer la suite** si elle existe. « On peut le tester sur les inscrits des trois prochaines semaines. D'ici là, je maintiens la recommandation de suspendre, parce que le coût d'attendre est dans la note. »

Vous ne répondez pas à une autre question plus facile, vous n'attaquez pas la personne (« comme je l'ai déjà dit »), et vous ne produisez pas un chiffre nouveau en séance. Un nombre calculé debout, sans dénominateur, devient le titre du compte rendu.

Préparez avant la réunion la liste **ce que l'on ne sait pas**, déjà écrite dans la note. Elle désamorce la plupart des attaques, parce que vous l'avez dite en premier.

- Fenêtre de 90 jours incomplète pour les cohortes récentes.
- Clients non identifiés absents du taux (tickets magasin sans carte).
- Marge non disponible au même grain : vous parlez de chiffre d'affaires, pas de profit.
- Aucune donnée concurrent : une baisse d'enseigne peut être une baisse de marché.

> [!WARNING]
> « Je ne sais pas » sans suite ressemble à un abandon. « Je ne sais pas **cela**, voici ce que je sais, voici ce qu'il faudrait pour répondre » est une analyse. Le comité peut décider avec une limite explicite. Il ne peut pas décider avec un faux chiffre.

Si l'on vous presse de choisir quand même (« allez, un ordre de grandeur »), séparez l'ordre de grandeur **déjà calculé** (celui de la note, avec sa fourchette) de l'estimation inventée. Vous pouvez rappeler la fourchette. Vous ne la resserrez pas pour faire plaisir.

# Exercices

## Exercice 1 : Remonter la recommandation

Voici l'ouverture d'une note : « Dans le cadre de nos travaux d'analyse, et après plusieurs itérations avec les métiers, il apparaît que différents indicateurs ont été observés à la baisse sur la période récente, ce qui pourrait interroger nos dispositifs promotionnels. » Le fond, que vous connaissez, est solide : réachat à 90 jours de 22 % à 14 % sur le code −30 %, cohortes mars à juin, France, clients identifiés. Réécrivez les cinq premières lignes.

<details>
<summary>Voir la solution</summary>

« Recommandation : suspendre le code de bienvenue −30 % à partir du 24 novembre, et le remplacer par un test −15 % contre 0 % sur les nouveaux inscrits France, pendant trois semaines.

Le taux de seconde commande à 90 jours est de 14 % pour les clients acquis avec ce code, contre 22 % pour les autres inscrits identifiés de mars à juin 2026, à premier panier comparable (clients identifiés, France, commandes payées HT). L'écart est concentré sur ce code, pas sur l'ensemble des canaux.

Décision demandée : accord de la direction commerciale avant vendredi. Nous ne prétendons pas avoir mesuré l'effet causal complet : la suspension limite le coût d'attente, le test le mesurera. »

La méthode (définition exacte du premier panier, requête, rapprochement) passe en annexe.

</details>

## Exercice 2 : Une question hostile

En comité, le responsable du paid media dit : « Votre analyse est biaisée, vous voulez juste couper mon budget. Tout le monde sait que sans promotion personne ne s'inscrit. Vous annoncez donc qu'on va perdre les inscrits ? » Répondez en quatre temps, sans nouveau chiffre.

<details>
<summary>Voir la solution</summary>

Reformuler : « La question est de savoir si je conclus qu'il faut couper l'acquisition, et si je prédis une chute des inscrits. »

Répondre : « Non. Je ne propose pas de couper le budget d'acquisition. Je propose de suspendre un code précis, −30 % à l'inscription, dont la cohorte réachète moins, et de tester un palier plus bas. Je n'ai pas mesuré ce qui se passerait s'il n'y avait plus aucune promotion. »

Trou : « Je ne connais pas le nombre d'inscrits de la semaine prochaine sans ce code. La note ne le chiffre pas. »

Suite : « Le test sur trois semaines donnera l'effet sur l'inscription **et** sur le réachat précoce, avec un garde-fou de volume. D'ici là, la recommandation reste limitée à ce code. »

Vous ne dites pas « votre canal est le problème », et vous n'inventez pas « on perdra 10 % d'inscrits ».

</details>

## Exercice 3 : Ce qui n'entre pas dans la slide

Vous avez huit graphiques dans le notebook : réachat par cohorte, par canal, par device, par région, distribution des paniers, heatmap, courbe quotidienne, et un camembert des codes promo. Le comité a 12 minutes. Quelles slides gardez-vous, et qu'est-ce qui reste en annexe même si vous y tenez ?

<details>
<summary>Voir la solution</summary>

Vous gardez : la slide de décision ; une comparaison du réachat (code −30 % contre le reste, ou par cohorte) avec le périmètre écrit sous le graphique ; une slide qui montre que l'écart est concentré sur ce code et pas « partout » ; une slide limites et question à voter.

Le device, la heatmap, la courbe quotidienne et le camembert restent en annexe, sauf si l'un d'eux **est** la preuve de concentration. Un graphique que vous aimez mais qui ne change pas le vote n'entre pas dans les 12 minutes. Le titre de la slide du chiffre est une phrase (« 14 % contre 22 % de réachat à 90 jours »), pas « Graphique 3 ».

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Notes et slides pour décider
center: "La recommandation s'écrit en premier, la méthode en annexe, le trou en toutes lettres."
points:
  - icon: file
    title: Une page
    text: Geste, chiffre, périmètre, décision demandée, ce qui ferait changer d'avis.
  - icon: target
    title: Tête de note
    text: Agir, tester ou attendre. Pas une invitation à « envisager une réflexion ».
  - icon: book
    title: Annexe
    text: Définition, source, contrôles, et de quoi refaire le chiffre principal.
  - icon: users
    title: Comité
    text: Cinq à huit slides, une phrase-titre, la décision sur la première.
  - icon: chat
    title: Question hostile
    text: Reformuler, répondre, nommer le trou, proposer la suite. Pas de chiffre inventé.
pitfall: Resserrer une fourchette en séance pour rassurer, alors que la note disait l'incertitude.
remember: Un comité peut voter avec une limite explicite. Il ne peut pas voter avec un chiffre improvisé.
```
