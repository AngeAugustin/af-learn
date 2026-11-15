import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";
import { parseQuiz, splitFrontmatter, splitSections } from "./parse";
import { extractSketchnoteSources } from "../sketchnote";
import type { ChapterSource, ModuleSource, ParcoursSource } from "./types";

export const CONTENT_DIR = path.join(process.cwd(), "content", "parcours");

const slugSchema = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug invalide");

const parcoursSchema = z.object({
  slug: slugSchema,
  title: z.string(),
  tagline: z.string(),
  description: z.string(),
  level: z.string(),
  color: z.string(),
  icon: z.string(),
  order: z.number().int(),
  status: z.enum(["published", "coming_soon", "hidden"]),
  prerequisites: z.array(z.string()).default([]),
  outcomes: z.array(z.string()).default([]),
  modules: z
    .array(
      z.object({
        slug: slugSchema,
        title: z.string(),
        description: z.string(),
        chapters: z.array(slugSchema),
      }),
    )
    .default([]),
});

export class ContentError extends Error {}

function withContext<T>(where: string, fn: () => T): T {
  try {
    return fn();
  } catch (error) {
    const detail = error instanceof z.ZodError ? z.prettifyError(error) : (error as Error).message;
    throw new ContentError(`${where} : ${detail}`);
  }
}

export function loadChapter(dir: string, slug: string): ChapterSource {
  const mdPath = path.join(dir, `${slug}.md`);
  const quizPath = path.join(dir, `${slug}.quiz.yaml`);
  return withContext(path.relative(process.cwd(), mdPath), () => {
    const { data, body } = splitFrontmatter(readFileSync(mdPath, "utf8"));
    const sections = splitSections(body);
    if (sections.length < 2) throw new Error("Un chapitre doit comporter au moins deux sections");
    if (!sections.some((s) => s.isExercises)) throw new Error("Section « Exercices » manquante");
    const last = sections[sections.length - 1];
    if (!last.isSketchnote) {
      throw new Error("La dernière section doit être la sketchnote (« # Sketchnote : l'essentiel à retenir »)");
    }
    if (extractSketchnoteSources(last.body).length !== 1) {
      throw new Error("La sketchnote doit contenir exactement un bloc sketchnote");
    }
    if (!existsSync(quizPath)) throw new Error(`Évaluation manquante (${slug}.quiz.yaml)`);
    const questions = withContext(path.relative(process.cwd(), quizPath), () =>
      parseQuiz(readFileSync(quizPath, "utf8")),
    );
    return { slug, ...data, sections, questions };
  });
}

export function loadParcours(dir: string): ParcoursSource {
  const meta = withContext(path.join(path.basename(dir), "parcours.yaml"), () =>
    parcoursSchema.parse(parseYaml(readFileSync(path.join(dir, "parcours.yaml"), "utf8"))),
  );
  const chapterSlugs = new Set<string>();
  const modules: ModuleSource[] = meta.modules.map((m) => ({
    slug: m.slug,
    title: m.title,
    description: m.description,
    chapters: m.chapters.map((chapterSlug) => {
      if (chapterSlugs.has(chapterSlug)) {
        throw new ContentError(`${meta.slug} : chapitre « ${chapterSlug} » référencé deux fois`);
      }
      chapterSlugs.add(chapterSlug);
      return loadChapter(path.join(dir, m.slug), chapterSlug);
    }),
  }));
  if (new Set(modules.map((m) => m.slug)).size !== modules.length) {
    throw new ContentError(`${meta.slug} : slugs de modules en double`);
  }
  if (meta.status === "published" && modules.length === 0) {
    throw new ContentError(`${meta.slug} : un parcours publié doit contenir des modules`);
  }
  return { ...meta, modules };
}

export function loadAllParcours(root: string = CONTENT_DIR): ParcoursSource[] {
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(path.join(root, entry.name, "parcours.yaml")))
    .map((entry) => loadParcours(path.join(root, entry.name)))
    .sort((a, b) => a.order - b.order);
}
