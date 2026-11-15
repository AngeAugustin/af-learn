---
title: Les modèles multimodaux
description: "Au-delà du texte : comprendre images et documents, construire des applications vocales, générer des images, et adapter le RAG aux contenus visuels."
duration: 60
objectives:
  - Expliquer comment un modèle de langage traite des images et des documents
  - Envoyer images et PDF à une API, estimer leur coût et connaître leurs limites
  - Concevoir une application vocale (transcription, synthèse, agents vocaux temps réel)
  - Comprendre le principe de la génération d'images par diffusion et ses enjeux
  - Adapter un pipeline RAG à des documents riches en éléments visuels
---

# Des modèles qui voient et entendent

Les LLM actuels sont pour la plupart **multimodaux** : ils acceptent en entrée du texte, des **images**, des **documents** (PDF), parfois de l'**audio** ou de la **vidéo**, et certains produisent aussi de l'audio ou des images. Pour l'AI Engineer, cela ouvre de nombreux cas d'usage : lire des factures scannées, analyser des graphiques, comprendre des captures d'écran, répondre à la voix.

| Modalité | En entrée | En sortie | Exemples d'usage |
|---|---|---|---|
| Image | Très répandu | Modèles dédiés ou multimodaux | Extraction de documents, analyse de photos, contrôle qualité |
| Document (PDF) | Répandu | - | Contrats, rapports, formulaires |
| Audio | Répandu (transcription), natif chez certains modèles | Synthèse vocale, modèles parole-à-parole | Assistants vocaux, comptes rendus de réunion |
| Vidéo | Chez certains modèles | Modèles génératifs dédiés | Analyse de vidéos, génération de clips |

# Comment un modèle « voit » une image

Le principe le plus courant : l'image est **découpée en petits carreaux** (*patches*), chacun transformé en vecteur par un **encodeur visuel** (souvent de type *Vision Transformer*). Ces vecteurs sont projetés dans le même espace que les embeddings de tokens de texte, puis traités par le Transformer avec le reste du contexte (module 3, chapitre 1).

```diagram
type: flow
title: Une image dans le contexte d'un LLM
steps:
  - title: Image
    text: Redimensionnée selon les limites du modèle
  - title: Carreaux
    text: Découpage en patches de quelques pixels de côté
  - title: Encodeur visuel
    text: Un vecteur par carreau
  - title: Projection
    text: Dans l'espace des embeddings du LLM
  - title: Transformer
    text: Image et texte traités ensemble par l'attention
    tone: teal
```

Conséquence pratique : **une image coûte des tokens**, en proportion de sa taille. Chez Anthropic, par exemple, une image consomme environ `largeur × hauteur / 750` tokens (une image de 1 000 × 1 000 pixels ≈ 1 300 tokens), après redimensionnement si elle dépasse la taille maximale.

# Images et documents par API

```python
import base64
import anthropic

client = anthropic.Anthropic()

with open("facture.png", "rb") as f:
    image_b64 = base64.standard_b64encode(f.read()).decode()

reponse = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=1_000,
    messages=[{
        "role": "user",
        "content": [
            {"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": image_b64}},
            {"type": "text", "text": "Extrais le fournisseur, la date, le montant HT, la TVA et le montant TTC, en JSON."},
        ],
    }],
)
print(reponse.content[0].text)
```

Les PDF s'envoient de façon similaire avec un bloc de type document ; le modèle reçoit alors à la fois le **texte** extrait et l'**image** de chaque page, ce qui lui permet de comprendre tableaux, graphiques et mise en page.

> [!TIP]
> Bonnes pratiques : placer l'image **avant** la question ; combiner avec des **sorties structurées** (module 4) pour l'extraction ; envoyer une résolution **suffisante** pour lire le texte, mais pas plus (coût) ; découper les très grands documents.

## Les limites à connaître

Les modèles de vision progressent vite, mais restent faillibles sur :

