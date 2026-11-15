"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createPasswordReset, requireAdmin, type User } from "@/lib/auth";
import { query, queryOne, transaction } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { SITE } from "@/lib/site";
import { siteOrigin } from "@/lib/certificates";
import { audit } from "@/lib/admin/audit";

/**
 * Actions du back office. Chacune revérifie le rôle administrateur côté serveur
 * (une action serveur est un point d'entrée HTTP à part entière) et laisse une trace dans le journal.
 */

type Target = { id: string; name: string; email: string; role: string; suspended_at: Date | null };

async function loadTarget(form: FormData): Promise<{ admin: User; target: Target }> {
  const admin = await requireAdmin();
  const id = String(form.get("userId") ?? "");
  const target = /^[0-9a-f-]{36}$/i.test(id)
    ? await queryOne<Target>("SELECT id, name, email, role, suspended_at FROM users WHERE id = $1", [id])
    : null;
  if (!target) redirect("/admin/apprenants?notice=introuvable");
  return { admin, target };
}

function back(target: { id: string }, notice: string): never {
  revalidatePath(`/admin/apprenants/${target.id}`);
  redirect(`/admin/apprenants/${target.id}?notice=${notice}`);
}

const label = (t: Target) => `${t.name} <${t.email}>`;

/**
 * Un autre administrateur ne peut pas voir ses identifiants modifiés depuis le back office :
 * changer son adresse puis lui envoyer un lien de réinitialisation permettrait de prendre son compte.
 * Les comptes administrateurs se gèrent depuis leur propre page Compte ou en ligne de commande.
 */
function protectOtherAdmin(admin: User, target: Target): void {
  if (target.role === "admin" && target.id !== admin.id) back(target, "admin-protege");
}

const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().transform((e) => e.trim().toLowerCase()),
});

export async function updateProfileAction(form: FormData): Promise<void> {
  const { admin, target } = await loadTarget(form);
  const parsed = profileSchema.safeParse({ name: form.get("name"), email: String(form.get("email") ?? "").trim() });
  if (!parsed.success) back(target, "profil-invalide");
  const { name, email } = parsed.data;
  if (email !== target.email) {
    protectOtherAdmin(admin, target);
    const taken = await queryOne("SELECT 1 FROM users WHERE email = $1 AND id <> $2", [email, target.id]);
    if (taken) back(target, "email-pris");
  }
  await query("UPDATE users SET name = $1, email = $2 WHERE id = $3", [name, email, target.id]);
  const changes: Record<string, unknown> = {};
  if (name !== target.name) changes.name = { avant: target.name, apres: name };
  if (email !== target.email) changes.email = { avant: target.email, apres: email };
  await audit(admin, "user.update", { id: target.id, label: `${name} <${email}>` }, changes);
  back(target, "profil-ok");
}

export async function sendResetLinkAction(form: FormData): Promise<void> {
  const { admin, target } = await loadTarget(form);
  protectOtherAdmin(admin, target);
  const token = await createPasswordReset(target.id);
  const url = `${await siteOrigin()}/reinitialiser-mot-de-passe?jeton=${encodeURIComponent(token)}`;
  const sent = await sendMail({
    to: target.email,
    subject: `Choisir un nouveau mot de passe ${SITE.name}`,
    text: [
      `Bonjour ${target.name},`,
      "",
      `L'équipe ${SITE.name} vous envoie un lien pour choisir un nouveau mot de passe (valable une heure) :`,
      "",
      url,
      "",
      "Si vous n'avez rien demandé, ignorez cet email : votre mot de passe actuel reste valable.",
    ].join("\n"),
  });
  await audit(admin, "user.reset_link", { id: target.id, label: label(target) }, { envoye: sent });
  back(target, sent ? "lien-envoye" : "lien-echec");
}

export async function setSuspendedAction(form: FormData): Promise<void> {
  const { admin, target } = await loadTarget(form);
  const suspend = form.get("suspend") === "1";
  if (suspend && target.id === admin.id) back(target, "pas-soi-meme");
  if (suspend && target.role === "admin") back(target, "admin-protege");
  const reason = String(form.get("reason") ?? "").trim().slice(0, 300);
  if (suspend) {
    await query("UPDATE users SET suspended_at = now() WHERE id = $1", [target.id]);
    await query("DELETE FROM sessions WHERE user_id = $1", [target.id]);
  } else {
    await query("UPDATE users SET suspended_at = NULL WHERE id = $1", [target.id]);
  }
  await audit(admin, suspend ? "user.suspend" : "user.reactivate", { id: target.id, label: label(target) }, reason ? { motif: reason } : {});
  back(target, suspend ? "suspendu" : "reactive");
}

export async function logoutAllAction(form: FormData): Promise<void> {
  const { admin, target } = await loadTarget(form);
  if (target.id === admin.id) back(target, "pas-soi-meme");
  protectOtherAdmin(admin, target);
  const rows = await query("DELETE FROM sessions WHERE user_id = $1 RETURNING id", [target.id]);
  await audit(admin, "user.logout_all", { id: target.id, label: label(target) }, { sessions: rows.length });
  back(target, "sessions-fermees");
}

