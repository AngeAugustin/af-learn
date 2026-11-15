import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { getPool } from "../src/lib/db";
import { loadEnv } from "./env";

/** Applique, dans l'ordre et une seule fois, les fichiers SQL de db/migrations. */
export async function migrate(): Promise<string[]> {
  const pool = getPool();
  await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    name text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  )`);
  const dir = path.join(process.cwd(), "db", "migrations");
  const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
  const applied = new Set(
    (await pool.query<{ name: string }>("SELECT name FROM schema_migrations")).rows.map((r) => r.name),
  );
  const newlyApplied: string[] = [];
  for (const file of files) {
    if (applied.has(file)) continue;
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(readFileSync(path.join(dir, file), "utf8"));
      await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [file]);
      await client.query("COMMIT");
      newlyApplied.push(file);
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`Échec de la migration ${file} : ${(error as Error).message}`);
    } finally {
      client.release();
    }
  }
  return newlyApplied;
}

if (process.argv[1]?.endsWith("migrate.ts")) {
  loadEnv();
  migrate()
    .then((files) => {
      console.log(files.length ? `Migrations appliquées : ${files.join(", ")}` : "Base déjà à jour.");
      return getPool().end();
    })
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
}
