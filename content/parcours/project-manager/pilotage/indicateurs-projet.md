---
title: "Tenir les indicateurs qui font décider"
description: "Cinq indicateurs pour Halte : jalons, délai, coût, risques ouverts, qualité de recette. Retirer celui qui ne change aucune décision."
duration: 40
objectives:
  - "Lire l'avancement par les jalons acceptés, pas par un pourcentage global"
  - "Séparer le délai, le coût, les risques ouverts et la qualité de recette"
  - "Retirer un indicateur qui ne change aucune décision du mois"
  - "Tenir la planche d'une page du 31 mai sans la laisser gonfler"
---

# Cinq questions, pas un tableau de bord

Le 31 mai 2027, Inès a une heure le 1er juin. Elle ne lira pas douze graphiques. Elle doit répondre à cinq questions, chacune avec un chiffre que l'on peut contredire.

| Question | Indicateur | Au 31 mai |
| --- | --- | --- |
| Où en est le résultat ? | Jalons acceptés | 2 sur 6. Le jalon 3 est refusé. |
| Tiendra-t-on le 27 août ? | Écart de délai du jalon en cours | +14 jours (report demandé au 14 juin). |
| Les 180 000 € suffisent-ils ? | Prévision et écart | 194 000 €, écart −14 000 €. |
| Qu'est-ce qui peut encore casser ? | Risques ouverts d'exposition ≥ 6 | 3 risques. |
| Peut-on accepter le jalon ? | Défauts bloquants | 6, seuil 0. |

Un sixième chiffre n'entre que s'il change l'une de ces réponses. Le nombre de réunions de mai (12), les jours de présence de Quai & Co (8), un « avancement 47 % » : aucun ne dit s'il faut reporter, payer, ou couper la semaine de recette. Ils sortent de la planche. On pourra les retrouver dans le point du mardi si Paul y tient. Ils ne sont pas des indicateurs de projet.

```diagram
type: decision
title: "Cet indicateur reste-t-il sur la planche ?"
nodes:
  - question: "Change-t-il une décision ce mois-ci ?"
    yes: "On le garde, avec son seuil"
    no: "On le retire de la planche"
  - question: "Le seuil est-il écrit ?"
    yes: "Le chiffre se compare à quelque chose"
    no: "On fixe le seuil ou l'on retire le chiffre"
```

# L'avancement est un jalon, le délai est un écart

**Avancement.** Dire « nous sommes à 47 % » suppose un dénominateur que personne n'a posé. 47 % des tâches ? des jours ? du budget consommé (84 000 / 180 000 fait environ 47 %, justement) ? Le consommé n'est pas l'avancement : on peut avoir payé les imprimantes et n'avoir aucun pilote accepté. L'avancement de Halte se dit en jalons.

1. Cadrage, 31 mars, **accepté**.
2. Conception, 30 avril, **accepté**.
3. Recette des 4 pilotes, 31 mai, **refusé**.
4. Pilote en commandes réelles, 30 juin, non commencé.
5. 36 magasins restants, 30 juillet, non commencé.
6. Recette finale et transfert, 27 août, non commencé.

« 2 sur 6 » est volontairement brutal. Cela n'autorise pas à conclure que le projet est au tiers. Les deux premiers jalons sont plus courts que le déploiement de juillet. L'honnêteté consiste à **ne pas** convertir 2/6 en pourcentage. On dit quels jalons sont acceptés, lequel est le prochain, et s'il est accepté ou non.

**Délai.** L'avancement dit l'état. Le délai dit le calendrier. Le jalon 3 devait être accepté le 31 mai. La date demandée est le **14 juin**, soit 14 jours. Ces 14 jours ne sont pas « un peu de retard » abstraits. Ils compriment juin : le pilote réel, prévu jusqu'au 30 juin, perd deux semaines s'il ne démarre qu'après l'acceptation. Juillet, mois du déploiement des 36, ne s'allonge pas. Le 27 août est une date de rentrée commerciale, pas une variable. L'indicateur de délai est donc : **écart du jalon en cours, et effet sur la date de fin, dit explicitement**.

Ici, l'effet n'est pas encore « fin au 10 septembre ». Il le deviendrait si l'on refusait de comprimer le pilote ou le déploiement. La planche porte les deux phrases : +14 jours sur le jalon 3 ; date de fin toujours affichée au 27 août, **à condition** d'accepter un pilote réel plus court ou un déploiement qui démarre dès le 15 juin sur les magasins non bloqués. Cette condition est la décision. Sans elle, afficher « fin toujours tenue » est un vœu.

