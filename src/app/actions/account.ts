"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  destroyOtherSessions,
  destroySession,
  hashPassword,
  recordFailedAttempt,
  requireUser,
  tooManyAttempts,
  verifyPassword,
} from "@/lib/auth";
import { query, queryOne } from "@/lib/db";
import type { FormState } from "@/components/ui/form";

/** Vérifie le mot de passe actuel, avec la même limitation de tentatives que la connexion. */
async function checkPassword(userId: string, password: string): Promise<string | null> {
  const key = `account:${userId}`;
  if (tooManyAttempts(key)) return "Trop de tentatives. Réessayez dans quelques minutes.";
  const row = await queryOne<{ password_hash: string }>("SELECT password_hash FROM users WHERE id = $1", [userId]);
  if (!row || !(await verifyPassword(password, row.password_hash))) {
    recordFailedAttempt(key);
    return "Mot de passe actuel incorrect.";
  }
  return null;
}

const profileSchema = z.object({
  name: z.string().trim().min(2, "Indiquez un nom d'au moins 2 caractères.").max(80, "Nom trop long."),
  email: z.email("Adresse électronique invalide.").transform((e) => e.trim().toLowerCase()),
});

export async function updateProfileAction(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser("/compte");
  const raw = { name: String(form.get("name") ?? ""), email: String(form.get("email") ?? "").trim() };
  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message, fields: raw };
  const { name, email } = parsed.data;

  if (email !== user.email) {
    const error = await checkPassword(user.id, String(form.get("password") ?? ""));
    if (error) return { error: `${error} Il est requis pour changer d'adresse.`, fields: raw };
    const taken = await queryOne("SELECT 1 FROM users WHERE email = $1 AND id <> $2", [email, user.id]);
    if (taken) return { error: "Cette adresse est déjà utilisée par un autre compte.", fields: raw };
  }

  await query("UPDATE users SET name = $1, email = $2 WHERE id = $3", [name, email, user.id]);
  revalidatePath("/", "layout");
  return { success: "Profil mis à jour.", fields: { name, email } };
}

export async function changePasswordAction(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser("/compte");
  const current = String(form.get("current") ?? "");
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirm") ?? "");

  const error = await checkPassword(user.id, current);
  if (error) return { error };
  if (password.length < 8) return { error: "Le nouveau mot de passe doit contenir au moins 8 caractères." };
  if (password.length > 128) return { error: "Mot de passe trop long." };
  if (password !== confirm) return { error: "Les deux mots de passe ne correspondent pas." };

  await query("UPDATE users SET password_hash = $1 WHERE id = $2", [await hashPassword(password), user.id]);
  await destroyOtherSessions(user.id, true);
  return { success: "Mot de passe modifié. Vos autres sessions ont été déconnectées." };
}

export async function logoutEverywhereAction(): Promise<void> {
  const user = await requireUser("/compte");
  await destroyOtherSessions(user.id, false);
  await destroySession();
  redirect("/connexion");
}

export async function deleteAccountAction(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser("/compte");
  if (String(form.get("confirmation") ?? "").trim().toUpperCase() !== "SUPPRIMER") {
    return { error: "Tapez SUPPRIMER pour confirmer." };
  }
  const error = await checkPassword(user.id, String(form.get("password") ?? ""));
  if (error) return { error };

  // Les sessions, la progression, les évaluations, les révisions et les attestations sont supprimées en cascade.
  await query("DELETE FROM contact_messages WHERE user_id = $1", [user.id]);
  await query("DELETE FROM users WHERE id = $1", [user.id]);
  await destroySession();
  redirect("/");
}
