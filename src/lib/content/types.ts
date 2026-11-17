import type { Cover, Source } from "./references";
export type QuestionSource = {
  prompt: string;
  code?: string;
  options: string[];
  answer: number[];
  multiple: boolean;
  explanation: string;
};

export type SectionSource = {
  slug: string;
  title: string;
  body: string;
  isExercises: boolean;
  isSketchnote: boolean;
};

export type ChapterSource = {
  slug: string;
  title: string;
  description: string;
  duration: number;
  objectives: string[];
  sections: SectionSource[];
  questions: QuestionSource[];
};

export type ModuleSource = {
  slug: string;
  title: string;
  description: string;
  chapters: ChapterSource[];
};

export type ParcoursSource = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  level: string;
  /** Domaine affiché et filtrable dans le catalogue (IA, Data, Sécurité…). */
  domain: string;
  /** Compétences clés affichées sur la carte du catalogue. */
  skills: string[];
  sources: Source[];
  cover: Cover | null;
  color: string;
  icon: string;
  order: number;
  status: "published" | "coming_soon" | "hidden";
  prerequisites: string[];
  outcomes: string[];
  modules: ModuleSource[];
};
