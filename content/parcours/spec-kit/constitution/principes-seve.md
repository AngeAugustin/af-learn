---
title: "Les principes de Sève"
description: "Avant toute spec, les principes de Léa Vernet : huit places, 45 €, attente de 12, décision avant 18 h, pas de téléphone sur la page publique, le serveur refuse la neuvième place."
duration: 50
objectives:
  - "Énoncer les principes de l'atelier avant d'écrire la spec de la confirmation"
  - "Garder les nombres de Léa comme des règles vérifiables, pas comme des exemples"
  - "Interdire le téléphone sur la page publique et faire refuser la neuvième place par le serveur"
  - "Laisser la pile technique hors des principes"
---

# Avant d'écrire la moindre spec

La constitution vient avant la spec. Elle fixe ce que toutes les fonctionnalités de Sève doivent respecter, y compris celle de ce parcours : la confirmation visible et la liste d'attente ordonnée. Vous ne la remplissez pas avec un framework. Vous la remplissez avec les règles de l'atelier, celles que Léa peut contredire si vous les déformez.

Léa Vernet tient Atelier Sève à Lyon, sur les pentes de la Croix-Rousse. Le stage a lieu le samedi, de 10 h à 13 h. Le mois compte douze stages. Le remplissage tourne autour de 70 %. Trois personnes par mois ne viennent pas, parce que le SMS de confirmation a été oublié. L'application liste déjà les stages. Elle refuse déjà la neuvième place. Ces faits cadrent le travail. Les principes, eux, sont les règles qui ne se négocient pas dans une spec.

Vous les écrivez d'abord, une fois pour le projet. La spec de la confirmation viendra après, et elle devra leur obéir. Un principe oublié ici reviendra sous la forme d'une file trop longue, d'un numéro de téléphone affiché, ou d'une neuvième place acceptée par un écran trop poli.

> [!IMPORTANT]
> Les principes se posent avant la spec. Ils décrivent l'atelier. Ils ne décrivent pas la pile qui le codera.

# Les nombres que Léa peut contredire

Quatre nombres tiennent l'atelier. Vous les recopiez tels quels.

- Huit places par stage.
- 45 €.
- Une attente ordonnée, douze personnes au plus.
- La décision de Léa, avant 18 h la veille.

Huit, ce n'est pas « une petite dizaine ». Quarante-cinq euros, ce n'est pas « autour de cinquante ». Douze noms, ce n'est pas une file qui s'allonge le samedi matin. 18 h la veille, ce n'est pas « dans la soirée » ni « le jour même avant le stage ». Léa tranche à cette heure-là : qui a la place, qui reste en attente. Après, la confirmation doit être visible, sinon les trois absents du mois recommencent. Le SMS oublié est exactement ce trou.

Le samedi 10 h-13 h n'est pas un principe « technique ». C'est l'horaire du stage, au même titre que le lieu, la Croix-Rousse. Une spec qui déplace le stage au dimanche a quitté l'atelier, même si le code est plus simple. Douze stages par mois et le remplissage de 70 % expliquent la pression sur les places. Ils ne deviennent pas une phrase à afficher sur chaque fiche. Ils rappellent pourquoi une confirmation fausse coûte une chaise.

> [!NOTE]
> Chaque principe tient dans une phrase que Léa peut nier. « Huit places » se nie. « Une expérience fluide » ne se nie pas.

# Pas de téléphone sur la page publique

La page que voient les élèves ne montre pas le téléphone de Léa. La confirmation ne consiste pas à « appeler l'atelier ». Elle se voit dans l'application, pour la personne qui a une place. Publier un numéro transformerait les trois absents en appels, et la page publique en annuaire.

Ce principe protège aussi l'ordre du travail. Léa décide avant 18 h la veille. Ensuite, la personne concernée doit pouvoir voir où elle en est : place confirmée, ou rang dans l'attente. Un numéro en bas de page est une sortie de secours. Il dispense d'écrire la confirmation visible. Vous ne le mettez pas « en attendant ».

La liste d'attente ordonnée obéit au même esprit. L'ordre se lit dans l'application. On ne téléphone pas au premier de la file pour savoir s'il existe. Douze noms au plus : le treizième ne s'ajoute pas parce que quelqu'un a appelé. Le principe dit non avant que la spec invente un formulaire de contact.

> [!WARNING]
> Un numéro sur la page publique n'est pas une confirmation. La confirmation se voit dans l'application. Le téléphone reste hors de cette page.

# Le serveur refuse la neuvième place

L'application refuse déjà la neuvième place. Le principe le grave pour la suite : le refus n'est pas un filtre d'écran. Le serveur, l'endroit qui accorde la place, dit non à la neuvième demande. Un bouton caché, un second onglet, un formulaire rejoué ne créent pas une chaise de plus.

Huit places, c'est la salle. La confirmation visible ne doit pas dire oui à une neuvième personne pour « garder le contact ». Cette personne entre dans l'attente si la file a encore de la place, douze noms au plus, dans l'ordre. Si la file est pleine, la demande s'arrête. Elle ne devient pas un appel, ni une place grise.

Vous le formulerez comme une règle de l'atelier, pas comme une recette. « Le serveur refuse la neuvième place » suffit. Vous ne nommez pas le langage, ni le fichier, ni le middleware. Le code actuel le fait déjà. La spec de la confirmation et de l'attente s'appuie sur ce refus. Elle ne le déplace pas dans le navigateur seul.

# Un principe n'est pas une pile

La pile viendra au moment du plan, dans un autre chapitre. Ici, elle n'a pas de place. React, un nom de paquet, une base, un hébergeur : aucun de ces mots n'est une règle de Léa. Les mettre dans les principes fige un choix technique au mauvais étage, et il se recopiera dans chaque spec.

