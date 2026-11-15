import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Cursus, accueil">
      <span className="relative flex size-8 items-center justify-center overflow-hidden rounded-lg bg-brand text-brand-fg shadow-sm">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
          <path d="M4 17.5 12 13l8 4.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 12 12 7.5 20 12" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
          <path d="M4 6.5 12 2l8 4.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
        </svg>
      </span>
      <span className="text-lg font-bold tracking-tight text-fg">Cursus</span>
    </Link>
  );
}
