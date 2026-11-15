"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export function MobileMenu({
  links,
  userName,
  children,
}: {
  links: { href: string; label: string }[];
  userName: string | null;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Referme le menu à chaque navigation
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-9 items-center justify-center rounded-lg text-fg-muted hover:bg-bg-muted hover:text-fg"
        aria-expanded={open}
        aria-controls="menu-mobile"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open && (
        <div
          id="menu-mobile"
          className="absolute inset-x-0 top-16 border-b border-border bg-bg-elevated px-4 pb-4 pt-2 shadow-card"
        >
          {userName && <p className="px-3 py-2 text-xs font-medium text-fg-subtle">Connecté : {userName}</p>}
          <nav className="flex flex-col" aria-label="Navigation mobile">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2.5 text-sm font-medium text-fg hover:bg-bg-muted">
                {link.label}
              </Link>
            ))}
            {!userName && (
              <>
                <Link href="/connexion" className="rounded-lg px-3 py-2.5 text-sm font-medium text-fg hover:bg-bg-muted">
                  Connexion
                </Link>
                <Link
                  href="/inscription"
                  className="mt-2 rounded-lg bg-brand px-3 py-2.5 text-center text-sm font-semibold text-brand-fg"
                >
                  Commencer gratuitement
                </Link>
              </>
            )}
            {children}
          </nav>
        </div>
      )}
    </div>
  );
}