Le test est simple. Est-ce que Léa, à l'atelier, peut dire « non, ce n'est pas ça » sans parler d'informatique ? Huit places, oui. 45 €, oui. Attente de douze, oui. Décision avant 18 h la veille, oui. Pas de téléphone sur la page, oui. Le serveur qui refuse la neuvième place, oui : elle voit qu'une neuvième personne n'a pas de siège, même si l'écran a été insistante. « Utiliser tel paquet », non.

```diagram
type: compare
title: "Ce qui entre dans les principes"
columns:
  - title: Principes de l'atelier
    tone: teal
    items:
      - "8 places, 45 €, attente de 12"
      - "Décision avant 18 h la veille"
      - "Pas de téléphone sur la page publique"
      - "Le serveur refuse la 9e place"
  - title: Ailleurs que dans les principes
    tone: rose
    items:
      - "Un framework ou un nom de paquet"
      - "La statistique des 70 % affichée sur la fiche"
      - "Refaire la liste des stages déjà écrite"
      - "Une phrase unique, fais la confirmation"
```

# Ce que la confirmation devra respecter

La fonctionnalité n'est pas encore spécifiée dans ce chapitre. Vous vérifiez seulement qu'elle aura un cadre. La confirmation visible devra montrer la décision de Léa, prise avant 18 h la veille, sans publier son téléphone. La liste d'attente ordonnée devra s'arrêter à douze et ne jamais fabriquer une neuvième place. Le prix restera 45 €. L'horaire restera le samedi, 10 h-13 h.

L'existant reste l'existant. Douze stages du mois déjà listés. Neuvième place déjà refusée par le serveur. Trois absents par mois, SMS oublié : c'est le pourquoi de la confirmation, pas un principe qui changerait le prix. Le remplissage de 70 % explique la tension. Il n'ouvre pas une place de plus.

Quand ces phrases tiennent sans nom de pile, vous êtes prêt à les dicter dans le chat. Le chapitre suivant le fait, une fois pour le projet, puis vous relisez le fichier produit.

> [!TIP]
> Relisez les six règles à voix haute avant d'ouvrir le chat. S'il manque le téléphone ou le serveur, la constitution partira incomplète.

# Exercices

## Exercice 1 : Trier la liste

On vous tend six lignes : « React », « huit places », « le paquet de dates qu'on aime », « 45 € », « pas de téléphone sur la page publique », « le serveur refuse la neuvième place ». Lesquelles sont des principes de Sève ?

<details>
<summary>Voir la solution</summary>

Principes : huit places, 45 €, pas de téléphone sur la page publique, le serveur refuse la neuvième place. Vous y ajoutez, même si cette liste les oublie, l'attente ordonnée de douze et la décision avant 18 h la veille.

React et le nom de paquet ne sont pas des principes. Ils n'entrent pas dans la constitution. La liste des stages existe déjà, le cadre sert à la confirmation visible et à la file ordonnée.

</details>

## Exercice 2 : Le numéro en bas de page

Pour « dépanner » les trois absents, on propose d'afficher le mobile de Léa sur la page du stage. Les élèves appelleraient la veille. Que répond le principe, et quelle trace remplace l'appel ?

<details>
<summary>Voir la solution</summary>

La page publique ne montre pas le téléphone. Les trois absents viennent d'un SMS oublié, pas d'une invitation à appeler. La confirmation se voit dans l'application, après la décision de Léa, avant 18 h la veille.

L'attente reste une liste ordonnée, douze noms au plus. Un appel n'ajoute pas un treizième nom et ne crée pas une neuvième place. Huit places, 45 €, samedi 10 h-13 h : rien de cela ne se négocie par téléphone sur la page.

</details>

## Exercice 3 : Le bouton qui dit oui

L'écran empêcherait un neuvième clic, mais le serveur accepterait encore la demande si on rejoue le formulaire. Est-ce que le principe est tenu ? Que doit-il se passer pour la personne en trop ?

<details>
<summary>Voir la solution</summary>

Le principe n'est pas tenu. Le serveur refuse la neuvième place. Un filtre d'écran seul ne suffit pas : un second envoi ne doit pas créer de chaise.

La personne au-delà de huit entre dans l'attente si la file compte moins de douze noms, dans l'ordre. Sinon la demande s'arrête. La confirmation visible ne dit pas oui pour compenser. Le framework n'est pas le sujet : la règle, si.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Les principes avant la spec
center: "Six règles avant toute spec : 8 places, 45 €, attente 12, décision avant 18 h, pas de téléphone, le serveur refuse."
points:
  - icon: users
    title: Huit places
    text: "La salle en a huit. 45 €, samedi 10 h-13 h, à la Croix-Rousse. Léa peut contredire chaque chiffre."
  - icon: list
    title: Attente 12
    text: "La file est ordonnée et s'arrête à douze. Léa tranche avant 18 h la veille du stage."
  - icon: lock
    title: Pas de téléphone
    text: "La page publique n'affiche pas le numéro. La confirmation se voit dans l'application."
  - icon: server
    title: Le serveur
    text: "Il refuse la 9e place. Un bouton d'écran ne remplace pas ce refus."
  - icon: scale
    title: Pas la pile
    text: "Ni framework, ni nom de paquet. Les principes décrivent l'atelier, pas l'outillage."
pitfall: "Glisser un framework dans les principes, afficher le téléphone, ou laisser le serveur accepter une neuvième place."
remember: "Avant la spec : 8 places, 45 €, attente 12, 18 h, pas de téléphone, le serveur refuse la 9e place."
```
