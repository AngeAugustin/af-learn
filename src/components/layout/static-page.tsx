import type { ReactNode } from "react";
import Link from "next/link";
import { isPlaceholder } from "@/lib/site";

/** En-tête des pages institutionnelles (À propos, FAQ, Contact, pages légales). */
export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: ReactNode }) {
  return (
    <div className="relative overflow-hidden border-b border-border">
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="label-mono text-brand">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.035em] text-fg sm:text-[2.75rem]">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-fg-muted">{intro}</p>}
      </div>
    </div>
  );
}

/** Corps typographié pour les pages de texte long (pages légales). */
export function ProseBody({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="lesson prose prose-slate max-w-3xl prose-headings:font-bold prose-h2:mt-12 prose-h2:text-xl prose-p:leading-[1.75] prose-li:my-1">
        {children}
      </div>
    </div>
  );
}

/** Affiche une valeur de configuration ; les emplacements encore à compléter sont surlignés. */
export function Fill({ value }: { value: string }) {
  if (!isPlaceholder(value)) return <>{value}</>;
  return <mark className="rounded bg-accent-soft px-1 py-0.5 font-medium text-fg">{value}</mark>;
}

/** Liens croisés entre pages légales, en bas de chacune d'elles. */
export function LegalNav({ current }: { current: string }) {
  const links = [
    { href: "/mentions-legales", label: "Mentions légales" },
    { href: "/confidentialite", label: "Politique de confidentialité" },
    { href: "/conditions", label: "Conditions d'utilisation" },
  ].filter((l) => l.href !== current);
  return (
    <div className="not-prose mt-14 flex flex-wrap gap-2 border-t border-border pt-6">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="rounded-lg border border-border bg-bg-elevated px-3.5 py-2 text-sm font-medium text-fg-muted transition hover:border-brand hover:text-brand"
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}
