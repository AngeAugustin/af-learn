/**
 * Mesure d'audience interne, respectueuse de la vie privée :
 * pas de cookie, pas d'IP conservée, pas d'outil tiers. Ces fonctions sont pures pour être testées.
 */

export type Device = "mobile" | "tablet" | "desktop";

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|pingdom|curl|wget|python|axios|node-fetch/i;

export function isBot(userAgent: string): boolean {
  return !userAgent || BOT.test(userAgent);
}

export function deviceFrom(userAgent: string): Device {
  if (/ipad|tablet|kindle|silk|playbook|(android(?!.*mobile))/i.test(userAgent)) return "tablet";
  if (/mobi|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(userAgent)) return "mobile";
  return "desktop";
}

/** Chemins jamais comptés : espace d'administration, API, fichiers techniques. */
export function isTrackablePath(path: string): boolean {
  return (
    path.startsWith("/") &&
    path.length <= 300 &&
    !/^\/(admin|api|_next)(\/|$)/.test(path) &&
    !/\.(png|jpe?g|svg|ico|webp|txt|xml|json|pdf)$/i.test(path)
  );
}

/** Ne garde que le nom d'hôte du référent, et rien si le visiteur vient du site lui-même. */
export function referrerHost(referrer: string | null | undefined, ownHost: string | null | undefined): string | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
    const own = (ownHost ?? "").split(":")[0].replace(/^www\./, "").toLowerCase();
    return host && host !== own ? host.slice(0, 120) : null;
  } catch {
    return null;
  }
}

/** Source de campagne nettoyée (utm_source), limitée à un identifiant court. */
export function cleanCampaign(value: string | null | undefined): string | null {
  const v = (value ?? "").trim().toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 60);
  return v || null;
}

/** Libellé lisible d'un chemin pour les tableaux d'audience. */
export function pageLabel(path: string): string {
  return path === "/" ? "Accueil" : path;
}
