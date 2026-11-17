---
title: Modéliser le processus cible
description: "Dessiner le to-be de la réception en boîtes et flèches nommées : déclencheur, étapes, décision, exception."
duration: 55
objectives:
  - Partir de la photo déjà faite, sans la redessiner
  - Nommer le déclencheur, les étapes et la fin du geste cible
  - Faire apparaître la décision et l'exception, pas une boîte « gérer »
  - Nommer chaque flèche pour que Rouen et un magasin au terminal racontent le même flux
---

# Le cible, pas une seconde photo

Vous avez déjà le processus d'aujourd'hui et la photo de novembre. À Rouen, Yassine note « un peu mou » dans le carnet noir. Le chauffeur part après environ 35 minutes. Pauline saisit le soir ce qu'elle peut. Sur les quarante magasins, 21 ont le terminal Quai, 12 le tableur, 7 le papier. Deux écarts sur cinq ne sont saisis nulle part.

Ce chapitre ne refait pas cette photo. Il dessine le **to-be**, le geste cible, une fois que Jonas a reconnu le résultat à tenir.

**Avant le départ du chauffeur, chaque palette a une décision tracée : acceptée, refusée ou mise de côté.**

Quatre mots suffisent. Vous pouvez les tracer au crayon.

- **Déclencheur** : ce qui fait démarrer, une fois, de façon observable.
- **Étape** : une action, une boîte, un verbe que Yassine peut finir.
- **Décision** : une question, avec des suites nommées.
- **Exception** : un cas qui sort du chemin, et qu'on n'appelle pas « divers ».

Le losange peut être un rectangle qui porte une question. Le symbole n'est pas le sujet. Le nom l'est.

# Déclencheur, étapes, fin

Le déclencheur ne change pas par rapport à l'existant : **le camion de l'entrepôt est au quai, le bon de livraison est en main.** Pas l'ouverture du magasin. Pas le groupe « Quai Halte ». Pas la correction du soir, qui répare une réception déjà manquée.

Le lundi, ce déclencheur se concentre entre 5 h 30 et 9 h 30, avec 36 palettes (24 de sec, 8 de frais, 4 de surgelé). Vous le notez sur le déclencheur, comme contexte. Vous n'en faites pas une boîte « gérer le pic ».

Les étapes du chemin cible, pour le lundi de Rouen :

1. **Contrôler.** Yassine compare le physique au bon : manquant, casse, température à cœur, vie restante du frais.
2. **Décider.** Chaque ligne reçoit une issue : acceptée, refusée, ou mise de côté.
3. **Tracer.** La décision est écrite avant que le chauffeur parte, avec un motif si ce n'est pas une acceptation simple.

La fin n'est pas « le camion est parti ». La fin est un état : **la livraison du jour a une trace au moment du départ.** Les deux palettes à -16 °C ne partent plus en chambre sous les mots « un peu mou ». Elles sont refusées, et le refus est sur la ligne. Les onze lignes qui différaient du bon ont un motif. Les sept qui restaient au carnet n'existent plus comme oubli.

La mise en rayon du frais (la cible de Jonas, moins de 4 heures après la fin du déchargement) est le résultat d'EM-01. Vous ne la transformez pas en boîte « aller plus vite ». Si vous la dessinez, c'est une suite, après la trace, pas un slogan à l'intérieur du contrôle.

```diagram
type: flow
title: Réception cible, de l'arrivée à la trace
steps:
  - title: Déclencheur
    text: "Camion au quai, bon de l'entrepôt en main"
    tone: blue
  - title: Contrôler
    text: "Manquant, casse, température à cœur, vie restante"
    tone: teal
  - title: Décider
    text: "Accepter, refuser ou mettre de côté, ligne par ligne"
    tone: amber
  - title: Tracer
    text: "Motif écrit avant le départ du chauffeur"
    tone: violet
  - title: Fin
    text: "La livraison a une trace. Le soir ne réinvente pas le quai"
    tone: rose
```

```video
url: https://www.youtube.com/watch?v=Eutdbh03W5k
title: "The Only BPMN Tutorial You Will Ever Need To Watch (For Beginners)"
channel: "Stefano - The Agile Business Analyst"
duration: "19:16"
lang: en
why: "Un tutoriel BPMN pour débutants : événements, tâches, passerelles et couloirs, la notation la plus répandue pour dessiner un processus."
```

