---
title: "Écrire un CLAUDE.md utile"
description: "CLAUDE.md est chargé au début de chaque session. Les fichiers se concatènent du plus large au plus spécifique. Pour Sève, on y met les commandes, huit places, 45 €, l'attente de 12 et la règle des 18 h."
duration: 50
objectives:
  - "Placer les consignes de Sève dans un CLAUDE.md de projet, relu à chaque session"
  - "Distinguer le fichier d'organisation, le fichier utilisateur et le fichier de projet"
  - "Écrire les commandes et les règles chiffrées, sans roman et sans secret"
  - "Savoir qu'AGENTS.md peut être lu, et que le CLAUDE.md de projet revient après compaction"
---

# Chargé au début de chaque session

`CLAUDE.md` est un fichier de consignes en Markdown. Claude Code le charge au début de chaque session, avec les autres fichiers de mémoire qu'il trouve. Vous y écrivez ce que vous devriez sinon répéter : comment lancer Sève, comment la tester, et les règles de Léa Vernet.

Ce n'est pas une configuration qui bloque une commande. La session le lit comme un contexte. Un oui sur une suppression reste votre décision, même si le fichier dit d'être prudent. Les permissions, elles, se règlent ailleurs. Ici, vous donnez une mémoire stable à l'atelier : samedi 10 h-13 h, huit places, 45 €, attente maximale de douze, décision avant 18 h la veille.

> [!IMPORTANT]
> Une règle seulement dite dans le fil disparaît avec la session. La même règle dans le CLAUDE.md de projet est relue au prochain lancement.

# Quatre emplacements

Plusieurs fichiers peuvent coexister. Ils ne se remplacent pas.

| Portée | Emplacement |
| --- | --- |
| Organisation | Politique imposée, par exemple `C:\Program Files\ClaudeCode\CLAUDE.md` sur Windows, `/Library/Application Support/ClaudeCode/CLAUDE.md` sur macOS, `/etc/claude-code/CLAUDE.md` sur Linux |
| Vous, tous les projets | `~/.claude/CLAUDE.md` |
| Ce dépôt, toute l'équipe | `./CLAUDE.md` ou `./.claude/CLAUDE.md` |

Le fichier de projet est celui que vous committez. `./CLAUDE.md` à la racine, ou `./.claude/CLAUDE.md` : un seul des deux suffit pour Sève. L'équipe qui clone le dépôt reçoit les mêmes consignes. Le fichier utilisateur garde vos préférences de travail, celles qui valent aussi pour d'autres dépôts. La politique d'organisation porte les règles de l'entreprise, quand il y en a une. Vous n'y mettez pas le prix du stage.

`/init` peut créer un premier jet du fichier de projet, à partir de ce qu'il trouve dans le code. Vous le relisez. Les nombres de Léa s'ajoutent à la main s'ils n'étaient pas déjà écrits.

> [!NOTE]
> Un `CLAUDE.local.md` à la racine sert à vos notes personnelles sur ce seul dépôt. Il se concatène aussi. Il reste hors de Git. Les secrets n'y ont pas plus leur place que dans le fichier partagé.

# Du plus large au plus spécifique

Les fichiers trouvés sont concaténés. Le plus large entre en premier, le plus spécifique ensuite. La politique d'organisation, puis votre `~/.claude/CLAUDE.md`, puis le fichier du dépôt. Rien n'est écrasé : le texte du projet s'ajoute, il ne remplace pas le texte de l'organisation.

Conséquence directe : deux phrases contraires restent toutes les deux dans le contexte. « Toujours huit places » dans le projet et « laisser le modèle proposer la capacité » dans vos préférences se gênent. La session peut suivre l'une ou l'autre. Vous évitez la contradiction, vous ne comptez pas sur l'ordre pour l'annuler.

Les fichiers des dossiers parents du dépôt sont eux aussi pris au lancement, du plus haut vers le dossier courant. Un `CLAUDE.md` posé au-dessus de Sève « pour tous mes essais » s'ajoute donc à celui de l'atelier. Vous le savez, et vous y mettez seulement ce qui est vrai pour tous ces essais.

