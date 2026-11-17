---
title: Quand utiliser le deep learning
description: Décider si un réseau est justifié selon le volume, le type de données, le besoin d'explication et la force de la baseline déjà en place.
duration: 40
objectives:
  - Poser les quatre questions qui précèdent l'ouverture d'un framework de réseaux
  - Relier le type de données et le volume au choix entre boosting et réseau
  - Intégrer l'explicabilité et le coût d'exploitation dans la décision
  - Conclure qu'un tableau métier se traite d'abord sans deep learning
---

# Le réseau n'est pas le réflexe

Le deep learning est une famille de modèles, pas une étape obligatoire après le gradient boosting. Sur la majorité des problèmes **tabulaires** d'entreprise (score de résiliation, défaut de paiement, probabilité d'achat, durée d'une intervention), un modèle linéaire régularisé ou un boosting d'arbres, dans un pipeline propre, est le bon outil. Le réseau se justifie quand le signal a une forme que ces modèles jettent, ou quand ils plafonnent **après** avoir été réellement essayés.

Ouvrir PyTorch parce que le sujet « fait moderne », ou parce qu'un jeu de 8 000 lignes et 20 colonnes « pourrait cacher des interactions », inverse l'ordre. Les interactions d'un tableau de cette taille, un arbre les cherche déjà. Le réseau les cherche aussi, avec plus de façons de mémoriser, plus de réglages, et une mise en production plus lourde.

La décision tient sur une page, écrite **avant** l'entraînement long. Elle nomme la baseline, le volume, le type d'entrée, ce qu'il faudra expliquer, et le gain minimum qui vaudrait le surcoût. Sans cette page, un essai de réseau n'a pas de critère d'arrêt : il dure jusqu'à ce que la courbe de train soit jolie.

# Volume, type de données, explicabilité

Trois questions filtrent la plupart des demandes. Aucune n'est un théorème. Ce sont des seuils d'ingénierie, à écrire dans le cadrage.

**Le type d'entrée.** Les pixels, le son brut, une vidéo, une très longue série non résumée : le voisinage ou l'ordre **est** le signal. Un boosting sur une moyenne, un maximum et un écart-type peut rester la baseline, mais il compresse. Un réseau conçu pour cette grille ou cette séquence est alors un candidat sérieux. À l'inverse, trente colonnes déjà fabriquées par le métier (montants, durées, codes d'offre, compteurs) sont un tableau. Le deep learning n'y a pas de structure à exploiter que les arbres ne sachent pas approcher.

**Le volume.** « Assez de données » dépend de la variante.

| Variante | Ordre de grandeur où l'essai est raisonnable | En dessous |
|---|---|---|
| Boosting sur un tableau | Quelques milliers de lignes, parfois moins si le signal est fort | On reste sur une règle ou une logistique, le boosting lui-même surapprend. |
| Réseau dense sur un tableau | Plutôt des dizaines de milliers de lignes, et plus de lignes que de paramètres | Il mémorise. La validation se dégrade dès qu'on empile les couches. |
| Transfert d'images | Quelques centaines d'images par classe, groupes indépendants | On collecte, ou on reste sur des descripteurs simples. |
| Réseau d'images depuis zéro | Des milliers d'images par classe, souvent bien plus | Le transfert ou l'abandon. L'augmentation ne crée pas de nouvelles pièces. |

Ces chiffres ne sont pas des droits à entraîner. Ce sont des zones où l'essai n'est pas absurde **si** les autres questions passent.

**L'explicabilité.** Si une personne subit une décision (crédit, accès, sanction) et qu'on doit dire **quelles variables** ont pesé, un modèle linéaire ou un arbre se défend plus simplement. On peut expliquer localement un réseau, le chapitre sur l'éthique en parle, mais l'explication est plus coûteuse, plus instable quand les colonnes sont liées, et plus difficile à faire tenir dans une phrase vraie. Un gain faible ne paie pas cette dette. Un gain large, sur un signal qui n'existe pas autrement (l'image du document, pas dix champs déjà saisis), peut la payer, à condition que le circuit d'explication et de recours existe vraiment.

