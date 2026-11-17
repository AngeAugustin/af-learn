---
title: "Conduire un incident"
description: "Détecter, qualifier, communiquer et rétablir un incident, puis tenir un postmortem sans blâme avec un incident commander et des actions datées."
duration: 45
objectives:
  - "Enchaîner détection, qualification, communication et rétablissement"
  - "Tenir le rôle d'incident commander sans absorber toute l'enquête"
  - "Écrire un point de situation que le métier peut relire"
  - "Sortir d'un postmortem sans blâme avec des actions de suite datées"
---

# Détecter sans attendre le récit

Un incident commence à l'heure où le service **dévie**, pas à l'heure où l'équipe se met d'accord sur le nom de la cause. Trois portes d'entrée suffisent : une alerte de symptôme, un message client, un contrôle synthétique qui échoue (une commande de test, chaque minute, depuis l'extérieur).

Dès l'entrée, on note trois faits, avant toute hypothèse.

- **Heure** du premier signal (l'alerte à 11 h 02, pas « en fin de matinée »).
- **Parcours** touché (`POST /commandes`, pas « la prod »).
- **Amplitude** connue à cet instant (8 % de 5xx, p95 à 2 s), même si elle est encore grossière.

Le récit viendra. La détection, elle, ouvre un canal unique, par exemple `#incident-commandes`, et désigne une personne qui conduit. Tant que tout le monde enquête dans son coin, personne ne communique, et deux personnes redémarrent le même service.

```diagram
type: flow
title: "Les cinq temps d'un incident"
steps:
  - title: "Détecter"
    text: "Alerte, client ou sonde. Noter l'heure."
    tone: rose
  - title: "Qualifier"
    text: "Qui est touché, gravité, contournement."
    tone: amber
  - title: "Communiquer"
    text: "Ce qu'on sait, ce qu'on ignore, prochaine heure."
    tone: blue
  - title: "Rétablir"
    text: "Retour arrière ou réduction, avant la cause fine."
    tone: teal
  - title: "Apprendre"
    text: "Postmortem sans blâme, actions datées."
    tone: violet
```

# Qualifier l'impact

Qualifier, c'est dire **qui souffre**, pas pourquoi. Les questions tiennent sur une fiche.

| Question | Exemple utile | Exemple trop tôt |
|---|---|---|
| Quel parcours ? | Création de commande | « Kubernetes est bizarre » |
| Quelle part ? | Environ 8 % des POST, tous les magasins | « Quelques utilisateurs » |
| Depuis quand ? | 11 h 02, alerte | « Ce matin » |
| Contournement ? | Le catalogue et le panier répondent | « On verra » |
| Gravité ? | Encaissement dégradé, pas d'arrêt total | « P1 » sans définition |

La gravité se définit **avant** l'incident, sinon elle se négocie dans le stress. Pour une enseigne, un exemple tient en trois niveaux. **Bloquant** : plus de la moitié des commandes échouent, ou aucune ne passe. **Majeur** : une part nette échoue ou la latence dépasse le SLO de façon soutenue. **Mineur** : contournement immédiat, peu de clients, pas de page hors heures ouvrées.

On peut changer de niveau. On le dit. On ne passe pas vingt minutes à chercher le bon adjectif pendant que le retour arrière est possible.

# Communiquer pendant que ça brûle

Le silence se remplit par les hypothèses des autres. Un point de situation, toutes les **quinze minutes** tant que c'est bloquant, tient en cinq lignes. Il part au canal interne et, si des clients ou des magasins voient la panne, au message externe préparé.

1. Impact : ce que les gens ne peuvent plus faire.
2. Début : l'heure du premier signal.
3. État : en cours de rétablissement, surveillé, ou rétabli.
4. Prochaine mise à jour : une heure, même si l'on n'a rien de neuf.
5. Ce que l'on ne sait pas encore : la cause fine, assumée comme inconnue.

Message interne possible à 11 h 10 :

> Création de commande dégradée depuis 11 h 02 (environ 8 % d'échecs). Catalogue et consultation d'une commande déjà passée : OK. Piste : déploiement 10 h 48, retour arrière en cours. Cause précise non établie. Prochain point à 11 h 25.

Le message externe reprend l'impact et l'heure du prochain point, sans le nom du déploiement ni le prénom de la personne qui a fusionné. Les magasins ont besoin de savoir s'ils peuvent encaisser, pas de suivre l'enquête.

> [!IMPORTANT]
> Une heure de prochain point tenue vaut mieux qu'une explication brillante en retard. Si rien n'a bougé, on écrit « pas de changement » à l'heure dite.

# Corriger : rétablir, puis réparer

**Rétablir**, c'est rendre le parcours aux clients. **Réparer**, c'est retirer la cause pour que demain ressemble à aujourd'hui. Les deux ne se font pas dans le même geste, et le rétablissement passe en premier.

Moyens de rétablissement, du plus sûr au plus aventureux :

- retour arrière vers l'image précédente, si le déploiement de 10 h 48 est le candidat ;
- désactivation d'un paramètre ou d'un drapeau qui isole la nouveauté ;
- réduction d'une dépendance (refuser proprement le stock lent plutôt que d'empiler les délais) ;
- ajout de capacité, seulement si la métrique montre une saturation réelle.

Chercher la ligne exacte dans le code pendant que 8 % des commandes échouent retarde le rétablissement. On garde un `request_id`, on confirme que la trace pointe le service touché, on mitige, on surveille le SLI revenir. La réparation fine (correctif, test, alerte manquante) se fait quand les clients passent à nouveau, ou dans le postmortem si elle exige du calme.

On écrit l'heure du rétablissement à part de l'heure de la réparation. « C'est rentré à 11 h 31 » et « le correctif est en production le lendemain » sont deux faits. Les mélanger fait croire que l'incident a duré jusqu'au correctif, ou qu'il était fini alors que la cause est encore en place.

# L'incident commander et les rôles

L'**incident commander** conduit. Il ne fait pas tout. Son travail : tenir le cadre, trancher, cadence les points, empêcher que deux actions contraires partent en même temps (un retour arrière et un correctif à chaud sur la même version).

Sur une équipe de huit, quatre rôles existent. Une même personne peut en porter deux **si** l'incident est mineur. Sur un incident majeur, le commander ne devrait pas être la seule personne dans les logs.

| Rôle | Fait | Ne fait pas |
|---|---|---|
| Incident commander | Décide, cadence, arbitre les actions | Disparaître seul dans un débogage de vingt minutes |
| Communication | Écrit les points, interne puis externe | Inventer une cause pour « rassurer » |
| Investigation | Lit métriques, logs, traces, propose une mitigation | Déployer sans accord du commander |
| Scribe | Tient la chronologie (heure, fait, décision) | Réécrire l'histoire après coup de mémoire |

```diagram
type: sequence
title: "Qui parle à qui"
actors: ["Alerte", "Commander", "Canal", "Enquête"]
messages:
  - from: 0
    to: 1
    text: "8 % d'échecs depuis 11 h 02"
  - from: 1
    to: 2
    text: "Impact, inconnu assumé, prochain point"
  - from: 1
    to: 3
    text: "Chercher une mitigation, pas la ligne parfaite"
  - from: 3
    to: 1
    text: "Déploiement 10 h 48, retour arrière possible"
  - from: 1
    to: 2
    text: "Décision : retour arrière, on surveille le SLI"
```

Le commander peut être l'astreinte du jour. Le nom est dit au début, sur le canal : « Je prends le commandement, Sam tient les points, Inès enquête. » Changer de commander se dit aussi. Un commandement implicite, c'est personne.

# Le postmortem sans blâme

Le **postmortem** se tient une fois le service rétabli, à froid, tant que la chronologie est fraîche (le lendemain, pas le mois suivant). Il est **sans blâme** : on cherche ce que le système a permis, pas qui « a mal cliqué ». Une personne a fusionné un changement risqué parce que la chaîne le permettait sans approbation, sans test de charge, sans alerte rapide. Le fait utile est l'absence de garde, pas le prénom.

Le document tient sur quelques pages.

- Résumé : impact, durée (11 h 02 à 11 h 31 de dégradation), gravité.
- Chronologie factuelle, tenue par le scribe, pas reconstruite pour être flatteuse.
- Ce qui a bien marché : identifiant de requête, retour arrière en neuf minutes.
- Ce qui a mal marché : trois pages en parallèle, message externe parti tard.
- Facteurs : déploiement et délai stock, sans transformer une piste en roman.
- **Actions de suite** : chacune a un verbe, un responsable, une date. « Améliorer la com » n'est pas une action. « Une seule alerte de symptôme sur `POST /commandes`, responsable Inès, avant le 30 novembre » en est une.

On relit les actions deux semaines après. Celles qui n'ont pas de date meurent. Un postmortem sans suivi est un compte rendu. Un postmortem avec trois actions fermées change le prochain incident.

> [!WARNING]
> « Faire plus attention » et « être moins fatigué » ne sont pas des actions. Si le système dépend de l'attention, l'incident reviendra un jour d'astreinte chargé.

```video
url: https://www.youtube.com/watch?v=Fv0nwb1Qn6A
title: "Blameless Postmortem Culture In Software Engineering"
channel: "Clément Mihailescu"
duration: "9:23"
lang: en
why: "Pourquoi le postmortem sans blâme fait progresser une équipe, raconté par un ancien ingénieur de Google."
```

# Exercices

## Exercice 1 : Qualifier avant d'expliquer

À 11 h 02, l'alerte dit : 8 % de 5xx sur `POST /commandes` depuis 4 minutes. Le `GET` d'une commande existante répond. Le catalogue répond. Un développeur écrit sur le canal : « c'est sûrement la migration SQL de Léa ». Aucune trace n'a encore été ouverte. Les magasins appellent.

Écrivez la qualification en cinq lignes. Quelle phrase du canal écartez-vous, et pourquoi ?

<details>
<summary>Voir la solution</summary>

Qualification :

- Parcours : création de commande seulement.
- Amplitude : environ 8 % d'échecs, pas un arrêt total.
- Début : 11 h 02.
- Contournement : consulter une commande déjà créée, et le catalogue, fonctionnent.
- Gravité : majeure (encaissement dégradé), commandement à nommer, point dans quinze minutes.

On écarte « c'est sûrement la migration SQL de Léa ». C'est une hypothèse, et elle nomme une personne avant tout fait. La qualification décrit l'impact. L'enquête vérifiera ensuite s'il y a eu une migration, un déploiement, ou un délai du stock, à partir d'un `request_id`.

</details>

## Exercice 2 : Le point de 11 h 10

Le commandement est pris. L'enquête voit un déploiement à 10 h 48 et propose un retour arrière. Le SLI n'est pas encore revenu. Les magasins attendent un message. La cause dans le code est inconnue.

Rédigez le point interne (cinq lignes). Dites ce que vous ne mettez pas dans le message aux magasins.

<details>
<summary>Voir la solution</summary>

Point interne :

> Création de commande dégradée depuis 11 h 02, environ 8 % d'échecs. Consultation d'une commande et catalogue : OK. Retour arrière du déploiement de 10 h 48 en cours. Cause dans le code non établie. Prochain point à 11 h 25.

Aux magasins, on ne met ni le hash du déploiement, ni le nom de la personne, ni la piste technique. On dit que la création de commande est dégradée, que la consultation reste possible, et l'heure du prochain point. Promettre « réglé dans cinq minutes » avant le retour du SLI serait un deuxième incident, de confiance.

</details>

## Exercice 3 : Une phrase à réécrire

Le brouillon du postmortem dit : « Léa a mergé trop vite sans faire attention, il faut que les devs soient plus rigoureux. » La chronologie montre : pas d'approbation obligatoire, pas de test sur le délai stock, trois alertes CPU en parallèle, retour arrière possible en neuf minutes une fois le commandement nommé. Le scribe a les heures.

Réécrivez le facteur en phrase de système, et proposez deux actions de suite avec responsable et délai.

<details>
<summary>Voir la solution</summary>

Facteur : la production a accepté un changement qui touche le parcours commande **sans approbation et sans test du délai stock**. La personne qui a fusionné a suivi la chaîne telle qu'elle était. Le blâme ne crée pas de garde.

Actions :

1. Exiger une approbation nommée avant la production pour `commandes`, responsable du pipeline, sous dix jours.
2. Ajouter un test de bout en bout qui échoue si le stock dépasse le délai, et une seule page sur les 5xx de `POST /commandes`, responsable de l'astreinte, avant la prochaine mise en production risquée.

« Être plus rigoureux » ne figure pas dans la liste. Le retour arrière en neuf minutes, lui, est noté comme un point qui a marché, une fois le commander nommé.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Conduire un incident"
center: "On qualifie l'impact, on rétablit, on parle à l'heure dite, on apprend sans blâme."
points:
  - icon: clock
    title: "L'heure du premier signal"
    text: "Alerte, client ou sonde. On note le début avant de nommer une cause."
  - icon: users
    title: "Un commander"
    text: "Il tranche et cadence. Sur un incident majeur, il ne débogue pas seul."
  - icon: chat
    title: "Un point daté"
    text: "Impact, état, inconnu assumé, prochaine heure. Le silence se remplit tout seul."
  - icon: loop
    title: "Rétablir d'abord"
    text: "Retour arrière ou drapeau. La réparation fine attend que les clients repassent."
  - icon: check
    title: "Actions datées"
    text: "Verbe, responsable, date. « Faire attention » ne ferme pas un postmortem."
pitfall: "Chercher la ligne de code, ou le prénom fautif, pendant que les commandes échouent encore."
remember: "Le commander tient le cadre. Le postmortem change le système, pas la personne."
```
