---
title: "ConfigMap, Secret et .env"
description: "Séparer la configuration publique et les secrets, ne pas committer un secret en clair, le faire tourner, et ne pas confondre avec un .env de poste."
duration: 60
objectives:
  - Choisir un ConfigMap ou un Secret selon la sensibilité de la valeur
  - Expliquer pourquoi le base64 d'un Secret n'est pas un chiffrement
  - Faire tourner un secret sans couper tous les clients d'un coup
  - Dire en quoi un fichier .env local n'est pas la configuration du cluster
---

# ConfigMap pour ce qui n'est pas secret

Un **ConfigMap** stocke de la configuration que tout le namespace peut lire sans drame : niveau de logs, URL publique, timeouts, feature flags non sensibles. Ce n'est pas un endroit « un peu confidentiel ». Si la valeur permet d'agir au nom de l'entreprise ou d'ouvrir une base, ce n'est pas un ConfigMap.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-config
  namespace: atelier
data:
  LOG_LEVEL: info
  PUBLIC_URL: https://atelier.exemple.fr
  REQUEST_TIMEOUT: "3s"
```

Le pod le consomme en variables d'environnement ou en fichiers montés.

```yaml
envFrom:
  - configMapRef:
      name: api-config
```

Changer le ConfigMap **ne redémarre pas** les pods. Une variable d'environnement est figée au démarrage du conteneur : elle garde l'ancienne valeur jusqu'au prochain rollout. Un fichier monté, lui, est mis à jour par le kubelet (avec un délai), mais seulement si l'application relit le fichier. Beaucoup d'applications ne le relisent pas. Le geste fiable : une annotation du pod qui change quand le contenu change (un hash), pour que le Deployment recrée les pods. Les outils de paquet le font souvent. Un `kubectl edit` du ConfigMap, seul, ne met personne à jour.

On versionne le ConfigMap. Il ne contient pas de mot de passe « temporaire ».

# Secret n'est pas un chiffrement magique

Un **Secret** est l'objet Kubernetes prévu pour une valeur sensible : URL de base avec mot de passe, jeton d'API, certificat. L'API le stocke encodé en **base64**. Encoder n'est pas chiffrer : `base64 -d` rend la valeur. Toute identité qui peut `kubectl get secret api-db -o yaml` obtient le secret.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: api-db
  namespace: atelier
type: Opaque
stringData:
  DATABASE_URL: postgres://atelier:remplacer-moi@db:5432/atelier
```

`stringData` est pratique à l'écriture : Kubernetes encode à l'enregistrement. Le YAML ci-dessus, s'il est commité avec la vraie URL, **est** une fuite, autant qu'un fichier `.env` poussé sur Git. On ne committe pas ce manifeste rempli. On committe le Deployment qui **référence** le Secret.

```yaml
env:
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: api-db
        key: DATABASE_URL
```

Le Secret lui-même est créé hors du dépôt : coffre, outil qui synchronise un coffre vers le cluster, ou secret chiffré pour Git avec une clé que le dépôt n'a pas en clair. Le cluster peut en plus chiffrer etcd au repos. Ce réglage est une propriété du cluster, pas un effet du mot « Secret » dans le YAML. Sans ce réglage, un accès aux sauvegardes d'etcd suffit.

Les droits RBAC sur `secrets` sont plus rares que ceux sur `configmaps`. Pouvoir déployer ne devrait pas vouloir dire pouvoir lire tous les secrets du namespace. Un dashboard qui affiche les variables d'environnement des pods les affiche aussi : la valeur injectée par `env` est visible des identités qui peuvent lire le pod.

```diagram
type: compare
title: "Où mettre quelle valeur"
columns:
  - title: "ConfigMap"
    tone: blue
    items:
      - "LOG_LEVEL, URL publique, timeouts"
      - "Versionné en clair"
      - "Lisible largement dans le namespace"
  - title: "Secret"
    tone: violet
    items:
      - "Mot de passe, jeton, clé, certificat"
      - "Base64, à restreindre par RBAC"
      - "Créé hors du dépôt, ou chiffré pour Git"
  - title: "Fichier .env"
    tone: amber
    items:
      - "Poste du développeur seulement"
      - "Gitignore, jamais dans l'image"
      - "localhost n'est pas le Service du cluster"
```

