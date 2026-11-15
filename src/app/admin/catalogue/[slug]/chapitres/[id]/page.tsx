import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getCatalogChapter } from "@/lib/admin/catalog";
import { Badge, Notice, PageTitle } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { updateSectionAction } from "../../../actions";
import { CATALOG_NOTICES, input, keyOf, label, RevertButton } from "../../../shared";

export const metadata: Metadata = { title: "Contenu d'un chapitre" };
export const dynamic = "force-dynamic";

export default async function CatalogChapterPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; id: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const { slug, id } = await params;
  await requireAdmin(`/admin/catalogue/${slug}/chapitres/${id}`);
  const chapterId = Number(id);
  const [data, { notice }] = await Promise.all([Number.isInteger(chapterId) && chapterId > 0 ? getCatalogChapter(chapterId) : null, searchParams]);
  if (!data || data.chapter.parcours_slug !== slug) notFound();
  const { chapter, sections } = data;
  const publicBase = `/parcours/${chapter.parcours_slug}/${chapter.module_slug}/${chapter.slug}`;

  return (
    <>
      <Link href={`/admin/catalogue/${slug}#chapitre-${chapter.id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-brand">
        <ArrowLeft className="size-4" aria-hidden /> {chapter.parcours_title}
      </Link>
      <PageTitle
        title={chapter.title}
        description={`${chapter.module_title} · ${sections.length} sections. Contenu en Markdown, comme dans les fichiers de content/.`}
        actions={
          <>
          <Link
            href={`/admin/catalogue/${slug}/chapitres/${chapter.id}/questions`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-fg hover:bg-bg-muted"
          >
            Questions d&apos;évaluation
          </Link>
          <Link
            href={publicBase}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-fg hover:bg-bg-muted"
          >
            <ExternalLink className="size-4" aria-hidden /> Voir le chapitre
          </Link>
          </>
        }
      />
      <Notice code={notice} messages={CATALOG_NOTICES} />

      <p className="mb-5 rounded-lg border border-border bg-bg-muted px-4 py-3 text-xs leading-relaxed text-fg-muted">
        Le HTML actif (script, iframe, formulaire, attribut on…, lien javascript:) est refusé en dehors des blocs de code. Les
        questions d&apos;évaluation se modifient depuis le bouton « Questions d&apos;évaluation ».
      </p>

      <ol className="space-y-3">
        {sections.map((s, i) => {
          const edited = Object.keys(s.overrides).length > 0;
          return (
            <li key={s.id} id={`section-${s.id}`} className="card scroll-mt-24">
              <details className="group">
                <summary className="flex cursor-pointer list-none flex-wrap items-center gap-2 px-4 py-3">
                  <span className="font-mono text-xs text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-semibold text-fg">{s.title}</span>
                  {s.is_exercises && <Badge>Exercices</Badge>}
                  {s.is_sketchnote && <Badge>Sketchnote</Badge>}
                  {edited && <Badge tone="brand">Modifiée</Badge>}
                  <span className="ml-auto font-mono text-[11px] text-fg-subtle">{s.body_md.length.toLocaleString("fr-FR")} caractères</span>
                  <span className="text-xs font-semibold text-brand group-open:hidden">Modifier</span>
                </summary>
                <div className="border-t border-border px-4 py-4">
                  {s.is_sketchnote && (
                    <p className="mb-3 text-xs text-fg-muted">
                      Cette section contient la source d&apos;une sketchnote : gardez sa structure intacte pour qu&apos;elle reste lisible.
                    </p>
                  )}
                  <form key={keyOf([s.title, s.body_md])} action={updateSectionAction} className="grid gap-3">
                    <input type="hidden" name="id" value={s.id} />
                    <div>
                      <label className={label} htmlFor={`s-title-${s.id}`}>Titre de la section</label>
                      <input id={`s-title-${s.id}`} name="title" defaultValue={s.title} required maxLength={200} className={input} />
                    </div>
                    <div>
                      <label className={label} htmlFor={`s-body-${s.id}`}>Contenu (Markdown)</label>
                      <textarea
                        id={`s-body-${s.id}`}
                        name="body"
                        defaultValue={s.body_md}
                        required
                        rows={20}
                        spellCheck
                        className={`${input} font-mono text-[13px] leading-relaxed`}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <ConfirmButton tone="brand">Enregistrer la section</ConfirmButton>
                      <Link href={`${publicBase}/${s.slug}`} className="text-sm font-semibold text-brand hover:underline">
                        Voir sur le site
                      </Link>
                    </div>
                  </form>
                  {edited && (
                    <div className="mt-3">
                      <RevertButton kind="sections" id={s.id} what="cette section" />
                    </div>
                  )}
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </>
  );
}
