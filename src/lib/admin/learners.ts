import "server-only";
import { query, queryOne } from "../db";

/** Chapitres par parcours et chapitres validés par apprenant, réutilisés par plusieurs requêtes. */
const PROGRESS_CTES = `
  ch AS (SELECT c.id, m.parcours_id FROM chapters c JOIN modules m ON m.id = c.module_id),
  tot AS (SELECT parcours_id, count(*)::int AS n FROM ch GROUP BY parcours_id),
  val AS (
    SELECT a.user_id, ch.parcours_id, count(DISTINCT a.chapter_id)::int AS n
    FROM quiz_attempts a JOIN ch ON ch.id = a.chapter_id WHERE a.passed GROUP BY 1, 2
  ),
  prog AS (
    SELECT v.user_id,
           json_agg(json_build_object('slug', p.slug, 'title', p.title, 'done', v.n, 'total', t.n)
                    ORDER BY v.n::float / t.n DESC) AS courses,
           max(round(100.0 * v.n / t.n))::int AS best_pct,
           sum(v.n)::int AS chapters
    FROM val v JOIN tot t USING (parcours_id) JOIN parcours p ON p.id = v.parcours_id
    GROUP BY v.user_id
  ),
  act AS (
    SELECT u.id AS user_id, GREATEST(
      u.last_seen_at,
      (SELECT max(completed_at) FROM section_progress WHERE user_id = u.id),
      (SELECT max(created_at) FROM quiz_attempts WHERE user_id = u.id),
      (SELECT max(created_at) FROM exam_attempts WHERE user_id = u.id),
      (SELECT max(created_at) FROM review_sessions WHERE user_id = u.id)
    ) AS last_active
    FROM users u
  )`;

export const ACTIVE_DAYS = 30;

export type LearnerFilters = {
  q?: string;
  parcours?: string;
  statut?: string; // actif | inactif | suspendu | admin
  attestation?: string; // oui | non
  tri?: string; // inscription | activite | progression | nom
  page?: number;
};

export type LearnerListRow = {
  id: string;
  name: string;
  email: string;
  role: "learner" | "admin";
  created_at: Date;
  suspended_at: Date | null;
  last_active: Date | null;
  best_pct: number;
  chapters: number;
  courses: { slug: string; title: string; done: number; total: number }[];
  certs: number;
  total: number;
};

export const PAGE_SIZE = 25;

const ORDER: Record<string, string> = {
  inscription: "u.created_at DESC",
  activite: "act.last_active DESC NULLS LAST",
  progression: "coalesce(prog.best_pct, 0) DESC, u.created_at DESC",
  nom: "lower(u.name) ASC",
};

/** Liste filtrée des comptes. `limit` à null renvoie tout (export CSV). */
export function listLearners(f: LearnerFilters, limit: number | null = PAGE_SIZE) {
  const params: unknown[] = [];
  const where: string[] = [];
  const p = (v: unknown) => {
    params.push(v);
    return `$${params.length}`;
  };
  const q = f.q?.trim();
  if (q) {
    const like = p(`%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`);
    where.push(`(u.name ILIKE ${like} OR u.email ILIKE ${like})`);
  }
  if (f.parcours) {
    where.push(`EXISTS (
      SELECT 1 FROM section_progress sp JOIN sections s ON s.id = sp.section_id
      JOIN chapters c ON c.id = s.chapter_id JOIN modules m ON m.id = c.module_id JOIN parcours pa ON pa.id = m.parcours_id
      WHERE sp.user_id = u.id AND pa.slug = ${p(f.parcours)})`);
  }
  if (f.statut === "actif") where.push(`act.last_active > now() - interval '${ACTIVE_DAYS} days' AND u.suspended_at IS NULL`);
  if (f.statut === "inactif")
    where.push(`(act.last_active IS NULL OR act.last_active <= now() - interval '${ACTIVE_DAYS} days') AND u.suspended_at IS NULL`);
  if (f.statut === "suspendu") where.push("u.suspended_at IS NOT NULL");
  if (f.statut === "admin") where.push("u.role = 'admin'");
  const hasCert = "EXISTS (SELECT 1 FROM certificates c WHERE c.user_id = u.id AND c.revoked_at IS NULL)";
  if (f.attestation === "oui") where.push(hasCert);
  if (f.attestation === "non") where.push(`NOT ${hasCert}`);

  let page = "";
  if (limit !== null) {
    const offset = Math.max(0, ((f.page ?? 1) - 1) * limit);
    page = `LIMIT ${p(limit)} OFFSET ${p(offset)}`;
  }

  return query<LearnerListRow>(
    `WITH ${PROGRESS_CTES}
     SELECT u.id, u.name, u.email, u.role, u.created_at, u.suspended_at, act.last_active,
            coalesce(prog.best_pct, 0) AS best_pct, coalesce(prog.chapters, 0) AS chapters,
            coalesce(prog.courses, '[]'::json) AS courses,
            (SELECT count(*)::int FROM certificates c WHERE c.user_id = u.id AND c.revoked_at IS NULL) AS certs,
            count(*) OVER ()::int AS total
     FROM users u JOIN act ON act.user_id = u.id LEFT JOIN prog ON prog.user_id = u.id
     ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
     ORDER BY ${ORDER[f.tri ?? ""] ?? ORDER.inscription}
     ${page}`,
    params,
  );
}

