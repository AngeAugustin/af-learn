---
title: "Choisir les métriques du produit"
description: "Tenir une north star Halte sur la promesse affichée et tenue, poser des garde-fous de qualité, de coût et de satisfaction, et écarter les métriques de vanité."
duration: 60
objectives:
  - "Formuler une north star qui monte seulement si Halte montre une promesse et la tient"
  - "Poser trois garde-fous : qualité, coût pour le magasin, satisfaction"
  - "Reconnaître une métrique de vanité, même quand elle progresse"
  - "Lire le trio ensemble, sans laisser un chiffre unique rassurer"
---

# Une north star pour Halte

Vous avez besoin d'un chiffre qui dit si le produit avance, pas si l'équipe a été occupée. Ce chiffre s'appelle souvent **north star**. Pour Halte, le résultat n'est ni « livrer l'écran », ni « ouvrir l'application ». C'est une commande dont la promesse a été dite, puis tenue.

**Part des commandes pour lesquelles Halte a affiché une promesse et l'a tenue.** Le dénominateur est toutes les commandes. Le numérateur ne compte que celles où une date ou un créneau était affiché **et** où ce qui était affiché a été fait.

Ne rien afficher ne la fait pas monter. Afficher 19 h alors que le camion passe après ne la fait pas monter non plus. Les deux échecs de Halte restent visibles : une commande sur deux sans date, et, quand une date existe, 18 % de ratés. Le retrait « en deux heures », prêt à temps dans 61 % des cas seulement, pèse dans le même chiffre s'il fait partie des commandes. Vous ne voulez pas qu'un tableau flatteur en cache un.

Vous ne prenez pas deux north stars. « Promesses tenues » et « satisfaction » au même rang vous laisseront choisir celle qui arrange. La satisfaction est un garde-fou. L'étoile est la promesse affichée et tenue.

> [!IMPORTANT]
> Si le chiffre peut monter alors que Karim garde encore Lina au hasard, ou que le client s'organise sur une heure fausse, ce n'est pas la north star.

# Trois garde-fous

Une étoile seule se truque sans mentir sur la fraction. On peut l'améliorer en n'affichant plus que des créneaux très larges, vrais et inutiles. On peut la faire monter parce que Karim compense : il appelle, il garde Lina, il rattrape. Les garde-fous ont le droit de dire **stop**.

**Qualité.** La part des promesses affichées qui ne sont pas tenues. Vous la regardez à part, pour ne pas confondre « on affiche moins » et « on affiche juste ». Si elle monte, vous n'élargissez pas.

**Coût pour le magasin.** Pas un suivi d'enveloppe : le prix du geste. Quelqu'un gardé pour rien après 19 h, un appel au transporteur que le oui ou non devait remplacer, un second passage pour un retrait qui n'était pas prêt. Si la tenue monte parce que Karim rattrape à la main, le produit n'a pas tenu.

**Satisfaction.** Deux côtés. Karim rouvre-t-il l'écran avant 17 h 30 le samedi suivant, sans qu'on le lui demande ? Le client se déplace-t-il encore pour rien, dans les retours qu'Inès lit ? Un sourire en visite ne compte pas. Le geste du samedi suivant compte. Les réclamations, autour de 20 pour 1 000, sont un contexte : elles ne remplacent pas l'étoile, et une baisse d'août due au volume plus faible n'est pas une victoire.

Les garde-fous ne se moyennent pas avec l'étoile. Une ligne rouge arrête l'élargissement.

| Famille | Question | Ce qui ne compte pas |
|---|---|---|
| North star | Promesse affichée et tenue, sur toutes les commandes | Écrans livrés, magasins « couverts » |
| Qualité | Parmi les promesses affichées, combien rompues | Le silence compté comme une réussite |
| Coût magasin | Personne gardée pour rien, appels, second passage | Une enveloppe de projet déconnectée du samedi |
| Satisfaction | Il rouvre avant 17 h 30, le client ne se déplace plus pour rien | « Ils avaient l'air contents » après la démo |

# La vanité des téléchargements

Une métrique de vanité monte, se raconte, et ne dit pas si la promesse est tenue.

Les téléchargements de l'application magasin en font partie. Quarante installations peuvent vouloir dire que le lien est parti. Elles ne disent pas que Karim ouvre avant 17 h 30, ni le matin avant de préparer les retraits. Une application installée et ouverte à 18 h 50 est un échec qui ressemble à un lancement.

D'autres vanités, ici :

- le nombre d'écrans livrés ;
- les vues de la page livraison, y compris celles qui repartent faute de créneau crédible ;
- le nombre d'heures précises proposées, facile à gonfler avec des heures fausses ;
- les magasins « activés » au sens « on leur a envoyé le lien ».

Vous pouvez noter l'installation dans un coin. Vous n'ouvrez pas la semaine avec elle. « Les téléchargements montent, donc le produit prend » est la phrase interdite.

```diagram
type: compare
title: "Ce que le chiffre a le droit de dire"
columns:
  - title: North star
    tone: violet
    items:
      - "Promesse affichée et tenue"
      - "Le silence ne la fait pas monter"
      - "L'heure fausse non plus"
  - title: Garde-fous
    tone: amber
    items:
      - "Promesses rompues"
      - "Lina gardée pour rien, appels"
      - "Ouverture avant 17 h 30"
  - title: Vanité
    tone: rose
    items:
      - "Téléchargements seuls"
      - "Écrans livrés, pages vues"
      - "Lien envoyé, appelé activation"
```

