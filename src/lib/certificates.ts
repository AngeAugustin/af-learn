import "server-only";
import { SITE } from "./site";
import { headers } from "next/headers";
import QRCode from "qrcode";
import { query, queryOne } from "./db";
import { generateCertificateCode } from "./certificate-code";
import type { CourseView } from "./queries";

export type CertificateRow = {
  code: string;
  user_id: string;
  parcours_id: number;
  holder_name: string;
  module_count: number;
  chapter_count: number;
  minutes: number;
  final_score: number;
  average_score: number;
  issued_at: Date;
  revoked_at: Date | null;
  revoked_reason: string | null;
  email_confirmed: boolean;
};

export type CertificateWithParcours = CertificateRow & {
  parcours_slug: string;
  parcours_title: string;
  parcours_level: string;
  outcomes: string[];
};

const SELECT_WITH_PARCOURS = `SELECT c.*, p.slug AS parcours_slug, p.title AS parcours_title, p.level AS parcours_level, p.outcomes
  FROM certificates c JOIN parcours p ON p.id = c.parcours_id`;

/**
 * Renvoie l'attestation de l'apprenant pour ce parcours, en la délivrant au premier affichage.
 * Les chiffres sont figés à ce moment ; la date est celle de la première réussite de l'examen final.
 */
export async function issueCertificate(
  user: { id: string; name: string },
  course: CourseView,
  final: { best: number; first_pass: Date | null },
): Promise<CertificateWithParcours> {
  const owner = await queryOne<{ email_verified_at: Date | null }>("SELECT email_verified_at FROM users WHERE id = $1", [user.id]);
  if (!owner?.email_verified_at) throw new Error("Adresse électronique non confirmée.");
  const { parcours, chapters, modules, totals } = course;
  const average = chapters.length ? Math.round(chapters.reduce((n, c) => n + (c.bestScore ?? 0), 0) / chapters.length) : 0;
  // Quelques essais en cas (très improbable) de collision de code
  for (let attempt = 0; attempt < 5; attempt++) {
    const rows = await query<{ code: string }>(
      `INSERT INTO certificates (code, user_id, parcours_id, holder_name, module_count, chapter_count, minutes, final_score, average_score, issued_at, email_confirmed)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
       ON CONFLICT DO NOTHING RETURNING code`,
      [
        generateCertificateCode(parcours.slug),
        user.id,
        parcours.id,
        user.name,
        modules.length,
        totals.chapters,
        totals.minutes,
        final.best,
        average,
        final.first_pass ?? new Date(),
      ],
    );
    const existing = await queryOne<CertificateWithParcours>(`${SELECT_WITH_PARCOURS} WHERE c.user_id = $1 AND c.parcours_id = $2`, [
      user.id,
      parcours.id,
    ]);
    if (existing) return existing;
    if (rows.length) break;
  }
  throw new Error("Impossible de délivrer l'attestation.");
}

export function getCertificateByCode(code: string) {
  return queryOne<CertificateWithParcours>(`${SELECT_WITH_PARCOURS} WHERE c.code = $1`, [code]);
}

/** Titres des modules du parcours, dans l'ordre (page de vérification). */
export async function getParcoursModuleTitles(parcoursId: number): Promise<string[]> {
  const rows = await query<{ title: string }>("SELECT title FROM modules WHERE parcours_id = $1 ORDER BY position", [parcoursId]);
  return rows.map((r) => r.title);
}

/** Nombre d'attestations délivrées et toujours valides. */
export async function countValidCertificates(): Promise<number> {
  const row = await queryOne<{ n: number }>("SELECT count(*)::int AS n FROM certificates WHERE revoked_at IS NULL");
  return row?.n ?? 0;
}

/**
 * Origine publique du site (liens de vérification, liens envoyés par email).
 * En production, seule APP_URL fait foi : les en-têtes Host et X-Forwarded-Host peuvent être falsifiés.
 */
export async function siteOrigin(): Promise<string> {
  const configured = process.env.APP_URL ?? process.env.SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  if (process.env.NODE_ENV === "production") {
    console.error("[site] APP_URL n'est pas définie : les liens absolus utilisent l'URL par défaut du site.");
    return SITE.url;
  }
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${proto}://${host}`;
}

/** QR code SVG (couleur Evergreen) pointant vers la page de vérification. */
export function qrSvg(url: string): Promise<string> {
  return QRCode.toString(url, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#172815", light: "#ffffff" } });
}

/** Lien officiel LinkedIn « Ajouter au profil », prérempli pour une certification. */
export function linkedinAddUrl(cert: CertificateWithParcours, verifyUrl: string): string {
  const issued = new Date(cert.issued_at);
  const params = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: `${cert.parcours_title} (parcours complet)`,
    organizationName: "Cursus",
    issueYear: String(issued.getFullYear()),
    issueMonth: String(issued.getMonth() + 1),
    certUrl: verifyUrl,
    certId: cert.code,
  });
  return `https://www.linkedin.com/profile/add?${params}`;
}
