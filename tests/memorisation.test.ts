import { describe, expect, it } from "vitest";
import {
  CHAPTER_DRAW,
  FINAL_EXAM_SIZE,
  MODULE_EXAM_SIZE,
  chapterDrawSeed,
  describeDelay,
  drawBalanced,
  drawQuestions,
  firstReviewDate,
  nextReview,
  PRETEST_SIZE,
  pretestSeed,
} from "@/lib/memorisation";
import { certificateReady, examAvailability } from "@/lib/exams";

const DAY = 24 * 60 * 60 * 1000;
const now = new Date("2026-11-14T10:00:00Z");
const daysAfter = (d: Date) => Math.round((d.getTime() - now.getTime()) / DAY);

describe("révisions espacées (Leitner)", () => {
  it("planifie la première révision le lendemain", () => {
    expect(daysAfter(firstReviewDate(now))).toBe(1);
  });

  it("espace les révisions à chaque bonne réponse : J+7, J+30, J+90", () => {
    let box = 1;
    const delays: number[] = [];
    for (let i = 0; i < 4; i++) {
      const next = nextReview(box, true, now);
      delays.push(daysAfter(next.dueAt));
      box = next.box;
    }
    expect(delays).toEqual([7, 30, 90, 90]);
    expect(box).toBe(4);
  });

  it("ramène une question manquée en boîte 1, révision le lendemain", () => {
    expect(nextReview(4, false, now)).toMatchObject({ box: 1 });
    expect(daysAfter(nextReview(3, false, now).dueAt)).toBe(1);
  });

  it("borne une boîte invalide", () => {
    expect(nextReview(0, true, now).box).toBe(2);
    expect(nextReview(9, true, now).box).toBe(4);
  });

  it("décrit les délais en français", () => {
    expect(describeDelay(1)).toBe("demain");
    expect(describeDelay(7)).toBe("dans 7 jours");
    expect(describeDelay(30)).toBe("dans un mois");
    expect(describeDelay(90)).toBe("dans 3 mois");
  });
});

describe("tirage des questions", () => {
  const bank = Array.from({ length: 13 }, (_, i) => i + 1);

  it("tire 10 questions distinctes dans une banque de 13, de façon reproductible", () => {
    const seed = chapterDrawSeed("u1", 42, 0);
    const a = drawQuestions(bank, CHAPTER_DRAW, seed);
    expect(a).toHaveLength(10);
    expect(new Set(a).size).toBe(10);
    expect(drawQuestions(bank, CHAPTER_DRAW, seed)).toEqual(a);
  });

  it("change de tirage d'une tentative à l'autre", () => {
    const first = drawQuestions(bank, CHAPTER_DRAW, chapterDrawSeed("u1", 42, 0));
    const second = drawQuestions(bank, CHAPTER_DRAW, chapterDrawSeed("u1", 42, 1));
    expect(second).not.toEqual(first);
  });

  it("pose toutes les questions quand la banque est plus petite que le tirage", () => {
    const small = [1, 2, 3, 4, 5, 6, 7, 8];
    expect(drawQuestions(small, CHAPTER_DRAW, "s").sort((x, y) => x - y)).toEqual(small);
  });

  it("répartit un examen équitablement entre les chapitres", () => {
    // 4 chapitres de 12 questions → 15 questions : 4, 4, 4, 3
    const groups = [0, 1, 2, 3].map((g) => Array.from({ length: 12 }, (_, i) => `${g}-${i}`));
    const picked = drawBalanced(groups, MODULE_EXAM_SIZE, "examen");
    expect(picked).toHaveLength(15);
    expect(new Set(picked).size).toBe(15);
    const perGroup = [0, 1, 2, 3].map((g) => picked.filter((p) => p.startsWith(`${g}-`)).length);
    expect(Math.max(...perGroup) - Math.min(...perGroup)).toBeLessThanOrEqual(1);
  });

  it("complète avec les groupes restants quand un groupe est épuisé", () => {
    const groups = [["a1", "a2"], Array.from({ length: 40 }, (_, i) => `b${i}`)];
    const picked = drawBalanced(groups, FINAL_EXAM_SIZE, "final");
    expect(picked).toHaveLength(30);
    expect(picked.filter((p) => p.startsWith("a"))).toHaveLength(2);
  });

  it("pose toujours les mêmes questions de pré-test à un apprenant", () => {
    const a = drawQuestions(bank, PRETEST_SIZE, pretestSeed("u1", 42));
    expect(a).toHaveLength(3);
    expect(drawQuestions(bank, PRETEST_SIZE, pretestSeed("u1", 42))).toEqual(a);
  });

  it("s'arrête quand toute la banque est utilisée", () => {
    expect(drawBalanced([["x"], ["y", "z"]], 30, "petit")).toHaveLength(3);
  });
});

describe("ouverture des examens et attestation", () => {
  const course = {
    chapters: [
      { module_id: 1, passed: true },
      { module_id: 1, passed: true },
      { module_id: 2, passed: true },
      { module_id: 2, passed: false },
    ],
  };

  it("ouvre l'examen d'un module dont tous les chapitres sont validés", () => {
    expect(examAvailability(course, { id: 1 })).toEqual({ open: true, remaining: 0, total: 2 });
    expect(examAvailability(course, { id: 2 })).toEqual({ open: false, remaining: 1, total: 2 });
  });

  it("n'ouvre l'examen final qu'une fois tout le parcours validé", () => {
    expect(examAvailability(course, null).open).toBe(false);
    const done = { chapters: course.chapters.map((c) => ({ ...c, passed: true })) };
    expect(examAvailability(done, null).open).toBe(true);
  });

  it("exige l'examen final pour délivrer l'attestation", () => {
    const done = { chapters: course.chapters.map((c) => ({ ...c, passed: true })) };
    expect(certificateReady(done, false)).toBe(false);
    expect(certificateReady(done, true)).toBe(true);
    expect(certificateReady(course, true)).toBe(false);
  });

  it("ne considère pas un module vide comme validé", () => {
    expect(examAvailability(course, { id: 99 }).open).toBe(false);
  });
});
