"use client";

import { useState, useTransition } from "react";
import { Check, CheckCircle2, ChevronDown, Lightbulb, Loader2, XCircle } from "lucide-react";
import { InlineText } from "@/components/content/inline-text";
import { checkPretestAction, type PretestCorrection } from "@/app/actions/pretest";
import type { QuizQuestionView } from "@/components/quiz/quiz-form";

const LETTERS = "ABCDEF";

/**
 * « Testez-vous avant de lire » : quelques questions de l'évaluation posées avant la lecture.
 * Se tromper avant d'apprendre oriente l'attention et améliore la mémorisation (effet de pré-test).
 * Rien n'est noté ni enregistré.
 */
export function Pretest({ chapterId, questions }: { chapterId: number; questions: QuizQuestionView[] }) {
  const [open, setOpen] = useState(true);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [results, setResults] = useState<Map<number, PretestCorrection> | null>(null);
  const [pending, startTransition] = useTransition();

  if (questions.length === 0) return null;

  const toggle = (q: QuizQuestionView, index: number) => {
    if (results) return;
    setAnswers((prev) => {
      const current = prev[q.id] ?? [];
      const next = q.multiple
        ? current.includes(index)
          ? current.filter((i) => i !== index)
          : [...current, index]
        : [index];
      return { ...prev, [q.id]: next };
    });
  };

  const check = () =>
    startTransition(async () => {
      const corrections = await checkPretestAction(chapterId, answers);
      if (corrections.length === 0) return;
      setResults(new Map(corrections.map((c) => [c.id, c])));
    });

  const score = results ? [...results.values()].filter((r) => r.isCorrect).length : 0;

  return (
    <section className="card mb-8 overflow-hidden" aria-labelledby="pretest-titre">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-start gap-3 p-5 text-left sm:p-7"
      >
        <Lightbulb className="mt-0.5 size-6 shrink-0 text-accent" aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="label-mono block text-accent">Avant de commencer · non noté</span>
          <span id="pretest-titre" className="mt-1 block text-xl font-bold text-fg">
            Testez-vous avant de lire
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-fg-muted">
            {results
              ? `${score}/${questions.length} dès le départ. Les bonnes réponses et les explications s'afficheront après la validation du chapitre.`
              : `${questions.length} questions de l'évaluation, avant d'avoir lu le chapitre. Répondez au mieux, même au hasard : chercher une réponse avant d'apprendre aide à mieux retenir. Rien n'est enregistré, et seule la justesse de votre réponse est indiquée.`}
          </span>
        </span>
        <ChevronDown className={`mt-1 size-5 shrink-0 text-fg-subtle transition ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      {open && (
        <div className="border-t border-border px-5 pb-6 pt-5 sm:px-7">
          <ol className="space-y-6">
            {questions.map((q, qi) => {
              const r = results?.get(q.id);
              const chosen = answers[q.id] ?? [];
              return (
                <li key={q.id}>
                  <p className="label-mono flex items-center gap-1.5 text-fg-subtle">
                    {r &&
                      (r.isCorrect ? (
                        <CheckCircle2 className="size-4 text-success" aria-label="Bonne réponse" />
                      ) : (
                        <XCircle className="size-4 text-danger" aria-label="Réponse incorrecte" />
                      ))}
                    Question {qi + 1} · {q.multiple ? "plusieurs réponses possibles" : "une seule réponse"}
                  </p>
                  <p className="mt-1.5 font-semibold leading-snug text-fg">
                    <InlineText text={q.prompt} />
                  </p>
                  {q.code && (
                    <pre className="mt-3 overflow-x-auto rounded-xl bg-[var(--code-bg)] p-4 font-mono text-sm text-[var(--code-fg)]">{q.code}</pre>
                  )}
                  <ul className="mt-3 space-y-2">
                    {q.options.map((o, oi) => {
                      const selected = chosen.includes(o.index);
                      let style = selected ? "border-brand-line bg-brand-soft" : "border-transparent bg-bg-muted hover:border-border-strong";
                      if (r && selected) style = r.isCorrect ? "border-success-line bg-success-soft" : "border-danger/40 bg-danger-soft";
                      else if (r) style = "border-transparent bg-bg-muted";
                      return (
                        <li key={o.index}>
                          <button
                            type="button"
                            role={q.multiple ? "checkbox" : "radio"}
                            aria-checked={selected}
                            disabled={!!r || pending}
                            onClick={() => toggle(q, o.index)}
                            className={`flex w-full items-start gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm text-fg transition disabled:cursor-default ${style}`}
                          >
                            <span
                              className={`mt-0.5 flex size-5 shrink-0 items-center justify-center border-2 ${
                                q.multiple ? "rounded" : "rounded-full"
                              } ${selected ? "border-brand bg-brand text-brand-fg" : "border-border-strong bg-bg-elevated"}`}
                              aria-hidden
                            >
                              {selected && <Check className="size-3.5" />}
                            </span>
                            <span className="label-mono mt-0.5 w-4 shrink-0 text-fg-subtle">{LETTERS[oi]}</span>
                            <span className="min-w-0 flex-1 leading-snug">
                              <InlineText text={o.label} />
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            {results ? (
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-fg transition hover:bg-brand-strong"
              >
                Commencer la lecture
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={check}
                  disabled={pending}
                  className="flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-fg transition hover:bg-brand-strong disabled:opacity-60"
                >
                  {pending && <Loader2 className="size-4 animate-spin" aria-hidden />} Vérifier mes réponses
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-fg-muted hover:text-fg"
                >
                  Passer et commencer la lecture
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
