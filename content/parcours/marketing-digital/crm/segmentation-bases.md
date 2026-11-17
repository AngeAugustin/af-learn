---
title: Segmentation et bases
description: "Tenir une base propre, séparer le consentement de l'adresse de commande, et n'écrire qu'à des segments qui déclenchent un geste."
duration: 55
objectives:
  - "Dire ce qu'une base propre contient, et ce qu'on en retire"
  - "Séparer l'e-mail de commande du consentement pour la newsletter"
  - "Construire des segments qu'on peut nommer par un geste"
  - "Refuser d'écrire à toute la base parce que c'est plus simple"
---

# Une adresse n'est pas un client

Nora tient la base de l'Atelier Lumen. Elle a des adresses, pas « une communauté ». Une adresse devient utile quand on sait **d'où elle vient**, **ce qu'on a le droit de lui dire**, et **ce que la personne a déjà fait** : une commande à 42 €, un coffret à 78 €, un panier laissé, rien.

L'équipe est de quatre. Léa décide l'offre. Vous décidez ce que la pub a le droit de promettre. Samir sait si la bougie part en 48 h. Nora refuse d'envoyer à des gens que les trois autres « ajoutent vite fait » dans un tableur. Une base sale fait écrire aux mauvaises personnes, puis elle abîme la délivrabilité : les messages aux vrais clients n'arrivent plus.

Une base propre, version Lumen, tient en peu de colonnes. Adresse, date d'entrée, origine (commande, formulaire, panier), consentement newsletter oui ou non, date du dernier achat, nombre de commandes, montant du dernier panier, désinscription, rebond. Pas de colonne « semble aimer le bien-être ». Si vous ne pouvez pas la remplir avec un fait, elle n'existe pas.

# Propre veut dire retiré, pas seulement ajouté

On retire, chaque semaine, sans débat.

- Les **rebonds** : l'adresse n'existe pas. La garder ne fait que des erreurs.
- Les **désinscrits** : ils ont dit non. Un second envoi « au cas où » est une faute, pas une relance.
- Les **doublons** : la même personne deux fois, souvent une avec une commande et une sans. Vous fusionnez, vous ne lui écrivez pas deux fois le même texte.
- Les adresses **achetées** ou copiées « d'un ancien fichier ». Elles n'entrent pas. Lumen n'a pas le droit de s'inventer une audience parce que le mois est calme.

On garde la trace de la commande même si la personne refuse la newsletter. La facture et le suivi du colis partent quand même : c'est l'exécution de la commande, pas une campagne. Nora ne range pas ces adresses dans le segment « à qui on peut proposer une nouveauté ».

> [!WARNING]
> Une case cochée d'avance sur le paiement n'est pas un consentement. C'est une adresse piégée. Elle gonfle la base et elle se plaint, à raison.

```diagram
type: flow
title: "Une adresse entre, ou elle n'entre pas"
steps:
  - title: "D'où vient-elle ?"
    text: "Commande, formulaire, ou panier. Jamais une liste achetée."
    tone: violet
  - title: "Quel droit ?"
    text: "Suivi de colis, ou newsletter séparée, case non cochée d'avance."
    tone: blue
  - title: "Quel fait ?"
    text: "Dernier achat, nombre de commandes, panier. Pas une impression."
    tone: teal
  - title: "Quel geste ?"
    text: "Si aucun e-mail précis ne correspond, on n'écrit pas."
    tone: amber
```

# Consentement et commande ne sont pas le même oui

Deux files.

**La commande** autorise les messages pour **cette** commande : accusé, paiement, expédition, un mode d'emploi court de la bougie achetée. La personne a payé 42 € ou 78 €. Elle doit savoir où est le colis. Ce n'est pas une occasion d'ajouter une promo.