# Ne pas committer un secret en clair

Le base64 ne « protège » pas un commit. Un manifeste `data:` avec la chaîne encodée se décode en une ligne. Un `stringData` est déjà en clair. Les deux sont des secrets publiés dès qu'ils sont dans Git, y compris dans l'historique.

Le correctif d'une fuite n'est pas seulement de retirer le fichier. L'historique le garde, les clones aussi, les forks aussi. On **fait tourner** la valeur (nouveau mot de passe, ancien révoqué), puis on retire le fichier et on ajoute un contrôle qui refuse les nouveaux commits (détection de secrets dans la CI). Réécrire l'historique sans rotation laisse l'ancien mot de passe valide.

On ne copie pas non plus le secret dans l'image, ni dans les arguments de la commande (`ps` et les logs de lancement les montrent), ni dans un `--set` Helm. Le Deployment ne contient que le nom et la clé.

> [!WARNING]
> Un Secret appliqué depuis un YAML rempli, puis « corrigé » par un commit qui l'efface, laisse la valeur dans l'historique Git. La rotation vient en premier.

# Faire tourner un secret sans tout couper

**Rotation** : la nouvelle valeur devient la bonne, l'ancienne cesse de marcher, et entre les deux le service reste debout. Pour une base, le schéma le plus simple est un second utilisateur.

