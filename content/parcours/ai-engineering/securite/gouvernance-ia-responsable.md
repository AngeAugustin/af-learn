---
title: Gouvernance, réglementation et IA responsable
description: "Ce que l'AI Engineer doit savoir pour livrer un système conforme et digne de confiance : AI Act, RGPD, droit d'auteur et licences, biais et équité, transparence, documentation et cadres de gestion des risques."
duration: 60
objectives:
  - Classer un système d'IA selon les niveaux de risque de l'AI Act et identifier les obligations associées
  - Appliquer le RGPD à une application fondée sur un LLM (base légale, minimisation, sous-traitants, droits)
  - Vérifier les licences des modèles et les questions de droit d'auteur
  - Mesurer et réduire les biais d'un système
  - Documenter un système d'IA et s'appuyer sur les cadres NIST AI RMF et ISO/IEC 42001
---

# Pourquoi c'est l'affaire de l'ingénieur

La conformité n'est pas qu'une affaire de juristes. Beaucoup d'exigences se traduisent **directement en choix techniques** : journaliser les décisions, informer l'utilisateur qu'il parle à une IA, ne pas envoyer certaines données à un fournisseur, pouvoir supprimer une mémoire, mesurer les biais, documenter le modèle. Un AI Engineer qui les connaît **évite des refontes coûteuses** et sait poser les bonnes questions au service juridique.

> [!NOTE]
> Ce chapitre donne des repères pour travailler, **pas un avis juridique**. Les textes et leur calendrier évoluent : vérifiez toujours la version en vigueur et faites valider vos analyses par un juriste ou le délégué à la protection des données (DPO).

# L'AI Act européen

Le **règlement européen sur l'intelligence artificielle** (*AI Act*, règlement (UE) 2024/1689) est entré en vigueur le 1er août 2024. Il s'applique à toute organisation qui met un système d'IA sur le marché européen ou l'utilise dans l'UE, y compris si elle est établie ailleurs.

## Une approche par les risques

```diagram
type: layers
title: Les niveaux de risque de l'AI Act
layers:
  - title: "Risque inacceptable : interdit"
    text: Notation sociale, manipulation exploitant les vulnérabilités, reconnaissance des émotions au travail ou à l'école, constitution de bases de reconnaissance faciale par moissonnage, certaines formes d'identification biométrique à distance
  - title: "Haut risque : obligations fortes"
    text: Recrutement et gestion du personnel, accès à l'éducation, octroi de crédit, accès aux services essentiels, justice, maintien de l'ordre, migration, infrastructures critiques, composants de sécurité de produits réglementés
  - title: Risque de transparence
    text: Chatbots (informer qu'on interagit avec une IA), contenus générés ou manipulés (hypertrucages, marquage des contenus synthétiques)
  - title: Risque minimal
    text: "Filtres anti-spam, recommandations sans enjeu particulier : pas d'obligation spécifique"
```

## Les obligations des systèmes à haut risque

Pour un système à haut risque, le **fournisseur** (celui qui le développe et le met sur le marché) doit notamment mettre en place :

