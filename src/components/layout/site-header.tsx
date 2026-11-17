import Link from "next/link";
import { LogOut, ShieldCheck } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "./logout-button";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";
import { NavLinks, type NavLink } from "./nav-links";

export async function SiteHeader() {
  const user = await getCurrentUser();
  const links: NavLink[] = user
    ? [
        { href: "/parcours", label: "Parcours", match: "/parcours" },
        { href: "/tableau-de-bord", label: "Tableau de bord", match: "/tableau-de-bord" },
        { href: "/revisions", label: "Révisions", match: "/revisions" },
        { href: "/verifier", label: "Vérifier une attestation", short: "Vérifier", match: "/verifier" },
      ]
    : [
        { href: "/", label: "Accueil", match: "/" },
        { href: "/parcours", label: "Parcours", match: "/parcours" },
        { href: "/#methode", label: "Méthode", match: "/#" },
        { href: "/verifier", label: "Vérifier une attestation", short: "Vérifier", match: "/verifier" },
      ];
  const initials = user
    ? user.name
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? "")
        .join("")
    : "";

  return (
    <header className="no-print sticky top-0 z-40 border-b border-border/70 bg-bg/80 shadow-[0_1px_8px_rgba(0,0,0,0.03)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-12">
        <Logo />
        <div className="flex flex-1 justify-center">
          <NavLinks links={links} />
        </div>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {user ? (
            <div className="hidden items-center gap-1 md:flex">
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-fg-muted transition hover:bg-bg-muted hover:text-brand"
                  title="Back office"
                >
                  <ShieldCheck className="size-4" aria-hidden />
                  <span className="hidden lg:inline">Admin</span>
                </Link>
              )}
              <Link
                href="/compte"
                className="flex items-center gap-2.5 rounded-lg px-1.5 py-1 transition hover:bg-bg-muted"
                title="Mon compte"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-brand-fg">
                  {initials}
                </span>
                <span className="hidden max-w-[10rem] truncate text-xs font-semibold text-fg xl:inline">{user.name}</span>
              </Link>
              <LogoutButton className="flex items-center justify-center rounded-lg p-2 text-fg-muted transition hover:bg-bg-muted hover:text-danger">
                <LogOut className="size-[18px]" aria-hidden />
              </LogoutButton>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/connexion" className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-fg-muted transition hover:text-fg">
                Connexion
              </Link>
              <Link
                href="/inscription"
                className="whitespace-nowrap rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-fg shadow-sm transition hover:bg-brand-strong active:scale-[0.99]"
              >
                Commencer<span className="hidden lg:inline"> gratuitement</span>
              </Link>
            </div>
          )}
          <MobileMenu links={links} userName={user?.name ?? null}>
            {user?.role === "admin" && (
              <Link href="/admin" className="rounded-lg px-3 py-2.5 text-sm font-medium text-fg hover:bg-bg-muted">
                Back office
              </Link>
            )}
            {user && (
              <Link href="/compte" className="rounded-lg px-3 py-2.5 text-sm font-medium text-fg hover:bg-bg-muted">
                Mon compte
              </Link>
            )}
            {user && (
              <LogoutButton className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-fg-muted hover:bg-bg-muted">
                Déconnexion
              </LogoutButton>
            )}
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
