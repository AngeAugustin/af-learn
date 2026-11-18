/**
 * Lien acceptable dans une leçon : http(s), mailto, ancre, ou chemin du site.
 * Refuse javascript:, data:, et les URLs protocol-relative (//hôte, /\hôte).
 */
export function isSafeHref(value: string): boolean {
  const url = value.trim();
  if (!url || /[\u0000-\u001f]/.test(url)) return false;
  if (url.startsWith("//") || url.startsWith("/\\") || url.startsWith("\\")) return false;
  if (url.startsWith("/") || url.startsWith("#") || url.startsWith("?")) return true;
  if (url.startsWith("./") || url.startsWith("../")) return !url.includes(":");
  return /^(https?:|mailto:)/i.test(url);
}
