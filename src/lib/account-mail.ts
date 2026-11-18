import "server-only";
import { createEmailVerification } from "./auth";
import { siteOrigin } from "./certificates";
import { renderEmail } from "./email-template";
import { sendMail } from "./mail";
import { SITE } from "./site";

/** Envoie le lien de confirmation d'adresse (24 heures, usage unique). */
export async function sendVerificationEmail(user: { id: string; email: string; name: string }): Promise<boolean> {
  const origin = await siteOrigin();
  const token = await createEmailVerification(user.id);
  const url = `${origin}/confirmer-email?jeton=${encodeURIComponent(token)}`;
  return sendMail({
    to: user.email,
    subject: `Confirmez votre adresse ${SITE.name}`,
    ...renderEmail({
      origin,
      preheader: "Confirmez votre adresse pour pouvoir recevoir une attestation.",
      title: "Confirmez votre adresse électronique",
      greeting: `Bonjour ${user.name},`,
      paragraphs: [
        `Confirmez que cette adresse est bien la vôtre. ${SITE.name} l'exige avant de délivrer une attestation.`,
      ],
      facts: [
        ["Compte", user.email],
        ["Validité", "24 heures, usage unique"],
      ],
      button: { label: "Confirmer mon adresse", url },
      showLink: true,
      note: "Vous n'êtes pas à l'origine de cette demande ? Ignorez cet email.",
    }),
  });
}

/**
 * Quelqu'un a tenté de s'inscrire avec une adresse déjà utilisée.
 * Le message ne dit pas à l'inconnu si le compte existe : seul le titulaire reçoit cet email.
 */
export async function sendExistingAccountEmail(user: { email: string; name: string }): Promise<boolean> {
  const origin = await siteOrigin();
  return sendMail({
    to: user.email,
    subject: `Connexion à votre compte ${SITE.name}`,
    ...renderEmail({
      origin,
      preheader: "Une inscription a été tentée avec votre adresse.",
      title: "Une inscription a été tentée",
      greeting: `Bonjour ${user.name},`,
      paragraphs: [
        `Quelqu'un a essayé de créer un compte ${SITE.name} avec cette adresse. Si c'était vous, connectez-vous avec votre mot de passe actuel.`,
      ],
      button: { label: "Se connecter", url: `${origin}/connexion` },
      note: "Si vous n'êtes pas à l'origine de cette tentative, ignorez cet email. Votre mot de passe n'a pas changé.",
    }),
  });
}
