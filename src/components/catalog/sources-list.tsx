"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, Code2, ExternalLink, FileText, GraduationCap } from "lucide-react";
import { SOURCE_TYPES, SOURCE_TYPE_LABELS, type Source, type SourceType } from "@/lib/content/references";

const ICONS: Record<SourceType, { icon: typeof BookOpen; tone: string }> = {
  livre: { icon: BookOpen, tone: "violet" },
  documentation: { icon: Code2, tone: "teal" },
  article: { icon: FileText, tone: "blue" },
  cours: { icon: GraduationCap, tone: "amber" },
};

const VISIBLE = 6;

/** Sources et références d'un parcours, filtrables par type. */
export function SourcesList({ sources }: { sources: Source[] }) {
  const [filter, setFilter] = useState<SourceType | "all">("all");
  const [expanded, setExpanded] = useState(false);

  const types = SOURCE_TYPES.filter((t) => sources.some((s) => s.type === t));
  const filtered = filter === "all" ? sources : sources.filter((s) => s.type === filter);
  const shown = expanded ? filtered : filtered.slice(0, VISIBLE);
  const hidden = filtered.length - shown.length;

  const pill = (active: boolean) =>
    `rounded-full border px-3 py-1 text-xs font-semibold transition ${
      active ? "border-fg bg-fg text-bg" : "border-border text-fg-muted hover:border-border-strong hover:text-fg"
    }`;

  return (
    <section className="card p-5 sm:p-6" aria-labelledby="sources-title">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="sources-title" className="text-xl font-bold tracking-[-0.02em] text-fg">
          Sources et références
        </h2>
        <span className="text-xs text-fg-subtle">
          {sources.length} sources · liens vérifiés
        </span>
      </div>
      <p className="mt-1 text-sm leading-relaxed text-fg-muted">
        Les ouvrages, documentations et articles sur lesquels s&apos;appuie ce parcours, pour vérifier ou approfondir.
      </p>

      {types.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label="Filtrer les sources">
          <button type="button" className={pill(filter === "all")} aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
            Tout
          </button>
          {types.map((t) => (
            <button key={t} type="button" className={pill(filter === t)} aria-pressed={filter === t} onClick={() => setFilter(t)}>
              {SOURCE_TYPE_LABELS[t].many} <span className="opacity-70">{sources.filter((s) => s.type === t).length}</span>
            </button>
          ))}
        </div>
      )}

      <ul className="mt-3 divide-y divide-border">
        {shown.map((s) => {
          const { icon: Icon, tone } = ICONS[s.type];
          return (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 py-3">
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: `var(--tone-${tone}-soft)`, color: `var(--tone-${tone})` }}
                >
                  <Icon className="size-[18px]" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold leading-snug text-fg transition-colors group-hover:text-brand">{s.title}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-fg-muted">
                    {[s.author, s.year, SOURCE_TYPE_LABELS[s.type].one].filter(Boolean).join(" · ")}
                    {s.used_in && <span className="text-fg-subtle"> · {s.used_in}</span>}
                  </span>
                </span>
                <ExternalLink className="mt-1 size-4 shrink-0 text-fg-subtle transition group-hover:text-brand" aria-label="Ouvre un nouvel onglet" />
              </a>
            </li>
          );
        })}
      </ul>

      {(hidden > 0 || (expanded && filtered.length > VISIBLE)) && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
          aria-expanded={expanded}
        >
          {expanded ? "Réduire" : `Voir les ${hidden} autres`}
          <ChevronDown className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden />
        </button>
      )}
    </section>
  );
}
