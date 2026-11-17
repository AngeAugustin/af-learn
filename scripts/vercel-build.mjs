import { spawnSync } from "node:child_process";
import { delimiter } from "node:path";

/**
 * Construction Vercel. En production, applique les migrations puis recharge le contenu
 * avant de construire le site. Les aperçus ne touchent pas la base : elle est partagée
 * avec la production. La connexion directe (sans pooler) sert aux migrations.
 */
const env = { ...process.env };
if (env.DATABASE_URL_UNPOOLED) env.DATABASE_URL = env.DATABASE_URL_UNPOOLED;
env.PATH = `node_modules/.bin${delimiter}${env.PATH ?? ""}`;

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", env });
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (process.env.VERCEL_ENV === "production") {
  console.log("Mise à jour de la base de production…");
  run("tsx", ["scripts/seed.ts"]);
}

run("next", ["build"]);