- un **système de gestion des risques** tout au long du cycle de vie ;
- une **gouvernance des données** (qualité, représentativité, examen des biais) ;
- une **documentation technique** et la **journalisation** automatique des événements ;
- de la **transparence** envers les déployeurs (notice d'utilisation) ;
- un **contrôle humain** effectif ;
- un niveau approprié d'**exactitude**, de **robustesse** et de **cybersécurité** ;
- une **évaluation de conformité** avant mise sur le marché.

Le **déployeur** (l'organisation qui utilise le système) a aussi des obligations : usage conforme à la notice, contrôle humain, conservation des journaux, information des personnes concernées.

## Les modèles d'IA à usage général

Les fournisseurs de **modèles à usage général** (les grands LLM) ont des obligations propres depuis le 2 août 2025 : documentation technique, informations pour les intégrateurs, politique de respect du droit d'auteur, résumé des données d'entraînement. Les modèles présentant un **risque systémique** (les plus puissants) ont des obligations renforcées (évaluations, gestion des incidents, cybersécurité). Un **code de bonnes pratiques** a été publié en 2025 pour aider à s'y conformer.

En tant qu'intégrateur d'un modèle via une API, vous n'êtes généralement pas « fournisseur du modèle », mais vous pouvez être **fournisseur du système** que vous construisez, avec les obligations correspondant à son niveau de risque.

## Le calendrier

| Date | Ce qui s'applique |
|---|---|
| 2 février 2025 | Interdictions ; obligation de **maîtrise de l'IA** (former le personnel qui utilise ou opère des systèmes d'IA) |
| 2 août 2025 | Obligations des modèles à usage général ; gouvernance ; sanctions |
| 2 août 2026 | La plupart des autres obligations, dont la transparence et les systèmes à haut risque de l'annexe III (calendrier initial) |
| 2 août 2027 | Systèmes à haut risque intégrés à des produits réglementés |

> [!WARNING]
> Fin 2025, la Commission européenne a proposé (paquet « omnibus numérique ») de **reporter** une partie des obligations relatives aux systèmes à haut risque. Vérifiez le calendrier **effectivement en vigueur** au moment de votre projet. Les sanctions peuvent atteindre 35 millions d'euros ou 7 % du chiffre d'affaires mondial pour les pratiques interdites.

## Les réflexes de l'ingénieur

- **Qualifier** chaque cas d'usage dès le cadrage : un « simple » outil de tri de CV est **à haut risque** (recrutement).
- **Informer** l'utilisateur qu'il interagit avec une IA, et **marquer** les contenus générés quand c'est requis.
- **Journaliser** les entrées, sorties et décisions de façon exploitable (module 8), avec une durée de conservation définie.
- **Prévoir le contrôle humain** dans l'interface, pas en théorie.

# Le RGPD appliqué aux LLM

Dès qu'une application traite des **données personnelles** (un nom, un courriel, une conversation…), le RGPD s'applique. Points d'attention propres aux LLM :

| Sujet | Ce que cela implique techniquement |
|---|---|
| **Base légale et finalité** | Savoir pourquoi on traite chaque donnée ; ne pas réutiliser les conversations pour entraîner un modèle sans base légale ni information |
| **Minimisation** | N'envoyer au modèle que les données nécessaires ; masquer ou pseudonymiser quand c'est possible |
| **Sous-traitants** | Le fournisseur d'API est un sous-traitant : contrat (DPA), localisation des données, durée de conservation, réutilisation pour l'entraînement (souvent désactivée par défaut pour les API professionnelles, à vérifier), options de non-conservation |
| **Transferts hors UE** | Encadrement juridique des transferts ; régions d'hébergement européennes quand elles existent |
| **Droits des personnes** | Accès, rectification, effacement, y compris dans les journaux, les traces, la mémoire et les index vectoriels |
| **Décisions automatisées** | Une décision produisant des effets juridiques ou significatifs ne peut en principe pas reposer **uniquement** sur un traitement automatisé (article 22) : prévoir une intervention humaine et la possibilité de contester |
| **Analyse d'impact (AIPD)** | Obligatoire pour les traitements à risque élevé (données sensibles, évaluation de personnes, grande échelle) |
| **Sécurité** | Chiffrement, contrôle d'accès, journaux protégés, durée de conservation limitée |

> [!TIP]
> La CNIL publie des recommandations pratiques sur le développement de systèmes d'IA (base légale, information des personnes, annotation, sécurité). C'est une bonne source pour les projets en France.

# Droit d'auteur et licences

## Les licences des modèles

« Open-weight » ne veut pas dire « libre de tout usage ». Avant d'utiliser un modèle, lisez sa **licence** :

| Type de licence | Exemples | Points d'attention |
|---|---|---|
| Licences open source permissives | Apache 2.0, MIT | Usage commercial autorisé, conserver les mentions |
| Licences communautaires spécifiques | Certaines licences de modèles de grands éditeurs | Restrictions possibles : seuil d'utilisateurs, usages interdits, obligation de mention, interdiction d'entraîner d'autres modèles |
| Conditions d'utilisation des API | Fournisseurs commerciaux | Usages interdits, propriété des sorties, interdiction d'utiliser les sorties pour entraîner un modèle concurrent |

Ces restrictions comptent particulièrement pour la **distillation** et la génération de **données synthétiques** (module 11).

## Les contenus générés

- Les contenus générés peuvent **reproduire** des œuvres protégées (code sous licence, textes, images de style reconnaissable). Pour le code, des outils détectent les correspondances avec du code public.
- La protection par le droit d'auteur des contenus **purement générés** par une IA est incertaine et varie selon les pays.
- Pour un RAG, vérifiez que vous avez le **droit d'utiliser** les documents indexés, et citez les sources.

# Biais et équité

Un LLM reproduit des **biais** présents dans ses données d'entraînement : associations stéréotypées entre métiers et genres, traitement différent selon le prénom, la langue ou le dialecte, sous-représentation de certaines populations. Dans une application de tri de CV, de crédit ou de support, ces biais deviennent des **discriminations**.

## Mesurer

La méthode la plus pratique pour un AI Engineer est le **test contrefactuel** : présenter des entrées **identiques à une caractéristique près** (prénom, genre, âge, origine supposée) et comparer les sorties.

```python
from itertools import product

PRENOMS = {"groupe_a": ["Thomas", "Nicolas", "Julien"], "groupe_b": ["Fatou", "Aïcha", "Mariam"]}
CV_MODELE = "Prénom : {prenom}\nExpérience : 5 ans de développement Python, 2 ans de lead technique.\nFormation : master en informatique."


def ecart_de_score(noter_cv, repetitions: int = 5) -> dict[str, float]:
    """Score moyen par groupe sur des CV identiques à part le prénom."""
    moyennes = {}
    for groupe, prenoms in PRENOMS.items():
        scores = [noter_cv(CV_MODELE.format(prenom=p)) for p, _ in product(prenoms, range(repetitions))]
        moyennes[groupe] = sum(scores) / len(scores)
    return moyennes  # un écart systématique entre groupes signale un biais
```

On mesure aussi des **taux par groupe** sur des données réelles quand c'est légal et possible (taux d'acceptation, taux d'erreur), et on examine les **cas d'échec** par population.

## Réduire

- **Retirer** les informations non pertinentes de l'entrée (le prénom, la photo, l'âge ne servent pas à évaluer une compétence).
- **Structurer** la décision : une grille de critères explicites notée séparément, plutôt qu'un jugement global.
- **Instruire** le modèle, mais **vérifier** par la mesure : une consigne « sois impartial » ne suffit pas.
- **Contrôle humain** et **contestation** possible pour les décisions qui affectent les personnes.
- **Surveiller** dans le temps : les biais peuvent apparaître avec un changement de modèle.

