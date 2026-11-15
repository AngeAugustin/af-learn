import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Award,
  BookOpen,
  PenLine,
  CheckCircle2,
  Clock,
  Layers,
  Lock,
  Play,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getCourse, type ChapterView, type ModuleView } from "@/lib/queries";
import { getExamSummaries } from "@/lib/memorisation-queries";
import { percent } from "@/lib/progress";
import { PASS_THRESHOLD } from "@/lib/quiz";
import { ChapterStatusBadge } from "@/components/ui/chapter-status";
import { ProgressBar, ProgressRing } from "@/components/ui/progress";
import { ParcoursIcon, parcoursTone } from "@/components/ui/parcours-icon";

type Params = { parcours: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const course = await getCourse((await params).parcours, null);
  // Un parcours masqué ne doit pas révéler son titre dans les métadonnées.
  if (!course || course.parcours.status === "hidden") return { title: "Parcours", robots: { index: false } };
  return { title: course.parcours.title, description: course.parcours.tagline };
}

const pad = (n: number) => String(n).padStart(2, "0");

function moduleStatus(m: ModuleView): { label: string; className: string } {
  const passed = m.chapters.filter((c) => c.passed).length;
  if (passed === m.chapters.length) return { label: "✓ Validé · 100 %", className: "border-success-line bg-success-soft text-success" };
  if (m.chapters.every((c) => c.state === "locked")) return { label: "Verrouillé", className: "border-dashed border-border-strong bg-bg text-fg-subtle" };
  return { label: `● Progression · ${percent(passed, m.chapters.length)} %`, className: "border-brand-line bg-brand-soft text-brand" };
}