/** Efface lectures, évaluations et cartes de révision d'un chapitre ou de tout un parcours. */
export async function resetProgressAction(form: FormData): Promise<void> {
  const { admin, target } = await loadTarget(form);
  const scope = String(form.get("scope") ?? "");
  const match = /^(chapter|course):(\d+)$/.exec(scope);
  if (!match) back(target, "portee-invalide");
  const [, kind, rawId] = match;
  const id = Number(rawId);
  const chapterFilter =
    kind === "chapter" ? "c.id = $2" : "c.module_id IN (SELECT id FROM modules WHERE parcours_id = $2)";
  const info =
    kind === "chapter"
      ? await queryOne<{ title: string }>("SELECT title FROM chapters WHERE id = $1", [id])
      : await queryOne<{ title: string }>("SELECT title FROM parcours WHERE id = $1", [id]);
  if (!info) back(target, "portee-invalide");

  const counts = await transaction(async (db) => {
    const sections = await db.query(
      `DELETE FROM section_progress WHERE user_id = $1 AND section_id IN (
         SELECT s.id FROM sections s JOIN chapters c ON c.id = s.chapter_id WHERE ${chapterFilter})`,
      [target.id, id],
    );
    const quizzes = await db.query(
      `DELETE FROM quiz_attempts WHERE user_id = $1 AND chapter_id IN (SELECT c.id FROM chapters c WHERE ${chapterFilter})`,
      [target.id, id],
    );
    const cards = await db.query(
      `DELETE FROM review_cards WHERE user_id = $1 AND question_id IN (
         SELECT q.id FROM questions q JOIN chapters c ON c.id = q.chapter_id WHERE ${chapterFilter})`,
      [target.id, id],
    );
    let exams = 0;
    if (kind === "course") {
      exams = (await db.query("DELETE FROM exam_attempts WHERE user_id = $1 AND parcours_id = $2", [target.id, id])).rowCount ?? 0;
    }
    return { sections: sections.rowCount, evaluations: quizzes.rowCount, cartes: cards.rowCount, examens: exams };
  });
  await audit(admin, kind === "chapter" ? "user.reset_chapter" : "user.reset_course", { id: target.id, label: label(target) }, {
    [kind === "chapter" ? "chapitre" : "parcours"]: info.title,
    ...counts,
  });
  back(target, "progression-effacee");
}

export async function setCertificateRevokedAction(form: FormData): Promise<void> {
  const { admin, target } = await loadTarget(form);
  const code = String(form.get("code") ?? "");
  const revoke = form.get("revoke") === "1";
  const reason = String(form.get("reason") ?? "").trim().slice(0, 300);
  if (revoke && !reason) back(target, "motif-requis");
  const rows = revoke
    ? await query("UPDATE certificates SET revoked_at = now(), revoked_reason = $3 WHERE code = $1 AND user_id = $2 RETURNING code", [
        code,
        target.id,
        reason,
      ])
    : await query("UPDATE certificates SET revoked_at = NULL, revoked_reason = NULL WHERE code = $1 AND user_id = $2 RETURNING code", [
        code,
        target.id,
      ]);
  if (!rows.length) back(target, "attestation-introuvable");
  await audit(admin, revoke ? "certificate.revoke" : "certificate.restore", { id: target.id, label: label(target) }, {
    code,
    ...(revoke ? { motif: reason } : {}),
  });
  back(target, revoke ? "attestation-revoquee" : "attestation-retablie");
}

/** Effacement complet (droit à l'effacement) : le compte et tout ce qui en dépend. */
export async function deleteUserAction(form: FormData): Promise<void> {
  const { admin, target } = await loadTarget(form);
  if (target.id === admin.id) back(target, "pas-soi-meme");
  if (target.role === "admin") back(target, "admin-protege");
  const confirm = String(form.get("confirm") ?? "").trim().toLowerCase();
  if (confirm !== target.email) back(target, "confirmation-incorrecte");

  await transaction(async (db) => {
    await db.query("DELETE FROM contact_messages WHERE user_id = $1 OR lower(email) = $2", [target.id, target.email]);
    await db.query("DELETE FROM users WHERE id = $1", [target.id]);
    // Le journal garde la trace de l'action, sans les données personnelles de la personne effacée.
    await db.query("UPDATE audit_log SET target_label = 'Compte supprimé', details = '{}'::jsonb WHERE target_user_id = $1", [target.id]);
  });
  await audit(admin, "user.delete", { id: target.id, label: "Compte supprimé" });
  revalidatePath("/admin/apprenants");
  redirect("/admin/apprenants?notice=compte-supprime");
}

/* ---------- Administrateurs ---------- */

export async function grantAdminAction(form: FormData): Promise<void> {
  const admin = await requireAdmin();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const user = await queryOne<Target>("SELECT id, name, email, role, suspended_at FROM users WHERE email = $1", [email]);
  if (!user) redirect("/admin/admins?notice=introuvable");
  if (user.suspended_at) redirect("/admin/admins?notice=suspendu");
  if (user.role === "admin") redirect("/admin/admins?notice=deja-admin");
  await query("UPDATE users SET role = 'admin' WHERE id = $1", [user.id]);
  await audit(admin, "admin.grant", { id: user.id, label: label(user) });
  revalidatePath("/admin/admins");
  redirect("/admin/admins?notice=ajoute");
}

export async function revokeAdminAction(form: FormData): Promise<void> {
  const admin = await requireAdmin();
  const id = String(form.get("userId") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect("/admin/admins?notice=introuvable");
  if (id === admin.id) redirect("/admin/admins?notice=pas-soi-meme");
  const user = await queryOne<Target>("SELECT id, name, email, role, suspended_at FROM users WHERE id = $1 AND role = 'admin'", [id]);
  if (!user) redirect("/admin/admins?notice=introuvable");
  const count = await queryOne<{ n: number }>("SELECT count(*)::int AS n FROM users WHERE role = 'admin'");
  if ((count?.n ?? 0) <= 1) redirect("/admin/admins?notice=dernier");
  await query("UPDATE users SET role = 'learner' WHERE id = $1", [user.id]);
  await audit(admin, "admin.revoke", { id: user.id, label: label(user) });
  revalidatePath("/admin/admins");
  redirect("/admin/admins?notice=retire");
}
