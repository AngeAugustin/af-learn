---
title: "Périmètre et exigences"
description: "Tenir le dedans et le dehors de Halte, écrire des exigences et des critères d'acceptation en langage métier, sans cahier de quatre-vingts pages."
duration: 60
objectives:
  - "Tracer ce qui est dans le périmètre, dehors, et reporté à plus tard"
  - "Rédiger une exigence que le magasin et le client peuvent reconnaître"
  - "Écrire un critère d'acceptation observable, en langage métier"
  - "Garder un cahier court, et une liste explicite de ce qui reste ouvert"
---

# Dedans, dehors, plus tard

Le périmètre dit ce que le projet s'engage à produire, et ce qu'il s'interdit de produire dans le même effort. Sans cette ligne, l'objectif de fin août est une ambition, et chaque réunion ajoute un livrable. Avec cette ligne, une demande a une case : dedans, dehors, ou plus tard.

**Dedans**, pour Halte, ce qui est nécessaire aux trois seuils et à l'obligation du 1er septembre :

- une règle de date ou de créneau pour la livraison à domicile et pour le retrait ;
- l'affichage de cette information avant paiement, sur le parcours de commande actuel ;
- le geste magasin pour préparer le retrait et remettre au transporteur, y compris le colis incomplet et le client absent ;
- un contrat cadre avec le transporteur retenu, et la sortie propre des tournées locales que ce contrat remplace ;
- la formation des quarante magasins et la bascule par vagues ;
- la mesure de la tenue et des réclamations pour 1 000 commandes, avec la définition signée.

**Dehors**, ce qui ne sera pas fait dans ces six mois, même si c'est voisin :

