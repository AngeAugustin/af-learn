---
title: Server Actions et mutations
description: Modifier des données depuis le serveur avec les Server Actions, traiter les formulaires, valider les entrées, revalider le cache, gérer les erreurs et afficher des mises à jour optimistes.
duration: 60
objectives:
  - Écrire une Server Action pour modifier des données
  - Relier une Server Action à un formulaire
  - Valider les entrées côté serveur
  - Revalider le cache et retourner des erreurs
  - Rendre l'interface réactive avec une mise à jour optimiste (useOptimistic)
---

# Lire, c'est bien ; modifier, c'est mieux

Le chapitre précédent chargeait des données (lecture). Une vraie application doit aussi **créer, modifier et supprimer** : ce sont les **mutations**. Dans l'App Router, on les réalise avec les **Server Actions** : des fonctions qui s'exécutent **sur le serveur**, appelées depuis l'interface, sans écrire d'API à la main.

```tsx
// app/actions.ts
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function creerTache(donnees: FormData) {
  const texte = donnees.get("texte") as string;
  await db.tache.create({ data: { texte, faite: false } });
  revalidatePath("/taches");   // rafraîchir la liste affichée
}
```

La directive **`"use server"`** marque une fonction (ou tout un fichier) comme Server Action. Son code reste **sur le serveur** : elle peut accéder à la base de données et aux secrets en toute sécurité, même appelée depuis un composant client.

# Relier une Server Action à un formulaire

On passe directement la Server Action à l'attribut `action` d'un `<form>` :

```tsx
// app/taches/page.tsx - composant serveur
import { creerTache } from "@/app/actions";
import { db } from "@/lib/db";

export default async function PageTaches() {
  const taches = await db.tache.findMany();
  return (
    <div>
      <form action={creerTache}>
        <input name="texte" required />
        <button type="submit">Ajouter</button>
      </form>
      <ul>
        {taches.map((t) => (
          <li key={t.id}>{t.texte}</li>
        ))}
      </ul>
    </div>
  );
}
```

À la soumission, Next.js envoie les données du formulaire à la Server Action, qui s'exécute sur le serveur. Le formulaire fonctionne **même sans JavaScript** (amélioration progressive) : un vrai avantage de robustesse.

# Valider les entrées

> [!IMPORTANT]
> Une Server Action est un **point d'entrée public** : n'importe qui peut l'appeler avec n'importe quelles données. Il faut **toujours valider** les entrées côté serveur et **vérifier les droits** de l'utilisateur, comme pour une API (rappels des parcours de sécurité). La validation du formulaire dans le navigateur est un confort, pas une protection.

Avec **Zod** (chapitre TypeScript) :

```tsx
"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const Schema = z.object({
  texte: z.string().min(1, "Le texte est requis").max(200),
});

export async function creerTache(_etatPrecedent: unknown, donnees: FormData) {
  const resultat = Schema.safeParse({ texte: donnees.get("texte") });
  if (!resultat.success) {
    return { erreur: resultat.error.issues[0].message };   // renvoyer l'erreur à l'UI
  }
  // vérifier ici l'authentification et les droits de l'utilisateur
  await db.tache.create({ data: { texte: resultat.data.texte, faite: false } });
  revalidatePath("/taches");
  return { succes: true };
}
```

# Revalider le cache

Après une mutation, les données affichées sont **périmées**. On indique à Next.js de les rafraîchir :

- **`revalidatePath("/taches")`** : régénère une page précise ;
- **`revalidateTag("taches")`** : régénère tout ce qui est associé à une étiquette de cache ;
- **`redirect("/taches")`** : rediriger après l'action (par exemple après création).

Sans revalidation, l'utilisateur verrait l'ancienne liste jusqu'au prochain chargement complet.

# Afficher l'état et les erreurs

