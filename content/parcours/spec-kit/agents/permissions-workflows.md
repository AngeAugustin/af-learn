---
title: "Permissions des workflows"
description: "Comprendre ce que le workflow Cursor approuve d'un bloc, pourquoi Claude ne coupe pas ses permissions, et pourquoi un workflow ne change ni le test ni les 8 places."
duration: 50
objectives:
  - "Réserver le mode workflow de Cursor à un dépôt où confiance et MCP sont acceptés"
  - "Reconnaître la commande que ce mode lance, et ce qu'elle approuve"
  - "Laisser Claude Code demander ses permissions pendant son workflow"
  - "Garder le test et le plafond de 8 places, workflow ou pas"
---

# Ce que lance un workflow

Dans le chat, vous invoquez un skill, vous lisez l'artefact, vous décidez. Un workflow Spec Kit enchaîne des étapes sans que vous retapiez chaque skill. Ce gain de temps a un prix, qui dépend de l'agent.

Pour Cursor, le workflow a besoin de l'outil `cursor-agent`. Il le lance ainsi :

```text
cursor-agent -p --trust --approve-mcps --force
```

`--trust` court-circuite les demandes de confiance du dossier. `--approve-mcps` approuve le chargement des MCP. `--force` approuve les actions d'outils. Le bloc est entier : vous n'avez pas la demande au milieu du workflow pour dire oui à une lecture et non à un MCP. C'est le comportement de ce mode. Ce n'est pas une recette à ajouter ailleurs pour faire taire une question.

# Un dépôt voulu

Vous ne lancez ce mode que dans un dépôt où vous acceptez ces permissions. L'atelier Sève, si c'est bien le dépôt que vous avez choisi, et si vous acceptez que confiance et MCP y soient approuvés d'un bloc. Pas un dépôt reçu, pas un clone que vous n'avez pas relu, pas un dossier qui contient des secrets « pour aller plus vite ».

Si vous n'acceptez pas ce bloc, vous restez dans le chat de Cursor. `/speckit-specify`, lecture de `spec.md`, `/speckit-plan`. Les skills s'invoquent un par un. Le workflow n'est pas obligatoire pour mener l'attente.

```diagram
type: decision
title: "Ce dépôt mérite-t-il le workflow Cursor ?"
nodes:
  - question: "Acceptez-vous, pour ce dépôt précis, confiance du workspace et MCP approuvés d'un bloc ?"
    yes: "Le workflow peut partir. Vous gardez le test et les 8 places."
    no: "Vous restez dans le chat, un skill à la fois, sans ce mode."
```

> [!IMPORTANT]
> Accepter le mode sur Sève ne l'accepte pas sur le dépôt d'à côté. Le bloc confiance et MCP se décide par dépôt.

# Claude ne coupe pas les siennes

Le workflow de Claude Code lance `claude -p`. Il peut ajouter un modèle ou un format de sortie si le workflow le demande. Il n'ajoute pas de drapeau qui désactive les permissions.

Une étape qui veut écrire `tasks.md`, lancer le test, ou lire la spec, s'affiche encore. Vous lisez la demande. Vous acceptez ce qui sert l'attente. Vous refusez le reste : secret, envoi de SMS, fichier hors du dépôt, plafond passé de 8 à 9.

Vous ne rajoutez pas, de votre côté, un drapeau pour que le workflow « ne s'arrête plus ». S'il s'arrête, la demande mérite une lecture. Les trois absents du mois, ceux du SMS oublié, ne sont pas une raison de laisser l'agent envoyer un message pour de vrai.

> [!WARNING]
> Un workflow n'est pas une permission plus large que le chat. Claude continue de demander. Vous continuez de répondre.

# Les hooks, à part le bloc

À l'installation Cursor, les événements Spec Kit peuvent écrire des hooks dans `.cursor/hooks.json`. Le drapeau `--events false` les désactive :

```bash
specify integration install cursor-agent --integration-options="--events false"
```

Vous vous en servez quand vous ne voulez pas de ces handlers dans le dépôt. Vous ne vous en servez pas pour contourner une demande, ni pour éviter de relire `spec.md`. Les hooks Spec Kit ne sont pas le test « la 9e place est refusée ». Couper les hooks ne coche pas ce test.

Chez Claude Code, les événements passent par `.claude/settings.json`. Chez Codex, par `.codex/config.toml`. Désactiver les événements y est le même genre de choix : moins de handlers, pas moins de relecture, pas moins de plafond.

# Le test tient

L'attente a des preuves, workflow ou chat :

