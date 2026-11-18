"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { queryOne } from "@/lib/db";
import { getCourse, isCourseOpen } from "@/lib/queries";
import { gradeQuiz, parseAnswers } from "@/lib/quiz";
import { examDraw, getExamPool, getExamSummaries, type ExamAnswer } from "@/lib/memorisation-queries";
import { examAvailability } from "@/lib/exams";

/** Corrige et enregistre une tentative d'examen de module ou d'examen final. */
export async function submitExamAction(form: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");
  const parcoursSlug = String(form.get("parcours") ?? "");
  const scope = String(form.get("scope") ?? "");

  const course = await getCourse(parcoursSlug, user.id);
  if (!course || !isCourseOpen(course.parcours.status, user.role)) redirect("/tableau-de-bord");
  const mod = scope === "final" ? null : course.modules.find((m) => m.slug === scope);
  if (scope !== "final" && !mod) redirect(`/parcours/${course.parcours.slug}`);
  const href = `/examens/${course.parcours.slug}/${scope}`;
  if (!examAvailability(course, mod ?? null).open) redirect(href);

  const moduleId = mod?.id ?? null;
  const summaries = await getExamSummaries(user.id, course.parcours.id);
  // Même règle que l'évaluation de chapitre : seul le tirage de la tentative en cours est accepté.
  const drawIndex = summaries.find((s) => s.module_id === moduleId)?.attempts ?? 0;

  const questions = examDraw(await getExamPool(course.parcours.id, moduleId), user.id, course.parcours.id, moduleId, drawIndex);
  const answers = parseAnswers(
    form,
    questions.map((q) => q.id),
    new Map(questions.map((q) => [q.id, q.options.length])),
  );
  const grade = gradeQuiz(
    questions.map((q) => ({ id: q.id, correct: q.correct })),
    answers,
  );
  const stored: ExamAnswer[] = grade.results.map((r) => ({ questionId: r.questionId, selected: r.selected, isCorrect: r.isCorrect }));
  const attempt = await queryOne<{ id: number }>(
    `INSERT INTO exam_attempts (user_id, parcours_id, module_id, score, correct_count, total, passed, answers)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
    [user.id, course.parcours.id, moduleId, grade.score, grade.correctCount, grade.total, grade.passed, JSON.stringify(stored)],
  );
  redirect(`${href}?tentative=${attempt!.id}`);
}
