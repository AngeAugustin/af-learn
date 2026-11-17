---
title: "Donner le bon contexte avec @"
description: "Citer avec @ le fichier, le dossier ou la règle utiles à la page des stages, sans noyer le modèle dans le dépôt."
duration: 50
objectives:
  - "Citer un fichier, un dossier ou une règle avec @ dans le chat"
  - "Limiter le contexte à ce que l'incrément en cours doit vraiment lire"
  - "Pour la page des stages, citer le composant de liste et le jeu de données"
  - "Relire les pièces attachées avant d'envoyer la demande"
---

# @ désigne, le modèle ne devine pas

Le chat peut chercher dans le dépôt. Il cherche mieux quand vous désignez. Le signe **@** dans le champ ouvre une liste : un fichier, un dossier, une règle. Vous choisissez, la pièce s'attache au message. L'agent part de là, au lieu de deviner quels fichiers parlent des stages.

Atelier Sève, Lyon Croix-Rousse. Léa Vernet, céramiste, tient 12 stages par mois, le samedi de 10 h à 13 h, 8 places, 45 €. La liste d'attente est plafonnée à 12. Léa confirme ou refuse avant 18 h la veille. Le remplissage actuel est de 70 %. 3 absents en moyenne par mois, parce que la confirmation est un SMS oublié. L'application s'appelle Sève.

