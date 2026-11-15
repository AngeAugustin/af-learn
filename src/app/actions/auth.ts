"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  clearAttempts,
  clientIp,
  createSession,
  destroySession,
  hashPassword,
  recordFailedAttempt,
  safeNext,
  tooManyAttempts,
  verifyPasswordConstantTime,
} from "@/lib/auth";
import { queryOne } from "@/lib/db";

export type AuthState = { error?: string; fields?: { name?: string; email?: string } };

const registerSchema = z.object({
  name: z.string().trim().min(2, "Indiquez un nom d'au moins 2 caractères.").max(80, "Nom trop long."),
  email: z.email("Adresse électronique invalide.").transform((e) => e.trim().toLowerCase()),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
    .max(128, "Mot de passe trop long."),
});

export async function registerAction(_prev: AuthState, form: FormData): Promise<AuthState> {
  const raw = {
    name: String(form.get("name") ?? ""),
    email: String(form.get("email") ?? "").trim(),
    password: String(form.get("password") ?? ""),
  };
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message, fields: { name: raw.name, email: raw.email } };
  }
  const { name, email, password } = parsed.data;
  // Limite les créations de comptes en série depuis une même adresse IP.
  const ipKey = `register:${clientIp(await headers())}`;
  if (tooManyAttempts(ipKey, 5)) {
    return { error: "Trop d'inscriptions depuis cette connexion. Réessayez dans quelques minutes.", fields: { name, email } };
  }
  recordFailedAttempt(ipKey);
  const existing = await queryOne<{ id: string }>("SELECT id FROM users WHERE email = $1", [email]);
  if (existing) {
    return { error: "Un compte existe déjà avec cette adresse. Connectez-vous.", fields: { name, email } };
  }
  const user = await queryOne<{ id: string }>(
    "INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id",
    [email, name, await hashPassword(password)],
  );
  await createSession(user!.id);
  redirect(safeNext(form.get("suivant"), "/parcours/ai-engineering"));
}

export async function loginAction(_prev: AuthState, form: FormData): Promise<AuthState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Renseignez votre adresse et votre mot de passe.", fields: { email } };
  // Deux compteurs : par adresse (attaque ciblée) et par IP (essais sur de nombreux comptes).
  const ipKey = `login-ip:${clientIp(await headers())}`;
  if (tooManyAttempts(email) || tooManyAttempts(ipKey, 30)) {
    return { error: "Trop de tentatives. Réessayez dans quelques minutes.", fields: { email } };
  }
  const user = await queryOne<{ id: string; password_hash: string; suspended_at: Date | null }>(
    "SELECT id, password_hash, suspended_at FROM users WHERE email = $1",
    [email],
  );
  if (!(await verifyPasswordConstantTime(password, user?.password_hash)) || !user) {
    recordFailedAttempt(email);
    recordFailedAttempt(ipKey);
    return { error: "Adresse ou mot de passe incorrect.", fields: { email } };
  }
  clearAttempts(email);
  if (user.suspended_at) {
    return { error: "Ce compte est suspendu. Écrivez-nous via la page Contact pour en savoir plus.", fields: { email } };
  }
  await createSession(user.id);
  redirect(safeNext(form.get("suivant")));
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}
