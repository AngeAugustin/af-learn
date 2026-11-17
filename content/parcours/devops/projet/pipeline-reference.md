---
title: "Le pipeline de référence"
description: "Enchaîner commit, tests, image taguée par le SHA, staging, approbation, production et rollback, puis figer les décisions qui rendent ce chemin reproductible."
duration: 45
objectives:
  - "Ordonner les étapes du commit jusqu'au retour arrière"
  - "Imposer une image identifiée par le SHA et promue par son empreinte"
  - "Séparer ce qui bloque la chaîne de ce qui se décide à l'approbation"
  - "Dire quand le retour arrière est possible et quand une migration l'interdit"
---

# L'enchaînement de bout en bout

Le pipeline de référence est un **seul chemin**. Tout ce qui arrive en production l'a emprunté. Il n'existe pas un deuxième bouton « déploiement manuel » pour les pressés : ce bouton devient le vrai processus, et le schéma reste un poster.

Pour l'API, l'ordre est celui-ci.

1. **Commit** sur une branche, proposition de fusion, revue.
2. **Tests** automatiques. L'échec arrête tout.
3. **Image** construite et **taguée par le SHA** du commit, poussée au registre.
4. **Déploiement en staging** de cette image, pas d'une reconstruction.
5. **Vérification** minimale sur staging (parcours critique).
6. **Approbation** par une personne nommée, qui n'est pas seule juge et partie si le changement est le sien.
7. **Production**, en déployant **la même empreinte**.
8. **Surveillance** des minutes qui suivent (SLI).
9. **Rollback** : on redéploie l'empreinte précédente si le SLI se dégrade, sans reconstruire.

```diagram
type: pipeline
title: "Du commit au retour arrière"
lanes:
  - title: "Intégration"
    steps:
      - title: "Commit"
        text: "Branche, revue, pas de poussée directe"
        tone: blue
      - title: "Tests"
        text: "Rouge : la chaîne s'arrête"
        tone: violet
      - title: "Image"
        text: "Construite une fois, taguée par le SHA"
        tone: teal
  - title: "Staging"
    steps:
      - title: "Même empreinte"
        text: "Pas de rebuild « pour la prod »"
        tone: blue
      - title: "Déploiement"
        text: "Config de staging, artefact inchangé"
        tone: amber
      - title: "Fumée"
        text: "Le parcours commande répond"
        tone: teal
  - title: "Production"
    steps:
      - title: "Approbation"
        text: "Personne de la liste, trace écrite"
        tone: violet
      - title: "Mise en service"
        text: "L'empreinte déjà vue en staging"
        tone: teal
      - title: "Rollback"
        text: "Empreinte précédente, si le contrat le permet"
        tone: rose
```

# Commit, tests, image

Le **commit** qui compte est celui qui est fusionné. La branche de travail peut être rouge. La branche principale, non. La revue regarde le comportement (contrat de l'API, migration, drapeau), pas seulement le style. Un changement de pipeline se relit comme un changement de produit : il décide de ce qui pourra partir demain.

Les **tests** qui bloquent sont ceux qui protègent le parcours. Au minimum : le service démarre, les tests unitaires du calcul de commande, un test de contrat sur `POST /commandes` (statut et champs). Un test lent et instable ne bloque pas : il habitue à relancer « jusqu'au vert ». On le sort de la barrière, on le répare, on le remet. La barrière reste courte et fiable.

L'**image** se construit **une fois** dans ce pipeline, à partir de ce commit, avec les dépendances verrouillées. Le résultat est une empreinte (digest) immuable. On ne « recompile en prod » pour bénéficier d'un cache différent. Si la construction échoue, il n'y a pas d'image, donc pas de déploiement. C'est un arrêt propre, pas une demi-version.

# Le SHA est le nom de la version

Le **SHA** du commit (complet, pas trois caractères ambigus) est le nom que les humains retrouvent. L'**empreinte** de l'image est le nom que le runtime tire. Les deux sont notés au moment du push : tel SHA, telle empreinte, tel résultat de scan.

`latest` peut exister comme étiquette pratique pour un poste de développement. Ce n'est **pas** une version de production. `latest` bouge. Un retour arrière vers `latest` ne veut rien dire cinq minutes plus tard, parce que `latest` a peut-être déjà changé. La production pointe vers une empreinte, et l'approbation cite le SHA.

Conséquences :

- deux déploiements du même SHA sont le même artefact ;
- on peut répondre « qu'est-ce qui tourne ? » par un SHA, puis vérifier que l'empreinte du pod est celle du registre ;
- un correctif est un **nouveau** SHA, pas un remplacement silencieux du tag ;
- l'image précédente reste au registre le temps qu'un retour arrière soit encore plausible.

> [!IMPORTANT]
> Staging et production tirent la même empreinte. Ce qui change entre les deux, c'est la configuration (URL du stock, secret, nombre de replicas), pas le binaire.

# Staging, fumée, approbation

**Staging** reçoit l'image automatiquement quand l'intégration est verte, ou sur un clic de la même chaîne. Il sert à voir le parcours tourner hors des clients. La vérification de fumée est courte : créer une commande de test, la relire, vérifier que le statut n'est pas une erreur serveur. Elle ne remplace pas les tests déjà passés. Elle attrape une configuration de staging cassée (mauvais secret, mauvaise URL).

Si la fumée échoue, **pas d'approbation possible**. On ne « sait déjà que la prod est différente » pour forcer le passage. Ou staging est un signal, ou il est décoratif. On le rend signal.

L'**approbation** est un acte de la personne nommée. Elle voit : le SHA, l'empreinte, le résumé de scan, le résultat de la fumée, le lien de la revue. Elle ne relance pas une construction parallèle. Elle ne corrige pas la prod à la main. Si le changement est risqué et que le budget d'erreur est bas, elle **attend**, conformément à la règle écrite. L'approbation n'est pas une formalité cliquée pendant une réunion : c'est le moment où la règle de fiabilité s'applique.

L'auteur peut préparer. Une autre personne approuve. Sur une équipe de huit, la liste tient en deux ou trois noms, avec un remplaçant en congé.

# Production et retour arrière

La production déploie l'empreinte approuvée. Puis on **regarde** le SLI pendant une fenêtre courte (les premières minutes, puis le quart d'heure). Un déploiement que personne ne surveille n'a pas de retour arrière rapide : on le découvre par les clients.

