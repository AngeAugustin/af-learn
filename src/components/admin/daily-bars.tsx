"use client";

import { useState } from "react";

export type DailyBar = { day: string; value: number; extra?: string };

const dayFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" });
const longFmt = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "long", timeZone: "UTC" });
const asDate = (day: string) => new Date(`${day}T00:00:00Z`);

/** « Joli » maximum d'axe : 1, 2, 5 × 10^n au-dessus de la valeur. */
function niceMax(v: number): number {
  if (v <= 4) return Math.max(1, Math.ceil(v));
  const pow = 10 ** Math.floor(Math.log10(v));
  for (const m of [1, 2, 2.5, 5, 10]) if (m * pow >= v) return m * pow;
  return 10 * pow;
}

/** Histogramme quotidien à une série, avec info-bulle au survol et tableau équivalent pour les lecteurs d'écran. */
export function DailyBars({ data, unit, label }: { data: DailyBar[]; unit: string; label: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = niceMax(Math.max(0, ...data.map((d) => d.value)));
  const total = data.reduce((n, d) => n + d.value, 0);
  const active = hover !== null ? data[hover] : null;
  const ticks = [0, Math.floor((data.length - 1) / 2), data.length - 1].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <figure>
      <div className="relative h-44 pl-8">
        {/* Grille discrète : base, moitié, maximum */}
        {[1, 0.5, 0].map((f) => (
          <div key={f} className="absolute inset-x-8 right-0 border-t border-border/70" style={{ top: `${(1 - f) * 100}%` }}>
            {Number.isInteger(max * f) && (
              <span className="absolute -left-8 -top-2 w-6 text-right font-mono text-[10px] tabular-nums text-fg-subtle">
                {max * f}
              </span>
            )}
          </div>
        ))}
        <div className="absolute inset-y-0 left-8 right-0 flex items-end gap-[2px]" onMouseLeave={() => setHover(null)}>
          {data.map((d, i) => (
            <div
              key={d.day}
              className="group relative flex h-full flex-1 items-end"
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              tabIndex={0}
              aria-label={`${longFmt.format(asDate(d.day))} : ${d.value} ${unit}`}
            >
              <div
                className={`w-full rounded-t-[4px] transition-colors ${hover === i ? "bg-brand-strong" : "bg-brand"}`}
                style={{ height: d.value ? `${Math.max(2, (100 * d.value) / max)}%` : "0" }}
              />
            </div>
          ))}
        </div>
        {active && hover !== null && (
          <div
            className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-border bg-bg-elevated px-2.5 py-1.5 text-xs shadow-md"
            style={{ left: `calc(2rem + (100% - 2rem) * ${(hover + 0.5) / data.length})` }}
          >
            <p className="text-fg-muted">{longFmt.format(asDate(active.day))}</p>
            <p className="font-mono font-semibold tabular-nums text-fg">
              {active.value} {unit}
            </p>
            {active.extra && <p className="text-fg-muted">{active.extra}</p>}
          </div>
        )}
      </div>
      <div className="relative mt-1.5 h-4 pl-8 font-mono text-[10px] text-fg-subtle">
        {ticks.map((i) => (
          <span
            key={i}
            className="absolute -translate-x-1/2 whitespace-nowrap"
            style={{ left: `calc(2rem + (100% - 2rem) * ${(i + 0.5) / data.length})` }}
          >
            {dayFmt.format(asDate(data[i].day))}
          </span>
        ))}
      </div>
      <figcaption className="sr-only">
        {label}, total {total} {unit}.
      </figcaption>
      <table className="sr-only">
        <caption>{label}</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.day}>
              <th scope="row">{d.day}</th>
              <td>{d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
