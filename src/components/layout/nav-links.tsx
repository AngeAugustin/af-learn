"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** `short` : libellé affiché sur les écrans moyens, où le libellé complet ne tient pas. */
export type NavLink = { href: string; label: string; match: string; short?: string };

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
            className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm transition-colors lg:px-3 ${
              active ? "bg-brand font-semibold text-brand-fg" : "text-fg-muted hover:bg-bg-muted hover:text-fg"
            }`}
          >
            {link.short ? (
              <>
                <span className="xl:hidden">{link.short}</span>
                <span className="hidden xl:inline">{link.label}</span>
              </>
            ) : (
              link.label
            )}
          </Link>
        );
      })}
    </nav>
  );
}