Le **rollback** redéploie l'**empreinte précédente**, déjà connue, déjà scannée, déjà partie en production un jour. Cible pratique pour cette équipe : **moins de dix minutes** entre la décision et le pod revenu, hors migration spéciale. Le pipeline a cette action prête. On ne reconstruit pas l'ancien SHA en espérant que le réseau de dépendances donnera le même binaire.

Le retour arrière est **impossible** dans un cas précis : la nouvelle version a **détruit** des données que l'ancienne ne sait plus lire (colonne supprimée, table réécrite sur place). On évite ce cas par des migrations en deux temps. D'abord **étendre** : ajouter le nouveau, garder l'ancien, déployer un code qui sait les deux. Plus tard, quand plus aucun pod ancien ne tourne, **retirer** l'ancien dans un changement séparé. Le déploiement risqué et la destruction ne voyagent pas ensemble.

Si la destruction est déjà passée, le geste n'est plus un rollback d'image. C'est une restauration, plus lente, à part, décidée comme un incident. On ne fait pas semblant que « redeploy previous » va recréer la colonne.

```diagram
type: decision
title: "Retour arrière ou autre geste ?"
nodes:
  - question: "Le SLI de la commande s'est-il dégradé depuis ce déploiement ?"
    yes: "On envisage le retour à l'empreinte précédente."
    no: "On ne revient pas en arrière « pour voir ». On surveille."
  - question: "L'ancienne image sait-elle encore lire les données actuelles ?"
    yes: "Rollback par le pipeline, puis on confirme le SLI."
    no: "Pas de rollback d'image. Incident, restauration, code qui comprend l'état réel."
```

# Les décisions qu'on fige

Une chaîne que chacun réinterprète n'est pas une référence. Ces décisions s'écrivent à côté du pipeline.

| Décision | Choix de référence |
|---|---|
| Qui construit l'image ? | Le pipeline, une fois, sur le commit fusionné |
| Comment on la nomme ? | SHA complet côté humains, empreinte côté runtime |
| Que partage staging avec la prod ? | L'artefact, pas les secrets ni les données clients |
| Qui approuve ? | Une personne de la liste, pas l'auteur seul |
| Qu'est-ce qui bloque ? | Tests rouges, scan critique non excepté, fumée rouge |
| Qu'est-ce qu'un rollback ? | Redéploiement de l'empreinte précédente, visé en moins de dix minutes |
| Quand le rollback est-il interdit ? | Migration destructive déjà appliquée |
| Que devient `latest` ? | Pratique locale éventuelle, jamais pointeur de production |

Changer une de ces lignes est un changement de pipeline, revu comme tel. La contourner pour un vendredi (« juste cette fois, je rebuild en prod ») retire la référence. Le prochain incident n'aura plus d'empreinte à laquelle revenir.

# Exercices

