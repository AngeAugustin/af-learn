---
title: "Suivre le budget sans tenir la comptabilité"
description: "Chaque mois, lire le budget de la refonte livraison Halte : initial, engagé, consommé, reste à faire, prévision et écart."
duration: 40
objectives:
  - "Distinguer budget initial, engagé, consommé et reste à faire sur un même mois"
  - "Calculer la prévision à terminaison et l'écart du projet Halte"
  - "Remonter un écart qui change une décision, sans refaire la comptabilité"
  - "Garder la réserve visible au lieu de l'utiliser comme un tiroir"
---

# Quatre chiffres, et pas un relevé de comptes

Halte refond la livraison de ses **40 magasins**. La fenêtre va du 2 mars au 27 août 2027. L'enveloppe décidée le 28 février est de **180 000 €**. Elle paie l'extérieur : l'intégrateur Quai & Co, l'abonnement au transporteur Relais, la formation, le pilote, une réserve. Elle ne paie pas les salaires. Nadia (DSI) est là un jour par semaine, Marc (livraison) deux jours, le chef de projet à plein temps. Convertir ces jours en euros, les ventiler par centre de coût, calculer une TVA : ce n'est pas le travail du mois. Le contrôle de gestion le fait. Le chef de projet, lui, doit pouvoir dire si les 180 000 € suffiront encore le 27 août.

Quatre soldes suffisent.

| Solde | Question à laquelle il répond |
| --- | --- |
| Budget initial | Quelle enveloppe a été figée le 28 février ? |
| Engagé | Qu'est-ce qui est signé, même pas encore facturé ? |
| Consommé | Qu'est-ce qui est facturé ou déjà payé ? |
| Reste à faire | Que pense-t-on encore dépenser pour finir, commandé ou non ? |

Le budget initial ne se réécrit pas quand une dépense apparaît. On le garde comme mètre. L'engagé n'est pas le consommé : le contrat Quai & Co signe **110 000 €** le 28 février, alors que seules les factures des jalons acceptés sortent. Le reste à faire n'est pas « initial moins consommé » : c'est une estimation du travail qui reste, et elle peut être plus chère que ce que le budget avait imaginé.

> [!IMPORTANT]
> Prévision à terminaison = consommé + reste à faire. Écart = budget initial − prévision. Un écart négatif est un dépassement. On le dit avec le montant, pas avec une couleur seule.

# La photo du 31 mai

Fin mai, deux jalons sur six sont acceptés (cadrage le 31 mars, conception le 30 avril). Le jalon 3, la recette des 4 magasins pilotes, est refusé : 6 défauts bloquants. La photo d'argent, tenue le 31 mai, est celle-ci.

| Poste | Initial | Engagé | Consommé | Reste à faire |
| --- | ---: | ---: | ---: | ---: |
| Intégrateur Quai & Co | 110 000 | 110 000 | 55 000 | 55 000 |
| Abonnement Relais | 18 000 | 18 000 | 9 000 | 9 000 |
| Formation | 20 000 | 28 000 | 0 | 28 000 |
| Pilote et recette | 12 000 | 8 000 | 8 000 | 12 000 |
| Imprimantes d'étiquettes | 0 | 12 000 | 12 000 | 0 |
| Réserve non affectée | 20 000 | 0 | 0 | 6 000 |
| **Total** | **180 000** | **176 000** | **84 000** | **110 000** |

Lecture par ligne, sans recoder une facture.

L'intégrateur est engagé à 110 000 € dès la signature. Le consommé de 55 000 € correspond aux deux jalons acceptés : 22 000 € puis 33 000 €. Les 55 000 € qui restent au contrat ne sont pas « presque payés ». La facture du jalon 3, 33 000 €, n'est pas due tant que le jalon n'est pas accepté. La présence de Quai & Co en mai ne l'ajoute pas au consommé.

Relais est un abonnement de 3 000 € par mois sur six mois. Mars, avril et mai sont consommés (9 000 €). Juin, juillet et août restent à faire (9 000 €). Ici, engagé − consommé égale le reste à faire. Ce n'est pas une loi générale, c'est un hasard de cet abonnement.

La formation est l'inverse : bon de commande signé à **28 000 €** (8 sessions de 5 directeurs, au lieu de 6 sessions prévues à 20 000 €), rien encore facturé. Engagé 28 000, consommé 0, reste à faire 28 000.

