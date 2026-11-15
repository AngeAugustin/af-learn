import { PASS_THRESHOLD } from "./content/parse";

export { PASS_THRESHOLD };

export type GradableQuestion = {
  id: number;
  correct: number[];
};

export type QuestionResult = {
  questionId: number;
  selected: number[];
  isCorrect: boolean;
};

export type GradeResult = {
  results: QuestionResult[];
  correctCount: number;
  total: number;
  /** Pourcentage arrondi à l'entier inférieur, pour ne jamais surévaluer une réussite. */
  score: number;
  passed: boolean;
};

function sameSet(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const set = new Set(a);
  return b.every((x) => set.has(x));
}

/**
 * Corrige une évaluation. Une question n'est juste que si l'ensemble des options
 * cochées correspond exactement à l'ensemble des bonnes réponses (pas de point partiel).
 */
export function gradeQuiz(
  questions: GradableQuestion[],
  answers: Record<number, number[]>,
): GradeResult {
  if (questions.length === 0) throw new Error("Évaluation sans question");
  const results = questions.map((q) => {
    const selected = [...new Set(answers[q.id] ?? [])].sort((x, y) => x - y);
    return { questionId: q.id, selected, isCorrect: sameSet(selected, q.correct) };
  });
  const correctCount = results.filter((r) => r.isCorrect).length;
  const total = questions.length;
  const score = Math.floor((correctCount * 100) / total);
  return { results, correctCount, total, score, passed: score >= PASS_THRESHOLD };
}

/** Nombre minimal de bonnes réponses pour atteindre le seuil. */
export function requiredCorrect(total: number): number {
  return Math.ceil((PASS_THRESHOLD * total) / 100);
}

/** Lit les réponses d'un formulaire : champs `q-<id>` (une ou plusieurs valeurs). */
export function parseAnswers(form: FormData, questionIds: number[], optionCounts: Map<number, number>) {
  const answers: Record<number, number[]> = {};
  for (const id of questionIds) {
    const max = optionCounts.get(id) ?? 0;
    answers[id] = form
      .getAll(`q-${id}`)
      .map((v) => Number(v))
      .filter((n) => Number.isInteger(n) && n >= 0 && n < max);
  }
  return answers;
}

/** Mélange déterministe (graine) : même ordre pour un même utilisateur et une même tentative. */
export function seededShuffle<T>(items: T[], seed: string): T[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const random = () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
