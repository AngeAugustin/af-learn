---
title: "Le métier de BI Engineer"
description: "Situer Lina entre le dépôt des caisses, le mart et la revue : le livrable est un mart certifié que Nora ne réécrit pas."
duration: 60
objectives:
  - "Situer le BI Engineer entre le chargement des tickets et la page du lundi"
  - "Distinguer Data Engineer, Analytics Engineer et Analyste BI"
  - "Nommer le livrable : fct_ventes et le modèle des mesures"
  - "Garder Kafka, Spark et le récit de la revue hors de votre signature"
---

# Le chiffre que Nora peut rejouer

Vous êtes Lina Costa, BI Engineer de Halte. Quarante-deux magasins intégrés, quatre régions. La direction réseau et les responsables de région veulent les ventes par magasin, et le détail par jour et par produit dès qu'une région décroche. Le témoin de mars 2026 est connu : **6 240 000 €** de CA HT sur le réseau, dont **1 560 000 €** pour Marie, à l'Ouest.

Nora, analyste BI, prépare la revue du lundi à partir de votre couche. Elle ne la redessine pas. Camille Renard possède le sens du CA : ce qui entre, ce qui sort, ce qu'un mot veut dire. Vous possédez le calcul. Le data engineer possède l'arrivée des lignes de caisse. Kafka et Spark s'arrêtent avant vous.

Votre travail est de rendre ce chiffre **rejouable**.

- **Le même grain.** `fct_ventes` a une ligne par ligne de ticket. Magasin, jour et produit sont des clés. Le CA d'un magasin est une somme, pas une seconde table.
- **La même mesure.** « CA HT » vaut 6 240 000 € en mars 2026. Une page qui retire les retours affiche 6 480 000 € et rate le témoin.
- **La même fraîcheur.** Le mart a bougé avant 7 h, heure de Paris, les jours ouvrés. Le témoin est `charge_le`.
- **Le même propriétaire.** Camille pour le sens, vous pour le calcul, Nora pour la page.

> [!IMPORTANT]
> Livrable : le mart certifié et le modèle que Nora ne réécrit pas. Elle pose CA HT. Elle ne recolle pas un filtre de retours dans un visuel.

# Quatre métiers autour du CA

Le contrat se voit à la question que la personne répond quand mars ne tombe pas sur 6 240 000 €.

```diagram
type: compare
title: Quatre contrats pour les ventes Halte
columns:
  - title: Data Engineer
    tone: teal
    items:
      - "Fait arriver caisse.lignes"
      - "Tient Kafka, Spark, le dépôt"
      - "Ne choisit pas le sens du CA"
  - title: Analytics Engineer
    tone: violet
    items:
      - "Transforme le brut en tables testées"
      - "Tient le grain et les clés en SQL"
      - "Ne nomme pas la mesure de la revue"
  - title: BI Engineer
    tone: blue
    items:
      - "Certifie fct_ventes et les sommes"
      - "Publie CA HT dans le modèle"
      - "Ne raconte pas la page de Nora"
  - title: Analyste BI
    tone: rose
    items:
      - "Prépare la revue du lundi"
      - "Filtre, commente, désigne un magasin"
      - "Ne crée pas une formule locale"
```

Le **data engineer** répond : est-ce que `caisse.lignes` est là, complet, fidèle à la caisse ? Le topic et le job Spark sont son incident. S'il manque une nuit, vous ne réécrivez pas le consumer. Vous constatez que la source n'a pas tenu, et Nora présente le dernier jour certifié.

L'**analytics engineer** répond : la table est-elle au grain `ligne_id`, avec des clés uniques et des tests qui échouent bruyamment ? L'outil habituel est le SQL versionné, souvent dbt. Ce chapeau peut être le vôtre le matin. Une table juste que Nora ne sait pas nommer n'est pas encore le chiffre de la revue.

**Vous** répondez : Nora peut-elle poser « CA HT » sans réécrire la jointure, le signe des retours, ni l'exclusion des ventes au personnel ? Vous construisez le mart et la couche sémantique. Le SQL sert le mart. Le modèle sert à ce que la mesure ne soit pas recopiée dans douze fichiers.

**Nora** répond : que doit voir la direction, et quel magasin Marie appelle-t-elle ? Le visuel, l'ordre, le commentaire. Pas la définition. **Camille** tranche le sens si la formule doit changer. Elle n'est pas la consommatrice du lundi. La direction et les responsables de région le sont.

