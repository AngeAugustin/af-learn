/**
 * Adresse du client pour limiter les abus. Elle n'est jamais enregistrée telle quelle.
 * `x-real-ip` est posé par la plateforme (Vercel) et n'est pas le premier maillon,
 * que le client peut inventer. À défaut, on prend le dernier maillon de
 * X-Forwarded-For : c'est celui qu'ajoute le proxy le plus proche.
 */
export function clientIp(h: Headers): string {
  const real = h.get("x-real-ip")?.trim();
  if (real) return real.slice(0, 80);
  const forwarded = (h.get("x-forwarded-for") ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return (forwarded[forwarded.length - 1] || "local").slice(0, 80);
}
