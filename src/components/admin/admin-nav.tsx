"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpenCheck, LayoutDashboard, Library, ScrollText, ShieldCheck, Users } from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  { href: "/admin/catalogue", label: "Catalogue", icon: Library },
  { href: "/admin/apprenants", label: "Apprenants", icon: Users },
  { href: "/admin/visites", label: "Visites", icon: BarChart3 },
  { href: "/admin/pedagogie", label: "Pédagogie", icon: BookOpenCheck },
  { href: "/admin/journal", label: "Journal", icon: ScrollText },
  { href: "/admin/admins", label: "Administrateurs", icon: ShieldCheck },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Back office" className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
      {LINKS.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              active ? "bg-brand text-brand-fg" : "text-fg-muted hover:bg-bg-muted hover:text-fg"
            }`}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
