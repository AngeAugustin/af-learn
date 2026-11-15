import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BrainCircuit, CalendarClock, CheckCircle2, Repeat, Trophy } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { seededShuffle } from "@/lib/quiz";
import { REVIEW_BATCH, REVIEW_INTERVALS_DAYS, describeDelay } from "@/lib/memorisation";
import { getDueQuestions, getQuestionsByIds, getReviewSession, getReviewSummary } from "@/lib/memorisation-queries";
import { submitReviewAction } from "@/app/actions/review";
import { QuizForm } from "@/components/quiz/quiz-form";
import { CorrectionList } from "@/components/quiz/correction-list";

export const metadata: Metadata = { title: "Révisions" };

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

export default async function RevisionsPage({ searchParams }: { searchParams: Promise<{ parcours?: string; seance?: string }> }) {
  const { parcours, seance } = await searchParams;
  const user = await requireUser("/revisions");
  const summary = await getReviewSummary(user.id);
  const filter = parcours && summary.some((s) => s.parcours_slug === parcours) ? parcours : null;
  const scoped = filter ? summary.filter((s) => s.parcours_slug === filter) : summary;
  const dueTotal = scoped.reduce((n, s) => n + s.due, 0);
  const query = filter ? `?parcours=${encodeURIComponent(filter)}` : "";

  const intro = (
    <header className="max-w-3xl">
      <span className="label-mono inline-flex items-center gap-1.5 rounded-md bg-brand-soft px-2.5 py-1 text-brand">
        <Repeat className="size-3.5" aria-hidden /> Révisions espacées
      </span>
      <h1 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-fg sm:text-4xl">Ancrer ce que vous avez appris</h1>
      <p className="mt-3 leading-relaxed text-fg-muted">
        Chaque chapitre validé ajoute ses questions à vos révisions. Une question revient le lendemain, puis à J+7, J+30 et J+90 tant que vous y
        répondez juste ; une erreur la ramène au lendemain. Quelques minutes par jour suffisent à retenir durablement.
      </p>
    </header>
  );

  const overview = (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {summary.map((s) => (
        <div key={s.parcours_id} className={`card p-5 ${filter === s.parcours_slug ? "border-brand-line" : ""}`}>
          <p className="font-semibold text-fg">{s.parcours_title}</p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-bg-muted px-2 py-2">
              <p className="label-mono text-fg-subtle">À revoir</p>
              <p className={`text-xl font-bold ${s.due > 0 ? "text-brand" : "text-fg-muted"}`}>{s.due}</p>
            </div>
            <div className="rounded-xl bg-bg-muted px-2 py-2">
              <p className="label-mono text-fg-subtle">Suivies</p>
              <p className="text-xl font-bold text-fg">{s.total}</p>
            </div>
            <div className="rounded-xl bg-bg-muted px-2 py-2">
              <p className="label-mono text-fg-subtle">Maîtrisées</p>
              <p className="text-xl font-bold text-success">{s.mastered}</p>
            </div>
          </div>
          {s.due > 0 ? (
            <Link
              href={`/revisions?parcours=${encodeURIComponent(s.parcours_slug)}`}
              className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-fg hover:bg-brand-strong"
            >
              Réviser ce parcours <ArrowRight className="size-4" aria-hidden />
            </Link>
          ) : (
            s.next_due && (
              <p className="mt-4 flex items-center gap-1.5 font-mono text-[11px] text-fg-muted">
                <CalendarClock className="size-3.5" aria-hidden /> Prochaine révision le {dateFormat.format(new Date(s.next_due))}
              </p>
            )
          )}
        </div>
      ))}
    </section>
  );

  // Aucun chapitre validé pour l'instant
  if (summary.length === 0) {
    return (
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
        {intro}
        <div className="card p-6 text-fg-muted">
          <BrainCircuit className="size-8 text-brand" aria-hidden />
          <p className="mt-3 leading-relaxed">
            Vous n&apos;avez encore validé aucun chapitre. Dès votre première évaluation réussie, ses questions apparaîtront ici pour être revues au
            bon moment.
          </p>
          <Link href="/tableau-de-bord" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg">
            Reprendre mon parcours <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    );
  }

  // Correction d'une séance
  const session = seance ? await getReviewSession(Number(seance), user.id) : null;
  if (session) {
    const rows = await getQuestionsByIds(session.answers.map((a) => a.questionId));
    const byId = new Map(rows.map((q) => [q.id, q]));
    const now = new Date(session.created_at).getTime();
    const items = session.answers
      .filter((a) => byId.has(a.questionId))
      .map((a) => {
        const q = byId.get(a.questionId)!;
        const days = Math.round((new Date(a.dueAt).getTime() - now) / 86_400_000);
        return {
          ...q,
          selected: a.selected,
          isCorrect: a.isCorrect,
          meta: `${q.chapter_title} · prochaine révision ${describeDelay(days)}`,
        };
      });
    const correct = items.filter((i) => i.isCorrect).length;
    return (
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6">
        <div className="card border-brand-line p-6 sm:p-8">
          <p className="label-mono text-brand">Séance terminée</p>
          <h1 className="mt-2 flex items-center gap-3 text-2xl font-bold tracking-tight text-fg sm:text-3xl">
            <Trophy className="size-7 text-accent" aria-hidden /> {correct} / {items.length} bonnes réponses
          </h1>
          <p className="mt-3 leading-relaxed text-fg-muted">
            Les questions réussies reviendront plus tard ; celles manquées reviendront demain. Lisez les explications ci-dessous : c&apos;est là que se
            fait l&apos;essentiel de l&apos;apprentissage.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            {dueTotal > 0 ? (
              <Link href={`/revisions${query}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-brand-fg hover:bg-brand-strong">
                Continuer ({dueTotal} question{dueTotal > 1 ? "s" : ""} à revoir) <ArrowRight className="size-4" aria-hidden />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-xl bg-success-soft px-5 py-3 text-sm font-semibold text-success">
                <CheckCircle2 className="size-4" aria-hidden /> Révisions du jour terminées
              </span>
            )}
            <Link href="/tableau-de-bord" className="inline-flex items-center justify-center rounded-xl border border-border bg-bg-elevated px-5 py-3 text-sm font-semibold text-fg hover:bg-bg-muted">
              Tableau de bord
            </Link>
          </div>
        </div>
        <section>
          <h2 className="text-xl font-bold tracking-tight text-fg">Correction</h2>
          <CorrectionList items={items} reveal />
        </section>
      </div>
    );
  }

  const due = await getDueQuestions(user.id, REVIEW_BATCH, filter);

  // Rien à revoir aujourd'hui
  if (due.length === 0) {
    return (
      <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-10 sm:px-6">
        {intro}
        <div className="card flex items-start gap-4 border-success-line bg-success-soft p-6">
          <CheckCircle2 className="size-7 shrink-0 text-success" aria-hidden />
          <div>
            <p className="font-semibold text-fg">Rien à réviser pour l&apos;instant</p>
            <p className="mt-1 text-sm leading-relaxed text-fg-muted">Revenez à la date indiquée ci-dessous, ou poursuivez votre parcours.</p>
          </div>
        </div>
        {overview}
      </div>
    );
  }

  // Séance de révision
  const day = new Date().toISOString().slice(0, 10);
  const view = due.map((q) => ({
    id: q.id,
    prompt: q.prompt,
    code: q.code,
    multiple: q.multiple,
    options: /^(vrai|faux)$/i.test(q.options[0])
      ? q.options.map((label, index) => ({ index, label }))
      : seededShuffle(q.options.map((label, index) => ({ index, label })), `${user.id}-revision-${q.id}-${day}`),
  }));
  const intervals = Object.values(REVIEW_INTERVALS_DAYS).map((d) => `J+${d}`).join(", ");

  return (
    <div className="mx-auto max-w-[1440px] space-y-8 px-4 py-10 sm:px-6 lg:px-12">
      {intro}
      {overview}
      <section>
        <h2 className="mb-4 text-xl font-bold tracking-tight text-fg">
          Séance du jour · {due.length} question{due.length > 1 ? "s" : ""}
          {dueTotal > due.length && <span className="font-normal text-fg-muted"> (sur {dueTotal} à revoir)</span>}
        </h2>
        <QuizForm
          questions={view}
          action={submitReviewAction}
          hidden={{ parcours: filter ?? "", questionIds: due.map((q) => q.id).join(",") }}
          required={0}
          submitLabel="Valider la séance"
          note={
            <>
              Pas de note ni de seuil : chaque réponse juste espace la prochaine révision ({intervals}), chaque erreur la ramène au lendemain. La
              correction détaillée s&apos;affiche après l&apos;envoi.
            </>
          }
        />
      </section>
    </div>
  );
}
