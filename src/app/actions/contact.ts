"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { getCurrentUser, recordFailedAttempt, tooManyAttempts } from "@/lib/auth";
import { query } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { SITE, isPlaceholder } from "@/lib/site";
import { CONTACT_SUBJECTS } from "@/lib/contact";
import type { FormState } from "@/components/ui/form";

const schema = z.object({
  name: z.string().trim().min(2, "Indiquez votre nom.").max(80, "Nom trop long."),
  email: z.email("Adresse électronique invalide.").transform((e) => e.trim().toLowerCase()),
  subject: z.enum(CONTACT_SUBJECTS, "Choisissez un sujet."),
  message: z
    .string()
    .trim()
    .min(20, "Votre message doit contenir au moins 20 caractères.")
    .max(5000, "Votre message ne doit pas dépasser 5 000 caractères."),
});

export async function contactAction(_prev: FormState, form: FormData): Promise<FormState> {
  const raw = {
    name: String(form.get("name") ?? ""),
    email: String(form.get("email") ?? "").trim(),
    subject: String(form.get("subject") ?? ""),
    message: String(form.get("message") ?? ""),
  };
  // Champ piège invisible : un humain ne le remplit jamais.
  if (String(form.get("website") ?? "")) return { success: "Merci, votre message a bien été envoyé." };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message, fields: raw };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const key = `contact:${ip}`;
  if (tooManyAttempts(key)) {
    return { error: "Vous avez envoyé beaucoup de messages. Réessayez un peu plus tard.", fields: raw };
  }
  recordFailedAttempt(key);

  const { name, email, subject, message } = parsed.data;
  const user = await getCurrentUser();
  await query("INSERT INTO contact_messages (user_id, name, email, subject, message) VALUES ($1, $2, $3, $4, $5)", [
    user?.id ?? null,
    name,
    email,
    subject,
    message,
  ]);

  if (!isPlaceholder(SITE.contactEmail)) {
    await sendMail({
      to: SITE.contactEmail,
      replyTo: email,
      subject: `[Contact ${SITE.name}] ${subject}`,
      text: `De : ${name} <${email}>${user ? ` (compte ${user.id})` : ""}\nSujet : ${subject}\n\n${message}`,
    });
  }
  return { success: "Merci, votre message a bien été envoyé. Nous vous répondrons par email." };
}
