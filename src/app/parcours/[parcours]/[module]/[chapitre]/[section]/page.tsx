import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BadgeCheck, CheckCircle2, Clock, Info } from "lucide-react";
import { loadChapterContext, type ChapterParams } from "@/lib/chapter-context";
import { getQuestions, getSectionBody } from "@/lib/queries";
import { pretestDraw } from "@/lib/memorisation-queries";
import { pretestSeed } from "@/lib/memorisation";
import { Pretest } from "@/components/chapter/pretest";
import { queryOne } from "@/lib/db";
import { renderMarkdown } from "@/lib/markdown/render";
import { extractOutline, readingMinutes } from "@/lib/markdown/outline";
import { PASS_THRESHOLD, seededShuffle } from "@/lib/quiz";
import { completeSectionAction } from "@/app/actions/progress";
import { ChapterIntro, ChapterShell } from "@/components/chapter/chapter-shell";
import { LockedChapter } from "@/components/chapter/locked-chapter";
import { SectionOutline } from "@/components/chapter/section-outline";

type Params = ChapterParams & { section: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const p = await params;
  const row = await queryOne<{ section: string; chapter: string }>(
    `SELECT s.title AS section, c.title AS chapter
     FROM sections s JOIN chapters c ON c.id = s.chapter_id JOIN modules m ON m.id = c.module_id
     JOIN parcours pa ON pa.id = m.parcours_id
     WHERE pa.slug = $1 AND m.slug = $2 AND c.slug = $3 AND s.slug = $4`,
    [p.parcours, p.module, p.chapitre, p.section],
  );
  return { title: row ? `${row.section} · ${row.chapter}` : "Section" };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default async function SectionPage({ params }: { params: Promise<Params> }) {
  const p = await params;
  const ctx = await loadChapterContext(p, `/parcours/${p.parcours}/${p.module}/${p.chapitre}/${p.section}`);
  if (ctx.chapter.state === "locked") return <LockedChapter ctx={ctx} />;

  const { chapter, base, moduleIndex } = ctx;
  const index = chapter.sections.findIndex((s) => s.slug === p.section);
  if (index === -1) notFound();
  const section = chapter.sections[index];
  const previous = index > 0 ? chapter.sections[index - 1] : null;
  const next = index < chapter.sections.length - 1 ? chapter.sections[index + 1] : null;
  const done = chapter.completedSectionIds.has(section.id);
  const body = await getSectionBody(section.id);
  const content = await renderMarkdown(body);
  const outline = extractOutline(body);
  const minutes = readingMinutes(body);
  const nextHref = next ? `${base}/${next.slug}` : `${base}/evaluation`;
  // Pré-test « Testez-vous avant de lire » : en tête du chapitre, tant qu'il n'est ni commencé ni validé
  const showPretest = index === 0 && !chapter.passed && chapter.completedSectionIds.size === 0;
  const pretestSeedValue = pretestSeed(ctx.user.id, chapter.id);
  const pretest = showPretest
    ? pretestDraw(await getQuestions(chapter.id), ctx.user.id, chapter.id).map((q) => ({
        id: q.id,
        prompt: q.prompt,
        code: q.code,
        multiple: q.multiple,
        options: /^(vrai|faux)$/i.test(q.options[0])
          ? q.options.map((label, i) => ({ index: i, label }))
          : seededShuffle(q.options.map((label, i) => ({ index: i, label })), `${pretestSeedValue}-${q.id}`),
      }))
    : [];
  const remainingAfterThis =chapter.sections.filter((s) => s.id !== section.id && !chapter.completedSectionIds.has(s.id)).length;

  const aside = (
    <>
      <SectionOutline items={outline} />
      <div className="card p-4">
        <p className="label-mono text-fg-subtle">Ce chapitre</p>
        <ul className="mt-3 space-y-2.5 text-[13px] text-fg-muted">
          <li className="flex items-center gap-2">
            <Clock className="size-4 shrink-0 text-accent" aria-hidden /> ≈ {chapter.duration_minutes} min avec exercices
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden /> {chapter.completedSectionIds.size}/{chapter.sections.length} sections lues
          </li>
          <li className="flex items-center gap-2">
            <BadgeCheck className="size-4 shrink-0 text-brand" aria-hidden />
            {chapter.passed ? `Évaluation validée (${chapter.bestScore} %)` : `Évaluation : ${PASS_THRESHOLD} % requis`}
          </li>
        </ul>
      </div>
      <div className="rounded-2xl bg-bg-sunken p-4">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-fg">
          <Info className="size-4 text-brand" aria-hidden /> Conseil de méthode
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">
          Reproduisez les exemples de code dans votre propre environnement : c&apos;est la meilleure façon de les retenir.
        </p>
      </div>
    </>
  );

  return (
    <ChapterShell ctx={ctx} activeSlug={section.slug} aside={section.is_sketchnote ? undefined : aside} readingMinutes={minutes}>
      {index === 0 && <ChapterIntro ctx={ctx} />}
      {pretest.length > 0 && <Pretest chapterId={chapter.id} questions={pretest} />}
      <article className="card p-5 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="label-mono text-fg-subtle">
            Module {pad(moduleIndex + 1)} › Chapitre {pad(chapter.position + 1)}
          </span>
          <span className="label-mono rounded bg-brand-soft px-2 py-0.5 normal-case text-brand">
            Section {index + 1} sur {chapter.sections.length}
          </span>
          {section.is_exercises && (
            <span className="label-mono rounded bg-accent-soft px-2 py-0.5 normal-case text-accent">Exercices</span>
          )}
          {section.is_sketchnote && (
            <span className="label-mono rounded bg-success-soft px-2 py-0.5 normal-case text-success">Synthèse visuelle</span>
          )}
        </div>
        <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.025em] text-fg sm:text-4xl">{section.title}</h2>
        <div className="lesson prose prose-slate mt-8 max-w-none prose-headings:font-bold prose-h2:mt-12 prose-h2:text-2xl prose-h3:text-lg prose-p:leading-[1.75] prose-li:my-1">
          {content}
        </div>
      </article>

      {/* Fin de section */}
      {next ? (
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-stretch sm:justify-between">
          {previous ? (
            <Link
              href={`${base}/${previous.slug}`}
              className="flex items-center gap-3 rounded-xl bg-bg-muted px-4 py-3 text-sm text-fg-muted transition hover:bg-bg-sunken"
            >
              <ArrowLeft className="size-4 shrink-0" aria-hidden />
              <span className="min-w-0">
                <span className="label-mono block text-fg-subtle">Section précédente</span>
                <span className="block truncate font-medium text-fg">{previous.title}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          <form action={completeSectionAction}>
            <input type="hidden" name="sectionId" value={section.id} />
            <input type="hidden" name="suivant" value={nextHref} />
            <button
              type="submit"
              className="flex h-full w-full items-center justify-center gap-3 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-brand-fg shadow-hover transition hover:bg-brand-strong active:scale-[0.99] sm:w-auto"
            >
              {done ? <CheckCircle2 className="size-5 shrink-0" aria-hidden /> : null}
              <span className="text-left">
                <span className="block">{done ? "Section suivante" : "J'ai terminé cette section"}</span>
                <span className="block text-xs font-normal opacity-80">{next.title}</span>
              </span>
              <ArrowRight className="size-4 shrink-0" aria-hidden />
            </button>
          </form>
        </div>
      ) : (
        <div className="card mt-8 flex flex-col items-center justify-between gap-5 p-6 sm:flex-row">
          <div className="space-y-1 text-center sm:text-left">
            <p className="label-mono text-success">Prêt pour l&apos;évaluation ?</p>
            <p className="text-lg font-bold text-fg">
              {remainingAfterThis === 0 ? "Vous avez couvert toutes les sections du chapitre." : "Dernière section du chapitre."}
            </p>
            <p className="text-sm text-fg-muted">
              {remainingAfterThis === 0
                ? `L'évaluation comporte ${chapter.questionCount} questions ; il faut au moins ${PASS_THRESHOLD} % pour valider le chapitre.`
                : `Il vous reste ${remainingAfterThis} section${remainingAfterThis > 1 ? "s" : ""} à lire avant d'ouvrir l'évaluation.`}
            </p>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto">
            <form action={completeSectionAction}>
              <input type="hidden" name="sectionId" value={section.id} />
              <input type="hidden" name="suivant" value={nextHref} />
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-brand-fg shadow-hover transition hover:bg-brand-strong active:scale-[0.99]"
              >
                {done ? "Aller à l'évaluation" : "Marquer comme lu et passer à l'évaluation"} <ArrowRight className="size-4" aria-hidden />
              </button>
            </form>
            {previous && (
              <Link href={`${base}/${previous.slug}`} className="text-center text-xs font-medium text-fg-muted hover:text-fg">
                ← Section précédente : {previous.title}
              </Link>
            )}
          </div>
        </div>
      )}
    </ChapterShell>
  );
}
