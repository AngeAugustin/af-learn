import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { compare, hash } from "bcryptjs";
import { query, queryOne } from "./db";
import { clientIp } from "./request-ip";

export { clientIp };

export const SESSION_COOKIE = "cursus_session";
const SESSION_DAYS = 30;

export type Role = "learner" | "admin";

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  created_at: Date;
  /** Null tant que la personne n'a pas confirmé son adresse. Exigé avant une attestation. */
  email_verified_at: Date | null;
};

export function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return compare(password, passwordHash);
}

// Empreinte factice (coût 12) : comparer contre elle quand le compte n'existe pas
// donne le même temps de réponse et ne révèle pas quelles adresses sont inscrites.
let dummyHash: Promise<string> | undefined;

/** Vérifie un mot de passe contre l'empreinte d'un compte, ou contre une empreinte factice s'il n'existe pas. */
export async function verifyPasswordConstantTime(password: string, passwordHash: string | undefined): Promise<boolean> {
  dummyHash ??= hash("compte-inexistant", 12);
  const ok = await compare(password, passwordHash ?? (await dummyHash));
  return ok && passwordHash !== undefined;
}

function tokenId(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Crée une session et dépose le cookie. Seule l'empreinte du jeton est stockée en base. */
export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 3600 * 1000);
  const store = await cookies();
  // Une éventuelle session précédente de ce navigateur est fermée (pas de fixation de session).
  const previous = store.get(SESSION_COOKIE)?.value;
  if (previous) await query("DELETE FROM sessions WHERE id = $1", [tokenId(previous)]);
  await query("INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)", [tokenId(token), userId, expiresAt]);
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await query("DELETE FROM sessions WHERE id = $1", [tokenId(token)]);
  store.delete(SESSION_COOKIE);
}

/** Supprime toutes les sessions d'un utilisateur (sauf, éventuellement, la session courante). */
export async function destroyOtherSessions(userId: string, keepCurrent: boolean): Promise<void> {
  const token = keepCurrent ? (await cookies()).get(SESSION_COOKIE)?.value : undefined;
  if (token) await query("DELETE FROM sessions WHERE user_id = $1 AND id <> $2", [userId, tokenId(token)]);
  else await query("DELETE FROM sessions WHERE user_id = $1", [userId]);
}

const RESET_MINUTES = 60;

/** Crée un jeton de réinitialisation valable une heure ; seule son empreinte est stockée. */
export async function createPasswordReset(userId: string): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  await query("DELETE FROM password_resets WHERE user_id = $1 AND (used_at IS NOT NULL OR expires_at < now())", [userId]);
  await query("INSERT INTO password_resets (id, user_id, expires_at) VALUES ($1, $2, now() + make_interval(mins => $3))", [
    tokenId(token),
    userId,
    RESET_MINUTES,
  ]);
  return token;
}

/** Utilisateur associé à un jeton de réinitialisation encore valide, ou null. */
export async function findPasswordReset(token: string): Promise<{ user_id: string; email: string } | null> {
  if (!token) return null;
  return queryOne(
    `SELECT r.user_id, u.email FROM password_resets r JOIN users u ON u.id = r.user_id
     WHERE r.id = $1 AND r.used_at IS NULL AND r.expires_at > now()`,
    [tokenId(token)],
  );
}

/** Invalide tous les jetons de réinitialisation encore ouverts de l'utilisateur. */
export async function consumePasswordResets(userId: string): Promise<void> {
  await query("UPDATE password_resets SET used_at = now() WHERE user_id = $1 AND used_at IS NULL", [userId]);
}

const VERIFY_HOURS = 24;

/** Crée un jeton de confirmation d'adresse, valable 24 heures. Seule son empreinte est stockée. */
export async function createEmailVerification(userId: string): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  await query("DELETE FROM email_verifications WHERE user_id = $1 AND (used_at IS NOT NULL OR expires_at < now())", [userId]);
  await query("INSERT INTO email_verifications (id, user_id, expires_at) VALUES ($1, $2, now() + make_interval(hours => $3))", [
    tokenId(token),
    userId,
    VERIFY_HOURS,
  ]);
  return token;
}

/** Utilisateur associé à un jeton de confirmation encore valide, ou null. */
export async function findEmailVerification(token: string): Promise<{ user_id: string; email: string } | null> {
  if (!token) return null;
  return queryOne(
    `SELECT v.user_id, u.email FROM email_verifications v JOIN users u ON u.id = v.user_id
     WHERE v.id = $1 AND v.used_at IS NULL AND v.expires_at > now()`,
    [tokenId(token)],
  );
}

/** Invalide les confirmations d'adresse encore ouvertes, une fois l'adresse confirmée. */
export async function consumeEmailVerifications(userId: string): Promise<void> {
  await query("UPDATE email_verifications SET used_at = now() WHERE user_id = $1 AND used_at IS NULL", [userId]);
}

/**
 * Utilisateur connecté, ou null. Mis en cache pour la durée d'une requête.
 * Un compte suspendu est traité comme déconnecté. La dernière activité est notée
 * au plus une fois toutes les 5 minutes pour ne pas écrire à chaque requête.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const row = await queryOne<User & { stale: boolean }>(
    `SELECT u.id, u.email, u.name, u.role, u.created_at, u.email_verified_at,
            (u.last_seen_at IS NULL OR u.last_seen_at < now() - interval '5 minutes') AS stale
     FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.id = $1 AND s.expires_at > now() AND u.suspended_at IS NULL`,
    [tokenId(token)],
  );
  if (!row) return null;
  const { stale, ...user } = row;
  if (stale) await query("UPDATE users SET last_seen_at = now() WHERE id = $1", [user.id]).catch(() => undefined);
  return user;
});

/** Exige un administrateur : un visiteur non connecté va à la connexion, un apprenant reçoit une 404. */
export async function requireAdmin(next = "/admin"): Promise<User> {
  const user = await requireUser(next);
  if (user.role !== "admin") notFound();
  return user;
}

/** Exige un utilisateur connecté ; sinon redirige vers la connexion puis vers `next`. */
export async function requireUser(next: string): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect(`/connexion?suivant=${encodeURIComponent(next)}`);
  return user;
}

/** N'accepte que des redirections internes, pour éviter les redirections ouvertes. */
export function safeNext(next: unknown, fallback = "/tableau-de-bord"): string {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\")
    ? next
    : fallback;
}

// Plafond de tentatives partagé (toutes les instances lisent la même table).
const MAX_ATTEMPTS = 10;
const WINDOW = "15 minutes";

/** Vrai si cette clé a déjà atteint `max` essais pendant les 15 dernières minutes. */
export async function tooManyAttempts(key: string, max = MAX_ATTEMPTS): Promise<boolean> {
  const row = await queryOne<{ n: number }>(
    "SELECT count(*)::int AS n FROM rate_limit_hits WHERE bucket = $1 AND created_at > now() - $2::interval",
    [key, WINDOW],
  );
  return (row?.n ?? 0) >= max;
}

/** Enregistre un essai et, de temps en temps, efface les essais plus vieux que la fenêtre. */
export async function recordFailedAttempt(key: string): Promise<void> {
  await query("INSERT INTO rate_limit_hits (bucket) VALUES ($1)", [key]);
  if (Math.random() < 0.02) await query("DELETE FROM rate_limit_hits WHERE created_at < now() - interval '15 minutes'");
}

export async function clearAttempts(key: string): Promise<void> {
  await query("DELETE FROM rate_limit_hits WHERE bucket = $1", [key]);
}
