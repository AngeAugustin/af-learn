import "server-only";
import { cache } from "react";
import { query, queryOne } from "./db";
import type { Cover, Source } from "./content/references";
import { computeChapterStates, isQuizOpen, type ChapterState } from "./progress";

export type ParcoursRow = {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  level: string;
  domain: string;
  skills: string[];
  sources: Source[];
  cover: Cover | null;
  color: string;
  icon: string;
  /** « hidden » : masqué depuis le back office, visible seulement des administrateurs. */
  status: "published" | "coming_soon" | "hidden";
  prerequisites: string[];
  outcomes: string[];
};

export type ModuleRow = { id: number; slug: string; title: string; description: string; position: number };

export type ChapterRow = {
  id: number;
  module_id: number;
  slug: string;
  title: string;
  description: string;
  duration_minutes: number;
  objectives: string[];
  position: number;
  global_position: number;
};

export type SectionRow = {
  id: number;
  chapter_id: number;
  slug: string;
  title: string;
  position: number;
  is_exercises: boolean;
  is_sketchnote: boolean;
};

export type ChapterView = ChapterRow & {
  moduleSlug: string;
  sections: SectionRow[];
  questionCount: number;
  completedSectionIds: Set<number>;
  bestScore: number | null;
  attempts: number;
  passed: boolean;
  state: ChapterState;
  quizOpen: boolean;
};

export type ModuleView = ModuleRow & { chapters: ChapterView[] };

export type CourseView = {
  parcours: ParcoursRow;
  modules: ModuleView[];
  chapters: ChapterView[];
  totals: { chapters: number; passed: number; sections: number; completedSections: number; minutes: number; questions: number };
};

/** Parcours du catalogue public (les parcours masqués en sont exclus). */
export const listParcours = cache(async () => {
  return query<ParcoursRow & { module_count: number; chapter_count: number; minutes: number }>(
    `SELECT p.*,
       (SELECT count(*)::int FROM modules m WHERE m.parcours_id = p.id) AS module_count,
       (SELECT count(*)::int FROM chapters c JOIN modules m ON m.id = c.module_id WHERE m.parcours_id = p.id) AS chapter_count,
       (SELECT coalesce(sum(c.duration_minutes), 0)::int FROM chapters c JOIN modules m ON m.id = c.module_id WHERE m.parcours_id = p.id) AS minutes
     FROM parcours p WHERE p.status <> 'hidden' ORDER BY p.position`,
  );
});

/** Titres des modules de tous les parcours, dans l'ordre (page d'accueil). */
/** Chapitres validés par l'apprenant dans chaque parcours (catalogue : « 42 % terminé »). */
export const getPassedChaptersByParcours = cache(async (userId: string): Promise<Map<number, number>> => {
  const rows = await query<{ parcours_id: number; passed: number }>(
    `SELECT m.parcours_id, count(DISTINCT a.chapter_id)::int AS passed
       FROM quiz_attempts a JOIN chapters c ON c.id = a.chapter_id JOIN modules m ON m.id = c.module_id
      WHERE a.user_id = $1 AND a.passed
      GROUP BY m.parcours_id`,
    [userId],
  );
  return new Map(rows.map((r) => [r.parcours_id, r.passed]));
});

export const listModuleTitles = cache(async () => {
  return query<{ parcours_id: number; title: string }>(
    "SELECT m.parcours_id, m.title FROM modules m JOIN parcours p ON p.id = m.parcours_id WHERE p.status <> 'hidden' ORDER BY m.parcours_id, m.position",
  );
});

