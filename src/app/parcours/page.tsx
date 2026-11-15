import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText, CheckCircle2, ChevronDown, ClipboardCheck, Code2, Award, Hourglass } from "lucide-react";
import { listParcours } from "@/lib/queries";
import { PASS_THRESHOLD } from "@/lib/quiz";
import { ParcoursIcon, parcoursTone } from "@/components/ui/parcours-icon";

export const metadata: Metadata = { title: "Parcours" };
export const dynamic = "force-dynamic";

const FILTERS = [
  { key: "tous", label: "Tous les parcours" },
  { key: "disponibles", label: "Disponibles" },
  { key: "bientot", label: "Bientôt disponibles" },
] as const;

const FAQ = [
  {
    q: "Les parcours sont-ils accessibles aux débutants ?",
    a: "Chaque parcours indique son niveau et ses prérequis. Le parcours AI Engineering va du niveau débutant au niveau avancé : il suppose de savoir programmer dans au moins un langage (idéalement Python) et d'être à l'aise avec la ligne de commande.",
  },
  {
    q: "À quel rythme dois-je avancer ?",
    a: "À votre rythme. Chaque chapitre indique une durée estimée, votre progression est enregistrée automatiquement et vous pouvez reprendre là où vous vous êtes arrêté depuis le tableau de bord.",
  },
  {
    q: "Comment fonctionne la validation ?",
    a: `Chaque chapitre se termine par une évaluation de 10 questions. Il faut au moins ${PASS_THRESHOLD} % de bonnes réponses pour valider le chapitre et débloquer le suivant. Les tentatives sont illimitées. Une fois tous les chapitres validés, une attestation de fin de parcours est disponible.`,
  },
  {
    q: "Comment l'évaluation est-elle corrigée ?",
    a: "La correction est effectuée sur le serveur, après l'envoi de toutes vos réponses. Les bonnes réponses et les explications détaillées s'affichent une fois le chapitre validé.",
  },
];