Pour la page qui liste les 12 stages, deux pièces suffisent : le composant de liste, et le jeu de données des dates. Le reste du dépôt (formulaire, file d'attente, texte de confirmation) existe ou existera. Le citer maintenant mélange les incréments. @ n'est pas une façon polie de dire « lis tout ». C'est un choix.

> [!IMPORTANT]
> Chaque pièce attachée prend de la place dans le message. Une pièce inutile chasse les 8 places et les 45 €, qui sont courts et faciles à perdre au milieu d'un dépôt entier.

# Fichier, dossier, règle

Trois cibles, trois usages.

- **Un fichier**, quand vous savez lequel. Le jeu des 12 dates, le composant qui les affiche. L'agent lit celui-là, pas son voisin.
- **Un dossier**, quand l'incrément tient dans un petit groupe de fichiers et que vous ne voulez pas en oublier un. Le dossier de la page des stages, pas la racine du dépôt.
- **Une règle**, quand la contrainte doit être dans ce message précis. Vous tapez @ puis le nom de la règle. Une règle manuelle n'entre pas toute seule : @ est le geste qui la joint.

Vous ne citez pas un dossier « pour être sûr ». Un dossier large ramène des fichiers de paiement, d'envoi, de style, et l'agent s'en sert. Sur Sève, le dossier utile du premier incrément est celui de la liste. Le dossier de l'attente attendra l'incrément 3, plafond 12, ordre conservé.

Le nom affiché sous le champ, après @, doit être le vôtre. Si la liste a proposé un fichier au nom proche (une vieille page, un essai de SMS), vous effacez la puce et vous recommencez. Une citation fausse est pire qu'une absence : l'agent suit le mauvais texte avec confiance.

# Trop de fichiers noie le modèle

« Noyer » est concret. Le modèle lit ce que vous avez attaché, plus ce qu'il va chercher. Si vous attachez vingt fichiers, les chiffres de l'atelier deviennent des détails parmi d'autres : 12 stages, 8 places, 45 €, attente 12, 18 h, 70 %, 3 absents. Il en gardera quelques-uns. Pas forcément les bons.

Les signes d'un contexte trop large, sur la page des stages :

- le diff modifie le formulaire alors que vous parliez d'affichage ;
- une 9e place apparaît « parce que le fichier d'attente était joint » ;
- le prix bouge, ou le samedi de 10 h à 13 h devient une plage inventée ;
- le chat résume l'atelier au lieu de montrer les 12 dates.

Vous retirez des puces, vous renvoyez. Ajouter encore un fichier ne répare pas un message déjà noyé. Un fil noyé se ferme. Le suivant ne cite que la liste et les données.

```diagram
type: compare
title: Contexte de la page des stages
columns:
  - title: Dépôt entier
    tone: rose
    items:
      - "Racine, essais, SMS, paiement"
      - "Les 8 places se perdent dans la masse"
      - "Le diff déborde sur l'incrément suivant"
  - title: Deux pièces
    tone: teal
    items:
      - "Le composant de liste"
      - "Le jeu des 12 dates"
      - "Date, 8 places, 45 €, places restantes"
```

# La page des stages : deux citations

Le message type du premier incrément :

« @composant de liste @jeu de données. Affiche les 12 stages du mois. Chaque ligne : la date, 8 places, 45 €, les places restantes. Ne touche pas au formulaire, ni à l'attente, ni à la confirmation. »

Les noms réels viennent de l'arbre, pas de cette phrase. Vous tapez @, vous choisissez le fichier de liste, vous tapez @, vous choisissez le fichier des dates. Si le jeu de données n'a pas encore les 12 samedis, vous le dites : l'agent doit les écrire là, pas dans un troisième fichier surprise.

Vous ne joignez pas le récit des 70 %. Le remplissage se verra par les places restantes, une fois les réservations comptées sur 8. Vous ne joignez pas le SMS. Les 3 absents expliquent pourquoi la confirmation viendra, ils n'expliquent pas la liste.

Ce que vous ne citez pas encore, même s'il est déjà dans le dépôt :

- le formulaire, incrément 2, celui qui refuse la 9e place ;
- la liste d'attente, incrément 3, plafonnée à 12, dans l'ordre ;
- l'écran de confirmation, incrément 4, où Léa tranche avant 18 h la veille.

Les citer « pour que l'agent ait le contexte métier » est précisément ce qui fait écrire l'incrément 4 dans le diff de l'incrément 1.

# Relire les puces avant d'envoyer

Avant la touche envoi, vous lisez la ligne des pièces attachées comme vous lirez le diff.

1. Nombre de puces : deux, pour cette page, pas quinze.
2. Nature : un composant de liste, un jeu de données. Pas un dossier racine.
3. Mode : Agent si le changement est clair et petit, Plan si vous ne savez pas encore quels fichiers autour de ces deux-là. @ ne choisit pas le mode. Shift+Tab le fait.
4. Phrase : le résultat nommé est dans le message, pas seulement dans votre tête.

Si vous avez attaché une règle, elle doit être la règle courte de cet incrément. « Une réservation ne dépasse jamais 8 places » a du sens dès que la page affiche un reste. Un roman sur la Croix-Rousse, collé par @, noie autant qu'un dossier entier.

> [!TIP]
> Quand vous hésitez entre deux fichiers, citez le plus petit des deux et dites ce que vous voulez y voir. L'agent peut ouvrir un voisin. Il le fera dans le diff, que vous lirez. Un dossier « par précaution » ne se lit pas, lui, avant l'envoi.

# Le même geste aux incréments suivants

Le geste ne change pas, les pièces changent.

- Incrément 2 : le formulaire, et le fichier qui connaît les 8 places. Pas les 12 dates en entier si elles ne servent pas à refuser la 9e.
- Incrément 3 : la file d'attente et la règle de plafond 12. L'ordre d'arrivée doit être dans le fichier cité, pas raconté de mémoire.
- Incrément 4 : l'écran de confirmation et la règle « Léa tranche avant 18 h ». Pas le module d'envoi de SMS, qui est le problème actuel, pas la solution visible.

À chaque fois, vous retirez les puces de l'incrément précédent si elles ne servent plus. Une conversation qui garde toutes les citations depuis le premier jour finit noyée, même si chaque @ était juste au moment où vous l'avez ajouté.

# Exercices

## Exercice 1 : Quelles puces

Vous ouvrez le chat pour la page des 12 stages. L'arbre contient le composant de liste, le jeu de données, un essai de SMS, un brouillon de paiement, et la racine. Que citez-vous avec @ ?

<details>
<summary>Voir la solution</summary>

Le composant de liste et le jeu de données. Rien d'autre.

L'essai de SMS rappelle les 3 absents, le brouillon de paiement n'est pas un incrément de Sève, la racine noie le modèle. La demande dit : 12 stages du mois, date, 8 places, 45 €, places restantes. Vous vérifiez les deux puces avant d'envoyer.

</details>

## Exercice 2 : Le dossier de trop

Un collègue a collé @ sur le dossier racine « pour que l'agent comprenne Léa ». Le diff modifie la liste, ajoute un bouton d'attente, et passe une place de 8 à 9. Que s'est-il passé, et que renvoyez-vous ?

<details>
<summary>Voir la solution</summary>

Le dossier entier a mélangé l'incrément 1 (la page), l'incrément 3 (l'attente, plafond 12) et la règle des 8 places. L'agent a suivi un contexte trop large. Vous rejetez le diff.

Vous rouvrez un message avec deux citations seulement : composant de liste, jeu de données. Vous répétez : 8 places, 45 €, pas de bouton d'attente, pas de 9e place. Vous ne rajoutez pas de fichiers « pour corriger ». Vous en retirez.

</details>

## Exercice 3 : Citer une règle

La page existe. Vous passez au formulaire qui doit refuser la 9e place. Une règle manuelle, « une réservation ne dépasse jamais 8 places », n'est pas incluse toute seule. Comment la joignez-vous, et que ne joignez-vous pas ?

<details>
<summary>Voir la solution</summary>

Vous tapez @ et vous choisissez cette règle, plus le fichier du formulaire. La règle manuelle n'entre que si vous la citez. Le message dit : refuser la 9e place, sur un stage de 8.

Vous ne citez pas la liste d'attente, ni l'écran où Léa confirme avant 18 h, ni le jeu complet des 12 dates si le formulaire n'a pas à les redessiner. Deux ou trois pièces justes, pas le dépôt au motif que 70 % de remplissage « fait partie du contexte ».

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Citer peu
center: "Avec @, vous désignez un fichier, un dossier ou une règle. Deux pièces valent mieux que le dépôt."
points:
  - icon: link
    title: Le signe @
    text: "Ouvre la liste. Fichier, dossier ou règle. Le nom affiché doit être le bon."
  - icon: file
    title: Deux pièces
    text: "Pour la page : le composant de liste et le jeu des 12 dates. Pas la racine."
  - icon: filter
    title: Pas encore
    text: "Ni formulaire, ni attente plafonnée à 12, ni confirmation avant 18 h."
  - icon: alert
    title: Noyade
    text: "Vingt fichiers, et 8 places ou 45 € deviennent un détail que le diff oublie."
  - icon: eye
    title: Relire les puces
    text: "Avant l'envoi, compter les pièces. Une puce fausse se retire, elle ne se corrige pas en en ajoutant."
pitfall: "Citer la racine du dépôt pour « donner le contexte », puis accepter un diff qui mélange les incréments."
remember: "Page des stages : @liste et @données, phrase avec 8 places et 45 €. Le reste attend son incrément."
```
