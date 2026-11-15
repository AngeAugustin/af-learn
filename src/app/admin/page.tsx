import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { dailyActiveLearners, dailySignups, getFunnels, getOverviewKpis, parsePeriod, PERIODS } from "@/lib/admin/stats";
import { fmtNumber, fmtPct } from "@/lib/admin/format";
import { Kpi, PageTitle, Panel } from "@/components/admin/ui";
import { DailyBars } from "@/components/admin/daily-bars";

export const metadata: Metadata = { title: { absolute: "Vue d'ensemble · Back office" } };
export const dynamic = "force-dynamic";

const STEPS = [
  { key: "started", label: "1re section lue" },
  { key: "first_validated", label: "1er chapitre validé" },
  { key: "halfway", label: "Moitié du parcours" },
  { key: "final_attempted", label: "Examen final tenté" },
  { key: "certified", label: "Attestation obtenue" },
] as const;

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ periode?: string }> }) {
  await requireAdmin();
  const days = parsePeriod((await searchParams).periode);
  const [kpis, signups, active, funnels] = await Promise.all([getOverviewKpis(), dailySignups(days), dailyActiveLearners(days), getFunnels()]);
  const k = kpis!;

  return (
    <>
      <PageTitle
        title="Vue d'ensemble"
        description="Inscriptions, activité et progression des apprenants sur toute la plateforme."
        actions={
          <div className="flex rounded-lg border border-border p-0.5" role="group" aria-label="Période des graphiques">
            {PERIODS.map((p) => (
              <Link
                key={p}
                href={`/admin?periode=${p}`}
                aria-current={p === days ? "true" : undefined}
                className={`rounded-md px-3 py-1.5 font-mono text-xs font-semibold ${p === days ? "bg-bg-muted text-fg" : "text-fg-muted hover:text-fg"}`}
              >
                {p} j
              </Link>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Kpi label="Inscrits" value={fmtNumber(k.users)} hint={<Link href="/admin/apprenants" className="hover:text-brand">Voir la liste</Link>} />
        <Kpi label="Nouveaux · 7 j" value={fmtNumber(k.new7)} hint={`${fmtNumber(k.new30)} sur 30 jours`} />
        <Kpi label="Actifs · 7 j" value={fmtNumber(k.active7)} hint={`${fmtNumber(k.active30)} sur 30 jours`} />
        <Kpi label="Chapitres validés" value={fmtNumber(k.validated)} hint="Toutes personnes confondues" />
        <Kpi label="Attestations" value={fmtNumber(k.certificates)} hint="Hors attestations révoquées" />
        <Kpi label="Visites · 7 j" value={fmtNumber(k.visitors7)} hint={<Link href="/admin/visites" className="hover:text-brand">Voir l&apos;audience</Link>} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Inscriptions par jour" description={`${signups.reduce((n, d) => n + d.value, 0)} sur les ${days} derniers jours`}>
          <DailyBars data={signups} unit="inscription(s)" label="Inscriptions par jour" />
        </Panel>
        <Panel title="Apprenants actifs par jour" description="Au moins une section lue, une évaluation, un examen ou une révision dans la journée">
          <DailyBars data={active} unit="apprenant(s) actif(s)" label="Apprenants actifs par jour" />
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Entonnoir par parcours" description={`Part des ${fmtNumber(funnels.users)} inscrits ayant atteint chaque étape`}>
          <div className="grid gap-6 lg:grid-cols-2">
            {funnels.rows.map((f) => (
              <div key={f.slug}>
                <h3 className="mb-3 text-sm font-semibold text-fg">
                  {f.title} <span className="font-mono text-xs font-normal text-fg-subtle">· {f.chapters} chapitres</span>
                </h3>
                <ol className="space-y-2">
                  {STEPS.map((s, i) => {
                    const value = f[s.key];
                    const prev = i === 0 ? funnels.users : f[STEPS[i - 1].key];
                    return (
                      <li key={s.key} className="grid grid-cols-[9.5rem_1fr_auto] items-center gap-3 text-sm">
                        <span className="truncate text-fg-muted">{s.label}</span>
                        <div className="h-5 rounded bg-bg-muted">
                          <div
                            className="h-5 rounded bg-brand"
                            style={{ width: funnels.users ? `${Math.max(value ? 1.5 : 0, (100 * value) / funnels.users)}%` : 0 }}
                          />
                        </div>
                        <span className="w-24 text-right font-mono text-xs tabular-nums text-fg" title={`${fmtPct(value, prev)} de l'étape précédente`}>
                          {value} · {fmtPct(value, funnels.users)}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