Porter deux chapeaux n'autorise pas à signer à la place des autres. Dites lequel vous tenez dans l'heure qui vient.

```video
url: https://www.youtube.com/watch?v=ZNSdgh1wXLM
title: "What Does an Analytics Engineer Do? (vs Data Engineer & Data Analyst)"
channel: "Maven Analytics"
duration: "2:46"
lang: en
why: "Maven Analytics situe l'analytics engineer entre data engineer et data analyst, le même positionnement que le BI engineer de ce parcours."
```

# Le mart et le modèle

Deux objets. Le premier stocke. Le second nomme.

`fct_ventes` est une ligne de ticket : `ligne_id`, `ticket_id`, `magasin_id`, `produit_id`, `jour`, `charge_le`, `montant_ht_signe`, `cout_ht_signe`, `marge_ht`, `quantite`. Les retours sont déjà négatifs. Les ventes au personnel et les franchises n'y sont pas. Sommer `montant_ht_signe` par magasin, par jour ou par produit donne les ventes que la revue demande. Vous n'avez pas stocké ces totaux à la place des lignes : un magasin-mois figé perdrait le jour.

```sql
SELECT
  magasin_id,
  jour,
  produit_id,
  SUM(montant_ht_signe) AS ca_ht
FROM fct_ventes
WHERE jour >= DATE '2026-03-01'
  AND jour <  DATE '2026-04-01'
GROUP BY magasin_id, jour, produit_id;
```

Le **modèle** est ce que Nora branche. La mesure CA HT pointe vers cette somme. Les dimensions magasin, date et produit portent la région, le jour de semaine, la famille. Le taux de marge n'est pas une colonne : en mars il vaut 2 184 000 / 6 240 000, soit 35 %, calculé après les sommes.

| Objet | Qui le tient | Ce que Nora n'a plus à faire |
|---|---|---|
| `fct_ventes` | Vous | Réécrire le signe des retours |
| Mesure CA HT | Vous, sens avec Camille | Filtrer `montant > 0` pour « faire plus gros » |
| Page du lundi | Nora | Inventer un second total pour la slide |

Certifier, c'est montrer le grain, les quatre mesures (CA, marge, quantité, CA N-1), l'heure de 7 h, le rapprochement finance, et les noms. Le journal finance part de 6 258 000 €, retire 15 000 € de retours datés du 2 avril et 3 000 € de ventes au personnel, et retrouve 6 240 000 €. Au-dessus de 5 000 € ou de 0,5 % d'écart, pas de badge.

> [!WARNING]
> Un modèle que l'analyste réécrit n'est pas un modèle. Douze fichiers vont diverger au premier retour oublié.

# Ce que vous ne signez pas

Le test est une demande, pas un organigramme.

La nuit du chargement a échoué. `caisse.lignes` n'a pas bougé. Votre geste : bloquer la certification, prévenir Nora avant la revue, laisser le data engineer rétablir le dépôt. Vous ne branchez pas un second lecteur Kafka « pour sauver le lundi ». Ce tuyau ne se rapproche pas du témoin.

Nora veut, pour cette semaine seulement, retirer les retours du CA « parce que la direction veut le brut ». Le brut de mars vaut 6 480 000 €. Votre geste : refuser la formule locale. Si Camille accepte un jour une mesure « CA avant retours », elle aura un autre nom et un autre témoin. Elle ne s'appellera pas CA HT.

Une demande de beau tableau, de couleur, de phrase sur l'Ouest : Nora. Une demande qui change le sens (taxe, franchise, personnel) : Camille d'abord, vous ensuite dans le modèle, partout, pas dans une page.

| Demande | Contrat | Votre réponse |
|---|---|---|
| La nuit Kafka n'a pas déposé | Data engineer | Incident, dernier jour certifié |
| Retirer les retours sur une page | Sens, avec Camille | CA HT inchangé, témoin 6 240 000 € |
| Quelle phrase pour l'Ouest | Analyste BI | Nora, sur votre chiffre |
| Relancer le job Spark | Data engineer | Hors de votre pipeline |

# Mars 2026, le témoin

Posez le métier sur les nombres que la suite du parcours rejouera, pas sur un exemple abstrait.

