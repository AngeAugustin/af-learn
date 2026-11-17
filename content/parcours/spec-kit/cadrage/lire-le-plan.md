---
title: "Lire le plan avant les tâches"
description: "Lire plan.md comme un diff : réutilisation du refus des 8 places, aucun paiement, aucun téléphone publié."
duration: 50
objectives:
  - "Lire plan.md comme un diff contre la spec de l'attente"
  - "Vérifier la réutilisation du refus des 8 places, sans paiement et sans téléphones"
  - "Corriger le plan sur place quand une ligne dérive"
  - "Garder /speckit-tasks tant que cette lecture n'est pas propre"
---

# Ouvrir plan.md comme un diff

`/speckit-plan` a écrit `plan.md` dans le dossier de la fonctionnalité, celui qu'indique `.specify/feature.json`. Léa Vernet n'a pas à lire ce fichier. Vous, si. Vous le lisez comme un diff : chaque ligne ajoutée se compare à `spec.md` et au code déjà là.

Le décor est connu. Atelier Sève, Lyon Croix-Rousse, samedi 10 h-13 h, 8 places, 45 €. Douze stages dans le mois, remplissage de 70 %, 3 absents parce que le SMS est oublié. L'application liste déjà les stages et refuse déjà la 9e place. La spec ajoute l'attente ordonnée et la confirmation visible.

Un diff fidèle réutilise ce refus, n'ajoute pas de paiement, ne publie pas les téléphones. Un diff qui « améliore » en passant introduit une autre fonctionnalité. Vous le voyez avant les tâches, pas pendant le code.

> [!IMPORTANT]
> Lire le plan, c'est chercher ce qu'il ajoute, ce qu'il retire et ce qu'il change. Une ligne qui n'était pas dans la spec est une dérive, même si elle semble utile.

# Le refus des 8 places est repris

Le plan doit s'appuyer sur le refus déjà codé. Huit places, la 9e inscription refusée. Vous cherchez une phrase du type « réutiliser le refus existant », ou l'équivalent dans les fichiers que le plan désigne. Vous ne cherchez pas une nouvelle règle de capacité.

Une dérive fréquente : le plan « simplifie » en mettant 10 places, ou il reconstruit une liste de stages à côté de la liste actuelle. Les deux cassent l'acquis. La liste des 12 stages reste celle de l'application. Le samedi 10 h-13 h et les 45 € affichés restent ceux de cette liste.

L'attente, elle, a son plafond dans la spec : 12 noms, le 12e accepté, le 13e refusé, ordre d'arrivée. Le plan doit loger cette file dans l'architecture existante. Il ne transforme pas les 8 places en 12 places. Deux plafonds, deux règles, un seul code déjà là pour la première.

# Pas de ligne de paiement

45 € est un prix affiché. Le plan ne contient pas de SDK de paiement, pas de capture de carte, pas d'encaissement « pour confirmer ». Si une ligne parle de paiement, d'un prestataire ou d'un montant à débiter, elle dérive, même si le montant est bien 45 €.

La confirmation spécifiée est visible. Léa tranche avant 18 h la veille. La phrase « avant 18 h » est à l'écran. Le plan décrit où cette phrase et cet état vivent dans l'application actuelle. Il ne remplace pas la phrase par un reçu de paiement.

Les 3 absents et le SMS oublié ne justifient pas non plus une ligne d'envoi. Le plan de cette fonctionnalité n'ajoute pas de SMS. S'il le fait « pour être complet », vous retirez la ligne. Le contexte n'est pas un cahier des charges caché.

> [!WARNING]
> Un montant juste ne rend pas un paiement acceptable. 45 € peut rester affiché. Dès qu'une ligne encaisse, le plan a quitté la spec.

# Pas de téléphone publié

La spec dit que la page publique ne montre pas les téléphones. Dans le plan, vous cherchez les champs affichés. Un champ téléphone sur la page publique, même « masqué pour les anonymes » mais visible sur l'écran commun, est une publication. Vous le retirez du plan.

L'ordre d'arrivée, l'état « en attente » et la phrase « avant 18 h » doivent, eux, être prévus comme visibles. Un plan qui stocke l'attente sans rien montrer à la personne a perdu le quoi. Le diff se lit dans les deux sens : pas d'ajout interdit, pas d'oubli du comportement demandé.

Vous ne corrigez pas ce point en vous disant que les tâches « feront attention ». Les tâches copient le plan. Un téléphone écrit dans `plan.md` a de grandes chances d'arriver à l'écran.

```diagram
type: compare
title: "Le plan, lu comme un diff"
columns:
  - title: "Ligne à garder"
    tone: teal
    items:
      - "Réutilise le refus des 8 places"
      - "Garde la liste des 12 stages déjà là"
      - "Ajoute l'attente : ordre d'arrivée, plafond 12"
      - "Montre la phrase « avant 18 h »"
      - "Laisse 45 € affichés, sans encaissement"
  - title: "Ligne à corriger"
    tone: rose
    items:
      - "Passe le stage à 10 places"
      - "Ajoute un SDK de paiement"
      - "Envoie le SMS des 3 absents"
      - "Publie les téléphones sur la page publique"
      - "Propose un nouveau framework à côté"
```

# Dérive : on corrige le plan

Si une ligne dérive, vous corrigez `plan.md` avant tout autre skill. Vous pouvez le faire dans le fichier, ou renvoyer dans le chat une correction explicite, puis rouvrir le fichier. La version relue est celle du fichier, pas le premier jet du chat.

