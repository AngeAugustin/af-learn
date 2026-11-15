import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { listLearners } from "@/lib/admin/learners";
import { audit } from "@/lib/admin/audit";
import { toCsv } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

/** Export CSV de la liste des apprenants, avec les mêmes filtres que la page. */
export async function GET(request: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") return new Response("Accès refusé.", { status: 404 });
  const sp = request.nextUrl.searchParams;
  const filters = {
    q: sp.get("q") ?? undefined,
    parcours: sp.get("parcours") ?? undefined,
    statut: sp.get("statut") ?? undefined,
    attestation: sp.get("attestation") ?? undefined,
    tri: sp.get("tri") ?? undefined,
  };
  const rows = await listLearners(filters, null);
  await audit(admin, "users.export_csv", null, { lignes: rows.length, filtres: Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) });

  const csv = toCsv([
    ["id", "nom", "email", "role", "inscrit_le", "derniere_activite", "suspendu_le", "chapitres_valides", "progression_max_pct", "parcours", "attestations"],
    ...rows.map((u) => [
      u.id,
      u.name,
      u.email,
      u.role,
      u.created_at,
      u.last_active,
      u.suspended_at,
      u.chapters,
      u.best_pct,
      u.courses.map((c) => `${c.title} ${c.done}/${c.total}`).join(" | "),
      u.certs,
    ]),
  ]);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="cursus-apprenants-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
