import { parse as parseYaml } from "yaml";
import { z } from "zod";

/** Icônes disponibles pour les bulles d'une sketchnote (voir components/content/sketchnote.tsx). */
export const SKETCH_ICONS = [
  "brain", "code", "database", "search", "layers", "shield", "gauge", "money", "clock", "target",
  "check", "alert", "idea", "tool", "rocket", "users", "chat", "file", "git", "test", "chart",
  "cpu", "cloud", "lock", "key", "link", "puzzle", "loop", "filter", "scale", "eye", "book",
  "sparkles", "network", "server", "terminal", "ruler", "zap", "compass", "list",
] as const;

export const sketchnoteSchema = z.object({
  title: z.string().min(3),
  center: z.string().min(10).max(140),
  points: z
    .array(
      z.object({
        icon: z.enum(SKETCH_ICONS),
        title: z.string().min(2).max(40),
        text: z.string().min(10).max(150),
      }),
    )
    .min(4)
    .max(6),
  pitfall: z.string().min(10).max(170),
  remember: z.string().min(10).max(170),
});

export type SketchnoteSpec = z.infer<typeof sketchnoteSchema>;

export function parseSketchnote(source: string): SketchnoteSpec {
  return sketchnoteSchema.parse(parseYaml(source));
}

/** Extrait le contenu des blocs ```sketchnote d'un texte Markdown. */
export function extractSketchnoteSources(markdown: string): string[] {
  const sources: string[] = [];
  const regex = /^```sketchnote[ \t]*\n([\s\S]*?)^```[ \t]*$/gm;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(markdown)) !== null) sources.push(match[1]);
  return sources;
}
