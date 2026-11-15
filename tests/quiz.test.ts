import { describe, expect, it } from "vitest";
import { gradeQuiz, parseAnswers, PASS_THRESHOLD, requiredCorrect, seededShuffle } from "@/lib/quiz";

const questions = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, correct: [0] }));
const allRight = Object.fromEntries(questions.map((q) => [q.id, [0]]));

describe("seuil de réussite", () => {
  it("vaut 75 %", () => {
    expect(PASS_THRESHOLD).toBe(75);
  });

  it("calcule le nombre minimal de bonnes réponses", () => {
    expect(requiredCorrect(10)).toBe(8); // 7,5 arrondi au supérieur
    expect(requiredCorrect(8)).toBe(6);
    expect(requiredCorrect(12)).toBe(9);
    expect(requiredCorrect(4)).toBe(3);
  });
});

describe("gradeQuiz", () => {
  it("valide un sans-faute", () => {
    const r = gradeQuiz(questions, allRight);
    expect(r).toMatchObject({ correctCount: 10, total: 10, score: 100, passed: true });
  });

  it("valide exactement au seuil (8/10 = 80 %) et refuse juste en dessous (7/10)", () => {
    const eight = { ...allRight, 9: [1], 10: [1] };
    expect(gradeQuiz(questions, eight)).toMatchObject({ score: 80, passed: true });
    const seven = { ...eight, 8: [2] };
    expect(gradeQuiz(questions, seven)).toMatchObject({ score: 70, passed: false });
  });

  it("valide 6/8 = 75 % pile", () => {
    const eightQ = questions.slice(0, 8);
    const answers = { ...Object.fromEntries(eightQ.map((q) => [q.id, [0]])), 7: [1], 8: [1] };
    expect(gradeQuiz(eightQ, answers)).toMatchObject({ correctCount: 6, score: 75, passed: true });
  });

  it("n'arrondit jamais vers le haut un score sous le seuil", () => {
    // 11/15 = 73,33 % → 73 → échec
    const qs = Array.from({ length: 15 }, (_, i) => ({ id: i + 1, correct: [0] }));
    const answers = Object.fromEntries(qs.map((q) => [q.id, [q.id <= 11 ? 0 : 1]]));
    expect(gradeQuiz(qs, answers)).toMatchObject({ score: 73, passed: false });
  });

  it("exige l'ensemble exact des bonnes options pour les questions à choix multiples", () => {
    const multi = [{ id: 1, correct: [0, 2, 3] }];
    expect(gradeQuiz(multi, { 1: [3, 0, 2] }).correctCount).toBe(1);
    expect(gradeQuiz(multi, { 1: [0, 2] }).correctCount).toBe(0); // incomplet
    expect(gradeQuiz(multi, { 1: [0, 1, 2, 3] }).correctCount).toBe(0); // option en trop
    expect(gradeQuiz(multi, { 1: [0, 0, 2, 3] }).correctCount).toBe(1); // doublons ignorés
  });

  it("compte une question sans réponse comme fausse", () => {
    const r = gradeQuiz(questions, { 1: [0] });
    expect(r.correctCount).toBe(1);
    expect(r.results[1]).toMatchObject({ questionId: 2, selected: [], isCorrect: false });
  });

  it("refuse une évaluation vide", () => {
    expect(() => gradeQuiz([], {})).toThrow();
  });
});

describe("parseAnswers", () => {
  it("ne garde que des indices valides", () => {
    const form = new FormData();
    form.append("q-1", "2");
    form.append("q-1", "9"); // hors limites
    form.append("q-2", "abc");
    form.append("q-2", "-1");
    form.append("q-3", "0");
    form.append("q-99", "0"); // question inconnue
    const answers = parseAnswers(form, [1, 2, 3], new Map([[1, 4], [2, 4], [3, 2]]));
    expect(answers).toEqual({ 1: [2], 2: [], 3: [0] });
  });
});

describe("seededShuffle", () => {
  it("est déterministe pour une même graine et conserve les éléments", () => {
    const items = [0, 1, 2, 3, 4, 5];
    const a = seededShuffle(items, "graine");
    expect(seededShuffle(items, "graine")).toEqual(a);
    expect([...a].sort()).toEqual(items);
    expect(items).toEqual([0, 1, 2, 3, 4, 5]); // pas de modification en place
  });

  it("varie selon la graine", () => {
    const items = Array.from({ length: 8 }, (_, i) => i);
    const orders = new Set(["a", "b", "c", "d", "e"].map((s) => seededShuffle(items, s).join(",")));
    expect(orders.size).toBeGreaterThan(1);
  });
});
