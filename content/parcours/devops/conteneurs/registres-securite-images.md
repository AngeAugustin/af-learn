---
title: "Registres et images de confiance"
description: "Pousser une image vers un registre, la tirer par digest, scanner les vulnérabilités connues et refuser latest en production."
duration: 62
objectives:
  - Expliquer le rôle d'un registre et ce qu'un tag ne garantit pas
  - Déployer une image épinglée par le digest renvoyé au push
  - Trier le résultat d'un scan plutôt que de l'ignorer ou de tout bloquer
  - Choisir une image de base petite et compréhensible, jamais latest en production
---

# Le registre, adresse de l'image

Un **registre** stocke des images et les sert aux machines qui les exécutent. Docker Hub, le registre GitHub (`ghcr.io`), ceux des clouds (ECR, Artifact Registry, ACR) ou un registre interne font le même métier : authentifier un push, garder des couches, authentifier un pull.

L'adresse complète se lit `registre/organisation/nom:tag`. Pour Atelier : `ghcr.io/atelier/api:1.4.2`. La CI se connecte, construit, pousse. Le cluster se connecte et tire. On ne copie plus l'image sur une clé USB, et on ne reconstruit pas sur le serveur de production : le binaire qui a passé les tests est celui qu'on déploie.

Le registre n'est pas un stockage anonyme. Un dépôt **privé** refuse le pull sans identifiant. Ce secret de pull vit côté cluster (un secret de registry), pas dans l'image. Un dépôt public est lisible par tout le monde : pratique pour une base officielle, interdit pour l'image qui contient votre code.

Le tag `1.4.2` reste un **nom**. Si la politique du registre l'autorise, un second push déplace le nom vers d'autres octets. Deux nœuds peuvent alors tirer « la même version » à deux moments et obtenir deux images. Le nom ne suffit pas à la production.

# Tirer une image par son digest

Le **digest** est l'empreinte du manifeste que le registre a accepté. Il ressemble à `sha256:` suivi de 64 caractères hexadécimaux. Il change dès que le contenu change. On ne le devine pas, on le **lit dans la réponse du push**.

```text
docker push ghcr.io/atelier/api:1.4.2
# 1.4.2: digest: sha256:9f2c1b0e4a7d8c6f5e4d3c2b1a09876543210fedcba9876543210fedcba98765 size: 1234
```

C'est cette ligne qu'on recopie dans le manifeste, pas l'identifiant court affiché par `docker images` sur le poste. Cet identifiant local n'est pas le digest du registre, surtout quand l'image existe pour plusieurs architectures : le registre publie alors un manifeste d'index, et c'est **son** empreinte que tous les nœuds doivent citer.

```yaml
image: ghcr.io/atelier/api@sha256:9f2c1b0e4a7d8c6f5e4d3c2b1a09876543210fedcba9876543210fedcba98765
```

Le tag peut rester à côté, dans le journal de la CI et dans le message de version, pour que les humains lisent `1.4.2`. La référence que le cluster tire est le digest. Un retour arrière cite le digest précédent, celui de la release d'avant, pas un tag qu'on espère encore pointer au bon endroit.

```diagram
type: pipeline
title: "Le digest comme contrat"
lanes:
  - title: "CI"
    steps:
      - title: "Construire"
        text: "Une fois, depuis le commit."
        tone: blue
      - title: "Pousser"
        text: "Le registre renvoie sha256."
        tone: violet
  - title: "Déploiement"
    steps:
      - title: "Épingler"
        text: "Le manifeste cite ce digest."
        tone: teal
      - title: "Tirer"
        text: "Chaque nœud obtient les mêmes octets."
        tone: amber
```

# Scanner les vulnérabilités connues

Un **scan** compare les paquets de l'image (système et bibliothèques) à des bases de failles publiées. La CI peut le lancer avant le push, le registre peut le lancer après. L'outil importe peu au début. Le résultat est une liste de CVE, avec une gravité et, parfois, une version corrigée.

