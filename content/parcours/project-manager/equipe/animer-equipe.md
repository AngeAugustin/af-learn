---
title: Animer l'équipe projet
description: "Lire la disponibilité réelle plutôt que l'organigramme, rendre les dépendances visibles, tenir peu de rituels, et animer sans être le chef hiérarchique des neuf."
duration: 60
objectives:
  - Traduire l'organigramme des neuf en disponibilité réelle et en équivalents temps plein
  - Nommer les dépendances entre personnes avant qu'elles cassent un sprint
  - Choisir peu de rituels, et ne pas doubler le daily
  - Agir sans pouvoir hiérarchique quand la charge promise n'est pas là
---

# La disponibilité réelle

L'organigramme de la refonte affiche neuf personnes « affectées au projet » pour six mois. La lecture honnête est une somme de temps, pas une liste de noms.

- Vous, project manager : plein temps.
- Julien, parcours de commande : plein temps jusqu'au pilote, puis environ la moitié.
- Nadia, stocks : environ 80 %.
- Inès, product owner : environ 60 %, elle tient aussi l'e-commerce courant.
- Marc, scrum master : moitié.
- Chloé, transporteur : moitié.
- Karim, magasins : environ 40 %, souvent en tournée.
- Hugo, service client : environ 30 %, le support reste son métier.
- Amina, contrôle de gestion : environ 20 %.

Additionnés, cela fait un peu plus de **cinq équivalents temps plein** avant le pilote, et moins de cinq quand Julien repasse à mi-temps. Neuf carrés sur une diapositive racontent une autre équipe, deux fois plus grosse. Vous planifiez avec le second chiffre. Le premier sert à savoir qui prévenir, pas à charger le sprint.

La disponibilité se vérifie sur le calendrier des deux prochaines semaines, pas sur la fiche de mission. Karim « à 40 % » qui est en inventaire toute la semaine du pilote est à 0 % cette semaine-là. Vous le voyez avant la planification, avec lui, pas pendant le daily.

```diagram
type: stack
title: Où passent quarante heures de votre semaine
segments:
  - label: Dépendances
    value: 10
    tone: violet
    text: "Éditeur, transporteur, directeurs qui prêtent leurs gens"
  - label: Équipe
    value: 8
    tone: teal
    text: "Obstacles que Marc vous passe, pas un second daily"
  - label: Sponsor
    value: 6
    tone: amber
    text: "Arbitrages de Claire, feu du projet"
  - label: Risques
    value: 6
    tone: rose
    text: "Registre, demandes de changement, réserves"
  - label: Page
    value: 4
    tone: blue
    text: "Compte-rendu court, pas une fabrication de slides"
  - label: Marge
    value: 6
    tone: teal
    text: "Le trou qui absorbe Nantes sans manger le filtre"
```

L'ordre de grandeur compte plus que la feuille de temps. Une semaine sans marge est une semaine où le premier problème magasin dévore l'incrément. Vous ne remplissez pas les quarante heures de réunions pour prouver que vous animez.

# Les dépendances entre personnes

Le retard vient souvent d'une personne qui attend une autre, pas d'un manque de volonté. Vous dessinez ces attentes avant qu'elles cassent le sprint.

- Julien attend le flux de Nadia sur les quatre pilotes. Sans date, son histoire n'est pas prête.
- Chloé attend la règle de créneau d'Inès pour parler au transporteur. Sans règle, elle négocie dans le vide.
- Karim attend une fiche d'une page avant de former les quatre directeurs. Le guide complet des quarante magasins le bloque pour rien.
- Hugo attend les motifs définitifs. S'il les découvre en revue, la recette recule.
- Nadia attend l'éditeur. Personne dans l'équipe ne peut la remplacer sur ce flux. Tout le sprint 3 dépend d'elle si vous lui ajoutez, en plus, les incidents.

Une dépendance se écrit : qui, quoi, pour quand, que fait-on si la date saute. « Nadia fait au mieux » n'est pas une dépendance tenue. Vous réduisez ce qui la coupe : les incidents stock vont au flux, avec une limite, pas sur son temps de refonte en plus. Vous ne motivez pas une personne unique. Vous protégez son créneau, et vous avez un contournement (fichier manuel) déjà décidé dans le registre.

Si deux personnes doivent être là le même mardi (Karim en magasin, Julien en revue), vous le voyez sur le calendrier. L'organigramme ne le montre pas.

