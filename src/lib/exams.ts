/** Règles d'ouverture des examens (sans accès à la base, pour être testables). */

type CourseLike = { chapters: { module_id: number; passed: boolean }[] };

export type ExamAvailability = { open: boolean; remaining: number; total: number };

/**
 * Un examen de module s'ouvre quand tous les chapitres du module sont validés ;
 * l'examen final (mod = null) quand tous les chapitres du parcours le sont.
 */
export function examAvailability(course: CourseLike, mod: { id: number } | null): ExamAvailability {
  const chapters = mod ? course.chapters.filter((c) => c.module_id === mod.id) : course.chapters;
  const remaining = chapters.filter((c) => !c.passed).length;
  return { open: chapters.length > 0 && remaining === 0, remaining, total: chapters.length };
}

/** L'attestation exige tous les chapitres validés et l'examen final réussi. */
export function certificateReady(course: CourseLike, finalExamPassed: boolean): boolean {
  return examAvailability(course, null).open && finalExamPassed;
}
