---
title: "Du critère d'acceptation au cas de test"
description: "Transformer un critère de la réception Halte Marché en cas que Nina joue : des données, une action, un oui ou un non que deux lecteurs cocheraient pareil."
duration: 50
objectives:
  - "Rattacher chaque cas à un seul identifiant d'exigence"
  - "Écrire les données, l'action et l'issue avant que Nina coche"
  - "Tenir le cas nominal des 4 heures et le cas d'erreur qui dit non"
  - "Séparer deux échecs qui n'ont pas le même correctif"
---

# Un critère devient un cas

Un critère d'acceptation se coche. À Halte Marché, il sert **une** exigence. EM-01 a le sien. REG-01 a le sien. Les coller dans une seule case produit un oui global qui cache un non : Rouen peut avoir enregistré la palette et rater les 4 heures.

Le critère de EM-01, déjà validé par Jonas Keller, dit : un lundi, dans un magasin nommé, on note l'heure de fin de déchargement et l'heure où la dernière pièce de frais **acceptée** est en rayon. Succès si l'écart est inférieur à 4 heures. Échec si cette pièce est encore en réserve à 4 heures et 1 minute.

Cette phrase ne dit pas encore le jeu du jour. Le cas le dit. Sans ce passage, Nina Vidal doit vous demander ce que « moins de 4 heures » veut dire sur cette livraison. Si elle doit le demander, le cas n'est pas écrit.

Trois ratages reviennent.

Le critère mou. « La réception est fluide. » Aucune heure ne le fait échouer.

Le cas sans identifiant. Une scène intéressante que Nina joue, et qui ne conclut ni EM-01 ni EM-02.

Le cas qui contient deux décisions. Température fausse **et** trace après le départ. Quand une seule des deux échoue, la case est rouge sans qu'on sache quelle phrase a cédé. **Un cas, une issue principale.** L'autre phrase a son cas.

> [!IMPORTANT]
> Si deux personnes lisent l'issue et n'entourent pas le même oui ou le même non, Nina ne peut pas jouer sans vous. Le cas est raconté, pas écrit.

# Données, action, issue

Trois blocs, écrits **avant** la coche. Les modifier après, pour coller à ce qui s'est passé en chambre, annule le cas.

**Les données** nomment le magasin (Rouen pour le premier jeu), le jour (un lundi, pas un jeudi à 15 palettes), les heures, la température à cœur, le motif, qui a le bon. Le souvenir 9 h 10 / 14 h 35 (5 h 25) peut être cité pour que Pauline Roux reconnaisse l'ordre de grandeur. Il n'est pas recopié comme le chiffre du cas. Le chiffre du cas est celui de l'exigence : 4 heures, -18 °C, 2 jours de vie restante, une ligne sans motif.

**L'action** est un geste observable. Yassine laisse le frais accepté en réserve. Pauline corrige le soir sans motif. Claire met en rayon un frais trop court parce que l'aspect est bon. Pas « vérifier le module ». Pas « voir si le terminal répond » : cette question est celle d'Omar Diop.

**L'issue** est oui, non, ou bloqué. Elle dit ce qui a été regardé :

- pour EM-01, les deux heures et le statut accepté ou refusé ;
- pour EM-02, le motif de chaque ligne en écart, pas le fait que la caisse « tombe » ;
- pour REG-01, le degré, le motif de la liste, la mise en vente ou non ;
- pour EF-01, le départ du chauffeur par rapport à l'enregistrement.

Une pièce **refusée** pour DLC, encore en réserve à 18 h, ne fait pas échouer EM-01. La mettre dans l'issue de JE-01 comme un échec de délai, c'est jouer REG-02 au mauvais endroit.

```diagram
type: flow
title: "Du critère à la coche de Nina"
steps:
  - title: "Critère"
    text: "Une exigence, un chiffre, un échec. EM-01 n'est pas REG-01."
    tone: violet
  - title: "Données"
    text: "Rouen, un lundi, des heures ou un degré, figés avant."
    tone: blue
  - title: "Action"
    text: "Un geste. Réserver, corriger, mettre en rayon, laisser partir."
    tone: amber
  - title: "Issue"
    text: "Oui, non, ou bloqué. Deux lecteurs cochent la même case."
    tone: teal
```

# Le cas nominal, les 4 heures tenues

Le nominal montre que la cible est atteignable. Sans lui, un système qui refuse tout serait vert sur les erreurs et inutilisable le lundi. Il ne prouve pas les autres phrases.

**Critère.** EM-01. Dernière pièce de frais acceptée en rayon moins de 4 heures après la fin du déchargement.

**Données JE-01.** Rouen. Lundi. Fin de déchargement 6 h 00. Dernier frais accepté au linéaire à 9 h 30. Écart 3 h 30. Une barquette refusée pour DLC reste en réserve à 18 h. Elle est notée à part, elle n'entre pas dans le calcul.