# Transparence et documentation

Un système d'IA digne de confiance est **documenté** :

- **Fiche système** (inspirée des *model cards* et *system cards*) : usage prévu et usages exclus, modèle utilisé et version, données (RAG, fine-tuning), résultats d'évaluation (qualité, sécurité, biais), limites connues, contrôle humain, contact.
- **Information des utilisateurs** : ils parlent à une IA, ce qu'elle peut et ne peut pas faire, comment signaler un problème.
- **Traçabilité** : versions des prompts, des modèles et des données liées à chaque réponse (module 8).
- **Registre** des systèmes d'IA de l'organisation, avec leur niveau de risque et leur responsable.

# Les cadres de gestion des risques

Deux cadres servent de référence pour organiser la gouvernance :

| Cadre | Nature | Contenu |
|---|---|---|
| **NIST AI RMF** (États-Unis, 2023, complété en 2024 d'un profil pour l'IA générative) | Cadre volontaire | Quatre fonctions : **Gouverner** (rôles, politiques), **Cartographier** (contexte et risques), **Mesurer** (évaluations, tests), **Gérer** (traitement et suivi des risques) |
| **ISO/IEC 42001** (2023) | Norme certifiable | Système de management de l'IA, sur le modèle d'ISO 27001 pour la sécurité : politique, rôles, évaluation des risques et des impacts, amélioration continue |

Pour une équipe, la traduction pratique est une **revue de lancement** systématique : qualification réglementaire, analyse de risques, résultats d'évaluation et de red teaming, plan de surveillance, responsable désigné.

# Exercices

## Exercice 1 : Qualifier des cas d'usage