# Peu de rituels, tenus

Chaque rituel en trop vole les 40 % de Karim et les 30 % d'Hugo. Vous en gardez peu, et vous les tenez.

- **Daily de sprint**, quinze minutes, Marc, uniquement l'équipe qui construit. Vous n'y êtes pas par défaut.
- **Lundi, vingt minutes, dépendances** : vous, Nadia ou Julien si une date est due, Chloé si le transporteur bouge. Pas un tour de table des neuf.
- **Deux fois par semaine, vingt minutes, flux incidents** avec Hugo. Limite, âge des tickets, ce qui doit devenir histoire.
- **Revue et rétrospective** au rythme du sprint, pas doublées d'un « point projet » qui redemande la même chose.
- **Point sponsor** au rythme de Claire, une page, pas une répétition du daily.

Le test d'un rituel : quelle décision ou quel obstacle en sort ? Si la réponse est « on se synchronise », vous le supprimez. La synchronisation a déjà un lieu (le daily pour l'incrément, votre lundi pour les dépendances). Un troisième lieu fatigue et diverge : deux versions de la date de Nantes.

> [!TIP]
> Quand vous hésitez à créer un point, écrivez d'abord l'information. Une page lue vaut mieux qu'une heure où huit personnes entendent un sujet qui en concerne deux.

# Vous n'êtes pas le chef hiérarchique

Nadia dépend de son responsable informatique. Karim dépend d'un directeur de région. Hugo dépend du service client. Inès dépend de l'e-commerce. Aucun d'eux ne dépend de vous pour son entretien annuel, ses congés, ou le droit de lui demander un samedi.

Vous pouvez :

- montrer l'impact d'une disponibilité non tenue (« sans Karim cette semaine, les quatre directeurs ne sont pas formés, la revue glisse ») ;
- demander au responsable le créneau promis, avec une date ;
- remonter à Claire si le pourcentage affiché est fictif et que la date des six mois en dépend ;
- protéger la personne d'une sollicitation hors rôle (Julien sorti du filtre pour une étiquette prix).

Vous ne pouvez pas :

- noter quelqu'un, ni menacer son évaluation ;
- exiger des heures au-delà de ce que son responsable a accordé ;
- court-circuiter ce responsable « parce que le projet est prioritaire », sauf accord de Claire avec lui ;
- utiliser le daily pour faire honte d'un retard dont la cause est un chef qui a repris la personne.

Le geste propre : un fait, un impact, une demande au bon chef. « Karim a manqué les trois passages pilotes parce qu'il est en inventaire. Sans lui jeudi, on décale la formation. Pouvez-vous tenir les 40 % cette semaine, ou dois-je dire à Claire que le pilote glisse ? » C'est inconfortable et clair. « Il faut que tout le monde s'investisse » ne l'est pas.

> [!IMPORTANT]
> L'autorité du project manager est une autorité de cadre et de visibilité, pas une autorité de chef. Le jour où vous l'oubliez, les responsables reprennent leurs gens sans vous prévenir, parce que vous avez déjà agi sans eux.

# Quand la charge ne tient plus

La charge ne tient plus quand la somme des demandes dépasse les cinq équivalents temps plein, ou quand une personne unique (Nadia, Julien) porte un goulet. Le symptôme : des sprints qui n'atteignent pas l'objectif, un flux au-dessus de sa limite, des petits oui qui passent quand même.

Vous ne répondez pas par un discours. Vous posez trois options à Claire, chiffrées avec Amina si l'euro bouge :

- **Réduire le périmètre** : les quarante magasins restent, mais sans le jour même, et la vague ralentit d'un cran si Julien passe à mi-temps.
- **Ajouter du temps réel** : le responsable d'Hugo passe de 30 % à 50 % pendant six semaines, écrit, pas espéré.
- **Décaler la date** : les six mois deviennent sept, assumé, plutôt qu'un orange permanent.

En attendant la décision, vous coupez ce qui n'est pas la promesse des pilotes. Marc vous aide à voir ce qui est entré sans Inès. Vous ne demandez pas à l'équipe de « pousser un coup » deux sprints de suite : le troisième inventera un stock faux.

La fin de disponibilité de Julien après le pilote s'anticipe au sprint d'avant, pas le jour où il disparaît. Vous le mettez dans la planification comme une dépendance, au même titre que l'éditeur.

# Exercices

## Exercice 1 : Lire l'organigramme

