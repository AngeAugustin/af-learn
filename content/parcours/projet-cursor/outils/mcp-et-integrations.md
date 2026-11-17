---
title: Brancher un outil avec MCP
description: "Relier Cursor à un outil externe avec MCP, via mcp.json ou Customize, choisir un transport, approuver l'appel, et n'activer que le serveur utile."
duration: 50
objectives:
  - "Expliquer que MCP relie Cursor à un outil externe"
  - "Situer la configuration dans mcp.json ou la page Customize"
  - "Distinguer les transports stdio, SSE et HTTP streamable"
  - "Approuver l'appel, n'activer qu'un serveur, garder le secret hors du prompt"
---

# Cursor parle à un outil

MCP (Model Context Protocol) relie Cursor à un outil ou à une source de données hors du dépôt. L'agent peut alors appeler cet outil, au lieu de vous faire coller tout le contenu dans le chat. Pour l'Atelier Sève, l'outil utile est celui qui lit le tableau des stages de Léa Vernet : 12 stages dans le mois, chacun à 45 €, 8 places, le créneau du samedi de 10 h à 13 h à Lyon Croix-Rousse.

Vous ne branchez pas MCP pour réécrire App Sève. Vous le branchez pour lire un fait qui vit déjà ailleurs, dans le tableau de Léa. La documentation du produit est sur [https://cursor.com/docs/mcp](https://cursor.com/docs/mcp). Ce chapitre suit ces faits, et le geste dans l'éditeur.

> [!NOTE]
> MCP ne remplace pas les tests, ni le diff, ni votre lecture de l'écran. Il apporte une donnée externe au chat, sous votre approbation.

# Où se règle le serveur

Deux endroits, au choix. Le fichier `mcp.json` du projet, dans `.cursor/mcp.json`, décrit les serveurs de ce dépôt. La page Customize, dans le volet de Cursor, permet d'ajouter un serveur, de l'activer ou de le couper. Un serveur coupé ne se charge pas et n'apparaît pas dans le chat.

Vous pouvez aussi décrire un serveur pour tous vos projets dans le `mcp.json` de votre dossier utilisateur. Pour Sève, préférez le fichier du projet ou Customize : le tableau des stages ne concerne pas les autres dépôts. Vous nommez le serveur d'après ce qu'il fait, par exemple `stages-seve`.

```json
{
  "mcpServers": {
    "stages-seve": {
      "type": "stdio",
      "command": "python",
      "args": ["outils/lire_stages.py"],
      "env": {
        "CLE_TABLEAU": "${env:CLE_TABLEAU}"
      }
    }
  }
}
```

La valeur `${env:CLE_TABLEAU}` pointe vers une variable déjà présente sur la machine. Le fichier ne contient pas le secret en clair. S'il n'y a pas de clé, vous omettez ce bloc.

# Trois transports

Cursor parle au serveur de trois façons. **stdio** lance une commande sur votre machine. Cursor démarre le processus, lui envoie des messages sur l'entrée standard, et lit sa sortie. C'est le bon choix pour un script local qui lit le tableau des stages.

**SSE** et **HTTP streamable** s'adressent à une URL. Le serveur peut tourner en local ou à distance. La documentation appelle le troisième transport Streamable HTTP. Dans les trois cas, l'agent n'invente pas la donnée : il appelle un outil que le serveur a déclaré, et vous voyez cet appel.

```diagram
type: compare
title: "Comment Cursor joint l'outil"
columns:
  - title: "stdio"
    tone: violet
    items:
      - "Une commande sur la machine"
      - "Cursor démarre le processus"
      - "Adapté à un tableau lu en local"
  - title: "SSE"
    tone: blue
    items:
      - "Une URL vers un flux SSE"
      - "Serveur local ou distant"
      - "Approbation avant l'appel"
  - title: "HTTP streamable"
    tone: teal
    items:
      - "Une URL vers un endpoint HTTP"
      - "Serveur local ou distant"
      - "La doc dit Streamable HTTP"
```

> [!TIP]
> Pour le tableau de Léa déjà sur l'ordinateur, stdio suffit. Une URL distante n'est utile que si le tableau vit vraiment sur ce serveur.

# L'approbation avant l'appel

Par défaut, Cursor demande une approbation avant d'utiliser un outil MCP. Vous voyez le nom de l'outil et vous pouvez déplier ses arguments. Pour Sève, un appel juste lit le tableau. Il ne modifie pas les prix, il n'envoie pas de SMS, il ne crée pas un 13e stage.

Vous refusez l'appel si les arguments dépassent la lecture : écrire dans le tableau, changer 45 € en un autre prix, ou expédier un message aux inscrits. Les 3 absents mensuels liés au SMS oublié ne se traitent pas en laissant un outil écrire tout seul. L'approbation est le moment où vous comparez l'appel à la demande.

> [!WARNING]
> Une approbation distraite accepte les arguments affichés. Vous les lisez. Le nom rassurant du serveur ne suffit pas.

# Un seul serveur utile

La page Customize liste les serveurs installés. Vous activez celui qui lit le tableau des stages. Vous laissez les autres coupés. Chaque serveur allumé ajoute des outils au contexte. L'agent peut alors en choisir un que vous n'aviez pas en tête : une boîte mail, une base, un envoi.

La demande dans le chat reste étroite. « Lis le tableau des stages du mois. Ne modifie rien. » Vous comparez la réponse aux faits de Léa : 12 lignes, 45 €, 8 places, samedi 10 h-13 h, Croix-Rousse. Si une ligne manque, vous le dites. Vous ne demandez pas au serveur d'inventer le stage manquant pour arriver à 12.

| Serveur | Pour cette séance | Votre geste dans Customize |
|---|---|---|
| Lecture du tableau des stages | Oui, c'est la donnée manquante | Activé |
| Envoi de messages | Non, le SMS est un autre incrément | Coupé |
| Écriture dans le tableau | Non, vous vouliez lire | Coupé |
| Outil sans rapport avec Sève | Non, il encombre le chat | Coupé |

# Le secret ne passe pas par le prompt

Vous ne collez pas une clé, un jeton ou un mot de passe dans le message à l'agent. Le prompt est repris dans la conversation, parfois dans un fichier si l'agent le recopie. La clé du tableau, s'il en faut une, reste dans l'environnement du serveur, référencée depuis `mcp.json` comme ci-dessus. L'agent demande l'outil. Il ne reçoit pas le secret à « se débrouiller ».

Le prix de 45 €, les horaires et le nombre de places ne sont pas des secrets. Vous pouvez les voir dans la réponse de l'outil et les comparer à l'écran. Le jeton, non. S'il a déjà été collé dans le chat, vous le considérez comme exposé : vous le renouvelez auprès du service, et vous cessez de l'écrire dans les messages.

> [!IMPORTANT]
> Le secret va dans l'environnement du serveur, ou il n'est pas nécessaire. Il ne va ni dans le prompt, ni dans une phrase « pour aider l'agent ».

# Exercices

## Exercice 1 : Lire le mois sans le retaper

Léa tient ses 12 stages dans un tableau hors du dépôt. Vous voulez que l'agent s'en serve pour App Sève. Que branchez-vous, et que n'écrivez-vous pas dans le prompt ?

<details>
<summary>Voir la solution</summary>

Vous activez uniquement le serveur qui lit ce tableau, via `.cursor/mcp.json` ou la page Customize. Le transport local adapté est stdio. La demande dit : lis le tableau, ne modifie rien.

Vous n'écrivez pas la clé dans le prompt. S'il faut une clé, elle reste dans l'environnement, référencée par le fichier de configuration. Vous approuvez l'appel après avoir lu ses arguments.

</details>

## Exercice 2 : L'appel qui écrit

L'approbation affiche un outil du serveur des stages. Les arguments changent un prix de 45 € à 39 € et ajoutent un 13e stage. Le serveur est bien celui du tableau. Acceptez-vous ?

<details>
<summary>Voir la solution</summary>

Vous refusez. Le serveur utile, pour cette séance, lit le tableau. Cet appel écrit, change le prix de Léa et invente un stage. Le nom du serveur ne rend pas l'appel sain.

Vous redemandez une lecture, sans modification. À l'approbation suivante, les arguments doivent se limiter à lire les 12 stages.

</details>

## Exercice 3 : Trois transports, un besoin

Le tableau est un fichier sur votre machine, lu par un script. Un collègue propose une URL distante « au cas où », plus deux autres serveurs déjà installés. Que configurez-vous ?

<details>
<summary>Voir la solution</summary>

Vous configurez un serveur stdio : une commande locale, dans `.cursor/mcp.json` ou depuis Customize. SSE et HTTP streamable servent quand l'outil est derrière une URL. Ici, le fichier est local.

Vous laissez les autres serveurs coupés. Un seul outil utile : lire le tableau. La doc de référence reste [cursor.com/docs/mcp](https://cursor.com/docs/mcp).

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Un outil, une approbation
center: "MCP relie Cursor à un outil. On active la lecture du tableau, on approuve l'appel, on garde le secret hors du prompt."
points:
  - icon: link
    title: Le lien
    text: "MCP connecte l'éditeur à un outil externe. Ici, le tableau des 12 stages."
  - icon: file
    title: La config
    text: "mcp.json dans .cursor, ou la page Customize pour activer et couper."
  - icon: network
    title: Le transport
    text: "stdio en local, SSE ou HTTP streamable vers une URL. Doc : Streamable HTTP."
  - icon: shield
    title: L'approbation
    text: "Cursor demande un accord avant l'appel. Vous lisez les arguments."
  - icon: key
    title: Le secret
    text: "La clé reste dans l'environnement. Elle ne s'écrit pas dans le prompt."
pitfall: "Activer tous les serveurs et coller un jeton dans le chat pour que l'agent lise le tableau."
remember: "Un serveur utile, une lecture, une approbation lue. Le prix de 45 € peut transiter, la clé non."
```
