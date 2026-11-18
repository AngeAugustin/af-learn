import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, BadgeCheck, CheckCircle2, ClipboardCheck, GraduationCap, Lock, Repeat, RotateCcw, XCircle } from "lucide-react";
import { loadChapterContext, type ChapterParams } from "@/lib/chapter-context";
import { getAttempt, getQuestions } from "@/lib/queries";
import { PASS_THRESHOLD, requiredCorrect, seededShuffle } from "@/lib/quiz";
import { submitQuizAction } from "@/app/actions/quiz";
import { ChapterShell } from "@/components/chapter/chapter-shell";
import { LockedChapter } from "@/components/chapter/locked-chapter";
import { QuizForm } from "@/components/quiz/quiz-form";
import { InlineText } from "@/components/content/inline-text";
import { chapterDraw } from "@/lib/memorisation-queries";
import { examAvailability } from "@/lib/exams";

export const metadata: Metadata = { title: "Évaluation du chapitre" };

const pad = (n: number) => String(n).padStart(2, "0");
const LETTERS = "ABCDEF";

export default async function EvaluationPage({
  params,
  searchParams,
}: {
  params: Promise<ChapterParams>;
  searchParams: Promise<{ tentative?: string; nouvelle?: string }>;
}) {
  const p = await params;
  const { tentative, nouvelle } = await searchParams;
  const ctx = await loadChapterContext(p, `/parcours/${p.parcours}/${p.module}/${p.chapitre}/evaluation`);
  if (ctx.chapter.state === "locked") return <LockedChapter ctx={ctx} />;
  const { chapter, base, course, next, moduleIndex } = ctx;
  const bank = await getQuestions(chapter.id);
  // Chaque tentative tire ses questions dans la banque du chapitre
  const questions = chapterDraw(bank, ctx.user.id, chapter.id, chapter.attempts);
  const needed = requiredCorrect(questions.length);
  const nextModuleIndex = next ? course.modules.findIndex((m) => m.id === next.module_id) : -1;

  // Sections restant à lire avant l'évaluation
  if (!chapter.quizOpen) {
    const unread = chapter.sections.filter((s) => !chapter.completedSectionIds.has(s.id));
    return (
      <ChapterShell ctx={ctx} activeSlug={null}>
        <div className="card p-6 sm:p-10">
          <span className="flex size-12 items-center justify-center rounded-xl bg-bg-muted text-fg-subtle">
            <Lock className="size-6" aria-hidden />
          </span>
          <p className="label-mono mt-5 text-brand">Évaluation verrouillée</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-fg sm:text-3xl">Évaluation : {chapter.title}</h1>
          <p className="mt-3 leading-relaxed text-fg-muted">
            L&apos;évaluation s&apos;ouvre une fois toutes les sections du chapitre lues. Il vous reste {unread.length} section
            {unread.length > 1 ? "s" : ""} :
          </p>
          <ul className="mt-5 space-y-2">
            {unread.map((s) => (
              <li key={s.id}>
                <Link
                  href={`${base}/${s.slug}`}
                  className="flex items-center justify-between gap-3 rounded-xl bg-bg-muted px-4 py-3 text-sm font-medium text-fg transition hover:bg-bg-sunken"
                >
                  {s.title} <ArrowRight className="size-4 shrink-0 text-brand" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </ChapterShell>
    );
  }

  const attempt = tentative ? await getAttempt(Number(tentative), ctx.user.id) : null;

  // Résultat d'une tentative
  if (attempt && attempt.chapter_id === chapter.id && !nouvelle) {
    const byPosition = new Map(attempt.answers.map((a) => [a.position, a]));
    const wrongCount = attempt.total - attempt.correct_count;
    const nextHref = next ? `/parcours/${course.parcours.slug}/${next.moduleSlug}/${next.slug}` : null;
    const finished = course.chapters.every((c) => c.passed);
    const asked = bank.filter((q) => byPosition.has(q.position));
    const neededForAttempt = requiredCorrect(attempt.total);
    const moduleExamOpen = examAvailability(course, ctx.mod).open;
    return (
      <ChapterShell ctx={ctx} activeSlug={null}>
        <div className={`rounded-2xl border p-6 shadow-card sm:p-8 ${attempt.passed ? "border-success-line bg-success-soft" : "border-danger/30 bg-danger-soft"}`}>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div
              className={`flex size-28 shrink-0 flex-col items-center justify-center rounded-full border-[6px] bg-bg-elevated ${
                attempt.passed ? "border-success text-success" : "border-danger text-danger"
              }`}
            >
              <span className="text-3xl font-bold tracking-tight">{attempt.score} %</span>
              <span className="font-mono text-[10px] text-fg-muted">
                {attempt.correct_count}/{attempt.total}
              </span>
            </div>
            <div>
              <p className={`label-mono ${attempt.passed ? "text-success" : "text-danger"}`}>
                {attempt.passed ? "Chapitre validé" : "Seuil non atteint"}
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg sm:text-3xl">
                {attempt.passed ? "Bravo, chapitre validé !" : "Pas encore validé"}
              </h1>
              <p className="mt-2 leading-relaxed text-fg-muted">
                {attempt.correct_count} bonne{attempt.correct_count > 1 ? "s" : ""} réponse{attempt.correct_count > 1 ? "s" : ""} sur {attempt.total}.{" "}
                {attempt.passed
                  ? `Vous avez atteint le seuil de ${PASS_THRESHOLD} %.`
                  : `Il faut au moins ${neededForAttempt} bonnes réponses (${PASS_THRESHOLD} %). Relisez les sections concernées puis réessayez.`}
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {attempt.passed ? (
              finished ? (
                <Link href={`/examens/${course.parcours.slug}/final`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-success px-5 py-3 text-sm font-semibold text-white">
                  <Award className="size-4" aria-hidden /> Passer l&apos;examen final
                </Link>
              ) : (
                nextHref && (
                  <Link href={nextHref} className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-brand-fg hover:bg-brand-strong">
                    Chapitre suivant : {next!.title} <ArrowRight className="size-4" aria-hidden />
                  </Link>
                )
              )
            ) : (
              <Link href={`${base}/evaluation?nouvelle=1`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-brand-fg hover:bg-brand-strong">
                <RotateCcw className="size-4" aria-hidden /> Retenter l&apos;évaluation
              </Link>
            )}
            {attempt.passed && moduleExamOpen && (
              <Link href={`/examens/${course.parcours.slug}/${ctx.mod.slug}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-line bg-brand-soft px-5 py-3 text-sm font-semibold text-brand hover:bg-bg-muted">
                <GraduationCap className="size-4" aria-hidden /> Examen du module
              </Link>
            )}
            <Link href={`${base}/${chapter.sections[0].slug}`} className="inline-flex items-center justify-center rounded-xl border border-border bg-bg-elevated px-5 py-3 text-sm font-semibold text-fg hover:bg-bg-muted">
              Revoir le chapitre
            </Link>
          </div>
          {attempt.passed && (
            <p className="mt-5 flex items-start gap-2 text-sm leading-relaxed text-fg-muted">
              <Repeat className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
              <span>
                Les {bank.length} questions de ce chapitre rejoignent vos <Link href="/revisions" className="font-semibold text-brand hover:underline">révisions espacées</Link> :
                elles reviendront demain, puis à J+7, J+30 et J+90 tant que vous y répondez juste.
              </span>
            </p>
          )}
        </div>

        <h2 className="mt-10 text-xl font-bold tracking-tight text-fg">Correction</h2>
        {!attempt.passed && (
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            {wrongCount} question{wrongCount > 1 ? "s" : ""} à revoir. Les bonnes réponses et les explications détaillées s&apos;affichent une
            fois le chapitre validé, pour que l&apos;évaluation reste un vrai contrôle de vos connaissances.
          </p>
        )}
        <ol className="mt-5 space-y-4">
          {asked.map((q, i) => {
            const a = byPosition.get(q.position);
            const ok = a?.isCorrect ?? false;
            return (
              <li key={q.id} className="card p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  {attempt.passed &&
                  (ok ? (
                    <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-success" aria-label="Bonne réponse" />
                  ) : (
                    <XCircle className="mt-0.5 size-6 shrink-0 text-danger" aria-label="Réponse incorrecte" />
                  ))}
                  <div className="min-w-0 flex-1">
                    <p className={`label-mono ${attempt.passed ? (ok ? "text-success" : "text-danger") : "text-fg-subtle"}`}>
                      Question {i + 1}
                      {attempt.passed ? ` · ${ok ? "Correcte" : "Incorrecte"}` : ""}
                    </p>
                    <p className="mt-1 font-semibold leading-snug text-fg">
                      <InlineText text={q.prompt} />
                    </p>
                    <ul className="mt-3 space-y-2">
                      {q.options.map((label, idx) => {
                        const selected = a?.selected.includes(idx) ?? false;
                        const reveal = attempt.passed;
                        const correct = reveal && q.correct.includes(idx);
                        let style = "border-transparent bg-bg-muted text-fg-muted";
                        if (correct) style = "border-success-line bg-success-soft text-fg";
                        else if (selected && reveal && !q.correct.includes(idx)) style = "border-danger/40 bg-danger-soft text-fg";
                        else if (selected) style = "border-brand-line bg-brand-soft text-fg";
                        return (
                          <li key={idx} className={`flex items-start gap-3 rounded-xl border px-3.5 py-2.5 text-sm ${style}`}>
                            <span className="label-mono mt-0.5 w-5 shrink-0 text-fg-subtle">{LETTERS[idx]}</span>
                            <span className="min-w-0 flex-1 leading-snug">
                              <InlineText text={label} />
                            </span>
                            {selected && <span className="label-mono shrink-0 normal-case text-fg-muted">Votre choix</span>}
                          </li>
                        );
                      })}
                    </ul>
                    {attempt.passed && (
                      <p className="mt-3 rounded-xl border-l-4 border-brand bg-brand-soft px-4 py-3 text-sm leading-relaxed text-fg-muted">
                        <span className="font-semibold text-fg">Explication : </span>
                        <InlineText text={q.explanation} />
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </ChapterShell>
    );
  }

  // Formulaire d'évaluation (ordre des options mélangé de façon stable par tentative)
  const seed = `${ctx.user.id}-${chapter.id}-${chapter.attempts}`;
  const drawNote = bank.length > questions.length ? ` · ${questions.length} questions tirées parmi ${bank.length}` : "";
  const view = questions.map((q) => ({
    id: q.id,
    prompt: q.prompt,
    code: q.code,
    multiple: q.multiple,
    options: /^(vrai|faux)$/i.test(q.options[0])
      ? q.options.map((label, index) => ({ index, label }))
      : seededShuffle(q.options.map((label, index) => ({ index, label })), `${seed}-${q.id}`),
  }));

  const nextChapterCard = next ? (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className="label-mono rounded bg-bg-muted px-2 py-0.5 text-fg-muted">Prochaine étape</span>
        {next.state === "locked" ? (
          <span className="label-mono flex items-center gap-1 normal-case text-danger">
            <Lock className="size-3" aria-hidden /> Verrouillé
          </span>
        ) : (
          <span className="label-mono normal-case text-success">Débloqué</span>
        )}
      </div>
      <p className="mt-3 font-bold leading-snug text-fg">
        Module {pad(nextModuleIndex + 1)} · {next.title}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">{next.description}</p>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-fg-subtle">
        <BadgeCheck className="size-4 text-brand" aria-hidden /> Déblocage automatique dès {needed}/{questions.length}
      </p>
    </div>
  ) : null;

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-12">
      <header className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div className="max-w-4xl">
          <div className="flex flex-wrap gap-2">
            <span className="label-mono rounded-md bg-brand-soft px-2.5 py-1 text-brand">
              Module {pad(moduleIndex + 1)} · {course.parcours.title}
            </span>
            <span className="label-mono inline-flex items-center gap-1.5 rounded-md bg-accent-soft px-2.5 py-1 normal-case text-accent">
              <ClipboardCheck className="size-3.5" aria-hidden /> Condition de validation : {needed}/{questions.length} (≥ {PASS_THRESHOLD} %){drawNote}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-[-0.025em] text-fg sm:text-4xl">
            Évaluation : {chapter.title}
          </h1>
          <p className="mt-3 leading-relaxed text-fg-muted">{chapter.description}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {chapter.attempts > 0 && (
            <span className="rounded-lg bg-bg-muted px-3 py-2 font-mono text-[11px] text-fg-muted">
              {chapter.attempts} tentative{chapter.attempts > 1 ? "s" : ""} · meilleur score {chapter.bestScore} %
            </span>
          )}
          <Link href={`${base}/${chapter.sections[0].slug}`} className="rounded-lg border border-border bg-bg-elevated px-3 py-2 text-xs font-semibold text-fg hover:bg-bg-muted">
            Revoir le chapitre
          </Link>
        </div>
      </header>
      <QuizForm
        questions={view}
        action={submitQuizAction}
        hidden={{ parcours: course.parcours.slug, chapterId: String(chapter.id) }}
        required={needed}
        sidebarExtra={nextChapterCard}
      />
    </div>
  );
}