Ce n'est pas un audit. Le scan ne voit pas un mot de passe copié dans une couche, une API sans authentification, ni une faille pas encore publiée. Un rapport vert veut dire « rien de connu dans les bases consultées », pas « l'image est sûre ».

Le triage tient en quatre questions.

1. Le paquet est-il dans l'**image finale**, ou seulement dans un stage de build qu'on n'envoie pas ?
2. Une version corrigée existe-t-elle, dans la base ou dans la dépendance ?
3. Le code path est-il réellement là (binaire lancé, port ouvert, bibliothèque chargée) ?
4. Si on livre quand même, qui a noté l'exception, et **quelle date** la rend caduque ?

Une CVE critique dans la base, avec un correctif disponible, bloque la release : on reconstruit sur une base à jour. Une CVE haute, sans correctif, dans un paquet que le stage final n'embarque pas, ne bloque pas. Une exception sans date devient la norme, et le scan ne sert plus à rien.

> [!WARNING]
> Ignorer tout le rapport parce que « ce n'est pas notre code » laisse une base non patchée dans chaque conteneur. Reconstruire est souvent le correctif.

# Choisir une image de base minimale

La base est la plus grande partie de la surface. `python:3.12` (image complète) embarque des outils de compilation et des paquets que l'API n'exécute pas. Chaque paquet est une CVE possible et des mégaoctets à tirer.

`python:3.12-slim` est le compromis habituel : moins de paquets, la même libc, un shell encore là pour comprendre un incident. **Alpine** est plus petite, mais la libc n'est pas la même : des roues Python manquent, la compilation s'invite, et des bugs subtils apparaissent. On ne choisit pas Alpine seulement parce que le chiffre des mégaoctets est joli.

Quand le build a besoin d'outils, ils restent dans un **stage** qui ne part pas en production.

```dockerfile
FROM python:3.12-slim AS build
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

FROM python:3.12-slim
RUN useradd --create-home --uid 10001 --shell /usr/sbin/nologin app
WORKDIR /app
COPY --from=build /install /usr/local
COPY src ./src
USER app
CMD ["python", "-m", "src.main"]
```

L'image finale n'a pas le cache pip du stage `build`. Elle a Python, les dépendances installées et le code. Une image encore plus nue (sans shell) réduit la surface et complique le diagnostic : on l'adopte quand l'équipe sait déboguer sans entrer dans le conteneur, pas le premier jour.

On épingle la base par une version (`3.12-slim`), et on la **met à jour exprès**, dans une pull request, avec un scan. On ne la laisse pas flotter.

# latest n'a pas sa place en production

`latest` est le tag par défaut quand on n'en écrit pas. Il bouge. Combiné à `imagePullPolicy: Always`, chaque nouveau pod peut être un build différent, sous le même nom. Combiné à un cache de nœud, deux pods « latest » peuvent être deux versions. Le retour arrière n'a rien à citer : « latest d'hier » n'est pas un identifiant.

```diagram
type: compare
title: "Ce que la production a le droit de citer"
columns:
  - title: "latest"
    tone: rose
    items:
      - "Pointeur mobile, parfois implicite"
      - "Deux nœuds, deux contenus possibles"
      - "Retour arrière illisible"
  - title: "Tag 1.4.2"
    tone: amber
    items:
      - "Lisible pour les humains"
      - "Immuable seulement si le registre l'impose"
      - "Peut encore être réécrit par erreur"
  - title: "Digest sha256"
    tone: teal
    items:
      - "Empreinte renvoyée par le push"
      - "Même octets sur tous les nœuds"
      - "Le retour arrière cite l'empreinte d'avant"
```

En local, un tag de version suffit pour aller vite. En production, le manifeste porte le digest, le journal de déploiement porte le tag et le commit, et `latest` n'apparaît ni dans le chart, ni dans la console « pour débloquer ». Une signature d'image (la CI atteste le digest) complète le scan : le scan parle des failles connues, la signature parle de **qui** a construit ces octets. L'un ne remplace pas l'autre.

