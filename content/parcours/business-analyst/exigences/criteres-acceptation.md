---
title: "Les critères d'acceptation"
description: "Écrire, pour la réception de Halte Marché, un critère vérifiable, chiffré, avec son cas d'erreur, que Nina peut jouer sans vous."
duration: 55
objectives:
  - "Rendre chaque critère répondable par oui ou par non"
  - "Y mettre un cas, un chiffre, et l'exigence qu'il sert"
  - "Écrire le cas d'erreur au lieu de ne décrire que le chemin heureux"
  - "Faire jouer le critère par Nina, pas par celui qui l'a rédigé"
---

# Un critère se joue

Le critère d'acceptation dit comment on sait que l'exigence est tenue, sur un cas précis. Il se joue. Il ne se commente pas. Nina Vidal doit pouvoir cocher oui ou non sans vous demander ce que « globalement » voulait dire, et sans appeler Jonas pour interpréter un adjectif.

Un critère sert une exigence, une seule. EM-01 a le sien. REG-01 a le sien. Les coller produit un oui global qui cache un non. Le lundi de Rouen peut réussir l'enregistrement et rater les 4 heures. Deux critères, deux cases.

Ce qui n'est pas un critère :

- « Le magasin est à l'aise. »
- « La réception est fluide. »
- « Yassine a fait de son mieux. »
- « Le test est passé dans l'outil », si l'outil n'est pas le moyen retenu, et même s'il l'est : un parcours techniquement terminé qui laisse le frais en réserve 6 heures rate EM-01.

Le critère parle de ce que le quai et le rayon vivent. Il reprend la définition de Jonas quand l'exigence vise un indicateur. Pour le délai, on part de la fin du déchargement, on s'arrête à la dernière pièce de frais **acceptée** en rayon, on ne compte pas le refusé. Nina qui inventerait un autre chrono ferait un critère vert à côté d'un tableau rouge.

> [!IMPORTANT]
> Si la phrase du critère contient « à peu près », « sauf si le magasin préfère », ou « on verra », elle n'est pas prête. Nina n'a rien à cocher.

# Le chiffre et le cas

Un critère tenu a trois pièces : le cas, le chiffre, l'échec explicite. Le chiffre vient de l'exigence ou de l'indicateur, pas d'une envie de précision.

Critère de EM-01, exigence validée par Jonas sur les 4 heures.

- **Cas.** Une livraison de frais, un lundi, dans un magasin nommé. Pour le premier jeu : Rouen.
- **Chiffre.** On note l'heure de fin de déchargement et l'heure où la dernière pièce de frais acceptée est en rayon. Succès si l'écart est inférieur à 4 heures.
- **Échec.** Une pièce acceptée encore en réserve à 4 heures et 1 minute : non. Une pièce refusée pour DLC, encore en réserve à 18 h : elle ne fait pas échouer ce critère. Elle se joue sur REG-02.

Le 9 h 10 et le 14 h 35 du lundi observé sont un exemple chiffré de l'existant (5 h 25, échec au regard de la cible). Ils ne sont pas le critère. Le critère vaut pour la prochaine livraison, pas pour ce souvenir. Vous les citez comme illustration, pour que Pauline voie de quoi on parle.

Critère de EM-02.

- **Cas.** Les lignes d'un bon, le jour même, magasin nommé.
- **Chiffre.** Chaque ligne dont la quantité acceptée diffère de la quantité entrée en stock a un motif de la liste avant la fin de la journée. Une seule ligne en écart sans motif : non. À Rouen, le lundi vu, 11 lignes différaient et 7 n'avaient pas de saisie : ce souvenir serait un échec, et c'est utile de le dire.
- **Ce qui n'est pas un succès.** Le stock du soir « tombe » parce que Pauline a corrigé sans motif. Le chiffre de caisse est propre. Le critère est en échec. L'indicateur de Jonas compte justement ces écarts non tracés.

Le critère cite l'identifiant. « Critère de EM-01 ». Sans cet ancrage, Nina joue une scène intéressante qui ne conclut aucune exigence. Hugo peut placer le lundi où l'on jouera. Il ne réécrit pas le seuil pour que le 12 mars soit plus confortable.

# Le cas d'erreur

Le chemin heureux est le plus court, et le moins instructif. Le cas d'erreur est écrit dans le critère, avec l'issue attendue. Issue attendue veut dire : ce que Jonas a signé, pas ce que vous trouvez logique sur le moment.

Exemples pour la réception.

