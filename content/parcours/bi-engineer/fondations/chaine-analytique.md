---
title: "La chaîne analytique"
description: "Suivre une ligne de ticket Halte de la caisse jusqu'à la revue, et voir où le BI Engineer passe ses heures."
duration: 55
objectives:
  - "Nommer les cinq étages, de la caisse jusqu'à la page"
  - "Situer votre temps sur le mart et le modèle, pas sur Spark"
  - "Lire ce que caisse.lignes doit déjà contenir"
  - "Empêcher une règle de CA de naître dans la page de Nora"
---

# Cinq étages, de la caisse au lundi

Une ligne de ticket traverse cinq étages avant la revue. Chaque étage a un propriétaire. Les confondre, c'est réparer Spark dans le modèle, ou cacher une règle de CA dans un titre de graphique.

```diagram
type: flow
title: Une ligne de ticket, de la caisse à Nora
steps:
  - title: Source
    text: La caisse émet le ticket. Kafka et Spark ne sont pas à vous.
    tone: violet
  - title: Staging
    text: caisse.lignes est déposé, encore brut.
    tone: blue
  - title: Mart
    text: fct_ventes, ligne signée, périmètre tenu.
    tone: teal
  - title: Sémantique
    text: CA HT, marge, quantité, CA N-1.
    tone: amber
  - title: Rapport
    text: Nora filtre magasin, jour, produit.
    tone: rose
```

**La source** est la caisse. Le data engineer la transporte. Vous savez quelles colonnes elle promet et à quelle heure elle coupe. Vous ne la réécrivez pas.

**Le staging** est le premier endroit stable. `caisse.lignes` porte encore le type de ligne, le montant non signé, le drapeau de vente interne, l'horodatage. Rien ici n'est le chiffre de mars. Une franchise peut encore être présente. Une vente au personnel aussi.

**Le mart** `fct_ventes` applique le périmètre une fois : intégrés, hors personnel, retours négatifs, une ligne par `ligne_id`. Nora n'a plus à savoir ce qu'est un type de ligne.

**La couche sémantique** nomme CA HT, la marge en euros, la quantité, le CA N-1. Le taux se calcule là, après les sommes. Le rapport ne joint plus.

**Le rapport** choisit mars, l'Ouest, le commentaire de Marie. Il ne choisit pas la formule.

> [!NOTE]
> Règle de chaîne : une règle du CA s'écrit dans le mart ou dans la mesure, une seule fois. Elle ne s'écrit pas dans le titre d'une page.

# Où vous passez votre temps

Vos heures ne se répartissent pas en cinq parts égales. La source et la page existent pour savoir à qui parler.

| Étage | Part de la semaine | Ce que vous y faites |
|---|---|---|
| Source, Kafka, Spark | Presque aucune | Lire un incident, pas ouvrir le job |
| Staging | Une petite part | Jour complet, colonnes, volume |
| Mart | La plus grande | Grain, signe, périmètre, noms, tests |
| Sémantique | Une grande part | Mesures, relations, ce qui a le droit d'être sommé |
| Rapport | Presque aucune | Relire 6 240 000 € avec Nora, pas dessiner la page |

Le piège : le dépôt a une heure de retard, et vous passez l'après-midi dans le consumer. Pendant ce temps, une page retire encore les retours. Nora demande un nouveau graphique. Vous avez dépanné deux métiers, et le témoin n'a pas avancé.

Le matin, si `charge_le` a bougé avant 7 h : contrôler le volume, lancer le calcul, rapprocher mars de la finance, ne certifier que si le reste tient sous 5 000 € et sous 0,5 %. Ensuite Nora ouvre la page. Si un total l'étonne, vous rejouez la somme de `fct_ventes`. Vous n'ouvrez pas un SQL dans le rapport.

# Ce que la source vous doit

Vous ne construisez pas `caisse.lignes`. Vous devez pouvoir la lire sans deviner. Le minimum, avec le data engineer :

| Promesse | Exemple | Si elle casse |
|---|---|---|
| Grain | Une ligne de ticket | Vous ne dédupliquez pas au jugé |
| Clé | `ligne_id` | Doublon : vous stoppez le mart |
| Jour | Date de vente renseignée | Journée absente : pas frais |
| Montant | Numérique, retour identifiable | Signe deviné dans la page |
| Magasin, produit | Identifiants stables | Clé inconnue visible, pas jetée |
| Dépôt | Nuit terminée avant 7 h | `charge_le` en retard, Nora prévenue |

Le référentiel magasin promet l'identifiant, le nom, la région, le fait d'être intégré. Le référentiel produit promet l'identifiant et la famille. Le drapeau de vente interne sert à sortir le personnel du mart. S'il manque, la définition ne s'applique pas, et vous le dites. Vous ne l'inventez pas dans le rapport.

```sql
SELECT
  CAST(vendu_le AS DATE) AS jour,
  COUNT(*) AS nb_lignes,
  COUNT(DISTINCT magasin_id) AS nb_magasins
FROM caisse.lignes
WHERE vendu_le >= TIMESTAMP '2026-03-01'
  AND vendu_le <  TIMESTAMP '2026-04-01'
GROUP BY CAST(vendu_le AS DATE);
```

Cette requête ne fabrique pas `fct_ventes`. Elle vérifie que mars est arrivé. Zéro ligne un jour ouvert, et vous n'enchaînez pas.

# Du fait à la mesure

