import "server-only";
import { query, queryOne } from "./db";

/** Toutes les données personnelles d'un compte (droit d'accès et de portabilité). */
export async function exportUserData(id: string): Promise<Record<string, unknown> | null> {
  const account = await queryOne<{ id: string; name: string; email: string; created_at: Date; email_verified_at: Date | null }>(
    "SELECT id, name, email, created_at, email_verified_at FROM users WHERE id = $1",
    [id],
  );
  if (!account) return null;

  const [progress, quizzes, exams, reviews, certificates, messages] = await Promise.all([
    query(
      `SELECT p.slug AS parcours, m.slug AS module, c.slug AS chapitre, s.slug AS section, sp.completed_at
       FROM section_progress sp
       JOIN sections s ON s.id = sp.section_id JOIN chapters c ON c.id = s.chapter_id
       JOIN modules m ON m.id = c.module_id JOIN parcours p ON p.id = m.parcours_id
       WHERE sp.user_id = $1 ORDER BY sp.completed_at`,
      [id],
    ),
    query(
      `SELECT c.slug AS chapitre, a.score, a.correct_count, a.total, a.passed, a.answers, a.created_at
       FROM quiz_attempts a JOIN chapters c ON c.id = a.chapter_id WHERE a.user_id = $1 ORDER BY a.created_at`,
      [id],
    ),
    query(
      `SELECT p.slug AS parcours, m.slug AS module, e.score, e.correct_count, e.total, e.passed, e.answers, e.created_at
       FROM exam_attempts e JOIN parcours p ON p.id = e.parcours_id LEFT JOIN modules m ON m.id = e.module_id
       WHERE e.user_id = $1 ORDER BY e.created_at`,
      [id],
    ),
    query(
      "SELECT question_id, box, due_at, reviews, lapses, last_reviewed_at, created_at FROM review_cards WHERE user_id = $1",
      [id],
    ),
    query(
      `SELECT c.code, p.slug AS parcours, c.holder_name, c.module_count, c.chapter_count, c.minutes,
              c.final_score, c.average_score, c.issued_at, c.revoked_at
       FROM certificates c JOIN parcours p ON p.id = c.parcours_id WHERE c.user_id = $1`,
      [id],
    ),
    query("SELECT name, email, subject, message, created_at FROM contact_messages WHERE user_id = $1 ORDER BY created_at", [id]),
  ]);

  return {
    exporte_le: new Date().toISOString(),
    compte: {
      id: account.id,
      nom: account.name,
      email: account.email,
      cree_le: account.created_at,
      email_confirme_le: account.email_verified_at,
    },
    progression_sections: progress,
    evaluations_chapitres: quizzes,
    examens: exams,
    cartes_revision: reviews,
    attestations: certificates,
    messages_contact: messages,
  };
}

export function jsonDownload(data: unknown, filename: string): Response {
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