**La newsletter** autorise les nouvelles, et seulement si la personne a coché une case **à part**, non préremplie, avec une phrase lisible. « Recevoir les nouvelles de l'atelier, une à deux fois par mois. » Pas « et nos partenaires ». Léa n'a pas de partenaires à qui revendre ces adresses. Si un jour elle en voulait, ce serait un autre texte, un autre oui. Aujourd'hui, la finalité s'arrête à Lumen.

Le panier abandonné est un cas étroit. La personne a saisi son adresse pour commander et n'a pas payé. Nora s'autorise **un** rappel de **ce** panier, avec un lien de désinscription, sans en profiter pour l'inscrire à la newsletter. Pas de deuxième rappel « avec 20 % ». Le chapitre sur les scénarios écrit la mécanique. Ici, le principe : un geste, une finalité, pas un tuyau vers tous les envois.

# Des segments qu'on peut agir, pas décrire

Un segment est actionnable quand vous pouvez finir la phrase : « À ces gens-là, cette semaine, on envoie **ceci**, et pas autre chose. »

| Segment | Fait qui le définit | Geste | On n'y met pas |
| --- | --- | --- | --- |
| Nouveau client | Commande payée depuis moins de 30 jours | Mode d'emploi, pas de promo | Une réduction « de bienvenue » |
| Un seul achat, 45 à 70 jours | Pas de deuxième commande | Un seul rappel de réachat, prix normal | Un code à toute la base |
| Panier < 48 h | Adresse saisie, pas payé | Un rappel du panier | Une inscription forcée |
| Dormant | Dernier achat > 120 jours, consentement oui | Un message par trimestre, au plus | Un envoi chaque vendredi |
| Refus | Désinscrit ou pas de consentement | Suivi de commande seulement | Toute nouveauté |

« Femmes de 25 à 44 ans » n'est pas un segment de travail. Nora ne sait pas quoi leur écrire de différent. « A acheté la bougie pluie il y a 60 jours, pas de seconde commande, consentement oui » : elle sait. Le message parle de cette bougie, du temps de brûlage, du prix de 42 €, pas d'une catégorie d'âge.

L'équipe de quatre ne tient pas vingt segments. Cinq, revus, valent mieux que vingt figés. Un segment sans envoi prévu depuis deux mois se supprime ou se justifie. Sinon c'est une étiquette.

```video
url: https://www.youtube.com/watch?v=OYohJxp2l9k
title: "RFM analysis for customer segmentation and loyalty marketing"
channel: "Algonomy"
duration: "2:30"
lang: en
why: "La segmentation RFM (récence, fréquence, montant) résumée en deux minutes et demie."
```

# Ne pas écrire à tout le monde

Écrire à toute la base est la décision par défaut des outils, parce que c'est un bouton. C'est rarement la bonne. Une promo de 20 % à tout le fichier apprend à ceux qui auraient payé 42 € qu'il fallait attendre. Elle écrit aussi aux clients de la semaine, qui viennent de payer plein tarif, et aux dormants qui ne vous lisent plus et marquent le message comme indésirable.

Le coût n'est pas seulement la marge (un panier à 33,60 € ne laisse plus que 20,16 €). C'est la confiance, et la boîte de réception. Quelques plaintes, et les e-mails de suivi de Samir (le colis, le délai) arrivent en indésirables eux aussi.

Avant chaque envoi, Nora répond à quatre questions. Qui exactement (le segment, un nombre) ? Quel droit (commande ou consentement) ? Quel geste unique ? Quel silence pour les autres ? Si la quatrième réponse est « on leur écrit quand même, pour ne pas les oublier », l'envoi n'est pas prêt.

> [!TIP]
> Affichez l'effectif du segment à côté du bouton d'envoi. « 140 personnes, un seul achat, jour 45 à 70 » se décide. « Toute la base, 4 000 » se regrette.

# Exercices

## Exercice 1 : Cette adresse entre-t-elle ?

Classez quatre adresses. A. Case newsletter cochée par la personne, formulaire « nouvelles de l'atelier ». B. Commande payée, case newsletter laissée vide. C. Fichier acheté « amateurs de déco, 10 000 adresses, 200 € ». D. Client qui a cliqué sur se désinscrire mardi.