const PILLARS = [
  { icon: BookOpenText, label: "01 · Théorie", title: "Théorie approfondie & schémas", text: "Des sections structurées, illustrées de diagrammes et d'exemples concrets." },
  { icon: Code2, label: "02 · Pratique", title: "Exercices corrigés", text: "Des exercices à la fin de chaque chapitre, avec des solutions détaillées." },
  { icon: ClipboardCheck, label: "03 · Exigence", title: `Évaluation notée à ${PASS_THRESHOLD} %`, text: "Un contrôle de 10 questions par chapitre pour avancer en confiance." },
  { icon: Award, label: "04 · Certification", title: "Attestation de fin de parcours", text: "Délivrée lorsque tous les chapitres du parcours sont validés." },
];

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ filtre?: string }> }) {
  const { filtre = "tous" } = await searchParams;
  const all = await listParcours();
  const parcours = all.filter((p) =>
    filtre === "disponibles" ? p.status === "published" : filtre === "bientot" ? p.status === "coming_soon" : true,
  );
  const count = (key: string) =>
    key === "disponibles" ? all.filter((p) => p.status === "published").length : key === "bientot" ? all.filter((p) => p.status === "coming_soon").length : all.length;

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-[1440px] px-4 pb-10 pt-10 sm:px-6 lg:px-12">
          <nav aria-label="Fil d'Ariane" className="mb-6 flex items-center gap-2 font-mono text-[11px] text-fg-muted">
            <Link href="/" className="hover:text-brand">Accueil</Link>
            <span className="text-fg-subtle">/</span>
            <span className="font-semibold text-fg">Les parcours</span>
          </nav>
          <div className="flex flex-col justify-between gap-8 pb-10 lg:flex-row lg:items-end">
            <div className="max-w-3xl space-y-4">
              <span className="label-mono inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-brand">
                <span className="size-1.5 animate-pulse rounded-full bg-brand" aria-hidden /> Catalogue des formations
              </span>
              <h1 className="text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-fg sm:text-5xl">Les parcours de formation Cursus</h1>
              <p className="max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg">
                Des parcours complets et rigoureux : une théorie structurée, des exercices corrigés et une validation exigeante à
                chaque chapitre.
              </p>
            </div>
            <dl className="card flex shrink-0 items-center gap-6 p-4">
              <div>
                <dt className="label-mono text-fg-muted">Catalogue</dt>
                <dd className="text-lg font-bold text-fg">{all.length} parcours</dd>
              </div>
              <div className="h-8 w-px bg-border" aria-hidden />
              <div>
                <dt className="label-mono text-fg-muted">Seuil de validation</dt>
                <dd className="text-lg font-bold text-success">≥ {PASS_THRESHOLD} % exigé</dd>
              </div>
              <div className="hidden h-8 w-px bg-border sm:block" aria-hidden />
              <div className="hidden sm:block">
                <dt className="label-mono text-fg-muted">Disponibles</dt>
                <dd className="text-lg font-bold text-brand">{count("disponibles")}</dd>
              </div>
            </dl>
          </div>
          <div className="flex gap-1 overflow-x-auto rounded-2xl bg-bg-muted p-1.5 shadow-card" role="tablist" aria-label="Filtrer les parcours">
            {FILTERS.map((f) => {
              const active = filtre === f.key;
              return (
                <Link
                  key={f.key}
                  href={f.key === "tous" ? "/parcours" : `/parcours?filtre=${f.key}`}
                  role="tab"
                  aria-selected={active}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs transition ${
                    active ? "bg-bg-elevated font-semibold text-fg shadow-card" : "text-fg-muted hover:text-fg"
                  }`}
                >
                  {f.label}
                  <span className="flex size-5 items-center justify-center rounded-full bg-border text-[10px] font-bold text-fg">{count(f.key)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-20 sm:px-6 lg:px-12">
        <div className="flex flex-col gap-8">
          {parcours.map((p) => {
            const tone = parcoursTone(p.color);
            const published = p.status === "published";
            return (
              <article key={p.id} className="card relative flex flex-col overflow-hidden rounded-3xl transition hover:shadow-hover lg:flex-row">
                <div
                  className="h-1.5 w-full shrink-0 lg:h-auto lg:w-2"
                  style={{ background: published ? "linear-gradient(180deg, var(--brand), var(--success))" : tone.color, opacity: published ? 1 : 0.5 }}
                  aria-hidden
                />
                <div className="flex flex-1 flex-col gap-8 p-6 sm:p-8 lg:p-10">
                  <div>
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex size-12 items-center justify-center rounded-2xl"
                          style={published ? { background: "var(--brand)", color: "var(--brand-fg)" } : { background: tone.soft, color: tone.color }}
                        >
                          <ParcoursIcon icon={p.icon} className="size-6" />
                        </span>
                        <span
                          className={`label-mono rounded-md border px-2 py-1 normal-case ${
                            published ? "border-success-line bg-success-soft text-success" : "border-border bg-bg-muted text-fg-subtle"
                          }`}
                        >
                          {published ? "● Disponible" : "Bientôt disponible"}
                        </span>
                      </div>
                      <span className="label-mono text-fg-subtle">Niveau : {p.level}</span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-[-0.02em] text-fg sm:text-3xl">{p.title}</h2>
                    <p className="mt-3 max-w-3xl leading-relaxed text-fg-muted">{p.description}</p>
                  </div>
                  {published ? (
                    <>
                      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                          { label: "Modules", value: p.module_count, sub: "Progression séquentielle" },
                          { label: "Chapitres", value: p.chapter_count, sub: "Exercices et évaluation" },
                          { label: "Durée estimée", value: `~${Math.round(p.minutes / 60)} h`, sub: "À votre rythme" },
                          { label: "Validation", value: `${PASS_THRESHOLD} %`, sub: "Par chapitre" },
                        ].map((s) => (
                          <div key={s.label} className="rounded-xl border border-border bg-bg-muted/60 p-4">
                            <dt className="label-mono text-fg-muted">{s.label}</dt>
                            <dd className="mt-1 text-2xl font-bold tracking-tight text-fg">{s.value}</dd>
                            <dd className="mt-0.5 text-xs text-fg-subtle">{s.sub}</dd>
                          </div>
                        ))}
                      </dl>
                      <div className="flex flex-wrap items-center gap-3">
                        <Link
                          href={`/parcours/${p.slug}`}
                          className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-brand-fg transition hover:bg-brand-strong"
                        >
                          Découvrir le parcours <ArrowRight className="size-4" aria-hidden />
                        </Link>
                        <span className="flex items-center gap-1.5 text-xs text-fg-muted">
                          <CheckCircle2 className="size-4 text-success" aria-hidden /> Attestation délivrée après validation de tous les chapitres
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="flex items-center gap-2 rounded-xl border border-dashed border-border-strong bg-bg px-4 py-3 text-sm text-fg-muted">
                      <Hourglass className="size-4 shrink-0" aria-hidden /> Ce parcours est en préparation. Ses modules et chapitres seront
                      publiés dès qu&apos;ils seront prêts et vérifiés.
                    </p>
                  )}
                </div>
                {published && p.outcomes.length > 0 && (
                  <aside className="border-t border-border bg-bg-muted/50 p-6 sm:p-8 lg:w-[22rem] lg:shrink-0 lg:border-l lg:border-t-0">
                    <p className="label-mono text-brand">Vous saurez</p>
                    <ul className="mt-4 space-y-3">
                      {p.outcomes.map((o) => (
                        <li key={o} className="flex gap-2.5 text-sm leading-snug text-fg-muted">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden /> {o}
                        </li>
                      ))}
                    </ul>
                  </aside>
                )}
              </article>
            );
          })}
          {parcours.length === 0 && <p className="text-fg-muted">Aucun parcours dans cette catégorie.</p>}
        </div>
      </section>

      <section className="border-y border-border bg-bg-elevated/60">
        <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-12">
          <p className="label-mono text-brand">Modèle d&apos;apprentissage</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-[-0.025em] text-fg">Chaque parcours repose sur la même garantie pédagogique</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map(({ icon: Icon, label, title, text }) => (
              <div key={label} className="card p-6">
                <p className="label-mono text-fg-subtle">{label}</p>
                <Icon className="mt-4 size-6 text-brand" aria-hidden />
                <h3 className="mt-3 font-semibold text-fg">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pt-20 sm:px-6 lg:px-12">
        <p className="label-mono text-brand">Foire aux questions</p>
        <h2 className="mt-3 text-3xl font-bold tracking-[-0.025em] text-fg">Questions fréquentes</h2>
        <div className="mt-8 max-w-4xl space-y-3">
          {FAQ.map((item) => (
            <details key={item.q} className="group card overflow-hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-fg [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown className="size-5 shrink-0 text-fg-muted transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <p className="border-t border-border px-5 py-4 text-sm leading-relaxed text-fg-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
