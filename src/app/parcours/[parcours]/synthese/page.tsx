import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Award, BookOpen, Layers } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getCourse, getParcoursSketchnotes, isCourseOpen } from "@/lib/queries";
import { getExamSummaries } from "@/lib/memorisation-queries";
import { extractSketchnoteSources } from "@/lib/sketchnote";
import { Sketchnote } from "@/components/content/sketchnote";
import { SketchnoteSynthesisDownload } from "@/components/content/sketchnote-synthesis-download";
import { ParcoursIcon } from "@/components/ui/parcours-icon";

type Params = { parcours: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const course = await getCourse((await params).parcours, null);
  if (!course || course.parcours.status === "hidden") return { title: "Synthèse", robots: { index: false } };
  return {
    title: `Sketchnotes · ${course.parcours.title}`,
    description: `Récapitulatif des sketchnotes du parcours ${course.parcours.title}.`,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default async function SynthesePage({ params }: { params: Promise<Params> }) {
  const { parcours: slug } = await params;
  const user = await requireUser(`/parcours/${slug}/synthese`);
  const course = await getCourse(slug, user.id);
  if (!course || !isCourseOpen(course.parcours.status, user.role)) notFound();

  const { parcours, modules, totals } = course;
  const chaptersDone = totals.chapters > 0 && totals.passed === totals.chapters;
  if (!chaptersDone) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <BookOpen className="mx-auto size-12 text-fg-subtle" aria-hidden />
        <h1 className="mt-4 text-2xl font-bold text-fg">Synthèse non disponible</h1>
        <p className="mt-3 text-fg-muted">
          Le PDF des sketchnotes se débloque lorsque tous les chapitres du parcours sont validés ({totals.passed} /{" "}
          {totals.chapters} pour l&apos;instant).
        </p>
        <Link href={`/parcours/${parcours.slug}`} className="mt-8 inline-flex rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-fg">
          Continuer le parcours
        </Link>
      </div>
    );
  }

  const rows = await getParcoursSketchnotes(parcours.id);
  const items = rows
    .map((row) => {
      const [source] = extractSketchnoteSources(row.body_md);
      if (!source) return null;
      return { ...row, source };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const finalExam = (await getExamSummaries(user.id, parcours.id)).find((s) => s.module_id === null) ?? null;
  const byModule = modules
    .map((m) => ({
      module: m,
      sketchnotes: items.filter((i) => i.module_id === m.id),
    }))
    .filter((g) => g.sketchnotes.length > 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href={`/parcours/${parcours.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted transition hover:text-brand"
          >
            <ArrowLeft className="size-4" aria-hidden /> Retour au parcours
          </Link>
          <div className="mt-4 flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <ParcoursIcon icon={parcours.icon} className="size-5" />
            </span>
            <div>
              <p className="label-mono text-brand">Fin de parcours</p>
              <h1 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">Sketchnotes · {parcours.title}</h1>
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
            Les {items.length} synthèses visuelles du parcours, module par module. Téléchargez le PDF multi-pages pour
            réviser hors ligne.
          </p>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-fg-subtle">
            <span className="inline-flex items-center gap-1.5">
              <Layers className="size-3.5" aria-hidden /> {byModule.length} modules
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="size-3.5" aria-hidden /> {items.length} sketchnotes
            </span>
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <SketchnoteSynthesisDownload
            title={parcours.title}
            fileName={`sketchnotes-${parcours.slug}.pdf`}
            pageCount={items.length}
          />
          {finalExam?.passed && (
            <Link
              href={`/certificat/${parcours.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-bg-elevated px-4 py-2.5 text-sm font-semibold text-fg transition hover:border-brand-line hover:text-brand"
            >
              <Award className="size-4" aria-hidden /> Voir mon attestation
            </Link>
          )}
        </div>
      </div>

      <div className="space-y-14">
        {byModule.map(({ module: m, sketchnotes }, mi) => (
          <section key={m.id} id={m.slug} aria-labelledby={`module-${m.slug}`}>
            <div className="mb-5 border-b border-border pb-3">
              <p className="label-mono text-fg-subtle">Module {pad(mi + 1)}</p>
              <h2 id={`module-${m.slug}`} className="mt-1 text-xl font-bold tracking-tight text-fg">
                {m.title}
              </h2>
              <p className="mt-1 text-sm text-fg-muted">
                {sketchnotes.length} sketchnote{sketchnotes.length > 1 ? "s" : ""}
              </p>
            </div>
            <ol className="space-y-10">
              {sketchnotes.map((item, ci) => (
                <li
                  key={item.section_id}
                  data-synthesis-sketchnote
                  data-module-title={m.title}
                  data-chapter-title={item.chapter_title}
                >
                  <p className="mb-2 font-mono text-[11px] text-fg-subtle">
                    Chapitre {pad(ci + 1)} · {item.chapter_title}
                  </p>
                  <Sketchnote
                    source={item.source}
                    showDownload={false}
                    filterId={`sketch-wobble-${m.slug}-${item.chapter_slug}`}
                    badge={`module ${pad(mi + 1)} · chapitre ${pad(item.chapter_position + 1)}`}
                  />
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <div className="sticky bottom-4 z-10 mt-12 flex justify-center">
        <div className="rounded-2xl border border-border bg-bg-elevated/95 p-3 shadow-card backdrop-blur">
          <SketchnoteSynthesisDownload
            title={parcours.title}
            fileName={`sketchnotes-${parcours.slug}.pdf`}
            pageCount={items.length}
          />
        </div>
      </div>
    </div>
  );
}