**Action.** Claire confirme l'heure au rayon. Nina compare à la fin de déchargement, que Yassine a notée.

**Issue.** Oui pour EM-01. La barquette refusée ne transforme pas le oui en non. Elle ne prouve pas non plus REG-02 : ce sera JE-06 si on l'a mise en rayon, pas si on l'a laissée en réserve.

Ce que JE-01 ne prouve pas, vous l'écrivez en bas de fiche. Pas le -16 °C. Pas la correction du soir. Pas le chauffeur déjà parti. Un relevé qui dit « JE-01 oui, donc la réception est bonne » a pris un chemin pour les cinq phrases.

L'heure de fin de déchargement manquante n'est pas un nominal raté de justesse. C'est un cas **injouable**. Nina ne coche pas oui par défaut. Vous ne reconstituez pas 6 h 00 de mémoire pour sauver la feuille.

> [!TIP]
> Faites lire JE-01 par quelqu'un qui n'a pas écrit la fiche. S'il demande si la barquette refusée compte dans les 3 h 30, l'issue n'a pas assez séparé EM-01 et REG-02.

# Le cas d'erreur, le frais encore en réserve

L'erreur la plus chère sur EM-01 est l'habitude du lundi : le frais accepté dort en réserve, et l'on dit « presque ». Le critère ne connaît pas le presque. 4 h 05 est un non. 4 h 30 est un non.

**Critère.** EM-01, chemin d'échec. Une pièce acceptée encore en réserve après 4 heures.

**Données JE-02.** Rouen. Lundi. Fin de déchargement 6 h 00. Dernier frais accepté encore en réserve à 10 h 30. Écart 4 h 30. La pièce est bien acceptée, pas refusée : sinon on retomberait sur le piège de JE-01.

**Action.** Claire montre la réserve. Nina calcule. Quelqu'un dit « on peut laisser, c'est cinq minutes dans d'autres jeux ». Ici ce n'est pas cinq minutes, et cela ne changerait rien.

**Issue.** Non. On ne change pas le seuil dans le couloir pour ne pas décourager le magasin. Si Jonas veut une tolérance, il la signe dans l'exigence, et le cas est réécrit avec elle. Hugo Pennec peut parler du moral du pilote. Il ne déplace pas les 4 heures.

JE-02 s'arrête à ce non. On n'enchaîne pas « puis Pauline rattrape le soir et tout est vert ». Le soir sans motif est JE-05. Le mélanger rendrait un échec de délai suivi d'un stock propre, et personne ne saurait quelle phrase a tenu.

```diagram
type: compare
title: "Même fin de déchargement, deux coches"
columns:
  - title: "JE-01, nominal"
    tone: teal
    items:
      - "Fin 6 h 00, rayon 9 h 30, écart 3 h 30"
      - "Pièce acceptée, pas refusée"
      - "Nina coche oui pour EM-01"
      - "La DLC en réserve ne compte pas ici"
  - title: "JE-02, erreur"
    tone: rose
    items:
      - "Fin 6 h 00, réserve 10 h 30, écart 4 h 30"
      - "Pièce acceptée, encore en réserve"
      - "Nina coche non"
      - "Presque et 4 h 05 sont aussi des non"
```

# Couvrir une phrase, pas tous les boutons

