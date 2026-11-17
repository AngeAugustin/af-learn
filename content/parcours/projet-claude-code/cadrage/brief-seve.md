---
title: "Poser le brief d'Atelier Sève dans le terminal"
description: "Écrire le brief d'Atelier Sève sur une page du dépôt, en garder les règles dans CLAUDE.md, et coller le chemin dans la première demande au lieu de réciter les chiffres."
duration: 50
objectives:
  - "Rédiger docs/brief.md sur une page, avec le mal, les règles et le hors-périmètre"
  - "Mettre dans CLAUDE.md un résumé stable qui pointe vers cette page"
  - "Coller le chemin du brief dans la première demande, sans le réciter à chaque tour"
  - "Garder les 45 € comme prix affiché, sans paiement réel"
---

# Le mal tient en trois absents

Léa Vernet tient Atelier Sève, un stage de céramique à Lyon Croix-Rousse. Le créneau est fixe : samedi, de 10 h à 13 h, 8 places, 45 €. Elle ouvre 12 stages dans le mois. Le remplissage observé est de 70 %. Ce qui motive l'appel, ce sont 3 absents par mois, parce que le SMS de rappel est oublié.

App Sève doit rendre ces règles visibles et les faire tenir : refuser une neuvième inscription, borner l'attente, fixer l'heure limite. Tant que ce mal n'est pas un fichier du dépôt, la session invente un autre produit : un site vitrine, un encaissement, une application « complète » dont personne ne peut dire qu'elle est finie.

> [!IMPORTANT]
> Le problème à écrire est celui-ci : 3 personnes par mois ne viennent pas, parce que le SMS n'est pas parti. Les 8 places, les 45 €, l'attente et les 18 h sont les règles. Elles ne sont pas le mal elles-mêmes.

# Une page, un chemin

Le brief tient sur une page : `docs/brief.md`. Une page se relit en entier avant d'accepter un plan. Deux pages, et la seconde contredit la première au tour d'après, sans que vous le voyiez.

La page a cinq blocs, dans cet ordre.

1. **Qui.** Léa Vernet, Atelier Sève, céramique, Lyon Croix-Rousse, samedi 10 h-13 h.
2. **Volume.** 12 stages par mois, 8 places, 45 € affichés, remplissage observé de 70 %.
3. **Mal.** 3 absents par mois, SMS de rappel oublié.
4. **Règles.** 8 places maximum. Attente ordonnée, 12 personnes au plus. Décision avant 18 h la veille : sans confirmation, la place se libère.
5. **Hors périmètre.** Pas de paiement réel. Le prix s'affiche. Rien n'est encaissé.

Le four, les émaux, l'histoire du local : utiles à l'oral, absents de la page. Un chiffre qui ne tient pas dans les cinq blocs n'entre pas.

```diagram
type: flow
title: "Du mal écrit à la première demande"
steps:
  - title: Page
    text: "docs/brief.md porte le mal, les règles et le hors-périmètre"
    tone: rose
  - title: Résumé
    text: "CLAUDE.md pointe vers la page et ne répète que ce qui ne doit pas dériver"
    tone: violet
  - title: Chemin
    text: "La première demande colle docs/brief.md, elle ne récite pas les chiffres"
    tone: teal
  - title: Session
    text: "Les tours suivants s'appuient sur le fichier, pas sur la mémoire du chat"
    tone: blue
```

# Le résumé dans CLAUDE.md

`CLAUDE.md`, à la racine, est chargé au début de chaque session. Il reste là quand la conversation est résumée. La page du brief, elle, n'est relue que si le chemin est connu. Les deux fichiers ont donc deux métiers.

La page porte le récit et les chiffres. Le résumé porte ce qui doit rester vrai même si le chat dérape :

- Lire `docs/brief.md` avant de proposer un changement.
- 8 places, attente maximum 12, règle des 18 h la veille.
- Le prix de 45 € s'affiche. Aucun paiement.
- Un seul incrément par session.

Vous ne copiez pas la page dans `CLAUDE.md`. Deux textes longs finissent par diverger : l'un dit 8 places, l'autre dit 10 après une correction oubliée. Le résumé pointe vers la page. Il ne la remplace pas.

# Coller le chemin, une fois

La première demande dans le terminal ne récite ni Léa, ni les 8 places, ni les 45 €, ni les 18 h. Elle colle le chemin, et elle demande une lecture.

```text
Lis docs/brief.md.
On ne code pas encore. Dis en cinq lignes ce que tu as lu :
mal, règles, hors-périmètre.
```

Vous vérifiez que la réponse cite les 3 absents, les 8 places, l'attente de 12, les 18 h, et l'absence de paiement. Si un chiffre manque, vous corrigez la page, pas votre mémoire. Au tour suivant, vous écrivez « selon docs/brief.md ». La session relit le fichier. Une récitation, elle, glisse : 9 places, 40 €, vendredi soir.

> [!WARNING]
> Réciter le brief à chaque tour fabrique une deuxième source. Le jour où la page passe l'attente de 12 à 10, le chat continue l'ancienne phrase.

# Le prix n'est pas un encaissement