| Exigence | Cas d'erreur | Issue attendue, si elle est signée |
| --- | --- | --- |
| EM-01 | Heure de fin de déchargement absente | Cas injouable, pas un succès par défaut |
| EM-01 | Frais accepté encore en réserve après 4 heures | Échec |
| EM-02 | Correction du soir sans motif | Échec, même si le stock tombe |
| EF-01 | Le chauffeur part avant l'enregistrement | Échec |
| REG-01 | Palette à -16 °C, règle validée à -18 °C | Refus, motif température, pas de mise en vente |
| REG-01 | Pas de sonde disponible | On n'invente pas l'issue : elle est écrite, ou le cas est bloqué |

La dernière ligne est le piège. « Pas de sonde, donc on accepte » ou « pas de sonde, donc on refuse » sont deux règles différentes. Tant que Jonas n'a pas choisi, le critère dit : cas bloqué, pas de conclusion. Écrire une issue pour débloquer Nina, c'est spécifier une règle dans le critère, en contrebande.

Le motif libre « un peu mou » est un cas d'erreur de EF-01 et du cas d'utilisation. Issue : échec. Le motif doit être un choix de la liste (température, casse, manquant, DLC, non commandé). La liste elle-même est une petite règle. Si elle n'est pas validée, le critère qui l'exige reste proposé. Vous ne la glissez pas « en attendant » dans une parenthèse.

> [!WARNING]
> Un critère sans cas d'erreur se réussit en choisissant le lundi où tout va bien. Le pic, la sonde absente et la correction du soir sont la recette, pas la marge.

# Relié à l'exigence, relu par un autre

Le critère voyage avec l'exigence dans la trace : identifiant, phrase, statut, critère, cas. Quand l'exigence repart en analyse, le critère repart avec elle. On ne garde pas un critère « validé » sous une phrase qui a changé de seuil. Les 4 heures deviennent 5 heures : l'ancien critère est faux, même s'il était bien écrit.

Nina joue. Vous avez rédigé avec Jonas. Celui qui a écrit ne coche pas seul. Yassine, ou un équipier qui n'était pas à l'atelier, trouve en quelques minutes le mot que le siège croyait clair. « Avant le départ » : départ du quai, ou départ du parking ? Vous le précisez dans le critère, une fois, après cette lecture. Départ du quai, palette encore contestable par le chauffeur.

Sarah n'ajoute pas de critères d'écran tant qu'elle n'a pas inscrit le sujet dans l'outil. Un critère « le bouton Refus est visible » ne sert pas EM-01. Omar ne remplace pas le critère métier par « le service a répondu ». La réponse technique peut être vraie et le frais encore en réserve. Les deux se constatent. Ils ne se substituent pas.

Le nombre de critères reste petit. EM-01, EM-02, EF-01, EF-02, REG-01, REG-02, et les non fonctionnelles quand elles sont écrites. Mieux vaut six critères joués qu'une grille de quarante lignes recopiées d'un ancien dossier. Si la grille grossit jusqu'à raconter tout le quai, vous avez recollé les exigences que vous aviez séparées.

```video
url: https://www.youtube.com/watch?v=2uB93oc2TxA
title: "How to Identify Given-When-Then (Gherkin) Scenarios From Functional Requirements"
channel: "BA-EXPERTS - Learn Business Analysis by Example"
duration: "4:43"
lang: en
why: "Comment tirer des scénarios « étant donné, quand, alors » d'une exigence, une façon courante d'écrire des critères jouables."
```

# Faire échouer exprès

Avant le lundi de recette, vous faites échouer le critère sur la table, avec des chiffres fictifs mais du même ordre que Rouen. Cela ne remplace pas le quai. Cela montre que Nina a une case « non » qu'elle sait cocher.

Jeu sur table, EM-01. Fin de déchargement 6 h 00. Dernier frais accepté en rayon 10 h 30. Écart 4 h 30. Nina dit non. Si elle dit « presque, on peut laisser », le critère n'est pas prêt : le seuil ne se négocie pas au moment de cocher.

Jeu sur table, REG-01. Palette mesurée à -16 °C, règle signée à -18 °C, motif « un peu mou », palette en chambre. Nina dit non, pour deux raisons qu'elle sait séparer : la règle (elle aurait dû être refusée) et le motif (pas dans la liste). Si elle ne sait pas les séparer, le critère mélange encore deux exigences.

Jeu sur table, EM-02. Onze lignes en écart, dix avec motif, une corrigée par Pauline sans motif. Nina dit non. Une sur onze suffit. Le critère qui dirait « la majorité des lignes » réintroduirait le flou que les 2 écarts sur 5 ont déjà chiffré comme le problème.

Vous notez ces trois jeux à côté des critères. Hugo saura quoi préparer comme palettes et comme bon. Il ne choisira pas un bon sans écart « pour que ça passe ». Un jeu qui ne peut pas échouer ne recette rien.

