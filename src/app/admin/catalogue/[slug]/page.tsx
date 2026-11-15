import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, FileText, ListChecks } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getCatalogCourse, STATUS_HELP, type Overrides } from "@/lib/admin/catalog";
import { Badge, Notice, PageTitle, Panel } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { ICONS, ParcoursIcon, parcoursTone, TONES } from "@/components/ui/parcours-icon";
import { updateChapterAction, updateCourseAction, updateModuleAction } from "../actions";
import { CATALOG_NOTICES, input, keyOf, label, RevertButton, StatusBadge, StatusSwitch } from "../shared";

export const metadata: Metadata = { title: "Gérer un parcours" };
export const dynamic = "force-dynamic";

const TONE_LABELS: Record<string, string> = { violet: "Violet", blue: "Bleu", teal: "Sarcelle", amber: "Ambre", rose: "Rose" };
const ICON_LABELS: Record<string, string> = { brain: "Cerveau", database: "Base de données", shield: "Bouclier", code: "Code" };

/** Petit repère « modifié » avec la liste des champs surchargés. */
function Edited({ overrides, names }: { overrides: Overrides; names: Record<string, string> }) {
  const keys = Object.keys(overrides).filter((k) => k in names);
  if (!keys.length) return null;
  return (
    <span title={`Modifié dans le back office : ${keys.map((k) => names[k]).join(", ")}`}>
      <Badge tone="brand">Modifié</Badge>
    </span>
  );
}

const COURSE_FIELDS = {
  title: "titre",
  tagline: "accroche",
  description: "description",
  level: "niveau",
  color: "couleur",
  icon: "icône",
  prerequisites: "prérequis",
  outcomes: "objectifs",
  status: "disponibilité",
  position: "ordre",
};
const MODULE_FIELDS = { title: "titre", description: "description" };
const CHAPTER_FIELDS = { title: "titre", description: "description", duration_minutes: "durée", objectives: "objectifs" };