> [!WARNING]
> Un pourcentage d'avancement recopié du rapport de Quai & Co (70 % en mai) double le mensonge. Il n'y a pas de nouveau jalon accepté derrière ce 70 %. On ne le republie pas pour « faire plaisir au fournisseur ».

# Le coût, les risques, la recette

**Coût.** L'indicateur n'est pas le consommé seul (84 000 €), qui a l'air rassurant à côté de 180 000 €. C'est la **prévision à terminaison, 194 000 €, et l'écart, −14 000 €**. Le seuil est l'enveloppe du 28 février. Le détail des postes (formation +8 000, imprimantes +12 000, pilote +8 000) tient en note sous le chiffre, pour que l'option A, B ou C se comprenne. Un indicateur de coût sans écart ne dit pas s'il faut décider.

**Risques ouverts.** On ne compte pas tout ce qui a un jour fait peur. On compte les risques **encore ouverts**, avec une exposition. Échelle simple, de 1 à 3 : probabilité fois impact. Remontée dès que le produit vaut **6 ou plus**. Au 31 mars, cinq risques étaient au registre. Au 31 mai, deux sont **sortis** parce qu'ils sont arrivés : ce ne sont plus des risques, ce sont des problèmes.

- Le glissement du jalon 3 est arrivé. Il est suivi comme problème : date 14 juin, 6 bloquants.
- Le matériel d'étiquetage non inventorié est arrivé : 12 000 € déjà consommés.

Restent ouverts, exposition ≥ 6 :

- dépendance à Léa et Karim, 2 × 3 = 6, porteur Nadia ;
- mise en production un vendredi soir ou un samedi (40 % du volume), 3 × 2 = 6, porteur Marc ;
- adresses clients : le flux d'avril a été vu par le DPO, mais un outil de SMS est proposé en plus, donc 2 × 3 = 6, porteur chef de projet avec le DPO.

Un quatrième risque, la formation qui croise juillet, est à 2 × 2 = 4. Il reste au registre, il ne monte pas sur la planche tant qu'il ne demande pas un arbitrage. **L'indicateur affiché est 3, pas 5, pas « le registre en annexe de 4 pages ».** Le comité ouvre le registre seulement pour le risque qui demande une décision. En juin, c'est le gel du vendredi 16 h, parce que Marc et un directeur pilote ne sont pas d'accord.

