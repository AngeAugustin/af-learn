import "server-only";
import { query, queryOne } from "./db";
import type { QuestionRow } from "./queries";
import {
  CHAPTER_DRAW,
  FINAL_EXAM_SIZE,
  MODULE_EXAM_SIZE,
  chapterDrawSeed,
  drawBalanced,
  drawQuestions,
  examDrawSeed,
  PRETEST_SIZE,
  pretestSeed,
} from "./memorisation";

/* ------------------------------------------------------------------ */
/* Tirage des évaluations de chapitre                                  */
/* ------------------------------------------------------------------ */

/** Questions posées à la tentative n° attemptIndex (0 pour la première) d'un chapitre. */
export function chapterDraw(questions: QuestionRow[], userId: string, chapterId: number, attemptIndex: number): QuestionRow[] {
  return drawQuestions(questions, CHAPTER_DRAW, chapterDrawSeed(userId, chapterId, attemptIndex));
}

/** Questions du pré-test « Testez-vous avant de lire » d'un chapitre, stables pour un apprenant. */
export function pretestDraw(questions: QuestionRow[], userId: string, chapterId: number): QuestionRow[] {
  return drawQuestions(questions, PRETEST_SIZE, pretestSeed(userId, chapterId));
}

/* ------------------------------------------------------------------ */
/* Révisions espacées                                                  */
/* ------------------------------------------------------------------ */

/** Ajoute aux révisions toutes les questions d'un chapitre validé (première révision le lendemain). */
export async function scheduleChapterReviews(userId: string, chapterId: number, dueAt: Date): Promise<void> {
  await query(
    `INSERT INTO review_cards (user_id, question_id, box, due_at)
     SELECT $1, q.id, 1, $3 FROM questions q WHERE q.chapter_id = $2
     ON CONFLICT DO NOTHING`,
    [userId, chapterId, dueAt],
  );
}

export type ReviewSummary = {
  parcours_id: number;
  parcours_slug: string;
  parcours_title: string;
  total: number;
  due: number;
  mastered: number;
  next_due: Date | null;
};

/** Révisions par parcours : nombre de questions suivies, à revoir maintenant, maîtrisées. */
export function getReviewSummary(userId: string) {
  return query<ReviewSummary>(
    `SELECT p.id AS parcours_id, p.slug AS parcours_slug, p.title AS parcours_title,
            count(*)::int AS total,
            count(*) FILTER (WHERE rc.due_at <= now())::int AS due,
            count(*) FILTER (WHERE rc.box = 4)::int AS mastered,
            min(rc.due_at) FILTER (WHERE rc.due_at > now()) AS next_due
     FROM review_cards rc
     JOIN questions q ON q.id = rc.question_id
     JOIN chapters c ON c.id = q.chapter_id
     JOIN modules m ON m.id = c.module_id
     JOIN parcours p ON p.id = m.parcours_id
     WHERE rc.user_id = $1
     GROUP BY p.id ORDER BY p.position`,
    [userId],
  );
}

export type DueQuestion = QuestionRow & { box: number; chapter_title: string; parcours_slug: string };

/** Questions à réviser maintenant, les plus en retard d'abord (éventuellement pour un seul parcours). */
export function getDueQuestions(userId: string, limit: number, parcoursSlug: string | null) {
  return query<DueQuestion>(
    `SELECT q.id, q.position, q.prompt, q.code, q.options, q.correct, q.multiple, q.explanation,
            rc.box, c.title AS chapter_title, p.slug AS parcours_slug
     FROM review_cards rc
     JOIN questions q ON q.id = rc.question_id
     JOIN chapters c ON c.id = q.chapter_id
     JOIN modules m ON m.id = c.module_id
     JOIN parcours p ON p.id = m.parcours_id
     WHERE rc.user_id = $1 AND rc.due_at <= now() AND ($3::text IS NULL OR p.slug = $3)
     ORDER BY rc.due_at, q.id
     LIMIT $2`,
    [userId, limit, parcoursSlug],
  );
}