export default async function CatalogCoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const { slug } = await params;
  await requireAdmin(`/admin/catalogue/${slug}`);
  const [data, { notice }] = await Promise.all([getCatalogCourse(slug), searchParams]);
  if (!data) notFound();
  const { parcours: p, modules, chapters, learners } = data;
  const tone = parcoursTone(p.color);

  return (
    <>
      <Link href="/admin/catalogue" className="mb-4 inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-brand">
        <ArrowLeft className="size-4" aria-hidden /> Catalogue
      </Link>
      <PageTitle
        title={p.title}
        description={`${modules.length} modules · ${chapters.length} chapitres · ${learners} apprenant(s) · identifiant ${p.slug}`}
        actions={
          <>
            <Link
              href={`/parcours/${p.slug}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-fg hover:bg-bg-muted"
            >
              <ExternalLink className="size-4" aria-hidden /> Voir sur le site
            </Link>
            {Object.keys(p.overrides).length > 0 && <RevertButton kind="parcours" id={p.id} what="la fiche de ce parcours" />}
          </>
        }
      />
      <Notice code={notice} messages={CATALOG_NOTICES} />

      <div className="grid gap-6">
        <Panel title="Disponibilité" description={STATUS_HELP[p.status]} actions={<StatusBadge status={p.status} />}>
          <StatusSwitch slug={p.slug} status={p.status} learners={learners} back="fiche" />
        </Panel>

        <Panel title="Fiche du parcours" description="Textes affichés dans le catalogue et sur la page du parcours." actions={<Edited overrides={p.overrides} names={COURSE_FIELDS} />}>
          <form key={keyOf([p.title, p.tagline, p.description, p.level, p.color, p.icon, p.prerequisites, p.outcomes])} action={updateCourseAction} className="grid gap-4 md:grid-cols-2">
            <input type="hidden" name="slug" value={p.slug} />
            <div className="md:col-span-2">
              <label className={label} htmlFor="title">Titre</label>
              <input id="title" name="title" defaultValue={p.title} required minLength={2} maxLength={120} className={input} />
            </div>
            <div className="md:col-span-2">
              <label className={label} htmlFor="tagline">Accroche</label>
              <input id="tagline" name="tagline" defaultValue={p.tagline} required minLength={2} maxLength={300} className={input} />
            </div>
            <div className="md:col-span-2">
              <label className={label} htmlFor="description">Description</label>
              <textarea id="description" name="description" defaultValue={p.description} required rows={5} maxLength={3000} className={input} />
            </div>
            <div>
              <label className={label} htmlFor="level">Niveau</label>
              <input id="level" name="level" defaultValue={p.level} required maxLength={80} className={input} />
            </div>
            <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
              <div>
                <label className={label} htmlFor="color">Couleur</label>
                <select id="color" name="color" defaultValue={p.color} className={input}>
                  {TONES.map((t) => (
                    <option key={t} value={t}>{TONE_LABELS[t] ?? t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label} htmlFor="icon">Icône</label>
                <select id="icon" name="icon" defaultValue={p.icon} className={input}>
                  {Object.keys(ICONS).map((k) => (
                    <option key={k} value={k}>{ICON_LABELS[k] ?? k}</option>
                  ))}
                </select>
              </div>
              <span className="flex size-10 items-center justify-center rounded-xl" style={{ background: tone.soft, color: tone.color }} aria-hidden>
                <ParcoursIcon icon={p.icon} className="size-5" />
              </span>
            </div>
            <div>
              <label className={label} htmlFor="prerequisites">Prérequis (un par ligne)</label>
              <textarea id="prerequisites" name="prerequisites" defaultValue={p.prerequisites.join("\n")} rows={5} className={input} />
            </div>
            <div>
              <label className={label} htmlFor="outcomes">Ce que l&apos;on saura faire (un par ligne)</label>
              <textarea id="outcomes" name="outcomes" defaultValue={p.outcomes.join("\n")} rows={5} className={input} />
            </div>
            <div className="md:col-span-2">
              <ConfirmButton tone="brand">Enregistrer la fiche</ConfirmButton>
            </div>
          </form>
        </Panel>

        <Panel title="Modules et chapitres" description="Titres, descriptions, durées et objectifs. Le contenu des leçons se modifie section par section.">
          <div className="space-y-4">
            {modules.map((m, mi) => {
              const list = chapters.filter((c) => c.module_id === m.id);
              return (
                <section key={m.id} id={`module-${m.id}`} className="scroll-mt-24 rounded-xl border border-border">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none flex-wrap items-center gap-2 px-4 py-3">
                      <span className="font-mono text-xs text-fg-subtle">Module {mi + 1}</span>
                      <span className="font-semibold text-fg">{m.title}</span>
                      <Edited overrides={m.overrides} names={MODULE_FIELDS} />
                      <span className="ml-auto text-xs font-semibold text-brand group-open:hidden">Modifier le module</span>
                    </summary>
                    <div className="border-t border-border px-4 py-4">
                      <form key={keyOf([m.title, m.description])} action={updateModuleAction} className="grid gap-3">
                        <input type="hidden" name="id" value={m.id} />
                        <div>
                          <label className={label} htmlFor={`m-title-${m.id}`}>Titre du module</label>
                          <input id={`m-title-${m.id}`} name="title" defaultValue={m.title} required maxLength={160} className={input} />
                        </div>
                        <div>
                          <label className={label} htmlFor={`m-desc-${m.id}`}>Description</label>
                          <textarea id={`m-desc-${m.id}`} name="description" defaultValue={m.description} required rows={2} maxLength={1000} className={input} />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <ConfirmButton tone="brand">Enregistrer le module</ConfirmButton>
                        </div>
                      </form>
                      {Object.keys(m.overrides).length > 0 && (
                        <div className="mt-3">
                          <RevertButton kind="modules" id={m.id} what="ce module" />
                        </div>
                      )}
                    </div>
                  </details>

                  <ul className="divide-y divide-border/60 border-t border-border">
                    {list.map((c) => (
                      <li key={c.id} id={`chapitre-${c.id}`} className="scroll-mt-24 px-4 py-3">
                        <details className="group">
                          <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="min-w-0 flex-1 text-sm text-fg">{c.title}</span>
                            <Edited overrides={c.overrides} names={CHAPTER_FIELDS} />
                            {c.edited_sections > 0 && (
                              <Badge tone="brand">
                                {c.edited_sections} section{c.edited_sections > 1 ? "s" : ""} modifiée{c.edited_sections > 1 ? "s" : ""}
                              </Badge>
                            )}
                            <span className="font-mono text-[11px] text-fg-subtle">
                              {c.duration_minutes} min · {c.sections} sections · {c.questions} questions
                            </span>
                            <span className="text-xs font-semibold text-brand group-open:hidden">Modifier</span>
                          </summary>
                          <form key={keyOf([c.title, c.description, c.duration_minutes, c.objectives])} action={updateChapterAction} className="mt-3 grid gap-3 md:grid-cols-[1fr_8rem]">
                            <input type="hidden" name="id" value={c.id} />
                            <div>
                              <label className={label} htmlFor={`c-title-${c.id}`}>Titre du chapitre</label>
                              <input id={`c-title-${c.id}`} name="title" defaultValue={c.title} required maxLength={160} className={input} />
                            </div>
                            <div>
                              <label className={label} htmlFor={`c-dur-${c.id}`}>Durée (min)</label>
                              <input id={`c-dur-${c.id}`} name="duration" type="number" min={1} max={1000} defaultValue={c.duration_minutes} required className={input} />
                            </div>
                            <div className="md:col-span-2">
                              <label className={label} htmlFor={`c-desc-${c.id}`}>Description</label>
                              <textarea id={`c-desc-${c.id}`} name="description" defaultValue={c.description} required rows={2} maxLength={1000} className={input} />
                            </div>
                            <div className="md:col-span-2">
                              <label className={label} htmlFor={`c-obj-${c.id}`}>Objectifs (un par ligne)</label>
                              <textarea id={`c-obj-${c.id}`} name="objectives" defaultValue={c.objectives.join("\n")} rows={3} className={input} />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 md:col-span-2">
                              <ConfirmButton tone="brand">Enregistrer le chapitre</ConfirmButton>
                              <Link
                                href={`/admin/catalogue/${p.slug}/chapitres/${c.id}`}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-fg hover:bg-bg-muted"
                              >
                                <FileText className="size-4" aria-hidden /> Modifier le contenu des sections
                              </Link>
                              <Link
                                href={`/admin/catalogue/${p.slug}/chapitres/${c.id}/questions`}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-fg hover:bg-bg-muted"
                              >
                                <ListChecks className="size-4" aria-hidden /> Modifier les questions ({c.questions})
                              </Link>
                            </div>
                          </form>
                          {Object.keys(c.overrides).length > 0 && (
                            <div className="mt-3">
                              <RevertButton kind="chapters" id={c.id} what="ce chapitre" />
                            </div>
                          )}
                        </details>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </Panel>
      </div>
    </>
  );
}