## Exercice 1 : Remettre dans l'ordre

Un brouillon de chaîne propose : déployer en production, puis lancer les tests, construire l'image sur le poste de Sam, la taguer `latest`, déployer cette image en staging pour « vérifier après », et garder le retour arrière pour « quand on aura le temps de scripter ».

Réordonnez et corrigez. Quelle étape manque pour que le retour arrière veuille dire quelque chose ?

<details>
<summary>Voir la solution</summary>

Ordre corrigé : revue et commit, **tests qui bloquent**, **image construite par le pipeline** et taguée par le **SHA**, push de l'empreinte, **staging de cette empreinte**, fumée, **approbation**, production de la **même** empreinte, surveillance, rollback déjà scripté.

Le retour arrière ne veut rien dire tant que l'on n'a pas **conservé l'empreinte précédente** et une action de pipeline qui la redéploie. `latest` ne désigne pas une version stable. Construire sur le poste de Sam produit un artefact que la chaîne n'a pas vu. Tester après la production arrive trop tard : les clients ont déjà pris la version rouge.

</details>

## Exercice 2 : Le rebuild de la prod

Staging est vert sur le SHA `a1b2c3d4`, empreinte `sha256:9f0e…`. Au moment d'approuver, quelqu'un reconstruit l'image « pour être propre » à partir de la même branche, obtient une autre empreinte, et veut déployer celle-là en production. Les tests ne sont pas relancés. Le tag `latest` a bougé.

Pourquoi refusez-vous, et que déploie l'approbation à la place ?

<details>
<summary>Voir la solution</summary>

On refuse le rebuild. Une nouvelle construction peut tirer une base ou un cache différent : ce n'est plus l'artefact dont la fumée de staging a prouvé le parcours. `latest` ne nomme rien de stable. Les tests non relancés laissent cette empreinte inconnue.

L'approbation déploie **`sha256:9f0e…`**, celle de `a1b2c3d4` déjà en staging. Si l'on veut un nouvel artefact, c'est un nouveau passage : commit ou pipeline relancé, tests, staging, fumée, puis seulement la prod. « Pour être propre » n'est pas une raison de changer l'empreinte au dernier moment.

</details>

## Exercice 3 : La colonne déjà partie

Le déploiement de 10 h a supprimé la colonne `adresse_livraison` après avoir copié les données dans `adresse_id`. À 10 h 20, les 5xx montent. L'image précédente lit encore `adresse_livraison` et ne connaît pas `adresse_id`. Le bouton de rollback est prêt et prendrait huit minutes.

Le déclenchez-vous ? Quel schéma de migration aurait laissé ce bouton utilisable ?

<details>
<summary>Voir la solution</summary>

On **ne déclenche pas** le rollback d'image comme si de rien n'était. L'ancienne version ne sait pas lire l'état actuel : elle chercherait une colonne absente et échouerait autrement. Huit minutes ne réparent pas le schéma. On traite un **incident** : rétablir le service avec un correctif qui comprend `adresse_id`, ou restaurer le schéma si c'est encore possible, sous commandement. Le bouton ne se clique pas « pour voir ».

Le schéma qui aurait laissé le bouton utile : **étendre d'abord**. Ajouter `adresse_id`, garder `adresse_livraison`, déployer un code qui lit les deux, surveiller, et seulement ensuite, dans un **autre** changement, supprimer l'ancienne colonne quand plus aucune image ancienne ne tourne. La destruction n'est pas dans le même déploiement que la première bascule.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Le pipeline de référence"
center: "Une image, un SHA, la même empreinte en staging puis en prod, un rollback déjà prêt."
points:
  - icon: test
    title: "Les tests bloquent"
    text: "Rouge : pas d'image promue. Un test instable sort de la barrière le temps d'être réparé."
  - icon: git
    title: "Le SHA nomme"
    text: "Les humains parlent du commit. Le runtime tire l'empreinte. latest ne désigne pas la prod."
  - icon: rocket
    title: "Staging puis accord"
    text: "Fumée verte, approbation d'une autre personne, ensuite seulement les clients."
  - icon: loop
    title: "Rollback en minutes"
    text: "On redéploie l'empreinte précédente. On ne reconstruit pas l'ancien commit à la main."
  - icon: alert
    title: "Migration en deux temps"
    text: "Étendre, déployer, puis retirer. La colonne déjà détruite interdit le retour d'image."
pitfall: "Reconstruire une image « propre » entre le staging vert et la prod, ou revenir en arrière après une suppression de colonne."
remember: "La production reçoit une empreinte déjà vue. Le retour arrière est une action de la chaîne, pas un exploit."
```
