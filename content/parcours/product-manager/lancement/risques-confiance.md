---
title: "Risques, confiance et recours"
description: "Tenir l'erreur visible, le biais entre magasins, les données personnelles dans le texte envoyé, le recours humain et les usages refusés."
duration: 40
objectives:
  - "Rendre l'erreur visible au magasin au lieu de la lisser"
  - "Repérer le biais entre magasins, transporteurs et créneaux"
  - "Empêcher les données personnelles d'entrer dans le texte envoyé"
  - "Donner un recours humain et une liste d'usages refusés"
---

# L'erreur que le magasin voit

La confiance ne vient pas d'une promesse de perfection. Elle vient d'un produit qui montre sa faute pendant que Karim peut encore ne pas appeler. Une erreur rangée dans un journal que personne n'ouvre n'est pas un garde-fou. C'est une archive.

Vous la rendez visible de trois façons.

**Sur la ligne.** L'heure du statut est affichée. La ligne grise ne ressemble pas à une ligne d'action. Le numéro de commande est celui de la caisse, pour qu'un contrôle prenne un geste, pas une enquête.

**Par un bouton.** « Ce n'est pas un retard » est sur chaque ligne d'action. Un tap, pas un formulaire. Karim n'écrit pas un essai. Le tap est un signal. S'il confirme qu'il allait appeler pour rien, vous comptez une erreur inacceptable, pas une humeur.

**Le jour même.** Un mélange de magasins, ou une donnée personnelle affichée, coupe le brief des pilotes. La phrase est simple : « Brief suspendu aujourd'hui, reprenez la liste transporteur. » Vous ne laissez pas les boutons actifs sous un petit bandeau « incident en cours ».

Si un appel à tort a déjà eu lieu, Hugo reprend le motif que le service client connaît. Vous ne créez pas une procédure parallèle. Vous branchez l'erreur du brief sur le recours qui existe.

> [!IMPORTANT]
> Une erreur que Karim ne peut pas signaler en un geste sera découverte par le client, au téléphone. C'est le pire moment pour l'apprendre.

# Le biais entre les matins

Le brief peut être correct en moyenne et inutile, ou dangereux, pour une partie des magasins. Vous cherchez où le gris et l'action se répartissent mal, avant qu'un directeur de région ne le fasse à votre place.

**Le transporteur peu bavard.** Certains partenaires de Chloé n'envoient un statut que deux fois par jour. Leurs commandes seront souvent grises. Les magasins qui en dépendent verront un brief pauvre, pendant que d'autres auront des actions nettes. Une page blanche leur fera dire « ça ne marche pas chez nous ». Vous affichez plutôt « peu de statuts frais ce matin », et vous ne notez pas le magasin là-dessus.

**Le créneau de l'après-midi.** Une livraison 11 h-13 h n'est pas en retard à 8 h 10. Si vos exemples ne contiennent que des créneaux tôt, vous traiterez l'après-midi comme une anomalie. Vous lisez la part de lignes grises par magasin et par transporteur, pas seulement le total Halte.

**Le drapeau « déjà joint » inégal.** Là où les appels sont mal notés, le brief dira plus souvent « appeler », et le client sera dérangé deux fois. Vous ne forcez pas l'appel pour compenser. Sans drapeau frais, l'action « appeler » est interdite. La formation le dit en une minute.

Pendant le pilote, une question suffit. Est-ce qu'un des quatre magasins n'a presque que du gris, et un autre presque que des actions ? Si oui, vous n'étendez pas. Vous nommez la cause (statut, créneau, drapeau) et vous ajustez la règle ou l'écran. Vous ne « rééquilibrez » pas en inventant des retards pour que les briefs se ressemblent.

# Le texte envoyé au modèle

Ce que vous envoyez au modèle s'appelle souvent un prompt : le texte de la demande, plus les faits collés dessous. Pour vous, ce n'est pas une affaire de formulation magique. C'est une liste de ce qui a le droit de quitter Halte.

