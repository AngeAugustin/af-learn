import { CheckCircle2, CircleDashed, Lock, PlayCircle } from "lucide-react";
import type { ChapterState } from "@/lib/progress";

export function ChapterStatusIcon({ state, className = "size-5" }: { state: ChapterState; className?: string }) {
  switch (state) {
    case "passed":
      return <CheckCircle2 className={`${className} text-success`} aria-label="Validé" />;
    case "in_progress":
      return <PlayCircle className={`${className} text-brand`} aria-label="En cours" />;
    case "available":
      return <CircleDashed className={`${className} text-fg-subtle`} aria-label="À commencer" />;
    case "locked":
      return <Lock className={`${className} text-fg-subtle`} aria-label="Verrouillé" />;
  }
}

const STYLES: Record<ChapterState, string> = {
  passed: "border-success-line bg-success-soft text-success",
  in_progress: "border-brand-line bg-brand-soft text-brand",
  available: "border-border bg-bg-muted text-fg-muted",
  locked: "border-dashed border-border-strong bg-bg text-fg-subtle",
};

/** Badge de statut monospace : [✓ Validé · 90 %], [● En cours], [○ À commencer], [Verrouillé]. */
export function ChapterStatusBadge({ state, bestScore }: { state: ChapterState; bestScore: number | null }) {
  const labels: Record<ChapterState, string> = {
    passed: `✓ Validé${bestScore !== null ? ` · ${bestScore} %` : ""}`,
    in_progress: "● En cours",
    available: "○ À commencer",
    locked: "Verrouillé",
  };
  return (
    <span className={`label-mono inline-flex shrink-0 items-center gap-1 rounded-md border px-2.5 py-1 normal-case ${STYLES[state]}`}>
      {state === "locked" && <Lock className="size-3" aria-hidden />}
      {labels[state]}
    </span>
  );
}
