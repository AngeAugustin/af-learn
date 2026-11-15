import "server-only";
import { query, queryOne } from "../db";
import { ACTIVE_DAYS } from "./learners";

export const PERIODS = [7, 30, 90] as const;
export function parsePeriod(value: string | undefined): number {
  const n = Number(value);
  return (PERIODS as readonly number[]).includes(n) ? n : 30;
}

export function getOverviewKpis() {
  return queryOne<{
    users: number;
    new7: number;
    new30: number;
    active7: number;
    active30: number;
    validated: number;
    certificates: number;
    visitors7: number;
  }>(
    `WITH activity AS (
       SELECT user_id, completed_at AS at FROM section_progress
       UNION ALL SELECT user_id, created_at FROM quiz_attempts
       UNION ALL SELECT user_id, created_at FROM exam_attempts
       UNION ALL SELECT user_id, created_at FROM review_sessions
       UNION ALL SELECT id, last_seen_at FROM users WHERE last_seen_at IS NOT NULL
     )
     SELECT
       (SELECT count(*)::int FROM users) AS users,
       (SELECT count(*)::int FROM users WHERE created_at > now() - interval '7 days') AS new7,
       (SELECT count(*)::int FROM users WHERE created_at > now() - interval '30 days') AS new30,
       (SELECT count(DISTINCT user_id)::int FROM activity WHERE at > now() - interval '7 days') AS active7,
       (SELECT count(DISTINCT user_id)::int FROM activity WHERE at > now() - interval '${ACTIVE_DAYS} days') AS active30,
       (SELECT count(*)::int FROM (SELECT DISTINCT user_id, chapter_id FROM quiz_attempts WHERE passed) v) AS validated,
       (SELECT count(*)::int FROM certificates WHERE revoked_at IS NULL) AS certificates,
       (SELECT coalesce(sum(n), 0)::int FROM (
          SELECT count(DISTINCT visitor) AS n FROM page_views WHERE day > current_date - 7 GROUP BY day) d) AS visitors7`,
  );
}

export type DailyPoint = { day: string; value: number };

/** Une valeur par jour sur la période (jours sans donnée inclus, à 0). */
export function dailySignups(days: number) {
  return query<DailyPoint>(
    `SELECT to_char(d, 'YYYY-MM-DD') AS day, count(u.id)::int AS value
     FROM generate_series(current_date - ($1::int - 1), current_date, interval '1 day') d
     LEFT JOIN users u ON u.created_at::date = d::date
     GROUP BY d ORDER BY d`,
    [days],
  );
}

export function dailyActiveLearners(days: number) {
  return query<DailyPoint>(
    `WITH activity AS (
       SELECT user_id, completed_at::date AS day FROM section_progress
       UNION SELECT user_id, created_at::date FROM quiz_attempts
       UNION SELECT user_id, created_at::date FROM exam_attempts
       UNION SELECT user_id, created_at::date FROM review_sessions
     )
     SELECT to_char(d, 'YYYY-MM-DD') AS day, count(DISTINCT a.user_id)::int AS value
     FROM generate_series(current_date - ($1::int - 1), current_date, interval '1 day') d
     LEFT JOIN activity a ON a.day = d::date
     GROUP BY d ORDER BY d`,
    [days],
  );
}

export type FunnelRow = {
  slug: string;
  title: string;
  chapters: number;
  started: number;
  first_validated: number;
  halfway: number;
  final_attempted: number;
  certified: number;
};

