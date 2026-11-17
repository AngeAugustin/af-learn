---
title: "Projet final : l'attente de Sève avec Spec Kit"
description: "Enchaîner le flux Spec Kit sur l'attente ordonnée et la phrase des 18 h, dans un seul agent, jusqu'à la convergence et une note de livraison pour Léa."
duration: 90
objectives:
  - "Mener le flux complet dans un seul agent, avec la bonne invocation"
  - "Relire chaque artefact avant le skill suivant, et n'implémenter qu'après une analyse tenue"
  - "Implémenter par phase, puis converger jusqu'à ce que le code rejoigne la spec"
  - "Remettre à Léa une note de livraison vérifiable, sans secret et sans 9e place"
---

# Un agent pour tout le flux

Vous choisissez **un** agent et vous y restez : Cursor, Claude Code ou Codex. L'attente ordonnée et la phrase des 18 h se mènent au bout. Pas deux chats qui écrivent les mêmes fichiers. Pas un changement d'agent au milieu d'une phase.

L'Atelier Sève, Léa Vernet, Lyon Croix-Rousse. Samedi 10 h-13 h. Huit places, 45 € affichés. La liste et le refus de la neuvième place sont déjà là. Vous ajoutez trois choses, dans l'ordre des dépendances : le 13e nom refusé, les 12 autres gardant l'ordre d'arrivée ; le compte public « 3 personnes en attente », sans téléphone ; la phrase à l'écran, Léa tranche avant 18 h la veille, et cette phrase n'envoie rien. Douze stages par mois, remplissage autour de 70 %, trois absents parce que le SMS a été oublié. Ces trois-là expliquent la phrase. Ils ne s'envoient pas, et ils n'ouvrent pas de chaise.

La constitution est déjà posée. Vous la relisez. Vous n'y ajoutez pas de jeton. Si un principe contredit les huit places ou publie un téléphone, vous le corrigez avant le specify, dans un message à part.

# La bonne invocation

Vous ouvrez le dépôt dans l'agent choisi. Si Cursor n'est pas encore posé sur le dépôt plein, vous avez commité, puis `specify init --here --force --integration cursor-agent`. Si le kit est là et qu'il manque un agent, `specify integration install` avec la clé : `cursor-agent`, `claude` ou `codex`. Un dossier neuf, seulement, naît avec `specify init seve --integration` et la clé. Puis le chat.

| Agent | Clé | Invocation de la spec | Dossier des skills |
| --- | --- | --- | --- |
| Cursor | `cursor-agent` | `/speckit-specify` | `.cursor/skills/` |
| Claude Code | `claude` | `/speckit-specify` | `.claude/skills/` |
| Codex | `codex` | `$speckit-specify` | `.agents/skills/` |

Le dollar est réservé à Codex. Le slash est réservé aux deux autres. Vous ne lancez aucune de ces lignes dans le terminal.

Vous enchaînez, **un skill par message**, avec le même préfixe :

1. specify
2. clarify
3. plan
4. checklist
5. tasks
6. analyze
7. implement, une phase à la fois
8. converge

Si analyze est rouge, vous ne passez pas à 7. Vous corrigez la source et vous relancez l'analyse.

```diagram
type: flow
title: "Un agent, le flux de l'attente"
loop: "Jusqu'au message qui dit que c'est convergé"
steps:
  - title: Specify
    text: "13e refusé, compte sans téléphone, phrase des 18 h."
    tone: violet
  - title: Clarify
    text: "Réponses reportées dans spec.md, puis relues."
    tone: blue
  - title: Plan
    text: "L'app déjà là. Checklist, puis tâches dans l'ordre."
    tone: teal
  - title: Analyze
    text: "Vert exigé. Rouge : on corrige, on ne code pas."
    tone: amber
  - title: Phases
    text: "13e, puis le compte, puis la phrase. Écran inclus."
    tone: rose
  - title: Converge
    text: "Tâches ajoutées, ou le message convergé."
    tone: violet
```

# Relire chaque artefact

Après specify, vous ouvrez `spec.md`. Après clarify, vous le rouvrez. Après le plan, `plan.md` réutilise l'application. Après la checklist, vous cochez vous-même les critères vraiment tenus. `checklists/requirements.md` reste à specify et à clarify. Après les tâches, l'ordre est : refus du 13e, compte sans téléphone, phrase des 18 h. Après analyze, le rapport.

`.specify/feature.json` pointe cette fonctionnalité sur cette copie. Un commit ne transporte pas ce pointeur. Vous le relisez ici avant chaque bascule.

Cinq lignes avant d'implémenter :

- 8 places, la 9e toujours refusée ;
- 45 € affichés, pas un paiement ;
- 13e nom refusé, 12 noms dans l'ordre d'arrivée ;
- page publique : « 3 personnes en attente », aucun téléphone ;
- phrase « avant 18 h », lue, sans envoi.

