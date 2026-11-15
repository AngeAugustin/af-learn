import { seededShuffle } from "./quiz";

/** Nombre de questions tirées à chaque tentative d'évaluation de chapitre (toutes si la banque est plus petite). */
export const CHAPTER_DRAW = 10;
/** Taille de l'examen de fin de module. */
export const MODULE_EXAM_SIZE = 15;
/** Taille de l'examen final du parcours. */
export const FINAL_EXAM_SIZE = 30;
/** Nombre maximal de questions par séance de révision. */
export const REVIEW_BATCH = 15;

/** Intervalle avant la prochaine révision, en jours, pour chaque boîte (1 à 4). */
export const REVIEW_INTERVALS_DAYS: Record<number, number> = { 1: 1, 2: 7, 3: 30, 4: 90 };
export const MAX_BOX = 4;

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Planifie la révision suivante (système de Leitner) : une bonne réponse fait monter la carte
 * d'une boîte et espace la révision ; une erreur la ramène en boîte 1 (révision le lendemain).
 */
export function nextReview(box: number, isCorrect: boolean, now: Date): { box: number; dueAt: Date } {
  const current = Math.min(Math.max(Math.trunc(box), 1), MAX_BOX);
  const next = isCorrect ? Math.min(current + 1, MAX_BOX) : 1;
  return { box: next, dueAt: new Date(now.getTime() + REVIEW_INTERVALS_DAYS[next] * DAY_MS) };
}

/** Date de la première révision d'une question, quand son chapitre vient d'être validé. */
export function firstReviewDate(now: Date): Date {
  return new Date(now.getTime() + REVIEW_INTERVALS_DAYS[1] * DAY_MS);
}

/** Tire n éléments de façon déterministe (même graine → même tirage). */
export function drawQuestions<T>(items: T[], n: number, seed: string): T[] {
  return seededShuffle(items, seed).slice(0, Math.max(0, n));
}

/**
 * Tire n éléments répartis équitablement entre plusieurs groupes (chapitres ou modules) :
 * on prend à tour de rôle un élément dans chaque groupe mélangé, puis on mélange le résultat.
 */
export function drawBalanced<T>(groups: T[][], n: number, seed: string): T[] {
  const shuffled = groups.map((g, i) => seededShuffle(g, `${seed}-g${i}`)).filter((g) => g.length > 0);
  const order = seededShuffle(
    shuffled.map((_, i) => i),
    `${seed}-ordre`,
  );
  const picked: T[] = [];
  for (let round = 0; picked.length < n; round++) {
    let added = false;
    for (const gi of order) {
      if (picked.length >= n) break;
      const item = shuffled[gi][round];
      if (item !== undefined) {
        picked.push(item);
        added = true;
      }
    }
    if (!added) break;
  }
  return seededShuffle(picked, `${seed}-final`);
}

/** Graine du tirage d'une évaluation de chapitre, pour la n-ième tentative (0 pour la première). */
export function chapterDrawSeed(userId: string, chapterId: number, attemptIndex: number): string {
  return `${userId}-${chapterId}-${attemptIndex}`;
}

/** Graine du tirage d'un examen (moduleId null pour l'examen final). */
export function examDrawSeed(userId: string, parcoursId: number, moduleId: number | null, attemptIndex: number): string {
  return `${userId}-examen-${parcoursId}-${moduleId ?? "final"}-${attemptIndex}`;
}

/** Libellé humain d'une échéance de révision. */
export function describeDelay(days: number): string {
  if (days <= 1) return "demain";
  if (days < 30) return `dans ${days} jours`;
  if (days < 60) return "dans un mois";
  return `dans ${Math.round(days / 30)} mois`;
}

/** Nombre de questions du pré-test « Testez-vous avant de lire ». */
export const PRETEST_SIZE = 3;

/** Graine du pré-test d'un chapitre : toujours les mêmes questions pour un apprenant donné. */
export function pretestSeed(userId: string, chapterId: number): string {
  return `${userId}-pretest-${chapterId}`;
}
