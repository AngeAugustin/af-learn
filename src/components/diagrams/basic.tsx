import { ArrowDown, ArrowRight, Check, CornerDownLeft, RotateCcw, X } from "lucide-react";
import type { DiagramSpec } from "@/lib/diagrams/spec";
import { Figure, TONE_CYCLE, toneVars } from "./figure";

type Of<T extends DiagramSpec["type"]> = Extract<DiagramSpec, { type: T }>;
type Step = Of<"flow">["steps"][number];

function StepCard({ step, index, tone }: { step: Step; index: number; tone: ReturnType<typeof toneVars> }) {
  return (
    <div
      className="relative flex h-full flex-col rounded-xl border px-3.5 py-3"
      style={{ borderColor: `color-mix(in oklab, ${tone.color} 40%, transparent)`, background: tone.soft }}
    >
      <div className="mb-1 flex items-center gap-2">
        <span
          className="flex size-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold text-white"
          style={{ background: tone.color }}
        >
          {index + 1}
        </span>
        <span className="text-sm font-semibold leading-snug text-fg">{step.title}</span>
      </div>
      {step.text && <p className="text-[0.8rem] leading-snug text-fg-muted">{step.text}</p>}
    </div>
  );
}

function StepsRow({ steps }: { steps: Step[] }) {
  return (
    <ol className="flex flex-col items-stretch gap-1.5 @3xl:flex-row @3xl:items-stretch @3xl:gap-0">
      {steps.map((step, i) => (
        <li key={i} className="flex flex-col items-stretch @3xl:flex-1 @3xl:flex-row @3xl:items-center">
          <div className="@3xl:h-full @3xl:flex-1">
            <StepCard step={step} index={i} tone={toneVars(step.tone, TONE_CYCLE[i % TONE_CYCLE.length])} />
          </div>
          {i < steps.length - 1 && (
            <div className="flex items-center justify-center py-0.5 text-fg-subtle @3xl:px-1 @3xl:py-0" aria-hidden>
              <ArrowDown className="size-4 @3xl:hidden" />
              <ArrowRight className="hidden size-4 @3xl:block" />
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

export function FlowDiagram({ spec }: { spec: Of<"flow"> }) {
  return (
    <Figure title={spec.title}>
      <StepsRow steps={spec.steps} />
      {spec.loop && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-border-strong px-3 py-2 text-xs text-fg-muted">
          <RotateCcw className="size-3.5 shrink-0 text-brand" aria-hidden />
          <span>{spec.loop}</span>
        </div>
      )}
    </Figure>
  );
}

export function PipelineDiagram({ spec }: { spec: Of<"pipeline"> }) {
  return (
    <Figure title={spec.title}>
      <div className="space-y-5">
        {spec.lanes.map((lane, i) => (
          <div key={i}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">{lane.title}</div>
            <StepsRow steps={lane.steps} />
          </div>
        ))}
      </div>
    </Figure>
  );
}

export function CompareDiagram({ spec }: { spec: Of<"compare"> }) {
  const cols = spec.columns.length;
  const grid = cols === 2 ? "@xl:grid-cols-2" : cols === 3 ? "@xl:grid-cols-2 @3xl:grid-cols-3" : "@xl:grid-cols-2 @4xl:grid-cols-4";
  return (
    <Figure title={spec.title}>
      <div className={`grid grid-cols-1 gap-3 ${grid}`}>
        {spec.columns.map((col, i) => {
          const tone = toneVars(col.tone, TONE_CYCLE[i % TONE_CYCLE.length]);
          return (
            <div
              key={i}
              className="overflow-hidden rounded-xl border bg-bg-elevated"
              style={{ borderColor: `color-mix(in oklab, ${tone.color} 35%, transparent)` }}
            >
              <div className="px-4 py-2.5 text-sm font-semibold" style={{ background: tone.soft, color: tone.color }}>
                {col.title}
              </div>
              <ul className="space-y-2 px-4 py-3">
                {col.items.map((item, j) => (
                  <li key={j} className="flex gap-2 text-[0.82rem] leading-snug text-fg">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full" style={{ background: tone.color }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Figure>
  );
}

export function LayersDiagram({ spec }: { spec: Of<"layers"> }) {
  return (
    <Figure title={spec.title}>
      <div className="space-y-2">
        {spec.layers.map((layer, i) => {
          const tone = toneVars(undefined, TONE_CYCLE[i % TONE_CYCLE.length]);
          return (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-xl border px-4 py-3 @xl:flex-row @xl:items-center @xl:gap-4"
              style={{ borderColor: `color-mix(in oklab, ${tone.color} 35%, transparent)`, background: tone.soft }}
            >
              <div className="flex items-center gap-2.5 @xl:w-52 @xl:shrink-0">
                <span className="h-8 w-1.5 shrink-0 rounded-full" style={{ background: tone.color }} />
                <span className="text-sm font-semibold leading-snug text-fg">{layer.title}</span>
              </div>
              <div className="min-w-0 flex-1">
                {layer.text && <p className="text-[0.82rem] leading-snug text-fg-muted">{layer.text}</p>}
                {layer.items && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {layer.items.map((item, j) => (
                      <span
                        key={j}
                        className="rounded-md border border-border bg-bg-elevated px-2 py-0.5 text-[0.72rem] font-medium text-fg-muted"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Figure>
  );
}

export function StackDiagram({ spec }: { spec: Of<"stack"> }) {
  const total = spec.segments.reduce((n, s) => n + s.value, 0);
  return (
    <Figure title={spec.title}>
      <div className="flex h-10 w-full overflow-hidden rounded-lg border border-border" role="img" aria-label={spec.title}>
        {spec.segments.map((s, i) => {
          const tone = toneVars(s.tone, TONE_CYCLE[i % TONE_CYCLE.length]);
          const pct = (s.value / total) * 100;
          return (
            <div
              key={i}
              className="flex items-center justify-center text-[0.7rem] font-semibold text-white"
              style={{ width: `${pct}%`, background: tone.color }}
              title={`${s.label} : ${Math.round(pct)} %`}
            >
              {pct >= 9 ? `${Math.round(pct)} %` : ""}
            </div>
          );
        })}
      </div>
      <ul className="mt-4 grid grid-cols-1 gap-2 @lg:grid-cols-2">
        {spec.segments.map((s, i) => {
          const tone = toneVars(s.tone, TONE_CYCLE[i % TONE_CYCLE.length]);
          return (
            <li key={i} className="flex items-start gap-2 text-[0.82rem] leading-snug">
              <span className="mt-1 size-2.5 shrink-0 rounded-sm" style={{ background: tone.color }} />
              <span>
                <span className="font-semibold text-fg">{s.label}</span>
                <span className="text-fg-muted">
                  {" "}
                  · {Math.round((s.value / total) * 100)} %{s.text ? ` · ${s.text}` : ""}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </Figure>
  );
}

export function SequenceDiagram({ spec }: { spec: Of<"sequence"> }) {
  const n = spec.actors.length;
  const actorTone = (i: number) => toneVars(undefined, TONE_CYCLE[i % TONE_CYCLE.length]);
  return (
    <Figure title={spec.title}>
      {/* Version large : lignes de vie */}
      <div className="hidden @2xl:block">
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {spec.actors.map((actor, i) => (
            <div
              key={i}
              className="rounded-lg px-2 py-2 text-center text-xs font-semibold"
              style={{ background: actorTone(i).soft, color: actorTone(i).color }}
            >
              {actor}
            </div>
          ))}
        </div>
        <div className="relative mt-1">
          <div className="pointer-events-none absolute inset-0 grid gap-3" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
            {spec.actors.map((_, i) => (
              <div key={i} className="flex justify-center">
                <div className="w-px border-l border-dashed border-border-strong" />
              </div>
            ))}
          </div>
          <ol className="relative space-y-3 py-3">
            {spec.messages.map((m, i) => {
              const left = Math.min(m.from, m.to);
              const right = Math.max(m.from, m.to);
              const span = right - left + 1;
              // Marges pour que la flèche aille du centre de la colonne de départ au centre de l'arrivée
              const inset = `${(0.5 / span) * 100}%`;
              return (
                <li key={i} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
                  {m.from === m.to ? (
                    <div
                      className="rounded-lg border border-border bg-bg-elevated px-2.5 py-1.5 text-center text-[0.72rem] leading-snug text-fg-muted shadow-sm"
                      style={{ gridColumn: `${m.from + 1} / span 1` }}
                    >
                      {m.text}
                    </div>
                  ) : (
                    <div style={{ gridColumn: `${left + 1} / span ${span}` }}>
                      <div className="text-center text-[0.72rem] leading-snug text-fg" style={{ marginLeft: inset, marginRight: inset }}>
                        <span className="rounded bg-bg-elevated px-1.5">{m.text}</span>
                      </div>
                      <div className="relative mt-1 h-px bg-fg-muted" style={{ marginLeft: inset, marginRight: inset }}>
                        <span
                          className={`absolute -top-[3.5px] size-0 border-y-4 border-y-transparent ${
                            m.to > m.from ? "-right-px border-l-[7px] border-l-fg-muted" : "-left-px border-r-[7px] border-r-fg-muted"
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
      {/* Version mobile : liste numérotée */}
      <ol className="space-y-2 @2xl:hidden">
        {spec.messages.map((m, i) => (
          <li key={i} className="rounded-lg border border-border bg-bg px-3 py-2">
            <div className="mb-1 flex flex-wrap items-center gap-1.5 text-[0.7rem] font-semibold">
              <span className="text-fg-subtle">{i + 1}.</span>
              <span className="rounded px-1.5 py-0.5" style={{ background: actorTone(m.from).soft, color: actorTone(m.from).color }}>
                {spec.actors[m.from]}
              </span>
              {m.from !== m.to && (
                <>
                  <ArrowRight className="size-3 text-fg-subtle" aria-hidden />
                  <span className="rounded px-1.5 py-0.5" style={{ background: actorTone(m.to).soft, color: actorTone(m.to).color }}>
                    {spec.actors[m.to]}
                  </span>
                </>
              )}
            </div>
            <p className="text-[0.8rem] leading-snug text-fg">{m.text}</p>
          </li>
        ))}
      </ol>
    </Figure>
  );
}

export function DecisionDiagram({ spec }: { spec: Of<"decision"> }) {
  return (
    <Figure title={spec.title}>
      <ol className="space-y-3">
        {spec.nodes.map((node, i) => (
          <li key={i}>
            <div className="rounded-xl border border-brand/30 bg-brand-soft px-4 py-3">
              <div className="text-[0.7rem] font-semibold uppercase tracking-wider text-brand">Question {i + 1}</div>
              <p className="mt-0.5 text-sm font-medium leading-snug text-fg">{node.question}</p>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 pl-3 @lg:grid-cols-2 @lg:pl-6">
              <div className="flex gap-2 rounded-lg border border-success/30 bg-success-soft px-3 py-2">
                <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                <p className="text-[0.8rem] leading-snug text-fg">
                  <span className="font-semibold text-success">Oui : </span>
                  {node.yes}
                </p>
              </div>
              <div className="flex gap-2 rounded-lg border border-border bg-bg px-3 py-2">
                {i < spec.nodes.length - 1 ? (
                  <CornerDownLeft className="mt-0.5 size-4 shrink-0 rotate-90 text-fg-subtle" aria-hidden />
                ) : (
                  <X className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
                )}
                <p className="text-[0.8rem] leading-snug text-fg">
                  <span className="font-semibold text-fg-muted">Non : </span>
                  {node.no}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Figure>
  );
}