Si une ligne manque, vous retournez au skill qui possède le fichier. Vous ne la rajoutez pas « dans le code » pour compenser.

> [!IMPORTANT]
> Claude Code, si c'est lui, demande encore ses permissions. Vous les lisez. Un workflow Cursor, si vous l'utilisez, seulement sur ce dépôt, en acceptant le bloc confiance et MCP. Ni l'un ni l'autre ne remplace la relecture.

# Implement par phase

L'analyse est tenue. Vous implémentez en trois temps. Premier message, par exemple dans Cursor :

```text
/speckit-implement
Seulement la phase qui refuse le 13e nom.
Les 12 noms déjà là restent dans l'ordre d'arrivée.
Ne pas afficher le compte public. Ne pas écrire la phrase des 18 h.
Ne pas toucher au refus de la 9e, sauf pour le laisser intact. Pas de téléphone.
```

Vous lancez le test de cette phase. Vous lisez le diff. Pas de secret, pas de paiement, pas de framework neuf. Puis le compte, dans un autre message : « 3 personnes en attente » sans téléphone, arrêt avant la phrase. Puis la phrase :

```text
/speckit-implement
Seulement la phase de la phrase des 18 h.
À l'écran : Léa tranche avant 18 h la veille. La phrase n'envoie rien.
Pas de SMS, pas de jeton, pas de numéro, pas de paiement.
```

Même texte avec le préfixe de votre agent. Codex : `$speckit-implement`. Vous relancez les tests des trois phases, plus le refus de la 9e déjà ancien. Vous ouvrez l'écran. Vous tentez un 13e nom. Vous lisez le compte de trois personnes, sans numéro. Vous lisez la phrase. Vous dites ce que vous voyez.

> [!WARNING]
> Une phase dont le test est vert et dont vous n'avez pas regardé l'écran n'est pas finie. On ne dit pas « ignore les tests ». Le skill ne signe pas à votre place.

# Converge

`/speckit-converge` (ou `$speckit-converge`) compare le code à la spec, au plan et aux tâches. Il ne réécrit pas le code. S'il manque quelque chose, il ajoute des tâches dans `tasks.md`. S'il ne manque rien, il le dit : c'est convergé, et `tasks.md` n'a pas reçu de nouvelle tâche.

Tant que des tâches ont été ajoutées, vous n'avez pas fini. Vous les relisez. Une tâche « afficher la phrase » s'implémente. Une tâche « passer à 9 places », « brancher le SMS » ou « encaisser 45 € » ne s'exécute pas : vous la retirez, vous ramenez la spec au principe s'il le faut, vous relancez converge. Vous recommencez jusqu'au message qui dit que c'est convergé.

# La note pour Léa

La note se vérifie sans lire le chat :

- **Livré** : 13e nom refusé, 12 noms dans l'ordre ; « 3 personnes en attente » sans téléphone ; phrase des 18 h à l'écran, sans envoi.
- **Déjà en place, inchangé** : liste, samedi 10 h-13 h, Lyon Croix-Rousse, 45 € affichés, refus de la 9e.
- **Vérifié** : le nom des tests, et ce que vous avez vu (un 13e nom refusé, un compte sans numéro, la phrase).
- **Hors livraison** : SMS, jeton, numéro, paiement. Les 3 absents restent la raison de la phrase.
- **Contexte, non codé comme règle** : 12 stages par mois, remplissage autour de 70 %. Le plafond codé est 8, pas 70 %.
- **Agent** : celui choisi, avec le préfixe. Un seul.

Vous ne joignez pas `.env`. Vous ne dites pas « le workflow a tout approuvé ». Léa peut refaire : remplir 8 places, tenter la 9e, remplir 12 noms d'attente, tenter le 13e, lire le compte, lire la phrase.

> [!TIP]
> Une note que Léa ne peut pas vérifier à l'écran est un compte-rendu de chat. Vous la réécrivez avec les gestes et les nombres.

# Ce que vous refusez en route

Vous refusez : tout le flux dans un seul prompt ; un plan qui change de framework ; une checklist cochée sans lecture ; un analyze rouge suivi d'implement ; deux agents en écriture ; un secret ; un téléphone sur la page publique ; un drapeau pour faire taire Claude ; le mode workflow de Cursor sur un dépôt non choisi. `--events false` ne désactive que des hooks. Il ne remplace aucun test.

À la fin, le dépôt contient la spec, le plan, les tâches, le code des trois phases, et la note. Sur cette copie, `.specify/feature.json` pointe encore l'attente.

# Exercices

## Exercice 1 : Le flux dans l'agent choisi

Vous choisissez un agent parmi Cursor, Claude Code et Codex. Écrivez la séquence, le préfixe exact, et ce que vous ouvrez entre specify et plan.

<details>
<summary>Voir la solution</summary>

