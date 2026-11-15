import GithubSlugger from "github-slugger";

export type OutlineItem = { id: string; text: string };

/**
 * Sommaire d'une section : titres de niveau 2 hors blocs de code, avec les mêmes identifiants
 * que ceux produits par rehype-slug lors du rendu.
 */
export function extractOutline(markdown: string): OutlineItem[] {
  const slugger = new GithubSlugger();
  const items: OutlineItem[] = [];
  let fence: string | null = null;
  for (const line of markdown.split("\n")) {
    const fenceMatch = /^\s*(`{3,}|~{3,})/.exec(line);
    if (fenceMatch) {
      if (fence === null) fence = fenceMatch[1];
      else if (line.trim() === fence) fence = null;
      continue;
    }
    if (fence !== null) continue;
    const heading = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!heading) continue;
    const text = heading[2].replace(/`([^`]+)`/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1");
    // Tous les titres consomment un identifiant, comme dans rehype-slug, pour rester synchronisés
    const id = slugger.slug(text);
    if (heading[1].length === 2) items.push({ id, text });
  }
  return items;
}

/** Durée de lecture estimée (environ 200 mots par minute, code et schémas compris). */
export function readingMinutes(markdown: string): number {
  let codeWords = 0;
  // Un bloc de code se lit plus lentement : environ un « mot » pour 12 caractères
  const prose = markdown.replace(/```[\s\S]*?```/g, (code) => {
    codeWords += Math.ceil(code.length / 12);
    return " ";
  });
  const words = prose.split(/\s+/).filter(Boolean).length + codeWords;
  return Math.max(1, Math.round(words / 200));
}
