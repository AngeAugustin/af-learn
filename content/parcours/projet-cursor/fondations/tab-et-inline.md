---
title: "Complétion Tab et édition en ligne"
description: "Accepter une suggestion Tab courte et lisible, et ne pas laisser la complétion inventer la règle des 8 places."
duration: 50
objectives:
  - "Lire la suggestion grisée que Tab propose dans la ligne en cours"
  - "Accepter une suggestion courte, la refuser, ou n'en prendre qu'un mot"
  - "Refuser une suggestion que vous ne pouvez pas vérifier d'un coup d'œil"
  - "Garder la règle des 8 places hors de portée de Tab, qui ne lit pas les règles du projet"
---

# La suite, en grisé, dans la ligne

Tab est la complétion de Cursor. Pendant que vous tapez dans l'éditeur, une suggestion apparaît en grisé devant le curseur. Elle s'appuie sur ce que vous venez d'écrire, sur le fichier autour, sur vos modifications récentes. Ce n'est pas le chat. Shift+Tab, qui fait tourner Agent, Plan et Ask, ne la déclenche pas.

Atelier Sève, Lyon Croix-Rousse. Léa Vernet, céramiste, tient 12 stages par mois, le samedi de 10 h à 13 h, 8 places, 45 €. La liste d'attente est plafonnée à 12. Léa confirme ou refuse avant 18 h la veille. Le remplissage actuel est de 70 %. 3 absents en moyenne par mois, parce que la confirmation est un SMS oublié. L'application s'appelle Sève.

L'édition en ligne, ici, est ce geste : la proposition est écrite dans la ligne, vous la lisez sur place, vous l'acceptez ou vous continuez à taper. Vous ne passez pas par un plan. Vous ne demandez pas à l'agent de « finir le fichier ». La page des 12 stages est ouverte, vous complétez une ligne, vous voyez tout de suite si la suggestion dit 8 ou 9.

> [!NOTE]
> Les règles du projet ne pilotent pas Tab. Une règle « jamais plus de 8 places » protège l'agent. Elle ne retient pas la suggestion grisée. Vos yeux le font.

# Accepter, refuser, avancer d'un mot

Trois gestes, au clavier.

- **Tab** accepte toute la suggestion affichée.
- **Échap**, ou le simple fait de continuer à taper, la refuse.
- **Ctrl+Flèche droite** (Windows et Linux) accepte le mot suivant seulement. Sur Mac, c'est Cmd+Flèche droite.

Le mot suivant sert quand le début est juste et la fin ne l'est pas. Vous tapez le libellé du prix. Tab propose `45 €, 10 places`. Le début est bon, la fin casse l'atelier. Vous prenez `45` puis `€`, vous refusez `10 places`, vous écrivez `8 places` vous-même.

Accepter toute la suggestion est réservé au cas où vous l'avez lue en entier. « Toute » veut dire toutes les lignes grisées, pas seulement le mot sous vos yeux. Tab peut proposer plusieurs lignes d'un coup, un import, une seconde modification plus bas. Si vous ne les voyez pas, vous ne les acceptez pas.

# Une suggestion que vous lisez d'un coup d'œil

La bonne suggestion Tab est courte. Vous la lisez sans faire défiler, sans deviner, sans vous dire que « le modèle a sûrement repris le brief ».

Courtes, et acceptables si le fichier le confirme déjà :

- le libellé `45 €` à côté d'une date déjà affichée ;
- la répétition de `places restantes` sur le même modèle que la ligne du dessus ;
- une heure `10 h` ou `13 h` déjà présente dans la ligne voisine.

Trop longues, à refuser :

- un bloc qui « termine » la page des 12 stages ;
- une fonction qui décide qui est inscrit ;
- une file d'attente écrite en même temps que la liste des dates.

Le remplissage de 70 % n'est pas une ligne à compléter. C'est un fait d'atelier. Tab n'a pas à l'inventer dans le code sous la forme d'un quota. Les places restantes se calculent sur 8, stage par stage, pas sur une moyenne.

```diagram
type: decision
title: Accepter ou non la suggestion grisée
nodes:
  - question: "La suggestion tient-elle dans un coup d'œil, sans défilement ?"
    yes: "Vous pouvez la lire en entier avant Tab."
    no: "Échap. Vous tapez vous-même, ou vous passez par l'agent avec un résultat nommé."
  - question: "Dit-elle 8 places et 45 €, sans 9e place ni file d'attente ?"
    yes: "Tab accepte. Vous regardez la ligne devenue du vrai texte."
    no: "Refus, ou un seul mot juste avec Ctrl+Flèche droite."
```

# Tab n'invente pas la règle des 8 places

Vous ouvrez le jeu des 12 dates et vous commencez une ligne : samedi, 10 h, 13 h. Tab propose la suite qu'il a vue ailleurs, parfois 10 places, parfois un prix rond, parfois « liste d'attente illimitée ». Rien de tout cela n'est la règle de Léa.

La règle tient en une phrase, et elle n'est pas négociable dans une suggestion : une réservation ne dépasse jamais 8 places. Le formulaire qui refuse la 9e place est l'incrément 2. Tab ne le construit pas « en passant » pendant que vous saisissez les dates. La liste d'attente jusqu'à 12 est l'incrément 3. La confirmation, Léa qui tranche avant 18 h, est l'incrément 4. Une suggestion qui mélange ces trois sujets dans la page des stages est fausse, même si le gris est élégant.

Vous refusez, vous finissez la ligne à la main, ou vous laissez l'agent le faire en mode Agent avec une phrase bornée. Tab est plus rapide seulement quand vous restez capable de lire.

