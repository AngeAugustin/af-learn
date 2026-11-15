import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="text-6xl font-extrabold text-brand">404</p>
      <h1 className="mt-4 text-2xl font-bold text-fg">Page introuvable</h1>
      <p className="mt-3 text-fg-muted">Cette page n&apos;existe pas ou a été déplacée.</p>
      <Link href="/parcours" className="mt-8 inline-flex rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-fg hover:bg-brand-strong">
        Voir les parcours
      </Link>
    </div>
  );
}
