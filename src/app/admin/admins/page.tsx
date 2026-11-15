import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { fmtDate, fmtRelative } from "@/lib/admin/format";
import { Badge, Notice, PageTitle, Panel } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { grantAdminAction, revokeAdminAction } from "../actions";

export const metadata: Metadata = { title: "Administrateurs" };
export const dynamic = "force-dynamic";

const NOTICES: Record<string, [boolean, string]> = {
  ajoute: [true, "Droits d'administration accordés."],
  retire: [true, "Droits d'administration retirés."],
  introuvable: [false, "Aucun compte avec cette adresse. La personne doit d'abord s'inscrire sur le site."],
  suspendu: [false, "Ce compte est suspendu : réactivez-le d'abord."],
  "deja-admin": [false, "Ce compte est déjà administrateur."],
  "pas-soi-meme": [false, "Vous ne pouvez pas retirer vos propres droits. Demandez à un autre administrateur."],
  dernier: [false, "Impossible de retirer le dernier administrateur."],
};

export default async function AdminsPage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const me = await requireAdmin("/admin/admins");
  const { notice } = await searchParams;
  const admins = await query<{ id: string; name: string; email: string; created_at: Date; last_seen_at: Date | null }>(
    "SELECT id, name, email, created_at, last_seen_at FROM users WHERE role = 'admin' ORDER BY created_at",
  );

  return (
    <>
      <PageTitle title="Administrateurs" description="Les administrateurs voient les données de tous les apprenants et peuvent gérer leurs comptes. Accordez ce rôle avec parcimonie." />
      <Notice code={notice} messages={NOTICES} />
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel title={`${admins.length} administrateur${admins.length > 1 ? "s" : ""}`}>
          <ul className="divide-y divide-border/60">
            {admins.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <Link href={`/admin/apprenants/${a.id}`} className="text-sm font-semibold text-fg hover:text-brand">
                    {a.name}
                  </Link>{" "}
                  {a.id === me.id && <Badge tone="brand">vous</Badge>}
                  <p className="text-xs text-fg-muted">
                    {a.email} · inscrit le {fmtDate(a.created_at)} · vu {fmtRelative(a.last_seen_at)}
                  </p>
                </div>
                {a.id !== me.id && admins.length > 1 && (
                  <form action={revokeAdminAction}>
                    <input type="hidden" name="userId" value={a.id} />
                    <ConfirmButton tone="danger" message={`Retirer les droits d'administration de ${a.email} ?`}>
                      Retirer
                    </ConfirmButton>
                  </form>
                )}
              </li>
            ))}
          </ul>
        </Panel>
        <div className="space-y-6">
          <Panel title="Ajouter un administrateur" description="La personne doit déjà avoir un compte sur le site.">
            <form action={grantAdminAction} className="flex flex-wrap gap-2">
              <input
                name="email"
                type="email"
                required
                placeholder="adresse@exemple.fr"
                className="min-w-0 flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-brand"
              />
              <ConfirmButton tone="brand" message="Accorder les droits d'administration à ce compte ?">
                Ajouter
              </ConfirmButton>
            </form>
          </Panel>
          <Panel title="Sécurité">
            <ul className="list-disc space-y-1.5 pl-4 text-sm text-fg-muted">
              <li>Le rôle est vérifié côté serveur sur chaque page, chaque export et chaque action du back office.</li>
              <li>Toutes les actions sont tracées dans le journal.</li>
              <li>
                Hors du site, la commande <code className="font-mono text-xs text-fg">npm run admin:add -- adresse</code> accorde le rôle (utile pour le
                premier administrateur).
              </li>
              <li>La double authentification n&apos;est pas encore disponible.</li>
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
