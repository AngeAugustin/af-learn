import "server-only";
import { query } from "../db";
import type { User } from "../auth";

/** Libellés lisibles des actions du journal. */
export const AUDIT_LABELS: Record<string, string> = {
  "user.update": "Profil modifié",
  "user.reset_link": "Lien de réinitialisation envoyé",
  "user.suspend": "Compte suspendu",
  "user.reactivate": "Compte réactivé",
  "user.logout_all": "Sessions fermées",
  "user.reset_chapter": "Progression d'un chapitre réinitialisée",
  "user.reset_course": "Progression d'un parcours réinitialisée",
  "user.export": "Données exportées",
  "user.delete": "Compte supprimé",
  "users.export_csv": "Liste des apprenants exportée",
  "certificate.revoke": "Attestation révoquée",
  "certificate.restore": "Attestation rétablie",
  "admin.grant": "Droits d'administration accordés",
  "admin.revoke": "Droits d'administration retirés",
  "course.status": "Disponibilité d'un parcours modifiée",
  "course.update": "Fiche d'un parcours modifiée",
  "course.reorder": "Ordre du catalogue modifié",
  "course.revert": "Parcours remis à la version des fichiers",
  "module.update": "Module modifié",
  "chapter.update": "Chapitre modifié",
  "section.update": "Section modifiée",
  "question.update": "Question d'évaluation modifiée",
  "content.revert": "Contenu remis à la version des fichiers",
};

export async function audit(
  actor: User,
  action: string,
  target?: { id: string | null; label: string | null } | null,
  details: Record<string, unknown> = {},
): Promise<void> {
  await query(
    `INSERT INTO audit_log (actor_id, actor_email, action, target_user_id, target_label, details)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [actor.id, actor.email, action, target?.id ?? null, target?.label ?? null, JSON.stringify(details)],
  );
}

export type AuditRow = {
  id: number;
  actor_email: string;
  action: string;
  target_user_id: string | null;
  target_label: string | null;
  details: Record<string, unknown>;
  created_at: Date;
};

export function listAudit(opts: { userId?: string; limit?: number; offset?: number } = {}) {
  const params: unknown[] = [];
  let where = "";
  if (opts.userId) {
    params.push(opts.userId);
    where = "WHERE target_user_id = $1";
  }
  params.push(opts.limit ?? 50, opts.offset ?? 0);
  return query<AuditRow & { total: number }>(
    `SELECT *, count(*) OVER ()::int AS total FROM audit_log ${where}
     ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );
}
