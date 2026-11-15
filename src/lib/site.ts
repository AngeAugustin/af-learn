/**
 * Informations institutionnelles affichées dans les pages légales, le contact et le pied de page.
 * Les valeurs entre crochets sont à remplacer par les vraies informations avant la mise en ligne.
 */
export const SITE = {
  name: "Cursus",
  url: process.env.APP_URL ?? "http://localhost:3000",
  contactEmail: process.env.CONTACT_EMAIL ?? "[À COMPLÉTER : adresse de contact]",
  /** Date de dernière mise à jour des pages légales. */
  legalUpdatedAt: "15 novembre 2026",
  editor: {
    name: "[À COMPLÉTER : nom de l'éditeur ou raison sociale]",
    status: "[À COMPLÉTER : statut juridique, par ex. entrepreneur individuel, SAS]",
    address: "[À COMPLÉTER : adresse postale]",
    registration: "[À COMPLÉTER : SIREN / RCS, ou « non immatriculé » pour un particulier]",
    publicationDirector: "[À COMPLÉTER : directeur ou directrice de la publication]",
  },
  host: {
    name: "[À COMPLÉTER : hébergeur, par ex. Vercel Inc., OVH SAS]",
    address: "[À COMPLÉTER : adresse de l'hébergeur]",
    website: "[À COMPLÉTER : site de l'hébergeur]",
  },
  /** Réseaux affichés sur la page de contact. Laisser vide pour masquer. */
  socials: [] as { label: string; href: string }[],
} as const;

/** Vrai si la valeur est encore un emplacement à compléter. */
export const isPlaceholder = (value: string) => value.startsWith("[À COMPLÉTER");
