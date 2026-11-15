import type { PoolClient } from "pg";
import { getPool, transaction } from "../src/lib/db";
import { loadAllParcours } from "../src/lib/content/loader";
import type { ParcoursSource } from "../src/lib/content/types";
import { loadEnv } from "./env";
import { migrate } from "./migrate";

/**
 * Valeur à écrire lors d'un rechargement : celle saisie dans le back office si elle existe
 * (clé présente dans `overrides`), sinon celle des fichiers.
 */
const keep = (table: string, col: string, cast = "") =>
  `${col} = CASE WHEN ${table}.overrides ? '${col}' THEN ${
    cast === "jsonb" ? `${table}.overrides->'${col}'` : `(${table}.overrides->>'${col}')${cast}`
  } ELSE EXCLUDED.${col} END`;

async function upsertParcours(client: PoolClient, p: ParcoursSource) {
  const { rows } = await client.query<{ id: number }>(
    `INSERT INTO parcours (slug, title, tagline, description, level, color, icon, status, position, prerequisites, outcomes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     ON CONFLICT (slug) DO UPDATE SET ${["title", "tagline", "description", "level", "color", "icon", "status"]
       .map((c) => keep("parcours", c))
       .join(", ")}, ${keep("parcours", "position", "::int")}, ${keep("parcours", "prerequisites", "jsonb")}, ${keep("parcours", "outcomes", "jsonb")}
     RETURNING id`,
    [p.slug, p.title, p.tagline, p.description, p.level, p.color, p.icon, p.status, p.order,
      JSON.stringify(p.prerequisites), JSON.stringify(p.outcomes)],
  );
  const parcoursId = rows[0].id;

  let globalPosition = 0;
  const moduleIds: number[] = [];
  for (const [mIndex, m] of p.modules.entries()) {
    const mod = await client.query<{ id: number }>(
      `INSERT INTO modules (parcours_id, slug, title, description, position) VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (parcours_id, slug) DO UPDATE SET ${keep("modules", "title")}, ${keep("modules", "description")}, position=$5 RETURNING id`,
      [parcoursId, m.slug, m.title, m.description, mIndex],
    );
    const moduleId = mod.rows[0].id;
    moduleIds.push(moduleId);

    const chapterIds: number[] = [];
    for (const [cIndex, c] of m.chapters.entries()) {
      const ch = await client.query<{ id: number }>(
        `INSERT INTO chapters (module_id, slug, title, description, duration_minutes, objectives, position, global_position)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (module_id, slug) DO UPDATE SET ${keep("chapters", "title")}, ${keep("chapters", "description")},
           ${keep("chapters", "duration_minutes", "::int")}, ${keep("chapters", "objectives", "jsonb")}, position=$7, global_position=$8
         RETURNING id`,
        [moduleId, c.slug, c.title, c.description, c.duration, JSON.stringify(c.objectives), cIndex, globalPosition++],
      );
      const chapterId = ch.rows[0].id;
      chapterIds.push(chapterId);

      const sectionIds: number[] = [];
      for (const [sIndex, s] of c.sections.entries()) {
        const sec = await client.query<{ id: number }>(
          `INSERT INTO sections (chapter_id, slug, title, body_md, position, is_exercises, is_sketchnote) VALUES ($1,$2,$3,$4,$5,$6,$7)
           ON CONFLICT (chapter_id, slug) DO UPDATE SET ${keep("sections", "title")}, ${keep("sections", "body_md")}, position=$5, is_exercises=$6, is_sketchnote=$7
           RETURNING id`,
          [chapterId, s.slug, s.title, s.body, sIndex, s.isExercises, s.isSketchnote],
        );
        sectionIds.push(sec.rows[0].id);
      }
      await client.query("DELETE FROM sections WHERE chapter_id = $1 AND NOT (id = ANY($2::int[]))", [chapterId, sectionIds]);

      for (const [qIndex, q] of c.questions.entries()) {
        await client.query(
          `INSERT INTO questions (chapter_id, position, prompt, code, options, correct, multiple, explanation)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
           ON CONFLICT (chapter_id, position) DO UPDATE SET ${keep("questions", "prompt")}, ${keep("questions", "code")},
             ${keep("questions", "options", "jsonb")}, ${keep("questions", "correct", "jsonb")},
             ${keep("questions", "multiple", "::boolean")}, ${keep("questions", "explanation")}`,
          [chapterId, qIndex, q.prompt, q.code ?? null, JSON.stringify(q.options),
            JSON.stringify([...q.answer].sort((a, b) => a - b)), q.multiple, q.explanation],
        );
      }
      await client.query("DELETE FROM questions WHERE chapter_id = $1 AND position >= $2", [chapterId, c.questions.length]);
    }
    await client.query("DELETE FROM chapters WHERE module_id = $1 AND NOT (id = ANY($2::int[]))", [moduleId, chapterIds]);
  }
  await client.query("DELETE FROM modules WHERE parcours_id = $1 AND NOT (id = ANY($2::int[]))", [parcoursId, moduleIds]);
  return parcoursId;
}

export async function seed(): Promise<{ parcours: number; chapters: number; sections: number; questions: number }> {
  const all = loadAllParcours();
  await transaction(async (client) => {
    const ids: number[] = [];
    for (const p of all) ids.push(await upsertParcours(client, p));
    await client.query("DELETE FROM parcours WHERE NOT (id = ANY($1::int[]))", [ids]);
  });
  const chapters = all.flatMap((p) => p.modules.flatMap((m) => m.chapters));
  return {
    parcours: all.length,
    chapters: chapters.length,
    sections: chapters.reduce((n, c) => n + c.sections.length, 0),
    questions: chapters.reduce((n, c) => n + c.questions.length, 0),
  };
}

if (process.argv[1]?.endsWith("seed.ts")) {
  loadEnv();
  migrate()
    .then(() => seed())
    .then((stats) => {
      console.log(
        `Contenu chargé : ${stats.parcours} parcours, ${stats.chapters} chapitres, ` +
          `${stats.sections} sections, ${stats.questions} questions.`,
      );
      return getPool().end();
    })
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
}