/** Entonnoir par parcours publié : 1re section lue, 1er chapitre validé, moitié, examen final, attestation. */
export async function getFunnels() {
  const users = await queryOne<{ n: number }>("SELECT count(*)::int AS n FROM users");
  const rows = await query<FunnelRow>(
    `WITH ch AS (SELECT c.id, m.parcours_id FROM chapters c JOIN modules m ON m.id = c.module_id),
     tot AS (SELECT parcours_id, count(*)::int AS n FROM ch GROUP BY parcours_id),
     started AS (
       SELECT DISTINCT sp.user_id, ch.parcours_id FROM section_progress sp
       JOIN sections s ON s.id = sp.section_id JOIN ch ON ch.id = s.chapter_id
     ),
     val AS (
       SELECT a.user_id, ch.parcours_id, count(DISTINCT a.chapter_id) AS n
       FROM quiz_attempts a JOIN ch ON ch.id = a.chapter_id WHERE a.passed GROUP BY 1, 2
     )
     SELECT p.slug, p.title, tot.n AS chapters,
       (SELECT count(*)::int FROM started s WHERE s.parcours_id = p.id) AS started,
       (SELECT count(*)::int FROM val v WHERE v.parcours_id = p.id) AS first_validated,
       (SELECT count(*)::int FROM val v WHERE v.parcours_id = p.id AND v.n * 2 >= tot.n) AS halfway,
       (SELECT count(DISTINCT e.user_id)::int FROM exam_attempts e WHERE e.parcours_id = p.id AND e.module_id IS NULL) AS final_attempted,
       (SELECT count(*)::int FROM certificates c WHERE c.parcours_id = p.id AND c.revoked_at IS NULL) AS certified
     FROM parcours p JOIN tot ON tot.parcours_id = p.id
     WHERE p.status = 'published' ORDER BY p.position`,
  );
  return { users: users?.n ?? 0, rows };
}

/* ---------- Audience ---------- */

export async function getTraffic(days: number) {
  const since = `day > current_date - ${days}`;
  const [daily, totals, pages, referrers, campaigns, devices, signups] = await Promise.all([
    query<{ day: string; views: number; visitors: number }>(
      `SELECT to_char(d, 'YYYY-MM-DD') AS day, count(v.id)::int AS views, count(DISTINCT v.visitor)::int AS visitors
       FROM generate_series(current_date - ($1::int - 1), current_date, interval '1 day') d
       LEFT JOIN page_views v ON v.day = d::date GROUP BY d ORDER BY d`,
      [days],
    ),
    queryOne<{ views: number; visits: number }>(
      `SELECT coalesce(sum(views), 0)::int AS views, coalesce(sum(visitors), 0)::int AS visits FROM (
         SELECT count(*) AS views, count(DISTINCT visitor) AS visitors FROM page_views WHERE ${since} GROUP BY day) d`,
    ),
    query<{ path: string; views: number; visitors: number }>(
      `SELECT path, count(*)::int AS views, count(DISTINCT (day, visitor))::int AS visitors
       FROM page_views WHERE ${since} GROUP BY path ORDER BY views DESC LIMIT 15`,
    ),
    query<{ label: string; visitors: number }>(
      `SELECT referrer_host AS label, count(DISTINCT (day, visitor))::int AS visitors
       FROM page_views WHERE ${since} AND referrer_host IS NOT NULL GROUP BY 1 ORDER BY 2 DESC LIMIT 10`,
    ),
    query<{ label: string; visitors: number }>(
      `SELECT utm_source AS label, count(DISTINCT (day, visitor))::int AS visitors
       FROM page_views WHERE ${since} AND utm_source IS NOT NULL GROUP BY 1 ORDER BY 2 DESC LIMIT 10`,
    ),
    query<{ label: string; visitors: number }>(
      `SELECT device AS label, count(DISTINCT (day, visitor))::int AS visitors
       FROM page_views WHERE ${since} GROUP BY 1 ORDER BY 2 DESC`,
    ),
    queryOne<{ n: number }>(`SELECT count(*)::int AS n FROM users WHERE created_at::date > current_date - ${days}`),
  ]);
  return { daily, totals: totals!, pages, referrers, campaigns, devices, signups: signups?.n ?? 0 };
}

/* ---------- Pédagogie ---------- */

export type HardQuestion = {
  id: number;
  prompt: string;
  chapter_title: string;
  parcours_title: string;
  chapter_id: number;
  parcours_slug: string;
  answers: number;
  wrong: number;
  fail_rate: number;
};