Le texte envoyé ne contient que les cinq faits permis : magasin, commande, créneau, statut, heure du statut, et le drapeau déjà joint. Pas le nom, pas le téléphone, pas l'adresse, pas le commentaire libre. Si un essai a besoin d'un commentaire pour « mieux répondre », l'essai est hors produit. Vous l'arrêtez.

Le risque concret est le copier-coller. Quelqu'un prépare une démonstration avec un mail client entier, « juste pour voir ». Le mail contient un téléphone et un motif d'absence. Même si l'écran de Karim ne le répète pas, le texte est parti. Vous interdisez les exports bruts dans les essais. Les exemples du jeu sont déjà réduits aux faits permis, avant toute démonstration.

Vous vérifiez aussi le chemin inverse. Le brief ne doit pas réinventer une donnée qu'on ne lui a pas donnée. S'il écrit un prénom ou une raison d'absence, il a fabriqué une donnée personnelle, ou il l'a trouvée dans un commentaire qui n'aurait pas dû être là. Les deux cas coupent le brief du jour.

```diagram
type: sequence
title: "Signaler, relire, passer la main"
actors: [Karim, Brief, Inès, Hugo]
messages:
  - from: 0
    to: 1
    text: Ouvre avant 8 h 15
  - from: 1
    to: 0
    text: Actions, ligne grise, heure du statut
  - from: 0
    to: 1
    text: "Tape : ce n'est pas un retard"
  - from: 2
    to: 0
    text: Relit les actions les dix premiers matins
  - from: 0
    to: 3
    text: Passe le client déjà en colère
```

Inès relit les actions en début de pilote. Elle ne devient pas le destinataire de toutes les peurs. Hugo reçoit les clients déjà en contact, avec le motif habituel du service client. Le bouton reste à Karim. Un recours que seul le comité peut actionner arrivera toujours trop tard pour l'appel de 8 h 12.

# Les usages qu'on refuse

La confiance se tient aussi par ce que le produit ne fera pas, même si la demande est gentille, répétée, ou facile à ajouter « puisque les faits sont là ».

Vous refusez, pour ce sujet :

- **Envoyer un message au client.** SMS, e-mail, message vocal. Le brief prépare Karim. Il ne parle pas à sa place.
- **Noter ou classer les responsables.** Qui a ouvert, qui a appelé, qui a « trop » de gris. Ce classement ferait taire le bouton d'erreur. Les gens cachent les fautes quand la faute sert à les comparer.
- **Décider un geste commercial.** Avoir, remboursement, geste de bonne volonté. C'est une autre décision, avec Inès et le service client, pas une ligne du matin.
- **Répondre à une réclamation ou à une question libre.** Le brief n'est pas un interlocuteur général du magasin.
- **Choisir le transporteur ou réécrire sa consigne.** Chloé a ce sujet ailleurs. Le mélanger ici change la promesse.

| Demande | Réponse produit |
| --- | --- |
| « Prévenez le client, ce sera plus simple » | Refus. Karim appelle, ou Hugo reprend |
| « Classez les magasins lents à ouvrir » | Refus. L'usage se lit pour le pilote, pas pour noter |
| « Mettez le téléphone, pour aller plus vite » | Refus. La caisse l'a si l'appel est décidé |
| « Laissez poser n'importe quelle question » | Refus. Autre produit, autre coût, autre risque |

Le refus se dit sans moquerie. Le service réclamations souffre vraiment. La réponse est : ce sujet ne traite pas cette souffrance, et le pilote mesurera si les appels à tort baissent. Si ils ne baissent pas, Léa aura un fait pour ouvrir un autre cadre. Elle n'aura pas un SMS glissé dans le brief.

> [!WARNING]
> Un usage refusé qui reste possible dans l'écran (bouton masqué, question libre « pour les essais ») sera utilisé. Le refus se voit par l'absence du geste.

Vous relisez cette liste avec la phrase marketing. Si une formule exige un usage refusé pour être vraie, la formule saute, pas la liste. La confiance du magasin vaut plus qu'une annonce en région.

