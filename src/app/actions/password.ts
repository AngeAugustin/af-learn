"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  clientIp,
  consumePasswordResets,
  createPasswordReset,
  createSession,
  destroyOtherSessions,
  findPasswordReset,
  hashPassword,
  recordFailedAttempt,
  tooManyAttempts,
} from "@/lib/auth";
import { query, queryOne } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { SITE } from "@/lib/site";
import type { FormState } from "@/components/ui/form";

const SENT =
  "Si un compte existe avec cette adresse, vous allez recevoir un email avec un lien de réinitialisation. Pensez à vérifier vos indésirables.";

/** URL publique du site. En production, seule APP_URL fait foi (l'en-tête Host peut être falsifié). */
async function baseUrl(): Promise<string> {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");
  if (process.env.NODE_ENV === "production") {
    console.error("[mail] APP_URL n'est pas définie : les liens envoyés par email risquent d'être faux.");
    return SITE.url;
  }
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function requestResetAction(_prev: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!z.email().safeParse(email).success) return { error: "Adresse électronique invalide.", fields: { email } };

  const key = `reset:${email}`;
  const ipKey = `reset-ip:${clientIp(await headers())}`;
  if (tooManyAttempts(key, 5) || tooManyAttempts(ipKey, 20)) return { error: "Trop de demandes pour cette adresse. Réessayez dans quelques minutes.", fields: { email } };
  recordFailedAttempt(key);
  recordFailedAttempt(ipKey);

  // Même réponse que le compte existe ou non, pour ne pas révéler les adresses inscrites.
  const user = await queryOne<{ id: string; name: string }>("SELECT id, name FROM users WHERE email = $1", [email]);
  if (user) {
    const token = await createPasswordReset(user.id);
    const url = `${await baseUrl()}/reinitialiser-mot-de-passe?jeton=${encodeURIComponent(token)}`;
    await sendMail({
      to: email,
      subject: `Réinitialiser votre mot de passe ${SITE.name}`,
      text: [
        `Bonjour ${user.name},`,
        "",
        `Vous avez demandé à réinitialiser votre mot de passe ${SITE.name}. Ouvrez ce lien pour en choisir un nouveau (valable une heure) :`,
        "",
        url,
        "",
        "Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email : votre mot de passe reste inchangé.",
      ].join("\n"),
    });
  }
  return { success: SENT };
}

const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
  .max(128, "Mot de passe trop long.");

export async function resetPasswordAction(_prev: FormState, form: FormData): Promise<FormState> {
  const token = String(form.get("jeton") ?? "");
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirm") ?? "");

  const reset = await findPasswordReset(token);
  if (!reset) return { error: "Ce lien a expiré ou a déjà été utilisé. Faites une nouvelle demande." };

  const parsed = passwordSchema.safeParse(password);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  if (password !== confirm) return { error: "Les deux mots de passe ne correspondent pas." };

  await query("UPDATE users SET password_hash = $1 WHERE id = $2", [await hashPassword(password), reset.user_id]);
  await consumePasswordResets(reset.user_id);
  // Toutes les sessions ouvertes ailleurs sont fermées, puis on reconnecte l'utilisateur ici.
  await destroyOtherSessions(reset.user_id, false);
  await createSession(reset.user_id);
  redirect("/compte?mot-de-passe=modifie");
}