Le pilote casse l'égalité. Les déplacements des 4 pilotes (Lille, Strasbourg, Nantes, Toulouse) sont engagés et consommés : 8 000 €. Le reste à faire est de **12 000 €**, pas de zéro. Ces 12 000 € sont la semaine de recette en plus, estimée, pas encore commandée. **Reste à faire n'est pas engagé moins consommé.**

Les imprimantes n'existaient pas le 28 février. 40 machines à 300 €, soit 12 000 €, commandées et livrées en mai. Engagé = consommé = 12 000 €, reste à faire nul. Le poste entier est une dérive.

La réserve initiale est de 20 000 €. On n'en a signé aucune ligne. On prévoit encore d'en garder 6 000 € non affectés. Ces 6 000 € sont dans le reste à faire parce qu'on veut les tenir jusqu'à août, pas parce qu'une commande existe.

# La prévision se lit à la fin

84 000 + 110 000 = **194 000 €** de prévision à terminaison.

180 000 − 194 000 = **−14 000 €**. On dépasse de 14 000 € l'enveloppe du 28 février, si l'on finit comme on le pense aujourd'hui et si l'on garde 6 000 € de coussin.

Le réflexe faux : « il reste 180 000 − 84 000 = 96 000 €, nous sommes larges ». Ce 96 000 € suppose que l'avenir coûtera exactement ce que le budget initial avait laissé. Le reste à faire dit autre chose : 110 000 €. L'écart entre les deux chiffres est de 14 000 €. C'est précisément le dépassement. Le calcul « initial − consommé » ne rassure pas. Il efface la dérive.

D'où viennent les 14 000 €, en ordre de grandeur :

- formation, +8 000 € (devis 28 000 au lieu de 20 000) ;
- imprimantes, +12 000 € (poste nouveau) ;
- pilote, prévision 20 000 € au lieu de 12 000 €, soit +8 000 € ;
- total des dérives, +28 000 € ;
- la réserve de 20 000 € en absorbe une partie, et l'on veut encore en garder 6 000 € ;
- il manque donc 14 000 €.

Trois options tiennent sur la note du comité du 1er juin. Le chef de projet les chiffre. Il n'en choisit pas une tout seul.

| Option | Prévision | Écart | Ce qu'on abandonne |
| --- | ---: | ---: | --- |
| A. Tenir le coussin et les travaux | 194 000 € | −14 000 € | Rien. Inès augmente l'enveloppe. |
| B. Revenir à 180 000 € | 180 000 € | 0 € | Le coussin de 6 000 € et 8 000 € de recette supplémentaire. |
| C. Travaux inchangés, coussin à zéro | 188 000 € | −8 000 € | Tout imprévu d'ici août. |

L'option B se vérifie : 194 000 − 6 000 − 8 000 = 180 000. Elle fait tenir le chiffre en retirant la semaine de recette dont les 6 bloquants auraient besoin. C'est un vrai arbitrage, pas une écriture.

```diagram
type: flow
title: "La photo du dernier jour du mois"
loop: "Mois suivant, les mêmes quatre soldes"
steps:
  - title: "Figer"
    text: "Initial inchangé. Engagé, consommé, reste à faire au 31 mai."
    tone: blue
  - title: "Prévoir"
    text: "84 000 + 110 000 = 194 000 € à terminaison."
    tone: violet
  - title: "Écarter"
    text: "180 000 moins 194 000, dépassement de 14 000 €."
    tone: rose
  - title: "Traduire"
    text: "Options A, B et C, chacune avec ce qu'elle retire."
    tone: amber
  - title: "Décider"
    text: "Le comité du 1er juin tranche. Le budget initial, lui, ne bouge pas."
    tone: teal
```

```video
url: https://www.youtube.com/watch?v=sAZZ5av9kk0
title: "What is Earned Value Management - EVM? PM in Under 5"
channel: "Online PM Courses - Mike Clayton"
duration: "5:53"
lang: en
why: "Mike Clayton explique la valeur acquise en moins de six minutes : comparer le prévu, le réalisé et le dépensé."
```

# Ce que le chef de projet ne devient pas

Le contrôle de gestion rapproche les factures, la TVA, l'imputation, parfois l'activation du connecteur au bilan. Le chef de projet n'ouvre pas le grand livre pour « vérifier ». Il a besoin de trois choses, et il les demande.

