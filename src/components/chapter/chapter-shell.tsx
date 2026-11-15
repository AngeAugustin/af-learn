import Link from "next/link";
import type { ReactNode } from "react";
import { BadgeCheck, CheckCircle2, ChevronDown, Clock, Code2, Lock, PenLine, Play, TerminalSquare } from "lucide-react";
import type { ChapterContext } from "@/lib/chapter-context";
import { percent } from "@/lib/progress";
import { PASS_THRESHOLD } from "@/lib/quiz";

const pad = (n: number) => String(n).padStart(2, "0");

function SectionNav({ ctx, activeSlug }: { ctx: ChapterContext; activeSlug: string | null }) {
  const { chapter, base } = ctx;
  return (
    <nav aria-label="Sections du chapitre" className="space-y-1.5">
      {chapter.sections.map((s, i) => {
        const done = chapter.completedSectionIds.has(s.id);
        const active = s.slug === activeSlug;
        return (
          <Link
            key={s.id}
            href={`${base}/${s.slug}`}
            aria-current={active ? "page" : undefined}
            className={`group flex items-start gap-3 rounded-lg p-2.5 transition ${
              active ? "bg-brand text-brand-fg shadow-card" : "bg-bg-muted/60 hover:bg-bg-muted"
            }`}
          >
            <span
              className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                active ? "bg-white/20" : done ? "bg-success-soft text-success" : "bg-border/70 text-fg-muted"
              }`}
            >
              {active ? (
                <Play className="size-3" aria-hidden />
              ) : done ? (
                <CheckCircle2 className="size-3.5" aria-hidden />
              ) : s.is_exercises ? (
                <Code2 className="size-3" aria-hidden />
              ) : s.is_sketchnote ? (
                <PenLine className="size-3" aria-hidden />
              ) : (
                <span className="size-1.5 rounded-full bg-current" aria-hidden />
              )}
            </span>
            <span className="min-w-0">
              <span className={`block text-[13px] font-medium leading-snug ${active ? "font-semibold" : "text-fg group-hover:text-brand"}`}>
                {i + 1}. {s.is_sketchnote ? "Sketchnote : l'essentiel" : s.title}
              </span>
              <span
                className={`label-mono normal-case ${
                  active ? "text-brand-fg/80" : done ? "text-success" : s.is_exercises ? "text-accent" : s.is_sketchnote ? "text-brand" : "text-fg-subtle"
                }`}
              >
                {active ? "En lecture" : done ? "Lue" : s.is_exercises ? "Exercices" : s.is_sketchnote ? "Synthèse" : "À lire"}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function EvaluationWidget({ ctx, active }: { ctx: ChapterContext; active: boolean }) {
  const { chapter, base } = ctx;
  const remaining = chapter.sections.length - chapter.completedSectionIds.size;
  return (
    <div className={`mt-4 space-y-2 rounded-xl p-3.5 ${active ? "bg-brand-soft ring-1 ring-brand-line" : "bg-bg-muted"}`}>
      <p className="flex items-center gap-2 text-[13px] font-bold text-fg">
        <BadgeCheck className="size-[18px] text-brand" aria-hidden /> Évaluation du chapitre
      </p>
      <p className="text-xs leading-relaxed text-fg-muted">
        {chapter.questionCount} questions · réussite à {PASS_THRESHOLD} %
        {chapter.bestScore !== null && ` · meilleur score : ${chapter.bestScore} %`}
      </p>
      {chapter.quizOpen ? (
        <Link
          href={`${base}/evaluation`}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-brand-fg transition hover:bg-brand-strong"
        >
          {chapter.passed ? "Revoir l'évaluation" : "Passer l'évaluation"}
        </Link>
      ) : (
        <span className="flex w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-lg bg-border/70 px-3 py-2 text-xs font-semibold text-fg-subtle">
          <Lock className="size-3.5" aria-hidden /> Encore {remaining} section{remaining > 1 ? "s" : ""} à lire
        </span>
      )}
    </div>
  );
}

/**
 * Mise en page « studio » d'un chapitre : barre de contexte, sommaire à gauche, contenu au centre,
 * et une colonne droite optionnelle (sommaire de la section, informations).
 */
export function ChapterShell({
  ctx,
  activeSlug,
  aside,
  readingMinutes,
  children,
}: {
  ctx: ChapterContext;
  activeSlug: string | null;
  aside?: ReactNode;
  readingMinutes?: number;
  children: ReactNode;
}) {
  const { course, mod, moduleIndex, chapter } = ctx;
  const read = chapter.completedSectionIds.size;
  const total = chapter.sections.length;
  const activeIndex = chapter.sections.findIndex((s) => s.slug === activeSlug);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-12 lg:py-8">
      {/* Barre de contexte */}
      <section className="card mb-6 p-4 sm:p-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <nav aria-label="Fil d'Ariane" className="flex min-w-0 flex-wrap items-center gap-2 text-xs text-fg-muted">
            <Link href={`/parcours/${course.parcours.slug}`} className="flex items-center gap-1 hover:text-brand">
              <TerminalSquare className="size-4" aria-hidden /> {course.parcours.title}
            </Link>
            <span className="text-fg-subtle">/</span>
            <span className="hidden sm:inline">Module {moduleIndex + 1} : {mod.title}</span>
            <span className="hidden text-fg-subtle sm:inline">/</span>
            <span className="font-semibold text-fg">{chapter.title}</span>
          </nav>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 lg:shrink-0 lg:flex-nowrap">
            {readingMinutes !== undefined && (
              <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-bg-muted px-3 py-1 font-mono text-[11px] text-fg-muted">
                <Clock className="size-3.5 text-accent" aria-hidden /> ~{readingMinutes} min de lecture
              </span>
            )}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="label-mono text-fg-subtle">Progression</p>
                <p className="whitespace-nowrap font-mono text-xs font-semibold text-brand">
                  {read}/{total} sections ({percent(read, total)} %)
                </p>
              </div>
              <div className="h-2 w-16 overflow-hidden rounded-full bg-border sm:w-28">
                <div className="progress-fill h-full rounded-full" style={{ width: `${percent(read, total)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        className={`grid grid-cols-1 items-start gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] xl:gap-8 ${
          aside ? "xl:grid-cols-[17rem_minmax(0,1fr)_16rem]" : ""
        }`}
      >
        {/* Sommaire (grand écran) */}
        <aside className="hidden lg:sticky lg:top-24 lg:block">
          <div className="card max-h-[calc(100dvh-8rem)] overflow-y-auto p-4">
            <div className="flex items-center justify-between pb-3">
              <div>
                <p className="label-mono text-brand">Module {pad(moduleIndex + 1)}</p>
                <p className="font-bold text-fg">Sommaire du chapitre</p>
              </div>
              <span className="label-mono shrink-0 whitespace-nowrap rounded bg-bg-muted px-2 py-0.5 normal-case text-fg-muted">{total} étapes</span>
            </div>
            <SectionNav ctx={ctx} activeSlug={activeSlug} />
            <EvaluationWidget ctx={ctx} active={activeSlug === null} />
          </div>
        </aside>

        <div className="min-w-0">
          {/* Sommaire repliable (mobile et tablette) */}
          <details className="group card mb-6 lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0">
                <span className="label-mono block text-brand">Module {pad(moduleIndex + 1)} · Sommaire</span>
                <span className="block truncate text-sm font-semibold text-fg">{chapter.title}</span>
                <span className="block font-mono text-[11px] text-fg-subtle">
                  {activeSlug === null ? "Évaluation" : `Section ${activeIndex + 1} / ${total}`} · {read} lue{read > 1 ? "s" : ""}
                </span>
              </span>
              <ChevronDown className="size-5 shrink-0 text-fg-muted transition group-open:rotate-180" aria-hidden />
            </summary>
            <div className="border-t border-border p-3">
              <SectionNav ctx={ctx} activeSlug={activeSlug} />
              <EvaluationWidget ctx={ctx} active={activeSlug === null} />
            </div>
          </details>

          {children}
        </div>

        {aside && <aside className="hidden space-y-5 xl:sticky xl:top-24 xl:block">{aside}</aside>}
      </div>
    </div>
  );
}

export function ChapterIntro({ ctx }: { ctx: ChapterContext }) {
  const { chapter, moduleIndex } = ctx;
  return (
    <header className="card mb-8 p-5 sm:p-7">
      <p className="label-mono text-brand">
        Module {pad(moduleIndex + 1)} · Chapitre {pad(chapter.position + 1)}
      </p>
      <h1 className="mt-2 text-3xl font-bold leading-tight tracking-[-0.025em] text-fg sm:text-4xl">{chapter.title}</h1>
      <p className="mt-3 leading-relaxed text-fg-muted">{chapter.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          `≈ ${chapter.duration_minutes} min (lecture, exercices, évaluation)`,
          `${chapter.sections.length} sections`,
          `Évaluation : ${chapter.questionCount} questions · ${PASS_THRESHOLD} %`,
        ].map((t) => (
          <span key={t} className="rounded-md bg-bg-muted px-2.5 py-1 font-mono text-[11px] text-fg-muted">
            {t}
          </span>
        ))}
      </div>
      <div className="mt-5 rounded-xl border border-brand-line bg-brand-soft p-4">
        <p className="label-mono text-brand">Objectifs du chapitre</p>
        <ul className="mt-2.5 space-y-1.5">
          {chapter.objectives.map((o) => (
            <li key={o} className="flex gap-2 text-sm leading-snug text-fg-muted">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden /> {o}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