function ChapterRow({
  chapter,
  moduleIndex,
  href,
  current,
  showStatus,
}: {
  chapter: ChapterView;
  moduleIndex: number;
  href: string | null;
  current: boolean;
  showStatus: boolean;
}) {
  const inner = (
    <div
      className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 transition ${
        current
          ? "border-brand bg-brand text-brand-fg shadow-hover"
          : "border-border bg-bg-elevated hover:border-brand-line hover:bg-bg-muted/60"
      }`}
    >
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
          current ? "bg-white/20" : chapter.passed ? "bg-success-soft text-success" : "bg-bg-muted text-fg-subtle"
        }`}
      >
        {current ? (
          <Play className="size-4" aria-hidden />
        ) : chapter.passed ? (
          <CheckCircle2 className="size-4" aria-hidden />
        ) : chapter.state === "locked" && showStatus ? (
          <Lock className="size-4" aria-hidden />
        ) : (
          <BookOpen className="size-4" aria-hidden />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-semibold ${current ? "text-brand-fg" : "text-fg"}`}>
          Chapitre {moduleIndex + 1}.{chapter.position + 1} : {chapter.title}
        </p>
        <p className={`mt-0.5 font-mono text-[11px] ${current ? "text-brand-fg/80" : "text-fg-subtle"}`}>
          {chapter.sections.length} sections · {chapter.duration_minutes} min · {chapter.questionCount} questions
        </p>
      </div>
      {showStatus &&
        (current ? (
          <span className="label-mono shrink-0 rounded-md bg-white px-2 py-1 normal-case text-brand">En cours</span>
        ) : (
          <span className="hidden sm:block">
            <ChapterStatusBadge state={chapter.state} bestScore={chapter.bestScore} />
          </span>
        ))}
    </div>
  );
  return <li>{href ? <Link href={href}>{inner}</Link> : inner}</li>;
}

export default async function ParcoursPage({ params }: { params: Promise<Params> }) {
  const { parcours: slug } = await params;
  const user = await getCurrentUser();
  const course = await getCourse(slug, user?.id ?? null);
  if (!course) notFound();
  const { parcours, modules, chapters, totals } = course;
  const tone = parcoursTone(parcours.color);

  const adminPreview = parcours.status === "hidden" && user?.role === "admin";
  if (parcours.status === "hidden" && !adminPreview) notFound();

  if (parcours.status === "coming_soon") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl" style={{ background: tone.soft, color: tone.color }}>
          <ParcoursIcon icon={parcours.icon} className="size-7" />
        </span>
        <span className="label-mono mt-6 inline-block rounded-md border border-border bg-bg-muted px-2.5 py-1 normal-case text-fg-subtle">
          Bientôt disponible
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-fg">{parcours.title}</h1>
        <p className="mt-3 leading-relaxed text-fg-muted">{parcours.description}</p>
        <Link href="/parcours" className="mt-8 inline-flex items-center gap-2 font-semibold text-brand hover:underline">
          Voir les parcours disponibles <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    );
  }

  const progress = percent(totals.passed, totals.chapters);
  const current = user ? chapters.find((c) => c.state === "in_progress" || c.state === "available") ?? null : null;
  const currentModuleIndex = current ? modules.findIndex((m) => m.id === current.module_id) : -1;
  const completed = totals.chapters > 0 && totals.passed === totals.chapters;
  const finalPassed =
    completed && user ? (await getExamSummaries(user.id, parcours.id)).some((e) => e.module_id === null && e.passed) : false;
  const passedScores = chapters.filter((c) => c.passed && c.bestScore !== null).map((c) => c.bestScore!);
  const average = passedScores.length ? Math.round(passedScores.reduce((a, b) => a + b, 0) / passedScores.length) : null;
  const chapterHref = (c: ChapterView) => `/parcours/${parcours.slug}/${c.moduleSlug}/${c.slug}`;
  const firstChapter = chapters[0];
  // Modules entièrement verrouillés : affichés en liste compacte, comme dans la maquette
  const openModules = user ? modules.filter((m) => m.chapters.some((c) => c.state !== "locked")) : modules;
  const lockedModules = user ? modules.filter((m) => m.chapters.every((c) => c.state === "locked")) : [];

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-12">
      {adminPreview && (
        <p role="status" className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-fg">
          <span className="font-semibold">Aperçu administrateur : ce parcours est masqué.</span>
          <span className="text-fg-muted">Seuls les administrateurs le voient.</span>
          <Link href={`/admin/catalogue/${parcours.slug}`} className="font-semibold text-brand hover:underline">
            Gérer dans le back office
          </Link>
        </p>
      )}
      <nav aria-label="Fil d'Ariane" className="mb-5 flex items-center gap-2 font-mono text-[11px] text-fg-muted">
        <Link href="/" className="hover:text-brand">Accueil</Link>
        <span className="text-fg-subtle">/</span>
        <Link href="/parcours" className="hover:text-brand">Parcours</Link>
        <span className="text-fg-subtle">/</span>
        <span className="font-semibold text-fg">{parcours.title}</span>
      </nav>

      {/* En-tête */}
      <header className="card relative overflow-hidden rounded-3xl p-6 sm:p-10">
        <div className="hero-glow pointer-events-none absolute inset-0 opacity-80" aria-hidden />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-brand text-brand-fg shadow-hover">
            <ParcoursIcon icon={parcours.icon} className="size-8" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              <span className="label-mono inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-elevated px-2.5 py-1 text-fg">
                <span className={`size-1.5 rounded-full ${adminPreview ? "bg-danger" : "bg-success"}`} aria-hidden /> {adminPreview ? "Parcours masqué" : "Parcours disponible"}
              </span>
              <span className="label-mono rounded-md border border-success-line bg-success-soft px-2.5 py-1 text-success">
                Validation {PASS_THRESHOLD} % par chapitre
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-[-0.03em] text-fg sm:text-4xl lg:text-5xl">{parcours.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-fg-muted sm:text-lg">{parcours.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { icon: Clock, text: `≈ ${Math.round(totals.minutes / 60)} heures de formation` },
                { icon: Layers, text: `${modules.length} modules · ${totals.chapters} chapitres · ${totals.sections} sections` },
                { icon: Target, text: `${totals.questions} questions notées` },
                { icon: TrendingUp, text: `Niveau ${parcours.level.toLowerCase()}` },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-elevated px-3 py-1.5 font-mono text-[11px] text-fg-muted">
                  <Icon className="size-3.5 text-brand" aria-hidden /> {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {!user && (
        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-success-line bg-success-soft p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-success text-white">
              <UserPlus className="size-5" aria-hidden />
            </span>
            <div>
              <p className="font-semibold text-fg">Inscription gratuite, accès immédiat au premier chapitre</p>
              <p className="text-sm text-fg-muted">Créez votre compte pour enregistrer votre progression et passer les évaluations.</p>
            </div>
          </div>
          <Link
            href={`/inscription?suivant=${encodeURIComponent(firstChapter ? chapterHref(firstChapter) : `/parcours/${parcours.slug}`)}`}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-success px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Commencer le parcours <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
        {/* Programme */}
        <div className="min-w-0 space-y-5">
          <div>
            <h2 className="text-2xl font-bold tracking-[-0.02em] text-fg">Programme ({modules.length} modules)</h2>
            <p className="mt-1 text-sm text-fg-muted">
              Progression séquentielle : chaque chapitre se débloque après validation du précédent ({PASS_THRESHOLD} % minimum).
            </p>
          </div>
          {openModules.map((m) => {
            const mi = modules.findIndex((x) => x.id === m.id);
            const passed = m.chapters.filter((c) => c.passed).length;
            const status = moduleStatus(m);
            const isCurrentModule = mi === currentModuleIndex;
            return (
              <section
                key={m.id}
                className={`card p-5 sm:p-6 ${isCurrentModule ? "border-brand-line shadow-hover" : ""}`}
                aria-labelledby={`module-${m.id}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="label-mono text-brand">
                    Module {pad(mi + 1)}
                    {user && ` · ${passed === m.chapters.length ? "Validé" : isCurrentModule ? "En cours" : "Disponible"}`}
                  </p>
                  {user ? (
                    <span className={`label-mono rounded-md border px-2.5 py-1 normal-case ${status.className}`}>{status.label}</span>
                  ) : (
                    <span className="label-mono rounded-md border border-border bg-bg-muted px-2.5 py-1 normal-case text-fg-muted">
                      {m.chapters.length} chapitres
                    </span>
                  )}
                </div>
                <h3 id={`module-${m.id}`} className="mt-2 text-lg font-bold leading-snug tracking-tight text-fg">{m.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-fg-muted">{m.description}</p>
                {user && <ProgressBar value={percent(passed, m.chapters.length)} className="mt-4" label={`Module ${mi + 1}`} />}
                <ol className={user ? "mt-4 space-y-2" : "mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2"}>
                  {m.chapters.map((c) => (
                    <ChapterRow
                      key={c.id}
                      chapter={c}
                      moduleIndex={mi}
                      current={current?.id === c.id}
                      showStatus={Boolean(user)}
                      href={user ? (c.state === "locked" ? null : chapterHref(c)) : c.global_position === 0 ? chapterHref(c) : null}
                    />
                  ))}
                </ol>
              </section>
            );
          })}
          {lockedModules.length > 0 && (
            <div>
              <p className="label-mono mb-3 mt-8 text-fg-muted">Modules suivants</p>
              <ol className="space-y-2.5">
                {lockedModules.map((m) => {
                  const mi = modules.findIndex((x) => x.id === m.id);
                  return (
                    <li key={m.id} className="card flex items-start gap-3 p-4">
                      <Lock className="mt-0.5 size-4 shrink-0 text-fg-subtle" aria-hidden />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-fg">
                          Module {pad(mi + 1)} : {m.title}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-fg-muted">{m.description}</p>
                      </div>
                      <span className="label-mono hidden shrink-0 rounded-md border border-dashed border-border-strong px-2 py-1 normal-case text-fg-subtle sm:block">
                        {m.chapters.length} chap. · Verrouillé
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>

        {/* Colonne latérale */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          {user ? (
            <div className="card p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-fg">Votre progression</h2>
                <span className="label-mono rounded-md bg-bg-muted px-2 py-1 text-fg-muted">{completed ? "Terminé" : "Actif"}</span>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <ProgressRing value={progress} size={84} label="Chapitres validés" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-fg">
                    {totals.passed} / {totals.chapters} chapitres validés
                  </p>
                  <p className="font-mono text-[11px] text-fg-muted">
                    {totals.completedSections} / {totals.sections} sections lues
                  </p>
                  {average !== null && <p className="font-mono text-[11px] text-fg-muted">Score moyen : {average} %</p>}
                </div>
              </div>
              {completed ? (
                <div className="mt-5 space-y-2">
                  <Link
                    href={finalPassed ? `/certificat/${parcours.slug}` : `/examens/${parcours.slug}/final`}
                    className="flex items-center justify-center gap-2 rounded-lg bg-success px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    <Award className="size-4" aria-hidden /> {finalPassed ? "Voir mon attestation" : "Passer l’examen final"}
                  </Link>
                  <Link
                    href={`/parcours/${parcours.slug}/synthese`}
                    className="flex items-center justify-center gap-2 rounded-lg border border-border bg-bg-elevated px-4 py-2.5 text-sm font-semibold text-fg transition hover:border-brand-line hover:text-brand"
                  >
                    <PenLine className="size-4" aria-hidden /> Sketchnotes du parcours (PDF)
                  </Link>
                </div>
              ) : (
                current && (
                  <>
                    <Link
                      href={chapterHref(current)}
                      className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg transition hover:bg-brand-strong"
                    >
                      {totals.completedSections > 0 ? "Continuer le parcours" : "Commencer le parcours"} <ArrowRight className="size-4" aria-hidden />
                    </Link>
                    <div className="mt-3 rounded-lg bg-bg-muted px-3 py-2.5">
                      <p className="label-mono text-fg-subtle">Reprise directe</p>
                      <p className="mt-1 truncate text-xs font-medium text-brand">
                        Module {pad(currentModuleIndex + 1)} · {current.title}
                      </p>
                    </div>
                  </>
                )
              )}
            </div>
          ) : (
            <div className="card p-5">
              <p className="label-mono flex items-center gap-1.5 text-brand">
                <Sparkles className="size-3.5" aria-hidden /> Démarrage immédiat
              </p>
              <h2 className="mt-2 text-lg font-bold text-fg">Commencer ce parcours</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                Créez votre compte gratuitement pour débuter le premier chapitre et suivre votre progression.
              </p>
              <Link
                href={`/inscription?suivant=${encodeURIComponent(firstChapter ? chapterHref(firstChapter) : `/parcours/${parcours.slug}`)}`}
                className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-brand-fg transition hover:bg-brand-strong"
              >
                Créer mon compte et commencer <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href={`/connexion?suivant=/parcours/${parcours.slug}`}
                className="mt-2 flex items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-fg transition hover:bg-bg-muted"
              >
                Déjà un compte ? Se connecter
              </Link>
              <ul className="mt-5 space-y-2 text-xs text-fg-muted">
                {["Inscription gratuite", "Aucun moyen de paiement demandé", "Progression enregistrée automatiquement"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-success" aria-hidden /> {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl border border-brand-line bg-brand-soft p-5">
            <p className="label-mono flex items-center gap-1.5 text-brand">
              <ShieldCheck className="size-4" aria-hidden /> Règle de validation
            </p>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              Seuil strict de {PASS_THRESHOLD} % requis à l&apos;évaluation de chaque chapitre (11 bonnes réponses sur 14, par exemple) pour débloquer le chapitre
              suivant. Tentatives illimitées.
            </p>
          </div>

          <div className="card p-5">
            <h2 className="flex items-center gap-2 font-semibold text-fg">
              <Target className="size-4 text-brand" aria-hidden /> Ce que vous saurez faire
            </h2>
            <ul className="mt-4 space-y-3">
              {parcours.outcomes.map((o) => (
                <li key={o} className="flex gap-2.5 text-sm leading-snug text-fg-muted">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden /> {o}
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <h2 className="font-semibold text-fg">Prérequis recommandés</h2>
            <ul className="mt-4 space-y-2">
              {parcours.prerequisites.map((p) => (
                <li key={p} className="rounded-lg border border-border bg-bg-muted/60 px-3 py-2.5 text-sm leading-snug text-fg-muted">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
