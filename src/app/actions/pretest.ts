"use server";

import { getCurrentUser } from "@/lib/auth";
import { queryOne } from "@/lib/db";
import { getCourse, getQuestions, isCourseOpen } from "@/lib/queries";
import { pretestDraw } from "@/lib/memorisation-queries";
import { gradeQuiz } from "@/lib/quiz";

export type PretestCorrection = {
  id: number;
  isCorrect: boolean;
};

/**
 * Corrige le pré-test « Testez-vous avant de lire ». Rien n'est enregistré.
 * On ne renvoie que juste ou faux : les bonnes options et l'explication restent
 * cachées jusqu'à la validation du chapitre, car ces questions sont dans la banque notée.
 * Un chapitre verrouillé ou un parcours fermé ne renvoie rien.
 */
export async function checkPretestAction(chapterId: number, answers: Record<string, number[]>): Promise<PretestCorrection[]> {
  const user = await getCurrentUser();
  if (!user || !Number.isInteger(chapterId) || chapterId <= 0) return [];

  const row = await queryOne<{ slug: string; status: "published" | "coming_soon" | "hidden" }>(
    `SELECT p.slug, p.status FROM chapters c
     JOIN modules m ON m.id = c.module_id JOIN parcours p ON p.id = m.parcours_id
     WHERE c.id = $1`,
    [chapterId],
  );
  if (!row || !isCourseOpen(row.status, user.role)) return [];
  const course = await getCourse(row.slug, user.id);
  const chapter = course?.chapters.find((c) => c.id === chapterId);
  if (!chapter || chapter.state === "locked") return [];

  const drawn = pretestDraw(await getQuestions(chapterId), user.id, chapterId);
  if (drawn.length === 0) return [];
  const selected: Record<number, number[]> = {};
  for (const q of drawn) {
    const raw = Array.isArray(answers?.[String(q.id)]) ? answers[String(q.id)] : [];
    const valid = [...new Set(raw.filter((i) => Number.isInteger(i) && i >= 0 && i < q.options.length))];
    selected[q.id] = q.multiple ? valid : valid.slice(0, 1);
  }

  const grade = gradeQuiz(
    drawn.map((q) => ({ id: q.id, correct: q.correct })),
    selected,
  );
  return drawn.map((q, i) => ({
    id: q.id,
    isCorrect: grade.results[i]?.isCorrect ?? false,
  }));
}