1. Créer le nouvel utilisateur (ou le nouveau mot de passe) **à côté** de l'ancien. Les deux fonctionnent.
2. Écrire la nouvelle URL dans le Secret, sous la même clé ou sous une clé nouvelle que le pod va lire.
3. Recréer les pods (`rollout restart`, ou changement d'annotation). Les variables d'environnement ne bougent pas toutes seules.
4. Vérifier que les nouveaux pods servent le trafic avec la nouvelle identité.
5. Révoquer l'ancienne. Pas avant.

Si l'application ne relit pas un fichier monté, on ne compte pas sur la mise à jour du volume : on redémarre. Un redémarrage de tous les pods en même temps, avec un secret déjà révoqué, coupe le service. L'ordre est : chevauchement, bascule, révocation.

Les certificats ont une date. On les renouvelle avant l'échéance, pas la nuit où ils expirent. La même séquence s'applique : le nouveau certificat est en place et servi avant que l'ancien ne soit retiré.

Un secret qu'on ne sait pas faire tourner (un jeton collé dans trois SaaS, sans second jeton possible) est un risque à noter. On le découvre en répétant la rotation sur un secret de staging, pas pendant l'incident.

# Le fichier .env reste sur le poste

Le `.env` local décrit **votre machine**.

```text
LOG_LEVEL=debug
DATABASE_URL=postgres://atelier:atelier@localhost:5432/atelier
```

`localhost` fonctionne quand le port de la base est publié sur le poste, ou quand la base tourne hors conteneur. Dans le cluster, l'hôte est le nom du Service, le mot de passe n'est pas `atelier`, et `LOG_LEVEL=debug` en production noie le stockage de logs. Copier le `.env` dans un ConfigMap, ou le `COPY` dans l'image, mélange ces mondes et publie le secret.

| | `.env` du poste | ConfigMap / Secret |
|---|---|---|
| Qui le lit | Le framework, sur la machine | Le kubelet, en injectant le pod |
| Durée de vie | Le temps de la session de dev | La vie de l'objet et des pods qui le montent |
| Contenu | Raccourcis locaux, données factices | Valeurs de l'environnement cible |
| Git | Ignoré | ConfigMap oui, Secret non (sauf chiffré) |

Le `.env.example` versionné, **sans** valeur sensible, liste les clés dont l'application a besoin. Il documente. Il ne se substitue pas au Secret. L'écart entre l'exemple et la production se voit : `localhost` contre le nom du Service, `debug` contre `info`.

# Exercices

## Exercice 1 : Ranger quatre valeurs

Classez chaque valeur : `LOG_LEVEL`, `PUBLIC_URL`, mot de passe PostgreSQL, clé d'API de paiement. Dites l'objet Kubernetes, et si le fichier va dans Git.

<details>
<summary>Voir la solution</summary>

`LOG_LEVEL` et `PUBLIC_URL` vont dans le ConfigMap `api-config`, versionné. Le mot de passe de PostgreSQL et la clé de paiement vont dans des Secrets, hors du dépôt en clair (coffre ou secret chiffré). Le Deployment ne contient que des `secretKeyRef` et le `configMapRef`.

Aucune de ces quatre valeurs ne vient du `.env` du portable. Le `.env` peut avoir un `LOG_LEVEL=debug` local, différent, et il reste gitignoré.

</details>

## Exercice 2 : Le YAML était en clair

Un commit de mars contient un Secret avec `stringData.DATABASE_URL` et le vrai mot de passe. Un commit d'avril supprime le fichier. La base accepte encore ce mot de passe. Quelqu'un dit « c'est bon, le fichier n'est plus sur main ».

Pourquoi ce n'est pas bon, et dans quel ordre agissez-vous ?

<details>
<summary>Voir la solution</summary>

L'historique de mars a le mot de passe en clair. Clones, forks et caches l'ont peut-être encore. Retirer le fichier d'avril ne révoque pas la valeur.

Ordre : créer un nouveau mot de passe à côté de l'ancien, mettre à jour le Secret du cluster, redémarrer les pods, vérifier, **puis** révoquer l'ancien. Ensuite seulement on nettoie le dépôt et on ajoute un détecteur de secrets en CI. Réécrire l'historique sans rotation laisserait un mot de passe encore valide dans chaque copie déjà partie.

</details>

## Exercice 3 : Le .env dans l'image

Le Dockerfile fait `COPY .env .` pour « que ça marche comme en local ». En staging, l'API cherche PostgreSQL sur `localhost` et journalise en debug. Le mot de passe du poste est dans l'image poussée au registre.

Pourquoi le comportement est absurde en cluster, et par quoi remplacez-vous ce `COPY` ?

<details>
<summary>Voir la solution</summary>

`localhost` dans le pod est le pod, pas la base de staging. Le niveau debug et le mot de passe du poste n'ont rien à faire dans une image partagée. Toute personne autorisée à tirer l'image lit le `.env`.

On retire le `COPY`, on ajoute `.env` au `.dockerignore`, on **fait tourner** le mot de passe qui a fuité. La configuration de staging arrive par ConfigMap (logs, URL) et par Secret (URL de base dont l'hôte est le Service). L'image reste la même d'un environnement à l'autre. Seuls les objets de config changent.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Config et secrets"
center: "Le ConfigMap se versionne. Le Secret ne se committe pas. Le .env reste sur le poste."
points:
  - icon: file
    title: "ConfigMap"
    text: "Logs, URL publique, timeouts. Le pod ne voit une variable nouvelle qu'après recréation."
  - icon: lock
    title: "Secret"
    text: "Base64 n'est pas un chiffrement. RBAC et coffre comptent plus que le type de l'objet."
  - icon: git
    title: "Pas dans Git"
    text: "stringData en clair dans un commit est une fuite. On fait tourner, puis on retire le fichier."
  - icon: loop
    title: "Rotation"
    text: "Nouvelle valeur à côté, bascule des pods, vérification, puis révocation de l'ancienne."
  - icon: terminal
    title: ".env local"
    text: "localhost et debug du poste. Gitignoré, jamais copié dans l'image ni dans le cluster."
pitfall: "Croire qu'un Secret Kubernetes est chiffré parce que kubectl get l'affiche en base64."
remember: "On versionne la référence au secret, pas la valeur. Un secret lu se remplace, il ne s'efface pas."
```
