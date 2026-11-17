import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenText, ChevronDown, ClipboardCheck, Code2, Award } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getPassedChaptersByParcours, listParcours } from "@/lib/queries";
import { PASS_THRESHOLD } from "@/lib/quiz";
import { CourseCard } from "@/components/catalog/course-card";

export const metadata: Metadata = { title: "Parcours" };
export const dynamic = "force-dynamic";

/** Identifiant d'URL d'un domaine : « Sécurité » devient « securite ». */
const domainKey = (d: string) =>
  d
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

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

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ domaine?: string; filtre?: string }> }) {
  const { domaine, filtre } = await searchParams;
  const [all, user] = await Promise.all([listParcours(), getCurrentUser()]);
  const passed = user ? await getPassedChaptersByParcours(user.id) : new Map<number, number>();
  const comingSoon = all.filter((p) => p.status === "coming_soon").length;

  // Pastilles de filtre : tous, un par domaine (dans l'ordre du catalogue), puis « bientôt » s'il y en a.
  const domains = [...new Map(all.filter((p) => p.domain).map((p) => [domainKey(p.domain), p.domain])).entries()];
  const filters = [
    { key: "", label: "Tous", count: all.length },
    ...domains.map(([key, label]) => ({ key, label, count: all.filter((p) => domainKey(p.domain) === key).length })),
    ...(comingSoon ? [{ key: "bientot", label: "Bientôt disponibles", count: comingSoon }] : []),
  ];
  const active = filtre === "bientot" ? "bientot" : domains.some(([k]) => k === domaine) ? domaine! : "";
  const parcours = all.filter((p) =>
    active === "bientot" ? p.status === "coming_soon" : active ? domainKey(p.domain) === active : true,
  );

  // Étiquette « Le plus complet » : le parcours publié qui compte le plus de chapitres.
  const published = all.filter((p) => p.status === "published");
  const richest = published.reduce<(typeof all)[number] | null>((best, p) => (!best || p.chapter_count > best.chapter_count ? p : best), null);

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
                <dd className="text-lg font-bold text-brand">{published.length}</dd>
              </div>
            </dl>
          </div>
          <nav className="flex flex-wrap items-center justify-between gap-3" aria-label="Filtrer les parcours">
            <ul className="flex gap-2 overflow-x-auto pb-1">
              {filters.map((f) => {
                const isActive = active === f.key;
                const href = f.key === "" ? "/parcours" : f.key === "bientot" ? "/parcours?filtre=bientot" : `/parcours?domaine=${f.key}`;
                return (
                  <li key={f.key || "tous"} className="shrink-0">
                    <Link
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                        isActive ? "border-fg bg-fg text-bg" : "border-border-strong bg-bg-elevated text-fg-muted hover:border-fg hover:text-fg"
                      }`}
                    >
                      {f.label}
                      <span className={`text-xs tabular-nums ${isActive ? "opacity-70" : "text-fg-subtle"}`}>{f.count}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p className="text-sm text-fg-muted">
              {parcours.length} résultat{parcours.length > 1 ? "s" : ""} · gratuits, attestation vérifiable à la clé
            </p>
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-20 sm:px-6 lg:px-12">
        {parcours.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {parcours.map((p) => (
              <li key={p.id}>
                <CourseCard course={p} badge={p.id === richest?.id && published.length > 1 ? "Le plus complet" : undefined} passed={passed.get(p.id)} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-fg-muted">Aucun parcours dans cette catégorie.</p>
        )}
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
