import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, CheckCircle2, ChevronDown, GraduationCap, Lock, PenLine, Play, Repeat, TrendingUp, XCircle } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getCourse, getRecentAttempts, listParcours } from "@/lib/queries";
import { percent } from "@/lib/progress";
import { PASS_THRESHOLD } from "@/lib/quiz";
import { ChapterStatusBadge, ChapterStatusIcon } from "@/components/ui/chapter-status";
import { ProgressRing, SegmentedProgress } from "@/components/ui/progress";
import { ParcoursIcon } from "@/components/ui/parcours-icon";
import { getExamSummaries, getReviewSummary, type ExamSummary } from "@/lib/memorisation-queries";
import { MODULE_EXAM_SIZE } from "@/lib/memorisation";

export const metadata: Metadata = { title: "Tableau de bord" };

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" });
const pad = (n: number) => String(n).padStart(2, "0");
const hours = (minutes: number) => (Math.round((minutes / 60) * 10) / 10).toLocaleString("fr-FR");

export default async function DashboardPage() {
  const user = await requireUser("/tableau-de-bord");
  const all = await listParcours();
  const published = all.filter((p) => p.status === "published");
  const courses = (await Promise.all(published.map((p) => getCourse(p.slug, user.id)))).filter((c) => c !== null);
  const attempts = await getRecentAttempts(user.id);
  const reviews = await getReviewSummary(user.id);
  const examsByParcours = new Map(
    await Promise.all(courses.map(async (c) => [c.parcours.id, await getExamSummaries(user.id, c.parcours.id)] as const)),
  );
  const firstName = user.name.split(" ")[0];
  // On n'affiche que les parcours réellement commencés : au moins une section lue
  // ou une tentative d'évaluation. Sinon le tableau de bord listerait tous les parcours publiés.
  const started = courses.filter(
    (c) => c.totals.completedSections > 0 || c.chapters.some((ch) => ch.attempts > 0),
  );

  if (started.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:py-24">
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-fg sm:text-4xl">Bonjour {firstName}</h1>
        <p className="mt-4 leading-relaxed text-fg-muted">
          Vous n&apos;avez pas encore commencé de parcours. Choisissez-en un pour suivre votre progression ici.
        </p>
        <Link
          href="/parcours"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-brand-fg transition hover:bg-brand-strong"
        >
          <Play className="size-4" aria-hidden /> Découvrir les parcours
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] space-y-16 px-4 py-8 sm:px-6 lg:px-12 lg:py-10">
      {started.map((course) => {
        const { parcours, modules, chapters, totals } = course;
        const current = chapters.find((c) => c.state === "in_progress" || c.state === "available") ?? null;
        const currentModuleIndex = current ? modules.findIndex((m) => m.id === current.module_id) : -1;
        const chaptersDone = totals.chapters > 0 && totals.passed === totals.chapters;
        const exams = examsByParcours.get(parcours.id) ?? [];
        const finalExam = exams.find((e) => e.module_id === null) ?? null;
        const done = chaptersDone && (finalExam?.passed ?? false);
        const review = reviews.find((r) => r.parcours_id === parcours.id) ?? null;
        const passedScores = chapters.filter((c) => c.passed && c.bestScore !== null).map((c) => c.bestScore!);
        const average = passedScores.length ? Math.round(passedScores.reduce((a, b) => a + b, 0) / passedScores.length) : null;
        const validatedMinutes = chapters.filter((c) => c.passed).reduce((n, c) => n + c.duration_minutes, 0);
        const chapterHref = (moduleSlug: string, slug: string) => `/parcours/${parcours.slug}/${moduleSlug}/${slug}`;
        const readSections = current ? current.completedSectionIds.size : 0;

        return (
          <div key={parcours.id}>
            {/* En-tête */}
            <section className="flex flex-col justify-between gap-6 lg:flex-row lg:items-stretch">
              <div className="max-w-3xl">
                <div className="flex flex-wrap gap-2">
                  <span className="label-mono inline-flex items-center gap-1.5 rounded-md bg-brand-soft px-2.5 py-1 text-brand">
                    <ParcoursIcon icon={parcours.icon} className="size-3.5" /> Parcours suivi
                  </span>
                  <span className="label-mono rounded-md border border-border bg-bg-elevated px-2.5 py-1 normal-case text-fg-muted">
                    {parcours.level}
                  </span>
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-fg sm:text-4xl">Bonjour {firstName}, voici votre {parcours.title}</h1>
                <p className="mt-3 leading-relaxed text-fg-muted">{parcours.tagline}</p>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-fg-muted">
                  <span>≈ {Math.round(totals.minutes / 60)} heures estimées</span>
                  <span>{modules.length} modules</span>
                  <span>{totals.chapters} chapitres</span>
                  <span>{totals.questions} questions</span>
                </div>
              </div>
              <div className="card w-full shrink-0 border-brand-line p-5 lg:w-[22rem]">
                {done ? (
                  <>
                    <p className="label-mono text-success">Parcours terminé</p>
                    <p className="mt-2 text-lg font-bold text-fg">Chapitres et examen final validés.</p>
                    <div className="mt-4 space-y-2">
                      <Link href={`/certificat/${parcours.slug}`} className="flex items-center justify-center gap-2 rounded-lg bg-success px-4 py-2.5 text-sm font-semibold text-white">
                        <Award className="size-4" aria-hidden /> Voir mon attestation
                      </Link>
                      <Link
                        href={`/parcours/${parcours.slug}/synthese`}
                        className="flex items-center justify-center gap-2 rounded-lg border border-border bg-bg-elevated px-4 py-2.5 text-sm font-semibold text-fg transition hover:border-brand-line hover:text-brand"
                      >
                        <PenLine className="size-4" aria-hidden /> Sketchnotes (PDF)
                      </Link>
                    </div>
                  </>
                ) : chaptersDone ? (
                  <>
                    <p className="label-mono text-brand">Dernière étape</p>
                    <p className="mt-2 text-lg font-bold text-fg">Tous les chapitres sont validés.</p>
                    <p className="mt-1 text-sm text-fg-muted">
                      Réussissez l&apos;examen final pour obtenir l&apos;attestation{finalExam ? ` (meilleur score : ${finalExam.best} %)` : ""}.
                    </p>
                    <div className="mt-4 space-y-2">
                      <Link
                        href={`/examens/${parcours.slug}/final`}
                        className="flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg hover:bg-brand-strong"
                      >
                        <GraduationCap className="size-4" aria-hidden /> Passer l&apos;examen final
                      </Link>
                      <Link
                        href={`/parcours/${parcours.slug}/synthese`}
                        className="flex items-center justify-center gap-2 rounded-lg border border-border bg-bg-elevated px-4 py-2.5 text-sm font-semibold text-fg transition hover:border-brand-line hover:text-brand"
                      >
                        <PenLine className="size-4" aria-hidden /> Sketchnotes (PDF)
                      </Link>
                    </div>
                  </>
                ) : (
                  current && (
                    <>
                      <div className="flex items-center justify-between">
                        <p className="label-mono text-brand">Reprise directe</p>
                        <span className="label-mono text-fg-subtle">
                          M{pad(currentModuleIndex + 1)} · C{pad(current.position + 1)}
                        </span>
                      </div>
                      <p className="mt-2 font-bold leading-snug text-fg">{current.title}</p>
                      <p className="mt-1 font-mono text-[11px] text-fg-muted">
                        Section {Math.min(readSections + 1, current.sections.length)}/{current.sections.length} ·{" "}
                        {modules[currentModuleIndex]?.title}
                      </p>
                      <Link
                        href={chapterHref(current.moduleSlug, current.slug)}
                        className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg transition hover:bg-brand-strong"
                      >
                        <Play className="size-4" aria-hidden /> {totals.completedSections > 0 ? "Reprendre le chapitre" : "Commencer le parcours"}
                      </Link>
                    </>
                  )
                )}
              </div>
            </section>

            {/* Progression globale */}
            <section className="card mt-8 p-5 sm:p-6">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-fg">
                    <TrendingUp className="size-4 text-brand" aria-hidden /> Progression globale : {percent(totals.passed, totals.chapters)} %
                    <span className="font-normal text-fg-muted">
                      ({totals.passed} / {totals.chapters} chapitres validés)
                    </span>
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-fg-muted">
                    Temps de formation validé : {hours(validatedMinutes)} h · {totals.completedSections} sections lues
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="rounded-xl bg-bg-muted px-4 py-2.5 text-center">
                    <p className="label-mono text-fg-subtle">Score moyen</p>
                    <p className="text-xl font-bold text-brand">{average !== null ? `${average} %` : "-"}</p>
                  </div>
                  <div className="rounded-xl bg-bg-muted px-4 py-2.5 text-center">
                    <p className="label-mono text-fg-subtle">Chapitres</p>
                    <p className="text-xl font-bold text-success">{totals.passed}</p>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <SegmentedProgress
                  segments={modules.map((m) => ({
                    label: m.title,
                    value: percent(m.chapters.filter((c) => c.passed).length, m.chapters.length),
                  }))}
                />
              </div>
            </section>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
              {/* Modules */}
              <section className="min-w-0 space-y-4">
                {modules.map((m, mi) => {
                  const passed = m.chapters.filter((c) => c.passed).length;
                  const allPassed = passed === m.chapters.length;
                  const locked = m.chapters.every((c) => c.state === "locked");
                  const isCurrent = mi === currentModuleIndex;
                  return (
                    <details key={m.id} open={isCurrent} className={`group card overflow-hidden ${isCurrent ? "border-t-4 border-t-brand" : ""}`}>
                      <summary className="flex cursor-pointer list-none items-center gap-4 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
                        <span
                          className={`flex size-9 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                            allPassed ? "bg-success-soft text-success" : locked ? "bg-bg-muted text-fg-subtle" : "bg-brand-soft text-brand"
                          }`}
                        >
                          {locked ? <Lock className="size-4" aria-hidden /> : pad(mi + 1)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="label-mono block text-fg-subtle">
                            Module {pad(mi + 1)} · {allPassed ? "Validé" : locked ? "Verrouillé" : isCurrent ? "En cours" : "Disponible"} ·{" "}
                            {m.chapters.length} chapitres
                          </span>
                          <span className="block font-semibold leading-snug text-fg">{m.title}</span>
                        </span>
                        <span
                          className={`label-mono hidden shrink-0 rounded-md border px-2 py-1 normal-case sm:block ${
                            allPassed
                              ? "border-success-line bg-success-soft text-success"
                              : locked
                                ? "border-dashed border-border-strong text-fg-subtle"
                                : "border-brand-line bg-brand-soft text-brand"
                          }`}
                        >
                          {passed}/{m.chapters.length}
                        </span>
                        <ChevronDown className="size-5 shrink-0 text-fg-muted transition group-open:rotate-180" aria-hidden />
                      </summary>
                      <ol className="space-y-2 border-t border-border p-4 sm:p-5">
                        {m.chapters.map((c) => {
                          const row = (
                            <div className="flex items-center gap-3 rounded-xl bg-bg-muted/60 px-3.5 py-3 transition hover:bg-bg-muted">
                              <ChapterStatusIcon state={c.state} className="size-5 shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-fg">
                                  {mi + 1}.{c.position + 1} {c.title}
                                </p>
                                <p className="font-mono text-[11px] text-fg-subtle">
                                  {c.completedSectionIds.size}/{c.sections.length} sections lues
                                  {c.attempts > 0 && ` · ${c.attempts} tentative${c.attempts > 1 ? "s" : ""}`}
                                </p>
                              </div>
                              <ChapterStatusBadge state={c.state} bestScore={c.bestScore} />
                            </div>
                          );
                          return (
                            <li key={c.id}>
                              {c.state === "locked" ? row : <Link href={chapterHref(m.slug, c.slug)}>{row}</Link>}
                            </li>
                          );
                        })}
                        {allPassed && (
                          <ModuleExamRow href={`/examens/${parcours.slug}/${m.slug}`} exam={exams.find((e) => e.module_id === m.id) ?? null} />
                        )}
                      </ol>
                    </details>
                  );
                })}
              </section>

              {/* Colonne latérale */}
              <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
                <div className={`card p-5 ${review && review.due > 0 ? "border-brand-line" : ""}`}>
                  <p className="label-mono flex items-center gap-1.5 text-fg-subtle">
                    <Repeat className="size-3.5" aria-hidden /> Révisions espacées
                  </p>
                  {review ? (
                    <>
                      <p className="mt-1 font-semibold text-fg">
                        {review.due > 0
                          ? `${review.due} question${review.due > 1 ? "s" : ""} à revoir aujourd’hui`
                          : "À jour pour aujourd’hui"}
                      </p>
                      <p className="mt-1 font-mono text-[11px] text-fg-muted">
                        {review.total} questions suivies · {review.mastered} maîtrisées
                      </p>
                      {review.due > 0 && (
                        <Link
                          href={`/revisions?parcours=${parcours.slug}`}
                          className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg hover:bg-brand-strong"
                        >
                          <Repeat className="size-4" aria-hidden /> Réviser maintenant
                        </Link>
                      )}
                    </>
                  ) : (
                    <p className="mt-1 text-sm leading-relaxed text-fg-muted">
                      Les questions de chaque chapitre validé reviendront ici à J+1, J+7, J+30 et J+90 pour ancrer vos connaissances.
                    </p>
                  )}
                </div>

                <div className="card p-5">
                  <p className="label-mono text-fg-subtle">Attestation</p>
                  <p className="mt-1 font-semibold text-fg">{done ? "Attestation disponible" : "Préparation de l'attestation"}</p>
                  <div className="mt-4 flex items-center gap-4 rounded-xl bg-bg-muted p-3">
                    <ProgressRing value={percent(totals.passed, totals.chapters)} size={64} stroke={6} label="Progression" />
                    <p className="text-xs leading-relaxed text-fg-muted">
                      Délivrée lorsque les {totals.chapters} chapitres sont validés (≥ {PASS_THRESHOLD} % chacun) et l&apos;examen final réussi.
                    </p>
                  </div>
                  <ul className="mt-4 space-y-2 text-xs text-fg-muted">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-success" aria-hidden /> {totals.passed} chapitres validés
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className={`size-4 ${totals.completedSections === totals.sections ? "text-success" : "text-fg-subtle"}`} aria-hidden />
                      {totals.completedSections}/{totals.sections} sections lues
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className={`size-4 ${finalExam?.passed ? "text-success" : "text-fg-subtle"}`} aria-hidden />
                      Examen final {finalExam?.passed ? `réussi (${finalExam.best} %)` : chaptersDone ? "à passer" : "après les chapitres"}
                    </li>
                  </ul>
                  {(done || chaptersDone) && (
                    <div className="mt-4 space-y-2">
                      {done && (
                        <Link href={`/certificat/${parcours.slug}`} className="flex items-center justify-center gap-2 rounded-lg bg-success px-4 py-2.5 text-sm font-semibold text-white">
                          <Award className="size-4" aria-hidden /> Voir l&apos;attestation
                        </Link>
                      )}
                      <Link
                        href={`/parcours/${parcours.slug}/synthese`}
                        className="flex items-center justify-center gap-2 rounded-lg border border-border bg-bg-elevated px-4 py-2.5 text-sm font-semibold text-fg transition hover:border-brand-line hover:text-brand"
                      >
                        <PenLine className="size-4" aria-hidden /> Sketchnotes (PDF)
                      </Link>
                    </div>
                  )}
                </div>

                <div className="card overflow-hidden">
                  <p className="border-b border-border px-5 py-4 font-semibold text-fg">Dernières évaluations</p>
                  {attempts.length === 0 ? (
                    <p className="p-5 text-sm text-fg-muted">
                      Aucune évaluation pour l&apos;instant. Lisez les sections d&apos;un chapitre pour débloquer son évaluation.
                    </p>
                  ) : (
                    <ul className="divide-y divide-border">
                      {attempts.map((a) => (
                        <li key={a.id}>
                          <Link
                            href={`/parcours/${a.parcours_slug}/${a.module_slug}/${a.chapter_slug}/evaluation?tentative=${a.id}`}
                            className="flex items-center gap-3 px-5 py-3 transition hover:bg-bg-muted"
                          >
                            {a.passed ? (
                              <CheckCircle2 className="size-5 shrink-0 text-success" aria-label="Réussie" />
                            ) : (
                              <XCircle className="size-5 shrink-0 text-danger" aria-label="Échouée" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-fg">{a.chapter_title}</p>
                              <p className="font-mono text-[11px] text-fg-subtle">{dateFormat.format(new Date(a.created_at))}</p>
                            </div>
                            <span className={`font-mono text-sm font-bold ${a.passed ? "text-success" : "text-danger"}`}>{a.score} %</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <Link href="/parcours" className="flex items-center justify-between rounded-2xl bg-bg-sunken p-4 text-sm font-semibold text-fg transition hover:bg-brand-soft">
                  Explorer les autres parcours <ArrowRight className="size-4 text-brand" aria-hidden />
                </Link>
              </aside>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Ligne « Examen du module », affichée dans un module dont tous les chapitres sont validés. */
function ModuleExamRow({ href, exam }: { href: string; exam: ExamSummary | null }) {
  return (
    <li>
      <Link href={href} className="flex items-center gap-3 rounded-xl border border-dashed border-brand-line px-3.5 py-3 transition hover:bg-brand-soft">
        <GraduationCap className={`size-5 shrink-0 ${exam?.passed ? "text-success" : "text-brand"}`} aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-fg">Examen du module</p>
          <p className="font-mono text-[11px] text-fg-subtle">
            {exam
              ? `${exam.attempts} tentative${exam.attempts > 1 ? "s" : ""} · meilleur score ${exam.best} %`
              : `${MODULE_EXAM_SIZE} questions sur l’ensemble du module · recommandé`}
          </p>
        </div>
        <span
          className={`label-mono shrink-0 rounded-md px-2 py-1 normal-case ${
            exam?.passed ? "bg-success-soft text-success" : "bg-brand-soft text-brand"
          }`}
        >
          {exam?.passed ? "Réussi" : exam ? "À retenter" : "À passer"}
        </span>
      </Link>
    </li>
  );
}
