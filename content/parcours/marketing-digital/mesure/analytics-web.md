---
title: Analytics web
description: "Lire une session, une source, un événement et une conversion, et dire ce qu'un pixel ne prouve pas sur les ventes de bougies Lumen."
duration: 60
objectives:
  - "Distinguer session, source, événement et conversion sans les empiler"
  - "Rattacher une visite à un canal sans croire que le canal a tout fait"
  - "Compter une commande payée, pas une page vue, comme conversion"
  - "Lister ce que le pixel ignore, à commencer par la marge et les refus de cookies"
---

# Quatre mots, quatre objets

L'interface d'analytics empile des courbes. Pour l'Atelier Lumen, quatre mots suffisent, et les mélanger fait prendre une visite pour une vente.

Une **session**, c'est une visite. Quelqu'un arrive, regarde une bougie à 42 €, part, revient le soir : selon l'outil et le temps passé, cela peut faire une ou deux sessions. Ce n'est pas une personne fiable. Le même client sur son téléphone puis sur son ordinateur compte souvent pour deux.

Une **source**, c'est l'étiquette du tuyau : recherche payante, social payant, e-mail, accès direct, recherche non payée. Elle dit par quelle porte la session est entrée. Elle ne dit pas que cette porte a convaincu. Nora peut envoyer un e-mail à quelqu'un qui avait déjà décidé, après avoir vu une annonce search la veille.

Un **événement**, c'est un fait nommé sur le site. Vue de la fiche, ajout au panier, début de paiement, commande payée. Sans nom, vous n'avez qu'un total de pages, et un total de pages ne paie pas Samir.

Une **conversion**, pour Lumen, c'est **une commande payée**. Pas une fiche vue. Pas un ajout au panier. Le panier moyen de référence est **42 €**, la marge **60 %**. Une conversion « ajout au panier » gonfle les réussites et ne laisse pas 25,20 €.

# La source se pose, elle ne se devine pas

Vous ne lirez la source que si les liens la portent. Un lien d'e-mail de Nora sans étiquette arrive souvent en « direct » : la visite a l'air spontanée, l'e-mail a l'air inutile, et vous coupez le mauvais canal. Un lien de pub search doit dire search, un lien social doit dire social. Le nom exact importe moins que la stabilité. Changer le nom des étiquettes en cours de route casse la comparaison des semaines.

Trois portes, pas trente, pour une équipe de quatre.

- Search payant.
- Social payant.
- E-mail (newsletter, abandon, réachat), séparé du direct.

Le direct et la recherche non payée existent. Vous les voyez. Vous ne leur attribuez pas le budget de 8 000 € : ce budget n'est pas le leur. Les mélanger avec le payant pour « faire un beau total » cache un CPA.

Léa regarde la caisse : commandes et euros encaissés. Vous regardez les sources. L'écart entre les deux est une information, pas un choix. Si l'outil compte 40 commandes et la caisse 28, l'argent se pilote avec 28.

> [!TIP]
> Avant de croire une source, cliquez vous-même le lien de l'e-mail et celui de l'annonce. Si vous arrivez « direct », le tableau mentira de la même façon pour les clients.

```diagram
type: flow
title: "De la visite à l'euro, sans sauter d'étape"
steps:
  - title: "Session"
    text: "Une visite. Pas une personne, pas une vente."
    tone: violet
  - title: "Source"
    text: "La porte, search, social ou e-mail, si le lien est étiqueté."
    tone: blue
  - title: "Événement"
    text: "Fiche, panier, paiement. Des faits nommés, pas un total de pages."
    tone: amber
  - title: "Conversion"
    text: "Commande payée. 42 € de référence, 25,20 € de marge avant pub."
    tone: teal
```

# Ce qu'on compte comme conversion, et ce qu'on laisse en entonnoir

L'entonnoir sert à voir **où** ça décroche. Il ne sert pas à déclarer victoire.

