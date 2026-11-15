import { getPool } from "../src/lib/db";
import { loadEnv } from "./env";

/**
 * Gestion des administrateurs en ligne de commande (aucune route publique ne permet de le devenir).
 *   npm run admin:add -- personne@exemple.fr
 *   npm run admin:remove -- personne@exemple.fr
 *   npm run admin:list
 */
async function main(): Promise<void> {
  loadEnv();
  const [command, rawEmail] = process.argv.slice(2);
  const email = rawEmail?.trim().toLowerCase();
  const pool = getPool();

  if (command === "list") {
    const { rows } = await pool.query<{ email: string; name: string }>(
      "SELECT email, name FROM users WHERE role = 'admin' ORDER BY email",
    );
    console.log(rows.length ? rows.map((r) => `${r.email} (${r.name})`).join("\n") : "Aucun administrateur.");
    return;
  }

  if ((command !== "add" && command !== "remove") || !email) {
    console.error("Usage : npm run admin:add -- <email>  |  npm run admin:remove -- <email>  |  npm run admin:list");
    process.exitCode = 1;
    return;
  }

  const user = (await pool.query<{ id: string; role: string }>("SELECT id, role FROM users WHERE email = $1", [email]))
    .rows[0];
  if (!user) {
    console.error(`Aucun compte avec l'adresse ${email}. La personne doit d'abord s'inscrire sur le site.`);
    process.exitCode = 1;
    return;
  }

  const role = command === "add" ? "admin" : "learner";
  if (command === "remove") {
    const { rows } = await pool.query<{ n: number }>("SELECT count(*)::int AS n FROM users WHERE role = 'admin'");
    if (user.role === "admin" && rows[0].n <= 1) {
      console.error("Impossible de retirer le dernier administrateur.");
      process.exitCode = 1;
      return;
    }
  }
  await pool.query("UPDATE users SET role = $1 WHERE id = $2", [role, user.id]);
  await pool.query(
    `INSERT INTO audit_log (actor_email, action, target_user_id, target_label, details)
     VALUES ('ligne de commande', $1, $2, $3, '{}'::jsonb)`,
    [command === "add" ? "admin.grant" : "admin.revoke", user.id, email],
  );
  console.log(command === "add" ? `${email} est maintenant administrateur.` : `${email} n'est plus administrateur.`);
}

main()
  .catch((error) => {
    console.error((error as Error).message);
    process.exitCode = 1;
  })
  .finally(() => getPool().end());
