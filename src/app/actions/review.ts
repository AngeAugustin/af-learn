"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { query, transaction } from "@/lib/db";
import { gradeQuiz, parseAnswers } from "@/lib/quiz";
import { nextReview } from "@/lib/memorisation";
import type { ReviewAnswer } from "@/lib/memorisation-queries";
import type { QuestionRow } from "@/lib/queries";

/** Corrige une séance de révision et replanifie chaque question (système de Leitner). */
export async function submitReviewAction(form: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");
  const parcours = String(form.get("parcours") ?? "");
  const back = parcours ? `/revisions?parcours=${encodeURIComponent(parcours)}` : "/revisions";

  const ids = String(form.get("questionIds") ?? "")
    .split(",")
    .map(Number)
    .filter((n) => Number.isInteger(n) && n > 0)
    .slice(0, 50);
  if (ids.length === 0) redirect(back);

  // Seules les questions réellement à réviser pour cet apprenant sont prises en compte
  const due = await query<QuestionRow & { box: number }>(
    `SELECT q.id, q.position, q.prompt, q.code, q.options, q.correct, q.multiple, q.explanation, rc.box
     FROM review_cards rc JOIN questions q ON q.id = rc.question_id
     WHERE rc.user_id = $1 AND rc.question_id = ANY($2::int[]) AND rc.due_at <= now()`,
    [user.id, ids],
  );
  if (due.length === 0) redirect(back);

  const answers = parseAnswers(
    form,
    due.map((q) => q.id),
    new Map(due.map((q) => [q.id, q.options.length])),
  );
  const grade = gradeQuiz(
    due.map((q) => ({ id: q.id, correct: q.correct })),
    answers,
  );
  const now = new Date();
  const boxById = new Map(due.map((q) => [q.id, q.box]));
  const order = new Map(ids.map((id, i) => [id, i]));
  const results: ReviewAnswer[] = grade.results
    .map((r) => {
      const next = nextReview(boxById.get(r.questionId)!, r.isCorrect, now);
      return { questionId: r.questionId, selected: r.selected, isCorrect: r.isCorrect, box: next.box, dueAt: next.dueAt.toISOString() };
    })
    .sort((a, b) => (order.get(a.questionId) ?? 0) - (order.get(b.questionId) ?? 0));

  const sessionId = await transaction(async (client) => {
    for (const r of results) {
      await client.query(
        `UPDATE review_cards
         SET box = $3, due_at = $4, reviews = reviews + 1, lapses = lapses + $5, last_reviewed_at = $6
         WHERE user_id = $1 AND question_id = $2`,
        [user.id, r.questionId, r.box, r.dueAt, r.isCorrect ? 0 : 1, now],
      );
    }
    const row = await client.query<{ id: number }>(
      "INSERT INTO review_sessions (user_id, answers) VALUES ($1, $2) RETURNING id",
      [user.id, JSON.stringify(results)],
    );
    return row.rows[0].id;
  });
  redirect(`${back}${back.includes("?") ? "&" : "?"}seance=${sessionId}`);
}