Indiquez le niveau de risque probable au sens de l'AI Act :

1. Un chatbot de FAQ pour un site de e-commerce.
2. Un outil qui présélectionne les candidats à un emploi à partir de leurs CV.
3. Un générateur d'images marketing publiées sur les réseaux sociaux.
4. Un système qui déduit l'état émotionnel des employés à partir de leurs visioconférences.
5. Un filtre anti-spam.

<details>
<summary>Voir la solution</summary>

1. **Transparence** : informer les utilisateurs qu'ils échangent avec une IA.
2. **Haut risque** : recrutement et sélection de candidats (annexe III).
3. **Transparence** : les contenus générés doivent pouvoir être identifiés comme tels (marquage), en particulier les hypertrucages.
4. **Interdit** : reconnaissance des émotions sur le lieu de travail (hors raisons médicales ou de sécurité).
5. **Risque minimal**.

</details>

## Exercice 2 : RGPD et assistant RH

Une entreprise veut un assistant interne qui répond aux questions des salariés sur leurs congés, en consultant leur dossier RH, via l'API d'un fournisseur américain. Listez les points à vérifier avec le DPO.

<details>
<summary>Voir une proposition de solution</summary>

- **Finalité et base légale** du traitement ; information des salariés.
- **Minimisation** : n'envoyer au modèle que les champs utiles (solde de congés, pas le salaire ni les arrêts maladie).
- **Contrat de sous-traitance** avec le fournisseur : conservation des données, absence de réutilisation pour l'entraînement, options de non-conservation, sous-traitants ultérieurs.
- **Transferts hors UE** : mécanisme juridique applicable, ou hébergement dans une région européenne.
- **Contrôle d'accès** : chaque salarié n'accède qu'à son propre dossier (contrôle dans l'outil, pas dans le prompt).
- **Journaux** : contenu, protection, durée de conservation.
- **Droits** : accès et effacement, y compris dans les traces et la mémoire.
- **AIPD** si des données sensibles (santé) peuvent être concernées.

</details>

## Exercice 3 : Détecter un biais

Votre outil de notation de CV donne en moyenne 7,8/10 au groupe de prénoms A et 7,1/10 au groupe B, sur des CV par ailleurs identiques (30 essais par groupe). Que faites-vous ?

<details>
<summary>Voir la solution</summary>

1. **Vérifier la significativité** : augmenter le nombre d'essais et de CV modèles différents, calculer un intervalle de confiance ; un écart de 0,7 point systématique est préoccupant.
2. **Retirer le prénom** (et toute donnée non pertinente) de l'entrée du modèle : c'est la correction la plus simple et la plus efficace.
3. **Structurer** la notation par critères explicites, notés séparément.
4. **Mesurer à nouveau**, puis intégrer ce test contrefactuel à la suite d'évaluation permanente.
5. Rappeler que ce cas d'usage est **à haut risque** au sens de l'AI Act : documentation, contrôle humain et gestion des risques sont obligatoires.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Gouvernance et IA responsable
center: Les exigences réglementaires et éthiques se traduisent en choix techniques, à anticiper dès le cadrage.
points:
  - icon: scale
    title: AI Act
    text: "Interdit, haut risque, transparence, minimal : qualifier chaque cas d'usage, vérifier le calendrier."
  - icon: lock
    title: RGPD
    text: Minimisation, sous-traitants, transferts, droits jusque dans traces et mémoire, article 22.
  - icon: book
    title: Licences et droit d'auteur
    text: Open-weight ne veut pas dire sans restriction ; vérifier aussi les droits sur les documents.
  - icon: users
    title: Biais
    text: Tests contrefactuels, retrait des données non pertinentes, critères explicites, contrôle humain.
  - icon: file
    title: Documentation
    text: Fiche système, information des utilisateurs, traçabilité, registre des systèmes.
  - icon: compass
    title: Cadres
    text: NIST AI RMF (gouverner, cartographier, mesurer, gérer) et ISO/IEC 42001.
pitfall: Découvrir après le lancement qu'un outil « simple » de tri de CV est un système à haut risque.
remember: Qualifier, minimiser, mesurer les biais, documenter, garder l'humain dans la boucle, puis faire valider par un juriste.
```
