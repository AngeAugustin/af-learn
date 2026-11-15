import { describe, expect, it } from "vitest";
import { loadAllParcours } from "@/lib/content/loader";
import { MIN_QUESTIONS, parseQuiz, slugify, splitFrontmatter, splitSections } from "@/lib/content/parse";
import { extractDiagramSources } from "@/lib/diagrams/extract";
import { parseDiagram } from "@/lib/diagrams/spec";
import { requiredCorrect } from "@/lib/quiz";

describe("analyse du contenu", () => {
  it("crée des slugs sans accents", () => {
    expect(slugify("Qu'est-ce qu'un AI Engineer ?")).toBe("qu-est-ce-qu-un-ai-engineer");
    expect(slugify("Évaluer la génération")).toBe("evaluer-la-generation");
  });

  it("découpe les sections sur les titres de niveau 1, hors blocs de code", () => {
    const body = "# Intro\nTexte\n```python\n# commentaire\nx = 1\n```\n# Exercices\nFaire ceci";
    const sections = splitSections(body);
    expect(sections.map((s) => s.slug)).toEqual(["intro", "exercices"]);
    expect(sections[0].body).toContain("# commentaire");
    expect(sections[1].isExercises).toBe(true);
  });

  it("refuse les sections en double et les slugs réservés", () => {
    expect(() => splitSections("# A\nx\n# A\ny")).toThrow(/double/);
    expect(() => splitSections("# Évaluation\nx")).toThrow(/réservé/);
  });

  it("refuse un en-tête incomplet", () => {
    expect(() => splitFrontmatter("---\ntitle: Test\n---\n# A")).toThrow();
  });

  it("valide les questions", () => {
    const make = (q: string) => `questions:\n${Array.from({ length: MIN_QUESTIONS }, () => q).join("")}`;
    const ok = `  - prompt: Une question ?\n    options: [A, B]\n    answer: [1]\n    explanation: Parce que.\n`;
    expect(parseQuiz(make(ok))).toHaveLength(MIN_QUESTIONS);
    const outOfRange = ok.replace("answer: [1]", "answer: [2]");
    expect(() => parseQuiz(make(outOfRange))).toThrow();
    const multiWithoutFlag = ok.replace("answer: [1]", "answer: [0, 1]");
    expect(() => parseQuiz(make(multiWithoutFlag))).toThrow();
    expect(() => parseQuiz(`questions:\n${ok}`)).toThrow(); // trop peu de questions
  });
});

describe("contenu des parcours", () => {
  const all = loadAllParcours();
  const ai = all.find((p) => p.slug === "ai-engineering")!;
  const chapters = ai.modules.flatMap((m) => m.chapters);

  it("charge le parcours AI Engineering et les autres parcours publiés", () => {
    expect(ai).toBeDefined();
    expect(ai.status).toBe("published");
    expect(ai.modules.length).toBeGreaterThanOrEqual(8);
    expect(all.filter((p) => p.status === "published").length).toBeGreaterThanOrEqual(4);
  });

  it("organise chaque chapitre en sections, avec exercices puis sketchnote à la fin", () => {
    for (const c of chapters) {
      expect(c.sections.length, c.slug).toBeGreaterThanOrEqual(3);
      expect(c.sections.at(-2)?.isExercises, c.slug).toBe(true);
      expect(c.sections.at(-1)?.isSketchnote, c.slug).toBe(true);
      for (const s of c.sections) expect(s.body.length, `${c.slug}/${s.slug}`).toBeGreaterThan(80);
    }
  });

  it("évalue chaque chapitre avec assez de questions pour un seuil de 75 % significatif", () => {
    for (const c of chapters) {
      expect(c.questions.length, c.slug).toBeGreaterThanOrEqual(MIN_QUESTIONS);
      expect(requiredCorrect(c.questions.length), c.slug).toBeLessThan(c.questions.length);
      for (const q of c.questions) {
        expect(q.answer.every((i) => i < q.options.length), `${c.slug}: ${q.prompt}`).toBe(true);
      }
    }
  });

  it("propose des solutions à tous les exercices", () => {
    for (const c of chapters) {
      const exercises = c.sections.find((s) => s.isExercises)!;
      const count = (exercises.body.match(/^## Exercice/gm) ?? []).length;
      const solutions = (exercises.body.match(/<details>/g) ?? []).length;
      expect(count, c.slug).toBeGreaterThanOrEqual(2);
      expect(solutions, c.slug).toBeGreaterThanOrEqual(count);
      expect(exercises.body.match(/<\/details>/g)?.length, c.slug).toBe(solutions);
    }
  });

  it("utilise uniquement des diagrammes valides", () => {
    let total = 0;
    for (const c of chapters) {
      for (const s of c.sections) {
        for (const source of extractDiagramSources(s.body)) {
          total++;
          expect(() => parseDiagram(source), `${c.slug}/${s.slug}`).not.toThrow();
        }
      }
    }
    expect(total).toBeGreaterThanOrEqual(40);
  });

  it("ne contient que des liens externes absolus (https)", () => {
    // Le contenu ne doit pas contenir de liens relatifs cassés : uniquement des URL absolues https
    for (const c of chapters) {
      for (const s of c.sections) {
        const prose = s.body.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
        const links = [...prose.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]);
        for (const link of links) expect(link, `${c.slug}/${s.slug}`).toMatch(/^https:\/\//);
      }
    }
  });
});

describe("typographie", () => {
  it("n'utilise aucun tiret cadratin dans le contenu ni dans le code du site", async () => {
    const { findEmDashes } = await import("../scripts/typography");
    expect(findEmDashes()).toEqual([]);
  });
});

describe("sketchnotes", () => {
  it("chaque chapitre se termine par une sketchnote valide et complète", async () => {
    const { extractSketchnoteSources, parseSketchnote } = await import("@/lib/sketchnote");
    const chapters = loadAllParcours().flatMap((p) => p.modules.flatMap((m) => m.chapters));
    expect(chapters.length).toBeGreaterThan(0);
    for (const c of chapters) {
      const sources = extractSketchnoteSources(c.sections.at(-1)!.body);
      expect(sources, c.slug).toHaveLength(1);
      const spec = parseSketchnote(sources[0]);
      expect(spec.points.length, c.slug).toBeGreaterThanOrEqual(4);
      expect(spec.pitfall.length, c.slug).toBeGreaterThan(10);
      expect(spec.remember.length, c.slug).toBeGreaterThan(10);
    }
  });

  it("refuse une sketchnote incomplète ou une icône inconnue", async () => {
    const { parseSketchnote } = await import("@/lib/sketchnote");
    const point = '  - icon: brain\n    title: Un point\n    text: "Une explication suffisamment longue."\n';
    const base = `title: Test\ncenter: Une idée centrale assez longue\npoints:\n${point.repeat(4)}pitfall: Un piège à éviter absolument\nremember: Une phrase à retenir absolument\n`;
    expect(() => parseSketchnote(base)).not.toThrow();
    expect(() => parseSketchnote(base.replace(point.repeat(4), point.repeat(2)))).toThrow();
    expect(() => parseSketchnote(base.replace("icon: brain", "icon: licorne"))).toThrow();
  });
});
