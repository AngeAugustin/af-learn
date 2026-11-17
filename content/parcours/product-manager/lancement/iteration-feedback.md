---
title: "Itérer sans tout mettre sur le modèle"
description: "Classer les retours en bug, incompréhension ou hors promesse, et décider ce qu'on change dans le produit plutôt que dans le modèle."
duration: 35
objectives:
  - "Ranger chaque retour dans un seul tas avant d'en débattre"
  - "Changer l'écran, la règle ou la formation quand le modèle n'est pas en cause"
  - "Ne revoir la demande au modèle que sur un exemple frais et permis"
  - "Tenir une revue courte qui décide, au lieu d'une liste de souhaits"
---

# Trois tas, avant toute correction

Dès la première semaine, les retours arrivent mélangés. Karim dit « c'est faux ». Un directeur dit « il faudrait aussi le SMS ». Hugo dit « je croyais que le client était déjà prévenu ». Si vous mettez tout dans une liste « à améliorer », vous finirez par demander un modèle plus malin pour un bouton mal placé.

Chaque retour entre dans **un** tas. S'il en occupe deux, vous le coupez en deux phrases.

**Bug.** Le produit ne fait pas ce que la promesse a déjà signé. Mauvais magasin, écran vide à 8 h 05 alors que les faits sont là, brief d'hier affiché, bouton qui ne part pas, heure du statut invisible. On corrige. On ne discute pas de la vision.

**Incompréhension.** Le produit suit la règle, et la personne lit autre chose. « Appeler » compris comme « l'appel est parti ». Ligne grise lue comme une panne. « Aucun retard connu » lu comme « tout est à l'heure ». On change les mots, l'écran ou les dix minutes. On ne change pas l'ambition.

**Hors promesse.** La demande est claire, et elle n'est pas dans la phrase signée. Envoyer le SMS, noter les responsables, répondre à une question libre, choisir le transporteur. On le dit, on le note comme refus ou comme sujet futur, on ne le glisse pas dans le sprint du brief.

| Retour entendu | Tas | Premier geste |
| --- | --- | --- |
| « Nantes est dans mon brief » | Bug | Couper le jour, corriger le filtre magasin |
| « Je croyais que le client était prévenu » | Incompréhension | Reprendre la phrase et la formation |
| « Ajoutez le SMS automatique » | Hors promesse | Refus écrit, pas un ticket masqué |
| « La ligne grise, c'est un bug ? » | Incompréhension | Montrer l'heure du statut, redire la règle |
| « L'écran met une minute » | Bug | L'ouverture doit tenir sous vingt secondes |

Le tas se choisit avec la promesse sous les yeux, pas avec l'humeur de celui qui parle. Un retour vif peut être un bug vrai. Un retour poli peut être hors promesse. Le ton n'est pas une catégorie.

> [!IMPORTANT]
> Tant qu'un retour n'a pas de tas, il n'a pas de propriétaire. Il reviendra la semaine suivante, un peu plus gros.

# Ce qu'on change dans le produit

La plupart des retours utiles des trois premières semaines sont des changements de produit. Vous les préférez, parce qu'ils se voient, se testent le lendemain, et ne réouvrent pas la promesse.

**Les mots.** Si trois responsables comprennent qu'un appel est parti, « Appeler » est un mauvais libellé. Vous passez à « À appeler par vous ». Vous retestez en dix minutes, avec un cas. Vous ne lancez pas une refonte de l'écran.

**La règle visible.** Si les lignes grises sont prises pour des pannes, l'heure du statut doit être plus grande que la phrase. Si « aucun retard connu » rassure trop, vous ajoutez « les statuts manquants ne sont pas des retards sûrs ». Ce sont des changements d'écran. Le comportement attendu était déjà le bon.

**Le chemin quand ça casse.** Écran vide, lenteur, brief de la veille : le message « brief indisponible, utilisez la liste transporteur » doit apparaître seul. S'il manque, c'est un trou produit, même si le modèle aurait eu une belle phrase à dire.

**La formation, une fois.** Le même malentendu chez les quatre, après des mots corrigés, veut dire que les dix minutes ont sauté un geste. Vous refaites la minute concernée. Vous ne faites pas un séminaire.

