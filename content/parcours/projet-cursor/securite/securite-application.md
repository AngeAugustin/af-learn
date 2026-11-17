---
title: "Sécuriser la page que Léa ouvre"
description: "Montrer un compte public, garder les noms pour Léa, faire refuser la 9e place par le serveur, afficher un prénom comme du texte."
duration: 50
objectives:
  - "Afficher « 3 personnes en attente » sur la page publique, sans les téléphones"
  - "Réserver les noms à l'écran de Léa, qui n'est pas public"
  - "Faire refuser la 9e place par le serveur, sans croire un champ caché"
  - "Afficher un prénom contenant du HTML comme du texte, et garder la confirmation hors d'une URL ouverte"
---

# Ce que voit un visiteur

Léa Vernet ouvre App Sève avant le samedi. Atelier Sève, Lyon Croix-Rousse, 10 h-13 h, 8 places, 45 €. L'attente est plafonnée à 12. Elle tranche avant 18 h la veille. Le mois compte 12 stages, le remplissage tourne autour de 70 %, et environ 3 personnes manquent parce que le SMS a été oublié. La page publique est celle qu'une personne voit en voulant s'inscrire. Elle doit être lisible sans devenir un annuaire.

La carte du stage reste claire : le créneau, les 8 places, le prix de 45 €. La file, elle, se résume. Quand trois personnes patientent, la page publique montre « 3 personnes en attente ». Elle ne montre pas leurs téléphones. Elle ne déroule pas leurs noms. Un visiteur comprend que la file existe. Il n'emporte pas de quoi appeler qui que ce soit.

> [!IMPORTANT]
> La page publique compte la file. Elle ne publie ni les téléphones, ni la liste des noms.

« 3 places restantes » est une autre phrase. Elle compte des sièges libres sur 8. « 3 personnes en attente » compte la file. Les deux peuvent être vraies ensemble, pour des raisons différentes. Vous ne remplacez pas l'une par l'autre. Le public voit le compte de la file, pas les personnes qui la composent.

# Ce que voit Léa

Les noms sont pour Léa, sur un écran qui n'est pas public. Elle doit pouvoir dire qui est en premier dans la file, dans la limite de 12, et préparer sa décision avant 18 h. Cet écran n'est pas la page que le visiteur ouvre. Vous ne le « simplifiez » pas en copiant les noms sur la page publique, même pour une démo, même si la file ne compte que trois personnes.

Vous vérifiez les deux vues dans l'aperçu de Cursor, l'une après l'autre. D'abord la page publique : la phrase de compte, aucun téléphone, aucun nom de la file. Ensuite l'écran de Léa : les noms, dans un ordre qu'elle peut lire. Si les noms apparaissent des deux côtés, la page publique n'est pas tenue.

```diagram
type: compare
title: "Deux écrans, deux lectures"
columns:
  - title: "Page publique"
    tone: teal
    items:
      - "« 3 personnes en attente » quand trois personnes patientent"
      - "Aucun téléphone"
      - "Pas la liste des noms"
  - title: "Écran de Léa"
    tone: violet
    items:
      - "Les noms, dans un ordre lisible"
      - "Un écran qui n'est pas public"
      - "La confirmation avant 18 h, qui n'est pas une adresse ouverte"
```

> [!NOTE]
> Les noms servent la décision de Léa. Ils ne servent pas à meubler la page qu'un visiteur consulte.

# La neuvième place se compte sur le serveur

Huit places confirmées, la suivante se refuse. C'est le serveur qui le dit. Le formulaire peut emporter un champ caché, une valeur que la page ne montre pas et qui annoncerait une place libre, ou une acceptation. Ce champ ne fait pas foi. Le serveur recompte les places déjà confirmées. S'il en trouve 8, il refuse la 9e. La carte ne passe pas à 9 inscrits.

Vous ne corrigez pas cette règle dans le navigateur seulement. Un essai qui « a l'air bon » parce que le formulaire a répondu ne suffit pas. Vous regardez le refus, et vous vérifiez que la 9e personne n'est pas devenue une place assise. L'attente, jusqu'à 12, est une autre file. Elle ne transforme pas le champ caché en neuvième chaise.

```diagram
type: decision
title: "Une demande de place arrive"
nodes:
  - question: "Le serveur compte-t-il déjà 8 places confirmées ?"
    yes: "Il refuse la 9e. Un champ caché qui dirait oui ne fait pas foi."
    no: "La place peut se confirmer, dans la limite des 8, au prix de 45 €."
  - question: "La personne refusée rejoint-elle l'attente ?"
    yes: "L'attente reste ordonnée, et plafonnée à 12. Ce n'est pas une place assise."
    no: "Le refus reste un refus. La page publique n'affiche pas son téléphone."
```

> [!WARNING]
> Un champ caché du formulaire ne décide pas. Le serveur refuse la 9e place quand 8 sont déjà confirmées.

# Le prénom reste du texte

Une personne peut écrire un prénom qui contient du HTML. Sur l'écran, ces signes s'affichent comme du texte. Ils ne deviennent pas une mise en forme, ni une consigne pour la page. Vous le vérifiez avec un jeu fictif, par exemple un prénom Camille suivi de balises, écrit entre les caractères tels quels.

```text
Camille <b>samedi</b>
```

