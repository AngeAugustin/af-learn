import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, Brain, Hammer, ShieldCheck } from "lucide-react";
import { Fill, PageHeader } from "@/components/layout/static-page";
import { getPlatformStats, listParcours } from "@/lib/queries";
import { PASS_THRESHOLD } from "@/lib/quiz";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "À propos",
  description: "Pourquoi Cursus existe, comment les parcours sont conçus et qui est derrière la plateforme.",
};

export const dynamic = "force-dynamic";

const fr = (n: number) => n.toLocaleString("fr-FR");

const PRINCIPLES = [
  {
    icon: Hammer,
    title: "La pratique d’abord",
    text: "Chaque chapitre se termine par des exercices concrets, tirés de situations réelles, avec des solutions détaillées.",
  },
  {
    icon: BookOpenCheck,
    title: "Une validation exigeante",
    text: `On ne passe au chapitre suivant qu’après avoir réussi son évaluation avec au moins ${PASS_THRESHOLD} %. Pas de case cochée par défaut.`,
  },
  {
    icon: Brain,
    title: "Retenir sur la durée",
    text: "Les questions validées reviennent en révision espacée (J+1, J+7, J+30, J+90) pour ancrer ce qui a été appris.",
  },
  {
    icon: ShieldCheck,
    title: "Des attestations vérifiables",
    text: "Chaque attestation porte un identifiant unique et un QR code. N’importe quel recruteur peut en vérifier l’authenticité.",
  },
];

export default async function AboutPage() {
  const [stats, parcours] = await Promise.all([
    getPlatformStats().catch(() => null),
    listParcours().catch(() => []),
  ]);
  const published = parcours.filter((p) => p.status === "published").length;

  return (
    <>
      <PageHeader
        eyebrow="À propos"
        title="Apprendre un métier du numérique, pas seulement le survoler."
        intro={`${SITE.name} propose des parcours complets et structurés pour passer de la théorie à la pratique professionnelle, avec une validation réelle à chaque étape.`}
      />

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-14 sm:px-6 lg:py-20">
        {/* Mission */}
        <section className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="label-mono text-brand">Notre mission</p>
            <h2 className="mt-2.5 text-2xl font-bold tracking-[-0.03em] text-fg sm:text-3xl">
              Rendre la formation technique sérieuse accessible à tous.
            </h2>
          </div>
          <div className="space-y-4 text-[16px] leading-relaxed text-fg-muted">
            <p>
              Beaucoup de contenus en ligne enchaînent les vidéos sans jamais vérifier ce qui a été compris. Nous avons fait le choix
              inverse : des textes clairs, des schémas, du code vérifié, des exercices corrigés et une évaluation à réussir avant
              d’avancer.
            </p>
            <p>
              Chaque parcours suit la même structure, de la fondation jusqu’au projet final, pour que vous sachiez toujours où vous en
              êtes et ce qu’il reste à maîtriser.
            </p>
          </div>
        </section>

        {/* Chiffres */}
        {stats && (
          <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              [fr(published), published > 1 ? "parcours publiés" : "parcours publié"],
              [fr(stats.chapters), "chapitres"],
              [fr(stats.questions), "questions d’évaluation"],
              [`≈ ${fr(Math.round(stats.minutes / 60))} h`, "de formation"],
            ].map(([value, label]) => (
              <div key={label} className="card p-5">
                <p className="text-3xl font-bold tracking-[-0.04em] text-fg">{value}</p>
                <p className="label-mono mt-2 text-fg-subtle">{label}</p>
              </div>
            ))}
          </section>
        )}

        {/* Principes */}
        <section>
          <p className="label-mono text-brand">Nos principes</p>
          <h2 className="mt-2.5 text-2xl font-bold tracking-[-0.03em] text-fg sm:text-3xl">Ce qui guide la conception des parcours</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card p-6">
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-fg">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Équipe */}
        <section className="card grid gap-6 p-6 sm:p-8 md:grid-cols-[auto_1fr] md:items-center">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-brand text-xl font-bold text-brand-fg">C</span>
          <div>
            <p className="label-mono text-brand">Derrière {SITE.name}</p>
            <p className="mt-2 leading-relaxed text-fg-muted">
              <Fill value="[À COMPLÉTER : quelques lignes sur vous ou l'équipe, votre parcours et pourquoi vous avez créé Cursus]" />
            </p>
          </div>
        </section>

        {/* Appel à l'action */}
        <section className="flex flex-col items-start justify-between gap-6 border-t border-border pt-10 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-fg">Prêt à commencer ?</h2>
            <p className="mt-1 text-sm text-fg-muted">Une question avant de vous lancer ? Consultez la FAQ ou écrivez-nous.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/faq"
              className="rounded-lg border border-border bg-bg-elevated px-4 py-2.5 text-sm font-semibold text-fg transition hover:border-brand hover:text-brand"
            >
              Lire la FAQ
            </Link>
            <Link
              href="/parcours"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg transition hover:bg-brand-strong"
            >
              Voir les parcours <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
