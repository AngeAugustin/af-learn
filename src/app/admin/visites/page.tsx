import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getTraffic, parsePeriod, PERIODS } from "@/lib/admin/stats";
import { pageLabel } from "@/lib/analytics";
import { fmtNumber, fmtPct } from "@/lib/admin/format";
import { Kpi, PageTitle, Panel, RankList } from "@/components/admin/ui";
import { DailyBars } from "@/components/admin/daily-bars";

export const metadata: Metadata = { title: "Visites" };
export const dynamic = "force-dynamic";

const DEVICES: Record<string, string> = { mobile: "Mobile", tablet: "Tablette", desktop: "Ordinateur" };

export default async function TrafficPage({ searchParams }: { searchParams: Promise<{ periode?: string }> }) {
  await requireAdmin("/admin/visites");
  const days = parsePeriod((await searchParams).periode);
  const t = await getTraffic(days);

  return (
    <>
      <PageTitle
        title="Visites"
        description="Mesure interne sans cookie : l'adresse IP n'est jamais enregistrée et un visiteur n'est reconnaissable que le jour même. Les visites de l'espace d'administration ne sont pas comptées."
        actions={
          <div className="flex rounded-lg border border-border p-0.5" role="group" aria-label="Période">
            {PERIODS.map((p) => (
              <Link
                key={p}
                href={`/admin/visites?periode=${p}`}
                aria-current={p === days ? "true" : undefined}
                className={`rounded-md px-3 py-1.5 font-mono text-xs font-semibold ${p === days ? "bg-bg-muted text-fg" : "text-fg-muted hover:text-fg"}`}
              >
                {p} j
              </Link>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label={`Visites · ${days} j`} value={fmtNumber(t.totals.visits)} hint="Visiteurs uniques par jour, additionnés" />
        <Kpi label="Pages vues" value={fmtNumber(t.totals.views)} hint={t.totals.visits ? `${(t.totals.views / t.totals.visits).toFixed(1)} pages par visite` : undefined} />
        <Kpi label="Inscriptions" value={fmtNumber(t.signups)} hint={`Sur les ${days} derniers jours`} />
        <Kpi label="Conversion" value={fmtPct(t.signups, t.totals.visits)} hint="Inscriptions rapportées aux visites" />
      </div>

      <div className="mt-6">
        <Panel title="Visiteurs uniques par jour">
          <DailyBars
            data={t.daily.map((d) => ({ day: d.day, value: d.visitors, extra: `${d.views} page(s) vue(s)` }))}
            unit="visiteur(s)"
            label="Visiteurs uniques par jour"
          />
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Pages les plus vues">
          <RankList
            rows={t.pages.map((p) => ({ label: pageLabel(p.path), value: p.views, href: p.path }))}
            unit="vues"
            empty="Aucune page vue sur la période."
          />
        </Panel>
        <div className="space-y-6">
          <Panel title="Sites d'origine" description="Visites arrivées depuis un autre site">
            <RankList rows={t.referrers.map((r) => ({ label: r.label, value: r.visitors }))} unit="visites" empty="Aucun site d'origine : accès direct ou référent masqué." />
          </Panel>
          <Panel title="Campagnes" description="Paramètre utm_source (ou ref) des liens partagés">
            <RankList rows={t.campaigns.map((r) => ({ label: r.label, value: r.visitors }))} unit="visites" empty="Aucune campagne. Ajoutez ?utm_source=nom à vos liens pour les suivre." />
          </Panel>
          <Panel title="Appareils">
            <RankList rows={t.devices.map((r) => ({ label: DEVICES[r.label] ?? r.label, value: r.visitors }))} unit="visites" empty="Aucune donnée." />
          </Panel>
        </div>
      </div>
    </>
  );
}
