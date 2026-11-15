"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavLink = { href: string; label: string; match: string };

/** Navigation principale en pastilles ; la rubrique active est mise en évidence. */
export function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  return (
    <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
      {links.map((link) => {
        const active = link.match === "/" ? pathname === "/" : pathname.startsWith(link.match);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              active ? "bg-brand font-semibold text-brand-fg" : "text-fg-muted hover:bg-bg-muted hover:text-fg"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
