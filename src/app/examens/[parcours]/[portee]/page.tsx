import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Award, ClipboardCheck, GraduationCap, Lock, PenLine, RotateCcw } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getCourse, isCourseOpen } from "@/lib/queries";
import { PASS_THRESHOLD, requiredCorrect, seededShuffle } from "@/lib/quiz";
import { examAvailability } from "@/lib/exams";
import { FINAL_EXAM_SIZE, MODULE_EXAM_SIZE } from "@/lib/memorisation";
import { examDraw, getExamAttempt, getExamPool, getExamSummaries, getQuestionsByIds } from "@/lib/memorisation-queries";
import { submitExamAction } from "@/app/actions/exam";
import { QuizForm } from "@/components/quiz/quiz-form";
import { CorrectionList } from "@/components/quiz/correction-list";

export const metadata: Metadata = { title: "Examen" };

const pad = (n: number) => String(n).padStart(2, "0");

export default async function ExamPage({
  params,
  searchParams,
}: {
  params: Promise<{ parcours: string; portee: string }>;
  searchParams: Promise<{ tentative?: string; nouvelle?: string }>;
}) {
  const { parcours: slug, portee } = await params;
  const { tentative, nouvelle } = await searchParams;
  const user = await requireUser(`/examens/${slug}/${portee}`);
  const course = await getCourse(slug, user.id);
  if (!course || !isCourseOpen(course.parcours.status, user.role)) notFound();
  const isFinal = portee === "final";
  const mod = isFinal ? null : course.modules.find((m) => m.slug === portee);
  if (!isFinal && !mod) notFound();
  const moduleIndex = mod ? course.modules.findIndex((m) => m.id === mod.id) : -1;
  const href = `/examens/${course.parcours.slug}/${portee}`;
  const title = mod ? `Examen du module ${pad(moduleIndex + 1)} · ${mod.title}` : `Examen final · ${course.parcours.title}`;
  const availability = examAvailability(course, mod ?? null);
  const summaries = await getExamSummaries(user.id, course.parcours.id);
  const summary = summaries.find((s) => s.module_id === (mod?.id ?? null)) ?? null;
  const size = isFinal ? FINAL_EXAM_SIZE : MODULE_EXAM_SIZE;

  const header = (
    <div className="flex flex-wrap gap-2">
      <span className="label-mono inline-flex items-center gap-1.5 rounded-md bg-brand-soft px-2.5 py-1 text-brand">
        <GraduationCap className="size-3.5" aria-hidden /> {isFinal ? "Examen final" : `Module ${pad(moduleIndex + 1)}`} · {course.parcours.title}
      </span>
      {summary && (
        <span className="label-mono rounded-md bg-bg-muted px-2.5 py-1 normal-case text-fg-muted">
          {summary.attempts} tentative{summary.attempts > 1 ? "s" : ""} · meilleur score {summary.best} %
        </span>
      )}
    </div>
  );

  // Examen pas encore ouvert
  if (!availability.open) {
    const scope = mod ? course.chapters.filter((c) => c.module_id === mod.id) : course.chapters;
    const remaining = scope.filter((c) => !c.passed);
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="card p-6 sm:p-10">
          <span className="flex size-12 items-center justify-center rounded-xl bg-bg-muted text-fg-subtle">
            <Lock className="size-6" aria-hidden />
          </span>
          <p className="label-mono mt-5 text-brand">Examen verrouillé</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-fg sm:text-3xl">{title}</h1>
          <p className="mt-3 leading-relaxed text-fg-muted">
            L&apos;examen s&apos;ouvre une fois {isFinal ? "tous les chapitres du parcours" : "tous les chapitres du module"} validés. Il en reste{" "}
            {remaining.length} :
          </p>
          <ul className="mt-5 space-y-2">
            {remaining.slice(0, 8).map((c) => (
              <li key={c.id}>
                <Link
                  href={`/parcours/${course.parcours.slug}/${c.moduleSlug}/${c.slug}`}
                  className="flex items-center justify-between gap-3 rounded-xl bg-bg-muted px-4 py-3 text-sm font-medium text-fg transition hover:bg-bg-sunken"
                >
                  {c.title} <ArrowRight className="size-4 shrink-0 text-brand" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          {remaining.length > 8 && <p className="mt-3 text-sm text-fg-muted">… et {remaining.length - 8} autres.</p>}
        </div>
      </div>
    );
  }

  const attempt = tentative ? await getExamAttempt(Number(tentative), user.id) : null;

  // Résultat d'une tentative
  if (attempt && attempt.parcours_id === course.parcours.id && attempt.module_id === (mod?.id ?? null) && !nouvelle) {
    const rows = await getQuestionsByIds(attempt.answers.map((a) => a.questionId));
    const byId = new Map(rows.map((q) => [q.id, q]));
    const needed = requiredCorrect(attempt.total);
    const items = attempt.answers
      .filter((a) => byId.has(a.questionId))
      .map((a) => {
        const q = byId.get(a.questionId)!;
        return { ...q, selected: a.selected, isCorrect: a.isCorrect, meta: `Chapitre : ${q.chapter_title}` };
      });
    const chaptersToReview = attempt.passed
      ? [...new Set(items.filter((item) => !item.isCorrect).map((item) => item.chapter_title))]
      : [];
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {header}
        <div className={`mt-5 rounded-2xl border p-6 shadow-card sm:p-8 ${attempt.passed ? "border-success-line bg-success-soft" : "border-danger/30 bg-danger-soft"}`}>
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
              <p className={`label-mono ${attempt.passed ? "text-success" : "text-danger"}`}>{attempt.passed ? "Examen réussi" : "Seuil non atteint"}</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg sm:text-3xl">{title}</h1>
              <p className="mt-2 leading-relaxed text-fg-muted">
                {attempt.correct_count} bonne{attempt.correct_count > 1 ? "s" : ""} réponse{attempt.correct_count > 1 ? "s" : ""} sur {attempt.total}.{" "}
                {attempt.passed
                  ? isFinal
                    ? "Vous avez démontré votre maîtrise de l'ensemble du parcours : votre attestation est disponible."
                    : `Vous avez atteint le seuil de ${PASS_THRESHOLD} % sur l'ensemble du module.`
                  : `Il faut au moins ${needed} bonnes réponses (${PASS_THRESHOLD} %). Une nouvelle tentative tirera d'autres questions.`}
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {attempt.passed && isFinal ? (
              <>
                <Link href={`/certificat/${course.parcours.slug}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-success px-5 py-3 text-sm font-semibold text-white">
                  <Award className="size-4" aria-hidden /> Voir mon attestation
                </Link>
                <Link
                  href={`/parcours/${course.parcours.slug}/synthese`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-bg-elevated px-5 py-3 text-sm font-semibold text-fg hover:bg-bg-muted"
                >
                  <PenLine className="size-4" aria-hidden /> Sketchnotes du parcours (PDF)
                </Link>
              </>
            ) : (
              !attempt.passed && (
                <Link href={`${href}?nouvelle=1`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-brand-fg hover:bg-brand-strong">
                  <RotateCcw className="size-4" aria-hidden /> Retenter l&apos;examen
                </Link>
              )
            )}
            <Link href="/tableau-de-bord" className="inline-flex items-center justify-center rounded-xl border border-border bg-bg-elevated px-5 py-3 text-sm font-semibold text-fg hover:bg-bg-muted">
              Tableau de bord
            </Link>
          </div>
          {chaptersToReview.length > 0 && (
            <p className="mt-5 text-sm leading-relaxed text-fg-muted">
              <span className="font-semibold text-fg">Chapitres à relire : </span>
              {chaptersToReview.join(" · ")}
            </p>
          )}
        </div>

        <h2 className="mt-10 text-xl font-bold tracking-tight text-fg">Correction</h2>
        {!attempt.passed && (
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            Les bonnes réponses et les explications s&apos;affichent une fois l&apos;examen réussi, pour qu&apos;il reste un vrai contrôle de vos
            connaissances.
          </p>
        )}
        <CorrectionList items={items} reveal={attempt.passed} verdict={attempt.passed} />
      </div>
    );
  }

  // Formulaire d'examen
  const drawIndex = summary?.attempts ?? 0;
  const questions = examDraw(await getExamPool(course.parcours.id, mod?.id ?? null), user.id, course.parcours.id, mod?.id ?? null, drawIndex);
  const needed = requiredCorrect(questions.length);
  const seed = `${user.id}-examen-${portee}-${drawIndex}`;
  const view = questions.map((q) => ({
    id: q.id,
    prompt: q.prompt,
    code: q.code,
    multiple: q.multiple,
    options: /^(vrai|faux)$/i.test(q.options[0])
      ? q.options.map((label, index) => ({ index, label }))
      : seededShuffle(q.options.map((label, index) => ({ index, label })), `${seed}-${q.id}`),
  }));

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-12">
      <header className="mb-6 max-w-4xl">
        {header}
        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-[-0.025em] text-fg sm:text-4xl">{title}</h1>
        <p className="mt-3 leading-relaxed text-fg-muted">
          {questions.length} questions tirées au hasard dans {isFinal ? "tous les modules du parcours" : "tous les chapitres du module"}, réparties
          équitablement. Aucun support : c&apos;est le moment de vérifier ce que vous avez retenu.{" "}
          {isFinal ? "La réussite de cet examen est nécessaire pour obtenir l'attestation." : "Cet examen est recommandé mais ne bloque pas la suite du parcours."}
        </p>
        <span className="label-mono mt-4 inline-flex items-center gap-1.5 rounded-md bg-accent-soft px-2.5 py-1 normal-case text-accent">
          <ClipboardCheck className="size-3.5" aria-hidden /> Condition de réussite : {needed}/{questions.length} (≥ {PASS_THRESHOLD} %)
        </span>
      </header>
      <QuizForm
        questions={view}
        action={submitExamAction}
        hidden={{ parcours: course.parcours.slug, scope: portee }}
        required={needed}
        submitLabel="Soumettre l'examen"
        note={
          <>
            Il faut au moins <strong className="text-fg">{needed} bonnes réponses sur {questions.length}</strong> pour réussir l&apos;examen (
            {size} questions prévues). La correction est effectuée après l&apos;envoi.
          </>
        }
      />
    </div>
  );
}
