const dateFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" });
const dateTimeFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const nf = new Intl.NumberFormat("fr-FR");

export const fmtDate = (d: Date | string | null | undefined) => (d ? dateFmt.format(new Date(d)) : "Jamais");
export const fmtDateTime = (d: Date | string | null | undefined) => (d ? dateTimeFmt.format(new Date(d)) : "Jamais");
export const fmtNumber = (n: number) => nf.format(n);
export const fmtPct = (part: number, whole: number) => (whole > 0 ? `${Math.round((100 * part) / whole)} %` : "0 %");

/** « il y a 3 j », « il y a 2 h », « à l'instant ». */
export function fmtRelative(d: Date | string | null | undefined, now = Date.now()): string {
  if (!d) return "Jamais";
  const s = Math.max(0, Math.round((now - new Date(d).getTime()) / 1000));
  if (s < 60) return "à l'instant";
  if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
  if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`;
  if (s < 86400 * 60) return `il y a ${Math.floor(s / 86400)} j`;
  return fmtDate(d);
}

/** Échappe une valeur pour un fichier CSV (séparateur point-virgule, lisible par Excel en français). */
export function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? "" : value instanceof Date ? value.toISOString() : String(value);
  // Neutralise les formules (=, +, -, @) qu'un tableur exécuterait à l'ouverture.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return /[";\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function toCsv(rows: unknown[][]): string {
  return "﻿" + rows.map((r) => r.map(csvCell).join(";")).join("\r\n") + "\r\n";
}