Vous tenez une limite : un changement produit qui ajoute une action, un destinataire, ou une donnée, n'est pas une itération. C'est un nouveau cadrage. « Tant qu'on y est, montrons le téléphone » se refuse ici comme au chapitre des données. L'itération répare la promesse. Elle ne la déplace pas.

# Ce qu'on change dans la demande au modèle

Parfois la règle est tenue, les mots sont clairs, les données sont fraîches et permises, et le brief propose quand même la mauvaise action. Là, vous avez le droit de revoir **ce que vous demandez** au modèle : les exemples du jeu, la consigne, les cas où il doit se taire.

Vous n'y venez qu'avec une preuve en quatre points.

1. Le cas est dans la promesse (bon magasin, bonne famille d'action).
2. Les données d'entrée étaient permises et assez fraîches.
3. L'attente métier était écrite avant.
4. Le même type de cas s'est trompé plus d'une fois, pas une seule anecdote.

Sans ces quatre points, « le modèle s'est trompé » est souvent un bug de filtre, un statut trop vieux, ou une attente que vous n'aviez pas tranchée. Revoir la demande au modèle sur une base fausse améliore la mauvaise chose. Vous obtiendrez une phrase plus prudente sur des cas que le produit aurait dû exclure, et vous paierez plus pour un doute que l'écran savait déjà montrer.

Vous ne demandez pas un modèle nouveau parce qu'un directeur a été impressionné par une autre démo. Vous ne promettez pas non plus « on va le réentraîner » comme formule magique. La phrase produit est : on ajoute ces exemples au jeu, on précise la consigne de silence, on rejoue les trente matins, on regarde si les retards inventés baissent sans faire monter les oublis graves. Si le seuil ne revient pas, vous restez sur l'écran de la règle pour les familles concernées. C'est une décision de produit, pas une défaite technique.

```diagram
type: decision
title: "Où va ce retour ?"
nodes:
  - question: "La demande est-elle hors promesse (SMS, classement, question libre) ?"
    yes: "Refus écrit, ou cadrage séparé. On n'itère pas dessus."
    no: "La promesse couvre le sujet. Regardez l'écran et la règle."
  - question: "L'écran, la règle affichée ou les dix minutes expliquent-ils le trou ?"
    yes: "Changez le produit : mots, heure du statut, message si le brief manque."
    no: "Les faits étaient peut-être interdits ou trop vieux. Vérifiez-les d'abord."
  - question: "Cas permis, données fraîches, attente écrite, et la même erreur déjà vue ?"
    yes: "Revoir les exemples et la consigne, puis rejouer le jeu de matins."
    no: "Vous ne touchez pas au modèle. Ce cas n'est pas une preuve."
```

# La revue du vendredi

Vingt minutes, les quatre tas sous les yeux (le quatrième tas, c'est « déjà traité »). Inès pour le client, vous pour la promesse, un responsable pilote en rotation. Pas de liste de quarante lignes.

Vous sortez avec au plus trois décisions.

- Un bug à corriger avant le prochain matin, avec un propriétaire.
- Un changement de mots ou d'écran, testé sur un cas du jeu.
- Un hors promesse répété, que vous remonterez à Léa seulement s'il révèle un vrai problème non couvert (les réclamations ne baissent pas malgré des appels tenus). Le remonter n'est pas l'accepter.

Le reste attend. Une revue qui accepte cinq évolutions par semaine recompose le produit sans signature. Vous le dites aux pilotes : leur retour est classé, pas forcément construit. Le bouton « ce n'est pas un retard » reste le canal des erreurs. Le vendredi n'est pas une boîte à idées.

> [!WARNING]
> « On verra dans le modèle » est le tiroir où les bugs d'écran et les SMS refusés vont se cacher. Le tas d'abord, le modèle en dernier.

Au bout des trois semaines, vous relisez les tas. S'ils sont pleins d'incompréhensions, la formation et les mots ont été faibles, le modèle n'est pas le héros du bilan. S'ils sont pleins de hors promesse, la phrase marketing a encore dérivé, ou le besoin du matin n'était pas celui qu'on a servi. S'ils sont pleins de bugs de magasin et d'heure, vous n'étendez pas, même si les oui de Karim sont flatteurs. L'itération a servi à voir cela tôt. C'est son succès, y compris quand elle dit d'arrêter.

# Exercices

## Exercice 1 : Cinq phrases, trois tas

Classez ces retours. « Le brief de Nantes s'est ouvert à Lille. » « Appeler, ça veut dire que c'est déjà fait ? » « Vous pourriez noter les magasins qui n'appellent pas assez ? » « La ligne grise n'a pas l'heure. » « Il nous faut le SMS, les clients crient. »

<details>
<summary>Voir la solution</summary>

Mauvais magasin : bug. On coupe le jour et on corrige le filtre. « Appeler, c'est déjà fait ? » : incompréhension. On change le libellé en « À appeler par vous » et on rejoue une minute de formation. Noter les magasins : hors promesse, refus. L'heure manquante sur le gris : bug d'écran, la règle de doute n'est pas visible. Le SMS : hors promesse, déjà refusé, on ne le met pas en ticket d'itération.

Chaque phrase a un seul tas. Le SMS et la notation ne se « font en petit » sous prétexte qu'ils sont demandés souvent.

</details>

## Exercice 2 : Le réflexe modèle

Jeudi, un statut de 6 h 20 a reçu une action « appeler » à 8 h 10. Sofia propose de revoir la consigne du modèle dans la journée. Que vérifiez-vous avant, et quel geste est le bon si la règle de fraîcheur n'a pas été appliquée ?

<details>
<summary>Voir la solution</summary>

Le statut a plus de quarante-cinq minutes. La ligne n'aurait pas dû être une action, quelle que soit la phrase du modèle. Ce n'est pas une preuve pour changer la demande au modèle. C'est un trou de produit : la règle de fraîcheur ne s'est pas appliquée avant.

Vous corrigez cette règle et l'écran (gris, heure visible, pas de bouton). Vous ne rejouez la consigne du modèle que plus tard, sur des cas frais, permis, avec attente écrite, et seulement s'ils se trompent encore. Un seul matin trop vieux ne suffit pas à cette preuve.

</details>

## Exercice 3 : La revue bavarde

Vendredi, la liste compte dix-huit retours, dont six variantes du SMS et quatre compliments. L'équipe propose de « prendre les cinq plus votés ». Que sortez-vous de la revue, et que faites-vous des compliments ?

<details>
<summary>Voir la solution</summary>

Vous classez d'abord. Les variantes du SMS sont un seul hors promesse, répété : refus, pas cinq tickets. Les compliments ne sont pas un tas d'action. Vous gardez au plus un bug à corriger avant demain, un changement de mots à retester, et le SMS comme sujet à ne pas glisser.

Vous ne prenez pas les plus votés. Le vote favorise la demande la plus dite, souvent hors promesse. Les pilotes doivent entendre que classer n'est pas construire. Sans cette limite, la revue remplace la signature de Léa.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Classer avant de corriger
center: "Bug, incompréhension, hors promesse. Le produit d'abord. Le modèle seulement avec un cas frais, permis, répété."
points:
  - icon: filter
    title: Trois tas
    text: "Bug : la promesse n'est pas tenue. Incompréhension : les mots. Hors promesse : on refuse ou on recadre."
  - icon: tool
    title: Produit
    text: "Libellé, heure du statut, message d'indisponibilité, minute de formation. Visible dès le lendemain."
  - icon: brain
    title: Modèle en dernier
    text: "Quatre preuves : dans la promesse, données fraîches et permises, attente écrite, erreur répétée."
  - icon: loop
    title: Vendredi
    text: "Vingt minutes, trois décisions au plus. Un vote ne fait pas entrer le SMS dans le brief."
  - icon: shield
    title: Limite
    text: "Ajouter une donnée, une action ou un destinataire n'est pas une itération. C'est un nouveau cadrage."
pitfall: "Répondre « on verra dans le modèle » à un mauvais magasin, à une phrase ambiguë ou à un SMS déjà refusé."
remember: "On itère la promesse signée. Ce qui l'élargit retourne au cadrage, même si tout le monde le demande."
```