export const getPlatformStats = cache(async () => {
  return queryOne<{ chapters: number; sections: number; questions: number; minutes: number; exercises: number; sketchnotes: number }>(
    `WITH ch AS (
       SELECT c.* FROM chapters c JOIN modules m ON m.id = c.module_id JOIN parcours p ON p.id = m.parcours_id
       WHERE p.status <> 'hidden'
     ), se AS (SELECT s.* FROM sections s WHERE s.chapter_id IN (SELECT id FROM ch))
     SELECT (SELECT count(*)::int FROM ch) AS chapters,
            (SELECT count(*)::int FROM se) AS sections,
            (SELECT count(*)::int FROM questions WHERE chapter_id IN (SELECT id FROM ch)) AS questions,
            (SELECT coalesce(sum(duration_minutes), 0)::int FROM ch) AS minutes,
            (SELECT count(*)::int FROM se WHERE is_exercises) AS exercises,
            (SELECT count(*)::int FROM se WHERE is_sketchnote) AS sketchnotes`,
  );
});

/** Vue complète d'un parcours, avec la progression de l'utilisateur s'il est connecté. */
export const getCourse = cache(async (slug: string, userId: string | null): Promise<CourseView | null> => {
  const parcours = await queryOne<ParcoursRow>("SELECT * FROM parcours WHERE slug = $1", [slug]);
  if (!parcours) return null;

  const [modules, chapters, sections, questionCounts, progress, attempts] = await Promise.all([
    query<ModuleRow>("SELECT id, slug, title, description, position FROM modules WHERE parcours_id = $1 ORDER BY position", [parcours.id]),
    query<ChapterRow>(
      `SELECT c.* FROM chapters c JOIN modules m ON m.id = c.module_id
       WHERE m.parcours_id = $1 ORDER BY c.global_position`,
      [parcours.id],
    ),
    query<SectionRow>(
      `SELECT s.id, s.chapter_id, s.slug, s.title, s.position, s.is_exercises, s.is_sketchnote
       FROM sections s JOIN chapters c ON c.id = s.chapter_id JOIN modules m ON m.id = c.module_id
       WHERE m.parcours_id = $1 ORDER BY s.chapter_id, s.position`,
      [parcours.id],
    ),
    query<{ chapter_id: number; n: number }>(
      `SELECT q.chapter_id, count(*)::int AS n FROM questions q
       JOIN chapters c ON c.id = q.chapter_id JOIN modules m ON m.id = c.module_id
       WHERE m.parcours_id = $1 GROUP BY q.chapter_id`,
      [parcours.id],
    ),
    userId
      ? query<{ section_id: number }>("SELECT section_id FROM section_progress WHERE user_id = $1", [userId])
      : Promise.resolve([]),
    userId
      ? query<{ chapter_id: number; best: number; n: number; passed: boolean }>(
          `SELECT chapter_id, max(score)::int AS best, count(*)::int AS n, bool_or(passed) AS passed
           FROM quiz_attempts WHERE user_id = $1 GROUP BY chapter_id`,
          [userId],
        )
      : Promise.resolve([]),
  ]);

  const done = new Set(progress.map((p) => p.section_id));
  const attemptsByChapter = new Map(attempts.map((a) => [a.chapter_id, a]));
  const countByChapter = new Map(questionCounts.map((q) => [q.chapter_id, q.n]));
  const moduleSlugById = new Map(modules.map((m) => [m.id, m.slug]));

  const base = chapters.map((c) => {
    const chapterSections = sections.filter((s) => s.chapter_id === c.id);
    const completed = new Set(chapterSections.filter((s) => done.has(s.id)).map((s) => s.id));
    const a = attemptsByChapter.get(c.id);
    return {
      ...c,
      moduleSlug: moduleSlugById.get(c.module_id) ?? "",
      sections: chapterSections,
      questionCount: countByChapter.get(c.id) ?? 0,
      completedSectionIds: completed,
      bestScore: a ? a.best : null,
      attempts: a ? a.n : 0,
      passed: a ? a.passed : false,
    };
  });
  const states = computeChapterStates(
    base.map((c) => ({ id: c.id, sectionCount: c.sections.length, completedSections: c.completedSectionIds.size, passed: c.passed })),
  );
  const chapterViews: ChapterView[] = base.map((c, i) => ({
    ...c,
    state: states[i],
    quizOpen: isQuizOpen(
      { id: c.id, sectionCount: c.sections.length, completedSections: c.completedSectionIds.size, passed: c.passed },
      states[i],
    ),
  }));

  return {
    parcours,
    modules: modules.map((m) => ({ ...m, chapters: chapterViews.filter((c) => c.module_id === m.id) })),
    chapters: chapterViews,
    totals: {
      chapters: chapterViews.length,
      passed: chapterViews.filter((c) => c.passed).length,
      sections: sections.length,
      completedSections: chapterViews.reduce((n, c) => n + c.completedSectionIds.size, 0),
      minutes: chapterViews.reduce((n, c) => n + c.duration_minutes, 0),
      questions: chapterViews.reduce((n, c) => n + c.questionCount, 0),
    },
  };
});