# Exercices

## Exercice 1 : Le journal invisible

L'équipe propose d'enregistrer les erreurs dans un fichier lu chaque mois par Sofia. Karim, lui, n'a pas de bouton : « on ne veut pas l'inquiéter ». Que changez-vous ?

<details>
<summary>Voir la solution</summary>

Un fichier mensuel n'aide pas l'appel de 8 h 12. Vous mettez « Ce n'est pas un retard » sur chaque ligne d'action, en un tap. L'heure du statut reste visible, et la ligne grise ne ressemble pas à une action.

Le jour d'un mélange de magasins ou d'une donnée personnelle, le brief est suspendu, avec le retour à la liste transporteur. Inquiéter Karim à tort n'est pas le sujet. Le laisser appeler sans moyen de dire « c'est faux » l'inquiétera par le client. Le signal du matin compte plus que le journal du mois.

</details>

## Exercice 2 : Le transporteur silencieux

Le magasin de Rennes, au pilote, n'a presque que des lignes grises. Lille a des actions chaque matin. Quelqu'un propose d'assouplir les quarante-cinq minutes « pour Rennes, sinon ils décrochent ». Que faites-vous ?

<details>
<summary>Voir la solution</summary>

Vous ne baissez pas la fraîcheur pour remplir l'écran. Un statut vieux devenu « sûr » est un retard inventé en puissance. Vous affichez « peu de statuts frais ce matin » au lieu d'une page blanche, et vous ne notez pas Rennes.

Vous lisez le gris par transporteur avec Chloé. Si ce partenaire n'a pas d'heure ou presque pas de statut, ses lignes restent incertaines pour tout le monde. Vous n'étendez pas le pilote en faisant comme si les briefs se valaient. La cause se dit. Elle ne se maquille pas.

</details>

## Exercice 3 : La démo avec le mail

Pour une répétition devant Léa, un collègue colle dans l'essai le mail entier d'une cliente, avec son téléphone et la mention « absente pour une hospitalisation ». L'écran final ne montre que « appeler ». Est-ce acceptable puisque l'écran est propre ?

<details>
<summary>Voir la solution</summary>

Non. Le texte envoyé contenait déjà le téléphone et un motif de santé. L'écran propre ne répare pas cela. Vous arrêtez l'essai, vous écartez ce mail des exemples, et vous rappelez la règle : cinq faits permis, rien d'autre, y compris en démonstration.

S'il le faut, vous rejouez devant Léa avec un cas du jeu anonymisé. Une démo qui exige une donnée interdite montre que le discours a dépassé le produit. Vous refusez de « faire une exception pour que ce soit parlant ».

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Confiance et recours
center: "L'erreur se voit le matin, le biais se compte par magasin, le texte envoyé reste pauvre, et certains usages sont refusés."
points:
  - icon: eye
    title: Erreur visible
    text: "Heure du statut, ligne grise distincte, bouton en un tap. Un mélange ou une donnée personnelle coupe le jour."
  - icon: scale
    title: Biais
    text: "Transporteur muet, créneau d'après-midi, drapeau manquant. On explique le gris. On n'invente pas des retards pour égaliser."
  - icon: lock
    title: Texte envoyé
    text: "Cinq faits, même en démo. Un mail client collé « pour voir » est déjà une donnée personnelle partie."
  - icon: users
    title: Recours
    text: "Karim signale. Inès relit les dix premiers matins. Hugo reprend le client déjà en colère, avec le motif habituel."
  - icon: shield
    title: Refus
    text: "Pas de SMS, pas de classement des magasins, pas de geste commercial, pas de question libre, pas de choix de transporteur."
pitfall: "Assouplir la fraîcheur d'un magasin peu informé, ou cacher les erreurs dans un fichier lu une fois par mois."
remember: "Le refus se voit dans l'écran. Un bouton encore là, même discret, sera utilisé le matin où tout le monde est pressé."
```