```diagram
type: layers
title: "Concaténés, du plus large au plus spécifique"
layers:
  - title: Organisation
    text: "La politique commune. Elle arrive en premier. Elle reste dans le contexte."
  - title: Utilisateur
    text: "~/.claude/CLAUDE.md, pour tous vos projets sur cette machine."
  - title: Projet Sève
    text: "./CLAUDE.md ou ./.claude/CLAUDE.md. Les règles de Léa, partagées avec l'équipe."
```

# Ce qu'on écrit pour Sève

Le fichier de projet tient sur une page. Les commandes réelles du dépôt. Les règles que le code doit respecter. L'ordre des incréments, en une ligne chacun, pour qu'une session neuve sache où vous en êtes si vous le mettez à jour.

```markdown
# Sève

Atelier de céramique, Lyon Croix-Rousse, Léa Vernet.
Stage le samedi, 10 h-13 h.

## Commandes

- Lancer : `npm start`
- Tester : `node --test`

## Règles

- 8 places par stage. La 9e inscription est refusée.
- Prix : 45 €.
- Liste d'attente ordonnée, 12 noms au plus.
- Léa tranche avant 18 h la veille.
- La confirmation est visible. Un SMS oublié ne doit plus être la seule trace.

## Incréments

1. Page des 12 stages, places restantes.
2. Formulaire qui refuse la 9e place.
3. Attente ordonnée, jusqu'à 12.
4. Confirmation visible, et règle des 18 h.
```

Vous recopiez les commandes qui marchent vraiment. Si le dépôt se teste autrement, c'est cette autre commande qui figure ici, et nulle part une commande devinée. Les douze stages du mois et le remplissage autour de 70 % peuvent tenir en une phrase de contexte. Ils ne deviennent pas un essai sur la céramique.

> [!TIP]
> Écrivez les nombres en chiffres, là où le code devra les retrouver. « Huit », « 8 » et « une table complète » dans le même fichier font trois règles. Une suffit.

# Court, et sans secret

Un roman se relit mal, et il encombre chaque session. Vous visez l'utile : ce qu'un nouveau venu dans le dépôt doit respecter le premier jour. L'histoire des trois absents du mois tient en une ligne, celle de la confirmation. Le récit du four, des émaux et de la Croix-Rousse reste dehors.

Aucun secret. Pas de jeton d'envoi de SMS, pas de mot de passe, pas le contenu d'un `.env`. Le fichier est commité. Il sera relu dans des sessions, et parfois affiché. La règle « la confirmation est visible » se dit sans la clé qui permet d'envoyer le message.

Vous relisez le fichier comme un diff. Une phrase que vous ne voudriez pas voir appliquer à la lettre se reformule. « Sois créatif sur le nombre de places » saboterait l'atelier. « Refuse la 9e place » se vérifie.

> [!WARNING]
> Un secret dans CLAUDE.md est un secret dans le dépôt, et dans chaque session qui charge le fichier. La règle métier s'écrit. La clé reste dehors.

# AGENTS.md, et après la compaction

Si le dépôt a un `AGENTS.md` et pas de `CLAUDE.md` (ni de `CLAUDE.local.md`) dans le dossier de travail ou au-dessus, Claude Code peut lire `AGENTS.md` à la place. Dès qu'un `CLAUDE.md` de projet est là, c'est lui qui porte les consignes du dépôt. Pour Sève, vous écrivez le vôtre, avec les nombres de Léa, plutôt que de compter sur un fichier pensé pour un autre outil.

Après une compaction, le `CLAUDE.md` à la racine du projet est relu depuis le disque. Corriger le fichier corrige donc la suite de la session. Répéter la règle seulement dans le fil ne la grave pas. Le chapitre sur la compaction y revient : le durable est ici, et dans le code, pas dans la conversation.

