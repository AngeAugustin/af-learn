import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Règle typographique du site : aucun tiret cadratin (U+2014).
 * Remplacements : « : » pour une explication ou un titre, « , » pour une suite de phrase,
 * des parenthèses pour une incise, « · » comme séparateur, « - » dans le code ou une cellule vide.
 */
export const EM_DASH = "—";

/** Dossiers et fichiers contrôlés (contenu des formations et code du site). */
export const TYPOGRAPHY_ROOTS = ["content", "src", "README.md"];

const EXTENSIONS = /\.(md|ya?ml|tsx?|css|json)$/;

function listFiles(path: string): string[] {
  try {
    return readdirSync(path, { withFileTypes: true }).flatMap((entry) =>
      entry.isDirectory() ? listFiles(join(path, entry.name)) : EXTENSIONS.test(entry.name) ? [join(path, entry.name)] : [],
    );
  } catch {
    return EXTENSIONS.test(path) ? [path] : [];
  }
}

/** Liste les occurrences de tirets cadratins sous la forme « fichier:ligne ». */
export function findEmDashes(roots: string[] = TYPOGRAPHY_ROOTS, cwd = process.cwd()): string[] {
  const hits: string[] = [];
  for (const root of roots) {
    for (const file of listFiles(join(cwd, root))) {
      readFileSync(file, "utf8")
        .split("\n")
        .forEach((line, i) => {
          if (line.includes(EM_DASH)) hits.push(`${file.slice(cwd.length + 1)}:${i + 1}`);
        });
    }
  }
  return hits;
}