export type ReviewAnswer = { questionId: number; selected: number[]; isCorrect: boolean; box: number; dueAt: string };

export function getReviewSession(id: number, userId: string) {
  return queryOne<{ id: number; answers: ReviewAnswer[]; created_at: Date }>(
    "SELECT id, answers, created_at FROM review_sessions WHERE id = $1 AND user_id = $2",
    [id, userId],
  );
}

/* ------------------------------------------------------------------ */
/* Examens de module et examen final                                   */
/* ------------------------------------------------------------------ */

export type PoolQuestion = QuestionRow & { chapter_id: number; module_id: number; chapter_title: string };

/** Banque de questions d'un examen : celles d'un module, ou de tout le parcours (moduleId null). */
export function getExamPool(parcoursId: number, moduleId: number | null) {
  return query<PoolQuestion>(
    `SELECT q.id, q.position, q.prompt, q.code, q.options, q.correct, q.multiple, q.explanation,
            q.chapter_id, c.module_id, c.title AS chapter_title
     FROM questions q
     JOIN chapters c ON c.id = q.chapter_id
     JOIN modules m ON m.id = c.module_id
     WHERE m.parcours_id = $1 AND ($2::int IS NULL OR m.id = $2)
     ORDER BY c.global_position, q.position`,
    [parcoursId, moduleId],
  );
}

/**
 * Questions d'un examen pour une tentative donnée : réparties équitablement entre
 * les chapitres (examen de module) ou entre les modules (examen final).
 */
export function examDraw(
  pool: PoolQuestion[],
  userId: string,
  parcoursId: number,
  moduleId: number | null,
  attemptIndex: number,
): PoolQuestion[] {
  const key = (q: PoolQuestion) => (moduleId === null ? q.module_id : q.chapter_id);
  const groups = new Map<number, PoolQuestion[]>();
  for (const q of pool) groups.set(key(q), [...(groups.get(key(q)) ?? []), q]);
  const size = moduleId === null ? FINAL_EXAM_SIZE : MODULE_EXAM_SIZE;
  return drawBalanced([...groups.values()], size, examDrawSeed(userId, parcoursId, moduleId, attemptIndex));
}

export type ExamSummary = { module_id: number | null; attempts: number; best: number; passed: boolean; first_pass: Date | null };

/** Résumé des examens d'un apprenant pour un parcours (une ligne par module examiné, module_id null pour le final). */
export function getExamSummaries(userId: string, parcoursId: number) {
  return query<ExamSummary>(
    `SELECT module_id, count(*)::int AS attempts, max(score)::int AS best, bool_or(passed) AS passed,
            min(created_at) FILTER (WHERE passed) AS first_pass
     FROM exam_attempts WHERE user_id = $1 AND parcours_id = $2
     GROUP BY module_id`,
    [userId, parcoursId],
  );
}

export type ExamAnswer = { questionId: number; selected: number[]; isCorrect: boolean };

export type ExamAttemptRow = {
  id: number;
  parcours_id: number;
  module_id: number | null;
  score: number;
  correct_count: number;
  total: number;
  passed: boolean;
  answers: ExamAnswer[];
  created_at: Date;
};

export function getExamAttempt(id: number, userId: string) {
  return queryOne<ExamAttemptRow>("SELECT * FROM exam_attempts WHERE id = $1 AND user_id = $2", [id, userId]);
}

export function getQuestionsByIds(ids: number[]) {
  return query<QuestionRow & { chapter_title: string }>(
    `SELECT q.id, q.position, q.prompt, q.code, q.options, q.correct, q.multiple, q.explanation, c.title AS chapter_title
     FROM questions q JOIN chapters c ON c.id = q.chapter_id WHERE q.id = ANY($1::int[])`,
    [ids],
  );
}
