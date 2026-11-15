import "server-only";
import { query, queryOne } from "../db";
import type { ParcoursRow } from "../queries";
import { loadAllParcours } from "../content/loader";
import type { ParcoursSource } from "../content/types";

/**
 * Catalogue vu du back office : tous les parcours, y compris masqués, avec leurs chiffres.
 * Les champs modifiés à la main sont listés dans `overrides` (voir db/migrations/007_catalog.sql).
 */

export type Overrides = Record<string, unknown>;

export type CatalogRow = ParcoursRow & {
  position: number;
  overrides: Overrides;
  updated_at: Date | null;
  modules: number;
  chapters: number;
  minutes: number;
  questions: number;
  learners: number;
  certificates: number;
  edits: number;
};

export const STATUS_LABELS: Record<ParcoursRow["status"], string> = {
  published: "Disponible",
  coming_soon: "Bientôt disponible",
  hidden: "Masqué",
};

export const STATUS_HELP: Record<ParcoursRow["status"], string> = {
  published: "Visible dans le catalogue, ouvert aux inscriptions et à l'apprentissage.",
  coming_soon: "Visible dans le catalogue avec une page d'annonce, sans accès au contenu.",
  hidden: "Retiré du site : seuls les administrateurs peuvent le consulter. La progression des apprenants est conservée.",
};

export function listCatalog() {
  return query<CatalogRow>(
    `SELECT p.*,
       (SELECT count(*)::int FROM modules m WHERE m.parcours_id = p.id) AS modules,
       (SELECT count(*)::int FROM chapters c JOIN modules m ON m.id = c.module_id WHERE m.parcours_id = p.id) AS chapters,
       (SELECT coalesce(sum(c.duration_minutes), 0)::int FROM chapters c JOIN modules m ON m.id = c.module_id WHERE m.parcours_id = p.id) AS minutes,
       (SELECT count(*)::int FROM questions q JOIN chapters c ON c.id = q.chapter_id JOIN modules m ON m.id = c.module_id
         WHERE m.parcours_id = p.id) AS questions,
       (SELECT count(DISTINCT sp.user_id)::int FROM section_progress sp JOIN sections s ON s.id = sp.section_id
         JOIN chapters c ON c.id = s.chapter_id JOIN modules m ON m.id = c.module_id WHERE m.parcours_id = p.id) AS learners,
       (SELECT count(*)::int FROM certificates ce WHERE ce.parcours_id = p.id AND ce.revoked_at IS NULL) AS certificates,
       (
         (SELECT count(*) FROM jsonb_object_keys(p.overrides))
         + (SELECT coalesce(sum((SELECT count(*) FROM jsonb_object_keys(m.overrides))), 0) FROM modules m WHERE m.parcours_id = p.id)
         + (SELECT coalesce(sum((SELECT count(*) FROM jsonb_object_keys(c.overrides))), 0)
            FROM chapters c JOIN modules m ON m.id = c.module_id WHERE m.parcours_id = p.id)
         + (SELECT coalesce(sum((SELECT count(*) FROM jsonb_object_keys(s.overrides))), 0)
            FROM sections s JOIN chapters c ON c.id = s.chapter_id JOIN modules m ON m.id = c.module_id WHERE m.parcours_id = p.id)
       )::int AS edits
     FROM parcours p ORDER BY p.position, p.id`,
  );
}

export type AdminModule = { id: number; slug: string; title: string; description: string; position: number; overrides: Overrides };
export type AdminChapter = {
  id: number;
  module_id: number;
  slug: string;
  title: string;
  description: string;
  duration_minutes: number;
  objectives: string[];
  position: number;
  overrides: Overrides;
  sections: number;
  questions: number;
  edited_sections: number;
};

