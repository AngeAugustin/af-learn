---
title: "Contexte, compaction et reprise"
description: "La session se remplit. On compacte ou on en ouvre une neuve. Le durable est dans CLAUDE.md et dans le dépôt. Avant de couper, on écrit trois lignes d'état sur l'incrément en cours."
duration: 50
objectives:
  - "Reconnaître une session trop pleine et choisir /compact ou une session neuve"
  - "Placer le durable dans CLAUDE.md et dans le dépôt, pas dans le fil"
  - "Écrire trois lignes d'état avant de couper, avec le test et l'incrément"
  - "Reprendre le travail suivant à partir de ces lignes et du fichier relu"
---

# La session se remplit

Chaque lecture, chaque diff, chaque rappel de règle occupe la fenêtre de contexte. Au début, sur Sève, cela aide : la session a vu le fichier des stages, elle sait que vous voulez les places restantes sur huit. Plus le fil avance, plus les anciens essais restent là. Une proposition de dix places, refusée il y a une heure, côtoie la règle des huit. Un fichier inventé, corrigé depuis, traîne encore dans la conversation.

Vous le voyez à des signes simples. Les réponses redeviennent vagues. Un incrément déjà écarté revient (l'attente, alors que vous êtes sur la page). La session « se souvient » d'un chemin que vous avez infirmé. `/context` affiche ce qui occupe la fenêtre. Ce n'est pas une panne du dépôt. Le dépôt, lui, a les fichiers que `git diff` montre. Le fil, lui, s'est alourdi.

> [!NOTE]
> Le code déjà écrit ne s'efface pas quand la conversation gonfle. Ce qui se brouille, c'est le rappel dans le fil. Les fichiers restent la référence.

# Compacter

`/compact` résume la conversation pour libérer de la place. Vous pouvez ajouter une consigne de focus :

```text
/compact Garder : incrément 1 fait, test des 12 stages vert.
Prochaine étape : formulaire qui refuse la 9e place.
Règles : 8 places, 45 €, attente 12, 18 h.
```

Le résumé remplace le détail du fil. Il est utile, et il reste un résumé : une règle dite une seule fois, jamais écrite dans `CLAUDE.md`, peut en sortir arrondie. Le `CLAUDE.md` à la racine du projet, lui, est relu depuis le disque après la compaction. C'est une raison de plus de l'avoir tenu à jour avant de compacter, pas après coup dans un message.

Vous compactez quand le fil est long et que le cap est encore clair. Vous le faites après avoir écrit l'état du travail, pas à la place de cet état. Le résumé n'est pas votre spec. Les trois lignes que vous avez rédigées, si.

> [!TIP]
> Compactez sur un incrément calme : le test vient de passer, le diff est relu, vous savez la phrase de la suite. Au milieu d'une édition confuse, un résumé fige la confusion.

# Ouvrir une session neuve

Parfois le résumé ne suffit pas. La session mélange les incréments, défend un fichier qui n'existe pas, ou propose d'envoyer le SMS « puisque les trois absents sont dans le contexte ». Vous coupez. `/clear` ouvre une conversation vide dans le même lancement (les alias `/reset` et `/new` font le même geste). Quitter avec `/exit` et relancer `claude` dans le dépôt ouvre aussi une session neuve.

La session neuve charge à nouveau le `CLAUDE.md`. Elle ne charge pas le fil précédent. Tout ce qui n'était que dans le fil est absent, et c'est souvent ce que vous vouliez : plus de fausse piste. Tout ce qui devait survivre doit donc être ailleurs, avant la coupure.

```diagram
type: sequence
title: "Couper sans perdre l'incrément"
actors: ["Vous", "Session", "Dépôt"]
messages:
  - from: 0
    to: 2
    text: "J'écris trois lignes d'état dans un fichier"
  - from: 0
    to: 1
    text: "/compact, ou je quitte pour une session neuve"
  - from: 1
    to: 2
    text: "Le CLAUDE.md de projet est relu sur le disque"
  - from: 0
    to: 1
    text: "Je recolle les trois lignes, puis la suite"
```

# Le durable est dans le dépôt

Deux endroits survivent à une session. Le `CLAUDE.md` de projet : commandes, huit places, 45 €, attente de douze, règle des 18 h. Le dépôt lui-même : la page des stages, les tests, et un court fichier d'état si vous en tenez un. Le fil n'en fait pas partie.

Vous pouvez tenir l'état dans un fichier du dépôt, trois lignes, que la session suivante lira. Vous pouvez aussi les coller en premier message. Les deux gestes se renforcent. Un seul, celui du fil que vous allez jeter, ne suffit pas. `git status` vous dit si ces lignes sont un fichier suivi ou un brouillon local. Un brouillon vous appartient. S'il doit servir à l'équipe, il se committe avec le reste, sans secret dedans.

Les 70 % de remplissage et les trois absents du mois restent le pourquoi de l'atelier. Ils n'ont pas besoin d'être répétés à chaque reprise. Les nombres qui commandent le code, si : 8, 45 €, 12, 18 h. Ils sont déjà dans `CLAUDE.md`. Les trois lignes d'état disent où en est le travail, pas le métier en entier.

> [!WARNING]
> Une règle corrigée seulement dans le fil revient à sa version floue après `/clear`. Vous la corrigez dans CLAUDE.md, sur le disque, avant de couper.

# Trois lignes avant de couper

Avant `/compact`, avant `/clear`, avant de fermer le terminal, vous écrivez trois lignes. Les vôtres, pas un résumé demandé à la session au dernier moment. Par exemple, à la fin de l'incrément 1 :

```text
Incrément 1 fait : page des 12 stages avec places restantes.
Test des 12 stages vert.
Prochaine étape : formulaire qui refuse la 9e place. Pas commencé.
```

La première ligne dit ce qui est obtenu, de façon constatable. La deuxième dit la vérification : le test est vert, ou il ne l'est pas, et alors vous ne le prétendez pas. La troisième dit la frontière. Pas commencé, ou commencé dans tel fichier. « On verra » ne se reprend pas demain.

Vous posez ces lignes dans le dépôt, par exemple un court `ETAT.md` à la racine, ou vous les inscrivez en tête du message que vous collerez. Puis vous coupez. Si le test n'est pas vert, la deuxième ligne le dit : « Test des 12 stages rouge, échec sur le nombre de places. » Reprendre sur un mensonge d'état fait coder l'incrément 2 au-dessus d'un incrément 1 incomplet.

> [!IMPORTANT]
> Trois lignes, écrites par vous, avant de couper. « Incrément 1 fait, test des 12 stages vert » est un état. Un paragraphe d'au revoir n'en est pas un.

# Reprendre au bon incrément

La session neuve démarre dans le même dépôt. Vous vérifiez le chemin, comme au premier lancement. Vous demandez une lecture courte : le `CLAUDE.md`, les trois lignes d'état, le fichier de la page. Vous ne dites pas « continue ». Vous dites la suite :

```text
Lis ETAT.md et le CLAUDE.md. Ne modifie rien.
Incrément 1 fait, test des 12 stages vert.
Résultat maintenant : le formulaire refuse la 9e place.
8 places, 45 €. Pas l'attente, pas les 18 h dans ce diff.
```

La session montre qu'elle a vu la page déjà là. Ensuite, le mode plan si le formulaire touche plusieurs fichiers. Ensuite les permissions, une par une. Le test repasse. Vous relisez le diff. Quand cet incrément est vraiment fini, vous réécrivez les trois lignes : incrément 2 fait, test vert, prochaine étape l'attente ordonnée jusqu'à douze.

Léa tranche avant 18 h la veille, sur des noms réels. Vous tranchez avant de couper la session, sur trois lignes réelles. Le lendemain, le dépôt et le `CLAUDE.md` portent encore l'atelier. Le fil, lui, a pu disparaître sans emporter Sève.

# Exercices

## Exercice 1 : Les trois lignes

L'incrément 1 est dans le dépôt. Le test des douze stages passe. Vous allez fermer le terminal. La session propose d'écrire elle-même un long compte-rendu. Qu'écrivez-vous, et où ?

<details>
<summary>Voir la solution</summary>

Vous écrivez trois lignes, vous-même. Incrément 1 fait : page des 12 stages avec places restantes. Test des 12 stages vert. Prochaine étape : formulaire qui refuse la 9e place, pas commencé.

Vous les posez dans le dépôt, dans un fichier court que la prochaine session pourra lire, et vous pouvez les garder pour le premier message. Vous les écrivez avant `/compact` ou `/clear`. Un compte-rendu produit par la session au dernier moment reste un résumé du fil, pas votre état.

</details>

## Exercice 2 : La règle restée dans le fil

Vous aviez corrigé dans la conversation : « c'est 8 places, pas 10 ». Le `CLAUDE.md` dit encore « une capacité confortable ». Vous compactez, puis la session propose à nouveau 10. Pourquoi, et que corrigez-vous ?

<details>
<summary>Voir la solution</summary>

La correction vivait dans le fil. La compaction résume le fil, et elle relit le `CLAUDE.md` de projet depuis le disque. Le disque disait encore « capacité confortable ». Dix places peuvent donc revenir.

Vous corrigez le fichier : 8 places, la 9e est refusée, 45 €, attente 12, décision avant 18 h. Vous le faites avant de couper la prochaine fois. Puis vous redemandez la règle en lecture seule. La réponse se cale sur le fichier, pas sur l'ancien fil.

</details>

## Exercice 3 : Une session qui mélange tout

Le fil mêle la page des stages, un fichier inventé que vous avez déjà nié, et une proposition d'envoi de SMS. `/context` confirme que la fenêtre est pleine. Le test des douze stages est vert, l'incrément 1 est relu. Comment reprenez-vous ?

<details>
<summary>Voir la solution</summary>

Vous écrivez les trois lignes d'état dans le dépôt. Vous ouvrez une session neuve, avec `/clear` ou en relançant `claude` dans le même dossier. Un compact figerait ici un fil déjà mêlé : fichier nié, SMS, page des stages.

La nouvelle session reçoit le chemin du dépôt, le `CLAUDE.md`, et vos trois lignes. Vous demandez de lire la page déjà faite, sans rien modifier, puis vous posez le résultat du formulaire : refuser la 9e place. L'envoi de SMS et le fichier inventé ne sont pas dans l'état. Ils ne reviennent pas avec le fil.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Compacter et reprendre
center: "La session se remplit. Vous compactez ou vous en ouvrez une neuve. Le durable est dans CLAUDE.md et dans le dépôt, pas dans le fil."
points:
  - icon: gauge
    title: Fenêtre pleine
    text: "/context montre ce qui pèse. Les vieilles pistes reviennent. Le dépôt, lui, n'a pas bougé."
  - icon: layers
    title: "/compact"
    text: "Le fil est résumé. Le CLAUDE.md de projet est relu sur le disque."
  - icon: terminal
    title: Session neuve
    text: "/clear, ou quitter et relancer claude dans le dépôt. Le fil précédent ne suit pas."
  - icon: file
    title: Trois lignes
    text: "Incrément 1 fait, test des 12 stages vert, prochaine étape nommée. Avant de couper."
  - icon: check
    title: Reprise
    text: "Vous faites relire l'état et la page. Ensuite le formulaire, pas avant."
pitfall: "Couper en laissant la vraie règle seulement dans le fil, ou reprendre par « continue » sans les trois lignes."
remember: "Écrivez l'état, puis compactez ou ouvrez une session neuve. Huit places et le test vert vivent dans le dépôt."
```
