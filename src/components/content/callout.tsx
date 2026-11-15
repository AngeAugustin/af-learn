import type { ReactNode } from "react";
import { Info, Lightbulb, OctagonAlert, ShieldAlert, TriangleAlert } from "lucide-react";

// Correspondance de la palette : Conseil = rubis, À noter = bleu, Important = safran, Attention = rouge
const STYLES: Record<string, { label: string; icon: typeof Info; color: string }> = {
  tip: { label: "Conseil", icon: Lightbulb, color: "var(--brand)" },
  note: { label: "À noter", icon: Info, color: "var(--secondary)" },
  important: { label: "Important", icon: TriangleAlert, color: "var(--accent)" },
  warning: { label: "Attention", icon: ShieldAlert, color: "var(--danger)" },
  caution: { label: "Prudence", icon: OctagonAlert, color: "var(--danger)" },
};

export function Callout({ type, children }: { type: string; children: ReactNode }) {
  const style = STYLES[type] ?? STYLES.note;
  const Icon = style.icon;
  return (
    <aside
      className="not-prose my-6 flex items-start gap-3.5 rounded-2xl border-l-4 p-4 sm:p-5"
      style={{
        borderLeftColor: style.color,
        background: `color-mix(in oklab, ${style.color} 7%, var(--bg-elevated))`,
      }}
      role="note"
    >
      <Icon className="mt-0.5 size-5 shrink-0" style={{ color: style.color }} aria-hidden />
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-bold text-fg">{style.label}</p>
        <div className="text-[0.925rem] leading-relaxed text-fg-muted [&_a]:text-brand [&_a]:underline [&_code]:rounded [&_code]:bg-bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-fg [&_li]:my-0.5 [&_p]:my-1 [&_strong]:font-semibold [&_strong]:text-fg [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </aside>
  );
}