Vous pouvez vérifier tout de suite. Vous ouvrez une session dans le dépôt, vous demandez : « Quelles sont les règles de places, de prix, d'attente et d'heure, sans modifier de fichier ? » Une réponse qui dit 8, 45 €, 12 et 18 h a lu le fichier. Une réponse qui invente une file illimitée vous renvoie au texte : la phrase manque, ou elle est contredite ailleurs.

# Exercices

## Exercice 1 : Où poser la règle des huit

Vous voulez que chaque session sur Sève refuse l'idée d'une neuvième place. Vous hésitez entre le fil de discussion, `~/.claude/CLAUDE.md`, et `./CLAUDE.md`. Où l'écrivez-vous, et pourquoi ?

<details>
<summary>Voir la solution</summary>

Vous l'écrivez dans le CLAUDE.md de projet, `./CLAUDE.md` ou `./.claude/CLAUDE.md`. Il est commité avec le dépôt, chargé au début de chaque session, et relu après compaction. L'équipe qui travaille sur Sève voit la même règle.

Le fichier utilisateur s'appliquerait à tous vos projets, y compris ceux qui n'ont pas huit places. Le fil ne dure qu'une session. La phrase tient en une ligne : 8 places, la 9e inscription est refusée, à côté de 45 €, de l'attente de 12 et des 18 h.

</details>

## Exercice 2 : Le jeton et le roman

Un brouillon de CLAUDE.md raconte trois pages sur la Croix-Rousse, puis colle le jeton du service de SMS « pour que la session puisse confirmer ». Que gardez-vous ?

<details>
<summary>Voir la solution</summary>

Vous gardez une page courte. Les commandes de lancement et de test. Les règles : 8 places, 45 €, attente ordonnée jusqu'à 12, Léa tranche avant 18 h la veille, confirmation visible. Une ligne suffit pour dire que le SMS oublié est le problème à éviter.

Vous retirez le jeton. Un secret dans ce fichier est un secret versionné. Vous retirez le récit. Il coûte du contexte à chaque session sans changer ce que le code doit faire. `/init` avait pu poser un brouillon : vous le coupez jusqu'à l'utile.

</details>

## Exercice 3 : Deux phrases contraires

Votre `~/.claude/CLAUDE.md` dit : « Quand une capacité est douteuse, propose une valeur souple. » Le CLAUDE.md de Sève dit : « 8 places, la 9e est refusée. » Une session propose 10 places « par souplesse ». D'où vient le flottement, et que changez-vous ?

<details>
<summary>Voir la solution</summary>

Les deux fichiers sont concaténés, du plus large au plus spécifique. Aucun n'efface l'autre. La phrase « valeur souple » et la phrase « 8 places » sont toutes les deux dans le contexte. La session peut suivre la première.

Vous reformulez votre fichier utilisateur pour qu'il ne parle plus de capacité. La règle chiffrée reste dans le fichier de projet, sans contraire au-dessus d'elle. Vous relancez la question en lecture seule : la réponse attendue est 8, pas 10.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Un CLAUDE.md utile
center: "Le CLAUDE.md de projet est chargé à chaque session et relu après compaction. Commandes, 8 places, 45 €, attente 12, règle des 18 h."
points:
  - icon: file
    title: Projet
    text: "./CLAUDE.md ou ./.claude/CLAUDE.md. C'est le fichier que l'équipe committe avec Sève."
  - icon: layers
    title: Concaténés
    text: "Organisation, puis vous, puis le dépôt. Les textes s'ajoutent, ils ne s'écrasent pas."
  - icon: terminal
    title: Commandes
    text: "La vraie commande pour lancer, la vraie commande pour tester. Celles du dépôt."
  - icon: ruler
    title: Règles
    text: "8 places, 45 €, attente ordonnée jusqu'à 12, Léa tranche avant 18 h la veille."
  - icon: lock
    title: Sans secret
    text: "Pas de jeton, pas de roman. AGENTS.md est lu s'il n'y a pas déjà un CLAUDE.md."
pitfall: "Laisser la règle des 8 places seulement dans le fil, ou coller un jeton de SMS dans le fichier commité."
remember: "Une page de projet, des commandes vraies, les nombres de Léa. Elle est relue au lancement et après compaction."
```