Pour afficher un retour (chargement, message d'erreur), on utilise des hooks côté client dans un composant marqué `"use client"` :

```tsx
"use client";
import { useActionState } from "react";
import { creerTache } from "@/app/actions";

export function FormulaireTache() {
  const [etat, action, enCours] = useActionState(creerTache, null);
  return (
    <form action={action}>
      <input name="texte" required />
      <button type="submit" disabled={enCours}>
        {enCours ? "Ajout…" : "Ajouter"}
      </button>
      {etat?.erreur && <p className="erreur">{etat.erreur}</p>}
    </form>
  );
}
```

`useActionState` relie le formulaire à la Server Action, expose l'**état retourné** (succès ou erreur), et un indicateur `enCours` pour désactiver le bouton pendant l'envoi.

## La mise à jour optimiste

Pour une action fréquente et presque toujours réussie (cocher une tâche, aimer un message), attendre la réponse du serveur donne une interface lente. La **mise à jour optimiste** affiche **immédiatement** le résultat attendu, puis l'état réel une fois la Server Action terminée ; en cas d'échec, l'affichage revient automatiquement à l'état précédent.

```tsx
"use client";
import { useOptimistic, startTransition } from "react";
import { basculerTache } from "@/app/actions";

export function ListeTaches({ taches }: { taches: { id: string; texte: string; faite: boolean }[] }) {
  const [tachesAffichees, basculerOptimiste] = useOptimistic(
    taches,
    (etat, id: string) => etat.map((t) => (t.id === id ? { ...t, faite: !t.faite } : t)),
  );

  return (
    <ul>
      {tachesAffichees.map((t) => (
        <li key={t.id}>
          <label>
            <input
              type="checkbox"
              checked={t.faite}
              onChange={() =>
                startTransition(async () => {
                  basculerOptimiste(t.id); // affichage immédiat
                  await basculerTache(t.id); // la Server Action revalide la liste
                })
              }
            />
            {t.texte}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

> [!TIP]
> Réservez l'optimisme aux actions **réversibles** et à fort taux de réussite. Pour un paiement ou une suppression définitive, affichez plutôt un état « en cours » et attendez la confirmation du serveur.

> [!NOTE]
> Les Server Actions sont une fonctionnalité récente et puissante, mais pas obligatoire : on peut aussi créer des **routes d'API** (`route.ts`) pour les mutations, notamment quand l'API doit être appelée par d'autres clients (application mobile, service tiers). Le module backend détaille les routes d'API.

# Exercices

## Exercice 1 : Une Server Action de suppression

Écrivez une Server Action `supprimerTache(id: number)` qui supprime une tâche et rafraîchit la page `/taches`.

<details>
<summary>Voir la solution</summary>

```tsx
"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function supprimerTache(id: number) {
  // vérifier d'abord que l'utilisateur a le droit de supprimer CETTE tâche
  await db.tache.delete({ where: { id } });
  revalidatePath("/taches");
}
```

On n'oublie pas la vérification des droits avant la suppression.

</details>

## Exercice 2 : La validation oubliée

Une Server Action fait `await db.user.update({ where: { id }, data: donnees })` avec toutes les données du formulaire. Quels risques ?

<details>
<summary>Voir la solution</summary>

Deux risques majeurs (vus dans le parcours sécurité) :

1. **Affectation de masse** : le client peut envoyer des champs non prévus (`role: "admin"`, `verifie: true`) qui seront copiés dans l'objet. Il faut **valider** avec un schéma qui n'autorise que les champs modifiables.
2. **Contrôle d'accès** : rien ne vérifie que l'utilisateur a le droit de modifier **ce** compte (`id`). Il faut vérifier l'authentification et que la ressource lui appartient.

Une Server Action doit être traitée comme un point d'entrée public : valider et autoriser systématiquement.

</details>

## Exercice 3 : Pourquoi revalider ?

Après l'ajout d'une tâche via une Server Action, la nouvelle tâche n'apparaît pas tant qu'on ne recharge pas la page. Pourquoi, et comment corriger ?

<details>
<summary>Voir la solution</summary>

La liste a été rendue (sur le serveur) **avant** la mutation ; elle est mise en cache et n'est pas automatiquement régénérée. Il faut appeler **`revalidatePath("/taches")`** (ou `revalidateTag`) à la fin de la Server Action : Next.js régénère alors la page avec les données à jour, et la nouvelle tâche apparaît immédiatement.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Server Actions et mutations
center: Modifier les données sur le serveur depuis l'interface, en validant tout et en rafraîchissant le cache.
points:
  - icon: server
    title: use server
    text: Fonctions exécutées sur le serveur, appelées depuis l'UI, sans API à écrire.
  - icon: check
    title: Formulaires
    text: Passées à l'attribut action d'un form ; fonctionnent même sans JavaScript.
  - icon: shield
    title: Valider et autoriser
    text: "Point d'entrée public : valider les entrées (Zod) et vérifier les droits, toujours."
  - icon: loop
    title: Revalider
    text: revalidatePath ou revalidateTag après la mutation, sinon données périmées.
  - icon: alert
    title: État et erreurs
    text: useActionState pour l'état retourné et l'indicateur en cours, côté client.
  - icon: zap
    title: Optimiste
    text: useOptimistic affiche le résultat tout de suite, annulé en cas d'échec.
pitfall: Traiter une Server Action comme du code privé et oublier de valider les entrées et les droits.
remember: Une Server Action est aussi exposée qu'une API ; validez les entrées et vérifiez les droits côté serveur.
```
