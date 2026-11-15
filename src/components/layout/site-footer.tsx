import Link from "next/link";
import { listParcours } from "@/lib/queries";
import { Logo } from "./logo";

export async function SiteFooter() {
  const parcours = await listParcours().catch(() => []);
  return (
    <footer className="no-print mt-24 border-t border-border bg-bg-elevated">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 md:grid-cols-[1.6fr_1fr_1fr_1fr] lg:px-12">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-fg-muted">
            La plateforme pour maîtriser les métiers du numérique par la pratique : des parcours structurés, des exercices
            corrigés et une validation à chaque chapitre.
          </p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold text-fg">Parcours</h2>
          <ul className="space-y-2 text-sm text-fg-muted">
            {parcours.map((p) => (
              <li key={p.id}>
                {p.status === "published" ? (
                  <Link className="hover:text-brand" href={`/parcours/${p.slug}`}>{p.title}</Link>
                ) : (
                  <span>
                    {p.title} <span className="label-mono text-fg-subtle">· bientôt</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold text-fg">Apprendre</h2>
          <ul className="space-y-2 text-sm text-fg-muted">
            <li><Link className="hover:text-brand" href="/parcours">Tous les parcours</Link></li>
            <li><Link className="hover:text-brand" href="/tableau-de-bord">Mon tableau de bord</Link></li>
            <li><Link className="hover:text-brand" href="/inscription">Créer un compte</Link></li>
            <li><Link className="hover:text-brand" href="/connexion">Se connecter</Link></li>
            <li><Link className="hover:text-brand" href="/verifier">Vérifier une attestation</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold text-fg">Cursus</h2>
          <ul className="space-y-2 text-sm text-fg-muted">
            <li><Link className="hover:text-brand" href="/a-propos">À propos</Link></li>
            <li><Link className="hover:text-brand" href="/faq">Questions fréquentes</Link></li>
            <li><Link className="hover:text-brand" href="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-5 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-12">
          <span>© {new Date().getFullYear()} Cursus. Tous droits réservés.</span>
          <nav aria-label="Informations légales" className="flex flex-wrap gap-x-4 gap-y-1">
            <Link className="hover:text-brand" href="/mentions-legales">Mentions légales</Link>
            <Link className="hover:text-brand" href="/confidentialite">Confidentialité</Link>
            <Link className="hover:text-brand" href="/conditions">Conditions d&apos;utilisation</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