45 € est le prix du stage. Il s'affiche pour que la personne sache ce qu'elle réserve. L'application n'encaisse pas : pas de carte, pas de prestataire, pas de « on branche le paiement pendant qu'on y est ».

Cette ligne figure dans la page et dans le résumé, parce que c'est la dérive la plus probable. Un prix écrit dans un brief ressemble, pour une session, à une fonctionnalité à coder. Vous la classez hors périmètre avant la première écriture, pas après l'ajout d'une dépendance.

Le SMS oublié n'ouvre pas non plus un compte chez un opérateur dans ce dépôt. L'incrément de confirmation appliquera la règle des 18 h. Il n'enverra pas un vrai message.

# Faire tenir la page

Avant de découper le travail, vous relisez `docs/brief.md` une fois, à voix haute. Puis vous fermez le brief par une question à Léa : si App Sève affiche les 12 stages, refuse la 9e place, tient une attente de 12 et libère une place non confirmée avant 18 h la veille, sans jamais encaisser, le cadre suffit-il pour commencer ?

Un oui sur cette page suffit. Un « oui, et aussi le paiement » renvoie au bloc hors périmètre. Vous ne l'ajoutez pas pour être agréable. Le refus reste écrit, là où la session du lendemain le relira.

# Exercices

## Exercice 1 : La dictée trop longue

Léa dicte vingt minutes : le four, les émaux, le samedi 10 h-13 h, les 8 places, les 45 €, les 12 stages, le remplissage à 70 %, les 3 absents, l'attente, les 18 h, et le paiement en ligne « tant qu'à faire ». Que gardez-vous dans `docs/brief.md` ?

<details>
<summary>Voir la solution</summary>

Vous gardez une page, cinq blocs. Qui : Léa Vernet, Atelier Sève, Lyon Croix-Rousse, samedi 10 h-13 h. Volume : 12 stages, 8 places, 45 € affichés, 70 %. Mal : 3 absents, SMS oublié. Règles : 8 places, attente 12, décision avant 18 h la veille. Hors périmètre : pas de paiement réel.

Le four et les émaux sortent. Le paiement sort aussi, et il est écrit comme refus. S'il reste seulement dans la dictée, la session suivante le reconstruira à partir des 45 €.

</details>

## Exercice 2 : Le brief récité

Au troisième tour, quelqu'un colle : « 8 places, enfin 10 si la demande est forte, 50 €, SMS via un prestataire, et fais déjà le paiement ». La page dit autre chose. Que faites-vous de cette demande ?

<details>
<summary>Voir la solution</summary>

Vous ne négociez pas les nouveaux chiffres dans le chat. Vous renvoyez au fichier : la demande doit coller `docs/brief.md`, pas une variante retenue de mémoire.

10 places, 50 €, le prestataire et le paiement contredisent la page. S'ils deviennent vrais, Léa modifie `docs/brief.md` d'abord, puis le résumé si un garde-fou change. Tant que la page n'a pas changé, la session suit la page.

</details>

## Exercice 3 : Deux textes pour l'attente

Vous avez copié toute la page dans `CLAUDE.md`. Léa passe ensuite l'attente de 12 à 10. Vous corrigez `docs/brief.md` et vous oubliez le résumé. Le lendemain, une session neuve charge `CLAUDE.md`. Que risque-t-elle, et comment rangez-vous les deux fichiers ?

<details>
<summary>Voir la solution</summary>

La session voit 12 dans le résumé et 10 dans la page, si elle lit les deux. Elle peut suivre le mauvais chiffre. Vous raccourcissez `CLAUDE.md` : le chemin de la page, et les garde-fous qui ne doivent pas dériver (places, attente, 18 h, pas de paiement, un incrément par session). Le chiffre vivant de l'attente reste dans `docs/brief.md`.

Après chaque changement de règle, vous relisez le résumé. Un résumé qui recopie la page redevient une seconde source.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Le brief dans le terminal
center: "Une page dans le dépôt, un résumé dans CLAUDE.md, le chemin collé une fois. Les chiffres ne se récitent pas."
points:
  - icon: file
    title: Une page
    text: "docs/brief.md porte Léa, la Croix-Rousse, 12 stages, 3 absents, les règles et le hors-périmètre."
  - icon: book
    title: Résumé
    text: "CLAUDE.md pointe vers la page et garde 8 places, l'attente 12, les 18 h, et l'absence de paiement."
  - icon: terminal
    title: Le chemin
    text: "La première demande dit de lire docs/brief.md. Elle ne réécrit pas les 45 € de mémoire."
  - icon: money
    title: Prix affiché
    text: "45 € se voient sur la page du stage. Aucun encaissement n'entre dans App Sève."
  - icon: alert
    title: Deux sources
    text: "Recopier la page dans le chat ou dans CLAUDE.md fait diverger les chiffres au tour suivant."
pitfall: "Dicter 10 places et un paiement dans le terminal alors que la page dit 8 places et aucun encaissement."
remember: "Si un chiffre compte, il est dans docs/brief.md. La session relit le fichier, elle ne suit pas votre mémoire."
```
