import { parse as parseYaml } from "yaml";
import { z } from "zod";
import type { QuestionSource, SectionSource } from "./types";

/** Seuil de réussite d'une évaluation de chapitre, en pourcentage. */
export const PASS_THRESHOLD = 75;

/** Nombre minimal de questions par évaluation de chapitre. */
export const MIN_QUESTIONS = 8;

/** Slugs de section réservés par les routes de l'application. */
export const RESERVED_SECTION_SLUGS = new Set(["evaluation"]);

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const frontmatterSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  duration: z.number().int().positive(),
  objectives: z.array(z.string().min(3)).min(1),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;

/** Sépare l'en-tête YAML (entre deux lignes `---`) du corps Markdown. */
export function splitFrontmatter(raw: string): { data: Frontmatter; body: string } {
  const text = raw.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text);
  if (!match) throw new Error("En-tête YAML manquant (bloc --- ... ---)");
  const data = frontmatterSchema.parse(parseYaml(match[1]));
  return { data, body: match[2] };
}

/**
 * Découpe le corps d'un chapitre en sections : chaque titre de niveau 1 (`# Titre`),
 * hors bloc de code, ouvre une nouvelle section.
 */
export function splitSections(body: string): SectionSource[] {
  const sections: { title: string; lines: string[] }[] = [];
  let fence: string | null = null;

  for (const line of body.split("\n")) {
    const fenceMatch = /^\s*(`{3,}|~{3,})/.exec(line);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (fence === null) fence = marker;
      else if (marker[0] === fence[0] && marker.length >= fence.length && line.trim() === marker) fence = null;
    }
    const heading = fence === null ? /^# (.+)$/.exec(line) : null;
    if (heading) {
      sections.push({ title: heading[1].trim(), lines: [] });
    } else if (sections.length > 0) {
      sections[sections.length - 1].lines.push(line);
    } else if (line.trim() !== "") {
      throw new Error(`Contenu avant la première section : « ${line.slice(0, 60)} »`);
    }
  }
  if (fence !== null) throw new Error("Bloc de code non fermé");

  const seen = new Set<string>();
  return sections.map(({ title, lines }) => {
    const slug = slugify(title);
    if (!slug) throw new Error(`Titre de section invalide : « ${title} »`);
    if (seen.has(slug)) throw new Error(`Section en double : « ${slug} »`);
    if (RESERVED_SECTION_SLUGS.has(slug)) throw new Error(`Slug de section réservé : « ${slug} »`);
    seen.add(slug);
    return {
      slug,
      title,
      body: lines.join("\n").trim(),
      isExercises: slug === "exercices",
      isSketchnote: slug.startsWith("sketchnote"),
    };
  });
}

const questionSchema = z
  .object({
    prompt: z.string().min(5),
    code: z.string().optional(),
    options: z.array(z.union([z.string(), z.number()]).transform(String)).min(2).max(6),
    answer: z.array(z.number().int().nonnegative()).min(1),
    multiple: z.boolean().optional().default(false),
    explanation: z.string().min(5),
  })
  .superRefine((q, ctx) => {
    if (new Set(q.answer).size !== q.answer.length) {
      ctx.addIssue({ code: "custom", message: "Réponses en double" });
    }
    if (q.answer.some((i) => i >= q.options.length)) {
      ctx.addIssue({ code: "custom", message: "Indice de réponse hors limites" });
    }
    if (!q.multiple && q.answer.length !== 1) {
      ctx.addIssue({ code: "custom", message: "Question à choix unique avec plusieurs réponses" });
    }
    if (q.multiple && q.answer.length < 2) {
      ctx.addIssue({ code: "custom", message: "Question à choix multiples avec une seule réponse" });
    }
    if (new Set(q.options).size !== q.options.length) {
      ctx.addIssue({ code: "custom", message: "Options en double" });
    }
  });

const quizSchema = z.object({ questions: z.array(questionSchema).min(MIN_QUESTIONS) });

export function parseQuiz(raw: string): QuestionSource[] {
  return quizSchema.parse(parseYaml(raw)).questions;
}
