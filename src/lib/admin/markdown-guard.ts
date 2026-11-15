/**
 * Garde-fou pour le Markdown saisi dans le back office. Le rendu des leçons accepte du HTML brut
 * (balises <details>, <div>, <img>...), donc un texte modifié pourrait injecter du code exécuté
 * chez tous les apprenants. On refuse les balises et attributs actifs en dehors des blocs de code
 * (les leçons de sécurité montrent légitimement des <script> dans des exemples de code).
 */

const DANGEROUS_TAG = /<\s*\/?\s*(script|iframe|frame|frameset|object|embed|applet|style|link|meta|base|form|input|button|textarea|select|svg|math)\b/i;
const EVENT_ATTR = /<[^>]*\s(on[a-z]+|formaction|srcdoc)\s*=/i;
const BAD_URL = /<[^>]*\s(href|src|action|poster|xlink:href)\s*=\s*["']?\s*(javascript|vbscript|data\s*:\s*text\/html)/i;
const MD_BAD_LINK = /\]\(\s*<?\s*(javascript|vbscript|data\s*:\s*text\/html)/i;

/** Retire les blocs de code (``` ou ~~~) et le code en ligne, qui sont affichés comme du texte. */
export function stripCode(md: string): string {
  const kept: string[] = [];
  let fence: string | null = null;
  for (const line of md.split("\n")) {
    const marker = /^[ \t]*(`{3,}|~{3,})/.exec(line)?.[1];
    if (fence) {
      // Fin du bloc : même caractère, au moins aussi long, rien d'autre sur la ligne.
      if (marker && marker[0] === fence[0] && marker.length >= fence.length && line.trim() === marker) fence = null;
      continue;
    }
    if (marker) {
      fence = marker;
      continue;
    }
    kept.push(line);
  }
  return kept.join("\n").replace(/(`+)[^`][\s\S]*?\1/g, "");
}

/** Vrai si le Markdown contient du HTML actif (script, gestionnaire d'évènement, URL javascript:...). */
export function unsafeMarkdown(md: string): boolean {
  const text = stripCode(md);
  return DANGEROUS_TAG.test(text) || EVENT_ATTR.test(text) || BAD_URL.test(text) || MD_BAD_LINK.test(text);
}
