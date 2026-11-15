import { redirect } from "next/navigation";
import { loadChapterContext, type ChapterParams } from "@/lib/chapter-context";
import { LockedChapter } from "@/components/chapter/locked-chapter";

/** Point d'entrée d'un chapitre : redirige vers la première section non lue (ou l'évaluation). */
export default async function ChapterEntry({ params }: { params: Promise<ChapterParams> }) {
  const p = await params;
  const ctx = await loadChapterContext(p, `/parcours/${p.parcours}/${p.module}/${p.chapitre}`);
  if (ctx.chapter.state === "locked") return <LockedChapter ctx={ctx} />;
  const { chapter, base } = ctx;
  const firstUnread = chapter.sections.find((s) => !chapter.completedSectionIds.has(s.id));
  if (firstUnread) redirect(`${base}/${firstUnread.slug}`);
  redirect(chapter.passed ? `${base}/${chapter.sections[0].slug}` : `${base}/evaluation`);
}