La page montre cette suite de caractères, chevrons compris. Elle ne met pas le mot en valeur parce que des balises l'entourent. Le même principe vaut sur la page publique et sur l'écran de Léa : un prénom se lit, il ne s'exécute pas. Vous n'avez pas besoin d'un prénom réel pour l'essai. Le jeu fictif suffit.

# Confirmer n'est pas une adresse

L'action « Léa confirme avant 18 h » appartient à son écran. Elle sert la règle qui doit limiter les absents : Léa tranche la veille, avant 18 h, au lieu de découvrir un oubli le samedi. Cette action n'est pas une URL publique sans contrôle. Ouvrir une adresse ne confirme pas à sa place. Un visiteur qui connaît ou devine un lien ne prend pas la décision.

Vous le voyez dans l'aperçu. La page publique ne propose pas un lien qui confirmerait quelqu'un. L'écran de Léa porte l'action, et cette action ne se réduit pas à une adresse ouverte. Le chapitre s'arrête à ce geste de produit. Il ne décrit pas un dispositif de connexion, ni une façon de forcer l'action.

> [!TIP]
> Vous cherchez l'action sur l'écran de Léa. Si la confirmation tient dans une adresse que la page publique expose, elle n'est pas tenue.

# Deux écrans dans l'aperçu

Le geste, dans Cursor, est une lecture comparée. Vous ouvrez la page publique. Vous lisez la phrase de la file, vous cherchez un téléphone, vous cherchez un nom. Vous ouvrez ensuite l'écran de Léa. Vous lisez les noms, vous tentez une 9e inscription quand 8 places sont prises, vous regardez un prénom qui contient des balises, vous regardez où se trouve la confirmation.

Vous notez les faits, dans vos mots : le compte public, l'absence de téléphones, les noms seulement chez Léa, le refus serveur de la 9e place, le prénom affiché comme texte, et la confirmation qui n'est pas une adresse ouverte. Une ligne par fait, pas un avis. La règle du samedi reste autour : 8 places, 45 €, attente 12, 18 h la veille, 12 stages dans le mois.

# Exercices

## Exercice 1 : La page que le visiteur ouvre

Trois personnes patientent. La page publique montre leurs prénoms et leurs téléphones, « pour que ce soit concret ». Le prix de 45 € et les 8 places sont justes. Que doit montrer la page, et que retirez-vous ?

<details>
<summary>Voir la solution</summary>

La page publique montre « 3 personnes en attente ». Elle ne montre pas les téléphones, ni la liste des noms. Le prix et les 8 places peuvent rester sur la carte. Ils ne rachètent pas l'annuaire.

Les noms sont pour Léa, sur un écran qui n'est pas public. Vous ne les laissez pas sur la page du visiteur le temps de la démo.

</details>

## Exercice 2 : Le champ qui dit oui

Huit places sont confirmées. Le formulaire emporte un champ caché qui annonce la 9e place comme acceptée. L'agent veut s'y fier, parce que la valeur est déjà dans la page. Que fait le serveur, et qu'est-ce que ce champ ne prouve pas ?

<details>
<summary>Voir la solution</summary>

Le serveur refuse la 9e place. Il recompte les places confirmées. Un champ caché ne fait pas foi, même s'il dit oui, même s'il était déjà dans le formulaire.

La personne peut relever de l'attente, dans la limite de 12, sans devenir une place assise. La page publique ne gagne pas son téléphone. Elle peut dire qu'une personne de plus patiente, par un compte, pas par un numéro.

</details>

## Exercice 3 : Le prénom et le lien

Le prénom fictif `Camille <b>samedi</b>` s'affiche en gras, balises disparues. À côté, la page publique propose une adresse « confirmer avant 18 h » que n'importe qui peut ouvrir. Quels deux écarts notez-vous ?

<details>
<summary>Voir la solution</summary>

Le prénom doit s'afficher comme du texte, chevrons compris, pas comme une mise en forme. Vous le revoyez sur l'écran, avec le jeu fictif, jusqu'à lire les balises.

L'action « Léa confirme avant 18 h » n'est pas une URL publique sans contrôle. Elle reste sur l'écran de Léa. Une adresse ouverte sur la page publique ne confirme pas à sa place.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: La page de Léa
center: "Le public voit un compte. Léa voit les noms. Le serveur refuse la 9e place."
points:
  - icon: eye
    title: Page publique
    text: "« 3 personnes en attente ». Pas les téléphones. Pas la liste des noms."
  - icon: users
    title: Écran de Léa
    text: "Les noms sont pour elle, sur un écran qui n'est pas public, avant 18 h."
  - icon: server
    title: Huit places
    text: "Le serveur refuse la 9e. Un champ caché du formulaire ne fait pas foi."
  - icon: code
    title: Prénom texte
    text: "Un prénom qui contient du HTML s'affiche comme du texte, chevrons compris."
  - icon: link
    title: Confirmer
    text: "L'action de Léa avant 18 h n'est pas une URL publique sans contrôle."
  - icon: shield
    title: Deux lectures
    text: "Dans l'aperçu, vous lisez la page publique, puis l'écran de Léa, faits après faits."
pitfall: "Publier les téléphones, croire un champ caché, laisser le HTML s'exécuter, ou confirmer par une adresse ouverte."
remember: "Compte public, noms pour Léa, 9e place refusée par le serveur, prénom en texte, confirmation hors URL ouverte."
```