Six cas suffisent parce que chacun vise une **issue**, pas un écran. La liste des motifs a cinq mots. Vous ne créez pas un cas par mot le matin même. Le mécanisme du motif se voit dans JE-03 (« un peu mou » est un échec) et dans JE-05 (l'absence de motif est un échec).

| Cas | Issue prouvée | Ce qu'il ne prouve pas |
| --- | --- | --- |
| JE-01 | EM-01 peut être tenue | Le refus à -16 °C |
| JE-02 | 4 h 30 est un non, 4 h 05 aussi | La correction du soir |
| JE-03 | -16 °C ne va pas en chambre sous un motif libre | Les 4 heures |
| JE-04 | -20 °C accepté, trace avant le départ | Le stock du soir |
| JE-05 | Une ligne sur onze sans motif suffit à dire non | La température |
| JE-06 | Un frais d'un jour mis en rayon rate REG-02 | EM-01, s'il avait été refusé |

JE-03 et le départ du chauffeur ne se mélangent pas. Histoires-cas le dit déjà : règle fausse (on accepte à -16 °C) et geste faux (on note après le départ) sont deux échecs. Deux fiches. Le correctif n'est pas le même. Jonas ne signe pas la même phrase.

Un jeudi à 15 palettes, tout enregistré, ne prouve pas ENF-02. Ce volume-là est un autre cas, technique, pour Omar. Le glisser dans JE-01 ferait un oui de délai sur un magasin vide. Nina le sait. Hugo peut organiser la simulation du pic. Il ne la remplace pas par un mardi plus pratique.

Le cas est prêt quand vous pouvez le **rater**. « Qu'est-ce qui le met en non ? » Si la réponse est « une mauvaise impression », vous n'avez pas fini. Si la réponse est « 10 h 30 moins 6 h 00 fait 4 h 30 », Nina peut entrer.

# Exercices

## Exercice 1 : Presque 4 heures

Fin de déchargement 6 h 00. Dernier frais accepté en rayon à 10 h 05. Pauline trouve que 4 h 05 « ne mérite pas un non », le magasin s'est donné du mal. Nina hésite. Que coche-t-elle, et que ne changez-vous pas ?

<details>
<summary>Voir la solution</summary>

Elle coche non. EM-01 dit moins de 4 heures. 4 h 05 est au-delà. La marge de courtoisie réintroduit « à peu près », et le magasin suivant négociera vingt minutes.

Vous ne changez pas le seuil dans le couloir. Si Jonas veut une tolérance, il la signe dans l'exigence, et le critère est réécrit avec elle, avant une autre séance. Hugo peut commenter le moral. Il ne déplace pas les 4 heures. Le découragement se traite en annonçant l'écart, pas par un oui faux. Le souvenir de 5 h 25 à Rouen reste un existant. Il ne sert pas de nouveau seuil.

</details>

## Exercice 2 : Écrire JE-05

Rédigez le cas de la correction du soir. Identifiant, données, action, issue. Le stock tombe. Une ligne sur onze n'a pas de motif.

<details>
<summary>Voir la solution</summary>

**Critère.** EM-02. Chaque ligne dont la quantité acceptée diffère de ce qui entre en stock a un motif de la liste le jour même. Une seule ligne sans motif : non.

**Données.** Rouen. Lundi. Onze lignes en écart. Dix ont un motif de la liste. La onzième est ajustée par Pauline le soir, sans motif, pour que la journée se ferme. Le chiffre de caisse est propre.

**Action.** Nina lit les onze lignes, pas le total du soir.

**Issue.** Non. Une sur onze suffit. « La majorité a un motif » réintroduirait le flou que les 2 écarts sur 5 ont déjà chiffré. Le stock qui tombe n'est pas un succès. L'indicateur de Jonas compte justement ces écarts non tracés. Le cas ne juge pas -18 °C. Il ne juge pas les 4 heures.

</details>

## Exercice 3 : Deux non dans la même case

Nina reçoit une fiche : « Palette à -16 °C, Yassine écrit un peu mou après le départ du chauffeur, résultat : non, tout est faux. » Que séparez-vous ?

<details>
<summary>Voir la solution</summary>

Vous séparez deux cas. Le premier est JE-03, REG-01 : à cœur -16 °C, donc au-dessus de -18 °C. Issue attendue si la règle est validée : refus, motif température, pas de mise en vente. « Un peu mou » et la chambre sont un non sur la règle et sur la liste.

Le second est EF-01 : le chauffeur est déjà parti quand la trace est écrite. Issue : non, même si la température avait été bonne. Le carnet noir après coup n'est pas une trace avant le départ.

« Tout est faux » ne dit pas quelle phrase Jonas doit revoir. Le correctif d'un seuil n'est pas le correctif d'un horaire de saisie. Vous ne profitez pas de la fiche pour y ajouter les 4 heures : EM-01 a JE-01 et JE-02. Deux exigences, deux cases.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Une case, une coche"
center: "Un critère devient des données, une action, une issue. Nina coche oui, non ou bloqué, sans vous demander le seuil."
points:
  - icon: file
    title: "Un identifiant"
    text: "EM-01 n'est pas REG-01. Coller les deux dans une case cache le non du rayon derrière un oui d'écran."
  - icon: database
    title: "Des heures"
    text: "Fin de déchargement et heure au rayon, figées avant. Le 5 h 25 observé n'est pas le cas du jour."
  - icon: check
    title: "JE-01"
    text: "6 h 00 puis 9 h 30, écart 3 h 30. Oui. La pièce refusée pour DLC ne rallonge pas ce délai."
  - icon: alert
    title: "JE-02"
    text: "6 h 00 puis 10 h 30, écart 4 h 30. Non. 4 h 05 est un non aussi. Presque n'est pas une issue."
  - icon: scale
    title: "Une ligne"
    text: "JE-05 : une correction du soir sans motif, sur onze lignes, suffit. Le stock qui tombe ne sauve pas EM-02."
pitfall: "Écrire vérifier le frais sans heures, ou cocher oui à 4 h 05 pour ne pas décourager Pauline."
remember: "Le nominal montre la cible tenue. L'erreur montre le non. Les deux se rejouent. On ne réécrit pas la feuille après la chambre."
```
