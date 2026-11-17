---
title: Qualité des données avant publication
description: "Contrôles avant de certifier un chiffre : totaux contre la finance, orphelins, dates futures, doublons de clé, tests simples, et qui corrige vraiment la source."
duration: 60
objectives:
  - Exécuter les contrôles de total, d'orphelins, de dates et de clés avant publication
  - Écrire des tests simples qui échouent quand le chiffre n'est plus défendable
  - Distinguer qui corrige la source, qui valide le périmètre et qui bloque le rapport
  - Documenter un écart résiduel au lieu de le masquer dans le rapport
---

# Publier, c'est s'engager

Chez Halte Marché, le rapport du lundi porte un badge. Ce badge dit à la directrice régionale : vous pouvez appeler un magasin sur ce chiffre. Le badge ne se mérite pas par une mise en page terminée. Il se mérite par des contrôles **passés**, ou par un écart **écrit** et accepté par la finance.

Publier sans contrôle, c'est transférer le risque à la revue. Le régional agira sur un faux −4 %. Le magasin passera la semaine à se justifier. Vous passerez la suivante à retirer le badge, trop tard pour la décision.

Quatre familles suffisent avant chaque certification, et après chaque changement de règle :

1. le total contre la finance ;
2. les orphelins (faits sans dimension) ;
3. les dates impossibles ou hors période ;
4. les doublons de clé.

```diagram
type: flow
title: Quatre contrôles, puis seulement le badge
steps:
  - title: Totaux
    text: Écart au contrôle de gestion sous le seuil écrit
    tone: amber
  - title: Orphelins
    text: Ventes sans magasin ou sans produit, comptées
    tone: blue
  - title: Dates
    text: Rien hors règle, ni futur non expliqué
    tone: teal
  - title: Clés
    text: Zéro doublon au grain annoncé
    tone: violet
  - title: Badge
    text: Certifié, ou écart nommé et non officiel
    tone: rose
```

Un contrôle en échec n'a que deux sorties honorables. Vous **bloquez** le badge. Ou vous publiez un chiffre **non certifié**, avec la phrase d'écart sur la page (« +12 400 €, cartes cadeaux, arbitrage finance en attente »). Vous ne filtrez pas les lignes gênantes pour faire revenir le total.

```diagram
type: compare
title: Deux réactions à un contrôle en échec
columns:
  - title: Masquer
    tone: rose
    items:
      - Filtrer les lignes qui dérangent
      - Le total redevient « juste »
      - La cause continue d'envenimer le mois
  - title: Qualifier
    tone: teal
    items:
      - Retirer le badge, ou écrire l'écart
      - Nommer le propriétaire de la correction
      - Republier quand la cause est traitée
```

# Les totaux face à la finance

Le contrôle de gestion tient le chiffre que la comptabilité reconnaît. Votre CA HT du mois de gestion doit s'en approcher **avant** que la page ne découpe par région. Le rapprochement se fait au périmètre convenu, pas sur un filtre de démonstration.

Éléments à aligner par écrit, une fois, puis à recontrôler :

- hors taxes, pas TTC ;
- avoirs inclus ou présentés à part, mais des deux côtés de la même façon ;
- cartes cadeaux, bons d'achat, mises en avant ;
- magasins intégrés, franchisés, fermés en cours de mois ;
- mois de gestion (civil ou calendrier retail) ;
- site e-commerce inclus ou non dans le « CA magasin ».

Le seuil se signe avec la finance. Exemple tenable pour Halte Marché : écart absolu inférieur à 1 000 € **et** écart relatif inférieur à 0,1 % du CA du mois. Au-delà, pas de badge. En dessous, l'écart résiduel tient en une ligne dans le journal de certification (montant, cause, date, nom du contrôleur).

Le contrôle se fait sur le **même SQL** que la vue du rapport, pas sur un export déjà filtré par la page. Si vous ne pouvez rapprocher que la région Nord, vous n'avez pas rapproché le chiffre. Vous avez rapproché une tranche.

Les écarts classiques, et ce qu'ils veulent dire :

