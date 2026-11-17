/**
 * Mise en forme des identifiants d'attestation côté navigateur (sans dépendance serveur).
 */

/**
 * Met en forme la saisie au fil de la frappe : majuscules, caractères inutiles retirés,
 * tirets ajoutés (CUR-AIE-7K4Q-M29X). Tolère un collage avec espaces ou sans tirets.
 */
export function formatCertificateInput(input: string): string {
  const raw = input.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 14);
  const groups = [raw.slice(0, 3), raw.slice(3, 6), raw.slice(6, 10), raw.slice(10, 14)].filter(Boolean);
  return groups.join("-");
}

/** Extrait un identifiant d'un texte scanné (URL de vérification ou code seul). */
export function codeFromScan(text: string): string | null {
  const match = text.toUpperCase().match(/CUR-?[A-Z]{3}-?[2-9A-HJKMNP-Z]{4}-?[2-9A-HJKMNP-Z]{4}/);
  return match ? formatCertificateInput(match[0]) : null;
}
