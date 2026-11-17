import { randomInt } from "node:crypto";

/** Alphabet sans caractères ambigus (pas de 0/O, 1/I/L). */
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** Préfixes lisibles des parcours connus ; les autres sont dérivés du slug. */
const PREFIXES: Record<string, string> = {
  "ai-engineering": "AIE",
  "data-engineering": "DAT",
  cybersecurite: "SEC",
  "fullstack-vibe-coding": "DEV",
  "data-analyst": "DAN",
  "data-scientist": "DSC",
  "analyste-bi": "ABI",
  devops: "OPS",
  "project-manager": "PMG",
  "marketing-digital": "MKT",
  "product-manager": "PRD",
  "business-analyst": "BAN",
  "bi-engineer": "BIE",
};

export function parcoursPrefix(slug: string): string {
  return PREFIXES[slug] ?? (slug.replace(/[^a-z]/gi, "").slice(0, 3).toUpperCase().padEnd(3, "X"));
}

/** Identifiant public, aléatoire et non séquentiel : CUR-AIE-7K4Q-M29X. */
export function generateCertificateCode(slug: string): string {
  const block = () => Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
  return `CUR-${parcoursPrefix(slug)}-${block()}-${block()}`;
}

export const CERTIFICATE_CODE = /^CUR-[A-Z]{3}-[2-9A-HJKMNP-Z]{4}-[2-9A-HJKMNP-Z]{4}$/;

/** Normalise un code saisi à la main (minuscules, espaces). */
export function normalizeCertificateCode(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, "");
}