# La décision et l'exception

La décision n'est pas « y a-t-il un problème ? ». Cette question ramène le carnet. La décision cible se lit sur la ligne :

**Cette palette est-elle acceptée, refusée, ou mise de côté ?**

Trois suites, trois noms.

- **Acceptée.** Le physique correspond au bon, la règle de Jonas est tenue (surgelé à -18 °C ou plus froid, frais avec au moins 2 jours de vie restante). Rien à motiver d'autre.
- **Refusée.** La palette ne part pas en rayon ni en chambre. Motif obligatoire : température, casse, DLC. Les deux palettes à -16 °C prennent cette suite, pas la chambre.
- **Mise de côté.** On ne sait pas encore, ou la palette n'aurait pas dû être là. Elle n'entre pas en stock « pour débloquer le quai ».

Une boîte « Gérer les écarts » cache les trois suites. Pauline, le soir, y mettra une correction. Thomas y entendra un appel. Claire y mettra un passage au rayon. La décision oblige à choisir.

L'exception n'est pas une quatrième humeur. C'est un autre cas, avec une sortie interdite.

**Non commandé ou doublon.** La palette n'est pas sur le bon. On ne crée pas une ligne « pour ne pas bloquer le chauffeur ». Mise de côté, Thomas est prévenu, rien n'entre en stock. C'est déjà l'exception de l'existant. La cible la garde, et elle l'écrit. Aujourd'hui, elle se perd avec le départ du camion.

Vous ne mettez pas sur ce dessin le choix entre -18 °C et -15 °C. Neuf magasins pratiquent -15 °C. Tant qu'Amina n'a pas tranché pour le réseau, la règle reste celle du siège, portée par Jonas : au-dessus de -18 °C, refus. Le dessin cible suit cette règle. Il ne dessine pas quarante politiques.

> [!IMPORTANT]
> La sortie interdite : faire entrer en stock une palette refusée, mise de côté, ou absente du bon, pour que le chauffeur parte.

# Nommer les flèches

Une flèche « suivant » se lit autrement à Rouen et dans un magasin au terminal. Le nom dit ce qui passe, ou à quelle condition.

| Flèche | Ce qu'elle transporte |
| --- | --- |
| Bon en main | Le camion est là, on peut contrôler |
| Contrôle fait | Température, casse, manquant et DLC ont été regardés |
| Acceptée | La ligne part vers le rayon ou la chambre, sans motif d'écart |
| Refusée | Motif écrit, pas de mise en stock |
| Mise de côté | Pas en stock, la suite n'est pas un oubli |
| Non commandée | On quitte le chemin, rien n'est inventé sur le bon |

Vous lisez le lundi de Rouen à voix haute. « Camion au quai, bon en main. Contrôle fait. Deux palettes à -16 °C, refusées, motif température. Onze lignes en écart, motif avant le départ. » Si vous devez ajouter « et Pauline verra », la fin n'est pas atteinte : la trace ne doit pas l'attendre.

Le même dessin vaut pour les 21 magasins au terminal et pour les 7 au papier. L'outil n'est pas une flèche. « Ouvrir Quai » n'est pas une étape. L'étape est « tracer la décision ». L'écran, le tableur ou la feuille viendront dans le parcours. Les mettre ici oblige à redessiner le métier chaque fois que Sarah touche le terminal.

# Ce que vous ne dessinez pas

Vous n'avez pas besoin de couloirs, de minuteries, ni de trois familles de branchements. Yassine doit pouvoir suivre le dessin debout, entre deux palettes. Un spécialiste de notation pourra enrichir plus tard. Le quai, lui, a besoin des noms.

Vous ne redessinez pas l'existant à côté, « pour comparer », dans le même flux. La comparaison est un autre travail : aujourd'hui la trace meurt au départ, demain elle existe. Mélanger les deux dans une boîte produit des magasins qui font les deux, le carnet et la case.

Vous ne dessinez pas la correction du soir. Elle est le contournement. La mettre dans la cible, c'est officialiser l'oubli. Vous ne dessinez pas l'inventaire du mois, ni la commande du mardi. Vous notez le lien (un écart non tracé fausse le stock de Jonas) sans en faire une étape.