- la 9e place reste refusée (déjà dans l'app, et toujours vraie) ;
- la 13e personne n'entre pas dans l'attente, les 12 noms gardent l'ordre d'arrivée ;
- la page publique affiche « 3 personnes en attente » sans téléphone quand trois personnes patientent ;
- la phrase dit que Léa tranche avant 18 h la veille, et elle n'envoie rien ;
- 45 € reste un prix affiché, sans paiement.

Vous lancez ces tests, vous lisez le résultat. Un workflow qui annonce « terminé » alors qu'un test est rouge n'a pas livré. Vous ne commentez pas le test pour faire passer l'étape. Vous ne passez pas le plafond à 9 « le temps du workflow ». Vous ne publiez pas un numéro pour « vérifier la file ».

Le remplissage de 70 % sur douze stages décrit le mois de Léa. Il ne se code pas comme une neuvième chaise. Le samedi reste 10 h-13 h, à Lyon Croix-Rousse.

> [!CAUTION]
> Voir un workflow vert et un test rouge : vous croyez le test. Huit places. Douze en attente. Dix-huit heures.

# Huit places, même en automatique

Le workflow exécute des skills. Il ne réécrit pas la constitution. Si une étape propose d'élargir l'atelier, vous l'arrêtez et vous corrigez l'artefact source : `spec.md`, `plan.md` ou `tasks.md`. Puis vous relancez l'analyse avant de coder.

`.specify/feature.json` doit toujours pointer l'attente. Un workflow lancé sur une autre fonctionnalité peut être « vert » et n'avoir rien fait pour les 18 h. Vous vérifiez le pointeur avant de croire le compte-rendu.

La note que vous ferez à Léa, plus tard, dira ce qui a été vérifié à l'écran. Elle ne dira pas « le workflow a approuvé les MCP, donc c'est bon ». Les MCP approuvés sont un choix de dépôt. La place refusée est un fait d'atelier.

# Exercices

## Exercice 1 : Le bon dépôt

On vous propose de lancer le workflow Cursor sur un clone que vous n'avez pas ouvert, « pour gagner l'attente de Sève ». Le clone contient un `.env`. Que décidez-vous ?

<details>
<summary>Voir la solution</summary>

Vous ne lancez pas ce mode. `cursor-agent -p --trust --approve-mcps --force` approuve confiance et MCP d'un bloc, et force les actions d'outils. Cela se réserve à un dépôt où vous acceptez exactement ces permissions. Un clone non relu, avec un secret, n'est pas ce dépôt.

Vous ouvrez le dépôt voulu, vous vérifiez qu'aucun secret n'est dans les fichiers suivis, et vous travaillez dans le chat : `/speckit-specify`, lecture de `spec.md`, suite un skill à la fois. Ou vous lancez le workflow seulement après avoir accepté le bloc pour **ce** dépôt-là.

</details>

## Exercice 2 : Claude s'arrête

Le workflow Claude Code s'arrête sur une demande : modifier le refus pour accepter 9 inscrits « afin de coller aux 70 % ». Quelqu'un suggère d'ajouter un drapeau pour ne plus voir les demandes. Que faites-vous ?

<details>
<summary>Voir la solution</summary>

Vous refusez la modification. Huit places. Le remplissage moyen n'est pas le plafond. Le workflow utilise `claude -p` et n'ajoute pas de drapeau qui désactive les permissions. Vous n'en ajoutez pas.

Vous corrigez la source si un artefact a déjà écrit « 9 ». Vous relancez le test du refus. Vous continuez le workflow, ou le chat, seulement avec des demandes qui tiennent l'attente de 12 et les 18 h. Les trois absents ne justifient pas d'ouvrir une chaise.

</details>

## Exercice 3 : Un test commenté

Le workflow annonce la phrase des 18 h livrée. Le test qui vérifie cette phrase est commenté, pour qu'il passe. `--events false` a été posé sur l'installation Cursor. Cela sauve-t-il la livraison ?

<details>
<summary>Voir la solution</summary>

Non. Vous décommentez le test, vous le lancez, vous lisez l'échec ou le succès réel. La phrase des 18 h doit se lire, sans envoi. Le 13e nom reste refusé. « 3 personnes en attente » s'affiche sans téléphone. Le prix reste 45 €, affiché, sans paiement.

`--events false` a seulement désactivé les hooks Spec Kit de `.cursor/hooks.json`. Il ne valide pas un test, il n'élargit pas les 8 places, et il ne remplace pas l'écran que vous ouvrez pour Léa.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Permissions des workflows"
center: "Le workflow Cursor approuve confiance et MCP d'un bloc. On le réserve à un dépôt voulu. Le test et les 8 places restent."
points:
  - icon: zap
    title: "Le bloc Cursor"
    text: "cursor-agent -p --trust --approve-mcps --force court-circuite confiance et approuve les MCP."
  - icon: lock
    title: "Dépôt voulu"
    text: "Vous ne lancez ce mode que là où vous acceptez ces permissions. Sinon, le chat suffit."
  - icon: shield
    title: "Claude demande"
    text: "claude -p n'ajoute pas de drapeau qui coupe les permissions. Vous lisez chaque demande."
  - icon: eye
    title: "Hooks"
    text: "--events false désactive les hooks Spec Kit de .cursor/hooks.json. Pas le test."
  - icon: test
    title: "Huit places"
    text: "Un workflow ne commente pas un test et n'ouvre pas une 9e place pour les 70 %."
pitfall: "Lancer le mode Cursor sur un dépôt non relu, ou couper les demandes de Claude pour finir."
remember: "Workflow seulement sur un dépôt accepté. Claude demande encore. 8 places, 12 en attente, 18 h."
```
