import "server-only";
import { notFound } from "next/navigation";
import { requireUser } from "./auth";
import { getCourse, isCourseOpen } from "./queries";

export type ChapterParams = { parcours: string; module: string; chapitre: string };

/** Charge le parcours, le module et le chapitre demandés, pour l'utilisateur connecté. */
export async function loadChapterContext(params: ChapterParams, path: string) {
  const user = await requireUser(path);
  const course = await getCourse(params.parcours, user.id);
  if (!course || !isCourseOpen(course.parcours.status, user.role)) notFound();
  const mod = course.modules.find((m) => m.slug === params.module);
  const chapter = mod?.chapters.find((c) => c.slug === params.chapitre);
  if (!mod || !chapter) notFound();
  const index = course.chapters.findIndex((c) => c.id === chapter.id);
  const previous = index > 0 ? course.chapters[index - 1] : null;
  const next = index < course.chapters.length - 1 ? course.chapters[index + 1] : null;
  const moduleIndex = course.modules.findIndex((m) => m.id === mod.id);
  const base = `/parcours/${course.parcours.slug}/${mod.slug}/${chapter.slug}`;
  return { user, course, mod, moduleIndex, chapter, previous, next, base };
}

export type ChapterContext = Awaited<ReturnType<typeof loadChapterContext>>;
