import { describe, expect, it } from "vitest";
import { computeChapterStates, isQuizOpen, percent } from "@/lib/progress";

const ch = (id: number, completedSections: number, passed: boolean, sectionCount = 4) => ({
  id,
  sectionCount,
  completedSections,
  passed,
});

describe("computeChapterStates", () => {
  it("n'ouvre que le premier chapitre au départ", () => {
    expect(computeChapterStates([ch(1, 0, false), ch(2, 0, false), ch(3, 0, false)])).toEqual([
      "available",
      "locked",
      "locked",
    ]);
  });

  it("débloque le chapitre suivant uniquement après validation du précédent", () => {
    expect(computeChapterStates([ch(1, 4, true), ch(2, 2, false), ch(3, 0, false)])).toEqual([
      "passed",
      "in_progress",
      "locked",
    ]);
  });

  it("un chapitre lu mais non validé ne débloque pas la suite", () => {
    expect(computeChapterStates([ch(1, 4, false), ch(2, 0, false)])).toEqual(["in_progress", "locked"]);
  });

  it("conserve l'état validé même si un chapitre antérieur ne l'est plus (contenu réorganisé)", () => {
    expect(computeChapterStates([ch(1, 0, false), ch(2, 4, true)])).toEqual(["available", "passed"]);
  });
});

describe("isQuizOpen", () => {
  it("exige la lecture de toutes les sections", () => {
    expect(isQuizOpen(ch(1, 3, false), "in_progress")).toBe(false);
    expect(isQuizOpen(ch(1, 4, false), "in_progress")).toBe(true);
  });

  it("reste fermée pour un chapitre verrouillé", () => {
    expect(isQuizOpen(ch(1, 4, false), "locked")).toBe(false);
  });
});

describe("percent", () => {
  it("gère le total nul et arrondit", () => {
    expect(percent(0, 0)).toBe(0);
    expect(percent(1, 3)).toBe(33);
    expect(percent(2, 3)).toBe(67);
  });
});
