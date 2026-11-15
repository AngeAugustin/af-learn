import type { Metadata } from "next";
import Link from "next/link";
import { Clock, HelpCircle, Mail, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/static-page";
import { getCurrentUser } from "@/lib/auth";
import { CONTACT_SUBJECTS } from "@/lib/contact";
import { SITE, isPlaceholder } from "@/lib/site";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Une question sur un parcours, une attestation ou votre compte ? Écrivez à l'équipe Cursus.",
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ sujet?: string }> }) {
  const user = await getCurrentUser();
  const { sujet } = await searchParams;
  const subject = CONTACT_SUBJECTS.find((s) => s === sujet);

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Une question ? Écrivez-nous."
        intro="Parcours, attestation, souci technique ou proposition de partenariat : nous lisons chaque message."
      />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:py-16">
        <div className="card p-6 sm:p-8">
          <ContactForm defaults={{ name: user?.name, email: user?.email, subject }} />
        </div>
        <aside className="space-y-4">
          <div className="card p-5">
            <Clock className="size-5 text-brand" aria-hidden />
            <h2 className="mt-3 font-semibold text-fg">Délai de réponse</h2>
            <p className="mt-1 text-sm leading-relaxed text-fg-muted">Nous répondons en général sous 2 jours ouvrés.</p>
          </div>
          <div className="card p-5">
            <HelpCircle className="size-5 text-brand" aria-hidden />
            <h2 className="mt-3 font-semibold text-fg">Réponse immédiate ?</h2>
            <p className="mt-1 text-sm leading-relaxed text-fg-muted">
              Les questions fréquentes sur les évaluations, les révisions et les attestations sont dans la{" "}
              <Link href="/faq" className="font-medium text-brand hover:underline">
                FAQ
              </Link>
              .
            </p>
          </div>
          <div className="card p-5">
            <ShieldCheck className="size-5 text-brand" aria-hidden />
            <h2 className="mt-3 font-semibold text-fg">Vos données</h2>
            <p className="mt-1 text-sm leading-relaxed text-fg-muted">
              Export ou suppression de compte : faites-le directement depuis{" "}
              <Link href="/compte" className="font-medium text-brand hover:underline">
                Mon compte
              </Link>
              .
            </p>
          </div>
          {!isPlaceholder(SITE.contactEmail) && (
            <div className="card p-5">
              <Mail className="size-5 text-brand" aria-hidden />
              <h2 className="mt-3 font-semibold text-fg">Par email</h2>
              <a href={`mailto:${SITE.contactEmail}`} className="mt-1 block text-sm font-medium text-brand hover:underline">
                {SITE.contactEmail}
              </a>
            </div>
          )}
          {SITE.socials.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {SITE.socials.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm text-fg-muted hover:text-brand"
                >
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