- refonte du site ou nouvelle application mobile ;
- livraison le dimanche ;
- changement de caisse, de catalogue ou de programme de fidélité ;
- corners en grand magasin (Halte n'en a pas dans les quarante intégrés, et on ne les ajoute pas « pour voir ») ;
- baisse chiffrée du coût de transport comme résultat dû.

**Plus tard**, ce qui est désirable et volontairement reporté, pour ne pas le perdre dans un oubli vexé :

- SMS de retard, si le pilote montre que l'affichage ne suffit pas à faire chuter les réclamations ;
- choix fin matin ou après-midi sur toutes les zones, si le créneau large tient déjà 90 % ;
- historique client des livraisons ratées dans l'outil du service réclamations.

« Plus tard » n'est pas un dedans déguisé. Cela n'entre pas dans l'estimation des six mois et n'a pas de lot dans le découpage actuel. Si Léa veut le ramener, c'est une décision de périmètre, avec ce qu'on sort ou ce qu'on paie en plus des 420 000 €. Vous ne le glissez pas « parce que Sofia a un peu de temps ».

La frontière la plus disputée sera le parcours de commande. « Afficher un créneau » est dedans. « Rendre le tunnel plus moderne » est dehors. Vous l'écrivez avec un exemple, pas avec un adjectif. Dedans : le client voit « retrait demain avant 18 h » avant de payer. Dehors : on ne change pas la photo, le panier, ni l'ordre des étapes.

> [!IMPORTANT]
> Un élément sans case est déjà dedans, dans la tête de quelqu'un. La case se choisit en cadrage, pas au moment où la personne a commencé à le construire.

# Une exigence que le métier reconnaît

Une exigence décrit ce que le résultat doit permettre, du point de vue de celui qui s'en sert. Elle ne décrit pas encore l'écran, le tableau ou le paragraphe de contrat. Si la phrase n'est pas relisible par Karim et par Inès sans dictionnaire de projet, elle n'est pas mûre.

Exigences de Halte, volontairement peu nombreuses :

1. Avant de payer, le client voit une date ou un créneau pour la livraison, ou pour le retrait, selon le mode qu'il a choisi.
2. Le magasin sait, sans appeler le siège, quoi faire d'un colis incomplet, d'un client absent, et d'un retrait arrivé avant la préparation.
3. Le transporteur retenu annonce un créneau qu'il est capable de tenir sur les zones des magasins basculés, et le magasin sait quel jour remettre le colis.
4. Un directeur de magasin voit, pour sa vague, quels magasins sont basculés et quelle tenue de créneau ils ont eue.
5. Le mot affiché au client ne promet pas plus que la règle (pas de « garanti » si le juridique a dit que le mot engage au-delà du créneau).

Ce qui n'est pas une exigence : « l'expérience doit être fluide », « le processus doit être optimisé », « le reporting doit être moderne ». Ces phrases n'ont pas de contraire observable. Personne ne signera l'inverse, et personne ne saura dire si c'est fini.

Vous écrivez l'exigence à la voix de l'utilisateur. « Le client voit » vaut mieux que « le système affiche ». « Le magasin sait trancher » vaut mieux que « une fonctionnalité de gestion des exceptions sera implémentée ». Le second vocabulaire pousse Sofia à inventer un outil là où une procédure d'une page, tenue par Marc et Karim, suffit peut-être. L'exigence ne choisit pas le moyen. Le moyen vient après, et il doit rester le plus simple qui satisfait la phrase.

Chaque exigence a un propriétaire métier : Inès pour la phrase client, Marc pour le geste de remise, Antoine pour ce que le contrat doit permettre, Julien pour ce que le directeur doit pouvoir lire, Nadia pour le mot juste au sens de la recette. Vous en êtes le gardien de forme, pas l'auteur unique. Une exigence sans propriétaire est une phrase orpheline, que tout le monde admire et que personne ne défend au pilote.

# Des critères d'acceptation en langage métier

Le critère d'acceptation dit comment on saura que l'exigence est tenue, sur un cas précis, avant de généraliser. Il se joue. Il ne se commente pas. Nadia doit pouvoir cocher oui ou non sans vous demander ce que « globalement » voulait dire.

| Exigence | Critère que Nadia peut jouer |
|---|---|
| Le client voit un créneau avant paiement | Sur 20 commandes test (10 domicile, 10 retrait), 20 affichent un créneau avant l'étape de paiement. Aucune ne paie « au plus vite » sans date. |
| Le magasin tranche le colis incomplet | Dans un magasin pilote, un préparateur confronté à un colis incomplet applique la procédure sans appel au siège, et le client reçoit le bon message. |
| Le retrait est prêt dans le créneau | Sur une journée test, les retraits annoncés « avant 18 h » sont prêts avant 18 h, ou l'écart est noté comme un échec, pas comme une exception orale. |
| Le directeur lit la tenue | Après dix jours ouvrés de pilote, Chloé et le directeur lisent le même chiffre de tenue, calculé comme Julien l'a défini, sans fichier parallèle. |

Un bon critère a un **cas**, un **nombre** et un **échec explicite**. « Le magasin est à l'aise » n'a aucun des trois. « Vingt commandes, zéro paiement sans créneau » a les trois. Vous n'avez pas besoin de quarante critères. Vous avez besoin que les exigences qui conditionnent le pilote en aient un, joué sur le terrain, pas seulement relu au siège.

Le critère n'est pas non plus le cahier de recette déguisé en cours d'outil. Vous ne listez pas des clics. Vous listez ce que le client et le magasin vivent. Si Sofia a besoin d'une liste technique pour son équipe, elle la dérive du critère. Elle ne la substitue pas au critère. Un parcours « techniquement terminé » qui laisse payer sans date est un échec d'acceptation, même si toutes les tâches internes sont cochées.

> [!TIP]
> Faites jouer le critère par quelqu'un qui n'a pas écrit la règle. Karim, ou un préparateur de son magasin, trouve en dix minutes l'adjectif que le siège croyait clair.

# Le cahier utile, pas le cahier de quatre-vingts pages

Un cahier de quatre-vingts pages rassure celui qui l'écrit et perd ceux qui doivent s'en servir. Il répète la même règle sous douze gabarits, il fige des cas jamais vus, et il est déjà faux le jour du pilote. Personne en magasin ne le lit. Le projet croit avoir spécifié. Il a seulement pris du retard.

Le cahier utile de Halte tient dans un petit dossier, que vous pouvez expliquer en une heure à Léa.

- **Une page de périmètre** : dedans, dehors, plus tard.
- **Une page d'exigences** : les cinq phrases, avec leur propriétaire.
- **Une page de critères** : les cas jouables avant pilote et avant chaque vague.
- **La procédure magasin** : assez courte pour être affichée en réserve, pas un manuel. Les cas dedans sont ceux du pilote (incomplet, absent, retrait). Les cas imaginaires (« colis livré en bateau ») n'y entrent pas.
- **La liste des points ouverts** : ce qu'on ne sait pas encore, qui doit répondre, et à quelle date. Un point ouvert n'est pas une exigence molle. C'est un trou assumé.

Ce qui gonfle un cahier sans rien livrer : les captures d'écran de mars, les synonymes (« le client sera informé de manière proactive »), les règles copiées d'un autre projet, les exigences d'un fournisseur collées telles quelles. NordColis a son propre document commercial. Ce n'est pas votre cahier. Votre cahier dit ce que Halte accepte, y compris contre la plaquette.

Vous figez une **version** avant le pilote, numérotée, datée, signée par Inès pour le contenu et par vous pour le fait qu'elle est la version en vigueur. Les passes itératives changent la version. Elles ne changent pas le fichier dans un coin sans que Chloé le sache. Après le constat de pilote, une modification est une décision, pas une retouche de confort. C'est cela, éviter les quatre-vingts pages : peu de phrases, une version, un propriétaire, et le courage de laisser des points ouverts plutôt que de les noyer.

```diagram
type: compare
title: "Le cahier qui sert, et celui qui rassure"
columns:
  - title: Cahier utile
    tone: teal
    items:
      - "Dedans, dehors, plus tard sur une page"
      - "Peu d'exigences, en langage magasin et client"
      - "Critères jouables, avec un échec explicite"
      - "Points ouverts datés, version signée"
  - title: Cahier de 80 pages
    tone: rose
    items:
      - "La solution préférée déjà rédigée en détail"
      - "Adjectifs que personne ne peut refuser"
      - "Cas jamais vus, captures déjà fausses"
      - "Aucun magasin ne s'en sert le jour du pilote"
  - title: Trop court pour de bon
    tone: amber
    items:
      - "Une ambition sans liste de dehors"
      - "Aucune règle pour le colis incomplet"
      - "Le critère reste « on verra sur place »"
      - "Chaque vague réinvente le geste"
```

# Ce qui reste flou, et comment le traiter

Tout n'est pas connaissable en mars. Le flou n'est pas un échec de cadrage. Le flou caché l'est. Vous traitez chaque zone grise de l'une de ces trois façons, et vous l'écrivez.

**On tranche maintenant**, parce que la suite en dépend. Exemple : le retrait fait partie du périmètre. Le laisser « à confirmer » empêche Chloé de savoir quoi former et Sofia de savoir quoi afficher. Léa et Inès tranchent en mars. Le chiffre de 61 % suffit à justifier que le retrait est dans le problème, pas un supplément.

**On apprend au pilote**, parce qu'un atelier de plus n'apportera rien. Exemple : le temps réel pour préparer un retrait dans un magasin sans réserve. Vous n'inventez pas une minute théorique. Vous écrivez l'hypothèse, le critère (prêt avant l'heure annoncée), et le magasin sans réserve parmi les quatre. Le flou a une date de fin : le constat.

**On reporte hors périmètre**, parce que le savoir n'est pas nécessaire aux trois seuils. Exemple : le motif détaillé de chaque réclamation, utile un jour, inutile pour savoir si l'on est passé de 20 à 14 pour 1 000. Julien peut le noter comme « plus tard ». Il ne bloque pas le pilote dessus.

Vous revoyez la liste des points ouverts chaque semaine. Un point ouvert sans date devient une exigence fantôme : l'équipe croit qu'il est dedans, personne ne le fait, le pilote tombe dessus. Votre règle de conduite est simple. Soit le point a un décideur et une date avant le jalon qu'il conditionne, soit il sort du périmètre par une phrase. Il n'existe pas de troisième état honorable appelé « en réflexion » pendant six semaines.

En sortie de cadrage, faites lire la page « dehors » aux voisins qui espéraient entrer : digital, fidélité, finance du transport. Leur silence en mars vaut mieux que leur colère en juillet, quand ils découvriront que leur sujet n'a pas de lot. Vous informez. Vous ne rouvrez pas le périmètre pour acheter la paix, sauf si Léa assume ce qui sort ou ce qui se paie.

# Exercices

## Exercice 1 : La demande « pendant qu'on y est »

Le responsable digital demande d'ajouter au périmètre le changement des photos produit sur la fiche, « puisque Sofia touche déjà au parcours de commande ». L'objectif signé parle d'affichage de créneau, de tenue et de réclamations. Où classez-vous cette demande, et que dites-vous ?

<details>
<summary>Voir la solution</summary>

Vous la classez dehors. Changer les photos ne réduit pas l'écart de promesse, et « puisque Sofia y touche » n'est pas un critère de périmètre. Le dedans, sur le parcours, est l'affichage d'une date ou d'un créneau avant paiement.

Vous le dites sans moquer le sujet : il peut vivre dans un autre effort, décidé par son sponsor. Il n'entre pas dans les 420 000 € ni dans le calendrier du 29 août. S'il insiste, la seule porte est une décision de Léa qui retire autre chose ou ajoute des moyens. Vous ne laissez pas Sofia commencer « un petit essai » qui créerait un dedans de fait.

</details>

## Exercice 2 : Une exigence en adjectifs

On vous propose d'ajouter : « L'expérience de livraison sera simple, moderne et rassurante pour tous les clients. » Inès aime le ton. Nadia demande comment elle recettera. Que remplacez-vous à cette phrase ?

<details>
<summary>Voir la solution</summary>

Vous ne mettez pas cette phrase dans les exigences. Elle n'a pas de contraire observable, et aucun cas jouable. Vous revenez aux exigences déjà utiles : le client voit un créneau avant de payer, le mot affiché ne promet pas plus que la règle, le magasin sait traiter l'incomplet et l'absence.

Si « rassurante » cache un vrai besoin, vous le traduisez. Par exemple : en cas de retard déjà connu du magasin, le client ne découvre pas l'échec seulement en arrivant. Ce besoin est peut-être le SMS, classé « plus tard », ou un message que le magasin sait envoyer avec la procédure actuelle. Le critère devient un cas, pas un adjectif. Nadia peut alors dire oui ou non.

</details>

## Exercice 3 : Le point ouvert qui traîne

Depuis trois semaines, personne ne sait si le client absent est redélivré le lendemain ou laissé en point de retrait magasin. La ligne est marquée « en réflexion ». Le pilote des quatre magasins est dans un mois. Que faites-vous cette semaine ?

<details>
<summary>Voir la solution</summary>

« En réflexion » sans décideur ni date est un trou, pas un avancement. Le cas du client absent est dedans : il est dans le geste magasin. Il conditionne la procédure que Chloé ne peut pas figer et le critère que Nadia doit jouer.

Vous posez une décision cette semaine, avec Inès et Marc, sur une règle unique pour le pilote. Si un fait manque vraiment, vous écrivez l'option retenue pour les quatre magasins et le moment de vérité au constat, pas un mois de réflexion de plus. Ce qui n'est pas tranché avant la procédure affichée en réserve n'existe pas pour le préparateur. Il improvisera, et le pilote ne testera rien.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Périmètre et exigences
center: "Dedans, dehors, plus tard. Peu d'exigences, des critères qu'un magasin peut jouer, une version signée."
points:
  - icon: filter
    title: Trois cases
    text: "Dedans sert les seuils. Dehors est un non. Plus tard n'entre ni dans le calendrier ni dans l'enveloppe."
  - icon: chat
    title: Langage métier
    text: "Le client voit, le magasin tranche. Pas d'adjectif du type fluide, moderne ou optimisé."
  - icon: check
    title: Acceptation
    text: "Un cas, un nombre, un échec explicite. Nadia coche sans redemander ce que globalement voulait dire."
  - icon: file
    title: Cahier court
    text: "Quelques pages, une procédure affichable en réserve, des points ouverts datés. Pas quatre-vingts pages."
  - icon: clock
    title: Le flou
    text: "Tranché maintenant, appris au pilote, ou sorti. Jamais laissé en réflexion pendant six semaines."
pitfall: "Laisser Sofia commencer un à-côté « petit », ou accepter une exigence qu'aucun magasin ne peut constater."
remember: "La version signée avant le pilote est la seule en vigueur. Après le constat, on ne retouche plus sans décision."
```
