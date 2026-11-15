import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { AUDIT_LABELS, listAudit } from "@/lib/admin/audit";
import { fmtDateTime } from "@/lib/admin/format";
import { EmptyState, PageTitle, td, th } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Journal" };
export const dynamic = "force-dynamic";

const SIZE = 50;

function describe(details: Record<string, unknown>): string {
  return Object.entries(details)
    .map(([k, v]) => {
      if (v && typeof v === "object" && "avant" in v && "apres" in v) {
        const c = v as { avant: unknown; apres: unknown };
        return `${k} : ${c.avant} → ${c.apres}`;
      }
      return `${k} : ${typeof v === "object" ? JSON.stringify(v) : String(v)}`;
    })
    .join(" · ");
}

export default async function AuditPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requireAdmin("/admin/journal");
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const rows = await listAudit({ limit: SIZE, offset: (page - 1) * SIZE });
  const total = rows[0]?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / SIZE));

  return (
    <>
      <PageTitle title="Journal d'administration" description="Chaque action effectuée depuis le back office ou la ligne de commande, la plus récente en premier." />
      {rows.length === 0 ? (
        <EmptyState>Aucune action enregistrée.</EmptyState>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr>
                <th className={th}>Date</th>
                <th className={th}>Action</th>
                <th className={th}>Concerne</th>
                <th className={th}>Par</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className={`${td} whitespace-nowrap text-fg-muted`}>{fmtDateTime(r.created_at)}</td>
                  <td className={td}>
                    <span className="text-fg">{AUDIT_LABELS[r.action] ?? r.action}</span>
                    {Object.keys(r.details).length > 0 && <span className="block max-w-md text-xs text-fg-subtle">{describe(r.details)}</span>}
                  </td>
                  <td className={td}>
                    {r.target_user_id && r.target_label !== "Compte supprimé" ? (
                      <Link href={`/admin/apprenants/${r.target_user_id}`} className="text-fg hover:text-brand">
                        {r.target_label}
                      </Link>
                    ) : (
                      <span className="text-fg-muted">{r.target_label ?? "n/a"}</span>
                    )}
                  </td>
                  <td className={`${td} text-fg-muted`}>{r.actor_email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pages > 1 && (
        <nav className="mt-5 flex items-center justify-between text-sm" aria-label="Pagination">
          <span className="text-fg-muted">
            Page {page} sur {pages}
          </span>
          <div className="flex gap-2">
            {page > 1 && <Link className="rounded-lg border border-border px-3 py-1.5 hover:bg-bg-muted" href={`/admin/journal?page=${page - 1}`}>Précédente</Link>}
            {page < pages && <Link className="rounded-lg border border-border px-3 py-1.5 hover:bg-bg-muted" href={`/admin/journal?page=${page + 1}`}>Suivante</Link>}
          </div>
        </nav>
      )}
    </>
  );
}
