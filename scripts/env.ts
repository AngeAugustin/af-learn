import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Charge .env.local puis .env (comme Next.js) pour les scripts exécutés hors de Next.
 * Les variables déjà définies dans l'environnement ne sont jamais écrasées.
 */
export function loadEnv(): void {
  for (const file of [".env.local", ".env"]) {
    const full = path.join(process.cwd(), file);
    if (!existsSync(full)) continue;
    for (const line of readFileSync(full, "utf8").split(/\r?\n/)) {
      const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/.exec(line);
      if (!match || line.trimStart().startsWith("#")) continue;
      const [, key, rawValue] = match;
      const value = rawValue.replace(/^(['"])(.*)\1$/, "$2");
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
}