<details>
<summary>Voir la solution</summary>

A entre dans la newsletter. Origine formulaire, consentement oui, finalité écrite. On ne lui ajoute pas d'autres enseignes.

B entre dans la file commande. Accusé, expédition, mode d'emploi de la bougie achetée. Elle n'entre pas dans la newsletter. La case vide n'est pas un oui.

C n'entre pas, même à 200 €. Liste achetée, pas de relation, pas de consentement. L'argent serait perdu deux fois : à l'achat du fichier, puis en plaintes.

D sort de tout envoi commercial le jour même. S'il a une commande en cours, le suivi du colis peut encore partir. Une nouveauté, non.

</details>

## Exercice 2 : Réécrire un segment vague

Léa propose : « Les gens qui aiment les cadeaux, plutôt jeunes, on leur envoie le coffret à 78 € et un code de 20 %, à toute la base pour être sûrs. » Réécrivez un segment actionnable.

<details>
<summary>Voir la solution</summary>

« Aiment les cadeaux » et « plutôt jeunes » ne sont pas des faits dans la base. Toute la base n'est pas un segment.

Version tenable : consentement newsletter oui, au moins une commande, pas d'achat depuis 45 jours, pas de désinscription. Effectif compté avant envoi. Message unique sur le coffret à 78 €, prix normal, parce que deux bougies s'offrent. Pas de code de 20 % dans le même envoi. Les clients de moins de 30 jours sont dehors : ils viennent de payer, on ne leur réécrit pas une offre. Les dormants de plus de 120 jours ont leur propre message, pas celui-ci.

Si Nora ne peut pas compter l'effectif, le segment n'est pas prêt.

</details>

## Exercice 3 : Le bouton « toute la base »

L'outil propose d'envoyer « −20 % jusqu'à dimanche » aux 4 000 adresses, y compris 300 désinscrits « pour ne pas les froisser en les oubliant », et 800 clients qui ont commandé cette semaine. Marge 60 %, panier habituel 42 €. Que décidez-vous ?

<details>
<summary>Voir la solution</summary>

Vous n'envoyez pas. Les 300 désinscrits ne reçoivent rien : les oublier commercialement est exactement ce qu'ils ont demandé. Les 800 de la semaine ont payé 42 €. Leur montrer −20 % trois jours plus tard leur apprend qu'ils ont eu tort de ne pas attendre.

Sur le fond, 20 % font un panier à 33,60 € et une marge à 20,16 €, avant même une pub à 18 €. Écrire à 4 000 personnes pour ça abîme la délivrabilité en plus de la marge. S'il faut un geste, il vise un segment compté, avec consentement, une seule idée, et les clients récents en sont exclus.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Base et segments"
center: "Une adresse n'est pas un droit d'écrire. On n'envoie qu'à un segment qu'on peut compter, avec un seul geste."
points:
  - icon: database
    title: "Colonnes de faits"
    text: "Origine, consentement, dernier achat, nombre de commandes. Pas une impression sur le bien-être."
  - icon: shield
    title: "Deux oui"
    text: "La commande autorise le colis. La newsletter est une case à part, jamais cochée d'avance."
  - icon: filter
    title: "Segment utile"
    text: "Un seul achat, jour 45 à 70, consentement oui. On sait quelle phrase envoyer, et à combien de gens."
  - icon: alert
    title: "On retire"
    text: "Rebonds, doublons, désinscrits, listes achetées. Une base propre est d'abord une base allégée."
  - icon: users
    title: "Pas tout le fichier"
    text: "4 000 adresses et un code de 20 % apprennent au client à attendre, et froissent ceux qui viennent de payer."
pitfall: "Cocher la newsletter à la place du client, puis lui envoyer −20 % avec ceux qui se sont désinscrits."
remember: "Qui, quel droit, quel geste, qui reste en silence. Si la quatrième réponse flanche, l'envoi n'est pas prêt."
```
