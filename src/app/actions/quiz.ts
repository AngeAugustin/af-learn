"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { queryOne } from "@/lib/db";
import { getCourse, getQuestions, isCourseOpen, type StoredAnswer } from "@/lib/queries";
import { gradeQuiz, parseAnswers } from "@/lib/quiz";
import { firstReviewDate } from "@/lib/memorisation";
import { chapterDraw, scheduleChapterReviews } from "@/lib/memorisation-queries";

/** Corrige et enregistre une tentative d'évaluation. La correction se fait uniquement côté serveur. */
export async function submitQuizAction(form: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");
  const parcoursSlug = String(form.get("parcours") ?? "");
  const chapterId = Number(form.get("chapterId"));

  const course = await getCourse(parcoursSlug, user.id);
  const chapter = course?.chapters.find((c) => c.id === chapterId);
  if (!course || !chapter || !isCourseOpen(course.parcours.status, user.role)) redirect("/tableau-de-bord");
  const base = `/parcours/${course.parcours.slug}/${chapter.moduleSlug}/${chapter.slug}`;
  if (!chapter.quizOpen) redirect(`${base}/evaluation`);

  // Le tirage est celui de la tentative en cours. L'index envoyé par le formulaire est ignoré :
  // sinon on pourrait rejouer un ancien tirage dont on connaît déjà les bonnes réponses.
  const questions = chapterDraw(await getQuestions(chapter.id), user.id, chapter.id, chapter.attempts);
  const answers = parseAnswers(
    form,
    questions.map((q) => q.id),
    new Map(questions.map((q) => [q.id, q.options.length])),
  );
  const grade = gradeQuiz(
    questions.map((q) => ({ id: q.id, correct: q.correct })),
    answers,
  );
  const positionById = new Map(questions.map((q) => [q.id, q.position]));
  const stored: StoredAnswer[] = grade.results.map((r) => ({
    position: positionById.get(r.questionId)!,
    selected: r.selected,
    isCorrect: r.isCorrect,
  }));
  const attempt = await queryOne<{ id: number }>(
    `INSERT INTO quiz_attempts (user_id, chapter_id, score, correct_count, total, passed, answers)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
    [user.id, chapter.id, grade.score, grade.correctCount, grade.total, grade.passed, JSON.stringify(stored)],
  );
  // Chapitre validé : toutes ses questions rejoignent les révisions espacées
  if (grade.passed) await scheduleChapterReviews(user.id, chapter.id, firstReviewDate(new Date()));
  redirect(`${base}/evaluation?tentative=${attempt!.id}`);
}
