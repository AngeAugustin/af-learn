import type { ReactNode } from "react";
import type { Tone } from "@/lib/diagrams/spec";

export function toneVars(tone: Tone | undefined, fallback: Tone = "violet") {
  const t = tone ?? fallback;
  return { color: `var(--tone-${t})`, soft: `var(--tone-${t}-soft)` };
}

export const TONE_CYCLE: Tone[] = ["violet", "blue", "teal", "amber", "rose"];

export function Figure({
  title,
  caption,
  children,
  label,
}: {
  title?: string;
  caption?: string;
  children: ReactNode;
  label?: string;
}) {
  return (
    <figure
      className="not-prose @container my-8 rounded-2xl border border-border bg-bg-elevated p-4 shadow-card sm:p-6"
      aria-label={title ?? label}
    >
      {title && (
        <div className="mb-5 flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-brand" aria-hidden />
          <h4 className="text-sm font-semibold tracking-tight text-fg sm:text-base">{title}</h4>
        </div>
      )}
      {children}
      {caption && <figcaption className="mt-4 text-sm leading-relaxed text-fg-muted">{caption}</figcaption>}
    </figure>
  );
}