Un directeur vous dit : « Vous avez neuf personnes, le pilote ne devrait pas glisser. » Julien passe à mi-temps la semaine prochaine, Karim est en inventaire, Hugo est à 30 %. Répondez avec la capacité, pas avec la liste des noms.

<details>
<summary>Voir la solution</summary>

« Neuf noms font un peu plus de cinq équivalents temps plein, et moins de cinq dès que Julien repasse à mi-temps. Cette semaine, Karim est à zéro à cause de l'inventaire, Hugo reste à 30 % parce que le support n'a pas diminué. Le pilote glisse si la formation magasin et le filtre reposent sur des heures qui ne sont pas dans le calendrier.

Je ne demande pas un effort invisible. Je demande soit Karim jeudi comme promis par son directeur, soit un décalage écrit de la formation. Les neuf carrés de la diapositive ne préparent pas une commande. »

</details>

## Exercice 2 : La dépendance de Nadia

Nadia porte le flux éditeur et, depuis dix jours, trois incidents stock que Hugo lui transfère « parce qu'elle sait ». Le filtre des pilotes n'a pas avancé. Décrivez la dépendance et le geste de cette semaine, sans lui demander de travailler le soir.

<details>
<summary>Voir la solution</summary>

Dépendance : Julien ne peut pas finir le filtre sans le flux des quatre pilotes, et ce flux n'a qu'une personne, Nadia. Les incidents ne sont pas une deuxième Nadia. Ils sont du flux, limite deux, portés par Hugo, avec Nadia seulement si un incident est vraiment un défaut de flux, à la place d'autre chose et pas en plus.

Cette semaine : vous sortez les trois incidents de son temps de refonte, vous confirmez avec Hugo la limite, vous demandez à Nadia une date de flux des quatre pilotes ou le fichier manuel déjà prévu. Vous prévenez son responsable que les 80 % doivent être protégés jusqu'à cette date. Vous ne la remerciez pas d'avoir « assuré le soir ». Vous fermez la porte qui lui vole le sprint.

</details>

## Exercice 3 : Sans pouvoir hiérarchique

Le responsable de Karim lui a remis une tournée qui annule les 40 % promis pendant deux semaines. Vous l'apprenez par un message de Karim, gêné. Écrivez les quatre lignes que vous envoyez au responsable, et ce que vous ne mettez pas.

<details>
<summary>Voir la solution</summary>

« Karim m'indique qu'il est en tournée les deux prochaines semaines, donc absent du pilote. Sans lui, la formation des quatre directeurs ne se tient pas jeudi et la revue magasin glisse. Les 40 % avaient été accordés jusqu'à la fin du pilote.

Pouvez-vous tenir jeudi et la semaine suivante, ou dois-je dire à Claire que le pilote décale de deux semaines ? Je m'adapte à votre réponse écrite, je ne demande pas à Karim de choisir entre vous et le projet. »

Vous ne menacez pas l'évaluation de Karim, vous ne lui écrivez pas de « s'imposer », vous ne mettez pas Claire en copie pour humilier le responsable. Vous la prévenez seulement si la réponse ne tient pas la date. Le fait, l'impact, la demande : rien d'autre.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Animer sans être le chef
center: "Neuf noms font environ cinq temps plein. Vous rendez les dépendances visibles, vous ne notez personne."
points:
  - icon: gauge
    title: Temps réel
    text: "Hugo 30 %, Karim 40 %, Amina 20 %. Le calendrier de la semaine compte plus que la fiche de mission."
  - icon: link
    title: Dépendances
    text: "Julien attend Nadia, Karim attend la fiche, Hugo attend le motif. Une date, ou un contournement."
  - icon: clock
    title: Peu de rituels
    text: "Daily de Marc, lundi dépendances, flux avec Hugo. Un point qui ne décide rien se supprime."
  - icon: users
    title: Pas le chef
    text: "Vous parlez au responsable avec un fait et un impact. Vous ne tenez pas l'entretien annuel."
  - icon: scale
    title: Charge
    text: "Si ça ne tient pas : moins de périmètre, plus de temps réel, ou une date assumée. Pas un discours."
pitfall: "Planifier neuf personnes comme neuf temps plein, puis s'étonner que Karim manque le jeudi du pilote."
remember: "Votre autorité montre l'impact et protège le cadre. Elle ne remplace pas le chef hiérarchique."
```
