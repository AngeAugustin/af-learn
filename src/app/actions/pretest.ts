"use server";

import { getCurrentUser } from "@/lib/auth";
import { getQuestions } from "@/lib/queries";
import { pretestDraw } from "@/lib/memorisation-queries";
import { gradeQuiz } from "@/lib/quiz";

export type PretestCorrection = {
  id: number;
  correct: number[];
  isCorrect: boolean;
  explanation: string;
};

/**
 * Corrige le pré-test « Testez-vous avant de lire ». Rien n'est enregistré : il sert seulement
 * à activer la curiosité avant la lecture. Seules les questions du pré-test de cet apprenant
 * pour ce chapitre sont corrigées.
 */
export async function checkPretestAction(chapterId: number, answers: Record<string, number[]>): Promise<PretestCorrection[]> {
  const user = await getCurrentUser();
  if (!user || !Number.isInteger(chapterId) || chapterId <= 0) return [];

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
    correct: q.correct,
    isCorrect: grade.results[i]?.isCorrect ?? false,
    explanation: q.explanation,
  }));
}
