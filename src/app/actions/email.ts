"use server";

import { redirect } from "next/navigation";
import { consumeEmailVerifications, findEmailVerification, recordFailedAttempt, requireUser, safeNext, tooManyAttempts } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/account-mail";
import { query } from "@/lib/db";

/** Confirme l'adresse à partir du lien reçu par email. Le jeton ne sert qu'une fois. */
export async function confirmEmailAction(form: FormData): Promise<void> {
  const token = String(form.get("jeton") ?? "");
  const row = await findEmailVerification(token);
  if (!row) redirect("/confirmer-email?etat=invalide");
  await query("UPDATE users SET email_verified_at = COALESCE(email_verified_at, now()) WHERE id = $1", [row.user_id]);
  await consumeEmailVerifications(row.user_id);
  redirect("/compte?email=confirmee");
}

/** Renvoie un lien de confirmation à la personne connectée, avec un plafond d'envois. */
export async function resendVerificationAction(form: FormData): Promise<void> {
  const next = safeNext(form.get("retour"), "/compte");
  const user = await requireUser(next);
  if (user.email_verified_at) redirect(next);
  if (await tooManyAttempts(`verify:${user.id}`, 5)) redirect(`${next}${next.includes("?") ? "&" : "?"}email=attente`);
  await recordFailedAttempt(`verify:${user.id}`);
  await sendVerificationEmail(user);
  redirect(`${next}${next.includes("?") ? "&" : "?"}email=envoyee`);
}
