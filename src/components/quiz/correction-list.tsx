import type { ReactNode } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { InlineText } from "@/components/content/inline-text";

const LETTERS = "ABCDEF";

export type CorrectionItem = {
  id: number;
  prompt: string;
  code: string | null;
  options: string[];
  correct: number[];
  selected: number[];
  isCorrect: boolean;
  explanation: string;
  /** Petite mention sous le numéro de question (chapitre d'origine, prochaine révision…). */
  meta?: ReactNode;
};

/**
 * Correction question par question. Les bonnes réponses et les explications ne s'affichent
 * que si `reveal` est vrai (examen réussi, séance de révision). `verdict` masque aussi
 * le juste/faux de chaque question tant que l'épreuve n'est pas réussie.
 */
export function CorrectionList({ items, reveal, verdict = true }: { items: CorrectionItem[]; reveal: boolean; verdict?: boolean }) {
  return (
    <ol className="mt-5 space-y-4">
      {items.map((q, i) => (
        <li key={q.id} className="card p-5 sm:p-6">
          <div className="flex items-start gap-3">
            {verdict &&
              (q.isCorrect ? (
                <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-success" aria-label="Bonne réponse" />
              ) : (
                <XCircle className="mt-0.5 size-6 shrink-0 text-danger" aria-label="Réponse incorrecte" />
              ))}
            <div className="min-w-0 flex-1">
              <p className={`label-mono ${verdict ? (q.isCorrect ? "text-success" : "text-danger") : "text-fg-subtle"}`}>
                Question {i + 1}
                {verdict ? ` · ${q.isCorrect ? "Correcte" : "Incorrecte"}` : ""}
              </p>
              {q.meta && <p className="mt-0.5 font-mono text-[11px] text-fg-subtle">{q.meta}</p>}
              <p className="mt-1 font-semibold leading-snug text-fg">
                <InlineText text={q.prompt} />
              </p>
              {q.code && (
                <pre className="mt-3 overflow-x-auto rounded-xl bg-[var(--code-bg)] p-4 font-mono text-sm text-[var(--code-fg)]">{q.code}</pre>
              )}
              <ul className="mt-3 space-y-2">
                {q.options.map((label, idx) => {
                  const selected = q.selected.includes(idx);
                  const correct = reveal && q.correct.includes(idx);
                  let style = "border-transparent bg-bg-muted text-fg-muted";
                  if (correct) style = "border-success-line bg-success-soft text-fg";
                  else if (selected && verdict && !reveal)
                    style = q.isCorrect ? "border-success-line bg-success-soft text-fg" : "border-danger/40 bg-danger-soft text-fg";
                  else if (selected && reveal && !q.correct.includes(idx))
                    style = "border-danger/40 bg-danger-soft text-fg";
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
              {reveal && (
                <p className="mt-3 rounded-xl border-l-4 border-brand bg-brand-soft px-4 py-3 text-sm leading-relaxed text-fg-muted">
                  <span className="font-semibold text-fg">Explication : </span>
                  <InlineText text={q.explanation} />
                </p>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