Cursor : slash, clé `cursor-agent`, skills dans `.cursor/skills/`. Claude Code : slash, clé `claude`, skills dans `.claude/skills/`. Codex : dollar, clé `codex`, skills dans `.agents/skills/`. Un seul écrit. Le terminal ne reçoit pas ces invocations. Dépôt plein sans Spec Kit : commit, puis `specify init --here --force --integration` et la clé. Kit déjà là : `specify integration install` et la clé. Dossier neuf : `specify init seve --integration` et la clé. Pas de copie de dossiers.

Séquence, un message à la fois : specify, clarify, plan, checklist, tasks, analyze. Entre specify et plan, vous ouvrez `spec.md` : 8 places, 45 € affichés, 13e refusé, ordre d'arrivée, compte sans téléphone, phrase « avant 18 h » sans envoi, pas de SMS, pas de paiement. La liste et le refus de la 9e sont des acquis. Pas de framework dans la spec. `.specify/feature.json` pointe cette attente, ici.

Implement seulement si analyze ne signale plus de conflit. Vous cochez la checklist vous-même. Claude Code demande encore ses permissions. Un workflow Cursor suppose que vous acceptez, pour ce dépôt, `cursor-agent -p --trust --approve-mcps --force`.

</details>

## Exercice 2 : Analyze rouge au moment de coder

Le rapport dit que `plan.md` ajoute une 9e place « les semaines à 70 % », et que `tasks.md` publie des téléphones puis envoie un SMS. L'ordre des tâches met la phrase avant le refus du 13e. Vous vouliez implement. Que faites-vous avant de coder, puis dans quel ordre de phases ?

<details>
<summary>Voir la solution</summary>

Vous n'invoquez pas implement. Vous renvoyez le plan : réutiliser l'app, plafond 8, pas de place liée au remplissage, pas de paiement. Vous renvoyez les tâches : retirer téléphones publics et SMS. L'ordre redevient : refus du 13e (les 12 gardent l'arrivée), puis « 3 personnes en attente » sans numéro, puis la phrase des 18 h sans envoi.

Vous rouvrez les trois fichiers. Vous relancez analyze. Tant que c'est rouge, vous corrigez la source. Au vert, vous implémentez une phase, test et écran, puis la suivante. Vous ne dites pas « ignore les tests ». Le refus de la 9e et les 45 € affichés restent en place.

</details>

## Exercice 3 : Converge, puis la note

Converge ajoute deux tâches : « afficher la phrase des 18 h » et « brancher le jeton SMS pour les 3 absents ». L'écran ne montre pas encore la phrase. Le SMS n'est pas dans la spec. Que codez-vous, que rejetez-vous, et que contient la note pour Léa ?

<details>
<summary>Voir la solution</summary>

Vous implémentez seulement la phrase, après l'avoir relue : Léa tranche avant 18 h la veille, la phrase se lit, elle n'envoie rien. Vous ne branchez pas de jeton. Vous retirez la tâche SMS, vous vérifiez que `spec.md` laisse l'envoi hors champ, vous relancez converge. Vous recommencez s'il reste un écart dans la spec (13e nom, compte sans téléphone, phrase). Au message convergé, `tasks.md` n'a pas gagné de tâche nouvelle, et il n'exige pas l'envoi.

La note pour Léa dit : 13e refusé, compte « 3 personnes en attente » sans téléphone, phrase des 18 h, 45 € affichés, 9e toujours refusée, liste inchangée. Elle cite les tests et l'écran. Elle marque hors livraison le SMS et le paiement. Elle nomme l'agent et le préfixe. Elle ne joint aucun secret. Elle ne présente pas les 70 % comme un plafond.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "L'attente, livrée"
center: "Un agent, le bon préfixe, chaque artefact relu. Trois phases, converge, puis une note que Léa peut vérifier."
points:
  - icon: compass
    title: "Un agent"
    text: "Cursor en slash, Claude Code en slash, Codex en dollar. Pas deux écrivains."
  - icon: eye
    title: "Relire"
    text: "spec, plan, checklist, tâches, analyze. Rouge : on corrige avant implement."
  - icon: layers
    title: "Trois phases"
    text: "13e refusé, puis le compte sans téléphone, puis la phrase des 18 h."
  - icon: loop
    title: "Converge"
    text: "Ajoute des tâches ou dit que c'est convergé. On ne code pas le SMS."
  - icon: file
    title: "Note à Léa"
    text: "Tests et écran. 8 places, 45 € affichés, pas de téléphone public."
  - icon: shield
    title: "Tenir"
    text: "Pas de secret, pas de 9e place. Claude demande. Workflow Cursor seulement si le dépôt est voulu."
pitfall: "Tout le flux en un prompt, implement sur analyze rouge, ou une note qui parle du chat au lieu de l'écran."
remember: "Flux complet, un agent, trois phases puis converge. Léa vérifie le 13e, le compte et la phrase."
```
