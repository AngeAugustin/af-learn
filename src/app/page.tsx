import Link from "next/link";
import { ArrowRight, Check, Lock, Star, TriangleAlert } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getCourse, getPlatformStats, getSectionBody, listModuleTitles, listParcours, type ChapterView } from "@/lib/queries";
import { PASS_THRESHOLD } from "@/lib/quiz";
import { CHAPTER_DRAW } from "@/lib/memorisation";
import { extractSketchnoteSources, parseSketchnote, type SketchnoteSpec } from "@/lib/sketchnote";
import { parcoursTone } from "@/components/ui/parcours-icon";
import { MethodSketchnote } from "@/components/home/method-sketchnote";

export const dynamic = "force-dynamic";

const fr = (n: number) => n.toLocaleString("fr-FR");
const pad = (n: number) => String(n).padStart(2, "0");

/** Sigles affichés dans la pastille de chaque parcours. */
const SIGLES: Record<string, string> = {
  "ai-engineering": "IA",
  "data-engineering": "DE",
  cybersecurite: "SEC",
  "fullstack-vibe-coding": "DEV",
};

async function loadSketchnote(chapter: ChapterView | undefined): Promise<SketchnoteSpec | null> {
  const section = chapter?.sections.find((s) => s.is_sketchnote);
  if (!section) return null;
  try {
    const [source] = extractSketchnoteSources(await getSectionBody(section.id));
    return source ? parseSketchnote(source) : null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------
   Sketchnote : aperçu compact d'une vraie sketchnote
   ------------------------------------------------------------------ */
function SketchnotePreview({ spec }: { spec: SketchnoteSpec }) {
  return (
    <div className="sketchnote sketch-font relative rounded-md p-6 text-[var(--sketch-ink)] sm:-rotate-1 sm:p-8" aria-label={`Sketchnote : ${spec.title}`}>
      <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-28 -translate-x-1/2 rotate-2 bg-saffron/55" />
      <p className="text-center text-[28px] font-bold leading-tight sm:text-[30px]">{spec.title}</p>
      <p
        className="mx-auto mb-6 mt-4 max-w-md border-[2.5px] border-brand px-5 py-2.5 text-center text-xl leading-snug text-brand sm:text-[22px]"
        style={{ borderRadius: "48% 52% 46% 54% / 60% 44% 56% 40%" }}
      >
        {spec.center}
      </p>
      <div className="grid grid-cols-2 gap-x-5 gap-y-3.5 sm:grid-cols-3">
        {spec.points.map((p) => (
          <div key={p.title}>
            <p className="text-[22px] font-bold leading-none" style={{ color: "var(--tone-blue)" }}>
              <span className="text-brand">→ </span>
              {p.title}
            </p>
            <p className="mt-1 text-lg leading-tight">{p.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg px-3 py-2.5 text-lg leading-tight" style={{ background: "var(--tone-rose-soft)" }}>
          <p className="flex items-center gap-1.5 text-xl font-bold">
            <TriangleAlert className="size-4" aria-hidden /> Piège
          </p>
          {spec.pitfall}
        </div>
        <div className="rounded-lg px-3 py-2.5 text-lg leading-tight" style={{ background: "var(--tone-amber-soft)" }}>
          <p className="flex items-center gap-1.5 text-xl font-bold">
            <Star className="size-4" aria-hidden /> À retenir
          </p>
          {spec.remember}
        </div>
      </div>
    </div>
  );
}

const METHOD = [
  { n: "01", title: "Lire", text: "Des sections courtes, illustrées de schémas et de code vérifié.", key: "sections illustrées" },
  { n: "02", title: "Pratiquer", text: "Des exercices concrets avec des solutions détaillées à déplier.", key: "solutions repliables" },
  { n: "03", title: "Valider", text: `${CHAPTER_DRAW} questions tirées au hasard dans la banque du chapitre. ${PASS_THRESHOLD} % minimum pour continuer.`, key: `seuil ≥ ${PASS_THRESHOLD} %`, highlight: true },
  { n: "04", title: "Débloquer", text: "Le chapitre suivant s'ouvre. En fin de parcours : examen final, puis attestation.", key: "attestation imprimable" },
];

export default async function HomePage() {
  const [user, stats, parcours, moduleTitles, course] = await Promise.all([
    getCurrentUser(),
    getPlatformStats(),
    listParcours(),
    listModuleTitles(),
    getCourse("ai-engineering", null),
  ]);
  const primaryHref = user ? "/tableau-de-bord" : "/inscription";
  const published = parcours.filter((p) => p.status === "published");

  // Exemple du héros et de la sketchnote : un vrai chapitre du parcours AI Engineering
  const preview = course?.chapters.find((c) => c.slug === "recherche-vectorielle") ?? course?.chapters[2];
  const sketchnote = await loadSketchnote(preview);


  return (
    <>
      {/* Héros centré, puis la méthode en sketchnote */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle,color-mix(in_oklab,var(--fg)_14%,transparent)_1px,transparent_1.5px)] bg-[size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
        />
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 text-center sm:px-6 lg:pb-24 lg:pt-20">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-border bg-bg-elevated py-1.5 pl-1.5 pr-3 text-xs text-fg-muted">
            <span className="rounded-full bg-brand-soft px-2 py-0.5 font-mono text-brand">{published.length} parcours</span>
            IA · Data · Cybersécurité · Fullstack
          </p>
          <h1 className="mx-auto mt-6 max-w-4xl text-[2.5rem] font-bold leading-[1.03] tracking-[-0.045em] text-fg sm:text-6xl lg:text-[4.25rem]">
            Apprenez un métier du numérique.{" "}
            <em className="relative whitespace-nowrap not-italic text-brand">
              Prouvez-le
              <svg
                aria-hidden
                viewBox="0 0 200 14"
                preserveAspectRatio="none"
                className="absolute -bottom-[0.12em] left-[-2%] h-[0.2em] w-[104%] text-saffron"
              >
                <path d="M3 9 C 50 3, 120 2, 197 7" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M20 12 C 70 8, 130 8, 180 11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              </svg>
            </em>{" "}
            à chaque chapitre.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
            Lisez, pratiquez, puis validez une évaluation à {PASS_THRESHOLD} % pour débloquer la suite. Chaque chapitre ouvert est un chapitre
            maîtrisé.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={primaryHref}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-brand-fg shadow-sm transition hover:bg-brand-strong active:scale-[0.99]"
            >
              {user ? "Reprendre ma formation" : "Commencer gratuitement"}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <a
              href="#parcours"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-strong bg-bg-elevated px-5 py-3 text-sm font-semibold text-fg transition hover:bg-bg-muted"
            >
              Choisir un parcours
            </a>
          </div>
          <ul className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-fg-muted">
            {["Inscription gratuite", "Progression sauvegardée", "Attestation vérifiable"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="size-4 text-success" strokeWidth={3} aria-hidden /> {t}
              </li>
            ))}
          </ul>
          <div className="mt-14 text-left lg:mt-16">
            <MethodSketchnote />
          </div>
        </div>
      </section>

      {/* Parcours en lignes */}
      <section id="parcours" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-4 sm:px-6 lg:pb-24">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="label-mono text-brand">{published.length} parcours</p>
              <h2 className="mt-2.5 max-w-2xl text-3xl font-bold leading-tight tracking-[-0.035em] text-fg sm:text-4xl">
                Choisissez votre ligne. Chaque arrêt est un module.
              </h2>
            </div>
            <p className="max-w-sm text-[15px] leading-relaxed text-fg-muted">
              Même structure partout : modules, chapitres, exercices corrigés, sketchnote et évaluation à valider.
            </p>
          </div>
          <ul className="border-t border-border">
            {parcours.map((p) => {
              const tone = parcoursTone(p.color);
              const isPublished = p.status === "published";
              const modules = moduleTitles.filter((m) => m.parcours_id === p.id).map((m) => m.title);
              const sigle = SIGLES[p.slug] ?? p.title.slice(0, 2).toUpperCase();
              const row = (
                <>
                  <span
                    className="flex size-12 items-center justify-center rounded-[14px] font-mono text-sm font-semibold sm:size-14 sm:text-[15px]"
                    style={{ background: tone.soft, color: tone.color }}
                  >
                    {sigle}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold leading-tight tracking-[-0.025em] text-fg sm:text-[21px]">{p.title}</h3>
                    <p className="mt-1.5 font-mono text-[11.5px] text-fg-subtle">
                      {isPublished ? `${p.module_count} modules · ${p.chapter_count} chapitres · ≈ ${Math.round(p.minutes / 60)} h` : "En préparation"}
                    </p>
                  </div>
                  <div className="col-span-full row-start-2 min-w-0 md:col-span-1 md:col-start-3 md:row-start-1">
                    {modules.length > 1 && (
                      <>
                        <div className="relative flex items-center justify-between" aria-hidden>
                          <span className="absolute inset-x-1.5 h-1 rounded-full" style={{ background: tone.color, opacity: isPublished ? 0.9 : 0.35 }} />
                          {modules.map((title, i) => (
                            <span
                              key={title}
                              title={title}
                              className={`relative rounded-full border-[3px] ${i === modules.length - 1 ? "size-5" : "size-3.5 bg-bg"}`}
                              style={{
                                borderColor: tone.color,
                                ...(i === modules.length - 1 ? { background: tone.color, boxShadow: `0 0 0 4px ${tone.soft}` } : {}),
                              }}
                            />
                          ))}
                        </div>
                        <div className="mt-2 flex justify-between gap-4 font-mono text-[10.5px] text-fg-subtle">
                          <span className="truncate">{modules[0]}</span>
                          <span className="truncate text-right">{modules[modules.length - 1]}</span>
                        </div>
                      </>
                    )}
                    <p className="mt-3 text-[13px] leading-relaxed text-fg-muted">{p.tagline}</p>
                  </div>
                  <span
                    className="flex size-11 items-center justify-center rounded-full border border-border-strong text-fg transition group-hover:translate-x-1 group-hover:border-[var(--tone)] group-hover:bg-[var(--tone)] group-hover:text-white"
                    aria-hidden
                  >
                    {isPublished ? <ArrowRight className="size-4" /> : <Lock className="size-4" />}
                  </span>
                </>
              );
              const className =
                "group grid grid-cols-[48px_1fr_auto] items-center gap-x-4 gap-y-5 border-b border-border py-7 sm:grid-cols-[56px_1fr_auto] sm:gap-x-6 md:grid-cols-[56px_1.1fr_1.4fr_auto] md:gap-x-7";
              return (
                <li key={p.id} style={{ ["--tone" as string]: tone.color }}>
                  {isPublished ? (
                    <Link href={`/parcours/${p.slug}`} className={`${className} transition hover:bg-[linear-gradient(90deg,transparent,var(--bg-elevated)_20%,var(--bg-elevated)_80%,transparent)]`}>
                      {row}
                    </Link>
                  ) : (
                    <div className={`${className} opacity-70`}>{row}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Méthode */}
      <section id="methode" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-[20px] bg-[var(--code-bg)] px-6 py-11 text-[#eef2ea] sm:rounded-[28px] sm:px-14 sm:py-16">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-36 -top-40 size-[420px] rounded-full bg-[radial-gradient(circle,rgba(225,188,41,0.22),transparent_65%)]"
            />
            <div className="relative mb-11 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="label-mono text-saffron">La méthode</p>
                <h2 className="mt-2.5 max-w-2xl text-3xl font-bold leading-tight tracking-[-0.035em] text-white sm:text-4xl">
                  Quatre temps par chapitre. Le troisième ne se négocie pas.
                </h2>
              </div>
              <p className="max-w-sm text-[15px] leading-relaxed text-[#a5b0a1]">
                Tentatives illimitées, nouveau tirage à chaque essai, correction côté serveur, puis révisions espacées.
              </p>
            </div>
            <ol className="relative grid gap-x-0 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
              {METHOD.map((m, i) => (
                <li key={m.n} className="pr-6">
                  <p className="flex items-center gap-2.5 font-mono text-xs text-[#75816f]">
                    {m.n}
                    <span
                      aria-hidden
                      className="h-px flex-1"
                      style={{
                        background: i === METHOD.length - 1 ? "repeating-linear-gradient(90deg,#354c31 0 6px,transparent 6px 12px)" : "#354c31",
                      }}
                    />
                  </p>
                  <h3 className={`mb-2.5 mt-5 text-[26px] font-semibold tracking-[-0.03em] ${m.highlight ? "text-saffron" : "text-white"}`}>{m.title}</h3>
                  <p className="text-sm leading-relaxed text-[#a5b0a1]">{m.text}</p>
                  <span
                    className={`mt-4 inline-block rounded-md border px-2.5 py-1 font-mono text-[11px] ${
                      m.highlight ? "border-saffron/40 bg-saffron/10 text-saffron" : "border-[#354c31] bg-white/5 text-[#d7ded3]"
                    }`}
                  >
                    {m.key}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Sketchnote */}
      {sketchnote && preview && (
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 lg:py-24">
          <div>
            <p className="label-mono text-brand">Avant chaque évaluation</p>
            <h2 className="mb-4 mt-2.5 text-3xl font-bold leading-tight tracking-[-0.035em] text-fg sm:text-4xl">
              Tout le chapitre sur une page dessinée.
            </h2>
            <p className="leading-relaxed text-fg-muted">
              Chaque chapitre se termine par une sketchnote : l&apos;idée centrale, les points clés, le piège à éviter et la phrase à
              retenir.
            </p>
            <ul className="my-6 grid gap-2.5 text-sm text-fg">
              {[
                `${fr(stats?.sketchnotes ?? stats?.chapters ?? 0)} sketchnotes, une par chapitre`,
                "Téléchargeables en PDF A4",
                "Pensées pour la révision éclair",
              ].map((t, i) => (
                <li key={t} className="flex gap-2.5">
                  <span className="font-mono text-brand">{pad(i + 1)}</span>
                  {t}
                </li>
              ))}
            </ul>
            <Link
              href={`/parcours/ai-engineering/${preview.moduleSlug}/${preview.slug}`}
              className="inline-flex items-center gap-2 rounded-lg border border-border-strong bg-bg-elevated px-5 py-3 text-sm font-semibold text-fg transition hover:bg-bg-muted"
            >
              Voir ce chapitre <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <SketchnotePreview spec={sketchnote} />
        </section>
      )}

      {/* Chiffres */}
      {stats && (
        <section className={`mx-auto max-w-6xl px-4 sm:px-6 ${sketchnote ? "" : "pt-20"}`}>
          <dl className="grid grid-cols-2 overflow-hidden rounded-[20px] border border-border bg-bg-elevated lg:grid-cols-4">
            {[
              [fr(stats.chapters), "chapitres"],
              [fr(stats.sections), "sections"],
              [fr(stats.questions), "questions d'évaluation"],
              [`≈ ${fr(Math.round(stats.minutes / 60))} h`, "de formation"],
            ].map(([value, label], i) => (
              <div
                key={label}
                className={`p-5 sm:p-7 ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b lg:border-b-0" : ""} border-border lg:border-r lg:last:border-r-0`}
              >
                <dd className="text-[34px] font-bold leading-none tracking-[-0.04em] text-fg sm:text-[44px]">{value}</dd>
                <dt className="mt-2.5 font-mono text-xs text-fg-muted">{label}</dt>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Appel final */}
      <section className="mx-auto max-w-6xl px-4 pb-6 pt-20 text-center sm:px-6 lg:pt-24">
        <h2 className="mx-auto max-w-3xl text-4xl font-bold leading-[1.04] tracking-[-0.045em] text-fg sm:text-[3.5rem]">
          {user ? (
            <>
              Votre prochain chapitre vous <em className="not-italic text-brand">attend</em>.
            </>
          ) : (
            <>
              Votre premier chapitre se valide <em className="not-italic text-brand">aujourd&apos;hui</em>.
            </>
          )}
        </h2>
        <p className="mt-4 text-fg-muted">{user ? "Reprenez votre parcours là où vous l'avez laissé." : "Créez un compte gratuit, lisez, pratiquez, validez."}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={primaryHref}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-brand-fg shadow-sm transition hover:bg-brand-strong active:scale-[0.99]"
          >
            {user ? "Accéder à mon tableau de bord" : "Commencer gratuitement"} <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link
            href="/parcours"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-strong bg-bg-elevated px-5 py-3 text-sm font-semibold text-fg transition hover:bg-bg-muted"
          >
            Voir le catalogue
          </Link>
        </div>
      </section>
    </>
  );
}