**Qualité de recette.** 120 cas prévus. 80 passent, 40 échouent. Les défauts ouverts ne sont pas au nombre de 40 : un bloquant (l'étiquette sans créneau) fait échouer 28 cas à lui seul, et des mineurs ne font échouer aucun cas. La planche retient un seul seuil : **6 bloquants, seuil 0 pour accepter**. Les 14 majeurs et les 22 mineurs existent, ils se gèrent le mardi, ils n'acceptent pas un jalon à eux seuls. Mettre « 42 défauts » en gros titre mélange ce qui bloque le paiement et ce qui peut attendre août.

| Niveau | Ouverts au 31 mai | Effet sur le jalon 3 |
| --- | ---: | --- |
| Bloquant | 6 | Refuse l'acceptation. Facture de 33 000 € non due. |
| Majeur | 14 | N'empêche pas, si un contournement est écrit. |
| Mineur | 22 | Ne se traite pas en comité. |

# Le test de la décision

Avant d'ajouter une ligne, une question : **quelle décision du 1er juin changerait si ce chiffre bougeait ?** Si la réponse est « aucune », la ligne n'est pas un indicateur de pilotage. Elle peut rester un fait de contexte, une fois, en bas de page.

Quelques candidats de mai, passés au test.

- **8 jours de présence.** Même à 12 jours, le jalon 3 resterait refusé tant que les 6 bloquants sont ouverts. Aucune des options A, B, C ne dépend de ce nombre. On le retire. On le garde dans la réponse à Paul, pour ne pas nier l'effort, pas sur la planche.
- **Avancement 47 %.** Aucune décision ne dit « si nous passons 50 %, alors… ». On le retire, on le remplace par 2/6 et par le refus du jalon 3.
- **12 réunions.** Le projet n'a pas de seuil sur les réunions. On le retire.
- **Réclamations encore à 6,4 %.** En mai, aucun magasin n'est en commandes réelles sur le nouveau créneau. Le chiffre ne peut pas bouger à cause du projet. Le mettre en « rouge » fabrique une alerte fausse. On le garde comme **cible finale** (sous 3 % au 27 août), pas comme indicateur mensuel tant que le pilote réel n'a pas démarré. Dès juin, sur les 4 pilotes, il deviendra un indicateur, parce qu'un écart pourra faire prolonger le pilote ou stopper le déploiement des 36.
- **6 bloquants.** Si le chiffre passait à 0, la facture de 33 000 € deviendrait due et le 14 juin n'aurait plus de raison d'être. La décision change. On le garde.

Le test se refait chaque mois. Un indicateur n'a pas de droit acquis. Celui de juin (réclamations sur le pilote réel) n'avait pas sa place en avril. Celui d'avril (dossier de conception livré oui ou non) n'a plus sa place en juin, le jalon 2 étant accepté.

> [!TIP]
> Si vous ne savez pas quelle décision un graphique prépare, ne le dessinez pas. La planche est une liste de décisions possibles, les chiffres viennent après.

# La planche d'une page, au 31 mai

Une page, cinq lignes, un seuil, une décision ouverte. Pas de jauge, pas de tendance sur trois points quand on n'a qu'une photo utile.

| Indicateur | Valeur | Seuil | Décision ouverte |
| --- | --- | --- | --- |
| Jalons | 2/6 acceptés, jalon 3 refusé | Accepté à la date prévue | Reporter l'acceptation au 14 juin, ou replanifier le déploiement |
| Délai | +14 jours | 0 sur le jalon en cours | Dire si le 27 août tient encore, et à quelle condition |
| Coût | 194 000 €, écart −14 000 € | 180 000 € | Option A, B ou C |
| Risques ≥ 6 | 3 ouverts | Chacun a un porteur | Trancher le gel du vendredi 16 h |
| Bloquants | 6 | 0 | Ne pas payer les 33 000 € |

Sous le tableau, trois lignes de contexte et pas plus : imprimantes déjà consommées (12 000 €), cause du refus (étiquette sans créneau et matériel), recommandation séparée du constat. Le registre complet, le détail des 120 cas et la photo budgétaire par poste sont des annexes, liées, pas collées.

La planche se fige le 31 mai au soir. Un défaut fermé le 1er juin à 8 h n'est pas glissé dans la page pour arriver à 5 bloquants « quand même ». On le dit en séance, à voix haute, comme un mouvement depuis la photo. Sinon personne ne sait plus quel chiffre a été préparé.

# Retirer, remplacer, ne pas accumuler

Chaque comité laisse une tentation : ajouter la question que quelqu'un a posée, « pour la prochaine fois ». En avril, un directeur a demandé le nombre de magasins « informés ». L'indicateur a vécu un mois, tout le monde était informé, aucune décision n'a bougé. En mai, il sort. La règle d'accumulation est la suivante : **une ligne entre, une ligne sort**, sauf si les cinq questions de base ne sont plus couvertes. On ne dépasse pas cinq indicateurs simultanés. Au-delà, Inès choisit elle-même ce qu'elle lit, et ce n'est plus un pilotage.

Remplacer, ce n'est pas renommer. « Taux de réussite des cas : 67 % » (80/120) a l'air plus sérieux que « 6 bloquants ». Il est moins bon. 67 % peut monter à 90 % par fermeture de mineurs pendant que les 6 bloquants restent. Le paiement, lui, dépend des bloquants. On garde le chiffre qui est dans la règle d'acceptation, pas celui qui se raconte mieux.

La même discipline vaut pour les couleurs. Rouge, orange, vert sans seuil écrit sont des humeurs. Ici le seuil est dans la colonne. 6 bloquants contre 0 est déjà lisible sans fond coloré. Un vert sur la prévision de 194 000 €, « parce que l'on a encore de la réserve », serait faux : l'écart est négatif. La couleur ne corrige pas un signe.

Enfin, la planche ne moyenne pas les cinq lignes en une note de santé du projet. Une moyenne de « délai en retard » et « cadrage accepté » n'aide aucune option A, B ou C. Cinq lignes, cinq décisions possibles, une page.

# Exercices

## Exercice 1 : Garder ou retirer

Pour chaque candidat, dites s'il reste sur la planche du 31 mai, et quelle décision il changerait. S'il sort, dites par quoi il est déjà couvert.

1. Pourcentage d'avancement 47 %.
2. Prévision 194 000 €.
3. Nombre de jours de présence, 8.
4. Bloquants ouverts, 6.
5. Réclamations livraison du réseau, 6,4 %, alors qu'aucun pilote réel n'a démarré.

<details>
<summary>Voir la solution</summary>

1. **Sort.** Aucune décision du 1er juin ne dépend de 47 %. C'est d'ailleurs à peu près le consommé divisé par l'enveloppe, donc un chiffre d'argent déguisé en avancement. Déjà couvert, correctement, par « 2/6 jalons, jalon 3 refusé ».

2. **Reste.** Il change le choix entre A (194 000 €), B (180 000 €) et C (188 000 €). Le seuil est 180 000 €.

3. **Sort.** À 8 comme à 12 jours, les 33 000 € restent non dus tant que les bloquants sont ouverts. L'effort se reconnaît dans la réponse à Paul, pas sur la planche.

4. **Reste.** À 0, le jalon 3 s'accepte et la facture devient due. À 6, on refuse. C'est le seuil écrit.

5. **Sort de la planche de mai**, pas du projet. Aucun magasin n'est encore en commandes réelles : le 6,4 % ne peut pas mesurer la refonte. On le garde comme cible du 27 août (sous 3 %). Il deviendra indicateur quand le pilote réel produira un chiffre que l'on peut comparer.

</details>

## Exercice 2 : Réécrire le 70 %

Paul écrit dans son rapport : « Avancement global 70 %, dynamique positive. » Proposez la phrase de remplacement pour la planche, avec un jalon, une date et un seuil. N'inventez pas un autre pourcentage.

<details>
<summary>Voir la solution</summary>

« Jalons 1 et 2 acceptés (31 mars, 30 avril). Jalon 3, prévu le 31 mai, **refusé** : 6 défauts bloquants, seuil 0. Report d'acceptation demandé au 14 juin. Les 33 000 € ne sont pas dus. »

On n'écrit pas « 70 % non confirmés » : cela garderait le pourcentage comme référence. On n'écrit pas non plus « avancement 2/6 soit 33 % » : les jalons n'ont pas le même poids, et le pourcentage recrée le problème. La phrase utile dit l'état du prochain jalon et la conséquence sur l'argent.

</details>

## Exercice 3 : La planche tient sur cinq lignes

Construisez la planche du 31 mai : cinq lignes maximum, chacune avec valeur, seuil et décision ouverte. Placez les 14 défauts majeurs au bon endroit (planche ou ailleurs).

<details>
<summary>Voir la solution</summary>

1. Jalons : 2/6, jalon 3 refusé. Seuil : accepté à la date. Décision : reporter au 14 juin ou replanifier le déploiement.
2. Délai : +14 jours. Seuil : 0. Décision : dire à quelle condition le 27 août tient encore.
3. Coût : prévision 194 000 €, écart −14 000 €. Seuil : 180 000 €. Décision : option A, B ou C.
4. Risques ouverts ≥ 6 : 3. Seuil : chacun a un porteur et une réponse. Décision : trancher le gel du vendredi 16 h.
5. Bloquants : 6. Seuil : 0. Décision : ne pas payer 33 000 €.

Les **14 majeurs** ne prennent pas une sixième ligne. Ils ne font pas échouer la règle d'acceptation si un contournement est écrit. Ils restent dans le suivi du mardi avec Paul, Nadia et Marc. Les mettre sur la planche inviterait le comité à discuter de défauts qu'il ne tranchera pas.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Cinq chiffres, une décision"
center: "Jalons, délai, coût, risques ouverts, bloquants. Un chiffre sans décision sort de la planche."
points:
  - icon: check
    title: "2 jalons sur 6"
    text: "Le 3 est refusé le 31 mai. On ne traduit pas 2/6 en pourcentage d'avancement."
  - icon: clock
    title: "+14 jours"
    text: "Report demandé au 14 juin. Le 27 août ne tient qu'à une condition dite explicitement."
  - icon: money
    title: "Écart −14 000 €"
    text: "Prévision 194 000 contre enveloppe 180 000. Le consommé seul ne dit pas s'il faut décider."
  - icon: alert
    title: "3 risques ≥ 6"
    text: "Ce qui est déjà arrivé sort du registre : c'est un problème, plus un risque."
  - icon: test
    title: "6 bloquants"
    text: "Seuil 0 pour accepter. 80 cas sur 120 ne remplacent pas ce seuil, ni la facture."
pitfall: "Afficher un avancement de 47 % ou de 70 %, ou compter 8 jours de présence comme une preuve de jalon."
remember: "Si le chiffre ne change aucune décision du mois, il quitte la planche. Une ligne entre, une ligne sort."
```