| Écart | Lecture probable | Ce que vous ne concluez pas |
|---|---|---|
| Vous êtes en dessous, rond | Jointure interne, orphelins écartés | « La finance a trop compté » |
| Vous êtes au-dessus, presque le double | Clé en double, fichier ajouté deux fois | « Bon mois commercial » |
| Écart stable chaque mois | Périmètre (cartes, franchise, site) | « C'est le bruit habituel, on publie » |
| Écart seulement sur le frais | Jour de caisse ou rayon mal mappé | « Le total passe, le détail suivra » |

Un écart stable n'est pas un bruit. C'est une définition différente. Tant qu'elle n'est pas tranchée, vous avez deux chiffres officiels, donc zéro.

# Orphelins, dates futures, doublons

Trois requêtes courtes disent si le grain annoncé est vrai. Adaptez les noms à votre vue. Le principe ne change pas.

**Orphelins.** Une vente dont le `magasin_id` n'existe pas dans `magasins` disparaît d'un `INNER JOIN` et fausse le total, ou tombe dans une région vide. Vous les comptez.

```sql
SELECT COUNT(*) AS ventes_sans_magasin
FROM ventes AS v
LEFT JOIN magasins AS m ON m.magasin_id = v.magasin_id
WHERE m.magasin_id IS NULL;
```

Le résultat attendu d'un chiffre certifié est **zéro**, ou un nombre assumé (nouveau magasin ouvert hier, référentiel pas encore à jour) avec un propriétaire et une date de correction. Le même contrôle existe vers `produits` si vous publiez un CA par rayon. Un orphelin de produit n'empêche pas le CA total. Il empêche le CA par rayon. Dites lequel des deux vous certifiez.

**Dates futures.** Une date de **caisse** postérieure à aujourd'hui est anormale. Une date de **livraison** prévue peut être dans le futur sans être fausse. La règle se écrit par colonne, pas pour « les dates » en général.

```sql
SELECT COUNT(*) AS caisse_dans_le_futur
FROM ventes
WHERE date_vente > CURRENT_DATE;
```

Zéro, ou une liste courte que la caisse explique (horloge de magasin, ticket de test). Vous ne supprimez pas ces lignes dans le rapport sans les compter : les tickets de test gonflent parfois le CA de façon répétée.

**Doublons de clé.** Au grain ligne de ticket, `ticket_id` + `ligne` est unique. Sinon chaque doublon ajoute du CA fantôme.

```sql
SELECT ticket_id, ligne, COUNT(*) AS nb
FROM ventes
GROUP BY ticket_id, ligne
HAVING COUNT(*) > 1;
```

La requête doit revenir **vide**. Si elle revient pleine après un rechargement du matin, vous avez ajouté un fichier au lieu de remplacer la fenêtre. Le chapitre sur les sources décrit le geste correct. Ici, le test suffit à refuser le badge.

Ces trois contrôles se lisent aussi au grain de la vue publiée. Sur `vw_vente_magasin_jour`, la clé `date_vente` + `magasin_id` obéit au même `HAVING`. Un doublon à ce grain veut dire que la vue n'agrège pas comme elle le prétend.

# Des tests simples, rejoués

Un contrôle lancé une fois à la main le jour de la mise en ligne ne protège pas le lundi suivant. Vous le **rejouez** à chaque rafraîchissement qui précède une revue, et après chaque changement de vue.

La forme importe peu. Le critère, si.

- Une requête SQL dont le résultat vide, ou nul, veut dire « bon ».
- Une page cachée du rapport qui affiche les quatre compteurs et passe au rouge sinon.
- Un test sur le modèle SQL partagé (unicité de la clé, valeurs manquantes), si l'entreprise versionne déjà ce SQL.

Vous n'avez pas besoin d'une usine de tests. Quatre assertions, écrites, valent mieux que quarante graphiques de « qualité » que personne ne regarde.

Assertions minimales pour Halte Marché :