Exemple sur 1 000 sessions étiquetées search. 400 voient une fiche. 80 ajoutent au panier. 25 paient. La conversion qui compte est **25**, pas 80, pas 400. Si ces 25 ont payé 42 €, le chiffre d'affaires outil est 1 050 €, la marge avant pub 630 €. Vous ne divisez la dépense que par 25 pour le CPA. La diviser par 80 fabrique un « coût par panier » qui n'a pas été encaissé.

Les 55 ajouts non payés intéressent Nora (le scénario d'abandon, s'il y a une adresse) et vous (la page de paiement). Ils ne sont pas des commandes. Les appeler conversions dans l'objectif publicitaire apprend à la régie à chercher des ajouts au panier, pas des paiements. Vous l'avez vu : la régie optimise l'événement coché.

Un remboursement n'est plus une conversion utile. Si l'outil ne le retire pas, la caisse, elle, le retire. Une fois par semaine, Samir ou Léa dit les colis revenus. Vous n'ajustez pas au centime. Vous ajustez si les retours se concentrent sur la bougie que la pub pousse.

```video
url: https://www.youtube.com/watch?v=Fl5OcKM22Ro
title: "UTM parameters in Google Analytics 4 || GA4 campaign tracking with UTMs"
channel: "Analytics Mania - Google Analytics & Tag Manager"
duration: "13:29"
lang: en
why: "Analytics Mania montre comment poser des paramètres UTM et les retrouver dans Google Analytics 4, la règle centrale de ce chapitre : la source se pose, elle ne se devine pas."
```

# Ce qu'un pixel ne prouve pas

Le pixel est un petit messager. Il dit à la régie ou à l'analytics qu'un fait a eu lieu dans ce navigateur. Il est utile. Il n'est pas un témoin.

Il ne prouve pas :

- que la publicité a **causé** la commande (la personne allait peut-être acheter quand même) ;
- la **marge** de 60 %, qu'il ne connaît pas ;
- le **prix réellement payé** si un code a fait 33,60 € et que l'événement envoie encore 42 € ;
- les visiteurs qui ont **refusé** les cookies de mesure : ils peuvent acheter quand même, et le pixel ne les voit pas ;
- qu'une session égale une personne ;
- qu'une impression a été **regardée**.

Conséquence pratique. Un canal « à zéro » dans l'outil peut avoir vendu chez ceux qui refusent la mesure. Vous ne le déclarez pas gagnant pour autant : vous le dites, et vous retournez à la caisse. Un canal très beau dans l'outil, qui envoie 42 € alors que Nora a mis un code, est faux dans l'autre sens. Le pixel confirme un événement technique. **Léa confirme l'euro.**

> [!WARNING]
> Ne cochez pas « achat » sur un pixel qui part au moment de l'ajout au panier. Vous paierez des CPA imbattables, et la caisse ne suivra pas.

# Ce que l'équipe regarde le lundi, pas plus

Quatre personnes, un quart d'heure. Pas un audit.

1. Commandes payées dans la caisse, et euros encaissés, depuis lundi dernier.
2. Les mêmes commandes vues par l'outil, par source, avec l'écart.
3. Dépense search et dépense social sur la même période.
4. Un événement d'entonnoir seulement s'il y a un problème (les paiements chutent, les ajouts tiennent).

Vous n'ouvrez pas douze rapports « pour voir ». Le chiffre qui n'a pas de décision prévue reste fermé. Le tableau du chapitre dédié mettra six lignes, pas davantage. L'analytics fournit les faits. Il ne choisit pas s'il faut couper à 25 € de CPA : ça, c'est la règle de marge, écrite à l'avance.

Si un chiffre a plus de sept jours de retard, il ne sert pas à augmenter un budget aujourd'hui. La fraîcheur fait partie de la mesure. Une courbe de mars ne dit pas si le groupe de cette semaine mange la marge.

# Exercices

## Exercice 1 : Quel mot ?

Associez. A. Deux visites du même client, téléphone puis ordinateur. B. Le lien de Nora arrive sans étiquette et l'outil dit « direct ». C. 80 personnes ajoutent la bougie au panier, 25 paient. D. Léa lit 1 050 € encaissés. Quel objet est chaque lettre, et où est la conversion ?