La correction reste dans le plan. Vous ne changez pas `spec.md` pour autoriser le paiement, les téléphones ou les 10 places. La spec a déjà tranché. Le plan se remet à son niveau. S'il manque la réutilisation de l'architecture, vous l'ajoutez : même application, même refus des 8 places, même liste.

Vous relisez ensuite les trois contrôles d'un coup. Refus des 8 places réutilisé. Aucun paiement. Aucun téléphone publié. Puis les voisins : pas de SMS, pas de nouveau framework, plafond d'attente toujours à 12, phrase « avant 18 h » toujours prévue à l'écran.

> [!NOTE]
> Corriger le plan est le même geste que corriger un 10 dans la spec. Le fichier faux ne se « compense » pas à l'étape d'après. Il se réécrit.

# Les tâches attendent cette lecture

`/speckit-tasks` découpe `plan.md` en travaux ordonnés. Lancé sur un plan qui encaisse, qui affiche les téléphones ou qui remplace le refus des 8 places, il découpera cette dérive en tâches propres, donc plus difficiles à voir. Vous ne le lancez pas pour « faire attention dans les tâches ».

Vous le gardez tant que la lecture n'est pas propre. Le skill se tapera dans le chat, le moment venu, pas dans le terminal, et pas dans le même message que la correction. Un plan juste se découpe. Un plan faux se corrige.

La checklist `checklists/requirements.md` ne remplace pas cette lecture. Elle est tenue par `/speckit-specify` et `/speckit-clarify`. Elle ne dit pas que `plan.md` est fidèle, et elle ne dit pas que le code est fini. Votre diff, sur les trois contrôles, est la porte vers les tâches.

# Exercices

## Exercice 1 : Trois lignes, trois verdicts

Le plan contient ces lignes. Pour chacune : garder, ou corriger ?

1. « Réutiliser le refus existant : 8 places, la 9e inscription ne passe pas. L'attente s'ajoute à côté, 12 noms. »
2. « Encaisser 45 € avec un SDK au moment où Léa confirme, avant 18 h. »
3. « Afficher le téléphone sur la page publique pour que le groupe se rejoigne. »

<details>
<summary>Voir la solution</summary>

1 se garde. Le refus des 8 places est réutilisé, l'attente de 12 noms est l'ajout spécifié, l'ordre devra rester celui de l'arrivée.

2 se corrige. 45 € reste affiché, la confirmation reste visible, il n'y a pas de SDK et pas d'encaissement. L'heure « avant 18 h » ne sert pas à déclencher un paiement.

3 se corrige. La page publique ne montre pas les téléphones. Vous retirez le champ du plan. Vous ne déplacez pas le problème dans les tâches.

</details>

## Exercice 2 : Un plan « plus complet »

`plan.md` ajoute un nouveau framework, un envoi de SMS pour les 3 absents, et passe le stage à 10 places « le temps de tester ». On vous dit de lancer `/speckit-tasks` tout de suite, « les tâches préciseront ». Que faites-vous ?

<details>
<summary>Voir la solution</summary>

Vous ne lancez pas `/speckit-tasks`. Vous corrigez `plan.md`. Rester sur l'application déjà en place, réutiliser la liste des 12 stages et le refus de la 9e place, pas de nouveau framework, pas de SMS, pas de 10 places.

Vous relisez les trois contrôles : refus des 8 places réutilisé, aucun paiement, aucun téléphone publié. Le plafond d'attente reste 12, la phrase « avant 18 h » reste prévue à l'écran, 45 € reste affiché. Ensuite seulement, les tâches pourront être envisagées.

</details>

## Exercice 3 : Le diff dans les deux sens

Le plan réutilise bien le refus des 8 places, n'encaisse pas et ne publie pas les téléphones. En revanche, il ne dit rien de l'ordre d'arrivée, ni de la phrase à l'écran. La personne « sera stockée quelque part ». Est-ce un plan prêt pour les tâches ?

<details>
<summary>Voir la solution</summary>

Non. L'absence de dérive interdite ne suffit pas. Le quoi doit être dans le plan : la personne voit qu'elle est en attente, l'ordre est celui de l'arrivée, le 13e nom est refusé, la phrase « avant 18 h » est à l'écran.

Vous complétez `plan.md` avec ces comportements, toujours dans l'application existante, sans paiement et sans SMS. Vous relisez. `/speckit-tasks` attend cette version. Un stockage invisible ne remplace pas la confirmation visible demandée par Léa.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Le plan se lit comme un diff"
center: "Avant les tâches, plan.md réutilise le refus des 8 places, n'encaisse pas, ne publie pas les téléphones."
points:
  - icon: git
    title: "Lire le diff"
    text: "Chaque ligne de plan.md se compare à spec.md et au code déjà là. Utile n'est pas fidèle."
  - icon: shield
    title: "Refus repris"
    text: "Les 8 places et le refus de la 9e inscription sont réutilisés. Le plan ne passe pas à 10."
  - icon: money
    title: "Sans paiement"
    text: "45 € reste affiché. Une ligne de SDK ou d'encaissement se retire du plan, pas plus tard."
  - icon: eye
    title: "Sans téléphone"
    text: "La page publique ne publie aucun numéro. L'attente, l'ordre et « avant 18 h » restent visibles."
  - icon: alert
    title: "Corriger d'abord"
    text: "Si le plan dérive, on réécrit plan.md. /speckit-tasks attend une lecture propre, dans le chat."
pitfall: "Lancer /speckit-tasks sur un plan qui encaisse, affiche les téléphones ou remplace le refus des 8 places."
remember: "On corrige le plan, on ne le compense pas dans les tâches. Refus des 8 places, pas de paiement, pas de téléphone."
```