/** Questions les plus ratées aux évaluations de chapitre (au moins `minAnswers` réponses). */
export function hardestQuestions(minAnswers = 3, limit = 15) {
  return query<HardQuestion>(
    `WITH ans AS (
       SELECT a.chapter_id, (x.v ->> 'position')::int AS position, (x.v ->> 'isCorrect')::boolean AS ok
       FROM quiz_attempts a CROSS JOIN LATERAL jsonb_array_elements(a.answers) AS x(v)
     )
     SELECT q.id, q.prompt, c.title AS chapter_title, p.title AS parcours_title, c.id AS chapter_id, p.slug AS parcours_slug,
            count(*)::int AS answers, count(*) FILTER (WHERE NOT ans.ok)::int AS wrong,
            round(100.0 * count(*) FILTER (WHERE NOT ans.ok) / count(*))::int AS fail_rate
     FROM ans JOIN questions q ON q.chapter_id = ans.chapter_id AND q.position = ans.position
     JOIN chapters c ON c.id = q.chapter_id JOIN modules m ON m.id = c.module_id JOIN parcours p ON p.id = m.parcours_id
     GROUP BY q.id, c.id, c.title, p.slug, p.title
     HAVING count(*) >= $1
     ORDER BY fail_rate DESC, answers DESC LIMIT $2`,
    [minAnswers, limit],
  );
}

export type ChapterDifficulty = {
  id: number;
  title: string;
  parcours_title: string;
  learners: number;
  attempts: number;
  passed_learners: number;
  fail_rate: number;
  avg_attempts_to_pass: number | null;
  stuck: number;
};

/**
 * Chapitres bloquants : taux d'échec des tentatives, nombre moyen d'essais avant réussite et
 * apprenants « décrochés » (chapitre commencé, non validé, aucune activité depuis 14 jours).
 */
export function blockingChapters(limit = 15) {
  return query<ChapterDifficulty>(
    `WITH per_user AS (
       SELECT a.user_id, a.chapter_id, count(*) AS n, bool_or(a.passed) AS passed,
              count(*) FILTER (WHERE NOT a.passed) AS fails
       FROM quiz_attempts a GROUP BY 1, 2
     ),
     started AS (
       SELECT DISTINCT sp.user_id, s.chapter_id, max(sp.completed_at) OVER (PARTITION BY sp.user_id) AS last_at
       FROM section_progress sp JOIN sections s ON s.id = sp.section_id
     )
     SELECT c.id, c.title, p.title AS parcours_title,
            count(pu.user_id)::int AS learners,
            coalesce(sum(pu.n), 0)::int AS attempts,
            count(pu.user_id) FILTER (WHERE pu.passed)::int AS passed_learners,
            CASE WHEN sum(pu.n) > 0 THEN round(100.0 * sum(pu.fails) / sum(pu.n))::int ELSE 0 END AS fail_rate,
            round(avg(pu.n) FILTER (WHERE pu.passed), 1)::float AS avg_attempts_to_pass,
            (SELECT count(*)::int FROM started st
              WHERE st.chapter_id = c.id AND st.last_at < now() - interval '14 days'
                AND NOT EXISTS (SELECT 1 FROM quiz_attempts q WHERE q.user_id = st.user_id AND q.chapter_id = c.id AND q.passed)) AS stuck
     FROM chapters c JOIN modules m ON m.id = c.module_id JOIN parcours p ON p.id = m.parcours_id
     JOIN per_user pu ON pu.chapter_id = c.id
     GROUP BY c.id, p.title
     ORDER BY fail_rate DESC, attempts DESC LIMIT $1`,
    [limit],
  );
}

/** Durée entre la première section lue d'un parcours et l'attestation, par parcours. */
export function completionTimes() {
  return query<{ title: string; certified: number; avg_days: number | null; median_days: number | null }>(
    `WITH firsts AS (
       SELECT sp.user_id, m.parcours_id, min(sp.completed_at) AS started_at
       FROM section_progress sp JOIN sections s ON s.id = sp.section_id
       JOIN chapters c ON c.id = s.chapter_id JOIN modules m ON m.id = c.module_id GROUP BY 1, 2
     ),
     durations AS (
       SELECT ce.parcours_id, extract(epoch FROM ce.issued_at - f.started_at) / 86400 AS days
       FROM certificates ce JOIN firsts f ON f.user_id = ce.user_id AND f.parcours_id = ce.parcours_id
       WHERE ce.revoked_at IS NULL
     )
     SELECT p.title, count(d.days)::int AS certified,
            round(avg(d.days)::numeric, 1)::float AS avg_days,
            round((percentile_cont(0.5) WITHIN GROUP (ORDER BY d.days))::numeric, 1)::float AS median_days
     FROM parcours p LEFT JOIN durations d ON d.parcours_id = p.id
     WHERE p.status = 'published' GROUP BY p.id ORDER BY p.position`,
  );
}