<details>
<summary>Voir la solution</summary>

A éclaire la session : deux sessions possibles, une seule personne. On ne dit pas « deux clients ».

B éclaire la source. Le canal e-mail est mal étiqueté, pas absent. Vous corrigez le lien avant de conclure que Nora ne sert à rien. En attendant, vous ne déplacez pas son budget vers le social sur la foi de ce « direct ».

C est l'entonnoir. L'événement ajout au panier vaut 80. La conversion, commande payée, vaut 25. Le CPA se calcule sur 25.

D est l'euro, côté caisse. 25 fois 42 font 1 050 €, marge avant pub 630 €. Si la caisse dit un autre montant, c'est elle qui gagne pour l'argent, et vous cherchez l'écart (code, retour, pixel trop tôt).

</details>

## Exercice 2 : Le pixel trop tôt

La régie affiche un CPA de 9 € sur « achats ». Samir n'a expédié que 10 commandes. L'outil en annonce 40. Le pixel est branché sur le bouton « ajouter au panier ». Dépense de la semaine : 360 €. Que vaut le CPA réel, et que corrigez-vous ?

<details>
<summary>Voir la solution</summary>

CPA réel sur les expéditions : 360 / 10 = 36 €, au-dessus de 25 €. Les 9 € sont un coût par ajout au panier, mal nommé achat. Marge des 10 commandes, si elles sont à 42 € : 252 €. La pub à 360 € perd déjà de l'argent.

Vous déplacez l'événement vers la commande payée, vous ne scalez pas, et vous ne félicitez pas le canal. Les ajouts restent un événement d'entonnoir, pas une conversion. Tant que le pixel ment, la règle des 400 € se lit sur la caisse, pas sur l'écran de la régie.

</details>

## Exercice 3 : Ce que vous ne conclurez pas

30 % des visiteurs refusent les cookies de mesure. Le social affiche peu de commandes. Le search en affiche beaucoup. Un collègue veut couper le social « puisque le pixel le dit ». Que répondez-vous, sans inventer que le social est rentable ?

<details>
<summary>Voir la solution</summary>

Le pixel ne voit pas une partie des achats. Couper seulement parce qu'il est silencieux peut être faux. Le déclarer rentable serait faux aussi : l'absence de preuve n'est pas une preuve inverse.

Vous comparez à la caisse et aux codes promo ou aux pages d'arrivée, sur sept jours frais. Vous dites l'incertitude. Vous n'augmentez pas le social sur un trou de mesure. Vous ne le tuez pas non plus le lundi si la dépense est encore sous les 400 € et si vous n'avez pas séparé les commandes. La décision de coupure reste celle de la marge, sur des commandes encaissées, pas sur un pixel incomplet.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Analytics, quatre mots"
center: "Session, source, événement, conversion. Seule une commande payée compte, et le pixel ne prouve ni la marge ni la cause."
points:
  - icon: eye
    title: "Session"
    text: "Une visite, pas une personne. Téléphone puis ordinateur font souvent deux sessions pour un client."
  - icon: link
    title: "Source"
    text: "Search, social, e-mail. Sans étiquette sur le lien, l'e-mail de Nora arrive en direct et le tableau ment."
  - icon: list
    title: "Événement"
    text: "Fiche, panier, paiement. L'entonnoir montre où ça décroche. Il ne déclare pas la victoire."
  - icon: check
    title: "Conversion"
    text: "La commande payée. 25 paiements, pas 80 paniers. Le CPA ne se divise pas par les ajouts."
  - icon: alert
    title: "Le pixel"
    text: "Il ignore la marge, le code, les refus de cookies et la cause. Léa confirme l'euro en caisse."
pitfall: "Cocher achat sur le bouton ajouter au panier, puis couper un canal parce que le pixel ne le voit pas."
remember: "Quatre mots, une conversion, la caisse. Un chiffre de plus de sept jours ne sert pas à augmenter un budget."
```
