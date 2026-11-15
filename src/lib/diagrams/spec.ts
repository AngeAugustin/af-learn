import { parse as parseYaml } from "yaml";
import { z } from "zod";

export const TONES = ["violet", "blue", "teal", "amber", "rose"] as const;
export type Tone = (typeof TONES)[number];

/** Diagrammes dessinés sur mesure (SVG), référencés par `type: custom` + `name`. */
export const CUSTOM_DIAGRAMS = [
  "overfitting-curves",
  "neuron",
  "neural-network",
  "embedding-space",
  "attention-heatmap",
  "temperature",
  "vector-search",
  "trace-timeline",
  "lora",
] as const;

const tone = z.enum(TONES).optional();

const step = z.object({
  title: z.string(),
  text: z.string().optional(),
  tone,
});

export const diagramSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("flow"),
    title: z.string().optional(),
    loop: z.string().optional(),
    steps: z.array(step).min(2),
  }),
  z.object({
    type: z.literal("pipeline"),
    title: z.string().optional(),
    lanes: z.array(z.object({ title: z.string(), steps: z.array(step).min(2) })).min(1),
  }),
  z.object({
    type: z.literal("compare"),
    title: z.string().optional(),
    columns: z
      .array(z.object({ title: z.string(), tone, items: z.array(z.string()).min(1) }))
      .min(2)
      .max(4),
  }),
  z.object({
    type: z.literal("layers"),
    title: z.string().optional(),
    layers: z
      .array(z.object({ title: z.string(), text: z.string().optional(), items: z.array(z.string()).optional() }))
      .min(2),
  }),
  z.object({
    type: z.literal("stack"),
    title: z.string().optional(),
    segments: z
      .array(z.object({ label: z.string(), value: z.number().positive(), tone, text: z.string().optional() }))
      .min(2),
  }),
  z.object({
    type: z.literal("sequence"),
    title: z.string().optional(),
    actors: z.array(z.string()).min(2).max(4),
    messages: z
      .array(z.object({ from: z.number().int().nonnegative(), to: z.number().int().nonnegative(), text: z.string() }))
      .min(1),
  }),
  z.object({
    type: z.literal("decision"),
    title: z.string().optional(),
    nodes: z.array(z.object({ question: z.string(), yes: z.string(), no: z.string() })).min(1),
  }),
  z.object({
    type: z.literal("custom"),
    name: z.enum(CUSTOM_DIAGRAMS),
    caption: z.string().optional(),
  }),
]);

export type DiagramSpec = z.infer<typeof diagramSchema>;

export function parseDiagram(source: string): DiagramSpec {
  const spec = diagramSchema.parse(parseYaml(source));
  if (spec.type === "sequence") {
    for (const m of spec.messages) {
      if (m.from >= spec.actors.length || m.to >= spec.actors.length) {
        throw new Error(`Diagramme de séquence : acteur inexistant dans « ${m.text} »`);
      }
    }
  }
  return spec;
}
