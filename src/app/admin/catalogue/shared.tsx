import { Eye, EyeOff, Clock } from "lucide-react";
import type { ParcoursRow } from "@/lib/queries";
import { STATUS_LABELS } from "@/lib/admin/catalog";
import { Badge } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { revertAction, setCourseStatusAction } from "./actions";

type Status = ParcoursRow["status"];

export const CATALOG_NOTICES: Record<string, [boolean, string]> = {
  "statut-published": [true, "Parcours disponible : il est visible dans le catalogue et ouvert à tous."],
  "statut-coming_soon": [true, "Parcours annoncé comme bientôt disponible : sa page est visible, son contenu ne l'est pas."],
  "statut-hidden": [true, "Parcours masqué : il n'apparaît plus sur le site. La progression des apprenants est conservée."],
  "statut-invalide": [false, "Statut inconnu."],
  "parcours-vide": [false, "Un parcours sans chapitre ne peut pas être rendu disponible."],
  "ordre-ok": [true, "Ordre du catalogue mis à jour."],
  "fiche-ok": [true, "Fiche du parcours enregistrée."],
  "fiche-invalide": [false, "Vérifiez les champs : titre, accroche, description et niveau sont obligatoires."],
  "module-ok": [true, "Module enregistré."],
  "module-invalide": [false, "Le titre et la description du module sont obligatoires."],
  "chapitre-ok": [true, "Chapitre enregistré."],
  "chapitre-invalide": [false, "Titre, description et durée (en minutes, entre 1 et 1000) sont obligatoires."],
  "section-ok": [true, "Section enregistrée."],
  "section-invalide": [false, "Le titre et le contenu de la section sont obligatoires."],
  "section-dangereuse": [
    false,
    "Contenu refusé : il contient du HTML actif (script, iframe, formulaire, attribut on…, lien javascript:). Placez les exemples de code dans un bloc ``` pour les afficher.",
  ],
  "question-ok": [true, "Question enregistrée. Elle s'applique aux prochaines évaluations, révisions et examens."],
  "question-invalide": [false, "L'énoncé (3 caractères minimum) et l'explication sont obligatoires."],
  "question-options": [false, "Une question doit proposer au moins deux réponses."],
  "question-doublon": [false, "Deux réponses ont le même texte."],
  "question-sans-reponse": [false, "Cochez au moins une bonne réponse."],
  "question-une-reponse": [false, "Une seule bonne réponse est possible : cochez « Plusieurs réponses possibles » ou décochez les autres."],
  restaure: [true, "Élément remis à la version des fichiers."],
  "source-introuvable": [false, "Cet élément n'existe plus dans les fichiers de contenu : impossible de le restaurer."],
  inchange: [true, "Aucune modification à enregistrer."],
  introuvable: [false, "Élément introuvable."],
};

export function StatusBadge({ status }: { status: Status }) {
  const tone = status === "published" ? "success" : status === "hidden" ? "danger" : "neutral";
  return <Badge tone={tone}>{STATUS_LABELS[status]}</Badge>;
}

const ICON = { published: Eye, coming_soon: Clock, hidden: EyeOff };

/** Trois boutons pour changer la disponibilité d'un parcours ; masquer un parcours suivi demande confirmation. */
export function StatusSwitch({ slug, status, learners, back }: { slug: string; status: Status; learners: number; back?: "fiche" }) {
  return (
    <form action={setCourseStatusAction} className="flex flex-wrap rounded-lg border border-border p-0.5" aria-label="Disponibilité">
      <input type="hidden" name="slug" value={slug} />
      {back && <input type="hidden" name="back" value={back} />}
      {(["published", "coming_soon", "hidden"] as const).map((s) => {
        const Icon = ICON[s];
        const active = s === status;
        return active ? (
          <span key={s} aria-current="true" className="inline-flex items-center gap-1.5 rounded-md bg-bg-muted px-2.5 py-1.5 text-xs font-semibold text-fg">
            <Icon className="size-3.5" aria-hidden /> {STATUS_LABELS[s]}
          </span>
        ) : (
          <ConfirmButton
            key={s}
            name="status"
            value={s}
            className="!border-0 !bg-transparent !px-2.5 !py-1.5 text-xs text-fg-muted hover:!bg-bg-muted hover:text-fg"
            message={
              s !== "published" && learners > 0
                ? `${learners} apprenant(s) ont commencé ce parcours. Ils n'y auront plus accès tant qu'il ne sera pas à nouveau disponible (leur progression est conservée). Continuer ?`
                : undefined
            }
          >
            <Icon className="size-3.5" aria-hidden /> {STATUS_LABELS[s]}
          </ConfirmButton>
        );
      })}
    </form>
  );
}

/** Bouton « Revenir à la version des fichiers » d'un élément modifié. */
export function RevertButton({ kind, id, what }: { kind: "parcours" | "modules" | "chapters" | "sections" | "questions"; id: number; what: string }) {
  return (
    <form action={revertAction}>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={id} />
      <ConfirmButton message={`Annuler les modifications de ${what} et revenir à la version des fichiers ?`} className="!px-2.5 !py-1.5 text-xs">
        Revenir à la version des fichiers
      </ConfirmButton>
    </form>
  );
}

export const input = "w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-brand";
export const label = "mb-1 block text-xs font-semibold text-fg-muted";

/**
 * Clé React dérivée du contenu : après un enregistrement ou une restauration, le formulaire est
 * reconstruit et affiche la valeur à jour (un champ non contrôlé garde sinon l'ancienne saisie).
 */
export function keyOf(value: unknown): string {
  const s = JSON.stringify(value);
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}