export async function getCatalogCourse(slug: string) {
  const parcours = await queryOne<ParcoursRow & { position: number; overrides: Overrides; updated_at: Date | null }>(
    "SELECT * FROM parcours WHERE slug = $1",
    [slug],
  );
  if (!parcours) return null;
  const [modules, chapters, learners] = await Promise.all([
    query<AdminModule>("SELECT id, slug, title, description, position, overrides FROM modules WHERE parcours_id = $1 ORDER BY position", [
      parcours.id,
    ]),
    query<AdminChapter>(
      `SELECT c.id, c.module_id, c.slug, c.title, c.description, c.duration_minutes, c.objectives, c.position, c.overrides,
              (SELECT count(*)::int FROM sections s WHERE s.chapter_id = c.id) AS sections,
              (SELECT count(*)::int FROM questions q WHERE q.chapter_id = c.id) AS questions,
              (SELECT count(*)::int FROM sections s WHERE s.chapter_id = c.id AND s.overrides <> '{}'::jsonb) AS edited_sections
       FROM chapters c JOIN modules m ON m.id = c.module_id
       WHERE m.parcours_id = $1 ORDER BY m.position, c.position`,
      [parcours.id],
    ),
    queryOne<{ n: number }>(
      `SELECT count(DISTINCT sp.user_id)::int AS n FROM section_progress sp JOIN sections s ON s.id = sp.section_id
       JOIN chapters c ON c.id = s.chapter_id JOIN modules m ON m.id = c.module_id WHERE m.parcours_id = $1`,
      [parcours.id],
    ),
  ]);
  return { parcours, modules, chapters, learners: learners?.n ?? 0 };
}

export type AdminSection = {
  id: number;
  slug: string;
  title: string;
  body_md: string;
  position: number;
  is_exercises: boolean;
  is_sketchnote: boolean;
  overrides: Overrides;
};

export async function getCatalogChapter(chapterId: number) {
  const chapter = await queryOne<{
    id: number;
    slug: string;
    title: string;
    module_slug: string;
    module_title: string;
    parcours_slug: string;
    parcours_title: string;
  }>(
    `SELECT c.id, c.slug, c.title, m.slug AS module_slug, m.title AS module_title, p.slug AS parcours_slug, p.title AS parcours_title
     FROM chapters c JOIN modules m ON m.id = c.module_id JOIN parcours p ON p.id = m.parcours_id WHERE c.id = $1`,
    [chapterId],
  );
  if (!chapter) return null;
  const sections = await query<AdminSection>(
    "SELECT id, slug, title, body_md, position, is_exercises, is_sketchnote, overrides FROM sections WHERE chapter_id = $1 ORDER BY position",
    [chapterId],
  );
  return { chapter, sections };
}

/** Version des fichiers d'un parcours (pour revenir au contenu d'origine), ou null si le dossier a disparu. */
export function sourceParcours(slug: string): ParcoursSource | null {
  return loadAllParcours().find((p) => p.slug === slug) ?? null;
}

/** Une ligne par élément, un élément par ligne : pour éditer une liste dans une zone de texte. */
export function linesToList(value: unknown, max = 20): string[] {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, max)
    .map((l) => l.slice(0, 300));
}

export type AdminQuestion = {
  id: number;
  position: number;
  prompt: string;
  code: string | null;
  options: string[];
  correct: number[];
  multiple: boolean;
  explanation: string;
  overrides: Overrides;
  answers: number;
  wrong: number;
};

/** Questions d'un chapitre, avec le nombre de réponses données et d'erreurs dans les évaluations. */
export function getChapterQuestions(chapterId: number) {
  return query<AdminQuestion>(
    `WITH ans AS (
       SELECT (x.v ->> 'position')::int AS position, (x.v ->> 'isCorrect')::boolean AS ok
       FROM quiz_attempts a CROSS JOIN LATERAL jsonb_array_elements(a.answers) AS x(v)
       WHERE a.chapter_id = $1
     )
     SELECT q.id, q.position, q.prompt, q.code, q.options, q.correct, q.multiple, q.explanation, q.overrides,
            (SELECT count(*)::int FROM ans WHERE ans.position = q.position) AS answers,
            (SELECT count(*)::int FROM ans WHERE ans.position = q.position AND NOT ans.ok) AS wrong
     FROM questions q WHERE q.chapter_id = $1 ORDER BY q.position`,
    [chapterId],
  );
}

export const MAX_OPTIONS = 8;