1. Le consommé du mois **rattaché aux postes du tableau**, pas à un compte fourre-tout « prestations ». Les 55 000 € de Quai & Co doivent être les jalons 1 et 2, pas un libellé « mai, régularisation ».
2. La liste des bons de commande ouverts : formation 28 000 €, contrat 110 000 €, Relais 18 000 €, imprimantes 12 000 €.
3. Une date de photo commune. Ici, le 31 mai. Une facture arrivée le 2 juin n'est pas recollée en cachette dans mai pour faire plus vrai.

La revue mensuelle dure quarante-cinq minutes. On lit le tableau, on explique les lignes qui ont bougé, on met à jour le reste à faire avec Marc et Nadia, on formule l'écart. On ne cherche pas l'euro manquant entre deux notes de taxi. Un déplacement de 800 € dans le pilote ne change aucune des trois options. On le laisse dans les 8 000 €.

> [!WARNING]
> Recoder une facture pour qu'elle « rentre » dans la réserve, c'est déjà décider à la place du comité. La réserve est une ligne visible, pas une colonne où l'on cache les imprimantes.

# Le seuil qui ouvre une décision

Tout écart ne mérite pas une heure de comité. Le seuil écrit dans le plan, pour Halte, est simple : on remonte ce qui **déplace la prévision d'au moins 5 000 €**, ou ce qui vide la réserve, ou ce qui engage une dépense absente du budget initial.

Les imprimantes, 12 000 €, passent le seuil. Le devis de formation, +8 000 €, aussi. Le taxi, non. Le chef de projet qui apporte vingt lignes de 400 € noie les 14 000 €. Le chef de projet qui n'apporte que le total, sans les trois postes, demande à Inès de signer un chiffre qu'elle ne peut pas discuter.

La recommandation se sépare du constat. Constat : prévision 194 000 €, écart −14 000 €, dont 12 000 € déjà consommés en imprimantes. Recommandation, à écrire comme telle : l'option A, parce que les 6 bloquants ont besoin de la semaine de recette et qu'un coussin à zéro dès le mois 3 laisse août sans air. Inès peut préférer B. Elle ne peut pas découvrir l'écart dans la facture de juillet.

La même photo dit aussi ce qu'il ne faut **pas** payer. Ajouter les 33 000 € du jalon 3 « parce que Quai & Co a travaillé » ferait passer le consommé de 84 000 à 117 000 € sans qu'un résultat soit accepté. L'argent suivrait l'effort, plus le jalon. On en reparle dans l'engagement contractuel : ici, la règle de budget suffit. **Pas de facture de jalon sans acceptation.**

# La réserve se voit, ou elle n'existe pas

La réserve de 20 000 € n'est pas de l'argent en trop. C'est la part de l'enveloppe qu'aucun poste ne s'est encore appropriée. Le 28 février, elle sert à absorber un imprévu sans rouvrir le comité pour 2 000 €. Elle ne sert pas à financer une idée qu'on n'ose pas nommer.

Au 31 mai, la mécanique est déjà entamée. Les dérives nommées font 28 000 €. La réserve ne peut en couvrir que 20 000, et encore : en la vidant entièrement, la prévision des travaux reste à 188 000 €, soit 8 000 € au-delà de l'enveloppe (option C). Garder 6 000 € de coussin affiche −14 000 € (option A). Les deux phrases sont honnêtes. La phrase malhonnête est : « la réserve a absorbé les imprimantes », alors que les 12 000 € sont déjà partis et que le coussin restant ne couvre plus la suite.

La commande des imprimantes a été passée en mai, sans accord d'Inès, alors qu'un seuil de 5 000 € avait été posé. Le comité du 1er juin ne peut plus choisir de ne pas les acheter. Il peut seulement constater, demander pourquoi le seuil a sauté, et trancher A, B ou C pour le reste. Une réserve qui paie avant la décision n'est plus une réserve. C'est une dépense que personne n'a regardée.

Chaque fin de mois, la ligne « réserve non affectée » doit donc répondre à une seule question : **combien peut encore arriver sans que l'on revienne voir Inès ?** Au 31 mai, la réponse est 6 000 € dans la prévision, et 0 € si l'on choisit l'option C. On l'écrit. On ne la laisse pas se déduire tout seul dans un coin de tableur.

# Exercices

## Exercice 1 : Lire la photo de mai

À partir du tableau du 31 mai, répondez en une phrase chacune.

1. Quelle est la prévision à terminaison ?
2. Quel est l'écart par rapport aux 180 000 €, et que signifie le signe ?
3. Pourquoi le reste à faire du pilote n'est-il pas égal à engagé moins consommé ?

<details>
<summary>Voir la solution</summary>

