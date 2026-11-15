"use client";

import { useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronDown, ListChecks, Loader2, Send } from "lucide-react";
import { InlineText } from "@/components/content/inline-text";

export type QuizQuestionView = {
  id: number;
  prompt: string;
  code: string | null;
  multiple: boolean;
  options: { index: number; label: string }[];
};

const LETTERS = "ABCDEF";

function SubmitButton({ ready, remaining, label }: { ready: boolean; remaining: number; label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={!ready || pending}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-brand-fg shadow-hover transition hover:bg-brand-strong active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
      {ready ? label : `Encore ${remaining} question${remaining > 1 ? "s" : ""} sans réponse`}
    </button>
  );
}

/**
 * Évaluation présentée question par question. Toutes les réponses restent dans le formulaire
 * et sont corrigées uniquement côté serveur, après l'envoi.
 */
export function QuizForm({
  questions,
  action,
  hidden,
  required,
  sidebarExtra,
  note,
  submitLabel = "Soumettre l'évaluation",
}: {
  questions: QuizQuestionView[];
  action: (form: FormData) => Promise<void>;
  hidden: Record<string, string>;
  required: number;
  sidebarExtra?: ReactNode;
  /** Remplace le rappel du seuil de validation dans le panneau latéral. */
  note?: ReactNode;
  submitLabel?: string;
}) {
  const [answered, setAnswered] = useState<Record<number, number[]>>({});
  const [current, setCurrent] = useState(0);
  const count = questions.filter((q) => (answered[q.id]?.length ?? 0) > 0).length;
  const remaining = questions.length - count;
  const total = questions.length;
  const progress = Math.round((count / total) * 100);

  function toggle(q: QuizQuestionView, index: number, checked: boolean) {
    setAnswered((prev) => {
      const values = prev[q.id] ?? [];
      const next = q.multiple ? (checked ? [...values, index] : values.filter((i) => i !== index)) : [index];
      return { ...prev, [q.id]: next };
    });
  }

  const go = (i: number) => {
    setCurrent(Math.max(0, Math.min(total - 1, i)));
    if (typeof window !== "undefined") document.getElementById("question-courante")?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  return (
    <form action={action}>
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

      {/* Frise des questions */}
      <section className="card mb-6 p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="label-mono min-w-0 text-fg-muted">
            <span className="hidden sm:inline">Progression (</span>question {current + 1} sur {total}
            <span className="hidden sm:inline">)</span>
          </p>
          <span className="label-mono shrink-0 whitespace-nowrap rounded-md bg-brand-soft px-2 py-1 normal-case text-brand">{progress} % répondu</span>
        </div>
        <ol className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {questions.map((q, i) => {
            const isCurrent = i === current;
            const isAnswered = (answered[q.id]?.length ?? 0) > 0;
            return (
              <li key={q.id}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`Question ${i + 1}${isAnswered ? " (répondue)" : ""}`}
                  className={`flex w-full flex-col items-center gap-1.5 rounded-xl px-1 py-2.5 transition ${
                    isCurrent ? "bg-brand text-brand-fg shadow-hover" : "bg-bg-muted hover:bg-bg-sunken"
                  }`}
                >
                  <span
                    className={`flex size-6 items-center justify-center rounded-full text-[10px] font-bold ${
                      isCurrent ? "bg-white text-brand" : isAnswered ? "bg-brand text-brand-fg" : "bg-border text-fg-muted"
                    }`}
                  >
                    {isAnswered && !isCurrent ? <Check className="size-3.5" aria-hidden /> : i + 1}
                  </span>
                  <span className={`font-mono text-[10px] ${isCurrent ? "text-brand-fg" : "text-fg-muted"}`}>
                    {isCurrent ? "Actuelle" : `Q${i + 1}`}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0 space-y-6">
          {questions.map((q, i) => (
            <fieldset
              key={q.id}
              id={i === current ? "question-courante" : undefined}
              className={`card scroll-mt-24 p-5 sm:p-8 ${i === current ? "" : "hidden"}`}
            >
              <legend className="sr-only">Question {i + 1}</legend>
              <div className="flex flex-wrap items-center gap-2">
                <span className="label-mono rounded-md bg-brand-soft px-2.5 py-1 normal-case text-brand">
                  Question {i + 1} sur {total}
                </span>
                <span className="label-mono rounded-md bg-bg-muted px-2.5 py-1 normal-case text-fg-muted">
                  {q.multiple ? "Choix multiple · plusieurs réponses possibles" : "Choix unique"}
                </span>
              </div>
              <p className="mt-5 text-xl font-bold leading-snug tracking-tight text-fg sm:text-2xl">
                <InlineText text={q.prompt} />
              </p>
              {q.code && (
                <pre className="mt-4 overflow-x-auto rounded-xl bg-[var(--code-bg)] p-4 font-mono text-sm text-[var(--code-fg)]">{q.code}</pre>
              )}
              <div className="mt-6 space-y-3">
                {q.options.map((o, oi) => {
                  const checked = answered[q.id]?.includes(o.index) ?? false;
                  return (
                    <label
                      key={o.index}
                      className={`flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition ${
                        checked ? "border-brand-line bg-brand-soft" : "border-transparent bg-bg-muted hover:border-border-strong"
                      }`}
                    >
                      <input
                        type={q.multiple ? "checkbox" : "radio"}
                        name={`q-${q.id}`}
                        value={o.index}
                        checked={checked}
                        onChange={(e) => toggle(q, o.index, e.target.checked)}
                        className="peer sr-only"
                      />
                      <span
                        className={`mt-0.5 flex size-6 shrink-0 items-center justify-center border-2 transition peer-focus-visible:ring-4 peer-focus-visible:ring-[var(--ring)] ${
                          q.multiple ? "rounded-md" : "rounded-full"
                        } ${checked ? "border-brand bg-brand text-brand-fg" : "border-border-strong bg-bg-elevated"}`}
                        aria-hidden
                      >
                        {checked && <Check className="size-4" />}
                      </span>
                      <span className="min-w-0">
                        <span className="label-mono block text-brand">Option {LETTERS[oi]}</span>
                        <span className="mt-0.5 block text-[15px] leading-relaxed text-fg">
                          <InlineText text={o.label} />
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={() => go(i - 1)}
                  disabled={i === 0}
                  className="flex items-center justify-center gap-2 rounded-xl bg-bg-muted px-4 py-2.5 text-sm font-semibold text-fg transition hover:bg-bg-sunken disabled:invisible"
                >
                  <ArrowLeft className="size-4" aria-hidden /> Question précédente (Q{i})
                </button>
                {i < total - 1 ? (
                  <button
                    type="button"
                    onClick={() => go(i + 1)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-fg transition hover:bg-brand-strong"
                  >
                    Question suivante (Q{i + 2}) <ArrowRight className="size-4" aria-hidden />
                  </button>
                ) : (
                  <span className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong px-4 py-2.5 text-sm text-fg-muted">
                    Dernière question : soumettez depuis le panneau « Fin de l&apos;évaluation »
                  </span>
                )}
              </div>
            </fieldset>
          ))}

          {count > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-fg">
                <ListChecks className="size-5 text-brand" aria-hidden /> Aperçu de vos réponses
                <span className="ml-auto font-mono text-[11px] font-normal text-fg-subtle">
                  {count} réponse{count > 1 ? "s" : ""} enregistrée{count > 1 ? "s" : ""}
                </span>
              </h2>
              <div className="space-y-2.5">
                {questions.map((q, i) => {
                  const values = answered[q.id] ?? [];
                  if (values.length === 0) return null;
                  return (
                    <details key={q.id} className="group card">
                      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                        <CheckCircle2 className="size-5 shrink-0 text-brand" aria-hidden />
                        <span className="min-w-0 flex-1">
                          <span className="label-mono block text-brand">Question {i + 1}</span>
                          <span className="block truncate text-sm font-semibold text-fg">
                            <InlineText text={q.prompt} />
                          </span>
                        </span>
                        <ChevronDown className="size-4 shrink-0 text-fg-muted transition group-open:rotate-180" aria-hidden />
                      </summary>
                      <div className="border-t border-border px-4 py-3 text-sm text-fg-muted">
                        <p className="label-mono mb-1.5 text-fg-subtle">Votre réponse</p>
                        <ul className="space-y-1">
                          {q.options
                            .filter((o) => values.includes(o.index))
                            .map((o) => (
                              <li key={o.index}>
                                • <InlineText text={o.label} />
                              </li>
                            ))}
                        </ul>
                        <button type="button" onClick={() => go(i)} className="mt-2 text-xs font-semibold text-brand hover:underline">
                          Modifier cette réponse
                        </button>
                      </div>
                    </details>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="card p-5">
            <p className="font-semibold text-fg">Votre avancement</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight text-fg">{count}</span>
              <span className="text-lg font-semibold text-fg-muted">/{total}</span>
              <span className="ml-2 label-mono normal-case text-fg-subtle">questions répondues</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-border">
              <div className="progress-fill h-full rounded-full transition-[width]" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-4 rounded-xl bg-bg-muted p-3 text-xs leading-relaxed text-fg-muted">
              {note ?? (<>Il faut au moins <strong className="text-fg">{required} bonnes réponses sur {total}</strong> pour valider le chapitre. La
              correction est effectuée après l&apos;envoi : aucune réponse n&apos;est évaluée avant.</>)}
            </p>
          </div>
          {sidebarExtra}
          <div className="rounded-2xl border border-brand-line bg-brand-soft p-5">
            <p className="font-semibold text-fg">Fin de l&apos;évaluation</p>
            <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">
              {remaining === 0
                ? "Toutes les questions ont une réponse. Vous pouvez soumettre l'évaluation."
                : `Répondez aux ${total} questions pour pouvoir soumettre (${remaining} restante${remaining > 1 ? "s" : ""}).`}
            </p>
            <div className="mt-4">
              <SubmitButton ready={remaining === 0} remaining={remaining} label={submitLabel} />
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}