Le mart est une table. Le modèle est la façon autorisée de la lire.

**Ce qui devient une mesure.** `montant_ht_signe`, `marge_ht` et `quantite` se somment sur le magasin, le jour et le produit. CA N-1 est la même somme sur mars 2025, pas « l'année dernière en vrac ». Le taux n'est pas une colonne du fait. Il vaudra somme des marges divisée par somme du CA, au niveau affiché. En mars, 35 % sur le réseau.

**Ce qui devient une dimension.** `magasin_id` ouvre le nom et la région. `produit_id` ouvre la famille. `jour` ouvre le mois. Ces textes ne sont pas recopiés sur chaque ticket.

**Ce qui est déjà dans le nom.** CA HT inclut les retours, exclut le personnel et les franchises. Nora ne recocherait pas ces cases. Un filtre de question (mars, l'Ouest) reste dans la page. Un filtre de définition n'en bouge pas.

> [!IMPORTANT]
> Filtre de définition : dans le mart ou la mesure. Filtre de question : magasin, jour, produit, région. Mélanger les deux oblige Nora à réécrire votre travail.

Aucun rapport de revue ne lit `caisse.lignes`. S'il le fait, le modèle n'est pas fini, ou la page l'a contourné.

# La page n'est pas votre étage

Nora vous apporte la question qui revient : CA du mois par magasin, écart à mars 2025, famille qui porte la baisse de l'Ouest. Vous la traduisez en grain et en mesure. Elle ne vous apporte pas la couleur des barres ni la phrase « l'Ouest décroche ». Ces choix sont son métier.

Quand un total de page ne colle pas, l'ordre de recherche est fixe.

1. Le filtre est-il mars, `jour >= 2026-03-01` et `jour < 2026-04-01`, sans manger le 31 ni ajouter avril ?
2. La page utilise-t-elle CA HT, ou une somme qui écarte les négatifs ?
3. `fct_ventes` retrouve-t-il 6 240 000 €, et l'Ouest 1 560 000 € ?
4. Seulement ensuite : la source a-t-elle manqué une nuit que le data engineer doit reprendre ?

Cet ordre évite d'ouvrir Spark parce qu'une page a filtré les montants positifs. La plupart des écarts du lundi naissent entre le mart et le rapport, ou entre le mart et la finance.

# Exercices

## Exercice 1 : La règle dans le titre

Nora a nommé un visuel « CA HT hors retours, Ouest ». Le modèle garde les retours. Elle a posé un filtre de page pour les retirer. La direction croit lire le CA officiel. Que corrigez-vous, et à quel étage ?

<details>
<summary>Voir la solution</summary>

La règle des retours est une définition. Elle est déjà dans `fct_ventes` et dans CA HT. Le titre contredit la mesure : l'Ouest officiel vaut 1 560 000 € avec les retours.

Vous demandez à Nora de retirer le filtre et de renommer le visuel. Un CA avant retours n'existe que si Camille le signe, sous un autre nom, avec un témoin. La page ne porte pas une définition parallèle.

</details>

## Exercice 2 : Où passent les heures

Trois sujets le même matin. Le consumer Kafka a pris une heure. Le mart laisse encore passer des ventes au personnel. Nora veut un graphique en barres pour l'Ouest. Que faites-vous, et que ne faites-vous pas ?

<details>
<summary>Voir la solution</summary>

Le retard déjà rattrapé est un incident du data engineer : vous notez `charge_le`, vous ne reprenez pas le consumer. Le graphique est à Nora, dès que la mesure est la bonne.

Votre temps va au mart : sortir le personnel, vérifier que mars retrouve 6 240 000 €, mettre à jour la description de CA HT. Une heure ici évite douze copies du même filtre.

</details>

## Exercice 3 : Lire la source sans la publier

Mars montre des montants de retour encore positifs dans `caisse.lignes`, et quelques `vente_interne`. Un collègue veut les « nettoyer » dans une copie de la source, pour que la somme brute colle déjà à 6 240 000 €. Que lui répondez-vous ?

<details>
<summary>Voir la solution</summary>

La source reste fidèle à la caisse. Le signe et le périmètre sont des règles du mart, pas un correctif du dépôt. Une copie nettoyée devient une seconde source, sans propriétaire.

`fct_ventes` applique la règle signée : retour négatif, personnel exclu, intégrés seulement. Le témoin se juge là, pas sur une extraction bricolée.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: La chaîne analytique
center: "Votre temps va au mart et au modèle. La caisse et la page ont déjà un propriétaire."
points:
  - icon: layers
    title: Cinq étages
    text: "Source, staging, fct_ventes, mesures, page. Le ticket les traverse dans cet ordre."
  - icon: clock
    title: Avant 7 h
    text: "charge_le est le témoin. Kafka et Spark ne sont pas votre établi du matin."
  - icon: database
    title: Source lue
    text: "ligne_id, montants, magasin, produit. Vous contrôlez le dépôt, vous ne le réécrivez pas."
  - icon: filter
    title: Deux filtres
    text: "Retours et personnel sont dans la mesure. Mars et l'Ouest restent des questions de page."
  - icon: chart
    title: Page de Nora
    text: "Elle commente Marie. Elle ne lit pas caisse.lignes pour inventer un total."
pitfall: "Passer l'après-midi dans Spark alors qu'une page écarte encore les montants négatifs."
remember: "Écrivez la règle une fois, dans le mart ou la mesure. La page pose magasin, jour et produit."
```