- le **texte très petit** ou flou, et les écritures manuscrites difficiles ;
- le **comptage** précis d'objets nombreux ;
- le **raisonnement spatial** fin (positions relatives, mesures, lecture précise d'un graphique) ;
- les **hallucinations visuelles** : décrire un élément absent de l'image, surtout si la question le suggère (« Quelle est la couleur de la voiture ? » sur une image sans voiture).

Comme pour le texte : **évaluez** sur vos propres documents, et faites vérifier par un humain les extractions à fort enjeu (montants, identités).

> [!WARNING]
> Une image est aussi un vecteur d'**injection de prompt** : du texte écrit dans l'image (même peu visible pour un humain) est lu par le modèle. Traitez le contenu des images comme une donnée non fiable (module 9).

# La voix

## Les briques

| Brique | Rôle | Remarques |
|---|---|---|
| **Transcription** (*speech-to-text*) | Audio → texte | Modèles comme Whisper (open source) ou services cloud ; qualité variable selon accents, bruit, vocabulaire métier |
| **Synthèse** (*text-to-speech*) | Texte → audio | Voix naturelles, choix de voix, contrôle du ton |
| **Modèles parole-à-parole** | Audio → audio directement | Latence réduite, perçoivent l'intonation ; moins de contrôle intermédiaire |

## Deux architectures d'agent vocal

```diagram
type: compare
title: Construire un agent vocal
columns:
  - title: En cascade
    tone: blue
    items:
      - Transcription, puis LLM texte, puis synthèse
      - Chaque brique est remplaçable et testable
      - Le texte intermédiaire facilite journalisation, garde-fous et outils
      - Latence cumulée des trois étapes
  - title: Parole-à-parole natif
    tone: violet
    items:
      - Un modèle temps réel reçoit et produit de l'audio
      - Latence plus faible, conversation plus naturelle
      - Perçoit le ton, les hésitations
      - Plus difficile à contrôler et à évaluer
```

## Les défis propres à la voix

- **La latence** : dans une conversation, un silence de plus d'une seconde paraît long. On diffuse tout en **streaming** (transcription partielle, génération et synthèse au fil de l'eau) et on choisit des modèles rapides.
- **Les tours de parole** : détecter quand l'utilisateur a fini de parler (*détection d'activité vocale*), gérer les **interruptions** (l'utilisateur coupe l'agent, qui doit s'arrêter immédiatement).
- **Le style** : des réponses **courtes**, sans listes à puces ni Markdown, des nombres et sigles écrits pour être prononcés correctement.
- **La téléphonie** : qualité audio réduite, bruits de fond, intégration aux systèmes d'appel.
- **Les données** : la voix est une donnée personnelle, et biométrique si elle sert à identifier ; informez et recueillez le consentement pour l'enregistrement.

# Générer des images

Les générateurs d'images reposent pour la plupart sur la **diffusion** : on apprend à un modèle à **retirer du bruit** d'une image, étape par étape. Pour générer, on part d'un bruit aléatoire et on le « débruite » progressivement, **guidé par le texte** de la demande (dont le sens est représenté par un encodeur de texte). Certains modèles multimodaux génèrent aussi des images directement, comme ils génèrent du texte.

Les usages en entreprise : illustrations, maquettes, déclinaisons de visuels, retouche (*inpainting*), images de produits. Les enjeux spécifiques :

- **Droits** : licences du modèle, conditions d'utilisation, risque de reproduire des œuvres protégées ou des marques (module 9).
- **Transparence** : l'AI Act impose de pouvoir identifier les contenus générés, en particulier les hypertrucages ; des standards comme **C2PA** (*Content Credentials*) et des filigranes invisibles servent à marquer la provenance.
- **Usages interdits** : images de personnes réelles sans consentement, contenus trompeurs ; les fournisseurs appliquent leurs propres politiques.

# Le RAG multimodal

Beaucoup de documents d'entreprise sont **visuels** : schémas techniques, tableaux complexes, présentations. Un RAG qui n'indexe que le texte extrait passe à côté. Trois approches :

| Approche | Principe | Quand |
|---|---|---|
| **Description textuelle** | Un modèle de vision décrit chaque image ou tableau ; on indexe la description avec le texte | Simple, compatible avec un RAG existant |
| **Embeddings multimodaux** | Un modèle d'embeddings place images et textes dans le même espace vectoriel | Recherche d'images par texte, catalogues visuels |
| **Pages en image** | On indexe directement l'**image de chaque page** (approche de type ColPali) et on envoie les pages retrouvées au modèle de vision | Documents très mis en page (rapports, présentations) |

À la génération, on envoie au modèle multimodal les **pages ou images retrouvées** elles-mêmes, pas seulement leur description, pour qu'il puisse lire le tableau ou le schéma.

# Exercices

## Exercice 1 : Estimer le coût

Vous devez extraire les informations de 10 000 factures scannées, chacune une image de 1 500 × 2 000 pixels, avec un prompt de 300 tokens et une réponse de 200 tokens. En utilisant l'approximation `largeur × hauteur / 750` (et en supposant qu'aucun redimensionnement n'a lieu), estimez le nombre de tokens d'entrée et de sortie. Quelle optimisation simple proposez-vous ?

<details>
<summary>Voir la solution</summary>

- Image : 1 500 × 2 000 / 750 = **4 000 tokens** par facture. Entrée : 4 000 + 300 = 4 300 tokens ; pour 10 000 factures : **43 millions** de tokens d'entrée. Sortie : 200 × 10 000 = **2 millions** de tokens.
- *(En pratique, une image de cette taille serait réduite par l'API si elle dépasse la taille maximale ; vérifiez la documentation.)*
- Optimisations : **réduire la résolution** au minimum lisible (tester 1 000 × 1 333 : environ 1 800 tokens, soit plus de deux fois moins), **recadrer** sur la zone utile, utiliser le **traitement par lots** asynchrone (module 10), choisir un modèle plus économique après évaluation.

</details>

## Exercice 2 : Concevoir un agent vocal

Un cabinet médical veut un agent vocal qui prend les rendez-vous par téléphone. Choisissez une architecture et listez cinq exigences de conception.

<details>
<summary>Voir une proposition de solution</summary>

Architecture **en cascade** (transcription → LLM avec outils d'agenda → synthèse), en streaming : elle facilite la journalisation, les garde-fous et l'appel des outils d'agenda, et chaque brique peut être évaluée. Une architecture parole-à-parole est envisageable si la latence devient le problème principal.

Exigences :

1. **Latence** : réponse en moins d'une seconde environ, streaming à chaque étape.
2. **Interruptions** gérées (le patient corrige une date en cours de phrase).
3. **Confirmation** systématique du rendez-vous à voix haute (date, heure, praticien), et SMS de confirmation.
4. **Aucun conseil médical** ; orientation vers le 15 en cas d'urgence décrite ; transfert vers le secrétariat sur demande.
5. **Données de santé** : information et consentement pour l'enregistrement, minimisation, hébergement conforme, durée de conservation limitée.

</details>

## Exercice 3 : RAG sur des schémas techniques

Une entreprise industrielle veut interroger 5 000 pages de manuels de maintenance, dont la moitié de l'information est dans des schémas annotés. Le RAG textuel actuel répond mal aux questions sur les schémas. Que proposez-vous ?

<details>
<summary>Voir la solution</summary>

- Indexer les **pages en image** (approche de type ColPali), ou à défaut générer une **description textuelle détaillée** de chaque schéma (composants, annotations, références) par un modèle de vision, indexée avec le texte de la page.
- À la génération, envoyer au modèle multimodal les **images des pages** retrouvées, pas seulement leur texte.
- Conserver dans les métadonnées le manuel, la page et le numéro de schéma pour **citer** la source.
- Construire un jeu d'évaluation avec des questions dont la réponse est **uniquement** dans un schéma, pour mesurer le gain.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Les modèles multimodaux
center: "Images, documents, voix : de nouveaux usages, avec des coûts, des limites et des risques propres."
points:
  - icon: eye
    title: Vision
    text: Images découpées en carreaux et encodées ; coût proportionnel à la taille.
  - icon: file
    title: Documents
    text: PDF lus en texte et en image ; sorties structurées pour l'extraction.
  - icon: alert
    title: Limites
    text: Petit texte, comptage, raisonnement spatial, hallucinations ; images = injection possible.
  - icon: chat
    title: Voix
    text: En cascade ou parole-à-parole ; latence, tours de parole, interruptions.
  - icon: sparkles
    title: Génération d'images
    text: Diffusion guidée par le texte ; droits, marquage de provenance, usages interdits.
  - icon: search
    title: RAG multimodal
    text: Descriptions, embeddings multimodaux ou pages en image.
pitfall: Indexer uniquement le texte de documents dont l'information clé se trouve dans les schémas et tableaux.
remember: Réduire la résolution au minimum lisible et évaluer sur vos propres documents.
```