export async function getSectionBody(sectionId: number): Promise<string> {
  const row = await queryOne<{ body_md: string }>("SELECT body_md FROM sections WHERE id = $1", [sectionId]);
  return row?.body_md ?? "";
}

/** Sketchnotes d'un parcours, dans l'ordre des modules puis des chapitres. */
export type ParcoursSketchnoteRow = {
  section_id: number;
  body_md: string;
  chapter_id: number;
  chapter_slug: string;
  chapter_title: string;
  chapter_position: number;
  module_id: number;
  module_slug: string;
  module_title: string;
  module_position: number;
};

export const getParcoursSketchnotes = cache(async (parcoursId: number): Promise<ParcoursSketchnoteRow[]> => {
  return query<ParcoursSketchnoteRow>(
    `SELECT s.id AS section_id, s.body_md,
            c.id AS chapter_id, c.slug AS chapter_slug, c.title AS chapter_title, c.position AS chapter_position,
            m.id AS module_id, m.slug AS module_slug, m.title AS module_title, m.position AS module_position
     FROM sections s
     JOIN chapters c ON c.id = s.chapter_id
     JOIN modules m ON m.id = c.module_id
     WHERE m.parcours_id = $1 AND s.is_sketchnote
     ORDER BY m.position, c.position`,
    [parcoursId],
  );
});

export type QuestionRow = {
  id: number;
  position: number;
  prompt: string;
  code: string | null;
  options: string[];
  correct: number[];
  multiple: boolean;
  explanation: string;
};

export function getQuestions(chapterId: number) {
  return query<QuestionRow>(
    "SELECT id, position, prompt, code, options, correct, multiple, explanation FROM questions WHERE chapter_id = $1 ORDER BY position",
    [chapterId],
  );
}

export type StoredAnswer = { position: number; selected: number[]; isCorrect: boolean };

export type AttemptRow = {
  id: number;
  chapter_id: number;
  score: number;
  correct_count: number;
  total: number;
  passed: boolean;
  answers: StoredAnswer[];
  created_at: Date;
};

export function getAttempt(attemptId: number, userId: string) {
  return queryOne<AttemptRow>("SELECT * FROM quiz_attempts WHERE id = $1 AND user_id = $2", [attemptId, userId]);
}

export function getRecentAttempts(userId: string, limit = 8) {
  return query<AttemptRow & { chapter_title: string; chapter_slug: string; module_slug: string; parcours_slug: string }>(
    `SELECT a.*, c.title AS chapter_title, c.slug AS chapter_slug, m.slug AS module_slug, p.slug AS parcours_slug
     FROM quiz_attempts a
     JOIN chapters c ON c.id = a.chapter_id
     JOIN modules m ON m.id = c.module_id
     JOIN parcours p ON p.id = m.parcours_id
     WHERE a.user_id = $1 ORDER BY a.created_at DESC LIMIT $2`,
    [userId, limit],
  );
}

/**
 * Le contenu d'un parcours est-il accessible ? Publié : pour tous. Masqué : seulement pour
 * un administrateur, qui peut ainsi le relire avant de le rendre disponible.
 */
export function isCourseOpen(status: ParcoursRow["status"], role: string | null | undefined): boolean {
  return status === "published" || (status === "hidden" && role === "admin");
}