# Exercices

## Exercice 1 : Le manifeste dit latest

La release de vendredi contient `image: ghcr.io/atelier/api:latest` et `imagePullPolicy: Always`. Samedi, un pod redémarre et sert un comportement que la revue de vendredi n'a pas vu. Personne n'a « déployé ».

Que s'est-il passé, et par quoi remplacez-vous la ligne ?

<details>
<summary>Voir la solution</summary>

Quelqu'un a poussé sur `latest` entre-temps, ou un nœud a tiré une version plus récente au redémarrage. Le nom n'a pas changé, le contenu oui. Il n'existe pas de version « vendredi » à remettre.

On remplace la ligne par le digest renvoyé par le push de la version revue, de la forme `ghcr.io/atelier/api@sha256:` plus 64 hexadécimaux. Le tag `1.4.2` reste dans les notes de version. Le retour arrière, plus tard, consiste à citer le digest précédent, pas à reparler de `latest`.

</details>

## Exercice 2 : Un scan rouge

Le scan de l'image finale signale une CVE critique dans OpenSSL, correctif déjà publié dans l'image de base, et une CVE haute dans un compilateur présent seulement dans le stage `build`. Une personne propose d'ignorer les deux « parce que l'API ne fait pas de crypto à la main ».

Que bloquez-vous, et que laissez-vous passer ?

<details>
<summary>Voir la solution</summary>

On **reconstruit** sur une base où OpenSSL est corrigé, puis on rescane. La bibliothèque est dans l'image finale : « on n'appelle pas OpenSSL nous-mêmes » ne retire pas le paquet. La release attend cette reconstruction.

La CVE du compilateur, absente du stage final, ne bloque pas : le paquet n'est pas déployé. On le vérifie en scannant l'image poussée, pas seulement le stage de build. On ne crée pas d'exception permanente pour OpenSSL. S'il fallait vraiment livrer sans correctif, l'exception aurait un propriétaire et une date, ce qui n'est pas le cas ici puisqu'un correctif existe.

</details>

## Exercice 3 : Le mauvais identifiant

La CI affiche un `IMAGE ID` de douze caractères via `docker images`, et quelqu'un le colle dans Kubernetes comme si c'était le digest. Le pull échoue, ou pire, personne n'est sûr de ce qui tournera sur les nœuds arm64.

Quel identifiant fallait-il prendre, et à quel moment ?

<details>
<summary>Voir la solution</summary>

Il fallait le digest imprimé par `docker push` (ou par l'API du registre), la ligne `digest: sha256:` suivie de 64 hexadécimaux. L'`IMAGE ID` local est une autre empreinte, souvent raccourcie, et elle ne désigne pas le manifeste d'index quand l'image vise plusieurs architectures.

On épingle donc le digest **du registre**, le même pour tous les nœuds. Le tag humain `1.4.2` accompagne le journal de CI, il ne remplace pas cette empreinte dans le manifeste de production.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Images de confiance"
center: "Le registre distribue l'image. La production tire un digest, après un scan trié, jamais latest."
points:
  - icon: cloud
    title: "Registre"
    text: "La CI pousse, le cluster tire. On ne reconstruit pas l'image sur le serveur."
  - icon: key
    title: "Digest"
    text: "sha256 renvoyé par le push. L'IMAGE ID local n'est pas cette empreinte."
  - icon: search
    title: "Scan"
    text: "CVE connues seulement. On corrige la base, on note l'exception avec une date."
  - icon: layers
    title: "Base mince"
    text: "slim plutôt que l'image complète. Les outils de build restent dans un stage."
  - icon: alert
    title: "Pas latest"
    text: "Même nom, contenu changeant. Le retour arrière doit citer un digest précis."
pitfall: "Prendre le scan vert pour une preuve que l'image est sûre, secrets et failles inconnues compris."
remember: "On déploie le digest du push. Le tag sert aux humains, latest ne sert pas en production."
```
