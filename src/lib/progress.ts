export type ChapterState = "locked" | "available" | "in_progress" | "passed";

export type ChapterProgressInput = {
  id: number;
  sectionCount: number;
  completedSections: number;
  passed: boolean;
};

/**
 * Détermine l'état de chaque chapitre, dans l'ordre du parcours.
 * Un chapitre est accessible si c'est le premier, ou si le précédent a été validé (≥ 75 %).
 */
export function computeChapterStates(chapters: ChapterProgressInput[]): ChapterState[] {
  return chapters.map((chapter, index) => {
    if (chapter.passed) return "passed";
    const unlocked = index === 0 || chapters[index - 1].passed;
    if (!unlocked) return "locked";
    return chapter.completedSections > 0 ? "in_progress" : "available";
  });
}

/** L'évaluation d'un chapitre n'est ouverte qu'une fois toutes ses sections lues. */
export function isQuizOpen(chapter: ChapterProgressInput, state: ChapterState): boolean {
  return state !== "locked" && chapter.completedSections >= chapter.sectionCount;
}

export function percent(part: number, total: number): number {
  return total === 0 ? 0 : Math.round((part * 100) / total);
}
