import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUp, ExternalLink, PencilLine } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { listCatalog, STATUS_HELP } from "@/lib/admin/catalog";
import { fmtNumber, fmtRelative } from "@/lib/admin/format";
import { Badge, EmptyState, Notice, PageTitle } from "@/components/admin/ui";
import { ParcoursIcon, parcoursTone } from "@/components/ui/parcours-icon";
import { moveCourseAction } from "./actions";
import { CATALOG_NOTICES, StatusBadge, StatusSwitch } from "./shared";

export const metadata: Metadata = { title: "Catalogue" };
export const dynamic = "force-dynamic";

const hours = (minutes: number) => `≈ ${Math.max(1, Math.round(minutes / 60))} h`;

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  await requireAdmin("/admin/catalogue");
  const [rows, { notice }] = await Promise.all([listCatalog(), searchParams]);
  const counts = {
    published: rows.filter((r) => r.status === "published").length,
    coming_soon: rows.filter((r) => r.status === "coming_soon").length,
    hidden: rows.filter((r) => r.status === "hidden").length,
  };

  return (
    <>
      <PageTitle
        title="Catalogue"
        description="Toutes les formations de la plateforme. Choisissez leur disponibilité, leur ordre d'affichage et modifiez leur contenu."
      />
      <Notice code={notice} messages={CATALOG_NOTICES} />

      <dl className="mb-6 grid gap-3 sm:grid-cols-3">
        {(["published", "coming_soon", "hidden"] as const).map((s) => (
          <div key={s} className="card p-4">
            <dt className="flex items-center gap-2">
              <StatusBadge status={s} />
            </dt>
            <dd className="mt-2 font-mono text-2xl font-semibold tabular-nums text-fg">{counts[s]}</dd>
            <dd className="mt-1 text-xs leading-relaxed text-fg-muted">{STATUS_HELP[s]}</dd>
          </div>
        ))}
      </dl>

      {rows.length === 0 ? (
        <EmptyState>Aucun parcours. Ajoutez un dossier dans content/parcours puis lancez npm run db:seed.</EmptyState>
      ) : (
        <ol className="space-y-3">
          {rows.map((p, i) => {
            const tone = parcoursTone(p.color);
            return (
              <li key={p.id} className="card p-4 sm:p-5">
                <div className="flex flex-wrap items-start gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <form action={moveCourseAction}>
                      <input type="hidden" name="slug" value={p.slug} />
                      <input type="hidden" name="dir" value="up" />
                      <button
                        type="submit"
                        disabled={i === 0}
                        aria-label={`Monter ${p.title}`}
                        className="rounded-md p-1 text-fg-muted hover:bg-bg-muted hover:text-fg disabled:opacity-30"
                      >
                        <ArrowUp className="size-4" aria-hidden />
                      </button>
                    </form>
                    <span className="font-mono text-xs tabular-nums text-fg-subtle">{i + 1}</span>
                    <form action={moveCourseAction}>
                      <input type="hidden" name="slug" value={p.slug} />
                      <input type="hidden" name="dir" value="down" />
                      <button
                        type="submit"
                        disabled={i === rows.length - 1}
                        aria-label={`Descendre ${p.title}`}
                        className="rounded-md p-1 text-fg-muted hover:bg-bg-muted hover:text-fg disabled:opacity-30"
                      >
                        <ArrowDown className="size-4" aria-hidden />
                      </button>
                    </form>
                  </div>

                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl" style={{ background: tone.soft, color: tone.color }}>
                    <ParcoursIcon icon={p.icon} className="size-5" />
                  </span>

                  <div className="min-w-[14rem] flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-semibold text-fg">{p.title}</h2>
                      <StatusBadge status={p.status} />
                      {p.edits > 0 && (
                        <Badge tone="brand">
                          {p.edits} modification{p.edits > 1 ? "s" : ""}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-fg-muted">{p.tagline}</p>
                    <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-fg-subtle">
                      <span>{p.modules} modules</span>
                      <span>{p.chapters} chapitres</span>
                      <span>{fmtNumber(p.questions)} questions</span>
                      <span>{hours(p.minutes)}</span>
                      <span>{fmtNumber(p.learners)} apprenant(s)</span>
                      <span>{fmtNumber(p.certificates)} attestation(s)</span>
                      {p.updated_at && <span>modifié {fmtRelative(p.updated_at)}</span>}
                    </p>
                  </div>

                  <div className="flex w-full flex-wrap items-center gap-2 xl:w-auto xl:flex-col xl:items-end">
                    <StatusSwitch slug={p.slug} status={p.status} learners={p.learners} />
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/catalogue/${p.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-brand-fg hover:bg-brand-strong"
                      >
                        <PencilLine className="size-4" aria-hidden /> Gérer
                      </Link>
                      <Link
                        href={`/parcours/${p.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-fg hover:bg-bg-muted"
                      >
                        <ExternalLink className="size-4" aria-hidden /> Voir
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
      <p className="mt-6 text-xs leading-relaxed text-fg-subtle">
        Les modifications faites ici s&apos;appliquent immédiatement sur le site et sont conservées quand le contenu est rechargé
        depuis les fichiers (npm run db:seed). Chaque élément modifié peut être remis à la version des fichiers depuis sa page.
      </p>
    </>
  );
}
