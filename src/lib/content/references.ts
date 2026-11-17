import { parse as parseYaml } from "yaml";
import { z } from "zod";

/** Types de sources affichés sur la page d'un parcours, dans cet ordre. */
export const SOURCE_TYPES = ["livre", "documentation", "article", "cours"] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

export const SOURCE_TYPE_LABELS: Record<SourceType, { one: string; many: string }> = {
  livre: { one: "Livre", many: "Livres" },
  documentation: { one: "Documentation", many: "Documentation" },
  article: { one: "Article", many: "Articles" },
  cours: { one: "Cours", many: "Cours" },
};

const httpsUrl = z.string().regex(/^https:\/\/\S+$/, "URL https attendue");

/** Une source du parcours (`sources:` dans parcours.yaml). */
export const sourceSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  year: z.number().int().min(1900).max(2100).optional(),
  type: z.enum(SOURCE_TYPES),
  url: httpsUrl,
  /** Où la source sert dans le parcours : « Module RAG », « Chapitre Transformers »… */
  used_in: z.string().optional(),
});
export type Source = z.infer<typeof sourceSchema>;

/**
 * Photo de couverture d'un parcours (`cover:` dans parcours.yaml). Le fichier est servi par le site
 * lui-même (public/images/parcours), jamais chargé depuis l'extérieur.
 */
export const coverSchema = z.object({
  src: z.string().regex(/^\/images\/parcours\/[a-z0-9-]+\.(jpg|webp|png)$/, "chemin /images/parcours/<nom>.jpg attendu"),
  /** Description de la photo, pour les lecteurs d'écran. */
  alt: z.string().min(1),
  author: z.string().min(1),
  /** Page de la photo chez son éditeur (crédit et licence). */
  url: httpsUrl,
});
export type Cover = z.infer<typeof coverSchema>;

/** Identifiant d'une vidéo YouTube à partir de son URL (watch, youtu.be, shorts, embed). */
export function youtubeId(url: string): string | null {
  const match = /^https:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})(?:[?&#].*)?$/.exec(url);
  return match ? match[1] : null;
}

/** « 3:05 » ou « 1:02:30 » en secondes. */
export function timeToSeconds(time: string): number {
  return time.split(":").reduce((total, part) => total * 60 + Number(part), 0);
}

const timeSchema = z.string().regex(/^(\d{1,2}:)?\d{1,2}:\d{2}$/, "durée au format m:ss ou h:mm:ss");

/** Bloc ```video d'un chapitre : une vidéo YouTube recommandée à l'endroit où la notion est expliquée. */
export const videoSchema = z
  .object({
    url: httpsUrl.refine((u) => youtubeId(u) !== null, "URL YouTube attendue"),
    title: z.string().min(1),
    channel: z.string().min(1),
    duration: timeSchema,
    lang: z.enum(["fr", "en"]),
    /** Pourquoi la regarder, en une ou deux phrases. */
    why: z.string().min(1),
    /** Passage conseillé (facultatif). */
    from: timeSchema.optional(),
    to: timeSchema.optional(),
  })
  .strict();
export type VideoSpec = z.infer<typeof videoSchema> & { id: string };

export function parseVideo(source: string): VideoSpec {
  const spec = videoSchema.parse(parseYaml(source));
  return { ...spec, id: youtubeId(spec.url)! };
}

/** Lien de lecture, au début du passage conseillé s'il y en a un. */
export function videoWatchUrl(video: VideoSpec): string {
  const start = video.from ? timeToSeconds(video.from) : 0;
  return `https://www.youtube.com/watch?v=${video.id}${start ? `&t=${start}s` : ""}`;
}

/** Extrait le contenu des blocs ```video d'un texte Markdown. */
export function extractVideoSources(markdown: string): string[] {
  return [...markdown.matchAll(/^```video[ \t]*\n([\s\S]*?)^```[ \t]*$/gm)].map((m) => m[1]);
}