1. Prévision = consommé + reste à faire = 84 000 + 110 000 = **194 000 €**.

2. Écart = 180 000 − 194 000 = **−14 000 €**. Le signe négatif veut dire un dépassement de 14 000 € si l'on termine comme prévu en gardant 6 000 € de coussin. Ce n'est pas « 14 000 € d'économies ».

3. Sur le pilote, l'engagé et le consommé sont tous deux à 8 000 € (déplacements déjà partis). Le reste à faire de 12 000 € est une semaine de recette **estimée, pas encore commandée**. Engagé − consommé vaut 0, et ce n'est pas le coût de ce qui reste. La même égalité marche pour Relais seulement parce que tout le futur est déjà dans le contrat signé.

</details>

## Exercice 2 : Le reste à faire de 96 000 euros

Un collègue écrit : « Consommé 84 000 €, donc il reste 96 000 €. L'écart est nul, inutile de déranger Inès. » Montrez le chiffre qu'il a effacé, puis dites laquelle des options A, B ou C son message fait passer en douce.

<details>
<summary>Voir la solution</summary>

Il calcule 180 000 − 84 000 = 96 000 €. Le reste à faire tenu avec l'équipe est de 110 000 €. La différence, **14 000 €**, est exactement l'écart qu'il annonce comme nul. Son « il reste » décrit le budget d'origine, pas le coût du travail qui reste (formation à 28 000, semaine de recette, coussin, imprimantes déjà parties).

En disant « inutile de déranger Inès », il choisit de ne pas décider. Ce n'est ni A (qui demande 14 000 €), ni B (qui retire de la recette pour revenir à 180 000), ni C (qui assume −8 000 € et un coussin vide). Le comité ne peut pas trancher un écart qu'on lui a rendu invisible. La note juste présente les trois options, avec une recommandation séparée du constat.

</details>

## Exercice 3 : La note d'une page pour le 1er juin

Les imprimantes (12 000 €) ont été commandées sans accord, au-dessus du seuil de 5 000 €. Rédigez la note que le chef de projet envoie le 29 mai : constat, écart, décision demandée. N'y mettez ni le grand livre, ni une excuse.

<details>
<summary>Voir la solution</summary>

Constat. Au 31 mai, consommé 84 000 €, reste à faire 110 000 €, prévision **194 000 €**. Les 12 000 € d'imprimantes (40 × 300 €) sont déjà consommés. Ils n'étaient pas au budget du 28 février. Le seuil de 5 000 €, qui exigeait un accord d'Inès, n'a pas été tenu. La facture de 33 000 € du jalon 3 n'est pas dans le consommé : le jalon est refusé (6 bloquants).

Écart. **−14 000 €** par rapport à 180 000 €, si l'on garde 6 000 € de coussin. Les dérives nommées : formation +8 000, imprimantes +12 000, pilote +8 000. La réserve ne les couvre pas toutes.

Décision demandée le 1er juin. Choisir A (enveloppe 194 000 €), B (revenir à 180 000 € en retirant le coussin et 8 000 € de recette) ou C (188 000 €, coussin à zéro). Recommandation, séparée : A, parce que les bloquants ont besoin de la semaine de recette. L'achat déjà fait ne se « dé-décide » pas. Il se constate, et la suite se tranche.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Le budget lu chaque mois"
center: "Initial figé, engagé, consommé, reste à faire : l'écart se lit sur la fin du projet."
points:
  - icon: money
    title: "Quatre soldes"
    text: "Au 31 mai : initial 180 000, engagé 176 000, consommé 84 000, reste à faire 110 000."
  - icon: chart
    title: "Prévision"
    text: "Consommé plus reste à faire = 194 000 €. On ne déduit pas le consommé du budget initial."
  - icon: scale
    title: "Écart de 14 000"
    text: "180 000 moins 194 000. Négatif veut dire dépassement. On le dit avec trois options."
  - icon: alert
    title: "Réserve visible"
    text: "Le coussin ne cache pas 12 000 € d'imprimantes déjà commandées sans accord."
  - icon: gauge
    title: "Seuil 5 000 €"
    text: "On remonte ce qui déplace la prévision d'au moins 5 000 €. Pas chaque note de frais."
pitfall: "Croire qu'il reste 96 000 € parce que 180 000 moins 84 000. Ce calcul efface les 14 000 € de dépassement."
remember: "Le chef de projet apporte l'écart et des options. Il ne recode pas les factures et ne réécrit pas l'initial."
```