| Repère | Valeur |
|---|---|
| CA HT réseau, mars 2026 | 6 240 000 € |
| Dont retours déjà déduits | 240 000 € sur 6 480 000 € de brut |
| Marge | 2 184 000 €, soit 35 % |
| Quantité | 624 000 |
| CA N-1, mars 2025 | 6 000 000 € |
| Ouest, Marie | 1 560 000 € |

Une ligne du fait n'est pas ce total. C'est un ticket, un magasin, un jour, un produit, un montant signé. La revue somme. Si deux pages affichent deux CA pour mars, vous ne demandez pas à Nora de « corriger le visuel ». Vous ouvrez l'écart. Vous ne certifiez pas tant qu'il n'est pas le reste attendu, zéro, dans la limite de 5 000 € ou 0,5 %.

Votre semaine : lire que la source est arrivée, tenir le mart et les noms, refuser les formules parallèles, laisser à Nora le choix de ce qu'elle raconte. Le chapitre suivant place ces gestes sur la chaîne, de la caisse jusqu'à la page.

# Exercices

## Exercice 1 : Le brut à 6 480 000 €

Nora veut modifier uniquement sa page pour écarter les lignes négatives, « le temps de lundi », parce qu'un directeur a demandé le gros chiffre. Camille n'a pas changé le sens. Que faites-vous avant la revue ?

<details>
<summary>Voir la solution</summary>

Vous refusez la formule locale. CA HT garde les retours négatifs. Mars reste 6 240 000 €. Écarter les négatifs affiche 6 480 000 € et rate le témoin.

Vous le dites à Nora avec les deux nombres. Si un jour le brut devient une vraie mesure, Camille en fixe le sens, vous le publiez sous un autre nom, et toutes les pages suivent. Une slide ne change pas la définition pour un lundi.

</details>

## Exercice 2 : La nuit sans dépôt

À 7 h 05, `charge_le` n'a pas bougé. Le data engineer indique que le job Spark en aval de Kafka n'a pas tourné. Nora propose que vous lisiez le topic pour fabriquer un CA provisoire. Que décidez-vous ?

<details>
<summary>Voir la solution</summary>

Vous ne construisez pas un second pipeline. L'ingestion appartient au data engineer. Vous déclarez le mart non frais, Nora présente le dernier jour certifié, et l'incident porte la source, l'heure, le `charge_le` constaté.

Un extract bricolé depuis Kafka ne retrouve pas 6 240 000 € de façon rejouable. La revue peut attendre. Elle ne mélange pas un jour estimé dans le CA HT.

</details>

## Exercice 3 : La table sans mesure

Une table SQL testée, au grain `ligne_id`, clés uniques, est prête. Un collègue conclut que Nora n'a plus besoin du modèle : « la table est le livrable ». Que manque-t-il pour qu'elle ne réécrive pas le chiffre ?

<details>
<summary>Voir la solution</summary>

La table testée est le contrat de l'analytics engineer. Il manque la mesure nommée CA HT, le rappel que les retours restent, l'exclusion déjà appliquée du personnel et des franchises, les relations vers magasin, date et produit, et la fraîcheur de 7 h.

Sans ce modèle, chaque page recopiera un `SUM` et un filtre. Vous publiez la mesure. Vous retirez le droit de redéfinir mars dans le rapport.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Le métier de BI Engineer
center: "Vous certifiez le mart et la mesure. Nora s'en sert sans réécrire le CA de mars."
points:
  - icon: target
    title: Témoin de mars
    text: "6 240 000 € avec les retours. 6 480 000 € veut dire que les négatifs ont été écartés."
  - icon: database
    title: Ligne de ticket
    text: "fct_ventes, une ligne, un ligne_id. Magasin, jour et produit sont des sommes."
  - icon: layers
    title: Modèle stable
    text: "Le nom CA HT vit dans le modèle. La page ne recolle pas le filtre des retours."
  - icon: server
    title: Hors pipeline
    text: "Kafka, Spark et le dépôt de caisse.lignes restent au data engineer."
  - icon: chart
    title: Page de Nora
    text: "Elle prépare le lundi. Camille tient le sens. Vous tenez le calcul."
pitfall: "Retirer les retours dans une seule page pour afficher 6 480 000 € à la place du témoin."
remember: "Signez fct_ventes et CA HT. Laissez l'ingestion au data engineer et le récit du lundi à Nora."
```