> [!WARNING]
> Une suggestion de plusieurs lignes peut aussi sauter ailleurs dans le fichier, ou vers un autre fichier, après un premier Tab. Si un second Tab vous emmène sans que vous ayez vu la cible, vous annulez.

# Sauts, plusieurs lignes, et quand couper Tab

Après une acceptation, un nouvel appui sur Tab peut sauter à l'endroit que la complétion juge être la prochaine édition. Un bandeau peut proposer un autre fichier. Utile pour renommer un libellé déjà décidé. Dangereux si la « prochaine édition » est le plafond de la liste d'attente, que vous n'aviez pas ouvert.

Vous coupez Tab un moment quand le fichier est sensible. L'indicateur Tab, en bas à droite de l'éditeur, permet de le suspendre, de le désactiver pour tous les fichiers, ou de le désactiver pour certaines extensions. Suspendre pendant que vous relisez les 12 dates évite qu'une suggestion s'insère entre deux samedis.

Vous revenez à l'agent, pas à Tab, dans ces cas :

- la modification touche plus d'un résultat nommé ;
- vous ne pouvez pas dire, avant d'accepter, ce que la ligne doit contenir ;
- la suggestion réécrit une règle (8, 12, 18 h, 45 €) au lieu de recopier un libellé.

Les 3 absents ne se corrigent pas en laissant Tab inventer un rappel SMS dans un fichier de dates. Ce sujet est la confirmation visible. Il attend son incrément, et un mode de chat, pas une ligne grisée.

# Relire la ligne devenue vraie

Une fois Tab accepté, le gris disparaît. Le texte est dans le fichier, au même titre qu'une frappe. Vous le relisez comme un diff d'une ligne. S'il dit 8 places et 45 €, vous gardez. S'il a ajouté une 9e place « pour compléter », vous annulez tout de suite, avant d'enchaîner une autre suggestion.

L'aperçu de la page des stages reste le juge. Douze lignes, des samedis de 10 h à 13 h, 8 places, 45 €, des places restantes. Tab accélère la saisie des libellés déjà décidés. Il ne décide pas à la place de Léa Vernet, et il ne remplace pas le formulaire qui refusera la 9e place.

# Exercices

## Exercice 1 : Le gris dépasse

Vous saisissez le prix sur la page des stages. Tab propose, en une suggestion : `45 € · 10 places · liste d'attente ouverte`. Que faites-vous des trois morceaux ?

<details>
<summary>Voir la solution</summary>

Vous ne faites pas Tab sur l'ensemble. `45 €` est juste. `10 places` casse la règle des 8. La liste d'attente n'est pas cet incrément : elle viendra plus tard, plafonnée à 12, dans l'ordre.

Vous acceptez au plus le prix, mot par mot avec Ctrl+Flèche droite, puis vous refusez le reste avec Échap. Vous écrivez `8 places` vous-même. Les règles du projet, même si elles existent déjà, n'auraient pas arrêté cette suggestion.

</details>

## Exercice 2 : Le bloc entier

La page n'a encore que trois dates. Tab propose d'un coup les neuf autres stages, des prix variables, et une note « confirmation par SMS ». Le tout fait plus qu'un écran. Acceptez-vous ?

<details>
<summary>Voir la solution</summary>

Non. Vous ne lisez pas la suggestion d'un coup d'œil, et elle invente des prix autres que 45 € plus un SMS. Les 3 absents viennent justement d'un SMS oublié : le remettre dans la page des dates est le mauvais incrément.

Échap. Les 12 stages du mois, tous à 8 places et 45 €, se demandent à l'agent avec un résultat nommé, ou se saisissent ligne par ligne quand vous voyez chaque date. Un second Tab qui sauterait ailleurs est exactement ce que vous évitez ici.

</details>

## Exercice 3 : Le libellé juste

La ligne du dessus dit `samedi · 10 h-13 h · 8 places · 45 €`. Vous commencez la ligne suivante, Tab propose le même libellé d'horaires et de places, en une courte suggestion, sans rien d'autre. Que faites-vous ?

<details>
<summary>Voir la solution</summary>

Vous lisez la suggestion en entier. Elle recopie un libellé déjà décidé : 10 h, 13 h, 8 places, 45 €. Pas de 9e place, pas d'attente, pas d'heure de confirmation. Vous acceptez avec Tab.

Vous vérifiez ensuite que la ligne est devenue du texte normal, et que la date, elle, est bien celle du samedi en cours. Le libellé peut se répéter. La date, non. S'il a recopié la date de la ligne du dessus, vous la corrigez avant de passer à la suivante.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Tab se lit
center: "Tab propose la suite dans la ligne. Vous n'acceptez que ce que vous lisez d'un coup d'œil."
points:
  - icon: code
    title: Texte grisé
    text: "Devant le curseur, d'après la frappe et le fichier. Ce n'est pas un mode du chat."
  - icon: check
    title: Trois touches
    text: "Tab accepte tout. Échap refuse. Ctrl+Flèche droite ne prend que le mot suivant."
  - icon: eye
    title: Coup d'œil
    text: "45 € ou 8 places, recopiés d'une ligne voisine. Pas un bloc qui termine la page."
  - icon: shield
    title: Huit places
    text: "Tab n'applique pas la règle du projet. Une 9e place en gris se refuse."
  - icon: alert
    title: Sauts
    text: "Un second Tab peut sauter plus loin. Si vous n'avez pas vu la cible, vous annulez."
pitfall: "Accepter un gris de plusieurs lignes qui invente 10 places, un prix autre, ou un SMS de confirmation."
remember: "Suggestion courte, lue, conforme à 8 places et 45 €. Sinon Échap, et la règle reste à l'agent."
```