export type LearnerAccount = {
  id: string;
  name: string;
  email: string;
  role: "learner" | "admin";
  created_at: Date;
  suspended_at: Date | null;
  last_seen_at: Date | null;
  last_active: Date | null;
};

export function getLearner(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return Promise.resolve(null);
  return queryOne<LearnerAccount>(
    `WITH ${PROGRESS_CTES}
     SELECT u.id, u.name, u.email, u.role, u.created_at, u.suspended_at, u.last_seen_at, act.last_active
     FROM users u JOIN act ON act.user_id = u.id WHERE u.id = $1`,
    [id],
  );
}

/** Parcours dans lesquels l'apprenant a au moins lu une section ou tenté une évaluation. */
export function startedCourseSlugs(userId: string) {
  return query<{ slug: string }>(
    `SELECT p.slug FROM parcours p WHERE EXISTS (
       SELECT 1 FROM section_progress sp JOIN sections s ON s.id = sp.section_id JOIN chapters c ON c.id = s.chapter_id
       JOIN modules m ON m.id = c.module_id WHERE sp.user_id = $1 AND m.parcours_id = p.id
     ) OR EXISTS (SELECT 1 FROM exam_attempts e WHERE e.user_id = $1 AND e.parcours_id = p.id)
     ORDER BY p.position`,
    [userId],
  );
}

export function learnerSessions(userId: string) {
  return query<{ created_at: Date; expires_at: Date }>(
    "SELECT created_at, expires_at FROM sessions WHERE user_id = $1 AND expires_at > now() ORDER BY created_at DESC",
    [userId],
  );
}

export function learnerQuizHistory(userId: string, limit = 40) {
  return query<{
    id: number;
    score: number;
    passed: boolean;
    correct_count: number;
    total: number;
    created_at: Date;
    chapter_title: string;
    parcours_title: string;
  }>(
    `SELECT a.id, a.score, a.passed, a.correct_count, a.total, a.created_at, c.title AS chapter_title, p.title AS parcours_title
     FROM quiz_attempts a JOIN chapters c ON c.id = a.chapter_id JOIN modules m ON m.id = c.module_id JOIN parcours p ON p.id = m.parcours_id
     WHERE a.user_id = $1 ORDER BY a.created_at DESC LIMIT $2`,
    [userId, limit],
  );
}

export function learnerExamHistory(userId: string) {
  return query<{
    id: number;
    score: number;
    passed: boolean;
    created_at: Date;
    parcours_title: string;
    module_title: string | null;
  }>(
    `SELECT e.id, e.score, e.passed, e.created_at, p.title AS parcours_title, m.title AS module_title
     FROM exam_attempts e JOIN parcours p ON p.id = e.parcours_id LEFT JOIN modules m ON m.id = e.module_id
     WHERE e.user_id = $1 ORDER BY e.created_at DESC`,
    [userId],
  );
}

export async function learnerReviews(userId: string) {
  const cards = await queryOne<{ total: number; due: number; mastered: number; lapses: number }>(
    `SELECT count(*)::int AS total, count(*) FILTER (WHERE due_at <= now())::int AS due,
            count(*) FILTER (WHERE box = 4)::int AS mastered, coalesce(sum(lapses), 0)::int AS lapses
     FROM review_cards WHERE user_id = $1`,
    [userId],
  );
  const sessions = await queryOne<{ sessions: number; answers: number; correct: number; last: Date | null }>(
    `SELECT count(DISTINCT s.id)::int AS sessions, count(a.v)::int AS answers,
            count(a.v) FILTER (WHERE (a.v ->> 'isCorrect')::boolean)::int AS correct, max(s.created_at) AS last
     FROM review_sessions s LEFT JOIN LATERAL jsonb_array_elements(s.answers) AS a(v) ON true WHERE s.user_id = $1`,
    [userId],
  );
  return { ...cards!, ...sessions! };
}

export function learnerCertificates(userId: string) {
  return query<{
    code: string;
    parcours_title: string;
    issued_at: Date;
    final_score: number;
    revoked_at: Date | null;
    revoked_reason: string | null;
  }>(
    `SELECT c.code, p.title AS parcours_title, c.issued_at, c.final_score, c.revoked_at, c.revoked_reason
     FROM certificates c JOIN parcours p ON p.id = c.parcours_id WHERE c.user_id = $1 ORDER BY c.issued_at`,
    [userId],
  );
}