Enfin, vous vous arrêtez au départ tracé. L'appel de Thomas le lendemain, le linéaire de Claire, la médiane de 5 h 20 sont des suites ou des indicateurs. Les coller ici donne un dessin que personne ne relit le lundi.

> [!WARNING]
> Un to-be qui contient l'écran, le seuil en débat, la correction du soir et l'inventaire n'est plus un processus. C'est le réseau entier, illisible.

# Exercices

## Exercice 1 : Les boîtes du lundi

Pauline résume : « Il faudrait fluidifier, gérer les problèmes, et être plus rigoureux sur le surgelé. » Réécrivez le to-be du lundi de Rouen en déclencheur, étapes, décision et fin.

<details>
<summary>Voir la solution</summary>

Déclencheur : camion au quai, bon en main. Le pic (36 palettes, 5 h 30 à 9 h 30) est le contexte, pas une boîte.

Étapes : contrôler (manquant, casse, température, vie restante), puis tracer la décision avant le départ.

Décision, sur chaque ligne : acceptée, refusée, ou mise de côté. Les deux palettes à -16 °C sont refusées, motif température. Elles ne partent pas en chambre.

Fin : les onze lignes en écart ont un motif au moment où le chauffeur part. Les sept qui restaient au carnet sont tracées elles aussi. Pauline ne reconstitue plus le quai le soir.

« Fluidifier » et « être rigoureux » ne se terminent pas. « Gérer » cache les trois suites.

</details>

## Exercice 2 : Nommer l'exception

Un dessin ramène la palette en trop dans « Contrôler », avec une flèche « réessayer ». Le chauffeur klaxonne. Que changez-vous, et qu'interdisez-vous ?

<details>
<summary>Voir la solution</summary>

Vous sortez le cas du chemin. Exception « non commandée ou doublon » : mise de côté, Thomas prévenu, aucune entrée en stock, le bon n'est pas réécrit.

La flèche s'appelle « non commandée », pas « réessayer ». Réessayer pour libérer le quai invente une ligne. C'est la sortie interdite, la même que pour une palette refusée qu'on ferait entrer « en attendant ».

Le refus à -16 °C n'est pas cette exception. C'est la suite « refusée » de la décision, avec le motif température.

</details>

## Exercice 3 : Lire les flèches

Cinq flèches s'appellent « suivant ». Remplacez-les pour Rouen, puis lisez le chemin des deux palettes à -16 °C.

<details>
<summary>Voir la solution</summary>

« Bon en main », « contrôle fait », puis « refusée » (les autres suites s'appellent « acceptée » et « mise de côté »). La flèche d'exception s'appelle « non commandée ». La fin s'appelle « trace écrite avant le départ », pas « fin ».

Lecture : « Camion au quai, bon en main. Contrôle fait. Deux palettes à -16 °C, refusées, motif température, pas de mise en chambre. Trace écrite avant le départ. » Si la phrase a besoin de Pauline le soir, la flèche n'est pas encore la cible.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Le processus cible
center: "Le to-be trace la décision avant le départ. Un déclencheur, des étapes, une décision, une exception. Chaque flèche a un nom."
points:
  - icon: zap
    title: Déclencheur
    text: "Le camion est au quai et le bon est en main. Le groupe « Quai Halte » ne démarre rien."
  - icon: list
    title: Étapes
    text: "Contrôler, puis tracer. Une boîte est un verbe que Yassine sait terminer."
  - icon: scale
    title: Décision
    text: "Acceptée, refusée ou mise de côté. À -16 °C, on refuse. On n'écrit pas « un peu mou »."
  - icon: alert
    title: Exception
    text: "Palette absente du bon : mise de côté, rien en stock. On n'invente pas une ligne."
  - icon: compass
    title: Flèches
    text: "« Contrôle fait », « refusée ». Le nom dit ce qui passe, pas « suivant »."
pitfall: "Redessiner l'écran Quai, la correction du soir et l'inventaire dans le même flux."
remember: "Si la flèche n'a pas de nom, Rouen et un magasin au terminal ne jouent pas le même geste."
```