```video
url: https://www.youtube.com/watch?v=zIwrgnT498E
title: "What are Pirate Metrics? AARRR framework in 3 minutes"
channel: "Product Chat"
duration: "3:33"
lang: en
why: "Les métriques pirates (AARRR) résumées en trois minutes, une grille utile pour choisir une north star et ses garde-fous."
```

# Lire le trio, pas le meilleur chiffre

Chaque semaine, sur les pilotes, le même ordre. La north star. La part de promesses rompues. Le coût (quelqu'un gardé pour rien, appels qu'Inès ou Karim passent encore). Le fait que l'écran ait été ouvert avant 17 h 30 les samedis où la décision se posait, et le matin avant la préparation des retraits.

Vous n'annoncez pas le meilleur des quatre. Si l'étoile monte et que les promesses rompues montent aussi, vous n'avez pas un succès avec une réserve. Si l'étoile est stable et que Karim ouvre à 18 h 50, la règle ne vit pas à l'heure du job.

Sur quelques pilotes et deux semaines, un pic de promotion ne prouve pas le réseau. Trop tôt pour conclure sur quarante magasins. Pas trop tôt pour voir que Villeneuve n'ouvre pas à l'heure. Le trio se fixe avant la release. Le changer parce que les téléchargements sont plus flatteurs, c'est choisir la vanité après les données.

> [!WARNING]
> Un téléchargement par magasin peut coexister avec une ouverture à 18 h 50, Lina déjà gardée. Si vous ne montrez que le téléchargement, vous annoncez un produit qui n'a pas eu lieu.

# Exercices

## Exercice 1 : L'étoile trop gentille

On propose comme north star la part des promesses affichées qui sont tenues, en sortant du calcul les commandes sans date. Le chiffre devient plus confortable, parce qu'une commande sur deux disparaît du dénominateur. L'acceptez-vous ?

<details>
<summary>Voir la solution</summary>

Non, pas comme étoile. Cette fraction peut monter alors que Halte n'affiche toujours rien sur la moitié des commandes. Elle est utile comme garde-fou qualité : parmi ce qu'on a osé afficher, combien tient.

Vous gardez toutes les commandes au dénominateur. Le numérateur exige affiché et tenu. Les deux chiffres ne se remplacent pas.

</details>

## Exercice 2 : La semaine des téléchargements

Les quarante magasins ont installé l'application. Le tableau titre « adoption : 100 % ». Sur les pilotes, Karim n'a ouvert l'écran qu'une fois, devant vous, à 18 h 50. Comment reformulez-vous ?

<details>
<summary>Voir la solution</summary>

Vous retirez « adoption : 100 % » du titre. L'installation est un préalable. Vous montrez la north star des pilotes, la part de promesses rompues, et les ouvertures avant 17 h 30 sans votre présence.

Le 100 % peut rester en note : le lien est installé. Il ne dit pas que Lina a été gardée à bon escient, ni que le client a une heure honnête.

</details>

## Exercice 3 : La tenue qui coûte le samedi

La part de commandes avec promesse affichée et tenue monte. En parallèle, Karim garde encore quelqu'un un samedi sur deux, et il appelle le transporteur avant de croire l'écran. Faut-il élargir ?

<details>
<summary>Voir la solution</summary>

Non. L'étoile monte, le garde-fou de coût est franchi. La tenue est rattrapée par un humain. Élargir, c'est demander le même rattrapage aux autres magasins.

Vous cherchez pourquoi l'écran n'a pas remplacé l'appel : signal trop tard, ouvert après 17 h 30, oui illisible. Vous corrigez avant d'élargir. Les garde-fous ne se moyennent pas avec l'étoile.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: L'étoile et les garde-fous
center: "North star : promesse affichée et tenue, sur toutes les commandes. Qualité, coût, satisfaction arrêtent. Les téléchargements ne disent pas."
points:
  - icon: target
    title: North star
    text: "Affiché et tenu. Ne rien dire ne fait pas monter le chiffre. Dire 19 h à tort non plus."
  - icon: shield
    title: Qualité
    text: "Parmi les promesses osées, combien rompues. Empêche de confondre silence et réussite."
  - icon: gauge
    title: Coût magasin
    text: "Lina gardée pour rien, appels, second passage. Pas une enveloppe. Un humain qui rattrape n'est pas le produit."
  - icon: users
    title: Satisfaction
    text: "Il rouvre avant 17 h 30 sans qu'on le demande. Le client ne se déplace plus pour rien."
  - icon: chart
    title: Vanité
    text: "Téléchargements, écrans livrés, pages vues, lien envoyé. On peut les noter. On n'ouvre pas la semaine avec eux."
pitfall: "Titrer « adoption 100 % » parce que l'application est installée, alors que Karim n'a ouvert qu'à 18 h 50, devant vous."
remember: "Lisez l'étoile et les trois garde-fous dans le même ordre. Le meilleur des quatre n'est pas le récit de la semaine."
```