```diagram
type: decision
title: "Ce critère est-il jouable ?"
nodes:
  - question: "Nina peut-elle répondre oui ou non sans interpréter un adjectif ?"
    yes: "Le critère se constate. On regarde le cas et le chiffre."
    no: "On réécrit. Fluide, à peu près, de son mieux : pas un critère."
  - question: "Le cas a-t-il un chiffre venu de l'exigence ou de Jonas ?"
    yes: "On vérifie le cas d'erreur."
    no: "On revient à l'indicateur. On n'invente pas un seuil pour faire précis."
  - question: "L'issue du cas d'erreur est-elle signée, ou le cas est-il bloqué ?"
    yes: "Nina peut jouer, y compris le non."
    no: "On ne devine pas l'issue. Le critère reste proposé."
```

# Exercices

## Exercice 1 : Presque 4 heures

Sur le jeu de table, la fin de déchargement est 6 h 00 et le dernier frais accepté est en rayon à 10 h 05. Nina dit : « C'est cinq minutes, on peut marquer oui pour ne pas décourager Rouen. » Que répondez-vous ?

<details>
<summary>Voir la solution</summary>

Le critère dit moins de 4 heures. 4 h 05 est un non. La marge de courtoisie réintroduit « à peu près », et le prochain magasin négociera vingt minutes.

Vous faites cocher non. Vous ne changez pas le seuil dans le couloir. Si Jonas veut une tolérance, il la signe dans l'exigence, et le critère est réécrit avec elle. Hugo peut commenter l'effet sur le moral du pilote. Il ne déplace pas les 4 heures. Le découragement se traite par la façon d'annoncer l'écart, pas par un oui faux.

</details>

## Exercice 2 : La sonde absente

REG-01 est validée à -18 °C. Le critère ne dit rien si la sonde est cassée. Le jour du jeu, elle l'est. Pauline veut mettre la palette en chambre « comme d'habitude ». Nina vous regarde. Que doit dire le critère, et que ne dites-vous pas sur le moment ?

<details>
<summary>Voir la solution</summary>

Vous ne choisissez pas l'issue sur le quai pour débloquer la matinée. Accepter ou refuser sans mesure est une règle, elle appartient à Jonas. Sans elle, le cas est bloqué : pas de succès par défaut, pas d'échec inventé.

Vous le notez comme trou du critère, statut de REG-01 ou du critère revenu en analyse sur ce point seulement, et vous posez la question à Jonas : sans mesure, mise en vente interdite jusqu'à mesure, ou autre issue. Pauline suit l'existant en attendant, et cet existant n'est pas la conclusion de recette. Nina coche « bloqué », pas « oui ».

</details>

## Exercice 3 : Le bouton vert

Sarah a finalement inscrit un essai d'écran sur deux magasins. Omar annonce que l'écran répond. Nina propose de remplacer le critère de EM-01 par « le bouton Enregistrer a été cliqué ». Pourquoi refusez-vous ce remplacement ?

<details>
<summary>Voir la solution</summary>

Le clic constate un geste d'outil, pas le frais en rayon. EM-01 se joue sur deux heures : fin de déchargement, dernière pièce acceptée au linéaire, seuil de 4 heures. L'écran peut répondre et le frais rester en réserve.

Vous pouvez ajouter un critère d'EF-01 sur ces deux magasins, si le moyen retenu est l'écran : l'enregistrement a bien eu lieu avant le départ. Vous ne retirez pas le critère de EM-01. Omar reste sur la tenue technique. Sarah reste sur le fait que l'essai n'est pas toute la roadmap. Deux constats possibles, deux cases.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Les critères d'acceptation"
center: "Un critère se coche. Il a un cas, un chiffre, et une issue quand ça déraille."
points:
  - icon: test
    title: "Oui ou non"
    text: "Nina coche sans vous. À peu près, fluide, de son mieux : ce ne sont pas des critères."
  - icon: ruler
    title: "Cas et chiffre"
    text: "EM-01 : fin de déchargement, dernier frais accepté, moins de 4 heures. Le refusé ne compte pas."
  - icon: alert
    title: "Cas d'erreur"
    text: "Chauffeur déjà parti, correction sans motif, -16 °C. Sans issue signée, le cas est bloqué."
  - icon: link
    title: "Une exigence"
    text: "Un critère, un identifiant. Le stock qui tombe sans motif ne fait pas réussir EM-02."
  - icon: users
    title: "Joué par un autre"
    text: "Faites échouer le critère sur la table avant le lundi. Un jeu qui ne peut pas rater ne recette rien."
pitfall: "Marquer oui pour cinq minutes au-delà des 4 heures, afin de ne pas décourager le magasin."
remember: "Cas, chiffre, échec explicite. Nina joue. Le seuil ne se négocie pas au moment de cocher."
```