1. écart au total finance du mois ouvert, sous le seuil signé ;
2. `ventes_sans_magasin = 0` (ou liste d'exceptions datée) ;
3. `caisse_dans_le_futur = 0` ;
4. aucun doublon sur la clé du grain publié.

Ajoutez un cinquième réflexe, gratuit : le CA de la page, tous filtres au périmètre de certification, égale le CA de la requête de contrôle. Si la page est en dessous, un filtre est resté actif. Ce n'est pas un problème de source. C'est un problème de rapport, et c'est le vôtre.

Conservez le journal : date du contrôle, période, résultat, nom. Quand le régional demande « étiez-vous sûrs lundi ? », vous répondez par une ligne, pas par un souvenir.

> [!TIP]
> Fixez un mois déjà clos comme étalon. Relancez les quatre tests dessus après chaque modification de vue. Si le mois clos bouge, la modification n'est pas anodine : elle réécrit l'histoire que la finance a déjà acceptée.

# Qui corrige, qui bloque

Vous détectez. Vous ne « réparez » pas le chiffre dans le rapport. La correction appartient à celui qui tient le réel, ou la définition.

| Contrôle en échec | Qui corrige | Votre geste |
|---|---|---|
| Doublon de ticket en caisse | Équipe de la caisse, propriétaire de la source | Badge retiré, clé et période transmises |
| Fichier ajouté deux fois par vous | Vous, sur le chargement de la fenêtre | Remplacer la fenêtre, rejouer les tests |
| Magasin absent du référentiel | Propriétaire du référentiel magasins | Ne pas inventer une région dans une condition |
| Écart de périmètre avec la compta | Contrôle de gestion, qui tranche la définition | Documenter, ne pas publier deux officiels |
| Date de caisse dans le futur | Source caisse, ou règle d'horloge écrite | Compter les lignes, ne pas les cacher |
| Filtre oublié sur la page | Vous | Remettre le périmètre de certification |

Inventer la région « Nord » pour un magasin orphelin afin que le total par région « tombe juste » est une fausse correction. Le jour où le vrai rattachement arrive, le CA du Nord saute, et la revue commente une performance imaginaire.

Le contrôle de gestion ne corrige pas vos doublons. Vous ne corrigez pas son budget. Quand l'écart est un **choix de définition** (les cartes cadeaux), une réunion courte tranche, la mesure s'aligne, les deux totaux redeviennent comparables. Tant que la réunion n'a pas eu lieu, le badge attend.

Vous avez aussi le droit de certifier un **sous-périmètre** plus étroit, si vous le nommez. « CA HT magasins intégrés, hors site, mois de gestion novembre, écart finance 400 € » est un chiffre défendable. « Le CA » ne l'est pas, si le site et les franchises manquent en silence.

# La checklist de certification

Avant d'apposer le badge, ou de le laisser pour la revue du lundi, parcourez cette liste. Elle tient sur une page. Elle ne se négocie pas dans le couloir.

1. La **question** de la page est écrite, et la mesure porte le nom de la couche sémantique, pas un calcul local.
2. Le **grain** et la **clé** de la vue sont ceux annoncés. Le test de doublon est vide.
3. Les **orphelins** magasin (et produit, si la page découpe par rayon) sont à zéro ou listés avec une date de correction.
4. Les **dates de caisse** futures sont à zéro. Les autres dates futures ont une règle écrite.
5. Le **total** du mois de gestion est rapproché de la finance, sous le seuil, au bon périmètre (HT, avoirs, cartes, périmètre magasins, site).
6. La **page**, filtres au périmètre de certification, retombe sur ce même total.
7. La **fraîcheur** est affichée (dernière journée de caisse complète).
8. L'écart résiduel, s'il existe, est **écrit** : montant, cause, nom, date. Sinon le badge ne part pas.

Si un point échoue, la revue peut avoir lieu sur un chiffre **marqué non certifié**, pour ne pas annuler la discussion. Elle ne peut pas avoir lieu sur un badge mensonger. La confiance du lundi suivant vaut plus que le confort de celui-ci.

# Exercices

## Exercice 1 : Lire trois contrôles

Vous préparez la certification de novembre. Les requêtes renvoient :

1. Écart au solde finance : +48 000 €, soit 0,6 % du CA, concentré sur les cartes cadeaux. Seuil signé : 1 000 € et 0,1 %.
2. `ventes_sans_magasin` = 12, tous sur un magasin ouvert le 30 novembre, absent du référentiel.
3. Doublons de `ticket_id` + `ligne` : aucune ligne.

Que certifiez-vous, et que laissez-vous ouvert ?

Solution :
<details>
<summary>Voir la solution</summary>

Vous **ne certifiez pas** le CA de novembre en l'état. L'écart cartes cadeaux dépasse le seuil : c'est un choix de définition, à trancher avec le contrôle de gestion, pas un résidu. Les 12 ventes orphelines doivent être rattachées par le propriétaire du référentiel, ou exclues **explicitement** du périmètre certifié (mois incomplet sur ce magasin), avec la phrase sur la page.

Les doublons, eux, sont bons : la clé tient. Vous pouvez le noter. Un contrôle vert ne compense pas les deux autres.

En attendant, un pack non certifié peut circuler, avec les deux écarts écrits. Le badge attend la décision finance et le rattachement du magasin.

</details>

## Exercice 2 : Écrire le test manquant

La page « CA par rayon » est certifiée. Le total tous rayons confondus égale la finance. Un directeur constate que le rayon « Épicerie » est très bas, et qu'une ligne « (vide) » porte le complément. Quel test manquait, et que doit-il renvoyer pour autoriser le badge **par rayon** ?

Solution :
<details>
<summary>Voir la solution</summary>

Le test des **orphelins produit** (ou famille / rayon) manquait. Le CA total peut être juste pendant que le découpage ne l'est pas : les ventes sans produit tombent dans le vide et quittent l'épicerie.

Le test, jointure gauche vers `produits`, doit renvoyer **zéro** vente sans rayon, ou une liste d'exceptions datée dont le montant est soustrait du périmètre certifié. Tant qu'il renvoie un montant dans « (vide) », vous pouvez certifier le CA total, pas le CA par rayon.

</details>

## Exercice 3 : Désigner qui corrige

Pour chaque incident, nommez la personne qui corrige le réel, et le geste de l'analyste BI. Les incidents peuvent se cumuler. N'en « réparez » aucun dans le visuel.

1. Le même fichier de caisse a été ajouté deux fois dans la fenêtre du mois ouvert.
2. La finance inclut les cartes cadeaux, la mesure les exclut, l'écart est stable depuis trois mois.
3. Un ticket de test en caisse est daté du 31 décembre de l'an prochain.

Solution :
<details>
<summary>Voir la solution</summary>

1. **Vous** corrigez le chargement : remplacer la fenêtre, pas l'ajouter. Puis vous rejouez le test de doublons. Le badge reste baissé tant que le test n'est pas vide.
2. Le **contrôle de gestion** tranche la définition avec vous. Personne ne masque l'écart. La mesure et le compte s'alignent, ou le périmètre certifié change de nom. L'écart stable depuis trois mois n'est pas devenu acceptable par habitude.
3. Le **propriétaire de la caisse** retire ou explique le ticket de test. Vous comptez les dates futures, vous ne les filtrez pas en silence. S'il reste des tickets de test, ils sont listés, hors badge, jusqu'à disparition dans la source.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Qualité avant publication
center: "Le badge suit quatre contrôles. Un écart se nomme, il ne se masque pas dans le rapport."
points:
  - icon: scale
    title: Total finance
    text: "Même périmètre, même mois de gestion, sous un seuil signé. Sinon pas de badge."
  - icon: link
    title: Orphelins
    text: "Une vente sans magasin ou sans produit se compte. Elle ne disparaît pas dans la jointure."
  - icon: clock
    title: Dates de caisse
    text: "Une caisse dans le futur est anormale. Une livraison prévue peut, elle, être future."
  - icon: key
    title: Clé unique
    text: "Ticket et ligne, ou magasin et jour. Un doublon est du CA fantôme, le test doit être vide."
  - icon: users
    title: Qui corrige
    text: "La source corrige le réel, la finance tranche la définition, vous bloquez ou vous documentez."
pitfall: "Filtrer les lignes gênantes pour que le total colle, puis certifier un chiffre que nul ne peut refaire."
remember: "Mieux vaut un lundi non certifié qu'un badge sur un écart que la revue prendra pour une performance."
```
