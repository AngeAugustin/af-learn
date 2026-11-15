import type { ReactNode } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function PageTitle({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-fg">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-fg-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Kpi({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <div className="card p-4">
      <p className="label-mono text-fg-subtle">{label}</p>
      <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-fg">{value}</p>
      {hint && <p className="mt-1 text-xs text-fg-muted">{hint}</p>}
    </div>
  );
}

export function Panel({ title, description, children, actions }: { title: string; description?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="card p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-fg">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-fg-muted">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "success" | "danger" | "brand" | "warning"; children: ReactNode }) {
  const colors = {
    neutral: "border-border bg-bg-muted text-fg-muted",
    success: "border-success-line bg-success-soft text-success",
    danger: "border-danger/30 bg-danger-soft text-danger",
    brand: "border-brand/30 bg-brand/10 text-brand",
    warning: "border-border bg-bg-muted text-fg",
  }[tone];
  return <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-[11px] font-semibold ${colors}`}>{children}</span>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-fg-muted">{children}</p>;
}

/** Bandeau de retour d'action (?notice=...). */
export function Notice({ code, messages }: { code?: string; messages: Record<string, [ok: boolean, text: string]> }) {
  const entry = code ? messages[code] : undefined;
  if (!entry) return null;
  const [ok, text] = entry;
  const Icon = ok ? CheckCircle2 : AlertCircle;
  return (
    <p
      role={ok ? "status" : "alert"}
      className={`mb-5 flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm ${ok ? "bg-success-soft text-success" : "bg-danger-soft text-danger"}`}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      {text}
    </p>
  );
}

/** Barre horizontale proportionnelle, pour les classements (pages, référents, appareils). */
export function RankList({ rows, unit, empty }: { rows: { label: ReactNode; value: number; href?: string }[]; unit: string; empty: string }) {
  if (!rows.length) return <EmptyState>{empty}</EmptyState>;
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="space-y-2.5">
      {rows.map((r, i) => (
        <li key={i} className="text-sm" title={`${r.value} ${unit}`}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="min-w-0 truncate text-fg">{r.href ? <Link href={r.href} className="hover:text-brand">{r.label}</Link> : r.label}</span>
            <span className="shrink-0 font-mono text-xs tabular-nums text-fg-muted">{r.value}</span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-bg-muted">
            <div className="h-1.5 rounded-full bg-brand" style={{ width: `${Math.max(2, (100 * r.value) / max)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function TableWrap({ children }: { children: ReactNode }) {
  return <div className="-mx-5 overflow-x-auto px-5">{children}</div>;
}

export const th = "whitespace-nowrap border-b border-border px-3 py-2 text-left font-mono text-[11px] font-semibold uppercase tracking-wide text-fg-subtle";
export const td = "border-b border-border/60 px-3 py-2.5 align-top";
