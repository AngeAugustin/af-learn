import "server-only";

export type Mail = { to: string; subject: string; text: string; replyTo?: string };

/**
 * Envoie un email via l'API HTTP de Resend si RESEND_API_KEY et l'expéditeur sont définis.
 * Expéditeur : MAIL_FROM (« Nom <adresse> »), ou à défaut RESEND_FROM_EMAIL avec SMTP_FROM_NAME.
 * Sans configuration, l'email est affiché dans la console du serveur (pratique en développement).
 * Renvoie true si l'email a été remis au fournisseur ou journalisé.
 */
/** Expéditeur au format « Nom <adresse> », à partir de MAIL_FROM ou de RESEND_FROM_EMAIL et SMTP_FROM_NAME. */
export function mailFrom(env: Record<string, string | undefined> = process.env): string | undefined {
  if (env.MAIL_FROM?.trim()) return env.MAIL_FROM.trim();
  const address = env.RESEND_FROM_EMAIL?.trim();
  if (!address) return undefined;
  const name = env.SMTP_FROM_NAME?.trim().replace(/["<>]/g, "");
  return name ? `${name} <${address}>` : address;
}

export async function sendMail(mail: Mail): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = mailFrom();
  if (!apiKey || !from) {
    if (process.env.NODE_ENV === "production") {
      console.error(`[mail] Envoi impossible (RESEND_API_KEY ou expéditeur manquant) : « ${mail.subject} »`);
      return false;
    }
    console.info(`\n[mail] À : ${mail.to}\n[mail] Objet : ${mail.subject}\n${mail.text}\n`);
    return true;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [mail.to],
        subject: mail.subject,
        text: mail.text,
        ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
      }),
    });
    if (!res.ok) console.error(`[mail] Échec ${res.status} : ${await res.text()}`);
    return res.ok;
  } catch (error) {
    console.error("[mail] Erreur réseau :", (error as Error).message);
    return false;
  }
}
