import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/layout/static-page";
import { CHAPTER_DRAW, FINAL_EXAM_SIZE, MODULE_EXAM_SIZE, REVIEW_BATCH } from "@/lib/memorisation";
import { PASS_THRESHOLD } from "@/lib/quiz";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description: "Tout savoir sur les parcours, les évaluations, les révisions, les attestations et votre compte Cursus.",
};

type Item = { q: string; a: ReactNode };
const link = (href: string, label: string) => (
  <Link href={href} className="font-medium text-brand hover:underline">
    {label}
  </Link>
);

const GROUPS: { title: string; items: Item[] }[] = [
  {
    title: "Démarrer",
    items: [
      {
        q: `${SITE.name} est-il gratuit ?`,
        a: <>Oui. La création d’un compte et l’accès aux parcours publiés sont gratuits.</>,
      },
      {
        q: "Faut-il un compte pour suivre un parcours ?",
        a: (
          <>
            Un compte est nécessaire pour enregistrer votre progression, passer les évaluations, accéder aux révisions et obtenir une
            attestation. {link("/inscription", "Créer un compte")} prend moins d’une minute.
          </>
        ),
      },
      {
        q: "Quels prérequis faut-il avoir ?",
        a: (
          <>
            Chaque parcours indique ses prérequis et son niveau sur sa page de présentation. Les premiers modules posent les
            fondations nécessaires à la suite. {link("/parcours", "Voir les parcours")}.
          </>
        ),
      },
      {
        q: "Combien de temps faut-il pour terminer un parcours ?",
        a: (
          <>
            Chaque chapitre affiche une durée estimée. Vous avancez à votre rythme : il n’y a ni date limite ni session à suivre en
            direct.
          </>
        ),
      },
    ],
  },
  {
    title: "Évaluations et révisions",
    items: [
      {
        q: "Comment fonctionne l’évaluation d’un chapitre ?",
        a: (
          <>
            À la fin de chaque chapitre, {CHAPTER_DRAW} questions sont tirées au hasard dans la banque du chapitre. Le chapitre est
            validé à partir de {PASS_THRESHOLD} % de bonnes réponses, ce qui débloque le suivant.
          </>
        ),
      },
      {
        q: "Que se passe-t-il si j’échoue ?",
        a: (
          <>
            Rien de grave : les tentatives sont illimitées et un nouveau tirage de questions est fait à chaque essai. La correction
            détaillée vous aide à revoir les points manqués avant de réessayer.
          </>
        ),
      },
      {
        q: "À quoi servent les examens de module et l’examen final ?",
        a: (
          <>
            L’examen de module ({MODULE_EXAM_SIZE} questions) vérifie que vous maîtrisez l’ensemble d’un module. L’examen final (
            {FINAL_EXAM_SIZE} questions) couvre tout le parcours et conditionne la délivrance de l’attestation.
          </>
        ),
      },
      {
        q: "Comment fonctionnent les révisions ?",
        a: (
          <>
            Les questions des chapitres validés reviennent à intervalles croissants : le lendemain, puis à 7, 30 et 90 jours. Une
            erreur ramène la question au début du cycle. Chaque séance comporte au plus {REVIEW_BATCH} questions. Retrouvez-les dans{" "}
            {link("/revisions", "Révisions")}.
          </>
        ),
      },
    ],
  },
  {
    title: "Attestations",
    items: [
      {
        q: "Comment obtenir une attestation ?",
        a: (
          <>
            Validez tous les chapitres du parcours puis réussissez l’examen final. L’attestation est alors disponible depuis votre{" "}
            {link("/tableau-de-bord", "tableau de bord")}, imprimable et téléchargeable.
          </>
        ),
      },
      {
        q: "L’attestation a-t-elle une valeur officielle ?",
        a: (
          <>
            C’est une attestation de réussite délivrée par {SITE.name}, pas un diplôme d’État ni une certification RNCP. Elle
            prouve que vous avez réussi des évaluations exigeantes et peut être vérifiée en ligne.
          </>
        ),
      },
      {
        q: "Comment un recruteur peut-il vérifier mon attestation ?",
        a: (
          <>
            En scannant le QR code ou en saisissant l’identifiant imprimé sur l’attestation dans la page{" "}
            {link("/verifier", "Vérifier une attestation")}.
          </>
        ),
      },
      {
        q: "Le nom sur mon attestation est faux, que faire ?",
        a: (
          <>
            Le nom est figé au moment de la délivrance. Corrigez d’abord votre nom dans {link("/compte", "Mon compte")}, puis{" "}
            {link("/contact?sujet=Attestation", "écrivez-nous")} pour que nous réémettions l’attestation.
          </>
        ),
      },
    ],
  },
  {
    title: "Compte et données",
    items: [
      {
        q: "J’ai oublié mon mot de passe.",
        a: <>Utilisez la page {link("/mot-de-passe-oublie", "Mot de passe oublié")} : vous recevrez un lien valable une heure.</>,
      },
      {
        q: "Comment modifier mon nom ou mon adresse électronique ?",
        a: <>Depuis {link("/compte", "Mon compte")}, rubrique Profil.</>,
      },
      {
        q: "Comment récupérer ou supprimer mes données ?",
        a: (
          <>
            Dans {link("/compte", "Mon compte")}, vous pouvez télécharger toutes vos données au format JSON ou supprimer
            définitivement votre compte. Le détail figure dans la {link("/confidentialite", "politique de confidentialité")}.
          </>
        ),
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Aide"
        title="Questions fréquentes"
        intro="Les réponses aux questions qu’on nous pose le plus souvent sur les parcours, les évaluations et les attestations."
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[220px_1fr] lg:py-16">
        <nav aria-label="Rubriques de la FAQ" className="hidden lg:block">
          <ul className="sticky top-24 space-y-1 text-sm">
            {GROUPS.map((g, i) => (
              <li key={g.title}>
                <a href={`#rubrique-${i}`} className="block rounded-lg px-3 py-2 text-fg-muted transition hover:bg-bg-muted hover:text-fg">
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-12">
          {GROUPS.map((g, i) => (
            <section key={g.title} id={`rubrique-${i}`} className="scroll-mt-24">
              <h2 className="label-mono mb-4 text-brand">{g.title}</h2>
              <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-bg-elevated">
                {g.items.map((item) => (
                  <details key={item.q} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-fg transition hover:bg-bg-muted [&::-webkit-details-marker]:hidden">
                      {item.q}
                      <ChevronDown className="size-4 shrink-0 text-fg-subtle transition group-open:rotate-180" aria-hidden />
                    </summary>
                    <div className="px-5 pb-5 text-[15px] leading-relaxed text-fg-muted">{item.a}</div>
                  </details>
                ))}
              </div>
            </section>
          ))}
          <div className="card flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-fg">Vous ne trouvez pas votre réponse ?</h2>
              <p className="mt-1 text-sm text-fg-muted">Notre équipe vous répond en général sous 2 jours ouvrés.</p>
            </div>
            <Link
              href="/contact"
              className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg transition hover:bg-brand-strong"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