```diagram
type: compare
title: "Ce que la forme des données autorise"
columns:
  - title: "Tableau métier"
    tone: teal
    items:
      - "Colonnes déjà nommées et agrégées"
      - "Boosting ou modèle linéaire en premier"
      - "Réseau seulement s'il bat cette baseline"
      - "Explication par variable souvent exigée"
  - title: "Signal brut structuré"
    tone: violet
    items:
      - "Image, son, vidéo, longue série"
      - "Le voisinage est l'information"
      - "Réseau adapté, après une baseline compressée"
      - "L'explication est un autre problème, à cadrer"
```

# Quand la baseline est déjà forte

Une baseline **forte** n'est pas le classifieur majoritaire. C'est le meilleur modèle simple que vous savez mettre en production : une règle métier stable, une régression régularisée, un boosting avec un protocole de validation propre. Si ce modèle atteint déjà le niveau dont le métier a besoin (précision au volume d'appels, rappel minimal sur la fraude, erreur moyenne acceptable), un réseau n'a plus d'objectif.

Le piège est de comparer le réseau au hasard, ou à une logistique mal préparée, pendant que le boosting de référence n'est pas dans le tableau. Le réseau « gagne » alors contre un adversaire trop faible. La comparaison légitime est : même découpage, même cible, même métrique, baseline forte incluse.

Un deuxième piège est le plafond imaginaire. « Les arbres ne capturent pas les interactions » est faux : un arbre est précisément un découpage d'interactions. Ce qu'un arbre capture mal, c'est une structure **répétée dans l'espace ou le temps** que vous avez détruite en agrégeant. Si vous n'avez pas agrégé, et que le boosting plafonne sur quarante colonnes, la cause est souvent ailleurs : cible bruitée, fuite corrigée qui a fait chuter le score, features absentes, volume trop faible. Ajouter des couches ne répare pas une cible mal définie.

> [!IMPORTANT]
> Le droit d'essayer un réseau se gagne contre la baseline forte, sur la validation, avec une marge annoncée à l'avance. Un écart dans le bruit d'une graine aléatoire n'est pas une marge.

Exemple de marge écrite avant l'essai : « on ne remplace le boosting que si la précision parmi les 500 dossiers actionnés gagne au moins 3 points en validation temporelle, et que l'écart tient sur deux fenêtres ». Sans marge, n'importe quel 0,2 point justifie six mois de framework.

# Un arbre de décision à écrire

On parcourt les questions dans l'ordre. La première réponse qui écarte le réseau suffit. On n'ouvre pas le framework « en parallèle, au cas où » sans personne pour comparer.

```diagram
type: decision
title: "Faut-il sortir du modèle tabulaire ?"
nodes:
  - question: "L'entrée est-elle un signal brut (image, son, vidéo, longue série non agrégée) plutôt qu'un tableau de colonnes métier ?"
    yes: "Le deep learning est un candidat. On garde une baseline sur des descripteurs simples."
    no: "Question suivante. Un tableau se traite d'abord par une règle, une logistique ou un boosting."
  - question: "Le volume est-il dans la zone raisonnable pour la variante visée (transfert, réseau dense, ou entraînement depuis zéro) ?"
    yes: "On peut préparer un essai comparatif, pas un remplacement d'office."
    no: "On collecte, ou on reste sur le modèle classique. L'augmentation ne remplace pas des exemples nouveaux."
  - question: "Une explication par variable, défendable devant la personne concernée, est-elle exigée ?"
    yes: "On préfère le modèle tabulaire lisible, sauf gain large et circuit d'explication déjà prévu."
    no: "Question suivante."
  - question: "La baseline forte est-elle déjà au niveau métier, sur la bonne métrique et le bon découpage ?"
    yes: "On la garde. Le réseau n'a rien à remplacer."
    no: "L'essai est justifié, avec une marge minimale écrite avant l'entraînement."
```

La sortie de cet arbre est une **phrase de décision**, pas un logo de librairie. Deux formulations acceptables :

- « On reste sur LightGBM. L'entrée est un tableau de 32 colonnes, le volume est de 18 000 lignes, le métier exige les trois variables principales dans la phrase d'explication, et le boosting dépasse déjà la précision demandée au volume d'appels. »
- « On essaie un transfert d'images. L'entrée est la photo du contrôle, les descripteurs manuels plafonnent sous le rappel exigé, on a 400 images par classe en groupes indépendants, et la marge pour remplacer la baseline est de 5 points de rappel à précision fixée. »

« On verra bien » n'est pas une décision. C'est un budget ouvert.

# Ce que le deep learning coûte en plus

Même quand l'essai est légitime, le coût ne s'arrête pas à l'entraînement.

- **Réglage.** Architecture, pas, batch, arrêt, augmentation : plus de leviers, donc plus de façons d'utiliser la validation comme un second train si l'on n'est pas strict.
- **Calcul.** Un boosting tabulaire tourne sur un portable. Un réseau d'images peut exiger un GPU et des minutes à des heures par essai. Ce n'est pas une raison de s'en priver quand le signal est visuel. C'est une raison de ne pas lancer cinquante architectures avant d'avoir figé le découpage.
- **Exploitation.** Versions du framework, poids binaires, prétraitement identique à l'entraînement, latence, dérive des images (caméra changée, éclairage, recadrage).
- **Explication et incidents.** Un score faux est plus long à relier à une cause quand l'entrée est une image entière plutôt qu'une colonne « retard de paiement ».
- **Compétence.** L'équipe qui assure la nuit et les congés doit pouvoir recharger le pipeline, pas seulement la personne qui a copié l'esquisse.

Un gain de métrique qui n'est pas mis en regard de ces coûts est incomplet. Le chapitre qui sert un modèle rappelle qu'on déploie un **artefact figé**, pas une session d'entraînement. Plus l'artefact est lourd, plus cette discipline compte.

# La plupart des tableaux s'en passent

La conclusion opérationnelle est simple : **la plupart des problèmes tabulaires n'ont pas besoin de deep learning.** Les exceptions existent. Elles se reconnaissent à un signal que l'agrégation détruit, à un volume suffisant, à une baseline forte déjà battue sur la validation, et à un surcoût accepté par écrit. Elles ne se reconnaissent pas au fait que le réseau est disponible dans le même notebook que le boosting.

Quand l'exception se présente, on reste dans le même métier de data scientist : cible, horizon, découpage sans fuite, métrique de décision, comparaison, limite. Le réseau n'abroge aucun de ces gestes. Il en ajoute.

> [!TIP]
> Si vous hésitez, entraînez le boosting proprement et écrivez pourquoi le réseau attend. Une décision négative documentée est un résultat. Un réseau entraîné sans baseline ne l'est pas.

# Exercices

## Exercice 1 : Trier trois demandes

Pour chaque demande, dites si vous lancez un réseau maintenant, plus tard sous condition, ou pas du tout. Une phrase de motif suffit.

1. Défaut de paiement, 25 000 dossiers, 40 colonnes de bilan et de comportement, régulateur qui demande les facteurs principaux. Aucun boosting n'a été fit.
2. Détection de fissure sur photo, 600 images par classe, une pièce n'apparaît que dans un seul ensemble. Les mesures manuelles (longueur, contraste) donnent un rappel de 0,55 pour un besoin à 0,80.
3. Prévision du panier à partir de 12 colonnes agrégées, 6 000 tickets, le métier se contente de l'erreur actuelle d'une moyenne par rayon.

<details>
<summary>Voir la solution</summary>

1. **Pas de réseau maintenant.** Tableau, volume correct pour un boosting, exigence d'explication. On pose une baseline puis un boosting. Un réseau ne s'envisagerait que s'il bat nettement ce boosting **et** qu'un circuit d'explication est accepté. Rien de cela n'est établi.
2. **Essai de transfert justifié**, pas un entraînement depuis zéro présenté comme acquis. Le signal est une image, le volume est dans la zone du transfert, la baseline de descripteurs est nettement sous le besoin, le découpage par pièce est le bon réflexe. La marge (rappel) est déjà chiffrée.
3. **Pas de réseau.** Le besoin métier est couvert par une baseline très simple, l'entrée est un petit tableau agrégé. Ajouter un réseau n'a pas de décision à améliorer.

</details>

## Exercice 2 : Marge et faux adversaire

Une équipe annonce : « le réseau fait 0,84 d'AUC, la régression logistique mal calibrée fait 0,71, donc on déploie le réseau ». Le boosting du projet précédent, sur le même découpage, est à 0,83. Le gain n'a pas été fixé à l'avance. L'explication demandée par le service client est « les trois motifs du score ».

Que refusez-vous dans ce raisonnement, et quelle décision écrivez-vous ?

<details>
<summary>Voir la solution</summary>

L'adversaire est trop faible : la logistique « mal calibrée » n'est pas la baseline forte. Contre le boosting à 0,83, le 0,84 n'est pas une marge, et aucune marge n'était écrite avant l'essai. Le service client demande une explication courte par motifs, plus naturelle pour le boosting.

Décision : **on ne déploie pas le réseau**. On sert le boosting, on documente l'essai négatif (gain insuffisant, explicabilité), et on ne rouvre le dossier que si un nouveau signal non tabulaire apparaît ou si un écart large se confirme sur une fenêtre fraîche, avec la phrase d'explication prévue.

</details>

## Exercice 3 : Écrire la phrase de décision

Cas : série de capteurs, 500 mesures par cycle machine, 20 000 cycles. Un boosting sur cinq statistiques (moyenne, écart-type, min, max, tendance) atteint un rappel de 0,72. Le besoin, écrit par la maintenance, est 0,85 à précision supérieure à 0,6. Personne ne demande une liste de « colonnes » : l'alerte déclenche une visite, et le technicien voit la courbe.

Rédigez la phrase de décision en quatre éléments : type de signal, volume, baseline, marge.

<details>
<summary>Voir la solution</summary>

Le signal brut est une **longue série** que cinq statistiques compriment. Le volume (20 000 cycles) rend un essai de réseau de séquence raisonnable, à condition de découper par machine ou par période, pas par point de mesure isolé. La baseline forte est le boosting sur les cinq statistiques, rappel 0,72, sous le besoin 0,85 à précision > 0,6. L'explication exigée n'est pas une liste de colonnes mais la courbe que le technicien consulte déjà.

Phrase : « On essaie un réseau sur les 500 mesures, comparé au boosting des cinq statistiques, sur un découpage temporel ou par machine. On ne le déploie que s'il atteint au moins 0,85 de rappel à précision supérieure à 0,6 en validation. Sinon on garde le boosting et on dit que le besoin n'est pas tenu. »

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: "Quand utiliser le deep learning"
center: "Le réseau se justifie par le signal, le volume et une marge sur une baseline forte. La plupart des tableaux n'en ont pas besoin."
points:
  - icon: list
    title: "Quatre questions"
    text: "Type de données, volume, besoin d'explication, baseline déjà au niveau. Une seule peut suffire à dire non."
  - icon: database
    title: "Tableau d'abord"
    text: "Colonnes métier : règle, logistique ou boosting. Le réseau n'est pas l'étape suivante automatique."
  - icon: eye
    title: "Signal brut"
    text: "Image, son ou longue série : le voisinage compte. On compare quand même à des descripteurs simples."
  - icon: scale
    title: "Marge écrite"
    text: "Le gain minimal se fixe avant l'essai. Battre une logistique faible ne compte pas."
  - icon: money
    title: "Coût d'après"
    text: "Réglage, calcul, versions, latence, explication. Un petit écart de métrique ne les paie pas."
pitfall: "Déployer un réseau parce qu'il bat un modèle naïf, sans boosting de référence ni marge annoncée."
remember: "Sans signal brut ou sans victoire claire sur une baseline forte, on reste sur le modèle tabulaire."
```
