import type { Metadata } from "next";
import Link from "next/link";
import { Download, Search } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { listParcours } from "@/lib/queries";
import { listLearners, PAGE_SIZE, type LearnerFilters } from "@/lib/admin/learners";
import { fmtDate, fmtRelative } from "@/lib/admin/format";
import { Badge, EmptyState, Notice, PageTitle, td, th } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Apprenants" };
export const dynamic = "force-dynamic";

type Params = { q?: string; parcours?: string; statut?: string; attestation?: string; tri?: string; page?: string; notice?: string };

const NOTICES: Record<string, [boolean, string]> = {
  "compte-supprime": [true, "Le compte et toutes ses données ont été supprimés."],
  introuvable: [false, "Ce compte n'existe pas ou plus."],
};

const select = "rounded-lg border border-border bg-bg px-2.5 py-2 text-sm text-fg outline-none focus:border-brand";

export default async function LearnersPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requireAdmin("/admin/apprenants");
  const sp = await searchParams;
  const filters: LearnerFilters = { ...sp, page: Math.max(1, Number(sp.page) || 1) };
  const [rows, parcours] = await Promise.all([listLearners(filters), listParcours()]);
  const total = rows[0]?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const qs = (extra: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...sp, notice: undefined, ...extra })) if (v !== undefined && v !== "") p.set(k, String(v));
    const s = p.toString();
    return s ? `?${s}` : "";
  };

  return (
    <>
      <PageTitle
        title="Apprenants"
        description={`${total} compte${total > 1 ? "s" : ""} correspond${total > 1 ? "ent" : ""} aux filtres.`}
        actions={
          <a
            href={`/admin/apprenants/export${qs({ page: undefined })}`}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-sm font-semibold text-fg hover:bg-bg-muted"
          >
            <Download className="size-4" aria-hidden /> Exporter en CSV
          </a>
        }
      />
      <Notice code={sp.notice} messages={NOTICES} />

      <form className="card mb-5 flex flex-wrap items-end gap-3 p-4" role="search">
        <label className="min-w-56 flex-1">
          <span className="label-mono text-fg-subtle">Recherche</span>
          <div className="relative mt-1.5">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-subtle" aria-hidden />
            <input
              name="q"
              defaultValue={sp.q}
              placeholder="Nom ou adresse"
              className="w-full rounded-lg border border-border bg-bg py-2 pl-9 pr-3 text-sm text-fg outline-none focus:border-brand"
            />
          </div>
        </label>
        <label>
          <span className="label-mono text-fg-subtle">Parcours commencé</span>
          <select name="parcours" defaultValue={sp.parcours ?? ""} className={`${select} mt-1.5 block`}>
            <option value="">Tous</option>
            {parcours.map((p) => (
              <option key={p.slug} value={p.slug}>{p.title}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="label-mono text-fg-subtle">Statut</span>
          <select name="statut" defaultValue={sp.statut ?? ""} className={`${select} mt-1.5 block`}>
            <option value="">Tous</option>
            <option value="actif">Actif (30 j)</option>
            <option value="inactif">Inactif</option>
            <option value="suspendu">Suspendu</option>
            <option value="admin">Administrateur</option>
          </select>
        </label>
        <label>
          <span className="label-mono text-fg-subtle">Attestation</span>
          <select name="attestation" defaultValue={sp.attestation ?? ""} className={`${select} mt-1.5 block`}>
            <option value="">Indifférent</option>
            <option value="oui">Au moins une</option>
            <option value="non">Aucune</option>
          </select>
        </label>
        <label>
          <span className="label-mono text-fg-subtle">Trier par</span>
          <select name="tri" defaultValue={sp.tri ?? "inscription"} className={`${select} mt-1.5 block`}>
            <option value="inscription">Inscription récente</option>
            <option value="activite">Dernière activité</option>
            <option value="progression">Progression</option>
            <option value="nom">Nom</option>
          </select>
        </label>
        <div className="flex gap-2">
          <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-fg hover:bg-brand-strong">Filtrer</button>
          <Link href="/admin/apprenants" className="rounded-lg px-3 py-2 text-sm font-medium text-fg-muted hover:text-fg">
            Réinitialiser
          </Link>
        </div>
      </form>

      {rows.length === 0 ? (
        <EmptyState>Aucun compte ne correspond à ces critères.</EmptyState>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr>
                <th className={th}>Apprenant</th>
                <th className={th}>Inscription</th>
                <th className={th}>Dernière activité</th>
                <th className={th}>Progression</th>
                <th className={th}>Attestations</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => {
                const main = u.courses[0];
                return (
                  <tr key={u.id} className="hover:bg-bg-muted/50">
                    <td className={td}>
                      <Link href={`/admin/apprenants/${u.id}`} className="font-semibold text-fg hover:text-brand">
                        {u.name}
                      </Link>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-fg-muted">
                        {u.email}
                        {u.role === "admin" && <Badge tone="brand">admin</Badge>}
                        {u.suspended_at && <Badge tone="danger">suspendu</Badge>}
                      </div>
                    </td>
                    <td className={`${td} whitespace-nowrap text-fg-muted`}>{fmtDate(u.created_at)}</td>
                    <td className={`${td} whitespace-nowrap text-fg-muted`} title={u.last_active ? new Date(u.last_active).toLocaleString("fr-FR") : undefined}>
                      {fmtRelative(u.last_active)}
                    </td>
                    <td className={`${td} min-w-52`}>
                      {main ? (
                        <>
                          <div className="flex items-baseline justify-between gap-2 text-xs">
                            <span className="truncate text-fg">{main.title}</span>
                            <span className="font-mono tabular-nums text-fg-muted">
                              {main.done}/{main.total}
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 rounded-full bg-bg-muted">
                            <div className="h-1.5 rounded-full bg-brand" style={{ width: `${(100 * main.done) / main.total}%` }} />
                          </div>
                          {u.courses.length > 1 && <p className="mt-1 text-[11px] text-fg-subtle">+ {u.courses.length - 1} autre(s) parcours</p>}
                        </>
                      ) : (
                        <span className="text-xs text-fg-subtle">Aucun chapitre validé</span>
                      )}
                    </td>
                    <td className={`${td} font-mono tabular-nums`}>{u.certs || <span className="text-fg-subtle">0</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <nav className="mt-5 flex items-center justify-between text-sm" aria-label="Pagination">
          <span className="text-fg-muted">
            Page {filters.page} sur {pages}
          </span>
          <div className="flex gap-2">
            {filters.page! > 1 && (
              <Link className="rounded-lg border border-border px-3 py-1.5 hover:bg-bg-muted" href={`/admin/apprenants${qs({ page: filters.page! - 1 })}`}>
                Précédente
              </Link>
            )}
            {filters.page! < pages && (
              <Link className="rounded-lg border border-border px-3 py-1.5 hover:bg-bg-muted" href={`/admin/apprenants${qs({ page: filters.page! + 1 })}`}>
                Suivante
              </Link>
            )}
          </div>
        </nav>
      )}
    </>
  );
}
